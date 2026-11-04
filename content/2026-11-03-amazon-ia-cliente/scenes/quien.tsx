import { Logo } from "@motor/ui";
import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Layer, Sticker } from "../parts.tsx";

/**
 * The note itself, recreated from aboutamazon.com (AGENTS.md, rule 6): its
 * title and its byline, as published. It flies out of the pile and opens.
 */
export function Quien() {
  const t = useClock();
  const p = popAt(t, 0.15);
  const open = EASE.out(unit(t, 0.35, 0.5));
  const name = useCue("Terkowitz");
  const line = EASE.out(unit(t, name, 0.4));
  return (
    <Layer>
      <div
        data-ui=""
        className="absolute rounded-xl border-[3px] border-ink bg-white px-5 pb-5 pt-4 text-ink"
        style={{ left: 46, top: 150, width: 448, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - Math.min(1, p)) * 300}px) rotate(${-6 + 6 * open}deg)`, transformOrigin: "50% 100%" }}
      >
        <div className="mb-3 flex items-center justify-between border-b-2 border-ink/15 pb-2">
          <Logo slug="amazon" size={92} ancla={false} />
          <span className="font-mono text-[13px] text-ink/60">aboutamazon.com</span>
        </div>
        <p className="font-sans text-[22px] font-bold leading-[1.15]">An update from Amazon engineering leadership on the role of the developer in the age of AI</p>
        <p className="mt-3 font-sans text-[15px] leading-snug text-ink/75">
          Written by{" "}
          <span className="relative font-bold text-ink">
            Terk Terkowitz
            <span className="absolute -bottom-1 left-0 h-[4px] rounded bg-accent" style={{ width: `${line * 100}%` }} />
          </span>
          , VP/Distinguished Engineer, Worldwide Amazon Stores
        </p>
      </div>
      <Sticker at={useCue("Engineer")} x={156} y={498} rotate={3} tone="ink" className="whitespace-nowrap text-[30px]">
        VP de Amazon
      </Sticker>
      <Sticker at={useCue("pública")} x={392} y={536} rotate={-5} tone="accent" className="whitespace-nowrap text-[30px]">
        Nota pública
      </Sticker>
    </Layer>
  );
}
