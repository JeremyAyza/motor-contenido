import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { randomBetween } from "../src/human.ts";

describe("randomBetween", () => {
  it("stays within both ends", () => {
    assert.equal(randomBetween(500, 3000, () => 0), 500);
    assert.equal(randomBetween(500, 3000, () => 0.999999), 3000);
    for (let i = 0; i < 1000; i++) {
      const n = randomBetween(500, 3000);
      assert.ok(n >= 500 && n <= 3000 && Number.isInteger(n));
    }
  });
});
