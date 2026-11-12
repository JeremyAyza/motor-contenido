import { existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

/*
 * `npm run video:fase -- content/<piece>`: where a Reel is and the exact
 * message to resume it in a new chat when the one that started it was cut
 * (docs/reel.md, "Cómo se trabaja"). A Reel runs in one chat at high effort,
 * opened with /content-engine-copy or /content-engine-new.
 */

export type Phase = "creativa" | "produccion" | "critica" | "lista";

export interface PieceState {
  hasScript: boolean;
  gateA: boolean;
  hasVoice: boolean;
  hasVideo: boolean;
  gateB: boolean;
  hasEstado: boolean;
}

export function pieceState(dir: string): PieceState {
  const scriptFile = join(dir, "video.json");
  const script = existsSync(scriptFile) ? (JSON.parse(readFileSync(scriptFile, "utf8")) as { gateA?: { approved?: boolean }; gateB?: { approved?: boolean } }) : undefined;
  return {
    hasScript: Boolean(script),
    gateA: Boolean(script?.gateA?.approved),
    hasVoice: existsSync(join(dir, "out/video/timeline.json")),
    hasVideo: existsSync(join(dir, "out/video.mp4")),
    gateB: Boolean(script?.gateB?.approved),
    hasEstado: existsSync(join(dir, "estado.md")),
  };
}

export function phaseOf(state: PieceState): Phase {
  if (!state.hasScript || !state.gateA) return "creativa";
  if (state.gateB) return "lista";
  if (state.hasVideo) return "critica";
  return "produccion";
}


const NEXT: Record<Phase, string> = {
  creativa: "Termina lo creativo: si gateA no tiene mis respuestas, hazme la ronda de preguntas (docs/reel.md, paso 0); después ángulo, ganchos, guion y guion visual (intent y metaphor por escena), y congela con video:congelar. No me muestres el guion para aprobarlo.",
  produccion: "Producción: empareja con la biblioteca (video:emparejar), construye video.tsx con una escena por archivo, comprueba por escena (video:frames y --escena), genera la voz y haz el primer render completo para el crítico.",
  critica: "Crítica y cierre: corre video:critique y el subagente critico-ciego-video, arregla sus tres problemas comprobando por escena, haz el segundo y último render completo, pásame el video y pregúntame si lo publicas (puerta B).",
  lista: "La pieza tiene la puerta B. Si te dije que la publiques y no está en npm run publisher -- status, publícala; si no, cosecha escenas para la biblioteca con video:cosechar.",
};

/** The message to paste in a new chat, and the effort to open it with: always high. */
export function nextChat(dir: string, state: PieceState): { phase: Phase; effort: string; message: string } {
  const phase = phaseOf(state);
  const piece = basename(dir);
  const read = ["AGENTS.md", "docs/reel.md", ...(state.hasEstado ? [`content/${piece}/estado.md`] : [])].join(", ");
  const message = `Sigue con el Reel content/${piece}. Lee ${read}, y nada más de chats anteriores. ${NEXT[phase]} Antes de cerrar, actualiza estado.md con la fase, el paso siguiente y lo que decidí.`;
  return { phase, effort: "alto", message };
}
