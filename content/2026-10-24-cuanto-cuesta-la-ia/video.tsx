import { getLength, getPointAtLength } from "@remotion/paths";
import type { ReactNode } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Icono } from "@motor/ui";
import {
  Along,
  Banner,
  Booth,
  Building,
  Bush,
  Cloud,
  Coin,
  Cone,
  defineVideo,
  Document,
  House,
  Machine,
  Person,
  Pine,
  Pop,
  RoadPath,
  Server,
  Sfx,
  Sign,
  StreetLamp,
  Traffic,
  TrafficLight,
  Tree,
  Truck,
  useCue,
  usePop,
  useStage,
  useStageCue,
  Warehouse,
} from "@motor/video";

// La carretera es una metáfora de la facturación por tokens (facts.json → illustrative): los
// bloques son tokens, la caseta es el modelo y el tablero de arriba es la cuenta. El ejemplo
// del PDF es un cálculo propio con los precios de Sonnet 5.5.

const W = 540;
const H = 3200;
const ROAD =
  "M 40 300 C 260 300, 470 330, 470 520 C 470 720, 80 660, 80 880 C 80 1100, 470 1040, 470 1260 C 470 1480, 80 1420, 80 1640 C 80 1860, 470 1800, 470 2020 C 470 2240, 80 2180, 80 2400 C 80 2620, 470 2560, 470 2780 C 470 2960, 320 3040, 140 3040";

/** The fraction of the road nearest to a point: where each station sits on it. */
function fractionAt(target: { x: number; y: number }): number {
  const length = getLength(ROAD);
  let best = 0;
  let bestDistance = Infinity;
  for (let i = 0; i <= 600; i++) {
    const p = getPointAtLength(ROAD, (length * i) / 600);
    if (!p) continue;
    const distance = Math.hypot(p.x - target.x, p.y - target.y);
    if (distance < bestDistance) [best, bestDistance] = [i / 600, distance];
  }
  return best;
}

/** The stations, at the bends of the road. */
const ST = {
  casa: { x: 40, y: 300 },
  tokenizador: { x: 470, y: 520 },
  caseta: { x: 80, y: 880 },
  historial: { x: 470, y: 1260 },
  cache: { x: 80, y: 1640 },
  lotes: { x: 470, y: 2020 },
  modelos: { x: 80, y: 2400 },
  meta: { x: 470, y: 2780 },
};
const F = Object.fromEntries(Object.entries(ST).map(([k, v]) => [k, fractionAt(v)])) as Record<keyof typeof ST, number>;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (t: number, at: number, dur = 0.3) => interpolate(t, [at, at + dur], [0, 1], clamp);
const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

function useT() {
  return useStage().ms / 1000;
}

/** A token on the road: blue in, yellow out, grey when it is the model thinking. */
function Token({ kind = "in", label }: { kind?: "in" | "out" | "think"; label?: string }) {
  const tone = { in: "bg-[#5B8DEF] text-white", out: "bg-accent text-accent-ink", think: "bg-[#6B7080] text-white" }[kind];
  return (
    <div className={`flex h-[34px] min-w-[34px] -translate-x-1/2 -translate-y-[80%] items-center justify-center rounded-lg px-1.5 font-mono text-[18px] font-bold shadow-[0_5px_0_rgba(0,0,0,0.35)] ${tone}`}>
      {label ?? ""}
    </div>
  );
}

/** A train of `n` tokens that travels the road from `from` to `to` between `t0` and `t1` (world seconds). */
function Train({ from, to, t0, t1, n = 5, kind = "in", gap = 0.008 }: { from: number; to: number; t0: number; t1: number; n?: number; kind?: "in" | "out" | "think"; gap?: number }) {
  const t = useT();
  if (t < t0 || t > t1 + 0.4) return null;
  const p = ease(interpolate(t, [t0, t1], [0, 1], clamp));
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const at = from + (to - from) * p - i * gap * Math.sign(to - from);
        if ((to > from && at < from) || (to < from && at > from)) return null;
        return (
          <Along key={i} path="ruta" at={at}>
            <div style={{ opacity: 1 - fade(t, t1, 0.4) }}>
              <Token kind={kind} label={kind === "think" ? "…" : undefined} />
            </div>
          </Along>
        );
      })}
    </>
  );
}

/** A world label: dark plate, mono caps, pops in with a blip. */
function Plate({ x, y, at, children, tone = "dark" }: { x: number; y: number; at: number; children: ReactNode; tone?: "dark" | "accent" | "light" }) {
  const p = usePop(at);
  if (p <= 0) return null;
  const tones = { dark: "bg-[#0E1015] text-ink ring-1 ring-white/15", accent: "bg-accent text-accent-ink", light: "bg-[#F2F0EA] text-[#16181D]" };
  return (
    <>
      <Sfx id="blip" at={at} />
      <span className={`absolute whitespace-nowrap rounded-lg px-2.5 py-1.5 font-mono text-[18px] font-bold uppercase leading-none shadow-[0_6px_14px_rgba(0,0,0,0.4)] ${tones[tone]}`} style={{ left: x, top: y, transform: `translate(-50%, -50%) scale(${p})` }}>
        {children}
      </span>
    </>
  );
}

function Scenery() {
  return (
    <>
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, #F2F0EA 1.2px, transparent 1.4px)", backgroundSize: "34px 34px" }} />
      <Cloud x={120} y={150} s={0.9} span={620} />
      <Cloud x={380} y={210} s={0.7} span={620} />
      <Cloud x={260} y={1150} s={0.8} span={620} />
      <Cloud x={140} y={2240} s={0.8} span={620} />
      {[
        [20, 420], [250, 640], [520, 760], [300, 1000], [30, 1180], [250, 1400], [520, 1560], [300, 1780], [30, 1950], [260, 2160], [520, 2320], [300, 2560], [40, 2700], [250, 2920],
      ].map(([x, y], i) => (i % 3 === 0 ? <Pine key={i} x={x} y={y} s={0.9} /> : i % 3 === 1 ? <Tree key={i} x={x} y={y} s={0.8} /> : <Bush key={i} x={x} y={y} s={1.1} />))}
      {[
        [150, 360], [400, 640], [190, 1060], [380, 1400], [180, 1780], [400, 2180], [190, 2560], [380, 2950],
      ].map(([x, y], i) => (
        <StreetLamp key={i} x={x} y={y} s={0.8} />
      ))}
      <TrafficLight x={420} y={300} s={0.8} />
      <Cone x={200} y={930} />
      <Cone x={225} y={938} />
    </>
  );
}

function Start() {
  const t = useT();
  const leave = useStageCue("taximetro", "mandas");
  const arrive = useStageCue("tokens", "tokenizador");
  const p = ease(interpolate(t, [leave, arrive], [0, 1], clamp));
  return (
    <>
      <House x={130} y={282} s={1.1} />
      <Person x={215} y={290} s={0.9} />
      {t < useStageCue("tokens", "primero") ? (
        <Plate x={130} y={180} at={0.3} tone="light">
          Tú
        </Plate>
      ) : null}
      {t < arrive + 0.2 ? (
        <Along path="ruta" at={F.casa + (F.tokenizador - F.casa) * p}>
          <div className="-translate-x-1/2 -translate-y-full" style={{ opacity: 1 - fade(t, arrive, 0.2) }}>
            <Document x={0} y={0} s={1} />
          </div>
        </Along>
      ) : null}
    </>
  );
}

function Tokenizer() {
  const t = useT();
  const on = useStageCue("tokens", "tokenizador");
  const short = useStageCue("tokens", "corta");
  const long = useStageCue("tokens", "larga");
  const parts = useStageCue("tokens", "varios");
  const word = ["des", "afortu", "nada", "mente"];
  return (
    <>
      <Machine x={320} y={505} s={1.05} running={t > on} label="Tokenizador" />
      <Pop at={short} x={220} y={380}>
        <span className="absolute flex h-[40px] -translate-x-1/2 -translate-y-1/2 items-center rounded-lg bg-[#5B8DEF] px-2.5 font-mono text-[22px] font-bold text-white shadow-[0_5px_0_rgba(0,0,0,0.35)]">sol</span>
      </Pop>
      {word.map((w, i) => {
        const at = long + i * 0.15;
        const apart = interpolate(t, [parts, parts + 0.5], [0, 1], clamp);
        return (
          <Pop key={w} at={at} x={190 + i * (66 + 8 * apart)} y={438 - (i % 2) * 10 * apart}>
            <span className="absolute flex h-[36px] -translate-x-1/2 -translate-y-1/2 items-center rounded-lg bg-[#5B8DEF] px-2 font-mono text-[18px] font-bold text-white shadow-[0_5px_0_rgba(0,0,0,0.35)]">{w}</span>
          </Pop>
        );
      })}
    </>
  );
}

function TollBooth() {
  const t = useT();
  const inAt = useStageCue("precios", "entrada");
  const outAt = useStageCue("precios", "salida");
  const times = useStageCue("precios", "cinco");
  const prices = useStageCue("precios", "sonnet");
  const think = useStageCue("pensar", "piensan");
  const open = fade(t, outAt, 0.5) * (1 - fade(t, useStageCue("memoria", "trampa"), 0.5));
  return (
    <>
      <Booth x={190} y={905} s={1.1} open={open} />
      <Sign x={390} y={965} s={1} w={190} h={96}>
        <div className="flex gap-4" style={{ opacity: fade(t, prices) }}>
          <div className="text-center">
            <p className="font-mono text-[13px] font-bold uppercase text-[#8FB2F5]">Entrada</p>
            <p className="font-display text-[36px] font-black leading-none text-ink">$2</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-[13px] font-bold uppercase text-accent">Salida</p>
            <p className="font-display text-[36px] font-black leading-none text-accent">$10</p>
          </div>
        </div>
      </Sign>
      <Plate x={478} y={815} at={times} tone="accent">
        ×5
      </Plate>
      {/* Input arrives at the booth; output leaves toward the history */}
      <Train from={F.tokenizador} to={F.caseta} t0={inAt - 0.3} t1={inAt + 3} n={6} />
      <Train from={F.caseta} to={F.caseta + 0.05} t0={outAt + 0.2} t1={outAt + 2.6} n={4} kind="out" />
      <Train from={F.caseta} to={F.caseta + 0.05} t0={think} t1={think + 2.2} n={6} kind="think" />
      <Train from={F.caseta} to={F.caseta + 0.05} t0={think + 2.4} t1={think + 4.4} n={3} kind="out" />
    </>
  );
}

function History() {
  const t = useT();
  const go = useStageCue("memoria", "cada");
  const fifty = useStageCue("memoria", "millones");
  const end = useStageCue("cache", "guardas");
  const n = Math.max(1, Math.round(interpolate(t, [go, fifty + 0.3], [1, 50], clamp)));
  const p = ease(interpolate(t, [go - 0.5, end], [0, 1], clamp));
  const rows = Math.min(10, Math.ceil(n / 5));
  const light = fade(t, end, 0.4);
  if (t < go - 1) return null;
  return (
    <>
      <Along path="ruta" at={F.caseta + 0.02 + (F.historial - 0.03 - F.caseta - 0.02) * p}>
        <Truck
          x={0}
          y={12}
          s={0.85}
          cargo={
            <div className="flex flex-col-reverse gap-[2px]" style={{ opacity: 1 - light }}>
              {Array.from({ length: rows }, (_, i) => (
                <div key={i} className="h-[7px] rounded-sm bg-[#5B8DEF]" />
              ))}
            </div>
          }
        />
      </Along>
      <Plate x={240} y={1120} at={go} tone="dark">
        Mensaje <span className="text-accent">{n}</span>
      </Plate>
      {t > go ? <Sfx id="auto-pasa" at={go} volume={0.12} /> : null}
    </>
  );
}

function CacheStation() {
  const t = useT();
  const at = useStageCue("cache", "caché");
  const stored = useStageCue("cache", "guardas");
  const read = useStageCue("cache", "lectura");
  const cheap = useStageCue("cache", "centavos");
  return (
    <>
      <Pop at={at} x={260} y={1625}>
        <Warehouse x={0} y={0} s={1.05} />
      </Pop>
      <Plate x={260} y={1470} at={at + 0.2} tone="accent">
        Caché
      </Plate>
      <Pop at={stored} x={240} y={1600}>
        <Document x={0} y={0} s={0.9} />
      </Pop>
      <Plate x={400} y={1560} at={read} tone="light">
        Leer: 5%
      </Plate>
      <Train from={F.cache - 0.03} to={F.cache + 0.06} t0={read + 0.2} t1={cheap + 1.5} n={3} kind="in" gap={0.02} />
      {t > cheap ? <Coin x={170} y={1700} s={1.2} /> : null}
    </>
  );
}

function Lots() {
  const half = useStageCue("lotes", "mitad");
  const sum = useStageCue("lotes", "suma");
  return (
    <>
      <Truck x={300} y={1960} s={0.7} />
      <Truck x={300} y={2010} s={0.7} />
      <Truck x={300} y={2060} s={0.7} />
      <Plate x={300} y={1880} at={useStageCue("lotes", "lotes")} tone="dark">
        Lotes
      </Plate>
      <Plate x={420} y={2120} at={half} tone="accent">
        −50%
      </Plate>
      <Plate x={250} y={2140} at={sum} tone="light">
        + caché
      </Plate>
    </>
  );
}

function Models() {
  const haiku = useStageCue("modelos", "haiku");
  const opus = useStageCue("modelos", "opus");
  const times = useStageCue("modelos", "cuarenta");
  return (
    <>
      <Pop at={haiku} x={240} y={2385}>
        <Building x={0} y={0} s={0.8} floors={2} cols={2} />
      </Pop>
      <Pop at={opus} x={385} y={2385}>
        <Building x={0} y={0} s={0.9} floors={9} cols={3} />
      </Pop>
      <Plate x={240} y={2400} at={haiku + 0.2} tone="light">
        Haiku $0,10
      </Plate>
      <Plate x={385} y={2400} at={opus + 0.2} tone="dark">
        Opus $4
      </Plate>
      <Plate x={455} y={2230} at={times} tone="accent">
        ×40
      </Plate>
      <Server x={470} y={2320} s={0.7} />
    </>
  );
}

function Finish() {
  return (
    <>
      <Sign x={330} y={2800} s={1} w={170} h={70}>
        <span className="font-mono text-[18px] font-bold uppercase text-accent">Tu cuenta</span>
      </Sign>
      <Coin x={250} y={2820} s={1} />
      <Coin x={410} y={2830} s={0.9} />
    </>
  );
}

function Highway() {
  return (
    <div className="absolute inset-0 text-ink">
      <Scenery />
      <RoadPath path="ruta" width={58} />
      <Traffic path="ruta" count={4} speed={0.012} />
      <Start />
      <Tokenizer />
      <TollBooth />
      <History />
      <CacheStation />
      <Lots />
      <Models />
      <Finish />
    </div>
  );
}

/* ---------- Over the world, per scene: the idea of the moment ---------- */

/** Under the HUD board, where the scene's banner sits. */
function Top({ children }: { children: ReactNode }) {
  return <div className="relative mt-[116px] flex flex-col items-center gap-2">{children}</div>;
}

function Hook() {
  const money = useCue("chat");
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <div className="relative mt-[116px] flex flex-col">
      <p className="font-display text-[54px] font-black leading-[0.95] tracking-tight text-ink drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
        Pagas por <span className="text-accent">tokens</span>
      </p>
      <p className="mt-3 self-start rounded-xl bg-surface px-4 py-2 font-display text-[38px] font-black text-ink" style={{ opacity: fade(t, money) }}>
        $5 <span className="text-muted">o</span> <span className="text-accent">$0,37</span>
      </p>
    </div>
  );
}

const banner = (said: string, text: string, tone: "light" | "accent" | "dark" = "light", until?: string) =>
  function SceneBanner() {
    const at = useCue(said);
    const end = until ? useCue(until) : undefined;
    return (
      <Top>
        <Banner at={at} until={end} tone={tone}>
          {text}
        </Banner>
      </Top>
    );
  };

function Prices() {
  return (
    <Top>
      <Banner at={useCue("mandas")} until={useCue("responde")} tone="light">
        Entrada = todo lo que mandas
      </Banner>
      <Banner at={useCue("cinco")} tone="accent">
        Salida = 5× la entrada
      </Banner>
    </Top>
  );
}

function Close() {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const items: Array<[string, string, string]> = [
    ["arrow-right-to-line", "Entrada $2", "entrada"],
    ["arrow-left-from-line", "Salida $10", "salida"],
    ["brain", "Pensar = salida", "razonamiento"],
    ["history", "Todo se reenvía", "historial"],
    ["archive", "Caché y lotes", "caché"],
    ["building-2", "El modelo: ×40", "modelo"],
  ];
  return (
    <div className="relative mt-[116px] flex flex-col items-end gap-2">
      {items.map(([icon, text, word]) => {
        const at = useCue(word);
        return (
          <div key={text} style={{ opacity: fade(t, at), transform: `translateX(${(1 - fade(t, at)) * 40}px)` }}>
            <Sfx id="click" at={at} />
            <div className="flex items-center gap-3 rounded-xl bg-[#0E1015]/92 px-4 py-2 text-[26px] font-bold text-ink ring-1 ring-white/10">
              <Icono name={icon} size={26} strokeWidth={2.5} ancla={false} className="text-accent" />
              {text}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default defineVideo({
  captions: "card",
  chapters: true,
  music: { file: "audio/cama.mp3" },
  stage: { World: Highway, width: W, height: H, paths: { ruta: ROAD } },
  panel: {
    rows: ["Entrada", "Salida", "Caché"],
    active: [
      { scene: "precios", word: "entrada", value: 0 },
      { scene: "precios", word: "salida", value: 1 },
      { scene: "memoria", word: "reenvía", value: 0 },
      { scene: "cache", word: "caché", value: 2 },
    ],
    counters: [
      {
        label: "Tokens",
        start: 0,
        steps: [
          { scene: "taximetro", word: "tokens", value: 50_000, ramp: 1.6 },
          { scene: "precios", word: "responde", value: 51_000, ramp: 0.8 },
          { scene: "pensar", word: "pensamiento", value: 54_000, ramp: 1.2 },
          { scene: "memoria", word: "millones", value: 2_500_000, ramp: 1.8 },
        ],
      },
      {
        label: "Tu cuenta",
        kind: "money",
        start: 0,
        decimals: 2,
        steps: [
          { scene: "taximetro", word: "cuesta", value: 0.1, ramp: 1 },
          { scene: "precios", word: "responde", value: 0.11 },
          { scene: "pensar", word: "pensamiento", value: 0.14 },
          { scene: "memoria", word: "dólares", value: 5, ramp: 1.2 },
          { scene: "cache", word: "centavos", value: 0.37, ramp: 1.4 },
        ],
      },
    ],
    footer: "Sonnet 5.5 · $2 entrada · $10 salida por millón · ejemplo",
  },
  avatar: {},
  scenes: [
    { id: "gancho", chapter: "Tokens", camera: { focus: { x: 220, y: 300 }, zoom: 1.3 }, Visual: Hook },
    { id: "taximetro", chapter: "El taxímetro", camera: { follow: { path: "ruta", from: F.casa, to: F.tokenizador - 0.015, x: W / 2 }, zoom: 1.25 }, Visual: banner("cincuenta", "PDF: 50.000 tokens") },
    { id: "tokens", chapter: "Qué es un token", camera: { focus: { x: 300, y: 430 }, zoom: 1.5 }, Visual: banner("pedazos", "Token = pedazo de texto") },
    { id: "precios", chapter: "Dos precios", camera: { follow: { path: "ruta", from: F.tokenizador, to: F.caseta, x: W / 2 }, zoom: 1.2 }, Visual: Prices },
    { id: "pensar", chapter: "Trampa 1", camera: { focus: { x: 220, y: 840 }, zoom: 1.55 }, Visual: banner("cobra", "Pensar se cobra como salida", "accent") },
    { id: "memoria", chapter: "Trampa 2", camera: { follow: { path: "ruta", from: F.caseta, to: F.historial, x: W / 2 }, zoom: 1.2 }, Visual: banner("reenvía", "Cada mensaje reenvía todo") },
    { id: "cache", chapter: "El caché", camera: { follow: { path: "ruta", from: F.historial, to: F.cache, x: W / 2 }, zoom: 1.2 }, Visual: banner("lectura", "Leer del caché: 5%", "accent") },
    { id: "lotes", chapter: "Lotes", camera: { follow: { path: "ruta", from: F.cache, to: F.lotes, x: W / 2 }, zoom: 1.2 }, Visual: banner("mitad", "Lotes: −50%", "accent") },
    { id: "modelos", chapter: "El modelo", camera: { follow: { path: "ruta", from: F.lotes, to: F.modelos, x: W / 2 }, zoom: 1.2 }, Visual: banner("cuarenta", "Haiku vs Opus: ×40", "accent") },
    { id: "cierre", chapter: "Resumen", camera: { focus: { x: 270, y: 1700 }, zoom: 0.24 }, Visual: Close },
  ],
});
