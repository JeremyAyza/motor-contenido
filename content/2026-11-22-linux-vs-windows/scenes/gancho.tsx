import { EASE, lerp, unit, useClock, useCue } from "@motor/video";
import { ACCENT, INK, TUX, WIN } from "../world.tsx";
import { Big, Chip, Hi, Layer, Monitor, Rise, SIDE } from "../parts.tsx";

/**
 * The hook: one monitor split in two, Windows left and Linux right, from
 * frame 1, with the question right of the avatar. Each half lights up when
 * its fans speak ("sí" on Linux, "trabajo extra" on Windows), and on
 * "distinto" two cards drop from the monitor: what each user wants.
 */
export function Gancho() {
  const t = useClock();
  const linux = useCue("Linux", 2);
  const si = useCue("sí.");
  const windows = useCue("Windows", 2);
  const extra = useCue("extra.");
  const pero = useCue("Pero");
  const cada = useCue("cada");
  const tuxLit = EASE.out(unit(t, linux, 0.3)) * (1 - EASE.out(unit(t, windows, 0.3)));
  const winLit = EASE.out(unit(t, windows, 0.3)) * (1 - EASE.out(unit(t, pero, 0.3)));
  const both = EASE.out(unit(t, pero, 0.4));
  const win = t < linux ? 1 : lerp(0.35, 1, Math.max(winLit, both));
  const tux = t < linux ? 1 : lerp(0.35, 1, Math.max(tuxLit, both));
  const breathe = 1 + 0.012 * Math.sin(t * 1.4);
  return (
    <Layer>
      <Monitor x={36} y={170} w={468} h={280} win={win} tux={tux} scale={breathe} />
      <Chip x={390} y={212} at={si} until={windows} color={TUX} solid size={15}>sí</Chip>
      <Chip x={150} y={212} at={extra - 0.3} until={pero} color={WIN} solid size={15}>trabajo extra</Chip>
      <Big x={SIDE.x} y={SIDE.y} w={SIDE.w} size={40} at={-1} until={linux - 0.25}>
        ¿Linux es <Hi color={ACCENT}>mejor</Hi> que Windows?
      </Big>
      <Big x={SIDE.x} y={SIDE.y + 20} w={SIDE.w} size={36} at={linux} until={windows - 0.2} color={INK}>
        Si usas Linux: <Hi color={TUX}>sí.</Hi>
      </Big>
      <Big x={SIDE.x} y={SIDE.y + 20} w={SIDE.w} size={36} at={windows} until={pero - 0.15}>
        Si usas Windows: <Hi color={WIN}>no.</Hi>
      </Big>
      <Big x={SIDE.x} y={SIDE.y} w={SIDE.w} size={36} at={pero}>
        La respuesta real es <Hi color={ACCENT}>otra.</Hi>
      </Big>
      <Rise x={36} y={500} w={226} h={68} at={cada}>
        <WantCard color={WIN} text="que funcione y ya" />
      </Rise>
      <Rise x={278} y={500} w={226} h={68} at={cada + 0.18}>
        <WantCard color={TUX} text="decidir todo" />
      </Rise>
    </Layer>
  );
}

function WantCard({ color, text }: { color: string; text: string }) {
  return (
    <div data-ui="" className="absolute inset-0 flex flex-col justify-center rounded-[8px] px-[14px]" style={{ background: "#111720", border: `1.5px solid ${color}` }}>
      <span className="font-mono text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color }}>quiere</span>
      <span className="font-sans text-[18px] font-bold leading-tight" style={{ color: INK }}>{text}</span>
    </div>
  );
}
