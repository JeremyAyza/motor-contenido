import type { ReactNode } from "react";
import { EASE, bump, popAt, unit, useClock, useCue } from "@motor/video";
import { Layer, PopIn, Win } from "../parts.tsx";
import { ACCENT, INK, LINE, MUTED, WIN } from "../world.tsx";

const PINK = "#FF375F";
const WEEK = [0.62, 0.78, 0.7, 0.86, 0.74, 0.4, 0.3];

/** A detail card: a drawing on the left, its name big on the right. */
function Detail({ y, at, label, children }: { y: number; at: number; label: string; children: ReactNode }) {
  return (
    <PopIn x={184} y={y} at={at} origin="100% 50%">
      <div className="flex items-center gap-[16px] rounded-[16px] px-[16px]" style={{ width: 320, height: 128, background: WIN, border: `1px solid ${LINE}` }}>
        <div className="flex h-[96px] w-[130px] shrink-0 items-center justify-center">{children}</div>
        <span className="font-display text-[28px] font-bold leading-tight" style={{ color: INK }}>{label}</span>
      </div>
    </PopIn>
  );
}

/** Taste: many developers just like using it, and when you look at it all day, that counts. */
export function Gusto() {
  const t = useClock();
  const gusta = useCue("gusta");
  const trackpad = useCue("trackpad");
  const pantalla = useCue("pantalla");
  const bien = useCue("bien");
  const miras = useCue("miras");
  const dia = useCue("dia");
  const heart = popAt(t, 0.1);
  const beat = 1 + 0.14 * (bump(t, gusta, 0.3) + bump(t, gusta + 0.55, 0.3) + bump(t, dia, 0.3));
  const swipe = (t - trackpad) % 1.2;
  return (
    <Layer>
      {heart > 0 ? (
        <div className="absolute" style={{ left: 54, top: 486, opacity: Math.min(1, heart * 2), transform: `scale(${(0.5 + 0.5 * Math.min(1.1, heart)) * beat})` }}>
          <svg width={88} height={80} viewBox="0 0 24 22" aria-hidden>
            <path d="M12 21 C 5 15.5, 1 12, 1 7 A 5.5 5.5 0 0 1 12 4.5 A 5.5 5.5 0 0 1 23 7 C 23 12, 19 15.5, 12 21 Z" fill={PINK} />
          </svg>
        </div>
      ) : null}
      <Detail y={100} at={trackpad - 0.15} label="Trackpad">
        <div className="relative rounded-[10px]" style={{ width: 120, height: 80, background: "#3A3E47", border: "1px solid #5A5F6B" }}>
          {[0, 1].map((i) => (
            <div key={i} className="absolute h-[12px] w-[12px] rounded-full" style={{ left: 46 + i * 18, top: 60 - 40 * EASE.inOut(Math.max(0, Math.min(1, swipe / 0.8))), background: INK, opacity: t > trackpad ? 0.85 : 0 }} />
          ))}
        </div>
      </Detail>
      <Detail y={244} at={pantalla - 0.15} label="Pantalla">
        <div className="rounded-[8px] p-[4px]" style={{ width: 124, height: 82, background: "#111318", border: "1.5px solid #5A5F6B" }}>
          <div className="h-full w-full rounded-[4px]" style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, #3A2C7A 45%, #0A84FF 100%)` }} />
        </div>
      </Detail>
      <Detail y={388} at={bien - 0.1} label="Bien hecha">
        <div className="relative" style={{ width: 124, height: 70 }}>
          <div className="absolute rounded-[6px]" style={{ left: 0, top: 18, width: 124, height: 14, background: "linear-gradient(180deg, #E4E6EA 0%, #9DA1A9 60%, #6E727A 100%)" }} />
          <div className="absolute rounded-b-[10px]" style={{ left: -4, top: 34, width: 132, height: 10, background: "linear-gradient(180deg, #C9CCD2 0%, #7D8189 100%)" }} />
        </div>
      </Detail>
      <Win x={184} y={532} w={320} h={258} title="Tiempo en pantalla" at={miras - 0.3} bodyStyle={{ padding: "12px 18px" }}>
        <div className="text-[13px]" style={{ color: MUTED }}>Promedio diario</div>
        <div className="text-[22px] font-bold" style={{ color: INK }}>Todo el día</div>
        <div className="mt-[10px] flex items-end gap-[10px]" style={{ height: 120 }}>
          {WEEK.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-[4px]">
              <div className="w-full rounded-[4px]" style={{ height: 100 * h * EASE.out(unit(t, dia - 0.3 + i * 0.06, 0.4)), background: i < 5 ? ACCENT : "#3A3F4B" }} />
              <span className="text-[12px]" style={{ color: MUTED }}>{"LMMJVSD"[i]}</span>
            </div>
          ))}
        </div>
      </Win>
    </Layer>
  );
}
