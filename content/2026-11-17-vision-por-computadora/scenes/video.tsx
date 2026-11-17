import { EASE, unit, useClock, useCue } from "@motor/video";
import { Corners, DetBox, Ilustrativo, Layer, Mono, Pic, Title } from "../parts.tsx";
import { INK, MUTED, RED, YELLOW } from "../world.tsx";

/** img/futbol.png (1200 × 896) at 468 wide: × 0.39. */
const S = 0.39;
const b = (x1: number, y1: number, x2: number, y2: number) => ({ x: x1 * S, y: y1 * S, w: (x2 - x1) * S, h: (y2 - y1) * S });
const PLAYERS = [
  b(348, 460, 422, 578), b(405, 472, 470, 588), b(218, 512, 285, 630), b(250, 562, 320, 690), b(660, 490, 740, 630),
  b(890, 525, 975, 650), b(186, 408, 238, 510), b(335, 348, 375, 430), b(465, 380, 500, 468), b(755, 368, 815, 458), b(833, 362, 870, 442),
];
/** The ball, and the dotted trail of where it was in the frames before (illustrative). */
const BALL = { x: 398 * S, y: 575 * S };
const TRAIL = [[255, 640], [300, 628], [338, 610], [370, 594], [392, 582]].map(([x, y]) => [x * S, y * S]);

/**
 * A trail of crumbs the ball leaves: the broadcast shot with a box on every
 * player and a yellow one on the ball, the dotted trail growing frame by frame
 * while the frame counter runs and the camera leans after the ball.
 */
export function Video() {
  const t = useClock();
  const tiempo = useCue("tiempo");
  const cuadro = useCue("cuadro");
  const pelota = useCue("pelota");
  const run = EASE.inOut(unit(t, cuadro - 0.2, pelota - cuadro + 0.6));
  const frame = 1 + Math.floor(run * 2.999);
  const zoom = 1 + 0.14 * EASE.inOut(unit(t, cuadro, 2.2));
  return (
    <Layer>
      <Title y={124} size={32}>Cuadro a cuadro</Title>
      <div className="absolute" style={{ left: 36, top: 190, width: 468, height: 349 }}>
        <div className="absolute inset-0 overflow-hidden rounded-[4px]">
          <div className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: `${(BALL.x / 468) * 100}% ${(BALL.y / 349) * 100}%` }}>
            <Pic src="img/futbol.png" />
            {PLAYERS.map((p, i) => (
              <DetBox key={i} {...p} label={`id ${i + 1}`} at={tiempo + 0.1 + i * 0.05} color="rgba(255,255,255,0.85)" size={12} />
            ))}
            <svg className="absolute inset-0" width={468} height={349}>
              {TRAIL.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={3} fill={YELLOW} opacity={run * 5 > i ? 0.9 : 0} />
              ))}
            </svg>
            <DetBox x={BALL.x - 9} y={BALL.y - 9} w={18} h={18} label="pelota · id 7" at={cuadro - 0.1} size={12} />
          </div>
        </div>
        <Corners w={468} h={349} />
      </div>
      <div data-ui="" className="absolute rounded-[4px] px-[8px] font-mono text-[16px] font-bold" style={{ left: 380, top: 200, background: "rgba(0,0,0,0.7)", color: INK, opacity: EASE.out(unit(t, cuadro - 0.2, 0.2)) }}>
        cuadro <span style={{ color: RED }}>●</span> {frame}
      </div>
      <Mono x={36} y={556} at={pelota - 0.2} size={15} color={YELLOW} width={468}>
        misma pelota, mismo número: id 7
      </Mono>
      <Mono x={250} y={590} at={tiempo} size={12} color={MUTED} width={254}>
        seguimiento · 30 cuadros por s
      </Mono>
      <Ilustrativo x={250} y={612} at={tiempo} />
    </Layer>
  );
}
