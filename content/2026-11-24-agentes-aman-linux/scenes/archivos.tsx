import { popAt, useClock, useCue } from "@motor/video";
import { GlowTitle, Layer, Term } from "../parts.tsx";
import { G, INK, MUTED, RED } from "../world.tsx";

/** A file card of /proc with a live value. Its top-left at x, y. */
function ProcFile({ x, y, path, value, at, live }: { x: number; y: number; path: string; value: string; at: number; live: number }) {
  const t = useClock();
  const p = popAt(t, at);
  if (p <= 0) return null;
  const pulse = t >= live ? 0.5 + 0.5 * Math.sin(t * 6) : 0;
  return (
    <div data-ui="" className="absolute flex flex-col items-center rounded-[8px] py-[12px] font-mono" style={{ left: x, top: y, width: 148, height: 190, background: "rgba(4,16,10,0.92)", border: `1.5px solid ${G}`, boxShadow: `0 0 14px ${G}55`, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - Math.min(1, p)) * 20}px)` }}>
      <svg width={40} height={50} viewBox="0 0 40 50" aria-hidden>
        <path d="M2 2 H28 L38 12 V48 H2 Z" fill="none" stroke={G} strokeWidth={2.5} />
        <path d="M10 22 H30 M10 30 H30 M10 38 H24" stroke={G} strokeWidth={2.5} />
      </svg>
      <span className="mt-[8px] text-[13px] font-bold" style={{ color: INK }}>{path}</span>
      <span className="mt-[14px] text-[19px] font-bold" style={{ color: G, textShadow: `0 0 8px ${G}` }}>{value}</span>
      <span className="mt-auto flex items-center gap-[6px] text-[12px] font-bold tracking-[0.1em]" style={{ color: t >= live ? RED : MUTED }}>
        <span className="inline-block h-[8px] w-[8px] rounded-full" style={{ background: t >= live ? RED : MUTED, opacity: 0.4 + 0.6 * pulse }} />
        EN VIVO
      </span>
    </div>
  );
}

/**
 * Everything is a file: three /proc cards land with the voice (the processor,
 * the memory, a running process), their values tick live, and the terminal on
 * the floor reads each one with cat.
 */
export function Archivos() {
  const t = useClock();
  const procesador = useCue("procesador");
  const memoria = useCue("memoria");
  const procesos = useCue("procesos");
  const vivo = useCue("vivo");
  const herramientas = useCue("herramientas");
  const mhz = (3600 + Math.round(60 * Math.sin(t * 2.1))).toLocaleString("es");
  const gb = (9.2 + 0.05 * Math.sin(t * 1.7)).toFixed(2).replace(".", ",");
  return (
    <Layer>
      <GlowTitle text="Todo es un archivo" y={90} size={34} at={0} />
      <ProcFile x={36} y={160} path="/proc/cpuinfo" value={`${mhz} MHz`} at={procesador} live={vivo} />
      <ProcFile x={196} y={160} path="/proc/meminfo" value={`${gb} GB`} at={memoria} live={vivo} />
      <ProcFile x={356} y={160} path="/proc/1234/status" value="corriendo" at={procesos} live={vivo} />
      <div data-ui="" className="absolute right-[36px] top-[358px] font-mono text-[12px] font-bold" style={{ color: MUTED }}>EJEMPLO ILUSTRATIVO</div>
      <Term
        x={210}
        y={572}
        w={294}
        h={190}
        at={0.2}
        size={13}
        note={null}
        lines={[
          { at: procesador, cmd: "cat /proc/cpuinfo" },
          { at: procesador, out: `cpu MHz : ${mhz}` },
          { at: memoria, cmd: "cat /proc/meminfo" },
          { at: memoria, out: "MemAvailable: 9209120 kB" },
          { at: herramientas, cmd: "cat /proc/1234/status" },
          { at: herramientas, out: "State: R (running)" },
        ]}
      />
    </Layer>
  );
}
