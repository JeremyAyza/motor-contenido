import { Logo } from "@motor/ui";
import { EASE, Stamp, popAt, unit, useClock, useCue } from "@motor/video";
import { Layer, TermLines, White, Win } from "../parts.tsx";
import { AMBER, INK, LINE, MUTED, WIN } from "../world.tsx";

const CONTAINERS = [
  { name: "api", image: "node:22" },
  { name: "db", image: "postgres:16" },
  { name: "cache", image: "redis:7" },
];

/** Containers: production runs on Linux, and Docker on a Mac lives inside a light Linux virtual machine. */
export function Docker() {
  const t = useClock();
  const produccion = useCue("produccion");
  const linux = useCue("linux");
  const macos = useCue("macos");
  const kernel = useCue("kernel");
  const maquina = useCue("maquina");
  const virtual = useCue("virtual");
  const nativo = useCue("nativo");
  const outer = EASE.out(unit(t, macos - 0.1, 0.4));
  const inner = EASE.out(unit(t, maquina - 0.1, 0.45));
  return (
    <Layer>
      <Win x={116} y={96} w={388} h={206} title="Docker Desktop" at={0} bodyStyle={{ padding: "10px 16px" }}>
        <div className="flex items-center gap-[10px]">
          <Logo slug="docker" size={30} ancla={false} />
          <span className="text-[22px] font-bold" style={{ color: INK }}>Contenedores</span>
        </div>
        <div className="mt-[6px] flex justify-between px-[4px] text-[12px] font-semibold" style={{ color: MUTED }}>
          <span>Imagen</span>
          <span>Plataforma</span>
        </div>
        {CONTAINERS.map((c, i) => {
          const on = EASE.out(unit(t, produccion - 0.2 + i * 0.25, 0.3));
          return (
            <div key={c.name} className="flex items-center justify-between px-[4px] py-[4px] font-mono text-[15px]" style={{ borderTop: `1px solid ${LINE}`, opacity: on, transform: `translateX(${(1 - on) * 12}px)` }}>
              <span style={{ color: INK }}>
                <span className="mr-[6px] inline-block h-[8px] w-[8px] rounded-full" style={{ background: "#32D74B" }} />
                {c.name} <span style={{ color: MUTED }}>{c.image}</span>
              </span>
              <span style={{ color: EASE.out(unit(t, linux, 0.3)) > 0.5 ? AMBER : MUTED }}>linux/amd64</span>
            </div>
          );
        })}
      </Win>
      <Win x={184} y={318} w={320} h={128} title="jeremy — -zsh" at={macos - 0.3} bodyStyle={{ padding: "10px 14px" }}>
        <TermLines
          size={15}
          lines={[
            { text: "docker run alpine uname -r", at: macos - 0.2, kind: "cmd" },
            { text: "6.10.14-linuxkit", at: kernel + 0.2, mark: "linuxkit" },
          ]}
        />
      </Win>
      {outer > 0 ? (
        <div data-ui="" className="absolute rounded-[16px] px-[16px] py-[12px]" style={{ left: 184, top: 462, width: 320, height: 326, background: WIN, border: `1.5px solid ${LINE}`, opacity: outer, transform: `scale(${0.94 + 0.06 * outer})` }}>
          <div className="flex items-center gap-[10px]">
            <White slug="apple" size={24} />
            <div>
              <div className="text-[20px] font-bold leading-tight" style={{ color: INK }}>macOS</div>
              <div className="font-mono text-[13px]" style={{ color: MUTED }}>kernel Darwin</div>
            </div>
          </div>
          <div className="mt-[12px] rounded-[12px] px-[14px] py-[10px]" style={{ height: 222, border: `1.5px dashed ${inner > 0.5 ? AMBER : LINE}`, background: `color-mix(in srgb, ${AMBER} ${Math.round(inner * 10)}%, transparent)`, opacity: 0.25 + 0.75 * inner }}>
            <div className="flex items-center gap-[10px]">
              <Logo slug="linux" size={26} ancla={false} />
              <div>
                <div className="text-[20px] font-bold leading-tight" style={{ color: INK }}>Linux VM</div>
                <div className="font-mono text-[13px]" style={{ color: inner > 0.5 ? AMBER : MUTED }}>kernel linuxkit</div>
              </div>
            </div>
            <div className="mt-[22px] flex justify-between">
              {CONTAINERS.map((c, i) => {
                const p = popAt(t, virtual + 0.25 + i * 0.15);
                return (
                  <div key={c.name} className="rounded-full px-[16px] py-[8px] font-mono text-[18px] font-bold" style={{ background: "#1D63ED", color: "#FFF", opacity: Math.min(1, p * 2), transform: `translateY(${(1 - Math.min(1, p)) * -40}px)` }}>
                    {c.name}
                  </div>
                );
              })}
            </div>
            <div className="mt-[18px] text-[14px]" style={{ color: MUTED, opacity: EASE.out(unit(t, virtual + 0.8, 0.3)) }}>
              Tus contenedores, adentro
            </div>
          </div>
        </div>
      ) : null}
      <Stamp at={nativo - 0.1} x={344} y={318} size={28} rotate={-5} color={AMBER} fill="#0B0D12">
        No es nativo
      </Stamp>
    </Layer>
  );
}
