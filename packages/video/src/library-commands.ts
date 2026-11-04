import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { REPO_ROOT } from "../../brand/src/index.ts";
import { DEFAULT_EFFORT, DEFAULT_MODEL, runAgy } from "../../tools/src/agy.ts";
import { asVideoError, VideoError } from "./errors.ts";
import {
  allNew,
  grammarEntries,
  LIBRARY_DIR,
  libraryReadme,
  loadLibrary,
  MATCH_FILE,
  MATCH_JSON_SCHEMA,
  MatchSchema,
  matchSpec,
  missingVisualFields,
  reuseShare,
  REUSE_CEILING,
  visualHash,
  type Match,
} from "./library.ts";
import { loadScript, saveScript, SCRIPT_FILE } from "./script.ts";
import type { Timeline } from "./timeline.ts";

/*
 * The commands of the library flow (docs/reel.md, "La biblioteca"):
 * video:congelar freezes the visual script, video:emparejar matches it with
 * the library through agy, video:cosechar proposes new candidates after gate B
 * and video:biblioteca writes the library's README.
 */

const SPECS = join(REPO_ROOT, ".cache/agy/specs");
const today = () => new Date().toLocaleDateString("sv-SE");

function piece(arg: string | undefined): { dir: string; name: string } {
  if (!arg) throw new VideoError("Missing the piece folder: content/<piece>");
  const dir = resolve(arg);
  if (!existsSync(join(dir, SCRIPT_FILE))) throw new VideoError(`${join(dir, SCRIPT_FILE)} does not exist`);
  return { dir, name: basename(dir) };
}

/** video:congelar: the hash of the visual script goes to video.json → visualFrozen, before anyone looks at the library. */
export function freeze(args: string[]): void {
  const { dir } = piece(args[0]);
  const script = asVideoError(() => loadScript(dir));
  const missing = missingVisualFields(script);
  if (missing.length) console.log(`Aviso: sin intent o metaphor en ${missing.join(", ")}. El emparejamiento busca por la intención de cada escena.`);
  const hash = visualHash(script);
  if (script.visualFrozen?.hash === hash) {
    console.log(`Already frozen on ${script.visualFrozen.date} (${hash}).`);
    return;
  }
  saveScript(dir, { ...script, visualFrozen: { hash, date: today() } });
  console.log(`Visual script frozen (${hash}). Now: npm run video:emparejar -- ${args[0]}`);
}

/** video:emparejar: which frozen scenes the library already covers. Writes content/<piece>/emparejar.json. */
export function match(args: string[]): void {
  const { dir, name } = piece(args[0]);
  const script = asVideoError(() => loadScript(dir));
  if (!script.visualFrozen) throw new VideoError(`Freeze the visual script first: npm run video:congelar -- ${args[0]}`);
  if (script.visualFrozen.hash !== visualHash(script)) throw new VideoError("The visual script changed after it was frozen: freeze it again (and note why in estado.md) before matching");
  const library = loadLibrary().filter((e) => !e.errors.length && e.ficha.capa === "escena" && e.ficha.estado === "biblioteca");
  let result: Match;
  if (!library.length) {
    result = allNew(script);
    console.log("The library has no scenes yet: every scene is new (agy not called).");
  } else {
    mkdirSync(SPECS, { recursive: true });
    const spec = join(SPECS, `emparejar-${name}.md`);
    const schema = join(SPECS, `emparejar.schema.json`);
    writeFileSync(spec, matchSpec(script, library.map((e) => e.ficha)));
    writeFileSync(schema, JSON.stringify(MATCH_JSON_SCHEMA, null, 2));
    const run = runAgy({ spec, scope: [], plan: true, schema, model: DEFAULT_MODEL, effort: DEFAULT_EFFORT, minutes: 10 });
    const parsed = MatchSchema.safeParse(run.answer);
    if (run.code !== 0 || !parsed.success) throw new VideoError(`agy did not match the scenes (log: ${run.log}). Match by hand or run it again.`);
    result = parsed.data;
  }
  writeFileSync(join(dir, MATCH_FILE), `${JSON.stringify({ hash: script.visualFrozen.hash, date: today(), ...result }, null, 2)}\n`);
  for (const e of result.escenas) console.log(`  ${e.escena}: ${e.veredicto}${e.candidatas.length ? ` (${e.candidatas.map((c) => c.id).join(", ")})` : ""}`);
  console.log(`Saved in ${join(dir, MATCH_FILE)}. Review it once: the visual script does not change to fit the library.`);
}

/** The share of screen time from the library, once there is a voice: printed by video:render. */
export function reuseNote(dir: string, timeline: Timeline): string | undefined {
  const file = join(dir, MATCH_FILE);
  if (!existsSync(file)) return undefined;
  const parsed = MatchSchema.safeParse(JSON.parse(readFileSync(file, "utf8")));
  if (!parsed.success) return undefined;
  const share = reuseShare(parsed.data, timeline);
  const note = `Library: ${Math.round(share * 100)} % of the screen time (ceiling ${Math.round(REUSE_CEILING * 100)} %). Write it in estado.md.`;
  return share > REUSE_CEILING ? `! ${note} Above the ceiling: check the piece is not anchored to the library.` : note;
}

/** video:cosechar: after gate B, agy proposes which new scenes of the piece could serve again, as candidates. */
export function harvest(args: string[]): void {
  const { dir, name } = piece(args[0]);
  const script = asVideoError(() => loadScript(dir));
  if (!script.gateB.approved) throw new VideoError("Harvest after gate B: only approved pieces feed the library");
  const scenesDir = join(dir, "scenes");
  const files = existsSync(scenesDir) ? readdirSync(scenesDir).filter((f) => f.endsWith(".tsx")) : [];
  if (!files.length) throw new VideoError(`${relative(REPO_ROOT, scenesDir)} has no scenes: the library harvests scenes in their own files (content/<piece>/scenes/<id>.tsx)`);
  const matched = existsSync(join(dir, MATCH_FILE)) ? MatchSchema.safeParse(JSON.parse(readFileSync(join(dir, MATCH_FILE), "utf8"))) : undefined;
  const reused = new Set(matched?.success ? matched.data.escenas.filter((e) => e.veredicto === "reutilizar" || e.veredicto === "parametros").map((e) => e.escena) : []);
  const fresh = files.filter((f) => !reused.has(f.replace(/\.tsx$/, "")));
  const existing = loadLibrary().map((e) => `${e.ficha.id} (${e.ficha.estado}): ${e.ficha.intencion}`);
  const candidates = relative(REPO_ROOT, join(LIBRARY_DIR, "candidatas")).replace(/\\/g, "/");
  mkdirSync(SPECS, { recursive: true });
  const spec = join(SPECS, `cosechar-${name}.md`);
  writeFileSync(
    spec,
    [
      `# Cosechar escenas de ${name}`,
      "",
      `Revisa las escenas nuevas de \`content/${name}/scenes/\`: ${fresh.join(", ")}. Su intención está en \`content/${name}/video.json\` (scenes[].intent).`,
      "",
      "Propón como candidata solo una escena que pueda servir en otra pieza con otro tema: sin texto ni datos del tema metidos en el código (o que se puedan pasar como parámetros). No entran el gancho, el clímax ni el mundo de la pieza (son protagonistas), lo atado al tema, ni lo que se parece mucho a una existente:",
      "",
      ...(existing.length ? existing.map((e) => `- ${e}`) : ["- (la biblioteca está vacía)"]),
      "",
      `Por cada candidata, crea \`${candidates}/<id>/\` con:`,
      "- `ficha.json` con id, capa \"escena\", intencion, usar_cuando, no_usar_cuando, parametros, duracion, etiquetas { metafora, layout, movimiento }, usos { piezas: [\"" + name + "\"], ultima: \"" + today() + "\" }, estado \"candidata\" y razon_retiro null;",
      `- \`origen.md\` con la ruta del archivo de origen y qué habría que convertir en parámetros. No copies el código todavía: se generaliza cuando una segunda pieza la necesite.`,
      "",
      `Si ninguna sirve, no crees nada y dilo en las notas. Comprobación: \`git status\`, y que cada ficha.json sea JSON válido.`,
    ].join("\n"),
  );
  const run = runAgy({ spec, scope: [candidates], plan: false, model: DEFAULT_MODEL, effort: DEFAULT_EFFORT, minutes: 15 });
  console.log(run.code === 0 ? "Review the candidates with git diff, then: npm run video:biblioteca" : `agy did not finish (log: ${run.log}).`);
  if (run.code !== 0) process.exitCode = 1;
}

/** video:biblioteca: writes packages/video/library/README.md from the grammar and the fichas, and reports broken fichas. */
export function libraryIndex(): void {
  const grammar = grammarEntries(readFileSync(join(REPO_ROOT, "packages/video/src/kit/grammar.tsx"), "utf8"));
  const entries = loadLibrary();
  mkdirSync(join(LIBRARY_DIR, "candidatas"), { recursive: true });
  const file = join(LIBRARY_DIR, "README.md");
  writeFileSync(file, `${libraryReadme(grammar, entries)}\n`);
  const broken = entries.filter((e) => e.errors.length);
  for (const b of broken) console.log(`Ficha with errors: ${b.dir}: ${b.errors.join("; ")}`);
  console.log(`${grammar.length} grammar exports, ${entries.length - broken.length} fichas. README: ${file}`);
  if (broken.length) process.exitCode = 1;
}
