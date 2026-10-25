import { Img, spring, useCurrentFrame } from "remotion";
import { useAssets } from "../../../carousel/src/ui/index.tsx";
import type { TimelineScene } from "../timeline.ts";
import { CAPTIONS_TOP } from "../timeline.ts";

type Box = { x: number; y: number; w: number; h: number };

/**
 * The account's avatar (docs/plan-piloto-automatico.md, phase 4): Jeremy's
 * illustration without background, plus variants made from it with
 * video:image --ref that differ only in the mouth or the eyes. Only those
 * boxes are taken from the variants, so the drawing stays the original.
 */
export type AvatarDef = {
  /** The illustration without background, relative to the piece folder. */
  base: string;
  /** Mouths from least to most open: the louder the voice, the more open. */
  mouths: string[];
  /** The same drawing with the eyes closed. */
  blink: string;
  /** Where the mouth and the eyes are, in px of the source image. */
  mouthBox: Box;
  eyesBox: Box;
  /** Side of the source image in px (it is square). */
  imageSize: number;
  /** Side of the avatar on the canvas, in design px: 220 by default. */
  size?: number;
  /**
   * Where its top is, in design px. By default it stands on the captions;
   * a video without captions can lower it to the footer.
   */
  top?: number;
  /** The scenes it shows in; all of them by default. */
  scenes?: string[];
  /**
   * "bust" (by default) stands at the bottom left; "bubble" is the head in a
   * circle, like a creator's face cam, wherever each scene puts it
   * (SceneDef.avatar), and only in those scenes.
   */
  shape?: "bust" | "bubble";
  /** The square of the source image the bubble shows (the head), in px. */
  bubbleCrop?: Box;
};

/** Levels under this are silence; over OPEN, the widest mouth. */
const QUIET = 0.12;
const OPEN = 0.45;
const BLINK_EVERY = 105;
const BLINK_FRAMES = 4;

/** How open the mouth is in a frame: 0 closed, then each mouth in order. */
export function mouthAt(scene: TimelineScene, frame: number, fps: number, mouths: number): number {
  if (scene.levels) {
    const level = scene.levels[frame] ?? 0;
    if (level < QUIET) return 0;
    return level < OPEN ? 1 : mouths;
  }
  // A storyboard has no voice: the mouth moves on the words, alternating.
  const ms = (frame / fps) * 1000;
  const word = scene.words.findIndex((w) => ms >= w.startMs && ms < w.endMs);
  if (word < 0) return 0;
  return 1 + ((frame >> 2) % mouths);
}

/** Blinks every ~3.5 s, shifted per scene so it never looks like a loop. */
export function blinkAt(frame: number, sceneIndex: number): boolean {
  // Offset so the first frame (the cover) never has the eyes closed.
  return (frame + 60 + sceneIndex * 37) % BLINK_EVERY < BLINK_FRAMES;
}

function Layer({ src, size, imageSize, clip, offset }: { src: string; size: number; imageSize: number; clip?: Box; offset?: { x: number; y: number } }) {
  const url = useAssets().image(src);
  const pct = (v: number) => `${(v / imageSize) * 100}%`;
  const clipPath = clip ? `inset(${pct(clip.y)} ${pct(imageSize - clip.x - clip.w)} ${pct(imageSize - clip.y - clip.h)} ${pct(clip.x)})` : undefined;
  return <Img src={url} alt="" className="absolute max-w-none" style={{ left: offset?.x ?? 0, top: offset?.y ?? 0, width: size, height: size, clipPath }} />;
}

/** The avatar's head in a circle with a white ring, popping in when the scene starts. */
export function AvatarBubble({ def, scene, sceneIndex, fps, place }: { def: AvatarDef; scene: TimelineScene; sceneIndex: number; fps: number; place: { x: number; y: number; size: number } }) {
  const frame = useCurrentFrame();
  const crop = def.bubbleCrop ?? { x: 0, y: 0, w: def.imageSize, h: def.imageSize };
  const scale = place.size / crop.w;
  const full = def.imageSize * scale;
  const offset = { x: -crop.x * scale, y: -crop.y * scale };
  const open = mouthAt(scene, frame, fps, def.mouths.length);
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 170 } });
  const level = scene.levels?.[frame] ?? (open ? 0.4 : 0);
  return (
    <div
      data-avatar=""
      className="pointer-events-none absolute z-20 overflow-hidden rounded-full bg-[#F2F0EA] ring-[5px] ring-white shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
      style={{ left: place.x - place.size / 2, top: place.y - place.size / 2, width: place.size, height: place.size, transform: `scale(${pop}) translateY(${-level * 2}px)` }}
    >
      <Layer src={def.base} size={full} imageSize={def.imageSize} offset={offset} />
      {open ? <Layer src={def.mouths[open - 1]} size={full} imageSize={def.imageSize} clip={def.mouthBox} offset={offset} /> : null}
      {blinkAt(frame, sceneIndex) ? <Layer src={def.blink} size={full} imageSize={def.imageSize} clip={def.eyesBox} offset={offset} /> : null}
    </div>
  );
}

/** The avatar at the bottom left, over the scene and under the captions. */
export function Avatar({ def, scene, sceneIndex, fps }: { def: AvatarDef; scene: TimelineScene; sceneIndex: number; fps: number }) {
  const frame = useCurrentFrame();
  if (def.shape === "bubble" || (def.scenes && !def.scenes.includes(scene.id))) return null;
  const size = def.size ?? 220;
  const open = mouthAt(scene, frame, fps, def.mouths.length);
  const level = scene.levels?.[frame] ?? (open ? 0.4 : 0);
  const breathe = 1 + Math.sin((frame / fps) * 2.2) * 0.008;
  return (
    <div
      data-avatar=""
      className="pointer-events-none absolute left-0"
      style={{ top: def.top ?? CAPTIONS_TOP - size + 6, width: size, height: size, transform: `translateY(${-level * 3}px) scaleY(${breathe})`, transformOrigin: "50% 100%" }}
    >
      <Layer src={def.base} size={size} imageSize={def.imageSize} />
      {open ? <Layer src={def.mouths[open - 1]} size={size} imageSize={def.imageSize} clip={def.mouthBox} /> : null}
      {blinkAt(frame, sceneIndex) ? <Layer src={def.blink} size={size} imageSize={def.imageSize} clip={def.eyesBox} /> : null}
    </div>
  );
}
