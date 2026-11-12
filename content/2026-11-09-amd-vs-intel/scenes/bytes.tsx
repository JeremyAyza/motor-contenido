import { DrawPath, EASE, fade, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Check, Cpu, Layer, Mono, Title } from "../parts.tsx";
import { ACCENT, AMD, DIM, INK, INTEL, MUTED } from "../world.tsx";

/*
 * Real x86 encodings (Intel SDM, ADD r/m32,r32 = 01 /r; MOV r/m32,r32 = 89 /r;
 * JMP rel8 = EB cb): with eax and ebx the ModR/M byte is D8.
 */
const ROWS: Array<{ asm: string; bytes: string }> = [
  { asm: "add eax, ebx", bytes: "01 D8" },
  { asm: "mov eax, ebx", bytes: "89 D8" },
  { asm: "jmp fin", bytes: "EB 05" },
];

/** Each order becomes machine code, so one program runs on both. */
export function Bytes() {
  const t = useClock();
  const orden = useCue("orden");
  const codigo = useCue("código");
  const maquina = useCue("máquina");
  const programa = useCue("programa");
  const corre = useCue("corre");
  const amd = useCue("AMD");
  const rows = 1 - fade(t, programa - 0.3, 0.2);
  const prog = popAt(t, programa - 0.1);
  const at = [orden, codigo, maquina];
  return (
    <Layer>
      {rows > 0 ? (
        <div className="absolute inset-0" style={{ opacity: rows }}>
          <Title>Código de máquina</Title>
          {ROWS.map((r, i) => {
            const p = EASE.out(unit(t, at[i] - 0.1, 0.35));
            const arrow = EASE.out(unit(t, at[i] + 0.2, 0.3));
            return (
              <div key={r.asm} className="absolute" style={{ left: 36, top: 230 + i * 120, width: 468, height: 88, opacity: p, transform: `translateX(${(1 - p) * -20}px)` }}>
                <Card x={0} y={0} w={240} h={88}>
                  <div className="px-4 pt-3 font-mono text-[13px] font-bold" style={{ color: DIM }}>
                    ORDEN
                  </div>
                  <div className="px-4 pt-1 font-mono text-[22px] font-bold" style={{ color: INK }}>
                    {r.asm}
                  </div>
                </Card>
                <svg className="absolute" width={60} height={88} style={{ left: 248, top: 0 }} aria-hidden>
                  <path d="M 6 44 L 46 44 M 36 34 L 48 44 L 36 54" fill="none" stroke={ACCENT} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} strokeDashoffset={60 * (1 - arrow)} />
                </svg>
                <Card x={312} y={0} w={156} h={88} active={arrow > 0.5 ? ACCENT : undefined}>
                  <div className="px-4 pt-3 font-mono text-[13px] font-bold" style={{ color: DIM }}>
                    BYTES
                  </div>
                  <div className="px-4 pt-1 font-mono text-[26px] font-bold" style={{ color: ACCENT, opacity: arrow }}>
                    {r.bytes}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      ) : null}
      {t >= programa - 0.1 ? (
        <>
          <Title style={{ opacity: Math.min(1, prog * 2) }}>Los mismos bytes</Title>
          <Card x={150} y={210} w={240} h={96} style={{ opacity: Math.min(1, prog * 2), transform: `scale(${0.85 + 0.15 * Math.min(1, prog)})` }}>
            <div className="px-4 pt-3 font-mono text-[14px] font-bold tracking-[0.1em]" style={{ color: MUTED }}>
              UN PROGRAMA
            </div>
            <div className="px-4 pt-1 font-mono text-[24px] font-bold" style={{ color: ACCENT }}>
              01 D8 89 D8 EB
            </div>
          </Card>
          <svg className="absolute" width={540} height={960} style={{ left: 0, top: 0 }} aria-hidden>
            <DrawPath d="M 230 310 C 230 380, 150 380, 150 430" at={corre - 0.1} dur={0.45} stroke={ACCENT} strokeWidth={3} />
            <DrawPath d="M 310 310 C 310 380, 390 380, 390 430" at={corre} dur={0.45} stroke={ACCENT} strokeWidth={3} />
          </svg>
          <Cpu brand="amd" x={150} y={540} s={0.9} outline={AMD} opacity={EASE.out(unit(t, corre, 0.3))} />
          <Cpu brand="intel" x={390} y={540} s={0.9} outline={INTEL} opacity={EASE.out(unit(t, corre + 0.1, 0.3))} />
          <Check x={222} y={460} color={AMD} p={popAt(t, amd)} size={40} />
          <Check x={462} y={460} color={INTEL} p={popAt(t, amd + 0.35)} size={40} />
          <Mono x={270} y={660} center width={420} size={16} color={MUTED} style={{ opacity: EASE.out(unit(t, amd + 0.2, 0.3)) }}>
            CORRE IGUAL EN LOS DOS
          </Mono>
        </>
      ) : null}
    </Layer>
  );
}
