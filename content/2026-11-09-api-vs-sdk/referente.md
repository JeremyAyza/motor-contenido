# Referente: API vs SDK, de @rick.theengineer

Análisis hecho en el reproductor incrustado (`/embed/`), sin sesión, mirando un cuadro por segundo (cada 0,25 a 0,5 s en los primeros 3 s y en las entradas y salidas de Rick). Las medidas están en el lienzo de 540×960 (de arriba abajo, en px, con un margen de unos 15 px). El audio no se oye en este entorno: lo dicho sale de los subtítulos quemados y del texto del post. Las frases de la voz van resumidas por beat, no transcritas; el guion exacto se lee en los subtítulos del embed y en el texto del post (`/embed/captioned/`, con `get_page_text`).

## 1. Ficha

- **Cuenta:** @rick.theengineer (561 mil seguidores, 164 publicaciones).
- **URL:** https://www.instagram.com/p/DfXOuMOMAu9/
- **Duración exacta:** 101,524 s (`duration` del `<video>`), 720×1280. Para el `target`: 101,5 s (rango de ±10 %: 91 a 112 s).
- **Fecha:** 5 de noviembre de 2026, decodificada del código del post (el embed no la muestra).
- **Vistas:** no se ven. 4.980 a 4.988 me gusta y 22 comentarios al leerlo.
- **Idioma:** inglés (voz y subtítulos). La réplica va en español: hay que reescribir para el oído.
- **Voz:** "Audio original", que no se oye aquí. Ritmo de unas 230 palabras en 101 s (2,3 por segundo), estimado de los subtítulos. Música y efectos: no se oye.
- **Etiquetas:** #api #sdk #webdev #coding #softwareengineering.

## 2. El gancho, 0 a 3 s

- **Cuadro 1 (0,0 s):** un muro de código oscuro (fondo navy, `checkout.js` de 40 líneas con números de línea y colores de sintaxis) que se desplaza hacia arriba en bucle. Sin título y sin subtítulo todavía: el objeto es el código en movimiento.
- **0,25 s:** entra el primer subtítulo: la pregunta por la diferencia entre API y SDK.
- **~1,1 s:** una ficha gigante "API" (degradado violeta, unos 330×185 px, y 160 a 345) entra con resorte sobre el código.
- **~1,9 s:** la caja de herramientas naranja con la placa "SDK" irrumpe sobre el código, con un aro de ondas.
- **~2,3 s:** cuña diagonal. El fondo pasa de navy a claro, con el degradado violeta arriba (la API) y lo claro abajo; la ficha API sube y la caja queda debajo, con una cinta oscura de una línea de código.
- **Texto en pantalla:** solo "API" y "SDK" (2 palabras, ambas dentro de objetos).
- **Lo dicho (hasta ~6,5 s):** la pregunta, que suenan parecido, que la gente los confunde y que no son lo mismo.
- **El gancho es un versus visual:** API arriba (violeta) y SDK abajo (naranja; a los 5,5 s el fondo de abajo se tiñe de durazno).

## 3. El mundo y el aspecto

**El mundo.** No hay un escenario físico que dure todo el video. Es un lienzo de explicación plano con un marco fijo (conmutador API|SDK arriba y subtítulos en píldora) sobre el que cambian objetos y fondos por capítulos: claro para explicar, navy para el problema, menta para Android, degradado violeta más claro para el repaso. La cámara casi no se mueve: hay un zoom-out a los 14,8 s, un desenfoque con deslizamiento a los 25 y 33 s y cuñas diagonales de color entre escenas. El movimiento es de elementos: pops con resorte, tarjetas que viajan, líneas que se dibujan, contadores.

**Presentador.** Rick: ilustración 2D de cuerpo entero (pelo azul, sudadera negra, laptop con calcomanías bajo el brazo). Pose fija, sin animación; solo fundido o pop. Entra 4 veces y siempre ocupa la columna izquierda; los objetos del escenario se corren a la derecha cuando está.

### Apariciones de Rick (una línea por aparición)

1. **6,9 a 14,6 s** (7,7 s): fundido de entrada de 0,6 s justo después del corte (6,8 s), al empezar la frase de "imagina que construyes una app". Sale de golpe a los 14,5 a 14,8 s, al cerrar la frase del "como Stripe" (límite de frase). Escena del checkout y las tareas de pagos.
2. **25,5 a 32,6 s** (7,1 s): entra con pop **dentro de una frase** ("piénsalo como el menú de un restaurante"), a los 25,4 a 25,7 s, cuando el menú aterriza. Sale a los 32,5 a 32,8 s, al terminar "en la cocina", con el desenfoque del corte. Escena del menú.
3. **46,4 a 50,2 s** (3,8 s): entra tenue y se aclara a los 46,3 a 46,8 s, **dentro de** "pero aquí está el problema", cuando la cuña navy ya cubrió el cuadro. Sale entre frases (50,0 a 50,4 s), cuando la tarjeta de código se agranda. Escena de la lista de tareas.
4. **85,0 a 94,4 s** (9,4 s): fundido de entrada desde los 85,0 s (casi transparente) hasta los 85,6 s, al empezar la frase del "modelo mental". Se desvanece a los 94,2 a 94,7 s, al terminar "en el lenguaje que ya escribes" (límite de frase). Escena del repaso.

Total: unos 28 s de 101 (28 %). Nunca está en los diagramas técnicos puros (gancho, petición y respuesta, SDK, Android) ni en el cierre.

**Dónde está y cuánto mide.** Caja de Rick: x 42 a 128, y 397 a 685 (unos 85×290 px, el 30 % del alto), con los pies en y ~685 y una sombra elíptica gris (#D5DBE3) de x 20 a 152, y 680 a 698. No toca los subtítulos (y 720 a 776). El hueco libre para él es la columna x 20 a 150, y 395 a 690; el contenido de esas escenas ocupa x 160 a 510.

### El aspecto, con medidas (lienzo 540×960)

**Fondo.**
- Claro: #F3F6F9, con 5 líneas verticales finas (#E8EDF3, 1 px) cada 120 px (x = 32, 152, 272, 392, 512). Es la textura. No hay líneas en las escenas oscuras ni en la menta.
- Oscuro: navy #0E2440 plano (capítulo del problema, 45,8 a 57,5 s, y la apertura del código). Tarjetas oscuras un tono más claro (#13294B).
- Tintes de capítulo: durazno #FCE6D9 (SDK en el gancho y en el repaso), menta #E6F8EE (Android), degradado azul a violeta arriba con diagonal (gancho, repaso y cierre).

**Zonas (de arriba abajo).**
- 0 a 110: vacío. No hay barra ni título fijo arriba.
- 112 a 142: conmutador **API | SDK**, píldora blanca de unos 150 px de ancho centrada (x 195 a 345) con dos segmentos; el activo se llena (violeta #5B5BF0 para API, naranja #F26A2E para SDK). Aparece a los 6,8 s y dura hasta el final; no está en los primeros 6,5 s del gancho.
- 150 a 205: nodo "your app" (píldora blanca de ~165×49 con ícono de ventana), solo en los flujos verticales.
- 150 a 370: título de acrónimo (3 líneas alineadas a la izquierda en x 32) cuando lo hay; si no, la tarjeta o el objeto principal empieza en y ~157.
- 150 a 700: escenario (el 57 % del cuadro); el objeto del momento mide entre 240 y 480 px de ancho.
- 395 a 690: Rick, a la izquierda (x 20 a 150), cuando está.
- 720 a 776: subtítulos, píldora blanca de 54 px de alto, centrada, ajustada al texto.
- 790 a 960: vacío (170 px), salvo la cuña de color de la escena siguiente, que asoma en y 880 a 960 (navy de 33 a 45 s, verde menta de 69 a 76 s).

**Qué persiste y cómo cambia.**
- Persisten: el conmutador API|SDK (cambia de segmento según lo que se explica), los subtítulos, la rejilla fina en las escenas claras, la ficha "Stripe" (de los 13 a los 45 s y otra vez en el cierre) y la caja de herramientas (en el gancho, de 57 a 78 s, de 89 a 94 s y como fantasma en el cierre).
- Cambian: la caja pasa de cerrada a abierta (63 s), a contorno naranja "rayos X" (75,5 s) y a mini (79 s); la tarjeta `checkout.js` vuelve 3 veces (46, 69 y 71 s) con 0, 40 y 1 línea; la ficha API se achica (la gigante del gancho mide 330 px, las de los diagramas 260 px).
- Se limpia: en cada escena nueva, todo lo demás (diagonal, desenfoque o corte duro). Los objetos no se acumulan entre capítulos, salvo los persistentes.

**Títulos.**
- Acrónimo "Application Programming Interface": ~48 px, peso 800, alineado a la izquierda (x 32), 3 líneas con interlineado de ~67 px, navy #0F2540; las iniciales A, P, I en violeta #5B5BF0. Primero aparecen las 3 letras apiladas y grandes (~64 px) y luego se completan las palabras.
- "Software Development Kit": mismo tamaño, texto blanco sobre navy, iniciales S, D, K en naranja #F26A2E.
- Cifra enorme: "$20.00" de ~90 px, peso 800, navy, dentro de una tarjeta blanca de ~380×105. "40 → 1": el 40 de ~120 px navy, tachado con una raya roja, flecha gris, y el 1 de ~170 px naranja.
- Ficha "API": 100 px, blanco, peso 800 sobre degradado violeta en el gancho; 60 px en los diagramas.
- No hay título de capítulo: el rótulo es el propio objeto. Se resalta una palabra por color (la inicial del acrónimo o la palabra activa del subtítulo).

**Subtítulos.** Píldora blanca (#FFFFFF), radio ~14, sombra suave (0 6 20 al 12 %), centrada en y 747, de 2 a 4 palabras por píldora (14 a 28 caracteres) que cambia cada ~0,7 s. Letra tipo Inter de ~27 px, peso 700. Karaoke: la palabra activa en navy casi negro (#0F2540) y las demás en gris pizarra (#5B6577).

**Texto de interfaz.** Mucho y chico: es el sello del video. Código en mono de ~11 px (30 a 40 líneas por tarjeta), conmutador en mono bold de 12 a 13 px, rótulos de tarjeta de 13 a 17 px, ítems del menú en serif de ~21 px y su título en serif de ~42 px, lista de tareas en bold de ~20 px, rótulos de ficha de 15 a 16 px. Por cuadro: de 5 a 25 elementos de texto chico (40 líneas en los cuadros de código). Ojo: el código de ~11 px queda bajo el mínimo de 12 px del inspector para `data-ui`.

**Colores con función (por tono).**
- Violeta/índigo #5B5BF0 (y degradado azul #3D8BF5 a violeta #7B4DFF): la API y el tercero (Stripe): ficha API, segmento activo, iniciales, rutas resaltadas, líneas activas del flujo.
- Naranja #F26A2E (luces #FF8A50): el SDK: caja de herramientas, S-D-K, segmento activo, el "1".
- Navy #0F2540 / #0E2440: texto principal y mundo del problema; tarjetas de código y de respuesta JSON.
- Gris azulado claro #F3F6F9: el mundo base de explicación.
- Verde #D9F7D0 con texto #2A7A3B (mono bold): éxito ("200 OK", "payment created", chips con check).
- Rojo/rosa #FDE4E6 con texto #C2334D: error (402 card_declined, ECONNRESET) y la raya del "40".
- Crema #FDF8E6: el menú (papel).
- Menta #E6F8EE y verde Android #3DDC84 / #1F6B3A: la escena de Android.
- Durazno #FCE6D9: tinte del SDK en el fondo.

**Materiales y acabado.** Interfaz plana en tarjetas blancas: radio de 8 a 10 px, sin borde, sombra grande y suave (aprox. 0 10 30 al 12 % navy). Tarjetas oscuras con sombra y un borde casi invisible. Rick es ilustración 2D (vector) con sombra de contacto elíptica. La caja de herramientas es un **render 3D** (brillo metálico en los cierres, sombra suave): es el único objeto 3D, y después reaparece como contorno naranja "rayos X". El globo es una esfera punteada gris claro (halftone) con un pin violeta. Las fichas de color llevan degradado tipo malla con ruido suave. Los logos reales (Stripe, Android, Python, JS, Go, Ruby, Java, PHP, .NET) van planos, en fichas blancas de ~65 px con esquinas redondeadas.

**Cuadros del aspecto (12 s, para `video:comparar`):** 0, 3, 8, 28, 44, 52, 60, 66, 72, 82, 91, 100.

## 4. Escena por escena

La voz va resumida por beats, no transcrita (ver arriba).

| Tiempo | Qué se ve | Qué se dice (resumen) | Recurso visual | Cómo entra |
|---|---|---|---|---|
| 0,0 a 2,3 | Muro de código navy que sube en bucle; ficha "API" gigante (1,1 s) y caja SDK (1,9 s) | Pregunta: en qué se diferencian API y SDK | Código, ficha, objeto 3D | Directo; pop con resorte |
| 2,3 a 6,6 | Fondo dividido en diagonal: violeta arriba (API), claro y luego durazno abajo; caja SDK; cinta con una línea de código | Suenan parecido, se confunden, no son lo mismo | Objeto, línea de código | Cuña diagonal |
| 6,8 a 11 | Tarjeta de checkout (Pro plan $20, botón Pay) a la derecha; Rick a la izquierda; cursor que pulsa el botón (9,5 s) | Imagina que construyes una app y quieres cobrar | Interfaz de checkout, avatar | Corte duro; Rick con fundido |
| 11 a 14,6 | 9 fichas blancas (redes de tarjeta, bancos, fraude, PCI, reembolsos, disputas, pagos, libro mayor, impuestos) que saltan una a una y se desordenan (12 s); entra la ficha Stripe (13 s) con aro de ondas (14 s) | No vas a construir todo eso: usas una empresa que ya lo resuelve | Tarjetas, logo | Pop escalonado |
| 14,8 a 17,3 | Zoom-out: checkout chico arriba, línea gris con "?" y la ficha Stripe abajo | Pero cómo habla tu app con ellos | Diagrama de 2 nodos con "?" | Zoom-out; Rick sale |
| 17,3 a 19 | La ficha "API" cae entre los dos nodos; la línea se vuelve violeta; el conmutador pasa a API | Ahí entra la API | Ficha, línea que se pinta | Resorte |
| 19 a 21,5 | Letras A, P, I apiladas a la izquierda; se completan "Application Programming Interface" | Qué significa la sigla | Título de acrónimo | Letras apiladas y luego palabras |
| 21,5 a 25 | Tarjeta contrato: METHOD, ADDRESS, SEND, GET BACK; chips "your software" y "their software" con un punto violeta que viaja (23,5 s) | Reglas que definen cómo un software habla con otro | Tarjeta de contrato, mono | Filas fantasma que se solidifican; desenfoque al salir |
| 25 a 31 | Menú de restaurante crema, serif; entra inclinado (perspectiva) y se aplana; filas resaltadas en lila; chips violeta en "needs" y "serves"; Rick a la izquierda (desde 25,5 s) | Analogía: el menú dice qué puedes pedir y qué recibes, sin ver la cocina | Menú serif, resaltador | Aterriza inclinado; Rick con pop |
| 31 a 32,7 | Franja degradada bajo el menú con fichas que se deslizan en 2 filas (Issuing bank, Ledger, Payout queue, 3-D Secure, Fraud model, Card network): "la cocina"; el menú se achica y sube | Lo que pasa en la cocina no hace falta saberlo | Marquesina de fichas | Entra desde abajo; Rick sale |
| 33 a 36 | Nodo "your app" arriba, línea gris, Stripe abajo; cuña navy asoma abajo | En una API web tu app manda una petición por internet a una dirección | Diagrama vertical | Desenfoque + deslizamiento |
| 36 a 40,5 | Globo punteado; tarjeta de petición (POST /v1/payment_intents, amount 2000, currency usd) que baja por la línea; chip "POST api.stripe.com/…" arriba; la tarjeta crece y luego queda "$20.00" enorme | Algo como "crear un pago de 20 dólares" | Globo, tarjeta de petición, cifra | Tarjeta que viaja por la línea |
| 41 a 45,8 | Nota "$20.00, written in cents"; spinner en Stripe; chip verde "200 OK"; tarjeta oscura de respuesta JSON (id, object, amount, currency, status) | El servidor procesa y responde con datos estructurados, JSON | Chip de estado, tarjeta JSON oscura | Pop; la tarjeta sube desde Stripe |
| 45,8 a 47,5 | La cuña navy cubre el cuadro; tarjeta oscura `checkout.js` (0 lines) con etiquetas auth, format, errors, retry; Rick entra (46,4 s) | Aquí está el problema | Editor oscuro | Cuña diagonal |
| 47,5 a 50,2 | Lista de 5 tareas con casillas vacías que aparecen una a una (petición, autenticación, formato, errores, reintentos), a ~48 px de intervalo | Hablar con una API directo es tedioso | Lista de tareas | Una por una con la voz; Rick sale a los 50,2 s |
| 50,4 a 57,5 | La tarjeta se agranda (casi todo el ancho, y 154 a 696) y se escribe el código; contador de líneas 3, 7, 10, 15, 22, 29, 37, 40; las etiquetas se encienden en orden; avisos "402 card_declined" (55 s) y "ECONNRESET retry 2 of 3" (57 s) | Armar cada petición a mano, auth, formato, errores y reintentos | Código que se escribe, contador, avisos rojos | Se agranda; escritura |
| 57,5 a 63 | La caja SDK cae sobre el código atenuado; conmutador a SDK; letras S, D, K en naranja y "Software Development Kit"; brillo naranja detrás | Ahí entra el SDK y qué significa la sigla | Objeto 3D, título naranja | Caída con resorte |
| 63 a 65 | La caja se abre y muestra libros y piezas; el fondo navy pasa a claro (63,5 s) | Un paquete de herramientas que facilita construir sobre una plataforma | Objeto 3D abierto | Apertura; fondo claro |
| 65 a 69,5 | Tres tarjetas con borde durazno sobre la caja (code libraries, documentation, examples) que se llenan: npm/pip + logos JS, Python, Go, Ruby; documento con `create()`; ejemplo de código | Incluye librerías para tu lenguaje, documentación y ejemplos | Tarjetas, logos reales | Fantasmas que se llenan |
| 69,5 a 72 | Vuelve `checkout.js` (40 líneas) en claro; "40 → 1": el 40 tachado en rojo, flecha, el 1 naranja enorme; tarjeta de 1 línea con pestañas cURL, Python, Node | En vez de todo eso, llamas una sola función | Contador 40 a 1, código de 1 línea | Corte; la tarjeta se reemplaza por la cifra |
| 72 a 75,5 | Logos Python y JS en fichas blancas; chip verde "payment created" | La función crea el pago en tu lenguaje | Logos, chip de éxito | Pop |
| 75,5 a 78,3 | Caja SDK como contorno naranja "rayos X"; sale una tarjeta con la petición (POST, Authorization, Content-Type, Idempotency-Key) y 4 chips verdes (auth, format, errors, retry); una ficha API abajo, unida a la tarjeta de 1 línea por una línea violeta | Por dentro el SDK arma la misma petición y llama a la API | Contorno 3D, tarjeta de petición, chips | Cross-fade; la ficha cae |
| 78,3 a 85 | Fondo menta; caja SDK chica abajo; logo Android y "Android SDK"; teléfono oscuro con robot; tarjetas BUILD, TEST y DEBUG con barras de progreso; el teléfono muestra el checkout de la app | Algunos SDK llegan más lejos: el de Android trae herramientas para construir, probar y depurar apps enteras | Logo Android, teléfono, barras | Cuña verde; pops |
| 85 a 89 | Degradado violeta arriba, diagonal, claro abajo; Rick vuelve a la izquierda; tarjeta contrato de la API (ficha API, api.stripe.com, "lo que puedes pedir", "lo que obtienes") | Modelo mental: la API es el contrato | Tarjeta contrato, avatar | Cuña; Rick con fundido |
| 89,5 a 94,4 | Firma azul dibujada en el contrato (90 s); el fondo de abajo pasa a durazno; caja SDK abierta; fila de 7 logos (Python, JS, Ruby, Go, Java, PHP, .NET) | El SDK es el kit que ayuda a usar ese contrato más rápido, en tu lenguaje | Firma, objeto 3D, logos | Pop; Rick sale a los 94,4 s |
| 94,7 a 101,5 | Diagrama final: "your app" → ficha API → Stripe, con la caja SDK cayendo sobre la ficha API (95,3 s), chip "200 OK" (97 s) y luego la caja como contorno fantasma; aro de brillo en la API (99 a 100 s); una chispa corre por la línea (101,4 s) | Siempre puedes usar una API sin SDK, pero un SDK casi siempre tiene una API por debajo | Diagrama de 3 nodos | Corte; caída; aros |

## 5. El ritmo

Algo cambia en el cuadro (sin contar los subtítulos) cada 0,7 a 1,1 s. Son 12 capítulos y 24 bloques de composición (uno cada ~4 s).

| Ventana | Cambios visuales (aprox.) | Cortes, cuñas o desenfoques |
|---|---|---|
| 0 a 10 s | 7 | 2 (2,3 y 6,8) |
| 10 a 20 s | 12 | 2 (14,8 y 18,8) |
| 20 a 30 s | 14 | 1 (25) |
| 30 a 40 s | 11 | 2 (32,7 y 33) |
| 40 a 50 s | 12 | 1 (45,8) |
| 50 a 60 s | 11 | 2 (50,4 y 57,5) |
| 60 a 70 s | 10 | 2 (63 y 69,5) |
| 70 a 80 s | 11 | 3 (71,5, 75,5 y 78,3) |
| 80 a 90 s | 11 | 2 (85 y 89,5) |
| 90 a 101,5 s | 10 | 1 (94,7) |

Entre 7 y 14 cambios por cada 10 s y un corte, cuña o desenfoque cada ~5,6 s (18 en total). Los subtítulos cambian cada ~0,7 s.

**Dónde se queda quieto más de 2 s (sin contar subtítulos):**
- 15 a 17 s: el diagrama del "?" (~2 s, con un pulso en el signo).
- 37 a 39 s: la petición con la dirección y la tarjeta (~1,5 a 2 s).
- 99 a 101,5 s: el cierre; solo aros de brillo y la chispa (~2,5 s).

No hay otro tramo de más de 2 s totalmente quieto.

## 6. El cierre

Termina en el diagrama de 3 nodos (tu app, la API, Stripe) con la caja SDK que cae sobre la API y se vuelve fantasma, el chip "200 OK" y una chispa que baja por la línea. Los subtítulos acaban con la idea de que el SDK casi siempre tiene una API por debajo, y después queda ~1 s de imagen sin voz. **No hay CTA en el video**: ni hablado ni en pantalla (sin tarjeta final, sin "sígueme"). El CTA está solo en el texto del post: (1) una pregunta de preferencia entre la API cruda y el SDK, y (2) un pedido de guardar el post para cuando alguien los use como si fueran lo mismo. Eso hace de CTA; en el video no hay palabra por palabra que copiar.

## 7. Para copiar

**Estructura (se copia):**
1. Gancho como versus visual (muro de código, ficha API gigante, caja SDK, cuña diagonal) con la pregunta en la primera frase.
2. Contexto con una app reconocible (checkout) y un tercero (Stripe; aquí OpenAI) y una tanda de tareas ocultas.
3. La API como contrato: acrónimo, tarjeta de contrato, analogía del menú con "la cocina", flujo vertical de petición y respuesta con "$20.00" enorme y JSON oscuro.
4. El problema: lista de 5 tareas y tarjeta de código que crece hasta 40 líneas, con avisos rojos.
5. El SDK como caja de herramientas: la caja cae, acrónimo en naranja, caja abierta con 3 tarjetas (librerías, documentación, ejemplos), "40 → 1" y contorno "rayos X" con los chips de lo que hace por debajo.
6. Extensión (Android; aquí un SDK de otra plataforma) y repaso con contrato, caja y firma.
7. Cierre con el diagrama de 3 nodos y la idea "el SDK va sobre la API".

**Ritmo (se copia):** 24 bloques en 101,5 s; un cambio visual cada ~1 s; un corte, cuña o desenfoque cada 5 a 6 s; subtítulos de 2 a 4 palabras cada ~0,7 s; 3 pausas de ~2 s (la última es el cierre).

**Aspecto (se copia por tono y función):**
- Lienzo claro #F3F6F9 con rejilla fina de 120 px; navy #0E2440 para el problema; menta y durazno de tinte por capítulo.
- Conmutador API|SDK en y 112 a 142, subtítulos en píldora en y 720 a 776, 170 px de vacío abajo, escenario de y 150 a 700.
- El violeta de la API y el naranja del SDK se llevan por función con el acento de @jacket.dev; el verde de éxito y el rojo de error se mantienen.
- Tarjetas blancas de radio 8 a 10 con sombra grande y suave; tarjetas oscuras para código y respuesta; mucho texto chico en mono.
- La cuña de color de la escena siguiente que asoma abajo (y 880 a 960).

**Lo que se puede llevar fiel (regla 6 de `AGENTS.md`):** logos e interfaces de productos reales (el tercero de pagos, que aquí pasa a OpenAI; Android; Python, JS, Go, Ruby, Java, PHP, .NET; el teléfono y la interfaz de checkout), sin copiar al personaje.

**Lo que no se copia:** a Rick (se reemplaza por el avatar), su nombre, su logo, su firma, y el texto exacto de los subtítulos y del post.

**Avatar de Jeremy:** Rick es de cuerpo entero (~290 px); la regla vigente (`docs/reel.md`) dice busto, abajo a la izquierda. Las cuatro entradas de arriba (6,9 a 14,6; 25,5 a 32,6; 46,4 a 50,2; 85 a 94,4) pueden ser las del avatar, con la columna izquierda libre.

**Puntos a decidir antes de copiar:**
- La caja de herramientas es un render 3D; la decisión vigente es estilo plano ("3D o isométrico, solo si Jeremy lo pide"). Hay que dibujarla plana o preguntarle.
- El código de ~11 px de Rick queda bajo el mínimo de 12 px del inspector (`data-ui`): subirlo a 12 o reducir el número de líneas.
- Rick no tiene marco ni firma; el de @jacket.dev sí (pestaña, puntos y firma): hay que acomodar el conmutador (y 112 a 142) respecto a la pestaña.
- La última palabra cae antes de los 101 s: queda ~1 s de imagen sin voz al final (reservarlo en el `target` con `hold`).
