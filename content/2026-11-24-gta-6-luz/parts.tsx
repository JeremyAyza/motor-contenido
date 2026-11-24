import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img } from "remotion";
import { useAssets } from "@motor/ui";
import { DUR, EASE, bump, fade, lerp, popAt, unit, useClock } from "@motor/video";
import { ACCENT, INK, LIGHT } from "./palette.ts";

/*
 * The pieces every scene shares: the full canvas layer, a full-bleed photo
 * with a slow push, the poster-style year of each era (big white numerals with
 * a black outline and a hard shadow, like Rick's), a big single word, small
 * chips, a cutout and a ray of light that draws itself bounce by bounce.
 */

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

/** A picture of the piece (img/*.png), cropped to its box. */
export function Pic({ src, style }: { src: string; style?: CSSProperties }) {
  const url = useAssets().image(src);
  return <Img src={url} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }} />;
}

/**
 * A photo over the whole canvas, pushing in slowly so the frame never sits
 * still: from zoom `z0` to `z1` and from offset (x0, y0) to (x1, y1) over
 * `dur` seconds from `at`. It cuts in (a quick fade from the dark stage) and
 * cuts out at `until`. A shade at the bottom keeps the captions readable.
 * In the world, `t` is the scene's clock (BackProps).
 */
export function Backdrop({ src, t: time, at = -1, until, dur = 10, z0 = 1.03, z1 = 1.1, x0 = 0, x1 = 0, y0 = 0, y1 = 0, filter, children }: { src: string; t?: number; at?: number; until?: number; dur?: number; z0?: number; z1?: number; x0?: number; x1?: number; y0?: number; y1?: number; filter?: string; children?: ReactNode }) {
  const clock = useClock();
  const t = time ?? clock;
  const o = fade(t, at, 0.14) * (until === undefined ? 1 : 1 - fade(t, until - 0.14, 0.14));
  if (o <= 0) return null;
  const k = EASE.inOut(unit(t, at, dur));
  return (
    <div className="absolute left-0 top-0 overflow-hidden" style={{ width: 540, height: 960, opacity: o }}>
      <div className="absolute inset-0" style={{ transform: `translate(${lerp(x0, x1, k)}px, ${lerp(y0, y1, k)}px) scale(${lerp(z0, z1, k)})`, filter }}>
        <Pic src={src} />
      </div>
      {children}
      <div className="absolute left-0 w-full" style={{ top: 640, height: 320, background: "linear-gradient(180deg, rgba(20,20,24,0) 0%, rgba(20,20,24,0.55) 45%, rgba(20,20,24,0.82) 100%)" }} />
    </div>
  );
}

/** The poster type: Archivo black, white, with a black outline and a hard drop shadow. */
export const poster = (size: number, color = INK): CSSProperties => ({
  fontFamily: "var(--font-display)",
  fontWeight: 900,
  fontStretch: "112%",
  fontSize: size,
  lineHeight: 0.9,
  color,
  WebkitTextStroke: `${Math.max(3, size * 0.07)}px #111`,
  paintOrder: "stroke fill",
  textShadow: `${size * 0.05}px ${size * 0.06}px 0 #111`,
  letterSpacing: "-0.01em",
});

/** The year of an era, top left, with the game's name small at its side; it stamps in at `at`. */
export function YearTag({ year, name, at, until, x = 36, y = 112, size = 58 }: { year: string; name?: string; at: number; until?: number; x?: number; y?: number; size?: number }) {
  const t = useClock();
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  const nameIn = EASE.out(unit(t, at + 0.18, 0.25));
  return (
    <div className="absolute flex items-end gap-[12px]" style={{ left: x, top: y, opacity: o }}>
      <div style={{ ...poster(size), transform: `scale(${0.7 + 0.3 * Math.min(1, p)})`, transformOrigin: "left bottom" }}>{year}</div>
      {name ? (
        <div className="mb-[6px] rounded-[6px] font-semibold leading-[1.05]" style={{ fontSize: 22, color: INK, padding: "3px 8px", background: "rgba(20,20,24,0.62)", opacity: nameIn, maxWidth: 240 }}>
          {name}
        </div>
      ) : null}
    </div>
  );
}

/** A big single word ("LUZ"), stamped in with a flash of light. */
export function Word({ at, until, x = 36, y = 120, w = 468, size = 92, color = INK, align = "left", children }: { at: number; until?: number; x?: number; y?: number; w?: number; size?: number; color?: string; align?: "left" | "center" | "right"; children: ReactNode }) {
  const t = useClock();
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  const flash = bump(t, at, 0.7);
  return (
    <div className="absolute" style={{ left: x, top: y, width: w, textAlign: align, opacity: o, transform: `scale(${0.75 + 0.25 * Math.min(1.05, p)})`, transformOrigin: align === "left" ? "left center" : "center", filter: `drop-shadow(0 0 ${30 * flash}px ${LIGHT})` }}>
      <span style={poster(size, color)}>{children}</span>
    </div>
  );
}

/** A small label in a pill: 1 to 3 words. `tone` "accent" fills it with the account's violet. */
export function Chip({ at, until, x, y, tone = "dark", size = 22, children }: { at: number; until?: number; x: number; y: number; tone?: "dark" | "accent" | "light" | "amber"; size?: number; children: ReactNode }) {
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  const bg = tone === "accent" ? ACCENT : tone === "light" ? "rgba(255,248,242,0.94)" : tone === "amber" ? "#FFC23D" : "rgba(20,20,24,0.78)";
  const fg = tone === "dark" ? INK : "#16161A";
  return (
    <div className="absolute whitespace-nowrap rounded-full font-bold uppercase tracking-[0.02em]" style={{ left: x, top: y, fontSize: size, lineHeight: `${size + 14}px`, padding: `0 ${size * 0.7}px`, background: bg, color: fg, opacity: o, transform: `translateY(${(1 - Math.min(1, p)) * 14}px) scale(${0.85 + 0.15 * Math.min(1.05, p)})`, boxShadow: "0 6px 18px rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}>
      {children}
    </div>
  );
}

/** A transparent cutout (img/*-cut.png) in its box, popping in at `at`. */
export function Cutout({ src, x, y, w, h, at = -1, until, rotate = 0, origin = "50% 100%", flip = false, style }: { src: string; x: number; y: number; w: number; h: number; at?: number; until?: number; rotate?: number; origin?: string; flip?: boolean; style?: CSSProperties }) {
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  const url = useAssets().image(src);
  return (
    <div className="absolute" style={{ left: x, top: y, width: w, height: h, opacity: o, transformOrigin: origin, transform: `translateY(${(1 - Math.min(1, p)) * 24}px) rotate(${rotate}deg) scaleX(${flip ? -1 : 1})`, ...style }}>
      <Img src={url} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.35))" }} />
    </div>
  );
}

/**
 * A ray of light that draws itself: from point to point, each segment
 * starting at its point's `at` and taking `dur`, with a flash where it bounces.
 */
export function Ray({ points, color = LIGHT, width = 5, until, dashed = false }: { points: Array<{ x: number; y: number; at: number }>; color?: string; width?: number; until?: number; dashed?: boolean }) {
  const t = useClock();
  const out = until === undefined ? 0 : fade(t, until, DUR.quick);
  if (t < points[0].at || out >= 1) return null;
  const segs = points.slice(1).map((b, i) => {
    const a = points[i];
    const k = EASE.out(unit(t, a.at, Math.max(0.2, b.at - a.at)));
    return { a, b, k };
  });
  return (
    <svg className="absolute left-0 top-0" width={540} height={960} style={{ opacity: 1 - out, overflow: "visible" }}>
      <defs>
        <filter id="ray-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {segs.map(({ a, b, k }, i) =>
        k > 0 ? (
          <line key={i} x1={a.x} y1={a.y} x2={lerp(a.x, b.x, k)} y2={lerp(a.y, b.y, k)} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? "10 10" : undefined} filter="url(#ray-glow)" />
        ) : null,
      )}
      {points.slice(1, -1).map((p, i) => {
        const f = bump(t, p.at, 0.6);
        const on = t >= p.at;
        return on ? <circle key={i} cx={p.x} cy={p.y} r={8 + 22 * f} fill={color} opacity={0.35 + 0.6 * f} filter="url(#ray-glow)" /> : null;
      })}
      {(() => {
        const last = points[points.length - 1];
        const f = t >= last.at ? EASE.out(unit(t, last.at, 0.3)) : 0;
        return f > 0 ? <circle cx={last.x} cy={last.y} r={18 * f} fill="none" stroke={color} strokeWidth={4} filter="url(#ray-glow)" /> : null;
      })()}
    </svg>
  );
}

/** A card of small print over a photo: a title and a source line, as Rick's annotated captures. */
export function Card({ at, until, x, y, w, title, note }: { at: number; until?: number; x: number; y: number; w: number; title: ReactNode; note?: ReactNode }) {
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  return (
    <div className="absolute rounded-[10px]" style={{ left: x, top: y, width: w, padding: "12px 16px", background: "rgba(20,20,24,0.8)", border: "1px solid rgba(255,255,255,0.14)", opacity: o, transform: `translateY(${(1 - Math.min(1, p)) * 18}px)`, boxShadow: "0 10px 30px rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}>
      <div className="font-bold leading-[1.1]" style={{ fontSize: 24, color: INK }}>{title}</div>
      {note ? (
        <div data-ui="" className="mt-[6px] font-semibold" style={{ fontSize: 18, color: "#E6DFE3" }}>
          {note}
        </div>
      ) : null}
    </div>
  );
}
