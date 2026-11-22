import { EASE, lerp, unit, useClock, useCue } from "@motor/video";
import { Chip, Count, Crate, Example, Layer, PanelBody, Small, Worker } from "../parts.tsx";
import { GO, INK, LINE, MUTED, YELLOW } from "../world.tsx";

const COLS = 8;
const ROWS = 5;
const CELL = 46;
const GX = 62;
const GY = 150;
/** Which crates are garbage, and in which round they become it. */
const DEAD = new Set([3, 6, 9, 12, 14, 19, 21, 24, 27, 30, 33, 36, 38]);
const SWEEPERS = [0, 1, 2];

/**
 * The garbage collector: the band becomes a depot of memory crates. On "ya
 * no necesita" some are crossed out (order #42 among them); on "recolector"
 * three sweepers cross the depot and the crossed crates go as they pass,
 * while the panel's heap draws its saw and counts the sweeps. On "memoria
 * extra" a yellow striped strip takes the depot's right edge, and on
 * "pausas" everything stops for a beat.
 */
export function Recolector() {
  const t = useClock();
  const necesita = useCue("necesita.");
  const recolector = useCue("recolector");
  const barre = useCue("barre");
  const extra = useCue("extra");
  const pausas = useCue("pausas");
  // During the pause the sweepers freeze.
  const pause = t >= pausas && t < pausas + 0.7;
  const tt = pause ? pausas : t >= pausas + 0.7 ? t - 0.7 : t;
  const sweepStart = barre - 0.2;
  const heapPoints: string[] = [];
  const graphOn = EASE.out(unit(t, 0, 0.3));
  for (let i = 0; i <= 60; i++) {
    const x = (i / 60) * 250;
    const s = Math.max(0, (tt - 0.2) / 13);
    if (i / 60 > s) break;
    const saw = tt > recolector ? ((i * 7) % 15) / 15 : i / 60;
    heapPoints.push(`${x},${70 - saw * 52}`);
  }
  return (
    <Layer>
      {Array.from({ length: COLS * ROWS }).map((_, i) => {
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        const x = GX + c * CELL;
        const y = GY + r * CELL;
        const born = EASE.out(unit(t, 0.05 * i, 0.2));
        const dead = DEAD.has(i) ? EASE.out(unit(t, necesita - 0.3 + (i % 5) * 0.08, 0.25)) : 0;
        // A sweeper passes this column at a time that depends on the column.
        const sweptAt = sweepStart + 0.25 * c + 0.4 * (r % 2);
        const swept = DEAD.has(i) ? EASE.out(unit(tt, sweptAt, 0.25)) : 0;
        // After the sweep, a few crates turn into garbage again: memory keeps piling up.
        const again = DEAD.has(i) && i % 3 === 0 ? EASE.out(unit(t, extra - 1.2 + c * 0.05, 0.3)) : 0;
        const opacity = born * Math.max(1 - swept, again);
        return <Crate key={i} x={x} y={y} size={30} opacity={opacity} crossed={again > 0 ? again : dead} label={i === 14 && t >= necesita && t < recolector ? "pedido #42: ya no sirve" : undefined} />;
      })}
      {SWEEPERS.map((k) => {
        const p = unit(tt, sweepStart + k * 0.3, 2.4);
        if (p <= 0 || p >= 1) return null;
        const x = lerp(GX - 20, GX + COLS * CELL + 10, EASE.inOut(p));
        const y = GY + 30 + k * 92;
        return <Worker key={k} x={x} y={y + 26} s={1.1} color={YELLOW} />;
      })}
      <Chip x={270} y={118} at={recolector} color={YELLOW}>el equipo: recolector de basura</Chip>
      {t >= extra - 0.1 ? (
        <div className="absolute" style={{ left: 446, top: 132, width: 58, height: 360, opacity: EASE.out(unit(t, extra - 0.1, 0.35)), background: `repeating-linear-gradient(45deg, ${YELLOW}AA 0 8px, rgba(0,0,0,0.25) 8px 16px)`, border: `2px solid ${YELLOW}` }} />
      ) : null}
      <Chip x={420} y={470} at={extra} color={YELLOW}>memoria extra</Chip>
      <Chip x={150} y={470} at={pausas} until={pausas + 1.1} color={INK}>pausa</Chip>
      <PanelBody at={0}>
        <div className="font-mono text-[12px]" style={{ color: MUTED }}>Go, mismo trabajo</div>
        <svg width={260} height={80} className="mt-[6px]" aria-hidden style={{ opacity: graphOn }}>
          <line x1={0} y1={70} x2={260} y2={70} stroke={LINE} />
          <polyline points={heapPoints.join(" ")} fill="none" stroke={GO} strokeWidth={2} />
        </svg>
        <div className="mt-[12px] flex items-baseline justify-between" style={{ opacity: EASE.out(unit(t, barre, 0.3)) }}>
          <span className="font-mono text-[12px]" style={{ color: MUTED }}>barridos en 4 s</span>
          <Count from={0} to={3611} at={barre} dur={5} size={40} color={INK} />
        </div>
        <div className="mt-[8px] flex justify-between font-mono text-[13px]" style={{ opacity: EASE.out(unit(t, extra, 0.3)) }}>
          <span style={{ color: MUTED }}>memoria del proceso</span>
          <span style={{ color: YELLOW }}>33,2 MB</span>
        </div>
      </PanelBody>
      <Example x={216} y={772} at={barre} />
    </Layer>
  );
}
