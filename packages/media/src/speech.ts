/** A word of the narration and when it is said, in ms from the start of its audio. */
export type WordTiming = { text: string; startMs: number; endMs: number };

export type SpeechRequest = {
  text: string;
  /** The provider's voice id, e.g. "Kore" in Gemini. */
  voice: string;
  /** How to say it, in plain words. Providers without style control ignore it. */
  style?: string;
  /** BCP 47 language tag. Leave it out to let the provider detect it from the text. */
  language?: string;
};

export type SpeechResult = {
  audio: Uint8Array;
  format: "wav" | "mp3";
  /** Word timings, when the provider returns them. Without them, an Aligner computes them. */
  words?: WordTiming[];
};

/** Port: text in, speech out. There is one adapter per provider in providers/. */
export interface SpeechProvider {
  readonly id: string;
  readonly model: string;
  synthesize(request: SpeechRequest): Promise<SpeechResult>;
}
