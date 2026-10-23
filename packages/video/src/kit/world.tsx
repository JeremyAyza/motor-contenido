import type { CSSProperties, ReactNode } from "react";
import { cx } from "../../../carousel/src/ui/index.tsx";
import { useStage } from "./scene.ts";

/**
 * A zone of the stage's world with a name (defineVideo({ stage: { spots } })):
 * it places its children over that box, in the world's coordinates, so the
 * camera frames exactly what is drawn there. Children position themselves
 * inside it (absolute coordinates from the spot's top left corner).
 */
export function Spot({ id, className, style, children }: { id: string; className?: string; style?: CSSProperties; children?: ReactNode }) {
  const { spots } = useStage();
  const box = spots[id];
  if (!box) throw new Error(`<Spot id="${id}">: "${id}" is not in stage.spots. Spots: ${Object.keys(spots).join(", ") || "none"}`);
  return (
    <div data-spot={id} className={cx("absolute", className)} style={{ left: box.x, top: box.y, width: box.w, height: box.h, ...style }}>
      {children}
    </div>
  );
}
