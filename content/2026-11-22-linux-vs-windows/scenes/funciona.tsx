import { useCue } from "@motor/video";
import { OK, WIN } from "../world.tsx";
import { Big, Check, Hi, Ic, Layer, Note, Rows, SIDE } from "../parts.tsx";

/**
 * Four steps, no decisions: a setup checklist that lights row by row with
 * the voice, then the presenter comes in and "TODO FUNCIONA" lands in green
 * with four checks.
 */
export function Funciona() {
  const instalas = useCue("instalas,");
  const conectas = useCue("conectas");
  const bajas = useCue("bajas");
  const abres = useCue("abres");
  const y = useCue("y");
  const todo = useCue("todo");
  const funciona = useCue("funciona.");
  return (
    <Layer>
      <Rows
        x={56}
        y={172}
        w={428}
        rowH={62}
        gap={10}
        at={-0.2}
        until={todo - 0.15}
        size={19}
        title="Configurar tu PC"
        titleColor={WIN}
        rows={[
          { text: "Instalarlo", tag: "instalación", at: instalas, icon: <Ic name="download" size={18} color={OK} /> },
          { text: "Conectar tu hardware", tag: "driver", at: conectas, icon: <Ic name="usb" size={18} color={OK} /> },
          { text: "Bajar tus apps", tag: ".exe", at: bajas, icon: <Ic name="app-window" size={18} color={OK} /> },
          { text: "Abrir tus juegos", tag: "steam", at: abres, icon: <Ic name="gamepad-2" size={18} color={OK} /> },
        ]}
      />
      <Note x={270} y={480} at={abres + 0.4} until={y + 0.1} size={15}>Cuatro pasos. Ninguna decisión.</Note>
      <Big x={SIDE.x} y={SIDE.y - 4} w={SIDE.w} size={42} at={todo - 0.1} upper>
        Todo <Hi color={OK}>funciona</Hi>
      </Big>
      {[0, 1, 2, 3].map((i) => (
        <Check key={i} x={SIDE.x + 22 + i * 52} y={SIDE.y + 140} at={funciona + i * 0.1} />
      ))}
    </Layer>
  );
}
