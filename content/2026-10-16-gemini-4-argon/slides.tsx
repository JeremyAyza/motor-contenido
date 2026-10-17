import { Code, Logo, Slide, Window } from "@motor/ui";

// Dirección de arte: terminal (con préstamo de ficha técnica).
// La consola y las peticiones reales a la API son el hilo conductor.

export default [
  // 1. Portada: Gancho con el modelo y el ancla oficial
  <Slide swipe tone="base">
    <div className="flex flex-col">
      <h1 className="font-display text-[52px] font-black leading-[0.95] tracking-tight">
        Llegó Gemini 4 Argon.
      </h1>
      <p className="mt-3 text-[20px] font-medium text-muted">
        El nuevo modelo insignia de Google para código y tareas complejas.
      </p>
    </div>

    <div className="my-5 flex items-center justify-center">
      <Logo slug="googlegemini" size={140} />
    </div>

    <Window className="mt-auto">
      <Code lang="bash">
{`$ curl https://api.google.dev \\
  -H "x-goog-api-key: $KEY" \\
  -d '{"model": "gemini-4-argon"}'`}
      </Code>
    </Window>
  </Slide>,

  // 2. Parámetro thinkingLevel
  <Slide tone="surface">
    <h2 className="font-display text-[40px] font-black leading-[0.95] tracking-tight">
      Razonamiento con 3 marchas.
    </h2>
    <p className="mt-3 text-[18px] text-muted">
      Ajusta el parámetro thinkingLevel según la complejidad y el costo.
    </p>

    <Window className="mt-5">
      <Code lang="json">
{`{
  "model": "gemini-4-argon",
  "thinkingConfig": {
    "thinkingLevel": "high"
  }
}`}
      </Code>
    </Window>

    <div className="mt-5 grid grid-cols-3 gap-2.5">
      <div className="rounded-xl bg-bg p-3.5">
        <span className="font-mono text-[15px] font-semibold text-accent" data-mono-ok>low</span>
        <p className="mt-1 text-[14px] text-muted leading-tight">Respuestas rápidas</p>
      </div>
      <div className="rounded-xl bg-bg p-3.5">
        <span className="font-mono text-[15px] font-semibold text-accent" data-mono-ok>medium</span>
        <p className="mt-1 text-[14px] text-muted leading-tight">Nivel por defecto</p>
      </div>
      <div className="rounded-xl bg-bg p-3.5">
        <span className="font-mono text-[15px] font-semibold text-accent" data-mono-ok>high</span>
        <p className="mt-1 text-[14px] text-muted leading-tight">Código complejo</p>
      </div>
    </div>
  </Slide>,

  // 3. 1M de entrada y 1M de salida
  <Slide tone="base">
    <h2 className="font-display text-[40px] font-black leading-[0.95] tracking-tight">
      1 millón de tokens de entrada y de salida.
    </h2>
    <p className="mt-3 text-[18px] text-muted">
      Rompe el cuello de botella habitual de salida al generar software.
    </p>

    <div className="mt-6 flex flex-col gap-4">
      <div className="rounded-2xl bg-surface p-5">
        <span className="text-[14px] font-medium text-muted">Contexto de entrada</span>
        <p className="mt-1 font-display text-[38px] font-black text-ink">1.048.576</p>
        <p className="mt-1 text-[14px] text-muted">Lee bibliotecas y repositorios completos de una sola vez.</p>
      </div>
      <div className="rounded-2xl bg-surface p-5">
        <span className="text-[14px] font-medium text-accent">Decodificación máxima de salida</span>
        <p className="mt-1 font-display text-[38px] font-black text-accent">1.048.576</p>
        <p className="mt-1 text-[14px] text-muted">Genera refactorizaciones extensas sin riesgo de truncado.</p>
      </div>
    </div>
  </Slide>,

  // 4. Precios y Context Caching
  <Slide tone="surface">
    <h2 className="font-display text-[40px] font-black leading-[0.95] tracking-tight">
      Tarifas de lanzamiento.
    </h2>
    <p className="mt-3 text-[18px] text-muted">
      Precios promocionales vigentes hasta el 30 de noviembre de 2026.
    </p>

    <div className="mt-6 grid grid-cols-2 gap-3">
      <div className="rounded-2xl bg-bg p-5">
        <p className="text-[14px] text-muted">Entrada / 1M</p>
        <p className="mt-1 font-display text-[40px] font-black text-ink">$2.00</p>
        <p className="mt-2 text-[14px] text-muted">$4.00 desde diciembre</p>
      </div>
      <div className="rounded-2xl bg-bg p-5">
        <p className="text-[14px] text-muted">Salida / 1M</p>
        <p className="mt-1 font-display text-[40px] font-black text-ink">$10.00</p>
        <p className="mt-2 text-[14px] text-muted">$20.00 desde diciembre</p>
      </div>
    </div>

    <div className="mt-4 flex items-center justify-between rounded-2xl bg-bg p-5">
      <div>
        <p className="font-display text-[22px] font-bold text-ink">Context caching</p>
        <p className="text-[14px] text-muted">Descuento en tokens cacheados</p>
      </div>
      <span className="font-display text-[36px] font-black text-accent">-95%</span>
    </div>
  </Slide>,

  // 5. Impacto en código y seguridad
  <Slide tone="base">
    <h2 className="font-display text-[40px] font-black leading-[0.95] tracking-tight">
      #1 en evaluación económica real.
    </h2>
    <p className="mt-3 text-[18px] text-muted">
      Desempeño demostrado en ingeniería de software y seguridad de agentes.
    </p>

    <div className="mt-6 flex flex-col gap-4">
      <div className="rounded-2xl bg-surface p-5">
        <div className="flex items-center justify-between">
          <span className="font-display text-[24px] font-bold text-accent">Vals Index</span>
          <span className="rounded-full bg-accent/20 px-3 py-1 font-mono text-[14px] font-bold text-accent" data-mono-ok>#1 GLOBAL</span>
        </div>
        <p className="mt-2 text-[14px] text-muted">Lidera en precisión para tareas de código, finanzas, legal e impuestos.</p>
      </div>
      <div className="rounded-2xl bg-surface p-5">
        <div className="flex items-center justify-between">
          <span className="font-display text-[24px] font-bold text-ink">Gray Swan IPI</span>
          <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[14px] font-bold text-ink" data-mono-ok>LÍDER</span>
        </div>
        <p className="mt-2 text-[14px] text-muted">Máxima resistencia ante inyección indirecta de prompts en agentes autónomos.</p>
      </div>
    </div>
  </Slide>,

  // 6. Cierre y disponibilidad
  <Slide tone="surface">
    <h2 className="font-display text-[42px] font-black leading-[0.95] tracking-tight">
      Dónde probarlo hoy.
    </h2>
    <p className="mt-3 text-[18px] text-muted">
      Acceso habilitado para desarrolladores en tres plataformas:
    </p>

    <div className="mt-5 flex flex-col gap-3">
      <div className="rounded-xl bg-bg p-4">
        <span className="font-display text-[19px] font-bold text-ink">Google AI Studio</span>
        <p className="text-[14px] text-muted">Playground interactivo y API keys inmediatas.</p>
      </div>
      <div className="rounded-xl bg-bg p-4">
        <span className="font-display text-[19px] font-bold text-ink">Google Cloud Vertex AI</span>
        <p className="text-[14px] text-muted">Despliegue empresarial con cumplimiento de seguridad.</p>
      </div>
      <div className="rounded-xl bg-bg p-4">
        <span className="font-display text-[19px] font-bold text-ink">Google Antigravity</span>
        <p className="text-[14px] text-muted">Entornos agentic avanzados de desarrollo de software.</p>
      </div>
    </div>

    <p className="mt-auto text-[14px] text-muted">
      Info al 16 de octubre de 2026 · Fuentes: blog.google y ai.google.dev
    </p>
  </Slide>,
];
