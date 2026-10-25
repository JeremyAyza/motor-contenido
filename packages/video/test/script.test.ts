import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { artOf, checkGateB, estimateWords, gateASheet, scriptWarnings, tabOf, targetOff, VideoScriptSchema, WORDS_PER_SECOND } from "../src/script.ts";

const base = {
  hooks: [{ said: "El ray tracing sigue la luz al revés.", onScreen: "La luz, al revés", formula: 22 }],
  scenes: [
    {
      id: "luz",
      say: "El ray tracing sigue la luz al revés. No parte de la lámpara: parte de tu ojo.",
      see: "Una lámpara tira rayos y una flecha sale del ojo",
      resource: "proceso",
    },
  ],
};

const parse = (overrides: object) => VideoScriptSchema.safeParse({ ...base, ...overrides });
const HASH = "a".repeat(64);

describe("VideoScriptSchema", () => {
  it("starts with both gates pending", () => {
    const script = VideoScriptSchema.parse(base);
    assert.deepEqual([script.gateA, script.gateB], [{ approved: false }, { approved: false }]);
  });

  it("asks the first scene to open with the chosen hook", () => {
    const result = parse({ hooks: [{ ...base.hooks[0], said: "Otra frase distinta." }] });
    assert.equal(result.success, false);
    assert.match(result.error!.issues[0].message, /start with the chosen hook/);
  });

  it("ignores accents and punctuation when matching the hook", () => {
    assert.equal(parse({ hooks: [{ ...base.hooks[0], said: "el ray tracing sigue la luz al reves" }] }).success, true);
  });

  it("rejects repeated scene ids and unknown visual resources", () => {
    assert.equal(parse({ scenes: [base.scenes[0], base.scenes[0]] }).success, false);
    assert.equal(parse({ scenes: [{ ...base.scenes[0], resource: "slideshow" }] }).success, false);
  });
});

describe("scriptWarnings", () => {
  it("flags a long hook, too many words on screen and a short video", () => {
    const script = VideoScriptSchema.parse({
      hooks: [{ said: "Esto es un gancho largo que tarda mucho más de tres segundos en decirse.", onScreen: "Uno dos tres cuatro cinco seis siete", formula: 1 }],
      scenes: [{ ...base.scenes[0], say: "Esto es un gancho largo que tarda mucho más de tres segundos en decirse." }],
    });
    const warnings = scriptWarnings(script).join("\n");
    assert.match(warnings, /tiene que entrar en 3 s/);
    assert.match(warnings, /7 palabras en pantalla/);
    assert.match(warnings, /el formato corto va de 30 a 60 s/);
  });

  it("measures the length against the format of the video", () => {
    const script = VideoScriptSchema.parse({ ...base, format: "explicado" });
    assert.match(scriptWarnings(script).join("\n"), /el formato explicado va de 75 a 100 s/);
  });

  it("asks for the world, the meter and the cover", () => {
    const warnings = scriptWarnings(VideoScriptSchema.parse(base)).join("\n");
    assert.match(warnings, /Falta world/);
    assert.match(warnings, /Falta meter/);
    assert.match(warnings, /Falta cover/);
    const full = VideoScriptSchema.parse({ ...base, world: "Un edificio de tres pisos en corte", meter: { label: "Pisos", from: "0", to: "3" }, cover: { scene: "luz" } });
    assert.doesNotMatch(scriptWarnings(full).join("\n"), /Falta/);
  });
});

describe("cover", () => {
  it("has to point at a scene of the script", () => {
    assert.equal(parse({ cover: { scene: "otra" } }).success, false);
  });
});

describe("gateASheet", () => {
  it("shows the chosen hook, the script and the warnings", () => {
    const script = VideoScriptSchema.parse(base);
    const sheet = gateASheet("pieza", script, ["Un aviso"]);
    assert.match(sheet, /\*\*Elegido:\*\* dice "El ray tracing sigue la luz al revés\."/);
    assert.match(sheet, /\| luz \| El ray tracing sigue/);
    assert.match(sheet, /- Un aviso/);
  });

  it("shows the world, what is at stake and the cover", () => {
    const script = VideoScriptSchema.parse({ ...base, world: "Un edificio de tres pisos en corte", meter: { label: "Pisos revisados", from: "0", to: "3" }, cover: { scene: "luz", at: 2 } });
    const sheet = gateASheet("pieza", script, []);
    assert.match(sheet, /\*\*Mundo:\*\* Un edificio de tres pisos en corte/);
    assert.match(sheet, /Pisos revisados, de 0 a 3/);
    assert.match(sheet, /escena luz, a los 2 s/);
  });
});

describe("checkGateB", () => {
  it("keeps the approval for the same video", () => {
    const script = VideoScriptSchema.parse({ ...base, gateB: { approved: true, date: "2026-10-20", video: HASH } });
    assert.equal(checkGateB(script, HASH).reset, false);
  });

  it("sends the gate back to false when the video changed", () => {
    const script = VideoScriptSchema.parse({ ...base, gateB: { approved: true, date: "2026-10-20", video: HASH } });
    const { script: checked, reset } = checkGateB(script, "b".repeat(64));
    assert.equal(reset, true);
    assert.equal(checked.gateB.approved, false);
    assert.match(checked.gateB.notes ?? "", /cambió después de la aprobación del 2026-10-20/);
  });

  it("does nothing while the gate is pending", () => {
    const script = VideoScriptSchema.parse(base);
    assert.equal(checkGateB(script, HASH).reset, false);
  });
});

describe("artOf", () => {
  const art = {
    direction: "terminal",
    reason: "La consola es el escenario de este tema, con comandos reales.",
    palette: { bg: "#0B0F14", ink: "#F0F6FC", accent: "#76B900", accentInk: "#0B0F14" },
    fonts: { display: "geist" },
    anchor: { kind: "logo", ref: "git", source: "Simple Icons (CC0)" },
  };
  const piece = (post?: object) => {
    const dir = mkdtempSync(join(tmpdir(), "video-art-"));
    if (post) writeFileSync(join(dir, "post.json"), JSON.stringify(post));
    return dir;
  };

  it("takes video.json → art first", () => {
    const script = VideoScriptSchema.parse({ ...base, art });
    const { art: found, from } = artOf(piece({ art: { ...art, direction: "chat" } }), script);
    assert.equal(from, "video.json");
    assert.equal(found.direction, "terminal");
  });

  it("falls back to the carousel's post.json → art", () => {
    const { art: found, from } = artOf(piece({ art: { ...art, direction: "chat" } }), VideoScriptSchema.parse(base));
    assert.equal(from, "post.json");
    assert.equal(found.direction, "chat");
  });

  it("asks for a dealt direction when there is neither", () => {
    assert.throws(() => artOf(piece(), VideoScriptSchema.parse(base)), /npm run video:baraja/);
  });

  it("names the tab like the carousel", () => {
    const parsed = VideoScriptSchema.parse({ ...base, art }).art!;
    assert.equal(tabOf(parsed, "2026-10-20-anthropic-scion-git"), "anthropic-scion-git.md");
    assert.equal(tabOf({ ...parsed, tab: "scion.rs" }, "2026-10-20-anthropic-scion-git"), "scion.rs");
  });
});

describe("estimateWords", () => {
  it("times every word of the script at the account's pace, with its punctuation", () => {
    const words = estimateWords("Corre los tests. ¿Falla uno?");
    assert.deepEqual(words.map((w) => w.text), ["Corre", "los", "tests.", "¿Falla", "uno?"]);
    assert.equal(words[1].startMs, Math.round(1000 / WORDS_PER_SECOND));
    assert.ok(words.every((w, i) => w.endMs > w.startMs && (i === 0 || w.startMs > words[i - 1].endMs)));
  });
});

describe("target", () => {
  it("says how far the length is from the reference's, past 10%", () => {
    assert.equal(targetOff(51, 56), "");
    assert.equal(targetOff(45, 56), "20% menos");
    assert.equal(targetOff(70, 56), "25% más");
  });
});
