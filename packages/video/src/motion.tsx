import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Puts the carousel primitives' motion (CSS animations on [data-anim] and
 * numbers that count on [data-cuenta]) at the current frame. Remotion renders
 * frames out of order and in several tabs, so nothing may run on the clock.
 *
 * The animations are paused and their delay is shifted by the current time
 * (--t), so the browser computes each frame from CSS alone. Seeking them from
 * JavaScript failed on the first frame of each tab, before the browser had
 * created them. New motion written for a video uses useCurrentFrame() and
 * interpolate(), as the Remotion skills say.
 */
export const VIDEO_MOTION_CSS = `
[data-video-motion] [data-anim],
[data-video-motion] [data-anim="traza"] :is(path, line, polyline, polygon, circle, ellipse, rect) {
  animation-play-state: paused !important;
  animation-delay: calc(var(--en, 0s) - var(--t)) !important;
}
[data-video-motion] [data-anim="traza"] :is(path, line, polyline, polygon, circle, ellipse, rect) {
  animation-name: motor-traza-video !important;
}
@keyframes motor-traza-video { 0% { stroke-dashoffset: 1; opacity: 0; } 1% { opacity: 1; } }
`;
/*
 * motor-traza-video: before a stroke starts, its dash of length zero still
 * draws the round cap as a dot. In a carousel only the final state is seen;
 * in a video the dot sits there until the stroke is drawn, so it is hidden.
 */

export function CssMotion({ children }: { children: ReactNode }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ref = useRef<HTMLDivElement>(null);
  const ms = (frame / fps) * 1000;
  useLayoutEffect(() => {
    if (ref.current) seekCounters(ref.current, ms);
  });
  return (
    <AbsoluteFill ref={ref} data-video-motion="" style={{ "--t": `${ms / 1000}s` } as CSSProperties}>
      {children}
    </AbsoluteFill>
  );
}

/** Numbers that count (<Cuenta>), with the same easing as the carousel (movimiento.ts). */
function seekCounters(root: HTMLElement, ms: number) {
  for (const el of root.querySelectorAll('[data-anim="traza"] :is(path, line, polyline, polygon, circle, ellipse, rect)')) {
    if (el.getAttribute("pathLength") !== "1") el.setAttribute("pathLength", "1");
  }
  for (const el of root.querySelectorAll<HTMLElement>("[data-cuenta]")) {
    const from = Number(el.dataset.desde);
    const to = Number(el.dataset.hasta);
    const progress = Math.min(Math.max((ms - Number(el.dataset.en) * 1000) / (Number(el.dataset.dur) * 1000), 0), 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const decimals = el.dataset.decimales ? Number(el.dataset.decimales) : Number.isInteger(to) ? 0 : Math.abs(to) < 10 ? 2 : 1;
    const value = new Intl.NumberFormat("es-MX", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(from + (to - from) * eased);
    el.textContent = `${el.dataset.prefijo ?? ""}${value}${el.dataset.sufijo ?? ""}`;
  }
}
