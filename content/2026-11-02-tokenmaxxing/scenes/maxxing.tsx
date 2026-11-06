import { EASE, lerp, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Layer, LevelSplash, Source } from "../parts.tsx";
import { ACCENT, INK, RED, TOKEN } from "../world.tsx";

/** The word snaps together from its two pieces, the dictionary says what -maxxing means, and the gauge hits MAX. */
export function Maxxing() {
  const t = useClock();
  const snapAt = 1.5;
  const jerga = useCue("jerga");
  const maximo = useCue("máximo");
  const gasto = useCue("gasto");
  const snap = EASE.back(unit(t, snapAt, 0.45));
  const needle = t < maximo ? -90 + Math.sin(t * 3) * 6 : -90 + 180 * Math.min(1.04, popAt(t, maximo)) - (t > maximo + 0.6 ? 4 : 0);
  return (
    <Layer>
      <LevelSplash n={3} name="La moda" until={1.4} />
      {t >= snapAt ? (
        <div className="absolute flex justify-center font-display font-black" style={{ left: 36, top: 184, width: 468, fontSize: 56, lineHeight: 1 }}>
          {/* The pieces drop in from above and below and close the gap: they never leave the margin. */}
          <span className="rounded-l-2xl" style={{ padding: "6px 4px 10px 14px", background: TOKEN, color: "#120E1F", transform: `translate(${lerp(-14, 0, snap)}px, ${lerp(-70, 0, snap)}px)`, opacity: Math.min(1, snap * 3) }}>
            token
          </span>
          <span className="rounded-r-2xl" style={{ padding: "6px 14px 10px 4px", background: ACCENT, color: "#120E1F", transform: `translate(${lerp(14, 0, snap)}px, ${lerp(70, 0, snap)}px)`, opacity: Math.min(1, snap * 3) }}>
            maxxing
          </span>
        </div>
      ) : null}
      <Card at={jerga - 0.2} y={290} h={226} label="Diccionario · jerga de internet">
        <div className="font-display font-black" style={{ fontSize: 40, color: INK, lineHeight: 1 }}>
          -maxxing
        </div>
        <div className="font-sans" style={{ fontSize: 24, color: INK, marginTop: 14, lineHeight: 1.2 }}>
          Llevar algo <span style={{ color: TOKEN, fontWeight: 800 }}>al máximo</span>.
        </div>
        <div className="absolute rounded-lg font-mono font-bold uppercase" style={{ right: 16, top: 52, padding: "6px 10px", fontSize: 13, letterSpacing: "0.08em", border: `2px solid ${ACCENT}`, color: ACCENT, transform: `rotate(6deg) scale(${Math.min(1, popAt(t, jerga + 0.8))})` }}>
          Palabra del año 2026
        </div>
      </Card>
      <Source at={jerga} y={524}>
        Dictionary.com, oct 2026
      </Source>
      {t >= maximo - 0.4 ? (
        <div className="absolute" style={{ left: 120, top: 566, width: 300, opacity: Math.min(1, popAt(t, maximo - 0.4) * 2) }}>
          <svg width={300} height={170} viewBox="0 0 300 170" aria-hidden style={{ overflow: "visible" }}>
            <path d="M 20 150 A 130 130 0 0 1 280 150" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={22} />
            <path d="M 20 150 A 130 130 0 0 1 280 150" fill="none" stroke={TOKEN} strokeWidth={22} strokeDasharray={`${408 * Math.max(0, (needle + 90) / 180)} 9999`} />
            <g transform={`rotate(${needle} 150 150)`}>
              <path d="M 146 150 L 150 36 L 154 150 Z" fill={INK} />
            </g>
            <circle cx={150} cy={150} r={12} fill={INK} />
          </svg>
          <div data-ui="" className="absolute font-mono font-bold uppercase" style={{ right: -8, top: 150, fontSize: 18, color: needle > 80 ? RED : "var(--piece-muted)" }}>
            MAX
          </div>
          {t >= gasto ? (
            <div data-ui="" className="text-center font-mono font-bold uppercase" style={{ fontSize: 16, letterSpacing: "0.12em", color: TOKEN, marginTop: 4 }}>
              Gasto en tokens
            </div>
          ) : null}
        </div>
      ) : null}
    </Layer>
  );
}
