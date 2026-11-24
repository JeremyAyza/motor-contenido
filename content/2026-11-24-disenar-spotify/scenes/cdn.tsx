import { EASE, unit, useClock, useCue } from "@motor/video";
import { Chip, Layer, Mono, NodeLine, Title, useOn } from "../parts.tsx";
import { G, INK, LINE, MUTED } from "../world.tsx";

/**
 * Delivery: the line from the origin to your phone fills with green CDN
 * nodes and a pulse runs to you. Then two lanes: a thin one for the back end's
 * decisions and a thick green one for the audio, which turns into a wave.
 */
export function Cdn() {
  const t = useClock();
  const servidores = useCue("servidores");
  const cerca = useCue("cerca");
  const cdn = useCue("CDN");
  const caminos = useCue("caminos");
  const decide = useCue("decide");
  const entrega = useCue("entrega");
  const lanes = useOn(caminos - 0.1, 0.3);
  const thin = EASE.out(unit(t, caminos, 0.5));
  const thick = EASE.out(unit(t, caminos + 0.3, 0.5));
  const wave = EASE.out(unit(t, entrega, 0.4));
  return (
    <Layer>
      <NodeLine y={280} at={0.05} until={caminos - 0.2} nodesAt={cerca - 0.2} />
      <Title text="Servidores cerca de ti" at={servidores} until={cdn - 0.1} />
      <Title text="Un CDN" at={cdn} until={caminos - 0.2} size={46} />

      {lanes > 0 ? (
        <div className="absolute left-0 top-0" style={{ width: 540, height: 960, opacity: lanes }}>
          <Mono x={270} y={175} at={caminos} color={t >= decide ? INK : MUTED}>Decisiones</Mono>
          <div className="absolute" style={{ left: 50, top: 205, width: 440 * thin, height: 2, background: t >= decide ? INK : LINE }} />
          <Chip x={270} y={235} at={decide} color={INK}>Back end</Chip>
          <div className="absolute" style={{ left: 50, top: 300, width: 440, height: 1, borderTop: `1px dashed ${LINE}` }} />
          <div className="absolute flex items-center gap-[3px] overflow-hidden" style={{ left: 50, top: 340, width: 440 * thick, height: 56 }}>
            {Array.from({ length: 64 }, (_, i) => {
              const h = 30 + wave * 22 * Math.sin(i * 0.9 + t * 9) * Math.sin(i * 0.27 + t * 2);
              return <div key={i} style={{ width: 4, height: Math.max(6, h), background: G, borderRadius: 1, boxShadow: `0 0 8px ${G}66` }} />;
            })}
          </div>
          <Mono x={270} y={410} at={caminos + 0.3} color={t >= entrega ? G : MUTED}>Entrega del audio</Mono>
          <Chip x={270} y={455} at={entrega} color={G} border={G}>CDN</Chip>
        </div>
      ) : null}
      <Title text="Dos caminos separados" at={caminos} />
    </Layer>
  );
}
