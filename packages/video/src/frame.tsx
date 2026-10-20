import { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { Tone } from "../../carousel/src/ui/index.tsx";
import { captionPages } from "./captions.ts";
import type { WordTiming } from "./timeline.ts";

/*
 * What every video frame carries besides the carousel's <Slide> (tab, dots
 * and signature): the burned-in captions. Measures are design px (540×960).
 */

/**
 * The text of the captions on each tone, and how the word being said stands
 * out. On base and surface it takes the accent (piecePalette checks 4.5:1);
 * on accent and invert the accent does not read, so it is underlined.
 */
const CAPTION_TONE: Record<Tone, { text: string; said: string }> = {
  base: { text: "text-ink", said: "text-accent" },
  surface: { text: "text-ink", said: "text-accent" },
  accent: { text: "text-accent-ink", said: "underline decoration-[3px] underline-offset-[5px]" },
  invert: { text: "text-bg", said: "underline decoration-[3px] underline-offset-[5px]" },
};

/**
 * Burned-in captions: the script, timed by the voice, a phrase at a time
 * (captions.ts), right above the signature. A page of one line sits in the
 * middle of the two-line box, so pages do not jump.
 */
// top-[812px] and h-[68px] are CAPTIONS_TOP and CAPTIONS_HEIGHT (timeline.ts), inset-x-9 is FRAME_PAD:
// Tailwind needs the literal classes.
export function Captions({ words, tone = "base" }: { words: WordTiming[]; tone?: Tone }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pages = useMemo(() => captionPages(words), [words]);
  const ms = (frame / fps) * 1000;
  let page = null;
  for (const p of pages) if (p.startMs <= ms) page = p;
  if (!page) return null;
  const colors = CAPTION_TONE[tone];
  return (
    <div data-captions className="absolute inset-x-9 top-[812px] z-20 flex h-[68px] items-center justify-center">
      <p className={`text-center font-sans text-[27px] font-bold leading-[1.25] ${colors.text}`}>
        {page.tokens.map((token, i) => (
          <span key={i} className={token.fromMs <= ms && ms < token.toMs ? colors.said : undefined}>
            {token.text}
          </span>
        ))}
      </p>
    </div>
  );
}
