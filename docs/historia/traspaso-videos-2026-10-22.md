# Traspaso: motor de videos (22 de octubre de 2026)

Contexto para seguir en un chat nuevo. [AGENTS.md](../AGENTS.md) sigue siendo la fuente de verdad del repo; esto resume el estado de los Reels, las decisiones de Jeremy y lo que queda abierto. Para empezar, pide al agente: "Lee AGENTS.md y docs/traspaso-videos-2026-10-22.md".

## Reglas que siguen vigentes

- Respuestas a Jeremy en español, cortas. Código, comandos y campos JSON nuevos en inglés; docs y contenido en español. El motor viejo no se renombra por iniciativa propia.
- Nada del empleador de Jeremy: ni código, ni capturas, ni proyectos, ni clientes, ni métricas.
- Las claves de API van solo en `.env` (está en `.gitignore`), nunca en el chat ni en commits.
- No se automatizan DMs ni solicitudes de conexión. El agente no escribe ni pide usuarios o contraseñas, y no inicia sesión en Instagram por Jeremy. Lo que se lee de Instagram va a ritmo humano, sin scraping.
- Logos y mascotas: solo los archivos oficiales, sin modificar, sin dibujarlos ni generarlos, y nada encima de un logo.
- Español neutro, sin rayas (—), sin relleno, una idea por lámina o escena.
- Cada cifra en pantalla sale de `facts.json`. No se inventan números. No se toca la verificación de datos.
- Puertas humanas: solo el "sí" de Jeremy en el chat aprueba. El agente anota `gateA` y `gateB` en `video.json`; el sha256 de la puerta B se invalida si el MP4 cambia.
- Se publica solo cuando Jeremy lo pide, y se commitea solo cuando lo pide.
- No se ajustan wrappers ni herramientas para que una pieza pase.
- No se lanzan subagentes salvo que Jeremy lo pida.
- Repo público: no se commitean archivos de terceros sin licencia de redistribución.
- No se modifica `content/2026-10-17-orquestar-tickets-notion-claude/`.

## Estado de los Reels

| Pieza | Formato | Duración | Puertas | Publicado |
|---|---|---|---|---|
| `2026-10-19-que-es-ray-tracing` | corto | 60,3 s | A y B (`f29a5b2b…c301`) | 20 oct, [reel](https://www.instagram.com/reel/DevWukkhp16/) |
| `2026-10-20-anthropic-scion-git` | corto | 45,0 s | A y B (`c2e8030a…0e2e`) | 20 oct, [reel](https://www.instagram.com/reel/DevZLmeyzp1/), después de dos intentos que fallaron por timeout del publisher |
| `2026-10-18-agentes-ia-flujo-dev` | corto | 42,9 s | A y B (`11965a49…710e`) | 20 oct, [reel](https://www.instagram.com/reel/DevVCaUtVTJ/) |
| `2026-10-20-git-push-por-dentro` | explicado | 93,3 s | A y B (`a52c0bf6…5fbd`) | 20 oct, [reel](https://www.instagram.com/reel/DevZw01hM0G/) |
| `2026-10-21-php-vulnerabilidad-rce` | explicado | 97,4 s | A y B (`5f7e0175…284b`), 22 oct | 22 oct, [reel](https://www.instagram.com/reel/DeyQNP7vijp/) |
| `2026-10-20-superpowers-claude-code` | explicado | 90,4 s | A (21 oct) y B (`82edc481…8286`), 22 oct | 21 oct, a mano por Jeremy, [reel](https://www.instagram.com/reel/Dex304ih0xy/) |

Notas:
- El inspector del de PHP quedó con 10 avisos de imagen quieta (tramos de 4,5 a 11,5 s sin cambios). El de Superpowers sale limpio.
- El crítico ciego solo corrió en el ray tracing (3,95, 3,90 y 4,05). En los demás no consta: el de PHP tiene la carpeta `out/video-critica` armada.
- `content/2026-10-20-superpowers-claude-code-elevenlabs` y `-fish` son muestras de voz de ElevenLabs y Fish Audio para comparar con Puck. En el código solo existe el proveedor de Gemini (`packages/media/src/providers/gemini.ts`).
- `publications.jsonl` tiene 3 líneas sin commitear: la publicación del de PHP y el registro manual del de Superpowers.
- Todavía no hay ningún `video-metrics.json`.

## Decisiones de Jeremy

- **Motor:** Remotion 4.0.537. Lienzo de diseño de 540×960 que se renderiza a escala 2 (1080×1920). Los renders son deterministas.
- **Voz:** Gemini TTS con la voz Puck. ElevenLabs puede entrar después como otro adaptador de `SpeechProvider`.
- **Estilo:** el del carrusel. El marco de `<Slide>` (pestaña, puntos y firma) es fijo. La dirección de arte cambia por pieza (`video.json → art`, de la misma baraja; si falta, se toma `post.json → art`). No se esquivan los botones de Instagram: solo se deja un margen de 36 px.
- **Variedad por tema:** cada Reel tiene que verse distinto, como los carruseles. `video:baraja` reparte 3 direcciones y deja fuera las 2 últimas que usaron los videos.
- **Formatos:** `corto` (de 30 a 60 s) y `explicado` (de 75 a 100 s, en prueba). El explicado es "un segundo por dentro": un gesto de todos los días y todo lo que pasa adentro, con un personaje y una tarea concreta, de 5 a 7 capítulos, algo plantado al principio que se paga en el cierre y una frase para recordar.
- **Referente visual:** @rick.theengineer ([análisis](analisis-rick-theengineer.md), [propuesta para jacket.dev](propuesta-reels-jacket.md)). Sus Reels más vistos usan los ganchos de las fórmulas 28 y 29. Repetir un tema a los pocos días le dio unas 10 veces menos vistas.
- **Publicar:** `npm run video:publicar` sube el Reel con la portada del cuadro 1 y la etiqueta de IA de Meta. `--ensayo` hace todo sin publicar.

## Qué tiene el motor

- **Kit de escenario** (`packages/video/src/kit/stage.tsx`): `Phone`, `BrowserBar`, `AppCard`, `Chat`, `Terminal` (con comandos que se escriben solos, y las opciones `small` y `wrap`), `Diff`, `DataTable` y `Chip`. Su texto lleva `data-ui`: el inspector no lo cuenta en el límite de 12 palabras y lo deja bajar a 12 px.
- **HUD de capítulos:** `ChapterBar`, que se activa con `defineVideo({ chapters: true })` y `SceneDef.chapter`.
- **Subtítulos:** `captions: "highlight" | "pill" | "marker"`. Se adaptan al tono de la escena (`base`, `surface`, `accent` o `invert`).
- **Storyboard:** `video:storyboard` estima la duración a 2,7 palabras por segundo y renderiza sin voz: `out/storyboard.png` y `storyboard.mp4`, para la puerta A.
- **Salidas reales:** `captures.json` con `video:capture`. Cada captura corre en `.cache/captures/` con un autor y fechas fijos para git; se limpian los colores, el progreso y las rutas (quedan como `~/demo`). En `video.tsx` se leen con `useCapture` y `captureLines`.
- **Tema repetido:** `topic` en `video.json`. `video:script` avisa si una pieza de los últimos 14 días tuvo un tema parecido.
- **Inspector:** zona de texto, tamaño de letra, palabras en pantalla, imagen quieta por más de 4 s, composición (una franja vacía de más de 130 px bajo el dibujo es error), subtítulos, volumen y duración según el formato.
- **Ganchos:** las fórmulas 28 ("un segundo por dentro") y 29 ("la causa no es la que crees") están en `skills/ig-es/ganchos-es.json`. `hookscore` puntúa bajo la 28.

## Comandos

```
npm run video:baraja -- content/<pieza>      # 3 direcciones de arte
npm run video:script -- content/<pieza>      # revisa video.json y arma la puerta A
npm run video:capture -- content/<pieza>     # corre captures.json
npm run video:storyboard -- content/<pieza>  # visuales sin voz para la puerta A
npm run video:prepare -- content/<pieza>     # voz, alineación y timeline
npm run video:render -- content/<pieza>      # MP4, inspector y vista con la interfaz de Instagram
npm run video:critique -- content/<pieza>    # carpeta del crítico ciego
npm run video:publicar -- content/<pieza> [--ensayo]
npm run video:metrics                        # informe de video-metrics.json
npm run video:schema                         # regenera los esquemas
```

El flujo completo está en [workflows/video.md](../workflows/video.md) y en [skills/video-es/SKILL.md](../skills/video-es/SKILL.md).

## Lo que aprendimos

- La voz real sale más lenta que la estimación: el del git push se estimó en 84 s y salió en 93 s. Conviene dejar margen y más movimiento atado a cues.
- El probe mide después de `document.fonts.ready` y de que carguen las imágenes. Sin eso, el cuadro 0 daba errores de margen falsos.
- La regla vieja de composición (el centro del dibujo) marcaba piezas buenas y se cambió por la franja vacía. Con la regla nueva, el ray tracing tendría 4 escenas con dibujos chicos. No se tocó porque ya estaba aprobado.
- En la terminal de este entorno, `\\` se vuelve `\`. Para parches con regex conviene escribir un script de Python con la herramienta Write y correrlo.
- Prettier no está instalado.
- Finales de línea: `AGENTS.md` usa CRLF y `ganchos-es.json` usa LF; hay que respetarlos.
- Un Reel visto sin sesión en Instagram no muestra las vistas; se leen desde la grilla del perfil.

## Abierto: para investigar o mejorar

1. **Medir los formatos.** Hay 3 cortos y 2 explicados publicados. Falta cargar los datos de Insights en `video-metrics.json` (vistas, tiempo promedio, tasa de saltos, compartidos por alcance) y comparar.
2. ~~**Puerta B de Superpowers.**~~ Hecho: Jeremy lo publicó a mano el 21 de octubre y lo dio por completado el 22.
3. **Imagen quieta en el de PHP.** Ya está publicado, pero sus 10 avisos muestran que hace falta más movimiento atado a cues en el formato explicado.
4. **Crítico ciego.** Correrlo en los videos nuevos y calibrarlo con Reels que Jeremy admira (pendiente de la fase 3).
5. **Paso 5 de la propuesta:** mundos en la baraja, y un escenario continuo con cámara en vez de escenas sueltas. No está aprobado.
6. **Paso 6, el avatar** (fase 4): poses y bocas con chroma, y `<Avatar>` con Rhubarb. Necesita la ilustración de Jeremy y no está aprobado.
7. **Voz.** Decidir si ElevenLabs o Fish Audio entra como adaptador, a partir de las muestras.
8. **Licencias por confirmar:** los términos comerciales de Lyria y la atribución de Noto Animated Emoji.
9. **Publisher.** Los dos primeros intentos del de Scion fallaron por timeout (`locator.hover` y `locator.click`). Conviene revisar qué tan bien aguantan los selectores de `packages/publisher/src/platforms/instagram.selectors.ts` los cambios de la interfaz.

## Dónde mirar

- Lo que sigue, desde el 22 de octubre: [docs/analisis-reels-2026-10-22.md](analisis-reels-2026-10-22.md) y [docs/plan-piloto-automatico.md](plan-piloto-automatico.md)

- Plan y estado por fase: [docs/plan-videos.md](plan-videos.md)
- Análisis del referente: [docs/analisis-rick-theengineer.md](analisis-rick-theengineer.md) y [docs/swipe-reels.md](swipe-reels.md)
- Propuesta del formato explicado: [docs/propuesta-reels-jacket.md](propuesta-reels-jacket.md)
- Rúbrica del crítico: [docs/critica-video.md](critica-video.md) y [docs/critico-ciego-video.md](critico-ciego-video.md)
- Motor: `packages/video/src` (`cli.ts`, `inspector.ts`, `script.ts`, `capture.ts`, `topics.ts`, `PieceVideo.tsx`, `frame.tsx` y `kit/`)
- Un ejemplo completo del formato explicado: `content/2026-10-20-git-push-por-dentro/` (`facts.json`, `captures.json`, `video.json` y `video.tsx`)
