import type { ComponentType } from "react";
import type { Tone } from "../../../carousel/src/ui/index.tsx";
import type { Shot, SpotBox } from "./camera.ts";
import type { MeterDef } from "./meter.ts";

/**
 * What a piece's video.tsx uses (`@motor/video`). It imports nothing that
 * needs the browser, because video:prepare also reads video.tsx in Node.
 */

export type SceneSfx = {
  /** Asset id from assets/catalog.json. */
  asset: string;
  /** A word the voice says in the scene (video.json → scenes[].say) or seconds from the start of the scene. */
  at: string | number;
  /** From 0 to 1. The voice comes first: 0.5 by default. */
  volume?: number;
};

export type SceneDef = {
  /** The id of a scene of video.json, which holds what the voice says (approved at gate A). */
  id: string;
  /**
   * The tone of the palette for the scene's frame, as in the carousel's
   * <Slide>: "base" by default. Changing tones between scenes gives rhythm
   * without leaving the palette.
   */
  tone?: Tone;
  /** The scene's name in the chapter bar (VideoDef.chapters): one or two words. */
  chapter?: string;
  sfx?: SceneSfx[];
  /**
   * What the camera frames in this scene, when the video has a stage: a spot
   * of the stage (`{ focus: "memoria" }`), a point of its world, a zoom. The
   * camera moves there when the scene starts; without it, it keeps the shot.
   */
  camera?: Shot;
  /**
   * What is seen, inside the frame (the tab, the dots and the signature come
   * from it): usually a SceneFrame. Times are seconds from the start of the
   * scene; useCue("word") says when a word is said. With a stage it is
   * optional, and it goes over the world: the labels of this scene only.
   */
  Visual?: ComponentType;
};

/**
 * A world that lasts the whole video (docs/plan-piloto-automatico.md, phase
 * 1): mounted once, under the frame, with a camera that moves between the
 * scenes' shots instead of cutting. Its components time themselves on the
 * whole video with useStage() and useStageCue(); the carousel primitives'
 * `anim` take seconds from the start of the video.
 */
export type StageDef = {
  /** The world, drawn in its own coordinates (design px, from the top left). */
  World: ComponentType;
  /** The size of the world. By default, the frame's (540×960). */
  width?: number;
  height?: number;
  /** Named zones the camera frames and <Spot> places things on: `{ memoria: { x, y, w, h } }`. */
  spots?: Record<string, SpotBox>;
  /** How much the camera closes in during each scene (0.04 by default; 0 keeps it still). */
  drift?: number;
};

/**
 * The look comes from the art direction (video.json → art, or the carousel's
 * post.json → art): palette, fonts, anchor and tab. video.tsx holds the
 * composition of each scene.
 */
export type VideoDef = {
  /** Overrides the account voice (accounts/<account>.json → voice) for this piece. */
  voice?: { voice?: string; style?: string };
  /**
   * A music bed under the whole video, looped if it is shorter: a file of the
   * piece (`file: "audio/bed.mp3"`, from video:music) or a catalog asset
   * (`asset: "<id>"`). It goes down while the voice speaks. Volume from 0 to
   * 1, 0.12 by default: the voice comes first.
   */
  music?: { file?: string; asset?: string; volume?: number };
  /**
   * How the captions mark the voice: "highlight" (the word being said in the
   * accent, by default), "pill" (a pill where the words said so far are in ink
   * and the rest are dimmed) or "marker" (the word being said on an accent box).
   * The art direction picks the one that fits its world.
   */
  captions?: CaptionStyle;
  /**
   * Shows the chapter bar under the frame's tab, a HUD of the video: one
   * segment per scene that fills as it plays, and the number and `chapter`
   * of the current one.
   */
  chapters?: boolean;
  /** The world of the video, with its camera. Without it, each scene is its own slide. */
  stage?: StageDef;
  /**
   * The meter of the HUD, at the right of the tab: what video.json → meter
   * says is at stake, from `start` at the hook through `steps` (a value when
   * a word is said) to the close. Works with and without a stage.
   */
  meter?: MeterDef;
  scenes: SceneDef[];
};

export type CaptionStyle = "highlight" | "pill" | "marker";

export const defineVideo = (video: VideoDef) => video;

export { useCapture, useCue, useStage, useStageCue } from "./scene.ts";
export type { Shot, SpotBox } from "./camera.ts";
export type { MeterDef, MeterKind, MeterStep } from "./meter.ts";
export { Board, Label, Spot } from "./world.tsx";
export type { LabelPlace, LabelTone } from "./world.tsx";
export type { BoardEdge, BoardEvent, BoardNode, BoardPacket, NodeState } from "./board.ts";
export { useClock } from "./scene.ts";
export { DRAWING_WIDTH, SceneFrame } from "./scene-frame.tsx";
export { AppCard, BrowserBar, captureLines, Chat, Chip, DataTable, Diff, Phone, Terminal } from "./stage.tsx";
export type { ChatMessage, DataRow, DiffLine, TerminalLine } from "./stage.tsx";
