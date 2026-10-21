import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { prepararPublicacionVideo } from "../src/publicar.ts";

function setup(overrides: { approved?: boolean; hash?: string; caption?: string; videoContent?: string; hasVideo?: boolean } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "video-publicar-"));
  const outDir = join(dir, "out");
  mkdirSync(outDir, { recursive: true });

  const videoContent = overrides.videoContent ?? "sample video content";
  const realHash = createHash("sha256").update(videoContent).digest("hex");

  if (overrides.hasVideo !== false) {
    writeFileSync(join(outDir, "video.mp4"), videoContent);
  }

  const script = {
    hooks: [{ said: "Hola mundo.", onScreen: "Hola", formula: 1 }],
    scenes: [{ id: "uno", say: "Hola mundo.", see: "Una pantalla de bienvenida", resource: "proceso" }],
    caption: overrides.caption ?? "Texto del post #dev",
    gateA: { approved: true, date: "2026-10-20" },
    gateB: {
      approved: overrides.approved ?? true,
      date: "2026-10-20",
      video: overrides.hash ?? realHash,
    },
  };
  writeFileSync(join(dir, "video.json"), JSON.stringify(script, null, 2));

  return { dir, outDir, realHash };
}

describe("prepararPublicacionVideo", () => {
  it("rejects when gate B is not approved", () => {
    const { dir } = setup({ approved: false });
    assert.throws(() => prepararPublicacionVideo(dir), /puerta B no está aprobada/);
  });

  it("rejects when out/video.mp4 does not exist", () => {
    const { dir } = setup({ hasVideo: false });
    assert.throws(() => prepararPublicacionVideo(dir), /no existe out\/video\.mp4/);
  });

  it("rejects when video hash does not match gateB.video", () => {
    const { dir } = setup({ hash: "b".repeat(64) });
    assert.throws(() => prepararPublicacionVideo(dir), /no coincide con el aprobado en la puerta B/);
  });

  it("rejects when caption is missing", () => {
    const { dir } = setup({ caption: "" });
    assert.throws(() => prepararPublicacionVideo(dir), /no tiene 'caption'/);
  });

  it("generates publication.json and returns manifest on valid piece", () => {
    const { dir } = setup();
    const { manifest, file } = prepararPublicacionVideo(dir);
    assert.equal(manifest.kind, "reel");
    assert.equal(manifest.account, "dev");
    assert.equal(manifest.aiLabel, true);
    assert.equal(manifest.caption, "Texto del post #dev");
    assert.equal(manifest.media.length, 1);
    assert.match(manifest.media[0], /video\.mp4$/);
    assert.match(file, /publication\.json$/);
  });
});
