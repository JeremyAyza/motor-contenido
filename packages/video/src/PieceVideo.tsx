import "./styles.css";
import { loadFont } from "@remotion/fonts";
import { Audio } from "@remotion/media";
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { AbsoluteFill, Sequence, Series, staticFile, useCurrentFrame, type CalculateMetadataFunction } from "remotion";
import { AssetContext } from "../../carousel/src/ui/assets.ts";
import { Slide, SlideContext } from "../../carousel/src/ui/index.tsx";
import { MOTION_CSS } from "../../carousel/src/ui/motion.tsx";
import { browserAssets, withLogos } from "./assets-browser.ts";
import { Captions, ChapterBar, Meter, Panel } from "./frame.tsx";
import { Avatar, AvatarBubble, drawnAvatar } from "./kit/avatar.tsx";
import { enterStyle, SceneBackgroundLayer } from "./kit/scene-fx.tsx";
import { cameraAt, cameraTransform, DRIFT, resolveShots } from "./kit/camera.ts";
import type { SceneDef, VideoDef } from "./kit/index.ts";
import { meterValueAt, resolveMeter } from "./kit/meter.ts";
import { panelAt, resolvePanel } from "./kit/panel.ts";
import { Sfx, SoundsContext } from "./kit/sfx.tsx";
import { CapturesContext, SceneContext, StageContext, WorldContext, type StageClock } from "./kit/scene.ts";
import { CssMotion, VIDEO_MOTION_CSS } from "./motion.tsx";
import { PIECES } from "./pieces.ts";
import { Probe } from "./probe.tsx";
import { frameAt, framesFor, HEIGHT, MIN_TEXT_PX, musicVolume, speechSpans, timelineMs, WIDTH, type Timeline, type TimelineScene } from "./timeline.ts";

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
  const { palette, fonts } = timeline;
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
  const assets = useMemo(() => withLogos(timeline.logos), [timeline.logos]);
  const defs = timeline.scenes.map((scene) => {
    const def = video.scenes.find((s) => s.id === scene.id);
    if (!def) throw new Error(`Scene "${scene.id}" is in timeline.json but not in video.tsx. Run video:prepare again.`);
    return def;
  });
  return (
    <AbsoluteFill data-video-root="" style={theme} className="bg-bg font-sans text-ink">
      <style>{`${MOTION_CSS}\n${VIDEO_MOTION_CSS}`}</style>
      <SoundsContext.Provider value={timeline.sounds ?? {}}>
        <AssetContext.Provider value={assets}>
          <CapturesContext.Provider value={timeline.captures}>
            {video.stage ? <StageVideo video={video} timeline={timeline} defs={defs} /> : <SlidesVideo video={video} timeline={timeline} defs={defs} />}
          </CapturesContext.Provider>
        </AssetContext.Provider>
        {video.panel ? <PanelHud video={video} timeline={timeline} defs={defs} /> : video.meter ? <MeterHud video={video} timeline={timeline} defs={defs} /> : null}
      </SoundsContext.Provider>
      {timeline.music ? <MusicBed timeline={timeline} /> : null}
      {inspect ? <Probe url={inspect} /> : null}
    </AbsoluteFill>
  );
}

type VideoProps = { video: VideoDef; timeline: Timeline; defs: SceneDef[] };

const slideOf = (timeline: Timeline, index: number) => ({ brand: timeline.brand, art: timeline.art, tab: timeline.tab, index, total: timeline.scenes.length, dir: "" });

/** What each scene carries besides its visual: the chapter bar, the captions, the voice and the effects. */
function SceneTracks({ video, timeline, defs, scene, index }: VideoProps & { scene: TimelineScene; index: number }) {
  const { fps } = timeline;
  const tone = defs[index].tone ?? "base";
  const chapters = defs.map((d) => d.chapter);
  const avatar = useMemo(() => (video.avatar ? drawnAvatar(video.avatar, timeline.avatar, { piece: browserAssets.image, account: staticFile }) : null), [video.avatar, timeline.avatar]);
  return (
    <>
      {video.chapters ? <ChapterBar chapters={chapters} index={index} frames={framesFor(scene.durationMs, fps)} tone={tone} /> : null}
      {avatar ? <Avatar def={avatar} scene={scene} sceneIndex={index} fps={fps} /> : null}
      {avatar?.shape === "bubble" && defs[index].avatar ? <AvatarBubble def={avatar} scene={scene} sceneIndex={index} fps={fps} place={defs[index].avatar!} /> : null}
      {video.captions === "none" ? null : <Captions words={scene.words} tone={tone} style={video.captions} />}
      {scene.voice ? <Audio src={staticFile(scene.voice)} /> : null}
      {scene.sfx.map((sfx, i) => (
        <Sequence key={i} name={`sfx ${i + 1}`} from={frameAt(sfx.atMs, fps)} layout="none">
          <Audio src={staticFile(sfx.src)} volume={sfx.volume} />
        </Sequence>
      ))}
    </>
  );
}

/** The HUD meter over the whole video, in the tone of the current scene. */
function MeterHud({ video, timeline, defs }: VideoProps) {
  const frame = useCurrentFrame();
  const def = video.meter!;
  const points = useMemo(() => resolveMeter(def, timeline.scenes), [def, timeline.scenes]);
  const label = def.label ?? timeline.meter?.label;
  if (!label) throw new Error("defineVideo({ meter }) needs a label, or video.json → meter");
  const ms = (frame / timeline.fps) * 1000;
  let index = 0;
  for (let start = 0; index < timeline.scenes.length - 1 && ms >= start + timeline.scenes[index].durationMs; index++) start += timeline.scenes[index].durationMs;
  return (
    <>
      <Meter def={def} label={label} value={meterValueAt(def.start, points, ms)} tone={defs[index].tone ?? "base"} />
      {points.map((point, i) => (
        <Sfx key={i} id={def.kind === "money" ? "caja-registradora" : "moneda"} at={point.ms / 1000} />
      ))}
    </>
  );
}

/** The HUD board (defineVideo({ panel })): it sounds each time a counter steps. */
function PanelHud({ video, timeline }: VideoProps) {
  const frame = useCurrentFrame();
  const def = video.panel!;
  const resolved = useMemo(() => resolvePanel(def, timeline.scenes), [def, timeline.scenes]);
  const ms = (frame / timeline.fps) * 1000;
  const { active, values } = panelAt(def, resolved, ms);
  return (
    <>
      <Panel def={def} active={active} values={values} />
      {resolved.counters.flatMap((points, c) =>
        points.map((point, i) => <Sfx key={`${c}-${i}`} id={def.counters[c].kind === "money" ? "caja-registradora" : "moneda"} at={point.ms / 1000} />),
      )}
    </>
  );
}

/** The parts of the frame a video turns off (defineVideo({ frame })). */
const hiddenFrame = (video: VideoDef) =>
  (Object.entries({ tab: video.frame?.tab, dots: video.frame?.dots, signature: video.frame?.signature }) as Array<["tab" | "dots" | "signature", boolean | undefined]>)
    .filter(([, on]) => on === false)
    .map(([part]) => part);

/** The scene's entrance (SceneDef.transition), frame by frame from the scene's start. */
function Entrance({ kind, children }: { kind: SceneDef["transition"]; children: ReactNode }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={enterStyle(kind, frame)}>
      {kind ? <Sfx id="whoosh" at={0} volume={0.16} /> : null}
      {children}
    </AbsoluteFill>
  );
}

/** Each scene is its own slide: a <Slide> per scene, with a cut (or its entrance) between them. */
function SlidesVideo({ video, timeline, defs }: VideoProps) {
  const { fps } = timeline;
  const hide = hiddenFrame(video);
  return (
    <Series>
      {timeline.scenes.map((scene, index) => {
        const { Visual, tone = "base", background, transition } = defs[index];
        if (!Visual) throw new Error(`Scene "${scene.id}" has no Visual: without defineVideo({ stage }), every scene draws its own`);
        return (
          <Series.Sequence key={scene.id} name={scene.id} durationInFrames={framesFor(scene.durationMs, fps)}>
            <SceneContext.Provider value={scene}>
              <SlideContext.Provider value={slideOf(timeline, index)}>
                <Entrance kind={transition}>
                  <CssMotion>
                    {/* The content area is CONTENT_BOX (timeline.ts): pt from TAB_BOTTOM, pb up to FOOTER_TOP. */}
                    <Slide tone={tone} className="pb-[107px] pt-[86px]" hide={hide} underlay={background ? <SceneBackgroundLayer kind={background} /> : undefined}>
                      <Visual />
                    </Slide>
                  </CssMotion>
                </Entrance>
              </SlideContext.Provider>
              <SceneTracks video={video} timeline={timeline} defs={defs} scene={scene} index={index} />
            </SceneContext.Provider>
          </Series.Sequence>
        );
      })}
    </Series>
  );
}

/**
 * One world for the whole video (defineVideo({ stage })): the frame and the
 * world are mounted once, the camera moves between the scenes' shots, and
 * each scene only adds its labels (Visual) and its tracks. Scene boundaries
 * are counted in frames, like the Series, so the camera and the scenes agree.
 */
function StageVideo({ video, timeline, defs }: VideoProps) {
  const frame = useCurrentFrame();
  const { fps } = timeline;
  const stage = video.stage!;
  const world = useMemo(() => ({ width: stage.width ?? WIDTH, height: stage.height ?? HEIGHT, spots: stage.spots ?? {}, paths: stage.paths ?? {} }), [stage]);
  const shots = useMemo(() => resolveShots(defs.map((d) => d.camera), world), [defs, world]);
  const durations = timeline.scenes.map((scene) => (framesFor(scene.durationMs, fps) / fps) * 1000);
  const ms = (frame / fps) * 1000;
  let index = 0;
  let start = 0;
  while (index < durations.length - 1 && ms >= start + durations[index]) start += durations[index++];
  const camera = cameraAt(shots, durations, ms, { drift: stage.drift ?? DRIFT });
  const clock: StageClock = {
    ms,
    sceneIndex: index,
    sceneId: timeline.scenes[index].id,
    sceneMs: ms - start,
    sceneDurationMs: durations[index],
    scenes: timeline.scenes,
    spots: world.spots,
    world: { width: world.width, height: world.height },
    camera,
    paths: world.paths,
  };
  const { World } = stage;
  const underlay = (
    <div data-stage="" className="absolute inset-0 overflow-hidden">
      <CssMotion>
        <div data-camera="" data-zoom={camera.zoom.toFixed(3)} className="absolute left-0 top-0" style={{ width: world.width, height: world.height, transform: cameraTransform(camera), transformOrigin: "0 0" }}>
          <WorldContext.Provider value={true}>
            <World />
          </WorldContext.Provider>
        </div>
      </CssMotion>
    </div>
  );
  // A whoosh each time the camera leaves for a new shot (stage.sfx: false mutes it).
  const moves = stage.sfx === false ? [] : durations.map((_, i) => i).filter((i) => i > 0 && (shots[i].track || shots[i].x !== shots[i - 1].x || shots[i].y !== shots[i - 1].y || shots[i].zoom !== shots[i - 1].zoom));
  const startsMs = durations.map((_, i) => durations.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <StageContext.Provider value={clock}>
      {moves.map((i) => (
        <Sfx key={`move-${i}`} id="whoosh" at={startsMs[i] / 1000} volume={0.16} />
      ))}
      <SlideContext.Provider value={slideOf(timeline, index)}>
        <Slide tone={defs[index].tone ?? "base"} className="pb-[107px] pt-[86px]" underlay={underlay} hide={hiddenFrame(video)}>
          <Series>
            {timeline.scenes.map((scene, i) => {
              const { Visual } = defs[i];
              return (
                <Series.Sequence key={scene.id} name={scene.id} durationInFrames={framesFor(scene.durationMs, fps)} layout="none">
                  <SceneContext.Provider value={scene}>
                    {Visual ? (
                      <CssMotion flow>
                        <Visual />
                      </CssMotion>
                    ) : null}
                  </SceneContext.Provider>
                </Series.Sequence>
              );
            })}
          </Series>
        </Slide>
      </SlideContext.Provider>
      <Series>
        {timeline.scenes.map((scene, i) => (
          <Series.Sequence key={scene.id} name={`${scene.id} (voice and captions)`} durationInFrames={framesFor(scene.durationMs, fps)}>
            <SceneContext.Provider value={scene}>
              <SceneTracks video={video} timeline={timeline} defs={defs} scene={scene} index={i} />
            </SceneContext.Provider>
          </Series.Sequence>
        ))}
      </Series>
    </StageContext.Provider>
  );
}
