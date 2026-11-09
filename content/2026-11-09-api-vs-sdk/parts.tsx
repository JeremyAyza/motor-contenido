import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { DUR, fade, popAt, useClock } from "@motor/video";
import { Logo } from "@motor/ui";
import { API, API_2, INK, MUTED, SDK, SDK_2 } from "./world.tsx";

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

export const SHADOW = "0 18px 40px rgba(15,37,64,0.14), 0 2px 6px rgba(15,37,64,0.08)";

/** A flat white card with Rick's big soft shadow. Its text is interface (data-ui). */
export function Card({ x, y, w, h, style, children, ui = true }: { x: number; y: number; w: number; h?: number; style?: CSSProperties; children?: ReactNode; ui?: boolean }) {
  return (
    <div data-ui={ui ? "" : undefined} className="absolute rounded-[10px] bg-white" style={{ left: x, top: y, width: w, height: h, boxShadow: SHADOW, ...style }}>
      {children}
    </div>
  );
}

/** A title in the display font, left-aligned by default like Rick's. */
export function Title({ x = 36, y, size = 46, color = INK, align = "left", width = 468, children, style }: { x?: number; y: number; size?: number; color?: string; align?: "left" | "center"; width?: number; children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="absolute font-display font-extrabold leading-[1.02] tracking-tight" style={{ left: x, top: y, width, fontSize: size, color, textAlign: align, ...style }}>
      {children}
    </div>
  );
}

/** "Ejemplo ilustrativo": what a made-up screen carries (rule 3). `right` is its right edge (504 by default, the margin). */
export function Illustrative({ y, right = 504, dark = false }: { y: number; right?: number; dark?: boolean }) {
  return (
    <div data-ui="" className="absolute whitespace-nowrap rounded-full px-2 py-[2px] font-mono text-[12px]" style={{ right: 540 - right, top: y, color: dark ? "rgba(255,255,255,0.7)" : MUTED, background: dark ? "rgba(255,255,255,0.08)" : "rgba(15,37,64,0.06)" }}>
      Ejemplo ilustrativo
    </div>
  );
}

/** The API chip: violet, the color of the API all video long. Centered on x, y. */
export function ApiChip({ x, y, w = 200, h = 104, scale = 1, opacity = 1, glow = 0 }: { x: number; y: number; w?: number; h?: number; scale?: number; opacity?: number; glow?: number }) {
  return (
    <div
      className="absolute flex items-center justify-center rounded-[18px] font-display font-black text-white"
      style={{
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        fontSize: h * 0.56,
        opacity,
        background: `linear-gradient(135deg, ${API_2}, ${API})`,
        boxShadow: `0 16px 34px rgba(79,70,229,0.35), 0 0 0 ${glow * 14}px rgba(124,108,246,${0.25 * glow})`,
        transform: `scale(${scale})`,
      }}
    >
      API
    </div>
  );
}

/**
 * The SDK toolbox, flat (Rick's is a 3D render; flat is the account's style
 * unless Jeremy asks). Centered on x, y, 220 px wide at s = 1. `open` lifts the
 * lid and shows the tools; `xray` turns it into an orange outline.
 */
export function SdkBox({ x, y, s = 1, open = 0, xray = 0, opacity = 1, rotate = 0 }: { x: number; y: number; s?: number; open?: number; xray?: number; opacity?: number; rotate?: number }) {
  const solid = 1 - xray;
  const lidLift = open * 46;
  const lidTurn = open * -14;
  return (
    <svg className="absolute" width={220} height={190} viewBox="0 0 220 190" style={{ left: x - 110, top: y - 95, overflow: "visible", opacity, transform: `scale(${s}) rotate(${rotate}deg)` }} aria-hidden>
      {/* tools inside, seen when the lid is up */}
      <g opacity={open}>
        <rect x={28} y={58} width={164} height={34} rx={4} fill="#3A2416" opacity={solid} />
        <rect x={40} y={34 - open * 18} width={16} height={46} rx={3} fill="#94A3B8" />
        <rect x={64} y={30 - open * 22} width={12} height={52} rx={3} fill="#F8FAFC" />
        <rect x={84} y={38 - open * 16} width={30} height={40} rx={4} fill="#60A5FA" />
        <rect x={122} y={32 - open * 20} width={22} height={48} rx={3} fill="#FDE68A" />
        <rect x={152} y={40 - open * 14} width={26} height={38} rx={4} fill="#A7F3D0" />
      </g>
      {/* body */}
      <rect x={14} y={78} width={192} height={104} rx={14} fill={xray ? "none" : SDK} fillOpacity={solid} stroke={SDK} strokeWidth={xray ? 3 : 0} strokeDasharray={xray ? "7 6" : undefined} />
      <rect x={14} y={150} width={192} height={32} rx={0} fill="#C2410C" opacity={solid * 0.55} />
      <rect x={70} y={104} width={80} height={36} rx={8} fill="#FFFFFF" fillOpacity={solid} stroke={SDK} strokeWidth={xray ? 2 : 0} />
      <text x={110} y={130} textAnchor="middle" fontFamily="var(--piece-font-display)" fontWeight={900} fontSize={24} fill={xray ? SDK : "#C2410C"}>
        SDK
      </text>
      {[34, 166].map((lx) => (
        <rect key={lx} x={lx} y={92} width={20} height={26} rx={4} fill="#E5E7EB" fillOpacity={solid} stroke={xray ? SDK : "none"} strokeWidth={2} />
      ))}
      {/* lid */}
      <g transform={`translate(0 ${-lidLift}) rotate(${lidTurn} 14 78)`}>
        <rect x={10} y={56} width={200} height={28} rx={10} fill={xray ? "none" : SDK_2} fillOpacity={solid} stroke={SDK} strokeWidth={xray ? 3 : 0} strokeDasharray={xray ? "7 6" : undefined} />
        <path d="M 78 56 L 78 38 Q 78 30 86 30 L 134 30 Q 142 30 142 38 L 142 56" fill="none" stroke={xray ? SDK : "#7C2D12"} strokeWidth={9} strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** A node of the path from your app to OpenAI: a white pill, with the official logo when it is OpenAI. */
export function Node({ x, y, kind, scale = 1, opacity = 1 }: { x: number; y: number; kind: "app" | "openai"; scale?: number; opacity?: number }) {
  const w = kind === "app" ? 150 : 190;
  return (
    <div data-ui="" className="absolute flex h-[56px] items-center justify-center gap-2.5 rounded-[14px] bg-white font-sans text-[20px] font-bold" style={{ left: x - w / 2, top: y - 28, width: w, color: INK, opacity, boxShadow: "0 12px 28px rgba(15,37,64,0.14)", transform: `scale(${scale})` }}>
      {kind === "app" ? (
        <>
          <svg width={22} height={22} viewBox="0 0 24 24" aria-hidden>
            <rect x={3} y={4} width={18} height={14} rx={3} fill="none" stroke={INK} strokeWidth={2} />
            <path d="M 8 21 L 16 21" stroke={INK} strokeWidth={2} strokeLinecap="round" />
          </svg>
          tu app
        </>
      ) : (
        <>
          <Logo slug="openai" size={26} ancla={false} />
          OpenAI
        </>
      )}
    </div>
  );
}

/** A small chip of interface text: a status, a tag, a header. */
export function Pill({ x, y, color, bg, children, size = 14, center = false }: { x: number; y: number; color: string; bg: string; children: ReactNode; size?: number; center?: boolean }) {
  return (
    <div data-ui="" className="absolute whitespace-nowrap rounded-full px-3 py-[5px] font-mono font-bold" style={{ left: x, top: y, color, background: bg, fontSize: size, transform: center ? "translate(-50%, -50%)" : undefined }}>
      {children}
    </div>
  );
}

const KEYWORDS = /^(const|let|async|await|function|for|try|catch|if|return|throw|new|continue|import|from|print)$/;

/** One line of code with a light syntax color: strings, keywords, numbers. */
function CodeLine({ line, dark }: { line: string; dark: boolean }) {
  const parts = line.split(/("[^"]*"?|'[^']*'?|`[^`]*`?|\b\d+\b|\b[a-z]+\b)/g);
  const str = dark ? "#A5E3A0" : "#2A7A3B";
  const kw = dark ? "#C4B5FD" : API;
  const num = dark ? "#FDBA74" : SDK;
  return (
    <div className="whitespace-pre">
      {parts.map((part, i) => {
        if (!part) return null;
        const color = /^["'`]/.test(part) ? str : KEYWORDS.test(part) ? kw : /^\d+$/.test(part) ? num : undefined;
        return (
          <span key={i} style={color ? { color } : undefined}>
            {part}
          </span>
        );
      })}
    </div>
  );
}

/** Code shown up to `chars` characters (it types itself as `chars` grows). */
export function CodeView({ code, chars = Infinity, dark = true, size = 12.5, lineHeight = 1.5 }: { code: string; chars?: number; dark?: boolean; size?: number; lineHeight?: number }) {
  const shown = code.slice(0, Math.max(0, Math.floor(chars)));
  return (
    <div data-ui="" className="font-mono" style={{ fontSize: size, lineHeight, color: dark ? "#E6EDF3" : INK }}>
      {shown.split("\n").map((line, i) => (
        <CodeLine key={i} line={line} dark={dark} />
      ))}
    </div>
  );
}

/** A dark editor window: the file name, a line counter and the code. */
export function Editor({ x, y, w, h, file, lines, children, tags }: { x: number; y: number; w: number; h: number; file: string; lines?: string; children?: ReactNode; tags?: ReactNode }) {
  return (
    <div data-ui="" className="absolute overflow-hidden rounded-[10px]" style={{ left: x, top: y, width: w, height: h, background: "#0B1B30", boxShadow: "0 22px 48px rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex h-[34px] items-center gap-2 border-b border-white/10 px-3 font-mono text-[13px] text-white/80">
        <span className="h-[9px] w-[9px] rounded-full bg-[#F87171]" />
        <span className="h-[9px] w-[9px] rounded-full bg-[#FBBF24]" />
        <span className="h-[9px] w-[9px] rounded-full bg-[#34D399]" />
        <span className="ml-2">{file}</span>
        <span className="ml-auto font-bold text-white">{lines}</span>
      </div>
      {tags ? <div className="flex flex-wrap gap-1.5 px-3 pt-2">{tags}</div> : null}
      <div className="px-3 pt-2">{children}</div>
    </div>
  );
}

/** A tag of the editor that lights up when its task is said. */
export function TaskTag({ label, on }: { label: string; on: number }) {
  return (
    <span className="rounded-[5px] px-2 py-[3px] font-mono text-[12px] font-bold" style={{ background: on > 0 ? `rgba(234,88,12,${0.25 + 0.65 * on})` : "rgba(255,255,255,0.08)", color: on > 0.5 ? "#FFFFFF" : "rgba(255,255,255,0.55)" }}>
      {label}
    </span>
  );
}
