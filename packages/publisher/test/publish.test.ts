import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import type { Manifest } from "../src/manifest.ts";
import type { Platform, Publisher } from "../src/platforms/platform.ts";
import { decide, postPublication, type PostRequest } from "../src/publish.ts";
import { Registry, type Entry } from "../src/registry.ts";

type Behavior = { loggedIn?: boolean; handle?: string; fail?: "before-share" | "after-share" };

/** A platform that records what happened instead of driving a browser. */
function fakePlatform(behavior: Behavior = {}) {
  const calls: string[] = [];
  const publisher: Publisher = {
    async isLoggedIn() {
      return behavior.loggedIn ?? true;
    },
    async waitForLogin() {},
    async currentHandle() {
      return behavior.handle ?? "jeremyayza.dev";
    },
    async post(_input, { dryRun, beforeShare }) {
      calls.push("post");
      if (behavior.fail === "before-share") throw new Error("Next button not found\n  call log...");
      if (dryRun) return {};
      beforeShare();
      if (behavior.fail === "after-share") throw new Error("No confirmation");
      return { url: "https://www.instagram.com/p/abc/" };
    },
    async capture(basePath) {
      calls.push("capture");
      return [`${basePath}.png`];
    },
    async close() {
      calls.push("close");
    },
  };
  const platform: Platform = {
    id: "instagram",
    limits: { maxMedia: 20, formats: ["png"], maxBytes: 1024, maxCaption: 2200, maxHashtags: 30 },
    async open() {
      calls.push("open");
      return publisher;
    },
  };
  return { platform, calls };
}

function setup(behavior: Behavior = {}, overrides: Partial<PostRequest> = {}) {
  const dir = mkdtempSync(join(tmpdir(), "publisher-"));
  writeFileSync(join(dir, "01.png"), "png");
  const manifest: Manifest = { id: "pieza", account: "dev", caption: "Hola", media: [join(dir, "01.png")] };
  const registry = new Registry(join(dir, "publications.jsonl"));
  const { platform, calls } = fakePlatform(behavior);
  const waits: number[][] = [];
  const request: PostRequest = {
    platform,
    manifest,
    handle: "jeremyayza.dev",
    profileDir: join(dir, "profile"),
    registry,
    evidenceDir: join(dir, ".publisher"),
    dryRun: false,
    force: false,
    log: () => {},
    now: () => new Date("2026-10-18T19:00:00-05:00"),
    wait: async (min, max) => {
      waits.push([min, max]);
    },
    ...overrides,
  };
  return { request, registry, calls, waits };
}

const key = { id: "pieza", platform: "instagram", account: "dev" };
const past = (status: Entry["status"], at = "2026-10-17T19:00:00-05:00"): Entry => ({ ...key, status, at, source: "cli" });

describe("decide", () => {
  it("posts when there is nothing or only a failure", () => {
    assert.equal(decide(undefined, false).go, true);
    assert.equal(decide(past("failed"), false).go, true);
  });

  it("holds when it is published, manual or stuck in sending, unless forced", () => {
    for (const status of ["published", "manual", "sending"] as const) {
      assert.equal(decide(past(status), false).go, false);
      assert.equal(decide(past(status), true).go, true);
    }
  });
});

describe("postPublication", () => {
  it("records sending and then published with the URL", async () => {
    const { request, registry, calls } = setup();
    const outcome = await postPublication(request);
    assert.deepEqual(outcome, { kind: "published", url: "https://www.instagram.com/p/abc/" });
    assert.deepEqual(registry.entries().map((e) => e.status), ["sending", "published"]);
    assert.match(registry.latest(key)?.fingerprint ?? "", /^sha256:/);
    assert.deepEqual(calls, ["open", "post", "close"]);
  });

  it("skips a publication that is already posted, without opening the browser", async () => {
    const { request, registry, calls } = setup();
    registry.append(past("manual"));
    const outcome = await postPublication(request);
    assert.equal(outcome.kind, "skipped");
    assert.deepEqual(calls, []);
  });

  it("refuses to post over a run that died after clicking share", async () => {
    const { request, registry, calls } = setup();
    registry.append(past("sending"));
    await assert.rejects(postPublication(request), /stopped right after clicking share/);
    assert.deepEqual(calls, []);
    const forced = setup({}, { force: true });
    forced.registry.append(past("sending"));
    assert.equal((await postPublication(forced.request)).kind, "published");
  });

  it("records a failure before sharing, with a capture", async () => {
    const { request, registry, calls } = setup({ fail: "before-share" });
    await assert.rejects(postPublication(request), /Next button not found\nCapture: /);
    assert.equal(registry.latest(key)?.status, "failed");
    assert.equal(registry.latest(key)?.error, "Next button not found");
    assert.deepEqual(calls, ["open", "post", "capture", "close"]);
  });

  it("leaves sending in place when it fails after the share click", async () => {
    const { request, registry } = setup({ fail: "after-share" });
    await assert.rejects(postPublication(request), /didn't confirm/);
    assert.equal(registry.latest(key)?.status, "sending");
  });

  it("posts nothing and records nothing when the account doesn't match", async () => {
    const wrong = setup({ handle: "otra.cuenta" });
    await assert.rejects(postPublication(wrong.request), /as @otra\.cuenta, but account "dev" is @jeremyayza\.dev/);
    assert.deepEqual(wrong.registry.entries(), []);
    assert.ok(!wrong.calls.includes("post"));
    const loggedOut = setup({ loggedIn: false });
    await assert.rejects(postPublication(loggedOut.request), /publisher login instagram --account dev/);
    assert.deepEqual(loggedOut.registry.entries(), []);
  });

  it("dry runs stop before sharing, ignore the registry and leave it untouched", async () => {
    const { request, registry } = setup({}, { dryRun: true });
    registry.append(past("published"));
    const outcome = await postPublication(request);
    assert.equal(outcome.kind, "dry-run");
    assert.equal(registry.entries().length, 1);
  });

  it("waits 1 to 2 minutes when the account posted in the last 15 minutes", async () => {
    const recent = setup();
    recent.registry.append({ ...past("published", "2026-10-18T18:50:00-05:00"), id: "otra" });
    await postPublication(recent.request);
    assert.deepEqual(recent.waits, [[60_000, 120_000]]);
    const old = setup();
    old.registry.append({ ...past("published", "2026-10-18T18:30:00-05:00"), id: "otra" });
    await postPublication(old.request);
    assert.deepEqual(old.waits, []);
  });

  it("rejects media the platform wouldn't take, before opening the browser", async () => {
    const { request, calls } = setup({}, {});
    request.manifest = { ...request.manifest, media: [...request.manifest.media, join(request.profileDir, "falta.png")] };
    await assert.rejects(postPublication(request), /Missing file/);
    assert.deepEqual(calls, []);
  });
});
