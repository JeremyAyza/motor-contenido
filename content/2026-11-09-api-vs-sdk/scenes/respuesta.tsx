import { EASE, fade, popAt, unit, useClock, useCue } from "@motor/video";
import { RESPONSE_JSON } from "../code.ts";
import { Layer, Node, Pill } from "../parts.tsx";
import { API, GREEN, GREEN_SOFT } from "../world.tsx";

const LINES = RESPONSE_JSON.split("\n");

/** OpenAI answers: 200 OK and a JSON whose text sits three levels deep. */
export function Respuesta() {
  const t = useClock();
  const responde = useCue("responde");
  const json = useCue("JSON");
  const output = useCue("output");
  const content = useCue("content");
  const text = useCue("text");
  const spin = 1 - fade(t, responde - 0.1, 0.15);
  const ok = popAt(t, responde);
  const rise = EASE.out(unit(t, json - 0.1, 0.6));
  const lit = (i: number) => (i === 5 ? fade(t, output - 0.05, 0.2) : i === 8 ? fade(t, content - 0.05, 0.2) : i === 10 ? fade(t, text - 0.05, 0.2) : 0);
  return (
    <Layer>
      <svg className="absolute" width={540} height={960} aria-hidden>
        <line x1={270} x2={270} y1={190} y2={690} stroke={API} strokeWidth={5} strokeLinecap="round" opacity={0.85} />
      </svg>
      <Node x={270} y={160} kind="app" />
      <Node x={270} y={720} kind="openai" />
      {spin > 0 ? (
        <svg className="absolute" width={44} height={44} viewBox="0 0 44 44" style={{ left: 392, top: 698, opacity: spin, transform: `rotate(${t * 360}deg)` }} aria-hidden>
          <circle cx={22} cy={22} r={16} fill="none" stroke="#CBD5E1" strokeWidth={5} />
          <path d="M 22 6 A 16 16 0 0 1 38 22" fill="none" stroke={API} strokeWidth={5} strokeLinecap="round" />
        </svg>
      ) : null}
      {t >= responde ? (
        <div style={{ opacity: Math.min(1, ok * 2), transform: `scale(${0.8 + 0.2 * Math.min(1, ok)})`, transformOrigin: "420px 650px" }}>
          <Pill x={378} y={640} color={GREEN} bg={GREEN_SOFT} size={16}>
            200 OK
          </Pill>
        </div>
      ) : null}
      {t >= json - 0.1 ? (
        <div data-ui="" className="absolute overflow-hidden rounded-[10px] px-4 py-3 font-mono" style={{ left: 66, top: 210 + (1 - rise) * 380, width: 408, opacity: Math.min(1, rise * 2), background: "#0B1B30", boxShadow: "0 22px 48px rgba(15,37,64,0.35)", fontSize: 15, lineHeight: 1.55, color: "#E6EDF3" }}>
          <div className="mb-1 text-[12px] font-bold tracking-[0.2em] text-white/50">RESPONSE · JSON</div>
          {LINES.map((line, i) => {
            const on = lit(i);
            return (
              <div key={i} className="whitespace-pre rounded-[4px]" style={{ background: on > 0 ? `rgba(124,108,246,${0.45 * on})` : "transparent", color: i === 10 && on > 0.5 ? "#BBF7D0" : undefined }}>
                {line}
              </div>
            );
          })}
        </div>
      ) : null}
    </Layer>
  );
}
