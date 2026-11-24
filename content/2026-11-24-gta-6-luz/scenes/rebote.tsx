import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { ACCENT, INK, PINK, type BackProps } from "../palette.ts";
import { Backdrop, Chip, Layer } from "../parts.tsx";

/**
 * The pink wall tints the street: a pink glow spreads over the pavement from
 * the wall ("tiñe"). With "Entras" we cut into a dim café where the sunlight
 * from the door stretches across the floor ("puerta").
 */
export function ReboteBack({ t, cue }: BackProps) {
  const entras = cue("Entras");
  const spread = EASE.inOut(unit(t, cue("tiñe") - 0.2, 1.4));
  const beam = EASE.inOut(unit(t, cue("puerta") - 0.4, 1.0));
  return (
    <>
      <Backdrop src="img/calle-rosa.png" t={t} at={-1} until={entras} dur={10} z0={1.05} z1={1.12} x0={0} x1={20} />
      {t < entras ? <div className="absolute left-0 top-0" style={{ width: 540, height: 960, background: `radial-gradient(ellipse 380px 300px at 120px 760px, ${PINK}cc 0%, ${PINK}00 70%)`, mixBlendMode: "color", opacity: spread }} /> : null}
      <Backdrop src="img/cafe.png" t={t} at={entras} dur={10} z0={1.06} z1={1.14} y0={0} y1={-20} />
      {t > entras ? (
        <svg className="absolute left-0 top-0" width={540} height={960} style={{ mixBlendMode: "screen", opacity: 0.55 * beam }}>
          <defs>
            <filter id="beam-blur">
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>
          <polygon points="300,560 460,560 420,960 70,960" fill="#FFD58A" filter="url(#beam-blur)" />
        </svg>
      ) : null}
    </>
  );
}

/** The chips, and with "opción" a "Trazado de rayos" switch that tries to go off with "apague" and gets a padlock. */
export function Rebote() {
  const t = useClock();
  const tine = useCue("tiñe");
  const entras = useCue("Entras");
  const puerta = useCue("puerta");
  const opcion = useCue("opción");
  const apague = useCue("apague");
  const sw = popAt(t, opcion - 0.1);
  const tryOff = t > apague ? Math.sin(Math.min(1, (t - apague) / 0.5) * Math.PI) * 0.55 : 0;
  const lock = popAt(t, apague + 0.45);
  return (
    <Layer>
      <Chip at={tine} until={entras - 0.1} x={220} y={150} tone="light">
        Calle teñida de rosa
      </Chip>
      <Chip at={puerta} until={opcion - 0.15} x={36} y={150} tone="amber">
        Luz de la puerta
      </Chip>
      {sw > 0 ? (
        <div className="absolute flex items-center gap-[16px] rounded-[16px]" style={{ left: 36, top: 140, padding: "14px 20px", background: "rgba(20,20,24,0.86)", border: "1px solid rgba(255,255,255,0.14)", opacity: Math.min(1, sw * 2), transform: `scale(${0.8 + 0.2 * Math.min(1.05, sw)})`, transformOrigin: "left center" }}>
          <span className="font-bold" style={{ fontSize: 30, color: INK }}>Trazado de rayos</span>
          <div className="relative rounded-full" style={{ width: 76, height: 40, background: ACCENT }}>
            <div className="absolute rounded-full" style={{ top: 4, left: 40 - 36 * tryOff, width: 32, height: 32, background: "#FFF8F2", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }} />
          </div>
          {lock > 0 ? (
            <svg width={30} height={36} viewBox="0 0 24 28" style={{ transform: `translateY(${(1 - Math.min(1, lock)) * -30}px)`, opacity: Math.min(1, lock * 2) }}>
              <rect x="3" y="12" width="18" height="14" rx="3" fill={INK} />
              <path d="M7 12 V8 a5 5 0 0 1 10 0 V12" stroke={INK} strokeWidth="3" fill="none" />
            </svg>
          ) : null}
        </div>
      ) : null}
    </Layer>
  );
}
