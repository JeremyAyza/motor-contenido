import { EASE, fade, keys, popAt, unit, useClock, useCue } from "@motor/video";
import { ApiChip, Layer, Node } from "../parts.tsx";
import { API, INK } from "../world.tsx";

/** The camera pulls back: your app up top, OpenAI below, a "?" between them that the API chip fills. */
export function Pregunta() {
  const t = useClock();
  const habla = useCue("habla");
  const api = useCue("API");
  const zoom = keys(t, [[0, 1.22], [0.7, 1]], EASE.out);
  const app = popAt(t, 0);
  const openai = popAt(t, 0.25);
  const line = EASE.inOut(unit(t, 0.35, 0.5));
  const q = fade(t, habla - 0.2, 0.2) * (1 - fade(t, api - 0.05, 0.15));
  const pulse = 1 + 0.08 * Math.sin(t * 7);
  const drop = popAt(t, api - 0.05);
  const chipY = 445 - (1 - Math.min(1, drop)) * 140;
  const paint = EASE.inOut(unit(t, api + 0.1, 0.5));
  return (
    <Layer>
      <div className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: "270px 420px" }}>
        <svg className="absolute" width={540} height={960} aria-hidden>
          <line x1={270} x2={270} y1={220} y2={220 + 450 * line} stroke="#B8C2CE" strokeWidth={4} strokeDasharray="2 10" strokeLinecap="round" />
          <line x1={270} x2={270} y1={220} y2={220 + 450 * paint} stroke={API} strokeWidth={6} strokeLinecap="round" />
        </svg>
        <Node x={270} y={190} kind="app" scale={Math.min(1, app)} />
        <Node x={270} y={705} kind="openai" scale={Math.min(1, openai)} />
        {q > 0 ? (
          <div className="absolute flex items-center justify-center rounded-full bg-white font-display font-black" style={{ left: 270 - 58, top: 445 - 58, width: 116, height: 116, fontSize: 76, color: INK, opacity: q, transform: `scale(${pulse})`, boxShadow: "0 12px 30px rgba(15,37,64,0.16)" }}>
            ?
          </div>
        ) : null}
        {t >= api - 0.05 ? <ApiChip x={270} y={chipY} w={190} h={98} scale={Math.min(1.06, drop)} /> : null}
      </div>
    </Layer>
  );
}
