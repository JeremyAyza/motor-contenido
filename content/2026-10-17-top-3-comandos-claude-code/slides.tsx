import { Code, Gesto, Logo, Nota, Slide, Window } from "@motor/ui";

// Dirección de arte base: capa-por-capa.
// Paleta oscura con acento coral oficial de Claude Code (#D97757).
// Las láminas alternan entre tono base y surface para marcar el ritmo de capas.

export default [
  // 1. Portada: Gancho aprobado con el logo de Claude Code y las 3 capas.
  <Slide swipe tone="base" className="justify-between pb-2">
    <div>
      <h1 className="font-display text-[54px] font-black leading-[0.95] tracking-[-0.03em] text-ink">
        Deja de tratar a Claude Code como chat
      </h1>
      <p className="mt-4 text-[20px] font-medium text-accent">
        3 comandos clave
      </p>
    </div>

    <div className="my-auto flex items-center justify-center py-4">
      <Logo slug="claudecode" size={144} />
    </div>

    <div data-ui className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between rounded-xl bg-surface px-5 py-3 text-[17px] font-semibold text-ink">
        <span>Capa 1: Memoria persistente</span>
        <code data-mono-ok className="font-mono text-accent">/init</code>
      </div>
      <div className="flex items-center justify-between rounded-xl bg-surface px-5 py-3 text-[17px] font-semibold text-ink">
        <span>Capa 2: Ventana de contexto</span>
        <code data-mono-ok className="font-mono text-accent">/compact</code>
      </div>
      <div className="flex items-center justify-between rounded-xl bg-surface px-5 py-3 text-[17px] font-semibold text-ink">
        <span>Capa 3: Monitoreo de costo</span>
        <code data-mono-ok className="font-mono text-accent">/cost</code>
      </div>
    </div>
  </Slide>,

  // 2. Capa 1: /init crea CLAUDE.md
  <Slide tone="surface" className="justify-between">
    <div>
      <div data-ui className="inline-block rounded-md bg-accent/20 px-3 py-1 font-mono text-[14px] font-semibold text-accent">
        Capa 1: Memoria
      </div>
      <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.0] tracking-[-0.02em] text-ink">
        /init crea la memoria de tu proyecto
      </h2>
      <p className="mt-4 text-[18px] leading-snug text-muted">
        Analiza tu repositorio y genera CLAUDE.md para que el agente recuerde arquitectura y comandos en cada sesión.
      </p>
    </div>

    <Window title="terminal: claude">
      <Code lang="bash">
{`$ claude
> /init
Scanning repository structure...
✓ Found Next.js, TypeScript, Tailwind
✓ Created CLAUDE.md with build & test rules`}
      </Code>
    </Window>

    <Nota>CLAUDE.md se lee automáticamente al iniciar cada conversación.</Nota>
  </Slide>,

  // 3. Capa 2: /compact libera contexto
  <Slide tone="base" className="justify-between">
    <div>
      <div data-ui className="inline-block rounded-md bg-accent/20 px-3 py-1 font-mono text-[14px] font-semibold text-accent">
        Capa 2: Contexto
      </div>
      <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.0] tracking-[-0.02em] text-ink">
        /compact libera contexto sin reiniciar
      </h2>
      <p className="mt-4 text-[18px] leading-snug text-muted">
        Resume la conversación previa para no perder el hilo de trabajo y acepta instrucciones de qué conservar.
      </p>
    </div>

    <Window title="terminal: claude">
      <Code lang="bash">
{`> /compact conserva el plan y tests fallidos
Compressing session history...
✓ Cached prefix preserved
✓ Resumed with 74% fewer tokens in context`}
      </Code>
    </Window>

    <Nota>Ideal ejecutarlo entre tareas o antes de que el contexto se degrade.</Nota>
  </Slide>,

  // 4. Capa 3: /cost audita en tiempo real
  <Slide tone="surface" className="justify-between">
    <div>
      <div data-ui className="inline-block rounded-md bg-accent/20 px-3 py-1 font-mono text-[14px] font-semibold text-accent">
        Capa 3: Presupuesto
      </div>
      <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.0] tracking-[-0.02em] text-ink">
        /cost audita el gasto en tiempo real
      </h2>
      <p className="mt-4 text-[18px] leading-snug text-muted">
        Muestra tokens de entrada, salida y dólares consumidos en la sesión activa antes de que llegue la factura.
      </p>
    </div>

    <Window title="terminal: claude">
      <Code lang="bash">
{`> /cost
Active session metrics:
· Total session cost: $0.42
· Input tokens: 48,210 (cache hit: 88%)
· Output tokens: 1,840`}
      </Code>
    </Window>

    <Nota>Permite detectar si un loop de herramientas está disparando costos.</Nota>
  </Slide>,

  // 5. Resumen / Ficha de capas
  <Slide tone="base" className="justify-between">
    <div>
      <h2 className="font-display text-[44px] font-bold leading-[1.0] tracking-[-0.02em] text-ink">
        El resumen en tres capas
      </h2>
    </div>

    <div className="flex flex-col gap-3 my-auto">
      <div className="rounded-xl bg-surface p-4 border-l-4 border-accent">
        <code data-mono-ok className="font-mono text-[16px] font-bold text-accent">1. /init</code>
        <p className="mt-1 text-[16px] text-ink">Memoria persistente en CLAUDE.md</p>
      </div>

      <div className="rounded-xl bg-surface p-4 border-l-4 border-accent">
        <code data-mono-ok className="font-mono text-[16px] font-bold text-accent">2. /compact</code>
        <p className="mt-1 text-[16px] text-ink">Limpia contexto sin reiniciar</p>
      </div>

      <div className="rounded-xl bg-surface p-4 border-l-4 border-accent">
        <code data-mono-ok className="font-mono text-[16px] font-bold text-accent">3. /cost</code>
        <p className="mt-1 text-[16px] text-ink">Monitorea tokens y presupuesto</p>
      </div>
    </div>

    <Nota>Úsalos en cada sesión para mantener el repo y el gasto bajo control.</Nota>
  </Slide>,

  // 6. Cierre: Despedida + CTA específico
  <Slide tone="surface" className="justify-between text-center items-center">
    <div className="pt-4">
      <Logo slug="claudecode" size={110} />
      <h2 className="mt-6 font-display text-[46px] font-extrabold leading-[1.0] tracking-[-0.02em] text-ink">
        Controla tu sesión en la terminal
      </h2>
    </div>

    <div className="w-full my-auto px-2">
      <div
        data-cta
        className="rounded-2xl bg-bg px-6 py-5 border border-accent/30 flex flex-col items-center gap-3"
      >
        <Gesto accion="guardar" size={48} lleno className="text-accent" />
        <p className="font-display text-[22px] font-bold leading-snug text-accent text-center">
          Guárdalo para la próxima vez que abras una sesión de Claude Code
        </p>
      </div>
    </div>

    <Nota className="pb-2">
      Información al 17 de octubre de 2026. Fuente: code.claude.com.
    </Nota>
  </Slide>,
];
