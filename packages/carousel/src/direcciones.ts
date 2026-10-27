import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT, type FontId } from "../../brand/src/index.ts";

/** Una dirección de arte de la baraja (skills/carrusel-taste/direcciones.json). */
export type Direccion = {
  id: string;
  nombre: string;
  idea: string;
  cuando: string;
  portada: string;
  interior: string;
  tipografias: FontId[];
  paleta: string;
  evitar: string;
  requiere?: "avatar";
};

export const DIRECCIONES_PATH = join(REPO_ROOT, "skills/carrusel-taste/direcciones.json");

export const DIRECCIONES: Direccion[] = JSON.parse(readFileSync(DIRECCIONES_PATH, "utf8"));
export const DIRECCION_IDS = DIRECCIONES.map((d) => d.id) as [string, ...string[]];

/**
 * Una dirección con requisitos (el avatar) solo entra a la baraja cuando existen.
 * El busto de los videos (base, bocas y parpadeo) no alcanza: "personaje"
 * cambia de pose por lámina, así que pide `poses` en el manifiesto.
 */
export function disponible(d: Direccion): boolean {
  if (d.requiere === "avatar") return avatarConPoses(join(REPO_ROOT, "assets/avatar/manifest.json"));
  return true;
}

export function avatarConPoses(manifiesto: string): boolean {
  if (!existsSync(manifiesto)) return false;
  try {
    const { poses } = JSON.parse(readFileSync(manifiesto, "utf8"));
    return typeof poses === "object" && poses !== null && Object.keys(poses).length > 0;
  } catch {
    return false;
  }
}

/**
 * Direcciones usadas por una cuenta, de la pieza más reciente a la más antigua.
 * Sale de las carpetas de content/ (que empiezan con la fecha), así que no hay
 * un archivo de historial que mantener.
 */
export function historial(account: string, excluir?: string): { pieza: string; direccion: string }[] {
  const root = join(REPO_ROOT, "content");
  if (!existsSync(root)) return [];
  const out: { pieza: string; direccion: string }[] = [];
  for (const pieza of readdirSync(root).sort().reverse()) {
    if (pieza === excluir || pieza.startsWith("zz-")) continue;
    const file = join(root, pieza, "post.json");
    if (!existsSync(file)) continue;
    try {
      const post = JSON.parse(readFileSync(file, "utf8"));
      if (post.account === account && typeof post.art?.direction === "string" && post.art.direction) {
        out.push({ pieza, direccion: post.art.direction });
      }
    } catch {
      // Un post.json a medio escribir no rompe la baraja.
    }
  }
  return out;
}

/**
 * Reparte `n` direcciones al azar. Quedan fuera las dos últimas que usó la
 * cuenta, para que el feed no repita estilo dos veces seguidas. El video pasa
 * las suyas en `recientes`, para que tampoco se repitan en la pestaña de Reels.
 */
export function repartir(
  account: string,
  n = 3,
  excluir?: string,
  recientes = historial(account, excluir)
    .slice(0, 2)
    .map((h) => h.direccion),
): { mano: Direccion[]; recientes: string[] } {
  const mazo = DIRECCIONES.filter((d) => disponible(d) && !recientes.includes(d.id));
  for (let i = mazo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
  }
  return { mano: mazo.slice(0, n), recientes };
}
