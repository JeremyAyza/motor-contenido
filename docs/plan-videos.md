# Plan: videos

Segunda versión, del 20 de octubre de 2026, **sin aprobar**. Toma las cuatro decisiones de Jeremy sobre la primera:
1. Remotion como motor.
2. Sus skills oficiales.
3. Bibliotecas de recursos (sonidos, PNG, chroma).
4. La API de Gemini directa, detrás de puertos que permiten cambiar de proveedor.

Si se aprueba, [workflows/video.md](../workflows/video.md) y [docs/contexto.md](contexto.md) se actualizan con esto.

## Decisiones

| Tema | Decisión |
|---|---|
| Motor | **Remotion 4.0.537.** Es gratis para Jeremy porque trabaja solo; la licencia de pago es para empresas de más de 3 personas |
| Skills | Las 12 oficiales de Remotion, sin modificar, más una capa propia (`skills/video-es`) que dice qué cambia en este repo |
| Voz | Gemini 3.8 Flash TTS por la API, detrás de `SpeechProvider`. ElevenLabs puede entrar después como otro adaptador |
| Imágenes | Nano Banana 2.1 por la API de Gemini, detrás de `ImageProvider` |
| Recursos | Un catálogo propio, con la licencia de cada archivo, que se alimenta de las bibliotecas de abajo |
| Etiqueta de IA | Todo Reel con voz sintética la lleva (Meta) |
| Estilo | La dirección "cuaderno", con el avatar de Jeremy |

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
- **Zona segura.** La de `ig-reel`: nada importante fuera de y 230 a 1440 ni en los 230 px de la derecha. El Element Social Safe Zones la muestra en Studio.
- **Portada.** La grilla del perfil es rectangular desde enero de 2025, así que el centro del primer cuadro funciona como portada.

**Reglas de Instagram y de Meta:**
- **Lo que Instagram no recomienda.** En 2021 pidió evitar los Reels con bordes, marcas de agua de otras apps, baja resolución o cubiertos mayormente de texto. Por eso cada escena explica con un recurso visual.
- **Etiqueta de IA.** Meta pide etiquetar el audio realista creado o alterado digitalmente (febrero de 2024).

## Estilo

**La dirección "cuaderno":** papel con cuadrícula, titulares a mano (Caveat), un acento cálido, tarjetas de borde fino, y flechas y bocetos a mano. Casi todo viene ya hecho:
- los Elements de papel y de anotación;
- `rough-notation`;
- nuestro `Boceto` con rough.js.

Lleva la firma de la cuenta y el avatar de Jeremy.

De las referencias se toma la técnica (una idea por escena, pocas palabras, el dibujo acompañando a la voz), no la identidad: la paleta y el personaje son los de la cuenta. Logos y mascotas, como en el carrusel: el archivo oficial sin modificar.

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
   - los subtítulos van con `@remotion/captions`, en un estilo de palabra resaltada;
   - los efectos de sonido salen del catálogo.
6. **Vista previa.** El agente abre Remotion Studio, en el navegador integrado si lo hay. Jeremy puede ajustar textos y tiempos ahí, y los cambios quedan en el código.
7. **`video:render`:** un MP4 de 1080×1920 a 30 fps y una hoja de revisión con un fotograma por escena.
8. **Inspector de video.** Revisa:
   - la zona segura y el tamaño de letra;
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

- `GEMINI_API_KEY` en `.env`, creada en AI Studio dentro del proyecto donde activó los créditos de AI Pro.
- Escuchar la prueba de voces y elegir.
- Confirmar el estilo "cuaderno" con la escena de prueba.

## Riesgos

- **Primitivas:** adaptar su movimiento toca código del carrusel. Para cubrirlo, el modo CSS no cambia y las piezas aprobadas se vuelven a renderizar para comparar.
- **Licencias de Remotion:** `@remotion/effects` y `@remotion/transitions` dicen "UNLICENSED" en npm, y caen en la licencia de Remotion, gratis para Jeremy. Si algún día trabaja con un equipo de más de 3 personas, se paga.
- **Skills sin licencia publicada:** se instalan por máquina y no se versionan.
- **Lyria:** sus términos de uso comercial están sin confirmar. Mientras tanto, música de una biblioteca con licencia, o ninguna.
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
