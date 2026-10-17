import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium, type Browser, type Page } from "playwright-core";
import { createHighlighter } from "shiki";
import { fontFaceCss, loadAccount, pieceFontIds, REPO_ROOT, tailwindTheme } from "../../brand/src/index.ts";
import { loadBrief, type Brief } from "./brief.ts";
import { PostSchema, type Post } from "./post.ts";
import { revisarTextos } from "./texto.ts";
import { SlideContext } from "./ui/index.tsx";

/** Se diseña en 540×675 y se fotografía a 2x: salen PNG de 1080×1350. */
export const DESIGN_W = 540;
export const DESIGN_H = 675;

export type Issue = { level: "error" | "aviso"; where: string; message: string };

const UI_DIR = resolve(REPO_ROOT, "packages/carousel/src/ui");
const TAILWIND_CLI = join(REPO_ROOT, "node_modules/@tailwindcss/cli/dist/index.mjs");

/**
 * Frases de relleno que delatan texto de IA en español. Salen del mismo léxico
 * que usa el humanizador (skills/ig-es/slop-es.json), para que haya una sola lista.
 */
const SLOP: { find: string; re: RegExp }[] = (() => {
  const lex = JSON.parse(readFileSync(join(REPO_ROOT, "skills/ig-es/slop-es.json"), "utf8")) as {
    words: { find: string }[];
    phrases: { find: string }[];
    solo_marcar: string[];
  };
  const finds = [...lex.words.map((w) => w.find), ...lex.phrases.map((p) => p.find), ...lex.solo_marcar];
  return [...new Set(finds)].map((find) => ({
    find,
    re: new RegExp(`(?<![\\p{L}\\p{N}])${find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+")}(?![\\p{L}\\p{N}])`, "iu"),
  }));
})();

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

/**
 * Medición en el navegador: lo que un juez vería y el código no dice.
 *
 * Tamaños en px de diseño (el PNG sale a 2x; el celular muestra la lámina a
 * ~390px de ancho, un 36% del PNG). Tres clases de texto:
 * - texto: error bajo 14px (28 reales), aviso bajo 16px (32 reales, ~11.5px en el celular);
 * - código (<Code>, <pre>): error bajo 13px, aviso bajo 14px;
 * - marco y notas (data-ui, data-nota, figcaption: fuente, fecha, créditos): error bajo 12px.
 * Contraste: 4.5:1 para texto de menos de 24px de diseño, 3:1 para el más grande,
 * el marco y las notas. El código no se mide (lo colorea Shiki sobre fondo oscuro).
 */
const INSPECT = `((isCover, isLast) => {
  const issues = [];
  const slide = document.querySelector('[data-slide]');
  const content = document.querySelector('[data-content]');
  const box = slide.getBoundingClientRect();
  if (content.scrollHeight > content.clientHeight + 1) issues.push(['error', 'El contenido no entra: sobran ' + (content.scrollHeight - content.clientHeight) + 'px de alto']);
  const isCode = (el) => !!el.closest('pre,code,[data-code]');
  const isChrome = (el) => !!el.closest('[data-ui],[data-nota],figcaption');
  const monoOk = (el) => !!el.closest('pre,code,[data-code],[data-mono-ok],[data-ui]');
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
    if (!fg || isCode(el)) return null;
    const bg = bgOf(el);
    if (!bg) return null;
    const a = lum(fg), b = lum(bg);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };
  const lowContrast = [];
  const families = new Set();
  const sizes = new Set();
  const tiny = [], small = [];
  let gradients = 0, shadows = 0, monoLabels = 0, capsLabels = 0;
  const sample = (el) => (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 30);
  for (const el of content.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden' || cs.display === 'none') continue;
    if (r.right > box.right + 1 || r.left < box.left - 1 || r.bottom > box.bottom + 1) issues.push(['error', 'Un elemento se sale de la lámina: <' + el.tagName.toLowerCase() + '> ' + sample(el)]);
    if (el.scrollWidth > el.clientWidth + 1 && cs.overflowX !== 'visible') issues.push(['error', 'Texto cortado a la derecha: ' + sample(el)]);
    const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (cs.backgroundImage.includes('gradient') && !isCode(el)) gradients++;
    if (cs.boxShadow !== 'none' && !isCode(el)) shadows++;
    if (!ownText) continue;
    const size = parseFloat(cs.fontSize);
    const code = isCode(el), chrome = !code && isChrome(el), prose = !code && !chrome;
    if (prose) {
      families.add(cs.fontFamily.split(',')[0].trim().replaceAll('"', ''));
      sizes.add(Math.round(size));
      if (size < 14) tiny.push(sample(el) + ' (' + size * 2 + 'px)'); else if (size < 16) small.push(sample(el) + ' (' + size * 2 + 'px)');
    } else if (code) {
      if (size < 13) tiny.push('código: ' + sample(el) + ' (' + size * 2 + 'px)'); else if (size < 14) small.push('código: ' + sample(el) + ' (' + size * 2 + 'px)');
    } else if (size < 12) tiny.push('nota: ' + sample(el) + ' (' + size * 2 + 'px)');
    if (/mono/i.test(cs.fontFamily) && !monoOk(el)) monoLabels++;
    if (cs.textTransform === 'uppercase' && parseFloat(cs.letterSpacing) > 0.5 && size < 16) capsLabels++;
    const ratio = contrastOf(el, cs);
    const need = prose && size < 24 ? 4.5 : 3;
    if (ratio !== null && ratio < need && parseFloat(cs.opacity) > 0.7) lowContrast.push(sample(el) + ' (' + ratio.toFixed(1) + ':1, pide ' + need + ':1)');
  }
  // La firma y la pestaña también tienen que leerse sobre lo que haya detrás.
  for (const el of slide.querySelectorAll('[data-brand] *, [data-frame="pestaña"]')) {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const ratio = contrastOf(el, getComputedStyle(el));
    if (ratio !== null && ratio < 3) lowContrast.push('marco: ' + sample(el) + ' (' + ratio.toFixed(1) + ':1)');
  }
  // Ancla visual: lo que dice el tema sin leer. Obligatoria en la portada.
  const anchors = [...slide.querySelectorAll('[data-ancla]')].map((a) => a.getBoundingClientRect());
  const anchorShare = anchors.reduce((m, r) => Math.max(m, (r.width * r.height) / (box.width * box.height)), 0);
  if (isCover && !anchors.length) issues.push(['error', 'La portada no tiene ancla visual: usa <Logo>, <Icono> o <Img ancla> (skills/carrusel-taste)']);
  else if (isCover && anchorShare < 0.025) issues.push(['aviso', 'El ancla de la portada ocupa ' + (anchorShare * 100).toFixed(1) + '% de la lámina: en miniatura no se va a reconocer']);
  for (const t of lowContrast) issues.push(['error', 'Texto sin contraste suficiente: ' + t]);
  if (tiny.length) issues.push(['error', tiny.length + ' texto(s) demasiado chicos para el celular: ' + tiny.slice(0, 3).join('; ')]);
  if (small.length) issues.push(['aviso', small.length + ' texto(s) chicos (el cuerpo va en 32px reales o más): ' + small.slice(0, 3).join('; ')]);
  if (sizes.size > 3) issues.push(['aviso', sizes.size + ' tamaños de letra distintos (' + [...sizes].sort((a, b) => b - a).map((s) => s * 2 + 'px').join(', ') + '); usa 2 o 3']);
  if (gradients) issues.push(['aviso', gradients + ' degradado(s): delatan diseño genérico']);
  if (shadows) issues.push(['aviso', shadows + ' sombra(s) en reposo: usa un cambio de tono']);
  if (monoLabels) issues.push(['aviso', monoLabels + ' texto(s) en monoespaciada fuera de código']);
  if (capsLabels) issues.push(['aviso', capsLabels + ' etiqueta(s) pequeñas en mayúsculas espaciadas']);
  if (families.size > 2) issues.push(['aviso', 'Más de dos tipografías fuera del código: ' + [...families].join(', ')]);
  // Palabras que se leen: sin código, marco ni notas.
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  const read = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const p = n.parentElement;
    if (!p || isCode(p) || isChrome(p) || !n.textContent.trim()) continue;
    read.push(n.textContent);
  }
  const readText = read.join(' ').replace(/\\s+/g, ' ').trim();
  const words = readText ? readText.split(' ').length : 0;
  const cta = isLast ? content.querySelector('[data-cta]') : null;
  const text = content.innerText.replace(/\\s+/g, ' ').trim();
  return { issues, text, words, cta: cta ? (cta.textContent || '').replace(/\\s+/g, ' ').trim() : null };
})`;

type SlideReport = { issues: Issue[]; text: string; words: number; cta: string | null };

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

async function inspectSlide(page: Page, i: number, total: number): Promise<SlideReport> {
  const isCover = i === 0;
  const isLast = i === total - 1;
  const r = (await page.evaluate(`${INSPECT}(${isCover}, ${isLast})`)) as {
    issues: [Issue["level"], string][];
    text: string;
    words: number;
    cta: string | null;
  };
  const where = `lámina ${i + 1}`;
  const issues: Issue[] = r.issues.map(([level, message]) => ({ level, where, message }));
  if (isCover) {
    if (r.words > 20) issues.push({ level: "error", where, message: `${r.words} palabras en la portada; el máximo es 20` });
    else if (r.words > 12) issues.push({ level: "aviso", where, message: `${r.words} palabras en la portada; mejor 12 o menos (gancho y promesa)` });
  } else if (r.words > 50) issues.push({ level: "error", where, message: `${r.words} palabras; el máximo es 50` });
  else if (r.words > 35) issues.push({ level: "aviso", where, message: `${r.words} palabras; mejor 35 o menos` });
  if (r.text.includes("—")) issues.push({ level: "aviso", where, message: "Guion largo (—): suena a texto de IA" });
  for (const { find, re } of SLOP) if (re.test(r.text)) issues.push({ level: "aviso", where, message: `Frase de relleno: "${find}" (skills/ig-es/slop-es.json)` });
  return { issues, text: r.text, words: r.words, cta: r.cta };
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

  // Paso 0: brief editorial y puerta A (workflows/carrusel.md).
  const load = loadBrief(dir);
  let brief: Brief | null = null;
  if (load.status === "sin-brief") {
    issues.push({ level: "aviso", where: "brief", message: "Sin brief.json: pieza anterior al paso 0 (workflows/carrusel.md)" });
  } else if (load.status === "invalido") {
    for (const e of load.errors) issues.push({ level: "error", where: "brief", message: e });
  } else {
    brief = load.brief;
    for (const w of load.warnings) issues.push({ level: "aviso", where: "brief", message: w });
    if (!brief.puertaA.aprobado) {
      issues.push({ level: "error", where: "brief", message: "La puerta A no está aprobada: corre carrusel:brief y muéstrale out/puerta-a.md a la persona" });
    }
  }

  const slideTexts: string[] = [];
  let lastCta: string | null = null;
  const browser = await launchBrowser();
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
      const report = await inspectSlide(page, i, slides.length);
      issues.push(...report.issues);
      texts.push(`--- Lámina ${i + 1} (${report.words} palabras)\n${report.text}`);
      slideTexts.push(report.text);
      if (i === slides.length - 1) lastCta = report.cta;
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

  // Cierre: despedida dinámica con un solo CTA, marcado con data-cta. Es error
  // también en las piezas sin brief: sin CTA no hay carrusel terminado.
  const lastWhere = `lámina ${slides.length}`;
  if (lastCta === null) {
    issues.push({
      level: "error",
      where: lastWhere,
      message: "La última lámina no tiene CTA: marca el llamado a la acción con data-cta (workflows/carrusel.md, el cierre)",
    });
  } else if (brief && normalize(lastCta) !== normalize(brief.cta.texto)) {
    issues.push({ level: "aviso", where: lastWhere, message: `El CTA de la lámina ("${lastCta}") no es el del brief ("${brief.cta.texto}")` });
  }

  const captionFile = join(outDir, "texto-del-post.txt");
  writeFileSync(captionFile, post.caption + "\n");
  if (post.slideCaptions) {
    writeFileSync(join(outDir, "textos-por-lamina.txt"), post.slideCaptions.map((c, i) => `${i + 1}. ${c}`).join("\n\n") + "\n");
  }
  if (post.alt) writeFileSync(join(outDir, "texto-alternativo.txt"), post.alt + "\n");
  else issues.push({ level: "aviso", where: "texto del post", message: "Falta post.json → alt: el texto alternativo de la portada" });
  issues.push(...revisarTextos({ outDir, captionFile, slideTexts, brief, busqueda: post.busqueda }));
  return { files, issues };
}

/**
 * Abre Chromium. Primero CHROME_PATH, después el que pide playwright-core; si
 * esa versión no está instalada, el Chromium de Playwright más nuevo que haya
 * (de otro proyecto) y por último Chrome o Edge del sistema.
 */
async function launchBrowser(): Promise<Browser> {
  const failures: string[] = [];
  for (const executablePath of browserCandidates()) {
    try {
      return await chromium.launch({ executablePath });
    } catch (e) {
      failures.push(`${executablePath ?? "Chromium de playwright-core"}: ${(e as Error).message.split("\n")[0]}`);
    }
  }
  throw new Error(`No pude abrir ningún navegador. Define CHROME_PATH o corre "npx playwright install chromium".\n${failures.join("\n")}`);
}

function browserCandidates(): (string | undefined)[] {
  const list: (string | undefined)[] = [];
  if (process.env.CHROME_PATH) list.push(process.env.CHROME_PATH);
  list.push(undefined);
  const home = homedir();
  const pwDir =
    process.env.PLAYWRIGHT_BROWSERS_PATH ??
    (process.platform === "win32"
      ? join(home, "AppData/Local/ms-playwright")
      : process.platform === "darwin"
        ? join(home, "Library/Caches/ms-playwright")
        : join(home, ".cache/ms-playwright"));
  const builds = existsSync(pwDir)
    ? readdirSync(pwDir)
        .filter((d) => /^chromium-\d+$/.test(d))
        .sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]))
    : [];
  const inBuild = ["chrome-win64/chrome.exe", "chrome-win/chrome.exe", "chrome-linux64/chrome", "chrome-linux/chrome",
    "chrome-mac-arm64/Chromium.app/Contents/MacOS/Chromium", "chrome-mac/Chromium.app/Contents/MacOS/Chromium"];
  const system = [
    join(process.env.PROGRAMFILES ?? "C:/Program Files", "Google/Chrome/Application/chrome.exe"),
    join(process.env["PROGRAMFILES(X86)"] ?? "C:/Program Files (x86)", "Google/Chrome/Application/chrome.exe"),
    join(process.env.LOCALAPPDATA ?? join(home, "AppData/Local"), "Google/Chrome/Application/chrome.exe"),
    join(process.env["PROGRAMFILES(X86)"] ?? "C:/Program Files (x86)", "Microsoft/Edge/Application/msedge.exe"),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  for (const b of builds) for (const rel of inBuild) if (existsSync(join(pwDir, b, rel))) list.push(join(pwDir, b, rel));
  for (const p of system) if (existsSync(p)) list.push(p);
  return list;
}
