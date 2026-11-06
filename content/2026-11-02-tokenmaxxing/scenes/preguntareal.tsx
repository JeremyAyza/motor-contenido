import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Coin, Cursor, Layer } from "../parts.tsx";
import { ACCENT, INK, RED, TOKEN } from "../world.tsx";

/** The wrong question gets crossed out; the scale weighs cost against result; four boxes get checked. */
export function Preguntareal() {
  const t = useClock();
  const malo = useCue("malo");
  const resultado = useCue("resultado");
  const justifica = useCue("justifica");
  const qs = [
    { label: "¿Funciona?", at: useCue("Funciona") },
    { label: "¿Pasó las pruebas?", at: useCue("Pasó") },
    { label: "¿Ahorró tiempo?", at: useCue("Ahorró") },
    { label: "¿Cuánto costó?", at: useCue("Cuánto") },
  ];
  const strike = EASE.out(unit(t, malo + 0.2, 0.35));
  const tilt = t < justifica ? 14 * EASE.out(unit(t, resultado, 0.5)) : 14 - 14 * EASE.back(unit(t, justifica, 0.7));
  const listAt = qs[0].at - 0.4;
  return (
    <Layer>
      <Card at={0.05} until={resultado - 0.1} y={190} h={150} label="Gastar mucho es…">
        <div className="relative flex" style={{ gap: 14 }}>
          {["Bueno", "Malo"].map((b) => (
            <div key={b} className="flex-1 rounded-xl text-center font-display font-black" style={{ padding: "14px 0", fontSize: 32, color: INK, background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.18)" }}>
              {b}
            </div>
          ))}
          <div className="absolute rounded-full" style={{ left: -6, top: 30, height: 8, width: `${strike * 104}%`, background: RED, transform: "rotate(-4deg)" }} />
        </div>
      </Card>
      {t >= resultado ? (
        <div className="absolute" style={{ left: 36, top: 190, width: 468, height: 240, opacity: Math.min(1, popAt(t, resultado) * 2) }}>
          <svg width={468} height={240} viewBox="0 0 468 240" aria-hidden style={{ overflow: "visible" }}>
            <path d="M 234 60 L 234 220 M 170 224 L 298 224" stroke={INK} strokeWidth={6} strokeLinecap="round" />
            <g transform={`rotate(${-tilt} 234 60)`}>
              <path d="M 60 60 L 408 60" stroke={INK} strokeWidth={6} strokeLinecap="round" />
              <path d="M 60 60 L 30 130 L 150 130 L 90 60" fill="none" stroke={INK} strokeOpacity={0.5} strokeWidth={2} />
              <path d="M 408 60 L 318 130 L 438 130 L 378 60" fill="none" stroke={INK} strokeOpacity={0.5} strokeWidth={2} />
            </g>
          </svg>
          <div className="absolute flex flex-wrap justify-center" style={{ left: 30, top: 78 + tilt * 2.4, width: 120, gap: 2 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Coin key={i} size={34} />
            ))}
          </div>
          <div className="absolute flex flex-wrap justify-center" style={{ left: 318, top: 92 - tilt * 2.4, width: 120, gap: 4 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-md" style={{ width: 50, height: 30, background: ACCENT }} />
            ))}
          </div>
          <div data-ui="" className="absolute font-mono font-bold uppercase" style={{ left: 50, top: 156 + tilt * 2.4, fontSize: 16, letterSpacing: "0.12em", color: TOKEN }}>
            Costo
          </div>
          <div data-ui="" className="absolute font-mono font-bold uppercase" style={{ left: 320, top: 156 - tilt * 2.4, fontSize: 16, letterSpacing: "0.12em", color: ACCENT }}>
            Resultado
          </div>
        </div>
      ) : null}
      <Card at={listAt} y={450} h={300} label="Antes de mirar los tokens">
        <div className="flex flex-col" style={{ gap: 12 }}>
          {qs.map((q) => {
            const on = t >= q.at + 0.25;
            return (
              <div key={q.label} className="flex items-center" style={{ gap: 14 }}>
                <div className="flex items-center justify-center rounded-md" style={{ width: 34, height: 34, border: `3px solid ${on ? ACCENT : INK}`, background: on ? ACCENT : "transparent", transform: `scale(${on ? Math.min(1.1, 0.8 + 0.3 * popAt(t, q.at + 0.25)) : 1})` }}>
                  {on ? (
                    <svg width={20} height={20} viewBox="0 0 18 18" aria-hidden>
                      <path d="M 3 9 L 7.5 13.5 L 15 4" fill="none" stroke="#120E1F" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </div>
                <span className="font-sans font-bold" style={{ fontSize: 26, color: INK, opacity: t >= q.at ? 1 : 0.35 }}>
                  {q.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
      <Cursor path={qs.map((q, i) => [q.at, 74, 518 + i * 46] as [number, number, number])} clicks={qs.map((q) => q.at + 0.2)} />
    </Layer>
  );
}
