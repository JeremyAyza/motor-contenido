import { EASE, unit, useClock, useCue } from "@motor/video";
import { Chip, Invader, Layer, Term, usePresence } from "../parts.tsx";
import { G, INK, MODEL } from "../world.tsx";
import { HarnessFrame, ToolButton } from "./modelo.tsx";

/** A vertical arrow from y0 to y1 at x, drawn by `p`, with a pulse running along it at `pulse` (0 → 1). */
function Arrow({ x, y0, y1, p, color, pulse }: { x: number; y0: number; y1: number; p: number; color: string; pulse?: number }) {
  if (p <= 0) return null;
  const y = y0 + (y1 - y0) * p;
  const dir = Math.sign(y1 - y0);
  return (
    <svg className="absolute left-0 top-0" width={540} height={960} aria-hidden>
      <line x1={x} y1={y0} x2={x} y2={y} stroke={color} strokeWidth={2.5} strokeDasharray="6 5" />
      {p >= 1 ? <path d={`M ${x - 8} ${y1 - 10 * dir} L ${x} ${y1} L ${x + 8} ${y1 - 10 * dir}`} fill="none" stroke={color} strokeWidth={2.5} /> : null}
      {pulse !== undefined && pulse > 0 && pulse < 1 ? <circle cx={x} cy={y0 + (y1 - y0) * pulse} r={7} fill={color} style={{ filter: `drop-shadow(0 0 8px ${color})` }} /> : null}
    </svg>
  );
}

/**
 * The harness loop: a JSON request types itself, travels down to a real
 * terminal, the terminal answers, and the result climbs back to the model as
 * text. On "una y otra vez" the step counter runs from 01 to 05.
 */
export function Harness() {
  const t = useClock();
  const pedido = useCue("pedido");
  const ejecuta = useCue("ejecuta");
  const devuelve = useCue("devuelve");
  const siguiente = useCue("siguiente");
  const otra = useCue("otra");
  const json = usePresence(pedido);
  const down = EASE.out(unit(t, ejecuta - 0.3, 0.5));
  const up = EASE.out(unit(t, devuelve - 0.2, 0.5));
  const step = t < siguiente ? 1 : t < otra ? 2 : Math.min(5, 2 + Math.floor((t - otra) / 0.3));
  const req = '{"tool": "bash",\n "command": "ls /var/log"}';
  const n = Math.min(req.length, Math.max(0, Math.floor((t - pedido - 0.2) / 0.03)));
  return (
    <Layer>
      <HarnessFrame at={-1}>
        {[0, 1, 2, 3].map((i) => <ToolButton key={i} i={i} p={1} lit={i === 0 ? EASE.out(unit(t, ejecuta - 0.4, 0.2)) : 0} />)}
        <div data-ui="" className="absolute left-[16px] top-[14px] rounded-[3px] px-[8px] py-[2px] font-mono text-[13px] font-bold" style={{ color: G, border: `1.5px solid ${G}` }}>
          paso {String(step).padStart(2, "0")}
        </div>
      </HarnessFrame>
      <Invader x={270} y={190} px={10} label="MODELO" />
      {json.on ? (
        <div data-ui="" className="absolute whitespace-pre rounded-[6px] px-[12px] py-[8px] font-mono text-[13px] leading-[1.4]" style={{ left: 214, top: 386, width: 212, color: INK, background: "rgba(20,8,6,0.92)", border: `1.5px solid ${MODEL}`, boxShadow: `0 0 12px ${MODEL}55`, opacity: json.o }}>
          {req.slice(0, n)}
        </div>
      ) : null}
      <Arrow x={440} y0={355} y1={566} p={down} color={G} pulse={unit(t, ejecuta + 0.2, 0.8)} />
      <Arrow x={196} y0={566} y1={355} p={up} color={MODEL} pulse={unit(t, devuelve + 0.1, 0.8)} />
      <Chip x={440} y={480} at={ejecuta} size={13}>Corre</Chip>
      <Chip x={196} y={480} at={devuelve} size={13} color={MODEL}>Resultado</Chip>
      <Term
        x={210}
        y={572}
        w={294}
        h={190}
        at={ejecuta - 0.2}
        title="PC real"
        size={14}
        lines={[
          { at: ejecuta, cmd: "ls /var/log" },
          { at: ejecuta, out: "auth.log  dpkg.log" },
          { at: ejecuta, out: "kern.log  syslog  nginx/" },
          { at: siguiente, cmd: "tail -n 2 syslog" },
          { at: siguiente, out: "nginx: listo en :80" },
          { at: siguiente, out: "app: error en checkout" },
        ]}
      />
    </Layer>
  );
}
