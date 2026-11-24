import { EASE, unit, useClock, useCue } from "@motor/video";
import { Logo } from "@motor/ui";
import { INK, MUTED, OK, TUX } from "../world.tsx";
import { Big, Card, Chip, Desktop, Hi, Layer, Monitor, Note, Rise, Rows, SIDE, Term } from "../parts.tsx";

/** The four distros of the voice, drawn in code with their colors and official marks. */
export const DISTROS = [
  { slug: "ubuntu", name: "Ubuntu", from: "#4A1236", to: "#E95420", word: "Ubuntu," },
  { slug: "fedora", name: "Fedora", from: "#0B2A55", to: "#51A2DA", word: "Fedora," },
  { slug: "linuxmint", name: "Linux Mint", from: "#1F3A1C", to: "#86BE43", word: "Mint," },
  { slug: "archlinux", name: "Arch", from: "#0B1A2A", to: "#1793D1", word: "Arch" },
];

/**
 * Chapter 2: the monitor turns all orange with Tux and "Casi al revés" lands
 * right of the presenter. Then the kernel's code, readable; four distro
 * desktops in cascade with more distros as chips; and the layers of a
 * distro stacking up from the shared kernel.
 */
export function LinuxOpuesto() {
  const t = useClock();
  const reves = useCue("revés.");
  const codigo = useCue("código");
  const distribuciones = useCue("distribuciones:");
  const ubuntu = useCue("Ubuntu,");
  const muchas = useCue("muchas");
  const cada = useCue("Cada");
  const kernel = useCue("kernel");
  const gestor = useCue("gestor");
  const escritorio = useCue("escritorio,");
  const valores = useCue("valores");
  const intro = 1 - EASE.out(unit(t, codigo - 0.1, 0.3));
  return (
    <Layer>
      {intro > 0 ? (
        <Monitor x={36} y={170} w={468} h={280} only="tux" o={intro}>
          <div data-ui="" className="absolute bottom-[26px] left-0 right-0 text-center font-display text-[30px] font-black" style={{ color: "#F6C9A4" }}>
            Linux
          </div>
        </Monitor>
      ) : null}
      <Big x={SIDE.x} y={SIDE.y} w={SIDE.w} size={44} at={0.2} until={codigo}>
        Casi al <Hi color={TUX}>revés.</Hi>
      </Big>
      <Rise x={36} y={168} w={468} h={214} at={codigo - 0.1} until={cada - 0.15}>
        <Term
          title="kernel/sched/core.c"
          size={14}
          lines={[
            { text: "static void __sched notrace __schedule(bool preempt)", at: codigo, color: "#7FB8F0" },
            { text: "{", at: codigo + 0.15 },
            { text: "    struct task_struct *prev, *next;", at: codigo + 0.3 },
            { text: "    unsigned long *switch_count;", at: codigo + 0.45 },
            { text: "    struct rq *rq;", at: codigo + 0.6 },
            { text: "    // puedes leer cada línea", at: codigo + 0.9, color: OK },
          ]}
        />
      </Rise>
      <Chip x={420} y={366} at={codigo + 0.6} until={cada - 0.15} color={OK} size={12}>código abierto</Chip>
      <Big x={270} y={396} w={468} size={40} at={distribuciones - 0.1} until={ubuntu - 0.45} align="center" color={TUX}>
        Distribuciones
      </Big>
      {DISTROS.map((d, i) => (
        <DistroTile key={d.slug} distro={d} i={i} until={cada - 0.15} />
      ))}
      {["Debian", "Pop!_OS", "Manjaro", "Zorin", "openSUSE"].map((name, i) => (
        <Chip key={name} x={86 + i * 88} y={702} at={muchas + i * 0.08} until={cada - 0.15} color={MUTED} size={12}>
          {name}
        </Chip>
      ))}
      <Note x={270} y={182} at={cada} size={13} color={TUX}>QUÉ ES UNA DISTRO</Note>
      <Rows
        x={56}
        y={226}
        w={428}
        rowH={70}
        gap={10}
        at={cada}
        size={19}
        rows={[
          { text: "Software y valores por defecto", tag: "cada distro", at: valores, color: TUX },
          { text: "Escritorio", tag: "GNOME · KDE · Xfce", at: escritorio, color: TUX },
          { text: "Gestor de paquetes", tag: "apt · dnf · pacman", at: gestor, color: TUX },
          { text: "Kernel de Linux", tag: "lo comparten todas", at: kernel, color: OK },
        ]}
      />
      <Rise x={56} y={562} w={428} h={96} at={kernel}>
        <Card border="#2A3441">
          <div data-ui="" className="flex h-full items-center justify-around px-[10px]">
            {DISTROS.map((d) => (
              <div key={d.slug} className="flex flex-col items-center gap-[6px]">
                <Logo slug={d.slug} size={34} chip="#F4F6F9" ancla={false} />
                <span className="font-sans text-[12px] font-semibold" style={{ color: INK }}>{d.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </Rise>
      <Note x={270} y={668} at={kernel + 0.3} size={13} color={OK}>mismo kernel abajo</Note>
    </Layer>
  );
}

function DistroTile({ distro, i, until }: { distro: (typeof DISTROS)[number]; i: number; until: number }) {
  const at = useCue(distro.word) - 0.15;
  const x = 36 + (i % 2) * 240;
  const y = 400 + Math.floor(i / 2) * 146;
  return (
    <Rise x={x} y={y} w={228} h={134} at={at} until={until} dy={24}>
      <Desktop from={distro.from} to={distro.to} slug={distro.slug} name={distro.name} bar={i % 2 === 0 ? "top" : "bottom"} />
    </Rise>
  );
}
