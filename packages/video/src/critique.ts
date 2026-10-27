import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { REPO_ROOT } from "../../brand/src/index.ts";
import { loadBrief } from "../../carousel/src/brief.ts";
import type { ReviewRequest } from "../../media/src/review.ts";
import { filmstrips, gridCover } from "./inspector.ts";
import { estimateWords, type VideoScript } from "./script.ts";
import { timelineMs, type Timeline } from "./timeline.ts";

/**
 * The folders for the blind critic (docs/critico-ciego-video.md): only what
 * someone on Instagram would see and hear, without video.json, video.tsx or
 * the reasons behind the design. The brief goes apart, for step 2.
 */

export const STRIP_EVERY_SECONDS = 2;
const PER_STRIP = 6;

const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

/** Which seconds each filmstrip shows: one frame every STRIP_EVERY_SECONDS, six per strip. */
export function stripCoverage(totalMs: number): Array<{ file: string; from: number; to: number }> {
  const frames = Math.floor(totalMs / 1000 / STRIP_EVERY_SECONDS) + 1;
  const strips: Array<{ file: string; from: number; to: number }> = [];
  for (let first = 0; first < frames; first += PER_STRIP) {
    const last = Math.min(first + PER_STRIP, frames) - 1;
    strips.push({ file: `tira-${String(strips.length + 1).padStart(2, "0")}.png`, from: first * STRIP_EVERY_SECONDS, to: last * STRIP_EVERY_SECONDS });
  }
  return strips;
}

/** What is heard: the script as the voice said it, with the second each scene starts, then music and effects. */
export function transcript(script: VideoScript, timeline: Timeline): string {
  const lines = ["# Lo que se oye", "", "La voz es sintética, y el Reel lleva la etiqueta de IA de Instagram.", ""];
  const effects: string[] = [];
  let offset = 0;
  for (const scene of timeline.scenes) {
    const said = script.scenes.find((s) => s.id === scene.id)?.say ?? scene.words.map((w) => w.text).join(" ");
    lines.push(`**${clock((offset + (scene.words[0]?.startMs ?? 0)) / 1000)}** ${said}`, "");
    for (const sfx of scene.sfx) effects.push(`- ${clock((offset + sfx.atMs) / 1000)}: un efecto de sonido (${basename(sfx.src).replace(/\.[^.]+$/, "")})`);
    offset += scene.durationMs;
  }
  lines.push(`Termina en ${clock(offset / 1000)}.`, "");
  if (timeline.music) lines.push("Debajo de la voz hay una música de fondo, que baja mientras se habla.", "");
  if (effects.length) lines.push("Efectos de sonido:", "", ...effects, "");
  return lines.join("\n");
}

function section(doc: string, title: string): string {
  const found = readFileSync(join(REPO_ROOT, doc), "utf8")
    .split(/^## /m)
    .find((s) => s.startsWith(title));
  return found ? `## ${found}` : "";
}

function topicOf(dir: string): string {
  return basename(dir).replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

/**
 * Gate A: the topic, the audience and the hooks (what the voice says and what
 * is read on screen), without scores or formulas. Sorted by what is said, so
 * the first one in the list is not always the chosen one.
 */
export function writeHookCritic(dir: string, script: VideoScript): string {
  const folder = join(dir, "out", "video-critica-ganchos");
  rmSync(folder, { recursive: true, force: true });
  mkdirSync(folder, { recursive: true });
  const brief = loadBrief(dir);
  const hooks = [...script.hooks].sort((a, b) => a.said.localeCompare(b.said, "es"));
  const file = join(folder, "LEEME.md");
  writeFileSync(
    file,
    [
      "# Crítico ciego: ganchos del video",
      "",
      section("docs/critico-ciego-video.md", "Ganchos"),
      "## Material",
      "",
      `- Tema: ${topicOf(dir)}`,
      `- Público: ${brief.status === "ok" ? brief.brief.paraQuien : "sin brief: juzga para alguien que programa"}`,
      "",
      "Ganchos:",
      "",
      ...hooks.map((h, i) => `${i + 1}. La voz dice "${h.said}" y en pantalla se lee "${h.onScreen}".`),
      "",
      "Escribe tu respuesta en `informe.md`, en esta misma carpeta.",
      "",
    ].join("\n"),
  );
  return file;
}

/** After video:render: out/video-critica/ with the video, filmstrips, the cover, what is heard and the post text. */
export function prepareCritique(dir: string, script: VideoScript, timeline: Timeline, ffmpeg: string): { folder: string; files: string[] } {
  const out = join(dir, "out");
  const preview = join(out, "video.mp4");
  for (const needed of [preview, join(out, "video-hoja.png")]) {
    if (!existsSync(needed)) throw new Error(`Primero renderiza la pieza: falta ${needed}`);
  }
  const folder = join(out, "video-critica");
  rmSync(folder, { recursive: true, force: true });
  mkdirSync(folder, { recursive: true });

  copyFileSync(preview, join(folder, "video.mp4"));
  copyFileSync(join(out, "video-hoja.png"), join(folder, "hoja.png"));
  gridCover(ffmpeg, join(out, "video.mp4"), join(folder, "grilla.png"));
  filmstrips(ffmpeg, preview, STRIP_EVERY_SECONDS * timeline.fps, join(folder, "tira-%02d.png"));
  writeFileSync(join(folder, "transcripcion.md"), transcript(script, timeline));
  if (script.caption) writeFileSync(join(folder, "texto-del-post.txt"), `${script.caption}\n`);

  const strips = stripCoverage(timelineMs(timeline)).filter((s) => existsSync(join(folder, s.file)));
  const prompt = readFileSync(join(REPO_ROOT, "docs/critico-ciego-video.md"), "utf8");
  const rubric = readFileSync(join(REPO_ROOT, "docs/critica-video.md"), "utf8");
  writeFileSync(
    join(folder, "LEEME.md"),
    [
      prompt,
      "---",
      "",
      rubric,
      "---",
      "",
      "## Material de este video",
      "",
      `- El video, tal como se sube: video.mp4 (${clock(timelineMs(timeline) / 1000)})`,
      `- Un cuadro cada ${STRIP_EVERY_SECONDS} s, en tiras de ${PER_STRIP}:`,
      ...strips.map((s) => `  - ${s.file}: de ${clock(s.from)} a ${clock(s.to)}`),
      "- La portada y el final de cada parte: hoja.png",
      "- La portada en la grilla del perfil: grilla.png",
      "- Lo que se oye, con el segundo en que empieza cada parte: transcripcion.md",
      script.caption ? "- Texto del post: texto-del-post.txt" : "- Este video no tiene texto del post todavía.",
      "",
      "No abras `paso-2-brief.md` hasta terminar el paso 1. Escribe tu informe en `informe.md`, en esta carpeta.",
      "",
    ].join("\n"),
  );

  writeBriefStep(dir, folder);
  return { folder, files: readdirSync(folder) };
}

function writeBriefStep(dir: string, folder: string): void {
  const load = loadBrief(dir);
  writeFileSync(
    join(folder, "paso-2-brief.md"),
    load.status === "ok"
      ? `# Lo que el video quería decir\n\n- **Tesis:** ${load.brief.tesis}\n- **Para quién:** ${load.brief.paraQuien}\n- **Objetivo:** ${load.brief.objetivo}\n- **Se lo mandaría a:** ${load.brief.compartirCon}\n\nCompara con tu resumen del paso 1. Si no coinciden, el video no pasa.\n`
      : `# Sin brief\n\nEsta pieza no tiene brief (${basename(dir)}). Juzga la tesis solo con lo que entendiste en el paso 1.\n`,
  );
}

/** The pause video:prepare leaves after the last word of a scene (cli.ts, TAIL_MS). */
const SCENE_PAUSE_MS = 300;

/**
 * The script as someone would live it, for the script critic before gate A:
 * the hook on screen, and per scene its estimated start, what is heard and what
 * is seen. No ids, resources or reasons.
 */
export function scriptSheet(script: VideoScript): string {
  const lines = ["# El guion", "", "Los segundos son estimados, al ritmo de la voz de la cuenta.", "", `En pantalla desde el cuadro 1: "${script.hooks[0].onScreen}"`, ""];
  let offset = 0;
  for (const scene of script.scenes) {
    lines.push(`**${clock(offset / 1000)}** Se oye: ${scene.say}`, `Se ve: ${scene.see}`, "");
    offset += (estimateWords(scene.say).at(-1)?.endMs ?? 0) + SCENE_PAUSE_MS;
  }
  lines.push(`Termina cerca de ${clock(offset / 1000)}.`, "");
  return lines.join("\n");
}

/** Before gate A: out/video-critica-guion/ with the script, the storyboard sheet if there is one and the post text. */
export function prepareScriptCritique(dir: string, script: VideoScript): { folder: string; files: string[] } {
  const folder = join(dir, "out", "video-critica-guion");
  rmSync(folder, { recursive: true, force: true });
  mkdirSync(folder, { recursive: true });
  writeFileSync(join(folder, "guion.md"), scriptSheet(script));
  const storyboard = join(dir, "out", "storyboard.png");
  if (existsSync(storyboard)) copyFileSync(storyboard, join(folder, "storyboard.png"));
  if (script.caption) writeFileSync(join(folder, "texto-del-post.txt"), `${script.caption}\n`);
  const rubric = readFileSync(join(REPO_ROOT, "docs/critica-video.md"), "utf8");
  writeFileSync(
    join(folder, "LEEME.md"),
    [
      "# Crítico ciego: el guion del video",
      "",
      section("docs/critico-ciego-video.md", "Guion"),
      "---",
      "",
      rubric,
      "---",
      "",
      "## Material de este guion",
      "",
      "- Lo que se oye y lo que se ve, escena por escena: guion.md",
      existsSync(storyboard) ? "- Los visuales sin voz (la portada y el final de cada parte): storyboard.png" : "- Todavía no hay storyboard.",
      script.caption ? "- Texto del post: texto-del-post.txt" : "- Este video no tiene texto del post todavía.",
      "",
      "No abras `paso-2-brief.md` hasta terminar el paso 1. Escribe tu informe en `informe.md`, en esta carpeta.",
      "",
    ].join("\n"),
  );
  writeBriefStep(dir, folder);
  return { folder, files: readdirSync(folder) };
}

const MIME: Record<string, string> = { ".mp4": "video/mp4", ".png": "image/png", ".md": "text/markdown", ".txt": "text/plain" };

/**
 * A critic folder as one request for a model that watches (video:critique
 * --gemini): LEEME.md is the prompt; the video goes first, then the images,
 * then the texts, and the brief last. The strips are left out: the model sees
 * the whole video.
 */
export function reviewRequest(folder: string): ReviewRequest {
  const rank = (name: string) => (name === "paso-2-brief.md" ? 3 : MIME[extname(name)]?.startsWith("video/") ? 0 : MIME[extname(name)]?.startsWith("image/") ? 1 : 2);
  const names = readdirSync(folder)
    .filter((name) => MIME[extname(name)] && !["LEEME.md", "informe.md"].includes(name) && !/^tira-\d+\.png$/.test(name))
    .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
  const prompt = [
    "No tienes acceso a archivos: el material va adjunto, en este orden:",
    ...names.map((name, i) => `${i + 1}. ${name}`),
    "",
    "Los textos llegan con su nombre arriba. Si hay un video, lo ves y lo oyes entero: no hacen falta las tiras de cuadros que nombra el texto. Escribe el paso 1 sin usar paso-2-brief.md. Responde solo con el informe, en español y con el formato de la rúbrica.",
    "",
    "---",
    "",
    readFileSync(join(folder, "LEEME.md"), "utf8"),
  ].join("\n");
  return { prompt, files: names.map((name) => ({ path: join(folder, name), mimeType: MIME[extname(name)] })) };
}
