# Plan: videos

| Fase | Estado |
|---|---|
| 0. Base | Hecha el 20 de octubre de 2026. Remotion 4.0.537 y las 12 skills oficiales están instalados, y `packages/media` tiene el puerto de voz con Gemini, la caché y whisper.cpp. La escena de prueba del ray tracing sale en MP4 (9 s, 1080×1920). Jeremy eligió la voz Puck y el estilo de marco fijo con acento por tema |
| Antes del piloto | Hecho el 20 de octubre de 2026. La letra chica de las primitivas tiene un piso de 22 px en video. Las puertas viven en `video.json`: la A antes de la voz y la B con el sha256 del video. El catálogo exige licencia revisada y hash. Se adelantó de la fase 3 para que ninguna pieza real salte las puertas |
| 1. Proveedores y recursos | Hecha el 20 de octubre de 2026. Están los puertos de imagen (Nano Banana 2.1), música (Lyria, clip de 30 s) y búsqueda de efectos (Openverse y Freesound, solo CC0). También están `video:image` (con recorte por chroma), `video:music` con música de fondo que baja con la voz, `video:asset` y `generated.json`. Los tests con proveedores falsos muestran que cambiar de proveedor no toca el flujo |
| 2. Piloto | Hecha el 20 de octubre de 2026, con las puertas A y B aprobadas ese día. Es el Reel del ray tracing: 7 escenas, 60.3 s, −14 LUFS y cama de Lyria. La puerta B se volvió a aprobar después de tres rondas del crítico ciego (3.95, 3.90 y 4.05), del final sostenido y de los subtítulos por frase; el inspector solo avisa que pasa 0.3 s de los 60. El inspector de video revisa zona segura, letra, gancho en el cuadro 1, palabras en pantalla, partes quietas, composición, subtítulos, volumen y duración. Antes de la puerta B se ajustó la composición a lo que Instagram deja ver; `video:render` deja una vista previa con la interfaz de la app encima. Después Jeremy cambió el estilo por el del carrusel, sin zona segura: el piloto se rehízo con la dirección de su carrusel, pasa el inspector y Jeremy lo volvió a aprobar en la puerta B (sha256 f29a5b2b…c301). El de Scion, con su propia dirección, también tiene la puerta B aprobada (c2e8030a…0e2e). Todavía no se publicó: eso es la fase 5 |
| 3. Flujo editorial | Herramientas hechas el 20 de octubre de 2026. `video:script` corre `ig-reel` por sus wrappers en español (`hookscore_es --video` y `beats_es`, nuevo) y arma la carpeta del crítico ciego de ganchos. `video:critique` arma la del video: tiras de cuadros, la vista con la interfaz, lo que se oye y el brief aparte, con su rúbrica (`docs/critica-video.md`). `video-metrics.json` y `video:metrics` registran los Reels con los nombres de Insights de 2026 (vistas, tiempo promedio, tasa de saltos). Falta que un video nuevo salga de punta a punta, con sus dos puertas, y calibrar al crítico con Reels que Jeremy admira |
| Nivel de referencia | Propuesta del 20 de octubre de 2026, después de analizar @rick.theengineer con `ig-viral`: kit de escenario y HUD, subtítulos con estilo, mundos en la baraja, escenario continuo con cámara, colores con función y una prueba de 90 a 150 s ([análisis y plan](analisis-rick-theengineer.md)). Jeremy aprobó empezar por los pasos 1 y 2, que están hechos (kit, HUD de capítulos y subtítulos en píldora), con `video:storyboard` para la puerta A. El video de prueba es el de content/2026-10-18-agentes-ia-flujo-dev (42,9 s, inspector sin problemas), con las puertas A y B aprobadas por Jeremy el 20 de octubre (sha256 11965a49…710e). No pasó por el crítico ciego y no se publicó. Con 6 Reels más del referente salió la [propuesta para @jacket.dev](propuesta-reels-jacket.md): el formato "un segundo por dentro", de 75 a 100 s, con 6 temas y 6 cambios al motor. Jeremy aprobó el formato y los cambios 1 a 4, que están hechos: las fórmulas 28 y 29, `format`, `video:capture` con salidas reales y el aviso de tema repetido. El primer video del formato es el del git push (content/2026-10-20-git-push-por-dentro): 93,3 s, el inspector sin problemas y las puertas A y B aprobadas por Jeremy el 20 de octubre (sha256 a52c0bf6…5fbd). No pasó por el crítico ciego y no se publicó |
| 4 y 5 | Pendientes |

Lo que se aprendió en la fase 0:
- **Movimiento.** Las animaciones CSS de las primitivas no se pueden adelantar desde JavaScript en el primer cuadro de cada pestaña del render paralelo, porque el navegador todavía no las creó. En video se pausan y su retraso sale del cuadro actual (`--t`), así que el navegador calcula cada cuadro solo con CSS.
- **Color.** Con cuadros JPEG, Remotion entrega yuvj420p (rango completo). `setColorSpace("bt709")` lo deja en yuv420p de rango limitado, que es lo que esperan los celulares.
- **Voz.** Gemini habla rápido en español (unas 220 palabras por minuto). Pedir "ritmo tranquilo, con una pausa breve después de cada frase" en el estilo la baja a unas 190.
- **Remotion y zod.** Remotion avisa que quiere zod 4.5.4 y el repo usa 4.6.7. No usamos esquemas de zod en las composiciones, así que por ahora es solo un aviso.

Lo que se aprendió en la fase 1:
- **Nano Banana 2.1 solo entrega JPEG.** El comando lo convierte a PNG con ffmpeg y, con `--chroma`, quita el verde.
- **Sin despill en el chroma.** Despill le saca el verde también a los amarillos: un foco amarillo salió naranja. Sin despill queda un filo muy fino, que tapa un borde blanco de sticker.
- **Openverse estuvo inestable el 20 de octubre.** Respondía 500 o 504 con el filtro de licencia, o no respondía. El adaptador reintenta sin filtro y filtra CC0 de nuestro lado, y la búsqueda sigue con la biblioteca siguiente si una falla.
- **Lyria.** El clip de 30 s sale en MP3 estéreo a 44.1 kHz.

Lo que se aprendió en la fase 2:
- **El inspector mide adentro del render de Remotion.** Una sonda en la composición le manda las medidas del DOM a un servidor local. Así se mide lo que de verdad se dibuja, sin otro render paralelo que pueda diferir.
- **Escala.** Con `--scale=2`, Remotion agranda la composición con un transform y `getBoundingClientRect` devuelve píxeles reales. La sonda divide por la escala (el cociente con `offsetWidth`).
- **El render tiene que ser asíncrono.** Con `spawnSync`, Node no podía atender al servidor de la sonda mientras Remotion renderizaba.
- **La revisión de textos del carrusel sirve para el guion.** Pidió acortar la primera línea del texto del post (173 caracteres), variar el largo de las frases y nombrar algo concreto (Turner Whitted, 1980).
- **El ritmo de la voz cambia entre generaciones.** Con el mismo estilo, Gemini habló entre 2.4 y 3.5 palabras por segundo según la escena. La estimación de 3.2 dio 51 s y el piloto salió en 62. Ahora cada escena termina 300 ms después de su última palabra, no al final del archivo de audio; con eso quedó en 59.7 s sin tocar el guion.
- **El inspector encontró lo que a ojo se escapa.** Tres etiquetas pasaban el borde derecho, donde Instagram pone sus botones, y había 4.6 s de imagen quieta en el gancho.
- **El punto de los trazos.** Antes de dibujarse, un trazo animado con punta redondeada deja un punto. En video ese punto se ve hasta que empieza el trazo, así que `VIDEO_MOTION_CSS` lo oculta. El carrusel no cambia.
- **Composición (pedido de Jeremy: "abajo queda un gran espacio vacío").**
  - **Lo medido:** el contenido quedaba centrado en y 390 de 960, con el 35 % de abajo vacío, y la portada era solo el título, con un 80 % vacío.
  - **La investigación:** en un Reel, Instagram tapa entre el 25 y el 35 % de abajo (usuario, texto del post y audio). Lo recomendado es componer dentro de la franja visible, centrado en ella, con los subtítulos en el cuadrante central inferior.
  - **Los cambios:** los subtítulos bajaron a y 640, justo encima de lo que tapa la app, y `SceneFrame` centra el dibujo entre el título y los subtítulos. La portada lleva el dibujo desde el cuadro 1. `video:render` deja una vista previa con una simulación de la interfaz encima, para juzgar como en la app, y el inspector avisa si una escena queda alta o si la portada se ve vacía.
- **`freezedetect` no ve los trazos finos.** Promedia la diferencia de todo el cuadro, y una línea que se dibuja no lo mueve. El inspector cuenta ahora los píxeles que cambian cada medio segundo.
- **La música de Lyria es un clip de 30.8 s.** En un video de 60 s se repite una vez, y el corte se nota poco porque va bajo la voz. Para videos largos conviene `lyria-3.5`, que hace canciones completas. Los términos de la API de Gemini dicen que Google no reclama la propiedad de lo generado y no restringen el uso comercial; puede generar algo parecido para otros.

Lo que se aprendió en la fase 3:
- **El ritmo real de la voz es de 2.7 palabras por segundo, no de 3.2.** En el piloto fueron 162 palabras en 59.6 s, con las pausas entre frases y el final de cada escena. Con 3.2, la puerta A estimaba 51 s; con 2.7 estima 60, lo que de verdad duró.
- **`hookscore` le pone 30 (WEAK) al gancho del piloto.** "El ray tracing sigue la luz al revés" no tiene cifra ni nombre propio, y el original no cuenta "ray tracing" como algo concreto. Los otros dos ganchos sacan 52 y 56. El piloto ya estaba aprobado; en el próximo video, el aviso llega antes de la puerta A.
- **`beats` marca frases largas para el oído.** La más larga del piloto dura 8.9 s ("Por eso tu RTX mezcla las dos cosas..."). En video eso pide un cambio en pantalla dentro de la frase, o partirla.
- **El crítico encontró lo que el inspector no mide.** En el piloto puso 3.95, debajo del 4.5 de la puerta B, con Retención y Recurso visual en 3. Señaló dos partes que empiezan con el lienzo vacío mientras la voz ya habla (0:42 y 0:52) y la flecha del cierre, que entra al ojo cuando la tesis dice que el rayo sale de él. El inspector pasó limpio: solo avisa de más de 4 s sin cambio. El informe está en `content/2026-10-19-que-es-ray-tracing/video-critica.md`.
- **El puntaje del crítico casi no se movió entre rondas: 3.95 y 3.90.** Los tres puntos de la ronda 1 se arreglaron, y Retención subió de 3 a 4. Cada contexto nuevo encuentra otros problemas: la ronda 2 marcó la columna de ray tracing, que tira los rayos desde la lámpara; la X que tacha también el rayo verde; y los relojes quietos. Por eso el promedio solo no alcanza para decidir; los arreglos concretos sí. Hasta calibrarlo con Jeremy, el crítico es una lista de problemas más que una nota.
- **Tres rondas: 3.95, 3.90 y 4.05.** Cada ronda arregló lo que marcó la anterior, y la tesis llegó a 5, pero Recurso visual quedó en 3 en las tres. Lo que los tres críticos marcaron por separado es la señal más confiable:
  - los subtítulos cortan frases y mezclan el final de una oración con el principio de la siguiente;
  - los dibujos son chicos para un celular.

  Las dos cosas son del motor, no de esta pieza. Los subtítulos ya se arreglaron: `createTikTokStyleCaptions` de Remotion agrupa palabras por tiempo, y ahora `src/captions.ts` corta por frase. El tamaño de los dibujos queda pendiente.
- **La última frase queda menos de 1 s en pantalla.** Cada escena termina 300 ms después de su última palabra, y en el cierre eso cortaba el CTA. Ahora la última escena se sostiene 1 s (`END_TAIL_MS`), y el piloto dura 60.3 s.
- **El crítico no ve video.** Claude lee imágenes, no MP4, así que la carpeta lleva un cuadro cada 2 s en tiras de 6 con la interfaz encima, y la transcripción con el segundo de cada parte. Un agente que sí ve video (Gemini) mira `video.mp4`.
- **Un marco fijo hace iguales a todos los videos.** El de Scion, el segundo, salió casi igual al piloto: mismo papel, mismos titulares a mano y solo otro acento. Jeremy pidió que varíen como sus carruseles, y ahora cada pieza lleva su dirección de arte de la baraja (ver Estilo). Además, el diseño dejó de esquivar la interfaz de Instagram: con margen, los dibujos pasaron de 385 a 468 px de ancho, lo que también responde a "los dibujos son chicos para un celular".

La segunda versión del plan es del 20 de octubre de 2026 y Jeremy la aprobó ese mismo día. Toma las cuatro decisiones de Jeremy sobre la primera:
1. Remotion como motor.
2. Sus skills oficiales.
3. Bibliotecas de recursos (sonidos, PNG, chroma).
4. La API de Gemini directa, detrás de puertos que permiten cambiar de proveedor.

Lo que ya funciona está en [workflows/video.md](../workflows/video.md).

## Decisiones

| Tema | Decisión |
|---|---|
| Motor | **Remotion 4.0.537.** Es gratis para Jeremy porque trabaja solo; la licencia de pago es para empresas de más de 3 personas |
| Skills | Las 12 oficiales de Remotion, sin modificar, más una capa propia (`skills/video-es`) que dice qué cambia en este repo |
| Voz | Gemini 3.8 Flash TTS por la API, detrás de `SpeechProvider`, con la voz **Puck** (elegida por Jeremy el 20 de octubre de 2026). ElevenLabs puede entrar después como otro adaptador |
| Imágenes | Nano Banana 2.1 por la API de Gemini, detrás de `ImageProvider` |
| Recursos | Un catálogo propio, con la licencia de cada archivo, que se alimenta de las bibliotecas de abajo |
| Etiqueta de IA | Todo Reel con voz sintética la lleva (Meta) |
| Estilo | El del carrusel: su marco (pestaña, puntos y firma) fijo, y por pieza la dirección de arte de la baraja, con su paleta, tipografías, ancla y composición. Sin esquivar la interfaz de Instagram, solo con margen (decisiones de Jeremy del 20 de octubre de 2026; reemplazan el marco fijo "cuaderno") |

Una aclaración: **el carrusel no usa Remotion**, sino nuestro render con Playwright. Lo que se comparte es React, Tailwind y las primitivas, y su movimiento se adapta (ver abajo).

## Motor: Remotion

**Lo que aporta:**
- **Studio:** la vista previa en el navegador, con línea de tiempo. Además, los cambios que se hacen ahí (textos, subtítulos, tiempos) se escriben en el código. Es el editor visual que pedía el informe de ChatGPT, y no hay que construirlo.
- **Composición:** props validadas con Zod (ya lo usamos), `calculateMetadata` para que la duración salga de la voz y `TransitionSeries` para encadenar escenas.
- **Render y estilos:** render desde Node con `@remotion/renderer`, y Tailwind v4 con `@remotion/tailwind-v4`.

**Lo que cambia en nuestras primitivas.** Las skills de Remotion lo dicen claro: las animaciones CSS y las clases `animate-*` no se renderizan bien, y el movimiento sale de `useCurrentFrame()`.
- Las primitivas (`Proceso`, `Cifra`, `Boceto`, `Flecha` y las demás) se reusan.
- En el carrusel, `data-anim` sigue siendo una animación CSS.
- En video, el mismo atributo recibe el avance de cada cuadro como variable CSS, sin animación. El cambio vive en `motion.tsx` y la salida del carrusel no cambia; se verifica volviendo a renderizar las piezas aprobadas.
- Las primitivas que leen del disco (`Objeto` y las fuentes) pasan a `staticFile()`.

**Dónde vive.** `packages/video` es el proyecto de Remotion del monorepo. Cada pieza tiene su `content/<pieza>/video.tsx`, como `slides.tsx`, y su carpeta se pasa como carpeta pública (voz e imágenes).

**Licencias de los paquetes:**
- **MIT:** `@remotion/captions`, `shapes`, `sfx`, `rough-notation` y `whisper-webgpu`.
- **Licencia de Remotion:** `remotion`, `@remotion/transitions`, `effects`, `light-leaks` y `renderer`. Es gratis para Jeremy.
- **Remotion 5** cambiará un poco la licencia: hay que revisarla al actualizar.

**Técnico.**
- **Windows** está soportado.
- **Efectos que usan WebGL:** necesitan `Config.setChromiumOpenGlRenderer("angle")`.

## Skills de Remotion

- **Cuáles son:** las 12 oficiales, con `remotion-best-practices` como entrada. Cubren animación, subtítulos, voz en off por escena, transiciones, efectos, sonido, Lottie, medición de texto, Studio y render. Su versión (4.0.537) es la misma del paquete.
- **Cómo se instalan.** Su repo no publica licencia y este repo es público, así que no se commitean. Cada máquina las instala con `npx skills add remotion-dev/skills` en `.agents/skills/`, que git ignora, y la versión queda anotada.
- **Dónde chocan con nuestras reglas, manda AGENTS.md.** `skills/video-es` lo dice, como `skills/ig-es` con las `ig-*`:
  - **Voz:** la skill recomienda ElevenLabs y pide su clave. Aquí la voz sale de `video:voice`, con el proveedor de la cuenta.
  - **Archivos:** la skill los pone en `public/` del proyecto. Aquí van en la carpeta de la pieza.
  - **Fuentes:** la skill sugiere Google Fonts. Aquí se usan las de `packages/brand`.
  - **Sonidos:** solo los del catálogo. Los memes de `remotion.media` (Vine, SpongeBob, Windows XP) no, porque usan sonidos con derechos de terceros.
  - **Render:** la skill evita renderizar si no se pide. Aquí `video:render` renderiza y corre el inspector, y Studio queda para mirar y ajustar.
- **Shotcraft vuelve a servir.** Sus 124 recetas son componentes de Remotion con licencia Apache 2.0. Se consultan para planos y ritmo, adaptados a 9:16, sin adoptar su flujo. Trae audio de Mixkit que no se puede redistribuir, así que se instala igual: fuera de git.

## Bibliotecas de recursos

Sí existen, y varias vienen con Remotion.

| Tipo | Fuente | Licencia | Para qué |
|---|---|---|---|
| Efectos de sonido | `@remotion/sfx`: whoosh, whip, page-turn, switch, mouse-click, shutter, ding, record-scratch | Por sonido. El whoosh es CC0 de Freesound; entran solo los CC0 | Transiciones, clics, aparición de elementos |
| | Kenney (packs de interfaz, impactos y digitales) | CC0 | Lo mismo, con más variedad |
| | soundcn: más de 700 sonidos, casi todos de Kenney | CC0, salvo los 110 de World of Warcraft (de Blizzard), que quedan fuera | Catálogo listo para buscar |
| | Mixkit, con la lista curada de Shotcraft | Uso comercial en redes sin atribución; no se distribuyen los archivos sueltos | Papel, escritura, contadores |
| | Freesound (con clave gratis) y Openverse (sin clave) | Se filtra por CC0 | Lo que falte |
| Música | Lyria 3.5 por la API de Gemini | De pago ($0.08 por canción). Los términos comerciales están por confirmar | Una cama suave, opcional |
| Fondos y anotaciones | Remotion Elements: Notebook Paper, Paper Texture, Circle Marker, Crossed Off, Text Marker, Number Counter, gráficos, Social Safe Zones | De Remotion | El cuaderno, subrayados a mano y la capa de zonas seguras en Studio |
| | `@remotion/rough-notation` y `@remotion/shapes` (Arrow, Callout, Spark, Star) | MIT | Resaltados, círculos, tachados y flechas animados |
| | `@remotion/effects`: `paper()`, `gridlines()`, `dotGrid()`, `noise()`, `roughenEdges()`, `glow()`, `lightLeak()` | De Remotion | Textura y luz sin archivos |
| PNG y SVG | Fluent Emoji (con versión 3D en PNG), Lucide y Simple Icons, ya en el repo | MIT, ISC y CC0 | Objetos, íconos y logos oficiales |
| Animaciones | Noto Animated Emoji, por `@remotion/lottie` | CC BY 4.0 según quienes lo distribuyen: pide atribución, a confirmar en la fuente | Reacciones animadas |
| | Animaciones gratis de LottieFiles | Lottie Simple License: uso comercial y atribución opcional, sin distribuir los archivos sueltos | Íconos animados |
| Chroma | `colorKey()` de `@remotion/effects` | De Remotion | Quita el verde en el render: clips de pantalla verde e imágenes generadas |
| Video de apoyo | Pexels y Pixabay (API gratis) | Uso comercial; se revisa cada archivo | Poco: en temas dev pesan más las grabaciones de pantalla propias |

**Cómo se usan:**
- **Catálogo:** `assets/catalog.json` se versiona. Por archivo guarda id, tipo, etiquetas, URL de origen, licencia, atribución, sha256 y si está aprobado.
- **Archivos:** se bajan con `video:asset` a una carpeta fuera de git. El repo es público y Mixkit y LottieFiles no permiten distribuir sus archivos sueltos. Los CC0 se tratan igual, por simpleza.
- **Búsqueda:** `video:asset buscar "<intención>"` busca primero en el catálogo y después en Freesound, Openverse y Pexels, con la licencia filtrada. Lo que agrega al catálogo entra con su licencia anotada, y nada entra sin licencia conocida.
- **Chroma para PNG:** Gemini no genera imágenes con transparencia. Por eso se piden sobre fondo verde liso:
  - en video, `colorKey()` quita el verde al renderizar;
  - para PNG reutilizables, también en el carrusel, un paso local quita el verde y guarda la transparencia.

  Remotion también exporta video con transparencia (ProRes 4444 o WebM), por ejemplo para el avatar.

## Proveedores: Gemini directo, desacoplado

**Paquete.** Va en `packages/media`, con código en inglés y sin imports de otros paquetes, como el publisher. Lo usan el video y, si hace falta, el carrusel.

```ts
interface SpeechProvider { id: string; synthesize(req: { text: string; voice: string; style?: string; language: string }): Promise<{ audio: Uint8Array; format: "wav" | "mp3"; words?: WordTiming[] }> }
interface ImageProvider { id: string; generate(req: { prompt: string; references?: string[]; aspectRatio?: string; size?: "1K" | "2K" | "4K"; background?: "chroma-green" }): Promise<{ image: Uint8Array; mimeType: string }> }
interface MusicProvider { id: string; compose(req: { prompt: string; seconds: number }): Promise<{ audio: Uint8Array; format: string }> }
interface Aligner { align(req: { audio: Uint8Array; text: string; language: string }): Promise<WordTiming[]> }
```

**Adaptadores iniciales:**
- **Gemini** para la voz (`gemini-3.8-flash-tts`), la imagen (`gemini-nano-banana-2.1`) y la música (`lyria-3.5`), con el SDK oficial `@google/genai` (Apache 2.0).
- **Alineación local** con `@remotion/whisper-webgpu`, que corre en la RTX 3050 con un modelo multilingüe y el idioma fijado en español. Si falla, whisper.cpp.

**Cambiar de proveedor** es escribir un adaptador y cambiar una línea de configuración. Por ejemplo, ElevenLabs:
- usa su SDK oficial `@elevenlabs/elevenlabs-js` (MIT);
- devuelve tiempos por carácter, y `@remotion/elevenlabs` los convierte en subtítulos, así que no hace falta whisper.

**Configuración:**
- La voz va en `accounts/dev.json → voice` (`provider`, `voiceId`, `style`); el esquema ya tiene esos campos.
- Imágenes y música van en `media.config.json`.
- Las claves van en `.env`: `GEMINI_API_KEY`, y después `ELEVENLABS_API_KEY`.

**Caché y registro.** La caché va por proveedor, modelo, voz y texto. Cada generación queda registrada (proveedor, modelo, prompt y fecha), para saber qué es IA en cada pieza.

**Por qué puertos propios y no el AI SDK de Vercel.** No encontré soporte de Gemini TTS en su `generateSpeech`. Además, su API común esconde lo que distingue a cada proveedor: el estilo de voz de Gemini o los tiempos de ElevenLabs.

**Voz.** La prueba a ciegas ahora es entre voces de Gemini: 30 prediseñadas más el diseño de voz por descripción. La elegida queda en `accounts/dev.json` y no cambia entre videos.

**Imágenes.** Nano Banana 2.1 acepta hasta 4 imágenes de referencia de personaje, así que mantiene al avatar entre poses. Todas las imágenes llevan la marca SynthID.

**Costo con Gemini:**
- voz: cerca de $0.01 por Reel;
- imagen: $0.0336 cada una;
- música: $0.08 por canción.

Los $10 mensuales de créditos de Google AI Pro cubren todo. Se activan en Google Developer Program, y la clave se crea en AI Studio dentro del proyecto con facturación.

## Reels en 2026: con qué se diseña

**Qué mide el algoritmo:**
- **Señales.** Las que más pesan son el tiempo de visualización, los me gusta por alcance y los envíos por alcance. Los envíos pesan más para llegar a quien no te sigue (Mosseri, enero de 2025).
- **Originalidad.** Mosseri la volvió a nombrar en septiembre de 2026 (según terceros).
- **Trial Reels.** Muestran el video primero a no seguidores.

**El formato:**
- **Largo.** Hasta 3 minutos desde enero de 2025. Para explicativos, de 30 a 60 s; `ig-reel` trabaja entre 15 y 45 s.
- **Ritmo.** El gancho se ve y se escucha desde el cuadro 1 y termina antes de los 3 s. La imagen cambia cada 4 s como máximo (`beats.py`).
- **Texto en pantalla.** Hasta 6 palabras por tarjeta y subtítulos quemados.
- **Tamaños.** El titular va de 84 px o más y el texto de apoyo de 44 px o más (skill de Remotion, para 1080 de ancho).

**Lo que tapa o recorta Instagram:**
- **Zona segura.** La de `ig-reel` deja nada importante fuera de y 230 a 1440 ni en los 230 px de la derecha. Aquí no se usa: Jeremy prefirió componer con todo el lienzo y un margen (ver Estilo). La vista con la interfaz muestra lo que tapa.
- **Portada.** La grilla del perfil es rectangular desde enero de 2025, así que el centro del primer cuadro funciona como portada.

**Reglas de Instagram y de Meta:**
- **Lo que Instagram no recomienda.** En 2021 pidió evitar los Reels con bordes, marcas de agua de otras apps, baja resolución o cubiertos mayormente de texto. Por eso cada escena explica con un recurso visual.
- **Etiqueta de IA.** Meta pide etiquetar el audio realista creado o alterado digitalmente (febrero de 2024).

## Estilo

**El del carrusel** (decisión de Jeremy del 20 de octubre de 2026, después del piloto). Lo que identifica a la cuenta no cambia, y todo lo demás sale del tema, como en el feed de carruseles: se reconocen como de la cuenta y no se ven iguales.

| Fijo en todos los videos | Cambia con cada pieza |
|---|---|
| El marco de `<Slide>`: la pestaña de archivo, la textura de puntos y la firma | La **dirección de arte** (`video.json → art`), de la misma baraja del carrusel: `video:baraja` reparte 3 sin las dos últimas que usaron los videos. Si la pieza tiene carrusel, el Reel toma su `post.json → art` |
| Los subtítulos, de una frase o un pedazo de frase, con la palabra que se dice marcada | La **paleta y las tipografías** de esa dirección. El acento tiene que llegar a 4.5:1 sobre `bg` y `surface`, porque los subtítulos lo usan; `video:prepare` lo revisa |
| El margen del marco (36 px) y el avatar, cuando exista | El **ancla**, la **pestaña**, el **tono** de cada escena y la **composición**: libre, sin plantillas |

Por qué cambió. La primera versión fijaba un marco "cuaderno" (papel con cuadrícula, titulares en Caveat) y solo variaba el acento. El segundo video, el de Scion, salió casi igual al piloto, y Jeremy lo marcó: los Reels tenían que variar por tema como sus carruseles, con el del ray tracing como ejemplo. Ahora el piloto toma la dirección de su carrusel (línea continua, fondo casi negro, Archivo y el verde de NVIDIA) y el de Scion la suya (antes y después, papel marfil, Archivo condensada y el terracota de Claude).

**Composición.** El diseño no esquiva los botones ni los textos de Instagram (también decisión de Jeremy): usa el lienzo dentro del margen, con dibujos de 468 px de ancho, los de una lámina del carrusel. El título empieza en y 128, dentro del recorte 3:4 de la grilla, y los subtítulos van de y 812 a 880, arriba de la firma. La vista con la interfaz sigue en la hoja para saber qué tapa la app.

Las herramientas para el dibujo a mano ya están: los Elements de anotación, `rough-notation` y nuestro `Boceto` con rough.js.

De las referencias se toma la técnica (una idea por escena, pocas palabras, el dibujo acompañando a la voz), no la identidad: la paleta sale de la dirección de la pieza y el personaje es el de la cuenta. Logos y mascotas, como en el carrusel: el archivo oficial sin modificar, y nada encima de ellos.

## Cómo queda el flujo

1. **Tema y `facts.json`,** como en el carrusel. Con `--from content/<pieza>`, el video reusa los datos de un carrusel aprobado.
2. **`video.json`** (campos en inglés, contenido en español). Lleva:
   - 3 ganchos con las fórmulas de `ig-reel`;
   - un guion por escena, escrito para el oído;
   - lo que se ve en cada escena;
   - el texto del post.

   `video:check` corre `beats.py` con un wrapper en español.
3. **Puerta A:** gancho, guion y storyboard.
4. **`video:voice`:** una voz por escena, como la skill de Remotion, con los tiempos por palabra y caché.
5. **`video.tsx`.** Es la composición de Remotion:
   - `calculateMetadata` toma la duración de cada escena de su voz;
   - las escenas usan las primitivas y los Elements;
   - los subtítulos resaltan la palabra que se dice, en páginas cortadas por frase (`src/captions.ts`);
   - los efectos de sonido salen del catálogo.
6. **Vista previa.** El agente abre Remotion Studio, en el navegador integrado si lo hay. Jeremy puede ajustar textos y tiempos ahí, y los cambios quedan en el código.
7. **`video:render`:** un MP4 de 1080×1920 a 30 fps y una hoja de revisión con un fotograma por escena.
8. **Inspector de video.** Revisa:
   - el margen del marco y el tamaño de letra;
   - las palabras por escena;
   - que no haya más de 4 s sin cambio;
   - que los subtítulos estén completos;
   - que el gancho esté en el cuadro 1;
   - el volumen (−14 LUFS) y la duración.
9. **Crítico ciego,** con los fotogramas clave y el guion.
10. **Puerta B.**
11. **Publicar como Reel,** solo cuando Jeremy lo pida, con portada, etiqueta de IA y texto del post.

## Fases

| Fase | Qué | Termina cuando |
|---|---|---|
| 0. Base | Remotion en `packages/video`, las skills instaladas y `skills/video-es`. Una escena de 10 s con dos primitivas adaptadas, voz de Gemini, subtítulos y dos efectos. Prueba a ciegas de voces de Gemini | Corre en Windows y Jeremy elige la voz |
| 1. Proveedores y recursos | `packages/media` con los puertos, los adaptadores de Gemini, caché y alineación. Catálogo y `video:asset` con las primeras bibliotecas | Cambiar de proveedor no toca el flujo (lo prueba un test con un proveedor falso) |
| 2. Piloto | El Reel del ray tracing: escenas, subtítulos, efectos, inspector y hoja de revisión | Pasa el inspector y Jeremy lo aprueba en el celular |
| 3. Flujo editorial | `workflows/video.md`, AGENTS.md, `ig-reel` en español, puertas, crítico ciego y métricas | Un video nuevo sale de punta a punta |
| 4. Avatar | Poses y bocas generadas con referencias de personaje y chroma, y `<Avatar>` con Rhubarb (su reconocedor fonético sirve para español) | El avatar habla en sincronía |
| 5. Publicar Reels | El publisher sube un solo video, con portada y etiqueta de IA. Primero, el ensayo | Hay un primer Reel publicado, cuando Jeremy lo pida |

## Lo que hace falta de Jeremy

Ya está todo lo de la fase 0:
- `GEMINI_API_KEY` en `.env`;
- la voz, Puck;
- el estilo: el del carrusel, con la dirección de arte por pieza (cambió el 20 de octubre de 2026, después del piloto).

## Riesgos

- **Primitivas:** adaptar su movimiento toca código del carrusel. Para cubrirlo, el modo CSS no cambia y las piezas aprobadas se vuelven a renderizar para comparar.
- **Licencias de Remotion:** `@remotion/effects` y `@remotion/transitions` dicen "UNLICENSED" en npm, y caen en la licencia de Remotion, gratis para Jeremy. Si algún día trabaja con un equipo de más de 3 personas, se paga.
- **Skills sin licencia publicada:** se instalan por máquina y no se versionan.
- **Lyria:** resuelto. Los [términos de la API de Gemini](https://ai.google.dev/gemini-api/terms) dicen que Google no reclama la propiedad de lo generado y no limitan el uso comercial. Lo que queda es que puede generar algo parecido para otros, así que la música no es exclusiva.
- **Whisper en WebGPU:** necesita una GPU compatible. Si falla, whisper.cpp.
- **Etiqueta de IA en la web de Instagram:** el ensayo dirá dónde está el interruptor.

## Fuentes

Revisadas el 20 de octubre de 2026.

**Remotion:**
- [skills oficiales](https://github.com/remotion-dev/skills) y su [documentación](https://www.remotion.dev/docs/ai/skills);
- [licencia](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) y [precios](https://www.remotion.dev/docs/license/pricing);
- [efectos de sonido](https://www.remotion.dev/docs/sfx) y la [licencia del whoosh](https://www.remotion.dev/docs/sfx/whoosh);
- [Elements](https://www.remotion.dev/elements) y [efectos](https://www.remotion.dev/docs/effects).

**Otras bibliotecas:**
- [Video Shotcraft](https://github.com/Vincentwei1021/video-shotcraft) y [soundcn](https://github.com/kapishdima/soundcn);
- [licencias de LottieFiles](https://help.lottiefiles.com/animation-licensing-basics-);
- [Noto Animated Emoji](https://pub.dev/packages/animated_emoji), en un paquete que lo distribuye;
- [stickers con chroma en Nano Banana](https://www.philschmid.de/generate-stickers).

**Gemini:**
- [voz](https://ai.google.dev/gemini-api/docs/speech-generation), [imágenes](https://ai.google.dev/gemini-api/docs/image-generation) y [precios](https://ai.google.dev/gemini-api/docs/pricing);
- [planes de Google AI y la API](https://ai.google.dev/gemini-api/docs/google-ai-plans);
- [créditos de AI Pro](https://blog.google/innovation-and-ai/technology/developers-tools/gdp-premium-ai-pro-ultra/).

**Instagram y Meta:**
- [etiqueta de IA de Meta](https://about.fb.com/news/2024/02/labeling-ai-generated-images-on-facebook-instagram-and-threads/);
- [Reels de 3 minutos y grilla rectangular](https://www.engadget.com/social-media/instagram-swoops-in-with-3-minute-reels-and-rectangular-profile-grids-as-the-tiktok-ban-gets-real-201316339.html);
- [señales de Mosseri](https://kompozy.io/news/instagram-mosseri-ranking-signals-guidance) (fuente secundaria);
- [guía de 2021](https://www.rivaliq.com/blog/best-practices-instagram-reels/).

**Avatar:**
- [Rhubarb Lip Sync](https://github.com/DanielSWolf/rhubarb-lip-sync).
