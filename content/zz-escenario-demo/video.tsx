import { interpolate } from "remotion";
import { Anim } from "@motor/ui";
import { Board, defineVideo, Label, Spot, useCue, useStage, useStageCue } from "@motor/video";

// Demo local del escenario con cámara (fases 1 y 2 de docs/plan-piloto-automatico.md). No se publica.

const FLOOR_W = 420;
const FLOOR_H = 300;
const LEFT = 60;
const spots = {
  edificio: { x: LEFT - 20, y: 0, w: FLOOR_W + 40, h: FLOOR_H * 3 + 260 },
  app: { x: LEFT, y: 200, w: FLOOR_W, h: FLOOR_H },
  runtime: { x: LEFT, y: 200 + FLOOR_H, w: FLOOR_W, h: FLOOR_H },
  servidor: { x: LEFT, y: 200 + FLOOR_H * 2, w: FLOOR_W, h: FLOOR_H },
};

function Floor({ id, children }: { id: keyof typeof spots; children?: React.ReactNode }) {
  return (
    <Spot id={id} className="border-x-[6px] border-b-[6px] border-ink/70 bg-surface">
      {children}
    </Spot>
  );
}

function Building() {
  const { ms } = useStage();
  const crackAt = useStageCue("runtime", "grieta");
  const crack = interpolate(ms / 1000, [crackAt, crackAt + 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const request = useStageCue("servidor", "servidor");
  const holds = useStageCue("servidor", "sostiene");
  const runtimeAt = useStageCue("runtime", "runtime");
  return (
    <div className="absolute inset-0">
      <div className="absolute border-[6px] border-b-0 border-ink/70" style={{ left: LEFT - 20, top: 160, width: FLOOR_W + 40, height: 40 }} />
      <Floor id="app">
        <div className="absolute bottom-8 left-10 h-16 w-28 rounded-md bg-accent/70" />
        <div className="absolute bottom-8 right-10 h-16 w-28 rounded-md bg-accent/40" />
      </Floor>
      <Floor id="runtime">
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-[10px] border-muted" />
        <svg className="absolute inset-0" viewBox={`0 0 ${FLOOR_W} ${FLOOR_H}`}>
          <path d="M 300 0 L 270 80 L 310 140 L 260 220 L 290 300" fill="none" stroke="#ef4444" strokeWidth={8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crack} />
        </svg>
      </Floor>
      <Floor id="servidor">
        <Board
          width={FLOOR_W}
          height={FLOOR_H}
          nodes={[
            { id: "web", x: 110, y: 130, label: "Web", at: request },
            { id: "php", x: 310, y: 130, label: "PHP", at: request + 0.4 },
            { id: "disco", x: 210, y: 235, label: "Disco", at: holds },
          ]}
          edges={[
            { from: "web", to: "php" },
            { from: "php", to: "disco" },
          ]}
          events={[{ at: holds + 0.8, node: "php", state: "fail" }]}
          packets={[{ from: "web", to: "php", at: request + 1 }]}
        />
      </Floor>
      <div className="absolute left-0 h-[60px] w-[540px] bg-ink/10" style={{ top: 200 + FLOOR_H * 3 + 6 }} />
      <Label spot="app">Tu app</Label>
      <Label spot="runtime" at={runtimeAt}>
        Runtime
      </Label>
      <Label spot="runtime" at={crackAt} place="bottom-right" tone="alert">
        Grieta
      </Label>
      <Label spot="servidor">Servidor</Label>
    </div>
  );
}

function Hook() {
  return <p className="font-display text-[46px] font-black leading-[1.02] tracking-tight">Tu web tiene tres pisos</p>;
}

function Close() {
  const at = useCue("tres");
  return (
    <Anim efecto="aparece" en={at} className="mt-auto">
      <p className="rounded-xl bg-accent px-4 py-2 text-center font-display text-[34px] font-black text-accent-ink">Revisa los tres pisos</p>
    </Anim>
  );
}

export default defineVideo({
  captions: "pill",
  chapters: true,
  stage: { World: Building, width: 540, height: 1300, spots },
  meter: {
    kind: "slots",
    start: 0,
    max: 3,
    steps: [
      { scene: "app", word: "app", value: 1 },
      { scene: "runtime", word: "runtime", value: 2 },
      { scene: "servidor", word: "servidor", value: 3 },
    ],
  },
  scenes: [
    { id: "gancho", chapter: "El edificio", camera: { focus: "edificio" }, Visual: Hook },
    { id: "app", chapter: "Tu app", camera: { focus: "app" } },
    { id: "runtime", chapter: "Runtime", camera: { focus: "runtime" } },
    { id: "servidor", chapter: "Servidor", camera: { focus: "servidor" } },
    { id: "cierre", chapter: "Cierre", camera: { focus: "edificio" }, Visual: Close },
  ],
});
