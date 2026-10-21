import { createContext, useContext } from "react";
import { normalizeWord } from "../../../media/src/words.ts";
import type { Timeline, TimelineScene } from "../timeline.ts";

export const SceneContext = createContext<TimelineScene | null>(null);
export const CapturesContext = createContext<Timeline["captures"]>(undefined);

/**
 * What a command of captures.json printed when video:capture ran it: its
 * steps, each with the command and its output lines, and the date. Show it
 * with captureLines() in a Terminal. Throws if the capture is missing or has
 * not run yet.
 */
export function useCapture(id: string) {
  const captures = useContext(CapturesContext);
  const capture = captures?.[id];
  if (!capture) throw new Error(`Capture "${id}" is not in captures.json, or it did not run: npm run video:capture -- content/<piece>`);
  return capture;
}

/**
 * Seconds from the start of the scene to when `word` is said (its `nth` time).
 * Visuals sync to the voice with it: `anim={{ en: useCue("ojo") }}`. If the
 * voice changes, everything moves with it.
 */
export function useCue(word: string, nth = 1): number {
  const scene = useContext(SceneContext);
  if (!scene) throw new Error("useCue only works inside a video scene");
  const target = normalizeWord(word);
  const hit = scene.words.filter((w) => normalizeWord(w.text) === target)[nth - 1];
  if (!hit) throw new Error(`"${word}" (time ${nth}) is not said in scene "${scene.id}". Words: ${scene.words.map((w) => w.text).join(" ")}`);
  return hit.startMs / 1000;
}
