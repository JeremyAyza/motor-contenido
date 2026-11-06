import { Logo } from "@motor/ui";
import { EASE, es, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Layer, PixelFace, Source } from "../parts.tsx";
import { ACCENT, INK, TOKEN } from "../world.tsx";

/**
 * Meta's internal table (Fortune, 9 April 2026): the top 250 out of more
 * than 85,000 employees, and the first one with 281 billion tokens in 30 days.
 * The other rows are hidden: the source does not give them.
 */
export function Tablas() {
  const t = useClock();
  const persona = useCue("persona");
  const meta = useCue("Meta");
  const top = useCue("doscientos");
  const gastaban = useCue("gastaban");
  const ochenta = useCue("Entre");
  const primero = useCue("primero");
  const count = EASE.out(unit(t, primero, 2.4));
  const lit = t >= primero;
  const dots = 34 * 25;
  return (
    <Layer>
      <Card at={0.1} y={176} h={322} label="Tabla interna de tokens" border={TOKEN}>
        {/* The logo and the TOP 250 tag sit on the label's row, so nothing covers the figures below. */}
        {t >= top ? (
          <div className="absolute rounded-md font-display font-black" style={{ right: 58, top: 8, padding: "2px 8px", fontSize: 20, background: TOKEN, color: "#120E1F", transform: `rotate(-3deg) scale(${Math.min(1, popAt(t, top))})` }}>
            TOP 250
          </div>
        ) : null}
        {t >= meta ? (
          <div className="absolute" style={{ right: 14, top: 7, transform: `scale(${Math.min(1, popAt(t, meta))})` }}>
            <Logo slug="meta" size={22} chip="#FFFFFF" ancla={false} />
          </div>
        ) : null}
        <div className="flex flex-col" style={{ gap: 8, marginTop: 6 }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const p = Math.min(1, popAt(t, 0.25 + i * 0.12));
            const first = i === 0;
            return (
              <div
                key={i}
                className="flex items-center rounded-xl"
                style={{ gap: 12, height: 44, padding: "0 10px", opacity: p, transform: `translateX(${(1 - p) * 40}px)`, background: first && lit ? "rgba(255,79,154,0.18)" : "rgba(255,255,255,0.04)", border: first && lit ? `2px solid ${TOKEN}` : "2px solid transparent" }}
              >
                <span className="font-mono font-bold" style={{ fontSize: 20, width: 26, color: first ? ACCENT : "var(--piece-muted)" }}>
                  {i + 1}
                </span>
                <PixelFace seed={i * 7 + 2} size={30} color={first ? TOKEN : "#8C84A8"} />
                <span className="flex-1 font-sans font-bold" style={{ fontSize: 18, color: INK }}>
                  Empleado
                </span>
                {first ? (
                  <span className="font-mono font-bold tabular-nums" style={{ fontSize: 18, color: TOKEN }}>
                    {lit ? es(Math.round(281_000_000_000 * count)) : "▒▒▒▒▒"}
                  </span>
                ) : (
                  // A scan runs down the hidden values when the voice says "gastaban": they stay hidden.
                  <span className="font-mono" style={{ fontSize: 18, color: t >= gastaban + i * 0.15 && t < gastaban + i * 0.15 + 0.5 ? TOKEN : "rgba(255,255,255,0.25)" }}>
                    ▒▒▒▒▒
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      {/* The people fill in as "por persona" is said; the top 250 light on "doscientos"; the scale shows on "Entre". */}
      {t >= persona ? (
        <div data-ui="" className="absolute" style={{ left: 36, top: 516, width: 468 }}>
          <div className="relative" style={{ height: 175 }}>
            {Array.from({ length: dots }, (_, i) => {
              const x = (i % 34) * 13.8;
              const y = Math.floor(i / 34) * 7;
              const on = t >= persona + (i / dots) * 1.2;
              const best = i === 0 || i === 1 || i === 2;
              const glow = best && t >= top;
              return <div key={i} className="absolute rounded-full" style={{ left: x, top: y, width: 5, height: 5, background: glow ? TOKEN : t >= ochenta ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.16)", opacity: on ? 1 : 0, boxShadow: glow ? `0 0 8px ${TOKEN}` : undefined, transform: glow ? `scale(${1 + 0.6 * Math.abs(Math.sin(t * 4))})` : undefined }} />;
            })}
          </div>
          <div className="flex justify-between font-mono uppercase" style={{ fontSize: 15, letterSpacing: "0.08em", color: "var(--piece-muted)", marginTop: 6, opacity: t >= ochenta ? 1 : 0 }}>
            <span>1 punto = 100 empleados</span>
            <span style={{ color: TOKEN }}>● top 250</span>
          </div>
        </div>
      ) : null}
      <Source at={meta} y={744}>
        Fortune, 9 abr 2026
      </Source>
    </Layer>
  );
}
