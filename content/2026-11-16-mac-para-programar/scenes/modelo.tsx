import { Icono } from "@motor/ui";
import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Check, Layer, PopIn, Win } from "../parts.tsx";
import { GREEN, INK, LINE, MUTED, RED, WIN } from "../world.tsx";

const ROWS: Array<{ title: string; sub: string; icon: string; word: string }> = [
  { title: "Basado en Unix", sub: "zsh, ssh, git, brew", icon: "terminal", word: "unix" },
  { title: "Potente y eficiente", sub: "Apple Silicon", icon: "cpu", word: "hardware" },
  { title: "Batería todo el día", sub: "sin buscar el cargador", icon: "battery-full", word: "bateria" },
  { title: "Escritorio pulido", sub: "apps y terminal", icon: "app-window", word: "escritorio" },
  { title: "Ecosistema de Apple", sub: "Xcode, iOS, macOS", icon: "smartphone", word: "ecosistema" },
];

/** The mental model: a note that checks the five reasons one by one, then crosses out "better for everyone". */
export function Modelo() {
  const t = useClock();
  const modelo = useCue("modelo");
  const cues: Record<string, number> = { unix: useCue("unix"), hardware: useCue("hardware"), bateria: useCue("bateria"), escritorio: useCue("escritorio"), ecosistema: useCue("ecosistema") };
  const mejor = useCue("mejor");
  const todos = useCue("todos");
  const strike = EASE.inOut(unit(t, todos, 0.4));
  const x = popAt(t, todos + 0.25);
  return (
    <Layer>
      <Win x={116} y={96} w={388} h={482} title="Notas" at={Math.min(0.05, modelo - 0.5)} bodyStyle={{ padding: "12px 18px" }}>
        <div className="text-center text-[12px]" style={{ color: MUTED }}>16 de noviembre de 2026, 18:21</div>
        <div className="mt-[4px] font-display text-[32px] font-bold" style={{ color: INK }}>Modelo mental</div>
        {ROWS.map((row) => {
          const on = EASE.out(unit(t, cues[row.word], 0.3));
          return (
            <div key={row.title} className="mt-[8px] flex items-center gap-[12px] rounded-[12px] px-[12px]" style={{ height: 62, background: on > 0 ? `color-mix(in srgb, ${GREEN} ${Math.round(on * 14)}%, #1E222A)` : "#1E222A", border: `1.5px solid ${on > 0.5 ? GREEN : LINE}` }}>
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[9px]" style={{ background: "#2A2F3A", color: on > 0.5 ? GREEN : MUTED }}>
                <Icono name={row.icon} size={22} ancla={false} />
              </div>
              <div className="flex-1">
                <div className="text-[19px] font-semibold leading-tight" style={{ color: on > 0.5 ? INK : MUTED }}>{row.title}</div>
                <div className="text-[13px] leading-tight" style={{ color: MUTED }}>{row.sub}</div>
              </div>
              <Check p={on} size={26} />
            </div>
          );
        })}
      </Win>
      <PopIn x={184} y={600} at={mejor - 0.2} origin="50% 0%">
        <div className="relative flex items-center gap-[14px] rounded-[16px] px-[18px]" style={{ width: 320, height: 110, background: WIN, border: `1.5px solid ${strike > 0.5 ? RED : LINE}` }}>
          <span className="relative font-display text-[30px] font-bold" style={{ color: strike > 0.5 ? MUTED : INK }}>
            ¿Mejor para todos?
            <span className="absolute left-0 top-1/2 h-[4px] rounded-full" style={{ width: `${strike * 100}%`, background: RED, transform: "translateY(-50%)" }} />
          </span>
          <svg width={34} height={34} viewBox="0 0 24 24" style={{ opacity: Math.min(1, x * 2), transform: `scale(${0.5 + 0.5 * Math.min(1.1, x)})` }} aria-hidden>
            <circle cx="12" cy="12" r="10.5" fill={RED} />
            <path d="M8 8 L16 16 M16 8 L8 16" stroke="#FFF" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
        </div>
      </PopIn>
    </Layer>
  );
}
