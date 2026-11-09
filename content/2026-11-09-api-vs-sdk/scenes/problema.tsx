import { popAt, useClock, useCue } from "@motor/video";
import { Editor, Layer, TaskTag } from "../parts.tsx";

export const TASKS = ["Armar la petición", "Mandar la clave", "Sacar el texto", "Manejar errores", "Reintentar"];
export const TAGS = ["petición", "clave", "texto", "errores", "reintentos"];

/** The navy wedge: an empty app.js and the to-do list that talking to an API by hand brings. */
export function Problema() {
  const t = useClock();
  const mano = useCue("mano");
  const editor = popAt(t, 0.15);
  return (
    <Layer>
      <div style={{ opacity: Math.min(1, editor * 2), transform: `scale(${0.85 + 0.15 * Math.min(1, editor)})`, transformOrigin: "350px 220px" }}>
        <Editor x={196} y={150} w={308} h={140} file="app.js" lines="0 líneas" tags={TAGS.map((tag) => <TaskTag key={tag} label={tag} on={0} />)} />
      </div>
      <div data-ui="" className="absolute rounded-[12px] px-4 py-3" style={{ left: 196, top: 318, width: 308, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
        <div className="mb-2 font-mono text-[12px] font-bold tracking-[0.2em] text-white/50">A MANO</div>
        {TASKS.map((task, i) => {
          const at = mano + i * 0.2;
          const p = popAt(t, at);
          return (
            <div key={task} className="flex h-[44px] items-center gap-3 font-sans text-[19px] font-semibold text-white" style={{ opacity: t < at ? 0 : Math.min(1, p * 2), transform: `translateX(${(1 - Math.min(1, p)) * 24}px)` }}>
              <span className="h-[20px] w-[20px] rounded-[5px] border-2 border-white/70" />
              {task}
            </div>
          );
        })}
      </div>
    </Layer>
  );
}
