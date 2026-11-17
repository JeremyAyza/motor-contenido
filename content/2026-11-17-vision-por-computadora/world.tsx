import { EASE, lerp, unit, useStage } from "@motor/video";

/*
 * The world of "Visión por computadora, explicada", a replica of a
 * @rick.theengineer Reel: a dark computer-vision app, "vista-máquina", that
 * lasts the whole video. Its bar holds the file or model of the moment and ten
 * tabs, one per chapter (píxeles, filtros, capas...), that light up as the
 * video goes: the world changes state instead of being replaced. The panel of
 * each scene (scenes/*.tsx) goes under the bar, and the avatar stands at the
 * left, where Rick stands. Rick's blue becomes the account's accent; yellow
 * keeps his job: what the machine detects.
 */

export const BG = "#07090D";
export const PANEL = "#10141B";
export const BAR = "#0C1016";
export const LINE = "rgba(255,255,255,0.09)";
export const INK = "#F2F4F8";
export const MUTED = "#8E95A3";
export const DIM = "#4B5260";
export const ACCENT = "#8B85FF";
export const YELLOW = "#FFC531";
export const RED = "#FF5A5F";
export const GREEN = "#3DDC97";

/** Where a scene starts, in seconds of the whole video. */
export function useSceneStart(id: string): number {
  const { scenes } = useStage();
  let offset = 0;
  for (const scene of scenes) {
    if (scene.id === id) return offset / 1000;
    offset += scene.durationMs;
  }
  throw new Error(`No scene "${id}"`);
}

export const TABS = ["PÍXELES", "FILTROS", "CAPAS", "APRENDE", "CLASES", "CAJAS", "MÁSCARA", "EMBED", "TOKENS", "SEGUIR"] as const;

/** The tab each scene works in (-1: none yet; 10: all of them, the close) and the file or model it has open. */
const STATE: Record<string, { tab: number; file: string }> = {
  gancho: { tab: -1, file: "" },
  pregunta: { tab: -1, file: "input: calle.jpg" },
  pixeles: { tab: 0, file: "input: gato.jpg" },
  reglas: { tab: 0, file: "es_gato.py" },
  ejemplos: { tab: 0, file: "CIFAR-10 · 50.000 imágenes" },
  cnn: { tab: 1, file: "ResNet-18 · ImageNet" },
  filtro: { tab: 1, file: "calle.jpg · 16 × 12 · gris" },
  detectores: { tab: 1, file: "conv1 · 3 filtros" },
  capas: { tab: 2, file: "ResNet-18 · capas 1 a 4" },
  aprender: { tab: 3, file: "red sin entrenar · paso 0" },
  entrenar: { tab: 3, file: "CIFAR-10 · 30 pasadas" },
  clasificar: { tab: 4, file: "ResNet-50 · ImageNet" },
  galeria: { tab: 4, file: "galería · buscar" },
  detectar: { tab: 5, file: "YOLO · calle.jpg" },
  segmentar: { tab: 6, file: "segmentación · por píxel" },
  rostros: { tab: 7, file: "rostro → embedding" },
  lenguaje: { tab: 8, file: "visión y lenguaje" },
  video: { tab: 9, file: "seguimiento · 30 fps" },
  cierre: { tab: 10, file: "calle.jpg · 6.000 × 4.000 × 3" },
  cta: { tab: 10, file: "@jacket.dev" },
};

const TAB_W = [62, 60, 52, 66, 56, 52, 66, 52, 58, 58];
const TAB_GAP = 5;
const STRIP = 468;

/** The app bar: the brand chip and the open file, and the strip of tabs that scrolls to keep the active one in view. */
function AppBar({ tab, prevTab, since, file, t }: { tab: number; prevTab: number; since: number; file: string; t: number }) {
  const k = EASE.inOut(unit(t, since, 0.5));
  const lefts = TAB_W.map((_, i) => TAB_W.slice(0, i).reduce((a, w) => a + w + TAB_GAP, 0));
  const total = lefts[9] + TAB_W[9];
  const scrollFor = (i: number) => (i < 0 || i >= 10 ? 0 : Math.max(0, Math.min(total - STRIP, lefts[i] + TAB_W[i] / 2 - STRIP / 2)));
  const scroll = lerp(scrollFor(prevTab), scrollFor(tab), k);
  return (
    <div data-screen="" data-ui="" className="absolute" style={{ left: 36, top: 50, width: STRIP }}>
      <div className="flex items-center" style={{ height: 22 }}>
        <div className="flex items-center gap-[6px] rounded-[5px] px-[7px]" style={{ height: 20, background: "rgba(139,133,255,0.14)", border: "1px solid rgba(139,133,255,0.45)" }}>
          <i className="block h-[6px] w-[6px] rounded-full" style={{ background: ACCENT }} />
          <span className="font-mono text-[12px] font-semibold tracking-[0.08em]" style={{ color: ACCENT }}>VISTA-MÁQUINA</span>
        </div>
        <span className="ml-auto font-mono text-[12px]" style={{ color: MUTED, opacity: k }}>{file}</span>
      </div>
      <div className="relative mt-[6px] overflow-hidden rounded-[6px]" style={{ height: 24, background: BAR, border: `1px solid ${LINE}` }}>
        <div className="absolute top-[2px] flex" style={{ left: 2 - scroll, gap: TAB_GAP }}>
          {TABS.map((name, i) => {
            const was = prevTab === 10 || prevTab === i;
            const is = tab === 10 || tab === i;
            const on = lerp(was ? 1 : 0, is ? 1 : 0, k);
            const done = tab === 10 || i < tab;
            // Tabs scrolled out of the strip are not drawn, so no text sits outside the frame's margin.
            const shown = lefts[i] - scroll >= -1 && lefts[i] + TAB_W[i] - scroll <= STRIP - 2;
            return (
              <div
                key={name}
                className="flex items-center justify-center rounded-[4px] font-mono text-[12px] font-semibold"
                style={{
                  visibility: shown ? "visible" : "hidden",
                  width: TAB_W[i],
                  height: 18,
                  color: on > 0.5 ? INK : done ? MUTED : DIM,
                  background: `rgba(139,133,255,${0.28 * on})`,
                  border: `1px solid rgba(139,133,255,${0.75 * on})`,
                }}
              >
                {name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function World() {
  const { ms, sceneId, sceneIndex, scenes } = useStage();
  const t = ms / 1000;
  const id = sceneId || "gancho";
  const prevId = sceneIndex > 0 ? scenes[sceneIndex - 1].id : id;
  const since = useSceneStart(id);
  const state = STATE[id] ?? STATE.gancho;
  const prev = STATE[prevId] ?? state;
  // The hook plays on the plain dark stage; the app's bar comes in with the question.
  const bar = EASE.out(unit(t, useSceneStart("pregunta") - 0.1, 0.5));
  return (
    <div className="absolute left-0 top-0 overflow-hidden" style={{ width: 540, height: 960, background: BG }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 62% 38%, rgba(139,133,255,0.07) 0%, rgba(7,9,13,0) 60%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 120%, rgba(255,197,49,0.04) 0%, rgba(7,9,13,0) 55%)" }} />
      {bar > 0 ? (
        <div className="absolute inset-0" style={{ opacity: bar }}>
          <AppBar tab={state.tab} prevTab={prev.tab} since={since} file={state.file} t={t} />
        </div>
      ) : null}
    </div>
  );
}
