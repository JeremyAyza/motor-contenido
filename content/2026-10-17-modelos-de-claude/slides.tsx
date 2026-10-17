import { Logo, Nota, Slide } from "@motor/ui";

// Dirección de arte base: ficha-tecnica.
// Tipografía Archivo condensada con Geist en texto.
// Paleta editorial clara con acento terracota oscuro (#9B3818).

export default [
  // 1. Portada: Gancho y tabla resumen de especificaciones
  <Slide swipe tone="base" className="justify-between pb-3">
    <div>
      <h1 className="font-display text-[54px] font-black leading-[0.92] tracking-[-0.03em] text-ink font-stretch-[75%]">
        Deja de pagar 5 veces más por Opus
      </h1>
      <p className="mt-3 text-[19px] font-medium text-accent">
        Comparativa de modelos
      </p>
    </div>

    <div className="my-auto flex items-center justify-center py-2">
      <Logo slug="claude" size={132} />
    </div>

    <div data-ui className="flex flex-col gap-2 rounded-xl bg-surface p-4">
      <div className="flex items-center justify-between border-b border-ink/10 pb-2 text-[15px]">
        <span className="font-bold text-ink">Haiku 3.5</span>
        <code data-mono-ok className="font-mono text-accent">$0.80 / MTok</code>
      </div>
      <div className="flex items-center justify-between border-b border-ink/10 pb-2 text-[15px]">
        <span className="font-bold text-ink">Sonnet 3.5</span>
        <code data-mono-ok className="font-mono text-accent font-bold">$3.00 / MTok</code>
      </div>
      <div className="flex items-center justify-between text-[15px]">
        <span className="font-bold text-ink">Opus 3</span>
        <code data-mono-ok className="font-mono text-muted">$15.00 / MTok</code>
      </div>
    </div>
  </Slide>,

  // 2. Claude Haiku
  <Slide tone="surface" className="justify-between">
    <div>
      <div data-ui className="inline-block rounded-md bg-accent/15 px-3 py-1 font-mono text-[13px] font-semibold text-accent">
        Nivel 1: Velocidad
      </div>
      <h2 className="mt-3 font-display text-[44px] font-black leading-[0.98] tracking-[-0.02em] font-stretch-[80%] text-ink">
        Haiku: velocidad pura y costo mínimo
      </h2>
      <p className="mt-3 text-[18px] leading-snug text-muted">
        Cuesta $0.80 por millón de tokens de entrada. Es la opción ideal para autocompletado en vivo y subagentes en paralelo.
      </p>
    </div>

    <div data-ui className="my-auto flex flex-col gap-3 rounded-2xl bg-bg p-5 border border-ink/10">
      <div className="flex justify-between text-[16px]">
        <span className="text-muted">Costo entrada / salida:</span>
        <code data-mono-ok className="font-mono font-bold text-ink">$0.80 / $4.00</code>
      </div>
      <div className="flex justify-between text-[16px]">
        <span className="text-muted">Ventana de contexto:</span>
        <code data-mono-ok className="font-mono text-ink">200K tokens</code>
      </div>
      <div className="flex justify-between text-[16px]">
        <span className="text-muted">Punto fuerte:</span>
        <span className="font-medium text-accent">Latencia mínima</span>
      </div>
    </div>

    <Nota>Úsalo para subagentes que no requieren decisiones arquitectónicas.</Nota>
  </Slide>,

  // 3. Claude Sonnet
  <Slide tone="base" className="justify-between">
    <div>
      <div data-ui className="inline-block rounded-md bg-accent/15 px-3 py-1 font-mono text-[13px] font-semibold text-accent">
        Nivel 2: Estándar
      </div>
      <h2 className="mt-3 font-display text-[44px] font-black leading-[0.98] tracking-[-0.02em] font-stretch-[80%] text-ink">
        Sonnet: el estándar definitivo en código
      </h2>
      <p className="mt-3 text-[18px] leading-snug text-muted">
        Cuesta $3 por millón de tokens y supera a Opus en resolución de incidencias en repositorios al 20% del costo.
      </p>
    </div>

    <div data-ui className="my-auto flex flex-col gap-3 rounded-2xl bg-surface p-5 border-l-4 border-accent">
      <div className="flex justify-between text-[16px]">
        <span className="text-muted">Costo entrada / salida:</span>
        <code data-mono-ok className="font-mono font-bold text-accent">$3.00 / $15.00</code>
      </div>
      <div className="flex justify-between text-[16px]">
        <span className="text-muted">Evaluación SWE-bench:</span>
        <span className="font-bold text-ink">Líder en programación</span>
      </div>
      <div className="flex justify-between text-[16px]">
        <span className="text-muted">Modelo default en:</span>
        <code data-mono-ok className="font-mono text-ink">Claude Code</code>
      </div>
    </div>

    <Nota>Es la mejor relación calidad y precio para cualquier flujo de ingeniería.</Nota>
  </Slide>,

  // 4. Claude Opus
  <Slide tone="surface" className="justify-between">
    <div>
      <div data-ui className="inline-block rounded-md bg-accent/15 px-3 py-1 font-mono text-[13px] font-semibold text-accent">
        Nivel 3: Razonamiento
      </div>
      <h2 className="mt-3 font-display text-[44px] font-black leading-[0.98] tracking-[-0.02em] font-stretch-[80%] text-ink">
        Opus: análisis denso, no para programar
      </h2>
      <p className="mt-3 text-[18px] leading-snug text-muted">
        A $15 por millón es 5 veces más caro que Sonnet. Solo conviene en razonamiento matemático profundo y auditorías complejas.
      </p>
    </div>

    <div data-ui className="my-auto flex flex-col gap-3 rounded-2xl bg-bg p-5 border border-ink/10">
      <div className="flex justify-between text-[16px]">
        <span className="text-muted">Costo entrada / salida:</span>
        <code data-mono-ok className="font-mono font-bold text-ink">$15.00 / $75.00</code>
      </div>
      <div className="flex justify-between text-[16px]">
        <span className="text-muted">Comparativa vs Sonnet:</span>
        <span className="font-bold text-accent">5x más costoso</span>
      </div>
      <div className="flex justify-between text-[16px]">
        <span className="text-muted">Uso justificado:</span>
        <span className="font-medium text-ink">Análisis conceptual</span>
      </div>
    </div>

    <Nota>Para código común y refactors, Sonnet resuelve igual o mejor.</Nota>
  </Slide>,

  // 5. Tabla de decisión rápida
  <Slide tone="base" className="justify-between">
    <div>
      <h2 className="font-display text-[42px] font-black leading-[0.98] tracking-[-0.02em] font-stretch-[80%] text-ink">
        Tabla de decisión rápida
      </h2>
      <p className="mt-2 text-[17px] leading-snug text-muted">
        El modelo exacto según tu tipo de tarea y presupuesto:
      </p>
    </div>

    <div className="my-auto flex flex-col gap-2.5">
      <div className="rounded-xl bg-surface p-4 border-l-4 border-ink/30">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[17px] text-ink">Haiku</span>
          <code data-mono-ok className="font-mono text-[14px] text-muted">$0.80 / MTok</code>
        </div>
        <p className="mt-1 text-[16px] text-muted">Clasificación, autocompletado y subagentes rápidos.</p>
      </div>

      <div className="rounded-xl bg-surface p-4 border-l-4 border-accent">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[17px] text-accent">Sonnet</span>
          <code data-mono-ok className="font-mono text-[14px] text-accent font-bold">$3.00 / MTok</code>
        </div>
        <p className="mt-1 text-[16px] text-ink font-medium">Programación, debugging y agentes de terminal.</p>
      </div>

      <div className="rounded-xl bg-surface p-4 border-l-4 border-ink/30">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[17px] text-ink">Opus</span>
          <code data-mono-ok className="font-mono text-[14px] text-muted">$15.00 / MTok</code>
        </div>
        <p className="mt-1 text-[16px] text-muted">Razonamiento profundo, ciencia y auditoría legal.</p>
      </div>
    </div>

    <Nota>Precios oficiales de Anthropic por millón de tokens de entrada.</Nota>
  </Slide>,

  // 6. Cierre: Despedida + CTA específico
  <Slide tone="surface" className="justify-between text-center items-center">
    <div className="pt-2">
      <Logo slug="claude" size={96} />
      <h2 className="mt-4 font-display text-[34px] font-black leading-[1.05] tracking-[-0.02em] font-stretch-[80%] text-ink">
        Sonnet para programar, Haiku para subagentes y Opus solo para razonamiento puro
      </h2>
    </div>

    <div className="w-full my-auto px-2">
      <p
        data-cta
        className="rounded-2xl bg-bg p-5 font-display text-[21px] font-bold leading-snug text-accent border border-accent/20"
      >
        La lámina 5 tiene la tabla comparativa con precios y casos de uso. Guárdala.
      </p>
    </div>

    <Nota className="pb-1">
      Información al 17 de octubre de 2026. Fuente: anthropic.com/pricing.
    </Nota>
  </Slide>,
];
