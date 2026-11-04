import { Icono } from "@motor/ui";
import { EASE, unit, useClock, useCue } from "@motor/video";
import { Layer, RED, Sticker } from "../parts.tsx";

/** The outcome over the tool: the tool's name gets struck out. */
export function Resultado() {
  const t = useClock();
  const tool = useCue("herramienta");
  const strike = EASE.out(unit(t, tool + 0.25, 0.35));
  return (
    <Layer>
      <Sticker at={useCue("resultado")} x={270} y={118} rotate={-3} tone="accent" className="flex items-center gap-3 whitespace-nowrap text-[44px] uppercase">
        <Icono name="package-check" size={46} strokeWidth={2.4} ancla={false} />
        Resultado
      </Sticker>
      <Sticker at={tool} x={270} y={214} rotate={3} className="flex items-center gap-3 whitespace-nowrap text-[32px] uppercase">
        <Icono name="wrench" size={34} strokeWidth={2.4} ancla={false} />
        Herramienta
        <span className="absolute rounded" style={{ background: RED, height: 6, left: 12, top: "50%", marginTop: -3, width: `${strike * 92}%` }} />
      </Sticker>
      <Sticker at={useCue("rol")} x={270} y={306} rotate={-2} tone="ink" className="whitespace-nowrap text-[30px] uppercase">
        Tu rol ≠ usar IA
      </Sticker>
    </Layer>
  );
}
