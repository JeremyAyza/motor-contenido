import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import type { Asset, Catalog } from "./catalog.ts";
import { normalizeWord } from "./words.ts";

/**
 * Searching sounds outside the catalog. Only CC0 comes back: no attribution to
 * keep track of and no doubt about commercial use. One adapter per library.
 */
export type SoundHit = {
  library: string;
  /** The library's own id. */
  id: string;
  title: string;
  author: string;
  /** Always "CC0-1.0": adapters drop everything else. */
  license: "CC0-1.0";
  seconds?: number;
  /** The file to download. */
  url: string;
  /** The page that states the license. */
  source: string;
  tags: string[];
};

export interface SoundSearch {
  readonly id: string;
  search(query: string, limit: number): Promise<SoundHit[]>;
  get(id: string): Promise<SoundHit>;
}

const TIMEOUT_MS = 20_000;

async function getJson(url: string, library: string, headers: Record<string, string> = {}): Promise<unknown> {
  const response = await fetch(url, { headers: { "User-Agent": "motor-contenido (github.com/JeremyAyza/motor-contenido)", ...headers }, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`${library} answered HTTP ${response.status} for ${url.replace(/token=[^&]+/, "token=…")}`);
  return response.json();
}

type OpenverseAudio = {
  id: string;
  title?: string;
  creator?: string;
  license: string;
  url: string;
  foreign_landing_url: string;
  duration?: number | null;
  tags?: { name: string }[];
};

export function openverseHit(r: OpenverseAudio): SoundHit | null {
  if (r.license.toLowerCase() !== "cc0") return null;
  return {
    library: "openverse",
    id: r.id,
    title: r.title ?? "Sin título",
    author: r.creator ?? "Desconocido",
    license: "CC0-1.0",
    seconds: r.duration ? r.duration / 1000 : undefined,
    url: r.url,
    source: r.foreign_landing_url,
    tags: (r.tags ?? []).map((t) => t.name),
  };
}

/** Anonymous Openverse requests answer 401 above this page size. */
const OPENVERSE_MAX_PAGE = 20;

/**
 * Openverse (WordPress), no key needed. Its license filter sometimes fails
 * with a 5xx, so on failure it searches without it and filters here.
 */
export function openverseSearch(base = "https://api.openverse.org/v1"): SoundSearch {
  return {
    id: "openverse",
    async search(query, limit) {
      const q = encodeURIComponent(query);
      let data: { results: OpenverseAudio[] };
      try {
        data = (await getJson(`${base}/audio/?q=${q}&license=cc0&page_size=${Math.min(limit, OPENVERSE_MAX_PAGE)}`, "Openverse")) as { results: OpenverseAudio[] };
      } catch {
        data = (await getJson(`${base}/audio/?q=${q}&page_size=${OPENVERSE_MAX_PAGE}`, "Openverse")) as { results: OpenverseAudio[] };
      }
      return data.results.map(openverseHit).filter((h): h is SoundHit => h !== null).slice(0, limit);
    },
    async get(id) {
      const hit = openverseHit((await getJson(`${base}/audio/${encodeURIComponent(id)}/`, "Openverse")) as OpenverseAudio);
      if (!hit) throw new Error(`Openverse ${id} is not CC0`);
      return hit;
    },
  };
}

type FreesoundSound = {
  id: number;
  name: string;
  username: string;
  license: string;
  duration?: number;
  url: string;
  tags?: string[];
  previews?: Record<string, string>;
};

export function freesoundHit(s: FreesoundSound): SoundHit | null {
  const file = s.previews?.["preview-hq-mp3"];
  if (!s.license.includes("publicdomain/zero") || !file) return null;
  return { library: "freesound", id: String(s.id), title: s.name, author: s.username, license: "CC0-1.0", seconds: s.duration, url: file, source: s.url, tags: s.tags ?? [] };
}

/**
 * Freesound, with a free API key (FREESOUND_API_KEY in .env). The download is
 * the high-quality MP3 preview: the original file needs OAuth.
 */
export function freesoundSearch({ apiKey, base = "https://freesound.org/apiv2" }: { apiKey: string; base?: string }): SoundSearch {
  const fields = "id,name,username,license,duration,url,tags,previews";
  return {
    id: "freesound",
    async search(query, limit) {
      const filter = encodeURIComponent('license:"Creative Commons 0"');
      const data = (await getJson(`${base}/search/text/?query=${encodeURIComponent(query)}&filter=${filter}&fields=${fields}&page_size=${limit}&token=${apiKey}`, "Freesound")) as {
        results: FreesoundSound[];
      };
      return data.results.map(freesoundHit).filter((h): h is SoundHit => h !== null);
    },
    async get(id) {
      const hit = freesoundHit((await getJson(`${base}/sounds/${encodeURIComponent(id)}/?fields=${fields}&token=${apiKey}`, "Freesound")) as FreesoundSound);
      if (!hit) throw new Error(`Freesound ${id} is not CC0`);
      return hit;
    },
  };
}

/** Catalog assets that match every word of the query, in id, tags, attribution or notes. */
export function searchCatalog(catalog: Catalog, query: string): Asset[] {
  const words = query.split(/\s+/).map(normalizeWord).filter(Boolean);
  return catalog.assets.filter((asset) => {
    const haystack = [asset.id, ...asset.tags, asset.attribution ?? "", asset.notes ?? ""].join(" ").split(/[\s-]+/).map(normalizeWord);
    return words.every((w) => haystack.some((h) => h.startsWith(w)));
  });
}

/**
 * Downloads a hit and turns it into a catalog entry, with its hash and the
 * date its license was read from the library. The license is CC0, so the
 * attribution is a courtesy, not a requirement.
 */
export async function downloadHit(hit: SoundHit, entry: { id: string; tags: string[] }, cacheDir: string, today: string): Promise<{ asset: Asset; file: string }> {
  const response = await fetch(hit.url, { signal: AbortSignal.timeout(60_000) });
  if (!response.ok) throw new Error(`Could not download ${hit.url}: HTTP ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  mkdirSync(cacheDir, { recursive: true });
  const file = join(cacheDir, `${entry.id}${extname(new URL(hit.url).pathname) || ".mp3"}`);
  writeFileSync(file, bytes);
  const asset: Asset = {
    id: entry.id,
    type: "sfx",
    tags: entry.tags.length ? entry.tags : hit.tags.slice(0, 5),
    url: hit.url,
    source: hit.source,
    author: hit.author,
    license: hit.license,
    attribution: `${hit.title} by ${hit.author} (${hit.library})`,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    checkedAt: today,
    notes: `Licencia CC0 según la API de ${hit.library}; la fuente original está en source.`,
  };
  return { asset, file };
}
