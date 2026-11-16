import type { ReactNode } from "react";
import { Logo } from "@motor/ui";
import { EASE, lerp, unit, useStage } from "@motor/video";

/*
 * The world of "Por qué tantos programadores prefieren Mac", a replica of
 * @rick.theengineer's Reel: a dark macOS desktop that lasts the whole video.
 * Silky dark waves for a wallpaper, the menu bar with the app in front, three
 * folders on the left and the Dock at the bottom. Each reason opens its own
 * window over it (scenes/*.tsx), and the app of the scene lights up in the Dock.
 * Where Rick uses macOS blue for a selection, the account's accent goes.
 */

export const BG = "#0B0D12";
export const WIN = "#1A1D24";
export const BAR = "#23262E";
export const LINE = "rgba(255,255,255,0.09)";
export const INK = "#F2F4F8";
export const MUTED = "#8E95A3";
export const DIM = "#545B69";
export const ACCENT = "#8B85FF";
export const GREEN = "#32D74B";
export const RED = "#FF453A";
export const AMBER = "#FFB340";
export const WIN_BLUE = "#0078D4";

/** Where a scene starts, in seconds of the whole video. */
export function useSceneStart(id: string): number {
  const { scenes } = useStage();
  let offset = 0;
  for (const scene of scenes) {
    if (scene.id === id) return offset / 1000;
    offset += scene.durationMs;
  }
  throw new Error(`No scene "${id}"`);
}

/** The app in front in each scene: its name in the menu bar and its icon in the Dock. */
const APPS: Record<string, { name: string; dock: DockId }> = {
  gancho: { name: "Finder", dock: "finder" },
  unix: { name: "Terminal", dock: "terminal" },
  terminal: { name: "Terminal", dock: "terminal" },
  wsl: { name: "Safari", dock: "safari" },
  chip: { name: "Finder", dock: "finder" },
  vatio: { name: "Monitor de Actividad", dock: "activity" },
  xcode: { name: "Xcode", dock: "xcode" },
  experiencia: { name: "Finder", dock: "finder" },
  gusto: { name: "Finder", dock: "finder" },
  control: { name: "Configuración", dock: "settings" },
  contras: { name: "Safari", dock: "safari" },
  docker: { name: "Docker Desktop", dock: "docker" },
  windows: { name: "Finder", dock: "finder" },
  linux: { name: "Finder", dock: "finder" },
  modelo: { name: "Notas", dock: "notes" },
  cierre: { name: "Notas", dock: "notes" },
};

type DockId = "finder" | "safari" | "terminal" | "xcode" | "vscode" | "intellij" | "docker" | "activity" | "facetime" | "notes" | "settings" | "trash";
const DOCK: DockId[] = ["finder", "safari", "terminal", "xcode", "vscode", "intellij", "docker", "activity", "facetime", "notes", "settings", "trash"];

/** A Dock icon: the official mark where Simple Icons or the catalog has it, a plain drawn tile otherwise. */
export function AppIcon({ id, size = 24 }: { id: DockId; size?: number }) {
  const r = size * 0.24;
  const tile = (bg: string, child: ReactNode) => (
    <div className="flex items-center justify-center overflow-hidden" style={{ width: size, height: size, borderRadius: r, background: bg }}>
      {child}
    </div>
  );
  const logo = (slug: string, k = 0.66, bg = "#FFFFFF") => tile(bg, <Logo slug={slug} size={size * k} ancla={false} />);
  switch (id) {
    case "finder":
      return tile("linear-gradient(90deg, #5AC8FA 50%, #E8F4FD 50%)", <div style={{ width: size * 0.5, height: size * 0.2, borderBottom: `${Math.max(1.5, size * 0.07)}px solid #1C3A5E`, borderRadius: "0 0 50% 50%", marginTop: size * 0.18 }} />);
    case "safari":
      return logo("safari", 0.74);
    case "terminal":
      return tile("#1E1F22", <svg width={size * 0.6} height={size * 0.5} viewBox="0 0 12 10"><polyline points="1,2 4,5 1,8" fill="none" stroke="#E6E6E6" strokeWidth="1.4" /><line x1="6" y1="8.3" x2="11" y2="8.3" stroke="#E6E6E6" strokeWidth="1.4" /></svg>);
    case "xcode":
      return logo("xcode", 0.74);
    case "vscode":
      return tile("#1E1E1E", <Logo slug="visual-studio-code" size={size * 0.7} ancla={false} />);
    case "intellij":
      return logo("intellijidea", 0.62);
    case "docker":
      return logo("docker", 0.7);
    case "activity":
      return tile("#16181C", <svg width={size * 0.7} height={size * 0.5} viewBox="0 0 20 14"><polyline points="0,7 5,7 7,2 10,12 13,5 15,7 20,7" fill="none" stroke="#32D74B" strokeWidth={1.8} /></svg>);
    case "facetime":
      return tile("#32D74B", <svg width={size * 0.6} height={size * 0.4} viewBox="0 0 18 12"><rect x="0" y="1" width="11" height="10" rx="2.5" fill="#FFFFFF" /><path d="M12 5 L18 1.5 L18 10.5 L12 7 Z" fill="#FFFFFF" /></svg>);
    case "notes":
      return tile("#FFFFFF", <div className="flex w-full flex-col" style={{ height: "100%" }}><div style={{ height: size * 0.28, background: "#FFD52E" }} />{[0, 1, 2].map((i) => <div key={i} style={{ height: 1, margin: `${size * 0.1}px ${size * 0.14}px 0`, background: "#D0D0D0" }} />)}</div>);
    case "settings":
      return tile("#8E8E93", <svg width={size * 0.66} height={size * 0.66} viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="none" stroke="#2C2C2E" strokeWidth="3" strokeDasharray="3 2.5" /><circle cx="12" cy="12" r="3" fill="#2C2C2E" /></svg>);
    case "trash":
      return tile("rgba(255,255,255,0.12)", <svg width={size * 0.5} height={size * 0.6} viewBox="0 0 10 12"><rect x="1" y="2.5" width="8" height="9" rx="1" fill="none" stroke="#C7C7CC" strokeWidth="1" /><line x1="0" y1="2" x2="10" y2="2" stroke="#C7C7CC" strokeWidth="1" /></svg>);
  }
}

/** The silky dark waves of the wallpaper, drifting very slowly. */
function Wallpaper({ t }: { t: number }) {
  const s = Math.sin(t * 0.08);
  const c = Math.cos(t * 0.06);
  return (
    <svg className="absolute inset-0" width={540} height={960} aria-hidden>
      <defs>
        <linearGradient id="wp-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2A3245" stopOpacity="0" />
          <stop offset="0.5" stopColor="#3A4560" stopOpacity="0.55" />
          <stop offset="1" stopColor="#2A3245" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="wp-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C2232" stopOpacity="0" />
          <stop offset="0.5" stopColor="#2B3350" stopOpacity="0.5" />
          <stop offset="1" stopColor="#1C2232" stopOpacity="0" />
        </linearGradient>
        <filter id="wp-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <rect width={540} height={960} fill={BG} />
      <g filter="url(#wp-blur)">
        <path d={`M -60 ${260 + 20 * s} C 140 ${120 + 30 * c}, 320 ${520 - 20 * s}, 620 ${300 + 25 * c} L 620 ${380 + 25 * c} C 320 ${600 - 20 * s}, 140 ${210 + 30 * c}, -60 ${350 + 20 * s} Z`} fill="url(#wp-a)" />
        <path d={`M -60 ${620 - 25 * c} C 160 ${480 + 20 * s}, 300 ${820 + 25 * c}, 620 ${600 - 20 * s} L 620 ${700 - 20 * s} C 300 ${900 + 25 * c}, 160 ${580 + 20 * s}, -60 ${720 - 25 * c} Z`} fill="url(#wp-b)" />
        <path d={`M -60 ${80 + 15 * c} C 200 ${20 + 15 * s}, 360 ${220 + 15 * c}, 620 ${120 + 15 * s} L 620 ${150 + 15 * s} C 360 ${260 + 15 * c}, 200 ${60 + 15 * s}, -60 ${120 + 15 * c} Z`} fill="url(#wp-b)" opacity={0.7} />
      </g>
    </svg>
  );
}

/** The macOS menu bar, with the app in front of the scene, and the illustrative-example note under it. */
function MenuBar({ app, note }: { app: string; note: number }) {
  return (
    <>
      <div data-screen="" data-ui="" className="absolute flex items-center gap-[14px]" style={{ left: 0, top: 48, width: 540, height: 24, paddingLeft: 36, paddingRight: 36, background: "rgba(14,16,22,0.72)", borderBottom: `1px solid ${LINE}` }}>
        <div style={{ filter: "brightness(0) invert(1)" }}>
          <Logo slug="apple" size={13} ancla={false} />
        </div>
        <span className="text-[13px] font-semibold" style={{ color: INK }}>{app}</span>
        {["Archivo", "Edición", "Ver"].map((m) => (
          <span key={m} className="text-[13px]" style={{ color: MUTED }}>{m}</span>
        ))}
        <span className="ml-auto font-mono text-[12px]" style={{ color: MUTED }}>lun 16 nov 9:42</span>
      </div>
      <div data-screen="" data-ui="" className="absolute font-mono text-[12px] tracking-[0.08em]" style={{ right: 36, top: 76, color: DIM, opacity: note }}>
        EJEMPLO ILUSTRATIVO
      </div>
    </>
  );
}

/** Three folders down the left, like Rick's desktop. */
function Folders() {
  return (
    <>
      {["Projects", "dotfiles", "Screenshots"].map((name, i) => (
        <div key={name} data-ui="" className="absolute flex flex-col items-center" style={{ left: 38, top: 96 + i * 66, width: 72 }}>
          <svg width={40} height={32} viewBox="0 0 40 32" aria-hidden>
            <path d="M2 6 Q2 3 5 3 L15 3 L18 6 L35 6 Q38 6 38 9 L38 28 Q38 30 35 30 L5 30 Q2 30 2 28 Z" fill="#3D8BE0" />
            <path d="M2 10 L38 10 L38 28 Q38 30 35 30 L5 30 Q2 30 2 28 Z" fill="#5FA8F5" />
          </svg>
          <span className="mt-[2px] text-[12px] font-medium" style={{ color: INK }}>{name}</span>
        </div>
      ))}
    </>
  );
}

/** The Dock, right of the signature: the scene's app bounces once and keeps its dot. */
function Dock({ active, since, t }: { active: DockId; since: number; t: number }) {
  return (
    <div className="absolute flex items-end gap-[4px] rounded-[14px] px-[7px] py-[5px]" style={{ left: 172, top: 894, background: "rgba(255,255,255,0.08)", border: `1px solid ${LINE}`, backdropFilter: "blur(10px)" }}>
      {DOCK.map((id) => {
        const on = id === active;
        const hop = on ? Math.sin(Math.PI * unit(t, since, 0.45)) * 7 : 0;
        return (
          <div key={id} className="flex flex-col items-center" style={{ transform: `translateY(${-hop}px)` }}>
            <AppIcon id={id} size={23} />
            <div className="mt-[2px] h-[3px] w-[3px] rounded-full" style={{ background: on ? INK : "transparent" }} />
          </div>
        );
      })}
    </div>
  );
}

/** How much the desktop dims in the scenes that leave it (the cons, the other systems, the close), under the avatar. */
const DIM_BY_SCENE: Record<string, number> = { contras: 0.45, windows: 0.6, linux: 0.6, cierre: 0.6 };

export function World() {
  const { ms, sceneId, sceneIndex, scenes } = useStage();
  const t = ms / 1000;
  const id = sceneId || "gancho";
  const prevId = sceneIndex > 0 ? scenes[sceneIndex - 1].id : id;
  const veil = lerp(DIM_BY_SCENE[prevId] ?? 0, DIM_BY_SCENE[id] ?? 0, EASE.inOut(unit(t, useSceneStart(id), 0.45)));
  const app = APPS[id] ?? APPS.gancho;
  const since = useSceneStart(id);
  const unixStart = useSceneStart("unix");
  const note = EASE.out(unit(t, unixStart, 0.4));
  // The hook plays on a plain dark stage; the desktop shows through as it ends.
  const hook = 1 - EASE.inOut(unit(t, unixStart - 0.55, 0.55));
  return (
    <div className="absolute left-0 top-0 overflow-hidden" style={{ width: 540, height: 960, background: BG }}>
      <Wallpaper t={t} />
      <Folders />
      <MenuBar app={app.name} note={note} />
      <Dock active={app.dock} since={since} t={t} />
      {veil > 0 ? <div className="absolute inset-0" style={{ background: `rgba(6,7,10,${veil})` }} /> : null}
      {hook > 0 ? (
        <div className="absolute inset-0" style={{ background: BG, opacity: hook }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 44%, rgba(139,133,255,0.16) 0%, rgba(11,13,18,0) 62%)" }} />
        </div>
      ) : null}
    </div>
  );
}
