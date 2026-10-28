# Plan: menos cuota y menos tiempo por Reel

Lo pidió Jeremy el 27 de octubre de 2026, con una regla: **no bajar la calidad** del guion, lo visual ni la viralidad. Ese mismo día respondió las decisiones (al final).

## Estado (27 de octubre de 2026)

| Punto | Estado |
|---|---|
| Una sesión por fase con `estado.md` (1.1) | Hecho: [workflows/video.md](../workflows/video.md), "Una sesión por fase" |
| Crítico del guion antes de la puerta A (1.3) | Hecho y probado: `video:critique --guion --gemini` |
| Crítico del video (1.3) | Hecho y probado. Gemini no llegó al mínimo, así que va en el subagente `critico-ciego-video` (Sonnet 5.5) |
| Una ronda del crítico por defecto (1.3) | Hecho, en las guías |
| Reglas de permiso de `agy` (1.6) | Hechas y probadas |
| Render borrador (2.2) | Hecho y probado: `video:render --borrador` |
| Voz con tiempos, delegar fuentes y referentes | Pendiente |

## Lo que se midió

Se midió la sesión del 27 de octubre (`a76bbea1`), que hizo los dos Reels largos de ese día (`mcp-vs-acp` y `sistemas-de-archivos`) y cambió el motor. Los números salen de sus transcripciones, con estos pesos relativos a un token de entrada sin caché: escribir en caché 1,25, leer de caché 0,1 y salida 5.

| Dato | Valor |
|---|---|
| Llamadas | 345, todas a Opus 5.5, en una sola sesión de 16 h sin compactar |
| Contexto | empieza en 84 k, llega a 911 k y promedia 537 k tokens |
| Costo de la sesión | 24,4 M tokens equivalentes |
| En qué se va | leer el contexto de la caché 75 %, escribirlo 16 % y la salida de Opus (lo que piensa y escribe) 9 % |
| Una llamada más | unos 54 k equivalentes, solo por releer el contexto |
| Críticos ciegos | 6 subagentes en Opus, de 0,6 a 0,76 M cada uno: 4 M más (16 %) |

Lo que llenó el contexto: la salida de comandos y de scripts propios (unos 280 k tokens), los archivos escritos y editados (116 k, con `video.tsx` de 43 a 59 KB), las capturas del navegador para analizar referentes (93 k en 126 imágenes), la web (59 k) y la lectura de documentos (33 k).

Con las mismas 345 llamadas, una simulación da esto:

| Cambio | Ahorro |
|---|---|
| Delegar solo las lecturas pesadas (web, capturas) | 12 % |
| Partir la sesión en 3 fases con un traspaso | 48 % |
| Partir la sesión en 4 fases | 53 % |
| Partir la sesión en 4 fases y delegar las lecturas | 56 % |

**Conclusión:** lo caro no es lo que hace Opus, sino que lo hace con medio millón de tokens encima. El trabajo creativo es el 9 % del costo y no hace falta tocarlo.

**Tiempo activo de esa sesión,** unas 4,9 h para dos Reels y los cambios del motor:
- Opus generando: 81 min.
- Esperando renders y críticos en segundo plano: 134 min.
- Comandos en primer plano: 33 min.
- Esperando a Jeremy: 44 min.

Lo que tarda cada comando (24 al 27 de octubre):

| Paso | Tiempo |
|---|---|
| `video:prepare` | 160 a 170 s |
| `video:storyboard` | 120 a 130 s |
| `video:render`, de un video de 2 a 2,5 min | 180 a 200 s |
| Crítico ciego, por ronda | 6 a 7 min |
| `video:publicar` | 150 a 230 s |
| `npx tsc` y `npm test` | 80 a 100 s cada uno |

## 1. Consumo

### 1.1 Una sesión por fase

Es el ahorro más grande y no cambia quién hace qué.

| Fase | Termina en | Modelo |
|---|---|---|
| A. Tema, fuentes y guion | la puerta A | Opus |
| B. `video.tsx`, storyboard, voz y render | el primer render | Opus |
| C. Crítica y arreglos | la puerta B | Opus decide los arreglos; los mecánicos se delegan |
| Motor: cambios al kit | un commit con pruebas | Sonnet 5.5 o `agy` (ver 1.6) |

- **Traspaso:** la fase deja `content/<pieza>/estado.md` con las decisiones de Jeremy, lo que falta y por qué. `video.json` y `facts.json` ya guardan casi todo. La fase siguiente empieza leyendo ese archivo, no la conversación.
- **Una pieza por sesión.** El motor nunca se cambia a mitad de una pieza: se anota lo que falta y se hace en su propia sesión.
- **Las pausas también cuestan:** cuando Jeremy vuelve después de una hora, la caché ya venció y se vuelve a escribir todo el contexto. Con 600 k son unos 750 k equivalentes por pausa; con una sesión chica, casi nada.
- **Riesgo:** perder matices de lo hablado. Se cubre escribiendo `estado.md` antes de cerrar cada fase.

### 1.2 Opus define, otros ejecutan

| Tarea | Quién | Por qué no baja la calidad |
|---|---|---|
| Tesis, ganchos, guion, mundo, medidor y dirección de arte | Opus | No cambia |
| Composición de `video.tsx` | Opus | No cambia: es la calidad visual |
| Qué arreglar después del crítico | Opus | No cambia |
| Buscar fuentes y armar el borrador de `facts.json` | `agy` con Gemini 3.8 Flash (high), que busca en Google; si falla, subagente Sonnet 5.5 | Opus lee el resumen con las URLs, no las páginas. No suma revisiones de fuentes |
| Analizar un Reel de referencia | Subagente Sonnet 5.5 | Devuelve el desglose escena por escena en texto, en vez de 126 capturas en el contexto de Opus |
| Cambios del motor con especificación | `agy` con Gemini 3.8 Flash (high) o Sonnet 5.5 | Opus escribe qué cambiar y revisa el diff; `tsc` y las pruebas lo verifican |
| Errores mecánicos del inspector (margen, letra chica) | Sonnet 5.5 | Opus mira la hoja después |
| Pasar a `video-metrics.json` las capturas de Insights | Sonnet 5.5 o Gemini 3.8 Flash | Es una transcripción |

- **Un subagente arranca con 70 k a 140 k tokens.** Conviene cuando la tarea sumaría más de 20 k tokens o más de 5 llamadas a la sesión principal, no para un comando suelto.
- **`opusplan`** es un alias de Claude Code: Opus en modo plan y Sonnet al ejecutar. Encaja con la idea de Jeremy, pero en una pieza haría que Sonnet escriba `video.tsx`. Sirve para las sesiones del motor, no para las de una pieza.

### 1.3 El crítico ciego: antes, con menos rondas y en Gemini

**Por defecto, el crítico es Gemini 3.8 Flash** (decisión 3). Si la prueba muestra que no llega al mínimo, va Sonnet 5.5.

**Va por la API de Gemini, no por `agy`.** Se probó el 27 de octubre:
- `agy` sin interfaz no le pasa el video al modelo. Al leer un MP4 de 20 s, el contexto creció 2,6 k tokens, cuando un video con audio son unos 290 tokens por segundo.
- Después intentó correr `ffprobe`, y sin una regla de permiso el comando se rechaza.
- Con un PNG de las tiras pasó lo mismo.

La API recibe el MP4 entero, con imagen y sonido. Un Reel de 140 s son unos 40 k tokens de entrada, que se pagan con los 10 USD de créditos de Google Cloud. El costo exacto se mide en la prueba.

**Cómo queda:**
- **`video:critique --gemini`.** Le manda a Gemini el MP4, la transcripción, el texto del post, `docs/critica-video.md` y `docs/critico-ciego-video.md`, y escribe `out/video-critica/informe.md`.
  - Va detrás de un puerto en `packages/media`, como la voz, para poder cambiar de proveedor.
  - El informe dice qué modelo lo escribió.
- **Gana un oído.** Los críticos de Claude escriben "no pude oír el video". Gemini oye la voz, la música, la sincronía y el ritmo.
- **Un crítico del guion antes de la puerta A** (decisión 4). Los problemas de retención de los Reels del 27 eran del guion:
  - en `mcp-vs-acp`, 32 s de repaso antes de lo nuevo y 33 s de listas al final;
  - en `sistemas-de-archivos`, 48 s que no responden al gancho.

  Lee solo `video.json` (lo que dice la voz y lo que se ve) y `storyboard.png`, con la misma rúbrica, y su informe entra en la hoja de la puerta A. Es `video:critique --guion`, con el mismo modelo que el crítico del video.
- **Una ronda del crítico del video por defecto.** La segunda solo va si un punto saca menos de 3 o hay un error grave. Hoy son hasta tres.
- **Opus no lee el video:** recibe el informe de texto y decide qué arreglar.

**La prueba, antes de usarlo en una pieza nueva:**
1. Se corre `video:critique --gemini` sobre los dos Reels del 27 y se compara con los informes de Opus que ya existen (`video-critica.md`).
2. Se corre `video:critique --guion` sobre sus dos `video.json`.
3. **Mínimo para quedarse con Gemini:**
   - en cada Reel, encuentra al menos 2 de los 3 problemas principales que marcó Opus;
   - sus puntajes no se alejan más de 1 punto de los de Opus en ningún renglón;
   - no inventa errores graves;
   - el crítico del guion marca el repaso de `mcp-vs-acp` o el desvío de `sistemas-de-archivos`.
4. **Si no llega:** el crítico vuelve a ser un subagente, ahora en Sonnet 5.5, con las tiras como hoy. Y se corre la misma prueba con Sonnet.
5. **La duda de Jeremy:** cree que Flash puede saltarse detalles. La prueba lo mide con los mismos Reels, en vez de suponerlo.

**Resultado de la prueba (27 de octubre de 2026).** Los puntajes van de Gancho a Recurso visual, en el orden de la rúbrica:

| Crítico | `mcp-vs-acp` | `sistemas-de-archivos` | De los 3 problemas de Opus |
|---|---|---|---|
| Opus 5.5 (referencia) | 3,75 (4 4 4 2 4 4 3 4 4) | 4,05 (4 4 5 3 4 4 4 4 4) | – |
| Gemini 3.8 Flash, 1.ª vuelta | 4,80 | 4,80 | 2 y 1 |
| Gemini 3.8 Flash, con el prompt corregido | 4,65 (4 5 5 3 5 5 5 5 5) | 4,90 (5 5 5 4 5 5 5 5 5) | 3 y 1 |
| Sonnet 5.5 | 3,40 (3 4 4 2 3 4 3 3 4) | 3,60 (4 4 4 2 3 4 4 3 4) | 2 y 2 |
| Gemini, crítico del guion | 4,50 (Retención 3) | 4,56 (Retención 3) | Marcó el repaso y el desvío |

- **Gemini en el video no llega al mínimo.** Sube casi todo un punto, en Voz se aleja dos, y habría aprobado `sistemas-de-archivos` para la puerta B cuando Opus y Sonnet lo rechazaban. Tampoco vio el choque de etiquetas del gancho ni la desincronía de 1 s, aunque oye el audio.
- **El prompt tenía un error:** decía que el video llevaba la interfaz de Instagram encima. Por eso la 1.ª vuelta de Gemini pidió "zona segura", en contra de la decisión de la cuenta. Ya está corregido en `docs/critica-video.md` y `docs/critico-ciego-video.md`.
- **Sonnet pasa.** Encuentra 2 de 3 problemas en cada Reel, ningún puntaje se aleja más de 1 punto, y es un poco más duro que Opus.
  - Tardó 79 y 91 s, con unos 107 k tokens cada uno. Los de Opus del 27 tardaron de 6 a 7 min y costaron de 0,6 a 0,76 M equivalentes.
- **Gemini en el guion pasa.** Marca en el papel lo mismo que Opus marcó en el video. Tarda de 67 a 87 s, sin cuota de Claude.
- **Tiempos de Gemini en el video:** de 133 a 191 s por Reel, subida incluida.
- **Opción que no se probó:** la API también tiene `gemini-4-argon`, que se paga con los créditos. Si Jeremy quiere volver a intentar con Gemini en el video, es el siguiente candidato.

### 1.4 Menos idas y vueltas con el contexto grande

- **Cada llamada con 500 k de contexto cuesta unos 50 k.** Las ediciones se agrupan en un solo mensaje y se evitan las pruebas sueltas con `node -e` para medir algo.
- **Los comandos imprimen un resumen** y dejan el detalle en archivos, como ya hace el inspector.
- **`video.tsx` se escribe una vez completo** y después se edita, sin reescribirlo entero.
- **Capturas a escala 0,5** (un cuarto de los tokens) cuando solo se revisa la composición. Para una revisión, la hoja antes que cuadros sueltos.

### 1.5 El contexto de arranque

Una sesión empieza con 84 k tokens. Apagar en este proyecto las skills y los conectores que no usa (las de diseño web, InsForge, el Notion repetido, Gmail) ahorra poco, entre el 1 y el 2 %, pero no cuesta nada.

### 1.6 Antigravity

Lo que hay en la cuenta (Google AI Pro), confirmado por Jeremy y probado el 27 de octubre de 2026:
- **Sesión iniciada** en `agy` 1.4.0 y en Antigravity IDE. Gemini CLI ya no sirve: dejó de atender AI Pro el 18 de junio de 2026 ([anuncio](https://github.com/google-gemini/gemini-cli/discussions/27274)).
- **Modelos:**
  - Gemini 3.8 Flash en low, medium y high, con una cuota que a Jeremy casi nunca se le acaba;
  - Claude Sonnet y Opus 4.6, con una cuota muy baja; según la [documentación](https://antigravity.google/docs/models), salen el 2 de noviembre de 2026;
  - Gemini 4 es del plan Ultra.

  Para el motor se usa **solo Gemini 3.8 Flash (high)**.
- **Funciona sin interfaz para texto y código.** Una prueba de solo lectura tardó 20 s, usó 36 k tokens y resumió bien `packages/video/src/inspector.ts`:

  ```bash
  agy -p "..." --model gemini-3.8-flash-high --mode plan --output-format json
  ```
- **Los comandos necesitan reglas de permiso.** Sin interfaz, `agy` rechaza cualquier comando que no esté permitido en su `settings.json`. `--dangerously-skip-permissions` lo bloquea el modo automático de Claude Code, y está bien que lo bloquee.

  **Reglas puestas el 27 de octubre de 2026,** en `~/.gemini/antigravity-cli/settings.json` (con respaldo en `settings.json.bak-2026-10-27`):
  - **Permitidos:** `npx tsc`, `npm test`, `npm run typecheck`, `node --import tsx --test`, `git status` y `git diff`.
    - Cada regla acepta argumentos, pero no `;`, `&`, `|`, `<`, `>`, `` ` `` ni `$`, para que no se pueda encadenar otro comando.
    - Van como `regex:`. En Windows, las reglas por prefijo (`command(git status)`) no funcionan, y `git status --short` se rechazaba igual.
  - **Prohibidos:** `npm run video:publicar`, `npm run carrusel:publicar`, `npm run publisher`, `git push` y `git commit`.
- **Probado:** `git status --short` corre; `git status --short; echo hola` se rechaza; `npm run publisher -- status` se bloquea.
- **Ojo con eso último.** Con el comando bloqueado, Gemini leyó el código y el registro y armó una tabla como si lo hubiera corrido, sin avisar. Lo que diga `agy` sobre una salida se comprueba corriendo el comando desde Claude Code.
- **Cómo se usa desde Claude Code:**
  - Opus escribe la especificación en un archivo y corre `agy -p` con `--mode accept-edits`, sobre un árbol de git limpio;
  - después revisa `git diff` y corre las pruebas;
  - `agy` lee `AGENTS.md`, que ya se dirige a Antigravity;
  - nunca se le dan las puertas ni la publicación.

## 2. Tiempo

1. **El crítico del guion antes de la puerta A (1.3).** Es lo que más tiempo ahorra: cada ronda que se evita después son unos 10 min de render y crítico, más los arreglos.
2. **El render borrador** (decisión 5).
   - `video:render --borrador` a escala 1 (540×960), para las rondas intermedias del crítico y para comprobar los arreglos. El de 1080×1920 sale una sola vez, antes de la puerta B.
   - El inspector mide en px de diseño (lee el DOM), así que no cambia.
   - Medido con los primeros 10 s de `mcp-vs-acp`: 20,5 s contra 25,1 s, con unos 10 s fijos de arranque. Por cuadro es un 35 % menos: un Reel de 2,4 min baja de unos 200 s a unos 130 s.
   - Hecho el 27 de octubre. Con `sistemas-de-archivos` (152 s de video), el comando completo tardó 178 s, con el empaquetado, la normalización del volumen y el inspector. El inspector dio lo mismo que en el render final. Para la prueba de congelados, el recorte de ffmpeg ahora es relativo al tamaño del video.
3. **La voz sin whisper y en paralelo.**
   - Hoy el adaptador de ElevenLabs usa `convert`, sin tiempos, y whisper `small` alinea escena por escena, una tras otra.
   - `convertWithTimestamps` devuelve el tiempo de cada carácter del texto exacto. Se divide por el `tempo` y ya no hace falta whisper, sin errores de transcripción.
   - Las escenas se generan de a varias, las que permita el plan.
   - Estimado: `video:prepare` baja de 160 s a menos de 60 s. Hay que medirlo.
4. **El storyboard más liviano.** Las pruebas del agente van a escala 0,5. El que ve Jeremy en la puerta A, a escala 1.
5. **Renderizar solo lo que cambió.** Para comprobar un arreglo basta con el tramo de esa escena (`--frames`) y sus cuadros de la hoja. Es un trabajo mediano.
6. **En paralelo:**
   - las fuentes, mientras Opus arma el ángulo;
   - el orden de los ganchos, mientras corre el storyboard;
   - el texto del post, mientras renderiza.

   Dos piezas pueden ir desfasadas (una en fuentes mientras la otra renderiza), pero nunca dos renders a la vez: son 6 núcleos.
7. **Solo en las sesiones del motor:**
   - `tsc --incremental`;
   - mientras se itera, solo las pruebas del paquete que cambió;
   - `npm test` completo antes del commit.
8. **Contexto más chico, respuestas más rápidas.** Las sesiones por fase (1.1) también acortan los 81 min de Opus generando.

[plan-optimizacion.md](plan-optimizacion.md) sigue valiendo para el render de los carruseles.

## 3. La RTX 3050

Datos de la tarjeta: 6 GB de VRAM, driver 591.86, con NVENC. Se midió el 27 de octubre, renderizando los primeros 10 s de `mcp-vs-acp` (300 cuadros a 1080×1920) fuera de la pieza.

| Prueba | Tiempo | Uso de la GPU |
|---|---|---|
| Como hoy: `angle`, que usa la GPU | 25 a 27 s | 18 a 22 % de promedio |
| Sin GPU (`swangle`, por CPU) | 87 s | – |
| Codificar con NVENC en vez de x264 | 25,6 s | NVENC al 24 % |
| Concurrencia 4, por defecto (6) y 10 | 25,5, 27,3 y 28,4 s | – |
| Escala 1 (el borrador) | 20,5 s | 19 % |

**La GPU ya trabaja.** `remotion.config.ts` usa `angle`, que dibuja con la tarjeta, y por eso el render va 3,2 veces más rápido que por CPU. Hay que mantenerlo.

**Lo que no ayuda:**
- **NVENC no acelera nada.** Lo que limita es dibujar y capturar cada cuadro en Chrome, no codificar. Además, sin `crf` el archivo pesa 4,7 veces más, así que la salida final sigue en x264 con `crf` 18.
- **Subir la concurrencia tampoco.** Con 4 sale apenas más rápido que con 6 (el valor por defecto) o con 10, y los 4 archivos salen idénticos, así que el render sigue siendo determinista.

**Dónde puede servir:**
- **whisper con CUDA,** solo si la voz sigue pasando por whisper. Con los tiempos de ElevenLabs (punto 3 de la sección 2) deja de hacer falta. Queda para Gemini TTS u otro proveedor sin tiempos.
- **Recortar fondos en local.** Hoy `video:image --chroma` genera sobre verde y recorta por color. Un modelo de recorte en la GPU (por ejemplo BiRefNet) deja mejores bordes en pelo y sombras, sin pagar otra generación. Mejora la calidad, no el tiempo, y va en un plan aparte si Jeremy lo quiere.
- **Modelos de lenguaje locales:** no convienen. Con 6 GB solo caben modelos chicos, peores que Gemini 3.8 Flash, que ya sale casi gratis en `agy`.

## Orden propuesto

1. **Sesión por fase con `estado.md`** (1.1): solo cambia el flujo, en [workflows/video.md](../workflows/video.md) y [skills/video-es](../skills/video-es/SKILL.md).
2. **El crítico en Gemini:** el puerto de `packages/media`, `video:critique --gemini` y `--guion`, una ronda por defecto y la prueba con los dos Reels del 27 (1.3).
3. **`video:render --borrador`** (sección 2, punto 2).
4. **La voz con tiempos de ElevenLabs y en paralelo** (sección 2, punto 3).
5. **Delegar:**
   - subagentes con su modelo fijo en `.claude/agents/`, para el análisis de referentes y los arreglos del inspector;
   - `agy` para las fuentes y el motor, con sus reglas de permiso.
6. **Medir la pieza siguiente** con los mismos scripts y comparar contra 24,4 M y 4,9 h activas por dos Reels.

## Lo que no cambia

- Las puertas A y B, los hechos con fuente y las reglas de `AGENTS.md`.
- Opus escribe la tesis, los ganchos, el guion, la dirección de arte y `video.tsx`, y decide los arreglos.
- La publicación, solo cuando Jeremy la pide.

## Decisiones de Jeremy (27 de octubre de 2026)

1. **`agy` y Antigravity IDE:** se pueden usar, con la sesión ya iniciada. La regla vieja de no usar ese login quedó borrada.
2. **El plan es AI Pro:** Gemini 3.8 Flash con cuota amplia. Los Claude 4.6 de Antigravity tienen muy poca cuota y no se usan.
3. **El crítico:** Gemini por defecto, con la prueba de 1.3. Si Gemini no llega al mínimo, Sonnet 5.5.
   - Su mensaje dice "si la prueba demuestra que Gemini cumple con lo mínimo, está bien que usemos Sonnet". Se leyó como "si **no** cumple". Falta confirmarlo.
4. **El crítico del guion antes de la puerta A:** sí.
5. **El render borrador:** sí.
6. **La RTX 3050:** se midió (sección 3) y ya se aprovecha en el render.

Confirmado después, el mismo día:
- la decisión 3 era "si **no** cumple, Sonnet";
- se agregan las reglas de permiso de `agy`.
