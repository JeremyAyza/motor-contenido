import { EASE, Tag, keys, popAt, unit, useClock, useCue } from "@motor/video";
import { ApiChip, Layer, Node, Pill, SdkBox } from "../parts.tsx";
import { API, GREEN, GREEN_SOFT, INK, MUTED } from "../world.tsx";

/** The three nodes again: an API works without an SDK, and the box of the hook swallows the chip once more. */
export function Cierre() {
  const t = useClock();
  const sin = useCue("sin");
  const adentro = useCue("adentro");
  const especificacion = useCue("especificación");
  const nodes = popAt(t, 0.05);
  // A dot goes straight from your app to OpenAI on "sin": no SDK needed.
  const dot = unit(t, sin - 0.1, 0.9);
  const drop = popAt(t, adentro - 0.15);
  const boxY = 420 - (1 - Math.min(1, drop)) * 520;
  const ghost = EASE.inOut(unit(t, adentro + 0.6, 0.5));
  const ok = popAt(t, adentro + 0.35);
  const sheet = EASE.out(unit(t, especificacion - 0.1, 0.5));
  const spark = t > especificacion ? ((t - especificacion) % 1.2) / 1.2 : -1;
  const sparkY = keys(spark, [[0, 470], [1, 652]], EASE.inOut);
  return (
    <Layer>
      <svg className="absolute" width={540} height={960} aria-hidden>
        <line x1={270} x2={270} y1={198} y2={652} stroke={API} strokeWidth={6} strokeLinecap="round" opacity={Math.min(1, nodes)} />
        {dot > 0 && dot < 1 ? <circle cx={270} cy={198 + 454 * EASE.inOut(dot)} r={11} fill="#FFFFFF" stroke={API} strokeWidth={4} /> : null}
        {spark >= 0 ? <circle cx={270} cy={sparkY} r={8} fill="#FDE68A" opacity={1 - spark * 0.5} /> : null}
      </svg>
      {sheet > 0 ? (
        <div data-ui="" className="absolute rounded-[8px] bg-white px-3 py-3" style={{ left: 330, top: 300 - 30 * sheet, width: 168, opacity: sheet, transform: `rotate(${6 * sheet}deg)`, boxShadow: "0 14px 30px rgba(15,37,64,0.16)" }}>
          <div className="font-mono text-[13px] font-bold" style={{ color: INK }}>
            Especificación
          </div>
          <div className="font-mono text-[13px]" style={{ color: MUTED }}>
            OpenAPI
          </div>
          {[0.9, 0.6, 0.8, 0.5].map((w, i) => (
            <div key={i} className="mt-2 h-[6px] rounded-full" style={{ width: `${w * 100}%`, background: "#E2E8EF" }} />
          ))}
        </div>
      ) : null}
      <Node x={270} y={170} kind="app" scale={Math.min(1, nodes)} />
      <ApiChip x={270} y={420} w={180} h={92} scale={Math.min(1, nodes)} />
      <Node x={270} y={680} kind="openai" scale={Math.min(1, nodes)} />
      {t >= adentro - 0.15 ? <SdkBox x={270} y={boxY} s={1.45} xray={ghost * 0.85} /> : null}
      {t >= adentro + 0.35 ? (
        <div style={{ opacity: Math.min(1, ok * 2) }}>
          <Pill x={378} y={540} color={GREEN} bg={GREEN_SOFT} size={16}>
            200 OK
          </Pill>
        </div>
      ) : null}
      <Tag at={sin - 0.1} until={adentro - 0.3} x={150} y={300} color={API}>
        sin SDK
      </Tag>
    </Layer>
  );
}
