import { EASE, lerp, Stamp, unit, useClock, useCue } from "@motor/video";
import { Chip, Layer, LangMark, LogoTile, outlined } from "../parts.tsx";
import { GO, INK, LANES, RUST } from "../world.tsx";

/** 0 → 1 → 0 around `at`: a short bump for a pulse. */
const bump = (t: number, at: number) => Math.max(0, 1 - Math.abs(t - at - 0.15) * 5);

/**
 * The hook: the screen split in two lanes, Go on top and Rust below. Go's
 * mark slides in from frame 1 and Rust's gear drops into its lane; with the
 * voice, each shrinks to its lane's top and lets in the companies that run
 * on it. On "nombres" dotted lines tie each company to its language, and the
 * marks pulse on "lenguajes". On "¿Por qué?" the tiles dim and a stamp hits
 * the line between the lanes; "alto rendimiento" lands under it.
 */
export function Gancho() {
  const t = useClock();
  const docker = useCue("Docker");
  const kube = useCue("Kubernetes");
  const cloud = useCue("Cloudflare");
  const discord = useCue("Discord");
  const nombres = useCue("nombres");
  const lenguajes = useCue("lenguajes.");
  const why = useCue("¿Por");
  const populares = useCue("populares");
  const rendimiento = useCue("rendimiento?");
  const goShrink = EASE.inOut(unit(t, docker - 0.35, 0.45));
  const rustShrink = EASE.inOut(unit(t, cloud - 0.35, 0.45));
  const dim = EASE.out(unit(t, why - 0.1, 0.3));
  const goLane = (LANES.top + LANES.mid) / 2;
  const rustLane = (LANES.mid + LANES.bottom) / 2;
  const pulse = 1 + 0.14 * Math.max(bump(t, lenguajes), bump(t, populares));
  const ties = EASE.out(unit(t, nombres, 0.6));
  const tie = (from: [number, number], to: [number, number], color: string) => (
    <line x1={from[0]} y1={from[1]} x2={lerp(from[0], to[0], ties)} y2={lerp(from[1], to[1], ties)} stroke={color} strokeWidth={2} strokeDasharray="6 5" opacity={0.9 * (1 - dim * 0.6)} />
  );
  return (
    <Layer>
      <div className="absolute left-[36px] right-[36px] text-center font-display font-black uppercase leading-none tracking-tight" style={{ top: 158, fontSize: 48, ...outlined(INK) }}>
        Go <span style={{ color: "#C9C3B6" }}>vs</span> Rust
      </div>
      {ties > 0 ? (
        <svg className="absolute left-0 top-0" width={540} height={960} aria-hidden>
          {tie([250, 252], [180, 300], GO)}
          {tie([290, 252], [360, 300], GO)}
          {tie([250, 528], [180, 640], RUST)}
          {tie([290, 528], [360, 640], RUST)}
        </svg>
      ) : null}
      <div className="absolute" style={{ left: 270, top: lerp(goLane + 40, 238, goShrink), transform: `scale(${lerp(1, 0.36, goShrink) * pulse})`, transformOrigin: "0 0" }}>
        <LangMark lang="go" x={0} y={0} size={190} at={-0.25} />
      </div>
      <div className="absolute" style={{ left: 270, top: lerp(rustLane, LANES.mid + 62, rustShrink), transform: `scale(${lerp(1, 0.42, rustShrink) * pulse})`, transformOrigin: "0 0" }}>
        <LangMark lang="rust" x={0} y={0} size={170} at={-0.15} from="top" />
      </div>
      <LogoTile slug="docker" x={160} y={344} at={docker} name="Docker" note="escrito en Go" noteColor={GO} dim={dim} />
      <LogoTile slug="kubernetes" x={380} y={344} at={kube} name="Kubernetes" note="escrito en Go" noteColor={GO} dim={dim} />
      <LogoTile slug="cloudflare" x={160} y={680} at={cloud} name="Cloudflare" note="Pingora: Rust" noteColor={RUST} dim={dim} />
      <LogoTile slug="discord" x={380} y={680} at={discord} name="Discord" note="Read States: Rust" noteColor={RUST} dim={dim} />
      <Stamp at={why} x={270} y={LANES.mid} color={INK} fill="#111214" rotate={-5} size={50}>
        ¿Por qué?
      </Stamp>
      <Chip x={270} y={LANES.mid - 54} at={rendimiento - 0.2} color={INK} size={15}>alto rendimiento</Chip>
    </Layer>
  );
}
