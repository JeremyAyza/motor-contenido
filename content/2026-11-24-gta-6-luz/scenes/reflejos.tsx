import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { INK, type BackProps } from "../palette.ts";
import { Backdrop, Chip, Layer } from "../parts.tsx";

/**
 * Sunglasses on a café table with the street in their lenses, and a glint
 * that crosses them with "lentes". With "agua", a speedboat cutting the
 * turquoise sea from above.
 */
export function ReflejosBack({ t, cue }: BackProps) {
  const agua = cue("agua");
  const glint = unit(t, cue("lentes") + 0.1, 0.8);
  return (
    <>
      <Backdrop src="img/lentes.png" t={t} at={-1} until={agua - 0.1} dur={12} z0={1.04} z1={1.12} />
      {glint > 0 && glint < 1 && t < agua ? (
        <div className="absolute left-0 top-0 overflow-hidden" style={{ width: 540, height: 960, mixBlendMode: "screen" }}>
          <div className="absolute" style={{ left: -200 + 900 * EASE.inOut(glint), top: 200, width: 70, height: 700, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.75), rgba(255,255,255,0))", transform: "rotate(22deg)", filter: "blur(4px)" }} />
        </div>
      ) : null}
      <Backdrop src="img/lancha.png" t={t} at={agua - 0.1} dur={9} z0={1.2} z1={1.2} y0={40} y1={-60} />
    </>
  );
}

/** The list of traced reflections, item by item; then a depth ruler that goes from clear to deep. */
export function Reflejos() {
  const t = useClock();
  const parabrisas = useCue("parabrisas");
  const torres = useCue("torres");
  const lentes = useCue("lentes");
  const agua = useCue("agua");
  const claridad = useCue("claridad");
  const profundidad = useCue("profundidad");
  const ruler = popAt(t, claridad - 0.2);
  const deep = EASE.inOut(unit(t, claridad, profundidad - claridad + 0.4));
  return (
    <Layer>
      <Chip at={parabrisas} until={agua - 0.1} x={36} y={120} tone="light">
        Parabrisas
      </Chip>
      <Chip at={torres} until={agua - 0.1} x={36} y={172} tone="light">
        Torres de vidrio
      </Chip>
      <Chip at={lentes} until={agua - 0.1} x={36} y={224} tone="accent">
        Lentes de sol
      </Chip>
      <Chip at={agua + 0.2} x={36} y={120} tone="light">
        El agua se abre
      </Chip>
      {ruler > 0 ? (
        <div className="absolute" style={{ left: 438, top: 200, width: 66, height: 520, opacity: Math.min(1, ruler * 2) }}>
          <div className="absolute rounded-full" style={{ left: 22, top: 0, width: 22, height: 520, background: "linear-gradient(180deg, #8FF0E4 0%, #1E8C8C 50%, #0B2A4A 100%)", border: "2px solid rgba(255,255,255,0.8)" }} />
          <div className="absolute rounded-full" style={{ left: 14, top: 10 + 480 * deep, width: 38, height: 38, background: INK, boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }} />
        </div>
      ) : null}
      <Chip at={claridad} x={300} y={190} tone="light">
        Clara
      </Chip>
      <Chip at={profundidad} x={260} y={690} tone="dark">
        Profunda
      </Chip>
    </Layer>
  );
}
