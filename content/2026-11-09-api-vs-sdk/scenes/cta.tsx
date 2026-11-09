import { EASE, bump, fade, keys, popAt, unit, useClock, useCue } from "@motor/video";
import { Logo } from "@motor/ui";
import { ApiChip, Layer, SdkBox } from "../parts.tsx";
import { API, INK } from "../world.tsx";

/** Instagram's share and save, drawn the way the app draws them (a paper plane and a bookmark). */
function Share({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth={1.9} strokeLinejoin="round" aria-hidden>
      <path d="M 22 3 L 9.2 10.1" />
      <path d="M 22 3 L 15 21 L 11 12 L 2 9 Z" />
    </svg>
  );
}

function Save({ size, fill }: { size: number; fill: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M 19 21 L 12 16.5 L 5 21 L 5 4 Q 5 3 6 3 L 18 3 Q 19 3 19 4 Z" fill={API} fillOpacity={fill} stroke={fill > 0.5 ? API : INK} strokeWidth={1.9} strokeLinejoin="round" />
    </svg>
  );
}

/** Follow and save: the avatar asks, the bookmark fills, and the two integrations to come light up. */
export function Cta() {
  const t = useClock();
  const sigueme = useCue("Sígueme");
  const guarda = useCue("guarda");
  const openai = useCue("OpenAI");
  const mercado = useCue("Mercado");
  const top = popAt(t, 0.05);
  const follow = popAt(t, sigueme + 0.25);
  const followed = fade(t, sigueme + 1.4, 0.2);
  const tap = bump(t, sigueme + 1.3, 0.25);
  const icons = popAt(t, guarda - 0.35);
  const filled = EASE.out(unit(t, guarda, 0.3));
  const saveBump = bump(t, guarda, 0.35);
  const cursorX = keys(t, [[guarda - 0.6, 470], [guarda - 0.1, 414]]);
  const cursorY = keys(t, [[guarda - 0.6, 500], [guarda - 0.1, 424]]);
  return (
    <Layer>
      <div className="absolute" style={{ left: 0, top: 0, opacity: Math.min(1, top * 2) }}>
        <SdkBox x={270} y={215} s={0.8} xray={0.85} />
        <ApiChip x={270} y={232} w={84} h={44} />
      </div>
      {t >= guarda - 0.35 ? (
        <div className="absolute flex gap-5" style={{ left: 252, top: 352, opacity: Math.min(1, icons * 2), transform: `scale(${0.8 + 0.2 * Math.min(1, icons)})`, transformOrigin: "50% 50%" }}>
          <div className="flex h-[104px] w-[104px] items-center justify-center rounded-full bg-white" style={{ boxShadow: "0 14px 30px rgba(15,37,64,0.14)" }}>
            <Share size={56} />
          </div>
          <div className="flex h-[104px] w-[104px] items-center justify-center rounded-full bg-white" style={{ boxShadow: "0 14px 30px rgba(15,37,64,0.14)", transform: `scale(${1 + 0.12 * saveBump})` }}>
            <Save size={56} fill={filled} />
          </div>
        </div>
      ) : null}
      {t >= guarda - 0.6 && t < guarda + 0.8 ? (
        <svg className="absolute" width={26} height={30} viewBox="0 0 26 30" style={{ left: cursorX, top: cursorY, opacity: 1 - fade(t, guarda + 0.4, 0.3) }} aria-hidden>
          <path d="M 2 2 L 2 24 L 8 18 L 13 28 L 17 26 L 12 16 L 21 16 Z" fill="#FFFFFF" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        </svg>
      ) : null}
      {t >= sigueme + 0.25 ? (
        <div data-ui="" className="absolute flex h-[48px] w-[150px] items-center justify-center rounded-[10px] font-sans text-[20px] font-bold" style={{ left: 252, top: 494, color: followed > 0.5 ? INK : "#FFFFFF", background: followed > 0.5 ? "#EFEFEF" : "#0095F6", opacity: Math.min(1, follow * 2), transform: `scale(${(0.8 + 0.2 * Math.min(1, follow)) * (1 - 0.08 * tap)})` }}>
          {followed > 0.5 ? "Siguiendo" : "Seguir"}
        </div>
      ) : null}
      <div className="absolute flex flex-col items-start gap-3" style={{ left: 252, top: 580 }}>
        {[
          { slug: "openai", name: "OpenAI", at: openai },
          { slug: "mercadopago", name: "Mercado Pago", at: mercado },
        ].map((item) => {
          const p = popAt(t, item.at - 0.05);
          return (
            <div key={item.slug} data-ui="" className="flex h-[52px] items-center gap-2 rounded-[12px] bg-white px-3 font-sans text-[16px] font-bold" style={{ color: INK, boxShadow: "0 10px 22px rgba(15,37,64,0.12)", opacity: t < item.at - 0.05 ? 0.3 : 0.3 + 0.7 * Math.min(1, p), transform: `scale(${t < item.at - 0.05 ? 0.92 : 0.92 + 0.08 * Math.min(1, p)})` }}>
              <Logo slug={item.slug} size={26} ancla={false} />
              {item.name}
            </div>
          );
        })}
      </div>
    </Layer>
  );
}
