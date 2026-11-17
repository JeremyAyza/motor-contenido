import { EASE, unit, useClock, useCue } from "@motor/video";
import { Layer, Mono, Photo, Pic, Title } from "../parts.tsx";
import { ACCENT, LINE, YELLOW } from "../world.tsx";

/** The three maps, computed from img/calle.png with ffmpeg (Sobel, a yellow threshold and a Laplacian). */
const MAPS = [
  { src: "img/calle-bordes.png", name: "bordes", word: "bordes", color: "#FFFFFF" },
  { src: "img/calle-amarillo.png", name: "color: amarillo", word: "color", color: YELLOW },
  { src: "img/calle-textura.png", name: "textura", word: "textura", color: ACCENT },
];

/**
 * The same street through three different glasses: the photo on the left and,
 * one per clause, the three maps the filters make of it, each wiping down
 * from the photo into its map.
 */
export function Detectores() {
  const t = useClock();
  const cues: Record<string, number> = { bordes: useCue("bordes"), color: useCue("color"), textura: useCue("textura") };
  return (
    <Layer>
      <Title y={124} size={30}>Cada filtro, un detector</Title>
      <Photo src="img/calle.png" x={36} y={196} w={150} h={188} at={0} caption="entrada" />
      {MAPS.map((m, i) => {
        const at = cues[m.word] - 0.15;
        const wipe = EASE.inOut(unit(t, at, 0.5));
        const y = 180 + i * 186;
        if (t < at - 0.05) return null;
        return (
          <div key={m.src} className="absolute" style={{ left: 214, top: y, width: 290, height: 160 }}>
            <div className="absolute inset-0 overflow-hidden rounded-[4px]" style={{ border: `1px solid ${LINE}` }}>
              <Pic src="img/calle.png" style={{ objectPosition: "50% 62%" }} />
              <div className="absolute inset-0" style={{ clipPath: `inset(0 0 ${100 - wipe * 100}% 0)` }}>
                <Pic src={m.src} style={{ objectPosition: "50% 62%" }} />
              </div>
            </div>
            <Mono x={0} y={166} size={13} color={m.color} at={at + 0.2}>
              filtro {i + 1} → {m.name}
            </Mono>
          </div>
        );
      })}
    </Layer>
  );
}
