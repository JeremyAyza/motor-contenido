import type { ReactNode } from "react";
import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Layer, LangMark } from "../parts.tsx";
import { BG, GO, INK, LANES, LINE, MUTED, RUST, SURFACE } from "../world.tsx";

/** A priority pill that lights up when it is said. */
function Pill({ x, y, at, color, children }: { x: number; y: number; at: number; color: string; children: ReactNode }) {
  const t = useClock();
  const p = popAt(t, at);
  const lit = t >= at;
  return (
    <div data-ui="" className="absolute whitespace-nowrap rounded-[4px] px-[10px] py-[5px] font-mono text-[16px] font-bold" style={{ left: x, top: y, transform: `scale(${lit ? 0.9 + 0.1 * Math.min(1.05, p) : 0.94})`, transformOrigin: "0 50%", background: lit ? color : "rgba(22,24,27,0.7)", color: lit ? BG : MUTED, border: `1.5px solid ${lit ? color : LINE}` }}>
      {children}
    </div>
  );
}

/** A small code card at the bottom of a lane. */
function Card({ y, code, note, color, at }: { y: number; code: string; note: string; color: string; at: number }) {
  const t = useClock();
  return (
    <div data-ui="" className="absolute rounded-[6px] px-[10px] py-[8px]" style={{ left: 36, top: y, width: 468, background: SURFACE, border: `1px solid ${LINE}`, opacity: EASE.out(unit(t, at, 0.3)) }}>
      <div className="font-mono text-[14px]" style={{ color }}>{code}</div>
      <div className="mt-[3px] font-mono text-[12px]" style={{ color: MUTED }}>{note}</div>
    </div>
  );
}

/** The memory line of each language: Go's saw, Rust's flat line, drawn from left to right. */
function MemLine({ y, color, saw, at }: { y: number; color: string; saw: boolean; at: number }) {
  const t = useClock();
  const k = EASE.out(unit(t, at, 1.2));
  const pts: string[] = [];
  for (let i = 0; i <= 40 * k; i++) pts.push(`${i * 4},${saw ? 30 - ((i * 3) % 12) * 2.2 : 18}`);
  return (
    <svg className="absolute" style={{ left: 330, top: y }} width={170} height={40} aria-hidden>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={2} />
    </svg>
  );
}

/**
 * The priorities: the two lanes come back full screen. Go's pills
 * (simplicity, productivity) light up with its saw of sweeps; then Rust's
 * (control, memory safety, predictable performance) with its flat line.
 */
export function Prioridades() {
  const simplicidad = useCue("simplicidad");
  const productividad = useCue("productividad.");
  const rust = useCue("Rust");
  const control = useCue("control,");
  const seguridad = useCue("seguridad");
  const rendimiento = useCue("rendimiento");
  const t = useClock();
  const head = (lang: "go" | "rust", y: number, at: number) => (
    <>
      <LangMark lang={lang} x={84} y={y} size={lang === "go" ? 74 : 56} at={at} from={lang === "go" ? "left" : "top"} />
      <div className="absolute font-display text-[26px] font-black" style={{ left: 140, top: y - 18, color: INK, opacity: EASE.out(unit(t, at, 0.3)) }}>prioriza</div>
    </>
  );
  return (
    <Layer>
      {head("go", 140, 0)}
      <Pill x={36} y={196} at={simplicidad} color={GO}>simplicidad</Pill>
      <Pill x={36} y={240} at={productividad} color={GO}>productividad</Pill>
      <MemLine y={190} color={GO} saw at={simplicidad} />
      <Card y={318} code="go handle(req)" note="una palabra y corre a la vez" color={GO} at={productividad} />
      {head("rust", LANES.mid + 52, rust - 0.2)}
      <Pill x={36} y={LANES.mid + 104} at={control} color={RUST}>control</Pill>
      <Pill x={36} y={LANES.mid + 148} at={seguridad} color={RUST}>seguridad de memoria</Pill>
      <Pill x={36} y={LANES.mid + 192} at={rendimiento} color={RUST}>rendimiento predecible</Pill>
      <MemLine y={LANES.mid + 110} color={RUST} saw={false} at={control} />
      <Card y={LANES.mid + 250} code="fn longest<'a>(a: &'a str, b: &'a str) -> &'a str" note="le dices quién es dueño de qué; el compilador te obliga" color={RUST} at={seguridad} />
    </Layer>
  );
}
