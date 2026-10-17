import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Brief } from "./brief.ts";
import { findPython, runPython, runPythonJson } from "./python.ts";
import type { Issue } from "./render.tsx";

/**
 * Revisión de textos con las skills de .agents/skills (vía los wrappers en
 * español de skills/ig-es): el texto del post con ig-caption, y el texto del
 * post y de las láminas con ig-human. Escribe out/revision-texto.txt.
 */
type CaptionCheck = { check: string; status: "PASS" | "WARN" | "FAIL"; detail: string };
type CaptionReport = { verdict: string; asks: string[]; checks: CaptionCheck[] };
/** Salida JSON de humanize.py original: {text, report}. */
type HumanizeReport = {
  text: string;
  report: {
    typographic: { name: string; count: number }[];
    lexical: { find: string; replace: string; count: number }[];
    structures: { name: string; count: number; fix: string }[];
  };
};
type DetectReport = { human_score: number; verdict: string; checks: Record<string, { score: number; detail: string }> };

const ASK_POR_TIPO: Record<Brief["cta"]["tipo"], string[]> = {
  guardar: ["guardar"],
  enviar: ["enviar o compartir"],
  comentar: ["comentar una palabra", "responder una pregunta"],
  seguir: ["seguir"],
};

export function revisarTextos(opts: {
  outDir: string;
  captionFile: string;
  slideTexts: string[];
  brief: Brief | null;
  busqueda?: string[];
}): Issue[] {
  const issues: Issue[] = [];
  const where = "texto del post";
  if (!findPython()) {
    issues.push({ level: "aviso", where, message: "Sin Python: no se revisaron el texto del post ni las estructuras (skills/ig-es)" });
    return issues;
  }
  const report: string[] = [];
  const kw = opts.busqueda?.length ? ["--keywords", opts.busqueda.join(",")] : [];

  // 1. ig-caption: los 125 caracteres visibles, hashtags, una sola petición.
  const cap = runPythonJson<CaptionReport>("skills/ig-es/caption_es.py", [opts.captionFile, "--json", ...kw]);
  if (cap.data) {
    for (const c of cap.data.checks) {
      if (c.status === "PASS") continue;
      issues.push({ level: c.status === "FAIL" ? "error" : "aviso", where, message: `${c.check}: ${c.detail}` });
    }
    if (opts.brief && cap.data.asks.length === 1) {
      const esperado = ASK_POR_TIPO[opts.brief.cta.tipo];
      if (!esperado.includes(cap.data.asks[0])) {
        issues.push({
          level: "aviso",
          where,
          message: `La petición del texto ("${cap.data.asks[0]}") no es la del CTA del brief (${opts.brief.cta.tipo}): tiene que ser la misma`,
        });
      }
    }
  } else {
    issues.push({ level: "aviso", where, message: `No se pudo correr caption_es.py: ${cap.error}` });
  }
  report.push(runPython("skills/ig-es/caption_es.py", [opts.captionFile, ...kw]).stdout.trim());

  // 2. ig-human sobre el texto del post: relleno, tipografía y estructuras.
  const hum = runPythonJson<HumanizeReport>("skills/ig-es/humanize_es.py", [opts.captionFile, "--json"]);
  if (hum.data) {
    for (const t of hum.data.report.typographic) issues.push({ level: "aviso", where, message: `Tipografía de máquina: ${t.name} (${t.count})` });
    for (const l of hum.data.report.lexical) {
      issues.push({ level: "aviso", where, message: `Relleno: "${l.find}" → ${l.replace || "(borrar)"}` });
    }
    for (const s of hum.data.report.structures) issues.push({ level: "aviso", where, message: `${s.name}. ${s.fix}` });
  } else {
    issues.push({ level: "aviso", where, message: `No se pudo correr humanize_es.py: ${hum.error}` });
  }
  report.push(runPython("skills/ig-es/humanize_es.py", [opts.captionFile, "--report"]).stderr.trim());

  // 3. ig-human sobre las láminas: solo estructuras (el relleno lo mide el inspector).
  const slidesFile = join(opts.outDir, ".build", "texto-laminas-plano.txt");
  writeFileSync(slidesFile, opts.slideTexts.join("\n\n") + "\n");
  const humSlides = runPythonJson<HumanizeReport>("skills/ig-es/humanize_es.py", [slidesFile, "--json"]);
  for (const s of humSlides.data?.report.structures ?? []) {
    if (s.name.startsWith("Palabra o frase de relleno")) continue;
    issues.push({ level: "aviso", where: "láminas", message: `${s.name}. ${s.fix}` });
  }

  // 4. Panel de detección sobre el texto del post.
  const det = runPythonJson<DetectReport>("skills/ig-es/detect_es.py", [opts.captionFile, "--json"]);
  if (det.data && det.data.verdict !== "PASS") {
    const weakest = Object.entries(det.data.checks).sort((a, b) => a[1].score - b[1].score)[0];
    issues.push({
      level: "aviso",
      where,
      message: `Suena a máquina: ${det.data.human_score}/100 (${det.data.verdict}); lo más débil es ${weakest[0]}: ${weakest[1].detail}`,
    });
  }
  report.push(runPython("skills/ig-es/detect_es.py", [opts.captionFile]).stdout.trim());

  writeFileSync(join(opts.outDir, "revision-texto.txt"), report.filter(Boolean).join("\n\n") + "\n");
  return issues;
}
