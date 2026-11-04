import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
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

const hash = (value: object) => createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 24);

/**
 * What makes two lines the same audio: provider, model, text, voice and its
 * settings. The neighbouring lines (previousText, nextText) are left out: they
 * only help the provider keep one tone, so editing a scene does not pay again
 * for the scenes around it. Fields left undefined drop out of the JSON, so a
 * line voiced without neighbours keeps the key it always had.
 */
export function speechKey(providerId: string, model: string, request: SpeechRequest): string {
  const { text, voice, style, language, settings } = request;
  return hash({ provider: providerId, model, text, voice, style, language, settings });
}

/** The key entries had before the neighbours were left out of it. */
function legacyKey(providerId: string, model: string, request: SpeechRequest): string {
  const { text, voice, style, language, previousText, nextText, settings } = request;
  return hash({ provider: providerId, model, text, voice, style, language, previousText, nextText, settings });
}

function readEntry(cacheDir: string, key: string): { entry: Entry; file: string } | undefined {
  const metaFile = join(cacheDir, `${key}.json`);
  if (!existsSync(metaFile)) return undefined;
  const entry = JSON.parse(readFileSync(metaFile, "utf8")) as Entry;
  const file = join(cacheDir, `${key}.${entry.format}`);
  return existsSync(file) ? { entry, file } : undefined;
}

/**
 * An entry voiced with other neighbours under the old key: the same line, so
 * it is reused instead of paid again. Looks through the metadata of the cache.
 */
function findVoicedElsewhere(cacheDir: string, key: string, providerId: string, model: string, request: SpeechRequest) {
  if (!existsSync(cacheDir)) return undefined;
  for (const name of readdirSync(cacheDir)) {
    if (!name.endsWith(".json")) continue;
    const other = name.slice(0, -".json".length);
    const found = readEntry(cacheDir, other);
    if (found && speechKey(found.entry.provider, found.entry.model, found.entry.request) === key && found.entry.provider === providerId && found.entry.model === model) return found;
  }
  return undefined;
}

/**
 * Speech with a disk cache keyed by speechKey, so redoing a scene only pays
 * for the lines that changed. The JSON next to each file records what
 * generated it: that is how a piece knows which parts are AI.
 */
export async function cachedSpeech(provider: SpeechProvider, request: SpeechRequest, cacheDir: string): Promise<CachedSpeech> {
  const key = speechKey(provider.id, provider.model, request);
  let found = readEntry(cacheDir, key);
  if (!found) {
    // Entries from before the neighbours left the key: the exact old key first, then the same line voiced next to other scenes.
    const old = readEntry(cacheDir, legacyKey(provider.id, provider.model, request)) ?? findVoicedElsewhere(cacheDir, key, provider.id, provider.model, request);
    if (old) {
      const file = join(cacheDir, `${key}.${old.entry.format}`);
      copyFileSync(old.file, file);
      writeFileSync(join(cacheDir, `${key}.json`), JSON.stringify(old.entry, null, 2));
      found = { entry: old.entry, file };
    }
  }
  if (found) return { audio: readFileSync(found.file), format: found.entry.format, words: found.entry.words, file: found.file, cached: true };

  const result = await provider.synthesize(request);
  mkdirSync(cacheDir, { recursive: true });
  const file = join(cacheDir, `${key}.${result.format}`);
  writeFileSync(file, result.audio);
  const entry: Entry = { provider: provider.id, model: provider.model, request, format: result.format, words: result.words, createdAt: new Date().toISOString() };
  writeFileSync(join(cacheDir, `${key}.json`), JSON.stringify(entry, null, 2));
  return { ...result, file, cached: false };
}
