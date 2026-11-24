import { EASE, lerp, unit, useClock, useCue } from "@motor/video";
import { Logo } from "@motor/ui";
import { INK, OK, TUX } from "../world.tsx";
import { Big, Chip, Hi, Ic, Layer, Photo, Rise, Rows, SIDE, Term } from "../parts.tsx";

const ROUTE = ["tu laptop", "CI", "contenedor", "servidor"];

/**
 * Chapter 3, developers: a terminal says "developer" next to the presenter.
 * Then a data-center aisle with the route of your code (laptop, CI,
 * container, server); a light travels it and "YA ES LINUX" lands on the
 * server. Then a rack whose list lights LINUX row by row, and an ssh session
 * to a Linux server with the tools that feel at home there.
 */
export function Developers() {
  const t = useClock();
  const historia = useCue("historia");
  const casi = useCue("Casi");
  const termina = useCue("termina");
  const linux = useCue("Linux:");
  const servidores = useCue("servidores");
  const contenedores = useCue("contenedores");
  const clusteres = useCue("clústeres");
  const web = useCue("web.");
  const por = useCue("Por");
  const ssh = useCue("SSH,");
  const gestores = useCue("gestores");
  const shells = useCue("shells");
  const compiladores = useCue("compiladores");
  const casa = useCue("casa.");
  const travel = EASE.inOut(unit(t, termina, linux - termina));
  return (
    <Layer>
      <Rise x={56} y={190} w={428} h={150} at={0} until={casi - 0.1}>
        <Term
          title="bash"
          size={16}
          lines={[
            { text: "whoami", at: 0.1, prompt: true },
            { text: "developer", at: 0.6, color: TUX },
          ]}
        />
      </Rise>
      <Big x={SIDE.x} y={SIDE.y - 10} w={SIDE.w} size={36} at={0.3} until={casi}>
        Para developers, la historia <Hi color={TUX}>cambia.</Hi>
      </Big>
      <Rise x={36} y={180} w={468} h={320} at={casi - 0.1} until={servidores - 0.2}>
        <Photo src="img/datacenter.png" label="Donde corre tu código" />
      </Rise>
      {ROUTE.map((name, i) => {
        const x = 90 + i * 120;
        const isServer = i === ROUTE.length - 1;
        const on = isServer ? EASE.out(unit(t, linux, 0.25)) : 0;
        return (
          <Chip key={name} x={x} y={534} at={casi + 0.2 + i * 0.25} until={servidores - 0.2} color={on > 0.5 ? TUX : INK} solid={on > 0.5} size={13}>
            {name}
          </Chip>
        );
      })}
      {t >= termina && t < servidores - 0.2 ? (
        <div className="absolute rounded-full" style={{ left: lerp(90, 450, travel) - 6, top: 558, width: 12, height: 12, background: TUX, boxShadow: `0 0 12px ${TUX}` }} />
      ) : null}
      <Big x={270} y={600} w={468} size={64} at={linux - 0.05} until={por - 0.2} align="center" color={TUX} upper>
        Ya es Linux
      </Big>
      <Rise x={36} y={180} w={170} h={380} at={servidores - 0.2} until={por - 0.2}>
        <Photo src="img/rack.png" />
      </Rise>
      <Rows
        x={218}
        y={180}
        w={286}
        rowH={86}
        gap={12}
        at={servidores - 0.2}
        until={por - 0.2}
        size={16}
        rows={[
          { text: "Servidores en la nube", tag: "linux", at: servidores, color: TUX, icon: <Ic name="cloud" size={18} color={TUX} /> },
          { text: "Contenedores", tag: "linux", at: contenedores, color: TUX, icon: <Logo slug="docker" size={20} ancla={false} /> },
          { text: "Kubernetes", tag: "linux", at: clusteres, color: TUX, icon: <Logo slug="kubernetes" size={20} ancla={false} /> },
          { text: "Servidores web", tag: "linux", at: web, color: TUX, icon: <Ic name="globe" size={18} color={TUX} /> },
        ]}
      />
      <Rise x={36} y={180} w={468} h={300} at={por - 0.2}>
        <Term
          title="ssh · servidor"
          size={17}
          note="Ejemplo ilustrativo"
          lines={[
            { text: "ssh deploy@servidor", at: por, prompt: true },
            { text: "Bienvenido a Ubuntu", at: ssh + 0.2, color: TUX },
            { text: "sudo apt install nginx", at: gestores, prompt: true },
            { text: "echo $SHELL", at: shells, prompt: true },
            { text: "/bin/bash", at: shells + 0.4 },
            { text: "which gcc", at: compiladores, prompt: true },
            { text: "/usr/bin/gcc", at: compiladores + 0.4 },
          ]}
        />
      </Rise>
      {[
        ["SSH", ssh],
        ["Paquetes", gestores],
        ["Shells", shells],
        ["Compiladores", compiladores],
      ].map(([name, at], i) => (
        <Chip key={name as string} x={95 + i * 117} y={516} at={at as number} color={OK} size={14}>
          {name}
        </Chip>
      ))}
      <Big x={270} y={636} w={468} size={52} at={casa - 0.35} align="center">
        Se sienten <Hi color={OK}>en casa.</Hi>
      </Big>
    </Layer>
  );
}
