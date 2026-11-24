import { EASE, unit, useClock, useCue } from "@motor/video";
import { Layer, Title, useOn } from "../parts.tsx";
import { DIM, G, G2, INK, LINE, MUTED } from "../world.tsx";

/**
 * The whole thing: Spotify as a board of six systems that light up as the
 * voice names each one, joined by lines; under them, a strip of listening data
 * that fills.
 */
export function Mapa() {
  const t = useClock();
  const sistemas = useCue("sistemas");
  const boxes = [
    { name: "ALMACENAMIENTO", sub: "guarda el audio", at: useCue("almacenamiento") },
    { name: "CDN", sub: "lo entrega", at: useCue("CDN") },
    { name: "ÍNDICE", sub: "encuentra canciones", at: useCue("índice") },
    { name: "RECOMENDADOR", sub: "decide qué sigue", at: useCue("recomendador") },
    { name: "BASES DE DATOS", sub: "cuenta y playlists", at: useCue("bases") },
    { name: "PROCESOS EN LOTE", sub: "datos de escucha", at: useCue("procesos") },
  ];
  const montanas = useCue("montañas");
  const juntos = useCue("juntos");
  const W = 210;
  const H = 86;
  const pos = (i: number) => ({ x: 48 + (i % 2) * 234, y: 150 + Math.floor(i / 2) * 116 });
  const strip = EASE.inOut(unit(t, montanas - 0.3, 1.6));
  const stripOn = useOn(sistemas, 0.3);
  const labelOn = useOn(montanas, 0.3);
  return (
    <Layer>
      {/* The spine between the two columns: it fills down as the systems light up. */}
      <div className="absolute" style={{ left: 269, top: 150, width: 2, height: 3 * 116 - 30, background: LINE }} />
      <div className="absolute" style={{ left: 269, top: 150, width: 2, height: (3 * 116 - 30) * (boxes.filter((b) => t >= b.at).length / 6), background: G, boxShadow: `0 0 8px ${G}` }} />
      {boxes.map((b, i) => {
        const { x, y } = pos(i);
        const appear = EASE.out(unit(t, 0.1 + i * 0.12, 0.3)) * (t < sistemas ? 0.6 : 1);
        const lit = EASE.out(unit(t, b.at - 0.1, 0.3));
        const flash = Math.max(0, 1 - Math.abs(t - b.at - 0.1) / 0.35);
        return appear > 0 ? (
          <div key={b.name} data-ui="" className="absolute flex flex-col items-center justify-center rounded-[7px]" style={{ left: x, top: y, width: W, height: H, opacity: appear, border: `1.5px solid ${lit > 0.5 ? G : LINE}`, background: lit > 0.5 ? "rgba(30,215,96,0.08)" : "rgba(10,16,13,0.92)", boxShadow: lit > 0.5 ? `0 0 ${12 + 14 * flash}px ${G}${flash > 0 ? "aa" : "44"}` : "none", transform: `scale(${1 + 0.06 * flash})` }}>
            <span className="font-mono text-[16px] font-bold tracking-[0.1em]" style={{ color: lit > 0.5 ? INK : DIM }}>{b.name}</span>
            <span className="mt-[4px] font-mono text-[13px]" style={{ color: lit > 0.5 ? G : DIM }}>{b.sub}</span>
          </div>
        ) : null;
      })}
      <div className="absolute flex flex-wrap gap-[3px]" style={{ left: 48, top: 510, width: 444 }}>
        {Array.from({ length: 74 }, (_, i) => {
          const on = i / 74 < strip;
          return <div key={i} style={{ width: 9, height: 9, borderRadius: 1, background: on ? (i % 3 ? G2 : G) : "#121A16", opacity: stripOn }} />;
        })}
      </div>
      <Title text="Varios sistemas, juntos" at={juntos} until={montanas - 0.2} />
      <Title text="Montañas de datos" at={montanas} />
      <div data-ui="" className="absolute font-mono text-[12px] font-bold tracking-[0.12em]" style={{ left: 48, top: 562, color: MUTED, opacity: labelOn }}>DATOS DE ESCUCHA</div>
    </Layer>
  );
}
