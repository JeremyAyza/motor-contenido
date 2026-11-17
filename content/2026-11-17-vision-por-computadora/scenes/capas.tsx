import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Layer, Mono, Pic, SwapTitle } from "../parts.tsx";
import { LINE, MUTED, YELLOW } from "../world.tsx";

/** First layers: edge maps of the four photos (ffmpeg edgedetect). */
const EDGES = ["img/golden-bordes.png", "img/gato-bordes.png", "img/auto-bordes.png", "img/rostro-bordes.png"];

/** Deeper layers: each photo lit where its feature is, as fractions of the picture. */
const DEEP = [
  { src: "img/golden.png", word: "pelaje", name: "pelaje", spots: [[0.46, 0.62, 0.32]] },
  { src: "img/gato.png", word: "ojos", name: "ojos", spots: [[0.36, 0.46, 0.12], [0.64, 0.46, 0.12]] },
  { src: "img/auto.png", word: "ruedas", name: "ruedas", spots: [[0.45, 0.57, 0.1], [0.86, 0.47, 0.08]] },
  { src: "img/rostro.png", word: "caras", name: "caras", spots: [[0.55, 0.5, 0.26]] },
];

const TILE = 150;

/**
 * A building where each floor sees something bigger than the one below: a row
 * of edge maps (the first layers), then the four photos with a yellow glow
 * right on the fur, the eyes, the wheels and the face as the voice names them.
 * On "objetos completos" the glow spreads over the whole thing.
 */
export function Capas() {
  const t = useClock();
  const primeras = useCue("primeras");
  const profundas = useCue("profundas");
  const objetos = useCue("objetos");
  const cues: Record<string, number> = { pelaje: useCue("pelaje"), ojos: useCue("ojos"), ruedas: useCue("ruedas"), caras: useCue("caras") };
  const whole = EASE.inOut(unit(t, objetos, 0.6));
  const edgeDim = EASE.out(unit(t, profundas, 0.3));
  return (
    <Layer>
      <SwapTitle at={profundas} a="Primero: bordes, líneas" b="Después: ojos, caras" y={124} size={30} />
      {EDGES.map((src, i) => {
        const p = popAt(t, Math.min(primeras - 0.2, 0.15) + i * 0.1);
        return (
          <div key={src} className="absolute overflow-hidden rounded-[4px]" style={{ left: 36 + i * 120, top: 180, width: 108, height: 108, border: `1px solid ${LINE}`, opacity: Math.min(1, p * 2) * (1 - 0.55 * edgeDim), transform: `translateY(${(1 - Math.min(1, p)) * 16}px)` }}>
            <Pic src={src} style={{ filter: "brightness(1.8)" }} />
          </div>
        );
      })}
      <Mono x={36} y={294} at={primeras} size={12}>capas 1 y 2 · ResNet-18</Mono>
      {DEEP.map((d, i) => {
        const at = cues[d.word];
        const p = popAt(t, profundas + 0.1 + i * 0.12);
        if (p <= 0) return null;
        const lit = EASE.out(unit(t, at - 0.1, 0.3));
        const x = 196 + (i % 2) * (TILE + 8);
        const y = 322 + Math.floor(i / 2) * (TILE + 30);
        return (
          <div key={d.src} className="absolute" style={{ left: x, top: y, width: TILE, opacity: Math.min(1, p * 2), transform: `scale(${0.85 + 0.15 * Math.min(1, p)})` }}>
            <div className="relative overflow-hidden rounded-[4px]" style={{ height: TILE }}>
              <Pic src={d.src} style={{ filter: `brightness(${1 - 0.45 * lit * (1 - whole)})` }} />
              {d.spots.map(([sx, sy, r], k) => {
                const radius = (r + (0.75 - r) * whole) * TILE;
                return <div key={k} className="absolute rounded-full" style={{ left: sx * TILE - radius, top: sy * TILE - radius, width: radius * 2, height: radius * 2, background: `radial-gradient(circle, rgba(255,197,49,${0.75 * lit}) 0%, rgba(255,197,49,${0.35 * lit}) 45%, rgba(255,197,49,0) 72%)`, mixBlendMode: "screen" }} />;
              })}
            </div>
            <div data-ui="" className="mt-[4px] flex font-mono text-[13px]" style={{ color: lit > 0.5 ? YELLOW : MUTED }}>
              <span>{d.name}</span>
              <span className="ml-auto">capa {3 + Math.floor(i / 2)}</span>
            </div>
          </div>
        );
      })}
    </Layer>
  );
}
