# AGENTS.md

Instrucciones para cualquier agente de código (Claude Code, Codex, Gemini CLI, Antigravity, Cursor) que trabaje en este repo. Son la única fuente de verdad: si una skill o regla de un agente contradice este archivo, manda este archivo.

## Qué es este repo

Un motor que produce contenido para Instagram con dos flujos independientes que comparten la marca:

| Flujo | Lo que escribe el agente | Salida | Guía |
|---|---|---|---|
| Carrusel | `content/<pieza>/facts.json`, `brief.json` (paso editorial), `post.json` (dirección de arte y texto del post) y `slides.tsx` (diseño libre) | PNG de 1080×1350 + textos | [workflows/carrusel.md](workflows/carrusel.md) |
| Video (en construcción) | `content/<pieza>/video.json` (guion y puertas) y `video.tsx` (lo que se ve) | MP4 de 1080×1920, con Remotion | [workflows/video.md](workflows/video.md) |

Alrededor del carrusel hay dos flujos más: el [radar](workflows/radar.md) (qué temas se hacen) y las [métricas](workflows/metricas.md) (qué funcionó).

**Calidad antes que ahorro de tokens.** Cada carrusel empieza por lo editorial: una tesis con ángulo, para un público concreto, con un objetivo (guardar, enviar o comentar), que la persona aprueba antes del diseño. Después se diseña para su tema: no hay plantillas de lámina. Lo fijo es el marco semiconstante (pestaña de archivo, textura de puntos y firma), que toma el color de cada pieza. La dirección de arte, la paleta y las tipografías se eligen por pieza con la skill [carrusel-taste](skills/carrusel-taste/SKILL.md). El agente diseña con React y Tailwind usando las primitivas de `@motor/ui`, y los comandos validan, renderizan e inspeccionan.

## Reglas

1. **Datos con fuente.** Cada dato de una pieza sale de `facts.json`, y cada hecho tiene su URL y la fecha en que se revisó. Lo que no tenga fuente primaria o de un referente de [docs/referentes.md](docs/referentes.md) no entra en la pieza. Lo de un referente se escribe "Según <referente>" y nunca se presenta como dato oficial.
2. **Lo reciente se investiga.** Si el tema es de los últimos 12 meses, lee la documentación oficial o el anuncio antes de escribir. No confíes en la memoria del modelo.
3. **No inventes** comandos, salidas de terminal, interfaces, versiones, cifras, casos ni testimonios. Lo ilustrativo se marca como ilustrativo.
4. **Primero lo editorial.** Ningún `slides.tsx` se escribe sin un `brief.json` aprobado: tesis, público, objetivo, ganchos, esqueleto y CTA ([workflows/carrusel.md](workflows/carrusel.md), pasos 4 a 6). En video, ningún `video.tsx` ni ninguna voz sin el guion de `video.json` aprobado ([workflows/video.md](workflows/video.md)).
5. **Diseño propio por tema** con [skills/carrusel-taste](skills/carrusel-taste/SKILL.md) y [docs/anti-slop.md](docs/anti-slop.md). Cada lámina interior explica con un recurso visual de [recursos.json](skills/carrusel-taste/recursos.json) (diagrama, dato, metáfora, captura), no solo con texto. La última lámina es una despedida que cierra la portada, con un solo CTA específico del tema.
6. **Marcas, fieles al original.** Un logo o una mascota va con su archivo oficial, o con uno de una fuente confiable: Simple Icons, el kit de prensa, el repositorio oficial o una librería, a través de `<Logo>` y del catálogo [assets/logos](assets/logos/README.md). Si no hay archivo y recrearlo es muy difícil, pídele a la persona que lo agregue. Si no, recréalo idéntico al original y sin deformarlo. Una interfaz real (Claude Code, Zed, VS Code, T3 Code) se puede recrear para explicarla, igual a su versión actual. Lo que muestra por dentro es real, o lleva el rótulo "Ejemplo ilustrativo" (regla 3). Nunca sugieras un patrocinio ni uses una marca para burlarte de ella. Decidido con Jeremy el 27 de octubre de 2026 ([docs/plan-sin-limites.md](docs/plan-sin-limites.md)).
7. **Dos puertas humanas.** La persona aprueba el brief en la **puerta A**, antes del diseño, y la pieza final en la **puerta B**. Solo el sí de la persona en el chat aprueba; el agente lo anota en `brief.json → puertaA` y en `post.json → puertaB`. En video, el guion y el video final van en `video.json → gateA` y `gateB`, y la puerta B guarda el sha256 del video aprobado.
8. **Crítica ciega.** Quien diseña no se califica. La crítica la hace un contexto nuevo que solo ve las láminas y el texto ([docs/critico-ciego.md](docs/critico-ciego.md)). En video, ve las tiras de cuadros, el video con la interfaz de Instagram y lo que se oye ([docs/critico-ciego-video.md](docs/critico-ciego-video.md)).
9. **El inspector manda.** Corrige todos los errores del render; cada aviso es un error salvo que lo puedas defender en una frase.
10. **Confidencialidad.** Nunca uses código, capturas, proyectos, clientes ni métricas del empleador de la persona.
11. **Estilo de texto:** español neutro, en la voz de [docs/voz.md](docs/voz.md), sin guiones largos (—), sin frases de relleno, una afirmación por lámina.
12. **Nada se publica sin que la persona lo pida.** Las skills escriben. Publicar es un paso opcional: solo con `carrusel:publicar` o `video:publicar`, solo cuando la persona lo pide en el chat y solo con la puerta B aprobada ([workflows/carrusel.md](workflows/carrusel.md), paso 14; [workflows/video.md](workflows/video.md), paso 9). El agente corre los comandos. La persona escribe su usuario y su contraseña en la ventana de Chrome que abren: el agente nunca los escribe ni los pide. No se automatizan DMs, comentarios ni solicitudes.

## Contexto

El porqué de las decisiones, el estado y los próximos pasos están en [docs/contexto.md](docs/contexto.md). Léelo al empezar un chat nuevo. Hay cuatro planes:
- el de mejoras del contenido, en [docs/plan-carrusel-9-5.md](docs/plan-carrusel-9-5.md);
- el de recursos visuales y movimiento, en [docs/plan-visuales.md](docs/plan-visuales.md);
- el de videos, en [docs/plan-videos.md](docs/plan-videos.md);
- el de jacket.dev en piloto automático (escenario con cámara, kit del mundo, avatar y rutina semanal), en [docs/plan-piloto-automatico.md](docs/plan-piloto-automatico.md).

**Para cualquier Reel manda [docs/direccion-reels.md](docs/direccion-reels.md)** sobre esos planes: motion graphics plano con cámara dinámica por defecto, 3D solo si Jeremy lo pide, de 45 a 60 s, voz de ElevenLabs y música baja. Nada de esa página cambia sin el sí de Jeremy.

## Estructura

```
.agents/skills/           skills de Instagram de instagram-agent-skill (MIT), sin modificar; y las de Remotion, instaladas por máquina (fuera de git)
.agents/instagram-agent-skill/  licencia, README y plantilla de ese paquete
accounts/                 firma de cada cuenta (usuario, glifo, voz)
assets/avatar/            sprites del avatar y su manifiesto
assets/catalog.json       recursos de terceros para los videos (efectos, música), con fuente y licencia; los archivos van a .cache/
docs/                     anti-slop, rúbrica, crítico ciego, voz, referentes, aprendizajes, métricas
skills/carrusel-taste/    dirección de arte: las 12 direcciones, el proceso y referencias visuales
skills/ig-es/             capa sobre .agents/skills: léxico, ganchos y wrappers en español
packages/brand/           firma, catálogo de tipografías y tema de Tailwind por pieza
packages/carousel/src/ui  primitivas: Slide, Logo, Icono, Img, Code, Window, Prompt, Nota; recursos visuales (Proceso, Barras, Cifra, Escala, Linea, Matriz, Boceto, Objeto, Flecha, Etiqueta) y movimiento (Anim, Cuenta)
assets/objetos/           objetos de Fluent Emoji (MIT) para metáforas, bajados con carrusel:objeto
packages/carousel/src     render, inspector, brief, crítica, métricas y CLI del carrusel
packages/publisher/       CLI que publica con Playwright y lleva publications.jsonl (código en inglés, sin imports de otros paquetes)
packages/media/           voz, imágenes, música y búsqueda de efectos detrás de puertos (adaptadores de Gemini, Openverse y Freesound), alineación con whisper y catálogo de recursos (código en inglés)
media.config.json         proveedor y modelo de imágenes y música, y bibliotecas de efectos
packages/video/           video con Remotion: composición, Studio y render (código en inglés)
skills/video-es/          capa sobre las skills oficiales de Remotion: qué cambia en este repo
schemas/                  JSON Schema de post.json, brief.json, metricas.json, video.json, video-metrics.json y captures.json
workflows/                guías paso a paso: carrusel, radar, métricas, video
content/                  una carpeta por pieza
```

## Comandos

Funcionan con npm (`npm run x -- arg`) y con pnpm (`pnpm x arg`). Requieren Node 20+ y Python 3 (para las skills `ig-*`).

```bash
pnpm install                              # o npm install
npm run carrusel:nuevo -- <tema>          # crea content/<fecha>-<tema>/ con brief.json
npm run carrusel:brief -- content/<pieza> # filtra ganchos y arma la puerta A
npm run carrusel:baraja -- --cuenta dev   # reparte 3 direcciones de arte
npm run carrusel:logo -- <marca>          # slug y color oficial en Simple Icons y en el catálogo
npm run carrusel:logo -- add <id> --url <svg> --title <marca> --source <página> --author <dueño>  # logo oficial que Simple Icons no tiene (assets/logos)
npm run carrusel:objeto -- <nombre>       # objeto de Fluent Emoji para una metáfora (nombre en inglés)
npm run carrusel:render -- content/<pieza>   # láminas, inspector y revisión de textos
npm run carrusel:texto -- content/<pieza> # solo la revisión de textos
npm run carrusel:critica -- content/<pieza> # carpeta para el crítico ciego
npm run carrusel:publicar -- content/<pieza> [--ensayo] # publica (solo si la persona lo pide, con la puerta B)
npm run publisher -- status               # qué se publicó, dónde y cuándo (packages/publisher/README.md)
npm run carrusel:metricas                 # informe en docs/metricas.md
npm run carrusel:swipe -- docs/swipe/<mes>.tsv # carruseles de referencia en docs/swipe.md
npm run carrusel:esquema                  # regenera schemas/
npm run video:baraja -- content/<pieza>   # reparte 3 direcciones de arte para video.json → art
npm run video:script -- content/<pieza>   # revisa video.json (con hookscore y beats de ig-reel) y arma la puerta A
npm run video:capture -- content/<pieza>  # corre los comandos de captures.json y guarda su salida real
npm run video:storyboard -- content/<pieza> # los visuales sin voz, para la puerta A
npm run video:prepare -- content/<pieza>  # voz, tiempos por palabra y archivos (pide la puerta A)
npm run video:studio -- content/<pieza>   # vista previa en Remotion Studio
npm run video:render -- content/<pieza>   # MP4 1080×1920, hoja de revisión y sha256 para la puerta B
npm run video:critique -- content/<pieza> # carpeta para el crítico ciego del video
npm run video:publicar -- content/<pieza> [--ensayo] # publica el Reel (solo si la persona lo pide, con la puerta B)
npm run video:metrics                     # informe de los Reels en docs/metricas-video.md
npm run video:image -- content/<pieza> --name <n> --prompt "..." [--chroma]  # imagen generada (generated.json)
npm run video:music -- content/<pieza> --name <n> --prompt "..."            # música de fondo generada
npm run video:asset -- search "<consulta>"  # efectos CC0 (catálogo, Openverse, Freesound); add <bib>:<id> --id <n>
npm run video:voices                      # prueba a ciegas de voces de Gemini
npm run video:schema                      # regenera schemas/video.schema.json, video-metrics.schema.json y captures.schema.json
npm run py -- skills/ig-es/<script>.py    # corre un wrapper con el Python que haya
npm run typecheck
npm test
```

El render busca solo un navegador (el Chromium de Playwright que pide el repo, otro Chromium de Playwright instalado, o Chrome/Edge). `CHROME_PATH` fuerza uno; `npx playwright install chromium` instala el exacto. Las láminas animadas además necesitan ffmpeg (`winget install Gyan.FFmpeg`, o `FFMPEG_PATH`).

Los videos necesitan ffmpeg y `GEMINI_API_KEY` en `.env` (ver `.env.example`; la escribe la persona). La primera vez, `video:prepare` baja whisper.cpp y su modelo (unos 500 MB) a `.cache/`, y Remotion baja su propio Chrome.

## Skills

Todas siguen el formato estándar (un `SKILL.md` con frontmatter). Si tu agente carga skills, apúntalo a `skills/` y a `.agents/skills/`; si no, léelas como cualquier documento.

- `skills/carrusel-taste/`: dirección de arte. Adapta a carruseles los principios de [Taste](https://github.com/Leonxlnx/taste-skill) (MIT), sin lo que es de páginas web.
- `.agents/skills/ig-*`: las 13 skills de [instagram-agent-skill](.agents/instagram-agent-skill/ORIGEN.md) (MIT), **sin modificar**. Úsalas siempre a través de [skills/ig-es](skills/ig-es/SKILL.md), que dice qué cambia en este repo (español, rutas, reglas del carrusel) y corre sus scripts con wrappers. Nunca edites las originales.
- `.agents/skills/remotion-*` y `.claude/skills/remotion-*`: las 12 skills oficiales de Remotion, **sin modificar**. Su repo no publica licencia y este repo es público, así que no se commitean: cada máquina las instala con `npx skills experimental_install`, que lee `skills-lock.json`. Úsalas siempre a través de [skills/video-es](skills/video-es/SKILL.md).

Ante cualquier conflicto, manda este archivo.
