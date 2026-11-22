import { defineVideo } from "@motor/video";
import { World } from "./world.tsx";
import { Cierre } from "./scenes/cierre.tsx";
import { Eleccion } from "./scenes/eleccion.tsx";
import { Gancho } from "./scenes/gancho.tsx";
import { GoCompilado } from "./scenes/go-compilado.tsx";
import { Goroutines } from "./scenes/goroutines.tsx";
import { Hilos } from "./scenes/hilos.tsx";
import { Mito } from "./scenes/mito.tsx";
import { Ownership } from "./scenes/ownership.tsx";
import { Precio } from "./scenes/precio.tsx";
import { Prioridades } from "./scenes/prioridades.tsx";
import { PythonJs } from "./scenes/python-js.tsx";
import { Recolector } from "./scenes/recolector.tsx";
import { RustCompilado } from "./scenes/rust-compilado.tsx";

/*
 * Go vs Rust: a paraphrased replica of @rick.theengineer's Reel (137 s),
 * with the look of his: a charcoal slate whose top band takes the chapter's
 * color (teal for Go, rust for Rust), two lanes that fill the screen in the
 * hook, the priorities and the choice, and a fixed terminal right of the
 * presenter that measures each idea. Fewer pieces per metaphor than his
 * (Jeremy's gate A: "Mismo mundo, menos piezas"). Our violet marks the
 * database, the cache and the CTA; the avatar stands where Rick does.
 */
export default defineVideo({
  voice: { tempo: 1.26 },
  captions: "highlight",
  stage: { World, drift: 0, sfx: false },
  avatar: { size: 200, scenes: ["go-compilado", "hilos", "goroutines", "recolector", "rust-compilado", "ownership", "python-js", "mito", "cierre"] },
  meter: {
    kind: "slots",
    max: 3,
    start: 1,
    steps: [
      { scene: "cierre", word: "confiabilidad", value: 2 },
      { scene: "cierre", word: "mantenerlo.", value: 3 },
    ],
  },
  scenes: [
    // The world is drawn at the canvas's own scale: the camera stays at zoom 1, centered on the view.
    { id: "gancho", Visual: Gancho, camera: { focus: { x: 270, y: 427 }, zoom: 1 }, sfx: [{ asset: "whoosh", at: "Go", volume: 0.2 }, { asset: "pop", at: "Docker,", volume: 0.2 }, { asset: "pop", at: "Kubernetes,", volume: 0.2 }, { asset: "pop", at: "Cloudflare,", volume: 0.2 }, { asset: "pop", at: "Discord:", volume: 0.2 }] },
    { id: "go-compilado", Visual: GoCompilado, sfx: [{ asset: "blip", at: "Google", volume: 0.15 }, { asset: "golpe", at: "compilado:", volume: 0.22 }] },
    { id: "hilos", Visual: Hilos, sfx: [{ asset: "golpe", at: "hilos:", volume: 0.22 }, { asset: "pop", at: "trabajadores", volume: 0.2 }, { asset: "pop", at: "uno", volume: 0.2 }] },
    { id: "goroutines", Visual: Goroutines, sfx: [{ asset: "golpe", at: "goroutines:", volume: 0.22 }, { asset: "whoosh", at: "miles,", volume: 0.2 }, { asset: "blip", at: "servidores,", volume: 0.15 }, { asset: "blip", at: "APIs", volume: 0.15 }] },
    { id: "recolector", Visual: Recolector, sfx: [{ asset: "whoosh", at: "barre", volume: 0.2 }, { asset: "switch", at: "pausas", volume: 0.22 }] },
    { id: "rust-compilado", Visual: RustCompilado, sfx: [{ asset: "whip", at: "limpieza.", volume: 0.22 }, { asset: "golpe", at: "ownership.", volume: 0.22 }] },
    { id: "ownership", Visual: Ownership, sfx: [{ asset: "whip", at: "termina,", volume: 0.2 }, { asset: "pop", at: "prestada", volume: 0.18 }, { asset: "golpe", at: "compilador", volume: 0.22 }] },
    { id: "precio", Visual: Precio, hold: 0.4 },
    { id: "prioridades", Visual: Prioridades, sfx: [{ asset: "blip", at: "simplicidad", volume: 0.15 }, { asset: "blip", at: "control,", volume: 0.15 }] },
    { id: "python-js", Visual: PythonJs, sfx: [{ asset: "pop", at: "Python", volume: 0.18 }, { asset: "pop", at: "JavaScript?", volume: 0.18 }, { asset: "whoosh", at: "cargas", volume: 0.2 }] },
    { id: "mito", Visual: Mito, sfx: [{ asset: "golpe", at: "siempre", volume: 0.25 }, { asset: "whoosh", at: "servidor", volume: 0.2 }, { asset: "pop", at: "caché", volume: 0.22 }] },
    { id: "eleccion", Visual: Eleccion, sfx: [{ asset: "pop", at: "gran", volume: 0.2 }, { asset: "pop", at: "brilla.", volume: 0.2 }] },
    { id: "cierre", Visual: Cierre, hold: 1.4, sfx: [{ asset: "whoosh", at: "Comenta", volume: 0.25 }] },
  ],
});
