import { Gesto } from "@motor/ui";
import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Gauge, InlineMark, Layer, PanelBody, Worker } from "../parts.tsx";
import { ACCENT, BG, GO, INK, LINE, MUTED, RUST } from "../world.tsx";

/** One side of the CTA: a big button in its lane's color, with its mark. */
function TeamButton({ lang, x, y, at, pulse }: { lang: "go" | "rust"; x: number; y: number; at: number; pulse: number }) {
  const t = useClock();
  const p = popAt(t, at);
  if (p <= 0) return null;
  const color = lang === "go" ? GO : RUST;
  return (
    <div data-ui="" className="absolute flex flex-col items-center justify-center gap-[10px] rounded-[10px]" style={{ left: x, top: y, width: 196, height: 150, background: color, boxShadow: "0 6px 0 rgba(10,11,13,0.6)", transform: `translate(-50%, 0) scale(${Math.min(1, p) * (1 + 0.04 * pulse)})` }}>
      <div className="flex items-center justify-center rounded-[10px]" style={{ width: 84, height: 56, background: "#1A1C1F" }}>
        <InlineMark lang={lang} size={lang === "go" ? 58 : 50} />
      </div>
      <div className="whitespace-nowrap font-display text-[28px] font-black uppercase leading-none" style={{ color: BG }}>
        Team {lang === "go" ? "Go" : "Rust"}
      </div>
    </div>
  );
}

/**
 * The close: three gauges (speed, reliability, maintainable) rise one by
 * one as the voice names them, over a mixed crowd of teal and rust workers;
 * the panel sums up the choice. On "Comenta" the gauges make room for the
 * CTA: two big buttons, TEAM GO and TEAM RUST, with the comment gesture
 * between them, pulsing in turn.
 */
export function Cierre() {
  const t = useClock();
  const distintos = useCue("distintos.");
  const velocidad = useCue("velocidad:");
  const confiabilidad = useCue("confiabilidad");
  const mantenerlo = useCue("mantenerlo.");
  const comenta = useCue("Comenta");
  const teamGo = useCue("¿Team");
  const gaugesOut = EASE.in(unit(t, comenta - 0.3, 0.3));
  const crowd = EASE.out(unit(t, 0, 0.5));
  const beat = Math.floor((t - teamGo) / 0.6);
  return (
    <Layer>
      <div style={{ opacity: 1 - gaugesOut }}>
        <Gauge x={110} y={190} r={52} label="velocidad" at={velocidad} />
        <Gauge x={270} y={190} r={52} label="confiabilidad" at={confiabilidad} />
        <Gauge x={430} y={190} r={52} label="mantenimiento" at={mantenerlo} />
        {Array.from({ length: 9 }).map((_, i) => (
          <Worker key={i} x={70 + i * 50} y={420} s={1.1} color={i % 2 ? RUST : GO} opacity={crowd} />
        ))}
      </div>
      {t >= comenta - 0.2 ? (
        <>
          <TeamButton lang="go" x={150} y={170} at={comenta} pulse={t >= teamGo && beat % 2 === 0 ? 1 : 0} />
          <TeamButton lang="rust" x={390} y={170} at={comenta + 0.2} pulse={t >= teamGo && beat % 2 === 1 ? 1 : 0} />
          <div className="absolute flex items-center justify-center rounded-full" style={{ left: 270, top: 245, width: 64, height: 64, transform: `translate(-50%, -50%) scale(${Math.min(1, popAt(t, comenta + 0.4))})`, background: ACCENT, boxShadow: "0 4px 0 rgba(10,11,13,0.6)" }}>
            <Gesto accion="comentar" size={34} style={{ color: BG }} />
          </div>
          <div className="absolute left-[36px] right-[36px] text-center font-display text-[30px] font-black leading-[1.05]" style={{ top: 356, color: INK, opacity: EASE.out(unit(t, comenta + 0.3, 0.3)) }}>
            Comenta tu bando
          </div>
          <div data-ui="" className="absolute left-[36px] right-[36px] text-center font-mono text-[13px] font-bold" style={{ top: 398, color: ACCENT, opacity: EASE.out(unit(t, comenta + 0.6, 0.3)) }}>
            y defiéndelo en una línea
          </div>
        </>
      ) : null}
      <PanelBody at={0}>
        <div className="flex items-center gap-[8px]" style={{ opacity: EASE.out(unit(t, 0.2, 0.3)) }}>
          <div className="flex w-[40px] justify-center">
            <InlineMark lang="go" size={36} />
          </div>
          <div>
            <div className="font-mono text-[14px] font-bold" style={{ color: GO }}>simple, productivo</div>
            <div className="font-mono text-[12px]" style={{ color: MUTED }}>un equipo barre por ti</div>
          </div>
        </div>
        <div className="mt-[14px] flex items-center gap-[8px]" style={{ opacity: EASE.out(unit(t, distintos - 0.8, 0.3)) }}>
          <div className="flex w-[40px] justify-center">
            <InlineMark lang="rust" size={34} />
          </div>
          <div>
            <div className="font-mono text-[14px] font-bold" style={{ color: RUST }}>en control, predecible</div>
            <div className="font-mono text-[12px]" style={{ color: MUTED }}>una aduana revisa primero</div>
          </div>
        </div>
        <div className="mt-[16px] pt-[10px] font-display text-[22px] font-black leading-[1.1]" style={{ color: INK, borderTop: `1px solid ${LINE}`, opacity: EASE.out(unit(t, velocidad - 0.6, 0.3)) }}>
          rápido nunca es
          <br />
          solo velocidad
        </div>
      </PanelBody>
    </Layer>
  );
}
