import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import type { Page } from "playwright-core";

/**
 * Láminas animadas (experimento): el render pasa las animaciones CSS de la
 * lámina cuadro a cuadro con Playwright y ffmpeg arma el MP4. La lámina fija
 * (NN.png) y la que mira el inspector son el último cuadro.
 */
export const FPS = 30;
/** Lo que queda quieta la lámina al final del video, para que se alcance a leer. */
const PAUSA_FINAL_MS = 1500;
/** Instagram pide al menos 3 s por video; más de 12 s ya no es una lámina. */
const MIN_MS = 3000;
const MAX_MS = 12000;

/**
 * Prepara las animaciones de la lámina abierta y dice cuántas hay y cuándo
 * termina la última, en ms. Lo que se traza necesita pathLength="1".
 */
export async function prepararMovimiento(page: Page): Promise<{ cantidad: number; finMs: number }> {
  return page.evaluate(() => {
    for (const el of document.querySelectorAll('[data-anim="traza"] :is(path, line, polyline, polygon, circle, ellipse, rect)')) {
      el.setAttribute("pathLength", "1");
    }
    const animaciones = document.getAnimations();
    let finMs = 0;
    for (const a of animaciones) {
      const fin = Number(a.effect?.getComputedTiming().endTime ?? 0);
      if (Number.isFinite(fin)) finMs = Math.max(finMs, fin);
    }
    const cuentas = document.querySelectorAll<HTMLElement>("[data-cuenta]");
    for (const c of cuentas) finMs = Math.max(finMs, (Number(c.dataset.en) + Number(c.dataset.dur)) * 1000);
    return { cantidad: animaciones.length + cuentas.length, finMs };
  });
}

/** Deja todo en su estado final: así se inspecciona y así queda la lámina fija. */
export async function finalizarMovimiento(page: Page): Promise<void> {
  await page.evaluate(() => {
    for (const a of document.getAnimations()) {
      try {
        a.finish();
      } catch {
        a.cancel();
      }
    }
  });
}

/** Pone la lámina en el instante `ms`: las animaciones CSS y los números que cuentan. */
async function irA(page: Page, ms: number): Promise<void> {
  await page.evaluate((t) => {
    for (const a of document.getAnimations()) {
      a.pause();
      a.currentTime = t;
    }
    for (const el of document.querySelectorAll<HTMLElement>("[data-cuenta]")) {
      const desde = Number(el.dataset.desde);
      const hasta = Number(el.dataset.hasta);
      const avance = Math.min(Math.max((t - Number(el.dataset.en) * 1000) / (Number(el.dataset.dur) * 1000), 0), 1);
      const suave = 1 - Math.pow(1 - avance, 3);
      const d = el.dataset.decimales ? Number(el.dataset.decimales) : Number.isInteger(hasta) ? 0 : Math.abs(hasta) < 10 ? 2 : 1;
      const valor = new Intl.NumberFormat("es-MX", { minimumFractionDigits: d, maximumFractionDigits: d }).format(desde + (hasta - desde) * suave);
      el.textContent = `${el.dataset.prefijo ?? ""}${valor}${el.dataset.sufijo ?? ""}`;
    }
  }, ms);
}

/** El ffmpeg que se va a usar (FFMPEG_PATH o el del PATH), o null si no hay. */
export function ffmpegDisponible(): string | null {
  const bin = process.env.FFMPEG_PATH || "ffmpeg";
  return spawnSync(bin, ["-version"], { stdio: "ignore" }).status === 0 ? bin : null;
}

/**
 * Graba la lámina abierta cuadro a cuadro y la guarda como MP4 (H.264, 30 fps,
 * yuv420p), el formato que Instagram acepta en un carrusel. Devuelve los segundos.
 */
export async function grabarLamina(page: Page, finMs: number, cuadrosDir: string, salida: string, ffmpeg: string): Promise<number> {
  const totalMs = Math.min(Math.max(finMs + PAUSA_FINAL_MS, MIN_MS), MAX_MS);
  const cuadros = Math.round((totalMs / 1000) * FPS);
  rmSync(cuadrosDir, { recursive: true, force: true });
  mkdirSync(cuadrosDir, { recursive: true });
  try {
    for (let f = 0; f < cuadros; f++) {
      await irA(page, (f * 1000) / FPS);
      await page.screenshot({ path: join(cuadrosDir, `f${String(f).padStart(4, "0")}.png`), type: "png" });
    }
    const r = spawnSync(
      ffmpeg,
      ["-loglevel", "error", "-y", "-framerate", String(FPS), "-i", join(cuadrosDir, "f%04d.png"), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "slow", "-movflags", "+faststart", salida],
      { encoding: "utf8" },
    );
    if (r.status !== 0) throw new Error(`ffmpeg falló: ${(r.stderr || "sin detalle").trim().split("\n")[0]}`);
  } finally {
    rmSync(cuadrosDir, { recursive: true, force: true });
  }
  await finalizarMovimiento(page);
  return totalMs / 1000;
}
