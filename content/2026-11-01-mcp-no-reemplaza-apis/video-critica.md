Informe escrito por Sonnet 5.5 (subagente critico-ciego-video). Sin ver ni oír el video: juzgué con las 10 tiras, la transcripción, `hoja.png`, `grilla.png` y el texto del post. No pude evaluar cómo suena la voz (tropiezos, velocidad), solo lo que dice.

## Paso 1 (en frío)

- De qué trata: de que MCP no reemplaza las APIs. Abre el servidor MCP de GitHub y muestra que por dentro llama a la API de siempre (también Notion). Después explica para qué existe MCP (50 integraciones a medida contra 15), qué es el descubrimiento de herramientas, que el modelo no llama a nada (lo hace tu app y el servidor), cuánto cuesta el menú en tokens y cuándo usar API directa o MCP.
- Tesis en una frase: MCP no sustituye a las APIs, se las presenta a la IA de forma común; la API sigue haciendo el trabajo.
- Me habría ido en: 1:24, cuando empieza la tabla de tokens. La tesis ya se probó en 0:18 y el "para qué existe MCP" quedó resuelto en 1:21; desde ahí la tabla no cambia durante unos 8 s (solo cambia el sello). Hasta 1:21 lo habría visto, porque cada 2 s pasa algo y el "no llama a nada" de 1:16 engancha.
- Qué haría al final: enviar (guardar como segunda opción).
- A quién se lo mandaría: a la persona de backend o al tech lead de mi equipo que está a punto de proponer "migremos todo a MCP", porque el cierre (1:50 a 1:55) lo pide y la frase "La API hace el trabajo. MCP se lo presenta a la IA" sirve sola. También a alguien que recién arma agentes y mezcla los dos conceptos.

## Paso 2 (con el brief)

- ¿Coincide la tesis? No hay brief para esta pieza (`paso-2-brief.md` dice "Sin brief"), así que no puedo compararla. Con lo que entendí en el paso 1, la tesis se dice en el gancho (0:00), se prueba en 0:06 a 0:18 y se repite al cierre (1:45 a 1:55). Es coherente consigo misma. Queda sin verificar contra una intención escrita.

## Puntajes

| Punto | Peso | Puntaje | Por qué |
|---|---|---|---|
| Gancho | 15% | 4 | "MCP no reemplaza tus APIs" se lee desde el cuadro 1, en grande y legible también en la grilla; la afirmación contraria al sentido común detiene el pulgar. Le resta que "Nunca las tocó" no está en el cuadro de 0:02 y aparece hacia 0:04, y que de 0:00 a 0:02 el subtítulo repite el título palabra por palabra. |
| Tesis | 15% | 4 | Clara, se dice dos veces y la prueba (código de GitHub, cita de Notion) es concreta, no un comunicado. No doy 5 porque sin brief no puedo confirmar que coincida. Además el tramo 0:53 a 1:36 abre un segundo argumento (menú, tokens) que se siente aparte hasta que el cierre lo une. |
| Valor | 15% | 4 | Se lleva una lectura nueva (el servidor llama a la API; el modelo no llama a nada) y un costo real (55K tokens). La parte accionable, "cuál usas", dura 9 s (1:36 a 1:45) y es la más delgada. |
| Retención | 10% | 3 | Dura 1:55 y la promesa del gancho se cumple a los 18 s. El "¿Para qué existe MCP?" de 0:18 reengancha bien y la pantalla cambia cada 2 s entre 0:00 y 1:21. Pero de 1:24 a 1:32 la tabla no cambia, 0:56 a 1:04 es una escena con la mitad vacía, y el bloque "letra chica" (1:21 a 1:36) agrega 15 s después de cerrar la idea. |
| Compartible | 10% | 4 | Hay varios momentos sueltos: el sello "NO LLAMA" (1:16), el 50 que baja a 15 (0:44 a 0:50), el tablero final MCP/API con "APIS REEMPLAZADAS: 0" (1:50 a 1:55). La frase "La API hace el trabajo. MCP se lo presenta a la IA" se entiende sin el resto. |
| Cierre y CTA | 10% | 4 | Cumple el gancho ("APIs reemplazadas: cero") y pide una sola acción propia del tema: mandárselo al equipo "antes de que alguien proponga migrar tus APIs", con sello e ícono de envío. Resta que el CTA solo está en pantalla de 1:52 a 1:55 y el video termina en la última palabra, sin cuadro final sostenido. |
| Voz y guion | 5% | 4 | Frases cortas y habladas ("Tu empresa saca otra app de IA. Otra vez las cinco. Diez."). Tropiezo de guion: de "Diez" a "cinco clientes, diez sistemas, cincuenta" cambia la cuenta (de 2 apps x 5 servicios a 5 x 10) sin avisar. No puedo juzgar la voz hablada. |
| Legibilidad en el celular | 10% | 4 | Subtítulos grandes con la palabra por decir en gris, títulos y sellos muy legibles. Lo que falla: la cita de Notion está en inglés y chica (0:14 a 0:16); la tarjeta JSON del menú se corta por la derecha y tapa la lista (1:02 a 1:04); en 1:32 a 1:34 la pila de herramientas queda debajo de "ELIGE PEOR" y de "30 a 50 herramientas", con una "t" suelta en el borde de la tabla (1:32); el contador "INTEGRACIONES" y "GraphQL" (0:14) son diminutos. |
| Recurso visual y composición | 10% | 4 | Las metáforas explican antes de la voz: la tapa abierta (0:00), el enchufe común (0:42), los ojos de "tu modelo" y el sello "NO LLAMA". Resta: hueco grande de 0:56 a 1:04 (servidor y "Tu app" arriba, el resto vacío), hueco sobre el subtítulo en 1:48 y 1:50, y el 15 / "5+10=15" (0:50) está sobre un dibujo de 2 apps y 5 servidores que no suma eso. |

Promedio ponderado: 3.90

No llega a la puerta B (pide todos los puntos en 4 o más y promedio de 4.5 o más): Retención está en 3 y el promedio queda en 3.90. Ningún punto saca menos de 3 y no hay error grave, así que, por la regla de una ronda, se arregla y se renderiza una vez antes de decidir una segunda.

## Tres arreglos, en orden de impacto (con el segundo del video)

1. Retención, 1:21 a 1:36 y largo total (1:55). Ahí me iría. La tabla de tokens se queda igual de 1:24 a 1:32 con la voz diciendo tres cosas, y de 1:30 a 1:36 se vuelve a mostrar "30 a 50 herramientas" sobre una pila de nombres que se pisa. Dejar una sola cifra (55K tokens) con algo que cambie cada 2 s (por ejemplo, filas que se suman y un contador que sube a la par de la voz) y mover o acortar "30 a 50" para que "Por eso GitHub te deja cargar solo lo que usas" llegue antes de 1:30. Acortar la voz cambia el guion aprobado: vuelve a la puerta A.
2. Valor y recurso visual, 0:34 a 0:52: los números no coinciden con el dibujo. En 0:34 hay 10 (2 apps x 5 servicios) y en 0:38 el cuaderno muestra 50 (5 x 10) sobre los mismos 5 logos; en 0:50 "5+10=15" aparece sobre 2 apps y 5 servidores. Dibujar 50 y 15 con la misma escena (5 apps y 10 servicios, y sus 5 + 10 enchufes) o decir "dos apps" en vez de pasar a 5 clientes. Además "De cincuenta, bajas a quince" (0:46 a 0:50) suena a número de GitHub: poner "cuenta propia" en pantalla, como hace el post con "(la cuenta es nuestra)".
3. Composición, 0:56 a 1:04 y 1:48 a 1:50: en 0:56 y 0:58 solo hay "server" y "Tu app" arriba y casi todo el lienzo vacío, y en 1:02 a 1:04 la mitad de abajo sigue vacía mientras la tarjeta JSON se sale por la derecha y tapa la lista. Escalar el menú para llenar el alto desde el principio, o arrancar la lista y la tarjeta más abajo, y dejar la tarjeta dentro del margen. Mismo hueco en 1:48 a 1:50, entre las filas del tablero y el subtítulo.

## Menores (no entran en los tres)

- 0:00 a 0:02: el subtítulo y el título dicen lo mismo; quitar el subtítulo o poner ahí "Nunca las tocó" para que el gancho completo se lea antes de 0:03.
- 1:22: el título "La letra chica" y el subtítulo "la letra chica:" repiten la misma frase.
- 1:55: sostener el último cuadro (CTA y sello) 1 s más para que el envío se vea antes del corte.
- 1:32: la "t" suelta junto a la tabla parece un residuo de la pila de herramientas.
- `grilla.png`: asoma un pedazo del subtítulo en el borde inferior de la portada.
- Lo que está bien: el re-gancho de 0:18, el contador de integraciones que sube y los subtítulos que marcan la palabra por decir (sirven sin sonido).
