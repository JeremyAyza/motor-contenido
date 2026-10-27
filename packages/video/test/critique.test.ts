import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, describe, it } from "node:test";
import { reviewRequest, scriptSheet, stripCoverage, transcript } from "../src/critique.ts";
import type { VideoScript } from "../src/script.ts";
import type { Timeline } from "../src/timeline.ts";

describe("stripCoverage", () => {
  it("puts six frames, two seconds apart, on each strip", () => {
    assert.deepEqual(stripCoverage(25_000), [
      { file: "tira-01.png", from: 0, to: 10 },
      { file: "tira-02.png", from: 12, to: 22 },
      { file: "tira-03.png", from: 24, to: 24 },
    ]);
  });
});

describe("transcript", () => {
  const script = { scenes: [{ id: "a", say: "Primera escena." }, { id: "b", say: "Segunda escena." }] } as VideoScript;
  const timeline = {
    scenes: [
      { id: "a", durationMs: 61_000, words: [{ text: "Primera", startMs: 0, endMs: 300 }], sfx: [] },
      { id: "b", durationMs: 4_000, words: [{ text: "Segunda", startMs: 500, endMs: 900 }], sfx: [{ src: "sfx/whoosh.mp3", atMs: 1_000, volume: 1 }] },
    ],
    music: { src: "music/cama.mp3", volume: 0.12 },
  } as unknown as Timeline;

  it("gives what the voice says with the second each part starts", () => {
    const text = transcript(script, timeline);
    assert.match(text, /\*\*0:00\*\* Primera escena\./);
    assert.match(text, /\*\*1:01\*\* Segunda escena\./);
    assert.match(text, /Termina en 1:05\./);
  });

  it("says what else is heard, without the scene ids", () => {
    const text = transcript(script, timeline);
    assert.match(text, /música de fondo/);
    assert.match(text, /- 1:02: un efecto de sonido \(whoosh\)/);
    assert.doesNotMatch(text, /\bb\b/);
  });
});

describe("scriptSheet", () => {
  const script = {
    hooks: [{ said: "Tu USB no está roto.", onScreen: "Tu USB no está roto", formula: 1 }],
    scenes: [
      { id: "gancho", say: "Tu USB no está roto.", see: "Una laptop y un monitor, el USB en el medio", resource: "objeto" },
      { id: "cierre", say: "Hablaba APFS.", see: "El USB con su etiqueta APFS", resource: "objeto" },
    ],
  } as unknown as VideoScript;

  it("gives what is heard and seen with the estimated second each scene starts, without ids", () => {
    const text = scriptSheet(script);
    assert.match(text, /En pantalla desde el cuadro 1: "Tu USB no está roto"/);
    assert.match(text, /\*\*0:00\*\* Se oye: Tu USB no está roto\.\nSe ve: Una laptop/);
    // "USB" is spelled out, so the first line takes about 2 s.
    assert.match(text, /\*\*0:02\*\* Se oye: Hablaba APFS\./);
    assert.match(text, /Termina cerca de 0:0\d\./);
    assert.doesNotMatch(text, /gancho|cierre|objeto/);
  });
});

describe("reviewRequest", () => {
  const folder = mkdtempSync(join(tmpdir(), "critica-"));
  after(() => rmSync(folder, { recursive: true, force: true }));
  for (const name of ["LEEME.md", "paso-2-brief.md", "transcripcion.md", "hoja.png", "tira-01.png", "video.mp4", "informe.md", "notas.json"]) {
    writeFileSync(join(folder, name), name === "LEEME.md" ? "La rúbrica." : "x");
  }

  it("sends the video first, then images and texts, the brief last, and leaves out the strips and the report", () => {
    const { prompt, files } = reviewRequest(folder);
    assert.deepEqual(
      files!.map((f) => [f.path.slice(folder.length + 1), f.mimeType]),
      [
        ["video.mp4", "video/mp4"],
        ["hoja.png", "image/png"],
        ["transcripcion.md", "text/markdown"],
        ["paso-2-brief.md", "text/markdown"],
      ],
    );
    assert.match(prompt, /1\. video\.mp4\n2\. hoja\.png\n3\. transcripcion\.md\n4\. paso-2-brief\.md/);
    assert.match(prompt, /La rúbrica\.$/);
  });
});
