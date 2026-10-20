import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import rough from "roughjs";
import { REPO_ROOT } from "../../../brand/src/index.ts";
import { cx, Icono } from "./index.tsx";
import { animStyle, Cuenta, formatoNumero, type Tiempo } from "./motion.tsx";

/**
 * Primitivas para el recurso visual de cada lámina
 * (skills/carrusel-taste/recursos.json). Toman el color de la paleta
 * (currentColor y las clases text-accent, text-muted...) y marcan su raíz con
 * data-visual para que el inspector mida cuánto de la lámina se ve en vez de
 * leerse. Flecha y Etiqueta son conectores (data-conector): unen y señalan,
 * pero solas no cuentan como recurso. Medidas en px de diseño (lienzo de 540).
 */

type Punto = readonly [number, number];
type Tono = "ink" | "accent" | "muted" | "surface";

const TEXTO_TONO: Record<Tono, string> = { ink: "text-ink", accent: "text-accent", muted: "text-muted", surface: "text-surface" };

const generador = rough.generator();
const redondear = (d: string) => d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10));

/** Semilla estable a partir del trazo: el dibujo a mano no cambia entre renders. */
function semillaDe(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) h = Math.imul(h ^ texto.charCodeAt(i), 16777619);
  return ((h >>> 0) % 2147483646) + 1;
}

/** Un trazo SVG dibujado a mano con rough.js (MIT), en currentColor. */
function aMano(d: string, grosor: number, relleno = false, aspereza = 1.2) {
  const dibujo = generador.path(d, {
    roughness: aspereza,
    bowing: 1,
    stroke: "currentColor",
    strokeWidth: grosor,
    fill: relleno ? "currentColor" : undefined,
    fillStyle: "hachure",
    hachureGap: 7,
    fillWeight: Math.max(1, grosor * 0.5),
    seed: semillaDe(d),
  });
  return generador.toPaths(dibujo).map((p) => ({ d: redondear(p.d), stroke: p.stroke, strokeWidth: p.strokeWidth, fill: p.fill ?? "none" }));
}

/**
 * Flecha de un punto a otro, para unir o señalar. Va dentro de un contenedor
 * `relative` con alto fijo; las coordenadas son px desde su esquina superior
 * izquierda. `curva` de -1 a 1 (0 es recta); `mano` la dibuja a mano.
 */
export function Flecha({
  de,
  a,
  curva = 0,
  punta = "fin",
  mano = false,
  punteada = false,
  grosor = 2.5,
  className,
  anim,
}: {
  de: Punto;
  a: Punto;
  curva?: number;
  punta?: "fin" | "inicio" | "ambas" | "ninguna";
  mano?: boolean;
  punteada?: boolean;
  grosor?: number;
  className?: string;
  anim?: Tiempo;
}) {
  const [x1, y1] = de;
  const [x2, y2] = a;
  const largo = Math.hypot(x2 - x1, y2 - y1) || 1;
  const qx = (x1 + x2) / 2 - ((y2 - y1) / largo) * curva * largo * 0.5;
  const qy = (y1 + y2) / 2 + ((x2 - x1) / largo) * curva * largo * 0.5;
  const cuerpo = `M${x1} ${y1} Q${qx} ${qy} ${x2} ${y2}`;
  const cabeza = (px: number, py: number) => {
    const ang = Math.atan2(py - qy, px - qx);
    const t = 9 + grosor * 2;
    return `M${px - t * Math.cos(ang - 0.5)} ${py - t * Math.sin(ang - 0.5)} L${px} ${py} L${px - t * Math.cos(ang + 0.5)} ${py - t * Math.sin(ang + 0.5)}`;
  };
  const cabezas = [punta === "fin" || punta === "ambas" ? cabeza(x2, y2) : null, punta === "inicio" || punta === "ambas" ? cabeza(x1, y1) : null].filter(
    (c): c is string => c !== null,
  );
  const traza = anim && !punteada;
  const trazos = (d: string) =>
    mano ? aMano(d, grosor) : [{ d: redondear(d), stroke: "currentColor", strokeWidth: grosor, fill: "none" }];
  return (
    <svg
      aria-hidden
      data-conector="flecha"
      data-anim={anim && punteada ? "aparece" : undefined}
      style={anim && punteada ? animStyle(anim) : undefined}
      className={cx("pointer-events-none absolute inset-0 h-full w-full overflow-visible text-accent", className)}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g data-anim={traza ? "traza" : undefined} style={traza ? animStyle(anim) : undefined}>
        {trazos(cuerpo).map((p, i) => (
          <path key={i} {...p} strokeDasharray={punteada ? `${grosor * 2.4} ${grosor * 2.4}` : undefined} pathLength={traza ? 1 : undefined} />
        ))}
      </g>
      <g data-anim={traza ? "aparece" : undefined} style={traza ? animStyle({ en: anim.en + (anim.dur ?? 0.8) * 0.85, dur: 0.25 }) : undefined}>
        {cabezas.flatMap((c, i) => trazos(c).map((p, j) => <path key={`${i}-${j}`} {...p} />))}
      </g>
    </svg>
  );
}

/**
 * Etiqueta con línea guía que apunta a una parte de lo que se ve: el texto va
 * pegado a lo que nombra, no en una leyenda aparte. Mismo sistema de
 * coordenadas que Flecha. `ancho` deja que el texto ocupe varias líneas.
 */
export function Etiqueta({
  en,
  hacia = "derecha",
  largo = 40,
  punto = true,
  ancho,
  children,
  className,
  anim,
}: {
  en: Punto;
  hacia?: "derecha" | "izquierda" | "arriba" | "abajo";
  largo?: number;
  punto?: boolean;
  ancho?: number;
  children: ReactNode;
  className?: string;
  anim?: Tiempo;
}) {
  const [x, y] = en;
  const fines: Record<typeof hacia, Punto> = { derecha: [x + largo, y], izquierda: [x - largo, y], arriba: [x, y - largo], abajo: [x, y + largo] };
  const fin = fines[hacia];
  const posicion: CSSProperties = {
    derecha: { left: fin[0] + 6, top: fin[1], transform: "translateY(-50%)" },
    izquierda: { left: fin[0] - 6, top: fin[1], transform: "translate(-100%, -50%)", textAlign: "right" as const },
    arriba: { left: fin[0], top: fin[1] - 4, transform: "translate(-50%, -100%)", textAlign: "center" as const },
    abajo: { left: fin[0], top: fin[1] + 4, transform: "translateX(-50%)", textAlign: "center" as const },
  }[hacia];
  return (
    <div
      data-conector="etiqueta"
      data-anim={anim ? "aparece" : undefined}
      style={anim ? animStyle(anim) : undefined}
      className={cx("pointer-events-none absolute inset-0", className)}
    >
      <svg aria-hidden className="absolute inset-0 h-full w-full overflow-visible" fill="none">
        <line x1={x} y1={y} x2={fin[0]} y2={fin[1]} className="stroke-muted" strokeWidth="2" />
        {punto ? <circle cx={x} cy={y} r="4" className="fill-accent" /> : null}
      </svg>
      <span
        className={cx("absolute text-[16px] font-semibold leading-tight", ancho ? "whitespace-normal" : "whitespace-nowrap")}
        style={{ ...posicion, width: ancho }}
      >
        {children}
      </span>
    </div>
  );
}

const NODO_TONO = {
  surface: "bg-surface text-ink",
  accent: "bg-accent text-accent-ink",
  contorno: "border-2 border-current text-ink",
  tenue: "border-2 border-dashed border-muted text-muted",
} as const;

const NODO_FORMA = {
  caja: "rounded-2xl px-4 py-3",
  circulo: "aspect-square justify-center rounded-full p-4",
  pastilla: "rounded-full px-5 py-2.5",
} as const;

/**
 * Una parte de un diagrama: ícono (Lucide) u objeto (Fluent Emoji), título y,
 * si hace falta, una línea más. `fila` pone el ícono a la izquierda.
 */
export function Nodo({
  titulo,
  texto,
  icono,
  objeto,
  forma = "caja",
  tono = "surface",
  fila = false,
  ancho,
  className,
  anim,
}: {
  titulo: ReactNode;
  texto?: ReactNode;
  icono?: string;
  objeto?: string;
  forma?: keyof typeof NODO_FORMA;
  tono?: keyof typeof NODO_TONO;
  fila?: boolean;
  ancho?: number;
  className?: string;
  anim?: Tiempo;
}) {
  const marca = objeto ? <Objeto nombre={objeto} size={fila ? 40 : 48} /> : icono ? <Icono name={icono} size={fila ? 30 : 36} ancla={false} /> : null;
  return (
    <div
      data-visual="nodo"
      data-anim={anim ? "salta" : undefined}
      style={{ width: ancho, ...(anim ? animStyle(anim) : {}) }}
      className={cx(
        "flex gap-1.5",
        fila ? "flex-row items-center gap-3 text-left" : "flex-col items-center text-center",
        NODO_TONO[tono],
        NODO_FORMA[forma],
        className,
      )}
    >
      {marca}
      <div className={cx("flex min-w-0 flex-col", fila ? "items-start" : "items-center")}>
        <span className="text-[17px] font-bold leading-tight">{titulo}</span>
        {texto ? <span className="mt-0.5 text-[16px] leading-snug">{texto}</span> : null}
      </div>
    </div>
  );
}

function Conector({ vertical, anim }: { vertical: boolean; anim?: Tiempo }) {
  return (
    <svg
      aria-hidden
      viewBox={vertical ? "0 0 24 26" : "0 0 26 24"}
      width={vertical ? 24 : 26}
      height={vertical ? 26 : 24}
      className="shrink-0 self-center text-muted"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      data-anim={anim ? "aparece" : undefined}
      style={anim ? animStyle(anim) : undefined}
    >
      {vertical ? <path d="M12 3 V22 M6 16 L12 22 L18 16" /> : <path d="M3 12 H22 M16 6 L22 12 L16 18" />}
    </svg>
  );
}

/**
 * Pasos conectados con flechas, en el orden en que pasan. `destacado` es el
 * índice del paso que importa (va en el acento). Con `anim`, los pasos entran
 * uno detrás de otro cada `paso` segundos.
 */
export function Proceso({
  pasos,
  direccion = "vertical",
  destacado,
  className,
  anim,
}: {
  pasos: { titulo: ReactNode; texto?: ReactNode; icono?: string; objeto?: string }[];
  direccion?: "vertical" | "horizontal";
  destacado?: number;
  className?: string;
  anim?: Tiempo & { paso?: number };
}) {
  const vertical = direccion === "vertical";
  const paso = anim?.paso ?? 0.4;
  return (
    <div data-visual="proceso" className={cx("flex", vertical ? "flex-col gap-1.5" : "flex-row items-stretch gap-1.5", className)}>
      {pasos.map((p, i) => (
        <Fragment key={i}>
          {i > 0 ? <Conector vertical={vertical} anim={anim ? { en: anim.en + (i - 0.4) * paso, dur: 0.3 } : undefined} /> : null}
          <Nodo
            {...p}
            fila={vertical}
            tono={i === destacado ? "accent" : "surface"}
            className={vertical ? undefined : "min-w-0 flex-1"}
            anim={anim ? { en: anim.en + i * paso, dur: 0.45 } : undefined}
          />
        </Fragment>
      ))}
    </div>
  );
}

/**
 * Barras proporcionales con la etiqueta y el valor en la misma fila. Los
 * números salen de facts.json; la fuente va en una Nota. `destacar` es el
 * índice o la etiqueta de la barra que importa.
 */
export function Barras({
  datos,
  max,
  prefijo = "",
  sufijo = "",
  decimales,
  destacar,
  className,
  anim,
}: {
  datos: { etiqueta: ReactNode; valor: number }[];
  max?: number;
  prefijo?: string;
  sufijo?: string;
  decimales?: number;
  destacar?: number | string;
  className?: string;
  anim?: Tiempo & { paso?: number };
}) {
  const tope = max ?? (Math.max(...datos.map((d) => d.valor)) || 1);
  const paso = anim?.paso ?? 0.2;
  return (
    <div data-visual="barras" className={cx("flex flex-col gap-5", className)}>
      {datos.map((d, i) => {
        const marcada = destacar === i || destacar === d.etiqueta;
        const t = anim ? { en: anim.en + i * paso, dur: anim.dur ?? 0.9 } : undefined;
        return (
          <div key={i}>
            <div className="flex items-baseline justify-between gap-3 text-[18px] leading-tight">
              <span className={cx("font-semibold", marcada ? "text-ink" : "text-muted")}>{d.etiqueta}</span>
              <span className={cx("font-bold", marcada ? "text-accent" : "text-ink")}>
                {t ? (
                  <Cuenta hasta={d.valor} en={t.en} dur={t.dur} decimales={decimales} prefijo={prefijo} sufijo={sufijo} />
                ) : (
                  <span className="tabular-nums">{`${prefijo}${formatoNumero(d.valor, decimales)}${sufijo}`}</span>
                )}
              </span>
            </div>
            <div className="mt-2 h-[18px] w-full overflow-hidden rounded-full bg-muted/20">
              <div
                data-anim={t ? "crece" : undefined}
                style={{ width: `${Math.min(100, (d.valor / tope) * 100)}%`, ...(t ? animStyle(t) : {}) }}
                className={cx("h-full rounded-full", marcada ? "bg-accent" : "bg-muted/70")}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * La cifra gigante: un número que domina la lámina, con su unidad más chica y
 * una línea que diga qué significa. Con `anim` cuenta hasta el valor en el video.
 */
export function Cifra({
  valor,
  unidad,
  prefijo = "",
  decimales,
  texto,
  tamano = 112,
  unidadTamano,
  tono = "accent",
  className,
  anim,
}: {
  valor: number | string;
  unidad?: string;
  prefijo?: string;
  decimales?: number;
  texto?: ReactNode;
  tamano?: number;
  /** Tamaño de la unidad; por defecto, el 42% del número. Igualarlo al del título ahorra un tamaño de letra. */
  unidadTamano?: number;
  tono?: "accent" | "ink";
  className?: string;
  anim?: Tiempo;
}) {
  const numero =
    typeof valor === "number" ? (
      anim ? (
        <Cuenta hasta={valor} en={anim.en} dur={anim.dur ?? 1.2} decimales={decimales} prefijo={prefijo} />
      ) : (
        `${prefijo}${formatoNumero(valor, decimales)}`
      )
    ) : (
      valor
    );
  return (
    <div data-visual="cifra" className={cx("flex flex-col", className)}>
      <span
        className={cx("font-display font-black leading-[0.9] tracking-tight tabular-nums", tono === "accent" ? "text-accent" : "text-ink")}
        style={{ fontSize: tamano }}
      >
        {numero}
        {unidad ? <span style={{ fontSize: unidadTamano ?? Math.round(tamano * 0.42) }}> {unidad}</span> : null}
      </span>
      {texto ? <span className="mt-3 text-[18px] leading-snug">{texto}</span> : null}
    </div>
  );
}

/**
 * Dos valores muy distintos en una escala logarítmica (cada marca es ×10), con
 * la proporción gigante arriba. Para cuando una cifra no se siente.
 */
export function Escala({
  de,
  a,
  className,
}: {
  de: { valor: number; etiqueta: ReactNode };
  a: { valor: number; etiqueta: ReactNode };
  className?: string;
}) {
  const bajo = Math.min(de.valor, a.valor);
  const alto = Math.max(de.valor, a.valor);
  const e0 = Math.floor(Math.log10(bajo));
  const e1 = Math.max(Math.ceil(Math.log10(alto)), e0 + 1);
  const pos = (v: number) => (Math.log10(v) - e0) / (e1 - e0);
  const proporcion = alto / bajo;
  const marca = (p: { valor: number; etiqueta: ReactNode }, arriba: boolean, destacado: boolean) => {
    const x = pos(p.valor);
    const alinear = x < 0.15 ? "translateX(0)" : x > 0.85 ? "translateX(-100%)" : "translateX(-50%)";
    return (
      <div className="absolute" style={{ left: `${x * 100}%`, top: 0, bottom: 0 }}>
        <span
          className={cx("absolute left-0 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full", destacado ? "bg-accent" : "bg-ink")}
        />
        <span
          className={cx("absolute whitespace-nowrap text-[16px] font-semibold", destacado ? "text-accent" : "text-ink")}
          style={{ transform: alinear, ...(arriba ? { bottom: "calc(50% + 14px)" } : { top: "calc(50% + 14px)" }) }}
        >
          {p.etiqueta}
        </span>
      </div>
    );
  };
  return (
    <div data-visual="escala" className={cx("flex flex-col", className)}>
      <span className="font-display text-[80px] font-black leading-none tracking-tight text-accent tabular-nums">
        ×{formatoNumero(proporcion, proporcion < 10 ? 1 : 0)}
      </span>
      <div className="relative mt-6 h-[96px]">
        <svg aria-hidden className="absolute inset-0 h-full w-full overflow-visible" fill="none">
          <line x1="0%" y1="48" x2="100%" y2="48" className="stroke-muted" strokeWidth="2" />
          {Array.from({ length: e1 - e0 + 1 }, (_, i) => (
            <line key={i} x1={`${(i / (e1 - e0)) * 100}%`} y1="40" x2={`${(i / (e1 - e0)) * 100}%`} y2="56" className="stroke-muted" strokeWidth="2" />
          ))}
        </svg>
        {marca(de.valor <= a.valor ? de : a, true, false)}
        {marca(de.valor <= a.valor ? a : de, false, true)}
      </div>
      <p data-nota className="text-[13px] text-muted">
        Escala logarítmica: cada marca es ×10.
      </p>
    </div>
  );
}

/** Hitos sobre una línea, en orden: fecha corta y dos o tres palabras. */
export function Linea({
  hitos,
  direccion = "horizontal",
  className,
  anim,
}: {
  hitos: { fecha: ReactNode; titulo: ReactNode; destacado?: boolean }[];
  direccion?: "horizontal" | "vertical";
  className?: string;
  anim?: Tiempo & { paso?: number };
}) {
  const paso = anim?.paso ?? 0.35;
  const t = (i: number) => (anim ? { en: anim.en + 0.3 + i * paso, dur: 0.45 } : undefined);
  const punto = (h: { destacado?: boolean }, i: number) => (
    <span
      data-anim={anim ? "salta" : undefined}
      style={anim ? animStyle(t(i)!) : undefined}
      className={cx("block size-[22px] shrink-0 rounded-full border-[3px]", h.destacado ? "border-accent bg-accent" : "border-muted bg-surface")}
    />
  );
  if (direccion === "vertical") {
    return (
      <div data-visual="linea" className={cx("relative flex flex-col gap-6", className)}>
        <div
          data-anim={anim ? "aparece" : undefined}
          style={anim ? animStyle({ en: anim.en, dur: 0.5 }) : undefined}
          className="absolute bottom-[11px] left-[10px] top-[11px] w-[3px] bg-muted/40"
        />
        {hitos.map((h, i) => (
          <div key={i} className="relative flex items-start gap-4">
            {punto(h, i)}
            <div data-anim={anim ? "aparece" : undefined} style={anim ? animStyle(t(i)!) : undefined} className="-mt-0.5">
              <p className={cx("text-[18px] font-bold leading-tight", h.destacado && "text-accent")}>{h.fecha}</p>
              <p className="text-[16px] leading-snug text-muted">{h.titulo}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  const n = hitos.length;
  return (
    <div data-visual="linea" className={cx("relative", className)}>
      <div
        data-anim={anim ? "crece" : undefined}
        style={{ left: `${50 / n}%`, right: `${50 / n}%`, ...(anim ? animStyle({ en: anim.en, dur: 0.6 }) : {}) }}
        className="absolute top-[9.5px] h-[3px] bg-muted/40"
      />
      <div className="grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {hitos.map((h, i) => (
          <div key={i} className="flex flex-col items-center px-1 text-center">
            {punto(h, i)}
            <div data-anim={anim ? "aparece" : undefined} style={anim ? animStyle(t(i)!) : undefined}>
              <p className={cx("mt-3 text-[18px] font-bold leading-tight", h.destacado && "text-accent")}>{h.fecha}</p>
              <p className="mt-1 text-[16px] leading-snug text-muted">{h.titulo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Opciones ubicadas en dos ejes con nombre. `x` e `y` van de 0 a 1 (abajo a la
 * izquierda es 0, 0). La etiqueta va al lado de cada punto; el recomendado, en el acento.
 */
export function Matriz({
  ejeX,
  ejeY,
  puntos,
  alto = 340,
  className,
  anim,
}: {
  ejeX: [ReactNode, ReactNode];
  ejeY: [ReactNode, ReactNode];
  puntos: { x: number; y: number; etiqueta: ReactNode; destacado?: boolean }[];
  alto?: number;
  className?: string;
  anim?: Tiempo & { paso?: number };
}) {
  const paso = anim?.paso ?? 0.25;
  return (
    <div data-visual="matriz" className={cx("flex flex-col", className)}>
      <span className="mb-2 text-[16px] font-semibold text-muted">↑ {ejeY[1]}</span>
      <div className="relative border-b-2 border-l-2 border-muted" style={{ height: alto }}>
        <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-muted/40" />
        <div className="absolute inset-y-0 left-1/2 border-l-2 border-dashed border-muted/40" />
        {puntos.map((p, i) => {
          const izquierda = p.x > 0.7;
          return (
            <div
              key={i}
              data-anim={anim ? "salta" : undefined}
              className="absolute"
              style={{ left: `${p.x * 100}%`, bottom: `${p.y * 100}%`, ...(anim ? animStyle({ en: anim.en + i * paso, dur: 0.45 }) : {}) }}
            >
              <span className={cx("absolute size-4 -translate-x-1/2 translate-y-1/2 rounded-full", p.destacado ? "bg-accent" : "bg-ink")} />
              <span
                className={cx("absolute whitespace-nowrap text-[16px] font-semibold leading-none", p.destacado ? "text-accent" : "text-ink")}
                style={izquierda ? { right: 14, bottom: -8 } : { left: 14, bottom: -8 }}
              >
                {p.etiqueta}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[16px] font-semibold text-muted">
        <span>{ejeY[0]} · {ejeX[0]}</span>
        <span>{ejeX[1]} →</span>
      </div>
    </div>
  );
}

/**
 * Dibujo a mano (rough.js) a partir de trazos SVG (`d`): cajas, círculos,
 * flechas, la mochila de una metáfora. `relleno` lo rellena con rayas.
 * Con `anim` cada trazo se dibuja uno detrás de otro.
 */
export function Boceto({
  ancho,
  alto,
  trazos,
  grosor = 2.5,
  aspereza = 1.2,
  className,
  anim,
}: {
  ancho: number;
  alto: number;
  trazos: (string | { d: string; relleno?: boolean; tono?: Tono })[];
  grosor?: number;
  aspereza?: number;
  className?: string;
  anim?: Tiempo & { paso?: number };
}) {
  const paso = anim?.paso ?? 0.3;
  return (
    <svg
      data-visual="boceto"
      viewBox={`0 0 ${ancho} ${alto}`}
      width={ancho}
      height={alto}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx("block max-w-full overflow-visible", className)}
    >
      {trazos.map((t, i) => {
        const trazo = typeof t === "string" ? { d: t } : t;
        return (
          <g
            key={i}
            className={TEXTO_TONO[trazo.tono ?? "ink"]}
            data-anim={anim ? "traza" : undefined}
            style={anim ? animStyle({ en: anim.en + i * paso, dur: anim.dur ?? 0.7 }) : undefined}
          >
            {aMano(trazo.d, grosor, trazo.relleno, aspereza).map((p, j) => (
              <path key={j} {...p} pathLength={anim ? 1 : undefined} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

const OBJETOS_DIR = join(REPO_ROOT, "assets/objetos");

/**
 * Un objeto cotidiano de Fluent Emoji (Microsoft, MIT) para metáforas: una
 * mochila, una linterna, un cerebro. Se baja con `npm run carrusel:objeto -- <nombre>`
 * a assets/objetos/. `estilo="3d"` usa la versión 3D (PNG de 256 px: hasta
 * ~128 px de diseño). Con `ancla` sirve de ancla de la portada en temas sin marca.
 */
export function Objeto({
  nombre,
  size = 96,
  estilo = "color",
  ancla = false,
  className,
  anim,
}: {
  nombre: string;
  size?: number;
  estilo?: "color" | "3d";
  ancla?: boolean;
  className?: string;
  anim?: Tiempo;
}) {
  const archivo = join(OBJETOS_DIR, estilo === "3d" ? `${nombre}.3d.png` : `${nombre}.svg`);
  if (!existsSync(archivo)) {
    throw new Error(`No está el objeto "${nombre}" (${estilo}) en assets/objetos. Búscalo y bájalo con: npm run carrusel:objeto -- ${nombre}${estilo === "3d" ? " --3d" : ""}`);
  }
  const mime = estilo === "3d" ? "image/png" : "image/svg+xml";
  return (
    <img
      data-visual="objeto"
      data-ancla={ancla ? "objeto" : undefined}
      data-anim={anim ? "salta" : undefined}
      style={anim ? animStyle(anim) : undefined}
      src={`data:${mime};base64,${readFileSync(archivo).toString("base64")}`}
      alt=""
      width={size}
      height={size}
      className={cx("block shrink-0", className)}
    />
  );
}

/**
 * Resaltado de marcador detrás de las palabras que importan, en el cuerpo, una
 * etiqueta o el código: señala dónde mirar sin agregar texto. En el título no
 * (docs/anti-slop.md: un solo color de título).
 */
export function Resalte({ children, className }: { children: ReactNode; className?: string }) {
  return <mark className={cx("rounded-[0.2em] bg-accent/25 px-[0.12em] text-inherit [box-decoration-break:clone]", className)}>{children}</mark>;
}
