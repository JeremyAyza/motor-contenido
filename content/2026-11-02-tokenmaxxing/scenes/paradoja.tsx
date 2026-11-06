import { EASE, fade, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Layer, Title } from "../parts.tsx";
import { ACCENT, INK, RED, TOKEN } from "../world.tsx";

/** A made-up team of 40 devs: tokens against work shipped, with no trend. */
const DOTS = Array.from({ length: 40 }, (_, i) => ({ x: ((i * 61) % 97) / 97, y: ((i * 37 + 11) % 89) / 89 }));

/** The paradox: dots fall like coins and stay scattered; a trend line tries to draw itself and gets erased. */
export function Paradoja() {
  const t = useClock();
  const quemar = useCue("quemar");
  const pero = useCue("Pero");
  const line = EASE.out(unit(t, pero, 0.7));
  const erase = fade(t, pero + 1.1, 0.4);
  const W = 400;
  const H = 300;
  return (
    <Layer>
      {/* The chapter bar already says "La paradoja": the title alone, in 4 words, so the screen stays at 6 with the note. */}
      <Title at={0.15} y={214} size={46}>
        Más <span style={{ color: TOKEN }}>fichas</span> ≠ más <span style={{ color: ACCENT }}>trabajo</span>
      </Title>
      <Card at={0.3} y={330} h={410} label="Ejemplo ilustrativo · 40 devs">
        <div className="relative" style={{ width: W, height: H, marginLeft: 20, marginTop: 4 }}>
          <div className="absolute" style={{ left: 0, top: 0, width: 3, height: H, background: "rgba(255,255,255,0.3)" }} />
          <div className="absolute" style={{ left: 0, top: H, width: W, height: 3, background: "rgba(255,255,255,0.3)" }} />
          {DOTS.map((d, i) => {
            // The first dots drop from the start, so the chart is never empty; the rest pour in on "quemar".
            const at = i < 12 ? 0.3 + i * 0.12 : quemar - 0.3 + (i - 12) * 0.04;
            if (t < at) return null;
            const k = EASE.in(unit(t, at, 0.4));
            return <div key={i} className="absolute rounded-full" style={{ left: 10 + d.x * (W - 30), top: (1 - d.y) * (H - 20) * k, width: 16, height: 16, background: i % 3 ? TOKEN : ACCENT, opacity: 0.9, transform: `scale(${Math.min(1, popAt(t, at + 0.4) * 0.3 + 0.7)})` }} />;
          })}
          {t >= pero ? (
            <svg className="absolute" width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ left: 0, top: 0, opacity: 1 - erase }} aria-hidden>
              <path d={`M 10 ${H - 10} L ${10 + (W - 20) * line} ${H - 10 - (H - 40) * line}`} stroke={INK} strokeWidth={5} strokeDasharray="12 10" strokeLinecap="round" />
            </svg>
          ) : null}
          {erase > 0 ? (
            <svg className="absolute" width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ left: 0, top: 0 }} aria-hidden>
              <path d="M 170 120 L 230 180 M 230 120 L 170 180" stroke={RED} strokeWidth={9} strokeLinecap="round" opacity={Math.min(1, erase * 2)} />
            </svg>
          ) : null}
        </div>
        <div data-ui="" className="flex justify-between font-mono font-bold uppercase" style={{ fontSize: 14, letterSpacing: "0.12em", marginTop: 14, marginLeft: 20, width: W }}>
          <span style={{ color: ACCENT }}>↑ Entregado</span>
          <span style={{ color: TOKEN }}>Fichas →</span>
        </div>
      </Card>
    </Layer>
  );
}
