import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cameraAt, cameraTransform, DRIFT, fitZoom, MOVE_MS, resolveShots, VIEW } from "../src/kit/camera.ts";

const world = { width: 1000, height: 2000, spots: { top: { x: 0, y: 0, w: 1000, h: 500 }, door: { x: 400, y: 1500, w: 200, h: 200 } } };
const near = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} is not ${b}`);

describe("resolveShots", () => {
  it("frames the whole world when the first scene has no camera", () => {
    const [first] = resolveShots([undefined], world);
    assert.deepEqual({ x: first.x, y: first.y }, { x: 500, y: 1000 });
    near(first.zoom, Math.min(VIEW.w / 1000, VIEW.h / 2000));
  });

  it("fits a spot in the view and keeps the previous shot when a scene has no camera", () => {
    const shots = resolveShots([{ focus: "door" }, undefined, { zoom: 3 }], world);
    assert.deepEqual({ x: shots[0].x, y: shots[0].y }, { x: 500, y: 1600 });
    near(shots[0].zoom, fitZoom({ w: 200, h: 200 }));
    assert.deepEqual(shots[1], shots[0]);
    assert.deepEqual(shots[2], { x: 500, y: 1600, zoom: 3 });
  });

  it("says which spots exist when the focus is wrong", () => {
    assert.throws(() => resolveShots([{ focus: "roof" }], world), /"roof" is not a spot of the stage. Spots: top, door/);
  });
});

describe("cameraAt", () => {
  const shots = [
    { x: 0, y: 0, zoom: 1 },
    { x: 100, y: 200, zoom: 4 },
  ];
  const durations = [3000, 3000];

  it("drifts in during a scene", () => {
    near(cameraAt(shots, durations, 0).zoom, 1);
    near(cameraAt(shots, durations, 1500).zoom, 1 + DRIFT / 2);
  });

  it("starts each move where the previous scene ended, without a jump", () => {
    const end = cameraAt(shots, durations, 2999.999);
    const start = cameraAt(shots, durations, 3000);
    near(start.x, end.x, 1e-3);
    near(start.zoom, end.zoom, 1e-3);
  });

  it("lands on the scene's shot after the move", () => {
    const landed = cameraAt(shots, durations, 3000 + MOVE_MS);
    assert.deepEqual({ x: landed.x, y: landed.y }, { x: 100, y: 200 });
    near(landed.zoom, 4 * (1 + (DRIFT * MOVE_MS) / 3000));
  });

  it("stays on the last scene after the end", () => {
    assert.equal(cameraAt(shots, durations, 99_000, { drift: 0 }).zoom, 4);
  });
});

describe("cameraTransform", () => {
  it("puts the camera's point at the center of the view", () => {
    const t = cameraTransform({ x: 100, y: 50, zoom: 2 });
    assert.equal(t, `translate(${VIEW.x + VIEW.w / 2 - 200}px, ${VIEW.y + VIEW.h / 2 - 100}px) scale(2)`);
  });
});

describe("a shot that follows a path", () => {
  const world = { width: 1000, height: 1000, paths: { road: "M 0 0 L 1000 0" } };
  const shots = resolveShots([{ focus: { x: 0, y: 0 }, zoom: 1 }, { follow: { path: "road", from: 0.2, to: 0.8 }, zoom: 1 }, { focus: { x: 500, y: 500 } }], world);

  it("starts where the path's `from` is", () => {
    assert.equal(Math.round(shots[1].x), 200);
  });

  it("travels to `to` during the scene, and the next move starts there", () => {
    const at = (ms: number) => cameraAt(shots, [1000, 3000, 2000], ms, { drift: 0 });
    assert.equal(Math.round(at(1000 + 900).x), 200);
    assert.equal(Math.round(at(1000 + 3000 - 1).x), 800);
    assert.equal(Math.round(at(4000).x), 800);
  });

  it("says which paths the stage has when the name is wrong", () => {
    assert.throws(() => resolveShots([{ follow: { path: "rio", from: 0, to: 1 } }], world), /"rio" is not a path of the stage. Paths: road/);
  });
});

describe("a tracking shot that holds its x", () => {
  const world = { width: 1000, height: 1000, paths: { s: "M 100 0 L 900 1000" } };
  it("travels down the path but keeps the x", () => {
    const shots = resolveShots([{ follow: { path: "s", from: 0, to: 1, x: 500 }, zoom: 1 }], world);
    const end = cameraAt(shots, [2000], 1999, { drift: 0 });
    assert.equal(Math.round(end.x), 500);
    assert.ok(end.y > 990);
  });
});
