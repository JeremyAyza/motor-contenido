import { join } from "node:path";
import { runPythonJson } from "../../carousel/src/python.ts";
import { WORDS_PER_SECOND } from "./script.ts";

/**
 * ig-reel's two tools over a video.json, through the Spanish wrappers in
 * skills/ig-es: hookscore_es (the spoken hooks) and beats_es (the timed beat
 * sheet, one beat per sentence). The warnings go into the gate A sheet.
 */

/** One hook from hookscore_es.py --video --json, in the order of video.json. */
export type HookScore = { hook: string; onScreen: string; formula: number; score: number; verdict: string; weakest: string; flags: string[] };

export type Beat = { n: number; start: number; dur: number; words: number; text: string; concrete: number; label: string; flags: string[]; scene?: string };

/** beats_es.py --video --json. `loop` is the words the last beat repeats from the first. */
export type BeatSheet = { wpm: number; total_seconds: number; total_words: number; beats: Beat[]; notes: string[]; loop: string[] };

export type ReelChecks = { hooks: HookScore[] | null; beats: BeatSheet | null; errors: string[] };

export function runReelChecks(dir: string): ReelChecks {
  const script = join(dir, "video.json");
  const hooks = runPythonJson<HookScore[]>("skills/ig-es/hookscore_es.py", ["--video", script, "--json"]);
  const beats = runPythonJson<BeatSheet>("skills/ig-es/beats_es.py", ["--video", script, "--json", "--wpm", String(WORDS_PER_SECOND * 60)]);
  const errors = [
    ...(hooks.data ? [] : [`hookscore_es: ${hooks.error ?? "sin resultado"}`]),
    ...(beats.data ? [] : [`beats_es: ${beats.error ?? "sin resultado"}`]),
  ];
  return { hooks: hooks.data, beats: beats.data, errors };
}

/** ig-reel: "If the top one is under 50, you do not have the hook yet." */
export const HOOK_MIN_SCORE = 50;
/** ig-reel (beats.py): more than this on one sentence and the frame has to change inside it. */
export const MAX_BEAT_SECONDS = 4;
/** ig-reel (beats.py): this many sentences in a row with nothing concrete. */
export const ABSTRACT_RUN = 3;

const quote = (text: string, max = 48) => `"${text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text}"`;

/** What ig-reel's tools flag, in Spanish, for the gate A sheet. The length and the hook's seconds are scriptWarnings'. */
export function reelWarnings({ hooks, beats, errors }: ReelChecks): string[] {
  const warnings = errors.map((e) => `No se pudo correr ig-reel (${e})`);
  if (hooks?.length) {
    const [chosen] = hooks;
    if (chosen.score < HOOK_MIN_SCORE) {
      warnings.push(`El gancho elegido saca ${Math.round(chosen.score)} en hookscore (${chosen.verdict}, lo más flojo: ${chosen.weakest}). Con menos de ${HOOK_MIN_SCORE}, ig-reel dice que todavía no hay gancho`);
    }
    hooks.forEach((h, i) => h.flags.forEach((flag) => warnings.push(`Gancho ${i + 1}: ${flag}`)));
  }
  if (beats?.beats.length) {
    const rows = beats.beats;
    const where = (b: Beat) => (b.scene ? `escena ${b.scene}` : `frase ${b.n}`);
    if (rows[0].concrete === 0) warnings.push("La primera frase no tiene nada que se pueda comprobar: ni una cifra, ni un nombre, ni un término técnico");
    // The longest sentence of each place, so a long scene is one mention.
    const longest = new Map<string, Beat>();
    for (const b of rows.filter((r) => r.dur > MAX_BEAT_SECONDS)) {
      const prev = longest.get(where(b));
      if (!prev || b.dur > prev.dur) longest.set(where(b), b);
    }
    if (longest.size) {
      const list = [...longest].map(([place, b]) => `${place} (${b.dur.toFixed(1)} s)`).join(", ");
      warnings.push(`Frases de más de ${MAX_BEAT_SECONDS} s en: ${list}. Algo tiene que cambiar en pantalla mientras se dicen, o la frase se parte; el inspector lo mide después en el video`);
    }
    let run: Beat[] = [];
    for (const b of rows) {
      run = b.concrete === 0 ? [...run, b] : [];
      if (run.length === ABSTRACT_RUN) {
        warnings.push(`Desde ${quote(run[0].text)} (${where(run[0])}) van ${ABSTRACT_RUN} frases seguidas sin nada concreto: ni una cifra, ni un nombre, ni un término técnico`);
      }
    }
    if (!beats.loop.length) warnings.push("La última frase no repite ninguna palabra del gancho: sin bucle, el video termina plano y no invita a verlo otra vez");
  }
  return warnings;
}
