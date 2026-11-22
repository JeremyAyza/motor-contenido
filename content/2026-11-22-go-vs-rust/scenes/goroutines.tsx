import { EASE, lerp, unit, useClock, useCue } from "@motor/video";
import { BigWord, Chip, CodeLine, Count, Example, Layer, LangMark, PanelBody, Small, Worker } from "../parts.tsx";
import { GO, INK, MUTED } from "../world.tsx";

/** A fixed scatter of points inside a unit square, so the swarm never reshuffles. */
const POINTS = (() => {
  const out: Array<[number, number]> = [];
  let s = 11;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < 260; i++) out.push([rnd(), rnd()]);
  return out;
})();

const SQ = { x: 196, y: 178, size: 150 };
const TEAM_Y = 470;
const TEAM_X = Array.from({ length: 10 }, (_, i) => 160 + i * 34);

/**
 * Goroutines: the one 8 MB thread stays on the left. "GOROUTINES" lands and
 * the panel shows the one keyword; on "miles" a teal swarm grows beside the
 * thread while the panel counts to 10,000; a team of ten real workers
 * appears under it and the swarm flows down to them. Then the three uses.
 */
export function Goroutines() {
  const t = useClock();
  const gor = useCue("goroutines:");
  const miles = useCue("miles,");
  const equipo = useCue("equipo");
  const servidores = useCue("servidores,");
  const apis = useCue("APIs");
  const dist = useCue("distribuidos.");
  const grow = EASE.out(unit(t, miles - 0.2, 1.6));
  const shown = Math.floor(POINTS.length * grow);
  const size = lerp(36, SQ.size, grow);
  const team = EASE.out(unit(t, equipo, 0.4));
  return (
    <Layer>
      <LangMark lang="go" x={470} y={128} size={56} at={0} />
      <BigWord text="Goroutines" x={36} y={112} size={44} color={GO} at={gor} />
      <Worker x={96} y={330} s={1.5} color={GO} label="8 MB" />
      <Small x={70} y={346} at={0}>1 hilo</Small>
      <div className="absolute" style={{ left: SQ.x + (SQ.size - size) / 2, top: SQ.y + (SQ.size - size) / 2, width: size, height: size, opacity: grow > 0 ? 1 : 0, background: "rgba(41,190,176,0.16)", border: `1.5px solid ${GO}` }}>
        <svg width={size} height={size} aria-hidden>
          {POINTS.slice(0, shown).map(([px, py], i) => (
            <circle key={i} cx={px * size} cy={py * size} r={1.6} fill={GO} opacity={0.85} />
          ))}
        </svg>
      </div>
      {team > 0
        ? Array.from({ length: 18 }).map((_, i) => {
            const cycle = 1.4;
            const phase = (((t - equipo) / cycle + i / 18) % 1 + 1) % 1;
            const from: [number, number] = [SQ.x + 20 + ((i * 37) % 110), SQ.y + SQ.size];
            const to: [number, number] = [TEAM_X[i % 10], TEAM_Y - 40];
            return <div key={i} className="absolute h-[4px] w-[4px] rounded-full" style={{ left: lerp(from[0], to[0], phase), top: lerp(from[1], to[1], phase), background: GO, opacity: team * (1 - phase * 0.6) }} />;
          })
        : null}
      {TEAM_X.map((x, i) => (
        <Worker key={x} x={x} y={TEAM_Y} s={0.9} color={GO} opacity={EASE.out(unit(t, equipo + i * 0.04, 0.25))} />
      ))}
      <Small x={TEAM_X[0] - 12} y={TEAM_Y + 4} at={equipo + 0.5} color={INK}>10 trabajadores reales</Small>
      <Chip x={430} y={210} at={servidores} color={GO}>servidores</Chip>
      <Chip x={430} y={254} at={apis} color={GO}>APIs</Chip>
      <Chip x={430} y={298} at={dist} color={GO}>distribuidos</Chip>
      <PanelBody at={0}>
        <CodeLine at={0.1}>{"for i := 0; i < 10000; i++ {"}</CodeLine>
        <CodeLine at={0.4} color={GO} hot="rgba(41,190,176,0.14)">{"    go func() { ... }()"}</CodeLine>
        <CodeLine at={0.6}>{"}"}</CodeLine>
        {t < miles - 0.2 ? (
          <div className="mt-[10px]" style={{ opacity: EASE.out(unit(t, gor, 0.3)) }}>
            <div className="font-mono text-[12px]" style={{ color: MUTED }}>una sola palabra:</div>
            <div className="font-mono text-[58px] font-bold leading-[1]" style={{ color: GO }}>go</div>
          </div>
        ) : (
          <div className="mt-[10px]">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[12px]" style={{ color: MUTED }}>goroutines</span>
              <Count from={1} to={10000} at={miles - 0.2} dur={1.6} size={36} color={GO} />
            </div>
            <div className="mt-[6px] flex justify-between font-mono text-[13px]">
              <span style={{ color: MUTED }}>memoria total</span>
              <span style={{ color: INK }}>20,6 MB</span>
            </div>
            <div className="flex justify-between font-mono text-[13px]" style={{ opacity: team }}>
              <span style={{ color: MUTED }}>hilos reales</span>
              <span style={{ color: INK }}>10</span>
            </div>
          </div>
        )}
      </PanelBody>
      <Example x={216} y={772} at={miles} />
    </Layer>
  );
}
