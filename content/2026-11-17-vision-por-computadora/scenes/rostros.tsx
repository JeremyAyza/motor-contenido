import type { CSSProperties } from "react";
import { EASE, fade, popAt, unit, useClock, useCue } from "@motor/video";
import { Ilustrativo, Layer, Mono, Photo, Pic, SwapTitle } from "../parts.tsx";
import { ACCENT, INK, LINE, MUTED, PANEL, YELLOW } from "../world.tsx";

/** The first values of the face's embedding: illustrative, not a real model's output. */
const VALUES = ["0.12", "−0.48", "0.33", "0.07", "−0.91", "0.26", "0.64", "−0.15", "0.02", "−0.37", "0.81", "−0.06"];

/** A face as a round dot on the plane, cropped from its photo. */
function Face({ src, x, y, at, size = 88, pos = "50% 30%", ring = INK, style }: { src: string; x: number; y: number; at: number; size?: number; pos?: string; ring?: string; style?: CSSProperties }) {
  const t = useClock();
  const p = popAt(t, at);
  if (p <= 0) return null;
  return (
    <div className="absolute overflow-hidden rounded-full" style={{ left: x - size / 2, top: y - size / 2, width: size, height: size, border: `3px solid ${ring}`, opacity: Math.min(1, p * 2), transform: `scale(${0.5 + 0.5 * Math.min(1.1, p)})`, ...style }}>
      <Pic src={src} style={{ objectPosition: pos, transform: "scale(1.9)", transformOrigin: pos }} />
    </div>
  );
}

/** A distance line between two faces, drawn from `at`, with its value in the middle. */
function Distance({ a, b, at, label, color }: { a: [number, number]; b: [number, number]; at: number; label: string; color: string }) {
  const t = useClock();
  const k = EASE.inOut(unit(t, at, 0.45));
  if (k <= 0) return null;
  const x = a[0] + (b[0] - a[0]) * k;
  const y = a[1] + (b[1] - a[1]) * k;
  return (
    <>
      <svg className="absolute inset-0" width={468} height={400}>
        <line x1={a[0]} y1={a[1]} x2={x} y2={y} stroke={color} strokeWidth={3} strokeDasharray="7 6" />
      </svg>
      <div data-ui="" className="absolute rounded-[4px] px-[6px] font-mono text-[15px] font-bold" style={{ left: (a[0] + b[0]) / 2 - 24, top: (a[1] + b[1]) / 2 - 12, background: color, color: "#111", opacity: EASE.out(unit(t, at + 0.35, 0.2)) }}>
        {label}
      </div>
    </>
  );
}

/**
 * A map where every face is a dot and look-alikes live close: the man's photo
 * pours out its list of numbers; on "cerca" the list gives way to a plane where
 * his two photos sit together on a short line and a stranger sits far away on
 * a long one. The phone only measures that distance.
 */
export function Rostros() {
  const t = useClock();
  const lista = useCue("lista");
  const cerca = useCue("cerca");
  const lejos = useCue("lejos");
  const distancia = useCue("distancia");
  const listOut = fade(t, cerca - 0.3, 0.25);
  const plane = EASE.out(unit(t, cerca - 0.15, 0.3));
  const me1: [number, number] = [318, 150];
  const me2: [number, number] = [372, 196];
  const stranger: [number, number] = [96, 320];
  return (
    <Layer>
      <SwapTitle at={cerca - 0.15} a="Tu cara, una lista" b="Misma persona: cerca" y={124} size={32} />
      {listOut < 1 ? (
        <div className="absolute inset-0" style={{ opacity: 1 - listOut }}>
          <Photo src="img/hombre.png" x={36} y={190} w={200} h={200} at={0} caption="rostro.jpg" />
          <div className="absolute grid grid-cols-2 gap-x-[10px] gap-y-[4px]" style={{ left: 266, top: 190 }}>
            {VALUES.map((v, i) => (
              <div key={i} data-ui="" className="rounded-[3px] px-[8px] font-mono text-[17px]" style={{ width: 108, height: 30, lineHeight: "30px", background: PANEL, border: `1px solid ${LINE}`, color: i % 3 === 0 ? ACCENT : INK, opacity: EASE.out(unit(t, lista + i * 0.06, 0.15)), transform: `translateX(${(1 - EASE.out(unit(t, lista + i * 0.06, 0.2))) * -30}px)` }}>
                {v}
              </div>
            ))}
          </div>
          <Mono x={266} y={406} at={lista + 0.8} size={16} color={YELLOW}>
            … 512 números
          </Mono>
        </div>
      ) : null}
      {plane > 0 ? (
        <div className="absolute rounded-[8px]" style={{ left: 36, top: 180, width: 468, height: 400, background: PANEL, border: `1px solid ${LINE}`, opacity: plane, backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "39px 40px" }}>
          <Distance a={me1} b={me2} at={cerca + 0.1} label="0,21" color={YELLOW} />
          <Distance a={me1} b={stranger} at={lejos} label="1,34" color={MUTED} />
          <Face src="img/hombre.png" x={me1[0]} y={me1[1]} at={cerca - 0.1} ring={YELLOW} pos="50% 32%" />
          <Face src="img/hombre.png" x={me2[0]} y={me2[1]} at={cerca + 0.05} ring={YELLOW} pos="48% 30%" style={{ filter: "brightness(1.15) saturate(0.85)" }} />
          <Face src="img/rostro.png" x={stranger[0]} y={stranger[1]} at={lejos - 0.2} pos="50% 42%" />
          <Mono x={14} y={368} size={12} at={distancia}>
            el teléfono mide la distancia: cerca = tú
          </Mono>
        </div>
      ) : null}
      <Ilustrativo x={250} y={600} at={lista} />
    </Layer>
  );
}
