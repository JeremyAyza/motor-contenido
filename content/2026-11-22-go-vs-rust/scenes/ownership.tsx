import { EASE, lerp, popAt, unit, useClock, useCue } from "@motor/video";
import { BigWord, Chip, CodeLine, Crate, Example, Layer, PanelBody, Small, Worker } from "../parts.tsx";
import { INK, LINE, MUTED, RUST } from "../world.tsx";

const OWNER = { x: 150, y: 380 };
const BORROW: Array<[number, number]> = [
  [380, 250],
  [420, 340],
  [380, 430],
];

/**
 * Ownership: an owner holds the crate "order #42". When the owner is done,
 * the crate breaks apart on the spot and the panel's memory stays flat. A
 * new crate is lent along three dotted lines to three borrowers, under the
 * rule "many readers, or one writer", and the compiler's shield drops on
 * the lines.
 */
export function Ownership() {
  const t = useClock();
  const dueno = useCue("dueño.");
  const termina = useCue("termina,");
  const instante = useCue("instante.");
  const prestada = useCue("prestada");
  const reglas = useCue("reglas");
  const compilador = useCue("compilador");
  const errores = useCue("errores");
  const owner = popAt(t, 0.1);
  const crate1 = popAt(t, 0.3);
  const gone = EASE.in(unit(t, termina + 0.2, 0.5));
  const crate2 = popAt(t, prestada - 0.5);
  const shield = popAt(t, compilador);
  return (
    <Layer>
      <BigWord text="Ownership" x={270} y={110} align="center" size={48} color={RUST} at={-1} />
      <Worker x={OWNER.x} y={OWNER.y} s={1.7} color={RUST} opacity={Math.min(1, owner * 2)} label={owner > 0.3 ? "dueño" : undefined} />
      {t < prestada - 0.5 ? (
        <>
          <Crate x={OWNER.x + 24} y={OWNER.y - 50} size={44 * (1 - gone * 0.5)} opacity={Math.min(1, crate1 * 2) * (1 - gone)} label={gone < 0.2 ? "pedido #42" : undefined} />
          {gone > 0 && gone < 1
            ? [0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="absolute h-[8px] w-[8px]" style={{ left: OWNER.x + 46 + Math.cos(i) * 60 * gone, top: OWNER.y - 48 + Math.sin(i * 1.7) * 50 * gone, background: "#B07A43", opacity: 1 - gone }} />
              ))
            : null}
        </>
      ) : (
        <Crate x={OWNER.x + 24} y={OWNER.y - 50} size={44} opacity={Math.min(1, crate2 * 2)} label="pedido #42" />
      )}
      <div className="absolute" style={{ left: 300, top: 200, opacity: EASE.out(unit(t, instante, 0.3)) * (1 - EASE.in(unit(t, prestada - 0.6, 0.3))) }}>
        <div className="font-display text-[54px] font-black leading-[1]" style={{ color: INK }}>8,4 MB</div>
        <div data-ui="" className="mt-[4px] font-mono text-[13px] font-bold" style={{ color: RUST }}>Rust: memoria plana</div>
        <div data-ui="" className="font-mono text-[12px]" style={{ color: MUTED }}>Medición de ejemplo</div>
      </div>
      <Chip x={OWNER.x + 46} y={OWNER.y - 120} at={instante - 0.3} until={prestada - 0.6} color={RUST}>liberada al instante</Chip>
      {BORROW.map(([bx, by], i) => {
        const p = EASE.out(unit(t, prestada + i * 0.2, 0.4));
        if (p <= 0) return null;
        const ax = OWNER.x + 70;
        const ay = OWNER.y - 48;
        return (
          <div key={i}>
            <svg className="absolute left-0 top-0" width={540} height={960} aria-hidden>
              <line x1={ax} y1={ay} x2={lerp(ax, bx - 14, p)} y2={lerp(ay, by - 20, p)} stroke={RUST} strokeWidth={2} strokeDasharray="5 5" />
            </svg>
            <Worker x={bx} y={by} s={1.1} color="#C9C3B6" opacity={p} label={p > 0.6 ? "&order" : undefined} />
          </div>
        );
      })}
      {shield > 0 ? (
        <div data-ui="" className="absolute flex items-center justify-center rounded-[10px] font-mono text-[14px] font-bold" style={{ left: 270, top: 300, width: 76, height: 84, transform: `translate(-50%, -50%) scale(${Math.min(1.1, shield)})`, background: "#1C1E21", border: `3px solid ${RUST}`, color: RUST, clipPath: "polygon(50% 0, 100% 16%, 100% 60%, 50% 100%, 0 60%, 0 16%)" }}>
          rustc
        </div>
      ) : null}
      <Chip x={270} y={470} at={errores} color={INK}>errores atrapados antes de correr</Chip>
      <PanelBody at={0}>
        <CodeLine at={0.1}>{"struct Order { id: u32 }"}</CodeLine>
        <CodeLine at={0.4} hot={t < termina ? "rgba(226,87,43,0.18)" : undefined}>{"let order = Order { id: 42 };"}</CodeLine>
        <CodeLine at={0.7}>{"ship(&order);"}</CodeLine>
        <CodeLine at={dueno} color={RUST} hot={t >= termina && t < prestada ? "rgba(226,87,43,0.18)" : undefined}>{"} // el dueño termina: se libera"}</CodeLine>
        {t < reglas ? (
          <div className="mt-[10px]" style={{ opacity: EASE.out(unit(t, instante, 0.3)) }}>
            <svg width={270} height={40} aria-hidden>
              <line x1={0} y1={34} x2={270} y2={34} stroke={LINE} />
              <polyline points="0,20 270,20" fill="none" stroke={RUST} strokeWidth={2} />
            </svg>
            <div className="font-mono text-[13px] font-bold" style={{ color: RUST }}>Rust: 8,4 MB, plano</div>
          </div>
        ) : (
          <div className="mt-[10px] font-display text-[22px] font-black leading-[1.1]" style={{ color: INK }}>
            muchos lectores,
            <br />o un escritor.
            <div className="font-mono text-[13px] font-bold" style={{ color: RUST }}>nunca los dos a la vez</div>
          </div>
        )}
      </PanelBody>
      <Example x={216} y={772} at={instante} until={reglas} />
      <Small x={216} y={772} at={reglas} color="#A9AEB6">Ejemplo ilustrativo</Small>
    </Layer>
  );
}
