import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { z } from "zod";
import { loadAccount, pieceFontIds, REPO_ROOT, type AccountBrand, type Palette, type PieceFonts } from "../../brand/src/index.ts";
import { FONTS, fontStack, MONO, type FontId } from "../../brand/src/fonts.ts";
import { repartir } from "../../carousel/src/direcciones.ts";
import type { Art } from "../../carousel/src/post.ts";
import {
  assertUsable,
  cachedSpeech,
  fetchAsset,
  findAsset,
  loadCatalog,
  loadEnv,
  normalizeWord,
  speechProvider,
  wavDurationMs,
  wavLevels,
  whisperAligner,
  type Aligner,
  type Catalog,
  type WordTiming,
} from "../../media/src/index.ts";
import { loadBrief } from "../../carousel/src/brief.ts";
import { revisarTextos } from "../../carousel/src/texto.ts";
import { stageAvatar } from "./avatar-manifest.ts";
import { fetchLogos, type CatalogLogo } from "../../media/src/catalog.ts";
import { CAPTURES_FILE, CapturesSchema, loadCaptures, runCapture, saveCaptures } from "./capture.ts";
import { prepareCritique, writeHookCritic } from "./critique.ts";
import { recentSimilar, REPEAT_DAYS } from "./topics.ts";
import { asVideoError, VideoError } from "./errors.ts";
import type { VideoDef } from "./kit/index.ts";
import { assetCommand, flag, imageCommand, musicCommand } from "./media-commands.ts";
import { inspectComposition, inspectFrames, inspectFreezes, inspectLoudness, inspectTimeline, measureLoudness, normalizeLoudness, probeServer, sceneEntering, reviewSheet, sheetFrames, cameraMoving, type Issue } from "./inspector.ts";
import { VideoMetricsSchema, writeMetricsReport } from "./metrics.ts";
import { piecePalette } from "./palette.ts";
import { reelWarnings, runReelChecks } from "./reel.ts";
import { artOf, checkGateB, estimateWords, gateASheet, loadScript, saveScript, SCRIPT_FILE, scriptWarnings, tabOf, VideoScriptSchema, type VideoScript } from "./script.ts";
import { postManifest } from "../../publisher/src/index.ts";
import { prepararPublicacionVideo } from "./publicar.ts";
import { FPS, HEIGHT, SCALE, timelineMs, WIDTH, type Timeline, type TimelineFont, type TimelineMusic, type TimelineScene } from "./timeline.ts";

const USAGE = `Usage:
  npm run video:baraja -- content/<piece>
      Deals 3 art directions for the video (skills/carrusel-taste/direcciones.json), leaving out the last
      two the videos used. Not needed when the piece has a carousel: the Reel takes post.json → art.
  npm run video:script -- content/<piece>
      Checks video.json (with ig-reel's hookscore and beats), writes the gate A sheet
      (content/<piece>/out/gate-a.md) and the blind hook critic folder.
  npm run video:capture -- content/<piece> [<id>]
      Runs the commands of content/<piece>/captures.json in clean folders and keeps their real
      output and the date, for useCapture() in video.tsx.
  npm run video:storyboard -- content/<piece>
      The visuals with the script at the estimated pace, silent and without a voice, for gate A:
      content/<piece>/out/storyboard.png and storyboard.mp4. Does not need gate A.
  npm run video:prepare -- content/<piece>
      Voice, word timing and files for Remotion, in content/<piece>/out/video/. Needs gate A.
  npm run video:studio -- content/<piece>
      Remotion Studio with the piece (run video:prepare first).
  npm run video:render -- content/<piece>
      MP4 at 1080×1920 (content/<piece>/out/video.mp4), a review sheet and the video's sha256 for gate B.
  npm run video:critique -- content/<piece>
      The folder for the blind critic (content/<piece>/out/video-critica/), after video:render.
  npm run video:publicar -- content/<piece> [--ensayo] [--forzar]
      Publishes the Reel to Instagram (gate B required). --ensayo stops right before sharing.
  npm run video:metrics
      Writes docs/metricas-video.md from every content/*/video-metrics.json.
  npm run video:voices [-- --voices Puck,Kore --text "..." --style "..."]
      Blind test: the same text in several voices, as A.mp3, B.mp3... in packages/video/out/voices.
      The style is the account's (accounts/dev.json → voice.style) unless --style says otherwise.
  npm run video:schema
      Writes schemas/video.schema.json and schemas/video-metrics.schema.json.
  npm run video:image -- content/<piece> --name <name> --prompt "..." [--ref img/a.png] [--aspect 1:1] [--size 1K] [--chroma] [--world] [--replace]
      Generates content/<piece>/img/<name>.png with the image provider of media.config.json.
  npm run video:music -- content/<piece> --name <name> --prompt "..." [--replace]
      Generates content/<piece>/audio/<name>.mp3, a bed for music: { file } in video.tsx.
  npm run video:asset -- search "<query>" | add <library>:<id> --id <name> [--tags a,b]
      Finds CC0 sounds (catalog, then libraries) and adds them to assets/catalog.json.`;

const CACHE = join(REPO_ROOT, ".cache");
const ENTRY = join(REPO_ROOT, "packages/video/src/index.ts");
const CONFIG = join(REPO_ROOT, "packages/video/remotion.config.ts");
const REMOTION = join(REPO_ROOT, "node_modules/@remotion/cli/remotion-cli.js");
const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";
/**
 * Pause after the last word of each scene. The scene ends there, not where the
 * audio file ends: TTS files carry a little silence at the end, and cutting it
 * keeps the rhythm.
 */
const TAIL_MS = 300;
/** The last scene holds longer, so the last caption page (the ask) can be read before the loop. */
const END_TAIL_MS = 1000;
const BLIND_TEST_VOICES = ["Puck", "Charon", "Fenrir", "Orus", "Achird", "Sadaltager", "Kore", "Sulafat"];
// From content/2026-10-19-que-es-ray-tracing/facts.json.
const BLIND_TEST_TEXT =
  "El ray tracing sigue la luz al revés. No parte de la lámpara: parte de tu ojo. Así no calcula los rayos que nunca vas a ver. Y para hacerlo rápido, tu RTX trae núcleos RT.";


function run(bin: string, args: string[], env?: NodeJS.ProcessEnv): void {
  const result = spawnSync(bin, args, { stdio: "inherit", env: { ...process.env, ...env } });
  if (result.status !== 0) throw new VideoError(`${basename(bin)} ${args[0] ?? ""} failed (exit ${result.status ?? result.signal})`);
}

function ffmpeg(args: string[]): void {
  const result = spawnSync(FFMPEG, ["-loglevel", "error", "-y", ...args], { encoding: "utf8" });
  if (result.status !== 0) throw new VideoError(`ffmpeg failed: ${(result.stderr || "no details").trim().split("\n")[0]}`);
}

/** The piece folder, checking that the files the command needs are there. */
function pieceDir(arg: string | undefined, needs: string[]): { dir: string; piece: string } {
  if (!arg) throw new VideoError(`Missing the piece folder\n\n${USAGE}`);
  const dir = resolve(arg);
  for (const file of needs) if (!existsSync(join(dir, file))) throw new VideoError(`${join(dir, file)} does not exist`);
  return { dir, piece: basename(dir) };
}

const scriptOf = (dir: string): VideoScript => asVideoError(() => loadScript(dir));

/** The scenes of video.json with their visuals from video.tsx, in the order of the script. */
function scenesOf(script: VideoScript, video: VideoDef) {
  const ids = new Set(script.scenes.map((s) => s.id));
  const extra = video.scenes.filter((s) => !ids.has(s.id)).map((s) => s.id);
  if (extra.length) throw new VideoError(`video.tsx has scenes that are not in video.json: ${extra.join(", ")}`);
  return script.scenes.map((scene) => {
    const def = video.scenes.find((s) => s.id === scene.id);
    if (!def) throw new VideoError(`Scene "${scene.id}" of video.json has no visual in video.tsx`);
    return { ...scene, sfx: def.sfx ?? [], holdMs: (def.hold ?? 0) * 1000 };
  });
}

/** The voice of the account, unless the piece overrides it. */
function voiceFor(video: VideoDef) {
  const account = loadAccount("dev");
  const provider = account.voice.provider;
  const voice = video.voice?.voice ?? account.voice.voiceId;
  if (!provider || !voice) throw new VideoError("accounts/dev.json → voice needs provider and voiceId. Pick the voice with: npm run video:voices");
  const tempo = video.voice?.tempo ?? account.voice.tempo ?? 1;
  // ffmpeg's atempo takes 0.5 to 2 in one pass; past ±25% the voice stops sounding natural.
  if (tempo < 0.75 || tempo > 1.4) throw new VideoError(`video.tsx → voice.tempo is ${tempo}: keep it between 0.75 and 1.4`);
  return { account, provider, voice, style: video.voice?.style ?? account.voice.style ?? undefined, settings: account.voice.settings, tempo };
}

/** Directions of the account's videos, newest first, from their art (video.json or the carousel's). */
function videoDirections(exclude: string): string[] {
  const root = join(REPO_ROOT, "content");
  const directions: string[] = [];
  for (const piece of readdirSync(root).sort().reverse()) {
    const dir = join(root, piece);
    if (piece === exclude || piece.startsWith("zz-") || !existsSync(join(dir, SCRIPT_FILE))) continue;
    try {
      directions.push(artOf(dir, loadScript(dir)).art.direction);
    } catch {
      // A video without its art yet does not count.
    }
  }
  return directions;
}

/** Deals 3 art directions for a video, leaving out the last two the videos used. */
function deal(args: string[]): void {
  const { dir, piece } = pieceDir(args[0], [SCRIPT_FILE]);
  const used = videoDirections(piece);
  const { mano, recientes } = repartir("dev", 3, piece, used.slice(0, 2));
  console.log(used.length ? `Last video directions: ${used.slice(0, 5).join(", ")}` : "No video directions yet.");
  if (recientes.length) console.log(`Left out of this hand as recent: ${recientes.join(", ")}`);
  if (existsSync(join(dir, "post.json"))) console.log("This piece has a carousel: without video.json → art, the Reel takes post.json → art.");
  console.log(`\nPick the one that serves the topic and write video.json → art: direction, dealt, reason, palette, fonts, anchor and tab.`);
  for (const d of mano) {
    console.log(`\n${d.id}: ${d.nombre}\n  ${d.idea}\n  Cuándo: ${d.cuando}\n  Interior: ${d.interior}\n  Tipografías: ${d.tipografias.join(", ")}\n  Paleta: ${d.paleta}\n  Evitar: ${d.evitar}`);
  }
  console.log(`\ndealt: ${JSON.stringify(mano.map((d) => d.id))}`);
}

/** Where the music bed comes from: a file of the piece (video:music) or a catalog asset. */
async function musicFor(video: VideoDef, dir: string, out: string, catalog: Catalog): Promise<TimelineMusic | undefined> {
  if (!video.music) return undefined;
  // Low under the voice: it is a bed, not a track (docs/direccion-reels.md).
  const { file, asset, volume = 0.06 } = video.music;
  if (!file === !asset) throw new VideoError("video.tsx → music needs either file (a file of the piece) or asset (an id of the catalog)");
  let source: string;
  if (file) {
    source = join(dir, file);
    if (!existsSync(source)) throw new VideoError(`video.tsx → music.file: ${source} does not exist (make one with npm run video:music)`);
  } else {
    const entry = asVideoError(() => findAsset(catalog, asset!));
    asVideoError(() => assertUsable(entry));
    source = await fetchAsset(entry, join(CACHE, "assets"));
  }
  const src = `music/${basename(source)}`;
  mkdirSync(join(out, "music"), { recursive: true });
  copyFileSync(source, join(out, src));
  return { src, volume };
}

/** Word timings for a cached audio file, computed once and kept next to it. */
async function wordsFor(aligner: Aligner, audioFile: string, text: string): Promise<WordTiming[]> {
  const cached = `${audioFile}.words.json`;
  if (existsSync(cached)) return JSON.parse(readFileSync(cached, "utf8")) as WordTiming[];
  const words = await aligner.align({ audioPath: audioFile, text, language: "es" });
  writeFileSync(cached, JSON.stringify(words, null, 2));
  return words;
}

function wordStartMs(words: WordTiming[], word: string, scene: string): number {
  const hit = words.find((w) => normalizeWord(w.text) === normalizeWord(word));
  if (!hit) throw new VideoError(`Scene "${scene}": "${word}" is not in the narration (sfx.at). Words: ${words.map((w) => w.text).join(" ")}`);
  return hit.startMs;
}

/** The fonts of the art direction plus Geist and Geist Mono (the tab and the signature), copied for Remotion. */
function copyFonts(fonts: PieceFonts, dest: string): TimelineFont[] {
  mkdirSync(dest, { recursive: true });
  const ids = new Set<FontId>(["geist", ...pieceFontIds(fonts)]);
  const faces: Array<{ family: string; file: string; weight: string; style?: string; stretch?: string }> = [...ids].flatMap((id) =>
    FONTS[id].faces.map((face) => ({ family: FONTS[id].family, ...face })),
  );
  faces.push(...MONO.map((face) => ({ family: "Geist Mono", ...face })));
  return faces.map(({ family, file, weight, style, stretch }) => {
    copyFileSync(join(REPO_ROOT, "node_modules", file), join(dest, basename(file)));
    return { family, url: `fonts/${basename(file)}`, weight, ...(style ? { style } : {}), ...(stretch ? { stretch } : {}) };
  });
}

/** Copies the files of a folder (not its subfolders) that match `keep`. */
function copyFiles(from: string, to: string, keep: (name: string) => boolean): void {
  if (!existsSync(from)) return;
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    if (entry.isFile() && keep(entry.name)) copyFileSync(join(from, entry.name), join(to, entry.name));
  }
}

const IMAGE = /\.(png|jpe?g|webp|svg)$/i;

/**
 * The carousel's text review (skills/ig-es: post text, filler words, AI
 * structures) over the script and the post text, with the piece's brief if
 * there is one. Its files go to out/video-texto/, apart from the carousel's.
 */
function reviewTexts(dir: string, videoScript: VideoScript): string[] {
  if (!videoScript.caption) return ["Falta el texto del post (caption): la revisión de textos solo miró el guion"];
  const outDir = join(dir, "out/video-texto");
  mkdirSync(join(outDir, ".build"), { recursive: true });
  const captionFile = join(outDir, "texto-del-post.txt");
  writeFileSync(captionFile, `${videoScript.caption}\n`);
  const brief = loadBrief(dir);
  const issues = revisarTextos({ outDir, captionFile, slideTexts: videoScript.scenes.map((s) => s.say), brief: brief.status === "ok" ? brief.brief : null });
  return issues.map((i) => `${i.level === "error" ? "Error" : "Aviso"} en ${i.where === "texto del post" ? "el texto del post" : "el guion"}: ${i.message}`);
}

/** A warning if a piece of the last two weeks had a similar topic (topics.ts). */
function topicWarnings(piece: string, videoScript: VideoScript): string[] {
  if (!videoScript.topic) return ["Falta video.json → topic: sin el tema no se puede avisar si se repite uno de las últimas dos semanas"];
  return recentSimilar(join(REPO_ROOT, "content"), piece, videoScript.topic).map(
    (other) =>
      `El tema se parece al de ${other.piece} ("${other.topic}"), de los últimos ${REPEAT_DAYS} días. Al referente, repetir un tema a los pocos días le costó 10 veces menos vistas (docs/analisis-rick-theengineer.md)`,
  );
}

function script(args: string[]): void {
  const { dir, piece } = pieceDir(args[0], [SCRIPT_FILE]);
  const videoScript = scriptOf(dir);
  mkdirSync(join(dir, "out"), { recursive: true });
  const reel = runReelChecks(dir);
  const warnings = [...scriptWarnings(videoScript), ...topicWarnings(piece, videoScript), ...reelWarnings(reel), ...reviewTexts(dir, videoScript)];
  const sheet = join(dir, "out/gate-a.md");
  writeFileSync(sheet, gateASheet(piece, videoScript, warnings, reel.hooks ?? undefined));
  for (const w of warnings) console.log(`Aviso: ${w}`);
  console.log(`Gate A: ${videoScript.gateA.approved ? "approved" : "pending"}. Sheet for the person: ${sheet}`);
  if (!videoScript.gateA.approved) console.log(`Storyboard for the sheet, without a voice: npm run video:storyboard -- ${args[0]}`);
  console.log(`Blind hook critic (a fresh context, docs/critico-ciego-video.md): ${writeHookCritic(dir, videoScript)}`);
}

function critique(args: string[]): void {
  const { dir } = pieceDir(args[0], [SCRIPT_FILE]);
  const timelineFile = join(dir, "out/video/timeline.json");
  if (!existsSync(timelineFile)) throw new VideoError(`Run first: npm run video:prepare -- ${args[0]} and npm run video:render -- ${args[0]}`);
  const timeline = JSON.parse(readFileSync(timelineFile, "utf8")) as Timeline;
  const { folder, files } = asVideoError(() => prepareCritique(dir, scriptOf(dir), timeline, FFMPEG));
  console.log(`Blind critic folder (${files.length} files): ${folder}`);
  console.log("Give only that folder to a fresh context (docs/critico-ciego-video.md). It writes informe.md there.");
}

/**
 * What the composition needs besides the voice: the look of the art direction
 * (palette, fonts, tab) and the files it draws (objects, the piece's images,
 * the account's avatar, the fonts), copied to the public folder `out`.
 */
function stageOf(dir: string, piece: string, art: Art, palette: Palette, account: AccountBrand, logos: Record<string, CatalogLogo>, out: string, meter?: VideoScript["meter"]) {
  const captures = asVideoError(() => loadCaptures(dir));
  const pending = captures?.captures.filter((c) => !c.result).map((c) => c.id) ?? [];
  if (pending.length) throw new VideoError(`${CAPTURES_FILE}: ${pending.join(", ")} did not run yet. Run: npm run video:capture -- content/${piece}`);
  copyFiles(join(REPO_ROOT, "assets/objetos"), join(out, "objetos"), (name) => IMAGE.test(name));
  copyFiles(dir, join(out, "piece"), (name) => IMAGE.test(name));
  copyFiles(join(dir, "img"), join(out, "piece/img"), (name) => IMAGE.test(name));
  const avatar = asVideoError(() => stageAvatar(join(REPO_ROOT, account.avatar.manifest), out));
  copyFiles(join(CACHE, "assets"), join(out, "logos"), (name) => Object.values(logos).some((l) => basename(l.file) === name));
  const logoSrcs = Object.fromEntries(Object.entries(logos).map(([id, l]) => [id, { title: l.title, src: "logos/" + basename(l.file) }]));
  return {
    piece,
    fps: FPS,
    width: WIDTH,
    height: HEIGHT,
    art,
    palette,
    fonts: {
      display: fontStack(art.fonts.display),
      text: fontStack(art.fonts.text),
      notes: fontStack(art.fonts.notes ?? art.fonts.display),
    },
    faces: copyFonts(art.fonts, join(out, "fonts")),
    tab: tabOf(art, piece),
    ...(meter ? { meter } : {}),
    ...(captures ? { captures: Object.fromEntries(captures.captures.map((c) => [c.id, { about: c.about, ...c.result! }])) } : {}),
    ...(avatar ? { avatar } : {}),
    ...(Object.keys(logoSrcs).length ? { logos: logoSrcs } : {}),
  };
}

/**
 * Runs the commands of content/<piece>/captures.json, each capture in a clean
 * folder of its own (.cache/captures/<piece>/<id>), and writes what they
 * printed and the date into the same file. With an id, only that capture.
 */
function capture(args: string[]): void {
  const { dir, piece } = pieceDir(args[0], [CAPTURES_FILE]);
  const only = args[1];
  const captures = asVideoError(() => loadCaptures(dir))!;
  if (only && !captures.captures.some((c) => c.id === only)) throw new VideoError(`${CAPTURES_FILE} has no capture "${only}"`);
  for (const c of captures.captures) {
    if (only && c.id !== only) continue;
    c.result = asVideoError(() => runCapture(c, join(CACHE, "captures", piece)));
    console.log(`\n${c.id}: ${c.about} (${c.result.ranAt})`);
    for (const step of c.result.steps) {
      console.log(`$ ${step.cmd}${step.exitCode ? `   (exit ${step.exitCode})` : ""}`);
      for (const line of step.output) console.log(`  ${line}`);
    }
  }
  saveCaptures(dir, captures);
  console.log(`\nSaved in ${join(dir, CAPTURES_FILE)}. Show them with useCapture("<id>") and captureLines().`);
}

async function prepare(args: string[]): Promise<void> {
  const { dir, piece } = pieceDir(args[0], [SCRIPT_FILE, "video.tsx"]);
  const videoScript = scriptOf(dir);
  if (!videoScript.gateA.approved) {
    throw new VideoError(
      `Gate A is not approved, so there is no voice yet. Show the sheet (npm run video:script -- ${args[0]}) and, after the person's yes in the chat, set video.json → gateA.`,
    );
  }
  const video = (await import(pathToFileURL(join(dir, "video.tsx")).href)).default as VideoDef;
  const scenesToVoice = scenesOf(videoScript, video);
  loadEnv(join(REPO_ROOT, ".env"));
  const { art, from } = asVideoError(() => artOf(dir, videoScript));
  const palette = asVideoError(() => piecePalette(art.palette, from));
  const { account, provider: providerId, voice, style, settings, tempo } = voiceFor(video);
  const provider = speechProvider(providerId);
  const out = join(dir, "out/video");
  rmSync(out, { recursive: true, force: true });
  for (const sub of ["voice", "sfx"]) mkdirSync(join(out, sub), { recursive: true });
  const aligner = whisperAligner({ dir: join(CACHE, "whisper"), ffmpeg: FFMPEG });
  const catalog = loadCatalog(join(REPO_ROOT, "assets/catalog.json"));
  console.log(`${piece}: ${scenesToVoice.length} scene(s), voice ${provider.id}/${voice}, art direction ${art.direction} (${from})`);

  const scenes: TimelineScene[] = [];
  for (const [i, scene] of scenesToVoice.entries()) {
    // The neighbouring lines keep one tone across scenes, for providers that use them (ElevenLabs).
    const stitching = provider.id === "gemini" ? {} : { previousText: scenesToVoice[i - 1]?.say, nextText: scenesToVoice[i + 1]?.say };
    const speech = await cachedSpeech(provider, { text: scene.say, voice, style, settings, ...stitching }, join(CACHE, "media/speech"));
    const voiceFile = `voice/${scene.id}.wav`;
    // The tempo speeds the voice up after it is made (pitch untouched), so the cache keeps the original.
    if (speech.format === "wav" && tempo === 1) copyFileSync(speech.file, join(out, voiceFile));
    else ffmpeg(["-i", speech.file, ...(tempo === 1 ? [] : ["-filter:a", `atempo=${tempo}`]), "-ac", "1", "-ar", "44100", "-c:a", "pcm_s16le", join(out, voiceFile)]);
    const wav = new Uint8Array(readFileSync(join(out, voiceFile)));
    const words = speech.words ?? (await wordsFor(aligner, join(out, voiceFile), scene.say));
    const sfx = [];
    for (const effect of scene.sfx) {
      const asset = asVideoError(() => findAsset(catalog, effect.asset));
      asVideoError(() => assertUsable(asset));
      const local = await fetchAsset(asset, join(CACHE, "assets"));
      const src = `sfx/${basename(local)}`;
      copyFileSync(local, join(out, src));
      const atMs = typeof effect.at === "number" ? effect.at * 1000 : wordStartMs(words, effect.at, scene.id);
      sfx.push({ src, atMs, volume: effect.volume ?? 0.5 });
    }
    const audioMs = wavDurationMs(wav);
    const speechEndMs = words.length ? Math.min(audioMs, words[words.length - 1].endMs) : audioMs;
    const durationMs = Math.round(speechEndMs + (i === scenesToVoice.length - 1 ? END_TAIL_MS : TAIL_MS) + scene.holdMs);
    scenes.push({ id: scene.id, voice: voiceFile, durationMs, words, sfx, levels: wavLevels(wav, FPS) });
    console.log(`  ${scene.id}: ${(durationMs / 1000).toFixed(1)} s, ${words.length} words${speech.cached ? " (cached voice)" : ""}`);
  }

  // Every effect of the catalog goes to the public folder: the kit sounds by itself (<Sfx>, <Pop>, the camera, the board).
  const sounds: Record<string, string> = {};
  for (const asset of catalog.assets.filter((a) => a.type === "sfx")) {
    asVideoError(() => assertUsable(asset));
    const local = await fetchAsset(asset, join(CACHE, "assets"));
    sounds[asset.id] = `sfx/${basename(local)}`;
    copyFileSync(local, join(out, sounds[asset.id]));
  }
  const timeline: Timeline = {
    ...stageOf(dir, piece, art, palette, account, await fetchLogos(catalog, join(CACHE, "assets")), out, videoScript.meter),
    sounds,
    brand: account,
    voice: { provider: provider.id, model: provider.model, voice },
    scenes,
    music: await musicFor(video, dir, out, catalog),
  };
  writeFileSync(join(out, "timeline.json"), JSON.stringify(timeline, null, 2));
  const total = scenes.reduce((sum, s) => sum + s.durationMs, 0) / 1000;
  console.log(`Ready: ${total.toFixed(1)} s${timeline.music ? `, music ${timeline.music.src}` : ""} in ${join(out, "timeline.json")}`);
}

/** The scenes of video.tsx that come in with a transition (SceneDef.transition). */
async function transitionedScenes(dir: string): Promise<Set<string>> {
  const video = (await import(pathToFileURL(join(dir, "video.tsx")).href)).default as VideoDef;
  return new Set(video.scenes.filter((s) => s.transition).map((s) => s.id));
}

function remotionArgs(dir: string, publicDir = "out/video"): string[] {
  return [`--config=${CONFIG}`, `--public-dir=${join(dir, publicDir)}`];
}

/**
 * The storyboard for gate A: the visuals of video.tsx with the script's
 * words at the account's estimated pace, rendered without sound and without
 * spending on a voice. It leaves out/storyboard.png (the cover and the end of
 * each scene) and what the inspector sees in the frames. The real timing comes
 * later, from video:prepare.
 */
async function storyboard(args: string[]): Promise<void> {
  const { dir, piece } = pieceDir(args[0], [SCRIPT_FILE, "video.tsx"]);
  const videoScript = scriptOf(dir);
  const video = (await import(pathToFileURL(join(dir, "video.tsx")).href)).default as VideoDef;
  const scenesToShow = scenesOf(videoScript, video);
  const { art, from } = asVideoError(() => artOf(dir, videoScript));
  const palette = asVideoError(() => piecePalette(art.palette, from));
  const out = join(dir, "out/storyboard");
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  const scenes: TimelineScene[] = scenesToShow.map((scene, i) => {
    const words = estimateWords(scene.say);
    const durationMs = Math.round((words.at(-1)?.endMs ?? 0) + (i === scenesToShow.length - 1 ? END_TAIL_MS : TAIL_MS) + scene.holdMs);
    return { id: scene.id, durationMs, words, sfx: [] };
  });
  const account = loadAccount("dev");
  const logos = await fetchLogos(loadCatalog(join(REPO_ROOT, "assets/catalog.json")), join(CACHE, "assets"));
  const timeline: Timeline = { ...stageOf(dir, piece, art, palette, account, logos, out, videoScript.meter), brand: account, scenes };
  writeFileSync(join(out, "timeline.json"), JSON.stringify(timeline, null, 2));
  console.log(`${piece}: storyboard of ${scenes.length} scene(s), ${(timelineMs(timeline) / 1000).toFixed(1)} s estimated, art direction ${art.direction} (${from})`);

  const mp4 = join(dir, "out/storyboard.mp4");
  const server = await probeServer();
  const propsFile = join(dir, "out/storyboard-props.json");
  writeFileSync(propsFile, JSON.stringify({ inspect: server.url }));
  try {
    await runAsync(process.execPath, [REMOTION, "render", ENTRY, piece, mp4, ...remotionArgs(dir, "out/storyboard"), "--scale=1", "--muted", `--props=${propsFile}`], {
      REMOTION_PIECE: piece,
    });
  } finally {
    await server.close();
    rmSync(propsFile, { force: true });
  }
  const sheet = join(dir, "out/storyboard.png");
  asVideoError(() => reviewSheet(FFMPEG, mp4, sheetFrames(timeline), sheet));
  const issues = [
    ...inspectFrames([...server.reports.values()], timeline.fps, videoScript.hooks[0].onScreen, cameraMoving(timeline), sceneEntering(timeline, await transitionedScenes(dir))),
    ...asVideoError(() => inspectComposition(FFMPEG, mp4, timeline)),
    ...videoWarnings(videoScript, video),
  ];
  const lines = issues.length ? issues.map((i) => `${i.level === "error" ? "✗" : "!"} ${i.message}`) : ["✓ Sin problemas"];
  console.log(`\nInspector (storyboard):\n${lines.map((l) => `  ${l}`).join("\n")}\n`);
  console.log(`Storyboard: ${sheet}\nSilent preview: ${mp4}`);
}

/** What the script approved that video.tsx has to show: the meter of the HUD. */
function videoWarnings(videoScript: VideoScript, video: VideoDef): Issue[] {
  if (videoScript.meter && !video.meter) {
    return [{ level: "aviso", message: `video.json tiene meter ("${videoScript.meter.label}") y video.tsx no lo muestra: agrega defineVideo({ meter })` }];
  }
  return [];
}

function studio(args: string[]): void {
  const { dir, piece } = pieceDir(args[0], [SCRIPT_FILE, "video.tsx"]);
  if (!existsSync(join(dir, "out/video/timeline.json"))) throw new VideoError(`Run first: npm run video:prepare -- ${args[0]}`);
  run(process.execPath, [REMOTION, "studio", ENTRY, ...remotionArgs(dir)], { REMOTION_PIECE: piece });
}

/** Like run(), but without blocking the event loop: the probe server answers while Remotion renders. */
function runAsync(bin: string, args: string[], env?: NodeJS.ProcessEnv): Promise<void> {
  return new Promise((done, fail) => {
    const child = spawn(bin, args, { stdio: "inherit", env: { ...process.env, ...env } });
    child.on("error", fail);
    child.on("exit", (code, signal) => (code === 0 ? done() : fail(new VideoError(`${basename(bin)} ${args[0] ?? ""} failed (exit ${code ?? signal})`))));
  });
}

async function render(args: string[]): Promise<void> {
  const { dir, piece } = pieceDir(args[0], [SCRIPT_FILE, "video.tsx"]);
  const timelineFile = join(dir, "out/video/timeline.json");
  if (!existsSync(timelineFile)) throw new VideoError(`Run first: npm run video:prepare -- ${args[0]}`);
  const timeline = JSON.parse(readFileSync(timelineFile, "utf8")) as Timeline;
  const videoScript = scriptOf(dir);
  const raw = join(dir, "out/video.raw.mp4");
  const output = join(dir, "out/video.mp4");
  // The probe posts what each frame shows to this server (packages/video/src/probe.tsx).
  const server = await probeServer();
  const propsFile = join(dir, "out/render-props.json");
  writeFileSync(propsFile, JSON.stringify({ inspect: server.url }));
  try {
    await runAsync(process.execPath, [REMOTION, "render", ENTRY, piece, raw, ...remotionArgs(dir), `--scale=${SCALE}`, "--crf=18", `--props=${propsFile}`], {
      REMOTION_PIECE: piece,
    });
  } finally {
    await server.close();
    rmSync(propsFile, { force: true });
  }
  asVideoError(() => normalizeLoudness(FFMPEG, raw, output));
  rmSync(raw, { force: true });

  const sheet = join(dir, "out/video-hoja.png");
  asVideoError(() => reviewSheet(FFMPEG, output, sheetFrames(timeline), sheet));

  const issues = [
    ...inspectFrames([...server.reports.values()], timeline.fps, videoScript.hooks[0].onScreen, cameraMoving(timeline), sceneEntering(timeline, await transitionedScenes(dir))),
    ...inspectTimeline(timeline, videoScript),
    ...asVideoError(() => inspectComposition(FFMPEG, output, timeline)),
    ...asVideoError(() => inspectFreezes(FFMPEG, output)),
    ...asVideoError(() => inspectLoudness(measureLoudness(FFMPEG, output))),
    ...videoWarnings(videoScript, (await import(pathToFileURL(join(dir, "video.tsx")).href)).default as VideoDef),
  ];
  const lines = issues.length ? issues.map((i) => `${i.level === "error" ? "✗" : "!"} ${i.message}`) : ["✓ Sin problemas"];
  writeFileSync(join(dir, "out/video-inspector.txt"), `${lines.join("\n")}\n`);
  console.log(`\nInspector:\n${lines.map((l) => `  ${l}`).join("\n")}\n`);

  const sha256 = createHash("sha256").update(readFileSync(output)).digest("hex");
  writeFileSync(join(dir, "out/video.sha256"), `${sha256}\n`);
  console.log(`Video: ${output}\nSheet: ${sheet}\nsha256: ${sha256}`);
  const errors = issues.filter((i) => i.level === "error").length;
  if (errors) {
    process.exitCode = 1;
    console.log(`Gate B: not yet. Fix the ${errors} error(s) of the inspector first.`);
    return;
  }
  const { script: checked, reset } = checkGateB(videoScript, sha256);
  if (reset) {
    saveScript(dir, checked);
    console.log("Gate B went back to false: the video changed after it was approved. Show it again.");
  } else if (checked.gateB.approved) {
    console.log("Gate B: approved for this video.");
  } else {
    console.log(`Gate B: pending. After the person's yes in the chat, set video.json → gateB { approved: true, date, video: "${sha256}" }.`);
  }
}

function schema(): void {
  const schemas: Array<[string, z.ZodType]> = [
    ["schemas/video.schema.json", VideoScriptSchema],
    ["schemas/video-metrics.schema.json", VideoMetricsSchema],
    ["schemas/captures.schema.json", CapturesSchema],
  ];
  for (const [file, zodSchema] of schemas) {
    const out = join(REPO_ROOT, file);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, JSON.stringify(z.toJSONSchema(zodSchema, { io: "input", unrepresentable: "any" }), null, 2) + "\n");
    console.log(`Schema: ${out}`);
  }
}

function metrics(): void {
  const { file, errors } = writeMetricsReport();
  for (const e of errors) console.log(`Error: ${e}`);
  console.log(`Report: ${file}`);
  if (errors.length) process.exitCode = 1;
}

async function voices(args: string[]): Promise<void> {
  loadEnv(join(REPO_ROOT, ".env"));
  const provider = speechProvider("gemini");
  const list = flag(args, "--voices")?.split(",") ?? BLIND_TEST_VOICES;
  const text = flag(args, "--text") ?? BLIND_TEST_TEXT;
  const style = flag(args, "--style") ?? loadAccount("dev").voice.style ?? undefined;
  const out = join(REPO_ROOT, "packages/video/out/voices");
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  // Fisher-Yates: every order of the letters is equally likely.
  const letters = list.map((_, i) => String.fromCharCode(65 + i));
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  const key: Record<string, string> = {};
  for (const [i, voice] of list.entries()) {
    const speech = await cachedSpeech(provider, { text, voice, style }, join(CACHE, "media/speech"));
    // Same loudness for every voice, so the louder one does not win.
    ffmpeg(["-i", speech.file, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "44100", "-b:a", "160k", join(out, `${letters[i]}.mp3`)]);
    key[letters[i]] = voice;
  }
  const sorted = Object.fromEntries(Object.entries(key).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(join(out, "key.json"), JSON.stringify({ provider: provider.id, model: provider.model, style, text, key: sorted }, null, 2));
  console.log(`${list.length} voices in ${out} (A to ${String.fromCharCode(64 + list.length)}). key.json says which is which: open it after choosing.`);
}

async function publicar(args: string[]): Promise<void> {
  const target = args.find((a) => !a.startsWith("--"));
  if (!target) throw new VideoError(`Missing the piece folder\n\nUsage: npm run video:publicar -- content/<piece> [--ensayo] [--forzar]`);
  const dir = resolve(target);
  const plataforma = flag(args, "--plataforma") ?? "instagram";
  const { manifest } = asVideoError(() => prepararPublicacionVideo(dir));
  const outcome = await postManifest({
    from: dir,
    platform: plataforma,
    manifest,
    dryRun: args.includes("--ensayo"),
    force: args.includes("--forzar"),
  });
  if (outcome.kind === "skipped") {
    const { status, at, url } = outcome.entry;
    console.log(`Already on ${plataforma} (${status}, ${at}${url ? `, ${url}` : ""}). Use --forzar to post again.`);
  } else if (outcome.kind === "dry-run") {
    console.log(`Dry run ready: stopped before sharing. Captures: ${outcome.captures.join(", ")}`);
  } else if (outcome.url) {
    console.log(`Published: ${outcome.url}`);
  } else {
    console.log(
      `Published, but URL wasn't found on profile. Record it with: npm run publisher -- mark ${plataforma} --id ${manifest.id} --account ${manifest.account} --url <url>`,
    );
  }
}

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2).filter((a) => a !== "--");
  if (command === "script") script(args);
  else if (command === "schema") schema();
  else if (command === "image") await imageCommand(args, FFMPEG);
  else if (command === "music") await musicCommand(args);
  else if (command === "asset") await assetCommand(args);
  else if (command === "prepare") await prepare(args);
  else if (command === "studio") studio(args);
  else if (command === "render") await render(args);
  else if (command === "critique") critique(args);
  else if (command === "baraja") deal(args);
  else if (command === "capture") capture(args);
  else if (command === "storyboard") await storyboard(args);
  else if (command === "publicar") await publicar(args);
  else if (command === "metrics") metrics();
  else if (command === "voices") await voices(args);
  else throw new VideoError(command ? `Unknown command "${command}"\n\n${USAGE}` : USAGE);
}

main().catch((error: unknown) => {
  // Provider errors carry the whole HTTP response: the message is what helps. DEBUG=1 shows everything.
  const known = error instanceof VideoError || (error instanceof Error && !process.env.DEBUG);
  console.error(known ? (error as Error).message : error);
  process.exit(1);
});
