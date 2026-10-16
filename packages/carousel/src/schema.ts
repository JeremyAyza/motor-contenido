import { z } from "zod";

/**
 * Contrato del carrusel. Cualquier agente (Claude, Codex, Gemini...) produce
 * un JSON que cumpla este esquema; el render no depende de quién lo escribió.
 */

const text = (max: number) => z.string().trim().min(1).max(max);

export const SourceSchema = z.object({
  title: text(160),
  url: z.url(),
  checkedAt: z.iso.date(),
});

const CoverSlide = z.object({
  type: z.literal("cover"),
  kicker: text(60).optional().describe("Línea pequeña sobre el título, p. ej. la fecha del lanzamiento"),
  title: text(70).describe("Promesa concreta, 8 palabras como máximo"),
  highlight: text(40).optional().describe("Fragmento literal del título que va en color de acento"),
  terminal: z
    .array(text(48))
    .max(4)
    .optional()
    .describe("Líneas de terminal decorativas que muestran algo real"),
});

const ConceptSlide = z.object({
  type: z.literal("concept"),
  eyebrow: text(40).optional(),
  title: text(80),
  body: text(260),
  flow: z
    .array(z.object({ label: text(28), note: text(60).optional() }))
    .min(2)
    .max(3)
    .optional()
    .describe("Diagrama horizontal de 2 o 3 cajas"),
});

const ListSlide = z.object({
  type: z.literal("list"),
  eyebrow: text(40).optional(),
  title: text(80),
  items: z
    .array(z.object({ label: text(60), detail: text(90).optional() }))
    .min(2)
    .max(6),
});

const StepsSlide = z.object({
  type: z.literal("steps"),
  eyebrow: text(40).optional(),
  title: text(80),
  steps: z
    .array(
      z.object({
        title: text(50),
        detail: text(120).optional(),
        code: text(60).optional().describe("Comando o fragmento corto en monoespaciada"),
      }),
    )
    .min(2)
    .max(4),
});

const ClosingSlide = z.object({
  type: z.literal("closing"),
  eyebrow: text(40).optional(),
  title: text(80),
  warning: z.object({ title: text(50), text: text(200) }).optional(),
  points: z.array(text(90)).max(4).default([]),
  cta: z.object({
    save: text(60).describe("Llamado a guardar"),
    question: text(90).optional().describe("Pregunta para comentarios"),
  }),
});

export const SlideSchema = z.discriminatedUnion("type", [
  CoverSlide,
  ConceptSlide,
  ListSlide,
  StepsSlide,
  ClosingSlide,
]);
export type Slide = z.infer<typeof SlideSchema>;

export const CarouselSchema = z
  .object({
    account: z.string().min(1).describe("Id de la cuenta en accounts/*.json"),
    topic: text(120),
    infoDate: z.iso.date().describe("Fecha a la que corresponde la información"),
    slides: z.array(SlideSchema).min(3).max(20),
    caption: text(2200).describe("Texto principal del post"),
    slideCaptions: z
      .array(text(500))
      .optional()
      .describe("Un texto por lámina (opción de Instagram desde junio de 2026)"),
    sources: z.array(SourceSchema).min(1, "Toda pieza necesita al menos una fuente"),
  })
  .superRefine((c, ctx) => {
    if (c.slides[0]?.type !== "cover") {
      ctx.addIssue({ code: "custom", path: ["slides", 0], message: "La primera lámina debe ser cover" });
    }
    if (c.slides.at(-1)?.type !== "closing") {
      ctx.addIssue({ code: "custom", path: ["slides"], message: "La última lámina debe ser closing" });
    }
    if (c.slideCaptions && c.slideCaptions.length !== c.slides.length) {
      ctx.addIssue({
        code: "custom",
        path: ["slideCaptions"],
        message: `Debe haber ${c.slides.length} textos, uno por lámina`,
      });
    }
  });
export type Carousel = z.infer<typeof CarouselSchema>;
