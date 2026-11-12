import { EASE, fade, keys, popAt, unit, useClock, useCue } from "@motor/video";
import { BigWord, Card, Footnote, Layer, Mono, Title } from "../parts.tsx";
import { AMD, AMD_FILL, CACHE, CACHE_FILL, INK, MUTED, PCB } from "../world.tsx";

/** Which of 12 requests the cache finds, per lane: few with 32 MB, most with 96 MB (illustrative). */
const HITS = {
  small: [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
  big: [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
};

/** AMD's twist: a second layer of L3 stacked on the chiplet, and why games love it. */
export function Vcache() {
  const t = useClock();
  const truco = useCue("truco");
  const apila = useCue("apila");
  const llama = useCue("llama");
  const mas = useCue("más");
  const megas = useCue("megas");
  const juegos = useCue("juegos");
  const acelera = useCue("acelera");
  const stack = 1 - fade(t, juegos - 0.3, 0.25);
  const lanes = fade(t, juegos - 0.2, 0.25);
  const drop = keys(t, [[apila - 0.1, -160], [apila + 0.45, 0]], EASE.out);
  const word = EASE.out(unit(t, llama - 0.1, 0.5));
  const wide = EASE.inOut(unit(t, apila - 0.2, 0.5));
  const x = 200 - 164 * wide;
  const w = 304 + 164 * wide;
  const card = popAt(t, Math.min(0.15, truco - 0.1));
  return (
    <Layer>
      {stack > 0 ? (
        <div className="absolute inset-0" style={{ opacity: stack }}>
          {word < 0.05 ? (
            <Title x={200} width={304}>
              Un truco extra
            </Title>
          ) : (
            <BigWord y={140} size={66} color={INK} on={word}>
              3D V-CACHE
            </BigWord>
          )}
          <Card x={x} y={240} w={w} h={330} style={{ opacity: Math.min(1, card * 2) }}>
            <Mono x={16} y={14} size={15} color={AMD}>
              RYZEN 7 7800X3D
            </Mono>
            <Mono x={16} y={38} size={13} color={MUTED} bold={false}>
              vista de lado
            </Mono>
            <svg className="absolute" width={w} height={330} style={{ left: 0, top: 0, overflow: "visible" }} aria-hidden>
              <rect x={20} y={270} width={w - 40} height={28} rx={4} fill={PCB} />
              <rect x={w / 2 - 110} y={220} width={220} height={44} rx={4} fill={AMD_FILL} />
              <rect x={w / 2 - 110} y={160} width={220} height={52} rx={4} fill="none" stroke="#2A3140" strokeWidth={2} strokeDasharray="6 5" opacity={1 - fade(t, apila, 0.3)} />
              {t >= apila - 0.1 ? <rect x={w / 2 - 110} y={160 + drop} width={220} height={52} rx={4} fill={CACHE_FILL} stroke={CACHE} strokeWidth={2} /> : null}
            </svg>
            <Mono x={w / 2} y={232} center width={220} size={15} color="#FFFFFF">
              L3 · 32 MB
            </Mono>
            {t >= apila - 0.1 ? (
              <Mono x={w / 2} y={176 + drop} center width={220} size={15} color="#FFFFFF">
                CACHÉ APILADA · 64 MB
              </Mono>
            ) : null}
          </Card>
          <Card x={36} y={590} w={468} h={86} active={CACHE} style={{ opacity: Math.min(1, popAt(t, mas - 0.3) * 2) }}>
            <div className="flex h-full items-center justify-center gap-3 font-mono text-[24px] font-bold" style={{ color: INK }}>
              <span>32 MB</span>
              <span style={{ color: CACHE }}>+ 64 MB</span>
              <span style={{ opacity: EASE.out(unit(t, megas - 0.5, 0.3)) }}>=</span>
              <span className="font-display text-[40px] font-black" style={{ color: CACHE, opacity: EASE.out(unit(t, megas - 0.5, 0.3)) }}>
                96 MB
              </span>
            </div>
          </Card>
        </div>
      ) : null}
      {lanes > 0 ? (
        <div className="absolute inset-0" style={{ opacity: lanes }}>
          <Title>Los juegos piden datos sin parar</Title>
          {(["small", "big"] as const).map((lane, li) => (
            <div key={lane} className="absolute" style={{ left: 36, top: 250 + li * 190, width: 468 }}>
              <Mono x={0} y={0} size={15} color={li === 0 ? MUTED : CACHE}>
                {li === 0 ? "L3 DE 32 MB" : "L3 DE 96 MB · 3D V-CACHE"}
              </Mono>
              {HITS[lane].map((hit, i) => {
                const at = juegos + 0.1 + i * 0.16;
                const p = popAt(t, at);
                return <div key={i} className="absolute rounded-[5px]" style={{ left: i * 39, top: 34 + (1 - Math.min(1, p)) * -24, width: 33, height: 44, opacity: t < at ? 0 : Math.min(1, p * 2), background: hit ? CACHE : "#3A4256" }} />;
              })}
              <Mono x={0} y={92} size={13} color={MUTED} bold={false}>
                {`${HITS[lane].filter(Boolean).length} de 12 se encuentran en la caché`}
              </Mono>
            </div>
          ))}
          <div data-ui="" className="absolute rounded-[8px] px-4 py-2 font-mono text-[20px] font-bold" style={{ left: 300, top: 640, color: "#05070A", background: CACHE, opacity: Math.min(1, popAt(t, acelera) * 2), transform: `scale(${Math.min(1.1, popAt(t, acelera))}) rotate(-3deg)` }}>
            GRAN EMPUJÓN
          </div>
          <Footnote y={700}>Ejemplo ilustrativo, no es una prueba de rendimiento</Footnote>
        </div>
      ) : null}
    </Layer>
  );
}
