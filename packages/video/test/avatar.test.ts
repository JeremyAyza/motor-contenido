import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { avatarConPoses } from "../../carousel/src/direcciones.ts";
import { stageAvatar } from "../src/avatar-manifest.ts";
import { drawnAvatar, type AvatarSprites } from "../src/kit/avatar.tsx";

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
