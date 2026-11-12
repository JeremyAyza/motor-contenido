import { EASE, fade, keys, unit, useClock, useCue } from "@motor/video";
import { Card, Layer, Mono, Title } from "../parts.tsx";
import { ACCENT, AMBER, AMD, AMD_FILL, INK, INTEL, MUTED } from "../world.tsx";

const X0 = 200;

function Count({ x, y, value, label, color, at }: { x: number; y: number; value: number; label: string; color: string; at: number }) {
  const t = useClock();
  const n = Math.round(keys(t, [[at, 0], [at + 0.6, value]], EASE.out));
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <div className="font-display text-[52px] font-black leading-none" style={{ color }}>
        {n}
      </div>
      <div data-ui="" className="pt-1 font-mono text-[15px] font-bold" style={{ color: MUTED }}>
        {label}
      </div>
    </div>
  );
}

/** AMD: one kind of core, two threads each. Intel's newest desktop chips: one thread per core. */
export function Hilos() {
  const t = useClock();
  const grandes = useCue("grandes");
  const hilos = useCue("hilos");
  const intel = useCue("Intel");
  const nucleos = useCue("núcleos");
  const hilos2 = useCue("hilos", 2);
  const ccd = 1 - fade(t, intel - 0.25, 0.2);
  const zoom = EASE.inOut(unit(t, hilos - 0.3, 0.5));
  const cmp = fade(t, intel - 0.1, 0.25);
  const slots = Math.max(0, (t - hilos) / 0.18);
  return (
    <Layer>
      {ccd > 0 ? (
        <div className="absolute inset-0" style={{ opacity: ccd }}>
          <Title x={X0} width={304}>
            AMD: un solo tipo
          </Title>
          {[0, 1].map((c) => (
            <Card key={c} x={X0 + c * 158} y={230} w={146} h={130} active={AMD}>
              <Mono x={10} y={8} size={13} color={AMD}>
                {`CCD ${c}`}
              </Mono>
              {Array.from({ length: 8 }, (_, i) => {
                const on = EASE.out(unit(t, 0.2 + (c * 8 + i) * 0.04, 0.25));
                const big = EASE.out(unit(t, grandes - 0.1, 0.3));
                return <div key={i} className="absolute rounded-[4px]" style={{ left: 12 + (i % 4) * 32, top: 36 + Math.floor(i / 4) * 44, width: 26 + 2 * big, height: 36 + 2 * big, background: AMD_FILL, opacity: on, outline: zoom > 0.5 && c === 0 && i === 0 ? `2px solid ${ACCENT}` : "none" }} />;
              })}
            </Card>
          ))}
          <Mono x={X0} y={372} size={14} color={AMD}>
            16 NÚCLEOS IGUALES
          </Mono>
          <Card x={X0} y={420} w={304} h={190} style={{ opacity: zoom, transform: `scale(${0.6 + 0.4 * zoom})`, transformOrigin: "20px -150px" }}>
            <Mono x={14} y={12} size={13} color={MUTED}>
              UN NÚCLEO · DOS HILOS
            </Mono>
            {Array.from({ length: 16 }, (_, i) => {
              const lane = i % 2;
              const col = Math.floor(i / 2);
              const filled = slots > i;
              return <div key={i} className="absolute rounded-[4px]" style={{ left: 14 + col * 35, top: 52 + lane * 46, width: 30, height: 38, border: `1.5px dashed ${filled ? "transparent" : "#2A3140"}`, background: filled ? (lane === 0 ? ACCENT : AMBER) : "transparent" }} />;
            })}
            <Mono x={14} y={152} size={13} color={ACCENT}>
              HILO A
            </Mono>
            <Mono x={110} y={152} size={13} color={AMBER}>
              HILO B
            </Mono>
          </Card>
        </div>
      ) : null}
      {cmp > 0 ? (
        <div className="absolute inset-0" style={{ opacity: cmp }}>
          <Title>El recuento</Title>
          <Card x={36} y={230} w={224} h={300} active={AMD}>
            <Mono x={18} y={16} size={15} color={AMD}>
              AMD
            </Mono>
          </Card>
          <Card x={280} y={230} w={224} h={300} active={INTEL}>
            <Mono x={18} y={16} size={15} color={INTEL}>
              INTEL
            </Mono>
          </Card>
          <Count x={56} y={290} value={16} label="NÚCLEOS" color={INK} at={intel} />
          <Count x={56} y={400} value={32} label="HILOS" color={AMD} at={intel + 0.3} />
          {/* Intel's figures land before the voice reads them ("ya no: 24 núcleos, 24 hilos"). */}
          <Count x={300} y={290} value={24} label="NÚCLEOS" color={INK} at={intel + 0.15} />
          <Count x={300} y={400} value={24} label="HILOS" color={INTEL} at={Math.min(intel + 0.45, nucleos - 0.6)} />
          <Mono x={36} y={550} size={13} color={MUTED} bold={false}>
            Ryzen 9 9950X · Core Ultra 9 285K
          </Mono>
          <Mono x={36} y={596} size={16} color={MUTED}>
            HILOS POR NÚCLEO
          </Mono>
          {[
            { side: "AMD", color: AMD, n: 2, at: Math.min(nucleos - 0.3, hilos2 - 0.9) },
            { side: "INTEL", color: INTEL, n: 1, at: Math.min(nucleos, hilos2 - 0.7) },
          ].map((row, r) => (
            <div key={row.side} data-ui="" className="absolute flex items-center gap-3" style={{ left: 36, top: 628 + r * 52, opacity: EASE.out(unit(t, row.at, 0.3)) }}>
              <span className="w-[80px] font-mono text-[18px] font-bold" style={{ color: row.color }}>
                {row.side}
              </span>
              {Array.from({ length: row.n }, (_, i) => (
                <span key={i} className="h-[30px] w-[150px] rounded-[6px]" style={{ background: i === 0 ? ACCENT : AMBER }} />
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </Layer>
  );
}
