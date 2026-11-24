import { EASE, unit, useClock, useCue } from "@motor/video";
import { Logo } from "@motor/ui";
import { AMBER, DIM, INK, MUTED, OK, TUX, WIN } from "../world.tsx";
import { Big, Card, Hi, Ic, Layer, Note, Rise, SIDE } from "../parts.tsx";

const APPS = [
  { name: "Navegador", icon: "globe" },
  { name: "Editor", icon: "code" },
  { name: "Terminal", icon: "terminal" },
  { name: "Oficina", icon: "file-text" },
  { name: "Multimedia", icon: "play" },
  { name: "La que necesitas", icon: "help-circle" },
];

/** Windows, macOS, Linux for each tool: true if it has a version. Facts of each vendor's site, as the referent shows them. */
const TOOLS: Array<{ name: string; word: string; marks: [boolean, boolean, boolean] }> = [
  { name: "Adobe Creative Cloud", word: "Adobe", marks: [true, true, false] },
  { name: "Microsoft Office", word: "herramientas", marks: [true, true, false] },
  { name: "Final Cut Pro", word: "profesionales", marks: [false, true, false] },
  { name: "DaVinci Resolve", word: "son", marks: [true, true, true] },
];

/**
 * Where freedom stops: "$0" stays and "la libertad cuesta" lands; a Linux
 * box of apps where the one you need is missing; a table of professional
 * tools by system, with Linux's column mostly empty; and Steam side by
 * side, native on Windows, through Proton on Linux, with kernel anti-cheat
 * games that may not run.
 */
export function LimitesApps() {
  const t = useClock();
  const tanta = useCue("tanta");
  const veces = useCue("veces");
  const no = useCue("no");
  const adobe = useCue("Adobe");
  const juegos = useCue("juegos");
  const proton = useCue("Proton,");
  const antitrampas = useCue("antitrampas");
  const bien = useCue("bien.");
  const cues = [useCue(TOOLS[0].word), useCue(TOOLS[1].word), useCue(TOOLS[2].word), useCue(TOOLS[3].word)];
  return (
    <Layer>
      <Big x={270} y={330} w={468} size={170} at={-1} until={veces - 0.2} align="center" color={OK}>
        $0
      </Big>
      <Big x={SIDE.x} y={SIDE.y} w={SIDE.w} size={42} at={tanta} until={veces - 0.2}>
        Pero la libertad <Hi color={AMBER}>cuesta.</Hi>
      </Big>
      <Rise x={36} y={200} w={468} h={316} at={veces - 0.1} until={adobe - 0.2}>
        <Card border="#2A3441">
          <div data-ui="" className="px-[14px] pt-[12px] font-mono text-[12px] font-bold uppercase tracking-[0.18em]" style={{ color: TUX }}>Tu equipo Linux</div>
          <div className="grid grid-cols-3 gap-[10px] px-[14px] pt-[12px]">
            {APPS.map((app, i) => {
              const missing = i === APPS.length - 1;
              const lit = missing ? EASE.out(unit(t, no, 0.3)) : 1;
              return (
                <div key={app.name} data-ui="" className="flex h-[112px] flex-col items-center justify-center gap-[8px] rounded-[6px]" style={{ background: missing ? `rgba(232,180,60,${0.1 * lit})` : "#1A212B", border: `1.5px solid ${missing && lit > 0.5 ? AMBER : "#2A3441"}` }}>
                  <Ic name={app.icon} size={30} color={missing ? AMBER : INK} />
                  <span className="font-sans text-[15px] font-semibold" style={{ color: missing ? AMBER : "#C5CDD8" }}>{app.name}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </Rise>
      <Rise x={36} y={540} w={468} h={64} at={no} until={adobe - 0.2}>
        <div data-ui="" className="absolute inset-0 flex items-center justify-between rounded-[8px] px-[16px]" style={{ background: "#1F1A10", border: `1.5px solid ${AMBER}` }}>
          <span className="font-sans text-[16px] font-semibold" style={{ color: INK }}>La app que necesitas</span>
          <span className="font-mono text-[13px] font-bold uppercase" style={{ color: AMBER }}>sin versión para Linux</span>
        </div>
      </Rise>
      <Rise x={36} y={200} w={468} h={400} at={adobe - 0.2} until={juegos - 0.2}>
        <Card border="#2A3441">
          <div data-ui="" className="flex items-center gap-[10px] px-[14px] pt-[14px]">
            <Logo slug="adobe" size={30} ancla={false} />
            <span className="font-sans text-[16px] font-bold" style={{ color: INK }}>Herramientas profesionales</span>
          </div>
          <div data-ui="" className="mt-[12px] grid px-[14px] font-mono text-[12px] font-bold uppercase tracking-[0.1em]" style={{ gridTemplateColumns: "1fr 70px 70px 70px", color: MUTED }}>
            <span />
            <span className="text-center" style={{ color: WIN }}>Windows</span>
            <span className="text-center">macOS</span>
            <span className="text-center" style={{ color: TUX }}>Linux</span>
          </div>
          {TOOLS.map((tool, i) => {
            const lit = EASE.out(unit(t, cues[i], 0.25));
            return (
              <div key={tool.name} data-ui="" className="mx-[14px] mt-[12px] grid h-[66px] items-center rounded-[6px] px-[10px]" style={{ gridTemplateColumns: "1fr 70px 70px 70px", background: "#1A212B", opacity: 0.35 + 0.65 * lit }}>
                <span className="font-sans text-[15px] font-semibold" style={{ color: INK }}>{tool.name}</span>
                {tool.marks.map((has, j) => (
                  <span key={j} className="flex justify-center">
                    {lit > 0.5 ? <Ic name={has ? "check" : "x"} size={20} color={has ? OK : j === 2 ? AMBER : DIM} /> : null}
                  </span>
                ))}
              </div>
            );
          })}
        </Card>
      </Rise>
      <Note x={270} y={616} at={adobe + 2.2} until={juegos - 0.2} size={15}>Algunas herramientas. No todas.</Note>
      <Rise x={36} y={200} w={468} h={400} at={juegos - 0.2}>
        <Card border="#2A3441">
          <div data-ui="" className="flex items-center gap-[10px] px-[14px] pt-[14px]">
            <Logo slug="steam" size={28} chip="#F4F6F9" ancla={false} />
            <span className="font-sans text-[16px] font-bold" style={{ color: INK }}>Abrir un juego en Steam</span>
          </div>
          <div className="mt-[14px] grid grid-cols-2 gap-[12px] px-[14px]">
            <GameColumn side="Windows" color={WIN} rows={[["Juego normal", "corre nativo", OK, juegos], ["Con antitrampas de kernel", "corre", OK, antitrampas]]} />
            <GameColumn side="Linux" color={TUX} rows={[["Juego normal", "corre con Proton", OK, proton], ["Con antitrampas de kernel", "puede que no", AMBER, antitrampas + 0.3]]} />
          </div>
        </Card>
      </Rise>
      <Big x={270} y={636} w={468} size={38} at={bien - 0.4} align="center">
        Algunos juegos, <Hi color={AMBER}>no todos.</Hi>
      </Big>
    </Layer>
  );
}

function GameColumn({ side, color, rows }: { side: string; color: string; rows: Array<[string, string, string, number]> }) {
  const t = useClock();
  return (
    <div data-ui="" className="flex flex-col gap-[10px]">
      <span className="font-mono text-[13px] font-bold uppercase tracking-[0.18em]" style={{ color }}>{side}</span>
      {rows.map(([name, state, c, at]) => {
        const lit = EASE.out(unit(t, at, 0.25));
        return (
          <div key={name} className="flex h-[128px] flex-col justify-center gap-[8px] rounded-[6px] px-[12px]" style={{ background: "#1A212B", border: `1.5px solid ${lit > 0.5 ? c : "#2A3441"}` }}>
            <span className="font-sans text-[14px] font-semibold" style={{ color: INK }}>{name}</span>
            <span className="font-mono text-[13px] font-bold uppercase" style={{ color: c, opacity: lit }}>{state}</span>
          </div>
        );
      })}
    </div>
  );
}
