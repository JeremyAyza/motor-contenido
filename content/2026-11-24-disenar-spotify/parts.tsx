import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img } from "remotion";
import { useAssets } from "@motor/ui";
import { DUR, EASE, fade, popAt, unit, useClock, useStage, useStageCue } from "@motor/video";
import { BG, DIM, G, G2, INK, LINE, MUTED, PANEL, RED } from "./world.tsx";

/*
 * The parts every scene shares, after Rick's Spotify Reel: the HUD (section
 * kicker, step counter and the rail of six systems that light up), his
 * condensed white titles, mono labels under each object, chips, album covers
 * (generated, in img/), bitrate bars, storage cylinders, a line of CDN nodes,
 * stick people, a laptop, a phone and the X that crosses things out.
 */

const ORDER = ["gancho", "almacenamiento", "play", "cdn", "buffer", "busqueda", "recomendaciones", "lotes", "medianoche", "estado", "mapa", "cierre"];

export const KICKERS: Record<string, string> = {
  gancho: "DISEÑO DE SISTEMAS",
  almacenamiento: "ALMACENAMIENTO",
  play: "REPRODUCCIÓN",
  cdn: "ENTREGA",
  buffer: "AL INSTANTE",
  busqueda: "BÚSQUEDA",
  recomendaciones: "RECOMENDACIONES",
  lotes: "PROCESOS EN LOTE",
  medianoche: "ESCALA",
  estado: "TU ESTADO",
  mapa: "TODO JUNTO",
  cierre: "LO DIFÍCIL",
};

export const SYSTEMS = ["ALMACÉN", "CDN", "ÍNDICE", "RECOS", "LOTES", "ESTADO"];

/** When each system of the rail lights up, in seconds of the whole video. */
function useRail(): number[] {
  return [
    useStageCue("almacenamiento", "guardar"),
    useStageCue("cdn", "CDN"),
    useStageCue("busqueda", "índice"),
    useStageCue("recomendaciones", "sistema"),
    useStageCue("lotes", "lote"),
    useStageCue("estado", "distribuidas"),
  ];
}

/** Rick's HUD: the section on the left, the step on the right and the rail of six systems under them. */
function Hud() {
  const { sceneId, ms } = useStage();
  const now = ms / 1000;
  const rail = useRail();
  const i = ORDER.indexOf(sceneId);
  // The rail runs from x 74 to 466 so its end labels stay inside the 36 px margin.
  const x0 = 74;
  const step = (466 - x0) / 5;
  const lit = rail.filter((at) => now >= at).length;
  const fill = lit === 0 ? 0 : Math.min(1, (lit - 1) / 5);
  return (
    <div data-ui="" className="absolute" style={{ left: 36, top: 52, width: 468 }}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[13px] font-bold tracking-[0.12em]" style={{ color: MUTED }}>{KICKERS[sceneId] ?? ""}</span>
        <span className="font-mono text-[13px] font-bold tracking-[0.12em]" style={{ color: MUTED }}>{String(i + 1).padStart(2, "0")} / 12</span>
      </div>
      <div className="relative mt-[12px]" style={{ height: 34 }}>
        <div className="absolute" style={{ left: x0 - 36, top: 5, width: step * 5, height: 1.5, background: LINE }} />
        <div className="absolute" style={{ left: x0 - 36, top: 5, width: step * 5 * fill, height: 1.5, background: G }} />
        {SYSTEMS.map((name, k) => {
          const on = now >= rail[k];
          const pulse = on ? popAt(now, rail[k]) : 1;
          return (
            <div key={name} className="absolute flex flex-col items-center" style={{ left: x0 - 36 + k * step, top: 0, transform: "translateX(-50%)" }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: on ? G : BG, border: `1.5px solid ${on ? G : DIM}`, boxShadow: on ? `0 0 10px ${G}` : "none", transform: `scale(${pulse})` }} />
              <span className="mt-[5px] font-mono text-[12px] font-bold tracking-[0.06em]" style={{ color: on ? G : DIM }}>{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** The whole 540×960 canvas, from its top-left corner, for a scene's Visual, with the HUD on top. */
export function Layer({ children }: { children: ReactNode }) {
  return (
    <AbsoluteFill className="pointer-events-none" style={{ top: -42, bottom: "auto", height: 960 }}>
      <Hud />
      {children}
    </AbsoluteFill>
  );
}

/** 0 → 1 from `at` over `dur`, eased. */
export function useOn(at: number, dur = 0.3): number {
  const t = useClock();
  return EASE.out(unit(t, at, dur));
}

/** Pop-in progress and opacity for something that enters at `at` and leaves at `until`. */
export function usePresence(at: number, until?: number): { p: number; o: number; on: boolean } {
  const t = useClock();
  const p = popAt(t, at);
  const out = until === undefined ? 0 : fade(t, until, DUR.quick);
  return { p, o: Math.min(1, p * 2) * (1 - out), on: t >= at && out < 1 };
}

const condensed: CSSProperties = { fontFamily: "var(--font-display)", fontWeight: 800, fontStretch: "75%", textTransform: "uppercase", letterSpacing: "0.01em", color: INK };

/**
 * Rick's title: condensed, bold, white, uppercase, typed in letter by letter.
 * By default it sits to the right of the avatar; `big` puts it large on the left.
 */
export function Title({ text, at, until, x = 214, y = 600, w = 290, size, big = false, color = INK, align = "left", typed = true }: { text: string; at: number; until?: number; x?: number; y?: number; w?: number; size?: number; big?: boolean; color?: string; align?: "left" | "center"; typed?: boolean }) {
  const t = useClock();
  // It starts a beat before its word and types fast, so it never trails the voice.
  const start = typed ? at - 0.2 : at;
  if (t < start) return null;
  // It is gone by `until` - 0.1, before the next title (which starts 0.2 s early) comes in.
  const out = until === undefined ? 0 : fade(t, until - 0.25, 0.15);
  if (out >= 1) return null;
  const n = typed ? Math.min(text.length, Math.floor((t - start) / 0.012) + 1) : text.length;
  const s = size ?? (big ? 62 : 38);
  return (
    <div className="absolute" style={{ left: big ? 36 : x, top: y, width: big ? 468 : w, opacity: 1 - out, textAlign: align }}>
      <div style={{ ...condensed, color, fontSize: s, lineHeight: 1.04 }}>
        {text.slice(0, n)}
        <span style={{ opacity: 0 }}>{text.slice(n)}</span>
      </div>
    </div>
  );
}

/** A tiny mono label under an object, like Rick's "OBJECT STORAGE". Centered on x. */
export function Mono({ x, y, at, until, children, color = MUTED, size = 14, align = "center" }: { x: number; y: number; at: number; until?: number; children: ReactNode; color?: string; size?: number; align?: "center" | "left" }) {
  const { o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  return (
    <div data-ui="" className="absolute whitespace-nowrap font-mono font-bold uppercase tracking-[0.12em]" style={{ left: x, top: y, fontSize: size, color, opacity: o, transform: align === "center" ? "translateX(-50%)" : undefined }}>
      {children}
    </div>
  );
}

/** A small bordered chip, like Rick's "QUALITIES" or "OGG VORBIS". Centered on x, y. */
export function Chip({ x, y, at, until, children, color = INK, border = LINE, solid = false, size = 13, crossed }: { x: number; y: number; at: number; until?: number; children: ReactNode; color?: string; border?: string; solid?: boolean; size?: number; crossed?: number }) {
  const t = useClock();
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  const cross = crossed === undefined ? 0 : EASE.out(unit(t, crossed, 0.25));
  return (
    <div
      data-ui=""
      className="absolute whitespace-nowrap rounded-[5px] px-[10px] py-[6px] font-mono font-bold uppercase leading-none tracking-[0.1em]"
      style={{ left: x, top: y, fontSize: size, color: solid ? BG : color, background: solid ? G : "rgba(10,16,13,0.92)", border: `1.5px solid ${solid ? G : border}`, opacity: o * (1 - 0.45 * cross), transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * Math.min(1, p)})` }}
    >
      {children}
      {cross > 0 ? <div className="absolute left-[4px] top-1/2" style={{ height: 3, width: `calc(${cross * 100}% - 8px)`, background: RED }} /> : null}
    </div>
  );
}

/** A dark card with a thin border and a mono header, like Rick's "BACK END". */
export function Card({ x, y, w, h, at, until, title, children, color = LINE, glow = false }: { x: number; y: number; w: number; h: number; at: number; until?: number; title?: string; children?: ReactNode; color?: string; glow?: boolean }) {
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  return (
    <div className="absolute rounded-[8px]" style={{ left: x, top: y, width: w, height: h, background: PANEL, border: `1.5px solid ${color}`, boxShadow: glow ? `0 0 18px ${G}44` : "0 14px 30px rgba(0,0,0,0.5)", opacity: o, transform: `translateY(${(1 - Math.min(1, p)) * 14}px)` }}>
      {title ? (
        <div data-ui="" className="px-[12px] pt-[10px] font-mono text-[12px] font-bold tracking-[0.14em]" style={{ color: MUTED }}>
          {title}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/** One generated album cover from img/cover-NN.png (1 to 14). */
export function Cover({ n, x, y, size, at, until, dim = 0, ring = false, style }: { n: number; x: number; y: number; size: number; at: number; until?: number; dim?: number; ring?: boolean; style?: CSSProperties }) {
  const { p, o, on } = usePresence(at, until);
  const url = useAssets().image(`img/cover-${String(((n - 1) % 14) + 1).padStart(2, "0")}.png`);
  if (!on && o <= 0) return null;
  return (
    <div className="absolute overflow-hidden rounded-[3px]" style={{ left: x, top: y, width: size, height: size, opacity: o * (1 - dim), transform: `scale(${0.8 + 0.2 * Math.min(1, p)})`, border: ring ? `2px solid ${INK}` : undefined, boxShadow: ring ? "0 12px 30px rgba(0,0,0,0.6)" : undefined, ...style }}>
      <Img src={url} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
}

/** A grid of covers that fall in one by one from `at`. */
export function CoverGrid({ x, y, cols, rows, size, gap = 6, at, until, dim = 0, offset = 0, stagger = 0.03 }: { x: number; y: number; cols: number; rows: number; size: number; gap?: number; at: number; until?: number; dim?: number; offset?: number; stagger?: number }) {
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = r * cols + c;
      cells.push(<Cover key={k} n={((k * 5 + offset) % 14) + 1} x={x + c * (size + gap)} y={y + r * (size + gap)} size={size} at={at + k * stagger} until={until} dim={dim} />);
    }
  }
  return <>{cells}</>;
}

/** Rick's bitrate bars: 320, 160, 96 and 24 kbps, growing one by one. `hot` lights one of them. */
export function Bitrates({ x, y, at, until, hot, arrow, label = "VERSIONES CODIFICADAS", scale = 1 }: { x: number; y: number; at: number; until?: number; hot?: { index: number; at: number }[]; arrow?: number; label?: string; scale?: number }) {
  const t = useClock();
  const { o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  const kbps = [320, 160, 96, 24];
  const lit = hot?.filter((h) => t >= h.at).slice(-1)[0]?.index;
  return (
    <div className="absolute" style={{ left: x, top: y, opacity: o, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
      {label ? <div data-ui="" className="mb-[10px] font-mono text-[12px] font-bold tracking-[0.14em]" style={{ color: MUTED }}>{label}</div> : null}
      {kbps.map((k, i) => {
        const grow = EASE.out(unit(t, at + 0.15 + i * 0.18, 0.45));
        const isHot = lit === i;
        const isArrow = arrow !== undefined && t >= arrow && i === 2;
        return (
          <div key={k} className="mb-[10px] flex items-center">
            <span data-ui="" className="w-[18px] font-mono text-[14px] font-bold" style={{ color: isArrow ? G : "transparent" }}>▶</span>
            <span data-ui="" className="w-[44px] text-right font-mono text-[15px] font-bold" style={{ color: isHot || isArrow ? INK : MUTED }}>{k}</span>
            <span data-ui="" className="ml-[4px] w-[38px] font-mono text-[12px]" style={{ color: MUTED }}>kbps</span>
            <div style={{ height: 22, width: (k / 320) * 250 * grow + 10, background: isHot || isArrow ? G : G2, boxShadow: isHot || isArrow ? `0 0 14px ${G}` : "none", borderRadius: 2 }} />
          </div>
        );
      })}
    </div>
  );
}

/** A storage cylinder, outlined, with bars inside like Rick's. Centered on x; y is its top. */
export function Cylinder({ x, y, w = 70, h = 84, at, until, glyph, color = G }: { x: number; y: number; w?: number; h?: number; at: number; until?: number; glyph?: ReactNode; color?: string }) {
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  const ry = w * 0.16;
  return (
    <div className="absolute" style={{ left: x - w / 2, top: y, width: w, height: h + ry * 2, opacity: o, transform: `translateY(${(1 - Math.min(1, p)) * 18}px)` }}>
      <svg width={w} height={h + ry * 2} style={{ overflow: "visible" }} aria-hidden>
        <path d={`M1 ${ry} L1 ${h + ry} A${w / 2 - 1} ${ry} 0 0 0 ${w - 1} ${h + ry} L${w - 1} ${ry}`} fill="rgba(10,18,14,0.9)" stroke={color} strokeWidth={2} />
        <ellipse cx={w / 2} cy={ry} rx={w / 2 - 1} ry={ry} fill="rgba(10,18,14,1)" stroke={color} strokeWidth={2} />
        {glyph ? null : [0, 1, 2].map((i) => <rect key={i} x={w * 0.2} y={ry * 2 + 10 + i * 16} width={w * (0.6 - i * 0.12)} height={7} rx={1} fill={color} opacity={0.85} />)}
      </svg>
      {glyph ? <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: ry, color }}>{glyph}</div> : null}
    </div>
  );
}

/** A big X that slams in, like Rick's. Centered on x, y. */
export function XMark({ x, y, size = 80, at, until, color = INK, box = false }: { x: number; y: number; size?: number; at: number; until?: number; color?: string; box?: boolean }) {
  const t = useClock();
  const { o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  const s = 1.6 - 0.6 * EASE.back(unit(t, at, 0.3));
  return (
    <div className="absolute flex items-center justify-center" style={{ left: x - size / 2, top: y - size / 2, width: size, height: size, opacity: o, transform: `scale(${s})`, background: box ? "#0B110E" : undefined, border: box ? `2px solid ${INK}` : undefined, borderRadius: box ? 4 : 0 }}>
      <svg width={size * (box ? 0.6 : 1)} height={size * (box ? 0.6 : 1)} viewBox="0 0 10 10" aria-hidden>
        <path d="M1 1 L9 9 M9 1 L1 9" stroke={color} strokeWidth={box ? 0.9 : 0.7} strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** A stick person, Rick's pictogram. */
export function Person({ x, y, s = 1, color = INK, o = 1 }: { x: number; y: number; s?: number; color?: string; o?: number }) {
  return (
    <svg className="absolute" style={{ left: x, top: y, opacity: o }} width={16 * s} height={22 * s} viewBox="0 0 16 22" aria-hidden>
      <circle cx={8} cy={5} r={3.6} fill="none" stroke={color} strokeWidth={1.6} />
      <path d="M2 21 Q2 11 8 11 Q14 11 14 21" fill="none" stroke={color} strokeWidth={1.6} />
    </svg>
  );
}

/** A crowd of stick people that appears in a wave from `at`. */
export function Crowd({ x, y, cols, rows, at, until, gapX = 34, gapY = 34, s = 1, color = INK }: { x: number; y: number; cols: number; rows: number; at: number; until?: number; gapX?: number; gapY?: number; s?: number; color?: string }) {
  const t = useClock();
  const out = until === undefined ? 0 : fade(t, until, DUR.quick);
  if (t < at || out >= 1) return null;
  const people = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = (r + c) * 0.035;
      const o = EASE.out(unit(t, at + k, 0.2)) * (1 - out);
      if (o > 0) people.push(<Person key={`${r}-${c}`} x={x + c * gapX} y={y + r * gapY} s={s} color={color} o={o} />);
    }
  }
  return <>{people}</>;
}

/** A phone outline. x, y is its top-left. `lit` turns the screen on. */
export function PhoneShape({ x, y, w = 50, h = 90, lit = 0, children, color = INK }: { x: number; y: number; w?: number; h?: number; lit?: number; children?: ReactNode; color?: string }) {
  return (
    <div className="absolute rounded-[9px]" style={{ left: x, top: y, width: w, height: h, border: `2px solid ${color}`, background: `rgba(30,215,96,${0.1 * lit})`, boxShadow: lit ? `0 0 ${16 * lit}px ${G}55` : "none" }}>
      <div className="absolute left-1/2 top-[4px] h-[3px] w-[14px] -translate-x-1/2 rounded-full" style={{ background: color }} />
      {children}
    </div>
  );
}

/** A laptop outline. x, y is the top-left of its screen. */
export function LaptopShape({ x, y, w = 150, h = 92, children, color = INK }: { x: number; y: number; w?: number; h?: number; children?: ReactNode; color?: string }) {
  return (
    <div className="absolute" style={{ left: x, top: y, width: w, height: h + 10 }}>
      <div className="absolute rounded-[6px]" style={{ left: 0, top: 0, width: w, height: h, border: `2px solid ${color}`, background: "rgba(10,16,13,0.9)" }}>{children}</div>
      <div className="absolute rounded-[3px]" style={{ left: -16, top: h + 2, width: w + 32, height: 6, background: color }} />
    </div>
  );
}

/**
 * Rick's line of nodes from the origin to you: a cylinder on the left, a phone
 * on the right and green nodes in between that light up one by one from
 * `nodesAt`; a pulse travels to the phone. `cut` crosses out the long road to
 * the origin.
 */
export function NodeLine({ y, at, until, nodesAt, count = 4, pulse = true, cut, copies }: { y: number; at: number; until?: number; nodesAt: number; count?: number; pulse?: boolean; cut?: number; copies?: number }) {
  const t = useClock();
  const { o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  const x0 = 96;
  const x1 = 440;
  const step = (x1 - x0) / (count + 1);
  const lastOn = nodesAt + (count - 1) * 0.18;
  const travel = pulse ? unit(t, lastOn + 0.2, 0.9) % 1 : 0;
  const cutK = cut === undefined ? 0 : EASE.out(unit(t, cut, 0.3));
  return (
    <div className="absolute left-0 top-0" style={{ width: 540, height: 960, opacity: o }}>
      <div className="absolute" style={{ left: x0, top: y, width: x1 - x0, height: 1.5, background: LINE }} />
      <div style={{ opacity: 1 - 0.6 * cutK }}>
        <Cylinder x={x0 - 26} y={y - 34} w={52} h={48} at={at} />
        <Mono x={x0 - 26} y={y + 34} at={at}>ORIGEN</Mono>
      </div>
      {Array.from({ length: count }, (_, i) => {
        const nx = x0 + step * (i + 1);
        const k = EASE.out(unit(t, nodesAt + i * 0.18, 0.25));
        const copy = copies !== undefined && t >= copies + i * 0.18;
        return (
          <div key={i} className="absolute flex items-center justify-center rounded-[4px]" style={{ left: nx - 13, top: y - 13, width: 26, height: 26, border: `1.5px solid ${k > 0 ? G : DIM}`, background: BG, boxShadow: k > 0.5 ? `0 0 ${10 * k}px ${G}88` : "none", transform: `scale(${0.6 + 0.4 * k})` }}>
            <div style={{ width: copy ? 12 : 9, height: copy ? 12 : 9, borderRadius: copy ? 2 : 99, background: k > 0 ? G : DIM }} />
          </div>
        );
      })}
      {pulse && t > lastOn + 0.2 ? <div className="absolute rounded-full" style={{ left: x0 + step + (x1 - x0 - step) * travel - 5, top: y - 5, width: 10, height: 10, background: INK, boxShadow: `0 0 12px ${G}` }} /> : null}
      <PhoneShape x={x1 + 4} y={y - 34} w={38} h={68} lit={EASE.out(unit(t, lastOn + 0.4, 0.3))} />
      <Mono x={x1 + 23} y={y + 42} at={at} color={INK}>TÚ</Mono>
      {cutK > 0 ? <XMark x={x0 + step / 2 + 4} y={y} size={54} at={cut!} color={RED} /> : null}
    </div>
  );
}

/** A play button, Spotify-green. Centered on x, y. */
export function PlayButton({ x, y, size = 44, at, until, paused = false }: { x: number; y: number; size?: number; at: number; until?: number; paused?: boolean }) {
  const { p, o, on } = usePresence(at, until);
  if (!on && o <= 0) return null;
  return (
    <div className="absolute flex items-center justify-center rounded-full" style={{ left: x - size / 2, top: y - size / 2, width: size, height: size, background: G, opacity: o, transform: `scale(${Math.max(0, p)})`, boxShadow: `0 0 18px ${G}88` }}>
      {paused ? (
        <div className="flex gap-[4px]"><div style={{ width: size * 0.12, height: size * 0.4, background: BG }} /><div style={{ width: size * 0.12, height: size * 0.4, background: BG }} /></div>
      ) : (
        <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 10 10" style={{ marginLeft: size * 0.06 }} aria-hidden><path d="M1 0 L10 5 L1 10 Z" fill={BG} /></svg>
      )}
    </div>
  );
}
