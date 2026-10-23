import { normalizeWord } from "../../../media/src/words.ts";
import type { TimelineScene } from "../timeline.ts";

/*
 * The HUD meter (defineVideo({ meter })): what is at stake, on screen from
 * the hook to the close (video.json → meter). Pure math, like the camera, so
 * video:prepare can read video.tsx in Node and the tests run without a browser.
 */

/**
 * - counter: a number that counts (1 → 50.000.000);
 * - money: the same with a currency prefix ($0.00 → $912);
 * - bar: a bar that fills up to `max` (a battery, a progress);
 * - slots: `max` boxes that fill one by one (1/5), the empty ones with "?".
 */
export type MeterKind = "counter" | "money" | "bar" | "slots";

/** A moment the meter changes: when `word` is said in `scene` (its `nth` time), or at the scene's start. */
export type MeterStep = { scene: string; word?: string; nth?: number; value: number };

export type MeterDef = {
  kind?: MeterKind;
  /** What it counts, in 1 to 4 words. By default, video.json → meter.label. */
  label?: string;
  /** Its value at frame 1 (video.json → meter.from). */
  start: number;
  steps: MeterStep[];
  /** The full bar or the number of slots. */
  max?: number;
  /** Text after the number ("ms", "usuarios"), or the currency for money ("$" by default). */
  unit?: string;
  /** Decimals of the number (0 by default; 2 for money). */
  decimals?: number;
};

export type MeterPoint = { ms: number; value: number };

/** How long the meter takes to go from one value to the next. */
export const METER_RAMP_MS = 600;

/** The steps on the whole video's clock, in order. */
export function resolveMeter(def: MeterDef, scenes: Array<Pick<TimelineScene, "id" | "durationMs" | "words">>): MeterPoint[] {
  const points = def.steps.map((step) => {
    let offset = 0;
    for (const scene of scenes) {
      if (scene.id === step.scene) {
        if (!step.word) return { ms: offset, value: step.value };
        const target = normalizeWord(step.word);
        const hit = scene.words.filter((w) => normalizeWord(w.text) === target)[(step.nth ?? 1) - 1];
        if (!hit) throw new Error(`meter: "${step.word}" is not said in scene "${step.scene}". Words: ${scene.words.map((w) => w.text).join(" ")}`);
        return { ms: offset + hit.startMs, value: step.value };
      }
      offset += scene.durationMs;
    }
    throw new Error(`meter: "${step.scene}" is not a scene of the video. Scenes: ${scenes.map((s) => s.id).join(", ")}`);
  });
  return points.sort((a, b) => a.ms - b.ms);
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** The meter's value at `ms`: each step counts up (or down) from the value before it in METER_RAMP_MS. */
export function meterValueAt(start: number, points: MeterPoint[], ms: number, rampMs = METER_RAMP_MS): number {
  let value = start;
  for (const point of points) {
    if (ms < point.ms) break;
    const t = Math.min(1, (ms - point.ms) / rampMs);
    value = value + (point.value - value) * easeOut(t);
  }
  return value;
}

/** The number as the meter shows it, like the carousel's counters (es-MX: 1,250,000; $912.00). */
export function formatMeter(value: number, def: Pick<MeterDef, "kind" | "unit" | "decimals">): string {
  const money = def.kind === "money";
  const decimals = def.decimals ?? (money ? 2 : 0);
  const number = new Intl.NumberFormat("es-MX", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
  if (money) return `${def.unit ?? "$"}${number}`;
  return def.unit ? `${number} ${def.unit}` : number;
}
