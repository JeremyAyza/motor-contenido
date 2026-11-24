import { EASE, lerp, unit, useClock, useCue } from "@motor/video";
import { LIGHT, type BackProps } from "../palette.ts";
import { Backdrop, Chip, Layer, Word } from "../parts.tsx";

/** The three hidden lamps, and the point of the wall each one fakes. */
export const LAMPS = [
  { x: 445, y: 255, to: { x: 190, y: 330 } },
  { x: 470, y: 440, to: { x: 215, y: 470 } },
  { x: 300, y: 690, to: { x: 195, y: 610 } },
];

/** A hidden lamp: a dashed circle with a bulb, and its dashed arrow to the wall. */
export function Lamp({ x, y, to, k, off = 0 }: { x: number; y: number; to: { x: number; y: number }; k: number; off?: number }) {
  if (k <= 0) return null;
  const a = Math.atan2(to.y - y, to.x - x);
  const len = Math.hypot(to.x - x, to.y - y) - 30;
  const on = 1 - off;
  return (
    <svg className="absolute left-0 top-0" width={540} height={960} style={{ overflow: "visible", opacity: k }}>
      <circle cx={x} cy={y} r={26} fill={`rgba(255,230,168,${0.22 * on})`} stroke={LIGHT} strokeWidth={3} strokeDasharray="7 6" opacity={0.4 + 0.6 * on} />
      <circle cx={x} cy={y} r={8} fill={on > 0.5 ? LIGHT : "#666"} />
      <line x1={x + Math.cos(a) * 30} y1={y + Math.sin(a) * 30} x2={x + Math.cos(a) * (30 + len * k)} y2={y + Math.sin(a) * (30 + len * k)} stroke={LIGHT} strokeWidth={3} strokeDasharray="8 7" opacity={on} />
      <path d={`M ${to.x} ${to.y} l ${-Math.cos(a - 0.5) * 14} ${-Math.sin(a - 0.5) * 14} M ${to.x} ${to.y} l ${-Math.cos(a + 0.5) * 14} ${-Math.sin(a + 0.5) * 14}`} stroke={LIGHT} strokeWidth={3} fill="none" opacity={on * (k >= 1 ? 1 : 0)} />
    </svg>
  );
}

/** The pink street in full color; with "truco" the light goes flat, as most games fake it. */
export function TrucoBack({ t, cue }: BackProps) {
  const flat = EASE.inOut(unit(t, cue("truco") - 0.2, 0.6));
  return <Backdrop src="img/calle-rosa.png" t={t} at={-1} dur={20} z0={1.0} z1={1.03} filter={`saturate(${lerp(1.08, 0.5, flat)}) brightness(${lerp(1.04, 0.82, flat)}) contrast(${lerp(1.02, 0.92, flat)})`} />;
}

/**
 * "LUZ" over the street (the cover). With "pintan" a brush paints a shadow on
 * the wall; with "lámparas" three hidden lamps click on with dashed arrows
 * that fake the bounce off the wall.
 */
export function Truco() {
  const t = useClock();
  const pintan = useCue("pintan");
  const lamparas = useCue("lámparas");
  const brush = EASE.inOut(unit(t, pintan, 1.1));
  const strokes = "M 60 250 L 230 300 L 50 360 L 235 420 L 45 480 L 230 540 L 60 590";
  return (
    <Layer>
      <Word at={-0.05} x={36} y={112} size={150}>
        LUZ
      </Word>
      {brush > 0 ? (
        <svg className="absolute left-0 top-0" width={540} height={960}>
          <path d={strokes} fill="none" stroke="rgba(40,18,52,0.5)" strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - brush} />
        </svg>
      ) : null}
      <Chip at={pintan + 0.2} until={lamparas - 0.1} x={250} y={300} tone="light">
        Sombra pintada
      </Chip>
      {LAMPS.map((l, i) => (
        <Lamp key={i} {...l} k={EASE.out(unit(t, lamparas + i * 0.2, 0.4))} />
      ))}
      <Chip at={lamparas + 0.5} x={36} y={740} tone="amber">
        Lámparas ocultas
      </Chip>
    </Layer>
  );
}
