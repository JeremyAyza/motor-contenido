# AGENTS.md

Instrucciones para cualquier agente de código (Claude Code, Codex, Gemini CLI, Antigravity, Cursor) que trabaje en este repo. Son la única fuente de verdad: si una skill o regla de un agente contradice este archivo, manda este archivo.

## Qué es este repo

Un motor que produce contenido para Instagram con dos flujos independientes que comparten la marca:

| Flujo | Lo que escribe el agente | Salida | Guía |
|---|---|---|---|
| Carrusel | `content/<pieza>/facts.json`, `brief.json` (paso editorial), `post.json` (dirección de arte y texto del post) y `slides.tsx` (diseño libre) | PNG de 1080×1350 + textos | [workflows/carrusel.md](workflows/carrusel.md) |
| Video (en construcción) | `content/<pieza>/video.json` | MP4 de 1080×1920 | [workflows/video.md](workflows/video.md) |

Alrededor del carrusel hay dos flujos más: el [radar](workflows/radar.md) (qué temas se hacen) y las [métricas](workflows/metricas.md) (qué funcionó).

**Calidad antes que ahorro de tokens.** Cada carrusel empieza por lo editorial: una tesis con ángulo, para un público concreto, con un objetivo (guardar, enviar o comentar), que la persona aprueba antes del diseño. Después se diseña para su tema: no hay plantillas de lámina. Lo fijo es el marco semiconstante (pestaña de archivo, textura de puntos y firma), que toma el color de cada pieza. La dirección de arte, la paleta y las tipografías se eligen por pieza con la skill [carrusel-taste](skills/carrusel-taste/SKILL.md). El agente diseña con React y Tailwind usando las primitivas de `@motor/ui`, y los comandos validan, renderizan e inspeccionan.

## Reglas

1. **Datos con fuente.** Cada dato de una pieza sale de `facts.json`, y cada hecho tiene su URL y la fecha en que se revisó. Lo que no tenga fuente primaria o de un referente de [docs/referentes.md](docs/referentes.md) no entra en la pieza. Lo de un referente se escribe "Según <referente>" y nunca se presenta como dato oficial.
2. **Lo reciente se investiga.** Si el tema es de los últimos 12 meses, lee la documentación oficial o el anuncio antes de escribir. No confíes en la memoria del modelo.
3. **No inventes** comandos, salidas de terminal, interfaces, versiones, cifras, casos ni testimonios. Lo ilustrativo se marca como ilustrativo.
4. **Primero lo editorial.** Ningún `slides.tsx` se escribe sin un `brief.json` aprobado: tesis, público, objetivo, ganchos, esqueleto y CTA ([workflows/carrusel.md](workflows/carrusel.md), pasos 4 a 6).
5. **Diseño propio por tema** con [skills/carrusel-taste](skills/carrusel-taste/SKILL.md) y [docs/anti-slop.md](docs/anti-slop.md). La última lámina es una despedida que cierra la portada, con un solo CTA específico del tema.
6. **Ancla visual con archivos reales.** Logos oficiales con `<Logo>` (Simple Icons), capturas reales o íconos genéricos. Nunca dibujes ni imites logos, mascotas o personajes de marcas.
7. **Dos puertas humanas.** La persona aprueba el brief en la **puerta A**, antes del diseño, y la pieza final en la **puerta B**. Solo el sí de la persona en el chat aprueba; el agente lo anota en `brief.json → puertaA`.
8. **Crítica ciega.** Quien diseña no se califica. La crítica la hace un contexto nuevo que solo ve las láminas y el texto ([docs/critico-ciego.md](docs/critico-ciego.md)).
9. **El inspector manda.** Corrige todos los errores del render; cada aviso es un error salvo que lo puedas defender en una frase.
10. **Confidencialidad.** Nunca uses código, capturas, proyectos, clientes ni métricas del empleador de la persona.
11. **Estilo de texto:** español neutro, en la voz de [docs/voz.md](docs/voz.md), sin guiones largos (—), sin frases de relleno, una afirmación por lámina.
12. **Nada se publica ni se envía solo.** Las skills escriben; la persona publica. No se automatizan DMs ni solicitudes, y no se inicia sesión en Instagram por la persona.

## Contexto

El porqué de las decisiones, el estado y los próximos pasos están en [docs/contexto.md](docs/contexto.md). Léelo al empezar un chat nuevo. El plan de mejoras del contenido está en [docs/plan-carrusel-9-5.md](docs/plan-carrusel-9-5.md).

## Estructura

```
.agents/skills/           skills de Instagram de instagram-agent-skill (MIT), sin modificar
.agents/instagram-agent-skill/  licencia, README y plantilla de ese paquete
accounts/                 firma de cada cuenta (usuario, glifo, voz)
assets/avatar/            sprites del avatar y su manifiesto
docs/                     anti-slop, rúbrica, crítico ciego, voz, referentes, aprendizajes, métricas
skills/carrusel-taste/    dirección de arte: las 12 direcciones, el proceso y referencias visuales
skills/ig-es/             capa sobre .agents/skills: léxico, ganchos y wrappers en español
packages/brand/           firma, catálogo de tipografías y tema de Tailwind por pieza
packages/carousel/src/ui  primitivas: Slide, Logo, Icono, Img, Code, Window, Prompt, Nota
packages/carousel/src     render, inspector, brief, crítica, métricas y CLI del carrusel
packages/video/           flujo de video (en construcción)
schemas/                  JSON Schema de post.json, brief.json y metricas.json
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
npm run carrusel:logo -- <marca>          # slug y color oficial en Simple Icons
npm run carrusel:render -- content/<pieza>   # láminas, inspector y revisión de textos
npm run carrusel:texto -- content/<pieza> # solo la revisión de textos
npm run carrusel:critica -- content/<pieza> # carpeta para el crítico ciego
npm run carrusel:metricas                 # informe en docs/metricas.md
npm run carrusel:swipe -- docs/swipe/<mes>.tsv # carruseles de referencia en docs/swipe.md
npm run carrusel:esquema                  # regenera schemas/
npm run py -- skills/ig-es/<script>.py    # corre un wrapper con el Python que haya
npm run typecheck
```

El render busca solo un navegador (el Chromium de Playwright que pide el repo, otro Chromium de Playwright instalado, o Chrome/Edge). `CHROME_PATH` fuerza uno; `npx playwright install chromium` instala el exacto.

## Skills

Todas siguen el formato estándar (un `SKILL.md` con frontmatter). Si tu agente carga skills, apúntalo a `skills/` y a `.agents/skills/`; si no, léelas como cualquier documento.

- `skills/carrusel-taste/`: dirección de arte. Adapta a carruseles los principios de [Taste](https://github.com/Leonxlnx/taste-skill) (MIT), sin lo que es de páginas web.
- `.agents/skills/ig-*`: las 13 skills de [instagram-agent-skill](.agents/instagram-agent-skill/ORIGEN.md) (MIT), **sin modificar**. Úsalas siempre a través de [skills/ig-es](skills/ig-es/SKILL.md), que dice qué cambia en este repo (español, rutas, reglas del carrusel) y corre sus scripts con wrappers. Nunca edites las originales.

Ante cualquier conflicto, manda este archivo.
