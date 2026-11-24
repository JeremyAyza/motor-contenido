import { EASE, unit, useStage, useStageCue } from "@motor/video";

/*
 * The world of "Agentes y Linux", a replica of @rick.theengineer's Reel on why
 * AI agents love Linux, built on the world of 2026-11-17-que-es-linux (Jeremy's
 * gate A): a black room lit in phosphor green, with a grid floor in
 * perspective whose horizon sits low, like Rick's, so the panels live above it
 * and the avatar and the terminal stand on it. A HUD line under the frame's
 * tab reads "agent@linux:~$" on the left and the chapter on the right. The
 * floor turns red while the app keeps crashing and amber while the agent has
 * full access to the laptop, as in Rick's.
 */

export const BG = "#030806";
export const G = "#3CFF8A";
export const G2 = "#1F9E57";
export const GD = "#0E3F25";
export const PANEL = "rgba(4,16,10,0.94)";
export const INK = "#E9FFF1";
export const MUTED = "#7FBF98";
export const ACCENT = "#8B85FF";
export const RED = "#FF4D5E";
export const AMBER = "#FFB020";
/** The model, Rick's salmon pixel invader. */
export const MODEL = "#E8735C";

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

/** The chapter of each scene, for the HUD line of parts.tsx. */
export const CHAPTERS: Record<string, string> = {
  humanos: "01 · HUMANOS VS AGENTES",
  modelo: "02 · EL HARNESS",
  harness: "02 · EL HARNESS",
  pixeles: "03 · PÍXELES VS TEXTO",
  falla: "04 · LA TERMINAL",
  tuberias: "04 · LA TERMINAL",
  arbol: "05 · UN SOLO ÁRBOL",
  archivos: "06 · TODO ES UN ARCHIVO",
  salida: "07 · CÓDIGOS DE SALIDA",
  aislar: "08 · EL AISLAMIENTO",
  cierre: "09 · TEXTO ENTRA, TEXTO SALE",
};

/** The horizon of the floor, in design px. */
export const HORIZON = 540;

/** The floor: a grid in perspective that drifts slowly toward the viewer, fading into a haze at the horizon. */
function Floor({ t, color }: { t: number; color: string }) {
  const lines = [];
  for (let i = -16; i <= 16; i++) {
    const x0 = 270 + i * 22;
    const x1 = 270 + i * 150;
    lines.push(<line key={`v${i}`} x1={x0} y1={HORIZON} x2={x1} y2={960} stroke={color} strokeOpacity={0.32} strokeWidth={1} />);
  }
  const shift = (t * 0.08) % 1;
  for (let k = 0; k < 12; k++) {
    const d = (k + shift) / 12;
    const y = HORIZON + (960 - HORIZON) * d * d;
    lines.push(<line key={`h${k}`} x1={0} y1={y} x2={540} y2={y} stroke={color} strokeOpacity={0.08 + 0.34 * d} strokeWidth={1} />);
  }
  return (
    <svg className="absolute left-0 top-0" width={540} height={960} aria-hidden>
      <defs>
        <linearGradient id="floor-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={BG} stopOpacity="1" />
          <stop offset="0.3" stopColor={BG} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={0} y1={HORIZON} x2={540} y2={HORIZON} stroke={color} strokeOpacity={0.7} strokeWidth={1.5} />
      {lines}
      <rect x={0} y={HORIZON} width={540} height={150} fill="url(#floor-fade)" />
    </svg>
  );
}

function mix(a: string, b: string, k: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, "0")).join("")}`;
}

export function World() {
  const { ms } = useStage();
  const t = ms / 1000;
  // Red while the app crashes, amber while the agent has the whole laptop.
  const redIn = useStageCue("falla", "cae");
  const redOut = useStageCue("falla", "terminal");
  const amberIn = useStageCue("aislar", "computadora");
  const amberOut = useStageCue("aislar", "contenedores");
  const red = EASE.out(unit(t, redIn, 0.3)) * (1 - EASE.out(unit(t, redOut, 0.4)));
  const amber = EASE.out(unit(t, amberIn, 0.3)) * (1 - EASE.out(unit(t, amberOut, 0.4)));
  const color = mix(mix(G, RED, red), AMBER, amber);
  const glow = 0.16 + 0.03 * Math.sin(t * 1.3);
  const haze = mix(mix("#3CFF8A", "#FF4D5E", red), "#FFB020", amber);
  return (
    <div className="absolute left-0 top-0 overflow-hidden" style={{ width: 540, height: 960, background: BG }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% ${(HORIZON / 960) * 100}%, ${haze}${Math.round(glow * 255).toString(16).padStart(2, "0")} 0%, rgba(3,8,6,0) 55%)` }} />
      <Floor t={t} color={color} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)" }} />
    </div>
  );
}
