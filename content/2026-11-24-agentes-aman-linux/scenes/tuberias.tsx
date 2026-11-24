import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { GlowTitle, Layer, Term } from "../parts.tsx";
import { BG, G, INK, MUTED, RED } from "../world.tsx";

const BOXES: Array<{ head: string; cmd: string; x: number }> = [
  { head: "LEE", cmd: "cat app.log", x: 36 },
  { head: "FILTRA", cmd: "grep ERROR", x: 196 },
  { head: "ÚLTIMOS", cmd: "tail -5", x: 356 },
];

const LOG = [
  "INFO  servidor listo",
  "ERROR db pool empty",
  "INFO  GET /checkout 200",
  "ERROR no db conn",
  "WARN  reintento 2",
  "ERROR worker exited",
];

/**
 * Pipes: Rick's three boxes joined by tubes over a STDOUT box. On "tuberías"
 * the boxes land; on "salida" and "siguiente" the tubes fill left to right;
 * then cat, grep and tail light up one by one with the voice, and STDOUT
 * filters the log down to the errors.
 */
export function Tuberias() {
  const t = useClock();
  const tuberias = useCue("tuberías");
  const salida = useCue("salida");
  const siguiente = useCue("siguiente");
  const linea = useCue("línea");
  const cues = [useCue("cat"), useCue("grep"), useCue("tail")];
  const fill1 = EASE.out(unit(t, salida, 0.5));
  const fill2 = EASE.out(unit(t, siguiente, 0.5));
  const stage = cues.filter((c) => t >= c + 0.3).length;
  const lines = stage === 0 ? [] : stage === 1 ? LOG : stage === 2 ? LOG.filter((l) => l.startsWith("ERROR")) : LOG.filter((l) => l.startsWith("ERROR")).slice(-5);
  return (
    <Layer>
      <GlowTitle text="Tuberías" y={92} size={44} at={0} />
      <svg className="absolute left-0 top-0" width={540} height={960} aria-hidden>
        {[0, 1].map((i) => {
          const f = i === 0 ? fill1 : fill2;
          const x0 = BOXES[i].x + 148;
          return (
            <g key={i}>
              <rect x={x0} y={200} width={48} height={14} fill="none" stroke={G} strokeOpacity={0.6} strokeWidth={1.5} />
              <rect x={x0} y={200} width={48 * f} height={14} fill={G} fillOpacity={0.7} />
            </g>
          );
        })}
        <rect x={426} y={252} width={14} height={60} fill="none" stroke={G} strokeOpacity={0.6} strokeWidth={1.5} />
        <rect x={426} y={252} width={14} height={60 * EASE.out(unit(t, cues[2] + 0.1, 0.4))} fill={G} fillOpacity={0.7} />
      </svg>
      {BOXES.map((b, i) => {
        const p = popAt(t, tuberias + i * 0.15);
        const lit = EASE.out(unit(t, cues[i], 0.2));
        return (
          <div
            key={b.cmd}
            data-ui=""
            className="absolute flex flex-col items-center justify-center rounded-[6px] font-mono"
            style={{ left: b.x, top: 172, width: 148, height: 80, background: lit > 0.5 ? "rgba(60,255,138,0.14)" : "rgba(4,16,10,0.92)", border: `2px solid ${G}`, boxShadow: `0 0 ${10 + 14 * lit}px ${G}66`, opacity: Math.min(1, p * 2), transform: `scale(${0.7 + 0.3 * Math.min(1, p)})` }}
          >
            <span className="text-[13px] font-bold tracking-[0.12em]" style={{ color: MUTED }}>{b.head}</span>
            <span className="mt-[4px] text-[18px] font-bold" style={{ color: G }}>{b.cmd}</span>
          </div>
        );
      })}
      <div data-ui="" className="absolute rounded-[6px] px-[14px] py-[8px] font-mono" style={{ left: 36, top: 312, width: 468, height: 190, background: "rgba(4,16,10,0.92)", border: `1.5px solid ${G}`, opacity: EASE.out(unit(t, tuberias + 0.3, 0.3)) }}>
        <div className="text-[13px] font-bold tracking-[0.12em]" style={{ color: MUTED }}>STDOUT</div>
        {lines.map((l) => (
          <div key={l} className="text-[15px] leading-[1.45]" style={{ color: l.startsWith("ERROR") ? RED : INK }}>{l}</div>
        ))}
      </div>
      <Term x={210} y={580} w={294} h={120} at={linea - 0.2} size={12} lines={[{ at: linea, cmd: "cat app.log | grep ERROR | tail -5", prompt: "$" }]} />
      <div data-ui="" className="absolute font-mono text-[12px] font-bold" style={{ left: 210, top: 708, color: MUTED, opacity: EASE.out(unit(t, linea + 1, 0.3)), background: BG }}>
        Una línea, tres comandos.
      </div>
    </Layer>
  );
}
