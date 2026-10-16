import { readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

/**
 * Catálogo de tipografías que un carrusel puede elegir. Todas son libres (OFL)
 * y vienen de npm, así que el render no depende de internet.
 *
 * Cada pieza elige en `post.json → art.fonts` una para titulares (`display`),
 * una para texto (`text`) y, si hace falta, una para anotaciones a mano (`notes`).
 * Geist y Geist Mono siempre están cargadas: la firma usa Geist y el código usa
 * Geist Mono.
 */
type Face = { file: string; weight: string; style?: "normal" | "italic"; stretch?: string };
type FontDef = { family: string; uso: string; faces: Face[] };

export const FONTS = {
  geist: {
    family: "Geist",
    uso: "Neutra y técnica. Texto de casi todas las piezas; titulares sobrios en 700 u 800.",
    faces: [
      { file: "geist/dist/fonts/geist-sans/Geist-Regular.woff2", weight: "400" },
      { file: "geist/dist/fonts/geist-sans/Geist-Medium.woff2", weight: "500" },
      { file: "geist/dist/fonts/geist-sans/Geist-SemiBold.woff2", weight: "600" },
      { file: "geist/dist/fonts/geist-sans/Geist-Bold.woff2", weight: "700" },
      { file: "geist/dist/fonts/geist-sans/Geist-Black.woff2", weight: "800" },
    ],
  },
  archivo: {
    family: "Archivo",
    uso: "Grotesca variable de peso y ancho. Titulares gigantes y condensados: font-black con font-stretch-[62%] a font-stretch-[80%].",
    faces: [
      { file: "@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2", weight: "100 900", stretch: "62% 125%" },
      { file: "@fontsource-variable/archivo/files/archivo-latin-wdth-italic.woff2", weight: "100 900", stretch: "62% 125%", style: "italic" },
    ],
  },
  "instrument-serif": {
    family: "Instrument Serif",
    uso: "Serif editorial, fina y elegante. Diarios, ensayos, titulares con calma. Solo peso 400 (normal y cursiva).",
    faces: [
      { file: "@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2", weight: "400" },
      { file: "@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
    ],
  },
  fraunces: {
    family: "Fraunces",
    uso: "Serif suave con carácter, variable de 100 a 900. Titulares cálidos y cercanos.",
    faces: [
      { file: "@fontsource-variable/fraunces/files/fraunces-latin-standard-normal.woff2", weight: "100 900" },
      { file: "@fontsource-variable/fraunces/files/fraunces-latin-standard-italic.woff2", weight: "100 900", style: "italic" },
    ],
  },
  bricolage: {
    family: "Bricolage Grotesque",
    uso: "Grotesca juguetona y cálida, de 200 a 800. Collage, preguntas, temas ligeros.",
    faces: [
      { file: "@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2", weight: "200 800" },
    ],
  },
  caveat: {
    family: "Caveat",
    uso: "Manuscrita. Solo para anotaciones cortas sobre capturas o diagramas, nunca para titulares ni texto corrido.",
    faces: [
      { file: "@fontsource/caveat/files/caveat-latin-500-normal.woff2", weight: "500" },
      { file: "@fontsource/caveat/files/caveat-latin-700-normal.woff2", weight: "700" },
    ],
  },
} satisfies Record<string, FontDef>;

export type FontId = keyof typeof FONTS;
export const FONT_IDS = Object.keys(FONTS) as [FontId, ...FontId[]];
export const FontIdSchema = z.enum(FONT_IDS);

const MONO: Face[] = [
  { file: "geist/dist/fonts/geist-mono/GeistMono-Regular.woff2", weight: "400" },
  { file: "geist/dist/fonts/geist-mono/GeistMono-Medium.woff2", weight: "500" },
  { file: "geist/dist/fonts/geist-mono/GeistMono-SemiBold.woff2", weight: "600" },
];

function faceCss(root: string, family: string, f: Face): string {
  const data = readFileSync(join(root, "node_modules", f.file)).toString("base64");
  return (
    `@font-face{font-family:"${family}";src:url(data:font/woff2;base64,${data}) format("woff2");` +
    `font-weight:${f.weight};font-style:${f.style ?? "normal"};${f.stretch ? `font-stretch:${f.stretch};` : ""}font-display:block;}`
  );
}

/**
 * @font-face embebidos como data URL para las tipografías pedidas,
 * más Geist y Geist Mono, que siempre están.
 */
export function fontFaceCss(root: string, ids: FontId[]): string {
  const wanted = new Set<FontId>(["geist", ...ids]);
  const css = [...wanted].flatMap((id) => FONTS[id].faces.map((f) => faceCss(root, FONTS[id].family, f)));
  css.push(...MONO.map((f) => faceCss(root, "Geist Mono", f)));
  return css.join("\n");
}

export const fontStack = (id: FontId) => `"${FONTS[id].family}", "Geist", system-ui, sans-serif`;
