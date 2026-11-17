# Estado: Visión por computadora, explicada

Réplica parecida de un Reel de @rick.theengineer (archivo `Downloads/d.mp4`, 152,5 s; ver `referente.md`).

## Fase

Aprobada y sin publicar. Render final de 163,3 s, sha256 `53019551c9769ad8318774fb31169dde25f3df1e7b2d486724750e389f67a7cc` (se usaron los 2 renders completos). Puerta B, 17 de noviembre de 2026: "aprobado no lo publiques, comit hasta aca". Paso siguiente: publicar solo cuando Jeremy lo pida, con `npm run video:publicar -- content/2026-11-17-vision-por-computadora`. Después, `video:cosechar` y las métricas a las 48 horas y a los 7 días.

## Crítico ciego (ronda 1, 3,55, sin error grave)

Informe en `video-critica.md`. Arreglado: el cuadro 1 ya trae la foto del rostro junto al título; la escena CNN tiene un pulso que recorre las capas; las etiquetas de detección ya no se pisan (solo la primera lleva puntaje); la barra "UN MODELO LEE LOS DOS" ya no tapa al avatar; la pregunta del chat termina de escribirse. Sin arreglar, a propósito:
- Acortar embedding, parches y video: es la estructura del referente (en una copia no se cambia).
- La frase "una computadora no ve imágenes" en el gancho: el gancho es el del referente.
- El CTA pide dos cosas: es el pedido literal de Jeremy.
- El contador del medidor sale como "263,616" (formato del kit) y en pantalla "263.616": es del motor, no de la pieza.

## Decisiones de Jeremy (puerta A, 17 de noviembre de 2026)

- Pedido: "Quiero copiar ese video con nuestro branding y avatar. Espero poder alcanzar el mismo arte visual sin complicarnos tantos. Espero no perder perder la claridad. Dame una sugerenia de CTA para disaparar mas el reel."
- Fotos: "Generarlas con agy (Recomendado)".
- Avatar: "Busto a la izquierda, como Rick (Recomendado)".
- CTA: "Cómentame sí ya sabías esto, y que temas te gustaría que hablemops en el siguiente video. Algo así".
- Duración: "Aparfrasealo, esta bien si dura un poco mas, pero si ves que llega a pasar los 3min ya sí aplica la primera opcion de fases mas cortas".

## Lo que decidí yo

- El primer guion parafraseado tenía 569 palabras: con Rada pasaba de 3 minutos, así que apliqué la opción de frases más cortas (495 palabras). Con `tempo` 1,3 dura 163,5 s; `target` es 165 (Jeremy aceptó que dure algo más que los 152,5 s del referente).
- El mundo es una app oscura, "vista-máquina", con 10 pestañas que se encienden por capítulo, como la app de Rick. Su azul pasa al acento de la cuenta (#8B85FF); el amarillo queda para lo que la máquina detecta.
- El avatar va abajo a la izquierda (la posición de la cuenta, `size` 240), no a media altura como el personaje de Rick: el busto cortado no se sostiene flotando. Es lo único que la comparación (`out/comparar.png`) dejó distinto en el aspecto.
- Las 19 fotos las generó agy (Gemini) con la suscripción de Jeremy, en tandas de 3 o 4; varias tandas las guardaron en la raíz del repo y se movieron a `img/`. Los prompts están en `img/generated.json`.
- Los datos que se ven salen del referente (CIFAR-10, 263.616 y 361.264 imágenes, paso 2.822, error de 2,11 a 0,15, 94/5/1 %, 512 números, ResNet, YOLO). Las grillas de números, los mapas de bordes, de amarillo y de textura y la cuenta del filtro (639) se calcularon con ffmpeg sobre las fotos (`pixels.json`). Las máscaras de segmentación, el embedding, los filtros de colores y el seguimiento de la pelota van rotulados "Ejemplo ilustrativo".
- El medidor cuenta "Imágenes vistas" (0 → 361.264), el contador de entrenamiento del referente.
- CTA: un comentario ("¿Ya lo sabías?") con ideas de temas que se escriben en la caja; gesto de comentar.

## Anclaje

- Cambios al guion visual después de emparejar: 0.
- Biblioteca: 0 % del tiempo en pantalla (vacía; todas las escenas son nuevas).

## Avisos defendidos

- La lista de tres pasos del cierre pasa de 6 palabras en pantalla: es la lista que se captura (regla de forma del cierre).

## Pendiente para el motor

- `npm run agy` con imágenes: agy guarda a veces en la raíz del repo aunque el prompt diga la ruta. Conviene que el comando de imágenes de agy mueva el archivo solo.
- El medidor `counter` formatea con coma de miles (263,616) y no con `es()` (263.616).
- El avatar solo tiene busto: para imitar a un presentador de cuerpo entero hace falta una pose (ver `assets/avatar/README.md`, "Por hacer").
