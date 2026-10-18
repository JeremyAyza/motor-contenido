import { Logo, Nota, Slide } from "@motor/ui";

// Dirección de arte base: ficha-tecnica.
// Tipografía Archivo para titulares rotundos y Geist para estructura tabular.
// Paleta en papel limpio con verde oscuro oficial de Django (#0C4B33).

export default [
  // 1. Portada: Gancho y logo oficial de Django
  <Slide swipe tone="base" className="justify-between">
    <div>
      <div data-ui className="inline-block rounded-md bg-accent px-3.5 py-1.5 font-mono text-[13px] font-bold text-accent-ink">
        Arquitectura de backend
      </div>
      <h1 className="mt-4 font-display text-[48px] font-black leading-[0.98] tracking-[-0.03em] text-ink">
        No necesitas 10 librerías para lanzar tu backend
      </h1>
    </div>

    <div className="my-auto flex items-center justify-center py-4">
      <Logo slug="django" chip size={110} />
    </div>

    <div data-ui className="rounded-xl bg-surface p-4 border border-ink/10 text-center">
      <p className="font-display text-[17px] font-bold text-ink">
        Por qué los seniores siguen eligiendo el monolito de Django
      </p>
    </div>
  </Slide>,

  // 2. La trampa del stack fragmentado
  <Slide tone="surface" className="justify-between">
    <div>
      <div data-ui className="inline-block rounded-md bg-accent/20 px-3 py-1 font-mono text-[13px] font-semibold text-accent">
        El costo oculto
      </div>
      <h2 className="mt-3 font-display text-[42px] font-black leading-[1.0] tracking-[-0.02em] text-ink">
        La trampa del stack fragmentado
      </h2>
      <p className="mt-2 text-[17px] leading-snug text-muted">
        Armar un backend moderno desde cero suele retrasar el lanzamiento del producto semanas enteras.
      </p>
    </div>

    <div data-ui className="my-auto flex flex-col gap-3">
      <div className="rounded-xl bg-bg p-4 border-l-4 border-rose-600">
        <span className="font-display font-bold text-[17px] text-rose-800">Stack de 10 paquetes:</span>
        <p className="mt-1 text-[16px] text-ink">Días perdidos configurando auth y migraciones.</p>
      </div>
      <div className="rounded-xl bg-bg p-4 border-l-4 border-accent">
        <span className="font-display font-bold text-[17px] text-accent">Monolito de Django:</span>
        <p className="mt-1 text-[16px] text-ink">Todo listo de fábrica. Empiezas a programar la lógica del negocio desde el minuto cero.</p>
      </div>
    </div>

    <Nota>En un MVP la velocidad de validación importa más que la supuesta pureza técnica.</Nota>
  </Slide>,

  // 3. Ficha técnica de las 4 baterías
  <Slide tone="base" className="justify-between">
    <div>
      <div data-ui className="inline-block rounded-md bg-accent/20 px-3 py-1 font-mono text-[13px] font-semibold text-accent">
        Ficha técnica
      </div>
      <h2 className="mt-3 font-display text-[42px] font-black leading-[1.0] tracking-[-0.02em] text-ink">
        4 baterías que nadie debería reinventar
      </h2>
    </div>

    <div data-ui className="my-auto flex flex-col gap-2 rounded-2xl bg-surface p-4 border border-ink/10">
      <div className="flex justify-between items-center py-2 border-b border-ink/10">
        <span className="font-display font-bold text-[16px] text-ink">1. Autenticación</span>
        <span className="font-mono text-[14px] text-accent font-semibold">Nativo (sesión y permisos)</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-ink/10">
        <span className="font-display font-bold text-[16px] text-ink">2. Panel Admin</span>
        <span className="font-mono text-[14px] text-accent font-semibold">Autogenerado en 2 líneas</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-ink/10">
        <span className="font-display font-bold text-[16px] text-ink">3. ORM y migraciones</span>
        <span className="font-mono text-[14px] text-accent font-semibold">Validado y consistente</span>
      </div>
      <div className="flex justify-between items-center py-2">
        <span className="font-display font-bold text-[16px] text-ink">4. Seguridad</span>
        <span className="font-mono text-[14px] text-accent font-semibold">CSRF y SQLi activo</span>
      </div>
    </div>

    <Nota>El panel de administración te ahorra programar herramientas internas.</Nota>
  </Slide>,

  // 4. El mito: Django en 2026
  <Slide tone="surface" className="justify-between">
    <div>
      <div data-ui className="inline-block rounded-md bg-accent/20 px-3 py-1 font-mono text-[13px] font-semibold text-accent">
        Evolución
      </div>
      <h2 className="mt-3 font-display text-[42px] font-black leading-[1.0] tracking-[-0.02em] text-ink">
        Django es moderno y asíncrono
      </h2>
      <p className="mt-2 text-[17px] leading-snug text-muted">
        El mito de que es lento o anticuado quedó atrás con Django 5.
      </p>
    </div>

    <div data-ui className="my-auto flex flex-col gap-3">
      <div className="rounded-xl bg-bg p-4 border border-ink/10">
        <span className="font-display font-bold text-[17px] text-ink">Soporte ASGI asíncrono</span>
        <p className="mt-1 text-[16px] text-muted">WebSockets en tiempo real sin salir del framework.</p>
      </div>
      <div className="rounded-xl bg-bg p-4 border border-ink/10">
        <span className="font-display font-bold text-[17px] text-ink">Django Ninja para APIs</span>
        <p className="mt-1 text-[16px] text-muted">Validación con tipos Pydantic y documentación OpenAPI automática sin perder el panel de control.</p>
      </div>
    </div>

    <Nota>Obtienes la velocidad de FastAPI sin perder el admin ni el ORM.</Nota>
  </Slide>,

  // 5. Casos masivos reales
  <Slide tone="base" className="justify-between">
    <div>
      <h2 className="font-display text-[42px] font-black leading-[1.0] tracking-[-0.02em] text-ink">
        Prueba de escala real
      </h2>
      <p className="mt-2 text-[17px] leading-snug text-muted">
        Los gigantes del software crecieron primero sobre un monolito antes de partir servicios.
      </p>
    </div>

    <div data-ui className="my-auto flex flex-col gap-3">
      <div className="rounded-xl bg-surface p-4 border-l-4 border-accent">
        <span className="font-display font-bold text-[18px] text-ink">Instagram</span>
        <p className="mt-1 text-[16px] text-muted">Cientos de millones de usuarios activos sobre este monolito.</p>
      </div>
      <div className="rounded-xl bg-surface p-4 border-l-4 border-accent">
        <span className="font-display font-bold text-[18px] text-ink">Sentry</span>
        <p className="mt-1 text-[16px] text-muted">Miles de millones de eventos diarios procesados con su núcleo en Python.</p>
      </div>
    </div>

    <Nota>Si a ellos les alcanzó para llegar a millones de usuarios, a tu proyecto le sobra.</Nota>
  </Slide>,

  // 6. Cierre: Despedida + CTA específico
  <Slide tone="surface" className="justify-between text-center items-center">
    <div className="pt-2">
      <div className="inline-flex items-center justify-center">
        <Logo slug="django" chip size={64} />
      </div>
      <h2 className="mt-5 font-display text-[30px] font-black leading-[1.08] tracking-[-0.02em] text-ink">
        Cero paquetes extra para tener auth, base de datos y panel admin funcionando.
      </h2>
    </div>

    <div className="w-full my-auto px-2">
      <p
        data-cta
        className="rounded-2xl bg-bg p-5 font-display text-[19px] font-bold leading-snug text-accent border border-accent/20"
      >
        Mándaselo a ese dev que dice que Django es un framework viejo del 2010.
      </p>
    </div>

    <Nota className="pb-1">
      Información al 18 de octubre de 2026. Fuente: djangoproject.com.
    </Nota>
  </Slide>,
];
