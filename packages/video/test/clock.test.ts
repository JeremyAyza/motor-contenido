import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clockSheet, isNumberWord } from "../src/clock.ts";
import type { Timeline } from "../src/timeline.ts";

describe("isNumberWord", () => {
  it("knows digits and numbers said in Spanish", () => {
    for (const w of ["60", "1.000", "¿tres", "millones", "mitad"]) assert.ok(isNumberWord(w), w);
    for (const w of ["dosis", "unos", "cien­tífico", "hola"]) assert.ok(!isNumberWord(w), w);
  });
});

describe("clockSheet", () => {
  const timeline = {
    piece: "p",
    scenes: [
      {
        id: "gancho",
        durationMs: 2000,
        words: [
          { text: "Cuesta", startMs: 0, endMs: 300 },
          { text: "60", startMs: 700, endMs: 900 },
          { text: "dólares", startMs: 1500, endMs: 1900 },
        ],
      },
      { id: "cierre", durationMs: 1000, words: [] },
    ],
  } as unknown as Timeline;
  const sheet = clockSheet(timeline);

  it("lists each scene with its place on the video", () => {
    assert.match(sheet, /## gancho · 0\.00–2\.00 s \(2\.00 s\)/);
    assert.match(sheet, /## cierre · 2\.00–3\.00 s/);
  });

  it("marks pauses, figures and words too close to the cut", () => {
    assert.match(sheet, /Cuesta@0\.00 \/0\.40\/ \*\*60@0\.70\*\* \/0\.60\/ dólares@1\.50⚠/);
    assert.match(sheet, /\(sin voz\)/);
  });
});
