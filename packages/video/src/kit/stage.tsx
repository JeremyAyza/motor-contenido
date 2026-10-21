import type { ReactNode } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { animStyle, cx, Icono, Logo } from "../../../carousel/src/ui/index.tsx";

/*
 * The stage kit: interfaces the audience knows (a phone, the browser's address
 * bar, an app card, a chat, a terminal, a diff, a data panel and HUD chips),
 * so what a scene explains happens inside a screen. They are generic, our own
 * design: a brand appears only as its official logo, never as a copy of its
 * app (AGENTS.md, rule 6). Their text is interface (`data-ui`): the inspector
 * leaves it out of the words on screen and lets it go down to 12 px, because
 * the sentence to read is the title or a label, not the screen's chrome.
 *
 * Times (`at`) are seconds from the start of the scene, like useCue's.
 */

type Tone = "ink" | "muted" | "accent" | "good" | "bad";

const TONE_TEXT: Record<Tone, string> = {
  ink: "text-ink",
  muted: "text-muted",
  accent: "text-accent",
  good: "text-[#1A7F37]",
  bad: "text-[#CF222E]",
};

/** Seconds since the start of the scene. */
function useSeconds() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
}

/** How much of a text is typed at a moment: all of it before `at` is undefined. */
function useTyped(text: string, at: number | undefined, seconds = 0.6): string {
  const t = useSeconds();
  if (at === undefined) return text;
  const shown = Math.round(interpolate(t, [at, at + seconds], [0, text.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return text.slice(0, shown);
}

const appear = (at: number | undefined, dur = 0.35) =>
  at === undefined ? {} : { "data-anim": "aparece", style: animStyle({ en: at, dur }) };

/**
 * A phone with its screen, the stage for an app, a notification or a chat.
 * `width` sets the size (the height follows a phone's proportion); `screen`
 * is the color of the screen. The status bar is drawn, without real icons.
 */
export function Phone({
  width = 230,
  screen = "light",
  time = "9:41",
  children,
  className,
}: {
  width?: number;
  screen?: "light" | "dark";
  time?: string;
  children: ReactNode;
  className?: string;
}) {
  const dark = screen === "dark";
  return (
    <div
      data-ui
      className={cx("relative overflow-hidden rounded-[36px] border-[6px] border-[#1B1B1D] shadow-[0_18px_40px_rgba(0,0,0,0.28)]", dark ? "bg-[#0D1117] text-[#E6EDF3]" : "bg-white text-[#16181C]", className)}
      style={{ width, height: Math.round(width * 2.05) }}
    >
      <div className="flex items-center justify-between px-5 pt-3 text-[13px] font-semibold">
        <span>{time}</span>
        <span className="flex items-center gap-1">
          <i className="block h-[7px] w-[3px] rounded-[1px] bg-current" />
          <i className="block h-[9px] w-[3px] rounded-[1px] bg-current" />
          <i className="block h-[11px] w-[3px] rounded-[1px] bg-current" />
          <i className="ml-1 block h-[10px] w-[20px] rounded-[3px] border-[1.5px] border-current" />
        </span>
      </div>
      <div className="absolute left-1/2 top-[8px] h-[20px] w-[70px] -translate-x-1/2 rounded-full bg-[#1B1B1D]" />
      <div className="relative mt-3 px-3">{children}</div>
      <div className={cx("absolute bottom-[8px] left-1/2 h-[4px] w-[84px] -translate-x-1/2 rounded-full", dark ? "bg-white/40" : "bg-black/25")} />
    </div>
  );
}

/** The browser's address bar: the domain says where the scene happens. */
export function BrowserBar({
  domain,
  path,
  right,
  at,
  className,
}: {
  domain: string;
  path?: string;
  /** What goes at the right end, "https" by default. */
  right?: ReactNode;
  at?: number;
  className?: string;
}) {
  return (
    <div data-ui {...appear(at)} className={cx("flex items-center gap-3 rounded-2xl border border-ink/15 bg-surface px-4 py-3", className)}>
      <Icono name="lock" size={20} strokeWidth={2.25} ancla={false} className="text-muted" />
      <span className="min-w-0 truncate text-[21px] font-semibold">
        {domain}
        {path ? <span className="font-mono text-[16px] font-normal text-muted">{path}</span> : null}
      </span>
      <span className="ml-auto font-mono text-[13px] text-muted">{right ?? "https"}</span>
    </div>
  );
}

/**
 * A card for an app or a site: its official logo on a white chip, its domain
 * and a line under it. What the app receives or shows goes in `children`.
 */
export function AppCard({
  logo,
  domain,
  label,
  at,
  children,
  className,
}: {
  /** Simple Icons slug. */
  logo: string;
  domain: string;
  label?: string;
  at?: number;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div data-ui {...appear(at)} className={cx("rounded-2xl border border-ink/12 bg-surface p-4", className)}>
      <div className="flex items-center gap-3">
        <Logo slug={logo} size={34} chip ancla={false} />
        <div className="min-w-0">
          <p className="truncate font-mono text-[19px] font-semibold">{domain}</p>
          {label ? <p className="text-[15px] text-muted">{label}</p> : null}
        </div>
      </div>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

export type ChatMessage = { from: "me" | "them"; text: string; at?: number };

/** A chat: the header with who you talk to, and bubbles that appear when the voice gets to them. */
export function Chat({ title, subtitle, messages, className }: { title: string; subtitle?: string; messages: ChatMessage[]; className?: string }) {
  return (
    <div data-ui className={cx("overflow-hidden rounded-2xl border border-ink/12 bg-surface", className)}>
      <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-3">
        <span className="flex size-[34px] items-center justify-center rounded-full bg-accent text-[15px] font-bold text-accent-ink">{title.charAt(0)}</span>
        <div>
          <p className="text-[16px] font-semibold leading-tight">{title}</p>
          {subtitle ? <p className="text-[13px] text-muted">{subtitle}</p> : null}
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            {...appear(m.at, 0.3)}
            className={cx(
              "max-w-[82%] rounded-2xl px-4 py-2 text-[17px] leading-snug",
              m.from === "me" ? "self-end rounded-br-md bg-accent text-accent-ink" : "self-start rounded-bl-md bg-bg text-ink",
            )}
          >
            {m.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export type TerminalLine = { text: string; kind?: "cmd" | "out" | "ok" | "error"; at?: number };

/**
 * The lines of a capture (useCapture) for a Terminal: each step's command,
 * typed at its time in `at`, and its output after it, one line at a time.
 * `keep` picks the output lines to show (all by default); `kind` colors them.
 */
export function captureLines(
  capture: { steps: Array<{ cmd: string; output: string[] }> },
  at: number[],
  {
    keep = () => true,
    kind = () => "out",
  }: { keep?: (line: string, step: number) => boolean; kind?: (line: string, step: number) => NonNullable<TerminalLine["kind"]> } = {},
): TerminalLine[] {
  return capture.steps.flatMap((step, i) => {
    const start = at[i] ?? at.at(-1) ?? 0;
    const typed = start + Math.min(1.2, 0.04 * step.cmd.length + 0.2);
    const output = step.output.filter((line) => keep(line, i));
    return [
      { text: step.cmd, kind: "cmd" as const, at: start },
      // A tab is up to 8 columns in a terminal; 2 spaces keep the columns in 468 px.
      ...output.map((line, j) => ({ text: line.replace(/\t/g, "  "), kind: kind(line, i), at: typed + 0.1 + j * 0.12 })),
    ];
  });
}

const LINE_COLOR = { cmd: "text-[#E6EDF3]", out: "text-[#8B949E]", ok: "text-[#3FB950]", error: "text-[#F85149]" } as const;

function TypedLine({ line, small, wrap }: { line: TerminalLine; small?: boolean; wrap?: boolean }) {
  const kind = line.kind ?? "out";
  const typed = useTyped(line.text, kind === "cmd" ? line.at : undefined, Math.min(1.2, 0.04 * line.text.length + 0.2));
  const shown = kind === "cmd" ? typed : line.text;
  return (
    <p
      {...(kind === "cmd" ? {} : appear(line.at, 0.25))}
      className={cx("font-mono leading-[1.6]", small ? "text-[15px]" : "text-[18px]", wrap ? "whitespace-pre-wrap" : "whitespace-pre", LINE_COLOR[kind])}
    >
      {kind === "cmd" ? <span className="text-[#8B949E]">$ </span> : null}
      {shown || " "}
    </p>
  );
}

/**
 * A terminal: commands typed when the voice gets to them, and their output.
 * Commands must be real, and their output too (captureLines). `small` and
 * `wrap` fit long lines, like git's hints, in the 468 px of the frame.
 */
export function Terminal({
  title = "terminal",
  lines,
  small = false,
  wrap = false,
  className,
}: {
  title?: string;
  lines: TerminalLine[];
  small?: boolean;
  wrap?: boolean;
  className?: string;
}) {
  return (
    <div data-ui className={cx("overflow-hidden rounded-xl bg-[#0D1117] shadow-[0_14px_32px_rgba(0,0,0,0.25)]", className)}>
      <div className="flex items-center gap-2 bg-white/5 px-4 py-2.5">
        <i className="size-2.5 rounded-full bg-white/20" />
        <i className="size-2.5 rounded-full bg-white/20" />
        <i className="size-2.5 rounded-full bg-white/20" />
        <span className="ml-2 font-mono text-[14px] text-white/55">{title}</span>
      </div>
      <div className="px-5 py-4">
        {lines.map((line, i) => (
          <TypedLine key={i} line={line} small={small} wrap={wrap} />
        ))}
      </div>
    </div>
  );
}

export type DiffLine = { text: string; kind?: "add" | "del" | "ctx"; at?: number };

const DIFF = {
  add: { mark: "+", row: "bg-[#1A7F37]/18 text-[#3FB950]" },
  del: { mark: "-", row: "bg-[#CF222E]/18 text-[#F85149]" },
  ctx: { mark: " ", row: "text-[#C9D1D9]" },
} as const;

/** A diff of one file: removed and added lines, each when the voice gets to it. */
export function Diff({ file, lines, className }: { file: string; lines: DiffLine[]; className?: string }) {
  return (
    <div data-ui className={cx("overflow-hidden rounded-xl bg-[#0D1117]", className)}>
      <p className="border-b border-white/10 px-4 py-2.5 font-mono text-[15px] text-white/60">{file}</p>
      <div className="py-2">
        {lines.map((line, i) => {
          const d = DIFF[line.kind ?? "ctx"];
          return (
            <p key={i} {...appear(line.at, 0.3)} className={cx("whitespace-pre px-4 font-mono text-[16px] leading-[1.8]", d.row)}>
              {d.mark} {line.text}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export type DataRow = { label: string; value: string; tone?: Tone; at?: number };

/** A panel of data: rows of a label and a value, like a system's readout. */
export function DataTable({ title, rows, className }: { title?: string; rows: DataRow[]; className?: string }) {
  return (
    <div data-ui className={cx("rounded-2xl border border-ink/12 bg-surface px-5 py-3", className)}>
      {title ? <p className="pb-2 font-mono text-[14px] uppercase tracking-[0.14em] text-muted">{title}</p> : null}
      {rows.map((row, i) => (
        <div key={i} {...appear(row.at, 0.3)} className={cx("flex items-baseline justify-between gap-4 py-2.5", i > 0 && "border-t border-ink/10")}>
          <span className="text-[19px]">{row.label}</span>
          <span className={cx("font-mono text-[18px] font-semibold", TONE_TEXT[row.tone ?? "accent"])}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

/** A HUD chip: a short label in capitals and mono, like a system's tag. */
export function Chip({
  children,
  dot = false,
  tone = "line",
  at,
  className,
}: {
  children: ReactNode;
  dot?: boolean;
  /** line: a thin border; accent: the accent; solid: ink on the page. */
  tone?: "line" | "accent" | "solid";
  at?: number;
  className?: string;
}) {
  const look = { line: "border border-ink/20 text-ink/80", accent: "border border-accent text-accent", solid: "bg-ink text-bg" }[tone];
  return (
    <span data-ui {...appear(at, 0.3)} className={cx("inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[14px] font-semibold uppercase tracking-[0.14em]", look, className)}>
      {dot ? <i className="block size-[7px] rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}
