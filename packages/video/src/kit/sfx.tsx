import { Audio } from "@remotion/media";
import { createContext, useContext, type ReactNode } from "react";
import { Sequence, spring, staticFile, useVideoConfig } from "remotion";
import { useClock } from "./scene.ts";

/**
 * The sound effects of the catalog (assets/catalog.json, CC0 with their
 * license checked), by id: video:prepare copies them all to the public folder
 * and the timeline says where each one is. A storyboard has none (it is muted).
 */
export const SoundsContext = createContext<Record<string, string>>({});

/** The default volume of the kit's own sounds: under the voice and the music. */
export const KIT_VOLUME = 0.22;

/**
 * A sound effect at `at` seconds, on the clock of where it is (useStageCue in
 * the world, useCue in a scene), like <Label> and <Board>. Ids are the
 * catalog's: pop, blip, click, switch, whip, whoosh, moneda,
 * caja-registradora, golpe, auto-pasa, obturador, page-turn.
 */
export function Sfx({ id, at, volume = KIT_VOLUME }: { id: string; at: number; volume?: number }) {
  const sounds = useContext(SoundsContext);
  const { fps } = useVideoConfig();
  const src = sounds[id];
  if (!src || at < 0) return null;
  return (
    <Sequence from={Math.round(at * fps)} name={`sfx ${id}`} layout="none">
      <Audio src={staticFile(src)} volume={volume} />
    </Sequence>
  );
}

/** A spring with overshoot from `at` seconds, on the clock of where it is: 0 before, about 1 after. */
export function usePop(at: number): number {
  const t = useClock();
  return t < at ? 0 : spring({ frame: (t - at) * 30, fps: 30, config: { damping: 10, stiffness: 180 } });
}

/**
 * Pops its children in at `at` (a spring with overshoot) with the pop sound:
 * every object that appears sounds without writing sfx by hand. With `x` and
 * `y` (world or scene coordinates) it scales around that point, and the
 * children place themselves from it (a prop at x={0} y={0} stands on it).
 */
export function Pop({ at, x, y, sound = "pop", children, className }: { at: number; x?: number; y?: number; sound?: string | null; children: ReactNode; className?: string }) {
  const p = usePop(at);
  const anchored = x !== undefined && y !== undefined;
  return (
    <>
      {sound ? <Sfx id={sound} at={at} /> : null}
      <div
        className={className}
        style={{
          ...(anchored ? { position: "absolute", left: x, top: y, transformOrigin: "0 0" } : {}),
          transform: `scale(${p})`,
          opacity: Math.min(1, p * 2),
        }}
      >
        {children}
      </div>
    </>
  );
}
