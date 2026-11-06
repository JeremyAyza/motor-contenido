import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cameraMoving, changedShare, inspectFrames, inspectLoudness, inspectTimeline, invisibleCuts, parseLoudness, reviewFrames, sheetFrames, stillStretches } from "../src/inspector.ts";
import { camerasOver, type ProbedText } from "../src/probe.tsx";
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

  it("leaves the text of an interface out of the words, down to 12 px", () => {
    const screen = text({ text: "uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece", y: 300, h: 30, fontSize: 14, ui: true });
    assert.deepEqual(inspectFrames([{ frame: 0, texts: [text({}), screen] }], 30, "La luz, al revés"), []);
    const tiny = text({ text: "9:41", y: 300, fontSize: 9, ui: true });
    assert.match(messages(inspectFrames([{ frame: 0, texts: [text({}), tiny] }], 30, "La luz, al revés")), /el texto de una interfaz baja de 12px/);
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

  it("finds a stretch longer than 2 s without changes", () => {
    const samples = Array.from({ length: 6 }, () => frame(0));
    assert.deepEqual(stillStretches(samples), [{ start: 0, seconds: 2.5 }]);
  });

  it("counts a small stroke as a change, not compression noise", () => {
    const still = Array.from({ length: 8 }, () => frame(0));
    const withStroke = [...still.slice(0, 4), frame(20), ...still.slice(5)];
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
  const timeline = { fps: 30, scenes: [{ durationMs: 5000 }, { durationMs: 4000 }] } as unknown as Timeline;

  it("takes the cover and the end of each scene", () => {
    assert.deepEqual(reviewFrames(timeline), [0, 141, 261]);
  });

  it("adds the middle of each change of scene to the sheet", () => {
    assert.deepEqual(sheetFrames(timeline), [0, 141, 159, 261]);
  });
});

describe("the text of a stage's world", () => {
  const timeline = { fps: 30, scenes: [{ durationMs: 3000 }, { durationMs: 3000 }] } as unknown as Timeline;
  const moving = cameraMoving(timeline);
  const label = (overrides: Partial<ProbedText>) => text({ text: "Servidor", stage: true, fontSize: 22, ...overrides });

  it("is not checked while the camera moves to the next shot", () => {
    assert.equal(moving(95), true);
    assert.equal(moving(60), false);
    const issues = inspectFrames([{ frame: 0, texts: [text({})] }, { frame: 95, texts: [label({ x: 500 })] }], 30, "La luz, al revés", moving);
    assert.deepEqual(issues, []);
  });

  it("warns, without blocking, about a label outside the margin or too small with the camera still", () => {
    const issues = inspectFrames([{ frame: 0, texts: [text({}), label({ x: 520 }), label({ text: "Disco", fontSize: 9 })] }], 30, "La luz, al revés", moving);
    assert.ok(issues.every((i) => i.level === "aviso"));
    assert.match(messages(issues), /Texto del escenario fuera del margen con la cámara quieta en 0\.0 s: "Servidor"/);
    assert.match(messages(issues), /Texto del escenario de 9\.0px/);
  });

  it("does not count short labels as words to read", () => {
    const labels = ["Tu app", "Runtime", "Servidor", "Base de datos"].map((t, i) => label({ text: t, y: 200 + i * 100 }));
    assert.deepEqual(inspectFrames([{ frame: 0, texts: [text({}), ...labels] }], 30, "La luz, al revés"), []);
  });
});

describe("the marks a piece leaves for the inspector", () => {
  /** A chain of elements from the outside in, like the page: each entry is its data-* attributes. */
  const chain = (...levels: Array<Record<string, string>>) => levels.reduce<Parameters<typeof camerasOver>[0] | null>((parentElement, dataset) => ({ dataset, parentElement }), null)!;

  it("reads the stage's camera as it always did", () => {
    assert.deepEqual(camerasOver(chain({ camera: "", zoom: "0.800" }, {})), { stage: true, zoom: 0.8, moving: false });
  });

  it("leaves text outside the world alone", () => {
    assert.deepEqual(camerasOver(chain({}, {})), { stage: false, zoom: 1, moving: false });
  });

  it("adds the zoom of a piece's own camera, and says when it moves", () => {
    assert.deepEqual(camerasOver(chain({ camera: "", zoom: "0.5" }, { zoom: "1.2" }, {})), { stage: true, zoom: 0.6, moving: false });
    assert.deepEqual(camerasOver(chain({ camera: "", zoom: "0.5" }, { zoom: "1.2", cameraMoving: "" }, {})), { stage: true, zoom: 0.6, moving: true });
  });

  it("stops at a layer locked to the screen: its text is not in the world", () => {
    assert.deepEqual(camerasOver(chain({ camera: "", zoom: "0.45" }, { screen: "" }, {})), { stage: false, zoom: 1, moving: false });
    assert.deepEqual(camerasOver(chain({ camera: "", zoom: "0.45" }, { zoom: "1.2", cameraMoving: "" }, { screen: "" }, {})), { stage: false, zoom: 1, moving: false });
  });

  it("does not check the margin of text under a piece's camera while it moves, even with the stage's still", () => {
    const moving = cameraMoving({ fps: 30, scenes: [{ durationMs: 3000 }, { durationMs: 3000 }] } as unknown as Timeline);
    assert.equal(moving(60), false);
    const label = text({ text: "Servidor", x: 520, stage: true, moving: true, fontSize: 8 });
    assert.deepEqual(inspectFrames([{ frame: 0, texts: [text({})] }, { frame: 60, texts: [label] }], 30, "La luz, al revés", moving), []);
    const still = text({ text: "Servidor", x: 520, stage: true, fontSize: 8 });
    const issues = messages(inspectFrames([{ frame: 0, texts: [text({})] }, { frame: 60, texts: [still] }], 30, "La luz, al revés", moving));
    assert.match(issues, /fuera del margen con la cámara quieta/);
    assert.match(issues, /Texto del escenario de 8\.0px/);
  });

  it("checks a layer locked to the screen like a scene's text, also while the stage's camera moves", () => {
    const moving = () => true;
    const big = text({ text: "Ficha", y: 300, fontSize: 28, ui: true });
    assert.deepEqual(inspectFrames([{ frame: 0, texts: [text({}), big] }], 30, "La luz, al revés", moving), []);
    const out = text({ text: "Ficha", x: 520, y: 300, fontSize: 28 });
    assert.match(messages(inspectFrames([{ frame: 0, texts: [text({}), out] }], 30, "La luz, al revés", moving)), /Texto fuera del margen del marco en 0\.0 s: "Ficha"/);
  });
});

describe("the first frame", () => {
  it("warns when scene 1 opens with a SceneFrame title", () => {
    const issues = inspectFrames([{ frame: 0, texts: [text({ title: true })] }], 30, "La luz, al revés");
    assert.match(messages(issues), /La escena 1 abre con el título de SceneFrame/);
  });
});

describe("parseLoudness", () => {
  it("reads the integrated loudness and the true peak of the summary", () => {
    const log = "[Parsed_ebur128_0] Summary:\n\n  Integrated loudness:\n    I:         -14.1 LUFS\n    Threshold: -24.3 LUFS\n\n  True peak:\n    Peak:       -0.8 dBFS\n";
    assert.deepEqual(parseLoudness(log), { lufs: -14.1, truePeak: -0.8 });
    assert.deepEqual(parseLoudness("Summary:\n    I:         -14.0 LUFS\n"), { lufs: -14 });
  });

  it("warns when the true peak goes over -1 dBTP", () => {
    assert.deepEqual(inspectLoudness(-14, -1.4), []);
    assert.match(inspectLoudness(-14, -0.8)[0].message, /-0\.8 dBTP/);
  });
});

describe("invisibleCuts", () => {
  const frame = (changed: number) => {
    const pixels = new Uint8Array(1000);
    pixels.fill(200, 0, changed);
    return pixels;
  };
  it("flags a scene start where under 2% of the picture changes in its first second", () => {
    // 90 frames at 30 fps: a cut at 30 that changes a third of the picture, one at 60 that changes 1%.
    const frames = [...Array(30).fill(frame(0)), ...Array(30).fill(frame(330)), ...Array(30).fill(frame(340))];
    assert.deepEqual(invisibleCuts(frames, [30, 60], 30), [60]);
    assert.ok(Math.abs(changedShare(frame(0), frame(330)) - 0.33) < 1e-9);
  });
});
