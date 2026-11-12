import { EASE, fade, keys, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Cpu, Layer, Mono, Title } from "../parts.tsx";
import { AMD, INK, INTEL, MUTED } from "../world.tsx";

/** Same outside, different inside: the lids come off; then the two questions the video answers. */
export function Distintos() {
  const t = useClock();
  const dentro = useCue("dentro");
  const cambia = useCue("cambia");
  const conviene = useCue("conviene");
  const lid = 1 - EASE.inOut(unit(t, dentro, 0.6));
  const parts = EASE.out(unit(t, dentro + 0.5, 0.5));
  const chips = 1 - fade(t, cambia - 0.25, 0.2);
  const q1 = popAt(t, cambia - 0.1);
  const q2 = popAt(t, conviene - 0.45);
  const amdLit = { ccd0: parts, ccd1: parts, io: parts * 0.6 };
  const intelLit = { compute: parts, graphics: parts, soc: parts, io: parts };
  return (
    <Layer>
      {chips > 0 ? (
        <div className="absolute inset-0" style={{ opacity: chips }}>
          <Title>Por fuera, iguales</Title>
          <Cpu brand="amd" x={150} y={keys(t, [[0, 420], [dentro, 400]])} s={1.05} lid={lid} lit={amdLit} outline={AMD} />
          <Cpu brand="intel" x={390} y={keys(t, [[0, 420], [dentro, 400]])} s={1.05} lid={lid} lit={intelLit} outline={INTEL} />
          <Mono x={150} y={540} center width={200} color={AMD} style={{ opacity: parts }}>
            PIEZAS SEPARADAS
          </Mono>
          <Mono x={390} y={540} center width={200} color={INTEL} style={{ opacity: parts }}>
            TILES
          </Mono>
          <Title y={600} size={44} style={{ opacity: parts }}>
            Por dentro, <span style={{ color: INK }}>distintos</span>
          </Title>
        </div>
      ) : null}
      {t >= cambia - 0.1 ? (
        <Card x={196} y={200} w={308} h={180} style={{ opacity: Math.min(1, q1 * 2), transform: `translateY(${(1 - Math.min(1, q1)) * 30}px)` }}>
          <div className="px-5 pt-4 font-display text-[34px] font-semibold" style={{ color: INK }}>
            ¿Qué cambia?
          </div>
          <div className="relative h-[100px]">
            <Cpu brand="amd" x={80} y={50} s={0.4} lid={0} lit={{ ccd0: 1, ccd1: 1, io: 0.6 }} />
            <Cpu brand="intel" x={190} y={50} s={0.4} lid={0} lit={{ compute: 1, graphics: 1, soc: 1, io: 1 }} />
          </div>
        </Card>
      ) : null}
      {t >= conviene - 0.45 ? (
        <Card x={196} y={400} w={308} h={180} style={{ opacity: Math.min(1, q2 * 2), transform: `translateY(${(1 - Math.min(1, q2)) * 30}px)` }}>
          <div className="px-5 pt-4 font-display text-[34px] font-semibold" style={{ color: INK }}>
            ¿Cuál elijo?
          </div>
          <div className="flex gap-3 px-5 pt-5">
            <span className="rounded-[8px] px-3 py-1 font-mono text-[18px] font-bold" style={{ color: AMD, border: `1px solid ${AMD}` }}>
              AMD
            </span>
            <span className="rounded-[8px] px-3 py-1 font-mono text-[18px] font-bold" style={{ color: INTEL, border: `1px solid ${INTEL}` }}>
              INTEL
            </span>
            <span className="py-1 font-mono text-[18px]" style={{ color: MUTED }}>
              ?
            </span>
          </div>
        </Card>
      ) : null}
    </Layer>
  );
}
