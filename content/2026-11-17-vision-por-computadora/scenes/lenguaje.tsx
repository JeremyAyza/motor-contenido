import { Logo } from "@motor/ui";
import { EASE, fade, lerp, popAt, unit, useClock, useCue } from "@motor/video";
import { Ilustrativo, Layer, Mono, Pic, Title } from "../parts.tsx";
import { ACCENT, INK, LINE, MUTED, YELLOW } from "../world.tsx";

const PW = 280;
const PH = 350;
const N = 4;
const TOKENS = ["¿Qué", "está", "pasando?"];
const QUESTION = "¿Qué está pasando aquí?";

/**
 * A photo cut into tiles that line up with the words: the street splits into a
 * 4 × 4 grid of patches, the first eight fly to a row of image patches next to
 * a row of text tokens, and both drop into one yellow bar, one model. On
 * "ChatGPT" a chat window comes up with the photo sent and the question typed.
 */
export function Lenguaje() {
  const t = useClock();
  const cortan = useCue("cortan");
  const parche = useCue("parche");
  const palabras = useCue("palabras");
  const chat = useCue("chatgpt");
  const pasa = useCue("pasa");
  const split = EASE.inOut(unit(t, cortan + 0.2, 0.5));
  const fly = EASE.inOut(unit(t, parche, 0.7));
  const merge = popAt(t, palabras + 0.1);
  const chatIn = EASE.out(unit(t, chat - 0.35, 0.35));
  const back = fade(t, chat - 0.4, 0.3);
  const typed = Math.round(QUESTION.length * EASE.linear(unit(t, chat + 0.2, Math.min(0.7, Math.max(0.3, pasa - chat - 0.3)))));
  return (
    <Layer>
      <Title y={124} size={32}>Imágenes y lenguaje</Title>
      <div className="absolute inset-0" style={{ opacity: 1 - 0.75 * back }}>
        {Array.from({ length: N * N }, (_, i) => {
          const c = i % N;
          const r = Math.floor(i / N);
          const g = 6 * split;
          const flies = i < 8;
          const tx = flies ? lerp(36 + c * (PW / N + g), 36 + i * 30, fly) : 36 + c * (PW / N + g);
          const ty = flies ? lerp(180 + r * (PH / N + g), 590, fly) : 180 + r * (PH / N + g);
          const w = flies ? lerp(PW / N, 26, fly) : PW / N;
          const h = flies ? lerp(PH / N, 26, fly) : PH / N;
          return (
            <div key={i} className="absolute overflow-hidden" style={{ left: tx, top: ty, width: w, height: h, borderRadius: 2 + 2 * split, outline: split > 0 ? `1px solid rgba(139,133,255,${0.8 * split})` : "none", opacity: flies ? 1 : 1 - 0.5 * fly }}>
              <div className="absolute" style={{ left: -c * (w), top: -r * (h), width: w * N, height: h * N }}>
                <Pic src="img/calle.png" style={{ objectPosition: "50% 45%" }} />
              </div>
            </div>
          );
        })}
        <Mono x={36} y={622} at={parche + 0.5} size={12}>parches de imagen</Mono>
        {TOKENS.map((w, i) => {
          const p = popAt(t, parche + 0.6 + i * 0.12);
          return p > 0 ? (
            <div key={w} data-ui="" className="absolute rounded-[4px] px-[7px] font-mono text-[15px]" style={{ left: 290 + [0, 62, 120][i], top: 590, height: 26, lineHeight: "26px", background: "rgba(139,133,255,0.2)", border: `1px solid ${ACCENT}`, color: INK, opacity: Math.min(1, p * 2) }}>
              {w}
            </div>
          ) : null;
        })}
        <Mono x={290} y={622} at={parche + 0.6} size={12}>tokens de texto</Mono>
        {merge > 0 ? (
          <div data-ui="" className="absolute flex items-center justify-center rounded-[6px] font-mono text-[16px] font-bold" style={{ left: 214, top: 650, width: 290, height: 40, background: YELLOW, color: "#111", opacity: Math.min(1, merge * 2), transform: `scaleX(${0.6 + 0.4 * Math.min(1, merge)})` }}>
            UN MODELO LEE LOS DOS
          </div>
        ) : null}
      </div>
      {chatIn > 0 ? (
        <div className="absolute overflow-hidden rounded-[14px]" style={{ left: 176, top: 180, width: 328, height: 520, background: "#212121", border: `1px solid ${LINE}`, opacity: chatIn, transform: `translateY(${(1 - chatIn) * 50}px)` }}>
          <div data-ui="" className="flex items-center gap-[8px] px-[14px] text-[15px] font-semibold" style={{ height: 46, color: INK, borderBottom: `1px solid ${LINE}` }}>
            <div className="flex items-center justify-center rounded-full" style={{ width: 26, height: 26, background: "#FFFFFF" }}>
              <Logo slug="openai" size={18} ancla={false} />
            </div>
            ChatGPT
          </div>
          <div className="absolute overflow-hidden rounded-[14px]" style={{ right: 14, top: 64, width: 190, height: 238 }}>
            <Pic src="img/calle.png" />
          </div>
          {typed > 0 ? (
            <div data-ui="" className="absolute rounded-[16px] px-[14px] py-[9px] text-[16px]" style={{ right: 14, top: 314, maxWidth: 260, background: "#303030", color: INK }}>
              {QUESTION.slice(0, typed)}
            </div>
          ) : null}
          <div data-ui="" className="absolute flex items-center rounded-[22px] px-[16px] text-[14px]" style={{ left: 12, right: 12, bottom: 14, height: 42, background: "#303030", color: MUTED }}>
            Pregunta lo que quieras
          </div>
        </div>
      ) : null}
      <Ilustrativo x={250} y={712} at={chat} />
    </Layer>
  );
}
