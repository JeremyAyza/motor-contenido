import type { CSSProperties, ReactNode } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Icono, Logo } from "@motor/ui";
import { defineVideo, Sfx, useCue, usePop, useStage, useStageCue } from "@motor/video";

// Un fichero de madera con un cajón por sistema de archivos, del color de su sistema
// operativo, sobre un SSD que por dentro es una grilla de bloques (video.json → world).
// vacaciones.mp4, sus bloques, el diario, las sumas y los diálogos son ilustrativos
// (facts.json → illustrative); las cifras y las capacidades salen de facts.json.

const W = 540;
const SEC = 960;
const Y = { hall: 0, disco: 960, ntfs: 1920, apfs: 2880, linux: 3840, sums: 4800, fat: 5760, usb: 6720, end: 7680 };
const H = 8640;
// The camera puts its focus at y 427 of the frame (between the tab and the captions):
// aiming at section + 427 draws each section 1:1 on the frame.
const VIEW_Y = 427;
const shot = (y: number, zoom = 1) => ({ focus: { x: W / 2, y: y + VIEW_Y }, zoom });

const OS = { win: "#4F7CF7", mac: "#B68CF0", linux: "#D6BE55", all: "#3FA596" };
const DARK = "#141720";
const ACCENT = "#C4F25A";
const SLATE = { top: "#343B4D", front: "#262B38", side: "#1C2029", edge: "#3E465A" };
const LINE = "rgba(8,10,14,0.45)";
const CREAM = "#F3EDE2";
const PAPER = "#F7F0E2";
const RED = "#E5534B";
const OK = "#3FB37F";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (t: number, at: number, dur = 0.3) => interpolate(t, [at, at + dur], [0, 1], clamp);
const ramp = (t: number, a: number, b: number) => interpolate(t, [a, Math.max(a + 0.01, b)], [0, 1], clamp);
const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const bitAt = (i: number) => (((Math.imul(i + 7, 2654435761) >>> 0) >> 7) % 5 < 2 ? 1 : 0);

function useT() {
  return useStage().ms / 1000;
}

/* ---------- Building blocks ---------- */

/** A screen-sized part of the world, drawn only while the camera sees it. */
function Section({ y, children }: { y: number; children: ReactNode }) {
  const { camera } = useStage();
  const top = camera.y - VIEW_Y / camera.zoom;
  const bottom = camera.y + (SEC - VIEW_Y) / camera.zoom;
  if (bottom <= y + 1 || top >= y + SEC - 1) return null;
  return (
    <At x={0} y={y} w={W} h={SEC}>
      {children}
    </At>
  );
}

function At({ x, y, w, h, style, className, children }: { x: number; y: number; w?: number; h?: number; style?: CSSProperties; className?: string; children?: ReactNode }) {
  return (
    <div className={`absolute ${className ?? ""}`} style={{ left: x, top: y, width: w, height: h, ...style }}>
      {children}
    </div>
  );
}

/** Pops in at `at` with a spring and leaves at `until`. */
function Appear({ at, until, x, y, w, h, sound, children, className }: { at: number; until?: number; x: number; y: number; w?: number; h?: number; sound?: string; children: ReactNode; className?: string }) {
  const t = useT();
  const p = usePop(at);
  const out = until === undefined ? 0 : fade(t, until, 0.3);
  if (t < at || out >= 1) return null;
  return (
    <At x={x} y={y} w={w} h={h} className={className} style={{ opacity: Math.min(1, p * 1.6) * (1 - out), transform: `translateY(${(1 - Math.min(1, p)) * 16}px) scale(${0.9 + 0.1 * p})`, transformOrigin: "50% 60%" }}>
      {sound ? <Sfx id={sound} at={at} volume={0.35} /> : null}
      {children}
    </At>
  );
}

/** A rubber stamp that slams in. */
function Stamp({ at, x, y, tone = "accent", rotate = -7, children, size = 22 }: { at: number; x: number; y: number; tone?: "accent" | "alert" | "ok" | "ink"; rotate?: number; children: ReactNode; size?: number }) {
  const t = useT();
  if (t < at) return null;
  const p = interpolate(t, [at, at + 0.16], [1.7, 1], clamp);
  const color = { accent: ACCENT, alert: RED, ok: OS.all, ink: CREAM }[tone];
  return (
    <At x={x} y={y} style={{ transform: `translate(-50%, -50%) rotate(${rotate * 0.4}deg) scale(${p})`, opacity: fade(t, at, 0.08) }}>
      <Sfx id="golpe" at={at} volume={0.4} />
      <div className="whitespace-nowrap rounded-full px-4 py-1.5 text-center font-mono font-black uppercase leading-[1.05] shadow-[0_10px_24px_rgba(0,0,0,0.4)]" style={{ color: tone === "ink" ? "#1B1F2A" : "#0E1118", background: color, fontSize: size }}>
        {children}
      </div>
    </At>
  );
}

/** A short sign of the world (1 to 3 words): it does not count as text to read. */
function Tag({ at, x, y, tone = "solid", children, until }: { at: number; x: number; y: number; tone?: "solid" | "accent" | "alert" | "ok" | "line"; children: ReactNode; until?: number }) {
  const tones = {
    solid: "bg-[#F3EDE2] text-[#1B1F2A]",
    accent: "bg-accent text-accent-ink",
    alert: "bg-[#E5534B] text-white",
    ok: "bg-[#3FA596] text-[#0E1118]",
    line: "bg-[#141720] text-ink ring-2 ring-white/25",
  };
  return (
    <Appear at={at} until={until} x={x} y={y} sound="blip">
      <span className={`block whitespace-nowrap rounded-md px-2.5 py-1 font-mono text-[17px] font-bold uppercase leading-none ${tones[tone]}`}>{children}</span>
    </Appear>
  );
}

/** Big words of the moment, cream with a hard shadow, as in the reference. */
function BigWord({ children, size = 56, className }: { children: ReactNode; size?: number; className?: string }) {
  return (
    <p className={`font-display font-black leading-[0.95] tracking-tight text-ink ${className ?? ""}`} style={{ fontSize: size }}>
      {children}
    </p>
  );
}

/** The front of a drawer: its OS color, a label plate and a handle; papers stick out when open. */
function Drawer({ label, color, w, h, lit = 1, open = 0, shown = 1 }: { label: string; color: string; w: number; h: number; lit?: number; open?: number; shown?: number }) {
  return (
    <div className="relative" style={{ width: w, height: h, transform: `translateY(${open * 10}px) scale(${1 + open * 0.06})`, transformOrigin: "50% 100%" }}>
      {open > 0 ? (
        <div className="absolute left-[10%] right-[10%] flex gap-[3px]" style={{ top: -12 * open, height: 16 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-full flex-1 rounded-t-[2px] border border-[#0E1118]/40" style={{ background: PAPER, opacity: open }} />
          ))}
        </div>
      ) : null}
      <div className="absolute inset-0 overflow-hidden rounded-[7px] border-2" style={{ borderColor: LINE, background: "#3A3428" }}>
        <div className="absolute inset-0" style={{ background: color, opacity: lit }} />
        <div
          className="absolute left-[9%] top-[14%] whitespace-nowrap rounded-[5px] bg-[#0E1118]/80 px-1.5 py-[1px] font-mono font-bold leading-[1.25] text-[#F3EDE2]"
          style={{ fontSize: Math.min(17, h * 0.23), opacity: shown }}
        >
          {shown > 0 ? label : " "}
        </div>
        <div className="absolute bottom-[18%] left-1/2 h-[6px] w-[34%] -translate-x-1/2 rounded-full bg-[#0E1118]/55" />
      </div>
    </div>
  );
}

/** A colored square with an OS mark: a generic icon, or the official logo. */
function Mark({ color, size = 44, icon, logo }: { color: string; size?: number; icon?: string; logo?: string }) {
  return (
    <div className="flex shrink-0 items-center justify-center rounded-[10px] border-2" style={{ width: size, height: size, background: color, borderColor: LINE }}>
      {logo ? <Logo slug={logo} size={size * 0.5} ancla={false} /> : <Icono name={icon ?? "circle"} size={size * 0.56} strokeWidth={2.5} ancla={false} className="text-white" />}
    </div>
  );
}

/** A grid of blocks with their bits; `paint` colors each block on the clock. */
function Blocks({ x, y, cols, rows, cell = 22, gap = 1, paint, digits = true }: { x: number; y: number; cols: number; rows: number; cell?: number; gap?: number; paint?: (i: number) => string | undefined; digits?: boolean }) {
  return (
    <At x={x} y={y} w={cols * (cell + gap)} h={rows * (cell + gap)}>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gap }}>
        {Array.from({ length: cols * rows }, (_, i) => {
          const bg = paint?.(i);
          return (
            <div key={i} className="flex items-center justify-center rounded-[3px] font-mono font-bold" style={{ width: cell, height: cell, background: bg ?? CREAM, color: bg ? "#1B1F2A" : "#6B6457", fontSize: 13 }}>
              {digits ? bitAt(i) : ""}
            </div>
          );
        })}
      </div>
    </At>
  );
}

/** A folder card: dashed until it fills with its icon at `at`. */
function Folder({ x, y, w, h, label, icon, color, at, note }: { x: number; y: number; w: number; h: number; label: string; icon: string; color: string; at: number; note?: string }) {
  const t = useT();
  const p = usePop(at);
  const on = t >= at;
  return (
    <At x={x} y={y} w={w} h={h}>
      {on ? <Sfx id="click" at={at} volume={0.3} /> : null}
      <div className="absolute left-0 top-0 rounded-t-[8px] px-2.5 pt-1 font-mono text-[14px] font-bold uppercase leading-[1.4]" style={{ background: on ? color : "transparent", color: on ? "#0E1118" : "#9AA1B2", border: on ? "none" : "2px dashed #4A5164", borderBottom: "none" }}>
        {label}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center gap-1 rounded-b-[10px] rounded-tr-[10px]" style={{ top: 24, background: on ? color : "transparent", border: on ? `3px solid ${LINE}` : "2px dashed #4A5164" }}>
        {on ? (
          <div className="flex flex-col items-center" style={{ transform: `scale(${0.6 + 0.4 * p})` }}>
            <Icono name={icon} size={42} strokeWidth={2.2} ancla={false} className="text-[#0E1118]" />
            {note ? <span className="mt-1 font-mono text-[15px] font-bold text-[#0E1118]">{note}</span> : null}
          </div>
        ) : null}
      </div>
    </At>
  );
}

/** A row of drawers on top of an OS section: they light one by one, the active one comes out. */
function DrawerRow({ items, y = 140, light, pull }: { items: Array<{ label: string; color: string }>; y?: number; light: number; pull: Array<number | undefined> }) {
  const t = useT();
  const gap = 14;
  const w = (W - 80 - gap * (items.length - 1)) / items.length;
  const pulled = pull.some((at) => at !== undefined && t >= at);
  return (
    <At x={40} y={y} w={W - 80} h={96}>
      <div className="absolute inset-x-[-10px] top-[-12px] bottom-[-10px] rounded-[10px] border-2" style={{ background: SLATE.front, borderColor: SLATE.edge, boxShadow: `inset 0 3px 0 ${ACCENT}` }} />
      <div className="absolute inset-0 flex" style={{ gap }}>
        {items.map((item, i) => {
          const at = pull[i];
          const open = at === undefined ? 0 : fade(t, at, 0.35);
          return <Drawer key={item.label} label={item.label} color={item.color} w={w} h={84} lit={fade(t, light + i * 0.12, 0.25) * (pulled && !open ? 0.4 : 1)} open={open} />;
        })}
      </div>
    </At>
  );
}

/** A generic laptop: a screen and its base. */
function LaptopShape({ w = 200, children, glow }: { w?: number; children?: ReactNode; glow?: string }) {
  const h = w * 0.62;
  return (
    <div className="relative" style={{ width: w, height: h + 14 }}>
      <div className="absolute left-[7%] right-[7%] top-0 overflow-hidden rounded-[8px] border-[4px]" style={{ height: h, borderColor: "#2C3140", background: "#0E1118", boxShadow: glow ? `0 0 24px ${glow}` : undefined }}>
        {children}
      </div>
      <div className="absolute inset-x-0 rounded-b-[10px] border-2" style={{ top: h - 2, height: 16, background: "#C9CED9", borderColor: LINE }} />
    </div>
  );
}

/** A generic desktop monitor on its stand. */
function MonitorShape({ w = 190, children }: { w?: number; children?: ReactNode }) {
  const h = w * 0.6;
  return (
    <div className="relative" style={{ width: w, height: h + 34 }}>
      <div className="absolute inset-x-0 top-0 overflow-hidden rounded-[8px] border-[5px]" style={{ height: h, borderColor: "#2C3140", background: "#0E1118" }}>
        {children}
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bg-[#2C3140]" style={{ top: h, width: 18, height: 22 }} />
      <div className="absolute left-1/2 -translate-x-1/2 rounded-md bg-[#2C3140]" style={{ top: h + 20, width: 84, height: 10 }} />
    </div>
  );
}

/** A generic phone. */
function PhoneShape({ w = 60 }: { w?: number }) {
  return (
    <div className="relative overflow-hidden rounded-[12px] border-[4px] p-[5px]" style={{ width: w, height: w * 1.9, borderColor: "#2C3140", background: "#0E1118" }}>
      <div className="grid grid-cols-3 gap-[4px]">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="aspect-square rounded-[3px]" style={{ background: [OS.mac, OS.win, OS.all, OS.linux][i % 4], opacity: 0.85 }} />
        ))}
      </div>
    </div>
  );
}

/** A generic USB stick with a label. */
function Stick({ label, w = 150, color = ACCENT }: { label: string; w?: number; color?: string }) {
  const h = w * 0.36;
  return (
    <div className="relative flex items-center" style={{ width: w, height: h }}>
      <div className="relative flex h-full items-center rounded-[12px] border-2 pl-3" style={{ width: w * 0.8, background: color, borderColor: LINE }}>
        <div className="mr-2 h-3 w-3 shrink-0 rounded-full border-2" style={{ background: "#0E1118", borderColor: LINE }} />
        <div className="flex h-[62%] flex-1 items-center justify-center rounded-[6px] border-2 bg-[#F7F0E2] font-mono text-[17px] font-black uppercase text-[#1B1F2A]" style={{ borderColor: LINE, marginRight: 8 }}>
          {label}
        </div>
      </div>
      <div className="h-[56%] rounded-r-[4px] border-2 border-l-0 bg-[#D7DBE3]" style={{ width: w * 0.2, borderColor: LINE }}>
        <div className="mx-auto mt-[22%] flex w-[60%] justify-between">
          <span className="block h-2 w-2 bg-[#0E1118]" />
          <span className="block h-2 w-2 bg-[#0E1118]" />
        </div>
      </div>
    </div>
  );
}

/** A green SSD board. */
function SsdShape({ w = 460, small = false }: { w?: number; small?: boolean }) {
  const h = w * 0.27;
  return (
    <div className="relative rounded-[10px] border-2" style={{ width: w, height: h, background: "#2E5A47", borderColor: LINE }}>
      <div className="absolute bottom-[12%] left-0 top-[12%] flex w-[5%] flex-col justify-between py-1">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="h-[6%] w-full bg-[#E5BE5A]" />
        ))}
      </div>
      <div className="absolute bottom-[14%] left-[9%] top-[14%] flex w-[36%] flex-col justify-center rounded-[6px] border-2 bg-[#F7F0E2] px-3" style={{ borderColor: LINE }}>
        <span className="font-mono font-black leading-none text-[#1B1F2A]" style={{ fontSize: small ? 22 : 34 }}>
          2 TB
        </span>
        <span className="mt-1 font-mono font-bold uppercase leading-none text-muted" style={{ fontSize: small ? 13 : 15 }}>
          SSD
        </span>
      </div>
      {[0, 1].map((i) => (
        <div key={i} className="absolute top-[18%] flex items-center justify-center rounded-[5px] border-2 bg-[#1B1F2A] font-mono font-bold text-[#9AA1B2]" style={{ left: `${52 + i * 23}%`, width: "19%", bottom: "18%", borderColor: LINE, fontSize: small ? 12 : 15 }}>
          NAND
        </div>
      ))}
    </div>
  );
}

/** A data card of an interface (data-ui): mono text that does not count as text to read. */
function Card({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div data-ui="" className={`rounded-[14px] border font-mono text-ink shadow-[0_14px_30px_rgba(0,0,0,0.38)] ${className ?? ""}`} style={{ background: "#262B38", borderColor: "rgba(243,237,226,0.12)", ...style }}>
      {children}
    </div>
  );
}

/* ---------- The hall: the cabinet, the legend and your USB ---------- */

const CABINET = [
  { label: "NTFS", color: OS.win, name: ["gancho", "ntfs"] },
  { label: "APFS", color: OS.mac, name: ["gancho", "apfs"] },
  { label: "ext4", color: OS.linux, name: ["gancho", "ext4"] },
  { label: "FAT32", color: OS.all, name: ["gancho", "fat32"] },
  { label: "exFAT", color: OS.all, name: ["gancho", "exfat"] },
  { label: "Btrfs", color: OS.linux, name: ["gancho", "btrfs"] },
  { label: "ZFS", color: OS.linux, name: ["gancho", "zfs"] },
  { label: "y más", color: "#E9E1D0", name: ["gancho", "zfs"] },
] as const;

/** The cabinet: in the hook its drawers get their names; in the close, all of them are open. */
function Cabinet({ close }: { close: boolean }) {
  const t = useT();
  const hookEnter = useStageCue("gancho", "por");
  const recap = useStageCue("cierre", "entonces");
  const names = CABINET.map((d) => useStageCue(d.name[0], d.name[1]));
  const enter = close ? -1 : hookEnter;
  const p = usePop(enter);
  if (t < enter) return null;
  return (
    <At x={0} y={0} w={W} h={SEC} style={{ opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - Math.min(1, p)) * -40}px)` }}>
      {close ? null : <Sfx id="golpe" at={enter} volume={0.3} />}
      <svg className="absolute left-0 top-0" width={W} height={SEC}>
        <polygon points="40,268 70,242 522,242 500,268" fill={SLATE.top} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
        <polygon points="500,268 522,242 522,448 500,474" fill={SLATE.side} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
        <rect x={40} y={268} width={460} height={206} rx={6} fill={SLATE.front} stroke={LINE} strokeWidth={3} />
        <rect x={56} y={474} width={14} height={14} fill={SLATE.side} stroke={LINE} strokeWidth={2} />
        <rect x={470} y={474} width={14} height={14} fill={SLATE.side} stroke={LINE} strokeWidth={2} />
      </svg>
      {CABINET.map((d, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const nameAt = i === 7 ? names[i] + 0.5 : names[i];
        const named = close ? 1 : fade(t, nameAt, 0.2);
        return (
          <At key={d.label} x={56 + col * 110} y={284 + row * 94} w={98} h={82}>
            {close ? null : <Sfx id="pop" at={nameAt} volume={0.25} />}
            <Drawer label={d.label} color={d.color} w={98} h={82} lit={named} shown={named} open={close ? fade(t, recap + i * 0.08, 0.3) : 0} />
          </At>
        );
      })}
    </At>
  );
}

const LEGEND = [
  { os: "WINDOWS", color: OS.win, icon: "app-window", chips: [["NTFS", "ntfs"]], recap: "windows" },
  { os: "APPLE", color: OS.mac, logo: "apple", chips: [["APFS", "apfs"]], recap: "apple" },
  { os: "LINUX", color: OS.linux, logo: "linux", chips: [["ext4", "ext4"], ["Btrfs", "btrfs"], ["ZFS", "zfs"]], recap: "linux" },
  { os: "TODOS", color: OS.all, icon: "globe", chips: [["FAT32", "fat32"], ["exFAT", "exfat"]], recap: "fat32" },
] as const;

function Legend({ close }: { close: boolean }) {
  const t = useT();
  const gone = useStageCue("cierre", "tantos");
  const hookChips = LEGEND.map((row) => row.chips.map(([, word]) => useStageCue("gancho", word)));
  const chips = close ? hookChips.map((row) => row.map(() => -1)) : hookChips;
  const recaps = LEGEND.map((row) => useStageCue("cierre", row.recap));
  const pops = chips.map((row) => usePop(row[0]));
  if (t < chips[0][0] || (close && t > gone + 0.4)) return null;
  return (
    <At x={230} y={500} w={274} h={290} style={{ opacity: close ? 1 - fade(t, gone, 0.35) : 1 }}>
      {LEGEND.map((row, r) => {
        const p = pops[r];
        const focus = close && t >= recaps[r] && (r === 3 ? true : t < recaps[r + 1]);
        return (
          <div key={row.os} className="absolute left-0 flex items-center gap-3" style={{ top: r * 70, opacity: Math.min(1, p * 1.6), transform: `translateX(${(1 - Math.min(1, p)) * 24}px)` }}>
            <div className="rounded-[12px]" style={{ boxShadow: focus ? "0 0 0 3px #F29A38" : undefined }}>
              <Mark color={row.color} icon={"icon" in row ? row.icon : undefined} logo={"logo" in row ? row.logo : undefined} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[15px] font-bold leading-none" style={{ color: row.color }}>
                {row.os}
              </span>
              <div className="flex gap-1.5">
                {row.chips.map(([chip], c) => (
                  <span key={chip} className="rounded-[5px] border-2 px-1.5 py-[1px] font-mono text-[15px] font-bold leading-[1.2] text-[#0E1118]" style={{ background: row.color, borderColor: LINE, opacity: fade(t, chips[r][c], 0.2) }}>
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </At>
  );
}

/** The four trade-offs, stacked like folders in a drawer. */
function TradeOffs() {
  const t = useT();
  const words = ["velocidad", "seguridad", "compatibilidad", "funciones"].map((w) => useStageCue("cierre", w));
  const colors = [OS.mac, OS.linux, OS.win, ACCENT];
  const pops = words.map((at) => usePop(at));
  if (t < words[0] - 0.2) return null;
  return (
    <At x={240} y={500} w={264} h={290}>
      <div className="absolute bottom-0 left-0 right-0 h-[120px] rounded-[12px] border-2" style={{ background: SLATE.front, borderColor: SLATE.edge }}>
        <div className="mx-auto mt-[52px] h-[14px] w-[90px] rounded-full bg-[#0E1118]" />
      </div>
      {["Velocidad", "Seguridad", "Compatibilidad", "Funciones"].map((label, i) => {
        const p = pops[i];
        if (t < words[i]) return null;
        return (
          <div key={label} className="absolute left-3 right-3 rounded-t-[10px] border-2 border-b-0 px-3 pt-1" style={{ top: 40 + i * 34, height: 170 - i * 34, background: colors[i], borderColor: LINE, transform: `translateY(${(1 - Math.min(1, p)) * -60}px)` }}>
            <Sfx id="page-turn" at={words[i]} volume={0.3} />
            <span className="font-mono text-[16px] font-black uppercase text-[#0E1118]">{label}</span>
          </div>
        );
      })}
    </At>
  );
}

/** The hall: your USB and the cabinet. Once in the hook, and again, with everything open, in the close. */
function Hall({ close }: { close: boolean }) {
  const t = useT();
  const mac = useStageCue("gancho", "mac");
  const opens = useStageCue("gancho", "abre");
  const win = useStageCue("gancho", "windows");
  const nothing = useStageCue("gancho", "aparece");
  const question = useStageCue("gancho", "por");
  const roto = useStageCue("cierre", "roto");
  const devices = close ? 0 : 1 - fade(t, question, 0.35);
  // The stick: under the laptop, into it, then over to the monitor, then to the left.
  const intoMac = ramp(t, mac - 0.2, mac + 0.4);
  const toWin = ramp(t, win - 0.1, win + 0.6);
  const aside = close ? 1 : ramp(t, question, question + 0.6);
  const sx = close ? 50 : 80 + intoMac * 40 + toWin * 210 - aside * 280;
  const sy = close ? 520 : 470 - intoMac * 24 + aside * 74;
  const bob = Math.sin(t * 3) * 3;
  return (
    <Section y={close ? Y.end : Y.hall}>
      {devices > 0 ? (
        <div style={{ opacity: devices }}>
          <At x={40} y={290}>
            <LaptopShape w={210} glow={t > opens ? "#3FB37F55" : undefined}>
              {t > opens ? (
                <div className="flex h-full items-center justify-center gap-3">
                  {[0, 1, 2].map((i) => (
                    <Icono key={i} name="folder" size={34} strokeWidth={2.2} ancla={false} className="text-[#F29A38]" />
                  ))}
                </div>
              ) : null}
            </LaptopShape>
          </At>
          <At x={300} y={280}>
            <MonitorShape w={200}>
              {t > nothing ? <div className="flex h-full items-center justify-center font-display text-[64px] font-black text-[#4A5164]">?</div> : null}
            </MonitorShape>
          </At>
          <Tag at={0} x={44} y={250} tone="line">
            Mac
          </Tag>
          <Tag at={0} x={300} y={244} tone="line">
            Windows
          </Tag>
          <Tag at={opens} x={100} y={392} tone="ok">
            Abre
          </Tag>
          <Tag at={nothing} x={366} y={384} tone="alert">
            Nada
          </Tag>
        </div>
      ) : null}
      <At x={sx} y={sy + bob}>
        <Stick label={close ? (t > roto ? "APFS" : "?") : t > question ? "?" : "USB"} w={t > question ? 150 : 140} color={close && t > roto ? OS.mac : ACCENT} />
      </At>
      <Cabinet close={close} />
      <Legend close={close} />
      {close ? <TradeOffs /> : null}
    </Section>
  );
}

/* ---------- The disk: bytes, blocks and the catalog ---------- */

const FILE_CELLS = new Set([45, 46, 47, 48, 49, 50, 51, 52, 65, 66, 67, 68]);

function Disk() {
  const t = useT();
  const start = useStageCue("disco", "primero");
  const model = useStageCue("disco", "modelo");
  const ssd = useStageCue("disco", "ssd");
  const bytes = useStageCue("disco", "billones");
  const blocks = useStageCue("disco", "bloques");
  const half = useStageCue("disco", "quinientos");
  const bits = useStageCue("disco", "ceros");
  const knows = useStageCue("disco", "sabe");
  const fsWord = useStageCue("catalogo", "sistema");
  const drawer = useStageCue("catalogo", "fichero");
  const library = useStageCue("catalogo", "biblioteca");
  const lives = useStageCue("catalogo", "vive");
  const weighs = useStageCue("catalogo", "pesa");
  const opener = useStageCue("catalogo", "abre");
  const changed = useStageCue("catalogo", "cambio");
  const without = useStageCue("catalogo", "sin");
  const still = useStageCue("catalogo", "54");
  const nobody = useStageCue("catalogo", "nadie");
  const end = useStageCue("windows", "windows");
  const toGrid = fade(t, blocks, 0.45);
  const counting = blocks <= t;
  const count = counting ? interpolate(t, [blocks, half + 0.6], [0, 488_281_250], clamp) : interpolate(t, [bytes, bytes + 0.8], [0, 2_000_000_000_000], clamp);
  const pointer = t >= fsWord ? 1 : t >= blocks ? 2 : 0;
  const gone = t >= without;
  const shake = t >= nobody && t < nobody + 0.6 ? Math.sin((t - nobody) * 40) * 6 : 0;
  if (t < start - 1 || t > end + 1.2) return null;
  const paint = (i: number) => {
    if (t >= lives && FILE_CELLS.has(i)) return ACCENT;
    if (t >= bits && t < drawer && i === 45) return ACCENT;
    return undefined;
  };
  return (
    <Section y={Y.disco}>
      <At x={40} y={150} style={{ opacity: (1 - toGrid) * fade(t, ssd - 0.4, 0.3) }}>
        <SsdShape w={460} />
      </At>
      <div style={{ opacity: toGrid }}>
        <Blocks x={40} y={150} cols={20} rows={7} paint={paint} />
      </div>
      {/* The file system's drawer sits on top of the blocks. */}
      <Appear at={drawer} x={160} y={196} sound="golpe">
        <div style={{ transform: gone ? `translateY(${fade(t, without, 0.4) * 40}px)` : undefined, opacity: gone ? 1 - fade(t, without, 0.4) * 0.75 : 1, filter: gone ? "grayscale(1)" : undefined }}>
          <Drawer label="fichero" color={SLATE.edge} w={220} h={84} open={1} />
        </div>
      </Appear>
      {/* Bytes, then blocks */}
      <Appear at={bytes} until={drawer} x={50} y={340} w={240}>
        <p className="font-mono text-[15px] font-bold uppercase leading-none text-muted">{counting ? "Bloques de 4 KB" : "Bytes"}</p>
        <p className="mt-2 font-mono text-[21px] font-black leading-none text-accent">{fmt(count)}</p>
      </Appear>
      <Appear at={bits} until={drawer} x={50} y={430} w={240}>
        <Card className="px-3 py-2">
          <p className="text-[14px] font-bold uppercase text-muted">Bloque #45 · 4 KB</p>
          <p className="mt-1 text-[17px] font-bold leading-[1.3]">01101001 01110010</p>
          <p className="text-[17px] font-bold leading-[1.3]">00100000 01101101 …</p>
        </Card>
      </Appear>
      {/* The layers */}
      <Appear at={model} until={library} x={290} y={340} w={214}>
        {[
          ["file", "Tus archivos"],
          ["archive", "Sistema de archivos"],
          ["grid-3x3", "Bloques"],
        ].map(([icon, label], i) => (
          <div key={label} className="relative mb-3 flex h-[58px] items-center gap-2 rounded-[10px] border-2 px-2.5" style={{ background: i === pointer ? PAPER : "#262B38", borderColor: i === pointer ? ACCENT : LINE, opacity: fade(t, model + i * 0.25, 0.2) }}>
            <Icono name={icon} size={24} strokeWidth={2.4} ancla={false} className={i === pointer ? "text-[#1B1F2A]" : "text-ink"} />
            <span className="font-mono text-[14px] font-bold uppercase leading-[1.1]" style={{ color: i === pointer ? "#1B1F2A" : CREAM }}>
              {label}
            </span>
            {i === 0 && t >= knows ? <span className="absolute -top-3 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#E5534B] font-display text-[18px] font-black text-white">?</span> : null}
          </div>
        ))}
      </Appear>
      {/* The catalog card of the file */}
      <Appear at={library} x={60} y={330} w={420}>
        <Card className="px-4 py-3" style={{ transform: `translateX(${shake}px)` }}>
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <Icono name={gone ? "file-question" : "file-video"} size={26} strokeWidth={2.4} ancla={false} className="text-accent" />
            <span className="text-[22px] font-black">{gone ? "?" : "vacaciones.mp4"}</span>
            <span className="ml-auto rounded-[4px] bg-white/10 px-1.5 py-[1px] text-[12px] font-bold uppercase text-muted">Ejemplo</span>
          </div>
          {[
            ["Vive en", "bloques 1.048.576–2.366.935", lives],
            ["Pesa", "5,4 GB", weighs],
            ["Lo abre", "jeremy · leer y escribir", opener],
            ["Cambió", "27 oct 2026 · 14:02", changed],
          ].map(([label, value, at]) => (
            <div key={label as string} className="flex items-baseline gap-3 border-b border-white/5 py-[5px]">
              <span className="w-[86px] shrink-0 text-[13px] font-bold uppercase text-muted">{label}</span>
              <span className="text-[17px] font-bold" style={{ opacity: fade(t, at as number, 0.2), color: gone ? "#9AA1B2" : CREAM }}>
                {gone ? "?" : value}
              </span>
              {!gone && t >= (at as number) && t < (at as number) + 0.1 ? <Sfx id="click" at={at as number} volume={0.25} /> : null}
            </div>
          ))}
        </Card>
      </Appear>
      <Tag at={still} x={300} y={300} tone="accent">
        Siguen ahí
      </Tag>
      <Tag at={nobody} x={250} y={600} tone="alert">
        Nadie los encuentra
      </Tag>
    </Section>
  );
}

/* ---------- Windows: NTFS and its journal ---------- */

const ROW4 = [
  { label: "NTFS", color: OS.win },
  { label: "APFS", color: OS.mac },
  { label: "ext4", color: OS.linux },
  { label: "FAT32", color: OS.all },
];

function OsTitle({ at, mark, name, os, color }: { at: number; mark: ReactNode; name: string; os: string; color: string }) {
  return (
    <Appear at={at} x={40} y={258}>
      <div className="flex items-center gap-3">
        {mark}
        <div>
          <p className="font-display text-[46px] font-black leading-[0.9] text-ink">{name}</p>
          <p className="mt-1 font-mono text-[15px] font-bold uppercase leading-none" style={{ color }}>
            {os}
          </p>
        </div>
      </div>
    </Appear>
  );
}

const WRITE_CELLS = Array.from({ length: 16 }, (_, i) => 9 + i);

function Ntfs() {
  const t = useT();
  const each = useStageCue("windows", "windows");
  const win = useStageCue("windows", "windows");
  const ntfs = useStageCue("windows", "ntfs");
  const feats = ["enormes", "permisos", "cifrado", "diario"].map((w) => useStageCue("windows", w));
  const before = useStageCue("windows", "antes");
  const notes = useStageCue("windows", "anota");
  const power = useStageCue("windows", "luz");
  const replay = useStageCue("windows", "repasa");
  const fixed = useStageCue("windows", "cuadrar");
  const end = useStageCue("apple", "mac");
  if (t < each - 1.2 || t > end + 1) return null;
  const written = Math.floor(interpolate(t, [notes + 0.6, power], [0, WRITE_CELLS.length], clamp));
  const healed = Math.floor(interpolate(t, [replay, fixed], [0, WRITE_CELLS.length], clamp));
  const status = t >= fixed ? "OK ✓" : t >= replay ? "REPASANDO" : "PENDIENTE";
  const paint = (i: number) => {
    const k = WRITE_CELLS.indexOf(i);
    if (k < 0) return undefined;
    if (t >= replay) return k < healed ? (t >= fixed ? OK : ACCENT) : RED;
    if (t >= power) return k < written ? RED : undefined;
    return k < written ? ACCENT : undefined;
  };
  const dark = t >= power && t < power + 0.25 ? 0.55 : 0;
  return (
    <Section y={Y.ntfs}>
      <DrawerRow items={ROW4} light={each} pull={[ntfs, undefined, undefined, undefined]} />
      <OsTitle at={win} mark={<Mark color={OS.win} icon="app-window" size={58} />} name="NTFS" os="Windows" color={OS.win} />
      <Appear at={feats[0] - 0.3} until={before} x={0} y={0}>
        {(["Grandes", "Permisos", "Cifrado", "Diario"] as const).map((label, i) => (
          <Folder
            key={label}
            x={230 + (i % 2) * 140}
            y={350 + Math.floor(i / 2) * 124}
            w={134}
            h={112}
            label={label}
            icon={["files", "lock", "key-round", "notebook-pen"][i]}
            note={["2⁶⁴ bytes", "ACL", "BitLocker", "log"][i]}
            color={OS.win}
            at={feats[i]}
          />
        ))}
      </Appear>
      {/* The journal */}
      <Appear at={before} x={40} y={340} w={176}>
        <p className="mb-2 font-mono text-[15px] font-bold uppercase leading-none text-muted">El disco</p>
      </Appear>
      {t >= before ? (
        <div style={{ opacity: fade(t, before, 0.3) }}>
          <Blocks x={40} y={364} cols={8} rows={5} cell={20} gap={2} paint={paint} digits={false} />
        </div>
      ) : null}
      <Appear at={before} x={230} y={340} w={274}>
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1.5" style={{ background: OS.win }}>
            <span className="text-[14px] font-black uppercase text-white">Diario · NTFS</span>
            <span className="text-[13px] font-bold text-white/80">log</span>
          </div>
          <div className="space-y-1 px-3 py-2 text-[16px] font-bold leading-[1.25]">
            <p style={{ opacity: fade(t, notes) }}>#4417 · 14:02:07</p>
            <p style={{ opacity: fade(t, notes + 0.3) }}>ESCRIBIR vacaciones.mp4</p>
            <p style={{ opacity: fade(t, notes + 0.6) }}>bloques 1.048.576–2.366.935</p>
            <p className="inline-block rounded px-1" style={{ opacity: fade(t, notes + 0.9), background: t >= replay ? (t >= fixed ? "#3FB37F44" : "#4F7CF744") : undefined, outline: t >= replay ? `2px solid ${t >= fixed ? OK : OS.win}` : undefined }}>
              estado: {status}
            </p>
          </div>
        </Card>
      </Appear>
      <Stamp at={power} x={128} y={520} tone="alert" rotate={-9}>
        Sin luz
      </Stamp>
      <Tag at={fixed} x={60} y={556} tone="ok">
        En orden
      </Tag>
      <div className="absolute inset-0 bg-black" style={{ opacity: dark }} />
    </Section>
  );
}

/* ---------- Apple: APFS ---------- */

function Apfs() {
  const t = useT();
  const mac = useStageCue("apple", "mac");
  const phone = useStageCue("apple", "iphone");
  const apfs = useStageCue("apple", "apfs");
  // The versions are on screen only (facts.json): the voice no longer says them.
  const high = apfs + 0.5;
  const ios = apfs + 0.9;
  const ssd = useStageCue("apple", "ssd");
  const flash = useStageCue("apple", "flash");
  const feats = ["cifrado", "clones", "instantaneas", "espacio"].map((w) => useStageCue("apple", w));
  const end = useStageCue("linux", "linux");
  if (t < mac - 1.5 || t > end + 1) return null;
  return (
    <Section y={Y.apfs}>
      <DrawerRow items={ROW4} light={mac - 1.2} pull={[undefined, apfs, undefined, undefined]} />
      <OsTitle at={apfs} mark={<Logo slug="apple" size={58} chip={OS.mac} ancla={false} />} name="APFS" os="Apple" color={OS.mac} />
      <Stamp at={high} x={420} y={272} tone="ink" rotate={-5} size={16}>
        High Sierra
      </Stamp>
      <Stamp at={ios} x={430} y={316} tone="ink" rotate={4} size={16}>
        iOS 10.3
      </Stamp>
      <Appear at={mac} x={44} y={356}>
        <LaptopShape w={150}>
          <div className="m-2 h-[45%] w-[40%] rounded-[4px]" style={{ background: OS.mac }} />
        </LaptopShape>
      </Appear>
      <Appear at={phone} x={160} y={420}>
        <PhoneShape w={44} />
      </Appear>
      <Appear at={ssd} x={44} y={514}>
        <SsdShape w={170} small />
      </Appear>
      <Tag at={ssd} x={232} y={340} tone="line">
        SSD
      </Tag>
      <Tag at={flash} x={300} y={340} tone="accent">
        Flash
      </Tag>
      {(["Cifrado", "Clones", "Instantáneas", "Espacio compartido"] as const).map((label, i) => (
        <Appear key={label} at={feats[i]} x={232} y={384 + i * 62} w={272} sound="click">
          <div className="flex h-[54px] items-center justify-between rounded-[10px] border-2 px-3" style={{ background: OS.mac, borderColor: LINE }}>
            <span className="font-mono text-[16px] font-black uppercase text-[#0E1118]">{label}</span>
            <Icono name={["key-round", "copy", "history", "chart-pie"][i]} size={28} strokeWidth={2.4} ancla={false} className="text-[#0E1118]" />
          </div>
        </Appear>
      ))}
    </Section>
  );
}

/* ---------- Linux: ext4, Btrfs and ZFS, copy-on-write ---------- */

const ROW3 = [
  { label: "ext4", color: OS.linux },
  { label: "Btrfs", color: OS.linux },
  { label: "ZFS", color: OS.linux },
];
const V1 = new Set([3, 4, 5, 6, 7, 23, 24, 25, 26, 27]);
const V2 = new Set([51, 52, 53, 54, 55, 71, 72, 73, 74, 75]);

function Linux() {
  const t = useT();
  const linux = useStageCue("linux", "linux");
  const ext4 = useStageCue("linux", "ext4");
  const mature = ext4 + 0.5;
  const reliable = ext4 + 0.9;
  const btrfs = useStageCue("linux", "btrfs");
  const zfs = useStageCue("linux", "zfs");
  const cow = useStageCue("linux", "copia");
  const overwrite = useStageCue("linux", "pisan");
  const change = useStageCue("linux", "cambio");
  const pointer = useStageCue("linux", "puntero");
  const snapshot = useStageCue("linux", "instantanea");
  const space = useStageCue("linux", "espacio");
  const fedora = space + 1;
  const end = useStageCue("checksum", "suma");
  if (t < linux - 1.5 || t > end + 1) return null;
  const v2 = interpolate(t, [change, change + 1.2], [0, V2.size], clamp);
  const moved = t >= pointer;
  const paint = (i: number) => {
    if (t >= overwrite && V1.has(i)) return moved ? "#B9A77A" : ACCENT;
    if (V2.has(i) && [...V2].indexOf(i) < v2) return ACCENT;
    return undefined;
  };
  return (
    <Section y={Y.linux}>
      <DrawerRow items={ROW3} light={linux - 1.2} pull={[ext4, btrfs, zfs]} />
      <OsTitle at={linux} mark={<Logo slug="linux" size={58} chip="#2B2A22" ancla={false} />} name="Linux" os="ext4/Btrfs/ZFS" color={OS.linux} />
      <Tag at={ext4} until={cow} x={232} y={360} tone="solid">
        El clásico
      </Tag>
      <Tag at={mature} until={cow} x={232} y={404} tone="line">
        Maduro
      </Tag>
      <Tag at={reliable} until={cow} x={356} y={404} tone="line">
        Confiable
      </Tag>
      <Appear at={cow} until={overwrite} x={40} y={360} w={464}>
        <BigWord size={54}>
          Copia en
          <br />
          <span className="text-accent">escritura</span>
        </BigWord>
      </Appear>
      {t >= overwrite ? (
        <div style={{ opacity: fade(t, overwrite, 0.3) }}>
          <Blocks x={40} y={346} cols={20} rows={4} paint={paint} />
        </div>
      ) : null}
      <Tag at={overwrite} x={60} y={442} tone="accent">
        V1 queda intacta
      </Tag>
      <Tag at={change + 0.3} x={300} y={442} tone="accent">
        V2 lugar nuevo
      </Tag>
      <Appear at={overwrite + 0.3} x={232} y={492} w={272}>
        <Card className="px-3 py-2">
          <p className="text-[18px] font-black">vacaciones.mp4</p>
          <p className="text-[16px] font-bold">
            apunta a: <span className="rounded px-1" style={{ background: moved ? ACCENT : "transparent", color: moved ? "#0E1118" : undefined }}>{moved ? "V2" : "V1"}</span>
          </p>
          {moved && t < pointer + 0.1 ? <Sfx id="switch" at={pointer} volume={0.35} /> : null}
        </Card>
      </Appear>
      <Appear at={snapshot} x={232} y={580} w={272}>
        <Card className="px-3 py-2" style={{ background: "#2B2A22", color: CREAM, borderColor: OS.linux }}>
          <p className="text-[16px] font-black uppercase" style={{ color: OS.linux }}>
            Instantánea 14:00
          </p>
          <p className="text-[16px] font-bold">apunta a: V1</p>
        </Card>
      </Appear>
      <Tag at={space} x={232} y={668} tone="ok">
        Extra: 0 bytes
      </Tag>
      <Appear at={fedora} x={232} y={712} sound="blip">
        <div className="flex items-center gap-2">
          <Logo slug="fedora" size={30} chip ancla={false} />
          <span className="font-mono text-[17px] font-bold uppercase text-ink">Btrfs por defecto</span>
        </div>
      </Appear>
    </Section>
  );
}

/* ---------- Checksums ---------- */

const SUMS = [
  ["1101", "110e14"],
  ["0010", "c0a1d8"],
  ["1001", "ca58fb"],
  ["0110", "1ec0f9"],
  ["1110", "105656"],
  ["0101", "23ce12"],
];

function Sums() {
  const t = useT();
  const start = useStageCue("checksum", "y");
  const sum = useStageCue("checksum", "suma");
  const bit = useStageCue("checksum", "bit");
  const again = useStageCue("checksum", "suma", 2);
  const match = useStageCue("checksum", "coincide");
  const caught = useStageCue("checksum", "detectan");
  const silent = useStageCue("checksum", "corrupcion");
  const end = useStageCue("fat32", "viejo");
  if (t < start - 2 || t > end + 1) return null;
  const flipped = t >= bit;
  return (
    <Section y={Y.sums}>
      <Appear at={start} x={40} y={140}>
        <p className="font-mono text-[17px] font-bold uppercase leading-none text-muted">Suma por bloque</p>
      </Appear>
      {SUMS.map(([bits, hash], i) => {
        const at = start + 0.2 + i * 0.14;
        const bad = i === 3 && flipped;
        return (
          <Appear key={hash} at={at} x={40 + i * 78} y={176} w={68} sound={i === 0 ? "pop" : undefined}>
            <div className="flex h-[74px] items-center justify-center rounded-[8px] border-2 font-mono text-[19px] font-black text-[#1B1F2A]" style={{ background: bad ? RED : ACCENT, borderColor: LINE }}>
              {bad ? "0111" : bits}
            </div>
            <div className="mt-2 rounded-[5px] border-2 py-[2px] text-center font-mono text-[14px] font-bold text-ink" style={{ borderColor: "#4A5164", background: DARK, opacity: fade(t, sum + i * 0.12, 0.2) }}>
              {hash}
            </div>
          </Appear>
        );
      })}
      {flipped && t < bit + 0.1 ? <Sfx id="switch" at={bit} volume={0.4} /> : null}
      <Appear at={again - 0.2} x={232} y={340} w={272}>
        <Card className="px-3 py-3">
          <p className="text-[14px] font-black uppercase">Leyendo bloque 1.048.579</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[14px] font-bold uppercase text-muted">guardada</span>
            <span className="text-[22px] font-black">1ec0f9</span>
          </div>
          <div className="flex items-baseline justify-between" style={{ opacity: fade(t, match - 0.3) }}>
            <span className="text-[14px] font-bold uppercase text-muted">ahora</span>
            <span className="text-[22px] font-black" style={{ color: RED }}>
              0f3996
            </span>
          </div>
          <div className="mt-2 rounded-[6px] py-1.5 text-center text-[15px] font-black uppercase text-white" style={{ background: RED, opacity: fade(t, caught, 0.2) }}>
            No coincide · detectado
          </div>
        </Card>
      </Appear>
      <Stamp at={silent} x={128} y={420} tone="alert" rotate={-8} size={18}>
        Corrupción
        <br />
        silenciosa
      </Stamp>
    </Section>
  );
}

/* ---------- FAT32 and exFAT: 32 bits against 64 ---------- */

function Bits({ x, y, n, lit }: { x: number; y: number; n: number; lit: number }) {
  return (
    <At x={x} y={y} w={272}>
      <div className="grid grid-cols-16 gap-[2px]" style={{ gridTemplateColumns: "repeat(16, 15px)" }}>
        {Array.from({ length: n }, (_, i) => (
          <div key={i} className="relative h-[26px] rounded-[3px] border-2" style={{ borderColor: LINE, background: i < lit ? ACCENT : "#2C3140" }}>
            <div className="absolute left-[1px] right-[1px] h-[9px] rounded-[2px] bg-[#F3EDE2]" style={{ top: i < lit ? 2 : 13 }} />
          </div>
        ))}
      </div>
    </At>
  );
}

function Fat() {
  const t = useT();
  const old = useStageCue("fat32", "viejo");
  const fat = useStageCue("fat32", "fat32");
  const simple = useStageCue("fat32", "simple");
  const cards = useStageCue("fat32", "tarjetas");
  const size = useStageCue("fat32", "tamano");
  const bits = useStageCue("fat32", "bits");
  const max = useStageCue("fat32", "maximo");
  const video = useStageCue("fat32", "video");
  const fits = useStageCue("fat32", "entra");
  const exfat = useStageCue("exfat", "exfat");
  const heir = useStageCue("exfat", "sucesor");
  const wide = useStageCue("exfat", "64");
  const limit = useStageCue("exfat", "limite");
  const cards2 = wide + 0.8;
  const win = useStageCue("exfat", "windows");
  const mac = useStageCue("exfat", "mac");
  const end = useStageCue("usb", "usb");
  if (t < old - 2 || t > end + 1) return null;
  const isEx = t >= exfat;
  const n = t >= wide ? 64 : 32;
  const lit = t >= wide ? 32 + Math.floor(interpolate(t, [wide, wide + 0.9], [0, 32], clamp)) : Math.floor(interpolate(t, [size, max + 0.2], [0, 32], clamp));
  const maxBytes = interpolate(t, [size, max + 0.2], [0, 4_294_967_295], clamp);
  const progress = t >= exfat ? interpolate(t, [exfat + 0.4, win + 0.6], [79, 100], clamp) : interpolate(t, [video, fits], [0, 79], clamp);
  const failed = t >= fits && t < exfat;
  const done = progress >= 100;
  return (
    <Section y={Y.fat}>
      <DrawerRow
        items={[
          { label: "FAT32", color: OS.all },
          { label: "exFAT", color: OS.all },
        ]}
        y={140}
        light={old - 1}
        pull={[old, exfat]}
      />
      <OsTitle at={old} mark={<Mark color={OS.all} icon="globe" size={58} />} name={isEx ? "exFAT" : "FAT32"} os="Para todos" color={OS.all} />
      <Tag at={simple} until={exfat} x={300} y={276} tone="line">
        Simple
      </Tag>
      <Tag at={heir} x={300} y={276} tone="ok">
        Sucesor
      </Tag>
      {/* The SD card of a camera */}
      <Appear at={Math.min(cards, old + 1.2)} x={40} y={350} w={176}>
        <div className="flex flex-col items-start gap-2">
          <Icono name="camera" size={48} strokeWidth={2} ancla={false} className="text-ink" />
          <div className="relative h-[118px] w-[96px] border-2 px-2 pt-6 font-mono" style={{ background: isEx && t >= cards2 ? OS.all : "#2C3140", borderColor: LINE, clipPath: "polygon(0 0, 72% 0, 100% 22%, 100% 100%, 0 100%)" }}>
            <p className="text-[17px] font-black leading-none text-ink">{t >= cards2 ? "SDXC" : "SDHC"}</p>
            <p className="mt-1 text-[14px] font-bold leading-none text-ink">{t >= cards2 ? "> 32 GB" : "≤ 32 GB"}</p>
            <p className="mt-2 text-[14px] font-bold leading-none text-accent">{t >= cards2 ? "exFAT" : "FAT32"}</p>
          </div>
        </div>
      </Appear>
      <Appear at={old + 0.8} x={232} y={330} w={272}>
        <p className="mb-1 font-mono text-[15px] font-bold uppercase leading-none text-muted">{n} bits de tamaño</p>
      </Appear>
      {t >= old + 0.8 ? (
        <div style={{ opacity: fade(t, old + 0.8, 0.3) }}>
          <Bits x={232} y={352} n={n} lit={lit} />
        </div>
      ) : null}
      {t >= bits && t < bits + 0.1 ? <Sfx id="switch" at={bits} volume={0.3} /> : null}
      <Appear at={size} x={232} y={t >= wide ? 474 : 420} w={272}>
        <p className="font-mono text-[14px] font-bold uppercase leading-none text-muted">Máximo</p>
        <p className="font-mono text-[22px] font-black leading-tight" style={{ color: t >= wide ? OS.all : CREAM }}>
          {t >= wide ? "2⁶⁴ − 1 bytes" : `${fmt(maxBytes)} bytes`}
        </p>
      </Appear>
      <Appear at={video} until={wide} x={232} y={470} w={272}>
        <p className="font-mono text-[14px] font-bold uppercase leading-none text-muted">vacaciones.mp4</p>
        <p className="font-mono text-[22px] font-black leading-tight text-accent">5.400.000.000 bytes</p>
      </Appear>
      <Appear at={video} x={232} y={534} w={272}>
        <Card className="px-3 py-2">
          <p className="text-[14px] font-black">Copiando vacaciones.mp4</p>
          <div className="mt-2 h-[12px] overflow-hidden rounded-full border-2 bg-white" style={{ borderColor: LINE }}>
            <div className="h-full" style={{ width: `${progress}%`, background: failed ? RED : done ? OS.all : OS.win }} />
          </div>
          <p className="mt-1.5 text-[14px] font-bold" style={{ color: failed ? RED : done ? OS.all : "#9AA1B2" }}>
            {failed ? "No cabe: más de 4 GiB" : done ? "Copiado ✓" : `${Math.round(progress)} %`}
          </p>
          <p className="text-[12px] font-bold text-muted">Ejemplo ilustrativo</p>
        </Card>
      </Appear>
      {failed ? (
        <Stamp at={fits} x={128} y={540} tone="alert" rotate={-8} size={34}>
          4 GB
        </Stamp>
      ) : null}
      <Stamp at={limit} x={128} y={540} tone="ok" rotate={-6} size={20}>
        Sin límite
      </Stamp>
      <Tag at={win} x={232} y={668} tone="ok">
        Windows ✓
      </Tag>
      <Tag at={mac} x={384} y={668} tone="ok">
        Mac ✓
      </Tag>
    </Section>
  );
}

/* ---------- Your USB, again ---------- */

const COLS = [
  ["NTFS", OS.win],
  ["APFS", OS.mac],
  ["FAT32", OS.all],
  ["exFAT", OS.all],
] as const;

function Cell({ at, kind }: { at: number; kind: "yes" | "no" | "read" }) {
  const t = useT();
  const p = usePop(at);
  if (t < at) return <div />;
  const look = {
    yes: { bg: "#1F3B37", ring: OS.all, icon: "check", text: "Lee y escribe", color: OS.all },
    no: { bg: "#3B1F22", ring: RED, icon: "x", text: "No lo lee", color: RED },
    read: { bg: "#3B321F", ring: "#E5BE5A", icon: "eye", text: "Solo lee", color: "#E5BE5A" },
  }[kind];
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-[8px] border-2" style={{ background: look.bg, borderColor: look.ring, color: look.color, transform: `scale(${0.7 + 0.3 * p})` }}>
      <Sfx id="click" at={at} volume={0.3} />
      <Icono name={look.icon} size={32} strokeWidth={3} ancla={false} />
      <span className="mt-1 px-1 text-center font-mono text-[14px] font-bold uppercase leading-[1.1]" style={{ color: look.color }}>
        {look.text}
      </span>
    </div>
  );
}

function Usb() {
  const t = useT();
  const usb = useStageCue("usb", "usb");
  const format = useStageCue("usb", "formateaste");
  const apfs = useStageCue("usb", "apfs");
  const win = useStageCue("usb", "windows");
  const unknown = useStageCue("usb", "reconoce");
  const back = useStageCue("usb", "reves");
  const reads = useStageCue("usb", "lee");
  const writes = useStageCue("usb", "escribe");
  const travel = useStageCue("usb", "dos");
  const ex = useStageCue("usb", "exfat");
  const safe = useStageCue("usb", "segura");
  const end = useStageCue("cierre", "entonces");
  if (t < usb - 1.5 || t > end + 1) return null;
  const toWin = ramp(t, win - 0.1, win + 0.6);
  const swing = t >= travel ? (Math.sin((t - travel) * 2.4) + 1) / 2 : toWin;
  const label = t >= ex ? "exFAT" : t >= apfs ? "APFS" : "USB";
  return (
    <Section y={Y.usb}>
      <Appear at={usb - 0.6} x={40} y={140}>
        <LaptopShape w={210}>
          {t >= format && t < win + 0.5 ? (
            <div data-ui="" className="mx-auto mt-3 w-[80%] rounded-[6px] bg-[#F7F0E2] p-1.5 font-mono text-[12px] font-bold leading-[1.25] text-[#1B1F2A]">
              <p>Borrar «USB»</p>
              <p>
                Formato: <span className="rounded px-1" style={{ background: OS.mac, opacity: fade(t, apfs) }}>APFS</span>
              </p>
            </div>
          ) : null}
        </LaptopShape>
      </Appear>
      <Appear at={win - 0.4} x={300} y={132}>
        <MonitorShape w={200}>
          {t >= ex ? (
            <div className="flex h-full items-center justify-center gap-3">
              {[0, 1, 2].map((i) => (
                <Icono key={i} name="folder" size={32} strokeWidth={2.2} ancla={false} className="text-accent" />
              ))}
            </div>
          ) : t >= unknown ? (
            <div className="flex h-full items-center justify-center font-display text-[60px] font-black text-[#4A5164]">?</div>
          ) : null}
        </MonitorShape>
      </Appear>
      <Tag at={unknown} until={ex} x={322} y={226} tone="alert">
        No lo reconoce
      </Tag>
      <At x={70 + swing * 230} y={300}>
        <Stick label={label} w={140} color={t >= ex ? OS.all : ACCENT} />
      </At>
      {/* The table */}
      <Appear at={win} x={40} y={366} w={464}>
        <div className="grid gap-[6px]" style={{ gridTemplateColumns: "104px repeat(4, 1fr)", gridTemplateRows: "34px 86px 86px" }}>
          <div />
          {COLS.map(([name, color]) => (
            <div key={name} className="flex items-center justify-center rounded-[6px] border-2 font-mono text-[15px] font-black text-[#0E1118]" style={{ background: color, borderColor: LINE }}>
              {name}
            </div>
          ))}
          <div className="flex items-center gap-1.5 font-mono text-[15px] font-bold uppercase" style={{ color: OS.win }}>
            <Icono name="app-window" size={20} strokeWidth={2.5} ancla={false} />
            Windows
          </div>
          <Cell at={win + 0.2} kind="yes" />
          <Cell at={unknown} kind="no" />
          <Cell at={ex} kind="yes" />
          <Cell at={ex + 0.15} kind="yes" />
          <div className="flex items-center gap-1.5 font-mono text-[15px] font-bold uppercase" style={{ color: OS.mac }}>
            <Icono name="laptop" size={20} strokeWidth={2.5} ancla={false} />
            macOS
          </div>
          <Cell at={writes} kind="read" />
          <Cell at={back + 0.2} kind="yes" />
          <Cell at={ex + 0.3} kind="yes" />
          <Cell at={ex + 0.45} kind="yes" />
        </div>
      </Appear>
      <Tag at={reads} x={232} y={600} tone="line">
        Lee NTFS
      </Tag>
      <Stamp at={safe} x={372} y={640} tone="ok" rotate={-6} size={18}>
        Opción segura
      </Stamp>
    </Section>
  );
}

/** Your USB, waiting in a corner of each section with its question, until the video answers it. */
function UsbReminder({ y }: { y: number }) {
  const t = useT();
  return (
    <Section y={y}>
      <At x={396} y={752 + Math.sin(t * 3) * 3}>
        <Stick label="?" w={108} />
      </At>
    </Section>
  );
}

function Archive() {
  return (
    <div className="absolute inset-0 text-ink">
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, #F3EDE2 1.2px, transparent 1.4px)", backgroundSize: "30px 30px" }} />
      <Hall close={false} />
      <Hall close />
      <Disk />
      <Ntfs />
      <Apfs />
      <Linux />
      <Sums />
      <Fat />
      <Usb />
      {[Y.disco, Y.ntfs, Y.apfs, Y.linux, Y.sums, Y.fat].map((y) => (
        <UsbReminder key={y} y={y} />
      ))}
    </div>
  );
}

/* ---------- Over the world: the hook and the last line ---------- */

function Hook() {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const question = useCue("por");
  const p = usePop(question);
  return (
    <div className="relative mt-[42px] h-[120px]">
      <h1 className="absolute left-0 top-0 font-display text-[50px] font-black leading-[0.98] tracking-tight text-ink" style={{ opacity: 1 - fade(t, question - 0.15, 0.2) }}>
        Tu USB
        <br />
        no está <span className="text-accent">roto</span>
      </h1>
      {t >= question ? (
        <div className="absolute left-0 top-0" style={{ transform: `scale(${0.85 + 0.15 * p})`, transformOrigin: "0 50%", opacity: Math.min(1, p * 2) }}>
          <BigWord size={50}>
            ¿Por qué <span className="text-accent">tantos</span>?
          </BigWord>
        </div>
      ) : null}
    </div>
  );
}

function Close() {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const last = useCue("hablaba");
  const ask = useCue("cuentame");
  const p = usePop(last);
  if (t < last) return null;
  return (
    <div className="relative mt-[42px]" style={{ transform: `scale(${0.85 + 0.15 * p})`, transformOrigin: "0 50%", opacity: Math.min(1, p * 2) }}>
      <BigWord size={50}>
        Hablaba <span className="text-accent">APFS</span>
      </BigWord>
      <p className="mt-3 inline-block rounded-full bg-accent px-4 py-1.5 font-mono text-[22px] font-bold uppercase leading-none text-accent-ink" style={{ opacity: fade(t, ask, 0.3), transform: `scale(${0.9 + 0.1 * fade(t, ask, 0.3)})`, transformOrigin: "0 50%" }}>
        ¿Qué formato tiene?
      </p>
    </div>
  );
}

export default defineVideo({
  captions: "pill",
  chapters: true,
  music: { file: "audio/cama.mp3" },
  stage: { World: Archive, width: W, height: H, drift: 0.02 },
  meter: {
    kind: "slots",
    start: 0,
    max: 7,
    steps: [
      { scene: "windows", word: "ntfs", value: 1 },
      { scene: "apple", word: "apfs", value: 2 },
      { scene: "linux", word: "ext4", value: 3 },
      { scene: "linux", word: "btrfs", value: 4 },
      { scene: "linux", word: "zfs", value: 5 },
      { scene: "fat32", word: "fat32", value: 6 },
      { scene: "exfat", word: "exfat", value: 7 },
    ],
  },
  avatar: {},
  scenes: [
    { id: "gancho", chapter: "Tu USB", camera: shot(Y.hall), Visual: Hook },
    { id: "disco", chapter: "El disco", camera: shot(Y.disco) },
    { id: "catalogo", chapter: "El fichero", camera: shot(Y.disco, 1.02) },
    { id: "windows", chapter: "Windows", camera: shot(Y.ntfs) },
    { id: "apple", chapter: "Apple", camera: shot(Y.apfs) },
    { id: "linux", chapter: "Linux", camera: shot(Y.linux) },
    { id: "checksum", chapter: "Sumas", camera: shot(Y.sums) },
    { id: "fat32", chapter: "FAT32", camera: shot(Y.fat) },
    { id: "exfat", chapter: "exFAT", camera: shot(Y.fat, 1.02) },
    { id: "usb", chapter: "Tu USB", camera: shot(Y.usb) },
    { id: "cierre", chapter: "Resumen", camera: shot(Y.end), hold: 0.8, Visual: Close },
  ],
});
