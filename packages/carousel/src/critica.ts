import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { REPO_ROOT } from "../../brand/src/index.ts";
import { loadBrief } from "./brief.ts";

/**
 * Prepara out/critica/ para el crítico ciego: solo lo que vería alguien en
 * Instagram (las láminas, la miniatura y el texto del post), sin el código, los
 * datos ni el razonamiento del diseño. El brief va en un archivo aparte que se
 * abre recién en el paso 2.
 */
export function prepararCritica(dir: string): { folder: string; files: string[] } {
  const out = join(dir, "out");
  if (!existsSync(join(out, "01.png"))) throw new Error(`Primero renderiza la pieza: no hay láminas en ${out}`);
  const folder = join(out, "critica");
  rmSync(folder, { recursive: true, force: true });
  mkdirSync(folder, { recursive: true });

  const images = readdirSync(out).filter((f) => /^\d{2}\.png$/.test(f) || f === "pulgar.png" || f === "revision.png");
  for (const f of images) copyFileSync(join(out, f), join(folder, f));
  if (existsSync(join(out, "texto-del-post.txt"))) copyFileSync(join(out, "texto-del-post.txt"), join(folder, "texto-del-post.txt"));

  const prompt = readFileSync(join(REPO_ROOT, "docs/critico-ciego.md"), "utf8");
  const rubrica = readFileSync(join(REPO_ROOT, "docs/critica-carrusel.md"), "utf8");
  const laminas = images.filter((f) => /^\d{2}\.png$/.test(f)).sort();
  writeFileSync(
    join(folder, "LEEME.md"),
    `${prompt}\n\n---\n\n${rubrica}\n\n---\n\n## Material de esta pieza\n\n- Láminas, en orden: ${laminas.join(", ")}\n- Miniatura del perfil: pulgar.png\n- Hoja a tamaño de celular: revision.png\n- Texto del post: texto-del-post.txt\n\nNo abras \`paso-2-brief.md\` hasta terminar el paso 1. Escribe tu informe en \`informe.md\`, en esta carpeta.\n`,
  );

  const load = loadBrief(dir);
  const brief = load.status === "ok" ? load.brief : null;
  writeFileSync(
    join(folder, "paso-2-brief.md"),
    brief
      ? `# Lo que la pieza quería decir\n\n- **Tesis:** ${brief.tesis}\n- **Para quién:** ${brief.paraQuien}\n- **Objetivo:** ${brief.objetivo}\n- **Se lo mandaría a:** ${brief.compartirCon}\n- **CTA:** ${brief.cta.texto}\n\nCompara con tu resumen del paso 1. Si no coinciden, la pieza no pasa.\n`
      : `# Sin brief\n\nEsta pieza es anterior al paso 0 (${basename(dir)}). Juzga la tesis solo con lo que entendiste en el paso 1.\n`,
  );
  return { folder, files: readdirSync(folder) };
}
