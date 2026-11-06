import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { referentFrames, secondsToFrames } from "../src/bundle.ts";
import type { Timeline } from "../src/timeline.ts";

/** Only what the frame helpers read: the fps and how long each scene lasts. */
const timeline = (seconds: number[]): Timeline => ({ fps: 30, scenes: seconds.map((s, i) => ({ id: `s${i}`, durationMs: s * 1000 })) }) as unknown as Timeline;

describe("secondsToFrames", () => {
  it("takes commas and clamps to the last frame", () => {
    assert.deepEqual(secondsToFrames(["1,5", "99"], timeline([10])), [45, 299]);
  });
});

describe("referentFrames", () => {
  it("compares a replica at the same point of the story, not at the same clock", () => {
    // A 170 s referent and a 178.8 s replica: the referent's 85 s is our 89.4 s.
    assert.deepEqual(referentFrames(["0", "85", "170"], 170, timeline([100, 78.8])), [0, 2682, 5363]);
  });

  it("refuses what is not a second", () => {
    assert.throws(() => referentFrames(["-1"], 170, timeline([170])), /not a second of the referent/);
  });
});
