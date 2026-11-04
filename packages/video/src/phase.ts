import { existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

/*
 * `npm run video:fase -- content/<piece>`: where a Reel is and the exact
 * message to open its next chat (docs/reel.md, "Quién piensa y cuánto"). The
 * creative phase runs at extra high effort; production, at high. The person
 * picks the effort when opening the chat: the agent cannot change it midway.
 */

export type Phase = "creativa" | "produccion" | "critica" | "lista";

export interface PieceState {
  hasScript: boolean;
  gateA: boolean;
  /** Jeremy delegated the gates ("no me pidas aprobaciones"): one chat for everything. */
  direct: boolean;
  hasVoice: boolean;
  hasVideo: boolean;
  gateB: boolean;
  hasEstado: boolean;
}

export function pieceState(dir: string): PieceState {
  const scriptFile = join(dir, "video.json");
  const script = existsSync(scriptFile) ? (JSON.parse(readFileSync(scriptFile, "utf8")) as { gateA?: { approved?: boolean; notes?: string }; gateB?: { approved?: boolean } }) : undefined;
  return {
    hasScript: Boolean(script),
    gateA: Boolean(script?.gateA?.approved),
    direct: /deleg/i.test(script?.gateA?.notes ?? ""),
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

const EFFORT: Record<Phase, string> = { creativa: "extra alto", produccion: "alto", critica: "alto", lista: "alto" };

const NEXT: Record<Phase, string> = {
  creativa: "Termina lo creativo: ángulo, ganchos, guion y guion visual (intent y metaphor por escena), congela con video:congelar y lleva la pieza a la puerta A.",
  produccion: "Producción: empareja con la biblioteca (video:emparejar), construye video.tsx con una escena por archivo, comprueba por escena (video:frames y --escena), genera la voz y haz el primer render completo para el crítico.",
  critica: "Crítica y cierre: corre video:critique y el subagente critico-ciego-video, arregla sus tres problemas comprobando por escena, haz el segundo y último render completo y muéstrame el video para la puerta B.",
  lista: "La pieza tiene la puerta B. Publicar solo si te lo pido; si no, cosecha escenas para la biblioteca con video:cosechar.",
};

/** The message to paste in a new chat, and the effort to open it with. */
export function nextChat(dir: string, state: PieceState): { phase: Phase; effort: string; message: string } {
  const phase = phaseOf(state);
  const piece = basename(dir);
  const read = ["AGENTS.md", "docs/reel.md", ...(state.hasEstado ? [`content/${piece}/estado.md`] : [])].join(", ");
  const direct = state.direct ? " Jeremy delegó las puertas: no pidas aprobaciones; anótalas con su frase." : "";
  const message = `Sigue con el Reel content/${piece}. Lee ${read}, y nada más de chats anteriores. ${NEXT[phase]}${direct} Antes de cerrar, actualiza estado.md con la fase, el paso siguiente y lo que decidí.`;
  return { phase, effort: EFFORT[phase], message };
}
