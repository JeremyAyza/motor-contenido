import { Icono } from "@motor/ui";
import { EASE, fade, unit, useClock, useCue } from "@motor/video";
import { Layer, Plate, Sticker } from "../parts.tsx";

/** Point 2: a tangle of code that the scissors cut down to one clean line. */
export function Lineas() {
  const t = useClock();
  const grow = EASE.out(unit(t, useCue("líneas"), 1.1));
  const cut = useCue("simplificar");
  const snip = EASE.inOut(unit(t, cut - 0.35, 0.6));
  const gone = fade(t, cut + 0.15, 0.3);
  const tangle = "M 20 80 C 80 10 120 150 170 60 S 260 10 230 100 S 120 140 200 40 S 330 30 300 115 S 380 150 420 45 S 300 20 360 80 S 440 110 440 75";
  return (
    <Layer>
      <Plate at={0.1} n={2}>Medir líneas ≠ valor</Plate>
      <svg className="absolute overflow-visible" width={460} height={150} viewBox="0 0 460 150" style={{ left: 40, top: 176 }} aria-hidden>
        <path d={tangle} fill="none" stroke="var(--piece-ink)" strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - grow} opacity={1 - gone} />
        <path d="M 20 80 L 440 80" fill="none" stroke="var(--piece-accent)" strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - fade(t, cut + 0.1, 0.5)} />
      </svg>
      {t > cut - 0.4 && t < cut + 0.6 ? (
        <div className="absolute" style={{ left: 30 + snip * 400, top: 222, transform: `rotate(${Math.sin(t * 30) * 12 - 90}deg)` }}>
          <Icono name="scissors" size={64} strokeWidth={2.5} ancla={false} />
        </div>
      ) : null}
      <Sticker at={cut + 0.3} x={270} y={300} rotate={2} className="flex items-center gap-2 whitespace-nowrap text-[34px]">
        <Icono name="scissors" size={34} strokeWidth={2.4} ancla={false} />
        simplificar
      </Sticker>
    </Layer>
  );
}
