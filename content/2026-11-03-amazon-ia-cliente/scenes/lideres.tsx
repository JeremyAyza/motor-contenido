import { Icono } from "@motor/ui";
import { fade, useClock, useCue } from "@motor/video";
import { Layer, RED, Sticker } from "../parts.tsx";

/** Leaders: rumors in the ear go out, the hands on the keyboard come in. */
export function Lideres() {
  const t = useClock();
  const hear = useCue("líderes");
  const off = useCue("oídas");
  const dim = fade(t, off, 0.3);
  return (
    <Layer>
      <Sticker at={0.1} x={270} y={112} rotate={-2} tone="ink" className="whitespace-nowrap text-[40px] uppercase">
        Líderes
      </Sticker>
      <div className="absolute" style={{ left: 60, top: 206, opacity: fade(t, hear, 0.3) * (1 - 0.65 * dim) }}>
        <Icono name="ear" size={110} strokeWidth={2.2} ancla={false} />
      </div>
      <div className="absolute inset-0" style={{ opacity: 1 - 0.7 * dim }}>
        <Sticker at={hear + 0.3} x={290} y={200} rotate={4} className="whitespace-nowrap text-[26px] italic">
          «dicen que…»
        </Sticker>
        <Sticker at={hear + 0.8} x={330} y={262} rotate={-3} className="whitespace-nowrap text-[26px] italic">
          «dicen que…»
        </Sticker>
      </div>
      {t >= off ? <div className="absolute rounded" style={{ background: RED, height: 6, left: 170, top: 252, width: 300 * fade(t, off, 0.3), transform: "rotate(-8deg)" }} /> : null}
      <Sticker at={useCue("mismos")} x={290} y={344} rotate={-4} tone="accent" className="flex items-center gap-3 whitespace-nowrap text-[34px] uppercase">
        <Icono name="keyboard" size={40} strokeWidth={2.4} ancla={false} />
        Hands-on
      </Sticker>
    </Layer>
  );
}
