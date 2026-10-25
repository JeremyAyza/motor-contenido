# packages/video

El flujo de video con Remotion 4.0.537. El código va en inglés. El plan está en [docs/plan-videos.md](../../docs/plan-videos.md) y el paso a paso en [workflows/video.md](../../workflows/video.md).

## Comandos

```bash
npm run video:baraja -- content/<pieza>              # reparte 3 direcciones de arte para video.json → art
npm run video:script -- content/<pieza>              # revisa video.json y arma la puerta A (out/gate-a.md)
npm run video:capture -- content/<pieza> [<id>]     # corre los comandos de captures.json y guarda su salida real
npm run video:storyboard -- content/<pieza>          # los visuales sin voz, al ritmo estimado: out/storyboard.png para la puerta A
npm run video:prepare -- content/<pieza>             # voz, tiempos y archivos en content/<pieza>/out/video/ (pide la puerta A)
npm run video:studio -- content/<pieza>              # vista previa en Remotion Studio
npm run video:render -- content/<pieza>              # MP4 1080×1920, hoja de revisión y sha256 para la puerta B
npm run video:critique -- content/<pieza>            # carpeta para el crítico ciego (out/video-critica/)
npm run video:metrics                                # informe de los Reels en docs/metricas-video.md
npm run video:voices                                 # prueba a ciegas de voces (out/voices/A.mp3, B.mp3...)
npm run video:schema                                 # regenera schemas/video.schema.json
npm run video:image -- content/<pieza> --name <n> --prompt "..." [--chroma] [--ref img/a.png]   # img/<n>.png
npm run video:music -- content/<pieza> --name <n> --prompt "..."                               # audio/<n>.mp3
npm run video:asset -- search "<consulta>" | add <biblioteca>:<id> --id <n>                    # efectos CC0 al catálogo
```

Los comandos de imagen, música y recursos están en `src/media-commands.ts`. La música de fondo la mezcla `MusicBed`, en `src/PieceVideo.tsx`: entra y sale con un fundido y baja mientras habla la voz (`musicVolume`, en `src/timeline.ts`).

## Cómo funciona

1. **`content/<pieza>/video.json`** es el guion: ganchos, lo que dice la voz y lo que se ve en cada escena, la dirección de arte (`art`) y las dos puertas. El esquema y las reglas (la primera escena empieza con el gancho elegido) están en `src/script.ts`. Sin `art`, `artOf` toma el `post.json → art` del carrusel de la pieza.
2. **`content/<pieza>/video.tsx`** define lo que se ve con `defineVideo` (de `@motor/video`): por escena del guion, su tono (`tone`), sus efectos (`sfx`) y su `Visual`.
3. **`video:prepare`** exige la puerta A, revisa que el acento de la paleta se lea sobre `bg` y `surface` (`src/palette.ts`) y hace esto por escena:
   - genera la voz con el proveedor de la cuenta (`packages/media`);
   - calcula cuándo se dice cada palabra;
   - baja los efectos del catálogo, si tienen la licencia revisada y el hash.

   Después escribe `timeline.json`, con la dirección de arte, la pestaña y la cuenta, y copia voces, efectos, fuentes y objetos a `out/video/`, que es la carpeta pública de Remotion.
4. **`src/PieceVideo.tsx`** es la composición:
   - toma la duración de `timeline.json`;
   - pone cada escena en un `Series.Sequence` con su voz;
   - pone cada escena dentro de `<Slide>`, el marco del carrusel (pestaña, puntos y firma), con su tono;
   - agrega subtítulos con la palabra que se dice en el color de acento, o subrayada en los tonos `accent` e `invert`.

   Las páginas de subtítulos las corta `src/captions.ts` por frase: nunca cruzan un punto, prefieren cortar después de una coma o dos puntos, y no terminan en un artículo, una preposición o antes de una sigla.
5. **Render:** el lienzo de diseño mide 540×960 y se renderiza a 2x. Es determinista: el mismo contenido da el mismo archivo, así que la puerta B guarda el sha256 del video aprobado y `video:render` la vuelve a `false` si el archivo cambia.
6. **Inspector** (`src/inspector.ts`):
   - **Sonda.** `video:render` abre un servidor local y le pasa su URL a la composición (`inspect`). `src/probe.tsx` le envía el texto de un cuadro cada medio segundo: posición en px de diseño, tamaño de letra y opacidad efectiva. Las medidas salen del DOM real del render. La sonda no dibuja nada, así que el archivo es el mismo con o sin ella.
   - **ffmpeg** revisa el volumen (EBU R128) y saca los cuadros que miden la composición y las partes quietas.
   - **Volumen.** Antes de inspeccionar, el render normaliza el volumen a −14 LUFS en dos pasadas (`loudnorm` lineal) y copia el video sin recodificarlo.
   - **Composición:** mide en los píxeles de la hoja, sobre fondo claro u oscuro, si cada escena queda centrada entre el título y los subtítulos y si la portada llena el recorte 3:4.
   - **Partes quietas:** cuenta los píxeles que cambian cada medio segundo arriba de los subtítulos.
7. **Marco de escena:** `SceneFrame` (en `src/kit/scene-frame.tsx`) pone el título arriba y centra el dibujo de 468 px entre el título y los subtítulos (`CONTENT_BOX` y `CAPTIONS_TOP`, en `src/timeline.ts`). Sin `height`, apila lo que recibe en una columna centrada. El diseño no esquiva la interfaz de Instagram: solo deja el margen del marco (`FRAME_PAD`).
   - **Kit de escenario** (`src/kit/stage.tsx`): `Phone`, `BrowserBar`, `AppCard`, `Chat`, `Terminal`, `Diff`, `DataTable` y `Chip`, interfaces genéricas cuyo texto va marcado `data-ui`.
   - **HUD y subtítulos** (`src/frame.tsx`): `ChapterBar` con `defineVideo({ chapters: true })`, y los estilos de `Captions` (`captions: "highlight" | "pill" | "marker"`).
8. **ig-reel** (`src/reel.ts`): `video:script` corre `hookscore_es --video` y `beats_es --video` (en `skills/ig-es`) y traduce lo que marcan a avisos en español para la hoja de la puerta A. El ritmo de la voz es `WORDS_PER_SECOND`, en `src/script.ts`, medido en el piloto.
9. **Crítico ciego** (`src/critique.ts`):
    - **En la puerta A,** `video:script` arma `out/video-critica-ganchos/`.
    - **Antes de la puerta B,** `video:critique` arma `out/video-critica/`: el video con la interfaz, las tiras de cuadros (`filmstrips`), la portada en la grilla (`gridCover`), lo que se oye, el texto del post y el brief aparte.
10. **Métricas** (`src/metrics.ts`): el esquema de `video-metrics.json` y el informe `docs/metricas-video.md`, ordenado por compartidos por alcance.
11. **Salidas reales** (`src/capture.ts`): `video:capture` corre los comandos de `captures.json` en carpetas limpias, con autor y fecha de git fijos, limpia colores, progreso y rutas locales, y guarda la salida. `useCapture` y `captureLines` la llevan a una `Terminal`.
12. **Formato y tema** (`src/script.ts`, `src/topics.ts`): `format` fija el rango de duración de la puerta A y del inspector (`FORMAT_SECONDS`), y `topic` deja avisar si una pieza de los últimos 14 días tuvo un tema parecido.

## Primitivas del carrusel en Remotion

Se importan de `@motor/ui` como en el carrusel. Hay tres diferencias:
- **Archivos.** Las primitivas no leen el disco: lo pide `AssetContext`. En el carrusel lo da `assets-node.ts` y en el video lo da `src/assets-browser.ts`. En el video, los íconos y logos vienen en el bundle y las imágenes y objetos salen de la carpeta pública.
- **Movimiento.** `CssMotion` (en `src/motion.tsx`) pausa las animaciones CSS de `data-anim`. Su retraso sale del cuadro actual (`--t`), así que el navegador calcula cada cuadro solo con CSS, aunque Remotion renderice en paralelo y fuera de orden.
- **Letra.** El tamaño de la letra chica es `max(<tamaño del carrusel>, var(--min-text))`, y el video pone `--min-text: 22px` (`MIN_TEXT_PX`). En el carrusel la variable no existe y nada cambia.
