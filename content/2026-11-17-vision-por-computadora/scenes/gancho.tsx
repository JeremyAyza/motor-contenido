import { EASE, fade, popAt, unit, useClock, useCue } from "@motor/video";
import { DetBox, Layer, Mono, Photo, Pic, usePresence } from "../parts.tsx";
import { ACCENT, GREEN, INK, MUTED, RED, YELLOW } from "../world.tsx";

/** The three dogs of the gallery get a check; the rest dim. */
const GALLERY = [
  { src: "img/golden.png", dog: true },
  { src: "img/barco.png", dog: false },
  { src: "img/perro-blanco.png", dog: true },
  { src: "img/caballo.png", dog: false },
  { src: "img/rana.png", dog: false },
  { src: "img/husky.png", dog: true },
];

/** Dots of a face mesh over the face of img/rostro.png, in the photo box (254 × 318). */
const MESH = [
  [92, 132], [127, 128], [162, 132], [104, 150], [150, 150], [127, 168], [112, 196], [127, 200], [142, 196], [90, 176], [164, 176], [100, 218], [154, 218], [127, 232],
];

/**
 * Frame 1: the presenter is the first thing the machine detects, in a yellow
 * box with "persona 0.97", under the hook title. Then the three everyday
 * uses come in on the right, one per clause: the face that unlocks the phone,
 * the gallery that finds the dog, the car that stops at the red light.
 */
export function Gancho() {
  const t = useClock();
  const telefono = useCue("telefono");
  const galeria = useCue("galeria");
  const auto = useCue("auto");
  const rojo = useCue("rojo");
  // The face is on screen from frame 1 (the hook needs an object, not just a title); the mesh comes with "teléfono".
  const face = usePresence(-0.2, galeria - 0.15);
  const lock = popAt(t, useCue("cara"));
  const checks = [useCue("perro"), useCue("perro") + 0.12, useCue("perro") + 0.24];
  return (
    <Layer>
      <div className="absolute text-center font-display font-black uppercase leading-[0.95]" style={{ left: 36, top: 150, width: 468, fontSize: 52, color: INK }}>
        Visión por
        <br />
        <span style={{ color: ACCENT }}>computadora</span>
      </div>
      <Mono x={36} y={286} width={468} align="center" size={13}>
        YOLO · corrido sobre este cuadro
      </Mono>
      {/* The presenter, detected: the box closes around the bust from frame 1. */}
      <DetBox x={38} y={590} w={186} h={218} label="persona 0.97" at={-0.2} size={14} />

      {face.on || face.o > 0 ? (
        <Photo src="img/rostro.png" x={250} y={340} w={254} h={318} at={-0.2} until={galeria - 0.15} caption="Face ID · 1 rostro">
          {MESH.map(([x, y], i) => (
            <i key={i} className="absolute block h-[5px] w-[5px] rounded-full" style={{ left: x - 2.5, top: y - 2.5, background: YELLOW, opacity: EASE.out(unit(t, telefono + 0.1 + i * 0.03, 0.15)) }} />
          ))}
          <div className="absolute" style={{ left: 70, top: 96, width: 114, height: 160, border: `2px solid ${YELLOW}`, opacity: EASE.out(unit(t, telefono + 0.25, 0.2)) }} />
          {lock > 0 ? (
            <div className="absolute left-0 right-0 flex justify-center" style={{ top: 266 }}>
              <div data-ui="" className="rounded-[4px] px-[8px] py-[2px] font-mono text-[14px] font-bold" style={{ background: GREEN, color: "#062014", transform: `scale(${0.6 + 0.4 * Math.min(1.1, lock)})` }}>
                DESBLOQUEADO
              </div>
            </div>
          ) : null}
        </Photo>
      ) : null}

      {t > galeria - 0.15 && t < auto ? (
        <div className="absolute" style={{ left: 250, top: 340, width: 254, opacity: 1 - fade(t, auto - 0.2, 0.18) }}>
          <div data-ui="" className="mb-[8px] flex items-center gap-[6px] rounded-[8px] px-[10px] font-mono text-[13px]" style={{ height: 28, background: "rgba(255,255,255,0.07)", color: INK, opacity: EASE.out(unit(t, galeria - 0.1, 0.2)) }}>
              <span style={{ color: MUTED }}>⌕</span> perro
          </div>
          <div className="grid grid-cols-2 gap-[6px]">
            {GALLERY.map((g, i) => {
              const p = popAt(t, galeria + i * 0.06);
              const k = g.dog ? checks[GALLERY.filter((x, j) => x.dog && j < i).length] : 0;
              const dim = g.dog ? 0 : EASE.out(unit(t, checks[0], 0.25));
              return (
                <div key={g.src} className="relative overflow-hidden rounded-[4px]" style={{ height: 88, opacity: Math.min(1, p * 2) * (1 - 0.6 * dim), transform: `scale(${0.8 + 0.2 * Math.min(1, p)})` }}>
                  <Pic src={g.src} />
                  {g.dog && t > k ? (
                    <div data-ui="" className="absolute flex items-center justify-center rounded-full font-bold" style={{ right: 5, top: 5, width: 22, height: 22, background: YELLOW, color: "#111", fontSize: 14, transform: `scale(${Math.min(1.1, popAt(t, k))})` }}>
                      ✓
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {t > auto - 0.15 ? (
        <Photo src="img/calle.png" x={250} y={340} w={254} h={318} at={auto - 0.15} caption="auto autónomo · cámara frontal">
          {/* calle.png is 1080 × 1350, shown at 254 × 318: × 0.2352. */}
          <DetBox x={103} y={176} w={44} h={50} label="auto" at={auto + 0.1} size={12} />
          <DetBox x={185} y={176} w={61} h={54} label="auto" at={auto + 0.2} size={12} />
          <DetBox x={138} y={187} w={25} h={73} label="persona" at={auto + 0.3} size={12} />
          <DetBox x={75} y={196} w={39} h={71} label="persona" at={auto + 0.4} size={12} />
          <DetBox x={20} y={42} w={14} h={39} label="semáforo" at={rojo - 0.3} color={RED} size={12} />
          {t > rojo ? (
            <div data-ui="" className="absolute rounded-[4px] px-[6px] font-mono text-[14px] font-black" style={{ left: 40, top: 92, background: RED, color: INK, transform: `scale(${Math.min(1.1, popAt(t, rojo))})` }}>
              ALTO
            </div>
          ) : null}
        </Photo>
      ) : null}
    </Layer>
  );
}
