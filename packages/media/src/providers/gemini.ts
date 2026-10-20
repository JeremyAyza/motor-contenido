import { GoogleGenAI } from "@google/genai";
import type { ImageProvider } from "../image.ts";
import type { MusicProvider } from "../music.ts";
import type { SpeechProvider } from "../speech.ts";

export const GEMINI_TTS_MODEL = "gemini-3.8-flash-tts";
export const GEMINI_IMAGE_MODEL = "gemini-nano-banana-2.1";
/** 30 s clips: enough for a bed under a Reel, and half the price of a full song. */
export const GEMINI_MUSIC_MODEL = "lyria-3-clip-preview";

/*
 * Gemini adapters, all through the Interactions API of @google/genai. Docs:
 * speech https://ai.google.dev/gemini-api/docs/speech-generation, images
 * https://ai.google.dev/gemini-api/docs/image-generation and music
 * https://ai.google.dev/gemini-api/docs/music-generation. Every output
 * carries a SynthID watermark.
 */

/** TTS. It returns WAV (24 kHz, mono, 16-bit) and no word timings. */
export function geminiSpeech({ apiKey, model = GEMINI_TTS_MODEL }: { apiKey: string; model?: string }): SpeechProvider {
  const client = new GoogleGenAI({ apiKey });
  return {
    id: "gemini",
    model,
    async synthesize({ text, voice, style, language }) {
      const interaction = await client.interactions.create({
        model,
        input: [
          {
            type: "user_input",
            content: [{ type: "text", text, annotations: style ? [{ type: "speech_metadata", style }] : [] }],
          },
        ],
        response_format: { type: "audio" },
        generation_config: { speech_config: [{ voice, ...(language ? { language } : {}) }] },
      });
      const data = interaction.output_audio?.data;
      if (!data) throw new Error(`Gemini returned no audio (model ${model}, voice ${voice})`);
      return { audio: Buffer.from(data, "base64"), format: "wav" };
    },
  };
}

/** Nano Banana. References go after the prompt, in order, as inline images. It only returns JPEG. */
export function geminiImage({ apiKey, model = GEMINI_IMAGE_MODEL }: { apiKey: string; model?: string }): ImageProvider {
  const client = new GoogleGenAI({ apiKey });
  return {
    id: "gemini",
    model,
    async generate({ prompt, references = [], aspectRatio, size }) {
      const interaction = await client.interactions.create({
        model,
        input: [
          { type: "text", text: prompt },
          ...references.map((r) => ({ type: "image" as const, mime_type: r.mimeType, data: Buffer.from(r.data).toString("base64") })),
        ],
        response_format: { type: "image", ...(aspectRatio ? { aspect_ratio: aspectRatio } : {}), ...(size ? { image_size: size } : {}) },
      });
      const image = interaction.output_image;
      if (!image?.data) throw new Error(`Gemini returned no image (model ${model})`);
      return { image: Buffer.from(image.data, "base64"), mimeType: image.mime_type ?? "image/jpeg" };
    },
  };
}

/** Lyria. It returns MP3; the clip model always makes 30 s. */
export function geminiMusic({ apiKey, model = GEMINI_MUSIC_MODEL }: { apiKey: string; model?: string }): MusicProvider {
  const client = new GoogleGenAI({ apiKey });
  return {
    id: "gemini",
    model,
    async compose({ prompt }) {
      const interaction = await client.interactions.create({ model, input: prompt, response_format: { type: "audio" } });
      const data = interaction.output_audio?.data;
      if (!data) throw new Error(`Gemini returned no music (model ${model})`);
      return { audio: Buffer.from(data, "base64"), format: "mp3" };
    },
  };
}
