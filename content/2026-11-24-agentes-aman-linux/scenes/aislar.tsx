import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Logo } from "@motor/ui";
import { Bracket, Chip, GlowTitle, Invader, Layer, Term, usePresence } from "../parts.tsx";
import { AMBER, BG, G, INK, MUTED } from "../world.tsx";

/** A card for one way to isolate: an icon, its name and how it relates to the kernel. */
function Way({ y, at, name, note, icon }: { y: number; at: number; name: string; note: string; icon: React.ReactNode }) {
  const { p, o, on } = usePresence(at);
  if (!on) return null;
  return (
    <div data-ui="" className="absolute flex items-center gap-[12px] rounded-[8px] px-[12px] font-mono" style={{ left: 290, top: y, width: 214, height: 70, background: "rgba(4,16,10,0.92)", border: `1.5px solid ${G}`, boxShadow: `0 0 12px ${G}44`, opacity: o, transform: `translateX(${(1 - Math.min(1, p)) * 20}px)` }}>
      {icon}
      <div className="flex flex-col">
        <span className="text-[16px] font-bold" style={{ color: G }}>{name}</span>
        <span className="text-[12px]" style={{ color: MUTED }}>{note}</span>
      </div>
    </div>
  );
}

/**
 * The sandbox: SAFETY with a lock; the laptop card glows amber with FULL
 * ACCESS while an rm -rf types itself on the floor and freezes. Containers and
 * VMs land on the right; on "aislar" a sealed box takes the floor with the
 * invader inside, its locks (namespaces, cgroups, seccomp) snap on, and on
 * "tira" the whole box is thrown away.
 */
export function Aislar() {
  const t = useClock();
  const computadora = useCue("computadora");
  const sueltos = useCue("sueltos");
  const contenedores = useCue("contenedores");
  const virtuales = useCue("virtuales");
  const aislar = useCue("aislar");
  const limitar = useCue("limitar");
  const permisos = useCue("permisos");
  const sellado = useCue("sellado");
  const tira = useCue("tira");
  const danger = EASE.out(unit(t, computadora, 0.3)) * (1 - EASE.out(unit(t, contenedores, 0.4)));
  const lap = danger > 0 ? AMBER : G;
  const gone = EASE.in(unit(t, tira, 0.5));
  const lock = popAt(t, sellado);
  return (
    <Layer>
      <GlowTitle text="🔒 Seguridad" y={88} size={34} at={0} typed={false} />
      <div data-ui="" className="absolute rounded-[8px] px-[14px] py-[10px] font-mono" style={{ left: 36, top: 150, width: 236, height: 168, background: "rgba(10,8,2,0.92)", border: `1.5px solid ${lap}`, boxShadow: `0 0 ${10 + 16 * danger}px ${lap}66` }}>
        <div className="text-[14px] font-bold tracking-[0.1em]" style={{ color: lap }}>TU LAPTOP</div>
        {[["~/fotos", "2,1 G"], ["~/.ssh", "12 K"], ["~/trabajo", "840 M"]].map(([d, s]) => (
          <div key={d} className="mt-[8px] flex justify-between text-[14px]" style={{ color: INK }}>
            <span>▸ {d}</span>
            <span style={{ color: MUTED }}>{s}</span>
          </div>
        ))}
        {t >= tira ? <div className="mt-[8px] text-[13px] font-bold" style={{ color: G }}>✓ intacta</div> : null}
      </div>
      <Chip x={154} y={344} at={computadora + 0.1} until={contenedores} color={AMBER} solid size={14}>! Acceso total</Chip>
      <Way y={150} at={contenedores} name="Contenedor" note="comparte el kernel" icon={<Logo slug="docker" size={34} ancla={false} />} />
      <Way
        y={236}
        at={virtuales}
        name="VM"
        note="su propio kernel"
        icon={
          <svg width={34} height={34} viewBox="0 0 24 24" aria-hidden>
            <rect x={5} y={5} width={14} height={14} rx={2} fill="none" stroke={G} strokeWidth={2} />
            <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" stroke={G} strokeWidth={2} />
          </svg>
        }
      />
      <Term x={210} y={600} w={294} h={110} at={computadora} until={aislar - 0.3} color={AMBER} size={14} note={null} title="agent@laptop: ~" prompt="laptop:~$" lines={[{ at: sueltos, cmd: "rm -rf ~/trabajo/*" }]} />
      {t >= aislar - 0.3 && gone < 1 ? (
        <div className="absolute" style={{ left: 0, top: 0, width: 540, height: 960, transform: `scale(${1 - 0.4 * gone}) translateY(${gone * 120}px)`, transformOrigin: "357px 690px", opacity: 1 - gone }}>
          <Bracket x={210} y={590} w={294} h={190} at={aislar - 0.3} title="SANDBOX">
            <div className="absolute left-[14px] top-[28px] font-mono text-[12px] leading-[1.5]" data-ui="" style={{ color: INK }}>
              <div>▸ ~/work/app.py</div>
              <div>▸ ~/work/datos.csv</div>
            </div>
          </Bracket>
          <Invader x={430} y={650} px={5} at={aislar} />
          <Chip x={262} y={758} at={aislar + 0.2} size={12}>namespaces</Chip>
          <Chip x={360} y={758} at={limitar} size={12}>cgroups</Chip>
          <Chip x={452} y={758} at={permisos} size={12}>seccomp</Chip>
          {lock > 0 ? (
            <div data-ui="" className="absolute flex h-[40px] w-[40px] items-center justify-center rounded-full text-[20px]" style={{ left: 337, top: 566, background: BG, border: `2px solid ${G}`, boxShadow: `0 0 16px ${G}`, transform: `scale(${Math.min(1.2, lock)})` }}>
              🔒
            </div>
          ) : null}
        </div>
      ) : null}
      {t >= tira ? (
        <div data-ui="" className="absolute rounded-[6px] px-[10px] py-[6px] font-mono text-[14px]" style={{ left: 210, top: 640, width: 294, color: INK, border: `1.5px solid ${G}`, background: "rgba(4,16,10,0.92)", opacity: EASE.out(unit(t, tira + 0.3, 0.3)) }}>
          <span style={{ color: G }}>$</span> docker rm -f sandbox
        </div>
      ) : null}
    </Layer>
  );
}
