import { EASE, keys, unit, useClock, useCue } from "@motor/video";
import { Layer, LogoTile, useOn } from "../parts.tsx";
import { BG, G, INK, MUTED, RED } from "../world.tsx";

/** One row of the scoreboard: a method, its time and five attempts. */
function Row({ y, label, time, hits, score, at, color }: { y: number; label: string; time: string; hits: boolean[]; score: string; at: number; color: string }) {
  const t = useClock();
  const on = EASE.out(unit(t, at - 0.3, 0.3));
  return (
    <div data-ui="" className="absolute rounded-[8px] px-[14px] py-[10px] font-mono" style={{ left: 36, top: y, width: 468, background: "rgba(4,16,10,0.92)", border: `1.5px solid ${color}`, boxShadow: `0 0 12px ${color}44`, opacity: 0.35 + 0.65 * on }}>
      <div className="flex justify-between text-[14px] font-bold tracking-[0.08em]" style={{ color }}>
        <span>{label}</span>
        <span>{t >= at ? time : "– s"}</span>
      </div>
      <div className="mt-[8px] flex items-center gap-[8px]">
        {hits.map((ok, i) => {
          const shown = t >= at + i * 0.18;
          return (
            <div key={i} className="flex h-[26px] w-[26px] items-center justify-center rounded-[3px] text-[16px] font-bold" style={{ border: `1.5px solid ${color}88`, color: ok ? BG : RED, background: shown && ok ? G : "transparent" }}>
              {shown ? (ok ? "✓" : "✕") : ""}
            </div>
          );
        })}
        <span className="ml-auto text-[16px] font-bold" style={{ color: t >= at + 1 ? color : MUTED }}>{t >= at + 1 ? score : ""}</span>
      </div>
    </div>
  );
}

/**
 * Pixels against text: an admin panel where a screenshot crosshair aims at
 * "Reiniciar" and clicks beside it (a red ✕). Under it Rick's scoreboard fills
 * row by row, the click slow and wrong, the command fast and right. On "Linux",
 * Tux and LINUX ⇄ TEXTO land on the floor.
 */
export function Pixeles() {
  const t = useClock();
  const capturas = useCue("capturas");
  const clic = useCue("clic");
  const lento = useCue("lento");
  const idioma = useCue("idioma");
  const linux = useCue("Linux");
  const scan = EASE.out(unit(t, capturas, 0.4));
  const mx = keys(t, [[capturas, 160], [clic, 400], [clic + 0.5, 360]]);
  const my = keys(t, [[capturas, 200], [clic, 190], [clic + 0.5, 236]]);
  const miss = t >= clic + 0.55;
  const title = useOn(linux, 0.3);
  return (
    <Layer>
      <div className="absolute overflow-hidden rounded-[10px]" style={{ left: 36, top: 92, width: 468, height: 170, background: "#151C2A", border: "1.5px solid #8DA2C4" }}>
        <div data-ui="" className="px-[12px] py-[6px] font-sans text-[13px] font-semibold" style={{ color: "#C9D8F5", borderBottom: "1px solid #8DA2C455" }}>Panel de administración</div>
        <div data-ui="" className="px-[14px] pt-[12px] font-sans text-[15px] font-semibold" style={{ color: "#DCE6F7" }}>Servicio: checkout-api</div>
        <div className="mx-[14px] mt-[10px] h-[10px] w-[220px] rounded-[3px]" style={{ background: "#2A3650" }} />
        <div className="mx-[14px] mt-[8px] h-[10px] w-[160px] rounded-[3px]" style={{ background: "#2A3650" }} />
        <div data-ui="" className="absolute rounded-[6px] px-[16px] py-[7px] font-sans text-[15px] font-bold" style={{ left: 330, top: 112, color: "#0E1626", background: "#7FA6F2" }}>Reiniciar</div>
        {scan > 0 ? <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(60,255,138,0) ${scan * 100 - 6}%, rgba(60,255,138,0.25) ${scan * 100}%, rgba(60,255,138,0) ${scan * 100 + 1}%)` }} /> : null}
      </div>
      {t >= capturas ? (
        <svg className="absolute" style={{ left: mx - 22, top: my - 22 }} width={44} height={44} aria-hidden>
          <circle cx={22} cy={22} r={14} fill="none" stroke={miss ? RED : INK} strokeWidth={2} />
          <line x1={22} y1={0} x2={22} y2={44} stroke={miss ? RED : INK} strokeWidth={1.5} />
          <line x1={0} y1={22} x2={44} y2={22} stroke={miss ? RED : INK} strokeWidth={1.5} />
        </svg>
      ) : null}
      {miss ? <div className="absolute font-mono text-[30px] font-bold" style={{ left: mx - 11, top: my + 16, color: RED, textShadow: `0 0 10px ${RED}` }}>✕</div> : null}
      <Row y={290} label="CAPTURA + CLIC" time="4,2 s" hits={[false, true, false, true, false]} score="2/5" at={lento} color="#C9D8F5" />
      <Row y={384} label="COMANDO DE TEXTO" time="0,04 s" hits={[true, true, true, true, true]} score="5/5" at={idioma} color={G} />
      <div data-ui="" className="absolute right-[36px] top-[478px] font-mono text-[12px] font-bold" style={{ color: MUTED }}>EJEMPLO ILUSTRATIVO</div>
      {title > 0 ? (
        <div className="absolute flex items-center gap-[12px] font-mono text-[38px] font-bold" style={{ left: 196, top: 600, opacity: title, transform: `scale(${0.85 + 0.15 * title})`, color: G, textShadow: `0 0 14px ${G}` }}>
          LINUX <span style={{ color: "var(--piece-accent)", textShadow: "none" }}>⇄</span> TEXTO
        </div>
      ) : null}
      <LogoTile slug="tux" x={360} y={720} at={linux + 0.2} size={70} />
    </Layer>
  );
}
