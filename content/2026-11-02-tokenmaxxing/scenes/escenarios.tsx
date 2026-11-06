import { popAt, useClock, useCue } from "@motor/video";
import { Coin, Cursor, Illustrative, Layer, Stamp } from "../parts.tsx";
import { ACCENT, INK, RED, TOKEN } from "../world.tsx";
import { Field, HALF, Head } from "./split.tsx";

/** Two endings of Ana's game, as tabs of a replay; Beto ships the same feature with a couple of coins. */
export function Escenarios() {
  const t = useClock();
  const steps = [
    { label: "Investigar", at: useCue("investigó") },
    { label: "Arquitectura", at: useCue("arquitectura") },
    { label: "Pruebas", at: useCue("pruebas") },
    { label: "Casos límite", at: useCue("límite") },
  ];
  const excelente = useCue("excelente");
  const quizaB = useCue("quizá", 2);
  const funciono = useCue("funcionó");
  const mientras = useCue("Mientras");
  const beto = useCue("Beto");
  const misma = useCue("misma");
  const tabB = t >= quizaB;
  const tab = (name: string, on: boolean) => (
    <span className="rounded-lg font-mono font-bold uppercase" style={{ padding: "6px 10px", fontSize: 13, letterSpacing: "0.08em", background: on ? INK : "transparent", color: on ? "#120E1F" : INK, border: `2px solid ${INK}` }}>
      {name}
    </span>
  );
  return (
    <Layer>
      <Field side="left">
        <Head at={-1} player="Jugador 1" name="Ana" seed={11} color={TOKEN} />
        <div data-ui="" className="absolute flex justify-center" style={{ left: 0, top: 190, width: HALF.w, gap: 8 }}>
          {tab("A · bien", !tabB)}
          {tab("B · bucle", tabB)}
        </div>
        {!tabB ? (
          <div data-ui="" className="absolute flex flex-col" style={{ left: 16, top: 244, width: HALF.w - 32, gap: 10 }}>
            {steps.map((s) =>
              t >= s.at ? (
                <div key={s.label} className="rounded-full text-center font-sans font-bold" style={{ padding: "8px 10px", fontSize: 18, background: "var(--piece-surface)", color: INK, border: `2px solid ${ACCENT}`, transform: `scale(${Math.min(1, popAt(t, s.at))})` }}>
                  {s.label}
                </div>
              ) : null,
            )}
          </div>
        ) : (
          <svg className="absolute" width={HALF.w} height={240} viewBox="0 0 228 240" style={{ left: 0, top: 236 }} aria-hidden>
            <g transform={`rotate(${t * 220} 114 110)`}>
              <path d="M 114 40 A 70 70 0 1 1 52 78" fill="none" stroke={RED} strokeWidth={10} strokeLinecap="round" />
              <path d="M 40 60 L 52 82 L 74 72" fill="none" stroke={RED} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
            </g>
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={70 + i * 44} cy={200 - ((t * 40 + i * 25) % 60)} r={14 + ((t * 10 + i * 5) % 8)} fill="#8C84A8" opacity={0.35} />
            ))}
          </svg>
        )}
      </Field>
      <Field side="right">
        <Head at={-1} player="Jugador 2" name="Beto" seed={4} color={ACCENT} />
        {/* What Beto had in "dos" is still there: his 5 M and his two coins. They pulse when his name is said. */}
        <div data-ui="" className="absolute text-center font-display font-black" style={{ left: 0, top: 190, width: HALF.w, fontSize: 52, lineHeight: 1, color: ACCENT, transform: `scale(${t >= beto ? 1 + 0.12 * Math.max(0, 1 - (t - beto) / 0.5) : 1})` }}>
          5 M
        </div>
        <div className="absolute flex justify-center" style={{ left: 0, top: 280, width: HALF.w, gap: 8 }}>
          <Coin size={40} />
          <Coin size={40} />
        </div>
      </Field>
      <Stamp at={excelente} until={quizaB - 0.1} x={150} y={560} rotate={-8} tone="accent" size={30}>
        Funciona
      </Stamp>
      {tabB ? (
        <Stamp at={funciono} until={mientras - 0.1} x={190} y={600} rotate={6} tone="red" size={26}>
          No funciona
        </Stamp>
      ) : null}
      <Stamp at={misma} x={390} y={560} rotate={-6} tone="accent" size={30}>
        Funciona
      </Stamp>
      <Cursor
        path={[
          [quizaB - 0.8, 120, 420],
          [quizaB - 0.15, 196, 380],
          [quizaB + 0.8, 230, 470],
        ]}
        clicks={[quizaB - 0.1]}
      />
      <Illustrative at={0} y={752} />
    </Layer>
  );
}
