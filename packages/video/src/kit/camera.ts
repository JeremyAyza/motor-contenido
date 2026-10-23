import { CAPTIONS_TOP, HEIGHT, TAB_BOTTOM, WIDTH } from "../timeline.ts";

/*
 * The camera of a stage (defineVideo({ stage })): pure math, so video:prepare
 * can read video.tsx in Node and the tests can check it without a browser.
 * Coordinates are design px of the stage's world; the camera puts a point of
 * the world at the center of the view and scales the world around it.
 */

/** A named zone of the world: where the camera can frame and labels can attach. */
export type SpotBox = { x: number; y: number; w: number; h: number };

/**
 * What a scene frames. `focus` is the id of a spot (stage.spots) or a point
 * of the world. Without `zoom`, a spot fills the view with a margin and a
 * point keeps the zoom it had. A scene without `camera` keeps the previous shot.
 */
export type Shot = { focus?: string | { x: number; y: number }; zoom?: number };

export type CameraState = { x: number; y: number; zoom: number };

/** The part of the frame the camera aims at: between the tab and the captions, the full width. */
export const VIEW = { x: 0, y: TAB_BOTTOM, w: WIDTH, h: CAPTIONS_TOP - TAB_BOTTOM };
const VIEW_CENTER = { x: VIEW.x + VIEW.w / 2, y: VIEW.y + VIEW.h / 2 };
/** How much of the view a framed spot leaves free around it. */
const SPOT_MARGIN = 0.12;
/** How long the camera takes to go from one scene's shot to the next. */
export const MOVE_MS = 900;
/** How much the camera closes in during a scene, so the image never stands still. */
export const DRIFT = 0.04;

/** The zoom that fits a box in the view, with the margin. */
export function fitZoom(box: { w: number; h: number }, margin = SPOT_MARGIN): number {
  return Math.min((VIEW.w * (1 - margin)) / box.w, (VIEW.h * (1 - margin)) / box.h);
}

/**
 * Each scene's shot as a point and a zoom. The first scene without a camera
 * frames the whole world; the others keep what the previous one framed.
 */
export function resolveShots(
  shots: Array<Shot | undefined>,
  world: { width: number; height: number; spots?: Record<string, SpotBox> },
): CameraState[] {
  const whole: CameraState = { x: world.width / 2, y: world.height / 2, zoom: fitZoom({ w: world.width, h: world.height }, 0) };
  const resolved: CameraState[] = [];
  for (const [i, shot] of shots.entries()) {
    const previous = resolved[i - 1] ?? whole;
    if (!shot) {
      resolved.push(previous);
      continue;
    }
    if (typeof shot.focus === "string") {
      const box = world.spots?.[shot.focus];
      if (!box) throw new Error(`camera.focus "${shot.focus}" is not a spot of the stage. Spots: ${Object.keys(world.spots ?? {}).join(", ") || "none"}`);
      resolved.push({ x: box.x + box.w / 2, y: box.y + box.h / 2, zoom: shot.zoom ?? fitZoom(box) });
    } else if (shot.focus) {
      resolved.push({ ...shot.focus, zoom: shot.zoom ?? previous.zoom });
    } else {
      resolved.push({ x: previous.x, y: previous.y, zoom: shot.zoom ?? previous.zoom });
    }
  }
  return resolved;
}

/** Slow at both ends, like a camera operator: no jump when a move starts or lands. */
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Where the camera is at `ms` of the whole video. At the start of each scene
 * it moves from the previous shot to the scene's in MOVE_MS; during the scene
 * it closes in by `drift`, continuing from where the previous drift left off.
 */
export function cameraAt(shots: CameraState[], durationsMs: number[], ms: number, { moveMs = MOVE_MS, drift = DRIFT } = {}): CameraState {
  let start = 0;
  let index = 0;
  while (index < durationsMs.length - 1 && ms >= start + durationsMs[index]) {
    start += durationsMs[index];
    index++;
  }
  const within = Math.max(0, ms - start);
  const to = shots[index];
  const from = index === 0 ? to : { ...shots[index - 1], zoom: shots[index - 1].zoom * (1 + drift) };
  const p = easeInOut(Math.min(1, within / moveMs));
  const progress = Math.min(1, within / Math.max(1, durationsMs[index]));
  return {
    x: from.x + (to.x - from.x) * p,
    y: from.y + (to.y - from.y) * p,
    zoom: from.zoom * Math.pow(to.zoom / from.zoom, p) * (1 + drift * progress),
  };
}

/** The CSS transform (origin 0 0) that puts the camera's point at the center of the view. */
export function cameraTransform({ x, y, zoom }: CameraState): string {
  return `translate(${VIEW_CENTER.x - x * zoom}px, ${VIEW_CENTER.y - y * zoom}px) scale(${zoom})`;
}

export const DEFAULT_WORLD = { width: WIDTH, height: HEIGHT };
