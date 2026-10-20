import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { SpeechProvider, SpeechRequest, SpeechResult, WordTiming } from "./speech.ts";

type Entry = {
  provider: string;
  model: string;
  request: SpeechRequest;
  format: SpeechResult["format"];
  words?: WordTiming[];
  createdAt: string;
};

export type CachedSpeech = SpeechResult & { file: string; cached: boolean };

/**
 * Speech with a disk cache keyed by provider, model and request, so redoing a
 * scene only pays for the lines that changed. The JSON next to each file
 * records what generated it: that is how a piece knows which parts are AI.
 */
export async function cachedSpeech(provider: SpeechProvider, request: SpeechRequest, cacheDir: string): Promise<CachedSpeech> {
  const { text, voice, style, language } = request;
  const key = createHash("sha256")
    .update(JSON.stringify({ provider: provider.id, model: provider.model, text, voice, style, language }))
    .digest("hex")
    .slice(0, 24);
  const metaFile = join(cacheDir, `${key}.json`);
  if (existsSync(metaFile)) {
    const entry = JSON.parse(readFileSync(metaFile, "utf8")) as Entry;
    const file = join(cacheDir, `${key}.${entry.format}`);
    if (existsSync(file)) return { audio: readFileSync(file), format: entry.format, words: entry.words, file, cached: true };
  }
  const result = await provider.synthesize(request);
  mkdirSync(cacheDir, { recursive: true });
  const file = join(cacheDir, `${key}.${result.format}`);
  writeFileSync(file, result.audio);
  const entry: Entry = { provider: provider.id, model: provider.model, request, format: result.format, words: result.words, createdAt: new Date().toISOString() };
  writeFileSync(metaFile, JSON.stringify(entry, null, 2));
  return { ...result, file, cached: false };
}
