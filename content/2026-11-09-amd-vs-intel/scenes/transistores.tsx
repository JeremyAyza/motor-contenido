import { EASE, fade, keys, unit, useClock, useCue } from "@motor/video";
import { BigWord, Card, Footnote, Layer, Mono, Title } from "../parts.tsx";
import { ACCENT, CACHE, DIM, INK, LINE, MUTED } from "../world.tsx";

const COPPER = "#C46A3A";

/** Billions of switches: copper wiring, one transistor as a switch, then smaller ones packed denser. */
export function Transistores() {
  const t = useClock();
  const miles = useCue("miles");
  const interruptores = useCue("interruptores");
  const chicos = useCue("chicos");
  const caben = useCue("caben");
  const gastan = useCue("gastan");
  const wires = 1 - fade(t, interruptores - 0.25, 0.2);
  const tr = fade(t, interruptores - 0.1, 0.2) * (1 - fade(t, chicos - 0.25, 0.2));
  const grid = fade(t, chicos - 0.1, 0.2);
  const on = EASE.out(unit(t, interruptores + 0.9, 0.25));
  const dense = EASE.inOut(unit(t, caben - 0.1, 0.5));
  const energy = keys(t, [[gastan - 0.1, 1], [gastan + 0.6, 0.35]]);
  return (
    <Layer>
      {wires > 0 ? (
        <div className="absolute inset-0" style={{ opacity: wires }}>
          <svg className="absolute" width={540} height={960} aria-hidden>
            {Array.from({ length: 16 }, (_, i) => {
              const y = 300 + i * 28;
              const shift = (t * 40 + i * 37) % 120;
              return <path key={i} d={`M ${-shift} ${y} L ${140 - shift} ${y} L ${170 - shift} ${y + 14} L ${420 - shift} ${y + 14} L ${450 - shift} ${y} L ${700 - shift} ${y}`} fill="none" stroke={COPPER} strokeWidth={i % 3 === 0 ? 5 : 2.5} opacity={0.35 + 0.25 * Math.sin(t * 2 + i)} />;
            })}
          </svg>
          <BigWord y={150} size={60} color={INK} on={EASE.out(unit(t, miles - 0.1, 0.5))}>
            MILES DE
            <br />
            MILLONES
          </BigWord>
          <Mono x={36} y={760} size={14} color={MUTED}>
            CABLEADO DE COBRE · ESQUEMA
          </Mono>
        </div>
      ) : null}
      {tr > 0 ? (
        <div className="absolute inset-0" style={{ opacity: tr }}>
          <Title>Un transistor es un interruptor</Title>
          <svg className="absolute" width={468} height={300} viewBox="0 0 468 300" style={{ left: 36, top: 260 }} aria-hidden>
            <rect x={40} y={170} width={388} height={110} rx={8} fill="#1A2030" />
            <rect x={60} y={150} width={110} height={50} rx={6} fill="#2A3348" />
            <rect x={298} y={150} width={110} height={50} rx={6} fill="#2A3348" />
            <rect x={180} y={keys(t, [[interruptores + 0.6, 70], [interruptores + 0.9, 96]])} width={108} height={54} rx={6} fill={ACCENT} opacity={0.4 + 0.6 * on} />
            <rect x={170} y={150} width={128} height={4} fill={LINE} />
            {Array.from({ length: 6 }, (_, i) => {
              const p = ((t * 0.9 + i / 6) % 1) * on;
              return on > 0 ? <circle key={i} cx={130 + p * 210} cy={186} r={6} fill={CACHE} opacity={on} /> : null;
            })}
          </svg>
          <Mono x={151} y={480} center width={130} size={14}>
            FUENTE
          </Mono>
          <Mono x={270} y={300} center width={160} size={14} color={ACCENT}>
            COMPUERTA
          </Mono>
          <Mono x={389} y={480} center width={130} size={14}>
            DRENADOR
          </Mono>
          <Card x={110} y={600} w={320} h={56}>
            <div className="flex h-full items-center justify-center gap-3 font-mono text-[18px] font-bold">
              <span style={{ color: on > 0.5 ? DIM : INK }}>APAGADO</span>
              <span className="relative h-[26px] w-[48px] rounded-full" style={{ background: on > 0.5 ? CACHE : "#2A3348" }}>
                <span className="absolute top-[3px] h-[20px] w-[20px] rounded-full bg-white" style={{ left: 3 + 22 * on }} />
              </span>
              <span style={{ color: on > 0.5 ? CACHE : DIM }}>ENCENDIDO</span>
            </div>
          </Card>
        </div>
      ) : null}
      {grid > 0 ? (
        <div className="absolute inset-0" style={{ opacity: grid }}>
          <Title>Más chicos, más por chip</Title>
          <svg className="absolute" width={300} height={300} viewBox="0 0 300 300" style={{ left: 36, top: 250 }} aria-hidden>
            <rect x={0} y={0} width={300} height={300} rx={8} fill="none" stroke={LINE} strokeWidth={2} strokeDasharray="6 6" />
            {Array.from({ length: 16 }, (_, i) => (
              <rect key={`a${i}`} x={(i % 4) * 75 + 5} y={Math.floor(i / 4) * 75 + 5} width={65} height={65} rx={5} fill={ACCENT} opacity={0.75 * (1 - dense)} />
            ))}
            {Array.from({ length: 64 }, (_, i) => (
              <rect key={`b${i}`} x={(i % 8) * 37.5 + 3} y={Math.floor(i / 8) * 37.5 + 3} width={31} height={31} rx={4} fill={ACCENT} opacity={0.75 * dense} />
            ))}
          </svg>
          <div className="absolute font-display font-black leading-none" style={{ left: 360, top: 262, fontSize: 72, color: INK }}>
            {dense < 0.5 ? 16 : 64}
          </div>
          <Mono x={352} y={344} size={18} color={INK}>
            MISMA ÁREA
          </Mono>
          <Mono x={352} y={430} size={17} color={INK}>
            ENERGÍA POR
            <br />
            CAMBIO
          </Mono>
          <div className="absolute rounded-full" style={{ left: 352, top: 486, width: 140, height: 14, background: "#1A2030" }}>
            <div className="h-full rounded-full" style={{ width: 140 * energy, background: CACHE }} />
          </div>
          <Footnote y={590}>Ejemplo ilustrativo</Footnote>
        </div>
      ) : null}
    </Layer>
  );
}
