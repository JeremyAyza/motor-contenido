import { useLayoutEffect } from "react";
import { continueRender, delayRender, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * A piece of text as the browser lays it out, in design px. `ui` marks the
 * text of an interface of the stage kit (data-ui): a screen's chrome, not a
 * sentence to read.
 */
export type ProbedText = { text: string; x: number; y: number; w: number; h: number; fontSize: number; opacity: number; ui?: boolean };
export type ProbeReport = { frame: number; texts: ProbedText[] };

/** Frames the probe reports: the first one and then every half second. */
export const probes = (frame: number, fps: number) => frame === 0 || frame % Math.round(fps / 2) === 0;

/**
 * Measures the text of a frame for the video inspector and posts it to the
 * local server that video:render opens. It changes nothing on screen, so the
 * video is the same file with or without it. The captions, the tab and the
 * signature are part of the frame, not of the piece, and are left out.
 */
export function Probe({ url }: { url: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  useLayoutEffect(() => {
    if (!probes(frame, fps)) return;
    const root = document.querySelector<HTMLElement>("[data-video-root]");
    if (!root) return;
    const handle = delayRender(`Inspecting frame ${frame}`);
    const report: ProbeReport = { frame, texts: measureTexts(root) };
    fetch(url, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(report) })
      .catch(() => undefined)
      .finally(() => continueRender(handle));
  }, [frame, fps, url]);
  return null;
}

function effectiveOpacity(el: Element | null): number {
  let opacity = 1;
  for (let node = el; node && node instanceof HTMLElement; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.visibility === "hidden" || style.display === "none") return 0;
    opacity *= Number.parseFloat(style.opacity);
  }
  return opacity;
}

/**
 * Rects in design px. Remotion scales the composition with a transform when
 * it renders at --scale, and getBoundingClientRect sees the scaled result;
 * offsetWidth does not, so their ratio is the scale.
 */
function measureTexts(root: HTMLElement): ProbedText[] {
  const texts: ProbedText[] = [];
  const box = root.getBoundingClientRect();
  const scale = box.width / root.offsetWidth || 1;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent?.trim();
    const el = node.parentElement;
    if (!text || !el || el.closest("[data-captions], [data-frame], [data-brand], style, script")) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const rect = range.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    texts.push({
      text,
      x: (rect.x - box.x) / scale,
      y: (rect.y - box.y) / scale,
      w: rect.width / scale,
      h: rect.height / scale,
      fontSize: Number.parseFloat(getComputedStyle(el).fontSize),
      opacity: effectiveOpacity(el),
      ui: Boolean(el.closest("[data-ui]")),
    });
  }
  return texts;
}
