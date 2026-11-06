import { EASE, es, popAt, unit, useClock, useCue } from "@motor/video";
import { Coin, Illustrative, Layer } from "../parts.tsx";
import { ACCENT, INK, TOKEN } from "../world.tsx";
import { Field, HALF, Head } from "./split.tsx";

/** A pile of coins that grows to `n` from `at`. */
function Pile({ at, n, t }: { at: number; n: number; t: number }) {
  const shown = Math.floor(n * EASE.out(unit(t, at, 0.9)));
  return (
    <div className="absolute" style={{ left: 0, top: 260, width: HALF.w, height: 200 }}>
      {Array.from({ length: shown }, (_, i) => (
        <div key={i} className="absolute" style={{ left: 40 + (i % 4) * 38, bottom: Math.floor(i / 4) * 30 }}>
          <Coin size={34} />
        </div>
      ))}
    </div>
  );
}

function Shipped({ at, t }: { at: number; t: number }) {
  if (t < at) return null;
  const p = Math.min(1, popAt(t, at));
  const blink = Math.floor(t * 4) % 2 === 0;
  return (
    <div data-ui="" className="absolute flex items-center justify-between rounded-xl" style={{ left: 16, top: 480, width: HALF.w - 32, padding: "10px 14px", background: "var(--piece-surface)", border: `2px dashed ${ACCENT}`, transform: `scale(${0.7 + 0.3 * p})` }}>
      <span className="font-mono font-bold uppercase" style={{ fontSize: 14, letterSpacing: "0.1em", color: INK }}>
        Entregado
      </span>
      <span className="font-display font-black" style={{ fontSize: 32, color: ACCENT, opacity: blink ? 1 : 0.4 }}>
        ?
      </span>
    </div>
  );
}

export function Dos() {
  const t = useClock();
  const ana = useCue("Ana");
  const cincuenta = useCue("cincuenta");
  const beto = useCue("Beto");
  const cinco = useCue("cinco");
  const quien = useCue("Quién");
  const big = (at: number, value: number, color: string) => (
    <div data-ui="" className="absolute text-center font-display font-black tabular-nums" style={{ left: 0, top: 190, width: HALF.w, fontSize: 52, color, lineHeight: 1, opacity: t >= at ? 1 : 0 }}>
      {es(Math.round(value * EASE.out(unit(t, at, 1))))} M
    </div>
  );
  return (
    <Layer>
      <Field side="left" wipeAt={0.1}>
        <Head at={ana} player="Jugador 1" name="Ana" seed={11} color={TOKEN} />
        {big(cincuenta, 50, TOKEN)}
        <Pile at={cincuenta} n={20} t={t} />
        <Shipped at={quien} t={t} />
      </Field>
      <Field side="right" wipeAt={0.1}>
        <Head at={beto} player="Jugador 2" name="Beto" seed={4} color={ACCENT} />
        {big(cinco, 5, ACCENT)}
        <Pile at={cinco} n={2} t={t} />
        <Shipped at={quien + 0.15} t={t} />
      </Field>
      <Illustrative at={0.3} y={752} />
    </Layer>
  );
}
