import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { Logo } from "@motor/ui";
import { DUR, EASE, fade, lerp, popAt, unit, useClock } from "@motor/video";
import { BG, GO, GOLD, INK, LINE, MUTED, PANEL, RUST, SURFACE } from "./world.tsx";

/** The whole 540×960 canvas, from its top-left corner, for a scene's Visual. */
export function Layer({ children }: { children: ReactNode }) {
  return (
    <AbsoluteFill className="pointer-events-none" style={{ top: -42, bottom: "auto", height: 960 }}>
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

/** The outlined display face of Rick's chapter words ("THREADS", "OWNERSHIP"): heavy, with a dark outline and a short drop. */
export const outlined = (color: string): CSSProperties => ({
  color,
  WebkitTextStroke: "1.5px rgba(10,11,13,0.9)",
  textShadow: "3px 3px 0 rgba(10,11,13,0.85)",
});

/** A chapter word, big and heavy, that drops in at `at` and leaves at `until`. Its left edge (or center) at x. */
export function BigWord({ text, x, y, size = 52, color = INK, at, until, align = "left", width = 468 }: { text: string; x: number; y: number; size?: number; color?: string; at: number; until?: number; align?: "left" | "center"; width?: number }) {
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  return (
    <div
      className="absolute font-display font-black uppercase leading-[0.98] tracking-tight"
      style={{ left: align === "center" ? x - width / 2 : x, top: y, width, textAlign: align, fontSize: size, opacity: o, transform: `translateY(${(1 - Math.min(1, p)) * -14}px) scale(${0.9 + 0.1 * Math.min(1, p)})`, transformOrigin: align === "center" ? "50% 50%" : "0% 50%", ...outlined(color) }}
    >
      {text}
    </div>
  );
}

/** A small system label, like Rick's "network servers" or "written in Go". Centered on x, y. */
export function Chip({ x, y, at, until, children, color = INK, solid = false, size = 13 }: { x: number; y: number; at: number; until?: number; children: ReactNode; color?: string; solid?: boolean; size?: number }) {
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  return (
    <div
      data-ui=""
      className="absolute whitespace-nowrap rounded-[4px] px-[7px] py-[4px] font-mono font-bold leading-none"
      style={{
        left: x,
        top: y,
        fontSize: size,
        color: solid ? BG : color,
        background: solid ? color : "rgba(22,24,27,0.92)",
        border: `1.5px solid ${color}`,
        opacity: o,
        transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * Math.min(1, p)})`,
      }}
    >
      {children}
    </div>
  );
}

/** A small caption in mono, gray, for what a drawing is ("1 hilo", "10 trabajadores reales"). Top-left at x, y. */
export function Small({ x, y, at, until, children, color = MUTED, size = 12, center = false, w }: { x: number; y: number; at: number; until?: number; children: ReactNode; color?: string; size?: number; center?: boolean; w?: number }) {
  const { o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  return (
    <div data-ui="" className="absolute whitespace-nowrap font-mono font-bold leading-[1.2]" style={{ left: center ? x - (w ?? 200) / 2 : x, width: center ? (w ?? 200) : undefined, textAlign: center ? "center" : undefined, top: y, fontSize: size, color, opacity: o }}>
      {children}
    </div>
  );
}

/** The Rust mark as Rick shows it: the black gear on an orange disc. */
export function RustMark({ size }: { size: number }) {
  return (
    <div className="flex items-center justify-center rounded-full" style={{ width: size, height: size, background: RUST, boxShadow: "0 3px 0 rgba(10,11,13,0.6)" }}>
      <Logo slug="rust" size={size * 0.8} ancla={false} />
    </div>
  );
}

/** Go's or Rust's mark in the flow of a layout (not positioned). */
export function InlineMark({ lang, size }: { lang: "go" | "rust"; size: number }) {
  return lang === "go" ? <Logo slug="go" size={size} ancla={false} /> : <RustMark size={size * 0.8} />;
}

/** Go's or Rust's mark, centered on x, y, entering at `at`. */
export function LangMark({ lang, x, y, size, at, until, from = "left" }: { lang: "go" | "rust"; x: number; y: number; size: number; at: number; until?: number; from?: "left" | "top" }) {
  const t = useClock();
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  const q = Math.min(1, p);
  const dx = from === "left" ? (1 - EASE.out(unit(t, at, 0.5))) * -120 : 0;
  const dy = from === "top" ? (1 - q) * -60 : 0;
  const spin = lang === "rust" ? (1 - q) * -120 : 0;
  return (
    <div className="absolute" style={{ left: x, top: y, opacity: o, transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) rotate(${spin}deg)` }}>
      {lang === "go" ? (
        <div className="relative">
          {dx < -4 ? <div className="absolute right-[100%] top-[30%] h-[30%]" style={{ width: -dx * 0.6, background: `linear-gradient(90deg, transparent, ${GO}88)` }} /> : null}
          <Logo slug="go" size={size} ancla={false} />
        </div>
      ) : (
        <RustMark size={size} />
      )}
    </div>
  );
}

/** A square tile with a gold frame and an official logo, its name under it, like Rick's company tiles. Centered on x, y. */
export function LogoTile({ slug, x, y, at, until, size = 62, name, note, noteColor = MUTED, dim = 0 }: { slug: string; x: number; y: number; at: number; until?: number; size?: number; name?: string; note?: string; noteColor?: string; dim?: number }) {
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  return (
    <div className="absolute flex flex-col items-center" style={{ left: x, top: y, opacity: o * (1 - dim * 0.65), transform: `translate(-50%, -50%) translateY(${(1 - Math.min(1, p)) * -22}px) scale(${0.8 + 0.2 * Math.min(1, p)})` }}>
      <div className="flex items-center justify-center rounded-[6px]" style={{ width: size, height: size, background: "#1A1C1F", border: `3px solid ${GOLD}`, boxShadow: "0 4px 0 rgba(10,11,13,0.55), inset 0 0 0 2px #6E5634" }}>
        <Logo slug={slug} size={size * 0.62} ancla={false} />
      </div>
      {name ? (
        <span data-ui="" className="mt-[5px] font-mono text-[12px] font-bold" style={{ color: INK }}>
          {name}
        </span>
      ) : null}
      {note ? (
        <span data-ui="" className="font-mono text-[12px] font-bold" style={{ color: noteColor }}>
          {note}
        </span>
      ) : null}
    </div>
  );
}

/** The inside of the fixed terminal (world.tsx), under its title bar. Everything in it is interface. */
export function PanelBody({ children, at = 0, until }: { children: ReactNode; at?: number; until?: number }) {
  const { o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  return (
    <div data-ui="" className="absolute overflow-hidden" style={{ left: PANEL.x + 12, top: PANEL.y + 34, width: PANEL.w - 24, height: PANEL.h - 44, opacity: o }}>
      {children}
    </div>
  );
}

/** One line of code or output that types itself from `at`; `hot` lights its background like a highlighted line. */
export function CodeLine({ at, children, color = INK, size = 14, hot, typed = true }: { at: number; children: string; color?: string; size?: number; hot?: string; typed?: boolean }) {
  const t = useClock();
  if (t < at) return null;
  const n = typed ? Math.min(children.length, Math.floor((t - at) / 0.025) + 1) : children.length;
  return (
    <div className="whitespace-pre font-mono leading-[1.5]" style={{ fontSize: size, color, background: hot ?? "transparent", marginLeft: hot ? -4 : 0, paddingLeft: hot ? 4 : 0, borderRadius: 3 }}>
      {children.slice(0, n)}
      <span style={{ opacity: 0 }}>{children.slice(n)}</span>
    </div>
  );
}

/** A big number in the panel that counts from `from` to `to` between `at` and `at + dur`. */
export function Count({ from, to, at, dur = 0.8, decimals = 0, suffix = "", size = 54, color = INK }: { from: number; to: number; at: number; dur?: number; decimals?: number; suffix?: string; size?: number; color?: string }) {
  const t = useClock();
  const v = lerp(from, to, EASE.out(unit(t, at, dur)));
  const text = v.toLocaleString("es-ES", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: true });
  return (
    <div className="font-display font-black leading-[1]" style={{ fontSize: size, color }}>
      {text}
      {suffix}
    </div>
  );
}

/** A little worker, the way Rick draws threads and owners: a head, a body and a badge color. Its feet at x, y. */
export function Worker({ x, y, s = 1, color = GO, opacity = 1, label }: { x: number; y: number; s?: number; color?: string; opacity?: number; label?: string }) {
  const t = useClock();
  const bob = Math.sin(t * 5 + x * 0.1) * 0.8;
  if (opacity <= 0) return null;
  return (
    <div className="absolute" style={{ left: x - 11 * s, top: y - 34 * s, width: 22 * s, height: 34 * s, opacity }}>
      <svg width={22 * s} height={34 * s} viewBox="0 0 22 34" aria-hidden>
        <g style={{ transform: `translateY(${bob}px)` }}>
          <circle cx={11} cy={7} r={6} fill="#E8E2D4" />
          <rect x={4} y={14} width={14} height={13} rx={4} fill={color} />
        </g>
        <rect x={6} y={27} width={4} height={7} rx={2} fill="#C9C3B6" />
        <rect x={12} y={27} width={4} height={7} rx={2} fill="#C9C3B6" />
      </svg>
      {label ? (
        <span data-ui="" className="absolute left-1/2 top-[-18px] -translate-x-1/2 whitespace-nowrap rounded-[3px] px-[4px] font-mono text-[12px] font-bold leading-[1.3]" style={{ background: color, color: BG }}>
          {label}
        </span>
      ) : null}
    </div>
  );
}

/** A wooden crate of memory, like Rick's orders. Top-left at x, y. */
export function Crate({ x, y, size = 26, opacity = 1, crossed = 0, label }: { x: number; y: number; size?: number; opacity?: number; crossed?: number; label?: string }) {
  if (opacity <= 0) return null;
  return (
    <div className="absolute" style={{ left: x, top: y, width: size, height: size, opacity }}>
      <svg width={size} height={size} viewBox="0 0 26 26" aria-hidden>
        <rect x={1} y={1} width={24} height={24} rx={2} fill="#B07A43" stroke="#6B4524" strokeWidth={2} />
        <line x1={1} y1={9} x2={25} y2={9} stroke="#8A5A30" strokeWidth={1.5} />
        <line x1={1} y1={17} x2={25} y2={17} stroke="#8A5A30" strokeWidth={1.5} />
        {crossed > 0 ? (
          <g opacity={crossed}>
            <line x1={3} y1={3} x2={23} y2={23} stroke="#2A2D31" strokeWidth={3} />
            <line x1={23} y1={3} x2={3} y2={23} stroke="#2A2D31" strokeWidth={3} />
          </g>
        ) : null}
      </svg>
      {label ? (
        <span data-ui="" className="absolute left-1/2 top-[100%] mt-[3px] -translate-x-1/2 whitespace-nowrap rounded-[3px] px-[4px] font-mono text-[12px] font-bold" style={{ background: SURFACE, color: INK, border: `1px solid ${LINE}` }}>
          {label}
        </span>
      ) : null}
    </div>
  );
}

/** A sheet of code: a little page with lines. Centered on x, y. */
export function Sheet({ x, y, rot = 0, opacity = 1, s = 1, color = "#EDE8DC" }: { x: number; y: number; rot?: number; opacity?: number; s?: number; color?: string }) {
  if (opacity <= 0) return null;
  return (
    <div className="absolute" style={{ left: x - 14 * s, top: y - 18 * s, width: 28 * s, height: 36 * s, opacity, transform: `rotate(${rot}deg)` }}>
      <svg width={28 * s} height={36 * s} viewBox="0 0 28 36" aria-hidden>
        <rect x={0.5} y={0.5} width={27} height={35} rx={2} fill={color} stroke="#B9B2A3" />
        {[7, 12, 17, 22, 27].map((ly, i) => (
          <rect key={ly} x={4} y={ly} width={i % 2 ? 14 : 20} height={2} rx={1} fill="#9C9585" />
        ))}
      </svg>
    </div>
  );
}

/** A short strip of machine code coming out of the compiler. Centered on x, y. */
export function Strip({ x, y, opacity = 1, color = GO }: { x: number; y: number; opacity?: number; color?: string }) {
  if (opacity <= 0) return null;
  return (
    <div className="absolute rounded-[3px] px-[5px] py-[2px] font-mono text-[12px] font-bold" data-ui="" style={{ left: x, top: y, opacity, transform: "translate(-50%, -50%)", background: SURFACE, color, border: `1px solid ${color}` }}>
      01101
    </div>
  );
}

/**
 * The compile belt that crosses the band, with its station in the middle:
 * the same belt for Go ("go build") and Rust ("rustc"). Sheets of code ride
 * in from the left and leave as strips of machine code.
 */
export function Belt({ y, station, color, t0, opacity = 1 }: { y: number; station: string; color: string; t0: number; opacity?: number }) {
  const t = useClock();
  if (opacity <= 0) return null;
  const shift = (t * 40) % 24;
  const items = [0, 1, 2, 3];
  return (
    <div className="absolute left-0 top-0" style={{ width: 540, height: 960, opacity }}>
      <div className="absolute left-0 right-0" style={{ top: y - 9, height: 18, background: `repeating-linear-gradient(90deg, #1B1D20 0 12px, #2C3035 12px 24px)`, backgroundPosition: `${shift}px 0`, borderTop: "2px solid #11120F", borderBottom: "2px solid #11120F" }} />
      <div className="absolute flex items-center justify-center rounded-[6px]" style={{ left: 270 - 56, top: y - 44, width: 112, height: 88, background: "#1C1E21", border: `2px solid ${color}`, boxShadow: "0 6px 0 rgba(10,11,13,0.6)" }}>
        <span className="rounded-[3px] px-[6px] py-[3px] font-mono text-[14px] font-bold" data-ui="" style={{ background: color, color: BG }}>
          {station}
        </span>
      </div>
      {items.map((i) => {
        const cycle = 3.2;
        const local = (((t - t0) / cycle + i / items.length) % 1 + 1) % 1;
        const xPos = lerp(-30, 570, local);
        if (t < t0 + (i * cycle) / items.length) return null;
        const inside = xPos > 214 && xPos < 326;
        if (inside) return null;
        // Things on the belt fade at the frame's margins, so no label crosses them.
        const edge = Math.min(1, Math.max(0, (xPos - 40) / 30), Math.max(0, (480 - xPos) / 30));
        if (edge <= 0) return null;
        return xPos < 270 ? <Sheet key={i} x={xPos} y={y - 24} s={0.9} opacity={edge} /> : <Strip key={i} x={xPos} y={y - 20} color={color} opacity={edge} />;
      })}
    </div>
  );
}

/** A horizontal benchmark bar: the name, the bar that grows from `at`, and its value. Top-left at x, y. */
export function BarRow({ x, y, label, mark, value, max, width, color, at, unitLabel = " ms" }: { x: number; y: number; label: string; mark?: ReactNode; value: number; max: number; width: number; color: string; at: number; unitLabel?: string }) {
  const t = useClock();
  const { o, on } = usePresence(at);
  if (!on) return null;
  const k = EASE.out(unit(t, at, 0.7));
  const w = (value / max) * width * k;
  return (
    <div className="absolute" style={{ left: x, top: y, opacity: o }}>
      <div className="flex items-center gap-[6px]">
        {mark}
        <span data-ui="" className="font-mono text-[14px] font-bold" style={{ color: INK }}>{label}</span>
      </div>
      <div className="mt-[4px] flex items-center gap-[8px]">
        <div style={{ width: w, height: 20, background: color, borderRadius: 2 }} />
        <span data-ui="" className="font-mono text-[15px] font-bold" style={{ color: INK }}>
          {(value * k).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          {unitLabel}
        </span>
      </div>
    </div>
  );
}

/** A round gauge whose needle rises from `low` to `high` at `at`. Centered on x, y. */
export function Gauge({ x, y, r = 46, label, at, low = 0.15, high = 0.85, color = INK }: { x: number; y: number; r?: number; label: string; at: number; low?: number; high?: number; color?: string }) {
  const t = useClock();
  const v = lerp(low, high, popAt(t, at) > 0 ? Math.min(1.04, popAt(t, at)) : 0);
  const a = Math.PI * (1.15 - 1.3 * v);
  const lit = t >= at;
  return (
    <div className="absolute" style={{ left: x - r, top: y - r, width: r * 2 }}>
      <svg width={r * 2} height={r * 2} viewBox={`0 0 ${r * 2} ${r * 2}`} aria-hidden>
        <circle cx={r} cy={r} r={r - 2} fill="#1A1C1F" stroke={lit ? color : LINE} strokeWidth={3} />
        {[0, 0.25, 0.5, 0.75, 1].map((k) => {
          const b = Math.PI * (1.15 - 1.3 * k);
          return <line key={k} x1={r + Math.cos(b) * (r - 8)} y1={r - Math.sin(b) * (r - 8)} x2={r + Math.cos(b) * (r - 14)} y2={r - Math.sin(b) * (r - 14)} stroke={MUTED} strokeWidth={2} />;
        })}
        <line x1={r} y1={r} x2={r + Math.cos(a) * (r - 12)} y2={r - Math.sin(a) * (r - 12)} stroke={lit ? color : MUTED} strokeWidth={4} strokeLinecap="round" />
        <circle cx={r} cy={r} r={5} fill={lit ? color : MUTED} />
      </svg>
      <div data-ui="" className="mt-[4px] text-center font-mono text-[13px] font-bold" style={{ color: lit ? INK : MUTED }}>{label}</div>
    </div>
  );
}

/** The label from rule 3 for the example measurements, small, in the corner of a drawing. */
export function Example({ x, y, at, until, text = "Medición de ejemplo" }: { x: number; y: number; at: number; until?: number; text?: string }) {
  return (
    <Small x={x} y={y} at={at} until={until} color="#A9AEB6">
      {text}
    </Small>
  );
}
