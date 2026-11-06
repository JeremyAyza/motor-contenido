import { Logo } from "@motor/ui";
import { popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Coin, Illustrative, Layer, LevelSplash } from "../parts.tsx";
import { ACCENT, INK, TOKEN } from "../world.tsx";

/** The agentic loop of Claude Code's docs: gather context, act, verify, and again until it is done. */
export const PHASES = [
  { name: "Entender", angle: -90 },
  { name: "Cambiar", angle: 30 },
  { name: "Verificar", angle: 150 },
];
export const RING = { cx: 270, cy: 560, r: 118 };

/** The ring: a coin runs it lap after lap; `lap` is how far it has gone (1 = one lap). */
export function Ring({ lap, lit, scale = 1 }: { lap: number; lit: number; scale?: number }) {
  const a = ((lap % 1) * 360 - 90) * (Math.PI / 180);
  return (
    <div className="absolute" style={{ left: RING.cx - 180, top: RING.cy - 180, width: 360, height: 360, transform: `scale(${scale})` }}>
      <svg width={360} height={360} viewBox="0 0 360 360" className="absolute" aria-hidden>
        <circle cx={180} cy={180} r={RING.r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={14} />
        <circle cx={180} cy={180} r={RING.r} fill="none" stroke={TOKEN} strokeWidth={14} strokeDasharray={`${(lap % 1) * 2 * Math.PI * RING.r} 9999`} transform="rotate(-90 180 180)" strokeLinecap="round" opacity={0.75} />
      </svg>
      {PHASES.map((ph, i) => {
        const rad = (ph.angle * Math.PI) / 180;
        const on = i <= lit;
        return (
          <div
            key={ph.name}
            data-ui=""
            className="absolute rounded-full font-mono font-bold uppercase"
            style={{ left: 180 + Math.cos(rad) * RING.r, top: 180 + Math.sin(rad) * RING.r, transform: "translate(-50%, -50%)", padding: "8px 14px", fontSize: 15, letterSpacing: "0.08em", background: on ? ACCENT : "var(--piece-surface)", color: on ? "#120E1F" : INK, border: "2px solid rgba(255,255,255,0.18)" }}
          >
            {ph.name}
          </div>
        );
      })}
      <div className="absolute" style={{ left: 180 + Math.cos(a) * RING.r - 17, top: 180 + Math.sin(a) * RING.r - 17 }}>
        <Coin size={34} />
      </div>
      <div data-ui="" className="absolute text-center font-mono font-bold uppercase" style={{ left: 120, top: 160, width: 120, fontSize: 18, color: INK }}>
        Vuelta {Math.max(1, Math.floor(lap) + 1)}
      </div>
    </div>
  );
}

export function Agente() {
  const t = useClock();
  const claude = useCue("Claude");
  const pides = useCue("pides");
  const ciclo = useCue("ciclo");
  const lee = useCue("lee");
  const cambios = useCue("cambios");
  const verifica = useCue("verifica");
  const repite = useCue("repite");
  const prompt = "Agrega una función nueva";
  const typed = prompt.slice(0, Math.floor(prompt.length * unit(t, pides, 0.9)));
  const lap = t < lee ? 0 : t < repite ? ((t - lee) / Math.max(0.5, repite - lee)) * 0.98 : 0.98 + (t - repite) * 0.9;
  const lit = t >= verifica ? 2 : t >= cambios ? 1 : t >= lee ? 0 : -1;
  return (
    <Layer>
      <LevelSplash n={2} name="Un dev, un agente" until={1.5} />
      <Card at={Math.max(1.6, claude - 0.3)} y={180} h={200} label="Claude Code" border="#D97757">
        <div className="absolute" style={{ right: 16, top: 12 }}>
          <Logo slug="claude" size={36} ancla={false} />
        </div>
        <div className="font-mono" style={{ fontSize: 20, color: INK, lineHeight: 1.4 }}>
          <span style={{ color: "#D97757" }}>&gt; </span>
          {typed}
          {t >= pides && t < ciclo && Math.floor(t * 3) % 2 === 0 ? <span style={{ color: ACCENT }}>▍</span> : null}
        </div>
        {t >= ciclo ? (
          <div className="font-mono" style={{ fontSize: 16, color: "var(--piece-muted)", marginTop: 12, opacity: Math.min(1, popAt(t, ciclo)) }}>
            ✻ Trabajando… vuelta {Math.max(1, Math.floor(lap) + 1)}
          </div>
        ) : null}
      </Card>
      <Illustrative at={Math.max(1.6, claude - 0.3)} y={744} />
      {t >= ciclo ? (
        <div style={{ opacity: Math.min(1, popAt(t, ciclo) * 2) }}>
          <Ring lap={lap} lit={lit} />
        </div>
      ) : null}
    </Layer>
  );
}
