import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join, relative, resolve } from "node:path";
import { REPO_ROOT } from "./repo.ts";

/*
 * `npm run agy -- <spec.md>`: hands a closed, mechanical task to Antigravity
 * (agy, Gemini 3.8 Flash) and checks what it did. The agent that delegates
 * writes the spec; this command runs agy headless, keeps a log in .cache/agy/
 * and prints which files changed, so the agent verifies with git diff and by
 * running the check again (the trust rule of docs/reel.md).
 */

export const USAGE = `Usage:
  npm run agy -- <spec.md> [--pieza content/<piece>] [--toca <path>[,<path>]] [--plan]
                [--esquema <schema.json>] [--modelo <id>] [--esfuerzo low|medium|high] [--tiempo <min>]
      Runs agy -p with the spec. It may change only the files under --pieza and --toca (the whole
      repo when neither is given), and those must be clean in git before it starts.
      --plan: read-only (agy --mode plan); no clean tree needed. Use it for audits and matching.
      --esquema: a JSON Schema for the answer (agy --json-schema); without it agy answers a report
      with { terminado, archivos, comprobaciones, notas }.
      The log goes to .cache/agy/<date>-<spec>.json. Exit code 1 if agy failed, was cut off, said
      it did not finish, or changed files outside its scope.`;

export const DEFAULT_MODEL = "gemini-3.8-flash-high";
export const DEFAULT_EFFORT = "high";
export const DEFAULT_MINUTES = 15;

export interface AgyOptions {
  spec: string;
  scope: string[];
  plan: boolean;
  schema?: string;
  model: string;
  effort: string;
  minutes: number;
}

export class AgyError extends Error {}

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  if (i < 0) return undefined;
  const value = args[i + 1];
  if (!value || value.startsWith("--")) throw new AgyError(`${name} needs a value`);
  return value;
}

const VALUE_FLAGS = new Set(["--pieza", "--toca", "--esquema", "--modelo", "--esfuerzo", "--tiempo"]);
/** Specs longer than this go to agy as a file it reads, not inline (Windows caps a command line at 32 k). */
export const INLINE_LIMIT = 8000;

export function parseArgs(args: string[]): AgyOptions {
  const spec = args.find((a, i) => !a.startsWith("--") && !VALUE_FLAGS.has(args[i - 1] ?? ""));
  if (!spec) throw new AgyError(`Missing the spec file\n\n${USAGE}`);
  const scope = [flag(args, "--pieza"), ...(flag(args, "--toca")?.split(",") ?? [])]
    .filter((p): p is string => Boolean(p))
    .map((p) => toRepoPath(p));
  const minutes = Number(flag(args, "--tiempo") ?? DEFAULT_MINUTES);
  if (!Number.isFinite(minutes) || minutes <= 0) throw new AgyError("--tiempo is in minutes, a positive number");
  const effort = flag(args, "--esfuerzo") ?? DEFAULT_EFFORT;
  if (!["low", "medium", "high"].includes(effort)) throw new AgyError("--esfuerzo is low, medium or high");
  return { spec, scope, plan: args.includes("--plan"), schema: flag(args, "--esquema"), model: flag(args, "--modelo") ?? DEFAULT_MODEL, effort, minutes };
}

/** A path relative to the repo, with forward slashes, as git prints it. */
export function toRepoPath(path: string, root = REPO_ROOT): string {
  const rel = relative(root, resolve(root, path)).replace(/\\/g, "/");
  if (rel.startsWith("..")) throw new AgyError(`${path} is outside the repo`);
  return rel === "" ? "." : rel.replace(/\/$/, "");
}

export const inScope = (file: string, scope: string[]): boolean =>
  scope.length === 0 || scope.some((s) => s === "." || file === s || file.startsWith(`${s}/`));

/** The report agy fills when the spec does not bring its own schema. */
export const REPORT_SCHEMA = {
  type: "object",
  properties: {
    terminado: { type: "boolean", description: "true only if every step of the spec is done and its checks passed" },
    archivos: { type: "array", items: { type: "string" }, description: "files you changed, relative to the repo" },
    comprobaciones: {
      type: "array",
      items: {
        type: "object",
        properties: { comando: { type: "string" }, exito: { type: "boolean" }, resumen: { type: "string" } },
        required: ["comando", "exito", "resumen"],
      },
    },
    notas: { type: "string", description: "what you could not do, what you doubted, or anything the reviewer must look at" },
  },
  required: ["terminado", "archivos", "comprobaciones", "notas"],
} as const;

/**
 * The commands agy may run headless, the same as permissions.allow in
 * ~/.gemini/antigravity-cli/settings.json (docs/reel.md says how to change it).
 * A command outside this list is auto-denied and ends agy's turn with no answer.
 */
export const ALLOWED_COMMANDS = [
  "npm test",
  "npm run typecheck",
  "npx tsc",
  "node --import tsx --test <archivos>",
  "git status",
  "git diff",
  "npm run docs:check",
  "npm run video:check -- content/<pieza>",
  "npm run video:frames -- content/<pieza> <segundos>",
  "npm run video:script -- content/<pieza>",
  "npm run video:render -- content/<pieza> --escena <id>",
];

/** The rules agy works under, then the spec (or where to read it when it is long). */
export function buildPrompt(spec: string, options: Pick<AgyOptions, "scope" | "plan">, specFile?: string): string {
  const where = options.plan
    ? "Modo solo lectura: no cambies ningún archivo."
    : options.scope.length
      ? `Solo puedes cambiar archivos dentro de: ${options.scope.join(", ")}. No toques nada más.`
      : "Puedes cambiar los archivos que la especificación pida, y ninguno más.";
  return [
    "Trabajas en el repo motor-contenido como ayudante mecánico. Sigue la especificación de abajo al pie de la letra.",
    "",
    "Reglas:",
    `- ${where}`,
    "- No hagas commit ni push, no cambies de rama y no publiques nada.",
    "- No corras video:prepare, video:music ni video:image: gastan créditos.",
    `- Solo puedes correr estos comandos: ${ALLOWED_COMMANDS.join("; ")}. Cualquier otro se rechaza y corta tu trabajo sin respuesta: si la especificación pide otro, no lo corras y dilo en las notas.`,
    "- Si la especificación trae comandos de comprobación, córrelos al final y reporta su resultado real. No inventes salidas.",
    "- Si algo no está claro o no se puede, no improvises: dilo en las notas y marca terminado en false.",
    "- No cambies el diseño, el texto ni el guion más allá de lo que la especificación pide.",
    "",
    "--- Especificación ---",
    "",
    spec.length <= INLINE_LIMIT || !specFile ? spec.trim() : `Es larga: está en ${specFile}. Léela completa antes de empezar.`,
  ].join("\n");
}

/** Every changed or untracked file and a hash of its content, from git status. */
export function snapshot(root = REPO_ROOT): Map<string, string> {
  const status = git(["status", "--porcelain=v1", "-z", "--untracked-files=all"], root);
  const files = new Map<string, string>();
  const entries = status.split("\0").filter(Boolean);
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const code = entry.slice(0, 2);
    const file = entry.slice(3);
    if (code.startsWith("R") || code.startsWith("C")) i++; // the next entry is the old name
    const full = join(root, file);
    const hash = existsSync(full) ? createHash("sha1").update(readFileSync(full)).digest("hex") : "deleted";
    files.set(file, `${code}:${hash}`);
  }
  return files;
}

/** Files whose status or content changed between two snapshots. */
export function changedFiles(before: Map<string, string>, after: Map<string, string>): string[] {
  const files = new Set([...before.keys(), ...after.keys()]);
  return [...files].filter((f) => before.get(f) !== after.get(f)).sort();
}

function git(args: string[], cwd: string): string {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.status !== 0) throw new AgyError(`git ${args[0]} failed: ${result.stderr.trim()}`);
  return result.stdout;
}

interface AgyResult {
  status?: string;
  response?: string;
  finished_reason?: string;
  duration_seconds?: number;
  structured_output?: Record<string, unknown>;
  usage?: Record<string, number>;
  conversation_id?: string;
  denied_actions?: { action: string; display_name?: string }[];
}

const stamp = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}-${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}`;

export function main(args: string[]): number {
  if (args.length === 0 || args.includes("--help")) {
    console.log(USAGE);
    return 0;
  }
  const options = parseArgs(args);
  const specPath = resolve(options.spec);
  if (!existsSync(specPath)) throw new AgyError(`${specPath} does not exist`);
  const schema = options.schema ? readFileSync(resolve(options.schema), "utf8") : JSON.stringify(REPORT_SCHEMA);
  JSON.parse(schema);

  const before = snapshot();
  if (!options.plan) {
    const dirty = [...before.keys()].filter((f) => inScope(f, options.scope));
    if (dirty.length)
      throw new AgyError(`These files have uncommitted changes and agy may touch them; commit or stash them first:\n  ${dirty.join("\n  ")}`);
  }

  const logDir = join(REPO_ROOT, ".cache/agy");
  mkdirSync(logDir, { recursive: true });
  const started = new Date();
  const name = `${stamp(started)}-${basename(specPath, extname(specPath))}`;
  const spec = readFileSync(specPath, "utf8");
  // agy only reads inside the workspace, so a long spec is copied into it.
  const specCopy = join(logDir, `${name}.spec.md`);
  writeFileSync(specCopy, spec);
  const schemaFile = join(logDir, `${name}.schema.json`);
  writeFileSync(schemaFile, schema);
  const prompt = buildPrompt(spec, options, toRepoPath(specCopy));
  const agyArgs = [
    "-p",
    prompt,
    "--model",
    options.model,
    "--effort",
    options.effort,
    "--mode",
    options.plan ? "plan" : "accept-edits",
    "--output-format",
    "json",
    "--json-schema",
    schemaFile,
    "--print-timeout",
    `${options.minutes}m`,
  ];
  console.log(`agy: ${basename(specPath)} with ${options.model} (${options.plan ? "read-only" : `scope: ${options.scope.join(", ") || "whole repo"}`})…`);
  const run = spawnSync("agy", agyArgs, { cwd: REPO_ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: (options.minutes + 2) * 60_000 });
  const after = snapshot();

  let result: AgyResult = {};
  try {
    result = JSON.parse(run.stdout.trim().split("\n").filter((l) => l.startsWith("{")).pop() ?? "{}");
  } catch {
    result = { status: "UNPARSED", response: run.stdout };
  }
  const changed = changedFiles(before, after);
  const outside = changed.filter((f) => !inScope(f, options.plan ? ["__none__"] : options.scope));
  const report = result.structured_output;

  const logFile = join(logDir, `${name}.json`);
  writeFileSync(
    logFile,
    `${JSON.stringify({ spec: specPath, options, started: started.toISOString(), exit: run.status, stderr: run.stderr?.slice(-4000), changed, outside, result }, null, 2)}\n`,
  );

  const lines = [
    `agy ${result.status ?? "FAILED"}${result.finished_reason ? ` (${result.finished_reason})` : ""} in ${Math.round(result.duration_seconds ?? (Date.now() - started.getTime()) / 1000)} s`,
    `changed: ${changed.length ? changed.join(", ") : "nothing"}`,
  ];
  if (outside.length) lines.push(`OUTSIDE ITS SCOPE: ${outside.join(", ")}. Review and revert them.`);
  if (result.denied_actions?.length)
    lines.push(`STOPPED: it tried a ${result.denied_actions.map((d) => d.display_name ?? d.action).join(", ")} that is not allowed headless, and agy ends the turn there. What it changed before stays in the tree.`);
  if (report && !options.schema) {
    const checks = (report.comprobaciones as { comando: string; exito: boolean; resumen: string }[] | undefined) ?? [];
    for (const c of checks) lines.push(`check ${c.exito ? "ok" : "FAILED"}: ${c.comando}: ${c.resumen}`);
    lines.push(`finished: ${report.terminado ? "yes" : "NO"}`);
    if (report.notas) lines.push(`notes: ${report.notas}`);
  } else if (report) {
    lines.push(`answer: ${JSON.stringify(report)}`);
  } else if (result.response) {
    lines.push(`answer (no structure): ${result.response.slice(0, 600)}`);
  }
  lines.push(`log: ${toRepoPath(logFile)}`);
  lines.push("Trust rule: read git diff and run the check again before taking this as done.");
  console.log(lines.join("\n"));

  const failed =
    result.status !== "SUCCESS" || Boolean(result.finished_reason) || Boolean(result.denied_actions?.length) || !report || outside.length > 0 || (!options.schema && report.terminado === false);
  return failed ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    if (error instanceof AgyError) {
      console.error(error.message);
      process.exitCode = 1;
    } else throw error;
  }
}
