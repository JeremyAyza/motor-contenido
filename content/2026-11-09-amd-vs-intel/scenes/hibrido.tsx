import { DrawPath, EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Layer, Mono, Title } from "../parts.tsx";
import { ACCENT, AMBER, DIM, INK, INTEL, INTEL_FILL, INTEL_TEXT, MUTED } from "../world.tsx";

const X0 = 200;

/** A task chip that drops onto its core: the core lights up when it lands. */
function Task({ x, y, label, at, color }: { x: number; y: number; label: string; at: number; color: string }) {
  const t = useClock();
  const p = popAt(t, at);
  return (
    <div data-ui="" className="absolute rounded-[6px] px-2 py-[3px] font-mono text-[16px] font-bold" style={{ left: x, top: y, color: "#05070A", background: color, opacity: t < at ? 0 : Math.min(1, p * 2), transform: `scale(${0.7 + 0.3 * Math.min(1, p)})` }}>
      {label}
    </div>
  );
}

/** Intel's hybrid design: big performance cores, small efficiency cores, and Thread Director handing out the work. */
export function Hibrido() {
  const t = useClock();
  const rendimiento = useCue("rendimiento");
  const pesado = useCue("pesado");
  const eficiencia = useCue("eficiencia");
  const fondo = useCue("fondo");
  const thread = useCue("Thread");
  const repartir = useCue("repartir");
  const pRow = 0.3 + 0.7 * EASE.out(unit(t, rendimiento - 0.2, 0.35));
  const eRow = 0.3 + 0.7 * EASE.out(unit(t, eficiencia - 0.2, 0.35));
  const busyP = (i: number) => (i === 1 && t >= pesado + 0.3) || (i === 5 && t >= repartir + 0.3);
  const busyE = (i: number) => ([2, 9].includes(i) && t >= fondo + 0.3) || (i === 13 && t >= repartir + 0.45);
  const dir = popAt(t, thread - 0.1);
  return (
    <Layer>
      <Title x={X0} width={304}>
        Intel: híbrido
      </Title>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={`p${i}`} className="absolute rounded-[5px]" style={{ left: X0 + i * 38, top: 222, width: 34, height: 44, background: busyP(i) ? INTEL : INTEL_FILL, opacity: pRow, boxShadow: busyP(i) ? `0 0 14px ${INTEL}` : "none" }} />
      ))}
      <Mono x={X0} y={272} size={16} color={INTEL_TEXT} style={{ opacity: pRow }}>
        8 DE RENDIMIENTO
      </Mono>
      {Array.from({ length: 16 }, (_, i) => (
        <div key={`e${i}`} className="absolute rounded-[3px]" style={{ left: X0 + i * 19, top: 306, width: 16, height: 20, background: busyE(i) ? INTEL_TEXT : "#183A66", opacity: eRow, boxShadow: busyE(i) ? `0 0 10px ${INTEL_TEXT}` : "none" }} />
      ))}
      <Mono x={X0} y={332} size={16} color={MUTED} style={{ opacity: eRow }}>
        16 DE EFICIENCIA
      </Mono>
      <svg className="absolute" width={540} height={960} style={{ left: 0, top: 0 }} aria-hidden>
        <DrawPath d="M 330 560 C 340 520, 400 420, 400 268" at={repartir} dur={0.4} stroke={AMBER} strokeWidth={2} strokeDasharray="5 4" />
        <DrawPath d="M 440 560 C 450 500, 450 400, 452 328" at={repartir + 0.15} dur={0.4} stroke={ACCENT} strokeWidth={2} strokeDasharray="5 4" />
      </svg>
      <Task x={X0} y={392} label="JUEGO" at={pesado - 0.15} color={AMBER} />
      <Task x={X0 + 10} y={436} label="SINCRONIZAR" at={fondo - 0.15} color={ACCENT} />
      <Task x={X0 + 150} y={436} label="CORREO" at={fondo} color={ACCENT} />
      {t >= thread - 0.1 ? (
        <>
          <Card x={X0} y={560} w={110} h={64} style={{ opacity: Math.min(1, dir * 2) }}>
            <div className="flex h-full items-center justify-center font-mono text-[15px] font-bold" style={{ color: INK }}>
              SISTEMA
            </div>
          </Card>
          <Card x={X0 + 150} y={560} w={154} h={64} active={INTEL} style={{ opacity: Math.min(1, popAt(t, thread + 0.1) * 2) }}>
            <div className="flex h-full flex-col items-center justify-center font-mono text-[15px] font-bold leading-tight" style={{ color: INTEL_TEXT }}>
              <span>THREAD</span>
              <span>DIRECTOR</span>
            </div>
          </Card>
          <svg className="absolute" width={40} height={20} style={{ left: X0 + 112, top: 582 }} aria-hidden>
            <path d="M 34 10 L 4 10 M 12 3 L 3 10 L 12 17" fill="none" stroke={DIM} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Mono x={X0 + 100} y={636} size={13} color={MUTED}>
            LE DA PISTAS
          </Mono>
        </>
      ) : null}
      <Task x={X0 + 112} y={488} label="VIDEO" at={repartir - 0.1} color={AMBER} />
      <Task x={X0 + 210} y={488} label="ESCANEO" at={repartir + 0.05} color={ACCENT} />
    </Layer>
  );
}
