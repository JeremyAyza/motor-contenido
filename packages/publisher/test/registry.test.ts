import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { EntrySchema, Registry, timestamp, type Entry } from "../src/registry.ts";

const freshRegistry = () => new Registry(join(mkdtempSync(join(tmpdir(), "publisher-")), "publications.jsonl"));

function entry(overrides: Partial<Entry> = {}): Entry {
  return { id: "pieza", platform: "instagram", account: "dev", status: "published", at: "2026-10-18T19:00:00-05:00", source: "cli", ...overrides };
}

describe("Registry", () => {
  it("is empty when the file doesn't exist", () => {
    assert.deepEqual(freshRegistry().entries(), []);
  });

  it("takes the last line of each id, platform and account", () => {
    const registry = freshRegistry();
    registry.append(entry({ status: "sending" }));
    registry.append(entry({ account: "negocios", status: "failed" }));
    registry.append(entry({ status: "published", url: "https://www.instagram.com/p/abc/" }));
    assert.equal(registry.latest({ id: "pieza", platform: "instagram", account: "dev" })?.status, "published");
    assert.equal(registry.latest({ id: "pieza", platform: "instagram", account: "negocios" })?.status, "failed");
    assert.equal(registry.latest({ id: "pieza", platform: "tiktok", account: "dev" }), undefined);
  });

  it("lists each publication once, ordered by its last change", () => {
    const registry = freshRegistry();
    registry.append(entry({ id: "a", status: "failed" }));
    registry.append(entry({ id: "b" }));
    registry.append(entry({ id: "a" }));
    assert.deepEqual(
      registry.current().map((e) => [e.id, e.status]),
      [
        ["b", "published"],
        ["a", "published"],
      ],
    );
  });

  it("finds the account's last confirmed post only", () => {
    const registry = freshRegistry();
    registry.append(entry({ id: "a", at: "2026-10-18T10:00:00-05:00" }));
    registry.append(entry({ id: "b", status: "manual", at: "2026-10-18T11:00:00-05:00" }));
    registry.append(entry({ id: "c", account: "negocios", at: "2026-10-18T12:00:00-05:00" }));
    assert.equal(registry.lastPublished("instagram", "dev")?.id, "a");
  });

  it("names the line of a broken entry", () => {
    const registry = freshRegistry();
    writeFileSync(registry.file, `${JSON.stringify(entry())}\nnot json\n`);
    assert.throws(() => registry.entries(), /:2 is not valid JSON/);
  });

  it("starts a new line when the file doesn't end with one", () => {
    const registry = freshRegistry();
    writeFileSync(registry.file, JSON.stringify(entry({ id: "a" })));
    registry.append(entry({ id: "b" }));
    assert.equal(readFileSync(registry.file, "utf8").split("\n").filter(Boolean).length, 2);
    assert.deepEqual(registry.entries().map((e) => e.id), ["a", "b"]);
  });

  it("rejects an invalid entry", () => {
    assert.throws(() => freshRegistry().append(entry({ url: "not a url" })), /Invalid registry entry/);
  });
});

describe("timestamp", () => {
  it("writes local time with its offset", () => {
    const date = new Date("2026-10-18T19:02:11.500Z");
    const stamp = timestamp(date);
    assert.match(stamp, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
    assert.equal(Date.parse(stamp), Date.parse("2026-10-18T19:02:11Z"));
    assert.ok(EntrySchema.shape.at.safeParse(stamp).success);
  });
});
