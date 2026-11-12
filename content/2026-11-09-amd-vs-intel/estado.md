# Estado: 2026-11-09-amd-vs-intel

Réplica para @jacket.dev del Reel de @rick.theengineer sobre AMD contra Intel (https://www.instagram.com/p/DffIA7EMGwZ/, 147,5 s). Primera pieza hecha con `/content-engine-copy`: sin fuentes, sin crítica del guion y sin `facts.json` (la fuente es el Reel copiado).

## Fase

**Render final listo (2 de 2), esperando la puerta B.** `out/video.mp4`, 152,6 s, sha256 `bcdb76a0c7d101c927833b2c7ddb2533daefe1cf1bf114519757ea457b38a51a`. El informe del crítico está en `video-critica.md`. `video.json → gateB` sigue en `false`.

## Paso siguiente

1. Preguntarle a Jeremy si se publica. Con su sí: anotar `gateB { approved: true, date, video: "<sha256 de arriba>" }` y correr `npm run video:publicar -- content/2026-11-09-amd-vs-intel`.
2. Si pide cambios: por escena y con `video:render --forzar`.
3. Después: `npm run video:cosechar -- content/2026-11-09-amd-vs-intel` y las métricas a las 48 horas y a los 7 días.

## Decisiones de Jeremy (puerta A, 2026-11-09)

- **Chips:** "Planos, en código (Recomendado)". Los renders 3D de Rick quedan como chips planos dibujados en código.
- **Avatar:** "Sí, por momentos (Recomendado)". Entra en los tramos de Rick: preguntas y x86, el silicio, la fábrica de Intel, el ensamblado, las obleas, los núcleos, el truco de AMD, la tabla de elección, el modelo mental y el CTA.
- **Cierre:** "mezcla de las dos primeras opciones": la pregunta para comentar (¿AMD o Intel?) y además sígueme y guarda.

## Decisiones de esta pieza

- **Estructura de Rick, en su orden y en 20 escenas:** gancho versus y la rejilla de PCs; por fuera iguales y las dos preguntas; x86 y su vocabulario; código de máquina; mismo idioma, otro silicio; transistores; quién fabrica; ensamblado; chiplets y E/S; obleas; Infinity Fabric; tiles y Foveros; núcleos híbridos y Thread Director; un solo tipo de núcleo y los hilos; la caché; 3D V-Cache y los juegos; la tabla de elección; el modelo mental; la moraleja y el CTA.
- **Datos:** solo los del Reel de Rick (modelos 9950X, 285K y 7800X3D; 16/32 y 24/24; 32 + 64 = 96 MB; latencias; rendimiento de obleas). Las obleas, los porcentajes, las latencias y las casillas de la caché van rotulados "Ejemplo ilustrativo". Las codificaciones x86 (01 D8, 89 D8, EB) son reales.
- **Aspecto (réplica parecida):**
  - de Rick: el negro `#05070A` con retícula, la etiqueta de capítulo "0N · NOMBRE" con su línea, los títulos chicos a la izquierda, rojo AMD y azul Intel fijos, verde para la caché, la palabra gigante por capítulo (CHIPLETS, TILES, FOVEROS, 3D V-CACHE) y la vuelta a los dos chips del gancho en el cierre;
  - de @jacket.dev: el acento `#8B85FF` (donde Rick usa ámbar para los datos), el marco, el medidor "Diferencias" (0 a 4) y el avatar.
- **Voz:** `tempo` 1,33 para llegar a 152,5 s, dentro del ±10 % de los 147,5 s de Rick.
- **Dirección:** `capa-por-capa`, sin baraja (réplica parecida). Cierre `gesto-en-el-recurso` con el gesto de comentar.
- **Comparación con el referente** (`out/comparar.png`): coinciden el fondo, las zonas, la densidad y los títulos. Diferencias aceptadas: chips planos en lugar de 3D, el busto abajo a la izquierda en lugar del Rick de cuerpo entero, y los subtítulos más abajo, en el marco de la cuenta.
- **Biblioteca:** vacía; las 20 escenas son `nueva`. El guion visual cambió 0 veces después de emparejar.

## Crítica (crítico ciego, ronda 1)

**3,55 de 5, sin error grave.** Gancho 3, Tesis 4, Valor 4, Retención 3, Compartible 4, Cierre y CTA 3, Voz y guion 4, Legibilidad 3, Recurso visual 4. Ningún punto bajó de 3: no corresponde una segunda ronda.
1. **Adelantar la respuesta y recortar x86, transistores y fábrica.** No se aplicó: rompe la estructura de Rick, que es lo que se copia, y cambia la voz.
2. **Una sola acción en el cierre y otra moraleja.** No se aplicó: el cierre mixto lo pidió Jeremy y la moraleja es la de Rick.
3. **Legibilidad.** Se aplicó antes del render final: etiquetas más grandes (silicio, transistores, caché, chiplets, tareas), sin la línea de JUEGO que cruzaba "8 DE RENDIMIENTO", las cifras de Intel antes de que la voz las lea, la mitad de abajo de "El recuento" con los hilos por núcleo, y sin la nota "Siguiente: levantar las tapas". Quedó el título de la moraleja junto al subtítulo, como en Rick.

## Avisos defendidos (render final)

- **8 palabras a los 141,5 s:** las dos tarjetas de las apuestas, que se leen como dos bloques separados de 2 o 3 palabras.
- **Vacío abajo a los 37,8 s y 141,0 s:** son el primer medio segundo de "fabrica" y "modelo", antes de que entren la fábrica y las tarjetas.

## Pendiente para el motor

- `video:render --escena` falla si la lista incluye la última escena (`cta`): "frame range 1995-4576 is not inbetween 0-4574". Un cuadro de más al final del tramo.
