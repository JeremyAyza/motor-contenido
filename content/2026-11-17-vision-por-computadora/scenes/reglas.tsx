import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Ilustrativo, Layer, Photo, Title } from "../parts.tsx";
import { ACCENT, DIM, INK, MUTED, RED } from "../world.tsx";

/** The hand-written rules, typed line by line. */
const CODE: { text: string; color: string }[] = [
  { text: "# reglas escritas a mano", color: DIM },
  { text: "def es_gato(imagen):", color: ACCENT },
  { text: "  if not dos_ojos(imagen):", color: INK },
  { text: "    return False", color: MUTED },
  { text: "  if not orejas_en_punta(imagen):", color: INK },
  { text: "    return False", color: MUTED },
  { text: "  if textura(imagen) != 'pelaje':", color: INK },
  { text: "    return False", color: MUTED },
  { text: "  return True", color: MUTED },
];

/** A red cross stamped on a photo the rules reject, with the function's answer. */
function Reject({ at }: { at: number }) {
  const t = useClock();
  const p = popAt(t, at);
  if (p <= 0) return null;
  return (
    <>
      <div className="absolute inset-0" style={{ background: `rgba(255,90,95,${0.22 * Math.min(1, p)})` }} />
      <div className="absolute flex items-center justify-center font-black" style={{ inset: 0, color: RED, fontSize: 92, transform: `scale(${1.6 - 0.6 * Math.min(1.05, p)})`, opacity: Math.min(1, p * 2), textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
        ✗
      </div>
      <div data-ui="" className="absolute rounded-[3px] px-[5px] font-mono text-[13px] font-bold" style={{ left: 6, bottom: 6, background: RED, color: INK }}>
        es_gato → False
      </div>
    </>
  );
}

/**
 * A rigid checklist that rejects real cats: the function is typed line by
 * line, then a curled-up sleeping cat and a cat in a hat fall over the editor
 * and both get a red cross.
 */
export function Reglas() {
  const t = useClock();
  const start = 0.15;
  const punto = useCue("punto");
  const funciono = useCue("funciono");
  return (
    <Layer>
      <Title y={124} size={32}>Reglas a mano</Title>
      <Card x={36} y={180} w={468} h={300} at={0}>
        <div data-ui="" className="flex items-center gap-[8px] px-[12px] font-mono text-[12px]" style={{ height: 28, borderBottom: "1px solid rgba(255,255,255,0.08)", color: MUTED }}>
          es_gato.py
        </div>
        <div className="px-[14px] pt-[10px]">
          {CODE.map((line, i) => {
            const at = start + i * 0.42;
            const shown = Math.floor(line.text.length * EASE.linear(unit(t, at, 0.36)));
            return (
              <div key={i} data-ui="" className="whitespace-pre font-mono text-[16px] leading-[27px]" style={{ color: line.color }}>
                {line.text.slice(0, shown)}
                {shown > 0 && shown < line.text.length ? <span style={{ color: ACCENT }}>▌</span> : null}
              </div>
            );
          })}
        </div>
      </Card>
      <Photo src="img/gato-dormido.png" x={236} y={500} w={128} h={128} at={funciono} caption="durmiendo">
        <Reject at={punto - 0.35} />
      </Photo>
      <Photo src="img/gato-gorro.png" x={376} y={500} w={128} h={128} at={funciono + 0.25} caption="con gorro">
        <Reject at={punto - 0.1} />
      </Photo>
      <Ilustrativo x={236} y={672} />
    </Layer>
  );
}
