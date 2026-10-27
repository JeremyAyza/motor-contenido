import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { GoogleGenAI } from "@google/genai";
import type { ImageProvider } from "../image.ts";
import type { MusicProvider } from "../music.ts";
import type { ReviewProvider } from "../review.ts";
import type { SpeechProvider } from "../speech.ts";

export const GEMINI_TTS_MODEL = "gemini-3.8-flash-tts";
export const GEMINI_IMAGE_MODEL = "gemini-nano-banana-2.1";
/** 30 s clips: enough for a bed under a Reel, and half the price of a full song. */
export const GEMINI_MUSIC_MODEL = "lyria-3-clip-preview";
/** Watches video with its sound, with a 1M-token window. */
export const GEMINI_REVIEW_MODEL = "gemini-3.8-flash";

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

const FILE_POLL_MS = 2000;
const FILE_TIMEOUT_MS = 5 * 60_000;

/**
 * The blind critic. Videos go through the Files API (a Reel is 30 to 50 MB,
 * over the inline limit) and are deleted after the answer; images and texts go
 * inline. Gemini samples the video at 1 fps and hears its audio track.
 */
export function geminiReview({ apiKey, model = GEMINI_REVIEW_MODEL, thinking = "high" }: { apiKey: string; model?: string; thinking?: "low" | "medium" | "high" }): ReviewProvider {
  const client = new GoogleGenAI({ apiKey });

  async function upload(path: string, mimeType: string): Promise<{ name: string; uri: string }> {
    let file = await client.files.upload({ file: path, config: { mimeType, displayName: basename(path) } });
    const deadline = Date.now() + FILE_TIMEOUT_MS;
    while (file.state === "PROCESSING") {
      if (Date.now() > deadline) throw new Error(`Gemini took too long to process ${basename(path)}`);
      await new Promise((done) => setTimeout(done, FILE_POLL_MS));
      file = await client.files.get({ name: file.name! });
    }
    if (file.state !== "ACTIVE" || !file.uri) throw new Error(`Gemini could not process ${basename(path)} (${file.state})`);
    return { name: file.name!, uri: file.uri };
  }

  return {
    id: "gemini",
    model,
    async review({ prompt, files = [] }) {
      const uploaded: string[] = [];
      try {
        const content = [];
        for (const f of files) {
          if (f.mimeType.startsWith("video/")) {
            const { name, uri } = await upload(f.path, f.mimeType);
            uploaded.push(name);
            content.push({ type: "video" as const, uri, mime_type: f.mimeType });
          } else if (f.mimeType.startsWith("image/")) {
            content.push({ type: "image" as const, data: readFileSync(f.path).toString("base64"), mime_type: f.mimeType });
          } else {
            content.push({ type: "text" as const, text: `--- ${basename(f.path)} ---\n${readFileSync(f.path, "utf8")}` });
          }
        }
        const interaction = await client.interactions.create({
          model,
          input: [...content, { type: "text", text: prompt }],
          generation_config: { thinking_level: thinking },
        });
        const text = interaction.output_text?.trim();
        if (!text) throw new Error(`Gemini returned no review (model ${model})`);
        return { text };
      } finally {
        for (const name of uploaded) await client.files.delete({ name }).catch(() => undefined);
      }
    },
  };
}
