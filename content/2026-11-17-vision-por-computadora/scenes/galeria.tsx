import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Layer, Pic, Title } from "../parts.tsx";
import { INK, LINE, MUTED, PANEL, YELLOW } from "../world.tsx";

/** The phone gallery: twelve photos, three of them dogs it was never trained on. */
const PHOTOS = [
  { src: "img/barco.png" },
  { src: "img/golden.png", dog: true },
  { src: "img/calle.png" },
  { src: "img/pajaro.png" },
  { src: "img/caballo.png" },
  { src: "img/gato.png" },
  { src: "img/perro-blanco.png", dog: true },
  { src: "img/avion.png" },
  { src: "img/rana.png" },
  { src: "img/ciervo.png" },
  { src: "img/auto.png" },
  { src: "img/husky.png", dog: true },
];

const QUERY = "perro";

/**
 * The phone's search as proof that it works: "perro" is typed in the search
 * box, then the three dogs get a yellow check one after the other and the
 * rest of the gallery dims.
 */
export function Galeria() {
  const t = useClock();
  const perro = useCue("perro");
  const vio = useCue("nunca");
  const typed = Math.round(QUERY.length * EASE.linear(unit(t, 0.1, 0.5)));
  const checks = [perro, perro + 0.18, perro + 0.36];
  const dim = EASE.out(unit(t, perro, 0.3));
  let dogIndex = 0;
  return (
    <Layer>
      <Title y={124} size={30}>Un perro que nunca vio</Title>
      <div className="absolute overflow-hidden rounded-[22px] p-[12px]" style={{ left: 176, top: 180, width: 328, height: 560, background: PANEL, border: `1px solid ${LINE}` }}>
        <div data-ui="" className="flex items-center gap-[8px] rounded-[10px] px-[12px] font-mono text-[16px]" style={{ height: 38, background: "rgba(255,255,255,0.07)", color: INK }}>
          <span style={{ color: MUTED }}>⌕</span>
          {QUERY.slice(0, typed)}
          {typed < QUERY.length ? <span style={{ color: MUTED }}>▌</span> : null}
        </div>
        <div className="mt-[12px] grid grid-cols-3 gap-[6px]">
          {PHOTOS.map((p, i) => {
            const k = p.dog ? checks[dogIndex++] : Infinity;
            const pop = popAt(t, 0.05 + i * 0.03);
            const lit = p.dog && t > k;
            return (
              <div key={i} className="relative overflow-hidden rounded-[4px]" style={{ height: 98, opacity: Math.min(1, pop * 2) * (p.dog ? 1 : 1 - 0.65 * dim), outline: lit ? `3px solid ${YELLOW}` : "none", outlineOffset: -3 }}>
                <Pic src={p.src} />
                {lit ? (
                  <div data-ui="" className="absolute flex items-center justify-center rounded-full font-bold" style={{ right: 5, top: 5, width: 24, height: 24, background: YELLOW, color: "#111", fontSize: 15, transform: `scale(${Math.min(1.1, popAt(t, k))})` }}>
                    ✓
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <div data-ui="" className="mt-[12px] font-mono text-[13px]" style={{ color: YELLOW, opacity: EASE.out(unit(t, vio - 0.2, 0.25)) }}>
          3 resultados · ninguno visto al entrenar
        </div>
      </div>
    </Layer>
  );
}
