import { useClock, useCue } from "@motor/video";
import { Bar, Corners, Layer, Mono, Pic, SwapTitle, usePresence } from "../parts.tsx";
import { ACCENT, MUTED, RED } from "../world.tsx";

/** An untrained network's guesses for the test dog, every class near 10 %, as in the referent. */
const GUESS = [
  { label: "avión", value: 9.8 },
  { label: "auto", value: 10.6, wrong: true },
  { label: "pájaro", value: 9.4 },
  { label: "gato", value: 9.7 },
  { label: "ciervo", value: 10.3 },
  { label: "perro", value: 10.2 },
  { label: "rana", value: 10.2 },
  { label: "caballo", value: 9.7 },
  { label: "barco", value: 10.2 },
  { label: "camión", value: 10.2 },
];

/**
 * A student answering at random on the first day: the white dog, pixelated to
 * 32 × 32, and ten class bars that grow almost equal. On "auto" the car bar
 * shoots ahead in red: the wrong guess.
 */
export function Aprender() {
  const t = useClock();
  const azar = useCue("azar");
  const auto = useCue("auto");
  const img = usePresence(Math.min(azar - 0.6, 0.2));
  const jitter = (i: number) => (t < auto ? Math.sin(t * 9 + i * 1.7) * 1.2 : 0);
  return (
    <Layer>
      <SwapTitle at={auto} a="La red los aprende" b={<>Adivina: <span style={{ color: RED }}>auto</span></>} y={124} size={32} />
      <div className="absolute" style={{ left: 36, top: 190, width: 200, height: 200, opacity: img.o, transform: `scale(${0.9 + 0.1 * Math.min(1, img.p)})` }}>
        <div className="absolute inset-0 overflow-hidden rounded-[3px]">
          <Pic src="img/perro-blanco-32.png" style={{ imageRendering: "pixelated" }} />
        </div>
        <Corners w={200} h={200} />
        <Mono x={0} y={210} size={12} width={200}>
          imagen de prueba · 32 × 32
        </Mono>
        <Mono x={0} y={228} size={14} color={ACCENT}>
          es: perro
        </Mono>
      </div>
      {GUESS.map((g, i) => {
        const value = g.wrong ? g.value : g.value + jitter(i);
        return <Bar key={g.label} x={252} y={186 + i * 32} w={252} label={g.label} value={value} at={azar + i * 0.05} size={14} color={g.wrong && t > auto ? RED : MUTED} strong={g.wrong && t > auto} />;
      })}
      <Mono x={252} y={516} at={azar + 0.6} size={13} width={252}>
        red al azar: cada clase cerca del 10 %
      </Mono>
    </Layer>
  );
}
