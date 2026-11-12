import { EASE, fade, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Layer, Mark, Mono, Title } from "../parts.tsx";
import { AMD, DIM, INK, INTEL, MUTED } from "../world.tsx";

function Box({ x, y, label, color, p, sub }: { x: number; y: number; label: string; color: string; p: number; sub?: string }) {
  return (
    <Card x={x} y={y} w={136} h={96} active={color} style={{ opacity: Math.min(1, p * 2), transform: `scale(${0.85 + 0.15 * Math.min(1, p)})` }}>
      <div className="flex h-full flex-col items-center justify-center gap-1">
        {sub ? (
          <span className="font-mono text-[16px] font-bold" style={{ color: INK }}>
            {sub}
          </span>
        ) : null}
        <span className="font-mono text-[18px] font-bold tracking-[0.08em]" style={{ color }}>
          {label}
        </span>
      </div>
    </Card>
  );
}

function Arrow({ x, y, p, color }: { x: number; y: number; p: number; color: string }) {
  return (
    <svg className="absolute" width={48} height={24} style={{ left: x, top: y }} aria-hidden>
      <path d="M 2 12 L 40 12 M 30 4 L 42 12 L 30 20" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} strokeDashoffset={60 * (1 - p)} />
    </svg>
  );
}

/** A factory in thin line, its chimneys puffing, in the color of whoever runs it. */
function Factory({ x, y, color, p, t }: { x: number; y: number; color: string; p: number; t: number }) {
  return (
    <svg className="absolute" width={260} height={200} viewBox="0 0 260 200" style={{ left: x, top: y, opacity: p, overflow: "visible" }} aria-hidden>
      <path d="M 10 190 L 10 100 L 70 130 L 70 100 L 130 130 L 130 100 L 190 130 L 190 40 L 220 40 L 220 190 Z" fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" />
      <path d="M 0 190 L 260 190" stroke={color} strokeWidth={3} strokeLinecap="round" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={30 + i * 55} y={150} width={24} height={20} rx={3} fill={color} opacity={0.35 + 0.35 * Math.abs(Math.sin(t * 2 + i))} />
      ))}
      {[0, 1, 2].map((i) => {
        const k = (t * 0.6 + i / 3) % 1;
        return <circle key={`s${i}`} cx={205 + k * 18} cy={30 - k * 40} r={8 + k * 10} fill={color} opacity={0.3 * (1 - k)} />;
      })}
    </svg>
  );
}

/** Who makes the chips: Intel designs and builds them; AMD designs and TSMC builds. */
export function Fabrica() {
  const t = useClock();
  const disena = useCue("diseña");
  const fabrica = useCue("fabrica");
  const amd = useCue("AMD");
  const disena2 = useCue("diseña", 2);
  const fabrica2 = useCue("fabrica", 2);
  const intelOut = fade(t, amd - 0.25, 0.2);
  const amdIn = EASE.out(unit(t, amd - 0.1, 0.3));
  return (
    <Layer>
      <Title>¿Quién los fabrica?</Title>
      {intelOut < 1 ? (
        <div className="absolute inset-0" style={{ opacity: 1 - intelOut }}>
          <Mark brand="intel" size={96} x={208} y={210} />
          <Box x={208} y={330} label="DISEÑA" color={INTEL} p={popAt(t, disena - 0.1)} />
          <Arrow x={348} y={366} p={EASE.out(unit(t, fabrica - 0.2, 0.3))} color={INTEL} />
          <Box x={368} y={330} label="FABRICA" color={INTEL} p={popAt(t, fabrica)} sub="fábricas propias" />
          <Mono x={208} y={450} size={14} color={MUTED} style={{ opacity: EASE.out(unit(t, fabrica + 0.4, 0.3)) }}>
            TODO EN CASA
          </Mono>
          <Factory x={236} y={500} color={INTEL} p={0.3 + 0.7 * EASE.out(unit(t, fabrica, 0.4))} t={t} />
        </div>
      ) : null}
      {t >= amd - 0.1 ? (
        <div className="absolute inset-0" style={{ opacity: amdIn }}>
          <Mark brand="amd" size={120} x={208} y={222} />
          <Box x={208} y={330} label="DISEÑA" color={AMD} p={popAt(t, disena2 - 0.1)} />
          <Arrow x={348} y={366} p={EASE.out(unit(t, fabrica2 - 0.2, 0.3))} color={MUTED} />
          <Box x={368} y={330} label="FABRICA" color={DIM} p={popAt(t, fabrica2 + 0.05)} sub="TSMC" />
          <Mono x={208} y={450} size={14} color={MUTED} style={{ opacity: EASE.out(unit(t, fabrica2 + 0.3, 0.3)) }}>
            LO ENCARGA A TSMC
          </Mono>
          <Factory x={236} y={500} color={MUTED} p={EASE.out(unit(t, fabrica2, 0.4))} t={t} />
        </div>
      ) : null}
    </Layer>
  );
}
