import { EASE, es, unit, useClock, useCue } from "@motor/video";
import { FilterTile } from "../filters.tsx";
import { Ilustrativo, Layer, Mono, Title } from "../parts.tsx";
import { ACCENT, LINE, MUTED, PANEL } from "../world.tsx";

/** The referent's training run: step 2.822, 361.264 images, the error from 2,11 down to 0,15. */
const STEPS = 2822;
const IMAGES = 361264;

/**
 * Noise that combs itself into patterns: 64 filters start as colored static
 * and, while the step counter runs, settle zone by zone into edges, stripes
 * and blobs. Under them, the error curve draws itself going down.
 */
export function Entrenar() {
  const t = useClock();
  const medimos = useCue("medimos");
  const millones = useCue("millones");
  const solos = useCue("solos");
  const run = EASE.inOut(unit(t, medimos + 0.3, solos - medimos + 0.2));
  const curve = Array.from({ length: 40 }, (_, i) => {
    const x = i / 39;
    const loss = 0.15 + 1.96 * Math.exp(-4.2 * x) + 0.05 * Math.sin(i * 2.3) * (1 - x);
    return [x * 252, 92 - (loss / 2.11) * 84] as const;
  });
  const drawn = Math.max(1, Math.round(curve.length * run));
  return (
    <Layer>
      <Title y={124} size={30}>Millones de veces</Title>
      <div className="absolute grid grid-cols-8 gap-[5px] rounded-[6px] p-[8px]" style={{ left: 196, top: 176, background: PANEL, border: `1px solid ${LINE}` }}>
        {Array.from({ length: 64 }, (_, i) => {
          const zone = ((i % 8) + Math.floor(i / 8)) / 14;
          const k = EASE.inOut(Math.min(1, Math.max(0, (run - zone * 0.55) / 0.45)));
          const flicker = run < 1 && k < 1 ? Math.floor(t * 12) : 0;
          return <FilterTile key={i} i={i + flicker * 100 * (1 - k > 0.5 ? 1 : 0)} trained={k} size={33} />;
        })}
      </div>
      <Mono x={196} y={500} at={medimos} size={14} color={ACCENT}>
        paso {es(Math.round(STEPS * run))}
      </Mono>
      <Mono x={320} y={500} at={medimos} size={14} color={MUTED} width={184} align="right">
        {es(Math.round(IMAGES * run))} imágenes
      </Mono>
      <div className="absolute" style={{ left: 252, top: 560, width: 252, height: 100 }}>
        <svg width={252} height={100} className="absolute inset-0">
          <line x1={0} y1={96} x2={252} y2={96} stroke={LINE} />
          <polyline points={curve.slice(0, drawn).map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke={ACCENT} strokeWidth={3} strokeLinejoin="round" />
        </svg>
      </div>
      <Mono x={252} y={666} at={millones} size={13} width={252}>
        error: de 2,11 a 0,15
      </Mono>
      <Ilustrativo x={252} y={690} at={medimos} />
    </Layer>
  );
}
