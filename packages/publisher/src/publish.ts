import { join } from "node:path";
import { PublisherError } from "./errors.ts";
import { pause } from "./human.ts";
import { fingerprintOf, problemsWith, type Manifest } from "./manifest.ts";
import type { Platform, Publisher } from "./platforms/platform.ts";
import { timestamp, type Entry, type Registry } from "./registry.ts";

/** If the account posted less than this long ago, wait 1 to 2 minutes before posting again. */
const RECENT_MS = 15 * 60 * 1000;
const LOGIN_TIMEOUT_MS = 10 * 60 * 1000;

export type Decision = { go: true } | { go: false; entry: Entry };

/** Whether to post, given the registry's latest entry for this publication. */
export function decide(latest: Entry | undefined, force: boolean): Decision {
  if (force || !latest || latest.status === "failed") return { go: true };
  return { go: false, entry: latest };
}

type Log = (line: string) => void;

export type PostRequest = {
  platform: Platform;
  /** Media paths already resolved. */
  manifest: Manifest;
  handle: string;
  profileDir: string;
  registry: Registry;
  /** Folder for captures: dry runs and errors. */
  evidenceDir: string;
  dryRun: boolean;
  force: boolean;
  log: Log;
  now?: () => Date;
  wait?: (min: number, max: number) => Promise<void>;
};

export type PostOutcome = { kind: "published"; url?: string } | { kind: "skipped"; entry: Entry } | { kind: "dry-run"; captures: string[] };

const fileStamp = (id: string, date: Date) => `${date.toISOString().replace(/[:.]/g, "-")}-${id.replace(/[^\w.-]+/g, "-")}`;

/**
 * Makes sure the open session is the account's. Without a session it waits for
 * the person to log in by hand in the Chrome window: nobody else types credentials.
 */
async function ensureAccount(publisher: Publisher, platform: string, account: string, handle: string, log: Log): Promise<void> {
  if (!(await publisher.isLoggedIn())) {
    log(`Not logged in to ${platform}. Log in as @${handle} in the Chrome window that just opened; waiting up to 10 minutes`);
    try {
      await publisher.waitForLogin(LOGIN_TIMEOUT_MS);
    } catch {
      throw new PublisherError(`Nobody logged in to ${platform} within 10 minutes, so nothing was posted`);
    }
  }
  const current = await publisher.currentHandle();
  if (!current) throw new PublisherError(`Couldn't tell which ${platform} account is logged in, so nothing was posted`);
  if (current !== handle) throw new PublisherError(`Logged in to ${platform} as @${current}, but account "${account}" is @${handle}. Nothing was posted`);
}

/**
 * Posts one publication and records it. A dry run fills in everything, stops
 * before sharing, saves a capture and leaves the registry alone.
 */
export async function postPublication(req: PostRequest): Promise<PostOutcome> {
  const { platform, manifest, registry, log } = req;
  const now = req.now ?? (() => new Date());
  const wait = req.wait ?? pause;
  const key = { id: manifest.id, platform: platform.id, account: manifest.account };

  const problems = problemsWith(manifest, platform.limits);
  if (problems.length) throw new PublisherError(`${manifest.id} can't go to ${platform.id}:\n- ${problems.join("\n- ")}`);

  if (!req.dryRun) {
    const decision = decide(registry.latest(key), req.force);
    if (!decision.go && decision.entry.status === "sending") {
      throw new PublisherError(
        `A previous run stopped right after clicking share (${decision.entry.at}). Check the ${platform.id} profile: ` +
          `if the post is there, run "publisher mark ${platform.id} --id ${manifest.id} --account ${manifest.account} --url <url>"; if not, run again with --force`,
      );
    }
    if (!decision.go) return { kind: "skipped", entry: decision.entry };
    const last = registry.lastPublished(platform.id, manifest.account);
    if (last && now().getTime() - Date.parse(last.at) < RECENT_MS) {
      log(`${manifest.account} posted on ${platform.id} at ${last.at}; waiting 1 to 2 minutes first`);
      await wait(60_000, 120_000);
    }
  }

  const fingerprint = fingerprintOf(manifest);
  const publisher = await platform.open(req.profileDir);
  let started = false;
  let shared = false;
  try {
    await ensureAccount(publisher, platform.id, manifest.account, req.handle, log);
    log(`Posting ${manifest.id} to ${platform.id} as @${req.handle}${req.dryRun ? " (dry run)" : ""}`);
    started = true;
    const result = await publisher.post(
      { caption: manifest.caption, media: manifest.media, handle: req.handle },
      {
        dryRun: req.dryRun,
        beforeShare: () => {
          registry.append({ ...key, status: "sending", at: timestamp(now()), fingerprint, source: "cli" });
          shared = true;
        },
      },
    );
    if (req.dryRun) return { kind: "dry-run", captures: await publisher.capture(join(req.evidenceDir, "dry-runs", fileStamp(manifest.id, now()))) };
    registry.append({ ...key, status: "published", at: timestamp(now()), url: result.url, fingerprint, source: "cli" });
    return { kind: "published", url: result.url };
  } catch (error) {
    const captures = await publisher.capture(join(req.evidenceDir, "errors", fileStamp(manifest.id, now()))).catch(() => []);
    const reason = error instanceof PublisherError ? error.message : (error as Error).message.split("\n")[0];
    const evidence = captures.length ? `\nCapture: ${captures.join(", ")}` : "";
    if (shared) {
      throw new PublisherError(
        `Share was clicked but ${platform.id} didn't confirm: ${reason}. The registry stays at "sending": ` +
          `check the profile, then record it with "publisher mark" or run again with --force${evidence}`,
      );
    }
    if (started && !req.dryRun) registry.append({ ...key, status: "failed", at: timestamp(now()), fingerprint, error: reason, source: "cli" });
    throw new PublisherError(`${reason}${evidence}`);
  } finally {
    await publisher.close();
  }
}

export type LoginRequest = { platform: Platform; account: string; handle: string; profileDir: string; log: Log };

/** Opens the account's profile, waits for the person to log in by hand and checks the handle. */
export async function login(req: LoginRequest): Promise<void> {
  const { platform, account, handle, log } = req;
  const publisher = await platform.open(req.profileDir);
  try {
    if (!(await publisher.isLoggedIn())) {
      log(`Log in to ${platform.id} as @${handle} in the Chrome window. Waiting up to 10 minutes`);
      await publisher.waitForLogin(LOGIN_TIMEOUT_MS);
    }
    const current = await publisher.currentHandle();
    if (!current) throw new PublisherError(`Logged in, but couldn't read which ${platform.id} account it is`);
    if (current !== handle) {
      throw new PublisherError(`Logged in as @${current}, but account "${account}" is @${handle}. Log out in that window and run login again`);
    }
    log(`Session saved for @${handle} on ${platform.id}: ${req.profileDir}`);
  } finally {
    await publisher.close();
  }
}
