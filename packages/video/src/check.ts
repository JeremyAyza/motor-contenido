import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { REPO_ROOT } from "../../brand/src/index.ts";
import { normalizeWord } from "../../media/src/words.ts";
import { CUT_MARGIN_MS, type Timeline } from "./timeline.ts";

/*
 * The typecheck of one piece: its own files and whatever they import (the kit,
 * the primitives), not the other pieces of content/. The whole repo takes
 * about 50 s; one piece, a few seconds, and less the second time, because the
 * build info stays in .cache/tsc/.
 */

const TSC = join(REPO_ROOT, "node_modules/typescript/bin/tsc");

/** The tsconfig of one piece, next to its build info in .cache/tsc/. */
export function pieceTsconfig(dir: string, cache = join(REPO_ROOT, ".cache/tsc")): { file: string; config: object } {
  const piece = basename(dir);
  const file = join(cache, `${piece}.json`);
  const fromCache = (path: string) => relative(cache, path).replace(/\\/g, "/");
  const config = {
    extends: fromCache(join(REPO_ROOT, "tsconfig.json")),
    compilerOptions: { incremental: true, tsBuildInfoFile: `${piece}.tsbuildinfo`, noEmit: true },
    include: [fromCache(join(dir, "**/*.tsx")), fromCache(join(dir, "**/*.ts")), fromCache(join(REPO_ROOT, "packages/video/src/env.d.ts"))],
    exclude: [fromCache(join(dir, "out"))],
  };
  return { file, config };
}

/** Errors of tsc for one piece, as tsc prints them; empty when it compiles. */
export function checkPiece(dir: string): string[] {
  const { file, config } = pieceTsconfig(dir);
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`);
  const result = spawnSync(process.execPath, [TSC, "-p", file, "--pretty", "false"], { cwd: REPO_ROOT, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  if (result.status === 0) return [];
  return (result.stdout + result.stderr)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^(\.\.\/)+/, ""));
}

/** The .ts and .tsx files of a piece, without out/. */
function pieceFiles(dir: string): string[] {
  const files: string[] = [];
  const walk = (path: string) => {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name !== "out") walk(join(path, entry.name));
      else if (/\.tsx?$/.test(entry.name)) files.push(join(path, entry.name));
    }
  };
  if (existsSync(dir)) walk(dir);
  return files;
}

/** A cue the code asks for: a word of a scene, its nth time. */
export type CueCall = { scene: string; word: string; nth: number; file: string };

/**
 * The cues a piece's code asks for, read from the source: useCue("word", n)
 * in scenes/<id>.tsx (the scene is the file's name) and useStageCue("id",
 * "word", n) anywhere. useCue outside scenes/ is not tied to a scene by its
 * file, so it is left to the render.
 */
export function cueCalls(files: Array<{ file: string; source: string }>): CueCall[] {
  const calls: CueCall[] = [];
  for (const { file, source } of files) {
    const scene = /[\\/]scenes[\\/]([^\\/]+)\.tsx?$/.exec(file)?.[1];
    if (scene) {
      for (const m of source.matchAll(/\buseCue\(\s*["'`]([^"'`]+)["'`]\s*(?:,\s*(\d+)\s*)?\)/g)) calls.push({ scene, word: m[1], nth: Number(m[2] ?? 1), file });
    }
    for (const m of source.matchAll(/\buseStageCue\(\s*["'`]([^"'`]+)["'`]\s*,\s*["'`]([^"'`]+)["'`]\s*(?:,\s*(\d+)\s*)?\)/g)) {
      calls.push({ scene: m[1], word: m[2], nth: Number(m[3] ?? 1), file });
    }
  }
  return calls;
}

/**
 * Cues and sound effects too close to the end of their scene (CUT_MARGIN_MS),
 * before any render: what they start would be cut halfway. Warnings, in
 * Spanish (the person reads them), with the timings of the timeline at hand
 * (the voice's, or the storyboard's estimate).
 */
export function cueMarginWarnings(timeline: Pick<Timeline, "scenes">, calls: CueCall[]): string[] {
  const warnings = new Set<string>();
  const close = (atMs: number, durationMs: number) => durationMs - atMs < CUT_MARGIN_MS;
  const left = (atMs: number, durationMs: number) => `${((durationMs - atMs) / 1000).toFixed(2)} s`;
  for (const call of calls) {
    const scene = timeline.scenes.find((s) => s.id === call.scene);
    if (!scene) continue;
    const hit = scene.words.filter((w) => normalizeWord(w.text) === normalizeWord(call.word))[call.nth - 1];
    if (!hit || !close(hit.startMs, scene.durationMs)) continue;
    warnings.add(
      `"${call.word}" (escena "${call.scene}") se dice a ${left(hit.startMs, scene.durationMs)} del corte: lo que dispara queda a medias. Usa una palabra anterior, súmale hold a la escena o pásalo a la siguiente (${relative(REPO_ROOT, call.file).replace(/\\/g, "/")})`,
    );
  }
  for (const scene of timeline.scenes) {
    for (const sfx of scene.sfx) {
      if (close(sfx.atMs, scene.durationMs)) warnings.add(`Un efecto de la escena "${scene.id}" suena a ${left(sfx.atMs, scene.durationMs)} del corte y se corta con ella: adelántalo o súmale hold`);
    }
  }
  return [...warnings];
}

/** cueMarginWarnings for a piece folder, with the timeline of video:prepare or else of the storyboard; none without one. */
export function pieceCueWarnings(dir: string): string[] {
  const file = ["out/video/timeline.json", "out/storyboard/timeline.json"].map((f) => join(dir, f)).find((f) => existsSync(f));
  if (!file) return [];
  const timeline = JSON.parse(readFileSync(file, "utf8")) as Timeline;
  return cueMarginWarnings(timeline, cueCalls(pieceFiles(dir).map((f) => ({ file: f, source: readFileSync(f, "utf8") }))));
}

/** Names of the motion grammar (kit/grammar.tsx) that pieces used to write again. */
const GRAMMAR = ["clamp", "fade", "span", "bump", "unit", "lerp", "keys", "popAt", "rigAt", "shakeAt", "inOut", "back", "easeInOut", "useT", "At", "Appear"];

/** The piece's own definitions of the grammar: warnings, since @motor/video already has them. */
export function grammarRedefinitions(dir: string): string[] {
  const files = pieceFiles(dir);
  const found = new Set<string>();
  const pattern = new RegExp(`^(?:export )?(?:const|function) (${GRAMMAR.join("|")})\\b`, "gm");
  for (const file of files) for (const m of readFileSync(file, "utf8").matchAll(pattern)) found.add(m[1]);
  return found.size ? [`La pieza redefine ${[...found].join(", ")}: usa la gramática de @motor/video (packages/video/library/README.md)`] : [];
}
