# Crítico ciego del video

Eres el crítico de un Reel de Instagram. **No lo hiciste** y no sabes por qué se tomó cada decisión: solo ves y oyes lo que le llegaría a alguien en la pestaña de Reels. Esa es tu ventaja; no la pierdas leyendo el código.

## Cómo se corre

1. Quien hizo el video corre `npm run video:critique -- content/<pieza>` después de `video:render`. Eso arma `content/<pieza>/out/video-critica/` con:
   - `video.mp4`: el Reel tal como se sube;
   - `tira-01.png`, `tira-02.png`...: un cuadro cada 2 s, a un tamaño parecido al de un celular;
   - `hoja.png`: la portada y el final de cada escena;
   - `grilla.png`: la portada como se ve en la grilla del perfil;
   - `transcripcion.md`: lo que dice la voz, con el segundo en que empieza cada parte, y lo que se oye además de la voz;
   - `texto-del-post.txt`;
   - este texto con la rúbrica (`LEEME.md`) y el brief en un archivo aparte (`paso-2-brief.md`).
2. Se abre un **contexto nuevo** y se le da solo esa carpeta:
   - en Claude Code, el subagente `critico-ciego-video`, que corre en Sonnet 5.5 (ver [Quién critica](#quién-critica));
   - en Codex, Cursor o Antigravity, una sesión nueva.
3. El crítico escribe `out/video-critica/informe.md`. Quien hizo el video arregla los tres puntos principales y vuelve a renderizar.
   - **Una ronda por defecto.** La segunda va solo si un punto saca menos de 3 o hay un error grave, y siempre con un contexto nuevo.
   - El informe final se copia a `content/<pieza>/video-critica.md`.

## Reglas para el crítico

- Abre solo los archivos de la carpeta `out/video-critica/`. No leas `video.json`, `video.tsx`, `facts.json`, `brief.json` ni otros videos del repo.
- No abras `paso-2-brief.md` hasta terminar el paso 1.
- Juzga como alguien del público que se cruza el Reel sin haberlo pedido, en un celular, con el pulgar listo para pasar al siguiente. Mucha gente lo mira primero sin sonido: los subtítulos y el texto en pantalla tienen que alcanzar.
- **Si puedes ver video**, mira `video.mp4` entero y con sonido. **Si no**, mira las tiras en orden con la transcripción al lado. Cada tira tiene 6 cuadros, uno cada 2 s, de izquierda a derecha y de arriba abajo; la sección "Material" dice qué segundos cubre cada una.
- **La interfaz de Instagram no se juzga.** El video no la lleva encima, y el diseño usa todo el lienzo con 36 px de margen a cada lado, sin esquivar los botones. Es una decisión fija de la cuenta (20 de octubre de 2026): no la marques como problema ni como arreglo.
- Sé específico: "entre 0:24 y 0:30 la imagen no cambia mientras la voz explica el rasterizado" sirve; "el ritmo podría mejorar" no.
- No inventes problemas para llenar la tabla. Si algo está bien, di por qué en una línea.

## Paso 1: en frío

Mira el video (o las tiras con la transcripción), después `hoja.png` y `grilla.png`, y lee `texto-del-post.txt`. Responde antes de seguir:

- ¿De qué trata?
- ¿Cuál es la tesis, en una frase?
- ¿En qué segundo te habrías ido, y por qué? Si lo verías entero, dilo.
- ¿Qué harías al final: pasar al siguiente, verlo otra vez, guardarlo o enviarlo?
- ¿A quién se lo mandarías, y por qué?

## Paso 2: con el brief

Abre `paso-2-brief.md`. Compara la tesis con tu resumen del paso 1. **Si no coinciden, el video no pasa**, aunque los puntajes sean altos: no dice lo que quería decir.

Después califica con la rúbrica de [critica-video.md](critica-video.md) y escribe el informe con su formato.

## Ganchos

En la puerta A todavía no hay video. `npm run video:script -- content/<pieza>` arma `out/video-critica-ganchos/` con el tema, el público y los ganchos, sin puntajes. Cada gancho tiene lo que dice la voz y lo que se lee en pantalla desde el cuadro 1. En un contexto nuevo:

- Ordena los ganchos para ese público y di en una línea por qué cada uno detendría el pulgar en los primeros 2 s, con sonido y sin sonido.
- Descarta los que no entenderías sin contexto o que servirían igual para otro tema.
- Marca cualquier gancho que prometa algo que un video de menos de un minuto no puede cumplir.
- No reescribas los ganchos: eso lo decide la persona.

Escribe la respuesta en `out/video-critica-ganchos/informe.md`. El orden va a la puerta A junto con los avisos; la decisión es de la persona.

## Guion

Antes de la puerta A, cuando ya hay guion y storyboard pero todavía no hay voz. `npm run video:critique -- content/<pieza> --guion` arma `out/video-critica-guion/` con:
- `guion.md`: lo que se oye y lo que se ve, escena por escena, con el segundo estimado en que empieza cada una;
- `storyboard.png`, si ya existe;
- el texto del post;
- el brief aparte (`paso-2-brief.md`).

Sirve para encontrar en el papel lo que después cuesta una voz, un render y una ronda de crítica: un repaso largo antes de lo nuevo, una lista que se estira, una parte que no responde al gancho. Los Reels del 27 de octubre de 2026 perdieron retención por eso.

- Lee el guion como si oyeras el video con los ojos en la pantalla. "Se ve" describe lo que habrá en pantalla: júzgalo como imagen, no como texto que se lee.
- Haz el paso 1 y el paso 2 igual que con el video.
- Califica solo los puntos que se juzgan en papel: Gancho, Tesis, Valor, Retención, Compartible, Cierre y CTA, y Voz y guion. Deja fuera Legibilidad y Recurso visual y composición: eso lo juzga el crítico del video. El promedio se calcula sobre los puntos calificados.
- En Retención, di el tramo exacto en que te irías ("de 0:13 a 0:45 repasa lo que el gancho da por sabido") y qué escenas lo forman.
- Los tres arreglos son del guion: qué frase sacar, qué escena acortar o mover, qué falta.
- No reescribas el guion: eso lo decide la persona.

El informe va a la puerta A junto con el orden de los ganchos.

## Quién critica

Jeremy decidió el 27 de octubre de 2026 usar Gemini por defecto, para no gastar la cuota de Claude, y pasar a Sonnet 5.5 si Gemini no llegaba al mínimo ([plan-consumo-y-tiempo.md](plan-consumo-y-tiempo.md), 1.3). La prueba con los dos Reels del 27, contra los informes de Opus, dio esto:

| Crítico | Modelo | Por qué |
|---|---|---|
| Del guion | Gemini 3.8 Flash: `video:critique --guion --gemini` | En los dos guiones marcó el tramo que Opus había marcado en el video: el repaso de `mcp-vs-acp` (0:15 a 0:46) y el desvío de `sistemas-de-archivos` (1:08 a 1:32) |
| Del video | Subagente `critico-ciego-video` (`.claude/agents/`), en Sonnet 5.5 | En los dos Reels encontró 2 de los 3 problemas principales de Opus y ningún puntaje se alejó más de 1 punto. Fue un poco más duro: 3,40 y 3,60, contra 3,75 y 4,05 |
| Gemini, en el video | No sirve como puerta | Es blando: dio 4,65 y 4,90, y habría aprobado `sistemas-de-archivos` para la puerta B cuando Opus y Sonnet lo rechazaban. Allí no vio el choque de etiquetas del gancho ni la desincronía de 1 s |

- `npm run video:critique -- content/<pieza> --gemini` le pasa la carpeta al crítico de `media.config.json → review` en un solo pedido. Gemini ve y oye `video.mp4` entero, así que no recibe las tiras.
- El informe queda en `informe.md` y su primera línea dice qué modelo lo escribió.
- En el video, `--gemini` queda como una segunda opinión que oye el audio, nunca como la que decide.

## Calibración

Es la misma idea que en el carrusel ([critico-ciego.md](critico-ciego.md)): el crítico sirve si califica como Jeremy.
- **Primero.** Jeremy califica de 6 a 10 Reels de cuentas que admira con [critica-video.md](critica-video.md). Las notas van en `skills/carrusel-taste/referencias/calibracion-video.json`, y los videos de terceros quedan fuera de git.
- **Mientras tanto.** Hasta que exista esa calibración, el informe es una señal más, no el veredicto.
- **Una vez al mes.** Se recalibra con los Reels publicados y sus métricas ([metricas-video.md](metricas-video.md)).
