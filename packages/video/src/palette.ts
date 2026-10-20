import { contrastRatio } from "../../brand/src/color.ts";
import type { Palette } from "../../brand/src/index.ts";

/** Accent text needs 4.5:1 on the backgrounds: the captions mark the word being said with it. */
export const MIN_ACCENT_CONTRAST = 4.5;

/**
 * The palette of the art direction, checked for video: the captions put the
 * accent on the base background and on the surface, where the carousel only
 * uses it for a few big words. `where` says which file it came from.
 */
export function piecePalette(palette: Palette, where: string): Palette {
  const grounds: Array<[string, string | undefined]> = [
    ["bg", palette.bg],
    ["surface", palette.surface],
  ];
  for (const [name, ground] of grounds) {
    if (!ground) continue;
    const ratio = contrastRatio(palette.accent, ground);
    if (ratio < MIN_ACCENT_CONTRAST) {
      throw new Error(
        `${where} → palette.accent ${palette.accent} has ${ratio.toFixed(2)}:1 on ${name} (${ground}) and needs ${MIN_ACCENT_CONTRAST}:1 for the captions. Set video.json → art with an accent that reads: the brand color stays in the logo.`,
      );
    }
  }
  return palette;
}
