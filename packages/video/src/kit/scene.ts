import { createContext, useContext } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { normalizeWord } from "../../../media/src/words.ts";
import type { Timeline, TimelineScene } from "../timeline.ts";
import type { SpotBox } from "./camera.ts";

export const SceneContext = createContext<TimelineScene | null>(null);
export const CapturesContext = createContext<Timeline["captures"]>(undefined);

/**
 * The clock of a stage (defineVideo({ stage })), on the whole video's time:
 * the stage lives across scenes, so its world is not timed from a scene's start.
 */
export type StageClock = {
  /** ms from the start of the video. */
  ms: number;
  sceneIndex: number;
  sceneId: string;
  /** ms from the start of the current scene, and how long it lasts. */
  sceneMs: number;
  sceneDurationMs: number;
  scenes: TimelineScene[];
  spots: Record<string, SpotBox>;
};

export const StageContext = createContext<StageClock | null>(null);

/** True inside a stage's World: there, time is the whole video's. */
export const WorldContext = createContext(false);

/**
 * Seconds on the clock of where the component is: the whole video's inside a
 * stage's World, the scene's inside a scene's Visual. <Board> and <Label>
 * use it, so their `at` is useStageCue() in the world and useCue() in a scene.
 */
export function useClock(): number {
  const inWorld = useContext(WorldContext);
  const stage = useContext(StageContext);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return inWorld && stage ? stage.ms / 1000 : frame / fps;
}

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

/** Where the video is, for the stage's world: the time, the scene and its progress. Only inside a stage. */
export function useStage(): StageClock {
  const stage = useContext(StageContext);
  if (!stage) throw new Error("useStage only works in a video with defineVideo({ stage })");
  return stage;
}

/**
 * Seconds from the start of the VIDEO to when `word` is said in scene
 * `sceneId` (its `nth` time). The stage's world syncs to the voice with it:
 * `anim={{ en: useStageCue("memoria", "grieta") }}`. Inside a scene's Visual,
 * useCue gives the same moment from the scene's start.
 */
export function useStageCue(sceneId: string, word: string, nth = 1): number {
  const { scenes } = useStage();
  let offset = 0;
  for (const scene of scenes) {
    if (scene.id === sceneId) {
      const target = normalizeWord(word);
      const hit = scene.words.filter((w) => normalizeWord(w.text) === target)[nth - 1];
      if (!hit) throw new Error(`"${word}" (time ${nth}) is not said in scene "${sceneId}". Words: ${scene.words.map((w) => w.text).join(" ")}`);
      return (offset + hit.startMs) / 1000;
    }
    offset += scene.durationMs;
  }
  throw new Error(`useStageCue: "${sceneId}" is not a scene of the video. Scenes: ${scenes.map((s) => s.id).join(", ")}`);
}
