import { EASE, Stamp, fade, popAt, unit, useClock, useCue } from "@motor/video";
import { HAND_JS } from "../code.ts";
import { Card, CodeView, Illustrative, Layer, Pill } from "../parts.tsx";
import { GREEN, GREEN_SOFT, INK, MUTED, RED, SDK, SDK_2 } from "../world.tsx";

const CALLS = [
  { tab: "Python", code: `client.responses.create(model=model, input=input)` },
  { tab: "JavaScript", code: `await client.responses.create({ model, input })` },
];

/** 35 struck out, an arrow, a giant 1: the same call in one function, and output_text that only the SDK gives. */
export function UnaFuncion() {
  const t = useClock();
  const treinta = useCue("treinta");
  const lineas = useCue("líneas");
  const funcion = useCue("función");
  const texto = useCue("texto");
  const output = useCue("output");
  const agrega = useCue("agrega");
  const editor = popAt(t, 0);
  const dim = 1 - 0.55 * fade(t, funcion, 0.3);
  const n35 = popAt(t, treinta - 0.05);
  const strike = EASE.inOut(unit(t, lineas - 0.05, 0.3));
  const arrow = EASE.out(unit(t, funcion - 0.25, 0.3));
  const one = popAt(t, funcion);
  const call = popAt(t, funcion + 0.3);
  const tab = t >= texto ? 1 : 0;
  const chip = popAt(t, output - 0.05);
  return (
    <Layer>
      <Card x={36} y={128} w={468} h={196} style={{ opacity: Math.min(1, editor * 2) * dim, overflow: "hidden" }}>
        <div className="flex h-[30px] items-center justify-between border-b border-[#E2E8EF] px-3 font-mono text-[13px]" style={{ color: MUTED }}>
          <span>app.js</span>
          <span className="font-bold" style={{ color: INK }}>
            35 líneas
          </span>
        </div>
        <div className="px-3 pt-2">
          <CodeView code={HAND_JS.split("\n").slice(0, 9).join("\n")} dark={false} size={12} lineHeight={1.4} />
        </div>
      </Card>
      {/* Above the card: under it, the big orange 1 covers it. */}
      <Illustrative y={104} />
      {t >= treinta - 0.05 ? (
        <div className="absolute font-display font-black" style={{ left: 50, top: 360, fontSize: 150, lineHeight: 1, color: INK, transform: `scale(${Math.min(1.06, n35)})`, transformOrigin: "50% 60%" }}>
          35
          <svg className="absolute" width={210} height={150} viewBox="0 0 210 150" style={{ left: -10, top: 0, overflow: "visible" }} aria-hidden>
            <line x1={0} y1={98} x2={200 * strike} y2={98 - 50 * strike} stroke={RED} strokeWidth={14} strokeLinecap="round" opacity={strike > 0 ? 1 : 0} />
          </svg>
        </div>
      ) : null}
      {arrow > 0 ? (
        <svg className="absolute" width={100} height={60} viewBox="0 0 100 60" style={{ left: 240, top: 410, opacity: arrow }} aria-hidden>
          <path d={`M 4 30 L ${4 + 80 * arrow} 30`} stroke={MUTED} strokeWidth={9} strokeLinecap="round" />
          <path d={`M ${60 * arrow + 10} 10 L ${84 * arrow + 6} 30 L ${60 * arrow + 10} 50`} stroke={MUTED} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      ) : null}
      {t >= funcion ? (
        <div className="absolute font-display font-black" style={{ left: 360, top: 318, fontSize: 200, lineHeight: 1, color: SDK, transform: `scale(${Math.min(1.1, one)})`, transformOrigin: "50% 70%", textShadow: "0 18px 40px rgba(234,88,12,0.25)" }}>
          1
        </div>
      ) : null}
      {t >= funcion + 0.3 ? (
        <Card x={36} y={566} w={468} style={{ opacity: Math.min(1, call * 2), transform: `translateY(${(1 - Math.min(1, call)) * 20}px)` }}>
          <div className="flex gap-1 border-b border-[#E2E8EF] px-2 pt-2">
            {CALLS.map((c, i) => (
              <span key={c.tab} className="rounded-t-[6px] px-3 py-[5px] font-mono text-[13px] font-bold" style={{ color: i === tab ? "#FFFFFF" : MUTED, background: i === tab ? SDK_2 : "transparent" }}>
                {c.tab}
              </span>
            ))}
            <span className="ml-auto self-center pr-2 font-mono text-[13px] font-bold" style={{ color: SDK }}>
              1 línea
            </span>
          </div>
          <div className="px-3 py-3">
            <CodeView code={CALLS[tab].code} dark={false} size={12} />
          </div>
        </Card>
      ) : null}
      {t >= output - 0.05 ? (
        <div style={{ opacity: Math.min(1, chip * 2), transform: `scale(${0.8 + 0.2 * Math.min(1, chip)})`, transformOrigin: "160px 700px" }}>
          <Pill x={46} y={680} color={GREEN} bg={GREEN_SOFT} size={18}>
            ✓ response.output_text
          </Pill>
        </div>
      ) : null}
      <Stamp at={agrega} x={400} y={700} color={SDK} rotate={-8} size={30}>
        SDK
      </Stamp>
    </Layer>
  );
}
