import { EASE, unit, useClock, useCue } from "@motor/video";
import { Layer, Mono, Photo, Title } from "../parts.tsx";
import { ACCENT, MUTED } from "../world.tsx";

/**
 * The app opens the street photo as a file. The question goes over it, and on
 * "no ve imágenes" an accent line strikes the photo out: the half answer.
 */
export function Pregunta() {
  const t = useClock();
  const clave = useCue("clave");
  const strike = useCue("computadora") + 0.55;
  const k = EASE.inOut(unit(t, strike, 0.35));
  return (
    <Layer>
      <Title y={124} size={34}>¿Cómo lo sabe?</Title>
      <Photo src="img/calle.png" x={150} y={180} w={354} h={390} at={0} caption="calle.jpg" right="1 foto" imgStyle={{ filter: `saturate(${1 - 0.6 * k}) brightness(${1 - 0.35 * k})` }}>
        <svg className="absolute inset-0" width={354} height={390}>
          <line x1={20} y1={370} x2={20 + 314 * k} y2={370 - 350 * k} stroke={ACCENT} strokeWidth={8} strokeLinecap="round" />
        </svg>
      </Photo>
      <Mono x={250} y={610} at={clave} size={22} color={MUTED} width={254} align="right">
        imagen → ?
      </Mono>
    </Layer>
  );
}
