import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Coin, Layer, PixelFace, Source, Stamp, Title, usePresence } from "../parts.tsx";
import { ACCENT, INK, TOKEN } from "../world.tsx";

/** The slot of the cabinet: coins fall into it without stopping, faster each time the voice raises the stakes. */
function Slot({ t, shake }: { t: number; shake: number }) {
  return (
    <svg className="absolute" width={300} height={300} viewBox="0 0 300 300" style={{ left: 120, top: 440, overflow: "visible", transform: `translateX(${shake}px)` }} aria-hidden>
      <rect x={10} y={0} width={280} height={300} rx={26} fill="var(--piece-surface)" stroke={TOKEN} strokeWidth={3} />
      <rect x={30} y={22} width={240} height={40} rx={10} fill={TOKEN} opacity={0.85 + 0.15 * Math.sin(t * 8)} />
      <rect x={95} y={100} width={110} height={18} rx={9} fill="#05030A" stroke={INK} strokeOpacity={0.4} strokeWidth={2} />
      <rect x={112} y={200} width={76} height={56} rx={10} fill="#05030A" stroke={INK} strokeOpacity={0.25} strokeWidth={2} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={60 + i * 18} cy={232} r={6} fill={i === Math.floor(t * 3) % 3 ? ACCENT : "rgba(255,255,255,0.15)"} />
      ))}
    </svg>
  );
}

export function Gancho() {
  const t = useClock();
  const silicon = useCue("Silicon");
  const devs = useCue("devs");
  const millones = useCue("Millones");
  const miles = useCue("miles");
  const drops: number[] = [];
  for (let s = -0.6; s < 40; s += s < millones ? 0.42 : s < miles ? 0.18 : 0.1) drops.push(s);
  const shake = t > millones ? Math.sin(t * 50) * (t > miles ? 3 : 1.5) : 0;
  const city = usePresence(silicon);
  const label = usePresence(-1, silicon - 0.15);
  return (
    <Layer>
      {label.on ? (
        <>
          <Title at={-1} until={silicon - 0.15} y={196} size={52}>
            La moda en Meta: <span style={{ color: TOKEN }}>quemar tokens</span>
          </Title>
          <div style={{ opacity: label.o }}>
            <Source at={-1} x={150} y={316}>
              Fortune, abr 2026
            </Source>
          </div>
        </>
      ) : null}
      {city.on ? (
        <div className="absolute" style={{ left: 36, top: 178, width: 468, height: 210, opacity: city.o }}>
          {[0, 1, 2, 3].map((i) => {
            const p = Math.min(1, popAt(t, silicon + i * 0.12));
            const h = [120, 170, 140, 100][i];
            return (
              <svg key={i} className="absolute" width={86} height={h} viewBox={`0 0 86 ${h}`} style={{ left: 40 + i * 100, top: 200 - h, transform: `scaleY(${p})`, transformOrigin: "50% 100%" }} aria-hidden>
                <rect width={86} height={h} rx={6} fill="var(--piece-surface)" stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
                {Array.from({ length: Math.floor((h - 20) / 22) * 3 }, (_, w) => (
                  <rect key={w} x={12 + (w % 3) * 24} y={14 + Math.floor(w / 3) * 22} width={14} height={10} fill={(w + i + Math.floor(t * 2)) % 4 === 0 ? TOKEN : "rgba(255,255,255,0.12)"} />
                ))}
              </svg>
            );
          })}
          <div data-ui="" className="absolute flex items-center rounded-full font-mono font-bold uppercase" style={{ left: 150, top: 6, gap: 8, padding: "6px 14px", fontSize: 16, letterSpacing: "0.12em", background: TOKEN, color: "#120E1F", transform: `scale(${Math.min(1, popAt(t, silicon + 0.3))})` }}>
            ● Silicon Valley
          </div>
        </div>
      ) : null}
      {[0, 1, 2, 3, 4].map((i) => {
        const p = Math.min(1, popAt(t, devs + i * 0.1));
        if (t < devs) return null;
        return (
          <div key={i} className="absolute" style={{ left: 104 + i * 70, top: 392, transform: `translateY(${(1 - p) * 20}px) scale(${p})` }}>
            <PixelFace seed={i + 3} size={44} color={i % 2 ? ACCENT : TOKEN} />
          </div>
        );
      })}
      <Slot t={t} shake={shake} />
      {drops.map((s, i) => {
        const k = unit(t, s, 0.5);
        if (t < s || k >= 1) return null;
        const x = 270 + ((i * 37) % 60) - 30;
        // While the hook is on, coins start under it so they never cross its letters.
        const y0 = s < silicon ? 360 : 250;
        return (
          <div key={i} className="absolute" style={{ left: x - 18, top: y0 + EASE.in(k) * (540 - y0) - 18, transform: `scaleX(${Math.abs(Math.cos((t - s) * 9)) * 0.6 + 0.4})` }}>
            <Coin size={36} />
          </div>
        );
      })}
      <Stamp at={miles} x={270} y={330} rotate={-5} tone="token" size={34}>
        Miles de millones
      </Stamp>
    </Layer>
  );
}
