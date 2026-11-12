import { DrawPath, EASE, fade, unit, useClock, useCue } from "@motor/video";
import { Card, Layer, Mark, Mono, Title } from "../parts.tsx";
import { ACCENT, DIM, INK, MUTED } from "../world.tsx";

const WORDS: Array<{ op: string; say: string; meaning: string }> = [
  { op: "ADD", say: "sumar", meaning: "suma dos valores" },
  { op: "MOV", say: "mover", meaning: "copia un dato" },
  { op: "CMP", say: "comparar", meaning: "compara dos valores" },
  { op: "JMP", say: "saltar", meaning: "salta a otra línea" },
  { op: "CALL", say: "saltar", meaning: "llama a una función" },
  { op: "RET", say: "saltar", meaning: "vuelve de ella" },
];

/** What they share: both speak x86, the same short vocabulary of orders. */
export function X86() {
  const t = useClock();
  const hablan = useCue("hablan");
  const vocab = useCue("vocabulario");
  const cues: Record<string, number> = { sumar: useCue("sumar"), mover: useCue("mover"), comparar: useCue("comparar"), saltar: useCue("saltar") };
  const x86 = EASE.out(unit(t, hablan + 0.25, 0.5));
  const card = EASE.out(unit(t, vocab - 0.2, 0.4));
  return (
    <Layer>
      <Title>Lo que comparten</Title>
      <Mark brand="amd" size={110} x={196} y={196} />
      <Mark brand="intel" size={90} x={404} y={190} />
      <svg className="absolute" width={540} height={960} style={{ left: 0, top: 0 }} aria-hidden>
        <DrawPath d="M 312 222 L 398 222" at={0.2} dur={0.5} stroke={MUTED} strokeWidth={2} strokeDasharray="5 5" />
      </svg>
      <div className="absolute font-display font-black leading-none tracking-tight" style={{ left: 196, top: 262, width: 308, textAlign: "center", fontSize: 128, color: x86 > 0 ? `color-mix(in srgb, ${INK} ${Math.round(x86 * 100)}%, #24272E)` : "#24272E", transform: `scale(${1 + 0.06 * x86 * (1 - fade(t, hablan + 0.8, 0.4))})` }}>
        x86
      </div>
      <Card x={196} y={420} w={308} style={{ opacity: card, transform: `translateY(${(1 - card) * 24}px)` }}>
        <div className="flex items-center justify-between px-4 pb-1 pt-3">
          <span className="font-sans text-[22px] font-semibold" style={{ color: INK }}>
            El vocabulario
          </span>
          <span className="font-mono text-[14px] font-bold" style={{ color: MUTED }}>
            x86
          </span>
        </div>
        {WORDS.map((w, i) => {
          const at = cues[w.say] + (w.op === "CALL" ? 0.25 : w.op === "RET" ? 0.45 : 0);
          const on = EASE.out(unit(t, at, 0.25));
          return (
            <div key={w.op} className="flex items-center gap-3 px-4 py-[6px]" style={{ borderTop: i === 0 ? "none" : "1px solid #161B24" }}>
              <span className="w-[62px] font-mono text-[20px] font-bold" style={{ color: on > 0 ? `color-mix(in srgb, ${ACCENT} ${Math.round(on * 100)}%, ${DIM})` : DIM }}>
                {w.op}
              </span>
              <span className="font-sans text-[15px]" style={{ color: on > 0 ? `color-mix(in srgb, ${INK} ${Math.round(on * 100)}%, ${DIM})` : DIM }}>
                {w.meaning}
              </span>
            </div>
          );
        })}
      </Card>
      <Mono x={196} y={398} size={13} color={DIM} bold={false}>
        EL MISMO JUEGO DE INSTRUCCIONES
      </Mono>
    </Layer>
  );
}
