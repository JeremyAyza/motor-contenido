# Logos oficiales que Simple Icons no tiene

`<Logo slug="...">` busca primero en Simple Icons y, si no está, en el catálogo de recursos de terceros, [assets/catalog.json](../catalog.json), en las entradas con `type: "logo"`. Esta carpeta solo trae esta guía: los archivos no se commitean, porque el repo es público. Se bajan a `.cache/assets/` y se verifican con su `sha256`, igual que los efectos.

## De dónde sale un logo (regla 6 de AGENTS.md)

En este orden:
1. **El archivo oficial:** el kit de prensa, la página de marca o el repositorio del proyecto.
2. **Una fuente confiable**, si el oficial no tiene un enlace directo a un SVG o un PNG:
   - [LobeHub Icons](https://github.com/lobehub/lobe-icons) (MIT, en npm como `@lobehub/icons-static-svg`);
   - [selfh.st/icons](https://selfh.st/icons/) (CC BY 4.0, con crédito);
   - [Dashboard Icons](https://github.com/homarr-labs/dashboard-icons).
3. **Si no hay archivo** y recrearlo es muy difícil, se le pide a la persona que lo agregue. Si no, se recrea idéntico al original.

## Agregar uno

```bash
npm run carrusel:logo -- add slack --url https://cdn.jsdelivr.net/gh/selfhst/icons/svg/slack.svg --title Slack --source https://api.slack.com/brand-guidelines --author "Slack Technologies (Salesforce)" --license "CC BY 4.0 (selfh.st/icons); marca registrada de Slack, uso nominativo" --attribution "Icono de selfh.st/icons (CC BY 4.0)"
```

El comando baja el archivo, le calcula el hash, lo suma al catálogo con la fecha y lo deja en `.cache/assets/<id>.svg`. Ábrelo antes de usarlo: tiene que ser el oficial, sin deformar. `--source` es la página con las reglas de uso de la marca. `npm run carrusel:logo -- <marca>` busca en los dos lugares.

En el render, el carrusel y `video:prepare` (y `video:storyboard`) bajan los que falten en la caché. En el video quedan copiados en la carpeta pública (`out/video/logos/`).

## Cómo se dibuja

Los logos del catálogo van como imagen (`<img>`), así que un SVG nunca corre código. Los que son negros o de un solo color oscuro (OpenAI, Goose, OpenCode) necesitan una ficha clara (`chip`), como GitHub en Simple Icons.

## Los que hay (27 de octubre de 2026)

| id | Marca | De dónde |
|---|---|---|
| `openai` | OpenAI | LobeHub Icons (MIT) |
| `goose` | Goose (Block) | LobeHub Icons (MIT) |
| `slack` | Slack | selfh.st/icons (CC BY 4.0) |
| `zed` | Zed | selfh.st/icons (CC BY 4.0) |
| `t3-code` | T3 Code | selfh.st/icons (CC BY 4.0) |
| `opencode` | OpenCode | Dashboard Icons |
