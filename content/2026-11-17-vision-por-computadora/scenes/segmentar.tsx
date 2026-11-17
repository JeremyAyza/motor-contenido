import { EASE, unit, useClock, useCue } from "@motor/video";
import { Ilustrativo, Layer, Photo, Pic, Title } from "../parts.tsx";
import { ACCENT, YELLOW } from "../world.tsx";
import { CARS } from "./detectar.tsx";

/*
 * Hand-drawn masks over the generated photos (illustrative, not a model's
 * output): the street's zones, the person in the video call and the mass in
 * the scan. Coordinates in each photo box.
 */

/** The street zones in the 468 × 440 box (same crop as the detection scene). */
const ZONES = [
  { d: "M 0 440 L 0 330 L 150 255 L 200 230 L 280 230 L 330 255 L 468 330 L 468 440 Z", fill: "rgba(80,120,255,0.55)" },
  { d: "M 0 0 L 160 0 L 175 230 L 0 320 Z", fill: "rgba(160,160,175,0.45)" },
  { d: "M 468 0 L 300 0 L 300 230 L 468 300 Z", fill: "rgba(160,160,175,0.45)" },
  { d: "M 175 0 L 300 0 L 300 120 L 175 120 Z", fill: "rgba(120,220,255,0.35)" },
];
const CAR_ZONES = CARS.map((c) => [c.x, c.y, c.w, c.h]);

/** The person in img/videollamada.png (1440 × 1080) in a 468 × 351 box: head and shoulders. */
const PERSON = "M 240 70 C 270 70, 290 92, 290 130 L 288 190 C 300 205, 320 212, 340 225 C 372 245, 386 280, 392 325 L 78 325 C 84 280, 100 245, 132 225 C 152 212, 172 205, 192 190 L 190 130 C 190 92, 210 70, 240 70 Z";

/**
 * A coloring book where the machine paints every zone: the street fills with
 * zone colors; on "videollamada" the person stays sharp in yellow while the
 * room blurs; on "tumor" the scan comes in and an accent contour rings the mass.
 */
export function Segmentar() {
  const t = useClock();
  const pixel = useCue("pixel");
  const video = useCue("videollamada");
  const fondo = useCue("fondo");
  const tumor = useCue("tumor");
  const paint = EASE.out(unit(t, pixel - 0.3, 0.6));
  const blur = EASE.inOut(unit(t, fondo - 0.1, 0.5));
  const ring = EASE.inOut(unit(t, tumor - 0.1, 0.6));
  return (
    <Layer>
      <Title y={124} size={32}>Segmentación</Title>
      <Photo src="img/calle.png" x={36} y={176} w={468} h={440} at={0} until={video - 0.2} imgStyle={{ objectPosition: "50% 38%" }}>
        <svg className="absolute inset-0" width={468} height={440} style={{ opacity: paint }}>
          {ZONES.map((z, i) => <path key={i} d={z.d} fill={z.fill} />)}
          {CAR_ZONES.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} rx={10} fill="rgba(255,197,49,0.7)" />)}
        </svg>
      </Photo>
      {t > video - 0.25 ? (
        <Photo src="img/videollamada.png" x={36} y={196} w={468} h={351} at={video - 0.2} until={tumor - 0.25} caption="videollamada · fondo desenfocado" imgStyle={{ filter: `blur(${6 * blur}px)` }}>
          <div className="absolute inset-0" style={{ clipPath: `path('${PERSON}')` }}>
            <Pic src="img/videollamada.png" />
          </div>
          <svg className="absolute inset-0" width={468} height={351}>
            <path d={PERSON} fill={`rgba(255,197,49,${0.18 * blur})`} stroke={YELLOW} strokeWidth={3} strokeDasharray={1400} strokeDashoffset={1400 * (1 - blur)} />
          </svg>
        </Photo>
      ) : null}
      {t > tumor - 0.3 ? (
        <Photo src="img/resonancia.png" x={96} y={176} w={408} h={408} at={tumor - 0.25} caption="resonancia · corte axial" right="1 región" imgStyle={{ transform: "scale(1.12)", transformOrigin: "50% 45%" }}>
          <svg className="absolute inset-0" width={408} height={408}>
            {/* The mass sits near (0.72, 0.65) of the scan; with the 1.12 zoom around (0.5, 0.45) that is about (308, 260). */}
            <ellipse cx={309} cy={262} rx={44} ry={50} fill={`rgba(139,133,255,${0.16 * ring})`} stroke={ACCENT} strokeWidth={3} strokeDasharray={320} strokeDashoffset={320 * (1 - ring)} />
          </svg>
        </Photo>
      ) : null}
      <Ilustrativo x={250} y={760} at={pixel} />
    </Layer>
  );
}
