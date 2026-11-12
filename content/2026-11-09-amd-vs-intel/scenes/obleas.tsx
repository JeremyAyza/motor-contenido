import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Footnote, Layer, Mono, Title } from "../parts.tsx";
import { AMD, CACHE, INK, LINE, MUTED } from "../world.tsx";

const CX = 352;
const CY = 420;
const R = 148;
const DEFECTS: Array<[number, number]> = [
  [-80, -60], [40, -100], [95, 10], [-30, 30], [10, 95], [-110, 60], [70, 80], [-55, -115], [120, -60], [-5, -40], [-95, -10],
];

/** The cells of a square grid that fall fully inside the wafer, and whether a defect hits each. */
function cells(size: number) {
  const out: Array<{ x: number; y: number; hit: boolean }> = [];
  const n = Math.ceil((R * 2) / size);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      const x = CX - R + i * size;
      const y = CY - R + j * size;
      const corners = [[x, y], [x + size, y], [x, y + size], [x + size, y + size]];
      if (!corners.every(([a, b]) => (a - CX) ** 2 + (b - CY) ** 2 <= R * R)) continue;
      const hit = DEFECTS.some(([dx, dy]) => CX + dx >= x && CX + dx <= x + size && CY + dy >= y && CY + dy <= y + size);
      out.push({ x, y, hit });
    }
  return out;
}

const BIG = cells(52);
const SMALL = cells(18.5);

/** Why split it: a wafer with defects; big dies lose whole chips, small ones lose little. */
export function Obleas() {
  const t = useClock();
  const obleas = useCue("obleas");
  const defectos = useCue("defectos");
  const grande = useCue("grande");
  const arruina = useCue("arruina");
  const chiplets = useCue("chiplets");
  const wafer = EASE.out(unit(t, obleas - 0.2, 0.4));
  const big = EASE.out(unit(t, grande - 0.1, 0.3)) * (1 - EASE.out(unit(t, chiplets - 0.1, 0.3)));
  const small = EASE.out(unit(t, chiplets - 0.1, 0.3));
  const xs = EASE.out(unit(t, arruina, 0.3));
  const xsSmall = EASE.out(unit(t, chiplets + 0.4, 0.3));
  return (
    <Layer>
      <Title>¿Por qué partirlo?</Title>
      <svg className="absolute" width={540} height={960} style={{ left: 0, top: 0 }} aria-hidden>
        <defs>
          <radialGradient id="wafer" cx="0.4" cy="0.35" r="0.8">
            <stop offset="0" stopColor="#3A4A7A" />
            <stop offset="0.6" stopColor="#24305A" />
            <stop offset="1" stopColor="#1A2142" />
          </radialGradient>
          <clipPath id="disc">
            <circle cx={CX} cy={CY} r={R} />
          </clipPath>
        </defs>
        <g opacity={wafer} transform={`rotate(${t * 6} ${CX} ${CY})`}>
          <circle cx={CX} cy={CY} r={R} fill="url(#wafer)" stroke={LINE} strokeWidth={2} />
          <g clipPath="url(#disc)">
            {BIG.map((c, i) => (
              <g key={`b${i}`} opacity={big}>
                <rect x={c.x + 2} y={c.y + 2} width={48} height={48} rx={3} fill={c.hit && xs > 0.5 ? "rgba(232,80,91,0.25)" : "rgba(82,211,154,0.10)"} stroke={c.hit && xs > 0.5 ? AMD : "rgba(244,246,250,0.35)"} strokeWidth={1.2} />
                {c.hit ? <path d={`M ${c.x + 12} ${c.y + 12} L ${c.x + 40} ${c.y + 40} M ${c.x + 40} ${c.y + 12} L ${c.x + 12} ${c.y + 40}`} stroke={AMD} strokeWidth={3} strokeLinecap="round" opacity={xs} /> : null}
              </g>
            ))}
            {SMALL.map((c, i) => (
              <rect key={`s${i}`} x={c.x + 1} y={c.y + 1} width={16.5} height={16.5} rx={2} opacity={small} fill={c.hit && xsSmall > 0.5 ? "rgba(232,80,91,0.6)" : "rgba(82,211,154,0.16)"} stroke="rgba(244,246,250,0.25)" strokeWidth={0.8} />
            ))}
          </g>
          {DEFECTS.map(([dx, dy], i) => {
            const p = popAt(t, defectos + i * 0.05);
            return <circle key={i} cx={CX + dx} cy={CY + dy} r={5 * Math.min(1.2, p)} fill="#FF3B6B" />;
          })}
        </g>
      </svg>
      <Mono x={204} y={588} size={14} color={MUTED} style={{ opacity: wafer }}>
        OBLEA DE SILICIO · 300 MM
      </Mono>
      <div className="absolute" style={{ left: 204, top: 620, opacity: Math.max(big, small) }}>
        <div className="font-display text-[44px] font-black leading-none" style={{ color: small > 0.5 ? CACHE : xs > 0.5 ? AMD : INK }}>
          {small > 0.5 ? "98 %" : "89 %"}
        </div>
        <div data-ui="" className="pt-1 font-mono text-[15px] font-bold" style={{ color: MUTED }}>
          {small > 0.5 ? "856 DE 870 SIRVEN" : "85 DE 96 SIRVEN"}
        </div>
      </div>
      <Footnote x={204} y={700}>
        Ejemplo ilustrativo
      </Footnote>
    </Layer>
  );
}
