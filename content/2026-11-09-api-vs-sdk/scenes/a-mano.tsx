import { EASE, fade, keys, popAt, shakeAt, unit, useClock, useCue } from "@motor/video";
import { HAND_JS, HAND_LINES } from "../code.ts";
import { CodeView, Editor, Illustrative, Layer, TaskTag } from "../parts.tsx";
import { RED, RED_SOFT } from "../world.tsx";
import { TAGS } from "./problema.tsx";

/** The editor grows and the hand-written call types itself: 35 lines, a 429 and a dropped connection. */
export function AMano() {
  const t = useClock();
  const cues = [useCue("petición"), useCue("clave"), useCue("texto"), useCue("errores"), useCue("reintentas")];
  const n429 = useCue("429");
  const red = useCue("red");
  const grow = EASE.inOut(unit(t, 0, 0.5));
  const x = keys(t, [[0, 196], [0.5, 36]]);
  const y = keys(t, [[0, 150], [0.5, 112]]);
  const w = keys(t, [[0, 308], [0.5, 468]]);
  const h = keys(t, [[0, 140], [0.5, 660]]);
  const chars = keys(t, [[0.4, 0], [red, HAND_JS.length]], EASE.linear);
  const shown = HAND_JS.slice(0, Math.floor(chars));
  const lines = chars <= 0 ? 0 : Math.min(HAND_LINES, shown.split("\n").length);
  const shake = shakeAt(t, [n429, red], 6);
  return (
    <Layer>
      <div style={{ transform: `translate(${shake.x}px, ${shake.y}px)` }}>
        <Editor x={x} y={y} w={w} h={h} file="app.js" lines={`${lines} ${lines === 1 ? "línea" : "líneas"}`} tags={TAGS.map((tag, i) => <TaskTag key={tag} label={tag} on={fade(t, cues[i] - 0.05, 0.25)} />)}>
          <div style={{ opacity: grow }}>
            <CodeView code={HAND_JS} chars={chars} size={12} lineHeight={1.42} />
          </div>
        </Editor>
      </div>
      {[
        { at: n429, top: 610, text: "429 Too Many Requests" },
        { at: red, top: 672, text: "Error de conexión · intento 2 de 3" },
      ].map((toast) => {
        if (t < toast.at - 0.05) return null;
        const p = popAt(t, toast.at - 0.05);
        return (
          <div key={toast.text} data-ui="" className="absolute flex h-[50px] items-center gap-3 rounded-[10px] px-4 font-mono text-[16px] font-bold" style={{ left: 60, top: toast.top, width: 420, color: RED, background: RED_SOFT, border: `2px solid ${RED}`, boxShadow: "0 14px 30px rgba(0,0,0,0.3)", opacity: Math.min(1, p * 2), transform: `scale(${0.8 + 0.2 * Math.min(1, p)})` }}>
            <span className="flex h-[24px] w-[24px] items-center justify-center rounded-full text-[15px] text-white" style={{ background: RED }}>
              !
            </span>
            {toast.text}
          </div>
        );
      })}
      <Illustrative y={780} dark />
    </Layer>
  );
}
