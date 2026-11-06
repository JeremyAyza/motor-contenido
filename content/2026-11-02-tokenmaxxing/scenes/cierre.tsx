import { Gesto } from "@motor/ui";
import { popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Cursor, Illustrative, Layer, Leaderboard, Title, type Player } from "../parts.tsx";
import { ACCENT, INK, TOKEN } from "../world.tsx";

/** A made-up team: by tokens, Leo leads; by work shipped, he is last. */
const TEAM: Player[] = [
  { name: "Leo", seed: 21, fichas: "92 M", entregado: "1", byFichas: 0, byEntregado: 4, color: TOKEN },
  { name: "Mia", seed: 8, fichas: "61 M", entregado: "3", byFichas: 1, byEntregado: 2, color: "#B98CFF" },
  { name: "Iván", seed: 15, fichas: "40 M", entregado: "2", byFichas: 2, byEntregado: 3, color: "#FFC857" },
  { name: "Sol", seed: 2, fichas: "18 M", entregado: "6", byFichas: 3, byEntregado: 0, color: ACCENT },
  { name: "Tomás", seed: 30, fichas: "7 M", entregado: "5", byFichas: 4, byEntregado: 1, color: "#6FB7FF" },
];

export function Cierre() {
  const t = useClock();
  const convertir = useCue("convertirlos");
  const util = useCue("útil");
  const manda = useCue("Mándaselo");
  const click = convertir - 0.25;
  const sort = unit(t, click + 0.1, 1.3);
  const sorted = t >= click;
  const tab = (name: string, on: boolean, color: string) => (
    <span className="rounded-lg font-mono font-bold uppercase" style={{ padding: "6px 12px", fontSize: 14, letterSpacing: "0.1em", background: on ? color : "transparent", color: on ? "#120E1F" : INK, border: `2px solid ${color}` }}>
      {name}
    </span>
  );
  const press = popAt(t, manda);
  return (
    <Layer>
      <Card at={0.05} y={176} h={412} label="Récords · equipo">
        <div className="absolute flex" style={{ right: 16, top: 10, gap: 8 }}>
          {tab("Fichas", !sorted, TOKEN)}
          {tab("Entregado", sorted, ACCENT)}
        </div>
        <div style={{ marginTop: 18 }}>
          <Leaderboard players={TEAM} sort={sort} rowH={64} highlight={t >= manda ? "Leo" : undefined} showEntregado />
        </div>
      </Card>
      <Cursor
        path={[
          [click - 0.9, 300, 420],
          [click - 0.1, 446, 204],
          [click + 0.9, 330, 610],
        ]}
        clicks={[click]}
      />
      <Title at={util - 0.1} y={604} size={40}>
        Tokens <span style={{ color: "var(--piece-muted)" }}>→</span> <span style={{ color: ACCENT }}>trabajo útil</span>
      </Title>
      {t >= manda ? (
        <div className="absolute flex items-center" style={{ left: 60, top: 664, gap: 18 }}>
          {/* A ripple every 0.9 s keeps the last frames alive while the voice ends. */}
          <div className="absolute rounded-full" style={{ left: 0, top: 0, width: 96, height: 96, border: `4px solid ${ACCENT}`, opacity: 0.8 * (1 - (((t - manda) / 0.9) % 1)), transform: `scale(${1 + 0.7 * (((t - manda) / 0.9) % 1)})` }} />
          <div className="flex items-center justify-center rounded-full" style={{ width: 96, height: 96, background: ACCENT, color: "#120E1F", transform: `scale(${Math.min(1, press) * (1 - 0.1 * Math.sin(Math.min(1, unit(t, manda + 0.5, 0.3)) * Math.PI))})` }}>
            <Gesto accion="enviar" size={52} lleno strokeWidth={2.4} />
          </div>
          <div data-ui="" className="font-mono font-bold uppercase" style={{ fontSize: 16, letterSpacing: "0.1em", color: INK, lineHeight: 1.35, opacity: Math.min(1, press) }}>
            Para el #1
            <br />
            <span style={{ color: TOKEN }}>en fichas</span> de tu equipo
          </div>
        </div>
      ) : null}
      <Illustrative at={0.3} y={772} />
    </Layer>
  );
}
