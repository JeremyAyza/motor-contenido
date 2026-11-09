import { EASE, fade, keys, popAt, unit, useClock, useCue } from "@motor/video";
import { ApiChip, Card, Layer, Node } from "../parts.tsx";
import { API, API_SOFT, INK, MUTED } from "../world.tsx";

const ROWS: Array<{ key: string; value: string }> = [
  { key: "MÉTODO", value: "POST" },
  { key: "DIRECCIÓN", value: "/v1/responses" },
  { key: "ENVÍAS", value: "model · input" },
  { key: "RECIBES", value: "JSON" },
];

/** What the acronym says, and the contract it is: what you can ask for and what you get back. */
export function Sigla() {
  const t = useClock();
  const interfaz = useCue("Interfaz");
  const programacion = useCue("programación");
  const aplicaciones = useCue("aplicaciones");
  const contrato = useCue("contrato");
  const pedir = useCue("pedir");
  const devuelve = useCue("devuelve");
  const letters = 1 - fade(t, contrato - 0.2, 0.2);
  const lines: Array<{ letter: string; rest: string; at: number }> = [
    { letter: "A", rest: "pplication", at: aplicaciones },
    { letter: "P", rest: "rogramming", at: programacion },
    { letter: "I", rest: "nterface", at: interfaz },
  ];
  const card = popAt(t, contrato - 0.1);
  const rowAt = [contrato + 0.15, contrato + 0.45, pedir, devuelve];
  // A dot travels from your app to OpenAI on "pedir" and back on "devuelve".
  const go = EASE.inOut(unit(t, pedir, 0.6));
  const back = EASE.inOut(unit(t, devuelve, 0.6));
  const dotX = 150 + 240 * (go - back);
  // Your app and OpenAI stay from the last scene, now side by side under the acronym; they rise under the contract.
  const pathY = keys(t, [[contrato - 0.1, 705], [contrato + 0.4, 660]]);
  return (
    <Layer>
      {letters > 0 ? (
        <div className="absolute" style={{ left: 40, top: 170, opacity: letters }}>
          {lines.map((line, i) => {
            const p = popAt(t, i * 0.12);
            const word = fade(t, line.at - 0.05, 0.25);
            return (
              <div key={line.letter} className="flex items-baseline font-display font-black" style={{ height: 136, fontSize: 118, color: INK, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - Math.min(1, p)) * 30}px)` }}>
                <span style={{ color: API, width: 92, display: "inline-block" }}>{line.letter}</span>
                <span style={{ fontSize: 46, opacity: word, transform: `translateX(${(1 - word) * 16}px)`, display: "inline-block" }}>{line.rest}</span>
              </div>
            );
          })}
        </div>
      ) : null}
      {t >= contrato - 0.1 ? (
        <>
          <Card x={36} y={196} w={468} h={316} style={{ opacity: Math.min(1, card * 2), transform: `scale(${0.85 + 0.15 * Math.min(1, card)})` }}>
            <div className="flex items-center justify-between px-5 pt-4">
              <span className="font-mono text-[15px] font-bold tracking-[0.18em]" style={{ color: MUTED }}>
                CONTRATO
              </span>
              <div className="relative h-[40px] w-[78px]">
                <ApiChip x={39} y={20} w={78} h={40} />
              </div>
            </div>
            <div className="mt-3 px-5">
              {ROWS.map((row, i) => {
                const on = fade(t, rowAt[i], 0.25);
                return (
                  <div key={row.key} className="flex h-[56px] items-center justify-between rounded-[8px] px-3" style={{ marginBottom: 6, border: `2px ${on > 0.5 ? "solid" : "dashed"} ${on > 0.5 ? API_SOFT : "#D5DDE6"}`, background: on > 0.5 ? "#F7F7FF" : "transparent" }}>
                    <span className="font-mono text-[14px] font-bold tracking-[0.12em]" style={{ color: MUTED, opacity: 0.35 + 0.65 * on }}>
                      {row.key}
                    </span>
                    <span className="font-mono text-[19px] font-bold" style={{ color: API, opacity: on }}>
                      {row.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      ) : null}
      <svg className="absolute" width={540} height={960} aria-hidden>
        <line x1={150} x2={390} y1={pathY} y2={pathY} stroke={API} strokeWidth={5} strokeLinecap="round" opacity={0.8} />
        {t >= pedir ? <circle cx={dotX} cy={pathY} r={10} fill="#FFFFFF" stroke={API} strokeWidth={4} /> : null}
      </svg>
      <Node x={120} y={pathY} kind="app" scale={0.82} />
      <Node x={410} y={pathY} kind="openai" scale={0.82} />
    </Layer>
  );
}
