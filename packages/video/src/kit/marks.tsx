import type { ReactNode } from "react";
import { fade } from "./grammar.tsx";
import { useClock } from "./scene.ts";
import { Sfx, usePop } from "./sfx.tsx";

/*
 * Marks that land on the world: a stamp that falls and presses ("APROBADO",
 * "BORRADO") and a small tag that pops beside a thing ("PROD", "v2"). Six
 * pieces wrote each one by hand before they came to the kit. Times are seconds
 * on the clock of where they are (useCue in a scene, useStageCue in the
 * world); x and y are the mark's center, in design or world px.
 */

/** How big a stamp is at `t`: it falls from 2.6× in 0.1 s before `at` and presses a little when it lands. */
export function stampScale(t: number, at: number): number {
  if (t < at) return 2.6 - 1.6 * Math.max(0, Math.min(1, (t - (at - 0.1)) / 0.1));
  return 1 + 0.05 * Math.exp(-(t - at) * 18);
}

/**
 * A rubber stamp that falls onto the scene at `at` with a hit, tilted
 * `rotate` degrees, and leaves at `until`. Ink is the accent unless `color`
 * says otherwise; `fill` paints behind it when it lands on a busy drawing.
 */
export function Stamp({ at, until, x, y, color = "var(--piece-accent)", rotate = -6, size = 44, fill, children }: { at: number; until?: number; x: number; y: number; color?: string; rotate?: number; size?: number; fill?: string; children: ReactNode }) {
  const t = useClock();
  if (t < at - 0.1) return null;
  const out = until === undefined ? 0 : fade(t, until, 0.2);
  if (out >= 1) return null;
  return (
    <div className="absolute" style={{ left: x, top: y, opacity: fade(t, at - 0.1, 0.06) * (1 - out), transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${stampScale(t, at)})` }}>
      <Sfx id="golpe" at={at} volume={0.34} />
      {fill ? <div className="absolute inset-[-6px] rounded-[12px]" style={{ background: fill }} /> : null}
      <div
        className="relative whitespace-nowrap rounded-[10px] px-4 py-1.5 text-center font-display font-black uppercase leading-[1.02] tracking-tight"
        style={{ color, fontSize: Math.max(22, size), border: `5px solid ${color}`, outline: `2px solid ${color}`, outlineOffset: 3 }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * A small tag that pops in beside a thing at `at`, with a blip, and leaves at
 * `until`: the name of a part, a version, a state. On the surface with ink by
 * default; with `color`, filled with it and white text.
 */
export function Tag({ at, until, x, y, color, children }: { at: number; until?: number; x: number; y: number; color?: string; children: ReactNode }) {
  const t = useClock();
  const p = usePop(at);
  const out = until === undefined ? 0 : fade(t, until, 0.2);
  if (t < at || out >= 1) return null;
  return (
    <div className="absolute" style={{ left: x, top: y, opacity: Math.min(1, p * 2) * (1 - out), transform: `translate(-50%, -50%) translateY(${(1 - Math.min(1, p)) * 10}px) scale(${0.72 + 0.28 * p})` }}>
      <Sfx id="blip" at={at} />
      <span
        className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 font-mono text-[22px] font-bold uppercase leading-none ${color ? "text-white" : "bg-surface text-ink ring-1 ring-ink/20"}`}
        style={color ? { background: color } : undefined}
      >
        {children}
      </span>
    </div>
  );
}
