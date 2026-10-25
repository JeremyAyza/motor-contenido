import { getLength, getPointAtLength, getTangentAtLength } from "@remotion/paths";
import type { CSSProperties, ReactNode } from "react";
import { useClock, useStage } from "./scene.ts";

/*
 * Flat objects for a motion-graphics world (docs/plan-paridad-rick.md): no
 * outline, two-tone shading, small details. They take the piece's palette
 * through its CSS variables and move by themselves (lights blink, trees sway,
 * clouds drift, gears turn) on the clock of where they are, so a render
 * always comes out the same. Each one is placed by its bottom center (x, y)
 * in the world's coordinates and scales with `s`.
 */

const BASE = "color-mix(in srgb, var(--piece-ink) 13%, var(--piece-bg))";
const SHADE = "color-mix(in srgb, var(--piece-ink) 7%, var(--piece-bg))";
const LIGHT = "color-mix(in srgb, var(--piece-ink) 22%, var(--piece-bg))";
const INK = "var(--piece-ink)";
const ACCENT = "var(--piece-accent)";
const WINDOW = "#F3D58A";
const LEAF = "#4E7B5B";
const LEAF_DARK = "#3D6449";
const TRUNK = "#6B5443";

type Placed = { x: number; y: number; s?: number; className?: string };

/** Places an SVG of `w`×`h` by its bottom center. */
function At({ x, y, s = 1, w, h, children, className, style }: Placed & { w: number; h: number; children: ReactNode; style?: CSSProperties }) {
  return (
    <svg
      className={`absolute overflow-visible ${className ?? ""}`}
      width={w * s}
      height={h * s}
      viewBox={`0 0 ${w} ${h}`}
      style={{ left: x - (w * s) / 2, top: y - h * s, ...style }}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** A tiny deterministic noise from a seed, 0 to 1: blinking windows, staggered sways. */
const hash = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

export function Tree({ x, y, s, className }: Placed) {
  const t = useClock();
  const sway = Math.sin(t * 1.3 + x * 0.05) * 2.5;
  return (
    <At x={x} y={y} s={s} w={60} h={90} className={className}>
      <rect x={27} y={58} width={6} height={32} rx={2} fill={TRUNK} />
      <g style={{ transform: `rotate(${sway}deg)`, transformOrigin: "30px 70px" }}>
        <circle cx={30} cy={36} r={28} fill={LEAF} />
        <path d="M30 8 A28 28 0 0 1 30 64 A22 28 0 0 0 30 8" fill={LEAF_DARK} />
      </g>
    </At>
  );
}

export function Pine({ x, y, s, className }: Placed) {
  const t = useClock();
  const sway = Math.sin(t * 1.1 + x * 0.07) * 2;
  return (
    <At x={x} y={y} s={s} w={44} h={96} className={className}>
      <rect x={19} y={78} width={6} height={18} rx={2} fill={TRUNK} />
      <g style={{ transform: `rotate(${sway}deg)`, transformOrigin: "22px 80px" }}>
        <path d="M22 0 L44 80 L0 80 Z" fill={LEAF} />
        <path d="M22 0 L44 80 L22 80 Z" fill={LEAF_DARK} />
      </g>
    </At>
  );
}

export function Bush({ x, y, s, className }: Placed) {
  return (
    <At x={x} y={y} s={s} w={56} h={28} className={className}>
      <ellipse cx={18} cy={18} rx={18} ry={11} fill={LEAF} />
      <ellipse cx={36} cy={16} rx={20} ry={13} fill={LEAF_DARK} />
    </At>
  );
}

/** A cloud that drifts slowly to the right and wraps around `span` px. */
export function Cloud({ x, y, s, span = 600, className }: Placed & { span?: number }) {
  const t = useClock();
  const dx = ((t * 8 + x) % span) - x;
  return (
    <At x={x + dx} y={y} s={s} w={110} h={46} className={className} style={{ opacity: 0.55 }}>
      <ellipse cx={34} cy={30} rx={30} ry={16} fill={LIGHT} />
      <ellipse cx={62} cy={22} rx={30} ry={20} fill={LIGHT} />
      <ellipse cx={86} cy={32} rx={22} ry={13} fill={LIGHT} />
    </At>
  );
}

/** A building with lit windows that switch on and off now and then. */
export function Building({ x, y, s, floors = 5, cols = 3, className, children }: Placed & { floors?: number; cols?: number; children?: ReactNode }) {
  const t = useClock();
  const w = 24 + cols * 26;
  const h = 18 + floors * 30;
  return (
    <At x={x} y={y} s={s} w={w} h={h} className={className}>
      <rect x={0} y={0} width={w} height={h} rx={4} fill={BASE} />
      <rect x={w * 0.62} y={0} width={w * 0.38} height={h} rx={4} fill={SHADE} />
      {Array.from({ length: floors * cols }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const seed = x * 13 + i;
        const on = hash(seed + Math.floor(t / (3 + hash(seed) * 4))) > 0.3;
        return <rect key={i} x={14 + c * 26} y={14 + r * 30} width={14} height={16} rx={2} fill={on ? WINDOW : LIGHT} opacity={on ? 0.9 : 0.5} />;
      })}
      {children}
    </At>
  );
}

export function House({ x, y, s, className }: Placed) {
  return (
    <At x={x} y={y} s={s} w={90} h={78} className={className}>
      <path d="M45 0 L90 34 L0 34 Z" fill={ACCENT} opacity={0.85} />
      <rect x={8} y={34} width={74} height={44} fill={BASE} />
      <rect x={48} y={34} width={34} height={44} fill={SHADE} />
      <rect x={16} y={46} width={16} height={14} rx={2} fill={WINDOW} />
      <rect x={58} y={50} width={14} height={28} rx={2} fill={LIGHT} />
    </At>
  );
}

export function StreetLamp({ x, y, s, className }: Placed) {
  const t = useClock();
  const glow = 0.45 + 0.08 * Math.sin(t * 3 + x);
  return (
    <At x={x} y={y} s={s} w={40} h={110} className={className}>
      <circle cx={30} cy={14} r={16} fill={WINDOW} opacity={glow * 0.5} />
      <rect x={6} y={10} width={4} height={100} rx={2} fill={LIGHT} />
      <path d="M8 10 Q8 4 18 4 L30 4" stroke={LIGHT} strokeWidth={4} fill="none" />
      <rect x={24} y={6} width={14} height={8} rx={3} fill={WINDOW} />
    </At>
  );
}

/** A traffic light that cycles green, amber, red every few seconds. */
export function TrafficLight({ x, y, s, className }: Placed) {
  const t = useClock();
  const phase = Math.floor((t + x * 0.01) / 2.5) % 3;
  const colors = ["#3FB37F", "#F5B83D", "#E5534B"];
  return (
    <At x={x} y={y} s={s} w={24} h={96} className={className}>
      <rect x={10} y={40} width={4} height={56} fill={LIGHT} />
      <rect x={2} y={0} width={20} height={46} rx={5} fill={SHADE} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={12} cy={9 + i * 14} r={5} fill={2 - i === phase ? colors[2 - i] : BASE} />
      ))}
    </At>
  );
}

/** A small car seen from the side; `color` paints the body. */
export function Car({ x, y, s, color = ACCENT, className }: Placed & { color?: string }) {
  return (
    <At x={x} y={y} s={s} w={64} h={30} className={className}>
      <path d="M8 12 L18 2 L44 2 L54 12 Z" fill={color} opacity={0.85} />
      <rect x={2} y={11} width={60} height={13} rx={5} fill={color} />
      <rect x={21} y={5} width={10} height={7} rx={1.5} fill={LIGHT} />
      <rect x={34} y={5} width={10} height={7} rx={1.5} fill={LIGHT} />
      <circle cx={16} cy={24} r={6} fill={INK} opacity={0.85} />
      <circle cx={48} cy={24} r={6} fill={INK} opacity={0.85} />
    </At>
  );
}

/** A truck whose cargo box can hold anything (`cargo`, drawn over the box). */
export function Truck({ x, y, s, className, cargo }: Placed & { cargo?: ReactNode }) {
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <At x={0} y={0} s={s} w={150} h={64} className={className}>
        <rect x={0} y={4} width={104} height={46} rx={5} fill={LIGHT} />
        <path d="M108 16 L134 16 L148 34 L148 50 L108 50 Z" fill={INK} opacity={0.9} />
        <rect x={116} y={21} width={16} height={11} rx={2} fill={SHADE} />
        <circle cx={26} cy={54} r={9} fill={SHADE} />
        <circle cx={128} cy={54} r={9} fill={SHADE} />
      </At>
      {cargo ? (
        <div className="absolute" style={{ left: -75 * (s ?? 1), bottom: 14 * (s ?? 1), width: 104 * (s ?? 1) }}>
          {cargo}
        </div>
      ) : null}
    </div>
  );
}

/** A toll booth with a barrier that lifts as `open` goes from 0 to 1. */
export function Booth({ x, y, s, open = 0, className, children }: Placed & { open?: number; children?: ReactNode }) {
  return (
    <At x={x} y={y} s={s} w={170} h={120} className={className}>
      <rect x={0} y={14} width={70} height={106} rx={6} fill={BASE} />
      <rect x={40} y={14} width={30} height={106} rx={6} fill={SHADE} />
      <rect x={10} y={30} width={50} height={30} rx={4} fill={WINDOW} opacity={0.85} />
      <rect x={-6} y={4} width={82} height={14} rx={4} fill={ACCENT} />
      <g style={{ transform: `rotate(${-80 * open}deg)`, transformOrigin: "74px 92px" }}>
        <rect x={70} y={88} width={100} height={9} rx={4} fill={INK} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={84 + i * 22} y={88} width={10} height={9} fill="#E5534B" />
        ))}
      </g>
      {children}
    </At>
  );
}

/** A machine with a funnel on top and a gear that turns while `running`. */
export function Machine({ x, y, s, running = true, className, label }: Placed & { running?: boolean; label?: string }) {
  const t = useClock();
  const spin = running ? t * 90 : 0;
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <At x={0} y={0} s={s} w={150} h={140}>
        <path d="M30 0 L120 0 L95 34 L55 34 Z" fill={LIGHT} />
        <rect x={10} y={34} width={130} height={92} rx={8} fill={BASE} />
        <rect x={84} y={34} width={56} height={92} rx={8} fill={SHADE} />
        <g style={{ transform: `rotate(${spin}deg)`, transformOrigin: "48px 80px" }}>
          <circle cx={48} cy={80} r={20} fill={ACCENT} />
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={45} y={54} width={6} height={10} rx={1} fill={ACCENT} style={{ transform: `rotate(${i * 45}deg)`, transformOrigin: "48px 80px" }} />
          ))}
          <circle cx={48} cy={80} r={8} fill={BASE} />
        </g>
        <rect x={98} y={64} width={30} height={8} rx={2} fill={INK} opacity={0.6} />
        <rect x={98} y={78} width={30} height={8} rx={2} fill={INK} opacity={0.35} />
        <rect x={60} y={126} width={30} height={14} fill={SHADE} />
      </At>
      {label ? (
        <span className={`absolute -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0E1015] px-2 py-1 font-mono text-[15px] font-bold uppercase text-ink ${className ?? ""}`} style={{ left: 0, top: -24 * (s ?? 1) - 140 * (s ?? 1) }}>
          {label}
        </span>
      ) : null}
    </div>
  );
}

/** A sign on two posts; its face holds anything. */
export function Sign({ x, y, s = 1, w = 200, h = 90, children, className }: Placed & { w?: number; h?: number; children?: ReactNode }) {
  return (
    <div className={`absolute ${className ?? ""}`} style={{ left: x - (w * s) / 2, top: y - (h + 50) * s, width: w * s }}>
      <div className="relative flex items-center justify-center rounded-xl bg-[#0E1015] ring-2 ring-white/10" style={{ height: h * s }}>
        {children}
      </div>
      <div className="flex justify-between px-[18%]">
        <span className="block w-[6px]" style={{ height: 50 * s, background: LIGHT }} />
        <span className="block w-[6px]" style={{ height: 50 * s, background: LIGHT }} />
      </div>
    </div>
  );
}

/** A server rack with LEDs that blink. */
export function Server({ x, y, s, className }: Placed) {
  const t = useClock();
  return (
    <At x={x} y={y} s={s} w={64} h={110} className={className}>
      <rect x={0} y={0} width={64} height={110} rx={6} fill={BASE} />
      <rect x={40} y={0} width={24} height={110} rx={6} fill={SHADE} />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <rect x={8} y={10 + i * 16} width={40} height={10} rx={2} fill={SHADE} />
          <circle cx={14} cy={15 + i * 16} r={2.4} fill={hash(x + i + Math.floor(t * 4)) > 0.4 ? "#3FB37F" : LIGHT} />
        </g>
      ))}
    </At>
  );
}

export function Document({ x, y, s, className }: Placed) {
  return (
    <At x={x} y={y} s={s} w={46} h={58} className={className}>
      <path d="M0 4 Q0 0 4 0 L32 0 L46 14 L46 54 Q46 58 42 58 L4 58 Q0 58 0 54 Z" fill="#F2F0EA" />
      <path d="M32 0 L32 14 L46 14 Z" fill="#C9C6BE" />
      {[22, 30, 38, 46].map((ly, i) => (
        <rect key={ly} x={8} y={ly} width={i === 3 ? 18 : 30} height={3} rx={1.5} fill="#9BA0AA" />
      ))}
    </At>
  );
}

/** A coin that spins in place. */
export function Coin({ x, y, s, className }: Placed) {
  const t = useClock();
  const turn = Math.abs(Math.cos(t * 3 + x));
  return (
    <At x={x} y={y} s={s} w={34} h={34} className={className}>
      <ellipse cx={17} cy={17} rx={16 * Math.max(0.15, turn)} ry={16} fill={ACCENT} />
      <ellipse cx={17} cy={17} rx={10 * Math.max(0.15, turn)} ry={10} fill="#00000022" />
    </At>
  );
}

export function Person({ x, y, s, color = "#5B8DEF", className }: Placed & { color?: string }) {
  const t = useClock();
  const bob = Math.sin(t * 2 + x) * 0.8;
  return (
    <At x={x} y={y} s={s} w={30} h={70} className={className}>
      <g style={{ transform: `translateY(${bob}px)` }}>
        <circle cx={15} cy={10} r={9} fill="#E9B79A" />
        <rect x={4} y={21} width={22} height={28} rx={8} fill={color} />
      </g>
      <rect x={7} y={48} width={6} height={22} rx={3} fill={INK} opacity={0.8} />
      <rect x={17} y={48} width={6} height={22} rx={3} fill={INK} opacity={0.8} />
    </At>
  );
}

export function Laptop({ x, y, s, className, children }: Placed & { children?: ReactNode }) {
  return (
    <At x={x} y={y} s={s} w={90} h={60} className={className}>
      <rect x={10} y={0} width={70} height={46} rx={4} fill={SHADE} />
      <rect x={15} y={5} width={60} height={36} rx={2} fill="#0E1015" />
      <path d="M0 50 L90 50 L84 60 L6 60 Z" fill={LIGHT} />
      {children}
    </At>
  );
}

export function Warehouse({ x, y, s, className, children }: Placed & { children?: ReactNode }) {
  return (
    <At x={x} y={y} s={s} w={180} h={120} className={className}>
      <path d="M0 40 L90 0 L180 40 L180 120 L0 120 Z" fill={BASE} />
      <path d="M90 0 L180 40 L180 120 L120 120 L120 40 Z" fill={SHADE} />
      <rect x={30} y={62} width={70} height={58} rx={4} fill={SHADE} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={34} y={68 + i * 13} width={62} height={4} rx={2} fill={LIGHT} />
      ))}
      {children}
    </At>
  );
}

export function Cone({ x, y, s, className }: Placed) {
  return (
    <At x={x} y={y} s={s} w={24} h={30} className={className}>
      <path d="M12 0 L22 26 L2 26 Z" fill="#F08A3C" />
      <rect x={6} y={14} width={12} height={4} fill="#F2F0EA" />
      <rect x={0} y={26} width={24} height={4} rx={1} fill={SHADE} />
    </At>
  );
}

/* ---------- Paths of the stage: roads and what travels on them ---------- */

/** The SVG `d` of a path of the stage (defineVideo({ stage: { paths } })). */
export function usePath(id: string): string {
  const { paths } = useStage();
  const d = paths[id];
  if (!d) throw new Error(`"${id}" is not a path of the stage. Paths: ${Object.keys(paths).join(", ") || "none"}`);
  return d;
}

/** Where fraction `f` (0 to 1) of a path is, and its heading in degrees. */
export function pointAlong(d: string, f: number): { x: number; y: number; angle: number } {
  const length = getLength(d) * Math.max(0, Math.min(1, f));
  const point = getPointAtLength(d, length);
  const tangent = getTangentAtLength(d, length);
  if (!point) throw new Error(`No point at ${f} of the path "${d.slice(0, 40)}"`);
  return { x: point.x, y: point.y, angle: tangent ? (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI : 0 };
}

/**
 * A road drawn along a path of the stage: the asphalt, its edges and a dashed
 * line that moves, so the road looks alive even when nothing drives on it.
 */
export function RoadPath({ path, width = 56 }: { path: string; width?: number }) {
  const d = usePath(path);
  const t = useClock();
  const { world } = useStage();
  return (
    <svg className="absolute left-0 top-0 overflow-visible" width={world.width} height={world.height} aria-hidden>
      <path d={d} fill="none" stroke="#2A2D35" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#33373F" strokeWidth={width - 10} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={ACCENT} strokeWidth={3} strokeDasharray="22 22" strokeDashoffset={-t * 40} opacity={0.55} />
    </svg>
  );
}

/**
 * Puts its children on a path at fraction `at` (0 to 1), turned with the road
 * when `rotate` (cars), upright when not (signs, tokens).
 */
export function Along({ path, at, rotate = false, children }: { path: string; at: number; rotate?: boolean; children: ReactNode }) {
  const p = pointAlong(usePath(path), at);
  // A car going left would drive upside down: it flips instead of rotating past 90°.
  const flip = rotate && Math.abs(p.angle) > 90;
  const angle = rotate ? (flip ? p.angle - 180 : p.angle) : 0;
  return (
    <div className="absolute" style={{ left: p.x, top: p.y, transform: `rotate(${angle}deg) scaleX(${flip ? -1 : 1})` }}>
      {children}
    </div>
  );
}

/** Cars that loop along a path, spread out and at their own pace: traffic that never stops. */
export function Traffic({ path, count = 3, speed = 0.05, colors = ["#5B8DEF", "#E5534B", "#3FB37F", "#F2F0EA"] }: { path: string; count?: number; speed?: number; colors?: string[] }) {
  const t = useClock();
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const at = (((t * speed * (0.8 + hash(i) * 0.4) + i / count) % 1) + 1) % 1;
        return (
          <Along key={i} path={path} at={at} rotate>
            <Car x={0} y={10} s={0.8} color={colors[i % colors.length]} />
          </Along>
        );
      })}
    </>
  );
}
