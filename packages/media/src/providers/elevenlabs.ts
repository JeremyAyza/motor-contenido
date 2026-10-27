import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import type { SpeechProvider, SpeechRequest, SpeechResult } from "../speech.ts";

/*
 * ElevenLabs text to speech with its official SDK (the text-to-speech skill of
 * github.com/elevenlabs/skills). The voice is made scene by scene, so what
 * keeps it one voice is: the same voice id, a high stability, a fixed seed
 * and the neighbouring lines (request stitching).
 */

export const ELEVENLABS_TTS_MODEL = "eleven_v4";
/** The same seed for every request: the same line comes out the same way. */
const SEED = 4242;
const DEFAULT_SETTINGS = { stability: 0.65, similarity_boost: 0.8 };
/** Eleven v4 takes only stability and similarity_boost; style and speed are for v2 and v3. */
const V4_SETTINGS = new Set(["stability", "similarity_boost"]);

type Convert = (voiceId: string, request: Record<string, unknown>, apiKey: string) => Promise<ReadableStream<Uint8Array>>;

/** ElevenLabs answers with "quota_exceeded" when the account has no credits left for the request. */
export function isQuotaError(error: unknown): boolean {
  const e = error as { message?: unknown; body?: unknown } | undefined;
  return /quota_exceeded/.test(`${e?.message ?? error} ${JSON.stringify(e?.body ?? "")}`);
}

/**
 * `fallbackKeys` are other accounts to use, in order, once a key runs out of
 * credits (ELEVENLABS_API_KEY_FALLBACK): a key that ran out is not tried
 * again in the same run. The voice id has to exist in every account; the
 * premade voices do.
 */
export function elevenLabsSpeech({
  apiKey,
  fallbackKeys = [],
  model = ELEVENLABS_TTS_MODEL,
  convert,
}: {
  apiKey: string;
  fallbackKeys?: string[];
  model?: string;
  convert?: Convert;
}): SpeechProvider {
  const keys = [apiKey, ...fallbackKeys];
  const clients = new Map<string, ElevenLabsClient>();
  const doConvert: Convert =
    convert ??
    ((voiceId, request, key) => {
      if (!clients.has(key)) clients.set(key, new ElevenLabsClient({ apiKey: key }));
      return clients.get(key)!.textToSpeech.convert(voiceId, request as never) as Promise<ReadableStream<Uint8Array>>;
    });
  let current = 0;
  const withFallback = async (voiceId: string, request: Record<string, unknown>) => {
    for (;;) {
      try {
        return await doConvert(voiceId, request, keys[current]);
      } catch (error) {
        if (!isQuotaError(error) || current >= keys.length - 1) throw error;
        current++;
        console.warn(`ElevenLabs: key ${current} of ${keys.length} ran out of credits; using the fallback key`);
      }
    }
  };
  return {
    id: "elevenlabs",
    model,
    async synthesize({ text, voice, language, previousText, nextText, settings }: SpeechRequest): Promise<SpeechResult> {
      const merged: Record<string, number> = { ...DEFAULT_SETTINGS, ...settings };
      const usable = Object.entries(merged).filter(([k]) => !model.startsWith("eleven_v4") || V4_SETTINGS.has(k));
      const voiceSettings = Object.fromEntries(usable.map(([k, v]) => [k.replace(/_(\w)/g, (_, c: string) => c.toUpperCase()), v]));
      const stream = await withFallback(voice, {
        text,
        modelId: model,
        outputFormat: "mp3_44100_128",
        languageCode: (language ?? "es").slice(0, 2),
        voiceSettings,
        seed: SEED,
        ...(previousText ? { previousText } : {}),
        ...(nextText ? { nextText } : {}),
      });
      return { audio: new Uint8Array(await new Response(stream).arrayBuffer()), format: "mp3" };
    },
  };
}
