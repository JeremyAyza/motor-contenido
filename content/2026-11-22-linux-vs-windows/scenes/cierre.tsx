import { EASE, keys, unit, useClock, useCue } from "@motor/video";
import { Gesto } from "@motor/ui";
import { ACCENT, INK, MUTED, TUX, WIN } from "../world.tsx";
import { Big, Card, Hi, Layer, Note, Rise, SIDE, SideMark, Strike } from "../parts.tsx";

/**
 * The close: "Windows BUENO vs Linux MALO" with both words struck. Then the
 * real question: two cards, "decida por ti" (blue) and "te deje decidir"
 * (orange), that light by turns while the dial's dot travels; on "Comenta"
 * they turn into the two buttons of the CTA, and a hand taps the comment.
 */
export function Cierre() {
  const t = useClock();
  const bueno = useCue("bueno");
  const malo = useCue("malo.");
  // "no es bueno" says "es" first: the line is the second one.
  const es = useCue("Es", 2);
  const quieres = useCue("¿quieres");
  const ti = useCue("ti,");
  const decidir = useCue("decidir");
  const comenta = useCue("Comenta");
  const eliges = useCue("eliges:");
  const winLit = EASE.out(unit(t, ti - 0.35, 0.25)) * (1 - EASE.out(unit(t, decidir - 0.2, 0.25)));
  const tuxLit = EASE.out(unit(t, decidir - 0.2, 0.25)) * (1 - EASE.out(unit(t, comenta - 0.1, 0.25)));
  const cta = EASE.out(unit(t, comenta - 0.1, 0.35));
  const tap = keys(t, [[eliges, 0], [eliges + 0.35, 1], [eliges + 0.55, 0.85], [eliges + 0.8, 1]]);
  return (
    <Layer>
      <Rise x={36} y={220} w={468} h={250} at={0} until={es - 0.15} dy={8}>
        <Card border="#2A3441">
          <div className="flex h-full items-center justify-around px-[10px]">
            <Verdict side="win" word="bueno" at={bueno} />
            <span className="font-mono text-[24px] font-bold" style={{ color: MUTED }}>vs</span>
            <Verdict side="tux" word="malo" at={malo} />
          </div>
        </Card>
      </Rise>
      <Big x={270} y={500} w={468} size={34} at={malo + 0.15} until={es - 0.15} align="center">
        Dos respuestas a dos <Hi color={ACCENT}>preguntas distintas.</Hi>
      </Big>
      <Note x={270} y={212} at={quieres - 0.1} size={20} color={INK}>¿Quieres que el sistema…</Note>
      <Rise x={56} y={256} w={428} h={110} at={quieres}>
        <Choice color={WIN} lit={Math.max(winLit, cta)} text={cta > 0.5 ? "Comenta WINDOWS" : "decida por ti"} cta={cta} />
      </Rise>
      <Rise x={56} y={384} w={428} h={110} at={quieres + 0.15}>
        <Choice color={TUX} lit={Math.max(tuxLit, cta)} text={cta > 0.5 ? "Comenta LINUX" : "te deje decidir"} cta={cta} />
      </Rise>
      <Big x={SIDE.x} y={SIDE.y + 10} w={SIDE.w} size={50} at={es - 0.05}>
        Es <Hi color={ACCENT}>esto.</Hi>
      </Big>
      {t >= eliges - 0.1 ? (
        <div className="absolute" style={{ left: 428, top: 452, color: ACCENT, opacity: EASE.out(unit(t, eliges - 0.1, 0.2)), transform: `scale(${0.85 + 0.15 * tap})` }}>
          <Gesto accion="comentar" size={58} lleno />
        </div>
      ) : null}
      <Note x={SIDE.x + SIDE.w / 2} y={SIDE.y + 80} w={SIDE.w} at={comenta} size={14} color={ACCENT}>
        y defiende tu bando
      </Note>
    </Layer>
  );
}

function Verdict({ side, word, at }: { side: "win" | "tux"; word: string; at: number }) {
  return (
    <div className="flex flex-col items-center gap-[10px]">
      <SideMark side={side} size={80} />
      <span className="relative rounded-[4px] px-[10px] py-[4px] font-mono text-[22px] font-bold uppercase tracking-[0.16em]" style={{ color: side === "win" ? "#3CCB7F" : "#E0574F", border: "1.5px solid currentColor" }}>
        {word}
        <Strike at={at} color={INK} width={3} />
      </span>
    </div>
  );
}

function Choice({ color, lit, text, cta }: { color: string; lit: number; text: string; cta: number }) {
  return (
    <div
      data-ui=""
      className="absolute inset-0 flex items-center justify-center rounded-[10px]"
      style={{ background: `rgba(${color === WIN ? "59,142,234" : "240,138,60"},${0.08 + 0.22 * lit})`, border: `2px solid ${lit > 0.5 ? color : "#2A3441"}`, boxShadow: cta > 0.5 ? `0 0 24px ${color}55` : "none" }}
    >
      <span className="font-display text-[30px] font-black" style={{ color: lit > 0.5 ? INK : MUTED }}>
        {text}
      </span>
    </div>
  );
}
