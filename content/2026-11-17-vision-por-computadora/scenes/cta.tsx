import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Layer, Pic } from "../parts.tsx";
import { ACCENT, INK, LINE, MUTED, PANEL } from "../world.tsx";

/** Topic ideas typed and erased in the reply box, one after another. */
const IDEAS = ["embeddings", "YOLO", "visión y lenguaje"];

/** Instagram's comment bubble, drawn. */
function CommentIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round">
      <path d="M20.66 16.66A9.5 9.5 0 1 0 17 20.1L21.5 21.5 Z" />
    </svg>
  );
}

/**
 * An open comment box waiting for the audience: the labeled street dims behind,
 * a comment card comes up with the comment gesture and "¿Ya lo sabías?", and
 * in the reply box three topic ideas are typed and erased with a cursor.
 */
export function Cta() {
  const t = useClock();
  const comentarios = useCue("comentarios");
  const tema = useCue("tema");
  const card = popAt(t, 0.05);
  const pulse = 1 + 0.12 * Math.sin(Math.PI * EASE.inOut(unit(t, comentarios, 0.5)));
  const slot = 0.95;
  // Each idea gets a slot: typed in 0.45 s, held, erased at the end (the last one stays).
  const k = t - (tema - 0.2);
  const i = Math.max(0, Math.min(IDEAS.length - 1, Math.floor(k / slot)));
  const local = k - i * slot;
  const idea = IDEAS[i];
  const erase = i < IDEAS.length - 1 ? EASE.inOut(unit(local, 0.72, 0.2)) : 0;
  const typedN = k < 0 ? 0 : Math.round(idea.length * Math.min(1, local / 0.45) * (1 - erase));
  const blink = Math.floor(t * 2.5) % 2 === 0;
  return (
    <Layer>
      <div className="absolute overflow-hidden rounded-[4px]" style={{ left: 36, top: 176, width: 468, height: 440, opacity: 0.22 }}>
        <Pic src="img/calle.png" style={{ objectPosition: "50% 38%" }} />
      </div>
      <div className="absolute rounded-[16px] p-[18px]" style={{ left: 120, top: 240, width: 384, background: PANEL, border: `1px solid ${LINE}`, boxShadow: "0 24px 60px rgba(0,0,0,0.6)", opacity: Math.min(1, card * 2), transform: `translateY(${(1 - Math.min(1, card)) * 40}px)` }}>
        <div className="flex items-center gap-[12px]">
          <div style={{ transform: `scale(${pulse})` }}>
            <CommentIcon size={44} color={ACCENT} />
          </div>
          <div className="font-display text-[34px] font-extrabold leading-none" style={{ color: INK }}>
            ¿Ya lo sabías?
          </div>
        </div>
        <div data-ui="" className="mt-[16px] font-mono text-[13px]" style={{ color: MUTED }}>
          el próximo video, tú eliges el tema:
        </div>
        <div className="mt-[8px] flex items-center rounded-[22px] px-[16px]" style={{ height: 52, background: "rgba(255,255,255,0.06)", border: `1px solid ${ACCENT}` }}>
          <span className="whitespace-nowrap font-mono text-[22px]" style={{ color: INK }}>{idea.slice(0, typedN)}</span>
          <span className="font-mono text-[24px]" style={{ color: ACCENT, opacity: blink ? 1 : 0 }}>▌</span>
          <span data-ui="" className="ml-auto font-mono text-[13px] font-bold" style={{ color: ACCENT }}>Publicar</span>
        </div>
      </div>
    </Layer>
  );
}
