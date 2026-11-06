import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Layer, Leaderboard, Source, Stamp, type Player } from "../parts.tsx";
import { ACCENT, INK, TOKEN } from "../world.tsx";

const PLAYERS: Player[] = [
  { name: "Ana", seed: 11, fichas: "50 M", entregado: "1", byFichas: 0, byEntregado: 0, color: TOKEN },
  { name: "Beto", seed: 4, fichas: "5 M", entregado: "1", byFichas: 1, byEntregado: 1, color: ACCENT },
];

function Pair({ at, label, a, b, color, note }: { at: number; label: string; a: number; b: number; color: string; note?: string }) {
  const t = useClock();
  const k = EASE.out(unit(t, at, 0.8));
  const bar = (name: string, v: number) => (
    <div className="flex items-center" style={{ gap: 10, marginTop: 8 }}>
      <span className="font-sans font-bold" style={{ fontSize: 16, width: 44, color: INK }}>
        {name}
      </span>
      <div className="rounded-full" style={{ height: 18, width: 330 * v * k, background: color, boxShadow: `0 0 10px ${color}` }} />
    </div>
  );
  return (
    <div style={{ marginBottom: 12, opacity: t >= at ? 1 : 0.2 }}>
      <div className="flex justify-between font-mono font-bold uppercase" style={{ fontSize: 14, letterSpacing: "0.12em", color }}>
        <span>{label}</span>
        {note && t >= at + 0.5 ? <span style={{ color: INK }}>{note}</span> : null}
      </div>
      {bar("Ana", a)}
      {bar("Beto", b)}
    </div>
  );
}

export function Engana() {
  const t = useClock();
  const enganar = useCue("engañar");
  const computo = useCue("cómputo");
  const valor = useCue("valor");
  const jelly = useCue("Jellyfish");
  const usan = useCue("usan");
  const veces = useCue("veces");
  const cambio = useCue("cambio");
  const doble = useCue("sacar") + 0.3;
  // ~10x counts up while the voice says it, and its label lands on "cambio".
  const times = Math.max(1, Math.round(1 + 9 * EASE.out(unit(t, usan, Math.max(0.3, veces - usan)))));
  return (
    <Layer>
      <Card at={0.05} y={176} h={196} label="Ranking por fichas · ejemplo">
        <Leaderboard players={PLAYERS} rowH={58} />
      </Card>
      <Stamp at={enganar} x={262} y={374} rotate={-6} tone="red" size={32}>
        Engañosa
      </Stamp>
      <Card at={computo - 0.3} y={388} h={198}>
        <Pair at={computo} label="Cómputo gastado" a={1} b={0.1} color={TOKEN} />
        <Pair at={valor} label="Valor" a={0.62} b={0.62} color={ACCENT} note="Misma función" />
      </Card>
      {t >= jelly - 0.2 ? (
        <Card at={jelly - 0.2} y={596} h={144} label="Datos de 12.000 devs" border={INK}>
          <div className="flex items-end justify-between">
            <div>
              <div className="font-display font-black tabular-nums" style={{ fontSize: 60, lineHeight: 1, color: TOKEN, opacity: t >= usan ? 1 : 0.15 }}>
                ~{times}x
              </div>
              <div className="font-mono font-bold uppercase" style={{ fontSize: 14, letterSpacing: "0.08em", color: INK, marginTop: 6, opacity: t >= cambio - 0.2 ? 1 : 0.2 }}>
                tokens por PR
              </div>
            </div>
            <div className="font-display font-black" style={{ fontSize: 40, color: "var(--piece-muted)", paddingBottom: 26 }}>
              →
            </div>
            <div className="text-right" style={{ opacity: t >= doble - 0.3 ? 1 : 0.15, transform: `scale(${t >= doble - 0.3 ? Math.min(1, 0.7 + 0.3 * popAt(t, doble - 0.3)) : 0.9})` }}>
              <div className="font-display font-black" style={{ fontSize: 60, lineHeight: 1, color: ACCENT }}>
                ~2x
              </div>
              <div className="font-mono font-bold uppercase" style={{ fontSize: 14, letterSpacing: "0.08em", color: INK, marginTop: 6 }}>
                PRs por semana
              </div>
            </div>
          </div>
        </Card>
      ) : null}
      <Source at={jelly} y={748}>
        Jellyfish, 15 abr 2026
      </Source>
    </Layer>
  );
}
