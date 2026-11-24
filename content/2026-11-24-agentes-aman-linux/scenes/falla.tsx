import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Layer, Term, useOn } from "../parts.tsx";
import { BG, G, INK, MUTED, RED } from "../world.tsx";

/** One tool of the checklist: its command, what it does and a check when the voice names it. */
function Tool({ y, cmd, what, at }: { y: number; cmd: string; what: string; at: number }) {
  const t = useClock();
  const on = EASE.out(unit(t, at, 0.25));
  return (
    <div data-ui="" className="absolute flex items-center rounded-[6px] px-[12px] font-mono" style={{ left: 210, top: y, width: 294, height: 44, background: on > 0.5 ? "rgba(60,255,138,0.12)" : "rgba(4,16,10,0.9)", border: `1.5px solid ${on > 0.5 ? G : `${G}55`}`, boxShadow: on > 0.5 ? `0 0 12px ${G}55` : "none" }}>
      <span className="w-[56px] text-[18px] font-bold" style={{ color: on > 0.5 ? G : MUTED }}>{cmd}</span>
      <span className="text-[13px] font-bold uppercase tracking-[0.08em]" style={{ color: on > 0.5 ? INK : MUTED }}>{what}</span>
      <span className="ml-auto text-[20px] font-bold" style={{ color: G, opacity: on, transform: `scale(${popAt(t, at)})` }}>✓</span>
    </div>
  );
}

/**
 * The terminal: Rick's red failure card counts restarts while the floor turns
 * red; three folders get crossed out ("en vez de abrir carpetas"); then the
 * terminal takes the top and runs grep, find, cat and git as the voice names
 * them, while the checklist on the floor ticks each one.
 */
export function Falla() {
  const t = useClock();
  const cae = useCue("cae");
  const vez = useCue("vez");
  const carpetas = useCue("carpetas");
  const terminal = useCue("terminal");
  const grep = useCue("grep");
  const find = useCue("find");
  const cat = useCue("cat");
  const git = useCue("git");
  const card = useOn(0.1, 0.3) * (1 - useOn(terminal, 0.3));
  const restarts = t < cae + 0.3 ? 1 : t < vez ? 2 : 3;
  const cross = EASE.out(unit(t, carpetas + 0.2, 0.3));
  const folders = useOn(carpetas - 0.4, 0.3) * (1 - useOn(terminal, 0.3));
  return (
    <Layer>
      {card > 0 ? (
        <div data-ui="" className="absolute flex rounded-[8px] font-mono" style={{ left: 36, top: 100, width: 468, height: 150, background: "rgba(30,4,8,0.92)", border: `2px solid ${RED}`, boxShadow: `0 0 20px ${RED}55`, opacity: card }}>
          <div className="flex-1 px-[16px] py-[14px]">
            <div className="text-[15px] font-bold tracking-[0.06em]" style={{ color: RED }}>✕ checkout-api.service</div>
            <div className="mt-[10px] text-[14px]" style={{ color: INK }}>Main process exited,</div>
            <div className="text-[14px]" style={{ color: RED }}>status=1/FAILURE</div>
          </div>
          <div className="flex w-[130px] flex-col items-center justify-center" style={{ borderLeft: `1.5px solid ${RED}88` }}>
            <div className="text-[13px] font-bold tracking-[0.1em]" style={{ color: RED }}>REINICIOS</div>
            <div className="text-[64px] font-bold leading-none" style={{ color: RED, textShadow: `0 0 16px ${RED}`, transform: `scale(${1 + 0.25 * Math.max(0, 1 - Math.abs(t - (restarts === 2 ? cae + 0.3 : vez)) / 0.2)})` }}>{restarts}</div>
          </div>
        </div>
      ) : null}
      {folders > 0
        ? ["src", "logs", "config"].map((name, i) => (
            <div key={name} className="absolute flex flex-col items-center" style={{ left: 120 + i * 150, top: 300, opacity: folders, transform: "translate(-50%, 0)" }}>
              <svg width={70} height={54} viewBox="0 0 54 42" aria-hidden>
                <path d="M2 8 Q2 4 6 4 L20 4 L25 9 L48 9 Q52 9 52 13 L52 37 Q52 40 48 40 L6 40 Q2 40 2 36 Z" fill="none" stroke="#9FB4DA" strokeWidth={2} />
                {cross > 0 ? <line x1={4} y1={4} x2={4 + 46 * cross} y2={4 + 36 * cross} stroke={RED} strokeWidth={5} strokeLinecap="round" /> : null}
                {cross > 0 ? <line x1={50} y1={4} x2={50 - 46 * cross} y2={4 + 36 * cross} stroke={RED} strokeWidth={5} strokeLinecap="round" /> : null}
              </svg>
              <span data-ui="" className="mt-[4px] font-mono text-[13px]" style={{ color: "#9FB4DA" }}>{name}</span>
            </div>
          ))
        : null}
      <Term
        x={36}
        y={92}
        w={468}
        h={280}
        at={terminal}
        size={13}
        lines={[
          { at: grep, cmd: "grep -rn ERROR /var/log/checkout/" },
          { at: grep, out: "app.log:812: ERROR db pool empty", color: RED },
          { at: find, cmd: "find / -name config.yaml" },
          { at: find, out: "/etc/checkout/config.yaml" },
          { at: cat, cmd: "cat /etc/checkout/config.yaml" },
          { at: cat, out: "db_pool_size: 0", color: "#FFB020" },
          { at: git, cmd: "git log --oneline -2" },
          { at: git, out: "a1f9c2e lee el pool desde env" },
        ]}
      />
      {t >= terminal - 0.2 ? (
        <div data-ui="" className="absolute flex items-center justify-between rounded-[4px] px-[10px] font-mono text-[12px] font-bold" style={{ left: 210, top: 556, width: 294, height: 24, color: RED, border: `1.5px solid ${RED}`, background: BG }}>
          <span>checkout-api</span>
          <span>status=1 · reinicios 3</span>
        </div>
      ) : null}
      {t >= terminal - 0.2 ? (
        <>
          <Tool y={590} cmd="grep" what="busca en logs" at={grep} />
          <Tool y={642} cmd="find" what="ubica archivos" at={find} />
          <Tool y={694} cmd="cat" what="los lee" at={cat} />
          <Tool y={746} cmd="git" what="últimos cambios" at={git} />
        </>
      ) : null}
    </Layer>
  );
}
