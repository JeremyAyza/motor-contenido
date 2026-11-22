import { EASE, lerp, popAt, unit, useClock, useCue } from "@motor/video";
import { BigWord, Chip, Count, Layer, LangMark, PanelBody, Small, Worker } from "../parts.tsx";
import { GO, INK, LINE, MUTED, RED, SURFACE } from "../world.tsx";

/** One request: a little card "GET /orders/n". */
function Request({ x, y, n, opacity, rot }: { x: number; y: number; n: number; opacity: number; rot: number }) {
  if (opacity <= 0) return null;
  return (
    <div data-ui="" className="absolute whitespace-nowrap rounded-[3px] px-[5px] py-[2px] font-mono text-[12px] font-bold" style={{ left: x, top: y, opacity, transform: `translate(-50%, -50%) rotate(${rot}deg)`, background: "#EDE8DC", color: "#2A2D31", boxShadow: "0 3px 0 rgba(10,11,13,0.5)" }}>
      GET /orders/{n}
    </div>
  );
}

const SLOT_X = [262, 322, 382, 442];
const SLOT_Y = 236;

/**
 * Threads: requests rain on the band, six at once. "HILOS" lands and a row
 * of empty slots waits; each worker the system hires takes a slot with its
 * 8 MB, and the panel counts the memory up as a second one is hired.
 */
export function Hilos() {
  const t = useClock();
  const vez = useCue("vez.");
  const hilos = useCue("hilos:");
  const trabajadores = useCue("trabajadores");
  const caro = useCue("caro,");
  const uno = useCue("uno");
  const escala = useCue("escala.");
  const queue = EASE.inOut(unit(t, hilos - 0.4, 0.6));
  const reqs = [0, 1, 2, 3, 4, 5].map((i) => {
    const p = popAt(t, 0.15 + i * 0.3);
    const fall = EASE.out(unit(t, 0.15 + i * 0.3, 0.5));
    const sx = 110 + (i % 3) * 140 + (i > 2 ? 40 : 0);
    const sy = 180 + Math.floor(i / 3) * 90;
    // Queued in two rows at the bottom of the band, staggered like a pile-up.
    const qx = i < 3 ? 100 + i * 112 : 156 + (i - 3) * 112;
    const qy = i < 3 ? 438 : 474;
    return { x: lerp(sx, qx, queue), y: lerp(sy - 40 + 40 * fall, qy, queue), o: Math.min(1, p * 2), rot: lerp(i % 2 ? 7 : -6, i % 2 ? 2 : -2, queue) };
  });
  const w1 = popAt(t, trabajadores);
  const w2 = popAt(t, uno - 0.2);
  return (
    <Layer>
      <LangMark lang="go" x={470} y={128} size={56} at={0} />
      {reqs.map((r, i) => (
        <Request key={i} x={r.x} y={r.y} n={40 + i} opacity={r.o} rot={r.rot} />
      ))}
      <BigWord text="Hilos" x={36} y={170} size={58} color={INK} at={hilos} />
      {SLOT_X.map((x, i) => (
        <div key={x} className="absolute rounded-[4px]" style={{ left: x - 26, top: SLOT_Y - 80, width: 52, height: 116, border: `2px dashed ${LINE}`, background: "rgba(22,24,27,0.35)", opacity: EASE.out(unit(t, hilos + 0.1 + i * 0.08, 0.3)) }} />
      ))}
      <Worker x={SLOT_X[0]} y={SLOT_Y + 26} s={1.5} color={GO} opacity={Math.min(1, w1 * 2)} label={w1 > 0.3 ? "8 MB" : undefined} />
      <Worker x={SLOT_X[1]} y={SLOT_Y + 26} s={1.5} color={GO} opacity={Math.min(1, w2 * 2)} label={w2 > 0.3 ? "8 MB" : undefined} />
      <Small x={SLOT_X[0]} y={SLOT_Y + 44} at={trabajadores + 0.3} center w={56} color={INK}>1 hilo</Small>
      <Chip x={410} y={420} at={escala} color={RED}>no escala</Chip>
      <PanelBody at={0} until={trabajadores - 0.45}>
        <div className="font-mono text-[12px] font-bold" style={{ color: MUTED }}>peticiones</div>
        <Count from={0} to={6} at={0.15} dur={1.8} size={92} color={INK} />
        <div className="font-mono text-[14px] font-bold" style={{ color: INK, opacity: t >= vez ? 1 : 0 }}>a la vez</div>
        <div className="mt-[8px] font-mono text-[12px]" style={{ color: GO, opacity: t >= vez ? 1 : 0 }}>el trabajo: atenderlas todas</div>
      </PanelBody>
      <PanelBody at={trabajadores}>
        <div className="font-mono text-[12px] font-bold" style={{ color: MUTED }}>memoria reservada por hilo</div>
        <div className="mt-[6px] flex items-baseline gap-[6px]">
          <Count from={8} to={t >= uno - 0.2 ? 16 : 8} at={uno - 0.2} dur={0.6} size={74} color={INK} />
          <span className="font-display text-[34px] font-black" style={{ color: INK }}>MB</span>
        </div>
        <div className="font-mono text-[13px]" style={{ color: MUTED }}>{t >= uno - 0.2 ? "2 trabajadores × 8 MB" : "1 trabajador × 8 MB"}</div>
        <div className="mt-[12px] flex gap-[3px]">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="block h-[12px] flex-1 rounded-[2px]" style={{ background: i < (t >= uno - 0.2 ? 2 : 1) ? GO : SURFACE, border: `1px solid ${LINE}` }} />
          ))}
        </div>
        <div className="mt-[8px] font-mono text-[12px]" style={{ color: t >= caro ? RED : MUTED }}>un trabajador por petición</div>
        <div className="mt-[4px] font-mono text-[12px]" style={{ color: MUTED }}>Linux, por defecto</div>
      </PanelBody>
    </Layer>
  );
}
