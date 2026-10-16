import { readFileSync } from "node:fs";
import { extname, isAbsolute, join } from "node:path";
import { createContext, useContext, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { AccountBrand } from "../../../brand/src/index.ts";

/**
 * Primitivas para diseñar láminas. Solo lo constante es fijo: el pie con la
 * firma de la marca. Todo lo demás (composición, escala, color de campo,
 * ritmo) lo decide el agente en cada carrusel con Tailwind.
 *
 * El lienzo mide 1080×1350, pero Tailwind está escalado 2x: piensa en un
 * lienzo de 540×675 y usa las clases normales (text-5xl, p-8, gap-6...).
 */

export type RenderContext = {
  brand: AccountBrand;
  index: number;
  total: number;
  /** Carpeta de la pieza, para resolver imágenes relativas. */
  dir: string;
};

export const SlideContext = createContext<RenderContext | null>(null);

function useRender(): RenderContext {
  const ctx = useContext(SlideContext);
  if (!ctx) throw new Error("Las primitivas solo funcionan dentro del render del carrusel");
  return ctx;
}

/** Une clases dejando que las del agente ganen sobre las de la primitiva. */
const cx = (...c: Array<string | false | null | undefined>) => twMerge(c.filter(Boolean).join(" "));

/** Campos de color de la marca. Cambiar de campo entre láminas da ritmo. */
export type Tone = "dark" | "accent" | "paper";

const TONE: Record<Tone, string> = {
  dark: "bg-bg text-ink",
  accent: "bg-accent text-bg",
  paper: "bg-paper text-bg",
};

/**
 * Una lámina. `children` es libre. El pie de marca es lo único fijo.
 * `swipe` muestra una invitación a deslizar (útil solo en la portada).
 */
export function Slide({
  children,
  tone = "dark",
  className,
  swipe = false,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  swipe?: boolean;
}) {
  const { brand } = useRender();
  return (
    <main data-slide className={cx("relative flex h-full w-full flex-col overflow-hidden", TONE[tone])}>
      <section data-content className={cx("relative flex min-h-0 flex-1 flex-col px-12 pt-12", className)}>
        {children}
      </section>
      <footer data-brand className="flex items-center justify-between px-12 pb-9 pt-6 text-[13px] leading-none">
        <span className="flex items-center gap-2.5">
          <span className="font-mono font-semibold" data-mono-ok>
            {brand.glyph}
          </span>
          <span className="opacity-80">{brand.handle}</span>
        </span>
        {swipe ? <span className="font-medium opacity-80">Desliza</span> : null}
      </footer>
    </main>
  );
}

/**
 * Código real con resaltado de sintaxis (Shiki se aplica al renderizar).
 * Úsalo solo para código o comandos que existen de verdad.
 */
export function Code({
  children,
  lang = "ts",
  className,
}: {
  children: string;
  lang?: string;
  className?: string;
}) {
  return (
    <pre
      data-code={lang}
      className={cx("overflow-hidden whitespace-pre rounded-xl bg-surface p-5 font-mono text-[15px] leading-relaxed", className)}
    >
      {children.replace(/^\n+|\s+$/g, "")}
    </pre>
  );
}

/** Marco de ventana para terminal, capturas o interfaz. */
export function Window({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-ui className={cx("overflow-hidden rounded-xl bg-surface", className)}>
      <div className="flex items-center gap-2 bg-black/20 px-4 py-2.5">
        <i className="size-2.5 rounded-full bg-white/20" />
        <i className="size-2.5 rounded-full bg-white/20" />
        <i className="size-2.5 rounded-full bg-white/20" />
        {title ? <span className="ml-2 text-[12px] opacity-60">{title}</span> : null}
      </div>
      <div>{children}</div>
    </div>
  );
}

/**
 * Imagen local (captura real, foto, ilustración con licencia).
 * `src` es relativo a la carpeta de la pieza. `credit` se muestra pequeño
 * cuando la imagen no es tuya.
 */
export function Img({
  src,
  alt,
  className,
  credit,
}: {
  src: string;
  alt: string;
  className?: string;
  credit?: string;
}) {
  const { dir } = useRender();
  const path = isAbsolute(src) ? src : join(dir, src);
  const mime = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml" }[
    extname(path).toLowerCase()
  ];
  if (!mime) throw new Error(`Formato de imagen no soportado: ${src}`);
  const data = readFileSync(path).toString("base64");
  return (
    <figure className="relative">
      <img src={`data:${mime};base64,${data}`} alt={alt} className={cx("block", className)} />
      {credit ? <figcaption className="mt-1.5 text-[12px] opacity-60">{credit}</figcaption> : null}
    </figure>
  );
}

/** Burbuja de chat: un prompt real que la audiencia puede copiar. */
export function Prompt({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-2xl rounded-br-md bg-surface px-5 py-4 text-[17px] leading-snug", className)}>{children}</div>
  );
}
