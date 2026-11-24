import { EASE, keys, unit, useClock, useCue } from "@motor/video";
import { DIM, INK, LINE, MUTED, WIN } from "../world.tsx";
import { Ic, Layer, Monitor, Note, Rise, WinWindow } from "../parts.tsx";

const PINNED = [
  { name: "Edge", color: "#2A9BD8", icon: "globe" },
  { name: "Store", color: "#5B6BD9", icon: "shopping-bag" },
  { name: "Correo", color: "#2F80E0", icon: "mail" },
  { name: "Fotos", color: "#D9488B", icon: "image" },
  { name: "Ajustes", color: "#7D8794", icon: "settings" },
  { name: "Archivos", color: "#E8B43C", icon: "folder" },
];

/**
 * Chapter 1: the monitor turns all blue with "Windows 11", the camera goes
 * into it and a Start menu rebuilt in Spanish rises; under it, ten desktops
 * paint themselves blue, seven of ten, while the figure counts up to 71 %.
 */
export function WindowsDefecto() {
  const t = useClock();
  const esta = useCue("Está");
  const siete = useCue("siete");
  const usan = useCue("usan.");
  const zoom = keys(t, [[0, 1], [esta - 0.1, 1.04], [esta + 0.35, 1.5]]);
  const monitorOut = EASE.out(unit(t, esta, 0.35));
  const pct = Math.round(keys(t, [[siete - 0.15, 36], [siete + 0.55, 71]]));
  const counted = EASE.out(unit(t, siete - 0.15, 0.3));
  return (
    <Layer>
      {monitorOut < 1 ? (
        <Monitor x={36} y={170} w={468} h={280} only="win" scale={zoom} o={1 - monitorOut}>
          <div data-ui="" className="absolute bottom-[26px] left-0 right-0 text-center font-display text-[30px] font-black" style={{ color: "#CFE3FA" }}>
            Windows 11
          </div>
        </Monitor>
      ) : null}
      <Rise x={70} y={170} w={400} h={300} at={esta + 0.1} dy={60}>
        <WinWindow title="Inicio">
          <div className="mx-[16px] mt-[12px] flex h-[30px] items-center gap-[8px] rounded-full px-[12px]" style={{ background: "#2A313B", color: MUTED }}>
            <Ic name="search" size={14} color={MUTED} />
            <span className="font-sans text-[13px]">Busca apps, ajustes y documentos</span>
          </div>
          <div className="mx-[18px] mt-[14px] font-sans text-[13px] font-bold" style={{ color: INK }}>Anclado</div>
          <div className="mx-[18px] mt-[8px] grid grid-cols-6 gap-[6px]">
            {PINNED.map((app) => (
              <div key={app.name} className="flex flex-col items-center gap-[5px]">
                <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px]" style={{ background: app.color }}>
                  <Ic name={app.icon} size={18} color="#FFFFFF" />
                </div>
                <span className="font-sans text-[12px]" style={{ color: "#C5CDD8" }}>{app.name}</span>
              </div>
            ))}
          </div>
          <div className="mx-[18px] mt-[16px] font-sans text-[13px] font-bold" style={{ color: INK }}>Recomendado</div>
          <div className="mx-[18px] mt-[8px] flex gap-[10px]">
            {["Primeros pasos", "Explora Windows"].map((r) => (
              <div key={r} className="flex flex-1 items-center gap-[8px] rounded-[6px] px-[8px] py-[7px]" style={{ background: "#252C36" }}>
                <span className="block h-[18px] w-[18px] rounded-[4px]" style={{ background: WIN }} />
                <span className="font-sans text-[12px]" style={{ color: "#C5CDD8" }}>{r}</span>
              </div>
            ))}
          </div>
        </WinWindow>
      </Rise>
      <Rise x={36} y={500} w={468} h={60} at={siete - 0.4}>
        <div className="flex h-full items-end justify-between">
          {Array.from({ length: 10 }, (_, i) => {
            const k = i < 7 ? EASE.out(unit(t, siete - 0.15 + i * 0.08, 0.15)) : 0;
            return (
              <div key={i} className="flex flex-col items-center">
                <div className="rounded-[3px]" style={{ width: 38, height: 28, border: `2px solid ${k > 0.5 ? WIN : LINE}`, background: k > 0 ? `rgba(59,142,234,${0.75 * k})` : "transparent" }} />
                <div style={{ width: 14, height: 6, background: k > 0.5 ? WIN : DIM }} />
              </div>
            );
          })}
        </div>
      </Rise>
      {counted > 0 ? (
        <div className="absolute left-0 right-0 text-center font-display font-black leading-none" style={{ top: 582, fontSize: 96, color: WIN, opacity: counted, transform: `scale(${0.9 + 0.1 * counted})` }}>
          {pct} %
        </div>
      ) : null}
      <Note x={270} y={690} at={siete + 0.3} size={15}>de las computadoras de escritorio usan Windows</Note>
    </Layer>
  );
}
