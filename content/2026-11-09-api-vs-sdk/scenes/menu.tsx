import { EASE, fade, keys, popAt, unit, useClock, useCue } from "@motor/video";
import { Layer, Pill } from "../parts.tsx";
import { API, API_SOFT, CREAM, INK, MUTED } from "../world.tsx";

const DISHES: Array<{ name: string; route: string }> = [
  { name: "Responses", route: "POST /v1/responses" },
  { name: "Embeddings", route: "POST /v1/embeddings" },
  { name: "Imágenes", route: "POST /v1/images/generations" },
  { name: "Audio", route: "POST /v1/audio/speech" },
];

const KITCHEN = ["GPUs", "modelo", "tokens", "cola", "caché", "moderación", "pesos", "escalado"];

const SERIF = "Georgia, 'Times New Roman', serif";

/** OpenAI's menu: you know what to order and how, and the kitchen stays out of sight. */
export function Menu() {
  const t = useClock();
  const pedir = useCue("pedir");
  const pedirlo = useCue("pedirlo");
  const cocina = useCue("cocina");
  // The menu lands tilted in perspective and flattens, then moves up when the kitchen shows.
  const land = EASE.out(unit(t, 0.05, 0.6));
  const tilt = (1 - land) * 38;
  const up = EASE.inOut(unit(t, cocina - 0.1, 0.5));
  const mark = EASE.inOut(unit(t, pedir - 0.05, 0.4));
  const strip = EASE.out(unit(t, cocina, 0.45));
  return (
    <Layer>
      <div className="absolute" style={{ left: 196, top: 136, width: 308, perspective: 900, transform: `translateY(${-24 * up}px) scale(${1 - 0.12 * up})`, transformOrigin: "50% 0%" }}>
        <div data-ui="" className="rounded-[6px] px-5 pb-6 pt-6" style={{ background: CREAM, boxShadow: "0 22px 48px rgba(15,37,64,0.18)", transform: `rotateX(${tilt}deg) translateY(${(1 - land) * -60}px)`, opacity: Math.min(1, land * 3), transformOrigin: "50% 100%" }}>
          <div className="text-center text-[40px] leading-none" style={{ fontFamily: SERIF, color: INK }}>
            La carta
          </div>
          <div className="mt-1 text-center font-mono text-[12px]" style={{ color: MUTED }}>
            api.openai.com
          </div>
          <div className="mx-auto my-3 h-[1px] w-[80%]" style={{ background: "#D9CFA8" }} />
          {DISHES.map((dish, i) => (
            <div key={dish.name} className="relative mb-3 px-2 py-[8px]">
              {i === 0 ? <div className="absolute inset-0 rounded-[4px]" style={{ background: API_SOFT, transform: `scaleX(${mark})`, transformOrigin: "0 50%" }} /> : null}
              <div className="relative text-[25px] leading-tight" style={{ fontFamily: SERIF, color: INK }}>
                {dish.name}
              </div>
              <div className="relative font-mono text-[13px]" style={{ color: i === 0 && mark > 0.5 ? API : MUTED }}>
                {dish.route}
              </div>
            </div>
          ))}
        </div>
      </div>
      {t >= pedirlo - 0.05 ? (
        <>
          <div style={{ opacity: Math.min(1, popAt(t, pedirlo - 0.05) * 2) * (1 - up) }}>
            <Pill x={226} y={620} color="#FFFFFF" bg={API}>
              envías: model, input
            </Pill>
          </div>
          <div style={{ opacity: Math.min(1, popAt(t, pedirlo + 0.25) * 2) * (1 - up) }}>
            <Pill x={226} y={662} color="#FFFFFF" bg={API}>
              recibes: JSON
            </Pill>
          </div>
        </>
      ) : null}
      {t >= cocina ? (
        // The kitchen's parts light up one by one inside the card: a scrolling strip ran past the margin.
        <div data-ui="" className="absolute overflow-hidden rounded-[14px]" style={{ left: 36, top: 590 + (1 - strip) * 40, width: 468, height: 136, opacity: strip, background: "linear-gradient(160deg, #1B2B44, #0E2440)" }}>
          <div className="px-4 pt-3 font-mono text-[13px] font-bold tracking-[0.2em] text-white/60">LA COCINA</div>
          <div className="mt-3 flex flex-wrap gap-2 px-4">
            {KITCHEN.map((label, i) => {
              const p = popAt(t, cocina + 0.05 + i * 0.06);
              return (
                <span key={label} className="whitespace-nowrap rounded-[8px] px-3 py-[8px] font-mono text-[14px] text-white/80" style={{ background: "rgba(255,255,255,0.08)", opacity: 0.55 * Math.min(1, p * 2), transform: `scale(${0.8 + 0.2 * Math.min(1, p)})` }}>
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      ) : null}
    </Layer>
  );
}
