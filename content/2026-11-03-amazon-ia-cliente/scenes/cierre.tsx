import { Icono } from "@motor/ui";
import { EASE, fade, unit, useClock, useCue } from "@motor/video";
import { Layer, Sticker } from "../parts.tsx";

const TOOLS = ["bot", "sparkles", "cpu", "wand-sparkles", "brain", "terminal"];

/** Tools race past while the desk reaches the door; what matters holds still. */
export function Cierre() {
  const t = useClock();
  const fast = useCue("rápido");
  const stop = useCue("importa");
  const brake = EASE.out(unit(t, stop, 0.6));
  const show = fade(t, fast - 0.6, 0.3) * (1 - fade(t, stop + 0.3, 0.3));
  return (
    <Layer>
      {show > 0
        ? TOOLS.map((name, i) => {
            const x = 560 - (((t - fast + 0.6 + i * 0.18) * 900 * (1 - brake)) % 700);
            return (
              <div key={name} className="absolute" style={{ left: x, top: 150 + (i % 3) * 64, opacity: show * 0.85 }}>
                <Icono name={name} size={48} strokeWidth={2.2} ancla={false} />
              </div>
            );
          })
        : null}
      <Sticker at={stop} x={270} y={130} rotate={-2} tone="ink" className="w-[400px] text-center text-[38px] uppercase">
        Lo que importa no cambia
      </Sticker>
    </Layer>
  );
}
