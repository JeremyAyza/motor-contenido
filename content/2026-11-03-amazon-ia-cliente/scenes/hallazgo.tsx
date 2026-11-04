import { Icono } from "@motor/ui";
import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Layer, Plate, Stamp } from "../parts.tsx";

/** Point 3: a task card marked as a failure flips over to its other face, a finding. */
export function Hallazgo() {
  const t = useClock();
  const shown = useCue("tarea");
  const enter = popAt(t, shown);
  const fail = useCue("fallaste");
  const flipAt = useCue("hallazgo");
  const flip = EASE.inOut(unit(t, flipAt - 0.15, 0.45));
  const back = flip > 0.5;
  return (
    <Layer>
      <Plate at={0.1} n={3}>Si no sirve</Plate>
      {t >= shown ? (
        <div className="absolute" style={{ left: 120, top: 200, width: 300, height: 200, opacity: Math.min(1, enter * 2), transform: `perspective(900px) rotateY(${flip * 180}deg) rotate(-3deg) scale(${0.6 + 0.4 * Math.min(1, enter)})` }}>
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border-[3px] border-ink ${back ? "bg-accent text-accent-ink" : "bg-white text-ink"}`}
            style={{ transform: back ? "rotateY(180deg)" : undefined }}
          >
            <Icono name={back ? "lightbulb" : "bot"} size={70} strokeWidth={2.2} ancla={false} />
            <span className="font-display text-[42px] font-extrabold uppercase leading-none">{back ? "Hallazgo" : "Tarea"}</span>
          </div>
        </div>
      ) : null}
      {t >= fail && flip < 0.3 ? (
        <Stamp at={fail} x={380} y={212} rotate={-10}>
          Fallo
        </Stamp>
      ) : null}
    </Layer>
  );
}
