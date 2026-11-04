import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { DUR, fade, popAt, useClock } from "@motor/video";

/*
 * The collage pieces of this Reel: stickers on a flat lime color, a stamp and
 * the numbered plate of each point. No shadows, rotations under 10 degrees
 * (skills/carrusel-taste/direcciones.json, collage).
 */

export const RED = "#E5352B";

/** The overlay of a scene, in canvas px (540×960). */
export function Layer({ children }: { children: ReactNode }) {
  return <AbsoluteFill className="pointer-events-none">{children}</AbsoluteFill>;
}

/** A sticker that pops in at `at` (and leaves at `until`), centered on x. */
export function Sticker({
  at,
  until,
  x,
  y,
  rotate = 0,
  tone = "white",
  className,
  style,
  children,
}: {
  style?: CSSProperties;
  at: number;
  until?: number;
  x: number;
  y: number;
  rotate?: number;
  tone?: "white" | "accent" | "ink" | "red";
  className?: string;
  children: ReactNode;
}) {
  const t = useClock();
  const p = popAt(t, at);
  const out = until === undefined ? 0 : fade(t, until, DUR.quick);
  if (t < at || out >= 1) return null;
  const tones = {
    white: "bg-white text-ink border-ink",
    accent: "bg-accent text-accent-ink border-ink",
    ink: "bg-ink text-white border-ink",
    red: "text-white border-ink",
  };
  return (
    <div
      className={`absolute rounded-2xl border-[3px] px-4 py-2 font-display font-extrabold leading-[1.02] ${tones[tone]} ${className ?? ""}`}
      style={{
        left: x,
        top: y,
        opacity: Math.min(1, p * 2) * (1 - out),
        transform: `translateX(-50%) rotate(${rotate}deg) scale(${0.6 + 0.4 * p})`,
        transformOrigin: "50% 50%",
        ...(tone === "red" ? { background: RED } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** The plate of a numbered point: "1 · MÁS IA ≠ MÁS TRABAJO". */
export function Plate({ at, n, children, rotate = -3 }: { at: number; n: number; children: ReactNode; rotate?: number }) {
  return (
    <Sticker at={at} x={270} y={112} rotate={rotate} tone="accent" className="whitespace-nowrap text-[34px] uppercase">
      <span className="mr-2 inline-block rounded-lg bg-white px-2 text-ink">{n}</span>
      {children}
    </Sticker>
  );
}

/** A rubber stamp that falls with weight. */
export function Stamp({ at, x, y, rotate = -8, children, tone = "red" }: { at: number; x: number; y: number; rotate?: number; children: ReactNode; tone?: "red" | "accent" }) {
  const t = useClock();
  const p = popAt(t, at);
  if (t < at) return null;
  const color = tone === "red" ? "#E5352B" : "var(--piece-accent)";
  return (
    <div
      className="absolute whitespace-nowrap rounded-xl border-[5px] bg-white/85 px-4 py-1 font-display text-[40px] font-extrabold uppercase leading-none"
      style={{ left: x, top: y, color, borderColor: color, transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${2.2 - 1.2 * Math.min(1, p)})`, opacity: Math.min(1, p * 3) }}
    >
      {children}
    </div>
  );
}
