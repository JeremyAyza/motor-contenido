/** An image the model takes as reference: a character to keep, an object to include. */
export type ImageReference = { data: Uint8Array; mimeType: string };

export type ImageRequest = {
  prompt: string;
  /** Say in the prompt what each reference is: the provider gets them in order. */
  references?: ImageReference[];
  /** "1:1", "9:16", "4:5"... */
  aspectRatio?: string;
  size?: "1K" | "2K" | "4K";
};

export type ImageResult = { image: Uint8Array; mimeType: string };

/** Port: a prompt (and references) in, an image out. One adapter per provider in providers/. */
export interface ImageProvider {
  readonly id: string;
  readonly model: string;
  generate(request: ImageRequest): Promise<ImageResult>;
}
