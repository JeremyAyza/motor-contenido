Informe escrito por Sonnet 5.5 (subagente crítico ciego). Material visto: tiras 01 a 07 con la transcripción al lado, hoja.png, grilla.png y texto-del-post.txt. No pude ver ni oír video.mp4: la voz se juzga por el texto y los tiempos de la transcripción, no por cómo suena.

Paso 1 (en frío)
- De qué trata: de por qué el error rojo de la consola ("blocked by CORS policy") no lo causa CORS. Lo explica con una aduana: el navegador retiene la respuesta del servidor (política de mismo origen) para proteger al usuario, y CORS es el sello con el que el servidor deja pasar. Cierra con la repregunta del DELETE y el preflight OPTIONS.
- Tesis en una frase: CORS no bloquea, es el permiso: el navegador bloquea por la política de mismo origen para proteger al usuario, y el servidor, con Access-Control-Allow-Origin, es quien da permiso. Esa es la respuesta en tres partes para una entrevista.
- Me habría ido en: lo vería entero. El contador "? ? ?" de arriba a la derecha y la promesa de "tres partes" me sostienen. El único tramo donde el pulgar se me iría es de 0:07 a 0:28: el origen (protocolo, host y puerto) y el viaje del fetch, que es base para quien ya trabajó con APIs, y la primera de las tres partes no llega hasta 0:34.
- Qué haría al final: guardar. Es una plantilla de respuesta que se vuelve a consultar antes de una entrevista. Si fuera junior, también lo enviaría.
- A quién se lo mandaría: a un colega que se prepara para entrevistas de frontend, o a uno que lleva días peleándose con ese error rojo y repite que "CORS lo bloquea". El video lo pide casi con esas palabras.

Paso 2 (con el brief)
- ¿Coincide la tesis? No hay brief: `paso-2-brief.md` dice "Sin brief". No puedo certificar un "coincide", pero tampoco veo una contradicción: gancho (0:00), cuerpo (ficha de tres partes) y cierre (1:10) dicen lo mismo, y el texto del post también. La tesis es una lectura que corrige una idea común, no un comunicado de prensa. Juzgada solo con el paso 1, no bloquea.

| Punto | Peso | Puntaje | Por qué |
|---|---|---|---|
| Gancho | 15% | 5 | El primer cuadro trae el error rojo de la consola, el que el público conoce de memoria, y el titular "CORS no te está bloqueando" ya entero. La voz dice lo mismo y a los 4 s el sello PERMISO ya anuncia la vuelta. Sin sonido funciona igual. La portada en `grilla.png` se entiende sola (el subtítulo asoma cortado abajo, sin consecuencias) |
| Tesis | 15% | 5 | Una frase, dicha al inicio y repetida al final casi igual. Corrige algo que el público cree y no repite una definición. Sin brief no hay con qué compararla, pero no hay desvíos |
| Valor | 15% | 4 | Se lleva un modelo mental nuevo (el navegador bloquea, el servidor da permiso), una plantilla para responder y el "por qué en Postman sí funciona". Lo único que podría usar al instante, la línea de Express `app.use(cors({ origin: ... }))`, aparece ~1 s sin que la voz la nombre (1:00) |
| Retención | 10% | 4 | Cambia algo cada 2 s y el contador 1-2-3 sostiene. Resta: 34 s entre la promesa de tres partes (0:05) y la primera (0:34), con la base de origen y fetch en medio (0:07 a 0:28), y los 11 s finales que repiten lo ya dicho. Un tramo flojo, pero no me habría ido |
| Compartible | 10% | 4 | La ficha final (1:12 a 1:18) se entiende sin el resto y se puede capturar; "Postman no pasa por la aduana" (0:36) también. Resta: las subetiquetas de la ficha son diminutas y el CTA "MÁNDASELO" solo aparece en el último segundo |
| Cierre y CTA | 10% | 5 | Cumple la promesa del gancho (la respuesta en tres partes, completa y con sello APROBADA), pide una sola acción específica ("mándaselo a quien todavía dice que CORS lo bloquea") y la última frase vuelve al primer cuadro. Verlo otra vez se siente natural |
| Voz y guion | 5% | 4 | Frases cortas, directas, con "Aquí está la trampa" y "Primera parte" como si se contara en voz alta. El ritmo es rápido (~3,3 palabras por segundo en promedio, ~3,6 en 0:28 a 0:39 y 1:01 a 1:21). No puedo juzgar tropiezos de la voz sintética sin oírla |
| Legibilidad en el celular | 10% | 3 | Los subtítulos son excelentes (grandes, abajo, con la palabra clave resaltada). El problema es el texto secundario: choques en 0:28, 0:42, 1:00 y 1:20, y varios textos de ~6 a 9 px (detalle en el arreglo 1) |
| Recurso visual y composición | 10% | 4 | La metáfora de la aduana es consistente y se adelanta a la voz: la cinta, la barrera, el sello, el desvío de Postman, Café/Té/Pan que cargan al abrirse la barrera. Resta: de 1:12 a 1:18 la ficha queda arriba y debajo hay un hueco de ~30 % del lienzo, y la demo del puerto 3001 (0:16) confunde (ver arreglo 3) |

Promedio ponderado: 4.30

No llega a la puerta B (pide todos los puntos en 4 o más y 4.5 de promedio): lo frena Legibilidad con 3. Con ese punto en 4 y sin cambios en lo demás, el promedio sería 4.40; para 4.5 también hay que subir Valor o Retención a 5.

Tres arreglos, en orden de impacto (con el segundo del video):
1. **Legibilidad (3, 10 %): limpiar los choques y subir el texto chico. Solo imagen, no toca la voz.**
   - 0:42: "A TI" (verde, enorme) y "NO A TU API" (gris) están pegados en la misma línea; la I toca la N. Ponerlos en dos líneas o separarlos.
   - 0:28: dos líneas negras verticales cruzan el código de la ventana del fetch y la etiqueta amarilla "POLÍTICA DE MISMO ORIGEN" tapa la mitad de abajo de la ventana.
   - 1:00: la tarjeta de código de Express tapa la etiqueta NAVEGADOR y la caseta (solo asoma una "N"), y la etiqueta "PERMITE EL SERVIDOR" de la ventana mide ~6 px.
   - 1:20: el sello APROBADA cubre "QUIÉN DA PERMISO" y media palabra de "Access-Control-Allow-Origin", justo el término clave.
   - 0:32: "NAVEGADOR" en rojo roza la cinta.
   - Texto de ~6 a 9 px a 360 px de ancho: las subetiquetas de la ficha ("política de mismo origen", "no a tu API", 1:12 a 1:20), "Ejemplo ilustrativo" (0:00 y 0:44) y el contador RESPUESTA ? ? ? del encabezado.
2. **Valor (4, 15 %): darle tiempo y tamaño a la única línea usable y cerrar el error del gancho. Solo imagen.**
   - `app.use(cors({ origin: 'http://localhost:3000' }))` está en pantalla ~1 s alrededor de 1:00, pequeña, sobre la caseta, mientras la voz solo dice "el servidor". Adelantarla a ~0:56 (cuando el navegador "ve el sello"), más grande, fuera de la caseta, y sostenerla hasta 1:01.
   - El error rojo de 0:00, la imagen más fuerte del gancho, nunca vuelve: no se ve en ningún momento que desaparezca. Usar el hueco de 1:12 a 1:18 (debajo de la ficha) para mostrar esa misma consola, ya sin error, y la línea de Express. Eso tapa el hueco de composición y cierra el bucle con el primer cuadro.
3. **Retención (4, 10 %): acortar la base antes de la parte 1. Cambia la voz: vuelve a la puerta A.**
   - Entre 0:07 y 0:28 no se entrega ninguna de las tres partes. Llevar "Primera parte" a ~0:24 o antes: reducir la definición de origen (0:13 a 0:18) a una frase y fundirla con el viaje del fetch.
   - En 0:16 el sello "OTRO ORIGEN" aparece sobre un frontend ahora en `:3001`, con la API en `:8080`, cuando el video ya había dicho "≠ ORÍGENES" en 0:14: no queda claro otro respecto de qué. Mostrar 3000 y 3001 lado a lado o quitar la demo.
   - Si no se quiere tocar el guion, la alternativa solo visual es rotular el tramo como "antes de la parte 1" para que el contador "? ? ?" no parezca olvidado durante 34 s.

Otras notas (menores, sin arreglo propio):
- En 0:08 y 0:40 el cuadro es casi un puro desenfoque de cámara con solo el subtítulo legible; si esos barridos duran más de ~0,5 s, la imagen no explica nada mientras llega la idea nueva ("¿Y por qué existe?").
- El mismo avatar hace de presentador y de "Entrevistador" (1:02 a 1:10); se entiende por la etiqueta EN VIVO, pero se cruza un poco con "en la entrevista" del gancho.
