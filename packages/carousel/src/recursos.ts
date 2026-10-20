import { readFileSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT } from "../../brand/src/index.ts";

/**
 * Catálogo de recursos visuales (skills/carrusel-taste/recursos.json): lo que
 * se ve en cada lámina interior. Se elige en el esqueleto del brief y se dibuja
 * con las primitivas de @motor/ui.
 */
export type Recurso = { id: string; nombre: string; como: string; cuando: string; primitivas: string[]; ejemplo: string };

const CATALOGO = JSON.parse(readFileSync(join(REPO_ROOT, "skills/carrusel-taste/recursos.json"), "utf8")) as { recursos: Recurso[] };
export const RECURSOS = CATALOGO.recursos;
export const RECURSO_IDS = RECURSOS.map((r) => r.id) as [string, ...string[]];

export const nombreRecurso = (id: string) => RECURSOS.find((r) => r.id === id)?.nombre ?? id;
