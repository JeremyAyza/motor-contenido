import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { REPO_ROOT } from "../../brand/src/index.ts";

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
