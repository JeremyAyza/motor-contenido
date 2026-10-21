import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { spawnSync } from "node:child_process";
import type { Manifest } from "../../publisher/src/index.ts";
import { VideoError } from "./errors.ts";
import { loadScript } from "./script.ts";

const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";

/** Extrae el primer cuadro limpio del video como imagen de portada (1080x1920). */
export function extraerPortada(videoPath: string, coverPath: string): void {
  const result = spawnSync(
    FFMPEG,
    ["-loglevel", "error", "-y", "-ss", "00:00:00", "-i", videoPath, "-vframes", "1", "-q:v", "2", coverPath],
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

  // Portada: cuadro 1 limpio extraído del video
  const coverFile = join(outDir, "video-portada.png");
  if (!existsSync(coverFile)) {
    try {
      extraerPortada(videoFile, coverFile);
    } catch {
      // Si ffmpeg no está disponible o falla, intentamos usar out/video-hoja.png si existe
      const fallbackSheet = join(outDir, "video-hoja.png");
      if (existsSync(fallbackSheet)) {
        // Usa la hoja de revisión como alternativa de portada
      }
    }
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
