import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { REPO_ROOT } from "../../brand/src/index.ts";

/**
 * Catálogo del cierre (skills/carrusel-taste/cierres.json): jugadas de
 * despedida y formas de CTA (van en brief.json) y tratamientos visuales del
 * CTA (van en post.json → art.cierre).
 */
export type Jugada = { id: string; nombre: string; como: string; ejemplo: string };
export type FormaCta = Jugada & { tipo: string };
export type Tratamiento = { id: string; nombre: string; como: string; cuando: string; conGesto: boolean };

const CATALOGO = JSON.parse(readFileSync(join(REPO_ROOT, "skills/carrusel-taste/cierres.json"), "utf8")) as {
  despedidas: Jugada[];
  ctas: FormaCta[];
  tratamientos: Tratamiento[];
};
export const JUGADAS = CATALOGO.despedidas;
export const FORMAS_CTA = CATALOGO.ctas;
export const TRATAMIENTOS = CATALOGO.tratamientos;
export const JUGADA_IDS = JUGADAS.map((j) => j.id) as [string, ...string[]];
export const FORMA_CTA_IDS = FORMAS_CTA.map((f) => f.id) as [string, ...string[]];
export const TRATAMIENTO_IDS = TRATAMIENTOS.map((t) => t.id) as [string, ...string[]];

// Los gestos viven aparte porque las primitivas los usan también en el navegador (video).
export { GESTOS, GESTO_IDS, GESTO_DE_TIPO, type Gesto } from "./gestos.ts";

/**
 * Tratamientos visuales del CTA de las piezas anteriores de la cuenta, de la
 * más reciente a la más antigua (post.json → art.cierre).
 */
export function historialTratamientos(account: string, excluir?: string): { pieza: string; tratamiento: string; gesto?: string }[] {
  const root = join(REPO_ROOT, "content");
  if (!existsSync(root)) return [];
  const out: { pieza: string; tratamiento: string; gesto?: string }[] = [];
  for (const pieza of readdirSync(root).sort().reverse()) {
    if (pieza === excluir || pieza.startsWith("zz-")) continue;
    const file = join(root, pieza, "post.json");
    if (!existsSync(file)) continue;
    try {
      const post = JSON.parse(readFileSync(file, "utf8"));
      const t = post.art?.cierre?.tratamiento;
      if (post.account === account && typeof t === "string" && t) out.push({ pieza, tratamiento: t, gesto: post.art.cierre.gesto });
    } catch {
      // Un post.json a medio escribir no rompe el historial.
    }
  }
  return out;
}

/** Un cierre ya usado por la cuenta. */
export type CierreUsado = { pieza: string; jugada?: string; despedida?: string; tipo?: string; forma?: string; cta?: string };

/**
 * Cierres de las piezas anteriores de la cuenta, de la más reciente a la más
 * antigua. Sale de los brief.json de content/, igual que la baraja sale de los
 * post.json; las piezas sin brief no cuentan.
 */
export function historialCierres(account: string, excluir?: string): CierreUsado[] {
  const root = join(REPO_ROOT, "content");
  if (!existsSync(root)) return [];
  const out: CierreUsado[] = [];
  for (const pieza of readdirSync(root).sort().reverse()) {
    if (pieza === excluir || pieza.startsWith("zz-")) continue;
    const postFile = join(root, pieza, "post.json");
    const briefFile = join(root, pieza, "brief.json");
    if (!existsSync(postFile) || !existsSync(briefFile)) continue;
    try {
      if (JSON.parse(readFileSync(postFile, "utf8")).account !== account) continue;
      const b = JSON.parse(readFileSync(briefFile, "utf8"));
      if (!b?.cta?.texto) continue;
      out.push({ pieza, jugada: b.despedida?.jugada, despedida: b.despedida?.texto, tipo: b.cta.tipo, forma: b.cta.forma, cta: b.cta.texto });
    } catch {
      // Un archivo a medio escribir no rompe el historial.
    }
  }
  return out;
}

const primeras = (s: string, n: number) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, n)
    .join(" ");

/**
 * Avisos por repetir el cierre: la misma jugada o la misma forma de CTA que una
 * de las dos piezas anteriores, el mismo arranque que la anterior, o el mismo
 * tipo de CTA tres veces seguidas.
 */
export function repeticionesCierre(
  dir: string,
  cierre: { jugada: string; despedida: string; tipo: string; forma: string; cta: string },
): { recientes: CierreUsado[]; avisos: string[] } {
  const postFile = join(dir, "post.json");
  const account = existsSync(postFile) ? JSON.parse(readFileSync(postFile, "utf8")).account : undefined;
  if (!account) return { recientes: [], avisos: [] };
  const recientes = historialCierres(account, basename(dir)).slice(0, 3);
  const dos = recientes.slice(0, 2);
  const avisos: string[] = [];
  const nombreJugada = (id: string) => JUGADAS.find((j) => j.id === id)?.nombre ?? id;
  const nombreForma = (id: string) => FORMAS_CTA.find((f) => f.id === id)?.nombre ?? id;

  const conJugada = dos.find((r) => r.jugada === cierre.jugada);
  if (conJugada) avisos.push(`La despedida repite la jugada "${nombreJugada(cierre.jugada)}" de ${conJugada.pieza}: elige otra de skills/carrusel-taste/cierres.json`);
  const conForma = dos.find((r) => r.forma === cierre.forma);
  if (conForma) avisos.push(`El CTA repite la forma "${nombreForma(cierre.forma)}" de ${conForma.pieza}: elige otra de skills/carrusel-taste/cierres.json`);
  const anterior = recientes[0];
  if (anterior?.cta && primeras(anterior.cta, 2) === primeras(cierre.cta, 2)) {
    avisos.push(`El CTA arranca igual que el de ${anterior.pieza} ("${anterior.cta}")`);
  }
  if (anterior?.despedida && primeras(anterior.despedida, 2) === primeras(cierre.despedida, 2)) {
    avisos.push(`La despedida arranca igual que la de ${anterior.pieza} ("${anterior.despedida}")`);
  }
  if (dos.length === 2 && dos.every((r) => r.tipo === cierre.tipo)) {
    avisos.push(`Es el tercer cierre seguido que pide ${cierre.tipo}: alterna con otro objetivo si el tema lo permite`);
  }
  return { recientes, avisos };
}
