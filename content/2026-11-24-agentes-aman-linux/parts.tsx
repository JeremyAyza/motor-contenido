import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { Logo } from "@motor/ui";
import { DUR, EASE, fade, popAt, unit, useClock, useStage } from "@motor/video";
import { BG, CHAPTERS, G, INK, MODEL, MUTED, PANEL } from "./world.tsx";

/*
 * The parts of the piece, taken from 2026-11-17-que-es-linux (Layer, GlowTitle,
 * Chip, LogoTile, Term) plus the ones of this Reel: Rick's pixel invader as
 * the model and his panels with crosshair corners.
 */

/**
 * Rick's HUD line: the prompt on the left and the chapter on the right, over a
 * thin rule. It lives in each scene's layer, not in the world, because the
 * stage draws the world scaled down and its text would fall under 12 px.
 */
function Hud() {
  const { sceneId } = useStage();
  const t = useClock();
  const title = CHAPTERS[sceneId];
  if (!title) return null;
  const first = sceneId === "humanos" ? EASE.out(unit(t, 0.1, 0.4)) : 1;
  return (
    <div data-ui="" className="absolute" style={{ left: 36, top: 54, width: 468, opacity: first }}>
      <div className="flex items-center justify-between pb-[5px]" style={{ borderBottom: `1px solid ${G}44` }}>
        <span className="font-mono text-[13px] font-bold" style={{ color: G }}>agent@linux:~$</span>
        <span className="font-mono text-[13px] font-bold tracking-[0.08em]" style={{ color: G }}>{title}</span>
      </div>
    </div>
  );
}

/** The whole 540×960 canvas, from its top-left corner, for a scene's Visual, with the HUD line on top. */
export function Layer({ children }: { children: ReactNode }) {
  return (
    <AbsoluteFill className="pointer-events-none" style={{ top: -42, bottom: "auto", height: 960 }}>
      <Hud />
      {children}
    </AbsoluteFill>
  );
}

/** 0 → 1 from `at` over `dur`, eased. */
export function useOn(at: number, dur = 0.3): number {
  const t = useClock();
  return EASE.out(unit(t, at, dur));
}

/** Pop-in progress and opacity for something that enters at `at` and leaves at `until`. */
export function usePresence(at: number, until?: number): { p: number; o: number; on: boolean } {
  const t = useClock();
  const p = popAt(t, at);
  const out = until === undefined ? 0 : fade(t, until, DUR.quick);
  return { p, o: Math.min(1, p * 2) * (1 - out), on: t >= at && out < 1 };
}

export const glowText = (color = G, k = 1): CSSProperties => ({ color, textShadow: `0 0 ${10 * k}px ${color}, 0 0 ${26 * k}px ${color}66` });

/** A mono title with phosphor glow, centered, like Rick's "PIPES" or "SAFETY". It types itself in from `at` and leaves at `until`. */
export function GlowTitle({ text, y, size = 44, at = 0, until, color = G, typed = true }: { text: string; y: number; size?: number; at?: number; until?: number; color?: string; typed?: boolean }) {
  const t = useClock();
  if (t < at) return null;
  const out = until === undefined ? 0 : fade(t, until, 0.25);
  if (out >= 1) return null;
  const n = typed ? Math.min(text.length, Math.floor((t - at) / 0.03) + 1) : text.length;
  return (
    <div className="absolute left-[36px] right-[36px] text-center font-mono font-bold uppercase leading-[1.05]" style={{ top: y, fontSize: size, opacity: 1 - out, ...glowText(color) }}>
      {text.slice(0, n)}
      <span style={{ opacity: 0 }}>{text.slice(n)}</span>
    </div>
  );
}

/** A small system label with a border. Centered on x, y. */
export function Chip({ x, y, at, until, children, color = G, solid = false, size = 13 }: { x: number; y: number; at: number; until?: number; children: ReactNode; color?: string; solid?: boolean; size?: number }) {
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  return (
    <div
      data-ui=""
      className="absolute whitespace-nowrap rounded-[4px] px-[7px] py-[3px] font-mono font-bold uppercase leading-none tracking-[0.08em]"
      style={{
        left: x,
        top: y,
        fontSize: size,
        color: solid ? BG : color,
        background: solid ? color : "rgba(3,8,6,0.85)",
        border: `1.5px solid ${color}`,
        boxShadow: `0 0 10px ${color}55`,
        opacity: o,
        transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * Math.min(1, p)})`,
      }}
    >
      {children}
    </div>
  );
}

/** A dark tile with a green glowing border and an official logo inside, with its name under it. Centered on x, y. */
export function LogoTile({ slug, x, y, at, until, size = 64, name, chip, color = G }: { slug: string; x: number; y: number; at: number; until?: number; size?: number; name?: string; chip?: boolean | string; color?: string }) {
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  return (
    <div className="absolute flex flex-col items-center" style={{ left: x, top: y, opacity: o, transform: `translate(-50%, -50%) translateY(${(1 - Math.min(1, p)) * 16}px) scale(${0.75 + 0.25 * Math.min(1, p)})` }}>
      <div className="flex items-center justify-center rounded-[14px]" style={{ width: size, height: size, background: "rgba(4,16,10,0.95)", border: `1.5px solid ${color}`, boxShadow: `0 0 14px ${color}66, inset 0 0 12px ${color}22` }}>
        <Logo slug={slug} size={size * 0.6} chip={chip} ancla={false} />
      </div>
      {name ? (
        <span data-ui="" className="mt-[6px] whitespace-nowrap font-mono text-[13px] font-bold uppercase tracking-[0.06em]" style={{ color }}>
          {name}
        </span>
      ) : null}
    </div>
  );
}

export type TermLine = { at: number; cmd?: string; out?: string; color?: string; prompt?: string; mark?: string };

/**
 * A dark terminal like Rick's "agent@linux": each line types its command from
 * `at` (a letter every 35 ms) and its output appears after. Example screens
 * carry the label from rule 3 in the title bar.
 */
export function Term({ x, y, w, h, title = "agent@linux: ~", prompt = "agent@linux:~$", lines, at, until, note = "EJEMPLO ILUSTRATIVO", size = 13, color = G }: { x: number; y: number; w: number; h: number; title?: string; prompt?: string; lines: TermLine[]; at: number; until?: number; note?: string | null; size?: number; color?: string }) {
  const t = useClock();
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  const last = [...lines].reverse().find((l) => l.cmd !== undefined && t >= l.at);
  return (
    <div
      data-ui=""
      className="absolute overflow-hidden rounded-[10px]"
      style={{ left: x, top: y, width: w, height: h, background: PANEL, border: `1.5px solid ${color}`, boxShadow: `0 0 18px ${color}44, 0 16px 40px rgba(0,0,0,0.7)`, opacity: o, transform: `translateY(${(1 - Math.min(1, p)) * 18}px)` }}
    >
      <div className="flex items-center justify-between px-[10px] py-[5px]" style={{ borderBottom: `1px solid ${color}55` }}>
        <span className="flex items-center gap-[5px]">
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} className="inline-block h-[7px] w-[7px] rounded-full" style={{ background: c }} />)}
          <span className="ml-[4px] font-mono text-[12px] font-bold" style={{ color }}>{title}</span>
        </span>
        {note ? <span className="font-mono text-[12px] font-bold tracking-[0.04em]" style={{ color: MUTED }}>{note}</span> : null}
      </div>
      <div className="px-[10px] py-[6px] font-mono leading-[1.45]" style={{ fontSize: size, color: INK }}>
        {lines.map((l, i) => {
          if (t < l.at) return null;
          if (l.cmd !== undefined) {
            const n = Math.min(l.cmd.length, Math.floor((t - l.at) / 0.035));
            return (
              <div key={i} className="whitespace-pre">
                <span style={{ color }}>{l.prompt ?? prompt}</span> {l.cmd.slice(0, n)}
                {l === last && Math.floor(t * 2.5) % 2 === 0 ? <span style={{ background: color }}>&nbsp;</span> : null}
              </div>
            );
          }
          const cmdBefore = [...lines.slice(0, i)].reverse().find((q) => q.cmd !== undefined);
          const ready = cmdBefore ? cmdBefore.at + (cmdBefore.cmd?.length ?? 0) * 0.035 + 0.12 : l.at;
          if (t < Math.max(ready, l.at)) return null;
          return (
            <div key={i} className="whitespace-pre" style={{ color: l.color ?? MUTED }}>
              {l.out}
              {l.mark ? <span style={{ color: G }}> {l.mark}</span> : null}
            </div>
          );
        })}
        {!last ? <span style={{ color }}>{prompt} {Math.floor(t * 2.5) % 2 === 0 ? <span style={{ background: color }}>&nbsp;</span> : null}</span> : null}
      </div>
    </div>
  );
}

/** Rick's model: a pixel invader. Centered on x, y; `px` is the size of one pixel. */
const INVADER = ["..X.....X..", "...X...X...", "..XXXXXXX..", ".XX.XXX.XX.", "XXXXXXXXXXX", "X.XXXXXXX.X", "X.X.....X.X", "...XX.XX..."];
export function Invader({ x, y, px = 8, at = 0, until, color = MODEL, label, wiggle = true }: { x: number; y: number; px?: number; at?: number; until?: number; color?: string; label?: string; wiggle?: boolean }) {
  const t = useClock();
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  const frame = wiggle && Math.floor(t * 2.4) % 2 === 1;
  const rows = frame ? [...INVADER.slice(0, 6), "..X.....X..", ".X.......X."] : INVADER;
  return (
    <div className="absolute flex flex-col items-center" style={{ left: x, top: y, opacity: o, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * Math.min(1, p)})` }}>
      <svg width={11 * px} height={8 * px} style={{ filter: `drop-shadow(0 0 ${px}px ${color}88)` }} aria-hidden>
        {rows.flatMap((row, r) => [...row].map((c, k) => (c === "X" ? <rect key={`${r}-${k}`} x={k * px} y={r * px} width={px} height={px} fill={color} /> : null)))}
      </svg>
      {label ? (
        <span data-ui="" className="mt-[8px] rounded-[3px] px-[8px] py-[2px] font-mono text-[13px] font-bold tracking-[0.1em]" style={{ color, border: `1.5px solid ${color}` }}>
          {label}
        </span>
      ) : null}
    </div>
  );
}

/** A panel with Rick's crosshair corners. Its children go inside, positioned from its top-left. */
export function Bracket({ x, y, w, h, at, until, color = G, title, children, fill = "rgba(4,16,10,0.6)" }: { x: number; y: number; w: number; h: number; at: number; until?: number; color?: string; title?: string; children?: ReactNode; fill?: string }) {
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  const c = 16;
  const k = Math.min(1, p);
  return (
    <div className="absolute" style={{ left: x, top: y, width: w, height: h, opacity: o, transform: `scale(${0.92 + 0.08 * k})` }}>
      <div className="absolute inset-0" style={{ background: fill, border: `1px solid ${color}55` }} />
      {[
        { left: -3, top: -3, borderLeft: `3px solid ${color}`, borderTop: `3px solid ${color}` },
        { right: -3, top: -3, borderRight: `3px solid ${color}`, borderTop: `3px solid ${color}` },
        { left: -3, bottom: -3, borderLeft: `3px solid ${color}`, borderBottom: `3px solid ${color}` },
        { right: -3, bottom: -3, borderRight: `3px solid ${color}`, borderBottom: `3px solid ${color}` },
      ].map((s, i) => <div key={i} className="absolute" style={{ width: c, height: c, ...s }} />)}
      {title ? (
        <div data-ui="" className="absolute left-1/2 top-[-13px] -translate-x-1/2 whitespace-nowrap px-[10px] py-[2px] font-mono text-[16px] font-bold tracking-[0.12em]" style={{ color, background: BG, border: `1.5px solid ${color}` }}>
          {title}
        </div>
      ) : null}
      {children}
    </div>
  );
}
