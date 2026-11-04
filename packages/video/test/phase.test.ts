import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { nextChat, phaseOf, type PieceState } from "../src/phase.ts";

const base: PieceState = { hasScript: true, gateA: false, direct: false, hasVoice: false, hasVideo: false, gateB: false, hasEstado: true };

describe("the phase of a Reel", () => {
  it("goes creative, production, critic and ready by its gates and files", () => {
    assert.equal(phaseOf({ ...base, hasScript: false }), "creativa");
    assert.equal(phaseOf(base), "creativa");
    assert.equal(phaseOf({ ...base, gateA: true }), "produccion");
    assert.equal(phaseOf({ ...base, gateA: true, hasVoice: true, hasVideo: true }), "critica");
    assert.equal(phaseOf({ ...base, gateA: true, hasVideo: true, gateB: true }), "lista");
  });

  it("opens the creative chat at extra high and production at high, reading only the core and estado.md", () => {
    const creative = nextChat("content/2026-11-04-x", base);
    assert.equal(creative.effort, "extra alto");
    assert.match(creative.message, /Lee AGENTS\.md, docs\/reel\.md, content\/2026-11-04-x\/estado\.md/);
    const production = nextChat("content/2026-11-04-x", { ...base, gateA: true, direct: true });
    assert.equal(production.effort, "alto");
    assert.match(production.message, /no pidas aprobaciones/);
  });
});
