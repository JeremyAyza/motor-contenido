import { defineVideo } from "@motor/video";
import { CAM_END, CAM_Y, DESK, PATHS, WORLD, World } from "./world.tsx";
import { Cierre } from "./scenes/cierre.tsx";
import { Clave } from "./scenes/clave.tsx";
import { Cta } from "./scenes/cta.tsx";
import { Gancho } from "./scenes/gancho.tsx";
import { Hallazgo } from "./scenes/hallazgo.tsx";
import { Lideres } from "./scenes/lideres.tsx";
import { Lineas } from "./scenes/lineas.tsx";
import { Quien } from "./scenes/quien.tsx";
import { Resultado } from "./scenes/resultado.tsx";
import { Tokens } from "./scenes/tokens.tsx";

const at = (x: number) => ({ focus: { x, y: CAM_Y }, zoom: 1 });

export default defineVideo({
  captions: "highlight",
  stage: { World, width: WORLD.width, height: WORLD.height, paths: PATHS, drift: 0.03 },
  meter: {
    kind: "bar",
    max: 100,
    start: 8,
    steps: [
      { scene: "clave", word: "producto", value: 35 },
      { scene: "clave", word: "negocio", value: 55 },
      { scene: "clave", word: "clientes", value: 72 },
      { scene: "cierre", word: "cliente", value: 100 },
    ],
  },
  scenes: [
    { id: "gancho", camera: at(DESK.a), Visual: Gancho, sfx: [{ asset: "golpe", at: "valor" }, { asset: "pop", at: "ingenieros", volume: 0.3 }] },
    { id: "quien", Visual: Quien, sfx: [{ asset: "page-turn", at: 0.15 }, { asset: "golpe", at: "pública", volume: 0.35 }] },
    { id: "tokens", Visual: Tokens, sfx: [{ asset: "pop", at: 0.1, volume: 0.3 }, { asset: "moneda", at: "tokens", volume: 0.3 }, { asset: "golpe", at: "frugalidad", volume: 0.35 }] },
    { id: "lineas", Visual: Lineas, sfx: [{ asset: "pop", at: 0.1, volume: 0.3 }, { asset: "whip", at: "simplificar", volume: 0.35 }] },
    { id: "hallazgo", Visual: Hallazgo, sfx: [{ asset: "pop", at: 0.1, volume: 0.3 }, { asset: "golpe", at: "fallaste", volume: 0.35 }, { asset: "switch", at: "hallazgo", volume: 0.4 }] },
    { id: "clave", tone: "base", camera: { follow: { path: "camino", from: 0, to: 0.5 }, zoom: 1 }, Visual: Clave, sfx: [{ asset: "pop", at: "producto", volume: 0.3 }, { asset: "pop", at: "negocio", volume: 0.3 }] },
    { id: "resultado", camera: at(DESK.b), Visual: Resultado, sfx: [{ asset: "golpe", at: "herramienta", volume: 0.35 }] },
    { id: "lideres", Visual: Lideres, sfx: [{ asset: "pop", at: "líderes", volume: 0.3 }, { asset: "click", at: "mismos", volume: 0.4 }] },
    { id: "cierre", camera: { follow: { path: "camino", from: 0.5, to: 1 }, zoom: 1 }, Visual: Cierre, sfx: [{ asset: "whip", at: "rápido", volume: 0.3 }] },
    { id: "cta", camera: at(CAM_END), hold: 0.8, Visual: Cta, sfx: [{ asset: "click", at: "compañero", volume: 0.45 }] },
  ],
});
