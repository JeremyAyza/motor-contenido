import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checkDocs, estimateTokens, markdownLinks } from "../src/docs-check.ts";

describe("markdownLinks", () => {
  it("takes relative links and leaves out URLs, anchors and code", () => {
    const text = "[a](docs/reel.md) [b](https://x.dev) [c](#paso) [d](referencia/voz.md#tono) `[e](no.md)`\n```\n[f](tampoco.md)\n```";
    assert.deepEqual(markdownLinks(text), ["docs/reel.md", "referencia/voz.md"]);
  });

  it("estimates tokens from characters", () => {
    assert.equal(estimateTokens("x".repeat(35)), 10);
  });
});

describe("the repo's documentation", () => {
  it("has no broken links, no core file over its size and no orphan document", () => {
    assert.deepEqual(checkDocs(), []);
  });
});
