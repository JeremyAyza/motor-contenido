import { Logo } from "@motor/ui";
import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Cursor, Illustrative, Layer, LevelSplash } from "../parts.tsx";
import { ACCENT, INK, TOKEN } from "../world.tsx";

const MESSAGE = "Explícame qué es un token, porfa.";
/** An illustrative split: a tokenizer cuts Spanish into pieces like these. */
const CHIPS = ["Expl", "ícame", " qué", " es", " un", " token", ",", " por", "fa", "."];
const TINTS = ["#FF4F9A", "#B98CFF", "#3EE6C4", "#FFC857", "#6FB7FF"];

function chipLayout() {
  const rows = [CHIPS.slice(0, 5), CHIPS.slice(5)];
  const out: Array<{ text: string; x: number; y: number; w: number }> = [];
  rows.forEach((row, r) => {
    const widths = row.map((c) => Math.max(36, c.trim().length * 17 + 26));
    const total = widths.reduce((a, b) => a + b, 0) + (row.length - 1) * 10;
    let x = 270 - total / 2;
    row.forEach((c, i) => {
      out.push({ text: c, x, y: 530 + r * 70, w: widths[i] });
      x += widths[i] + 10;
    });
  });
  return out;
}

export function Token() {
  const t = useClock();
  const escribes = useCue("escribes");
  const models = [
    { slug: "openai", name: "ChatGPT", at: useCue("ChatGPT") },
    { slug: "claude", name: "Claude", at: useCue("Claude") },
    { slug: "googlegemini", name: "Gemini", at: useCue("Gemini") },
  ];
  const pedazos = useCue("pedazos");
  const palabra = useCue("palabra");
  const parte = useCue("parte");
  const caracter = useCue("carácter");
  const typed = MESSAGE.slice(0, Math.floor(MESSAGE.length * unit(t, escribes, Math.max(0.6, pedazos - escribes - 0.3))));
  const chips = chipLayout();
  const split = EASE.out(unit(t, pedazos, 0.5));
  const target = (i: number) => [chips[i].x + chips[i].w / 2, chips[i].y + 30] as const;
  const pointed = t >= caracter ? 6 : t >= parte ? 1 : t >= palabra ? 5 : -1;
  const pointLabel = t >= caracter ? "un carácter" : t >= parte ? "parte de palabra" : "una palabra";
  const chatAt = Math.max(1.5, escribes - 0.5);
  return (
    <Layer>
      <LevelSplash n={1} name="La ficha" until={1.4} />
      <Card at={chatAt} y={190} h={290} label="Chat">
        <div className="flex" style={{ gap: 8, marginBottom: 18 }}>
          {models.map((m, i) => {
            const active = models.filter((x) => t >= x.at).length - 1 === i;
            return (
              <div key={m.slug} className="flex items-center rounded-full" style={{ gap: 8, padding: "6px 12px", border: `2px solid ${active ? ACCENT : "rgba(255,255,255,0.14)"}`, background: active ? "rgba(62,230,196,0.12)" : "transparent" }}>
                <Logo slug={m.slug} size={20} chip={m.slug === "openai" ? "#FFFFFF" : undefined} ancla={false} />
                <span className="font-sans font-bold" style={{ fontSize: 16, color: INK }}>
                  {m.name}
                </span>
              </div>
            );
          })}
        </div>
        <div className="rounded-2xl font-sans" style={{ marginLeft: 70, padding: "14px 16px", fontSize: 22, lineHeight: 1.25, background: "rgba(255,255,255,0.08)", color: INK, minHeight: 66, opacity: t >= pedazos ? 1 - split * 0.7 : 1 }}>
          {typed}
          {t < pedazos && Math.floor(t * 3) % 2 === 0 ? <span style={{ color: ACCENT }}>▍</span> : null}
        </div>
        <div className="flex justify-end" style={{ marginTop: 14 }}>
          <span className="rounded-full font-mono font-bold uppercase" style={{ fontSize: 13, letterSpacing: "0.12em", padding: "6px 14px", background: t >= pedazos - 0.3 ? ACCENT : "rgba(255,255,255,0.1)", color: t >= pedazos - 0.3 ? "#120E1F" : INK }}>
            Enviar
          </span>
        </div>
      </Card>
      {t >= pedazos
        ? chips.map((c, i) => {
            const p = Math.min(1, popAt(t, pedazos + i * 0.06));
            const lit = i === pointed;
            return (
              <div
                key={i}
                data-ui=""
                className="absolute flex items-center justify-center rounded-xl font-mono font-bold"
                style={{ left: c.x, top: c.y - (1 - split) * 120, width: c.w, height: 52, fontSize: 24, whiteSpace: "pre", background: TINTS[i % TINTS.length], color: "#120E1F", opacity: p, transform: `scale(${(0.6 + 0.4 * p) * (lit ? 1.14 : 1)})`, boxShadow: lit ? `0 0 0 4px ${INK}` : undefined }}
              >
                {c.text.trim() || "␣"}
              </div>
            );
          })
        : null}
      {pointed >= 0 ? (
        <div data-ui="" className="absolute text-center font-mono font-bold uppercase" style={{ left: 36, top: 680, width: 468, fontSize: 20, letterSpacing: "0.12em", color: TOKEN }}>
          ↑ {pointLabel}
        </div>
      ) : null}
      <Cursor
        path={[
          [pedazos + 0.3, 420, 700],
          [palabra, target(5)[0], target(5)[1]],
          [parte, target(1)[0], target(1)[1]],
          [caracter, target(6)[0], target(6)[1]],
        ]}
        clicks={[palabra + 0.15, parte + 0.15, caracter + 0.15]}
      />
      <Illustrative at={pedazos} y={740} />
    </Layer>
  );
}
