import { EASE, Stamp, unit, useClock, useCue } from "@motor/video";
import { ACCENT, AMBER, DIM, INK, MUTED, TUX, WIN } from "../world.tsx";
import { Big, Card, Layer, Note, Rise, Rows, SIDE, Strike } from "../parts.tsx";

/**
 * Security: "SEGURIDAD" alone. The presenter brings the claim everyone
 * repeats, it gets struck and "FALSO" stamps it in our violet. Then what is
 * actually different lights row by row ("No más seguro: distinto"), and a
 * grid of machines fills blue for Windows and a few orange for Linux, with
 * attacks landing on the blue ones.
 */
export function Seguridad() {
  const t = useClock();
  const seguro = useCue("Seguro");
  const linux = useCue("Linux");
  const falso = useCue("Falso:");
  const comprometer = useCue("comprometer.");
  const pero = useCue("Pero");
  const permisos = useCue("permisos,");
  const repositorios = useCue("repositorios,");
  const menor = useCue("menor");
  const desarrollo = useCue("desarrollo");
  const entorno = useCue("entorno.");
  const windows = useCue("Windows");
  const malware = useCue("malware");
  const muchisimas = useCue("muchísimas");
  return (
    <Layer>
      <Big x={270} y={360} w={468} size={66} at={-0.2} until={linux - 0.35} align="center" upper>
        Seguridad
      </Big>
      <Rise x={56} y={196} w={428} h={150} at={linux - 0.3} until={pero - 0.2}>
        <Card border="#2A3441">
          <div className="flex h-full flex-col justify-center px-[22px]">
            <span className="font-display text-[54px] font-black leading-[0.6]" style={{ color: DIM }}>“</span>
            <span className="relative self-start font-sans text-[28px] font-bold" style={{ color: INK }}>
              Linux no tiene virus.
              <Strike at={falso} color={ACCENT} width={4} />
            </span>
            <span data-ui="" className="mt-[6px] font-mono text-[12px] font-bold" style={{ color: MUTED }}>— lo que se repite en internet</span>
          </div>
        </Card>
      </Rise>
      <Stamp at={falso} until={pero - 0.2} x={360} y={400} color={ACCENT} fill="#0B0F14" rotate={-7} size={54}>
        Falso
      </Stamp>
      <Big x={SIDE.x} y={SIDE.y + 20} w={SIDE.w} size={30} at={comprometer - 0.8} until={pero - 0.1}>
        A Linux también lo pueden <span style={{ color: ACCENT }}>comprometer.</span>
      </Big>
      <Rows
        x={56}
        y={180}
        w={428}
        rowH={56}
        gap={8}
        at={pero - 0.1}
        size={17}
        title="¿Qué cambia?"
        titleColor={TUX}
        rows={[
          { text: "Modelo de permisos", tag: "distinto", at: permisos },
          { text: "Repositorios de software", tag: "distinto", at: repositorios },
          { text: "Cuota en escritorio", tag: "menor", at: menor },
          { text: "Desarrollo abierto", tag: "distinto", at: desarrollo },
        ]}
      />
      <Note x={270} y={460} at={entorno - 0.2} size={17} color={INK}>No más seguro: distinto.</Note>
      <Machines at={windows - 0.2} malware={malware} many={muchisimas} />
    </Layer>
  );
}

/** 60 machines: most fill blue (Windows), a few orange (Linux); attacks land on the blue ones. */
function Machines({ at, malware, many }: { at: number; malware: number; many: number }) {
  const t = useClock();
  const enter = EASE.out(unit(t, at, 0.3));
  if (enter <= 0) return null;
  const cols = 15;
  const rows = 6;
  const size = 26;
  const gap = 4;
  const linuxCells = new Set([7, 33, 52, 81]);
  const hits = [2, 9, 16, 24, 30, 38, 44, 49, 57, 63, 70, 76, 86];
  return (
    <div className="absolute" style={{ left: 36 + (468 - (cols * (size + gap) - gap)) / 2, top: 500, opacity: enter }}>
      <div data-ui="" className="mb-[8px] flex gap-[14px] font-mono text-[12px] font-bold uppercase tracking-[0.12em]">
        <span style={{ color: WIN }}>■ Windows</span>
        <span style={{ color: TUX }}>■ Linux</span>
        <span style={{ color: AMBER, opacity: EASE.out(unit(t, malware, 0.3)) }}>● malware</span>
      </div>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap }}>
        {Array.from({ length: cols * rows }, (_, i) => {
          const isLinux = linuxCells.has(i);
          const k = EASE.out(unit(t, at + (isLinux ? 1.6 : (i % cols) * 0.04 + Math.floor(i / cols) * 0.08), 0.2));
          const hit = hits.indexOf(i);
          const struck = hit >= 0 ? EASE.out(unit(t, malware + hit * 0.12, 0.2)) : 0;
          const color = isLinux ? TUX : WIN;
          return (
            <div key={i} className="relative rounded-[3px]" style={{ width: size, height: size, background: k > 0 ? color : "#1A212B", opacity: 0.25 + 0.75 * k }}>
              {struck > 0 ? <div className="absolute rounded-full" style={{ left: size / 2 - 5, top: size / 2 - 5, width: 10, height: 10, background: AMBER, transform: `scale(${struck})`, boxShadow: `0 0 8px ${AMBER}` }} /> : null}
            </div>
          );
        })}
      </div>
      <div data-ui="" className="mt-[12px] text-center font-sans text-[18px] font-bold" style={{ color: INK, opacity: EASE.out(unit(t, many, 0.3)) }}>
        Más atacado: hay muchas más.
      </div>
    </div>
  );
}
