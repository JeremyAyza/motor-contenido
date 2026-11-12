import { popAt, shakeAt, useClock, useCue } from "@motor/video";
import { Cpu, Layer, Mono, Title } from "../parts.tsx";
import { AMD, INTEL } from "../world.tsx";

/** The two packages side by side, lids on; on "tapas" they rattle, about to open. */
export function Ensamblado() {
  const t = useClock();
  const arma = useCue("arma");
  const tapas = useCue("tapas");
  const a = popAt(t, 0.05);
  const b = popAt(t, 0.25);
  const shake = shakeAt(t, [tapas - 0.05], 5);
  return (
    <Layer>
      <Title>Cómo se arma cada uno</Title>
      <Cpu brand="amd" x={266 + shake.x} y={480 + shake.y} s={0.85 * Math.min(1, a)} outline={AMD} />
      <Cpu brand="intel" x={420 - shake.x} y={480 - shake.y} s={0.72 * Math.min(1, b)} outline={INTEL} />
      <Mono x={266} y={580} center width={170} size={14} color={AMD} style={{ opacity: Math.min(1, popAt(t, arma)) }}>
        RYZEN 9 9950X
      </Mono>
      <Mono x={420} y={580} center width={150} size={13} color={INTEL} style={{ opacity: Math.min(1, popAt(t, arma + 0.15)) }}>
        CORE ULTRA 9 285K
      </Mono>
    </Layer>
  );
}
