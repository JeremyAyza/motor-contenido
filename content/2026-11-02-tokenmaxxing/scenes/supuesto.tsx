import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Coin, Illustrative, Layer, Stamp, Title } from "../parts.tsx";
import { ACCENT, INK, TOKEN } from "../world.tsx";

/** The company board tints every person by tokens; then the equation behind it cracks. */
export function Supuesto() {
  const t = useClock();
  const medir = useCue("medir");
  const persona = useCue("persona");
  const idea = useCue("idea");
  const uso = useCue("uso");
  const trabajo = useCue("trabajo");
  const pero = useCue("Pero");
  const mismo = useCue("mismo");
  const crack = EASE.in(unit(t, pero + 0.2, 0.6));
  const cols = 16;
  const rows = 7;
  return (
    <Layer>
      <Card at={0.1} y={180} h={250} label="Tablero de la empresa · tokens por persona">
        <div className="relative" style={{ height: 170 }}>
          {Array.from({ length: cols * rows }, (_, i) => {
            const x = (i % cols) * 27;
            const y = Math.floor(i / cols) * 24;
            const heat = ((i * 53) % 100) / 100;
            const on = t >= medir + ((i % cols) + Math.floor(i / cols)) * 0.035;
            return <div key={i} className="absolute rounded-md" style={{ left: x, top: y, width: 20, height: 18, background: on ? `color-mix(in srgb, ${TOKEN} ${25 + heat * 75}%, var(--piece-surface))` : "rgba(255,255,255,0.08)" }} />;
          })}
          {t >= persona ? (
            <div className="absolute rounded-xl font-mono font-bold" style={{ left: 190, top: 52, padding: "8px 12px", fontSize: 15, background: INK, color: "#120E1F", transform: `scale(${Math.min(1, popAt(t, persona))})`, transformOrigin: "0 100%" }}>
              Persona #4812 · 31 mil M
            </div>
          ) : null}
        </div>
      </Card>
      <Illustrative at={persona} y={436} />
      {t >= idea ? (
        <div className="absolute" style={{ left: 36, top: 490, width: 468, height: 170, opacity: Math.min(1, popAt(t, idea) * 2) }}>
          <div className="absolute flex flex-wrap" style={{ left: 10, top: 20, width: 150, gap: 4 }}>
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} style={{ transform: `scale(${t >= uso - 0.3 + i * 0.05 ? Math.min(1, popAt(t, uso - 0.3 + i * 0.05)) : 0})` }}>
                <Coin size={34} />
              </div>
            ))}
          </div>
          <div data-ui="" className="absolute font-mono font-bold uppercase" style={{ left: 40, top: 140, fontSize: 16, color: TOKEN, letterSpacing: "0.12em" }}>
            Uso
          </div>
          <div className="absolute flex flex-wrap" style={{ left: 318, top: 20, width: 150, gap: 6 }}>
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="rounded-md" style={{ width: 42, height: 30, background: ACCENT, transform: `scale(${t >= trabajo - 0.3 + i * 0.05 ? Math.min(1, popAt(t, trabajo - 0.3 + i * 0.05)) : 0})` }} />
            ))}
          </div>
          <div data-ui="" className="absolute font-mono font-bold uppercase" style={{ left: 340, top: 140, fontSize: 16, color: ACCENT, letterSpacing: "0.12em" }}>
            Trabajo
          </div>
          {t < mismo ? (
            <>
              <div className="absolute rounded" style={{ left: 196, top: 58, width: 76, height: 12, background: INK, transform: `translate(${-crack * 14}px, ${crack * 90}px) rotate(${-crack * 40}deg)`, opacity: 1 - crack }} />
              <div className="absolute rounded" style={{ left: 196, top: 86, width: 76, height: 12, background: INK, transform: `translate(${crack * 14}px, ${crack * 110}px) rotate(${crack * 35}deg)`, opacity: 1 - crack }} />
            </>
          ) : null}
        </div>
      ) : null}
      <Stamp at={mismo} x={270} y={570} rotate={0} tone="red" size={72}>
        ≠
      </Stamp>
      <Title at={mismo + 0.3} y={690} size={40}>
        Uso <span style={{ color: TOKEN }}>≠</span> productividad
      </Title>
    </Layer>
  );
}
