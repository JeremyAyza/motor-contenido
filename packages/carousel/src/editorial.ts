import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { REPO_ROOT } from "../../brand/src/index.ts";
import { loadBrief, type Brief } from "./brief.ts";
import { runPythonJson } from "./python.ts";

/** Resultado de hookscore_es.py --json por gancho. */
type HookScore = { hook: string; score: number; verdict: string; weakest: string; flags: string[] };

type Formula = { id: number; name: string; requiere?: string };

function formulas(): Map<number, Formula> {
  const data = JSON.parse(readFileSync(join(REPO_ROOT, "skills/ig-es/ganchos-es.json"), "utf8")) as { hooks: Formula[] };
  return new Map(data.hooks.map((h) => [h.id, h]));
}

/** Corre el filtro de ganchos (hookscore_es.py). Devuelve null si no hay Python. */
export function scoreHooks(dir: string): { scores: HookScore[] | null; error?: string } {
  const { data, error } = runPythonJson<HookScore[]>("skills/ig-es/hookscore_es.py", ["--brief", join(dir, "brief.json"), "--json"]);
  return { scores: data, error };
}

/**
 * Arma la puerta A: el mensaje que la persona aprueba antes de diseñar, y la
 * carpeta para que el crítico ciego ordene los ganchos sin ver los puntajes.
 */
export function puertaA(dir: string): { file: string; text: string; problems: string[] } {
  const load = loadBrief(dir);
  if (load.status === "sin-brief") throw new Error(`No hay brief.json en ${dir}. Créalo con el paso 0 de workflows/carrusel.md.`);
  if (load.status === "invalido") throw new Error(load.errors.join("\n"));
  const { brief, warnings } = load;
  const problems = [...warnings];
  const tema = basename(dir).replace(/^\d{4}-\d{2}-\d{2}-/, "");
  const byId = formulas();
  const { scores, error } = scoreHooks(dir);
  if (!scores) problems.push(`No se pudo puntuar los ganchos: ${error ?? "sin Python"}`);

  const rows = brief.ganchos.map((g) => {
    const s = scores?.find((x) => x.hook === g.texto);
    return { ...g, score: s?.score, verdict: s?.verdict, flags: s?.flags ?? [], weakest: s?.weakest };
  });
  rows.sort((a, b) => Number(a.flags.length > 0) - Number(b.flags.length > 0) || (b.score ?? 0) - (a.score ?? 0));
  const vivos = rows.filter((r) => !r.flags.length && r.verdict !== "WEAK");
  for (const r of rows) {
    const f = byId.get(r.formula);
    if (f?.requiere) problems.push(`El gancho "${r.texto}" usa la fórmula ${f.id} (${f.name}), que requiere ${f.requiere}`);
  }

  const lines: string[] = [];
  lines.push(`# Puerta A: ${tema}`, "");
  lines.push("Apruébalo o corrígelo antes de que se diseñe una sola lámina.", "");
  lines.push(`- **Formato:** ${brief.formato}`);
  lines.push(`- **Tesis:** ${brief.tesis}`);
  if (brief.palanca) lines.push(`- **Palanca de ángulo:** ${brief.palanca}`);
  lines.push(`- **Por qué ahora:** ${brief.porQueAhora}`);
  lines.push(`- **Para quién:** ${brief.paraQuien}`);
  lines.push(`- **Qué gana:** ${brief.queGana}`);
  lines.push(`- **Objetivo:** ${brief.objetivo}`);
  lines.push(`- **Se lo mandaría a:** ${brief.compartirCon}`);
  if (brief.toma) lines.push(`- **Tu toma:** ${brief.toma}`);
  lines.push("", "## Ganchos", "");
  lines.push("El filtro solo descarta los débiles; no elige al ganador. El orden final lo da el crítico ciego y la decisión es tuya.", "");
  lines.push("| # | Gancho | Fórmula | Filtro |", "|---|---|---|---|");
  rows.forEach((r, i) => {
    const f = byId.get(r.formula);
    const filtro = r.score === undefined ? "sin puntaje" : `${r.score} ${r.verdict}${r.flags.length ? ` · descartado: ${r.flags[0]}` : ""}`;
    const texto = r.promesa ? `**${r.texto}**<br>${r.promesa}` : `**${r.texto}**`;
    lines.push(`| ${i + 1} | ${texto} | ${f ? `${f.id} ${f.name}` : r.formula} | ${filtro} |`);
  });
  lines.push("", "## Esqueleto", "");
  brief.esqueleto.forEach((e, i) => lines.push(`${i + 1}. ${e.afirmacion} *(prueba: ${e.prueba})*`));
  lines.push("", "## Cierre", "");
  lines.push(`- **CTA (${brief.cta.tipo}):** ${brief.cta.texto}`);
  if (problems.length) {
    lines.push("", "## Para revisar", "");
    for (const p of problems) lines.push(`- ${p}`);
  }
  lines.push("", "---", "Para aprobar: elige un gancho (o reescríbelo) y di que sí. El agente anota `ganchoElegido` y `puertaA.aprobado: true` en brief.json.");
  const text = lines.join("\n") + "\n";

  const outDir = join(dir, "out");
  mkdirSync(outDir, { recursive: true });
  const file = join(outDir, "puerta-a.md");
  writeFileSync(file, text);
  writeHookCritic(dir, tema, brief, vivos.map((r) => r.texto));
  return { file, text, problems };
}

/** Carpeta del crítico ciego de ganchos: solo el tema, el público y los ganchos, sin puntajes. */
function writeHookCritic(dir: string, tema: string, brief: Brief, ganchos: string[]): void {
  const folder = join(dir, "out", "critica-ganchos");
  mkdirSync(folder, { recursive: true });
  const prompt = readFileSync(join(REPO_ROOT, "docs/critico-ciego.md"), "utf8");
  const seccion = prompt.split(/^## /m).find((s) => s.startsWith("Ganchos"));
  const lista = ganchos.length ? ganchos.map((g, i) => `${i + 1}. ${g}`).join("\n") : "(el filtro descartó todos: vuelve al brief)";
  writeFileSync(
    join(folder, "LEEME.md"),
    `# Crítico ciego: ganchos\n\n${seccion ? `## ${seccion}` : ""}\n## Material\n\n- Tema: ${tema}\n- Público: ${brief.paraQuien}\n\nGanchos que pasaron el filtro:\n\n${lista}\n\nEscribe tu respuesta en \`informe.md\`, en esta misma carpeta.\n`,
  );
}
