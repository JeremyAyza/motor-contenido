import type { ReactNode } from "react";
import { Anim, animStyle, Boceto, Flecha, Gesto, Icono, Logo, Objeto } from "@motor/ui";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { defineVideo, SceneFrame, useCue } from "@motor/video";

/*
 * Pieza: Anthropic reemplazó a Git con Scion (content/2026-10-20-anthropic-scion-git).
 * Los datos salen de facts.json (Anthropic Engineering, octubre 2026) y el
 * guion, de video.json. Medidas en px de diseño (540×960); cada dibujo mide
 * 468 px de ancho.
 *
 * Dirección de arte: antes y después (video.json → art). Cada escena opone dos
 * campos: Git, el antes, en el papel; Scion, el después, en el terracota de
 * Claude. Los títulos van en Archivo condensada. Los logos son los oficiales
 * de Simple Icons, sin modificar.
 */

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Miles con punto, como los escribe el guion (2.500, 30.000). */
const miles = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

function useSegundos() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
}

function Escena({ titulo, ancla, alto, children }: { titulo: string; ancla?: ReactNode; alto: number; children: ReactNode }) {
  return (
    <SceneFrame title={titulo} anchor={ancla} height={alto} titleClassName="text-[54px] leading-[0.96] [font-stretch:78%]">
      {children}
    </SceneFrame>
  );
}

/**
 * Los dos campos del antes y el después: Git en el papel, Scion en el acento.
 * `sacude` hace temblar el campo de Git en ese momento y `apaga` lo apaga y
 * tacha su nombre. Nada se dibuja encima de los logos.
 */
function Mitades({ alto, sacude, apaga }: { alto: number; sacude?: number; apaga?: number }) {
  const t = useSegundos();
  const desde = sacude === undefined ? 0 : t - sacude;
  const temblor = desde > 0 && desde < 0.7 ? Math.sin(desde * 42) * 7 * (1 - desde / 0.7) : 0;
  const brillo = apaga === undefined ? 1 : interpolate(t, [apaga, apaga + 0.5], [1, 0.4], CLAMP);
  return (
    <>
      <div
        className="absolute left-0 top-0 flex w-[222px] flex-col items-center rounded-3xl bg-surface pt-9"
        style={{ height: alto, transform: `translateX(${temblor}px)`, opacity: brillo }}
      >
        <Logo slug="git" size={96} />
        <p className="mt-5 font-display text-[40px] font-black leading-none [font-stretch:78%]">Git</p>
        <p className="mt-2 text-[22px] font-semibold text-muted">antes</p>
      </div>
      {apaga !== undefined ? (
        <div className="absolute left-[62px] top-[160px]">
          <Boceto ancho={100} alto={24} grosor={5} trazos={[{ d: "M4 14 C 30 8, 64 18, 96 10", tono: "accent" }]} anim={{ en: apaga + 0.2, dur: 0.35 }} />
        </div>
      ) : null}
      <div className="absolute left-[246px] top-0 flex w-[222px] flex-col items-center rounded-3xl bg-accent pt-9 text-accent-ink" style={{ height: alto }}>
        <Logo slug="anthropic" size={96} />
        <p className="mt-5 font-display text-[40px] font-black leading-none [font-stretch:78%]">Scion</p>
        <p className="mt-2 text-[22px] font-semibold opacity-85">después</p>
      </div>
      <div className="absolute left-[212px] flex size-[44px] items-center justify-center rounded-full bg-ink text-bg" style={{ top: alto / 2 - 22 }}>
        <Icono name="arrow-right" size={26} strokeWidth={2.5} ancla={false} />
      </div>
    </>
  );
}

// 1. El gancho: el antes y el después desde el cuadro 1 (es la portada), con la
// cifra. Con "merges" llueven merges alrededor de Git; con "flujo", Git tiembla.
const MERGES = [
  [12, 8],
  [176, 8],
  [8, 76],
  [180, 76],
  [12, 146],
  [176, 146],
] as const;

function Gancho() {
  const merges = useCue("merges");
  const flujo = useCue("flujo");
  return (
    <Escena titulo="Anthropic reemplazó a Git" ancla={<Logo slug="anthropic" size={56} />} alto={450}>
      <Mitades alto={300} sacude={flujo} />
      {MERGES.map(([x, y], i) => (
        <div key={i} className="absolute text-accent" style={{ left: x, top: y }}>
          <Anim efecto="salta" en={merges + i * 0.09} dur={0.3}>
            <Icono name="git-merge" size={34} strokeWidth={2.5} ancla={false} />
          </Anim>
        </div>
      ))}
      <div className="absolute left-0 top-[326px] w-full text-center">
        <p className="font-display text-[76px] font-black leading-none text-accent [font-stretch:78%]">30.000</p>
        <p className="mt-1 text-[28px] font-bold">merges al día</p>
      </div>
    </Escena>
  );
}

// 2. La cifra, en barras a escala: 2.500 en mayo contra 30.000 en septiembre
// (330 px). La barra de septiembre crece con la voz y su número cuenta con ella.
const BASE = 410;
const ALTO_MAX = 300;

function LaCifra() {
  const t = useSegundos();
  const mayo = useCue("mayo");
  const septiembre = useCue("septiembre");
  const checkouts = useCue("checkouts");
  const altoMayo = interpolate(t, [mayo, mayo + 0.5], [0, (2500 / 30000) * ALTO_MAX], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const crece = interpolate(t, [septiembre, septiembre + 1.1], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const altoSept = Math.max(altoMayo, crece * ALTO_MAX);
  return (
    <Escena titulo="De 2.500 a 30.000" alto={470}>
      <div className="absolute left-0 h-[3px] w-full bg-bg/40" style={{ top: BASE }} />
      <div className="absolute left-[50px] w-[140px] rounded-t-xl bg-bg/55" style={{ top: BASE - altoMayo, height: altoMayo }} />
      <div className="absolute left-[50px] w-[140px]" style={{ top: BASE - altoMayo - 54 }}>
        <Anim efecto="aparece" en={mayo + 0.3} className="text-center font-display text-[40px] font-black [font-stretch:78%]">
          2.500
        </Anim>
      </div>
      <div className="absolute left-[278px] w-[140px] rounded-t-xl bg-accent" style={{ top: BASE - altoSept, height: altoSept }} />
      <div className="absolute left-[258px] w-[180px]" style={{ top: BASE - altoSept - 62 }}>
        <Anim efecto="aparece" en={septiembre} className="text-center font-display text-[48px] font-black text-accent [font-stretch:78%]">
          {miles(2500 + crece * 27500)}
        </Anim>
      </div>
      <p className="absolute left-[50px] w-[140px] text-center text-[24px] font-semibold opacity-80" style={{ top: BASE + 12 }}>
        Mayo
      </p>
      <p className="absolute left-[258px] w-[180px] text-center text-[24px] font-semibold opacity-80" style={{ top: BASE + 12 }}>
        Septiembre
      </p>
      <Anim efecto="sube" en={checkouts} className="absolute left-0 top-0 w-[220px] rounded-2xl bg-accent px-5 py-4 text-accent-ink">
        <p className="font-display text-[40px] font-black leading-none [font-stretch:78%]">25 millones</p>
        <p className="mt-1 text-[22px] font-semibold">checkouts diarios</p>
      </Anim>
    </Escena>
  );
}

// 3. El problema: Git copia todo el historial en cada máquina. El historial
// está arriba; con "máquina" baja una copia entera a cada laptop, y con
// "gigas" cada una carga sus 100 GB.
const LAPTOPS = [12, 180, 348] as const;

function ElProblema() {
  const nacio = useCue("2005");
  const historial = useCue("historial");
  const maquina = useCue("máquina");
  const gigas = useCue("gigas");
  return (
    <Escena titulo="Git nació para humanos" ancla={<Logo slug="git" size={56} />} alto={450}>
      <Anim efecto="salta" en={nacio} className="absolute left-0 top-0 rounded-xl bg-ink px-4 py-2 font-display text-[30px] font-black text-bg [font-stretch:78%]">
        2005
      </Anim>
      <Anim efecto="aparece" en={historial} className="absolute left-[150px] top-[10px] flex w-[168px] flex-col items-center rounded-2xl border-2 border-ink bg-surface px-4 py-3">
        <Icono name="history" size={52} strokeWidth={2} ancla={false} />
        <p className="mt-1 text-[22px] font-bold">Historial</p>
      </Anim>
      {LAPTOPS.map((x, i) => (
        <div key={x}>
          <Flecha de={[234, 132]} a={[x + 54, 236]} curva={(i - 1) * -0.15} mano grosor={4.5} anim={{ en: maquina + i * 0.25, dur: 0.5 }} />
          <div className="absolute top-[244px]" style={{ left: x }}>
            <Objeto nombre="laptop" size={108} anim={{ en: 0.2 + i * 0.15 }} />
          </div>
          <div className="absolute top-[320px]" style={{ left: x + 52 }}>
            <Objeto nombre="backpack" size={58} anim={{ en: maquina + 0.5 + i * 0.25 }} />
          </div>
          <div className="absolute top-[388px] w-[108px]" style={{ left: x }}>
            <Anim efecto="aparece" en={gigas + i * 0.12} className="text-center font-display text-[30px] font-black text-accent [font-stretch:78%]">
              100 GB
            </Anim>
          </div>
        </div>
      ))}
    </Escena>
  );
}

// 4. Nace Scion, en el campo del después: el agente siempre conectado al
// servidor, las 7 personas que lo construyeron y los 5 meses, uno por uno.
function NaceScion() {
  const t = useSegundos();
  const agente = useCue("agente");
  const descansa = useCue("descansa");
  const ingenieros = useCue("ingenieros");
  const meses = useCue("meses");
  const pulso = 1 + 0.06 * Math.sin(Math.max(0, t - descansa) * 6);
  return (
    <Escena titulo="Scion, en 5 meses" ancla={<Logo slug="anthropic" size={56} />} alto={450}>
      <div className="absolute left-0 top-0">
        <Objeto nombre="robot" size={104} anim={{ en: agente }} />
      </div>
      <div className="absolute left-[348px] top-[6px] text-accent-ink" style={{ transform: `scale(${pulso})` }}>
        <Icono name="server" size={96} strokeWidth={1.75} ancla={false} />
      </div>
      <div className="absolute left-[112px] top-[50px] h-[5px] w-[226px] origin-left rounded-full bg-accent-ink" data-anim="crece" style={animStyle({ en: descansa, dur: 0.6 })} />
      <Anim efecto="aparece" en={descansa + 0.4} className="absolute left-[112px] top-[64px] w-[226px] text-center text-[24px] font-semibold">
        siempre conectado
      </Anim>
      <div className="absolute left-0 top-[168px] flex w-full justify-between">
        {Array.from({ length: 7 }, (_, i) => (
          <Anim key={i} efecto="salta" en={ingenieros - 0.5 + i * 0.08} dur={0.3}>
            <Icono name="user-round" size={56} strokeWidth={2.25} ancla={false} />
          </Anim>
        ))}
      </div>
      <Anim efecto="aparece" en={ingenieros} className="absolute left-0 top-[232px] w-full text-center font-display text-[34px] font-black [font-stretch:78%]">
        7 ingenieros
      </Anim>
      <div className="absolute left-0 top-[320px] flex w-full justify-between">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-[56px] w-[84px] rounded-xl bg-accent-ink" data-anim="salta" style={animStyle({ en: meses - 0.3 + i * 0.12, dur: 0.3 })} />
        ))}
      </div>
      <Anim efecto="aparece" en={meses + 0.4} className="absolute left-0 top-[392px] w-full text-center font-display text-[34px] font-black [font-stretch:78%]">
        5 meses
      </Anim>
    </Escena>
  );
}

// 5. Cómo funciona, en dos campos: arriba Git clona todo; abajo Scion deja el
// historial en el servidor y le manda al agente un solo archivo. Con "nada" se
// tacha la clonación.
function ComoFunciona() {
  const t = useSegundos();
  const servidor = useCue("servidor");
  const exacto = useCue("exacto");
  const nada = useCue("nada");
  const viaje = interpolate(t, [exacto, exacto + 0.9], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  return (
    <Escena titulo="Solo el archivo exacto" alto={470}>
      <div className="absolute left-0 top-0 h-[210px] w-full rounded-3xl bg-surface" />
      <p className="absolute left-[24px] top-[18px] text-[24px] font-bold">Git: clona todo</p>
      <div className="absolute left-[28px] top-[74px]">
        <Icono name="database" size={84} strokeWidth={1.75} ancla={false} />
      </div>
      <div className="absolute left-[140px] top-[104px] h-[26px] w-[190px] rounded-full bg-muted/45" />
      <p className="absolute left-[140px] top-[136px] w-[190px] text-center font-display text-[28px] font-black text-muted [font-stretch:78%]">100 GB</p>
      <div className="absolute left-[350px] top-[66px]">
        <Objeto nombre="laptop" size={96} />
      </div>
      <div className="absolute left-[120px] top-[60px]">
        <Boceto ancho={230} alto={120} grosor={6} trazos={[{ d: "M6 6 L224 114", tono: "accent" }, { d: "M224 6 L6 114", tono: "accent" }]} anim={{ en: nada, dur: 0.25, paso: 0.15 }} />
      </div>

      <div className="absolute left-0 top-[232px] h-[238px] w-full rounded-3xl bg-accent" />
      <p className="absolute left-[24px] top-[250px] text-[24px] font-bold text-accent-ink">Scion: un archivo</p>
      <Anim efecto="salta" en={servidor} className="absolute left-[28px] top-[306px] text-accent-ink">
        <Icono name="server" size={90} strokeWidth={1.75} ancla={false} />
      </Anim>
      <div className="absolute left-[140px] top-[350px] w-[190px] border-t-[3px] border-dashed border-accent-ink/70" data-anim="crece" style={animStyle({ en: exacto - 0.4, dur: 0.4 })} />
      <div className="absolute top-[322px] text-accent-ink" style={{ left: 130 + viaje * 170, opacity: viaje > 0 ? 1 : 0 }}>
        <Icono name="file-code" size={52} strokeWidth={2} ancla={false} />
      </div>
      <div className="absolute left-[350px] top-[300px]">
        <Objeto nombre="robot" size={96} />
      </div>
    </Escena>
  );
}

// 6. Cierre: vuelve el antes y el después del gancho. Con "salva" se apaga
// Git; con "mándaselo", el gesto de enviar en el acento.
function Cierre() {
  const salva = useCue("salva");
  const mandaselo = useCue("mándaselo");
  return (
    <Escena titulo="Ni Git se salva" alto={450}>
      <Mitades alto={290} apaga={salva} />
      <div className="absolute left-[56px] top-[330px] flex items-center gap-5">
        <Anim efecto="salta" en={mandaselo} dur={0.45}>
          <Gesto accion="enviar" size={96} lleno className="text-accent" />
        </Anim>
        <Anim efecto="aparece" en={mandaselo + 0.3} className="font-display text-[36px] font-black leading-[1.02] text-accent [font-stretch:78%]">
          Mándaselo a tu equipo
        </Anim>
      </div>
    </Escena>
  );
}

export default defineVideo({
  music: { file: "audio/cama.mp3" },
  scenes: [
    { id: "gancho", sfx: [{ asset: "whoosh", at: "merges", volume: 0.3 }], Visual: Gancho },
    { id: "la-cifra", tone: "invert", sfx: [{ asset: "page-turn", at: "septiembre", volume: 0.45 }], Visual: LaCifra },
    { id: "el-problema", sfx: [{ asset: "whoosh", at: "humanos", volume: 0.25 }], Visual: ElProblema },
    { id: "nace-scion", tone: "accent", sfx: [{ asset: "page-turn", at: "ingenieros", volume: 0.45 }], Visual: NaceScion },
    { id: "como-funciona", sfx: [{ asset: "whoosh", at: "exacto", volume: 0.25 }], Visual: ComoFunciona },
    { id: "cierre", sfx: [{ asset: "page-turn", at: "mándaselo", volume: 0.4 }], Visual: Cierre },
  ],
});
