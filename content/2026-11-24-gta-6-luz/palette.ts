/*
 * The colors of "GTA 6 y la luz": pink and mint are the city's, sand and sea
 * its coast, asphalt its streets; the warm light is what GTA 6 traces, and
 * our violet marks what matters.
 */

export const BG = "#1D1E23";
export const INK = "#FFF8F2";
export const MUTED = "#C9C2C6";
export const ACCENT = "#8B85FF";
export const PINK = "#E79AB5";
export const MINT = "#8FD8BC";
export const SAND = "#F0DDA8";
export const SEA = "#1E8C8C";
export const ASPHALT = "#3A3D42";
export const AMBER = "#FFC23D";
export const LIGHT = "#FFE6A8";

/** What a scene's backdrop gets from the world: its own clock and its cues, in seconds from the scene's start. */
export type BackProps = { t: number; cue: (word: string, nth?: number) => number };
