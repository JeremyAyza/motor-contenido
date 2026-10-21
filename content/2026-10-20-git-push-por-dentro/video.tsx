import type { ReactNode } from "react";
import { Anim, animStyle, Gesto, Icono, Logo, Nota, Objeto } from "@motor/ui";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AppCard,
  captureLines,
  Chip,
  DataTable,
  defineVideo,
  SceneFrame,
  Terminal,
  useCapture,
  useCue,
  type TerminalLine,
} from "@motor/video";

/*
 * El primer video del formato "un segundo por dentro" (docs/propuesta-reels-jacket.md):
 * todo lo que pasa en un git push. Los datos salen de facts.json y el guion de
 * video.json. Lo que muestran las terminales es la salida real de los comandos
 * de captures.json (npm run video:capture), y los números de la pantalla (303
 * objetos, 4 que viajan, 397 bytes) se leen de esa salida: nada se escribe a
 * mano. El repositorio es local y de prueba, y así se rotula.
 *
 * Dirección de arte: terminal (video.json → art). El logo de Git es el oficial
 * de Simple Icons, sin modificar. La cama de música es la del piloto (Lyria,
 * registrada en el generated.json del ray tracing).
 */

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

function useSegundos() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
}

function Escena({ titulo, ancla, alto, children }: { titulo: string; ancla?: ReactNode; alto?: number; children: ReactNode }) {
  return (
    <SceneFrame title={titulo} anchor={ancla} height={alto}>
      {children}
    </SceneFrame>
  );
}

/** Los pasos de la captura del push: ls-remote, count-objects y el push. */
function usePush() {
  const push = useCapture("push");
  const [lsRemote, countObjects, gitPush] = push.steps;
  const objetos = Number(/count: (\d+)/.exec(countObjects.output.join("\n"))?.[1]);
  const writing = /\((\d+)\/\d+\), (\d+) bytes/.exec(gitPush.output.join("\n"));
  return { lsRemote, countObjects, gitPush, objetos, viajaron: Number(writing?.[1]), bytes: Number(writing?.[2]) };
}

/** Las líneas de un paso que ya se escribió antes de la escena, y su salida desde `at`. */
function yaEscrito(step: { cmd: string; output: string[] }, keep: (line: string) => boolean, at: number, kind: (line: string) => TerminalLine["kind"] = () => "out"): TerminalLine[] {
  return [{ text: step.cmd, kind: "cmd" }, ...step.output.filter(keep).map((text, i) => ({ text: text.replace(/\t/g, "  "), kind: kind(text), at: at + i * 0.25 }))];
}

const Prueba = () => <Nota className="mt-3">Repositorio local de prueba. Corrió el 20 de octubre de 2026.</Nota>;

/** Una máquina del diagrama: la de Valeria o el servidor. */
function Lado({ icon, title, label, className }: { icon: string; title: string; label: string; className?: string }) {
  return (
    <div data-ui className={`flex w-[190px] flex-col items-center rounded-2xl border border-ink/15 bg-surface px-4 py-4 ${className ?? ""}`}>
      <Icono name={icon} size={52} strokeWidth={1.75} ancla={false} />
      <p className="mt-2 font-mono text-[17px] font-semibold">{title}</p>
      <p className="text-[14px] text-muted">{label}</p>
    </div>
  );
}

/**
 * Los objetos del repositorio, uno por cuadro. Desde `barrido`, los que el
 * servidor ya tiene se apagan uno tras otro y quedan encendidos los nuevos.
 */
function Objetos({ total, nuevos, barrido, enciende }: { total: number; nuevos: number; barrido: number; enciende?: number }) {
  const t = useSegundos();
  const brillo = enciende === undefined ? 1 : interpolate(t, [enciende, enciende + 0.4], [0.35, 1], CLAMP);
  return (
    <div data-ui className="flex flex-wrap gap-[3.6px]">
      {Array.from({ length: total }, (_, i) => {
        const nuevo = i >= total - nuevos;
        const hecho = t >= barrido + (i / total) * 0.9;
        const color = !hecho ? "bg-ink/25" : nuevo ? "bg-accent" : "bg-muted/35";
        return <div key={i} className={`size-[12px] rounded-[3px] ${color}`} style={nuevo && hecho ? { opacity: brillo } : undefined} />;
      })}
    </div>
  );
}

// 1. El gancho: la terminal de Valeria con el push, el segundo que dura y la
// promesa de que todo corrió de verdad. Todo se ve desde el cuadro 1.
function Gancho() {
  const valeria = useCue("valeria");
  const push = useCue("push", 2);
  const verdad = useCue("verdad");
  return (
    <Escena titulo="Git no sube tu proyecto" ancla={<Logo slug="git" size={56} />}>
      <Terminal
        title="valeria@laptop ~/app"
        lines={[
          { text: "git commit -qam 'Arregla el login con mayúsculas'", kind: "cmd", at: valeria },
          { text: "git push --progress origin main", kind: "cmd", at: push },
        ]}
        small
      />
      <div className="mt-6 flex items-center gap-5">
        <Objeto nombre="stopwatch" size={92} />
        <div>
          <p className="font-display text-[56px] font-black leading-none text-accent">1 s</p>
          <p className="mt-1 text-[22px] font-semibold text-muted">y seis pasos adentro</p>
        </div>
      </div>
      <div className="mt-6">
        <Chip tone="accent" dot at={verdad}>
          Todo corrió de verdad
        </Chip>
      </div>
    </Escena>
  );
}

// 2. Pregunta: la máquina de Valeria le pregunta al servidor qué ramas tiene,
// y la salida real de git ls-remote lo muestra.
function Pregunta() {
  const pregunta = useCue("pregunta");
  const ramas = useCue("ramas");
  const { lsRemote } = usePush();
  return (
    <Escena titulo="Primero, pregunta">
      <div className="relative flex items-center justify-between">
        <Lado icon="laptop" title="tu máquina" label="Valeria" />
        <Lado icon="server" title="servidor" label="origin" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Chip tone="solid" at={pregunta}>
            ¿Qué ramas tienes?
          </Chip>
        </div>
      </div>
      <Terminal className="mt-5" lines={captureLines({ steps: [lsRemote] }, [ramas - 0.4], {})} small wrap />
      <Prueba />
    </Escena>
  );
}

// 3. Compara: los 303 objetos del repositorio, y el servidor ya tiene casi
// todos. Los nuevos quedan encendidos; cuántos son se dice en el cierre.
function Compara() {
  const calcula = useCue("calcula");
  const objetos = useCue("objetos");
  const casi = useCue("casi");
  const { countObjects, objetos: total, viajaron } = usePush();
  return (
    <Escena titulo="¿Qué le falta?">
      <Terminal lines={captureLines({ steps: [countObjects] }, [calcula], { keep: (line) => /^(count|size):/.test(line) })} small />
      <div className="mt-5">
        <Objetos total={total} nuevos={viajaron} barrido={casi} />
      </div>
      <div className="mt-4 flex gap-3">
        <Chip at={objetos}>{total} objetos</Chip>
        <Chip at={casi + 0.5}>El servidor ya los tiene</Chip>
      </div>
      <Prueba />
    </Escena>
  );
}

// 4. Empaqueta: lo nuevo entra en un solo paquete, comprimido y con deltas,
// con las líneas reales del push.
function Empaqueta() {
  const packfile = useCue("packfile");
  const diferencia = useCue("diferencia");
  const { gitPush, viajaron } = usePush();
  return (
    <Escena titulo="Un solo paquete">
      <div className="flex items-center gap-6">
        <div className="relative flex size-[120px] items-center justify-center rounded-3xl bg-surface text-accent">
          <Anim efecto="salta" en={packfile}>
            <Icono name="package" size={76} strokeWidth={1.75} ancla={false} />
          </Anim>
        </div>
        <div data-ui className="flex gap-2">
          {Array.from({ length: viajaron }, (_, i) => (
            <div key={i} className="size-[22px] rounded-[5px] bg-accent" data-anim="sube" style={animStyle({ en: packfile - 0.6 + i * 0.15, dur: 0.4 })} />
          ))}
        </div>
      </div>
      <Terminal
        className="mt-5"
        lines={yaEscrito(gitPush, (line) => /^(Enumerating|Counting|Delta|Compressing)/.test(line), packfile + 0.3)}
        small
      />
      <div className="mt-4">
        <Chip tone="accent" at={diferencia}>
          Diferencias, no copias
        </Chip>
      </div>
    </Escena>
  );
}

// 5. Envía: send-pack y receive-pack, el paquete que viaja y la rama con el
// commit viejo y el nuevo, de la salida real.
function Envia() {
  const t = useSegundos();
  const manda = useCue("manda");
  const send = useCue("send-pack");
  const receive = useCue("receive-pack");
  const viejo = useCue("viejo");
  const { gitPush } = usePush();
  const viaje = interpolate(t, [manda + 0.4, manda + 1.6], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  return (
    <Escena titulo="Lo envía">
      <div className="relative flex items-center justify-between">
        <Lado icon="laptop" title="send-pack" label="tu máquina" className={t >= send ? "border-accent" : undefined} />
        <Lado icon="server" title="receive-pack" label="servidor" className={t >= receive ? "border-accent" : undefined} />
        <div className="absolute top-1/2 -translate-y-1/2 text-accent" style={{ left: 150 + viaje * 120, opacity: t >= manda + 0.4 && viaje < 1 ? 1 : 0 }}>
          <Icono name="package" size={44} strokeWidth={2} ancla={false} />
        </div>
      </div>
      <Terminal
        className="mt-5"
        lines={yaEscrito(gitPush, (line) => /^(Writing|To |\s+\w+\.\.\w+)/.test(line), viejo - 0.5, (line) => (/main -> main/.test(line) ? "ok" : "out"))}
        small
        wrap
      />
      <Prueba />
    </Escena>
  );
}

// 6. Revisa: el servidor no deja perder historia. La salida real de un push
// rechazado porque otra persona subió algo antes.
function Revisa() {
  const rechaza = useCue("rechaza");
  const bajar = useCue("baja");
  const rechazo = useCapture("rechazo");
  return (
    <Escena titulo="Revisa la historia">
      <Terminal
        lines={captureLines(rechazo, [rechaza - 0.9], { kind: (line) => (/rejected|^error/.test(line) ? "error" : "out") })}
        small
        wrap
      />
      <div className="mt-4">
        <Chip tone="accent" dot at={bajar}>
          Fetch first: baja primero
        </Chip>
      </div>
      <Nota className="mt-3">Otro repositorio de prueba, donde otra persona subió un commit antes.</Nota>
    </Escena>
  );
}

// 7. Avisa: la rama avanza un commit y el servidor avisa; en GitHub, el push
// hace correr los workflows de Actions.
function Avisa() {
  const t = useSegundos();
  const mueve = useCue("mueve");
  const post = useCue("post-receive");
  const actions = useCue("actions");
  const paso = interpolate(t, [mueve + 0.2, mueve + 0.8], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  return (
    <Escena titulo="Mueve la rama y avisa">
      <div data-ui className="relative h-[86px]">
        <div className="absolute left-[16px] right-[16px] top-[28px] h-[3px] bg-ink/25" />
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            className={`absolute top-[18px] size-[23px] rounded-full border-[3px] ${i === 6 ? "border-accent bg-accent" : "border-ink/60 bg-bg"}`}
            style={{ left: 8 + i * 70, opacity: i === 6 ? paso : 1 }}
          />
        ))}
        <div className="absolute top-[54px]" style={{ left: 2 + (5 + paso) * 70 }}>
          <Chip tone="accent">main</Chip>
        </div>
      </div>
      <div className="mt-4">
        <Chip dot at={post}>
          Hook post-receive
        </Chip>
      </div>
      <AppCard logo="githubactions" domain="GitHub Actions" label="on: push" at={actions - 0.3} className="mt-4">
        <div className="flex items-center gap-3">
          <Chip tone="accent" dot at={actions}>
            Workflow corriendo
          </Chip>
        </div>
      </AppCard>
    </Escena>
  );
}

// 8. Cierre: vuelve la grilla de la escena 3. De los 303 objetos viajaron 4,
// y 397 bytes. La frase para recordar y el gesto de guardar.
function Cierre() {
  const viajaron = useCue("viajaron");
  const bytes = useCue("bytes.");
  const sube = useCue("sube");
  const guardalo = useCue("guárdalo");
  const datos = usePush();
  return (
    <Escena titulo={`Viajaron ${datos.viajaron}`}>
      <Objetos total={datos.objetos} nuevos={datos.viajaron} barrido={-1} enciende={viajaron} />
      <DataTable
        className="mt-5"
        rows={[
          { label: "Objetos del repo", value: String(datos.objetos), tone: "muted" },
          { label: "Viajaron", value: String(datos.viajaron), at: viajaron },
          { label: "Pesaron", value: `${datos.bytes} bytes`, at: bytes - 0.4 },
        ]}
      />
      <Anim efecto="aparece" en={sube} className="mt-5 font-display text-[30px] font-black leading-[1.1]">
        Git no sube tu proyecto. Sube lo que le falta.
      </Anim>
      <div className="mt-5 flex items-center gap-4">
        <Anim efecto="salta" en={guardalo} dur={0.45}>
          <Gesto accion="guardar" size={64} lleno className="text-accent" />
        </Anim>
        <Anim efecto="aparece" en={guardalo + 0.3} className="font-display text-[28px] font-black text-accent">
          Guárdalo
        </Anim>
      </div>
    </Escena>
  );
}

export default defineVideo({
  music: { file: "audio/cama.mp3" },
  captions: "marker",
  chapters: true,
  scenes: [
    { id: "gancho", chapter: "El push", sfx: [{ asset: "whoosh", at: "verdad", volume: 0.25 }], Visual: Gancho },
    { id: "pregunta", tone: "surface", chapter: "Pregunta", sfx: [{ asset: "page-turn", at: "pregunta", volume: 0.4 }], Visual: Pregunta },
    { id: "compara", chapter: "Compara", sfx: [{ asset: "page-turn", at: "casi", volume: 0.35 }], Visual: Compara },
    { id: "empaqueta", tone: "surface", chapter: "Empaqueta", sfx: [{ asset: "page-turn", at: "packfile", volume: 0.4 }], Visual: Empaqueta },
    { id: "envia", chapter: "Envía", sfx: [{ asset: "whoosh", at: "manda", volume: 0.3 }], Visual: Envia },
    { id: "revisa", tone: "surface", chapter: "Revisa", sfx: [{ asset: "page-turn", at: "rechaza", volume: 0.4 }], Visual: Revisa },
    { id: "avisa", chapter: "Avisa", sfx: [{ asset: "whoosh", at: "actions", volume: 0.25 }], Visual: Avisa },
    { id: "cierre", tone: "surface", chapter: "Cierre", sfx: [{ asset: "page-turn", at: "guárdalo", volume: 0.4 }], Visual: Cierre },
  ],
});
