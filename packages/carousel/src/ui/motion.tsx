import type { CSSProperties, ReactNode } from "react";
import { cx } from "./cx.ts";

/**
 * Movimiento (experimento, workflows/carrusel.md): una lámina con algo animado
 * sale también como MP4. Las animaciones son CSS que el render pasa cuadro a
 * cuadro; la lámina fija y la que mira el inspector son el último cuadro, así
 * que todo tiene que verse completo al final. Tiempos en segundos desde que
 * arranca la lámina.
 */
export type Tiempo = { en: number; dur?: number };

export const EFECTOS = ["aparece", "sube", "salta", "crece", "traza"] as const;
export type Efecto = (typeof EFECTOS)[number];

export function animStyle(t: Tiempo): CSSProperties {
  return { "--en": `${t.en}s`, ...(t.dur !== undefined ? { "--dur": `${t.dur}s` } : {}) } as CSSProperties;
}

/**
 * Anima lo que envuelve:
 * - aparece: se funde y sube un poco;
 * - sube: entra desde abajo;
 * - salta: crece desde chico con rebote (íconos, puntos, nodos);
 * - crece: se estira de izquierda a derecha (barras, líneas);
 * - traza: dibuja los trazos SVG de adentro como a mano (solo trazos continuos).
 */
export function Anim({
  efecto = "aparece",
  en = 0,
  dur,
  inline = false,
  children,
  className,
}: {
  efecto?: Efecto;
  en?: number;
  dur?: number;
  inline?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const Tag = inline ? "span" : "div";
  return (
    <Tag data-anim={efecto} style={animStyle({ en, dur })} className={cx(inline && "inline-block", className)}>
      {children}
    </Tag>
  );
}

/** Número con separadores (punto decimal, coma de miles), igual en la lámina fija y en el video. */
export function formatoNumero(valor: number, decimales?: number): string {
  const d = decimales ?? (Number.isInteger(valor) ? 0 : Math.abs(valor) < 10 ? 2 : 1);
  return new Intl.NumberFormat("es-MX", { minimumFractionDigits: d, maximumFractionDigits: d }).format(valor);
}

/** Un número que cuenta hasta su valor en el video. En la lámina fija se ve el valor final. */
export function Cuenta({
  hasta,
  desde = 0,
  en = 0,
  dur = 1.2,
  decimales,
  prefijo = "",
  sufijo = "",
  className,
}: {
  hasta: number;
  desde?: number;
  en?: number;
  dur?: number;
  decimales?: number;
  prefijo?: string;
  sufijo?: string;
  className?: string;
}) {
  return (
    <span
      data-cuenta=""
      data-desde={desde}
      data-hasta={hasta}
      data-en={en}
      data-dur={dur}
      data-decimales={decimales ?? ""}
      data-prefijo={prefijo}
      data-sufijo={sufijo}
      className={cx("tabular-nums", className)}
    >
      {prefijo}
      {formatoNumero(hasta, decimales)}
      {sufijo}
    </span>
  );
}

/**
 * Las animaciones de [data-anim]. Solo tienen keyframe de salida (from): al
 * terminar, cada elemento queda con su estilo normal, transformaciones incluidas.
 * Ninguna es infinita: el video tiene principio y fin.
 */
export const MOTION_CSS = `
[data-anim] { animation-duration: var(--dur, .6s); animation-delay: var(--en, 0s); animation-fill-mode: both; animation-timing-function: cubic-bezier(.2, .7, .2, 1); }
[data-anim="aparece"] { animation-name: motor-aparece; }
[data-anim="sube"] { animation-name: motor-sube; }
[data-anim="salta"] { animation-name: motor-salta; animation-timing-function: cubic-bezier(.3, 1.6, .5, 1); transform-box: fill-box; transform-origin: center; }
[data-anim="crece"] { animation-name: motor-crece; transform-origin: left center; }
[data-anim="traza"] :is(path, line, polyline, polygon, circle, ellipse, rect) { stroke-dasharray: 1; stroke-dashoffset: 0; animation: motor-traza var(--dur, .8s) cubic-bezier(.6, 0, .3, 1) var(--en, 0s) both; }
@keyframes motor-aparece { from { opacity: 0; transform: translateY(8px); } }
@keyframes motor-sube { from { opacity: 0; transform: translateY(32px); } }
@keyframes motor-salta { from { opacity: 0; transform: scale(.4); } }
@keyframes motor-crece { from { transform: scaleX(0); } }
@keyframes motor-traza { from { stroke-dashoffset: 1; } }
`;
