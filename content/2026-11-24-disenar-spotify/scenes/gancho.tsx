import { Logo } from "@motor/ui";
import { EASE, unit, useClock, useCue } from "@motor/video";
import { Card, CoverGrid, Cover, Layer, PlayButton, Title, useOn } from "../parts.tsx";
import { DIM, G, INK, LINE, MUTED } from "../world.tsx";

/**
 * The hook: from frame 1, "VAMOS A DISEÑAR SPOTIFY" over the big green logo,
 * which beats. On "buscas" the logo goes and a search card fills with covers;
 * on "play" a song card plays; on "detrás" the card steps back and a wall of
 * empty boxes appears behind it, the problems under one tap.
 */
export function Gancho() {
  const t = useClock();
  const buscas = useCue("buscas");
  const tocas = useCue("tocas");
  const suena = useCue("suena");
  const detras = useCue("detrás");
  const problemas = useCue("problemas");
  const logoOut = useOn(buscas - 0.25, 0.25);
  const beat = 1 + 0.04 * Math.max(0, Math.sin(t * Math.PI * 2 * 1.6));
  const back = EASE.inOut(unit(t, detras, 0.5));
  const progress = Math.min(1, Math.max(0, (t - suena) / 6));
  const typed = "trap argentino".slice(0, Math.max(0, Math.floor((t - buscas - 0.2) / 0.05)));
  return (
    <Layer>
      {logoOut < 1 ? (
        <>
          <Title text="Vamos a diseñar Spotify" at={0} until={buscas - 0.2} typed={false} big y={150} />
          <div className="absolute" style={{ left: 270 - 95, top: 380, opacity: 1 - logoOut, transform: `scale(${(1 - 0.4 * logoOut) * beat * (0.85 + 0.15 * EASE.back(unit(t, 0, 0.5)))})` }}>
            <Logo slug="spotify" size={190} ancla />
          </div>
        </>
      ) : null}
      <div style={{ opacity: 1 - 0.75 * back, transform: `scale(${1 - 0.18 * back})`, transformOrigin: "200px 300px" }}>
        <Card x={36} y={150} w={248} h={330} at={buscas} until={detras + 0.6} title="BUSCAR">
          <div data-ui="" className="mx-[12px] mt-[8px] flex h-[30px] items-center rounded-[15px] px-[12px] font-mono text-[14px]" style={{ border: `1.5px solid ${LINE}`, color: INK }}>
            <span style={{ color: MUTED }}>⌕&nbsp;</span>
            {typed}
          </div>
        </Card>
        <CoverGrid x={49} y={210} cols={3} rows={3} size={70} gap={6} at={buscas + 0.4} until={detras + 0.6} stagger={0.05} />
      </div>
      {/* The wall of problems behind the tap. */}
      {Array.from({ length: 12 }, (_, i) => {
        const c = i % 4;
        const r = Math.floor(i / 4);
        const o = EASE.out(unit(t, detras + 0.1 + (c + r) * 0.07, 0.25));
        const lit = t >= problemas + 0.1 * i;
        return o > 0 ? <div key={i} className="absolute rounded-[6px]" style={{ left: 48 + c * 114, top: 150 + r * 110, width: 102, height: 98, border: `1.5px solid ${lit ? `${G}66` : DIM}`, background: lit ? "rgba(30,215,96,0.05)" : "transparent", opacity: o }} /> : null;
      })}
      <Card x={296} y={146} w={190} h={262} at={tocas - 0.15} glow>
        <div className="absolute left-[15px] top-[15px]">
          <Cover n={4} x={0} y={0} size={160} at={tocas - 0.15} />
        </div>
        <div className="absolute left-[15px] top-[186px] h-[8px] w-[110px] rounded-[2px]" style={{ background: INK }} />
        <div className="absolute left-[15px] top-[202px] h-[6px] w-[70px] rounded-[2px]" style={{ background: MUTED }} />
        <div className="absolute left-[15px] top-[230px] h-[4px] w-[110px] rounded-[2px]" style={{ background: DIM }} />
        <div className="absolute left-[15px] top-[230px] h-[4px] rounded-[2px]" style={{ width: 110 * progress, background: G }} />
      </Card>
      <PlayButton x={456} y={384} size={40} at={tocas} />
      <Title text="Problemas distintos, a escala enorme" at={problemas} />
    </Layer>
  );
}
