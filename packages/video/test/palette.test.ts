import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { piecePalette } from "../src/palette.ts";

const night = { bg: "#0B0F14", ink: "#F0F6FC", accent: "#76B900", accentInk: "#0B0F14", surface: "#151C24", muted: "#8B949E" };

describe("piecePalette", () => {
  it("keeps the palette of the art direction", () => {
    assert.deepEqual(piecePalette(night, "post.json"), night);
  });

  it("rejects an accent that does not read on the background", () => {
    assert.throws(() => piecePalette({ ...night, bg: "#F6F1E7", ink: "#1F1D1A", surface: undefined }, "video.json"), /video\.json → palette\.accent #76B900 has 2\.14:1 on bg/);
  });

  it("checks the surface too, where the captions also go", () => {
    assert.throws(() => piecePalette({ ...night, surface: "#5A8A00" }, "post.json"), /on surface \(#5A8A00\)/);
  });
});
