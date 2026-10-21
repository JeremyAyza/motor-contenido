import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { normalizeWord, scriptWords } from "../../media/src/words.ts";
import type { ProbeReport } from "./probe.tsx";
import { FORMAT_SECONDS, type VideoScript } from "./script.ts";
import { CAPTIONS_TOP, CONTENT_BOX, GRID_CROP, HEIGHT, MIN_TEXT_PX, SCALE, TEXT_ZONE, timelineMs, WIDTH, type Timeline } from "./timeline.ts";

/**
 * The video inspector. It reads what the render really drew (the probe posts
 * the text of a frame every half second) and the rendered file (ffmpeg), and
 * says what to fix. Messages are in Spanish, like the carousel inspector's:
 * the person reads them too. Errors block gate B; warnings are errors unless
 * they can be defended in one sentence (AGENTS.md, rule 9).
 */
export type Issue = { level: "error" | "aviso"; message: string };

const VISIBLE = 0.5;
const MAX_WORDS_ON_SCREEN = 12;
/** The smallest text of an interface of the stage kit (data-ui), in design px. */
const MIN_UI_TEXT_PX = 12;
const MAX_FREEZE_S = 4;
export const TARGET_LUFS = -14;
const LUFS_TOLERANCE = 1;

/** A local server that collects the probe's reports during a render. */
export async function probeServer(): Promise<{ url: string; reports: Map<number, ProbeReport>; close: () => Promise<void> }> {
  const reports = new Map<number, ProbeReport>();
  const server = createServer((req, res) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const report = JSON.parse(body) as ProbeReport;
        reports.set(report.frame, report);
      } catch {
        // A broken report is ignored: the inspector reports missing frames.
      }
      res.writeHead(204, { "Access-Control-Allow-Origin": "*" }).end();
    });
  });
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  const { port } = server.address() as AddressInfo;
  return { url: `http://127.0.0.1:${port}/`, reports, close: () => new Promise((done) => server.close(() => done())) };
}

const seconds = (frame: number, fps: number) => `${(frame / fps).toFixed(1)} s`;
const quote = (text: string) => `"${text.length > 40 ? `${text.slice(0, 40)}…` : text}"`;

/** What the probe saw: the frame's padding, text size, words on screen and the hook in frame 1. */
export function inspectFrames(reports: ProbeReport[], fps: number, hookOnScreen: string): Issue[] {
  const issues: Issue[] = [];
  const once = new Set<string>();
  const report = (level: Issue["level"], key: string, message: string) => {
    if (once.has(key)) return;
    once.add(key);
    issues.push({ level, message });
  };
  const sorted = [...reports].sort((a, b) => a.frame - b.frame);
  if (!sorted.length) return [{ level: "error", message: "El inspector no recibió ningún cuadro del render: no se pudo revisar el texto" }];
  for (const { frame, texts } of sorted) {
    const visible = texts.filter((t) => t.opacity > VISIBLE);
    for (const t of visible) {
      const outside =
        t.x < TEXT_ZONE.left - 1 || t.x + t.w > TEXT_ZONE.right + 1 || t.y < TEXT_ZONE.top - 1 || t.y + t.h > TEXT_ZONE.bottom + 1;
      if (outside) {
        report("error", `zone ${t.text}`, `Texto fuera del margen del marco en ${seconds(frame, fps)}: ${quote(t.text)} (va entre la pestaña, los subtítulos y ${TEXT_ZONE.left} px de cada lado)`);
      }
      const min = t.ui ? MIN_UI_TEXT_PX : MIN_TEXT_PX;
      if (t.fontSize < min - 0.5) {
        const what = t.ui ? "el texto de una interfaz" : "nada";
        report("error", `size ${t.text}`, `Letra de ${t.fontSize}px en ${seconds(frame, fps)}: ${quote(t.text)}. En video, ${what} baja de ${min}px de diseño`);
      }
    }
    // The text of an interface (a phone, a terminal) is the stage, not something to read: it does not count.
    const words = visible.filter((t) => !t.ui).reduce((sum, t) => sum + t.text.split(/\s+/).filter(Boolean).length, 0);
    if (words > MAX_WORDS_ON_SCREEN) {
      report("aviso", "words", `${words} palabras en pantalla a la vez en ${seconds(frame, fps)}, además de los subtítulos: más de ${MAX_WORDS_ON_SCREEN} se leen tarde`);
    }
  }
  const first = sorted[0];
  if (first.frame !== 0) {
    issues.push({ level: "error", message: "Falta el cuadro 1 en el informe del render: no se pudo revisar el gancho" });
  } else {
    const shown = first.texts.filter((t) => t.opacity > VISIBLE);
    const words = scriptWords(shown.map((t) => t.text).join(" ")).map(normalizeWord).join(" ");
    const hook = scriptWords(hookOnScreen).map(normalizeWord).join(" ");
    if (!words.includes(hook)) {
      issues.push({ level: "error", message: `El gancho ${quote(hookOnScreen)} no se ve completo en el cuadro 1: es lo primero que se lee y la portada` });
    } else {
      const outsideGrid = shown.some((t) => hook.includes(scriptWords(t.text).map(normalizeWord).join(" ")) && (t.y < GRID_CROP.top || t.y + t.h > GRID_CROP.bottom));
      if (outsideGrid) issues.push({ level: "aviso", message: "El gancho queda fuera del centro 3:4 del cuadro 1, que es lo que muestra la grilla del perfil" });
    }
  }
  return issues;
}

/** What the timeline says: captions for every word, timings in order, length. */
export function inspectTimeline(timeline: Timeline, script: VideoScript): Issue[] {
  const issues: Issue[] = [];
  for (const scene of timeline.scenes) {
    const expected = script.scenes.find((s) => s.id === scene.id);
    if (!expected) continue;
    const said = scriptWords(expected.say).length;
    if (scene.words.length !== said) {
      issues.push({ level: "error", message: `Escena "${scene.id}": los subtítulos tienen ${scene.words.length} palabras y el guion ${said}. Corre video:prepare otra vez` });
    }
    const outOfOrder = scene.words.some((w, i) => w.endMs < w.startMs || (i > 0 && w.startMs < scene.words[i - 1].startMs));
    if (outOfOrder) issues.push({ level: "error", message: `Escena "${scene.id}": los tiempos de los subtítulos están desordenados` });
  }
  const total = timelineMs(timeline) / 1000;
  const [min, max] = FORMAT_SECONDS[script.format];
  if (total < min || total > max) {
    issues.push({ level: "aviso", message: `Dura ${total.toFixed(1)} s: el formato ${script.format} va de ${min} a ${max} s` });
  }
  return issues;
}

function ffmpegStderr(ffmpeg: string, args: string[]): string {
  const result = spawnSync(ffmpeg, ["-hide_banner", "-nostats", ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(`ffmpeg failed: ${(result.stderr || "no details").trim().split("\n").slice(-3).join(" ")}`);
  return result.stderr;
}

/** Samples per second for the stillness check, and what counts as a change between two of them. */
const STILL_FPS = 2;
const PIXEL_CHANGE = 24;
const MIN_CHANGED_SHARE = 0.0005;

/**
 * Stretches where nothing changes above the captions (which always change),
 * longer than MAX_FREEZE_S. A change is a share of pixels that moved clearly
 * between two samples half a second apart: a stroke being drawn or a label
 * appearing counts, compression noise does not. (ffmpeg's freezedetect
 * averages the whole frame and misses thin strokes.)
 */
export function stillStretches(samples: Uint8Array[], fps = STILL_FPS): Array<{ start: number; seconds: number }> {
  const stretches: Array<{ start: number; seconds: number }> = [];
  let stillSince = 0;
  for (let i = 1; i <= samples.length; i++) {
    let changed = 0;
    if (i < samples.length) {
      const [a, b] = [samples[i - 1], samples[i]];
      for (let p = 0; p < a.length; p++) if (Math.abs(a[p] - b[p]) > PIXEL_CHANGE) changed++;
    }
    if (i === samples.length || changed / samples[0].length > MIN_CHANGED_SHARE) {
      const seconds = (i - 1 - stillSince) / fps;
      if (seconds > MAX_FREEZE_S) stretches.push({ start: stillSince / fps, seconds });
      stillSince = i;
    }
  }
  return stretches;
}

export function inspectFreezes(ffmpeg: string, video: string): Issue[] {
  const [w, h] = [WIDTH / 2, CAPTIONS_TOP / 2];
  const result = spawnSync(
    ffmpeg,
    ["-loglevel", "error", "-i", video, "-vf", `crop=${WIDTH * SCALE}:${CAPTIONS_TOP * SCALE}:0:0,fps=${STILL_FPS},scale=${w}:${h},format=gray`, "-an", "-f", "rawvideo", "-"],
    { maxBuffer: 256 * 1024 * 1024 },
  );
  if (result.status !== 0) throw new Error(`ffmpeg could not sample ${video} for still stretches`);
  const size = w * h;
  const samples: Uint8Array[] = [];
  for (let at = 0; at + size <= result.stdout.length; at += size) samples.push(result.stdout.subarray(at, at + size));
  return stillStretches(samples).map(({ start, seconds }) => ({
    level: "aviso" as const,
    message: `La imagen queda quieta ${seconds.toFixed(1)} s desde ${start.toFixed(1)} s: algo tiene que cambiar cada ${MAX_FREEZE_S} s como máximo`,
  }));
}

/** Integrated loudness (EBU R128) of the file's audio, in LUFS. */
export function measureLoudness(ffmpeg: string, file: string): number {
  const log = ffmpegStderr(ffmpeg, ["-i", file, "-af", "ebur128", "-f", "null", "-"]);
  const summary = log.slice(log.lastIndexOf("Summary"));
  const match = summary.match(/I:\s+(-?[\d.]+) LUFS/);
  if (!match) throw new Error(`ffmpeg did not report the loudness of ${file}`);
  return Number(match[1]);
}

export function inspectLoudness(lufs: number): Issue[] {
  if (Math.abs(lufs - TARGET_LUFS) <= LUFS_TOLERANCE) return [];
  return [{ level: "aviso", message: `El volumen está en ${lufs.toFixed(1)} LUFS y se busca ${TARGET_LUFS}` }];
}

/**
 * Two-pass loudness normalization to TARGET_LUFS (true peak -1.5 dB), in
 * linear mode so the mix keeps its dynamics. The video stream is copied.
 */
export function normalizeLoudness(ffmpeg: string, input: string, output: string): void {
  const target = `I=${TARGET_LUFS}:TP=-1.5:LRA=11`;
  const log = ffmpegStderr(ffmpeg, ["-i", input, "-af", `loudnorm=${target}:print_format=json`, "-f", "null", "-"]);
  const json = log.slice(log.lastIndexOf("{"), log.lastIndexOf("}") + 1);
  const m = JSON.parse(json) as { input_i: string; input_tp: string; input_lra: string; input_thresh: string; target_offset: string };
  const measured = `measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}`;
  ffmpegStderr(ffmpeg, ["-y", "-i", input, "-c:v", "copy", "-af", `loudnorm=${target}:${measured}:linear=true`, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", output]);
}

/**
 * Rows of a frame (design px) with ink: pixels clearly away from the
 * background, light or dark. The background is the most common gray of the
 * frame; the dots of the texture stay under the threshold.
 */
function inkRows(ffmpeg: string, video: string, seconds: number): number[] {
  const result = spawnSync(
    ffmpeg,
    ["-loglevel", "error", "-ss", seconds.toFixed(3), "-i", video, "-frames:v", "1", "-vf", `scale=${WIDTH}:${HEIGHT},format=gray`, "-f", "rawvideo", "-"],
    { maxBuffer: 16 * 1024 * 1024 },
  );
  if (result.status !== 0) throw new Error(`ffmpeg could not read the frame at ${seconds.toFixed(1)} s of ${video}`);
  const pixels = result.stdout;
  const counts = new Array<number>(256).fill(0);
  for (const value of pixels) counts[value]++;
  const background = counts.indexOf(Math.max(...counts));
  const rows: number[] = [];
  for (let y = 0; y < HEIGHT; y++) {
    let ink = 0;
    for (let x = 0; x < WIDTH; x++) if (Math.abs(pixels[y * WIDTH + x] - background) > INK_DISTANCE) ink++;
    if (ink > 3) rows.push(y);
  }
  return rows;
}

/** How far from the background a gray counts as ink (the dots are at 13% of the ink). */
const INK_DISTANCE = 45;
/**
 * How much of the content area can stay empty under the drawing, in design
 * px. SceneFrame keeps the title at the top and centers the drawing below
 * it, so the center of everything always sits high; what shows a drawing too
 * small or bunched at the top is the empty band left above the captions.
 */
const MAX_EMPTY_BELOW = 130;
/** The cover has to fill at least this much of the 3:4 crop the profile grid shows. */
const MIN_COVER_FILL = 0.35;

/**
 * Where each scene sits when it is complete (the review frames), measured on
 * the pixels: a drawing too small or bunched at the top leaves the bottom of
 * the content area empty, and a cover with only a title looks empty in the grid.
 * The tab, the captions and the signature are left out: they are the frame.
 */
export function inspectComposition(ffmpeg: string, video: string, timeline: Timeline): Issue[] {
  const issues: Issue[] = [];
  const frames = reviewFrames(timeline);
  const high: string[] = [];
  for (const frame of frames.slice(1)) {
    const seconds = frame / timeline.fps;
    const rows = inkRows(ffmpeg, video, seconds).filter((y) => y >= CONTENT_BOX.top && y <= CONTENT_BOX.bottom);
    if (!rows.length) continue;
    const emptyBelow = CONTENT_BOX.bottom - rows[rows.length - 1];
    if (emptyBelow > MAX_EMPTY_BELOW) high.push(`${seconds.toFixed(1)} s (${Math.round(emptyBelow)} px)`);
  }
  if (high.length) {
    issues.push({
      level: "aviso",
      message: `Abajo del dibujo quedan más de ${MAX_EMPTY_BELOW} px vacíos antes de los subtítulos en ${high.join(", ")}: agranda el dibujo o súmale una capa, y deja que SceneFrame lo centre`,
    });
  }
  const cover = inkRows(ffmpeg, video, 0).filter((y) => y >= Math.max(CONTENT_BOX.top, GRID_CROP.top) && y <= Math.min(CONTENT_BOX.bottom, GRID_CROP.bottom));
  const fill = cover.length ? (cover[cover.length - 1] - cover[0]) / (GRID_CROP.bottom - GRID_CROP.top) : 0;
  if (fill < MIN_COVER_FILL) {
    issues.push({ level: "aviso", message: `La portada (cuadro 1) ocupa ${Math.round(fill * 100)}% del recorte 3:4 de la grilla: con solo el título se ve vacía. Que el dibujo se vea desde el cuadro 1` });
  }
  return issues;
}

/** Lays the mock Instagram interface over the video, for the preview and the review sheet. */
export function overlayInterface(ffmpeg: string, video: string, overlay: string, output: string): void {
  ffmpegStderr(ffmpeg, ["-y", "-i", video, "-i", overlay, "-filter_complex", "[0:v][1:v]overlay=0:0:format=auto,format=yuv420p", "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-c:a", "copy", "-movflags", "+faststart", output]);
}

/** The review sheet: the first frame (the cover) and the last moment of each scene, when it is complete. */
export function reviewFrames(timeline: Timeline): number[] {
  const frames = [0];
  let offset = 0;
  for (const scene of timeline.scenes) {
    offset += scene.durationMs;
    frames.push(Math.max(0, Math.round(((offset - 300) / 1000) * timeline.fps)));
  }
  return [...new Set(frames)];
}

/**
 * Filmstrips for the blind critic: one frame every `every` frames, from the
 * first, tiled 3×2 at about phone size. `pattern` is an ffmpeg output pattern
 * (tira-%02d.png); the last strip may have empty tiles.
 */
export function filmstrips(ffmpeg: string, video: string, every: number, pattern: string): void {
  ffmpegStderr(ffmpeg, [
    "-y",
    "-i",
    video,
    "-vf",
    `select='not(mod(n\\,${every}))',scale=360:-1,tile=3x2:padding=8:margin=8:color=white`,
    "-fps_mode",
    "passthrough",
    "-start_number",
    "1",
    pattern,
  ]);
}

/** The first frame as the profile grid crops it (GRID_CROP, 3:4), at thumbnail size. */
export function gridCover(ffmpeg: string, video: string, output: string): void {
  const scale = `iw/${WIDTH}`;
  ffmpegStderr(ffmpeg, [
    "-y",
    "-i",
    video,
    "-vf",
    `crop=iw:${GRID_CROP.bottom - GRID_CROP.top}*${scale}:0:${GRID_CROP.top}*${scale},scale=270:-1`,
    "-frames:v",
    "1",
    output,
  ]);
}

export function reviewSheet(ffmpeg: string, video: string, frames: number[], output: string): void {
  const columns = Math.min(frames.length, 4);
  const rows = Math.ceil(frames.length / columns);
  const select = frames.map((f) => `eq(n\\,${f})`).join("+");
  ffmpegStderr(ffmpeg, [
    "-y",
    "-i",
    video,
    "-vf",
    `select='${select}',scale=270:-1,tile=${columns}x${rows}:padding=8:margin=8:color=white`,
    "-frames:v",
    "1",
    "-fps_mode",
    "passthrough",
    output,
  ]);
}
