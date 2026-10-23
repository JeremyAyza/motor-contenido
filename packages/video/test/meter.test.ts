import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatMeter, METER_RAMP_MS, meterValueAt, resolveMeter } from "../src/kit/meter.ts";

const scenes = [
  { id: "gancho", durationMs: 3000, words: [{ text: "Un", startMs: 0, endMs: 200 }, { text: "usuario.", startMs: 200, endMs: 600 }] },
  { id: "crece", durationMs: 4000, words: [{ text: "Llegan", startMs: 100, endMs: 400 }, { text: "millones.", startMs: 1500, endMs: 2000 }] },
];

describe("resolveMeter", () => {
  it("puts each step on the whole video's clock, by the word or the scene's start", () => {
    const points = resolveMeter({ start: 1, steps: [{ scene: "crece", word: "millones", value: 50_000_000 }, { scene: "crece", value: 2 }] }, scenes);
    assert.deepEqual(points, [
      { ms: 3000, value: 2 },
      { ms: 4500, value: 50_000_000 },
    ]);
  });

  it("says which words the scene has when the word is wrong", () => {
    assert.throws(() => resolveMeter({ start: 0, steps: [{ scene: "crece", word: "miles", value: 1 }] }, scenes), /"miles" is not said in scene "crece". Words: Llegan millones\./);
  });
});

describe("meterValueAt", () => {
  const points = [
    { ms: 1000, value: 10 },
    { ms: 5000, value: 4 },
  ];

  it("holds the start value until the first step", () => {
    assert.equal(meterValueAt(1, points, 999), 1);
  });

  it("counts to each step and holds it", () => {
    assert.ok(meterValueAt(1, points, 1000 + METER_RAMP_MS / 2) > 1);
    assert.equal(meterValueAt(1, points, 1000 + METER_RAMP_MS), 10);
    assert.equal(meterValueAt(1, points, 4999), 10);
    assert.equal(meterValueAt(1, points, 9000), 4);
  });
});

describe("formatMeter", () => {
  it("writes numbers and money like the carousel counters (es-MX)", () => {
    assert.equal(formatMeter(1_250_000, {}), "1,250,000");
    assert.equal(formatMeter(912, { kind: "money" }), "$912.00");
    assert.equal(formatMeter(48, { unit: "peticiones" }), "48 peticiones");
  });
});
