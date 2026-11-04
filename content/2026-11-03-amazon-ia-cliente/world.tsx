import { Logo } from "@motor/ui";
import { Coin, EASE, Person, clamp01, es, fade, keys, popAt, unit, useStage, useStageCue } from "@motor/video";

/*
 * The world: a road from the dev's desk, buried in printed code, to the door
 * of their customer. The desk rolls toward the door when the note says where
 * the advantage is; what happened stays (the pile shrinks and never comes back).
 * The camera holds zoom 1 at CAM_Y, so world y is screen y.
 */

export const WORLD = { width: 1620, height: 960 };
export const CAM_Y = 427;
export const GROUND = 690;
export const DESK = { a: 270, b: 810, c: 1240 };
export const CAM_END = 1350;
export const DOOR_X = 1400;
export const PATHS = { camino: `M ${DESK.a} ${CAM_Y} L ${CAM_END} ${CAM_Y}` };
const MOVE = 0.9;
const INK = "var(--piece-ink)";
const ACCENT = "var(--piece-accent)";
const FIRE = "#FF6B2C";

/** Seconds from the start of the video to the start of a scene, and its length. */
function useSceneSpan(id: string): { start: number; dur: number } {
  const { scenes } = useStage();
  let start = 0;
  for (const s of scenes) {
    if (s.id === id) return { start: start / 1000, dur: s.durationMs / 1000 };
    start += s.durationMs;
  }
  throw new Error(`No scene ${id}`);
}

/** Where the desk is: it rides the camera's path in "clave" and "cierre", with the same easing. */
function useDeskX(t: number): number {
  const clave = useSceneSpan("clave");
  const cierre = useSceneSpan("cierre");
  const ride = (span: { start: number; dur: number }) => EASE.inOut(clamp01((t - span.start - MOVE) / Math.max(0.1, span.dur - MOVE)));
  if (t < cierre.start) return DESK.a + (DESK.b - DESK.a) * ride(clave);
  return DESK.b + (DESK.c - DESK.b) * ride(cierre);
}

function Road({ deskX }: { deskX: number }) {
  return (
    <>
      <div className="absolute" style={{ left: 0, top: GROUND, width: WORLD.width, height: WORLD.height - GROUND, background: "color-mix(in srgb, var(--piece-ink) 9%, var(--piece-bg))" }} />
      <div className="absolute" style={{ left: 0, top: GROUND, width: WORLD.width, height: 58, background: "color-mix(in srgb, var(--piece-ink) 78%, var(--piece-bg))" }} />
      {Array.from({ length: 28 }, (_, i) => (
        <div key={i} className="absolute rounded-full bg-white/80" style={{ left: i * 60 + 12, top: GROUND + 26, width: 30, height: 6 }} />
      ))}
      {/* Tire marks the desk leaves behind: the trip stays drawn. */}
      <div className="absolute" style={{ left: DESK.a, top: GROUND - 4, width: Math.max(0, deskX - DESK.a), height: 4, background: ACCENT, opacity: 0.7 }} />
    </>
  );
}

function Desk({ x, rolling }: { x: number; rolling: boolean }) {
  const spin = (x - DESK.a) * 2.2;
  return (
    <svg className="absolute overflow-visible" width={240} height={110} viewBox="0 0 240 110" style={{ left: x - 120, top: GROUND - 110 }} aria-hidden>
      <rect x={8} y={0} width={224} height={16} rx={4} fill={INK} />
      <rect x={20} y={16} width={20} height={70} fill={INK} opacity={0.85} />
      <rect x={200} y={16} width={20} height={70} fill={INK} opacity={0.85} />
      <rect x={130} y={16} width={70} height={40} rx={3} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
      <rect x={155} y={32} width={20} height={5} rx={2} fill={INK} />
      {[30, 210].map((cx) => (
        <g key={cx} transform={`translate(${cx} 96) rotate(${spin})`}>
          <circle r={13} fill={INK} />
          <circle r={5} fill="#FFFFFF" />
          <rect x={-1.5} y={-12} width={3} height={8} fill="#FFFFFF" />
        </g>
      ))}
      {rolling ? <path d="M -30 60 L -6 60 M -40 76 L -10 76 M -26 92 L -4 92" stroke={INK} strokeWidth={4} strokeLinecap="round" opacity={0.5} /> : null}
    </svg>
  );
}

function Monitor({ x }: { x: number }) {
  return (
    <svg className="absolute overflow-visible" width={92} height={86} viewBox="0 0 92 86" style={{ left: x - 108, top: GROUND - 110 - 86 }} aria-hidden>
      <rect x={0} y={0} width={92} height={64} rx={6} fill={INK} />
      <rect x={7} y={7} width={78} height={50} rx={3} fill="#1C2433" />
      {[14, 24, 34, 44].map((y, i) => (
        <rect key={y} x={13} y={y} width={[40, 56, 30, 48][i]} height={4} rx={2} fill={i === 1 ? ACCENT : "#9FE870"} opacity={0.9} />
      ))}
      <rect x={40} y={64} width={12} height={14} fill={INK} />
      <rect x={24} y={78} width={44} height={8} rx={3} fill={INK} />
    </svg>
  );
}

/** The pile of printed code: 14 sheets that come in the hook and leave in three moments. */
function Pile({ x, t }: { x: number; t: number }) {
  const born0 = -0.9;
  const born1 = useStageCue("gancho", "valor");
  const cut = useStageCue("lineas", "simplificar");
  const claveA = useStageCue("clave", "producto");
  const claveB = useStageCue("clave", "clientes");
  const cierre = useSceneSpan("cierre").start;
  const sheets = Array.from({ length: 14 }, (_, i) => {
    const born = born0 + ((born1 - born0) * i) / 13;
    const gone = i >= 7 ? cut + (13 - i) * 0.05 : i >= 2 ? claveA + ((claveB - claveA) * (6 - i)) / 4 : cierre + 0.4 + (1 - i) * 0.15;
    return { i, born, gone };
  });
  return (
    <>
      {sheets.map(({ i, born, gone }) => {
        if (t < born) return null;
        const p = popAt(t, born);
        const off = EASE.in(unit(t, gone, 0.7));
        if (off >= 1) return null;
        const wobble = Math.sin(i * 1.7) * 4;
        return (
          <div
            key={i}
            className="absolute rounded-[3px] border-2 bg-white"
            style={{
              left: x - 30 + Math.sin(i * 2.3) * 6,
              top: GROUND - 110 - 18 * (i + 1),
              width: 118,
              height: 17,
              borderColor: INK,
              opacity: Math.min(1, p * 2) * (1 - off),
              transform: `translate(${off * 320}px, ${-off * 260 + (1 - Math.min(1, p)) * -30}px) rotate(${wobble + off * 50}deg)`,
            }}
          >
            <div className="absolute left-2 top-[5px] h-[3px] w-[60px] rounded bg-ink/60" />
            <div className="absolute left-[72px] top-[5px] h-[3px] w-[30px] rounded" style={{ background: ACCENT }} />
          </div>
        );
      })}
    </>
  );
}

/** The hook's line counter and stamp, stuck on the pile: world labels of one or two words. */
function PileLabels({ x, t }: { x: number; t: number }) {
  const a = useStageCue("gancho", "más");
  const b = useStageCue("gancho", "valor");
  const leave = useSceneSpan("quien").start;
  const out = fade(t, leave, 0.3);
  if (out >= 1) return null;
  const n = Math.round(keys(t, [[a, 0], [b, 99999]], EASE.in));
  const stamp = popAt(t, b);
  return (
    <>
      <div className="absolute whitespace-nowrap rounded-xl border-[3px] border-ink bg-white px-3 py-1 font-mono text-[24px] font-bold" style={{ left: x - 70, top: 392, opacity: (1 - out) * fade(t, 0, 0.2), transform: "rotate(-4deg)" }}>
        LÍNEAS <span style={{ color: ACCENT }}>{es(n)}</span>
      </div>
      {t >= b ? (
        <div
          className="absolute whitespace-nowrap rounded-xl border-[5px] bg-white/85 px-3 py-1 font-display text-[40px] font-extrabold uppercase leading-none"
          style={{ left: x + 62, top: 342, color: "#E5352B", borderColor: "#E5352B", opacity: (1 - out) * Math.min(1, stamp * 3), transform: `translate(-50%, -50%) rotate(-9deg) scale(${2.2 - 1.2 * Math.min(1, stamp)})` }}
        >
          No suma
        </div>
      ) : null}
    </>
  );
}

/** Tokens burnt for nothing: coins fly from the screen into a barrel on fire, and the desk does not move. */
function Burner({ t }: { t: number }) {
  const span = useSceneSpan("tokens");
  const a = useStageCue("tokens", "tokens");
  const b = useStageCue("tokens", "frugalidad");
  const leave = useSceneSpan("hallazgo").start;
  const show = fade(t, span.start, 0.3) * (1 - fade(t, leave, 0.4));
  if (show <= 0) return null;
  const from = { x: DESK.a - 62, y: GROUND - 180 };
  const to = { x: 470, y: GROUND - 70 };
  const flick = (k: number) => 1 + Math.sin(t * 19 + k) * 0.12 + Math.sin(t * 7 + k * 2) * 0.08;
  return (
    <div className="absolute inset-0" style={{ opacity: show }}>
      <svg className="absolute overflow-visible" width={90} height={150} viewBox="0 0 90 150" style={{ left: to.x - 45, top: GROUND - 150 }} aria-hidden>
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M ${25 + k * 20} 70 Q ${10 + k * 22} ${40 - k * 6} ${30 + k * 15} ${8 + k * 4} Q ${48 + k * 12} ${44 - k * 4} ${45 + k * 18} 70 Z`} fill={k === 1 ? "#FFC23D" : FIRE} style={{ transform: `scaleY(${flick(k)})`, transformOrigin: "50% 70px" }} />
        ))}
        <rect x={6} y={66} width={78} height={84} rx={8} fill={INK} />
        <rect x={6} y={88} width={78} height={6} fill="#FFFFFF" opacity={0.25} />
        <rect x={6} y={118} width={78} height={6} fill="#FFFFFF" opacity={0.25} />
      </svg>
      {Array.from({ length: 9 }, (_, i) => {
        const at = a + ((b - a) * i) / 8;
        const p = unit(t, at, 0.75);
        if (p <= 0 || p >= 1) return null;
        const x = from.x + (to.x - from.x) * p;
        const y = from.y + (to.y - from.y) * p - Math.sin(p * Math.PI) * 120;
        return <Coin key={i} x={x} y={y} s={0.9} />;
      })}
    </div>
  );
}

/** A finished piece the desk sends down the road; it waits at the door. */
function Parcel({ t }: { t: number }) {
  const at = useStageCue("resultado", "resultado");
  if (t < at) return null;
  const p = popAt(t, at);
  const x = keys(t, [[at + 0.5, DESK.b + 70], [at + 2.4, DOOR_X + 112]], EASE.inOut);
  return (
    <svg className="absolute overflow-visible" width={64} height={56} viewBox="0 0 64 56" style={{ left: x - 32, top: GROUND - 56 - (1 - Math.min(1, p)) * 60 }} aria-hidden>
      <rect x={0} y={8} width={64} height={48} rx={4} fill="#C98A4B" stroke={INK} strokeWidth={3} />
      <rect x={28} y={8} width={8} height={48} fill={ACCENT} />
      <path d="M 0 8 L 10 0 L 54 0 L 64 8 Z" fill="#E0A564" stroke={INK} strokeWidth={3} />
    </svg>
  );
}

/** The leader who hears rumors instead of trying it. */
function Leader({ t }: { t: number }) {
  const at = useSceneSpan("lideres").start + 0.2;
  if (t < at) return null;
  const p = popAt(t, at);
  return (
    <div className="absolute inset-0" style={{ opacity: Math.min(1, p * 2) }}>
      <Person x={DESK.b + 150} y={GROUND} s={1.9 * (0.7 + 0.3 * Math.min(1, p))} color={ACCENT} />
    </div>
  );
}

/** The customer's shop: its door opens when the close says "cliente". */
function Shop({ t }: { t: number }) {
  const open = useStageCue("cierre", "cliente");
  const o = EASE.out(unit(t, open, 0.5));
  const who = popAt(t, open + 0.2);
  const cierre = useSceneSpan("cierre");
  const label = fade(t, open, 0.3) * (1 - fade(t, cierre.start + cierre.dur, 0.2));
  return (
    <>
      <svg className="absolute overflow-visible" width={210} height={300} viewBox="0 0 210 300" style={{ left: DOOR_X - 40, top: GROUND - 300 }} aria-hidden>
        <rect x={0} y={40} width={210} height={260} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={i * 30} y={20} width={30} height={34} fill={i % 2 ? "#FFFFFF" : ACCENT} stroke={INK} strokeWidth={3} />
        ))}
        <rect x={22} y={150} width={84} height={150} fill="#1C2433" />
        <rect x={22} y={150} width={84} height={150} fill="#F2E6C9" stroke={INK} strokeWidth={4} style={{ transform: `scaleX(${1 - 0.82 * o})`, transformOrigin: "22px 0" }} />
        <circle cx={92} cy={228} r={5} fill={INK} opacity={1 - o} />
        <rect x={128} y={110} width={64} height={70} fill="#BFE3FF" stroke={INK} strokeWidth={4} />
      </svg>
      {t >= open + 0.2 ? <Person x={DOOR_X + 24} y={GROUND} s={1.9 * (0.6 + 0.4 * Math.min(1, who))} color="#E5352B" /> : null}
      {label > 0 ? (
        <div className="absolute whitespace-nowrap rounded-xl border-[3px] border-ink bg-white px-3 py-1 font-mono text-[24px] font-bold" style={{ left: DOOR_X - 60, top: GROUND - 350, opacity: label, transform: "rotate(3deg)" }}>
          TU CLIENTE
        </div>
      ) : null}
    </>
  );
}

export function World() {
  const { ms } = useStage();
  const t = ms / 1000;
  const deskX = useDeskX(t);
  const clave = useSceneSpan("clave");
  const cierre = useSceneSpan("cierre");
  const rolling = (t > clave.start + MOVE && t < clave.start + clave.dur - 0.2) || (t > cierre.start + MOVE && t < cierre.start + cierre.dur - 0.2);
  const logoAt = useStageCue("gancho", "Amazon");
  const logoOut = useSceneSpan("quien").start;
  const logo = popAt(t, logoAt) * (1 - fade(t, logoOut, 0.3));
  return (
    <div className="absolute left-0 top-0" style={{ width: WORLD.width, height: WORLD.height }}>
      <Road deskX={deskX} />
      <Shop t={t} />
      <Person x={deskX - 40} y={GROUND - 30} s={1.7} color="#5B8DEF" />
      <Monitor x={deskX} />
      <Pile x={deskX} t={t} />
      <Desk x={deskX} rolling={rolling} />
      <Burner t={t} />
      <Parcel t={t} />
      <Leader t={t} />
      <PileLabels x={deskX} t={t} />
      {t >= logoAt && logo > 0 ? (
        <div className="absolute rounded-2xl border-[3px] border-ink bg-white px-4 py-3" style={{ left: 30, top: 300, opacity: Math.min(1, logo * 2), transform: `rotate(5deg) scale(${0.6 + 0.4 * Math.min(1, logo)})` }}>
          <Logo slug="amazon" size={130} />
        </div>
      ) : null}
    </div>
  );
}
