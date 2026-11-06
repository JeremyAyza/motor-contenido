import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Coin, Illustrative, Layer, Stamp, Title } from "../parts.tsx";
import { ACCENT, INK, TOKEN } from "../world.tsx";

/** The "someday" list: an agent takes each forgotten task, its bar fills, and it turns into shipped work. */
export function Otrolado() {
  const t = useClock();
  const agente = useCue("agente");
  const tasks = [
    { label: "Documentar la API", at: useCue("documentar") },
    { label: "El bug viejo", at: useCue("viejo") },
    { label: "Refactorizar", at: useCue("refactorizar") },
    { label: "Escribir pruebas", at: useCue("pruebas") },
  ];
  const valer = useCue("valer");
  return (
    <Layer>
      <Title at={0.05} until={valer - 0.15} y={186} size={46}>
        Pero hay <span style={{ color: ACCENT }}>otro lado</span>
      </Title>
      <Card at={agente - 0.2} y={262} h={410} label="Pendientes · algún día">
        <div className="flex flex-col" style={{ gap: 14, marginTop: 4 }}>
          {tasks.map((task) => {
            const k = EASE.inOut(unit(t, task.at, 1.1));
            const done = k >= 1;
            const active = t >= task.at;
            return (
              <div key={task.label} className="relative overflow-hidden rounded-xl" style={{ height: 66, background: "rgba(255,255,255,0.05)", border: `2px solid ${done ? ACCENT : "rgba(255,255,255,0.1)"}` }}>
                <div className="absolute" style={{ left: 0, top: 0, bottom: 0, width: `${k * 100}%`, background: done ? "rgba(62,230,196,0.22)" : "rgba(255,79,154,0.2)" }} />
                <div className="absolute flex items-center" style={{ left: 14, top: 0, bottom: 0, gap: 14 }}>
                  <div className="flex items-center justify-center rounded-md" style={{ width: 30, height: 30, border: `3px solid ${done ? ACCENT : INK}`, background: done ? ACCENT : "transparent" }}>
                    {done ? (
                      <svg width={18} height={18} viewBox="0 0 18 18" aria-hidden>
                        <path d="M 3 9 L 7.5 13.5 L 15 4" fill="none" stroke="#120E1F" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </div>
                  <span className="font-sans font-bold" style={{ fontSize: 22, color: INK, opacity: active ? 1 : 0.45 }}>
                    {task.label}
                  </span>
                </div>
                {active && !done ? (
                  <div className="absolute" style={{ right: 14, top: 16, transform: `rotate(${t * 400}deg)` }}>
                    <Coin size={32} />
                  </div>
                ) : null}
                {done ? (
                  <span className="absolute font-mono font-bold uppercase" style={{ right: 14, top: 22, fontSize: 14, letterSpacing: "0.1em", color: ACCENT, transform: `scale(${Math.min(1, popAt(t, task.at + 1.1))})` }}>
                    Entregado
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </Card>
      <Stamp at={valer} x={270} y={712} rotate={-5} tone="accent" size={36}>
        Puede valer mucho
      </Stamp>
      <Illustrative at={agente} y={756} />
    </Layer>
  );
}
