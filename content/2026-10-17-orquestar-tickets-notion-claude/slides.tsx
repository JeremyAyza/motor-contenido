import { Code, Logo, Nota, Slide, Window } from "@motor/ui";

// Dirección de arte base: collage.
// Tipografía Bricolage en titulares y Geist en texto.
// Stickers de Notion y Claude en fichas blancas con etiquetas rotadas.

export default [
  // 1. Portada: Gancho y stickers de Notion + Claude
  <Slide swipe tone="base" className="justify-between pb-3">
    <div>
      <div data-ui className="inline-block -rotate-2 rounded-full bg-accent px-4 py-1.5 font-display text-[15px] font-bold text-accent-ink">
        Backlog junior en automático
      </div>
      <h1 className="mt-4 font-display text-[50px] font-black leading-[0.95] tracking-[-0.03em] text-ink">
        ¿Por qué no delegas tus tickets de Notion a Claude?
      </h1>
    </div>

    <div className="my-auto flex items-center justify-center gap-6 py-4">
      <Logo slug="notion" chip size={110} className="-rotate-3" />
      <span className="font-display text-[36px] font-black text-muted">+</span>
      <Logo slug="claude" chip size={110} className="rotate-3" />
    </div>

    <div data-ui className="rounded-2xl bg-surface p-4 text-center">
      <p className="font-display text-[17px] font-bold text-ink">
        Cómo cerrar tareas repetitivas sin supervisión
      </p>
    </div>
  </Slide>,

  // 2. El filtro: qué tickets sí delegar
  <Slide tone="surface" className="justify-between">
    <div>
      <div data-ui className="inline-block rotate-1 rounded-md bg-accent/20 px-3 py-1 font-mono text-[13px] font-semibold text-accent">
        Regla 1: El filtro
      </div>
      <h2 className="mt-3 font-display text-[42px] font-black leading-[1.0] tracking-[-0.02em] text-ink">
        Qué tickets delegar sin supervisión
      </h2>
      <p className="mt-3 text-[17px] leading-snug text-muted">
        Elige tareas mecánicas con alcance acotado y deja la arquitectura core para el equipo humano.
      </p>
    </div>

    <div data-ui className="my-auto flex flex-col gap-3">
      <div className="rounded-xl bg-bg p-4 border-l-4 border-emerald-600">
        <span className="font-bold text-[16px] text-emerald-800">✓ Sí para el agente:</span>
        <p className="mt-1 text-[15px] text-ink">Endpoints CRUD, refactors de tipos y bugs con test reproducible.</p>
      </div>
      <div className="rounded-xl bg-bg p-4 border-l-4 border-rose-600">
        <span className="font-bold text-[16px] text-rose-800">✗ No sin supervisión:</span>
        <p className="mt-1 text-[15px] text-ink">Lógica de pagos, arquitectura de base de datos o autenticación.</p>
      </div>
    </div>

    <Nota>Si la tarea requiere más de dos horas de contexto mental, no la delegues sola.</Nota>
  </Slide>,

  // 3. La anatomía del ticket ejecutable
  <Slide tone="base" className="justify-between">
    <div>
      <div data-ui className="inline-block -rotate-1 rounded-md bg-accent/20 px-3 py-1 font-mono text-[13px] font-semibold text-accent">
        Regla 2: El ticket
      </div>
      <h2 className="mt-3 font-display text-[42px] font-black leading-[1.0] tracking-[-0.02em] text-ink">
        Diseña el ticket como prompt ejecutable
      </h2>
      <p className="mt-3 text-[17px] leading-snug text-muted">
        Claude no adivina intenciones. La página de Notion debe incluir archivos y criterios verificables.
      </p>
    </div>

    <div data-ui className="my-auto rounded-2xl bg-surface p-5 border border-ink/10">
      <div className="text-[13px] font-mono text-muted mb-2">#NOT-142 · Estructura mínima</div>
      <div className="flex flex-col gap-2 text-[15px] text-ink">
        <div className="flex items-center gap-2">
          <span className="text-accent font-bold">1.</span>
          <span><strong>Archivos:</strong> src/services/user.ts</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-accent font-bold">2.</span>
          <span><strong>Checklist:</strong> Validar email duplicado y retornar 409</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-accent font-bold">3.</span>
          <span><strong>Comando:</strong> npm test user.service.spec.ts</span>
        </div>
      </div>
    </div>

    <Nota>El comando de test es el ancla que le dice al agente cuándo terminó.</Nota>
  </Slide>,

  // 4. La orquestación en terminal con MCP
  <Slide tone="surface" className="justify-between">
    <div>
      <div data-ui className="inline-block rotate-1 rounded-md bg-accent/20 px-3 py-1 font-mono text-[13px] font-semibold text-accent">
        Regla 3: Conexión MCP
      </div>
      <h2 className="mt-3 font-display text-[42px] font-black leading-[1.0] tracking-[-0.02em] text-ink">
        Conecta la base de Notion a tu terminal
      </h2>
      <p className="mt-3 text-[17px] leading-snug text-muted">
        Usa el protocolo MCP para que Claude lea el ticket y cree la rama en local sin que copies nada.
      </p>
    </div>

    <Window title="terminal: claude">
      <Code lang="bash">
{`$ claude mcp add notion \\
  --transport http \\
  https://mcp.notion.com/mcp
> Resuelve el ticket NOT-142
✓ Reading task spec from Notion...
✓ Created branch feat/not-142
✓ All 4 tests passed`}
      </Code>
    </Window>

    <Nota>Restringe el token de Notion solo a la base de tickets del proyecto.</Nota>
  </Slide>,

  // 5. El ciclo completo
  <Slide tone="base" className="justify-between">
    <div>
      <h2 className="font-display text-[42px] font-black leading-[1.0] tracking-[-0.02em] text-ink">
        De Notion a PR en 3 pasos
      </h2>
    </div>

    <div className="my-auto flex flex-col gap-3">
      <div className="rounded-xl bg-surface p-4 border-l-4 border-accent">
        <p className="font-display font-bold text-[17px] text-ink">
          1. Mueves el ticket a «Para Claude»
        </p>
      </div>

      <div className="rounded-xl bg-surface p-4 border-l-4 border-accent">
        <p className="font-display font-bold text-[17px] text-ink">
          2. Claude programa y valida los tests
        </p>
      </div>

      <div className="rounded-xl bg-surface p-4 border-l-4 border-accent">
        <p className="font-display font-bold text-[17px] text-ink">
          3. Claude abre el PR y avisa en Notion
        </p>
      </div>
    </div>

    <Nota>Tú solo intervienes para hacer el code review final.</Nota>
  </Slide>,

  // 6. Cierre: Despedida + CTA específico
  <Slide tone="surface" className="justify-between text-center items-center">
    <div className="pt-2">
      <div className="inline-flex items-center gap-3">
        <Logo slug="notion" chip size={64} className="-rotate-3" />
        <Logo slug="claude" chip size={64} className="rotate-3" />
      </div>
      <h2 className="mt-5 font-display text-[30px] font-black leading-[1.08] tracking-[-0.02em] text-ink">
        Empieza por redactar un solo ticket de refactor con checklist y córrelo con Claude.
      </h2>
    </div>

    <div className="w-full my-auto px-2">
      <p
        data-cta
        className="rounded-2xl bg-bg p-5 font-display text-[20px] font-bold leading-snug text-accent border border-accent/20"
      >
        Compártelo con tu equipo antes de la próxima planning en Notion.
      </p>
    </div>

    <Nota className="pb-1">
      Información al 17 de octubre de 2026. Fuente: modelcontextprotocol.io.
    </Nota>
  </Slide>,
];
