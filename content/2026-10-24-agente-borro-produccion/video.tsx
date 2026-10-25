import type { ReactNode } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Icono } from "@motor/ui";
import { defineVideo, Plate, useCue, useStage, useStageCue } from "@motor/video";

// El edificio es una metáfora del incidente de PocketOS (facts.json → illustrative): la oficina
// es el entorno de pruebas, la llave es el token de Railway y la bóveda es producción. El robot
// es un agente genérico, sin marca. Las láminas son de video:image (generated.json).

const W = 540;
const H = 968;
const spots = {
  edificio: { x: 40, y: 60, w: 470, h: 860 },
  oficina: { x: 73, y: 120, w: 411, h: 330 },
  mesa: { x: 120, y: 200, w: 360, h: 230 },
  bajada: { x: 60, y: 260, w: 430, h: 520 },
  boveda: { x: 73, y: 500, w: 410, h: 340 },
  estantes: { x: 250, y: 520, w: 240, h: 300 },
};

/** Measured on the plate, in world coordinates. */
const ROBOT_FEET = { x: 286, y: 392 };
const ROBOT_BOX = 82;
const DRAWER = { x: 312, y: 296 };
const DOOR_LOCK = { x: 450, y: 307 };
const SHAFT_TOP = { x: 360, y: 405 };
const SHAFT_BOTTOM = { x: 360, y: 560 };
const SERVERS = { x: 370, y: 640 };
const BACKUPS = { x: 405, y: 640 };
/** The inside of the vault: the only place where the two plates differ. */
const VAULT_INSIDE = { x: 280, y: 520, w: 195, h: 310 };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (t: number, at: number, dur = 0.3) => interpolate(t, [at, at + dur], [0, 1], clamp);
const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, p: number) => ({ x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p });
const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

function useT() {
  return useStage().ms / 1000;
}

/** A label pinned to a point of the world, centered on it. */
function Tag({ at, shown, tone = "solid", children }: { at: { x: number; y: number }; shown: number; tone?: "accent" | "solid" | "light"; children: ReactNode }) {
  if (shown <= 0) return null;
  const tones = { accent: "bg-accent text-accent-ink", solid: "bg-ink text-bg", light: "bg-white text-[#1A1E2B]" };
  return (
    <span
      className={`absolute flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 font-mono text-[16px] font-bold uppercase leading-none shadow-[0_4px_10px_rgba(0,0,0,0.4)] ${tones[tone]}`}
      style={{ left: at.x, top: at.y, opacity: shown, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * shown})` }}
    >
      {children}
    </span>
  );
}

function Robot() {
  const t = useT();
  const bob = Math.sin(t * 3) * 1.2;
  // It leans toward the drawer while it looks for another key.
  const look = fade(t, useStageCue("llave", "buscó"), 0.5) * (1 - fade(t, useStageCue("borrado", "pero"), 0.5));
  const x = ROBOT_FEET.x + 14 * look;
  const y = ROBOT_FEET.y - 26 * look;
  return (
    <div className="absolute" style={{ left: x - 0.5 * ROBOT_BOX, top: y - 0.86 * ROBOT_BOX + bob, width: ROBOT_BOX, height: ROBOT_BOX }}>
      <div className="absolute bottom-[8px] left-1/2 h-[7px] w-[32px] -translate-x-1/2 rounded-[50%] bg-black/40 blur-[2px]" />
      <Plate src="img/robot.png" box={{ x: 0, y: 0, w: ROBOT_BOX, h: ROBOT_BOX }} />
    </div>
  );
}

/** The master key: a golden key that glows red once it opens the vault. */
function MasterKey({ x, y, scale = 1, danger = 0 }: { x: number; y: number; scale?: number; danger?: number }) {
  const t = useT();
  return (
    <div className="absolute" style={{ left: x, top: y, transform: `translate(-50%, -50%) scale(${scale}) rotate(${Math.sin(t * 2) * 8}deg)` }}>
      <div className="absolute left-1/2 top-1/2 h-[50px] w-[50px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[12px]" style={{ background: danger > 0.5 ? "rgba(255,77,61,0.7)" : "rgba(255,200,80,0.6)" }} />
      <Icono name="key-round" size={30} strokeWidth={2.75} ancla={false} className={danger > 0.5 ? "relative text-accent" : "relative text-[#FFC850]"} />
    </div>
  );
}

function KeyPath() {
  const t = useT();
  const found = useStageCue("llave", "encontró");
  const down = useStageCue("borrado", "bóveda");
  const call = useStageCue("borrado", "llamada");
  const gone = useStageCue("respaldos", "respaldos");
  if (t < found - 0.2 || t > gone) return null;
  // Out of the drawer, to the robot, down the cable shaft, into the vault.
  let at = DRAWER;
  if (t < down) at = lerp(DRAWER, { x: ROBOT_FEET.x + 26, y: ROBOT_FEET.y - 70 }, easeInOut(interpolate(t, [found + 0.2, found + 1.2], [0, 1], clamp)));
  else {
    const p = easeInOut(interpolate(t, [down, call], [0, 1], clamp));
    const legs = [{ x: ROBOT_FEET.x + 26, y: ROBOT_FEET.y - 70 }, SHAFT_TOP, SHAFT_BOTTOM, SERVERS];
    const seg = Math.min(2, Math.floor(p * 3));
    at = lerp(legs[seg], legs[seg + 1], p * 3 - seg);
  }
  return (
    <>
      <MasterKey x={at.x} y={at.y} scale={1.2} danger={fade(t, down, 0.4)} />
      <Tag at={{ x: at.x, y: at.y + 28 }} shown={fade(t, useStageCue("llave", "dominios")) * (1 - fade(t, down, 0.3))} tone="light">
        Dominios
      </Tag>
    </>
  );
}

function Vault() {
  const t = useT();
  const call = useStageCue("borrado", "llamada");
  const wiped = fade(t, call + 0.3, 1.2);
  const shown = (at: number) => fade(t, at);
  const end = useStageCue("confesion", "después");
  return (
    <>
      <Plate src="img/edificio-borrado.png" clip={VAULT_INSIDE} opacity={wiped} />
      <Tag at={{ x: 390, y: 600 }} shown={shown(useStageCue("borrado", "volumen")) * (1 - fade(t, end))} tone="accent">
        volumeDelete
      </Tag>
      <Tag at={{ x: BACKUPS.x, y: 760 }} shown={shown(useStageCue("respaldos", "mismo")) * (1 - fade(t, end))} tone="light">
        <Icono name="archive-x" size={16} strokeWidth={2.75} ancla={false} />
        Respaldos
      </Tag>
      <Tag at={{ x: 330, y: 800 }} shown={shown(useStageCue("respaldos", "tres")) * (1 - fade(t, end))} tone="solid">
        Aparte: 3 meses
      </Tag>
    </>
  );
}

function Office() {
  const t = useT();
  const fail = useStageCue("llave", "credenciales");
  const blink = t > fail && t < fail + 1.6 ? 0.5 + 0.5 * Math.sin((t - fail) * 16) : 0;
  const end = useStageCue("borrado", "pero");
  return (
    <>
      <Tag at={{ x: 170, y: 150 }} shown={fade(t, useStageCue("tarea", "staging")) * (1 - fade(t, end))} tone="light">
        Staging
      </Tag>
      <div className="absolute h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 blur-[3px]" style={{ left: DOOR_LOCK.x, top: DOOR_LOCK.y, opacity: blink }} />
      <Tag at={{ x: 392, y: 240 }} shown={fade(t, fail) * (1 - fade(t, end))} tone="accent">
        <Icono name="lock" size={15} strokeWidth={3} ancla={false} />
        Credenciales
      </Tag>
    </>
  );
}

/** The guard of PreToolUse at the vault door: the delete arrives and is stopped. */
function Guard() {
  const t = useT();
  const at = useStageCue("hook", "pretooluse");
  const cmd = useStageCue("hook", "comando");
  const deny = useStageCue("hook", "bloquear");
  const out = useStageCue("cierre", "nueve");
  if (t < at - 0.2) return null;
  const travel = easeInOut(interpolate(t, [cmd, deny], [0, 1], clamp));
  const hit = Math.max(0, 1 - (t - deny) * 3);
  const vis = 1 - fade(t, out + 0.4);
  return (
    <div style={{ opacity: vis }}>
      <Tag at={{ x: 190, y: 690 }} shown={fade(t, at)} tone="light">
        <Icono name="shield-check" size={16} strokeWidth={2.75} ancla={false} />
        PreToolUse
      </Tag>
      {t < deny + 1.5 ? (
        <Tag at={{ x: 150 + 50 * travel + (t > deny ? Math.sin((t - deny) * 40) * hit * 5 : 0), y: 610 }} shown={fade(t, cmd)} tone="accent">
          volumeDelete
        </Tag>
      ) : null}
      {t >= deny ? (
        <span
          className="absolute rounded-md border-[4px] border-red-500 bg-white px-2 py-0.5 font-mono text-[26px] font-black uppercase text-red-600 shadow-[0_8px_18px_rgba(0,0,0,0.5)]"
          style={{ left: 190, top: 640, transform: `translate(-50%, -50%) scale(${1 + hit}) rotate(-10deg)` }}
        >
          Deny
        </span>
      ) : null}
    </div>
  );
}

function Building() {
  const t = useT();
  return (
    <div className="absolute inset-0 text-ink">
      <Plate src="img/edificio.png" />
      <Vault />
      <Office />
      <Robot />
      <KeyPath />
      <Guard />
      <div className="pointer-events-none absolute -inset-[200px] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(8,10,18,0.6))]" style={{ opacity: 0.6 + 0.1 * Math.sin(t) }} />
    </div>
  );
}

/* ---------- What goes over the world, per scene ---------- */

function useSpring(at: number, config = { damping: 13, stiffness: 160 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - Math.round(at * fps), fps, config });
}

function useSceneT() {
  return useCurrentFrame() / useVideoConfig().fps;
}

/** A stopwatch that runs from 0 to 9 s: the length of the deletion. */
function Stopwatch({ from, size = 96 }: { from: number; size?: number }) {
  const t = useSceneT();
  const s = interpolate(t, [from, from + 2.2], [0, 9], clamp);
  return (
    <div className="flex items-center gap-3">
      <Icono name="timer" size={size * 0.5} strokeWidth={2.5} ancla={false} className="text-accent" />
      <span className="font-display font-black tabular-nums leading-none text-accent" style={{ fontSize: size }}>
        {s.toFixed(1)} s
      </span>
    </div>
  );
}

function Dim({ at = 0 }: { at?: number }) {
  const t = useSceneT();
  return <div className="pointer-events-none absolute -inset-[300px] bg-[#0B0E16]" style={{ opacity: 0.65 * fade(t, at, 0.35) }} />;
}

function Hook() {
  return (
    <div className="relative flex h-full flex-col">
      <p className="font-display text-[50px] font-black leading-[0.98] tracking-tight text-ink drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
        Borrada en <span className="text-accent">9 segundos</span>
      </p>
      <div className="mt-auto">
        <Stopwatch from={0.2} size={72} />
      </div>
    </div>
  );
}

function Task() {
  const t = useSceneT();
  const company = useSpring(useCue("pocketos"));
  const tool = useSpring(useCue("cursor"));
  return (
    <div className="relative flex h-full flex-col gap-2">
      <p className="self-start rounded-lg bg-white px-3 py-1.5 font-display text-[30px] font-black text-[#1A1E2B]" style={{ transform: `scale(${company})`, transformOrigin: "0 50%", opacity: t >= useCue("pocketos") ? 1 : 0 }}>
        PocketOS
      </p>
      <p className="self-start rounded-lg bg-surface px-3 py-1.5 font-mono text-[22px] font-bold text-ink" style={{ transform: `translateX(${(1 - tool) * -40}px)`, opacity: tool }}>
        Cursor + Claude Opus 4.6
      </p>
    </div>
  );
}

function Deletion() {
  const call = useCue("llamada");
  return (
    <div className="relative flex h-full flex-col justify-end pb-4">
      <div style={{ opacity: useSceneT() >= call ? 1 : 0 }}>
        <Stopwatch from={call} />
      </div>
    </div>
  );
}

function Confession() {
  const t = useSceneT();
  const start = useCue("violé");
  const line = "Violé todos los principios que me dieron.";
  const typed = Math.round(interpolate(t, [start, start + 2.2], [0, line.length], clamp));
  const box = useSpring(useCue("confesión") - 0.2);
  return (
    <div className="relative flex h-full flex-col justify-center">
      <Dim at={useCue("confesión") - 0.3} />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0D1117] shadow-[0_30px_60px_rgba(0,0,0,0.6)]" style={{ transform: `scale(${0.9 + 0.1 * box})`, opacity: box }}>
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <i className="block h-3 w-3 rounded-full bg-[#FF5F57]" />
          <i className="block h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <i className="block h-3 w-3 rounded-full bg-[#28C840]" />
          <span className="ml-2 font-mono text-[22px] text-[#8B949E]">agente</span>
        </div>
        <p className="min-h-[150px] p-5 font-mono text-[32px] font-bold leading-snug text-[#E6EDF3]">
          {line.slice(0, typed)}
          <span className="ml-0.5 inline-block h-[30px] w-[14px] translate-y-[4px] bg-accent" style={{ opacity: Math.sin(t * 8) > 0 ? 1 : 0 }} />
        </p>
      </div>
      <p className="relative mt-3 font-mono text-[22px] text-muted" style={{ opacity: box }}>Según Live Science</p>
    </div>
  );
}

function Lesson() {
  const keysAt = useCue("chicas");
  const small = useSpring(keysAt);
  const scope = useSpring(useCue("mínimo"));
  const backup = useSpring(useCue("respaldos"));
  const t = useSceneT();
  return (
    <div className="relative flex h-full flex-col justify-end gap-3 pb-4">
      <div className="flex items-end gap-4" style={{ opacity: small }}>
        <Icono name="key-round" size={64} strokeWidth={2.5} ancla={false} className="text-[#FFC850]" />
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ transform: `scale(${spring({ frame: Math.max(0, (t - keysAt - 0.2 * i) * 30), fps: 30 })})` }}>
            <Icono name="key" size={34} strokeWidth={2.75} ancla={false} className="text-ink" />
          </span>
        ))}
      </div>
      <p className="self-start rounded-lg bg-accent px-3 py-1.5 font-display text-[32px] font-black text-accent-ink" style={{ opacity: scope, transform: `translateX(${(1 - scope) * -40}px)` }}>
        Mínimo permiso
      </p>
      <p className="self-start rounded-lg bg-white px-3 py-1.5 font-display text-[32px] font-black text-[#1A1E2B]" style={{ opacity: backup, transform: `translateX(${(1 - backup) * -40}px)` }}>
        Respaldo aparte
      </p>
    </div>
  );
}

function Close() {
  const nine = useSpring(0, { damping: 11, stiffness: 150 });
  const thirty = useSpring(useCue("treinta"), { damping: 9, stiffness: 170 });
  const cta = useSpring(useCue("revisa"));
  const t = useSceneT();
  const out = fade(t, useCue("revisa") - 0.3, 0.3);
  return (
    <div className="relative flex h-full flex-col">
      <div className="flex items-end justify-center gap-6 rounded-2xl bg-[#0B0E16]/80 px-5 py-4" style={{ opacity: 1 - out, transform: `translateY(${-30 * out}px)` }}>
        <div style={{ transform: `scale(${nine})` }}>
          <p className="font-display text-[92px] font-black leading-[0.85] text-accent">9 s</p>
          <p className="font-mono text-[24px] font-bold uppercase text-accent">para borrar</p>
        </div>
        <div style={{ transform: `scale(${thirty})`, opacity: thirty }}>
          <p className="font-display text-[92px] font-black leading-[0.85] text-ink">30 h</p>
          <p className="font-mono text-[24px] font-bold uppercase text-ink">para volver</p>
        </div>
      </div>
      <p className="mt-auto rounded-xl bg-accent px-4 py-2.5 text-center font-display text-[30px] font-black text-accent-ink" style={{ transform: `translateY(${(1 - cta) * 80}px)`, opacity: cta }}>
        Revisa tus tokens hoy
      </p>
    </div>
  );
}

export default defineVideo({
  captions: "pill",
  chapters: true,
  music: { file: "audio/cama.mp3" },
  stage: { World: Building, width: W, height: H, spots },
  meter: { kind: "counter", start: 0, unit: "h", steps: [{ scene: "confesion", word: "treinta", value: 30 }] },
  scenes: [
    { id: "gancho", chapter: "9 segundos", camera: { focus: "edificio" }, Visual: Hook },
    { id: "tarea", chapter: "La tarea", camera: { focus: "oficina" }, Visual: Task },
    { id: "llave", chapter: "La llave", camera: { focus: "mesa" }, sfx: [{ asset: "whoosh", at: "encontró", volume: 0.3 }] },
    { id: "borrado", chapter: "El borrado", camera: { focus: "bajada" }, Visual: Deletion, sfx: [{ asset: "whoosh", at: "bóveda", volume: 0.3 }] },
    { id: "respaldos", chapter: "Respaldos", camera: { focus: "estantes" } },
    { id: "confesion", chapter: "La confesión", Visual: Confession },
    { id: "leccion", chapter: "La lección", camera: { focus: "edificio" }, Visual: Lesson },
    { id: "hook", chapter: "PreToolUse", camera: { focus: "boveda" } },
    { id: "cierre", chapter: "Cierre", camera: { focus: "edificio" }, Visual: Close },
  ],
});
