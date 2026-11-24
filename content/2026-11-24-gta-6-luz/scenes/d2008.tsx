import { EASE, popAt, unit, useClock, useCue, wobble } from "@motor/video";
import type { BackProps } from "../palette.ts";
import { Backdrop, Chip, Cutout, Layer, YearTag } from "../parts.tsx";

/** A grey clay street: the test render of an engine. */
export function D2008Back({ t }: BackProps) {
  return <Backdrop src="img/calle-gris.png" t={t} at={-1} dur={18} z0={1.04} z1={1.14} y0={0} y1={-10} />;
}

/**
 * 2008: three crash-test dummies stand while "RAGE" and "Euphoria" land; with
 * "grabadas" three cars and three dummies lie in the very same pose (the
 * canned animation); with "atropella" one dummy stumbles against a car and
 * fights for balance ("simula"), and with "Ningún" it leaves ghosts of its
 * last poses, each one different.
 */
export function D2008() {
  const t = useClock();
  const rage = useCue("RAGE");
  const euphoria = useCue("Euphoria");
  const grabadas = useCue("grabadas");
  const atropella = useCue("atropella");
  const simula = useCue("simula");
  const ningun = useCue("Ningún");
  const hit = popAt(t, grabadas);
  const sway = wobble(t, "dummy", 3, 1.4);
  const fall = EASE.out(unit(t, atropella, 0.5));
  const fight = t > simula ? Math.sin((t - simula) * 5) * 9 * Math.exp(-(t - simula) * 0.6) : 0;
  const ghosts = [
    { at: ningun, rot: -24, dx: -40 },
    { at: ningun + 0.45, rot: 4, dx: 40 },
    { at: ningun + 0.9, rot: 18, dx: 0 },
  ];
  return (
    <Layer>
      <YearTag year="2008" name="Grand Theft Auto IV" at={-0.05} until={grabadas - 0.15} />
      <Chip at={rage} until={grabadas - 0.15} x={36} y={196} tone="light">
        RAGE
      </Chip>
      <Chip at={euphoria} until={grabadas - 0.15} x={150} y={196} tone="amber">
        Euphoria
      </Chip>
      {[0, 1, 2].map((i) => (
        <Cutout key={`s${i}`} src="img/maniqui-pie-cut.png" x={110 + i * 110} y={360 + (i % 2) * 40} w={86} h={284} at={rage + 0.1 + i * 0.12} until={grabadas - 0.15} rotate={wobble(t, `p${i}`, 1, 0.6).rotate} />
      ))}
      {[0, 1, 2].map((i) => (
        <div key={`c${i}`}>
          <Cutout src="img/auto-menta-cut.png" x={-120} y={250 + i * 165} w={250} h={130} at={grabadas - 0.05} until={atropella - 0.15} />
          <Cutout src="img/maniqui-tirado-cut.png" x={170} y={300 + i * 165} w={300} h={99} at={grabadas} until={atropella - 0.15} style={{ transform: `translateY(${-6 * (1 - Math.min(1, hit))}px)` }} />
        </div>
      ))}
      <Chip at={grabadas + 0.1} until={atropella - 0.15} x={36} y={180} tone="light">
        Animación grabada
      </Chip>
      <Cutout src="img/auto-menta-cut.png" x={-170} y={440} w={420} h={220} at={atropella - 0.05} />
      {t > atropella - 0.05 ? (
        <>
          {ghosts.map((g, i) =>
            t > g.at ? <Cutout key={`g${i}`} src="img/maniqui-tropieza-cut.png" x={190 + g.dx} y={380} w={330} h={300} at={g.at} rotate={g.rot} origin="50% 95%" style={{ opacity: 0.28 }} /> : null,
          )}
          <Cutout src="img/maniqui-tropieza-cut.png" x={190} y={380} w={330} h={300} at={atropella} rotate={-4 * fall + fight + sway.rotate} origin="50% 95%" />
        </>
      ) : null}
      <Chip at={simula} x={36} y={180} tone="accent">
        Simulado en vivo
      </Chip>
    </Layer>
  );
}
