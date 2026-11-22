import { Logo } from "@motor/ui";
import { useClock, useCue } from "@motor/video";
import { Belt, BigWord, Chip, CodeLine, Layer, LangMark, PanelBody, Small } from "../parts.tsx";
import { GO, INK, MUTED } from "../world.tsx";

/**
 * Go, where it comes from: the band turns teal and the compile belt crosses
 * it with its "go build" station. The panel says Google made it to keep big
 * software simple; on "compilado" sheets of code ride the belt and leave as
 * machine code, and the panel shows a function and its assembly.
 */
export function GoCompilado() {
  const t = useClock();
  const google = useCue("Google");
  const simple = useCue("simple.");
  const compilado = useCue("compilado:");
  const maquina = useCue("máquina");
  const antes = useCue("antes");
  return (
    <Layer>
      <LangMark lang="go" x={470} y={124} size={56} at={0} />
      <Belt y={360} station="go build" color={GO} t0={compilado - 1.2} />
      <Chip x={270} y={238} at={google} color={INK}>
        <span className="inline-flex items-center gap-[6px]">
          <Logo slug="google" size={14} ancla={false} /> creado en Google
        </span>
      </Chip>
      <BigWord text="Compilado" x={270} y={150} align="center" size={50} color={GO} at={compilado} />
      <Chip x={430} y={420} at={maquina} color={GO}>código de máquina</Chip>
      <Chip x={110} y={420} at={antes} color={INK}>antes de correr</Chip>
      <PanelBody at={0} until={compilado - 0.45}>
        <div className="mt-[18px]">
          <Logo slug="go" size={70} ancla={false} />
        </div>
        <div className="mt-[10px] font-mono text-[12px] font-bold" style={{ color: MUTED, opacity: t >= google ? 1 : 0 }}>creado en Google</div>
        <div className="mt-[8px] font-display text-[26px] font-black leading-[1.05]" style={{ color: INK, opacity: t >= simple - 0.6 ? 1 : 0.25 }}>
          software grande,
          <br />
          más simple
        </div>
      </PanelBody>
      <PanelBody at={compilado}>
        <CodeLine at={compilado} color={MUTED} size={12}>add.go</CodeLine>
        <CodeLine at={compilado + 0.1}>{"func total(precio, iva int) int {"}</CodeLine>
        <CodeLine at={compilado + 0.4} color={GO}>{"    return precio + iva"}</CodeLine>
        <CodeLine at={compilado + 0.6}>{"}"}</CodeLine>
        <div className="mt-[10px]" />
        <CodeLine at={maquina - 0.4} color={MUTED} size={12}>$ go build && go tool objdump</CodeLine>
        <CodeLine at={maquina} color={GO} hot="rgba(41,190,176,0.14)">ADD R1, R0, R0</CodeLine>
        <CodeLine at={maquina + 0.3} color={GO}>RET</CodeLine>
      </PanelBody>
      <Small x={216} y={772} at={compilado}>Ejemplo ilustrativo</Small>
    </Layer>
  );
}
