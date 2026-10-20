import type { ComponentType } from "react";
import type { Tone } from "../../../carousel/src/ui/index.tsx";

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
  sfx?: SceneSfx[];
  /**
   * What is seen, inside the frame (the tab, the dots and the signature come
   * from it): usually a SceneFrame. Times are seconds from the start of the
   * scene; useCue("word") says when a word is said.
   */
  Visual: ComponentType;
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
  scenes: SceneDef[];
};

export const defineVideo = (video: VideoDef) => video;

export { useCue } from "./scene.ts";
export { DRAWING_WIDTH, SceneFrame } from "./scene-frame.tsx";
