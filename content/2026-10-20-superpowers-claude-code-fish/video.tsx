import type { ReactNode } from "react";
import { Anim, animStyle, Gesto, Icono, Logo, Nota, Objeto } from "@motor/ui";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AppCard,
  Chat,
  Chip,
  DataTable,
  defineVideo,
  SceneFrame,
  Terminal,
  useCue,
  type TerminalLine,
} from "@motor/video";

function useSegundos() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
}

function Escena({ titulo, ancla, children }: { titulo: string; ancla?: ReactNode; children: ReactNode }) {
  return (
    <SceneFrame title={titulo} anchor={ancla}>
      {children}
    </SceneFrame>
  );
}

// 1. Gancho: El encargo ambiguo del jefe
function Gancho() {
  const abras = useCue("abras");
  const pedidos = useCue("pedidos");
  return (
    <Escena titulo="Tu jefe te pidió un proyecto" ancla={<Logo slug="claudecode" size={56} />}>
      <Chat
        title="Jefe de Producto"
        subtitle="hace 2 min • en #desarrollo"
        messages={[
          {
            from: "them",
            text: "«Haz una plataforma para gestionar pedidos en la nube. Sencilla pero escalable».",
          },
          {
            from: "me",
            text: "¿Tenemos contratos de API o pasarelas de pago?",
            at: 1.8,
          },
          {
            from: "them",
            text: "No hay tiempo: que la IA lo programe rápido.",
            at: 3.2,
          },
        ]}
      />

      <div data-ui className="mt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Chip tone="accent">Claude Code</Chip>
          <span className="text-muted text-[13px]">en espera</span>
        </div>
        <Anim efecto="salta" en={abras} dur={0.4}>
          <Chip tone="solid" dot>
            ¡NO ABRAS EL EDITOR!
          </Chip>
        </Anim>
      </div>

      <Anim efecto="aparece" en={pedidos} dur={0.4}>
        <div data-ui className="mt-4">
          <div className="rounded-lg border border-accent/40 bg-accent/10 p-3 text-center">
            <span className="text-[14px] font-mono text-accent font-semibold">
              # Deténte: no generes código a ciegas
            </span>
          </div>
        </div>
      </Anim>
    </Escena>
  );
}

// 2. El problema vs Superpowers
function ElProblema() {
  const trampa = useCue("trampa");
  const superpowers = useCue("Superpowers");
  const siete = useCue("siete");
  const teclado = useCue("teclado");
  return (
    <Escena titulo="Vibe coding vs Ingeniería">
      <div data-ui className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-surface p-3">
          <div className="text-[12px] font-semibold text-muted uppercase tracking-wider">Vibe coding</div>
          <div className="mt-2 space-y-1 text-[13px] font-mono text-ink/80">
            <div>• Código a ciegas</div>
            <div>• Requisitos alucinados</div>
            <div className="text-accent">• Bugs en producción</div>
          </div>
        </div>

        <Anim efecto="aparece" en={superpowers} dur={0.4}>
          <div className="rounded-lg border border-accent/40 bg-accent/10 p-3">
            <div className="text-[12px] font-semibold text-accent uppercase tracking-wider">Superpowers</div>
            <div className="mt-2 space-y-1 text-[13px] font-mono text-ink">
              <div>✓ 7 etapas guiadas</div>
              <div>✓ TDD obligatorio</div>
              <div className="text-accent">✓ Ingeniería senior</div>
            </div>
          </div>
        </Anim>
      </div>

      <div data-ui className="mt-4">
        <Terminal
          lines={[
            { text: "$ claude --dangerously-skip-permissions", kind: "cmd" },
            { text: "FAIL: Missing specs, 28 tests broken", kind: "error", at: trampa },
            { text: "Activando framework: obra/superpowers...", kind: "ok", at: siete },
            { text: "✓ Modo ingeniería activado", kind: "ok", at: teclado },
          ]}
          small
        />
      </div>

      <div data-ui className="mt-3">
        <Nota>
          Superpowers convierte al agente en un ingeniero senior disciplinado.
        </Nota>
      </div>
    </Escena>
  );
}

// 3. Etapa 1: Brainstorming socrático
function Brainstorming() {
  const codigo = useCue("código");
  const pregunta = useCue("pregunta");
  const entran = useCue("entran");
  const pasarelas = useCue("pasarelas");
  return (
    <Escena titulo="1. Brainstorming socrático" ancla={<Logo slug="claudecode" size={56} />}>
      <div data-ui>
        <Terminal
          lines={[
            { text: "/superpowers:brainstorming", kind: "cmd" },
            { text: "Explorando contexto de pedidos...", kind: "out", at: 1.5 },
            { text: "? ¿Cómo ingresan los pedidos al sistema?", kind: "ok", at: pregunta },
            { text: "  -> Webhooks de Shopify y API REST", kind: "out", at: entran },
            { text: "? ¿Qué pasarelas de pago se admiten?", kind: "ok", at: pasarelas },
            { text: "  -> Stripe y transferencias directas", kind: "out", at: pasarelas + 0.8 },
          ]}
          small
        />
      </div>

      <div data-ui className="mt-4 flex items-center justify-between">
        <Anim efecto="aparece" en={codigo} dur={0.3}>
          <Chip tone="solid" dot>
            Código bloqueado
          </Chip>
        </Anim>
        <span className="text-[13px] text-muted font-mono">Diseño primero, código después</span>
      </div>

      <div data-ui className="mt-3">
        <Nota>
          El agente formula preguntas una a una para desambiguar el negocio.
        </Nota>
      </div>
    </Escena>
  );
}

// 4. Etapa 2: Spec (Especificación técnica)
function Spec() {
  const especificacion = useCue("especificación");
  const modelo = useCue("Order");
  const contratos = useCue("contratos");
  return (
    <Escena titulo="2. Especificación técnica">
      <div data-ui>
        <AppCard logo="claudecode" domain="spec.md" label="Diseño técnico aprobado" at={0.3}>
          <div className="font-mono text-[13px] text-ink/90 space-y-1">
            <div className="text-accent font-semibold">type Order = &#123;</div>
            <div className="pl-3">id: UUID; customerId: string;</div>
            <div className="pl-3">items: OrderItem[]; total: number;</div>
            <div className="pl-3">status: 'pending' | 'paid';</div>
            <div className="text-accent font-semibold">&#125;;</div>
          </div>
        </AppCard>
      </div>

      <div data-ui className="mt-4 space-y-2">
        <Anim efecto="aparece" en={especificacion} dur={0.3}>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-2.5">
            <Chip tone="line">spec.md</Chip>
            <span className="text-[13px] text-ink font-mono">Reglas de negocio y esquemas</span>
          </div>
        </Anim>
        <Anim efecto="aparece" en={modelo} dur={0.3}>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-2.5">
            <Chip tone="accent">POST /api/orders</Chip>
            <span className="text-[13px] text-ink font-mono">Crea pedidos con validación</span>
          </div>
        </Anim>
        <Anim efecto="aparece" en={contratos} dur={0.3}>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-2.5">
            <Chip tone="line">POST /webhooks/stripe</Chip>
            <span className="text-[13px] text-muted font-mono">Idempotencia y firma criptográfica</span>
          </div>
        </Anim>
      </div>

      <div data-ui className="mt-2">
        <Nota>
          Contratos y esquema de datos validados antes de programar.
        </Nota>
      </div>
    </Escena>
  );
}

// 5. Etapa 3: Plan en tareas atómicas
function Plan() {
  const cinco = useCue("cinco");
  const endpoint = useCue("endpoint");
  const criterio = useCue("criterio");
  return (
    <Escena titulo="3. Plan en tareas atómicas">
      <div data-ui>
        <DataTable
          rows={[
            { label: "1. Migración y tabla orders", value: "spec.md", tone: "accent" },
            { label: "2. Validador de stock y precios", value: "spec.md", at: cinco },
            { label: "3. Webhook de Stripe con firma", value: "spec.md", at: cinco + 0.8 },
            { label: "4. Endpoints REST autenticados", value: "spec.md", at: endpoint },
            { label: "5. Manejador de idempotencia", value: "spec.md", at: criterio },
          ]}
        />
      </div>

      <div data-ui className="mt-4 flex items-center justify-between">
        <Chip tone="line" dot>
          5 tareas atómicas
        </Chip>
        <span className="text-[13px] text-muted font-mono">Criterio de éxito por tarea</span>
      </div>

      <div data-ui className="mt-2">
        <Nota>
          Cada módulo se define con entradas y salidas exactas.
        </Nota>
      </div>
    </Escena>
  );
}

// 6. Etapa 4: TDD Estricto
function Tdd() {
  const prueba = useCue("prueba");
  const rojo = useCue("rojo");
  const codigo = useCue("código");
  const verde = useCue("verde");
  return (
    <Escena titulo="4. TDD estricto">
      <div data-ui>
        <Terminal
          lines={[
            { text: "npm test test/order.test.ts", kind: "cmd", at: 0.3 },
            { text: "Ejecutando suite de pruebas unitarias...", kind: "out", at: prueba },
            { text: "FAIL: Order total must match items sum", kind: "error", at: rojo },
            { text: "// Escribiendo implementación mínima...", kind: "cmd", at: codigo },
            { text: "PASS test/order.test.ts (12 tests)", kind: "ok", at: verde },
          ]}
          small
        />
      </div>

      <div data-ui className="mt-4 grid grid-cols-3 gap-2">
        <Anim efecto="aparece" en={rojo} dur={0.3}>
          <div className="rounded-lg border border-border bg-surface p-2.5 text-center">
            <div className="text-[13px] font-bold text-accent">1. Rojo</div>
            <div className="mt-1 text-[12px] text-muted">Test falla</div>
          </div>
        </Anim>
        <Anim efecto="aparece" en={verde} dur={0.3}>
          <div className="rounded-lg border border-accent/40 bg-accent/10 p-2.5 text-center">
            <div className="text-[13px] font-bold text-accent">2. Verde</div>
            <div className="mt-1 text-[12px] text-accent font-semibold">Código mínimo</div>
          </div>
        </Anim>
        <Anim efecto="aparece" en={verde + 0.4} dur={0.3}>
          <div className="rounded-lg border border-border bg-surface p-2.5 text-center">
            <div className="text-[13px] font-bold text-ink">3. Refactor</div>
            <div className="mt-1 text-[12px] text-muted">Limpieza</div>
          </div>
        </Anim>
      </div>

      <div data-ui className="mt-3">
        <div className="rounded-lg border border-border/80 bg-surface/60 p-2.5 flex items-center justify-between">
          <Chip tone="line">Coverage</Chip>
          <span className="font-mono text-[13px] text-ink">100% líneas críticas cubiertas</span>
        </div>
      </div>

      <div data-ui className="mt-2">
        <Nota>
          Superpowers prohíbe implementar sin ver fallar la prueba primero.
        </Nota>
      </div>
    </Escena>
  );
}

// 7. Etapa 5: Subagent Development
function Subagentes() {
  const modulos = useCue("módulos");
  const limpias = useCue("limpias");
  const aislados = useCue("aislados");
  return (
    <Escena titulo="5. Subagent development">
      <div data-ui className="space-y-2.5">
        <div className="rounded-xl border border-border bg-surface p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Chip tone="accent">Subagente A</Chip>
              <span className="font-mono text-[13px] text-ink">rama /orders-api</span>
            </div>
            <span className="text-[12px] text-muted font-mono">aislado</span>
          </div>
          <p className="mt-1.5 text-[13px] text-muted">
            Controladores REST y validación de esquema.
          </p>
        </div>

        <Anim efecto="aparece" en={modulos} dur={0.4}>
          <div className="rounded-xl border border-border bg-surface p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Chip tone="line">Subagente B</Chip>
                <span className="font-mono text-[13px] text-ink">rama /stripe-webhook</span>
              </div>
              <span className="text-[12px] text-accent font-mono">en progreso</span>
            </div>
            <p className="mt-1.5 text-[13px] text-muted">
              Firmas criptográficas y reintentos de pago.
            </p>
          </div>
        </Anim>
      </div>

      <div data-ui className="mt-3">
        <Terminal
          lines={[
            { text: "git worktree add ../orders-api branch-orders", kind: "cmd", at: limpias },
            { text: "✓ Contexto aislado en rama independiente", kind: "ok", at: aislados },
          ]}
          small
        />
      </div>

      <div data-ui className="mt-3 flex items-center justify-between">
        <Chip tone="solid">Git worktrees</Chip>
        <span className="text-[13px] text-muted">Sin saturar la sesión principal</span>
      </div>
    </Escena>
  );
}

// 8. Etapas 6 y 7: Review y Finalize
function ReviewFinalize() {
  const finalize = useCue("Finalize");
  const requisitos = useCue("requisitos");
  const suite = useCue("suite");
  const rama = useCue("rama");
  return (
    <Escena titulo="6 y 7. Review y Finalize">
      <div data-ui>
        <Terminal
          lines={[
            { text: "$ claude review --spec spec.md", kind: "cmd", at: 0.5 },
            { text: "✓ Revisión de código: APROBADA", kind: "ok", at: finalize },
            { text: "$ npm test -- --coverage", kind: "cmd", at: requisitos },
            { text: "PASS: 38/38 tests passing (100%)", kind: "ok", at: suite },
            { text: "Ready to merge branch: feature/orders", kind: "out", at: rama },
          ]}
          small
        />
      </div>

      <div data-ui className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-surface p-3">
          <div className="text-[13px] font-semibold text-ink">6. Review</div>
          <div className="mt-1 text-[12px] text-muted font-mono">Auditoría contra spec.md</div>
        </div>
        <Anim efecto="aparece" en={rama} dur={0.3}>
          <div className="rounded-lg border border-accent/40 bg-accent/10 p-3">
            <div className="text-[13px] font-semibold text-accent">7. Finalize</div>
            <div className="mt-1 text-[12px] text-accent font-mono">Lista para pull request</div>
          </div>
        </Anim>
      </div>

      <div data-ui className="mt-2">
        <Nota>
          El trabajo concluye con verificación real y opciones de integración.
        </Nota>
      </div>
    </Escena>
  );
}

// 9. Cierre: Resultado del proyecto y cómo instalarlo
function Cierre() {
  const pedidos = useCue("pedidos");
  const pruebas = useCue("pruebas");
  const superpowers = useCue("Superpowers");
  const proximo = useCue("próximo");
  return (
    <Escena titulo="Tu proyecto terminado" ancla={<Logo slug="claudecode" size={56} />}>
      <div data-ui>
        <Terminal
          lines={[
            { text: "/plugin marketplace add obra", kind: "cmd", at: 0.3 },
            { text: "✓ Marketplace registrado", kind: "ok", at: pedidos },
            { text: "/plugin install superpowers", kind: "cmd", at: pruebas },
            { text: "✓ 7 skills de ingeniería activas", kind: "ok", at: superpowers },
          ]}
          small
        />
      </div>

      <div className="mt-5 flex flex-col items-center justify-center gap-2.5 text-center">
        <Anim efecto="salta" en={proximo} dur={0.45}>
          <Gesto accion="guardar" size={64} lleno className="text-accent" />
        </Anim>
        <Anim efecto="aparece" en={proximo + 0.3} className="font-display text-[26px] font-black text-ink">
          Guárdalo para tu próximo proyecto
        </Anim>
        <div data-ui className="text-[13px] text-muted max-w-[340px]">
          Plataforma terminada, documentada y testeada con rigor profesional.
        </div>
        <div data-ui className="mt-1 flex items-center justify-center gap-2">
          <Chip tone="line">obra / superpowers</Chip>
          <span className="text-[12px] text-muted font-mono">Código libre (MIT)</span>
        </div>
      </div>
    </Escena>
  );
}

export default defineVideo({
  music: { file: "audio/cama.mp3" },
  captions: "marker",
  chapters: true,
  scenes: [
    { id: "gancho", chapter: "El encargo", sfx: [{ asset: "whoosh", at: "abras", volume: 0.25 }], Visual: Gancho },
    { id: "el-problema", tone: "surface", chapter: "Vibe coding", sfx: [{ asset: "page-turn", at: "siete", volume: 0.35 }], Visual: ElProblema },
    { id: "brainstorming", chapter: "Brainstorming", sfx: [{ asset: "whoosh", at: "pregunta", volume: 0.3 }], Visual: Brainstorming },
    { id: "spec", tone: "surface", chapter: "Spec", sfx: [{ asset: "page-turn", at: "Order", volume: 0.35 }], Visual: Spec },
    { id: "plan", chapter: "Plan", sfx: [{ asset: "page-turn", at: "cinco", volume: 0.35 }], Visual: Plan },
    { id: "tdd", tone: "surface", chapter: "TDD", sfx: [{ asset: "whoosh", at: "verde", volume: 0.3 }], Visual: Tdd },
    { id: "subagentes", chapter: "Subagentes", sfx: [{ asset: "page-turn", at: "limpias", volume: 0.35 }], Visual: Subagentes },
    { id: "review-finalize", tone: "surface", chapter: "Review", sfx: [{ asset: "whoosh", at: "suite", volume: 0.3 }], Visual: ReviewFinalize },
    { id: "cierre", chapter: "Final", sfx: [{ asset: "page-turn", at: "próximo", volume: 0.4 }], Visual: Cierre },
  ],
});
