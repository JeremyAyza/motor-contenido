import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { chromium, type BrowserContext } from "playwright-core";
import { PublisherError } from "./errors.ts";

/** Where browser profiles live: PUBLISHER_HOME or the user's app data folder, never inside a repo. */
export function publisherHome(): string {
  if (process.env.PUBLISHER_HOME) return process.env.PUBLISHER_HOME;
  if (process.platform === "win32") return join(process.env.LOCALAPPDATA ?? join(homedir(), "AppData", "Local"), "publisher");
  if (process.platform === "darwin") return join(homedir(), "Library", "Application Support", "publisher");
  return join(process.env.XDG_DATA_HOME ?? join(homedir(), ".local", "share"), "publisher");
}

/** One profile per platform and handle, so every project that posts as that account shares its session. */
export function profileDir(platform: string, handle: string): string {
  return join(publisherHome(), "profiles", platform, handle);
}

/** Opens the installed Chrome (or CHROME_PATH) with a persistent profile, in a visible window. */
export async function openProfile(dir: string): Promise<BrowserContext> {
  mkdirSync(dir, { recursive: true });
  const executablePath = process.env.CHROME_PATH;
  try {
    return await chromium.launchPersistentContext(dir, {
      ...(executablePath ? { executablePath } : { channel: "chrome" }),
      headless: false,
      viewport: null,
      args: ["--start-maximized"],
    });
  } catch (e) {
    const reason = (e as Error).message.split("\n")[0];
    if (/already in use|ProcessSingleton|SingletonLock/i.test((e as Error).message)) {
      throw new PublisherError(`The profile ${dir} is open in another Chrome window. Close it and try again.`);
    }
    throw new PublisherError(`Could not open Chrome. Install Google Chrome or set CHROME_PATH.\n${reason}`);
  }
}
