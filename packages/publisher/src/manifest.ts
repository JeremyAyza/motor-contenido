import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { z } from "zod";
import { PublisherError } from "./errors.ts";
import type { Limits } from "./platforms/platform.ts";

export const CONFIG_FILE = "publisher.config.json";

const slug = z.string().trim().regex(/^[a-z0-9][a-z0-9-]*$/, "Use lowercase letters, digits and dashes");

/** What a project hands to the CLI: one publication, with nothing platform-specific in it. */
export const ManifestSchema = z.object({
  id: z.string().trim().min(1).describe("Stable id of the piece, such as its folder name"),
  account: slug.describe(`Account key from ${CONFIG_FILE}`),
  caption: z.string().describe("Post text, hashtags included"),
  media: z.array(z.string().min(1)).min(1).describe("Image paths in posting order, relative to the manifest"),
});
export type Manifest = z.infer<typeof ManifestSchema>;

/** Project config: where the registry lives and each account's handle on each platform. */
export const ConfigSchema = z.object({
  registry: z.string().min(1).default("publications.jsonl").describe("Registry path, relative to the config"),
  accounts: z.record(
    slug,
    z.record(
      slug,
      z
        .string()
        .trim()
        .min(1)
        .transform((handle) => handle.replace(/^@/, "").toLowerCase()),
    ),
  ),
});
export type Config = z.infer<typeof ConfigSchema>;

export type Project = { root: string; config: Config; registryFile: string };

function readJson<T extends z.ZodType>(file: string, schema: T): z.infer<T> {
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    throw new PublisherError(`${file} is not valid JSON: ${(e as Error).message}`);
  }
  const result = schema.safeParse(raw);
  if (!result.success) throw new PublisherError(`${file} is invalid:\n${z.prettifyError(result.error)}`);
  return result.data;
}

/** Finds publisher.config.json from `from` upward; its folder is the project root. */
export function loadProject(from: string): Project {
  for (let dir = resolve(from); ; dir = dirname(dir)) {
    const file = join(dir, CONFIG_FILE);
    if (existsSync(file)) {
      const config = readJson(file, ConfigSchema);
      return { root: dir, config, registryFile: resolve(dir, config.registry) };
    }
    if (dirname(dir) === dir) throw new PublisherError(`No ${CONFIG_FILE} found from ${from} upward`);
  }
}

/** Reads a manifest and resolves its media paths against the manifest's folder. */
export function loadManifest(file: string): Manifest {
  if (!existsSync(file)) throw new PublisherError(`Manifest not found: ${file}`);
  const manifest = readJson(file, ManifestSchema);
  return { ...manifest, media: manifest.media.map((path) => resolve(dirname(file), path)) };
}

export function assertAccount(config: Config, account: string): Record<string, string> {
  const handles = config.accounts[account];
  if (!handles) throw new PublisherError(`Unknown account "${account}". Add it to ${CONFIG_FILE}`);
  return handles;
}

/** The account's handle on the platform, without the @. */
export function handleFor(config: Config, account: string, platform: string): string {
  const handle = assertAccount(config, account)[platform];
  if (!handle) throw new PublisherError(`Account "${account}" has no ${platform} handle in ${CONFIG_FILE}`);
  return handle;
}

const megabytes = (bytes: number) => (bytes / 1024 / 1024).toFixed(1);

/** Reasons the platform would reject the publication, one per item. Empty when it can go. */
export function problemsWith(manifest: Manifest, limits: Limits): string[] {
  const problems: string[] = [];
  if (manifest.media.length > limits.maxMedia) problems.push(`${manifest.media.length} images; the limit is ${limits.maxMedia}`);
  for (const file of manifest.media) {
    if (!existsSync(file)) {
      problems.push(`Missing file: ${file}`);
      continue;
    }
    const format = extname(file).slice(1).toLowerCase();
    if (!limits.formats.includes(format)) problems.push(`Unsupported format .${format}: ${file} (use ${limits.formats.join(", ")})`);
    const size = statSync(file).size;
    if (size > limits.maxBytes) problems.push(`Too large (${megabytes(size)} MB, limit ${megabytes(limits.maxBytes)} MB): ${file}`);
  }
  const length = [...manifest.caption].length;
  if (length > limits.maxCaption) problems.push(`Caption has ${length} characters; the limit is ${limits.maxCaption}`);
  const hashtags = manifest.caption.match(/#[\p{L}\p{N}_]+/gu)?.length ?? 0;
  if (hashtags > limits.maxHashtags) problems.push(`Caption has ${hashtags} hashtags; the limit is ${limits.maxHashtags}`);
  return problems;
}

/** Hash of the caption and the image bytes: it tells whether a piece changed after it was posted. */
export function fingerprintOf(manifest: Manifest): string {
  const hash = createHash("sha256").update(manifest.caption);
  for (const file of manifest.media) hash.update("\0").update(readFileSync(file));
  return `sha256:${hash.digest("hex")}`;
}
