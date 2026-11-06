import type { ReactNode } from "react";
import { EASE, popAt, unit, useClock } from "@motor/video";
import { PixelFace } from "../parts.tsx";
import { ACCENT, INK, TOKEN } from "../world.tsx";

/*
 * The two-player screen of "dos" and "escenarios": the canvas split to the
 * bleed in two fields that oppose each other (antes-despues). It stays from
 * one scene to the next; what is inside each half changes.
 */

export const HALF = { w: 228, left: 36, right: 276, top: 176, bottom: 730 };

export function Field({ side, wipeAt = -1, children }: { side: "left" | "right"; wipeAt?: number; children?: ReactNode }) {
  const t = useClock();
  const k = EASE.out(unit(t, wipeAt + (side === "right" ? 0.12 : 0), 0.45));
  const color = side === "left" ? TOKEN : ACCENT;
  return (
    <div
      className="absolute overflow-hidden rounded-2xl"
      style={{ left: side === "left" ? HALF.left : HALF.right, top: HALF.top, width: HALF.w, height: (HALF.bottom - HALF.top) * k, background: `color-mix(in srgb, ${color} 13%, transparent)`, border: `2px solid ${color}` }}
    >
      {children}
    </div>
  );
}

export function Head({ at, player, name, seed, color }: { at: number; player: string; name: string; seed: number; color: string }) {
  const t = useClock();
  const p = Math.min(1, popAt(t, at));
  return (
    <div className="absolute flex flex-col items-center" style={{ left: 0, top: 18, width: HALF.w }}>
      <span data-ui="" className="font-mono font-bold uppercase" style={{ fontSize: 13, letterSpacing: "0.16em", color }}>
        {player}
      </span>
      <div style={{ marginTop: 10, transform: `scale(${t >= at ? 0.6 + 0.4 * p : 0.6})`, opacity: t >= at ? 1 : 0.25 }}>
        <PixelFace seed={seed} size={70} color={color} />
      </div>
      <span className="font-display font-black" style={{ fontSize: 38, color: INK, marginTop: 8, lineHeight: 1, opacity: t >= at ? p : 0 }}>
        {name}
      </span>
    </div>
  );
}
