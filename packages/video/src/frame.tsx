import { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { Tone } from "../../carousel/src/ui/index.tsx";
import { captionPages } from "./captions.ts";
import type { CaptionStyle } from "./kit/index.ts";
import { formatMeter, type MeterDef } from "./kit/meter.ts";
import type { WordTiming } from "./timeline.ts";

/*
 * What every video frame carries besides the carousel's <Slide> (tab, dots
 * and signature): the burned-in captions and, if the piece asks for it, the
 * chapter bar. Measures are design px (540×960).
 */

/** The text of the frame on each tone, and the accent that reads on it. */
const FRAME_TONE: Record<Tone, { text: string; fill: string }> = {
  base: { text: "text-ink", fill: "bg-accent" },
  surface: { text: "text-ink", fill: "bg-accent" },
  accent: { text: "text-accent-ink", fill: "bg-accent-ink" },
  invert: { text: "text-bg", fill: "bg-accent" },
};

/**
 * How each caption style marks the word being said, per tone. On base and
 * surface the accent reads (piecePalette checks 4.5:1); on accent and invert
 * it does not, so "highlight" underlines there and "marker" swaps colors.
 */
const SAID: Record<Exclude<CaptionStyle, "pill">, Record<Tone, string>> = {
  highlight: {
    base: "text-accent",
    surface: "text-accent",
    accent: "underline decoration-[3px] underline-offset-[5px]",
    invert: "underline decoration-[3px] underline-offset-[5px]",
  },
  marker: {
    base: "rounded-[5px] bg-accent text-accent-ink",
    surface: "rounded-[5px] bg-accent text-accent-ink",
    accent: "rounded-[5px] bg-accent-ink text-accent",
    invert: "rounded-[5px] bg-accent text-accent-ink",
  },
};

/**
 * Burned-in captions: the script, timed by the voice, a phrase at a time
 * (captions.ts), right above the signature. A page of one line sits in the
 * middle of the two-line box, so pages do not jump. The "pill" style sits on
 * its own surface, so it reads the same on every tone: words already said in
 * ink, the rest dimmed, like the reading of a karaoke.
 */
// top-[812px] and h-[68px] are CAPTIONS_TOP and CAPTIONS_HEIGHT (timeline.ts), inset-x-9 is FRAME_PAD:
// Tailwind needs the literal classes.
export function Captions({ words, tone = "base", style = "highlight" }: { words: WordTiming[]; tone?: Tone; style?: CaptionStyle }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pages = useMemo(() => captionPages(words), [words]);
  const ms = (frame / fps) * 1000;
  let page = null;
  for (const p of pages) if (p.startMs <= ms) page = p;
  if (!page) return null;
  if (style === "pill") {
    return (
      <div data-captions className="absolute inset-x-9 top-[812px] z-20 flex h-[68px] items-center justify-center">
        <p className="rounded-2xl bg-surface px-5 py-1.5 text-center font-sans text-[27px] font-bold leading-[1.25] text-ink shadow-[0_6px_18px_rgba(0,0,0,0.18)] ring-1 ring-ink/10">
          {page.tokens.map((token, i) => (
            <span key={i} className={token.fromMs <= ms ? undefined : "text-ink/35"}>
              {token.text}
            </span>
          ))}
        </p>
      </div>
    );
  }
  const said = SAID[style][tone];
  return (
    <div data-captions className="absolute inset-x-9 top-[812px] z-20 flex h-[68px] items-center justify-center">
      <p className={`text-center font-sans text-[27px] font-bold leading-[1.25] ${FRAME_TONE[tone].text}`}>
        {page.tokens.map((token, i) => {
          const now = token.fromMs <= ms && ms < token.toMs;
          // The marker box wraps the word, not the space before it.
          if (now && style === "marker") {
            const space = token.text.startsWith(" ") ? " " : "";
            return (
              <span key={i}>
                {space}
                <span className={`${said} px-1`}>{token.text.trimStart()}</span>
              </span>
            );
          }
          return (
            <span key={i} className={now ? said : undefined}>
              {token.text}
            </span>
          );
        })}
      </p>
    </div>
  );
}

const two = (n: number) => String(n).padStart(2, "0");

/**
 * The chapter bar, a HUD under the frame's tab: the number of the scene, its
 * chapter name and one segment per scene, the current one filling as it plays.
 * It is part of the frame, like the tab (`data-frame`).
 */
// top-[58px] sits between TAB_BOTTOM and CONTENT_BOX.top (timeline.ts).
export function ChapterBar({
  chapters,
  index,
  frames,
  tone = "base",
}: {
  chapters: Array<string | undefined>;
  index: number;
  /** How many frames the current scene lasts. */
  frames: number;
  tone?: Tone;
}) {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / Math.max(1, frames - 1));
  const colors = FRAME_TONE[tone];
  const label = chapters[index];
  return (
    <div data-frame="capitulos" className={`absolute inset-x-9 top-[58px] z-20 ${colors.text}`}>
      <p className="font-mono text-[13px] font-semibold uppercase leading-none tracking-[0.16em]">
        <span className="opacity-60">
          {two(index + 1)} / {two(chapters.length)}
        </span>
        {label ? <span className="ml-3">{label}</span> : null}
      </p>
      <div className="mt-2.5 flex gap-1.5">
        {chapters.map((_, i) => (
          <div key={i} className="h-[4px] flex-1 overflow-hidden rounded-full bg-current/15">
            <div className={`h-full rounded-full ${colors.fill}`} style={{ width: `${(i < index ? 1 : i === index ? progress : 0) * 100}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * The meter, a HUD at the right of the tab: what is at stake (video.json →
 * meter), on screen the whole video. Like the tab, it is part of the frame
 * (`data-frame`), so the inspector does not count it as text to read.
 */
// top-[10px] centers it on the tab's row (TAB_BOTTOM is 42); right-9 is FRAME_PAD.
export function Meter({ def, label, value, tone = "base" }: { def: MeterDef; label: string; value: number; tone?: Tone }) {
  const colors = FRAME_TONE[tone];
  const kind = def.kind ?? "counter";
  const max = def.max ?? 1;
  return (
    <div data-frame="medidor" className={`absolute right-9 top-[10px] z-20 flex flex-col items-end gap-1 ${colors.text}`}>
      <span className="font-mono text-[11px] font-semibold uppercase leading-none tracking-[0.14em] opacity-70">{label}</span>
      {kind === "slots" ? (
        <span className="flex gap-1">
          {Array.from({ length: max }, (_, i) => (
            <span
              key={i}
              className={`flex h-[18px] w-[18px] items-center justify-center rounded-[4px] font-mono text-[11px] font-bold leading-none ${i < Math.round(value) ? `${colors.fill} text-bg` : "ring-1 ring-current/40"}`}
            >
              {i < Math.round(value) ? i + 1 : "?"}
            </span>
          ))}
        </span>
      ) : kind === "bar" ? (
        <span className="flex items-center gap-2">
          <span className="h-[8px] w-[92px] overflow-hidden rounded-full bg-current/15">
            <span className={`block h-full rounded-full ${colors.fill}`} style={{ width: `${Math.max(0, Math.min(1, value / max)) * 100}%` }} />
          </span>
          <span className="font-mono text-[15px] font-bold tabular-nums leading-none">{formatMeter(value, def)}</span>
        </span>
      ) : (
        <span className="font-mono text-[17px] font-bold tabular-nums leading-none">{formatMeter(value, def)}</span>
      )}
    </div>
  );
}
