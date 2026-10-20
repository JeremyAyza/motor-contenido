export type MusicRequest = {
  /** Mood, instruments and tempo, in plain words. Say "instrumental, no vocals" for a bed under a voice. */
  prompt: string;
};

export type MusicResult = { audio: Uint8Array; format: "mp3" | "wav" };

/** Port: a description in, a music track out. One adapter per provider in providers/. */
export interface MusicProvider {
  readonly id: string;
  readonly model: string;
  compose(request: MusicRequest): Promise<MusicResult>;
}
