import type { CSSProperties, ReactNode } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Icono, Logo } from "@motor/ui";
import { Board, defineVideo, fan, Sfx, useCue, usePop, useStage, useStageCue, type BoardEdge, type BoardNode } from "@motor/video";

// Un agente al centro: arriba, sus herramientas por líneas violetas (MCP); abajo, los
// editores por líneas verdes (ACP) (video.json → world). Los métodos y campos de los
// mensajes son los de las especificaciones (facts.json); el pedido, el plan, los
// archivos y el diff son ilustrativos.

const W = 540;
const SEC = 960;
const VIEW_Y = 427;
const Y = { hall: 0, proto: 960, mcp: 1920, editor: 2880, acp: 3840, integ: 4800, sesion: 5760, real: 6720, adapt: 7680, jb: 8640, end: 9600 };
const H = 10560;
const shot = (y: number, zoom = 1) => ({ focus: { x: W / 2, y: y + VIEW_Y }, zoom });

const MCP = "#A78BFA";
const ACP = "#5EEAD4";
const SLATE = "#1A1D26";
const EDGE = "#2A2F3C";
const CREAM = "#ECEEF3";
const RED = "#F87171";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (t: number, at: number, dur = 0.3) => interpolate(t, [at, at + dur], [0, 1], clamp);
const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

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

/** A filled pill that slams in. */
function Stamp({ at, x, y, color = ACP, children, size = 18 }: { at: number; x: number; y: number; color?: string; children: ReactNode; size?: number }) {
  const t = useT();
  if (t < at) return null;
  const p = interpolate(t, [at, at + 0.16], [1.6, 1], clamp);
  return (
    <At x={x} y={y} style={{ transform: `translate(-50%, -50%) rotate(-2deg) scale(${p})`, opacity: fade(t, at, 0.08) }}>
      <Sfx id="golpe" at={at} volume={0.35} />
      <div className="whitespace-nowrap rounded-full px-4 py-1.5 font-mono font-black uppercase leading-none text-[#0F1117] shadow-[0_10px_24px_rgba(0,0,0,0.45)]" style={{ background: color, fontSize: size }}>
        {children}
      </div>
    </At>
  );
}

/** A short sign of the world (1 to 3 words): it does not count as text to read. */
function Tag({ at, x, y, color, until, children }: { at: number; x: number; y: number; color?: string; until?: number; children: ReactNode }) {
  return (
    <Appear at={at} until={until} x={x} y={y} sound="blip">
      <span className="block whitespace-nowrap rounded-md px-2.5 py-1 font-mono text-[16px] font-bold uppercase leading-none" style={{ background: color ?? "#262B38", color: color ? "#0F1117" : CREAM }}>
        {children}
      </span>
    </Appear>
  );
}

/** A data card of an interface (data-ui): mono text that does not count as text to read. */
function Card({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div data-ui="" className={`rounded-[14px] border font-mono text-ink shadow-[0_14px_30px_rgba(0,0,0,0.45)] ${className ?? ""}`} style={{ background: SLATE, borderColor: "rgba(236,238,243,0.12)", ...style }}>
      {children}
    </div>
  );
}

/** A logo on its tile, with its name under it. */
function Tile({ slug, icon, name, size = 58, color }: { slug?: string; icon?: string; name?: string; size?: number; color?: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center justify-center rounded-[16px] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.4)]" style={{ width: size, height: size, boxShadow: color ? `0 0 0 3px ${color}, 0 8px 20px rgba(0,0,0,0.4)` : undefined }}>
        {slug ? <Logo slug={slug} size={size * 0.56} ancla={false} /> : <Icono name={icon ?? "bot"} size={size * 0.56} strokeWidth={2.2} ancla={false} className="text-[#0F1117]" />}
      </div>
      {name ? <span className="whitespace-nowrap font-mono text-[14px] font-bold leading-none text-ink">{name}</span> : null}
    </div>
  );
}

/** A tile placed by its center, popping in at `at`. */
function TileAt({ at, x, y, ...tile }: { at: number; x: number; y: number } & Parameters<typeof Tile>[0]) {
  const t = useT();
  const p = usePop(at);
  if (t < at) return null;
  return (
    <At x={x} y={y} style={{ transform: `translate(-50%, -${(tile.size ?? 58) / 2}px) scale(${0.6 + 0.4 * Math.min(1, p)})`, opacity: Math.min(1, p * 1.6) }}>
      <Sfx id="pop" at={at} volume={0.22} />
      <Tile {...tile} />
    </At>
  );
}

/** A big acronym that unfolds its words, one per cue. */
function Acronym({ x, y, color, words, cues }: { x: number; y: number; color: string; words: [string, string, string]; cues: number[] }) {
  const t = useT();
  return (
    <At x={x} y={y}>
      {words.map((word, i) => {
        const open = fade(t, cues[i], 0.45);
        const rest = word.slice(1);
        return (
          <p key={word} className="font-display text-[50px] font-black leading-[1.04] tracking-tight text-ink">
            <span style={{ color }}>{word[0]}</span>
            <span style={{ clipPath: `inset(0 ${(1 - open) * 100}% 0 0)`, display: "inline-block" }}>{rest}</span>
          </p>
        );
      })}
    </At>
  );
}

/** A window of an app: a title bar with its dots and a dark body. */
function AppWindow({ title, children, accent, className }: { title: string; children: ReactNode; accent?: string; className?: string }) {
  return (
    <div data-ui="" className={`overflow-hidden rounded-[12px] border font-mono shadow-[0_16px_34px_rgba(0,0,0,0.5)] ${className ?? ""}`} style={{ background: "#0B0D12", borderColor: accent ?? "rgba(236,238,243,0.14)" }}>
      <div className="flex items-center gap-1.5 border-b px-3 py-1.5" style={{ borderColor: "rgba(236,238,243,0.08)", background: SLATE }}>
        <span className="h-2.5 w-2.5 rounded-full bg-[#F87171]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#34D399]" />
        <span className="ml-2 text-[12px] font-bold text-muted">{title}</span>
      </div>
      {children}
    </div>
  );
}

/** Text that types itself from `at`, as in a terminal. */
function Typed({ at, text, cps = 26 }: { at: number; text: string; cps?: number }) {
  const t = useT();
  const n = Math.max(0, Math.min(text.length, Math.floor((t - at) * cps)));
  return (
    <>
      {text.slice(0, n)}
      {t >= at && n < text.length ? <span className="inline-block h-[1em] w-[0.55em] translate-y-[2px] bg-ink/80" /> : null}
    </>
  );
}

/* ---------- The diagram of the hook and the close: MCP up, ACP down ---------- */

const TOOLS = [
  { id: "github", slug: "github", x: 110, cue: "github" },
  { id: "postgres", slug: "postgresql", x: 215, cue: "base" },
  { id: "slack", slug: "slack", x: 325, cue: "slack" },
  { id: "figma", slug: "figma", x: 430, cue: "slack" },
] as const;
const EDITORS = [
  { id: "zed", slug: "zed", x: 285, cue: "zed" },
  { id: "jetbrains", slug: "jetbrains", x: 385, cue: "jetbrains" },
  { id: "neovim", slug: "neovim", x: 485, cue: "neovim" },
] as const;

/** Edges that run from `from` out to each of `to` (a fan reversed, so the light leaves the agent). */
const outward = (from: string, to: string[], opts: Omit<BoardEdge, "from" | "to">) => fan(to, from, opts).map((e) => ({ ...e, from: e.to, to: e.from, curve: -(e.curve ?? 0) }));

function Diagram({ close }: { close: boolean }) {
  const t = useT();
  // In the close the whole diagram is there from the start; in the hook it builds with the voice.
  const hookTools = TOOLS.map((tool) => useStageCue("gancho", tool.cue) + (tool.id === "figma" ? 0.3 : 0));
  const hookEditors = EDITORS.map((e) => useStageCue("gancho", e.cue));
  const hookMcp = useStageCue("gancho", "mcp");
  const hookAcp = useStageCue("gancho", "acp");
  const outTools = useStageCue("cierre", "herramientas");
  const inApp = useStageCue("cierre", "app");
  const toolCues = close ? hookTools.map(() => -1) : hookTools;
  const editorCues = close ? hookEditors.map(() => -1) : hookEditors;
  const mcpWord = close ? -1 : hookMcp;
  const acpWord = close ? -1 : hookAcp;
  const agent = { x: 270, y: 460 };
  const nodes: BoardNode[] = [
    { id: "agent", x: agent.x, y: agent.y, label: "" },
    ...TOOLS.map((tool, i) => ({ id: tool.id, x: tool.x, y: 300, label: "", at: toolCues[i] })),
    ...EDITORS.map((e, i) => ({ id: e.id, x: e.x, y: 640, label: "", at: editorCues[i] })),
  ];
  const edges = [
    ...outward("agent", TOOLS.map((tool) => tool.id), { glow: MCP, pulse: 1.4, curve: 0.22 }),
    ...fan(EDITORS.map((e) => e.id), "agent", { glow: ACP, pulse: 1.4, curve: 0.18 }),
  ];
  return (
    <>
      <Board nodes={nodes} edges={edges} width={W} height={SEC} drawNodes={false} />
      {close
        ? null
        : [...TOOLS.map((tool, i) => [tool.x, 300, tool.slug, toolCues[i]] as const), ...EDITORS.map((e, i) => [e.x, 640, e.slug, editorCues[i]] as const)].map(([x, y, slug, at]) =>
            t < at ? (
              <At key={slug} x={x} y={y} style={{ transform: "translate(-50%, -27px)", opacity: 0.22 }}>
                <Tile slug={slug} size={54} />
              </At>
            ) : null,
          )}
      {TOOLS.map((tool, i) => (
        <TileAt key={tool.id} at={toolCues[i]} x={tool.x} y={300} slug={tool.slug} size={54} />
      ))}
      {EDITORS.map((e, i) => (
        <TileAt key={e.id} at={editorCues[i]} x={e.x} y={640} slug={e.slug} size={54} />
      ))}
      <At x={44} y={350} style={{ opacity: 0.3 + 0.7 * fade(t, mcpWord, 0.25) }}>
        <p className="font-display text-[44px] font-black leading-none" style={{ color: MCP, textShadow: `0 0 24px ${MCP}66` }}>
          MCP
        </p>
      </At>
      <Tag at={close ? outTools : mcpWord + 0.4} x={150} y={362} color={MCP}>
        Herramientas
      </Tag>
      <At x={44} y={528} style={{ opacity: 0.3 + 0.7 * fade(t, acpWord, 0.25) }}>
        <p className="font-display text-[44px] font-black leading-none" style={{ color: ACP, textShadow: `0 0 24px ${ACP}66` }}>
          ACP
        </p>
      </At>
      <Tag at={close ? inApp : acpWord + 0.4} x={150} y={540} color={ACP}>
        Tu editor
      </Tag>
      {/* The agent: a terminal at the middle of both protocols. */}
      <At x={96} y={414} w={348}>
        <AppWindow title="claude — ~/mi-app">
          <div className="px-3 py-2 text-[14px] leading-[1.35] text-ink">
            <p>
              <span style={{ color: ACP }}>›</span> <Typed at={close ? -5 : -0.9} text="¿qué diferencia hay entre MCP y ACP?" />
            </p>
          </div>
        </AppWindow>
      </At>
    </>
  );
}

function Hall({ close }: { close: boolean }) {
  return (
    <Section y={close ? Y.end : Y.hall}>
      <Diagram close={close} />
    </Section>
  );
}

/* ---------- What a protocol is ---------- */

function Protocol() {
  const t = useT();
  const start = useStageCue("protocolo", "primero");
  const programs = useStageCue("protocolo", "programas");
  const rules = useStageCue("protocolo", "jsonrpc");
  const method = useStageCue("protocolo", "metodo");
  const params = useStageCue("protocolo", "parametros");
  const id = useStageCue("protocolo", "id");
  const reply = useStageCue("protocolo", "respuesta");
  const lost = t >= programs + 0.6 && t < rules;
  const travel = t >= programs ? (((t - programs) * 0.7) % 1) : 0;
  return (
    <Section y={Y.proto}>
      <Appear at={start} x={44} y={150} w={212}>
        <AppWindow title="programa-a.js">
          <div className="px-3 py-2 text-[14px] leading-[1.45]">
            <p>send(<span style={{ color: MCP }}>"hola"</span>, msg)</p>
            <p className="text-muted">// programa A</p>
          </div>
        </AppWindow>
      </Appear>
      <Appear at={start + 0.3} x={284} y={150} w={212}>
        <AppWindow title="programa-b.py">
          <div className="px-3 py-2 text-[14px] leading-[1.45]">
            <p>def handle(msg):</p>
            <p className="text-muted"># programa B</p>
          </div>
        </AppWindow>
      </Appear>
      {t >= programs && t < reply + 1.2 ? (
        <At x={190 + travel * 120} y={296} style={{ opacity: 1 }}>
          <span data-ui="" className="rounded-full px-3 py-1 font-mono text-[14px] font-bold" style={{ background: t >= rules ? ACP : "#3A3F4D", color: t >= rules ? "#0F1117" : CREAM }}>
            {t >= reply ? "✓ result" : lost ? "?? 0x7f…" : "msg"}
          </span>
        </At>
      ) : null}
      <Appear at={rules} x={64} y={350} w={412}>
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-2" style={{ borderColor: "rgba(236,238,243,0.08)" }}>
            <span className="text-[13px] font-bold uppercase text-muted">Las reglas compartidas</span>
            <span className="text-[18px] font-black" style={{ color: ACP }}>
              JSON-RPC 2.0
            </span>
          </div>
          {[
            ['"jsonrpc"', '"2.0"', "la versión", rules + 0.3],
            ['"method"', '"tools/call"', "qué hacer", method],
            ['"params"', "{ … }", "los datos", params],
            ['"id"', "1", "empareja la respuesta", id],
          ].map(([key, value, note, at]) => (
            <div key={key as string} className="flex items-baseline gap-3 px-4 py-[7px] text-[16px]" style={{ opacity: fade(t, at as number, 0.25) }}>
              <span className="w-[96px] font-bold" style={{ color: MCP }}>
                {key}
              </span>
              <span className="w-[110px] font-bold text-ink">{value}</span>
              <span className="text-[13px] text-muted">{note}</span>
            </div>
          ))}
        </Card>
      </Appear>
      <Tag at={reply} x={250} y={590} color={ACP}>
        Se entienden
      </Tag>
    </Section>
  );
}

/* ---------- MCP: before and after ---------- */

const MCP_TOOLS = [
  { id: "github", slug: "github", x: 100, file: "github.ts", cue: "github" },
  { id: "postgres", slug: "postgresql", x: 210, file: "postgres.ts", cue: "postgres" },
  { id: "slack", slug: "slack", x: 320, file: "slack.ts", cue: "slack" },
  { id: "figma", slug: "figma", x: 430, file: "figma.ts", cue: "slack" },
] as const;

function Mcp() {
  const t = useT();
  const cues = ["model", "context", "protocol"].map((w) => useStageCue("mcp", w));
  const anthropic = useStageCue("mcp", "anthropic");
  const mstart = useStageCue("mcp", "mcp");
  const before = useStageCue("mcp", "antes");
  const files = MCP_TOOLS.map((tool) => useStageCue("mcp", tool.cue) + (tool.id === "figma" ? 0.4 : 0));
  const after = useStageCue("mcp", "mcp", 2);
  const call = useStageCue("mcp", "toolscall");
  const with_ = t >= after;
  const nodes: BoardNode[] = [{ id: "agent", x: 270, y: 560, label: "", at: before }, ...MCP_TOOLS.map((tool, i) => ({ id: tool.id, x: tool.x, y: 420, label: "", at: before + 0.15 * i }))];
  const edges = with_ ? outward("agent", MCP_TOOLS.map((tool) => tool.id), { glow: MCP, pulse: 1.2, curve: 0.2 }) : outward("agent", MCP_TOOLS.map((tool) => tool.id), { curve: 0.2 });
  return (
    <Section y={Y.mcp}>
      <Acronym x={44} y={140} color={MCP} words={["Model", "Context", "Protocol"]} cues={cues} />
      <Appear at={anthropic} x={330} y={168}>
        <div className="flex flex-col items-center gap-2">
          <Logo slug="anthropic" size={40} chip ancla={false} />
          <span className="font-mono text-[15px] font-bold uppercase text-ink">nov 2024</span>
        </div>
      </Appear>
      {t >= mstart && t < before ? (
        <>
          {MCP_TOOLS.map((tool) => (
            <At key={tool.id} x={tool.x} y={420} style={{ transform: "translate(-50%, -28px)", opacity: 0.22 }}><Tile slug={tool.slug} size={52} /></At>
          ))}
          <At x={270} y={560} style={{ transform: "translate(-50%, -28px)", opacity: 0.22 }}><Tile icon="bot" name="AGENTE" size={56} /></At>
        </>
      ) : null}
      {t >= before ? (
        <div style={{ opacity: fade(t, before, 0.3) }}>
          <Board nodes={nodes} edges={edges} width={W} height={SEC} drawNodes={false} />
        </div>
      ) : null}
      {MCP_TOOLS.map((tool, i) => (
        <TileAt key={tool.id} at={before + 0.15 * i} x={tool.x} y={420} slug={tool.slug} size={52} color={with_ ? MCP : undefined} />
      ))}
      <TileAt at={before} x={270} y={560} icon="bot" name="AGENTE" size={56} />
      <Appear at={before + 0.2} until={after} x={240} y={640} w={264}>
        <Card className="px-3 py-2">
          <p className="mb-1 text-[12px] font-bold uppercase text-muted">integraciones a mano</p>
          {MCP_TOOLS.map((tool, i) => (
            <p key={tool.file} className="text-[15px] font-bold" style={{ opacity: fade(t, files[i], 0.2), color: "#FBBF24" }}>
              {tool.file}
            </p>
          ))}
        </Card>
      </Appear>
      <Appear at={after + 0.2} x={232} y={640} w={272}>
        <Card className="px-3 py-2" style={{ borderColor: MCP }}>
          <p className="mb-1 text-[12px] font-bold uppercase" style={{ color: MCP }}>
            MCP · JSON-RPC 2.0
          </p>
          <p className="text-[14px] leading-[1.35]">
            {'{ "method": '}
            <span style={{ color: MCP, opacity: fade(t, call, 0.2) }}>"tools/call"</span>,
          </p>
          <p className="text-[14px] leading-[1.35]">{'  "params": { "name": "create_issue" } }'}</p>
        </Card>
      </Appear>
      <Tag at={after} x={300} y={296} color={MCP}>
        Un estándar
      </Tag>
    </Section>
  );
}

/* ---------- The other side: the terminal and the editor ---------- */

function DiffLines({ at }: { at: number }) {
  const t = useT();
  const lines: Array<[string, string]> = [
    ["-", 'const theme = "light"'],
    ["+", "const theme = prefersDark()"],
    ["+", '  ? "dark" : "light"'],
    [" ", "export default theme"],
  ];
  return (
    <div className="space-y-[2px] text-[13px]">
      {lines.map(([sign, code], i) => (
        <p key={i} className="rounded-[3px] px-1.5" style={{ opacity: fade(t, at + i * 0.15, 0.2), background: sign === "-" ? "#F8717133" : sign === "+" ? "#34D39933" : "transparent", color: sign === "-" ? "#FCA5A5" : sign === "+" ? "#6EE7B7" : CREAM }}>
          {sign} {code}
        </p>
      ))}
    </div>
  );
}

function Editor() {
  const t = useT();
  const start = useStageCue("editor", "pero");
  const side = useStageCue("editor", "lado");
  const terminal = useStageCue("editor", "terminal");
  const editor = useStageCue("editor", "editor");
  const diff = useStageCue("editor", "diff");
  const accept = useStageCue("editor", "aceptar");
  const reject = useStageCue("editor", "rechazar");
  return (
    <Section y={Y.editor}>
      <Appear at={start} x={44} y={150} w={456}>
        <AppWindow title="claude — ~/mi-app">
          <div className="space-y-1 px-3 py-2 text-[14px] leading-[1.4]">
            <p>
              <span style={{ color: ACP }}>›</span> <Typed at={side} text="agrega el modo oscuro" />
            </p>
            <p style={{ opacity: fade(t, terminal - 0.4) }}>
              <span style={{ color: "#34D399" }}>●</span> Read(src/theme.ts)
            </p>
            <p style={{ opacity: fade(t, terminal + 0.2) }}>
              <span style={{ color: "#34D399" }}>●</span> Edit(src/theme.ts) · 2 líneas
            </p>
          </div>
        </AppWindow>
      </Appear>
      <Tag at={terminal} x={52} y={300}>
        La terminal
      </Tag>
      {t >= start && t < editor ? (
        <At x={44} y={350} w={456} style={{ opacity: 0.25 }}>
          <AppWindow title="mi-app — editor">
            <div className="h-[150px]" />
          </AppWindow>
        </At>
      ) : null}
      <Appear at={editor} x={44} y={350} w={456} sound="whip">
        <AppWindow title="mi-app — editor" accent={ACP}>
          <div className="flex">
            <div className="w-[116px] border-r px-2 py-2 text-[12px] leading-[1.6] text-muted" style={{ borderColor: "rgba(236,238,243,0.08)" }}>
              <p>src/</p>
              <p className="rounded bg-white/10 px-1 text-ink">theme.ts</p>
              <p>app.tsx</p>
              <p>styles.css</p>
            </div>
            <div className="flex-1 px-2 py-2">
              <p className="mb-1 text-[12px] font-bold text-muted">theme.ts · cambios del agente</p>
              {t >= diff ? <DiffLines at={diff} /> : <div className="h-[84px]" />}
              <div className="mt-2 flex justify-end gap-2" style={{ opacity: fade(t, accept - 0.2) }}>
                <span className="rounded-md border px-2 py-1 text-[12px] font-bold" style={{ borderColor: RED, color: RED, transform: `scale(${t >= reject && t < reject + 0.4 ? 1.08 : 1})` }}>
                  Rechazar
                </span>
                <span className="rounded-md px-2 py-1 text-[12px] font-bold text-[#0F1117]" style={{ background: ACP, transform: `scale(${t >= accept && t < accept + 0.4 ? 1.08 : 1})` }}>
                  Aceptar
                </span>
              </div>
            </div>
          </div>
        </AppWindow>
      </Appear>
      <Tag at={editor + 0.3} x={250} y={612} color={ACP}>
        Tu editor
      </Tag>
    </Section>
  );
}

/* ---------- ACP: what it is ---------- */

function Acp() {
  const t = useT();
  const cues = ["agent", "client", "protocol"].map((w) => useStageCue("acp", w));
  const zed = useStageCue("acp", "zed");
  const august = useStageCue("acp", "agosto");
  const apache = useStageCue("acp", "apache");
  const astart = useStageCue("acp", "acp");
  const standard = useStageCue("acp", "estandariza");
  const lsp = useStageCue("acp", "como", 2) - 0.1;
  const nodes: BoardNode[] = [
    { id: "editor", x: 130, y: 520, label: "", at: standard },
    { id: "agent", x: 410, y: 520, label: "", at: standard + 0.2 },
  ];
  const edges: BoardEdge[] = [{ from: "editor", to: "agent", glow: ACP, pulse: 1, curve: 0.12 }];
  return (
    <Section y={Y.acp}>
      <Acronym x={44} y={140} color={ACP} words={["Agent", "Client", "Protocol"]} cues={cues} />
      <TileAt at={zed} x={410} y={186} slug="zed" name="ZED" size={56} />
      <Stamp at={august} x={410} y={290} size={16}>
        Ago 2025
      </Stamp>
      <Stamp at={apache} x={410} y={334} color={CREAM} size={16}>
        Apache 2.0
      </Stamp>
      {t >= standard ? <Board nodes={nodes} edges={edges} width={W} height={SEC} drawNodes={false} /> : null}
      {t >= astart && t < standard ? (
        <>
          <At x={130} y={520} style={{ transform: "translate(-50%, -28px)", opacity: 0.22 }}><Tile icon="app-window" name="EDITOR" size={58} /></At>
          <At x={410} y={520} style={{ transform: "translate(-50%, -28px)", opacity: 0.22 }}><Tile icon="bot" name="AGENTE" size={58} /></At>
        </>
      ) : null}
      <TileAt at={standard} x={130} y={520} icon="app-window" name="EDITOR" size={58} color={ACP} />
      <TileAt at={standard + 0.2} x={410} y={520} icon="bot" name="AGENTE" size={58} color={ACP} />
      <Appear at={lsp} x={240} y={616} w={264}>
        <Card className="space-y-1 px-3 py-2">
          <p className="text-[16px] font-bold">
            <span className="text-muted">LSP:</span> lenguajes ↔ editores
          </p>
          <p className="text-[16px] font-bold">
            <span style={{ color: ACP }}>ACP:</span> agentes ↔ editores
          </p>
        </Card>
      </Appear>
    </Section>
  );
}

/* ---------- One integration per agent, or one for all ---------- */

const AGENTS3 = [
  { id: "claude", slug: "claude", x: 110, name: "CLAUDE CODE", cue: "claude", color: "#F59E0B", format: '{ type: "tool" }' },
  { id: "codex", slug: "openai", x: 270, name: "CODEX", cue: "codex", color: "#E5E7EB", format: '{ event: "diff" }' },
  { id: "opencode", slug: "opencode", x: 430, name: "OPENCODE", cue: "opencode", color: "#FBBF24", format: "msg.call()" },
] as const;

function Integrations() {
  const t = useT();
  const start = useStageCue("integraciones", "si");
  const editorAt = start;
  const cues = AGENTS3.map((a) => useStageCue("integraciones", a.cue));
  const own = useStageCue("integraciones", "mensajes");
  const one = useStageCue("integraciones", "acp", 2);
  const single = useStageCue("integraciones", "sola");
  const merged = t >= one;
  const count = merged ? 1 : Math.max(0, cues.filter((c) => t >= c).length);
  const nodes: BoardNode[] = [{ id: "editor", x: 270, y: 560, label: "", at: editorAt }, ...AGENTS3.map((a, i) => ({ id: a.id, x: a.x, y: 220, label: "", at: cues[i] }))];
  const edges: BoardEdge[] = merged
    ? fan(AGENTS3.map((a) => a.id), "editor", { glow: ACP, pulse: 1.1, curve: 0.18 })
    : AGENTS3.map((a, i) => ({ from: a.id, to: "editor", curve: (i - 1) * 0.18, glow: a.color }));
  return (
    <Section y={Y.integ}>
      <Board nodes={nodes} edges={edges} width={W} height={SEC} drawNodes={false} />
      {AGENTS3.map((a, i) =>
        t >= start && t < cues[i] ? (
          <At key={`dim-${a.id}`} x={a.x} y={220} style={{ transform: "translate(-50%, -28px)", opacity: 0.22 }}>
            <Tile slug={a.slug} name={a.name} size={56} />
          </At>
        ) : null,
      )}
      {AGENTS3.map((a, i) => (
        <TileAt key={a.id} at={cues[i]} x={a.x} y={220} slug={a.slug} name={a.name} size={56} color={merged ? ACP : undefined} />
      ))}
      <TileAt at={editorAt} x={270} y={560} icon="app-window" name="TU EDITOR" size={60} />
      {AGENTS3.map((a, i) => (
        <Appear key={a.format} at={Math.max(cues[i] + 0.3, own - 0.6 + i * 0.15)} until={one} x={a.x - 70} y={380} w={140}>
          <span data-ui="" className="block rounded-md px-2 py-1 text-center font-mono text-[13px] font-bold" style={{ background: "#262B38", color: a.color }}>
            {a.format}
          </span>
        </Appear>
      ))}
      <Appear at={one + 0.2} x={170} y={380} w={200}>
        <span data-ui="" className="block rounded-md px-2 py-1 text-center font-mono text-[14px] font-bold text-[#0F1117]" style={{ background: ACP }}>
          session/prompt
        </span>
      </Appear>
      <Appear at={cues[0]} x={284} y={660} w={200}>
        <div className="text-right">
          <p className="font-display text-[54px] font-black leading-none" style={{ color: merged ? ACP : "#FBBF24" }}>
            {count}
          </p>
          <p className="font-mono text-[14px] font-bold uppercase text-muted">{count === 1 ? "integración" : "integraciones"}</p>
        </div>
      </Appear>
      <Stamp at={single} x={420} y={480} size={17}>
        Una sola
      </Stamp>
    </Section>
  );
}

/* ---------- An ACP session, message by message ---------- */

function Session() {
  const t = useT();
  const start = useStageCue("sesion", "asi");
  const sub = useStageCue("sesion", "subproceso");
  const init = useStageCue("sesion", "initialize");
  const prompt = useStageCue("sesion", "sessionprompt");
  const update = useStageCue("sesion", "sessionupdate");
  const plan = useStageCue("sesion", "plan");
  const reads = useStageCue("sesion", "lee");
  const diff = useStageCue("sesion", "diff");
  const ask = useStageCue("sesion", "riesgoso") - 0.2;
  const rows: Array<[string, string, string, number]> = [
    ["→", "initialize", "", init],
    ["→", "session/new", "", init + 0.8],
    ["→", "session/prompt", '"modo oscuro"', prompt],
    ["←", "session/update", "plan", plan],
    ["←", "session/update", "tool_call · read", reads],
    ["←", "session/update", "tool_call · edit", diff],
    ["←", "session/request_permission", "", ask],
  ];
  return (
    <Section y={Y.sesion}>
      <Appear at={start} x={44} y={140} w={456}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tile slug="claude" size={44} />
            <span className="font-mono text-[15px] font-bold uppercase text-ink">agente</span>
          </div>
          <span className="font-mono text-[13px] font-bold uppercase text-muted">JSON-RPC por stdio</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[15px] font-bold uppercase text-ink">editor</span>
            <Tile icon="app-window" size={44} />
          </div>
        </div>
      </Appear>
      <Tag at={sub} x={44} y={210} color={ACP}>
        Subproceso
      </Tag>
      <Appear at={start + 0.3} x={44} y={250} w={456}>
        <Card className="overflow-hidden">
          <div className="flex justify-between border-b px-3 py-1.5 text-[12px] font-bold uppercase text-muted" style={{ borderColor: "rgba(236,238,243,0.08)" }}>
            <span>ACP · sesión</span>
            <span>→ al agente · ← al editor</span>
          </div>
          <div className="space-y-[3px] px-3 py-2">
            {rows.map(([dir, method, note, at], i) => (
              <p key={i} className="flex gap-2 text-[16px] leading-[1.3]" style={{ opacity: fade(t, at, 0.2) }}>
                <span className="w-3 font-black" style={{ color: dir === "→" ? ACP : MCP }}>
                  {dir}
                </span>
                <span className="font-bold text-ink">{method}</span>
                <span className="text-muted">{note}</span>
                {t >= at && t < at + 0.1 ? <Sfx id="click" at={at} volume={0.22} /> : null}
              </p>
            ))}
          </div>
        </Card>
      </Appear>
      <Appear at={update} x={44} y={500} w={196}>
        <Card className="px-3 py-2">
          <p className="text-[12px] font-bold uppercase text-muted">en vivo</p>
          <p className="text-[13px]" style={{ opacity: fade(t, plan) }}>
            {t >= reads ? "☑" : "☐"} leer theme.ts
          </p>
          <p className="text-[13px]" style={{ opacity: fade(t, diff), color: "#6EE7B7" }}>
            + prefersDark()
          </p>
        </Card>
      </Appear>
      <Appear at={ask} x={252} y={500} w={252} sound="blip">
        <Card className="px-3 py-2" style={{ borderColor: ACP }}>
          <p className="text-[13px] font-bold">¿Editar theme.ts?</p>
          <div className="mt-2 flex gap-2">
            <span className="rounded-md px-2 py-1 text-[12px] font-bold text-[#0F1117]" style={{ background: ACP }}>
              Permitir una vez
            </span>
            <span className="rounded-md border px-2 py-1 text-[12px] font-bold" style={{ borderColor: RED, color: RED }}>
              Rechazar
            </span>
          </div>
          <p className="mt-1.5 text-[13px] text-muted">allow_once · reject_once</p>
        </Card>
      </Appear>
      <Tag at={ask + 0.6} x={300} y={640} color={ACP}>
        Pide permiso
      </Tag>
    </Section>
  );
}

/* ---------- The real agent behind ---------- */

function Real() {
  const t = useT();
  const adapter = useStageCue("real", "detras");
  const sdk = useStageCue("real", "sdk");
  const intellij = useStageCue("real", "intellij");
  const agents: Array<[string | undefined, string | undefined, string, number]> = [
    ["openai", undefined, "Codex", useStageCue("real", "codex")],
    ["claude", undefined, "Claude Agent", useStageCue("real", "claude", 2)],
    [undefined, "sparkles", "Junie", useStageCue("real", "junie")],
  ];
  return (
    <Section y={Y.real}>
      <Appear at={adapter} x={44} y={150} w={456}>
        <Card className="flex items-center gap-3 px-3 py-2.5" style={{ borderColor: ACP }}>
          <Icono name="plug" size={26} strokeWidth={2.4} ancla={false} className="text-accent" />
          <div>
            <p className="text-[16px] font-black">claude-agent-acp</p>
            <p className="text-[12px] text-muted">adaptador · Apache-2.0</p>
          </div>
        </Card>
      </Appear>
      <At x={270} y={222} style={{ opacity: fade(t, sdk - 0.2) }}>
        <div className="h-[34px] w-[3px] rounded-full" style={{ background: ACP, boxShadow: `0 0 10px ${ACP}` }} />
      </At>
      <Appear at={sdk} x={44} y={262} w={456}>
        <Card className="flex items-center gap-3 px-3 py-2.5">
          <Logo slug="claude" size={28} ancla={false} />
          <div>
            <p className="text-[16px] font-black">SDK oficial de Claude Agent</p>
            <p className="text-[12px] text-muted">el agente real, por detrás</p>
          </div>
        </Card>
      </Appear>
      {t < intellij ? (
        <At x={44} y={380} w={456} style={{ opacity: 0.22 }}>
          <AppWindow title="IntelliJ IDEA — agentes">
            <div className="h-[150px]" />
          </AppWindow>
        </At>
      ) : null}
      <Appear at={intellij} x={44} y={380} w={456} sound="whip">
        <AppWindow title="IntelliJ IDEA — agentes" accent={ACP}>
          <div className="flex items-center gap-2 border-b px-3 py-2" style={{ borderColor: "rgba(236,238,243,0.08)" }}>
            <Logo slug="jetbrains" size={22} chip ancla={false} />
            <span className="text-[13px] font-bold text-muted">Elige un agente (ACP)</span>
          </div>
          <div className="space-y-1.5 px-3 py-2">
            {agents.map(([slug, icon, name, at]) => (
              <div key={name} className="flex items-center gap-2 rounded-md px-2 py-1.5" style={{ opacity: fade(t, at, 0.2), background: "#262B38" }}>
                <Tile slug={slug} icon={icon} size={26} />
                <span className="text-[15px] font-bold text-ink">{name}</span>
                <span className="ml-auto text-[12px] font-bold" style={{ color: ACP }}>
                  ACP
                </span>
              </div>
            ))}
          </div>
        </AppWindow>
      </Appear>
    </Section>
  );
}

/* ---------- Native agents and adapters ---------- */

const NATIVE = [
  { slug: "googlegemini", name: "Gemini", cue: "gemini" },
  { slug: "githubcopilot", name: "Copilot", cue: "copilot" },
  { slug: "cursor", name: "Cursor", cue: "cursor" },
  { slug: "goose", name: "Goose", cue: "goose" },
  { slug: "opencode", name: "OpenCode", cue: "opencode" },
] as const;

function Adapters() {
  const t = useT();
  const bus = useStageCue("adaptadores", "muchos");
  const native = NATIVE.map((n) => useStageCue("adaptadores", n.cue));
  const claude = useStageCue("adaptadores", "claude");
  const codex = useStageCue("adaptadores", "codex");
  const adapter = useStageCue("adaptadores", "adaptador");
  const agents = useStageCue("adaptadores", "48");
  const editors = useStageCue("adaptadores", "21");
  const xs = [76, 173, 270, 367, 464];
  const line = fade(t, bus, 0.5);
  return (
    <Section y={Y.adapt}>
      {NATIVE.map((n, i) =>
        t >= bus && t < native[i] ? (
          <At key={`dim-${n.slug}`} x={xs[i]} y={190} style={{ transform: "translate(-50%, -26px)", opacity: 0.22 }}>
            <Tile slug={n.slug} name={n.name} size={52} />
          </At>
        ) : null,
      )}
      {NATIVE.map((n, i) => (
        <TileAt key={n.slug} at={native[i]} x={xs[i]} y={190} slug={n.slug} name={n.name} size={52} />
      ))}
      <svg className="absolute left-0 top-0 overflow-visible" width={W} height={SEC}>
        {NATIVE.map((n, i) => (
          <line key={n.slug} x1={xs[i]} y1={262} x2={xs[i]} y2={262 + 108 * fade(t, native[i] + 0.2, 0.3)} stroke={ACP} strokeWidth={2.5} style={{ filter: `drop-shadow(0 0 5px ${ACP})` }} />
        ))}
        <line x1={44} y1={372} x2={44 + 452 * line} y2={372} stroke={ACP} strokeWidth={4} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${ACP})` }} />
        {[
          [150, claude],
          [390, codex],
        ].map(([x, at]) => (
          <line key={x} x1={x} y1={372} x2={x} y2={372 + 60 * fade(t, at + 0.3, 0.3)} stroke={ACP} strokeWidth={2.5} strokeDasharray="6 5" />
        ))}
      </svg>
      <Tag at={bus} x={44} y={384} color={ACP}>
        ACP
      </Tag>
      <Tag at={native[0] + 0.4} x={300} y={330}>
        De fábrica
      </Tag>
      {[
        ["claude", "Claude", "claude-agent-acp", 150, claude],
        ["openai", "Codex", "codex-acp", 390, codex],
      ].map(([slug, name, pkg, x, at]) => (
        <Appear key={pkg as string} at={at as number} x={(x as number) - 86} y={434} w={172}>
          <div className="flex flex-col items-center gap-2">
            <span data-ui="" className="rounded-md border px-2 py-1 font-mono text-[13px] font-bold" style={{ borderColor: ACP, color: ACP, opacity: fade(t, adapter, 0.3), background: "#0F1117" }}>
              {pkg}
            </span>
            <Tile slug={slug as string} name={(name as string).toUpperCase()} size={50} />
          </div>
        </Appear>
      ))}
      <Appear at={agents} x={222} y={640} w={268}>
        <div className="flex justify-end gap-6 text-right">
          <div>
            <p className="font-display text-[50px] font-black leading-none" style={{ color: ACP }}>
              {fmt(interpolate(t, [agents, agents + 0.8], [0, 48], clamp))}
            </p>
            <p className="font-mono text-[13px] font-bold uppercase text-muted">agentes</p>
          </div>
          <div style={{ opacity: fade(t, editors - 0.1, 0.2) }}>
            <p className="font-display text-[50px] font-black leading-none text-ink">{fmt(interpolate(t, [editors, editors + 0.6], [0, 21], clamp))}</p>
            <p className="font-mono text-[13px] font-bold uppercase text-muted">editores</p>
          </div>
        </div>
      </Appear>
    </Section>
  );
}

/* ---------- The big editors joined ---------- */

function JetBrainsZed() {
  const t = useT();
  const start = useStageCue("jetbrains", "y");
  const jb = useStageCue("jetbrains", "jetbrains");
  const zed = useStageCue("jetbrains", "zed");
  const october = useStageCue("jetbrains", "octubre");
  const neovim = useStageCue("jetbrains", "neovim");
  const emacs = useStageCue("jetbrains", "emacs");
  const plugins = useStageCue("jetbrains", "plugins");
  return (
    <Section y={Y.jb}>
      {[
        ["jetbrains", "JETBRAINS", 150, 240, 70, jb],
        ["zed", "ZED", 390, 240, 70, zed],
        ["neovim", "NEOVIM", 150, 470, 58, neovim],
        ["gnuemacs", "EMACS", 390, 470, 58, emacs],
      ].map(([slug, name, x, y, size, at]) =>
        t >= start && t < (at as number) ? (
          <At key={`dim-${slug}`} x={x as number} y={y as number} style={{ transform: `translate(-50%, -${(size as number) / 2}px)`, opacity: 0.22 }}>
            <Tile slug={slug as string} name={name as string} size={size as number} />
          </At>
        ) : null,
      )}
      <TileAt at={jb} x={150} y={240} slug="jetbrains" name="JETBRAINS" size={70} color={ACP} />
      <TileAt at={zed} x={390} y={240} slug="zed" name="ZED" size={70} color={ACP} />
      <At x={196} y={266} style={{ opacity: fade(t, zed + 0.2) }}>
        <div className="h-[3px] w-[148px] rounded-full" style={{ background: ACP, boxShadow: `0 0 10px ${ACP}` }} />
      </At>
      <Stamp at={october} x={270} y={360} size={17}>
        Juntos · oct 2025
      </Stamp>
      <TileAt at={neovim} x={150} y={470} slug="neovim" name="NEOVIM" size={58} />
      <TileAt at={emacs} x={390} y={470} slug="gnuemacs" name="EMACS" size={58} />
      <Tag at={plugins} x={92} y={560}>
        CodeCompanion
      </Tag>
      <Tag at={plugins + 0.2} x={330} y={560}>
        agent-shell
      </Tag>
    </Section>
  );
}

function World() {
  return (
    <div className="absolute inset-0 text-ink">
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, #ECEEF3 1.1px, transparent 1.3px)", backgroundSize: "28px 28px" }} />
      <Hall close={false} />
      <Protocol />
      <Mcp />
      <Editor />
      <Acp />
      <Integrations />
      <Session />
      <Real />
      <Adapters />
      <JetBrainsZed />
      <Hall close />
    </div>
  );
}

/* ---------- Over the world: the hook and the question ---------- */

function Hook() {
  return (
    <div className="relative mt-[42px]">
      <h1 className="font-display text-[46px] font-black leading-[1] tracking-tight text-ink">
        Tu agente
        <br />
        necesita <span className="text-accent">dos</span>
      </h1>
    </div>
  );
}

function Close() {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const ask = useCue("cuentame");
  const p = usePop(ask);
  if (t < ask) return null;
  return (
    <div className="relative mt-[42px]" style={{ transform: `scale(${0.85 + 0.15 * p})`, transformOrigin: "0 50%", opacity: Math.min(1, p * 2) }}>
      <p className="inline-block rounded-full bg-accent px-4 py-2 font-mono text-[24px] font-bold uppercase leading-none text-accent-ink">¿Qué agente usarías?</p>
    </div>
  );
}

export default defineVideo({
  captions: "pill",
  chapters: true,
  music: { file: "audio/cama.mp3" },
  stage: { World, width: W, height: H, drift: 0.02 },
  meter: {
    kind: "slots",
    start: 0,
    max: 2,
    steps: [
      { scene: "mcp", word: "model", value: 1 },
      { scene: "acp", word: "agent", value: 2 },
    ],
  },
  avatar: {},
  scenes: [
    { id: "gancho", chapter: "Dos protocolos", camera: shot(Y.hall), Visual: Hook },
    { id: "protocolo", chapter: "Protocolo", camera: shot(Y.proto) },
    { id: "mcp", chapter: "MCP", camera: shot(Y.mcp) },
    { id: "editor", chapter: "El editor", camera: shot(Y.editor) },
    { id: "acp", chapter: "ACP", camera: shot(Y.acp) },
    { id: "integraciones", chapter: "Integraciones", camera: shot(Y.integ) },
    { id: "sesion", chapter: "La sesión", camera: shot(Y.sesion) },
    { id: "real", chapter: "El agente", camera: shot(Y.real) },
    { id: "adaptadores", chapter: "Adaptadores", camera: shot(Y.adapt) },
    { id: "jetbrains", chapter: "Editores", camera: shot(Y.jb) },
    { id: "cierre", chapter: "Resumen", camera: shot(Y.end), Visual: Close },
  ],
});
