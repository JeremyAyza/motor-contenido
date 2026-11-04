# Plan: optimizar la generación de carruseles y videos

Pedido por Jeremy el 24 de octubre de 2026: un carrusel animado de 10 láminas tardaba demasiado. Este plan se implementa en otra sesión. Todavía no hay nada hecho.

## Por qué tarda hoy

1. **Dos motores de render.** El carrusel tiene su propio grabador (`packages/carousel/src/movimiento.ts`), sin la concurrencia ni la caché del bundle de Remotion que usan los videos. Remotion graba igual (Chrome sin ventana, cuadro por cuadro, y ffmpeg), pero en paralelo.
2. **Lámina por lámina, en serie.** Cada lámina animada abre el navegador, graba 180 cuadros (6 s a 30 fps) y lo cierra.
3. **Todo se vuelve a renderizar.** Si el inspector marca una lámina, se renderiza el carrusel entero.
4. **El crítico ciego hace hasta 3 rondas en serie.** Cada ronda es un contexto nuevo que lee todo desde cero.
5. **El agente diseña desde cero.** Escribe `slides.tsx` completo en cada pieza, sin plantillas.

## Plan (en este orden)

### G. Medir primero
- Cada comando escribe la duración de sus etapas en `out/tiempos.json`: brief, diseño, render por lámina, inspector, crítico y texto.
- Sirve para confirmar dónde se va el tiempo antes y después de cada cambio.

### A. Un solo motor de render (el impacto más grande)
- Las láminas del carrusel pasan a ser composiciones de Remotion de 1080×1350 (4:5), registradas en el mismo `Root.tsx` que los videos.
- El bundle se hace una vez por pieza. Las animadas salen con `renderMedia` y `concurrency` según los núcleos; las estáticas, con `renderStill` (una captura, sin video).
- Todas las láminas se renderizan en paralelo en un solo proceso.
- Se mantienen las primitivas del carrusel (`Slide`, `anim`, `CssMotion`) para que las piezas viejas sigan renderizando igual.
- `movimiento.ts` queda como alternativa hasta comprobar que el resultado es igual cuadro por cuadro en 2 piezas publicadas.

### B. Render solo de lo que cambió
- Hash por lámina: su código, sus datos y sus assets. Si el hash no cambió, se reutiliza el archivo anterior.
- El inspector revisa el still de cada lámina y vuelve a renderizar solo las que fallan.
- En los videos, lo mismo por escena cuando la cámara no cruza escenas.

### D. Plantillas de láminas
- Una biblioteca de 10 a 12 láminas tipo con props: portada, comparación, proceso, cifra grande, código, anatomía, captura anotada, lista, resumen capturable y cierre.
- El agente llena datos en `post.json` y elige la plantilla de cada lámina. Escribe `slides.tsx` a mano solo para una lámina especial.
- Cada plantilla toma la dirección de arte de la pieza (paleta, tipografías, ancla), así que no se pierde variedad.

### C. Borradores rápidos
- En las iteraciones, `--borrador`: escala 0,5 y 15 fps. La calidad final, solo en el último render antes de la puerta B.
- Tope de 2 o 3 láminas animadas por carrusel. Las demás, estáticas o con un movimiento mínimo.

### E. Crítico ciego más barato
- Una ronda por defecto; la segunda, solo si la primera encuentra errores graves.
- Revisa la hoja de contacto con todas las láminas, no cada archivo.
- Corre en un modelo más barato (Sonnet o Haiku).

### F. Paralelismo de agentes
- Después de la puerta A, la captura de fuentes y el diseño de láminas corren en paralelo.
- El texto del post se escribe mientras renderiza.

## Meta

- **Render:** un carrusel animado de 10 láminas, de unos 30 a 60 minutos a 5 o 10 minutos, sin contar el tiempo que esperan las puertas.
- **Paridad:** el mismo resultado visual que hoy, comprobado con hojas de contacto antes y después en 2 piezas.

## Lo que no cambia

- Las puertas A y B, los hechos con fuente y las reglas de `AGENTS.md`.
- La dirección de arte por pieza y la baraja de direcciones.
