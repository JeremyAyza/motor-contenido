import { EASE, keys, span, unit, useClock, useCue } from "@motor/video";
import { City, blockCenter } from "../map.tsx";
import type { BackProps } from "../palette.ts";
import { Chip, Layer, YearTag } from "../parts.tsx";

/**
 * 1997: the city as the first game drew it, a flat tile map seen from the sky
 * with the traffic running. With "cuadrícula" the tile grid lights up over it,
 * row by row; with "techos" the camera drops onto the pink roof, the hotel of
 * the whole video.
 */
export function D1997Back({ t, cue }: BackProps) {
  const grid = cue("cuadrícula");
  const techos = cue("techos");
  const hotel = blockCenter(4);
  const cam = {
    x: keys(t, [[0, 300], [techos - 0.4, 300], [techos + 0.7, hotel.x]]),
    y: keys(t, [[0, 360], [techos - 0.4, 340], [techos + 0.7, hotel.y]]),
    z: keys(t, [[0, 0.92], [techos - 0.4, 1.0], [techos + 0.7, 2.5]]) + 0.004 * t,
  };
  const gridOn = span(t, grid, techos - 0.4, 0.3);
  return (
    <>
      <City t={t + 3} cam={cam} cy={470} />
      {gridOn > 0 ? (
        <div className="absolute left-0 overflow-hidden" style={{ top: 90, width: 540, height: 700, opacity: gridOn }}>
          {Array.from({ length: 12 }, (_, r) => (
            <div key={r} className="absolute left-0 w-full" style={{ top: r * 60, height: 60, opacity: EASE.out(unit(t, grid + r * 0.05, 0.2)), backgroundImage: "linear-gradient(90deg, rgba(255,248,242,0.6) 2px, transparent 2px)", backgroundSize: "60px 60px", borderTop: "2px solid rgba(255,248,242,0.6)" }} />
          ))}
        </div>
      ) : null}
    </>
  );
}

/** The year, the studio, the fixed camera and "solo techos", over the map. */
export function D1997() {
  const dma = useCue("DMA");
  const camara = useCue("cámara");
  const techos = useCue("techos");
  return (
    <Layer>
      <YearTag year="1997" name="Grand Theft Auto" at={-0.05} />
      <Chip at={dma} until={camara - 0.1} x={36} y={188}>
        DMA Design
      </Chip>
      <Chip at={camara} until={techos - 0.1} x={36} y={188} tone="amber">
        Cámara fija ↓
      </Chip>
      <Chip at={techos + 0.5} x={36} y={188} tone="light">
        Solo techos
      </Chip>
    </Layer>
  );
}
