import { EASE, bump, fade, keys, popAt, unit, useClock, useCue, wobble } from "@motor/video";
import { Logo } from "@motor/ui";
import { Card, Illustrative, Layer } from "../parts.tsx";
import { API, INK, MUTED } from "../world.tsx";

const CHIPS: Array<{ label: string; x: number; y: number }> = [
  { label: "GPUs", x: 236, y: 438 },
  { label: "Datos", x: 360, y: 428 },
  { label: "Entrenar", x: 300, y: 486 },
  { label: "Servidores", x: 404, y: 498 },
  { label: "Escalar", x: 232, y: 548 },
  { label: "Moderación", x: 352, y: 560 },
  { label: "Latencia", x: 268, y: 614 },
  { label: "Costos", x: 410, y: 622 },
  { label: "Seguridad", x: 320, y: 676 },
];

/** Your app's chat: the click on Enviar, the pile of work a model of your own would need, and OpenAI taking it. */
export function App() {
  const t = useClock();
  const chat = useCue("chat");
  const entrenar = useCue("entrenar");
  const modelo = useCue("modelo");
  const openai = useCue("OpenAI");
  const card = popAt(t, 0.05);
  // The cursor travels to Enviar and clicks when "chat" is said.
  const cx = keys(t, [[0.2, 500], [chat - 0.1, 440]]);
  const cy = keys(t, [[0.2, 420], [chat - 0.1, 352]]);
  const click = bump(t, chat - 0.05, 0.25);
  const sent = fade(t, chat + 0.1, 0.25);
  const gone = EASE.in(unit(t, openai - 0.1, 0.35));
  const logo = popAt(t, openai);
  const ring = unit(t, openai, 0.9);
  return (
    <Layer>
      <Card x={200} y={140} w={304} h={226} style={{ opacity: Math.min(1, card * 2), transform: `scale(${0.85 + 0.15 * Math.min(1, card)})` }}>
        <div className="flex h-[34px] items-center gap-2 border-b border-[#E2E8EF] px-3 font-sans text-[14px] font-bold" style={{ color: INK }}>
          <span className="h-[8px] w-[8px] rounded-full bg-[#F87171]" />
          <span className="h-[8px] w-[8px] rounded-full bg-[#FBBF24]" />
          <span className="h-[8px] w-[8px] rounded-full bg-[#34D399]" />
          <span className="ml-1">Tu app · Soporte</span>
        </div>
        <div className="px-3 pt-3 font-sans text-[14px]" style={{ color: INK }}>
          <div className="w-fit rounded-[12px] rounded-bl-[4px] bg-[#EEF2F6] px-3 py-2">Hola, ¿en qué te ayudo?</div>
          <div className="ml-auto mt-2 w-fit rounded-[12px] rounded-br-[4px] px-3 py-2 text-white" style={{ background: API, opacity: sent, transform: `translateY(${(1 - sent) * 30}px)` }}>
            Resume este ticket
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
          <div className="flex h-[36px] flex-1 items-center rounded-[8px] border border-[#D5DDE6] px-3 font-sans text-[14px]" style={{ color: sent > 0.5 ? MUTED : INK }}>
            {sent > 0.5 ? "Escribe un mensaje…" : "Resume este ticket"}
          </div>
          <div className="flex h-[36px] items-center rounded-[8px] px-3 font-sans text-[14px] font-bold text-white" style={{ background: API, transform: `scale(${1 - 0.08 * click})` }}>
            Enviar
          </div>
        </div>
      </Card>
      <Illustrative y={374} />
      <svg className="absolute" width={26} height={30} viewBox="0 0 26 30" style={{ left: cx, top: cy, opacity: 1 - fade(t, chat + 0.6, 0.3), transform: `scale(${1 - 0.15 * click})` }} aria-hidden>
        <path d="M 2 2 L 2 24 L 8 18 L 13 28 L 17 26 L 12 16 L 21 16 Z" fill="#FFFFFF" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      </svg>
      {CHIPS.map((chip, i) => {
        const at = entrenar + i * 0.14;
        if (t < at) return null;
        const p = popAt(t, at);
        const shake = t > modelo ? wobble(t, chip.label, 7, 1.6) : { x: 0, y: 0, rotate: 0 };
        const tilt = t > modelo ? (i % 2 ? 7 : -6) * EASE.out(unit(t, modelo, 0.3)) : 0;
        const tx = (390 - chip.x) * gone;
        const ty = (560 - chip.y) * gone;
        return (
          <div
            key={chip.label}
            data-ui=""
            className="absolute whitespace-nowrap rounded-[8px] bg-white px-3 py-[6px] font-sans text-[15px] font-semibold"
            style={{ left: chip.x, top: chip.y, color: INK, boxShadow: "0 8px 18px rgba(15,37,64,0.12)", opacity: Math.min(1, p * 2) * (1 - gone), transform: `translate(${tx + shake.x}px, ${ty + shake.y}px) rotate(${tilt + shake.rotate}deg) scale(${(0.7 + 0.3 * Math.min(1, p)) * (1 - 0.6 * gone)})` }}
          >
            {chip.label}
          </div>
        );
      })}
      {t >= openai ? (
        <>
          <div className="absolute rounded-full" style={{ left: 380 - 90 * ring, top: 560 - 90 * ring, width: 180 * ring, height: 180 * ring, border: `3px solid ${API}`, opacity: 1 - ring }} />
          <div data-ui="" className="absolute flex h-[68px] w-[200px] items-center justify-center gap-3 rounded-[16px] bg-white font-sans text-[24px] font-bold" style={{ left: 280, top: 526, color: INK, boxShadow: "0 16px 36px rgba(15,37,64,0.18)", transform: `scale(${Math.min(1.08, logo)})` }}>
            <Logo slug="openai" size={34} ancla={false} />
            OpenAI
          </div>
        </>
      ) : null}
    </Layer>
  );
}
