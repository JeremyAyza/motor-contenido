import { Icono } from "@motor/ui";
import { fade, useClock, useCue } from "@motor/video";
import { Layer, Plate, Sticker } from "../parts.tsx";

/** Point 1: tokens burnt by the barrel; the desk does not move an inch. */
export function Tokens() {
  const t = useClock();
  const coins = useCue("IA");
  const away = useCue("tokenmaxxing") - 0.2;
  return (
    <Layer>
      {t >= coins ? (
        <div className="absolute" style={{ left: 56, top: 196, opacity: fade(t, coins, 0.3) * (1 - fade(t, away, 0.2)), transform: `rotate(${Math.sin(t * 3) * 6}deg)` }}>
          <Icono name="coins" size={130} strokeWidth={1.8} ancla={false} />
        </div>
      ) : null}
      <Plate at={0.1} n={1}>Tokens ≠ trabajo</Plate>
      <Sticker at={useCue("tokenmaxxing")} until={useCue("frugalidad") - 0.15} x={270} y={186} rotate={3} className="whitespace-nowrap font-mono text-[44px]">
        tokenmaxxing
      </Sticker>
      <Sticker at={useCue("frugalidad")} x={270} y={200} rotate={-4} tone="red" className="whitespace-nowrap text-[40px]">
        ≠ frugalidad
      </Sticker>
    </Layer>
  );
}
