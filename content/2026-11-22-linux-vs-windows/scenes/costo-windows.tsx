import { EASE, keys, unit, useClock, useCue } from "@motor/video";
import { AMBER, INK, MUTED, OK, WIN } from "../world.tsx";
import { Big, Card, Chip, Friction, Hi, Ic, Layer, Note, Rise, SIDE, WinWindow } from "../parts.tsx";

const SETTINGS = [
  { name: "Apps de inicio", word: "Microsoft" },
  { name: "Telemetría y diagnóstico", word: "decide" },
  { name: "Contenido recomendado", word: "muchas" },
  { name: "Actualizaciones automáticas", word: "cosas" },
];

const PROCESSES = [
  ["Antimalware Service Executable", "112 MB"],
  ["Indexador de búsqueda", "104 MB"],
  ["Experiencias del usuario conectado", "54 MB"],
  ["Orquestador de actualizaciones", "72 MB"],
  ["Optimización de distribución", "48 MB"],
  ["Xbox Game Bar", "38 MB"],
];

const PREINSTALLED = ["Xbox", "Teams", "Copilot", "Solitario", "Clipchamp", "Noticias"];

/**
 * The cost of comfort: two cards (cómodo / el costo), closed code with a
 * lock, then the things nobody asked for, each one where the last one was:
 * settings managed by Microsoft, a forced update counting down, background
 * processes, preinstalled apps, telemetry and an ad in the Start menu. A
 * friction bar at the bottom grows a step with each.
 */
export function CostoWindows() {
  const t = useClock();
  const comodidad = useCue("comodidad");
  const paga = useCue("paga.");
  const cerrado = useCue("cerrado:");
  const no = useCue("no");
  const microsoft = useCue("Microsoft");
  const actualizaciones = useCue("Actualizaciones");
  const procesos = useCue("procesos");
  const apps = useCue("apps");
  const telemetria = useCue("telemetría");
  const publicidad = useCue("publicidad");
  const remaining = Math.max(0, 14 * 60 + 56 - Math.floor(Math.max(0, t - actualizaciones)));
  const clock = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;
  const ping = (keys(t, [[telemetria, 0], [telemetria + 1.2, 1]]) * 3) % 1;
  return (
    <Layer>
      <Rise x={56} y={190} w={200} h={92} at={0.1} until={cerrado - 0.2}>
        <TradeCard title="Cómodo" text="tú no decides nada" color={OK} />
      </Rise>
      <Rise x={284} y={190} w={200} h={92} at={comodidad + 0.4} until={cerrado - 0.2}>
        <TradeCard title="El costo" text="tú no decides nada" color={AMBER} />
      </Rise>
      <Big x={SIDE.x} y={SIDE.y} w={SIDE.w} size={40} at={comodidad} until={no}>
        La comodidad se <Hi color={AMBER}>paga.</Hi>
      </Big>
      <Rise x={56} y={312} w={428} h={210} at={cerrado - 0.15} until={microsoft - 0.45}>
        <Card bg="#0A0E13" border="#2A3441">
          <div className="absolute inset-0 px-[16px] py-[14px]" style={{ filter: "blur(3.5px)", opacity: 0.6 }}>
            {[220, 300, 180, 260, 340, 150, 280].map((w, i) => (
              <div key={i} className="mb-[11px] h-[9px] rounded-full" style={{ width: w, background: i % 3 === 0 ? WIN : "#3A4556" }} />
            ))}
          </div>
          <div data-ui="" className="absolute inset-0 flex flex-col items-center justify-center gap-[10px]">
            <Ic name="lock" size={46} color={AMBER} />
            <span className="font-mono text-[15px] font-bold uppercase tracking-[0.2em]" style={{ color: AMBER }}>Código cerrado</span>
          </div>
        </Card>
      </Rise>
      <Rise x={36} y={168} w={468} h={262} at={microsoft - 0.1} until={procesos - 0.1}>
        <WinWindow title="Configuración · Privacidad">
          {SETTINGS.map((s, i) => {
            const lit = EASE.out(unit(t, microsoft + i * 0.4, 0.25));
            return (
              <div key={s.name} className="mx-[14px] mt-[10px] flex h-[44px] items-center justify-between rounded-[6px] px-[12px]" style={{ background: "#252C36" }}>
                <span className="font-sans text-[15px] font-semibold" style={{ color: INK }}>{s.name}</span>
                <span className="flex items-center gap-[6px] font-sans text-[13px] font-semibold" style={{ color: lit > 0.5 ? AMBER : MUTED }}>
                  {lit > 0.5 ? <Ic name="building-2" size={14} color={AMBER} /> : null}
                  {lit > 0.5 ? "Lo decide Microsoft" : "Activado"}
                </span>
              </div>
            );
          })}
        </WinWindow>
      </Rise>
      <Rise x={36} y={448} w={468} h={120} at={actualizaciones - 0.1} until={publicidad - 0.2}>
        <WinWindow title="Windows Update">
          <div className="flex h-full items-center gap-[14px] px-[16px]">
            <Ic name="refresh-cw" size={30} color={WIN} />
            <div className="flex-1">
              <div className="font-sans text-[15px] font-semibold" style={{ color: INK }}>Tu equipo se reiniciará para terminar de instalar actualizaciones.</div>
              <div className="mt-[4px] font-sans text-[14px]" style={{ color: MUTED }}>
                Reiniciando en <span className="font-mono font-bold" style={{ color: AMBER }}>{clock}</span>
              </div>
            </div>
          </div>
        </WinWindow>
      </Rise>
      <Rise x={36} y={168} w={468} h={262} at={procesos - 0.1}>
        <WinWindow title="Administrador de tareas">
          {PROCESSES.map(([name, mem], i) => {
            const lit = EASE.out(unit(t, procesos + 0.1 + i * 0.12, 0.2));
            return (
              <div key={name} className="mx-[12px] flex h-[38px] items-center justify-between border-b px-[6px]" style={{ borderColor: "#2E3742", opacity: lit }}>
                <span className="font-sans text-[16px] font-semibold" style={{ color: INK }}>{name}</span>
                <span className="font-mono text-[15px] font-bold" style={{ color: AMBER }}>{mem}</span>
              </div>
            );
          })}
        </WinWindow>
      </Rise>
      <Note x={270} y={434} at={procesos + 0.4} size={12}>Ejemplo ilustrativo</Note>
      <Rise x={36} y={448} w={468} h={120} at={publicidad - 0.2}>
        <WinWindow title="Inicio">
          <div className="px-[16px] pt-[12px] font-sans text-[13px] font-bold" style={{ color: INK }}>Recomendado</div>
          <div className="mx-[16px] mt-[8px] flex items-center gap-[10px] rounded-[6px] px-[10px] py-[10px]" style={{ background: "#2C2616", border: `1.5px solid ${AMBER}` }}>
            <Ic name="gamepad-2" size={20} color={AMBER} />
            <span className="font-sans text-[15px] font-semibold" style={{ color: INK }}>Prueba Game Pass por 3 meses</span>
            <span className="ml-auto font-mono text-[12px] font-bold uppercase" style={{ color: AMBER }}>anuncio</span>
          </div>
        </WinWindow>
      </Rise>
      {PREINSTALLED.map((name, i) => (
        <Chip key={name} x={36 + 44 + (i % 3) * 150} y={626 + Math.floor(i / 3) * 40} at={apps + i * 0.12} color={WIN} size={13}>
          {name}
        </Chip>
      ))}
      <Note x={36} y={582} at={apps} size={12} center={false} color={MUTED}>YA INSTALADAS</Note>
      {t >= telemetria ? (
        <div data-ui="" className="absolute flex items-center gap-[8px] font-mono text-[13px] font-bold uppercase" style={{ left: 384, top: 584, color: AMBER, opacity: EASE.out(unit(t, telemetria, 0.3)) }}>
          <span className="relative block h-[10px] w-[10px]">
            <span className="absolute inset-0 rounded-full" style={{ background: AMBER }} />
            <span className="absolute rounded-full" style={{ inset: -10 * ping, border: `1.5px solid ${AMBER}`, opacity: 1 - ping }} />
          </span>
          telemetría
        </div>
      ) : null}
      <Friction x={36} y={712} w={468} label="Windows" at={actualizaciones - 0.3} steps={[actualizaciones, procesos, apps, telemetria, publicidad]} />
    </Layer>
  );
}

function TradeCard({ title, text, color }: { title: string; text: string; color: string }) {
  return (
    <div data-ui="" className="absolute inset-0 flex flex-col justify-center rounded-[8px] px-[14px]" style={{ background: "#111720", border: `1.5px solid ${color}` }}>
      <span className="font-sans text-[20px] font-bold" style={{ color }}>{title}</span>
      <span className="font-mono text-[13px] font-bold" style={{ color: MUTED }}>{text}</span>
    </div>
  );
}
