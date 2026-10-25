import type { CSSProperties } from "react";

/*
 * What a scene can add around its Visual when the video has no stage, for
 * Reels cut scene by scene like @sebastiankra.ia's (docs/direccion-reels.md):
 * a background pattern and an entrance. Both are opt-in per scene; without
 * them a scene is the plain slide it always was.
 */

/** A pattern over the scene's tone: a grid, diagonal stripes or nothing. */
export type SceneBackground = "grid" | "stripes" | "plain";

/**
 * How the scene comes in, in its first frames: "blur" (out of focus to
 * sharp), "zoom" (from close, with blur), "slide" (from the right) or "whip"
 * (a fast pan with motion blur). The previous scene cuts; the entrance is
 * the transition, so the scenes never overlap and the voice stays in sync.
 */
export type SceneTransition = "blur" | "zoom" | "slide" | "whip";

/** How many frames an entrance lasts. */
export const TRANSITION_FRAMES = 9;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** The style of the scene's wrapper at `frame` (from the scene's start) for its entrance. */
export function enterStyle(kind: SceneTransition | undefined, frame: number): CSSProperties {
  if (!kind || frame >= TRANSITION_FRAMES) return {};
  const p = easeOut(Math.max(0, frame) / TRANSITION_FRAMES);
  const q = 1 - p;
  switch (kind) {
    case "blur":
      return { filter: `blur(${14 * q}px)`, opacity: 0.4 + 0.6 * p };
    case "zoom":
      return { transform: `scale(${1 + 0.25 * q})`, filter: `blur(${10 * q}px)` };
    case "slide":
      return { transform: `translateX(${100 * q}%)` };
    case "whip":
      return { transform: `translateX(${60 * q}%)`, filter: `blur(${18 * q}px)` };
  }
}

/** The pattern of a background, drawn in the tone's ink so it works on any tone. */
export function SceneBackgroundLayer({ kind }: { kind: SceneBackground }) {
  if (kind === "plain") return null;
  const style: CSSProperties =
    kind === "grid"
      ? {
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, currentColor 9%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, currentColor 9%, transparent) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }
      : { backgroundImage: "repeating-linear-gradient(135deg, color-mix(in srgb, currentColor 10%, transparent) 0 26px, transparent 26px 52px)" };
  return <div aria-hidden data-frame="fondo" className="pointer-events-none absolute inset-0" style={style} />;
}
