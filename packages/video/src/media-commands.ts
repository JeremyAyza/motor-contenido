import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { loadAccount, REPO_ROOT } from "../../brand/src/index.ts";
import {
  addToCatalog,
  CHROMA_PROMPT,
  downloadHit,
  imageProvider,
  loadCatalog,
  loadEnv,
  loadMediaConfig,
  musicProvider,
  recordGenerated,
  toPng,
  searchCatalog,
  soundSearch,
  type ImageReference,
  type SoundHit,
} from "../../media/src/index.ts";
import { asVideoError, VideoError } from "./errors.ts";

/*
 * Commands that make or find media for a piece: generated images and music
 * (recorded in generated.json) and sounds from free libraries (added to the
 * catalog with their license). Providers come from media.config.json.
 */

const CATALOG = join(REPO_ROOT, "assets/catalog.json");
const CONFIG = join(REPO_ROOT, "media.config.json");
const ASSET_CACHE = join(REPO_ROOT, ".cache/assets");
const MIME: Record<string, string> = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
const RAW_EXTENSION: Record<string, string> = { "image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp" };
const SLUG = /^[a-z0-9-]+$/;

export function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

/** Today in local time (YYYY-MM-DD), the date that goes into checkedAt. */
const today = () => new Date().toLocaleDateString("sv-SE");

function pieceArg(arg: string | undefined): string {
  if (!arg) throw new VideoError("Missing the piece folder (content/<piece>)");
  const dir = resolve(arg);
  if (!existsSync(dir)) throw new VideoError(`${dir} does not exist`);
  return dir;
}

function nameArg(args: string[]): string {
  const name = flag(args, "--name");
  if (!name || !SLUG.test(name)) throw new VideoError("Missing --name: lowercase letters, digits and dashes (it becomes the file name)");
  return name;
}

function promptArg(args: string[]): string {
  const prompt = flag(args, "--prompt");
  if (!prompt) throw new VideoError('Missing --prompt "..."');
  return prompt;
}

function refuseOverwrite(file: string, args: string[]): void {
  if (existsSync(file) && !args.includes("--replace")) {
    throw new VideoError(`${file} already exists. Each generation is paid: pass --replace only if you want a new one`);
  }
}

/**
 * The account's 3D world style (accounts/dev.json → world.style) plus the
 * piece's palette, for pieces asked for in 3D: the default is flat motion
 * graphics (docs/direccion-reels.md), which needs no generated world.
 */
function worldStyle(dir: string): string {
  const style = loadAccount("dev").world?.style ?? "";
  const videoFile = join(dir, "video.json");
  const palette = existsSync(videoFile) ? JSON.parse(readFileSync(videoFile, "utf8")).art?.palette : undefined;
  if (!palette) return style;
  const colors = Object.entries(palette).map(([k, v]) => `${k} ${v}`).join(", ");
  return `${style} Build the colors around this palette: ${colors}.`.trim();
}

/**
 * npm run video:image -- content/<piece> --name <name> --prompt "..."
 *   [--ref img/a.png,img/b.png] [--aspect 1:1] [--size 1K] [--chroma] [--world] [--replace]
 * Writes content/<piece>/img/<name>.png. With --chroma the model draws on flat
 * green and the green is keyed out, for a transparent PNG. --world adds the
 * account's 3D world style, only for a piece asked for in 3D.
 */
export async function imageCommand(args: string[], ffmpeg: string): Promise<void> {
  const dir = pieceArg(args[0]);
  const name = nameArg(args);
  const chroma = args.includes("--chroma");
  const style = args.includes("--world") ? worldStyle(dir) : "";
  const prompt = `${promptArg(args)}${style ? ` ${style}` : ""}${chroma ? ` ${CHROMA_PROMPT}` : ""}`;
  const refs = (flag(args, "--ref") ?? "").split(",").filter(Boolean);
  const references: ImageReference[] = refs.map((ref) => {
    const file = join(dir, ref);
    const mimeType = MIME[extname(file).toLowerCase()];
    if (!existsSync(file) || !mimeType) throw new VideoError(`Reference ${ref} is not a PNG, JPEG or WebP inside the piece folder`);
    return { data: readFileSync(file), mimeType };
  });
  const file = join(dir, "img", `${name}.png`);
  refuseOverwrite(file, args);
  loadEnv(join(REPO_ROOT, ".env"));
  const config = asVideoError(() => loadMediaConfig(CONFIG));
  const provider = asVideoError(() => imageProvider(config.image.provider, config.image.model));
  const size = flag(args, "--size") as "1K" | "2K" | "4K" | undefined;
  console.log(`Generating ${name} with ${provider.id}/${provider.model}${refs.length ? ` and ${refs.length} reference(s)` : ""}...`);
  const result = await provider.generate({ prompt, references, aspectRatio: flag(args, "--aspect"), size });
  // The raw output stays in out/ (not versioned); the piece gets a PNG.
  const raw = join(dir, "out/generated", `${name}${RAW_EXTENSION[result.mimeType] ?? ".img"}`);
  mkdirSync(join(dir, "out/generated"), { recursive: true });
  mkdirSync(join(dir, "img"), { recursive: true });
  writeFileSync(raw, result.image);
  asVideoError(() => toPng({ ffmpeg, input: raw, output: file, chroma }));
  recordGenerated(dir, { file: `img/${name}.png`, kind: "image", provider: provider.id, model: provider.model, prompt, references: refs }, readFileSync(file));
  console.log(`Image: ${file}${chroma ? " (green keyed out)" : ""}. Recorded in ${join(dir, "generated.json")}`);
}

/**
 * npm run video:music -- content/<piece> --name <name> --prompt "..." [--replace]
 * Writes content/<piece>/audio/<name>.mp3, to use as music: { file } in video.tsx.
 */
export async function musicCommand(args: string[]): Promise<void> {
  const dir = pieceArg(args[0]);
  const name = nameArg(args);
  const prompt = promptArg(args);
  for (const format of ["mp3", "wav"]) refuseOverwrite(join(dir, "audio", `${name}.${format}`), args);
  loadEnv(join(REPO_ROOT, ".env"));
  const config = asVideoError(() => loadMediaConfig(CONFIG));
  const provider = asVideoError(() => musicProvider(config.music.provider, config.music.model));
  console.log(`Composing ${name} with ${provider.id}/${provider.model}...`);
  const result = await provider.compose({ prompt });
  const file = join(dir, "audio", `${name}.${result.format}`);
  mkdirSync(join(dir, "audio"), { recursive: true });
  writeFileSync(file, result.audio);
  recordGenerated(dir, { file: `audio/${basename(file)}`, kind: "music", provider: provider.id, model: provider.model, prompt, references: [] }, result.audio);
  console.log(`Music: ${file}. Recorded in ${join(dir, "generated.json")}`);
}

const describeHit = (h: SoundHit) => `  ${h.library}:${h.id} | ${h.title} | ${h.author}${h.seconds ? ` | ${h.seconds.toFixed(1)} s` : ""} | ${h.source}`;

/**
 * npm run video:asset -- search "<query>" [--limit 8]
 * npm run video:asset -- add <library>:<id> --id <name> [--tags a,b]
 * Search looks in the catalog first and then in the configured libraries,
 * CC0 only. Add downloads the sound, hashes it and writes it to the catalog.
 */
export async function assetCommand(args: string[]): Promise<void> {
  const [action, target] = args;
  loadEnv(join(REPO_ROOT, ".env"));
  if (action === "search") {
    if (!target) throw new VideoError('Missing the query: npm run video:asset -- search "pencil on paper"');
    const limit = Number(flag(args, "--limit") ?? 8);
    const local = searchCatalog(loadCatalog(CATALOG), target);
    console.log(`Catalog: ${local.length ? local.map((a) => a.id).join(", ") : "nothing"}`);
    for (const library of loadMediaConfig(CONFIG).sounds) {
      let hits: SoundHit[];
      try {
        hits = await soundSearch(library).search(target, limit);
      } catch (error) {
        console.log(`${library}: skipped (${(error as Error).message})`);
        continue;
      }
      console.log(`${library}: ${hits.length} CC0 result(s)`);
      for (const hit of hits) console.log(describeHit(hit));
    }
    console.log('Add one with: npm run video:asset -- add <library>:<id> --id <name> --tags "a,b"');
    return;
  }
  if (action === "add") {
    const [library, id] = (target ?? "").split(/:(.*)/s);
    const assetId = flag(args, "--id");
    if (!library || !id || !assetId || !SLUG.test(assetId)) throw new VideoError("Usage: npm run video:asset -- add <library>:<id> --id <name> [--tags a,b]");
    if (loadCatalog(CATALOG).assets.some((a) => a.id === assetId)) throw new VideoError(`The catalog already has "${assetId}": pick another --id`);
    const search = asVideoError(() => soundSearch(library));
    const hit = await search.get(id);
    const tags = (flag(args, "--tags") ?? "").split(",").map((t) => t.trim()).filter(Boolean);
    const { asset, file } = await downloadHit(hit, { id: assetId, tags }, ASSET_CACHE, today());
    asVideoError(() => addToCatalog(CATALOG, asset));
    console.log(`Added "${asset.id}" to assets/catalog.json (${asset.license}, ${asset.attribution}). File: ${file}`);
    return;
  }
  throw new VideoError('Usage: npm run video:asset -- search "<query>" | add <library>:<id> --id <name>');
}
