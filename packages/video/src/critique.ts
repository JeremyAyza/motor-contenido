import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { REPO_ROOT } from "../../brand/src/index.ts";
import { loadBrief } from "../../carousel/src/brief.ts";
import { filmstrips, gridCover } from "./inspector.ts";
import type { VideoScript } from "./script.ts";
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
  const preview = join(out, "video-vista-instagram.mp4");
  for (const needed of [preview, join(out, "video.mp4"), join(out, "video-hoja.png")]) {
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
      `- El video, con la interfaz de Instagram encima: video.mp4 (${clock(timelineMs(timeline) / 1000)})`,
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

  const load = loadBrief(dir);
  writeFileSync(
    join(folder, "paso-2-brief.md"),
    load.status === "ok"
      ? `# Lo que el video quería decir\n\n- **Tesis:** ${load.brief.tesis}\n- **Para quién:** ${load.brief.paraQuien}\n- **Objetivo:** ${load.brief.objetivo}\n- **Se lo mandaría a:** ${load.brief.compartirCon}\n\nCompara con tu resumen del paso 1. Si no coinciden, el video no pasa.\n`
      : `# Sin brief\n\nEsta pieza no tiene brief (${basename(dir)}). Juzga la tesis solo con lo que entendiste en el paso 1.\n`,
  );
  return { folder, files: readdirSync(folder) };
}
