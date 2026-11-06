import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { REPO_ROOT } from "../../brand/src/index.ts";
import { framesFor, type Timeline } from "./timeline.ts";

/*
 * Bundle once, render many times. Remotion recommends it: bundling the piece
 * (webpack, Tailwind and a copy of its public folder) is the same for every
 * still and every stretch of the video, so commands keep the bundle in
 * .cache/remotion/bundle-<piece>-<public>/ and reuse it until a source file or
 * the public folder changes.
 */

/** What a bundle depends on: the piece, the code it imports and its public folder. */
export function bundleInputs(dir: string, publicDir: string): string[] {
  return [dir, publicDir, ...["packages/video/src", "packages/video/remotion.config.ts", "packages/carousel/src/ui", "packages/brand/src"].map((p) => join(REPO_ROOT, p))];
}

const SKIP = new Set(["node_modules", "out", ".cache"]);

/** Path, size and modification time of every file under `paths`: cheap, and enough to know when to bundle again. */
export function fingerprint(paths: string[], root = REPO_ROOT, publicDir?: string): string {
  const hash = createHash("sha256");
  const walk = (path: string, insidePublic: boolean) => {
    if (!existsSync(path)) return;
    const stat = statSync(path);
    if (stat.isDirectory()) {
      for (const name of readdirSync(path).sort()) if (insidePublic || !SKIP.has(name)) walk(join(path, name), insidePublic);
    } else {
      hash.update(`${relative(root, path)}\0${stat.size}\0${stat.mtimeMs}\n`);
    }
  };
  for (const p of paths) walk(p, p === publicDir);
  return hash.digest("hex").slice(0, 16);
}

export interface BundleRef {
  /** The folder to pass to remotion still/render instead of the entry point. */
  dir: string;
  /** False when it was reused. */
  fresh: boolean;
}

/**
 * The bundle of a piece with a public folder, made with `make(outDir)` only
 * when its inputs changed. One bundle per piece and public folder is kept.
 */
export function cachedBundle(piece: string, dir: string, publicDir: string, make: (outDir: string) => void, cache = join(REPO_ROOT, ".cache/remotion")): BundleRef {
  const kind = relative(dir, publicDir).replace(/[\\/]/g, "-") || "public";
  const out = join(cache, `bundle-${piece}-${kind}`);
  const stamp = join(out, ".inputs");
  const inputs = fingerprint(bundleInputs(dir, publicDir), REPO_ROOT, publicDir);
  if (existsSync(stamp) && readFileSync(stamp, "utf8") === inputs) return { dir: out, fresh: false };
  rmSync(out, { recursive: true, force: true });
  make(out);
  writeFileSync(stamp, inputs);
  return { dir: out, fresh: true };
}

/** Where each scene starts and ends in frames (end exclusive), the way PieceVideo lays out its Series. */
export function sceneFrames(timeline: Timeline): { id: string; from: number; to: number }[] {
  let at = 0;
  return timeline.scenes.map((scene) => {
    const from = at;
    at += framesFor(scene.durationMs, timeline.fps);
    return { id: scene.id, from, to: at };
  });
}

/** The stretch of frames that covers the given scenes, from the first to the last (inclusive). */
export function scenesRange(timeline: Timeline, ids: string[]): { from: number; to: number } {
  const all = sceneFrames(timeline);
  const unknown = ids.filter((id) => !all.some((s) => s.id === id));
  if (unknown.length) throw new Error(`Unknown scene(s): ${unknown.join(", ")}. The scenes are: ${all.map((s) => s.id).join(", ")}`);
  const picked = all.filter((s) => ids.includes(s.id));
  return { from: Math.min(...picked.map((s) => s.from)), to: Math.max(...picked.map((s) => s.to)) - 1 };
}

/** Seconds as frames of the video, clamped to it. Accepts "12", "12.5" or "12,5". */
export function secondsToFrames(values: string[], timeline: Timeline): number[] {
  const last = framesFor(timeline.scenes.reduce((sum, s) => sum + s.durationMs, 0), timeline.fps) - 1;
  return values.map((value) => {
    const seconds = Number(value.replace(",", "."));
    if (!Number.isFinite(seconds) || seconds < 0) throw new Error(`"${value}" is not a second of the video`);
    return Math.min(last, Math.round(seconds * timeline.fps));
  });
}

/**
 * Frames of a replica at its referent's seconds: each one scaled by our length over the referent's
 * (`target`), so a replica 5 % longer is compared at the same point of the story, not at the same clock.
 */
export function referentFrames(values: string[], target: number, timeline: Timeline): number[] {
  const ours = timeline.scenes.reduce((sum, s) => sum + s.durationMs, 0) / 1000;
  const scaled = values.map((value) => {
    const seconds = Number(value.replace(",", "."));
    if (!Number.isFinite(seconds) || seconds < 0) throw new Error(`"${value}" is not a second of the referent`);
    return String((seconds * ours) / target);
  });
  return secondsToFrames(scaled, timeline);
}
