import { defineVideo } from "@motor/video";
import { World } from "./world.tsx";
import { Cierre } from "./scenes/cierre.tsx";
import { Compatibilidad } from "./scenes/compatibilidad.tsx";
import { Control } from "./scenes/control.tsx";
import { CostoWindows } from "./scenes/costo-windows.tsx";
import { CualMejor } from "./scenes/cual-mejor.tsx";
import { Developers } from "./scenes/developers.tsx";
import { Funciona } from "./scenes/funciona.tsx";
import { Gancho } from "./scenes/gancho.tsx";
import { LimitesApps } from "./scenes/limites-apps.tsx";
import { LimitesHardware } from "./scenes/limites-hardware.tsx";
import { LinuxOpuesto } from "./scenes/linux-opuesto.tsx";
import { Principiantes } from "./scenes/principiantes.tsx";
import { Seguridad } from "./scenes/seguridad.tsx";
import { WindowsDefecto } from "./scenes/windows-defecto.tsx";
import { Wsl } from "./scenes/wsl.tsx";

/*
 * Linux vs Windows: a paraphrased replica of @rick.theengineer's Reel (166 s),
 * with the look of his: a flat night-blue desk, the dial "¿QUIÉN DECIDE?"
 * locked at the top (the piece's meter: it goes from "the system decides"
 * to "you choose"), and interfaces rebuilt in Spanish that light up row by
 * row with the voice. Blue is Windows, orange is Linux, green is "works",
 * amber is friction; our violet marks the dot, "FALSO" and the CTA. The
 * avatar stands where Rick does: in the hook, the chapters, the big lines
 * and the close (Jeremy's gate A: "Como Rick"), and leaves when an
 * interface needs the screen.
 */
export default defineVideo({
  voice: { tempo: 1.36 },
  captions: "pill",
  stage: { World, drift: 0, sfx: false },
  // Only in the moments each scene says (SceneDef.avatar): none by default.
  avatar: { size: 220, scenes: [] },
  scenes: [
    { id: "gancho", Visual: Gancho, avatar: {}, sfx: [{ asset: "pop", at: "sí.", volume: 0.2 }, { asset: "pop", at: "extra.", volume: 0.2 }, { asset: "whoosh", at: "cada", volume: 0.2 }] },
    { id: "windows-defecto", Visual: WindowsDefecto, avatar: { until: "Está", from: "left" }, sfx: [{ asset: "whoosh", at: "Está", volume: 0.2 }, { asset: "golpe", at: "usan.", volume: 0.22 }] },
    { id: "funciona", Visual: Funciona, avatar: { at: "y", from: "left" }, sfx: [{ asset: "blip", at: "instalas,", volume: 0.15 }, { asset: "blip", at: "conectas", volume: 0.15 }, { asset: "blip", at: "bajas", volume: 0.15 }, { asset: "blip", at: "abres", volume: 0.15 }, { asset: "golpe", at: "funciona.", volume: 0.22 }] },
    { id: "compatibilidad", Visual: Compatibilidad, avatar: { until: "Compras", from: "left" }, sfx: [{ asset: "golpe", at: "compatibilidad.", volume: 0.22 }, { asset: "whoosh", at: "Compras", volume: 0.2 }, { asset: "whip", at: "primero", volume: 0.2 }] },
    { id: "costo-windows", Visual: CostoWindows, avatar: { until: "no", from: "left" }, sfx: [{ asset: "switch", at: "cerrado:", volume: 0.22 }, { asset: "whoosh", at: "Microsoft", volume: 0.18 }, { asset: "pop", at: "Actualizaciones", volume: 0.18 }, { asset: "pop", at: "procesos", volume: 0.18 }, { asset: "pop", at: "apps", volume: 0.18 }, { asset: "pop", at: "publicidad", volume: 0.2 }] },
    { id: "linux-opuesto", Visual: LinuxOpuesto, avatar: { until: "código", from: "left" }, drop: "revés.", sfx: [{ asset: "whoosh", at: "distribuciones:", volume: 0.2 }, { asset: "pop", at: "Ubuntu,", volume: 0.16 }, { asset: "pop", at: "Fedora,", volume: 0.16 }, { asset: "pop", at: "Mint,", volume: 0.16 }, { asset: "pop", at: "Arch", volume: 0.16 }, { asset: "golpe", at: "kernel", volume: 0.2 }] },
    { id: "control", Visual: Control, avatar: { until: "¿No", from: "left" }, sfx: [{ asset: "golpe", at: "control", volume: 0.22 }, { asset: "whip", at: "Cambias", volume: 0.2 }, { asset: "whip", at: "También.", volume: 0.2 }, { asset: "golpe", at: "siempre,", volume: 0.25 }] },
    { id: "limites-apps", Visual: LimitesApps, avatar: { until: "veces", from: "left" }, sfx: [{ asset: "switch", at: "no", volume: 0.2 }, { asset: "whoosh", at: "Adobe", volume: 0.18 }, { asset: "whoosh", at: "juegos", volume: 0.18 }, { asset: "pop", at: "antitrampas", volume: 0.2 }] },
    { id: "limites-hardware", Visual: LimitesHardware, sfx: [{ asset: "blip", at: "común", volume: 0.15 }, { asset: "switch", at: "adaptador", volume: 0.22 }, { asset: "switch", at: "RGB", volume: 0.2 }] },
    { id: "developers", Visual: Developers, avatar: { until: "Casi", from: "left" }, sfx: [{ asset: "whoosh", at: "Casi", volume: 0.2 }, { asset: "golpe", at: "Linux:", volume: 0.24 }, { asset: "pop", at: "contenedores", volume: 0.16 }, { asset: "pop", at: "clústeres", volume: 0.16 }, { asset: "whoosh", at: "Por", volume: 0.18 }] },
    { id: "wsl", Visual: Wsl, avatar: { at: "Así", from: "left" }, sfx: [{ asset: "golpe", at: "WSL,", volume: 0.25 }, { asset: "pop", at: "entorno", volume: 0.18 }] },
    { id: "seguridad", Visual: Seguridad, avatar: { at: "Seguro", until: "Pero", from: "left" }, drop: "Falso:", sfx: [{ asset: "whoosh", at: "Pero", volume: 0.18 }, { asset: "pop", at: "malware", volume: 0.18 }] },
    { id: "cual-mejor", Visual: CualMejor, avatar: { until: "Si", from: "left" }, sfx: [{ asset: "whoosh", at: "Si", volume: 0.18 }, { asset: "blip", at: "compatibilidad,", volume: 0.15 }, { asset: "blip", at: "control,", volume: 0.15 }] },
    { id: "principiantes", Visual: Principiantes, avatar: { until: "Linux", from: "left" }, sfx: [{ asset: "whoosh", at: "Linux", volume: 0.2 }, { asset: "pop", at: "Ubuntu", volume: 0.18 }] },
    { id: "cierre", Visual: Cierre, avatar: { at: { word: "Es", nth: 2 }, from: "left" }, hold: 1.4, sfx: [{ asset: "whip", at: "bueno", volume: 0.18 }, { asset: "whip", at: "malo.", volume: 0.18 }, { asset: "whoosh", at: "Comenta", volume: 0.25 }, { asset: "pop", at: "eliges:", volume: 0.22 }] },
  ],
});
