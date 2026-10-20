import type { ReactNode } from "react";
import { Boceto, cx } from "../../../carousel/src/ui/index.tsx";
import { FRAME_PAD, WIDTH } from "../timeline.ts";

/** Width a drawing can use: the canvas inside the frame's padding, as in the carousel (468 px). */
export const DRAWING_WIDTH = WIDTH - 2 * FRAME_PAD;

/**
 * The layout of a scene inside the frame (PieceVideo puts it in the content
 * area of <Slide>, CONTENT_BOX): the title at the top, visible from the
 * scene's first frame, and the drawing centered in the space left down to the
 * captions. The drawing is a box of DRAWING_WIDTH × `height` px; its children
 * position themselves inside it (absolute coordinates, like the carousel's).
 */
export function SceneFrame({
  title,
  anchor,
  underline = false,
  height,
  titleClassName,
  children,
}: {
  title: string;
  /** The anchor of the theme next to the title: an official logo, an object. */
  anchor?: ReactNode;
  /** A hand-drawn underline in the accent, drawn 0.3 s into the scene. */
  underline?: boolean;
  height: number;
  /** Classes for the title, over the default (the display font, 44 px, black weight). */
  titleClassName?: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <h1 className={cx("font-display text-[44px] font-black leading-[1.02] tracking-tight", titleClassName)}>{title}</h1>
        {anchor ? <div className="shrink-0">{anchor}</div> : null}
      </div>
      {underline ? (
        <Boceto ancho={290} alto={16} trazos={[{ d: "M4 10 C 90 4, 200 14, 286 7", tono: "accent" }]} grosor={3} className="mt-1" anim={{ en: 0.3, dur: 0.5 }} />
      ) : null}
      <div className="flex min-h-0 flex-1 items-center">
        <div className="relative w-full" style={{ height }}>
          {children}
        </div>
      </div>
    </>
  );
}
