import { useLayoutEffect } from "react";
import { continueRender, delayRender, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * A piece of text as the browser lays it out, in design px. `ui` marks the
 * text of an interface of the stage kit (data-ui): a screen's chrome, not a
 * sentence to read. `title` marks the title of a SceneFrame (data-scene-title).
 * `stage` marks the text of a stage's world (data-camera): its size is the one
 * seen, with the camera's zoom. `moving` marks the text under a piece's own
 * camera while it moves (data-camera-moving).
 */
export type ProbedText = { text: string; x: number; y: number; w: number; h: number; fontSize: number; opacity: number; ui?: boolean; title?: boolean; stage?: boolean; moving?: boolean };
export type ProbeReport = { frame: number; texts: ProbedText[] };

type Marked = { dataset: Record<string, string | undefined>; parentElement: Marked | null };

/**
 * What the cameras around a text do to it, from the marks going up the page:
 * the stage's (data-camera), a piece's own inside the world (data-zoom, and
 * data-camera-moving while it moves). A layer locked to the screen (data-screen)
 * undoes the ones around it, so the walk stops there.
 */
export function camerasOver(el: Marked): { stage: boolean; zoom: number; moving: boolean } {
  const over = { stage: false, zoom: 1, moving: false };
  for (let node: Marked | null = el; node && node.dataset.screen === undefined; node = node.parentElement) {
    if (node.dataset.camera !== undefined) over.stage = true;
    if (node.dataset.cameraMoving !== undefined) over.moving = true;
    if (node.dataset.zoom !== undefined) over.zoom *= Number(node.dataset.zoom) || 1;
  }
  return over;
}

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
    // The first frame of a tab is laid out before its fonts and images arrive;
    // the probe measures what gets captured, so it waits for them.
    settled(root)
      .then(() => {
        const report: ProbeReport = { frame, texts: measureTexts(root) };
        return fetch(url, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(report) });
      })
      .catch(() => undefined)
      .finally(() => continueRender(handle));
  }, [frame, fps, url]);
  return null;
}

/** Resolves when the fonts and the images of `root` are loaded (measuring forces the layout). */
async function settled(root: HTMLElement): Promise<void> {
  await document.fonts.ready;
  await new Promise((done) => setTimeout(done, 100));
  void root.offsetHeight;
  const pending = [...root.querySelectorAll("img")].filter((img) => !img.complete);
  await Promise.all(
    pending.map(
      (img) =>
        new Promise((done) => {
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        }),
    ),
  );
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
    const { stage, zoom, moving } = camerasOver(el);
    texts.push({
      text,
      x: (rect.x - box.x) / scale,
      y: (rect.y - box.y) / scale,
      w: rect.width / scale,
      h: rect.height / scale,
      fontSize: Number.parseFloat(getComputedStyle(el).fontSize) * zoom,
      opacity: effectiveOpacity(el),
      ui: Boolean(el.closest("[data-ui]")),
      title: Boolean(el.closest("[data-scene-title]")),
      stage,
      moving,
    });
  }
  return texts;
}
