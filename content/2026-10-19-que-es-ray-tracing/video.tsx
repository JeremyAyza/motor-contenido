import type { ReactNode } from "react";
import { Anim, animStyle, Boceto, Etiqueta, Flecha, Gesto, Logo, Objeto } from "@motor/ui";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { defineVideo, SceneFrame, useCue } from "@motor/video";

/*
 * Piloto de la fase 2 del plan de videos (docs/plan-videos.md). Lo que dice la
 * voz está en video.json (puerta A aprobada el 20 de octubre de 2026); aquí va
 * lo que se ve. Los datos salen de facts.json. Medidas en px de diseño (540×960).
 *
 * La dirección de arte es la del carrusel de la pieza (post.json → art): línea
 * continua, fondo casi negro, Archivo y el verde de NVIDIA. El marco es el del
 * carrusel (pestaña ray-tracer.hlsl, puntos y firma), y los dibujos salen de sus
 * láminas, a todo el ancho (468 px). El rayo es la línea que cruza el video:
 * sale del ojo, choca y busca la lámpara, y al final termina en enviar.
 */

function Escena({ titulo, ancla, subrayado = false, alto, children }: { titulo: string; ancla?: ReactNode; subrayado?: boolean; alto: number; children: ReactNode }) {
  return (
    <SceneFrame title={titulo} anchor={ancla} underline={subrayado} height={alto}>
      {children}
    </SceneFrame>
  );
}

// 1. El gancho: el rayo sale del ojo hacia la lámpara, al revés de la luz, y
// abajo la tarjeta RTX que lo calcula. Todo se ve desde el cuadro 1, porque es
// la portada y la grilla la recorta; con la voz se suman el punto de partida,
// la línea de la tarjeta al rayo y el subrayado de RTX.
function Gancho() {
  const reves = useCue("revés");
  const explica = useCue("explica");
  const rtx = useCue("rtx");
  return (
    <Escena titulo="La luz, al revés" ancla={<Logo slug="nvidia" size={64} />} subrayado alto={430}>
      <div className="absolute left-0 top-[56px]">
        <Objeto nombre="eye" size={112} />
      </div>
      <div className="absolute left-[364px] top-0">
        <Objeto nombre="light-bulb" size={100} />
      </div>
      <Flecha de={[118, 110]} a={[358, 56]} curva={-0.1} mano grosor={5} />
      <svg viewBox="0 0 468 430" className="absolute inset-0 h-full w-full" fill="none">
        <circle cx="118" cy="110" r="10" className="fill-accent" data-anim="salta" style={animStyle({ en: reves, dur: 0.4 })} />
      </svg>
      <Flecha de={[196, 262]} a={[226, 100]} punteada className="text-muted" anim={{ en: explica }} />
      {/* Una tarjeta gráfica a mano: el cuerpo, dos ventiladores y la placa del puerto. */}
      <div className="absolute left-[20px] top-[270px]">
        <Boceto
          ancho={310}
          alto={150}
          grosor={3.5}
          trazos={[
            "M8 16 H292 V134 H8 Z",
            "M44 75 a36 36 0 1 0 72 0 a36 36 0 1 0 -72 0",
            "M164 75 a36 36 0 1 0 72 0 a36 36 0 1 0 -72 0",
            { d: "M302 4 V146", tono: "muted" },
          ]}
        />
      </div>
      <p className="absolute left-[352px] top-[306px] font-display text-[46px] font-black leading-none text-accent">RTX</p>
      <div className="absolute left-[350px] top-[358px]">
        <Boceto ancho={100} alto={14} trazos={[{ d: "M2 9 C 30 3, 66 13, 97 5", tono: "accent" }]} grosor={3.5} anim={{ en: rtx, dur: 0.4 }} />
      </div>
    </Escena>
  );
}

// 2. La lámpara tira luz para todos lados (como la lámina 2 del carrusel) y
// casi nada llega al ojo. Cuando la voz dice que el ray tracing parte del ojo,
// el rayo útil se dibuja al revés y los demás se apagan: nunca se calculan.
const FOCO = [120, 150] as const;
const OJO = [392, 318] as const;
const PERDIDOS = Array.from({ length: 24 }, (_, i) => {
  const rad = (((i * 360) / 24 + 4) * Math.PI) / 180;
  const [dx, dy] = [Math.cos(rad), Math.sin(rad)];
  const hasta = (lim: number, o: number, d: number) => (d > 0 ? (lim - o) / d : d < 0 ? -o / d : Infinity);
  const largo = Math.min(170 + (i % 4) * 26, hasta(468, FOCO[0], dx), hasta(420, FOCO[1], dy));
  return [FOCO[0] + dx * largo, FOCO[1] + dy * largo] as const;
}).filter(([x, y]) => Math.abs(Math.atan2(y - FOCO[1], x - FOCO[0]) - Math.atan2(OJO[1] - FOCO[1], OJO[0] - FOCO[0])) > 0.25);

function LuzAlReves() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lampara = useCue("lámpara");
  const lados = useCue("lados");
  const llega = useCue("llega");
  const parte = useCue("parte");
  const nunca = useCue("nunca");
  const apagados = interpolate(frame / fps, [nunca, nunca + 0.6], [0.6, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena titulo="Casi nada llega" alto={420}>
      <svg viewBox="0 0 468 420" className="absolute inset-0 h-full w-full" fill="none" strokeLinecap="round">
        <g style={{ opacity: apagados }}>
          {PERDIDOS.map(([x, y], i) => (
            <g key={i} data-anim="traza" style={animStyle({ en: lados + (i % 8) * 0.06, dur: 0.5 })}>
              <line x1={FOCO[0]} y1={FOCO[1]} x2={x} y2={y} className="stroke-muted" strokeWidth="2.5" />
            </g>
          ))}
        </g>
      </svg>
      <div className="absolute left-[64px] top-[94px]">
        <Objeto nombre="light-bulb" size={112} anim={{ en: lampara }} />
      </div>
      <div className="absolute left-[350px] top-[276px]">
        <Objeto nombre="eye" size={84} anim={{ en: llega }} />
      </div>
      <Flecha de={[352, 306]} a={[176, 184]} curva={-0.08} mano grosor={5} anim={{ en: parte, dur: 0.9 }} />
      <Etiqueta en={[262, 238]} hacia="arriba" largo={60} ancho={200} className="text-accent" anim={{ en: parte + 0.9 }}>
        solo calcula este
      </Etiqueta>
    </Escena>
  );
}

// 3. El rayo sale del ojo, choca y pregunta por la luz: la lámina 3 del
// carrusel, animada con la voz. Ojo en (32,175), esfera en (320,190) r 58,
// lámpara en (235,58); la pantalla tiene 8 píxeles y los rayos cruzan 3.
const CHOQUES = [
  { x: 290.6, y: 140, luz: true, pixel: 2 },
  { x: 262, y: 190, luz: true, pixel: 3 },
  { x: 290.6, y: 240, luz: false, pixel: 4 },
] as const;
const LUZ = [235, 58] as const;

function ElRayo() {
  const sale = useCue("sale");
  const choca = useCue("choca");
  const luz = useCue("luz");
  const sombra = useCue("sombra");
  return (
    <Escena titulo="Choca y pregunta" alto={330}>
      <svg viewBox="0 0 468 330" className="absolute inset-0 h-full w-full text-accent" fill="none" strokeLinecap="round">
        <defs>
          <radialGradient id="luz-esfera" cx="0.3" cy="0.15" r="0.9">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.55" />
            <stop offset="0.6" stopColor="currentColor" stopOpacity="0.08" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x="140" y={111 + i * 18} width="18" height="18" className="fill-surface stroke-muted" strokeWidth="1.5" strokeOpacity="0.6" />
        ))}
        {CHOQUES.map((c) => (
          <rect
            key={c.pixel}
            x="140"
            y={111 + c.pixel * 18}
            width="18"
            height="18"
            className={c.luz ? "fill-accent" : "fill-muted"}
            data-anim="salta"
            style={animStyle({ en: c.luz ? luz + 0.8 : sombra, dur: 0.4 })}
          />
        ))}
        <circle cx="320" cy="190" r="58" className="fill-surface stroke-muted" strokeWidth="2" />
        <circle cx="320" cy="190" r="58" fill="url(#luz-esfera)" data-anim="aparece" style={animStyle({ en: luz + 0.6, dur: 0.6 })} />
        {CHOQUES.map((c, i) => (
          <g key={i} data-anim="traza" style={animStyle({ en: sale + i * 0.3, dur: 0.7 })}>
            <path d={`M66 175 L${c.x} ${c.y}`} className="stroke-ink" strokeWidth="3" />
          </g>
        ))}
        {CHOQUES.filter((c) => c.luz).map((c, i) => (
          <g key={i} data-anim="traza" style={animStyle({ en: luz + i * 0.25, dur: 0.6 })}>
            <path d={`M${c.x} ${c.y} L${LUZ[0]} ${LUZ[1]}`} stroke="currentColor" strokeWidth="3" />
          </g>
        ))}
        {CHOQUES.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r="7" className={c.luz ? "fill-accent" : "fill-muted"} data-anim="salta" style={animStyle({ en: choca + i * 0.15, dur: 0.45 })} />
        ))}
      </svg>
      <div className="absolute left-0 top-[143px]">
        <Objeto nombre="eye" size={64} anim={{ en: 0.1 }} />
      </div>
      <div className="absolute left-[207px] top-0">
        <Objeto nombre="light-bulb" size={56} anim={{ en: 0.3 }} />
      </div>
      <Anim efecto="aparece" en={sale} className="absolute left-0 top-[222px] text-[22px] font-semibold text-muted">
        Sale del ojo
      </Anim>
      <Etiqueta en={[378, 190]} hacia="derecha" largo={12} anim={{ en: choca }}>
        Choca
      </Etiqueta>
      <Etiqueta en={[263, 99]} hacia="izquierda" largo={30} className="text-accent" anim={{ en: luz }}>
        ¿Le llega luz?
      </Etiqueta>
      <Etiqueta en={[290.6, 248]} hacia="abajo" largo={26} punto={false} className="text-muted" anim={{ en: sombra }}>
        Sombra
      </Etiqueta>
    </Escena>
  );
}

// 4. Pintar o calcular: las dos tarjetas de la lámina 4 del carrusel. El
// rasterizado tiene sus triángulos desde la primera palabra; con "fingen" se
// pinta la sombra pegada debajo y con "trucos" se rotula. El ray tracing se
// enciende con "escena": los rayos buscan la luz y la sombra cae donde toca.
function Rasterizado() {
  const pintan = useCue("pintan");
  const escena = useCue("escena");
  const fingen = useCue("fingen");
  const trucos = useCue("trucos");
  return (
    <Escena titulo="Pintar la luz o calcularla" alto={450}>
      <div className="grid h-full grid-cols-2 gap-4">
        <div className="flex flex-col rounded-2xl bg-bg p-5">
          <Objeto nombre="paintbrush" size={60} anim={{ en: pintan }} />
          <Boceto
            className="mt-3"
            ancho={186}
            alto={200}
            trazos={[
              { d: "M14 172 L80 40 L130 172 Z", relleno: true, tono: "muted" },
              { d: "M80 40 L176 72 L130 172 Z", relleno: true, tono: "muted" },
            ]}
            anim={{ en: 0.1, dur: 0.4, paso: 0.2 }}
          />
          <Boceto
            className="-mt-[16px]"
            ancho={186}
            alto={24}
            trazos={[{ d: "M36 12 a62 9 0 1 0 124 0 a62 9 0 1 0 -124 0", relleno: true, tono: "ink" }]}
            anim={{ en: fingen, dur: 0.5 }}
          />
          <p className="mt-auto text-[26px] font-bold">Rasterizado</p>
          <Anim efecto="aparece" en={trucos} className="mt-1 text-[24px] font-semibold text-muted">
            Truco
          </Anim>
        </div>
        <div className="relative flex flex-col rounded-2xl border-2 border-dashed border-muted bg-bg p-5">
          <div data-anim="aparece" style={animStyle({ en: escena, dur: 0.4 })} className="absolute -inset-[2px] rounded-2xl border-[3px] border-accent" />
          <Objeto nombre="light-bulb" size={60} anim={{ en: escena }} />
          <svg viewBox="0 0 186 224" className="relative mt-3 h-[224px] w-[186px] text-accent" fill="none" strokeLinecap="round">
            <g data-anim="aparece" style={animStyle({ en: escena, dur: 0.4 })}>
              <path d="M0 196 H186" className="stroke-muted" strokeWidth="2.5" />
              <circle cx="120" cy="140" r="36" className="fill-surface stroke-ink" strokeWidth="3" />
            </g>
            <g data-anim="traza" style={animStyle({ en: escena + 0.3, dur: 0.5 })}>
              <path d="M10 4 L96 114" stroke="currentColor" strokeWidth="3.5" />
            </g>
            <g data-anim="traza" style={animStyle({ en: escena + 0.6, dur: 0.5 })}>
              <path d="M10 4 L70 194" stroke="currentColor" strokeWidth="3.5" />
            </g>
            <ellipse cx="158" cy="198" rx="36" ry="7" className="fill-ink" fillOpacity="0.55" data-anim="aparece" style={animStyle({ en: escena + 1.0, dur: 0.4 })} />
          </svg>
          <p className="relative mt-auto text-[26px] font-bold text-accent">Ray tracing</p>
          <Anim efecto="aparece" en={escena + 1.2} className="relative mt-1 text-[24px] font-semibold text-accent">
            Sombra real
          </Anim>
        </div>
      </div>
    </Escena>
  );
}

// 5. El cine puede esperar horas; un juego, no. Los dos relojes están desde
// el principio. Con "horas" se da vuelta el reloj de arena y se dibuja, lento,
// un solo fotograma; con "decenas" salen muchos fotogramas chicos de golpe.
const FOTOGRAMAS = Array.from({ length: 24 }, (_, i) => ({ x: 4 + (i % 6) * 37, y: 214 + Math.floor(i / 6) * 28 }));

function CineOJuego() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pixar = useCue("pixar");
  const horas = useCue("horas");
  const fotograma = useCue("fotograma");
  const juego = useCue("juego");
  const decenas = useCue("decenas");
  const giro = interpolate(frame / fps, [horas, horas + 0.8], [0, 180], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <Escena titulo="Horas o un instante" alto={420}>
      <div className="absolute left-0 top-0 h-full w-[220px] rounded-2xl bg-surface" />
      <div className="absolute left-[244px] top-0 h-full w-[224px] rounded-2xl border-2 border-accent" />
      <div className="absolute left-[40px] top-[18px]" style={{ transform: `rotate(${giro}deg)` }}>
        <Objeto nombre="hourglass-done" size={140} anim={{ en: pixar }} />
      </div>
      <div className="absolute left-[50px] top-[214px]">
        <Boceto ancho={120} alto={80} grosor={3.5} trazos={["M4 4 H116 V76 H4 Z", { d: "M20 60 L48 30 L70 48 L96 22", tono: "muted" }]} anim={{ en: horas, dur: 2.4, paso: 0.6 }} />
      </div>
      <Anim efecto="aparece" en={fotograma} className="absolute left-0 top-[318px] w-[220px] text-center text-[26px] font-bold leading-tight">
        Cine: horas por fotograma
      </Anim>
      <div className="absolute left-[306px] top-[34px]">
        <Objeto nombre="stopwatch" size={100} anim={{ en: pixar + 0.4 }} />
      </div>
      <svg viewBox="0 0 224 420" className="absolute left-[244px] top-0 h-[420px] w-[224px] text-accent" fill="none">
        {FOTOGRAMAS.map((f, i) => (
          <rect key={i} x={f.x + 4} y={f.y - 60} width="28" height="20" rx="3" stroke="currentColor" strokeWidth="2.5" data-anim="salta" style={animStyle({ en: decenas + i * 0.03, dur: 0.25 })} />
        ))}
      </svg>
      <Anim efecto="aparece" en={juego} className="absolute left-[244px] top-[318px] w-[224px] text-center text-[26px] font-bold leading-tight text-accent">
        Juego: decenas por segundo
      </Anim>
    </Escena>
  );
}

// 6. Tu RTX suma las dos técnicas: las capas de la lámina 7 del carrusel.
// Abajo el rasterizado, arriba los núcleos RT. El reflejo es el rayo del
// video: sale del ojo, rebota en la capa RT y busca la lámpara.
function Hibrido() {
  const rasterizado = useCue("rasterizado");
  const nucleos = useCue("núcleos");
  const reflejos = useCue("reflejos");
  const rebota = useCue("rebota");
  return (
    <Escena titulo="Las dos, a la vez" alto={380}>
      <svg viewBox="0 0 468 380" className="absolute inset-0 h-full w-full text-accent" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g data-anim="sube" style={animStyle({ en: 0.1, dur: 0.5 })}>
          <path d="M20 275 L160 225 L300 275 L160 325 Z" className="fill-surface stroke-muted" strokeWidth="2" />
        </g>
        <g data-anim="aparece" style={animStyle({ en: rasterizado, dur: 0.5 })}>
          <path d="M100 282 L135 260 L168 288 Z M150 298 L190 272 L222 296 Z M120 265 L150 246 L178 266 Z" className="fill-muted" fillOpacity="0.6" />
        </g>
        <g data-anim="aparece" style={animStyle({ en: nucleos, dur: 0.5 })}>
          {[20, 300].map((x) => (
            <line key={x} x1={x} y1="165" x2={x} y2="275" className="stroke-muted" strokeWidth="2" strokeDasharray="5 6" />
          ))}
          <line x1="160" y1="215" x2="160" y2="325" className="stroke-muted" strokeWidth="2" strokeDasharray="5 6" />
          <path d="M20 165 L160 115 L300 165 L160 215 Z" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="3" />
        </g>
        <circle cx="170" cy="150" r="7" fill="currentColor" data-anim="salta" style={animStyle({ en: reflejos + 0.6, dur: 0.35 })} />
      </svg>
      <div className="absolute left-0 top-0">
        <Objeto nombre="eye" size={64} anim={{ en: 0.2 }} />
      </div>
      <div className="absolute left-[404px] top-0">
        <Objeto nombre="light-bulb" size={60} anim={{ en: 0.3 }} />
      </div>
      <Flecha de={[60, 50]} a={[166, 146]} mano grosor={4} anim={{ en: reflejos, dur: 0.6 }} />
      <Flecha de={[174, 146]} a={[400, 44]} mano grosor={4} anim={{ en: rebota, dur: 0.6 }} />
      <Etiqueta en={[300, 165]} hacia="derecha" largo={16} ancho={140} className="text-accent" anim={{ en: nucleos + 0.3 }}>
        Núcleos RT: reflejos
      </Etiqueta>
      <Etiqueta en={[300, 275]} hacia="derecha" largo={16} ancho={140} anim={{ en: rasterizado + 0.3 }}>
        Rasterizado: la escena
      </Etiqueta>
    </Escena>
  );
}

// 7. Cierre: vuelve la composición del gancho. El ojo, la esfera y la lámpara
// están desde la primera palabra; con la voz, el rayo sale del ojo, choca con
// la esfera y busca la lámpara. Después baja, como en la última lámina del
// carrusel, y termina en el gesto de enviar.
function Cierre() {
  const luz = useCue("luz");
  const reves = useCue("revés");
  const mandaselo = useCue("mándaselo");
  return (
    <Escena titulo="Es la luz, al revés" alto={440}>
      <div className="absolute left-0 top-[50px]">
        <Objeto nombre="eye" size={104} />
      </div>
      <div className="absolute left-[380px] top-0">
        <Objeto nombre="light-bulb" size={86} />
      </div>
      <svg viewBox="0 0 468 440" className="absolute inset-0 h-full w-full text-accent" fill="none">
        <circle cx="290" cy="120" r="48" className="fill-surface stroke-muted" strokeWidth="2.5" />
        <circle cx="254" cy="98" r="8" fill="currentColor" data-anim="salta" style={animStyle({ en: luz + 0.55, dur: 0.35 })} />
      </svg>
      <Flecha de={[110, 102]} a={[248, 98]} mano grosor={5} anim={{ en: luz, dur: 0.6 }} />
      <Flecha de={[260, 92]} a={[380, 54]} mano grosor={5} anim={{ en: reves, dur: 0.5 }} />
      <Flecha de={[290, 176]} a={[196, 318]} curva={0.3} mano grosor={4} punta="ninguna" anim={{ en: mandaselo - 0.2, dur: 0.5 }} />
      <div className="absolute left-[110px] top-[300px] flex items-center gap-5">
        <Anim efecto="salta" en={mandaselo + 0.2} dur={0.45}>
          <Gesto accion="enviar" size={104} lleno className="text-accent" />
        </Anim>
        <Anim efecto="aparece" en={mandaselo + 0.45} className="font-display text-[34px] font-black text-accent">
          Mándaselo
        </Anim>
      </div>
    </Escena>
  );
}

export default defineVideo({
  music: { file: "audio/cama.mp3" },
  scenes: [
    { id: "gancho", sfx: [{ asset: "whoosh", at: "luz", volume: 0.3 }], Visual: Gancho },
    { id: "luz-al-reves", tone: "surface", sfx: [{ asset: "page-turn", at: "parte", volume: 0.45 }], Visual: LuzAlReves },
    { id: "el-rayo", sfx: [{ asset: "whoosh", at: "sale", volume: 0.25 }], Visual: ElRayo },
    { id: "rasterizado", tone: "surface", sfx: [{ asset: "page-turn", at: "pintan", volume: 0.45 }], Visual: Rasterizado },
    { id: "cine-o-juego", sfx: [{ asset: "whoosh", at: "decenas", volume: 0.25 }], Visual: CineOJuego },
    { id: "hibrido", tone: "surface", sfx: [{ asset: "page-turn", at: "núcleos", volume: 0.4 }], Visual: Hibrido },
    { id: "cierre", sfx: [{ asset: "whoosh", at: "luz", volume: 0.3 }], Visual: Cierre },
  ],
});
