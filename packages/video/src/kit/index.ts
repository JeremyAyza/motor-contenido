import type { ComponentType } from "react";
import type { Tone } from "../../../carousel/src/ui/index.tsx";
import type { Shot, SpotBox } from "./camera.ts";
import type { AvatarDef } from "./avatar.tsx";
import type { MeterDef } from "./meter.ts";
import type { PanelDef } from "./panel.ts";
import type { SceneBackground, SceneTransition } from "./scene-fx.tsx";

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
   * Seconds the scene stays on screen after the voice ends: a silent beat for
   * a punchline, a reveal or a transition, as the references do. 0 by default.
   */
  hold?: number;
  /** Without a stage: a pattern over the scene's tone ("grid", "stripes"). */
  background?: SceneBackground;
  /** Without a stage: how the scene comes in ("blur", "zoom", "slide", "whip"), with a whoosh. */
  transition?: SceneTransition;
  /**
   * Where the avatar goes in this scene when it is a bubble (AvatarDef.shape
   * "bubble"): its center and size in design px. Scenes without it have no avatar.
   */
  avatar?: { x: number; y: number; size: number };
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
  /**
   * Named SVG paths in the world's coordinates (`{ ruta: "M 0 300 C ..." }`):
   * <RoadPath> draws them, <Along> and <Traffic> travel them, and a scene's
   * camera can follow one (`camera: { follow: { path, from, to } }`).
   */
  paths?: Record<string, string>;
  /** A whoosh each time the camera moves to a new shot: on by default, false to mute it. */
  sfx?: boolean;
};

/**
 * The look comes from the art direction (video.json → art, or the carousel's
 * post.json → art): palette, fonts, anchor and tab. video.tsx holds the
 * composition of each scene.
 */
export type VideoDef = {
  /**
   * Overrides the account voice (accounts/<account>.json → voice) for this
   * piece. `tempo` speeds the generated voice up (1.12 is the account's): a
   * replica can use it to reach its reference's length without cutting content.
   */
  voice?: { voice?: string; style?: string; tempo?: number };
  /**
   * A music bed under the whole video, looped if it is shorter: a file of the
   * piece (`file: "audio/bed.mp3"`, from video:music) or a catalog asset
   * (`asset: "<id>"`). It goes down while the voice speaks. Volume from 0 to
   * 1, 0.06 by default: the voice comes first.
   */
  music?: { file?: string; asset?: string; volume?: number };
  /**
   * How the captions mark the voice: "highlight" (the word being said in the
   * accent, by default), "pill" (a pill where the words said so far are in ink
   * and the rest are dimmed), "marker" (the word being said on an accent box) or
   * "card" (the phrase big on a dark card, next to the avatar) or "none" (no
   * captions: the scenes carry the words in big titles).
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
  /**
   * The account's avatar at the bottom left, its mouth moved by the voice
   * (kit/avatar.tsx). `{}` draws it as assets/avatar/manifest.json says.
   */
  avatar?: AvatarDef;
  /**
   * The HUD board under the chapter bar, like the taximeter of Rick's Reels:
   * rows with the active one marked, counters that count live, a footer
   * (kit/panel.ts). It replaces the meter.
   */
  panel?: PanelDef;
  /**
   * Which parts of the frame show: the file tab, the dot texture and the
   * signature. All on by default; a piece turns some off for full-bleed
   * scenes (docs/direccion-reels.md). It is per piece, not a rule.
   */
  frame?: { tab?: boolean; dots?: boolean; signature?: boolean };
  scenes: SceneDef[];
};

export type CaptionStyle = "highlight" | "pill" | "marker" | "card" | "none";

export const defineVideo = (video: VideoDef) => video;

export { useCapture, useCue, useStage, useStageCue } from "./scene.ts";
export type { Shot, SpotBox } from "./camera.ts";
export type { MeterDef, MeterKind, MeterStep } from "./meter.ts";
export type { AvatarDef, AvatarSprites } from "./avatar.tsx";
export type { PanelCounter, PanelDef } from "./panel.ts";
export { Pop, Sfx, usePop } from "./sfx.tsx";
export { Banner, PillTitle } from "./text.tsx";
export type { SceneBackground, SceneTransition } from "./scene-fx.tsx";
export { Along, Booth, Building, Bush, Car, Cloud, Coin, Cone, Document, House, Laptop, Machine, Person, Pine, pointAlong, RoadPath, Server, Sign, StreetLamp, Traffic, TrafficLight, Tree, Truck, usePath, Warehouse } from "./props.tsx";
export { Board, Label, Plate, Spot } from "./world.tsx";
export type { LabelPlace, LabelTone } from "./world.tsx";
export type { BoardEdge, BoardEvent, BoardNode, BoardPacket, NodeState } from "./board.ts";
export { fan } from "./board.ts";
export { useClock } from "./scene.ts";
export { DRAWING_WIDTH, SceneFrame } from "./scene-frame.tsx";
export { AppCard, BrowserBar, captureLines, Chat, Chip, DataTable, Diff, Phone, Terminal } from "./stage.tsx";
export type { ChatMessage, DataRow, DiffLine, TerminalLine } from "./stage.tsx";
