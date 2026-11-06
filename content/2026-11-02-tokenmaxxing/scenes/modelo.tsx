import { EASE, lerp, unit, useClock, useCue } from "@motor/video";
import { Coin, Layer, Title } from "../parts.tsx";
import { ACCENT, INK, TOKEN } from "../world.tsx";

/** The model swallows tokens through one slot and pays out tokens through the other; both stacks are charged. */
function Stack({ x, n, color, label }: { x: number; n: number; color: string; label: string }) {
  return (
    <div className="absolute" style={{ left: x, top: 470, width: 120 }}>
      <div className="relative" style={{ height: 230 }}>
        {Array.from({ length: Math.floor(n) }, (_, i) => (
          <div key={i} className="absolute rounded-full" style={{ left: 18 + (i % 2) * 6, bottom: i * 11, width: 84, height: 18, background: color, border: "2px solid rgba(18,14,31,0.5)" }} />
        ))}
      </div>
      <div data-ui="" className="text-center font-mono font-bold uppercase" style={{ fontSize: 16, letterSpacing: "0.12em", color, marginTop: 10 }}>
        {label}
      </div>
    </div>
  );
}

export function Modelo() {
  const t = useClock();
  const lee = useCue("lee");
  const responde = useCue("responde");
  const entran = useCue("entran");
  const salen = useCue("salen");
  const texto = useCue("texto");
  const grow = EASE.out(unit(t, texto, 1.4));
  const inStack = (t >= entran ? 4 : 0) + grow * 14;
  const outStack = (t >= salen ? 4 : 0) + grow * 16;
  return (
    <Layer>
      <svg className="absolute" width={200} height={180} viewBox="0 0 200 180" style={{ left: 170, top: 200, overflow: "visible" }} aria-hidden>
        <rect x={0} y={0} width={200} height={180} rx={26} fill="var(--piece-surface)" stroke={INK} strokeOpacity={0.3} strokeWidth={3} />
        <rect x={-14} y={70} width={28} height={40} rx={6} fill={TOKEN} />
        <rect x={186} y={70} width={28} height={40} rx={6} fill={ACCENT} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={70 + i * 30} cy={128} r={8} fill={Math.floor(t * 4 + i) % 3 === 0 ? ACCENT : "rgba(255,255,255,0.2)"} />
        ))}
      </svg>
      <div data-ui="" className="absolute text-center font-display font-black uppercase" style={{ left: 170, top: 240, width: 200, fontSize: 30, color: INK }}>
        Modelo
      </div>
      <div data-ui="" className="absolute font-mono font-bold uppercase" style={{ left: 40, top: 236, fontSize: 14, letterSpacing: "0.12em", color: TOKEN }}>
        Entrada
      </div>
      <div data-ui="" className="absolute text-right font-mono font-bold uppercase" style={{ left: 380, top: 236, width: 124, fontSize: 14, letterSpacing: "0.12em", color: ACCENT }}>
        Salida
      </div>
      {[0, 1, 2, 3, 4].map((i) => {
        const s = lee + i * 0.18;
        const k = EASE.inOut(unit(t, s, 0.5));
        if (t < s || k >= 1) return null;
        return (
          <div key={`in${i}`} className="absolute" style={{ left: lerp(40, 160, k), top: 270 + Math.sin(k * Math.PI) * -30 }}>
            <Coin size={30} />
          </div>
        );
      })}
      {[0, 1, 2, 3, 4].map((i) => {
        const s = responde + i * 0.18;
        const k = EASE.inOut(unit(t, s, 0.5));
        if (t < s || k >= 1) return null;
        return (
          <div key={`out${i}`} className="absolute" style={{ left: lerp(380, 480, k), top: 270 + Math.sin(k * Math.PI) * -30 }}>
            <Coin size={30} color={ACCENT} />
          </div>
        );
      })}
      <Stack x={90} n={inStack} color={TOKEN} label="Se cobra" />
      <Stack x={330} n={outStack} color={ACCENT} label="Se cobra" />
      <Title at={texto - 0.2} y={410} size={40}>
        Más texto, más <span style={{ color: TOKEN }}>tokens</span>
      </Title>
    </Layer>
  );
}
