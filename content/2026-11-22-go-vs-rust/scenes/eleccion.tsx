import { EASE, lerp, unit, useClock, useCue } from "@motor/video";
import { Chip, Crate, Layer, LangMark, LogoTile, Worker } from "../parts.tsx";
import { GO, LANES, RUST } from "../world.tsx";

const TEAM_X = [70, 120, 170, 220, 270];

/**
 * The choice: the two lanes of the hook come back with their uses written.
 * Go's labels light up while goroutines flow to its small team, and the
 * Docker and Kubernetes tiles drop back in; then Rust's labels, owners with
 * their crates, and the Cloudflare and Discord tiles.
 */
export function Eleccion() {
  const t = useClock();
  const apis = useCue("APIs,");
  const micro = useCue("microservicios");
  const dist = useCue("distribuidos,");
  const gran = useCue("gran");
  const componentes = useCue("componentes");
  const control = useCue("control");
  const seguridad = useCue("seguridad");
  const rust = useCue("Rust");
  const brilla = useCue("brilla.");
  const goTeam = EASE.out(unit(t, 0.2, 0.4));
  const rustTeam = EASE.out(unit(t, componentes - 0.2, 0.4));
  const rustY = LANES.mid;
  return (
    <Layer>
      <LangMark lang="go" x={84} y={140} size={74} at={0} />
      <Chip x={190} y={140} at={apis} color={GO} size={15}>APIs</Chip>
      <Chip x={312} y={140} at={micro} color={GO} size={15}>microservicios</Chip>
      <Chip x={270} y={190} at={dist} color={GO} size={15}>sistemas distribuidos</Chip>
      {Array.from({ length: 14 }).map((_, i) => {
        const phase = (((t / 1.3) + i / 14) % 1 + 1) % 1;
        return <div key={i} className="absolute h-[4px] w-[4px] rounded-full" style={{ left: lerp(60 + ((i * 41) % 220), TEAM_X[i % 5], phase), top: lerp(250, 360, phase), background: GO, opacity: goTeam * (1 - phase * 0.5) }} />;
      })}
      {TEAM_X.map((x) => (
        <Worker key={x} x={x} y={400} s={1.1} color={GO} opacity={goTeam} />
      ))}
      <LogoTile slug="docker" x={366} y={330} at={gran - 0.1} name="Docker" />
      <LogoTile slug="kubernetes" x={452} y={330} at={gran + 0.1} name="Kubernetes" />
      <LangMark lang="rust" x={84} y={rustY + 56} size={58} at={componentes - 0.4} from="top" />
      <Chip x={250} y={rustY + 56} at={componentes} color={RUST} size={15}>componentes críticos</Chip>
      <Chip x={190} y={rustY + 106} at={control} color={RUST} size={15}>control de memoria</Chip>
      <Chip x={346} y={rustY + 106} at={seguridad} color={RUST} size={15}>seguridad</Chip>
      {TEAM_X.slice(0, 3).map((x, i) => (
        <div key={x}>
          <Worker x={x + i * 22} y={rustY + 296} s={1.1} color={RUST} opacity={rustTeam} />
          <Crate x={x + i * 22 + 14} y={rustY + 250} size={26} opacity={rustTeam} />
        </div>
      ))}
      <LogoTile slug="cloudflare" x={366} y={rustY + 240} at={Math.min(brilla - 0.2, rust)} name="Cloudflare" />
      <LogoTile slug="discord" x={452} y={rustY + 240} at={brilla} name="Discord" />
    </Layer>
  );
}
