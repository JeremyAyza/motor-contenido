---
name: video-es
description: Capa de este repo sobre las skills oficiales de Remotion. Dice qué cambia en motor-contenido respecto de las skills remotion-* y dónde está el resto. Úsala siempre que trabajes en packages/video, packages/media o un content/<pieza>/video.json o video.tsx.
---

# video-es

Las skills `remotion-*` son las oficiales de Remotion, sin modificar: enseñan Remotion. Se instalan en cada máquina con `npx skills experimental_install`, que lee `skills-lock.json`. Esta capa dice qué cambia en este repo. Ante un conflicto, manda [AGENTS.md](../../AGENTS.md) y después esta skill.

- **El flujo del Reel** (pasos, comandos, puertas, decisiones de Jeremy) está en [docs/reel.md](../../docs/reel.md). Léelo antes de empezar.
- **El kit** (`@motor/video`: escenario, cámara, objetos, tablero, medidor, avatar, subtítulos) está en [docs/referencia/kit-video.md](../../docs/referencia/kit-video.md). Ábrelo cuando necesites un componente.

## Qué cambia respecto de las skills de Remotion

| La skill de Remotion dice | Aquí |
|---|---|
| Recomienda ElevenLabs y pide su clave | La voz sale de `video:prepare` con el proveedor de `accounts/dev.json → voice`, detrás de `SpeechProvider` (`packages/media`). No pidas claves: van en `.env`, y las escribe la persona |
| Archivos en `public/` | La carpeta pública es `content/<pieza>/out/video/`, y la llena `video:prepare` |
| Google Fonts | Las tipografías de la dirección de arte (`art.fonts`), que salen de `packages/brand` |
| Efectos de `remotion.media` | Solo los de `assets/catalog.json`, con su fuente, autor y licencia. Para entrar al catálogo, cada recurso necesita la licencia revisada en su fuente (`checkedAt`) y el `sha256` del archivo; sin eso, `video:prepare` no lo usa. Nunca los memes (Vine, SpongeBob, Windows XP), que usan sonidos con derechos de terceros |
| Las animaciones CSS no se renderizan bien | Las primitivas del carrusel (`anim`, `<Anim>`, `<Cuenta>`) se usan igual: `CssMotion` las adelanta cuadro a cuadro. El movimiento nuevo que escribas para un video va con `useCurrentFrame()` e `interpolate()` |
| No renderizar si no lo piden | Studio sirve para mirar y ajustar. `video:render` se corre cuando el video está listo para revisar, y siempre antes de la puerta B |
| Copiar Elements de remotion.dev | Antes de copiar uno, revisa sus términos. Primero usa los componentes propios y las primitivas |
| Cifras pensadas para 1080 de ancho | El lienzo es de 540×960 px de diseño y se renderiza a 2x: las cifras se dividen por 2 (titular de 42 px o más, texto de 22 px o más) |
| Renderizar el video para revisar | `video:frames` para cuadros sueltos y `video:render --escena` para un tramo; el render completo, dos veces por Reel |
