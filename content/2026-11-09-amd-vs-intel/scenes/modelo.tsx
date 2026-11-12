import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Cpu, Layer, Mono } from "../parts.tsx";
import { AMD, INK, INTEL, MUTED } from "../world.tsx";

function Bet({ x, side, title, line, at, lit }: { x: number; side: string; title: string; line: string; at: number; lit: number }) {
  const t = useClock();
  const p = popAt(t, at);
  return (
    <Card x={x} y={430} w={228} h={210} active={lit > 0.5 ? side : undefined} style={{ opacity: t < at ? 0.3 : 0.3 + 0.7 * Math.min(1, p * 2), transform: `scale(${0.92 + 0.08 * Math.min(1, p)})` }}>
      <Mono x={16} y={16} size={14} color={side}>
        {title}
      </Mono>
      <div className="absolute font-display text-[34px] font-bold leading-[1.05]" style={{ left: 16, top: 52, width: 200, color: lit > 0.5 ? INK : MUTED }}>
        {line}
      </div>
    </Card>
  );
}

/** The mental model: same language in the middle, one bet per side. */
export function Modelo() {
  const t = useClock();
  const idioma = useCue("idioma");
  const amd = useCue("AMD");
  const chiplets = useCue("chiplets");
  const intel = useCue("Intel");
  const mezclar = useCue("mezclar");
  const x86 = EASE.out(unit(t, idioma - 0.2, 0.4));
  return (
    <Layer>
      <Cpu brand="amd" x={250} y={300} s={0.62} lid={0} lit={{ ccd0: 1, ccd1: 1, io: 0.6 }} outline={AMD} />
      <div className="absolute font-display text-[34px] font-black" style={{ left: 315, top: 280, width: 70, textAlign: "center", color: INK, opacity: 0.25 + 0.75 * x86 }}>
        x86
      </div>
      <Cpu brand="intel" x={450} y={300} s={0.62} lid={0} lit={{ compute: 1, graphics: 1, soc: 1, io: 1 }} outline={INTEL} />
      <Bet x={36} side={AMD} title="LA APUESTA DE AMD" line="Chiplets + caché" at={amd - 0.15} lit={EASE.out(unit(t, chiplets, 0.3))} />
      <Bet x={276} side={INTEL} title="LA APUESTA DE INTEL" line="Núcleos mixtos" at={intel - 0.15} lit={EASE.out(unit(t, mezclar, 0.3))} />
    </Layer>
  );
}
