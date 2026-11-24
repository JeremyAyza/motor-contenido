import { EASE, unit, useClock, useCue } from "@motor/video";
import { Logo } from "@motor/ui";
import { INK, MUTED, OK, WIN } from "../world.tsx";
import { Big, Card, Ic, Layer, Note, Photo, Rise, Rows, SIDE } from "../parts.tsx";

/**
 * Windows' advantage: "COMPATIBILIDAD" across the top and a "DESDE EL DÍA 1"
 * list right of the presenter that lights with each kind of thing named.
 * Then three products (a printer, a gaming mouse, an accounting app) slide
 * in and, on "Windows", flip to the same green seal: works with Windows.
 */
export function Compatibilidad() {
  const t = useClock();
  const compat = useCue("compatibilidad.");
  const juegos = useCue("Juegos,");
  const programas = useCue("programas");
  const drivers = useCue("drivers,");
  const perifericos = useCue("periféricos,");
  const herramientas = useCue("herramientas");
  const compras = useCue("Compras");
  const impresora = useCue("impresora,");
  const mouse = useCue("mouse");
  const programa = useCue("programa");
  const fabricante = useCue("fabricante");
  const primero = useCue("primero");
  const products = [
    { at: impresora - 0.2, src: "img/impresora.png", label: "Impresora" },
    { at: mouse - 0.2, src: "img/mouse.png", label: "Mouse gamer" },
    { at: programa - 0.2, src: null, label: "Contabilidad" },
  ];
  return (
    <Layer>
      <Big x={270} y={170} w={468} size={44} at={0.3} until={compras} align="center" upper>
        Compatibilidad
      </Big>
      <Note x={270} y={232} at={compat} until={compras} size={15} color={WIN}>la gran ventaja de Windows</Note>
      <Rows
        x={SIDE.x - 6}
        y={290}
        w={272}
        rowH={46}
        gap={8}
        at={juegos - 0.3}
        until={compras}
        title="Desde el día 1"
        titleColor={OK}
        size={17}
        rows={[
          { text: "Juegos", tag: "día 1", at: juegos },
          { text: "Oficina", tag: "día 1", at: programas },
          { text: "Drivers", tag: "día 1", at: drivers },
          { text: "Periféricos", tag: "día 1", at: perifericos },
          { text: "Empresa", tag: "día 1", at: herramientas },
        ]}
      />
      {products.map((p, i) => {
        const flip = EASE.inOut(unit(t, primero + i * 0.12, 0.4));
        const x = 36 + i * 160;
        return (
          <Rise key={p.label} x={x} y={220} w={148} h={300} at={p.at} dy={30}>
            <div className="absolute inset-0" style={{ transform: `rotateY(${flip * 180}deg)`, transformStyle: "preserve-3d" }}>
              <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", opacity: flip < 0.5 ? 1 : 0 }}>
                {p.src ? <Photo src={p.src} label={p.label} /> : <Ledger />}
              </div>
              <div className="absolute inset-0" style={{ transform: "rotateY(180deg)", opacity: flip >= 0.5 ? 1 : 0 }}>
                <Card border={OK} bg="#0F1A15">
                  <div data-ui="" className="flex h-full flex-col items-center justify-center gap-[12px] px-[8px] text-center">
                    <span className="font-sans text-[15px] font-bold" style={{ color: INK }}>{p.label}</span>
                    <Logo slug="windows" size={44} ancla={false} />
                    <span className="rounded-[4px] px-[6px] py-[4px] font-mono text-[12px] font-bold uppercase" style={{ color: OK, border: `1.5px solid ${OK}` }}>Funciona con Windows</span>
                  </div>
                </Card>
              </div>
            </div>
          </Rise>
        );
      })}
      <Big x={270} y={570} w={468} size={44} at={fabricante} align="center">
        Pensado primero para <span style={{ color: WIN }}>Windows</span>
      </Big>
    </Layer>
  );
}

/** An accounting app drawn in code: a ledger with bars and no numbers. */
function Ledger() {
  return (
    <Card border="#2A3441" bg="#F3F5F8">
      <div data-ui="" className="absolute left-[8px] top-[8px] rounded-[3px] px-[6px] py-[3px] font-mono text-[12px] font-bold uppercase tracking-[0.1em]" style={{ background: "rgba(5,8,12,0.78)", color: INK }}>
        Contabilidad
      </div>
      <div className="absolute left-[14px] right-[14px] top-[46px] flex items-center gap-[6px]">
        <Ic name="calculator" size={22} color="#2F6FD0" />
        <div className="h-[8px] flex-1 rounded-full" style={{ background: "#C9D3E0" }} />
      </div>
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} className="absolute left-[14px] right-[14px] flex justify-between" style={{ top: 84 + i * 22 }}>
          <div className="h-[7px] rounded-full" style={{ width: 50 + ((i * 23) % 40), background: "#D5DDE7" }} />
          <div className="h-[7px] w-[34px] rounded-full" style={{ background: i === 6 ? "#2F6FD0" : MUTED, opacity: i === 6 ? 1 : 0.45 }} />
        </div>
      ))}
    </Card>
  );
}
