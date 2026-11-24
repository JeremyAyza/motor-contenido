import { EASE, unit, useClock, useCue } from "@motor/video";
import { Cover, Layer, Mono, Title, useOn } from "../parts.tsx";
import { DIM, G, INK, LINE, MUTED } from "../world.tsx";

/**
 * Recommendations: the big word; the song now playing tied to a dashed box
 * with "?"; a weekly mosaic of four covers; then the audio path across the top
 * with the recommender box hanging from it on a thread, swinging: another
 * system, beside the audio, not in it.
 */
export function Recomendaciones() {
  const t = useClock();
  const escucha = useCue("escucha");
  const descubrimiento = useCue("Descubrimiento");
  const suena = useCue("suena");
  const sistema = useCue("sistema");
  const a = useOn(escucha - 0.2, 0.3) * (1 - useOn(sistema - 0.35, 0.2));
  const q = EASE.out(unit(t, escucha + 0.3, 0.3));
  const blink = t >= suena && t < sistema ? 0.55 + 0.45 * Math.abs(Math.sin((t - suena) * 6)) : 1;
  const path = EASE.out(unit(t, sistema - 0.3, 0.5));
  const drop = EASE.back(unit(t, sistema, 0.6));
  const swing = Math.sin((t - sistema) * 3) * 6 * Math.exp(-Math.max(0, t - sistema) * 0.6);
  return (
    <Layer>
      <Title text="Recomendaciones" at={0} until={escucha - 0.25} big size={40} y={264} />

      {a > 0 ? (
        <div className="absolute left-0 top-0" style={{ width: 540, height: 960, opacity: a }}>
          <Cover n={13} x={60} y={160} size={110} at={escucha - 0.2} />
          <Mono x={115} y={282} at={escucha - 0.1} color={G}>Sonando</Mono>
          <div className="absolute" style={{ left: 176, top: 214, width: 90 * q, height: 2, background: LINE }} />
          <div className="absolute flex items-center justify-center rounded-[6px] font-mono text-[44px] font-bold" style={{ left: 270, top: 160, width: 110, height: 110, border: `2px dashed ${MUTED}`, color: INK, opacity: q * blink }}>?</div>
          <div className="absolute rounded-[6px]" style={{ left: 394, top: 160, width: 110, height: 110, border: `1.5px solid ${DIM}`, opacity: q * 0.6 }} />
          {[0, 1, 2, 3].map((i) => (
            <Cover key={i} n={[5, 9, 11, 3][i]} x={190 + (i % 2) * 82} y={320 + Math.floor(i / 2) * 82} size={76} at={descubrimiento - 0.2 + i * 0.1} />
          ))}
          <Mono x={270} y={490} at={descubrimiento} color={INK}>Descubrimiento semanal</Mono>
        </div>
      ) : null}
      <Title text="¿Qué escucha después?" at={escucha} until={sistema - 0.35} />

      {t >= sistema - 0.3 ? (
        <>
          <Mono x={270} y={160} at={sistema - 0.3} color={G}>Camino del audio</Mono>
          <div className="absolute" style={{ left: 50, top: 186, width: 440 * path, height: 22, background: G, borderRadius: 3, boxShadow: `0 0 16px ${G}66` }} />
          <div className="absolute" style={{ left: 270, top: 208, width: 2, height: 96 * drop, background: MUTED, transformOrigin: "50% 0", transform: `rotate(${swing}deg)` }} />
          <div className="absolute flex items-center justify-center rounded-[6px] font-mono text-[18px] font-bold tracking-[0.12em]" data-ui="" style={{ left: 150, top: 300, width: 240, height: 70, border: `2px solid ${INK}`, background: "rgba(10,16,13,0.95)", color: INK, opacity: Math.min(1, drop * 1.5), transformOrigin: "120px -92px", transform: `translateY(${(1 - Math.min(1, drop)) * -40}px) rotate(${swing}deg)` }}>
            RECOMENDADOR
          </div>
        </>
      ) : null}
      <Title text="Otro sistema completo" at={sistema} />
    </Layer>
  );
}
