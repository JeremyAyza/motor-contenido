# motor-contenido

Motor para producir carruseles y videos de Instagram con IA, con calidad editorial y sin depender de un agente o proveedor en particular.

- **Carrusel:** el agente investiga, define una idea propia del tema y diseña cada lámina con React y Tailwind. El render las convierte en PNG de 1080×1350 e inspecciona legibilidad, contraste y señales de diseño genérico.
- **Video (en construcción):** guion, voz con adaptadores por proveedor, Remotion y MP4 de 1080×1920.
- **Marca compartida** en `accounts/` y `packages/brand/`; avatar en `assets/avatar/`.
- **Agnóstico al agente:** las reglas viven en [AGENTS.md](AGENTS.md) y los pasos en [workflows/](workflows/).

## Empezar

```bash
npm install
npx playwright install chromium
npm run carrusel:render -- content/2026-10-16-mods-claude-code
```

Las láminas quedan en `content/2026-10-16-mods-claude-code/out/`. Para usar un Chrome ya instalado en vez del de Playwright, define `CHROME_PATH`.

## Un carrusel nuevo

Abre tu agente en el repo y pídelo en una línea:

> Sigue workflows/carrusel.md y genera un carrusel para la cuenta dev sobre **[tema]**. Muéstrame la ficha, la idea y la hoja de revisión antes de darlo por terminado.

## Pieza de ejemplo

`content/2026-10-16-mods-claude-code/`: ficha con fuentes, idea, diseño (`slides.tsx`) y crítica final de un carrusel de 6 láminas sobre los mods de Claude Code.
