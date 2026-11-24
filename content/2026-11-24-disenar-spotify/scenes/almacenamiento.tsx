import { Icono } from "@motor/ui";
import { EASE, unit, useClock, useCue } from "@motor/video";
import { Bitrates, Chip, Cover, CoverGrid, Cylinder, Layer, Mono, Title, useOn } from "../parts.tsx";
import { G, G2, INK, MUTED } from "../world.tsx";

const DEVICES = ["smartphone", "laptop", "speaker", "gamepad-2", "car"];

/**
 * Storage: the grid of covers; one grows with "CALIDADES" and "FORMATOS"; a
 * song is uploaded as a master bar that splits into the bitrate bars (24 for
 * the phone, 320 for Premium); the devices with their codecs; and everything
 * drops into three object-storage cylinders.
 */
export function Almacenamiento() {
  const t = useClock();
  const millones = useCue("millones");
  const calidades = useCue("calidades");
  const sube = useCue("sube");
  const codifica = useCue("codifica");
  const bajo = useCue("bajo");
  const alto = useCue("alto");
  const codecs = useCue("códecs");
  const todos = useCue("Todos");
  const distribuido = useCue("distribuido");
  const focus = EASE.out(unit(t, calidades - 0.6, 0.4));
  const master = useOn(sube + 0.3, 0.6);
  return (
    <Layer>
      <CoverGrid x={45} y={150} cols={6} rows={4} size={70} at={0.1} until={sube - 0.2} dim={0.7 * focus} stagger={0.025} />
      <Cover n={2} x={200} y={170} size={140} at={calidades - 0.6} until={sube - 0.2} ring />
      <Chip x={190} y={480} at={calidades - 0.3} until={sube - 0.2}>Calidades</Chip>
      <Chip x={350} y={480} at={calidades} until={sube - 0.2}>Formatos</Chip>
      <Title text="Millones de canciones" at={millones} until={sube - 0.2} />

      <Cover n={2} x={50} y={170} size={92} at={sube} until={codifica - 0.1} ring />
      {t >= sube && t < codifica ? (
        <div className="absolute" style={{ left: 160, top: 196, width: 300 * master, height: 40, background: G, borderRadius: 3, boxShadow: `0 0 18px ${G}66` }} />
      ) : null}
      <Mono x={160} y={250} at={sube + 0.4} until={codifica - 0.1} align="left">Master subido</Mono>
      <Title text="Se sube una canción" at={sube} until={codifica - 0.1} />

      <Bitrates x={60} y={160} at={codifica} until={codecs - 0.15} hot={[{ index: 3, at: bajo }, { index: 0, at: alto }]} />
      <Chip x={270} y={287} at={bajo} until={codecs - 0.15} color={G} border={G}>Celular</Chip>
      <Chip x={438} y={192} at={alto} until={codecs - 0.15} color={G} border={G}>Premium</Chip>
      <Title text="Varias versiones" at={codifica} until={codecs - 0.15} />

      {DEVICES.map((name, i) => {
        const o = useOn(codecs + i * 0.12, 0.25) * (1 - useOn(todos - 0.1, 0.2));
        return o > 0 ? (
          <div key={name} className="absolute flex items-center justify-center rounded-[8px]" style={{ left: 56 + i * 88, top: 170, width: 72, height: 72, border: `1.5px solid ${G2}`, background: "rgba(10,18,14,0.9)", color: INK, opacity: o, transform: `translateY(${(1 - o) * 12}px)` }}>
            <Icono name={name} size={36} ancla={false} />
          </div>
        ) : null;
      })}
      <Chip x={170} y={300} at={codecs + 0.4} until={todos - 0.1}>Ogg Vorbis</Chip>
      <Chip x={360} y={300} at={codecs + 0.6} until={todos - 0.1}>HE-AAC v2</Chip>
      <Title text="Un códec por aparato" at={codecs} until={todos - 0.1} />

      {[150, 270, 390].map((x, i) => (
        <Cylinder key={x} x={x} y={190} w={96} h={110} at={todos + i * 0.15} />
      ))}
      <Mono x={270} y={360} at={todos + 0.4} color={MUTED}>Almacenamiento de objetos</Mono>
      <Title text="Almacén distribuido" at={distribuido} />
    </Layer>
  );
}
