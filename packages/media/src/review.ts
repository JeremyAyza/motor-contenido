/** A file the reviewer sees or hears: a video with its sound, an image, a text. */
export type ReviewFile = { path: string; mimeType: string };

export type ReviewRequest = {
  /** The instructions, the rubric and the texts to judge. */
  prompt: string;
  /** In order. Say in the prompt what each one is. */
  files?: ReviewFile[];
};

export type ReviewResult = { text: string };

/**
 * Port: a model that watches what a person would see and writes a review (the
 * blind critic, docs/critico-ciego-video.md). One adapter per provider in providers/.
 */
export interface ReviewProvider {
  readonly id: string;
  readonly model: string;
  review(request: ReviewRequest): Promise<ReviewResult>;
}
