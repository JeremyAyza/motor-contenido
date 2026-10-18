import { Code, Gesto, Logo, Nota, Slide, Window } from "@motor/ui";

// Dirección de arte: terminal (con préstamos de ficha-tecnica y collage).
// Paleta oscura con acento violeta índigo de alto contraste (#818CF8).
// Tipografía Geist para titulares y cuerpo con bloques de consola y fichas de alta densidad.

export default [
  // 1. Portada: Gancho + Logo prominente + Ventana de terminal con el setup de REA
  <Slide swipe tone="base" className="justify-between pb-3">
    <div>
      <div className="flex items-center justify-between">
        <div data-ui className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-surface px-3 py-1 font-mono text-[13px] font-semibold text-accent" data-mono-ok>
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span>REA · Reverse Engineer Anything</span>
        </div>
        <Logo slug="github" size={76} chip />
      </div>
      <h1 className="mt-3 font-display text-[46px] font-black leading-[0.96] tracking-[-0.03em] text-ink">
        Este MCP reemplaza horas en Ghidra
      </h1>
      <p className="mt-2 text-[18px] font-medium leading-snug text-muted">
        Inspecciona binarios con tu agente.
      </p>
    </div>

    <div className="my-auto w-full">
      <Window title="terminal: npx rea-agents setup">
        <Code lang="bash">
{`$ npx rea-agents setup
✓ Registered MCP: io.github.morluto/rea
✓ Engines: Hopper | Ghidra | Cutter
✓ Agents: Claude Code, Cursor, Codex`}
        </Code>
      </Window>
    </div>

    <div data-ui className="flex items-center justify-between rounded-xl bg-surface px-4 py-2.5 border border-surface">
      <span className="font-mono text-[13px] text-ink" data-mono-ok>morluto/rea</span>
      <div className="flex items-center gap-2 font-mono text-[13px] text-accent" data-mono-ok>
        <span>Nativos</span>
        <span className="text-muted">·</span>
        <span>Electron</span>
        <span className="text-muted">·</span>
        <span>JS</span>
        <span className="text-muted">·</span>
        <span>.NET</span>
      </div>
    </div>
  </Slide>,

  // 2. Qué es REA: Arquitectura de 4 etapas
  <Slide tone="surface" className="justify-between pb-3">
    <div>
      <div data-ui className="inline-block rounded-md bg-accent px-3 py-1 font-mono text-[13px] font-bold text-accent-ink" data-mono-ok>
        Arquitectura · Protocolo MCP
      </div>
      <h2 className="mt-3 font-display text-[38px] font-black leading-[1.0] tracking-[-0.02em] text-ink">
        El puente entre decompiladores y tu agente
      </h2>
      <p className="mt-2 text-[16px] leading-snug text-muted">
        Descompilar un ejecutable exigía dominar Ghidra a mano. REA conecta los motores de análisis directo a tu modelo.
      </p>
    </div>

    <div data-ui className="my-auto flex flex-col gap-2">
      <div className="rounded-xl bg-bg p-3 border-l-4 border-accent">
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-[15px] text-ink">1. Tu Agente (Claude / Cursor)</span>
          <span className="font-mono text-[12px] text-accent" data-mono-ok>Entrada</span>
        </div>
        <p className="mt-0.5 text-[14px] leading-snug text-muted">Formula hipótesis y pide inspeccionar funciones específicas.</p>
      </div>

      <div className="rounded-xl bg-bg p-3 border-l-4 border-indigo-400">
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-[15px] text-ink">2. Servidor MCP de REA</span>
          <span className="font-mono text-[12px] text-indigo-400" data-mono-ok>Bridge</span>
        </div>
        <p className="mt-0.5 text-[14px] leading-snug text-muted">Orquesta llamadas a símbolos y desensamblado nativo.</p>
      </div>

      <div className="rounded-xl bg-bg p-3 border-l-4 border-emerald-400">
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-[15px] text-ink">3. Motores Locales (Ghidra, Hopper)</span>
          <span className="font-mono text-[12px] text-emerald-400" data-mono-ok>Análisis</span>
        </div>
        <p className="mt-0.5 text-[14px] leading-snug text-muted">Descompilan el código nativo y devuelven la evidencia exacta.</p>
      </div>

      <div className="rounded-xl bg-bg p-3 border-l-4 border-amber-400">
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-[15px] text-ink">4. Salida en tu Proyecto</span>
          <span className="font-mono text-[12px] text-amber-400" data-mono-ok>Código</span>
        </div>
        <p className="mt-0.5 text-[14px] leading-snug text-muted">El agente escribe la implementación limpia con tests para tu repo.</p>
      </div>
    </div>

    <Nota>Ningún binario ni código sale de tu máquina: el análisis corre 100% en local.</Nota>
  </Slide>,

  // 3. Setup: Instalación en un comando
  <Slide tone="base" className="justify-between pb-3">
    <div>
      <div data-ui className="inline-block rounded-md bg-accent px-3 py-1 font-mono text-[13px] font-bold text-accent-ink" data-mono-ok>
        Configuración
      </div>
      <h2 className="mt-3 font-display text-[38px] font-black leading-[1.0] tracking-[-0.02em] text-ink">
        Un comando para registrar las herramientas
      </h2>
      <p className="mt-2 text-[16px] leading-snug text-muted">
        No necesitas editar a mano archivos de configuración JSON ni configurar puertos de red.
      </p>
    </div>

    <div className="my-auto w-full">
      <Window title="terminal: npx rea-agents setup">
        <Code lang="bash">
{`$ npx rea-agents setup
✓ Registered server: io.github.morluto/rea
✓ Installed reverse-engineering skills
✓ Backed up existing agent configuration
Restart your agent to apply changes.`}
        </Code>
      </Window>
    </div>

    <div data-ui className="grid grid-cols-2 gap-2.5">
      <div className="rounded-xl bg-surface p-3 border border-surface">
        <span className="block font-display text-[15px] font-bold text-ink">Claude Code & Cursor</span>
        <span className="text-[13px] text-muted">Herramientas MCP nativas integradas</span>
      </div>
      <div className="rounded-xl bg-surface p-3 border border-surface">
        <span className="block font-display text-[15px] font-bold text-ink">Terminal CLI</span>
        <span className="text-[13px] text-muted">Comando rea disponible para scripts</span>
      </div>
    </div>

    <Nota>Guarda copia de seguridad automática de tus configuraciones previas.</Nota>
  </Slide>,

  // 4. El prompt de investigación
  <Slide tone="surface" className="justify-between pb-3">
    <div>
      <div data-ui className="inline-block rounded-md bg-accent px-3 py-1 font-mono text-[13px] font-bold text-accent-ink" data-mono-ok>
        Flujo de trabajo
      </div>
      <h2 className="mt-3 font-display text-[38px] font-black leading-[1.0] tracking-[-0.02em] text-ink">
        Pídeselo como a un ingeniero senior
      </h2>
      <p className="mt-2 text-[16px] leading-snug text-muted">
        No buscas offsets en ensamblador: le pides entender la lógica de negocio y replicarla.
      </p>
    </div>

    <div className="my-auto w-full">
      <Window title="prompt: claude-code">
        <Code lang="markdown">
{`> Audita la búsqueda en Notes.app,
  extrae la lógica decompilada y
  genera el módulo en TypeScript.`}
        </Code>
      </Window>

      <div data-ui className="mt-2.5 space-y-1.5">
        <div className="flex items-center gap-2.5 rounded-lg bg-bg px-3 py-1.5 font-mono text-[12px] text-ink" data-mono-ok>
          <span className="text-emerald-400 font-bold">1</span>
          <span>Rastrea llamadas a APIs internas y desensambla la función.</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg bg-bg px-3 py-1.5 font-mono text-[12px] text-ink" data-mono-ok>
          <span className="text-emerald-400 font-bold">2</span>
          <span>Descarta alucinaciones citando la evidencia del binario.</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg bg-bg px-3 py-1.5 font-mono text-[12px] text-ink" data-mono-ok>
          <span className="text-emerald-400 font-bold">3</span>
          <span>Genera código limpio en TS con tests para tu repositorio.</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg bg-bg px-3 py-1.5 font-mono text-[12px] text-ink" data-mono-ok>
          <span className="text-emerald-400 font-bold">4</span>
          <span>Valida la ejecución en tu máquina antes de entregar.</span>
        </div>
      </div>
    </div>

    <Nota>El agente evalúa los límites técnicos encontrados antes de escribir la solución.</Nota>
  </Slide>,

  // 5. Qué formatos y aplicaciones analiza
  <Slide tone="base" className="justify-between pb-3">
    <div>
      <div data-ui className="inline-block rounded-md bg-accent px-3 py-1 font-mono text-[13px] font-bold text-accent-ink" data-mono-ok>
        Soporte técnico
      </div>
      <h2 className="mt-3 font-display text-[38px] font-black leading-[1.0] tracking-[-0.02em] text-ink">
        Qué analiza en local sin código fuente
      </h2>
      <p className="mt-2 text-[16px] leading-snug text-muted">
        Cubre desde ejecutables compilados de bajo nivel hasta apps modernas de escritorio.
      </p>
    </div>

    <div data-ui className="my-auto grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-surface p-3.5 border border-surface">
        <div className="font-display text-[16px] font-bold text-accent">Binarios Nativos</div>
        <div className="mt-1 text-[14px] text-ink leading-snug">C, C++, Rust, Go, Mach-O, ELF y ejecutables PE</div>
        <div className="mt-2 font-mono text-[13px] text-muted" data-mono-ok>Ghidra · Hopper · Cutter</div>
      </div>

      <div className="rounded-xl bg-surface p-3.5 border border-surface">
        <div className="font-display text-[16px] font-bold text-accent">Apps Electron (.asar)</div>
        <div className="mt-1 text-[14px] text-ink leading-snug">Inspección de módulos JS y límites IPC.</div>
        <div className="mt-2 font-mono text-[13px] text-muted" data-mono-ok>Sin decompilador nativo</div>
      </div>

      <div className="rounded-xl bg-surface p-3.5 border border-surface">
        <div className="font-display text-[16px] font-bold text-accent">JavaScript & Web</div>
        <div className="mt-1 text-[14px] text-ink leading-snug">Rastreo de dependencias y bundles minificados.</div>
        <div className="mt-2 font-mono text-[13px] text-muted" data-mono-ok>Node 22+ y Bun</div>
      </div>

      <div className="rounded-xl bg-surface p-3.5 border border-surface">
        <div className="font-display text-[16px] font-bold text-accent">Ensamblados .NET</div>
        <div className="mt-1 text-[14px] text-ink leading-snug">Decompilación limpia de código intermedio IL.</div>
        <div className="mt-2 font-mono text-[13px] text-muted" data-mono-ok>DLLs y ejecutables</div>
      </div>
    </div>

    <Nota>El análisis de Electron y JavaScript funciona directo sin instalar Ghidra.</Nota>
  </Slide>,

  // 6. Cierre: Gesto gigante + CTA específico
  <Slide tone="surface" className="justify-between pb-3 text-center items-center">
    <div className="pt-2">
      <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3.5 py-1 text-[16px] font-bold text-accent">
        <Logo slug="github" size={18} />
        <span data-mono-ok>morluto/rea</span>
      </div>
      <h2 className="mt-4 font-display text-[30px] font-black leading-[1.08] tracking-[-0.02em] text-ink">
        Empieza por correr npx rea-agents setup y conecta tu agente en un minuto.
      </h2>
    </div>

    <div className="my-auto flex flex-col items-center">
      <Gesto accion="enviar" size={96} lleno className="text-accent my-2" />
    </div>

    <div className="w-full px-2">
      <p
        data-cta
        className="rounded-2xl bg-bg p-5 font-display text-[18px] font-bold leading-snug text-accent border border-accent/30 text-center"
      >
        Compártelo con ese amigo que todavía pasa horas descompilando binarios a mano.
      </p>
    </div>

    <Nota className="pb-1">
      Información al 18 de octubre de 2026. Fuente: morluto/rea y npm rea-agents.
    </Nota>
  </Slide>,
];
