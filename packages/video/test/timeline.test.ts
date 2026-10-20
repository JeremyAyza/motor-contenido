import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { musicVolume, speechSpans, type Timeline } from "../src/timeline.ts";

const timeline = {
  scenes: [
    { id: "a", durationMs: 1000, words: [{ text: "hola", startMs: 100, endMs: 400 }] },
    { id: "b", durationMs: 1000, words: [{ text: "chau", startMs: 200, endMs: 500 }] },
  ],
} as unknown as Timeline;

describe("speechSpans", () => {
  it("places each word on the whole video's clock", () => {
    assert.deepEqual(speechSpans(timeline), [
      [100, 400],
      [1200, 1500],
    ]);
  });
});

describe("musicVolume", () => {
  const spans: Array<[number, number]> = [[2000, 3000]];
  const total = 10_000;

  it("fades in and out", () => {
    assert.equal(musicVolume(0, total, 0.2, spans), 0);
    assert.equal(musicVolume(total, total, 0.2, spans), 0);
  });

  it("is at its volume away from the voice", () => {
    assert.equal(musicVolume(6000, total, 0.2, spans), 0.2);
  });

  it("goes down while the voice speaks, with a ramp", () => {
    const speaking = musicVolume(2500, total, 0.2, spans);
    const near = musicVolume(1900, total, 0.2, spans);
    assert.ok(Math.abs(speaking - 0.09) < 1e-9);
    assert.ok(near > speaking && near < 0.2);
  });
});
