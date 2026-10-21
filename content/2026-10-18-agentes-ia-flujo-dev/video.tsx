import type { ReactNode } from "react";
import { Anim, animStyle, Gesto, Icono, Logo, Nota } from "@motor/ui";
import { AppCard, BrowserBar, Chat, Chip, DataTable, Diff, defineVideo, Phone, SceneFrame, Terminal, useCue } from "@motor/video";

/*
 * Video de la pieza "4 tareas de dev para tu agente": el camino de un agente
 * de código del issue al pull request. Los datos salen de facts.json; el guion,
 * de video.json. Es la primera pieza del kit de escenario (packages/video/src/
 * kit/stage.tsx): cada escena pasa dentro de una interfaz que un dev reconoce,
 * con la barra de capítulos y los subtítulos en píldora.
 *
 * El issue 42, login.ts, el diff y las salidas de los tests son un ejemplo
 * ilustrativo, y así se rotulan. Los comandos (gh issue view, npm test) son
 * reales. El logo de GitHub es el oficial de Simple Icons, sin modificar.
 * La cama de música es la del piloto (Lyria, registrada en el generated.json
 * del ray tracing).
 */

function Escena({ titulo, ancla, alto, children }: { titulo: string; ancla?: ReactNode; alto?: number; children: ReactNode }) {
  return (
    <SceneFrame title={titulo} anchor={ancla} height={alto}>
      {children}
    </SceneFrame>
  );
}

const Ejemplo = ({ className }: { className?: string }) => <Nota className={className}>Ejemplo ilustrativo.</Nota>;

// 1. El gancho: el antes y el después, desde el cuadro 1 (es la portada).
// A la izquierda, el chat donde se pega el error a mano, que se apaga; a la
// derecha, GitHub, donde el issue se vuelve pull request.
function Gancho() {
  const agente = useCue("agente");
  const pull = useCue("pull");
  return (
    <Escena titulo="Deja de pegar errores" ancla={<Logo slug="github" size={52} />} alto={500}>
      <BrowserBar domain="github.com" path="/tu-equipo/app/issues/42" />
      <div className="absolute left-0 top-[78px] flex w-[222px] flex-col gap-3">
        <Chip>A mano</Chip>
        <Chat
          title="Chat"
          subtitle="tú pegas, él adivina"
          messages={[
            { from: "me", text: "¿por qué falla esto?" },
            { from: "me", text: "TypeError: email is undefined" },
            { from: "them", text: "Pégame el archivo completo" },
          ]}
        />
      </div>
      {/* Con "agente", el chat se apaga: un velo del color del fondo. */}
      <div className="absolute left-0 top-[78px] h-[340px] w-[222px] rounded-2xl bg-bg opacity-60" data-anim="aparece" style={animStyle({ en: agente, dur: 0.5 })} />
      <div className="absolute left-[246px] top-[78px] flex w-[222px] flex-col gap-3">
        <Chip tone="accent" dot>
          Agente
        </Chip>
        <AppCard logo="github" domain="github.com" label="tu-equipo/app">
          <div className="flex flex-col items-start gap-3">
            <Chip>Issue #42</Chip>
            <Icono name="arrow-down" size={26} strokeWidth={2.5} ancla={false} className="ml-6 text-accent" />
            <Chip tone="solid" at={pull}>
              Pull request
            </Chip>
          </div>
        </AppCard>
      </div>
    </Escena>
  );
}

// 2. Lee el issue: la terminal escribe el comando real de la CLI de GitHub y
// abajo se abre la tarjeta del issue.
function Lee() {
  const issue = useCue("issue.");
  const gh = useCue("gh");
  const github = useCue("github");
  return (
    <Escena titulo="Primero, el issue">
      <BrowserBar domain="github.com" path="/tu-equipo/app/issues/42" at={issue} className="mb-4" />
      <Terminal
        lines={[
          { text: "gh issue view 42", kind: "cmd", at: gh },
          { text: "El login falla con correos en mayúsculas", kind: "out", at: gh + 0.9 },
          { text: "abierto · bug · #42", kind: "out", at: gh + 1.1 },
        ]}
      />
      <AppCard logo="github" domain="github.com" label="tu-equipo/app · issue #42" at={github} className="mt-5">
        <p className="text-[18px] font-semibold leading-snug">El login falla con correos en mayúsculas</p>
        <div className="mt-3 flex gap-2">
          <Chip tone="accent">Bug</Chip>
          <Chip>Abierto</Chip>
        </div>
      </AppCard>
      <Ejemplo className="mt-4" />
    </Escena>
  );
}

// 3. Busca en el repositorio: los archivos se marcan como leídos uno por uno,
// y el agente dice lo que encontró, que es lo que cambia la escena siguiente.
function Busca() {
  const busca = useCue("busca");
  const lee = useCue("lee");
  const tests = useCue("tests");
  const como = useCue("como");
  const tu = useCue("tú");
  return (
    <Escena titulo="Busca en el repo">
      <Chip dot at={busca}>
        Buscando: login
      </Chip>
      <DataTable
        className="mt-5"
        title="tu-equipo/app/src"
        rows={[
          { label: "auth/login.ts", value: "leído", tone: "good", at: lee },
          { label: "auth/login.test.ts", value: "leído", tone: "good", at: tests },
          { label: "auth/session.ts", value: "leído", tone: "good", at: tests + 0.5 },
          { label: "users/email.ts", value: "leído", tone: "good", at: tu },
        ]}
      />
      <Chat className="mt-4" title="Agente" subtitle="lo que encontró" messages={[{ from: "them", text: "El correo se compara sin pasar a minúsculas.", at: como }]} />
      <Ejemplo className="mt-4" />
    </Escena>
  );
}

// 4. Aplica el parche: el diff de login.ts, y copiar y pegar se tachan.
function Cambia() {
  const parche = useCue("parche");
  const copia = useCue("copia");
  const pega = useCue("pega");
  return (
    <Escena titulo="Aplica el parche">
      <Chat className="mb-4" title="Agente" subtitle="el cambio" messages={[{ from: "them", text: "Paso el correo a minúsculas antes de comparar.", at: parche - 0.6 }]} />
      <Diff
        file="src/auth/login.ts"
        lines={[
          { text: "export function login(email, saved) {" },
          { text: "  return email === saved;", kind: "del", at: parche },
          { text: "  return email.toLowerCase() === saved;", kind: "add", at: parche + 0.5 },
          { text: "}" },
        ]}
      />
      <div className="mt-4 flex gap-3">
        <Chip tone="accent" at={parche + 0.9}>
          1 archivo
        </Chip>
        <Chip tone="accent" at={parche + 1.1}>
          +1 −1
        </Chip>
      </div>
      <div className="mt-3 flex gap-3">
        <Chip at={copia} className="line-through decoration-2 opacity-60">
          Copiar
        </Chip>
        <Chip at={pega} className="line-through decoration-2 opacity-60">
          Pegar
        </Chip>
      </div>
      <Ejemplo className="mt-4" />
    </Escena>
  );
}

// 5. Corre los tests: falla uno en rojo, el agente lee el error, se corrige
// y la segunda vez todo pasa en verde.
function Prueba() {
  const tests = useCue("tests");
  const falla = useCue("falla");
  const error = useCue("error");
  const terminal = useCue("terminal");
  const corrige = useCue("corrige");
  return (
    <Escena titulo="Corre los tests">
      <Terminal
        lines={[
          { text: "npm test", kind: "cmd", at: tests - 0.3 },
          { text: "✗ login acepta correos en mayúsculas", kind: "error", at: falla },
          { text: "  esperado: true · recibido: false", kind: "out", at: falla + 0.3 },
          { text: "npm test", kind: "cmd", at: terminal },
          { text: "✓ todos los tests pasan", kind: "ok", at: corrige },
        ]}
      />
      <div className="mt-4">
        <Chip tone="accent" dot at={error}>
          Lee el error y corrige
        </Chip>
      </div>
      <DataTable
        className="mt-4"
        rows={[
          { label: "Intento 1", value: "falla", tone: "bad", at: falla },
          { label: "Intento 2", value: "pasa", tone: "good", at: corrige },
        ]}
      />
      <Ejemplo className="mt-4" />
    </Escena>
  );
}

// 6. Abre el pull request: la notificación en el teléfono y, al lado, su
// ficha. La revisión es tuya.
function Pr() {
  const pull = useCue("pull");
  const descripcion = useCue("descripción");
  const revisas = useCue("revisas");
  return (
    <Escena titulo="Tú lo revisas" alto={480}>
      <div className="absolute left-0 top-0">
        <Phone width={228}>
          <p className="mt-6 text-center text-[44px] font-semibold leading-none tracking-tight">9:41</p>
          <p className="mt-1 text-center text-[13px] text-black/50">martes</p>
          <AppCard logo="github" domain="GitHub" label="ahora" at={pull} className="mt-8 border-black/10 bg-[#F2F4F7] text-[#16181C]">
            <p className="text-[14px] font-semibold leading-snug">Pull request #43 abierto</p>
            <p className="mt-1 text-[13px] leading-snug text-black/60">Arregla el login con correos en mayúsculas</p>
          </AppCard>
        </Phone>
      </div>
      <div className="absolute left-[248px] top-[40px] w-[220px]">
        <DataTable
          title="Pull request #43"
          rows={[
            { label: "Cierra", value: "#42", at: descripcion },
            { label: "Archivos", value: "2", at: descripcion + 0.25 },
            { label: "Tests", value: "pasan", tone: "good", at: descripcion + 0.5 },
          ]}
        />
        <div className="mt-4">
          <Chip tone="solid" at={revisas}>
            Revisión: tú
          </Chip>
        </div>
        <Ejemplo className="mt-4" />
      </div>
    </Escena>
  );
}

// 7. Cierre: el camino completo en una fila de pasos, que SWE-bench mide de
// punta a punta, y el gesto de guardar.
const PASOS = ["Lee el issue", "Busca en el repo", "Aplica el parche", "Corre los tests", "Abre el pull request"];

function Cierre() {
  const swe = useCue("swe-bench");
  const verde = useCue("verde");
  const guardalo = useCue("guárdalo");
  return (
    <Escena titulo="Del issue al verde">
      <Chip dot tone="accent" at={swe}>
        SWE-bench
      </Chip>
      <div data-ui className="mt-4 flex flex-col gap-2">
        {PASOS.map((paso, i) => (
          <Anim key={paso} efecto="aparece" en={swe + 0.3 + i * 0.25} className="flex items-center gap-3 rounded-xl border border-ink/12 bg-surface px-4 py-2.5">
            <span className="font-mono text-[14px] font-semibold text-muted">0{i + 1}</span>
            <span className="text-[18px] font-semibold">{paso}</span>
            {i === PASOS.length - 2 ? (
              <span className="ml-auto font-mono text-[14px] font-semibold text-[#1A7F37]" data-anim="aparece" style={animStyle({ en: verde })}>
                ✓ verde
              </span>
            ) : null}
          </Anim>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <Anim efecto="salta" en={guardalo} dur={0.45}>
          <Gesto accion="guardar" size={72} lleno className="text-accent" />
        </Anim>
        <Anim efecto="aparece" en={guardalo + 0.3} className="font-display text-[32px] font-extrabold text-accent">
          Guárdalo
        </Anim>
      </div>
    </Escena>
  );
}

export default defineVideo({
  music: { file: "audio/cama.mp3" },
  captions: "pill",
  chapters: true,
  scenes: [
    { id: "gancho", chapter: "El gancho", sfx: [{ asset: "whoosh", at: "pull", volume: 0.3 }], Visual: Gancho },
    { id: "lee", tone: "surface", chapter: "Lee el issue", sfx: [{ asset: "page-turn", at: "gh", volume: 0.4 }], Visual: Lee },
    { id: "busca", chapter: "Busca", Visual: Busca },
    { id: "cambia", tone: "surface", chapter: "Aplica el parche", sfx: [{ asset: "whoosh", at: "parche", volume: 0.25 }], Visual: Cambia },
    { id: "prueba", chapter: "Corre los tests", sfx: [{ asset: "page-turn", at: "corrige", volume: 0.4 }], Visual: Prueba },
    { id: "pr", tone: "surface", chapter: "Abre el PR", sfx: [{ asset: "whoosh", at: "pull", volume: 0.3 }], Visual: Pr },
    { id: "cierre", chapter: "Cierre", sfx: [{ asset: "page-turn", at: "guárdalo", volume: 0.4 }], Visual: Cierre },
  ],
});
