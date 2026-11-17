import { EASE, fade, popAt, unit, useClock, useCue } from "@motor/video";
import pixels from "../pixels.json";
import { FilterTile } from "../filters.tsx";
import { Card, Corners, DetBox, Layer, Pic, Title } from "../parts.tsx";
import { CARS, LIGHT, PEOPLE } from "./detectar.tsx";
import { ACCENT, INK, MUTED, RED, YELLOW } from "../world.tsx";

const WHOLE: number[][] = pixels.whole.grid;

/** The three steps, each with a thumbnail of the scene that showed it. */
function Step({ n, text, at, until, y, children }: { n: string; text: string; at: number; until: number; y: number; children: React.ReactNode }) {
  return (
    <Card x={36} y={y} w={468} h={112} at={at} until={until}>
      <div className="flex h-full items-center gap-[16px] px-[14px]">
        <div className="overflow-hidden rounded-[4px]" style={{ width: 84, height: 84, flex: "none" }}>{children}</div>
        <div>
          <div data-ui="" className="font-mono text-[14px] font-bold" style={{ color: ACCENT }}>{n}</div>
          <div className="font-display text-[26px] font-extrabold leading-[1.05]" style={{ color: INK }}>{text}</div>
        </div>
      </div>
    </Card>
  );
}

/** The labels the close lights up, one per word. */
const LABELS: { word: string; text: string; color: string }[] = [
  { word: "auto", text: "auto", color: YELLOW },
  { word: "persona", text: "persona", color: YELLOW },
  { word: "calle", text: "calle", color: "#7AA2FF" },
  { word: "semaforo", text: "semáforo", color: RED },
];

/**
 * The numbers that reveal themselves as the street the audience saw at the
 * start: three steps that sum it all up, then the full grid of the street's
 * values that clears layer by layer, bottom to top, into the photo with all its
 * boxes, while its labels light up one per word.
 */
export function Cierre() {
  const t = useClock();
  const numeros = useCue("numeros");
  const patrones = useCue("patrones");
  const predecir = useCue("predecir");
  const calle = useCue("calle");
  const capa = useCue("capa");
  const label: Record<string, number> = { auto: useCue("auto"), persona: useCue("persona"), calle: useCue("calle", 2), semaforo: useCue("semaforo") };
  const cardsOut = calle - 0.25;
  const grid = EASE.out(unit(t, calle - 0.1, 0.3));
  const clear = EASE.inOut(unit(t, capa - 0.2, label.auto - capa + 0.1));
  const end = fade(t, useCue("eso") - 0.05, 0.4);
  return (
    <Layer>
      {t < numeros ? <Title y={124} size={30} style={{ opacity: 1 - fade(t, numeros - 0.2, 0.2) }}>La idea de fondo</Title> : null}
      <Step n="01" text="La imagen, en números" at={Math.min(numeros - 0.3, 0.5)} until={cardsOut} y={186}>
        <div className="grid h-full w-full grid-cols-4">
          {pixels.cat.grid.slice(2, 6).flatMap((row) => row.slice(0, 4)).map(([r, g, b], i) => (
            <i key={i} className="block" style={{ background: `rgb(${r},${g},${b})` }} />
          ))}
        </div>
      </Step>
      <Step n="02" text="Aprender patrones" at={patrones - 0.2} until={cardsOut} y={312}>
        <div className="grid h-full w-full grid-cols-3 gap-[2px]">
          {Array.from({ length: 9 }, (_, i) => <FilterTile key={i} i={i + 3} trained={1} size={27} />)}
        </div>
      </Step>
      <Step n="03" text="Predecir qué contiene" at={predecir - 0.2} until={cardsOut} y={438}>
        <div className="relative h-full w-full">
          <Pic src="img/husky.png" />
          <div data-ui="" className="absolute bottom-0 left-0 right-0 text-center font-mono text-[12px] font-bold" style={{ background: YELLOW, color: "#111" }}>94 % perro</div>
        </div>
      </Step>

      {grid > 0 ? (
        <div className="absolute" style={{ left: 36, top: 176, width: 468, height: 440, opacity: grid * (1 - 0.0 * end) }}>
          <div className="absolute inset-0 overflow-hidden rounded-[4px]">
            <Pic src="img/calle.png" style={{ objectPosition: "50% 38%" }} />
            <div className="absolute inset-0 grid" style={{ gridTemplateColumns: "repeat(18, 1fr)", clipPath: `inset(0 0 ${clear * 100}% 0)` }}>
              {WHOLE.flat().map((v, i) => (
                <div key={i} data-ui="" className="flex items-center justify-center font-mono text-[12px]" style={{ background: `rgb(${Math.round(v * 0.35)},${Math.round(v * 0.35)},${Math.round(v * 0.4)})`, color: `rgba(242,244,248,${0.35 + v / 400})` }}>
                  {v}
                </div>
              ))}
            </div>
            {PEOPLE.map((b, i) => <DetBox key={`p${i}`} {...b} label="persona" at={label.persona + i * 0.06} size={12} />)}
            {CARS.map((b, i) => <DetBox key={`c${i}`} {...b} label="auto" at={label.auto + i * 0.06} size={12} />)}
            <DetBox {...LIGHT} label="semáforo" at={label.semaforo} color={RED} size={12} />
            {t > label.calle ? <div className="absolute" style={{ left: 0, right: 0, bottom: 0, height: 70, background: `rgba(80,120,255,${0.35 * EASE.out(unit(t, label.calle, 0.3))})` }} /> : null}
          </div>
          <Corners w={468} h={440} />
        </div>
      ) : null}
      <div className="absolute flex flex-wrap gap-[8px]" style={{ left: 214, top: 634, width: 290 }}>
        {LABELS.map((l) => {
          const p = popAt(t, label[l.word]);
          return p > 0 ? (
            <div key={l.text} className="rounded-[6px] px-[10px] font-mono text-[22px] font-bold" style={{ height: 34, lineHeight: "34px", background: l.color, color: "#111", opacity: Math.min(1, p * 2), transform: `scale(${0.6 + 0.4 * Math.min(1.1, p)})` }}>
              {l.text}
            </div>
          ) : null;
        })}
      </div>
      {grid > 0 && clear < 1 ? (
        <div data-ui="" className="absolute font-mono text-[13px]" style={{ left: 214, top: 724, color: MUTED, opacity: grid * (1 - clear) }}>
          lo que ve la computadora · calle.jpg
        </div>
      ) : null}
    </Layer>
  );
}
