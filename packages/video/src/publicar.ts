import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { spawnSync } from "node:child_process";
import type { Manifest } from "../../publisher/src/index.ts";
import { VideoError } from "./errors.ts";
import { loadScript, type VideoScript } from "./script.ts";
import type { Timeline } from "./timeline.ts";

const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";

/** Lo que tarda una escena en quedar completa: la portada sin `at` sale este margen antes de su final. */
const SETTLED_BEFORE_END_MS = 300;

/**
 * El segundo del video que va de portada: video.json → cover (una escena y,
 * opcionalmente, los segundos desde su inicio), o el cuadro 1 si no hay cover.
 * Sin `at`, el final de la escena, cuando ya está completa.
 */
export function coverSeconds(script: VideoScript, timeline: Pick<Timeline, "scenes">): number {
  if (!script.cover) return 0;
  let offset = 0;
  for (const scene of timeline.scenes) {
    if (scene.id === script.cover.scene) {
      const within = script.cover.at === undefined ? scene.durationMs - SETTLED_BEFORE_END_MS : Math.min(script.cover.at * 1000, scene.durationMs - 1);
      return (offset + Math.max(0, within)) / 1000;
    }
    offset += scene.durationMs;
  }
  throw new VideoError(`video.json → cover.scene "${script.cover.scene}" no está en out/video/timeline.json: corre video:prepare otra vez`);
}

/** Extrae un cuadro limpio del video como imagen de portada (1080x1920): el 1, o el del segundo que se pida. */
export function extraerPortada(videoPath: string, coverPath: string, seconds = 0): void {
  const result = spawnSync(
    FFMPEG,
    ["-loglevel", "error", "-y", "-ss", seconds.toFixed(3), "-i", videoPath, "-vframes", "1", "-q:v", "2", coverPath],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new VideoError(`No se pudo extraer la portada con ffmpeg: ${(result.stderr || "").trim()}`);
  }
}

/**
 * Prepara la publicación de un Reel para packages/publisher.
 * Exige la puerta B aprobada, el hash sha256 coincidente de out/video.mp4,
 * el caption en video.json y genera la portada limpia.
 */
export function prepararPublicacionVideo(dir: string): { manifest: Manifest; file: string } {
  const pieza = basename(dir);
  const script = loadScript(dir);
  const problemas: string[] = [];

  if (!script.gateB?.approved) {
    problemas.push("La puerta B no está aprobada: muéstrale el video a la persona y anota su sí en video.json → gateB (workflows/video.md, paso 8)");
  }

  const outDir = join(dir, "out");
  const videoFile = join(outDir, "video.mp4");
  if (!existsSync(videoFile)) {
    throw new VideoError(`No se puede publicar ${pieza}: no existe out/video.mp4. Corre npm run video:render -- ${dir}`);
  }

  // Comprobar integridad del archivo contra la puerta B aprobada
  const actualHash = createHash("sha256").update(readFileSync(videoFile)).digest("hex");
  if (script.gateB?.approved && script.gateB.video && script.gateB.video !== actualHash) {
    problemas.push(
      `El hash del video actual (${actualHash.slice(0, 8)}...) no coincide con el aprobado en la puerta B (${script.gateB.video.slice(0, 8)}...). Vuelve a renderizar y solicita la puerta B`,
    );
  }

  if (!script.caption || !script.caption.trim()) {
    problemas.push("video.json no tiene 'caption' (texto del post para el Reel)");
  }

  const videoTsx = join(dir, "video.tsx");
  if (existsSync(videoTsx) && statSync(videoFile).mtimeMs < statSync(videoTsx).mtimeMs) {
    problemas.push("out/video.mp4 es anterior al último cambio de video.tsx: corre npm run video:render y vuelve a pedir la puerta B");
  }

  if (problemas.length) {
    throw new VideoError(`No se puede publicar ${pieza}:\n- ${problemas.join("\n- ")}`);
  }

  // Portada: el cuadro de video.json → cover (o el 1), extraído cada vez para que no quede una vieja
  const coverFile = join(outDir, "video-portada.png");
  const timelineFile = join(outDir, "video/timeline.json");
  const seconds = script.cover && existsSync(timelineFile) ? coverSeconds(script, JSON.parse(readFileSync(timelineFile, "utf8")) as Timeline) : 0;
  try {
    extraerPortada(videoFile, coverFile, seconds);
  } catch {
    // Sin ffmpeg, queda la portada que ya hubiera; si no hay, Instagram usa la suya
  }

  const coverToUse = existsSync(coverFile) ? coverFile : undefined;

  const manifest: Manifest = {
    id: `${pieza}-reel`,
    account: "dev",
    caption: script.caption!,
    media: [videoFile],
    kind: "reel",
    cover: coverToUse,
    aiLabel: true,
  };

  const file = join(outDir, "publication.json");
  writeFileSync(
    file,
    JSON.stringify(
      {
        ...manifest,
        media: ["video.mp4"],
        cover: manifest.cover ? basename(manifest.cover) : undefined,
      },
      null,
      2,
    ) + "\n",
  );

  return { manifest, file };
}
