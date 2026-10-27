import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { z } from "zod";
import type { AvatarSprites } from "./kit/avatar.tsx";

const BoxSchema = z.object({ x: z.number(), y: z.number(), w: z.number().positive(), h: z.number().positive() });

/**
 * The account's avatar (accounts/<account>.json → avatar.manifest): the
 * sprites of the bust the videos draw, relative to the manifest's folder,
 * and where the mouth and the eyes are in them (kit/avatar.tsx).
 */
export const AvatarManifestSchema = z.object({
  base: z.string(),
  mouths: z.array(z.string()).min(1),
  blink: z.string(),
  imageSize: z.number().int().positive(),
  mouthBox: BoxSchema,
  eyesBox: BoxSchema,
  bubbleCrop: BoxSchema.optional(),
});

/**
 * Copies the account's avatar to the public folder (`<out>/avatar/`) and
 * returns its sprites relative to that folder, for the timeline. Without a
 * manifest the account has no avatar, and a piece that asks for one fails
 * when it renders.
 */
export function stageAvatar(manifestFile: string, out: string): AvatarSprites | undefined {
  if (!existsSync(manifestFile)) return undefined;
  const manifest = AvatarManifestSchema.parse(JSON.parse(readFileSync(manifestFile, "utf8")));
  const stage = (file: string) => {
    const source = join(dirname(manifestFile), file);
    if (!existsSync(source)) throw new Error(`${manifestFile}: ${file} does not exist`);
    const target = join(out, "avatar", file);
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(source, target);
    return `avatar/${file}`;
  };
  return { ...manifest, base: stage(manifest.base), mouths: manifest.mouths.map(stage), blink: stage(manifest.blink) };
}
