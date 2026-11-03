import { type CSSProperties, type ReactNode } from "react";
import { interpolate, spring } from "remotion";
import { Icono } from "@motor/ui";
import { defineVideo, Sfx, useStage, useStageCue } from "@motor/video";
import fits from "./ajustes.json";

// One graph (video.json → world): graph paper with the real Iris flowers, placed by the length and
// the width of their petal, and one flower with its name covered. One pencil stroke turns into what
// each algorithm draws: a line, an S, cuts, a road, and the eraser leaves nothing.
// Every number and every shape comes from ajustes.json, written by ajustes.py with real fits.

/* ---------- Palette, scales and the data ---------- */

const PAPER = "#F5F1E6";
const CARD = "#FFFDF6";
const INK = "#17211C";
const LEAD = "#C93A0A";
const MUTED = "#5C6258";
const SPECIES = ["#0E8F6E", "#2067C9", "#B5309E"];
const NAMES = ["setosa", "versicolor", "virgínica"];

const PLOT = { l: 70, r: 510, t: 146, b: 742 };
const XMAX = 7.4;
const YMAX = 2.75;
const sx = (cm: number) => PLOT.l + (cm / XMAX) * (PLOT.r - PLOT.l);
const sy = (cm: number) => PLOT.b - (cm / YMAX) * (PLOT.b - PLOT.t);
/** The vertical scale while the axis is a probability. */
const P_TOP = 172;
const P_BOT = 724;
const py = (p: number) => P_BOT + (P_TOP - P_BOT) * p;

const es = (value: number, digits: number) => value.toFixed(digits).replace(".", ",");
const pct = (value: number) => `${Math.round(value * 100)}`;

const LINEAR = { slope: fits.linear.slope, intercept: fits.linear.intercept };
const prob = (cm: number) => 1 / (1 + Math.exp(-(fits.logistic.b0 + fits.logistic.b1 * cm)));
const HIDDEN = { x: sx(fits.hidden.x), y: sy(fits.hidden.y) };
const P_HIDDEN = fits.logistic.hiddenProbability;

const CUT = { low: fits.tree.cuts[0].threshold, high: fits.tree.cuts[1].threshold, side: fits.tree.cuts[2].threshold };
const [W1, W2] = fits.svm.w;
const SVM_B = fits.svm.b;
/** Where a line a·x + b·y + c = 0 crosses the bottom (y = 0) and the top (y = YMAX) of the plot, in cm. */
const crossings = (a: number, b: number, c: number) => ({ bottom: -c / a, top: (-c - b * YMAX) / a });
const SVM_LINE = crossings(W1, W2, SVM_B);
const SVM_UP = crossings(W1, W2, SVM_B - 1);
const SVM_DOWN = crossings(W1, W2, SVM_B + 1);
const [K1, K2] = fits.svm.kernel.straightLine.w;
const K_B = fits.svm.kernel.straightLine.b;
const KERNEL_LINE = crossings(K1, K2, K_B);
const BENT_SIDE = fits.svm.kernel.bentVersicolorRuns.map(([x0, x1, y0, y1]) => `M${sx(x0).toFixed(1)} ${sy(y0).toFixed(1)}H${sx(x1).toFixed(1)}V${sy(y1).toFixed(1)}H${sx(x0).toFixed(1)}Z`).join("");
const BENT = fits.svm.kernel.bentSegments.map(([a, b]) => `M${sx(a[0]).toFixed(1)} ${sy(a[1]).toFixed(1)}L${sx(b[0]).toFixed(1)} ${sy(b[1]).toFixed(1)}`).join("");

type Flower = { x: number; y: number; species: number; px: number; py: number; stackX: number; stackY: number; residual: number; wave: number; wrongLine: boolean; distance: number };

/** Flowers with the same measures sit a little apart, so the 149 can be seen; each pile keeps its real place. */
const FLOWERS: Flower[] = (() => {
  const same = new Map<string, number>();
  const stacked = new Map<string, number>();
  return fits.flowers.map((f, i) => {
    const key = `${f.x},${f.y}`;
    const k = same.get(key) ?? 0;
    same.set(key, k + 1);
    const top = f.species === 2;
    const column = `${top},${f.x}`;
    const h = stacked.get(column) ?? 0;
    stacked.set(column, h + 1);
    const angle = k * 2.4;
    const reach = k ? 3.6 * Math.sqrt(k) : 0;
    return {
      x: f.x,
      y: f.y,
      species: f.species,
      px: sx(f.x) + Math.cos(angle) * reach,
      py: sy(f.y) + Math.sin(angle) * reach,
      stackX: sx(f.x),
      stackY: top ? P_TOP + h * 8 : P_BOT - h * 8,
      residual: f.y - (LINEAR.slope * f.x + LINEAR.intercept),
      wave: (i * 0.618) % 1,
      wrongLine: f.species !== 0 && K1 * f.x + K2 * f.y + K_B > 0 !== (f.species === 2),
      distance: Math.hypot(f.x - fits.hidden.x, f.y - fits.hidden.y),
    };
  });
})();

const indexOf = (x: number, y: number, species: number, from = 0) => FLOWERS.findIndex((f, i) => i >= from && f.x === x && f.y === y && f.species === species);
const SUPPORT = fits.svm.support.map((p) => {
  const setosa = indexOf(p.x, p.y, 0);
  return setosa >= 0 ? setosa : indexOf(p.x, p.y, 1);
});
const NEIGHBOURS = (() => {
  const used: number[] = [];
  return fits.knn.neighbours.map((n) => {
    const species = NAMES.indexOf(n.species === "virginica" ? "virgínica" : n.species);
    let i = indexOf(n.x, n.y, species);
    while (used.includes(i)) i = indexOf(n.x, n.y, species, i + 1);
    used.push(i);
    return { index: i, distance: n.distance };
  });
})();
const KNN_REACH = Math.max(...NEIGHBOURS.map((n) => n.distance)) + 0.002;
const BY_DISTANCE = FLOWERS.map((_, i) => i).sort((a, b) => FLOWERS[a].distance - FLOWERS[b].distance);
const SQUARES = FLOWERS.map((_, i) => i)
  .sort((a, b) => Math.abs(FLOWERS[b].residual) - Math.abs(FLOWERS[a].residual))
  .slice(0, 14);

/** Lines that separate setosa from versicolor, as the crossings of the bottom and the top of the plot, in cm. */
const SEPARATORS = [
  [2.2, 2.2],
  [2.9, 1.6],
  [2.0, 2.8],
  [3.4, 0.9],
  [2.6, 2.4],
  [2.1, 3.0],
  [3.0, 1.3],
];

const sseOf = (slope: number, intercept: number) => FLOWERS.reduce((sum, f) => sum + (f.y - (slope * f.x + intercept)) ** 2, 0);

/* ---------- Time ---------- */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const unit = (t: number, at: number, dur: number) => Math.max(0, Math.min(1, (t - at) / Math.max(0.001, dur)));
const fade = (t: number, at: number, dur = 0.25) => interpolate(t, [at, at + dur], [0, 1], clamp);
const inOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const back = (p: number) => 1 + 2.4 * Math.pow(p - 1, 3) + 1.4 * Math.pow(p - 1, 2);
const bump = (t: number, at: number, dur: number) => {
  const p = unit(t, at, dur);
  return p <= 0 || p >= 1 ? 0 : Math.sin(p * Math.PI);
};
/** On from `a`, off from `b`. */
const span = (t: number, a: number, b: number, dur = 0.25) => fade(t, a, dur) * (1 - fade(t, b, dur));
const popAt = (t: number, at: number) => (t < at ? 0 : spring({ frame: (t - at) * 30, fps: 30, config: { damping: 10, stiffness: 180 } }));
const useT = () => useStage().ms / 1000;

function keys(t: number, list: Array<[number, number]>): number {
  if (t <= list[0][0]) return list[0][1];
  for (let i = 1; i < list.length; i++) {
    const [a, va] = list[i - 1];
    const [b, vb] = list[i];
    if (t < b) return va + (vb - va) * inOut((t - a) / Math.max(0.001, b - a));
  }
  return list[list.length - 1][1];
}

function useCues() {
  const q = useStageCue;
  return {
    g: { le: q("gancho", "le"), flor: q("gancho", "flor"), solo: q("gancho", "solo", 2), acierta: q("gancho", "acierta") },
    f: { start: q("flor", "son"), iris: q("flor", "iris"), y1936: q("flor", "1936"), largo: q("flor", "largo"), ancho: q("flor", "ancho"), tres: q("flor", "tres"), unico: q("flor", "único"), dibujan: q("flor", "dibujan"), aqui: q("flor", "aquí") },
    l: {
      start: q("lineal", "uno"),
      dibuja: q("lineal", "dibuja"),
      recta: q("lineal", "recta"),
      todas: q("lineal", "la"),
      error: q("lineal", "error"),
      mide: q("lineal", "suma"),
      suma: q("lineal", "flor"),
      cuadrado: q("lineal", "cuadrado"),
      no: q("lineal", "no"),
      predice: q("lineal", "número"),
      largo: q("lineal", "largo"),
      ancho: q("lineal", "ancho"),
      nuestra: q("lineal", "nuestra"),
      cinco: q("lineal", "cinco"),
      dice: q("lineal", "dice"),
      siete: q("lineal", "siete"),
      dos: q("lineal", "dos"),
    },
    r: {
      start: q("logistica", "dos"),
      regresion: q("logistica", "regresión", 2),
      pero: q("logistica", "pero"),
      clasifica: q("logistica", "clasifica"),
      suben: q("logistica", "suben"),
      bajan: q("logistica", "demás"),
      dobla: q("logistica", "dobla"),
      altura: q("logistica", "altura"),
      prob: q("logistica", "probabilidad"),
      con: q("logistica", "con"),
      cuatro2: q("logistica", "cuatro", 2),
      seis: q("logistica", "seis"),
      noventa: q("logistica", "noventa"),
      nuestra: q("logistica", "nuestra"),
      sesenta: q("logistica", "sesenta"),
      pasa: q("logistica", "pasa"),
      virginica: q("logistica", "virgínica"),
    },
    a: {
      start: q("arbol", "tres"),
      curvas: q("arbol", "curvas"),
      preguntas: q("arbol", "preguntas"),
      ancho: q("arbol", "ancho"),
      ocho: q("arbol", "ocho"),
      setosa: q("arbol", "setosa"),
      duda: q("arbol", "duda"),
      pasa2: q("arbol", "pasa", 2),
      cinco1: q("arbol", "cinco"),
      casi: q("arbol", "casi"),
      queda: q("arbol", "queda"),
      largo: q("arbol", "largo"),
      cinco3: q("arbol", "cinco", 3),
      tres2: q("arbol", "tres", 2),
      cuatro: q("arbol", "cuatro"),
      arbol2: q("arbol", "árbol", 2),
      mismo: q("arbol", "mismo"),
      nuestra: q("arbol", "nuestra"),
      versicolor: q("arbol", "versicolor"),
    },
    s: {
      start: q("svm", "cuatro"),
      svm: q("svm", "svm"),
      quedo: q("svm", "quedo"),
      infinitas: q("svm", "infinitas"),
      separan: q("svm", "separan"),
      busca: q("svm", "busca"),
      ancho: q("svm", "ancho"),
      uno: q("svm", "uno"),
      centimetros: q("svm", "centímetros"),
      apoya: q("svm", "apoya"),
      dos: q("svm", "dos"),
      borro: q("svm", "borro"),
      ajusto: q("svm", "ajusto"),
      no: q("svm", "no"),
      mueve: q("svm", "mueve"),
    },
    k: {
      start: q("kernel", "pero"),
      pisan: q("kernel", "pisan"),
      truco: q("kernel", "truco"),
      dobla: q("kernel", "dobla"),
      frontera: q("kernel", "frontera"),
      acierta: q("kernel", "acierta"),
      vio: q("kernel", "vio"),
      menos: q("kernel", "menos"),
      vio2: q("kernel", "vio", 2),
      doblar: q("kernel", "doblar"),
      memorizar: q("kernel", "memorizar"),
      recta: q("kernel", "recta"),
      versicolor: q("kernel", "versicolor", 2),
    },
    n: {
      start: q("knn", "cinco"),
      no: q("knn", "no"),
      nada: q("knn", "nada"),
      borro: q("knn", "borro"),
      aprendio: q("knn", "aprendió"),
      guardo: q("knn", "guardó"),
      llega: q("knn", "llega"),
      busca: q("knn", "busca"),
      votan: q("knn", "votan"),
      cuatro: q("knn", "cuatro"),
      una: q("knn", "una"),
      versicolor2: q("knn", "versicolor", 2),
      precio: q("knn", "precio"),
      cada: q("knn", "cada"),
      nueve: q("knn", "nueve"),
      millon: q("knn", "millón"),
      distancias: q("knn", "distancias"),
      cada2: q("knn", "cada", 2),
      vez: q("knn", "vez"),
    },
    v: {
      start: q("revela", "destapo"),
      virginica: q("revela", "virgínica"),
      ancho: q("revela", "ancho"),
      tres: q("revela", "tres"),
      versicolor: q("revela", "versicolor"),
      recta: q("revela", "recta"),
      acerto: q("revela", "acertó"),
      largo: q("revela", "largo"),
      mejor: q("revela", "mejor"),
      probadas: q("revela", "probadas"),
      noventa2: q("revela", "noventa", 2),
      esta: q("revela", "esta"),
      manda: q("revela", "manda"),
    },
    c: {
      start: q("cierre", "número"),
      prob: q("cierre", "probabilidad"),
      preguntas: q("cierre", "preguntas"),
      camino: q("cierre", "camino"),
      vecinos: q("cierre", "vecinos"),
      cinco: q("cierre", "cinco"),
      grafico: q("cierre", "gráfico"),
      guarda: q("cierre", "guarda"),
    },
  };
}
type Cues = ReturnType<typeof useCues>;

/* ---------- The camera ---------- */

const HOME = { x: 270, y: 456, z: 1 };
const FINAL_Z = 3.4;
type Shot = { at: number; dur: number; x: number; y: number; z: number };

function shots(c: Cues): Shot[] {
  const at = (when: number, x: number, y: number, z: number, dur = 0.75): Shot => ({ at: when, dur, x, y, z });
  const home = (when: number, dur = 0.75): Shot => at(when, HOME.x, HOME.y, HOME.z, dur);
  const overlap = { x: sx(5), y: sy(1.62) };
  return [
    at(c.g.le - 0.1, HIDDEN.x - 40, HIDDEN.y + 10, 1.35, 0.9),
    home(c.f.start - 0.1),
    at(c.l.mide, 300, 440, 1.14, 0.9),
    home(c.l.no),
    at(c.l.nuestra - 0.1, sx(4.2), sy(1.35), 1.28),
    home(c.r.start),
    at(c.r.nuestra - 0.1, HIDDEN.x, py(P_HIDDEN) + 20, 1.5),
    home(c.a.start - 0.3),
    at(c.a.queda - 0.1, sx(CUT.side), sy(1.3), 1.42),
    home(c.a.tres2 - 0.2),
    at(c.a.nuestra - 0.1, HIDDEN.x, HIDDEN.y, 2),
    home(c.s.start),
    at(c.s.uno - 0.2, sx(2.45), sy(0.8), 1.5),
    home(c.s.borro - 0.1),
    at(c.k.start + 0.1, overlap.x, overlap.y, 1.72, 0.9),
    home(c.n.start),
    at(c.n.llega - 0.1, HIDDEN.x, HIDDEN.y, 3.3, 0.9),
    home(c.n.precio - 0.1),
    at(c.v.start - 0.1, HIDDEN.x, HIDDEN.y, 3),
    home(c.v.tres - 0.3),
    at(c.v.esta - 0.1, HIDDEN.x, HIDDEN.y, FINAL_Z, 0.9),
    home(c.c.start - 0.5, 0.5),
  ];
}

function rigAt(t: number, list: Shot[]) {
  let state = { x: HOME.x, y: HOME.y, z: HOME.z };
  let moving = false;
  for (const shot of list) {
    if (t <= shot.at) break;
    const p = inOut(unit(t, shot.at, shot.dur));
    if (p < 1) moving = true;
    state = { x: lerp(state.x, shot.x, p), y: lerp(state.y, shot.y, p), z: lerp(state.z, shot.z, p) };
  }
  return { ...state, moving };
}

function shakeAt(t: number, hits: number[]) {
  let x = 0;
  let y = 0;
  for (const hit of hits) {
    const dt = t - hit;
    if (dt < 0 || dt > 0.4) continue;
    const amp = 8 * Math.exp(-dt * 11);
    x += Math.sin(dt * 78) * amp * 0.6;
    y += Math.cos(dt * 61) * amp;
  }
  return { x, y };
}

/* ---------- The stroke: one line that turns into everything ---------- */

function lineNow(t: number, c: Cues) {
  const a = c.l.todas;
  const b = c.l.error + 0.3;
  const steps: Array<[number, number, number]> = [
    [a, LINEAR.slope, LINEAR.intercept],
    [a + (b - a) * 0.3, 0.2, 0.62],
    [a + (b - a) * 0.6, 0.72, -1.3],
    [a + (b - a) * 0.82, 0.31, -0.06],
    [b, LINEAR.slope, LINEAR.intercept],
  ];
  return { slope: keys(t, steps.map(([at, s]) => [at, s])), intercept: keys(t, steps.map(([at, , i]) => [at, i])) };
}

const STROKE_POINTS = 70;

function strokePath(t: number, c: Cues) {
  const line = lineNow(t, c);
  const toS = inOut(unit(t, c.r.dobla, 0.9));
  const toCut = inOut(unit(t, c.a.ancho, c.a.ocho - c.a.ancho + 0.2));
  const toSvm = inOut(unit(t, c.s.svm, 0.8));
  const toKernel = inOut(unit(t, c.k.pisan - 0.7, 0.9));
  let d = "";
  for (let i = 0; i < STROKE_POINTS; i++) {
    const f = i / (STROKE_POINTS - 1);
    const cm = lerp(0.9, 7.3, f);
    let x = sx(cm);
    let y = sy(line.slope * cm + line.intercept);
    y = lerp(y, py(prob(cm)), toS);
    x = lerp(x, lerp(PLOT.l, PLOT.r, f), toCut);
    y = lerp(y, sy(CUT.low), toCut);
    x = lerp(x, sx(lerp(SVM_LINE.bottom, SVM_LINE.top, f)), toSvm);
    y = lerp(y, lerp(PLOT.b, PLOT.t, f), toSvm);
    x = lerp(x, sx(lerp(KERNEL_LINE.bottom, KERNEL_LINE.top, f)), toKernel);
    y = lerp(y, lerp(PLOT.b, PLOT.t, f), toKernel);
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

function eraserX(t: number, c: Cues) {
  return lerp(600, -80, inOut(unit(t, c.n.borro - 0.1, 0.8)));
}

/** Where the pencil's tip is, and how visible: it only comes in when it draws. */
function penAt(t: number, c: Cues) {
  const strokes: Array<[number, number, number, number, number, number]> = [
    [c.g.le - 0.35, c.g.flor, HIDDEN.x + 60, HIDDEN.y - 110, HIDDEN.x, HIDDEN.y],
    [c.f.dibujan, c.f.aqui + 0.4, sx(2.8), sy(1.1), sx(4.1), sy(0.85)],
    [c.l.dibuja, c.l.recta + 0.3, sx(0.9), sy(0), sx(7.3), sy(LINEAR.slope * 7.3 + LINEAR.intercept)],
    [c.r.dobla, c.r.dobla + 0.9, sx(7.3), sy(LINEAR.slope * 7.3 + LINEAR.intercept), sx(7.3), py(prob(7.3))],
    [c.a.ancho, c.a.ocho + 0.2, PLOT.l, sy(CUT.low), PLOT.r, sy(CUT.low)],
    [c.a.pasa2, c.a.cinco1 + 0.2, PLOT.l, sy(CUT.high), PLOT.r, sy(CUT.high)],
    [c.a.largo, c.a.cinco3 + 0.2, sx(CUT.side), sy(CUT.low), sx(CUT.side), sy(CUT.high)],
    [c.k.pisan - 0.7, c.k.pisan + 0.2, sx(KERNEL_LINE.bottom), PLOT.b, sx(KERNEL_LINE.top), PLOT.t],
    [c.k.dobla - 0.5, c.k.frontera + 0.3, sx(3.2), sy(2.6), sx(6.6), sy(1.0)],
  ];
  for (const [a, b, x0, y0, x1, y1] of strokes) {
    if (t < a - 0.3 || t > b + 0.3) continue;
    const p = inOut(unit(t, a, b - a));
    return { x: lerp(x0, x1, p), y: lerp(y0, y1, p), alpha: span(t, a - 0.3, b + 0.05, 0.22) };
  }
  return { x: 0, y: 0, alpha: 0 };
}

function Pencil({ x, y, alpha }: { x: number; y: number; alpha: number }) {
  if (alpha <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) rotate(34)`} opacity={alpha}>
      <polygon points="0,0 -4,-11 4,-11" fill={INK} />
      <polygon points="-4,-11 4,-11 10,-30 -10,-30" fill="#EBCB9F" />
      <rect x={-10} y={-122} width={20} height={92} fill="#F2B01E" />
      <rect x={-3.4} y={-122} width={6.8} height={92} fill="#D99A10" />
      <rect x={-10} y={-136} width={20} height={14} fill="#B9BEC4" />
      <path d="M-10 -136 v-8 a8 8 0 0 1 8 -8 h4 a8 8 0 0 1 8 8 v8 z" fill="#E86A7A" />
    </g>
  );
}

/* ---------- The graph ---------- */

function Paper() {
  const lines: ReactNode[] = [];
  const dx = (PLOT.r - PLOT.l) / (XMAX * 5);
  for (let i = 0; i <= XMAX * 5; i++) {
    const x = PLOT.l + i * dx;
    lines.push(<line key={`v${i}`} x1={x} y1={PLOT.t} x2={x} y2={PLOT.b} stroke={INK} strokeOpacity={i % 5 ? 0.05 : 0.13} strokeWidth={i % 5 ? 0.7 : 1} />);
  }
  const dy = (PLOT.b - PLOT.t) / (YMAX * 10);
  for (let i = 0; i <= YMAX * 10; i++) {
    const y = PLOT.b - i * dy;
    lines.push(<line key={`h${i}`} x1={PLOT.l} y1={y} x2={PLOT.r} y2={y} stroke={INK} strokeOpacity={i % 5 ? 0.05 : 0.13} strokeWidth={i % 5 ? 0.7 : 1} />);
  }
  return <>{lines}</>;
}

function FlowerDefs() {
  return (
    <defs>
      {SPECIES.map((color, i) => (
        <g id={`petals-${i}`} key={color}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={0} cy={-4.1} rx={3.1} ry={4.1} fill={color} stroke={PAPER} strokeWidth={0.55} transform={`rotate(${a})`} />
          ))}
          <circle r={2.1} fill="#FFD86B" stroke={PAPER} strokeWidth={0.4} />
        </g>
      ))}
    </defs>
  );
}

const sideOf = (f: Flower) => {
  if (f.y <= CUT.low) return { x: 0, y: 1 };
  if (f.y > CUT.high) return { x: 0, y: -1 };
  return f.x <= CUT.side ? { x: -0.7, y: 0 } : { x: 0.7, y: 0 };
};

const underTable = (t: number, c: Cues) => span(t, c.v.tres - 0.1, c.v.esta - 0.15, 0.25);
const separation = (t: number, c: Cues) => 8 * back(unit(t, c.a.cuatro, 0.45)) * (1 - inOut(unit(t, c.s.start, 0.5)));

const keepSize = (z: number) => Math.pow(1 / z, 0.6);

function flowerNow(f: Flower, i: number, t: number, c: Cues, z: number) {
  const speciesAt = f.species === 2 ? c.r.suben : c.r.bajan;
  const up = back(unit(t, speciesAt + f.wave * 0.28, 0.5));
  const down = inOut(unit(t, c.a.start + f.wave * 0.4, 0.7));
  const lift = up * (1 - down);
  const gap = separation(t, c);
  const side = sideOf(f);
  const x = lerp(f.px, f.stackX, lift) + side.x * gap;
  const y = lerp(f.py, f.stackY, lift) + side.y * gap;

  let scale = keepSize(z);
  let alpha = 1;
  // Each species says its name.
  scale += 0.6 * bump(t, c.f.tres + f.species * 0.22, 0.5);
  // They are real: a wave goes through the 150.
  scale += 0.55 * bump(t, c.f.start + f.wave * 0.7, 0.4);
  // The neighbour vote and the wave of what KNN keeps.
  scale += 0.7 * bump(t, c.n.guardo + (f.px / 540) * 0.5, 0.4);
  // SVM only looks at two species...
  const ghost = span(t, c.s.quedo, c.k.start);
  if (f.species === 2) alpha -= 0.86 * ghost;
  // ...and only needs two flowers.
  if (f.species !== 2 && !SUPPORT.includes(i)) {
    const gone = inOut(unit(t, c.s.borro + f.wave * 0.9, 0.3));
    const back_ = back(unit(t, c.k.start + f.wave * 0.5, 0.4));
    scale *= t < c.k.start ? 1 - gone : back_;
  }
  const near = NEIGHBOURS.find((n) => n.index === i);
  if (near) {
    const reach = (t - c.n.busca) / (c.n.votan - c.n.busca);
    const hitAt = c.n.busca + (near.distance / KNN_REACH) * (c.n.votan - c.n.busca);
    if (reach > 0 && t < c.n.precio) scale *= 1 + 0.5 * Math.min(1, popAt(t, hitAt));
  }
  const dim = 1 - underTable(t, c) - span(t, c.c.start - 0.5, 999, 0.4);
  return { x, y, scale, alpha: Math.max(0, alpha * dim), rot: Math.sin(t * 1.3 + i) * 11 };
}

function hiddenNow(t: number, c: Cues) {
  const down = inOut(unit(t, c.r.bajan, 0.6));
  const up = inOut(unit(t, c.r.nuestra, c.r.sesenta - c.r.nuestra + 0.1));
  const home = inOut(unit(t, c.a.start, 0.7));
  let x = HIDDEN.x;
  let y = lerp(HIDDEN.y, P_BOT, down);
  y = lerp(y, py(P_HIDDEN), up);
  y = lerp(y, HIDDEN.y, home);
  const gap = separation(t, c);
  x += fits.hidden.x <= CUT.side ? -0.7 * gap : 0.7 * gap;
  return { x, y };
}

function HiddenFlower({ c, z }: { c: Cues; z: number }) {
  const t = useT();
  const { x, y } = hiddenNow(t, c);
  const tap = bump(t, c.g.le + 0.3, 0.4);
  const peel = unit(t, c.v.start, 0.9);
  const grown = popAt(t, c.v.virginica);
  const ghost = 1 - 0.8 * span(t, c.s.quedo, c.k.start);
  const dim = 1 - span(t, c.c.start - 0.5, 999, 0.4) - underTable(t, c);
  const pulse = 1 + 0.08 * Math.sin(t * 5);
  const keep = keepSize(z) * Math.pow(1 / z, 0.15);
  const size = lerp(1.15 + 1.55 * Math.min(1.1, grown), 0.4, inOut(unit(t, c.v.esta - 0.1, 0.6)));
  const ring = span(t, c.v.esta + 0.3, c.c.start - 0.5, 0.25);
  return (
    <g opacity={ghost * dim}>
      <use href="#petals-2" transform={`translate(${x} ${y}) scale(${size}) rotate(${t * 8})`} opacity={fade(t, c.v.start - 0.1, 0.1)} />
      {peel < 1 ? (
        <g transform={`translate(${x + 70 * peel} ${y + 260 * peel * peel}) rotate(${150 * peel}) scale(${(1 + 0.45 * tap) * pulse * (1 - peel * 0.2) * keep})`} opacity={1 - peel}>
          <circle r={12.5} fill={LEAD} stroke={CARD} strokeWidth={2.4} />
          <text textAnchor="middle" y={5.6} fontSize={16} fontWeight={800} fill="#FFFFFF" fontFamily="var(--font-display)">
            ?
          </text>
        </g>
      ) : null}
      {peel < 1 ? <circle cx={x} cy={y} r={(15 + 7 * ((t * 0.9) % 1)) * keep} fill="none" stroke={LEAD} strokeWidth={1.3 * keep} opacity={0.8 * (1 - ((t * 0.9) % 1))} /> : null}
      {ring > 0 ? <circle cx={x} cy={y} r={4.4} fill="none" stroke={INK} strokeWidth={0.6} opacity={ring} /> : null}
    </g>
  );
}

function AxisTicks({ c, z }: { c: Cues; z: number }) {
  const t = useT();
  const probAxis = span(t, c.r.bajan + 0.4, c.a.start, 0.4);
  // The vertical axis waits for the voice: the hook sits on that side.
  const cm = (1 - probAxis) * fade(t, c.f.largo - 0.1, 0.3);
  const dim = (1 - underTable(t, c) - span(t, c.c.start - 0.5, 999, 0.4)) * (1 - interpolate(z, [1.05, 1.13], [0, 1], clamp));
  const hot = (a: number, b: number) => span(t, a, b, 0.15);
  const xHot = Math.max(hot(c.f.largo, c.f.ancho), hot(c.l.largo - 0.1, c.l.largo + 0.7));
  const yHot = Math.max(hot(c.f.ancho, c.f.tres), hot(c.l.ancho - 0.1, c.r.start));
  const tick = "absolute font-mono text-[16px] font-medium leading-none";
  if (dim <= 0.01) return null;
  return (
    <div data-ui="" className="absolute left-0 top-0" style={{ width: 540, height: 960, opacity: dim }}>
      {[1, 2, 3, 4, 5, 6, 7].map((v) => (
        <p key={v} className={tick} style={{ left: sx(v) - 12, top: PLOT.b + 7, width: 24, textAlign: "center", color: MUTED }}>
          {v}
        </p>
      ))}
      {[0.5, 1, 1.5, 2, 2.5].map((v) => (
        <p key={v} className={tick} style={{ left: 34, top: sy(v) - 8, width: 32, textAlign: "right", color: MUTED, opacity: cm }}>
          {es(v, 1)}
        </p>
      ))}
      {[0, 50, 100].map((v) => (
        <p key={v} className={tick} style={{ left: 30, top: py(v / 100) - 8, width: 36, textAlign: "right", color: LEAD, fontWeight: 700, opacity: probAxis }}>
          {v}
        </p>
      ))}
      <p className="absolute whitespace-nowrap rounded-[6px] px-2 py-[2px] font-sans text-[18px] font-semibold leading-tight" style={{ left: 170, top: PLOT.b + 26, width: 236, textAlign: "center", background: xHot > 0.05 ? LEAD : "transparent", color: xHot > 0.5 ? "#FFFFFF" : INK }}>
        Largo del pétalo (cm)
      </p>
      <p className="absolute whitespace-nowrap rounded-[6px] px-2 py-[2px] font-sans text-[18px] font-semibold leading-tight" style={{ left: 78, top: 536, transformOrigin: "0 0", transform: "rotate(-90deg)", background: yHot > 0.05 ? LEAD : "transparent", color: yHot > 0.5 ? "#FFFFFF" : INK, opacity: cm }}>
        Ancho del pétalo (cm)
      </p>
      <p className="absolute whitespace-nowrap font-sans text-[18px] font-semibold leading-tight" style={{ left: 78, top: 628, transformOrigin: "0 0", transform: "rotate(-90deg)", color: LEAD, opacity: probAxis }}>
        Probabilidad de virgínica (%)
      </p>
    </div>
  );
}

/** The names on the clusters, always in the same place: they go with the flowers. */
function ClusterNames({ c, rig }: { c: Cues; rig: { x: number; y: number; z: number } }) {
  const t = useT();
  const z = rig.z;
  const on = (1 - span(t, c.r.suben - 0.3, c.a.start + 0.6, 0.3)) * (1 - underTable(t, c)) * (1 - span(t, c.c.start - 0.5, 999, 0.3));
  const name = (i: number, x: number, y: number, width: number, ghost = 0) => {
    const left = (x - rig.x) * z + HOME.x;
    const right = left + width * z;
    const top = (y - rig.y) * z + HOME.y;
    const inFrame = interpolate(left, [26, 40], [0, 1], clamp) * interpolate(right, [500, 514], [1, 0], clamp) * (z > 1.02 ? interpolate(top, [214, 232], [0, 1], clamp) : 1);
    return (
      <p className="absolute whitespace-nowrap font-notes text-[27px] font-bold leading-none" style={{ left: x, top: y, color: SPECIES[i], opacity: on * (1 - ghost) * inFrame }}>
        {NAMES[i]}
      </p>
    );
  };
  return (
    <>
      {name(0, sx(0.28), sy(0.78), 64)}
      {name(1, sx(2.8), sy(1.7), 92)}
      {name(2, sx(5.75), sy(2.7), 84, 0.8 * span(t, c.s.quedo, c.k.start))}
      {t < c.l.start + 0.2 ? (
        <p className="absolute whitespace-nowrap font-notes text-[30px] font-bold leading-none" style={{ left: HIDDEN.x - 6, top: HIDDEN.y + 36, color: LEAD, opacity: 1 - fade(t, c.l.start - 0.1, 0.2) }}>
          ¿Qué especie?
        </p>
      ) : null}
    </>
  );
}

function Tints({ c, t }: { c: Cues; t: number }) {
  const gap = separation(t, c);
  const out = 1 - fade(t, c.s.start, 0.5);
  if (out <= 0 || t < c.a.ocho) return null;
  const rect = (key: string, x0: number, y0: number, x1: number, y1: number, color: string, at: number, dx: number, dy: number, pulseAt: number) => {
    const on = fade(t, at, 0.35) * out;
    const hit = bump(t, pulseAt, 0.55);
    return <rect key={key} x={sx(x0) + dx * gap} y={sy(y1) + dy * gap} width={sx(x1) - sx(x0)} height={sy(y0) - sy(y1)} fill={color} opacity={(0.13 + 0.22 * hit) * on} stroke={INK} strokeOpacity={0.35 * fade(t, c.a.cuatro, 0.3)} strokeWidth={1} />;
  };
  const steps = (c.a.nuestra - c.a.arbol2) / 4;
  return (
    <>
      {rect("setosa", 0, 0, XMAX, CUT.low, SPECIES[0], c.a.setosa - 0.5, 0, 1, c.a.arbol2)}
      {rect("top", 0, CUT.high, XMAX, YMAX, SPECIES[2], c.a.casi, 0, -1, c.a.arbol2 + steps)}
      {rect("left", 0, CUT.low, CUT.side, CUT.high, SPECIES[1], c.a.cinco3, -0.7, 0, c.a.arbol2 + steps * 2)}
      {rect("right", CUT.side, CUT.low, XMAX, CUT.high, SPECIES[2], c.a.cinco3, 0.7, 0, c.a.arbol2 + steps * 3)}
    </>
  );
}

function Cuts({ c, t }: { c: Cues; t: number }) {
  const out = 1 - fade(t, c.s.start, 0.4);
  if (out <= 0) return null;
  const second = inOut(unit(t, c.a.pasa2, c.a.cinco1 - c.a.pasa2 + 0.2));
  const third = inOut(unit(t, c.a.largo, c.a.cinco3 - c.a.largo + 0.2));
  const flash = 2 * bump(t, c.a.tres2, 0.5);
  const width = 3.4 + flash;
  return (
    <g opacity={out} strokeLinecap="round">
      {second > 0 ? <line x1={PLOT.l} y1={sy(CUT.high)} x2={lerp(PLOT.l, PLOT.r, second)} y2={sy(CUT.high)} stroke={LEAD} strokeWidth={width} /> : null}
      {third > 0 ? <line x1={sx(CUT.side)} y1={sy(CUT.low)} x2={sx(CUT.side)} y2={lerp(sy(CUT.low), sy(CUT.high), third)} stroke={LEAD} strokeWidth={width} /> : null}
    </g>
  );
}

/** The fan of lines that also separate, and the road between the two species. */
function Road({ c, t }: { c: Cues; t: number }) {
  const out = 1 - fade(t, c.k.start, 0.4);
  if (t < c.s.infinitas || out <= 0) return null;
  const grow = back(unit(t, c.s.busca, c.s.ancho - c.s.busca + 0.25));
  const collapse = inOut(unit(t, c.s.busca - 0.2, 0.6));
  const band = (h: number) => {
    const x = (up: number, center: number, down: number) => (h >= 0 ? lerp(center, up, h) : lerp(center, down, -h));
    return { bottom: x(SVM_UP.bottom, SVM_LINE.bottom, SVM_DOWN.bottom), top: x(SVM_UP.top, SVM_LINE.top, SVM_DOWN.top) };
  };
  const a = band(Math.min(1.08, grow));
  const b = band(-Math.min(1.08, grow));
  const [s0, s1] = SUPPORT.map((i) => FLOWERS[i]);
  const dimension = unit(t, c.s.uno - 0.1, 0.5);
  return (
    <g opacity={out}>
      {SEPARATORS.map(([bottom, top], i) => {
        const at = c.s.infinitas + i * 0.13;
        if (t < at || collapse >= 1) return null;
        const x0 = sx(lerp(bottom, SVM_LINE.bottom, collapse));
        const x1 = sx(lerp(top, SVM_LINE.top, collapse));
        return <line key={i} x1={x0} y1={PLOT.b} x2={lerp(x0, x1, unit(t, at, 0.14))} y2={lerp(PLOT.b, PLOT.t, unit(t, at, 0.14))} stroke={LEAD} strokeWidth={1.6} strokeOpacity={0.5} />;
      })}
      {grow > 0 ? (
        <>
          <polygon points={`${sx(a.bottom)},${PLOT.b} ${sx(a.top)},${PLOT.t} ${sx(b.top)},${PLOT.t} ${sx(b.bottom)},${PLOT.b}`} fill={LEAD} opacity={0.13} />
          <line x1={sx(a.bottom)} y1={PLOT.b} x2={sx(a.top)} y2={PLOT.t} stroke={LEAD} strokeWidth={1.8} />
          <line x1={sx(b.bottom)} y1={PLOT.b} x2={sx(b.top)} y2={PLOT.t} stroke={LEAD} strokeWidth={1.8} />
        </>
      ) : null}
      {dimension > 0 ? (
        <g>
          <line x1={s0.px} y1={s0.py} x2={lerp(s0.px, s1.px, inOut(dimension))} y2={lerp(s0.py, s1.py, inOut(dimension))} stroke={INK} strokeWidth={2} strokeDasharray="5 4" />
        </g>
      ) : null}
    </g>
  );
}

function Pins({ c, t }: { c: Cues; t: number }) {
  if (t < c.s.apoya - 0.1 || t > c.k.start + 0.3) return null;
  return (
    <>
      {SUPPORT.map((i, n) => {
        const f = FLOWERS[i];
        const p = popAt(t, c.s.apoya + n * 0.4);
        return (
          <g key={i} transform={`translate(${f.px} ${f.py}) scale(${Math.min(1.15, p)})`} opacity={1 - fade(t, c.k.start, 0.25)}>
            <circle r={13} fill="none" stroke={INK} strokeWidth={2} />
            <line x1={0} y1={0} x2={9} y2={-20} stroke={INK} strokeWidth={2.4} />
            <circle cx={10} cy={-23} r={6} fill={LEAD} stroke={CARD} strokeWidth={1.4} />
          </g>
        );
      })}
    </>
  );
}

function Residuals({ c, t }: { c: Cues; t: number }) {
  const on = span(t, c.l.mide, c.l.no, 0.2);
  if (on <= 0) return null;
  const line = (x: number) => LINEAR.slope * x + LINEAR.intercept;
  const squares = fade(t, c.l.suma - 0.1, 0.5);
  return (
    <g opacity={on}>
      {FLOWERS.map((f, i) => {
        const grow = inOut(unit(t, c.l.mide + f.wave * (c.l.suma - c.l.mide), 0.3));
        if (grow <= 0) return null;
        return <line key={i} x1={f.px} y1={f.py} x2={f.px} y2={lerp(f.py, sy(line(f.x)), grow)} stroke={LEAD} strokeWidth={1.3} strokeOpacity={0.7} />;
      })}
      {SQUARES.map((i, n) => {
        const f = FLOWERS[i];
        const side = Math.abs(f.py - sy(line(f.x)));
        const p = back(unit(t, c.l.suma - 0.1 + n * 0.04, 0.3)) * squares;
        return <rect key={i} x={f.px} y={Math.min(f.py, sy(line(f.x)))} width={side * p} height={side} fill={LEAD} fillOpacity={0.12} stroke={LEAD} strokeOpacity={0.45} strokeWidth={1} />;
      })}
    </g>
  );
}

function Guides({ c, t }: { c: Cues; t: number }) {
  const lineY = sy(LINEAR.slope * fits.hidden.x + LINEAR.intercept);
  const on = span(t, c.l.cinco - 0.1, c.r.start + 0.2, 0.15);
  const rise = inOut(unit(t, c.l.cinco - 0.05, 0.5));
  const cross = inOut(unit(t, c.l.dice - 0.2, 0.55));
  const sOn = span(t, c.r.nuestra, c.a.start, 0.15);
  const fiftyOn = span(t, c.r.dobla + 0.6, c.a.start - 0.1, 0.3);
  const fiftyHot = bump(t, c.r.pasa, 0.8);
  const cursor = span(t, c.r.con - 0.1, c.r.nuestra, 0.2);
  const cursorCm = keys(t, [
    [c.r.con, 2.4],
    [c.r.cuatro2 - 0.15, 4],
    [c.r.seis - 0.3, 4],
    [c.r.seis + 0.1, 6],
  ]);
  return (
    <>
      {fiftyOn > 0 ? <line x1={PLOT.l} y1={py(0.5)} x2={PLOT.r} y2={py(0.5)} stroke={LEAD} strokeWidth={1.4 + 1.8 * fiftyHot} strokeDasharray="8 7" opacity={fiftyOn} /> : null}
      {on > 0 ? (
        <g opacity={on} stroke={INK} strokeWidth={2} strokeDasharray="6 5" fill="none">
          <line x1={HIDDEN.x} y1={PLOT.b} x2={HIDDEN.x} y2={lerp(PLOT.b, lineY, rise)} />
          {cross > 0 ? <line x1={HIDDEN.x} y1={lineY} x2={lerp(HIDDEN.x, PLOT.l, cross)} y2={lineY} /> : null}
        </g>
      ) : null}
      {sOn > 0 ? <line x1={HIDDEN.x} y1={P_BOT} x2={HIDDEN.x} y2={py(P_HIDDEN)} stroke={INK} strokeWidth={2} strokeDasharray="6 5" opacity={sOn} /> : null}
      {cursor > 0 ? (
        <g opacity={cursor}>
          <line x1={sx(cursorCm)} y1={P_BOT} x2={sx(cursorCm)} y2={py(prob(cursorCm))} stroke={LEAD} strokeWidth={1.6} strokeDasharray="4 4" />
          <circle cx={sx(cursorCm)} cy={py(prob(cursorCm))} r={7} fill={LEAD} stroke={CARD} strokeWidth={2} />
        </g>
      ) : null}
    </>
  );
}

const bentWipe = (t: number, c: Cues) => lerp(PLOT.l, PLOT.r, inOut(unit(t, c.k.dobla - 0.5, c.k.frontera - c.k.dobla + 0.8)));

function KernelSides({ c, t }: { c: Cues; t: number }) {
  const on = span(t, c.k.dobla - 0.3, c.k.recta, 0.3);
  const straightSides = Math.max(span(t, c.k.pisan - 0.2, c.k.dobla, 0.3), span(t, c.k.recta, c.n.start, 0.3));
  const [bx, tx] = [sx(KERNEL_LINE.bottom), sx(KERNEL_LINE.top)];
  return (
    <>
      <clipPath id="bent-wipe">
        <rect x={0} y={0} width={bentWipe(t, c)} height={960} />
      </clipPath>
      {straightSides > 0 ? (
        <g opacity={straightSides}>
          <polygon points={`${PLOT.l},${PLOT.b} ${bx},${PLOT.b} ${tx},${PLOT.t} ${PLOT.l},${PLOT.t}`} fill={SPECIES[1]} opacity={0.14} />
          <polygon points={`${PLOT.r},${PLOT.b} ${bx},${PLOT.b} ${tx},${PLOT.t} ${PLOT.r},${PLOT.t}`} fill={SPECIES[2]} opacity={0.12} />
        </g>
      ) : null}
      {on > 0 ? (
        <g opacity={on} clipPath="url(#bent-wipe)">
          <rect x={PLOT.l} y={PLOT.t} width={PLOT.r - PLOT.l} height={PLOT.b - PLOT.t} fill={SPECIES[2]} opacity={0.12} />
          <path d={BENT_SIDE} fill={PAPER} />
          <path d={BENT_SIDE} fill={SPECIES[1]} opacity={0.14} />
        </g>
      ) : null}
    </>
  );
}

function Kernel({ c, t }: { c: Cues; t: number }) {
  const on = span(t, c.k.dobla - 0.3, c.k.recta, 0.3);
  const wrong = span(t, c.k.pisan, c.k.dobla, 0.25);
  return (
    <>
      {on > 0 ? <path d={BENT} fill="none" stroke={LEAD} strokeWidth={2.6} strokeLinecap="round" opacity={on} clipPath="url(#bent-wipe)" /> : null}
      {wrong > 0
        ? FLOWERS.filter((f) => f.wrongLine).map((f, i) => <circle key={i} cx={f.px} cy={f.py} r={10 + 1.5 * Math.sin(t * 8)} fill="none" stroke={LEAD} strokeWidth={1.7} opacity={wrong} />)
        : null}
    </>
  );
}

/** The circle that grows until it touches five flowers: it is an ellipse here because the two axes have different scales. */
function Neighbours({ c, t }: { c: Cues; t: number }) {
  if (t < c.n.busca - 0.1 || t > c.n.precio + 0.4) return null;
  const out = 1 - fade(t, c.n.precio, 0.3);
  const grow = inOut(unit(t, c.n.busca, c.n.votan - c.n.busca));
  const reach = KNN_REACH * grow;
  const rx = (reach / XMAX) * (PLOT.r - PLOT.l);
  const ry = (reach / YMAX) * (PLOT.b - PLOT.t);
  return (
    <g opacity={out}>
      <ellipse cx={HIDDEN.x} cy={HIDDEN.y} rx={rx} ry={ry} fill={LEAD} fillOpacity={0.09} stroke={LEAD} strokeWidth={1.1} strokeDasharray="3 2.4" />
      {NEIGHBOURS.map((n) => {
        if (reach < n.distance) return null;
        const f = FLOWERS[n.index];
        const hitAt = c.n.busca + (n.distance / KNN_REACH) * (c.n.votan - c.n.busca);
        const p = inOut(unit(t, hitAt, 0.25));
        return (
          <g key={n.index}>
            <line x1={HIDDEN.x} y1={HIDDEN.y} x2={lerp(HIDDEN.x, f.px, p)} y2={lerp(HIDDEN.y, f.py, p)} stroke={SPECIES[f.species]} strokeWidth={0.9} />
            <circle cx={f.px} cy={f.py} r={7.4} fill="none" stroke={SPECIES[f.species]} strokeWidth={1} opacity={p} />
          </g>
        );
      })}
    </g>
  );
}

/** Every answer of KNN measures the distance to every flower. */
function Threads({ c, t }: { c: Cues; t: number }) {
  const on = span(t, c.n.cada - 0.1, c.v.start, 0.25);
  if (on <= 0) return null;
  const count = Math.floor(FLOWERS.length * unit(t, c.n.cada, c.n.nueve - c.n.cada));
  const again = bump(t, c.n.cada2, 0.3) + bump(t, c.n.vez, 0.3);
  const pulse = 0.34 + 0.4 * again + 0.4 * bump(t, c.n.millon, 0.6);
  return (
    <g opacity={on}>
      {BY_DISTANCE.slice(0, count).map((i) => (
        <line key={i} x1={HIDDEN.x} y1={HIDDEN.y} x2={FLOWERS[i].px} y2={FLOWERS[i].py} stroke={LEAD} strokeWidth={1.1} strokeOpacity={pulse} />
      ))}
    </g>
  );
}

/** The last image of the argument: every drawing goes through the same place, and the flower falls on a different side of each one. */
function AllDrawings({ c, t }: { c: Cues; t: number }) {
  const on = span(t, c.v.esta, c.c.start - 0.5, 0.35);
  if (on <= 0) return null;
  const draw = (i: number) => inOut(unit(t, c.v.esta + 0.1 + i * 0.28, 0.45));
  const s = fits.logistic.cutAt50;
  return (
    <g opacity={on} stroke={LEAD} strokeLinecap="round" fill="none">
      <line x1={sx(s)} y1={sy(0.9)} x2={sx(s)} y2={lerp(sy(0.9), sy(2.5), draw(0))} strokeWidth={1.8} strokeDasharray="5 4" />
      <line x1={sx(CUT.side)} y1={sy(CUT.low)} x2={sx(CUT.side)} y2={lerp(sy(CUT.low), sy(CUT.high), draw(1))} strokeWidth={2} />
      <line x1={sx(3.4)} y1={sy(CUT.high)} x2={lerp(sx(3.4), sx(7), draw(1))} y2={sy(CUT.high)} strokeWidth={2} />
      <line x1={sx(KERNEL_LINE.bottom)} y1={PLOT.b} x2={lerp(sx(KERNEL_LINE.bottom), sx(KERNEL_LINE.top), draw(2))} y2={lerp(PLOT.b, PLOT.t, draw(2))} strokeWidth={2} />
    </g>
  );
}

function DrawingLabels({ c }: { c: Cues }) {
  const t = useT();
  const on = span(t, c.v.esta + 0.5, c.c.start - 0.5, 0.25);
  if (on <= 0) return null;
  const tag = (text: string, x: number, y: number, species: number, i: number) => {
    const p = popAt(t, c.v.esta + 0.6 + i * 0.3);
    if (p <= 0) return null;
    return (
      <At key={text} x={x} y={y} style={{ opacity: on, transform: `scale(${Math.min(1.1, p)})`, transformOrigin: "50% 50%" }}>
        <p data-ui="" className="whitespace-nowrap rounded-[8px] px-2 py-[3px] font-sans text-[22px] font-bold leading-tight text-white" style={{ background: SPECIES[species] }}>
          {text}
        </p>
      </At>
    );
  };
  return (
    <>
      {tag("Logística: virgínica", 46, 330, 2, 0)}
      {tag("Árbol: versicolor", 296, 560, 1, 1)}
      {tag("SVM: versicolor", 296, 606, 1, 2)}
    </>
  );
}

function Graph({ c }: { c: Cues }) {
  const t = useT();
  const cut = (1 - fade(t, c.c.start - 0.5, 0.4)) * span(t, c.l.dibuja - 0.01, c.k.dobla + 0.2, 0.01);
  const after = span(t, c.k.recta - 0.1, 999, 0.25);
  const eraser = eraserX(t, c);
  const strokeOn = (t < c.k.dobla ? cut : after) * (1 - 0.65 * span(t, c.a.curvas, c.a.ancho - 0.15, 0.2)) * (1 - 0.55 * fade(t, c.n.no - 0.2, 0.3));
  const reveal = inOut(unit(t, c.l.dibuja, c.l.recta - c.l.dibuja + 0.3));
  const hiddenStroke = t >= c.n.borro + 0.8 || strokeOn <= 0;
  const gray = span(t, c.l.no, c.l.nuestra, 0.25);
  const pen = penAt(t, c);
  const paperOn = 1 - underTable(t, c) - fade(t, c.c.start - 0.5, 0.4);
  const rig = rigAt(t, shots(c));
  // The vertical axis waits for the voice: the hook sits on that side.
  const axisTop = lerp(380, PLOT.t, inOut(unit(t, c.f.largo - 0.1, 0.5)));
  return (
    <svg className="absolute left-0 top-0 overflow-visible" width={540} height={960} aria-hidden>
      <FlowerDefs />
      <clipPath id="plot">
        <rect x={PLOT.l} y={PLOT.t} width={PLOT.r - PLOT.l} height={PLOT.b - PLOT.t} />
      </clipPath>
      <clipPath id="erased">
        <rect x={0} y={0} width={Math.max(0, eraser)} height={960} />
      </clipPath>
      <g opacity={paperOn}>
        <Paper />
        <line x1={PLOT.l} y1={axisTop} x2={PLOT.l} y2={PLOT.b} stroke={INK} strokeWidth={2} />
        <line x1={PLOT.l} y1={PLOT.b} x2={PLOT.r} y2={PLOT.b} stroke={INK} strokeWidth={2} />
      </g>
      <g clipPath="url(#plot)">
        <Tints c={c} t={t} />
        <Road c={c} t={t} />
        <Residuals c={c} t={t} />
        <KernelSides c={c} t={t} />
      </g>
      <Threads c={c} t={t} />
      <g style={{ filter: gray > 0 ? `saturate(${1 - gray})` : undefined }}>
        {FLOWERS.map((f, i) => {
          const s = flowerNow(f, i, t, c, rig.z);
          if (s.scale <= 0.02 || s.alpha <= 0.01) return null;
          return <use key={i} href={`#petals-${f.species}`} transform={`translate(${s.x.toFixed(2)} ${s.y.toFixed(2)}) rotate(${s.rot.toFixed(1)}) scale(${s.scale.toFixed(3)})`} opacity={s.alpha} />;
        })}
      </g>
      <Neighbours c={c} t={t} />
      <g clipPath="url(#plot)">
        <Guides c={c} t={t} />
        <Cuts c={c} t={t} />
        <Kernel c={c} t={t} />
        {hiddenStroke ? null : (
          <g clipPath="url(#erased)">
            <path d={strokePath(t, c)} fill="none" stroke={LEAD} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${reveal} 1`} opacity={strokeOn} />
          </g>
        )}
        <AllDrawings c={c} t={t} />
      </g>
      <Pins c={c} t={t} />
      <HiddenFlower c={c} z={rig.z} />
      <Pencil x={pen.x} y={pen.y} alpha={pen.alpha} />
    </svg>
  );
}

/* ---------- Pieces of the screen ---------- */

function At({ x, y, w, h, style, className, children }: { x: number; y: number; w?: number; h?: number; style?: CSSProperties; className?: string; children?: ReactNode }) {
  return (
    <div className={`absolute ${className ?? ""}`} style={{ left: x, top: y, width: w, height: h, ...style }}>
      {children}
    </div>
  );
}

function Appear({ at, until, x, y, w, origin = "50% 50%", from = 16, rotate = 0, children }: { at: number; until?: number; x: number; y: number; w?: number; origin?: string; from?: number; rotate?: number; children: ReactNode }) {
  const t = useT();
  const p = popAt(t, at);
  const out = until === undefined ? 0 : fade(t, until, 0.2);
  if (t < at || out >= 1) return null;
  return (
    <At x={x} y={y} w={w} style={{ opacity: Math.min(1, p * 2) * (1 - out), transform: `translateY(${(1 - Math.min(1, p)) * from}px) rotate(${rotate}deg) scale(${0.72 + 0.28 * p})`, transformOrigin: origin }}>
      {children}
    </At>
  );
}

function CardBox({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`rounded-[14px] border-[2px] px-3 py-2 ${className ?? ""}`} style={{ background: CARD, borderColor: INK, boxShadow: "0 6px 0 rgba(23,33,28,0.16)", ...style }}>
      {children}
    </div>
  );
}

function Tiny({ children, color = MUTED }: { children: ReactNode; color?: string }) {
  return (
    <p data-ui="" className="whitespace-nowrap font-sans text-[19px] font-semibold leading-tight" style={{ color }}>
      {children}
    </p>
  );
}

function AlgoTitle({ n, name, at, until, note, noteAt, wide = 420 }: { n: number; name: ReactNode; at: number; until: number; note?: string; noteAt?: number; wide?: number }) {
  const t = useT();
  return (
    <Appear at={at} until={until} x={36} y={120} w={wide} origin="0% 50%" from={10}>
      <div className="flex items-start gap-2">
        <span className="mt-[2px] flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full font-display text-[28px] font-extrabold leading-none text-white" style={{ background: LEAD }}>
          {n}
        </span>
        <div>
          <p className="font-display text-[40px] font-extrabold leading-[1] tracking-tight" style={{ color: INK }}>
            {name}
          </p>
          {note && noteAt !== undefined && t >= noteAt ? (
            <p className="mt-[2px] font-notes text-[36px] font-bold leading-none" style={{ color: LEAD, opacity: fade(t, noteAt, 0.15), transform: `translateX(${(1 - fade(t, noteAt, 0.2)) * -8}px)` }}>
              {note}
            </p>
          ) : null}
        </div>
      </div>
    </Appear>
  );
}

function Answer({ at, hitAt, until, x, y, w = 214, question, value, color = LEAD, size = 50, sub }: { at: number; hitAt: number; until: number; x: number; y: number; w?: number; question: string; value: string; color?: string; size?: number; sub?: string }) {
  const t = useT();
  const hit = popAt(t, hitAt);
  return (
    <Appear at={at} until={until} x={x} y={y} w={w}>
      <CardBox>
        <Tiny>{question}</Tiny>
        <p data-ui="" className="whitespace-nowrap font-display font-extrabold leading-[1.05] tracking-tight" style={{ color, fontSize: size, opacity: t >= hitAt ? 1 : 0.12, transform: `scale(${t >= hitAt ? 0.75 + 0.25 * Math.min(1.1, hit) : 1})`, transformOrigin: "0% 60%" }}>
          {t >= hitAt ? value : "?"}
        </p>
        {sub && t >= hitAt ? <Tiny>{sub}</Tiny> : null}
      </CardBox>
    </Appear>
  );
}

function Tally({ at, until, rows }: { at: number; until: number; rows: Array<[string, string]> }) {
  return (
    <Appear at={at} until={until} x={270} y={698 - rows.length * 30 - 40} w={234}>
      <CardBox>
        <Tiny>La flor, hasta ahora:</Tiny>
        {rows.map(([text, color], i) => (
          <p key={i} data-ui="" className="whitespace-nowrap font-display text-[25px] font-extrabold leading-[1.18] tracking-tight" style={{ color }}>
            {text}
          </p>
        ))}
      </CardBox>
    </Appear>
  );
}

function FlowerTally({ c }: { c: Cues }) {
  const one: [string, string] = [`${es(fits.linear.hiddenPrediction, 2)} cm`, LEAD];
  const two: [string, string] = [`${pct(P_HIDDEN)} % virgínica`, SPECIES[2]];
  const blue: [string, string] = ["versicolor", SPECIES[1]];
  return (
    <>
      <Tally at={c.r.start + 0.25} until={c.r.start + 2.9} rows={[one]} />
      <Tally at={c.a.start + 0.25} until={Math.min(c.a.start + 2.9, c.a.preguntas - 0.15)} rows={[one, two]} />
      <Tally at={c.s.start + 0.25} until={c.s.start + 3.2} rows={[one, two, blue]} />
      <Tally at={c.n.start + 0.25} until={c.n.start + 3.2} rows={[one, two, blue, blue]} />
    </>
  );
}

function FlowerIcon({ species, size = 34 }: { species: number; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-9 -9 18 18" aria-hidden>
      <use href={`#petals-${species}`} />
    </svg>
  );
}

function Check({ on, ok }: { on: number; ok: boolean }) {
  return (
    <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full" style={{ background: ok ? SPECIES[0] : LEAD, transform: `scale(${on})` }}>
      <Icono name={ok ? "check" : "x"} size={20} strokeWidth={3} ancla={false} className="text-white" />
    </span>
  );
}

/* ---------- What each scene says on the screen ---------- */

function HookText({ c }: { c: Cues }) {
  const t = useT();
  const out = fade(t, c.f.start - 0.2, 0.15);
  if (out >= 1) return null;
  const hit = bump(t, c.g.solo, 0.45);
  return (
    <At x={36} y={136} w={320} style={{ opacity: 1 - out }}>
      <p className="font-display text-[56px] font-extrabold leading-[0.96] tracking-tight" style={{ color: INK }}>
        Cinco algoritmos.{" "}
        <span className="inline-block" style={{ color: LEAD, transform: `scale(${1 + 0.12 * hit})`, transformOrigin: "0% 50%" }}>
          Solo uno acierta.
        </span>
      </p>
    </At>
  );
}

function FlowerIntro({ c }: { c: Cues }) {
  const t = useT();
  const rows: Array<[number, string, number]> = [
    [0, "setosa", 50],
    [1, "versicolor", 50],
    [2, "virgínica", 49],
  ];
  return (
    <>
      <Appear at={c.f.start} until={c.f.iris - 0.2} x={36} y={124} w={330} origin="0% 50%">
        <p className="font-display text-[56px] font-extrabold leading-[0.98] tracking-tight" style={{ color: INK }}>
          150 flores <span style={{ color: LEAD }}>reales</span>
        </p>
      </Appear>
      <Appear at={c.f.iris} until={c.l.start - 0.3} x={36} y={124} w={300} origin="0% 50%">
        <p className="font-display text-[60px] font-extrabold leading-none tracking-tight" style={{ color: INK }}>
          Iris, <span style={{ color: LEAD }}>{t >= c.f.y1936 ? "1936" : ""}</span>
        </p>
      </Appear>
      <Appear at={c.f.unico} until={c.l.start - 0.3} x={86} y={194} w={250} origin="0% 50%" rotate={-2}>
        <p className="font-notes text-[42px] font-bold leading-[0.95]" style={{ color: LEAD }}>
          solo cambia el dibujo
        </p>
      </Appear>
      <Appear at={c.f.tres} until={c.l.start - 0.3} x={276} y={566} w={228}>
        <CardBox>
          {rows.map(([i, name, count], n) => (
            <div key={name} className="flex items-center gap-2" style={{ opacity: fade(t, c.f.tres + n * 0.22, 0.12) }}>
              <FlowerIcon species={i} />
              <p data-ui="" className="flex-1 font-sans text-[20px] font-semibold leading-tight" style={{ color: SPECIES[i] }}>
                {name}
              </p>
              <p data-ui="" className="font-mono text-[20px] font-bold leading-tight" style={{ color: INK }}>
                {count}
              </p>
            </div>
          ))}
          <div className="mt-1 flex items-center gap-2 border-t-[1.5px] pt-1" style={{ borderColor: INK, opacity: fade(t, c.f.unico, 0.2) }}>
            <span data-ui="" className="flex h-[30px] w-[30px] items-center justify-center rounded-full font-display text-[20px] font-extrabold leading-none text-white" style={{ background: LEAD, marginLeft: 2 }}>
              ?
            </span>
            <p data-ui="" className="flex-1 font-sans text-[20px] font-semibold leading-tight" style={{ color: LEAD }}>
              sin nombre
            </p>
            <p data-ui="" className="font-mono text-[20px] font-bold leading-tight" style={{ color: INK }}>
              1
            </p>
          </div>
        </CardBox>
      </Appear>
    </>
  );
}

function LinearText({ c }: { c: Cues }) {
  const t = useT();
  const line = lineNow(t, c);
  const landed = c.l.error + 0.3;
  const live = t < landed ? sseOf(line.slope, line.intercept) : fits.linear.sse;
  const settled = popAt(t, landed);
  const lineY = sy(LINEAR.slope * fits.hidden.x + LINEAR.intercept);
  const tag = popAt(t, c.l.siete);
  return (
    <>
      <AlgoTitle n={1} name="Regresión lineal" at={c.l.start} until={c.r.start - 0.25} note="dibuja una recta" noteAt={c.l.dibuja} />
      <Appear at={c.l.todas} until={c.l.predice} x={36} y={232} w={210} origin="0% 50%">
        <CardBox>
          <Tiny>Error total</Tiny>
          <p data-ui="" className="font-display font-extrabold leading-none tabular-nums tracking-tight" style={{ color: LEAD, fontSize: 58, transform: `scale(${t >= landed ? 0.86 + 0.14 * Math.min(1.1, settled) : 1})`, transformOrigin: "0% 60%" }}>
            {es(live, 2)}
          </p>
        </CardBox>
      </Appear>
      <Answer at={c.l.predice} hitAt={c.l.siete} until={c.r.start - 0.2} x={256} y={596} w={248} question="¿Cuánto mide?" value={`${es(fits.linear.hiddenPrediction, 2)} cm`} size={58} sub="ancho del pétalo" />
      {tag > 0 && t < c.r.start ? (
        <At x={68} y={lineY - 15} style={{ transform: `scale(${Math.min(1.1, tag)})`, transformOrigin: "0% 50%", opacity: 1 - fade(t, c.l.dos + 0.8, 0.2) }}>
          <p data-ui="" className="rounded-[6px] px-2 py-[2px] font-mono text-[20px] font-bold leading-tight text-white" style={{ background: INK }}>
            {es(fits.linear.hiddenPrediction, 2)}
          </p>
        </At>
      ) : null}
    </>
  );
}

function LogisticText({ c }: { c: Cues }) {
  const t = useT();
  const strike = inOut(unit(t, c.r.pero, 0.3));
  const four = popAt(t, c.r.cuatro2);
  const six = popAt(t, c.r.noventa);
  const until = c.a.start - 0.2;
  const p4 = pct(prob(4));
  const p6 = pct(prob(6));
  return (
    <>
      <AlgoTitle
        n={2}
        at={c.r.start}
        until={until}
        name={
          <>
            <span className="relative inline-block">
              Regresión
              <span className="absolute left-0 top-[52%] h-[4px] rounded-full" style={{ width: `${strike * 100}%`, background: LEAD }} />
            </span>{" "}
            logística
          </>
        }
        note="clasifica con una S"
        noteAt={c.r.clasifica}
        wide={440}
      />
      <Answer at={c.r.con - 0.2} hitAt={c.r.sesenta} until={c.r.virginica - 0.05} x={36} y={262} w={200} question="¿Virgínica?" value={`${pct(P_HIDDEN)} %`} size={62} />
      <Appear at={c.r.virginica} until={until} x={36} y={262} w={230} origin="0% 50%">
        <CardBox>
          <Tiny>Dice:</Tiny>
          <p className="font-display text-[42px] font-extrabold leading-[1.05] tracking-tight" style={{ color: SPECIES[2] }}>
            Virgínica
          </p>
        </CardBox>
      </Appear>
      {four > 0 && t < c.r.nuestra ? (
        <At x={sx(4) - 104} y={py(prob(4)) - 62} w={96} style={{ transform: `scale(${Math.min(1.1, four)})`, transformOrigin: "100% 100%", opacity: 1 - fade(t, c.r.nuestra - 0.2, 0.2) }}>
          <p className="text-right font-display text-[46px] font-extrabold leading-none" style={{ color: LEAD }}>
            {p4} %
          </p>
        </At>
      ) : null}
      {six > 0 && t < c.r.nuestra ? (
        <At x={404} y={py(prob(6)) + 26} w={96} style={{ transform: `scale(${Math.min(1.04, six)})`, transformOrigin: "100% 0%", opacity: 1 - fade(t, c.r.nuestra - 0.2, 0.2) }}>
          <p className="whitespace-nowrap text-right font-display text-[40px] font-extrabold leading-none" style={{ color: LEAD }}>
            {p6} %
          </p>
        </At>
      ) : null}
    </>
  );
}

function TreeDiagram({ c }: { c: Cues }) {
  const t = useT();
  const on = span(t, c.a.preguntas, c.a.nuestra - 0.2, 0.2);
  if (on <= 0) return null;
  const steps = (c.a.nuestra - c.a.arbol2) / 4;
  const flash = bump(t, c.a.tres2, 0.7);
  type Node = { id: string; x: number; y: number; at: number; text?: string; leaf?: number; count?: string; pulse?: number };
  const nodes: Node[] = [
    { id: "q1", x: 112, y: 14, at: c.a.ancho - 0.1, text: `ancho > ${es(CUT.low, 1)}` },
    { id: "setosa", x: 52, y: 68, at: c.a.setosa - 0.1, leaf: 0, count: "50 de 50", pulse: c.a.arbol2 },
    { id: "q2", x: 192, y: 68, at: c.a.pasa2, text: `ancho > ${es(CUT.high, 2)}` },
    { id: "q3", x: 128, y: 122, at: c.a.largo - 0.1, text: `largo > ${es(CUT.side, 2)}` },
    { id: "top", x: 270, y: 122, at: c.a.casi - 0.1, leaf: 2, count: "45 de 46", pulse: c.a.arbol2 + steps },
    { id: "left", x: 66, y: 176, at: c.a.cinco3, leaf: 1, count: "48 de 49", pulse: c.a.arbol2 + steps * 2 },
    { id: "right", x: 196, y: 176, at: c.a.cinco3 + 0.15, leaf: 2, count: "3 de 4", pulse: c.a.arbol2 + steps * 3 },
  ];
  const edges: Array<[string, string]> = [
    ["q1", "setosa"],
    ["q1", "q2"],
    ["q2", "q3"],
    ["q2", "top"],
    ["q3", "left"],
    ["q3", "right"],
  ];
  const find = (id: string) => nodes.find((n) => n.id === id) as Node;
  return (
    <At x={182} y={544} w={322} h={204} style={{ opacity: on }}>
      <svg className="absolute left-0 top-0" width={322} height={204} aria-hidden>
        {edges.map(([a, b]) => {
          const [from, to] = [find(a), find(b)];
          const p = inOut(unit(t, to.at - 0.05, 0.2));
          if (p <= 0) return null;
          return <line key={b} x1={from.x} y1={from.y} x2={lerp(from.x, to.x, p)} y2={lerp(from.y, to.y, p)} stroke={INK} strokeWidth={2} />;
        })}
      </svg>
      {nodes.map((n) => {
        const pop = popAt(t, n.at);
        if (pop <= 0) return null;
        const pulse = n.pulse === undefined ? 0 : bump(t, n.pulse, 0.55);
        return (
          <div
            key={n.id}
            data-ui=""
            className="absolute whitespace-nowrap rounded-[8px] border-[2px] px-2 py-[3px] text-center font-mono text-[18px] font-bold leading-tight"
            style={{
              left: n.x,
              top: n.y,
              transform: `translate(-50%, -50%) scale(${Math.min(1.1, pop) * (1 + 0.14 * (n.leaf === undefined ? flash : pulse))})`,
              background: n.leaf === undefined ? CARD : SPECIES[n.leaf],
              borderColor: n.leaf === undefined ? INK : SPECIES[n.leaf],
              color: n.leaf === undefined ? INK : "#FFFFFF",
            }}
          >
            {n.leaf === undefined ? n.text : n.count}
          </div>
        );
      })}
    </At>
  );
}

function TreeText({ c }: { c: Cues }) {
  const until = c.s.start - 0.2;
  const v = fits.tree.hiddenAnswer;
  return (
    <>
      <AlgoTitle n={3} name="Árbol de decisión" at={c.a.start} until={until} note="dibuja rectángulos" noteAt={c.a.curvas} />
      <TreeDiagram c={c} />
      <Answer at={c.a.nuestra} hitAt={c.a.versicolor} until={until} x={276} y={640} w={228} question="Dice:" value={v[0].toUpperCase() + v.slice(1)} color={SPECIES[1]} size={42} />
    </>
  );
}

function SvmText({ c }: { c: Cues }) {
  const t = useT();
  const until = c.k.start - 0.2;
  const margin = popAt(t, c.s.uno);
  const two = popAt(t, c.s.dos);
  const moved = fits.svm.refitMoved;
  return (
    <>
      <AlgoTitle n={4} name="SVM" at={c.s.start} until={c.k.start - 0.15} note="dibuja un camino" noteAt={c.s.busca} wide={300} />
      {margin > 0 && t < c.s.borro ? (
        <At x={250} y={620} w={254} style={{ transform: `scale(${Math.min(1.1, margin)})`, opacity: 1 - fade(t, c.s.borro - 0.2, 0.2) }}>
          <CardBox>
            <Tiny>Lo más ancho posible</Tiny>
            <p className="font-display text-[50px] font-extrabold leading-[1.05] tracking-tight" style={{ color: LEAD }}>
              {es(fits.svm.margin, 2)} cm
            </p>
          </CardBox>
        </At>
      ) : null}
      {two > 0 && t < until ? (
        <At x={250} y={536} w={254} style={{ transform: `scale(${Math.min(1.1, two)})`, transformOrigin: "100% 50%", opacity: 1 - fade(t, until - 0.2, 0.2) }}>
          <p className="text-right font-display text-[62px] font-extrabold leading-[0.95] tracking-tight" style={{ color: INK }}>
            2 <span style={{ color: LEAD }}>de {fits.svm.pairSize}</span>
          </p>
        </At>
      ) : null}
      <Appear at={c.s.ajusto} until={until} x={196} y={640} w={308}>
        <CardBox>
          <p data-ui="" className="whitespace-nowrap font-mono text-[20px] font-bold leading-tight" style={{ color: INK }}>
            svc.fit(solo_2_flores)
          </p>
          <p data-ui="" className="whitespace-nowrap font-mono text-[20px] font-bold leading-tight" style={{ color: LEAD, opacity: fade(t, c.s.no, 0.15) }}>
            Se movió: {moved.toFixed(8).replace(".", ",")}
          </p>
        </CardBox>
      </Appear>
    </>
  );
}

function ScoreCard({ title, at, x, y, curve, line, curveAt, lineAt, until, winsCurve }: { title: string; at: number; x: number; y: number; curve: number; line: number; curveAt: number; lineAt: number; until: number; winsCurve: boolean }) {
  const t = useT();
  const row = (name: string, value: number, when: number, wins: boolean) => {
    const pop = popAt(t, when);
    return (
      <div className="flex items-baseline justify-between gap-2" style={{ opacity: t >= when ? 1 : 0.15 }}>
        <p data-ui="" className="font-sans text-[20px] font-semibold leading-tight" style={{ color: wins ? LEAD : MUTED }}>
          {name}
        </p>
        <p data-ui="" className="font-display font-extrabold leading-none tabular-nums" style={{ fontSize: wins ? 46 : 36, color: wins ? LEAD : MUTED, transform: `scale(${t >= when ? 0.8 + 0.2 * Math.min(1.1, pop) : 1})`, transformOrigin: "100% 60%" }}>
          {pct(value)} %
        </p>
      </div>
    );
  };
  return (
    <Appear at={at} until={until} x={x} y={y} w={210}>
      <CardBox>
        <Tiny color={INK}>{title}</Tiny>
        {row("Curva", curve, curveAt, winsCurve)}
        {row("Recta", line, lineAt, !winsCurve)}
      </CardBox>
    </Appear>
  );
}

function KernelText({ c }: { c: Cues }) {
  const t = useT();
  const k = fits.svm.kernel;
  const until = c.k.recta - 0.15;
  const hit = t >= c.k.memorizar ? Math.min(1.1, popAt(t, c.k.memorizar)) : 0;
  return (
    <>
      <AlgoTitle n={4} name="SVM y kernel" at={c.k.start} until={c.n.start - 0.2} note="dobla la frontera" noteAt={c.k.dobla} wide={340} />
      <ScoreCard title="Las que vio" at={c.k.acierta - 0.05} x={36} y={214} curve={k.bent.train} line={k.straight.train} curveAt={c.k.vio - 0.35} lineAt={c.k.vio - 0.05} until={until} winsCurve />
      <ScoreCard title="Las que no vio" at={c.k.menos - 0.05} x={294} y={606} curve={k.crossValidation5.bent} line={k.crossValidation5.straight} curveAt={c.k.vio2 - 0.35} lineAt={c.k.vio2 - 0.05} until={until} winsCurve={false} />
      {hit > 0 && t < until + 0.2 ? (
        <At x={36} y={642} w={250} style={{ transform: `rotate(-5deg) scale(${(2 - hit) * 0.92})`, opacity: Math.min(1, hit * 2) * (1 - fade(t, until, 0.2)), transformOrigin: "30% 50%" }}>
          <p className="rounded-[10px] border-[4px] px-2 py-1 text-center font-display text-[36px] font-extrabold leading-none tracking-tight" style={{ color: LEAD, borderColor: LEAD, background: CARD }}>
            Memorizar
          </p>
        </At>
      ) : null}
      <Answer at={c.k.recta} hitAt={c.k.versicolor} until={c.n.start - 0.2} x={276} y={640} w={228} question="Dice:" value="Versicolor" color={SPECIES[1]} size={42} />
    </>
  );
}

function KnnText({ c }: { c: Cues }) {
  const t = useT();
  const until = c.v.start - 0.15;
  const voteRow = (species: number, count: number, at: number) => (
    <div className="flex items-center gap-[2px]">
      {Array.from({ length: count }, (_, i) => {
        const p = popAt(t, at + i * 0.1);
        return p > 0 ? (
          <span key={i} style={{ transform: `scale(${Math.min(1.15, p)})` }}>
            <FlowerIcon species={species} size={34} />
          </span>
        ) : (
          <span key={i} style={{ width: 34, height: 34 }} />
        );
      })}
      <p data-ui="" className="ml-2 font-display text-[34px] font-extrabold leading-none" style={{ color: SPECIES[species], opacity: fade(t, at + count * 0.1, 0.15) }}>
        {count}
      </p>
    </div>
  );
  const counted = Math.floor(FLOWERS.length * unit(t, c.n.cada, c.n.nueve - c.n.cada));
  const million = popAt(t, c.n.millon);
  return (
    <>
      <AlgoTitle n={5} name="k vecinos más cercanos" at={c.n.start} until={until} note="no dibuja nada" noteAt={c.n.no} wide={360} />
      <Appear at={c.n.guardo} until={c.n.llega} x={250} y={620} w={254}>
        <CardBox>
          <Tiny>Su modelo:</Tiny>
          <p className="font-display text-[42px] font-extrabold leading-[1.05] tracking-tight" style={{ color: INK }}>
            {fits.knn.distancesPerPrediction} flores
          </p>
        </CardBox>
      </Appear>
      <Appear at={c.n.cuatro - 0.2} until={c.n.precio - 0.1} x={36} y={622} w={232} origin="0% 50%">
        <CardBox>
          {voteRow(1, fits.knn.votes.versicolor, c.n.cuatro)}
          {voteRow(2, fits.knn.votes.virginica, c.n.una)}
        </CardBox>
      </Appear>
      <Answer at={c.n.versicolor2 - 0.3} hitAt={c.n.versicolor2} until={c.n.precio - 0.1} x={276} y={640} w={228} question="Dice:" value="Versicolor" color={SPECIES[1]} size={42} />
      <Appear at={c.n.cada - 0.2} until={until} x={214} y={612} w={290}>
        <CardBox>
          <Tiny>{million > 0 && t >= c.n.millon ? "Con un millón de flores" : "Distancias en cada respuesta"}</Tiny>
          <p data-ui="" className="font-display font-extrabold leading-[1.05] tabular-nums tracking-tight" style={{ color: LEAD, fontSize: t >= c.n.millon ? 52 : 68, transform: `scale(${t >= c.n.millon ? 0.8 + 0.2 * Math.min(1.1, million) : 1})`, transformOrigin: "0% 60%" }}>
            {t >= c.n.millon ? "1.000.000" : counted}
          </p>
        </CardBox>
      </Appear>
    </>
  );
}

function Reveal({ c }: { c: Cues }) {
  const t = useT();
  const close = c.v.esta - 0.45;
  const name = popAt(t, c.v.virginica);
  const realWidth = popAt(t, c.v.ancho);
  const diff = fits.linear.hiddenPrediction - fits.linear.hiddenReal;
  const rows: Array<{ n: number; name: string; answer: string; at: number; ok: boolean; color: string }> = [
    { n: 1, name: "Lineal", answer: `${es(fits.linear.hiddenPrediction, 2)} cm`, at: c.v.recta, ok: false, color: LEAD },
    { n: 2, name: "Logística", answer: `${pct(P_HIDDEN)} % virgínica`, at: c.v.acerto, ok: true, color: SPECIES[2] },
    { n: 3, name: "Árbol", answer: "versicolor", at: c.v.tres + 0.1, ok: false, color: SPECIES[1] },
    { n: 4, name: "SVM", answer: "versicolor", at: c.v.tres + 0.3, ok: false, color: SPECIES[1] },
    { n: 5, name: "KNN", answer: "versicolor, 4 a 1", at: c.v.tres + 0.5, ok: false, color: SPECIES[1] },
  ];
  const loo = fits.leaveOneOut;
  const bars: Array<[string, number]> = [
    ["Logística, sí o no", loo.logistic_virginica_or_not],
    ["Árbol", loo.tree],
    ["SVM", loo.svm_linear],
    ["KNN", loo.knn],
  ];
  const tableOn = t >= c.v.tres - 0.1 && t < close + 0.25;
  return (
    <>
      {name > 0 && t < c.v.tres ? (
        <At x={36} y={150} w={468} style={{ transform: `scale(${Math.min(1.08, name)})`, opacity: 1 - fade(t, c.v.tres - 0.2, 0.2), transformOrigin: "50% 50%" }}>
          <p className="mx-auto w-fit rounded-[16px] px-4 pb-2 pt-1 text-center font-display text-[76px] font-extrabold leading-none tracking-tight text-white" style={{ background: SPECIES[2] }}>
            Virgínica
          </p>
        </At>
      ) : null}
      {realWidth > 0 && t < c.v.tres ? (
        <At x={36} y={640} w={468} style={{ transform: `scale(${Math.min(1.08, realWidth)})`, opacity: 1 - fade(t, c.v.tres - 0.2, 0.2) }}>
          <CardBox className="mx-auto w-fit">
            <p className="whitespace-nowrap text-center font-display text-[44px] font-extrabold leading-none tracking-tight" style={{ color: INK }}>
              Ancho real: {es(fits.linear.hiddenReal, 1)} cm
            </p>
          </CardBox>
        </At>
      ) : null}
      {tableOn ? (
        <At x={36} y={120} w={468} style={{ opacity: fade(t, c.v.tres - 0.1, 0.2) * (1 - fade(t, close, 0.25)) }}>
          <CardBox className="!px-3 !py-1">
            {rows.map((r, i) => {
              const on = popAt(t, r.at);
              return (
                <div key={r.n} className={`-mx-1 flex items-center gap-2 rounded-[8px] px-1 py-[10px] ${i ? "border-t" : ""}`} style={{ borderColor: "rgba(23,33,28,0.2)", background: r.ok ? `rgba(14,143,110,${0.2 * span(t, c.v.acerto, c.v.mejor, 0.25)})` : undefined, transform: `scale(${r.ok ? 1 + 0.02 * span(t, c.v.acerto, c.v.mejor, 0.25) : 1})` }}>
                  <span data-ui="" className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full font-display text-[18px] font-extrabold leading-none text-white" style={{ background: INK }}>
                    {r.n}
                  </span>
                  <p data-ui="" className="w-[116px] shrink-0 font-sans text-[24px] font-semibold leading-none" style={{ color: INK }}>
                    {r.name}
                  </p>
                  <p data-ui="" className="flex-1 whitespace-nowrap font-display text-[27px] font-extrabold leading-none tracking-tight" style={{ color: r.color, opacity: Math.min(1, on * 1.4) }}>
                    {r.answer}
                  </p>
                  <Check on={Math.min(1.1, on)} ok={r.ok} />
                </div>
              );
            })}
            {t >= c.v.recta ? (
              <p data-ui="" className="pb-1 text-right font-sans text-[20px] font-bold leading-none" style={{ color: LEAD, opacity: fade(t, c.v.recta + 0.2, 0.2) }}>
                la recta se pasó {es(diff, 2)} cm
              </p>
            ) : null}
          </CardBox>
          {t >= c.v.mejor - 0.1 ? (
            <div className="mt-3" style={{ opacity: fade(t, c.v.mejor - 0.1, 0.2) }}>
              <CardBox>
                <div className="flex items-baseline justify-between pb-1">
                  <p className="font-display text-[30px] font-extrabold leading-none tracking-tight" style={{ color: INK }}>
                    Flor por flor
                  </p>
                  {t >= c.v.noventa2 ? (
                    <p data-ui="" className="font-display text-[34px] font-extrabold leading-none tracking-tight" style={{ color: LEAD, transform: `scale(${0.8 + 0.2 * Math.min(1.1, popAt(t, c.v.noventa2))})`, transformOrigin: "100% 60%" }}>
                      {Math.round(Math.min(...bars.map(([, v]) => v)) * 100)} a {Math.round(Math.max(...bars.map(([, v]) => v)) * 100)} %
                    </p>
                  ) : null}
                </div>
                {bars.map(([label, value], i) => {
                  const grow = inOut(unit(t, c.v.probadas + 0.3 + i * 0.5, 0.9));
                  return (
                    <div key={label} className="flex items-center gap-2 py-[4px]">
                      <p data-ui="" className="w-[164px] shrink-0 whitespace-nowrap font-sans text-[20px] font-semibold leading-none" style={{ color: INK }}>
                        {label}
                      </p>
                      <div className="h-[20px] flex-1 overflow-hidden rounded-[4px]" style={{ background: "rgba(23,33,28,0.1)" }}>
                        <div className="h-full rounded-[4px]" style={{ width: `${value * 100 * grow}%`, background: LEAD }} />
                      </div>
                      <p data-ui="" className="w-[76px] shrink-0 text-right font-mono text-[20px] font-bold leading-none tabular-nums" style={{ color: LEAD, opacity: fade(t, c.v.probadas + 0.3 + i * 0.5, 0.2) }}>
                        {es(value * 100 * grow, 1)} %
                      </p>
                    </div>
                  );
                })}
              </CardBox>
            </div>
          ) : null}
        </At>
      ) : null}
      {tableOn ? (
        <At x={36} y={lerp(492, 628, inOut(unit(t, c.v.mejor - 0.15, 0.4)))} w={468} style={{ opacity: fade(t, c.v.tres - 0.1, 0.2) * (1 - fade(t, close, 0.25)) }}>
          <div className="flex items-center justify-center gap-3">
            <span style={{ transform: `rotate(${t * 24}deg) scale(${1 + 0.05 * Math.sin(t * 3)})` }}>
              <FlowerIcon species={2} size={lerp(160, 96, inOut(unit(t, c.v.mejor - 0.15, 0.4)))} />
            </span>
            <p className="whitespace-nowrap font-display text-[50px] font-extrabold leading-none tracking-tight" style={{ color: SPECIES[2] }}>
              Era virgínica
            </p>
          </div>
        </At>
      ) : null}
      <Appear at={c.v.manda - 0.1} until={c.c.start - 0.6} x={44} y={136} w={440} origin="0% 50%" rotate={-1}>
        <p className="font-notes text-[50px] font-bold leading-none" style={{ color: LEAD }}>
          aquí manda el dibujo
        </p>
      </Appear>
    </>
  );
}

/* ---------- The close: the same graph five times ---------- */

const MINI = { w: 150, h: 92 };
const mx = (cm: number) => 3 + (cm / XMAX) * (MINI.w - 6);
const my = (cm: number) => MINI.h - 3 - (cm / YMAX) * (MINI.h - 6);
const mp = (p: number) => MINI.h - 7 - p * (MINI.h - 14);

function Mini({ kind }: { kind: number }) {
  const dots = FLOWERS.map((f, i) => {
    const y = kind === 1 ? (f.species === 2 ? mp(1) : mp(0)) : my(f.y);
    const ghost = kind === 3 && f.species === 2;
    return <circle key={i} cx={mx(f.x)} cy={y} r={1.7} fill={SPECIES[f.species]} opacity={ghost ? 0.14 : 0.9} />;
  });
  const curve = Array.from({ length: 40 }, (_, i) => {
    const cm = 0.5 + (i / 39) * 6.6;
    return `${i ? "L" : "M"}${mx(cm).toFixed(1)} ${mp(prob(cm)).toFixed(1)}`;
  }).join("");
  const rx = (KNN_REACH / XMAX) * (MINI.w - 6) * 2.4;
  const ry = (KNN_REACH / YMAX) * (MINI.h - 6) * 1.2;
  return (
    <svg width={MINI.w} height={MINI.h} className="shrink-0 rounded-[8px] border-[1.5px]" style={{ background: PAPER, borderColor: INK }} aria-hidden>
      {kind === 2 ? (
        <>
          <rect x={mx(0)} y={my(CUT.low)} width={mx(XMAX) - mx(0)} height={my(0) - my(CUT.low)} fill={SPECIES[0]} opacity={0.14} />
          <rect x={mx(0)} y={my(YMAX)} width={mx(XMAX) - mx(0)} height={my(CUT.high) - my(YMAX)} fill={SPECIES[2]} opacity={0.14} />
          <rect x={mx(0)} y={my(CUT.high)} width={mx(CUT.side) - mx(0)} height={my(CUT.low) - my(CUT.high)} fill={SPECIES[1]} opacity={0.14} />
          <rect x={mx(CUT.side)} y={my(CUT.high)} width={mx(XMAX) - mx(CUT.side)} height={my(CUT.low) - my(CUT.high)} fill={SPECIES[2]} opacity={0.14} />
        </>
      ) : null}
      {kind === 3 ? <polygon points={`${mx(SVM_UP.bottom)},${my(0)} ${mx(SVM_UP.top)},${my(YMAX)} ${mx(SVM_DOWN.top)},${my(YMAX)} ${mx(SVM_DOWN.bottom)},${my(0)}`} fill={LEAD} opacity={0.2} /> : null}
      {dots}
      {kind === 0 ? <line x1={mx(0.9)} y1={my(0.9 * LINEAR.slope + LINEAR.intercept)} x2={mx(7.3)} y2={my(7.3 * LINEAR.slope + LINEAR.intercept)} stroke={LEAD} strokeWidth={2.6} strokeLinecap="round" /> : null}
      {kind === 1 ? <path d={curve} fill="none" stroke={LEAD} strokeWidth={2.6} strokeLinecap="round" /> : null}
      {kind === 2 ? (
        <g stroke={LEAD} strokeWidth={2.2} strokeLinecap="round">
          <line x1={mx(0)} y1={my(CUT.low)} x2={mx(XMAX)} y2={my(CUT.low)} />
          <line x1={mx(0)} y1={my(CUT.high)} x2={mx(XMAX)} y2={my(CUT.high)} />
          <line x1={mx(CUT.side)} y1={my(CUT.low)} x2={mx(CUT.side)} y2={my(CUT.high)} />
        </g>
      ) : null}
      {kind === 3 ? (
        <g stroke={LEAD} strokeWidth={1.8}>
          <line x1={mx(SVM_UP.bottom)} y1={my(0)} x2={mx(SVM_UP.top)} y2={my(YMAX)} />
          <line x1={mx(SVM_DOWN.bottom)} y1={my(0)} x2={mx(SVM_DOWN.top)} y2={my(YMAX)} />
        </g>
      ) : null}
      {kind === 4 ? <ellipse cx={mx(fits.hidden.x)} cy={my(fits.hidden.y)} rx={rx} ry={ry} fill="none" stroke={LEAD} strokeWidth={1.8} strokeDasharray="3 3" /> : null}
    </svg>
  );
}

function Closing({ c }: { c: Cues }) {
  const t = useT();
  if (t < c.c.start - 0.4) return null;
  const rows: Array<[string, string, number]> = [
    ["Regresión lineal", "Quieres un número", c.c.start - 0.15],
    ["Regresión logística", "Quieres una probabilidad", c.c.prob - 0.1],
    ["Árbol de decisión", "Quieres preguntas legibles", c.c.preguntas - 0.1],
    ["SVM", "Quieres el camino más ancho", c.c.camino - 0.1],
    ["KNN", "Quieres copiar a las vecinas", c.c.vecinos - 0.1],
  ];
  const saved = popAt(t, c.c.guarda);
  const one = popAt(t, c.c.grafico - 0.5);
  return (
    <>
      {rows.map(([name, says, at], i) => {
        const p = popAt(t, at);
        const comes = fade(t, c.c.start - 0.45, 0.25);
        return (
          <At key={name} x={36} y={118 + i * 100} w={468} style={{ opacity: comes * (0.22 + 0.78 * Math.min(1, p * 2)), transform: `translateX(${(1 - Math.min(1, p)) * 12}px) scale(${1 + 0.03 * bump(t, at, 0.4)})`, transformOrigin: "0% 50%" }}>
            <div className="flex items-center gap-3">
              <Mini kind={i} />
              <div>
                <p data-ui="" className="whitespace-nowrap font-display text-[30px] font-extrabold leading-none tracking-tight" style={{ color: INK }}>
                  {name}
                </p>
                <p data-ui="" className="whitespace-nowrap pt-[5px] font-sans text-[21px] font-semibold leading-tight" style={{ color: LEAD }}>
                  {says}
                </p>
              </div>
            </div>
          </At>
        );
      })}
      {one > 0 ? (
        <At x={214} y={626} w={290} style={{ transform: `scale(${Math.min(1.08, one)})`, transformOrigin: "100% 0%" }}>
          <p className="whitespace-nowrap text-right font-display text-[40px] font-extrabold leading-[0.98] tracking-tight" style={{ color: INK }}>
            Un solo gráfico
          </p>
        </At>
      ) : null}
      {saved > 0 ? (
        <At x={272} y={688} w={232} style={{ transform: `scale(${Math.min(1.1, saved)})`, transformOrigin: "100% 50%" }}>
          <div className="flex items-center justify-end gap-2 rounded-[14px] px-3 py-2" style={{ background: LEAD }}>
            <Icono name="bookmark" size={40} strokeWidth={2.8} ancla={false} className="text-white" />
            <p className="font-display text-[38px] font-extrabold leading-none tracking-tight text-white">Guárdalo</p>
          </div>
        </At>
      ) : null}
    </>
  );
}

/* ---------- The eraser, the sound and the world ---------- */

function Eraser({ c }: { c: Cues }) {
  const t = useT();
  const x = eraserX(t, c);
  if (t < c.n.borro - 0.15 || t > c.n.borro + 1) return null;
  const y = 420 + Math.sin(t * 34) * 120;
  return (
    <At x={x - 40} y={y - 44} w={92} h={88} style={{ transform: "rotate(-14deg)" }}>
      <div className="absolute inset-0 rounded-[14px]" style={{ background: "#E86A7A" }} />
      <div className="absolute inset-x-0 top-[34%] h-[66%] rounded-b-[14px]" style={{ background: "#2F5D8C" }} />
    </At>
  );
}

function Sounds({ c }: { c: Cues }) {
  const list: Array<[string, number, number?]> = [
    ["pop", c.g.le + 0.15],
    ["golpe", c.g.solo, 0.2],
    ["golpe", c.f.iris, 0.2],
    ["pop", c.f.tres],
    ["page-turn", c.l.start, 0.26],
    ["whoosh", c.l.todas, 0.14],
    ["click", c.l.error, 0.3],
    ["moneda", c.l.dos, 0.24],
    ["page-turn", c.r.start, 0.26],
    ["whoosh", c.r.suben, 0.2],
    ["whoosh", c.r.bajan, 0.2],
    ["whip", c.r.dobla, 0.18],
    ["blip", c.r.cuatro2, 0.26],
    ["blip", c.r.noventa, 0.26],
    ["golpe", c.r.sesenta, 0.2],
    ["moneda", c.r.virginica, 0.24],
    ["page-turn", c.a.start, 0.26],
    ["whip", c.a.ancho, 0.16],
    ["pop", c.a.setosa],
    ["whip", c.a.pasa2, 0.16],
    ["pop", c.a.casi],
    ["whip", c.a.largo, 0.16],
    ["golpe", c.a.cuatro, 0.2],
    ["moneda", c.a.versicolor, 0.24],
    ["page-turn", c.s.start, 0.26],
    ["whoosh", c.s.busca, 0.2],
    ["click", c.s.apoya, 0.32],
    ["click", c.s.apoya + 0.4, 0.32],
    ["page-turn", c.s.borro, 0.2],
    ["golpe", c.s.no, 0.24],
    ["whip", c.k.start, 0.16],
    ["blip", c.k.vio - 0.35, 0.26],
    ["blip", c.k.vio2 - 0.35, 0.26],
    ["golpe", c.k.memorizar, 0.26],
    ["moneda", c.k.versicolor, 0.24],
    ["page-turn", c.n.start, 0.26],
    ["whoosh", c.n.borro, 0.24],
    ["pop", c.n.cuatro],
    ["pop", c.n.una],
    ["moneda", c.n.versicolor2, 0.24],
    ["whoosh", c.n.cada, 0.14],
    ["golpe", c.n.millon, 0.3],
    ["page-turn", c.v.start, 0.26],
    ["golpe", c.v.virginica, 0.3],
    ["blip", c.v.tres + 0.1, 0.22],
    ["caja-registradora", c.v.acerto, 0.2],
    ["whoosh", c.v.esta, 0.18],
    ["pop", c.c.start - 0.15],
    ["pop", c.c.vecinos - 0.1],
    ["obturador", c.c.guarda, 0.26],
  ];
  return (
    <>
      {list.map(([id, at, volume], i) => (
        <Sfx key={i} id={id} at={at} volume={(volume ?? 0.2) * 0.8} />
      ))}
    </>
  );
}

function Screen({ c }: { c: Cues }) {
  const t = useT();
  const z = rigAt(t, shots(c)).z;
  const band = Math.max(interpolate(z, [1.02, 1.12], [0, 1], clamp), span(t, c.s.busca, c.k.start, 0.3), span(t, c.n.start, c.n.borro + 0.6, 0.2));
  return (
    <div data-screen="" className="absolute left-0 top-0" style={{ width: 540, height: 960 }}>
      <div className="absolute left-0" style={{ top: 112, width: 540, height: 132, opacity: band, background: `linear-gradient(${PAPER} 68%, transparent)` }} />
      <HookText c={c} />
      <FlowerIntro c={c} />
      <LinearText c={c} />
      <LogisticText c={c} />
      <TreeText c={c} />
      <SvmText c={c} />
      <KernelText c={c} />
      <KnnText c={c} />
      <FlowerTally c={c} />
      <Reveal c={c} />
      <DrawingLabels c={c} />
      <Closing c={c} />
      <Eraser c={c} />
    </div>
  );
}

function World() {
  const t = useT();
  const c = useCues();
  const rig = rigAt(t, shots(c));
  const breath = 1 + 0.008 * Math.sin(t * 0.42);
  const shake = shakeAt(t, [c.g.solo, c.l.error, c.r.sesenta, c.a.cuatro, c.s.no, c.k.memorizar, c.n.millon, c.v.virginica]);
  const z = rig.z * breath;
  const transform = `translate(${HOME.x + shake.x}px, ${HOME.y + shake.y}px) scale(${z}) translate(${-rig.x}px, ${-rig.y}px)`;
  return (
    <div className="absolute inset-0 text-ink" style={{ background: PAPER }}>
      <div className="absolute inset-0" style={{ clipPath: "inset(112px 0 152px 0)" }}>
        <div data-zoom={z.toFixed(3)} {...(rig.moving ? { "data-camera-moving": "" } : {})} className="absolute left-0 top-0" style={{ width: 540, height: 960, transform, transformOrigin: "0 0" }}>
          <Graph c={c} />
          <AxisTicks c={c} z={rig.z} />
          <ClusterNames c={c} rig={rig} />
        </div>
      </div>
      <Screen c={c} />
      <Sounds c={c} />
    </div>
  );
}

export default defineVideo({
  captions: "pill",
  chapters: true,
  stage: { World, drift: 0, sfx: false },
  // A replica lasts what its reference lasts (170 s): a faster voice instead of cutting content (docs/direccion-reels.md, 3).
  voice: { tempo: 1.22 },
  music: { file: "audio/cama.mp3" },
  // The avatar only asks for the save: until then the graph has to be seen whole, and the bust would cover setosa.
  avatar: { scenes: ["cierre"], size: 188 },
  meter: {
    kind: "slots",
    max: 5,
    start: 0,
    steps: [
      { scene: "lineal", word: "dos", value: 1 },
      { scene: "logistica", word: "virgínica", value: 2 },
      { scene: "arbol", word: "versicolor", value: 3 },
      { scene: "kernel", word: "versicolor", nth: 2, value: 4 },
      { scene: "knn", word: "versicolor", nth: 2, value: 5 },
    ],
  },
  scenes: [
    // The engine's camera stays out of the way, one to one: this video moves its own (shots).
    { id: "gancho", chapter: "Un gráfico", camera: { focus: { x: 270, y: 427 }, zoom: 1 } },
    { id: "flor", chapter: "Las flores" },
    { id: "lineal", chapter: "Recta" },
    { id: "logistica", chapter: "Curva en S" },
    { id: "arbol", chapter: "Rectángulos" },
    { id: "svm", chapter: "Camino" },
    { id: "kernel", chapter: "Kernel" },
    { id: "knn", chapter: "Nada" },
    { id: "revela", chapter: "Destapo" },
    { id: "cierre", chapter: "Guárdalo", hold: 1.2, avatar: { from: "left", at: "guarda" } },
  ],
});
