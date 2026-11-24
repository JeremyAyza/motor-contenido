import { Icono } from "@motor/ui";
import { EASE, unit, useClock, useCue } from "@motor/video";
import { Chip, Cylinder, LaptopShape, Layer, Mono, PhoneShape, PlayButton, Title, useOn } from "../parts.tsx";
import { DIM, G, INK, MUTED } from "../world.tsx";

/**
 * Your state: a laptop and a phone tied by a dashed line; the laptop pauses at
 * 1:42; a pulse runs along the line and the phone wakes up at the same
 * minute; then three distributed databases rise, with the four kinds of state
 * as chips.
 */
export function Estado() {
  const t = useClock();
  const pausas = useCue("Pausas");
  const celular = useCue("celular");
  const sabe = useCue("sabe");
  const bases = useCue("bases");
  const distribuidas = useCue("distribuidas");
  const chips = [
    { at: useCue("reproducción"), text: "Estado", x: 170, y: 400 },
    { at: useCue("playlists"), text: "Playlists", x: 370, y: 400 },
    { at: useCue("gusta"), text: "Me gusta", x: 170, y: 460 },
    { at: useCue("historial"), text: "Historial", x: 370, y: 460 },
  ];
  const devices = useOn(0.05, 0.3) * (1 - useOn(bases - 0.3, 0.2));
  const paused = t >= pausas + 0.3;
  const pulse = unit(t, celular - 0.1, 0.6);
  const lit = EASE.out(unit(t, celular + 0.4, 0.3));
  return (
    <Layer>
      {devices > 0 ? (
        <div className="absolute left-0 top-0" style={{ width: 540, height: 960, opacity: devices }}>
          <LaptopShape x={70} y={200} w={190} h={120}>
            <div className="absolute left-1/2 top-[22px] -translate-x-1/2">
              <PlayButton x={0} y={18} size={38} at={0.1} paused={paused} />
            </div>
            <div className="absolute left-[18px] top-[78px] h-[5px] w-[154px] rounded-full" style={{ background: DIM }} />
            <div className="absolute left-[18px] top-[78px] h-[5px] rounded-full" style={{ width: 154 * (paused ? 0.48 : 0.4 + 0.08 * unit(t, 0, pausas + 0.3)), background: G }} />
          </LaptopShape>
          <Mono x={165} y={350} at={pausas + 0.3} color={INK}>Pausado en 1:42</Mono>
          <svg className="absolute left-0 top-0" width={540} height={600} aria-hidden>
            <line x1={290} y1={260} x2={390} y2={260} stroke={MUTED} strokeWidth={2} strokeDasharray="5 6" />
          </svg>
          {pulse > 0 && pulse < 1 ? <div className="absolute rounded-full" style={{ left: 290 + 100 * pulse - 6, top: 254, width: 12, height: 12, background: G, boxShadow: `0 0 14px ${G}` }} /> : null}
          <PhoneShape x={400} y={196} w={70} h={130} lit={lit}>
            {lit > 0 ? (
              <div className="absolute left-0 right-0 top-[40px] flex flex-col items-center" style={{ opacity: lit }}>
                <div className="flex gap-[4px]"><div style={{ width: 6, height: 18, background: G }} /><div style={{ width: 6, height: 18, background: G }} /></div>
                <div data-ui="" className="mt-[10px] font-mono text-[14px] font-bold" style={{ color: G }}>1:42</div>
              </div>
            ) : null}
          </PhoneShape>
          <Mono x={435} y={350} at={celular + 0.4} color={G}>Ya lo sabe</Mono>
        </div>
      ) : null}
      <Title text="Tu estado, en todos lados" at={0.1} until={sabe - 0.1} />
      <Title text="Ya sabe dónde quedaste" at={sabe} until={bases - 0.3} />

      {[
        { x: 150, icon: "play" },
        { x: 270, icon: "list-music" },
        { x: 390, icon: "heart" },
      ].map((c, i) => (
        <Cylinder key={c.x} x={c.x} y={170} w={92} h={110} at={bases + i * 0.15} glyph={<Icono name={c.icon} size={30} ancla={false} />} />
      ))}
      {chips.map((c) => (
        <Chip key={c.text} x={c.x} y={c.y} at={c.at - 0.1} size={16}>{c.text}</Chip>
      ))}
      <Title text="Bases de datos distribuidas" at={distribuidas - 0.2} />
    </Layer>
  );
}
