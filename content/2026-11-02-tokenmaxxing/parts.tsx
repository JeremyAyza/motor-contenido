import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { DUR, EASE, clamp01, fade, keys, lerp, popAt, unit, useClock } from "@motor/video";
import { ACCENT, INK, RED, TOKEN } from "./world.tsx";

/*
 * The pieces of the arcade screen: interface cards, a referee's stamp, the
 * cursor that plays the demo, the arcade token, bars, the source tag, the
 * level splash and the high-score table. Sizes and colors go in `style`
 * (Tailwind does not generate arbitrary classes from a piece's folder).
 */

const SURFACE = "var(--piece-surface)";
const MUTED = "var(--piece-muted)";

/**
 * The overlay of a scene, in canvas px (540×960), like the world: a scene's
 * Visual starts under the frame's tab (TAB_BOTTOM, 42 px), so the layer goes
 * back up by that much.
 */
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

/** A big title in the display font, centered on the canvas at `y`. */
export function Title({ at = 0, until, y, size = 46, children, style }: { at?: number; until?: number; y: number; size?: number; children: ReactNode; style?: CSSProperties }) {
  const { p, o, on } = usePresence(at, until);
  if (!on) return null;
  return (
    <div
      className="absolute text-center font-display font-black"
      style={{ left: 36, top: y, width: 468, fontSize: size, lineHeight: 1.02, letterSpacing: "-0.02em", color: INK, opacity: o, transform: `translateY(${(1 - Math.min(1, p)) * 18}px) scale(${0.9 + 0.1 * p})`, ...style }}
    >
      {children}
    </div>
  );
}

/** A word in the token color or the accent, inside a title. */
export function Hi({ children, tone = "token" }: { children: ReactNode; tone?: "token" | "accent" | "red" }) {
  return <span style={{ color: tone === "token" ? TOKEN : tone === "red" ? RED : ACCENT }}>{children}</span>;
}

/** An interface card of the cabinet: it rises in at `at`. Its text is interface (data-ui). */
export function Card({
  at = 0,
  until,
  x = 36,
  y,
  w = 468,
  h,
  label,
  border = "rgba(255,255,255,0.14)",
  from = 60,
  children,
  style,
}: {
  at?: number;
  until?: number;
  x?: number;
  y: number;
  w?: number;
  h?: number;
  label?: string;
  border?: string;
  from?: number;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const { p, o, on } = usePresence(at, until);
  if (!on) return null;
  return (
    <div
      data-ui=""
      className="absolute rounded-2xl"
      style={{ left: x, top: y, width: w, height: h, background: SURFACE, border: `2px solid ${border}`, padding: 16, opacity: o, transform: `translateY(${(1 - Math.min(1, p)) * from}px)`, ...style }}
    >
      {label ? (
        <div className="font-mono font-bold uppercase" style={{ fontSize: 15, letterSpacing: "0.12em", color: MUTED, marginBottom: 10 }}>
          {label}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/** The referee's stamp: it drops from a little bigger with weight, tilted, and leaves at `until`. */
export function Stamp({ at, until, x, y, rotate = -10, tone = "red", size = 40, children }: { at: number; until?: number; x: number; y: number; rotate?: number; tone?: "red" | "accent" | "token"; size?: number; children: ReactNode }) {
  const t = useClock();
  const out = until === undefined ? 0 : fade(t, until, DUR.quick);
  if (t < at || out >= 1) return null;
  const p = Math.min(1, popAt(t, at));
  const color = tone === "red" ? RED : tone === "token" ? TOKEN : ACCENT;
  return (
    <div
      className="absolute whitespace-nowrap rounded-xl font-display font-black uppercase"
      style={{ left: x, top: y, fontSize: size, lineHeight: 1, padding: "6px 16px", color, border: `5px solid ${color}`, background: "rgba(18,14,31,0.86)", transform: `translate(-50%, calc(-50% - ${(1 - p) * 40}px)) rotate(${rotate}deg) scale(${1.35 - 0.35 * p})`, opacity: Math.min(1, p * 3) * (1 - out) }}
    >
      {children}
    </div>
  );
}

/** The arcade token: a coin with a ring and a notched rim. */
export function Coin({ size = 40, color = TOKEN, style }: { size?: number; color?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block", overflow: "visible", ...style }} aria-hidden>
      <circle cx={20} cy={20} r={19} fill={color} />
      <circle cx={20} cy={20} r={13.5} fill="none" stroke="rgba(18,14,31,0.55)" strokeWidth={2.4} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <rect key={i} x={19} y={1.5} width={2} height={3.4} rx={1} fill="rgba(18,14,31,0.4)" transform={`rotate(${(a * 180) / Math.PI} 20 20)`} />;
      })}
      <path d="M 15 15 L 25 15 M 20 15 L 20 26" stroke="rgba(18,14,31,0.6)" strokeWidth={2.6} strokeLinecap="round" />
    </svg>
  );
}

/** A coin that falls from `y0` to `y1` between `at` and `at + dur`, spinning. */
export function FallingCoin({ at, x, y0 = 150, y1, dur = 0.55, size = 34, color }: { at: number; x: number; y0?: number; y1: number; dur?: number; size?: number; color?: string }) {
  const t = useClock();
  if (t < at) return null;
  const k = unit(t, at, dur);
  const y = lerp(y0, y1, EASE.in(k));
  const bounce = k >= 1 ? Math.max(0, Math.sin(Math.min(1, (t - at - dur) / 0.25) * Math.PI)) * 10 : 0;
  return (
    <div className="absolute" style={{ left: x - size / 2, top: y - size / 2 - bounce, transform: `scaleX(${Math.abs(Math.cos((t - at) * 9)) * 0.6 + 0.4})` }}>
      <Coin size={size} color={color} />
    </div>
  );
}

/** The mouse cursor that plays the demo: it glides between points and clicks. */
export function Cursor({ path, clicks = [] }: { path: Array<[number, number, number]>; clicks?: number[] }) {
  const t = useClock();
  if (t < path[0][0] - 0.2) return null;
  const x = keys(t, path.map(([s, px]) => [s, px] as [number, number]));
  const y = keys(t, path.map(([s, , py]) => [s, py] as [number, number]));
  const press = clicks.reduce((m, c) => Math.max(m, t >= c && t < c + 0.3 ? 1 - (t - c) / 0.3 : 0), 0);
  return (
    <div className="absolute" style={{ left: x, top: y, opacity: fade(t, path[0][0] - 0.2, 0.2) }}>
      {press > 0 ? <div className="absolute rounded-full" style={{ left: -18, top: -18, width: 36, height: 36, border: `3px solid ${INK}`, opacity: press, transform: `scale(${1.6 - 0.6 * press})` }} /> : null}
      <svg width={30} height={36} viewBox="0 0 30 36" style={{ display: "block", transform: `scale(${1 - 0.15 * press})`, transformOrigin: "0 0" }} aria-hidden>
        <path d="M 2 2 L 2 30 L 9.5 23 L 14.5 34 L 19.5 31.5 L 14.5 21 L 25 21 Z" fill="#FFFFFF" stroke="#120E1F" strokeWidth={2.4} strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** A labeled bar that fills to `value` (0 to 1) from `at` in `dur` seconds. */
export function Bar({ at, dur = 0.9, value, label, color = TOKEN, w = 436, h = 26, tremble = false }: { at: number; dur?: number; value: number; label: string; color?: string; w?: number; h?: number; tremble?: boolean }) {
  const t = useClock();
  const k = EASE.out(unit(t, at, dur));
  const shake = tremble ? Math.sin(t * 40) * 1.5 : 0;
  return (
    <div data-ui="" style={{ width: w }}>
      <div className="font-mono font-bold uppercase" style={{ fontSize: 15, letterSpacing: "0.12em", color: INK, marginBottom: 6 }}>
        {label}
      </div>
      <div className="relative overflow-hidden rounded-full" style={{ width: w, height: h, background: "rgba(255,255,255,0.08)", transform: `translateX(${shake}px)` }}>
        <div className="absolute rounded-full" style={{ left: 0, top: 0, height: h, width: `${Math.max(tremble ? 1.5 : 0, value * k * 100)}%`, background: color, boxShadow: `0 0 12px ${color}` }} />
      </div>
    </div>
  );
}

/** Where a fact comes from, in a small tag (AGENTS.md, rule 1). */
export function Source({ at, x = 36, y, children }: { at: number; x?: number; y: number; children: ReactNode }) {
  const { o, on } = usePresence(at);
  if (!on) return null;
  return (
    <div data-ui="" className="absolute font-mono uppercase" style={{ left: x, top: y, maxWidth: 504 - x, fontSize: 15, letterSpacing: "0.06em", color: MUTED, opacity: o }}>
      Fuente: {children}
    </div>
  );
}

/** "Ejemplo ilustrativo", under what is not data (AGENTS.md, rule 3). */
export function Illustrative({ at = 0, y = 760 }: { at?: number; y?: number }) {
  const { o, on } = usePresence(at);
  if (!on) return null;
  return (
    <div data-nota="" className="absolute text-center font-sans" style={{ left: 36, top: y, width: 468, fontSize: 22, color: MUTED, opacity: o }}>
      Ejemplo ilustrativo
    </div>
  );
}

/** A small mono label of the HUD, like "NIVEL 2 · UN AGENTE". */
export function Hud({ at = 0, until, x = 36, y = 172, color = TOKEN, children }: { at?: number; until?: number; x?: number; y?: number; color?: string; children: ReactNode }) {
  const { o, on } = usePresence(at, until);
  if (!on) return null;
  return (
    <div data-ui="" className="absolute font-mono font-bold uppercase" style={{ left: x, top: y, fontSize: 15, letterSpacing: "0.16em", color, opacity: o }}>
      {children}
    </div>
  );
}

/** The start of a level: NIVEL n big, and INSERT COIN blinking, from 0 to `until`. */
export function LevelSplash({ n, name, until = 1.5 }: { n: number | string; name: string; until?: number }) {
  const t = useClock();
  if (t > until + DUR.quick) return null;
  const p = popAt(t, 0);
  const out = fade(t, until, DUR.quick);
  const blink = Math.floor(t * 5) % 2 === 0 ? 1 : 0.25;
  return (
    <div className="absolute text-center" style={{ left: 36, top: 330, width: 468, opacity: Math.min(1, p * 2) * (1 - out), transform: `scale(${0.8 + 0.2 * Math.min(1, p)})` }}>
      <div className="font-display font-black uppercase" style={{ fontSize: 84, lineHeight: 0.95, color: TOKEN, textShadow: `0 0 24px ${TOKEN}` }}>
        Nivel {n}
      </div>
      <div className="font-display font-black" style={{ fontSize: 40, lineHeight: 1.05, color: INK, marginTop: 10 }}>
        {name}
      </div>
      <div data-ui="" className="font-mono font-bold uppercase" style={{ fontSize: 18, letterSpacing: "0.3em", color: ACCENT, marginTop: 26, opacity: blink }}>
        Insert coin
      </div>
    </div>
  );
}

/** A 5×5 pixel face, its pattern from a seed. */
export function PixelFace({ seed, size = 34, color }: { seed: number; size?: number; color: string }) {
  const cells: Array<[number, number]> = [];
  let s = seed * 9301 + 49297;
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 3; x++) {
      s = (s * 9301 + 49297) % 233280;
      if (s / 233280 > 0.45 || (y === 1 && x === 1)) {
        cells.push([x, y]);
        if (x < 2) cells.push([4 - x, y]);
      }
    }
  }
  return (
    <svg width={size} height={size} viewBox="0 0 5 5" style={{ display: "block", shapeRendering: "crispEdges" }} aria-hidden>
      <rect width={5} height={5} fill="rgba(255,255,255,0.06)" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />
      ))}
    </svg>
  );
}

export type Player = { name: string; seed: number; fichas: string; entregado: string; byFichas: number; byEntregado: number; color: string };

/** The high-score table: its rows slide from one order to the other as `sort` goes 0 → 1. */
export function Leaderboard({ players, sort = 0, rowH = 64, highlight, showEntregado = false }: { players: Player[]; sort?: number; rowH?: number; highlight?: string; showEntregado?: boolean }) {
  const k = EASE.inOut(clamp01(sort));
  return (
    <div className="relative" style={{ height: players.length * rowH }}>
      {players.map((pl) => {
        const rank = lerp(pl.byFichas, pl.byEntregado, k);
        const shown = Math.round(lerp(pl.byFichas, pl.byEntregado, k >= 0.5 ? 1 : 0)) + 1;
        const lit = highlight === pl.name;
        return (
          <div
            key={pl.name}
            className="absolute flex items-center rounded-xl"
            style={{ left: 0, top: rank * rowH, width: "100%", height: rowH - 8, padding: "0 12px", gap: 12, background: lit ? "rgba(255,79,154,0.16)" : "rgba(255,255,255,0.04)", border: lit ? `2px solid ${TOKEN}` : "2px solid transparent" }}
          >
            <span className="font-mono font-bold tabular-nums" style={{ fontSize: 22, width: 30, color: shown === 1 ? ACCENT : MUTED }}>
              {shown}
            </span>
            <PixelFace seed={pl.seed} color={pl.color} />
            <span className="flex-1 font-sans font-bold" style={{ fontSize: 22, color: INK }}>
              {pl.name}
            </span>
            <span className="font-mono font-bold tabular-nums" style={{ fontSize: 20, color: TOKEN, opacity: 1 - 0.65 * k }}>
              {pl.fichas}
            </span>
            {showEntregado ? (
              <span className="font-mono font-bold tabular-nums" style={{ fontSize: 20, width: 64, textAlign: "right", color: ACCENT, opacity: 0.4 + 0.6 * k }}>
                {pl.entregado}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
