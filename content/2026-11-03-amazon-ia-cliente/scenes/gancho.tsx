import { Layer, Sticker } from "../parts.tsx";

/** The hook, settled from frame 1 over the pile that starts growing. */
export function Gancho() {
  return (
    <Layer>
      <Sticker at={-1} x={270} y={128} rotate={-3} className="text-center" style={{ width: 448, fontSize: 54 }}>
        Más código no es <span className="text-accent">más valor</span>
      </Sticker>
    </Layer>
  );
}
