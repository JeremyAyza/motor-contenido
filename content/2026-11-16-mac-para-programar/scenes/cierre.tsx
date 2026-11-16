import type { ReactNode } from "react";
import { Gesto, Logo } from "@motor/ui";
import { EASE, bump, fade, popAt, unit, useClock, useCue } from "@motor/video";
import { Check, Layer, White } from "../parts.tsx";
import { ACCENT, INK, LINE, MUTED, WIN } from "../world.tsx";

/** One of the three systems, equal: its mark, its name and "great software". */
function System({ x, at, lit, mark, name }: { x: number; at: number; lit: number; mark: ReactNode; name: string }) {
  const t = useClock();
  const p = popAt(t, at);
  const on = EASE.out(unit(t, lit - 0.1, 0.3));
  return (
    <div data-ui="" className="absolute flex flex-col items-center rounded-[16px] pt-[22px]" style={{ left: x, top: 150, width: 120, height: 210, background: WIN, border: `1.5px solid ${on > 0.5 ? ACCENT : LINE}`, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - Math.min(1, p)) * 40}px)` }}>
      {mark}
      <div className="mt-[14px] text-[20px] font-bold" style={{ color: INK }}>{name}</div>
      <div className="mt-[4px] text-[13px]" style={{ color: MUTED }}>Gran software</div>
    </div>
  );
}

const FITS: Array<{ label: string; word: string }> = [
  { label: "Tus herramientas", word: "herramientas" },
  { label: "Tu forma de trabajar", word: "forma" },
  { label: "Lo que construyes", word: "construyes" },
];

/** The close: three systems with great software, the one that fits your three questions, and the save-or-send ask. */
export function Cierre() {
  const t = useClock();
  const windows = useCue("windows");
  const linux = useCue("linux");
  const macos = useCue("macos");
  const mejor = useCue("mejor");
  const fits: Record<string, number> = { herramientas: useCue("herramientas"), forma: useCue("forma"), construyes: useCue("construyes") };
  const mac = useCue("mac");
  const comprarte = useCue("comprarte");
  const guardalo = useCue("guardalo");
  const enviaselo = useCue("enviaselo");
  const systems = 1 - fade(t, mejor - 0.25, 0.25);
  const list = EASE.out(unit(t, mejor - 0.05, 0.35));
  const verdict = fade(t, mac - 0.1, 0.25);
  const cta = popAt(t, comprarte - 0.2);
  const saved = unit(t, guardalo, 0.2);
  const sent = unit(t, enviaselo, 0.2);
  const fly = EASE.in(unit(t, enviaselo + 0.15, 0.5));
  const macCard = popAt(t, useCue("mac", 2) - 0.05);
  const winCard = popAt(t, useCue("windows", 2) - 0.05);
  const both = fade(t, useCue("mac", 2) - 0.1, 0.15);
  return (
    <Layer>
      {systems > 0 ? (
        <div className="absolute inset-0" style={{ opacity: systems }}>
          <System x={116} at={0} lit={windows} mark={<Logo slug="windows" size={60} ancla={false} />} name="Windows" />
          <System x={250} at={0.12} lit={linux} mark={<Logo slug="linux" size={60} ancla={false} />} name="Linux" />
          <System x={384} at={0.24} lit={macos} mark={<White slug="apple" size={60} />} name="macOS" />
        </div>
      ) : null}
      {list > 0 ? (
        <div className="absolute inset-0" style={{ opacity: list }}>
          <div className="absolute font-display font-black leading-[1.02] tracking-tight" style={{ left: 116, top: 98, width: 388, fontSize: 48, color: INK }}>
            <span style={{ opacity: 1 - verdict, position: "absolute", left: 0, top: 0, whiteSpace: "nowrap" }}>El que encaja</span>
            <span className="flex items-center gap-[10px]" style={{ opacity: verdict, position: "absolute", left: 0, top: 6, whiteSpace: "nowrap", fontSize: 38 }}>
              Para muchos:
              <span style={{ color: ACCENT }}>3 de 3</span>
            </span>
          </div>
          <div data-ui="" className="absolute rounded-[16px] px-[14px] py-[6px]" style={{ left: 116, top: 170, width: 388, background: WIN, border: `1px solid ${LINE}`, transform: `translateY(${(1 - list) * 20}px)` }}>
            {FITS.map((f, i) => {
              const on = EASE.out(unit(t, fits[f.word], 0.3));
              const apple = popAt(t, mac + 0.1 + i * 0.22);
              return (
                <div key={f.label} className="flex items-center gap-[12px] py-[10px]" style={{ borderBottom: i < 2 ? `1px solid ${LINE}` : "none", opacity: 0.35 + 0.65 * on }}>
                  <span className="flex-1 text-[22px] font-semibold" style={{ color: INK }}>{f.label}</span>
                  <div style={{ opacity: Math.min(1, apple * 2), transform: `scale(${0.4 + 0.6 * Math.min(1.1, apple)})` }}>
                    <White slug="apple" size={20} />
                  </div>
                  <Check p={on} size={28} />
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      {cta > 0 ? (
        <div className="absolute rounded-[20px] px-[20px] py-[16px]" style={{ left: 184, top: 468, width: 320, height: 318, background: `color-mix(in srgb, ${ACCENT} 10%, ${WIN})`, border: `1.5px solid ${ACCENT}`, opacity: Math.min(1, cta * 2), transform: `translateY(${(1 - Math.min(1, cta)) * 50}px)` }}>
          <div className="flex justify-center">
            <svg width={190} height={108} viewBox="0 0 190 108" aria-hidden>
              <rect x="24" y="4" width="142" height="88" rx="7" fill="#1A1D24" stroke={INK} strokeWidth="2.5" />
              <rect x="32" y="12" width="126" height="72" rx="3" fill="#0E1015" />
              <g opacity={1 - both}>
                <polyline points="44,30 52,37 44,44" fill="none" stroke={ACCENT} strokeWidth="2.5" />
                <rect x="58" y="31" width="9" height="14" fill={INK} opacity={Math.sin(t * 6) > 0 ? 1 : 0} />
              </g>
              <path d="M4 94 L186 94 L180 104 Q179 106 176 106 L14 106 Q11 106 10 104 Z" fill="none" stroke={INK} strokeWidth="2.5" />
            </svg>
          </div>
          {/* Back to the hook: Mac and Windows side by side on the laptop's screen when the voice says them. */}
          <div className="absolute flex items-center justify-center gap-[22px]" style={{ left: 20, top: 30, width: 280, height: 70 }}>
            <div style={{ opacity: Math.min(1, macCard * 2), transform: `scale(${0.4 + 0.6 * Math.min(1.1, macCard)})` }}>
              <White slug="apple" size={34} />
            </div>
            <div style={{ opacity: Math.min(1, winCard * 2), transform: `scale(${0.4 + 0.6 * Math.min(1.1, winCard)})` }}>
              <Logo slug="windows" size={30} ancla={false} />
            </div>
          </div>
          <div data-ui="" className="mt-[18px] flex justify-between gap-[14px]">
            <div className="flex flex-1 flex-col items-center rounded-[14px] py-[14px]" style={{ background: "#1A1D24", border: `1px solid ${saved > 0.5 ? ACCENT : LINE}`, transform: `scale(${1 + 0.1 * bump(t, guardalo, 0.35)})` }}>
              <span style={{ color: saved > 0.5 ? ACCENT : INK }}>
                <Gesto accion="guardar" size={46} lleno={saved > 0.5} />
              </span>
              <span className="mt-[8px] text-[24px] font-bold" style={{ color: INK }}>Guárdalo</span>
            </div>
            <div className="flex flex-1 flex-col items-center rounded-[14px] py-[14px]" style={{ background: "#1A1D24", border: `1px solid ${sent > 0.5 ? ACCENT : LINE}`, transform: `scale(${1 + 0.1 * bump(t, enviaselo, 0.35)})` }}>
              <span style={{ color: sent > 0.5 ? ACCENT : INK, transform: `translate(${fly * 30}px, ${-fly * 30}px)`, opacity: 1 - 0.6 * fly, display: "block" }}>
                <Gesto accion="enviar" size={46} lleno={sent > 0.5} />
              </span>
              <span className="mt-[8px] text-[24px] font-bold" style={{ color: INK }}>Envíaselo</span>
            </div>
          </div>
        </div>
      ) : null}
    </Layer>
  );
}
