import { EASE, keys, lerp, unit, useClock, useCue } from "@motor/video";
import { City, blockCenter } from "../map.tsx";
import { ACCENT, INK, type BackProps } from "../palette.ts";
import { Chip, Layer, YearTag } from "../parts.tsx";

/**
 * 2001: the same map tilts to isometric and its roofs rise into buildings
 * ("calle"); with "3D" the streets give way to a neon grid, and with "partes"
 * the mint car drives across while only the blocks near it are built: the ones
 * it leaves behind fold away.
 */
export function D2001Back({ t, cue }: BackProps) {
  const calle = cue("calle");
  const tresD = cue("3D");
  const partes = cue("partes");
  const memoria = cue("memoria");
  const tilt = EASE.inOut(unit(t, calle - 0.5, 1.1));
  const grow = EASE.out(unit(t, calle + 0.2, 1.0));
  const ground = 1 - EASE.inOut(unit(t, tresD - 0.2, 0.7));
  const drive = unit(t, partes - 1.2, memoria + 1.6 - (partes - 1.2));
  const car = { x: lerp(-60, 660, drive), y: 389.5 + 8 };
  const streaming = unit(t, partes - 1.3, 0.3);
  const blocks = (i: number) => {
    if (streaming <= 0) return { o: 1, g: grow };
    const d = Math.abs(blockCenter(i).x - car.x);
    const near = 1 - EASE.inOut(unit(d, 150, 110));
    const o = lerp(1, near, streaming);
    return { o, g: grow * o };
  };
  const cam = { x: 300, y: keys(t, [[0, 360], [calle + 0.6, 330]]), z: keys(t, [[0, 0.92], [calle + 0.6, 0.86]]) + 0.004 * t };
  return <City t={t + 14} tilt={tilt} grow={grow} ground={ground} blocks={blocks} cam={cam} cy={490} car={streaming > 0 ? car : undefined} />;
}

/** The year, what changes in three chips, and a memory bar that never fills. */
export function D2001() {
  const t = useClock();
  const calle = useCue("calle");
  const tresD = useCue("3D");
  const partes = useCue("partes");
  const memoria = useCue("memoria");
  const mem = EASE.out(unit(t, memoria, 0.4));
  const fill = 0.32 + 0.04 * Math.sin(t * 3);
  return (
    <Layer>
      <YearTag year="2001" name="Grand Theft Auto III" at={-0.05} />
      <Chip at={calle + 0.1} until={tresD - 0.1} x={36} y={188} tone="light">
        Cámara a la calle
      </Chip>
      <Chip at={tresD} until={partes - 0.2} x={36} y={188} tone="amber">
        Mundo 3D
      </Chip>
      <Chip at={partes} x={36} y={188} tone="accent">
        Carga por partes
      </Chip>
      {mem > 0 ? (
        <div data-ui="" className="absolute rounded-[10px]" style={{ left: 36, top: 250, width: 230, padding: "10px 12px", background: "rgba(12,16,21,0.86)", border: "1px solid rgba(64,214,200,0.5)", opacity: mem, transform: `translateY(${(1 - mem) * 12}px)` }}>
          <div className="flex font-mono font-bold uppercase" style={{ fontSize: 14, color: INK }}>
            <span>Memoria</span>
            <span className="ml-auto" style={{ color: ACCENT }}>{Math.round(fill * 100)} %</span>
          </div>
          <div className="mt-[8px] overflow-hidden rounded-[4px]" style={{ height: 10, background: "rgba(255,255,255,0.1)" }}>
            <div style={{ width: `${fill * 100}%`, height: "100%", background: "#40D6C8" }} />
          </div>
        </div>
      ) : null}
    </Layer>
  );
}
