import { EASE, lerp, unit, useStage, useStageCue } from "@motor/video";

/*
 * The world of "Linux vs Windows", a replica of @rick.theengineer's Reel: a
 * flat night-blue desk with, locked at the top, the dial that runs the whole
 * video, "¿QUIÉN DECIDE?", from POR DEFECTO (Windows, blue) to CONTROL
 * (Linux, orange). Its dot travels to the side the voice is talking about,
 * and under it the chapter label changes with each scene, in that side's
 * color. Everything else (monitors, lists, windows) belongs to each scene's
 * Visual. Our violet is the dot, the "FALSO" and the CTA.
 */

export const BG = "#0B0F14";
export const SURFACE = "#141A22";
export const CARD = "#111720";
export const LINE = "#253041";
export const INK = "#EEF2F7";
export const MUTED = "#7D8794";
export const DIM = "#4A5464";
export const ACCENT = "#8B85FF";
export const WIN = "#3B8EEA";
export const WIN_DEEP = "#0E2A4A";
export const TUX = "#F08A3C";
export const TUX_DEEP = "#3A2414";
export const OK = "#3CCB7F";
export const AMBER = "#E8B43C";

/** The dial, locked to the screen under the tab. */
export const DIAL = { y: 84, left: 120, right: 420, label: 60, chapter: 120 };

type Side = "win" | "tux" | "both" | "neutral";

/** The chapter label under the dial, and whose color it takes, in each scene. */
const CHAPTER: Record<string, { text: string; side: Side }> = {
  gancho: { text: "DOS RESPUESTAS", side: "both" },
  "windows-defecto": { text: "CAPÍTULO 1 · POR DEFECTO", side: "win" },
  funciona: { text: "FUNCIONA Y YA", side: "win" },
  compatibilidad: { text: "LA VENTAJA", side: "win" },
  "costo-windows": { text: "¿QUIÉN PONE LOS VALORES?", side: "win" },
  "linux-opuesto": { text: "CAPÍTULO 2 · CÓDIGO ABIERTO", side: "tux" },
  control: { text: "LO QUE TE DA", side: "tux" },
  "limites-apps": { text: "DÓNDE SE CORTA", side: "tux" },
  "limites-hardware": { text: "HARDWARE", side: "tux" },
  developers: { text: "CAPÍTULO 3 · DONDE CORRE TU CÓDIGO", side: "tux" },
  wsl: { text: "POR ESO WINDOWS HIZO ESTO", side: "win" },
  seguridad: { text: "LO QUE SE DICE", side: "neutral" },
  "cual-mejor": { text: "ENTONCES", side: "both" },
  principiantes: { text: "EMPIEZA POR AQUÍ", side: "tux" },
  cierre: { text: "LA PREGUNTA REAL", side: "both" },
};

const SIDE_COLOR: Record<Side, string> = { win: WIN, tux: TUX, both: ACCENT, neutral: MUTED };

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

/**
 * The dot's stops: where it goes (−1 is POR DEFECTO, +1 is CONTROL) when a
 * word is said, or at a scene's start. In the hook it swings with each side.
 */
function useDialStops(): Array<{ at: number; pos: number }> {
  const s = useSceneStart;
  return [
    { at: 0, pos: 0 },
    { at: useStageCue("gancho", "Linux", 2), pos: 0.8 },
    { at: useStageCue("gancho", "Windows", 2), pos: -0.8 },
    { at: useStageCue("gancho", "distinto."), pos: 0 },
    { at: s("windows-defecto"), pos: -1 },
    { at: s("linux-opuesto"), pos: 1 },
    { at: s("wsl"), pos: -0.55 },
    { at: s("seguridad"), pos: 0 },
    { at: useStageCue("cual-mejor", "Windows"), pos: -1 },
    { at: useStageCue("cual-mejor", "control,"), pos: 1 },
    { at: s("principiantes"), pos: 0.6 },
    { at: useStageCue("cierre", "ti,"), pos: -1 },
    { at: useStageCue("cierre", "tú?"), pos: 1 },
    { at: useStageCue("cierre", "Comenta"), pos: 0 },
  ];
}

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
/** Mixes two #RRGGBB colors. */
export function mix(a: string, b: string, k: number): string {
  const A = hex(a);
  const B = hex(b);
  return `#${A.map((v, i) => Math.round(lerp(v, B[i], k)).toString(16).padStart(2, "0")).join("")}`;
}

function Dial() {
  const { ms, sceneId, scenes } = useStage();
  const t = ms / 1000;
  const stops = useDialStops();
  let pos = 0;
  for (const stop of stops) {
    if (t < stop.at) break;
    pos = lerp(pos, stop.pos, EASE.inOut(unit(t, stop.at, 0.55)));
  }
  const x = lerp(DIAL.left, DIAL.right, (pos + 1) / 2);
  const id = sceneId || "gancho";
  const index = Math.max(0, scenes.findIndex((sc) => sc.id === id));
  const start = useSceneStart(id);
  const k = EASE.out(unit(t, start, 0.35));
  const chapter = CHAPTER[id] ?? CHAPTER.gancho;
  const prev = index > 0 ? (CHAPTER[scenes[index - 1].id] ?? chapter) : chapter;
  const label = k < 0.5 ? prev : chapter;
  const swap = k < 0.5 ? 1 - k * 2 : (k - 0.5) * 2;
  const dotColor = pos < -0.3 ? WIN : pos > 0.3 ? TUX : ACCENT;
  const winOn = pos < -0.3 ? 1 : 0.55;
  const tuxOn = pos > 0.3 ? 1 : 0.55;
  return (
    <div data-screen="" data-ui="" className="absolute left-0 top-0" style={{ width: 540, height: 150 }}>
      <div className="absolute left-0 right-0 text-center font-mono text-[12px] font-bold uppercase tracking-[0.22em]" style={{ top: DIAL.label, color: MUTED }}>
        ¿Quién decide?
      </div>
      <div className="absolute" style={{ left: DIAL.left, top: DIAL.y, width: DIAL.right - DIAL.left, height: 2, background: LINE }} />
      <div className="absolute" style={{ left: DIAL.left, top: DIAL.y - 4, width: 2, height: 10, background: WIN, opacity: winOn }} />
      <div className="absolute" style={{ left: DIAL.right - 2, top: DIAL.y - 4, width: 2, height: 10, background: TUX, opacity: tuxOn }} />
      <div className="absolute text-right font-mono text-[12px] font-bold uppercase leading-none tracking-[0.12em]" style={{ left: DIAL.left - 112, width: 104, top: DIAL.y - 5, color: WIN, opacity: winOn }}>
        Por defecto
      </div>
      <div className="absolute font-mono text-[12px] font-bold uppercase leading-none tracking-[0.12em]" style={{ left: DIAL.right + 8, top: DIAL.y - 5, color: TUX, opacity: tuxOn }}>
        Control
      </div>
      <div className="absolute rounded-full" style={{ left: x - 7, top: DIAL.y - 6, width: 14, height: 14, background: dotColor, boxShadow: `0 0 14px ${dotColor}` }} />
      <div
        className="absolute left-0 right-0 text-center font-mono text-[12px] font-bold uppercase tracking-[0.24em]"
        style={{ top: DIAL.chapter - 14, color: SIDE_COLOR[label.side], opacity: swap }}
      >
        {label.text}
      </div>
      <div className="absolute" style={{ left: 36, right: 36, top: 140, height: 1, background: LINE, opacity: 0.7 }} />
    </div>
  );
}

export function World() {
  return (
    <div className="absolute left-0 top-0 overflow-hidden" style={{ width: 540, height: 960, background: BG }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 38%, #13202F 0%, rgba(11,15,20,0) 62%)" }} />
      <Dial />
    </div>
  );
}
