import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img } from "remotion";
import { useAssets } from "@motor/ui";
import { DUR, EASE, fade, popAt, unit, useClock } from "@motor/video";
import { ACCENT, DIM, INK, LINE, MUTED, PANEL, YELLOW } from "./world.tsx";

/*
 * The pieces every scene of the vision app shares: the canvas layer, the
 * small-caps title over the panel, a photo with the app's corner brackets, the
 * yellow detection box, probability bars and the mono notes under a panel.
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

/** 0 → 1 from `at` over `dur`, eased: for a color or a line that lights up. */
export function useOn(at: number, dur = 0.3): number {
  const t = useClock();
  return EASE.out(unit(t, at, dur));
}

/** The panel's title, in capitals and centered over the content, like the app's headers. */
export function Title({ y = 122, x = 36, width = 468, size = 28, color = INK, children, style }: { y?: number; x?: number; width?: number; size?: number; color?: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="absolute text-center font-display font-extrabold uppercase leading-[1.05] tracking-[0.01em]" style={{ left: x, top: y, width, fontSize: size, color, ...style }}>
      {children}
    </div>
  );
}

/** A title that swaps for another at `at`: the old one leaves, then the new one comes in. */
export function SwapTitle({ at, a, b, y, size }: { at: number; a: ReactNode; b: ReactNode; y?: number; size?: number }) {
  const t = useClock();
  const out = fade(t, at - 0.12, 0.14);
  const inn = EASE.out(unit(t, at + 0.02, 0.22));
  return (
    <>
      {out < 1 ? <Title y={y} size={size} style={{ opacity: 1 - out }}>{a}</Title> : null}
      {inn > 0 ? <Title y={y} size={size} style={{ opacity: inn, transform: `translateY(${(1 - inn) * 10}px)` }}>{b}</Title> : null}
    </>
  );
}

/** A picture of the piece (img/*.png), cropped to its box. */
export function Pic({ src, style, className }: { src: string; style?: CSSProperties; className?: string }) {
  const url = useAssets().image(src);
  return <Img src={url} className={className} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }} />;
}

/** The app's corner brackets around a panel. */
export function Corners({ w, h, color = ACCENT, size = 14, o = 1 }: { w: number; h: number; color?: string; size?: number; o?: number }) {
  const s = { position: "absolute" as const, width: size, height: size, borderColor: color, opacity: o };
  return (
    <>
      <i style={{ ...s, left: -5, top: -5, borderLeft: "2px solid", borderTop: "2px solid" }} />
      <i style={{ ...s, left: w - size + 5, top: -5, borderRight: "2px solid", borderTop: "2px solid" }} />
      <i style={{ ...s, left: -5, top: h - size + 5, borderLeft: "2px solid", borderBottom: "2px solid" }} />
      <i style={{ ...s, left: w - size + 5, top: h - size + 5, borderRight: "2px solid", borderBottom: "2px solid" }} />
    </>
  );
}

/**
 * A photo panel: the picture in its box with the corner brackets, popping in
 * at `at` (leaving at `until`), and a mono caption under it.
 */
export function Photo({ src, x, y, w, h, at, until, caption, right, children, imgStyle, corners = true }: { src: string; x: number; y: number; w: number; h: number; at: number; until?: number; caption?: string; right?: string; children?: ReactNode; imgStyle?: CSSProperties; corners?: boolean }) {
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  const s = 0.94 + 0.06 * Math.min(1, p);
  return (
    <div className="absolute" style={{ left: x, top: y, width: w, height: h, opacity: o, transform: `translateY(${(1 - Math.min(1, p)) * 18}px) scale(${s})` }}>
      <div className="absolute inset-0 overflow-hidden rounded-[4px]" style={{ background: PANEL }}>
        <Pic src={src} style={imgStyle} />
        {children}
      </div>
      {corners ? <Corners w={w} h={h} /> : null}
      {caption || right ? (
        <div data-ui="" className="absolute flex font-mono text-[12px]" style={{ left: 0, top: h + 8, width: w, color: MUTED }}>
          <span>{caption}</span>
          <span className="ml-auto" style={{ color: ACCENT }}>{right}</span>
        </div>
      ) : null}
    </div>
  );
}

/** A yellow detection box with its label and score, drawn from its top-left corner at `at`. */
export function DetBox({ x, y, w, h, label, at, color = YELLOW, until, size = 13 }: { x: number; y: number; w: number; h: number; label: string; at: number; color?: string; until?: number; size?: number }) {
  const t = useClock();
  const k = EASE.out(unit(t, at, 0.28));
  const out = until === undefined ? 0 : fade(t, until, DUR.quick);
  if (k <= 0 || out >= 1) return null;
  return (
    <div className="absolute" style={{ left: x, top: y, width: w * k, height: h * k, border: `2px solid ${color}`, borderRadius: 2, opacity: 1 - out, boxShadow: `0 0 10px ${color}55` }}>
      <div data-ui="" className="absolute whitespace-nowrap font-mono font-bold" style={{ left: -2, top: -size - 7, fontSize: size, lineHeight: `${size + 5}px`, padding: "0 4px", background: color, color: "#111", opacity: EASE.out(unit(t, at + 0.15, 0.15)) }}>
        {label}
      </div>
    </div>
  );
}

/** A mono note under a panel: data in small print, as the app writes it. */
export function Mono({ x, y, children, color = MUTED, size = 13, at = 0, width, align = "left" }: { x: number; y: number; children: ReactNode; color?: string; size?: number; at?: number; width?: number; align?: "left" | "center" | "right" }) {
  const o = useOn(at, 0.25);
  if (o <= 0) return null;
  return (
    <div data-ui="" className="absolute font-mono" style={{ left: x, top: y, width, fontSize: size, color, opacity: o, textAlign: align }}>
      {children}
    </div>
  );
}

/** "Ejemplo ilustrativo", in the app's small print. */
export function Ilustrativo({ x = 36, y = 790, at = 0 }: { x?: number; y?: number; at?: number }) {
  return (
    <Mono x={x} y={y} at={at} color={DIM} size={12}>
      EJEMPLO ILUSTRATIVO
    </Mono>
  );
}

/** One probability bar: the label, the track and the value, filling from `at`. */
export function Bar({ x, y, w, label, value, at, color = ACCENT, size = 22, strong = false, dur = 0.6 }: { x: number; y: number; w: number; label: string; value: number; at: number; color?: string; size?: number; strong?: boolean; dur?: number }) {
  const t = useClock();
  const k = EASE.out(unit(t, at, dur));
  const labelW = size * 4.2;
  const valueW = size * 4.2;
  const track = w - labelW - valueW;
  return (
    <div data-ui="" className="absolute flex items-center" style={{ left: x, top: y, width: w, height: size + 8 }}>
      <span className="font-mono font-bold" style={{ width: labelW, fontSize: size, color: strong ? INK : MUTED }}>{label}</span>
      <div className="relative overflow-hidden rounded-[3px]" style={{ width: track, height: Math.max(8, size * 0.42), background: "rgba(255,255,255,0.08)" }}>
        <div className="absolute left-0 top-0 h-full" style={{ width: `${value * k}%`, background: color, boxShadow: `0 0 8px ${color}66` }} />
      </div>
      <span className="text-right font-mono font-bold" style={{ width: valueW, fontSize: size, color: strong ? color : MUTED }}>
        {(value * k).toFixed(1).replace(".", ",")} %
      </span>
    </div>
  );
}

/** A thin panel card in the app's surface. */
export function Card({ x, y, w, h, at, until, children, border = LINE, style }: { x: number; y: number; w: number; h?: number; at: number; until?: number; children?: ReactNode; border?: string; style?: CSSProperties }) {
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  return (
    <div className="absolute overflow-hidden rounded-[8px]" style={{ left: x, top: y, width: w, height: h, background: PANEL, border: `1px solid ${border}`, opacity: o, transform: `translateY(${(1 - Math.min(1, p)) * 20}px)`, ...style }}>
      {children}
    </div>
  );
}

/** A bold yellow stamp of a word, landing with a little overshoot. */
export function Big({ x, y, w, at, children, size = 64, color = YELLOW, align = "center" }: { x: number; y: number; w: number; at: number; children: ReactNode; size?: number; color?: string; align?: "left" | "center" }) {
  const t = useClock();
  const p = popAt(t, at);
  if (p <= 0) return null;
  const flash = Math.max(0, 1 - unit(t, at, 0.5));
  return (
    <div className="absolute font-display font-black uppercase leading-none" style={{ left: x, top: y, width: w, fontSize: size, color, textAlign: align, opacity: Math.min(1, p * 2), transform: `scale(${0.6 + 0.4 * Math.min(1.08, p)})`, textShadow: `0 0 ${18 + 40 * flash}px ${color}${flash > 0.1 ? "AA" : "55"}` }}>
      {children}
    </div>
  );
}
