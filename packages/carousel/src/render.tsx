import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium, type Page } from "playwright-core";
import { createHighlighter } from "shiki";
import { fontFaceCss, loadAccount, pieceFontIds, REPO_ROOT, tailwindTheme } from "../../brand/src/index.ts";
import { PostSchema, type Post } from "./post.ts";
import { SlideContext } from "./ui/index.tsx";

/** Se diseña en 540×675 y se fotografía a 2x: salen PNG de 1080×1350. */
export const DESIGN_W = 540;
export const DESIGN_H = 675;

export type Issue = { level: "error" | "aviso"; where: string; message: string };

const UI_DIR = resolve(REPO_ROOT, "packages/carousel/src/ui");
const TAILWIND_CLI = join(REPO_ROOT, "node_modules/@tailwindcss/cli/dist/index.mjs");

/** Frases de relleno que delatan texto de IA en español. Se amplía con el uso. */
const SLOP = [
  "potenciar",
  "potencia tu",
  "sumérgete",
  "en el dinámico mundo",
  "soluciones innovadoras",
  "sin precedentes",
  "revolucionari",
  "desbloquea",
  "al siguiente nivel",
  "game changer",
  "en la era de",
  "te lo explico todo",
  "no vas a creer",
];

export async function loadPiece(dir: string): Promise<{ post: Post; slides: ReactElement[] }> {
  const postPath = join(dir, "post.json");
  const slidesPath = join(dir, "slides.tsx");
  if (!existsSync(postPath) || !existsSync(slidesPath)) {
    throw new Error(`La pieza necesita post.json y slides.tsx en ${dir}`);
  }
  const post = PostSchema.parse(JSON.parse(readFileSync(postPath, "utf8")));
  const mod = await import(pathToFileURL(slidesPath).href);
  const slides = mod.default as ReactElement[];
  if (!Array.isArray(slides) || slides.length < 3 || slides.length > 20) {
    throw new Error("slides.tsx debe exportar por defecto un arreglo de 3 a 20 láminas");
  }
  if (post.slideCaptions && post.slideCaptions.length !== slides.length) {
    throw new Error(`slideCaptions tiene ${post.slideCaptions.length} textos y hay ${slides.length} láminas`);
  }
  return { post, slides };
}

function buildCss(dir: string, buildDir: string, theme: string): string {
  const input = join(buildDir, "input.css");
  const output = join(buildDir, "output.css");
  writeFileSync(
    input,
    `@import "tailwindcss";
@source "${dir.replaceAll("\\", "/")}";
@source "${UI_DIR.replaceAll("\\", "/")}";
${theme}
@layer base {
  html, body { width: ${DESIGN_W}px; height: ${DESIGN_H}px; margin: 0; font-family: var(--font-sans); -webkit-font-smoothing: antialiased; text-rendering: geometricPrecision; }
}
`,
  );
  execFileSync(process.execPath, [TAILWIND_CLI, "-i", input, "-o", output], { stdio: "pipe", cwd: REPO_ROOT });
  return readFileSync(output, "utf8");
}

const unescapeHtml = (s: string) =>
  s.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&#39;", "'").replaceAll("&amp;", "&");

/** Aplica resaltado de sintaxis real a cada <pre data-code>. */
async function highlightCode(html: string): Promise<string> {
  const blocks = [...html.matchAll(/<pre data-code="([^"]+)"([^>]*)>([\s\S]*?)<\/pre>/g)];
  if (!blocks.length) return html;
  const langs = [...new Set(blocks.map((b) => b[1]))];
  const hl = await createHighlighter({ themes: ["github-dark-default"], langs });
  let out = html;
  for (const [whole, lang, attrs, body] of blocks) {
    const inner = hl.codeToHtml(unescapeHtml(body), { lang, theme: "github-dark-default", structure: "inline" });
    out = out.replace(whole, `<pre data-code="${lang}"${attrs}>${inner}</pre>`);
  }
  hl.dispose();
  return out;
}

/** Medición en el navegador: lo que un juez vería y el código no dice. */
const INSPECT = `((isCover) => {
  const issues = [];
  const slide = document.querySelector('[data-slide]');
  const content = document.querySelector('[data-content]');
  const box = slide.getBoundingClientRect();
  if (content.scrollHeight > content.clientHeight + 1) issues.push(['error', 'El contenido no entra: sobran ' + (content.scrollHeight - content.clientHeight) + 'px de alto']);
  const inCode = (el) => el.closest('pre,code,[data-code],[data-mono-ok],[data-ui]');
  const parse = (c) => {
    const m = c.match(/rgba?\\(([^)]+)\\)/) || c.match(/color\\(srgb ([^)]+)\\)/);
    if (!m) return null;
    const parts = m[1].replace('/', ' ').split(/[\\s,]+/).filter(Boolean).map(Number);
    const scale = c.startsWith('color(') ? 255 : 1;
    return { r: parts[0] * scale, g: parts[1] * scale, b: parts[2] * scale, a: parts.length > 3 ? parts[3] : 1 };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  // Fondo real detrás del texto: el primer elemento opaco en ese punto, en orden
  // de apilado. Así cuentan las capas a sangre (underlay) y los bloques absolutos.
  // Si antes aparece una imagen, el fondo no se puede medir y se omite.
  const bgOf = (el) => {
    const r = el.getBoundingClientRect();
    const x = Math.min(Math.max(r.left + Math.min(r.width / 2, 24), 1), innerWidth - 1);
    const y = Math.min(Math.max(r.top + r.height / 2, 1), innerHeight - 1);
    for (const n of document.elementsFromPoint(x, y)) {
      if (n !== el && el.contains(n)) continue;
      if (n.tagName === 'IMG' || n.tagName === 'svg' || n.closest('svg')) return null;
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0.9) return c;
    }
    for (let n = el; n; n = n.parentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0.9) return c;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const contrastOf = (el, cs) => {
    const fg = parse(cs.color);
    if (!fg || inCode(el)) return null;
    const bg = bgOf(el);
    if (!bg) return null;
    const a = lum(fg), b = lum(bg);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };
  let lowContrast = [];
  const families = new Set();
  let gradients = 0, shadows = 0, monoLabels = 0, capsLabels = 0, small = 0, tiny = 0;
  for (const el of content.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden' || cs.display === 'none') continue;
    if (r.right > box.right + 1 || r.left < box.left - 1 || r.bottom > box.bottom + 1) issues.push(['error', 'Un elemento se sale de la lámina: <' + el.tagName.toLowerCase() + '> ' + (el.textContent || '').trim().slice(0, 40)]);
    if (el.scrollWidth > el.clientWidth + 1 && cs.overflowX !== 'visible') issues.push(['error', 'Texto cortado a la derecha: ' + (el.textContent || '').trim().slice(0, 40)]);
    const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (cs.backgroundImage.includes('gradient') && !inCode(el)) gradients++;
    if (cs.boxShadow !== 'none' && !inCode(el)) shadows++;
    if (!ownText) continue;
    const size = parseFloat(cs.fontSize);
    if (!inCode(el)) families.add(cs.fontFamily.split(',')[0].trim().replaceAll('"', ''));
    if (size < 11) tiny++; else if (size < 13) small++;
    if (/mono/i.test(cs.fontFamily) && !inCode(el)) monoLabels++;
    if (cs.textTransform === 'uppercase' && parseFloat(cs.letterSpacing) > 0.5 && size < 16) capsLabels++;
    const ratio = contrastOf(el, cs);
    if (ratio !== null && ratio < 3 && parseFloat(cs.opacity) > 0.7) lowContrast.push((el.textContent || '').trim().slice(0, 40) + ' (' + ratio.toFixed(1) + ':1)');
  }
  // La firma y la pestaña también tienen que leerse sobre lo que haya detrás.
  for (const el of slide.querySelectorAll('[data-brand] *, [data-frame="pestaña"]')) {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const ratio = contrastOf(el, getComputedStyle(el));
    if (ratio !== null && ratio < 3) lowContrast.push('marco: ' + (el.textContent || '').trim().slice(0, 30) + ' (' + ratio.toFixed(1) + ':1)');
  }
  // Ancla visual: lo que dice el tema sin leer. Obligatoria en la portada.
  const anchors = [...slide.querySelectorAll('[data-ancla]')].map((a) => a.getBoundingClientRect());
  const anchorShare = anchors.reduce((m, r) => Math.max(m, (r.width * r.height) / (box.width * box.height)), 0);
  if (isCover && !anchors.length) issues.push(['error', 'La portada no tiene ancla visual: usa <Logo>, <Icono> o <Img ancla> (skills/carrusel-taste)']);
  else if (isCover && anchorShare < 0.025) issues.push(['aviso', 'El ancla de la portada ocupa ' + (anchorShare * 100).toFixed(1) + '% de la lámina: en miniatura no se va a reconocer']);
  for (const t of lowContrast) issues.push(['error', 'Texto sin contraste suficiente: ' + t]);
  if (tiny) issues.push(['error', tiny + ' texto(s) por debajo de 22px reales: no se leen en el celular']);
  if (small) issues.push(['aviso', small + ' texto(s) entre 22 y 26px reales: revisa si se leen']);
  if (gradients) issues.push(['aviso', gradients + ' degradado(s): delatan diseño genérico']);
  if (shadows) issues.push(['aviso', shadows + ' sombra(s) en reposo: usa un cambio de tono']);
  if (monoLabels) issues.push(['aviso', monoLabels + ' texto(s) en monoespaciada fuera de código']);
  if (capsLabels) issues.push(['aviso', capsLabels + ' etiqueta(s) pequeñas en mayúsculas espaciadas']);
  if (families.size > 2) issues.push(['aviso', 'Más de dos tipografías fuera del código: ' + [...families].join(', ')]);
  const text = content.innerText.replace(/\\s+/g, ' ').trim();
  const words = text ? text.split(' ').length : 0;
  return { issues, text, words };
})`;

type SlideReport = { issues: Issue[]; text: string; words: number };

async function inspectSlide(page: Page, i: number): Promise<SlideReport> {
  const r = (await page.evaluate(`${INSPECT}(${i === 0})`)) as { issues: [Issue["level"], string][]; text: string; words: number };
  const where = `lámina ${i + 1}`;
  const issues: Issue[] = r.issues.map(([level, message]) => ({ level, where, message }));
  if (r.words > 70) issues.push({ level: "error", where, message: `${r.words} palabras; el máximo es 70` });
  else if (r.words > 50) issues.push({ level: "aviso", where, message: `${r.words} palabras; mejor 50 o menos` });
  const lower = r.text.toLowerCase();
  if (r.text.includes("—")) issues.push({ level: "aviso", where, message: "Guion largo (—): suena a texto de IA" });
  for (const s of SLOP) if (lower.includes(s)) issues.push({ level: "aviso", where, message: `Frase de relleno: "${s}"` });
  return { issues, text: r.text, words: r.words };
}

function contactSheet(images: string[], handle: string): string {
  const thumbs = images
    .map((src, i) => `<figure><img src="${src}"><figcaption>${i + 1}</figcaption></figure>`)
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}body{background:#05080f;padding:40px;font:16px system-ui;color:#A3B0C2}
.grid{display:grid;grid-template-columns:repeat(3,360px);gap:28px}figure{display:flex;flex-direction:column;gap:8px}
img{width:360px;height:450px;border-radius:12px;display:block}h1{font-size:18px;font-weight:400;margin-bottom:24px}
</style></head><body><h1>${handle} · hoja de revisión (tamaño aproximado de celular)</h1><div class="grid">${thumbs}</div></body></html>`;
}

function thumbSheet(cover: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}body{background:#000;padding:24px;font:13px system-ui;color:#A3B0C2}
.row{display:grid;grid-template-columns:repeat(3,135px);gap:2px;margin-bottom:14px}
.t{width:135px;height:169px;display:block}.a{background:#2a2d33}.b{background:#3a3530}
</style></head><body><div class="row"><i class="t a"></i><img class="t" src="${cover}"><i class="t b"></i></div>
<p>Miniatura del perfil en el celular. ¿Se sabe el tema sin leer?</p></body></html>`;
}

export async function renderPiece(dir: string): Promise<{ files: string[]; issues: Issue[] }> {
  dir = resolve(dir);
  const { post, slides } = await loadPiece(dir);
  const brand = loadAccount(post.account);
  const outDir = join(dir, "out");
  const buildDir = join(outDir, ".build");
  mkdirSync(buildDir, { recursive: true });

  const { art } = post;
  const tab = art.tab ?? `${basename(dir).replace(/^\d{4}-\d{2}-\d{2}-/, "")}.md`;
  const css = buildCss(dir, buildDir, tailwindTheme(art.palette, art.fonts));
  const fonts = fontFaceCss(REPO_ROOT, pieceFontIds(art.fonts));
  const issues: Issue[] = [];
  const files: string[] = [];

  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
  try {
    const page = await browser.newPage({ viewport: { width: DESIGN_W, height: DESIGN_H }, deviceScaleFactor: 2 });
    const texts: string[] = [];
    for (let i = 0; i < slides.length; i++) {
      const markup = renderToStaticMarkup(
        <SlideContext.Provider value={{ brand, art, tab, index: i, total: slides.length, dir }}>{slides[i]}</SlideContext.Provider>,
      );
      const body = await highlightCode(markup);
      const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${fonts}\n${css}</style></head><body>${body}</body></html>`;
      writeFileSync(join(buildDir, `${String(i + 1).padStart(2, "0")}.html`), html);
      await page.setContent(html, { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      const report = await inspectSlide(page, i);
      issues.push(...report.issues);
      texts.push(`--- Lámina ${i + 1} (${report.words} palabras)\n${report.text}`);
      const file = join(outDir, `${String(i + 1).padStart(2, "0")}.png`);
      await page.screenshot({ path: file, type: "png" });
      files.push(file);
    }

    const images = files.map((f) => `data:image/png;base64,${readFileSync(f).toString("base64")}`);
    await page.setViewportSize({ width: 1240, height: 200 + Math.ceil(files.length / 3) * 510 });
    await page.setContent(contactSheet(images, brand.handle), { waitUntil: "load" });
    const sheet = join(outDir, "revision.png");
    await page.screenshot({ path: sheet, fullPage: true });
    files.push(sheet);

    // Prueba del pulgar: la portada al tamaño de una miniatura del perfil.
    await page.setViewportSize({ width: 457, height: 256 });
    await page.setContent(thumbSheet(images[0]), { waitUntil: "load" });
    const thumb = join(outDir, "pulgar.png");
    await page.screenshot({ path: thumb });
    files.push(thumb);

    writeFileSync(join(outDir, "texto-de-laminas.txt"), texts.join("\n\n") + "\n");
  } finally {
    await browser.close();
  }

  writeFileSync(join(outDir, "texto-del-post.txt"), post.caption + "\n");
  if (post.slideCaptions) {
    writeFileSync(join(outDir, "textos-por-lamina.txt"), post.slideCaptions.map((c, i) => `${i + 1}. ${c}`).join("\n\n") + "\n");
  }
  return { files, issues };
}
