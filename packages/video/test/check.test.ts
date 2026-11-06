import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cueCalls, cueMarginWarnings } from "../src/check.ts";
import type { Timeline } from "../src/timeline.ts";

const timeline = {
  scenes: [
    {
      id: "gancho",
      durationMs: 3000,
      words: [
        { text: "Hola", startMs: 100, endMs: 400 },
        { text: "mundo", startMs: 2500, endMs: 2900 },
      ],
      sfx: [{ src: "sfx/pop.wav", atMs: 2600, volume: 0.5 }],
    },
    { id: "cierre", durationMs: 4000, words: [{ text: "chau", startMs: 500, endMs: 800 }], sfx: [] },
  ],
} as unknown as Timeline;

describe("cueCalls", () => {
  it("ties useCue to the scene of its file and useStageCue to the scene it names", () => {
    const calls = cueCalls([
      { file: "content/p/scenes/gancho.tsx", source: `const a = useCue("Hola"); const b = useCue('mundo', 2);` },
      { file: "content/p/world.tsx", source: `const c = useStageCue("cierre", "chau"); const d = useCue("suelto");` },
    ]);
    assert.deepEqual(
      calls.map(({ scene, word, nth }) => [scene, word, nth]),
      [
        ["gancho", "Hola", 1],
        ["gancho", "mundo", 2],
        ["cierre", "chau", 1],
      ],
    );
  });
});

describe("cueMarginWarnings", () => {
  it("warns about a cue and an effect too close to the cut", () => {
    const warnings = cueMarginWarnings(timeline, [
      { scene: "gancho", word: "hola", nth: 1, file: "a.tsx" },
      { scene: "gancho", word: "mundo", nth: 1, file: "a.tsx" },
      { scene: "cierre", word: "chau", nth: 1, file: "a.tsx" },
    ]);
    assert.equal(warnings.length, 2);
    assert.match(warnings[0], /"mundo" \(escena "gancho"\) se dice a 0\.50 s del corte/);
    assert.match(warnings[1], /efecto de la escena "gancho" suena a 0\.40 s del corte/);
  });

  it("ignores cues it cannot place: another time of the word, an unknown scene", () => {
    assert.deepEqual(
      cueMarginWarnings({ scenes: [{ ...timeline.scenes[0], sfx: [] }] }, [
        { scene: "gancho", word: "mundo", nth: 2, file: "a.tsx" },
        { scene: "otra", word: "mundo", nth: 1, file: "a.tsx" },
      ]),
      [],
    );
  });
});
