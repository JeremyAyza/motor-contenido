import { EASE, bump, fade, popAt, unit, useClock, useCue } from "@motor/video";
import type { BackProps } from "../palette.ts";
import { Backdrop, Chip, Layer, poster } from "../parts.tsx";

/** The coastal city at sunset, pushing in slowly. */
export function GanchoBack({ t }: BackProps) {
  return <Backdrop src="img/atardecer.png" t={t} at={-1} dur={14} z0={1.12} z1={1.24} y0={0} y1={-30} />;
}

/**
 * Frame 1: a giant poster "13" glitching in, with "años desde GTA 5" under it
 * (the hook, whole from the first frame). With "tres" the title steps aside
 * for "3 generaciones de consolas"; with "entender", "GTA 6" and the avatar
 * (video.tsx); with "principio" a rewind chip sends us back to 1997.
 */
export function Gancho() {
  const t = useClock();
  const tres = useCue("tres");
  const entender = useCue("entender");
  const principio = useCue("principio");
  const glitch = 1 - unit(t, 0, 0.55);
  const jitter = (s: number) => (glitch > 0 ? Math.sin(t * 90 + s) * 14 * glitch : 0);
  const hookOut = fade(t, tres - 0.15, 0.2);
  const gen = popAt(t, tres + 0.05);
  const genOut = fade(t, entender - 0.1, 0.2);
  const hit = bump(t, tres + 0.05, 0.4);
  const six = EASE.out(unit(t, entender - 0.1, 0.3));
  return (
    <Layer>
      {hookOut < 1 ? (
        <div className="absolute text-center" style={{ left: 36, top: 200, width: 468, opacity: 1 - hookOut, transform: `translateY(${-30 * hookOut}px)` }}>
          <div className="relative" style={{ height: 230 }}>
            {/* The glitch is colored shadows on the one "13", so the inspector reads a single number. */}
            <div
              className="absolute inset-0"
              style={{
                ...poster(250),
                transform: `translateX(${jitter(3) * 0.4}px) scale(${1 + 0.06 * glitch})`,
                textShadow: glitch > 0 ? `${jitter(1) - 14 * glitch}px 0 rgba(255,61,127,${0.85 * glitch}), ${jitter(2) + 14 * glitch}px 0 rgba(61,224,255,${0.85 * glitch}), 12px 15px 0 #111` : "12px 15px 0 #111",
              }}
            >
              13
            </div>
          </div>
          <div className="whitespace-nowrap" style={{ ...poster(44), marginTop: 6 }}>AÑOS DESDE GTA 5</div>
        </div>
      ) : null}
      {gen > 0 && genOut < 1 ? (
        <div className="absolute text-center" style={{ left: 36, top: 190, width: 468, opacity: Math.min(1, gen * 2) * (1 - genOut), transform: `scale(${0.7 + 0.3 * Math.min(1.05, gen)}) translateY(${4 * hit}px)` }}>
          <div style={poster(240)}>3</div>
          <div style={{ ...poster(50), marginTop: 10 }}>GENERACIONES</div>
          <div style={{ ...poster(42), marginTop: 6 }}>DE CONSOLAS</div>
        </div>
      ) : null}
      {six > 0 ? (
        <div className="absolute text-center" style={{ left: 36, top: 250, width: 468, opacity: six, transform: `translateY(${(1 - six) * 16}px)` }}>
          <div style={poster(110)}>GTA 6</div>
        </div>
      ) : null}
      <Chip at={principio - 0.1} x={300} y={410} tone="light">
        ◀◀ 1997
      </Chip>
    </Layer>
  );
}
