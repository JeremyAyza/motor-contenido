import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { REPO_ROOT } from "./repo.ts";

/*
 * `npm run docs:check`: keeps the documentation small and connected
 * (docs/plan-velocidad-reels.md, Fase 2). It reports broken links, core files
 * over their size, and documents that nothing links to.
 * It also runs inside npm test.
 */

/** What an agent reads when it starts, and its ceiling in estimated tokens. */
export const CORE: Record<string, number> = {
  "AGENTS.md": 3300,
  "docs/reel.md": 4400,
  "docs/carrusel.md": 4400,
};

/** Rough tokens for Spanish prose and markdown: about 3.5 characters each. */
export const estimateTokens = (text: string): number => Math.ceil(text.length / 3.5);

/** Folders whose markdown is checked. */
const CHECKED = ["AGENTS.md", "README.md", "docs", "skills/video-es", "skills/ig-es", "skills/carrusel-taste", ".claude/agents", "packages", "assets", "accounts"];
const SKIP = new Set(["node_modules", "out", ".cache", "referencias"]);

export interface Problem {
  file: string;
  message: string;
}

/** Relative markdown links of a document: [text](path), without URLs or anchors alone. */
export function markdownLinks(text: string): string[] {
  const links: string[] = [];
  const withoutCode = text.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
  for (const match of withoutCode.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const target = match[1];
    if (/^[a-z]+:/i.test(target) || target.startsWith("#")) continue;
    links.push(decodeURI(target.split("#")[0]));
  }
  return links;
}

function markdownFiles(root: string, path: string): string[] {
  const full = join(root, path);
  if (!existsSync(full)) return [];
  if (statSync(full).isFile()) return path.endsWith(".md") ? [path] : [];
  return readdirSync(full).flatMap((name) => (SKIP.has(name) ? [] : markdownFiles(root, `${path}/${name}`)));
}

export function checkDocs(root = REPO_ROOT): Problem[] {
  const problems: Problem[] = [];
  const files = [...new Set(CHECKED.flatMap((p) => markdownFiles(root, p)))];
  const linked = new Set<string>();

  for (const file of files) {
    const text = readFileSync(join(root, file), "utf8");
    for (const link of markdownLinks(text)) {
      const target = relative(root, resolve(root, dirname(file), link)).replace(/\\/g, "/");
      linked.add(target);
      if (!existsSync(join(root, target))) problems.push({ file, message: `broken link: ${link}` });
    }
  }

  for (const [file, ceiling] of Object.entries(CORE)) {
    const full = join(root, file);
    if (!existsSync(full)) {
      problems.push({ file, message: "core file missing" });
      continue;
    }
    const tokens = estimateTokens(readFileSync(full, "utf8"));
    if (tokens > ceiling) problems.push({ file, message: `~${tokens} tokens, over its ${ceiling}` });
  }

  const docs = files.filter((f) => f.startsWith("docs/") && f.split("/").length <= 3);
  for (const doc of docs) {
    if (doc in CORE) continue;
    if (!linked.has(doc)) problems.push({ file: doc, message: "nothing links to it: link it from the core or delete it" });
  }
  return problems;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  const problems = checkDocs();
  for (const p of problems) console.log(`${p.file}: ${p.message}`);
  const sizes = Object.keys(CORE)
    .filter((f) => existsSync(join(REPO_ROOT, f)))
    .map((f) => `${f} ~${estimateTokens(readFileSync(join(REPO_ROOT, f), "utf8"))}`);
  console.log(problems.length ? `${problems.length} problem(s).` : `Docs OK. Core: ${sizes.join(", ")} tokens.`);
  process.exitCode = problems.length ? 1 : 0;
}
