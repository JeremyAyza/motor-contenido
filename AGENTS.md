# AGENTS.md

Instrucciones para cualquier agente de código (Claude Code, Codex, Gemini CLI, Antigravity, Cursor) que trabaje en este repo. Son la única fuente de verdad: si una skill o regla de un agente contradice este archivo, manda este archivo.

## Qué es este repo

Un motor que produce contenido para Instagram con dos flujos independientes que comparten la marca:

| Flujo | Lo que escribe el agente | Salida | Guía |
|---|---|---|---|
| Carrusel | `content/<pieza>/facts.json`, `post.json` y `slides.tsx` (diseño libre) | PNG de 1080×1350 + textos | [workflows/carrusel.md](workflows/carrusel.md) |
| Video (en construcción) | `content/<pieza>/video.json` | MP4 de 1080×1920 | [workflows/video.md](workflows/video.md) |

**Calidad antes que ahorro de tokens.** Cada carrusel se diseña para su tema: no hay plantillas de lámina. Lo fijo es la marca (pie con la firma, colores y tipografías del tema). El agente diseña con React y Tailwind usando las primitivas de `@motor/ui`, y los comandos validan, renderizan e inspeccionan.

## Reglas

1. **Datos con fuente.** Cada dato de una pieza sale de `facts.json`, y cada hecho tiene su URL y la fecha en que se revisó. Lo que no tenga fuente primaria no entra en la pieza.
2. **Lo reciente se investiga.** Si el tema es de los últimos 12 meses, lee la documentación oficial o el anuncio antes de escribir. No confíes en la memoria del modelo.
3. **No inventes** comandos, salidas de terminal, interfaces, versiones, cifras ni testimonios. Lo ilustrativo se marca como ilustrativo.
4. **Diseño propio por tema** siguiendo [docs/anti-slop.md](docs/anti-slop.md). Mira lo que renderizaste y critícalo con [docs/critica-carrusel.md](docs/critica-carrusel.md) antes de mostrarlo.
5. **Puerta humana.** Antes de dar una pieza por terminada, la persona aprueba la ficha, la idea y las láminas.
6. **El inspector manda.** Corrige todos los errores del render; cada aviso es un error salvo que lo puedas defender en una frase.
7. **Confidencialidad.** Nunca uses código, capturas, proyectos, clientes ni métricas del empleador de la persona.
8. **Estilo de texto:** español neutro, sin guiones largos (—), sin frases de relleno, una afirmación por lámina.

## Estructura

```
accounts/                 marca de cada cuenta (colores, tipografías, usuario, voz)
assets/avatar/            sprites del avatar y su manifiesto
docs/                     reglas anti-slop y rúbrica de crítica
packages/brand/           marca, tipografías y tema de Tailwind (compartido)
packages/carousel/src/ui  primitivas: Slide, Code, Window, Img, Prompt
packages/carousel/src     render, inspector y CLI del carrusel
packages/video/           flujo de video (en construcción)
schemas/                  JSON Schema de post.json
workflows/                guías paso a paso de cada flujo
content/                  una carpeta por pieza
```

## Comandos

```bash
npm install
npx playwright install chromium        # una vez, o define CHROME_PATH
npm run carrusel:nuevo -- <tema>       # crea content/<fecha>-<tema>/
npm run carrusel:render -- content/<pieza>
npm run carrusel:esquema               # regenera schemas/post.schema.json
npm run typecheck
```

## Lectura opcional

Si tu agente admite skills, la skill de diseño [Taste](https://github.com/Leonxlnx/taste-skill) (`npx skills add Leonxlnx/taste-skill --skill design-taste-frontend`) amplía el criterio visual. Está pensada para páginas web: sus pasos de navegación, animación y búsqueda de fotos no aplican a un carrusel. Ante cualquier conflicto, mandan `docs/anti-slop.md` y este archivo.
