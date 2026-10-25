import type { ReactNode } from "react";
import { useClock } from "./scene.ts";
import { Sfx, usePop } from "./sfx.tsx";

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
