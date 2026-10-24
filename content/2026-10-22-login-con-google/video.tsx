import type { ReactNode } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Icono, Logo } from "@motor/ui";
import { BrowserBar, defineVideo, Phone, Plate, useCue, useStage, useStageCue } from "@motor/video";

// El hotel es una metáfora del flujo de OAuth (facts.json → illustrative): la recepción es
// Google, la tarjeta es el token y las puertas son los permisos. Las láminas son de
// video:image (generated.json); el logo de Google va aparte, con su archivo oficial.

const W = 540;
const H = 968;
const spots = {
  hotel: { x: 10, y: 50, w: 520, h: 918 },
  final: { x: 20, y: 170, w: 500, h: 790 },
  // Taller than the corridor, so it sits high in the frame with the lobby under it.
  pasillo: { x: 92, y: 96, w: 388, h: 400 },
  recepcion: { x: 150, y: 340, w: 340, h: 250 },
  mostrador: { x: 190, y: 350, w: 250, h: 230 },
  viaje: { x: 60, y: 400, w: 440, h: 480 },
  entrada: { x: 15, y: 600, w: 510, h: 365 },
  acera: { x: 50, y: 690, w: 260, h: 200 },
};

/** The doors of the corridor, measured on the plate: where each one is and its reader. */
const DOORS = [
  { name: "Nombre", center: { x: 139, y: 256 }, reader: { x: 167, y: 238 }, clip: { x: 112, y: 196, w: 78, h: 120 } },
  { name: "Correo", center: { x: 226, y: 218 }, reader: { x: 255, y: 198 }, clip: { x: 203, y: 154, w: 75, h: 124 } },
  { name: "Foto", center: { x: 313, y: 179 }, reader: { x: 343, y: 160 }, clip: { x: 291, y: 115, w: 75, h: 128 } },
];
const LOCKED = { center: { x: 420, y: 219 }, reader: { x: 450, y: 225 } };

/** Diego's feet on each floor, and the encoder on the desk where the card is made. */
const DIEGO_STREET = { x: 160, y: 852 };
const DIEGO_DESK = { x: 322, y: 553 };
const ENCODER = { x: 329, y: 486 };
/** Diego is 92 world px tall: the sprite's figure fills 750 of its 1024 px. */
const DIEGO_BOX = 126;
const PHONE = { x: DIEGO_STREET.x - 0.08 * DIEGO_BOX, y: DIEGO_STREET.y - 0.46 * DIEGO_BOX };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (t: number, at: number, dur = 0.3) => interpolate(t, [at, at + dur], [0, 1], clamp);
const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, p: number) => ({ x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p });
const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

function useT() {
  return useStage().ms / 1000;
}

function Diego() {
  const t = useT();
  const toDesk = useStageCue("recepcion", "manda");
  const back = useStageCue("tarjeta", "entonces");
  // He changes floors with a quick dissolve, and breathes while he waits.
  const atDesk = t >= toDesk && t < back;
  const dip = (at: number) => 1 - Math.min(1, Math.abs(t - at) / 0.2);
  const opacity = 1 - Math.max(dip(toDesk), dip(back));
  const feet = atDesk ? DIEGO_DESK : DIEGO_STREET;
  const breathe = 1 + Math.sin(t * 2.4) * 0.012;
  return (
    <div className="absolute" style={{ left: feet.x - 0.508 * DIEGO_BOX, top: feet.y - 0.879 * DIEGO_BOX, width: DIEGO_BOX, height: DIEGO_BOX, opacity }}>
      <div className="absolute bottom-[14px] left-1/2 h-[10px] w-[46px] -translate-x-1/2 rounded-[50%] bg-black/35 blur-[3px]" />
      <div className="absolute inset-0" style={{ transform: `scaleY(${breathe})`, transformOrigin: "50% 88%" }}>
        <Plate src="img/diego.png" box={{ x: 0, y: 0, w: DIEGO_BOX, h: DIEGO_BOX }} />
      </div>
    </div>
  );
}

/** The key card as a small glowing object of the world, spinning slowly. */
function KeyCard({ x, y, opacity = 1, scale = 1 }: { x: number; y: number; opacity?: number; scale?: number }) {
  const t = useT();
  const spin = Math.cos(t * 2.2);
  return (
    <div className="absolute" style={{ left: x, top: y, opacity, transform: `translate(-50%, -50%) scale(${scale})` }}>
      <div className="absolute left-1/2 top-1/2 h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/45 blur-[14px]" />
      <div
        className="relative h-[22px] w-[34px] rounded-[4px] border border-white/60 bg-gradient-to-br from-[#FFB070] to-accent shadow-[0_0_12px_rgba(255,138,61,0.9)]"
        style={{ transform: `scaleX(${0.35 + 0.65 * Math.abs(spin)})` }}
      >
        <div className="absolute left-[4px] top-[5px] h-[7px] w-[9px] rounded-[2px] bg-[#FFE2A8]" />
      </div>
    </div>
  );
}

function WorldCard() {
  const t = useT();
  const hookOut = useStageCue("gancho", "diego");
  const made = useStageCue("tarjeta", "token");
  const doors = useStageCue("puertas", "tarjeta");
  const cues = [useStageCue("puertas", "nombre"), useStageCue("puertas", "correo"), useStageCue("puertas", "foto"), useStageCue("puertas", "gmail")];
  const gone = useStageCue("vence", "vence");
  // The hook: the card already floats over Diego's phone, before the story starts.
  if (t < hookOut + 0.3) return <KeyCard x={PHONE.x} y={PHONE.y - 34 - Math.sin(t * 3) * 3} opacity={1 - fade(t, hookOut, 0.3)} scale={1.4} />;
  if (t < made - 0.1) return null;
  if (t < doors) {
    // Made at the encoder, it flies in an arc to the phone.
    const p = easeInOut(interpolate(t, [made + 0.4, made + 1.6], [0, 1], clamp));
    const at = lerp(ENCODER, { x: PHONE.x, y: PHONE.y - 20 }, p);
    return <KeyCard x={at.x} y={at.y - Math.sin(p * Math.PI) * 70} opacity={fade(t, made - 0.1, 0.3)} scale={1.2} />;
  }
  if (t >= gone) return null;
  // In the corridor it visits each reader; the last one says no.
  const stops = [DOORS[0].reader, DOORS[1].reader, DOORS[2].reader, LOCKED.reader];
  let at = { x: 120, y: 300 };
  for (let i = 0; i < stops.length; i++) {
    const from = i === 0 ? { x: 120, y: 300 } : stops[i - 1];
    const p = easeInOut(interpolate(t, [cues[i] - 0.45, cues[i] - 0.05], [0, 1], clamp));
    if (t >= cues[i] - 0.45) at = lerp(from, stops[i], p);
  }
  const reject = cues[3];
  const shake = t > reject ? Math.sin((t - reject) * 40) * Math.max(0, 1 - (t - reject) * 2.5) * 6 : 0;
  return <KeyCard x={at.x + shake + 10} y={at.y - 6} opacity={fade(t, doors - 0.1, 0.3)} />;
}

function Doors() {
  const t = useT();
  const cues = [useStageCue("puertas", "nombre"), useStageCue("puertas", "correo"), useStageCue("puertas", "foto")];
  const gmail = useStageCue("puertas", "gmail");
  const ask = useStageCue("puertas", "permiso");
  const voided = useStageCue("vence", "anula");
  // When the card is revoked, the doors close again.
  const closed = 1 - fade(t, voided + 0.2, 0.6);
  const after = 1 - fade(t, useStageCue("vence", "y") - 0.1, 0.25);
  const blink = t > gmail && t < gmail + 1.4 ? 0.5 + 0.5 * Math.sin((t - gmail) * 18) : 0;
  return (
    <>
      {DOORS.map((door, i) => (
        <Plate key={door.name} src="img/hotel-abierto.png" clip={door.clip} opacity={fade(t, cues[i], 0.35) * closed} />
      ))}
      <div className="absolute h-[16px] w-[16px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 blur-[3px]" style={{ left: LOCKED.reader.x, top: LOCKED.reader.y, opacity: blink }} />
      {DOORS.map((door, i) => (
        <Tag key={door.name} at={{ x: door.center.x + 6, y: door.center.y }} shown={fade(t, cues[i] + 0.1) * closed * after} tone="accent">
          {door.name}
        </Tag>
      ))}
      <Tag at={{ x: LOCKED.center.x - 8, y: LOCKED.center.y }} shown={fade(t, gmail) * after} tone="alert">
        <span className="flex flex-col items-center gap-1">
          <Icono name="lock" size={18} strokeWidth={3} ancla={false} />
          <span>Gmail</span>
          <span>Archivos</span>
        </span>
      </Tag>
      <Tag at={{ x: LOCKED.center.x - 30, y: LOCKED.center.y + 74 }} shown={fade(t, ask) * after} tone="solid">
        Otro permiso
      </Tag>
    </>
  );
}

/** A label pinned to a point of the world, centered on it. */
function Tag({ at, shown, tone, children }: { at: { x: number; y: number }; shown: number; tone: "accent" | "alert" | "solid" | "light"; children: ReactNode }) {
  if (shown <= 0) return null;
  const tones = {
    accent: "bg-accent text-accent-ink",
    alert: "bg-red-600 text-white",
    solid: "bg-ink text-bg",
    light: "bg-white text-[#1A1208]",
  };
  return (
    <span
      className={`absolute whitespace-nowrap rounded-md px-2 py-1 text-center font-mono text-[17px] font-bold uppercase leading-none shadow-[0_4px_10px_rgba(0,0,0,0.35)] ${tones[tone]}`}
      style={{ left: at.x, top: at.y, opacity: shown, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * shown})` }}
    >
      {children}
    </span>
  );
}

/** A panel that floats in the world, like a sign of the game. */
function Panel({ x, y, w, shown, children }: { x: number; y: number; w: number; shown: number; children: ReactNode }) {
  if (shown <= 0) return null;
  return (
    <div
      className="absolute rounded-xl bg-[#FFFDF8] p-3 text-[#1A1208] shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
      style={{ left: x, top: y, width: w, opacity: shown, transform: `translateY(${(1 - shown) * 10}px) scale(${0.92 + 0.08 * shown})`, transformOrigin: "50% 100%" }}
    >
      {children}
    </div>
  );
}

function Reception() {
  const t = useT();
  const google = useStageCue("recepcion", "google");
  const typing = useStageCue("recepcion", "escribe");
  const checked = useStageCue("recepcion", "revisa");
  const sheet = useStageCue("permiso", "muestra");
  const nextScene = useStageCue("permiso", "antes");
  const items = [
    { name: "Nombre", at: useStageCue("permiso", "nombre") },
    { name: "Correo", at: useStageCue("permiso", "correo") },
    { name: "Foto", at: useStageCue("permiso", "foto") },
  ];
  const accept = useStageCue("permiso", "acepta");
  const sheetOut = useStageCue("tarjeta", "entonces");
  const dots = Math.round(interpolate(t, [typing, typing + 1.2], [0, 7], clamp));
  const ok = t >= checked;
  const stamp = spring({ frame: Math.max(0, (t - accept) * 30), fps: 30, config: { damping: 11, stiffness: 180 } });
  return (
    <>
      {/* The front desk's sign: the official logo, untouched, on its own white plate. */}
      <div className="absolute flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 shadow-[0_6px_14px_rgba(0,0,0,0.4)]" style={{ left: 196, top: 384, opacity: fade(t, google - 0.2) * (1 - fade(t, sheet - 0.3)) }}>
        <Logo slug="google" size={20} ancla={false} />
        <span className="text-[17px] font-bold leading-none text-[#1A1208]">Google</span>
      </div>
      {/* The password is typed here, at the reception, and only Google checks it. */}
      <Panel x={300} y={352} w={186} shown={fade(t, typing - 0.2) * (1 - fade(t, nextScene - 0.1, 0.25))}>
        <p className="font-mono text-[16px] font-bold uppercase leading-none text-[#5C5C5C]">Contraseña</p>
        <p className="mt-1.5 h-[22px] font-mono text-[24px] leading-none tracking-[0.1em]">{"•".repeat(dots)}</p>
        <p className="mt-2 flex items-center gap-1.5 whitespace-nowrap text-[17px] font-bold leading-none text-[#0F7A4A]" style={{ opacity: ok ? 1 : 0 }}>
          <Icono name="circle-check" size={18} strokeWidth={3} ancla={false} />
          La revisa Google
        </p>
      </Panel>
      {/* The consent sheet: what the app asks for. */}
      <Panel x={170} y={352} w={136} shown={fade(t, sheet) * (1 - fade(t, sheetOut, 0.3))}>
        <p className="flex items-center gap-1.5 whitespace-nowrap font-mono text-[13px] font-bold uppercase leading-none text-[#5C5C5C]">
          <Logo slug="google" size={13} ancla={false} />
          La app pide
        </p>
        {items.map((item) => {
          const on = spring({ frame: Math.max(0, (t - item.at) * 30), fps: 30, config: { damping: 10, stiffness: 200 } });
          return (
            <div key={item.name} className="mt-2 flex items-center gap-2">
              <span className="relative flex h-[20px] w-[20px] items-center justify-center rounded-[5px] border-2 border-[#1A1208]">
                <span className="absolute inset-0 flex items-center justify-center rounded-[3px] bg-accent" style={{ transform: `scale(${t >= item.at ? on : 0})` }}>
                  <Icono name="check" size={14} strokeWidth={4} ancla={false} className="text-accent-ink" />
                </span>
              </span>
              <span className="text-[17px] font-semibold leading-none">{item.name}</span>
            </div>
          );
        })}
        {t >= accept ? (
          <p
            className="mt-2.5 rounded-md bg-[#0F7A4A] px-2 py-1 text-center font-mono text-[14px] font-black uppercase leading-none text-white"
            style={{ transform: `scale(${2.2 - 1.2 * stamp}) rotate(${-6 * stamp}deg)`, opacity: Math.min(1, stamp * 2) }}
          >
            Aceptado
          </p>
        ) : null}
      </Panel>
    </>
  );
}

function Hotel() {
  const t = useT();
  return (
    <div className="absolute inset-0 text-ink">
      <Plate src="img/hotel-base.png" />
      <Doors />
      <Reception />
      <Diego />
      <WorldCard />
      {/* A slow vignette keeps the eye on the lit rooms. */}
      <div className="pointer-events-none absolute -inset-[200px] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(10,16,30,0.55))]" style={{ opacity: 0.6 + 0.1 * Math.sin(t) }} />
    </div>
  );
}

/* ---------- The scenes' layer: what goes over the world ---------- */

function useSpring(at: number, config = { damping: 13, stiffness: 160 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - Math.round(at * fps), fps, config });
}

/** Dims the world so the hero object reads; it fades in at `at`. */
function Dim({ at = 0, out }: { at?: number; out?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const o = fade(t, at, 0.35) * (out === undefined ? 1 : 1 - fade(t, out, 0.35));
  return <div className="pointer-events-none absolute -inset-[300px] bg-[#0E1626]" style={{ opacity: 0.62 * o }} />;
}

/**
 * The key card up close: the token. It comes in turning (rotateY) and
 * floats; `forged` adds the fake copy that the signature rejects.
 */
function HeroCard({
  enter,
  fields,
  password,
  seal,
  ring,
  voided,
  forged,
}: {
  enter?: number;
  fields?: number;
  password?: number;
  seal?: number;
  ring?: [number, number];
  voided?: number;
  forged?: [number, number];
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const inP = enter === undefined ? 1 : spring({ frame: frame - Math.round(enter * fps), fps, config: { damping: 12, stiffness: 120 } });
  const sealP = seal === undefined ? 0 : spring({ frame: frame - Math.round(seal * fps), fps, config: { damping: 9, stiffness: 220 } });
  const voidP = voided === undefined ? 0 : spring({ frame: frame - Math.round(voided * fps), fps, config: { damping: 9, stiffness: 220 } });
  const sealHit = seal !== undefined && t >= seal ? Math.max(0, 1 - (t - seal) * 4) : 0;
  const life = ring ? interpolate(t, ring, [1, 0.12], clamp) : 1;
  const tiltX = Math.sin(t * 1.3) * 4;
  const tiltY = Math.cos(t * 1.1) * 6 + (1 - inP) * -120;
  const dead = voided !== undefined && t >= voided;
  const forgedIn = forged ? fade(t, forged[0], 0.4) : 0;
  const forgedOut = forged ? fade(t, forged[1], 0.5) : 0;
  return (
    <div className="relative mx-auto h-[300px] w-[420px]" style={{ perspective: 900 }}>
      {forged && forgedIn > 0 ? (
        <div
          className="absolute left-[60px] top-[30px] h-[240px] w-[380px] rounded-[26px] border-[3px] border-dashed border-white/50 bg-[#5A6478]"
          style={{ opacity: forgedIn * (1 - forgedOut), transform: `translate(${(1 - forgedIn) * 120 + forgedOut * 40}px, ${forgedOut * 160}px) rotate(${6 + forgedOut * 18}deg)` }}
        >
          <p className="p-6 font-mono text-[22px] font-black uppercase text-white/70">Token</p>
          <span className="absolute right-6 top-6 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-red-600" style={{ transform: `scale(${forgedOut > 0 ? 1 : 0})` }}>
            <Icono name="x" size={36} strokeWidth={4} ancla={false} className="text-white" />
          </span>
        </div>
      ) : null}
      <div
        className="absolute left-0 top-0 h-[260px] w-[400px] overflow-hidden rounded-[26px] text-accent-ink shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
        style={{
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${0.7 + 0.3 * inP}) translateY(${sealHit * 8}px)`,
          opacity: Math.min(1, inP * 1.5),
          filter: dead ? `grayscale(${Math.min(1, voidP)})` : undefined,
          background: "linear-gradient(135deg, #FFB46E 0%, #FF8A3D 45%, #F26A1B 100%)",
        }}
      >
        <div className="absolute -left-[60px] -top-[120px] h-[260px] w-[520px] rotate-[-12deg] bg-white/15" />
        <div className="relative flex h-full flex-col p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-[38px] w-[50px] rounded-[8px] bg-gradient-to-br from-[#FFF1C9] to-[#E8B867] shadow-inner" />
              <span className="font-mono text-[26px] font-black uppercase tracking-wider">Token</span>
            </div>
            {ring ? (
              <svg width={52} height={52} viewBox="0 0 52 52" aria-hidden>
                <circle cx={26} cy={26} r={21} fill="none" stroke="currentColor" strokeOpacity={0.25} strokeWidth={6} />
                <circle cx={26} cy={26} r={21} fill="none" stroke="currentColor" strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={`${life} 1`} transform="rotate(-90 26 26)" />
              </svg>
            ) : null}
          </div>
          <p className="mt-4 font-display text-[50px] font-black leading-none" style={{ opacity: fields === undefined ? 1 : fade(t, fields) }}>
            Diego
          </p>
          {/* What it carries, as icons: name, email and photo (the meter already says how many). */}
          <div className="mt-3 flex gap-2.5" style={{ opacity: fields === undefined ? 1 : fade(t, fields + 0.3) }}>
            {["user-round", "mail", "image"].map((icon) => (
              <span key={icon} className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-[#1A1208]/15">
                <Icono name={icon} size={24} strokeWidth={2.5} ancla={false} />
              </span>
            ))}
          </div>
          {password !== undefined ? (
            <p className="mt-auto flex items-center gap-2 font-mono text-[22px] font-bold uppercase leading-none" style={{ opacity: fade(t, password) }}>
              <Icono name="circle-x" size={24} strokeWidth={3} ancla={false} />
              <span className="relative">
                contraseña
                <span className="absolute left-0 top-1/2 h-[3px] bg-current" style={{ width: `${100 * fade(t, password + 0.2, 0.4)}%` }} />
              </span>
            </p>
          ) : null}
        </div>
      </div>
      {seal !== undefined && t >= seal ? (
        // The seal sits next to the card's text, never over the logo: the logo has its own white disc.
        <div
          className="absolute -right-[4px] top-[150px] flex h-[120px] w-[120px] items-center justify-center rounded-full border-[6px] border-[#0F7A4A] bg-white shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
          style={{ transform: `scale(${2.4 - 1.4 * sealP}) rotate(${-14 * sealP}deg)`, opacity: Math.min(1, sealP * 2) }}
        >
          <Logo slug="google" size={56} ancla={false} />
        </div>
      ) : null}
      {dead ? (
        <span
          className="absolute left-[200px] top-[120px] whitespace-nowrap rounded-lg border-[6px] border-red-600 bg-white/95 px-4 py-1 font-mono text-[40px] font-black uppercase text-red-600"
          style={{ transform: `translate(-50%, -50%) scale(${2.4 - 1.4 * voidP}) rotate(${-12 * voidP}deg)`, opacity: Math.min(1, voidP * 2) }}
        >
          Anulada
        </span>
      ) : null}
    </div>
  );
}

function Hook() {
  const tap = useCue("toca");
  const phoneIn = useSpring(tap - 0.4);
  const t = useCurrentFrame() / useVideoConfig().fps;
  const pressed = t >= tap + 0.25 && t < tap + 0.55;
  const ripple = fade(t, tap + 0.25, 0.5);
  const word = useSpring(0, { damping: 12, stiffness: 140 });
  return (
    <div className="relative flex h-full flex-col">
      <p className="font-display text-[54px] font-black leading-[0.98] tracking-tight text-ink drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" style={{ transform: `scale(${1.04 - 0.04 * word})`, transformOrigin: "0 0" }}>
        Tu app tiene una <span className="text-accent">tarjeta</span>
      </p>
      {t >= tap - 0.4 ? <div className="absolute bottom-[10px] right-0" style={{ transform: `translateY(${(1 - phoneIn) * 420}px) rotate(${4 - 4 * phoneIn}deg)` }}>
        <Phone width={190}>
          <div className="px-2 pt-4">
            <p className="text-[24px] font-black">Recetas</p>
            <p className="text-[13px] text-[#5C5C5C]">App de ejemplo</p>
            <div className={`relative mt-10 flex items-center gap-2 overflow-hidden rounded-full border-2 border-[#16181C]/20 px-3 py-2.5 ${pressed ? "scale-95 bg-[#EEF2F7]" : ""}`}>
              <Logo slug="google" size={18} ancla={false} />
              <span className="text-[13px] font-semibold leading-tight">Continuar con Google</span>
              {t >= tap + 0.25 ? <span className="absolute left-1/2 top-1/2 h-[160px] w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4285F4]/20" style={{ transform: `translate(-50%, -50%) scale(${ripple})`, opacity: 1 - ripple }} /> : null}
            </div>
          </div>
        </Phone>
      </div> : null}
    </div>
  );
}

function CardScene() {
  const enter = useCue("tarjeta");
  return (
    <div className="relative flex h-full flex-col justify-end pb-6">
      <Dim at={enter - 0.2} />
      <HeroCard enter={enter} fields={useCue("dice")} password={useCue("contraseña")} />
    </div>
  );
}

function SealScene() {
  const checks = [
    { name: "Firma", at: useCue("firma") },
    { name: "Emisor", at: useCue("emitió") },
    { name: "Destino", at: useCue("ella") },
    { name: "Vigencia", at: useCue("vencido") },
  ];
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <div className="relative flex h-full flex-col justify-center gap-6">
      <Dim />
      <HeroCard forged={[useCue("falsifica") - 0.2, useCue("firmada")]} seal={useCue("firmada")} />
      <div className="relative flex flex-col gap-2.5 px-2">
        {checks.map((c) => {
          const on = fade(t, c.at, 0.25);
          return (
            <div key={c.name} className="flex items-center gap-3" style={{ opacity: 0.25 + 0.75 * on, transform: `translateX(${(1 - on) * -16}px)` }}>
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full" style={{ background: on > 0.5 ? "#16A34A" : "rgba(246,241,231,0.15)" }}>
                <Icono name="check" size={22} strokeWidth={3.5} ancla={false} className="text-white" />
              </span>
              <span className="text-[27px] font-bold leading-none text-ink">{c.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExpireScene() {
  const account = useCue("cuenta");
  const t = useCurrentFrame() / useVideoConfig().fps;
  const bar = useSpring(account);
  return (
    <div className="relative flex h-full flex-col justify-center gap-8">
      <Dim />
      <HeroCard ring={[useCue("vence"), useCue("limitado") + 0.8]} voided={useCue("anula")} />
      <div style={{ opacity: t >= account ? 1 : 0, transform: `translateY(${(1 - bar) * 40}px)` }}>
        <BrowserBar domain="myaccount.google.com" path="/linkedapps" />
      </div>
    </div>
  );
}

function Close() {
  const three = useSpring(0, { damping: 11, stiffness: 150 });
  const zero = useSpring(useCue("cero"), { damping: 9, stiffness: 170 });
  const cta = useSpring(useCue("revisa"));
  const t = useCurrentFrame() / useVideoConfig().fps;
  // The numbers make room for the call to action: one message at a time.
  const out = fade(t, useCue("revisa") - 0.3, 0.3);
  return (
    <div className="relative flex h-full flex-col">
      <div className="flex items-end justify-center gap-10 rounded-2xl bg-[#0E1626]/80 px-5 py-4" style={{ opacity: 1 - out, transform: `translateY(${-30 * out}px)` }}>
        <div style={{ transform: `scale(${three})` }}>
          <p className="font-display text-[120px] font-black leading-[0.85] text-ink">3</p>
          <p className="font-mono text-[24px] font-bold uppercase text-ink">datos</p>
        </div>
        <div style={{ transform: `scale(${zero})`, opacity: zero }}>
          <p className="font-display text-[120px] font-black leading-[0.85] text-accent">0</p>
          <p className="font-mono text-[24px] font-bold uppercase text-accent">contraseñas</p>
        </div>
      </div>
      <p className="mt-auto rounded-xl bg-accent px-4 py-2.5 text-center font-display text-[30px] font-black text-accent-ink" style={{ transform: `translateY(${(1 - cta) * 80}px)`, opacity: cta }}>
        Revisa tus apps vinculadas
      </p>
    </div>
  );
}

export default defineVideo({
  captions: "pill",
  chapters: true,
  music: { file: "audio/cama.mp3", volume: 0.12 },
  stage: { World: Hotel, width: W, height: H, spots },
  meter: {
    kind: "slots",
    start: 0,
    max: 3,
    steps: [
      { scene: "permiso", word: "nombre", value: 1 },
      { scene: "permiso", word: "correo", value: 2 },
      { scene: "permiso", word: "foto", value: 3 },
    ],
  },
  scenes: [
    { id: "gancho", chapter: "El botón", camera: { focus: "acera" }, Visual: Hook },
    { id: "recepcion", chapter: "Recepción", camera: { focus: "recepcion" }, sfx: [{ asset: "whoosh", at: "manda", volume: 0.3 }] },
    { id: "permiso", chapter: "Permiso", camera: { focus: "mostrador" } },
    { id: "tarjeta", chapter: "La tarjeta", camera: { focus: "viaje" }, sfx: [{ asset: "whoosh", at: "token", volume: 0.3 }], Visual: CardScene },
    { id: "firma", chapter: "La firma", camera: { focus: "entrada" }, Visual: SealScene },
    { id: "puertas", chapter: "Las puertas", camera: { focus: "pasillo" }, sfx: [{ asset: "whoosh", at: "tarjeta", volume: 0.25 }] },
    { id: "vence", chapter: "Vence", camera: { focus: "acera" }, Visual: ExpireScene },
    { id: "cierre", chapter: "Cierre", camera: { focus: "final" }, Visual: Close },
  ],
});
