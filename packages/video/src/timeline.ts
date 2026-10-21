import type { AccountBrand, Palette } from "../../brand/src/index.ts";
import type { Art } from "../../carousel/src/post.ts";
import type { CaptureResult } from "./capture.ts";
import type { WordTiming } from "../../media/src/speech.ts";

export type { WordTiming };

/** A sound effect of a scene, from assets/catalog.json. */
export type TimelineSfx = { src: string; atMs: number; volume: number };

export type TimelineScene = {
  id: string;
  /** Narration audio, relative to the public folder. A storyboard has none. */
  voice?: string;
  /** The voice plus a short pause, in ms. */
  durationMs: number;
  words: WordTiming[];
  sfx: TimelineSfx[];
};

export type TimelineFont = { family: string; url: string; weight: string; style?: string; stretch?: string };

/** A music bed under the whole video, relative to the public folder. */
export type TimelineMusic = { src: string; volume: number };

/**
 * What `video:prepare` hands to Remotion (out/video/timeline.json): the timing
 * that comes from the voice and the files the composition needs. The visuals
 * come from the piece's video.tsx.
 */
export type Timeline = {
  piece: string;
  fps: number;
  width: number;
  height: number;
  /** The piece's art direction (video.json → art, or its carousel's post.json → art). */
  art: Art;
  palette: Palette;
  /** CSS font-family stacks for font-display, font-sans and font-notes. */
  fonts: { display: string; text: string; notes: string };
  faces: TimelineFont[];
  /** The text of the frame's tab: art.tab, or the topic of the folder + .md, as in the carousel. */
  tab: string;
  /** The account, for the signature of the frame. */
  brand: AccountBrand;
  /** What the commands of captures.json printed (video:capture), by id, for useCapture. */
  captures?: Record<string, CaptureResult & { about: string }>;
  /** Who spoke; a storyboard (video:storyboard) has no voice yet. */
  voice?: { provider: string; model: string; voice: string };
  scenes: TimelineScene[];
  music?: TimelineMusic;
};

/** When the voice speaks across the whole video: [startMs, endMs] per word, scene offsets added. */
export function speechSpans(timeline: Timeline): Array<[number, number]> {
  const spans: Array<[number, number]> = [];
  let offset = 0;
  for (const scene of timeline.scenes) {
    for (const w of scene.words) spans.push([offset + w.startMs, offset + w.endMs]);
    offset += scene.durationMs;
  }
  return spans;
}

const FADE_MS = 600;
const DUCK = 0.45;
const DUCK_RAMP_MS = 250;

/**
 * Music volume at a moment: it fades in and out, and goes down to DUCK while
 * the voice speaks, with a short ramp so the change is not heard as a jump.
 */
export function musicVolume(ms: number, totalMs: number, base: number, spans: Array<[number, number]>): number {
  const fade = Math.min(1, ms / FADE_MS, Math.max(0, totalMs - ms) / FADE_MS);
  let distance = Infinity;
  for (const [start, end] of spans) {
    if (ms >= start && ms <= end) {
      distance = 0;
      break;
    }
    distance = Math.min(distance, ms < start ? start - ms : ms - end);
  }
  const speaking = distance === Infinity ? 0 : Math.max(0, 1 - distance / DUCK_RAMP_MS);
  return base * fade * (1 - (1 - DUCK) * speaking);
}

export const FPS = 30;
/**
 * Design size: the carousel's 540 px wide canvas, so the primitives keep their
 * proportions. Renders go out at SCALE (1080×1920).
 */
export const WIDTH = 540;
export const HEIGHT = 960;
export const SCALE = 2;
/**
 * Smallest text in a video, in design px: 44 px at 1080 wide, the Remotion
 * skills' minimum for supporting text. The primitives' text sizes are written
 * as max(<carousel size>, var(--min-text)), so this floor only applies here.
 */
export const MIN_TEXT_PX = 22;

/**
 * The frame is the carousel's <Slide>: the file tab at the top, the dot
 * texture and the signature at the bottom, with its side padding (px-9).
 * The layout does not dodge Instagram's buttons and texts (Jeremy's call, 20
 * October 2026): inside the padding, the content uses the whole canvas. The
 * preview with the interface (instagram-ui.tsx) still shows what it covers.
 */
export const FRAME_PAD = 36;
/** Where <Slide>'s tab ends and its signature starts, in design px. */
export const TAB_BOTTOM = 42;
export const FOOTER_TOP = 903;
/** The part of the first frame the profile grid shows (3:4, centered). */
export const GRID_CROP = { top: (HEIGHT - (WIDTH * 4) / 3) / 2, bottom: (HEIGHT + (WIDTH * 4) / 3) / 2 };
/** The captions: a box of two lines (27 px at 1.25) right above the signature. */
export const CAPTIONS_TOP = 812;
export const CAPTIONS_HEIGHT = 68;
/**
 * Where a scene's title and drawing go. The title starts inside the 3:4 crop,
 * so the hook reads in the profile grid; the drawing ends above the captions.
 */
export const CONTENT_BOX = { top: GRID_CROP.top + 8, bottom: CAPTIONS_TOP - 16 };
/** Where text can go: inside the padding, between the tab and the captions. */
export const TEXT_ZONE = { left: FRAME_PAD, right: WIDTH - FRAME_PAD, top: TAB_BOTTOM, bottom: CAPTIONS_TOP };

/** Frame at a moment in ms. */
export const frameAt = (ms: number, fps: number) => Math.round((ms / 1000) * fps);
/** Frames that a span of ms lasts (at least one). */
export const framesFor = (ms: number, fps: number) => Math.max(1, Math.round((ms / 1000) * fps));
export const timelineMs = (timeline: Timeline) => timeline.scenes.reduce((sum, s) => sum + s.durationMs, 0);
