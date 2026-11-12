import { DrawPath, EASE, unit, useClock, useCue } from "@motor/video";
import { BigWord, Cpu, Footnote, Layer, Mono } from "../parts.tsx";
import { AMD } from "../world.tsx";

const ROUTES = ["M 225 462 C 225 490, 245 490, 250 512", "M 315 462 C 315 490, 295 490, 290 512", "M 245 406 L 295 406"];

/** The pieces talk over a fast link of their own: pulses running between the chiplets and the I/O die. */
export function Fabric() {
  const t = useClock();
  const piezas = useCue("piezas");
  const enlace = useCue("enlace");
  const rapido = useCue("rápido");
  const name = EASE.out(unit(t, rapido + 0.2, 0.4));
  const run = EASE.out(unit(t, enlace, 0.3));
  return (
    <Layer>
      <BigWord y={140} size={54} color="#F0606B" on={name}>
        Infinity Fabric
      </BigWord>
      <Cpu brand="amd" x={270} y={440} s={1.6} lid={0} lit={{ ccd0: 1, ccd1: 1, io: EASE.out(unit(t, piezas, 0.3)) }} outline={AMD} />
      <svg className="absolute" width={540} height={960} style={{ left: 0, top: 0 }} aria-hidden>
        {ROUTES.map((d, i) => (
          <DrawPath key={d} d={d} at={enlace - 0.1 + i * 0.1} dur={0.35} stroke={AMD} strokeWidth={5} />
        ))}
        {run > 0
          ? [0, 1, 2].map((r) =>
              [0, 1, 2].map((k) => {
                const p = (t * 1.6 + k / 3 + r * 0.17) % 1;
                const pts: Array<[number, number, number, number]> = [
                  [225, 462, 250, 512],
                  [315, 462, 290, 512],
                  [245, 406, 295, 406],
                ];
                const [x1, y1, x2, y2] = pts[r];
                const q = r === 2 ? (Math.floor(t * 1.6 + k / 3) % 2 === 0 ? p : 1 - p) : p;
                return <circle key={`${r}-${k}`} cx={x1 + (x2 - x1) * q} cy={y1 + (y2 - y1) * q} r={5} fill="#FFFFFF" opacity={run * 0.9} />;
              }),
            )
          : null}
      </svg>
      <Mono x={270} y={660} center width={300} size={16} color={AMD} style={{ opacity: run }}>
        ENLACE ENTRE PIEZAS
      </Mono>
      <Footnote y={730}>Ryzen 9 9950X · esquema simplificado</Footnote>
    </Layer>
  );
}
