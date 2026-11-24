import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Gesto } from "@motor/ui";
import { Chip, GlowTitle, Invader, Layer, LogoTile, Term, useOn } from "../parts.tsx";
import { G, INK, MODEL } from "../world.tsx";

/** A pixel heart between the model and Tux. */
function Heart({ x, y, beat, dim }: { x: number; y: number; beat: number; dim: number }) {
  const rows = [".XX.XX.", "XXXXXXX", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."];
  const px = 9;
  return (
    <svg className="absolute" style={{ left: x - 31, top: y - 27, transform: `scale(${1 + 0.12 * beat})`, opacity: 1 - 0.75 * dim }} width={63} height={54} aria-hidden>
      {rows.flatMap((row, r) => [...row].map((c, k) => (c === "X" ? <rect key={`${r}-${k}`} x={k * px} y={r * px} width={px} height={px} fill={MODEL} /> : null)))}
    </svg>
  );
}

/**
 * The close: the invader, a beating pixel heart and Tux; the heart dims on
 * "aman" (they don't love it), a thirty-year line joins LINUX · 1991 and
 * AGENTES · 2020s, TEXTO ENTRA, TEXTO SALE lights up, the terminal reads
 * necesita.txt line by line with the voice, and the last prompt asks the CTA
 * as a yes/no command with the comment gesture beside it.
 */
export function Cierre() {
  const t = useClock();
  const aman = useCue("aman");
  const ia = useCue("IA");
  const necesitan = useCue("necesitan");
  const accion = useCue("acción");
  const resultado = useCue("resultado");
  const error = useCue("error");
  const comenta = useCue("Comenta");
  const mouse = useCue("mouse");
  const dim = EASE.out(unit(t, aman, 0.4));
  const beat = Math.max(0, Math.sin(t * 7)) * (1 - dim);
  const line = EASE.out(unit(t, ia, 0.6));
  const top = 1 - useOn(comenta - 0.2, 0.3);
  const cta = useOn(comenta, 0.3);
  return (
    <Layer>
      {top > 0 ? (
        <div className="absolute inset-0" style={{ opacity: top }}>
          <Invader x={130} y={150} px={7} />
          <Heart x={270} y={150} beat={beat} dim={dim} />
          <LogoTile slug="tux" x={410} y={150} at={0} size={80} />
          <svg className="absolute left-0 top-0" width={540} height={960} aria-hidden>
            <line x1={150} y1={238} x2={150 + 240 * line} y2={238} stroke={G} strokeWidth={2} strokeDasharray="4 4" />
          </svg>
          <Chip x={110} y={238} at={ia - 0.2} size={13}>Linux · 1991</Chip>
          <Chip x={430} y={238} at={ia + 0.4} size={13} color={MODEL}>Agentes · 2020s</Chip>
          <Chip x={270} y={268} at={ia + 0.6} size={12}>≈ 30 años</Chip>
          <GlowTitle text="Texto entra, texto sale." y={320} size={38} at={necesitan} />
        </div>
      ) : null}
      {cta > 0 ? (
        <div className="absolute rounded-[10px] px-[18px] py-[16px] font-mono" style={{ left: 36, top: 120, width: 468, opacity: cta, transform: `translateY(${(1 - cta) * 20}px)`, background: "rgba(4,16,10,0.95)", border: "2px solid var(--piece-accent)", boxShadow: "0 0 24px rgba(139,133,255,0.5)" }}>
          <div data-ui="" className="text-[16px] font-bold" style={{ color: G }}>agent@linux:~$</div>
          <div className="mt-[8px] text-[38px] font-bold leading-[1.15]" style={{ color: INK }}>
            ¿Jubilamos al <span style={{ color: "var(--piece-accent)" }}>mouse</span>?
          </div>
          <div className="mt-[10px] text-[34px] font-bold" style={{ color: G }}>
            [s/n] {Math.floor(t * 2.5) % 2 === 0 ? <span style={{ background: G }}>&nbsp;</span> : null}
          </div>
        </div>
      ) : null}
      {cta > 0 ? (
        <div className="absolute flex items-center gap-[14px]" style={{ left: 80, top: 400, opacity: EASE.out(unit(t, mouse, 0.3)), transform: `scale(${0.8 + 0.2 * Math.min(1, popAt(t, mouse))})`, transformOrigin: "left center" }}>
          <span style={{ color: "var(--piece-accent)" }}>
            <Gesto accion="comentar" size={64} lleno={t >= mouse + 0.6} strokeWidth={2.2} />
          </span>
          <span className="font-mono text-[30px] font-bold uppercase" style={{ color: INK }}>Comenta sí o no</span>
        </div>
      ) : null}
      <Term
        x={210}
        y={572}
        w={294}
        h={160}
        at={necesitan - 0.2}
        size={13}
        note={null}
        lines={[
          { at: necesitan, cmd: "cat necesita.txt" },
          { at: accion, out: "cada acción  → un comando", color: INK },
          { at: resultado, out: "cada resultado → texto", color: INK },
          { at: error, out: "cada error → se corrige", color: INK, mark: "✓" },
        ]}
      />
    </Layer>
  );
}
