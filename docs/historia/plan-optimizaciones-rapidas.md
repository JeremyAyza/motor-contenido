# Plan: Optimizaciones Rápidas para Agentes de Código

> **Fecha:** 24 de octubre de 2026  
> **Objetivo:** Identificar e implementar mejoras rápidas (*quick wins* de alto impacto y bajo riesgo) en la experiencia de desarrollo (DX), higiene y automatización del repositorio `motor-contenido`, estructuradas de tal forma que **cualquier agente de código de cualquier nivel** (Claude Code, Cursor, Antigravity, Gemini CLI, Codex) pueda ejecutarlas paso a paso sin riesgo de romper el motor.

---

## 1. Diagnóstico del Estado Actual

Tras una inspección completa de los 5 paquetes (`brand`, `carousel`, `media`, `publisher`, `video`), flujos de trabajo (`workflows/`), esquemas Zod, tests (170 pruebas pasando) y reglas en `AGENTS.md`, se identifican los siguientes puntos de fricción para agentes de código:

1. **Asimetría en Scaffolding:** Existe `carrusel:nuevo` para iniciar un carrusel, pero **no existe `video:nuevo`**. Cualquier agente que deba crear un Reel tiene que armar `video.json` y `video.tsx` manualmente desde cero o copiando de otra pieza, arriesgando errores de esquema Zod (`world`, `meter`, `cover`, `gateA`, `gateB`, etc.).
2. **Bug en el Scaffold de Carrusel:** `carrusel:nuevo` genera un `slides.tsx` con solo 2 láminas (portada y despedida), pero el validador del motor en `render.tsx` exige estrictamente `slides.length >= 3`. Un agente principiante que ejecuta `carrusel:nuevo` e inmediatamente prueba `carrusel:render` recibe un error fatal.
3. **Iteración Lenta en Carruseles Animados:** `carrusel:render` siempre renderiza y graba video (180 cuadros con Playwright + ffmpeg) de todas las láminas animadas. Durante la fase de diseño, si un agente solo quiere calibrar textos, márgenes o contraste, debe esperar varios minutos por render.
4. **Fricción de Shell en Windows:** Muchos agentes intentan encadenar comandos con `&&` (ej. `npm run typecheck && npm test`), lo cual falla en PowerShell 5.1 (`ParserError`). Falta un script unificado de comprobación de salud (`npm run check`).
5. **Falta de Validación Ligera (< 1 segundo):** Para verificar si los JSONs o los archivos TSX son válidos, el agente tiene que correr `carrusel:render` o `video:render`, lanzando navegadores y Remotion. No hay un comando de validación rápida en frío.
6. **Duplicación Masiva de Assets (Avatar):** Cada pieza de video duplica ~14.5 MB de PNGs idénticos en `content/<pieza>/img/` (`avatar-base.png`, bocas, ojos). Aunque existe `assets/avatar/manifest.example.json`, no se ha centralizado el avatar compartido.
7. **Higiene del Repositorio:** Existen archivos binarios huérfanos en la raíz (`gato.png` de 2.5 MB y `audio.wav` de 62 KB) no utilizados por ningún componente, y las piezas temporales `content/zz-*` solo estaban ignoradas en `.git/info/exclude` local.

---

## 2. Matriz de Optimizaciones Rápidas

Todas las propuestas seleccionadas cumplen con tres criterios estrictos:
1. **Bajo riesgo:** No alteran la arquitectura de render ni las reglas editoriales de `AGENTS.md`.
2. **Alta claridad:** Cualquier modelo de lenguaje con capacidad de edición de archivos puede ejecutarlas con instrucciones directas.
3. **Verificación determinista:** Cada una cuenta con un comando exacto para verificar que no rompió nada (`npm test`, `npm run typecheck`).

| ID | Optimización | Impacto | Dificultad | Tiempo Estimado |
|---|---|---|---|---|
| **OPT-01** | Bugfix: Scaffold de `carrusel:nuevo` válido (3 láminas) | Alto (elimina error inmediato) | Muy Baja | ✓ **Completada** |
| **OPT-02** | Comando `video:nuevo` para scaffolding de Reels | Muy Alto (evita errores de Zod) | Baja | ✓ **Completada** |
| **OPT-03** | Flag `--still` en `carrusel:render` para iteración rápida | Alto (reduce render de 5 min a 10s) | Baja | 15 min |
| **OPT-04** | Script unificado de salud cross-platform (`npm run check`) | Alto (evita errores `&&` en Windows) | Muy Baja | 10 min |
| **OPT-05** | Comandos de validación en frío (`carrusel:validar` / `video:validar`) | Medio-Alto (feedback en < 1s) | Baja | 15 min |
| **OPT-06** | Limpieza de archivos huérfanos y `content/zz-*/` en `.gitignore` | Medio (higiene y peso) | Muy Baja | 5 min |
| **OPT-07** | Centralización de assets del avatar en `assets/avatar/` | Medio-Alto (ahorra 15MB/pieza) | Baja-Media | 20 min |
| **OPT-08** | Comando CLI para humanizar textos sueltos (`npm run texto:limpiar`) | Medio (previene slop de IA) | Baja | ✓ **Completada** |

---

## 3. Plan Detallado de Implementación

---

### OPT-01: Corrección de la plantilla en `carrusel:nuevo`

- **Problema:** En `packages/carousel/src/cli.ts` (líneas 136-146), la plantilla generada para `slides.tsx` tiene solo 2 láminas. `render.tsx` (línea 56) lanza: `Error: slides.tsx debe exportar por defecto un arreglo de 3 a 20 láminas`.
- **Solución:** Agregar una lámina intermedia (lámina 2) que use un componente representativo de `@motor/ui` (ej. `<Proceso>` o una lámina con texto y recurso).
- **Archivos a modificar:** `packages/carousel/src/cli.ts`
- **Paso a paso para el agente:**
  1. Abrir `packages/carousel/src/cli.ts`.
  2. En la generación de `slides.tsx` dentro de `case "nuevo"`, agregar una lámina entre la portada y el cierre:
     ```tsx
       <Slide>
         <h2 className="font-display text-5xl font-black leading-[0.95]">Idea central</h2>
         <p className="mt-6 text-2xl leading-snug">Explicación concisa con un recurso visual.</p>
       </Slide>,
     ```
  3. Asegurar que las láminas totales exportadas sean 3.
- **Verificación:**
  - Ejecutar `npm run carrusel:nuevo -- test-scaffold-tmp`.
  - Comprobar que `content/<fecha>-test-scaffold-tmp/slides.tsx` contiene 3 láminas.
  - Eliminar la carpeta temporal.
  - Ejecutar `npm test`.

---

### OPT-02: Creación del comando `video:nuevo`

- **Problema:** Actualmente no existe comando para inicializar una pieza de video. El agente debe redactar a mano `video.json`, `video.tsx` y `facts.json`.
- **Solución:** Implementar `video:nuevo <slug> [--formato corto|explicado|largo] [--cuenta dev]` en `packages/video/src/cli.ts` y agregarlo a `package.json`.
- **Archivos a modificar:** `packages/video/src/cli.ts`, `package.json`, `AGENTS.md`
- **Paso a paso para el agente:**
  1. En `packages/video/src/cli.ts`, crear la función `nuevo(args: string[])`:
     - Leer `<slug>` y flags opcionales `--formato` (default `"corto"`) y `--cuenta` (default `"dev"`).
     - Crear la carpeta `content/<fecha>-<slug>`.
     - Escribir `facts.json` con `{ topic: slug, checkedAt: today(), facts: [], pendingToVerify: [] }`.
     - Escribir `video.json` con un esqueleto válido para `VideoScriptSchema`:
       - `format`: `"corto"`
       - `topic`: `slug`
       - `world`: `"Metáfora física del escenario"`
       - `meter`: `{ label: "Métrica", from: "0", to: "100" }`
       - `cover`: `{ scene: "gancho" }`
       - `hooks`: `[{ said: "Gancho inicial de la voz", onScreen: "Gancho en pantalla", formula: 1 }]`
       - `scenes`: 3 escenas estándar (`gancho`, `desarrollo`, `cierre`) con `resource` válido (ej. `"objeto"`, `"proceso"`, `"cifra"`).
       - `gateA`: `{ approved: false }`
       - `gateB`: `{ approved: false }`
     - Escribir `video.tsx` con un `defineVideo` funcional que compile inmediatamente con `@motor/video`.
  2. En el `switch` o `if/else` de `main()` en `packages/video/src/cli.ts`, mapear `command === "nuevo"`.
  3. En `package.json`, agregar el script:
     ```json
     "video:nuevo": "tsx packages/video/src/cli.ts nuevo"
     ```
  4. Agregar la documentación del comando en `USAGE` de `packages/video/src/cli.ts` y en `AGENTS.md`.
- **Verificación:**
  - Ejecutar `npm run video:nuevo -- prueba-video-scaffold`.
  - Ejecutar `npm run video:script -- content/<fecha>-prueba-video-scaffold`.
  - Debe validar el guion y generar `out/gate-a.md` sin errores de schema.
  - Eliminar la carpeta de prueba.
  - Ejecutar `npm test`.

---

### OPT-03: Flag `--still` en `carrusel:render` para iteración rápida

- **Problema:** Un carrusel con láminas animadas ejecuta captura cuadro por cuadro (180 capturas) y codificación con ffmpeg por cada lámina animada. Cuando el agente está iterando en layout, tipografías o textos, el render tarda de 3 a 5 minutos innecesariamente.
- **Solución:** Agregar el flag `--still` o `--sin-animar` a `carrusel:render <carpeta> [--still]`.
- **Archivos a modificar:** `packages/carousel/src/cli.ts`, `packages/carousel/src/render.tsx`
- **Paso a paso para el agente:**
  1. En `packages/carousel/src/render.tsx`, agregar una opción `still?: boolean` a `RenderOptions` en `renderPiece(dir: string, options?: { still?: boolean })`.
  2. En el bucle de grabación de movimiento (alrededor de la línea 450 de `render.tsx`), verificar:
     ```ts
     if (options?.still) {
       // Omitir grabación de video MP4 en modo still
       continue;
     }
     ```
  3. En `packages/carousel/src/cli.ts`, dentro de `case "render"`:
     - Detectar si `rest.includes("--still")` o `rest.includes("--sin-animar")`.
     - Pasarlo a `renderPiece(resolve(arg), { still: isStill })`.
     - Imprimir en consola: `"[modo still] Grabación de videos animados omitida para iteración rápida."`
- **Verificación:**
  - Correr `npm run carrusel:render -- content/2026-10-24-carrusel-que-se-mueve --still`.
  - Comprobar que genera los PNGs, `revision.png`, y la revisión de textos en segundos sin lanzar ffmpeg.
  - Ejecutar `npm test`.

---

### OPT-04: Script unificado de salud cross-platform (`npm run check`)

- **Problema:** En Windows PowerShell, encadenar `npm run typecheck && npm test` genera `ParserError: El token '&&' no es un separador de instrucciones válido`. Además, los agentes olvidan verificar si los schemas JSON quedaron desincronizados.
- **Solución:** Crear un script en TypeScript `packages/carousel/src/check.ts` y exponerlo como `npm run check`.
- **Archivos a crear/modificar:**
  - Crear `packages/carousel/src/check.ts`
  - Modificar `package.json`
- **Paso a paso para el agente:**
  1. Crear `packages/carousel/src/check.ts` que ejecute de forma ordenada mediante `execSync` o `spawnSync`:
     - Paso 1: `tsc -p tsconfig.json --noEmit` (chequeo de tipos).
     - Paso 2: `node --import tsx --test packages/*/test/*.test.ts` (suite de tests).
     - Paso 3: Opcionalmente exportar schemas (`carrusel:esquema` y `video:schema`) y comprobar que `git diff --exit-code schemas/` esté limpio.
     - Imprimir un resumen visual claro (`✓ Tipos`, `✓ Pruebas`, `✓ Esquemas`).
  2. En `package.json`, agregar:
     ```json
     "check": "tsx packages/carousel/src/check.ts"
     ```
- **Verificación:**
  - Ejecutar `npm run check` en PowerShell.
  - Debe completar los tres pasos e informar código de salida 0.

---

### OPT-05: Validación en frío sin renderizar (`carrusel:validar` / `video:validar`)

- **Problema:** No hay forma de validar si `post.json`, `brief.json` o `video.json` tienen errores de sintaxis, Zod o campos requeridos sin lanzar Chromium o Remotion.
- **Solución:** Agregar comandos `carrusel validar <carpeta>` y `video validar <carpeta>`.
- **Archivos a modificar:** `packages/carousel/src/cli.ts`, `packages/video/src/cli.ts`, `package.json`
- **Paso a paso para el agente:**
  1. En `packages/carousel/src/cli.ts`, agregar `case "validar"`:
     - Cargar y validar `brief.json` con `BriefSchema`.
     - Cargar y validar `post.json` con `PostSchema`.
     - Importar `slides.tsx` y validar que exporte un arreglo de 3 a 20 láminas.
     - Imprimir lista de errores o `✓ Pieza de carrusel válida`.
  2. En `packages/video/src/cli.ts`, agregar `command === "validar"`:
     - Cargar y validar `video.json` con `VideoScriptSchema`.
     - Importar `video.tsx` y validar que exporte una `VideoDef` con escenas coincidentes.
     - Imprimir lista de errores o `✓ Pieza de video válida`.
  3. Exponer en `package.json`:
     ```json
     "carrusel:validar": "tsx packages/carousel/src/cli.ts validar",
     "video:validar": "tsx packages/video/src/cli.ts validar"
     ```
- **Verificación:**
  - Ejecutar `npm run carrusel:validar -- content/2026-10-24-carrusel-que-se-mueve`.
  - Ejecutar `npm run video:validar -- content/2026-10-24-cuanto-cuesta-la-ia`.
  - Ambos deben responder en menos de 1 segundo.

---

### OPT-06: Higiene de archivos raíz y actualización de `.gitignore`

- **Problema:**
  - `gato.png` (2.5 MB) y `audio.wav` (62 KB) están huérfanos en la raíz desde el commit inicial (documentado en `contexto.md` que nadie los usa).
  - Las piezas temporales de prueba `content/zz-*` solo estaban en `.git/info/exclude` local, por lo que cualquier nuevo clon o agente corre el riesgo de commitearlas.
- **Solución:**
  - Mover o remover los archivos huérfanos de la raíz.
  - Añadir `content/zz-*/` al `.gitignore` oficial del repositorio.
- **Archivos a modificar:** `.gitignore`, eliminar `audio.wav` y `gato.png`.
- **Paso a paso para el agente:**
  1. Verificar con `grep_search` si algún archivo de código importa o lee `gato.png` o `audio.wav` (confirmado: ninguno lo hace).
  2. Eliminar `audio.wav` y `gato.png` de la raíz del repo.
  3. En `.gitignore`, agregar:
     ```gitignore
     # Piezas de prueba y maquetas temporales locales
     content/zz-*/
     ```
  4. Ejecutar `git status` para confirmar el árbol limpio.
- **Verificación:**
  - Correr `npm test` para asegurar que ningún test dependía de ellos.

---

### OPT-07: Centralización del Avatar en `assets/avatar/`

- **Problema:** Las piezas `cuanto-cuesta-la-ia` y `replica-skills` duplican exactamente los mismos 4 archivos PNG de ~3.5 MB cada uno (`avatar-base.png`, `avatar-boca-media.png`, `avatar-boca-abierta.png`, `avatar-ojos-cerrados.png`), acumulando casi 30 MB duplicados.
- **Solución:** Crear el manifiesto real en `assets/avatar/manifest.json` y colocar los sprites compartidos en `assets/avatar/jeremy/`, permitiendo que el motor cargue el avatar por defecto desde la cuenta (`accounts/dev.json`).
- **Archivos a crear/modificar:**
  - `assets/avatar/manifest.json`
  - `assets/avatar/jeremy/` (mover los sprites compartidos)
  - `packages/video/src/kit/avatar.tsx` (permitir resolver paths relativos a `REPO_ROOT` o `assets/avatar/`)
- **Paso a paso para el agente:**
  1. Copiar los 4 sprites base a `assets/avatar/jeremy/`.
  2. Crear `assets/avatar/manifest.json` basado en la configuración actual de `accounts/dev.json` y los `video.tsx` existentes:
     ```json
     {
       "id": "jeremy-default",
       "base": "assets/avatar/jeremy/avatar-base.png",
       "mouths": [
         "assets/avatar/jeremy/avatar-boca-media.png",
         "assets/avatar/jeremy/avatar-boca-abierta.png"
       ],
       "blink": "assets/avatar/jeremy/avatar-ojos-cerrados.png",
       "mouthBox": { "x": 420, "y": 580, "w": 180, "h": 120 },
       "eyesBox": { "x": 380, "y": 420, "w": 260, "h": 100 },
       "imageSize": 1024
     }
     ```
  3. Actualizar `packages/video/src/kit/avatar.tsx` para que si `avatar.base` no existe en la carpeta de la pieza, lo resuelva relativo a la raíz del repositorio o lea el avatar predeterminado de la cuenta.
- **Verificación:**
  - Correr `npm run video:script -- content/2026-10-24-replica-skills`.
  - Correr `npm test`.

---

### OPT-08: Comando CLI para limpieza/humanización de textos sueltos

- **Problema:** Durante la redacción de ganchos o captions, los agentes cometen errores frecuentes de léxico de IA (palabras prohibidas en `slop-es.json` o guiones largos `—`). El agente solo descubre esto tras correr el render y ver la alerta del inspector.
- **Solución:** Exponer un comando rápido `npm run texto:limpiar -- "texto a evaluar"` que ejecute `skills/ig-es/humanize_es.py` y `detect_es.py`.
- **Archivos a modificar:** `package.json`, `packages/carousel/src/cli.ts` o script wrapper en `packages/carousel/src/texto.ts`.
- **Paso a paso para el agente:**
  1. Agregar en `package.json`:
     ```json
     "texto:limpiar": "tsx packages/carousel/src/python.ts skills/ig-es/humanize_es.py"
     ```
  2. Documentar su uso en `AGENTS.md`: cualquier agente puede filtrar su borrador de texto antes de escribirlo en `post.json` o `video.json`.
- **Verificación:**
  - Ejecutar `npm run texto:limpiar -- "Un enfoque crucial — descubre el secreto"`.
  - Debe imprimir el texto limpio sin guiones largos ni términos de relleno.

---

## 4. Orden de Ejecución Recomendado

Para cualquier agente que asuma este plan, el orden óptimo de menor a mayor complejidad es:

1. **Paso 1 (5 min):** `OPT-01` (Arreglar template de `carrusel:nuevo` a 3 láminas).
2. **Paso 2 (5 min):** `OPT-06` (Limpiar `audio.wav`, `gato.png` y agregar `content/zz-*/` a `.gitignore`).
3. **Paso 3 (10 min):** `OPT-04` (Crear `npm run check` unificado).
4. **Paso 4 (15 min):** `OPT-02` (Implementar `video:nuevo`).
5. **Paso 5 (15 min):** `OPT-03` (Agregar flag `--still` a `carrusel:render`).
6. **Paso 6 (15 min):** `OPT-05` (Implementar comandos rápidos de validación en frío).
7. **Paso 7 (10 min):** `OPT-08` (Exponer comando `texto:limpiar`).
8. **Paso 8 (20 min):** `OPT-07` (Centralizar assets del avatar).

---

## 5. Criterios de Aceptación Global

Al completar el plan:
- `npm run check` corre limpiamente en Windows PowerShell y Linux sin fallos de sintaxis.
- `npm test` mantiene los 170 tests pasando (o más con las nuevas pruebas de CLI).
- `npm run typecheck` no arroja ningún error de tipado TypeScript.
- Tanto carrusel como video tienen paridad completa en su ciclo de vida (`nuevo` -> `validar` -> `brief/script` -> `render` -> `critica` -> `publicar`).
