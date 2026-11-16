import type { ReactNode } from "react";
import { Icono } from "@motor/ui";
import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Check, Layer, PopIn, Row, White, Win } from "../parts.tsx";
import { ACCENT, GREEN, INK, LINE, MUTED, WIN } from "../world.tsx";

/** A macOS notification: an icon, a device and its state. */
function Toast({ y, at, icon, title, sub }: { y: number; at: number; icon: ReactNode; title: string; sub: string }) {
  return (
    <PopIn x={184} y={y} at={at} origin="100% 0%">
      <div data-ui="" className="flex items-center gap-[12px] rounded-[14px] px-[12px]" style={{ width: 320, height: 58, background: `color-mix(in srgb, ${WIN} 94%, transparent)`, border: `1px solid ${LINE}`, boxShadow: "0 10px 26px rgba(0,0,0,0.45)" }}>
        <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[9px]" style={{ background: "#2C3039", color: INK }}>{icon}</div>
        <div>
          <div className="text-[16px] font-semibold leading-tight" style={{ color: INK }}>{title}</div>
          <div className="text-[13px] leading-tight" style={{ color: MUTED }}>{sub}</div>
        </div>
        <span className="ml-auto text-[12px]" style={{ color: MUTED }}>ahora</span>
      </div>
    </PopIn>
  );
}

/** Consistency: Apple makes the software and the hardware, so things fit and there is nothing to install. */
export function Control() {
  const t = useClock();
  const coherencia = useCue("coherencia");
  const controla = useCue("controla");
  const software = useCue("software");
  const hardware = useCue("hardware");
  const encaja = useCue("encaja");
  const problemas = useCue("problemas");
  const compatibilidad = useCue("compatibilidad");
  const link = EASE.inOut(unit(t, controla, 0.5));
  const none = popAt(t, compatibilidad - 0.2);
  return (
    <Layer>
      <Win x={116} y={96} w={388} h={196} title="Acerca de esta Mac" at={Math.min(0.05, coherencia - 0.3)} bodyStyle={{ padding: "16px 18px 0 64px" }}>
        <div className="absolute" style={{ left: 18, top: 70, opacity: link }}>
          <White slug="apple" size={30} />
        </div>
        <svg className="absolute" width={24} height={110} style={{ left: 44, top: 44 }} aria-hidden>
          <path d="M 22 8 L 6 8 L 6 102 L 22 102" fill="none" stroke={ACCENT} strokeWidth={2.5} strokeDasharray="160" strokeDashoffset={160 * (1 - link)} />
        </svg>
        <div className="flex flex-col gap-[14px]">
          <div>
            <div className="text-[12px] font-semibold" style={{ color: MUTED }}>Software</div>
            <Row label="macOS" value="Sequoia" lit={EASE.out(unit(t, software, 0.3))} accent={ACCENT} size={18} last />
          </div>
          <div>
            <div className="text-[12px] font-semibold" style={{ color: MUTED }}>Hardware</div>
            <Row label="Chip" value="Apple M4 Pro" lit={EASE.out(unit(t, hardware, 0.3))} accent={ACCENT} size={18} last />
          </div>
        </div>
      </Win>
      <Toast y={308} at={encaja - 0.1} icon={<Icono name="headphones" size={20} ancla={false} />} title="AirPods Pro" sub="Conectados" />
      <Toast y={374} at={encaja + 0.25} icon={<Icono name="monitor" size={20} ancla={false} />} title="Studio Display" sub="Conectado, sin configurar" />
      <Win x={184} y={448} w={320} h={342} title="Actualización de software" at={hardware - 0.2} bodyStyle={{ padding: "18px 18px" }}>
        <div className="flex flex-col items-center">
          <Check p={EASE.out(unit(t, encaja, 0.5))} size={70} />
          <div className="mt-[8px] text-[22px] font-bold" style={{ color: INK }}>Tu Mac está al día</div>
          <div className="text-[14px]" style={{ color: MUTED }}>macOS Sequoia 15.4</div>
        </div>
        <div className="mt-[16px] rounded-[12px] px-[16px] py-[10px]" style={{ border: `1px solid ${LINE}`, background: "#14171D", opacity: EASE.out(unit(t, problemas - 0.2, 0.3)) }}>
          <div className="text-[14px]" style={{ color: MUTED }}>Drivers por instalar</div>
          <div className="font-display text-[44px] font-black leading-none" style={{ color: GREEN, opacity: Math.min(1, none * 2), transform: `scale(${0.6 + 0.4 * Math.min(1.1, none)})`, transformOrigin: "0% 50%" }}>
            ninguno
          </div>
        </div>
      </Win>
    </Layer>
  );
}
