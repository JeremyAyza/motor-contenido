import { existsSync, readFileSync } from "node:fs";
import { extname, isAbsolute, join } from "node:path";
import { REPO_ROOT } from "../../../brand/src/index.ts";
import { cachedFile, loadCatalog } from "../../../media/src/catalog.ts";
import type { AssetSource, SimpleIconData } from "./assets.ts";

let SIMPLE_ICONS: Omit<SimpleIconData, "path">[] | null = null;

/** Metadatos de un ícono de Simple Icons por su slug. */
export function simpleIcon(slug: string): SimpleIconData {
  SIMPLE_ICONS ??= JSON.parse(readFileSync(join(REPO_ROOT, "node_modules/simple-icons/data/simple-icons.json"), "utf8")) as Omit<SimpleIconData, "path">[];
  const meta = SIMPLE_ICONS.find((i) => i.slug === slug);
  if (!meta) throw new Error(`No existe "${slug}" en Simple Icons ni en el catálogo de logos. Búscalo con: npm run carrusel:logo -- <marca>, o agrega el oficial con: npm run carrusel:logo -- add ${slug} --url <svg> --title <marca> --source <página> --author <dueño>`);
  const svg = readFileSync(join(REPO_ROOT, "node_modules/simple-icons/icons", `${slug}.svg`), "utf8");
  const path = svg.match(/ d="([^"]+)"/)?.[1];
  if (!path) throw new Error(`El SVG de ${slug} no tiene un path simple`);
  return { ...meta, path };
}

/** El contenido de un ícono de Lucide, sin la etiqueta <svg>. */
function lucide(name: string): string {
  const file = join(REPO_ROOT, "node_modules/lucide-static/icons", `${name}.svg`);
  if (!existsSync(file)) throw new Error(`No existe el ícono "${name}" en Lucide. Revisa los nombres en https://lucide.dev/icons`);
  return readFileSync(file, "utf8").replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
}

const MIME: Record<string, string> = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml" };

const OBJETOS_DIR = join(REPO_ROOT, "assets/objetos");
export const CATALOG_PATH = join(REPO_ROOT, "assets/catalog.json");
export const ASSET_CACHE = join(REPO_ROOT, ".cache/assets");

/** Un logo oficial del catálogo (regla 6), como data URL. El render lo baja antes con fetchLogos. */
function brandLogo(slug: string): { title: string; url: string } | null {
  const asset = loadCatalog(CATALOG_PATH).assets.find((a) => a.type === "logo" && a.id === slug);
  if (!asset) return null;
  const file = cachedFile(asset, ASSET_CACHE);
  if (!existsSync(file)) throw new Error(`El logo "${slug}" está en el catálogo pero no en .cache/assets: vuelve a correr el render, que lo baja`);
  const mime = MIME[extname(file).toLowerCase()];
  if (!mime) throw new Error(`Formato de logo no soportado: ${file}`);
  return { title: asset.title ?? slug, url: `data:${mime};base64,${readFileSync(file).toString("base64")}` };
}

function object(nombre: string, estilo: "color" | "3d"): string {
  const archivo = join(OBJETOS_DIR, estilo === "3d" ? `${nombre}.3d.png` : `${nombre}.svg`);
  if (!existsSync(archivo)) {
    throw new Error(`No está el objeto "${nombre}" (${estilo}) en assets/objetos. Búscalo y bájalo con: npm run carrusel:objeto -- ${nombre}${estilo === "3d" ? " --3d" : ""}`);
  }
  const mime = estilo === "3d" ? "image/png" : "image/svg+xml";
  return `data:${mime};base64,${readFileSync(archivo).toString("base64")}`;
}

/**
 * The disk, for the carousel render. Files become data URLs so the slide HTML
 * is self-contained; images resolve against the piece folder.
 */
export function nodeAssets(pieceDir: string): AssetSource {
  return {
    lucide,
    simpleIcon,
    brandLogo,
    object,
    image(src) {
      const path = isAbsolute(src) ? src : join(pieceDir, src);
      const mime = MIME[extname(path).toLowerCase()];
      if (!mime) throw new Error(`Formato de imagen no soportado: ${src}`);
      return `data:${mime};base64,${readFileSync(path).toString("base64")}`;
    },
  };
}
