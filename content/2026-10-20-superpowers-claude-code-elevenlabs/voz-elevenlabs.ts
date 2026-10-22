/*
 * One-off test: the Superpowers Reel with an ElevenLabs voice (through kie.ai)
 * instead of Gemini's Puck, without a provider in packages/media or config
 * changes. Same method as ../2026-10-20-superpowers-claude-code-fish/voz-fish.ts:
 * it runs after video:prepare (which leaves out/video/timeline.json with the
 * cached Puck voice) and swaps only the voice, its word timings and the sfx
 * times. Then video:render works as usual.
 *
 *   npx tsx content/2026-10-20-superpowers-claude-code-elevenlabs/voz-elevenlabs.ts <voice id> [v3|v2]
 *   npx tsx content/2026-10-20-superpowers-claude-code-elevenlabs/voz-elevenlabs.ts --samples <v3|v2> <voice id>[:name]...
 *
 * --samples only says the hook in each voice (elevenlabs/muestras/), to choose one.
 * Voice ids are kie's list (https://docs.kie.ai/market/elevenlabs/text-to-dialogue-v3).
 * v3 is Eleven v3 through text-to-dialogue with a single line (14 credits per
 * 1,000 characters); v2 is Multilingual v2 (12 credits), which does not take a
 * language code but does take the neighbouring scenes for continuity.
 * 200 credits are US$1.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv, requireEnv, wavDurationMs, whisperAligner, type WordTiming } from "../../packages/media/src/index.ts";

const DIR = dirname(fileURLToPath(import.meta.url));
const REPO = join(DIR, "../..");
// The same tails as video:prepare (packages/video/src/cli.ts).
const TAIL_MS = 300;
const END_TAIL_MS = 1000;
const POLL_MS = 2000;
const TIMEOUT_MS = 5 * 60_000;

type TimelineScene = { id: string; voice: string; durationMs: number; words: WordTiming[]; sfx: Array<{ src: string; atMs: number; volume: number }> };
type Line = { text: string; previous?: string; next?: string };

const MODELS: Record<string, (voice: string, line: Line) => object> = {
  v3: (voice, { text }) => ({ model: "elevenlabs/text-to-dialogue-v3", input: { dialogue: [{ text, voice }], stability: 0.5, language_code: "es" } }),
  v2: (voice, { text, previous, next }) => ({
    model: "elevenlabs/text-to-speech-multilingual-v2",
    input: { text, voice, previous_text: previous ?? "", next_text: next ?? "" },
  }),
};

const args = process.argv.slice(2);
if (!args[0]) throw new Error("Usage: voz-elevenlabs.ts <voice id> [v3|v2] | --samples <v3|v2> <voice id>[:name]...");
loadEnv(join(REPO, ".env"));
const key = requireEnv("KEI_KEY");
const ffmpeg = process.env.FFMPEG_PATH || "ffmpeg";

/** kie answers HTTP 200 even on errors: the outcome is in `code`. */
async function kie<T>(path: string, body?: object): Promise<T> {
  const res = await fetch(`https://api.kie.ai/api/v1/jobs/${path}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: body && JSON.stringify(body),
  });
  const json = (await res.json()) as { code: number; msg: string; data: T };
  if (json.code !== 200) throw new Error(`kie ${path}: ${json.code} ${json.msg}`);
  return json.data;
}

/** Creates the task, waits for it and leaves a mono 44.1 kHz WAV in `file`. */
async function speak(model: string, voice: string, line: Line, file: string): Promise<void> {
  const { taskId } = await kie<{ taskId: string }>("createTask", MODELS[model](voice, line));
  for (const start = Date.now(); Date.now() - start < TIMEOUT_MS; ) {
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
    const task = await kie<{ state: string; resultJson?: string; failMsg?: string; creditsConsumed?: number }>(`recordInfo?taskId=${taskId}`);
    if (task.state === "fail") throw new Error(`kie ${model}, task ${taskId}: ${task.failMsg}`);
    if (task.state !== "success") continue;
    const url = (JSON.parse(task.resultJson!) as { resultUrls: string[] }).resultUrls[0];
    const audio = await fetch(url);
    if (!audio.ok) throw new Error(`kie ${model}, download: ${audio.status}`);
    const download = `${file}.download`;
    writeFileSync(download, Buffer.from(await audio.arrayBuffer()));
    execFileSync(ffmpeg, ["-y", "-loglevel", "error", "-i", download, "-ac", "1", "-ar", "44100", "-c:a", "pcm_s16le", file]);
    console.log(`    ${task.creditsConsumed ?? "?"} credits`);
    return;
  }
  throw new Error(`kie ${model}, task ${taskId}: no result after ${TIMEOUT_MS / 60_000} min`);
}

const scripted = (JSON.parse(readFileSync(join(DIR, "video.json"), "utf8")) as { scenes: Array<{ id: string; say: string }> }).scenes;

if (args[0] === "--samples") {
  const [, model, ...voices] = args;
  const out = join(DIR, "elevenlabs/muestras");
  mkdirSync(out, { recursive: true });
  for (const entry of voices) {
    const [voice, name = voice] = entry.split(":");
    const file = join(out, `${model}-${name}.wav`);
    if (!existsSync(file)) await speak(model, voice, { text: scripted[0].say, next: scripted[1].say }, file);
    console.log(`  ${name}: ${file}`);
  }
} else {
  const [voice, model = "v3"] = args;
  if (!MODELS[model]) throw new Error(`Unknown model ${model}: use v3 or v2`);
  const timelineFile = join(DIR, "out/video/timeline.json");
  if (!existsSync(timelineFile)) throw new Error("Run first: npm run video:prepare -- content/2026-10-20-superpowers-claude-code-elevenlabs");
  const timeline = JSON.parse(readFileSync(timelineFile, "utf8")) as { voice: unknown; scenes: TimelineScene[] };
  const aligner = whisperAligner({ dir: join(REPO, ".cache/whisper"), ffmpeg });
  const work = join(DIR, "elevenlabs", `kie-${model}`, voice);
  mkdirSync(work, { recursive: true });

  for (const [i, scene] of timeline.scenes.entries()) {
    const at = scripted.findIndex((s) => s.id === scene.id);
    const say = scripted[at].say;
    const file = join(work, `${scene.id}.wav`);
    if (!existsSync(file)) await speak(model, voice, { text: say, previous: scripted[at - 1]?.say, next: scripted[at + 1]?.say }, file);
    const wordsFile = `${file}.words.json`;
    const words: WordTiming[] = existsSync(wordsFile) ? JSON.parse(readFileSync(wordsFile, "utf8")) : await aligner.align({ audioPath: file, text: say, language: "es" });
    writeFileSync(wordsFile, JSON.stringify(words, null, 2));

    // The aligner returns the script's words, so a sound effect keeps the index of its word.
    const sfx = scene.sfx.map((effect) => {
      const index = scene.words.findIndex((w) => w.startMs === effect.atMs);
      return index >= 0 ? { ...effect, atMs: words[index].startMs } : effect;
    });
    const audioMs = wavDurationMs(new Uint8Array(readFileSync(file)));
    const speechEndMs = words.length ? Math.min(audioMs, words[words.length - 1].endMs) : audioMs;
    const durationMs = Math.round(speechEndMs + (i === timeline.scenes.length - 1 ? END_TAIL_MS : TAIL_MS));
    copyFileSync(file, join(DIR, "out/video", scene.voice));
    console.log(`  ${scene.id}: ${(durationMs / 1000).toFixed(1)} s (before ${(scene.durationMs / 1000).toFixed(1)} s)`);
    timeline.scenes[i] = { ...scene, durationMs, words, sfx };
  }
  timeline.voice = { provider: "elevenlabs-kie", model, voice };
  writeFileSync(timelineFile, JSON.stringify(timeline, null, 2));
  const total = timeline.scenes.reduce((sum, s) => sum + s.durationMs, 0) / 1000;
  console.log(`Ready: ${total.toFixed(1)} s with ${model}/${voice}. Next: npm run video:render -- content/2026-10-20-superpowers-claude-code-elevenlabs`);
}
