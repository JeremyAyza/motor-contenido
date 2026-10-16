import { CarouselSchema, type Carousel, type Slide } from "./schema.ts";

export type Issue = { level: "error" | "aviso"; where: string; message: string };

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

function slideText(slide: Slide): string {
  switch (slide.type) {
    case "cover":
      return [slide.kicker, slide.title].filter(Boolean).join(" ");
    case "concept":
      return [slide.eyebrow, slide.title, slide.body, ...(slide.flow ?? []).flatMap((f) => [f.label, f.note])]
        .filter(Boolean)
        .join(" ");
    case "list":
      return [slide.eyebrow, slide.title, ...slide.items.flatMap((i) => [i.label, i.detail])].filter(Boolean).join(" ");
    case "steps":
      return [slide.eyebrow, slide.title, ...slide.steps.flatMap((s) => [s.title, s.detail])].filter(Boolean).join(" ");
    case "closing":
      return [slide.eyebrow, slide.title, slide.warning?.title, slide.warning?.text, ...slide.points, slide.cta.save, slide.cta.question]
        .filter(Boolean)
        .join(" ");
  }
}

/** Frases de relleno que delatan texto de IA en español. Se amplía con el uso. */
const SLOP = [
  "potenciar",
  "potencia tu",
  "sumérgete",
  "en el dinámico mundo",
  "soluciones innovadoras",
  "sin precedentes",
  "revolucionario",
  "desbloquea",
  "lleva tu",
  "al siguiente nivel",
  "game changer",
];

/**
 * Reglas editoriales que el esquema no puede expresar.
 * Los errores bloquean el render; los avisos se muestran para revisión humana.
 */
export function validateCarousel(input: unknown): { carousel?: Carousel; issues: Issue[] } {
  const parsed = CarouselSchema.safeParse(input);
  if (!parsed.success) {
    return {
      issues: parsed.error.issues.map((i) => ({
        level: "error" as const,
        where: i.path.join(".") || "(raíz)",
        message: i.message,
      })),
    };
  }
  const carousel = parsed.data;
  const issues: Issue[] = [];

  carousel.slides.forEach((slide, i) => {
    const where = `lámina ${i + 1} (${slide.type})`;
    const n = words(slideText(slide));
    if (n > 60) issues.push({ level: "error", where, message: `${n} palabras; el máximo es 60` });
    else if (n > 45) issues.push({ level: "aviso", where, message: `${n} palabras; mejor 45 o menos` });

    if (slide.type === "cover") {
      const t = words(slide.title);
      if (t > 8) issues.push({ level: "error", where, message: `El título de portada tiene ${t} palabras; máximo 8` });
      if (slide.highlight && !slide.title.includes(slide.highlight)) {
        issues.push({ level: "error", where, message: `"highlight" no aparece literal en el título` });
      }
    }

    const all = slideText(slide);
    if (all.includes("—")) issues.push({ level: "aviso", where, message: "Tiene guion largo (—); suena a texto de IA" });
    for (const s of SLOP) {
      if (all.toLowerCase().includes(s)) issues.push({ level: "aviso", where, message: `Frase de relleno: "${s}"` });
    }
  });

  if (carousel.slides.length < 4 || carousel.slides.length > 10) {
    issues.push({ level: "aviso", where: "slides", message: `${carousel.slides.length} láminas; lo habitual es de 4 a 10` });
  }
  return { carousel, issues };
}

export function printIssues(issues: Issue[]): void {
  if (!issues.length) {
    console.log("✓ Sin problemas");
    return;
  }
  for (const i of issues) console.log(`${i.level === "error" ? "✗" : "!"} [${i.level}] ${i.where}: ${i.message}`);
}
