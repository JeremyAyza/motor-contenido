import { EASE, lerp, popAt, Stamp, unit, useClock, useCue } from "@motor/video";
import { Chip, CodeLine, Layer, Sheet, Small } from "../parts.tsx";
import { INK, LINE, MUTED, RED } from "../world.tsx";

/** One post of the gate, striped red and white. */
function Post({ x }: { x: number }) {
  return <div className="absolute" style={{ left: x - 7, top: 170, width: 14, height: 300, background: `repeating-linear-gradient(180deg, ${RED} 0 22px, #EDE8DC 22px 44px)`, borderRadius: 3 }} />;
}

/**
 * The price: the whole screen goes dark and the compiler's gate drops in
 * the middle. The program's sheet runs into it and gets "RECHAZADO"; notes
 * of attempts pile up on the right while the errors type in red below.
 */
export function Precio() {
  const t = useClock();
  const costo = useCue("costo:");
  const esas = useCue("esas");
  const reglas = useCue("reglas");
  const rust = useCue("Rust");
  const aprender = useCue("aprender.");
  const arm = EASE.out(unit(t, 0.05, 0.45));
  const angle = lerp(-88, 0, arm);
  const push = EASE.inOut(unit(t, 0.2, costo + 0.2));
  const bounce = t > costo + 0.2 ? Math.max(0, 1 - (t - costo - 0.2) * 3) * 14 : 0;
  const sheetX = lerp(-20, 96, push) - bounce;
  return (
    <Layer>
      <div className="absolute left-[36px] right-[36px] text-center" style={{ top: 112 }}>
        <div className="font-display text-[30px] font-black leading-none" style={{ color: INK }}>rustc: la aduana</div>
        <div data-ui="" className="mt-[6px] font-mono text-[13px] font-bold" style={{ color: MUTED }}>el programa no arrancó</div>
      </div>
      <Post x={150} />
      <Post x={430} />
      <div className="absolute" style={{ left: 150, top: 300, width: 280, height: 18, transformOrigin: "0 50%", transform: `rotate(${angle}deg)`, background: `repeating-linear-gradient(90deg, ${RED} 0 28px, #EDE8DC 28px 56px)`, borderRadius: 4, boxShadow: "0 4px 0 rgba(0,0,0,0.5)" }} />
      <Sheet x={sheetX} y={380} s={2} rot={-4} />
      <Small x={sheetX} y={428} at={costo + 0.3} center w={90} color={INK}>orders.rs</Small>
      <Stamp at={esas} x={300} y={372} color={RED} fill="#1C1E21" rotate={-5} size={44}>
        Rechazado
      </Stamp>
      {[
        { at: reglas, text: "intento 2", y: 186 },
        { at: rust, text: "intento 3", y: 226 },
        { at: aprender - 0.2, text: "E0106", y: 266 },
      ].map((n, i) => {
        const p = popAt(t, n.at);
        if (p <= 0) return null;
        return (
          <div key={i} data-ui="" className="absolute rounded-[3px] px-[8px] py-[6px] font-mono text-[13px] font-bold" style={{ left: 452, top: n.y, transform: `translate(-50%, 0) rotate(${i % 2 ? 6 : -5}deg) scale(${Math.min(1, p)})`, background: "#EDE8DC", color: "#2A2D31", boxShadow: "0 3px 0 rgba(0,0,0,0.5)" }}>
            {n.text}
          </div>
        );
      })}
      <div data-ui="" className="absolute overflow-hidden rounded-[8px]" style={{ left: 36, top: 560, width: 468, height: 200, background: "#121315", border: `1px solid ${LINE}` }}>
        <div className="flex justify-between px-[10px] py-[6px]" style={{ borderBottom: `1px solid ${LINE}` }}>
          <span className="font-mono text-[12px] font-bold" style={{ color: MUTED }}>$ rustc orders.rs</span>
          <span className="font-mono text-[12px] font-bold" style={{ color: MUTED }}>Ejemplo ilustrativo</span>
        </div>
        <div className="px-[10px] py-[8px]">
          <CodeLine at={0.3} color={RED} size={14}>error[E0382]: borrow of moved value: `order`</CodeLine>
          <CodeLine at={0.9} color={MUTED} size={13}>{"  --> src/orders.rs:8:20"}</CodeLine>
          <CodeLine at={1.4} color={INK} size={13}>{"7 |     ship(order);"}</CodeLine>
          <CodeLine at={1.6} color={MUTED} size={13}>{"  |          ----- value moved here"}</CodeLine>
          <CodeLine at={reglas} color={RED} size={14}>{"error[E0502]: cannot borrow `orders` as mutable"}</CodeLine>
          <CodeLine at={aprender - 0.2} color={RED} size={14}>{"error[E0106]: missing lifetime specifier"}</CodeLine>
        </div>
      </div>
      <Chip x={270} y={510} at={aprender} color={INK}>curva de aprendizaje</Chip>
    </Layer>
  );
}
