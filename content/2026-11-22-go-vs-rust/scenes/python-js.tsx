import { EASE, unit, useClock, useCue } from "@motor/video";
import { BarRow, CodeLine, Example, Layer, LogoTile, PanelBody, Small } from "../parts.tsx";
import { Logo } from "@motor/ui";
import { GO, INK, LINE, MUTED, RUST, SURFACE } from "../world.tsx";
import { RustMark } from "../parts.tsx";

/** The four bars of the example benchmark, shared with the myth scene. */
export const BARS = [
  { id: "rust", label: "Rust", value: 13.5, color: RUST },
  { id: "go", label: "Go", value: 13.9, color: GO },
  { id: "js", label: "JavaScript", value: 41.5, color: "#E8C547" },
  { id: "py", label: "Python", value: 81, color: "#4B8BBE" },
] as const;

export const barMark = (id: string) =>
  id === "rust" ? <RustMark size={18} /> : <Logo slug={id === "go" ? "go" : id === "js" ? "javascript" : "python"} size={18} ancla={false} />;

/** A row of steps: compiled code runs three, interpreted code runs many more. Top-left at x, y. */
function Steps({ y, label, n, at, color }: { y: number; label: string; n: number; at: number; color: string }) {
  const t = useClock();
  const o = EASE.out(unit(t, at, 0.3));
  return (
    <div className="absolute" style={{ left: 36, top: y, opacity: o }}>
      <div data-ui="" className="font-mono text-[13px] font-bold" style={{ color: INK }}>{label}</div>
      <div className="mt-[5px] flex gap-[4px]">
        {Array.from({ length: n }).map((_, i) => (
          <span key={i} className="block h-[16px] w-[38px] rounded-[2px]" style={{ background: color, opacity: EASE.out(unit(t, at + 0.15 * i, 0.2)) }} />
        ))}
      </div>
    </div>
  );
}

/**
 * Why not Python or JavaScript: their tiles drop in, fast to write and with
 * huge ecosystems. Then two rows of steps: compiled code goes straight to
 * the CPU in three, interpreted code does many more behind the scenes. On
 * "cargas" the band turns into the example benchmark and the bars grow.
 */
export function PythonJs() {
  const t = useClock();
  const python = useCue("Python");
  const js = useCue("JavaScript?");
  const excelentes = useCue("excelentes");
  const detras = useCue("detrás");
  const cargas = useCue("cargas");
  const out = EASE.in(unit(t, cargas - 0.4, 0.3));
  return (
    <Layer>
      <div style={{ opacity: 1 - out }}>
        <LogoTile slug="python" x={200} y={160} at={python} name="Python" />
        <LogoTile slug="javascript" x={340} y={160} at={js} name="JavaScript" />
        <Small x={270} y={226} at={excelentes} center w={440} color={INK} size={13}>excelentes para muchas apps</Small>
        <Small x={270} y={246} at={excelentes + 0.4} center w={440}>rápidos de escribir, ecosistemas enormes</Small>
        <Steps y={300} label="compilado: directo a la CPU" n={3} at={detras - 0.6} color={GO} />
        <Steps y={378} label="interpretado: más trabajo detrás" n={10} at={detras} color="#C9C3B6" />
      </div>
      {t >= cargas - 0.2 ? (
        <>
          <Small x={36} y={112} at={cargas - 0.2} color={INK} size={14}>mismo trabajo: primos hasta 5.000.000</Small>
          {BARS.map((b, i) => (
            <BarRow key={b.id} x={36} y={150 + i * 82} label={b.label} mark={barMark(b.id)} value={b.value} max={81} width={360} color={b.color} at={cargas + i * 0.15} />
          ))}
          <Example x={36} y={466} at={cargas} />
        </>
      ) : null}
      <PanelBody at={0}>
        <div className="font-mono text-[12px]" style={{ color: MUTED }}>Rust, compilado</div>
        <CodeLine at={0.2} color={RUST}>add x0, x1, x0</CodeLine>
        <CodeLine at={0.4} color={RUST}>ret</CodeLine>
        <div className="mt-[10px] font-mono text-[12px]" style={{ color: MUTED, opacity: EASE.out(unit(t, detras - 0.3, 0.3)) }}>Python, bytecode del intérprete</div>
        {["RESUME 0", "LOAD_FAST_BORROW_LOAD_FAST_BORROW", "BINARY_OP 0 (+)", "RETURN_VALUE"].map((line, i) => (
          <CodeLine key={line} at={detras - 0.2 + i * 0.25} color="#C9C3B6" size={12}>{line}</CodeLine>
        ))}
        <div className="mt-[8px] rounded-[3px] px-[6px] py-[3px] font-mono text-[12px]" style={{ background: SURFACE, border: `1px solid ${LINE}`, color: MUTED, opacity: EASE.out(unit(t, detras + 1, 0.3)) }}>
          cada paso: despachar, revisar tipos
        </div>
      </PanelBody>
    </Layer>
  );
}
