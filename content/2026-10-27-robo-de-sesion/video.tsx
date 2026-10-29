import type { CSSProperties, ReactNode } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Icono } from "@motor/ui";
import { defineVideo, Sfx, useCue, usePop, useStage, useStageCue } from "@motor/video";

// Tu navegador y el sitio, unidos por una línea; por ella viaja la contraseña una vez, después
// la cookie de sesión y al final la misma cookie desde otro navegador (video.json → world).
// La cookie sid=8f2b, el dominio, las ventanas y la prueba controlada son ilustrativos;
// las cifras y las citas salen de facts.json.

const W = 540;
const SEC = 960;
const VIEW_Y = 427;
const Y = { hook: 0, cookie: 960, park: 1920, theft: 2880, test: 3840, name: 4800, help: 5760, end: 6720 };
const H = 7680;
const shot = (y: number, zoom = 1) => ({ focus: { x: W / 2, y: y + VIEW_Y }, zoom });

const GOLD = "#F5C04A";
const RED = "#FF5C6C";
const GREEN = "#5BD68A";
const SURF = "#211B2C";
const INK = "#F4EFE6";
const DEEP = "#0E0B14";
const SID = "sid=8f2b";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (t: number, at: number, dur = 0.3) => interpolate(t, [at, at + dur], [0, 1], clamp);
const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

function useT() {
  return useStage().ms / 1000;
}

/* ---------- Building blocks ---------- */

function At({ x, y, w, h, style, className, children }: { x: number; y: number; w?: number; h?: number; style?: CSSProperties; className?: string; children?: ReactNode }) {
  return (
    <div className={`absolute ${className ?? ""}`} style={{ left: x, top: y, width: w, height: h, ...style }}>
      {children}
    </div>
  );
}

/** A screen-sized part of the world, drawn only while the camera sees it. */
function Section({ y, glow, children }: { y: number; glow?: string; children: ReactNode }) {
  const { camera } = useStage();
  const top = camera.y - VIEW_Y / camera.zoom;
  const bottom = camera.y + (SEC - VIEW_Y) / camera.zoom;
  if (bottom <= y + 1 || top >= y + SEC - 1) return null;
  return (
    <At x={0} y={y} w={W} h={SEC}>
      {glow ? <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 45% at 50% 48%, ${glow}33, transparent 70%)` }} /> : null}
      {children}
    </At>
  );
}

/** Pops in at `at` with a spring and leaves at `until`. */
function Appear({ at, until, x, y, w, h, sound, children }: { at: number; until?: number; x: number; y: number; w?: number; h?: number; sound?: string; children: ReactNode }) {
  const t = useT();
  const p = usePop(at);
  const out = until === undefined ? 0 : fade(t, until, 0.3);
  if (t < at || out >= 1) return null;
  return (
    <At x={x} y={y} w={w} h={h} style={{ opacity: Math.min(1, p * 1.6) * (1 - out), transform: `translateY(${(1 - Math.min(1, p)) * 16}px) scale(${0.9 + 0.1 * p})`, transformOrigin: "50% 60%" }}>
      {sound ? <Sfx id={sound} at={at} volume={0.3} /> : null}
      {children}
    </At>
  );
}

/** A short sign of the world (1 to 3 words), placed by its center. */
function Tag({ at, x, y, color, until, children }: { at: number; x: number; y: number; color?: string; until?: number; children: ReactNode }) {
  return (
    <Appear at={at} until={until} x={x} y={y} sound="blip">
      <span
        className="flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 font-mono text-[19px] font-bold uppercase leading-none"
        style={{ background: color ?? SURF, color: color ? DEEP : INK }}
      >
        {children}
      </span>
    </Appear>
  );
}

/** A big word of the idea, stacked, that slams in. */
function Slam({ at, x, y, color, size = 58, children }: { at: number; x: number; y: number; color: string; size?: number; children: ReactNode }) {
  const t = useT();
  if (t < at) return null;
  const p = interpolate(t, [at, at + 0.18], [1.5, 1], clamp);
  return (
    <At x={x} y={y} w={W - 2 * x} style={{ transform: `scale(${p})`, transformOrigin: "50% 50%", opacity: fade(t, at, 0.08) }}>
      <Sfx id="golpe" at={at} volume={0.35} />
      <p className="text-center font-display font-black uppercase leading-[0.95] tracking-tight" style={{ color, fontSize: size, textShadow: `0 0 30px ${color}55` }}>
        {children}
      </p>
    </At>
  );
}

/** A card of an interface (data-ui): its text does not count as text to read. */
function Card({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div data-ui="" className={`rounded-[14px] border font-mono text-ink shadow-[0_14px_30px_rgba(0,0,0,0.45)] ${className ?? ""}`} style={{ background: SURF, borderColor: "rgba(244,239,230,0.12)", ...style }}>
      {children}
    </div>
  );
}

/** A browser window: dots, an address and a body. */
function BrowserWindow({ url, children, border }: { url: string; children: ReactNode; border?: string }) {
  return (
    <div data-ui="" className="overflow-hidden rounded-[12px] border font-mono shadow-[0_16px_34px_rgba(0,0,0,0.5)]" style={{ background: DEEP, borderColor: border ?? "rgba(244,239,230,0.14)" }}>
      <div className="flex items-center gap-1.5 border-b px-3 py-1.5" style={{ borderColor: "rgba(244,239,230,0.08)", background: SURF }}>
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-2 flex-1 rounded-full bg-black/30 px-3 py-0.5 text-[14px] text-muted">{url}</span>
      </div>
      {children}
    </div>
  );
}

/** The session cookie as a pill: gold while it is yours, red once it is stolen. */
function CookiePill({ stolen = 0, size = 19 }: { stolen?: number; size?: number }) {
  const color = stolen > 0.5 ? RED : GOLD;
  return (
    <span data-ui="" className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 font-mono font-bold leading-none" style={{ background: color, color: DEEP, fontSize: size, boxShadow: `0 0 22px ${color}88` }}>
      <Icono name="cookie" size={size + 2} strokeWidth={2.5} ancla={false} />
      {SID}
    </span>
  );
}

/** The six boxes of a 2FA code that fill one by one from `at`. */
function Code({ at, size = 46 }: { at: number; size?: number }) {
  const t = useT();
  return (
    <div data-ui="" className="flex gap-2">
      {"492713".split("").map((d, i) => {
        const on = t >= at + 0.22 * i;
        return (
          <span key={i} className="flex items-center justify-center rounded-[10px] border-2 font-mono font-black" style={{ width: size, height: size * 1.2, fontSize: size * 0.6, borderColor: on ? GOLD : "rgba(244,239,230,0.2)", color: INK, background: SURF }}>
            {on ? d : ""}
          </span>
        );
      })}
    </div>
  );
}

/** The two boxes of the world: your browser on the left, the site on the right. */
function Diagram({ y, siteOk = 0, browser = "Navegador", danger = 0 }: { y: number; siteOk?: number; browser?: string; danger?: number }) {
  const box = (x: number, icon: string, label: string, glow: string) => (
    <At x={x} y={y} w={130} h={112}>
      <div className="flex h-full flex-col items-center justify-center gap-2 rounded-[16px] border-2" style={{ background: SURF, borderColor: glow, boxShadow: `0 0 26px ${glow}44` }}>
        <Icono name={icon} size={44} strokeWidth={2} ancla={false} className="text-ink" />
        <span className="font-mono text-[17px] font-bold uppercase text-ink">{label}</span>
      </div>
    </At>
  );
  return (
    <>
      <At x={166} y={y + 55} w={208} h={2} style={{ background: `linear-gradient(90deg, ${danger > 0.5 ? RED : GOLD}, rgba(244,239,230,0.3))` }} />
      {box(36, "monitor", browser, danger > 0.5 ? RED : "rgba(244,239,230,0.25)")}
      {box(374, "server", "El sitio", siteOk > 0.5 ? GREEN : "rgba(244,239,230,0.25)")}
    </>
  );
}

/** Something that travels along the line of the diagram, from `from` to `to` (0 is the browser, 1 the site). */
function Travel({ y, at, dur = 0.9, from = 0, to = 1, until, children }: { y: number; at: number; dur?: number; from?: number; to?: number; until?: number; children: ReactNode }) {
  const t = useT();
  if (t < at || (until !== undefined && t > until)) return null;
  const p = ease(interpolate(t, [at, at + dur], [0, 1], clamp));
  const x = 101 + (from + (to - from) * p) * 338;
  return (
    <At x={x} y={y + 56} style={{ transform: "translate(-50%, -50%)" }}>
      {children}
    </At>
  );
}

/* ---------- 1. The hook: the shield guards the door, the cookie rolls past it ---------- */

function Shield({ x, y, size = 190, intact = true }: { x: number; y: number; size?: number; intact?: boolean }) {
  const t = useT();
  return (
    <At x={x} y={y} style={{ transform: `translate(-50%, -50%) rotate(${Math.sin(t * 1.6) * 2}deg)` }}>
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rounded-full blur-[30px]" style={{ background: `${GOLD}30` }} />
        <Icono name={intact ? "shield-check" : "shield"} size={size} strokeWidth={1.4} ancla={false} className="relative text-[#F5C04A]" />
      </div>
    </At>
  );
}

function Hook() {
  const t = useT();
  const enter = useStageCue("gancho", "entran");
  const pass = useStageCue("gancho", "contrasena");
  const strong = useStageCue("gancho", "fuerte");
  // The cookie rolls in from the left, behind the shield, and keeps going: the shield never touches it.
  const roll = interpolate(t, [0, enter + 1], [110, 640], clamp);
  const bar = interpolate(t, [pass, strong + 0.3], [0, 1], clamp);
  return (
    <Section y={Y.hook} glow={GOLD}>
      <Shield x={270} y={410} />
      <At x={270} y={540} style={{ transform: "translateX(-50%)" }}>
        <Code at={0} />
      </At>
      <At x={roll} y={700} style={{ transform: `translate(-50%, -50%) rotate(${roll * 0.8}deg)` }}>
        <div className="flex h-[104px] w-[104px] items-center justify-center rounded-full" style={{ background: GOLD, boxShadow: `0 0 40px ${GOLD}aa` }}>
          <Icono name="cookie" size={70} strokeWidth={2.2} ancla={false} className="text-[#0E0B14]" />
        </div>
      </At>
      <Tag at={enter} x={400} y={608} color={RED}>
        Sin tocarlo
      </Tag>
      <Appear at={pass} x={40} y={700} w={220}>
        <Card className="px-4 py-3">
          <p className="text-[13px] font-bold uppercase text-muted">Contraseña</p>
          <p className="text-[20px] tracking-[0.2em]">••••••••••</p>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-black/40">
            <div className="h-full rounded-full" style={{ width: `${bar * 100}%`, background: GREEN }} />
          </div>
          <p className="mt-1 text-[13px] font-bold" style={{ color: GREEN, opacity: fade(t, strong) }}>
            muy fuerte
          </p>
        </Card>
      </Appear>
      <Appear at={pass + 0.4} x={280} y={700} w={220}>
        <Card className="px-4 py-3">
          <p className="text-[13px] font-bold uppercase text-muted">2FA</p>
          <div className="mt-2 flex items-center gap-2">
            <Icono name="check" size={26} strokeWidth={3} ancla={false} className="text-[#F5C04A]" />
            <span className="text-[20px] font-bold">Activado</span>
          </div>
        </Card>
      </Appear>
    </Section>
  );
}

/* ---------- 2. The cookie: you prove it once, then the site trusts the cookie ---------- */

function CookieScene() {
  const t = useT();
  const once = useStageCue("cookie", "vez");
  const login = useStageCue("cookie", "login");
  const after = useStageCue("cookie", "despues");
  const nothing = useStageCue("cookie", "nada");
  const browser = useStageCue("cookie", "navegador");
  const cookie = useStageCue("cookie", "cookie");
  const trust = useStageCue("cookie", "confia");
  const y = 190;
  const clicks = [after + 0.2, after + 0.8, nothing + 0.3];
  return (
    <Section y={Y.cookie} glow={GOLD}>
      <Diagram y={y} siteOk={fade(t, login)} />
      <Travel y={y} at={once - 0.3} dur={1} until={login + 0.6}>
        <span data-ui="" className="rounded-full bg-ink px-3 py-1 font-mono text-[16px] font-bold tracking-[0.2em] text-[#0E0B14]">
          ••••••
        </span>
      </Travel>
      <Tag at={once} x={270} y={y + 130} color={INK}>
        Una vez
      </Tag>
      <Appear at={after - 0.2} x={60} y={380} w={420}>
        <BrowserWindow url="ejemplo.com/inicio">
          <div className="grid grid-cols-3 gap-2 p-3">
            {clicks.map((c, i) => (
              <div key={i} className="h-[86px] rounded-[8px]" style={{ background: SURF, boxShadow: t >= c && t < c + 0.25 ? `0 0 0 3px ${GOLD}` : undefined }} />
            ))}
          </div>
        </BrowserWindow>
      </Appear>
      {t >= after && t < browser
        ? (() => {
            const i = clicks.findIndex((c, k) => t < (clicks[k + 1] ?? browser));
            const target = 60 + 12 + 70 + Math.max(0, i) * 135;
            return (
              <At x={target} y={470} style={{ transition: "none" }}>
                <Icono name="mouse-pointer-click" size={34} strokeWidth={2.2} ancla={false} className="text-ink" />
              </At>
            );
          })()
        : null}
      <Tag at={nothing} x={270} y={530} until={cookie}>
        Sin volver a pedir
      </Tag>
      {/* The cookie comes back from the site and stays on the line: it rides along with every click. */}
      <Travel y={y} at={browser} from={0.8} to={0.5} dur={0.8}>
        <CookiePill />
      </Travel>
      <Slam at={cookie} x={30} y={590} color={GOLD}>
        Cookie
        <br />
        de sesión
      </Slam>
      <Tag at={trust} x={439} y={y - 38} color={GREEN}>
        Confía
      </Tag>
    </Section>
  );
}

/* ---------- 3. The wristband of a park ---------- */

function Park() {
  const t = useT();
  const park = useStageCue("pulsera", "parque");
  const doc = useStageCue("pulsera", "documento");
  const gate = useStageCue("pulsera", "entrada");
  const ride = useStageCue("pulsera", "juego");
  const look = useStageCue("pulsera", "miran");
  const rides = [
    { icon: "ferris-wheel", at: ride },
    { icon: "roller-coaster", at: ride + 0.6 },
    { icon: "tent", at: look },
  ];
  const band = fade(t, gate + 0.2, 0.4);
  return (
    <Section y={Y.park} glow={GOLD}>
      {/* The arch of the entrance. */}
      <Appear at={park - 0.4} x={110} y={170} w={320} h={170}>
        <div className="h-full w-full rounded-t-[160px] border-[6px] border-b-0" style={{ borderColor: GOLD, boxShadow: `0 -6px 30px ${GOLD}44` }} />
        <p className="absolute left-1/2 top-[60px] -translate-x-1/2 font-display text-[34px] font-black uppercase text-[#F5C04A]">Parque</p>
      </Appear>
      <Appear at={doc} x={70} y={380} w={160}>
        <div className="flex flex-col items-center gap-2" style={{ opacity: 1 - 0.6 * band }}>
          <Icono name="id-card" size={96} strokeWidth={1.6} ancla={false} className="text-ink" />
          <span className="font-mono text-[15px] font-bold uppercase text-ink">Documento</span>
        </div>
      </Appear>
      <Tag at={doc + 0.4} x={150} y={530} color={INK}>
        Una vez
      </Tag>
      {/* The wristband: a gold ring that comes out of the gate. */}
      {t >= gate ? (
        <At x={370} y={445} style={{ transform: `translate(-50%, -50%) scale(${0.4 + 0.6 * band}) rotate(${Math.sin(t * 2) * 6}deg)`, opacity: band }}>
          <Sfx id="pop" at={gate + 0.2} volume={0.25} />
          <div className="flex h-[110px] w-[150px] items-center justify-center rounded-[50%] border-[14px]" style={{ borderColor: GOLD, boxShadow: `0 0 26px ${GOLD}88` }}>
            <span className="font-mono text-[13px] font-black text-[#F5C04A]">sid</span>
          </div>
        </At>
      ) : null}
      {rides.map((r, i) => {
        const open = fade(t, r.at, 0.25);
        return (
          <Appear key={r.icon} at={ride - 0.3 + 0.1 * i} x={52 + i * 150} y={600} w={136}>
            <div className="flex flex-col items-center gap-2 rounded-[16px] px-2 py-3" style={{ background: SURF, boxShadow: open > 0.5 ? `0 0 0 3px ${GOLD}` : undefined }}>
              <Icono name={r.icon} size={64} strokeWidth={1.8} ancla={false} className="text-ink" />
              <div className="flex items-center gap-1 font-mono text-[14px] font-bold uppercase" style={{ color: open > 0.5 ? GOLD : "rgba(244,239,230,0.5)" }}>
                <Icono name={open > 0.5 ? "check" : "lock"} size={16} strokeWidth={3} ancla={false} />
                {open > 0.5 ? "Pasa" : "Juego"}
              </div>
            </div>
          </Appear>
        );
      })}
      <Tag at={look + 0.4} x={270} y={770} color={GOLD}>
        Solo la pulsera
      </Tag>
    </Section>
  );
}

/* ---------- 4. The theft: what the cookie says, and two ways to take it ---------- */

function Theft() {
  const t = useT();
  const says = useStageCue("robo", "dice");
  const code = useStageCue("robo", "codigo");
  const steal = useStageCue("robo", "roba");
  const malware = useStageCue("robo", "malware");
  const page = useStageCue("robo", "pagina");
  const ms = useStageCue("robo", "microsoft");
  const ten = useStageCue("robo", "diez");
  const red = fade(t, steal, 0.5);
  const y = 170;
  return (
    <Section y={Y.theft} glow={red > 0.5 ? RED : GOLD}>
      <Diagram y={y} siteOk={1} danger={red} />
      <Travel y={y} at={-1} from={0.5} to={0.5}>
        <CookiePill stolen={red} />
      </Travel>
      <Appear at={says} until={malware} x={90} y={330} w={360}>
        <Card className="px-5 py-4 text-[24px] leading-[1.5]">
          <p>
            <span className="text-muted">usuario:</span> tú
          </p>
          <p style={{ opacity: fade(t, says + 0.4) }}>
            <span className="text-muted">sesión:</span> activa
          </p>
          <p style={{ opacity: fade(t, code) }}>
            <span className="text-muted">2fa:</span> <span style={{ color: GREEN }}>pasado</span>
          </p>
        </Card>
      </Appear>
      {/* The attacker under the diagram, and the two roads the cookie takes to it. */}
      <Appear at={steal} x={200} y={470} w={140}>
        <div className="flex h-[140px] w-[140px] items-center justify-center rounded-full" style={{ background: `${RED}22`, boxShadow: `0 0 0 4px ${RED}` }}>
          <Icono name="venetian-mask" size={84} strokeWidth={1.8} ancla={false} className="text-[#FF5C6C]" />
        </div>
      </Appear>
      <Appear at={malware} x={40} y={340} w={150}>
        <div className="flex flex-col items-center gap-1.5">
          <Icono name="bug" size={72} strokeWidth={1.8} ancla={false} className="text-[#FF5C6C]" />
          <span className="rounded-md bg-[#FF5C6C] px-2 py-1 font-mono text-[19px] font-bold uppercase text-[#0E0B14]">Malware</span>
        </div>
      </Appear>
      <Appear at={page} x={334} y={320} w={170}>
        <Card className="px-3 py-2" style={{ borderColor: RED }}>
          <p className="text-[14px] text-muted">ejemplo-login.co</p>
          <div className="mt-1 h-3 rounded bg-black/40" />
          <div className="mt-1 h-3 rounded bg-black/40" />
          <div className="mt-1.5 h-4 rounded" style={{ background: RED }} />
        </Card>
        <span className="mt-1.5 block text-center font-mono text-[19px] font-bold uppercase text-[#FF5C6C]">Página falsa</span>
      </Appear>
      {[
        { at: malware + 0.3, x0: 101, y0: y + 120 },
        { at: page + 0.3, x0: 439, y0: y + 120 },
      ].map((road, i) => {
        if (t < road.at || t > ms) return null;
        const p = ease(interpolate(t, [road.at, road.at + 0.9], [0, 1], clamp));
        return (
          <At key={i} x={road.x0 + (270 - road.x0) * p} y={road.y0 + (540 - road.y0) * p} style={{ transform: "translate(-50%, -50%)" }}>
            <CookiePill stolen={1} size={17} />
          </At>
        );
      })}
      {t >= ms ? (
        <At x={40} y={636} w={460}>
          <Sfx id="caja-registradora" at={ten} volume={0.25} />
          <p className="text-center font-display text-[96px] font-black leading-none text-[#FF5C6C]" style={{ textShadow: `0 0 30px ${RED}66`, opacity: fade(t, ten - 0.1, 0.1), transform: `scale(${interpolate(t, [ten - 0.1, ten + 0.1], [1.1, 1], clamp)})` }}>
            10.000+
          </p>
          <p className="mt-2 text-center font-mono text-[18px] font-bold uppercase text-ink" style={{ opacity: fade(t, ten + 0.6) }}>
            organizaciones · Microsoft, 2022
          </p>
        </At>
      ) : null}
    </Section>
  );
}

/* ---------- 5. The controlled test: the cookie moves from browser A to browser B ---------- */

function Test() {
  const t = useT();
  const copy = useStageCue("prueba", "copias");
  const tools = useStageCue("prueba", "devtools");
  const other = useStageCue("prueba", "otro");
  const reload = useStageCue("prueba", "recargas");
  const welcome = useStageCue("prueba", "recibe");
  const pass = useStageCue("prueba", "contrasena");
  const code = useStageCue("prueba", "codigo");
  const travel = ease(interpolate(t, [other, other + 0.9], [0, 1], clamp));
  const inB = t >= other + 0.9;
  const strike = (at: number) => interpolate(t, [at, at + 0.35], [0, 100], clamp);
  return (
    <Section y={Y.test} glow="#9B7BFF">
      <Tag at={copy - 0.6} x={270} y={150} color="#9B7BFF">
        Prueba controlada
      </Tag>
      <Appear at={copy - 0.4} x={40} y={190} w={460}>
        <BrowserWindow url="Navegador A · DevTools">
          <div className="p-3 text-[22px] text-ink">
            <p className="mb-1.5 text-[15px] font-bold uppercase text-muted" style={{ opacity: fade(t, tools) }}>
              Application › Cookies
            </p>
            <div className="grid grid-cols-[110px_1fr] gap-x-3 border-b border-white/10 pb-1 text-[17px] font-bold text-muted">
              <span>Name</span>
              <span>Value</span>
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-x-3 rounded-md py-1.5" style={{ background: t >= tools ? `${GOLD}22` : undefined }}>
              <span className="font-bold text-[#F5C04A]">sid</span>
              <span>8f2b</span>
            </div>
          </div>
        </BrowserWindow>
      </Appear>
      {t >= tools && t < other + 1.1 ? (
        <At x={270} y={330 + travel * 200} style={{ transform: "translate(-50%, -50%)" }}>
          <CookiePill stolen={travel} />
        </At>
      ) : null}
      <Appear at={other - 0.3} x={40} y={430} w={460}>
        <BrowserWindow url="Navegador B · ejemplo.com" border={inB ? RED : undefined}>
          <div className="flex h-[190px] items-center justify-center gap-4 p-3">
            {t >= welcome ? (
              <>
                <Icono name="user-round" size={72} strokeWidth={2} ancla={false} className="text-ink" />
                <div>
                  <p className="text-[34px] font-bold text-ink">Hola, tú</p>
                  <p className="text-[18px]" style={{ color: GREEN }}>
                    sesión activa
                  </p>
                </div>
              </>
            ) : (
              <p className="text-[22px] text-muted">{t >= reload ? "Recargando…" : "Sin sesión"}</p>
            )}
          </div>
        </BrowserWindow>
      </Appear>
      <Sfx id="click" at={reload} volume={0.3} />
      {[
        ["Contraseña", pass],
        ["Código 2FA", code],
      ].map(([label, at], i) =>
        t >= (at as number) ? (
          <At key={label as string} x={i === 0 ? 60 : 280} y={680} w={200}>
            <span className="relative block rounded-lg px-3 py-2 text-center font-mono text-[20px] font-bold uppercase" style={{ background: SURF, color: "rgba(244,239,230,0.6)" }}>
              {label}
              <span className="absolute left-2 top-1/2 h-[4px]" style={{ width: `calc(${strike(at as number)}% - 16px)`, background: RED }} />
            </span>
          </At>
        ) : null,
      )}
      <At x={0} y={762} w={W}>
        <p className="text-center font-mono text-[18px] text-muted">Ejemplo ilustrativo</p>
      </At>
    </Section>
  );
}

/* ---------- 6. It has a name: the 2FA was walked around ---------- */

function Name() {
  const t = useT();
  const theft = useStageCue("nombre", "robo");
  const broke = useStageCue("nombre", "rompio");
  const around = useStageCue("nombre", "esquivaron");
  const google = useStageCue("nombre", "google");
  const draw = interpolate(t, [around - 0.2, around + 0.9], [0, 1], clamp);
  return (
    <Section y={Y.name} glow={RED}>
      <Slam at={theft - 0.1} x={30} y={150} color={RED} size={62}>
        Robo
        <br />
        de sesión
      </Slam>
      <Shield x={270} y={440} size={170} />
      <Tag at={broke + 0.3} x={270} y={545} color={GOLD}>
        Intacto
      </Tag>
      {/* The red arrow goes around the shield without touching it. */}
      <svg className="absolute" style={{ left: 0, top: 0, opacity: draw > 0 ? 1 : 0 }} width={W} height={SEC} viewBox={`0 0 ${W} ${SEC}`}>
        <path d="M 60 600 C 60 300, 480 300, 480 600" fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} style={{ filter: `drop-shadow(0 0 10px ${RED})` }} />
        {draw > 0.95 ? <path d="M 466 584 L 480 606 L 494 584" fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /> : null}
      </svg>
      <Appear at={google} x={90} y={620} w={360}>
        <Card className="px-5 py-4 text-center">
          <p className="font-display text-[30px] font-black leading-tight text-ink">"Después del login"</p>
          <p className="mt-1 text-[18px] text-muted">Google, abril de 2024</p>
        </Card>
      </Appear>
    </Section>
  );
}

/* ---------- 7. What actually helps: four boxes that light up with the voice ---------- */

function Help() {
  const t = useT();
  const title = useStageCue("ayuda", "ayuda");
  const items = [
    { icon: "users", text: "Equipos compartidos", at: useStageCue("ayuda", "compartidos") },
    { icon: "monitor", text: "Sesiones raras", at: useStageCue("ayuda", "reconozcas") },
    { icon: "puzzle", text: "Lo que instalas", at: useStageCue("ayuda", "instalas") },
    { icon: "server", text: "Invalida en servidor", at: useStageCue("ayuda", "servidor") },
  ];
  return (
    <Section y={Y.help} glow={GREEN}>
      <At x={40} y={150} w={460}>
        <p className="text-center font-display text-[44px] font-black uppercase leading-none text-ink" style={{ opacity: 0.4 + 0.6 * fade(t, title - 0.3) }}>
          Lo que ayuda
        </p>
      </At>
      {items.map((item, i) => {
        const on = fade(t, item.at - 0.1, 0.25);
        return (
          <At key={item.text} x={40} y={240 + i * 120} w={460} h={100}>
            {item.at > 0 && t >= item.at ? <Sfx id="switch" at={item.at} volume={0.25} /> : null}
            <div className="flex h-full items-center gap-4 rounded-[16px] px-5" style={{ background: SURF, opacity: 0.35 + 0.65 * on, boxShadow: on > 0.5 ? `0 0 0 3px ${GREEN}` : undefined }}>
              <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[10px] border-2" style={{ borderColor: on > 0.5 ? GREEN : "rgba(244,239,230,0.3)", background: on > 0.5 ? GREEN : "transparent" }}>
                {on > 0.5 ? <Icono name="check" size={30} strokeWidth={3.5} ancla={false} className="text-[#0E0B14]" /> : null}
              </div>
              <Icono name={item.icon} size={36} strokeWidth={2} ancla={false} className="text-ink" />
              <span className="font-display text-[26px] font-black text-ink">{item.text}</span>
            </div>
          </At>
        );
      })}
      {/* The second box: a device you do not know, with its revoke button. */}
      <Appear at={items[1].at + 0.5} until={items[2].at + 0.4} x={210} y={712} w={290}>
        <Card className="flex items-center justify-between px-3 py-2 text-[17px]">
          <span>Equipo desconocido</span>
          <span className="rounded-md px-2 py-1 font-bold text-[#0E0B14]" style={{ background: RED }}>
            Revocar
          </span>
        </Card>
      </Appear>
      <Appear at={items[3].at + 0.6} x={40} y={720} w={460}>
        <div className="flex items-center justify-center gap-3">
          <span className="relative">
            <CookiePill stolen={1} size={19} />
            <span className="absolute left-0 top-1/2 h-[3px] w-full -rotate-6 bg-ink" />
          </span>
          <span className="font-mono text-[19px] font-bold uppercase text-ink">ya no sirve</span>
        </div>
      </Appear>
    </Section>
  );
}

/* ---------- 8. The close: the door and what comes after, side by side ---------- */

function End() {
  const t = useT();
  const off = useStageCue("cierre", "apagues");
  const door = useStageCue("cierre", "entrada");
  const after = useStageCue("cierre", "despues");
  return (
    <Section y={Y.end}>
      <At x={0} y={0} w={W / 2} h={SEC} style={{ background: SURF }} />
      <At x={W / 2} y={0} w={W / 2} h={SEC} style={{ background: `${GOLD}1F`, opacity: 0.3 + 0.7 * fade(t, after) }} />
      <At x={W / 2 - 1} y={140} w={3} h={660} style={{ background: GOLD }} />
      <Shield x={135} y={380} size={150} />
      <Appear at={off} x={135} y={480}>
        <div className="-translate-x-1/2">
          <Code at={off} size={24} />
        </div>
      </Appear>
      <Tag at={door} x={135} y={560} color={GOLD}>
        La entrada
      </Tag>
      <Tag at={door + 0.4} x={135} y={610} color={GREEN}>
        Protegida
      </Tag>
      <At x={405} y={380} style={{ transform: "translate(-50%, -50%)", opacity: 0.4 + 0.6 * fade(t, after) }}>
        <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full" style={{ background: GOLD, boxShadow: `0 0 40px ${GOLD}aa` }}>
          <Icono name="cookie" size={80} strokeWidth={2} ancla={false} className="text-[#0E0B14]" />
        </div>
      </At>
      <Tag at={after} x={405} y={560} color={GOLD}>
        Lo de después
      </Tag>
      <Tag at={after + 0.4} x={405} y={610} color={RED}>
        Sin 2FA
      </Tag>
    </Section>
  );
}

function World() {
  return (
    <div className="absolute inset-0 text-ink">
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, #F4EFE6 1.1px, transparent 1.3px)", backgroundSize: "28px 28px" }} />
      <Hook />
      <CookieScene />
      <Park />
      <Theft />
      <Test />
      <Name />
      <Help />
      <End />
    </div>
  );
}

/* ---------- Over the world: the hook and the save ---------- */

function HookTitle() {
  return (
    <div className="relative mt-[42px]">
      <h1 className="font-display text-[48px] font-black leading-[1] tracking-tight text-ink">
        Tu 2FA no protege
        <br />
        tu <span className="text-accent">cookie</span>
      </h1>
    </div>
  );
}

function Save() {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const at = useCue("guardalo");
  const p = usePop(at);
  if (t < at) return null;
  return (
    <div className="relative flex h-full flex-col justify-end pb-6">
      <div className="flex items-center gap-3 self-center rounded-full bg-accent px-5 py-2.5" style={{ transform: `scale(${0.85 + 0.15 * p})`, opacity: Math.min(1, p * 2) }}>
        <Icono name="bookmark" size={30} strokeWidth={2.6} ancla={false} className="text-accent-ink" />
        <span className="font-display text-[28px] font-black text-accent-ink">"Tengo 2FA, estoy tranquilo"</span>
      </div>
    </div>
  );
}

export default defineVideo({
  captions: "pill",
  chapters: true,
  music: { file: "audio/cama.mp3" },
  stage: { World, width: W, height: H, drift: 0.02 },
  meter: {
    kind: "counter",
    start: 1,
    steps: [{ scene: "prueba", word: "recibe", value: 2 }],
  },
  scenes: [
    { id: "gancho", chapter: "Tu 2FA", camera: shot(Y.hook), Visual: HookTitle },
    { id: "cookie", chapter: "La cookie", camera: shot(Y.cookie) },
    { id: "pulsera", chapter: "La pulsera", camera: shot(Y.park) },
    { id: "robo", chapter: "El robo", camera: shot(Y.theft) },
    { id: "prueba", chapter: "La prueba", camera: shot(Y.test), hold: 1 },
    { id: "nombre", chapter: "Tiene nombre", camera: shot(Y.name) },
    { id: "ayuda", chapter: "Lo que ayuda", camera: shot(Y.help) },
    { id: "cierre", chapter: "Después", camera: shot(Y.end), Visual: Save, hold: 0.6 },
  ],
});
