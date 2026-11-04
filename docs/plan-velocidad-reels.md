# Plan: un Reel en 40 minutos

Lo pidió Jeremy el 3 de noviembre de 2026: un Reel tarda cerca de una hora y media, y él sospecha que el agente pasa gran parte de ese tiempo pensando en cosas sencillas.

**Este plan no hereda nada de los planes ni de las guías anteriores,** porque no están validados. Se apoya solo en dos cosas:
- la medición de las transcripciones de la sesión del 3 de noviembre de 2026;
- las pruebas de Antigravity hechas ese mismo día.

Las guías actuales aparecen aquí solo como archivos que hay que cambiar, limpiar o archivar.

**Regla:** no bajar la calidad del guion, lo visual ni la viralidad. La calidad la juzga Jeremy, que compara cada Reel nuevo con el último. El crítico ciego sirve de referencia, no de vara.

## Lo que se midió

La sesión `8d19a4b5`, del 3 de noviembre de 2026, hizo el Reel `2026-11-02-cinco-algoritmos-ml` (159 s) con la orden "no me pidas aprobaciones". Del pedido a la entrega pasaron **87 minutos**, sin esperas de Jeremy.

| En qué | Tiempo | Detalle |
|---|---|---|
| Esperando comandos | ~43 min | 7 renders, 6 typechecks, 2 rondas del crítico, la voz y un entorno de Python |
| Opus generando | ~44 min | 257 k tokens de salida: unos 180 k de pensamiento y unos 77 k de código y texto |

**Los renders** se llevan unos 30 minutos: 4 borradores y 3 finales, de 4 a 5 minutos cada uno, siempre del video completo.
- El borrador (540×960) no fue más rápido que el final: tardó 283 s, contra unos 235 s del final.
- No existe un render por escena: un arreglo de 2 s vuelve a dibujar los 159 s.
- Para mirar cuadros, el agente arma en cada sesión su propio script, que los saca del MP4 con ffmpeg.

**`video.tsx` se escribe desde cero en cada pieza**, y cada vez es más largo:

| Pieza | Líneas |
|---|---|
| `que-es-ray-tracing` (19-oct) | 392 |
| `mcp-vs-acp` (27-oct) | 974 |
| `cors` (30-oct) | 1.465 |
| `mcp-no-reemplaza-apis` (1-nov) | 1.499 |
| `cinco-algoritmos-ml` (2-nov) | 1.836 (83 KB) |

- Opus lo escribió de una vez: 50 k tokens y 6,5 minutos de generación continua, más 20 k tokens de pensamiento antes de empezar.
- Cada arreglo fue un script de parches de 17 k a 23 k tokens, también escrito por Opus.
- 11 piezas vuelven a definir los mismos helpers (`clamp`, `lerp`, `fade`, `useT`). El rig de cámara, `Appear` y las tarjetas también se reinventan en cada pieza.
- Antes de escribir, el agente lee el kit a pedazos con `sed` y copia la pieza anterior, porque no hay una referencia corta del kit.

**El pensamiento.** Las transcripciones guardan el pensamiento cifrado: se puede medir cuánto se pensó y antes de qué, pero no qué se pensó.
- Antes de pasos triviales: 9.300 tokens antes de un `node -e` que leía la fórmula de un gancho; 5.000 antes de un `Read` y un `Grep`; de 13.000 a 15.000 antes de cada script de parches.
- La sesión corre en esfuerzo extra alto, que piensa a fondo en cada turno, también en los mecánicos.
- Estimado: entre un cuarto y un tercio del pensamiento se gasta en pasos que no lo necesitan, unos 10 minutos por Reel.

**La delegación:**
- Antigravity (`agy`): **0 llamadas** en las sesiones de video desde el 29 de octubre.
- Las fuentes, el análisis del referente y el crítico van a subagentes Sonnet 5.5, y la crítica del guion a Gemini.
- El ciclo de parche, render y revisión de cuadros lo hizo Opus en las 7 vueltas.

**El contexto:**
- La sesión duró 4 días e hizo 3 Reels con `/compact` de por medio. Durante el video, el contexto promedió 354 k tokens por llamada.
- Al empezar, el agente lee unos 30 k tokens de reglas repartidas en varios archivos. Algunas se repiten y otras se contradicen: por ejemplo, `workflows/video.md` dice en un lugar que la voz es ElevenLabs F y en otro que es Puck, de Gemini.

**Otros:**
- `tsconfig.json` incluye `content/**/*.tsx`: cada `tsc` revisa las 31 piezas (752 KB) y tarda unos 50 s. Corrió 6 veces para revisar un solo archivo.
- La clave de la caché de voz (`packages/media/src/cache.ts`, línea 26) incluye `previousText` y `nextText`: editar una escena vuelve a pagar la voz de las vecinas.
- Hubo dos rondas del crítico, y los avisos menores también provocaron vueltas de arreglos.

## Lo que se probó de Antigravity (3 de noviembre de 2026)

Con `agy` 1.4.8, sin interfaz (`agy -p ... --mode plan`) y con Gemini 3.8 Flash (high):

| Prueba | Resultado | Tiempo |
|---|---|---|
| Buscar en la web | **Sí busca.** Respondió con URLs, pero con un dato viejo: dijo que la última versión de Remotion era la 4.0.539, y npm dice 4.0.540, del 2 de noviembre | 70 s |
| Ver una imagen (`video-hoja.png`) | **Sí ve.** Describió bien los textos, los colores, el gráfico y los subtítulos de los 3 primeros cuadros | 40 s |
| Ver y oír un MP4 | **No.** Lo dijo sin inventar. Para el audio sigue haciendo falta la API de Gemini | 91 s |

Lo que hay que corregir en su configuración (`~/.gemini/antigravity-cli/settings.json`):
- **El modelo por defecto** es "Gemini 3.1 Pro (Low)", que ya no está en la lista. Los modelos de la lista son Gemini 3.8 Flash (low, medium y high), Claude Sonnet 4.6, Claude Opus 4.6 y GPT-OSS 120B.
- **Los permisos** no dejan correr ningún `npm run video:*`, así que no puede comprobar lo que edita.
- **`trustedWorkspaces` incluye `C:\` entero,** y `allowNonWorkspaceAccess` está activado. Para un agente que corre comandos solo, es demasiado.
- Hay opciones nuevas que no se usan: `--effort`, `--sandbox`, `--json-schema` (salida con forma fija) y `--output-format json`.

## La meta

| | Hoy | Meta |
|---|---|---|
| Reel de 150 a 170 s, sin aprobaciones intermedias | 87 min | 40 min o menos |
| Renders completos por Reel | 7 | 2 (un borrador y el final) |
| Líneas de `video.tsx` escritas a mano | 1.836 | 600 o menos |
| Pensamiento de Opus | ~180 k tokens | la mitad |
| Pasos mecánicos hechos por Opus | casi todos | ninguno |
| Documentación que lee el agente al empezar | ~30 k tokens, con contradicciones | ~8 k, sin contradicciones |

## Los seis puntos del análisis

Cada punto del análisis del 3 de noviembre tiene su lugar en el plan:

| Punto del análisis | Dónde está |
|---|---|
| 1. Cada Reel se programa desde cero | Fase 4, la biblioteca |
| 2. Render por escena, tope de renders y una ronda del crítico | Fase 3 |
| 3. Menos esfuerzo fuera de lo creativo y lo mecánico a otro modelo | Fase 5 y Fase 1 |
| 4. Un chat por Reel y typecheck solo de la pieza | Fase 5 (chat) y Fase 3 (typecheck) |
| 5. Limpiar la documentación y sus contradicciones | Fase 2 |
| 6. La caché de voz | Fase 3 |

## Fase 1. Antigravity, corregido y en el flujo

Va primero porque las fases siguientes lo usan: la auditoría de la documentación, los arreglos mecánicos y la extracción a la biblioteca.

**1.1 La configuración.**
- El modelo por defecto pasa a ser `gemini-3.8-flash-high`.
- `trustedWorkspaces` deja solo las carpetas de proyecto, sin `C:\`, y se apaga `allowNonWorkspaceAccess`.
- Los permisos suman los comandos que necesita para comprobar su trabajo: `npm run video:frames`, `npm run video:render -- <pieza> --escena`, `npm run video:check`, `npm run video:script` y `npm test`.
- Se mantiene la prohibición de publicar, de hacer commit y de hacer push.
- Antes de cambiar nada, se respalda el archivo.

**1.2 Un comando para delegar:** `npm run agy -- <especificación.md> [--pieza content/<pieza>]`.
- Corre `agy -p` con el modelo, el esfuerzo, `--mode accept-edits`, un límite de tiempo y `--output-format json`.
- Exige un árbol de git limpio en los archivos que puede tocar.
- Guarda la respuesta y el registro en `.cache/agy/<fecha>-<tarea>.json`.
- Imprime un resumen corto: los archivos que cambió, el resultado de sus comprobaciones y si terminó.

  Claude Code lo corre en segundo plano y sigue trabajando mientras tanto.

**1.3 La regla de confianza.** Lo que `agy` dice que pasó se comprueba:
- Claude mira `git diff` y vuelve a correr el comando de comprobación;
- lo que trae de la web se trata como un borrador: la cifra que va en pantalla se abre en su fuente.

**1.4 Qué hace `agy` y qué no:**

| Tarea | `agy` (Gemini 3.8 Flash) | Por qué |
|---|---|---|
| Arreglos mecánicos del inspector (margen, letra chica, solapes) | Sí | Es una especificación cerrada, y lo comprueba con `video:frames` |
| Revisar cuadros después de un arreglo, con una lista de qué mirar | Sí | Ve imágenes; Opus mira solo la hoja final |
| Emparejar el guion con la biblioteca (Fase 4) | Sí, con `--json-schema` | Es comparar fichas, no crear |
| Extraer una pieza nueva a la biblioteca (Fase 4) | Sí | Es una refactorización con especificación y pruebas |
| Auditar la documentación (Fase 2) | Sí | Lee los ~400 KB de una vez |
| Transcribir las capturas de Insights a métricas | Sí | Es una transcripción de imágenes |
| Buscar fuentes | A prueba, contra el subagente Sonnet en una misma pieza | Busca, pero se equivocó en un dato |
| Guion, ganchos, mundo, dirección de arte y composición | No | Es lo creativo |
| Criticar el video con audio | No | No ve ni oye un MP4 |
| Puertas, publicar y commits | No | Son de Jeremy |

**Hecho cuando:** `npm run agy` corre una especificación de prueba, `agy` corre un `video:frames` permitido, y un comando prohibido se rechaza.

## Fase 2. Limpieza de la documentación

Hoy hay unos 400 KB de documentación: 29 documentos en `docs/`, 4 guías en `workflows/`, 3 skills propias y 24 memorias. Nada está validado, así que la limpieza no parte de lo que ya existe: parte de definir lo mínimo que tiene que saber un agente y de reescribirlo corto.

**2.1 El núcleo.** Lo único que se lee al empezar:

| Archivo | Qué lleva | Tamaño |
|---|---|---|
| `AGENTS.md` | Qué es el repo, las reglas que no se negocian, los comandos y a qué página ir | ~3 k tokens |
| `docs/reel.md` | El Reel en una página: los pasos, quién hace cada uno, los comandos, los topes y las decisiones vigentes de Jeremy | ~4 k tokens |
| `docs/carrusel.md` | Lo mismo para el carrusel | ~4 k tokens |

Lo demás es referencia: se abre solo para un detalle. Es la voz, la rúbrica del crítico, la referencia del kit (Fase 4) y la de la biblioteca.

**2.2 La auditoría, con `agy`.** Lee todo `docs/`, `workflows/`, `skills/` propias, `AGENTS.md` y la memoria, y devuelve en JSON:
- las reglas que se contradicen, con archivo y línea de cada lado;
- las reglas repetidas en más de un archivo;
- las decisiones de Jeremy con fecha, para saber cuál es la última;
- lo que describe código que ya no existe.

**2.3 Jeremy decide.** Las contradicciones se le muestran como preguntas cortas, en una sola tanda ("¿la voz es ElevenLabs F o Puck?"). Sus respuestas son lo único que entra al núcleo como "decisión vigente".

**2.4 Reescribir y archivar.**
- Se escriben `AGENTS.md`, `docs/reel.md` y `docs/carrusel.md` desde cero, con las respuestas de 2.3.
- Todo lo demás de `docs/` y `workflows/` pasa a `docs/historia/`, que ningún agente lee salvo que Jeremy lo pida: los planes, los traspasos, los análisis, las propuestas y las tendencias. Lo que todavía sirve de referencia (la voz, la rúbrica, los referentes y el anti-slop) se revisa y se queda, corto, en `docs/referencia/`.
- `skills/video-es/SKILL.md` (30 KB) se reduce a lo que cambia respecto de las skills oficiales de Remotion; lo demás va a `docs/reel.md` o a la referencia del kit.

**2.5 La memoria.** De las 24 memorias se quedan solo las preferencias de Jeremy que no estén en el núcleo. Las que repiten un documento se borran, y las de planes viejos se borran o apuntan a `docs/historia/`.

**2.6 Un control:** `npm run docs:check` avisa de los enlaces rotos, de los archivos del núcleo que pasan su tamaño y de los documentos fuera de `historia/` que nadie enlaza. Corre en `npm test`.

**Hecho cuando:** un agente nuevo arranca un Reel leyendo unos 8 k tokens, la auditoría de `agy` corrida otra vez no encuentra contradicciones, y Jeremy aprobó el núcleo.

## Fase 3. Iterar sin renderizar todo

**3.1 Cuadros sueltos:** `npm run video:frames -- content/<pieza> <segundos...>`. Renderiza solo esos cuadros con `remotion still`, a escala 0,5, y los junta en una hoja. Sirve para ver un arreglo en 20 a 30 s, en vez de 4 a 5 minutos, y reemplaza los scripts que el agente arma en cada sesión.

**3.2 Render e inspector por escena:** `npm run video:render -- content/<pieza> --escena <id>[,<id>]`.
- Renderiza solo el tramo de esas escenas (`--frames` de Remotion, a partir de `timeline.json`) y corre el inspector sobre ese tramo.
- No toca `out/video.mp4` ni la puerta B.
- El volumen y los congelados de todo el video quedan para el render completo.

**3.3 Medir el render y decidir el borrador.** Se mide dónde se va el tiempo: empaquetar, dibujar, el probe del inspector, codificar, normalizar el volumen y armar la hoja. `--log=verbose` de Remotion lista los cuadros más lentos. Con eso se prueba:
- **empaquetar una sola vez.** Hoy cada comando llama a `remotion render` y vuelve a empaquetar. Remotion recomienda empaquetar una vez y reutilizar el bundle y el navegador; también existe `--bundle-cache`;
- **los efectos caros:** según Remotion, `box-shadow`, `text-shadow`, los gradientes, `filter: blur` y `drop-shadow`, canvas y WebGL. Si `--log=verbose` los señala, se cambian por imágenes ya calculadas;
- **un borrador a 15 cuadros por segundo,** cambiando los fps de la composición. `--every-nth-frame` no sirve, porque solo funciona para GIF;
- **que el probe mande el DOM cada segundo** en vez de cada medio segundo;
- si nada ayuda, `--borrador` se quita y quedan 3.1 y 3.2.

**3.4 Typecheck solo de la pieza:** `npm run video:check -- content/<pieza>` revisa esa pieza y el kit, sin las otras 30. Va al principio de `video:render` y `video:frames`. `npm run typecheck` completo queda para los commits del motor.

**3.5 Los topes:**
- **dos renders completos por Reel:** uno para el crítico y el final. Los arreglos se comprueban con 3.1 y 3.2;
- **una ronda del crítico.** La segunda va solo si un punto saca menos de 3 o hay un error grave, y la decide el comando, no el agente;
- **los avisos del inspector no frenan los borradores:** se arreglan antes del render final.

**3.6 La caché de voz.** `cachedSpeech` deja fuera de la clave a `previousText` y `nextText`, o los reduce a la última oración de la escena anterior y la primera de la siguiente. Las entradas que ya están en caché se migran o se toleran, para no volver a pagar nada. Lleva una prueba: editar la escena 3 no regenera la voz de las escenas 2 ni 4.

**Hecho cuando:** un arreglo de una escena se comprueba en menos de 1 minuto, y el Reel siguiente lleva 2 renders completos.

## Fase 4. La biblioteca: primero lo creativo, después lo que se reutiliza

**El problema.** Ya se probó tener una biblioteca de bloques, y el agente se anclaba a ella: escribía el guion y las escenas en función de lo que había. Por eso no se implementó. Hoy pasa algo parecido en chico: antes de escribir, el agente copia el `video.tsx` de la pieza anterior.

**La propuesta de Jeremy:**
1. El guion y lo creativo se piensan desde cero, como siempre.
2. Después se analiza qué escenas o partes se pueden tomar de la biblioteca.
3. Lo que es nuevo se construye y, si conviene, se guarda para el futuro.

Así no se limita lo creativo, y lo que se construye se aprovecha después.

### Lo que dice la investigación

La hizo un subagente el 3 de noviembre de 2026; las fuentes están al final de esta fase. Lo que tiene evidencia sólida está marcado; lo demás es un preprint o una opinión.

- **El anclaje es real** (sólido). Ver un ejemplo antes de idear hace repetir sus rasgos y baja la variedad, también en expertos, que lo notan solo en parte. En agentes con memoria (preprint), si la tarea se parece a un caso guardado, el agente produce algo muy parecido y arrastra sus errores. Esto respalda que el guion se piense sin ver la biblioteca.
- **Mostrar ejemplos no siempre es malo** (sólido). Los ejemplos a pedido, cuando uno se traba, ayudaron. Mostrados por sistema, rindieron peor que ninguno. Por eso la biblioteca va después del guion, y no se esconde para siempre.
- **Planificar lo visual primero** (preprint, Code2Video). En un sistema de agentes que hace videos explicativos con código, el plan visual escrito antes del código es lo que más pesa: sin el planificador, la estética cae de 79 a 38 puntos; sin la base de recursos, a 68. Su crítico mira los cuadros renderizados en una grilla, y la crítica solo de texto casi no daba arreglos útiles.
- **Los estudios de motion design reutilizan la gramática, no las escenas** (sólido, IBM Carbon). Lo que se fija son las curvas de easing y las duraciones; lo expresivo se reserva para "momentos importantes y ocasionales". Las plantillas de After Effects (MOGRT) solo dejan editar lo que exponen.
- **Remotion recomienda** (sólido) un componente por escena y renderizar cuadros sueltos para revisar. No tiene una guía de bibliotecas de escenas.
- **Las bibliotecas de agentes que crecen solas empeoran** (preprints: Voyager, CRAFT y estudios de 2025 y 2026). Funcionan cuando se guarda solo lo verificado, se deduplica, hay un tope y se retira lo que no aporta. Las habilidades curadas sumaron 16 puntos; las que el agente guardaba solo, restaron 1. La búsqueda plana se degrada cuando la biblioteca crece.

**Lo que cambia de la propuesta:** nada en lo esencial; la investigación la respalda. Le suma cuatro cosas:
- la gramática se separa de las escenas;
- el guion visual se congela antes de mirar la biblioteca;
- una escena entra a la biblioteca cuando una segunda pieza la necesita, no apenas se crea;
- el anclaje se mide.

### Tres capas

| Capa | Qué es | Cuándo se ve | Ejemplos |
|---|---|---|---|
| **Gramática** | Tokens de movimiento y primitivas sin contenido | Siempre: no ancla, porque no dice qué mostrar | Curvas de easing y duraciones con nombre, `clamp`, `fade`, `Appear`, `At`, el rig de cámara, los efectos por palabra y el contador con miles en español |
| **Biblioteca de escenas** | Escenas con parámetros, sacadas de piezas aprobadas | Solo después de congelar el guion visual | Un ranking que se reordena, una lista que se marca con la voz, barras de comparación, una línea de tiempo |
| **Protagonistas** | El gancho, el clímax y el mundo de cada pieza | Nunca vienen de la biblioteca: siempre son nuevos (decisión pendiente 6) | El arcade de `tokenmaxxing`, el gráfico de Iris |

La gramática se arma ya, con lo que hoy se repite en 11 piezas. La biblioteca de escenas empieza vacía y crece con el flujo.

### El flujo de cada Reel

**1. Lo creativo, sin la biblioteca** (Opus, extra alto).
- El guion y el **guion visual** se escriben desde cero. Por cada escena, el guion visual lleva la intención (qué tiene que entender el público), la metáfora, el movimiento y la duración.
- Por cada escena, el agente piensa 2 o 3 metáforas y elige una. Según la investigación, eso baja la fijación.
- En esta fase el agente no lee la biblioteca, ni los `video.tsx` de otras piezas, ni sus capturas. Sí conoce la gramática.
- Al terminar, el guion visual se **congela**: `video.json` guarda su hash.

**2. Emparejar** (`agy`, con `--json-schema`).
- Recibe el guion visual congelado y las fichas de la biblioteca, solo en texto y sin capturas.
- Por cada escena devuelve un veredicto: **nueva**, **reutilizar tal cual**, **reutilizar con parámetros** o **adaptar** (copiarla a la pieza y cambiarla). Trae de 1 a 3 candidatas como máximo, con la razón.
- La regla: si no cumple la intención de la escena, es nueva. **El guion visual no cambia por lo que haya en la biblioteca;** el hash lo comprueba.
- Opus revisa la tabla en una sola llamada.

**3. Construir.**
- Cada escena va en su propio archivo, `content/<pieza>/scenes/<id>.tsx`, y `video.tsx` solo compone: la cámara, el orden, la música y los efectos.
- Las escenas nuevas y las protagonistas las escribe Opus.
- Las reutilizadas las conecta `agy`, con sus parámetros. Las adaptadas también, con una especificación.

**4. Comprobar por escena** (Fase 3). Primero `video:frames` y `--escena` de cada escena, con la revisión de cuadros de `agy`; después, los dos renders completos.

**5. Cosechar**, después de la puerta B.
- `agy` revisa las escenas nuevas de la pieza y propone cuáles pueden servir otra vez.
- Las que valen pasan a `packages/video/library/candidatas/`, con su ficha y 3 capturas.
- Una candidata pasa a la biblioteca cuando una segunda pieza la necesita, o cuando Jeremy la marca. Ahí se generaliza con parámetros, con una prueba y una captura de la demo.
- Lo que se repite en 2 piezas o más y no tiene contenido pasa a la gramática de inmediato.

**Qué no entra:** las protagonistas, lo que está atado a un tema, y lo que se parece mucho a una escena que ya existe. Eso último se funde con la existente.

### La ficha

Cada escena de la biblioteca vive en `packages/video/library/<id>/`, con su código, su demo, 3 capturas y una ficha:

```yaml
id: ranking-reordena
capa: escena            # gramatica | escena
intencion: "Mostrar que el orden cambia cuando cambia el criterio"
usar_cuando: "Hay 3 a 7 elementos comparables y un cambio de criterio"
no_usar_cuando: "Hay un solo protagonista, o el orden no importa"
parametros: [filas, valores, criterio, cues]
duracion: "4 a 12 s"
etiquetas: { metafora: tabla, layout: lista, movimiento: reordenar }
usos: { piezas: [2026-11-02-tokenmaxxing], ultima: 2026-11-03 }
critico: 4.0            # puntaje de la escena en la pieza de origen
costo: { lineas: 120, ms_por_cuadro: 35 }
estado: biblioteca      # candidata | biblioteca | retirada
razon_retiro: null
```

El emparejamiento busca por `intencion`, `usar_cuando` y `no_usar_cuando`, no por nombres ni por capturas. Las capturas son para Jeremy y para revisar, nunca para la fase creativa.

### Mantenimiento

- **Se retira, no se borra.** Pasa a `retirada` una escena sin uso en 10 piezas, o una que bajó el puntaje del crítico cuando se usó.
- **Tope:** unas 30 a 40 escenas activas. Es una propuesta, se ajusta con el uso.
- **Antes de admitir una escena** se compara su intención con las existentes. Si se parece mucho a otra, se funden, y solo si la fusión no baja el puntaje.
- **Una referencia corta de la gramática y la biblioteca,** `packages/video/library/README.md`, que se genera sola a partir de las fichas y de los comentarios del código. El agente la lee en vez de recorrer el kit con `sed`.

### Medir el anclaje

En cada Reel se anota en `estado.md`:
- **cuántas veces cambió el guion visual después de emparejar.** Tiene que ser 0;
- **qué parte del tiempo en pantalla sale de la biblioteca.** Techo propuesto: 50 %;
- **la variedad:** si se parece a las últimas 3 piezas, según el crítico y según Jeremy.

Si la reutilización sube y la variedad baja, hay anclaje, y se ajusta el flujo.

**Hecho cuando:**
- la gramática está en el kit, con pruebas, y las piezas nuevas no redefinen helpers;
- el Reel siguiente se hace con este flujo, con un `video.tsx` de 600 líneas o menos y una escena por archivo;
- su guion visual no cambió después de emparejar;
- Jeremy lo ve igual o mejor que el anterior.

### Fuentes de la Fase 4

Las juntó el subagente de investigación; no se revisaron una por una. Los preprints no están revisados por pares.
- Metaanálisis de fijación de diseño (43 estudios): https://doi.org/10.1016/j.destud.2015.04.004
- Fijación en expertos: https://www.lrdc.pitt.edu/Schunn/papers/JMD041003.pdf
- Cuándo mostrar ejemplos: https://hci.stanford.edu/publications/paper.php?id=206 y https://www.eecs.harvard.edu/~kgajos/papers/2015/siangliulue15providing.shtml
- Anclaje en LLMs (preprint): https://arxiv.org/abs/2602.20408
- Agentes que copian casos guardados (preprint): https://arxiv.org/abs/2505.16067
- Code2Video (preprint): https://arxiv.org/abs/2510.01174
- Movimiento en IBM Carbon: https://carbondesignsystem.com/elements/motion/overview/
- Plantillas MOGRT: https://helpx.adobe.com/after-effects/using/creating-motion-graphics-templates.html
- Skills oficiales de Remotion: https://www.remotion.dev/docs/ai/skills
- Voyager (preprint): https://arxiv.org/html/2305.16291v2. CRAFT (preprint): https://arxiv.org/abs/2309.17428
- Habilidades curadas contra las que guarda el agente (preprint): https://arxiv.org/html/2602.12670v1
- Mantenimiento de bibliotecas (preprints): https://arxiv.org/abs/2605.22148 y https://arxiv.org/abs/2607.10113

## Fase 5. Quién piensa y cuánto

**5.1 Modelo y esfuerzo por paso:**

| Paso | Quién |
|---|---|
| Ángulo, tesis, ganchos, guion, guion visual, mundo y dirección de arte | Opus, extra alto |
| Composición de `video.tsx` (lo nuevo y el armado) | Opus, alto |
| Emparejar con la biblioteca, extraer piezas nuevas, arreglos mecánicos y revisión de cuadros | `agy` (Gemini 3.8 Flash high), con Sonnet 5.5 de respaldo si `agy` falla |
| Fuentes y análisis del referente | Subagentes Sonnet 5.5; las fuentes, a prueba contra `agy` (Fase 1) |
| Crítica del video con audio | La que gane una prueba lado a lado, porque `agy` no oye |

El esfuerzo de la conversación principal lo elige Jeremy al abrirla; el agente no lo puede cambiar a mitad de un chat. Por eso, el esfuerzo va unido a 5.2.

**5.2 Un chat nuevo por Reel.**
- Nunca a continuación de otro Reel, ni después de un `/compact`.
- En un Reel con aprobaciones, son dos chats: la fase creativa en extra alto, que termina en `estado.md`, y la producción en alto. `npm run video:fase -- content/<pieza>` imprime el mensaje exacto para abrir el chat siguiente.
- En modo directo ("no me pidas aprobaciones"), un solo chat nuevo, en alto, salvo que Jeremy elija otro esfuerzo.

**5.3 Opus no hace pasos mecánicos.** Si un paso cabe en una especificación cerrada (un margen, un tamaño, renombrar, extraer), Opus escribe la especificación y la manda a `npm run agy` en segundo plano. No escribe scripts de parches.

## Medición

**El script:** `scripts/medir-sesion.py <transcripción>` se hace en la Fase 1, para medir cada fase. Da:
- el tiempo de Opus, el de los comandos y el de espera;
- los tokens de salida y de pensamiento, y el contexto promedio;
- los renders, los typechecks, las rondas del crítico y las llamadas a `agy`.

**Después de cada fase,** el Reel siguiente se mide contra la línea base y se anota en "Resultados".

## Orden y tamaño

| Orden | Fase | Tamaño | Ahorro estimado |
|---|---|---|---|
| 1 | Antigravity corregido y el script de medición | Chico | Lo usan las demás fases |
| 2 | Limpieza de la documentación | Mediano | ~2 a 5 min, menos contradicciones y menos pensamiento |
| 3 | Iterar sin renderizar todo, typecheck por pieza y caché de voz | Mediano | ~20 min y créditos |
| 4 | La biblioteca | Grande | ~10 a 15 min, y más con cada Reel |
| 5 | Quién piensa y cuánto | Chico | ~10 min |

La limpieza va antes que las demás para que lo nuevo se escriba en el núcleo limpio y no en guías que después se archivan. Cada fase es una sesión propia del motor, en su rama, y termina con `npm test`, `npm run typecheck` y un commit cuando Jeremy lo pide. Ninguna fase se hace en medio de una pieza.

## Decisiones

**Ya tomadas por Jeremy (3 de noviembre de 2026):**
1. La biblioteca no limita lo creativo: primero el guion y las escenas desde cero; después se ve qué se reutiliza; lo nuevo se construye y, si conviene, se guarda (Fase 4).
2. La limpieza de la documentación entra al plan, completa (Fase 2).
3. Antigravity se corrige y se aprovecha (Fase 1 y Fase 5).

**Pendientes:**
1. **El esfuerzo:** ¿extra alto solo en lo creativo y alto en la producción?
2. **Los topes:** ¿dos renders completos y una ronda del crítico por Reel?
3. **Los avisos del inspector:** ¿se arreglan solo antes del render final?
4. **Modo directo:** cuando dices "no me pidas aprobaciones", ¿el agente salta el storyboard y la hoja de la puerta A, y anota las dos puertas con tu frase?
5. **El carrusel en la limpieza:** ¿su documentación también se reescribe ahora, o solo se archiva lo viejo y se reescribe cuando vuelvas a hacer carruseles?
6. **Las protagonistas:** ¿el gancho, el clímax y el mundo de cada pieza son siempre nuevos, o también pueden salir de la biblioteca si encajan?
7. **El techo de reutilización:** ¿50 % del tiempo en pantalla como máximo, u otro número?

## Aparte: seguridad

En la sesión del 3 de noviembre se pegaron en el chat dos claves de API de ElevenLabs. Quedaron en texto plano en las transcripciones de `~/.claude/projects/`. Conviene revocarlas en ElevenLabs y guardar las nuevas solo en `.env`.

## Resultados

Se completa después de cada fase.

| Fecha | Fase | Pieza | Minutos | Renders completos | Líneas de `video.tsx` a mano | Llamadas a `agy` |
|---|---|---|---|---|---|---|
| 2026-11-03 | Línea base | `cinco-algoritmos-ml` | 87 | 7 | 1.836 | 0 |

### Ejecución del 3 de noviembre de 2026

Jeremy pidió ejecutar el plan de corrido, en la rama `perf/plan-velocidad-reels`, con un commit por fase. Las cinco fases quedaron hechas. Falta lo que solo se puede medir con el Reel siguiente.

**Las 7 decisiones pendientes se tomaron con el valor que proponía el plan,** para no frenar la ejecución. Cualquiera se cambia con una línea en `docs/reel.md`:
1. Extra alto solo en lo creativo; alto en la producción.
2. Dos renders completos por Reel (`video:render` avisa desde el tercero, no lo impide) y una ronda del crítico (la segunda la decide `video:critique`).
3. Los avisos del inspector se arreglan antes del render final.
4. Modo directo: sin storyboard ni hoja de la puerta A, y las puertas se anotan con la frase de Jeremy. El crítico del guion sigue.
5. El carrusel se reescribió ahora, corto (`docs/carrusel.md`, borrador de `agy` revisado).
6. Las protagonistas son siempre nuevas.
7. Techo de reutilización del 50 % (aviso).

**Lo medido el 3 de noviembre de 2026,** con `cinco-algoritmos-ml` y la máquina compartida con otras apps:

| Qué | Antes | Ahora |
|---|---|---|
| Empaquetar antes de cada render | 38,5 s, con las 31 piezas | Solo la pieza; 0 s cuando se reutiliza |
| Comprobar el arreglo de una escena | Un render completo, de 4 a 5 min | `--escena`: 23 s para una escena de 13,7 s, con inspector |
| Mirar cuadros sueltos | Un script propio sobre el MP4 | `video:frames`: 4 cuadros en 22 s; 3 en 5 s con el bundle reutilizado |
| Borrador completo | 283 s | 257 s: no compensa, sale del flujo |
| Typecheck | Todo el repo, de 13 a 50 s | Solo la pieza, de 2 a 4 s |
| Editar una escena | Pagaba la voz de las vecinas | Paga solo esa; las 27 voces de 3 Reels siguen en caché |
| Segunda ronda del crítico | La decidía el agente (hubo 2) | Con el informe de la línea base, el comando la habría negado |
| Lo que lee el agente al empezar un Reel | ~30 k tokens, con contradicciones | ~7 k (`AGENTS.md` y `docs/reel.md`), sin contradicciones |
| `agy` | 0 llamadas | Auditoría de docs (15 min, 11 contradicciones), borrador del carrusel (7 min) y emparejar (2 min) |

**Falta, con el Reel siguiente:**
- medirlo con `scripts/medir-sesion.py` y llenar la fila de esta tabla;
- que su `video.tsx` quede en 600 líneas o menos, con una escena por archivo, y que su guion visual no cambie después de emparejar;
- la primera cosecha de la biblioteca;
- que Jeremy lo compare con el anterior y apruebe el núcleo (`AGENTS.md`, `docs/reel.md` y `docs/carrusel.md`).
