import "./styles.css";
import { loadFont } from "@remotion/fonts";
import { Audio } from "@remotion/media";
import { useMemo, useState, type CSSProperties } from "react";
import { AbsoluteFill, Sequence, Series, staticFile, type CalculateMetadataFunction } from "remotion";
import { AssetContext } from "../../carousel/src/ui/assets.ts";
import { Slide, SlideContext } from "../../carousel/src/ui/index.tsx";
import { MOTION_CSS } from "../../carousel/src/ui/motion.tsx";
import { browserAssets } from "./assets-browser.ts";
import { Captions } from "./frame.tsx";
import { SceneContext } from "./kit/scene.ts";
import { CssMotion, VIDEO_MOTION_CSS } from "./motion.tsx";
import { PIECES } from "./pieces.ts";
import { Probe } from "./probe.tsx";
import { frameAt, framesFor, MIN_TEXT_PX, musicVolume, speechSpans, timelineMs, type Timeline } from "./timeline.ts";

/** `inspect` is the URL of the inspector's local server, set only by video:render. */
export type PieceProps = { piece: string; timeline: Timeline | null; inspect: string | null };

/** Duration and size come from the timeline that video:prepare wrote in the public folder. */
export const calculatePieceMetadata: CalculateMetadataFunction<PieceProps> = async ({ props }) => {
  const response = await fetch(staticFile("timeline.json"));
  if (!response.ok) throw new Error(`No timeline.json for ${props.piece}. Run: npm run video:prepare -- content/${props.piece}`);
  const timeline = (await response.json()) as Timeline;
  if (timeline.piece !== props.piece) {
    throw new Error(`The public folder belongs to ${timeline.piece}, not ${props.piece}. Run: npm run video:studio -- content/${props.piece}`);
  }
  return {
    durationInFrames: framesFor(timelineMs(timeline), timeline.fps),
    fps: timeline.fps,
    width: timeline.width,
    height: timeline.height,
    props: { ...props, timeline },
  };
};

const loadedFonts = new Set<string>();

/** Loads the piece fonts once; loadFont() holds the render until they are ready. */
function useFonts(faces: Timeline["faces"]) {
  useState(() => {
    for (const face of faces) {
      const key = `${face.family} ${face.url}`;
      if (loadedFonts.has(key)) continue;
      loadedFonts.add(key);
      void loadFont({ family: face.family, url: staticFile(face.url), weight: face.weight, style: face.style, stretch: face.stretch });
    }
    return null;
  });
}

/** The music under the whole video: looped, with fades, lower while the voice speaks. */
function MusicBed({ timeline }: { timeline: Timeline }) {
  const spans = useMemo(() => speechSpans(timeline), [timeline]);
  const totalMs = timelineMs(timeline);
  const { src, volume } = timeline.music!;
  return (
    <Audio
      name="music"
      src={staticFile(src)}
      loop
      loopVolumeCurveBehavior="extend"
      volume={(frame) => musicVolume((frame / timeline.fps) * 1000, totalMs, volume, spans)}
    />
  );
}

export function PieceVideo({ piece, timeline, inspect }: PieceProps) {
  if (!timeline) throw new Error("No timeline: calculateMetadata did not run");
  const video = PIECES.find((p) => p.id === piece)?.video;
  if (!video) throw new Error(`content/${piece}/video.tsx not found`);
  useFonts(timeline.faces);
  const { palette, fonts, fps } = timeline;
  const theme = {
    "--piece-bg": palette.bg,
    "--piece-ink": palette.ink,
    "--piece-accent": palette.accent,
    "--piece-accent-ink": palette.accentInk,
    "--piece-surface": palette.surface ?? `color-mix(in srgb, ${palette.ink} 8%, ${palette.bg})`,
    "--piece-muted": palette.muted ?? `color-mix(in srgb, ${palette.ink} 68%, ${palette.bg})`,
    "--piece-font-display": fonts.display,
    "--piece-font-text": fonts.text,
    "--piece-font-notes": fonts.notes,
    // The primitives' small text never goes under this (22 px of design, 44 at 1080 wide).
    "--min-text": `${MIN_TEXT_PX}px`,
  } as CSSProperties;
  return (
    <AbsoluteFill data-video-root="" style={theme} className="bg-bg font-sans text-ink">
      <style>{`${MOTION_CSS}\n${VIDEO_MOTION_CSS}`}</style>
      <AssetContext.Provider value={browserAssets}>
        <Series>
          {timeline.scenes.map((scene, index) => {
            const def = video.scenes.find((s) => s.id === scene.id);
            if (!def) throw new Error(`Scene "${scene.id}" is in timeline.json but not in video.tsx. Run video:prepare again.`);
            const { Visual, tone = "base" } = def;
            const slide = { brand: timeline.brand, art: timeline.art, tab: timeline.tab, index, total: timeline.scenes.length, dir: "" };
            return (
              <Series.Sequence key={scene.id} name={scene.id} durationInFrames={framesFor(scene.durationMs, fps)}>
                <SceneContext.Provider value={scene}>
                  <SlideContext.Provider value={slide}>
                    <CssMotion>
                      {/* The content area is CONTENT_BOX (timeline.ts): pt from TAB_BOTTOM, pb up to FOOTER_TOP. */}
                      <Slide tone={tone} className="pb-[107px] pt-[86px]">
                        <Visual />
                      </Slide>
                    </CssMotion>
                  </SlideContext.Provider>
                  <Captions words={scene.words} tone={tone} />
                </SceneContext.Provider>
                <Audio src={staticFile(scene.voice)} />
                {scene.sfx.map((sfx, i) => (
                  <Sequence key={i} name={`sfx ${i + 1}`} from={frameAt(sfx.atMs, fps)} layout="none">
                    <Audio src={staticFile(sfx.src)} volume={sfx.volume} />
                  </Sequence>
                ))}
              </Series.Sequence>
            );
          })}
        </Series>
      </AssetContext.Provider>
      {timeline.music ? <MusicBed timeline={timeline} /> : null}
      {inspect ? <Probe url={inspect} /> : null}
    </AbsoluteFill>
  );
}
