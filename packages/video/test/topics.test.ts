import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { recentSimilar, similarTopics, topicWords } from "../src/topics.ts";

describe("similarTopics", () => {
  it("compares the words that say what a topic is about", () => {
    assert.deepEqual([...topicWords("Qué pasa en un git push")], ["pasa", "git", "push"]);
    assert.equal(similarTopics("Tokens y precios de la IA", "El taxímetro de la IA: tokens"), true);
    assert.equal(similarTopics("Qué pasa en un git push", "Anthropic reemplazó a Git con Scion"), false);
  });
});

describe("recentSimilar", () => {
  const root = mkdtempSync(join(tmpdir(), "topics-"));
  const piece = (name: string, file: string, topic: string) => {
    mkdirSync(join(root, name), { recursive: true });
    writeFileSync(join(root, name, file), JSON.stringify({ topic }));
  };
  piece("2026-10-10-tokens-ia", "post.json", "Cuánto cuestan los tokens de la IA");
  piece("2026-09-01-tokens-viejo", "video.json", "Los tokens de la IA");
  piece("2026-10-12-git", "video.json", "Ramas de Git");

  it("finds a similar topic of the last 14 days, not an older one", () => {
    assert.deepEqual(recentSimilar(root, "2026-10-20-tokens", "El precio de los tokens de IA"), [{ piece: "2026-10-10-tokens-ia", topic: "Cuánto cuestan los tokens de la IA" }]);
  });

  it("says nothing when the topic is new", () => {
    assert.deepEqual(recentSimilar(root, "2026-10-20-push", "Qué pasa en un git push"), []);
  });
});
