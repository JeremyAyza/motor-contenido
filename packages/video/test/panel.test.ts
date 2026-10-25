import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { panelAt, resolvePanel, type PanelDef } from "../src/kit/panel.ts";

const scenes = [
  { id: "precios", durationMs: 4000, words: [{ text: "entrada", startMs: 500, endMs: 900 }, { text: "salida", startMs: 2000, endMs: 2400 }] },
];
const def: PanelDef = {
  rows: ["Entrada", "Salida"],
  active: [
    { scene: "precios", word: "entrada", value: 0 },
    { scene: "precios", word: "salida", value: 1 },
  ],
  counters: [{ label: "Tokens", start: 0, steps: [{ scene: "precios", word: "entrada", value: 1000, ramp: 1 }] }],
};

describe("panelAt", () => {
  const resolved = resolvePanel(def, scenes);
  it("has no active row before the first step, then jumps from row to row", () => {
    assert.equal(panelAt(def, resolved, 0).active, -1);
    assert.equal(panelAt(def, resolved, 600).active, 0);
    assert.equal(panelAt(def, resolved, 2100).active, 1);
  });
  it("counts the counters live", () => {
    assert.equal(panelAt(def, resolved, 0).values[0], 0);
    assert.equal(panelAt(def, resolved, 1500).values[0], 1000);
  });
});
