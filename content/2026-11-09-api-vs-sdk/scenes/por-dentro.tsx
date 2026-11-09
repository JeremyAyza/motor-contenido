import { EASE, Tag, popAt, unit, useClock, useCue } from "@motor/video";
import { ApiChip, Card, Layer, SdkBox } from "../parts.tsx";
import { API, GREEN, GREEN_SOFT, INK, MUTED } from "../world.tsx";

const CHECKS = ["clave", "formato", "errores", "reintentos"];

/** An x-ray of the box: inside, the same request to the same API, and the chores done for you. */
export function PorDentro() {
  const t = useClock();
  const peticion = useCue("petición");
  const api = useCue("API");
  const red = useCue("red");
  const reintenta = useCue("reintenta");
  const xray = EASE.inOut(unit(t, 0.1, 0.5));
  const req = popAt(t, peticion - 0.05);
  const drop = popAt(t, api - 0.05);
  const wire = EASE.inOut(unit(t, api + 0.1, 0.35));
  return (
    <Layer>
      <SdkBox x={270} y={330} s={2.05} xray={xray} />
      {t >= peticion - 0.05 ? (
        <Card x={102} y={316} w={336} style={{ opacity: Math.min(1, req * 2), transform: `scale(${0.85 + 0.15 * Math.min(1, req)})` }}>
          <div className="px-3 py-3 font-mono text-[13px] leading-[1.7]" style={{ color: INK }}>
            <div>
              <span className="rounded-[4px] px-1.5 py-[1px] font-bold text-white" style={{ background: API }}>
                POST
              </span>{" "}
              <b>/v1/responses</b>
            </div>
            <div style={{ color: MUTED }}>Authorization: Bearer sk-••••</div>
            <div style={{ color: MUTED }}>Content-Type: application/json</div>
          </div>
        </Card>
      ) : null}
      <svg className="absolute" width={540} height={960} aria-hidden>
        {wire > 0 ? <line x1={270} y1={528} x2={270} y2={528 + 66 * wire} stroke={API} strokeWidth={6} strokeLinecap="round" /> : null}
      </svg>
      {t >= api - 0.05 ? <ApiChip x={270} y={630} w={150} h={76} scale={Math.min(1.06, drop)} /> : null}
      <div className="absolute flex flex-wrap justify-center gap-2" style={{ left: 36, top: 690, width: 468 }}>
        {CHECKS.map((check, i) => {
          const at = red + i * 0.12;
          const p = popAt(t, at);
          return (
            <span key={check} data-ui="" className="rounded-full px-3 py-[6px] font-mono text-[15px] font-bold" style={{ color: GREEN, background: GREEN_SOFT, opacity: t < at ? 0 : Math.min(1, p * 2), transform: `scale(${0.7 + 0.3 * Math.min(1, p)})` }}>
              ✓ {check}
            </span>
          );
        })}
      </div>
      <Tag at={reintenta} x={392} y={552} color={GREEN}>
        ↻ 2 reintentos
      </Tag>
    </Layer>
  );
}
