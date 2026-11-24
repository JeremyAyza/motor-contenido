import { EASE, bump, popAt, unit, useClock, useCue } from "@motor/video";
import type { BackProps } from "../palette.ts";
import { Backdrop, Card, Chip, Layer, YearTag, poster } from "../parts.tsx";

/** The whole island from the air, pulling back from the city to the coast; with "cambia" it goes dark. */
export function D2013Back({ t, cue }: BackProps) {
  const dark = EASE.inOut(unit(t, cue("cambia") - 0.3, 0.5));
  return (
    <>
      <Backdrop src="img/isla.png" t={t} at={-1} dur={9} z0={1.35} z1={1.02} y0={60} y1={0} />
      <div className="absolute inset-0" style={{ background: "#0E0F12", opacity: 0.68 * dark }} />
    </>
  );
}

/** "Tierra", "mar" and "cielo" land as chips; the best-seller card follows; with "cambia" a question mark beats. */
export function D2013() {
  const t = useClock();
  const tierra = useCue("tierra");
  const mar = useCue("mar");
  const cielo = useCue("cielo");
  const vendidos = useCue("vendidos");
  const cambia = useCue("cambia");
  const q = popAt(t, cambia);
  return (
    <Layer>
      <YearTag year="2013" name="Grand Theft Auto V" at={-0.05} until={cambia - 0.3} />
      <Chip at={tierra} until={cambia - 0.3} x={36} y={196} tone="light">
        Tierra
      </Chip>
      <Chip at={mar} until={cambia - 0.3} x={176} y={196} tone="light">
        Mar
      </Chip>
      <Chip at={cielo} until={cambia - 0.3} x={286} y={196} tone="light">
        Cielo
      </Chip>
      <Card at={vendidos - 0.4} until={cambia - 0.3} x={36} y={600} w={340} title="Uno de los más vendidos de la historia" />
      {q > 0 ? (
        <div className="absolute text-center" style={{ left: 36, top: 330, width: 468, opacity: Math.min(1, q * 2), transform: `scale(${(0.6 + 0.4 * Math.min(1.05, q)) * (1 + 0.05 * bump(t % 0.8, 0, 0.8))})` }}>
          <div style={poster(300)}>?</div>
        </div>
      ) : null}
    </Layer>
  );
}
