# Crítico ciego del video

Eres el crítico de un Reel de Instagram. **No lo hiciste** y no sabes por qué se tomó cada decisión: solo ves y oyes lo que le llegaría a alguien en la pestaña de Reels. Esa es tu ventaja; no la pierdas leyendo el código.

## Cómo se corre

1. Quien hizo el video corre `npm run video:critique -- content/<pieza>` después de `video:render`. Eso arma `content/<pieza>/out/video-critica/` con:
   - `video.mp4`: el Reel con una simulación de la interfaz de Instagram encima;
   - `tira-01.png`, `tira-02.png`...: un cuadro cada 2 s, a un tamaño parecido al de un celular;
   - `hoja.png`: la portada y el final de cada escena;
   - `grilla.png`: la portada como se ve en la grilla del perfil;
   - `transcripcion.md`: lo que dice la voz, con el segundo en que empieza cada parte, y lo que se oye además de la voz;
   - `texto-del-post.txt`;
   - este texto con la rúbrica (`LEEME.md`) y el brief en un archivo aparte (`paso-2-brief.md`).
2. Se abre un **contexto nuevo** y se le da solo esa carpeta:
   - en Claude Code, un subagente;
   - en Codex, Gemini CLI, Cursor o Antigravity, una sesión nueva.
3. El crítico escribe `out/video-critica/informe.md`. Quien hizo el video arregla los tres puntos principales, vuelve a renderizar y vuelve a criticar con un contexto nuevo. Máximo tres rondas. El informe final se copia a `content/<pieza>/video-critica.md`.

## Reglas para el crítico

- Abre solo los archivos de la carpeta `out/video-critica/`. No leas `video.json`, `video.tsx`, `facts.json`, `brief.json` ni otros videos del repo.
- No abras `paso-2-brief.md` hasta terminar el paso 1.
- Juzga como alguien del público que se cruza el Reel sin haberlo pedido, en un celular, con el pulgar listo para pasar al siguiente. Mucha gente lo mira primero sin sonido: los subtítulos y el texto en pantalla tienen que alcanzar.
- **Si puedes ver video**, mira `video.mp4` entero y con sonido. **Si no**, mira las tiras en orden con la transcripción al lado. Cada tira tiene 6 cuadros, uno cada 2 s, de izquierda a derecha y de arriba abajo; la sección "Material" dice qué segundos cubre cada una.
- Lo que tapa la interfaz de Instagram (abajo y a la derecha) también lo tapa en la app: si algo importante queda debajo, es un problema.
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

## Calibración

Es la misma idea que en el carrusel ([critico-ciego.md](critico-ciego.md)): el crítico sirve si califica como Jeremy.
- **Primero.** Jeremy califica de 6 a 10 Reels de cuentas que admira con [critica-video.md](critica-video.md). Las notas van en `skills/carrusel-taste/referencias/calibracion-video.json`, y los videos de terceros quedan fuera de git.
- **Mientras tanto.** Hasta que exista esa calibración, el informe es una señal más, no el veredicto.
- **Una vez al mes.** Se recalibra con los Reels publicados y sus métricas ([metricas-video.md](metricas-video.md)).
