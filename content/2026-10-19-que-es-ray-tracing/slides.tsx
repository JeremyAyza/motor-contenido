import { Anim, animStyle, Boceto, Cifra, Etiqueta, Flecha, Gesto, Logo, Matriz, Nota, Objeto, Slide } from "@motor/ui";

// Lámina 2: rayos que salen de la bombilla en todas direcciones, cortados en el borde del dibujo.
const FOCO = [130, 170] as const;
const OJO = [356, 226] as const;
const rayosPerdidos = Array.from({ length: 22 }, (_, i) => {
  const angulo = (i * 360) / 22 + 4;
  const rad = (angulo * Math.PI) / 180;
  const [dx, dy] = [Math.cos(rad), Math.sin(rad)];
  const hasta = (lim: number, o: number, d: number) => (d > 0 ? (lim - o) / d : d < 0 ? -o / d : Infinity);
  const largo = Math.min(150 + (i % 4) * 22, hasta(468, FOCO[0], dx), hasta(330, FOCO[1], dy));
  return [FOCO[0] + dx * largo, FOCO[1] + dy * largo] as const;
}).filter(([x, y]) => Math.abs(Math.atan2(y - FOCO[1], x - FOCO[0]) - Math.atan2(OJO[1] - FOCO[1], OJO[0] - FOCO[0])) > 0.25);

// Lámina 3: del ojo (66,175) a tres puntos de una esfera (centro 320,190; radio 58). La luz está en (235,58).
const CHOQUES = [
  { x: 290.6, y: 140, en: 0.4, luz: true },
  { x: 262, y: 190, en: 0.7, luz: true },
  { x: 290.6, y: 240, en: 1.0, luz: false },
] as const;
const LUZ = [235, 58] as const;

// Lámina 6: dos canchas de fútbol a mano.
const cancha = (x: number) => [
  `M${x + 2} 4 H${x + 230} V146 H${x + 2} Z`,
  `M${x + 116} 4 V146`,
  `M${x + 94} 75 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0`,
  `M${x + 2} 42 H${x + 36} V108 H${x + 2}`,
  `M${x + 230} 42 H${x + 196} V108 H${x + 230}`,
];

export default [
  // 1. Portada
  <Slide swipe tone="base" className="justify-between">
    <div className="pt-2">
      <Logo slug="nvidia" size={140} />
    </div>
    <div className="pb-2">
      <h1 className="font-display text-[58px] font-black leading-[0.94] tracking-tight">
        No necesitas entender física óptica para entender Ray Tracing
      </h1>
      <svg viewBox="0 0 468 40" className="mt-6 w-full overflow-visible" fill="none">
        <path d="M0 32 H330 L380 8 L468 36" className="stroke-accent" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="380" cy="8" r="7" className="fill-accent" />
      </svg>
    </div>
  </Slide>,

  // 2. La paradoja: casi ningún rayo de la bombilla llega al ojo
  <Slide tone="surface">
    <h2 className="font-display text-[34px] font-black leading-[1.05]">Seguir la luz real sería trabajo perdido</h2>
    <div className="relative mt-4 h-[330px]">
      <svg viewBox="0 0 468 330" className="absolute inset-0 h-full w-full" fill="none" strokeLinecap="round">
        {rayosPerdidos.map(([x, y], i) => (
          <line key={i} x1={FOCO[0]} y1={FOCO[1]} x2={x} y2={y} className="stroke-muted" strokeOpacity="0.5" strokeWidth="2" />
        ))}
        <line x1={FOCO[0]} y1={FOCO[1]} x2={OJO[0]} y2={OJO[1]} className="stroke-accent" strokeWidth="4" />
      </svg>
      <div className="absolute left-[82px] top-[122px]">
        <Objeto nombre="light-bulb" size={96} />
      </div>
      <div className="absolute left-[356px] top-[196px]">
        <Objeto nombre="eye" size={72} />
      </div>
      <Etiqueta en={[392, 270]} hacia="abajo" largo={14} className="text-accent">
        el único que ves
      </Etiqueta>
    </div>
    <p className="mt-auto text-[18px] leading-snug">
      Una bombilla dispara miles de millones de rayos y casi ninguno entra en tu ojo. Calcularlos todos sería tirar trabajo.
    </p>
  </Slide>,

  // 3. El rayo en reversa (animada)
  <Slide tone="base">
    <h2 className="font-display text-[34px] font-black leading-[1.05]">El rayo sale de tu ojo, no de la lámpara</h2>
    <div className="relative mt-4 h-[340px]">
      <svg viewBox="0 0 468 340" className="absolute inset-0 h-full w-full text-accent" fill="none" strokeLinecap="round">
        <defs>
          <radialGradient id="luz-esfera" cx="0.3" cy="0.15" r="0.9">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.55" />
            <stop offset="0.6" stopColor="currentColor" stopOpacity="0.08" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* La pantalla: 8 píxeles; los rayos cruzan el 3, el 4 y el 5 */}
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x="140" y={111 + i * 18} width="18" height="18" className="fill-surface stroke-muted" strokeWidth="1.5" strokeOpacity="0.6" />
        ))}
        <rect x="140" y={111 + 2 * 18} width="18" height="18" className="fill-accent" data-anim="salta" style={animStyle({ en: 3.1, dur: 0.4 })} />
        <rect x="140" y={111 + 3 * 18} width="18" height="18" className="fill-accent" data-anim="salta" style={animStyle({ en: 3.25, dur: 0.4 })} />
        <rect x="140" y={111 + 4 * 18} width="18" height="18" className="fill-muted" data-anim="salta" style={animStyle({ en: 3.0, dur: 0.4 })} />

        {/* La esfera y la luz que le llega */}
        <circle cx="320" cy="190" r="58" className="fill-surface stroke-muted" strokeWidth="2" />
        <circle cx="320" cy="190" r="58" fill="url(#luz-esfera)" data-anim="aparece" style={animStyle({ en: 2.9, dur: 0.6 })} />

        {/* Rayos de cámara */}
        {CHOQUES.map((c, i) => (
          <g key={i} data-anim="traza" style={animStyle({ en: c.en, dur: 0.8 })}>
            <path d={`M66 175 L${c.x} ${c.y}`} className="stroke-ink" strokeWidth="3" />
          </g>
        ))}
        {/* Rayos de sombra: los dos de arriba ven la luz; el de abajo, no */}
        {CHOQUES.filter((c) => c.luz).map((c, i) => (
          <g key={i} data-anim="traza" style={animStyle({ en: 2.2 + i * 0.25, dur: 0.6 })}>
            <path d={`M${c.x} ${c.y} L${LUZ[0]} ${LUZ[1]}`} className="stroke-accent" strokeWidth="2.5" />
          </g>
        ))}
        {CHOQUES.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r="7" className={c.luz ? "fill-accent" : "fill-muted"} data-anim="salta" style={animStyle({ en: c.en + 0.8, dur: 0.45 })} />
        ))}
      </svg>

      <div className="absolute left-0 top-[143px]">
        <Objeto nombre="eye" size={64} />
      </div>
      <div className="absolute left-[207px] top-0">
        <Objeto nombre="light-bulb" size={56} />
      </div>
      <Anim efecto="aparece" en={0.2} className="absolute left-0 top-[214px] text-[16px] font-semibold text-muted">
        1. Sale del ojo
      </Anim>
      <Etiqueta en={[374, 170]} hacia="derecha" largo={12} anim={{ en: 1.6 }}>
        2. Choca
      </Etiqueta>
      <Etiqueta en={[263, 99]} hacia="izquierda" largo={30} className="text-accent" anim={{ en: 2.3 }}>
        3. ¿Le llega luz?
      </Etiqueta>
      <Etiqueta en={[290.6, 248]} hacia="abajo" largo={20} punto={false} className="text-muted" anim={{ en: 2.7 }}>
        Sombra
      </Etiqueta>
    </div>
    <p className="mt-auto text-[18px] leading-snug">Cada rayo sale de la cámara y, al chocar, pregunta si le llega luz.</p>
    <Nota className="mt-2">Esquema ilustrativo, sin escala.</Nota>
  </Slide>,

  // 4. Pintar la luz o calcularla
  <Slide tone="surface">
    <h2 className="font-display text-[34px] font-black leading-[1.05]">Pintar la luz o calcularla</h2>
    <div className="mt-5 grid min-h-0 flex-1 grid-cols-2 gap-4">
      <div className="flex flex-col rounded-2xl bg-bg p-5">
        <Objeto nombre="paintbrush" size={56} />
        <Boceto
          className="mt-2"
          ancho={186}
          alto={200}
          trazos={[
            { d: "M14 172 L80 40 L130 172 Z", relleno: true, tono: "muted" },
            { d: "M80 40 L176 72 L130 172 Z", relleno: true, tono: "muted" },
            { d: "M36 186 a62 9 0 1 0 124 0 a62 9 0 1 0 -124 0", relleno: true, tono: "ink" },
          ]}
        />
        <p className="mt-auto text-[20px] font-bold">Rasterizado</p>
        <p className="mt-1 text-[16px] leading-snug text-muted">Pinta triángulos y finge la sombra con texturas.</p>
      </div>
      <div className="flex flex-col rounded-2xl border-2 border-accent bg-bg p-5">
        <Objeto nombre="light-bulb" size={56} />
        <Boceto
          className="mt-2"
          ancho={186}
          alto={200}
          trazos={[
            { d: "M10 8 L95 108", tono: "accent" },
            { d: "M10 8 L56 184", tono: "accent" },
            { d: "M86 130 a34 34 0 1 0 68 0 a34 34 0 1 0 -68 0", tono: "ink" },
            { d: "M124 186 a40 7 0 1 0 80 0 a40 7 0 1 0 -80 0", relleno: true, tono: "muted" },
            { d: "M0 186 H186", tono: "muted" },
          ]}
        />
        <p className="mt-auto text-[20px] font-bold text-accent">Ray tracing</p>
        <p className="mt-1 text-[16px] leading-snug text-muted">Sigue cada rayo y calcula de dónde viene la luz.</p>
      </div>
    </div>
  </Slide>,

  // 5. Tres efectos que ya no se fingen
  <Slide tone="base">
    <h2 className="font-display text-[34px] font-black leading-[1.05]">Tres efectos que ya no se fingen</h2>
    <div className="relative mt-3 h-[330px]">
      <svg viewBox="0 0 468 330" className="absolute inset-0 h-full w-full text-accent" fill="none" strokeLinecap="round">
        <defs>
          <clipPath id="vidrio">
            <circle cx="234" cy="190" r="58" />
          </clipPath>
          <clipPath id="bajo-el-piso">
            <rect x="0" y="252" width="468" height="78" />
          </clipPath>
          <radialGradient id="sombra" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#000" stopOpacity="0.95" />
            <stop offset="0.55" stopColor="#000" stopOpacity="0.55" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* La pared rayada detrás de la esfera */}
        {[150, 178, 206, 234, 262, 290, 318].map((x) => (
          <line key={x} x1={x} y1="118" x2={x} y2="250" className="stroke-muted" strokeOpacity="0.45" strokeWidth="3" />
        ))}
        {/* El piso y el reflejo de la esfera */}
        <rect x="0" y="250" width="468" height="80" className="fill-surface" />
        <line x1="0" y1="250" x2="468" y2="250" className="stroke-muted" strokeWidth="2" />
        <g clipPath="url(#bajo-el-piso)">
          <circle cx="234" cy="310" r="58" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.45" strokeWidth="2" />
        </g>
        {/* La sombra, del lado contrario a la luz */}
        <ellipse cx="294" cy="254" rx="74" ry="13" fill="url(#sombra)" />
        {/* La esfera de vidrio: adentro, las rayas de la pared se doblan */}
        <circle cx="234" cy="190" r="58" className="fill-bg" />
        <g clipPath="url(#vidrio)">
          {[150, 178, 206, 234, 262, 290, 318].map((x) => (
            <path key={x} d={`M${x} 118 Q${x + (x - 234) * 0.6} 190 ${x} 262`} stroke="currentColor" strokeOpacity="0.85" strokeWidth="3" />
          ))}
        </g>
        <circle cx="234" cy="190" r="58" className="stroke-ink" strokeWidth="2.5" />
        <path d="M200 160 a40 40 0 0 1 22 -20" className="stroke-ink" strokeWidth="4" strokeOpacity="0.8" />
      </svg>
      <div className="absolute left-[30px] top-0">
        <Objeto nombre="light-bulb" size={52} />
      </div>
      <Etiqueta en={[234, 132]} hacia="arriba" largo={22}>
        Refracción en el vidrio
      </Etiqueta>
      <Etiqueta en={[205, 296]} hacia="izquierda" largo={50} ancho={112}>
        Reflejo en el piso
      </Etiqueta>
      <Etiqueta en={[352, 254]} hacia="derecha" largo={18} ancho={96}>
        Sombra según la luz
      </Etiqueta>
    </div>
    <p className="mt-auto text-[18px] leading-snug">Whitted los calculó con rayos en 1980; el rasterizado necesita un truco para cada uno.</p>
  </Slide>,

  // 6. En el cine, un cuadro tarda horas
  <Slide tone="surface">
    <h2 className="font-display text-[34px] font-black leading-[1.05]">En el cine, un cuadro tarda horas</h2>
    <p className="mt-3 text-[18px] leading-snug">Si los 16.7 ms de un cuadro de juego midieran 1 mm, una sola hora de render mediría:</p>
    <Cifra className="mt-4" valor={216} unidad="m" tamano={96} unidadTamano={34} texto="Unas dos canchas de fútbol." />
    <Boceto className="mt-5" ancho={468} alto={150} trazos={[...cancha(0), ...cancha(236)].map((d) => ({ d, tono: "accent" as const }))} />
    <Nota className="mt-auto">
      Cálculo propio: 1 h ÷ 16.7 ms = 216,000 cuadros. El cine renderiza offline y un cuadro puede tardar varias horas (Pixar RenderMan).
    </Nota>
  </Slide>,

  // 7. Los juegos mezclan las dos técnicas
  <Slide tone="base">
    <h2 className="font-display text-[34px] font-black leading-[1.05]">Los juegos mezclan las dos técnicas</h2>
    <div className="relative mt-4 h-[300px]">
      <svg viewBox="0 0 468 300" className="absolute inset-0 h-full w-full text-accent" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {[20, 300].map((x) => (
          <line key={x} x1={x} y1="105" x2={x} y2="215" className="stroke-muted" strokeWidth="2" strokeDasharray="5 6" />
        ))}
        <line x1="160" y1="155" x2="160" y2="265" className="stroke-muted" strokeWidth="2" strokeDasharray="5 6" />
        {/* Abajo: el rasterizado dibuja la escena */}
        <path d="M20 215 L160 165 L300 215 L160 265 Z" className="fill-surface stroke-muted" strokeWidth="2" />
        <path d="M100 222 L135 200 L168 228 Z M150 238 L190 212 L222 236 Z M120 205 L150 186 L178 206 Z" className="fill-muted" fillOpacity="0.55" />
        {/* Arriba: los núcleos RT suman los rayos */}
        <path d="M20 105 L160 55 L300 105 L160 155 Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2.5" />
        <path d="M70 105 L190 78 M96 122 L226 96 M130 136 L250 110" stroke="currentColor" strokeWidth="2.5" />
        {[
          [190, 78],
          [226, 96],
          [250, 110],
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="5" fill="currentColor" />
        ))}
      </svg>
      <Etiqueta en={[300, 105]} hacia="derecha" largo={18} ancho={140} className="text-accent">
        Núcleos RT: reflejos y luz global
      </Etiqueta>
      <Etiqueta en={[300, 215]} hacia="derecha" largo={18} ancho={140}>
        Rasterizado: la geometría de la escena
      </Etiqueta>
    </div>
    <p className="mt-auto text-[18px] leading-snug">El rasterizado pone la geometría y los núcleos RT suman los rayos, en tiempo real.</p>
  </Slide>,

  // 8. Resumen: velocidad contra realismo
  <Slide tone="surface">
    <h2 className="font-display text-[34px] font-black leading-[1.05]">Velocidad contra realismo</h2>
    <Matriz
      className="mt-5"
      alto={340}
      ejeX={["Menos realista", "Más realista"]}
      ejeY={["Lento", "Rápido"]}
      puntos={[
        { x: 0.14, y: 0.86, etiqueta: "Rasterizado" },
        { x: 0.52, y: 0.62, etiqueta: "Juegos híbridos", destacado: true },
        { x: 0.9, y: 0.1, etiqueta: "Cine" },
      ]}
    />
    <Nota className="mt-auto">Esquema cualitativo: ubica cada técnica, no la mide.</Nota>
  </Slide>,

  // 9. Cierre: el rayo termina en el gesto de enviar
  <Slide tone="base" className="justify-between">
    <div>
      <h2 className="font-display text-[32px] font-black leading-[1.08]">
        La magia no está en dibujar mejores gráficos: está en simular las leyes de la física al revés.
      </h2>
      <p data-cta className="mt-6 text-[22px] font-bold leading-snug text-accent">
        Mándaselo al que dice que el ray tracing solo sirve para ver charcos con reflejos.
      </p>
    </div>
    <div className="relative h-[140px]">
      <Flecha de={[0, 24]} a={[318, 92]} curva={-0.25} mano grosor={3.5} punta="ninguna" />
      <div className="absolute left-[318px] top-[50px]">
        <Gesto accion="enviar" size={84} lleno className="text-accent" />
      </div>
    </div>
    <Nota>Info al 18 de octubre de 2026 · Fuentes: nvidia.com, Microsoft DirectX, Pixar RenderMan y Turner Whitted (1980)</Nota>
  </Slide>,
];
