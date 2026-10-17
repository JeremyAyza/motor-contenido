import { Code, Gesto, Logo, Nota, Slide, Window } from "@motor/ui";

// Dirección de arte base: titular-gigante con elementos prestados de terminal.
// Tipografía Archivo para display e impacto, Geist para lectura en terminal.
// Paleta dark de terminal con acento oficial de Claude (#D97757).

export default [
  // 1. Portada: Gancho directo y logo oficial
  <Slide swipe tone="base" className="justify-between">
    <div>
      <div data-ui className="inline-block rounded-md bg-accent/20 px-3.5 py-1.5 font-mono text-[14px] font-semibold text-accent">
        4 comandos pro de Claude Code
      </div>
      <h1 className="mt-5 font-display text-[50px] font-black leading-[0.95] tracking-[-0.03em] text-ink">
        No necesitas cerrar la terminal cuando Claude falla
      </h1>
    </div>

    <div className="my-auto flex items-center justify-center py-4">
      <Logo slug="claudecode" chip size={110} />
    </div>

    <div data-ui className="rounded-xl bg-surface p-4 border border-ink/10 text-center">
      <p className="font-display text-[17px] font-bold text-ink">
        Atajos nativos para recuperar el control de tu repo
      </p>
    </div>
  </Slide>,

  // 2. Comando 1: /rewind
  <Slide tone="surface" className="justify-between">
    <div>
      <div data-ui className="inline-block rounded-md bg-accent px-3 py-1 font-mono text-[13px] font-bold text-accent-ink">
        Comando 1: La máquina del tiempo
      </div>
      <h2 className="mt-4 font-display text-[44px] font-black leading-[1.0] tracking-[-0.02em] text-ink">
        /rewind
      </h2>
      <p className="mt-3 text-[17px] leading-snug text-muted">
        Revierte tanto los cambios en tus archivos como el contexto del agente a un punto previo.
      </p>
    </div>

    <Window title="terminal: claude">
      <Code lang="bash">
{`> /rewind
Select checkpoint to restore:
● 2 messages ago (before editing user.ts)
○ 4 messages ago (initial git branch)
✓ Code reverted and memory synced.`}
      </Code>
    </Window>

    <Nota>A diferencia de git checkout a mano, no desincroniza la memoria del agente.</Nota>
  </Slide>,

  // 3. Comando 2: /context
  <Slide tone="base" className="justify-between">
    <div>
      <div data-ui className="inline-block rounded-md bg-accent px-3 py-1 font-mono text-[13px] font-bold text-accent-ink">
        Comando 2: Mapa de memoria
      </div>
      <h2 className="mt-4 font-display text-[44px] font-black leading-[1.0] tracking-[-0.02em] text-ink">
        /context
      </h2>
      <p className="mt-3 text-[17px] leading-snug text-muted">
        Inspecciona qué archivos o respuestas están devorando tu ventana de tokens.
      </p>
    </div>

    <Window title="terminal: claude">
      <Code lang="bash">
{`> /context
Token usage breakdown:
- System prompt:  12,400 (6%)
- Loaded files:   48,200 (24%)
- Conversation:   85,100 (42%)
Total: 145,700 / 200,000 tokens`}
      </Code>
    </Window>

    <Nota>Detecta archivos gigantes cargados antes de que la sesión empiece a alucinar.</Nota>
  </Slide>,

  // 4. Comando 3: /security-review
  <Slide tone="surface" className="justify-between">
    <div>
      <div data-ui className="inline-block rounded-md bg-accent px-3 py-1 font-mono text-[13px] font-bold text-accent-ink">
        Comando 3: Auditor pre-commit
      </div>
      <h2 className="mt-4 font-display text-[42px] font-black leading-[1.0] tracking-[-0.02em] text-ink">
        /security-review
      </h2>
      <p className="mt-3 text-[17px] leading-snug text-muted">
        Audita de forma automática tus cambios locales buscando vulnerabilidades antes del commit.
      </p>
    </div>

    <Window title="terminal: claude">
      <Code lang="bash">
{`> /security-review
Scanning 3 modified files...
⚠ Warning: Unsanitized input in auth.ts:42
✓ No secrets or credentials leaked
✓ 0 critical vulnerabilities found`}
      </Code>
    </Window>

    <Nota>Úsalo como un último filtro rápido antes de abrir el Pull Request.</Nota>
  </Slide>,

  // 5. Comando 4: .claude/commands/
  <Slide tone="base" className="justify-between">
    <div>
      <div data-ui className="inline-block rounded-md bg-accent px-3 py-1 font-mono text-[13px] font-bold text-accent-ink">
        Comando 4: Slash commands custom
      </div>
      <h2 className="mt-4 font-display text-[40px] font-black leading-[1.0] tracking-[-0.02em] text-ink">
        .claude/commands/
      </h2>
      <p className="mt-3 text-[17px] leading-snug text-muted">
        Convierte cualquier prompt recurrente de tu equipo en un comando nativo con Markdown.
      </p>
    </div>

    <div data-ui className="my-auto flex flex-col gap-3">
      <div className="rounded-xl bg-surface p-4 border border-ink/10">
        <p className="font-mono text-[16px] text-accent">.claude/commands/review.md</p>
        <p className="mt-1 font-mono text-[16px] text-ink/90"># Revisa diff, tipados y tests</p>
      </div>
      <div className="rounded-xl bg-surface p-4 border border-emerald-500/30">
        <p className="font-mono text-[16px] text-emerald-400">
          Ejecutable en terminal como: <span className="font-bold text-ink">/review</span>
        </p>
      </div>
    </div>

    <Nota>Compártelos en el repositorio para que todo tu equipo use los mismos prompts.</Nota>
  </Slide>,

  // 6. Cierre: Despedida + CTA específico
  <Slide tone="surface" className="justify-between text-center items-center">
    <div className="pt-2">
      <div className="inline-flex items-center justify-center">
        <Logo slug="claudecode" chip size={64} />
      </div>
      <h2 className="mt-4 font-display text-[29px] font-black leading-[1.08] tracking-[-0.02em] text-ink">
        No reinicies tu sesión: rebobina el contexto y mantén el control de tu repo.
      </h2>
    </div>

    <div className="my-auto flex flex-col items-center">
      <Gesto accion="enviar" size={96} lleno className="text-accent" />
    </div>

    <div className="w-full px-2 mb-2">
      <p
        data-cta
        className="rounded-2xl bg-bg p-5 font-display text-[19px] font-bold leading-snug text-accent border border-accent/20"
      >
        Compártelo con ese colega que siempre reinicia la terminal cuando Claude Code se equivoca.
      </p>
    </div>

    <Nota className="pb-1">
      Información al 17 de octubre de 2026. Fuente: docs.anthropic.com.
    </Nota>
  </Slide>,
];
