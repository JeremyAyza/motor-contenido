import { Gesto } from "@motor/ui";
import { EASE, es, popAt, unit, useClock, useCue } from "@motor/video";
import { Layer, Sticker } from "../parts.tsx";

/** The close: the three points in a row, and the hook's counter goes into the send button. */
export function Cta() {
  const t = useClock();
  const send = useCue("compañero");
  const press = popAt(t, send);
  const into = EASE.inOut(unit(t, send - 0.6, 0.6));
  return (
    <Layer>
      <Sticker at={0.1} x={128} y={116} rotate={-5} className="whitespace-nowrap text-[28px] uppercase">
        1 Tokens
      </Sticker>
      <Sticker at={0.35} x={270} y={178} rotate={3} className="whitespace-nowrap text-[28px] uppercase">
        2 Líneas
      </Sticker>
      <Sticker at={0.6} x={404} y={116} rotate={-3} className="whitespace-nowrap text-[28px] uppercase">
        3 Hallazgo
      </Sticker>
      <div
        className="absolute rounded-xl border-[3px] border-ink bg-white px-3 py-1 font-mono text-[26px] font-bold"
        style={{ left: 60, top: 262, transform: `translate(${into * 190}px, ${into * 30}px) scale(${1 - 0.5 * into}) rotate(${-4 + 8 * into}deg)`, opacity: 1 - 0.8 * into }}
      >
        LÍNEAS <span className="text-accent">{es(99999)}</span>
      </div>
      <div
        className="absolute flex h-[120px] w-[120px] items-center justify-center rounded-full border-[3px] border-ink bg-accent text-accent-ink"
        style={{ left: 330, top: 230, transform: `scale(${1 - 0.12 * Math.sin(Math.min(1, press) * Math.PI)})` }}
      >
        <Gesto accion="enviar" size={64} lleno={t >= send} strokeWidth={2.4} />
      </div>
    </Layer>
  );
}
