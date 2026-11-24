import { EASE, unit, useClock, useCue } from "@motor/video";
import { Card, Cover, CoverGrid, Layer, Mono, Title, XMark, useOn } from "../parts.tsx";
import { G, INK, LINE, MUTED } from "../world.tsx";

/**
 * Search: the search card types "goteo" and shows Goteo by Duki with a
 * generated cover; then the grid of covers is scanned row by row and crossed
 * out; then the index card fills its four rows.
 */
export function Busqueda() {
  const t = useClock();
  const escribes = useCue("escribes");
  const duki = useCue("Duki");
  const revisar = useCue("revisar");
  const normal = useCue("normal");
  const indice = useCue("índice");
  const rows = [
    { at: useCue("nombres"), text: "NOMBRES DE CANCIONES" },
    { at: useCue("artistas"), text: "ARTISTAS" },
    { at: useCue("álbumes"), text: "ÁLBUMES" },
    { at: useCue("palabras"), text: "PALABRAS CLAVE" },
  ];
  const instante = useCue("instante");
  const typed = "goteo".slice(0, Math.max(0, Math.floor((t - escribes) / 0.08)));
  const scan = unit(t, revisar, 1.6);
  const grid = useOn(revisar - 0.3, 0.3) * (1 - useOn(indice - 0.25, 0.2));
  return (
    <Layer>
      <Card x={100} y={140} w={340} h={340} at={0.05} until={revisar - 0.3} title="BUSCAR">
        <div data-ui="" className="mx-[12px] mt-[8px] flex h-[34px] items-center rounded-[17px] px-[12px] font-mono text-[16px]" style={{ border: `1.5px solid ${t >= escribes ? G : LINE}`, color: INK }}>
          <span style={{ color: MUTED }}>⌕&nbsp;</span>
          {typed}
          {Math.floor(t * 2.5) % 2 === 0 ? <span style={{ color: G }}>|</span> : null}
        </div>
        <div className="absolute left-[16px] top-[92px]">
          <Cover n={1} x={0} y={0} size={170} at={duki - 0.2} />
        </div>
        {t >= duki - 0.1 ? (
          <div data-ui="" className="absolute left-[200px] top-[110px]" style={{ opacity: EASE.out(unit(t, duki - 0.1, 0.25)) }}>
            <div className="text-[24px] font-bold" style={{ color: INK }}>Goteo</div>
            <div className="mt-[2px] text-[16px]" style={{ color: MUTED }}>Duki</div>
          </div>
        ) : null}
      </Card>
      <Mono x={270} y={492} at={duki} until={revisar - 0.3}>Portada ilustrativa</Mono>
      <Title text="Goteo, de Duki" at={escribes} until={revisar - 0.3} />

      {grid > 0 ? (
        <div className="absolute left-0 top-0" style={{ width: 540, height: 960, opacity: grid }}>
          <CoverGrid x={45} y={150} cols={6} rows={4} size={70} at={revisar - 0.3} dim={0.45} stagger={0.01} offset={3} />
          <div className="absolute" style={{ left: 40, top: 150 + scan * 300, width: 460, height: 3, background: G, boxShadow: `0 0 14px ${G}` }} />
          <Mono x={270} y={466} at={revisar}>Revisando cada fila</Mono>
          <XMark x={270} y={295} size={190} at={normal} color={INK} />
        </div>
      ) : null}
      <Title text="Revisar todo, cada vez" at={revisar} until={indice - 0.25} />

      <Card x={80} y={150} w={380} h={300} at={indice - 0.1} title="LO QUE GUARDA EL ÍNDICE" glow={t >= instante}>
        {rows.map((r, i) =>
          t >= r.at - 0.15 ? (
            <div key={r.text} data-ui="" className="absolute left-[14px] flex h-[46px] items-center rounded-[5px] px-[14px] font-mono text-[16px] font-bold tracking-[0.1em]" style={{ top: 44 + i * 60, width: 350, color: t >= instante ? G : INK, border: `1.5px solid ${t >= instante ? G : LINE}`, background: "rgba(255,255,255,0.03)", opacity: EASE.out(unit(t, r.at - 0.15, 0.25)) }}>
              {r.text}
            </div>
          ) : null,
        )}
      </Card>
      <Title text="Un índice de búsqueda" at={indice} />
    </Layer>
  );
}
