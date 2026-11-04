import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { bump, EASE, es, fade, keys, rigAt, shakeAt, span, unit } from "../src/kit/grammar.tsx";

describe("the motion grammar", () => {
  it("fades and spans in seconds, holding the ends", () => {
    assert.equal(fade(0, 1), 0);
    assert.ok(Math.abs(fade(1.15, 1) - 0.5) < 1e-9);
    assert.equal(fade(5, 1), 1);
    assert.equal(span(2, 1, 3), 1);
    assert.equal(span(4, 1, 3), 0);
    assert.equal(unit(0.5, 0, 1), 0.5);
    assert.equal(bump(0.5, 0, 1), 1);
  });

  it("eases from 0 to 1, and back overshoots before settling", () => {
    for (const ease of Object.values(EASE)) {
      assert.equal(Math.round(ease(0) * 1000) / 1000, 0);
      assert.equal(Math.round(ease(1) * 1000) / 1000, 1);
    }
    assert.ok(EASE.back(0.7) > 1);
  });

  it("follows keys and holds the first and the last", () => {
    const list: Array<[number, number]> = [[1, 0], [2, 10], [4, 20]];
    assert.equal(keys(0, list), 0);
    assert.equal(keys(1.5, list), 5);
    assert.equal(keys(9, list), 20);
  });

  it("moves a camera rig shot by shot and says when it moves", () => {
    const home = { x: 0, y: 0, z: 1 };
    const shots = [{ at: 1, dur: 1, x: 100, y: 50, z: 2 }];
    assert.deepEqual(rigAt(0.5, home, shots), { ...home, moving: false });
    assert.equal(rigAt(1.5, home, shots).moving, true);
    assert.deepEqual(rigAt(3, home, shots), { x: 100, y: 50, z: 2, moving: false });
  });

  it("shakes only for a moment after each hit", () => {
    assert.deepEqual(shakeAt(0.5, [1]), { x: 0, y: 0 });
    assert.notDeepEqual(shakeAt(1.05, [1]), { x: 0, y: 0 });
    assert.deepEqual(shakeAt(2, [1]), { x: 0, y: 0 });
  });

  it("writes numbers the Spanish way", () => {
    assert.equal(es(1000000), "1.000.000");
    assert.equal(es(0.25, 2), "0,25");
    assert.equal(es(1234.5, 1), "1.234,5");
    assert.equal(es(-3), "−3");
  });
});
