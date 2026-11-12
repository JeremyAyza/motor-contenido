import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { DUR, fade, popAt, useClock } from "@motor/video";
import { Logo } from "@motor/ui";
import { AMD, AMD_FILL, AMD_GLOW, CARD, DIE, DIM, GOLD, INK, INTEL, INTEL_FILL, INTEL_GLOW, LID, LINE, MUTED, PCB, PCB_2 } from "./world.tsx";

export type Brand = "amd" | "intel";

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

/** Rick's scene title: left-aligned under the chapter label, quiet weight, one or two lines. */
export function Title({ x = 36, y = 124, size = 42, width = 468, color = INK, align = "left", children, style }: { x?: number; y?: number; size?: number; width?: number; color?: string; align?: "left" | "center"; children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="absolute font-display font-semibold leading-[1.05] tracking-tight" style={{ left: x, top: y, width, fontSize: size, color, textAlign: align, ...style }}>
      {children}
    </div>
  );
}

/** The giant chapter word over a chip ("CHIPLETS", "TILES"): ghost first, full when said. */
export function BigWord({ x = 36, y, size = 64, color, on, children, align = "left", width = 468 }: { x?: number; y: number; size?: number; color: string; on: number; children: ReactNode; align?: "left" | "center"; width?: number }) {
  return (
    <div className="absolute font-display font-black leading-none tracking-tight" style={{ left: x, top: y, width, fontSize: size, color, textAlign: align, opacity: 0.18 + 0.82 * on }}>
      {children}
    </div>
  );
}

/** Interface text in mono capitals: a part's name, a footnote. */
export function Mono({ x, y, color = MUTED, size = 14, bold = true, children, center = false, width, style }: { x: number; y: number; color?: string; size?: number; bold?: boolean; children: ReactNode; center?: boolean; width?: number; style?: CSSProperties }) {
  return (
    <div data-ui="" className="absolute whitespace-nowrap font-mono tracking-[0.08em]" style={{ left: center ? x - (width ?? 200) / 2 : x, top: y, width: center ? width ?? 200 : width, textAlign: center ? "center" : "left", fontSize: size, fontWeight: bold ? 700 : 400, color, ...style }}>
      {children}
    </div>
  );
}

/** A dark blueprint card with a 1 px border; `active` tints it with a side's color. */
export function Card({ x, y, w, h, active, style, children }: { x: number; y: number; w: number; h?: number; active?: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <div data-ui="" className="absolute rounded-[10px]" style={{ left: x, top: y, width: w, height: h, background: active ? `color-mix(in srgb, ${active} 12%, ${CARD})` : CARD, border: `1px solid ${active ?? LINE}`, ...style }}>
      {children}
    </div>
  );
}

/** A brand's official mark from Simple Icons, in white like Rick's wordmarks. */
export function Mark({ brand, size, x, y, opacity = 1, underline = 0 }: { brand: Brand; size: number; x: number; y: number; opacity?: number; underline?: number }) {
  return (
    <div className="absolute" style={{ left: x, top: y, opacity }}>
      <div style={{ filter: "brightness(0) invert(1)" }}>
        <Logo slug={brand} size={size} ancla={false} />
      </div>
      {underline > 0 ? <div className="mt-1 h-[3px] rounded-full" style={{ width: size * underline, background: brand === "amd" ? AMD : INTEL }} /> : null}
    </div>
  );
}

/** A soft glow of a side's color behind its chip. */
export function Glow({ brand, x, y, r, opacity = 1 }: { brand: Brand; x: number; y: number; r: number; opacity?: number }) {
  const c = brand === "amd" ? AMD_GLOW : INTEL_GLOW;
  return <div className="absolute rounded-full" style={{ left: x - r, top: y - r, width: r * 2, height: r * 2, opacity, background: `radial-gradient(circle, ${c} 0%, rgba(5,7,10,0) 70%)` }} />;
}

/**
 * The inside of a package, seen from above: AMD's two compute chiplets and
 * its I/O die, or Intel's tiles. `lit` (0 to 1 per part) tints a part with its
 * side's color as the voice names it.
 */
function Inside({ brand, lit = {} }: { brand: Brand; lit?: Record<string, number> }) {
  const tint = (key: string, base: string, on: string) => {
    const p = lit[key] ?? 0;
    return p > 0 ? `color-mix(in srgb, ${on} ${Math.round(p * 100)}%, ${base})` : base;
  };
  if (brand === "amd")
    return (
      <>
        <rect x={50} y={44} width={44} height={70} rx={3} fill={tint("ccd0", DIE, AMD_FILL)} />
        <rect x={106} y={44} width={44} height={70} rx={3} fill={tint("ccd1", DIE, AMD_FILL)} />
        <rect x={62} y={128} width={76} height={34} rx={3} fill={tint("io", DIE, "#5B6377")} />
      </>
    );
  return (
    <>
      <rect x={44} y={40} width={64} height={64} rx={3} fill={tint("compute", DIE, INTEL_FILL)} />
      <rect x={114} y={40} width={42} height={64} rx={3} fill={tint("graphics", DIE, INTEL_FILL)} />
      <rect x={44} y={110} width={112} height={30} rx={3} fill={tint("soc", DIE, INTEL_FILL)} />
      <rect x={44} y={146} width={112} height={16} rx={3} fill={tint("io", DIE, INTEL_FILL)} />
    </>
  );
}

/**
 * A desktop CPU, flat (Rick's are 3D renders; flat is the account's style and
 * Jeremy chose it): the green board with gold pads, the dies inside and the
 * metal lid on top. Centered on x, y, 200 px wide at s = 1. `lid` is 1 shut
 * and 0 lifted off; `tilt` turns it a little, for the hook's diagonal.
 */
export function Cpu({ brand, x, y, s = 1, lid = 1, tilt = 0, lit, opacity = 1, outline }: { brand: Brand; x: number; y: number; s?: number; lid?: number; tilt?: number; lit?: Record<string, number>; opacity?: number; outline?: string }) {
  const off = 1 - lid;
  return (
    <div className="absolute" style={{ left: x - 100, top: y - 100, width: 200, height: 200, opacity, transform: `scale(${s}) rotate(${tilt}deg)` }}>
      <svg width={200} height={200} viewBox="0 0 200 200" style={{ overflow: "visible" }} aria-hidden>
        <rect x={8} y={8} width={184} height={184} rx={10} fill={PCB} stroke={outline ?? PCB_2} strokeWidth={outline ? 3 : 2} />
        {Array.from({ length: 13 }, (_, i) => (
          <g key={i} fill={GOLD} opacity={0.85}>
            <rect x={20 + i * 12.5} y={14} width={5} height={8} rx={1} />
            <rect x={20 + i * 12.5} y={178} width={5} height={8} rx={1} />
            <rect x={14} y={20 + i * 12.5} width={8} height={5} rx={1} />
            <rect x={178} y={20 + i * 12.5} width={8} height={5} rx={1} />
          </g>
        ))}
        <Inside brand={brand} lit={lit} />
        {lid > 0 ? (
          <g transform={`translate(${off * 40} ${-off * 150})`} opacity={lid}>
            <rect x={30} y={30} width={140} height={140} rx={10} fill={LID} />
            <rect x={30} y={30} width={140} height={140} rx={10} fill="url(#sheen)" />
            {brand === "amd" ? (
              <>
                <rect x={40} y={40} width={10} height={120} rx={3} fill="#C3C6CB" />
                <rect x={150} y={40} width={10} height={120} rx={3} fill="#C3C6CB" />
              </>
            ) : (
              <rect x={40} y={136} width={120} height={22} rx={4} fill="#C3C6CB" />
            )}
          </g>
        ) : null}
        <defs>
          <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.55} />
            <stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0} />
            <stop offset="1" stopColor="#8A8F98" stopOpacity={0.35} />
          </linearGradient>
        </defs>
      </svg>
      {lid > 0.5 ? (
        <div className="absolute flex flex-col items-center justify-center" style={{ left: 30 + off * 40, top: 44 - off * 150, width: 140, height: 90, filter: "brightness(0)", opacity: 0.75 * lid }}>
          <Logo slug={brand} size={brand === "amd" ? 78 : 62} ancla={false} />
        </div>
      ) : null}
    </div>
  );
}

/** A small device in thin white line: a monitor, a laptop or a tower, for the grid of PCs. */
export function Device({ kind, x, y, on, dot }: { kind: 0 | 1 | 2; x: number; y: number; on: number; dot?: { color: string; p: number } }) {
  const stroke = `rgba(244,246,250,${0.15 + 0.75 * on})`;
  return (
    <svg className="absolute" width={92} height={56} viewBox="0 0 92 56" style={{ left: x, top: y, overflow: "visible" }} aria-hidden>
      {kind === 0 ? (
        <>
          <rect x={16} y={4} width={60} height={38} rx={3} fill="none" stroke={stroke} strokeWidth={1.6} />
          <path d="M 40 42 L 38 50 M 52 42 L 54 50 M 32 51 L 60 51" stroke={stroke} strokeWidth={1.6} strokeLinecap="round" />
        </>
      ) : kind === 1 ? (
        <>
          <rect x={22} y={8} width={48} height={32} rx={3} fill="none" stroke={stroke} strokeWidth={1.6} />
          <path d="M 14 46 L 78 46 L 72 40 L 20 40 Z" fill="none" stroke={stroke} strokeWidth={1.6} strokeLinejoin="round" />
        </>
      ) : (
        <>
          <rect x={10} y={8} width={44} height={30} rx={3} fill="none" stroke={stroke} strokeWidth={1.6} />
          <rect x={60} y={4} width={20} height={46} rx={3} fill="none" stroke={stroke} strokeWidth={1.6} />
          <circle cx={70} cy={12} r={2} fill={stroke} />
        </>
      )}
      {dot && dot.p > 0 ? <circle cx={kind === 2 ? 70 : 46} cy={kind === 2 ? 30 : 24} r={6 * Math.min(1.15, dot.p)} fill={dot.color} /> : null}
    </svg>
  );
}

/** A footnote in small mono under a diagram ("esquema simplificado"). */
export function Footnote({ x = 36, y, children }: { x?: number; y: number; children: ReactNode }) {
  return (
    <Mono x={x} y={y} color={DIM} size={13} bold={false}>
      {children}
    </Mono>
  );
}

/** The side colors, by brand. */
export const SIDE: Record<Brand, string> = { amd: AMD, intel: INTEL };

/** A check that pops, in a side's color. */
export function Check({ x, y, color, p, size = 30 }: { x: number; y: number; color: string; p: number; size?: number }) {
  return (
    <svg className="absolute" width={size} height={size} viewBox="0 0 24 24" style={{ left: x - size / 2, top: y - size / 2, transform: `scale(${Math.min(1.15, p)})`, opacity: Math.min(1, p * 2) }} aria-hidden>
      <circle cx={12} cy={12} r={11} fill={color} />
      <path d="M 7 12.5 L 10.5 16 L 17 8.5" fill="none" stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export { CARD, INK, LINE, MUTED };
