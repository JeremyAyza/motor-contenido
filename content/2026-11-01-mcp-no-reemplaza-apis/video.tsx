import { Fragment, type CSSProperties, type ReactNode } from "react";
import { interpolate, spring } from "remotion";
import { Icono, Logo } from "@motor/ui";
import { defineVideo, Sfx, usePop, useStage, useStageCue } from "@motor/video";

// A wall and its wiring (video.json → world): above it your AI apps and their plugs, on it the MCP
// plate and, behind the cover, the same copper cables as ever down to each service.
// The code and the tool definition on screen are real (facts.json); "Tu app", its five services
// and the question are illustrative.

const W = 2500;
const H = 2900;
const VIEW = { x: 270, y: 427 };
/** Each part of the world is drawn in screen coordinates for its rest shot at zoom 1. */
const PLATE = { x: 540, y: 0 };
const INSIDE = { x: 540, y: 960 };
const WALL = { x: 540, y: 1920 };
const MENU = { x: 1180, y: 1920 };
const COST = { x: 1820, y: 1920 };
const center = (o: { x: number; y: number }) => ({ focus: { x: o.x + VIEW.x, y: o.y + VIEW.y }, zoom: 1 });
/** What each scene frames, kept here because the blur of a pan needs where the camera comes from. */
const SHOTS: Record<string, { focus: { x: number; y: number }; zoom: number }> = {
  gancho: center(PLATE),
  adentro: center(INSIDE),
  antes: center(WALL),
  enchufe: center(WALL),
  menu: center(MENU),
  elige: center(MENU),
  costo: center(COST),
  regla: center(COST),
  cierre: center(COST),
};
/** The engine's camera takes this long to reach a scene's shot (MOVE_MS). */
const MOVE_S = 0.9;
const FRAME_S = 1 / 30;

const YELLOW = "#FFD21E";
const CREAM = "#FFF8E1";
const INK = "#15130F";
const VIOLET = "#4A1FD1";
const COPPER = "#E8843C";
const RED = "#D7261E";
const MUTED = "#5B5000";
const PANEL = "#26221A";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (t: number, at: number, dur = 0.25) => interpolate(t, [at, at + dur], [0, 1], clamp);
const inOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const outCubic = (p: number) => 1 - Math.pow(1 - p, 3);
const back = (p: number) => 1 + 2.4 * Math.pow(p - 1, 3) + 1.4 * Math.pow(p - 1, 2);

const useT = () => useStage().ms / 1000;

/** The spring of usePop, as a plain value: safe after an early return or inside a condition. */
const popAt = (t: number, at: number) => (t < at ? 0 : spring({ frame: (t - at) * 30, fps: 30, config: { damping: 10, stiffness: 180 } }));

/** Value along eased keys [at, value], holding the first and last. */
function keys(t: number, list: Array<[number, number]>, ease: (p: number) => number = inOut): number {
  if (t <= list[0][0]) return list[0][1];
  for (let i = 1; i < list.length; i++) {
    const [a, va] = list[i - 1];
    const [b, vb] = list[i];
    if (t < b) return va + (vb - va) * ease((t - a) / Math.max(0.001, b - a));
  }
  return list[list.length - 1][1];
}

function useCues() {
  const cue = useStageCue;
  return {
    gancho: { nunca: cue("gancho", "nunca"), este: cue("gancho", "este"), quito: cue("gancho", "quito"), tapa: cue("gancho", "tapa") },
    adentro: {
      start: cue("adentro", "tu"),
      search: cue("adentro", "search"),
      adentro: cue("adentro", "adentro"),
      llama: cue("adentro", "llama"),
      api: cue("adentro", "api"),
      siempre: cue("adentro", "siempre"),
      list: cue("adentro", "list"),
      graphql: cue("adentro", "graphql"),
      notion: cue("adentro", "notion"),
      usa: cue("adentro", "usa"),
    },
    antes: {
      start: cue("antes", "entonces"),
      mira: cue("antes", "mira"),
      cada: cue("antes", "cada"),
      habla: cue("antes", "habla"),
      cinco: cue("antes", "cinco"),
      enchufe: cue("antes", "enchufe"),
      autenticacion: cue("antes", "autenticación"),
      errores: cue("antes", "errores"),
      reintentos: cue("antes", "reintentos"),
      integraciones: cue("antes", "integraciones"),
      empresa: cue("antes", "empresa"),
      otra: cue("antes", "otra"),
      cinco3: cue("antes", "cinco", 3),
      diez: cue("antes", "diez"),
      github: cue("antes", "github"),
      clientes: cue("antes", "clientes"),
      sistemas: cue("antes", "sistemas"),
      cincuenta: cue("antes", "cincuenta"),
    },
    enchufe: {
      start: cue("enchufe", "mcp"),
      mismo: cue("enchufe", "mismo"),
      app: cue("enchufe", "app"),
      servicio: cue("enchufe", "servicio"),
      vez2: cue("enchufe", "vez", 2),
      bajas: cue("enchufe", "bajas"),
      quince: cue("enchufe", "quince"),
      autenticacion: cue("enchufe", "autenticación"),
      mudaron: cue("enchufe", "mudaron"),
    },
    menu: {
      start: cue("menu", "ahora"),
      cada: cue("menu", "cada"),
      tools: cue("menu", "tools"),
      menu: cue("menu", "menú"),
      nombre: cue("menu", "nombre"),
      descripcion: cue("menu", "descripción"),
      parametros: cue("menu", "parámetros"),
      formato: cue("menu", "formato"),
      mismo: cue("menu", "mismo"),
      nadie: cue("menu", "nadie"),
      lee: cue("menu", "lee"),
      descubrimiento: cue("menu", "descubrimiento"),
    },
    elige: {
      start: cue("elige", "preguntas"),
      modelo: cue("elige", "modelo"),
      elige: cue("elige", "elige"),
      pero: cue("elige", "pero"),
      llama: cue("elige", "llama"),
      app: cue("elige", "app"),
      servidor: cue("elige", "servidor"),
      github: cue("elige", "github"),
      respuesta: cue("elige", "respuesta"),
      camino: cue("elige", "camino"),
    },
    costo: {
      start: cue("costo", "letra"),
      gratis: cue("costo", "gratis"),
      anthropic: cue("costo", "anthropic"),
      cinco: cue("costo", "cinco"),
      antes: cue("costo", "antes"),
      tokens: cue("costo", "tokens"),
      pasando: cue("costo", "pasando"),
      peor: cue("costo", "peor"),
      github: cue("costo", "github"),
      cargar: cue("costo", "cargar"),
    },
    regla: { start: cue("regla", "entonces"), codigo: cue("regla", "código"), api: cue("regla", "api"), elige: cue("regla", "elige"), varias: cue("regla", "varias"), mcp: cue("regla", "mcp") },
    cierre: {
      start: cue("cierre", "api"),
      mcp: cue("cierre", "mcp"),
      cero: cue("cierre", "cero"),
      mandaselo: cue("cierre", "mándaselo"),
    },
  };
}
type Cues = ReturnType<typeof useCues>;

/* ---------- The camera inside a scene, and the hits that shake it ---------- */

type RigKey = { at: number; dur: number; dx?: number; dy?: number; z?: number };

function rigAt(t: number, list: RigKey[]) {
  let state = { dx: 0, dy: 0, z: 1 };
  for (const key of [...list].sort((a, b) => a.at - b.at)) {
    if (t <= key.at) break;
    const p = inOut(Math.min(1, (t - key.at) / key.dur));
    const to = { dx: key.dx ?? 0, dy: key.dy ?? 0, z: key.z ?? 1 };
    state = { dx: state.dx + (to.dx - state.dx) * p, dy: state.dy + (to.dy - state.dy) * p, z: state.z + (to.z - state.z) * p };
  }
  return state;
}

function shakeAt(t: number, hits: number[]) {
  let x = 0;
  let y = 0;
  for (const hit of hits) {
    const dt = t - hit;
    if (dt < 0 || dt > 0.45) continue;
    const amp = 11 * Math.exp(-dt * 11);
    x += Math.sin(dt * 78) * amp * 0.6;
    y += Math.cos(dt * 61) * amp;
  }
  return { x, y };
}

function rigKeys(c: Cues): RigKey[] {
  const { gancho: g, elige: e, costo: k } = c;
  return [
    // The hook: close in while the screw turns, and let go for the dive.
    { at: g.este - 0.1, dur: 0.6, dy: 20, z: 1.06 },
    { at: g.tapa + 0.2, dur: 0.5 },
    // The request: back to the wall, to follow it through the whole building.
    { at: e.app - 0.3, dur: 0.75, dx: WALL.x - MENU.x },
    { at: k.start - 0.9, dur: 0.85 },
  ];
}

/** How fast the picture slides on the screen now, in px per frame: the scene's camera plus the rig. */
function useSlide(c: Cues) {
  const { camera, sceneId, sceneIndex, sceneMs, scenes } = useStage();
  const t = useT();
  const list = rigKeys(c);
  const [a, b] = [rigAt(t - FRAME_S, list), rigAt(t, list)];
  const z = camera.zoom * b.z;
  let x = (b.dx - a.dx) * z;
  let y = (b.dy - a.dy) * z;
  const within = sceneMs / 1000;
  if (sceneIndex > 0 && within < MOVE_S) {
    const [from, to] = [SHOTS[scenes[sceneIndex - 1].id].focus, SHOTS[sceneId].focus];
    const step = inOut(within / MOVE_S) - inOut(Math.max(0, within - FRAME_S) / MOVE_S);
    x += (to.x - from.x) * step * camera.zoom;
    y += (to.y - from.y) * step * camera.zoom;
  }
  return { x, y };
}

/* ---------- Building blocks ---------- */

function At({ x, y, w, h, style, className, children }: { x: number; y: number; w?: number; h?: number; style?: CSSProperties; className?: string; children?: ReactNode }) {
  return (
    <div className={`absolute ${className ?? ""}`} style={{ left: x, top: y, width: w, height: h, ...style }}>
      {children}
    </div>
  );
}

/** Pops in with a spring at `at` and leaves at `until`. */
function Appear({ at, until, x, y, w, h, sound = "pop", origin = "50% 50%", from = 18, rotate = 0, children }: { at: number; until?: number; x: number; y: number; w?: number; h?: number; sound?: string | null; origin?: string; from?: number; rotate?: number; children: ReactNode }) {
  const t = useT();
  const p = usePop(at);
  const out = until === undefined ? 0 : fade(t, until, 0.2);
  if (t < at || out >= 1) return null;
  return (
    <At x={x} y={y} w={w} h={h} style={{ opacity: Math.min(1, p * 2) * (1 - out), transform: `translateY(${(1 - Math.min(1, p)) * from}px) rotate(${rotate}deg) scale(${0.72 + 0.28 * p})`, transformOrigin: origin }}>
      {sound ? <Sfx id={sound} at={at} volume={0.25} /> : null}
      {children}
    </At>
  );
}

/** A rubber stamp: falls fast, hits at `at`, and keeps the worn ink. */
function Stamp({ at, until, x, y, color, rotate = -6, size = 44, fill, children }: { at: number; until?: number; x: number; y: number; color: string; rotate?: number; size?: number; fill?: string; children: ReactNode }) {
  const t = useT();
  if (t < at - 0.1) return null;
  const out = until === undefined ? 0 : fade(t, until, 0.2);
  if (out >= 1) return null;
  const fall = interpolate(t, [at - 0.1, at], [2.6, 1], clamp);
  const press = t < at ? 1 : 1 + 0.05 * Math.exp(-(t - at) * 18);
  return (
    <div data-ui="" className="absolute" style={{ left: x, top: y, opacity: fade(t, at - 0.1, 0.06) * (1 - out), transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${fall * press})` }}>
      <Sfx id="golpe" at={at} volume={0.34} />
      {fill ? <div className="absolute inset-[-6px] rounded-[12px]" style={{ background: fill }} /> : null}
      <div className="relative whitespace-nowrap rounded-[10px] px-4 py-1.5 text-center font-display font-black uppercase leading-[1.02] tracking-tight" style={{ color, fontSize: size, border: `5px solid ${color}`, outline: `2px solid ${color}`, outlineOffset: 3 }}>
        {children}
      </div>
    </div>
  );
}

/** Dust that blows out from a line when something heavy hits it. */
function Dust({ at, x, y, width, color = "rgba(21,19,15,0.55)", puff = "#F1C100" }: { at: number; x: number; y: number; width: number; color?: string; puff?: string }) {
  const dt = useT() - at;
  if (dt < 0 || dt > 0.7) return null;
  const p = outCubic(dt / 0.7);
  return (
    <>
      {Array.from({ length: 20 }, (_, i) => {
        const a = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
        const b = Math.abs(Math.sin(i * 78.233) * 12543.1231) % 1;
        const speck = i % 3 === 0;
        const r = speck ? 3 + 4 * b : 12 + 22 * b;
        const reach = speck ? 90 + 70 * b : 26 + 34 * b;
        const angle = a * Math.PI * 2;
        return <span key={i} className="absolute rounded-full" style={{ left: x + width * ((i * 0.618) % 1) + Math.cos(angle) * reach * 1.5 * p - r, top: y + Math.sin(angle) * reach * p - r, width: r * 2, height: r * 2, background: speck ? color : puff, transform: `scale(${speck ? 1 - p * 0.6 : 0.3 + 0.9 * p})`, opacity: Math.pow(1 - p, 1.3) }} />;
      })}
    </>
  );
}

/** An edge torn by hand: the same points every frame. */
function tornPolygon(w: number, h: number, seed: number, amp = 7, step = 26) {
  const noise = (i: number) => (Math.abs(Math.sin((i + seed) * 12.9898) * 43758.5453) % 1) * amp;
  const pts: string[] = [];
  let i = 0;
  for (let x = 0; x <= w; x += step) pts.push(`${x}px ${noise(i++).toFixed(1)}px`);
  for (let y = step; y <= h; y += step) pts.push(`${(w - noise(i++)).toFixed(1)}px ${y}px`);
  for (let x = w - step; x >= 0; x -= step) pts.push(`${x}px ${(h - noise(i++)).toFixed(1)}px`);
  for (let y = h - step; y > 0; y -= step) pts.push(`${noise(i++).toFixed(1)}px ${y}px`);
  return `polygon(${pts.join(", ")})`;
}

function Torn({ x, y, w, h, color = INK, seed = 1, amp, children }: { x: number; y: number; w: number; h: number; color?: string; seed?: number; amp?: number; children?: ReactNode }) {
  return (
    <At x={x} y={y} w={w} h={h} style={{ background: color, clipPath: tornPolygon(w, h, seed, amp) }}>
      {children}
    </At>
  );
}

/** Embossed label tape: the name of a tool, always in the same format. */
function Dymo({ x, y, text, size = 28, color = INK, printed = 1, rotate = 0, ring = 0 }: { x: number; y: number; text: string; size?: number; color?: string; printed?: number; rotate?: number; ring?: number }) {
  return (
    <div data-ui="" className="absolute overflow-hidden whitespace-nowrap font-mono font-bold leading-none" style={{ left: x, top: y, color: "#FFFFFF", background: color, fontSize: size, padding: "9px 14px", borderRadius: 3, transform: `rotate(${rotate}deg)`, transformOrigin: "0 50%", clipPath: ring ? undefined : `inset(0 ${(1 - printed) * 100}% 0 0)`, outline: ring ? `${5 * ring}px solid ${VIOLET}` : undefined, outlineOffset: 3 }}>
      {text}
    </div>
  );
}

/** A flat sticker, cut out with a thick edge. */
function Sticker({ x, y, w, h, rotate = 0, color = CREAM, style, className, children }: { x: number; y: number; w?: number; h?: number; rotate?: number; color?: string; style?: CSSProperties; className?: string; children?: ReactNode }) {
  return (
    <At x={x} y={y} w={w} h={h} className={`rounded-[12px] border-[3px] ${className ?? ""}`} style={{ background: color, borderColor: INK, transform: `rotate(${rotate}deg)`, ...style }}>
      {children}
    </At>
  );
}

/** The model: a cutout with googly eyes. Its pupils look at (lx, ly), from -1 to 1. */
function Model({ x, y, s = 1, lx = 0, ly = 0, dizzy = 0 }: { x: number; y: number; s?: number; lx?: number; ly?: number; dizzy?: number }) {
  const t = useT();
  const eye = (side: number) => {
    const spin = dizzy * (t * 9 + side);
    const [px, py] = [lx * 13 + Math.cos(spin) * dizzy * 13, ly * 13 + Math.sin(spin) * dizzy * 13];
    return (
      <span key={side} className="relative block h-[62px] w-[62px] rounded-full border-[4px]" style={{ background: "#FFFFFF", borderColor: INK }}>
        <span className="absolute h-[28px] w-[28px] rounded-full" style={{ left: 13 + px, top: 13 + py, background: INK }} />
      </span>
    );
  };
  return (
    <Sticker x={x} y={y} w={170} h={150} rotate={-3} style={{ transform: `rotate(-3deg) scale(${s})`, transformOrigin: "50% 100%" }}>
      <div className="mt-[14px] flex justify-center gap-[6px]">{[0, 1].map(eye)}</div>
      <p data-ui="" className="mt-[8px] text-center font-mono text-[22px] font-bold leading-none" style={{ color: INK }}>
        tu modelo
      </p>
    </Sticker>
  );
}

function AppSticker({ x, y, name, on = 1 }: { x: number; y: number; name: string; on?: number }) {
  return (
    <Sticker x={x - 92} y={y} w={184} h={78} className="flex items-center justify-center gap-2" style={{ transform: `scale(${on})` }}>
      <Icono name="sparkles" size={28} strokeWidth={2.4} ancla={false} className="text-ink" />
      <p data-ui="" className="whitespace-nowrap font-display text-[30px] font-black leading-none" style={{ color: INK }}>
        {name}
      </p>
    </Sticker>
  );
}

/** A service's sticker, centered on (x, y). */
function ServiceChip({ x, y, slug, on = 1, size = 80 }: { x: number; y: number; slug: string; on?: number; size?: number }) {
  return (
    <div className="absolute flex items-center justify-center rounded-[14px] border-[3px]" style={{ left: x - size / 2, top: y - size / 2, width: size, height: size, background: "#FFFFFF", borderColor: INK, transform: `scale(${on})` }}>
      <Logo slug={slug} size={size * 0.62} ancla={false} />
    </div>
  );
}

const SERVICES = ["github", "slack", "notion", "stripe", "linear"];
const XS = [62, 166, 270, 374, 478];

/** One plug per kind: before MCP no two have the same shape. */
function Plug({ x, y, kind, mcp = 0 }: { x: number; y: number; kind: number; mcp?: number }) {
  const body: CSSProperties[] = [
    { borderRadius: "50%" },
    { borderRadius: 4 },
    { clipPath: "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)" },
    { transform: "rotate(45deg) scale(0.74)", borderRadius: 4 },
    { borderRadius: 18, height: 26, marginTop: 4 },
  ];
  const pins = [
    [14, 28],
    [10, 22, 32],
    [20],
    [8, 32],
    [12, 30],
  ];
  if (mcp) {
    return (
      <div className="absolute" style={{ left: x - 21, top: y, width: 42, height: 46, transform: `scale(${0.9 + 0.1 * mcp})` }}>
        <div className="flex h-[34px] w-[42px] items-center justify-center rounded-[6px] border-[3px]" style={{ background: VIOLET, borderColor: INK }}>
          <Icono name="zap" size={20} strokeWidth={2.6} ancla={false} className="text-white" />
        </div>
        {[12, 26].map((px) => (
          <span key={px} className="absolute top-[34px] h-[12px] w-[5px] rounded-b-[2px]" style={{ left: px, background: INK }} />
        ))}
      </div>
    );
  }
  return (
    <div className="absolute" style={{ left: x - 21, top: y, width: 42, height: 46 }}>
      <div className="h-[34px] w-[42px] border-[3px]" style={{ background: CREAM, borderColor: INK, ...body[kind] }} />
      {pins[kind].map((px) => (
        <span key={px} className="absolute top-[34px] h-[12px] rounded-b-[2px]" style={{ left: px - 3, width: kind === 2 ? 14 : 5, background: INK }} />
      ))}
    </div>
  );
}

/** A cable that draws itself. */
function Cable({ d, on = 1, color = INK, width = 6, dash }: { d: string; on?: number; color?: string; width?: number; dash?: boolean }) {
  if (on <= 0) return null;
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={dash ? undefined : 1} strokeDashoffset={dash ? undefined : 1 - on} />;
}

/* ---------- Gancho: the plate ---------- */

function HookTitle() {
  return (
    <h1 className="font-display text-[56px] font-black leading-[0.98] tracking-tight text-ink">
      MCP no reemplaza <span style={{ color: VIOLET }}>tus APIs</span>
    </h1>
  );
}

function Screwdriver({ x, y, angle }: { x: number; y: number; angle: number }) {
  const t = useT();
  const twist = (t * 40) % 16;
  return (
    <div className="absolute" style={{ left: x, top: y, transformOrigin: "0 0", transform: `rotate(${angle}deg)` }}>
      <div className="absolute left-0 top-[-5px] h-[10px] w-[120px]" style={{ background: "linear-gradient(#B9B4A6, #8C8778)" }} />
      <div className="absolute left-[118px] top-[-22px] h-[44px] w-[170px] rounded-[12px] border-[3px]" style={{ borderColor: INK, backgroundColor: VIOLET, backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.28) 0 5px, transparent 5px 16px)", backgroundPositionY: twist }} />
    </div>
  );
}

function Screw({ x, y, angle, off = 0, dir = 1 }: { x: number; y: number; angle: number; off?: number; dir?: number }) {
  if (off >= 1) return null;
  return (
    <div className="absolute flex h-[30px] w-[30px] items-center justify-center rounded-full border-[3px]" style={{ left: x - 15, top: y - 15 - off * 260 + off * off * 620, background: "#D8D3C4", borderColor: INK, transform: `translateX(${dir * off * 170}px) rotate(${angle}deg)`, opacity: 1 - off * off }}>
      <span className="h-[4px] w-[20px]" style={{ background: INK }} />
    </div>
  );
}

function PlatePart({ c }: { c: Cues }) {
  const t = useT();
  const g = c.gancho;
  const off = t - g.tapa;
  const fall = off > 0 ? 1500 * off * off : 0;
  const rot = off > 0 ? Math.min(58, 70 * off) : 0;
  const wires = fade(t, g.tapa, 0.2);
  if (t > c.adentro.search + 1) return null;
  return (
    <At x={PLATE.x} y={PLATE.y} w={540} h={960}>
      {/* The hole under the plate, and the way down when the plate falls. */}
      <Torn x={176} y={282} w={348} h={700} seed={3}>
        <svg className="absolute left-0 top-0" width={348} height={700} aria-hidden>
          {[80, 174, 268].map((x, i) => (
            <path key={x} d={`M ${x} 0 C ${x + 40} 160, ${x - 40} 300, ${x} 700`} fill="none" stroke={COPPER} strokeWidth={9} strokeLinecap="round" opacity={0.5 + wires * 0.5} pathLength={1} strokeDasharray="0.04 0.012" strokeDashoffset={-t * 0.15 * (i % 2 ? 1 : -1)} />
          ))}
        </svg>
        {t >= g.tapa ? (
          <p className="absolute inset-x-0 top-[120px] text-center font-display text-[128px] font-black leading-none" style={{ color: COPPER, opacity: wires, transform: `scale(${0.7 + 0.3 * back(Math.min(1, off / 0.3))})` }}>
            API
          </p>
        ) : null}
      </Torn>
      {/* The plate. */}
      <div className="absolute" style={{ left: 192, top: 296, width: 316, height: 410, transform: `translateY(${fall}px) rotate(${rot}deg)`, transformOrigin: "85% 100%", opacity: off > 0.9 ? 0 : 1 }}>
        <div className="absolute inset-0 rounded-[22px] border-[4px]" style={{ background: CREAM, borderColor: INK }} />
        <div className="absolute left-0 right-0 top-[56px] flex items-center justify-center gap-3">
          <Logo slug="modelcontextprotocol" size={78} ancla={false} />
          <p className="font-display text-[58px] font-black leading-none" style={{ color: INK }}>
            MCP
          </p>
        </div>
        <div className="absolute left-[88px] top-[160px] flex h-[140px] w-[140px] items-center justify-center rounded-full border-[4px]" style={{ background: "#EFE6C8", borderColor: INK }}>
          <span className="flex h-[102px] w-[102px] items-center justify-center rounded-[18px] border-[4px]" style={{ background: "#FFFFFF", borderColor: INK }}>
            <Logo slug="github" size={68} ancla={false} />
          </span>
        </div>
        <p data-ui="" className="absolute inset-x-0 top-[318px] text-center font-mono text-[22px] font-bold leading-none" style={{ color: INK }}>
          github-mcp-server
        </p>
      </div>
      {off <= 0 || off < 0.9 ? (
        <>
          <Screw x={350} y={324} angle={t * 260} off={Math.max(0, Math.min(1, (t - g.quito) / 0.6))} dir={-1} />
          <Screw x={350} y={684} angle={t > g.este ? t * 260 : 0} off={Math.max(0, Math.min(1, (t - g.quito - 0.25) / 0.6))} />
        </>
      ) : null}
      {t < g.tapa + 0.1 ? <Screwdriver x={352} y={t < g.este ? 322 : 682} angle={t < g.este ? -24 : -9} /> : null}
      <Dust at={g.tapa + 0.1} x={210} y={700} width={280} />
      {/* The ratchet of the screwdriver, until the screws pop. */}
      {Array.from({ length: Math.max(0, Math.floor((g.quito - 0.1) / 0.32)) }, (_, i) => (
        <Sfx key={i} id="click" at={0.1 + i * 0.32} volume={0.12} />
      ))}
      <Sfx id="pop" at={g.quito} volume={0.26} />
      <Sfx id="pop" at={g.quito + 0.25} volume={0.26} />
      <Sfx id="golpe" at={g.tapa + 0.1} volume={0.4} />
    </At>
  );
}

/* ---------- Adentro: the same API as ever ---------- */

function InsidePart({ c }: { c: Cues }) {
  const t = useT();
  const a = c.adentro;
  if (t < c.gancho.tapa || t > c.antes.start + 1) return null;
  const packet = keys(t, [
    [a.api - 0.1, 380],
    [a.api + 0.5, 640],
    [a.siempre + 0.2, 640],
    [a.siempre + 0.6, 380],
  ]);
  const code = fade(t, a.notion - 0.1, 0.25);
  const lit = fade(t, a.llama, 0.2);
  return (
    <At x={INSIDE.x} y={INSIDE.y} w={540} h={960}>
      <At x={-40} y={-40} w={620} h={1040} style={{ background: INK }} />
      <svg className="absolute left-0 top-0 overflow-visible" width={540} height={960} aria-hidden>
        <path d="M 180 90 L 180 640" fill="none" stroke={COPPER} strokeWidth={10} strokeLinecap="round" opacity={0.35 + lit * 0.65} />
        <Cable d="M 400 90 C 400 300, 400 500, 400 640" on={fade(t, a.notion, 0.5)} color={COPPER} width={10} />
        <Cable d="M 60 430 C 60 540, 130 600, 150 650" on={fade(t, a.list, 0.5)} color="#F4B183" width={8} />
      </svg>
      <Appear at={a.start} x={36} y={116} from={-24} rotate={-2} until={a.notion}>
        <p className="rounded-[10px] border-[3px] px-3 py-2 font-display text-[30px] font-black leading-none" style={{ background: CREAM, borderColor: INK, color: INK }}>
          Tu agente
        </p>
      </Appear>
      <Appear at={a.search} x={206} y={120} from={-30} rotate={-1.5} until={a.notion}>
        <Dymo x={0} y={0} text="search_code" size={30} color={VIOLET} printed={fade(t, a.search, 0.4)} />
      </Appear>
      {/* The real line, wrapped to fit: pkg/github/search.go, 325. */}
      {t >= a.adentro && code < 1 ? (
        <Appear at={a.adentro} x={36} y={192} w={468} from={24} until={a.notion}>
          <div data-ui="" className="overflow-hidden rounded-[12px] border-[3px]" style={{ background: "#1E1B15", borderColor: COPPER }}>
            <div className="flex items-center gap-2 border-b-[3px] px-3 py-2" style={{ borderColor: COPPER, background: PANEL }}>
              <Logo slug="github" size={22} ancla={false} chip />
              <p className="truncate font-mono text-[19px] font-bold" style={{ color: CREAM }}>
                github-mcp-server / search.go
              </p>
            </div>
            <div className="px-4 py-2 font-mono text-[28px] font-bold leading-[36px]" style={{ color: "#B9B4A6" }}>
              <p>{"result, resp, err :="}</p>
              <p className="whitespace-pre" style={{ color: lit ? COPPER : undefined }}>
                {"  client.Search.Code("}
                <br />
                {"    ctx, query, opts)"}
              </p>
            </div>
          </div>
        </Appear>
      ) : null}
      {t >= a.api - 0.1 && t < a.siempre + 0.6 ? <div className="absolute h-[34px] w-[34px] rounded-[6px]" style={{ left: 163, top: packet, background: COPPER, boxShadow: `0 0 0 6px rgba(232,132,60,0.25)` }} /> : null}
      <ServiceChip x={180} y={700} slug="github" size={108} on={popAt(t, a.adentro)} />
      <Appear at={a.api + 0.2} x={250} y={672} from={10} origin="0% 50%" until={a.notion - 0.1}>
        <Dymo x={0} y={0} text="GET /search/code" size={22} color={PANEL} />
      </Appear>
      <Stamp at={a.siempre} x={362} y={510} color={COPPER} rotate={-7} size={40} until={a.notion - 0.1}>
        La de siempre
      </Stamp>
      <Appear at={a.list} x={36} y={410} from={-24} until={a.notion}>
        <Dymo x={0} y={0} text="list_issues" size={28} color={VIOLET} printed={fade(t, a.list, 0.35)} />
      </Appear>
      <Appear at={a.graphql} x={196} y={590} from={8} origin="0% 50%" until={a.notion}>
        <Dymo x={0} y={0} text="GraphQL" size={30} color={PANEL} />
      </Appear>
      {/* What Notion writes about its own server. */}
      <Appear at={a.notion} x={36} y={126} w={468} from={40} rotate={-1}>
        <div className="rounded-[12px] border-[3px] px-5 py-4" style={{ background: CREAM, borderColor: INK }}>
          <div data-ui="" className="flex items-center gap-2">
            <Logo slug="notion" size={30} ancla={false} />
            <p className="font-mono text-[20px] font-bold" style={{ color: MUTED }}>
              developers.notion.com
            </p>
          </div>
          <p className="mt-3 font-text text-[33px] font-semibold leading-[1.2]" style={{ color: INK }} data-ui="">
            An MCP client connects to Notion's remote MCP server,{" "}
            <span style={{ backgroundImage: `linear-gradient(${YELLOW}, ${YELLOW})`, backgroundRepeat: "no-repeat", backgroundSize: `${fade(t, a.usa, 0.4) * 100}% 100%` }}>which uses the Notion API.</span>
          </p>
        </div>
      </Appear>
      <ServiceChip x={400} y={700} slug="notion" size={108} on={popAt(t, a.notion)} />
    </At>
  );
}

/* ---------- Antes and enchufe: the wall ---------- */

/** The wall stands high: the bust goes under the services, and the rest of that band holds the big words. */
const PLUG_Y = 300;
const WALL_Y = 338;
const SERVER_Y = 408;
const CHIP_Y = 537;

/** A line for the dark band under the services, beside the bust. */
function BandText({ at, until, x = 232, y = 636, w = 272, size = 54, color = CREAM, children }: { at: number; until: number; x?: number; y?: number; w?: number; size?: number; color?: string; children: ReactNode }) {
  return (
    <Appear at={at} until={until} x={x} y={y} w={w} from={14} rotate={-2} sound="blip">
      <p className="font-display font-black leading-[0.98] tracking-tight" style={{ color, fontSize: size }}>
        {children}
      </p>
    </Appear>
  );
}

function WallPart({ c }: { c: Cues }) {
  const t = useT();
  const a = c.antes;
  const e = c.enchufe;
  if (t < a.start - 1 || t > c.costo.start + 0.4 || (t > c.menu.start + 1 && t < c.elige.app - 0.4)) return null;
  const app1x = keys(t, [
    [a.otra - 0.1, 270],
    [a.otra + 0.3, 140],
  ]);
  const app2y = keys(
    t,
    [
      [a.otra, -240],
      [a.otra + 0.35, 118],
    ],
    (p) => back(p),
  );
  const oldCables = 1 - fade(t, e.app, 0.25);
  const strip = keys(t, [
    [e.start, -620],
    [e.mismo, 0],
  ]);
  const allIn = fade(t, e.app, 0.35);
  // The request, from your app down to GitHub and back.
  const route: Array<[number, number]> = [
    [140, 196],
    [140, WALL_Y + 14],
    [62, WALL_Y + 32],
    [62, SERVER_Y + 40],
    [62, CHIP_Y - 43],
  ];
  const progress = (time: number) =>
    keys(time, [
      [c.elige.app, 0],
      [c.elige.servidor, 0.5],
      [c.elige.github, 1],
      [c.elige.respuesta, 1],
      [c.elige.camino, 0],
    ]);
  const packetAt = (time: number) => {
    const seg = progress(time) * (route.length - 1);
    const i0 = Math.min(route.length - 2, Math.floor(seg));
    return [route[i0][0] + (route[i0 + 1][0] - route[i0][0]) * (seg - i0), route[i0][1] + (route[i0 + 1][1] - route[i0][1]) * (seg - i0)];
  };
  const [px, py] = packetAt(t);
  const onWay = t >= c.elige.app - 0.2 && t < c.elige.camino + 0.2;
  const returning = t >= c.elige.respuesta;
  const hit = t >= c.elige.github ? 0.24 * Math.exp(-(t - c.elige.github) * 5) : 0;
  return (
    <At x={WALL.x} y={WALL.y} w={540} h={960}>
      {/* Behind the wall: the cables never change. */}
      <Torn x={-20} y={WALL_Y + 18} w={580} h={454} seed={7}>
        <svg className="absolute left-0 top-0" width={580} height={454} aria-hidden>
          {XS.map((x) => (
            <path key={x} d={`M ${x + 20} 0 L ${x + 20} ${CHIP_Y - WALL_Y - 18}`} stroke={COPPER} strokeWidth={8} strokeLinecap="round" fill="none" />
          ))}
        </svg>
      </Torn>
      {/* The wall, with five rough holes. */}
      <At x={-20} y={WALL_Y} w={580} h={48} style={{ background: "#F2B705", borderTop: `4px solid ${INK}`, borderBottom: `4px solid ${INK}` }}>
        {XS.map((x) => (
          <span key={x} className="absolute h-[28px] w-[46px] rounded-full" style={{ left: x + 20 - 23, top: 6, background: INK }} />
        ))}
      </At>
      {SERVICES.map((slug, i) => (
        <ServiceChip key={slug} x={XS[i]} y={CHIP_Y} slug={slug} size={86} on={popAt(t, a.habla + i * 0.16) + (i === 0 ? hit : 0)} />
      ))}
      <svg className="absolute left-0 top-0 overflow-visible" width={540} height={960} aria-hidden>
        {XS.map((x, i) => (
          <Cable key={x} d={`M ${app1x} 196 C ${app1x} 250, ${x} 250, ${x} ${PLUG_Y}`} on={fade(t, a.habla + i * 0.16, 0.3) * (oldCables > 0 ? 1 : 0)} color={INK} width={6} />
        ))}
        {XS.map((x, i) => (
          <Cable key={x} d={`M 400 196 C 400 250, ${x + 7} 250, ${x + 7} ${PLUG_Y}`} on={fade(t, a.cinco3 + i * 0.1, 0.3) * (oldCables > 0 ? 1 : 0)} color="#5B4A00" width={6} />
        ))}
        <Cable d={`M 140 196 L 140 ${WALL_Y - 12}`} on={allIn} color={VIOLET} width={10} />
        <Cable d={`M 400 196 L 400 ${WALL_Y - 12}`} on={allIn} color={VIOLET} width={10} />
      </svg>
      {XS.map((x, i) => (t >= a.habla + i * 0.16 && oldCables > 0 ? <Plug key={x} x={x} y={PLUG_Y} kind={i} mcp={t >= e.mismo + i * 0.14 ? 1 : 0} /> : null))}
      {t >= a.clientes && t < e.mismo - 0.2 ? null : <AppSticker x={app1x} y={118} name="Tu app" on={popAt(t, a.mira)} />}
      {t >= a.otra && !(t >= a.clientes && t < e.mismo - 0.2) ? <AppSticker x={400} y={app2y} name="App 2" /> : null}
      {/* Each app learns MCP once. */}
      <Appear at={e.app} x={164} y={176} from={6} rotate={4}>
        <Dymo x={0} y={0} text="MCP" size={20} color={VIOLET} />
      </Appear>
      <Appear at={e.app + 0.2} x={424} y={176} from={6} rotate={4}>
        <Dymo x={0} y={0} text="MCP" size={20} color={VIOLET} />
      </Appear>
      {/* The MCP power strip comes in from the side. */}
      {t >= e.start ? (
        <At x={strip} y={WALL_Y - 14} w={540} h={74} style={{ background: VIOLET, borderTop: `4px solid ${INK}`, borderBottom: `4px solid ${INK}` }}>
          {XS.map((x, i) => {
            const dt = t - (e.mismo + i * 0.14);
            return (
              <Fragment key={x}>
                <span className="absolute flex h-[42px] w-[50px] items-center justify-center rounded-[8px] border-[3px]" style={{ left: x - 25, top: 12, background: "#FFFFFF", borderColor: INK, transform: `scale(${dt >= 0 ? 1 + 0.3 * Math.exp(-dt * 12) : 0.9})` }}>
                  <Sfx id="switch" at={e.mismo + i * 0.14} volume={0.22} />
                  <span className="h-[12px] w-[4px] rounded" style={{ background: INK, marginRight: 8 }} />
                  <span className="h-[12px] w-[4px] rounded" style={{ background: INK }} />
                </span>
                {/* The clack of the plug going in. */}
                {dt >= 0 && dt < 0.35 ? <span className="absolute h-[90px] w-[90px] rounded-full border-[5px]" style={{ left: x - 45, top: -12, borderColor: "#FFFFFF", opacity: 1 - dt / 0.35, transform: `scale(${0.4 + dt * 2.2})` }} /> : null}
              </Fragment>
            );
          })}
        </At>
      ) : null}
      {/* A server under each socket. */}
      {XS.map((x, i) => {
        const at = e.servicio + i * 0.16;
        if (t < at) return null;
        const pop = back(Math.min(1, (t - at) / 0.32));
        return (
          <div key={x} data-ui="" className="absolute flex h-[74px] w-[92px] flex-col items-center justify-center rounded-[10px] border-[3px]" style={{ left: x - 46, top: SERVER_Y, background: CREAM, borderColor: VIOLET, transform: `scale(${Math.min(1.02, pop)})` }}>
            <Icono name="server" size={26} strokeWidth={2.4} ancla={false} className="text-accent" />
            <p className="font-mono text-[15px] font-bold leading-none" style={{ color: VIOLET }}>
              server
            </p>
          </div>
        );
      })}
      {/* Three red tags per cable: what each integration costs. */}
      {XS.map((x, i) =>
        [0, 1, 2].map((k) => {
          const at = i === 0 ? [a.autenticacion, a.errores, a.reintentos][k] : a.integraciones + i * 0.06;
          const appear = fade(t, at, 0.15);
          if (!appear) return null;
          const y = keys(t, [
            [e.app - 0.1, 224 + k * 21],
            [e.app + 0.3, PLUG_Y - 6 + k * 8],
            [e.mudaron - 0.1 + i * 0.05, PLUG_Y - 6 + k * 8],
            [e.mudaron + 0.55 + i * 0.05, SERVER_Y + 6 + k * 14],
          ]);
          const home = fade(t, e.mudaron + i * 0.05, 0.55);
          return <span key={`${x}-${k}`} className="absolute h-[16px] w-[26px] rounded-[3px] border-[2px]" style={{ left: x - 13 + (k % 2 ? 5 : -5) * (1 - home) + home * 33, top: y, background: RED, borderColor: INK, opacity: appear, transform: `scale(${1 - 0.35 * home})` }} />;
        }),
      )}
      {/* Antes: the words and the count, beside the bust. */}
      <BandText at={a.cinco} until={a.cada - 0.05}>
        5 servicios
      </BandText>
      <BandText at={a.cada} until={a.autenticacion - 0.05}>
        Cada uno, su enchufe
      </BandText>
      <Appear at={a.autenticacion} x={234} y={606} from={10} until={a.integraciones - 0.2} rotate={-2}>
        <Dymo x={0} y={0} text="autenticación" color={RED} size={30} />
      </Appear>
      <Appear at={a.errores} x={246} y={666} from={10} until={a.integraciones - 0.2} rotate={1.5}>
        <Dymo x={0} y={0} text="errores" color={RED} size={30} />
      </Appear>
      <Appear at={a.reintentos} x={234} y={726} from={10} until={a.integraciones - 0.2} rotate={-1.5}>
        <Dymo x={0} y={0} text="reintentos" color={RED} size={30} />
      </Appear>
      <Stamp at={a.integraciones} x={368} y={695} color={RED} rotate={-5} size={120} fill={YELLOW} until={a.otra - 0.05}>
        5
      </Stamp>
      <BandText at={a.otra} until={a.diez - 0.05} size={66}>
        Otra vez
      </BandText>
      <Stamp at={a.diez} x={368} y={695} color={RED} rotate={4} size={120} fill={YELLOW} until={a.cincuenta - 0.1}>
        10
      </Stamp>
      <Stamp at={a.cincuenta} x={368} y={695} color={RED} rotate={-4} size={120} fill={YELLOW} until={e.mismo - 0.25}>
        50
      </Stamp>
      {/* Enchufe: nobody stands here, so the band is all for the words. */}
      <BandText at={e.mismo} until={e.app - 0.05} x={44} y={636} w={452} size={66}>
        El mismo enchufe
      </BandText>
      <Appear at={e.app} x={44} y={622} from={10} until={e.bajas - 0.8} rotate={-1}>
        <Dymo x={0} y={0} text="Tu app: una vez" color={VIOLET} size={32} />
      </Appear>
      <Appear at={e.servicio} x={44} y={692} from={10} until={e.bajas - 0.8} rotate={1}>
        <Dymo x={0} y={0} text="Cada servicio: una vez" color={VIOLET} size={32} />
      </Appear>
      <Stamp at={e.quince} x={270} y={695} color={VIOLET} rotate={-4} size={120} fill={YELLOW} until={e.autenticacion - 0.05}>
        15
      </Stamp>
      <BandText at={e.autenticacion} until={e.mudaron - 0.05} x={44} y={636} w={452} size={60}>
        No desaparecieron
      </BandText>
      <Appear at={e.mudaron} x={60} y={630} from={8} rotate={-3} until={c.menu.start}>
        <p className="rounded-[10px] border-[3px] px-4 py-2 font-display text-[72px] font-black leading-none" style={{ background: "#FFFFFF", borderColor: INK, color: RED }}>
          Se mudaron
        </p>
      </Appear>
      {/* The same request changes its label when the server turns it into a call to the API. */}
      {onWay ? (
        <>
          <Sfx id="whip" at={c.elige.app} volume={0.2} />
          <Sfx id="golpe" at={c.elige.github} volume={0.26} />
          <Sfx id="whip" at={c.elige.respuesta} volume={0.2} />
          {[3, 2, 1].map((k) => {
            const [gx, gy] = packetAt(t - k * 0.05);
            return <div key={k} className="absolute h-[30px] w-[30px] rounded-[6px]" style={{ left: gx - 15, top: gy - 15, background: gy < SERVER_Y ? VIOLET : COPPER, opacity: 0.32 - k * 0.08 }} />;
          })}
          <div className="absolute h-[38px] w-[38px] rounded-[8px] border-[3px]" style={{ left: px - 19, top: py - 19, background: py < SERVER_Y ? VIOLET : COPPER, borderColor: INK }} />
          <Dymo x={px + 28} y={py - 21} text={returning ? "respuesta" : py < SERVER_Y ? "list_issues" : "GraphQL"} size={23} color={py < SERVER_Y ? VIOLET : PANEL} />
          {/* The stops of the trip, lit as the request goes through them. */}
          <div className="absolute flex items-center justify-between" style={{ left: 36, top: 646, width: 468 }}>
            {[
              { name: "Tu app", from: 0, bg: "#FFFFFF", ink: INK },
              { name: "MCP", from: 0.25, bg: VIOLET, ink: "#FFFFFF" },
              { name: "server", from: 0.6, bg: VIOLET, ink: "#FFFFFF" },
              { name: "API", from: 0.9, bg: COPPER, ink: INK },
            ].map((stop) => {
              const lit = progress(t) >= stop.from;
              return (
                <p key={stop.name} data-ui="" className="flex h-[72px] w-[108px] items-center justify-center rounded-[12px] border-[3px] font-display text-[27px] font-black leading-none" style={{ background: lit ? stop.bg : PANEL, borderColor: lit ? CREAM : "#4A4436", color: lit ? stop.ink : "#8C8778" }}>
                  {stop.name}
                </p>
              );
            })}
          </div>
        </>
      ) : null}
      <Sfx id="golpe" at={e.mismo} volume={0.3} />
    </At>
  );
}

/* ---------- Menu and elige ---------- */

const TOOLS = ["search_code", "list_issues", "issue_write", "pull_request_read"];

function MenuPart({ c }: { c: Cues }) {
  const t = useT();
  const m = c.menu;
  const e = c.elige;
  if (t < m.start - 0.05 || t > c.elige.app + 0.6) return null;
  const cardOn = t >= m.nombre && t < m.nadie;
  const cardOut = fade(t, m.nadie - 0.05, 0.25);
  const looking = t >= m.lee ? Math.sin((t - m.lee) * 5) : 0;
  const hopTimes = [e.modelo + 0.3, e.modelo + 0.65, e.modelo + 0.95, e.elige - 0.1];
  const hopOrder = [0, 3, 2, 1];
  let picked = -1;
  hopTimes.forEach((at, i) => {
    if (t >= at) picked = hopOrder[i];
  });
  const locked = t >= e.elige;
  return (
    <At x={MENU.x} y={MENU.y} w={540} h={960}>
      {t < e.start ? (
        <>
          <Sticker x={36} y={118} w={214} h={88} color={VIOLET} className="flex items-center justify-center gap-3" rotate={-1}>
            <span className="flex h-[58px] w-[58px] items-center justify-center rounded-[10px]" style={{ background: "#FFFFFF" }}>
              <Logo slug="github" size={42} ancla={false} />
            </span>
            <p data-ui="" className="font-mono text-[22px] font-bold leading-none text-white">
              server
            </p>
          </Sticker>
          <AppSticker x={412} y={122} name="Tu app" />
          <Appear at={m.tools} x={196} y={214} from={0} origin="100% 50%" until={m.menu}>
            <Dymo x={0} y={0} text="tools/list" size={22} color={INK} />
          </Appear>
        </>
      ) : null}
      <Appear at={m.start + 0.2} x={46} y={300} w={448} from={16} rotate={-2} until={m.cada - 0.05} sound="blip">
        <p className="font-display text-[92px] font-black leading-[0.94] tracking-tight" style={{ color: INK }}>
          Lo importante
        </p>
      </Appear>
      <Appear at={m.cada} x={46} y={300} w={448} from={16} rotate={-2} until={m.menu - 0.1}>
        <p className="font-display text-[92px] font-black leading-[0.94] tracking-tight" style={{ color: VIOLET }}>
          Se describe solo
        </p>
      </Appear>
      {/* The label maker prints the menu. */}
      {TOOLS.map((tool, i) => {
        const at = m.menu + i * 0.22;
        if (t < at) return null;
        const y = 226 + i * 66;
        const isPick = locked && i === 1;
        return (
          <Fragment key={tool}>
            <Sfx id="click" at={at} volume={0.2} />
            <Sfx id="click" at={at + 0.12} volume={0.14} />
            <Dymo x={36} y={y} text={tool} size={35} color={isPick ? VIOLET : INK} printed={fade(t, at, 0.3)} rotate={i % 2 ? 0.6 : -0.6} ring={!locked && picked === i ? 1 : 0} />
          </Fragment>
        );
      })}
      {hopTimes.map((at) => (
        <Sfx key={at} id="blip" at={at} volume={0.2} />
      ))}
      {/* A real tool definition (pkg/github/__toolsnaps__/search_code.snap). */}
      {cardOn || cardOut < 1 ? (
        t >= m.nombre ? (
          <At x={36} y={222} w={468} style={{ opacity: 1 - cardOut, transform: `translateY(${cardOut * 30}px) scale(${1 - cardOut * 0.05})` }}>
            {t >= m.mismo ? (
              <>
                <Sticker x={18} y={352} w={208} h={92} rotate={-3} color="#FFFFFF" className="flex items-end justify-center pb-2">
                  <Logo slug="slack" size={36} ancla={false} />
                </Sticker>
                <Sticker x={240} y={352} w={208} h={92} rotate={3} color="#FFFFFF" className="flex items-end justify-center pb-2">
                  <Logo slug="notion" size={36} ancla={false} />
                </Sticker>
              </>
            ) : null}
            <div data-ui="" className="relative rounded-[12px] border-[3px] px-3 py-3 font-mono text-[26px] font-bold leading-[35px]" style={{ background: CREAM, borderColor: INK, color: INK }}>
              {[
                { on: m.nombre, key: '"name"', value: '"search_code"' },
                { on: m.descripcion, key: '"description"', value: '"Fast and precise code search across ALL GitHub repositories…"' },
                { on: m.parametros, key: '"inputSchema"', value: '{ "query": string, … }' },
              ].map((row) => (
                <div key={row.key} className="mb-2 rounded-[6px] px-2 py-1" style={{ background: t >= row.on ? YELLOW : "transparent" }}>
                  <p style={{ color: VIOLET }}>{row.key}</p>
                  <p>{row.value}</p>
                </div>
              ))}
            </div>
          </At>
        ) : null
      ) : null}
      <Appear at={m.formato} x={60} y={680} from={10} rotate={-2} until={m.nadie - 0.05}>
        <p className="font-display text-[54px] font-black leading-none tracking-tight" style={{ color: VIOLET }}>
          Mismo formato
        </p>
      </Appear>
      {t >= m.nadie ? <Model x={40} y={540} s={1.18 * popAt(t, m.nadie)} lx={t >= e.pero ? 1 : picked >= 0 ? 0.6 : 0.5 + looking * 0.5} ly={t >= e.pero ? 0.2 : picked >= 0 ? -1 + picked * 0.25 : -0.8} /> : null}
      {t >= m.descubrimiento - 0.1 && t < e.start ? (
        <Stamp at={m.descubrimiento} x={380} y={640} color={VIOLET} rotate={-5} size={27} fill={YELLOW}>
          Descubrimiento
          <br />
          de herramientas
        </Stamp>
      ) : null}
      {/* The question, and the model that doesn't call anything. */}
      {t >= e.start ? (
        <Appear at={e.start} x={36} y={116} w={468} from={-20}>
          <div className="rounded-[16px] rounded-bl-[4px] border-[3px] px-4 py-3" style={{ background: "#FFFFFF", borderColor: INK }}>
            <p data-ui="" className="font-text text-[29px] font-semibold leading-[1.12]" style={{ color: INK }}>
              ¿Qué bugs siguen abiertos?
            </p>
            <p data-ui="" className="mt-1 font-mono text-[16px] font-bold" style={{ color: MUTED }}>
              Ejemplo ilustrativo
            </p>
          </div>
        </Appear>
      ) : null}
      {t >= e.pero ? (
        <>
          <svg className="absolute left-0 top-0 overflow-visible" width={540} height={960} aria-hidden>
            <Cable d="M 214 600 C 280 590, 340 610, 404 640" on={fade(t, e.pero, 0.35)} color={RED} width={7} />
          </svg>
          <ServiceChip x={450} y={650} slug="github" size={86} on={popAt(t, e.pero)} />
          <Stamp at={e.llama} x={316} y={534} color={RED} rotate={-6} size={48} fill={YELLOW}>
            No llama
          </Stamp>
        </>
      ) : null}
    </At>
  );
}

/* ---------- Costo: the bill ---------- */

const BILL = [
  { name: "GitHub", tools: "35", tokens: "~26K" },
  { name: "Slack", tools: "11", tokens: "~21K" },
  { name: "Sentry", tools: "5", tokens: "~3K" },
  { name: "Grafana", tools: "5", tokens: "~3K" },
  { name: "Splunk", tools: "2", tokens: "~2K" },
];

/** Height of the printed bill, where each line ends, and where the scissors cut it: under the GitHub row. */
const BILL_H = 356;
const BILL_STOPS = [54, 94, 134, 174, 214, 254, 310, BILL_H];
const BILL_SUMS = [26, 47, 50, 53, 55];
const CUT_Y = 100;

function BillBody() {
  return (
    <div data-ui="" className="absolute inset-x-0 top-0 rounded-b-[6px] border-[3px] px-4 py-3 font-mono text-[23px] font-bold" style={{ height: BILL_H, background: "#FFFFFF", borderColor: INK, color: INK }}>
      <p className="border-b-[3px] border-dashed pb-2 text-[20px]" style={{ borderColor: INK }}>
        herramientas · tokens
      </p>
      {BILL.map((row) => (
        <div key={row.name} className="mt-[8px] flex justify-between leading-[32px]">
          <span>{row.name}</span>
          <span>
            {row.tools} · {row.tokens}
          </span>
        </div>
      ))}
      <div className="mt-2 flex justify-between border-t-[3px] border-dashed pt-2 leading-[34px]" style={{ borderColor: INK, color: RED }}>
        <span>TOTAL</span>
        <span>58 · ~55K</span>
      </div>
      <p className="mt-2 text-[18px] font-bold" style={{ color: MUTED }}>
        Anthropic, nov. 2025
      </p>
    </div>
  );
}

/** Real names from the README of github-mcp-server, piling up next to the model. */
const PILE = ["get_file_contents", "create_pull_request", "list_commits", "get_job_logs", "create_branch", "fork_repository", "list_releases"];

function ToolPile({ at, lands, until }: { at: number; lands: number; until: number }) {
  const t = useT();
  if (t < at || t > until + 0.5) return null;
  const gone = Math.max(0, t - until);
  return (
    <div className="absolute inset-0" style={{ opacity: 1 - fade(t, until, 0.4) }}>
      {PILE.map((name, i) => {
        const start = at + (i * (lands - at)) / PILE.length;
        if (t < start) return null;
        const p = Math.min(1, (t - start) / 0.3);
        const y = 112 + p * p * (748 - i * 33 - 112) + 1100 * gone * gone;
        return (
          <Fragment key={name}>
            <Sfx id="click" at={start + 0.3} volume={0.12} />
            <Dymo x={226 + (i % 3) * 5} y={y} text={name} size={20} rotate={i % 2 ? 1.5 : -1.5} />
          </Fragment>
        );
      })}
    </div>
  );
}

function CostPart({ c }: { c: Cues }) {
  const t = useT();
  const k = c.costo;
  if (t < k.start - 0.95 || t > c.regla.start + 1) return null;
  // One line of the bill at a time, with the voice: the header, the five servers, the total, the source.
  const lineTimes = [k.anthropic - 0.1, ...BILL_SUMS.map((_, i) => k.cinco + i * 0.46), k.tokens, k.tokens + 0.35];
  const lines = lineTimes.filter((at) => t >= at).length;
  const reveal = lines === 0 ? 0 : BILL_STOPS[lines - 1];
  const rows = lineTimes.slice(1, 6).filter((at) => t >= at).length;
  const cutDt = t - k.cargar;
  const fall = cutDt > 0 ? cutDt : 0;
  const snip = keys(t, [
    [k.cargar - 0.4, 330],
    [k.cargar, 16],
  ]);
  return (
    <At x={COST.x} y={COST.y} w={540} h={960}>
      <ToolPile at={k.pasando} lands={k.peor} until={k.github} />
      {lineTimes.map((at) => (
        <Sfx key={at} id="click" at={at} volume={0.18} />
      ))}
      <Sfx id="caja-registradora" at={k.tokens} volume={0.3} />
      <Appear at={k.start} x={46} y={280} w={440} from={24} rotate={-2} until={k.gratis - 0.05} sound="blip">
        <p className="font-display text-[92px] font-black leading-[0.94] tracking-tight" style={{ color: INK }}>
          La letra <span style={{ color: RED }}>chica</span>
        </p>
      </Appear>
      <Stamp at={k.gratis} x={270} y={350} color={RED} rotate={4} size={62} until={k.anthropic - 0.15}>
        No es gratis
      </Stamp>
      {/* The bill unrolls line by line. */}
      <At x={36} y={106} w={310} h={BILL_H}>
        <div className="absolute inset-x-0 top-0" style={{ height: BILL_H, clipPath: cutDt > 0 ? `inset(0 -10px ${BILL_H - CUT_Y}px -10px)` : `inset(0 -10px ${BILL_H - reveal}px -10px)` }}>
          <BillBody />
        </div>
        {cutDt > 0 ? (
          <div className="absolute inset-x-0 top-0" style={{ height: BILL_H, clipPath: `inset(${CUT_Y}px -10px -10px -10px)`, transform: `translateY(${1500 * fall * fall}px) rotate(${Math.min(16, fall * 30)}deg)`, transformOrigin: "20% 30%" }}>
            <BillBody />
          </div>
        ) : null}
      </At>
      {/* The sum climbs with each row, until the total hits. */}
      {rows > 0 && t < k.tokens ? (
        <p className="absolute inset-x-[36px] top-[474px] text-center font-display text-[110px] font-black leading-none" style={{ color: RED, transform: `scale(${1 + 0.14 * Math.exp(-(t - lineTimes[rows]) * 9)})` }}>
          ~{BILL_SUMS[rows - 1]}K
        </p>
      ) : null}
      <Stamp at={k.tokens} x={270} y={530} color={RED} rotate={-5} size={62} fill={YELLOW} until={k.pasando}>
        ~55K tokens
      </Stamp>
      {/* "Before writing anything": an empty box and its cursor. */}
      <Appear at={k.antes} x={232} y={622} w={272} from={16} until={k.pasando}>
        <div data-ui="" className="flex h-[70px] items-center whitespace-nowrap rounded-[16px] border-[3px] px-3 font-text text-[23px] font-semibold" style={{ background: "#FFFFFF", borderColor: INK, color: MUTED }}>
          <span className="mr-2 inline-block h-[36px] w-[4px]" style={{ background: INK, opacity: Math.floor(t * 3) % 2 ? 0 : 1 }} />
          Escribe un mensaje
        </div>
      </Appear>
      {t >= k.anthropic ? <Model x={346} y={120} s={0.88 * popAt(t, k.anthropic)} dizzy={fade(t, k.peor - 0.5, 0.4) * (1 - fade(t, k.github, 0.3))} lx={-0.8} ly={t < k.tokens ? -0.9 + 1.5 * (lines / 8) : 0.5} /> : null}
      <Appear at={k.pasando + 0.15} x={40} y={478} w={460} from={10} rotate={-1} until={k.github - 0.05}>
        <p className="rounded-[10px] border-[3px] px-3 py-2 text-center font-display text-[38px] font-black leading-none" style={{ background: CREAM, borderColor: INK, color: INK }}>
          30 a 50 herramientas
        </p>
      </Appear>
      <Stamp at={k.peor} x={372} y={646} color={RED} rotate={-5} size={46} fill={YELLOW} until={k.github - 0.05}>
        Elige peor
      </Stamp>
      {t >= k.github ? (
        <Appear at={k.github} x={36} y={486} w={468} from={20} rotate={-1}>
          <div data-ui="" className="rounded-[12px] border-[3px] px-4 py-3 font-mono text-[23px] font-bold leading-[30px]" style={{ background: INK, borderColor: INK, color: CREAM }}>
            <p>github-mcp-server</p>
            <p style={{ color: "#C9B8FF" }}>--toolsets repos,issues</p>
          </div>
        </Appear>
      ) : null}
      {/* Only what you use is left on the menu. */}
      <Appear at={k.github + 0.3} x={240} y={634} from={10}>
        <Dymo x={0} y={0} text="repos" size={34} color={VIOLET} />
      </Appear>
      <Appear at={k.github + 0.5} x={240} y={696} from={10}>
        <Dymo x={0} y={0} text="issues" size={34} color={VIOLET} />
      </Appear>
      <Appear at={k.cargar + 0.15} x={46} y={290} w={448} from={18} rotate={-2}>
        <p className="font-display text-[84px] font-black leading-[0.94] tracking-tight" style={{ color: VIOLET }}>
          Solo lo que usas
        </p>
      </Appear>
      {/* The scissors run along the dashed line, and everything under it falls. */}
      {t >= k.github + 0.2 && cutDt < 0.1 ? <div className="absolute h-0 border-t-[4px] border-dashed" style={{ left: 36, top: 106 + CUT_Y, width: 310, borderColor: RED }} /> : null}
      {t >= k.cargar - 0.4 && cutDt < 0.45 ? (
        <div className="absolute flex h-[72px] w-[72px] items-center justify-center rounded-full border-[4px]" style={{ left: snip, top: 106 + CUT_Y - 36, background: "#FFFFFF", borderColor: INK, transform: `rotate(${180 + Math.sin(t * 26) * 14}deg)`, opacity: 1 - fade(t, k.cargar + 0.25, 0.2) }}>
          <Sfx id="switch" at={k.cargar - 0.3} volume={0.2} />
          <Sfx id="switch" at={k.cargar - 0.1} volume={0.2} />
          <Icono name="scissors" size={44} strokeWidth={2.4} ancla={false} className="text-ink" />
        </div>
      ) : null}
    </At>
  );
}

/* ---------- What stays on the screen, whatever the camera does ---------- */

/** GitHub's example, on its own torn sheet: five clients and ten systems, fifty lines. */
function FiftyCard({ c }: { c: Cues }) {
  const t = useT();
  const a = c.antes;
  const e = c.enchufe;
  const at = a.github - 0.05;
  if (t < at || t >= e.mismo) return null;
  const left = Array.from({ length: 5 }, (_, i) => 84 + i * 40);
  const right = Array.from({ length: 10 }, (_, i) => 58 + i * 22.2);
  const lines = fade(t, a.cincuenta - 0.3, 0.5);
  const out = fade(t, e.mismo - 0.25, 0.25);
  const pop = popAt(t, at);
  return (
    <div className="absolute" style={{ left: 36, top: 112, width: 468, height: 316, transform: `translateY(${(1 - Math.min(1, pop)) * 260 + out * 620}px) rotate(-1deg)` }}>
      <Torn x={0} y={0} w={468} h={316} color={CREAM} seed={11}>
        <p data-ui="" className="absolute left-[16px] top-[12px] font-mono text-[22px] font-bold" style={{ color: INK }}>
          Ejemplo de GitHub
        </p>
        <p data-ui="" className="absolute right-[16px] top-[15px] font-mono text-[16px] font-bold" style={{ color: MUTED }}>
          Blog, dic. 2025
        </p>
        <svg className="absolute left-0 top-0" width={468} height={316} aria-hidden>
          {lines > 0
            ? left.flatMap((ly, i) =>
                right.map((ry, j) => {
                  const on = Math.min(1, Math.max(0, lines * 50 - (i * 10 + j) * 0.5));
                  return on ? <line key={`${i}-${j}`} x1={44} y1={ly} x2={44 + (424 - 44) * on} y2={ly + (ry - ly) * on} stroke={RED} strokeWidth={2.4} /> : null;
                }),
              )
            : null}
          {left.map((y, i) => (t >= a.clientes - 0.2 + i * 0.05 ? <circle key={y} cx={44} cy={y} r={12} fill={INK} /> : null))}
          {right.map((y, i) => (t >= a.sistemas - 0.2 + i * 0.03 ? <circle key={y} cx={424} cy={y} r={9} fill={VIOLET} /> : null))}
        </svg>
        <p data-ui="" className="absolute bottom-[10px] left-[16px] font-mono text-[20px] font-bold" style={{ color: INK, opacity: fade(t, a.clientes - 0.2, 0.15) }}>
          5 clientes
        </p>
        <p data-ui="" className="absolute bottom-[10px] right-[16px] font-mono text-[20px] font-bold" style={{ color: VIOLET, opacity: fade(t, a.sistemas - 0.2, 0.15) }}>
          10 sistemas
        </p>
      </Torn>
    </div>
  );
}

/** The same five and ten, through one protocol: fifteen lines instead of fifty. */
function FifteenCard({ c }: { c: Cues }) {
  const t = useT();
  const e = c.enchufe;
  const at = e.bajas - 0.75;
  if (t < at || t >= e.autenticacion + 0.2) return null;
  const left = Array.from({ length: 5 }, (_, i) => 84 + i * 40);
  const right = Array.from({ length: 10 }, (_, i) => 58 + i * 22.2);
  const lines = fade(t, at + 0.2, 0.7);
  const pop = popAt(t, at);
  const out = fade(t, e.autenticacion - 0.05, 0.25);
  return (
    <div className="absolute" style={{ left: 36, top: 112, width: 468, height: 316, transform: `translateY(${(1 - Math.min(1, pop)) * 260 + out * 620}px) rotate(1deg)` }}>
      <Torn x={0} y={0} w={468} h={316} color={CREAM} seed={17}>
        <p data-ui="" className="absolute left-[16px] top-[12px] font-mono text-[22px] font-bold" style={{ color: INK }}>
          Con un protocolo común
        </p>
        <p data-ui="" className="absolute right-[16px] top-[15px] font-mono text-[16px] font-bold" style={{ color: MUTED }}>
          cuenta propia
        </p>
        <svg className="absolute left-0 top-0" width={468} height={316} aria-hidden>
          {left.map((y, i) => {
            const on = Math.min(1, Math.max(0, lines * 3 - i * 0.3));
            return on ? <line key={y} x1={44} y1={y} x2={44 + (220 - 44) * on} y2={y + (160 - y) * on} stroke={VIOLET} strokeWidth={4} /> : null;
          })}
          {right.map((y, i) => {
            const on = Math.min(1, Math.max(0, lines * 3 - 1.2 - i * 0.12));
            return on ? <line key={y} x1={248} y1={160} x2={248 + (424 - 248) * on} y2={160 + (y - 160) * on} stroke={VIOLET} strokeWidth={4} /> : null;
          })}
          <rect x={218} y={58} width={32} height={210} rx={8} fill={VIOLET} stroke={INK} strokeWidth={3} />
          {left.map((y) => (
            <circle key={y} cx={44} cy={y} r={12} fill={INK} />
          ))}
          {right.map((y) => (
            <circle key={y} cx={424} cy={y} r={9} fill={VIOLET} />
          ))}
        </svg>
        <p data-ui="" className="absolute bottom-[10px] left-[16px] font-mono text-[20px] font-bold" style={{ color: INK }}>
          5 clientes
        </p>
        <p data-ui="" className="absolute bottom-[10px] left-[212px] font-mono text-[20px] font-bold" style={{ color: VIOLET }}>
          MCP
        </p>
        <p data-ui="" className="absolute bottom-[10px] right-[16px] font-mono text-[20px] font-bold" style={{ color: VIOLET }}>
          10 sistemas
        </p>
      </Torn>
    </div>
  );
}

function Rule({ c }: { c: Cues }) {
  const t = useT();
  const r = c.regla;
  if (t < r.start || t >= c.cierre.start) return null;
  const left = keys(t, [
    [r.codigo - 0.2, -280],
    [r.codigo + 0.15, 0],
  ]);
  const right = keys(t, [
    [r.elige - 0.2, 280],
    [r.elige + 0.15, 0],
  ]);
  return (
    <>
      <div className="absolute inset-0" style={{ background: YELLOW, opacity: fade(t, r.start, 0.2) }} />
      <Stamp at={r.start} x={270} y={440} color={INK} rotate={-3} size={62} until={r.codigo - 0.1}>
        ¿Cuál usas?
      </Stamp>
      <Sfx id="whip" at={r.codigo - 0.2} volume={0.24} />
      <Sfx id="whip" at={r.elige - 0.2} volume={0.24} />
      <At x={0} y={104} w={270} h={690} style={{ background: INK, transform: `translateX(${left}px)` }}>
        <div className="absolute inset-x-0 top-[50px] flex justify-center">
          <Icono name="code-xml" size={96} strokeWidth={2.2} ancla={false} className="text-white" />
        </div>
        <p className="absolute inset-x-0 top-[194px] text-center font-display text-[38px] font-black leading-[1.02]" style={{ color: CREAM }}>
          Tu código
          <br />
          decide
        </p>
        <p className="absolute inset-x-0 top-[290px] text-center font-display text-[112px] font-black leading-none" style={{ color: COPPER, transform: `scale(${popAt(t, r.api)})` }}>
          API
        </p>
        <Sfx id="golpe" at={r.api} volume={0.3} />
      </At>
      <At x={270} y={104} w={270} h={690} style={{ background: VIOLET, transform: `translateX(${right}px)` }}>
        <div className="absolute left-[50px] top-[24px]">
          <Model x={0} y={0} lx={Math.sin(t * 3)} />
        </div>
        <p className="absolute inset-x-0 top-[194px] text-center font-display text-[38px] font-black leading-[1.02] text-white">
          El modelo
          <br />
          elige
        </p>
        <p className="absolute inset-x-0 top-[290px] text-center font-display text-[112px] font-black leading-none text-white" style={{ transform: `scale(${popAt(t, r.mcp)})` }}>
          MCP
        </p>
        <Sfx id="golpe" at={r.mcp} volume={0.3} />
        {/* Several apps sharing the same tools. */}
        <div className="absolute inset-x-0 top-[420px] flex justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className="flex h-[64px] w-[64px] items-center justify-center rounded-[12px] border-[3px]" style={{ background: CREAM, borderColor: INK, transform: `scale(${popAt(t, r.varias + i * 0.14)})` }}>
              <Icono name="sparkles" size={34} strokeWidth={2.4} ancla={false} className="text-ink" />
            </span>
          ))}
        </div>
      </At>
    </>
  );
}

function FinalStack({ c }: { c: Cues }) {
  const t = useT();
  const f = c.cierre;
  if (t < f.start) return null;
  // The stack fills the frame, and makes room when the stamp hits.
  const mix = keys(t, [
    [f.cero - 0.25, 0],
    [f.cero + 0.1, 1],
  ]);
  const lerp = (a: number, b: number) => a + (b - a) * mix;
  const h = [lerp(100, 84), lerp(170, 112), lerp(170, 112), lerp(100, 80)];
  const gap = lerp(10, 8);
  const y = [116, 116 + h[0] + gap, 116 + h[0] + h[1] + 2 * gap, 116 + h[0] + h[1] + h[2] + 3 * gap];
  const pop = (at: number) => (t < at ? 0 : Math.min(1, back(Math.min(1, (t - at) / 0.3))));
  const rows = [
    { at: f.start - 0.1, bg: "#FFFFFF", w: 468 },
    { at: f.mcp, bg: VIOLET, w: 468 },
    { at: f.start, bg: INK, w: 468 },
    { at: f.start - 0.1, bg: CREAM, w: lerp(268, 468) },
  ];
  const big = lerp(110, 80);
  const side = lerp(36, 30);
  return (
    <>
      <div className="absolute inset-0" style={{ background: YELLOW }} />
      <Sfx id="page-turn" at={f.start} volume={0.26} />
      <Sfx id="pop" at={f.mcp} volume={0.26} />
      <Sfx id="whip" at={f.mandaselo} volume={0.26} />
      {rows.map((row, i) => (
        <div key={i} className="absolute rounded-[12px] border-[3px]" style={{ left: i === 3 ? lerp(236, 36) : 36, top: y[i], width: row.w, height: h[i], background: row.bg, borderColor: INK, transform: `scaleX(${pop(row.at)})`, transformOrigin: "0 50%" }} />
      ))}
      <div className="absolute left-[36px] flex w-[468px] items-center justify-center gap-5" style={{ top: y[0], height: h[0] }}>
        <p data-ui="" className="font-display font-black" style={{ color: INK, fontSize: lerp(32, 30) }}>
          Tus apps de IA
        </p>
        {["claude", "openai", "cursor"].map((s) => (
          <Logo key={s} slug={s} size={lerp(46, 40)} ancla={false} />
        ))}
      </div>
      <div className="absolute left-[36px] flex w-[468px] items-center justify-between px-5" style={{ top: y[1], height: h[1], opacity: fade(t, f.mcp + 0.18, 0.12) }}>
        <p className="font-display font-black leading-none text-white" style={{ fontSize: big }}>
          MCP
        </p>
        <p className="w-[250px] text-right font-display font-black leading-[1.02] text-white" style={{ fontSize: side }}>
          se lo presenta a la IA
        </p>
      </div>
      <div className="absolute left-[36px] flex w-[468px] items-center justify-between px-5" style={{ top: y[2], height: h[2], opacity: fade(t, f.start + 0.18, 0.12) }}>
        <p className="font-display font-black leading-none" style={{ color: COPPER, fontSize: big }}>
          API
        </p>
        <p className="w-[250px] text-right font-display font-black leading-[1.02]" style={{ color: CREAM, fontSize: side }}>
          hace el trabajo
        </p>
      </div>
      <div className="absolute flex items-center justify-around px-3" style={{ left: lerp(236, 36), top: y[3], height: h[3], width: rows[3].w }}>
        {SERVICES.map((s) => (
          <Logo key={s} slug={s} size={lerp(38, 46)} ancla={false} />
        ))}
      </div>
      <Stamp at={f.cero} x={270} y={562} color={RED} rotate={-3} size={38}>
        APIs reemplazadas: 0
      </Stamp>
      {t >= f.mandaselo ? (
        <div className="absolute flex items-center gap-3" style={{ left: 232, top: 626, transform: `scale(${Math.min(1.03, back(Math.min(1, (t - f.mandaselo) / 0.3)))})`, transformOrigin: "0 50%" }}>
          <span className="flex h-[88px] w-[88px] items-center justify-center rounded-full border-[4px]" style={{ background: VIOLET, borderColor: INK, transform: `rotate(${Math.sin(t * 3) * 7}deg)` }}>
            <Icono name="send" size={46} strokeWidth={2.4} ancla={false} className="text-white" />
          </span>
          <p className="font-display text-[42px] font-black uppercase leading-[0.98] tracking-tight" style={{ color: INK }}>
            A tu
            <br />
            equipo
          </p>
        </div>
      ) : null}
    </>
  );
}

/** The question that opens the second half, and the rewind to the wall as it was. */
function WhyMcp({ c }: { c: Cues }) {
  const a = c.antes;
  return (
    <>
      <Appear at={a.start} x={44} y={126} w={420} from={30} rotate={-2} until={a.mira - 0.1} sound="blip">
        <p className="font-display text-[68px] font-black leading-[0.96] tracking-tight" style={{ color: INK }}>
          ¿Para qué existe <span style={{ color: VIOLET }}>MCP</span>?
        </p>
      </Appear>
      <Appear at={a.mira} x={36} y={126} from={-14} rotate={-3} until={a.cinco + 1.2} sound="whip">
        <div className="flex items-center gap-1 rounded-[10px] border-[3px] px-2 py-1" style={{ background: INK, borderColor: INK }}>
          <Icono name="rewind" size={26} strokeWidth={2.6} ancla={false} className="text-white" />
          <p className="font-display text-[26px] font-black leading-none text-white">Antes</p>
        </div>
      </Appear>
    </>
  );
}

/** Speed lines over the picture while it slides, along the way it goes. */
function PanLines({ c }: { c: Cues }) {
  const v = useSlide(c);
  const t = useT();
  const { sceneId } = useStage();
  const speed = Math.hypot(v.x, v.y);
  if (speed < 14) return null;
  const angle = (Math.atan2(v.y, v.x) * 180) / Math.PI;
  const alpha = Math.min(1, (speed - 14) / 40);
  const length = Math.min(340, speed * 5);
  const color = sceneId === "adentro" ? CREAM : INK;
  return (
    <svg className="absolute left-0 top-0" width={540} height={960} aria-hidden>
      {Array.from({ length: 9 }, (_, i) => {
        const x = (i * 197 + Math.round(t * 30) * 41) % 540;
        const y = 110 + ((i * 313 + Math.round(t * 30) * 67) % 700);
        return <line key={i} x1={x - length / 2} y1={y} x2={x + length / 2} y2={y} stroke={color} strokeOpacity={0.18 * alpha} strokeWidth={i % 3 ? 3 : 5} strokeLinecap="round" transform={`rotate(${angle} ${x} ${y})`} />;
      })}
    </svg>
  );
}

const TORN_TOP = tornPolygon(580, 118, 21, 8, 22);
const TORN_BOTTOM = tornPolygon(580, 190, 29, 8, 22);

/** Locked to the screen: coordinates are the frame's, whatever the camera does. */
function Screen({ c }: { c: Cues }) {
  const { camera } = useStage();
  const z = camera.zoom;
  return (
    <div className="absolute left-0 top-0" style={{ width: 540, height: 960, transformOrigin: "0 0", transform: `translate(${camera.x - VIEW.x / z}px, ${camera.y - VIEW.y / z}px) scale(${1 / z})` }}>
      <Appear at={c.gancho.nunca} x={44} y={256} from={-10} origin="0% 50%" rotate={-3} until={c.adentro.start}>
        <p className="rounded-[8px] px-3 py-1 font-display text-[40px] font-black leading-none text-white" style={{ background: VIOLET }}>
          Nunca las tocó
        </p>
      </Appear>
      <PanLines c={c} />
      <WhyMcp c={c} />
      <FiftyCard c={c} />
      <FifteenCard c={c} />
      <Rule c={c} />
      <FinalStack c={c} />
      {/* The picture ends in a torn edge: it never crosses the tab or the captions. */}
      <div className="absolute" style={{ left: -20, top: -14, width: 580, height: 118, background: YELLOW, clipPath: TORN_TOP }} />
      <div className="absolute" style={{ left: -20, top: 790, width: 580, height: 190, background: YELLOW, clipPath: TORN_BOTTOM }} />
    </div>
  );
}

/* ---------- The world ---------- */

function World() {
  const { camera } = useStage();
  const t = useT();
  const c = useCues();
  const rig = rigAt(t, rigKeys(c));
  const hits = [c.gancho.tapa + 0.1, c.adentro.siempre, c.antes.diez, c.antes.cincuenta, c.enchufe.mismo, c.enchufe.quince, c.menu.descubrimiento, c.elige.llama, c.costo.tokens, c.cierre.cero];
  const shake = shakeAt(t, hits);
  const transform = `translate(${camera.x + shake.x}px, ${camera.y + shake.y}px) scale(${rig.z}) translate(${-(camera.x + rig.dx)}px, ${-(camera.y + rig.dy)}px)`;
  // The motion blur of a pan: half a frame's travel along the way it goes, in the world's px.
  const slide = useSlide(c);
  const zoom = camera.zoom * rig.z;
  const [blurX, blurY] = [Math.min(9, Math.abs(slide.x) * 0.2) / zoom, Math.min(9, Math.abs(slide.y) * 0.2) / zoom];
  const blurred = blurX + blurY > 0.6;
  return (
    <div className="absolute inset-0 text-ink">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id="pan" x="0" y="0" width="100%" height="100%">
          <feGaussianBlur stdDeviation={`${blurX.toFixed(2)} ${blurY.toFixed(2)}`} />
        </filter>
      </svg>
      <div className="absolute inset-0" style={{ background: YELLOW, filter: blurred ? "url(#pan)" : undefined }}>
        {t < c.cierre.start + 0.5 ? (
          <div className="absolute left-0 top-0" style={{ width: W, height: H, transform, transformOrigin: "0 0" }}>
            <PlatePart c={c} />
            <InsidePart c={c} />
            <WallPart c={c} />
            <MenuPart c={c} />
            <CostPart c={c} />
          </div>
        ) : null}
      </div>
      <Screen c={c} />
    </div>
  );
}

export default defineVideo({
  captions: "pill",
  chapters: true,
  stage: { World, width: W, height: H, drift: 0.015 },
  // A replica lasts what its reference lasts (116 s): a faster voice instead of cutting content (docs/direccion-reels.md, 3).
  voice: { tempo: 1.25 },
  music: { file: "audio/cama.mp3" },
  // The avatar has a role where it appears: opens the plate, rebuilds everything, warns about the bill and asks for the send.
  avatar: { scenes: ["gancho", "antes", "costo", "cierre"] },
  meter: {
    kind: "counter",
    start: 0,
    steps: [
      { scene: "antes", word: "integraciones", value: 5 },
      { scene: "antes", word: "diez", value: 10 },
      { scene: "antes", word: "cincuenta", value: 50 },
      { scene: "enchufe", word: "quince", value: 15 },
    ],
  },
  scenes: [
    { id: "gancho", chapter: "La tapa", camera: SHOTS.gancho, Visual: HookTitle, hold: 0.5 },
    { id: "adentro", chapter: "Adentro", camera: SHOTS.adentro },
    { id: "antes", chapter: "Antes", camera: SHOTS.antes },
    { id: "enchufe", chapter: "Un enchufe", camera: SHOTS.enchufe },
    { id: "menu", chapter: "El menú", camera: SHOTS.menu },
    { id: "elige", chapter: "El pedido", camera: SHOTS.elige },
    { id: "costo", chapter: "Letra chica", camera: SHOTS.costo },
    { id: "regla", chapter: "Cuál usas", camera: SHOTS.regla },
    { id: "cierre", chapter: "Cierre", camera: SHOTS.cierre, hold: 1.2 },
  ],
});
