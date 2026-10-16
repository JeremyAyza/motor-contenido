import { z } from "zod";

/**
 * Datos del post que acompañan al diseño (`post.json`).
 * El diseño de cada lámina es libre y vive en `slides.tsx`; aquí solo va
 * lo que Instagram y la revisión humana necesitan.
 */
export const SourceSchema = z.object({
  title: z.string().trim().min(1).max(200),
  url: z.url(),
  checkedAt: z.iso.date(),
});

export const PostSchema = z.object({
  account: z.string().min(1).describe("Id de la cuenta en accounts/*.json"),
  topic: z.string().trim().min(1).max(120),
  infoDate: z.iso.date().describe("Fecha a la que corresponde la información"),
  idea: z
    .string()
    .trim()
    .min(10)
    .describe("La idea propia de esta pieza: 'En este carrusel, [algo del tema] se vuelve [recurso visual]'"),
  caption: z.string().trim().min(1).max(2200).describe("Texto principal del post"),
  slideCaptions: z
    .array(z.string().trim().min(1).max(500))
    .optional()
    .describe("Un texto por lámina (opción de Instagram desde junio de 2026)"),
  sources: z.array(SourceSchema).min(1, "Toda pieza necesita al menos una fuente"),
});
export type Post = z.infer<typeof PostSchema>;
