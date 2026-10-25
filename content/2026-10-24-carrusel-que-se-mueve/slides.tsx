import { animStyle, Code, cx, Etiqueta, Flecha, Gesto, Icono, Img, Logo, Nota, Proceso, Slide, Window } from "@motor/ui";
import type { ReactNode } from "react";

// La idea visual: la tira de cuadros que graba el navegador. Sale del logo de Claude en la portada,
// corre junto a la pila de la receta (lámina 9) y termina en el gesto de guardar (lámina 10).

/** Cuánto le falta al cuadrado naranja para llegar arriba en cada cuadro: la animación, foto por foto. */
const FALTA = [30, 20, 12, 5, 0];
const OPACIDAD = [0.35, 0.6, 0.85, 1, 1];

/** Tira de película horizontal: cada cuadro es una foto de la lámina en un instante. */
function Tira({ cuadros, ancho, anim = false, escala = 1 }: { cuadros: number; ancho: number; anim?: boolean; escala?: number }) {
  const ALTO = 100;
  const ANCHO_CUADRO = 72;
  const PASO = 84;
  return (
    <svg viewBox={`0 0 ${ancho} ${ALTO}`} width={ancho * escala} height={ALTO * escala} fill="none" aria-hidden className="block">
      <rect x="0" y="0" width={ancho} height={ALTO} rx="6" className="fill-ink" />
      {Array.from({ length: Math.ceil(ancho / 20) }, (_, i) => (
        <g key={i}>
          <rect x={6 + i * 20} y="7" width="10" height="8" rx="2" className="fill-bg" />
          <rect x={6 + i * 20} y={ALTO - 15} width="10" height="8" rx="2" className="fill-bg" />
        </g>
      ))}
      {Array.from({ length: cuadros }, (_, i) => {
        const x = 10 + i * PASO;
        const y = 22;
        const k = Math.min(i, FALTA.length - 1);
        return (
          <g key={i} data-anim={anim ? "aparece" : undefined} style={anim ? animStyle({ en: 0.3 + i * 0.35, dur: 0.3 }) : undefined}>
            <rect x={x} y={y} width={ANCHO_CUADRO} height="56" rx="3" className="fill-bg" />
            <rect x={x + 8} y={y + 9} width="30" height="4" rx="2" className="fill-ink" opacity="0.55" />
            <rect x={x + 8} y={y + 17} width="20" height="4" rx="2" className="fill-ink" opacity="0.55" />
            <rect x={x + ANCHO_CUADRO - 24} y={y + 10 + FALTA[k]} width="16" height="16" rx="3" className="fill-accent" opacity={OPACIDAD[k]} />
          </g>
        );
      })}
    </svg>
  );
}

/** La misma tira, de pie, para la pila de la lámina 9. */
function TiraVertical({ alto }: { alto: number }) {
  const ANCHO = 40;
  return (
    <svg viewBox={`0 0 ${ANCHO} ${alto}`} width={ANCHO} height={alto} fill="none" aria-hidden className="block">
      <rect x="0" y="0" width={ANCHO} height={alto} rx="6" className="fill-ink" />
      {Array.from({ length: Math.floor(alto / 20) }, (_, i) => (
        <g key={i}>
          <rect x="4" y={6 + i * 20} width="6" height="9" rx="2" className="fill-bg" />
          <rect x={ANCHO - 10} y={6 + i * 20} width="6" height="9" rx="2" className="fill-bg" />
        </g>
      ))}
      {Array.from({ length: Math.floor((alto - 8) / 44) }, (_, i) => (
        <rect key={i} x="13" y={8 + i * 44} width="14" height="36" rx="2" className="fill-bg" />
      ))}
    </svg>
  );
}

function FlechaAbajo() {
  return (
    <svg viewBox="0 0 24 22" width="24" height="22" fill="none" aria-hidden className="ml-[10px] shrink-0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 V20 M6 14 L12 20 L18 14" />
    </svg>
  );
}

/** Lámina 8: los pasos de la lámina 3, con los que hace Remotion marcados. */
const PASOS_REMOTION = [
  { texto: "Tu lámina en React", remotion: false },
  { texto: "Navegador sin ventana", remotion: true },
  { texto: "Una foto por cuadro", remotion: true },
  { texto: "Video final", remotion: true },
];

function Mp4({ tachado = false }: { tachado?: boolean }) {
  return (
    <div className={cx("relative flex items-center gap-2 rounded-xl px-3 py-2", tachado ? "border-2 border-current" : "bg-accent text-accent-ink")}>
      <Icono name="film" size={24} ancla={false} />
      <span className="text-[18px] font-bold">MP4</span>
      {tachado ? (
        <svg aria-hidden className="absolute inset-0 h-full w-full overflow-visible" fill="none">
          <line x1="-6" y1="115%" x2="106%" y2="-15%" className="stroke-accent" strokeWidth="4" strokeLinecap="round" />
        </svg>
      ) : null}
    </div>
  );
}

const CAPAS: { marca: ReactNode; nombre: string; que: string; codigo?: string; destacada?: boolean }[] = [
  { marca: <Icono name="file-text" size={30} ancla={false} />, nombre: "SKILL.md", que: "tus estilos y reglas", codigo: ".claude/skills/<nombre>/SKILL.md" },
  { marca: <Logo slug="claude" size={30} ancla={false} />, nombre: "Claude", que: "anima solo con CSS", codigo: "@keyframes motor-sube { … }" },
  { marca: <Icono name="app-window" size={30} ancla={false} />, nombre: "Navegador", que: "180 fotos por 6 segundos", codigo: "a.currentTime = t; page.screenshot()", destacada: true },
  { marca: <Icono name="film" size={30} ancla={false} />, nombre: "ffmpeg", que: "las une en MP4", codigo: "-framerate 30 -pix_fmt yuv420p" },
  { marca: <Logo slug="instagram" size={30} ancla={false} />, nombre: "Instagram", que: "hasta 20 fotos o videos" },
];

// Lámina 7: marcador sobre las frases que importan de la captura (1596×924 px mostrada a 468×271).
const MARCAS = [
  { x: 234, y: 44, w: 187, h: 17 },
  { x: 7, y: 63, w: 159, h: 17 },
  { x: 209, y: 214, w: 224, h: 17 },
  { x: 43, y: 232, w: 45, h: 17 },
];

export default [
  // 1. Portada: el gancho elegido; el logo de Claude y la tira de cuadros que sale de él (animada).
  <Slide
    swipe
    className="justify-between"
    underlay={
      <>
        <div className="absolute left-[36px] top-[338px]">
          <Logo slug="claude" size={150} />
        </div>
        <div className="absolute left-[194px] top-[348px]">
          <Tira cuadros={4} ancho={340} anim escala={1.3} />
        </div>
      </>
    }
  >
    <h1 className="font-display text-[60px] font-black leading-[0.95] tracking-tight">
      ¿Claude anima carruseles?
      <br />
      No: escribe HTML
    </h1>
    <p className="mb-[90px] text-[28px] font-black leading-tight tracking-tight">Esta portada son 95 fotos.</p>
  </Slide>,

  // 2. Se entiende sola: lo que parece contra lo que pasa.
  <Slide tone="invert">
    <h2 className="font-display text-[32px] font-black leading-[1.05] tracking-tight">Claude no hace el video. Escribe la página.</h2>
    <div data-visual="comparacion" className="mt-5 grid grid-cols-[132px_1fr] gap-x-5">
      <p className="text-[18px] font-bold leading-tight">Lo que parece</p>
      <p className="text-[18px] font-bold leading-tight">Lo que pasa</p>
      <div className="mt-3 flex flex-col items-start gap-1">
        <Logo slug="claude" size={44} ancla={false} />
        <div className="relative w-[44px] flex-1">
          <svg aria-hidden className="absolute inset-0 h-full w-full overflow-visible" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="22" y1="4" x2="22" y2="100%" />
          </svg>
          <svg aria-hidden className="absolute left-[2px] top-1/2 -translate-y-1/2 text-accent" width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
            <path d="M8 8 L32 32 M32 8 L8 32" />
          </svg>
        </div>
        <FlechaAbajo />
        <Mp4 tachado />
      </div>
      <div className="mt-3 flex flex-col items-start gap-1">
        <Logo slug="claude" size={44} ancla={false} />
        <FlechaAbajo />
        <Code lang="css" className="p-4 text-[14px]">{`@keyframes motor-sube {
  from {
    opacity: 0;
    transform: translateY(32px);
  }
}`}</Code>
        <div className="flex items-center gap-2">
          <FlechaAbajo />
          <span className="text-[18px] font-bold leading-none">lo graba un navegador</span>
        </div>
        <Mp4 />
      </div>
    </div>
    <p className="mt-auto text-[18px] leading-snug">Claude entiende imágenes, pero no las genera. Entrega texto: HTML, CSS o React.</p>
    <Nota className="mt-2 text-bg">Fuente: Claude Docs, Vision (FAQ), 24-10-2026. El CSS es el real del motor de @jacket.dev.</Nota>
  </Slide>,

  // 3. El recorrido, en orden (animada).
  <Slide>
    <h2 className="font-display text-[34px] font-black leading-[1.05] tracking-tight">El navegador saca una foto por cuadro</h2>
    <Proceso
      className="mt-6 [--min-text:18px]"
      destacado={3}
      anim={{ en: 0.3, paso: 0.7 }}
      pasos={[
        { icono: "file-code", titulo: "slide.html", texto: "Claude escribe la animación" },
        { icono: "app-window", titulo: "Navegador sin ventana", texto: "Playwright o Puppeteer la abren" },
        { icono: "camera", titulo: "Una foto por cuadro", texto: "pausa y captura" },
        { icono: "film", titulo: "ffmpeg", texto: "une las fotos en un MP4" },
      ]}
    />
    <Nota className="mt-auto">Así renderiza Remotion (renderFrames() con Puppeteer) y así graba el motor de @jacket.dev (Playwright y ffmpeg).</Nota>
  </Slide>,

  // 4. La cuenta: 6 segundos son 180 fotos.
  <Slide tone="surface">
    <h2 className="font-display text-[34px] font-black leading-[1.05] tracking-tight">6 segundos de lámina son 180 fotos</h2>
    <p className="mt-3 text-[18px] leading-snug">Cada fila es un segundo. El tercero, en naranja: 30 fotos.</p>
    <div data-visual="escala" className="relative mt-5 h-[290px]">
      <svg viewBox="0 0 468 290" width="468" height="290" fill="none" aria-hidden className="absolute inset-0">
        {Array.from({ length: 6 }, (_, fila) =>
          Array.from({ length: 30 }, (_, c) => (
            <rect
              key={`${fila}-${c}`}
              x={58 + c * 13.6}
              y={fila * 50 + 2}
              width="10"
              height="38"
              rx="2"
              className={fila === 2 ? "fill-accent" : "fill-muted"}
              opacity={fila === 2 ? 1 : 0.45}
            />
          )),
        )}
      </svg>
      {Array.from({ length: 6 }, (_, fila) => (
        <span key={fila} className={cx("absolute left-0 text-[18px] font-semibold leading-none", fila === 2 ? "text-accent" : "text-ink")} style={{ top: fila * 50 + 12 }}>
          {fila + 1}
        </span>
      ))}
    </div>
    <p className="mt-auto text-[18px] leading-snug">Cada foto es un cuadro del MP4.</p>
    <Nota className="mt-2">Cálculo propio: 6 s × 30 cuadros por segundo = 180, con el FPS del motor de @jacket.dev.</Nota>
  </Slide>,

  // 5. Las dos líneas reales del motor.
  <Slide>
    <h2 className="font-display text-[32px] font-black leading-[1.05] tracking-tight">El truco: pausar en el milisegundo exacto</h2>
    <div className="relative mt-4">
      <Window title="movimiento.ts">
        <Code lang="ts" className="rounded-none p-4 text-[14px]">{`for (const a of document.getAnimations()) {
  a.pause();
  a.currentTime = t;
}`}</Code>
      </Window>
      <Etiqueta en={[196, 111]} hacia="derecha" largo={24} className="text-accent [--min-text:18px]">
        t = cuadro × 1000 / 30
      </Etiqueta>
    </div>
    <div className="relative mt-3">
      <Window title="ffmpeg">
        <Code lang="bash" className="rounded-none p-4 text-[14px]">{`ffmpeg -framerate 30 \\
  -i f%04d.png -c:v libx264 \\
  -pix_fmt yuv420p -crf 18 \\
  -preset slow -movflags +faststart \\
  salida.mp4`}</Code>
      </Window>
      <Etiqueta en={[210, 65]} hacia="derecha" largo={24} className="text-accent [--min-text:18px]">
        sin esto, usa 25
      </Etiqueta>
    </div>
    <p className="mt-3 text-[18px] leading-snug">El navegador salta al instante de cada cuadro. Sin <code className="whitespace-nowrap font-mono text-[16px]">-framerate 30</code>, tus 6 s duran 7,2.</p>
    <Nota className="mt-auto">Código real del motor de @jacket.dev (repo público): t es el milisegundo del cuadro; salida es la ruta del MP4. FFmpeg: -framerate vale 25 si no se indica. 7,2 s es cálculo propio.</Nota>
  </Slide>,

  // 6. El atajo y su letra chica.
  <Slide tone="accent">
    <h2 className="font-display text-[34px] font-black leading-[1.05] tracking-tight">¿No quieres armar el grabador? Remotion lo hace con React</h2>
    <div data-visual="proceso" className="relative mt-6 h-[300px]">
      {PASOS_REMOTION.map((p, i) => (
        <div
          key={p.texto}
          className={cx(
            "absolute left-0 flex h-[60px] w-[240px] items-center rounded-2xl px-4 text-[18px] font-bold",
            p.remotion ? "bg-accent-ink text-accent" : "border-2 border-dashed border-current",
          )}
          style={{ top: i * 80 }}
        >
          {p.texto}
        </div>
      ))}
      <svg aria-hidden className="absolute left-[252px] top-[80px]" width="24" height="220" viewBox="0 0 24 220" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 2 H14 V218 H2 M14 110 H22" />
      </svg>
      <div className="absolute left-[286px] top-[150px] flex flex-col gap-1.5">
        <span className="font-display text-[34px] font-black leading-none">Remotion</span>
        <code className="font-mono text-[14px] leading-snug">renderFrames()</code>
        <code className="font-mono text-[14px] leading-snug">stitchFramesToVideo()</code>
      </div>
    </div>
    <p className="mt-auto text-[18px] font-bold leading-snug">Gratis hasta 3 empleados; desde el cuarto, licencia.</p>
    <Nota className="mt-2 text-accent-ink">Remotion Docs (renderFrames, stitchFramesToVideo) y LICENSE.md: gratis para personas, organizaciones sin fines de lucro y con fines de lucro de hasta 3 empleados, 24-10-2026.</Nota>
  </Slide>,

  // 7. Anatomía de una skill real.
  <Slide tone="invert">
    <h2 className="font-display text-[32px] font-black leading-[1.05] tracking-tight">La skill que te pasan por DM es una carpeta</h2>
    <div className="relative mt-4 h-[222px]">
      <Window title="SKILL.md" className="w-[300px]">
        <Code lang="yaml" className="rounded-none p-3 text-[14px]">{`---
name: carrusel-taste
description: Dirección de arte
  para carruseles de Instagram…
---

# carrusel-taste`}</Code>
      </Window>
      <Etiqueta en={[278, 107]} hacia="derecha" largo={30} ancho={152} className="[--min-text:18px]">
        Claude la lee siempre (unos 100 tokens)
      </Etiqueta>
      <Etiqueta en={[152, 198]} hacia="derecha" largo={156} ancho={152} className="[--min-text:18px]">
        Tus reglas: anima con CSS, que se puede pausar
      </Etiqueta>
    </div>
    <div className="relative mt-3 h-[176px]">
      <Window title="carrusel-taste/" className="w-[240px]">
        <Code lang="shell" className="rounded-none p-3 text-[14px]">{`SKILL.md
cierres.json
direcciones.json
recursos.json
referencias/`}</Code>
      </Window>
      <Etiqueta en={[152, 107]} hacia="derecha" largo={156} ancho={152} className="[--min-text:18px]">
        12 direcciones de arte: los estilos
      </Etiqueta>
    </div>
    <Nota className="mt-auto text-bg">Archivos reales de skills/carrusel-taste (repo público del motor). Tokens: Claude Docs, Agent Skills. getAnimations() incluye animaciones y transiciones CSS: MDN, 24-10-2026.</Nota>
  </Slide>,

  // 8. Captura anotada: la advertencia de seguridad de la documentación oficial.
  <Slide tone="surface">
    <h2 className="font-display text-[34px] font-black leading-[1.05] tracking-tight">¿Una skill por DM? Léela antes de instalarla</h2>
    <div className="relative mt-3 h-[376px]">
      <p className="absolute right-0 top-0 w-[380px] text-right font-notes text-[24px] leading-[1.05]">solo las tuyas o de Anthropic</p>
      <div className="absolute left-0 top-[40px]">
        <Img
          src="captura-seguridad-skills.png"
          alt="Sección Security considerations de la documentación de Agent Skills"
          className="w-[468px] rounded-lg"
          credit="Captura: Claude Platform Docs, Agent Skills, 24-10-2026"
        />
        <svg aria-hidden width="468" height="271" viewBox="0 0 468 271" className="absolute left-0 top-0">
          {MARCAS.map((m, i) => (
            <rect key={i} x={m.x} y={m.y} width={m.w} height={m.h} rx="3" className="fill-accent" opacity="0.35" />
          ))}
        </svg>
      </div>
      <div className="absolute inset-0">
        <Flecha de={[352, 30]} a={[332, 82]} curva={0.2} mano />
        <Flecha de={[420, 344]} a={[414, 278]} curva={-0.2} mano />
      </div>
      <p className="absolute right-0 top-[344px] w-[400px] text-right font-notes text-[24px] leading-[1.05]">podría sacar tus datos o entrar al sistema</p>
    </div>
    <p className="mt-auto text-[18px] leading-snug">En Claude Code, una skill tiene acceso a la red como cualquier programa.</p>
    <Nota className="mt-1">Claude Docs, Agent Skills: Security considerations y Runtime environment constraints, 24-10-2026.</Nota>
  </Slide>,

  // 9. Resumen para capturar: la receta en capas, con la tira al costado.
  <Slide tone="surface">
    <h2 className="font-display text-[34px] font-black leading-[1.05] tracking-tight">La receta, capa por capa</h2>
    <div data-visual="capas" className="relative mt-5 flex flex-col gap-2.5 pr-[54px]">
      {CAPAS.map((c) => (
        <div key={c.nombre} className={cx("flex h-[72px] items-center gap-4 rounded-2xl px-5", c.destacada ? "bg-accent text-accent-ink" : "bg-bg text-ink")}>
          {c.marca}
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-[18px] leading-tight">
              <b>{c.nombre}</b> {c.que}
            </p>
            {c.codigo ? <code className="font-mono text-[14px] leading-tight">{c.codigo}</code> : null}
          </div>
        </div>
      ))}
      <div className="absolute bottom-0 right-0 top-0">
        <TiraVertical alto={400} />
      </div>
    </div>
    <Nota className="mt-auto">Fuentes: Claude Docs, MDN, FFmpeg, Remotion y Meta (Content Publishing), 24-10-2026. 180 fotos: cálculo propio a 30 fps.</Nota>
  </Slide>,

  // 10. Cierre: vuelve la tira de la portada y termina en el gesto de guardar.
  <Slide>
    <h2 className="font-display text-[32px] font-black leading-[1.08] tracking-tight">Claude escribe la lámina. Un navegador la graba, 30 fotos por segundo.</h2>
    <div className="relative mt-4 h-[250px]">
      <div className="absolute left-0 top-[93px]">
        <Logo slug="claude" size={64} ancla={false} />
      </div>
      <div className="absolute left-[74px] top-[75px]">
        <Tira cuadros={2} ancho={196} />
      </div>
      <p className="absolute left-0 top-[190px] w-[230px] text-[18px] font-bold leading-snug text-accent">La portada se grabó así: 95 fotos.</p>
      <div className="absolute right-0 top-[7px] text-accent">
        <Gesto accion="guardar" size={236} strokeWidth={1.6} />
      </div>
    </div>
    <p data-cta className="mt-4 text-[20px] font-bold leading-snug">
      La lámina 9 es la receta completa: guárdala para cuando armes tu propia skill de carruseles.
    </p>
    <Nota className="mt-auto">La portada (95 cuadros) y la lámina 3 se grabaron con Playwright y ffmpeg a 30 por segundo. Fuentes: Claude Docs (Vision, Agent Skills), Claude Code Docs, MDN, FFmpeg, Remotion y Meta, revisadas el 24-10-2026.</Nota>
  </Slide>,
];
