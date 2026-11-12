import { EASE, popAt, unit, useClock, useCue, wobble } from "@motor/video";
import { Cpu, Glow, Layer, Mono } from "../parts.tsx";
import { AMD, DIM, INK, INTEL, MUTED } from "../world.tsx";

const WORDS = ["El", "mejor", "chip:", "el", "de", "tu", "trabajo"];

/** Back to the hook's diagonal, now with the verdict written between the two chips. */
export function Moraleja() {
  const t = useClock();
  const mejor = useCue("mejor");
  const hecho = useCue("hecho");
  const a = popAt(t, 0.05);
  const b = popAt(t, 0.2);
  const wa = wobble(t, "amd-end", 3);
  const wi = wobble(t, "intel-end", 3);
  return (
    <Layer>
      <Glow brand="amd" x={160} y={310} r={170} opacity={Math.min(1, a)} />
      <Glow brand="intel" x={380} y={520} r={170} opacity={Math.min(1, b)} />
      <Cpu brand="amd" x={160 + wa.x} y={300 + wa.y} s={0.95 * Math.min(1, a)} tilt={-10} />
      <Mono x={160} y={410} center width={240} size={15} color={AMD} style={{ opacity: Math.min(1, a) }}>
        CHIPLETS + CACHÉ
      </Mono>
      <div className="absolute rounded-[8px] px-3 py-1 font-display text-[28px] font-black" style={{ left: 140, top: 458, color: MUTED, border: `1.5px dashed ${DIM}` }}>
        x86
      </div>
      <Cpu brand="intel" x={380 + wi.x} y={520 + wi.y} s={0.95 * Math.min(1, b)} tilt={8} />
      <Mono x={350} y={630} center width={300} size={15} color={INTEL} style={{ opacity: Math.min(1, b) }}>
        NÚCLEOS GRANDES + CHICOS
      </Mono>
      <div className="absolute flex flex-wrap justify-center gap-x-[10px] font-display text-[38px] font-semibold leading-[1.1]" style={{ left: 36, top: 680, width: 468 }}>
        {WORDS.map((w, i) => {
          const at = i < 3 ? mejor - 0.1 + i * 0.12 : hecho + (i - 3) * 0.12;
          const on = EASE.out(unit(t, at, 0.3));
          return (
            <span key={i} style={{ color: on > 0 ? `color-mix(in srgb, ${INK} ${Math.round(on * 100)}%, #3A4256)` : "#3A4256" }}>
              {w}
            </span>
          );
        })}
      </div>
    </Layer>
  );
}
