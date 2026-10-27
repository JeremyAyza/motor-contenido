import { existsSync, readFileSync } from "node:fs";
import { z } from "zod";

/**
 * Which provider and model make images and music, and which one critiques
 * (media.config.json at the repo root). The voice is per account
 * (accounts/<account>.json → voice).
 */
export const MediaConfigSchema = z.object({
  image: z.object({ provider: z.string(), model: z.string().optional() }).default({ provider: "gemini" }),
  music: z.object({ provider: z.string(), model: z.string().optional() }).default({ provider: "gemini" }),
  review: z
    .object({ provider: z.string(), model: z.string().optional() })
    .default({ provider: "gemini" })
    .describe("The blind critic of video:critique --gemini (docs/critico-ciego-video.md)"),
  sounds: z.array(z.string()).default(["openverse", "freesound"]).describe("Sound libraries searched by video:asset, in order"),
});
export type MediaConfig = z.infer<typeof MediaConfigSchema>;

export function loadMediaConfig(path: string): MediaConfig {
  return MediaConfigSchema.parse(existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {});
}
