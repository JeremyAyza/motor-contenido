import { EASE, fade, lerp, popAt, unit, useClock, useCue } from "@motor/video";
import { FilterTile } from "../filters.tsx";
import { Ilustrativo, Layer, Mono } from "../parts.tsx";
import { ACCENT, INK, LINE, MUTED, PANEL, YELLOW } from "../world.tsx";

/** The blocks of the network, from the input to the output, narrowing like a funnel. */
const STACK = [
  { label: "ENTRADA", w: 96, h: 150, x: 36 },
  { label: "CONV1", w: 64, h: 126, x: 120 },
  { label: "CAPA 1", w: 54, h: 106, x: 180 },
  { label: "CAPA 2", w: 46, h: 90, x: 232 },
  { label: "CAPA 3", w: 40, h: 74, x: 276 },
  { label: "CAPA 4", w: 34, h: 60, x: 314 },
];

/** The Sobel filter that becomes the example: the grid of numbers the voice describes. */
const SOBEL = [-1, 0, 1, -2, 0, 2, -1, 0, 1];

/**
 * CNN, huge in the accent, and the funnel of its layers: a photo goes in, a
 * thousand scores come out. On "filtros" the funnel steps aside for a mosaic
 * of 36 small filters, and on "tres por tres" one of them grows into its grid.
 */
export function Cnn() {
  const t = useClock();
  const filtros = useCue("filtros");
  const tres = useCue("tres");
  const stackOut = fade(t, filtros - 0.15, 0.3);
  const mosaicOut = fade(t, tres - 0.1, 0.3);
  const grow = EASE.inOut(unit(t, tres - 0.05, 0.5));
  const cnn = popAt(t, 0.05);
  return (
    <Layer>
      <div className="absolute font-display font-black leading-none" style={{ left: 36, top: 122, fontSize: 104, color: ACCENT, opacity: Math.min(1, cnn * 2), transform: `scale(${0.7 + 0.3 * Math.min(1.05, cnn)})`, transformOrigin: "0 50%" }}>
        CNN
      </div>
      <Mono x={40} y={236} at={0.3} size={14} color={INK}>
        red neuronal convolucional
      </Mono>

      {stackOut < 1 ? (
        <div className="absolute" style={{ left: 36, top: 290, width: 468, height: 280, opacity: 1 - stackOut }}>
          {/* A light pulse travels the funnel from the input to the output, over and over: the photo going through. */}
          <div className="absolute rounded-full" style={{ left: 30 + ((t * 260) % 360), top: 92, width: 40, height: 40, background: "radial-gradient(circle, rgba(255,197,49,0.85) 0%, rgba(255,197,49,0) 70%)", opacity: EASE.out(unit(t, 0.9, 0.3)), zIndex: 2 }} />
          {STACK.map((b, i) => {
            const p = popAt(t, 0.35 + i * 0.12);
            return (
              <div key={b.label} className="absolute" style={{ left: b.x, top: 110 - b.h / 2, width: b.w, height: b.h, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - Math.min(1, p)) * -20}px) skewY(-8deg)`, background: i === 0 ? "#3A4150" : `rgba(139,133,255,${0.25 + i * 0.08})`, border: `1px solid ${i === 0 ? "#5A6272" : ACCENT}`, boxShadow: "6px 6px 0 rgba(0,0,0,0.35)" }}>
                <div data-ui="" className="absolute whitespace-nowrap font-mono text-[12px] font-bold" style={{ left: 0, top: b.h + 26 + (i % 2) * 18, color: MUTED, transform: "skewY(8deg)" }}>
                  {b.label}
                </div>
              </div>
            );
          })}
          <div className="absolute" style={{ left: 366, top: 82, width: 30, height: 56, border: `2px solid ${YELLOW}`, borderRadius: 3, opacity: EASE.out(unit(t, 1.1, 0.3)) }}>
            <div data-ui="" className="absolute font-mono text-[12px] font-bold" style={{ left: -6, top: 98, color: YELLOW }}>SALIDA</div>
          </div>
          <Mono x={0} y={232} at={1.2} size={13} width={468}>
            224 × 224 × 3 píxeles entran · 1.000 puntajes salen
          </Mono>
        </div>
      ) : null}

      {t > filtros - 0.15 && mosaicOut < 1 ? (
        <div className="absolute grid grid-cols-6 gap-[8px]" style={{ left: 196, top: 280, opacity: 1 - mosaicOut }}>
          {Array.from({ length: 36 }, (_, i) => {
            const p = popAt(t, filtros + (i % 6) * 0.04 + Math.floor(i / 6) * 0.05);
            return (
              <div key={i} style={{ opacity: Math.min(1, p * 2), transform: `scale(${0.5 + 0.5 * Math.min(1, p)})` }}>
                <FilterTile i={i} trained={1} size={44} />
              </div>
            );
          })}
        </div>
      ) : null}

      {t > tres - 0.1 ? (
        <div className="absolute" style={{ left: lerp(330, 220, grow), top: lerp(380, 300, grow), width: lerp(44, 270, grow), height: lerp(44, 270, grow), opacity: EASE.out(unit(t, tres - 0.1, 0.15)) }}>
          <div className="grid h-full w-full grid-cols-3 gap-[4px] rounded-[6px] p-[4px]" style={{ background: PANEL, border: `2px solid ${ACCENT}` }}>
            {SOBEL.map((v, i) => (
              <div key={i} data-ui="" className="flex items-center justify-center rounded-[3px] font-mono font-bold" style={{ background: v < 0 ? "rgba(255,90,95,0.18)" : v > 0 ? "rgba(139,133,255,0.22)" : "rgba(255,255,255,0.05)", border: `1px solid ${LINE}`, color: INK, fontSize: lerp(8, 34, grow) }}>
                {v > 0 ? `+${v}` : v === 0 ? "0" : `−${-v}`}
              </div>
            ))}
          </div>
          <Mono x={0} y={lerp(48, 282, grow)} at={tres + 0.3} size={13} width={270} align="center">
            un filtro · 3 × 3 números
          </Mono>
        </div>
      ) : null}
      <Ilustrativo x={250} y={740} at={filtros} />
    </Layer>
  );
}
