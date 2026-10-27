import type { ReactNode } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Icono, Logo } from "@motor/ui";
import { defineVideo, Phone, PillTitle, Pop, Sfx, useCue } from "@motor/video";

// Replica (github.com/Jakeschincariol/replica-skill, MIT), con los datos de facts.json. La app
// de citas (CitasYa) y su precio son inventados, y las quejas salen del ejemplo del README.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

function useT() {
  return useCurrentFrame() / useVideoConfig().fps;
}

const fade = (t: number, at: number, dur = 0.3) => interpolate(t, [at, at + dur], [0, 1], clamp);

/** A spring from `at` seconds of the scene. */
function useSpring(at: number, damping = 12) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - Math.round(at * fps), fps, config: { damping, stiffness: 170 } });
}

/** The made-up booking app, CitasYa: header, a month and three time slots. */
function CitasApp({ mine = false, bugs = 0, fixed = 0 }: { mine?: boolean; bugs?: number; fixed?: number }) {
  const days = Array.from({ length: 14 }, (_, i) => i + 8);
  const bugAt = [
    { left: 44, top: 96 },
    { left: 118, top: 150 },
    { left: 70, top: 222 },
  ];
  return (
    <div className="relative px-1 pb-3">
      <div className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${mine ? "bg-[#8FA8FF] text-[#0E1220]" : "bg-[#2B3550] text-white"}`}>
        <Icono name="calendar-days" size={16} strokeWidth={2.5} ancla={false} />
        <span className="text-[15px] font-black">{mine ? "Tu versión" : "CitasYa"}</span>
      </div>
      <p className="mt-2 text-[14px] font-bold">Reserva tu cita</p>
      <div className="mt-1.5 grid grid-cols-7 gap-1">
        {days.map((d) => (
          <span key={d} className={`flex h-[22px] items-center justify-center rounded text-[12px] font-semibold ${d === 16 ? (mine ? "bg-[#8FA8FF] text-[#0E1220]" : "bg-[#2B3550] text-white") : "bg-black/5"}`}>
            {d}
          </span>
        ))}
      </div>
      {["10:00", "11:30", "17:00"].map((h, i) => (
        <div key={h} className={`mt-1.5 rounded-md border px-2 py-1 text-[13px] font-semibold ${i === 1 ? "border-[#8FA8FF] bg-[#8FA8FF]/15" : "border-black/10"}`}>
          {h}
        </div>
      ))}
      {bugAt.slice(0, bugs).map((p, i) => (
        <span key={i} className="absolute flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#E5534B] text-white shadow-md" style={{ left: p.left, top: p.top }}>
          <Icono name={i < fixed ? "check" : "bug"} size={15} strokeWidth={2.75} ancla={false} />
        </span>
      ))}
    </div>
  );
}

function Center({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`relative flex h-full flex-col items-center justify-center gap-5 pb-[150px] ${className ?? ""}`}>{children}</div>;
}

function Hook() {
  const t = useT();
  const clone = useCue("clona");
  const better = useCue("mejora");
  const mine = useSpring(clone - 0.1);
  const tag = useSpring(better);
  return (
    <Center>
      {/* Readable from frame 1: it is the hook and the cover. */}
      <PillTitle at={-1}>¿Pagas esta app?</PillTitle>
      <div className="relative mt-2 h-[470px] w-full">
        <div className="absolute left-[40px] top-0" style={{ transform: `perspective(900px) rotateY(${18 + Math.sin(t * 1.6) * 6}deg) rotateZ(${-4 + Math.sin(t * 1.1) * 2}deg) translateY(${Math.sin(t * 2) * 8}px) translateX(${-40 * mine}px)`, opacity: 1 - 0.35 * mine }}>
          <Phone width={210}>
            <CitasApp />
          </Phone>
          <span className="absolute -right-[18px] top-[30px] rounded-xl bg-[#E5534B] px-3 py-1.5 font-display text-[26px] font-black text-white shadow-lg" style={{ transform: `rotate(8deg) scale(${1 + 0.06 * Math.sin(t * 5)})` }}>$12/mes</span>
        </div>
        {t >= clone - 0.1 ? (
          <div className="absolute right-[24px] top-[40px]" style={{ transform: `perspective(900px) rotateY(-14deg) translateX(${(1 - mine) * 260}px) scale(${0.9 + 0.1 * mine})` }}>
            <Sfx id="whip" at={clone - 0.1} />
            <Phone width={220}>
              <CitasApp mine />
            </Phone>
            <span className="absolute -left-[26px] -top-[14px] rounded-xl bg-accent px-3 py-1.5 font-display text-[24px] font-black text-accent-ink shadow-lg" style={{ transform: `scale(${tag})` }}>
              La tuya
            </span>
          </div>
        ) : null}
      </div>
    </Center>
  );
}

const SKILLS = ["recon", "architect", "design", "build", "backend", "test", "diff", "entrepreneur", "brand", "launch", "deploy"];

function Replica() {
  const t = useT();
  const start = useCue("son");
  const mit = useCue("mit");
  return (
    <Center>
      <PillTitle tone="dark">11 skills</PillTitle>
      <div data-ui="" className="grid w-full grid-cols-2 gap-2.5 px-6">
        {SKILLS.map((s, i) => {
          const at = start + i * 0.18;
          return (
            <Pop key={s} at={at} sound={i % 2 ? "click" : "pop"}>
              <span className={`flex items-center gap-2 rounded-xl px-3 py-2.5 font-mono text-[22px] font-bold ${s === "entrepreneur" ? "bg-accent text-accent-ink" : "bg-[#12141A] text-[#F2F1EC]"}`}>
                <span className="opacity-60">/</span>
                {s}
              </span>
            </Pop>
          );
        })}
        <div style={{ opacity: fade(t, mit) }} className="flex items-center justify-center rounded-xl border-2 border-dashed border-current px-3 py-2.5 text-[22px] font-black">
          Gratis · MIT
        </div>
      </div>
    </Center>
  );
}

function Layers({ split }: { split: number }) {
  const layers: Array<[string, string]> = [
    ["layout-grid", "Pantallas"],
    ["git-branch", "Flujos"],
  ];
  return (
    <div className="relative h-[430px] w-[320px]" style={{ perspective: 1000 }}>
      <div className="absolute inset-0" style={{ transform: `rotateX(52deg) rotateZ(-28deg)`, transformStyle: "preserve-3d" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            data-ui="" className="absolute left-[40px] top-[40px] h-[300px] w-[200px] rounded-[26px] border-[5px] border-[#1B1B1D] bg-white shadow-xl"
            style={{ transform: `translateZ(${i * 90 * split}px)`, opacity: i === 0 ? 1 : split }}
          >
            {i === 0 ? <CitasApp /> : null}
          </div>
        ))}
      </div>
      {layers.map(([icon, label], i) => (
        <span key={label} className="absolute flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-[24px] font-black text-accent-ink shadow-lg" style={{ right: 0, top: 70 + i * 120, opacity: split, transform: `translateX(${(1 - split) * 40}px)` }}>
          <Icono name={icon} size={22} strokeWidth={2.75} ancla={false} />
          {label}
        </span>
      ))}
    </div>
  );
}

function Desmonta() {
  const split = useSpring(useCue("desmonta"), 14);
  return (
    <Center>
      <PillTitle>1 · Desmonta</PillTitle>
      <Layers split={split} />
    </Center>
  );
}

function Monta() {
  const t = useT();
  const start = useCue("reconstruye");
  const parts = 6;
  const shown = Math.min(parts, Math.floor(interpolate(t, [start, start + 2.2], [0, parts], clamp)));
  return (
    <Center>
      <PillTitle>2 · Monta</PillTitle>
      <div className="relative">
        <Phone width={250}>
          <div className="relative">
            <div style={{ clipPath: `inset(0 0 ${100 - (shown / parts) * 100}% 0)` }}>
              <CitasApp mine />
            </div>
          </div>
        </Phone>
        {Array.from({ length: shown }, (_, i) => (
          <Sfx key={i} id="click" at={start + (i + 1) * (2.2 / parts)} volume={0.15} />
        ))}
        <span className="absolute -right-[60px] bottom-[40px] rounded-xl bg-[#12141A] px-3 py-2 font-mono text-[22px] font-bold text-[#F2F1EC]">
          {shown}/{parts} piezas
        </span>
      </div>
    </Center>
  );
}

function Prueba() {
  const t = useT();
  const errors = useCue("errores");
  const score = useCue("nota");
  const bugs = Math.min(3, Math.floor(interpolate(t, [errors - 0.6, errors + 0.6], [0, 3], clamp)));
  const fixed = Math.min(3, Math.floor(interpolate(t, [errors + 1, errors + 2.2], [0, 3], clamp)));
  const n = Math.round(interpolate(t, [score, score + 1.2], [0, 86], clamp));
  return (
    <Center>
      <PillTitle>3 · Prueba</PillTitle>
      <div className="relative flex items-start gap-4">
        <Phone width={235}>
          <CitasApp mine bugs={bugs} fixed={fixed} />
        </Phone>
        {Array.from({ length: bugs }, (_, i) => (
          <Sfx key={i} id="blip" at={errors - 0.6 + (i + 1) * 0.4} />
        ))}
        <div className="mt-16 flex flex-col items-center rounded-2xl bg-[#12141A] px-4 py-3 text-[#F2F1EC]" style={{ opacity: fade(t, score) }}>
          <span className="font-mono text-[22px] font-bold uppercase text-accent">Paridad</span>
          <span className="font-display text-[64px] font-black tabular-nums leading-none">{n}</span>
          <span className="font-mono text-[22px] text-[#A4A9B8]">ejemplo</span>
        </div>
      </div>
    </Center>
  );
}

const REVIEWS: Array<[string, string]> = [
  ["Sube el precio por usuario", "Precio fijo"],
  ["No avisa por SMS", "Recordatorio por SMS"],
  ["Confunde las zonas horarias", "Confirma la zona horaria"],
];

function Emprendedor() {
  const t = useT();
  const reviews = useCue("reseñas");
  const fix = useCue("arregla");
  return (
    <Center className="items-stretch">
      <PillTitle tone="dark">Lee las reseñas</PillTitle>
      <div className="flex flex-col gap-3 pl-4 pr-4">
        {REVIEWS.map(([bad, good], i) => {
          const fixedNow = t >= fix + i * 0.35;
          return (
            <div key={bad} style={{ opacity: fade(t, reviews + i * 0.3, 0.25), transform: `translateX(${(1 - fade(t, reviews + i * 0.3, 0.25)) * -30}px)` }}>
              <Sfx id="pop" at={reviews + i * 0.3} />
              <div className={`rounded-2xl px-4 py-3 shadow-md ${fixedNow ? "bg-[#DDF5E4] text-[#0E3A1C]" : "bg-white text-[#12141A]"}`}>
                {fixedNow ? <Sfx id="switch" at={fix + i * 0.35} /> : null}
                <p className="text-[22px] tracking-[2px]" style={{ color: fixedNow ? "#1E8E4A" : "#E5534B" }}>
                  {fixedNow ? "✓ arreglado" : "★☆☆☆☆"}
                </p>
                <p className="text-[24px] font-bold leading-tight">{fixedNow ? good : bad}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[22px] font-semibold opacity-70">Quejas del ejemplo del README</p>
    </Center>
  );
}

function Ojo() {
  const t = useT();
  const has = useCue("tiene");
  return (
    <Center className="items-stretch">
      <p className="self-end pr-2 font-display text-[110px] font-black leading-none tracking-tight">OJO</p>
      <div className="mt-24 grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <span className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1E8E4A] px-3 py-2 text-[22px] font-black text-white">
            <Icono name="check" size={20} strokeWidth={3} ancla={false} />
            Lo que hace
          </span>
          {["Reservar", "Calendario", "Recordatorios"].map((x) => (
            <span key={x} className="rounded-xl bg-white px-3 py-2 text-[22px] font-bold text-[#12141A]">
              {x}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-2" style={{ opacity: fade(t, has) }}>
          <span className="flex items-center justify-center gap-1.5 rounded-xl bg-[#E5534B] px-3 py-2 text-[22px] font-black text-white">
            <Icono name="x" size={20} strokeWidth={3} ancla={false} />
            Lo que tiene
          </span>
          {["Su código", "Su logo"].map((x) => (
            <span key={x} className="rounded-xl bg-white px-3 py-2 text-[22px] font-bold text-[#12141A] line-through decoration-[#E5534B] decoration-[3px]">
              {x}
            </span>
          ))}
        </div>
      </div>
    </Center>
  );
}

function Gratis() {
  const t = useT();
  const stars = useCue("estrellas");
  const n = Math.round(interpolate(t, [stars - 0.6, stars + 0.8], [0, 5270], clamp));
  const sparkle = [
    [-150, -60],
    [140, -90],
    [-120, 120],
    [160, 90],
    [0, -150],
  ];
  return (
    <Center>
      <PillTitle>Código abierto</PillTitle>
      <p className="-mt-2 font-mono text-[24px] font-bold uppercase">Gratis · MIT</p>
      <div className="relative mt-8 flex flex-col items-center">
        {sparkle.map(([x, y], i) => (
          <span key={i} className="absolute text-[34px]" style={{ left: `calc(50% + ${x}px)`, top: 110 + y, opacity: fade(t, stars - 0.6 + i * 0.12), transform: `rotate(${t * 40 + i * 30}deg)` }}>
            ⭐
          </span>
        ))}
        <Logo slug="github" size={150} chip ancla />
        <p className="mt-6 font-display text-[84px] font-black tabular-nums leading-none text-accent">+{n.toLocaleString("es-MX")}</p>
        <p className="font-mono text-[22px] font-bold uppercase">estrellas · 24-10-2026</p>
        <Sfx id="moneda" at={stars + 0.6} />
      </div>
    </Center>
  );
}

function Instala() {
  const t = useT();
  const start = useCue("instala");
  const warn = useCue("léela");
  const line = "github.com/Jakeschincariol/replica-skill\ninstall skill";
  const typed = Math.round(interpolate(t, [start, start + 1.8], [0, line.length], clamp));
  return (
    <Center className="items-stretch">
      <PillTitle tone="dark">Así se instala</PillTitle>
      <div className="overflow-hidden rounded-2xl bg-white text-[#12141A] shadow-xl">
        <div className="flex items-center gap-2 border-b border-black/10 px-4 py-2.5">
          <i className="block h-3 w-3 rounded-full bg-[#FF5F57]" />
          <i className="block h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <i className="block h-3 w-3 rounded-full bg-[#28C840]" />
          <span className="ml-auto flex items-center gap-1.5 text-[22px] font-bold">
            <Logo slug="claude" size={20} ancla={false} />
            Claude
          </span>
        </div>
        <p className="min-h-[120px] whitespace-pre-wrap break-all px-5 py-4 font-mono text-[23px] font-semibold leading-snug">
          {line.slice(0, typed)}
          <span className="inline-block h-[24px] w-[11px] translate-y-[4px] bg-[#12141A]" style={{ opacity: Math.sin(t * 8) > 0 ? 1 : 0 }} />
        </p>
      </div>
      {t >= start ? <Sfx id="click" at={start} /> : null}
      <Pop at={warn} sound="golpe" className="ml-4 self-start">
        <span className="flex items-center gap-2 rounded-xl bg-[#FFD84D] px-4 py-2.5 text-[24px] font-black text-[#12141A]">
          <Icono name="triangle-alert" size={24} strokeWidth={2.75} ancla={false} />
          Léela antes: trae código
        </span>
      </Pop>
    </Center>
  );
}

function Cierre() {
  const save = useCue("guárdalo");
  return (
    <Center className="items-stretch">
      <div className="flex flex-col">
        <p className="font-display text-[34px] font-black leading-none">Jeremy Ayza</p>
        <p className="font-mono text-[22px] font-bold text-accent">@jacket.dev</p>
      </div>
      <div className="rounded-2xl bg-white p-4 text-[#12141A] shadow-xl">
        <p className="text-[24px] font-black">Replica · el enlace está en el post</p>
        <p className="mt-1 break-all font-mono text-[22px] font-semibold text-[#3B4AA8]">github.com/Jakeschincariol/replica-skill</p>
      </div>
      <Pop at={save}>
        <span className="flex items-center justify-center gap-3 rounded-2xl bg-accent px-4 py-3 font-display text-[34px] font-black text-accent-ink">
          <Icono name="bookmark" size={34} strokeWidth={2.75} ancla={false} />
          Guárdalo
        </span>
      </Pop>
    </Center>
  );
}

export default defineVideo({
  captions: "none",
  frame: { tab: false, dots: false },
  music: { file: "audio/cama.mp3" },
  meter: { kind: "counter", start: 0, steps: [{ scene: "replica", word: "once", value: 11 }] },
  avatar: {
    // No captions here: the avatar stands lower, on the footer, and the scenes keep clear of it.
    size: 190,
    top: 724,
  },
  scenes: [
    { id: "gancho", background: "grid", Visual: Hook },
    { id: "replica", tone: "invert", background: "grid", transition: "zoom", Visual: Replica },
    { id: "desmonta", background: "grid", transition: "whip", Visual: Desmonta },
    { id: "monta", tone: "surface", background: "grid", transition: "slide", Visual: Monta },
    { id: "prueba", background: "grid", transition: "blur", Visual: Prueba },
    { id: "emprendedor", tone: "invert", background: "grid", transition: "zoom", Visual: Emprendedor },
    { id: "ojo", tone: "accent", background: "stripes", transition: "whip", Visual: Ojo },
    { id: "gratis", transition: "zoom", Visual: Gratis },
    { id: "instala", tone: "invert", background: "grid", transition: "slide", Visual: Instala },
    { id: "cierre", background: "grid", transition: "blur", Visual: Cierre },
  ],
});
