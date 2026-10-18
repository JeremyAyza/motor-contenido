import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { profileDir } from "./browser.ts";
import { PublisherError } from "./errors.ts";
import { assertAccount, handleFor, loadManifest, loadProject } from "./manifest.ts";
import { instagram } from "./platforms/instagram.ts";
import type { Platform } from "./platforms/platform.ts";
import { login, postPublication } from "./publish.ts";
import { Registry, timestamp, type Entry } from "./registry.ts";

const PLATFORMS: Record<string, Platform> = { instagram };

const USAGE = `Usage:
  publisher login <platform> --account <account>
  publisher post <platform> --manifest <file> [--dry-run] [--force]
  publisher status [--id <id>]
  publisher mark <platform> --id <id> --account <account> [--url <url>] [--at <date with offset>]

Platforms with an adapter: ${Object.keys(PLATFORMS).join(", ")}. "mark" takes any platform.`;

// npm and pnpm run scripts from the package root; INIT_CWD is where the command was typed.
const cwd = process.env.INIT_CWD ?? process.cwd();

function required(value: string | undefined, flag: string): string {
  if (!value) throw new PublisherError(`Missing ${flag}\n\n${USAGE}`);
  return value;
}

function adapter(id: string | undefined): Platform {
  const platform = PLATFORMS[required(id, "<platform>")];
  if (!platform) throw new PublisherError(`No adapter for "${id}". Available: ${Object.keys(PLATFORMS).join(", ")}`);
  return platform;
}

function printStatus(entries: Entry[]): void {
  const header = ["ID", "PLATFORM", "ACCOUNT", "STATUS", "AT", "URL / ERROR"];
  const rows = entries.map((e) => [e.id, e.platform, e.account, e.status, e.at, e.url ?? e.error ?? ""]);
  const widths = header.map((title, i) => Math.max(title.length, ...rows.map((row) => row[i].length)));
  for (const row of [header, ...rows]) console.log(row.map((cell, i) => (i === row.length - 1 ? cell : cell.padEnd(widths[i]))).join("  "));
}

async function main(argv: string[]): Promise<void> {
  const { positionals, values } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      account: { type: "string" },
      manifest: { type: "string" },
      id: { type: "string" },
      url: { type: "string" },
      at: { type: "string" },
      "dry-run": { type: "boolean", default: false },
      force: { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
  });
  const [command, platformId] = positionals;
  if (values.help || !command) {
    console.log(USAGE);
    return;
  }

  const project = loadProject(cwd);
  const registry = new Registry(project.registryFile);

  switch (command) {
    case "login": {
      const platform = adapter(platformId);
      const account = required(values.account, "--account");
      const handle = handleFor(project.config, account, platform.id);
      await login({ platform, account, handle, profileDir: profileDir(platform.id, handle), log: console.log });
      return;
    }
    case "post": {
      const platform = adapter(platformId);
      const manifest = loadManifest(resolve(cwd, required(values.manifest, "--manifest")));
      const handle = handleFor(project.config, manifest.account, platform.id);
      const outcome = await postPublication({
        platform,
        manifest,
        handle,
        profileDir: profileDir(platform.id, handle),
        registry,
        evidenceDir: join(project.root, ".publisher"),
        dryRun: values["dry-run"],
        force: values.force,
        log: console.log,
      });
      if (outcome.kind === "skipped") {
        console.log(`Already on ${platform.id} (${outcome.entry.status}, ${outcome.entry.at}${outcome.entry.url ? `, ${outcome.entry.url}` : ""}). Use --force to post again.`);
      } else if (outcome.kind === "dry-run") {
        console.log(`Dry run stopped before sharing. Capture: ${outcome.captures.join(", ")}`);
      } else if (outcome.url) {
        console.log(`Posted: ${outcome.url}`);
      } else {
        console.log(`Posted, but its URL wasn't found on the profile. Add it with: publisher mark ${platform.id} --id ${manifest.id} --account ${manifest.account} --url <url>`);
      }
      return;
    }
    case "status": {
      const entries = registry.current().filter((e) => !values.id || e.id === values.id);
      if (entries.length) printStatus(entries);
      else console.log(values.id ? `Nothing recorded for ${values.id}.` : "Nothing recorded yet.");
      return;
    }
    case "mark": {
      const platform = required(platformId, "<platform>");
      const account = required(values.account, "--account");
      const id = required(values.id, "--id");
      assertAccount(project.config, account);
      registry.append({ id, platform, account, status: "manual", at: values.at ?? timestamp(), url: values.url, source: "manual" });
      console.log(`Recorded ${id} as posted on ${platform} by ${account}.`);
      return;
    }
    default:
      throw new PublisherError(`Unknown command "${command}"\n\n${USAGE}`);
  }
}

main(process.argv.slice(2)).catch((error: unknown) => {
  const code = (error as { code?: string }).code;
  if (error instanceof PublisherError) console.error(error.message);
  else if (code?.startsWith("ERR_PARSE_ARGS")) console.error(`${(error as Error).message}\n\n${USAGE}`);
  else console.error(error);
  process.exitCode = 1;
});
