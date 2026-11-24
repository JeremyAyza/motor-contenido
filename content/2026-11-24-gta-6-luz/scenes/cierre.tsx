import { Gesto } from "@motor/ui";
import { EASE, bump, popAt, unit, useClock, useCue } from "@motor/video";
import { City } from "../map.tsx";
import { ACCENT, INK, LIGHT, MINT, type BackProps } from "../palette.ts";
import { Backdrop, Layer, YearTag, poster } from "../parts.tsx";

/**
 * Back to the 1997 tile map, seen from the sky; with "Hoy" a flash cuts to the
 * pink hotel lit by real light, the same corner 29 years later; with "pesa"
 * it dims under the question.
 */
export function CierreBack({ t, cue }: BackProps) {
  const hoy = cue("Hoy");
  const flash = bump(t, hoy - 0.1, 0.5);
  return (
    <>
      {t < hoy ? <City t={t + 40} cam={{ x: 300, y: 340, z: 0.95 + 0.01 * t }} cy={470} /> : null}
      <Backdrop src="img/hotel-rosa.png" t={t} at={hoy - 0.1} dur={8} z0={1.12} z1={1.04} />
      <div className="absolute left-0 top-0" style={{ width: 540, height: 960, background: LIGHT, opacity: 0.8 * flash, mixBlendMode: "screen" }} />
      <div className="absolute left-0 top-0" style={{ width: 540, height: 960, background: "#141418", opacity: 0.45 * EASE.out(unit(t, cue("pesa") - 0.2, 0.4)) }} />
    </>
  );
}

/** The years, and with "pesa" two big buttons, LUZ and JUEGO, like a game menu; with "Comenta" the comment gesture beats between them. */
export function Cierre() {
  const t = useClock();
  const hoy = useCue("Hoy");
  const pesa = useCue("pesa");
  const comenta = useCue("Comenta");
  const a = popAt(t, pesa);
  const b = popAt(t, pesa + 0.15);
  const g = popAt(t, comenta);
  const beat = 1 + 0.08 * bump((t - comenta) % 0.9, 0, 0.5);
  const btn = (label: string, bg: string, p: number, x: number) =>
    p > 0 ? (
      <div className="absolute flex items-center justify-center rounded-[22px]" style={{ left: x, top: 330, width: 210, height: 150, background: bg, border: "5px solid #111", boxShadow: "8px 10px 0 #111", opacity: Math.min(1, p * 2), transform: `translateY(${(1 - Math.min(1, p)) * -40}px) scale(${0.8 + 0.2 * Math.min(1.05, p)})` }}>
        <span style={poster(label.length > 3 ? 56 : 70)}>{label}</span>
      </div>
    ) : null;
  return (
    <Layer>
      <YearTag year="1997" at={-0.05} until={hoy - 0.15} />
      <YearTag year="HOY" at={hoy} until={pesa - 0.2} />
      {btn("LUZ", "#F4A9C4", a, 36)}
      {btn("JUEGO", MINT, b, 294)}
      {g > 0 ? (
        <div className="absolute flex items-center justify-center rounded-full" style={{ left: 225, top: 500, width: 90, height: 90, background: ACCENT, color: INK, border: "4px solid #111", transform: `scale(${Math.min(1.05, g) * beat})` }}>
          <Gesto accion="comentar" size={52} />
        </div>
      ) : null}
    </Layer>
  );
}
