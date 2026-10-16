import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

/** Raíz del repo, para resolver rutas de cuentas y assets sin depender del cwd. */
export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

const hex = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color en formato #RRGGBB");

/** Marca de una cuenta. Es la única fuente de colores, tipografías y firma visual. */
export const AccountBrandSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  handle: z.string().min(1),
  tagline: z.string().min(1),
  colors: z.object({
    bg: hex,
    surface: hex,
    line: hex,
    text: hex,
    muted: hex,
    accent: hex,
    warning: hex,
  }),
  fonts: z.object({ sans: z.string(), mono: z.string() }),
  glyph: z.string().min(1),
  avatar: z.object({ manifest: z.string() }),
  voice: z.object({
    provider: z.string().nullable(),
    voiceId: z.string().nullable(),
    style: z.string().nullable(),
  }),
});
export type AccountBrand = z.infer<typeof AccountBrandSchema>;

export function loadAccount(id: string): AccountBrand {
  const path = join(REPO_ROOT, "accounts", `${id}.json`);
  const raw = JSON.parse(readFileSync(path, "utf8"));
  return AccountBrandSchema.parse(raw);
}

function fontDataUrl(relative: string): string {
  // El paquete geist no exporta su package.json, así que se ubica desde la raíz del repo.
  const file = readFileSync(join(REPO_ROOT, "node_modules/geist/dist/fonts", relative));
  return `data:font/woff2;base64,${file.toString("base64")}`;
}

/**
 * Tipografías embebidas como data URL: el render no depende de internet
 * ni de que la fuente esté instalada en la máquina.
 */
export function fontFaceCss(): string {
  const faces: Array<[string, string, number]> = [
    ["Geist", "geist-sans/Geist-Regular.woff2", 400],
    ["Geist", "geist-sans/Geist-Medium.woff2", 500],
    ["Geist", "geist-sans/Geist-SemiBold.woff2", 600],
    ["Geist", "geist-sans/Geist-Bold.woff2", 700],
    ["Geist", "geist-sans/Geist-Black.woff2", 800],
    ["Geist Mono", "geist-mono/GeistMono-Regular.woff2", 400],
    ["Geist Mono", "geist-mono/GeistMono-Medium.woff2", 500],
    ["Geist Mono", "geist-mono/GeistMono-SemiBold.woff2", 600],
  ];
  return faces
    .map(
      ([family, file, weight]) =>
        `@font-face{font-family:"${family}";src:url(${fontDataUrl(file)}) format("woff2");font-weight:${weight};font-style:normal;font-display:block;}`,
    )
    .join("\n");
}

/** Variables CSS de la marca, para que ninguna plantilla escriba colores a mano. */
export function brandCssVars(brand: AccountBrand): string {
  const c = brand.colors;
  return `:root{--bg:${c.bg};--surface:${c.surface};--line:${c.line};--text:${c.text};--muted:${c.muted};--accent:${c.accent};--warning:${c.warning};--sans:"${brand.fonts.sans}",system-ui,sans-serif;--mono:"${brand.fonts.mono}",ui-monospace,monospace;}`;
}
