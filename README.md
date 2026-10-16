# motor-contenido

Motor para producir carruseles y videos de Instagram con IA, con calidad editorial y sin depender de un agente o proveedor en particular.

- **Carrusel:** el agente investiga, define una idea propia del tema, recibe 3 direcciones de arte de una baraja de 12 y diseña cada lámina con React y Tailwind. El render las convierte en PNG de 1080×1350 e inspecciona legibilidad, contraste, el ancla visual de la portada y señales de diseño genérico.
- **Video (en construcción):** guion, voz con adaptadores por proveedor, Remotion y MP4 de 1080×1920.
- **Marco semiconstante:** pestaña de archivo, textura de puntos y firma en todas las láminas; cambian de color con cada pieza. La firma vive en `accounts/`; tipografías y tema en `packages/brand/`; avatar en `assets/avatar/`.
- **Dirección de arte:** [skills/carrusel-taste](skills/carrusel-taste/SKILL.md), con las 12 direcciones y sus referencias.
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

`content/2026-10-16-mods-claude-code/`: ficha con fuentes, idea, dirección de arte (línea continua, con préstamos de captura anotada y terminal), diseño (`slides.tsx`) y crítica final de un carrusel de 7 láminas sobre los mods de Claude Code.
