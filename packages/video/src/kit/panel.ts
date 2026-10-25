import { meterValueAt, resolveMeter, type MeterStep } from "./meter.ts";
import type { TimelineScene } from "../timeline.ts";

/*
 * The HUD board (defineVideo({ panel })), like the taximeter of Rick's Reel
 * on what AI costs: rows with a dot on the active one (input, output,
 * cached), one or two counters that count live, and a footer line. Pure
 * math, like the meter, so it is tested without a browser.
 */

export type PanelCounter = {
  label: string;
  /** "money" puts the currency before the number. */
  kind?: "counter" | "money";
  start: number;
  /** Each step can last as long as what it counts (`ramp` in seconds). */
  steps: MeterStep[];
  unit?: string;
  decimals?: number;
};

export type PanelDef = {
  /** The rows of the legend, in order ("Entrada", "Salida", "Caché"). */
  rows?: string[];
  /** Which row is active from a word on (`value` is its index; -1 for none). */
  active?: MeterStep[];
  /** One or two counters: the first one big, the second one in the accent. */
  counters: PanelCounter[];
  /** The line under it: the model and its prices. */
  footer?: string;
};

type Scenes = Array<Pick<TimelineScene, "id" | "durationMs" | "words">>;

/** Every step of the board on the whole video's clock, to animate and to sound. */
export function resolvePanel(def: PanelDef, scenes: Scenes) {
  return {
    active: resolveMeter({ start: -1, steps: def.active ?? [] }, scenes),
    counters: def.counters.map((c) => resolveMeter({ start: c.start, steps: c.steps }, scenes)),
  };
}

/** What the board shows at `ms`: the active row (no ramp: it jumps) and each counter's value. */
export function panelAt(def: PanelDef, resolved: ReturnType<typeof resolvePanel>, ms: number) {
  let active = -1;
  for (const point of resolved.active) if (ms >= point.ms) active = point.value;
  return { active, values: def.counters.map((c, i) => meterValueAt(c.start, resolved.counters[i], ms)) };
}
