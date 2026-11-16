import { Logo } from "@motor/ui";
import { EASE, Stamp, unit, useClock, useCue } from "@motor/video";
import { Check, Layer, PopIn, White, Win } from "../parts.tsx";
import { ACCENT, GREEN, INK, LINE, MUTED, WIN } from "../world.tsx";

const KW = "#FF7AB2";
const TYPE = "#5DD8FF";
const STR = "#FC6A5D";

/** Rick's SwiftUI view, with the account's name. */
const CODE: Array<Array<[string, string]>> = [
  [["import ", KW], ["SwiftUI", INK]],
  [["", INK]],
  [["struct ", KW], ["ContentView", TYPE], [": ", INK], ["View", TYPE], [" {", INK]],
  [["  var ", KW], ["body", INK], [": ", INK], ["some ", KW], ["View", TYPE], [" {", INK]],
  [["    Text", TYPE], ["(", INK], ['"Hello, Jeremy!"', STR], [")", INK]],
  [["      .font", INK], ["(.largeTitle)", MUTED]],
  [["  }", INK]],
  [["}", INK]],
];

const PLATFORMS: Array<{ name: string; word: "ios" | "macos" | "plataformas"; delay: number }> = [
  { name: "iOS", word: "ios", delay: 0 },
  { name: "macOS", word: "macos", delay: 0 },
  { name: "watchOS", word: "plataformas", delay: 0 },
  { name: "tvOS", word: "plataformas", delay: 0.18 },
  { name: "visionOS", word: "plataformas", delay: 0.36 },
];

/** The Apple ecosystem: Xcode only runs on macOS, and so does almost all native work for Apple's platforms. */
export function Xcode() {
  const t = useClock();
  const ecosistema = useCue("ecosistema");
  const iphone = useCue("iphone");
  const xcode = useCue("xcode");
  const solo = useCue("solo");
  const nativo = useCue("nativo");
  const cues = { ios: useCue("ios"), macos: useCue("macos", 2), plataformas: useCue("plataformas") };
  const programas = useCue("programas");
  const obligatoria = useCue("obligatoria");
  const run = EASE.out(unit(t, iphone + 0.3, 0.3));
  return (
    <Layer>
      <Win x={116} y={96} w={388} h={250} title="HelloJeremy — ContentView.swift" at={0.05} bodyStyle={{ padding: "12px 16px" }}>
        <div className="font-mono text-[15px] leading-[1.6]">
          {CODE.map((line, i) => (
            <div key={i} className="whitespace-pre" style={{ opacity: EASE.out(unit(t, 0.15 + (ecosistema + 0.3) * (i / CODE.length) + i * 0.1, 0.2)) }}>
              {line.map(([text, color], j) => (
                <span key={j} style={{ color }}>{text}</span>
              ))}
            </div>
          ))}
        </div>
      </Win>
      <Win x={116} y={96} w={388} h={266} title="Nuevo proyecto · Elige una plantilla" at={nativo - 0.35} bodyStyle={{ padding: "6px 16px" }}>
        {PLATFORMS.map((p) => {
          const on = EASE.out(unit(t, cues[p.word] + p.delay, 0.25));
          return (
            <div key={p.name} className="mt-[5px] flex items-center justify-between rounded-[8px] px-[12px] py-[4px]" style={{ border: `1.5px solid ${on > 0.5 ? ACCENT : LINE}`, background: on > 0.5 ? `color-mix(in srgb, ${ACCENT} 16%, transparent)` : "transparent" }}>
              <span className="text-[18px] font-semibold" style={{ color: on > 0.5 ? INK : MUTED }}>{p.name}</span>
              <Check p={on} size={22} color={ACCENT} />
            </div>
          );
        })}
      </Win>
      <PopIn x={184} y={378} at={xcode - 0.1} origin="50% 0%">
        <div data-ui="" className="flex flex-col rounded-[14px] px-[16px] py-[14px]" style={{ width: 180, height: 290, background: WIN, border: `1px solid ${LINE}` }}>
          <Logo slug="xcode" size={56} ancla={false} />
          <div className="mt-[10px] text-[24px] font-bold leading-none" style={{ color: INK }}>Xcode</div>
          <div className="mt-[4px] text-[13px]" style={{ color: MUTED }}>App Store · Apple</div>
          <div className="mt-[16px] text-[12px] font-semibold" style={{ color: MUTED }}>Compatibilidad</div>
          <div className="mt-[4px] text-[15px] leading-snug" style={{ color: INK }}>Requiere macOS 14.5 o posterior</div>
          <div className="mt-auto flex items-center gap-[6px] self-start rounded-[8px] px-[10px] py-[4px]" style={{ background: ACCENT, opacity: EASE.out(unit(t, solo, 0.25)), transform: `scale(${0.8 + 0.2 * EASE.out(unit(t, solo, 0.3))})` }}>
            <div style={{ filter: "brightness(0)" }}>
              <Logo slug="apple" size={14} ancla={false} />
            </div>
            <span className="text-[16px] font-bold" style={{ color: "#0B0D12" }}>Solo Mac</span>
          </div>
        </div>
      </PopIn>
      <PopIn x={378} y={378} at={iphone - 0.15} origin="50% 100%">
        <div className="relative rounded-[24px] p-[6px]" style={{ width: 126, height: 290, background: "#05060A", border: "2px solid #3A3F4B" }}>
          <div className="flex h-full flex-col items-center justify-center rounded-[19px]" style={{ background: "#F5F5F7" }}>
            <div className="absolute top-[12px] h-[12px] w-[40px] rounded-full" style={{ background: "#05060A" }} />
            <span data-ui="" className="px-[6px] text-center text-[17px] font-bold leading-tight" style={{ color: "#111" }}>Hello, Jeremy!</span>
            <span data-ui="" className="mt-[14px] rounded-full px-[14px] py-[4px] text-[13px] font-semibold" style={{ background: run > 0.5 ? "#0A84FF" : "#C7C7CC", color: "#FFF" }}>Run</span>
          </div>
        </div>
      </PopIn>
      <PopIn x={184} y={684} at={programas - 0.2} origin="50% 50%">
        <div data-ui="" className="flex items-center gap-[12px] rounded-[14px] px-[16px]" style={{ width: 320, height: 92, background: `color-mix(in srgb, ${GREEN} 10%, ${WIN})`, border: `1px solid ${LINE}` }}>
          <White slug="apple" size={34} />
          <span className="flex-1 text-[18px] font-semibold leading-tight" style={{ color: INK }}>Programar para Apple</span>
          <span className="text-[22px] font-bold" style={{ color: MUTED }}>→</span>
          <span className="text-[26px] font-black" style={{ color: INK }}>Mac</span>
        </div>
      </PopIn>
      <Stamp at={obligatoria} x={420} y={600} size={28} rotate={-5} color={ACCENT} fill="#0B0D12">
        Requisito
      </Stamp>
    </Layer>
  );
}
