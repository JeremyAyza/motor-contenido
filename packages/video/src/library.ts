import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { REPO_ROOT } from "../../brand/src/index.ts";
import type { VideoScript } from "./script.ts";
import type { Timeline } from "./timeline.ts";

/*
 * The scene library, "creative first" (docs/plan-velocidad-reels.md, Fase 4).
 * The script and the visual script are written from scratch and frozen
 * (video:congelar) before anyone looks here. Then video:emparejar asks agy which
 * frozen scenes an existing one already covers; the visual script never changes
 * to fit the library. After gate B, video:cosechar proposes new candidates.
 */

export const LIBRARY_DIR = join(REPO_ROOT, "packages/video/library");
export const MATCH_FILE = "emparejar.json";
/** Proposed ceiling of screen time that comes from the library: above it, the piece may be anchored. */
export const REUSE_CEILING = 0.5;

export const FichaSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  capa: z.enum(["gramatica", "escena"]),
  intencion: z.string().min(10).describe("What the audience understands thanks to it"),
  usar_cuando: z.string().min(10),
  no_usar_cuando: z.string().min(10),
  parametros: z.array(z.string()),
  duracion: z.string().describe('"4 a 12 s"'),
  etiquetas: z.object({ metafora: z.string(), layout: z.string(), movimiento: z.string() }),
  usos: z.object({ piezas: z.array(z.string()), ultima: z.string() }),
  critico: z.number().min(1).max(5).optional().describe("Score of the scene in its piece of origin"),
  costo: z.object({ lineas: z.number(), ms_por_cuadro: z.number().optional() }).optional(),
  estado: z.enum(["candidata", "biblioteca", "retirada"]),
  razon_retiro: z.string().nullable().optional(),
});
export type Ficha = z.infer<typeof FichaSchema>;

/** Every ficha.json under the library and its candidates, with the folder it is in. */
export function loadLibrary(root = LIBRARY_DIR): { ficha: Ficha; dir: string; errors: string[] }[] {
  const found: { ficha: Ficha; dir: string; errors: string[] }[] = [];
  for (const base of [root, join(root, "candidatas")]) {
    if (!existsSync(base)) continue;
    for (const name of readdirSync(base).sort()) {
      const file = join(base, name, "ficha.json");
      if (!existsSync(file)) continue;
      const parsed = FichaSchema.safeParse(JSON.parse(readFileSync(file, "utf8")));
      if (parsed.success) found.push({ ficha: parsed.data, dir: join(base, name), errors: [] });
      else found.push({ ficha: { id: name } as Ficha, dir: join(base, name), errors: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) });
    }
  }
  return found;
}

/** What the visual script is: per scene what is seen, the resource, the intent, the metaphor and the motion, plus the world. */
export function visualScript(script: VideoScript) {
  return {
    world: script.world ?? null,
    scenes: script.scenes.map((s) => ({ id: s.id, see: s.see, resource: s.resource, intent: s.intent ?? null, metaphor: s.metaphor ?? null, motion: s.motion ?? null })),
  };
}

export const visualHash = (script: VideoScript): string => createHash("sha256").update(JSON.stringify(visualScript(script))).digest("hex").slice(0, 16);

/** Warnings about the frozen visual script: it changed after freezing, or scenes lack their intent and metaphor. */
export function freezeWarnings(script: VideoScript): string[] {
  const warnings: string[] = [];
  if (script.visualFrozen && script.visualFrozen.hash !== visualHash(script)) {
    warnings.push(`El guion visual cambió después de congelarlo (${script.visualFrozen.date}). Si fue por la biblioteca, es anclaje: vuelve al guion congelado. Si fue por otra razón, anótala en estado.md y congela de nuevo`);
  }
  return warnings;
}

export function missingVisualFields(script: VideoScript): string[] {
  return script.scenes.filter((s) => !s.intent || !s.metaphor).map((s) => s.id);
}

export const VERDICTS = ["nueva", "reutilizar", "parametros", "adaptar"] as const;

export const MatchSchema = z.object({
  escenas: z.array(
    z.object({
      escena: z.string(),
      veredicto: z.enum(VERDICTS),
      candidatas: z.array(z.object({ id: z.string(), razon: z.string() })).max(3),
      parametros: z.string().optional(),
    }),
  ),
});
export type Match = z.infer<typeof MatchSchema>;

/** The schema agy answers with (agy --json-schema). */
export const MATCH_JSON_SCHEMA = z.toJSONSchema(MatchSchema);

/** Without a library there is nothing to match: every scene is new, and agy is not called. */
export const allNew = (script: VideoScript): Match => ({ escenas: script.scenes.map((s) => ({ escena: s.id, veredicto: "nueva", candidatas: [] })) });

/** The spec agy gets to match the frozen visual script against the fichas, as text only. */
export function matchSpec(script: VideoScript, fichas: Ficha[]): string {
  const visual = visualScript(script);
  return [
    "# Emparejar el guion visual con la biblioteca",
    "",
    "Compara cada escena del guion visual congelado con las fichas de la biblioteca. No propongas cambiar el guion: la escena manda, y la biblioteca solo sirve si cumple su intención tal cual.",
    "",
    "Para cada escena, un veredicto:",
    "- `nueva`: ninguna ficha cumple su intención. Es el veredicto por defecto ante la duda.",
    "- `reutilizar`: una ficha la cumple tal cual.",
    "- `parametros`: una ficha la cumple cambiando sus parámetros (di cuáles en `parametros`).",
    "- `adaptar`: una ficha sirve de base, pero hay que copiarla a la pieza y cambiarla.",
    "",
    "Busca por `intencion`, `usar_cuando` y `no_usar_cuando`; si la escena cae en `no_usar_cuando`, es `nueva`. Da de 0 a 3 candidatas por escena, con la razón en una frase. No leas código ni capturas: solo este texto.",
    "",
    "## El guion visual congelado",
    "",
    "```json",
    JSON.stringify(visual, null, 2),
    "```",
    "",
    "## Las fichas",
    "",
    "```json",
    JSON.stringify(
      fichas.map((f) => ({ id: f.id, intencion: f.intencion, usar_cuando: f.usar_cuando, no_usar_cuando: f.no_usar_cuando, parametros: f.parametros, duracion: f.duracion, etiquetas: f.etiquetas })),
      null,
      2,
    ),
    "```",
  ].join("\n");
}

/** Share of the screen time that comes from the library (every verdict except "nueva"). */
export function reuseShare(match: Match, timeline: Timeline): number {
  const total = timeline.scenes.reduce((sum, s) => sum + s.durationMs, 0);
  if (!total) return 0;
  const reused = new Set(match.escenas.filter((e) => e.veredicto !== "nueva").map((e) => e.escena));
  return timeline.scenes.filter((s) => reused.has(s.id)).reduce((sum, s) => sum + s.durationMs, 0) / total;
}

/** The exports of the grammar with the first line of their doc comment, read from the source. */
export function grammarEntries(source: string): { name: string; doc: string }[] {
  const entries: { name: string; doc: string }[] = [];
  const pattern = /\/\*\*([\s\S]*?)\*\/\s*export (?:const|function|type) (\w+)/g;
  for (const match of source.matchAll(pattern)) {
    const doc = match[1]
      .split("\n")
      .map((l) => l.replace(/^\s*\*\s?/, "").trim())
      .filter(Boolean)
      .join(" ");
    entries.push({ name: match[2], doc });
  }
  return entries;
}

/** packages/video/library/README.md: the grammar and the active scenes, generated from the code and the fichas. */
export function libraryReadme(grammar: { name: string; doc: string }[], entries: { ficha: Ficha; dir: string; errors: string[] }[]): string {
  const active = entries.filter((e) => !e.errors.length && e.ficha.estado === "biblioteca");
  const candidates = entries.filter((e) => !e.errors.length && e.ficha.estado === "candidata");
  const retired = entries.filter((e) => !e.errors.length && e.ficha.estado === "retirada");
  const broken = entries.filter((e) => e.errors.length);
  const lines = [
    "# La biblioteca de video",
    "",
    "Generado por `npm run video:biblioteca`. No lo edites a mano: cambia `packages/video/src/kit/grammar.tsx` o las `ficha.json`.",
    "",
    "Tres capas ([docs/reel.md](../../../docs/reel.md), \"La biblioteca\"):",
    "- **La gramática** (`@motor/video`): cómo se mueven las cosas. Se usa siempre y no ancla, porque no dice qué mostrar.",
    "- **Las escenas**: sacadas de piezas aprobadas, con parámetros. Se miran solo después de congelar el guion visual (`video:congelar`), y las empareja `video:emparejar`.",
    "- **Las protagonistas** (el gancho, el clímax y el mundo): nunca vienen de aquí.",
    "",
    "## La gramática",
    "",
    "| Export | Qué hace |",
    "|---|---|",
    ...grammar.map((g) => `| \`${g.name}\` | ${g.doc.replace(/\|/g, "\\|")} |`),
    "",
    `## Escenas (${active.length})`,
    "",
  ];
  if (!active.length) lines.push("Ninguna todavía. Una candidata pasa aquí cuando una segunda pieza la necesita o Jeremy la marca.", "");
  for (const { ficha } of active) {
    lines.push(`### ${ficha.id}`, "", `- **Intención:** ${ficha.intencion}`, `- **Usar cuando:** ${ficha.usar_cuando}`, `- **No usar cuando:** ${ficha.no_usar_cuando}`, `- **Parámetros:** ${ficha.parametros.join(", ")}`, `- **Duración:** ${ficha.duracion}. Usos: ${ficha.usos.piezas.length} (última: ${ficha.usos.ultima})`, "");
  }
  lines.push(`## Candidatas (${candidates.length})`, "", ...(candidates.length ? candidates.map(({ ficha }) => `- \`${ficha.id}\`: ${ficha.intencion} (de ${ficha.usos.piezas.join(", ")})`) : ["Ninguna todavía. `video:cosechar` las propone después de la puerta B."]), "");
  if (retired.length) lines.push(`## Retiradas (${retired.length})`, "", ...retired.map(({ ficha }) => `- \`${ficha.id}\`: ${ficha.razon_retiro ?? "sin razón"}`), "");
  if (broken.length) lines.push("## Fichas con errores", "", ...broken.map((b) => `- \`${b.dir}\`: ${b.errors.join("; ")}`), "");
  return lines.join("\n");
}
