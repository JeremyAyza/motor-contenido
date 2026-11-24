import { Stamp, useCue } from "@motor/video";
import { ACCENT, TUX, WIN } from "../world.tsx";
import { Big, Hi, Layer, Rows, SIDE } from "../parts.tsx";

/**
 * So which one is better: the question right of the presenter, then two
 * columns, "ELIGE WINDOWS SI" and "ELIGE LINUX SI". Windows' lights row by
 * row and gets its seal; then it dims and Linux's lights and gets its own.
 */
export function CualMejor() {
  const mejor = useCue("mejor?");
  const si = useCue("Si");
  const compat = useCue("compatibilidad,");
  const juegos = useCue("juegos,");
  const software = useCue("software");
  const familiar = useCue("familiar");
  const opcion = useCue("opción");
  const si2 = useCue("Si", 2);
  const control = useCue("control,");
  const personal = useCue("personalización,");
  const herramientas = useCue("herramientas");
  const sistema = useCue("sistema");
  const muy = useCue("muy");
  return (
    <Layer>
      <Big x={SIDE.x} y={SIDE.y} w={SIDE.w} size={40} at={0.1} until={si - 0.1}>
        ¿Entonces, cuál es <Hi color={ACCENT}>mejor?</Hi>
      </Big>
      <Rows
        x={36}
        y={176}
        w={228}
        rowH={88}
        gap={12}
        at={si - 0.2}
        dimFrom={si2}
        size={16}
        title="Elige Windows si"
        titleColor={WIN}
        rows={[
          { text: "Máxima compatibilidad", at: compat, color: WIN },
          { text: "Juegos", at: juegos, color: WIN },
          { text: "Software comercial", at: software, color: WIN },
          { text: "Familiar desde el día 1", at: familiar, color: WIN },
        ]}
      />
      <Rows
        x={276}
        y={176}
        w={228}
        rowH={88}
        gap={12}
        at={si - 0.1}
        size={16}
        title="Elige Linux si"
        titleColor={TUX}
        rows={[
          { text: "Control", at: control, color: TUX },
          { text: "Personalización", at: personal, color: TUX },
          { text: "Herramientas estilo Unix", at: herramientas, color: TUX },
          { text: "Un sistema a tu medida", at: sistema, color: TUX },
        ]}
      />
      <Stamp at={opcion} x={174} y={630} color={WIN} fill="#0B0F14" rotate={-5} size={24}>
        La opción segura
      </Stamp>
      <Stamp at={muy} x={376} y={700} color={TUX} fill="#0B0F14" rotate={4} size={24}>
        Muy tentador
      </Stamp>
    </Layer>
  );
}
