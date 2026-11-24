import { useClock, useCue } from "@motor/video";
import { Cover, Crowd, Layer, Mono, NodeLine, Title, useOn } from "../parts.tsx";
import { G, INK, MUTED } from "../world.tsx";

/**
 * Scale: a clock strikes 00:00 next to a new session's cover; a crowd fills
 * in a wave while a counter climbs (an illustrative number); "CACHÉ Y CDN"
 * big; then the node line again, each node getting its copy, and the road to
 * the central origin crossed out.
 */
export function Medianoche() {
  const t = useClock();
  const sesion = useCue("sesión");
  const medianoche = useCue("medianoche");
  const millones = useCue("Millones");
  const tiempo = useCue("tiempo");
  const cache = useCue("caché");
  const copian = useCue("copian");
  const central = useCue("central");
  const clock = useOn(0.05, 0.3) * (1 - useOn(millones - 0.25, 0.2));
  const strike = t >= medianoche;
  const minute = strike ? 0 : 59;
  const sec = strike ? 0 : Math.min(59, 50 + Math.floor(t * 2));
  const crowd = useOn(millones - 0.2, 0.2) * (1 - useOn(cache - 0.3, 0.2));
  const count = Math.round(2418903 * Math.min(1, Math.max(0, (t - millones) / 2.4)) ** 0.6);
  const angle = strike ? 0 : (sec / 60) * 360 - 6;
  return (
    <Layer>
      {clock > 0 ? (
        <div className="absolute left-0 top-0" style={{ width: 540, height: 960, opacity: clock }}>
          <div className="absolute rounded-full" style={{ left: 70, top: 180, width: 150, height: 150, border: `3px solid ${strike ? G : INK}`, boxShadow: strike ? `0 0 24px ${G}88` : "none" }}>
            <div className="absolute left-1/2 top-1/2" style={{ width: 3, height: 56, background: INK, transformOrigin: "50% 100%", transform: `translate(-50%, -100%) rotate(${angle}deg)` }} />
            <div className="absolute left-1/2 top-1/2" style={{ width: 4, height: 40, background: INK, transformOrigin: "50% 100%", transform: `translate(-50%, -100%) rotate(${strike ? 0 : -3}deg)` }} />
          </div>
          <div data-ui="" className="absolute font-mono text-[26px] font-bold" style={{ left: 92, top: 350, color: strike ? G : INK }}>{strike ? "00:00" : `23:${minute}`}</div>
          <Cover n={8} x={290} y={170} size={180} at={sesion - 0.2} ring />
          <Mono x={380} y={366} at={sesion} color={INK}>Sesión nueva</Mono>
        </div>
      ) : null}
      <Title text="Estreno a medianoche" at={medianoche} until={millones - 0.25} />

      {crowd > 0 ? (
        <div className="absolute left-0 top-0" style={{ width: 540, height: 960, opacity: crowd }}>
          <Crowd x={60} y={150} cols={12} rows={6} gapX={36} gapY={42} s={1.4} at={millones - 0.1} />
        </div>
      ) : null}
      {crowd > 0 && t >= millones ? (
        <div className="absolute" style={{ left: 214, top: 596, opacity: crowd }}>
          <div data-ui="" className="font-mono text-[42px] font-bold leading-none" style={{ color: INK }}>{count.toLocaleString("es-AR")}</div>
          <div data-ui="" className="mt-[10px] font-mono text-[13px] font-bold tracking-[0.12em]" style={{ color: G }}>AL MISMO TIEMPO</div>
          <div data-ui="" className="mt-[6px] font-mono text-[12px] font-bold tracking-[0.12em]" style={{ color: MUTED }}>EJEMPLO ILUSTRATIVO</div>
        </div>
      ) : null}
      <Mono x={270} y={420} at={tiempo} until={cache - 0.3} color={G} size={14}>La misma canción</Mono>

      <Title text="Caché y CDN" at={cache} until={copian - 0.3} big y={240} />
      <NodeLine y={280} at={copian - 0.25} nodesAt={copian - 0.1} count={5} pulse={false} copies={copian} cut={central} />
      <Title text="Una copia por región" at={copian} until={central - 0.15} />
      <Title text="No desde el centro" at={central} />
    </Layer>
  );
}
