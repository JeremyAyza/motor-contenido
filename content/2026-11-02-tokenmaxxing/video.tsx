import { defineVideo } from "@motor/video";
import { World } from "./world.tsx";
import { Agente } from "./scenes/agente.tsx";
import { Cierre } from "./scenes/cierre.tsx";
import { Cuentas } from "./scenes/cuentas.tsx";
import { Dos } from "./scenes/dos.tsx";
import { Engana } from "./scenes/engana.tsx";
import { Escenarios } from "./scenes/escenarios.tsx";
import { Gancho } from "./scenes/gancho.tsx";
import { Masivo } from "./scenes/masivo.tsx";
import { Maxxing } from "./scenes/maxxing.tsx";
import { Modelo } from "./scenes/modelo.tsx";
import { Otrolado } from "./scenes/otrolado.tsx";
import { Paradoja } from "./scenes/paradoja.tsx";
import { Pregunta } from "./scenes/pregunta.tsx";
import { Preguntareal } from "./scenes/preguntareal.tsx";
import { Supuesto } from "./scenes/supuesto.tsx";
import { Tablas } from "./scenes/tablas.tsx";
import { Token } from "./scenes/token.tsx";
import { Vueltas } from "./scenes/vueltas.tsx";

/*
 * Tokenmaxxing, a paraphrased replica of @rick.theengineer's Reel (170 s):
 * the same blocks in the same order, inside a two-player arcade cabinet.
 * FICHAS (the world's marquee) burns; ENTREGADO (the meter) barely moves
 * until the table is sorted by it. Tempo 1.25 brings the voice to the
 * reference's length and under the 180 s of the long format (at 1.2 it ran
 * 186 s; docs/reel.md allows up to 1.4 for a long replica).
 */
export default defineVideo({
  voice: { tempo: 1.25 },
  captions: "highlight",
  chapters: true,
  // The camera holds zoom 1 centered on the band (y 427), so world px are screen px: the marquee is a HUD.
  stage: { World, drift: 0, sfx: false },
  meter: {
    kind: "counter",
    start: 0,
    steps: [
      { scene: "escenarios", word: "misma", value: 1 },
      { scene: "otrolado", word: "documentar", value: 2, ramp: 1 },
      { scene: "otrolado", word: "viejo", value: 3, ramp: 1 },
      { scene: "otrolado", word: "refactorizar", value: 4, ramp: 1 },
      { scene: "otrolado", word: "pruebas", value: 5, ramp: 1 },
    ],
  },
  scenes: [
    { id: "gancho", chapter: "La moda", camera: { focus: { x: 270, y: 427 }, zoom: 1 }, Visual: Gancho, sfx: [{ asset: "moneda", at: 0.05, volume: 0.35 }, { asset: "caja-registradora", at: "Millones", volume: 0.3 }, { asset: "golpe", at: "miles", volume: 0.4 }] },
    { id: "tablas", chapter: "La moda", Visual: Tablas, sfx: [{ asset: "page-turn", at: 0.1, volume: 0.3 }, { asset: "blip", at: "ochenta", volume: 0.3 }, { asset: "caja-registradora", at: "primero", volume: 0.35 }] },
    { id: "pregunta", chapter: "La pregunta", Visual: Pregunta, hold: 0.4, sfx: [{ asset: "pop", at: "gastar", volume: 0.3 }, { asset: "switch", at: "cero", volume: 0.4 }] },
    { id: "token", chapter: "Nivel 1", Visual: Token, sfx: [{ asset: "blip", at: 0.05, volume: 0.35 }, { asset: "click", at: "pedazos", volume: 0.4 }, { asset: "pop", at: "palabra", volume: 0.25 }] },
    { id: "modelo", chapter: "Nivel 1", Visual: Modelo, sfx: [{ asset: "moneda", at: "lee", volume: 0.3 }, { asset: "moneda", at: "responde", volume: 0.3 }, { asset: "caja-registradora", at: "texto", volume: 0.3 }] },
    { id: "agente", chapter: "Nivel 2", Visual: Agente, sfx: [{ asset: "blip", at: 0.05, volume: 0.35 }, { asset: "click", at: "pides", volume: 0.35 }, { asset: "whoosh", at: "ciclo", volume: 0.25 }] },
    { id: "vueltas", chapter: "Nivel 2", Visual: Vueltas, sfx: [{ asset: "moneda", at: "llamada", volume: 0.3 }, { asset: "click", at: "Ahora", volume: 0.35 }, { asset: "caja-registradora", at: "dispara", volume: 0.35 }] },
    { id: "maxxing", chapter: "Nivel 3", Visual: Maxxing, sfx: [{ asset: "blip", at: 0.05, volume: 0.35 }, { asset: "golpe", at: 1.6, volume: 0.35 }, { asset: "whip", at: "máximo", volume: 0.3 }] },
    { id: "masivo", chapter: "Nivel 3", Visual: Masivo, sfx: [{ asset: "moneda", at: "Meta", volume: 0.3 }, { asset: "moneda", at: "OpenAI", volume: 0.3 }, { asset: "moneda", at: "Shopify", volume: 0.3 }, { asset: "moneda", at: "Nvidia", volume: 0.3 }] },
    { id: "supuesto", chapter: "Nivel 3", Visual: Supuesto, sfx: [{ asset: "blip", at: "medir", volume: 0.25 }, { asset: "golpe", at: "mismo", volume: 0.4 }] },
    { id: "dos", chapter: "2 jugadores", Visual: Dos, sfx: [{ asset: "whip", at: 0.1, volume: 0.3 }, { asset: "caja-registradora", at: "cincuenta", volume: 0.3 }] },
    { id: "escenarios", chapter: "2 jugadores", Visual: Escenarios, sfx: [{ asset: "golpe", at: "excelente", volume: 0.35 }, { asset: "click", at: "O", volume: 0.35 }, { asset: "golpe", at: "funcionó", volume: 0.35 }, { asset: "golpe", at: "misma", volume: 0.35 }] },
    { id: "engana", chapter: "2 jugadores", Visual: Engana, hold: 0.3, sfx: [{ asset: "golpe", at: "engañar", volume: 0.4 }, { asset: "pop", at: "Jellyfish", volume: 0.3 }] },
    { id: "otrolado", chapter: "El otro lado", Visual: Otrolado, sfx: [{ asset: "switch", at: 0.05, volume: 0.3 }, { asset: "pop", at: "documentar", volume: 0.25 }, { asset: "pop", at: "pruebas", volume: 0.25 }] },
    { id: "preguntareal", chapter: "La prueba", Visual: Preguntareal, sfx: [{ asset: "golpe", at: "malo", volume: 0.3 }, { asset: "click", at: "Funciona", volume: 0.35 }, { asset: "click", at: "Cuánto", volume: 0.35 }] },
    { id: "cuentas", chapter: "La prueba", Visual: Cuentas, sfx: [{ asset: "golpe", at: "buena", volume: 0.35 }, { asset: "golpe", at: "probablemente", volume: 0.4 }] },
    { id: "paradoja", chapter: "La paradoja", Visual: Paradoja, sfx: [{ asset: "moneda", at: "quemar", volume: 0.3 }] },
    { id: "cierre", chapter: "La tabla", Visual: Cierre, hold: 1.2, sfx: [{ asset: "switch", at: "convertirlos", volume: 0.4 }, { asset: "click", at: "Mándaselo", volume: 0.45 }] },
  ],
});
