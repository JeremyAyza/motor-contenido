import { useClock, useCue } from "@motor/video";
import { Card, Illustrative, Layer, Stamp } from "../parts.tsx";
import { ACCENT, INK, TOKEN } from "../world.tsx";

/** Two plays on the results screen: one is worth the coin, the other is not. */
function Play({ at, y, n, cost, gain, gainAt, costAt = at }: { at: number; y: number; n: number; cost: string; gain: string; gainAt: number; costAt?: number }) {
  const t = useClock();
  return (
    <Card at={at} y={y} h={196} label={`Jugada ${n}`}>
      <div className="flex items-center justify-between" style={{ marginTop: 10 }}>
        <div style={{ opacity: t >= costAt ? 1 : 0.15 }}>
          <div className="font-mono font-bold uppercase" style={{ fontSize: 14, letterSpacing: "0.1em", color: "var(--piece-muted)" }}>
            Gastas
          </div>
          <div className="font-display font-black" style={{ fontSize: 40, lineHeight: 1, color: TOKEN, whiteSpace: "nowrap" }}>
            {cost}
          </div>
        </div>
        <div className="font-display font-black" style={{ fontSize: 28, color: "var(--piece-muted)", padding: "0 6px" }}>
          →
        </div>
        <div className="text-right" style={{ opacity: t >= gainAt ? 1 : 0.15 }}>
          <div className="font-mono font-bold uppercase" style={{ fontSize: 14, letterSpacing: "0.1em", color: "var(--piece-muted)" }}>
            Ahorras
          </div>
          <div className="font-display font-black" style={{ fontSize: 40, lineHeight: 1, color: ACCENT, whiteSpace: "nowrap" }}>
            {gain}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function Cuentas() {
  const cien = useCue("cien");
  const dia = useCue("día");
  const buena = useCue("buena");
  const mil = useCue("Mil");
  const minutos = useCue("minutos");
  const prob = useCue("probablemente");
  return (
    <Layer>
      <Play at={cien - 0.2} y={186} n={1} cost="100 USD" gain="1 día" gainAt={dia - 0.1} />
      <Stamp at={buena} x={300} y={380} rotate={-6} tone="accent" size={36}>
        Buena jugada
      </Stamp>
      {/* The second play is on screen from the start, dimmed, so the lower half is never empty. */}
      <Play at={0.4} y={456} n={2} cost="1.000 USD" gain="10 min" costAt={mil - 0.1} gainAt={minutos - 0.1} />
      <Stamp at={prob} x={280} y={650} rotate={5} tone="red" size={28}>
        Probablemente no
      </Stamp>
      <Illustrative at={cien} y={752} />
    </Layer>
  );
}
