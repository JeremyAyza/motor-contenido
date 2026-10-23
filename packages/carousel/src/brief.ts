import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { FORMA_CTA_IDS, FORMAS_CTA, JUGADA_IDS } from "./cierres.ts";
import { nombreRecurso, RECURSO_IDS } from "./recursos.ts";

/**
 * Brief editorial (`brief.json`): el paso 0 del carrusel. Se escribe antes que
 * post.json y slides.tsx, y es lo que la persona aprueba en la puerta A.
 */
export const FORMATOS = ["noticia", "ensenar", "comparativa", "error-comun", "opinion", "herramienta"] as const;
export const OBJETIVOS = ["guardar", "enviar", "comentar"] as const;
export const PALANCAS = ["que-cambia", "oficial-vs-independiente", "cuentas-hechas", "letra-chica", "para-quien-no"] as const;

export const GanchoSchema = z.object({
  texto: z.string().trim().min(3).max(120).describe("Texto de la portada; lo ideal son 3 a 8 palabras"),
  promesa: z.string().trim().max(140).optional().describe("Línea de promesa debajo del gancho"),
  formula: z.number().int().min(1).max(30).describe("id de skills/ig-es/ganchos-es.json"),
});

export const CtaSchema = z
  .object({
    tipo: z.enum([...OBJETIVOS, "seguir"]).describe("La única acción que pide el cierre"),
    forma: z.enum(FORMA_CTA_IDS).describe("Forma del CTA, de skills/carrusel-taste/cierres.json; tiene que ser de su mismo tipo"),
    texto: z
      .string()
      .trim()
      .min(8)
      .max(160)
      .describe("Específico del tema: nombra la situación o la persona concreta, no 'compártelo con quien lo necesite'"),
  })
  .refine((c) => FORMAS_CTA.find((f) => f.id === c.forma)?.tipo === c.tipo, {
    message: "La forma del CTA es de otro tipo (skills/carrusel-taste/cierres.json)",
    path: ["forma"],
  });

export const VisualSchema = z.object({
  recurso: z.enum(RECURSO_IDS).describe("El recurso visual de la lámina (skills/carrusel-taste/recursos.json)"),
  que: z
    .string()
    .trim()
    .min(10)
    .max(220)
    .describe("Qué se ve, concreto: 'una mochila con tres objetos rotulados', no 'un diagrama'"),
});

export const EntradaSchema = z.object({
  afirmacion: z.string().trim().min(5),
  prueba: z.string().trim().min(3),
  visual: VisualSchema.optional().describe("Obligatorio en las láminas interiores: lo que se ve, aprobado en la puerta A"),
});

export const DespedidaSchema = z.object({
  jugada: z.enum(JUGADA_IDS).describe("Cómo cierra la última lámina lo que abrió la portada (skills/carrusel-taste/cierres.json)"),
  texto: z.string().trim().min(3).max(120).describe("La frase de despedida de la última lámina, encima del CTA"),
});

export const BriefSchema = z.object({
  formato: z.enum(FORMATOS),
  tesis: z
    .string()
    .trim()
    .min(20)
    .max(240)
    .describe("Una frase con la que alguien podría no estar de acuerdo, o que da una lectura que el anuncio no da"),
  palanca: z
    .enum(PALANCAS)
    .optional()
    .describe("La palanca de ángulo usada si la tesis no pasaba la prueba del competidor editorial"),
  porQueAhora: z.string().trim().min(10),
  paraQuien: z.string().trim().min(10).describe("Público específico, no 'devs'"),
  queGana: z.string().trim().min(10).describe("Qué se lleva el lector: aprende a..., decide..., evita..."),
  objetivo: z.enum(OBJETIVOS),
  compartirCon: z.string().trim().min(10).describe("A quién se lo mandaría el lector, con su situación concreta"),
  toma: z.string().trim().optional().describe("La opinión de la persona, si la hay (docs/voz.md, posturas)"),
  ganchos: z.array(GanchoSchema).min(8).max(12).describe("De 8 a 10 candidatos de al menos 4 fórmulas distintas"),
  ganchoElegido: z.string().trim().optional().describe("El gancho que eligió la persona en la puerta A"),
  esqueleto: z
    .array(EntradaSchema)
    .min(5)
    .max(10)
    .describe("Una entrada por lámina: la afirmación, su prueba (un dato de facts.json o del inventario) y, en las interiores, el recurso visual"),
  despedida: DespedidaSchema,
  cta: CtaSchema,
  ctaAlternativas: z
    .array(CtaSchema)
    .max(3)
    .optional()
    .describe("Otros CTA de formas distintas, para que la persona pueda cambiarlo en la puerta A"),
  puertaA: z
    .object({
      aprobado: z.boolean(),
      fecha: z.iso.date().optional(),
      notas: z.string().trim().optional(),
    })
    .default({ aprobado: false })
    .describe("Solo la persona aprueba. El agente marca aprobado: true después de su sí en el chat"),
});
export type Brief = z.infer<typeof BriefSchema>;

export type BriefLoad =
  | { status: "sin-brief" }
  | { status: "invalido"; errors: string[] }
  | { status: "ok"; brief: Brief; warnings: string[] };

/** Lee y valida brief.json, con avisos que el esquema no puede expresar. */
export function loadBrief(dir: string): BriefLoad {
  const path = join(dir, "brief.json");
  if (!existsSync(path)) return { status: "sin-brief" };
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    return { status: "invalido", errors: [`brief.json no es JSON válido: ${(e as Error).message}`] };
  }
  const parsed = BriefSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "invalido",
      errors: parsed.error.issues.map((i) => `brief.json → ${i.path.join(".") || "(raíz)"}: ${i.message}`),
    };
  }
  const brief = parsed.data;
  const warnings: string[] = [];
  const formulas = new Set(brief.ganchos.map((g) => g.formula));
  if (formulas.size < 4) warnings.push(`Los ganchos usan ${formulas.size} fórmula(s); pide al menos 4 distintas`);
  if (brief.ganchoElegido && !brief.ganchos.some((g) => g.texto === brief.ganchoElegido)) {
    warnings.push("ganchoElegido no coincide con ningún gancho de la lista (está bien si la persona lo reescribió)");
  }
  if (brief.puertaA.aprobado && !brief.ganchoElegido) warnings.push("La puerta A está aprobada pero no hay ganchoElegido");
  if (brief.ctaAlternativas?.some((c) => c.forma === brief.cta.forma)) {
    warnings.push("ctaAlternativas repite la forma del CTA elegido: las alternativas son de formas distintas");
  }
  warnings.push(...revisarVisuales(brief));
  return { status: "ok", brief, warnings };
}

/**
 * Los recursos visuales del esqueleto: cada lámina interior lleva uno (la
 * portada tiene el ancla y el cierre su tratamiento), y no todas el mismo.
 */
export function revisarVisuales(brief: Brief): string[] {
  const interiores = brief.esqueleto.slice(1, -1).map((e, i) => ({ numero: i + 2, visual: e.visual }));
  const avisos: string[] = [];
  const sinVisual = interiores.filter((e) => !e.visual).map((e) => e.numero);
  if (sinVisual.length) {
    const lista = sinVisual.length === 1 ? `${sinVisual[0]}` : `${sinVisual.slice(0, -1).join(", ")} y ${sinVisual[sinVisual.length - 1]}`;
    avisos.push(
      `${sinVisual.length === 1 ? "La lámina" : "Las láminas"} ${lista} del esqueleto no ${sinVisual.length === 1 ? "tiene" : "tienen"} visual: elige un recurso de skills/carrusel-taste/recursos.json y describe qué se ve`,
    );
  }
  const usados = interiores.flatMap((e) => (e.visual ? [e.visual.recurso] : []));
  const conteo = new Map<string, number>();
  for (const r of usados) conteo.set(r, (conteo.get(r) ?? 0) + 1);
  for (const [recurso, veces] of conteo) {
    if (usados.length >= 3 && veces > usados.length / 2) {
      avisos.push(`"${nombreRecurso(recurso)}" está en ${veces} de ${usados.length} láminas interiores: alterna con otro recurso para que no se vean iguales`);
    }
  }
  return avisos;
}
