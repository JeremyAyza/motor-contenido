import { defineVideo } from "@motor/video";
import { World } from "./world.tsx";
import { Aislar } from "./scenes/aislar.tsx";
import { Arbol } from "./scenes/arbol.tsx";
import { Archivos } from "./scenes/archivos.tsx";
import { Cierre } from "./scenes/cierre.tsx";
import { Falla } from "./scenes/falla.tsx";
import { Gancho } from "./scenes/gancho.tsx";
import { Harness } from "./scenes/harness.tsx";
import { Humanos } from "./scenes/humanos.tsx";
import { Modelo } from "./scenes/modelo.tsx";
import { Pixeles } from "./scenes/pixeles.tsx";
import { Salida } from "./scenes/salida.tsx";
import { Tuberias } from "./scenes/tuberias.tsx";

/*
 * Agentes y Linux: a paraphrased replica of @rick.theengineer's Reel on why AI
 * agents love Linux (137 s), on the world of 2026-11-17-que-es-linux (Jeremy's
 * gate A): a phosphor-green console over a grid floor with a low horizon, a
 * HUD line with the chapter, the model as Rick's pixel invader and a terminal
 * on the floor in almost every scene. The hook is about the agents, not Linux,
 * on Rick's magenta backdrop. The avatar stands where Rick does, from the
 * first chapter to the close. Our violet marks what matters.
 */
export default defineVideo({
  voice: { tempo: 1.36 },
  captions: "highlight",
  stage: { World, drift: 0, sfx: false },
  avatar: { scenes: ["humanos", "modelo", "harness", "pixeles", "falla", "tuberias", "arbol", "archivos", "salida", "aislar", "cierre"] },
  meter: {
    kind: "slots",
    max: 7,
    start: 0,
    steps: [
      { scene: "pixeles", word: "entero", value: 1 },
      { scene: "falla", word: "terminal", value: 2 },
      { scene: "tuberias", word: "tuberías", value: 3 },
      { scene: "arbol", word: "raíz", value: 4 },
      { scene: "archivos", word: "archivos", value: 5 },
      { scene: "salida", word: "salida", value: 6 },
      { scene: "aislar", word: "aislar", value: 7 },
    ],
  },
  scenes: [
    { id: "gancho", Visual: Gancho, sfx: [{ asset: "golpe", at: "mouse", volume: 0.25 }, { asset: "pop", at: "Claude", volume: 0.2 }, { asset: "pop", at: "Codex", volume: 0.2 }, { asset: "pop", at: "Gemini", volume: 0.2 }, { asset: "whoosh", at: "Linux", volume: 0.25 }] },
    { id: "humanos", Visual: Humanos, hold: 1, sfx: [{ asset: "click", at: "clic", volume: 0.25 }, { asset: "switch", at: "otra", volume: 0.2 }] },
    { id: "modelo", Visual: Modelo, sfx: [{ asset: "whip", at: "teclado", volume: 0.2 }, { asset: "golpe", at: "harness", volume: 0.2 }, { asset: "blip", at: "bash", volume: 0.15 }, { asset: "blip", at: "editar", volume: 0.15 }] },
    { id: "harness", Visual: Harness, sfx: [{ asset: "click", at: "pedido", volume: 0.2 }, { asset: "whoosh", at: "ejecuta", volume: 0.2 }, { asset: "whoosh", at: "devuelve", volume: 0.2 }] },
    { id: "pixeles", Visual: Pixeles, sfx: [{ asset: "click", at: "clic", volume: 0.25 }, { asset: "blip", at: "idioma", volume: 0.15 }, { asset: "golpe", at: "Linux", volume: 0.25 }] },
    { id: "falla", Visual: Falla, sfx: [{ asset: "golpe", at: "cae", volume: 0.25 }, { asset: "switch", at: "terminal", volume: 0.2 }, { asset: "blip", at: "grep", volume: 0.15 }, { asset: "blip", at: "git", volume: 0.15 }] },
    { id: "tuberias", Visual: Tuberias, sfx: [{ asset: "whoosh", at: "tuberías", volume: 0.2 }, { asset: "blip", at: "cat", volume: 0.15 }, { asset: "blip", at: "tail", volume: 0.15 }] },
    { id: "arbol", Visual: Arbol, sfx: [{ asset: "switch", at: "raíz", volume: 0.25 }, { asset: "blip", at: "etc", volume: 0.15 }, { asset: "blip", at: "home", volume: 0.15 }, { asset: "whoosh", at: "máquinas", volume: 0.2 }] },
    { id: "archivos", Visual: Archivos, sfx: [{ asset: "pop", at: "procesador", volume: 0.2 }, { asset: "pop", at: "memoria", volume: 0.2 }, { asset: "pop", at: "procesos", volume: 0.2 }] },
    { id: "salida", Visual: Salida, sfx: [{ asset: "golpe", at: "salida", volume: 0.25 }, { asset: "click", at: "corrige", volume: 0.2 }, { asset: "whoosh", at: "actúa", volume: 0.2 }] },
    { id: "aislar", Visual: Aislar, sfx: [{ asset: "whip", at: "sueltos", volume: 0.2 }, { asset: "golpe", at: "sellado", volume: 0.25 }, { asset: "whoosh", at: "tira", volume: 0.25 }] },
    { id: "cierre", Visual: Cierre, hold: 2, sfx: [{ asset: "whoosh", at: "necesitan", volume: 0.25 }, { asset: "pop", at: "Comenta", volume: 0.25 }] },
  ],
});
