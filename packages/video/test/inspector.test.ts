import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { inspectFrames, inspectLoudness, inspectTimeline, reviewFrames, stillStretches } from "../src/inspector.ts";
import type { ProbedText } from "../src/probe.tsx";
import { VideoScriptSchema } from "../src/script.ts";
import type { Timeline } from "../src/timeline.ts";

const text = (overrides: Partial<ProbedText>): ProbedText => ({ text: "La luz, al revés", x: 40, y: 150, w: 280, h: 60, fontSize: 56, opacity: 1, ...overrides });
const messages = (issues: { message: string }[]) => issues.map((i) => i.message).join("\n");

describe("inspectFrames", () => {
  it("passes a hook that is visible, big and inside the frame's padding", () => {
    assert.deepEqual(inspectFrames([{ frame: 0, texts: [text({})] }], 30, "La luz, al revés"), []);
  });

  it("flags text under the captions or on the edge, and text too small for a phone", () => {
    const issues = inspectFrames(
      [{ frame: 0, texts: [text({}), text({ text: "abajo", y: 790 }), text({ text: "al borde", x: 20, y: 400 }), text({ text: "chico", y: 300, fontSize: 16 })] }],
      30,
      "La luz, al revés",
    );
    assert.match(messages(issues), /fuera del margen del marco en 0\.0 s: "abajo"/);
    assert.match(messages(issues), /fuera del margen del marco en 0\.0 s: "al borde"/);
    assert.match(messages(issues), /Letra de 16px en 0\.0 s: "chico"/);
  });

  it("asks for the hook in frame 1, fully visible", () => {
    const fading = inspectFrames([{ frame: 0, texts: [text({ opacity: 0.2 })] }], 30, "La luz, al revés");
    assert.match(messages(fading), /no se ve completo en el cuadro 1/);
  });

  it("warns when too many words are on screen at once", () => {
    const crowded = text({ text: "uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece", y: 300, h: 30, fontSize: 22 });
    const issues = inspectFrames([{ frame: 0, texts: [text({})] }, { frame: 15, texts: [crowded] }], 30, "La luz, al revés");
    assert.match(messages(issues), /13 palabras en pantalla a la vez en 0\.5 s/);
  });

  it("reports each problem once, not once per frame", () => {
    const low = text({ text: "abajo", y: 790 });
    const issues = inspectFrames([0, 15, 30].map((frame) => ({ frame, texts: [text({}), low] })), 30, "La luz, al revés");
    assert.equal(issues.length, 1);
  });
});

describe("inspectTimeline", () => {
  const script = VideoScriptSchema.parse({
    hooks: [{ said: "Hola mundo.", onScreen: "Hola", formula: 1 }],
    scenes: [{ id: "a", say: "Hola mundo. Chau.", see: "Algo que se ve en la escena", resource: "proceso" }],
  });
  const timeline = (words: Array<[string, number, number]>, durationMs: number) =>
    ({ fps: 30, scenes: [{ id: "a", durationMs, words: words.map(([text, startMs, endMs]) => ({ text, startMs, endMs })) }] }) as unknown as Timeline;

  it("asks for a caption for every word of the script", () => {
    const issues = inspectTimeline(timeline([["Hola", 0, 100], ["mundo.", 100, 200]], 40_000), script);
    assert.match(messages(issues), /los subtítulos tienen 2 palabras y el guion 3/);
  });

  it("warns outside 30 to 60 s", () => {
    const words: Array<[string, number, number]> = [["Hola", 0, 100], ["mundo.", 100, 200], ["Chau.", 200, 300]];
    assert.equal(inspectTimeline(timeline(words, 40_000), script).length, 0);
    assert.match(messages(inspectTimeline(timeline(words, 9_000), script)), /Dura 9\.0 s/);
  });
});

describe("stillStretches", () => {
  const frame = (changedPixels: number) => {
    const pixels = new Uint8Array(10_000);
    pixels.fill(200, 0, changedPixels);
    return pixels;
  };

  it("finds a stretch longer than 4 s without changes", () => {
    const samples = Array.from({ length: 12 }, () => frame(0));
    assert.deepEqual(stillStretches(samples), [{ start: 0, seconds: 5.5 }]);
  });

  it("counts a small stroke as a change, not compression noise", () => {
    const still = Array.from({ length: 12 }, () => frame(0));
    const withStroke = [...still.slice(0, 6), frame(20), ...still.slice(7)];
    assert.deepEqual(stillStretches(withStroke), []);
    const noisy = still.map((f, i) => (i % 2 ? f.map((v) => v + 10) : f));
    assert.equal(stillStretches(noisy).length, 1);
  });
});

describe("inspectLoudness", () => {
  it("accepts -14 LUFS give or take one", () => {
    assert.deepEqual(inspectLoudness(-14.6), []);
    assert.match(inspectLoudness(-18)[0].message, /-18\.0 LUFS/);
  });
});

describe("reviewFrames", () => {
  it("takes the cover and the end of each scene", () => {
    const timeline = { fps: 30, scenes: [{ durationMs: 5000 }, { durationMs: 4000 }] } as unknown as Timeline;
    assert.deepEqual(reviewFrames(timeline), [0, 141, 261]);
  });
});
