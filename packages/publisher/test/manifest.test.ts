import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fingerprintOf, handleFor, loadManifest, loadProject, problemsWith, type Manifest } from "../src/manifest.ts";
import type { Limits } from "../src/platforms/platform.ts";

const limits: Limits = { maxMedia: 3, formats: ["png", "jpg"], maxBytes: 10, maxCaption: 30, maxHashtags: 2 };
const tempDir = () => mkdtempSync(join(tmpdir(), "publisher-"));

function manifestWith(media: string[], caption = "Hola"): Manifest {
  return { id: "pieza", account: "dev", caption, media };
}

describe("loadManifest", () => {
  it("resolves media against the manifest's folder", () => {
    const dir = tempDir();
    const file = join(dir, "publication.json");
    writeFileSync(file, JSON.stringify({ id: "pieza", account: "dev", caption: "Hola", media: ["out/01.png"] }));
    assert.deepEqual(loadManifest(file).media, [join(dir, "out", "01.png")]);
  });

  it("rejects a manifest without media", () => {
    const file = join(tempDir(), "publication.json");
    writeFileSync(file, JSON.stringify({ id: "pieza", account: "dev", caption: "Hola", media: [] }));
    assert.throws(() => loadManifest(file), /media/);
  });
});

describe("problemsWith", () => {
  it("accepts a publication within the limits", () => {
    const dir = tempDir();
    writeFileSync(join(dir, "01.png"), "12345");
    assert.deepEqual(problemsWith(manifestWith([join(dir, "01.png")], "Hola #ia"), limits), []);
  });

  it("reports every reason the platform would reject it", () => {
    const dir = tempDir();
    writeFileSync(join(dir, "01.png"), "12345");
    writeFileSync(join(dir, "02.gif"), "1");
    writeFileSync(join(dir, "03.jpg"), "x".repeat(11));
    const media = ["01.png", "02.gif", "03.jpg", "04.png"].map((name) => join(dir, name));
    const problems = problemsWith(manifestWith(media, "#uno #dos #tres y un texto que se pasa"), limits);
    assert.equal(problems.length, 6);
    assert.match(problems[0], /4 images; the limit is 3/);
    assert.match(problems.join("\n"), /Unsupported format \.gif/);
    assert.match(problems.join("\n"), /Too large .*03\.jpg/);
    assert.match(problems.join("\n"), /Missing file: .*04\.png/);
    assert.match(problems.join("\n"), /the limit is 30/);
    assert.match(problems.join("\n"), /3 hashtags; the limit is 2/);
  });
});

describe("problemsWith videos", () => {
  it("measures videos against maxVideoBytes", () => {
    const dir = tempDir();
    writeFileSync(join(dir, "01.mp4"), "x".repeat(20));
    const conVideo: Limits = { ...limits, formats: ["png", "mp4"], maxVideoBytes: 100 };
    assert.deepEqual(problemsWith(manifestWith([join(dir, "01.mp4")]), conVideo), []);
    assert.match(problemsWith(manifestWith([join(dir, "01.mp4")]), { ...conVideo, maxVideoBytes: 10 }).join("\n"), /Too large/);
  });
});

describe("loadProject and handleFor", () => {
  it("finds the config upward and normalizes handles", () => {
    const root = tempDir();
    writeFileSync(join(root, "publisher.config.json"), JSON.stringify({ accounts: { dev: { instagram: "@JeremyAyza.dev" } } }));
    const nested = join(root, "content", "pieza");
    mkdirSync(nested, { recursive: true });
    const project = loadProject(nested);
    assert.equal(project.root, root);
    assert.equal(project.registryFile, join(root, "publications.jsonl"));
    assert.equal(handleFor(project.config, "dev", "instagram"), "jeremyayza.dev");
    assert.throws(() => handleFor(project.config, "dev", "tiktok"), /no tiktok handle/);
    assert.throws(() => handleFor(project.config, "otra", "instagram"), /Unknown account "otra"/);
  });
});

describe("fingerprintOf", () => {
  it("changes when an image or the caption changes", () => {
    const dir = tempDir();
    const image = join(dir, "01.png");
    writeFileSync(image, "uno");
    const before = fingerprintOf(manifestWith([image]));
    assert.equal(fingerprintOf(manifestWith([image])), before);
    assert.notEqual(fingerprintOf(manifestWith([image], "Chau")), before);
    writeFileSync(image, "dos");
    assert.notEqual(fingerprintOf(manifestWith([image])), before);
  });
});
