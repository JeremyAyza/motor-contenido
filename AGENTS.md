# AGENTS.md

Instrucciones para cualquier agente de código (Claude Code, Codex, Gemini CLI, Antigravity, Cursor) que trabaje en este repo. Es la fuente de verdad: si una skill o una regla de un agente lo contradice, manda este archivo.

## Qué es este repo

Un motor que produce contenido para la cuenta de Instagram @jacket.dev con dos flujos que comparten la marca:

| Flujo | Lo que escribe el agente | Salida | Qué leer |
|---|---|---|---|
| Reel | `content/<pieza>/video.json` (guion y puertas) y `video.tsx` (lo que se ve) | MP4 de 1080×1920, con Remotion | [docs/reel.md](docs/reel.md) |
| Carrusel | `content/<pieza>/facts.json`, `brief.json`, `post.json` y `slides.tsx` | PNG de 1080×1350 y textos | [docs/carrusel.md](docs/carrusel.md) |

**Al empezar, lee este archivo y la página de tu flujo, y nada más.** Si la pieza ya tiene `content/<pieza>/estado.md`, léelo también. Lo demás está en [docs/referencia/](docs/referencia/) y se abre solo para un detalle. Los planes en curso son el de [velocidad de los Reels](docs/plan-velocidad-reels.md) y su [rama experimental](docs/plan-experimental-reels.md); se leen solo para trabajar en ellos.

**Calidad antes que velocidad.** Cada pieza empieza por lo editorial: una tesis con ángulo, para un público concreto, con un objetivo (guardar, enviar o comentar). El diseño se piensa desde cero para su tema, sin plantillas de lámina. En el Reel, la biblioteca de escenas se mira solo después de congelar el guion visual ([docs/reel.md](docs/reel.md)).

## Reglas

1. **Datos con fuente.** Cada dato sale de `facts.json`, con su URL y la fecha en que se revisó. Lo que no tenga fuente primaria o de un referente de [docs/referencia/referentes.md](docs/referencia/referentes.md) no entra. Lo de un referente se escribe "Según <referente>", nunca como dato oficial.
2. **Lo reciente se investiga.** Si el tema es de los últimos 12 meses, lee la documentación oficial o el anuncio antes de escribir. No confíes en la memoria del modelo.
3. **No inventes** comandos, salidas de terminal, interfaces, versiones, cifras, casos ni testimonios. Lo ilustrativo se rotula "Ejemplo ilustrativo".
4. **Primero lo editorial.** Ningún `slides.tsx` sin un `brief.json` aprobado. Ningún `video.tsx` final ni ninguna voz sin el guion de `video.json` aprobado.
5. **Diseño propio por tema,** con [skills/carrusel-taste](skills/carrusel-taste/SKILL.md) y [docs/referencia/anti-slop.md](docs/referencia/anti-slop.md). Cada lámina o escena explica con un recurso visual de [recursos.json](skills/carrusel-taste/recursos.json), no solo con texto. El cierre lleva un solo CTA específico del tema, y la despedida cambia entre piezas ([cierres.json](skills/carrusel-taste/cierres.json)).
6. **Marcas fieles al original** (27 de octubre de 2026). Un logo o una mascota va con su archivo oficial, o de una fuente confiable (Simple Icons, kit de prensa, repositorio oficial), con `<Logo>` y el catálogo [assets/logos](assets/logos/README.md). El orden: oficial, librería, pedírselo a Jeremy, recrearlo idéntico. Una interfaz real (Claude Code, VS Code, Zed) se puede recrear igual a su versión actual; lo que muestra es real o lleva el rótulo de la regla 3. Nunca sugieras un patrocinio ni te burles de una marca.
7. **Dos puertas humanas.** Jeremy aprueba el guion o el brief en la **puerta A** y la pieza final en la **puerta B**. Solo su sí en el chat aprueba: el agente lo anota en `brief.json → puertaA` y `post.json → puertaB`, o en `video.json → gateA` y `gateB` (con el sha256 del video). Si Jeremy delega las puertas ("no me pidas aprobaciones"), se anotan con su frase en `notes`.
8. **Crítica ciega.** Quien diseña no se califica. La crítica la hace un contexto nuevo que solo ve la pieza terminada ([carrusel](docs/referencia/critico-ciego.md), [video](docs/referencia/critico-ciego-video.md)).
9. **El inspector manda.** Se corrigen todos los errores del render. Cada aviso es un error salvo que se pueda defender en una frase.
10. **Confidencialidad.** Nunca uses código, capturas, proyectos, clientes ni métricas del empleador de Jeremy.
11. **Estilo de texto:** español neutro, en la voz de [docs/referencia/voz.md](docs/referencia/voz.md), sin guiones largos (—), sin relleno, una afirmación por lámina o escena.
12. **Nada se publica sin que Jeremy lo pida,** y solo con la puerta B aprobada (`carrusel:publicar` o `video:publicar`). El agente corre los comandos, también el login. Jeremy escribe su usuario y su contraseña en la ventana de Chrome que abren: el agente nunca los escribe ni los pide. No se automatizan DMs, comentarios ni solicitudes.

## Cómo se trabaja

- **Un chat nuevo por pieza,** nunca a continuación de otra ni después de un `/compact`. El traspaso entre chats es `content/<pieza>/estado.md`, no la conversación. En el Reel, lo creativo va en esfuerzo extra alto y la producción en alto (`npm run video:fase` dice cuál toca).
- **Los cambios al motor** (paquetes, kit, inspector, comandos) van en su propia sesión y su propia rama, nunca a mitad de una pieza. Terminan con `npm test` y `npm run typecheck`. El commit, solo cuando Jeremy lo pide.
- **Lo mecánico se delega.** Un paso que cabe en una especificación cerrada (un margen, un tamaño, renombrar, extraer, auditar) va a `npm run agy` ([docs/referencia/agy.md](docs/referencia/agy.md)), en segundo plano, y lo que devuelve se comprueba con `git diff` y volviendo a correr la comprobación. El agente principal no escribe scripts de parches: en Claude Code, un hook (`.claude/hooks/sin-parches.mjs`) niega reescribir el `.tsx` de una pieza desde la terminal.
- **Código en inglés** (identificadores, archivos, comandos, flags, campos JSON y mensajes de CLI). Los docs, el contenido y las respuestas, en español. Lo viejo en español (`carrusel:*`, `brief.json`, `puertaA`) no se renombra por cuenta propia.
- **El repo es público.** No se commitea nada de terceros sin una licencia que permita redistribuirlo: va en un manifiesto, con su URL y su licencia, y el archivo se baja a una carpeta que git ignora.
- **Las claves** van en `.env` (ver `.env.example`) y las escribe Jeremy.

## Estructura

```
AGENTS.md                 este archivo
docs/reel.md              el Reel en una página
docs/carrusel.md          el carrusel en una página
docs/referencia/          lo que se abre para un detalle: kit de video, voz, rúbricas, críticos, referentes, anti-slop, métricas, radar, agy
docs/plan-*.md            los planes en curso
content/<pieza>/          una carpeta por pieza
accounts/                 firma de cada cuenta (usuario, glifo, voz)
assets/                   avatar, logos, objetos y catálogo de recursos de terceros (los archivos van a .cache/)
packages/brand/           firma, tipografías y tema de Tailwind por pieza
packages/carousel/        primitivas de @motor/ui, render, inspector, brief, crítica y CLI del carrusel
packages/video/           video con Remotion: kit y gramática de @motor/video, composición, inspector y CLI
packages/video/library/   biblioteca de escenas: fichas, candidatas e índice (README.md, generado)
packages/media/           voz, imágenes, música y efectos detrás de puertos, con caché
packages/publisher/       publica con Playwright y lleva publications.jsonl (sin imports de otros paquetes)
packages/tools/           npm run agy y npm run docs:check
scripts/                  medir-sesion.py
schemas/                  JSON Schema de post.json, brief.json, video.json y las métricas
skills/                   capas propias: carrusel-taste, ig-es y video-es
.agents/skills/           skills de terceros sin modificar: ig-* (MIT) y remotion-* (se instalan por máquina, fuera de git)
.claude/agents/           subagentes: buscador-fuentes, analista-referente y critico-ciego-video
```

## Comandos

Funcionan con npm (`npm run x -- arg`) y con pnpm. Requieren Node 20+, Python 3 (`python` o `py`) y ffmpeg. Los del Reel están en [docs/reel.md](docs/reel.md) y los del carrusel en [docs/carrusel.md](docs/carrusel.md).

```bash
npm install
npm test                                  # pruebas, incluida la de la documentación
npm run typecheck                         # todo el repo; para una pieza, ver docs/reel.md
npm run docs:check                        # enlaces rotos, tamaño del núcleo y documentos huérfanos
npm run agy -- <especificación.md> [--pieza content/<pieza>] [--plan]   # paso mecánico a Antigravity
npm run publisher -- status               # qué se publicó, dónde y cuándo
npm run py -- skills/ig-es/<script>.py    # corre un wrapper de ig-* con el Python que haya
python scripts/medir-sesion.py <transcripción.jsonl>   # tiempo, tokens, renders y llamadas a agy de una sesión
```

El render busca un navegador (el Chromium de Playwright, Chrome o Edge; `CHROME_PATH` fuerza uno). La primera vez, `video:prepare` baja whisper.cpp y Remotion baja su propio Chrome.

## Skills

Todas siguen el formato estándar (un `SKILL.md` con frontmatter).
- `skills/carrusel-taste/`: dirección de arte, para carruseles y Reels.
- `skills/ig-es/`: capa en español sobre las 13 skills `ig-*` de [instagram-agent-skill](.agents/instagram-agent-skill/ORIGEN.md) (MIT). Esas skills no se modifican ni se traducen: se usan a través de esta capa.
- `skills/video-es/`: capa sobre las 12 skills oficiales `remotion-*`, que no se modifican. Su repo no publica licencia, así que no se commitean: cada máquina las instala con `npx skills experimental_install`, que lee `skills-lock.json`.
