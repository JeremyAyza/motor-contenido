import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, describe, it } from "node:test";
import { createHash } from "node:crypto";
import { AssetSchema, assertUsable, CatalogSchema, fetchAsset, fetchLogos } from "../src/catalog.ts";

const asset = AssetSchema.parse({
  id: "click",
  type: "sfx",
  url: "https://example.com/click.wav",
  source: "https://example.com/click",
  author: "Someone",
  license: "CC0-1.0",
});

const cache = mkdtempSync(join(tmpdir(), "catalog-test-"));
after(() => rmSync(cache, { recursive: true, force: true }));

describe("assertUsable", () => {
  it("asks for the checked license and the hash", () => {
    assert.throws(() => assertUsable(asset), /needs checkedAt .* and sha256/);
  });

  it("accepts an asset with both", () => {
    assert.doesNotThrow(() => assertUsable({ ...asset, checkedAt: "2026-10-20", sha256: "0".repeat(64) }));
  });
});

describe("fetchAsset", () => {
  it("rejects a cached file that is not the one that was checked", async () => {
    writeFileSync(join(cache, "click.wav"), "not the original");
    await assert.rejects(fetchAsset({ ...asset, sha256: "0".repeat(64) }, cache), /click changed: expected sha256/);
  });
});

describe("the repo catalog", () => {
  it("is valid and every asset can be used", async () => {
    const { readFileSync } = await import("node:fs");
    const catalog = CatalogSchema.parse(JSON.parse(readFileSync(join(import.meta.dirname, "../../../assets/catalog.json"), "utf8")));
    for (const a of catalog.assets) assert.doesNotThrow(() => assertUsable(a), a.id);
  });
});

describe("fetchLogos", () => {
  it("gives each catalog logo its name and its cached file, checked by its hash", async () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>';
    const hash = createHash("sha256").update(svg).digest("hex");
    const logo = AssetSchema.parse({
      id: "acme",
      type: "logo",
      title: "Acme",
      url: "https://example.com/brand/acme.svg",
      source: "https://example.com/brand",
      author: "Acme Inc.",
      license: "Trademark",
      checkedAt: "2026-10-27",
      sha256: hash,
    });
    writeFileSync(join(cache, "acme.svg"), svg);
    const logos = await fetchLogos(CatalogSchema.parse({ assets: [asset, logo] }), cache);
    assert.deepEqual(Object.keys(logos), ["acme"]);
    assert.equal(logos.acme.title, "Acme");
    assert.equal(logos.acme.file, join(cache, "acme.svg"));
  });

  it("refuses a logo whose license was not checked", async () => {
    const logo = AssetSchema.parse({ id: "nope", type: "logo", url: "https://example.com/nope.svg", source: "https://example.com", author: "X", license: "Trademark" });
    await assert.rejects(fetchLogos(CatalogSchema.parse({ assets: [logo] }), cache), /cannot be used yet/);
  });
});
