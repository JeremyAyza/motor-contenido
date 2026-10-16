# motor-contenido

Motor para producir carruseles y videos de Instagram con IA, con calidad editorial y sin depender de un agente o proveedor en particular.

- **Carrusel:** JSON validado → plantillas HTML/CSS de marca → PNG de 1080×1350. Sin voz.
- **Video (en construcción):** guion → voz con adaptadores por proveedor → Remotion → MP4 de 1080×1920.
- **Marca compartida** en `accounts/` y `packages/brand/`; avatar en `assets/avatar/`.
- **Agnóstico al agente:** las reglas viven en [AGENTS.md](AGENTS.md) y los pasos en [workflows/](workflows/).

## Empezar

```bash
npm install
npx playwright install chromium
npm run carrusel:render -- content/2026-10-16-mods-claude-code/carousel.json
```

Las láminas quedan en `content/2026-10-16-mods-claude-code/out/`. Para usar un Chrome ya instalado en vez del de Playwright, define `CHROME_PATH`.

## Pieza de ejemplo

`content/2026-10-16-mods-claude-code/`: ficha con fuentes (`facts.json`) y carrusel de 6 láminas (`carousel.json`) sobre los mods de Claude Code, con datos del anuncio oficial del 1 de octubre de 2026.
