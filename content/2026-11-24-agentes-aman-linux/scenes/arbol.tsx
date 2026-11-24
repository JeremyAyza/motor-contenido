import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { GlowTitle, Layer, LogoTile, Term, useOn } from "../parts.tsx";
import { BG, G, INK, MUTED } from "../world.tsx";

const BRANCHES: Array<{ dir: string; what: string; files: string[]; x: number; word: string }> = [
  { dir: "/etc", what: "configuración", files: ["hostname", "nginx/"], x: 110, word: "etc" },
  { dir: "/var/log", what: "logs", files: ["syslog", "auth.log"], x: 270, word: "var" },
  { dir: "/home", what: "tus archivos", files: ["ana/", "proyectos/"], x: 430, word: "home" },
];

/** A small folder tree, the same in every machine. Its root centered on x, y. */
function MiniTree({ x, y }: { x: number; y: number }) {
  return (
    <svg className="absolute" style={{ left: x - 40, top: y }} width={80} height={46} aria-hidden>
      <rect x={34} y={0} width={12} height={10} fill={G} />
      <path d="M40 10 V18 M12 18 H68 M12 18 V26 M40 18 V26 M68 18 V26" stroke={G} strokeWidth={1.5} fill="none" />
      {[6, 34, 62].map((cx) => <rect key={cx} x={cx} y={26} width={12} height={10} fill="none" stroke={G} strokeWidth={1.5} />)}
    </svg>
  );
}

/**
 * One tree: the root drops in, each branch lights with the voice (/etc, /var/log
 * and /home, with what lives there), a terminal lists / on the floor, and on
 * "máquinas" three machines (a laptop with Ubuntu, a server with Debian and a
 * cloud with Fedora) show the same small tree.
 */
export function Arbol() {
  const t = useClock();
  const raiz = useCue("raíz");
  const maquinas = useCue("máquinas");
  const cues = BRANCHES.map((b) => useCue(b.word));
  const root = popAt(t, raiz);
  const swap = useOn(maquinas - 0.3, 0.3);
  return (
    <Layer>
      <GlowTitle text="El sistema de archivos" y={90} size={30} at={0} />
      <svg className="absolute left-0 top-0" width={540} height={960} aria-hidden>
        {BRANCHES.map((b, i) => {
          const p = EASE.out(unit(t, Math.min(cues[i], raiz + 0.5), 0.4));
          return <path key={b.dir} d={`M 270 206 V 226 H ${b.x} V ${226 + 20 * p}`} fill="none" stroke={G} strokeOpacity={0.6 * p} strokeWidth={1.5} />;
        })}
      </svg>
      {root > 0 ? (
        <div data-ui="" className="absolute flex items-center justify-center rounded-[6px] font-mono text-[28px] font-bold" style={{ left: 240, top: 150, width: 60, height: 54, color: BG, background: G, boxShadow: `0 0 18px ${G}`, transform: `scale(${Math.min(1, root)})` }}>
          /
        </div>
      ) : null}
      {BRANCHES.map((b, i) => {
        const shown = popAt(t, Math.min(cues[i], raiz + 0.5));
        const lit = EASE.out(unit(t, cues[i], 0.2));
        if (shown <= 0) return null;
        return (
          <div key={b.dir} className="absolute flex flex-col items-center" style={{ left: b.x, top: 248, transform: "translate(-50%, 0)", opacity: Math.min(1, shown * 2) }}>
            <div data-ui="" className="rounded-[6px] px-[12px] py-[5px] font-mono text-[18px] font-bold" style={{ color: lit > 0.5 ? BG : G, background: lit > 0.5 ? G : "rgba(4,16,10,0.92)", border: `1.5px solid ${G}`, boxShadow: `0 0 ${8 + 12 * lit}px ${G}66` }}>
              {b.dir}
            </div>
            <div data-ui="" className="mt-[6px] rounded-[3px] px-[8px] py-[2px] font-mono text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: lit > 0.5 ? "var(--piece-accent)" : MUTED, border: `1px solid ${lit > 0.5 ? "var(--piece-accent)" : `${G}44`}` }}>
              {b.what}
            </div>
            <div className="mt-[8px] flex flex-col items-start" style={{ opacity: lit }}>
              {b.files.map((f) => (
                <span key={f} data-ui="" className="font-mono text-[14px] leading-[1.5]" style={{ color: INK }}>└ {f}</span>
              ))}
            </div>
          </div>
        );
      })}
      <Term x={210} y={572} w={294} h={150} at={raiz - 0.2} until={maquinas - 0.3} size={13} note={null} lines={[{ at: raiz, cmd: "ls /" }, { at: raiz, out: "bin  boot  dev  etc  home" }, { at: raiz, out: "lib  proc  root  usr  var" }]} />
      {swap > 0
        ? (
            [
              { slug: "ubuntu", name: "Laptop", x: 260 },
              { slug: "debian", name: "Servidor", x: 360 },
              { slug: "fedora", name: "Nube", x: 460 },
            ] as const
          ).map((m, i) => (
            <div key={m.slug}>
              <LogoTile slug={m.slug} x={m.x} y={610} at={maquinas - 0.2 + i * 0.15} size={62} name={m.name} />
              {t >= maquinas + i * 0.15 ? <MiniTree x={m.x} y={672} /> : null}
            </div>
          ))
        : null}
    </Layer>
  );
}
