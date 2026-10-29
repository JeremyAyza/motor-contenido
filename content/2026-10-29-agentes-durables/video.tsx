import type { CSSProperties, ReactNode } from "react";
import { interpolate } from "remotion";
import { Icono, Logo } from "@motor/ui";
import { defineVideo, Sfx, usePop, useStage, useStageCue } from "@motor/video";

// Un pizarrón de papel: tu navegador arriba, el servidor con su API y su worker en el medio y abajo
// el registro durable, donde el trabajo 42 se escribe casilla por casilla (video.json → world).
// Un trazo azul baja por todo el pizarrón: es el camino del trabajo 42.
// La ventana de Claude Code, el trabajo 42, los pasos, los tests y los $49.00 son ilustrativos;
// las cifras (15 min de Lambda) y los nombres salen de facts.json.

const W = 540;
const SEC = 960;
const VIEW_Y = 427;
const IDS = ["gancho", "chat", "como", "stream", "costo", "idea", "registro", "reanudar", "checkpoints", "idempotente", "construir", "anthropic", "cierre"] as const;
const Y = Object.fromEntries(IDS.map((id, i) => [id, i * SEC])) as Record<(typeof IDS)[number], number>;
const H = IDS.length * SEC;
const shot = (y: number, zoom = 1) => ({ focus: { x: W / 2, y: y + VIEW_Y }, zoom });

const BLUE = "#2F5BFF";
const RED = "#E5484D";
const GREEN = "#1F9D55";
const INK = "#1C1A16";
const MUTED = "#6F6A5E";
const PAPER = "#F3EFE6";
const LINE = "rgba(28,26,22,0.14)";
// claude.ai, light theme
const CLAUDE = { bg: "#FAF9F5", bubble: "#F0EEE6", ink: "#141413", orange: "#D97757", border: "rgba(20,20,19,0.12)" };

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

/** A screen-sized part of the board, drawn only while the camera sees it. */
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

/** Pops in at `at` with a spring and leaves at `until`. `origin` is where it grows from: text glued to the margin grows from its edge. */
function Appear({ at, until, x, y, w, h, sound, origin = "50% 60%", children }: { at: number; until?: number; x: number; y: number; w?: number; h?: number; sound?: string; origin?: string; children: ReactNode }) {
  const t = useT();
  const p = usePop(at);
  const out = until === undefined ? 0 : fade(t, until, 0.3);
  if (t < at || out >= 1) return null;
  return (
    <At x={x} y={y} w={w} h={h} style={{ opacity: Math.min(1, p * 1.6) * (1 - out), transform: `translateY(${(1 - Math.min(1, p)) * 16}px) scale(${0.9 + 0.1 * p})`, transformOrigin: origin }}>
      {sound ? <Sfx id={sound} at={at} volume={0.3} /> : null}
      {children}
    </At>
  );
}

/** A short sign of the board (1 to 3 words), placed by its center. */
function Tag({ at, x, y, color, until, children }: { at: number; x: number; y: number; color?: string; until?: number; children: ReactNode }) {
  return (
    <Appear at={at} until={until} x={x} y={y} sound="blip">
      <span className="flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 font-mono text-[19px] font-bold uppercase leading-none" style={{ background: color ?? "#FFFFFF", color: color ? "#FFFFFF" : INK, boxShadow: color ? undefined : `0 0 0 1.5px ${LINE}` }}>
        {children}
      </span>
    </Appear>
  );
}

/** A big word of the idea that slams in. */
function Slam({ at, x, y, color = INK, size = 58, w, children }: { at: number; x: number; y: number; color?: string; size?: number; w?: number; children: ReactNode }) {
  const t = useT();
  if (t < at) return null;
  const p = interpolate(t, [at, at + 0.18], [1.4, 1], clamp);
  return (
    <At x={x} y={y} w={w ?? W - 2 * x} style={{ transform: `scale(${p})`, transformOrigin: "50% 50%", opacity: fade(t, at, 0.08) }}>
      <Sfx id="golpe" at={at} volume={0.3} />
      <p className="text-center font-display font-extrabold leading-[0.98] tracking-tight" style={{ color, fontSize: size }}>
        {children}
      </p>
    </At>
  );
}

/** A box of the board: an icon (or a drawing, `glyph`) and its name. */
function Box({ icon, glyph, label, state = "idle", h = 96, children }: { icon?: string; glyph?: ReactNode; label: string; state?: "idle" | "on" | "ok" | "down"; h?: number; children?: ReactNode }) {
  const border = state === "down" ? RED : state === "ok" ? GREEN : state === "on" ? BLUE : LINE;
  return (
    <div className="flex items-center gap-3 rounded-[16px] border-2 bg-white px-4" style={{ height: h, borderColor: border, boxShadow: state === "idle" ? "0 6px 18px rgba(28,26,22,0.08)" : `0 0 0 4px ${border}22, 0 6px 18px rgba(28,26,22,0.08)` }}>
      {glyph ?? <Icono name={icon ?? "box"} size={38} strokeWidth={2} ancla={false} className={state === "down" ? "text-[#E5484D]" : "text-ink"} />}
      <span className="font-display text-[26px] font-bold text-ink">{label}</span>
      {children}
    </div>
  );
}

/** A code card of an interface (data-ui). */
function CodeCard({ lines, size = 19, className }: { lines: { text: string; color?: string; at?: number }[]; size?: number; className?: string }) {
  const t = useT();
  return (
    <div data-ui="" className={`rounded-[12px] px-4 py-3 font-mono leading-[1.6] text-[#EDEAE2] shadow-[0_12px_28px_rgba(28,26,22,0.25)] ${className ?? ""}`} style={{ background: "#1C1A16", fontSize: size }}>
      {lines.map((l, i) => (l.at === undefined || t >= l.at ? <p key={i} style={{ color: l.color, opacity: l.at === undefined ? 1 : fade(t, l.at) }}>{l.text}</p> : null))}
    </div>
  );
}

/** A status chip with a dot that breathes. */
function Status({ color, children }: { color: string; children: ReactNode }) {
  const t = useT();
  return (
    <span data-ui="" className="flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5 font-mono text-[17px] font-bold" style={{ background: `${color}18`, color, boxShadow: `0 0 0 1.5px ${color}55` }}>
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color, opacity: 0.45 + 0.55 * Math.abs(Math.sin(t * 3)) }} />
      {children}
    </span>
  );
}

/** One entry of the durable log: its position and what it holds. */
function Slot({ n, text, state = "on" }: { n: number; text?: string; state?: "off" | "on" | "hot" | "replay" }) {
  const bg = state === "off" ? "transparent" : state === "replay" ? BLUE : state === "hot" ? `${BLUE}1F` : "#FFFFFF";
  const color = state === "replay" ? "#FFFFFF" : INK;
  return (
    <div data-ui="" className="flex h-[44px] items-center gap-2 rounded-[10px] border-2 px-2.5 font-mono text-[16px]" style={{ background: bg, borderColor: state === "off" ? LINE : state === "on" ? LINE : BLUE, color, borderStyle: state === "off" ? "dashed" : "solid" }}>
      <span className="font-bold" style={{ color: state === "replay" ? "#FFFFFF" : BLUE }}>#{n}</span>
      {text ? <span className="truncate">{text}</span> : null}
    </div>
  );
}

/** Claude Code on the web, recreated: tab, header, the request, the answer and the reply box. `draft` is what is being typed in the box; `hot` lights the × of the tab under the pointer. */
function ClaudeWindow({ request, answer, typed = 1, draft, children, hot = false }: { request?: string; answer?: ReactNode; typed?: number; draft?: string; children?: ReactNode; hot?: boolean }) {
  const t = useT();
  return (
    <div data-ui="" className="overflow-hidden rounded-[14px] border font-sans" style={{ background: CLAUDE.bg, borderColor: CLAUDE.border, boxShadow: "0 18px 40px rgba(28,26,22,0.18)" }}>
      <div className="flex items-end gap-1.5 border-b px-3 pt-2" style={{ background: "#ECE9E1", borderColor: CLAUDE.border }}>
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="mb-2 h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" style={{ marginBottom: 0 }} />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-3 flex items-center gap-2 rounded-t-[8px] px-3 py-1.5 text-[13px]" style={{ background: CLAUDE.bg, color: CLAUDE.ink }}>
          <Logo slug="claude" size={14} ancla={false} />
          claude.ai/code
          <span className="ml-2 flex h-[18px] w-[18px] items-center justify-center rounded-[4px] text-[14px]" style={{ color: hot ? "#FFFFFF" : "#8A877F", background: hot ? RED : "transparent" }}>
            ×
          </span>
        </span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2.5">
        <Logo slug="claude" size={22} ancla={false} />
        <span className="text-[16px] font-semibold" style={{ color: CLAUDE.ink }}>
          Claude Code
        </span>
        <span className="ml-auto rounded-md px-2 py-0.5 text-[12px]" style={{ background: CLAUDE.bubble, color: "#5E5D59" }}>
          nube · mi-app
        </span>
      </div>
      <div className="flex min-h-[150px] flex-col gap-3 px-4 pb-3">
        {request ? (
          <p className="self-end rounded-[14px] px-3.5 py-2 text-[19px] leading-snug" style={{ background: CLAUDE.bubble, color: CLAUDE.ink, maxWidth: "86%" }}>
            {request}
          </p>
        ) : null}
        {answer ? (
          <div className="flex gap-2.5">
            <Logo slug="claude" size={18} ancla={false} />
            <div className="font-serif text-[20px] leading-snug" style={{ color: CLAUDE.ink, clipPath: `inset(0 ${(1 - typed) * 100}% 0 0)` }}>
              {answer}
            </div>
          </div>
        ) : null}
        {children}
      </div>
      <div className="mx-3 mb-3 flex items-center gap-2 rounded-[14px] border bg-white px-3.5 py-2.5" style={{ borderColor: draft ? `${CLAUDE.orange}99` : CLAUDE.border }}>
        {draft ? (
          <span className="text-[16px] leading-snug" style={{ color: CLAUDE.ink }}>
            {draft}
            <span className="ml-0.5 inline-block h-[17px] w-[2px] translate-y-[3px]" style={{ background: CLAUDE.ink, opacity: Math.floor(t * 3) % 2 ? 0.2 : 1 }} />
          </span>
        ) : (
          <span className="text-[14px] text-[#8A877F]">Responder a Claude…</span>
        )}
        <span className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px]" style={{ background: CLAUDE.orange }}>
          <Icono name="arrow-up" size={16} strokeWidth={2.6} ancla={false} className="text-white" />
        </span>
      </div>
    </div>
  );
}

/** Something that rides a straight path from (x0, y0) to (x1, y1), centered. */
function Ride({ at, dur = 0.8, x0, y0, x1, y1, until, children }: { at: number; dur?: number; x0: number; y0: number; x1: number; y1: number; until?: number; children: ReactNode }) {
  const t = useT();
  if (t < at || (until !== undefined && t > until)) return null;
  const p = ease(interpolate(t, [at, at + dur], [0, 1], clamp));
  return (
    <At x={x0 + (x1 - x0) * p} y={y0 + (y1 - y0) * p} style={{ transform: "translate(-50%, -50%)" }}>
      {children}
    </At>
  );
}

/** The ticket of the job: the same "trabajo 42" all the way down the board. */
function Ticket({ size = 18 }: { size?: number }) {
  return (
    <span data-ui="" className="flex items-center gap-1.5 whitespace-nowrap rounded-[8px] px-3 py-1.5 font-mono font-bold text-white" style={{ background: BLUE, fontSize: size, boxShadow: `0 6px 16px ${BLUE}55` }}>
      <Icono name="ticket" size={size + 2} strokeWidth={2.4} ancla={false} />
      trabajo 42
    </span>
  );
}

/**
 * Clawd, the pixel crab of Claude Code, recreated on its 16 × 10 grid (rule 6): a 12 × 8 body,
 * two arms at mid height, four legs and two eyes cut out of the body. `happy` draws the > < eyes
 * of the official sticker; `working` makes the legs step in place.
 */
function Clawd({ size = 64, happy = false, working = false }: { size?: number; happy?: boolean; working?: boolean }) {
  const t = useT();
  const step = working ? Math.floor(t * 6) % 2 : -1;
  const legs = [3, 5, 10, 12].map((x, i) => `M${x} 8h1v${i % 2 === step ? 1.4 : 2}h-1z`).join("");
  const eyes = happy ? "" : "M4 2h1v2H4zM11 2h1v2h-1z";
  return (
    <svg width={size} height={(size * 10) / 16} viewBox="0 0 16 10" className="block shrink-0" shapeRendering="crispEdges">
      <path d={`M2 0h12v8H2zM0 4h2v2H0zM14 4h2v2h-2z${legs}${eyes}`} fill={CLAUDE.orange} fillRule="evenodd" />
      {happy ? <path d="M3.3 2.1 5 3 3.3 3.9M12.7 2.1 11 3l1.7.9" fill="none" stroke="#000000" strokeWidth={0.55} shapeRendering="geometricPrecision" /> : null}
    </svg>
  );
}

/** The mouse pointer, with its tip at (0, 0). */
function Pointer({ press = 0 }: { press?: number }) {
  return (
    <svg width={30} height={45} viewBox="0 0 16 24" className="block" style={{ transform: `scale(${1 - 0.15 * press})`, transformOrigin: "0 0", filter: "drop-shadow(0 3px 4px rgba(28,26,22,0.3))" }}>
      <path d="M1 1v19l5-4.6 3.4 7.4 3-1.4-3.3-7.2H16z" fill={INK} stroke="#FFFFFF" strokeWidth={1.4} strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- 1. The hook: the tab closes, the job keeps going ---------- */

// The window sits under the title, and the × of its tab is where it folds into.
const HOOK_WIN = { x: 30, y: 344 };
const HOOK_CLOSE = { x: 213, y: 21 };

function Hook() {
  const t = useT();
  const close = useStageCue("gancho", "cierro");
  const keeps = useStageCue("gancho", "sigue");
  // The pointer glides to the × of the tab, clicks it, and the window folds into the tab and is gone.
  const reach = ease(interpolate(t, [close - 0.8, close - 0.1], [0, 1], clamp));
  const press = interpolate(t, [close - 0.05, close, close + 0.12], [0, 1, 0], clamp);
  const fold = ease(interpolate(t, [close + 0.1, close + 0.55], [0, 1], clamp));
  const tip = { x: HOOK_WIN.x + HOOK_CLOSE.x, y: HOOK_WIN.y + HOOK_CLOSE.y };
  return (
    <Section y={Y.gancho}>
      {fold < 1 ? (
        <At x={HOOK_WIN.x} y={HOOK_WIN.y} w={480} style={{ transform: `scale(${1 - 0.94 * fold})`, transformOrigin: `${HOOK_CLOSE.x}px ${HOOK_CLOSE.y}px`, opacity: 1 - fold }}>
          <ClaudeWindow request="Actualiza mi app al nuevo SDK y haz que pasen los tests." answer={<>Leo la documentación del SDK nuevo…</>} hot={t >= close - 0.1} />
        </At>
      ) : null}
      {t >= close - 0.8 && fold < 1 ? (
        <At x={430 + (tip.x - 430) * reach} y={600 + (tip.y - 600) * reach} style={{ opacity: 1 - fold }}>
          <Pointer press={press} />
        </At>
      ) : null}
      {t >= close ? <Sfx id="click" at={close} volume={0.3} /> : null}
      {/* The tab is gone, and Claude keeps working in the cloud. */}
      <Appear at={keeps - 0.25} x={270} y={410}>
        <div className="relative -translate-x-1/2" style={{ width: 230, height: 186 }}>
          <Icono name="cloud" size={230} strokeWidth={0.8} ancla={false} className="fill-white text-[#2F5BFF]" />
          <div className="absolute" style={{ left: 66, top: 92 }}>
            <Clawd size={110} working />
          </div>
        </div>
      </Appear>
      <Appear at={keeps} x={270} y={662}>
        <div className="-translate-x-1/2">
          <Status color={GREEN}>trabajo 42 · sigue corriendo</Status>
        </div>
      </Appear>
    </Section>
  );
}

/* ---------- 2. The chat: ask, close the laptop, come back done ---------- */

const REQUEST = "Actualiza mi app al nuevo SDK y haz que pasen los tests.";

function Chat() {
  const t = useT();
  const cloud = useStageCue("chat", "nube");
  const type = useStageCue("chat", "actualiza");
  const tests = useStageCue("chat", "tests");
  const start = useStageCue("chat", "empieza");
  const shut = useStageCue("chat", "cierro");
  const back = useStageCue("chat", "vuelvo");
  const pass = useStageCue("chat", "veinticuatro");
  const dark = fade(t, shut, 0.35) * (1 - fade(t, back, 0.35));
  // The request is typed in the box while the voice says it, and sent when it ends.
  const sent = tests + 0.45;
  const draft = t >= type && t < sent ? REQUEST.slice(0, Math.ceil(REQUEST.length * interpolate(t, [type, tests + 0.3], [0, 1], clamp))) : undefined;
  return (
    <Section y={Y.chat}>
      {t >= sent ? <Sfx id="pop" at={sent} volume={0.25} /> : null}
      <At x={30} y={150} w={480}>
        <ClaudeWindow
          draft={draft}
          request={t >= sent ? REQUEST : undefined}
          answer={
            t >= start ? (
              <>
                <p>Leo la documentación del SDK nuevo…</p>
                {t >= back ? (
                  <div className="mt-2 flex flex-col gap-1 font-sans text-[19px]">
                    <p>
                      <span style={{ color: GREEN }}>✓</span> SDK actualizado en 9 archivos
                    </p>
                    <p style={{ opacity: fade(t, pass - 0.2) }}>
                      <span style={{ color: GREEN }}>✓</span> 24 tests pasan
                    </p>
                  </div>
                ) : null}
              </>
            ) : undefined
          }
          typed={interpolate(t, [start, start + 1.2], [0, 1], clamp)}
        />
      </At>
      {/* The laptop lid comes down: the board goes dark, the job does not. */}
      {dark > 0 ? (
        <At x={0} y={0} w={W} h={SEC} style={{ background: `rgba(28,26,22,${0.82 * dark})` }}>
          <div className="absolute left-1/2 top-[250px] flex -translate-x-1/2 flex-col items-center gap-3" style={{ opacity: dark }}>
            <Icono name="laptop" size={96} strokeWidth={1.6} ancla={false} className="text-white" />
            <span className="font-mono text-[20px] font-bold uppercase text-white">Laptop cerrada</span>
          </div>
        </At>
      ) : null}
      {/* Clawd keeps working where the session runs, in the cloud (facts 1 and 2), above the dark.
          It shows up at "nube" and starts working when the answer does. */}
      <Appear at={cloud} x={270} y={480}>
        <div className="relative -translate-x-1/2" style={{ width: 210, height: 170 }}>
          <Icono name="cloud" size={210} strokeWidth={0.8} ancla={false} className="fill-white text-[#2F5BFF]" />
          <div className="absolute" style={{ left: 60, top: 84 }}>
            <Clawd size={100} working={t >= start && t < pass} />
          </div>
        </div>
      </Appear>
      {t >= shut ? <Sfx id="switch" at={shut} volume={0.3} /> : null}
      <Appear at={pass + 0.3} x={270} y={664}>
        <div className="-translate-x-1/2">
          <Status color={GREEN}>terminó mientras no estabas</Status>
        </div>
      </Appear>
      <At x={0} y={770} w={W}>
        <p className="text-center font-mono text-[18px] text-muted">Ejemplo ilustrativo</p>
      </At>
    </Section>
  );
}

/* ---------- 3. How? Let's draw the mental model ---------- */

function How() {
  const how = useStageCue("como", "como");
  const build = useStageCue("como", "armemos");
  return (
    <Section y={Y.como}>
      <Slam at={how} x={40} y={190} size={120} color={BLUE}>
        ¿Cómo?
      </Slam>
      {/* The three floors of the board, still empty: what we are about to build. */}
      {[
        { icon: "monitor", label: "Navegador", y: 400 },
        { icon: "server", label: "Servidor", y: 520 },
        { icon: "scroll-text", label: "Registro", y: 640 },
      ].map((b, i) => (
        <Appear key={b.label} at={build + 0.25 * i} x={250} y={b.y} w={250}>
          <Box icon={b.icon} label={b.label} h={92} />
        </Appear>
      ))}
    </Section>
  );
}

/* ---------- 4. A normal chat: one connection, and it can break ---------- */

function Stream() {
  const t = useT();
  const browser = useStageCue("stream", "navegador");
  const server = useStageCue("stream", "servidor");
  const words = useStageCue("stream", "palabras");
  const cut = useStageCue("stream", "corta");
  const save = useStageCue("stream", "guardas");
  const go = useStageCue("stream", "continue");
  const broken = t >= cut;
  // The words ride the cable up, one after another, until it breaks.
  const tokens = ["Leo", "la", "doc", "del", "SDK"];
  return (
    <Section y={Y.stream}>
      <At x={40} y={140} w={300}>
        <Box icon="monitor" label="Navegador" state={t >= browser ? "on" : "idle"} />
      </At>
      <Appear at={server - 0.3} x={40} y={330} w={300}>
        <Box icon="server" label="Servidor" state={t >= server ? "on" : "idle"} />
      </Appear>
      <Appear at={server + 0.3} x={40} y={520} w={300}>
        <div className="flex h-[96px] items-center gap-3 rounded-[16px] border-2 bg-white px-4" style={{ borderColor: `${CLAUDE.orange}88` }}>
          <Logo slug="claude" size={38} ancla={false} />
          <span className="font-display text-[26px] font-bold text-ink">Claude</span>
        </div>
      </Appear>
      <Ride at={browser + 0.2} x0={190} y0={240} x1={190} y1={320} until={server + 0.6}>
        <span data-ui="" className="rounded-md bg-ink px-2 py-1 font-mono text-[15px] font-bold text-white">POST /chat</span>
      </Ride>
      {/* One cable, from the model up to the browser. */}
      <At x={410} y={188} w={4} h={380} style={{ background: broken ? RED : BLUE, opacity: fade(t, words - 0.4) }} />
      {broken ? <At x={392} y={360} w={40} h={34} style={{ background: PAPER }} /> : null}
      {broken ? (
        <At x={412} y={377} style={{ transform: "translate(-50%, -50%)" }}>
          <Icono name="unplug" size={34} strokeWidth={2.4} ancla={false} className="text-[#E5484D]" />
        </At>
      ) : null}
      {t >= words
        ? tokens.map((tok, i) => {
            const at = words + 0.35 * i;
            const p = interpolate(t, [at, at + 1.1], [0, 1], clamp);
            const frozen = broken && at + 1.1 * 0.5 > cut;
            if (t < at || (p >= 1 && !frozen)) return null;
            const y = 560 - 370 * (frozen ? Math.min(p, 0.5) : p);
            return (
              <At key={i} x={412} y={y} style={{ transform: "translate(-50%, -50%)" }}>
                <span data-ui="" className="rounded-md px-2 py-0.5 font-mono text-[15px] font-bold text-white" style={{ background: frozen ? RED : BLUE }}>
                  {tok}
                </span>
              </At>
            );
          })
        : null}
      {/* What travels up the cable, from the moment the words do: the lower half is not left empty. */}
      <Appear at={words + 0.3} until={save} x={40} y={640} w={460}>
        <CodeCard lines={[{ text: "event: content_block_delta" }, { text: 'data: {"text": "Leo la doc…"}', color: "#9DB4FF" }]} />
      </Appear>
      <Tag at={cut + 0.2} x={412} y={418} color={RED}>
        Cortado
      </Tag>
      <Appear at={save} x={40} y={640} w={460}>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3 rounded-[12px] bg-white px-4 py-2.5 shadow-[0_6px_18px_rgba(28,26,22,0.08)]">
            <Icono name="save" size={28} strokeWidth={2.4} ancla={false} className="text-[#2F5BFF]" />
            <span className="font-display text-[24px] font-bold text-ink">Guarda lo recibido</span>
          </div>
          <div className="flex items-center gap-3 rounded-[12px] bg-white px-4 py-2.5 shadow-[0_6px_18px_rgba(28,26,22,0.08)]" style={{ opacity: fade(t, go - 0.4) }}>
            <Icono name="play" size={28} strokeWidth={2.4} ancla={false} className="text-[#2F5BFF]" />
            <span className="font-display text-[24px] font-bold text-ink">Pide que siga</span>
          </div>
        </div>
      </Appear>
    </Section>
  );
}

/* ---------- 5. What a cut costs: 3 seconds against 20 minutes ---------- */

function Cost() {
  const t = useT();
  const short = useStageCue("costo", "respuesta");
  const agent = useStageCue("costo", "agente");
  const steps = [useStageCue("costo", "busca"), useStageCue("costo", "programa"), useStageCue("costo", "tests")];
  const lose = useStageCue("costo", "pierdes");
  const lambda = useStageCue("costo", "lambda");
  const fifteen = useStageCue("costo", "quince");
  const grow = interpolate(t, [agent, agent + 1], [0, 1], clamp);
  const lost = t >= lose;
  // The two durations, big and in the middle of the screen; Lambda slams in above them.
  return (
    <Section y={Y.costo}>
      <Appear at={short - 0.2} x={40} y={290} w={460} origin="0% 60%">
        <p className="font-display text-[46px] font-extrabold leading-none text-ink">3 s</p>
        <div className="mt-3 h-[38px] w-[26px] rounded-md" style={{ background: BLUE }} />
      </Appear>
      <Appear at={agent - 0.2} x={40} y={420} w={460} origin="0% 60%">
        <p className="font-display text-[46px] font-extrabold leading-none text-ink">20 min</p>
        <div className="mt-3 h-[38px] rounded-md" style={{ width: 460 * grow, background: lost ? RED : BLUE }} />
      </Appear>
      {["busca", "programa", "tests"].map((s, i) => (
        <Appear key={s} at={steps[i]} x={40 + i * 156} y={540} w={148}>
          <span data-ui="" className="relative block rounded-lg bg-white py-2.5 text-center font-mono text-[22px] font-bold uppercase" style={{ color: lost ? RED : INK, boxShadow: `0 0 0 1.5px ${lost ? RED : LINE}` }}>
            {s}
            <span className="absolute left-3 top-1/2 h-[3px]" style={{ width: `calc(${fade(t, lose + 0.15 * i, 0.3) * 100}% - 24px)`, background: RED }} />
          </span>
        </Appear>
      ))}
      {/* Lambda ends at 15 of the 20 minutes: the rest of the bar does not fit. */}
      {t >= lambda ? (
        <>
          <At x={40 + 460 * 0.75} y={466} w={4} h={140} style={{ background: RED, opacity: fade(t, lambda) }} />
          <At x={40 + 460 * 0.75 + 4} y={478} w={460 * 0.25 - 4} h={38} style={{ background: `repeating-linear-gradient(45deg, ${RED}55 0 6px, transparent 6px 12px)`, opacity: fade(t, lambda) }} />
        </>
      ) : null}
      <Slam at={lambda} x={40} y={140} size={64} color={RED}>
        Lambda:
        <br />
        {t >= fifteen ? "15 min" : "…"}
      </Slam>
      <Appear at={fifteen + 0.2} x={270} y={660}>
        <div className="-translate-x-1/2">
          <Status color={RED}>máximo por función</Status>
        </div>
      </Appear>
    </Section>
  );
}

/* ---------- 6. The idea: split the work from the connection ---------- */

const TICKET_X = 434;

function Idea() {
  const t = useT();
  const split = useStageCue("idea", "separa");
  const send = useStageCue("idea", "mandas");
  const make = useStageCue("idea", "crea");
  const back = useStageCue("idea", "devuelve");
  const worker = useStageCue("idea", "worker");
  return (
    <Section y={Y.idea}>
      <Slam at={split - 0.1} x={40} y={135} size={44} color={BLUE}>
        Separa el trabajo
        <br />
        de la conexión
      </Slam>
      {/* The API stamps the ticket on its right side, clear of its name. The number goes back up and the job
          goes down to the worker under the boxes, so the ticket never covers a label. */}
      <Ride at={back} x0={TICKET_X} y0={462} x1={TICKET_X} y1={250}>
        <Ticket size={15} />
      </Ride>
      <Ride at={worker} x0={TICKET_X} y0={462} x1={TICKET_X} y1={700}>
        <Ticket size={15} />
      </Ride>
      <Appear at={send - 0.3} x={240} y={270} w={264}>
        <Box icon="monitor" label="Navegador" state={t >= back + 0.6 ? "on" : "idle"} h={84} />
      </Appear>
      <Appear at={send} x={240} y={420} w={264}>
        <Box icon="door-open" label="API" state={t >= make ? "on" : "idle"} h={84} />
      </Appear>
      <Appear at={send + 0.6} x={240} y={570} w={264}>
        <Box glyph={<Clawd size={56} working={t >= worker + 0.6} />} label="Worker" state={t >= worker + 0.6 ? "ok" : "idle"} h={84} />
      </Appear>
      <Ride at={make} dur={0.3} x0={TICKET_X} y0={462} x1={TICKET_X} y1={462} until={back}>
        <Ticket size={15} />
      </Ride>
      {t >= make ? <Sfx id="pop" at={make} volume={0.3} /> : null}
    </Section>
  );
}

/* ---------- 7. The log: everything in order, with its position ---------- */

const LOG = ["leer docs", "buscar SDK", "editar api.ts", "editar db.ts", "correr tests", "3 fallan", "arreglar", "correr tests"];

function Log() {
  const t = useT();
  const log = useStageCue("registro", "registro");
  const redis = useStageCue("registro", "redis");
  const order = useStageCue("registro", "orden");
  const browser = useStageCue("registro", "navegador");
  const read = useStageCue("registro", "lee");
  return (
    <Section y={Y.registro}>
      <At x={40} y={140} w={460}>
        <Box glyph={<Clawd size={56} working />} label="Worker" state="ok" h={80}>
          <span className="ml-auto">
            <Ticket size={15} />
          </span>
        </Box>
      </At>
      <Tag at={redis} x={270} y={250} color={RED}>
        Redis Stream
      </Tag>
      <div className="absolute" style={{ left: 40, top: 300, width: 460 }}>
        <div className="grid grid-cols-2 gap-2.5">
          {LOG.map((text, i) => {
            const at = log + 0.45 * i;
            return <div key={i}>{t >= at ? <Slot n={i + 1} text={text} state={t >= order && t < order + 0.9 ? "hot" : "on"} /> : <Slot n={i + 1} state="off" />}</div>;
          })}
        </div>
      </div>
      <Appear at={browser - 0.2} x={40} y={640} w={460}>
        <Box icon="monitor" label="Navegador" h={80}>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[17px] font-bold uppercase" style={{ color: BLUE, opacity: fade(t, read) }}>
            <Icono name="eye" size={24} strokeWidth={2.4} ancla={false} />
            solo lee
          </span>
        </Box>
      </Appear>
      <At x={268} y={556} w={0} h={84} style={{ borderLeft: `3px dashed ${BLUE}`, opacity: fade(t, read) }} />
    </Section>
  );
}

/* ---------- 8. Resume: "the last thing I saw was 57" ---------- */

function Resume() {
  const t = useT();
  const off = useStageCue("reanudar", "desconectas");
  const keeps = useStageCue("reanudar", "sigue");
  const back = useStageCue("reanudar", "vuelves");
  const fifty = useStageCue("reanudar", "cincuenta");
  const after = useStageCue("reanudar", "despues");
  const named = useStageCue("reanudar", "reanudable");
  const cut = t >= off && t < back + 0.4;
  // The log keeps growing while you are away: 55, 56, 57 seen; 58 to 61 written without you.
  const written = Math.min(7, 3 + Math.floor(Math.max(0, t - keeps) / 0.6));
  return (
    <Section y={Y.reanudar}>
      <At x={40} y={140} w={460}>
        <Box icon="monitor" label="Navegador" state={cut ? "down" : t >= back + 0.4 ? "on" : "idle"} h={80} />
      </At>
      <At x={268} y={222} w={0} h={70} style={{ borderLeft: `3px ${cut ? "solid" : "dashed"} ${cut ? RED : BLUE}` }} />
      {cut ? (
        <At x={270} y={257} style={{ transform: "translate(-50%, -50%)" }}>
          <Icono name="unplug" size={34} strokeWidth={2.4} ancla={false} className="bg-[#F3EFE6] text-[#E5484D]" />
        </At>
      ) : null}
      <div className="absolute" style={{ left: 40, top: 300, width: 300 }}>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 7 }, (_, i) => {
            const n = 55 + i;
            const seen = n <= 57;
            const state = i >= written ? "off" : t >= after && !seen ? "replay" : n === 57 && t >= fifty ? "hot" : "on";
            return <Slot key={n} n={n} text={i < written ? (seen ? "visto" : "nuevo") : undefined} state={state} />;
          })}
        </div>
      </div>
      <At x={360} y={300} w={140}>
        <div className="flex flex-col items-center gap-2 rounded-[16px] border-2 bg-white px-2 py-3" style={{ borderColor: GREEN }}>
          <Icono name="cpu" size={38} strokeWidth={2} ancla={false} className="text-[#1F9D55]" />
          <span className="font-mono text-[16px] font-bold uppercase text-[#1F9D55]">sigue</span>
        </div>
      </At>
      <Appear at={fifty - 0.3} x={360} y={440} w={140}>
        <CodeCard lines={[{ text: "Last-Event-ID:" }, { text: "57", color: "#9DB4FF" }]} />
      </Appear>
      <Slam at={named} x={40} y={700} size={52} color={BLUE}>
        Stream reanudable
      </Slam>
    </Section>
  );
}

/* ---------- 9. Durable execution: checkpoints, a crash at step 7 ---------- */

function Checkpoints() {
  const t = useT();
  const fall = useStageCue("checkpoints", "cae");
  const durable = useStageCue("checkpoints", "durable");
  const done = useStageCue("checkpoints", "terminado");
  const other = useStageCue("checkpoints", "otro");
  const six = useStageCue("checkpoints", "seis");
  const sq = 40;
  const gap = 6.6;
  // Worker 1 has done steps 1 to 6 when the scene starts; at "cae" step 7 goes red.
  const row = (y: number, label: string, cell: (i: number) => { bg: string; color: string }) => (
    <At x={40} y={y} w={460}>
      <p className="mb-1.5 font-mono text-[16px] font-bold uppercase text-muted">{label}</p>
      <div className="flex" style={{ gap }}>
        {Array.from({ length: 10 }, (_, i) => {
          const c = cell(i);
          return (
            <span key={i} data-ui="" className="flex items-center justify-center rounded-[8px] font-mono text-[16px] font-bold" style={{ width: sq, height: sq, background: c.bg, color: c.color, boxShadow: `0 0 0 1.5px ${LINE}` }}>
              {i + 1}
            </span>
          );
        })}
      </div>
    </At>
  );
  const w2 = Math.floor(Math.max(0, t - other - 0.4) / 0.5);
  // Each worker is a Clawd standing on its step: the first one falls over at step 7,
  // the second one lands on step 7 and walks on, one cell per finished step.
  const cellX = (i: number) => 40 + i * (sq + gap) + sq / 2;
  const tip = interpolate(t, [fall, fall + 0.35], [0, 1], clamp);
  const f2 = Math.max(0, t - other - 0.4) / 0.5;
  const at2 = Math.min(3, Math.floor(f2));
  const x2 = cellX(6 + at2) + (at2 < 3 ? ease(interpolate(f2 - at2, [0.75, 1], [0, 1], clamp)) * (sq + gap) : 0);
  return (
    <Section y={Y.checkpoints}>
      <Slam at={durable} x={40} y={130} size={46} color={BLUE}>
        Ejecución durable
      </Slam>
      {row(210, t >= fall ? "Worker 1 · caído" : "Worker 1", (i) => (i < 6 ? { bg: GREEN, color: "#FFFFFF" } : i === 6 ? (t >= fall ? { bg: RED, color: "#FFFFFF" } : { bg: `${BLUE}22`, color: INK }) : { bg: "#FFFFFF", color: MUTED }))}
      <At x={cellX(6) - 24} y={206} style={{ transform: `translateY(${tip * 6}px) rotate(${tip * 180}deg)`, opacity: 1 - 0.55 * tip }}>
        <Clawd size={48} working={t < fall} />
      </At>
      {t >= fall ? <Sfx id="golpe" at={fall} volume={0.3} /> : null}
      {/* The crash, big, in the middle of the screen until worker 2 takes its place. */}
      <Appear at={fall} until={other - 0.6} x={120} y={330} w={300}>
        <div style={{ transform: `translateY(${tip * 14}px) rotate(${tip * -7}deg)`, transformOrigin: "0% 100%" }}>
          <Box glyph={<Clawd size={56} />} label="Worker 1" state="down" h={88}>
            <Icono name="unplug" size={32} strokeWidth={2.4} ancla={false} className="ml-auto text-[#E5484D]" />
          </Box>
        </div>
      </Appear>
      {t >= other - 0.3
        ? row(320, "Worker 2", (i) => (i < 6 ? { bg: "#D9D5CB", color: MUTED } : i - 6 < w2 ? { bg: GREEN, color: "#FFFFFF" } : i - 6 === w2 ? { bg: `${BLUE}22`, color: INK } : { bg: "#FFFFFF", color: MUTED }))
        : null}
      <Appear at={other} x={x2 - 24} y={316}>
        <Clawd size={48} working={f2 < 4} />
      </Appear>
      {/* Each finished step drops its checkpoint into the database. */}
      <Appear at={done - 0.3} x={40} y={500} w={460}>
        <Box icon="database" label="Base de datos" h={84}>
          <span className="ml-auto font-mono text-[18px] font-bold text-[#1F9D55]">{t >= done ? "6 checkpoints" : ""}</span>
        </Box>
      </Appear>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Ride key={i} at={done + 0.12 * i} dur={0.5} x0={60 + i * (sq + gap)} y0={268} x1={420} y1={542} until={done + 0.12 * i + 0.5}>
          <span className="block h-3 w-3 rounded-full" style={{ background: GREEN }} />
        </Ride>
      ))}
      <Appear at={six - 0.2} x={270} y={680}>
        <div className="-translate-x-1/2">
          <Status color={GREEN}>pasos 1 a 6 · pagados una vez</Status>
        </div>
      </Appear>
    </Section>
  );
}

/* ---------- 10. Idempotent: step 7 may run twice, the card is charged once ---------- */

function Idempotent() {
  const t = useT();
  const look = useStageCue("idempotente", "ojo");
  const twice = useStageCue("idempotente", "dos");
  const word = useStageCue("idempotente", "idempotente");
  const card = useStageCue("idempotente", "tarjeta");
  const key = useStageCue("idempotente", "clave");
  const retry = useStageCue("idempotente", "reintento");
  const same = useStageCue("idempotente", "respuesta");
  const fixed = t >= same;
  return (
    <Section y={Y.idempotente}>
      <Slam at={word} x={40} y={130} size={60} color={BLUE}>
        Idempotente
      </Slam>
      {/* The payments card is there from the first word: step 7 already charged once. */}
      <Appear at={look + 0.1} x={40} y={230} w={460}>
        <div data-ui="" className="rounded-[14px] border bg-white px-4 py-3 font-sans" style={{ borderColor: LINE, boxShadow: "0 12px 28px rgba(28,26,22,0.1)" }}>
          <div className="mb-2 flex items-center gap-2">
            <Logo slug="stripe" size={26} ancla={false} />
            <span className="text-[20px] font-semibold text-ink">Pagos</span>
          </div>
          <div className="flex items-center justify-between border-t py-2.5 text-[20px]" style={{ borderColor: LINE }}>
            <span className="font-mono">$49.00 · paso 7</span>
            <span className="rounded-md px-2 py-0.5 text-[17px] font-bold text-white" style={{ background: GREEN }}>
              cobrado
            </span>
          </div>
          {t >= twice + 0.3 ? (
            <div className="relative flex items-center justify-between border-t py-2.5 text-[20px]" style={{ borderColor: LINE, opacity: fixed ? 0.45 : 1 }}>
              <span className="font-mono">$49.00 · reintento</span>
              <span className="rounded-md px-2 py-0.5 text-[17px] font-bold text-white" style={{ background: RED }}>
                cobrado otra vez
              </span>
              <span className="absolute left-0 top-1/2 h-[3px]" style={{ width: `${fade(t, same, 0.35) * 100}%`, background: INK }} />
            </div>
          ) : null}
        </div>
      </Appear>
      {t >= card ? <Sfx id="caja-registradora" at={card} volume={0.25} /> : null}
      {/* Each header breaks where it reads well, never mid-word; the card stays right of the avatar (x 220). */}
      <Appear at={card} x={222} y={530} w={282}>
        <CodeCard
          size={17}
          lines={[
            { text: "POST /v1/payment_intents" },
            { text: "Idempotency-Key:", color: "#9DB4FF", at: key },
            { text: "job42-step7", color: "#9DB4FF", at: key + 0.3 },
            { text: "↻ Idempotent-Replayed:", color: "#7FE0A6", at: retry },
            { text: "true", color: "#7FE0A6", at: retry },
          ]}
        />
      </Appear>
    </Section>
  );
}

/* ---------- 11. How to build it: by hand, or a framework ---------- */

function Wordmark({ children }: { children: ReactNode }) {
  return <span className="font-sans text-[20px] font-bold tracking-tight text-ink">{children}</span>;
}

function Build() {
  const t = useT();
  const short = useStageCue("construir", "cortos");
  const pg = useStageCue("construir", "postgres");
  const redis = useStageCue("construir", "redis");
  const worker = useStageCue("construir", "worker");
  const long = useStageCue("construir", "largos");
  const temporal = useStageCue("construir", "temporal");
  const inngest = useStageCue("construir", "inngest");
  const vercel = useStageCue("construir", "vercel");
  const pill = (children: ReactNode) => (
    <div className="flex h-[64px] items-center gap-2.5 rounded-[14px] border-2 bg-white px-3" style={{ borderColor: LINE }}>
      {children}
    </div>
  );
  return (
    <Section y={Y.construir}>
      <Tag at={short} x={142} y={140} color={INK}>
        Chats cortos
      </Tag>
      <Tag at={long} x={398} y={140} color={BLUE}>
        Agentes largos
      </Tag>
      <At x={269} y={190} w={2} h={480} style={{ background: LINE }} />
      <Appear at={pg} x={40} y={190} w={205}>
        {pill(
          <>
            <Logo slug="postgresql" size={32} ancla={false} />
            <Wordmark>Postgres</Wordmark>
          </>,
        )}
      </Appear>
      <Appear at={redis} x={40} y={275} w={205}>
        {pill(
          <>
            <Logo slug="redis" size={32} ancla={false} />
            <Wordmark>Redis</Wordmark>
          </>,
        )}
      </Appear>
      <Appear at={worker} x={40} y={360} w={205}>
        {pill(
          <>
            <Icono name="cpu" size={32} strokeWidth={2} ancla={false} className="text-ink" />
            <Wordmark>Worker</Wordmark>
          </>,
        )}
      </Appear>
      <Appear at={temporal} x={295} y={190} w={205}>
        {pill(
          <>
            <Logo slug="temporal" size={30} ancla={false} />
            <Wordmark>Temporal</Wordmark>
          </>,
        )}
      </Appear>
      {/* Inngest and Trigger.dev come from the logo catalog (rule 6). Both files are the whole wordmark,
          so they go alone, in a box as wide as the pill (Logo draws a square). */}
      <Appear at={inngest} x={295} y={275} w={205}>
        {pill(
          <div className="flex h-[40px] w-full items-center justify-center">
            <Logo slug="inngest" size={124} ancla={false} />
          </div>,
        )}
      </Appear>
      <Appear at={inngest + 0.5} x={295} y={360} w={205}>
        {pill(
          <div className="flex h-[40px] w-full items-center justify-center">
            <Logo slug="trigger-dev" size={170} ancla={false} />
          </div>,
        )}
      </Appear>
      <Appear at={vercel} x={295} y={445} w={205}>
        {pill(
          <>
            <Logo slug="vercel" size={26} ancla={false} />
            <Wordmark>Workflow</Wordmark>
          </>,
        )}
      </Appear>
      {["checkpoints", "reintentos", "stream"].map((c, i) => (
        <Tag key={c} at={long + 0.4 + 0.25 * i} x={398} y={570 + i * 48} color={GREEN}>
          {c}
        </Tag>
      ))}
      <Appear at={worker + 0.4} x={40} y={470} w={205}>
        <p className="text-center font-display text-[24px] font-bold text-ink" style={{ opacity: fade(t, worker + 0.4) }}>
          Lo armas tú
        </p>
      </Appear>
    </Section>
  );
}

/* ---------- 12. Anthropic does the same: the session is the log ---------- */

function Anthropic() {
  const t = useT();
  const managed = useStageCue("anthropic", "managed");
  const log = useStageCue("anthropic", "registro");
  const fall = useStageCue("anthropic", "cae");
  const fresh = useStageCue("anthropic", "nuevo");
  const down = fade(t, fall, 0.4);
  return (
    <Section y={Y.anthropic}>
      <At x={40} y={140} w={460}>
        <div className="flex items-center justify-center gap-3">
          <Logo slug="anthropic" size={34} ancla={false} />
          <span className="font-display text-[30px] font-extrabold text-ink" style={{ opacity: fade(t, managed - 0.2) }}>
            Managed Agents
          </span>
        </div>
      </At>
      <div className="absolute" style={{ left: 40, top: 220, width: 460 }}>
        <p className="mb-2 font-mono text-[16px] font-bold uppercase text-muted">Sesión</p>
        <div className="grid grid-cols-2 gap-2.5">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="[&>div]:h-[54px] [&>div]:text-[18px]">{t >= log + 0.3 * i ? <Slot n={i + 1} text={["pedido", "pensar", "herramienta", "resultado", "pensar", "respuesta"][i]} /> : <Slot n={i + 1} state="off" />}</div>
          ))}
        </div>
      </div>
      <At x={40} y={600} w={210} style={{ transform: `translateY(${down * 40}px) rotate(${down * -8}deg)`, opacity: 1 - 0.6 * down }}>
        <Box icon="cpu" label="Arnés" state={t >= fall ? "down" : "on"} h={84} />
      </At>
      <Appear at={fresh} x={290} y={600} w={210}>
        <Box icon="cpu" label="Arnés" state="ok" h={84} />
      </Appear>
      <Appear at={fresh + 0.4} x={290} y={700} w={210}>
        <CodeCard className="text-center" lines={[{ text: "wake(sessionId)", color: "#7FE0A6" }]} />
      </Appear>
      <At x={0} y={520} w={W}>
        <p className="text-center font-mono text-[18px] text-muted">Anthropic, abril de 2026</p>
      </At>
    </Section>
  );
}

/* ---------- 13. The close: two layers, one durable agent, and the question ---------- */

function End() {
  const t = useT();
  const resume = useStageCue("cierre", "reanudable");
  const exec = useStageCue("cierre", "ejecucion");
  const both = useStageCue("cierre", "juntas");
  const ask = useStageCue("cierre", "armarias");
  const tell = useStageCue("cierre", "cuentame");
  const layer = (at: number, label: string) => (
    <div className="flex h-[66px] items-center gap-3 rounded-[14px] border-2 bg-white px-4" style={{ borderColor: t >= at ? BLUE : LINE, opacity: 0.35 + 0.65 * fade(t, at - 0.1) }}>
      <Icono name="check" size={28} strokeWidth={3} ancla={false} className="text-[#2F5BFF]" />
      <span className="font-display text-[26px] font-bold text-ink">{label}</span>
    </div>
  );
  return (
    <Section y={Y.cierre}>
      <At x={40} y={140} w={460}>
        {layer(resume, "Stream reanudable")}
      </At>
      <At x={40} y={220} w={460}>
        {layer(exec, "Ejecución durable")}
      </At>
      <Slam at={both} x={40} y={316} w={300} size={60} color={BLUE}>
        Agente
        <br />
        durable
      </Slam>
      {/* Clawd, happy, hops next to the name: the job survived. */}
      <Appear at={both + 0.15} x={352} y={322}>
        <div style={{ transform: `translateY(${-Math.abs(Math.sin((t - both) * 5)) * 14 * (1 - fade(t, both + 2.5, 0.6))}px)` }}>
          <Clawd size={148} happy />
        </div>
      </Appear>
      <Appear at={both + 0.5} x={270} y={456}>
        <div className="-translate-x-1/2">
          <Status color={GREEN}>pestaña cerrada · trabajo 42 sigue</Status>
        </div>
      </Appear>
      {/* The question, as two answers to pick in the comments; the avatar stands on the left. */}
      <Appear at={ask} x={240} y={536} w={264}>
        <div className="flex flex-col gap-2.5">
          {["A mano", "Framework"].map((a, i) => (
            <div key={a} className="flex h-[60px] items-center gap-2.5 rounded-full px-5" style={{ background: i === 0 ? "#FFFFFF" : BLUE, boxShadow: `0 0 0 2px ${BLUE}` }}>
              <Icono name="message-circle" size={26} strokeWidth={2.4} ancla={false} className={i === 0 ? "text-[#2F5BFF]" : "text-white"} />
              <span className="font-display text-[24px] font-bold" style={{ color: i === 0 ? BLUE : "#FFFFFF" }}>
                {a}
              </span>
            </div>
          ))}
        </div>
      </Appear>
      {t >= tell ? <Sfx id="pop" at={tell} volume={0.25} /> : null}
    </Section>
  );
}

/* ---------- The board ---------- */

function World() {
  const t = useT();
  return (
    <div className="absolute inset-0 text-ink" style={{ background: PAPER }}>
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: `radial-gradient(circle, ${INK} 1.1px, transparent 1.3px)`, backgroundSize: "28px 28px" }} />
      {/* The path of job 42: one blue trace down the whole board. */}
      <At x={18} y={0} w={3} h={H} style={{ background: `linear-gradient(${BLUE}, ${BLUE})`, opacity: 0.5 }} />
      {IDS.map((id) => (
        <At key={id} x={13} y={Y[id] + 128} w={13} h={13} style={{ borderRadius: 99, background: BLUE, boxShadow: `0 0 0 ${3 + Math.sin(t * 2) * 1.5}px ${BLUE}33` }} />
      ))}
      <Hook />
      <Chat />
      <How />
      <Stream />
      <Cost />
      <Idea />
      <Log />
      <Resume />
      <Checkpoints />
      <Idempotent />
      <Build />
      <Anthropic />
      <End />
    </div>
  );
}

/* ---------- Over the board: the hook ---------- */

function HookTitle() {
  return (
    <div className="relative mt-[42px]">
      <h1 className="font-display text-[48px] font-extrabold leading-[1] tracking-tight text-ink">
        Tu agente no necesita
        <br />
        tu <span className="text-accent">pestaña</span>
      </h1>
    </div>
  );
}

const AVATAR_SCENES = ["como", "idea", "idempotente", "cierre"];

export default defineVideo({
  captions: "pill",
  chapters: true,
  stage: { World, width: W, height: H, drift: 0.02 },
  // A replica lasts what its reference lasts (144 s): a faster voice instead of cutting content (docs/direccion-reels.md, 3).
  voice: { tempo: 1.2 },
  music: { file: "audio/cama.mp3" },
  avatar: { scenes: AVATAR_SCENES },
  meter: {
    kind: "slots",
    max: 3,
    start: 0,
    steps: [
      { scene: "reanudar", word: "reanudable", value: 1 },
      { scene: "checkpoints", word: "durable", value: 2 },
      { scene: "cierre", word: "juntas", value: 3 },
    ],
  },
  scenes: [
    { id: "gancho", chapter: "La pestaña", camera: shot(Y.gancho), Visual: HookTitle },
    { id: "chat", chapter: "Claude Code", camera: shot(Y.chat) },
    { id: "como", chapter: "¿Cómo?", camera: shot(Y.como) },
    { id: "stream", chapter: "Un chat normal", camera: shot(Y.stream) },
    { id: "costo", chapter: "Lo que cuesta", camera: shot(Y.costo) },
    { id: "idea", chapter: "La idea", camera: shot(Y.idea) },
    { id: "registro", chapter: "El registro", camera: shot(Y.registro) },
    { id: "reanudar", chapter: "Reanudar", camera: shot(Y.reanudar) },
    { id: "checkpoints", chapter: "Checkpoints", camera: shot(Y.checkpoints) },
    { id: "idempotente", chapter: "Idempotente", camera: shot(Y.idempotente) },
    { id: "construir", chapter: "Cómo armarlo", camera: shot(Y.construir) },
    { id: "anthropic", chapter: "Anthropic", camera: shot(Y.anthropic) },
    { id: "cierre", chapter: "Agente durable", camera: shot(Y.cierre) },
  ],
});
