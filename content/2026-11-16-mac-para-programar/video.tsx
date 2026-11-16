import { defineVideo } from "@motor/video";
import { World } from "./world.tsx";
import { Chip } from "./scenes/chip.tsx";
import { Cierre } from "./scenes/cierre.tsx";
import { Contras } from "./scenes/contras.tsx";
import { Control } from "./scenes/control.tsx";
import { Docker } from "./scenes/docker.tsx";
import { Experiencia } from "./scenes/experiencia.tsx";
import { Gancho } from "./scenes/gancho.tsx";
import { Gusto } from "./scenes/gusto.tsx";
import { Linux } from "./scenes/linux.tsx";
import { Modelo } from "./scenes/modelo.tsx";
import { Terminal } from "./scenes/terminal.tsx";
import { Unix } from "./scenes/unix.tsx";
import { Vatio } from "./scenes/vatio.tsx";
import { Windows } from "./scenes/windows.tsx";
import { Wsl } from "./scenes/wsl.tsx";
import { Xcode } from "./scenes/xcode.tsx";

/*
 * Por qué tantos programadores prefieren Mac, a paraphrased replica of
 * @rick.theengineer's Reel (158.8 s): the same chapters in the same order,
 * inside his dark macOS desktop (world.tsx), without any of his fighting-game
 * framing (Jeremy's gate A). The meter counts the Mac's five reasons, the ones
 * the mental model lists at the end. The avatar stands where Rick does, all video long.
 */
export default defineVideo({
  voice: { tempo: 1.33 },
  captions: "marker",
  stage: { World, drift: 0, sfx: false },
  avatar: {},
  meter: {
    kind: "slots",
    max: 5,
    start: 0,
    steps: [
      { scene: "unix", word: "unix", value: 1 },
      { scene: "chip", word: "hardware", value: 2 },
      { scene: "vatio", word: "bateria", value: 3 },
      { scene: "xcode", word: "ecosistema", value: 4 },
      { scene: "experiencia", word: "experiencia", value: 5 },
    ],
  },
  scenes: [
    // The world is the canvas itself, 1:1 and full bleed: the view center is (270, 427).
    { id: "gancho", camera: { focus: { x: 270, y: 427 }, zoom: 1 }, Visual: Gancho, sfx: [{ asset: "pop", at: "startup", volume: 0.25 }, { asset: "golpe", at: "pero", volume: 0.3 }] },
    { id: "unix", Visual: Unix, sfx: [{ asset: "blip", at: "construido", volume: 0.25 }, { asset: "whoosh", at: "linux", volume: 0.2 }, { asset: "pop", at: "backends", volume: 0.2 }, { asset: "pop", at: "docker", volume: 0.2 }] },
    { id: "terminal", Visual: Terminal, sfx: [{ asset: "click", at: "ssh", volume: 0.25 }, { asset: "click", at: "git", volume: 0.25 }, { asset: "pop", at: "python", volume: 0.2 }] },
    { id: "wsl", Visual: Wsl, sfx: [{ asset: "pop", at: "subsistema", volume: 0.25 }, { asset: "whoosh", at: "pero", volume: 0.2 }] },
    { id: "chip", Visual: Chip, sfx: [{ asset: "whoosh", at: "hardware", volume: 0.2 }, { asset: "blip", at: "cpu", volume: 0.2 }, { asset: "blip", at: "graficos", volume: 0.2 }] },
    { id: "vatio", Visual: Vatio, sfx: [{ asset: "pop", at: "vatio", volume: 0.25 }, { asset: "blip", at: "ide", volume: 0.2 }, { asset: "switch", at: "bateria", volume: 0.3 }] },
    { id: "xcode", Visual: Xcode, sfx: [{ asset: "pop", at: "iphone", volume: 0.25 }, { asset: "blip", at: "solo", volume: 0.2 }, { asset: "blip", at: "plataformas", volume: 0.2 }] },
    { id: "experiencia", Visual: Experiencia, sfx: [{ asset: "pop", at: "apps", volume: 0.2 }, { asset: "pop", at: "jetbrains", volume: 0.2 }, { asset: "blip", at: "fluido", volume: 0.2 }] },
    { id: "gusto", Visual: Gusto, sfx: [{ asset: "pop", at: "gusta", volume: 0.25 }, { asset: "blip", at: "trackpad", volume: 0.2 }, { asset: "blip", at: "pantalla", volume: 0.2 }] },
    { id: "control", Visual: Control, sfx: [{ asset: "click", at: "controla", volume: 0.25 }, { asset: "pop", at: "encaja", volume: 0.2 }] },
    { id: "contras", Visual: Contras, sfx: [{ asset: "golpe", at: "cara", volume: 0.3 }, { asset: "blip", at: "nativo", volume: 0.2 }] },
    { id: "docker", Visual: Docker, sfx: [{ asset: "click", at: "kernel", volume: 0.25 }, { asset: "whoosh", at: "maquina", volume: 0.2 }] },
    { id: "windows", Visual: Windows, sfx: [{ asset: "whoosh", at: 0.05, volume: 0.2 }, { asset: "blip", at: "net", volume: 0.2 }, { asset: "pop", at: "wsl", volume: 0.25 }] },
    { id: "linux", Visual: Linux, sfx: [{ asset: "whip", at: 0.05, volume: 0.2 }, { asset: "blip", at: "servidores", volume: 0.2 }] },
    { id: "modelo", Visual: Modelo, sfx: [{ asset: "blip", at: "unix", volume: 0.2 }, { asset: "blip", at: "ecosistema", volume: 0.2 }, { asset: "golpe", at: "todos", volume: 0.25 }] },
    { id: "cierre", Visual: Cierre, hold: 1.2, sfx: [{ asset: "pop", at: "mejor", volume: 0.2 }, { asset: "moneda", at: "tres", volume: 0.25 }, { asset: "click", at: "guardalo", volume: 0.35 }, { asset: "whoosh", at: "enviaselo", volume: 0.25 }] },
  ],
});
