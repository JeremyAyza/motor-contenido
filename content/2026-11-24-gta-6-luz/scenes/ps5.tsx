import { useCue } from "@motor/video";
import { AMBER, MINT, PINK, type BackProps } from "../palette.ts";
import { Backdrop, Card, Chip, Layer } from "../parts.tsx";

/** A standard PS5, huge on a dark floor, to the right of the avatar; with "cuadro", the pink hotel. */
export function Ps5Back({ t, cue }: BackProps) {
  const cuadro = cue("cuadro");
  return (
    <>
      <Backdrop src="img/ps5.png" t={t} at={-1} until={cuadro - 0.1} dur={6} z0={1.14} z1={1.28} x0={40} x1={20} y0={30} y1={0} />
      {/* A strip of light runs down the console's white panel every 2 s, so the shot never sits still. */}
      {t < cuadro ? (
        <div className="absolute left-0 top-0 overflow-hidden" style={{ width: 540, height: 960, mixBlendMode: "screen" }}>
          <div className="absolute" style={{ left: 120, top: -300 + ((t * 600) % 1400), width: 420, height: 90, background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))", transform: "rotate(-18deg)", filter: "blur(6px)" }} />
        </div>
      ) : null}
      <Backdrop src="img/hotel-rosa.png" t={t} at={cuadro - 0.1} dur={10} z0={1.04} z1={1.14} y0={0} y1={-20} />
    </>
  );
}

/**
 * With "PlayStation" a chip, with "tráiler" the card of the second trailer;
 * with "cuadro" the three jobs of every frame tick in, one per verb.
 */
export function Ps5() {
  const playstation = useCue("PlayStation");
  const trailer = useCue("tráiler");
  const cuadro = useCue("cuadro");
  const traza = useCue("traza");
  const anima = useCue("anima");
  const carga = useCue("carga");
  const dot = (c: string) => <i className="mr-[10px] inline-block h-[14px] w-[14px] rounded-full align-middle" style={{ background: c }} />;
  return (
    <Layer>
      <Chip at={playstation - 0.1} until={trailer - 0.1} x={36} y={120} tone="light">
        PS5 estándar
      </Chip>
      <Card at={trailer} until={cuadro - 0.1} x={36} y={120} w={400} title="Tráiler 2: grabado en el juego" note="En una PS5 · Rockstar, mayo de 2025" />
      <Chip at={traza} x={36} y={120} tone="dark">
        {dot(AMBER)}Traza luz
      </Chip>
      <Chip at={anima} x={36} y={172} tone="dark">
        {dot(PINK)}Anima multitudes
      </Chip>
      <Chip at={carga} x={36} y={224} tone="dark">
        {dot(MINT)}Carga el mundo
      </Chip>
    </Layer>
  );
}
