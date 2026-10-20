import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { findPython } from "../../carousel/src/python.ts";
import { reelWarnings, runReelChecks, type Beat, type BeatSheet, type HookScore } from "../src/reel.ts";

const hook = (score: number, flags: string[] = []): HookScore => ({ hook: "x", onScreen: "x", formula: 1, score, verdict: score < 50 ? "WEAK" : "OK", weakest: "SPECIFICITY", flags });
const beat = (n: number, dur: number, concrete: number, scene = "a"): Beat => ({ n, start: 0, dur, words: 10, text: `frase ${n}`, concrete, label: "", flags: [], scene });
const sheet = (beats: Beat[], loop = ["luz"]): BeatSheet => ({ wpm: 162, total_seconds: 0, total_words: 0, beats, notes: [], loop });

describe("reelWarnings", () => {
  it("says nothing about a script the tools like", () => {
    assert.deepEqual(reelWarnings({ hooks: [hook(72)], beats: sheet([beat(1, 2, 1), beat(2, 3, 0)]), errors: [] }), []);
  });

  it("flags a chosen hook under 50 and every dealbreaker", () => {
    const warnings = reelWarnings({ hooks: [hook(30), hook(80, ["Saludo."])], beats: null, errors: [] });
    assert.match(warnings[0], /El gancho elegido saca 30/);
    assert.equal(warnings[1], "Gancho 2: Saludo.");
  });

  it("names each scene once, with its longest sentence", () => {
    const warnings = reelWarnings({ hooks: null, beats: sheet([beat(1, 2, 1), beat(2, 4.5, 1, "b"), beat(3, 6.2, 1, "b"), beat(4, 5, 1, "c")]), errors: [] });
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /escena b \(6\.2 s\), escena c \(5\.0 s\)/);
  });

  it("flags three abstract sentences in a row, a flat first sentence and a missing loop", () => {
    const warnings = reelWarnings({ hooks: null, beats: sheet([beat(1, 2, 0), beat(2, 2, 0), beat(3, 2, 0), beat(4, 2, 1)], []), errors: [] });
    assert.equal(warnings.length, 3);
    assert.match(warnings[0], /primera frase/);
    assert.match(warnings[1], /3 frases seguidas/);
    assert.match(warnings[2], /bucle/);
  });

  it("reports a tool that did not run", () => {
    assert.match(reelWarnings({ hooks: null, beats: null, errors: ["beats_es: sin Python"] })[0], /No se pudo correr ig-reel/);
  });
});

describe("runReelChecks", { skip: findPython() ? false : "no Python 3" }, () => {
  it("runs both wrappers on a video.json, one beat per sentence", () => {
    const dir = mkdtempSync(join(tmpdir(), "reel-"));
    try {
      writeFileSync(
        join(dir, "video.json"),
        JSON.stringify({
          hooks: [{ said: "El ray tracing sigue la luz al revés.", onScreen: "La luz, al revés", formula: 22 }],
          scenes: [
            { id: "uno", say: "El ray tracing sigue la luz al revés. Parte de tu ojo." },
            { id: "dos", say: "Por eso tu RTX lo hace rápido: es la luz, al revés." },
          ],
        }),
      );
      const { hooks, beats, errors } = runReelChecks(dir);
      assert.deepEqual(errors, []);
      assert.equal(hooks?.length, 1);
      assert.equal(hooks?.[0].formula, 22);
      assert.deepEqual(beats?.beats.map((b) => b.scene), ["uno", "uno", "dos"]);
      // Accented words stay whole: "revés", not "rev" and "s".
      assert.ok(beats?.loop.includes("revés"));
      // RTX counts as something concrete.
      assert.ok((beats?.beats[2].concrete ?? 0) > 0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
