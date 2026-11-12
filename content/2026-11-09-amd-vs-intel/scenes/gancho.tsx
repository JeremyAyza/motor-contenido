import { EASE, fade, popAt, unit, useClock, useCue, wobble } from "@motor/video";
import { Cpu, Device, Glow, Layer, Mark, Mono, Title } from "../parts.tsx";
import { AMD, INK, INTEL, MUTED } from "../world.tsx";

/** Which side each of the 24 PCs runs on: 12 and 12, mixed like Rick's. */
const SIDES = "AIAIIAAIIAIAAIIAIAAIAIIA".split("");

/** Frame 1: the two sides on a diagonal, red up left and blue down right; then the grid of Windows PCs. */
export function Gancho() {
  const t = useClock();
  const pc = useCue("PC");
  const procesador = useCue("procesador");
  const versus = 1 - fade(t, pc - 0.15, 0.2);
  const grid = fade(t, pc - 0.05, 0.15);
  const amdOn = EASE.out(unit(t, 0, 0.5));
  const intelOn = EASE.out(unit(t, 0.35, 0.5));
  const wa = wobble(t, "amd", 3);
  const wi = wobble(t, "intel", 3);
  return (
    <Layer>
      {versus > 0 ? (
        <div className="absolute inset-0" style={{ opacity: versus }}>
          <Title y={150} size={52} align="center">
            <span style={{ color: AMD }}>AMD</span> contra <span style={{ color: INTEL }}>Intel</span>
          </Title>
          <Glow brand="amd" x={160} y={380} r={200} opacity={0.4 + 0.6 * amdOn} />
          <Glow brand="intel" x={380} y={610} r={200} opacity={0.4 + 0.6 * intelOn} />
          <Mark brand="amd" size={150} x={40} y={222} opacity={0.2 + 0.8 * amdOn} underline={amdOn} />
          {/* Frame 1 already has both chips, drifting in from their corners. */}
          <Cpu brand="amd" x={150 + wa.x - 30 * (1 - amdOn)} y={390 + wa.y} s={1.15 + 0.1 * (1 - amdOn)} tilt={-10 - 6 * (1 - amdOn)} opacity={0.55 + 0.45 * amdOn} />
          <Mono x={270} y={500} center width={60} color={MUTED} size={18}>
            VS
          </Mono>
          <Mark brand="intel" size={130} x={350} y={330} opacity={0.2 + 0.8 * intelOn} underline={intelOn * 0.9} />
          <Cpu brand="intel" x={388 + wi.x + 30 * (1 - intelOn)} y={610 + wi.y} s={1.1 + 0.1 * (1 - intelOn)} tilt={8 + 6 * (1 - intelOn)} opacity={0.55 + 0.45 * intelOn} />
        </div>
      ) : null}
      {grid > 0 ? (
        <div className="absolute inset-0" style={{ opacity: grid }}>
          <div className="absolute flex items-center justify-between" style={{ left: 45, top: 168, width: 450 }}>
            <Mark brand="amd" size={58} x={0} y={-14} />
            <Mono x={110} y={-2} width={230} center={false} size={14} color={MUTED} style={{ textAlign: "center" }}>
              PC CON WINDOWS
            </Mono>
            <Mark brand="intel" size={50} x={400} y={-16} />
          </div>
          {SIDES.map((side, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const on = EASE.out(unit(t, pc + 0.1 + (row + col) * 0.06, 0.3));
            const dotAt = procesador + i * 0.035;
            return <Device key={i} kind={((row + col) % 3) as 0 | 1 | 2} x={36 + col * 117} y={226 + row * 78} on={on} dot={{ color: side === "A" ? AMD : INTEL, p: popAt(t, dotAt) }} />;
          })}
          <div className="absolute h-px" style={{ left: 45, top: 200, width: 450, background: INK, opacity: 0.08 }} />
        </div>
      ) : null}
    </Layer>
  );
}
