import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Gesto } from "@motor/ui";
import { Cpu, Layer, Mono } from "../parts.tsx";
import { ACCENT, AMD, INK, INTEL, MUTED } from "../world.tsx";

/** The vote at the end: follow, save the chip, and say in the comments which side you're on. */
export function Cta() {
  const t = useClock();
  const sigueme = useCue("Sígueme");
  const guarda = useCue("guarda");
  const comentarios = useCue("comentarios");
  const follow = popAt(t, sigueme + 0.1);
  const saved = EASE.out(unit(t, guarda + 0.1, 0.25));
  const save = popAt(t, guarda - 0.1);
  const comment = popAt(t, comentarios - 0.1);
  const amdBtn = popAt(t, comentarios + 0.25);
  const intelBtn = popAt(t, comentarios + 0.4);
  return (
    <Layer>
      <Cpu brand="amd" x={300} y={250} s={0.7} lid={0} lit={{ ccd0: 1, ccd1: 1, io: 0.6 }} outline={AMD} />
      <Cpu brand="intel" x={440} y={250} s={0.6} lid={0} lit={{ compute: 1, graphics: 1, soc: 1, io: 1 }} outline={INTEL} />
      <div className="absolute" style={{ left: 330, top: 330, color: saved > 0.5 ? ACCENT : INK, opacity: t < guarda - 0.1 ? 0 : Math.min(1, save * 2), transform: `scale(${Math.min(1.15, save)})` }}>
        <Gesto accion="guardar" size={84} lleno={saved > 0.5} strokeWidth={1.8} />
      </div>
      <Mono x={226} y={360} size={15} color={MUTED} style={{ opacity: EASE.out(unit(t, guarda, 0.3)) }}>
        GUÁRDALO
      </Mono>
      <div className="absolute" style={{ left: 316, top: 452, color: INK, opacity: t < comentarios - 0.1 ? 0 : Math.min(1, comment * 2), transform: `scale(${Math.min(1.15, comment)}) rotate(${Math.sin(t * 6) * 4}deg)` }}>
        <Gesto accion="comentar" size={72} strokeWidth={1.8} />
      </div>
      <div data-ui="" className="absolute flex items-center justify-center rounded-[12px] font-mono text-[24px] font-bold" style={{ left: 226, top: 560, width: 130, height: 64, color: "#FFFFFF", background: AMD, opacity: t < comentarios + 0.25 ? 0 : Math.min(1, amdBtn * 2), transform: `scale(${Math.min(1.08, amdBtn)})` }}>
        AMD
      </div>
      <div data-ui="" className="absolute flex items-center justify-center rounded-[12px] font-mono text-[24px] font-bold" style={{ left: 374, top: 560, width: 130, height: 64, color: "#FFFFFF", background: INTEL, opacity: t < comentarios + 0.4 ? 0 : Math.min(1, intelBtn * 2), transform: `scale(${Math.min(1.08, intelBtn)})` }}>
        INTEL
      </div>
      <div data-ui="" className="absolute flex items-center gap-2 rounded-full px-4 py-2 font-sans text-[20px] font-bold" style={{ left: 36, top: 520, color: "#05070A", background: ACCENT, opacity: t < sigueme + 0.1 ? 0 : Math.min(1, follow * 2), transform: `scale(${Math.min(1.08, follow)})` }}>
        Seguir
      </div>
    </Layer>
  );
}
