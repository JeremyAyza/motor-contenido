import type { CSSProperties } from "react";
import { EASE, fade, keys, popAt, unit, useClock, useCue } from "@motor/video";
import { Logo } from "@motor/ui";
import { HAND_JS } from "../code.ts";
import { CodeView, Editor, Layer, SdkBox } from "../parts.tsx";
import { INK, SDK, SDK_2 } from "../world.tsx";

/** The SDK box drops on the code, the acronym in orange, and the box opens: libraries and docs with examples. */
export function Sdk() {
  const t = useClock();
  const sdk = useCue("SDK");
  const kit = useCue("kit");
  const desarrollo = useCue("desarrollo");
  const software = useCue("software");
  const caja = useCue("caja");
  const librerias = useCue("librerías");
  const documentacion = useCue("documentación");
  const ejemplos = useCue("ejemplos");
  const code = 0.22 * (1 - fade(t, caja - 0.2, 0.25));
  const drop = popAt(t, sdk - 0.1);
  const settle = EASE.inOut(unit(t, caja, 0.5));
  const boxX = keys(t, [[caja, 340], [caja + 0.5, 270]]);
  // A short fall that fades in: from above the tab, its "SDK" label left the frame's margin.
  const boxY = t < caja ? 560 - (1 - Math.min(1, drop)) * 280 : keys(t, [[caja, 560], [caja + 0.5, 640]]);
  const boxIn = t < caja ? Math.min(1, drop * 3) : 1;
  const open = EASE.out(unit(t, caja + 0.3, 0.5));
  const letters = 1 - fade(t, caja - 0.2, 0.2);
  const rows: Array<{ letter: string; rest: string; at: number }> = [
    { letter: "S", rest: "oftware", at: software },
    { letter: "D", rest: "evelopment", at: desarrollo },
    { letter: "K", rest: "it", at: kit },
  ];
  const ghost = fade(t, caja + 0.2, 0.3);
  const fill1 = fade(t, librerias - 0.05, 0.3);
  const fill2 = fade(t, documentacion - 0.05, 0.3);
  const example = fade(t, ejemplos - 0.05, 0.25);
  const card = (on: number): CSSProperties => ({ border: `2px ${on > 0.5 ? "solid" : "dashed"} #F5B48A`, background: on > 0.5 ? "#FFFFFF" : "rgba(255,255,255,0.35)", boxShadow: on > 0.5 ? "0 16px 34px rgba(15,37,64,0.12)" : "none" });
  return (
    <Layer>
      {code > 0 ? (
        <div style={{ opacity: code }}>
          <Editor x={36} y={112} w={468} h={660} file="app.js" lines="35 líneas">
            <CodeView code={HAND_JS} size={12} lineHeight={1.42} />
          </Editor>
        </div>
      ) : null}
      {letters > 0 ? (
        <div className="absolute" style={{ left: 40, top: 170, opacity: letters }}>
          {rows.map((row, i) => {
            const p = popAt(t, sdk + i * 0.1);
            const word = fade(t, row.at - 0.05, 0.25);
            return (
              <div key={row.letter} className="flex items-baseline font-display font-black text-white" style={{ height: 96, fontSize: 86, opacity: t < sdk ? 0 : Math.min(1, p * 2) }}>
                <span style={{ color: SDK_2, width: 70, display: "inline-block" }}>{row.letter}</span>
                <span style={{ fontSize: 44, opacity: word, transform: `translateX(${(1 - word) * 16}px)`, display: "inline-block" }}>{row.rest}</span>
              </div>
            );
          })}
        </div>
      ) : null}
      {t >= sdk - 0.1 ? <SdkBox x={boxX} y={boxY} s={1.3 - 0.1 * settle} open={open} opacity={boxIn} /> : null}
      {ghost > 0 ? (
        <>
          <div data-ui="" className="absolute rounded-[12px] p-4" style={{ left: 36, top: 150, width: 226, height: 300, opacity: ghost, ...card(fill1) }}>
            <div className="font-mono text-[13px] font-bold tracking-[0.16em]" style={{ color: SDK }}>
              LIBRERÍAS
            </div>
            <div style={{ opacity: fill1 }}>
              <div className="mt-4 flex gap-3">
                <Logo slug="javascript" size={40} ancla={false} />
                <Logo slug="python" size={40} ancla={false} />
              </div>
              <div className="mt-5 rounded-[6px] bg-[#0B1B30] px-2 py-2 font-mono text-[13px] text-white">npm install openai</div>
              <div className="mt-2 rounded-[6px] bg-[#0B1B30] px-2 py-2 font-mono text-[13px] text-white">pip install openai</div>
            </div>
          </div>
          <div data-ui="" className="absolute rounded-[12px] p-4" style={{ left: 278, top: 150, width: 226, height: 300, opacity: ghost, ...card(fill2) }}>
            <div className="font-mono text-[13px] font-bold tracking-[0.16em]" style={{ color: SDK }}>
              DOCUMENTACIÓN
            </div>
            <div style={{ opacity: fill2 }}>
              {[0.9, 0.7, 0.8].map((wd, i) => (
                <div key={i} className="mt-3 h-[8px] rounded-full" style={{ width: `${wd * 100}%`, background: "#E2E8EF" }} />
              ))}
              <div className="mt-4 font-mono text-[13px] font-bold" style={{ color: INK }}>
                responses.create()
              </div>
              <div className="mt-3 rounded-[6px] px-2 py-2" style={{ background: "#0B1B30", outline: example > 0.5 ? `3px solid ${SDK_2}` : "none" }}>
                <div className="mb-1 font-mono text-[12px] text-white/50">EJEMPLO</div>
                <CodeView code={`client.responses.create(\n  model="gpt-6-astra",\n  input="…")`} size={12} lineHeight={1.35} />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </Layer>
  );
}
