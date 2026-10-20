import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { matchWords, wordsFromCaptions } from "../src/align.ts";
import { scriptWords } from "../src/words.ts";

const heard = (...words: Array<[string, number, number]>) => words.map(([text, startMs, endMs]) => ({ text, startMs, endMs }));

describe("scriptWords", () => {
  it("keeps punctuation on the word it follows", () => {
    assert.deepEqual(scriptWords("No parte de la lámpara : parte de tu ojo."), ["No", "parte", "de", "la", "lámpara:", "parte", "de", "tu", "ojo."]);
  });
});

describe("wordsFromCaptions", () => {
  it("joins tokens that do not start with a space", () => {
    const words = wordsFromCaptions([
      { text: " lám", startMs: 100, endMs: 200, timestampMs: 150, confidence: 1 },
      { text: "para", startMs: 200, endMs: 380, timestampMs: 290, confidence: 1 },
      { text: " ojo", startMs: 400, endMs: 600, timestampMs: 500, confidence: 1 },
    ]);
    assert.deepEqual(words, heard(["lámpara", 100, 380], ["ojo", 400, 600]));
  });
});

describe("matchWords", () => {
  it("shows the script, with the recognizer's times", () => {
    const words = matchWords("El ray tracing", heard(["el", 0, 100], ["rey", 100, 300], ["tracing", 300, 700]));
    assert.deepEqual(words, heard(["El", 0, 100], ["ray", 100, 300], ["tracing", 300, 700]));
  });

  it("ignores accents and punctuation when matching", () => {
    const [first] = matchWords("¿Lámpara?", heard(["lampara", 50, 400]));
    assert.deepEqual(first, { text: "¿Lámpara?", startMs: 50, endMs: 400 });
  });

  it("interpolates words the recognizer missed", () => {
    const words = matchWords("sigue la luz", heard(["sigue", 0, 300], ["luz", 500, 800]));
    assert.equal(words[1].text, "la");
    assert.equal(words[1].startMs, 300);
    assert.equal(words[1].endMs, 500);
  });
});
