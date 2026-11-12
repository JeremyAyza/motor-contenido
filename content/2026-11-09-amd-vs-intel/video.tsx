import { defineVideo } from "@motor/video";
import { World } from "./world.tsx";
import { Bytes } from "./scenes/bytes.tsx";
import { Cache } from "./scenes/cache.tsx";
import { Chiplets } from "./scenes/chiplets.tsx";
import { Cta } from "./scenes/cta.tsx";
import { Distintos } from "./scenes/distintos.tsx";
import { Elegir } from "./scenes/elegir.tsx";
import { Ensamblado } from "./scenes/ensamblado.tsx";
import { Fabric } from "./scenes/fabric.tsx";
import { Fabrica } from "./scenes/fabrica.tsx";
import { Gancho } from "./scenes/gancho.tsx";
import { Hibrido } from "./scenes/hibrido.tsx";
import { Hilos } from "./scenes/hilos.tsx";
import { Modelo } from "./scenes/modelo.tsx";
import { Moraleja } from "./scenes/moraleja.tsx";
import { Obleas } from "./scenes/obleas.tsx";
import { Silicio } from "./scenes/silicio.tsx";
import { Tiles } from "./scenes/tiles.tsx";
import { Transistores } from "./scenes/transistores.tsx";
import { Vcache } from "./scenes/vcache.tsx";
import { X86 } from "./scenes/x86.tsx";

/*
 * AMD contra Intel, a paraphrased replica of @rick.theengineer's Reel (147.5 s):
 * the same seven chapters in the same order, on his near-black technical sheet
 * with a chapter label (world.tsx), and flat chips instead of his 3D renders
 * (Jeremy chose flat). The meter counts the differences the video opens up:
 * chiplets, tiles, threads and stacked cache. The avatar stands where Rick
 * does, in his nine moments, plus the close it asks in.
 */
export default defineVideo({
  voice: { tempo: 1.33 },
  captions: "highlight",
  stage: { World, drift: 0, sfx: false },
  avatar: { scenes: [] },
  meter: {
    kind: "counter",
    start: 0,
    steps: [
      { scene: "chiplets", word: "chiplets", value: 1 },
      { scene: "tiles", word: "tiles", value: 2 },
      { scene: "hilos", word: "hilos", value: 3 },
      { scene: "vcache", word: "llama", value: 4 },
    ],
  },
  scenes: [
    // The world is the canvas itself, 1:1 and full bleed: the view center is (270, 427).
    { id: "gancho", camera: { focus: { x: 270, y: 427 }, zoom: 1 }, Visual: Gancho, sfx: [{ asset: "whoosh", at: "PC", volume: 0.25 }, { asset: "blip", at: "procesador", volume: 0.25 }] },
    { id: "distintos", Visual: Distintos, avatar: { from: "left", at: "cambia" }, sfx: [{ asset: "pop", at: "dentro", volume: 0.3 }, { asset: "page-turn", at: "cambia", volume: 0.3 }] },
    { id: "x86", Visual: X86, avatar: {}, sfx: [{ asset: "golpe", at: "hablan", volume: 0.3 }, { asset: "blip", at: "sumar", volume: 0.2 }, { asset: "blip", at: "saltar", volume: 0.2 }] },
    { id: "bytes", Visual: Bytes, hold: 0.4, sfx: [{ asset: "blip", at: "código", volume: 0.25 }, { asset: "whoosh", at: "programa", volume: 0.25 }, { asset: "pop", at: "AMD", volume: 0.3 }] },
    { id: "silicio", Visual: Silicio, avatar: {}, sfx: [{ asset: "whoosh", at: "cambia", volume: 0.2 }] },
    { id: "transistores", Visual: Transistores, sfx: [{ asset: "golpe", at: "miles", volume: 0.3 }, { asset: "switch", at: "interruptores", volume: 0.35 }, { asset: "pop", at: "caben", volume: 0.25 }] },
    { id: "fabrica", Visual: Fabrica, hold: 0.5, avatar: { from: "left", at: 0.3, until: "AMD" }, sfx: [{ asset: "pop", at: "diseña", volume: 0.25 }, { asset: "whip", at: "AMD", volume: 0.25 }] },
    { id: "ensamblado", Visual: Ensamblado, avatar: { from: "left", at: 0.2 }, sfx: [{ asset: "golpe", at: "tapas", volume: 0.3 }] },
    { id: "chiplets", Visual: Chiplets, sfx: [{ asset: "whoosh", at: "piezas", volume: 0.25 }, { asset: "pop", at: "uno", volume: 0.2 }, { asset: "pop", at: "dos", volume: 0.2 }, { asset: "blip", at: "memoria", volume: 0.25 }] },
    { id: "obleas", Visual: Obleas, avatar: { from: "left", at: "obleas", until: "chiplets" }, sfx: [{ asset: "blip", at: "defectos", volume: 0.25 }, { asset: "golpe", at: "arruina", volume: 0.3 }] },
    { id: "fabric", Visual: Fabric, sfx: [{ asset: "whoosh", at: "enlace", volume: 0.25 }] },
    { id: "tiles", Visual: Tiles, sfx: [{ asset: "whoosh", at: "parecido", volume: 0.25 }, { asset: "blip", at: "cómputo", volume: 0.2 }, { asset: "blip", at: "gráficos", volume: 0.2 }, { asset: "pop", at: "base", volume: 0.3 }] },
    { id: "hibrido", Visual: Hibrido, avatar: { from: "left", at: 0.3 }, sfx: [{ asset: "golpe", at: "pesado", volume: 0.25 }, { asset: "pop", at: "fondo", volume: 0.2 }, { asset: "click", at: "Thread", volume: 0.3 }] },
    { id: "hilos", Visual: Hilos, avatar: { until: "Intel" }, sfx: [{ asset: "blip", at: "hilos", volume: 0.2 }, { asset: "whip", at: "Intel", volume: 0.25 }] },
    { id: "cache", Visual: Cache, sfx: [{ asset: "blip", at: "caché", volume: 0.25 }, { asset: "whoosh", at: "pegadas", volume: 0.2 }] },
    { id: "vcache", Visual: Vcache, drop: "megas", avatar: { from: "left", at: 0.2, until: "apila" }, sfx: [{ asset: "golpe", at: "apila", volume: 0.35 }, { asset: "pop", at: "juegos", volume: 0.25 }, { asset: "moneda", at: "acelera", volume: 0.25 }] },
    { id: "elegir", Visual: Elegir, avatar: { from: "left", at: 0.3, until: "editar" }, sfx: [{ asset: "pop", at: "vencer", volume: 0.3 }, { asset: "pop", at: "núcleos", volume: 0.3 }, { asset: "blip", at: "laptops", volume: 0.25 }] },
    { id: "modelo", Visual: Modelo, avatar: { from: "left", at: 0.3, until: "AMD" }, sfx: [{ asset: "pop", at: "AMD", volume: 0.25 }, { asset: "pop", at: "Intel", volume: 0.25 }] },
    { id: "moraleja", Visual: Moraleja, hold: 0.6, sfx: [{ asset: "whoosh", at: 0.05, volume: 0.2 }] },
    { id: "cta", Visual: Cta, hold: 1.2, avatar: { from: "left", at: "Sígueme" }, sfx: [{ asset: "click", at: "guarda", volume: 0.4 }, { asset: "pop", at: "comentarios", volume: 0.3 }] },
  ],
});
