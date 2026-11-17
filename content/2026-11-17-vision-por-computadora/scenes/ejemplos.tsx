import { EASE, es, popAt, unit, useClock, useCue } from "@motor/video";
import { Layer, Mono, Pic, Title } from "../parts.tsx";
import { ACCENT, INK, MUTED } from "../world.tsx";

/** The wall of labeled examples, like CIFAR-10's classes; the three the voice names get picked. */
const WALL = [
  { src: "img/rana.png", label: "rana" },
  { src: "img/perro-blanco.png", label: "perro", pick: "perro" },
  { src: "img/barco.png", label: "barco" },
  { src: "img/pajaro.png", label: "pájaro" },
  { src: "img/caballo.png", label: "caballo" },
  { src: "img/gato.png", label: "gato", pick: "gato" },
  { src: "img/camion.png", label: "camión" },
  { src: "img/ciervo.png", label: "ciervo" },
  { src: "img/avion.png", label: "avión" },
  { src: "img/golden.png", label: "perro" },
  { src: "img/auto.png", label: "auto", pick: "auto" },
  { src: "img/husky.png", label: "perro" },
];

const COLS = 4;
const TILE = 108;
const GAP = 12;

/**
 * An endless deck of answer cards: the wall fills in a wave, each tile with its
 * label, and the three the voice names jump forward with their label in the
 * accent. Under it, the counter of labeled images this network was shown,
 * from the referent's CIFAR-10 run.
 */
export function Ejemplos() {
  const t = useClock();
  const millones = useCue("millones");
  const picks: Record<string, number> = { perro: useCue("perro"), gato: useCue("gato"), auto: useCue("auto") };
  const count = 263616 * EASE.inOut(unit(t, millones, 3.2));
  return (
    <Layer>
      <Title y={124} size={30}>Millones con etiqueta</Title>
      {WALL.map((w, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const p = popAt(t, 0.1 + col * 0.08 + row * 0.16);
        const pickAt = w.pick ? picks[w.pick] : Infinity;
        const lift = w.pick ? EASE.out(unit(t, pickAt, 0.25)) : 0;
        const dim = Math.max(...Object.values(picks).map((at) => EASE.out(unit(t, at, 0.2)))) * (w.pick ? 0 : 0.35);
        return (
          <div key={i} className="absolute" style={{ left: 36 + col * (TILE + GAP), top: 176 + row * (TILE + 30), width: TILE, opacity: Math.min(1, p * 2) * (1 - dim), transform: `scale(${(0.8 + 0.2 * Math.min(1, p)) * (1 + 0.08 * lift)})`, zIndex: w.pick ? 2 : 1 }}>
            <div className="overflow-hidden rounded-[4px]" style={{ height: TILE, outline: lift > 0 ? `3px solid ${ACCENT}` : "none", boxShadow: lift > 0 ? `0 0 ${18 * lift}px rgba(139,133,255,0.6)` : "none" }}>
              <Pic src={w.src} />
            </div>
            <div data-ui="" className="mt-[3px] text-center font-mono text-[13px]" style={{ color: lift > 0.5 ? ACCENT : MUTED, fontWeight: lift > 0.5 ? 700 : 400 }}>
              {w.label}
            </div>
          </div>
        );
      })}
      <Mono x={250} y={608} at={millones - 0.2} size={12} width={254}>
        IMÁGENES CON ETIQUETA VISTAS
      </Mono>
      {t > millones - 0.2 ? (
        <div className="absolute font-mono font-bold" style={{ left: 250, top: 628, fontSize: 52, color: ACCENT, opacity: EASE.out(unit(t, millones - 0.2, 0.25)) }}>
          {es(Math.round(count))}
        </div>
      ) : null}
      <Mono x={250} y={694} at={millones} size={13} color={INK} width={254}>
        CIFAR-10 · 50.000 imágenes × 30 pasadas
      </Mono>
    </Layer>
  );
}
