# Origen de lista-chequeo

- **Archivo de origen:** `content/2026-11-16-mac-para-programar/scenes/modelo.tsx`
- **Pieza:** `2026-11-16-mac-para-programar`
- **Escena original:** `modelo`

## Qué hace la escena

Presenta una tarjeta o ventana principal tipo lista de chequeo ("Notas") donde se enumeran de 3 a 6 puntos clave (con ícono, título y subtítulo). A medida que la voz en off menciona cada punto (`useCue`), la fila se ilumina con el color de acento/verde y se dibuja un checkmark animado. Al terminar la lista, aparece una tarjeta inferior con una conclusión, objeción o pregunta ("¿Mejor para todos?") que se tacha con una línea animada roja y un sello de cruz roja.

## Qué habría que convertir en parámetros

Cuando una segunda pieza necesite esta escena, se generalizará recibiendo:

1. `titulo` (string): Título superior de la tarjeta de chequeo (en el original, `"Modelo mental"`).
2. `subtitulo` (string, opcional): Metadato superior como fecha o categoría (en el original, `"16 de noviembre de 2026, 18:21"`).
3. `filas` (array de objetos): Lista de elementos a verificar:
   - `title`: Título principal del punto.
   - `sub`: Subtítulo o detalle explicativo.
   - `icon`: Nombre del ícono de `@motor/ui` (ej. `"terminal"`, `"cpu"`, `"battery-full"`, `"app-window"`, `"smartphone"`).
   - `word` o `at`: Palabra clave de sincronización (`useCue`) o segundo en el que se marca la fila.
4. `conclusion` (objeto opcional): Remate inferior de la escena:
   - `texto`: Frase o pregunta (en el original, `"¿Mejor para todos?"`).
   - `tachado`: booleano indicando si lleva la línea roja animada de tachado.
   - `word` o `at`: Momento en que entra la tarjeta y se tacha.
   - `tipo`: `"alerta"` (cruz roja), `"check"` (aprobado verde) o neutro.
5. `estilo` / `tema` (opcional): Colores tomados de la paleta de la pieza (fondo de tarjeta, acento, verde de éxito, rojo de advertencia/tachado).
