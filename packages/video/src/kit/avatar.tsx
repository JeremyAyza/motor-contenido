import { Img, spring, useCurrentFrame } from "remotion";
import { normalizeWord } from "../../../media/src/words.ts";
import type { TimelineScene } from "../timeline.ts";
import { CAPTIONS_TOP, CONTENT_BOX, FRAME_PAD, frameAt, HEIGHT, WIDTH } from "../timeline.ts";

type Box = { x: number; y: number; w: number; h: number };

/**
 * The drawing of an avatar: Jeremy's illustration without background, plus
 * variants made from it with video:image --ref that differ only in the mouth
 * or the eyes. Only those boxes are taken from the variants, so the drawing
 * stays the original. The account's is in assets/avatar/manifest.json.
 */
export type AvatarSprites = {
  /** The illustration without background. */
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
  /** The square of the source image the bubble shows (the head), in px. */
  bubbleCrop?: Box;
};

/**
 * The avatar of a video (docs/plan-piloto-automatico.md, phase 4).
 * `avatar: {}` draws the account's, which video:prepare copies to the public
 * folder. What the piece gives replaces it field by field: its own sprites go
 * relative to the piece folder.
 */
export type AvatarDef = Partial<AvatarSprites> & {
  /** Side of the avatar on the canvas, in design px: 220 by default (132 for a bubble). */
  size?: number;
  /**
   * Where its top is, in design px. By default it stands on the captions;
   * a video without captions can lower it to the footer.
   */
  top?: number;
  /** The scenes it shows in; all of them by default. A scene with its own `avatar` shows it anyway. */
  scenes?: string[];
  /**
   * "bust" (by default) stands at the bottom left; "bubble" is the head in a
   * circle, like a creator's face cam, wherever each scene puts it
   * (SceneDef.avatar), and only in those scenes. It stays for earlier pieces:
   * a new one never uses it (docs/direccion-reels.md, 6).
   */
  shape?: AvatarShape;
};

export type AvatarShape = "bust" | "bubble";
export type AvatarEdge = "left" | "right" | "bottom";

/** A moment of a scene: seconds from its start, or a word the voice says (`{ word, nth }` for a later time it says it). */
export type SceneCue = number | string | { word: string; nth: number };

/** The avatar in one scene (SceneDef.avatar): where it goes, how it is drawn and when it is on screen. */
export type SceneAvatar = {
  /** Its center, in design px, for both shapes. By default, the bottom corner of the side it comes from (the left one otherwise). */
  x?: number;
  y?: number;
  /** Its side (a bubble's diameter), in design px. By default AvatarDef.size. */
  size?: number;
  /** The shape in this scene, over AvatarDef.shape. */
  shape?: AvatarShape;
  /** When it comes in. Without it, a bubble pops in when the scene starts and a bust is already there. */
  at?: SceneCue;
  /** When it starts to leave. Without it, it stays until the scene ends. */
  until?: SceneCue;
  /**
   * The edge it peeks in from and goes back to. Without it, it pops in and out
   * where it stands. To stay half out, put `x` or `y` near that edge. "bottom"
   * rises from its own base and never crosses the captions.
   */
  from?: AvatarEdge;
};

/** An avatar ready to draw: every sprite is a URL. */
export type DrawnAvatar = AvatarDef & AvatarSprites;

const REQUIRED = ["base", "mouths", "blink", "mouthBox", "eyesBox", "imageSize"] as const;

/**
 * The piece's avatar over the account's. `url` turns a file into a URL: the
 * piece's are relative to its folder, the account's to the public folder.
 */
export function drawnAvatar(def: AvatarDef, account: AvatarSprites | undefined, url: { piece: (src: string) => string; account: (src: string) => string }): DrawnAvatar {
  const files = (sprites: Partial<AvatarSprites>, to: (src: string) => string) => ({
    ...(sprites.base ? { base: to(sprites.base) } : {}),
    ...(sprites.mouths ? { mouths: sprites.mouths.map(to) } : {}),
    ...(sprites.blink ? { blink: to(sprites.blink) } : {}),
  });
  const avatar: Partial<DrawnAvatar> = { ...account, ...(account ? files(account, url.account) : {}), ...def, ...files(def, url.piece) };
  const missing = REQUIRED.filter((key) => avatar[key] === undefined);
  if (missing.length) {
    throw new Error(
      account
        ? `The avatar is missing ${missing.join(", ")}`
        : `The video has an avatar, but the account has none (assets/avatar/manifest.json, copied by video:prepare) and video.tsx does not give ${missing.join(", ")}`,
    );
  }
  return avatar as DrawnAvatar;
}

export type AvatarPlace = { shape: AvatarShape; x: number; y: number; size: number };

const BUST_SIZE = 220;
const BUBBLE_SIZE = 132;

/**
 * Where the avatar goes in a scene, or null if it is not in it: a scene with
 * its own `avatar` always has it; without one, only the video's bust shows,
 * in the scenes AvatarDef.scenes lets it.
 */
export function avatarPlace(def: Pick<AvatarDef, "shape" | "size" | "top" | "scenes">, moment: SceneAvatar | undefined, sceneId: string): AvatarPlace | null {
  const shape = moment?.shape ?? def.shape ?? "bust";
  if (!moment && (shape === "bubble" || (def.scenes && !def.scenes.includes(sceneId)))) return null;
  const bubble = shape === "bubble";
  const size = moment?.size ?? def.size ?? (bubble ? BUBBLE_SIZE : BUST_SIZE);
  // The bust stands on the captions, against the edge; the bubble floats inside the frame's padding.
  const inset = bubble ? FRAME_PAD + size / 2 : size / 2;
  const top = def.top ?? (bubble ? CONTENT_BOX.bottom - size : CAPTIONS_TOP - size + 6);
  return { shape, size, x: moment?.x ?? (moment?.from === "right" ? WIDTH - inset : inset), y: moment?.y ?? top + size / 2 };
}

/** A moment of a scene in ms from its start. Throws if the voice does not say the word, like useCue. */
export function cueMs(cue: SceneCue, scene: Pick<TimelineScene, "id" | "words">): number {
  if (typeof cue === "number") return cue * 1000;
  const { word, nth } = typeof cue === "string" ? { word: cue, nth: 1 } : cue;
  const target = normalizeWord(word);
  const hit = scene.words.filter((w) => normalizeWord(w.text) === target)[nth - 1];
  if (!hit) throw new Error(`avatar: "${word}" (time ${nth}) is not said in scene "${scene.id}". Words: ${scene.words.map((w) => w.text).join(" ")}`);
  return hit.startMs;
}

const POP = { damping: 12, stiffness: 170 };
/** Firmer than the pop: it travels far, and the pop's bounce would overshoot by a fifth of the way. */
const PEEK = { damping: 16, stiffness: 170 };
const LEAVE_S = 0.25;

/**
 * How far in the avatar is at a frame of the scene: 0 is not there, about 1
 * is in its place, with the spring's overshoot on the way. Throws on moments
 * that would leave it off screen without saying so.
 */
export function avatarPresence(moment: SceneAvatar | undefined, shape: AvatarShape, scene: Pick<TimelineScene, "id" | "durationMs" | "words">, frame: number, fps: number): number {
  const at = moment?.at === undefined ? 0 : cueMs(moment.at, scene);
  const until = moment?.until === undefined ? undefined : cueMs(moment.until, scene);
  if (at >= scene.durationMs) throw new Error(`avatar: in scene "${scene.id}" it comes in at ${at} ms and the scene lasts ${scene.durationMs} ms`);
  if (until !== undefined && until <= at) throw new Error(`avatar: in scene "${scene.id}" it leaves (until) at ${until} ms, before it comes in (at) at ${at} ms`);
  // A bust with no moment is already there on the first frame, which can be the cover.
  const comes = shape === "bubble" || moment?.at !== undefined || moment?.from !== undefined;
  const start = frameAt(at, fps);
  const enter = !comes ? 1 : frame < start ? 0 : spring({ frame: frame - start, fps, config: moment?.from ? PEEK : POP });
  if (until === undefined) return enter;
  const out = Math.max(0, Math.min(1, (frame - frameAt(until, fps)) / (LEAVE_S * fps)));
  return enter * (1 - out * out);
}

/** How far past an edge it starts, so the ring and the shadow of a bubble are out too. */
const OUTSIDE = 40;

/** The line an avatar coming from below rises out of: its own base, or the captions' top if it stands higher. */
export const riseLine = (place: AvatarPlace) => Math.max(place.y + place.size / 2, CAPTIONS_TOP);

/** Where it starts when it peeks in from an edge, relative to its place. */
export function edgeOffset(from: AvatarEdge, place: AvatarPlace): { x: number; y: number } {
  const half = place.size / 2;
  if (from === "left") return { x: -(place.x + half + OUTSIDE), y: 0 };
  if (from === "right") return { x: WIDTH - place.x + half + OUTSIDE, y: 0 };
  return { x: 0, y: riseLine(place) - (place.y - half) + OUTSIDE };
}

/** The transform for how far in it is: it slides from its edge, or pops where it stands. */
export function avatarMotion(p: number, from: AvatarEdge | undefined, place: AvatarPlace): string {
  if (!from) return `scale(${p})`;
  const start = edgeOffset(from, place);
  return `translate(${start.x * (1 - p)}px, ${start.y * (1 - p)}px)`;
}

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
  const pct = (v: number) => `${(v / imageSize) * 100}%`;
  const clipPath = clip ? `inset(${pct(clip.y)} ${pct(imageSize - clip.x - clip.w)} ${pct(imageSize - clip.y - clip.h)} ${pct(clip.x)})` : undefined;
  return <Img src={src} alt="" className="absolute max-w-none" style={{ left: offset?.x ?? 0, top: offset?.y ?? 0, width: size, height: size, clipPath }} />;
}

/** The drawing with this frame's mouth and eyes. */
function Face({ def, size, offset, open, blink }: { def: DrawnAvatar; size: number; offset?: { x: number; y: number }; open: number; blink: boolean }) {
  return (
    <>
      <Layer src={def.base} size={size} imageSize={def.imageSize} offset={offset} />
      {open ? <Layer src={def.mouths[open - 1]} size={size} imageSize={def.imageSize} clip={def.mouthBox} offset={offset} /> : null}
      {blink ? <Layer src={def.blink} size={size} imageSize={def.imageSize} clip={def.eyesBox} offset={offset} /> : null}
    </>
  );
}

/**
 * The avatar in a scene, over the scene and under the captions: the bust at
 * the bottom left, or the head in a circle with a white ring, for the moment
 * the scene says (SceneAvatar).
 */
export function Avatar({ def, moment, scene, sceneIndex, fps }: { def: DrawnAvatar; moment: SceneAvatar | undefined; scene: TimelineScene; sceneIndex: number; fps: number }) {
  const frame = useCurrentFrame();
  const place = avatarPlace(def, moment, scene.id);
  if (!place) return null;
  const p = avatarPresence(moment, place.shape, scene, frame, fps);
  if (p <= 0) return null;
  const { size } = place;
  const open = mouthAt(scene, frame, fps, def.mouths.length);
  const level = scene.levels?.[frame] ?? (open ? 0.4 : 0);
  const blink = blinkAt(frame, sceneIndex);
  const box = { left: place.x - size / 2, top: place.y - size / 2, width: size, height: size };
  const motion = avatarMotion(p, moment?.from, place);
  let drawn;
  if (place.shape === "bubble") {
    const crop = def.bubbleCrop ?? { x: 0, y: 0, w: def.imageSize, h: def.imageSize };
    const scale = size / crop.w;
    drawn = (
      <div
        data-avatar=""
        className="pointer-events-none absolute z-20 overflow-hidden rounded-full bg-[#F2F0EA] ring-[5px] ring-white shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
        style={{ ...box, transform: `${motion} translateY(${-level * 2}px)` }}
      >
        <Face def={def} size={def.imageSize * scale} offset={{ x: -crop.x * scale, y: -crop.y * scale }} open={open} blink={blink} />
      </div>
    );
  } else {
    const breathe = 1 + Math.sin((frame / fps) * 2.2) * 0.008;
    drawn = (
      <div data-avatar="" className="pointer-events-none absolute" style={{ ...box, transform: `${motion} translateY(${-level * 3}px) scaleY(${breathe})`, transformOrigin: "50% 100%" }}>
        <Face def={def} size={size} open={open} blink={blink} />
      </div>
    );
  }
  if (moment?.from !== "bottom") return drawn;
  return (
    <div className="pointer-events-none absolute inset-0 z-20" style={{ clipPath: `inset(0 0 ${HEIGHT - riseLine(place)}px 0)` }}>
      {drawn}
    </div>
  );
}
