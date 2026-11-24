import { EASE, unit, useClock, useCue } from "@motor/video";
import { Card, Chip, Cover, Layer, Mono, Person, Title, useOn } from "../parts.tsx";
import { G, INK, LINE, MUTED } from "../world.tsx";

/**
 * Batch: the signals fall in as chips; three similar listeners get tied to
 * three covers; a night batch job fills its bar; "EN CADA APERTURA" is crossed
 * out next to "UNA VEZ, EN LOTE".
 */
export function Lotes() {
  const t = useClock();
  const signals = [
    { at: useCue("historial"), text: "Historial", x: 170, y: 190 },
    { at: useCue("saltas"), text: "Saltos", x: 370, y: 190 },
    { at: useCue("gusta"), text: "Me gusta", x: 170, y: 260 },
    { at: useCue("playlists"), text: "Playlists", x: 370, y: 260 },
  ];
  const gente = useCue("gente");
  const calcula = useCue("calcula");
  const lote = useCue("lote");
  const abres = useCue("abres");
  const demasiado = useCue("demasiado");
  const users = useOn(gente - 0.2, 0.25) * (1 - useOn(calcula - 0.3, 0.2));
  const fill = EASE.inOut(unit(t, lote - 0.2, 2.2));
  return (
    <Layer>
      <Mono x={270} y={140} at={0.05} until={gente - 0.2}>Señales</Mono>
      {signals.map((s) => (
        <Chip key={s.text} x={s.x} y={s.y} at={s.at - 0.1} until={gente - 0.2} size={17}>{s.text}</Chip>
      ))}
      <Title text="Lo que escuchas y saltas" at={0.1} until={gente - 0.2} size={34} />

      {users > 0 ? (
        <div className="absolute left-0 top-0" style={{ width: 540, height: 960, opacity: users }}>
          {[0, 1, 2].map((i) => {
            const y = 170 + i * 100;
            const line = EASE.out(unit(t, gente + 0.2 + i * 0.15, 0.4));
            return (
              <div key={i}>
                <Person x={90} y={y + 8} s={2.2} />
                <svg className="absolute left-0 top-0" width={540} height={600} style={{ overflow: "visible" }} aria-hidden>
                  <line x1={140} y1={y + 32} x2={140 + (300 - 140) * line} y2={y + 32 + ([1, 1, -2][i] * 100) * line} stroke={G} strokeWidth={1.5} strokeOpacity={0.7} />
                </svg>
                <Cover n={[6, 12, 10][i]} x={300} y={170 + [1, 2, 0][i] * 100 + 4} size={56} at={gente + 0.3 + i * 0.15} />
              </div>
            );
          })}
          <Mono x={270} y={480} at={gente}>Usuarios parecidos</Mono>
        </div>
      ) : null}
      <Title text="Gente que escucha parecido" at={gente} until={calcula - 0.3} />

      <Card x={110} y={160} w={320} h={130} at={calcula - 0.2} glow={fill >= 1}>
        <div data-ui="" className="absolute left-0 right-0 top-[22px] text-center font-mono text-[18px] font-bold tracking-[0.12em]" style={{ color: INK }}>⚙ TRABAJO EN LOTE</div>
        <div className="absolute left-[24px] top-[68px] h-[12px] w-[272px] rounded-[3px]" style={{ background: "#16201B" }} />
        <div className="absolute left-[24px] top-[68px] h-[12px] rounded-[3px]" style={{ width: 272 * fill, background: G, boxShadow: `0 0 10px ${G}` }} />
        <div data-ui="" className="absolute left-0 right-0 top-[94px] text-center font-mono text-[12px] font-bold tracking-[0.12em]" style={{ color: MUTED }}>DE NOCHE, NO EN CADA TOQUE</div>
      </Card>
      <Chip x={170} y={360} at={abres - 0.2} crossed={abres + 0.4} size={15} border={LINE}>En cada apertura</Chip>
      <Chip x={380} y={360} at={abres + 0.1} solid size={15}>Una vez, en lote</Chip>
      <Title text="Se calcula antes" at={calcula} until={demasiado - 0.15} />
      <Title text="Costaría demasiado" at={demasiado} />
    </Layer>
  );
}
