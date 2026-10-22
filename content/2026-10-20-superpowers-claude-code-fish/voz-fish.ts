/*
 * One-off test: the Superpowers Reel with a Fish Audio voice instead of
 * Gemini's Puck, without a provider in packages/media or config changes.
 * It runs after video:prepare (which leaves out/video/timeline.json with the
 * cached Puck voice) and swaps only the voice, its word timings and the sfx
 * times. Then video:render works as usual.
 *
 *   npx tsx content/2026-10-20-superpowers-claude-code-fish/voz-fish.ts <voice id> [model]
 *
 * The voice id is a model of the Fish library (https://fish.audio/discovery).
 * The model defaults to s2.1-pro-free (free until November 30, 2026, for
 * personal use). Docs: https://docs.fish.audio/api-reference/endpoint/openapi-v1/text-to-speech
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv, requireEnv, wavDurationMs, whisperAligner, type WordTiming } from "../../packages/media/src/index.ts";

const DIR = dirname(fileURLToPath(import.meta.url));
const REPO = join(DIR, "../..");
// The same tails as video:prepare (packages/video/src/cli.ts).
const TAIL_MS = 300;
const END_TAIL_MS = 1000;

type TimelineScene = { id: string; voice: string; durationMs: number; words: WordTiming[]; sfx: Array<{ src: string; atMs: number; volume: number }> };

const [voiceId, model = "s2.1-pro-free"] = process.argv.slice(2);
if (!voiceId) throw new Error("Usage: voz-fish.ts <voice id> [model]");
loadEnv(join(REPO, ".env"));
const key = requireEnv("FISH_API_KEY");

const scripted = (JSON.parse(readFileSync(join(DIR, "video.json"), "utf8")) as { scenes: Array<{ id: string; say: string }> }).scenes;
const timelineFile = join(DIR, "out/video/timeline.json");
if (!existsSync(timelineFile)) throw new Error("Run first: npm run video:prepare -- content/2026-10-20-superpowers-claude-code-fish");
const timeline = JSON.parse(readFileSync(timelineFile, "utf8")) as { voice: unknown; scenes: TimelineScene[] };
const aligner = whisperAligner({ dir: join(REPO, ".cache/whisper"), ffmpeg: process.env.FFMPEG_PATH || "ffmpeg" });
const work = join(DIR, "fish", model, voiceId);
mkdirSync(work, { recursive: true });

for (const [i, scene] of timeline.scenes.entries()) {
  const say = scripted.find((s) => s.id === scene.id)!.say;
  const file = join(work, `${scene.id}.wav`);
  if (!existsSync(file)) {
    const res = await fetch("https://api.fish.audio/v1/tts", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", model },
      body: JSON.stringify({ text: say, reference_id: voiceId, format: "wav", sample_rate: 44100, language: "es", latency: "normal" }),
    });
    if (!res.ok) throw new Error(`Fish, scene ${scene.id}: ${res.status} ${await res.text()}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  const wordsFile = `${file}.words.json`;
  const words: WordTiming[] = existsSync(wordsFile) ? JSON.parse(readFileSync(wordsFile, "utf8")) : await aligner.align({ audioPath: file, text: say, language: "es" });
  writeFileSync(wordsFile, JSON.stringify(words, null, 2));

  // The aligner returns the script's words, so a sound effect keeps the index of its word.
  const sfx = scene.sfx.map((effect) => {
    const at = scene.words.findIndex((w) => w.startMs === effect.atMs);
    return at >= 0 ? { ...effect, atMs: words[at].startMs } : effect;
  });
  const audioMs = wavDurationMs(new Uint8Array(readFileSync(file)));
  const speechEndMs = words.length ? Math.min(audioMs, words[words.length - 1].endMs) : audioMs;
  const durationMs = Math.round(speechEndMs + (i === timeline.scenes.length - 1 ? END_TAIL_MS : TAIL_MS));
  copyFileSync(file, join(DIR, "out/video", scene.voice));
  console.log(`  ${scene.id}: ${(durationMs / 1000).toFixed(1)} s (before ${(scene.durationMs / 1000).toFixed(1)} s)`);
  timeline.scenes[i] = { ...scene, durationMs, words, sfx };
}
timeline.voice = { provider: "fish", model, voice: voiceId };
writeFileSync(timelineFile, JSON.stringify(timeline, null, 2));
const total = timeline.scenes.reduce((sum, s) => sum + s.durationMs, 0) / 1000;
console.log(`Ready: ${total.toFixed(1)} s with ${model}/${voiceId}. Next: npm run video:render -- content/2026-10-20-superpowers-claude-code-fish`);
