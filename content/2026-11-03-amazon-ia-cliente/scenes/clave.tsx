import { Icono } from "@motor/ui";
import { useCue } from "@motor/video";
import { Layer, Sticker } from "../parts.tsx";

/** The thesis: the desk rolls toward the customer while the three words land. */
export function Clave() {
  return (
    <Layer>
      <Sticker at={0.1} x={270} y={112} rotate={-2} tone="ink" className="whitespace-nowrap text-[40px] uppercase">
        La clave
      </Sticker>
      <Sticker at={useCue("producto")} x={160} y={214} rotate={-6} className="flex items-center gap-2 whitespace-nowrap text-[30px] uppercase">
        <Icono name="package" size={34} strokeWidth={2.4} ancla={false} />
        Producto
      </Sticker>
      <Sticker at={useCue("negocio")} x={370} y={250} rotate={5} className="flex items-center gap-2 whitespace-nowrap text-[30px] uppercase">
        <Icono name="store" size={34} strokeWidth={2.4} ancla={false} />
        Negocio
      </Sticker>
      <Sticker at={useCue("clientes")} x={270} y={326} rotate={-3} tone="accent" className="flex items-center gap-3 whitespace-nowrap text-[40px] uppercase">
        <Icono name="users" size={44} strokeWidth={2.4} ancla={false} />
        Clientes
      </Sticker>
    </Layer>
  );
}
