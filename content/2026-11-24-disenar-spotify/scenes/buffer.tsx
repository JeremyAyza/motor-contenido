import { EASE, unit, useClock, useCue } from "@motor/video";
import { Bitrates, Layer, Mono, Title, useOn } from "../parts.tsx";
import { DIM, G, G2, INK, LINE, MUTED, RED } from "../world.tsx";

/**
 * Instant: "OTRO PROBLEMA" big; a spinner that counts five seconds nobody
 * waits; the playback bar with the head at second 10 and the buffer already
 * at 30; the signal loses bars and the bitrate arrow drops to 96, while the
 * head never stops.
 */
export function Buffer() {
  const t = useClock();
  const nadie = useCue("Nadie");
  const descarga = useCue("descarga");
  const segundo = useCue("segundo");
  const buffer = useCue("buffer");
  const conexion = useCue("conexión");
  const baja = useCue("baja");
  const menor = useCue("menor");
  const sigue = useCue("sigue");
  const wait = useOn(nadie - 0.1, 0.25) * (1 - useOn(descarga - 0.2, 0.2));
  const waited = Math.min(5, Math.max(0, Math.floor((t - nadie) * 2.2)));
  const bar = useOn(descarga - 0.1, 0.3);
  // The head moves from 6 s of song to 10 when the voice says "segundo", then keeps playing.
  const head = t < segundo ? 6 + 4 * unit(t, descarga, segundo - descarga) : 10 + (t - segundo) * 0.9;
  const ahead = t < segundo ? head + 6 + 14 * EASE.out(unit(t, descarga + 0.3, 1.2)) : Math.max(30, head + 20);
  const x0 = 50;
  const w = 440;
  const toX = (s: number) => x0 + (Math.min(60, s) / 60) * w;
  const signal = t < conexion ? 4 : t < conexion + 0.5 ? 2 : 1;
  const low = useOn(baja - 0.2, 0.3);
  return (
    <Layer>
      <Title text="Otro problema" at={0} until={nadie - 0.2} big y={240} />

      {wait > 0 ? (
        <div className="absolute flex flex-col items-center" style={{ left: 170, top: 190, width: 200, opacity: wait }}>
          <svg width={90} height={90} viewBox="0 0 40 40" style={{ transform: `rotate(${t * 360}deg)` }} aria-hidden>
            <circle cx={20} cy={20} r={16} fill="none" stroke={DIM} strokeWidth={3} />
            <path d="M20 4 A16 16 0 0 1 36 20" fill="none" stroke={G} strokeWidth={3} strokeLinecap="round" />
          </svg>
          <div data-ui="" className="mt-[16px] font-mono text-[34px] font-bold" style={{ color: INK }}>0:0{waited}</div>
        </div>
      ) : null}
      <Title text="Nadie espera 5 segundos" at={nadie} until={descarga - 0.2} />

      {bar > 0 ? (
        <div className="absolute left-0 top-0" style={{ width: 540, height: 960, opacity: bar }}>
          <div className="absolute rounded-[5px]" style={{ left: x0, top: 230, width: w, height: 14, background: "#16201B" }} />
          <div className="absolute rounded-[5px]" style={{ left: x0, top: 230, width: toX(ahead) - x0, height: 14, background: G2 }} />
          <div className="absolute rounded-[5px]" style={{ left: x0, top: 230, width: toX(head) - x0, height: 14, background: G, boxShadow: `0 0 12px ${G}` }} />
          <div className="absolute" style={{ left: toX(head) - 1.5, top: 220, width: 3, height: 34, background: INK }} />
          {[0, 10, 20, 30, 40, 50, 60].map((s) => (
            <span key={s} data-ui="" className="absolute font-mono text-[12px]" style={{ left: toX(s) - 8, top: 262, color: MUTED }}>{s}</span>
          ))}
          <Mono x={x0} y={190} at={segundo} align="left" color={INK} size={14}>Segundo {Math.floor(head)}</Mono>
          <Mono x={x0 + 200} y={190} at={segundo + 0.35} align="left" color={G} size={14}>Ya descargado: 30</Mono>
          {/* The signal, top right. */}
          <div className="absolute flex items-end gap-[4px]" style={{ left: 444, top: 126 }}>
            {[1, 2, 3, 4].map((k) => <div key={k} style={{ width: 7, height: 6 + k * 6, background: k <= signal ? (signal < 4 ? RED : INK) : DIM, borderRadius: 1 }} />)}
          </div>
          <Mono x={452} y={168} at={conexion - 0.2} color={signal < 4 ? RED : MUTED}>Conexión</Mono>
        </div>
      ) : null}
      <Bitrates x={70} y={310} at={baja - 0.2} arrow={menor} label="" scale={0.92} hot={[]} />
      <Title text="Descarga por adelantado" at={descarga} until={buffer - 0.15} />
      <Title text="El buffer te protege" at={buffer} until={sigue - 0.15} />
      <Title text="Sigue sonando" at={sigue} size={46} color={low > 0 ? INK : INK} />
    </Layer>
  );
}
