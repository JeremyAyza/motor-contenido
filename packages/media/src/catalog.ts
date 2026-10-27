import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { z } from "zod";

/**
 * The asset catalog (assets/catalog.json): every third-party file the videos
 * use, with where it comes from and its license. The catalog is versioned;
 * the files are not. The repo is public and several licenses forbid
 * redistributing the files as they are, so they are downloaded to a cache
 * that git ignores.
 */
export const AssetSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  type: z.enum(["sfx", "music", "image", "animation", "video", "logo"]),
  title: z.string().optional().describe("The brand's name, for a logo: what <Logo> says to screen readers"),
  tags: z.array(z.string()).default([]),
  url: z.url().describe("Where the file is downloaded from"),
  source: z.url().describe("The page that states the license"),
  author: z.string().min(1),
  license: z.string().min(1).describe("SPDX id (CC0-1.0, CC-BY-4.0...) or the name of the license"),
  attribution: z.string().optional().describe("Credit line; required when the license asks for it"),
  sha256: z
    .string()
    .regex(/^[0-9a-f]{64}$/)
    .optional()
    .describe("Hash of the file, so a changed download is caught"),
  checkedAt: z.iso.date().optional().describe("When the license was checked at `source`, like the facts of a piece"),
  notes: z.string().optional(),
});
export type Asset = z.infer<typeof AssetSchema>;

export const CatalogSchema = z.object({ assets: z.array(AssetSchema) });
export type Catalog = z.infer<typeof CatalogSchema>;

export function loadCatalog(path: string): Catalog {
  return CatalogSchema.parse(JSON.parse(readFileSync(path, "utf8")));
}

/** Adds an asset to the catalog file. Ids are unique. */
export function addToCatalog(path: string, asset: Asset): Catalog {
  const catalog = loadCatalog(path);
  if (catalog.assets.some((a) => a.id === asset.id)) throw new Error(`The catalog already has an asset "${asset.id}": pick another id`);
  const updated = { assets: [...catalog.assets, AssetSchema.parse(asset)] };
  writeFileSync(path, JSON.stringify(updated, null, 2) + "\n");
  return updated;
}

export function findAsset(catalog: Catalog, id: string): Asset {
  const asset = catalog.assets.find((a) => a.id === id);
  if (!asset) throw new Error(`Asset "${id}" is not in the catalog. Known: ${catalog.assets.map((a) => a.id).join(", ")}`);
  return asset;
}

/**
 * An asset can go into a video only with its license checked at the source
 * and its hash recorded: the hash proves the file is the one that was checked.
 */
export function assertUsable(asset: Asset): asserts asset is Asset & { sha256: string; checkedAt: string } {
  const missing = [!asset.checkedAt && "checkedAt (the date its license was checked at the source)", !asset.sha256 && "sha256"].filter(Boolean);
  if (missing.length) throw new Error(`Asset "${asset.id}" cannot be used yet: it needs ${missing.join(" and ")} in assets/catalog.json`);
}

const sha256 = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");

/** Where an asset lives in the cache: its id plus the extension of its URL. */
export const cachedFile = (asset: Asset, cacheDir: string) => join(cacheDir, `${asset.id}${extname(new URL(asset.url).pathname) || ".bin"}`);

/** Local path of an asset, downloading it to the cache the first time. */
export async function fetchAsset(asset: Asset, cacheDir: string): Promise<string> {
  const file = cachedFile(asset, cacheDir);
  if (!existsSync(file)) {
    const response = await fetch(asset.url);
    if (!response.ok) throw new Error(`Could not download ${asset.id} from ${asset.url}: HTTP ${response.status}`);
    mkdirSync(cacheDir, { recursive: true });
    writeFileSync(file, new Uint8Array(await response.arrayBuffer()));
  }
  const hash = sha256(readFileSync(file));
  if (asset.sha256 && hash !== asset.sha256) throw new Error(`${asset.id} changed: expected sha256 ${asset.sha256}, got ${hash}. Check the source before using it.`);
  return file;
}

/** A brand logo of the catalog, ready to draw: its name and its file in the cache. */
export type CatalogLogo = { title: string; file: string };

/**
 * The official logos that Simple Icons does not have (AGENTS.md, rule 6):
 * every `logo` of the catalog, downloaded to the cache and checked by its
 * hash, by id. <Logo slug> falls back to them.
 */
export async function fetchLogos(catalog: Catalog, cacheDir: string): Promise<Record<string, CatalogLogo>> {
  const logos: Record<string, CatalogLogo> = {};
  for (const asset of catalog.assets.filter((a) => a.type === "logo")) {
    assertUsable(asset);
    logos[asset.id] = { title: asset.title ?? asset.id, file: await fetchAsset(asset, cacheDir) };
  }
  return logos;
}
