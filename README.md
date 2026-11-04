# motor-contenido

Motor para producir carruseles y videos de Instagram con IA, con calidad editorial y sin depender de un agente o proveedor en particular.

- **Carrusel:** el agente investiga, define una idea propia del tema, recibe 3 direcciones de arte de una baraja de 12 y diseña cada lámina con React y Tailwind. El render las convierte en PNG de 1080×1350 e inspecciona legibilidad, contraste, el ancla visual de la portada y señales de diseño genérico.
- **Reel:** el agente escribe el guion y el guion visual, genera la voz y arma cada escena en Remotion; el render deja un MP4 de 1080×1920 y lo revisa un crítico ciego antes de la aprobación final.
- **Marco semiconstante:** pestaña de archivo, textura de puntos y firma en todas las láminas; cambian de color con cada pieza. La firma vive en `accounts/`; tipografías y tema en `packages/brand/`; avatar en `assets/avatar/`.
- **Dirección de arte:** [skills/carrusel-taste](skills/carrusel-taste/SKILL.md), con las 12 direcciones y sus referencias.
- **Agnóstico al agente:** las reglas viven en [AGENTS.md](AGENTS.md) y los pasos en [docs/reel.md](docs/reel.md) y [docs/carrusel.md](docs/carrusel.md).

## Empezar

```bash
npm install
npx playwright install chromium
npm run carrusel:render -- content/2026-10-16-mods-claude-code
```

Las láminas quedan en `content/2026-10-16-mods-claude-code/out/`. Para usar un Chrome ya instalado en vez del de Playwright, define `CHROME_PATH`.

## Un carrusel nuevo

Abre tu agente en el repo y pídelo en una línea:

> Sigue docs/carrusel.md y genera un carrusel para la cuenta dev sobre **[tema]**. Muéstrame la ficha, la idea y la hoja de revisión antes de darlo por terminado.

## Un Reel nuevo

Abre un chat nuevo en el repo (uno por Reel) y pega esto, con el tema:

```
Reel nuevo para la cuenta dev sobre [tema]. Sigue AGENTS.md y docs/reel.md. Muéstrame los ganchos y el guion antes de generar la voz, y el video terminado antes de darlo por listo. Antes de cerrar, deja estado.md con la fase y el paso siguiente.
```

## Una réplica de otro Reel

Pega la URL del Reel que quieres copiar. Deja Chrome abierto con la extensión de Claude: ahí lo mira el subagente `analista-referente`.

```
Réplica para la cuenta dev del Reel [URL], sobre [tema, o el mismo del original con datos propios]. Sigue AGENTS.md y docs/reel.md: copia la estructura, el ritmo y la duración del original, con la marca de la cuenta. Muéstrame los ganchos y el guion antes de generar la voz, y el video terminado antes de darlo por listo. Antes de cerrar, deja estado.md con la fase y el paso siguiente.
```

**Para cualquiera de los dos:**
- **Sin aprobaciones a mitad de camino:** cambia "Muéstrame los ganchos… antes de darlo por listo" por "No me pidas aprobaciones: anota las puertas y muéstrame solo el video terminado".
- **Esfuerzo:** abre el chat en extra alto. Sin aprobaciones, basta alto.
- **Publicar** es otro pedido: el chat no publica si no se lo pides.
- **Si el chat se corta o quieres seguir en otro:** `npm run video:fase -- content/<pieza>` imprime el mensaje para pegar en el chat nuevo y el esfuerzo con el que abrirlo.

## Pieza de ejemplo

`content/2026-10-16-mods-claude-code/`: ficha con fuentes, idea, dirección de arte (línea continua, con préstamos de captura anotada y terminal), diseño (`slides.tsx`) y crítica final de un carrusel de 7 láminas sobre los mods de Claude Code.
