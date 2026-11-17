import { EASE, keys, popAt, unit, useClock, useCue } from "@motor/video";
import pixels from "../pixels.json";
import { Big, Layer, Mono, SwapTitle } from "../parts.tsx";
import { ACCENT, INK, LINE, MUTED, PANEL, YELLOW } from "../world.tsx";

const GRID: number[][] = pixels.street.grid;
const SOBEL = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
const CELL = 30;
const GX = 36;
const GY = 190;

/** The window's stops: it walks the top rows, then lands on the edge (col 5, row 4) where the result is high. */
const STOPS: [number, number][] = [[1, 1], [2, 1], [3, 1], [4, 1], [6, 1], [7, 1], [8, 1], [1, 4], [2, 4], [3, 4], [5, 4]];

function under(col: number, row: number): number[] {
  const v: number[] = [];
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) v.push(GRID[row + j][col + i]);
  return v;
}

const sign = (k: number) => (k > 0 ? `+${k}` : k === 0 ? "0" : `−${-k}`);

/**
 * A magnifier with a template that walks the photo: a real 10 × 8 gray crop of
 * the street (pixels.json), the Sobel filter next to it and the nine pixels
 * under the window. The window hops cell by cell rewriting the sum, and on
 * "borde vertical" it stops where dark turns bright and the result lands big.
 */
export function Filtro() {
  const t = useClock();
  const desliza = useCue("desliza");
  const borde = useCue("borde");
  const alto = useCue("alto");
  const hop = Math.max(0.22, (borde - desliza - 0.4) / (STOPS.length - 1));
  const i = Math.max(0, Math.min(STOPS.length - 1, Math.floor((t - desliza) / hop)));
  const [col, row] = t < borde ? STOPS[Math.min(i, STOPS.length - 2)] : STOPS[STOPS.length - 1];
  const vals = under(col, row);
  const sum = vals.reduce((a, v, k) => a + v * SOBEL[k], 0);
  const wx = keys(t, [[0, GX + (col - 1) * CELL]]);
  const land = EASE.out(unit(t, borde, 0.2));
  const win = popAt(t, desliza);
  return (
    <Layer>
      <SwapTitle at={borde} a="Multiplica y suma" b="Un borde vertical" y={124} size={32} />
      <div className="absolute grid grid-cols-10" style={{ left: GX, top: GY, width: CELL * 10, border: `1px solid ${LINE}` }}>
        {GRID.flat().map((v, k) => (
          <div key={k} data-ui="" className="flex items-center justify-center font-mono text-[12px]" style={{ width: CELL, height: CELL, background: `rgb(${v},${v},${v})`, color: v > 120 ? "#111" : "#EEE" }}>
            {v}
          </div>
        ))}
      </div>
      {win > 0 ? (
        <div className="absolute" style={{ left: wx - 2, top: GY + (row - 1) * CELL - 2, width: CELL * 3 + 4, height: CELL * 3 + 4, border: `3px solid ${t > borde ? YELLOW : ACCENT}`, borderRadius: 3, opacity: Math.min(1, win * 2), boxShadow: `0 0 14px ${t > borde ? YELLOW : ACCENT}88` }} />
      ) : null}

      <Mono x={352} y={186} size={12}>FILTRO</Mono>
      <div className="absolute grid grid-cols-3 gap-[3px]" style={{ left: 352, top: 204 }}>
        {SOBEL.map((k, n) => (
          <div key={n} data-ui="" className="flex items-center justify-center rounded-[3px] font-mono text-[15px] font-bold" style={{ width: 46, height: 32, background: PANEL, border: `1px solid ${ACCENT}66`, color: INK }}>
            {sign(k)}
          </div>
        ))}
      </div>
      <Mono x={352} y={320} size={12} at={desliza}>PÍXELES DEBAJO</Mono>
      <div className="absolute grid grid-cols-3 gap-[3px]" style={{ left: 352, top: 338, opacity: EASE.out(unit(t, desliza, 0.2)) }}>
        {vals.map((v, n) => (
          <div key={n} data-ui="" className="flex items-center justify-center rounded-[3px] font-mono text-[15px]" style={{ width: 46, height: 32, background: `rgb(${v},${v},${v})`, color: v > 120 ? "#111" : "#EEE" }}>
            {v}
          </div>
        ))}
      </div>

      <div data-ui="" className="absolute font-mono text-[13px] leading-[20px]" style={{ left: GX, top: 452, width: 468, color: MUTED, opacity: EASE.out(unit(t, desliza + 0.2, 0.2)) }}>
        {[0, 1, 2].map((r) => (
          <div key={r}>
            {[0, 1, 2].map((c) => `(${sign(SOBEL[r * 3 + c])})×${vals[r * 3 + c]}`).join(" + ")}
            {r < 2 ? " +" : ""}
          </div>
        ))}
      </div>
      {t < borde ? (
        <div data-ui="" className="absolute font-mono text-[26px] font-bold" style={{ left: GX, top: 520, color: INK, opacity: EASE.out(unit(t, desliza + 0.2, 0.2)) }}>
          = {sum}
        </div>
      ) : null}
      <Big x={GX} y={516} w={300} at={alto - 0.2} size={58} align="left">
        = {sum}
      </Big>
      <Mono x={250} y={600} at={alto} size={13} color={YELLOW} width={254}>
        oscuro → claro: resultado alto
      </Mono>
      <Mono x={250} y={624} at={desliza} size={12} width={254}>
        calle.jpg · recorte real · gris
      </Mono>
      {land > 0 ? null : null}
    </Layer>
  );
}
