import { Gesto, Logo, Nota, Slide, Window } from "@motor/ui";

/**
 * Dirección: Línea continua con alta densidad visual (collage técnico).
 * Cada lámina incorpora artefactos reales de desarrollo:
 * - L1: Logos oficiales de GitHub y Claude Code con conector.
 * - L2: Split visual interactivo (Chat web vs Agente local).
 * - L3: Ventana de editor con plan.md, árbol de archivos y checklist.
 * - L4: Ventana de issue de GitHub con CLI y parches multi-archivo.
 * - L5: Terminal de testing con bucle FAIL -> Autocorrección -> PASS.
 * - L6: Simulación de UI de GitHub Pull Request con checks de CI en verde.
 * - L7: Matriz de 4 hitos del pipeline con gesto de guardado integrado.
 */

export default [
  // 1. Portada: GitHub + Claude Code y pipeline automatizado
  <Slide swipe>
    <h1 className="font-display text-[52px] font-extrabold leading-[0.94] tracking-[-0.035em]">
      4 tareas de dev que ya no deberías hacer manual.
    </h1>

    <div className="my-auto flex items-center justify-center gap-6 py-6">
      <Logo slug="github" chip size={110} className="-rotate-3 border border-black/10" />
      <span className="font-display text-[32px] font-black text-muted">→</span>
      <Logo slug="claudecode" chip size={110} className="rotate-3 border border-black/10" />
    </div>
  </Slide>,

  // 2. El cuello de botella: Split visual Chat vs Agente
  <Slide tone="surface">
    <h1 className="font-display text-[40px] font-extrabold leading-[0.98] tracking-[-0.03em]">
      El cuello de botella: copiar y pegar del chat.
    </h1>

    <div className="my-auto flex flex-col gap-3 pt-2">
      <div className="rounded-xl border border-rose-600/30 bg-bg p-4">
        <p className="text-[16px] font-bold text-rose-800">✗ Chat en navegador</p>
        <p className="mt-1 text-[16px] text-ink">
          Copias snippets y pegas errores a mano.
        </p>
      </div>

      <div className="rounded-xl border border-emerald-600/30 bg-bg p-4">
        <p className="text-[16px] font-bold text-emerald-800">✓ Agente en terminal</p>
        <p className="mt-1 text-[16px] text-ink">
          Lee el repo, edita código y corre tests solo.
        </p>
      </div>
    </div>

    <Nota>El chat solo genera texto; el agente opera en tu repositorio.</Nota>
  </Slide>,

  // 3. Paso 1: Plan de implementación con árbol y checklist
  <Slide>
    <h1 className="font-display text-[40px] font-extrabold leading-[0.98] tracking-[-0.03em]">
      1. Plan de implementación
    </h1>
    <p className="mt-2 text-[18px] text-ink">
      Mapea la arquitectura antes de tocar código.
    </p>

    <div className="my-auto">
      <Window title="workspace/plan.md">
        <div className="p-4 font-mono text-[14px] leading-relaxed text-[#e6edf3]">
          <p className="text-[#7ee787]">📁 src/auth/</p>
          <p className="text-[#8b949e]">├── 📄 session.ts (modificar)</p>
          <p className="text-[#8b949e]">└── 📄 routes.ts  (revisar)</p>
          <div className="mt-3 border-t border-white/10 pt-2 text-[14px]">
            <p className="text-[#7ee787]">✓ Breaking changes analizados</p>
            <p className="text-[#7ee787]">✓ Dependencias verificadas</p>
            <p className="text-[#f85149]">⚠ Riesgo: expiración de tokens viejos</p>
          </div>
        </div>
      </Window>
    </div>

    <Nota>Diseñar el plan antes de implementar previene regresiones en el repo.</Nota>
  </Slide>,

  // 4. Paso 2: Ticket de GitHub interactivo con CLI
  <Slide tone="surface">
    <h1 className="font-display text-[40px] font-extrabold leading-[0.98] tracking-[-0.03em]">
      2. De ticket a cambios reales
    </h1>
    <p className="mt-2 text-[18px] text-ink">
      Lee la incidencia y aplica parches multi-archivo.
    </p>

    <div className="my-auto">
      <Window title="github.com/repo/issues/142">
        <div className="p-4 font-mono text-[14px] leading-relaxed text-[#e6edf3]">
          <p className="text-[#58a6ff]">#142: Invalidate session tokens on logout</p>
          <p className="text-[#8b949e]">Labels: bug:auth, priority:high</p>
          <div className="my-2 border-t border-white/10 pt-2 text-[#7ee787]">
            <p>$ gh issue view 142</p>
            <p>&gt; Leyendo contexto del ticket...</p>
            <p>&gt; Modificados: src/auth/session.ts y routes.ts</p>
          </div>
        </div>
      </Window>
    </div>

    <Nota>El agente usa GitHub CLI para entender la tarea en terminal.</Nota>
  </Slide>,

  // 5. Paso 3: Terminal de tests con bucle de autocorrección FAIL -> PASS
  <Slide>
    <h1 className="font-display text-[40px] font-extrabold leading-[0.98] tracking-[-0.03em]">
      3. Pruebas y linter en local
    </h1>
    <p className="mt-2 text-[18px] text-ink">
      Si un test falla, se autocorrige en bucle.
    </p>

    <div className="my-auto">
      <Window title="terminal: npm test">
        <div className="p-4 font-mono text-[14px] leading-relaxed text-[#e6edf3]">
          <p className="text-[#f85149]">FAIL src/auth/session.test.ts</p>
          <p className="text-[#8b949e]">✕ should invalidate session token</p>
          <div className="my-2 border-t border-white/10 pt-2 text-[#58a6ff]">
            <p>&gt; Error detectado en línea 42.</p>
            <p>&gt; Corrigiendo expiración y reintentando...</p>
          </div>
          <p className="text-[#7ee787]">PASS src/auth/session.test.ts</p>
          <p className="text-[#7ee787]">✓ 4 tests pasaron (100% ok)</p>
        </div>
      </Window>
    </div>

    <Nota>El bucle de ejecución prueba el código antes de mandar el diff.</Nota>
  </Slide>,

  // 6. Paso 4: Preview de Pull Request en GitHub con checks de CI
  <Slide tone="surface">
    <h1 className="font-display text-[40px] font-extrabold leading-[0.98] tracking-[-0.03em]">
      4. Pull Request redactado
    </h1>
    <p className="mt-2 text-[18px] text-ink">
      Genera la rama, resume cambios y abre el PR.
    </p>

    <div className="my-auto">
      <Window title="github.com/repo/pull/48">
        <div className="p-4 font-mono text-[14px] leading-relaxed text-[#e6edf3]">
          <p className="text-[#7ee787]">✓ Open #48: fix(auth): invalidate tokens</p>
          <p className="text-[#8b949e]">Diff: +28 -6 en 2 archivos</p>
          <div className="my-2 border-t border-white/10 pt-2 text-[14px]">
            <p className="text-[#7ee787]">✓ CI / test (node 20): passed</p>
            <p className="text-[#7ee787]">✓ linter / eslint: passed</p>
            <p className="text-[#58a6ff]">&gt; Rama lista para revisión de equipo</p>
          </div>
        </div>
      </Window>
    </div>

    <Nota>El humano solo hace code review sobre el diff verificado.</Nota>
  </Slide>,

  // 7. Cierre: Matriz compacta + CTA
  <Slide>
    <h1 className="font-display text-[34px] font-extrabold leading-[1.02] tracking-[-0.03em]">
      Tu rol ya no es picar código repetitivo: es dirigir la arquitectura y revisar los diffs.
    </h1>

    <div data-ui className="my-auto grid grid-cols-2 gap-2.5 py-2">
      <div className="rounded-xl border border-black/10 bg-surface p-3">
        <p className="text-[16px] font-bold text-ink">01. Plan técnico</p>
        <Nota>Riesgos y arquitectura</Nota>
      </div>
      <div className="rounded-xl border border-black/10 bg-surface p-3">
        <p className="text-[16px] font-bold text-ink">02. De ticket a diff</p>
        <Nota>Parches multi-archivo</Nota>
      </div>
      <div className="rounded-xl border border-black/10 bg-surface p-3">
        <p className="text-[16px] font-bold text-ink">03. Tests en local</p>
        <Nota>Autocorrección de fallos</Nota>
      </div>
      <div className="rounded-xl border border-black/10 bg-surface p-3">
        <p className="text-[16px] font-bold text-ink">04. Pull Request</p>
        <Nota>Documentado con CI</Nota>
      </div>
    </div>

    <div className="rounded-xl border border-accent/20 bg-surface p-4 flex items-center justify-between">
      <p data-cta className="text-[16px] font-semibold text-ink">
        La lámina de los 4 pasos tiene el flujo completo. Guárdala para tu próxima tarea compleja.
      </p>
      <Gesto accion="guardar" lleno size={44} className="text-accent ml-3 shrink-0" />
    </div>

    <Nota className="mt-auto pt-2">
      Fuentes: Anthropic y GitHub CLI. Info al 18 oct 2026.
    </Nota>
  </Slide>,
];
