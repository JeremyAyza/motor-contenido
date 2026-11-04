import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildPrompt, changedFiles, inScope, INLINE_LIMIT, parseArgs, toRepoPath } from "../src/agy.ts";
import { REPO_ROOT } from "../src/repo.ts";

describe("parseArgs", () => {
  it("takes the spec wherever it is and the scope from --pieza and --toca", () => {
    const o = parseArgs(["--pieza", "content/2026-11-02-x", "spec.md", "--toca", "packages/video/src/kit,docs/reel.md"]);
    assert.equal(o.spec, "spec.md");
    assert.deepEqual(o.scope, ["content/2026-11-02-x", "packages/video/src/kit", "docs/reel.md"]);
    assert.equal(o.plan, false);
    assert.equal(o.model, "gemini-3.8-flash-high");
  });

  it("rejects a bad effort or time", () => {
    assert.throws(() => parseArgs(["s.md", "--esfuerzo", "max"]), /low, medium or high/);
    assert.throws(() => parseArgs(["s.md", "--tiempo", "0"]), /minutes/);
    assert.throws(() => parseArgs(["--plan"]), /Missing the spec/);
  });
});

describe("scope", () => {
  it("keeps paths inside the repo, with forward slashes", () => {
    assert.equal(toRepoPath("content/a/", REPO_ROOT), "content/a");
    assert.throws(() => toRepoPath("../otro", REPO_ROOT), /outside the repo/);
  });

  it("matches a folder and what is under it, not a sibling with the same prefix", () => {
    assert.equal(inScope("content/a/video.tsx", ["content/a"]), true);
    assert.equal(inScope("content/ab/video.tsx", ["content/a"]), false);
    assert.equal(inScope("anything", []), true);
  });
});

describe("changedFiles", () => {
  it("finds new files and files whose content changed, not the ones left as they were", () => {
    const before = new Map([["a", " M:1"], ["b", " M:2"]]);
    const after = new Map([["a", " M:1"], ["b", " M:3"], ["c", "??:4"]]);
    assert.deepEqual(changedFiles(before, after), ["b", "c"]);
  });
});

describe("buildPrompt", () => {
  it("puts the rules first and a long spec as a file to read", () => {
    const short = buildPrompt("Cambia el margen.", { scope: ["content/a"], plan: false });
    assert.match(short, /Solo puedes cambiar archivos dentro de: content\/a/);
    assert.match(short, /Cambia el margen\.$/);
    const long = buildPrompt("x".repeat(INLINE_LIMIT + 1), { scope: [], plan: true }, ".cache/agy/s.spec.md");
    assert.match(long, /solo lectura/);
    assert.match(long, /está en \.cache\/agy\/s\.spec\.md/);
  });
});
