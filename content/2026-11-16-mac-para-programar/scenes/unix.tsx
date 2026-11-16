import type { ReactNode } from "react";
import { Icono, Logo } from "@motor/ui";
import { EASE, fade, unit, useClock, useCue } from "@motor/video";
import { Layer, PopIn, TermLines, White, Win } from "../parts.tsx";
import { ACCENT, INK, LINE, MUTED, WIN } from "../world.tsx";

/** A notification card of the stack: an icon, what it is and where it runs. */
function Note({ y, at, icon, title, sub }: { y: number; at: number; icon: ReactNode; title: string; sub: string }) {
  return (
    <PopIn x={184} y={y} at={at} origin="100% 0%">
      <div data-ui="" className="flex items-center gap-[12px] rounded-[14px] px-[12px]" style={{ width: 320, height: 56, background: `color-mix(in srgb, ${WIN} 92%, transparent)`, border: `1px solid ${LINE}`, boxShadow: "0 10px 26px rgba(0,0,0,0.45)" }}>
        <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[9px]" style={{ background: "#262A33" }}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-[16px] font-semibold leading-tight" style={{ color: INK }}>{title}</div>
          <div className="font-mono text-[13px] leading-tight" style={{ color: MUTED }}>{sub}</div>
        </div>
      </div>
    </PopIn>
  );
}

/** One branch of the Unix family: a system that comes from it. */
function Branch({ x, label, mark, on, lit }: { x: number; label: string; mark: ReactNode; on: number; lit: number }) {
  return (
    <div className="absolute flex flex-col items-center gap-[6px] rounded-[12px] py-[10px]" style={{ left: x, top: 128, width: 130, background: WIN, border: `1.5px solid ${lit > 0.5 ? ACCENT : LINE}`, opacity: on, transform: `translateY(${(1 - on) * 12}px)` }}>
      {mark}
      <span className="text-[22px] font-bold" style={{ color: INK }}>{label}</span>
    </div>
  );
}

/** Unix: the Mac's terminal says Darwin, a certified Unix; Linux is family; the server says Linux; almost everything runs there. */
export function Unix() {
  const t = useClock();
  const unix = useCue("unix");
  const construido = useCue("construido");
  const parecido = useCue("parecido");
  const linux = useCue("linux");
  const backends = useCue("backends");
  const nube = useCue("nube");
  const docker = useCue("docker");
  const ia = useCue("ia");
  const family = fade(t, construido, 0.3) * (1 - fade(t, backends - 0.35, 0.25));
  const root = EASE.out(unit(t, construido, 0.4));
  const kids = EASE.out(unit(t, construido + 0.5, 0.4));
  const lit = EASE.out(unit(t, parecido, 0.3));
  return (
    <Layer>
      <Win x={116} y={96} w={388} h={176} title="jeremy — -zsh — 80×24" at={0.1} bodyStyle={{ padding: "12px 14px" }}>
        <TermLines
          lines={[
            { text: "Last login: lun 16 nov 09:42 on console", at: 0.1, kind: "dim" },
            { text: "uname", at: unix - 0.2, kind: "cmd" },
            { text: "Darwin", at: unix + 0.35 },
          ]}
          size={15}
        />
      </Win>
      <PopIn x={250} y={196} at={construido} origin="0% 50%">
        <div className="rounded-[8px] px-[12px] py-[4px] font-mono text-[22px] font-bold" style={{ background: ACCENT, color: "#0B0D12" }}>
          Unix certificado
        </div>
      </PopIn>
      {family > 0 ? (
        <div className="absolute" style={{ left: 184, top: 290, width: 320, height: 250, opacity: family }}>
          <div className="absolute flex items-center justify-center rounded-[12px] font-mono text-[24px] font-bold" style={{ left: 100, top: 0, width: 120, height: 52, color: INK, background: "#262A33", border: `1px solid ${LINE}`, opacity: root }}>
            Unix
          </div>
          <svg className="absolute" width={320} height={130} style={{ left: 0, top: 0 }} aria-hidden>
            <path d="M 160 52 L 160 90 L 65 90 L 65 128 M 160 90 L 255 90 L 255 128" fill="none" stroke={lit > 0.5 ? ACCENT : MUTED} strokeWidth={2} strokeDasharray="200" strokeDashoffset={200 * (1 - kids)} />
          </svg>
          <Branch x={0} label="macOS" mark={<White slug="apple" size={30} />} on={kids} lit={lit} />
          <Branch x={190} label="Linux" mark={<Logo slug="linux" size={30} ancla={false} />} on={kids} lit={lit} />
        </div>
      ) : null}
      <Note y={290} at={backends} icon={<Logo slug="ubuntu" size={24} ancla={false} />} title="Deploy · api-prod" sub="Node.js en Ubuntu 24.04" />
      <Note y={354} at={nube} icon={<span style={{ color: "#6CB4F0" }}><Icono name="cloud" size={24} ancla={false} /></span>} title="Nube · 12 instancias" sub="Linux/UNIX" />
      <Note y={418} at={docker} icon={<Logo slug="docker" size={26} ancla={false} />} title="Docker · 6 contenedores" sub="linux/arm64" />
      <Note y={482} at={ia} icon={<span style={{ color: ACCENT }}><Icono name="cpu" size={24} ancla={false} /></span>} title="Servidor de IA · GPU" sub="Linux" />
      <Win x={184} y={560} w={320} h={226} title="jeremy@prod-api: ~" at={linux - 0.35} bodyStyle={{ padding: "12px 14px" }}>
        <div className="absolute" style={{ right: 12, top: 36 }}>
          <Logo slug="ubuntu" size={26} ancla={false} />
        </div>
        <TermLines
          prompt="$"
          lines={[
            { text: "ssh prod-api", at: linux - 0.3, kind: "cmd" },
            { text: "Welcome to Ubuntu 24.04.1 LTS", at: linux + 0.3 },
            { text: "uname -o", at: linux + 0.9, kind: "cmd" },
            { text: "GNU/Linux", at: linux + 1.4, kind: "ok" },
          ]}
          size={15}
        />
      </Win>
    </Layer>
  );
}
