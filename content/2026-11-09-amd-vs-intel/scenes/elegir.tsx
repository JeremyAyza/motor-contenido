import { EASE, fade, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Check, Layer, Mono, Title } from "../parts.tsx";
import { ACCENT, AMD, CACHE, DIM, INK, INTEL, INTEL_TEXT, LINE, MUTED } from "../world.tsx";

const TX = 200;
const TW = 304;
const ROWS = ["JUEGOS", "EDICIÓN Y MULTITAREA", "LAPTOPS"];
const TASKS: Array<{ name: string; w: number }> = [
  { name: "EXPORTAR", w: 0.9 },
  { name: "NAVEGADOR", w: 0.5 },
  { name: "STREAM", w: 0.7 },
  { name: "COMPILAR", w: 0.8 },
];

/** Which one to pick: a decision table lit row by row, each row with its reason under it. */
export function Elegir() {
  const t = useClock();
  const jugar = useCue("jugar");
  const vencer = useCue("vencer");
  const editar = useCue("editar");
  const nucleos = useCue("núcleos");
  const quick = useCue("Quick");
  const laptops = useCue("laptops");
  const table = EASE.out(unit(t, 0.05, 0.4));
  const rowOn = [EASE.out(unit(t, jugar - 0.1, 0.3)), EASE.out(unit(t, editar - 0.1, 0.3)), EASE.out(unit(t, laptops - 0.1, 0.3))];
  const games = fade(t, jugar, 0.3) * (1 - fade(t, editar - 0.25, 0.2));
  const edit = fade(t, editar, 0.3) * (1 - fade(t, laptops - 0.25, 0.2));
  const laptop = fade(t, laptops, 0.3);
  const tint = [AMD, INTEL, ACCENT];
  return (
    <Layer>
      <Title>¿Cuál elegir?</Title>
      <Card x={TX} y={210} w={TW} h={260} style={{ opacity: table }}>
        <div className="flex h-[44px] items-center border-b px-3 font-mono text-[14px] font-bold" style={{ borderColor: LINE }}>
          <span className="w-[130px]" style={{ color: DIM }}>
            USO
          </span>
          <span className="w-[80px] text-center" style={{ color: AMD }}>
            AMD
          </span>
          <span className="w-[70px] text-center" style={{ color: INTEL }}>
            INTEL
          </span>
        </div>
        {ROWS.map((row, i) => (
          <div key={row} className="relative flex h-[72px] items-center px-3" style={{ background: rowOn[i] > 0 && (i === 0 ? t < editar : i === 1 ? t < laptops : true) ? `color-mix(in srgb, ${tint[i]} ${Math.round(16 * rowOn[i])}%, transparent)` : "transparent", borderBottom: i < 2 ? `1px solid ${LINE}` : "none" }}>
            <span className="w-[130px] font-mono text-[14px] font-bold leading-tight" style={{ color: rowOn[i] > 0.5 ? INK : MUTED }}>
              {row}
            </span>
            <span className="relative h-[40px] w-[80px]">
              {i === 0 ? <Check x={40} y={20} color={AMD} p={popAt(t, vencer - 0.3)} size={34} /> : null}
              {i === 2 ? (
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[12px] font-bold leading-tight" style={{ color: MUTED, opacity: rowOn[2], textAlign: "center" }}>
                  SEGÚN MODELO
                </span>
              ) : null}
            </span>
            <span className="relative h-[40px] w-[70px]">
              {i === 1 ? <Check x={35} y={20} color={INTEL} p={popAt(t, nucleos - 0.2)} size={34} /> : null}
              {i === 2 ? (
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[12px] font-bold leading-tight" style={{ color: MUTED, opacity: rowOn[2], textAlign: "center" }}>
                  SEGÚN MODELO
                </span>
              ) : null}
            </span>
          </div>
        ))}
      </Card>
      {games > 0 ? (
        <div className="absolute inset-0" style={{ opacity: games }}>
          <div data-ui="" className="absolute rounded-[8px] px-4 py-2 font-mono text-[20px] font-bold" style={{ left: TX, top: 500, color: AMD, border: `1.5px solid ${AMD}`, transform: `scale(${Math.min(1.08, popAt(t, vencer - 0.2))})` }}>
            3D V-CACHE
          </div>
          <div className="absolute rounded-full" style={{ left: TX, top: 570, width: TW, height: 18, background: "#1A2030" }}>
            <div className="h-full rounded-full" style={{ width: TW * EASE.out(unit(t, vencer - 0.1, 0.6)), background: CACHE }} />
          </div>
          <Mono x={TX} y={598} size={14} color={CACHE}>
            96 MB DE L3
          </Mono>
        </div>
      ) : null}
      {edit > 0 ? (
        <div className="absolute inset-0" style={{ opacity: edit }}>
          <Card x={36} y={496} w={468} h={96}>
            {["V2", "V1", "A1"].map((track, i) => (
              <div key={track} className="absolute flex items-center" style={{ left: 12, top: 10 + i * 27, width: 444 }}>
                <span className="w-[34px] font-mono text-[13px] font-bold" style={{ color: MUTED }}>
                  {track}
                </span>
                <span className="h-[18px] rounded-[3px]" style={{ width: 400 * EASE.out(unit(t, editar + i * 0.1, 0.8)), background: i === 2 ? "#2F7A5A" : INTEL_TEXT, opacity: 0.8 }} />
              </div>
            ))}
            <div className="absolute" style={{ left: 46 + ((t - editar) * 90) % 400, top: 4, width: 2, height: 88, background: "#FFFFFF" }} />
          </Card>
          {TASKS.map((task, i) => (
            <Card key={task.name} x={36 + i * 119} y={606} w={111} h={66}>
              <Mono x={8} y={8} size={12} color={INK}>
                {task.name}
              </Mono>
              <div className="absolute rounded-full" style={{ left: 8, top: 40, width: 95, height: 10, background: "#1A2030" }}>
                <div className="h-full rounded-full" style={{ width: 95 * task.w * EASE.out(unit(t, nucleos - 0.2 + i * 0.1, 0.5)), background: INTEL }} />
              </div>
            </Card>
          ))}
          <div data-ui="" className="absolute rounded-[8px] px-4 py-2 font-mono text-[20px] font-bold" style={{ left: 36, top: 690, color: INTEL_TEXT, border: `1.5px solid ${INTEL}`, opacity: Math.min(1, popAt(t, quick - 0.1) * 2) }}>
            QUICK SYNC
          </div>
        </div>
      ) : null}
      {laptop > 0 ? (
        <div className="absolute inset-0" style={{ opacity: laptop }}>
          <svg className="absolute" width={300} height={200} viewBox="0 0 300 200" style={{ left: 120, top: 500 }} aria-hidden>
            <rect x={40} y={10} width={220} height={140} rx={8} fill="none" stroke={INK} strokeWidth={3} />
            <path d="M 10 170 L 290 170 L 270 150 L 30 150 Z" fill="none" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
            <rect x={110} y={50} width={80} height={44} rx={5} fill="none" stroke={MUTED} strokeWidth={2} />
            <rect x={190} y={63} width={6} height={18} rx={2} fill={MUTED} />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={115 + i * 18.5} y={55} width={15} height={34} rx={2} fill={CACHE} opacity={EASE.out(unit(t, laptops + 0.2 + i * 0.15, 0.2))} />
            ))}
          </svg>
          <Mono x={270} y={700} center width={300} size={15} color={MUTED}>
            DEPENDE DEL MODELO
          </Mono>
        </div>
      ) : null}
    </Layer>
  );
}
