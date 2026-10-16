import { Code, Prompt, Slide, Window } from "@motor/ui";

// Idea: /diff dejó de venir de fábrica y se volvió un mod. Cada lámina muestra
// a un mod reescribiendo algo, porque eso es exactamente lo que hacen.

const moments: Array<[string, string]> = [
  ["Antes", "Reescribe tu prompt antes de que lo lea el modelo."],
  ["En su lugar", "Bloquea o cambia una llamada a herramienta."],
  ["Después", "Oculta secretos en lo que devuelve la herramienta."],
];

export default [
  <Slide swipe className="justify-between pb-4">
    <code className="-ml-1 block font-mono text-[128px] font-semibold leading-none tracking-tighter text-accent">/diff</code>
    <div className="flex flex-col gap-5">
      <h1 className="text-[54px] font-extrabold leading-[0.95] tracking-[-0.04em]">ya no viene de fábrica. Ahora es un mod.</h1>
      <p className="max-w-[26ch] text-[20px] leading-snug">
        Desde el 1 de octubre, Claude Code se reprograma por dentro. Y puedes escribir el tuyo.
      </p>
    </div>
  </Slide>,

  <Slide tone="paper" className="gap-7">
    <h2 className="text-[40px] font-extrabold leading-[1] tracking-[-0.035em]">
      Un mod es una función de TypeScript que se mete en un evento.
    </h2>
    <dl className="flex flex-col gap-3">
      {moments.map(([when, what]) => (
        <div key={when} className="grid grid-cols-[148px_1fr] items-baseline gap-4 rounded-2xl bg-bg/[0.06] px-5 py-4">
          <dt className="text-[27px] font-extrabold leading-none tracking-tight">{when}</dt>
          <dd className="text-[17px] leading-snug">{what}</dd>
        </div>
      ))}
    </dl>
    <p className="mt-auto text-[15px] leading-snug">
      El evento: una llamada a herramienta, un permiso o un cambio en pantalla.
    </p>
  </Slide>,

  <Slide className="gap-6">
    <h2 className="text-[40px] font-extrabold leading-[1] tracking-[-0.035em]">Así se ve un mod que reescribe tu prompt.</h2>
    <div className="flex flex-1 flex-col justify-center gap-3">
      <p className="text-[16px] text-muted">Lo que escribes</p>
      <Prompt className="self-start text-[25px] line-through decoration-2 opacity-55">arregla el test que falla</Prompt>
      <p className="mt-5 text-[16px] text-muted">Lo que lee el modelo</p>
      <Prompt className="bg-accent text-[25px] font-medium leading-snug text-bg">
        arregla el test que falla. Corre toda la suite antes de terminar y no toques la configuración de producción.
      </Prompt>
    </div>
    <p className="text-[15px] leading-snug text-muted">Ejemplo ilustrativo: escribes la regla una vez y el mod la aplica siempre.</p>
  </Slide>,

  <Slide tone="accent" className="justify-center gap-6">
    <p className="text-[21px] font-semibold">Lo que un mod ya puede hacer:</p>
    <ul className="flex flex-col gap-1.5 text-[46px] font-extrabold leading-[1] tracking-[-0.04em]">
      <li>Reescribir prompts.</li>
      <li>Bloquear herramientas.</li>
      <li>Decidir permisos.</li>
      <li>Ocultar secretos.</li>
      <li>Agregar botones.</li>
      <li>
        Reemplazar <code className="font-mono font-semibold tracking-tight">/diff</code>.
      </li>
    </ul>
  </Slide>,

  <Slide className="gap-7">
    <h2 className="text-[40px] font-extrabold leading-[1] tracking-[-0.035em]">Dos formas de tener tu primer mod.</h2>
    <div className="flex flex-col gap-3">
      <p className="text-[18px] leading-snug">Instala uno hecho desde el directorio de Claude o en la terminal:</p>
      <Window>
        <Code lang="shell" className="rounded-none bg-transparent px-5 py-4 text-[24px]">
          /plugin
        </Code>
      </Window>
    </div>
    <div className="flex flex-col gap-3">
      <p className="text-[18px] leading-snug">O pídeselo a Claude Code. Lo escribe, lo instala y lo recarga en caliente:</p>
      <Prompt className="ml-10 bg-accent text-[18px] font-medium text-bg">
        Escríbeme un mod que pida confirmación antes de cualquier comando que borre archivos.
      </Prompt>
    </div>
  </Slide>,

  <Slide className="gap-6">
    <h2 className="text-[50px] font-extrabold leading-[0.96] tracking-[-0.04em]">Un mod tiene el mismo acceso que Claude Code.</h2>
    <p className="text-[24px] leading-snug">
      No corre aislado: instala solo los de fuentes en las que confíes.
    </p>
    <div className="mt-auto flex flex-col gap-1.5 rounded-2xl bg-surface p-5">
      <p className="text-[25px] font-extrabold tracking-tight text-accent">Guárdalo para cuando escribas el tuyo.</p>
      <p className="text-[18px]">¿Cuál sería tu primer mod?</p>
    </div>
    <p className="text-[13px] leading-snug text-muted">Fuente: blog oficial de Claude, 1 de octubre de 2026. Información al 16 de octubre.</p>
  </Slide>,
];
