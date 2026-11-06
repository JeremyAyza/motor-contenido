import { EASE, es, useStage, useStageCue } from "@motor/video";

/*
 * The world: the screen of a two-player arcade cabinet that lasts the whole
 * video. Up top, the FICHAS marquee counts the tokens burned, live; each level
 * starts with INSERT COIN and sends it back to 0. ENTREGADO, what comes out,
 * is the meter of the frame (top right). The neon bezel pulses each time
 * coins drop. The camera does not move: the scenes change what is on screen.
 */

export const TOKEN = "#FF4F9A";
export const RED = "#FF5A4E";
export const INK = "var(--piece-ink)";
export const ACCENT = "var(--piece-accent)";

/** A moment the FICHAS counter changes: a word of a scene (or the scene's start) and how long it counts. */
type Burn = { scene: string; word?: string; nth?: number; value: number; ramp: number };

const BURN: Burn[] = [
  { scene: "gancho", word: "millones", value: 1_000_000, ramp: 0.9 },
  { scene: "gancho", word: "millones", nth: 2, value: 2_400_000_000, ramp: 1.4 },
  { scene: "tablas", word: "primero", value: 281_000_000_000, ramp: 2.6 },
  { scene: "pregunta", word: "cero", value: 0, ramp: 0.7 },
  { scene: "token", word: "tokens", value: 10, ramp: 0.8 },
  { scene: "modelo", word: "salen", value: 36, ramp: 0.6 },
  { scene: "modelo", word: "texto", nth: 1, value: 2_400, ramp: 1.2 },
  { scene: "agente", value: 0, ramp: 0.6 },
  { scene: "agente", word: "verifica", value: 153_000, ramp: 2 },
  { scene: "vueltas", word: "modelo", value: 420_000, ramp: 1 },
  { scene: "vueltas", word: "doce", value: 5_000_000, ramp: 1.6 },
  { scene: "vueltas", word: "dispara", value: 61_000_000, ramp: 1.4 },
  { scene: "maxxing", value: 0, ramp: 0.6 },
  { scene: "maxxing", word: "máximo", value: 999_999_999, ramp: 1.2 },
  { scene: "dos", value: 0, ramp: 0.6 },
  { scene: "dos", word: "cincuenta", value: 50_000_000, ramp: 1.2 },
  { scene: "dos", word: "cinco", value: 55_000_000, ramp: 0.8 },
  { scene: "otrolado", word: "documentar", value: 57_100_000, ramp: 0.8 },
  { scene: "otrolado", word: "refactorizar", value: 61_000_000, ramp: 0.8 },
  { scene: "otrolado", word: "pruebas", value: 64_400_000, ramp: 0.8 },
];

/** Seconds from the start of the video to the start of a scene. */
export function useSceneStart(id: string): number {
  const { scenes } = useStage();
  let start = 0;
  for (const s of scenes) {
    if (s.id === id) return start / 1000;
    start += s.durationMs;
  }
  throw new Error(`No scene ${id}`);
}

function useBurnPoints(): Array<{ at: number; value: number; ramp: number }> {
  const { scenes } = useStage();
  return BURN.map((b) => {
    let start = 0;
    for (const s of scenes) {
      if (s.id === b.scene) break;
      start += s.durationMs;
    }
    // The hooks run in the same order every frame: BURN is a constant list.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const at = b.word ? useStageCue(b.scene, b.word, b.nth ?? 1) : start / 1000;
    return { at, value: b.value, ramp: b.ramp };
  });
}

/** The FICHAS value at `t` (seconds of the video), and the last moment coins dropped. */
export function useBurn(t: number): { value: number; lastDrop: number } {
  const points = useBurnPoints();
  let value = 0;
  let lastDrop = -10;
  for (const p of points) {
    if (t < p.at) break;
    const k = EASE.out(Math.min(1, (t - p.at) / p.ramp));
    if (p.value > value) lastDrop = p.at;
    value = value + (p.value - value) * k;
  }
  return { value, lastDrop };
}

/** The marquee: FICHAS, live, with what it is counting. Locked to the screen. */
function Marquee({ t }: { t: number }) {
  const { value, lastDrop } = useBurn(t);
  const flash = Math.max(0, 1 - (t - lastDrop) / 0.5);
  // Meta's real figure (Fortune) is on the marquee from "primero" until the reset; the rest is a simulation.
  const real = t >= useStageCue("tablas", "primero") && t < useStageCue("pregunta", "cero");
  return (
    <div
      data-ui=""
      className="absolute flex items-center justify-between rounded-2xl"
      style={{
        left: 36,
        top: 92,
        width: 468,
        height: 62,
        padding: "0 18px",
        background: "color-mix(in srgb, var(--piece-surface) 92%, transparent)",
        border: `2px solid ${TOKEN}`,
        boxShadow: `0 0 ${10 + 16 * flash}px ${TOKEN}${flash > 0.05 ? "AA" : "55"}`,
      }}
    >
      <div className="flex flex-col" style={{ gap: 3 }}>
        <span className="font-mono font-bold uppercase" style={{ fontSize: 15, letterSpacing: "0.16em", color: TOKEN }}>
          Fichas
        </span>
        <span className="font-mono uppercase" style={{ fontSize: 14, letterSpacing: "0.04em", color: "var(--piece-muted)", whiteSpace: "nowrap" }}>
          {real ? "Meta, 30 días" : "simulación"}
        </span>
      </div>
      <span className="font-mono font-bold tabular-nums" style={{ fontSize: 32, color: INK, transform: `scale(${1 + 0.06 * flash})`, transformOrigin: "100% 50%" }}>
        {es(Math.round(value))}
      </span>
    </div>
  );
}

/** Scanlines and the neon bezel of the cabinet. */
function Cabinet({ t }: { t: number }) {
  const { lastDrop } = useBurn(t);
  const glow = 0.45 + 0.55 * Math.max(0, 1 - (t - lastDrop) / 0.7);
  return (
    <>
      <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 5px)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
      <div className="absolute rounded-full" style={{ left: 14, top: 170, width: 4, height: 620, background: TOKEN, opacity: glow, boxShadow: `0 0 14px ${TOKEN}` }} />
      <div className="absolute rounded-full" style={{ left: 522, top: 170, width: 4, height: 620, background: ACCENT, opacity: 0.55, boxShadow: "0 0 14px var(--piece-accent)" }} />
    </>
  );
}

export function World() {
  const { ms } = useStage();
  const t = ms / 1000;
  return (
    <div data-screen="" className="absolute inset-0">
      <Cabinet t={t} />
      <Marquee t={t} />
    </div>
  );
}
