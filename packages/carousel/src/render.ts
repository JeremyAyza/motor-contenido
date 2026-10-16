import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium, type Browser } from "playwright-core";
import { brandCssVars, fontFaceCss, loadAccount } from "../../brand/src/index.ts";
import type { Carousel } from "./schema.ts";
import { contactSheetHtml, SLIDE_HEIGHT, SLIDE_WIDTH, slideHtml } from "./templates/index.ts";
import type { Issue } from "./validate.ts";

/**
 * Lanza Chromium. En Windows o Mac basta con `npx playwright install chromium`;
 * CHROME_PATH permite apuntar a cualquier Chrome o Chromium ya instalado.
 */
async function launch(): Promise<Browser> {
  const executablePath = process.env.CHROME_PATH || undefined;
  return chromium.launch({ executablePath });
}

/** Revisa en el navegador que ningún texto se salga de su caja. */
const FIT_CHECK = `(() => {
  const out = [];
  const content = document.querySelector('[data-content]');
  if (content && content.scrollHeight > content.clientHeight + 1) out.push('El contenido no entra en la lámina (sobran ' + (content.scrollHeight - content.clientHeight) + 'px)');
  document.querySelectorAll('[data-fit-x]').forEach((el) => {
    if (el.scrollWidth > el.clientWidth + 1) out.push('Una línea de código o terminal se corta a la derecha');
  });
  return out;
})()`;

export async function renderCarousel(carousel: Carousel, outDir: string): Promise<{ files: string[]; issues: Issue[] }> {
  const brand = loadAccount(carousel.account);
  const fontCss = fontFaceCss();
  const varsCss = brandCssVars(brand);
  mkdirSync(outDir, { recursive: true });

  const browser = await launch();
  const issues: Issue[] = [];
  const files: string[] = [];
  try {
    const page = await browser.newPage({ viewport: { width: SLIDE_WIDTH, height: SLIDE_HEIGHT }, deviceScaleFactor: 1 });
    for (let i = 0; i < carousel.slides.length; i++) {
      await page.setContent(slideHtml({ carousel, brand, index: i, fontCss, varsCss }), { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      const overflow = (await page.evaluate(FIT_CHECK)) as string[];
      for (const message of overflow) issues.push({ level: "error", where: `lámina ${i + 1}`, message });
      const file = join(outDir, `${String(i + 1).padStart(2, "0")}.png`);
      await page.screenshot({ path: file, type: "png" });
      files.push(file);
    }

    const images = files.map((f) => `data:image/png;base64,${readFileSync(f).toString("base64")}`);
    await page.setViewportSize({ width: 1240, height: 200 + Math.ceil(files.length / 3) * 510 });
    await page.setContent(contactSheetHtml(images, brand, varsCss), { waitUntil: "load" });
    const sheet = join(outDir, "revision.png");
    await page.screenshot({ path: sheet, fullPage: true });
    files.push(sheet);
  } finally {
    await browser.close();
  }

  if (carousel.slideCaptions) {
    writeFileSync(
      join(outDir, "textos-por-lamina.txt"),
      carousel.slideCaptions.map((c, i) => `${i + 1}. ${c}`).join("\n\n"),
    );
  }
  writeFileSync(join(outDir, "texto-del-post.txt"), carousel.caption);
  return { files, issues };
}
