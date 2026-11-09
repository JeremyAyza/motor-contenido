import { DrawPath, EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Logo } from "@motor/ui";
import { ApiChip, Card, Layer, SdkBox } from "../parts.tsx";
import { API, INK, MUTED, SDK } from "../world.tsx";

const LANGS: Array<{ slug: string; name: string; beta?: boolean }> = [
  { slug: "python", name: "Python" },
  { slug: "javascript", name: "JS / TS" },
  { slug: "dotnet", name: ".NET" },
  { slug: "ruby", name: "Ruby" },
  { slug: "openjdk", name: "Java", beta: true },
  { slug: "go", name: "Go", beta: true },
];

const SIGNATURE = "M 6 34 C 18 6, 30 6, 30 30 C 30 46, 20 44, 24 30 C 30 12, 48 10, 52 30 S 70 44, 78 22 S 96 10, 100 30 S 122 40, 132 24 L 170 26";

/** The rule to keep: the API is the signed contract, the SDK the kit that uses it in your language. */
export function Repaso() {
  const t = useClock();
  const api = useCue("API");
  const contrato = useCue("contrato");
  const sdk = useCue("SDK");
  const kit = useCue("kit");
  const rapido = useCue("rápido");
  const card = popAt(t, api - 0.1);
  const box = popAt(t, sdk - 0.05);
  const open = EASE.out(unit(t, kit, 0.45));
  return (
    <Layer>
      {t >= api - 0.1 ? (
        <Card x={196} y={150} w={308} style={{ opacity: Math.min(1, card * 2), transform: `scale(${0.85 + 0.15 * Math.min(1, card)})` }}>
          <div className="flex items-center gap-3 px-4 pt-4">
            <div className="relative h-[38px] w-[74px]">
              <ApiChip x={37} y={19} w={74} h={38} />
            </div>
            <span className="font-mono text-[14px] font-bold" style={{ color: INK }}>
              api.openai.com
            </span>
          </div>
          <div className="px-4 pt-3 font-sans text-[14px]" style={{ color: MUTED }}>
            Lo que puedes pedir
          </div>
          <div className="px-4 font-mono text-[15px] font-bold" style={{ color: API }}>
            POST /v1/responses
          </div>
          <div className="px-4 pt-2 font-sans text-[14px]" style={{ color: MUTED }}>
            Lo que te devuelve
          </div>
          <div className="px-4 font-mono text-[15px] font-bold" style={{ color: API }}>
            Response · JSON
          </div>
          <div className="relative mx-4 mb-3 mt-2 h-[52px] border-b-2 border-dashed border-[#CBD5E1]">
            <svg className="absolute" width={180} height={52} viewBox="0 0 180 52" style={{ left: 60, top: 0, overflow: "visible" }} aria-hidden>
              <DrawPath d={SIGNATURE} at={contrato - 0.05} dur={0.7} stroke="#1D4ED8" strokeWidth={3} />
            </svg>
          </div>
        </Card>
      ) : null}
      {t >= sdk - 0.05 ? <SdkBox x={360} y={500} s={0.85 * Math.min(1, box)} open={open} /> : null}
      <div className="absolute grid grid-cols-3 gap-2" style={{ left: 214, top: 610, width: 290 }}>
        {LANGS.map((lang, i) => {
          const at = rapido + i * 0.1;
          const p = popAt(t, at);
          return (
            <div key={lang.slug} data-ui="" className="relative flex h-[58px] flex-col items-center justify-center gap-1 rounded-[10px] bg-white" style={{ boxShadow: "0 8px 18px rgba(15,37,64,0.10)", opacity: t < at ? 0 : Math.min(1, p * 2), transform: `scale(${0.7 + 0.3 * Math.min(1, p)})` }}>
              <Logo slug={lang.slug} size={24} ancla={false} />
              <span className="font-mono text-[12px] font-bold" style={{ color: INK }}>
                {lang.name}
              </span>
              {lang.beta ? (
                <span className="absolute right-1 top-1 rounded-[4px] px-1 font-mono text-[12px] font-bold text-white" style={{ background: SDK }}>
                  beta
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </Layer>
  );
}
