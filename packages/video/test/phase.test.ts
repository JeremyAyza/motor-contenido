import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { nextChat, phaseOf, type PieceState } from "../src/phase.ts";

const base: PieceState = { hasScript: true, gateA: false, hasVoice: false, hasVideo: false, gateB: false, hasEstado: true };

describe("the phase of a Reel", () => {
  it("goes creative, production, critic and ready by its gates and files", () => {
    assert.equal(phaseOf({ ...base, hasScript: false }), "creativa");
    assert.equal(phaseOf(base), "creativa");
    assert.equal(phaseOf({ ...base, gateA: true }), "produccion");
    assert.equal(phaseOf({ ...base, gateA: true, hasVoice: true, hasVideo: true }), "critica");
    assert.equal(phaseOf({ ...base, gateA: true, hasVideo: true, gateB: true }), "lista");
  });

  it("resumes any phase at high effort, reading only the core and estado.md", () => {
    const creative = nextChat("content/2026-11-04-x", base);
    assert.equal(creative.effort, "alto");
    assert.match(creative.message, /Lee AGENTS\.md, docs\/reel\.md, content\/2026-11-04-x\/estado\.md/);
    assert.match(creative.message, /ronda de preguntas/);
    const critic = nextChat("content/2026-11-04-x", { ...base, gateA: true, hasVoice: true, hasVideo: true });
    assert.equal(critic.effort, "alto");
    assert.match(critic.message, /pregúntame si lo publicas/);
  });
});
