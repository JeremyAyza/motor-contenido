import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { REPO_ROOT } from "../../brand/src/index.ts";

/**
 * Objetos de Fluent Emoji (Microsoft, MIT) para las metáforas visuales. Solo se
 * bajan los que se usan, del repositorio oficial a assets/objetos/; el índice
 * de nombres queda en caché en node_modules/.cache. Los nombres son los del
 * repositorio, en inglés ("backpack", "light bulb", "brain").
 */
const REPO = "microsoft/fluentui-emoji";
const RAW = `https://raw.githubusercontent.com/${REPO}/main/`;
export const OBJETOS_DIR = join(REPO_ROOT, "assets/objetos");
const CACHE = join(REPO_ROOT, "node_modules/.cache/motor/fluent-emoji.json");
const LICENCIA = join(OBJETOS_DIR, "LICENSE-fluent-emoji.txt");

export type EntradaObjeto = { nombre: string; slug: string; color?: string; tresD?: string };

export const slugObjeto = (nombre: string) =>
  nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function indice(): Promise<EntradaObjeto[]> {
  if (existsSync(CACHE)) return JSON.parse(readFileSync(CACHE, "utf8")) as EntradaObjeto[];
  const res = await fetch(`https://api.github.com/repos/${REPO}/git/trees/main?recursive=1`, { headers: { "User-Agent": "motor-contenido" } });
  if (!res.ok) throw new Error(`No pude leer el índice de Fluent Emoji (HTTP ${res.status})`);
  const { tree } = (await res.json()) as { tree: { path: string }[] };
  const porNombre = new Map<string, EntradaObjeto>();
  // Las personas tienen variantes de tono de piel; se usa la Default.
  for (const { path } of tree) {
    const m = path.match(/^assets\/([^/]+)\/(?:Default\/)?(Color|3D)\/[^/]+\.(svg|png)$/);
    if (!m) continue;
    const entrada = porNombre.get(m[1]) ?? { nombre: m[1], slug: slugObjeto(m[1]) };
    if (m[2] === "Color" && m[3] === "svg") entrada.color ??= path;
    if (m[2] === "3D" && m[3] === "png") entrada.tresD ??= path;
    porNombre.set(m[1], entrada);
  }
  const lista = [...porNombre.values()];
  mkdirSync(dirname(CACHE), { recursive: true });
  writeFileSync(CACHE, JSON.stringify(lista));
  return lista;
}

/** Objetos cuyo nombre contiene la búsqueda (hasta 20). */
export async function buscarObjetos(busqueda: string): Promise<EntradaObjeto[]> {
  const q = slugObjeto(busqueda);
  return (await indice()).filter((e) => e.slug.includes(q)).slice(0, 20);
}

async function bajar(path: string): Promise<Buffer> {
  const res = await fetch(RAW + path.split("/").map(encodeURIComponent).join("/"));
  if (!res.ok) throw new Error(`No pude bajar ${path} (HTTP ${res.status})`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Baja un objeto por su nombre exacto a assets/objetos/<slug>.svg (o
 * <slug>.3d.png) y deja la licencia MIT de Fluent Emoji junto a los archivos.
 * Devuelve null si el nombre no existe.
 */
export async function bajarObjeto(nombre: string, estilo: "color" | "3d" = "color"): Promise<{ archivo: string; slug: string } | null> {
  const slug = slugObjeto(nombre);
  const entrada = (await indice()).find((e) => e.slug === slug);
  const path = entrada ? (estilo === "3d" ? entrada.tresD : entrada.color) : undefined;
  if (!entrada || !path) return null;
  mkdirSync(OBJETOS_DIR, { recursive: true });
  const archivo = join(OBJETOS_DIR, estilo === "3d" ? `${slug}.3d.png` : `${slug}.svg`);
  writeFileSync(archivo, await bajar(path));
  if (!existsSync(LICENCIA)) writeFileSync(LICENCIA, await bajar("LICENSE"));
  return { archivo, slug };
}
