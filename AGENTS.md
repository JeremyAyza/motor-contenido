# AGENTS.md

Instrucciones para cualquier agente de código (Claude Code, Codex, Gemini CLI, Antigravity, Cursor) que trabaje en este repo. Son la única fuente de verdad: si una skill o regla de un agente contradice este archivo, manda este archivo.

## Qué es este repo

Un motor que produce contenido para Instagram con dos flujos independientes que comparten la marca:

| Flujo | Entrada | Salida | Guía |
|---|---|---|---|
| Carrusel | `content/<fecha>-<tema>/carousel.json` | PNG de 1080×1350 + textos | [workflows/carrusel.md](workflows/carrusel.md) |
| Video (en construcción) | `content/<fecha>-<tema>/video.json` | MP4 de 1080×1920 | [workflows/video.md](workflows/video.md) |

El agente piensa (investiga, redacta, elige escenas) y los comandos ejecutan (validan y renderizan). El agente **nunca** escribe HTML, CSS ni código de render para una pieza: solo escribe el JSON que cumple el esquema.

## Reglas

1. **Datos con fuente.** Cada dato de una pieza sale de `facts.json`, y cada hecho tiene su URL y la fecha en que se revisó. Lo que no tenga fuente primaria no entra en la pieza.
2. **Lo reciente se investiga.** Si el tema es de los últimos 12 meses, lee la documentación oficial o el anuncio antes de escribir. No confíes en la memoria del modelo.
3. **No inventes** comandos, salidas de terminal, versiones, cifras ni testimonios.
4. **Puerta humana.** Antes de renderizar la versión final, la persona aprueba `facts.json` y el JSON de la pieza.
5. **Valida siempre.** Ejecuta el comando de validación y corrige todos los errores; los avisos se reportan a la persona.
6. **Confidencialidad.** Nunca uses código, capturas, proyectos, clientes ni métricas del empleador de la persona.
7. **Estilo de texto:** español neutro, sin guiones largos (—), sin frases de relleno ("potenciar", "sumérgete", "al siguiente nivel"), una idea por lámina.

## Estructura

```
accounts/            marca de cada cuenta (colores, tipografías, usuario, voz)
assets/avatar/       sprites del avatar y su manifiesto
packages/brand/      carga de marca y tipografías (compartido)
packages/carousel/   esquema, plantillas, validación y render del carrusel
packages/video/      flujo de video (en construcción)
schemas/             JSON Schema exportado de cada contrato
workflows/           guías paso a paso de cada flujo
content/             una carpeta por pieza
```

## Comandos

```bash
npm install
npx playwright install chromium        # una vez, o define CHROME_PATH
npm run carrusel:validar -- content/<pieza>/carousel.json
npm run carrusel:render  -- content/<pieza>/carousel.json
npm run carrusel:esquema               # regenera schemas/carousel.schema.json
npm run typecheck
```
