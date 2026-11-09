import { EASE, bump, fade, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Layer, Node } from "../parts.tsx";
import { API, API_SOFT, INK, MUTED, SDK } from "../world.tsx";

/** The request travels down the line: an exact address, a body, and your key. */
export function Peticion() {
  const t = useClock();
  const peticion = useCue("petición");
  const direccion = useCue("dirección");
  const ticket = useCue("ticket");
  const clave = useCue("clave");
  const blur = 1 - EASE.out(unit(t, 0, 0.35));
  const travel = EASE.inOut(unit(t, peticion - 0.1, 0.7));
  const cardY = 190 + travel * 170;
  const big = bump(t, direccion, 1.5);
  const url = fade(t, direccion - 0.05, 0.2);
  const input = fade(t, ticket - 0.1, 0.2);
  const key = popAt(t, clave - 0.05);
  return (
    <Layer>
      <div className="absolute inset-0" style={{ filter: blur > 0.01 ? `blur(${blur * 8}px)` : undefined, opacity: 1 - blur * 0.6 }}>
        <svg className="absolute" width={540} height={960} aria-hidden>
          <line x1={270} x2={270} y1={190} y2={690} stroke={API} strokeWidth={5} strokeLinecap="round" opacity={0.85} />
          <circle cx={270} cy={300} r={46} fill="#FFFFFF" stroke="#94A3B8" strokeWidth={2.5} strokeDasharray="5 6" />
          <ellipse cx={270} cy={300} rx={20} ry={46} fill="none" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 6" />
          <line x1={224} x2={316} y1={300} y2={300} stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 6" />
        </svg>
        <Node x={270} y={160} kind="app" />
        <Node x={270} y={720} kind="openai" />
      </div>
      {t >= peticion - 0.1 ? (
        <Card x={70} y={cardY} w={400} style={{ opacity: Math.min(1, travel * 3) }}>
          <div className="p-4 font-mono text-[14px]" style={{ color: INK }}>
            <div className="flex items-center gap-2 rounded-[6px] px-2 py-1" style={{ background: url > 0.5 ? API_SOFT : "transparent" }}>
              <span className="rounded-[5px] px-2 py-[2px] text-[13px] font-bold text-white" style={{ background: API }}>
                POST
              </span>
              <span className="font-bold">api.openai.com/v1/responses</span>
            </div>
            <div className="mt-2 px-2 leading-[1.6]">
              <div>{"{"}</div>
              <div className="pl-4">
                <span style={{ color: MUTED }}>"model":</span> <span style={{ color: "#2A7A3B" }}>"gpt-6-astra"</span>,
              </div>
              <div className="rounded-[4px] pl-4" style={{ background: input > 0.5 ? API_SOFT : "transparent" }}>
                <span style={{ color: MUTED }}>"input":</span> <span style={{ color: "#2A7A3B" }}>"Resume este ticket"</span>
              </div>
              <div>{"}"}</div>
            </div>
            {t >= clave - 0.05 ? (
              <div className="mt-2 flex items-center gap-2 rounded-[6px] px-2 py-[6px] font-bold" style={{ background: "#FFF4EC", color: SDK, opacity: Math.min(1, key * 2), transform: `scale(${0.8 + 0.2 * Math.min(1, key)})`, transformOrigin: "0 50%" }}>
                <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden>
                  <circle cx={8} cy={12} r={5} fill="none" stroke={SDK} strokeWidth={2.4} />
                  <path d="M 13 12 L 22 12 M 18 12 L 18 16 M 21 12 L 21 15" stroke={SDK} strokeWidth={2.4} strokeLinecap="round" />
                </svg>
                Authorization: Bearer sk-••••••
              </div>
            ) : null}
          </div>
        </Card>
      ) : null}
      {big > 0.01 ? (
        <div data-ui="" className="absolute text-center font-mono font-black" style={{ left: 36, top: 590, width: 468, fontSize: 44, color: API, opacity: Math.min(1, big * 1.6), transform: `scale(${0.8 + 0.2 * big})` }}>
          /v1/responses
        </div>
      ) : null}
    </Layer>
  );
}
