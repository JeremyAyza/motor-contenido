import type { ReactNode } from "react";
import { Icono, Logo } from "@motor/ui";
import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Check, Layer } from "../parts.tsx";
import { GREEN, INK, LINE, MUTED, WIN } from "../world.tsx";

const TUX = "#FCC624";

/** One of Linux's strengths, lit when it is said. */
function Strength({ at, icon, label, sub }: { at: number; icon: ReactNode; label: string; sub?: string }) {
  const t = useClock();
  const on = EASE.out(unit(t, at, 0.3));
  return (
    <div className="mt-[8px] flex items-center gap-[14px] rounded-[12px] px-[14px]" style={{ height: 58, background: "#1E222A", border: `1px solid ${on > 0.5 ? "rgba(252,198,36,0.6)" : LINE}`, opacity: 0.3 + 0.7 * on, transform: `translateX(${(1 - on) * 16}px)` }}>
      <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[9px]" style={{ background: "#2A2F3A", color: TUX }}>{icon}</div>
      <div className="flex-1">
        <div className="text-[20px] font-semibold leading-tight" style={{ color: INK }}>{label}</div>
        {sub ? <div className="text-[13px] leading-tight" style={{ color: MUTED }}>{sub}</div> : null}
      </div>
      <Check p={on} size={24} />
    </div>
  );
}

/** A server rack with blinking lights. */
function Rack({ x, t, seed }: { x: number; t: number; seed: number }) {
  return (
    <div className="absolute rounded-[8px] p-[6px]" style={{ left: x, top: 0, width: 92, height: 150, background: "#171A20", border: `1px solid ${LINE}` }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const blink = Math.sin(t * (3 + ((seed + i) % 4)) + i * 1.7 + seed) > 0.2;
        return (
          <div key={i} className="mb-[5px] flex h-[22px] items-center gap-[4px] rounded-[4px] px-[6px]" style={{ background: "#232731" }}>
            <i className="block h-[5px] w-[5px] rounded-full" style={{ background: blink ? GREEN : "#2E5A36" }} />
            <i className="block h-[5px] w-[5px] rounded-full" style={{ background: (i + seed) % 3 === 0 && blink ? TUX : "#4A4A3A" }} />
            <div className="ml-auto h-[3px] w-[34px] rounded-full" style={{ background: "#323744" }} />
          </div>
        );
      })}
    </div>
  );
}

/** Linux rules servers and infrastructure, and the developers who want full control love it. */
export function Linux() {
  const t = useClock();
  const servidores = useCue("servidores");
  const infraestructura = useCue("infraestructura");
  const adoran = useCue("adoran");
  const control = useCue("control");
  const panel = popAt(t, 0.05);
  const racks = EASE.out(unit(t, servidores - 0.2, 0.4));
  return (
    <Layer>
      <div data-ui="" className="absolute flex items-center gap-[12px] rounded-[14px] px-[14px]" style={{ left: 116, top: 96, width: 388, height: 64, background: WIN, border: "1px solid rgba(0,120,212,0.4)", opacity: 0.75 }}>
        <Logo slug="windows" size={26} ancla={false} />
        <span className="text-[20px] font-bold" style={{ color: INK }}>Windows</span>
        <span className="ml-auto font-mono text-[13px]" style={{ color: MUTED }}>.NET · Escritorio · WSL</span>
      </div>
      <div data-ui="" className="absolute rounded-[18px] px-[18px] py-[14px]" style={{ left: 116, top: 176, width: 388, height: 362, background: WIN, border: `1.5px solid rgba(252,198,36,0.5)`, opacity: Math.min(1, panel * 2), transform: `translateX(${(1 - Math.min(1, panel)) * 120}px)` }}>
        <div className="flex items-center gap-[14px]">
          <Logo slug="linux" size={46} ancla={false} />
          <span className="font-display text-[44px] font-black leading-none" style={{ color: INK }}>Linux</span>
        </div>
        <Strength at={servidores} icon={<Icono name="server" size={22} ancla={false} />} label="Servidores" />
        <Strength at={infraestructura} icon={<Icono name="network" size={22} ancla={false} />} label="Infraestructura" />
        <Strength at={adoran} icon={<Icono name="heart" size={22} ancla={false} />} label="Lo adoran los devs" />
        <Strength at={control} icon={<Icono name="sliders-horizontal" size={22} ancla={false} />} label="Control total" sub="tu kernel, tus reglas" />
      </div>
      <div className="absolute" style={{ left: 196, top: 600, width: 308, height: 160, opacity: racks, transform: `translateY(${(1 - racks) * 20}px)` }}>
        <Rack x={0} t={t} seed={1} />
        <Rack x={108} t={t} seed={4} />
        <Rack x={216} t={t} seed={7} />
      </div>
    </Layer>
  );
}
