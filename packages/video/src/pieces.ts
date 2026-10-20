import type { VideoDef } from "./kit/index.ts";

/** Every piece with a video.tsx (content/<piece>/video.tsx), found by webpack. */
const context = import.meta.webpackContext("../../../content", { recursive: true, regExp: /^\.\/[^/]+\/video\.tsx$/ });

export const PIECES: { id: string; video: VideoDef }[] = context.keys().map((key) => ({
  id: key.split("/")[1],
  video: (context(key) as { default: VideoDef }).default,
}));
