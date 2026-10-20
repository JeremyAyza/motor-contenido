import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { metricsReport, metricsRow, VideoMetricsSchema } from "../src/metrics.ts";
import type { VideoScript } from "../src/script.ts";

const snapshot = (day: number, reach: number, shares: number) => ({ day, views: reach * 2, reach, likes: 1, comments: 0, shares, saves: 2 });

describe("VideoMetricsSchema", () => {
  it("needs a time zone and at least one snapshot", () => {
    assert.equal(VideoMetricsSchema.safeParse({ publishedAt: "2026-10-21T19:00:00", snapshots: [snapshot(2, 100, 1)] }).success, false);
    assert.equal(VideoMetricsSchema.safeParse({ publishedAt: "2026-10-21T19:00:00-05:00", snapshots: [] }).success, false);
    assert.equal(VideoMetricsSchema.safeParse({ publishedAt: "2026-10-21T19:00:00-05:00", snapshots: [snapshot(2, 100, 1)] }).success, true);
  });
});

describe("metricsRow", () => {
  const metrics = VideoMetricsSchema.parse({
    publishedAt: "2026-10-21T19:00:00-05:00",
    tags: { seconds: 60 },
    snapshots: [snapshot(2, 100, 1), { ...snapshot(7, 400, 8), avgWatchSeconds: 15, skipRate: 40 }],
  });

  it("uses the snapshot closest to day 7", () => {
    const row = metricsRow("p", metrics);
    assert.equal(row.day, 7);
    assert.equal(row.sharesPct, 2);
    assert.equal(row.watchedPct, 25);
    assert.equal(row.skipRate, 40);
  });

  it("takes the hook formula from video.json when the tags do not say it", () => {
    const script = { hooks: [{ said: "x", onScreen: "x", formula: 22 }] } as VideoScript;
    assert.equal(metricsRow("p", metrics, script).hookFormula, 22);
  });
});

describe("metricsReport", () => {
  it("sorts by shares per reach and says there are no conclusions yet", () => {
    const base = { day: 7, views: 0, savesPct: 1, trial: false };
    const text = metricsReport([
      { ...base, piece: "baja", reach: 100, sharesPct: 0.5 },
      { ...base, piece: "alta", reach: 300, sharesPct: 3 },
    ]);
    assert.ok(text.indexOf("| alta |") < text.indexOf("| baja |"));
    assert.match(text, /no hay conclusiones todavía/);
    assert.match(text, /\| alta \| 7 \| 0 \| 300 \| 1\.5 \|/);
  });
});
