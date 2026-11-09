import { defineVideo } from "@motor/video";
import { World } from "./world.tsx";
import { AMano } from "./scenes/a-mano.tsx";
import { Android } from "./scenes/android.tsx";
import { App } from "./scenes/app.tsx";
import { Cierre } from "./scenes/cierre.tsx";
import { Cta } from "./scenes/cta.tsx";
import { Gancho } from "./scenes/gancho.tsx";
import { Menu } from "./scenes/menu.tsx";
import { Peticion } from "./scenes/peticion.tsx";
import { PorDentro } from "./scenes/por-dentro.tsx";
import { Pregunta } from "./scenes/pregunta.tsx";
import { Problema } from "./scenes/problema.tsx";
import { Repaso } from "./scenes/repaso.tsx";
import { Respuesta } from "./scenes/respuesta.tsx";
import { Sdk } from "./scenes/sdk.tsx";
import { Sigla } from "./scenes/sigla.tsx";
import { UnaFuncion } from "./scenes/una-funcion.tsx";

/*
 * API vs SDK, a paraphrased replica of @rick.theengineer's Reel (101.5 s)
 * with OpenAI in place of Stripe: the same blocks in the same order, on his
 * light canvas with the API | SDK switch (world.tsx). The meter counts the
 * lines you write by hand: 35 at the hook, 1 when the SDK takes over. The
 * avatar stands where Rick does, in his four moments, plus the close it asks in.
 */
export default defineVideo({
  voice: { tempo: 1.25 },
  captions: "pill",
  stage: { World, drift: 0, sfx: false },
  avatar: { scenes: [] },
  meter: {
    kind: "counter",
    start: 35,
    steps: [{ scene: "una-funcion", word: "función", value: 1 }],
  },
  scenes: [
    // The world is the canvas itself, 1:1 and full bleed like Rick's grounds: the view center is (270, 427).
    { id: "gancho", tone: "invert", camera: { focus: { x: 270, y: 427 }, zoom: 1 }, Visual: Gancho, sfx: [{ asset: "pop", at: "API", volume: 0.35 }, { asset: "golpe", at: "adentro", volume: 0.35 }, { asset: "whip", at: "parecido", volume: 0.3 }, { asset: "pop", at: "pero", volume: 0.3 }] },
    { id: "app", Visual: App, avatar: { from: "left", at: 0.3 }, sfx: [{ asset: "click", at: "chat", volume: 0.4 }, { asset: "pop", at: "entrenar", volume: 0.25 }, { asset: "blip", at: "OpenAI", volume: 0.35 }] },
    { id: "pregunta", Visual: Pregunta, sfx: [{ asset: "whoosh", at: 0.05, volume: 0.25 }, { asset: "switch", at: "API", volume: 0.4 }] },
    { id: "sigla", Visual: Sigla, sfx: [{ asset: "blip", at: "Interfaz", volume: 0.3 }, { asset: "page-turn", at: "contrato", volume: 0.35 }] },
    { id: "menu", Visual: Menu, avatar: { from: "left", at: "carta", until: "cocina" }, sfx: [{ asset: "page-turn", at: 0.1, volume: 0.35 }, { asset: "blip", at: "pedir", volume: 0.3 }, { asset: "whoosh", at: "cocina", volume: 0.25 }] },
    { id: "peticion", Visual: Peticion, sfx: [{ asset: "whoosh", at: "petición", volume: 0.3 }, { asset: "blip", at: "dirección", volume: 0.3 }, { asset: "click", at: "clave", volume: 0.4 }] },
    { id: "respuesta", Visual: Respuesta, sfx: [{ asset: "pop", at: "responde", volume: 0.35 }, { asset: "blip", at: "output", volume: 0.3 }] },
    { id: "problema", tone: "invert", Visual: Problema, avatar: { from: "left", at: "problema" }, sfx: [{ asset: "whip", at: 0.05, volume: 0.3 }, { asset: "blip", at: "mano", volume: 0.3 }] },
    { id: "a-mano", tone: "invert", Visual: AMano, sfx: [{ asset: "golpe", at: "429", volume: 0.35 }, { asset: "golpe", at: "red", volume: 0.35 }] },
    { id: "sdk", tone: "invert", Visual: Sdk, sfx: [{ asset: "golpe", at: "SDK", volume: 0.4 }, { asset: "switch", at: "caja", volume: 0.35 }, { asset: "pop", at: "librerías", volume: 0.25 }, { asset: "pop", at: "documentación", volume: 0.25 }] },
    { id: "una-funcion", Visual: UnaFuncion, drop: "función", sfx: [{ asset: "golpe", at: "función", volume: 0.4 }, { asset: "blip", at: "output", volume: 0.3 }] },
    { id: "por-dentro", Visual: PorDentro, sfx: [{ asset: "blip", at: "petición", volume: 0.3 }, { asset: "pop", at: "API", volume: 0.3 }] },
    { id: "android", Visual: Android, sfx: [{ asset: "whip", at: 0.05, volume: 0.3 }, { asset: "pop", at: "Android", volume: 0.3 }, { asset: "blip", at: "emulador", volume: 0.3 }, { asset: "blip", at: "adb", volume: 0.3 }] },
    { id: "repaso", Visual: Repaso, avatar: { from: "left", at: 0.3 }, sfx: [{ asset: "pop", at: "SDK", volume: 0.3 }, { asset: "blip", at: "rápido", volume: 0.25 }] },
    { id: "cierre", Visual: Cierre, hold: 0.4, sfx: [{ asset: "golpe", at: "adentro", volume: 0.4 }, { asset: "blip", at: "especificación", volume: 0.3 }] },
    { id: "cta", Visual: Cta, hold: 1.2, avatar: { from: "left", at: "Sígueme" }, sfx: [{ asset: "click", at: "guarda", volume: 0.4 }, { asset: "pop", at: "OpenAI", volume: 0.25 }, { asset: "pop", at: "Mercado", volume: 0.25 }] },
  ],
});
