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

type Convert = (voiceId: string, request: Record<string, unknown>) => Promise<ReadableStream<Uint8Array>>;

export function elevenLabsSpeech({ apiKey, model = ELEVENLABS_TTS_MODEL, convert }: { apiKey: string; model?: string; convert?: Convert }): SpeechProvider {
  const client = convert ? null : new ElevenLabsClient({ apiKey });
  const doConvert: Convert = convert ?? ((voiceId, request) => client!.textToSpeech.convert(voiceId, request as never) as Promise<ReadableStream<Uint8Array>>);
  return {
    id: "elevenlabs",
    model,
    async synthesize({ text, voice, language, previousText, nextText, settings }: SpeechRequest): Promise<SpeechResult> {
      const merged: Record<string, number> = { ...DEFAULT_SETTINGS, ...settings };
      const usable = Object.entries(merged).filter(([k]) => !model.startsWith("eleven_v4") || V4_SETTINGS.has(k));
      const voiceSettings = Object.fromEntries(usable.map(([k, v]) => [k.replace(/_(\w)/g, (_, c: string) => c.toUpperCase()), v]));
      const stream = await doConvert(voice, {
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
