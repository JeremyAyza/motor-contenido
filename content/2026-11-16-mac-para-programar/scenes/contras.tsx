import { Icono } from "@motor/ui";
import { EASE, popAt, shakeAt, unit, useClock, useCue } from "@motor/video";
import { Layer, PopIn, Row, Win } from "../parts.tsx";
import { ACCENT, INK, LINE, MUTED, RED, WIN } from "../world.tsx";

/** A red cross, drawn at `p`. */
function Cross({ p, size = 22 }: { p: number; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity: Math.min(1, p * 3) }} aria-hidden>
      <circle cx="12" cy="12" r="10.5" fill="none" stroke={RED} strokeWidth="2" />
      <path d="M8 8 L16 16 M16 8 L8 16" stroke={RED} strokeWidth="2.4" strokeLinecap="round" strokeDasharray="12" strokeDashoffset={12 * (1 - Math.min(1, p))} />
    </svg>
  );
}

/** The cons: it is expensive, it cannot be upgraded after you buy it, and some software still is not native. */
export function Contras() {
  const t = useClock();
  const perfecta = useCue("perfecta");
  const cara = useCue("cara");
  const ampliar = useCue("ampliar");
  const software = useCue("software");
  const nativo = useCue("nativo");
  const warn = EASE.out(unit(t, ampliar - 0.1, 0.3));
  const shake = shakeAt(t, [ampliar], 6);
  const list = [
    { label: "Precio alto", at: cara },
    { label: "Sin ampliar después", at: ampliar },
    { label: "Software no nativo", at: nativo },
  ];
  return (
    <Layer>
      <Win x={116} y={96} w={388} h={326} title="apple.com/shop/buy-mac" at={0.05} bodyStyle={{ padding: "14px 18px" }}>
        <div className="text-[13px] font-semibold" style={{ color: MUTED }}>MacBook Pro</div>
        <div className="text-[26px] font-bold" style={{ color: INK }}>Configura</div>
        <div className="mt-[10px] flex flex-col gap-[6px]">
          <div className="rounded-[10px] px-[4px] py-[2px]" style={{ border: `1px solid ${LINE}` }}>
            <Row label="Memoria" value="24 GB unificada" accent={ACCENT} size={16} last />
          </div>
          <div className="rounded-[10px] px-[4px] py-[2px]" style={{ border: `1px solid ${LINE}` }}>
            <Row label="Almacenamiento" value="512 GB SSD" accent={ACCENT} size={16} last />
          </div>
        </div>
        <div className="mt-[14px] flex items-center gap-[10px] rounded-[10px] px-[14px] py-[10px]" style={{ background: `color-mix(in srgb, ${RED} 16%, transparent)`, border: `1.5px solid ${RED}`, opacity: warn, transform: `translateX(${shake.x}px)` }}>
          <span style={{ color: RED }}><Icono name="lock" size={22} ancla={false} /></span>
          <span className="text-[17px] font-semibold leading-tight" style={{ color: INK }}>No se puede ampliar después de la compra</span>
        </div>
      </Win>
      <PopIn x={392} y={104} at={cara - 0.1} style={{ transform: undefined }}>
        <div className="rounded-[10px] px-[14px] py-[4px] font-display text-[40px] font-black" style={{ background: RED, color: "#FFF", transform: `rotate(8deg) scale(${0.7 + 0.3 * Math.min(1.1, popAt(t, cara - 0.1))})` }}>
          $$$
        </div>
      </PopIn>
      <PopIn x={184} y={440} at={software - 0.15} origin="50% 0%">
        <div data-ui="" className="flex items-center gap-[14px] rounded-[14px] px-[16px]" style={{ width: 320, height: 104, background: WIN, border: `1px solid ${LINE}` }}>
          <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[13px]" style={{ background: "#2C3039", color: MUTED }}>
            <Icono name="app-window" size={30} ancla={false} />
          </div>
          <div className="flex-1">
            <div className="text-[18px] font-semibold leading-tight" style={{ color: INK }}>App solo para Intel</div>
            <div className="text-[14px] leading-tight" style={{ color: MUTED }}>No nativa en Apple Silicon</div>
          </div>
          <Cross p={EASE.out(unit(t, nativo, 0.35))} size={30} />
        </div>
      </PopIn>
      <PopIn x={184} y={562} at={cara - 0.3} origin="50% 0%">
        <div data-ui="" className="rounded-[16px] px-[18px] py-[14px]" style={{ width: 320, height: 226, background: `color-mix(in srgb, ${RED} 8%, ${WIN})`, border: `1.5px solid color-mix(in srgb, ${RED} 60%, transparent)` }}>
          <div className="font-mono text-[14px] font-bold tracking-[0.12em]" style={{ color: RED }}>LOS CONTRAS</div>
          {list.map((item) => (
            <div key={item.label} className="mt-[12px] flex items-center justify-between" style={{ opacity: 0.35 + 0.65 * EASE.out(unit(t, item.at, 0.3)) }}>
              <span className="text-[20px] font-semibold" style={{ color: INK }}>{item.label}</span>
              <Cross p={EASE.out(unit(t, item.at, 0.35))} size={26} />
            </div>
          ))}
        </div>
      </PopIn>
    </Layer>
  );
}
