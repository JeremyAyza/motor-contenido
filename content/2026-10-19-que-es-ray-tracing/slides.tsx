import { Gesto, Logo, Nota, Slide } from "@motor/ui";

export default [
  // 1. Portada (Línea continua)
  <Slide swipe tone="base" className="justify-between">
    <div className="pt-2">
      <Logo slug="nvidia" size={140} />
    </div>
    <div className="relative pb-4">
      <h1 className="font-display text-[58px] font-black leading-[0.94] tracking-tight">
        No necesitas entender física óptica para entender Ray Tracing
      </h1>
      <svg className="mt-6 h-4 w-full" viewBox="0 0 460 16" fill="none">
        <path d="M0 8 H380 L400 2 L460 14" stroke="#76B900" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  </Slide>,

  // 2. La paradoja de la luz real
  <Slide tone="base">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      La paradoja de la luz real
    </h2>
    <p className="mt-5 text-[18px] leading-snug">
      Una bombilla emite billones de fotones. Si tu GPU intentara calcularlos todos, colapsaría.
    </p>
    <div className="mt-7 rounded-2xl bg-surface p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 text-[18px]">
        <span className="text-muted">Simulación real</span>
        <span className="font-bold">Billones de rayos</span>
      </div>
      <div className="flex items-center justify-between pt-1 text-[18px]">
        <span className="text-muted">Lo que ve tu ojo</span>
        <span className="font-bold text-accent">Menos del 0.01%</span>
      </div>
    </div>
  </Slide>,

  // 3. La analogía del láser inverso
  <Slide tone="surface">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      El láser en reversa
    </h2>
    <p className="mt-5 text-[18px] leading-snug">
      El ray tracing da vuelta la física: dispara rayos desde tu ojo hacia la escena 3D.
    </p>
    <div className="mt-7 rounded-2xl bg-bg p-6 space-y-3">
      <div className="text-[18px] font-bold text-accent">
        Cámara ➔ Objeto ➔ Luz
      </div>
      <p className="text-[18px] text-muted">
        Solo se calcula lo que impacta en tu pantalla.
      </p>
    </div>
  </Slide>,

  // 4. Rasterizado vs Ray Tracing
  <Slide tone="base">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      Pintor rápido vs física real
    </h2>
    <p className="mt-5 text-[18px] leading-snug">
      El rasterizado clásico es como un pintor veloz: proyecta triángulos planos y finge la sombra con texturas.
    </p>
    <div className="mt-7 rounded-2xl bg-surface p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 text-[18px]">
        <span className="text-muted">Rasterizado</span>
        <span className="font-bold">Ilusión 2D</span>
      </div>
      <div className="flex items-center justify-between pt-1 text-[18px]">
        <span className="text-muted">Ray Tracing</span>
        <span className="font-bold text-accent">Rebotes físicos</span>
      </div>
    </div>
  </Slide>,

  // 5. Los tres efectos clave
  <Slide tone="surface">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      Tres efectos que cambian todo
    </h2>
    <p className="mt-3 text-[18px] leading-snug text-muted">
      La física de rebotes calcula tres efectos clave:
    </p>
    <div className="mt-5 space-y-3 text-[18px]">
      <div className="rounded-xl bg-bg p-4">
        <span className="font-bold text-accent">Reflejos reales:</span> de cosas fuera de cámara.
      </div>
      <div className="rounded-xl bg-bg p-4">
        <span className="font-bold text-accent">Sombras suaves:</span> se difuminan con distancia.
      </div>
      <div className="rounded-xl bg-bg p-4">
        <span className="font-bold text-accent">Luz global:</span> rebotes tiñen superficies vecinas.
      </div>
    </div>
  </Slide>,

  // 6. Dónde se usa: Cine
  <Slide tone="base">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      Dónde se usa: Cine y animación
    </h2>
    <p className="mt-5 text-[18px] leading-snug">
      Películas como Toy Story o Avatar usan path tracing puro y offline en granjas de servidores masivas.
    </p>
    <div className="mt-7 rounded-2xl bg-surface p-6">
      <p className="text-[18px] font-bold text-accent">10 horas por fotograma</p>
      <p className="mt-2 text-[18px] text-muted">
        Miles de rayos por píxel para fotorrealismo absoluto.
      </p>
    </div>
  </Slide>,

  // 7. Dónde se usa: Videojuegos
  <Slide tone="surface">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      Dónde se usa: Videojuegos
    </h2>
    <p className="mt-5 text-[18px] leading-snug">
      En consolas y PC no hay horas: cada cuadro debe salir en 16 milisegundos (60 FPS).
    </p>
    <div className="mt-7 rounded-2xl bg-bg p-6 space-y-2">
      <p className="text-[18px] font-bold text-accent">Renderizado híbrido</p>
      <p className="text-[18px] text-muted">
        El rasterizado dibuja la base y los núcleos RT disparan rayos para reflejos.
      </p>
    </div>
  </Slide>,

  // 8. Resumen comparativo
  <Slide tone="base">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      Cine vs Videojuegos
    </h2>
    <div className="mt-6 rounded-2xl bg-surface p-6 space-y-5">
      <div className="border-b border-white/10 pb-4">
        <p className="text-[18px] font-bold text-accent">Cine (Offline)</p>
        <p className="mt-1 text-[18px] text-muted">Horas por cuadro · Miles de rayos</p>
      </div>
      <div>
        <p className="text-[18px] font-bold text-accent">Juegos (Tiempo real)</p>
        <p className="mt-1 text-[18px] text-muted">60 FPS · Híbrido con aceleración RT</p>
      </div>
    </div>
  </Slide>,

  // 9. Cierre con Gesto en el recurso
  <Slide tone="surface" className="justify-between">
    <div>
      <h2 className="font-display text-[32px] font-black leading-tight text-accent">
        La magia no está en dibujar mejores gráficos: está en simular las leyes de la física al revés.
      </h2>
      <p data-cta className="mt-6 text-[22px] font-bold leading-snug text-ink">
        Mándaselo al que dice que el ray tracing solo sirve para ver charcos con reflejos.
      </p>
    </div>

    <div className="my-auto flex items-center justify-center gap-4 py-4">
      <svg className="h-4 w-32" viewBox="0 0 120 16" fill="none">
        <path d="M0 8 H110" stroke="#76B900" strokeWidth="3" strokeDasharray="6 4" />
      </svg>
      <Gesto accion="enviar" size={52} lleno className="text-accent" />
    </div>

    <Nota className="mt-auto">
      Info al 18 de octubre de 2026 · Fuentes: nvidia.com y Turner Whitted (1980)
    </Nota>
  </Slide>,
];
