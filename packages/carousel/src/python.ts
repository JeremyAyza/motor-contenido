import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { REPO_ROOT } from "../../brand/src/index.ts";

/**
 * Lanzador de Python para las skills de .agents/skills y sus wrappers en
 * skills/ig-es. Busca un intérprete que de verdad funcione: en Windows,
 * `python3` suele ser un acceso directo de la Microsoft Store que no corre nada.
 * Se puede forzar con la variable PYTHON.
 */
const CANDIDATES: [string, string[]][] = [
  ["python", []],
  ["py", ["-3"]],
  ["python3", []],
];

let cached: [string, string[]] | null | undefined;

export function findPython(): [string, string[]] | null {
  if (cached !== undefined) return cached;
  const forced = process.env.PYTHON;
  const list: [string, string[]][] = forced ? [[forced, []], ...CANDIDATES] : CANDIDATES;
  for (const [cmd, pre] of list) {
    const r = spawnSync(cmd, [...pre, "--version"], { encoding: "utf8" });
    if (r.status === 0 && /Python 3\./.test(`${r.stdout}${r.stderr}`)) return (cached = [cmd, pre]);
  }
  return (cached = null);
}

export type PyResult = { ok: boolean; status: number | null; stdout: string; stderr: string };

/** Corre un script de Python con rutas relativas a la raíz del repo. */
export function runPython(script: string, args: string[] = [], input?: string): PyResult {
  const py = findPython();
  if (!py) return { ok: false, status: null, stdout: "", stderr: "No encontré Python 3 (prueba con la variable PYTHON)." };
  const r = spawnSync(py[0], [...py[1], join(REPO_ROOT, script), ...args], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    input,
    env: { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" },
  });
  return { ok: r.status === 0, status: r.status, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

/** Igual que runPython, pero devuelve el JSON que imprime el script (o null). */
export function runPythonJson<T>(script: string, args: string[] = [], input?: string): { data: T | null; error?: string } {
  const r = runPython(script, args, input);
  if (r.status === null) return { data: null, error: r.stderr };
  try {
    return { data: JSON.parse(r.stdout) as T };
  } catch {
    return { data: null, error: (r.stderr || r.stdout).trim().split("\n").slice(-3).join(" ") };
  }
}

// `npm run py -- skills/ig-es/hookscore_es.py --hook "..."` corre cualquier script con el intérprete encontrado.
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const [script, ...args] = process.argv.slice(2).filter((a, i) => !(i === 0 && a === "--"));
  if (!script) {
    console.log("Uso: npm run py -- <script.py> [argumentos]");
    process.exit(1);
  }
  const py = findPython();
  if (!py) {
    console.error("No encontré Python 3. Instálalo o define la variable PYTHON.");
    process.exit(1);
  }
  const r = spawnSync(py[0], [...py[1], script, ...args], {
    stdio: "inherit",
    env: { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" },
  });
  process.exit(r.status ?? 1);
}
