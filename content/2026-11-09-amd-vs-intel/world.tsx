import { EASE, unit, useStage } from "@motor/video";

/*
 * The world of "AMD contra Intel", a replica of @rick.theengineer's Reel: a
 * near-black technical sheet with a faint grid, and a chapter label under the
 * tab ("01 · LO QUE COMPARTEN") with a hairline to the margin, like his. Each
 * side keeps its color all video long: red is AMD, blue is Intel. Data that is
 * neither (bytes, the A thread) goes in the account's accent, where Rick uses amber.
 */

export const BG = "#05070A";
export const GRID = "#0E1219";
export const CARD = "#0D1117";
export const LINE = "#1C2330";
export const INK = "#F4F6FA";
export const MUTED = "#8B93A3";
export const DIM = "#4A5160";
export const ACCENT = "#8B85FF";
export const AMBER = "#F2A93B";

export const AMD = "#E8505B";
export const AMD_FILL = "#B52A3B";
export const AMD_SOFT = "#1E0E12";
export const AMD_GLOW = "#3A0D14";
export const INTEL = "#3B82E0";
export const INTEL_TEXT = "#6AA8FF";
export const INTEL_FILL = "#1F5FB0";
export const INTEL_SOFT = "#0E1B30";
export const INTEL_GLOW = "#0D1F3A";

export const CACHE = "#52D39A";
export const CACHE_FILL = "#2F7A5A";
export const PCB = "#123A27";
export const PCB_2 = "#1B5A3A";
export const DIE = "#14172B";
export const GOLD = "#C99A6B";
export const LID = "#D9DBDE";

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

const CHAPTERS: Array<{ scene: string; label: string }> = [
  { scene: "x86", label: "01 · LO QUE COMPARTEN" },
  { scene: "transistores", label: "02 · FABRICACIÓN" },
  { scene: "ensamblado", label: "03 · ENSAMBLADO" },
  { scene: "hibrido", label: "04 · LOS NÚCLEOS" },
  { scene: "cache", label: "05 · LA CACHÉ" },
  { scene: "elegir", label: "06 · ¿CUÁL ELEGIR?" },
  { scene: "modelo", label: "07 · EL MODELO MENTAL" },
];

/** The chapter label under the tab: a dot, the number and name in mono, and a hairline to the margin. */
function Chapter() {
  const { ms } = useStage();
  const t = ms / 1000;
  const starts = CHAPTERS.map((c) => ({ ...c, at: useSceneStart(c.scene) }));
  const current = starts.filter((c) => t >= c.at).at(-1);
  if (!current) return null;
  const p = EASE.out(unit(t, current.at, 0.35));
  return (
    <div data-screen="" data-ui="" className="absolute flex items-center gap-2" style={{ left: 36, top: 92, width: 468, opacity: p }}>
      <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: INK }} />
      <span className="shrink-0 font-mono text-[14px] font-bold tracking-[0.14em]" style={{ color: MUTED }}>
        {current.label}
      </span>
      <span className="h-px flex-1" style={{ background: LINE, transform: `scaleX(${p})`, transformOrigin: "left" }} />
    </div>
  );
}

export function World() {
  return (
    <div className="absolute left-0 top-0" style={{ width: 540, height: 960, background: BG }}>
      <svg className="absolute inset-0" width={540} height={960} aria-hidden>
        {Array.from({ length: 21 }, (_, i) => (
          <line key={`v${i}`} x1={i * 27} x2={i * 27} y1={0} y2={960} stroke={GRID} strokeWidth={1} />
        ))}
        {Array.from({ length: 36 }, (_, i) => (
          <line key={`h${i}`} x1={0} x2={540} y1={i * 27} y2={i * 27} stroke={GRID} strokeWidth={1} />
        ))}
      </svg>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(5,7,10,0) 40%, rgba(5,7,10,0.85) 100%)" }} />
      <Chapter />
    </div>
  );
}
