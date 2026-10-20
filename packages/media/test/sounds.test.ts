import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CatalogSchema } from "../src/catalog.ts";
import { freesoundHit, openverseHit, searchCatalog } from "../src/sounds.ts";

describe("openverseHit", () => {
  const result = {
    id: "abc",
    title: "Pencil on paper",
    creator: "someone",
    license: "cc0",
    url: "https://cdn.freesound.org/previews/1/1.mp3",
    foreign_landing_url: "https://freesound.org/s/1",
    duration: 1500,
    tags: [{ name: "pencil" }, { name: "paper" }],
  };

  it("keeps CC0 results, with seconds and the source page", () => {
    assert.deepEqual(openverseHit(result), {
      library: "openverse",
      id: "abc",
      title: "Pencil on paper",
      author: "someone",
      license: "CC0-1.0",
      seconds: 1.5,
      url: result.url,
      source: result.foreign_landing_url,
      tags: ["pencil", "paper"],
    });
  });

  it("drops everything that is not CC0", () => {
    assert.equal(openverseHit({ ...result, license: "by" }), null);
  });
});

describe("freesoundHit", () => {
  const sound = {
    id: 7,
    name: "click",
    username: "kenney",
    license: "http://creativecommons.org/publicdomain/zero/1.0/",
    duration: 0.2,
    url: "https://freesound.org/s/7/",
    previews: { "preview-hq-mp3": "https://cdn.freesound.org/previews/0/7-hq.mp3" },
  };

  it("keeps CC0 sounds and downloads the high-quality preview", () => {
    assert.equal(freesoundHit(sound)?.url, "https://cdn.freesound.org/previews/0/7-hq.mp3");
  });

  it("drops CC BY sounds", () => {
    assert.equal(freesoundHit({ ...sound, license: "https://creativecommons.org/licenses/by/4.0/" }), null);
  });
});

describe("searchCatalog", () => {
  const catalog = CatalogSchema.parse({
    assets: [
      { id: "page-turn", type: "sfx", tags: ["papel", "trazo"], url: "https://x/a.wav", source: "https://x", author: "Kenney", license: "CC0-1.0" },
      { id: "whoosh", type: "sfx", tags: ["transición", "aire"], url: "https://x/b.wav", source: "https://x", author: "1bob", license: "CC0-1.0" },
    ],
  });

  it("matches tags and ids, ignoring accents", () => {
    assert.deepEqual(searchCatalog(catalog, "transicion").map((a) => a.id), ["whoosh"]);
    assert.deepEqual(searchCatalog(catalog, "page").map((a) => a.id), ["page-turn"]);
  });

  it("needs every word to match", () => {
    assert.deepEqual(searchCatalog(catalog, "papel aire"), []);
  });
});
