import { spawnSync } from "node:child_process";

/**
 * Image models do not make transparent PNGs, so images that need a cutout
 * (stickers, the avatar) are asked for on flat green and the green is keyed
 * out here with ffmpeg's colorkey. No despill: it takes the green out of the
 * yellows too (a yellow bulb came out orange), while the halo colorkey leaves
 * is a hairline. A white sticker border, asked for in the prompt, hides it.
 */
export const CHROMA_GREEN = "#00FF00";

export const CHROMA_PROMPT =
  "Draw it on a completely flat, pure green background (#00FF00), with no shadows, gradients, texture or ground on the background, and no green on the subject.";

/**
 * Writes `input` (any image ffmpeg reads) as a PNG at `output`. With `chroma`
 * the green background becomes transparent.
 */
export function toPng({ ffmpeg, input, output, chroma = false }: { ffmpeg: string; input: string; output: string; chroma?: boolean }): void {
  const filter = chroma ? "colorkey=0x00FF00:0.30:0.10,format=rgba" : "format=rgb24";
  const result = spawnSync(ffmpeg, ["-loglevel", "error", "-y", "-i", input, "-vf", filter, "-frames:v", "1", output], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`ffmpeg could not convert ${input} to PNG: ${(result.stderr || "no details").trim()}`);
}
