import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { REPO_ROOT } from "../../brand/src/index.ts";
import { FORMATOS, OBJETIVOS } from "./brief.ts";

/**
 * Métricas de una pieza publicada (`content/<pieza>/metricas.json`), copiadas de
 * Instagram Insights a las 48 horas y a los 7 días. Los nombres siguen los de
 * Insights en español; confírmalos cuando Instagram los cambie.
 */
const n = z.number().int().min(0);

export const CorteSchema = z.object({
  dia: z.number().int().min(1).max(90).describe("Días desde la publicación (2 y 7 como mínimo)"),
  alcance: n.describe("Cuentas alcanzadas"),
  alcanceNoSeguidores: z.number().min(0).max(100).optional().describe("Porcentaje del alcance que no te sigue"),
  visualizaciones: n.optional(),
  guardados: n,
  compartidos: n.describe("Veces que se compartió o envió por DM"),
  comentarios: n,
  meGusta: n,
  visitasPerfil: n.optional(),
  seguidores: n.optional().describe("Seguidores que llegaron por esta pieza"),
});

export const MetricasSchema = z.object({
  publicado: z.iso.datetime({ offset: true }).describe("Fecha y hora de publicación, con zona horaria"),
  etiquetas: z.object({
    formato: z.enum(FORMATOS).optional(),
    formulaGancho: z.number().int().min(1).max(29).optional().describe("id de skills/ig-es/ganchos-es.json"),
    direccion: z.string().optional(),
    laminas: z.number().int().min(1).max(20).optional(),
    cta: z.enum([...OBJETIVOS, "seguir"]).optional(),
    animadas: z.number().int().min(0).max(20).optional().describe("Láminas que salieron como video (experimento de movimiento)"),
  }),
  cortes: z.array(CorteSchema).min(1),
  notas: z.string().optional(),
});
export type Metricas = z.infer<typeof MetricasSchema>;

type Fila = {
  pieza: string;
  dia: number;
  alcance: number;
  guardados: number;
  compartidos: number;
  seguidores?: number;
  etiquetas: Metricas["etiquetas"];
};

const pct = (a: number, b: number) => (b ? (a / b) * 100 : 0);
const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/** Junta las métricas de todas las piezas y arma el informe (docs/metricas.md). */
export function informeMetricas(): { text: string; file: string; errores: string[] } {
  const root = join(REPO_ROOT, "content");
  const filas: Fila[] = [];
  const errores: string[] = [];
  for (const pieza of existsSync(root) ? readdirSync(root).sort() : []) {
    if (pieza.startsWith("zz-")) continue; // vistas previas locales, igual que en la baraja
    const file = join(root, pieza, "metricas.json");
    if (!existsSync(file)) continue;
    const parsed = MetricasSchema.safeParse(JSON.parse(readFileSync(file, "utf8")));
    if (!parsed.success) {
      errores.push(`${pieza}: ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
      continue;
    }
    const corte = [...parsed.data.cortes].sort((a, b) => Math.abs(a.dia - 7) - Math.abs(b.dia - 7))[0];
    filas.push({ pieza, dia: corte.dia, alcance: corte.alcance, guardados: corte.guardados, compartidos: corte.compartidos, seguidores: corte.seguidores, etiquetas: parsed.data.etiquetas });
  }

  const medAlcance = median(filas.map((f) => f.alcance));
  const medComp = median(filas.map((f) => pct(f.compartidos, f.alcance)));
  const medGuard = median(filas.map((f) => pct(f.guardados, f.alcance)));
  filas.sort((a, b) => pct(b.compartidos, b.alcance) - pct(a.compartidos, a.alcance));

  const lines = [
    "# Métricas del carrusel",
    "",
    "Generado por `npm run carrusel:metricas`. No lo edites a mano: cambia los `metricas.json` de cada pieza.",
    "",
    `${filas.length} pieza(s) con métricas. Se usa el corte más cercano al día 7. Mediana de alcance: ${Math.round(medAlcance)}.`,
    "",
  ];
  if (filas.length < 15) {
    lines.push(`Con ${filas.length} pieza(s) no hay conclusiones todavía: hacen falta al menos 15. Esto es un registro, no un patrón.`, "");
  }
  lines.push(
    "| Pieza | Día | Alcance | x mediana | Compartidos % | Guardados % | Seguidores % | Formato | Fórmula | Dirección | CTA | Animadas |",
    "|---|---|---|---|---|---|---|---|---|---|---|---|",
  );
  for (const f of filas) {
    const mult = medAlcance ? (f.alcance / medAlcance).toFixed(1) : "-";
    const comp = pct(f.compartidos, f.alcance);
    const guard = pct(f.guardados, f.alcance);
    const marca = (v: number, m: number) => `${v.toFixed(2)}${filas.length > 1 && v > m ? " ▲" : ""}`;
    const seg = f.seguidores === undefined ? "-" : pct(f.seguidores, f.alcance).toFixed(2);
    const e = f.etiquetas;
    lines.push(
      `| ${f.pieza} | ${f.dia} | ${f.alcance} | ${mult} | ${marca(comp, medComp)} | ${marca(guard, medGuard)} | ${seg} | ${e.formato ?? "-"} | ${e.formulaGancho ?? "-"} | ${e.direccion ?? "-"} | ${e.cta ?? "-"} | ${e.animadas ?? "-"} |`,
    );
  }
  lines.push(
    "",
    "▲ = por encima de la mediana de la cuenta. Compartidos por alcance es la señal más fuerte; luego guardados y seguidores por alcance.",
    "",
    "Alcance alto con pocos seguidores es un problema del perfil; poco alcance es un problema del gancho (ver workflows/metricas.md).",
  );
  if (errores.length) lines.push("", "## Archivos con errores", "", ...errores.map((e) => `- ${e}`));
  const text = lines.join("\n") + "\n";
  const file = join(REPO_ROOT, "docs", "metricas.md");
  writeFileSync(file, text);
  return { text, file, errores };
}
