# Referente

- **Archivo:** `out/referente.mp4` (copia de `Downloads/d.mp4`, el que pasó Jeremy). Estilo de @rick.theengineer.
- **Duración:** 152,5 s (720×1280, 30 fps). En inglés. `target` de la réplica: 152 s.
- **Tema:** visión por computadora explicada, de los píxeles a los modelos de visión y lenguaje.
- **Cuadros:** `out/referente-cuadros.jpg` (1, 10, 20, 30, 45, 52, 60, 80, 89, 110, 125 y 150 s).

## Aspecto

- Fondo casi negro azulado, un solo acento azul (#4a8cff aprox.) y amarillo para lo detectado (cajas, 94 % DOG, máscaras).
- **El mundo:** una app ficticia, "MACHINE VIEW", con barra superior y 10 pestañas que avanzan por capítulo: PIXELS, FILTERS, LAYERS, LEARN, CLASS, BOXES, MASK, EMBED, TOKENS, TRACK. Arriba a la derecha, el archivo o modelo de la escena (`input: cat.jpg`, `ResNet-50 · ImageNet`).
- Título corto en mayúsculas sobre cada panel ("MULTIPLY, THEN ADD", "A DOG IT HAS NEVER SEEN").
- Mucha foto real: rostro con gorro, calle de Nueva York con taxis, gato, perro, husky, collage de etiquetas, resonancia cerebral, multitud con cajas.
- Datos en monoespaciada debajo de cada panel (`6,000 × 4,000 × 3`, `157,901`).
- El personaje (Rick, de cuerpo entero con una laptop) está parado a la izquierda casi todo el video; el contenido va a la derecha. En el gancho está dentro de una caja de detección "person 0.76".
- Subtítulos de palabra resaltada, abajo, en píldora oscura.

## Estructura (voz con tiempos)

| s | Capítulo | Lo que dice | Lo que se ve |
|---|---|---|---|
| 0–8 | Gancho | Visión por computadora explicada: el teléfono se desbloquea al ver tu cara, la app de fotos encuentra a tu perro, el auto autónomo frena solo en rojo. | Título COMPUTER VISION con el personaje en caja YOLO; rostro con puntos; calle con cajas. |
| 8–13 | — | ¿Cómo mira una imagen y sabe qué hay? La clave: no ve imágenes. | "HOW DOES IT KNOW?", calle con taxis. |
| 13–24 | PIXELS | Ve números: la foto de un gato es una grilla de píxeles, cada uno tres números de 0 a 255 (rojo, verde, azul). Una foto de teléfono son millones de números y ninguno dice "gato". | Gato → acercamiento a la grilla de valores; `6,000 × 4,000 × 3`. |
| 24–37 | — | Antes se escribían reglas a mano (bordes, esquinas, formas, texturas); funcionó hasta cierto punto. El aprendizaje profundo cambió eso: millones de imágenes etiquetadas. | Código de reglas `is_cat()`; fotos que rompen las reglas; collage etiquetado, `157,901`. |
| 37–58 | FILTERS | La arquitectura principal es la red convolucional (CNN). Está hecha de filtros: una grilla diminuta de números, 3×3, que se desliza por la imagen, multiplica y suma; si coincide con su patrón (un borde vertical), el resultado es alto. Un filtro detecta bordes, otro un color, otro una textura. | "CNN" grande; mosaico de filtros; filtro −1 0 +1; grilla de píxeles con la ventana deslizándose y la cuenta; mapa de un color sobre autos. |
| 58–70 | LAYERS | Las capas se apilan: las primeras ven bordes y líneas, las profundas pelaje, ojos, ruedas, caras y objetos completos. Nadie programa esos filtros: la red los aprende. | Mapas de activación; cuatro paneles (fur, eyes, wheels, faces). |
| 70–80 | LEARN | Empieza con números al azar, adivina "auto" para un perro, se mide el error y se ajusta cada número un poco. Millones de veces y los filtros se forman solos. | Perro con barras de probabilidad mal; filtros que pasan de ruido a patrón. |
| 80–92 | CLASS | La salida es una lista de probabilidades: 94 % perro, 5 % lobo, 1 % gato. Eso es clasificación, y por eso tu app encuentra a tu perro en una foto que nunca vio. | Husky con barras; "94% DOG" enorme; búsqueda "dog" en una grilla de fotos. |
| 92–98 | BOXES | La detección va más allá: qué es y dónde. El auto autónomo dibuja una caja en cada peatón, auto y semáforo. | Calle con cajas amarillas y etiquetas. |
| 98–108 | MASK | La segmentación etiqueta cada píxel: así la videollamada desenfoca el fondo y no a ti, y el software contornea un tumor en una resonancia. | Calle segmentada en colores; persona recortada; resonancia con contorno. |
| 108–120 | EMBED | El reconocimiento facial convierte tu cara en una lista de números (un embedding). Dos fotos de la misma persona quedan cerca, un extraño lejos; el teléfono mide la distancia. | Rostro → 512 números; caras como puntos en un plano. |
| 120–132 | TOKENS | Los modelos de visión y lenguaje cortan la imagen en parches y cada parche se vuelve números que el modelo trata como palabras. Por eso le mandas una captura a ChatGPT y preguntas qué pasa. | Calle → parches; "IMAGE PATCHES / WORD TOKENS → ONE MODEL READS BOTH"; chat con la foto. |
| 132–136 | TRACK | El video suma tiempo: sigue cómo se mueve todo cuadro a cuadro, como el balón en una transmisión. | Multitud con cajas que se siguen. |
| 136–152 | Cierre | La idea no cambia: la imagen a números, aprender patrones, predecir qué contiene. Tú ves una calle; la computadora, millones de valores que capa a capa terminan significando auto, persona, calle, semáforo. | Lista de 3 pasos con miniaturas; grilla de números → la calle con cajas y etiquetas. |

No tiene CTA: termina en "That is computer vision" sobre la calle etiquetada.
