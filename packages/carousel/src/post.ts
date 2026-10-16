import { z } from "zod";
import { PaletteSchema, PieceFontsSchema } from "../../brand/src/index.ts";
import { DIRECCION_IDS } from "./direcciones.ts";

/**
 * Datos del post que acompañan al diseño (`post.json`).
 * El diseño de cada lámina vive en `slides.tsx`; aquí va lo que Instagram,
 * el render y la revisión humana necesitan.
 */
export const SourceSchema = z.object({
  title: z.string().trim().min(1).max(200),
  url: z.url(),
  checkedAt: z.iso.date(),
});

export const AnchorSchema = z.object({
  kind: z
    .enum(["logo", "captura", "icono", "imagen"])
    .describe("logo: ícono oficial de una marca; captura: pantalla real; icono: objeto genérico (Lucide); imagen: foto o recurso de prensa con licencia"),
  ref: z.string().trim().min(1).describe("Slug de Simple Icons, nombre del ícono de Lucide o archivo de la pieza"),
  source: z.string().trim().min(1).describe("De dónde sale y con qué licencia o permiso"),
});

export const ArtSchema = z.object({
  direction: z.enum(DIRECCION_IDS).describe("Dirección de arte base, elegida de la mano que repartió `npm run carrusel:baraja`"),
  dealt: z.array(z.enum(DIRECCION_IDS)).min(1).max(5).optional().describe("Las direcciones que te tocaron en la baraja"),
  reason: z.string().trim().min(20).describe("Por qué esta dirección sirve a este tema mejor que las otras que te tocaron"),
  borrowed: z
    .array(z.enum(DIRECCION_IDS))
    .default([])
    .describe("Direcciones de las que alguna lámina interior toma la forma (con la misma paleta y tipografías)"),
  palette: PaletteSchema,
  fonts: PieceFontsSchema,
  anchor: AnchorSchema.describe("El elemento que dice el tema sin leer; va grande en la portada"),
  tab: z.string().trim().min(1).max(40).optional().describe("Texto de la pestaña del marco; por defecto, el tema de la carpeta + .md"),
});
export type Art = z.infer<typeof ArtSchema>;

export const PostSchema = z.object({
  account: z.string().min(1).describe("Id de la cuenta en accounts/*.json"),
  topic: z.string().trim().min(1).max(120),
  infoDate: z.iso.date().describe("Fecha a la que corresponde la información"),
  idea: z
    .string()
    .trim()
    .min(10)
    .describe("La idea propia de esta pieza: 'En este carrusel, [algo del tema] se vuelve [recurso visual]'"),
  art: ArtSchema,
  caption: z.string().trim().min(1).max(2200).describe("Texto principal del post"),
  slideCaptions: z
    .array(z.string().trim().min(1).max(500))
    .optional()
    .describe("Un texto por lámina (opción de Instagram desde junio de 2026)"),
  sources: z.array(SourceSchema).min(1, "Toda pieza necesita al menos una fuente"),
});
export type Post = z.infer<typeof PostSchema>;
