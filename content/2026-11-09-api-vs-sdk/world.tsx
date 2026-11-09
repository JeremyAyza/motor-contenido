import { EASE, lerp, unit, useStage, useStageCue } from "@motor/video";

/*
 * The world of "API vs SDK", a replica of @rick.theengineer's Reel: a light
 * canvas with a fine grid, grounds that change by chapter with a diagonal
 * wedge (navy for the problem, mint for Android, violet over peach for the
 * SDK), and the API | SDK switch fixed at the top, like his. Colors keep
 * their job all video long: violet is the API, orange is the SDK.
 */

export const BG = "#F3F6F9";
export const LINE = "#E2E8EF";
export const INK = "#0F2540";
export const MUTED = "#5B6577";
export const API = "#4F46E5";
export const API_2 = "#7C6CF6";
export const API_SOFT = "#E7E6FD";
export const SDK = "#EA580C";
export const SDK_2 = "#F97316";
export const SDK_SOFT = "#FCE6D9";
export const NAVY = "#0E2440";
export const MINT = "#E3F6EA";
export const GREEN = "#2A7A3B";
export const GREEN_SOFT = "#D9F7D0";
export const RED = "#C2334D";
export const RED_SOFT = "#FDE4E6";
export const CREAM = "#FDF8E6";

type Ground = "light" | "navy" | "mint" | "split" | "splitPeach";

const SWEEP = 0.55;

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

function Grid({ color }: { color: string }) {
  return (
    <svg className="absolute inset-0" width={540} height={960} aria-hidden>
      {[30, 150, 270, 390, 510].map((x) => (
        <line key={x} x1={x} x2={x} y1={0} y2={960} stroke={color} strokeWidth={1} />
      ))}
    </svg>
  );
}

/*
 * The wedge starts under the tab row (BAND): full bleed, it covered the tab
 * and the meter, ink on violet. In the hook the frame is light on dark
 * (tone invert), so there it goes to the top.
 */
const BAND = 42;

function Fill({ ground, band }: { ground: Ground; band: boolean }) {
  if (ground === "navy")
    return (
      <div className="absolute inset-0" style={{ background: NAVY }}>
        <Grid color="rgba(255,255,255,0.05)" />
      </div>
    );
  if (ground === "mint")
    return (
      <div className="absolute inset-0" style={{ background: MINT }}>
        <Grid color="rgba(42,122,59,0.10)" />
      </div>
    );
  const bottom = ground === "splitPeach" ? SDK_SOFT : BG;
  return (
    <div className="absolute inset-0" style={{ background: bottom }}>
      <Grid color={ground === "splitPeach" ? "rgba(234,88,12,0.10)" : LINE} />
      {ground === "light" ? null : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(140deg, ${API_2} 0%, ${API} 55%, #3B82F6 100%)`, clipPath: `polygon(0 ${band ? BAND : 0}px, 540px ${band ? BAND : 0}px, 540px 250px, 0 420px)` }} />
      )}
    </div>
  );
}

/** The API | SDK switch under the tab: which side is lit says what the video is talking about. */
function Switch({ side, opacity }: { side: "none" | "api" | "sdk"; opacity: number }) {
  const half = (label: string, on: boolean, color: string) => (
    <span className="flex h-full w-[66px] items-center justify-center rounded-full font-mono text-[14px] font-bold tracking-wider" style={{ background: on ? color : "transparent", color: on ? "#FFFFFF" : MUTED }}>
      {label}
    </span>
  );
  return (
    <div data-screen="" data-ui="" className="absolute flex h-[30px] rounded-full bg-white p-[3px]" style={{ left: 270 - 69, top: 64, width: 138, opacity, boxShadow: "0 6px 16px rgba(15,37,64,0.14)" }}>
      {half("API", side === "api", API)}
      {half("SDK", side === "sdk", SDK)}
    </div>
  );
}

export function World() {
  const { ms, sceneId } = useStage();
  const band = sceneId !== "gancho";
  const t = ms / 1000;
  const app = useSceneStart("app");
  const grounds: Array<{ at: number; ground: Ground }> = [
    { at: -1, ground: "navy" },
    { at: useStageCue("gancho", "parecido"), ground: "splitPeach" },
    { at: app, ground: "light" },
    { at: useSceneStart("problema"), ground: "navy" },
    { at: useStageCue("sdk", "caja"), ground: "light" },
    { at: useSceneStart("android"), ground: "mint" },
    { at: useSceneStart("repaso"), ground: "split" },
    { at: useStageCue("repaso", "kit"), ground: "splitPeach" },
    { at: useSceneStart("cierre"), ground: "split" },
  ];
  // Only the last ground that already covers the frame and the ones sweeping over it.
  let first = 0;
  grounds.forEach((g, i) => {
    if (t >= g.at + SWEEP) first = i;
  });
  const sides: Array<{ at: number; side: "none" | "api" | "sdk" }> = [
    { at: -1, side: "none" },
    { at: useStageCue("pregunta", "API"), side: "api" },
    { at: useStageCue("sdk", "SDK"), side: "sdk" },
    { at: useSceneStart("repaso"), side: "api" },
    { at: useStageCue("repaso", "kit"), side: "sdk" },
    { at: useSceneStart("cierre"), side: "api" },
    { at: useStageCue("cierre", "adentro"), side: "sdk" },
  ];
  const side = sides.filter((s) => t >= s.at).at(-1)!.side;
  return (
    <div className="absolute left-0 top-0" style={{ width: 540, height: 960 }}>
      {grounds.slice(first).map((g, i) => {
        if (t < g.at) return null;
        const p = i === 0 ? 1 : EASE.inOut(unit(t, g.at, SWEEP));
        const yl = lerp(1180, -260, p);
        const clip = p >= 1 ? undefined : `polygon(0 ${yl}px, 540px ${yl - 220}px, 540px 960px, 0 960px)`;
        return (
          <div key={`${g.ground}-${g.at}`} className="absolute inset-0" style={{ clipPath: clip }}>
            <Fill ground={g.ground} band={band} />
          </div>
        );
      })}
      <Switch side={side} opacity={EASE.out(unit(t, app, 0.4))} />
    </div>
  );
}
