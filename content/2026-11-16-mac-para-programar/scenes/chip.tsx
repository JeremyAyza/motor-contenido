import { EASE, lerp, Stamp, unit, useClock, useCue } from "@motor/video";
import { Layer, Row, White, Win } from "../parts.tsx";
import { ACCENT, GREEN, INK, LINE, MUTED } from "../world.tsx";

/** A MacBook Pro, drawn: the open lid with its notch and the base. */
function MacBook() {
  return (
    <svg width={150} height={84} viewBox="0 0 150 84" aria-hidden>
      <rect x="18" y="2" width="114" height="72" rx="6" fill="#2A2D34" stroke="#5A5F6B" strokeWidth="1.5" />
      <rect x="24" y="8" width="102" height="60" rx="2" fill="#11131A" />
      <rect x="66" y="8" width="18" height="4" rx="2" fill="#2A2D34" />
      <path d="M2 74 L148 74 L144 82 Q143 83 141 83 L9 83 Q7 83 6 82 Z" fill="#A9ADB5" />
    </svg>
  );
}

const BLOCKS: Array<{ name: string; word: "cpu" | "graficos" | "aceleradores"; x: number; y: number }> = [
  { name: "CPU", word: "cpu", x: 0, y: 0 },
  { name: "GPU", word: "graficos", x: 1, y: 0 },
  { name: "Neural Engine", word: "aceleradores", x: 0, y: 1 },
  { name: "Media", word: "aceleradores", x: 1, y: 1 },
];

/** Apple Silicon: About This Mac with Rick's M4 Pro, and the four parts that live on one chip. */
export function Chip() {
  const t = useClock();
  const hardware = useCue("hardware");
  const apple = useCue("apple");
  const serie = useCue("serie");
  const m = useCue("m");
  const cues = { cpu: useCue("cpu"), graficos: useCue("graficos"), aceleradores: useCue("aceleradores") };
  const solo = useCue("solo");
  const integrado = useCue("integrado");
  const lit = EASE.out(unit(t, apple, 0.35));
  const join = EASE.inOut(unit(t, solo - 0.1, 0.6));
  const ring = EASE.out(unit(t, solo + 0.35, 0.4));
  return (
    <Layer>
      <Win x={116} y={96} w={388} h={408} at={Math.min(0.05, hardware - 0.2)} bodyStyle={{ padding: "12px 18px" }}>
        <div className="flex flex-col items-center">
          <MacBook />
          <div className="mt-[8px] text-[26px] font-bold" style={{ color: INK }}>MacBook Pro</div>
          <div className="text-[13px]" style={{ color: MUTED }}>14 pulgadas, noviembre de 2024</div>
        </div>
        <div className="mt-[12px]">
          <Row label="Chip" value="Apple M4 Pro" lit={lit} accent={ACCENT} />
          <Row label="Memoria" value="24 GB" accent={ACCENT} />
          <Row label="Disco de arranque" value="Macintosh HD" accent={ACCENT} />
          <Row label="macOS" value="Sequoia 15.4" accent={ACCENT} last />
        </div>
        <div className="mt-[10px] text-[13px] font-semibold" style={{ color: MUTED }}>La serie M</div>
        <div className="mt-[6px] flex gap-[8px]">
          {["M1", "M2", "M3", "M4"].map((name, i) => {
            const on = EASE.out(unit(t, serie + i * 0.12, 0.25));
            const last = i === 3 ? EASE.out(unit(t, m, 0.3)) : 0;
            return (
              <div key={name} className="flex h-[38px] flex-1 items-center justify-center gap-[3px] rounded-[8px]" style={{ background: "#22262E", border: `1.5px solid ${last > 0 ? ACCENT : LINE}`, opacity: 0.35 + 0.65 * on }}>
                <White slug="apple" size={14} />
                <span className="text-[17px] font-bold" style={{ color: INK }}>{name}</span>
              </div>
            );
          })}
        </div>
      </Win>
      <Win x={184} y={518} w={320} h={272} title="Resumen del hardware" at={cues.cpu - 0.35} bodyStyle={{ padding: "12px 16px" }}>
        <div className="relative" style={{ height: 128 }}>
          {BLOCKS.map((b) => {
            const on = EASE.out(unit(t, cues[b.word], 0.3));
            const gap = lerp(14, 4, join);
            const w = (288 - gap) / 2;
            return (
              <div key={b.name} className="absolute flex items-center justify-center rounded-[10px] text-center font-semibold" style={{ left: b.x * (w + gap), top: b.y * (60 + gap), width: w, height: 60, fontSize: b.name.length > 6 ? 17 : 22, color: on > 0.5 ? INK : MUTED, background: on > 0 ? `color-mix(in srgb, ${ACCENT} ${Math.round(on * 30)}%, #22262E)` : "#22262E", border: `1.5px solid ${on > 0.5 ? ACCENT : LINE}` }}>
                {b.name}
              </div>
            );
          })}
          <div className="absolute rounded-[14px]" style={{ left: -6, top: -6, width: 300, height: 140, border: `2.5px solid ${GREEN}`, opacity: ring, transform: `scale(${1.08 - 0.08 * ring})` }} />
        </div>
        <div className="mt-[14px] flex flex-col gap-[4px] font-mono text-[14px]" style={{ color: INK }}>
          {[
            ["CPU", "14 núcleos · 10P + 4E"],
            ["GPU", "20 núcleos"],
            ["Neural Engine", "16 núcleos"],
          ].map(([k, v], i) => (
            <div key={k} className="flex justify-between" style={{ opacity: EASE.out(unit(t, solo + 0.3 + i * 0.25, 0.3)), borderBottom: `1px solid ${LINE}`, paddingBottom: 4 }}>
              <span style={{ color: MUTED }}>{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </Win>
      <Stamp at={integrado - 0.3} x={344} y={520} size={28} rotate={-4} color={GREEN} fill="#0B0D12">
        Un solo chip
      </Stamp>
    </Layer>
  );
}
