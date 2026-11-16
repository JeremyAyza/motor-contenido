import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { Logo } from "@motor/ui";
import { DUR, EASE, fade, popAt, unit, useClock } from "@motor/video";
import { BAR, DIM, GREEN, INK, LINE, MUTED, WIN } from "./world.tsx";

/** The whole 540×960 canvas, from its top-left corner, for a scene's Visual. */
export function Layer({ children }: { children: ReactNode }) {
  return (
    <AbsoluteFill className="pointer-events-none" style={{ top: -42, bottom: "auto", height: 960 }}>
      {children}
    </AbsoluteFill>
  );
}

/** Pop-in progress and opacity for something that enters at `at` and leaves at `until`. */
export function usePresence(at: number, until?: number): { p: number; o: number; on: boolean } {
  const t = useClock();
  const p = popAt(t, at);
  const out = until === undefined ? 0 : fade(t, until, DUR.quick);
  return { p, o: Math.min(1, p * 2) * (1 - out), on: t >= at && out < 1 };
}

/** 0 → 1 from `at` over `dur`, eased: for a color or a line that lights up. */
export function useOn(at: number, dur = 0.3): number {
  const t = useClock();
  return EASE.out(unit(t, at, dur));
}

/** The red, yellow and green buttons of a macOS window. */
export function Lights() {
  return (
    <div className="flex gap-[6px]">
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
        <i key={c} className="block h-[10px] w-[10px] rounded-full" style={{ background: c }} />
      ))}
    </div>
  );
}

/**
 * A macOS window: title bar with its lights and a centered title, a dark body.
 * It opens with a spring from a little below and smaller (as from the Dock) at
 * `at`, and leaves at `until`.
 */
export function Win({ x, y, w, h, title, at, until, children, bodyStyle, glow }: { x: number; y: number; w: number; h?: number; title?: string; at: number; until?: number; children?: ReactNode; bodyStyle?: CSSProperties; glow?: string }) {
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  const s = 0.9 + 0.1 * Math.min(1, p);
  return (
    <div
      data-ui=""
      className="absolute overflow-hidden rounded-[12px]"
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        background: WIN,
        border: `1px solid ${glow ?? LINE}`,
        boxShadow: glow ? `0 0 0 1px ${glow}, 0 18px 40px rgba(0,0,0,0.55)` : "0 18px 40px rgba(0,0,0,0.55)",
        opacity: o,
        transform: `translateY(${(1 - Math.min(1, p)) * 26}px) scale(${s})`,
        transformOrigin: "50% 100%",
      }}
    >
      <div className="relative flex items-center px-[10px]" style={{ height: 26, background: BAR, borderBottom: `1px solid ${LINE}` }}>
        <Lights />
        {title ? (
          <span className="absolute left-0 right-0 text-center text-[12px] font-medium" style={{ color: MUTED }}>
            {title}
          </span>
        ) : null}
      </div>
      <div style={bodyStyle}>{children}</div>
    </div>
  );
}

export type Line = { text: string; at: number; kind?: "cmd" | "out" | "ok" | "warn" | "dim"; mark?: string };

/** Terminal lines: commands typed from their `at` behind a "~ %" prompt, output that appears whole. `mark` highlights a word of the line. */
export function TermLines({ lines, size = 14, prompt = "~ %" }: { lines: Line[]; size?: number; prompt?: string }) {
  const t = useClock();
  return (
    <div className="font-mono leading-[1.5]" style={{ fontSize: size }}>
      {lines.map((line, i) => {
        if (t < line.at) return null;
        const kind = line.kind ?? "out";
        if (kind === "cmd") {
          const n = Math.floor(unit(t, line.at, Math.min(0.6, 0.03 * line.text.length)) * line.text.length);
          const typing = n < line.text.length;
          return (
            <div key={i} className="whitespace-pre" style={{ color: INK }}>
              <span style={{ color: MUTED }}>{prompt} </span>
              {line.text.slice(0, n)}
              {typing ? <span style={{ background: INK, color: "transparent" }}>_</span> : null}
            </div>
          );
        }
        const color = kind === "ok" ? GREEN : kind === "warn" ? "#FFB340" : kind === "dim" ? DIM : "#C9CED8";
        const o = fade(t, line.at, 0.12);
        if (line.mark && line.text.includes(line.mark)) {
          const [a, b] = line.text.split(line.mark);
          return (
            <div key={i} className="whitespace-pre" style={{ color, opacity: o }}>
              {a}
              <span className="rounded-[3px] px-[2px]" style={{ background: "rgba(255,179,64,0.25)", color: "#FFB340" }}>
                {line.mark}
              </span>
              {b}
            </div>
          );
        }
        return (
          <div key={i} className="whitespace-pre" style={{ color, opacity: o }}>
            {line.text}
          </div>
        );
      })}
    </div>
  );
}

/** A label: value row of a system panel; `lit` (0 to 1) fills it with the accent like a selection. */
export function Row({ label, value, lit = 0, accent, size = 14, last = false }: { label: ReactNode; value?: ReactNode; lit?: number; accent: string; size?: number; last?: boolean }) {
  return (
    <div
      className="flex items-center justify-between rounded-[6px] px-[10px] py-[6px]"
      style={{ fontSize: size, background: lit > 0 ? `color-mix(in srgb, ${accent} ${Math.round(lit * 100)}%, transparent)` : "transparent", borderBottom: last || lit > 0 ? "none" : `1px solid ${LINE}` }}
    >
      <span style={{ color: lit > 0.5 ? "#0B0D12" : MUTED, fontWeight: lit > 0.5 ? 600 : 400 }}>{label}</span>
      {value !== undefined ? <span style={{ color: lit > 0.5 ? "#0B0D12" : INK, fontWeight: 600 }}>{value}</span> : null}
    </div>
  );
}

/** A green circle with a check, drawn at `p` (0 to 1). */
export function Check({ p, size = 22, color = GREEN }: { p: number; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity: Math.min(1, p * 3), transform: `scale(${0.6 + 0.4 * Math.min(1.1, p)})` }} aria-hidden>
      <circle cx="12" cy="12" r="10.5" fill="none" stroke={color} strokeWidth="2" />
      <path d="M7 12.5 L10.5 16 L17 8.5" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="16" strokeDashoffset={16 * (1 - Math.min(1, p))} />
    </svg>
  );
}

/** A brand mark in white, for marks that are black (Apple) on the dark desktop. */
export function White({ slug, size }: { slug: string; size: number }) {
  return (
    <div style={{ filter: "brightness(0) invert(1)" }}>
      <Logo slug={slug} size={size} ancla={false} />
    </div>
  );
}

/** A scene headline: display font, left-aligned, quiet like Rick's. */
export function Title({ x = 116, y = 100, size = 44, width = 388, color = INK, align = "left", children, style }: { x?: number; y?: number; size?: number; width?: number; color?: string; align?: "left" | "center"; children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="absolute font-display font-bold leading-[1.04] tracking-tight" style={{ left: x, top: y, width, fontSize: size, color, textAlign: align, ...style }}>
      {children}
    </div>
  );
}

/** A dimming veil over the desktop, for scenes that leave it (the cons, the other systems). */
export function Veil({ at, until, strength = 0.55 }: { at: number; until?: number; strength?: number }) {
  const t = useClock();
  const o = fade(t, at, 0.4) * (until === undefined ? 1 : 1 - fade(t, until, 0.4));
  return <div className="absolute inset-0" style={{ background: `rgba(6,7,10,${strength})`, opacity: o }} />;
}

/** Something that pops in at `at` (and leaves at `until`), positioned by its top-left corner. */
export function PopIn({ x, y, at, until, children, origin = "50% 50%", style }: { x: number; y: number; at: number; until?: number; children: ReactNode; origin?: string; style?: CSSProperties }) {
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  return (
    <div className="absolute" style={{ left: x, top: y, opacity: o, transform: `scale(${0.7 + 0.3 * Math.min(1.08, p)})`, transformOrigin: origin, ...style }}>
      {children}
    </div>
  );
}
