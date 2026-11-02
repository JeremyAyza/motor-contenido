import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { spring } from "remotion";
import { avatarConPoses } from "../../carousel/src/direcciones.ts";
import { stageAvatar } from "../src/avatar-manifest.ts";
import { avatarMotion, avatarPlace, avatarPresence, cueMs, drawnAvatar, edgeOffset, riseLine, type AvatarSprites } from "../src/kit/avatar.tsx";
import { CAPTIONS_TOP, WIDTH } from "../src/timeline.ts";

const account: AvatarSprites = {
  base: "avatar/v1/base.png",
  mouths: ["avatar/v1/mouth-half.png", "avatar/v1/mouth-open.png"],
  blink: "avatar/v1/eyes-closed.png",
  imageSize: 2048,
  mouthBox: { x: 900, y: 980, w: 450, h: 280 },
  eyesBox: { x: 820, y: 690, w: 560, h: 250 },
};
const url = { piece: (src: string) => `/piece/${src}`, account: (src: string) => `/${src}` };

describe("drawnAvatar", () => {
  it("draws the account's avatar when the piece gives only where it goes", () => {
    const avatar = drawnAvatar({ size: 190, top: 724 }, account, url);
    assert.equal(avatar.base, "/avatar/v1/base.png");
    assert.deepEqual(avatar.mouths, ["/avatar/v1/mouth-half.png", "/avatar/v1/mouth-open.png"]);
    assert.equal(avatar.imageSize, 2048);
    assert.equal(avatar.size, 190);
  });

  it("takes the piece's sprites from its folder, field by field", () => {
    const avatar = drawnAvatar({ blink: "img/wink.png" }, account, url);
    assert.equal(avatar.blink, "/piece/img/wink.png");
    assert.equal(avatar.base, "/avatar/v1/base.png");
  });

  it("says what is missing when the account has no avatar", () => {
    assert.throws(() => drawnAvatar({ base: "img/me.png" }, undefined, url), /the account has none .* does not give mouths, blink, mouthBox, eyesBox, imageSize/);
  });
});

const FPS = 30;
const scene = {
  id: "trampa",
  durationMs: 6000,
  words: [
    { text: "Aquí", startMs: 500, endMs: 900 },
    { text: "está", startMs: 900, endMs: 1200 },
    { text: "la", startMs: 1200, endMs: 1300 },
    { text: "trampa,", startMs: 1300, endMs: 2000 },
    { text: "la", startMs: 3000, endMs: 3200 },
  ],
};

describe("avatarPlace", () => {
  it("keeps the bust of `avatar: {}` at the bottom left, standing on the captions, in every scene", () => {
    assert.deepEqual(avatarPlace({}, undefined, "trampa"), { shape: "bust", size: 220, x: 110, y: CAPTIONS_TOP - 220 + 6 + 110 });
    const top = avatarPlace({ size: 190, top: 724 }, undefined, "trampa");
    assert.deepEqual(top, { shape: "bust", size: 190, x: 95, y: 724 + 95 });
  });

  it("keeps AvatarDef.scenes for the scenes without their own avatar", () => {
    assert.equal(avatarPlace({ scenes: ["cierre"] }, undefined, "trampa"), null);
    assert.ok(avatarPlace({ scenes: ["cierre"] }, undefined, "cierre"));
    assert.ok(avatarPlace({ scenes: ["cierre"] }, { at: "trampa" }, "trampa"));
  });

  it("keeps a bubble video to the scenes that say where it goes", () => {
    assert.equal(avatarPlace({ shape: "bubble" }, undefined, "trampa"), null);
    assert.deepEqual(avatarPlace({ shape: "bubble" }, { x: 92, y: 610, size: 132 }, "trampa"), { shape: "bubble", size: 132, x: 92, y: 610 });
  });

  it("lets a scene change the shape, in both directions", () => {
    assert.equal(avatarPlace({ shape: "bubble" }, { shape: "bust" }, "trampa")?.shape, "bust");
    assert.equal(avatarPlace({}, { shape: "bubble" }, "trampa")?.shape, "bubble");
  });

  it("gives a bust a place per scene, by its center", () => {
    assert.deepEqual(avatarPlace({}, { x: 300, y: 500, size: 160 }, "trampa"), { shape: "bust", size: 160, x: 300, y: 500 });
  });

  it("waits on the side it comes from when the scene does not say where", () => {
    assert.equal(avatarPlace({}, { from: "right" }, "trampa")?.x, WIDTH - 110);
    assert.equal(avatarPlace({}, { from: "left" }, "trampa")?.x, 110);
    const bubble = avatarPlace({ shape: "bubble" }, { from: "right" }, "trampa")!;
    assert.equal(bubble.size, 132);
    assert.ok(bubble.x + bubble.size / 2 <= WIDTH - 36, "a bubble stays inside the frame's padding");
    assert.ok(bubble.y + bubble.size / 2 < CAPTIONS_TOP, "and over the captions");
  });
});

describe("cueMs", () => {
  it("takes seconds from the start of the scene", () => {
    assert.equal(cueMs(1.5, scene), 1500);
  });

  it("takes a word of the voice, whatever its case and punctuation", () => {
    assert.equal(cueMs("TRAMPA", scene), 1300);
  });

  it("takes a later time the word is said", () => {
    assert.equal(cueMs("la", scene), 1200);
    assert.equal(cueMs({ word: "la", nth: 2 }, scene), 3000);
  });

  it("says which words there are when the voice does not say it", () => {
    assert.throws(() => cueMs("banco", scene), /"banco" \(time 1\) is not said in scene "trampa"\. Words: Aquí está la trampa, la/);
    assert.throws(() => cueMs({ word: "aquí", nth: 2 }, scene), /\(time 2\)/);
  });
});

describe("avatarPresence", () => {
  const popped = (frame: number) => spring({ frame, fps: FPS, config: { damping: 12, stiffness: 170 } });

  it("leaves the bust of `avatar: {}` there from the first frame", () => {
    for (const frame of [0, 1, 45, 179]) assert.equal(avatarPresence(undefined, "bust", scene, frame, FPS), 1);
    assert.equal(avatarPresence({ x: 300, y: 500 }, "bust", scene, 0, FPS), 1);
  });

  it("pops a bubble in when the scene starts, as it did", () => {
    for (const frame of [0, 3, 10, 60]) assert.equal(avatarPresence({ x: 92, y: 610, size: 132 }, "bubble", scene, frame, FPS), popped(frame));
  });

  it("comes in at a word, or at a second, with the same pop", () => {
    const start = 39; // "trampa" at 1300 ms
    assert.equal(avatarPresence({ at: "trampa" }, "bust", scene, start - 1, FPS), 0);
    assert.equal(avatarPresence({ at: "trampa" }, "bust", scene, start + 5, FPS), popped(5));
    assert.equal(avatarPresence({ at: 2 }, "bubble", scene, 59, FPS), 0);
    assert.equal(avatarPresence({ at: 2 }, "bubble", scene, 65, FPS), popped(5));
  });

  it("leaves after `until`, and is gone in a quarter of a second", () => {
    const moment = { until: "trampa" };
    const start = 39;
    assert.equal(avatarPresence(moment, "bust", scene, start, FPS), 1);
    const leaving = avatarPresence(moment, "bust", scene, start + 3, FPS);
    assert.ok(leaving > 0 && leaving < 1, `leaving at ${leaving}`);
    assert.equal(avatarPresence(moment, "bust", scene, start + 8, FPS), 0);
    assert.equal(avatarPresence(moment, "bust", scene, 170, FPS), 0);
  });

  it("settles without the pop's big bounce when it peeks in from an edge", () => {
    const frames = Array.from({ length: 60 }, (_, frame) => avatarPresence({ from: "left" }, "bust", scene, frame, FPS));
    assert.equal(frames[0], 0);
    const peak = Math.max(...frames);
    assert.ok(peak > 1, "it still overshoots a little");
    assert.ok(peak < 1.12, `overshoots by ${peak}`);
    assert.ok(Math.abs(frames[59] - 1) < 0.01);
  });

  it("does not hide a moment that would leave it off screen", () => {
    assert.throws(() => avatarPresence({ at: 7 }, "bust", scene, 0, FPS), /comes in at 7000 ms and the scene lasts 6000 ms/);
    assert.throws(() => avatarPresence({ at: "trampa", until: "aquí" }, "bust", scene, 0, FPS), /leaves \(until\) at 500 ms, before it comes in \(at\) at 1300 ms/);
    assert.throws(() => avatarPresence({ at: "banco" }, "bust", scene, 0, FPS), /"banco" \(time 1\) is not said/);
  });
});

describe("peeking in from an edge", () => {
  const place = { shape: "bubble" as const, x: 92, y: 610, size: 132 };

  it("starts outside the frame on the sides", () => {
    const left = edgeOffset("left", place);
    assert.ok(place.x + left.x + place.size / 2 < 0);
    assert.equal(left.y, 0);
    const right = edgeOffset("right", place);
    assert.ok(place.x + right.x - place.size / 2 > WIDTH);
    assert.equal(right.y, 0);
  });

  it("rises from the captions' top, or from its own base if it stands lower, without crossing them", () => {
    assert.equal(riseLine(place), CAPTIONS_TOP);
    assert.equal(riseLine({ ...place, y: 850 }), 850 + 66);
    const up = edgeOffset("bottom", place);
    assert.equal(up.x, 0);
    assert.ok(place.y + up.y - place.size / 2 > riseLine(place), "its top starts under the line");
  });

  it("slides from the edge to its place, and pops where it stands without an edge", () => {
    const { x } = edgeOffset("left", place);
    assert.equal(avatarMotion(0, "left", place), `translate(${x}px, 0px)`);
    assert.equal(avatarMotion(1, "left", place), "translate(0px, 0px)");
    assert.equal(avatarMotion(0.4, undefined, place), "scale(0.4)");
  });
});

describe("stageAvatar", () => {
  const manifestIn = (dir: string, files: string[]) => {
    mkdirSync(join(dir, "v1"), { recursive: true });
    for (const file of files) writeFileSync(join(dir, file), "png");
    const manifest = join(dir, "manifest.json");
    writeFileSync(manifest, JSON.stringify({ ...account, base: "v1/base.png", mouths: ["v1/mouth-half.png"], blink: "v1/eyes-closed.png" }));
    return manifest;
  };

  it("copies the sprites to <out>/avatar and returns them relative to the public folder", () => {
    const dir = mkdtempSync(join(tmpdir(), "avatar-"));
    const out = join(dir, "out");
    const sprites = stageAvatar(manifestIn(dir, ["v1/base.png", "v1/mouth-half.png", "v1/eyes-closed.png"]), out);
    assert.equal(sprites?.base, "avatar/v1/base.png");
    assert.deepEqual(sprites?.mouths, ["avatar/v1/mouth-half.png"]);
    assert.ok(existsSync(join(out, "avatar/v1/eyes-closed.png")));
  });

  it("has no avatar without a manifest", () => {
    assert.equal(stageAvatar(join(tmpdir(), "no-such-avatar", "manifest.json"), tmpdir()), undefined);
  });

  it("names the sprite that is not there", () => {
    const dir = mkdtempSync(join(tmpdir(), "avatar-"));
    assert.throws(() => stageAvatar(manifestIn(dir, ["v1/base.png"]), join(dir, "out")), /v1\/mouth-half\.png does not exist/);
  });
});

describe("avatarConPoses", () => {
  it("leaves the carousel's 'personaje' direction out with only the video bust", () => {
    const dir = mkdtempSync(join(tmpdir(), "avatar-"));
    const file = join(dir, "manifest.json");
    writeFileSync(file, JSON.stringify(account));
    assert.equal(avatarConPoses(file), false);
    writeFileSync(file, JSON.stringify({ ...account, poses: { neutral: "poses/neutral.png" } }));
    assert.equal(avatarConPoses(file), true);
  });
});
