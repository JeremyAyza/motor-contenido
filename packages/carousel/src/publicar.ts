import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import type { Manifest } from "../../publisher/src/index.ts";
import { PostSchema } from "./post.ts";

/**
 * Arma la publicación de una pieza para packages/publisher. Exige la puerta B
 * y las láminas del último render, posteriores al último cambio de slides.tsx.
 * Deja el manifiesto en out/publication.json: las láminas en orden y el texto
 * del post de post.json.
 */
export function prepararPublicacion(dir: string): { manifest: Manifest; file: string } {
  const pieza = basename(dir);
  const post = PostSchema.parse(JSON.parse(readFileSync(join(dir, "post.json"), "utf8")));
  const problemas: string[] = [];
  if (!post.puertaB.aprobado) {
    problemas.push("La puerta B no está aprobada: muéstrale la pieza a la persona y anota su sí en post.json → puertaB (workflows/carrusel.md, paso 13)");
  }

  const outDir = join(dir, "out");
  const textos = join(outDir, "texto-de-laminas.txt");
  if (!existsSync(textos)) throw new Error(`No se puede publicar ${pieza}: no hay render. Corre carrusel:render`);
  // El render escribe un bloque por lámina y no borra los PNG de renders con más láminas.
  const total = readFileSync(textos, "utf8").match(/^--- Lámina \d+/gm)?.length ?? 0;
  if (!total) problemas.push("out/texto-de-laminas.txt no tiene láminas: corre carrusel:render");
  const media = Array.from({ length: total }, (_, i) => join(outDir, `${String(i + 1).padStart(2, "0")}.png`));
  const faltan = media.filter((f) => !existsSync(f));
  if (faltan.length) problemas.push(`Faltan ${faltan.map((f) => basename(f)).join(", ")}: corre carrusel:render`);
  const slides = join(dir, "slides.tsx");
  const cambio = existsSync(slides) ? statSync(slides).mtimeMs : 0;
  const viejas = media.filter((f) => existsSync(f) && statSync(f).mtimeMs < cambio);
  if (viejas.length) {
    problemas.push(`${viejas.map((f) => basename(f)).join(", ")} son anteriores al último cambio de slides.tsx: corre carrusel:render y vuelve a pedir la puerta B`);
  }
  if (problemas.length) throw new Error(`No se puede publicar ${pieza}:\n- ${problemas.join("\n- ")}`);

  const manifest: Manifest = { id: pieza, account: post.account, caption: post.caption, media };
  const file = join(outDir, "publication.json");
  writeFileSync(file, JSON.stringify({ ...manifest, media: media.map((f) => basename(f)) }, null, 2) + "\n");
  return { manifest, file };
}
