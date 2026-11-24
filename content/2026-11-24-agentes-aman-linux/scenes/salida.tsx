import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Invader, Layer, Term } from "../parts.tsx";
import { G, RED } from "../world.tsx";

/**
 * Exit codes: a terminal runs the app and fails with a missing module; on the
 * floor, Rick's "EXIT ?" spins like a roulette and lands on a red 1. The agent
 * installs the module, runs it again, and the code turns into a green 0. On
 * "actúa", the loop ACTÚA, OBSERVA, CORRIGE, REPITE lights around the invader.
 */
export function Salida() {
  const t = useClock();
  const falla = useCue("falla");
  const salida = useCue("salida");
  const lee = useCue("lee");
  const corrige = useCue("corrige");
  const nuevo = useCue("nuevo");
  const actua = useCue("actúa");
  const loop = [actua, useCue("observa"), useCue("corrige", 2), useCue("repite")];
  const exitOut = EASE.out(unit(t, actua - 0.3, 0.3));
  const spinning = t >= salida - 0.4 && t < salida;
  const code = t < salida - 0.4 ? "?" : spinning ? String(Math.floor(t * 20) % 10) : t < nuevo + 0.6 ? "1" : "0";
  const color = code === "0" ? G : code === "?" ? G : RED;
  const hit = popAt(t, code === "0" ? nuevo + 0.6 : salida);
  const words: Array<[string, number, number]> = [["ACTÚA", 357, 590], ["OBSERVA", 460, 680], ["CORRIGE", 357, 770], ["REPITE", 254, 680]];
  return (
    <Layer>
      <Term
        x={36}
        y={92}
        w={468}
        h={260}
        at={0}
        title="agent@linux: ~/app"
        size={14}
        lines={[
          { at: 0.3, cmd: "python3 app.py", prompt: "~/app$" },
          { at: falla, out: "ModuleNotFoundError: No module named 'flask'", color: RED },
          { at: salida, cmd: "echo $?", prompt: "~/app$" },
          { at: salida, out: "1", color: RED },
          { at: corrige, cmd: "pip install flask", prompt: "~/app$" },
          { at: corrige, out: "Successfully installed flask" },
          { at: nuevo, cmd: "python3 app.py && echo $?", prompt: "~/app$" },
          { at: nuevo, out: "0", color: G },
        ]}
      />
      {exitOut < 1 && t >= falla - 0.2 ? (
        <div
          data-ui=""
          className="absolute flex items-center justify-center gap-[18px] rounded-[10px] font-mono font-bold"
          style={{ left: 210, top: 600, width: 294, height: 110, color, border: `3px solid ${color}`, boxShadow: `0 0 22px ${color}88, inset 0 0 18px ${color}33`, opacity: 1 - exitOut, transform: `scale(${code === "?" ? 1 : 0.85 + 0.15 * Math.min(1, hit)})` }}
        >
          <span className="text-[52px]">EXIT</span>
          <span className="text-[64px]">{code}</span>
        </div>
      ) : null}
      {t >= lee && t < actua ? (
        <div data-ui="" className="absolute font-mono text-[13px] font-bold tracking-[0.1em]" style={{ left: 210, top: 724, color }}>
          {code === "0" ? "TODO BIEN" : "ALGO FALLÓ"}
        </div>
      ) : null}
      {t >= actua - 0.2 ? (
        <>
          <svg className="absolute left-0 top-0" width={540} height={960} aria-hidden>
            <circle cx={357} cy={680} r={78} fill="none" stroke={G} strokeOpacity={0.35} strokeWidth={1.5} strokeDasharray="5 6" style={{ transformOrigin: "357px 680px", transform: `rotate(${(t - actua) * 60}deg)` }} />
          </svg>
          <Invader x={357} y={680} px={5} at={actua - 0.2} />
          {words.map(([w, x, y], i) => {
            const lit = t >= loop[i] && (i === 3 || t < loop[i + 1] + 0.6);
            const p = popAt(t, loop[i]);
            if (p <= 0) return null;
            return (
              <div key={w} data-ui="" className="absolute rounded-[4px] px-[8px] py-[3px] font-mono text-[14px] font-bold tracking-[0.08em]" style={{ left: x, top: y, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * Math.min(1, p)})`, color: lit ? "#030806" : G, background: lit ? G : "rgba(3,8,6,0.9)", border: `1.5px solid ${G}`, boxShadow: lit ? `0 0 14px ${G}` : "none" }}>
                {w}
              </div>
            );
          })}
        </>
      ) : null}
    </Layer>
  );
}
