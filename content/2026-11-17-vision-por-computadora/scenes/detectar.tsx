import { useClock, useCue } from "@motor/video";
import { DetBox, Layer, Mono, Photo, Title } from "../parts.tsx";
import { INK, MUTED, RED } from "../world.tsx";

/** img/calle.png (1080 × 1350) shown 468 × 440: × 0.4333 (585 tall), with objectPosition 38 % cutting 55 px off the top. */
const S = 0.4333;
const OY = (1350 * S - 440) * 0.38;
export const box = (x1: number, y1: number, x2: number, y2: number) => ({ x: x1 * S, y: y1 * S - OY, w: (x2 - x1) * S, h: (y2 - y1) * S });

export const PEOPLE = [box(320, 835, 485, 1135), box(585, 795, 690, 1105), box(805, 825, 990, 1130), box(150, 790, 315, 1060), box(85, 815, 180, 1080)];
export const CARS = [box(440, 750, 628, 962), box(220, 735, 365, 875), box(672, 715, 795, 860), box(785, 750, 1045, 980)];
export const LIGHT = box(87, 180, 145, 345);

/**
 * The street through a self-driving car's windshield: boxes drawn fast in the
 * order the voice names them (pedestrians, cars, the traffic light), each with
 * its label and score, and the count in the footer.
 */
export function Detectar() {
  const t = useClock();
  const peaton = useCue("peaton");
  const auto = useCue("auto");
  const semaforo = useCue("semaforo");
  const n = (list: unknown[], at: number) => Math.max(0, Math.min(list.length, Math.floor((t - at) / 0.12) + 1));
  return (
    <Layer>
      <Title y={124} size={32}>¿Qué es? ¿Y dónde?</Title>
      <Photo src="img/calle.png" x={36} y={176} w={468} h={440} at={0} imgStyle={{ objectPosition: "50% 38%" }}>
        {PEOPLE.map((b, i) => <DetBox key={`p${i}`} {...b} label={i === 0 ? "persona 0.91" : "persona"} at={peaton + i * 0.12} size={12} />)}
        {CARS.map((b, i) => <DetBox key={`c${i}`} {...b} label={i === 0 ? "auto 0.95" : "auto"} at={auto + i * 0.12} size={12} />)}
        <DetBox {...LIGHT} label="semáforo 0.88" at={semaforo} color={RED} size={12} />
      </Photo>
      <Mono x={250} y={634} size={14} color={INK} width={254} at={peaton}>
        personas {n(PEOPLE, peaton)} · autos {t > auto ? n(CARS, auto) : 0}
      </Mono>
      <Mono x={250} y={656} size={14} color={INK} width={254} at={peaton}>
        semáforos {t > semaforo ? 1 : 0}
      </Mono>
      <Mono x={250} y={680} size={12} color={MUTED} width={254} at={peaton}>
        YOLO · cámara frontal
      </Mono>
    </Layer>
  );
}
