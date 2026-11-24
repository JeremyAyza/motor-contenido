import { EASE, keys, Stamp, unit, useClock, useCue } from "@motor/video";
import { LogoTile, Layer, Term, usePresence } from "../parts.tsx";
import { G, INK, RED } from "../world.tsx";

/** A big mouse pointer, drawn in code. Its tip at x, y. */
function Pointer({ x, y, scale, opacity, crossed }: { x: number; y: number; scale: number; opacity: number; crossed: number }) {
  if (opacity <= 0) return null;
  return (
    <div className="absolute" style={{ left: x, top: y, opacity, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
      <svg width={110} height={160} viewBox="0 0 22 32" aria-hidden style={{ filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.5))" }}>
        <path d="M1 1 L1 25 L7 19.5 L11 29 L15 27.3 L11 18 L19 18 Z" fill="#FFFFFF" stroke="#1A0710" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
      {crossed > 0 ? (
        <svg className="absolute left-[-30px] top-[-10px]" width={170} height={180} aria-hidden>
          <line x1={10} y1={10} x2={10 + 150 * crossed} y2={10 + 160 * crossed} stroke={RED} strokeWidth={14} strokeLinecap="round" />
        </svg>
      ) : null}
    </div>
  );
}

/**
 * The hook, on Rick's magenta backdrop: the title is there from frame 1 over a
 * big mouse pointer that drifts and gets crossed out on "mouse". Then the three
 * agents land as tiles, three small terminals type, and on "sistema" a
 * terminal asks uname -s and answers Linux, with Tux.
 */
export function Gancho() {
  const t = useClock();
  const mouse = useCue("mouse");
  const claude = useCue("Claude");
  const codex = useCue("Codex");
  const gemini = useCue("Gemini");
  const comandos = useCue("comandos");
  const sistema = useCue("sistema");
  const linux = useCue("Linux");
  const casualidad = useCue("casualidad");
  const pointerOut = EASE.in(unit(t, claude - 0.1, 0.3));
  const px = keys(t, [[0, 250], [mouse, 214], [claude, 214]]);
  const py = keys(t, [[0, 330], [mouse, 300], [claude, 300]]);
  const crossed = EASE.out(unit(t, mouse + 0.1, 0.25));
  const term = usePresence(comandos);
  const minis: Array<[number, string]> = [[110, "npm test"], [270, "git diff"], [430, "grep TODO"]];
  const titleOut = EASE.out(unit(t, sistema - 0.2, 0.3));
  return (
    <Layer>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #4A0A2C 0%, #8E2352 48%, #D56A8E 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0) 60%)" }} />
      <div className="absolute left-[36px] right-[36px] text-center font-mono font-bold uppercase leading-[1.08]" style={{ top: 128, fontSize: 40, color: INK, opacity: 1 - titleOut, textShadow: "0 0 18px rgba(255,255,255,0.35)" }}>
        Tu agente no usa <span style={{ color: "var(--piece-accent)" }}>el mouse</span>
      </div>
      <Pointer x={px} y={py} scale={1 + 0.04 * Math.sin(t * 3)} opacity={1 - pointerOut} crossed={crossed} />
      <LogoTile slug="claudecode" x={110} y={270} at={claude} size={76} name="Claude Code" />
      <LogoTile slug="openai" x={270} y={270} at={codex} size={76} name="Codex" chip />
      <LogoTile slug="googlegemini" x={430} y={270} at={gemini} size={76} name="Gemini CLI" />
      {term.on
        ? minis.map(([x, cmd], i) => (
            <Term key={cmd} x={x - 72} y={350} w={144} h={92} at={comandos + i * 0.15} until={sistema} note={null} title="bash" prompt="$" size={13} lines={[{ at: comandos + 0.2 + i * 0.2, cmd }]} />
          ))
        : null}
      <Term
        x={60}
        y={560}
        w={300}
        h={120}
        at={sistema - 0.1}
        size={16}
        note={null}
        title="agent@linux: ~"
        prompt="$"
        lines={[
          { at: sistema + 0.1, cmd: "uname -s" },
          { at: linux, out: "Linux", color: G },
        ]}
      />
      <LogoTile slug="tux" x={436} y={616} at={linux} size={92} name="Linux" />
      <Stamp at={casualidad} x={270} y={480} size={30} rotate={-4} color={INK} fill="#8E2352">No es casualidad</Stamp>
    </Layer>
  );
}
