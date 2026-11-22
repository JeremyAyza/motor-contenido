import { EASE, lerp, unit, useStage } from "@motor/video";

/*
 * The world of "Go vs Rust", a replica of @rick.theengineer's Reel: a
 * charcoal slate with a fine grain. Its top band is the stage, and it takes
 * the color of the chapter: teal for Go, rust for Rust, slate for the rest.
 * In the hook, the priorities and the choice it splits in two lanes that
 * fill the screen, Go on top and Rust below. Under the band, a fixed dark
 * terminal (the panel) sits right of the avatar and measures each idea, as
 * Rick's does. The band and the panel's chrome last the whole video; what
 * is drawn in them belongs to each scene's Visual.
 */

export const BG = "#26292E";
export const SLATE = "#2F3338";
export const INK = "#F2F0EA";
export const MUTED = "#8E939B";
export const SURFACE = "#16181B";
export const LINE = "#3A3F46";
export const ACCENT = "#8B85FF";
export const GO = "#29BEB0";
export const GO_BAND = "#2C5960";
export const RUST = "#E2572B";
export const RUST_BAND = "#583A2F";
export const RED = "#E0393E";
export const GOLD = "#B8925A";
export const YELLOW = "#E8C547";

/** The band: where the stage lives. */
export const BAND = { top: 92, bottom: 500 };
/** The split lanes, Go on top and Rust below, when the screen is shared. */
export const LANES = { top: 92, mid: 446, bottom: 800 };
/** The fixed terminal, right of the avatar. */
export const PANEL = { x: 204, y: 518, w: 300, h: 280 };

type Look = { mode: "band" | "split" | "tall"; tint: "go" | "rust" | "slate" | "dark"; panel: string | null };

/** What the world looks like in each scene: the band's color or the two lanes, and the panel's title. */
const LOOK: Record<string, Look> = {
  gancho: { mode: "split", tint: "slate", panel: null },
  "go-compilado": { mode: "band", tint: "go", panel: "go: el lenguaje" },
  hilos: { mode: "band", tint: "go", panel: "en vuelo" },
  goroutines: { mode: "band", tint: "go", panel: "spawn.go" },
  recolector: { mode: "band", tint: "go", panel: "memoria en uso, MB" },
  "rust-compilado": { mode: "band", tint: "rust", panel: "misma función, dos compiladores" },
  ownership: { mode: "band", tint: "rust", panel: "orders.rs" },
  precio: { mode: "tall", tint: "dark", panel: null },
  prioridades: { mode: "split", tint: "slate", panel: null },
  "python-js": { mode: "band", tint: "slate", panel: "total(precio, iva)" },
  mito: { mode: "band", tint: "slate", panel: "una petición, a escala" },
  eleccion: { mode: "split", tint: "slate", panel: null },
  cierre: { mode: "band", tint: "slate", panel: "la elección" },
};

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

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
/** Mixes two #RRGGBB colors. */
export function mix(a: string, b: string, k: number): string {
  const A = hex(a);
  const B = hex(b);
  return `#${A.map((v, i) => Math.round(lerp(v, B[i], k)).toString(16).padStart(2, "0")).join("")}`;
}

const TINT = { go: GO_BAND, rust: RUST_BAND, slate: SLATE, dark: "#1C1E21" };
const EDGE = { go: GO, rust: RUST, slate: "#4A5058", dark: RED };

/** The fine grain of the slate: a few hundred specks, fixed, so the texture never crawls. */
function Grain() {
  const dots = [];
  let s = 7;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < 420; i++) {
    dots.push(<circle key={i} cx={rnd() * 540} cy={rnd() * 960} r={0.6 + rnd() * 0.9} fill={rnd() > 0.5 ? "#FFFFFF" : "#000000"} opacity={0.035 + rnd() * 0.04} />);
  }
  return (
    <svg className="absolute left-0 top-0" width={540} height={960} aria-hidden>
      {dots}
    </svg>
  );
}

export function World() {
  const { ms, sceneId } = useStage();
  const t = ms / 1000;
  const { scenes } = useStage();
  const id = sceneId || "gancho";
  const index = Math.max(0, scenes.findIndex((s) => s.id === id));
  const prevId = index > 0 ? scenes[index - 1].id : id;
  const start = useSceneStart(id);
  const k = EASE.inOut(unit(t, start, 0.6));
  const now = LOOK[id] ?? LOOK.gancho;
  const before = LOOK[prevId] ?? now;
  const split = lerp(before.mode === "split" ? 1 : 0, now.mode === "split" ? 1 : 0, k);
  const tint = mix(TINT[before.tint], TINT[now.tint], k);
  const edge = mix(EDGE[before.tint], EDGE[now.tint], k);
  // One band, or two lanes that fill the screen: the band's bottom slides down to the lanes' end.
  const tall = lerp(before.mode === "tall" ? 1 : 0, now.mode === "tall" ? 1 : 0, k);
  const bandBottom = lerp(BAND.bottom, LANES.bottom, Math.max(split, tall));
  const mid = LANES.mid;
  const panelOn = lerp(before.panel ? 1 : 0, now.panel ? 1 : 0, k);
  const title = (k < 0.5 ? before.panel : now.panel) ?? now.panel ?? before.panel;
  return (
    <div className="absolute left-0 top-0 overflow-hidden" style={{ width: 540, height: 960, background: BG }}>
      <div className="absolute left-0 right-0" style={{ top: BAND.top, height: bandBottom - BAND.top, background: tint, opacity: 1 - split }} />
      {split > 0 ? (
        <>
          <div className="absolute left-0 right-0" style={{ top: LANES.top, height: mid - LANES.top, background: GO_BAND, opacity: split }} />
          <div className="absolute left-0 right-0" style={{ top: mid, height: LANES.bottom - mid, background: RUST_BAND, opacity: split }} />
          <div className="absolute left-0 right-0" style={{ top: mid - 1, height: 2, background: "#D9D4C7", opacity: split * 0.9 }} />
        </>
      ) : null}
      <div className="absolute left-0 right-0" style={{ top: bandBottom - 2, height: 2, background: edge, opacity: 0.8 * (1 - split) }} />
      <div className="absolute left-0 right-0" style={{ top: BAND.top, height: 2, background: edge, opacity: 0.5 * (1 - split) }} />
      <Grain />
      {panelOn > 0 ? (
        <div
          data-screen=""
          data-ui=""
          className="absolute overflow-hidden rounded-[8px]"
          style={{ left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, background: SURFACE, border: `1px solid ${LINE}`, boxShadow: "0 14px 34px rgba(0,0,0,0.45)", opacity: panelOn, transform: `translateY(${(1 - panelOn) * 24}px)` }}
        >
          <div className="flex items-center justify-between px-[10px] py-[6px]" style={{ borderBottom: `1px solid ${LINE}` }}>
            <span className="font-mono text-[12px] font-bold" style={{ color: MUTED }}>{title}</span>
            <span className="flex gap-[4px]">
              {[0, 1, 2].map((i) => (
                <span key={i} className="block h-[6px] w-[6px] rounded-full" style={{ background: LINE }} />
              ))}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
