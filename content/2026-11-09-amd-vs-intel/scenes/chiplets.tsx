import { DrawPath, EASE, keys, popAt, unit, useClock, useCue } from "@motor/video";
import { BigWord, Cpu, Footnote, Layer, Mono } from "../parts.tsx";
import { AMD, MUTED } from "../world.tsx";

const LINKS: Array<{ x: number; label: string; d: string }> = [
  { x: 120, label: "DDR5", d: "M 250 540 C 250 600, 120 590, 120 650" },
  { x: 270, label: "PCIe 5.0", d: "M 270 540 L 270 650" },
  { x: 420, label: "USB", d: "M 290 540 C 290 600, 420 590, 420 650" },
];

/** AMD's way: the lid comes off, two compute chiplets and an I/O die on one board. */
export function Chiplets() {
  const t = useClock();
  const chiplets = useCue("chiplets");
  const piezas = useCue("piezas");
  const ryzen = useCue("Ryzen");
  const uno = useCue("uno");
  const dos = useCue("dos");
  const nucleos = useCue("núcleos");
  const memoria = useCue("memoria");
  const lid = 1 - EASE.inOut(unit(t, piezas - 0.1, 0.6));
  const tilt = keys(t, [[piezas, -8], [ryzen, 0]]);
  const s = keys(t, [[0, 1.35], [ryzen, 1.6]]);
  const ccd0 = EASE.out(unit(t, uno, 0.3));
  const ccd1 = EASE.out(unit(t, dos, 0.3));
  const io = EASE.out(unit(t, memoria - 0.15, 0.3));
  const labels = EASE.out(unit(t, ryzen, 0.3));
  return (
    <Layer>
      <BigWord y={140} size={66} color="#F0606B" on={EASE.out(unit(t, chiplets - 0.15, 0.5))}>
        CHIPLETS
      </BigWord>
      <Mono x={36} y={222} size={16} color={AMD} style={{ opacity: EASE.out(unit(t, nucleos, 0.3)) }}>
        16 NÚCLEOS EN 2 CHIPLETS
      </Mono>
      <Cpu brand="amd" x={270} y={440} s={s} tilt={tilt} lid={lid} lit={{ ccd0, ccd1, io }} outline={AMD} />
      <Mono x={225} y={396} center width={70} size={17} color="#FFFFFF" style={{ opacity: labels }}>
        CCD 0
      </Mono>
      <Mono x={315} y={396} center width={70} size={17} color="#FFFFFF" style={{ opacity: labels }}>
        CCD 1
      </Mono>
      <Mono x={270} y={500} center width={80} size={17} color="#FFFFFF" style={{ opacity: labels }}>
        E/S
      </Mono>
      <svg className="absolute" width={540} height={960} style={{ left: 0, top: 0 }} aria-hidden>
        {LINKS.map((l, i) => (
          <DrawPath key={l.label} d={l.d} at={memoria + i * 0.12} dur={0.45} stroke={MUTED} strokeWidth={2} strokeDasharray="6 5" />
        ))}
      </svg>
      {LINKS.map((l, i) => {
        const p = popAt(t, memoria + 0.3 + i * 0.12);
        return (
          <div key={l.label} data-ui="" className="absolute rounded-[8px] px-3 py-1 font-mono text-[16px] font-bold" style={{ left: l.x - 55, top: 652, width: 110, textAlign: "center", color: "#F4F6FA", background: "#0D1117", border: "1px solid #1C2330", opacity: Math.min(1, p * 2), transform: `scale(${0.8 + 0.2 * Math.min(1, p)})` }}>
            {l.label}
          </div>
        );
      })}
      <Footnote y={730}>Ryzen 9 9950X · esquema simplificado</Footnote>
    </Layer>
  );
}
