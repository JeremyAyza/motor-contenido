import type { ReactNode } from "react";
import { Logo } from "@motor/ui";
import { EASE, unit, useClock, useCue } from "@motor/video";
import { Layer, PopIn, TermLines, Win } from "../parts.tsx";
import { AppIcon, INK, LINE } from "../world.tsx";

/** One app of the Launchpad: its icon and name, popping in at `at` and hopping at `hop`. */
function App({ x, y, at, hop, name, icon }: { x: number; y: number; at: number; hop?: number; name: string; icon: ReactNode }) {
  const t = useClock();
  const up = hop === undefined ? 0 : Math.sin(Math.PI * unit(t, hop, 0.4)) * 12;
  return (
    <PopIn x={x} y={y} at={at}>
      <div data-ui="" className="flex flex-col items-center" style={{ width: 84, transform: `translateY(${-up}px)` }}>
        {icon}
        <span className="mt-[6px] text-[13px] font-medium" style={{ color: INK }}>{name}</span>
      </div>
    </PopIn>
  );
}

/** Developer experience: polished apps and a strong terminal side by side, all running smoothly. */
export function Experiencia() {
  const t = useClock();
  const experiencia = useCue("experiencia");
  const apps = useCue("apps");
  const pulidas = useCue("pulidas");
  const terminal = useCue("terminal");
  const vs = useCue("vs");
  const jetbrains = useCue("jetbrains");
  const docker = useCue("docker");
  const terminales = useCue("terminales");
  const bases = useCue("bases");
  const datos = useCue("datos");
  const fluido = useCue("fluido");
  const panel = EASE.out(unit(t, Math.min(0.05, experiencia - 0.2), 0.35));
  const icon = (id: Parameters<typeof AppIcon>[0]["id"]) => <AppIcon id={id} size={58} />;
  return (
    <Layer>
      <div className="absolute rounded-[18px]" style={{ left: 116, top: 96, width: 388, height: 252, background: "rgba(40,44,54,0.55)", border: `1px solid ${LINE}`, backdropFilter: "blur(12px)", opacity: panel, transform: `scale(${0.94 + 0.06 * panel})` }} />
      <App x={124} y={112} at={0.15} hop={apps} name="Xcode" icon={icon("xcode")} />
      <App x={218} y={112} at={0.3} hop={apps + 0.12} name="Safari" icon={icon("safari")} />
      <App x={312} y={112} at={pulidas} name="Notas" icon={icon("notes")} />
      <App x={406} y={112} at={pulidas + 0.12} name="FaceTime" icon={icon("facetime")} />
      <App x={124} y={228} at={vs - 0.1} hop={vs + 0.2} name="VS Code" icon={icon("vscode")} />
      <App x={218} y={228} at={jetbrains - 0.1} hop={jetbrains + 0.2} name="IntelliJ IDEA" icon={icon("intellij")} />
      <App x={312} y={228} at={docker - 0.1} hop={docker + 0.2} name="Docker" icon={icon("docker")} />
      <App x={406} y={228} at={terminales - 0.1} hop={terminales + 0.2} name="Terminal" icon={icon("terminal")} />
      <Win x={184} y={364} w={320} h={150} title="jeremy — -zsh" at={terminal - 0.3} bodyStyle={{ padding: "10px 14px" }}>
        <TermLines
          size={15}
          lines={[
            { text: "brew list", at: terminal - 0.2, kind: "cmd" },
            { text: "gh    git      jq     node", at: terminal + 0.3 },
            { text: "python ripgrep tmux", at: terminal + 0.45 },
          ]}
        />
      </Win>
      <Win x={184} y={530} w={320} h={260} title="~/code/api — npm run dev" at={terminal + 0.5} bodyStyle={{ padding: "10px 14px" }}>
        <TermLines
          size={14}
          lines={[
            { text: "npm run dev", at: terminal + 0.6, kind: "cmd" },
            { text: "postgres   :5432   listo", at: datos, kind: "ok" },
            { text: "Listening on :3000", at: datos + 0.35, kind: "ok" },
            { text: "GET  /health  200   3ms", at: fluido - 0.5 },
            { text: "GET  /users   200   9ms", at: fluido - 0.2 },
            { text: "POST /login   201  14ms", at: fluido + 0.1 },
            { text: "GET  /health  200   2ms", at: fluido + 0.4 },
          ]}
        />
        <div className="absolute" style={{ right: 12, top: 36, opacity: EASE.out(unit(t, datos, 0.3)) }}>
          <Logo slug="postgresql" size={26} ancla={false} />
        </div>
      </Win>
    </Layer>
  );
}
