import { EASE, keys, popAt, unit, useClock, useCue } from "@motor/video";
import { LIGHT, type BackProps } from "../palette.ts";
import { Backdrop, Card, Chip, Layer, Pic } from "../parts.tsx";

/** GTA 5's island again, still: the magnifying glass is what moves. */
export function PruebaBack({ t }: BackProps) {
  return <Backdrop src="img/isla.png" t={t} at={-1} dur={9} z0={1.02} z1={1.12} y0={20} y1={-10} />;
}

/**
 * The card of GTA 5's 2025 PC version and its source. With "probablemente" a
 * magnifying glass sweeps the island and shows it lit warmer, with rays
 * inside; with "prueba" it stops and a violet chip says what it found: GTA 6.
 */
export function Prueba() {
  const t = useClock();
  const probablemente = useCue("probablemente");
  const prueba = useCue("prueba");
  const lens = popAt(t, probablemente - 0.2);
  const lx = keys(t, [[probablemente, 150], [prueba - 0.6, 380], [prueba, 280]]);
  const ly = keys(t, [[probablemente, 560], [prueba - 0.6, 470], [prueba, 520]]);
  const R = 120 * Math.min(1.05, lens);
  const rays = EASE.out(unit(t, prueba - 0.3, 0.6));
  return (
    <Layer>
      <Card at={-0.05} x={36} y={120} w={420} title="GTA V Enhanced, PC, 2025" note="Según Digital Foundry" />
      {lens > 0 ? (
        <>
          <div className="absolute overflow-hidden rounded-full" style={{ left: lx - R, top: ly - R, width: R * 2, height: R * 2, border: `6px solid ${LIGHT}`, boxShadow: "0 14px 40px rgba(0,0,0,0.5)" }}>
            <div className="absolute" style={{ left: -(lx - R) - 6, top: -(ly - R) - 6, width: 540, height: 960, transform: "scale(1.08)", filter: "saturate(1.5) contrast(1.15) brightness(1.08) sepia(0.18)" }}>
              <Pic src="img/isla.png" />
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} className="absolute" style={{ left: R * 2 * (0.15 + i * 0.28), top: -20, width: 10, height: R * 2 + 40, background: `linear-gradient(180deg, ${LIGHT}00, ${LIGHT}cc, ${LIGHT}00)`, transform: "rotate(28deg)", opacity: rays, filter: "blur(2px)" }} />
            ))}
          </div>
          <div className="absolute" style={{ left: lx + R * 0.62, top: ly + R * 0.62, width: 90, height: 18, background: LIGHT, borderRadius: 9, transform: "rotate(45deg)", transformOrigin: "left center" }} />
        </>
      ) : null}
      <Chip at={prueba} x={300} y={330} tone="accent">
        GTA 6
      </Chip>
    </Layer>
  );
}
