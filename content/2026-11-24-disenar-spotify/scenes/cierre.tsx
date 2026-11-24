import { Gesto, Logo } from "@motor/ui";
import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Crowd, Layer, Title, useOn } from "../parts.tsx";
import { ACCENT, BG, INK, LINE, MUTED } from "../world.tsx";

/**
 * The close: a lone MP3 file; a crowd of millions in a wave; the Spotify logo
 * back, ready to play; then our violet card with the debate: could a single
 * developer design Spotify? Two buttons, SÍ and NO, and the comment gesture.
 */
export function Cierre() {
  const t = useClock();
  const reproducir = useCue("reproducir");
  const millones = useCue("millones");
  const listas = useCue("listas");
  const solo = useCue("solo");
  const comenta = useCue("Comenta");
  const mp3 = useOn(0.05, 0.3) * (1 - useOn(millones - 0.25, 0.2));
  const crowd = useOn(millones - 0.2, 0.2) * (1 - useOn(listas - 0.3, 0.2));
  const logo = EASE.back(unit(t, listas - 0.1, 0.5));
  const lift = EASE.inOut(unit(t, solo - 0.2, 0.5));
  const card = EASE.out(unit(t, solo - 0.1, 0.4));
  const beat = 1 + 0.035 * Math.max(0, Math.sin(t * Math.PI * 2 * 1.6));
  const hint = useOn(comenta, 0.3);
  const pulse = (k: number) => 1 + 0.06 * Math.max(0, Math.sin((t - comenta) * 5 + k));
  return (
    <Layer>
      {mp3 > 0 ? (
        <div className="absolute flex flex-col items-center" style={{ left: 200, top: 180, width: 140, opacity: mp3 }}>
          <svg width={120} height={150} viewBox="0 0 48 60" aria-hidden>
            <path d="M4 2 L32 2 L44 14 L44 58 L4 58 Z" fill="rgba(10,16,13,0.95)" stroke={INK} strokeWidth={1.5} />
            <path d="M32 2 L32 14 L44 14" fill="none" stroke={INK} strokeWidth={1.5} />
          </svg>
          <div data-ui="" className="absolute top-[64px] font-mono text-[20px] font-bold tracking-[0.1em]" style={{ color: INK }}>MP3</div>
        </div>
      ) : null}
      <Title text="No es reproducir un MP3" at={reproducir} until={millones - 0.25} />

      {crowd > 0 ? (
        <div className="absolute left-0 top-0" style={{ width: 540, height: 960, opacity: crowd }}>
          <Crowd x={60} y={160} cols={12} rows={6} gapX={36} gapY={42} s={1.4} at={millones - 0.1} />
        </div>
      ) : null}
      <Title text="Millones, al mismo tiempo" at={millones} until={listas - 0.3} />

      {t >= listas - 0.1 ? (
        <div className="absolute" style={{ left: 270 - 85, top: 200 - 30 * lift, transform: `scale(${Math.max(0, logo) * beat * (1 - 0.3 * lift)})` }}>
          <Logo slug="spotify" size={170} ancla={false} />
        </div>
      ) : null}
      <Title text="Listo para sonar" at={listas} until={solo - 0.2} size={46} />

      {card > 0 ? (
        <div className="absolute rounded-[14px]" style={{ left: 214, top: 560, width: 290, height: 236, background: ACCENT, opacity: card, transform: `translateY(${(1 - card) * 30}px)`, boxShadow: `0 0 30px ${ACCENT}66` }}>
          <div className="px-[18px] pt-[18px]" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontStretch: "75%", fontSize: 38, lineHeight: 1.02, color: BG, textTransform: "uppercase" }}>
            ¿Un solo dev podría?
          </div>
          <div className="absolute bottom-[18px] left-[18px] right-[18px] flex items-center gap-[10px]">
            {["SÍ", "NO"].map((v, i) => (
              <div key={v} className="flex h-[52px] flex-1 items-center justify-center rounded-[10px] text-[28px] font-bold" style={{ background: BG, color: INK, transform: `scale(${t >= comenta ? pulse(i * 1.6) : popAt(t, solo + 0.3 + i * 0.15)})` }}>
                {v}
              </div>
            ))}
            <div style={{ color: BG, transform: `scale(${t >= comenta ? pulse(3) : 1})` }}>
              <Gesto accion="comentar" size={40} lleno={t >= comenta} />
            </div>
          </div>
        </div>
      ) : null}
      <div data-ui="" className="absolute font-mono text-[13px] font-bold tracking-[0.12em]" style={{ left: 36, top: 440, width: 468, textAlign: "center", color: MUTED, opacity: hint, borderTop: `1px solid ${LINE}`, paddingTop: 10 }}>
        COMENTA SÍ O NO, Y POR QUÉ
      </div>
    </Layer>
  );
}
