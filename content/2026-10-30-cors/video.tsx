import type { CSSProperties, ReactNode } from "react";
import { interpolate, spring } from "remotion";
import { Icono, Logo } from "@motor/ui";
import { defineVideo, Sfx, usePop, useStage, useStageCue } from "@motor/video";

// Una aduana (video.json → world): arriba tu página en el navegador, en el medio la caseta y su
// barrera, abajo el servidor. Cada respuesta vuelve en una caja y solo pasa con sello.
// La ficha del gancho vuelve llena en el cierre. Los puertos, las URL, /api/productos y correo.com
// son ilustrativos; lo que afirma la voz sale de facts.json.

const W = 1800;
const H = 3700;
const VIEW = { x: 270, y: 427 };
/** Each part of the world is drawn in screen coordinates for its rest shot at zoom 1. */
const HOOK = { x: 540, y: 0 };
const PORTS = { x: 540, y: 960 };
const LANE = { x: 540, y: 1920 };
const MAIL = { x: 1180, y: 1920 };
const center = (o: { x: number; y: number }) => ({ focus: { x: o.x + VIEW.x, y: o.y + VIEW.y }, zoom: 1 });
/** What each scene frames, kept here because the blur of a pan needs where the camera comes from. */
const SHOTS: Record<string, { focus: { x: number; y: number }; zoom: number }> = {
  gancho: center(HOOK),
  origen: center(PORTS),
  viaje: center(LANE),
  trampa: center(LANE),
  correo: center(MAIL),
  permiso: center(LANE),
  repregunta: { focus: { x: LANE.x + 270, y: LANE.y + 510 }, zoom: 0.82 },
  respuesta: { focus: { x: 1130, y: 2500 }, zoom: 0.45 },
};
/** The engine's camera takes this long to reach a scene's shot (MOVE_MS). */
const MOVE_S = 0.9;
const FRAME_S = 1 / 30;

const PAPER = "#E6ECDC";
const SURFACE = "#F6F8EF";
const INK = "#13211B";
const GREEN = "#0A6B4E";
const RED = "#C8321F";
const MUTED = "#59665B";
const LINE = "rgba(19,33,27,0.18)";
// Chrome DevTools, dark theme
const DEVTOOLS = { bg: "#202124", bar: "#292A2D", line: "#3C4043", text: "#E8EAED", dim: "#9AA0A6", errorBg: "#3B1F1E", error: "#F28B82", link: "#A8C7FA" };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (t: number, at: number, dur = 0.25) => interpolate(t, [at, at + dur], [0, 1], clamp);
const outCubic = (p: number) => 1 - Math.pow(1 - p, 3);
const inOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const inCubic = (p: number) => p * p * p;
const back = (p: number) => 1 + 2.4 * Math.pow(p - 1, 3) + 1.4 * Math.pow(p - 1, 2);

const useT = () => useStage().ms / 1000;

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

/** How fast the picture slides on the screen now, in px per frame: the scene's camera plus the rig. */
function useSlide() {
  const { camera, sceneId, sceneIndex, sceneMs, scenes } = useStage();
  const t = useT();
  const list = rigKeys(useCues());
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

function useCues() {
  const cue = useStageCue;
  return {
    gancho: { reves: cue("gancho", "revés"), permiso: cue("gancho", "permiso"), entrevista: cue("gancho", "entrevista"), tres: cue("gancho", "tres") },
    origen: {
      start: cue("origen", "tu"),
      tres: cue("origen", "tres"),
      api: cue("origen", "api"),
      ocho: cue("origen", "ocho"),
      dos: cue("origen", "dos"),
      protocolo: cue("origen", "protocolo"),
      host: cue("origen", "host"),
      puerto: cue("origen", "puerto"),
      cambia: cue("origen", "cambia"),
      uno: cue("origen", "uno"),
      otro: cue("origen", "otro"),
    },
    viaje: {
      start: cue("viaje", "tu"),
      sale: cue("viaje", "sale"),
      responde: cue("viaje", "responde"),
      ok: cue("viaje", "doscientos"),
      vuelve: cue("viaje", "vuelve"),
      queda: cue("viaje", "queda"),
      codigo: cue("viaje", "código"),
      leer: cue("viaje", "leer"),
      politica: cue("viaje", "política"),
    },
    trampa: {
      start: cue("trampa", "aquí"),
      trampa: cue("trampa", "trampa"),
      navegador: cue("trampa", "navegador"),
      servidor: cue("trampa", "servidor"),
      primera: cue("trampa", "primera"),
      postman: cue("trampa", "postman"),
      app: cue("trampa", "app"),
      pasa: cue("trampa", "pasa"),
    },
    correo: {
      start: cue("correo", "por"),
      protegerte: cue("correo", "protegerte"),
      cualquier: cue("correo", "cualquier"),
      existe: cue("correo", "existe"),
      no: cue("correo", "no"),
      leer: cue("correo", "leer"),
      correo: cue("correo", "correo"),
      sesion: cue("correo", "sesión"),
      abierta: cue("correo", "abierta"),
      segunda: cue("correo", "segunda"),
    },
    permiso: {
      start: cue("permiso", "cors"),
      barrera: cue("permiso", "barrera"),
      servidor: cue("permiso", "servidor"),
      cabecera: cue("permiso", "cabecera"),
      access: cue("permiso", "access-control-allow-origin"),
      nombra: cue("permiso", "nombra"),
      navegador: cue("permiso", "navegador"),
      sello: cue("permiso", "sello"),
      deja: cue("permiso", "deja"),
      pasar: cue("permiso", "pasar"),
      tercera: cue("permiso", "tercera"),
      servidor2: cue("permiso", "servidor", 2),
    },
    repregunta: {
      start: cue("repregunta", "ahora"),
      delete: cue("repregunta", "delete"),
      pregunta: cue("repregunta", "pregunta"),
      options: cue("repregunta", "options"),
      preflight: cue("repregunta", "preflight"),
      servidor: cue("repregunta", "servidor"),
      permiso: cue("repregunta", "permiso"),
      delete2: cue("repregunta", "delete", 2),
      ni: cue("repregunta", "ni"),
    },
    respuesta: {
      start: cue("respuesta", "respóndelo"),
      cors: cue("respuesta", "cors"),
      navegador: cue("respuesta", "navegador"),
      politica: cue("respuesta", "política"),
      usuario: cue("respuesta", "usuario"),
      servidor: cue("respuesta", "servidor"),
      relajarla: cue("respuesta", "relajarla"),
      mandaselo: cue("respuesta", "mándaselo"),
    },
  };
}
type Cues = ReturnType<typeof useCues>;

/* ---------- Building blocks ---------- */

function At({ x, y, w, h, style, className, children }: { x: number; y: number; w?: number; h?: number; style?: CSSProperties; className?: string; children?: ReactNode }) {
  return (
    <div className={`absolute ${className ?? ""}`} style={{ left: x, top: y, width: w, height: h, ...style }}>
      {children}
    </div>
  );
}

/** What the camera sees now, in world coordinates. Nothing outside it is drawn. */
function useView() {
  const { camera } = useStage();
  const c = useCues();
  const t = useT();
  const rig = rigAt(t, rigKeys(c));
  const z = camera.zoom * rig.z;
  const cx = camera.x + rig.dx;
  const cy = camera.y + rig.dy;
  return { left: cx - VIEW.x / z, right: cx + (540 - VIEW.x) / z, top: cy - VIEW.y / z, bottom: cy + (960 - VIEW.y) / z };
}

/** A box of a part of the world, drawn only while it is in view. */
function Part({ origin, x = 0, y = 0, w, h, children }: { origin: { x: number; y: number }; x?: number; y?: number; w: number; h: number; children: ReactNode }) {
  const view = useView();
  const [l, top] = [origin.x + x, origin.y + y];
  if (l > view.right || l + w < view.left || top > view.bottom || top + h < view.top) return null;
  return <>{children}</>;
}

/** Pops in with a spring at `at` and leaves at `until`. */
function Appear({ at, until, x, y, w, h, sound = "pop", origin = "50% 50%", from = 18, children }: { at: number; until?: number; x: number; y: number; w?: number; h?: number; sound?: string | null; origin?: string; from?: number; children: ReactNode }) {
  const t = useT();
  const p = usePop(at);
  const out = until === undefined ? 0 : fade(t, until, 0.2);
  if (t < at || out >= 1) return null;
  return (
    <At x={x} y={y} w={w} h={h} style={{ opacity: Math.min(1, p * 2) * (1 - out), transform: `translateY(${(1 - Math.min(1, p)) * from}px) scale(${0.72 + 0.28 * p})`, transformOrigin: origin }}>
      {sound ? <Sfx id={sound} at={at} volume={0.25} /> : null}
      {children}
    </At>
  );
}

/** A rubber stamp: falls fast, hits at `at`, and keeps the worn ink. */
function Stamp({ at, until, x, y, color, rotate = -8, size = 44, border = true, sound = true, fill, children }: { at: number; until?: number; x: number; y: number; color: string; rotate?: number; size?: number; border?: boolean; sound?: boolean; fill?: string; children: ReactNode }) {
  const t = useT();
  if (t < at - 0.1) return null;
  const out = until === undefined ? 0 : fade(t, until, 0.2);
  if (out >= 1) return null;
  const fall = interpolate(t, [at - 0.1, at], [2.6, 1], clamp);
  const press = t < at ? 1 : 1 + 0.05 * Math.exp(-(t - at) * 18);
  return (
    <div data-ui="" className="absolute" style={{ left: x, top: y, opacity: fade(t, at - 0.1, 0.06) * (1 - out), transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${fall * press})` }}>
      {sound ? <Sfx id="golpe" at={at} volume={0.34} /> : null}
      {fill ? <div className="absolute inset-[-5px] rounded-[13px]" style={{ background: fill }} /> : null}
      <div className="relative whitespace-nowrap rounded-[10px] px-4 py-1.5 text-center font-display font-black uppercase leading-[1.02] tracking-tight" style={{ color, fontSize: size, border: border ? `5px solid ${color}` : undefined, outline: border ? `2px solid ${color}` : undefined, outlineOffset: 3, filter: "url(#ink)" }}>
        {children}
      </div>
    </div>
  );
}

/** A wheel of one character: it spins and lands with a bounce. */
function Digit({ at, from, to, turns = 2, h }: { at: number; from: number; to: number; turns?: number; h: number }) {
  const t = useT();
  const steps = turns * 10 + ((to - from + 10) % 10);
  const p = t < at ? 0 : Math.min(1, (t - at) / 0.8);
  const pos = from + steps * back(p);
  const low = Math.floor(pos);
  return (
    <span className="relative inline-block overflow-hidden align-bottom" style={{ height: h, width: "0.6em" }}>
      {[low - 1, low, low + 1].map((n) => (
        <span key={n} className="absolute left-0 right-0 text-center" style={{ top: (n - pos) * h, height: h, lineHeight: `${h}px` }}>
          {((n % 10) + 10) % 10}
        </span>
      ))}
    </span>
  );
}

/** The conveyor between the page and the server: its rollers run with the box. */
function Belt({ x, y, h, width = 152 }: { x: number; y: number; h: number; width?: number }) {
  const t = useT();
  return (
    <At x={x - width / 2} y={y} w={width} h={h} className="overflow-hidden rounded-[6px]" style={{ background: INK }}>
      <div className="absolute inset-y-0 left-[10px] right-[10px]" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(246,248,239,0.26) 0 3px, transparent 3px 26px)", backgroundPositionY: `${t * 60}px`, backgroundColor: "#22332B" }} />
      <div className="absolute inset-y-0 left-0 w-[6px]" style={{ background: "rgba(246,248,239,0.25)" }} />
      <div className="absolute inset-y-0 right-0 w-[6px]" style={{ background: "rgba(246,248,239,0.25)" }} />
    </At>
  );
}

/** A squash and stretch for what travels along y: long while it runs, flat when it lands. */
function squashStretch(speed: number, t: number, landings: number[]) {
  const stretch = Math.min(0.26, speed / 6000);
  let squash = 0;
  for (const at of landings) {
    const dt = t - at;
    if (dt >= 0 && dt < 0.5) squash += 0.26 * Math.exp(-dt * 8) * Math.cos(dt * 24);
  }
  return { sx: 1 - stretch * 0.6 + squash * 0.85, sy: 1 + stretch - squash };
}

/** Dust that blows out from a line when something heavy hits it: big puffs stay close, specks fly far. */
function Dust({ at, x, y, width, size = 1 }: { at: number; x: number; y: number; width: number; size?: number }) {
  const dt = useT() - at;
  if (dt < 0 || dt > 0.7) return null;
  const p = outCubic(dt / 0.7);
  return (
    <>
      {Array.from({ length: 20 }, (_, i) => {
        const a = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
        const b = Math.abs(Math.sin(i * 78.233) * 12543.1231) % 1;
        const speck = i % 3 === 0;
        const r = (speck ? 3 + 4 * b : 12 + 22 * b) * size;
        const reach = (speck ? 90 + 70 * b : 26 + 34 * b) * size;
        const angle = a * Math.PI * 2;
        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: x + width * ((i * 0.618) % 1) + Math.cos(angle) * reach * 1.5 * p - r,
              top: y + Math.sin(angle) * reach * p - r,
              width: r * 2,
              height: r * 2,
              background: speck ? "rgba(19,33,27,0.55)" : i % 2 ? "#C4CEB8" : "#D5DDCA",
              transform: `scale(${speck ? 1 - p * 0.6 : 0.3 + 0.9 * p})`,
              opacity: Math.pow(1 - p, 1.3),
            }}
          />
        );
      })}
    </>
  );
}

/** A parcel on the belt, placed by its center, with what it carries on its label. */
function Parcel({ x, y, s = 1, sx = 1, sy = 1, label, labelColor = INK, tilt = 0, sticker, children }: { x: number; y: number; s?: number; sx?: number; sy?: number; label: string; labelColor?: string; tilt?: number; sticker?: ReactNode; children?: ReactNode }) {
  return (
    <div className="absolute" style={{ left: x, top: y, transform: `translate(-50%, -50%) rotate(${tilt}deg) scale(${s * sx}, ${s * sy})` }}>
      <div data-ui="" className="relative flex h-[120px] w-[140px] flex-col items-center justify-center rounded-[12px] border-[3px] bg-[#F6F8EF] shadow-[0_10px_0_rgba(19,33,27,0.22)]" style={{ borderColor: INK }}>
        <div className="absolute inset-x-0 top-[14px] h-[10px]" style={{ background: "rgba(19,33,27,0.14)" }} />
        <span className="mt-3 whitespace-nowrap font-mono text-[27px] font-bold" style={{ color: labelColor }}>
          {label}
        </span>
        {sticker}
        {children}
      </div>
    </div>
  );
}

/** A red and white barrier across the belt: up at open 1, down at open 0. */
function Barrier({ x, y, length = 214, open }: { x: number; y: number; length?: number; open: number }) {
  return (
    <div className="absolute" style={{ left: x, top: y - 8, width: length, height: 16, transformOrigin: "8px 8px", transform: `rotate(${-82 * open}deg)` }}>
      <div className="h-full w-full rounded-full" style={{ background: `repeating-linear-gradient(90deg, ${RED} 0 26px, #F6F8EF 26px 52px)`, border: `2px solid ${INK}` }} />
      <div className="absolute left-[-5px] top-[-5px] h-[26px] w-[26px] rounded-full border-[3px]" style={{ background: INK, borderColor: INK }} />
    </div>
  );
}

/** The customs booth, with the sign on its roof. */
function BoothHouse({ x, y, sign, signSize = 24, signColor = INK, glow = 0, opacity = 1, children }: { x: number; y: number; sign: string; signSize?: number; signColor?: string; glow?: number; opacity?: number; children?: ReactNode }) {
  return (
    <At x={x} y={y} w={150} h={150} style={{ opacity }}>
      <div className="absolute inset-x-[-10px] top-[14px] h-[18px] rounded-[4px]" style={{ background: INK }} />
      <div className="absolute inset-x-0 top-[30px] bottom-0 rounded-b-[8px] border-[3px]" style={{ background: SURFACE, borderColor: INK, boxShadow: glow ? `0 0 0 ${glow * 9}px rgba(200,50,31,${0.42 * glow})` : undefined }}>
        <div className="absolute inset-x-[14px] top-[14px] h-[56px] rounded-[6px] border-[3px]" style={{ background: "#CFE0D2", borderColor: INK }}>
          {children}
        </div>
      </div>
      <p data-ui="" className="absolute inset-x-[-40px] whitespace-nowrap text-center font-mono font-bold uppercase leading-none" style={{ color: signColor, fontSize: signSize, bottom: "calc(100% - 10px)" }}>
        {sign}
      </p>
    </At>
  );
}

function Rack({ x, y, w = 340, ok = 0, label }: { x: number; y: number; w?: number; ok?: number; label: string }) {
  const t = useT();
  return (
    <At x={x} y={y} w={w} h={188}>
      <div className="absolute inset-0 rounded-[12px] border-[3px] p-3" style={{ background: INK, borderColor: INK }}>
        {[0, 1, 2].map((row) => (
          <div key={row} className="mb-2 flex h-[34px] items-center gap-2 rounded-[6px] px-3" style={{ background: "#22332B" }}>
            {[0, 1, 2, 3].map((led) => (
              <span key={led} className="h-[9px] w-[9px] rounded-full" style={{ background: Math.sin(t * 5 + row * 2 + led * 1.7) > 0 ? "#7CF2B8" : "#2E4A3D" }} />
            ))}
            <span className="ml-auto h-[6px] w-[90px] rounded-full" style={{ background: "#2E4A3D" }} />
          </div>
        ))}
        <p data-ui="" className="mt-1 whitespace-nowrap font-mono text-[25px] font-bold leading-none" style={{ color: SURFACE }}>
          {label}
        </p>
      </div>
      {ok > 0 ? (
        <div className="absolute right-[-12px] top-[-18px] flex h-[52px] w-[52px] items-center justify-center rounded-full border-[3px]" style={{ background: GREEN, borderColor: INK, transform: `scale(${ok})` }}>
          <Icono name="check" size={32} strokeWidth={3.5} ancla={false} className="text-white" />
        </div>
      ) : null}
    </At>
  );
}

function BrowserCard({ x, y, w, h, url, children }: { x: number; y: number; w: number; h: number; url: string; children?: ReactNode }) {
  return (
    <At x={x} y={y} w={w} h={h} className="overflow-hidden rounded-[14px] border-[3px]" style={{ background: SURFACE, borderColor: INK, boxShadow: "0 12px 0 rgba(19,33,27,0.14)" }}>
      <div data-ui="" className="flex h-[44px] items-center gap-2 border-b-[3px] px-3" style={{ borderColor: INK }}>
        {["#E5484D", "#E0A62E", "#1F9D55"].map((c) => (
          <span key={c} className="h-[12px] w-[12px] rounded-full" style={{ background: c }} />
        ))}
        <span className="ml-2 flex-1 truncate rounded-full px-3 py-0.5 font-mono text-[16px] font-bold" style={{ background: PAPER, color: INK }}>
          {url}
        </span>
      </div>
      {children}
    </At>
  );
}

/** The answer form: empty in the hook, full in the close. */
function Form({ rows, called, stamp }: { rows: Array<{ label: string; value: string; on: number; detail?: string; detailOn?: number }>; called?: number; stamp?: ReactNode }) {
  const t = useT();
  return (
    <div data-ui="" className="relative h-full w-full overflow-hidden rounded-[18px] border-[3px] px-5 py-4" style={{ background: SURFACE, borderColor: INK, boxShadow: "0 14px 0 rgba(19,33,27,0.16)" }}>
      <div className="flex items-center justify-between border-b-[3px] pb-2" style={{ borderColor: INK }}>
        <p className="font-display text-[23px] font-black uppercase leading-none tracking-tight" style={{ color: INK }}>
          Ficha de respuesta
        </p>
        <Icono name="stamp" size={26} strokeWidth={2.4} ancla={false} className="text-ink" />
      </div>
      {rows.map((row, i) => (
        <div key={row.label} className="flex items-center gap-3 border-b-2 py-[8px]" style={{ borderColor: LINE }}>
          <span
            className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full font-mono text-[20px] font-bold"
            style={(() => {
              // Called out one by one when the voice says "tres partes", still empty.
              const at = called === undefined ? Infinity : called + i * 0.16;
              const lit = t >= at;
              const on = row.on > 0 || lit;
              return { background: on ? GREEN : "transparent", color: on ? "#FFFFFF" : MUTED, border: on ? undefined : `2px dashed ${MUTED}`, transform: lit ? `scale(${1 + 0.45 * Math.exp(-(t - at) * 7)})` : undefined };
            })()}
          >
            {i + 1}
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[17px] font-bold uppercase leading-none" style={{ color: MUTED }}>
              {row.label}
            </p>
            <p className="mt-1 h-[32px] whitespace-nowrap font-display text-[29px] font-extrabold leading-none" style={{ color: INK, opacity: row.on, transform: `translateX(${(1 - row.on) * -14}px)` }}>
              {row.value}
            </p>
            <p className="h-[22px] whitespace-nowrap font-mono text-[19px] font-bold leading-none" style={{ color: GREEN, opacity: row.detailOn ?? 0, transform: `translateX(${(1 - (row.detailOn ?? 0)) * -10}px)` }}>
              {row.detailOn ? row.detail : null}
            </p>
          </div>
        </div>
      ))}
      {stamp}
    </div>
  );
}

const FORM_ROWS = [
  { label: "Quién bloquea", value: "El navegador", detail: "política de mismo origen" },
  { label: "A quién protege", value: "Al usuario", detail: "no a tu API" },
  { label: "Quién da permiso", value: "El servidor", detail: "Access-Control-Allow-Origin" },
];

/* ---------- Hook: the error that flips into the form ---------- */

function DevToolsCard() {
  const t = useT();
  return (
    <div data-ui="" className="h-full w-full overflow-hidden rounded-[14px] font-sans" style={{ background: DEVTOOLS.bg, boxShadow: "0 16px 40px rgba(19,33,27,0.35)" }}>
      <div className="flex h-[40px] items-center gap-4 border-b px-3 text-[15px]" style={{ background: DEVTOOLS.bar, borderColor: DEVTOOLS.line, color: DEVTOOLS.dim }}>
        <span>Elements</span>
        <span className="flex h-full items-center border-b-2 font-medium" style={{ color: DEVTOOLS.text, borderColor: DEVTOOLS.link }}>
          Console
        </span>
        <span>Sources</span>
        <span>Network</span>
      </div>
      <div className="flex gap-3 border-b px-3 py-3 text-[21px] leading-[1.28]" style={{ background: DEVTOOLS.errorBg, borderColor: DEVTOOLS.line, color: DEVTOOLS.error }}>
        <span className="mt-[2px] flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full text-[14px] font-bold" style={{ background: "#E46962", color: DEVTOOLS.bg }}>
          ×
        </span>
        <p>
          Access to fetch at <span style={{ color: DEVTOOLS.link }}>'http://localhost:8080/api/productos'</span> from origin 'http://localhost:3000' has been{" "}
          <span className="rounded-[4px] px-1 font-bold" style={{ background: "#F28B82", color: "#2A0E0C" }}>
            blocked by CORS policy
          </span>
          : No 'Access-Control-Allow-Origin' header is present on the requested resource.
        </p>
      </div>
      <div className="flex gap-3 px-3 py-[9px] font-mono text-[15px]" style={{ color: DEVTOOLS.text }}>
        <span style={{ color: DEVTOOLS.link }}>&gt;</span>
        <span style={{ opacity: Math.floor(t * 2.5) % 2 ? 0.1 : 1 }}>▍</span>
      </div>
      <p className="px-3 font-mono text-[17px]" style={{ color: DEVTOOLS.dim }}>
        Ejemplo ilustrativo
      </p>
    </div>
  );
}

function HookPart({ c }: { c: Cues }) {
  const t = useT();
  const at = c.gancho.reves - 0.05;
  const raw = t < at ? 0 : Math.min(1, (t - at) / 0.7);
  const angle = 180 * back(raw);
  const front = angle < 90;
  const bob = Math.sin(t * 2.2) * 3;
  const fieldsOn = fade(t, c.gancho.tres, 0.2);
  return (
    <Part origin={HOOK} y={278} w={540} h={450}>
      <At x={HOOK.x} y={HOOK.y} w={540} h={960}>
        {t >= at ? <Sfx id="whip" at={at} volume={0.3} /> : null}
        <At x={36} y={278} w={468} h={358} style={{ transform: `translateY(${bob}px) perspective(1400px) rotateY(${angle}deg)`, transformOrigin: "50% 50%" }}>
          {front ? (
            <DevToolsCard />
          ) : (
            <div className="h-full w-full" style={{ transform: "rotateY(180deg)" }}>
              <Form
                rows={FORM_ROWS.map((r) => ({ ...r, value: "", on: 0 }))}
                called={c.gancho.tres}
                stamp={
                  <>
                    <Stamp at={c.gancho.permiso} x={268} y={196} color={GREEN} rotate={-11} size={62}>
                      Permiso
                    </Stamp>
                    <div className="pointer-events-none absolute inset-0 rounded-[18px]" style={{ boxShadow: `inset 0 0 0 ${fieldsOn * 4}px rgba(10,107,78,0.35)` }} />
                  </>
                }
              />
            </div>
          )}
        </At>
        {t >= c.gancho.entrevista ? (
          <Appear at={c.gancho.entrevista} x={36} y={660} sound="blip" origin="0% 50%">
            <p className="whitespace-nowrap rounded-[10px] px-3 py-2 font-display text-[28px] font-black uppercase leading-none tracking-tight text-white" style={{ background: INK }}>
              En la entrevista
            </p>
          </Appear>
        ) : null}
      </At>
    </Part>
  );
}

function HookTitle() {
  return (
    <h1 className="font-display text-[56px] font-black leading-[0.98] tracking-tight text-ink">
      CORS no te está <span style={{ color: RED }}>bloqueando</span>
    </h1>
  );
}

/* ---------- Origin: two passports, three wheels ---------- */

function Cell({ at, label, children, shown }: { at: number; label: string; children: ReactNode; shown: boolean }) {
  const t = useT();
  const on = t >= at;
  const lift = on ? outCubic(Math.min(1, (t - at) / 0.22)) : 0;
  return (
    <span className="relative inline-flex flex-col items-center">
      <span className="rounded-[8px] px-[3px]" style={{ transform: `translateY(${-5 * lift}px)`, background: on ? `rgba(10,107,78,${0.16 * lift})` : "transparent", boxShadow: on ? `0 0 0 ${2 * lift}px ${GREEN}` : undefined }}>
        {children}
      </span>
      {shown && on ? (
        <span className="absolute top-[56px] whitespace-nowrap rounded-[6px] px-2 py-[3px] font-mono text-[16px] font-bold uppercase leading-none text-white" style={{ background: GREEN, opacity: lift }}>
          {label}
        </span>
      ) : null}
    </span>
  );
}

function Passport({ who, ico, port, said, fold, c, main, y, enter, side }: { who: string; ico: string; port: ReactNode; said: number; fold?: number; c: Cues; main?: boolean; y: number; enter: number; side: 1 | -1 }) {
  const t = useT();
  // Flips like a page around `fold`, when it changes what it shows.
  const flip = fold === undefined ? 1 : Math.min(1, Math.abs(t - fold) / 0.12);
  const beat = t >= said ? Math.exp(-(t - said) * 4.5) : 0;
  const p = usePop(enter);
  if (t < enter) return null;
  const o = c.origen;
  return (
    <At x={36} y={y} w={468} h={200} style={{ transform: `translateX(${(1 - Math.min(1, p)) * 520 * side}px) rotate(${(1 - Math.min(1, p)) * 7 * side}deg) scaleY(${flip})` }}>
      <Sfx id="whip" at={enter} volume={0.26} />
      <div data-ui="" className="relative h-full w-full overflow-hidden rounded-[18px] border-[3px]" style={{ background: SURFACE, borderColor: INK, boxShadow: "0 12px 0 rgba(19,33,27,0.16)" }}>
        <div className="flex items-center gap-2 px-4 py-[9px]" style={{ background: INK, color: SURFACE }}>
          <Icono name={ico} size={22} strokeWidth={2.4} ancla={false} className="text-white" />
          <p className="font-display text-[21px] font-extrabold uppercase leading-none tracking-tight">{who}</p>
          <p className="ml-auto font-mono text-[14px] font-bold uppercase leading-none opacity-80">Origen</p>
        </div>
        <p className="flex h-[94px] items-center justify-center whitespace-nowrap px-1 pb-4 font-mono text-[36px] font-bold leading-none tracking-[-0.04em]" style={{ color: INK }}>
          <Cell at={main ? o.protocolo : 999} label="Protocolo" shown={!!main}>
            http://
          </Cell>
          <Cell at={main ? o.host : 999} label="Host" shown={!!main}>
            localhost
          </Cell>
          <Cell at={main ? o.puerto : 999} label="Puerto" shown={!!main}>
            <span className="inline-block rounded-[6px]" style={{ transform: `scale(${1 + 0.16 * beat})`, background: `rgba(244,211,74,${beat})` }}>
              {port}
            </span>
          </Cell>
        </p>
        <p className="absolute inset-x-4 bottom-2 overflow-hidden whitespace-nowrap font-mono text-[14px] leading-none tracking-[0.1em]" style={{ color: MUTED }}>
          P&lt;ORIGEN&lt;&lt;LOCALHOST&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
        </p>
      </div>
    </At>
  );
}

function OriginPart({ c }: { c: Cues }) {
  const o = c.origen;
  const t = useT();
  const before = t >= o.cambia;
  return (
    <Part origin={PORTS} y={120} w={540} h={570}>
      <At x={PORTS.x} y={PORTS.y} w={540} h={960}>
        <Passport who="Tu frontend" ico="monitor" y={148} enter={o.start + 0.05} said={o.tres} side={-1} c={c} main port={
          <span className="inline-flex items-center" style={{ height: 46, lineHeight: "46px" }}>
            :300
            <Digit at={o.uno} from={0} to={1} h={46} />
          </span>
        } />
        <Passport who={before ? "Antes" : "Tu API"} ico={before ? "history" : "server"} y={496} enter={o.api} said={before ? Infinity : o.ocho} fold={o.cambia} side={1} c={c} port={before ? ":3000" : ":8080"} />
        <Appear at={o.dos} until={o.cambia - 0.1} x={36} y={392} w={468} sound="blip">
          <p className="whitespace-nowrap text-center font-display text-[56px] font-black uppercase leading-none tracking-tight" style={{ color: RED }}>
            ≠ orígenes
          </p>
        </Appear>
        {t >= o.otro - 0.1 ? (
          <Stamp at={o.otro} x={270} y={396} color={RED} rotate={-6} size={50}>
            Otro origen
          </Stamp>
        ) : null}
      </At>
    </Part>
  );
}

/* ---------- The lane: page, booth, belt and server ---------- */

const BELT_X = 270;
const BARRIER_Y = 620;
const SERVER_Y = 1060;
const AT_BARRIER = 690;
const AT_SERVER = 985;
const AT_PAGE = 432;

function barrierOpen(t: number, c: Cues) {
  const drop = c.viaje.queda - 0.28;
  const lift = c.permiso.deja;
  const shut = c.repregunta.permiso;
  if (t < drop) return 1;
  if (t < lift) {
    const dt = t - drop;
    const named = t - c.permiso.barrera;
    const twitch = named > 0 ? 0.2 * Math.abs(Math.sin(named * 8)) * Math.exp(-named * 3) : 0;
    return dt < 0.14 ? 1 - inCubic(dt / 0.14) : Math.abs(Math.sin((dt - 0.14) * 16)) * 0.1 * Math.exp(-(dt - 0.14) * 7) + twitch;
  }
  if (t < shut) {
    const dt = t - lift;
    return Math.min(1.08, 1 + 0.08 * Math.sin(dt * 14) * Math.exp(-dt * 6)) * outCubic(Math.min(1, dt / 0.22));
  }
  const dt = t - shut;
  return dt < 0.14 ? 1 - inCubic(dt / 0.14) : Math.abs(Math.sin((dt - 0.14) * 16)) * 0.1 * Math.exp(-(dt - 0.14) * 7);
}

function ParcelTrip({ c }: { c: Cues }) {
  const t = useT();
  const v = c.viaje;
  const p = c.permiso;
  if (t < v.start || t > p.pasar + 0.45) return null;
  const route: Array<[number, number]> = [
    [v.start, AT_PAGE],
    [v.sale, AT_PAGE],
    [v.responde, AT_SERVER],
    [v.vuelve, AT_SERVER],
    [v.queda, AT_BARRIER],
    [p.servidor - 0.1, AT_BARRIER],
    [p.servidor + 0.35, AT_SERVER],
    [p.navegador - 0.55, AT_SERVER],
    [p.navegador - 0.05, AT_BARRIER],
    [p.deja + 0.1, AT_BARRIER],
    [p.pasar + 0.3, 320],
  ];
  const y = keys(t, route);
  const speed = Math.abs(y - keys(t - FRAME_S, route)) / FRAME_S;
  const shape = squashStretch(speed, t, [v.responde, v.queda, p.servidor + 0.35, p.navegador - 0.05]);
  const hit = t - v.queda;
  const bounce = hit > 0 && t < p.servidor ? Math.sin(hit * 22) * 16 * Math.exp(-hit * 7) : 0;
  const tilt = hit > 0 && t < p.servidor ? Math.sin(hit * 19) * 7 * Math.exp(-hit * 6) : 0;
  const answered = t >= v.ok;
  const flown = t > p.pasar + 0.18 ? 1 - fade(t, p.pasar + 0.18, 0.2) : 1;
  const seal = popAt(t, p.access);
  return (
    <At x={0} y={0}>
      {/* The trail of the parcel: where it was a moment ago. */}
      {speed > 260
        ? [3, 2, 1].map((i) => (
            <div key={i} className="absolute rounded-[10px]" style={{ left: BELT_X - 70, top: keys(t - i * 0.035, route) - 60, width: 140, height: 120, background: SURFACE, opacity: 0.17 * (4 - i) * Math.min(1, (speed - 260) / 500) }} />
          ))
        : null}
      <Parcel x={BELT_X} y={y + bounce} tilt={tilt} s={flown} sx={shape.sx} sy={shape.sy} label={answered ? "200 OK" : "fetch()"} labelColor={answered ? GREEN : INK}>
        {t >= p.access ? (
          <span className="absolute right-[-14px] top-[-14px] flex h-[40px] w-[40px] items-center justify-center rounded-full border-[3px]" style={{ background: GREEN, borderColor: INK, transform: `scale(${seal})` }}>
            <Icono name="stamp" size={22} strokeWidth={2.6} ancla={false} className="text-white" />
          </span>
        ) : null}
      </Parcel>
    </At>
  );
}

function Lane({ c }: { c: Cues }) {
  const t = useT();
  const open = barrierOpen(t, c);
  const v = c.viaje;
  const tr = c.trampa;
  const p = c.permiso;
  const r = c.repregunta;
  const boothGlow = fade(t, tr.navegador, 0.2) * (1 - fade(t, tr.postman, 0.3));
  const served = t >= p.pasar + 0.2;
  const serverOk = usePop(v.ok);
  // In the wide shot of the trap the camera is at 0.6: the signs grow so they can still be read.
  const farShot = fade(t, tr.postman - 0.1, 0.6) * (1 - fade(t, c.correo.start - 0.25, 0.5));
  // "El que bloquea es el navegador": the sign of the booth says it, big and in red.
  const signBig = fade(t, tr.navegador, 0.2) * (1 - fade(t, tr.servidor, 0.3));
  // The card of the Express line covers the booth: nothing of it peeks out around the card.
  const behindCode = 1 - fade(t, p.pasar + 0.35, 0.15) * (1 - fade(t, r.start, 0.25));
  return (
    <Part origin={LANE} x={-340} y={0} w={1000} h={1400}>
      <At x={LANE.x} y={LANE.y} w={540} h={1400}>
        <Belt x={BELT_X} y={360} h={SERVER_Y - 360 + 10} />
        {t < r.start + 0.3 || t >= c.respuesta.start ? <div className="absolute inset-0" style={{ opacity: t >= c.respuesta.start ? 1 : 1 - fade(t, r.start, 0.3) }}><BrowserCard x={50} y={120} w={440} h={250} url="localhost:3000">
          {served ? (
            <div className="grid grid-cols-3 gap-2 p-3">
              {["Café", "Té", "Pan"].map((name, i) => {
                const pop = Math.min(1, fade(t, p.pasar + 0.25 + i * 0.12, 0.2));
                return (
                  <div key={name} data-ui="" className="flex h-[132px] flex-col items-center justify-center rounded-[10px] border-[3px]" style={{ borderColor: INK, background: "#FFFFFF", transform: `scale(${0.7 + 0.3 * pop})`, opacity: pop }}>
                    <Icono name="package" size={40} strokeWidth={2.2} ancla={false} className="text-ink" />
                    <p className="mt-1 font-mono text-[18px] font-bold" style={{ color: INK }}>
                      {name}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div data-ui="" className="relative h-full px-4 py-4">
              <div style={{ opacity: 1 - farShot }}>
                <p className="font-mono text-[18px] font-bold leading-[1.3]" style={{ color: INK }}>
                  fetch(
                  <br />
                  <span style={{ color: GREEN }}>'http://localhost:8080/api/productos'</span>
                  <br />)
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="h-[34px] w-[34px] rounded-full border-[5px]" style={{ borderColor: LINE, borderTopColor: INK, transform: `rotate(${t * 300}deg)` }} />
                  <p className="font-mono text-[19px]" style={{ color: MUTED }}>
                    esperando…
                  </p>
                </div>
              </div>
              {farShot > 0 ? (
                <p className="absolute inset-x-0 top-[38px] text-center font-display text-[58px] font-black uppercase leading-none tracking-tight" style={{ color: INK, opacity: farShot }}>
                  Tu página
                </p>
              ) : null}
            </div>
          )}
        </BrowserCard></div> : null}
        <BoothHouse x={20} y={BARRIER_Y - 118} sign={t >= tr.navegador ? "Navegador" : "Aduana"} signSize={24 + 10 * signBig + 12 * farShot} signColor={signBig > 0.5 ? RED : INK} glow={boothGlow} opacity={behindCode}>
          {t >= tr.navegador ? (
            <div className="flex h-full items-center justify-center gap-[6px]">
              {["googlechrome", "firefoxbrowser", "safari"].map((slug, i) => (
                <Appear key={slug} at={tr.navegador + i * 0.09} x={i * 34 + 3} y={12} w={28} h={28} sound={i === 0 ? "blip" : null}>
                  <Logo slug={slug} size={26} ancla={false} />
                </Appear>
              ))}
            </div>
          ) : null}
        </BoothHouse>
        <Rack x={100} y={SERVER_Y} ok={Math.min(1, serverOk)} label="API · localhost:8080" />
        <ParcelTrip c={c} />
        <Barrier x={170} y={BARRIER_Y} open={open} />
        <Dust at={v.queda - 0.14} x={170} y={BARRIER_Y} width={214} />
        <Dust at={r.permiso + 0.14} x={170} y={BARRIER_Y} width={214} />
        {/* The hit of the barrier and the stamps. */}
        {t >= v.ok - 0.1 && t < v.vuelve + 0.6 ? (
          <Stamp at={v.ok} x={402} y={AT_SERVER - 40} color={GREEN} rotate={7} size={40} fill={SURFACE}>
            200 OK
          </Stamp>
        ) : null}
        <Sfx id="golpe" at={v.queda - 0.14} volume={0.34} />
        {t >= v.codigo && t < tr.start + 0.3 ? <Scanner c={c} /> : null}
        <PolicySign c={c} />
        {t >= p.cabecera - 0.1 && t < p.navegador ? <BigHeaderStamp at={p.cabecera} /> : null}
        {t >= p.nombra && t < p.navegador ? (
          <Appear at={p.nombra} x={44} y={AT_SERVER - 232} w={452} sound="blip">
            <p data-ui="" className="flex items-center justify-center gap-2 whitespace-nowrap rounded-full py-2 font-mono text-[23px] font-bold leading-none text-white" style={{ background: GREEN }}>
              <Icono name="check" size={26} strokeWidth={3.5} ancla={false} className="text-white" /> Puede leer: localhost:3000
            </p>
          </Appear>
        ) : null}
        {t >= r.start && t < c.respuesta.start ? <Preflight c={c} /> : null}
        {t >= tr.servidor && t < tr.primera + 1 ? (
          <Appear at={tr.servidor} x={36} y={SERVER_Y - 84} sound="blip">
            <p className="whitespace-nowrap rounded-[10px] px-4 py-2 font-display text-[38px] font-black uppercase leading-none tracking-tight text-white" style={{ background: GREEN }}>
              Él sí respondió
            </p>
          </Appear>
        ) : null}
        {t >= tr.servidor + 0.15 && t < tr.postman - 0.1 ? (
          <Stamp at={tr.servidor + 0.25} x={380} y={SERVER_Y - 110} color={GREEN} rotate={6} size={44} fill={SURFACE}>
            200 OK
          </Stamp>
        ) : null}
        <PostmanRoad c={c} />
      </At>
    </Part>
  );
}

function Scanner({ c }: { c: Cues }) {
  const t = useT();
  const v = c.viaje;
  const sweep = ((t - v.codigo) * 0.9) % 1;
  const cursor = keys(t, [
    [v.codigo, 0],
    [v.leer - 0.05, 1],
  ]);
  const recoil = t > v.leer ? Math.sin((t - v.leer) * 20) * 18 * Math.exp(-(t - v.leer) * 5) : 0;
  const pop = Math.min(1, usePop(v.leer));
  return (
    <>
      <At x={BELT_X - 88} y={AT_BARRIER - 76} w={176} h={162} className="rounded-[14px] border-[3px] border-dashed" style={{ borderColor: RED }}>
        <div className="absolute inset-x-[-3px] h-[5px]" style={{ top: `${sweep * 100}%`, background: RED, boxShadow: `0 0 14px ${RED}` }} />
      </At>
      <At x={366} y={AT_BARRIER - 74} w={140} h={150} className="rounded-[12px] border-[3px] p-3" style={{ background: INK, borderColor: INK }}>
        <div data-ui="" className="font-mono text-[15px] font-bold leading-[1.45]" style={{ color: "#7CF2B8", filter: "blur(2.6px)" }}>
          <p>{"[{"}</p>
          <p>&nbsp;"id": 1,</p>
          <p>&nbsp;"nombre":</p>
          <p>&nbsp;"Café"</p>
          <p>{"}]"}</p>
        </div>
        <span className="absolute inset-0 flex items-center justify-center">
          <Icono name="eye-off" size={54} strokeWidth={2.4} ancla={false} className="text-white" />
        </span>
      </At>
      <div className="absolute" style={{ left: 170 + cursor * 30 + recoil, top: 400 + cursor * 200 - recoil * 0.6 }}>
        <svg width="46" height="52" viewBox="0 0 24 28" aria-hidden>
          <path d="M3 2 L3 23 L9 17.5 L13 26 L17 24 L13 15.8 L21 15.5 Z" fill={SURFACE} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        </svg>
        {t >= v.leer ? (
          <span className="absolute left-[26px] top-[-14px] flex h-[34px] w-[34px] items-center justify-center rounded-full" style={{ background: RED, transform: `scale(${pop})` }}>
            <Icono name="x" size={22} strokeWidth={3.5} ancla={false} className="text-white" />
          </span>
        ) : null}
      </div>
      <Sfx id="switch" at={v.leer} volume={0.28} />
    </>
  );
}

/** "Política de mismo origen" drops on two chains over the booth. */
function PolicySign({ c }: { c: Cues }) {
  const t = useT();
  const at = c.viaje.politica;
  const end = c.trampa.start + 0.15;
  if (t < at || t > end + 0.3) return null;
  const dt = t - at;
  const drop = t > end ? 1 - fade(t, end, 0.25) : Math.min(1.04, outCubic(Math.min(1, dt / 0.26)));
  const swing = Math.sin(dt * 7) * 7 * Math.exp(-dt * 1.8);
  return (
    <div className="absolute" style={{ left: 42, top: 376, width: 456, transformOrigin: "50% -200px", transform: `translateY(${(drop - 1) * 300}px) rotate(${swing}deg)` }}>
      <Sfx id="golpe" at={at + 0.2} volume={0.26} />
      <div className="absolute left-[70px] top-[-20px] h-[20px] w-[5px]" style={{ background: INK }} />
      <div className="absolute right-[70px] top-[-20px] h-[20px] w-[5px]" style={{ background: INK }} />
      <div className="rounded-[14px] border-[4px] px-4 py-3 text-center" style={{ background: "#F4D34A", borderColor: INK, boxShadow: "0 10px 0 rgba(19,33,27,0.22)" }}>
        <p className="font-display text-[39px] font-black uppercase leading-[0.98] tracking-tight" style={{ color: INK }}>
          Política de mismo origen
        </p>
      </div>
    </div>
  );
}

function BigHeaderStamp({ at }: { at: number }) {
  return (
    <div className="absolute" style={{ left: 270, top: AT_SERVER - 40 }}>
      <Stamp at={at} x={0} y={-92} color={GREEN} rotate={-5} size={37} fill={SURFACE}>
        Access-Control-
        <br />
        Allow-Origin
      </Stamp>
    </div>
  );
}

/** Postman: its own road to the server, with no booth on the way. */
function PostmanRoad({ c }: { c: Cues }) {
  const t = useT();
  const tr = c.trampa;
  const on = fade(t, tr.postman, 0.3) * (1 - fade(t, c.correo.start, 0.4));
  if (on <= 0) return null;
  const go = keys(t, [
    [tr.app - 0.1, 0],
    [tr.pasa + 0.1, 1],
  ]);
  // A quadratic from the card to the side of the server.
  const P0 = { x: -140, y: 334 };
  const P1 = { x: -110, y: 880 };
  const P2 = { x: 84, y: 1130 };
  const q = (a: number, b: number, d: number, f: number) => (1 - f) * (1 - f) * a + 2 * (1 - f) * f * b + f * f * d;
  const vx = q(P0.x, P1.x, P2.x, go);
  const vy = q(P0.y, P1.y, P2.y, go);
  const done = t >= tr.pasa + 0.1;
  return (
    <At x={0} y={0} style={{ opacity: on }}>
      <svg className="absolute left-[-340px] top-0 overflow-visible" width={1} height={1} aria-hidden>
        <path d={`M ${P0.x + 340} ${P0.y} Q ${P1.x + 340} ${P1.y} ${P2.x + 340} ${P2.y}`} fill="none" stroke={INK} strokeWidth={46} strokeLinecap="round" />
        <path d={`M ${P0.x + 340} ${P0.y} Q ${P1.x + 340} ${P1.y} ${P2.x + 340} ${P2.y}`} fill="none" stroke={SURFACE} strokeWidth={4} strokeDasharray="22 22" strokeDashoffset={-t * 90} opacity={0.65} />
      </svg>
      <At x={-250} y={136} w={230} h={160} className="flex flex-col items-center justify-center rounded-[16px] border-[3px]" style={{ background: SURFACE, borderColor: INK }}>
        <Logo slug="postman" size={82} ancla={false} />
        <p data-ui="" className="mt-1 font-display text-[28px] font-extrabold leading-none" style={{ color: INK }}>
          Postman
        </p>
      </At>
      <Sfx id="auto-pasa" at={tr.app} volume={0.34} />
      <div className="absolute" style={{ left: vx, top: vy, transform: "translate(-50%,-50%)" }}>
        <div className="flex h-[66px] w-[66px] items-center justify-center rounded-[14px] border-[3px]" style={{ background: "#FFFFFF", borderColor: INK, boxShadow: go > 0 && go < 1 ? `0 -26px 0 -12px rgba(19,33,27,.25), 0 -48px 0 -20px rgba(19,33,27,.14)` : undefined }}>
          <Logo slug="postman" size={46} ancla={false} />
        </div>
      </div>
      {done ? (
        <Appear at={tr.pasa + 0.1} x={-88} y={392} w={240} sound="blip">
          <p className="whitespace-nowrap font-display text-[38px] font-black uppercase leading-[0.98] tracking-tight" style={{ color: GREEN }}>
            Sin aduana
          </p>
        </Appear>
      ) : null}
    </At>
  );
}

/** The follow-up: a scout goes first, and the heavy DELETE stays. */
function Preflight({ c }: { c: Cues }) {
  const t = useT();
  const r = c.repregunta;
  const drop = fade(t, r.delete - 0.05, 0.14);
  const scoutY = keys(t, [
    [r.options, AT_PAGE + 60],
    [r.preflight + 0.2, AT_SERVER],
    [r.servidor + 0.1, AT_SERVER],
    [r.permiso, BARRIER_Y + 60],
  ]);
  const lightsOff = t >= r.delete2;
  return (
    <>
      {t >= r.delete - 0.05 ? (
        <div className="absolute" style={{ left: BELT_X - 118, top: 340 - (1 - drop) * 60, width: 236, height: 178, opacity: drop * (t >= r.ni ? 0.42 : 1) }}>
          <Sfx id="golpe" at={r.delete} volume={0.28} />
          <div className="relative flex h-[140px] items-center justify-center rounded-[14px] border-[4px]" style={{ background: "#F6F8EF", borderColor: INK }}>
            <p data-ui="" className="font-mono text-[50px] font-bold leading-none" style={{ color: RED }}>
              DELETE
            </p>
          </div>
          <div className="mx-[10px] flex h-[36px] items-center justify-between rounded-b-[12px] px-4" style={{ background: INK }}>
            {[0, 1].map((i) => (
              <span key={i} className="h-[20px] w-[20px] rounded-full" style={{ background: lightsOff ? "#2E4A3D" : "#F4D34A", boxShadow: lightsOff ? undefined : "0 0 18px #F4D34A" }} />
            ))}
          </div>
        </div>
      ) : null}
      {t >= r.options ? (
        <div className="absolute" style={{ left: BELT_X, top: scoutY, transform: "translate(-50%,-50%)" }}>
          <Sfx id="whoosh" at={r.options} volume={0.2} />
          <div data-ui="" className="flex items-center gap-2 whitespace-nowrap rounded-full border-[3px] px-3 py-2 font-mono text-[22px] font-bold" style={{ background: "#FFFFFF", borderColor: INK, color: INK }}>
            <Icono name="send" size={22} strokeWidth={2.6} ancla={false} className="text-ink" /> OPTIONS
          </div>
          {t >= r.permiso - 0.4 ? (
            <span className="absolute left-[150px] top-[2px] flex h-[42px] w-[42px] items-center justify-center rounded-full" style={{ background: RED }}>
              <Icono name="x" size={28} strokeWidth={3.5} ancla={false} className="text-white" />
            </span>
          ) : null}
        </div>
      ) : null}
      {t >= r.ni - 0.1 ? (
        <Stamp at={r.ni} x={270} y={432} color={RED} rotate={-8} size={92} fill={SURFACE}>
          Ni sale
        </Stamp>
      ) : null}
    </>
  );
}

/* ---------- The mail: the same customs, with you in it ---------- */

/** "¿Por qué?", then "A ti" with an arrow to your credential, and "no a tu API" crossed out. */
function WhoFor({ c }: { c: Cues }) {
  const t = useT();
  const b = c.correo;
  const draw = outCubic(fade(t, b.protegerte + 0.1, 0.4));
  const strike = fade(t, b.no + 0.2, 0.25);
  if (t >= b.cualquier - 0.05) return null;
  return (
    <>
      {t >= b.existe && t < b.protegerte ? (
        <Appear at={b.existe} until={b.protegerte - 0.2} x={36} y={140} w={468} sound="blip" from={10}>
          <p className="text-center font-display text-[76px] font-black uppercase leading-none tracking-tight" style={{ color: INK }}>
            ¿Por qué?
          </p>
        </Appear>
      ) : null}
      {t >= b.protegerte ? (
        <>
          <Appear at={b.protegerte} x={44} y={108} sound="pop" origin="0% 50%">
            <p className="whitespace-nowrap font-display text-[116px] font-black uppercase leading-none tracking-tight" style={{ color: GREEN }}>
              A ti
            </p>
          </Appear>
          <svg className="absolute left-0 top-0 overflow-visible" width={1} height={1} aria-hidden>
            <path d="M 76 236 C 46 316, 46 420, 80 506" fill="none" stroke={GREEN} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
            {draw >= 1 ? <path d="M 56 490 L 82 510 L 92 478" fill="none" stroke={GREEN} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" /> : null}
          </svg>
        </>
      ) : null}
      {t >= b.no ? (
        <Appear at={b.no} x={120} y={230} sound="blip" origin="0% 50%">
          <div className="relative whitespace-nowrap">
            <p className="font-display text-[38px] font-black uppercase leading-none tracking-tight" style={{ color: MUTED }}>
              No a tu API
            </p>
            <div className="absolute left-[-6px] top-[16px] h-[7px] rounded-full" style={{ width: `calc(${strike * 100}% + 12px)`, background: RED }} />
          </div>
        </Appear>
      ) : null}
    </>
  );
}

function MailLane({ c }: { c: Cues }) {
  const t = useT();
  const b = c.correo;
  const hit = t - (b.abierta + 0.05);
  const bounce = hit > 0 ? Math.sin(hit * 22) * 14 * Math.exp(-hit * 7) : 0;
  const open = t < b.abierta - 0.1 ? 1 : Math.max(0, 1 - inCubic((t - (b.abierta - 0.1)) / 0.14));
  const shield = usePop(b.segunda - 0.1);
  const route: Array<[number, number]> = [
    [b.leer, 300],
    [b.correo + 0.15, 498],
    [b.sesion, 498],
    [b.abierta + 0.05, 466],
  ];
  const speed = Math.abs(keys(t, route) - keys(t - FRAME_S, route)) / FRAME_S;
  const shape = squashStretch(speed, t, [b.correo + 0.15, b.abierta + 0.05]);
  return (
    <Part origin={MAIL} x={20} y={100} w={500} h={620}>
      <At x={MAIL.x} y={MAIL.y} w={540} h={960}>
        <Belt x={330} y={262} h={290} width={110} />
        <WhoFor c={c} />
        <Appear at={b.cualquier - 0.05} x={98} y={108} w={406} h={164} from={-30}>
          <BrowserCard x={0} y={0} w={406} h={164} url="sitio-cualquiera.com">
            <p data-ui="" className="px-4 py-3 font-mono text-[20px] font-bold leading-[1.3]" style={{ color: INK }}>
              fetch(<span style={{ color: RED }}>'correo.com/bandeja'</span>)
              <br />
              <span className="text-[18px] font-normal" style={{ color: MUTED }}>
                Ejemplo ilustrativo
              </span>
            </p>
          </BrowserCard>
        </Appear>
        <BoothHouse x={100} y={296} sign="Aduana" />
        <At x={200} y={540} w={270} h={166} className="rounded-[14px] border-[3px]" style={{ background: INK, borderColor: INK }}>
          <div className="flex h-full flex-col items-center justify-center">
            <Icono name="mail" size={58} strokeWidth={2} ancla={false} className="text-white" />
            <p data-ui="" className="mt-2 font-mono text-[26px] font-bold leading-none" style={{ color: SURFACE }}>
              correo.com
            </p>
          </div>
        </At>
        {t >= b.leer ? (
          <div className="absolute" style={{ left: 330, top: keys(t, route) + bounce, transform: `translate(-50%,-50%) scale(${shape.sx}, ${shape.sy})` }}>
            <div data-ui="" className="flex h-[84px] w-[110px] flex-col items-center justify-center rounded-[10px] border-[3px]" style={{ background: SURFACE, borderColor: INK, boxShadow: "0 8px 0 rgba(19,33,27,0.22)" }}>
              {t < b.sesion ? (
                <Icono name="inbox" size={40} strokeWidth={2.2} ancla={false} className="text-ink" />
              ) : (
                <>
                  <Icono name="mail" size={26} strokeWidth={2.4} ancla={false} className="text-ink" />
                  <p className="mt-1 font-mono text-[17px] font-bold leading-[1.1]" style={{ color: INK, filter: "blur(3.5px)" }}>
                    tu bandeja
                  </p>
                </>
              )}
            </div>
          </div>
        ) : null}
        <Barrier x={254} y={408} open={open} length={136} />
        <Dust at={b.abierta + 0.04} x={254} y={408} width={136} size={0.8} />
        <Sfx id="golpe" at={b.abierta + 0.03} volume={0.34} />
        {t >= b.segunda - 0.1 ? (
          <div className="absolute flex h-[86px] w-[86px] items-center justify-center rounded-full border-[4px]" style={{ left: 412, top: 364, background: GREEN, borderColor: INK, transform: `scale(${shield})` }}>
            <Icono name="shield-check" size={52} strokeWidth={2.2} ancla={false} className="text-white" />
          </div>
        ) : null}
      </At>
    </Part>
  );
}

/* ---------- What stays on the screen, whatever the camera does ---------- */

/** The credential under the avatar's bubble: locked to the screen and with its spring, so the two never slide apart (scene correo → avatar). */
function Credential() {
  const { sceneId, sceneMs } = useStage();
  if (sceneId !== "correo") return null;
  const pop = spring({ frame: (sceneMs / 1000) * 30, fps: 30, config: { damping: 12, stiffness: 170 } });
  return (
    <div className="absolute" style={{ left: 24, top: 520, width: 162, height: 186, transform: `scale(${pop})`, transformOrigin: "81px 70px" }}>
      <div className="relative h-full w-full rounded-[16px] border-[3px]" style={{ background: SURFACE, borderColor: INK, boxShadow: "0 10px 0 rgba(19,33,27,0.16)" }}>
        <p data-ui="" className="absolute inset-x-0 bottom-[12px] text-center font-mono text-[18px] font-bold leading-[1.1]" style={{ color: INK }}>
          tú
          <br />
          tu sesión
        </p>
      </div>
    </div>
  );
}

/** Speed lines over the picture while it slides, along the way it goes. */
function PanLines() {
  const v = useSlide();
  const t = useT();
  const speed = Math.hypot(v.x, v.y);
  if (speed < 14) return null;
  const angle = (Math.atan2(v.y, v.x) * 180) / Math.PI;
  const alpha = Math.min(1, (speed - 14) / 40);
  const length = Math.min(340, speed * 5);
  return (
    <svg className="absolute left-0 top-0" width={540} height={960} aria-hidden>
      {Array.from({ length: 9 }, (_, i) => {
        const x = (i * 197 + Math.round(t * 30) * 41) % 540;
        const y = 110 + ((i * 313 + Math.round(t * 30) * 67) % 700);
        return <line key={i} x1={x - length / 2} y1={y} x2={x + length / 2} y2={y} stroke={INK} strokeOpacity={0.16 * alpha} strokeWidth={i % 3 ? 3 : 5} strokeLinecap="round" transform={`rotate(${angle} ${x} ${y})`} />;
      })}
    </svg>
  );
}

/** A ticket that gets stamped, holds and lands on the meter at `lands` (meter → steps). */
function PartTicket({ at, lands, n, text }: { at: number; lands: number; n: number; text: string }) {
  const t = useT();
  const flight = 0.45;
  if (t < at || t > lands + 0.05) return null;
  const p = popAt(t, at);
  const fly = inCubic(Math.min(1, Math.max(0, (t - lands + flight) / flight)));
  const x = 270 + (432 - 270) * fly;
  const y = 762 + (28 - 762) * fly;
  return (
    <div className="absolute" style={{ left: x, top: y, transform: `translate(-50%, -50%) scale(${(0.8 + 0.2 * p) * (1 - fly * 0.86)}) rotate(${-2 * (1 - fly)}deg)`, opacity: Math.min(1, p * 2) * (1 - fly * 0.4) }}>
      <div data-ui="" className="flex items-center gap-3 whitespace-nowrap rounded-[14px] border-[4px] px-4 py-3" style={{ background: "#F4D34A", borderColor: INK, boxShadow: "0 10px 0 rgba(19,33,27,0.3)" }}>
        <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full font-display text-[30px] font-black text-white" style={{ background: INK }}>
          {n}
        </span>
        <p className="font-display text-[29px] font-black uppercase leading-none tracking-tight" style={{ color: INK }}>
          {text}
        </p>
      </div>
    </div>
  );
}

function popAt(t: number, at: number) {
  return back(Math.min(1, (t - at) / 0.32));
}

function Question({ c }: { c: Cues }) {
  const t = useT();
  const r = c.repregunta;
  const on = t >= r.start && t < c.respuesta.start;
  if (!on) return null;
  const p = popAt(t, r.start);
  const q = t >= r.delete - 0.4 ? popAt(t, r.delete - 0.4) : 0;
  return (
    <>
      <div className="absolute" style={{ left: 36, top: 104, width: 226, height: 200, transform: `scale(${Math.min(1, p)})`, transformOrigin: "20% 20%" }}>
        <div data-ui="" className="relative h-full w-full overflow-hidden rounded-[16px] border-[3px]" style={{ background: "#20302A", borderColor: INK }}>
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-2 py-1 font-mono text-[13px] font-bold text-white" style={{ background: RED }}>
            <span className="h-[8px] w-[8px] rounded-full bg-white" /> EN VIVO
          </span>
          <p className="absolute inset-x-0 bottom-2 text-center font-mono text-[15px] font-bold text-white">Entrevistador</p>
        </div>
      </div>
      {t >= r.delete - 0.4 ? (
        <div className="absolute" style={{ left: 272, top: 120, width: 236, transform: `scale(${Math.min(1.02, q)})`, transformOrigin: "0% 50%" }}>
          <div className="rounded-[16px] rounded-tl-[4px] border-[3px] px-3 py-3" style={{ background: "#FFFFFF", borderColor: INK }}>
            <p className="font-display text-[34px] font-black leading-[1] tracking-tight" style={{ color: INK }}>
              ¿Y si es un <span style={{ color: RED }}>DELETE</span>?
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

function FinalForm({ c }: { c: Cues }) {
  const t = useT();
  const e = c.respuesta;
  if (t < e.start) return null;
  const p = popAt(t, e.start + 0.1);
  const rows = [
    { ...FORM_ROWS[0], on: fade(t, e.navegador, 0.18), detailOn: fade(t, e.politica, 0.18) },
    { ...FORM_ROWS[1], on: fade(t, e.usuario, 0.18), detailOn: fade(t, e.usuario + 0.45, 0.18) },
    { ...FORM_ROWS[2], on: fade(t, e.servidor, 0.18), detailOn: fade(t, e.relajarla, 0.18) },
  ];
  const send = t >= e.mandaselo ? popAt(t, e.mandaselo) : 0;
  return (
    <>
      <div className="absolute inset-0" style={{ background: PAPER, backgroundImage: GUILLOCHE, opacity: fade(t, e.start, 0.5) }} />
      <div className="absolute" style={{ left: 36, top: 112, width: 468, height: 354, transform: `translateY(${(1 - Math.min(1, p)) * 500}px) rotate(${(1 - Math.min(1, p)) * 6}deg)` }}>
        <Sfx id="page-turn" at={e.start + 0.1} volume={0.3} />
        {rows.map((r, i) => (r.on > 0 ? <Sfx key={r.label} id="blip" at={[e.navegador, e.usuario, e.servidor][i]} volume={0.24} /> : null))}
        <Form
          rows={rows}
          stamp={
            t >= e.mandaselo - 0.6 ? (
              <Stamp at={e.mandaselo - 0.5} x={350} y={186} color={GREEN} rotate={-12} size={30}>
                Aprobada
              </Stamp>
            ) : null
          }
        />
      </div>
      {t >= e.mandaselo ? (
        <div className="absolute flex items-center gap-3" style={{ left: 36, top: 622, transform: `scale(${Math.min(1.03, send)})`, transformOrigin: "0 50%" }}>
          <Sfx id="whip" at={e.mandaselo} volume={0.26} />
          <span className="flex h-[74px] w-[74px] items-center justify-center rounded-full border-[4px]" style={{ background: GREEN, borderColor: INK, transform: `rotate(${Math.sin(t * 3) * 7}deg)` }}>
            <Icono name="send" size={38} strokeWidth={2.4} ancla={false} className="text-white" />
          </span>
          <p className="font-display text-[34px] font-black uppercase leading-[0.98] tracking-tight" style={{ color: INK }}>
            Mándaselo
          </p>
        </div>
      ) : null}
    </>
  );
}

/** Locked to the screen: coordinates are the frame's, whatever the camera does. */
function Screen({ c }: { c: Cues }) {
  const { camera } = useStage();
  const z = camera.zoom;
  return (
    <div className="absolute left-0 top-0" style={{ width: 540, height: 960, transformOrigin: "0 0", transform: `translate(${camera.x - VIEW.x / z}px, ${camera.y - VIEW.y / z}px) scale(${1 / z})` }}>
      <PanLines />
      <Credential />
      <TrapWords c={c} />
      <PartTicket at={c.trampa.primera} lands={c.trampa.postman} n={1} text="Bloquea el navegador" />
      <PartTicket at={c.correo.segunda} lands={c.permiso.barrera} n={2} text="Protege al usuario" />
      <PartTicket at={c.permiso.tercera} lands={c.permiso.servidor2} n={3} text="Permite el servidor" />
      <ExpressCard c={c} />
      <Question c={c} />
      <FinalForm c={c} />
      <ClosingConsole c={c} />
      {/* The world fades under the tab and under the captions: it never crosses them. */}
      <div className="absolute inset-x-0 top-0 h-[104px]" style={{ background: `linear-gradient(${PAPER} 74%, rgba(230,236,220,0))` }} />
      <div className="absolute inset-x-0 bottom-0 h-[166px]" style={{ background: `linear-gradient(rgba(230,236,220,0), ${PAPER} 12%)` }} />
    </div>
  );
}

function TrapWords({ c }: { c: Cues }) {
  const t = useT();
  const tr = c.trampa;
  if (t < tr.trampa - 0.1 || t >= tr.servidor) return null;
  return (
    <Stamp at={tr.trampa} x={270} y={166} color={RED} rotate={-5} size={70} fill={SURFACE}>
      La trampa
    </Stamp>
  );
}

function ExpressCard({ c }: { c: Cues }) {
  const t = useT();
  const p = c.permiso;
  const at = p.pasar + 0.35;
  if (t < at || t >= c.repregunta.start) return null;
  const pop = popAt(t, at);
  const lines = ["app.use(cors({", "  origin: 'http://localhost:3000'", "}))"];
  let left = Math.floor(fade(t, at + 0.1, 0.8) * lines.join("").length);
  return (
    <div data-ui="" className="absolute rounded-[14px] px-4 py-3 font-mono" style={{ left: 36, width: 468, top: 494, background: INK, color: SURFACE, transform: `scale(${Math.min(1, pop)})`, transformOrigin: "50% 0", boxShadow: "0 12px 0 rgba(19,33,27,0.2)" }}>
      <p className="flex items-center gap-2 text-[18px] leading-none" style={{ color: "#9FB5A8" }}>
        <Logo slug="express" size={20} ancla={false} chip /> // Express + paquete cors
      </p>
      <div className="mt-2 text-[22px] font-bold leading-[30px]">
        {lines.map((line) => {
          const shown = line.slice(0, Math.max(0, left));
          left -= line.length;
          return (
            <p key={line} className="h-[30px] whitespace-pre">
              {shown}
            </p>
          );
        })}
      </div>
    </div>
  );
}

/** The red error of the first frame comes back crossed out, over the line that fixes it: it closes the hook. */
function ClosingConsole({ c }: { c: Cues }) {
  const t = useT();
  const at = c.respuesta.cors;
  if (t < at) return null;
  const pop = popAt(t, at);
  const strike = fade(t, at + 0.3, 0.3);
  return (
    <div data-ui="" className="absolute overflow-hidden rounded-[14px]" style={{ left: 36, top: 480, width: 468, background: DEVTOOLS.bg, opacity: Math.min(1, pop * 2), transform: `translateY(${(1 - Math.min(1, pop)) * 36}px)`, boxShadow: "0 10px 0 rgba(19,33,27,0.16)" }}>
      <Sfx id="switch" at={at + 0.3} volume={0.26} />
      <div className="flex items-center gap-3 border-b px-3 py-2 font-sans text-[21px] font-medium" style={{ background: DEVTOOLS.errorBg, borderColor: DEVTOOLS.line, color: DEVTOOLS.error }}>
        <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[15px] font-bold" style={{ background: "#E46962", color: DEVTOOLS.bg }}>
          ×
        </span>
        <span className="relative whitespace-nowrap">
          blocked by CORS policy
          <span className="absolute left-[-4px] top-[12px] h-[4px] rounded-full" style={{ width: `calc(${strike * 100}% + 8px)`, background: "#F28B82" }} />
        </span>
      </div>
      <div className="px-3 py-2 font-mono text-[21px] font-bold leading-[28px]">
        <p style={{ color: DEVTOOLS.text }}>{"app.use(cors({ origin:"}</p>
        <p className="whitespace-pre" style={{ color: "#7CF2B8" }}>
          {"  'http://localhost:3000' }))"}
        </p>
      </div>
    </div>
  );
}

/* ---------- The world ---------- */

const GUILLOCHE = (() => {
  const wave = (i: number, sign: number) => {
    const y0 = i * 26 + 13;
    const points = Array.from({ length: 41 }, (_, k) => {
      const x = k * 6;
      return `${x},${(y0 + sign * 10 * Math.sin((2 * Math.PI * x) / 240 + i * 0.7)).toFixed(1)}`;
    });
    return `<polyline points="${points.join(" ")}" fill="none" stroke="${INK}" stroke-opacity="0.34" stroke-width="0.7"/>`;
  };
  const lines = Array.from({ length: 9 }, (_, i) => wave(i, 1) + wave(i, -1)).join("");
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='240' height='234'>${lines}</svg>`)}")`;
})();

function rigKeys(c: Cues): RigKey[] {
  const { viaje: v, trampa: tr, correo: b, permiso: p, repregunta: r, origen: o } = c;
  return [
    // Origin: close in on the port, and back.
    { at: o.cambia - 0.1, dur: 0.45, dy: -145, z: 1.06 },
    { at: o.otro + 0.75, dur: 0.5 },
    // The trip: down with the parcel, up to the barrier.
    { at: v.sale + 0.1, dur: 1.0, dy: 430 },
    { at: v.vuelve, dur: 0.85, dy: 0 },
    // The trap: the booth, the server, and all of it with Postman.
    { at: tr.start, dur: 0.5, dx: -105, dy: 180, z: 1.28 },
    { at: tr.servidor - 0.05, dur: 0.45, dy: 690 },
    { at: tr.postman - 0.1, dur: 0.85, dx: -140, dy: 253, z: 0.6 },
    // The mail: back to rest while the stage's camera pans.
    { at: b.start - 0.25, dur: 0.85 },
    // The permit: down to stamp it, up with it, up to the page.
    { at: p.servidor - 0.15, dur: 0.5, dy: 430 },
    { at: p.navegador - 0.55, dur: 0.5, dy: 0 },
    // The follow-up: with the scout down to the server, and back.
    { at: r.preflight, dur: 0.5, dy: 330 },
    { at: r.permiso - 0.3, dur: 0.5 },
  ];
}

function World() {
  const { camera } = useStage();
  const t = useT();
  const c = useCues();
  const rig = rigAt(t, rigKeys(c));
  const hits = [c.gancho.permiso, c.origen.otro, c.viaje.ok, c.viaje.queda - 0.14, c.trampa.trampa, c.permiso.cabecera, c.repregunta.ni, c.correo.abierta + 0.03, c.respuesta.mandaselo - 0.5];
  const shake = shakeAt(t, hits);
  const transform = `translate(${camera.x + shake.x}px, ${camera.y + shake.y}px) scale(${rig.z}) translate(${-(camera.x + rig.dx)}px, ${-(camera.y + rig.dy)}px)`;
  // The motion blur of a pan: half a frame's travel along the way it goes, in the world's px.
  const slide = useSlide();
  const zoom = camera.zoom * rig.z;
  const [blurX, blurY] = [Math.min(9, Math.abs(slide.x) * 0.2) / zoom, Math.min(9, Math.abs(slide.y) * 0.2) / zoom];
  const blurred = blurX + blurY > 0.6;
  return (
    <div className="absolute inset-0 text-ink">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id="ink" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" result="d" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 2.05" result="a" />
          <feComposite in="d" in2="a" operator="in" />
        </filter>
        <filter id="pan" x="0" y="0" width="100%" height="100%">
          <feGaussianBlur stdDeviation={`${blurX.toFixed(2)} ${blurY.toFixed(2)}`} />
        </filter>
      </svg>
      <div className="absolute inset-0" style={{ background: PAPER, backgroundImage: GUILLOCHE, filter: blurred ? "url(#pan)" : undefined }}>
        {/* Once the final form has covered the customs, there is no world left to draw. */}
        {t < c.respuesta.start + 0.5 ? (
          <div className="absolute left-0 top-0" style={{ width: W, height: H, transform, transformOrigin: "0 0" }}>
            <HookPart c={c} />
            <OriginPart c={c} />
            <Lane c={c} />
            <MailLane c={c} />
          </div>
        ) : null}
      </div>
      <Screen c={c} />
    </div>
  );
}

export default defineVideo({
  captions: "marker",
  chapters: true,
  stage: { World, width: W, height: H, drift: 0.015 },
  // A replica lasts what its reference lasts (75 s): a faster voice instead of cutting content (docs/direccion-reels.md, 3).
  voice: { tempo: 1.25 },
  music: { file: "audio/cama.mp3" },
  // The avatar only appears in the parts that need a face: presenter, the trap, you, the interviewer and the close.
  avatar: { shape: "bubble", bubbleCrop: { x: 480, y: 150, w: 1200, h: 1200 } },
  meter: {
    kind: "slots",
    max: 3,
    start: 0,
    steps: [
      // When the part's ticket lands on it (PartTicket).
      { scene: "trampa", word: "postman", value: 1 },
      { scene: "permiso", word: "barrera", value: 2 },
      { scene: "permiso", word: "servidor", nth: 2, value: 3 },
    ],
  },
  scenes: [
    { id: "gancho", chapter: "CORS", camera: SHOTS.gancho, Visual: HookTitle, avatar: { x: 438, y: 705, size: 148 } },
    { id: "origen", chapter: "El origen", camera: SHOTS.origen },
    { id: "viaje", chapter: "El viaje", camera: SHOTS.viaje },
    { id: "trampa", chapter: "La trampa", camera: SHOTS.trampa, avatar: { x: 92, y: 610, size: 132 } },
    { id: "correo", chapter: "Por qué", camera: SHOTS.correo, avatar: { x: 105, y: 590, size: 112 } },
    { id: "permiso", chapter: "El permiso", camera: SHOTS.permiso },
    { id: "repregunta", chapter: "Repregunta", camera: SHOTS.repregunta, avatar: { x: 149, y: 208, size: 116 } },
    { id: "respuesta", chapter: "Respuesta", camera: SHOTS.respuesta, avatar: { x: 440, y: 692, size: 132 } },
  ],
});
