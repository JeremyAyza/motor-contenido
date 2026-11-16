import { Logo } from "@motor/ui";
import { EASE, Stamp, unit, useClock, useCue } from "@motor/video";
import { Check, Layer, PopIn, White, Win } from "../parts.tsx";
import { ACCENT, INK, LINE, MUTED, WIN } from "../world.tsx";

/** Windows gets there with one more step, WSL; macOS comes with Unix out of the box. */
export function Wsl() {
  const t = useClock();
  const wsl = useCue("wsl");
  const subsistema = useCue("subsistema");
  const pero = useCue("pero");
  const unix = useCue("unix");
  const fabrica = useCue("fabrica");
  const code = EASE.out(unit(t, wsl, 0.3));
  return (
    <Layer>
      <Win x={116} y={96} w={388} h={318} title="learn.microsoft.com" at={0} bodyStyle={{ padding: "16px 18px" }}>
        <div className="text-[13px] font-semibold" style={{ color: MUTED }}>Microsoft Learn</div>
        <div className="mt-[8px] text-[24px] font-bold leading-[1.15]" style={{ color: INK }}>
          Instalar Linux en Windows con WSL
        </div>
        <div className="mt-[8px] text-[13px] leading-snug" style={{ color: MUTED }}>
          Herramientas y apps de Linux, dentro de Windows.
        </div>
        <div className="mt-[16px] text-[12px] font-semibold" style={{ color: MUTED }}>PowerShell</div>
        <div className="mt-[6px] rounded-[8px] px-[14px] py-[10px] font-mono text-[18px]" style={{ background: "#0E1015", color: INK, border: `1px solid ${code > 0 ? `color-mix(in srgb, ${ACCENT} ${Math.round(code * 100)}%, transparent)` : LINE}` }}>
          wsl --install
        </div>
      </Win>
      <PopIn x={184} y={432} at={subsistema} origin="50% 0%">
        <div data-ui="" className="flex items-center gap-[14px] rounded-[14px] px-[16px]" style={{ width: 320, height: 104, background: WIN, border: `1px solid ${LINE}`, boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}>
          <Logo slug="windows" size={40} ancla={false} />
          <div className="min-w-0 flex-1">
            <div className="text-[26px] font-bold leading-none" style={{ color: INK }}>WSL</div>
            <div className="mt-[6px] text-[13px] leading-tight" style={{ color: MUTED }}>Windows Subsystem for Linux</div>
          </div>
          <Logo slug="linux" size={40} ancla={false} />
        </div>
      </PopIn>
      <PopIn x={184} y={560} at={pero} origin="50% 0%">
        <div data-ui="" className="flex items-center gap-[14px] rounded-[14px] px-[16px]" style={{ width: 320, height: 120, background: `color-mix(in srgb, ${ACCENT} 12%, ${WIN})`, border: `1px solid ${ACCENT}` }}>
          <White slug="apple" size={42} />
          <div className="min-w-0 flex-1">
            <div className="text-[26px] font-bold leading-none" style={{ color: INK }}>macOS</div>
            <div className="mt-[8px] font-mono text-[15px]" style={{ color: MUTED }}>Unix: incluido</div>
          </div>
          <Check p={EASE.out(unit(t, unix, 0.4))} size={36} />
        </div>
      </PopIn>
      <Stamp at={fabrica} x={344} y={730} size={30} rotate={-5} color={ACCENT} fill="#0B0D12">
        De fábrica
      </Stamp>
    </Layer>
  );
}
