import { CUT_MARGIN_MS, type Timeline } from "./timeline.ts";

/*
 * The clock of a piece: every word of the voice with the second it is said,
 * scene by scene, so the agent places cues and figures from one short file
 * instead of opening timeline.json. video:prepare writes it with the voice's
 * timings and video:storyboard with the estimate. In Spanish: the person reads it too.
 */

/** A silence between two words this long or longer is marked: a cut or a beat fits there. */
export const PAUSE_MS = 280;

const NUMBER =
  /^(\d|cero$|uno$|una$|dos$|tres$|cuatro$|cinco$|seis$|siete$|ocho$|nueve$|diez$|once$|doce$|quince$|veinte$|treinta$|cuarenta$|cincuenta$|cien$|ciento$|mil$|millon|millones$|billon|mitad$|doble$|triple$)/i;

/** A word that says a figure: digits, or a number said in Spanish. */
export const isNumberWord = (word: string) => NUMBER.test(word.replace(/^[¿¡"'(«]+/, "").toLowerCase());

const s = (ms: number) => (ms / 1000).toFixed(2);

/**
 * The clock as markdown: per scene its start and length on the video, then
 * each word as `palabra@1.23` (seconds from the scene's start, what useCue
 * gives), pauses as `/0.35/`, figures in bold and the words too close to the
 * cut (CUT_MARGIN_MS) with ⚠.
 */
export function clockSheet(timeline: Pick<Timeline, "piece" | "scenes">): string {
  const lines = [
    `# Reloj de ${timeline.piece}`,
    "",
    `Cada palabra con el segundo en que se dice desde el inicio de su escena (lo que da useCue). /x/ es una pausa de x s, en **negrita** van las cifras y con ⚠ lo que cae a menos de ${s(CUT_MARGIN_MS)} s del corte.`,
  ];
  let offset = 0;
  for (const scene of timeline.scenes) {
    lines.push("", `## ${scene.id} · ${s(offset)}–${s(offset + scene.durationMs)} s (${s(scene.durationMs)} s)`, "");
    const parts: string[] = [];
    scene.words.forEach((w, i) => {
      const gap = i > 0 ? w.startMs - scene.words[i - 1].endMs : 0;
      if (gap >= PAUSE_MS) parts.push(`/${s(gap)}/`);
      const word = `${w.text}@${s(w.startMs)}`;
      const late = scene.durationMs - w.startMs < CUT_MARGIN_MS ? "⚠" : "";
      parts.push(`${isNumberWord(w.text) ? `**${word}**` : word}${late}`);
    });
    lines.push(parts.join(" ") || "(sin voz)");
    offset += scene.durationMs;
  }
  return `${lines.join("\n")}\n`;
}
