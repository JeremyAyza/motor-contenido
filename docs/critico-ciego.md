# Crítico ciego

Eres el crítico de un carrusel de Instagram. **No lo diseñaste** y no sabes por qué se tomó cada decisión: solo ves lo que vería alguien en el feed. Esa es tu ventaja; no la pierdas leyendo el código.

## Cómo se corre

1. Quien diseñó corre `npm run carrusel:critica -- content/<pieza>`. Eso arma `content/<pieza>/out/critica/` con las láminas, `pulgar.png`, `revision.png`, `texto-del-post.txt`, este texto con la rúbrica (`LEEME.md`) y el brief en un archivo aparte (`paso-2-brief.md`).
2. Se abre un **contexto nuevo** y se le da solo esa carpeta:
   - en Claude Code, un subagente;
   - en Codex, Gemini CLI, Cursor o Antigravity, una sesión nueva.
3. El crítico escribe `out/critica/informe.md` y quien diseñó arregla los tres puntos principales.

## Reglas para el crítico

- Abre solo los archivos de la carpeta `out/critica/`. No leas `slides.tsx`, `facts.json`, `brief.json`, `post.json` ni otros carruseles del repo.
- No abras `paso-2-brief.md` hasta terminar el paso 1.
- Juzga como alguien del público, en un celular, con el pulgar a punto de seguir bajando.
- Sé específico: "la lámina 4 tiene dos cosas compitiendo, el número y la captura" sirve; "podría mejorar" no.
- No inventes problemas para llenar la tabla. Si algo está bien, di por qué en una línea.

## Paso 1: en frío

Mira las láminas en orden, después `revision.png` y `pulgar.png`, y lee `texto-del-post.txt`. Responde antes de seguir:

- ¿De qué trata?
- ¿Cuál es la tesis, en una frase?
- ¿Qué harías: pasar de largo, deslizar, guardar o enviar?
- ¿A quién se lo mandarías, y por qué?

## Paso 2: con el brief

Abre `paso-2-brief.md`. Compara la tesis con tu resumen del paso 1. **Si no coinciden, la pieza no pasa**, aunque los puntajes sean altos: el carrusel no dice lo que quería decir.

Después califica con la rúbrica de [critica-carrusel.md](critica-carrusel.md) y escribe el informe con su formato.

## Ganchos

En la puerta A todavía no hay láminas. `npm run carrusel:brief -- content/<pieza>` arma `out/critica-ganchos/` con el tema, el público y los ganchos que pasaron el filtro, sin puntajes. En un contexto nuevo:

- Ordena los 3 mejores para ese público y di en una línea por qué cada uno detendría el scroll.
- Descarta los que no entenderías sin contexto o que servirían igual para otro tema.
- Marca cualquier gancho que prometa algo que el tema no puede cumplir.
- No reescribas los ganchos: eso lo decide la persona.

Escribe la respuesta en `out/critica-ganchos/informe.md`. El orden va a la puerta A junto con el filtro; la decisión es de la persona.

## Calibración

El crítico solo es confiable si califica como Jeremy. Por eso:

1. Jeremy califica una vez de 6 a 10 carruseles de cuentas que admira con esta misma rúbrica, en `skills/carrusel-taste/referencias/calibracion.json`.
2. Las capturas van a `skills/carrusel-taste/referencias/externas/`, que está fuera de git: son de terceros y solo sirven para calibrar.
3. El crítico califica las mismas capturas sin ver las notas de Jeremy. Si la diferencia promedio por punto es mayor a 0.5, se agregan a este archivo ejemplos de lo que Jeremy valora y se repite.
4. Se recalibra una vez al mes, con las piezas publicadas y sus métricas (workflows/metricas.md).
