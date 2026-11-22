import { EASE, unit, useClock, useCue } from "@motor/video";
import { Belt, BigWord, Chip, CodeLine, Layer, LangMark, PanelBody, RustMark, Worker } from "../parts.tsx";
import { Logo } from "@motor/ui";
import { GO, INK, MUTED, RED, RUST, YELLOW } from "../world.tsx";

/**
 * Rust: the band turns rust and the same compile belt comes back with a
 * "rustc" station. The panel puts the same function through both compilers:
 * both are machine code. The sweepers show up and get crossed out (Rust
 * keeps no cleaning crew), and "OWNERSHIP" lands.
 */
export function RustCompilado() {
  const t = useClock();
  const compila = useCue("compila");
  const maquina = useCue("máquina,");
  const limpieza = useCue("limpieza.");
  const ownership = useCue("ownership.");
  const cross = EASE.out(unit(t, limpieza + 0.1, 0.35));
  const crew = EASE.out(unit(t, useCue("necesita") - 0.1, 0.3));
  return (
    <Layer>
      <LangMark lang="rust" x={86} y={134} size={70} at={0} from="top" />
      <Belt y={360} station="rustc" color={RUST} t0={compila - 1.4} />
      {[0, 1, 2].map((k) => (
        <Worker key={k} x={400 + k * 36} y={246} s={1.2} color={YELLOW} opacity={crew * (1 - cross * 0.5)} />
      ))}
      {cross > 0 ? (
        <svg className="absolute left-0 top-0" width={540} height={960} aria-hidden>
          <line x1={378} y1={196} x2={378 + 110 * cross} y2={196 + 56 * cross} stroke={RED} strokeWidth={5} strokeLinecap="round" />
        </svg>
      ) : null}
      <Chip x={436} y={276} at={limpieza} color={RED}>sin recolector</Chip>
      <BigWord text="Ownership" x={270} y={150} align="center" size={48} color={RUST} at={ownership} />
      <PanelBody at={0}>
        <div className="font-mono text-[12px]" style={{ color: MUTED }}>func total(precio, iva)</div>
        <div className="mt-[10px] flex items-center gap-[8px]" style={{ opacity: EASE.out(unit(t, compila - 0.3, 0.3)) }}>
          <Logo slug="go" size={30} ancla={false} />
          <CodeLine at={compila - 0.3} color={GO}>ADD R1, R0, R0</CodeLine>
        </div>
        <div className="mt-[8px] flex items-center gap-[8px]" style={{ opacity: EASE.out(unit(t, compila, 0.3)) }}>
          <RustMark size={26} />
          <CodeLine at={compila} color={RUST}>add x0, x1, x0</CodeLine>
        </div>
        <div className="mt-[10px] font-mono text-[13px] font-bold" style={{ color: INK, opacity: EASE.out(unit(t, maquina, 0.3)) }}>los dos son código de máquina</div>
        <div className="mt-[12px] font-mono text-[12px]" style={{ color: MUTED, opacity: EASE.out(unit(t, limpieza, 0.3)) }}>barridos, mismo trabajo</div>
        <div className="flex justify-between font-mono text-[15px] font-bold" style={{ opacity: EASE.out(unit(t, limpieza, 0.3)) }}>
          <span style={{ color: GO }}>Go 3.611</span>
          <span style={{ color: RUST }}>Rust 0</span>
        </div>
      </PanelBody>
    </Layer>
  );
}
