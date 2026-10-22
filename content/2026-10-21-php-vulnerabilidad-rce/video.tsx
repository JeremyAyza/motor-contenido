import type { ReactNode } from "react";
import { Anim, Gesto, Logo, Nota } from "@motor/ui";
import {
  Chip,
  DataTable,
  defineVideo,
  SceneFrame,
  Terminal,
  useCue,
} from "@motor/video";

function Escena({
  titulo,
  ancla,
  subrayado = false,
  children,
}: {
  titulo: string;
  ancla?: ReactNode;
  subrayado?: boolean;
  children: ReactNode;
}) {
  return (
    <SceneFrame title={titulo} anchor={ancla} underline={subrayado}>
      {children}
    </SceneFrame>
  );
}

// 1. Gancho: Todos dicen que PHP murió
function Gancho() {
  const setenta = useCue("setenta");
  const compras = useCue("compras");

  return (
    <Escena
      titulo="Todos dicen que PHP murió"
      ancla={<Logo slug="php" size={56} />}
    >
      <div data-ui className="rounded-2xl border border-ink/12 bg-surface p-5 text-center">
        <div className="flex items-center justify-between">
          <Chip tone="line">Cuota de backend</Chip>
          <span className="font-mono text-[13px] text-muted">W3Techs</span>
        </div>

        <div className="my-3 font-display text-[64px] font-black leading-none tracking-tighter text-accent">
          ~70%
        </div>

        <p className="text-[13px] text-ink/80">
          de las webs con tecnología de servidor conocida usan PHP.
        </p>
      </div>

      <Anim efecto="aparece" en={setenta} dur={0.35} className="w-full">
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Chip tone="line" className="justify-center">WordPress</Chip>
          <Chip tone="line" className="justify-center">Wikipedia</Chip>
          <Chip tone="line" className="justify-center">Laravel</Chip>
          <Chip tone="line" className="justify-center">Drupal</Chip>
        </div>
      </Anim>

      <Anim efecto="aparece" en={compras} dur={0.35} className="w-full">
        <div data-ui className="mt-4 rounded-xl border border-border bg-surface p-3.5 text-center">
          <span className="text-[13px] font-semibold text-ink">
            Aunque nunca hayas escrito una línea de código
          </span>
          <p className="mt-1 text-[12px] text-muted">
            Tus compras, tus lecturas y tus datos pasan a diario por sus servidores.
          </p>
        </div>
      </Anim>
    </Escena>
  );
}

// 2. Crisis: Alerta en la infraestructura
function Crisis() {
  const fallos = useCue("fallos");
  const remoto = useCue("remoto");

  return (
    <Escena
      titulo="Alerta en la infraestructura"
      ancla={<Logo slug="php" size={56} />}
    >
      <div data-ui className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2">
          <Chip tone="solid" dot>
            CVSS 9.2 CRÍTICO
          </Chip>
          <span className="text-[13px] text-muted font-mono">
            CVE-2026-109618 / 19
          </span>
        </div>

        <Anim efecto="salta" en={fallos} dur={0.4}>
          <div className="mt-4 w-full rounded-xl border border-accent/40 bg-accent/10 p-4 text-center">
            <div className="font-mono text-[15px] font-bold text-accent">
              Parches de emergencia en el core
            </div>
            <div className="mt-1 text-[12px] text-ink/80">
              Dos fallos críticos de ejecución remota de código (RCE)
            </div>
          </div>
        </Anim>

        <Anim efecto="aparece" en={remoto} dur={0.35}>
          <div className="mt-4 w-full rounded-xl border border-border bg-surface p-4 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-ink font-mono">Impacto en producción</span>
              <Chip tone="line">Sin credenciales</Chip>
            </div>
            <p className="mt-1.5 text-[13px] text-muted">
              Un servidor expuesto permite a un atacante ejecutar código arbitrario sin login.
            </p>
          </div>
        </Anim>
      </div>

      <div data-ui className="mt-5">
        <Nota>
          The PHP Foundation emitió avisos urgentes para todas las ramas activas.
        </Nota>
      </div>
    </Escena>
  );
}

// 3. Mecanismos: Cómo se rompe la memoria
function Mecanismos() {
  const proceso = useCue("proceso");
  const workers = useCue("workers");
  const liberada = useCue("liberada");

  return (
    <Escena titulo="Cómo se rompe la memoria">
      <div data-ui className="space-y-3">
        <div className="rounded-xl border border-border bg-surface p-3.5">
          <div className="flex items-center justify-between">
            <Chip tone="accent">Límite OOM</Chip>
            <span className="text-[12px] font-mono text-muted">CVE-2026-109618</span>
          </div>
          <div className="mt-1.5 text-[13px] font-mono text-ink">
            Petición supera memory_limit
          </div>
          <Anim efecto="aparece" en={proceso} dur={0.3}>
            <p className="mt-1 text-[12px] text-muted">
              PHP aborta abruptamente. Las rutinas de limpieza leen estructuras corruptas y ceden el control.
            </p>
          </Anim>
        </div>

        <Anim efecto="aparece" en={workers} dur={0.35}>
          <div className="rounded-xl border border-accent/40 bg-accent/10 p-3.5">
            <div className="flex items-center justify-between">
              <Chip tone="solid">Workers de Apache</Chip>
              <span className="text-[12px] font-mono text-accent font-semibold">CVE-2026-109619</span>
            </div>
            <div className="mt-1.5 text-[13px] font-mono text-ink">
              Use-After-Free en procesos persistentes
            </div>
            <Anim efecto="aparece" en={liberada} dur={0.3}>
              <p className="mt-1 text-[12px] text-muted">
                Un error fatal deja punteros huérfanos. La petición siguiente reutiliza esa memoria liberada.
              </p>
            </Anim>
          </div>
        </Anim>
      </div>

      <div data-ui className="mt-4">
        <Nota>
          El fallo reside en el intérprete del servidor, no en el código de tu web.
        </Nota>
      </div>
    </Escena>
  );
}

// 4. Versiones: Parches y código abandonado
function Versiones() {
  const peligro = useCue("peligro");
  const paquetes = useCue("paquetes");

  return (
    <Escena titulo="Parches y código viejo" ancla={<Logo slug="php" size={56} />}>
      <div data-ui>
        <div className="text-[12px] font-semibold text-muted uppercase tracking-wider mb-2">
          Ramas activas con parches upstream
        </div>
        <DataTable
          rows={[
            { label: "PHP 8.2", value: "8.2.35", tone: "accent" },
            { label: "PHP 8.3", value: "8.3.36", tone: "accent" },
            { label: "PHP 8.4", value: "8.4.27", tone: "accent" },
            { label: "PHP 8.5", value: "8.5.12", tone: "accent" },
          ]}
        />
      </div>

      <Anim efecto="aparece" en={peligro} dur={0.4}>
        <div data-ui className="mt-3.5 rounded-xl border border-border bg-surface p-3.5">
          <div className="flex items-center justify-between">
            <Chip tone="line">PHP 8.1 y anteriores</Chip>
            <span className="text-[12px] text-muted font-mono">EOL upstream</span>
          </div>
          <p className="mt-1 text-[12px] text-muted">
            No reciben parches de PHP.net. Dependen de parches retroportados de distribuciones como Ubuntu o Debian.
          </p>
        </div>
      </Anim>

      <Anim efecto="aparece" en={paquetes} dur={0.35}>
        <div data-ui className="mt-3">
          <Nota>
            El verdadero riesgo está en miles de servidores desactualizados.
          </Nota>
        </div>
      </Anim>
    </Escena>
  );
}

// 5. Cierre: La cadena de la web
function Cierre() {
  const servicio = useCue("servicio");
  const murió = useCue("murió");

  return (
    <Escena titulo="La cadena de la web" ancla={<Logo slug="php" size={56} />}>
      <div data-ui className="space-y-2.5">
        <div className="rounded-lg border border-border/80 bg-surface/60 p-2 flex items-center justify-between">
          <Chip tone="line">! Auditoría real</Chip>
          <span className="text-[12px] text-muted font-mono">
            php -v solo verifica la CLI local
          </span>
        </div>

        <Terminal
          lines={[
            { text: "$ systemctl status php*-fpm", kind: "cmd", at: 0.3 },
            { text: "✓ Revisa el servicio web real", kind: "ok", at: servicio },
            { text: "$ docker inspect --format '{{.Image}}' web", kind: "cmd", at: servicio + 1.2 },
            { text: "✓ Audita la imagen de tus contenedores", kind: "out", at: servicio + 2.0 },
          ]}
          small
        />
      </div>

      <div className="mt-4 flex flex-col items-center justify-center gap-1.5 text-center">
        <Anim efecto="salta" en={murió} dur={0.4}>
          <Gesto accion="guardar" size={56} lleno className="text-accent" />
        </Anim>
        <Anim efecto="aparece" en={murió + 0.2} className="font-display text-[22px] font-black text-ink">
          PHP no murió: sostiene tu web
        </Anim>
        <div data-ui className="text-[12px] text-muted max-w-[340px]">
          Guarda este post y comparte con quien administre tus servidores.
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
    { id: "gancho", chapter: "El mito", sfx: [{ asset: "whoosh", at: "murió", volume: 0.3 }], Visual: Gancho },
    { id: "crisis", tone: "surface", chapter: "Alerta", sfx: [{ asset: "page-turn", at: "alarmas", volume: 0.35 }], Visual: Crisis },
    { id: "mecanismos", chapter: "Memoria", sfx: [{ asset: "page-turn", at: "límite", volume: 0.35 }], Visual: Mecanismos },
    { id: "versiones", tone: "surface", chapter: "Versiones", sfx: [{ asset: "whoosh", at: "ramas", volume: 0.3 }], Visual: Versiones },
    { id: "cierre", chapter: "Auditoría", sfx: [{ asset: "page-turn", at: "cadena", volume: 0.4 }], Visual: Cierre },
  ],
});
