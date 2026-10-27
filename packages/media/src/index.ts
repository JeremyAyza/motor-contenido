import { requireEnv } from "./env.ts";
import type { ImageProvider } from "./image.ts";
import type { MusicProvider } from "./music.ts";
import { geminiImage, geminiMusic, geminiReview, geminiSpeech } from "./providers/gemini.ts";
import type { ReviewProvider } from "./review.ts";
import { elevenLabsSpeech } from "./providers/elevenlabs.ts";
import { kieSpeech } from "./providers/kie.ts";
import { freesoundSearch, openverseSearch, type SoundSearch } from "./sounds.ts";
import type { SpeechProvider } from "./speech.ts";

export * from "./align.ts";
export * from "./cache.ts";
export * from "./catalog.ts";
export * from "./chroma.ts";
export * from "./config.ts";
export * from "./env.ts";
export * from "./image.ts";
export * from "./music.ts";
export * from "./provenance.ts";
export * from "./review.ts";
export * from "./sounds.ts";
export * from "./speech.ts";
export * from "./wav.ts";
export * from "./words.ts";
export { GEMINI_IMAGE_MODEL, GEMINI_MUSIC_MODEL, GEMINI_REVIEW_MODEL, GEMINI_TTS_MODEL, geminiImage, geminiMusic, geminiReview, geminiSpeech } from "./providers/gemini.ts";
export { ELEVENLABS_TTS_MODEL, elevenLabsSpeech } from "./providers/elevenlabs.ts";
export { KIE_TTS_MODEL, kieSpeech } from "./providers/kie.ts";

/*
 * Adapters by id. Switching providers is adding an entry here and changing
 * the id in the configuration (accounts/<account>.json → voice for the voice,
 * media.config.json for images, music and sound libraries). Nothing else in
 * the flow names a provider.
 */
type Factory<T> = (model?: string) => T;

export const SPEECH_PROVIDERS: Record<string, Factory<SpeechProvider>> = {
  gemini: (model) => geminiSpeech({ apiKey: requireEnv("GEMINI_API_KEY"), model }),
  elevenlabs: (model) =>
    elevenLabsSpeech({
      apiKey: requireEnv("ELEVENLABS_API_KEY"),
      // Other accounts for when the main one runs out of credits, comma separated.
      fallbackKeys: (process.env.ELEVENLABS_API_KEY_FALLBACK ?? "").split(",").map((k) => k.trim()).filter(Boolean),
      model,
    }),
  "kie-elevenlabs": (model) => kieSpeech({ apiKey: requireEnv("KEI_KEY"), model }),
};

export const IMAGE_PROVIDERS: Record<string, Factory<ImageProvider>> = {
  gemini: (model) => geminiImage({ apiKey: requireEnv("GEMINI_API_KEY"), model }),
};

export const MUSIC_PROVIDERS: Record<string, Factory<MusicProvider>> = {
  gemini: (model) => geminiMusic({ apiKey: requireEnv("GEMINI_API_KEY"), model }),
};

export const REVIEW_PROVIDERS: Record<string, Factory<ReviewProvider>> = {
  gemini: (model) => geminiReview({ apiKey: requireEnv("GEMINI_API_KEY"), model }),
};

export const SOUND_SEARCHES: Record<string, () => SoundSearch> = {
  openverse: () => openverseSearch(),
  freesound: () => freesoundSearch({ apiKey: requireEnv("FREESOUND_API_KEY") }),
};

function pick<T>(kind: string, registry: Record<string, T>, id: string): T {
  const entry = registry[id];
  if (!entry) throw new Error(`No ${kind} adapter for "${id}". Available: ${Object.keys(registry).join(", ")}`);
  return entry;
}

export const speechProvider = (id: string, model?: string) => pick("speech", SPEECH_PROVIDERS, id)(model);
export const imageProvider = (id: string, model?: string) => pick("image", IMAGE_PROVIDERS, id)(model);
export const musicProvider = (id: string, model?: string) => pick("music", MUSIC_PROVIDERS, id)(model);
export const reviewProvider = (id: string, model?: string) => pick("review", REVIEW_PROVIDERS, id)(model);
export const soundSearch = (id: string) => pick("sound library", SOUND_SEARCHES, id)();
