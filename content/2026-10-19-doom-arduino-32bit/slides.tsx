import { Code, Gesto, Logo, Nota, Prompt, Slide } from "@motor/ui";

export default [
  // 1. Portada (Titular gigante)
  <Slide swipe tone="base" className="justify-between">
    <div className="pt-2">
      <Logo slug="arduino" size={140} />
    </div>
    <div className="pb-4">
      <h1 className="font-display text-[64px] font-black leading-[0.92] tracking-tight">
        Así es como tu agente programa DOOM en Arduino
      </h1>
    </div>
  </Slide>,

  // 2. Choque de realidad
  <Slide tone="base">
    <h2 className="font-display text-[38px] font-black leading-none text-accent">
      El prompt ingenuo siempre falla
    </h2>
    <p className="mt-5 text-[18px] leading-snug">
      Pedirle "hazme DOOM" rompe al agente: intenta meter 4 MB en un micro de 2 KB de RAM y alucina librerías mágicas.
    </p>
    <div className="mt-7 rounded-2xl bg-surface p-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 text-[18px]">
        <span className="text-muted">Arduino Uno</span>
        <span className="font-bold">2 KB RAM</span>
      </div>
      <div className="flex items-center justify-between pt-4 text-[18px]">
        <span className="text-muted">DOOM1.WAD</span>
        <span className="font-bold text-accent">4.19 MB</span>
      </div>
    </div>
  </Slide>,

  // 3. Restricción 1: Hardware 32 bits
  <Slide tone="surface">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      Regla 1: Fija hardware de 32 bits
    </h2>
    <p className="mt-5 text-[18px] leading-snug">
      Exige un micro con PSRAM y un panel SPI ILI9341 (320×240) para la resolución nativa.
    </p>
    <div className="mt-7 space-y-3.5">
      <div className="flex items-center justify-between rounded-xl bg-bg px-5 py-4 text-[18px]">
        <span className="font-bold">Arduino Nano ESP32</span>
        <span className="text-accent">8 MB PSRAM</span>
      </div>
      <div className="flex items-center justify-between rounded-xl bg-bg px-5 py-4 text-[18px]">
        <span className="font-bold">Panel SPI ILI9341</span>
        <span className="text-muted">320×240 px</span>
      </div>
    </div>
  </Slide>,

  // 4. Restricción 2: doomgeneric
  <Slide tone="base">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      Regla 2: Olvida el código de 1993
    </h2>
    <p className="mt-5 text-[18px] leading-snug">
      El código original arrastra dependencias de MS-DOS. Exige usar doomgeneric:
    </p>
    <div className="mt-7 rounded-2xl bg-surface p-6">
      <p className="text-[18px] font-semibold text-accent">ozkl/doomgeneric</p>
      <p className="mt-2 text-[18px] text-muted">
        Aísla gráficos, reloj e inputs en solo 5 funciones en C.
      </p>
    </div>
  </Slide>,

  // 5. Restricción 3: Capa HAL
  <Slide tone="surface">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      Regla 3: Pídele solo la capa HAL
    </h2>
    <p className="mt-4 text-[18px] leading-snug">
      El agente no debe tocar el motor. Su única tarea es conectar estas 5 funciones en C con el microcontrolador:
    </p>
    <div className="mt-5">
      <Code lang="c" className="text-[14px]">
{`void DG_Init();
void DG_DrawFrame();
void DG_SleepMs(uint32_t ms);
uint32_t DG_GetTicksMs();
int DG_GetKey(int *pressed, unsigned char *key);`}
      </Code>
    </div>
  </Slide>,

  // 6. Mapeo a Arduino
  <Slide tone="base">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      Mapea la HAL a funciones Arduino
    </h2>
    <p className="mt-3 text-[18px] leading-snug text-muted">
      Conecta cada llamada con las APIs estándar de Arduino:
    </p>
    <div className="mt-4">
      <Code lang="cpp" className="text-[14px]">
{`void DG_SleepMs(uint32_t ms) { delay(ms); }
uint32_t DG_GetTicksMs() { return millis(); }
void DG_DrawFrame() {
  tft.pushColors(DG_ScreenBuffer, 320 * 200);
}`}
      </Code>
    </div>
    <Nota className="mt-3">Bus SPI a 40 MHz con librería TFT_eSPI para máxima fluidez.</Nota>
  </Slide>,

  // 7. Gestión de memoria WAD
  <Slide tone="surface">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      Prohíbe cargar el WAD en RAM
    </h2>
    <p className="mt-5 text-[18px] leading-snug">
      DOOM1.WAD pesa 4.19 MB. Ordena leer sectores por streaming desde una micro-SD sin desbordar el heap.
    </p>
    <div className="mt-7 rounded-2xl bg-bg p-6">
      <p className="text-[18px] font-bold text-accent">Lectura bajo demanda</p>
      <p className="mt-2 text-[18px] text-muted">
        Solo se cargan texturas del mapa actual.
      </p>
    </div>
  </Slide>,

  // 8. Resumen: Prompt maestro
  <Slide tone="base">
    <h2 className="font-display text-[36px] font-black leading-tight text-accent">
      El prompt estructurado
    </h2>
    <Prompt className="mt-5 border border-white/10 text-[18px] leading-relaxed">
      Porta doomgeneric a Arduino Nano ESP32 con pantalla SPI. Implementa solo las 5 funciones HAL de DG_*. Lee DOOM1.WAD por streaming desde SD sin cargarlo en RAM.
    </Prompt>
    <Nota className="mt-4">Guarda esta plantilla para tus proyectos de hardware embebido.</Nota>
  </Slide>,

  // 9. Cierre con Fila de gestos
  <Slide tone="surface" className="justify-between">
    <div>
      <h2 className="font-display text-[32px] font-black leading-tight text-accent">
        El agente no necesita magia para correr DOOM: necesita 5 funciones en C y restricciones claras de hardware.
      </h2>
      <p data-cta className="mt-6 text-[22px] font-bold leading-snug text-ink">
        Pásalo al chat de tu equipo antes de que alguien intente correr DOOM en un Arduino Uno.
      </p>
    </div>

    <div className="my-auto flex items-center justify-center gap-8 py-4">
      <Gesto accion="me-gusta" size={40} className="text-muted/40" />
      <Gesto accion="comentar" size={40} className="text-muted/40" />
      <Gesto accion="enviar" size={52} lleno className="text-accent" />
      <Gesto accion="guardar" size={40} className="text-muted/40" />
    </div>

    <Nota className="mt-auto">
      Info al 18 de octubre de 2026 · Fuentes: ozkl/doomgeneric y docs.arduino.cc
    </Nota>
  </Slide>,
];
