import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, describe, it } from "node:test";
import { AssetSchema, assertUsable, CatalogSchema, fetchAsset } from "../src/catalog.ts";

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
