import { getLength, getPointAtLength } from "@remotion/paths";
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
 * `follow` travels along a path of the stage (stage.paths) during the scene,
 * from one fraction of it to another (0 is its start, 1 its end), like the
 * camera that follows the road in Rick's Reels. With `x`, it only travels
 * down (or up) the path and keeps that x: a winding road stays in the frame.
 */
export type Shot = { focus?: string | { x: number; y: number }; zoom?: number; follow?: { path: string; from: number; to: number; x?: number } };

/** A camera position; `track` is the path it travels while the scene lasts. */
export type CameraState = { x: number; y: number; zoom: number; track?: { d: string; from: number; to: number; x?: number } };

/** Where a tracking camera is at fraction `f` of its path, with its x held if the shot says so. */
function onTrack(track: NonNullable<CameraState["track"]>, f: number): { x: number; y: number } {
  const p = pointOnPath(track.d, f);
  return { x: track.x ?? p.x, y: p.y };
}

/** The point at fraction `f` (0 to 1) of an SVG path. */
export function pointOnPath(d: string, f: number): { x: number; y: number } {
  const point = getPointAtLength(d, getLength(d) * Math.max(0, Math.min(1, f)));
  if (!point) throw new Error(`No point at ${f} of the path "${d.slice(0, 40)}"`);
  return { x: point.x, y: point.y };
}

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
  world: { width: number; height: number; spots?: Record<string, SpotBox>; paths?: Record<string, string> },
): CameraState[] {
  const whole: CameraState = { x: world.width / 2, y: world.height / 2, zoom: fitZoom({ w: world.width, h: world.height }, 0) };
  const resolved: CameraState[] = [];
  for (const [i, shot] of shots.entries()) {
    const previous = resolved[i - 1] ?? whole;
    if (!shot) {
      resolved.push(previous);
      continue;
    }
    if (shot.follow) {
      const d = world.paths?.[shot.follow.path];
      if (!d) throw new Error(`camera.follow "${shot.follow.path}" is not a path of the stage. Paths: ${Object.keys(world.paths ?? {}).join(", ") || "none"}`);
      const track = { d, from: shot.follow.from, to: shot.follow.to, ...(shot.follow.x === undefined ? {} : { x: shot.follow.x }) };
      resolved.push({ ...onTrack(track, track.from), zoom: shot.zoom ?? previous.zoom, track });
    } else if (typeof shot.focus === "string") {
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
  const before = shots[index - 1];
  // A shot that followed a path ends where the path ends: the next move starts there.
  const from = index === 0 ? to : { ...(before.track ? onTrack(before.track, before.track.to) : before), zoom: before.zoom * (1 + drift) };
  const p = easeInOut(Math.min(1, within / moveMs));
  const progress = Math.min(1, within / Math.max(1, durationsMs[index]));
  // While it follows a path, the target travels along it once the move in is over.
  const target = to.track
    ? onTrack(to.track, to.track.from + (to.track.to - to.track.from) * easeInOut(Math.max(0, Math.min(1, (within - moveMs) / Math.max(1, durationsMs[index] - moveMs)))))
    : to;
  return {
    x: from.x + (target.x - from.x) * p,
    y: from.y + (target.y - from.y) * p,
    zoom: from.zoom * Math.pow(to.zoom / from.zoom, p) * (1 + drift * progress),
  };
}

/** The CSS transform (origin 0 0) that puts the camera's point at the center of the view. */
export function cameraTransform({ x, y, zoom }: CameraState): string {
  return `translate(${VIEW_CENTER.x - x * zoom}px, ${VIEW_CENTER.y - y * zoom}px) scale(${zoom})`;
}

/** Whether the camera leaves for a new shot when scene `i` starts (it whooshes and cuts the world to MOVE_CLIP). */
export function movesInto(shots: CameraState[], i: number): boolean {
  if (i <= 0) return false;
  const [a, b] = [shots[i - 1], shots[i]];
  return Boolean(b.track) || b.x !== a.x || b.y !== a.y || b.zoom !== a.zoom;
}

/**
 * The band the world keeps while the camera moves: from under the chapter
 * bar (top-[58px] plus its two rows end at 85 px, frame.tsx; the fade starts
 * after them) to the captions. The frame's tab, bar, meter, captions and
 * signature have no background of their own, so without the cut the world
 * crosses them on its way to the next shot.
 */
export const MOVE_CLIP = { top: 100, bottom: CAPTIONS_TOP, feather: 14 };
/** How long the cut takes to close at the start of a move and to open at its end. */
const CLIP_RAMP_MS = 150;

/**
 * How much the world is cut to MOVE_CLIP at `ms` of the whole video: 0 while
 * the camera rests on a shot (still frames keep the whole world) and 1 during
 * a move, with a ramp of CLIP_RAMP_MS at each end, where the eased camera has
 * barely moved, so the cut never pops.
 */
export function moveClipAt(shots: CameraState[], durationsMs: number[], ms: number, moveMs = MOVE_MS): number {
  let start = 0;
  let index = 0;
  while (index < durationsMs.length - 1 && ms >= start + durationsMs[index]) {
    start += durationsMs[index];
    index++;
  }
  if (!movesInto(shots, index)) return 0;
  const within = ms - start;
  if (within >= moveMs) return 0;
  return Math.max(0, Math.min(1, within / CLIP_RAMP_MS, (moveMs - within) / CLIP_RAMP_MS));
}

/** The CSS mask that cuts the world to MOVE_CLIP by `amount` (0 to 1); none at 0. */
export function moveClipMask(amount: number): string | undefined {
  if (amount <= 0) return undefined;
  const { top, bottom, feather } = MOVE_CLIP;
  const out = `rgba(0,0,0,${(1 - amount).toFixed(3)})`;
  return `linear-gradient(to bottom, ${out} ${top - feather}px, #000 ${top}px, #000 ${bottom - feather}px, ${out} ${bottom}px)`;
}

export const DEFAULT_WORLD = { width: WIDTH, height: HEIGHT };
