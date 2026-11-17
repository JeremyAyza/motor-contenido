import { defineVideo } from "@motor/video";
import { World } from "./world.tsx";
import { Aprender } from "./scenes/aprender.tsx";
import { Capas } from "./scenes/capas.tsx";
import { Cierre } from "./scenes/cierre.tsx";
import { Clasificar } from "./scenes/clasificar.tsx";
import { Cnn } from "./scenes/cnn.tsx";
import { Cta } from "./scenes/cta.tsx";
import { Detectar } from "./scenes/detectar.tsx";
import { Detectores } from "./scenes/detectores.tsx";
import { Ejemplos } from "./scenes/ejemplos.tsx";
import { Entrenar } from "./scenes/entrenar.tsx";
import { Filtro } from "./scenes/filtro.tsx";
import { Gancho } from "./scenes/gancho.tsx";
import { Galeria } from "./scenes/galeria.tsx";
import { Lenguaje } from "./scenes/lenguaje.tsx";
import { Pixeles } from "./scenes/pixeles.tsx";
import { Pregunta } from "./scenes/pregunta.tsx";
import { Reglas } from "./scenes/reglas.tsx";
import { Rostros } from "./scenes/rostros.tsx";
import { Segmentar } from "./scenes/segmentar.tsx";
import { Video } from "./scenes/video.tsx";

/*
 * Visión por computadora, explicada: a paraphrased replica of a
 * @rick.theengineer Reel (152.5 s), with the account's brand and avatar. The
 * whole video happens inside "vista-máquina", a dark vision app whose tabs
 * light up chapter by chapter (world.tsx); the avatar stands at the bottom
 * left, where Rick stands. Photos are generated with Gemini by agy (Jeremy's
 * gate A); pixel grids, edge maps and color maps are computed from them.
 * The meter counts the labeled images the network has seen, the referent's
 * training counter.
 */
export default defineVideo({
  voice: { tempo: 1.3 },
  captions: "pill",
  stage: { World, drift: 0, sfx: false },
  avatar: { size: 240 },
  meter: {
    kind: "counter",
    start: 0,
    steps: [
      { scene: "ejemplos", word: "millones", value: 263616 },
      { scene: "entrenar", word: "millones", value: 361264 },
    ],
  },
  scenes: [
    { id: "gancho", hold: 0.4, camera: { focus: { x: 270, y: 427 }, zoom: 1 }, Visual: Gancho, sfx: [{ asset: "pop", at: "telefono", volume: 0.25 }, { asset: "blip", at: "galeria", volume: 0.2 }, { asset: "golpe", at: "rojo", volume: 0.3 }] },
    { id: "pregunta", Visual: Pregunta, sfx: [{ asset: "whoosh", at: 0.05, volume: 0.2 }, { asset: "golpe", at: "computadora", volume: 0.25 }] },
    { id: "pixeles", Visual: Pixeles, drop: "millones", sfx: [{ asset: "blip", at: "grilla", volume: 0.2 }, { asset: "pop", at: "rojo", volume: 0.2 }, { asset: "golpe", at: "millones", volume: 0.3 }] },
    { id: "reglas", Visual: Reglas, sfx: [{ asset: "click", at: "reglas", volume: 0.2 }, { asset: "golpe", at: "punto", volume: 0.3 }] },
    { id: "ejemplos", Visual: Ejemplos, sfx: [{ asset: "whoosh", at: "aprendizaje", volume: 0.2 }, { asset: "pop", at: "perro", volume: 0.2 }, { asset: "pop", at: "gato", volume: 0.2 }, { asset: "pop", at: "auto", volume: 0.2 }] },
    { id: "cnn", Visual: Cnn, sfx: [{ asset: "golpe", at: "cnn", volume: 0.25 }, { asset: "blip", at: "filtros", volume: 0.2 }, { asset: "pop", at: "tres", volume: 0.2 }] },
    { id: "filtro", Visual: Filtro, sfx: [{ asset: "click", at: "desliza", volume: 0.2 }, { asset: "golpe", at: "alto", volume: 0.3 }] },
    { id: "detectores", Visual: Detectores, sfx: [{ asset: "whoosh", at: "bordes", volume: 0.2 }, { asset: "whoosh", at: "color", volume: 0.2 }, { asset: "whoosh", at: "textura", volume: 0.2 }] },
    { id: "capas", Visual: Capas, sfx: [{ asset: "blip", at: "primeras", volume: 0.2 }, { asset: "pop", at: "pelaje", volume: 0.2 }, { asset: "pop", at: "caras", volume: 0.2 }] },
    { id: "aprender", Visual: Aprender, sfx: [{ asset: "blip", at: "azar", volume: 0.2 }, { asset: "golpe", at: "auto", volume: 0.3 }] },
    { id: "entrenar", Visual: Entrenar, sfx: [{ asset: "click", at: "medimos", volume: 0.2 }, { asset: "switch", at: "solos", volume: 0.25 }] },
    { id: "clasificar", Visual: Clasificar, drop: "noventa", sfx: [{ asset: "golpe", at: "clasificar", volume: 0.3 }] },
    { id: "galeria", Visual: Galeria, sfx: [{ asset: "click", at: 0.1, volume: 0.2 }, { asset: "pop", at: "perro", volume: 0.25 }] },
    { id: "detectar", Visual: Detectar, sfx: [{ asset: "blip", at: "peaton", volume: 0.2 }, { asset: "blip", at: "semaforo", volume: 0.2 }] },
    { id: "segmentar", Visual: Segmentar, sfx: [{ asset: "whoosh", at: "pixel", volume: 0.2 }, { asset: "whoosh", at: "videollamada", volume: 0.2 }, { asset: "pop", at: "tumor", volume: 0.2 }] },
    { id: "rostros", Visual: Rostros, sfx: [{ asset: "blip", at: "lista", volume: 0.2 }, { asset: "pop", at: "cerca", volume: 0.2 }, { asset: "pop", at: "lejos", volume: 0.2 }] },
    { id: "lenguaje", Visual: Lenguaje, sfx: [{ asset: "whip", at: "cortan", volume: 0.2 }, { asset: "pop", at: "palabras", volume: 0.2 }, { asset: "whoosh", at: "chatgpt", volume: 0.2 }] },
    { id: "video", Visual: Video, sfx: [{ asset: "blip", at: "tiempo", volume: 0.2 }, { asset: "click", at: "pelota", volume: 0.2 }] },
    { id: "cierre", Visual: Cierre, hold: 0.6, sfx: [{ asset: "pop", at: "numeros", volume: 0.2 }, { asset: "pop", at: "patrones", volume: 0.2 }, { asset: "pop", at: "predecir", volume: 0.2 }, { asset: "whoosh", at: "calle", volume: 0.2 }, { asset: "golpe", at: "semaforo", volume: 0.25 }] },
    { id: "cta", Visual: Cta, hold: 1.0, sfx: [{ asset: "pop", at: "comentarios", volume: 0.25 }, { asset: "click", at: "tema", volume: 0.2 }] },
  ],
});
