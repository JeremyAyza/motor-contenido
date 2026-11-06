import { EASE, fade, keys, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Coin, Cursor, Illustrative, Layer, Title } from "../parts.tsx";
import { ACCENT, INK, TOKEN } from "../world.tsx";
import { RING, Ring } from "./agente.tsx";

/** Coins burst out of the ring at `at`. */
function Burst({ at, n = 7 }: { at: number; n?: number }) {
  const t = useClock();
  if (t < at || t > at + 0.9) return null;
  const k = EASE.out(unit(t, at, 0.8));
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + at;
        return (
          <div key={i} className="absolute" style={{ left: RING.cx + Math.cos(a) * 170 * k - 15, top: RING.cy + Math.sin(a) * 170 * k - 15, opacity: 1 - k * 0.8 }}>
            <Coin size={30} />
          </div>
        );
      })}
    </>
  );
}

/** One small cabinet of the room of agents. */
function Mini({ x, y, at, t }: { x: number; y: number; at: number; t: number }) {
  const p = Math.min(1, popAt(t, at));
  const on = Math.floor(t * 6 + x) % 3 === 0;
  return (
    <svg className="absolute" width={86} height={70} viewBox="0 0 86 70" style={{ left: x, top: y, transform: `scale(${p})`, overflow: "visible" }} aria-hidden>
      <rect x={1} y={1} width={84} height={68} rx={12} fill="var(--piece-surface)" stroke={TOKEN} strokeWidth={2.5} />
      <rect x={12} y={12} width={62} height={22} rx={5} fill={on ? TOKEN : "rgba(255,79,154,0.35)"} />
      <circle cx={43} cy={50} r={8} fill={on ? ACCENT : "rgba(255,255,255,0.2)"} />
    </svg>
  );
}

export function Vueltas() {
  const t = useClock();
  const vuelta = useCue("vuelta");
  const llamada = useCue("llamada");
  const fichas = useCue("fichas");
  const ahora = useCue("Ahora");
  const doce = useCue("doce");
  const dispara = useCue("dispara");
  const ringOut = fade(t, ahora, 0.3);
  const lapFromAgent = 1.4 + t * 0.9;
  const slide = keys(t, [
    [ahora + 0.5, 1],
    [doce + 0.4, 12],
  ]);
  const agents = Math.round(slide);
  const knobX = 60 + ((slide - 1) / 11) * 340;
  const curve = EASE.in(unit(t, dispara - 0.3, 1.1));
  return (
    <Layer>
      <Title at={0.05} until={ahora - 0.1} y={196} size={42}>
        Cada vuelta, otra <span style={{ color: TOKEN }}>llamada</span>
      </Title>
      {ringOut < 1 ? (
        <div style={{ opacity: 1 - ringOut }}>
          <Ring lap={lapFromAgent} lit={Math.floor(lapFromAgent * 3) % 3} />
          <Burst at={vuelta} />
          <Burst at={llamada} />
          <Burst at={fichas} n={10} />
        </div>
      ) : null}
      <Card at={ahora} y={180} h={100} label="Agentes a la vez">
        <div className="relative" style={{ height: 30 }}>
          <div className="absolute rounded-full" style={{ left: 0, top: 12, width: 400, height: 8, background: "rgba(255,255,255,0.12)" }} />
          <div className="absolute rounded-full" style={{ left: 0, top: 12, width: knobX - 40, height: 8, background: TOKEN }} />
          <div className="absolute rounded-full" style={{ left: knobX - 54, top: 2, width: 28, height: 28, background: INK }} />
          <span className="absolute font-mono font-bold tabular-nums" style={{ right: 0, top: -2, fontSize: 26, color: TOKEN }}>
            {agents}
          </span>
        </div>
      </Card>
      {t >= ahora ? (
        <Cursor
          path={[
            [ahora + 0.3, 96, 236],
            [ahora + 0.5, 96, 236],
            [doce + 0.4, 436, 236],
            [doce + 1.2, 470, 300],
          ]}
          clicks={[ahora + 0.45]}
        />
      ) : null}
      {t >= ahora
        ? Array.from({ length: 12 }, (_, i) => {
            if (i >= agents) return null;
            return <Mini key={i} t={t} at={ahora + 0.5 + (i / 11) * (doce - ahora)} x={52 + (i % 4) * 112} y={300 + Math.floor(i / 4) * 86} />;
          })
        : null}
      <Card at={Math.max(ahora + 0.6, dispara - 0.6)} y={568} h={182} label="Tokens por semana">
        <svg width={436} height={120} viewBox="0 0 436 120" style={{ overflow: "visible" }} aria-hidden>
          <path d="M 0 118 L 436 118" stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
          <path d={`M 0 112 C 120 110, 220 104, 290 90 S 400 ${40 - curve * 120}, 436 ${30 - curve * 150}`} fill="none" stroke={TOKEN} strokeWidth={5} strokeLinecap="round" strokeDasharray={`${180 + curve * 400} 9999`} />
        </svg>
      </Card>
      <Illustrative at={ahora} y={756} />
    </Layer>
  );
}
