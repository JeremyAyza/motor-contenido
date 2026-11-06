# El Reel

Un MP4 de 1080×1920 hecho con Remotion, a partir de dos archivos que escribe el agente: `content/<pieza>/video.json` (el guion y las puertas) y `video.tsx` (lo que se ve). Esta página es lo único que se lee para hacer un Reel, además de [AGENTS.md](../AGENTS.md) y del `estado.md` de la pieza. Lo demás es referencia y se abre solo para un detalle: el [kit](referencia/kit-video.md), la [voz](referencia/voz.md), la [rúbrica](referencia/critica-video.md), el [crítico](referencia/critico-ciego-video.md), los [referentes](referencia/referentes.md) y [Antigravity](referencia/agy.md).

## Decisiones vigentes de Jeremy

No cambian sin su sí en el chat. Una elección para una pieza no se vuelve regla de la cuenta.

- **Estilo** (24 de octubre de 2026): motion graphics plano dibujado en código, con un mundo y una cámara que se mueve por él. El objeto del momento llena el cuadro, un acento para lo que importa, movimiento con peso (resortes, sellos, cosas que viajan, no solo fundidos) y el dato clave enorme. **3D o isométrico, solo si Jeremy lo pide.**
- **Dirección de arte por pieza** (20 de octubre de 2026): la de la baraja del carrusel, con su paleta y sus tipografías. Fijos: el marco (pestaña, puntos y firma) y los subtítulos. Dos Reels seguidos no se parecen.
- **Duración** (24 de octubre de 2026): `corto`, de 45 a 60 s, por defecto. `largo` (90 a 180 s) para una explicación de varios puntos. `explicado` (75 a 100 s), solo si Jeremy lo pide. **Una réplica dura lo que su referencia** (`target`, ±10 %), con datos o pausas (`hold`), sin estirar la voz.
- **Ritmo:** algo cambia en pantalla cada 1 a 1,5 s; de 5 a 7 escenas de 2 o 3 frases cortas.
- **Réplica parecida** (5 de noviembre de 2026): se copia también el aspecto del referente; de @jacket.dev son el acento, el acabado, el marco, la firma y el avatar ([detalle](referencia/kit-video.md#réplica-parecida)).
- **Voz** (24 de octubre de 2026): ElevenLabs, voz F (`accounts/dev.json → voice`), estabilidad 0,5 y `tempo` 1,12. Una réplica larga puede subir el `tempo` de la pieza hasta 1,4 (27 de octubre). No se prueban otros proveedores sin que Jeremy lo pida.
- **Licencia de la voz** (1 de noviembre de 2026): se usa el plan gratuito, sin licencia comercial. No se propone pagar ni regenerar para aprobar una pieza. El post lleva "Voz con IA: elevenlabs.io".
- **Audio:** música al 0,06, que baja mientras habla la voz; pocos efectos, debajo de la música.
- **Avatar** (1 de noviembre de 2026): solo si es estratégico o se pide. Es el busto normal, sin fondo, abajo a la izquierda (`avatar: {}`), como en `2026-10-27-mcp-vs-acp`. En burbuja, nunca.
- **Lienzo sin zona segura** (20 de octubre de 2026): el diseño usa todo el lienzo dentro del margen de 36 px, sin esquivar los botones de Instagram.

## Cómo se trabaja

- **Un chat nuevo por Reel,** nunca a continuación de otro ni después de un `/compact`. Con aprobaciones son dos chats: **lo creativo en esfuerzo extra alto** (hasta la puerta A) y **la producción en alto**. En modo directo ("no me pidas aprobaciones") es uno solo, en alto, sin storyboard ni hoja de la puerta A, y las dos puertas se anotan con su frase en `notes`; publicar sigue siendo otro pedido. El esfuerzo lo elige Jeremy al abrir el chat: `npm run video:fase -- content/<pieza>` dice en qué fase está la pieza, con qué esfuerzo abrir el siguiente y el mensaje exacto para pegar.
- **El traspaso es `content/<pieza>/estado.md`,** no la conversación: la fase, el paso siguiente, las decisiones de Jeremy con sus palabras, lo que no funcionó y lo pendiente para el motor. Los cambios al motor no se hacen a mitad de una pieza.
- **El agente principal (Opus) hace lo creativo y nada mecánico:** el ángulo, la tesis, los ganchos, el guion, el guion visual, el mundo, la dirección de arte y las escenas nuevas. Si un paso cabe en una especificación cerrada (un margen, un tamaño, renombrar, extraer, conectar una escena de la biblioteca), escribe la especificación y la manda a `npm run agy` en segundo plano. No escribe scripts de parches.

| Paso | Quién |
|---|---|
| Fuentes | Subagente `buscador-fuentes` (Sonnet 5.5): deja `facts.json` y responde una línea por dato |
| Análisis del Reel de referencia | Subagente `analista-referente` (Sonnet 5.5): deja `referente.md` |
| Arreglos mecánicos, revisión de cuadros, emparejar y cosechar | `npm run agy` (Gemini 3.8 Flash; [referencia](referencia/agy.md)); si falla, un subagente Sonnet 5.5 |
| Crítica del guion | Gemini (`video:critique --guion --gemini`) |
| Crítica del video | Subagente `critico-ciego-video` (Sonnet 5.5), con un contexto nuevo |

Las fuentes y el referente corren a la vez, mientras el agente piensa el ángulo. El agente trabaja con sus respuestas: abre `facts.json` solo para la cifra exacta que va en pantalla.

## Los pasos

**1. El guion: `video.json`.** Los campos van en inglés y el contenido en español ([esquema](../schemas/video.schema.json)):
- `hooks`: de 1 a 3 ganchos, con lo que dice la voz (`said`), lo que se ve (`onScreen`, hasta 6 palabras) y su fórmula de `skills/ig-es/ganchos-es.json`. El primero es el elegido, y la escena 1 empieza con él;
- `scenes`: `id`, lo que dice la voz (`say`, escrito para el oído), lo que se ve (`see`, concreto), el recurso visual (`resource`, de [recursos.json](../skills/carrusel-taste/recursos.json)) y el **guion visual**: qué tiene que entender el público (`intent`), la metáfora elegida (`metaphor`) entre 2 o 3 pensadas (`alternatives`) y el movimiento (`motion`);
- `world`: la metáfora física que dura todo el video, en una línea;
- `meter`: lo que está en juego (`label`), su valor en el gancho (`from`) y en el cierre (`to`);
- `cover`: la escena del cuadro más fuerte y el segundo (`at`);
- `format`, `target` si es una réplica, `topic`, `art` y `caption`;
- `gateA` y `gateB`.

El guion sigue a `ig-reel` (`.agents/skills/ig-reel/SKILL.md`) a través de [skills/ig-es](../skills/ig-es/SKILL.md): el gancho en 2 s, una idea por frase y un cierre que vuelve al gancho. **Mientras se escribe, no se mira la biblioteca,** ni los `video.tsx` de otras piezas, ni sus capturas (ver "La biblioteca").

**2. Revisar el guion:** `npm run video:script -- content/<pieza>`. Arma la hoja de la puerta A (`out/gate-a.md`) y avisa si:
- el gancho tarda más de 3 s;
- el texto en pantalla pasa de 6 palabras;
- la duración sale de su formato o de su `target`;
- el tema se parece al de una pieza de los últimos 14 días;
- falta `world`, `meter` o `cover`.

Corre `hookscore_es` y `beats_es` de `ig-reel` y la revisión de textos. Un gancho elegido con menos de 50 se discute con Jeremy, no se esconde. También arma `out/video-critica-ganchos/` para que un contexto nuevo ordene los ganchos.

**3. Storyboard y crítico del guion** (se saltan en modo directo, salvo el crítico):
- `npm run video:storyboard -- content/<pieza>`: los visuales de un primer `video.tsx`, sin voz, al ritmo estimado (`out/storyboard.png` y `.mp4`);
- `npm run video:critique -- content/<pieza> --guion --gemini`: Gemini lee el guion y el storyboard, y deja `out/video-critica-guion/informe.md` para la puerta A.

**4. Puerta A.** Solo el sí de Jeremy en el chat aprueba; el agente anota `gateA { approved: true, date }`. Sin ella no hay voz. Si después cambia lo que dice la voz, se vuelve a la puerta A. Una réplica lleva `out/comparar.png` ([cómo](referencia/kit-video.md#comparar-con-el-referente)).

**5. Lo que se ve.** Primero `video:congelar` (guarda el hash del guion visual) y `video:emparejar` (ver "La biblioteca"). Después, una escena por archivo en `content/<pieza>/scenes/<id>.tsx`, y `video.tsx` solo compone: exporta `defineVideo` de `@motor/video`: `captions`, `chapters`, `stage` (el mundo y su cámara), `meter` y una entrada por escena con el mismo `id`, `tone`, `chapter`, `sfx`, `camera` y `Visual`. La dirección de arte sale de `post.json → art` si la pieza tiene carrusel, o de `npm run video:baraja -- content/<pieza>`. Lo que dice la voz no va aquí. La gramática de movimiento (`fade`, `keys`, `At`, `Appear`, `rigAt`...) viene de `@motor/video` y no se redefine: `video:check` avisa. El kit está en la [referencia](referencia/kit-video.md) y en el [índice de la biblioteca](../packages/video/library/README.md).

**6. Voz:** `npm run video:prepare -- content/<pieza>`. Genera la voz de cada escena con los tiempos por palabra de ElevenLabs, baja los efectos del catálogo y deja todo en `out/video/`, con `reloj.md`: cada palabra con su segundo, para los `useCue`. La voz va en caché: si el texto no cambia, no se vuelve a pagar.

**7. Iterar por escena.** Mientras se construye y se arregla, nada de renders completos:
- `npm run video:frames -- content/<pieza> <segundos...>` o `--escena <id>`: solo esos cuadros, en `out/cuadros/hoja.png`, en 5 a 25 s. Sin voz todavía, usa los tiempos del storyboard;
- `npm run video:render -- content/<pieza> --escena <id>[,<id>]`: el tramo de esas escenas, con el inspector de texto, en `out/escena-<ids>.mp4` y su hoja. Una escena de 14 s tarda unos 25 s.

Los dos corren primero `video:check` (typecheck de la pieza en 2 a 4 s; avisa si un `useCue` o un efecto cae a menos de 0,7 s del corte) y reutilizan el bundle si nada cambió. `video:studio` abre la vista previa.

**8. Render completo:** `npm run video:render -- content/<pieza>`. Deja:
- `out/video.mp4`: 1080×1920 a 30 fps, H.264 yuv420p en BT.709 y AAC, a −14 LUFS;
- `out/video-hoja.png`: la portada, el final de cada escena y el medio de cada cambio. Es lo primero que se mira;
- `out/video-inspector.txt` y `out/video.sha256`.

Además del texto, mide lo que el render por escena no mide: volumen, congelados, cortes y composición.

**9. Crítico ciego:** `npm run video:critique -- content/<pieza>` arma `out/video-critica/`: el video, un cuadro cada 2 s en tiras, la hoja, la portada recortada, lo que se oye con sus tiempos y el texto del post. Se le da al subagente `critico-ciego-video`, que escribe `informe.md` con la rúbrica y termina con la línea "Error grave".
- Los tres problemas principales se arreglan y se comprueban por escena (paso 7); después va el segundo y último render completo.
- El informe final se copia en `content/<pieza>/video-critica.md`.

**10. Puerta B.** Jeremy ve el video, la hoja y el informe. Después de su sí, el agente anota `gateB { approved: true, date, video: "<sha256>" }`. Si un render posterior da otro archivo, `video:render` la vuelve a `false`.

**11. Publicar,** solo si Jeremy lo pide: `npm run video:publicar -- content/<pieza> [--ensayo]`. Exige la puerta B con el mismo sha256, sube la portada de `cover` y activa la etiqueta de IA de Meta.

**Después de la puerta B:** `npm run video:cosechar -- content/<pieza>` propone escenas nuevas para la biblioteca. A las 48 horas y a los 7 días, Jeremy pasa la captura de Insights; se transcribe en `content/<pieza>/video-metrics.json` y `npm run video:metrics` regenera [el informe](metricas-video.md) ([cómo](referencia/metricas.md)).

## La biblioteca: primero lo creativo

Decidido con Jeremy el 3 de noviembre de 2026: la biblioteca no limita lo creativo. Tiene tres capas:
- **la gramática** (`@motor/video`), cómo se mueven las cosas: se usa siempre;
- **las escenas,** sacadas de piezas aprobadas: se miran solo después de congelar el guion visual;
- **las protagonistas** (el gancho, el clímax y el mundo): siempre son nuevas.

`video:emparejar` le pasa a `agy`, solo en texto, el guion visual congelado y las fichas, y deja `emparejar.json` con un veredicto por escena: `nueva` (ante la duda), `reutilizar`, `parametros` o `adaptar`. Con la biblioteca vacía, todas son nuevas y no se llama a `agy`. **El guion visual no cambia para encajar en la biblioteca.** Las escenas nuevas las escribe el agente principal, y las reutilizadas las conecta `agy` con una especificación. Las candidatas que propone `video:cosechar` pasan a la biblioteca cuando una segunda pieza las necesita o Jeremy las marca; `npm run video:biblioteca` regenera el índice.

**El anclaje se mide** en `estado.md`: cuántas veces cambió el guion visual después de emparejar (tiene que ser 0), qué parte del tiempo en pantalla sale de la biblioteca (`video:render` la imprime; techo, 50 %) y si la pieza se parece a las últimas 3. Una escena sin uso en 10 piezas, o que bajó el puntaje donde se usó, pasa a `retirada`; el tope es de unas 30 a 40 activas.

## Los topes

- **Dos renders completos por Reel:** uno para el crítico y el final. `video:render` los cuenta en `out/renders.json` y niega el tercero; `--forzar`, solo si Jeremy pide un cambio después de ver el video. `--borrador` no está en el flujo: no es más rápido.
- **Una ronda del crítico.** La segunda, con un contexto nuevo, solo si un punto sacó menos de 3 o hubo un error grave, y **la decide el comando**: `video:critique` lee el informe anterior y no arma una ronda que no corresponde. Nunca una tercera. `--forzar`, solo si Jeremy la pide.
- **Los avisos del inspector no frenan la iteración:** se arreglan antes del render final, y en ese render cada aviso es un error salvo que se pueda defender en una frase. Los errores se arreglan siempre.

## El inspector

Lee lo que el render dibujó: el texto de un cuadro cada medio segundo, con su posición, tamaño y opacidad.

**Errores** (bloquean la puerta B):
- texto fuera del margen (36 px de diseño a cada lado, entre la pestaña y los subtítulos, que van de y 812 a 880);
- letra de menos de 22 px de diseño, o de 12 px en una interfaz del kit (`data-ui`);
- el gancho (`onScreen`) no se ve completo en el cuadro 1;
- subtítulos sin todas las palabras del guion.

**Avisos:** más de 6 palabras en pantalla sin contar subtítulos ni interfaces; la escena 1 abre con un título en vez de un objeto que se mueve; el gancho fuera del centro 3:4 de la grilla; vacío de más de 130 px sobre los subtítulos; una portada que ocupa menos del 35 % del recorte; más de 2 s sin cambio; un cambio de escena que casi no cambia la imagen; `meter` sin mostrar; el volumen lejos de −14 LUFS o un pico sobre −1 dBTP; una duración fuera de rango.

## Reglas de forma

- **El lienzo** es de 540×960 px de diseño y se renderiza a 2x. Las cifras de las skills de Remotion se dividen por 2: titulares de 42 px o más y texto de 22 px o más.
- **El primer cuadro** es un objeto que se mueve, con el gancho como rótulo encima. La grilla del perfil lo recorta al centro 3:4 (de y 120 a 840).
- **El mundo cambia de estado, no se reemplaza:** lo que pasó en una escena sigue ahí en la siguiente.
- **Las cosas aparecen una por una,** con la voz: `useCue("palabra")` da el segundo en que se dice, y los efectos van igual (`at: "palabra"`).
- **Cualquier cuadro congelado se puede publicar:** sin dobles exposiciones en los cambios.
- **El cierre se puede capturar** (una tabla, una pila, un ciclo) y lleva un solo CTA.
- **Datos:** cada cifra sale de `facts.json`. Una interfaz de ejemplo se rotula "Ejemplo ilustrativo"; lo que muestra una `Terminal` sale de `video:capture`.
- **Recursos de terceros:** solo los de `assets/catalog.json`, con licencia revisada y `sha256`. Las imágenes y la música generadas (`video:image`, `video:music`) se pagan: solo cuando hacen falta.

## Comandos del Reel

Cada paso dice su comando; `npx tsx packages/video/src/cli.ts` sin argumentos imprime la sintaxis de todos. Los efectos CC0 se buscan con `npm run video:asset -- search "<consulta>"`.
