import { DrawPath, EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Cpu, Layer, Mono, Title } from "../parts.tsx";
import { ACCENT, AMD, INTEL, MUTED } from "../world.tsx";

/** Same orders, different silicon: the bytes flow down into two different boards. */
export function Silicio() {
  const t = useClock();
  const cambia = useCue("cambia");
  const convierten = useCue("convierten");
  const box = popAt(t, 0.1);
  const amd = EASE.out(unit(t, convierten, 0.4));
  const intel = EASE.out(unit(t, convierten + 0.25, 0.4));
  return (
    <Layer>
      <Title>
        Mismas órdenes,
        <br />
        otro silicio
      </Title>
      <Card x={236} y={250} w={230} h={76} style={{ opacity: Math.min(1, box * 2) }}>
        <div className="px-4 pt-2 font-mono text-[13px] font-bold tracking-[0.1em]" style={{ color: MUTED }}>
          x86
        </div>
        <div className="px-4 font-mono text-[24px] font-bold" style={{ color: ACCENT }}>
          01 D8 89 D8
        </div>
      </Card>
      <svg className="absolute" width={540} height={960} style={{ left: 0, top: 0 }} aria-hidden>
        <DrawPath d="M 300 330 C 300 380, 270 380, 270 400" at={cambia} dur={0.5} stroke={ACCENT} strokeWidth={3} />
        <DrawPath d="M 400 330 C 400 380, 424 380, 424 400" at={cambia + 0.15} dur={0.5} stroke={ACCENT} strokeWidth={3} />
      </svg>
      <Cpu brand="amd" x={270} y={490} s={0.78} lid={0} lit={{ ccd0: amd, ccd1: amd, io: amd * 0.6 }} outline={AMD} />
      <Cpu brand="intel" x={424} y={490} s={0.78} lid={0} lit={{ compute: intel, graphics: intel, soc: intel, io: intel }} outline={INTEL} />
      <Mono x={270} y={588} center width={150} size={18} color={AMD} style={{ opacity: amd, whiteSpace: "normal", lineHeight: 1.25 }}>
        PIEZAS SEPARADAS
      </Mono>
      <Mono x={424} y={588} center width={150} size={18} color={INTEL} style={{ opacity: intel, whiteSpace: "normal", lineHeight: 1.25 }}>
        TILES SOBRE UNA BASE
      </Mono>
    </Layer>
  );
}
