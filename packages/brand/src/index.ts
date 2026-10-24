import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { fontStack, FontIdSchema, type FontId } from "./fonts.ts";

export { FONTS, FONT_IDS, FontIdSchema, fontFaceCss, type FontId } from "./fonts.ts";

/** Raíz del repo, para resolver rutas de cuentas y assets sin depender del cwd. */
export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

/**
 * Lo único constante de una cuenta: su firma. Los colores y las tipografías
 * los elige cada pieza en `post.json → art`, según su dirección de arte.
 */
export const AccountBrandSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  handle: z.string().min(1),
  tagline: z.string().min(1),
  glyph: z.string().min(1).describe("Glifo de la firma, junto al usuario"),
  avatar: z.object({ manifest: z.string() }),
  voice: z.object({
    provider: z.string().nullable(),
    voiceId: z.string().nullable(),
    style: z.string().nullable(),
  }),
  world: z
    .object({
      style: z.string().min(1).describe("Trozo de prompt que video:image suma a cada imagen, para que todas parezcan del mismo mundo"),
    })
    .optional(),
});
export type AccountBrand = z.infer<typeof AccountBrandSchema>;

export function loadAccount(id: string): AccountBrand {
  const path = join(REPO_ROOT, "accounts", `${id}.json`);
  const raw = JSON.parse(readFileSync(path, "utf8"));
  return AccountBrandSchema.parse(raw);
}

const hex = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color en formato #RRGGBB");

/** Paleta de una pieza. Todas las láminas la comparten. */
export const PaletteSchema = z.object({
  bg: hex.describe("Fondo base"),
  ink: hex.describe("Texto sobre el fondo base"),
  accent: hex.describe("Color de acento; suele salir del ancla visual"),
  accentInk: hex.describe("Texto sobre el acento"),
  surface: hex.optional().describe("Fondo de bloques y tarjetas; si falta, se mezcla tinta y fondo"),
  muted: hex.optional().describe("Notas secundarias; si falta, se mezcla tinta y fondo"),
});
export type Palette = z.infer<typeof PaletteSchema>;

export const PieceFontsSchema = z.object({
  display: FontIdSchema.describe("Titulares"),
  text: FontIdSchema.default("geist").describe("Texto corrido"),
  notes: FontIdSchema.optional().describe("Anotaciones a mano (caveat), solo si la dirección las usa"),
});
export type PieceFonts = z.infer<typeof PieceFontsSchema>;

export function pieceFontIds(f: PieceFonts): FontId[] {
  return [f.display, f.text, ...(f.notes ? [f.notes] : [])];
}

/**
 * Tema de Tailwind v4 de una pieza. Las láminas usan bg-bg, text-ink, bg-accent,
 * text-accent-ink, bg-surface, text-muted, font-display, font-sans, font-notes
 * y font-mono. Un color fuera de la paleta solo se justifica si viene del ancla.
 */
export function tailwindTheme(p: Palette, f: PieceFonts): string {
  const mix = (pct: number) => `color-mix(in srgb, ${p.ink} ${pct}%, ${p.bg})`;
  return `@theme {
  --color-bg: ${p.bg};
  --color-ink: ${p.ink};
  --color-accent: ${p.accent};
  --color-accent-ink: ${p.accentInk};
  --color-surface: ${p.surface ?? mix(8)};
  --color-muted: ${p.muted ?? mix(68)};
  --font-sans: ${fontStack(f.text)};
  --font-display: ${fontStack(f.display)};
  --font-notes: ${fontStack(f.notes ?? f.display)};
  --font-mono: "Geist Mono", ui-monospace, monospace;
}`;
}
