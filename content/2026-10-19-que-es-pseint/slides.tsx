import { Code, Gesto, Icono, Nota, Slide } from "@motor/ui";

export default [
  // 1. Portada (Ficha técnica)
  <Slide swipe tone="base" className="justify-between">
    <div className="pt-2">
      <Icono name="binary" size={120} className="text-accent" />
    </div>
    <div className="pb-4">
      <h1 className="font-display text-[58px] font-black leading-[0.94] tracking-tight">
        No necesitas aprender Java para empezar a programar
      </h1>
    </div>
  </Slide>,

  // 2. La barrera de la sintaxis
  <Slide tone="base">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      La barrera de la sintaxis
    </h2>
    <p className="mt-5 text-[18px] leading-snug">
      Empezar directo con Java abruma al principiante con clases y tipos antes de entender qué es un algoritmo.
    </p>
    <div className="mt-7 rounded-2xl bg-surface p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 text-[18px]">
        <span className="text-muted">Error común</span>
        <span className="font-bold">Memorizar llaves</span>
      </div>
      <div className="flex items-center justify-between pt-1 text-[18px]">
        <span className="text-muted">Lo importante</span>
        <span className="font-bold text-accent">Entender el flujo</span>
      </div>
    </div>
  </Slide>,

  // 3. Qué es PSeInt
  <Slide tone="surface">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      Qué es PSeInt
    </h2>
    <p className="mt-5 text-[18px] leading-snug">
      Software libre creado por Pablo Novara para aprender algoritmos escribiendo pseudocódigo en español estructurado.
    </p>
    <div className="mt-7 space-y-3.5">
      <div className="flex items-center justify-between rounded-xl bg-bg px-5 py-4 text-[18px]">
        <span className="text-muted">Licencia</span>
        <span className="font-bold">GPLv2 libre</span>
      </div>
      <div className="flex items-center justify-between rounded-xl bg-bg px-5 py-4 text-[18px]">
        <span className="text-muted">Enfoque</span>
        <span className="font-bold text-accent">Lógica pura</span>
      </div>
    </div>
  </Slide>,

  // 4. Instrucciones en tu idioma
  <Slide tone="base">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      Instrucciones en tu idioma
    </h2>
    <p className="mt-3 text-[18px] leading-snug text-muted">
      Las estructuras clásicas se leen de forma natural:
    </p>
    <div className="mt-4">
      <Code lang="cpp" className="text-[14px]">
{`Escribir "Ingresa tu edad:"
Leer edad
Si edad >= 18 Entonces
    Escribir "Acceso permitido"
FinSi`}
      </Code>
    </div>
  </Slide>,

  // 5. Prueba de escritorio
  <Slide tone="surface">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      Prueba de escritorio
    </h2>
    <p className="mt-5 text-[18px] leading-snug">
      Ejecuta el código paso a paso a velocidad controlada y observa cómo cambian las variables en memoria.
    </p>
    <div className="mt-7 rounded-2xl bg-bg p-6">
      <p className="text-[18px] font-bold text-accent">Inspección en tiempo real</p>
      <p className="mt-2 text-[18px] text-muted">
        Detecta bucles infinitos sin necesidad de depuradores complejos.
      </p>
    </div>
  </Slide>,

  // 6. Diagramas de flujo en un clic
  <Slide tone="base">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      Diagramas de flujo en un clic
    </h2>
    <p className="mt-5 text-[18px] leading-snug">
      PSeInt dibuja automáticamente el diagrama de flujo de tu algoritmo para entender visualmente las bifurcaciones.
    </p>
    <div className="mt-7 rounded-2xl bg-surface p-6">
      <p className="text-[18px] font-bold text-accent">Edición bidireccional</p>
      <p className="mt-2 text-[18px] text-muted">
        Si cambias el diagrama, el pseudocódigo se actualiza solo.
      </p>
    </div>
  </Slide>,

  // 7. Salto a código real
  <Slide tone="surface">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      El salto a código real
    </h2>
    <p className="mt-5 text-[18px] leading-snug">
      En Archivo &gt; Exportar, PSeInt traduce tu algoritmo directamente a lenguajes compilados e interpretados:
    </p>
    <div className="mt-7 grid grid-cols-2 gap-3.5 text-[18px]">
      <div className="rounded-xl bg-bg p-4 text-center font-bold text-accent">Java</div>
      <div className="rounded-xl bg-bg p-4 text-center font-bold text-accent">C++</div>
      <div className="rounded-xl bg-bg p-4 text-center font-bold text-accent">Python</div>
      <div className="rounded-xl bg-bg p-4 text-center font-bold text-accent">C#</div>
    </div>
  </Slide>,

  // 8. Comparativa PSeInt vs Java
  <Slide tone="base">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      Misma lógica, otra sintaxis
    </h2>
    <p className="mt-3 text-[18px] leading-snug text-muted">
      Mira cómo se mapea exactamente en Java:
    </p>
    <div className="mt-4">
      <Code lang="java" className="text-[14px]">
{`// PSeInt: Escribir "Hola" / Leer n
System.out.println("Hola");
Scanner scan = new Scanner(System.in);
int n = scan.nextInt();`}
      </Code>
    </div>
    <Nota className="mt-3">El tipado y la estructura de clases se generan solos.</Nota>
  </Slide>,

  // 9. Cierre con Gesto tocado
  <Slide tone="surface" className="justify-between">
    <div>
      <h2 className="font-display text-[32px] font-black leading-tight text-accent">
        Aprender a programar no es memorizar sintaxis: es dominar la lógica antes de que el compilador te frustre.
      </h2>
      <p data-cta className="mt-6 text-[22px] font-bold leading-snug text-ink">
        Guárdalo para cuando tengas que aprender o enseñarle a programar a alguien desde cero.
      </p>
    </div>

    <div className="my-auto flex items-center justify-center py-4">
      <Gesto accion="guardar" lleno size={56} className="text-accent" />
    </div>

    <Nota className="mt-auto">
      Info al 18 de octubre de 2026 · Fuente: pseint.sourceforge.net
    </Nota>
  </Slide>,
];
