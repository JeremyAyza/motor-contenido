import { EASE, fade, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Footnote, Layer, Mono, Title } from "../parts.tsx";
import { AMD_FILL, CACHE, CACHE_FILL, DIM, INK, MUTED } from "../world.tsx";

const ROWS: Array<{ name: string; ns: string; w: number; cache: boolean }> = [
  { name: "L1", ns: "~1 ns", w: 18, cache: true },
  { name: "L2", ns: "~3 ns", w: 40, cache: true },
  { name: "L3", ns: "~10 ns", w: 80, cache: true },
  { name: "RAM", ns: "~80 ns", w: 250, cache: false },
];

/** The RAM is far: a trip there takes long, so fast memory sits inside the chip, in levels. */
export function Cache() {
  const t = useClock();
  const ram = useCue("RAM");
  const lejisimos = useCue("lejísimos");
  const guarda = useCue("guarda");
  const cache = useCue("caché");
  const pegadas = useCue("pegadas");
  const grande = useCue("grande");
  const far = 1 - fade(t, pegadas - 0.6, 0.25);
  const ccd = fade(t, pegadas - 0.5, 0.25);
  const lit = EASE.out(unit(t, cache - 0.1, 0.35));
  // A slow trip to the RAM and back, then quick hops to the nearest level once the cache is there.
  const trip = t < cache ? ((t - ram) / 2.2) % 1 : ((t - cache) / 0.6) % 1;
  const reach = t < cache ? 348 : 64;
  const dotX = 156 + (trip < 0.5 ? trip * 2 : 2 - trip * 2) * reach;
  const l3 = EASE.out(unit(t, grande - 0.1, 0.35));
  return (
    <Layer>
      {far > 0 ? (
        <div className="absolute inset-0" style={{ opacity: far }}>
          <Title>La RAM está lejos</Title>
          <Card x={36} y={236} w={120} h={76}>
            <div className="flex h-full items-center justify-center font-mono text-[18px] font-bold" style={{ color: INK }}>
              NÚCLEO
            </div>
          </Card>
          <Card x={384} y={236} w={120} h={76} style={{ opacity: EASE.out(unit(t, ram - 0.1, 0.3)) }}>
            <div className="flex h-full items-center justify-center font-mono text-[18px] font-bold" style={{ color: INK }}>
              RAM
            </div>
          </Card>
          <svg className="absolute" width={540} height={960} style={{ left: 0, top: 0 }} aria-hidden>
            <line x1={156} x2={384} y1={274} y2={274} stroke={DIM} strokeWidth={2} strokeDasharray="5 5" />
            {t >= ram ? <circle cx={dotX} cy={274} r={7} fill={t < cache ? INK : CACHE} /> : null}
          </svg>
          {["L1", "L2", "L3"].map((name, i) => {
            const p = popAt(t, cache + i * 0.12);
            return (
              <div key={name} data-ui="" className="absolute flex items-center justify-center rounded-[6px] font-mono text-[15px] font-bold" style={{ left: 172 + i * 68, top: 254, width: 56, height: 40, background: CACHE_FILL, color: "#FFFFFF", border: `1px solid ${CACHE}`, opacity: t < cache ? 0 : Math.min(1, p * 2), transform: `scale(${0.7 + 0.3 * Math.min(1, p)})` }}>
                {name}
              </div>
            );
          })}
          <Mono x={36} y={352} size={19} color={INK} style={{ opacity: EASE.out(unit(t, lejisimos, 0.3)) }}>
            ESPERA POR VIAJE
          </Mono>
          {ROWS.map((r, i) => {
            const on = 0.25 + 0.75 * EASE.out(unit(t, lejisimos + i * 0.12, 0.35));
            const green = r.cache ? lit : 0;
            return (
              <div key={r.name} data-ui="" className="absolute flex items-center gap-3" style={{ left: 36, top: 392 + i * 50, opacity: on }}>
                <span className="w-[56px] font-mono text-[18px] font-bold" style={{ color: green > 0.5 ? CACHE : INK }}>
                  {r.name}
                </span>
                <span className="h-[16px] rounded-full" style={{ width: r.w * on, background: green > 0.5 ? CACHE : r.cache ? "#3A4256" : "#C46A3A" }} />
                <span data-ui="" className="font-mono text-[19px] font-bold" style={{ color: INK }}>
                  {r.ns}
                </span>
              </div>
            );
          })}
          <Footnote y={600}>Aproximado · ejemplo ilustrativo</Footnote>
          <Mono x={36} y={660} size={16} color={CACHE} style={{ opacity: EASE.out(unit(t, guarda, 0.3)) }}>
            CACHÉ: MEMORIA DENTRO DEL CHIP
          </Mono>
        </div>
      ) : null}
      {ccd > 0 ? (
        <div className="absolute inset-0" style={{ opacity: ccd }}>
          <Title>Niveles de caché</Title>
          <Card x={36} y={220} w={468} h={400}>
            {Array.from({ length: 8 }, (_, i) => {
              const left = i % 2 === 0;
              const row = Math.floor(i / 2);
              const x = left ? 16 : 468 - 16 - 150;
              return (
                <div key={i} className="absolute" style={{ left: x, top: 18 + row * 92, width: 150, height: 80 }}>
                  <div className="absolute rounded-[5px]" style={{ left: left ? 0 : 82, top: 0, width: 68, height: 80, background: AMD_FILL }} />
                  <div data-ui="" className="absolute flex items-center justify-center rounded-[4px] font-mono text-[12px] font-bold" style={{ left: left ? 74 : 40, top: 4, width: 36, height: 34, background: CACHE_FILL, color: "#FFFFFF" }}>
                    L1
                  </div>
                  <div data-ui="" className="absolute flex items-center justify-center rounded-[4px] font-mono text-[12px] font-bold" style={{ left: left ? 74 : 40, top: 42, width: 36, height: 34, background: CACHE_FILL, color: "#FFFFFF" }}>
                    L2
                  </div>
                </div>
              );
            })}
            <div className="absolute flex flex-col items-center justify-center rounded-[6px]" style={{ left: 184, top: 18, width: 100, height: 364, background: `color-mix(in srgb, ${CACHE} ${Math.round(18 + 30 * l3)}%, #0D1117)`, border: `1px solid ${CACHE}` }}>
              <span className="font-mono text-[26px] font-bold" style={{ color: "#FFFFFF" }}>
                L3
              </span>
              <span data-ui="" className="pt-1 font-mono text-[14px] font-bold" style={{ color: "#FFFFFF" }}>
                32 MB
              </span>
            </div>
          </Card>
          <Mono x={36} y={640} size={15} color={CACHE}>
            L1 48 KB Y L2 1 MB POR NÚCLEO
          </Mono>
          <Mono x={36} y={670} size={15} color={CACHE} style={{ opacity: l3 }}>
            L3 32 MB, COMPARTIDA POR 8
          </Mono>
          <Footnote y={720}>Chiplet de Ryzen · esquema simplificado</Footnote>
        </div>
      ) : null}
    </Layer>
  );
}
