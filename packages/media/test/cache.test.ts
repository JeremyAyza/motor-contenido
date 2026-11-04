import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, describe, it } from "node:test";
import { cachedSpeech, type SpeechProvider } from "../src/index.ts";

const dir = mkdtempSync(join(tmpdir(), "media-cache-"));
after(() => rmSync(dir, { recursive: true, force: true }));

function counting(): SpeechProvider & { voiced: string[] } {
  return {
    id: "fake",
    model: "fake-tts-1",
    voiced: [],
    async synthesize({ text }) {
      this.voiced.push(text);
      return { audio: new TextEncoder().encode(`wav:${text}`), format: "wav", words: [{ text, startMs: 0, endMs: 100 }] };
    },
  };
}

/** Voices the scenes the way video:prepare does: each line with its neighbours. */
async function voiceAll(provider: SpeechProvider, lines: string[], cache: string) {
  for (const [i, text] of lines.entries()) await cachedSpeech(provider, { text, voice: "F", previousText: lines[i - 1], nextText: lines[i + 1] }, cache);
}

describe("the speech cache", () => {
  it("pays only for the scene that changed, not for its neighbours", async () => {
    const provider = counting();
    const cache = join(dir, "neighbours");
    await voiceAll(provider, ["uno", "dos", "tres", "cuatro"], cache);
    assert.equal(provider.voiced.length, 4);
    await voiceAll(provider, ["uno", "dos", "TRES NUEVO", "cuatro"], cache);
    assert.deepEqual(provider.voiced.slice(4), ["TRES NUEVO"]);
  });

  it("reuses an entry saved under the old key, which had the neighbours in it", async () => {
    const provider = counting();
    const cache = join(dir, "legacy");
    mkdirSync(cache, { recursive: true });
    const request = { text: "dos", voice: "F", previousText: "uno viejo", nextText: "tres" };
    const oldKey = createHash("sha256")
      .update(JSON.stringify({ provider: "fake", model: "fake-tts-1", ...{ text: "dos", voice: "F", style: undefined, language: undefined }, previousText: "uno viejo", nextText: "tres", settings: undefined }))
      .digest("hex")
      .slice(0, 24);
    writeFileSync(join(cache, `${oldKey}.wav`), "wav:dos");
    writeFileSync(join(cache, `${oldKey}.json`), JSON.stringify({ provider: "fake", model: "fake-tts-1", request, format: "wav", words: [], createdAt: "2026-11-01" }));
    const reused = await cachedSpeech(provider, { text: "dos", voice: "F", previousText: "uno nuevo", nextText: "tres" }, cache);
    assert.equal(reused.cached, true);
    assert.equal(provider.voiced.length, 0);
    const again = await cachedSpeech(provider, { text: "dos", voice: "F" }, cache);
    assert.equal(again.file, reused.file);
  });

  it("still pays for a different voice or settings", async () => {
    const provider = counting();
    const cache = join(dir, "settings");
    await cachedSpeech(provider, { text: "hola", voice: "F" }, cache);
    await cachedSpeech(provider, { text: "hola", voice: "F", settings: { stability: 0.6 } }, cache);
    await cachedSpeech(provider, { text: "hola", voice: "G" }, cache);
    assert.equal(provider.voiced.length, 3);
  });
});
