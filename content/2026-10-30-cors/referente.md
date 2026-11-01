# Referente: @microappsdev, "Esto te lo van a preguntar sí o sí. Aprende a explicar CORS"

Análisis del 30 de octubre de 2026 para replicar la ESTRUCTURA con la marca de @jacket.dev, con mejor motion graphics y con un avatar en partes del video. Se vio en el reproductor incrustado (`/reel/DfCgdy-i17v/embed/` y `/p/DfCgdy-i17v/embed/captioned/`), sin sesión y sin descargar nada. Limitación: el audio no se oye, así que la transcripción sale de los subtítulos quemados (karaoke) y del texto del post. Los segundos son los del reproductor, con un error de unos 0,3 s.

## 1. Ficha

| Campo | Dato |
|---|---|
| Cuenta | microappsdev (9 publicaciones, 2 K seguidores al 30-oct-2026) |
| URL | https://www.instagram.com/p/DfCgdy-i17v/ (también `/reel/DfCgdy-i17v/`) |
| Duración | 74,53 s (74,533197 según el reproductor). Vertical 720x1280 |
| Fecha de publicación | no se ve en el reproductor incrustado |
| Vistas | no se ven. Sí: 5.742 me gusta y 28 comentarios |
| Texto del post | "Esto te lo van a preguntar si o si. Aprende a explicar CORS #javascript #entrevista #html" |
| Audio | "Audio original" (voz de la presentadora; música o efectos: no se oye) |
| Lectura | 5.742 me gusta con 2 K seguidores es una cuenta pequeña con un Reel que se salió de su público. No se sabe por qué: puede ser el tema (CORS es una duda universal), el gancho o el reparto de Instagram |

## 2. Tema y tesis

- **Tema:** qué es CORS y por qué el navegador te muestra ese error, explicado como respuesta de entrevista.
- **Tesis real:** el error de CORS no lo pone tu servidor, lo pone el navegador; CORS es el mecanismo con el que el servidor le dice al navegador qué otros orígenes pueden leer sus respuestas. Se aplica en el navegador y se arregla en el servidor, "nunca en el frontend".
- **Frase para memorizar (60 a 69 s):** "CORS es el mecanismo con que un servidor le dice al navegador qué otros orígenes pueden leer sus respuestas. Lo aplica el navegador y se configura en el servidor."

## 3. Transcripción (lo que dice la voz, con el segundo en que aparece cada frase)

Fuente: subtítulos karaoke leídos cada 0,5 s. Hasta el 5,7 s no hay subtítulos: no legible.

| Segundo | Voz |
|---|---|
| 0,0 a 5,7 | NO LEGIBLE. La presentadora habla desde el 1,25 s (se le ve la boca moverse) pero no hay subtítulos. Solo se lee el título en pantalla "¿Qué es CORS?" y, de 4,3 s en adelante, la tarjeta de Stack Overflow. No se inventa. |
| 6,4 | Empecemos por lo básico. |
| 7,0 | Tu frontend corre en localhost tres mil |
| 9,0 | y tu API en localhost ocho mil ochenta. |
| 12,0 | Para el navegador, eso son dos orígenes distintos, porque |
| 15,0 | el origen es el protocolo, el dominio y el puerto. |
| 17,0 | Basta con que cambie uno. |
| 19,5 | Y por defecto, el navegador no deja que una página lea respuestas de otro origen. |
| 23,0 | ¿Por qué? Para protegerte. |
| 25,5 | Si no existiera esa regla, cualquier página que visites podría llamar a la API de tu banco con tu sesión abierta y leer tus datos. |
| 31,5 | CORS es la forma de abrir esa puerta a propósito. |
| 34,0 | El servidor responde con un header, Access-Control-Allow-Origin, que dice qué orígenes pueden leer sus respuestas. |
| 42,0 | Y aquí está la trampa: el que bloquea es el navegador, no tu servidor. |
| 45,5 | Muchas veces la petición llega, el servidor responde, pero el navegador no te deja leer la respuesta. |
| 51,5 | Por eso en Postman funciona y en tu página no: Postman no es un navegador. |
| 56,0 | Así que el arreglo nunca está en el frontend. Está en el servidor. |
| 60,0 | Respóndelo así: CORS es el mecanismo con que un servidor le dice al navegador qué otros orígenes pueden leer sus respuestas. |
| 66,8 | Lo aplica el navegador y se configura en el servidor. |
| 69,5 | ¿Cuántas veces te salió ese error? |
| 71,0 | En el próximo video, otra pregunta que te van a hacer sí o sí. |

Unas 220 palabras entre 6,4 y 74,5 s: unas 3,3 por segundo, un habla rápida pero legible.

## 4. El gancho, 0 a 3 s

- **Cuadro 1 (0,0 s):** la consola de Chrome DevTools casi vacía: iconos, el filtro "Filter", "Default levels", "No issues". Fondo gris oscuro. Es un cuadro casi muerto; el gancho real empieza en 0,5 s.
- **0,5 a 1,2 s:** aparece el error real en rojo: `Access to fetch at 'http://localhost:8080/api/productos' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`, más "Failed to load resource: net::ERR_FAILED" y un TypeError "Failed to fetch". A 0,5 s entra una píldora lavanda con "¿Qué es CORS? 🚫"; a 0,9 s un recuadro lavanda rodea el mensaje principal.
- **1,25 s:** corte duro a la presentadora (mujer joven, lentes redondos, pelo largo oscuro con puntas vino, suéter crema de punto, letrero de neón lavanda con "</>", silla gamer, micrófono). La píldora "¿Qué es CORS? 🚫" se queda sobre su pecho hasta 4,3 s.
- **Voz 0 a 3 s:** no legible. Mira a la cámara, sonríe y a los 3,0 s señala a cámara con el dedo (el "tú").
- **Texto en pantalla:** solo "¿Qué es CORS?" (más el error de consola). La frase "ESTO TE LO VAN A PREGUNTAR · SÍ O SÍ" no sale hasta los 5,8 s, en el HUD.

## 5. El mundo

No hay un mundo único. Hay dos bloques que se alternan:

1. **Presentadora en plano medio fijo** (1,25 a 5,75 s y 59,7 a 69,35 s). Un solo plano, cámara fija, sin zoom ni cortes dentro del bloque, gestos con las manos. Es la cara de la cuenta y sale al principio y al final.
2. **Tablero oscuro de interfaz** (5,75 a 59,7 s y 69,35 a 74,5 s). Fondo casi negro con un leve degradado. Arriba, un HUD con la etiqueta "ESTO TE LO VAN A PREGUNTAR · SÍ O SÍ" y una barra de progreso fina que avanza con el tiempo total del video (verificado: 8 % a los 6,2 s, 16 % a los 12 s, 98 % a los 73 s). Abajo, subtítulos karaoke al centro.
   - **Metáfora:** un diagrama de sistema de dos tarjetas. Arriba "Navegador, tu frontend" (con barra de URL y semáforo rojo, amarillo, verde) y abajo "API, localhost:8080". Entre las dos, una flecha (la petición), una línea verde (la respuesta) y un candado rojo (el bloqueo). Los conceptos nuevos entran como chips mono pequeños (`fetch()`, "tu sesión", "200 OK") o como bloques de código pegados bajo la tarjeta API.
   - **Cámara:** fija. No hay paneo, zoom ni profundidad. Todo es 2D plano.
- **Qué está en juego (el "medidor"):** no hay medidor numérico. Lo que se juega es si la línea verde de la respuesta cruza o no el candado rojo, con estados visibles: rojo con candado (bloqueado), verde con check (el servidor sí respondió) y "200 OK" (llegó, pero el navegador no deja leerla). La barra de progreso de arriba es el único contador.
- **Cómo se resuelve:** no hay clímax gráfico. El arreglo es un bloque de código de Express (`app.use(cors({ origin: 'http://localhost:3000' }));`) a los 57,5 s, y el cierre real es la frase para memorizar dicha por la presentadora, sin imagen que la apoye.
- **Paleta y tipografía (de su marca):** casi negro, lavanda como acento, rojo para bloqueo, verde para paso. Sans geométrica tipo Inter para los subtítulos y una mono para URLs y código. Los subtítulos van blancos para lo dicho y grises para lo que falta.

## 6. Escena por escena

| # | Tiempo (s) | Qué se ve | Voz (resumen) | Recurso visual | Cómo entra |
|---|---|---|---|---|---|
| 1 | 0,0 a 1,25 | Consola de Chrome DevTools. Se escribe el error de CORS en rojo, con recuadro lavanda y la píldora "¿Qué es CORS? 🚫" | no legible | Interfaz real (DevTools) y texto | Arranque en frío, grabación de pantalla; la píldora entra con fundido |
| 2 | 1,25 a 4,3 | Presentadora en plano medio; la píldora sigue sobre el pecho; señala a cámara a los 3 s | no legible | La persona | Corte duro; cámara fija |
| 3 | 4,3 a 5,75 | Misma toma. La píldora se cambia por una tarjeta blanca de Stack Overflow: "No 'Access-Control-Allow-Origin' header is present on the requested resource, when trying to get data from a REST API", "Asked 9 years, 5 months ago", "Modified 1 year, 2 months ago", "Viewed 4.4m times" (resaltado con recuadro lavanda). La tarjeta se sale del cuadro por la derecha | no legible | Tarjeta de producto real (Stack Overflow) como prueba social | La tarjeta aparece sobre la persona en unos 0,2 s |
| 4 | 5,75 a 7,5 | Tablero oscuro. Solo HUD (etiqueta y barra) y subtítulo | "Empecemos por lo básico." | HUD | Corte duro a negro |
| 5 | 7,5 a 11,9 | A los 7,5 s aparece la tarjeta "Navegador, tu frontend" con barra `http://localhost:3000`; a los 9,7 s la tarjeta "API, localhost:8080"; a los 10,9 s una línea blanca y el chip `fetch()` las unen | "Tu frontend corre en localhost 3000 y tu API en localhost 8080" | Tarjetas de interfaz, chip mono | Cada tarjeta aparece en su sitio con fundido (no se distingue de dónde viene); sin corte |
| 6 | 11,9 a 13,3 | Tablero vacío (solo HUD y subtítulo) | "Para el navegador, eso son dos orígenes distintos" | Ninguno | Las tarjetas salen; vacío |
| 7 | 13,3 a 19,8 | Dos líneas mono: `http://localhost:3000` y `http://localhost:8080`. Un recuadro se mueve por partes y sigue la voz: 16,0 s "http://" (protocolo), 16,6 s "localhost" (dominio), 17,1 s ":3000" y ":8080" (puerto, recuadro rojizo) | "el origen es el protocolo, el dominio y el puerto; basta con que cambie uno" | Texto mono con resaltado sincronizado | Las líneas aparecen; los recuadros pasan al ritmo de la voz |
| 8 | 19,8 a 22,0 | Vuelven las dos tarjetas, sin línea | "Y por defecto, el navegador no deja que una página lea respuestas de otro origen" | Tarjetas | Entran de nuevo |
| 9 | 22,0 a 25,5 | Flecha blanca del Navegador a la API; a la derecha sube una línea verde; a los 23,5 s una barra roja con candado la corta y el borde de la tarjeta Navegador se pone rojo | "¿Por qué? Para protegerte." | Flecha, línea verde, barra roja y candado | Líneas que se dibujan; el candado aparece |
| 10 | 26,0 a 27,4 | Tablero vacío | "Si no existiera esa regla, cualquier página que visites" | Ninguno | Las tarjetas salen; vacío |
| 11 | 27,4 a 31,5 | Un marco punteado (hipótesis) rodea todo. La barra del navegador dice `https://sitio-cualquiera.com`; la tarjeta de abajo ahora es "banco.com, /api/saldo"; el chip "🍪 tu sesión" va sobre la flecha | "podría llamar a la API de tu banco con tu sesión abierta y leer tus datos" | Escenario hipotético, chip de cookie | El marco punteado entra; las tarjetas cambian de texto |
| 12 | 31,8 a 36,4 | Vuelve el escenario localhost: flecha y barra roja con candado | "CORS es la forma de abrir esa puerta a propósito" | Los mismos | Cambio de texto en las tarjetas. No se dibuja ninguna "puerta" |
| 13 | 36,4 a 41,7 | Bajo la tarjeta API aparece pegado un bloque de código: `HTTP/1.1 200 OK / Access-Control-Allow-Origin: http://localhost:3000`. A los 39,5 s una línea verde cruza el candado | "El servidor responde con un header, Access-Control-Allow-Origin, que dice qué orígenes pueden leer sus respuestas" | Bloque de código, línea verde | El bloque aparece bajo la tarjeta |
| 14 | 41,7 a 43,5 | Solo las dos tarjetas, sin líneas | "Y aquí está la trampa: el que bloquea es" | Ninguno | Limpieza del tablero |
| 15 | 43,5 a 49,0 | Aparece la barra roja con candado y el borde rojo del Navegador; a los 46 s la tarjeta API se pone verde con un check; a los 48 s sale la flecha | "el navegador, no tu servidor. Muchas veces la petición llega, el servidor responde" | Estados de color, check | Cambios de borde y check |
| 16 | 49,0 a 51,7 | Línea verde con chip "200 OK" y el Navegador con una X roja | "pero el navegador no te deja leer la respuesta" | Chip de estado, X | Aparecen en vivo |
| 17 | 51,7 a 56,0 | La tarjeta Navegador se sustituye por "Postman" (logo naranja, check verde); a los 53,5 s entra una tarjeta "tu página" (barra `localhost:3000`, X roja); dos líneas paralelas bajan a la API; la de Postman pasa, la de la página se bloquea con el candado | "Por eso en Postman funciona y en tu página no: Postman no es un navegador" | Logo de Postman (producto real), dos carriles en paralelo | Sustitución y entrada de la segunda tarjeta |
| 18 | 56,0 a 59,7 | A los 57,5 s aparece bajo la API el bloque `// en el servidor (Express)` / `app.use(cors({ origin: 'http://localhost:3000' }));` | "el arreglo nunca está en el frontend, está en el servidor" | Bloque de código de Express | Aparece bajo la tarjeta |
| 19 | 59,7 a 69,35 | Presentadora, mismo plano; subtítulos blancos sobre el suéter (poco contraste). Gesto de "así" con las dos manos y, hacia los 62 s, señala con los dos índices | "Respóndelo así: CORS es el mecanismo... Lo aplica el navegador y se configura en el servidor" | La persona | Corte duro; sin gráfico alguno |
| 20 | 69,35 a 74,53 | Tablero oscuro con HUD y barra al 100 %. Tarjeta de cierre: "PRÓXIMO · ESTO TE LO VAN A PREGUNTAR" y, en lavanda grande, "otra pregunta" con "sí o sí" debajo | "¿Cuántas veces te salió ese error? En el próximo video, otra pregunta que te van a hacer sí o sí" | Tarjeta de capítulo siguiente | Corte duro; la tarjeta aparece con fundido hacia los 69,5 s |

Subtítulos: karaoke de 2 a 4 palabras por pantalla, centrado a un 70 % de la altura. Blanco para lo dicho y gris para lo que falta. Sin subtítulos de 0 a 5,7 s. Sobre la presentadora, blanco sobre suéter beige: cuesta leerlos. Sonido: no se oye; no se puede decir si hay música o efectos.

## 7. El ritmo

Se cuentan los cambios visuales distintos de los subtítulos (entra o sale una tarjeta, una línea, un chip, un resaltado o un corte).

| Tramo | Cambios | Nota |
|---|---|---|
| 0 a 10 s | 9 | El más denso: error, píldora, recuadro, corte, tarjeta SO, corte, HUD, dos tarjetas |
| 10 a 20 s | 7 | Línea y chip, vacío, URLs y 3 resaltados, tarjetas |
| 20 a 30 s | 6 | Flecha, candado, vacío, marco punteado, banco |
| 30 a 40 s | 4 a 5 | Candado, bloque de código, línea verde |
| 40 a 50 s | 5 | Limpieza, candado, check, flecha, 200 OK |
| 50 a 60 s | 5 | Postman, "tu página", código, corte |
| 60 a 70 s | 2 | Un solo plano casi 10 s y el corte a la tarjeta final |
| 70 a 74,5 s | 0 | Tarjeta estática |

Unos 38 cambios en 74,5 s: aproximadamente 5 cada 10 s. Solo 4 cortes duros (1,25, 5,75, 59,7 y 69,35 s); dentro del tablero nunca hay corte, todo es entrada de elementos.

**Se queda quieto más de 2 s** (solo cambian los subtítulos):
- 1,25 a 4,3 s: presentadora con la píldora, 3 s.
- 60,0 a 69,35 s: presentadora, 9,3 s, el tramo más largo y el de más valor (la respuesta que hay que memorizar).
- 69,7 a 74,5 s: tarjeta de cierre estática, casi 5 s.
- Al límite de 2 s: 20 a 22 s y 41,7 a 43,5 s (tarjetas sin cambio), y los vacíos de 11,9 a 13,3 s y 26 a 27,4 s (menos de 2 s).

## 8. El cierre

- **Cómo termina (69,35 a 74,53 s):** la presentadora cierra con la respuesta de entrevista, y después un tablero oscuro con la tarjeta "PRÓXIMO · ESTO TE LO VAN A PREGUNTAR / otra pregunta / sí o sí". La voz, sobre esa tarjeta, hace una pregunta ("¿Cuántas veces te salió ese error?") y anuncia el siguiente video.
- **CTA:** implícito. No pide seguir, guardar, comentar ni compartir, y no dice el nombre de la cuenta en voz ni en pantalla. El único pedido es "en el próximo video, otra pregunta", es decir, un gancho de serie. La pregunta ("¿Cuántas veces te salió?") invita a comentar solo si se lee así.
- **El bucle:** el video no vuelve al cuadro 1; el cierre repite la frase del título ("sí o sí") y la barra de progreso llega al 100 %.

## 9. Dónde está flojo (lo que vamos a superar)

1. **Los primeros 5,7 s no dicen nada que se pueda leer.** Sin subtítulos, y lo único legible es el título "¿Qué es CORS?", que repite lo que el post ya dice. Quien ve sin sonido no recibe ni la promesa ("te lo van a preguntar") hasta los 5,8 s. El cuadro 1 es una consola vacía.
2. **La promesa del gancho no se prueba.** "Te lo van a preguntar sí o sí" no muestra quién pregunta, en qué entrevista ni en qué empresa. Es una afirmación sin evidencia. La respuesta de entrevista llega recién a los 60 s, tras el 80 % del video.
3. **Quieta justo donde importa.** Los 9,3 s de la respuesta que hay que memorizar son un plano fijo con subtítulos blancos sobre un suéter beige, con poco contraste y sin ningún gráfico que repita la definición.
4. **El tablero es genérico.** Dos tarjetas y una flecha durante 54 s. No hay cámara, profundidad ni metáfora; el "mundo" es un diagrama de sistema sin personalidad. El HUD y la barra de progreso nunca cambian de contenido (no hay capítulos).
5. **Dice sin mostrar:**
   - "Basta con que cambie uno" (17 a 18 s): resalta las partes de la URL, pero no enseña un contraejemplo (http a https, 3000 a 3001) y no muestra que el origen cambia.
   - "CORS es la forma de abrir esa puerta a propósito" (31,5 s): no hay puerta; el candado sigue puesto.
   - La amenaza del banco (27 a 31 s) es una escena de hipótesis; no se ve ningún ataque ni qué datos se roban.
6. **Simplificaciones que suenan a error de entrevista:**
   - Nunca se lee el nombre de la política de mismo origen (Same-Origin Policy), que es la regla que bloquea; CORS es la forma de relajarla. El video dice "por defecto, el navegador no deja..." sin darle nombre, y ese es el término que un entrevistador espera.
   - "El arreglo nunca está en el frontend" es absoluto: durante el desarrollo, un proxy del servidor de desarrollo (Vite, webpack) o servir todo desde el mismo origen resuelve el error sin tocar la API.
   - No cubre la petición previa (preflight, OPTIONS), las credenciales ni el comodín `*`, que son justo las preguntas siguientes de una entrevista. El post promete "aprende a explicar CORS" y entrega la mitad.
   - El código muestra `app.use(cors(...))` sin decir que viene del paquete `cors` (ni cómo se instala).
   - "Muchas veces la petición llega" es cierto para peticiones simples; con preflight, la petición real no se envía. No lo diferencia.
7. **Datos sin fuente:** la tarjeta de Stack Overflow ("Viewed 4.4m times", "Asked 9 years, 5 months ago", "Modified 1 year, 2 months ago") no tiene enlace ni fecha de captura. Esas cifras cambian.
8. **Fallos de composición:** la tarjeta de Stack Overflow se sale del cuadro por la derecha y se corta el título ("on the reque..."); los subtítulos sobre la presentadora son difíciles de leer sobre el suéter.
9. **CTA débil:** no pide seguir ni guardar y no nombra la cuenta, a pesar de que el video está construido como serie.
10. **Sin audio verificable:** no se pudo oír, así que no se sabe si hay música, efectos o cuánto se mueve el sonido con las entradas. Hay que verlo con sonido antes de decidir ese punto.

## 10. Qué momentos piden presentador y cuáles no

**Piden presencia (cara, mirada, gesto):**
- 0 a 6 s: el gancho y el "tú" (ella señala a cámara a los 3 s). Una persona que habla a cámara sube la confianza y da el tono de entrevista.
- 42 s, "aquí está la trampa": un giro del argumento, donde una reacción (ceja, dedo) ayuda más que otra flecha.
- 60 a 69 s, "respóndelo así": la frase para memorizar. Si va un presentador, que sea con un gesto de cierre y el texto de la definición en pantalla, no solo subtítulos.
- 69,5 a 74,5 s: la pregunta al público y el anuncio de lo que viene.

**No piden presencia:**
- 6 a 59 s: el recorrido del diagrama. La persona no aporta nada y compite con la interfaz; la voz en off basta.
- Los bloques de código, los logos y las barras de URL.
- Los momentos de "mostrar" (el candado, la pasada de la línea verde): ahí manda el gráfico.

**Para el avatar de @jacket.dev (propuesta):** presentador pequeño en la esquina durante el diagrama (reaccionando a cada candado y check), a pantalla grande solo en el gancho, el giro y el cierre.

## 11. Para copiar y lo que no

### Se puede llevar (estructura y recursos)

1. **Apertura en frío con el error real** de consola (0 a 1,25 s). El error es el dolor reconocible y no necesita explicación.
2. **Título como píldora** con la pregunta ("¿Qué es CORS?").
3. **Prueba social con una tarjeta de producto real** (Stack Overflow con "Viewed 4.4m times") durante el gancho. Se recrea fiel según la regla 6 de `AGENTS.md`; la cifra se verifica el día de la pieza y se fecha.
4. **Orden de la explicación:** "Empecemos por lo básico" y un caso concreto (3000 y 8080); la regla (origen = protocolo + dominio + puerto); el comportamiento por defecto; el porqué con una amenaza concreta (el banco); la solución (el header); el giro ("la trampa: el que bloquea es el navegador"); la prueba (Postman); dónde se arregla (el servidor); la frase para memorizar; el aviso de la próxima pregunta.
5. **Diagrama de dos tarjetas** con estados de color (rojo bloqueado, verde pasa, "200 OK" llegó) y chips (`fetch()`, cookie, estado). Funciona porque se lee en un segundo.
6. **Resaltado de la URL por partes sincronizado con la voz** (protocolo, dominio, puerto).
7. **Bloques de código pegados bajo la tarjeta** del servidor, en el momento exacto en que se dicen.
8. **Subtítulos karaoke** (blanco dicho, gris pendiente) con 2 a 4 palabras.
9. **HUD fijo arriba** (etiqueta y barra de progreso total).
10. **Frase para memorizar** dicha por la presentadora ("Respóndelo así"), como cierre de aprendizaje.
11. **Tarjeta de serie al final** ("PRÓXIMO · ...") que anuncia otra pregunta.
12. **Logos e interfaces de productos reales** que usa: Chrome DevTools, Stack Overflow, Postman, la barra de un navegador. No son de su marca; se recrean fieles por la regla 6.

### No se lleva (es su marca)

- La presentadora, su letrero de neón con "</>", la silla gamer y el plano.
- La frase "Esto te lo van a preguntar sí o sí" (su firma) y el nombre de la serie.
- Su paleta (casi negro con acento lavanda) y la píldora lavanda; el nuestro lleva el acento de @jacket.dev.
- Las tarjetas "Navegador / API" tal cual: el nuestro tiene que tener su propio mundo.

## 12. Cómo superarlo (ideas para el guion y el motion)

- **Mundo con cámara.** Convertir el diagrama en un lugar por el que la cámara se mueve (el navegador y el servidor como dos edificios, con la petición como un mensajero), en lugar de un tablero plano de 54 s.
- **Mostrar el contraejemplo.** Un cambio de 3000 a 3001 que rompe el origen; una puerta de verdad que se abre con la cabecera.
- **Gancho legible sin sonido.** Error, título y promesa en los primeros 2 s, con subtítulos desde el cuadro 1.
- **Cubrir la mitad que falta:** preflight, credenciales y comodín, con una frase memorable y la fuente (MDN) citada en pantalla.
- **Usar los 9 s finales** con un gráfico animado de la definición mientras el avatar la dice.
- **Avatar** a pantalla grande en gancho, giro y cierre, y en esquina durante el diagrama.
- **Cierre con CTA claro** y el mismo gancho de serie.

## 13. Lista para verificar (tal cual la dice el video)

**Datos del reproductor:** 74,53 s; 5.742 me gusta; 28 comentarios; 2 K seguidores; 9 publicaciones (al 30-oct-2026). No se vio fecha ni vistas.

**Afirmaciones técnicas:**
1. "El origen es el protocolo, el dominio y el puerto. Basta con que cambie uno." (verificar contra MDN; el dominio incluye el subdominio)
2. "Por defecto, el navegador no deja que una página lea respuestas de otro origen." (política de mismo origen)
3. "Si no existiera esa regla, cualquier página que visites podría llamar a la API de tu banco con tu sesión abierta y leer tus datos." (matizar con SameSite de las cookies, por defecto Lax en los navegadores modernos)
4. "CORS es la forma de abrir esa puerta a propósito."
5. "El servidor responde con un header, Access-Control-Allow-Origin, que dice qué orígenes pueden leer sus respuestas."
6. "El que bloquea es el navegador, no tu servidor."
7. "Muchas veces la petición llega, el servidor responde, pero el navegador no te deja leer la respuesta." (peticiones simples; con preflight no llega)
8. "En Postman funciona y en tu página no: Postman no es un navegador." (Postman no aplica CORS)
9. "El arreglo nunca está en el frontend. Está en el servidor." ("nunca" es absoluto; ver proxy de desarrollo)
10. "CORS es el mecanismo con que un servidor le dice al navegador qué otros orígenes pueden leer sus respuestas. Lo aplica el navegador y se configura en el servidor."

**Textos y cifras en pantalla:**
- Error de consola: `Access to fetch at 'http://localhost:8080/api/productos' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`, "Failed to load resource: net::ERR_FAILED" y "Failed to fetch" (formato real de Chrome; confirmar).
- Tarjeta de Stack Overflow: título "No 'Access-Control-Allow-Origin' header is present on the requested resource, when trying to get data from a REST API"; "Asked 9 years, 5 months ago"; "Modified 1 year, 2 months ago"; "Viewed 4.4m times". Falta el enlace y la fecha de captura; verificar la pregunta real y sus cifras de hoy.
- Puertos: localhost:3000 (frontend) y localhost:8080 (API); ruta `/api/productos`; escenario hipotético `https://sitio-cualquiera.com` y `banco.com /api/saldo`.
- Cabecera mostrada: `HTTP/1.1 200 OK` y `Access-Control-Allow-Origin: http://localhost:3000`.
- Código mostrado: `// en el servidor (Express)` y `app.use(cors({ origin: 'http://localhost:3000' }));` (paquete `cors`; falta el `require` o `import` y la instalación).
- Herramienta nombrada: Postman. Marcas con logo o interfaz: Chrome DevTools, Stack Overflow, Postman.
- Etiqueta fija: "ESTO TE LO VAN A PREGUNTAR · SÍ O SÍ"; tarjeta final: "PRÓXIMO · ESTO TE LO VAN A PREGUNTAR / otra pregunta / sí o sí".
- No legible / no se oye: la voz entre 0 y 5,7 s, y cualquier música o efecto de sonido.
