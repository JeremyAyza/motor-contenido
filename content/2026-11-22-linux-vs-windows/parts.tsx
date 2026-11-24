import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img } from "remotion";
import { Icono, Logo, useAssets } from "@motor/ui";
import { DUR, EASE, fade, lerp, popAt, unit, useClock } from "@motor/video";
import { AMBER, BG, CARD, DIM, INK, LINE, MUTED, OK, SURFACE, TUX, TUX_DEEP, WIN, WIN_DEEP } from "./world.tsx";

/*
 * The pieces every scene of "Linux vs Windows" shares, drawn like the
 * referent's: dark cards with a thin border and small radius, lists that
 * light up row by row with the voice, a monitor split in two, Windows-style
 * windows and terminals that type. Every time is in seconds of the scene.
 */

/** The avatar's corner: what a scene with the presenter leaves free at the bottom left. */
export const AV = { right: 228, top: 572 };
/** Where the big line goes when the presenter is on: right of the avatar. */
export const SIDE = { x: 240, y: 588, w: 266 };

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

/** A box that rises into place at `at` and fades at `until`. Top-left at x, y. */
export function Rise({ x, y, w, h, at, until, children, style, dy = 18 }: { x: number; y: number; w: number; h?: number; at: number; until?: number; children: ReactNode; style?: CSSProperties; dy?: number }) {
  const t = useClock();
  const k = EASE.out(unit(t, at, 0.4));
  const out = until === undefined ? 0 : fade(t, until, DUR.quick);
  if (k <= 0 || out >= 1) return null;
  return (
    <div className="absolute" style={{ left: x, top: y, width: w, height: h, opacity: Math.min(1, k * 1.6) * (1 - out), transform: `translateY(${(1 - k) * dy}px)`, ...style }}>
      {children}
    </div>
  );
}

/** A dark card with the referent's thin border. */
export function Card({ children, style, border = LINE, bg = CARD, className = "" }: { children?: ReactNode; style?: CSSProperties; border?: string; bg?: string; className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden rounded-[8px] ${className}`} style={{ background: bg, border: `1.5px solid ${border}`, boxShadow: "0 14px 30px rgba(0,0,0,0.45)", ...style }}>
      {children}
    </div>
  );
}

/** A heavy display line, left aligned (or centered on x). Words in <Hi> take a color. */
export function Big({ x, y, w = 468, size = 44, at, until, children, color = INK, align = "left", upper = false }: { x: number; y: number; w?: number; size?: number; at: number; until?: number; children: ReactNode; color?: string; align?: "left" | "center" | "right"; upper?: boolean }) {
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  const q = Math.min(1, p);
  return (
    <div
      className={`absolute font-display font-black leading-[1.02] tracking-tight ${upper ? "uppercase" : ""}`}
      style={{ left: align === "center" ? x - w / 2 : x, top: y, width: w, textAlign: align, fontSize: size, color, opacity: o, transform: `translateY(${(1 - q) * 14}px) scale(${0.92 + 0.08 * q})`, transformOrigin: align === "center" ? "50% 50%" : align === "right" ? "100% 50%" : "0% 50%" }}
    >
      {children}
    </div>
  );
}

/** A colored word inside <Big>. */
export function Hi({ children, color }: { children: ReactNode; color: string }) {
  return <span style={{ color }}>{children}</span>;
}

/** A small system label, centered on x, y. */
export function Chip({ x, y, at, until, children, color = INK, solid = false, size = 13 }: { x: number; y: number; at: number; until?: number; children: ReactNode; color?: string; solid?: boolean; size?: number }) {
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  return (
    <div
      data-ui=""
      className="absolute whitespace-nowrap rounded-[4px] px-[8px] py-[5px] font-mono font-bold uppercase leading-none tracking-[0.06em]"
      style={{ left: x, top: y, fontSize: size, color: solid ? BG : color, background: solid ? color : "rgba(17,23,32,0.95)", border: `1.5px solid ${color}`, opacity: o, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * Math.min(1, p)})` }}
    >
      {children}
    </div>
  );
}

/** A gray note in mono, centered on x (or left at x). */
export function Note({ x, y, at, until, children, color = MUTED, size = 13, w = 468, center = true }: { x: number; y: number; at: number; until?: number; children: ReactNode; color?: string; size?: number; w?: number; center?: boolean }) {
  const { o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  return (
    <div data-ui="" className="absolute font-mono font-bold leading-[1.25]" style={{ left: center ? x - w / 2 : x, width: w, textAlign: center ? "center" : "left", top: y, fontSize: size, color, opacity: o }}>
      {children}
    </div>
  );
}

export type RowDef = { text: ReactNode; tag?: ReactNode; at: number; color?: string; icon?: ReactNode };

/**
 * A list of rows that light up one by one with the voice: dim before their
 * `at`, then lit with a colored edge and their tag. `dimFrom` dims the whole
 * list again (when the other side talks).
 */
export function Rows({ x, y, w, rows, rowH = 50, gap = 8, at = 0, until, title, titleColor = MUTED, dimFrom, size = 17 }: { x: number; y: number; w: number; rows: RowDef[]; rowH?: number; gap?: number; at?: number; until?: number; title?: ReactNode; titleColor?: string; dimFrom?: number; size?: number }) {
  const t = useClock();
  const enter = EASE.out(unit(t, at, 0.35));
  const out = until === undefined ? 0 : fade(t, until, DUR.quick);
  if (enter <= 0 || out >= 1) return null;
  const dim = dimFrom === undefined ? 0 : EASE.out(unit(t, dimFrom, 0.3)) * 0.65;
  const top = title ? 26 : 0;
  return (
    <div data-ui="" className="absolute" style={{ left: x, top: y, width: w, opacity: enter * (1 - out) * (1 - dim), transform: `translateY(${(1 - enter) * 16}px)` }}>
      {title ? (
        <div className="absolute left-0 font-mono text-[12px] font-bold uppercase tracking-[0.2em]" style={{ top: 0, color: titleColor }}>
          {title}
        </div>
      ) : null}
      {rows.map((row, i) => {
        const lit = EASE.out(unit(t, row.at, 0.25));
        const color = row.color ?? OK;
        const pulse = Math.max(0, 1 - Math.abs(t - row.at - 0.12) * 5);
        return (
          <div
            key={i}
            className="absolute flex items-center justify-between overflow-hidden rounded-[6px] px-[14px]"
            style={{
              left: 0,
              top: top + i * (rowH + gap),
              width: w,
              height: rowH,
              background: lit > 0 ? mixBg(color, lit) : SURFACE,
              border: `1.5px solid ${lit > 0.5 ? color : LINE}`,
              transform: `scale(${1 + pulse * 0.025})`,
            }}
          >
            <span className="flex items-center gap-[10px] font-sans font-semibold leading-none" style={{ fontSize: size, color: lit > 0.5 ? INK : DIM }}>
              {row.icon}
              {row.text}
            </span>
            {row.tag ? (
              <span className="font-mono text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color, opacity: lit }}>
                {row.tag}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
/** The card color, tinted by `color` as much as `k` says (a lit row). */
function mixBg(color: string, k: number): string {
  const [r, g, b] = hex(color);
  const [R, G, B] = hex(SURFACE);
  const a = 0.16 * k;
  return `rgb(${Math.round(lerp(R, r, a))}, ${Math.round(lerp(G, g, a))}, ${Math.round(lerp(B, b, a))})`;
}

/** Windows' or Linux's mark on its half of the monitor. */
export function SideMark({ side, size = 64, label = true }: { side: "win" | "tux"; size?: number; label?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-[10px]">
      <Logo slug={side === "win" ? "windows" : "tux"} size={size} ancla={false} />
      {label ? (
        <span data-ui="" className="font-mono text-[14px] font-bold uppercase tracking-[0.3em]" style={{ color: side === "win" ? "#BFD9F7" : "#F6C9A4" }}>
          {side === "win" ? "Windows" : "Linux"}
        </span>
      ) : null}
    </div>
  );
}

/**
 * The monitor of the hook and the chapters: a screen split in two halves,
 * Windows left and Linux right, each lit as much as its `win` and `tux` say;
 * with `only`, one side fills the screen.
 */
export function Monitor({ x, y, w, h, win = 1, tux = 1, only, children, o = 1, scale = 1 }: { x: number; y: number; w: number; h: number; win?: number; tux?: number; only?: "win" | "tux"; children?: ReactNode; o?: number; scale?: number }) {
  const half = (side: "win" | "tux", lit: number) => (
    <div className="relative flex h-full flex-1 items-center justify-center" style={{ background: side === "win" ? `linear-gradient(160deg, ${WIN_DEEP}, #081627)` : `linear-gradient(200deg, ${TUX_DEEP}, #1E140C)`, filter: `brightness(${0.45 + 0.55 * lit}) saturate(${0.4 + 0.6 * lit})` }}>
      <SideMark side={side} size={only ? 84 : 62} />
    </div>
  );
  return (
    <div className="absolute" style={{ left: x, top: y, width: w, height: h + 34, opacity: o, transform: `scale(${scale})`, transformOrigin: "50% 40%" }}>
      <div className="absolute left-0 top-0 overflow-hidden rounded-[10px]" style={{ width: w, height: h, border: "6px solid #1B222C", boxShadow: "0 18px 40px rgba(0,0,0,0.55)", background: "#05080C" }}>
        <div className="flex h-full w-full">
          {only !== "tux" ? half("win", only ? 1 : win) : null}
          {!only ? <div className="h-full w-[2px]" style={{ background: "#1B222C" }} /> : null}
          {only !== "win" ? half("tux", only ? 1 : tux) : null}
        </div>
        {children}
      </div>
      <div className="absolute" style={{ left: w / 2 - 34, top: h, width: 68, height: 22, background: "#1B222C" }} />
      <div className="absolute rounded-[4px]" style={{ left: w / 2 - 70, top: h + 20, width: 140, height: 10, background: "#232C38" }} />
    </div>
  );
}

/** A window with Windows 11's title bar: its name left, the three buttons right. */
export function WinWindow({ title, children, accent = WIN, bodyStyle }: { title: string; children: ReactNode; accent?: string; bodyStyle?: CSSProperties }) {
  return (
    <Card bg="#1C2128" border="#2E3742">
      <div data-ui="" className="flex h-[30px] items-center justify-between px-[12px]" style={{ background: "#202630", borderBottom: "1px solid #2E3742" }}>
        <span className="flex items-center gap-[8px] font-sans text-[13px] font-semibold" style={{ color: "#D5DBE3" }}>
          <span className="block h-[10px] w-[10px] rounded-[2px]" style={{ background: accent }} />
          {title}
        </span>
        <span className="flex gap-[16px] font-sans text-[13px]" style={{ color: "#8A94A2" }}>
          <span>—</span>
          <span>☐</span>
          <span>✕</span>
        </span>
      </div>
      <div data-ui="" className="relative" style={{ height: "calc(100% - 30px)", ...bodyStyle }}>
        {children}
      </div>
    </Card>
  );
}

export type TermLine = { text: string; at: number; color?: string; prompt?: boolean };

/** A terminal that types each line from its `at`, the prompt ones letter by letter. */
export function Term({ title, lines, cps = 34, size = 14, note, tabs }: { title: string; lines: TermLine[]; cps?: number; size?: number; note?: string; tabs?: string[] }) {
  const t = useClock();
  return (
    <Card bg="#0A0E13" border="#2A3441">
      <div data-ui="" className="flex h-[28px] items-center justify-between px-[10px]" style={{ background: "#121820", borderBottom: "1px solid #2A3441" }}>
        <span className="flex items-center gap-[6px]">
          {["#E0574F", "#E8B43C", "#3CCB7F"].map((c) => (
            <span key={c} className="block h-[9px] w-[9px] rounded-full" style={{ background: c, opacity: 0.85 }} />
          ))}
          {tabs ? (
            <span className="ml-[10px] flex gap-[4px]">
              {tabs.map((tab, i) => (
                <span key={tab} className="rounded-[4px] px-[8px] py-[2px] font-sans text-[12px] font-semibold" style={{ background: i === tabs.length - 1 ? "#24303D" : "transparent", color: i === tabs.length - 1 ? INK : MUTED }}>
                  {tab}
                </span>
              ))}
            </span>
          ) : null}
        </span>
        <span className="font-mono text-[12px] font-bold" style={{ color: MUTED }}>{title}</span>
      </div>
      <div data-ui="" className="px-[12px] py-[10px] font-mono font-semibold leading-[1.5]" style={{ fontSize: size }}>
        {lines.map((line, i) => {
          if (t < line.at) return null;
          const shown = line.prompt ? Math.floor((t - line.at) * cps) : line.text.length;
          const text = line.text.slice(0, Math.max(0, shown));
          const typing = line.prompt && shown < line.text.length;
          return (
            <div key={i} className="whitespace-pre" style={{ color: line.color ?? (line.prompt ? INK : "#9AA6B4") }}>
              {line.prompt ? <span style={{ color: OK }}>$ </span> : null}
              {text}
              {typing ? <span style={{ background: INK }}>&nbsp;</span> : null}
            </div>
          );
        })}
      </div>
      {note ? (
        <div data-ui="" className="absolute bottom-[8px] right-[10px] font-mono text-[12px] font-bold" style={{ color: DIM }}>
          {note}
        </div>
      ) : null}
    </Card>
  );
}

/** A picture of the piece (img/*.png), cropped to its box. */
export function Pic({ src, style }: { src: string; style?: CSSProperties }) {
  const url = useAssets().image(src);
  return <Img src={url} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }} />;
}

/** A photo in a card, with a small label at its top-left. */
export function Photo({ src, label, children }: { src: string; label?: string; children?: ReactNode }) {
  return (
    <Card border="#2A3441" bg="#0D1218">
      <Pic src={src} />
      {label ? (
        <div data-ui="" className="absolute left-[8px] top-[8px] rounded-[3px] px-[6px] py-[3px] font-mono text-[12px] font-bold uppercase tracking-[0.1em]" style={{ background: "rgba(5,8,12,0.78)", color: INK }}>
          {label}
        </div>
      ) : null}
      {children}
    </Card>
  );
}

/** A horizontal friction bar ("WINDOWS · FRICCIÓN") that grows a step at each moment of `steps`. */
export function Friction({ x, y, w, label, steps, at, until, total }: { x: number; y: number; w: number; label: string; steps: number[]; at: number; until?: number; total?: number }) {
  const t = useClock();
  const { o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  const n = total ?? steps.length;
  const filled = steps.reduce((sum, s) => sum + EASE.out(unit(t, s, 0.35)), 0);
  return (
    <div data-ui="" className="absolute" style={{ left: x, top: y, width: w, opacity: o }}>
      <div className="mb-[6px] flex justify-between font-mono text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: AMBER }}>
        <span>{label}</span>
        <span style={{ color: MUTED }}>fricción</span>
      </div>
      <div className="flex gap-[4px]">
        {Array.from({ length: n }, (_, i) => {
          const k = Math.max(0, Math.min(1, filled - i));
          return (
            <div key={i} className="h-[10px] flex-1 overflow-hidden rounded-[2px]" style={{ background: "#232B36" }}>
              <div className="h-full" style={{ width: `${k * 100}%`, background: AMBER }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** A line that strikes through a box of text, drawn from left to right at `at`. */
export function Strike({ at, color = INK, width = 3 }: { at: number; color?: string; width?: number }) {
  const k = useOn(at, 0.3);
  return <div className="absolute left-[-4%] top-1/2" style={{ width: `${108 * k}%`, height: width, background: color, transform: "rotate(-4deg)" }} />;
}

/** A Lucide icon in a color. */
export function Ic({ name, size = 18, color = INK }: { name: string; size?: number; color?: string }) {
  return (
    <span style={{ color, display: "inline-flex" }}>
      <Icono name={name} size={size} strokeWidth={2.25} ancla={false} />
    </span>
  );
}

/** A check in a green circle that pops at `at`. Centered on x, y. */
export function Check({ x, y, at, size = 34, color = OK }: { x: number; y: number; at: number; size?: number; color?: string }) {
  const { p, o, on } = usePresence(at);
  if (!on) return null;
  return (
    <div className="absolute flex items-center justify-center rounded-full" style={{ left: x - size / 2, top: y - size / 2, width: size, height: size, border: `2.5px solid ${color}`, background: "rgba(60,203,127,0.12)", opacity: o, transform: `scale(${Math.min(1.1, p)})` }}>
      <Ic name="check" size={size * 0.55} color={color} />
    </div>
  );
}

/**
 * A desktop drawn in code, for a distro: its wallpaper colors, its logo in
 * the middle and a thin bar, with its name under it. No screenshots.
 */
export function Desktop({ from, to, slug, name, bar = "top", window: win = false }: { from: string; to: string; slug: string; name: string; bar?: "top" | "bottom" | "left"; window?: boolean }) {
  const barStyle: CSSProperties =
    bar === "top" ? { left: 0, right: 0, top: 0, height: 10 } : bar === "bottom" ? { left: 0, right: 0, bottom: 0, height: 12 } : { left: 0, top: 0, bottom: 0, width: 14 };
  return (
    <Card border="#2A3441" bg={from}>
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }} />
      <div className="absolute" style={{ ...barStyle, background: "rgba(10,12,16,0.75)" }} />
      <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: win ? 0.25 : 0.95 }}>
        <Logo slug={slug} size={46} chip="#F4F6F9" ancla={false} />
      </div>
      {win ? (
        <div className="absolute overflow-hidden rounded-[5px]" style={{ left: "16%", top: "20%", width: "68%", height: "62%", background: "#F4F6F9", boxShadow: "0 8px 18px rgba(0,0,0,0.4)" }}>
          <div className="h-[12px]" style={{ background: "#DDE2E8" }} />
          <div className="mx-[10%] mt-[12%] h-[10px] rounded-full" style={{ background: "#C9D1DB" }} />
          <div className="mx-[22%] mt-[8%] h-[6px] rounded-full" style={{ background: "#DDE2E8" }} />
          <div className="mx-[16%] mt-[5%] h-[6px] rounded-full" style={{ background: "#DDE2E8" }} />
        </div>
      ) : null}
      <div data-ui="" className="absolute bottom-[8px] left-[8px] rounded-[3px] px-[6px] py-[2px] font-sans text-[13px] font-bold" style={{ background: "rgba(5,8,12,0.78)", color: INK, bottom: bar === "bottom" ? 18 : 8 }}>
        {name}
      </div>
    </Card>
  );
}

export { TUX, WIN };
