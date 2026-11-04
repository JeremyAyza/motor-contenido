# Plan: recursos visuales y movimiento

Estado al 20 de octubre de 2026:

| Fase | Estado |
|---|---|
| 1. Un recurso visual por lámina | Hecho |
| 2. Movimiento (experimento) | Hecho. Probado con una pieza de prueba: 3 láminas animadas salieron como MP4 y los avisos se dispararon. Falta subir un carrusel mixto a Instagram |
| 3. El avatar como personaje | Pendiente: hacen falta las poses generadas a partir de la ilustración de Jeremy |
| 4. Ilustraciones con IA por pieza | Pendiente y opcional |

## Por qué

Las piezas salían textuales: titular, párrafo y caja en cada lámina, con la mitad de abajo vacía. En la de ray tracing, `post.json → idea` decía que la línea continua era la trayectoria del rayo, y ninguna lámina dibujaba un rayo. Faltaban tres cosas: piezas para dibujar diagramas, datos y metáforas; que el esqueleto dijera qué se ve en cada lámina; y que el inspector midiera lo visual.

Lo que se usó para decidir:

- **Formato:** en 2026 los carruseles son el formato con más interacción de Instagram (Socialinsider), y una lámina puede ser un video de 3 a 60 s dentro del mismo carrusel. No hay datos de que una lámina animada dé más alcance; por eso el movimiento es un experimento.
- **Aprendizaje:** palabras y dibujo juntos enseñan más que palabras solas. Además rinden las señales (flechas, resaltado), las etiquetas pegadas a lo que nombran y sacar lo que no explica (Mayer, *Cambridge Handbook of Multimedia Learning*).
- **Herramientas:** el render ya pasa las animaciones CSS cuadro a cuadro con Playwright y ffmpeg las codifica en MP4, así que no hizo falta Remotion. Fluent Emoji de Microsoft tiene licencia MIT, y rough.js (MIT) da el trazo a mano.

## Fase 1: un recurso visual por lámina

- [skills/carrusel-taste/recursos.json](../skills/carrusel-taste/recursos.json) tiene 12 recursos, cada uno con cómo, cuándo, sus primitivas y un ejemplo.
- `brief.json → esqueleto[].visual` lleva `{ recurso, que }`. La puerta A lo muestra, y `carrusel:brief` avisa si falta en una lámina interior o si un recurso ocupa más de la mitad de ellas.
- [packages/carousel/src/ui/visual.tsx](../packages/carousel/src/ui/visual.tsx) trae las primitivas `Proceso`, `Nodo`, `Flecha`, `Etiqueta`, `Barras`, `Cifra`, `Escala`, `Linea`, `Matriz`, `Boceto`, `Objeto` y `Resalte`.
- `npm run carrusel:objeto -- <nombre>` baja un objeto de Fluent Emoji a `assets/objetos/`.
- El inspector avisa en cada lámina interior:
  - si el recurso ocupa menos del 15% del área de contenido;
  - si más del 35% del alto está vacío;
  - si hay dos láminas seguidas de solo texto.

  Además dejó de contar el CSS como palabras.
- El crítico ciego califica "Progresión y recurso visual": un carrusel de titulares con párrafo y caja no pasa de 3.

## Fase 2: movimiento

- `<Anim>` tiene cinco efectos (aparece, sube, salta, crece, traza), las primitivas aceptan `anim` y `<Cuenta>` hace que un número cuente.
- El render deja todo en su estado final para inspeccionar y fotografiar `NN.png`. Si la lámina tiene algo animado, la graba a 30 fps en `NN.mp4`: lo último más 1.5 s quieta, entre 3 y 12 s. Borra los MP4 que sobran y marca las animadas en la hoja de revisión.
- Avisos: más de dos láminas animadas, o el gancho de la portada entrando con animación. Sin ffmpeg es error.
- `carrusel:publicar` sube `NN.mp4` en lugar de `NN.png` cuando existe, y el publisher acepta mp4 hasta 250 MB.
- `metricas.json → etiquetas.animadas` registra el experimento.

## Pendiente

- **Primera publicación con una lámina animada:** confirmar que el flujo web de Instagram acepta el carrusel mixto con los mismos pasos. Hay que correr el ensayo (`--ensayo`) primero.
- **Fase 3, el avatar:** una hoja de 8 a 12 poses (sorprendido, señalando, pensando, celebrando) generada a partir de la ilustración de Jeremy con un modelo de imagen que mantenga el personaje. Después, `<Avatar pose="...">` para la portada y el cierre, y el manifiesto de `assets/avatar/`.
- **Fase 4, ilustraciones con IA:** solo para la analogía que necesita una escena que los objetos y el boceto no dan. Recraft es la única API con SVG real y estilo de referencia. Tiene costo por imagen y riesgo de que se vea genérico.
