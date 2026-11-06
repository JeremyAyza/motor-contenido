import { fade, popAt, useClock, useCue } from "@motor/video";
import { Bar, Card, Coin, Hi, Hud, Layer, Title } from "../parts.tsx";
import { ACCENT, TOKEN } from "../world.tsx";

/** The question of the video: more AI, more work? Then INSERT COIN sends the counter back to 0. */
export function Pregunta() {
  const t = useClock();
  const gastar = useCue("gastar");
  const cero = useCue("cero");
  const blink = Math.floor(t * 5) % 2 === 0 ? 1 : 0.3;
  return (
    <Layer>
      <Title at={0.05} until={gastar - 0.1} y={200} size={50}>
        ¿Qué es el <Hi>tokenmaxxing</Hi>?
      </Title>
      {t < gastar ? (
        // A giant token spins under the question until the second one comes in.
        <div className="absolute" style={{ left: 150, top: 360, width: 240, height: 240, opacity: 1 - fade(t, gastar - 0.35, 0.25), transform: `scaleX(${0.25 + 0.75 * Math.abs(Math.cos(t * 2.2))}) scale(${Math.min(1, popAt(t, 0.1))})` }}>
          <Coin size={240} />
          <div className="absolute inset-0 flex items-center justify-center font-display font-black" style={{ fontSize: 120, color: "#120E1F" }}>
            ?
          </div>
        </div>
      ) : null}
      <Title at={gastar} y={200} size={54}>
        ¿Más <Hi>IA</Hi> = más <Hi tone="accent">trabajo</Hi>?
      </Title>
      <Card at={gastar + 0.15} y={360} h={250} label="Jugador 1">
        <div className="flex flex-col" style={{ gap: 26, marginTop: 8 }}>
          <Bar at={gastar + 0.4} dur={1.1} value={0.96} label="IA usada" color={TOKEN} />
          <Bar at={gastar + 0.4} value={0} label="Trabajo hecho" color={ACCENT} tremble />
        </div>
      </Card>
      {t >= cero ? (
        <Hud at={cero} x={36} y={650} color={ACCENT}>
          <span style={{ opacity: blink, fontSize: 22 }}>▶ Insert coin · reset</span>
        </Hud>
      ) : null}
    </Layer>
  );
}
