import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cx } from "../src/ui/cx.ts";

// The primitives' text sizes carry a floor for video (--min-text). An agent's
// size class still has to replace them, and a color class must not.
const FLOOR = "text-[length:max(16px,var(--min-text,0px))]";

describe("cx", () => {
  it("lets an agent's size replace the primitive's size with floor", () => {
    assert.equal(cx(FLOOR, "font-semibold", "text-[20px]"), "font-semibold text-[20px]");
  });

  it("keeps the size when the agent only sets a color", () => {
    assert.equal(cx(FLOOR, "text-accent"), `${FLOOR} text-accent`);
  });
});
