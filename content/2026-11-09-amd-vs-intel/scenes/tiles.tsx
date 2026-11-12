import { EASE, fade, keys, unit, useClock, useCue } from "@motor/video";
import { BigWord, Cpu, Footnote, Layer, Mono } from "../parts.tsx";
import { DIE, INTEL, INTEL_FILL, INTEL_TEXT, MUTED } from "../world.tsx";

const FOVEROS = "#4DA3FF";

/** Intel's way: tiles with one job each, then the side view of them stacked on a base (Foveros). */
export function Tiles() {
  const t = useClock();
  const tiles = useCue("tiles");
  const parecido = useCue("parecido");
  const computo = useCue("cómputo");
  const graficos = useCue("gráficos");
  const entrada = useCue("entrada");
  const monta = useCue("monta");
  const base = useCue("base");
  const lid = 1 - EASE.inOut(unit(t, parecido, 0.6));
  const top = 1 - fade(t, monta - 0.2, 0.25);
  const side = fade(t, monta - 0.1, 0.25);
  const lit = { compute: EASE.out(unit(t, computo, 0.3)), graphics: EASE.out(unit(t, graficos, 0.3)), soc: EASE.out(unit(t, entrada, 0.3)), io: EASE.out(unit(t, entrada + 0.15, 0.3)) };
  const split = EASE.inOut(unit(t, base + 0.1, 0.6));
  const labels: Array<{ x: number; y: number; text: string; on: number; size?: number }> = [
    { x: 231, y: 386, text: "CÓMPUTO", on: lit.compute },
    { x: 326, y: 386, text: "GPU", on: lit.graphics },
    { x: 270, y: 470, text: "SOC", on: lit.soc },
    { x: 270, y: 519, text: "E/S", on: lit.io, size: 13 },
  ];
  return (
    <Layer>
      {top > 0 ? (
        <div className="absolute inset-0" style={{ opacity: top }}>
          <BigWord y={140} size={66} color="#2F6FD0" on={EASE.out(unit(t, tiles - 0.15, 0.5))}>
            TILES
          </BigWord>
          <Cpu brand="intel" x={270} y={440} s={1.6} tilt={keys(t, [[0, 6], [computo, 0]])} lid={lid} lit={lit} outline={INTEL} />
          {labels.map((l) => (
            <Mono key={l.text} x={l.x} y={l.y} center width={100} size={l.size ?? 14} color="#FFFFFF" style={{ opacity: l.on }}>
              {l.text}
            </Mono>
          ))}
          <Mono x={36} y={222} size={16} color={INTEL_TEXT} style={{ opacity: lit.compute }}>
            UN TRABAJO POR TILE
          </Mono>
          <Footnote y={730}>Core Ultra 9 285K · esquema simplificado</Footnote>
        </div>
      ) : null}
      {side > 0 ? (
        <div className="absolute inset-0" style={{ opacity: side }}>
          <BigWord y={140} size={66} color={FOVEROS} on={EASE.out(unit(t, base, 0.5))}>
            FOVEROS
          </BigWord>
          <svg className="absolute" width={540} height={960} style={{ left: 0, top: 0 }} aria-hidden>
            {/* the tiles on top, lifting off the base */}
            {[
              { x: 70, w: 150, label: "CÓMPUTO" },
              { x: 230, w: 90, label: "GPU" },
              { x: 330, w: 140, label: "SOC · E/S" },
            ].map((tile) => (
              <rect key={tile.label} x={tile.x} y={400 - split * 90} width={tile.w} height={56} rx={6} fill={INTEL_FILL} />
            ))}
            {/* micro-bumps between the layers */}
            {Array.from({ length: 34 }, (_, i) => (
              <circle key={i} cx={78 + i * 11.6} cy={470 - split * 30} r={3.5} fill="#C99A6B" opacity={0.4 + 0.6 * split} />
            ))}
            {/* the base tile */}
            <rect x={60} y={480} width={420} height={50} rx={6} fill={DIE} stroke={FOVEROS} strokeWidth={2} />
            <rect x={40} y={540 + split * 30} width={460} height={20} rx={4} fill="#123A27" />
          </svg>
          <Mono x={145} y={keys(t, [[base + 0.1, 418], [base + 0.7, 328]])} center width={150} size={14} color="#FFFFFF">
            CÓMPUTO
          </Mono>
          <Mono x={275} y={keys(t, [[base + 0.1, 418], [base + 0.7, 328]])} center width={90} size={14} color="#FFFFFF">
            GPU
          </Mono>
          <Mono x={400} y={keys(t, [[base + 0.1, 418], [base + 0.7, 328]])} center width={140} size={14} color="#FFFFFF">
            SOC · E/S
          </Mono>
          <Mono x={270} y={496} center width={300} size={14} color={FOVEROS}>
            BASE FOVEROS
          </Mono>
          <Mono x={36} y={640} size={14} color={MUTED} style={{ opacity: split }}>
            MICROCONTACTOS ENTRE CAPAS
          </Mono>
          <Footnote y={730}>Core Ultra 9 285K · esquema simplificado</Footnote>
        </div>
      ) : null}
    </Layer>
  );
}
