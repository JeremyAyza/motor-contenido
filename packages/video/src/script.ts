import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { ArtSchema, type Art } from "../../carousel/src/post.ts";
import { nombreRecurso, RECURSO_IDS } from "../../carousel/src/recursos.ts";
import type { WordTiming } from "../../media/src/speech.ts";
import { normalizeWord, scriptWords } from "../../media/src/words.ts";

/**
 * The script of a video (content/<piece>/video.json): hooks, what the voice
 * says and what is seen in each scene, and the two human gates. The person
 * approves it at gate A before the voice is generated, and the final video
 * at gate B. Only a yes in the chat approves; the agent writes it here.
 */

export const HookSchema = z.object({
  said: z.string().trim().min(3).describe("The first line of the voice"),
  onScreen: z.string().trim().min(2).max(60).describe("The hook text, visible from frame 1; 6 words or fewer"),
  formula: z.number().int().min(1).max(30).describe("Formula id from skills/ig-es/ganchos-es.json"),
});

/**
 * What is at stake, shown by the HUD meter (`defineVideo({ meter })`) from
 * the hook to the close: "servers exposed", from "1" to "50 millones".
 */
export const MeterSchema = z.object({
  label: z.string().trim().min(2).max(32).describe("What the meter counts, in 1 to 4 words"),
  from: z.string().trim().min(1).max(24).describe("Its value at the hook"),
  to: z.string().trim().min(1).max(24).describe("Its value at the close, where the video pays it off"),
});

/** The frame that becomes the cover (the profile grid shows it): the strongest one, settled. */
export const CoverSchema = z.object({
  scene: z.string().regex(/^[a-z0-9-]+$/).describe("The scene id"),
  at: z.number().min(0).optional().describe("Seconds from the start of the scene. Without it, the end of the scene, when it is complete"),
});

export const ScriptSceneSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "Lowercase letters, digits and dashes"),
  say: z.string().trim().min(3).describe("What the voice says, written for the ear. The voice says exactly this"),
  see: z.string().trim().min(10).describe("What is seen, concrete: 'a lamp throwing rays that never reach the eye', not 'a diagram'"),
  resource: z.enum(RECURSO_IDS).describe("The visual resource of the scene (skills/carrusel-taste/recursos.json)"),
});

export const GateSchema = z.object({
  approved: z.boolean(),
  date: z.iso.date().optional(),
  notes: z.string().trim().optional(),
});

export const GateBSchema = GateSchema.extend({
  video: z
    .string()
    .regex(/^[0-9a-f]{64}$/)
    .optional()
    .describe("sha256 of the out/video.mp4 the person approved (video:render prints it). If the video changes, the gate goes back to false"),
});

/**
 * How long a video should last, by format: "corto" is the 30 to 60 s
 * explainer of the pilot; "explicado" is the format of docs/propuesta-reels-jacket.md
 * ("un segundo por dentro"), on trial at 75 to 100 s until the metrics decide.
 */
export const FORMAT_SECONDS = { corto: [30, 60], explicado: [75, 100], largo: [90, 180] } as const satisfies Record<string, readonly [number, number]>;
export type VideoFormat = keyof typeof FORMAT_SECONDS;

export const VideoScriptSchema = z
  .object({
    $schema: z.string().optional(),
    format: z
      .enum(Object.keys(FORMAT_SECONDS) as [VideoFormat, ...VideoFormat[]])
      .default("corto")
      .describe("The format, which sets the length the gate A sheet and the inspector check: corto (30 to 60 s), explicado (75 to 100 s, on trial) or largo (90 to 180 s, an explainer of several points with something changing every second, docs/plan-paridad-rick.md)"),
    topic: z
      .string()
      .trim()
      .min(3)
      .max(120)
      .optional()
      .describe("What the video is about, in a few words. video:script warns if a piece of the last 14 days had a similar topic"),
    world: z
      .string()
      .trim()
      .min(10)
      .max(200)
      .optional()
      .describe(
        "The physical metaphor that lasts the whole video, in one line: 'a three-floor building in cutaway: your app, the PHP runtime and the server; the crack is in the middle floor'. The stage of video.tsx draws it",
      ),
    meter: MeterSchema.optional().describe("What is at stake, planted at the hook and paid off at the close"),
    cover: CoverSchema.optional().describe("The frame for the cover. Without it, frame 1"),
    target: z
      .number()
      .min(5)
      .max(600)
      .optional()
      .describe("Seconds the video should last: the length of the Reel it replicates. video:script and the inspector warn when it is more than 10% off; scenes can hold silent beats (SceneDef.hold) to get there"),
    hooks: z.array(HookSchema).min(1).max(3).describe("The first is the chosen one; the others are alternatives for gate A"),
    scenes: z.array(ScriptSceneSchema).min(1),
    caption: z.string().trim().max(2200).optional().describe("The post text"),
    art: ArtSchema.optional().describe(
      "The art direction, like post.json → art: direction dealt by video:baraja, palette, fonts, anchor and tab. Without it, the piece's post.json → art, so the Reel looks like its carousel",
    ),
    gateA: GateSchema.default({ approved: false }).describe("Hooks, script and storyboard. Without it, video:prepare does not generate the voice"),
    gateB: GateBSchema.default({ approved: false }).describe("The final video. Without it, nothing is published"),
  })
  .superRefine((script, ctx) => {
    const seen = new Set<string>();
    script.scenes.forEach((scene, i) => {
      if (seen.has(scene.id)) ctx.addIssue({ code: "custom", message: `Repeated scene id "${scene.id}"`, path: ["scenes", i, "id"] });
      seen.add(scene.id);
    });
    if (script.cover && !seen.has(script.cover.scene)) {
      ctx.addIssue({ code: "custom", message: `cover.scene "${script.cover.scene}" is not a scene of the script`, path: ["cover", "scene"] });
    }
    const hook = scriptWords(script.hooks[0].said).map(normalizeWord);
    const opening = scriptWords(script.scenes[0].say).map(normalizeWord).slice(0, hook.length);
    if (hook.join(" ") !== opening.join(" ")) {
      ctx.addIssue({ code: "custom", message: "The first scene has to start with the chosen hook (hooks[0].said)", path: ["scenes", 0, "say"] });
    }
  });
export type VideoScript = z.infer<typeof VideoScriptSchema>;

export const SCRIPT_FILE = "video.json";

export function loadScript(dir: string): VideoScript {
  const path = join(dir, SCRIPT_FILE);
  if (!existsSync(path)) throw new Error(`${path} does not exist: the script comes before video.tsx (workflows/video.md)`);
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`${SCRIPT_FILE} is not valid JSON: ${(error as Error).message}`);
  }
  const parsed = VideoScriptSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => `${SCRIPT_FILE} → ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n"));
  }
  return parsed.data;
}

export function saveScript(dir: string, script: VideoScript): void {
  writeFileSync(join(dir, SCRIPT_FILE), JSON.stringify(script, null, 2) + "\n");
}

/**
 * The art direction of a video and the file it came from: video.json → art,
 * or the carousel's post.json → art when the piece has one, so the Reel looks
 * like its carousel. Like the carousel, every piece has its own: the frame
 * (tab, dots and signature) is the only thing all of them share.
 */
export function artOf(dir: string, script: VideoScript): { art: Art; from: string } {
  if (script.art) return { art: script.art, from: SCRIPT_FILE };
  const post = join(dir, "post.json");
  if (!existsSync(post)) {
    throw new Error(
      `${SCRIPT_FILE} → art is missing and there is no post.json. Deal directions with npm run video:baraja -- <piece> and write art: direction, dealt, reason, palette, fonts, anchor and tab`,
    );
  }
  const parsed = ArtSchema.safeParse(JSON.parse(readFileSync(post, "utf8")).art);
  if (!parsed.success) throw new Error(parsed.error.issues.map((i) => `post.json → art.${i.path.join(".")}: ${i.message}`).join("\n"));
  return { art: parsed.data, from: "post.json" };
}

/** The text of the frame's tab, as in the carousel: art.tab, or the topic of the folder + .md. */
export const tabOf = (art: Art, piece: string) => art.tab ?? `${piece.replace(/^\d{4}-\d{2}-\d{2}-/, "")}.md`;

/**
 * Measured on the ray tracing pilot with the account voice (Puck with a calm
 * style): 162 words in 59.6 s, counting the pauses between sentences and the
 * tail of each scene. About 163 words per minute.
 */
export const WORDS_PER_SECOND = 2.7;
export const estimateSeconds = (text: string) => scriptWords(text).length / WORDS_PER_SECOND;

/**
 * Word timings at the account's pace, for the storyboard (video:storyboard),
 * before there is a voice: one word every 1/WORDS_PER_SECOND s. Captions and
 * useCue work with them as with the real ones.
 */
export function estimateWords(say: string): WordTiming[] {
  const step = 1000 / WORDS_PER_SECOND;
  return say
    .split(/\s+/)
    .filter(Boolean)
    .map((text, i) => ({ text, startMs: Math.round(i * step), endMs: Math.round((i + 0.85) * step) }));
}

const HOOK_MAX_SECONDS = 3;
const ON_SCREEN_MAX_WORDS = 6;

/**
 * What the schema cannot say: timing and length, estimated from the words.
 * In Spanish, because they go into the sheet the person reads at gate A.
 */
/** How far a length is from its target, when it is more than 10% off ("12% menos"); empty when it is within. */
export function targetOff(seconds: number, target: number): string {
  const ratio = (seconds - target) / target;
  if (Math.abs(ratio) <= 0.1) return "";
  return `${Math.round(Math.abs(ratio) * 100)}% ${ratio < 0 ? "menos" : "más"}`;
}

export function scriptWarnings(script: VideoScript): string[] {
  const warnings: string[] = [];
  const [hook] = script.hooks;
  const hookSeconds = estimateSeconds(hook.said);
  if (hookSeconds > HOOK_MAX_SECONDS) warnings.push(`El gancho tarda unos ${hookSeconds.toFixed(1)} s en decirse: tiene que entrar en ${HOOK_MAX_SECONDS} s`);
  script.hooks.forEach((h, i) => {
    const words = scriptWords(h.onScreen).length;
    if (words > ON_SCREEN_MAX_WORDS) warnings.push(`El gancho ${i + 1} tiene ${words} palabras en pantalla: ${ON_SCREEN_MAX_WORDS} o menos`);
  });
  const total = script.scenes.reduce((sum, s) => sum + estimateSeconds(s.say), 0);
  const [min, max] = FORMAT_SECONDS[script.format];
  if (total < min || total > max) {
    warnings.push(`Dura unos ${Math.round(total)} s: el formato ${script.format} va de ${min} a ${max} s`);
  }
  // A replica follows its reference's length (docs/direccion-reels.md), not the format's default.
  if (script.target !== undefined) {
    if (script.target < min || script.target > max) warnings.push(`El objetivo de ${script.target} s no entra en el formato ${script.format} (${min} a ${max} s): elige el formato que le toca a la referencia`);
    const off = targetOff(total, script.target);
    if (off) warnings.push(`La voz dura unos ${Math.round(total)} s y el objetivo es ${script.target} s (${off}): suma o quita frases, o deja pausas sin voz con hold en video.tsx`);
  }
  // docs/analisis-reels-2026-10-22.md: the Reels that work keep one world and one meter for the whole video.
  if (!script.world) warnings.push("Falta world: la metáfora física que dura todo el video (un edificio en corte, una ciudad, un plano que crece)");
  if (!script.meter) warnings.push("Falta meter: lo que está en juego, que se planta en el gancho y se paga en el cierre");
  if (!script.cover) warnings.push("Falta cover: sin él, la portada es el cuadro 1 y no el cuadro más fuerte del video");
  return warnings;
}

const status = (gate: { approved: boolean; date?: string }) => (gate.approved ? `aprobada${gate.date ? ` el ${gate.date}` : ""}` : "pendiente");

/**
 * The sheet the person reads at gate A (out/gate-a.md). Content in Spanish, like the pieces.
 * `hookScores` are hookscore_es's, in the order of the hooks; missing when there is no Python.
 */
export function gateASheet(piece: string, script: VideoScript, warnings: string[], hookScores?: Array<{ score: number; verdict: string }>): string {
  const total = script.scenes.reduce((sum, s) => sum + estimateSeconds(s.say), 0);
  const cell = (text: string) => text.replace(/\|/g, "\\|").replace(/\n/g, " ");
  const scoreOf = (i: number) => (hookScores?.[i] ? `, hookscore ${Math.round(hookScores[i].score)} ${hookScores[i].verdict}` : "");
  const lines = [
    `# Puerta A del video: ${piece}`,
    "",
    `Estado: ${status(script.gateA)}. Se aprueban el gancho, el guion y lo que se ve en cada escena. La voz se genera después del sí.`,
    "",
    "## Gancho",
    "",
    ...script.hooks.map((h, i) => `${i + 1}. ${i === 0 ? "**Elegido:** " : ""}dice "${h.said}" y en pantalla "${h.onScreen}" (fórmula ${h.formula}${scoreOf(i)})`),
    "",
    "## Mundo",
    "",
    `- **Mundo:** ${script.world ?? "falta"}`,
    `- **Lo que está en juego:** ${script.meter ? `${script.meter.label}, de ${script.meter.from} a ${script.meter.to}` : "falta"}`,
    `- **Portada:** ${script.cover ? `escena ${script.cover.scene}${script.cover.at === undefined ? ", al final" : `, a los ${script.cover.at} s`}` : "el cuadro 1"}`,
    "",
    `## Guion (unos ${Math.round(total)} s)`,
    "",
    "| Escena | Dice | Se ve | Recurso | Duración |",
    "|---|---|---|---|---|",
    ...script.scenes.map((s) => `| ${s.id} | ${cell(s.say)} | ${cell(s.see)} | ${nombreRecurso(s.resource)} | ${estimateSeconds(s.say).toFixed(1)} s |`),
    "",
  ];
  if (script.caption) lines.push("## Texto del post", "", script.caption, "");
  lines.push("## Avisos", "", ...(warnings.length ? warnings.map((w) => `- ${w}`) : ["Sin avisos."]), "");
  return lines.join("\n");
}

/**
 * Gate B belongs to one video file: if the render produced a different file,
 * the approval no longer applies and goes back to false.
 */
export function checkGateB(script: VideoScript, videoSha256: string): { script: VideoScript; reset: boolean } {
  const { gateB } = script;
  if (!gateB.approved || gateB.video === videoSha256) return { script, reset: false };
  const notes = `El video cambió después de la aprobación${gateB.date ? ` del ${gateB.date}` : ""}: hay que volver a aprobarlo.`;
  return { script: { ...script, gateB: { approved: false, notes } }, reset: true };
}
