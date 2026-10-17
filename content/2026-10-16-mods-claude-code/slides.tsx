import type { ReactNode } from "react";
import { Code, Img, Logo, Nota, Slide, cx } from "@motor/ui";

// Dirección base: línea continua. El camino de un evento dentro de Claude Code
// cruza todas las láminas: sale por el borde derecho a la altura en que entra
// en la siguiente (470 → 330 → 330 → 330 → 470 → 470 → 470). En la despedida
// el camino vuelve al logo de la portada: el mod ya es parte de Claude Code.
// Préstamos: captura anotada (lámina 4) y terminal (lámina 6).

/** El trazo, en coordenadas del área de contenido (540 × 560). */
function Linea({ d, className }: { d: string; className?: string }) {
  return (
    <svg
      aria-hidden
      className={cx("pointer-events-none absolute left-0 top-0 stroke-accent", className)}
      width={540}
      height={560}
      viewBox="0 0 540 560"
      fill="none"
    >
      <path d={d} strokeWidth={12} strokeLinecap="butt" strokeLinejoin="round" />
    </svg>
  );
}

/** Una parada del camino: el punto donde se mete un mod. */
function Parada({ x, y, className }: { x: number; y: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cx("pointer-events-none absolute size-[30px] rounded-full border-[6px] border-accent bg-bg", className)}
      style={{ left: x - 15, top: y - 15 }}
    />
  );
}

function Etiqueta({ x, y, children, className }: { x: number; y: number; children: ReactNode; className?: string }) {
  return (
    <span className={cx("absolute rounded-full bg-ink px-4 py-1.5 text-[18px] font-semibold text-bg", className)} style={{ left: x, top: y }}>
      {children}
    </span>
  );
}

export default [
  // 1. Portada: Claude Code y el camino que ahora se puede intervenir.
  <Slide swipe>
    <h1 className="font-display text-[60px] font-extrabold leading-[0.92] tracking-[-0.035em]">Claude Code ya se puede reprogramar.</h1>
    <p className="mt-5 text-[20px] font-medium">Con mods, desde el 1 de octubre de 2026.</p>
    <Linea d="M200 357 C 290 357, 300 470, 390 470 L 540 470" />
    <div className="absolute left-9 top-[307px]">
      <Logo slug="claudecode" size={164} />
    </div>
    <Parada x={452} y={470} />
    <Etiqueta x={398} y={404}>
      tu mod
    </Etiqueta>
  </Slide>,

  // 2. Qué es: tres eventos sobre el camino.
  <Slide>
    <h1 className="text-balance font-display text-[47px] font-extrabold leading-[0.95] tracking-[-0.035em]">
      Un mod es una función de TypeScript que se engancha a un evento.
    </h1>
    <Linea d="M0 470 C 90 470, 110 330, 200 330 L 540 330" />
    {[
      [215, "una llamada a herramienta"],
      [345, "un pedido de permiso"],
      [470, "un cambio en pantalla"],
    ].map(([x, t]) => (
      <div key={t as string}>
        <Parada x={x as number} y={330} />
        <p className="absolute w-[116px] text-center text-[17px] font-medium leading-tight" style={{ left: (x as number) - 58, top: 360 }}>
          {t}
        </p>
      </div>
    ))}
    <p className="mt-auto text-balance pb-1 text-[27px] font-bold leading-tight">Y corre antes, en lugar de o después de ese evento.</p>
  </Slide>,

  // 3. Antes.
  <Slide tone="accent">
    <h1 className="font-display text-[150px] font-extrabold leading-[0.85] tracking-[-0.045em]">Antes</h1>
    <p className="mt-3 text-[24px] font-medium">del evento, tu mod puede:</p>
    <Linea d="M0 330 C 150 330, 190 300, 290 300 S 440 330, 540 330" className="stroke-accent-ink" />
    <Parada x={290} y={300} className="border-accent-ink bg-accent" />
    <ul className="absolute left-9 right-9 top-[364px] flex flex-col gap-3 text-[24px] font-semibold leading-snug">
      <li>Reescribir tu prompt antes de que lo lea el modelo.</li>
      <li>Bloquear o reescribir una llamada a herramienta.</li>
      <li>Aprobar o negar un permiso.</li>
    </ul>
  </Slide>,

  // 4. En lugar de: la captura oficial de /diff (préstamo de "captura anotada").
  <Slide>
    <h1 className="font-display text-[44px] font-extrabold leading-[0.95] tracking-[-0.035em]">En lugar de: /diff ya es un mod.</h1>
    <Linea d="M0 330 L 540 330" />
    <div className="relative mt-6">
      <Img
        src="captura-diff.png"
        alt="Párrafo del artículo oficial: /diff es ahora un mod que puedes desactivar o reemplazar"
        className="w-full rounded-lg"
      />
      <svg aria-hidden className="absolute left-[68px] top-[96px]" width="208" height="14" viewBox="0 0 208 14" fill="none">
        <path d="M2 8 C 40 3, 80 11, 120 6 S 184 4, 206 7" className="stroke-accent" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
    <p className="mt-5 text-[25px] font-bold leading-tight">Lo puedes desactivar o reemplazar por tu versión.</p>
    <Nota className="mt-2">Captura: claude.com, 16 de octubre de 2026</Nota>
  </Slide>,

  // 5. Después.
  <Slide tone="invert">
    <Linea d="M0 330 C 120 330, 160 250, 260 250 S 420 470, 540 470" />
    <Parada x={260} y={250} className="bg-ink" />
    <ul className="flex flex-col gap-4 text-[26px] font-semibold leading-snug">
      <li>Ocultar secretos en la salida.</li>
      <li>Registrar cada llamada a herramienta, para tu equipo.</li>
    </ul>
    <h1 className="mt-auto pb-6 font-display text-[118px] font-extrabold leading-[0.85] tracking-[-0.04em]">Después</h1>
  </Slide>,

  // 6. Para empezar (préstamo de "terminal").
  <Slide>
    <h1 className="font-display text-[48px] font-extrabold leading-[0.95] tracking-[-0.035em]">Para empezar</h1>
    <Code lang="shell" className="mt-6 px-6 py-5 text-[24px] leading-[1.6]">
      {`$ claude
> /plugin`}
    </Code>
    <p className="mt-6 text-[22px] font-semibold leading-snug">
      O pídele a Claude Code que lo escriba: lo instala y lo recarga en caliente.
    </p>
    <Linea d="M0 470 C 180 470, 220 500, 320 500 S 460 470, 540 470" />
    <Parada x={320} y={500} />
    <Etiqueta x={232} y={430}>
      tu primer mod
    </Etiqueta>
  </Slide>,

  // 7. El riesgo, antes de despedirse.
  <Slide tone="accent">
    <h1 className="font-display text-[66px] font-extrabold leading-[0.92] tracking-[-0.04em]">Ojo: no corren aislados.</h1>
    <p className="mt-6 text-[26px] font-medium leading-snug">
      Un mod tiene el mismo acceso a tu máquina que Claude Code. Instala solo los de fuentes confiables.
    </p>
    <Linea d="M0 470 C 140 470, 180 430, 270 430 S 400 470, 540 470" className="stroke-accent-ink" />
    <Parada x={270} y={430} className="border-accent-ink bg-accent" />
  </Slide>,

  // 8. Despedida: el camino vuelve al logo de la portada, ahora con tu mod en él.
  <Slide>
    <h1 className="font-display text-[56px] font-extrabold leading-[0.92] tracking-[-0.035em]">¿Cuál sería tu primer mod?</h1>
    <p data-cta className="mt-5 text-[26px] font-bold leading-tight">
      Guárdalo para cuando lo escribas.
    </p>
    <Linea d="M0 470 L 150 470 C 240 470, 250 357, 340 357" />
    <Parada x={96} y={470} />
    <div className="absolute left-[340px] top-[275px]">
      <Logo slug="claudecode" size={164} />
    </div>
    <Nota className="mt-auto">Fuente: blog de Claude, 1 oct 2026. Info al 16 oct 2026.</Nota>
  </Slide>,
];
