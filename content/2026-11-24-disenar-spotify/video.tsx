import { defineVideo } from "@motor/video";
import { World } from "./world.tsx";
import { Almacenamiento } from "./scenes/almacenamiento.tsx";
import { Buffer } from "./scenes/buffer.tsx";
import { Busqueda } from "./scenes/busqueda.tsx";
import { Cdn } from "./scenes/cdn.tsx";
import { Cierre } from "./scenes/cierre.tsx";
import { Estado } from "./scenes/estado.tsx";
import { Gancho } from "./scenes/gancho.tsx";
import { Lotes } from "./scenes/lotes.tsx";
import { Mapa } from "./scenes/mapa.tsx";
import { Medianoche } from "./scenes/medianoche.tsx";
import { Play } from "./scenes/play.tsx";
import { Recomendaciones } from "./scenes/recomendaciones.tsx";

/*
 * Diseñar Spotify: a paraphrased replica of @rick.theengineer's "Let's design
 * Spotify" (174 s). His look: a near-black console with a green glow, a HUD
 * with the section, the step and a rail of systems that light up, one object
 * at a time with tiny mono labels, condensed white titles beside the
 * presenter, and pill captions. Ours: the avatar where Rick stands, generated
 * covers instead of real album art (Jeremy's gate A), Duki and Bizarrap as the
 * examples, and our violet for the meter and the closing debate.
 */
export default defineVideo({
  voice: { tempo: 1.26 },
  captions: "pill",
  stage: { World, drift: 0, sfx: false },
  avatar: {},
  meter: {
    kind: "slots",
    max: 6,
    start: 0,
    steps: [
      { scene: "almacenamiento", word: "guardar", value: 1 },
      { scene: "cdn", word: "CDN", value: 2 },
      { scene: "busqueda", word: "índice", value: 3 },
      { scene: "recomendaciones", word: "sistema", value: 4 },
      { scene: "lotes", word: "lote", value: 5 },
      { scene: "estado", word: "distribuidas", value: 6 },
    ],
  },
  scenes: [
    { id: "gancho", Visual: Gancho, sfx: [{ asset: "whoosh", at: "buscas", volume: 0.2 }, { asset: "click", at: "tocas", volume: 0.25 }, { asset: "golpe", at: "detrás", volume: 0.2 }] },
    { id: "almacenamiento", Visual: Almacenamiento, sfx: [{ asset: "pop", at: "calidades", volume: 0.2 }, { asset: "whoosh", at: "sube", volume: 0.2 }, { asset: "blip", at: "bajo", volume: 0.15 }, { asset: "blip", at: "alto", volume: 0.15 }, { asset: "golpe", at: "Todos", volume: 0.2 }] },
    { id: "play", Visual: Play, sfx: [{ asset: "click", at: "tocas", volume: 0.25 }, { asset: "blip", at: "quién", volume: 0.15 }, { asset: "blip", at: "país", volume: 0.15 }, { asset: "golpe", at: "transmitir", volume: 0.25 }] },
    { id: "cdn", Visual: Cdn, sfx: [{ asset: "whoosh", at: "cerca", volume: 0.2 }, { asset: "switch", at: "caminos", volume: 0.2 }] },
    { id: "buffer", Visual: Buffer, sfx: [{ asset: "whoosh", at: "descarga", volume: 0.2 }, { asset: "switch", at: "conexión", volume: 0.2 }, { asset: "blip", at: "menor", volume: 0.15 }] },
    { id: "busqueda", Visual: Busqueda, sfx: [{ asset: "pop", at: "Duki", volume: 0.2 }, { asset: "golpe", at: "normal", volume: 0.25 }, { asset: "blip", at: "nombres", volume: 0.15 }, { asset: "blip", at: "palabras", volume: 0.15 }] },
    { id: "recomendaciones", Visual: Recomendaciones, sfx: [{ asset: "pop", at: "Descubrimiento", volume: 0.2 }, { asset: "whoosh", at: "sistema", volume: 0.2 }] },
    { id: "lotes", Visual: Lotes, sfx: [{ asset: "pop", at: "historial", volume: 0.15 }, { asset: "pop", at: "playlists", volume: 0.15 }, { asset: "switch", at: "calcula", volume: 0.2 }, { asset: "golpe", at: "demasiado", volume: 0.2 }] },
    { id: "medianoche", Visual: Medianoche, hold: 0.6, sfx: [{ asset: "golpe", at: "medianoche", volume: 0.25 }, { asset: "whoosh", at: "caché", volume: 0.2 }, { asset: "golpe", at: "central", volume: 0.2 }] },
    { id: "estado", Visual: Estado, sfx: [{ asset: "click", at: "Pausas", volume: 0.25 }, { asset: "whoosh", at: "celular", volume: 0.2 }, { asset: "pop", at: "bases", volume: 0.2 }] },
    { id: "mapa", Visual: Mapa, sfx: [{ asset: "blip", at: "almacenamiento", volume: 0.15 }, { asset: "blip", at: "CDN", volume: 0.15 }, { asset: "blip", at: "índice", volume: 0.15 }, { asset: "blip", at: "recomendador", volume: 0.15 }, { asset: "blip", at: "bases", volume: 0.15 }, { asset: "blip", at: "procesos", volume: 0.15 }] },
    { id: "cierre", Visual: Cierre, hold: 2, sfx: [{ asset: "whoosh", at: "millones", volume: 0.2 }, { asset: "pop", at: "listas", volume: 0.25 }, { asset: "pop", at: "Comenta", volume: 0.25 }] },
  ],
});
