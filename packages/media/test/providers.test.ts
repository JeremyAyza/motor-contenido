import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, describe, it } from "node:test";
import {
  cachedSpeech,
  IMAGE_PROVIDERS,
  imageProvider,
  loadGenerated,
  MUSIC_PROVIDERS,
  musicProvider,
  recordGenerated,
  SPEECH_PROVIDERS,
  speechProvider,
  type ImageProvider,
  type MusicProvider,
  type SpeechProvider,
} from "../src/index.ts";

// The flow names no provider: it asks the registry for the one in the
// configuration. These tests swap in fake providers and check that what the
// flow keeps (cache, provenance) does not change.

const dir = mkdtempSync(join(tmpdir(), "media-providers-"));
after(() => rmSync(dir, { recursive: true, force: true }));

function fakeSpeech(): SpeechProvider & { calls: number } {
  return {
    id: "fake",
    model: "fake-tts-1",
    calls: 0,
    async synthesize({ text }) {
      this.calls++;
      return { audio: new TextEncoder().encode(`wav:${text}`), format: "wav", words: [{ text, startMs: 0, endMs: 100 }] };
    },
  };
}

describe("a fake speech provider in the registry", () => {
  it("is used by id and cached by text, like Gemini", async () => {
    const fake = fakeSpeech();
    SPEECH_PROVIDERS.fake = () => fake;
    try {
      const provider = speechProvider("fake");
      const cache = join(dir, "speech");
      const first = await cachedSpeech(provider, { text: "hola", voice: "x" }, cache);
      const second = await cachedSpeech(provider, { text: "hola", voice: "x" }, cache);
      assert.equal(fake.calls, 1);
      assert.equal(first.cached, false);
      assert.equal(second.cached, true);
      assert.deepEqual(second.words, [{ text: "hola", startMs: 0, endMs: 100 }]);
      const meta = JSON.parse(readFileSync(first.file.replace(/\.wav$/, ".json"), "utf8"));
      assert.equal(`${meta.provider}/${meta.model}`, "fake/fake-tts-1");
    } finally {
      delete SPEECH_PROVIDERS.fake;
    }
  });

  it("gets a new cache entry when the provider changes, even for the same text", async () => {
    const cache = join(dir, "speech-switch");
    const a = fakeSpeech();
    const b = { ...fakeSpeech(), id: "other" };
    const fromA = await cachedSpeech(a, { text: "hola", voice: "x" }, cache);
    const fromB = await cachedSpeech(b, { text: "hola", voice: "x" }, cache);
    assert.notEqual(fromA.file, fromB.file);
  });
});

describe("fake image and music providers in the registry", () => {
  it("are picked by id and the model is passed through", async () => {
    const image: ImageProvider = { id: "fake", model: "m", generate: async () => ({ image: new Uint8Array([1, 2, 3]), mimeType: "image/png" }) };
    const music: MusicProvider = { id: "fake", model: "m", compose: async () => ({ audio: new Uint8Array([4, 5]), format: "mp3" }) };
    const models: Array<string | undefined> = [];
    IMAGE_PROVIDERS.fake = (model) => (models.push(model), image);
    MUSIC_PROVIDERS.fake = (model) => (models.push(model), music);
    try {
      assert.equal((await imageProvider("fake", "img-2").generate({ prompt: "x" })).image.length, 3);
      assert.equal((await musicProvider("fake", "music-2").compose({ prompt: "x" })).format, "mp3");
      assert.deepEqual(models, ["img-2", "music-2"]);
    } finally {
      delete IMAGE_PROVIDERS.fake;
      delete MUSIC_PROVIDERS.fake;
    }
  });

  it("names the adapters that exist when the id is unknown", () => {
    assert.throws(() => imageProvider("nope"), /No image adapter for "nope". Available: gemini/);
    assert.throws(() => musicProvider("nope"), /No music adapter for "nope". Available: gemini/);
  });
});

describe("recordGenerated", () => {
  it("records who made each file and replaces a regenerated one", () => {
    const piece = join(dir, "piece");
    rmSync(piece, { recursive: true, force: true });
    const entry = { file: "img/foco.png", kind: "image" as const, provider: "fake", model: "m", prompt: "un foco", references: [] };
    recordGenerated(join(dir), entry, new Uint8Array([1]));
    recordGenerated(join(dir), { ...entry, prompt: "otro foco" }, new Uint8Array([2]));
    const generated = loadGenerated(dir);
    assert.equal(generated.length, 1);
    assert.equal(generated[0].prompt, "otro foco");
    assert.match(generated[0].sha256, /^[0-9a-f]{64}$/);
  });
});
