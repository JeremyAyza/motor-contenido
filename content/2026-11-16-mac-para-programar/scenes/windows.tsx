import type { ReactNode } from "react";
import { Icono, Logo } from "@motor/ui";
import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Check, Layer } from "../parts.tsx";
import { INK, LINE, MUTED, WIN, WIN_BLUE } from "../world.tsx";

/** One strength in Windows' card: an icon, its name, and a check when it is said. */
function Strength({ at, icon, label }: { at: number; icon: ReactNode; label: string }) {
  const t = useClock();
  const on = EASE.out(unit(t, at, 0.3));
  return (
    <div className="mt-[10px] flex items-center gap-[14px] rounded-[12px] px-[14px]" style={{ height: 64, background: "#1E222A", border: `1px solid ${on > 0.5 ? "rgba(0,120,212,0.6)" : LINE}`, opacity: 0.3 + 0.7 * on, transform: `translateX(${(1 - on) * 16}px)` }}>
      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px]" style={{ background: "#2A2F3A", color: "#6CB4F0" }}>{icon}</div>
      <span className="flex-1 text-[22px] font-semibold" style={{ color: INK }}>{label}</span>
      <Check p={on} size={26} />
    </div>
  );
}

/** Windows has its own ground: .NET, desktop apps and Windows-only software, and a real Linux inside with WSL. */
export function Windows() {
  const t = useClock();
  const net = useCue("net");
  const apps = useCue("apps");
  const solo = useCue("solo");
  const wsl = useCue("wsl");
  const verdad = useCue("verdad");
  const panel = popAt(t, 0.05);
  const box = popAt(t, wsl - 0.15);
  const tux = popAt(t, verdad - 0.35);
  return (
    <Layer>
      <div data-ui="" className="absolute rounded-[18px] px-[18px] py-[16px]" style={{ left: 116, top: 96, width: 388, height: 352, background: WIN, border: `1.5px solid rgba(0,120,212,0.5)`, opacity: Math.min(1, panel * 2), transform: `translateY(${(1 - Math.min(1, panel)) * 40}px)` }}>
        <div className="flex items-center gap-[14px]">
          <Logo slug="windows" size={48} ancla={false} />
          <span className="font-display text-[44px] font-black leading-none" style={{ color: INK }}>Windows</span>
        </div>
        <Strength at={net} icon={<Logo slug="dotnet" size={26} ancla={false} />} label=".NET" />
        <Strength at={apps} icon={<Icono name="app-window" size={24} ancla={false} />} label="Apps de escritorio" />
        <Strength at={solo} icon={<Icono name="package" size={24} ancla={false} />} label="Software solo de Windows" />
      </div>
      {box > 0 ? (
        <div data-ui="" className="absolute rounded-[18px] px-[16px] py-[12px]" style={{ left: 184, top: 470, width: 320, height: 318, background: "#101A2A", border: `1.5px solid ${WIN_BLUE}`, opacity: Math.min(1, box * 2), transform: `scale(${0.8 + 0.2 * Math.min(1.05, box)})` }}>
          <div className="flex items-center gap-[10px]">
            <Logo slug="windows" size={24} ancla={false} />
            <span className="text-[20px] font-bold" style={{ color: INK }}>Windows</span>
            <span className="ml-auto font-mono text-[18px] font-bold" style={{ color: "#6CB4F0" }}>WSL</span>
          </div>
          <div className="mt-[14px] flex flex-col items-center justify-center rounded-[14px]" style={{ height: 222, background: WIN, border: `1.5px solid ${LINE}` }}>
            <div style={{ opacity: Math.min(1, tux * 2), transform: `scale(${0.5 + 0.5 * Math.min(1.1, tux)})` }}>
              <Logo slug="linux" size={86} ancla={false} />
            </div>
            <div className="mt-[10px] text-[24px] font-bold" style={{ color: INK, opacity: Math.min(1, tux * 2) }}>Linux de verdad</div>
            <div className="text-[14px]" style={{ color: MUTED, opacity: Math.min(1, tux * 2) }}>adentro de Windows</div>
          </div>
        </div>
      ) : null}
    </Layer>
  );
}
