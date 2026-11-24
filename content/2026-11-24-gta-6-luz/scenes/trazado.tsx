import { EASE, lerp, unit, useClock, useCue } from "@motor/video";
import type { BackProps } from "../palette.ts";
import { Backdrop, Chip, Layer, Ray } from "../parts.tsx";
import { LAMPS, Lamp } from "./truco.tsx";

/** The same street, still flat; with "trazado" the real light comes back. */
export function TrazadoBack({ t, cue }: BackProps) {
  const real = EASE.inOut(unit(t, cue("trazado") - 0.1, 0.9));
  return <Backdrop src="img/calle-rosa.png" t={t} at={-1} dur={20} z0={1.03} z1={1.05} filter={`saturate(${lerp(0.5, 1.12, real)}) brightness(${lerp(0.82, 1.06, real)}) contrast(${lerp(0.92, 1.04, real)})`} />;
}

/**
 * The hidden lamps go off with "fingirla". Then one ray leaves the sun
 * ("sigue"), bounces on the pavement, crosses to a window and ends on the
 * avatar's skin, who stepped in with "cruza" (video.tsx).
 */
export function Trazado() {
  const t = useClock();
  const iluminacion = useCue("iluminación");
  const trazado = useCue("trazado");
  const fingirla = useCue("fingirla");
  const sigue = useCue("sigue");
  const pavimento = useCue("pavimento");
  const ventana = useCue("ventana");
  const piel = useCue("piel");
  const gone = EASE.out(unit(t, fingirla + 0.6, 0.3));
  return (
    <Layer>
      {gone < 1
        ? LAMPS.map((l, i) => (
            <div key={i} style={{ opacity: 1 - gone }}>
              <Lamp {...l} k={1} off={EASE.out(unit(t, fingirla + i * 0.12, 0.25))} />
            </div>
          ))
        : null}
      <Chip at={iluminacion} until={fingirla} x={36} y={120} tone="light">
        Iluminación global
      </Chip>
      <Chip at={trazado} x={36} y={170} tone="accent">
        Trazado de rayos
      </Chip>
      <Ray
        points={[
          { x: 470, y: 330, at: sigue },
          { x: 420, y: 770, at: pavimento },
          { x: 150, y: 470, at: ventana },
          { x: 128, y: 650, at: piel },
        ]}
      />
      <Chip at={pavimento} x={330} y={700} tone="dark">
        Pavimento
      </Chip>
      <Chip at={ventana} x={36} y={400} tone="dark">
        Ventana
      </Chip>
      <Chip at={piel + 0.05} x={220} y={600} tone="amber">
        Piel
      </Chip>
    </Layer>
  );
}
