import { noise2D } from "@remotion/noise";
import type { CSSProperties, ReactNode } from "react";
import { interpolate, spring } from "remotion";
import { useClock } from "./scene.ts";

/*
 * The motion grammar of the kit: named durations and curves, and the small
 * primitives every piece used to write again (clamp, fade, keys, At, Appear,
 * a camera rig, a shake). It says how things move, never what to show, so it
 * does not anchor the creative work (docs/plan-velocidad-reels.md, Fase 4).
 * Times are seconds on the clock of where the component is (useClock).
 */

/** Durations with a name, in seconds. "move" is the camera's change of shot. */
export const DUR = { instant: 0.12, quick: 0.2, base: 0.3, slow: 0.6, move: 0.9 } as const;

/** interpolate() options that hold the first and last values. */
export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** The curves: functions from 0..1 to 0..1 (back overshoots a little before settling). */
export const EASE = {
  linear: (p: number) => p,
  out: (p: number) => 1 - Math.pow(1 - p, 3),
  in: (p: number) => p * p * p,
  inOut: (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  back: (p: number) => 1 + 2.4 * Math.pow(p - 1, 3) + 1.4 * Math.pow(p - 1, 2),
} as const;

/** Keeps a value between 0 and 1. */
export const clamp01 = (p: number) => Math.max(0, Math.min(1, p));

/** How far `t` is through [at, at + dur], from 0 to 1. */
export const unit = (t: number, at: number, dur: number) => clamp01((t - at) / Math.max(0.001, dur));

/** From `a` to `b` by `p` (0 to 1). */
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** lerp for points { x, y }. */
export const lerpPoint = (a: { x: number; y: number }, b: { x: number; y: number }, p: number) => ({ x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p) });

/** 0 before `at`, 1 after `at + dur`. */
export const fade = (t: number, at: number, dur: number = DUR.base) => interpolate(t, [at, at + dur], [0, 1], CLAMP);

/** On from `a`, off from `b`. */
export const span = (t: number, a: number, b: number, dur: number = DUR.base) => fade(t, a, dur) * (1 - fade(t, b, dur));

/** 0 → 1 → 0 over [at, at + dur]: a flash, a pulse. */
export const bump = (t: number, at: number, dur: number) => {
  const p = unit(t, at, dur);
  return p <= 0 || p >= 1 ? 0 : Math.sin(p * Math.PI);
};

/** The kit's pop: a spring with overshoot from `at` (the same as usePop, for a time you already have). */
export const popAt = (t: number, at: number) => (t < at ? 0 : spring({ frame: (t - at) * 30, fps: 30, config: { damping: 10, stiffness: 180 } }));

/** A value along eased keys [seconds, value], holding the first and the last. */
export function keys(t: number, list: Array<[number, number]>, ease: (p: number) => number = EASE.inOut): number {
  if (!list.length) return 0;
  if (t <= list[0][0]) return list[0][1];
  for (let i = 1; i < list.length; i++) {
    const [a, va] = list[i - 1];
    const [b, vb] = list[i];
    if (t < b) return va + (vb - va) * ease((t - a) / Math.max(0.001, b - a));
  }
  return list[list.length - 1][1];
}

/** A shot of a piece's own camera: where it goes (x, y, zoom z) from `at`, in `dur` seconds. */
export type RigShot = { at: number; dur: number; x: number; y: number; z: number };

/**
 * A piece's own camera: the shot at time `t`, eased from one to the next, and
 * whether it is moving. The div it moves carries data-zoom and, while moving,
 * data-camera-moving, so the inspector measures its text right.
 */
export function rigAt(t: number, home: { x: number; y: number; z: number }, shots: RigShot[]): { x: number; y: number; z: number; moving: boolean } {
  let state = { ...home };
  let moving = false;
  for (const shot of [...shots].sort((a, b) => a.at - b.at)) {
    if (t <= shot.at) break;
    const p = EASE.inOut(unit(t, shot.at, shot.dur));
    if (p < 1) moving = true;
    state = { x: lerp(state.x, shot.x, p), y: lerp(state.y, shot.y, p), z: lerp(state.z, shot.z, p) };
  }
  return { ...state, moving };
}

/** A hit that shakes the frame for 0.4 s, decaying: the offset at `t` for hits at those seconds. */
export function shakeAt(t: number, hits: number[], amplitude = 8): { x: number; y: number } {
  let x = 0;
  let y = 0;
  for (const hit of hits) {
    const dt = t - hit;
    if (dt < 0 || dt > 0.4) continue;
    const amp = amplitude * Math.exp(-dt * 11);
    x += Math.sin(dt * 78) * amp * 0.6;
    y += Math.cos(dt * 61) * amp;
  }
  return { x, y };
}

/**
 * A slow organic sway for a thing at rest (a floating card, a character
 * breathing, a hanging sign): the offset in px and the turn in degrees at
 * `t`, from Remotion's noise, so the same seed always moves the same way.
 * Give each thing its own `seed`.
 */
export function wobble(t: number, seed: string | number, amplitude = 4, speed = 0.5): { x: number; y: number; rotate: number } {
  return {
    x: noise2D(`${seed}-x`, t * speed, 0) * amplitude,
    y: noise2D(`${seed}-y`, 0, t * speed) * amplitude,
    rotate: noise2D(`${seed}-r`, t * speed, t * speed) * amplitude * 0.4,
  };
}

/** A number the Spanish way: 1.000.000 and 0,25. */
export const es = (value: number, digits = 0) => {
  const [int, dec] = Math.abs(value).toFixed(digits).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${value < 0 ? "−" : ""}${grouped}${dec ? `,${dec}` : ""}`;
};

/** A box at absolute coordinates (px of design, or of the world inside a stage). */
export function At({ x, y, w, h, style, className, children }: { x: number; y: number; w?: number; h?: number; style?: CSSProperties; className?: string; children?: ReactNode }) {
  return (
    <div className={`absolute ${className ?? ""}`} style={{ left: x, top: y, width: w, height: h, ...style }}>
      {children}
    </div>
  );
}

/**
 * Pops in at `at` (rises `from` px and grows from 72 %), and fades out at
 * `until` if given; not mounted outside that time. For a sound with it, use <Pop>.
 */
export function Appear({
  at,
  until,
  x,
  y,
  w,
  h,
  origin = "50% 50%",
  from = 16,
  rotate = 0,
  children,
}: {
  at: number;
  until?: number;
  x: number;
  y: number;
  w?: number;
  h?: number;
  origin?: string;
  from?: number;
  rotate?: number;
  children: ReactNode;
}) {
  const t = useClock();
  const p = popAt(t, at);
  const out = until === undefined ? 0 : fade(t, until, DUR.quick);
  if (t < at || out >= 1) return null;
  return (
    <At x={x} y={y} w={w} h={h} style={{ opacity: Math.min(1, p * 2) * (1 - out), transform: `translateY(${(1 - Math.min(1, p)) * from}px) rotate(${rotate}deg) scale(${0.72 + 0.28 * p})`, transformOrigin: origin }}>
      {children}
    </At>
  );
}
