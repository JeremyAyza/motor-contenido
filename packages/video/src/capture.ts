import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { z } from "zod";

/*
 * Real output for the screens of a video (docs/propuesta-reels-jacket.md,
 * "Lo real"). content/<piece>/captures.json lists commands; video:capture runs
 * them in a folder of their own, keeps what they printed and the date, and the
 * scenes show it with useCapture. Nothing is typed by hand: what a Terminal
 * shows from a capture is what ran. The agent runs them, so nobody has to test
 * anything by hand.
 */

export const CaptureStepSchema = z.object({
  cmd: z.string().trim().min(1).describe("A bash command, run in the capture's folder"),
  cwd: z.string().trim().optional().describe("Subfolder of the capture's folder to run it in"),
  show: z.boolean().default(true).describe("false for setup steps: they run, but their output is not kept"),
  env: z.record(z.string(), z.string()).optional(),
});

export const CaptureResultSchema = z.object({
  ranAt: z.iso.datetime({ offset: true }),
  steps: z.array(z.object({ cmd: z.string(), output: z.array(z.string()), exitCode: z.number().int() })),
});
export type CaptureResult = z.infer<typeof CaptureResultSchema>;

export const CaptureSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "Lowercase letters, digits and dashes"),
  about: z.string().trim().min(5).describe("What the capture is, as the video says it: 'un push a un repositorio local de prueba'"),
  env: z.record(z.string(), z.string()).optional().describe("Variables for every step, over the fixed ones (CAPTURE_ENV)"),
  steps: z.array(CaptureStepSchema).min(1),
  result: CaptureResultSchema.optional().describe("Written by video:capture: do not edit it by hand"),
});
export type Capture = z.infer<typeof CaptureSchema>;

export const CapturesSchema = z.object({ $schema: z.string().optional(), captures: z.array(CaptureSchema).min(1) });
export type Captures = z.infer<typeof CapturesSchema>;

export const CAPTURES_FILE = "captures.json";

/**
 * Fixed variables, so a capture does not depend on the machine: git's
 * author and dates (the same content gives the same hashes), no system or
 * user config, English and no colors. HOME goes to the capture's own folder.
 */
export const CAPTURE_ENV: Record<string, string> = {
  GIT_AUTHOR_NAME: "Dev",
  GIT_AUTHOR_EMAIL: "dev@example.com",
  GIT_COMMITTER_NAME: "Dev",
  GIT_COMMITTER_EMAIL: "dev@example.com",
  GIT_AUTHOR_DATE: "2026-10-20T18:00:00-05:00",
  GIT_COMMITTER_DATE: "2026-10-20T18:00:00-05:00",
  GIT_CONFIG_NOSYSTEM: "1",
  GIT_TERMINAL_PROMPT: "0",
  LANG: "C",
  LC_ALL: "C",
  NO_COLOR: "1",
};

export function loadCaptures(dir: string): Captures | null {
  const path = join(dir, CAPTURES_FILE);
  if (!existsSync(path)) return null;
  const parsed = CapturesSchema.safeParse(JSON.parse(readFileSync(path, "utf8")));
  if (!parsed.success) throw new Error(parsed.error.issues.map((i) => `${CAPTURES_FILE} → ${i.path.join(".")}: ${i.message}`).join("\n"));
  return parsed.data;
}

export function saveCaptures(dir: string, captures: Captures): void {
  writeFileSync(join(dir, CAPTURES_FILE), JSON.stringify(captures, null, 2) + "\n");
}

/** The ways a folder shows up in output on Windows and in Git Bash: C:\a\b, C:/a/b and /c/a/b. */
function pathForms(path: string): string[] {
  const slash = path.replace(/\\/g, "/");
  const msys = slash.replace(/^([A-Za-z]):/, (_, drive: string) => `/${drive.toLowerCase()}`);
  return [...new Set([path, slash, msys])].sort((a, b) => b.length - a.length);
}

/**
 * What a command printed, as a terminal shows it: without colors, with only
 * the last state of each progress line (git redraws them with \r), and with
 * no local path: the capture's folder becomes ~/demo and the home folder ~.
 */
export function cleanOutput(text: string, folder: string, home = homedir()): string[] {
  let out = text.replace(/\x1b\[[0-9;]*[A-Za-z]/g, "");
  for (const form of pathForms(folder)) out = out.split(form).join("~/demo");
  for (const form of pathForms(home)) out = out.split(form).join("~");
  return out
    .split(/\r?\n/)
    .map((line) => line.split("\r").filter(Boolean).at(-1) ?? "")
    .map((line) => line.trimEnd())
    .filter((line, i, all) => line !== "" || (i > 0 && i < all.length - 1));
}

/** Runs a capture in a clean folder under `root` and returns what its shown steps printed. */
export function runCapture(capture: Capture, root: string, bash = "bash"): CaptureResult {
  const folder = join(root, capture.id);
  rmSync(folder, { recursive: true, force: true });
  mkdirSync(join(folder, ".home"), { recursive: true });
  const inherited = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith("GIT_")));
  const steps: CaptureResult["steps"] = [];
  for (const step of capture.steps) {
    const cwd = step.cwd ? join(folder, step.cwd) : folder;
    const env = { ...inherited, ...CAPTURE_ENV, HOME: join(folder, ".home"), ...capture.env, ...step.env };
    const result = spawnSync(bash, ["-c", `${step.cmd} 2>&1`], { cwd, env, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
    if (result.error) throw new Error(`Capture "${capture.id}": could not run bash (${result.error.message})`);
    const exitCode = result.status ?? 1;
    if (!step.show && exitCode !== 0) {
      throw new Error(`Capture "${capture.id}": the setup step "${step.cmd}" failed (exit ${exitCode}):\n${cleanOutput(result.stdout, folder).join("\n")}`);
    }
    if (step.show) steps.push({ cmd: step.cmd, output: cleanOutput(result.stdout, folder), exitCode });
  }
  return { ranAt: new Date().toISOString(), steps };
}
