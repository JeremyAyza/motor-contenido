import { EASE, unit, useClock, useCue } from "@motor/video";
import { Card, Layer, Mono, PlayButton, Title, XMark, useOn } from "../parts.tsx";
import { G, INK, MUTED } from "../world.tsx";

/**
 * Playback: you press play and the BACK END card types its five questions one
 * by one. Then a green audio bar runs into the back end, which becomes a box
 * with an X, and the audio piles up behind it: the bottleneck.
 */
export function Play() {
  const t = useClock();
  const tocas = useCue("tocas");
  const questions = [
    { at: useCue("quién"), text: "¿quién eres?" },
    { at: useCue("Premium"), text: "¿tienes premium?" },
    { at: useCue("pediste"), text: "¿qué canción pediste?" },
    { at: useCue("país"), text: "¿se puede en tu país?" },
    { at: useCue("quedaste"), text: "¿dónde te quedaste?" },
  ];
  const pero = useCue("Pero");
  const transmitir = useCue("transmitir");
  const cuello = useCue("cuello");
  const run = EASE.inOut(unit(t, transmitir - 0.3, 0.6));
  const pile = EASE.out(unit(t, cuello, 0.5));
  const away = useOn(pero - 0.1, 0.25);
  return (
    <Layer>
      <div style={{ opacity: 1 - away }}>
        <Card x={130} y={150} w={360} h={250} at={tocas + 0.3} title="BACK END">
          <div data-ui="" className="px-[14px] pt-[10px] font-mono text-[17px] leading-[1.75]" style={{ color: INK }}>
            {questions.map((q) => (t >= q.at - 0.1 ? <div key={q.text}><span style={{ color: G }}>•</span> {q.text.slice(0, Math.max(1, Math.floor((t - q.at + 0.1) / 0.03)))}</div> : null))}
          </div>
        </Card>
        <PlayButton x={86} y={448} size={52} at={0.05} />
        <Mono x={124} y={441} at={tocas} align="left" color={MUTED}>Tocas play</Mono>
      </div>
      <Title text="Primero, preguntas" at={useCue("pregunta")} until={pero - 0.1} />

      {t >= pero ? (
        <>
          <div className="absolute" style={{ left: 40, top: 262 - 40 * pile, width: 230 * Math.max(0.05, run), height: 36 + 80 * pile, background: G, borderRadius: 3, boxShadow: `0 0 20px ${G}66` }} />
          <div className="absolute" style={{ left: 380, top: 262, width: 124, height: 36, background: "#1A2620", borderRadius: 3 }} />
          <Mono x={320} y={200} at={pero}>Back end</Mono>
        </>
      ) : null}
      <XMark x={320} y={280} size={84} at={pero} box />
      <Title text="No transmite cada audio" at={transmitir} until={cuello - 0.1} />
      <Title text="Cuello de botella" at={cuello} />
    </Layer>
  );
}
