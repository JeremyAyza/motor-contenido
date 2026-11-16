import { Icono } from "@motor/ui";
import { EASE, fade, lerp, unit, useClock, useCue } from "@motor/video";
import { Layer, PopIn, Win } from "../parts.tsx";
import { ACCENT, GREEN, INK, LINE, MUTED, WIN } from "../world.tsx";

/** Rick's CPU load: low, then up to 86 % as the work comes in. */
const LOAD = [12, 14, 11, 16, 13, 15, 12, 18, 30, 52, 61, 70, 66, 78, 74, 82, 80, 86, 84, 86];

const PROCS: Array<{ name: string; cpu: string; word: string }> = [
  { name: "Visual Studio Code", cpu: "6.8", word: "ide" },
  { name: "node (dev server)", cpu: "4.1", word: "servidores" },
  { name: "Safari · 38 pestañas", cpu: "3.6", word: "pestanas" },
  { name: "Docker", cpu: "1.9", word: "procesos" },
  { name: "mds_stores", cpu: "0.8", word: "procesos" },
];

/** Performance per watt: much power for little energy, a full day of work, and the battery barely moves. */
export function Vatio() {
  const t = useClock();
  const vatio = useCue("vatio");
  const potencia = useCue("potencia");
  const energia = useCue("energia");
  const cues: Record<string, number> = { ide: useCue("ide"), servidores: useCue("servidores"), pestanas: useCue("pestanas"), procesos: useCue("procesos") };
  const bateria = useCue("bateria");
  const cargador = useCue("cargador");
  const draw = EASE.out(unit(t, potencia - 0.3, 1.2));
  const tab = fade(t, energia - 0.1, 0.2);
  const swap = fade(t, bateria - 0.25, 0.3);
  const later = EASE.inOut(unit(t, cargador - 0.2, 0.7));
  const level = lerp(100, 78, later);
  const pts = LOAD.map((v, i) => `${(i / (LOAD.length - 1)) * 330},${110 - v * 1.1}`);
  const shown = Math.max(2, Math.ceil(draw * LOAD.length));
  return (
    <Layer>
      <div className="absolute" style={{ left: 116, top: 96, width: 388, height: 156, opacity: 1 - swap }}>
        <Win x={0} y={0} w={388} h={156} at={0} bodyStyle={{ padding: "12px 18px" }}>
          <div className="flex items-center gap-[6px] text-[15px] font-semibold" style={{ color: GREEN }}>
            <Icono name="zap" size={16} ancla={false} />
            Apple Silicon
          </div>
          <div data-ui={undefined} className="mt-[4px] font-display text-[44px] font-black leading-[1.0] tracking-tight" style={{ color: INK }}>
            Rendimiento
            <br />
            <span style={{ color: GREEN, opacity: EASE.out(unit(t, vatio - 0.15, 0.3)) }}>por vatio.</span>
          </div>
        </Win>
      </div>
      <PopIn x={116} y={96} at={bateria - 0.2} origin="50% 0%">
        <div data-ui="" className="flex items-center gap-[16px] rounded-[12px] px-[18px]" style={{ width: 388, height: 156, background: WIN, border: `1px solid ${LINE}` }}>
          <div className="flex-1">
            <div className="text-[13px] font-semibold" style={{ color: MUTED }}>Hoy</div>
            <div className="font-mono text-[40px] font-bold leading-none" style={{ color: INK }}>{later < 0.5 ? "9:45" : "18:12"}</div>
            <div className="mt-[6px] text-[13px]" style={{ color: MUTED }}>{later < 0.5 ? "Cargada a las 9:41" : "Fuente: batería"}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              <div className="relative rounded-[8px] p-[4px]" style={{ width: 130, height: 56, border: `2.5px solid ${INK}` }}>
                <div className="h-full rounded-[4px]" style={{ width: `${level}%`, background: GREEN }} />
              </div>
              <div className="ml-[3px] h-[18px] w-[5px] rounded-r-[3px]" style={{ background: INK }} />
            </div>
            <div className="mt-[6px] font-mono text-[28px] font-bold" style={{ color: INK }}>{Math.round(level)} %</div>
          </div>
        </div>
      </PopIn>
      <Win x={116} y={268} w={388} h={236} title="Monitor de Actividad" at={potencia - 0.5} bodyStyle={{ padding: "10px 14px" }}>
        <div className="flex gap-[4px] text-[12px] font-semibold">
          {["CPU", "Memoria", "Energía", "Disco", "Red"].map((name) => {
            const active = name === "CPU" ? 1 - tab : name === "Energía" ? tab : 0;
            return (
              <span key={name} className="rounded-[5px] px-[8px] py-[2px]" style={{ color: active > 0.5 ? INK : MUTED, background: active > 0.5 ? "#3A3F4B" : "transparent" }}>
                {name}
              </span>
            );
          })}
        </div>
        <div className="relative mt-[10px]" style={{ height: 150 }}>
          <div className="absolute inset-0" style={{ opacity: 1 - tab }}>
            <div className="flex items-baseline justify-between">
              <span className="text-[18px] font-semibold" style={{ color: INK }}>Carga del CPU</span>
              <span className="font-mono text-[18px] font-bold" style={{ color: ACCENT }}>{Math.round(LOAD[Math.min(LOAD.length - 1, shown - 1)])} %</span>
            </div>
            <svg className="mt-[8px]" width={360} height={112} viewBox="0 0 330 112" aria-hidden>
              <polygon points={`0,112 ${pts.slice(0, shown).join(" ")} ${((shown - 1) / (LOAD.length - 1)) * 330},112`} fill={`color-mix(in srgb, ${ACCENT} 30%, transparent)`} />
              <polyline points={pts.slice(0, shown).join(" ")} fill="none" stroke={ACCENT} strokeWidth="2.5" />
            </svg>
          </div>
          <div className="absolute inset-0" style={{ opacity: tab }}>
            <div className="flex items-baseline justify-between">
              <span className="text-[18px] font-semibold" style={{ color: INK }}>Impacto energético</span>
              <span className="font-mono text-[18px] font-bold" style={{ color: GREEN }}>0.4</span>
            </div>
            <svg className="mt-[8px]" width={360} height={112} viewBox="0 0 330 112" aria-hidden>
              <polyline points={LOAD.map((_, i) => `${(i / (LOAD.length - 1)) * 330 * Math.min(1, unit(t, energia, 0.8))},${100 - (i % 3) * 2}`).join(" ")} fill="none" stroke={GREEN} strokeWidth="2.5" />
            </svg>
            <div className="mt-[-6px] text-[15px] font-semibold" style={{ color: GREEN }}>Poca energía</div>
          </div>
        </div>
      </Win>
      <Win x={184} y={520} w={320} h={270} title="Procesos" at={cues.ide - 0.35} bodyStyle={{ padding: "8px 12px" }}>
        <div className="flex justify-between px-[8px] pb-[4px] text-[12px] font-semibold" style={{ color: MUTED, borderBottom: `1px solid ${LINE}` }}>
          <span>Proceso</span>
          <span>% CPU</span>
        </div>
        {PROCS.map((p, i) => {
          const at = cues[p.word] + (i === 4 ? 0.3 : 0);
          const on = EASE.out(unit(t, at, 0.25));
          return (
            <div key={p.name} className="mt-[5px] flex justify-between rounded-[6px] px-[8px] py-[6px] text-[15px]" style={{ opacity: on, transform: `translateX(${(1 - on) * 14}px)`, background: on > 0 && t < at + 0.8 ? `color-mix(in srgb, ${ACCENT} ${Math.round(80 * (1 - unit(t, at + 0.3, 0.5)))}%, transparent)` : "transparent", color: INK }}>
              <span>{p.name}</span>
              <span className="font-mono">{p.cpu}</span>
            </div>
          );
        })}
      </Win>
    </Layer>
  );
}
