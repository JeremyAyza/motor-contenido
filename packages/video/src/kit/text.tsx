import { useContext, type ReactNode } from "react";
import { normalizeWord } from "../../../media/src/words.ts";
import type { TimelineScene } from "../timeline.ts";
import { CUT_MARGIN_MS } from "../timeline.ts";
import { SceneContext, useClock } from "./scene.ts";
import { Sfx, usePop } from "./sfx.tsx";

/** Seconds from the scene's start to when `word` is first said, or null if it is not. */
export function saidAt(scene: Pick<TimelineScene, "words"> | null, word: string): number | null {
  const target = normalizeWord(word);
  const hit = scene?.words.find((w) => normalizeWord(w.text) === target);
  return hit ? hit.startMs / 1000 : null;
}

/**
 * When the highlight of a title lights up: when its word is said, but never
 * later than CUT_MARGIN_MS before the cut, so it is never left halfway.
 */
export function highlightAt(scene: Pick<TimelineScene, "words" | "durationMs">, word: string, fallback: number): number {
  const said = saidAt(scene, word) ?? fallback;
  return Math.max(0, Math.min(said, (scene.durationMs - CUT_MARGIN_MS) / 1000));
}

/**
 * The scene's title, word by word from `at`, with one word (`highlight`)
 * lighting up on an accent box when the voice says it. It takes the piece's
 * display font and accent, so it looks like the piece and not like a
 * template; `size` in design px (42 or more). Only inside a scene's Visual:
 * the highlight is a word of that scene.
 */
export function SaidTitle({ text, highlight, at = 0, size = 52, className }: { text: string; highlight?: string; at?: number; size?: number; className?: string }) {
  const scene = useContext(SceneContext);
  if (!scene) throw new Error("SaidTitle only works inside a video scene");
  const t = useClock();
  if (highlight && !text.split(/\s+/).some((w) => normalizeWord(w) === normalizeWord(highlight))) {
    throw new Error(`SaidTitle: "${highlight}" is not a word of the title "${text}"`);
  }
  if (highlight && saidAt(scene, highlight) === null) {
    throw new Error(`SaidTitle: "${highlight}" is not said in scene "${scene.id}", so it would never light up. Words: ${scene.words.map((w) => w.text).join(" ")}`);
  }
  const words = text.split(/\s+/).filter(Boolean);
  const lit = highlight ? highlightAt(scene, highlight, at + 0.5) : Infinity;
  const box = Math.max(0, Math.min(1, (t - lit) / 0.28));
  return (
    <>
      {highlight ? <Sfx id="blip" at={lit} /> : null}
      <h2
        className={`flex flex-wrap justify-center gap-x-[0.28em] gap-y-1 text-center font-display font-black leading-[1.05] tracking-tight text-ink ${className ?? ""}`}
        style={{ fontSize: Math.max(42, size), textWrap: "balance" }}
      >
        {words.map((word, i) => {
          const p = Math.max(0, Math.min(1, (t - at - (i * 0.45) / words.length) / 0.3));
          const hl = highlight !== undefined && normalizeWord(word) === normalizeWord(highlight);
          return (
            <span key={i} className="relative inline-block" style={{ opacity: p, transform: `translateY(${(1 - (1 - (1 - p) ** 3)) * 20}px)` }}>
              {hl ? <span aria-hidden className="absolute -inset-x-[0.18em] inset-y-[0.04em] -z-10 rounded-[0.22em] bg-accent" style={{ transform: `scaleX(${box})`, transformOrigin: "left center" }} /> : null}
              <span className={hl && box > 0.6 ? "text-accent-ink" : undefined}>{word}</span>
            </span>
          );
        })}
      </h2>
    </>
  );
}

/**
 * The key figure on a card (`value` big, `text` beside it): it pops in when
 * the first word of `value` is said (at "60" for "60 °C"), or at `at`, with a
 * hit. The figure comes from facts.json, like every other one.
 */
export function StatCard({ value, text, at, className }: { value: string; text?: string; at?: number; className?: string }) {
  const scene = useContext(SceneContext);
  const when = at ?? saidAt(scene, value.split(/\s+/)[0]) ?? 0.7;
  const p = usePop(when);
  return (
    <>
      <Sfx id="golpe" at={when} />
      <div
        className={`flex items-center gap-4 self-stretch rounded-3xl bg-surface px-6 py-4 shadow-[0_10px_0_rgba(0,0,0,0.18)] ${className ?? ""}`}
        style={{ transform: `translateY(${(1 - Math.min(1, p)) * 40}px) scale(${0.9 + 0.1 * p})`, opacity: Math.min(1, p * 2) }}
      >
        <span className="whitespace-nowrap font-display text-[64px] font-black leading-none text-accent">{value}</span>
        {text ? <span className="text-[24px] font-bold leading-tight text-ink">{text}</span> : null}
      </div>
    </>
  );
}

/**
 * The idea of the moment in a pill ("ENTRADA + TODO LO QUE MANDAS"), as in
 * Rick's Reels: it pops in at `at` with a blip and leaves at `until`. Times
 * are on the clock of where it is (useCue in a scene, useStageCue in the world).
 */
export function Banner({ at, until, tone = "light", children, className }: { at: number; until?: number; tone?: "light" | "accent" | "dark"; children: ReactNode; className?: string }) {
  const t = useClock();
  const p = usePop(at);
  if (t < at || (until !== undefined && t > until + 0.25)) return null;
  const out = until === undefined ? 0 : Math.max(0, Math.min(1, (t - until) / 0.25));
  const tones = {
    light: "bg-[#F2F0EA] text-[#16181D]",
    accent: "bg-accent text-accent-ink",
    dark: "bg-[#0E1015] text-ink ring-1 ring-white/15",
  };
  return (
    <>
      <Sfx id="blip" at={at} />
      <p
        className={`self-center whitespace-nowrap rounded-full px-4 py-1.5 text-center font-mono text-[22px] font-bold uppercase leading-none shadow-[0_8px_20px_rgba(0,0,0,0.35)] ${tones[tone]} ${className ?? ""}`}
        style={{ transform: `scale(${p * (1 - out)})`, opacity: Math.min(1, p * 2) * (1 - out) }}
      >
        {children}
      </p>
    </>
  );
}

/**
 * A big title in a pill (¿PAGAS ESTA APP?, 2 · MONTA): the words of the
 * scene when a video goes without captions. It pops in at `at` with a pop;
 * `tone` "accent" by default, "light" or "dark".
 */
export function PillTitle({ at = 0, tone = "accent", children, className }: { at?: number; tone?: "accent" | "light" | "dark"; children: ReactNode; className?: string }) {
  const p = usePop(at);
  const tones = {
    accent: "bg-accent text-accent-ink",
    light: "bg-[#F2F0EA] text-[#16181D]",
    dark: "bg-[#0E1015] text-[#F2F0EA] ring-1 ring-white/15",
  };
  return (
    <>
      <Sfx id="pop" at={at} />
      <h2
        className={`self-center whitespace-nowrap rounded-2xl px-5 py-2 text-center font-display text-[46px] font-black uppercase leading-none tracking-tight shadow-[0_10px_26px_rgba(0,0,0,0.35)] ${tones[tone]} ${className ?? ""}`}
        style={{ transform: `scale(${p}) rotate(${(1 - p) * -4}deg)`, opacity: Math.min(1, p * 2) }}
      >
        {children}
      </h2>
    </>
  );
}
