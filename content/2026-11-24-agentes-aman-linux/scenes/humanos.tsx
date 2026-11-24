import { EASE, keys, unit, useClock, useCue } from "@motor/video";
import { Chip, Layer, Term, useOn } from "../parts.tsx";
import { G, INK } from "../world.tsx";

/** A folder icon of the GUI window. */
function Folder({ x, y, name, lit }: { x: number; y: number; name: string; lit: number }) {
  return (
    <div className="absolute flex flex-col items-center" style={{ left: x, top: y, transform: `translate(-50%, 0) scale(${1 + 0.1 * lit})` }}>
      <svg width={54} height={42} viewBox="0 0 54 42" aria-hidden>
        <path d="M2 8 Q2 4 6 4 L20 4 L25 9 L48 9 Q52 9 52 13 L52 37 Q52 40 48 40 L6 40 Q2 40 2 36 Z" fill={lit > 0.5 ? "#8FB4FF" : "#5E7FB8"} stroke="#C9D8F5" strokeWidth={1.5} />
      </svg>
      <span data-ui="" className="mt-[4px] font-sans text-[13px] font-semibold" style={{ color: "#DCE6F7" }}>{name}</span>
    </div>
  );
}

/**
 * Humans against agents: a GUI window (Rick's "HUMANS · GUI") where a cursor
 * travels, opens a folder and clicks Guardar; on "otra forma" the window dims,
 * and on "texto" the agents' terminal lights up on the floor and types.
 */
export function Humanos() {
  const t = useClock();
  const mouse = useCue("mouse");
  const clic = useCue("clic");
  const ventanas = useCue("ventanas");
  const otra = useCue("otra");
  const texto = useCue("Con");
  const dim = 1 - 0.7 * EASE.out(unit(t, otra, 0.4));
  const cx = keys(t, [[0, 400], [mouse, 120], [clic, 300], [ventanas, 380], [otra, 380]]);
  const cy = keys(t, [[0, 330], [mouse, 180], [clic, 318], [ventanas, 230], [otra, 230]]);
  const press = Math.max(0, 1 - Math.abs(t - (clic + 0.35)) / 0.15);
  const second = useOn(ventanas, 0.3);
  return (
    <Layer>
      <div className="absolute overflow-hidden rounded-[12px]" style={{ left: 36, top: 92, width: 468, height: 300, opacity: dim, background: "linear-gradient(180deg, #1B2638 0%, #121A28 100%)", border: "1.5px solid #8DA2C4", boxShadow: "0 18px 40px rgba(0,0,0,0.6)" }}>
        <div data-ui="" className="flex items-center justify-between px-[14px] py-[7px] font-mono text-[13px] font-bold tracking-[0.1em]" style={{ color: "#C9D8F5", borderBottom: "1px solid #8DA2C455" }}>
          <span>HUMANOS · GUI</span>
          <span>9:41</span>
        </div>
        <Folder x={70} y={60} name="Fotos" lit={useOn(mouse + 0.3, 0.2)} />
        <Folder x={70} y={140} name="Trabajo" lit={0} />
        <Folder x={70} y={220} name="Sistema" lit={0} />
        {second > 0 ? (
          <div className="absolute rounded-[8px]" style={{ left: 250, top: 70, width: 190, height: 120, background: "#22304A", border: "1px solid #8DA2C4", opacity: second, transform: `translateY(${(1 - second) * 14}px)` }}>
            <div data-ui="" className="px-[10px] py-[6px] font-sans text-[13px] font-semibold" style={{ color: "#DCE6F7", borderBottom: "1px solid #8DA2C455" }}>Notas</div>
          </div>
        ) : null}
        <div data-ui="" className="absolute rounded-[8px] px-[22px] py-[8px] font-sans text-[16px] font-bold" style={{ left: 220, top: 222, color: "#0E1626", background: press > 0 ? "#A9C4FF" : "#7FA6F2", transform: `scale(${1 - 0.08 * press})` }}>
          Guardar
        </div>
      </div>
      <svg className="absolute" style={{ left: cx, top: cy, opacity: dim }} width={30} height={42} viewBox="0 0 22 32" aria-hidden>
        <path d="M1 1 L1 25 L7 19.5 L11 29 L15 27.3 L11 18 L19 18 Z" fill="#FFFFFF" stroke="#0E1626" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
      <Chip x={357} y={548} at={texto - 0.2} color={G} size={14}>Agentes · Texto</Chip>
      <Term x={210} y={572} w={294} h={150} at={texto - 0.2} size={15} note={null} lines={[{ at: texto + 0.1, cmd: 'echo "texto"' }, { at: texto + 0.1, out: "texto", color: INK }]} />
    </Layer>
  );
}
