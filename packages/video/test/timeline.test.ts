import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DROP_LEAD_MS, dropMoments, musicVolume, speechSpans, type Timeline } from "../src/timeline.ts";

describe("dropMoments", () => {
  it("places each scene's drop on the whole video's clock", () => {
    const scenes = [
      { id: "a", durationMs: 1000, drops: [600] },
      { id: "b", durationMs: 2000 },
      { id: "c", durationMs: 1000, drops: [100] },
    ] as unknown as Timeline["scenes"];
    assert.deepEqual(dropMoments({ scenes }), [600, 3100]);
  });
});

describe("musicVolume with a drop", () => {
  const total = 10_000;
  const drop = 5000;

  it("goes almost silent before the figure and comes back after it", () => {
    const away = musicVolume(2000, total, 0.2, [], [drop]);
    const before = musicVolume(drop - 300, total, 0.2, [], [drop]);
    const after = musicVolume(drop + 400, total, 0.2, [], [drop]);
    assert.equal(away, 0.2);
    assert.ok(before < 0.02, `before: ${before}`);
    assert.equal(after, 0.2);
  });

  it("starts the silence DROP_LEAD_MS ahead, with a ramp", () => {
    assert.equal(musicVolume(drop - DROP_LEAD_MS - 1, total, 0.2, [], [drop]), 0.2);
    const ramp = musicVolume(drop - DROP_LEAD_MS + 100, total, 0.2, [], [drop]);
    assert.ok(ramp < 0.2 && ramp > 0.02, `ramp: ${ramp}`);
  });
});

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
