import { existsSync, readFileSync } from "node:fs";
import { extname, isAbsolute, join } from "node:path";
import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import { svgPathBbox } from "svg-path-bbox";
import { twMerge } from "tailwind-merge";
import { REPO_ROOT, type AccountBrand } from "../../../brand/src/index.ts";
import { GESTOS, type Gesto as GestoId } from "../cierres.ts";
import type { Art } from "../post.ts";

/**
 * Primitivas para diseñar láminas.
 *
 * Lo constante es el marco semiconstante de <Slide>: la pestaña de archivo
 * arriba a la izquierda, la textura de puntos y la firma abajo. La forma no
 * cambia nunca; el color sale de la paleta de cada pieza (post.json → art).
 * Todo lo demás (composición, escala, ritmo) lo decide el agente con Tailwind.
 *
 * El lienzo mide 1080×1350, pero Tailwind está escalado 2x: piensa en un
 * lienzo de 540×675 y usa las clases normales (text-5xl, p-8, gap-6...).
 */

export type RenderContext = {
  brand: AccountBrand;
  art: Art;
  /** Texto de la pestaña del marco. */
  tab: string;
  index: number;
  total: number;
  /** Carpeta de la pieza, para resolver imágenes relativas. */
  dir: string;
};

export const SlideContext = createContext<RenderContext | null>(null);

export function useRender(): RenderContext {
  const ctx = useContext(SlideContext);
  if (!ctx) throw new Error("Las primitivas solo funcionan dentro del render del carrusel");
  return ctx;
}

/** Une clases dejando que las del agente ganen sobre las de la primitiva. */
export const cx = (...c: Array<string | false | null | undefined>) => twMerge(c.filter(Boolean).join(" "));

/**
 * Tonos de la paleta de la pieza. Cambiar de tono entre láminas da ritmo sin
 * salir de la paleta.
 */
export type Tone = "base" | "accent" | "invert" | "surface";

const TONE: Record<Tone, string> = {
  base: "bg-bg text-ink",
  accent: "bg-accent text-accent-ink",
  invert: "bg-ink text-bg",
  surface: "bg-surface text-ink",
};

const TAB: Record<Tone, string> = {
  base: "bg-accent text-accent-ink",
  accent: "bg-accent-ink text-accent",
  invert: "bg-accent text-accent-ink",
  surface: "bg-accent text-accent-ink",
};

const DOTS = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18'><circle cx='2' cy='2' r='1.4' fill='black'/></svg>",
)}")`;

/**
 * Una lámina con el marco semiconstante.
 * - `tone`: tono de la paleta para esta lámina.
 * - `className`: clases del área de contenido (composición libre).
 * - `frameClassName`: clases de la lámina completa (por ejemplo, otro fondo).
 * - `underlay`: capa detrás del contenido y delante de los puntos, para campos
 *   a sangre (la pantalla partida de "antes y después", por ejemplo).
 * - `swipe`: muestra "Desliza" junto a la firma (solo en la portada).
 * Si post.json → art.contador es true, las láminas interiores muestran n/N en
 * el pie (experimento que se decide con las métricas).
 */
export function Slide({
  children,
  tone = "base",
  className,
  frameClassName,
  underlay,
  swipe = false,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  frameClassName?: string;
  underlay?: ReactNode;
  swipe?: boolean;
}) {
  const { brand, tab, art, index, total } = useRender();
  const counter = !swipe && art.contador && index > 0 ? `${index + 1}/${total}` : null;
  const dots: CSSProperties = {
    backgroundColor: "currentColor",
    WebkitMaskImage: DOTS,
    maskImage: DOTS,
    WebkitMaskSize: "18px 18px",
    maskSize: "18px 18px",
  };
  return (
    <main data-slide className={cx("relative flex h-full w-full flex-col overflow-hidden", TONE[tone], frameClassName)}>
      <div aria-hidden data-frame="puntos" className="pointer-events-none absolute inset-0 opacity-[0.13]" style={dots} />
      {underlay}
      <div className="relative z-10 px-9">
        <span data-frame="pestaña" data-mono-ok className={cx("inline-block rounded-b-xl px-4 pb-2 pt-3 font-mono text-[14px] font-semibold", TAB[tone])}>
          {tab}
        </span>
      </div>
      <section data-content className={cx("relative z-10 flex min-h-0 flex-1 flex-col px-9 pt-7", className)}>
        {children}
      </section>
      <footer data-brand className="relative z-10 flex items-center justify-between px-9 pb-7 pt-4 text-[13px] leading-none">
        <span className="flex items-center gap-2.5">
          <span className="font-mono font-semibold" data-mono-ok>
            {brand.glyph}
          </span>
          <span className="opacity-80">{brand.handle}</span>
        </span>
        {swipe ? <span className="font-medium opacity-80">Desliza</span> : null}
        {counter ? <span className="font-medium tabular-nums opacity-80">{counter}</span> : null}
      </footer>
    </main>
  );
}

type SimpleIcon = { title: string; slug: string; hex: string; source: string; guidelines?: string };
let SIMPLE_ICONS: SimpleIcon[] | null = null;

/** Metadatos de un ícono de Simple Icons por su slug. */
export function simpleIcon(slug: string): SimpleIcon & { path: string } {
  SIMPLE_ICONS ??= JSON.parse(readFileSync(join(REPO_ROOT, "node_modules/simple-icons/data/simple-icons.json"), "utf8")) as SimpleIcon[];
  const meta = SIMPLE_ICONS.find((i) => i.slug === slug);
  if (!meta) throw new Error(`No existe "${slug}" en Simple Icons. Busca el slug con: npm run carrusel:logo -- <marca>`);
  const svg = readFileSync(join(REPO_ROOT, "node_modules/simple-icons/icons", `${slug}.svg`), "utf8");
  const path = svg.match(/ d="([^"]+)"/)?.[1];
  if (!path) throw new Error(`El SVG de ${slug} no tiene un path simple`);
  return { ...meta, path };
}

/**
 * Logo o ícono oficial de una marca (Simple Icons, CC0), como ancla visual.
 * Se dibuja el archivo tal cual, en el color oficial, sin deformarlo; solo se
 * recorta el espacio vacío para que `size` mida la forma real.
 * Si el fondo no deja verlo, usa `chip` (ficha clara detrás) en vez de
 * cambiarle el color. El uso es para identificar el tema, no para sugerir
 * patrocinio; revisa las guías de la marca si las tiene.
 */
export function Logo({
  slug,
  size = 96,
  chip,
  className,
  ancla = true,
}: {
  slug: string;
  /** Lado mayor de la forma, en px del lienzo de 540. */
  size?: number;
  /** true para una ficha blanca, o un color #RRGGBB para la ficha. */
  chip?: boolean | string;
  className?: string;
  /** Marca el elemento como ancla visual para el inspector. */
  ancla?: boolean;
}) {
  const icon = simpleIcon(slug);
  const [x0, y0, x1, y1] = svgPathBbox(icon.path);
  const w = x1 - x0;
  const h = y1 - y0;
  const scale = size / Math.max(w, h);
  const svg = (
    <svg
      role="img"
      aria-label={icon.title}
      viewBox={`${x0} ${y0} ${w} ${h}`}
      width={Math.round(w * scale)}
      height={Math.round(h * scale)}
      className={chip ? "block" : cx("block shrink-0", className)}
      data-ancla={!chip && ancla ? "logo" : undefined}
    >
      <path d={icon.path} fill={`#${icon.hex}`} />
    </svg>
  );
  if (!chip) return svg;
  const pad = Math.round(size * 0.24);
  return (
    <span
      data-ancla={ancla ? "logo" : undefined}
      className={cx("inline-flex shrink-0 items-center justify-center self-start rounded-[28%]", className)}
      style={{ background: chip === true ? "#FFFFFF" : chip, padding: pad }}
    >
      {svg}
    </span>
  );
}

/**
 * Ícono genérico de Lucide (ISC) para temas sin marca: un objeto grande que
 * diga el tema (una calculadora, un candado, un cohete). El color sale del
 * texto (text-accent, text-ink...). No lo uses como viñeta.
 */
export function Icono({
  name,
  size = 120,
  strokeWidth = 1.75,
  className,
  ancla = true,
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  ancla?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx("block shrink-0", className)}
      data-ancla={ancla ? "icono" : undefined}
      dangerouslySetInnerHTML={{ __html: lucide(name) }}
    />
  );
}

/** El contenido de un ícono de Lucide, sin la etiqueta <svg>. */
function lucide(name: string): string {
  const file = join(REPO_ROOT, "node_modules/lucide-static/icons", `${name}.svg`);
  if (!existsSync(file)) throw new Error(`No existe el ícono "${name}" en Lucide. Revisa los nombres en https://lucide.dev/icons`);
  return readFileSync(file, "utf8").replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
}

/**
 * El gesto que pide el CTA (guardar, enviar, comentar, me-gusta, seguir,
 * repostear), para la última lámina. Son íconos genéricos de Lucide (ISC), no
 * copias de los de Instagram. `lleno` lo dibuja relleno, como cuando ya se
 * tocó; se ve bien en guardar, me-gusta, enviar y comentar. El color sale del
 * texto (text-accent, text-ink...). Cómo usarlo: skills/carrusel-taste/cierres.json.
 */
export function Gesto({
  accion,
  size = 96,
  lleno = false,
  strokeWidth = 2,
  className,
  style,
}: {
  accion: GestoId;
  size?: number;
  lleno?: boolean;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const name = GESTOS[accion];
  if (!name) throw new Error(`Gesto desconocido: "${accion}". Usa uno de: ${Object.keys(GESTOS).join(", ")}`);
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={lleno ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx("block shrink-0", className)}
      style={style}
      aria-hidden
      data-gesto={accion}
      data-lleno={lleno ? "" : undefined}
      dangerouslySetInnerHTML={{ __html: lucide(name) }}
    />
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
      className={cx("overflow-hidden whitespace-pre rounded-xl bg-[#0d1117] p-5 font-mono text-[15px] leading-relaxed text-[#e6edf3]", className)}
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
    <div data-ui className={cx("overflow-hidden rounded-xl bg-[#0d1117] text-[#e6edf3]", className)}>
      <div className="flex items-center gap-2 bg-white/5 px-4 py-2.5">
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
 * Imagen local (captura real, recurso de prensa, foto con licencia).
 * `src` es relativo a la carpeta de la pieza. `credit` se muestra pequeño
 * cuando la imagen no es tuya. `ancla` la marca como ancla visual.
 * Recortar está bien; retocar el contenido de una captura, no.
 */
export function Img({
  src,
  alt,
  className,
  credit,
  ancla = false,
}: {
  src: string;
  alt: string;
  className?: string;
  credit?: string;
  ancla?: boolean;
}) {
  const { dir } = useRender();
  const path = isAbsolute(src) ? src : join(dir, src);
  const mime = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml" }[
    extname(path).toLowerCase()
  ];
  if (!mime) throw new Error(`Formato de imagen no soportado: ${src}`);
  const data = readFileSync(path).toString("base64");
  return (
    <figure className="relative" data-ancla={ancla ? "imagen" : undefined}>
      <img src={`data:${mime};base64,${data}`} alt={alt} className={cx("block", className)} />
      {credit ? (
        <figcaption data-nota className="mt-1.5 text-[13px] opacity-70">
          {credit}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * Letra pequeña que no es contenido: fuente, fecha, "ejemplo ilustrativo".
 * El inspector la deja en 24px reales (12px de diseño) y no la cuenta como palabras.
 */
export function Nota({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p data-nota className={cx("text-[13px] leading-snug text-muted", className)}>
      {children}
    </p>
  );
}

/** Burbuja de chat: un prompt real que la audiencia puede copiar. */
export function Prompt({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-2xl rounded-br-md bg-surface px-5 py-4 text-[17px] leading-snug", className)}>{children}</div>
  );
}

// Recursos visuales (skills/carrusel-taste/recursos.json) y movimiento.
export * from "./visual.tsx";
export * from "./motion.tsx";
