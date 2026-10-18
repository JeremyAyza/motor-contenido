import { join } from "node:path";
import { profileDir } from "./browser.ts";
import { PublisherError } from "./errors.ts";
import { handleFor, loadProject, type Manifest } from "./manifest.ts";
import { instagram } from "./platforms/instagram.ts";
import type { Platform } from "./platforms/platform.ts";
import { postPublication, type PostOutcome } from "./publish.ts";
import { Registry } from "./registry.ts";

/**
 * Public API for code in other packages, such as the carousel's
 * carrusel:publicar. The CLI goes through it too.
 */
export { PublisherError } from "./errors.ts";
export { loadManifest, type Manifest } from "./manifest.ts";
export type { PostOutcome } from "./publish.ts";

export const PLATFORMS: Record<string, Platform> = { instagram };

export function platformById(id: string): Platform {
  const platform = PLATFORMS[id];
  if (!platform) throw new PublisherError(`No adapter for "${id}". Available: ${Object.keys(PLATFORMS).join(", ")}`);
  return platform;
}

export type PostCommand = {
  /** Folder to look for publisher.config.json from, upward. */
  from: string;
  platform: string;
  /** Media paths already resolved. */
  manifest: Manifest;
  dryRun?: boolean;
  force?: boolean;
  log?: (line: string) => void;
};

/** Posts a manifest with the project's config and registry and the account's browser profile. */
export async function postManifest(command: PostCommand): Promise<PostOutcome> {
  const project = loadProject(command.from);
  const platform = platformById(command.platform);
  const handle = handleFor(project.config, command.manifest.account, platform.id);
  return postPublication({
    platform,
    manifest: command.manifest,
    handle,
    profileDir: profileDir(platform.id, handle),
    registry: new Registry(project.registryFile),
    evidenceDir: join(project.root, ".publisher"),
    dryRun: command.dryRun ?? false,
    force: command.force ?? false,
    log: command.log ?? console.log,
  });
}
