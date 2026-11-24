import type { ReactNode } from "react";
import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Bracket, Chip, Invader, Layer } from "../parts.tsx";
import { BG, G, MODEL, RED } from "../world.tsx";

/** The harness frame, shared with the next scene: where it sits and its four tools. */
export const FRAME = { x: 60, y: 100, w: 420, h: 250 };
export const TOOLS = ["bash", "leer", "escribir", "editar"] as const;

/** One tool button of the harness, inside the frame. */
export function ToolButton({ i, p, lit = 0 }: { i: number; p: number; lit?: number }) {
  if (p <= 0) return null;
  const w = 88;
  return (
    <div
      data-ui=""
      className="absolute flex items-center justify-center rounded-[4px] font-mono text-[15px] font-bold"
      style={{
        left: 22 + i * (w + 8),
        top: 186,
        width: w,
        height: 34,
        color: lit > 0.5 ? BG : G,
        background: lit > 0.5 ? G : "rgba(3,8,6,0.9)",
        border: `1.5px solid ${G}`,
        boxShadow: `0 0 ${8 + 10 * lit}px ${G}66`,
        opacity: Math.min(1, p * 2),
        transform: `translateY(${(1 - Math.min(1, p)) * 12}px)`,
      }}
    >
      {TOOLS[i]}
    </div>
  );
}

export function HarnessFrame({ at, children }: { at: number; children?: ReactNode }) {
  return (
    <Bracket x={FRAME.x} y={FRAME.y} w={FRAME.w} h={FRAME.h} at={at} color={MODEL} title="HARNESS">
      {children}
    </Bracket>
  );
}

/**
 * The model: Rick's pixel invader, which only reads and writes text (two chips,
 * in and out). A key drops and bounces away from it on "teclado". On
 * "harness" the frame draws itself around it, and each tool lands with its name.
 */
export function Modelo() {
  const t = useClock();
  const lee = useCue("lee");
  const escribe = useCue("escribe");
  const teclado = useCue("teclado");
  const harness = useCue("harness");
  const cues = [useCue("bash"), useCue("leer"), useCue("escribir"), useCue("editar")];
  const fall = EASE.in(unit(t, teclado, 0.5));
  const away = EASE.out(unit(t, teclado + 0.5, 0.6));
  const keyOn = t >= teclado - 0.1 && away < 1;
  const shift = EASE.inOut(unit(t, harness - 0.2, 0.4));
  return (
    <Layer>
      <HarnessFrame at={harness}>
        {cues.map((c, i) => <ToolButton key={i} i={i} p={popAt(t, c)} />)}
      </HarnessFrame>
      <Invader x={270} y={190 - 0 * shift} px={10} at={0.1} label="MODELO" />
      <Chip x={120 + 0 * shift} y={420} at={lee} size={15}>Texto entra →</Chip>
      <Chip x={420} y={420} at={escribe} size={15} color={MODEL}>→ Texto sale</Chip>
      {keyOn ? (
        <div
          data-ui=""
          className="absolute flex items-center justify-center rounded-[8px] font-mono text-[18px] font-bold"
          style={{
            left: 380 + away * 90,
            top: 380 + fall * 200 - away * 60,
            width: 86,
            height: 56,
            color: G,
            background: "rgba(4,16,10,0.95)",
            border: `2px solid ${G}`,
            boxShadow: `0 6px 0 ${G}55`,
            transform: `rotate(${away * 40}deg)`,
            opacity: 1 - away,
          }}
        >
          Enter
        </div>
      ) : null}
      {t >= teclado + 0.4 && t < harness ? (
        <div className="absolute font-mono text-[44px] font-bold" style={{ left: 410, top: 520, color: RED, textShadow: `0 0 14px ${RED}` }}>✕</div>
      ) : null}
    </Layer>
  );
}
