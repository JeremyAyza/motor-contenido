import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { stripCoverage, transcript } from "../src/critique.ts";
import type { VideoScript } from "../src/script.ts";
import type { Timeline } from "../src/timeline.ts";

describe("stripCoverage", () => {
  it("puts six frames, two seconds apart, on each strip", () => {
    assert.deepEqual(stripCoverage(25_000), [
      { file: "tira-01.png", from: 0, to: 10 },
      { file: "tira-02.png", from: 12, to: 22 },
      { file: "tira-03.png", from: 24, to: 24 },
    ]);
  });
});

describe("transcript", () => {
  const script = { scenes: [{ id: "a", say: "Primera escena." }, { id: "b", say: "Segunda escena." }] } as VideoScript;
  const timeline = {
    scenes: [
      { id: "a", durationMs: 61_000, words: [{ text: "Primera", startMs: 0, endMs: 300 }], sfx: [] },
      { id: "b", durationMs: 4_000, words: [{ text: "Segunda", startMs: 500, endMs: 900 }], sfx: [{ src: "sfx/whoosh.mp3", atMs: 1_000, volume: 1 }] },
    ],
    music: { src: "music/cama.mp3", volume: 0.12 },
  } as unknown as Timeline;

  it("gives what the voice says with the second each part starts", () => {
    const text = transcript(script, timeline);
    assert.match(text, /\*\*0:00\*\* Primera escena\./);
    assert.match(text, /\*\*1:01\*\* Segunda escena\./);
    assert.match(text, /Termina en 1:05\./);
  });

  it("says what else is heard, without the scene ids", () => {
    const text = transcript(script, timeline);
    assert.match(text, /música de fondo/);
    assert.match(text, /- 1:02: un efecto de sonido \(whoosh\)/);
    assert.doesNotMatch(text, /\bb\b/);
  });
});
