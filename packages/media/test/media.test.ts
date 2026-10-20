import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { speechProvider } from "../src/index.ts";
import { wavDurationMs } from "../src/wav.ts";

/** A silent PCM WAV: 16-bit mono at `rate` Hz, `ms` long. */
function silentWav(rate: number, ms: number): Uint8Array {
  const samples = Math.round((rate * ms) / 1000);
  const wav = new Uint8Array(44 + samples * 2);
  const view = new DataView(wav.buffer);
  const write = (at: number, s: string) => [...s].forEach((c, i) => (wav[at + i] = c.charCodeAt(0)));
  write(0, "RIFF");
  view.setUint32(4, 36 + samples * 2, true);
  write(8, "WAVE");
  write(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, "data");
  view.setUint32(40, samples * 2, true);
  return wav;
}

describe("wavDurationMs", () => {
  it("reads the duration from the header", () => {
    assert.equal(wavDurationMs(silentWav(24000, 1500)), 1500);
  });

  it("rejects what is not a WAV", () => {
    assert.throws(() => wavDurationMs(new Uint8Array(64)), /Not a WAV/);
  });
});

describe("speechProvider", () => {
  it("names the adapters it has when the id is unknown", () => {
    assert.throws(() => speechProvider("nope"), /No speech adapter for "nope". Available: gemini/);
  });

  it("asks for the key in .env instead of failing later", () => {
    const saved = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    try {
      assert.throws(() => speechProvider("gemini"), /Missing GEMINI_API_KEY/);
    } finally {
      if (saved !== undefined) process.env.GEMINI_API_KEY = saved;
    }
  });
});
