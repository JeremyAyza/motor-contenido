import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { captionPages, MAX_CHARS } from "../src/captions.ts";
import type { WordTiming } from "../src/timeline.ts";

const timed = (text: string): WordTiming[] => text.split(" ").map((w, i) => ({ text: w, startMs: i * 300, endMs: i * 300 + 250 }));
const pages = (text: string) => captionPages(timed(text)).map((p) => p.tokens.map((t) => t.text).join(""));

describe("captionPages", () => {
  it("never puts the end of one sentence and the start of the next on a page", () => {
    for (const page of pages("Pintan triángulos sin ver el resto de la escena. Los reflejos y las sombras, los fingen con trucos.")) {
      assert.doesNotMatch(page, /\.\s+\S/);
    }
  });

  it("cuts after a comma or a colon before anywhere else", () => {
    assert.deepEqual(pages("No es marketing: es la luz, al revés."), ["No es marketing:", "es la luz, al revés."]);
  });

  it("does not leave an article, a preposition or an acronym hanging", () => {
    const text = "Por eso tu RTX mezcla las dos cosas: el rasterizado dibuja la escena y los núcleos RT le suman reflejos y luz que rebota.";
    for (const page of pages(text)) {
      assert.doesNotMatch(page, /\b(el|la|los|tu|de|y)$/);
      assert.doesNotMatch(page, /^RT\b/);
    }
  });

  it("keeps pages within one line", () => {
    for (const page of pages("Una lámpara tira luz para todos lados y casi nada llega a tu ojo. El ray tracing parte de tu ojo.")) {
      assert.ok(page.length <= MAX_CHARS, page);
    }
  });

  it("keeps every word, in order, with its timing", () => {
    const words = timed("Si no le llega, ahí hay sombra.");
    const result = captionPages(words);
    assert.deepEqual(
      result.flatMap((p) => p.tokens.map((t) => t.text.trim())),
      words.map((w) => w.text),
    );
    assert.equal(result[0].startMs, 0);
    assert.equal(result.at(-1)!.tokens.at(-1)!.toMs, words.at(-1)!.endMs);
  });
});
