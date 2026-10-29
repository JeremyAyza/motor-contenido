# Referente: "Durable agents explained" (@rick.theengineer)

Los tiempos de cada escena tienen un margen de más o menos 1,5 s, porque los cuadros se tomaron cada 3 s (cada 0,5 s en los primeros 3 s). Lo que dice la voz sale de los subtítulos quemados; donde falta un tramo, está marcado "no se oye".

## 1. Ficha

| Dato | Valor |
|---|---|
| Cuenta | @rick.theengineer (537K seguidores, 156 publicaciones) |
| URL | https://www.instagram.com/p/DfFNkEts9iE/ |
| Duración | 143,9 s (2 min 24 s), vertical 720x1280 |
| Fecha | no se ve en el embed |
| Vistas | no se ven en el embed; 576 me gusta |
| Idioma de la voz y los textos | inglés |
| Texto del post | no se ve en el embed |

Tema: cómo hacer que un agente de IA que trabaja 20 minutos no se pierda si cierras la pestaña, se cae el Wi-Fi o el servidor falla. Explica tres capas: stream reanudable, ejecución durable y agente durable.

Tesis en una frase: separa el trabajo de la conexión; guarda cada paso en un registro y en checkpoints, y el agente sobrevive a cualquier desconexión o caída.

## 2. El gancho, 0 a 3 s

- Cuadro 1 (t=0): fondo casi negro, vacío, con una microetiqueta "durable log · job 42" en el centro. A 0,5 s ya entra el título.
- En pantalla: "Durable agents" en blanco, enorme, en dos líneas; a 1 s aparece debajo "EXPLAINED" en mayúsculas pequeñas espaciadas. Debajo, una tira de casillas numeradas (#1 On, #2 it, #3 ".", #4 First, #5 I'll, #6 search...) que se llenan de a una, como el registro de tokens de un agente. Abajo, un subtítulo en cápsula: "Durable agents explained."
- Lo dicho: "Durable agents explained." (la voz lo dice igual que el rótulo).
- A 2 s corta al escenario: ventana de ChatGPT con "You're chatting with ChatGPT."
- El gancho no hace una pregunta ni promete un resultado; es el título del tema y salta de inmediato a una escena concreta que el espectador conoce (chatear con ChatGPT).

## 3. El mundo

- Un solo escenario todo el video: un lienzo vertical negro con una grilla muy tenue de puntos y marcas de esquina, a modo de pizarrón técnico. Sobre él se dibuja, capa por capa, el diagrama de un sistema. Nada cambia de lugar; los elementos se agregan arriba y abajo.
- La arquitectura que se construye (de arriba abajo): ventana del navegador con ChatGPT, bloque SERVER (cajas API y WORKER, con "POST /api/chat" y "job 42"), y abajo el "DURABLE LOG" (casillas con los tokens numerados).
- Cámara: no hay cámara virtual con paneo; es plano fijo con zoom/reencuadre entre bloques (el diagrama se achica y se reordena según la escena). Los cortes son por reemplazo de módulo con fundido corto.
- Presentador: no hay persona en cámara. Hay un avatar caricaturizado de Rick (estilo Rick Sanchez: pelo celeste, bata blanca, sudadera negra, jeans, laptop con calcomanías bajo el brazo) de pie en el borde izquierdo, sin hablar; solo reacciona en 4 momentos (ver sección 4). La voz es en off, en inglés, de tono explicativo.
- Medidor o indicador fijo:
  - Desde ~13 s hay una barra de tres pestañas arriba: "RESUMABLE STREAM | DURABLE EXECUTION | DURABLE AGENT". Resalta cuál capa se está explicando (la primera de 13 a 76 s; la segunda de 77 a ~130 s en el diagrama de checkpoints; vuelven a recorrerse una por una al final de 131 a 138 s y se encienden las tres juntas en la recapitulación).
  - Contador "REM 0 tokens in memory" que sube (0, 4, 16, 28...) en la escena del servidor.
  - Barra comparativa "chat answer 3 s" contra "agent run 20 min" (29 a 33 s).
  - Cuadrícula de 10 pasos por trabajador (worker-1, worker-2) con casillas marcadas; sirve de medidor de progreso en la parte de checkpoints.
- Cada escena trae arriba un titular en blanco de una línea que resume lo que se dice, y abajo un subtítulo en cápsula con la palabra activa resaltada (la hablada en blanco brillante, el resto en gris).

## 4. Escena por escena

| Tiempo (s) | Se ve | Se dice (resumido) | Recurso visual | Cómo entra |
|---|---|---|---|---|
| 0 a 2 | Pantalla negra; título "Durable agents / EXPLAINED"; tira de tokens #1 a #8 | "Durable agents explained." | Tipografía grande, registro de tokens | Título entra a 0,5 s; casillas se llenan |
| 2 a 4 | Ventana de ChatGPT vacía, "ChatGPT" y el indicador de escribiendo; luego aparece el pedido del usuario | "You're chatting with ChatGPT." | Interfaz de ChatGPT (ver sección 6) | Corte; el pedido aparece en una burbuja |
| 4 a 6 | ChatGPT empieza a responder: "On it. First I'll search the docs..." | A mitad de una respuesta | Chip "halfway through the answer" | Texto que se escribe |
| 6 a 8 | Chips rojos arriba y abajo ("connection lost", "worker alive · stream closed"); luego la respuesta desaparece y queda un spinner con "reconnecting" | "...y se te cae el Wi-Fi, o cierras la pestaña... vuelves y..." (parte no se oye con claridad) | Chips de estado, spinner | Cambio de estado en la misma ventana |
| 8 a 11 | La respuesta completa vuelve; chip verde "still typing - it never stopped" y luego "finished while you were away" | "...sigue ahí. Still typing." / "finished" | Chips verdes | Aparece de golpe |
| 11 a 13 | La ventana se oscurece; "How?" gigante y debajo "LET'S BUILD THE MENTAL MODEL". Aparece el avatar de Rick en el borde izquierdo | "How? Let's build the mental model." | Avatar, tipografía grande | Zoom/fundido; avatar entra por la izquierda |
| 13 a 15 | Diagrama: solo la ventana del navegador con el pedido; titular "Your browser sends a request"; barra de tres pestañas | "Your browser sends a request." | Barra de pestañas, caja del navegador | Corte; módulo nuevo |
| 15 a 17 | Se agrega la caja SERVER con "POST /api/chat" y "REM 0 tokens in memory"; titular "The server calls the AI model" | "The server calls the AI model." | Caja SERVER, contador | Se agrega abajo |
| 17 a 19 | Aparece la caja "AI model"; una flecha vertical baja; el texto va saliendo en el navegador; titular "Tokens stream back up one connection" | "Tokens stream straight back to you." | Flecha animada, caja AI model | Aparece a la derecha |
| 19 a 22 | Bloque "HTTP/1.1 200 OK / content-type: text/event-stream / data: {"token":...}"; titular "Usually: server-sent events"; el contador pasa de 16 | "Usually server-sent events." | Bloque de código, flecha "1 open connection" | Aparece abajo |
| 22 a 25 | Titular "If it dies, the request is cancelled"; el contador llega a 28 | "If it dies, the request is cancelled." | Chip "1 open connection" | Cambio de titular |
| 25 a 28 | La conexión se corta en rojo; chips "connection dropped" y "model stopped"; titular "Generation stops." | "Generation stops." | Líneas rojas rotas | Cambio de color |
| 28 a 31 | Cambio de módulo: gráfico "What a dropped connection costs"; barra "chat answer 3 s" con una marca roja al final; titular "A short answer? Annoying." | "For a short answer, that's annoying." | Gráfico de barras horizontales | Corte a una tarjeta nueva |
| 31 a 34 | Aparece "agent run 20 min" con tres chips (search web, write code, run tests); titular "A 20-minute agent run?" | "A 20-minute agent run: searching the web, writing code..." | Línea de tiempo larga, chips | Se agrega debajo |
| 34 a 37 | Vuelve al diagrama; avatar de Rick; titular grande "Separate the work from the connection." | "Idea. Separate the work from the connection." | Avatar de Rick, titular de una frase clave | Corte; avatar entra por la izquierda |
| 37 a 40 | Diagrama partido en API y WORKER; chip "send message"; titular "The work doesn't run inside your request" | "When you send a message, the server..." | Cajas API y WORKER, "DURABLE LOG" vacío | Se divide el módulo |
| 40 a 43 | La API muestra "job 42" y devuelve el ID al navegador (esquina arriba a la derecha "job 42"); titular "It creates a job - and hands back the ID" | "...gives it an ID." | Chip "job 42" | Aparece en la caja API |
| 43 a 46 | El trabajo pasa al WORKER; titular "A background worker runs it" | "A background worker picks it up." | Caja WORKER con job 42, AI model | Se mueve de caja |
| 46 a 49 | El registro empieza a llenarse de casillas; titular "Everything it produces goes into a log" | "Every token, every tool call..." | Casillas numeradas en el DURABLE LOG | Aparecen una a una |
| 49 a 52 | Se completan 10 a 12 casillas; titular "Redis Streams or a Postgres table" | "...goes into a log like Redis Streams or a Postgres table." | Casillas con posición #1 a #12 | Aparecen más |
| 52 a 55 | Etiquetas "Redis stream" y "Postgres table"; titular "Saved in order, each with a position" | "Saved in order, each with a position." | Etiquetas de logs | Aparecen sobre el log |
| 55 a 58 | Un navegador recibe del log; titular "Your browser just watches the log" | "Your browser isn't doing the work; it watches." | Flecha desde el log hacia el navegador | Línea nueva |
| 58 a 61 | Se corta la conexión en rojo mientras el worker sigue; chip "worker running job 42"; titular "You disconnect. The job doesn't care." | "So when you disconnect, the job keeps going." | Línea roja, caja del worker sigue verde | Cambio de color |
| 61 a 64 | Reconexión; chip "reconnected"; titular "Back: 'I'm watching job 42'" | "When you come back, you say: 'I'm watching job 42'." | Chip de reconexión | Cambio de titular |
| 64 a 67 | Chip "GET /jobs/42/stream, Last-Event-ID: 57"; titular "'The last thing I saw was 57'" | "...and the last thing I saw was 57." | Petición HTTP resaltada, casilla 57 marcada | Chip aparece |
| 67 a 70 | Chip verde "replaying 58... now"; las casillas desde la 58 se repiten en verde; titular "It replays everything after 57" | "The server replays everything after 57." | Casillas en verde | Resaltado |
| 70 a 73 | Titular gigante naranja-blanco "Resumable stream" (primera pestaña encendida) | "That's a resumable stream." | Etiqueta de concepto | Titular se agranda |
| 73 a 76 | Titular "But there's a second problem"; una raya roja baja desde el worker | "But there's a second problem." | Línea roja | Corte de tono |
| 76 a 80 | El diagrama se oscurece; titular "Enter: durable execution" | "That's where durable execution comes in." | Etiqueta de concepto, segunda pestaña | Fundido |
| 80 a 86 | Módulo nuevo: bloque "SAVED TO THE DATABASE" con JSON ("job: 42, step: 1, name: search_web, status: done, result: [...]"), fila "WORKERS" con 10 pasos y fila "CHECKPOINTS" que se llena; titular "Every finished step becomes a checkpoint" | "Every time a worker finishes a step, the result is saved in the database." | Bloque JSON, cuadrícula de pasos, etiqueta "database" | Corte a tarjeta nueva |
| 86 a 89 | El worker 1 llega al paso 7 y se pone rojo (se cae); mensaje "6 checkpoints saved. Steps 1-6 are in the database. Step 7 was running."; titular "The worker crashes at step 7" | "If the worker crashes..." | Casilla roja, texto en tarjeta | Cambio de color |
| 89 a 92 | Aparece worker-2 que continúa; tarjeta "Picks up at step 7. Steps 1-6 are never run again."; titular "It resumes at step 7 - not step 1" | "...and resumes at step 7." | Segundo worker, tarjeta | Se agrega una fila |
| 92 a 95 | Tarjeta "MODEL CALLS, STEPS 1-6" vacía; titular "Six model calls - paid for once" | "You only pay for the first six model calls once." | Tarjeta de costo | Reemplaza a la anterior |
| 95 a 98 | Tarjeta "STEP 7": worker-1 "crashed, then resumed" y worker-2 "ran again"; titular "One catch: step 7 may run twice" | "...a step that was mid-flight may run twice." | Tarjeta de dos filas | Cambio de tarjeta |
| 98 a 101 | Titular naranja "Idempotent"; tarjeta "IDEMPOTENT: runs 2 times = 1 charge"; Rick aparece a la izquierda | "Idempotent, meaning safe to repeat." | Avatar, palabra en color acento | Titular grande; avatar entra |
| 101 a 104 | Tarjeta "PAYMENTS" con el logotipo de Stripe: "$49.00 worker-1 - step 7: succeeded" y "$49.00 worker-2 - retry: charged again" con el aviso "duplicate charge"; titular "A retry must not charge the card again" | "...a retry must not charge the card again." | Logo e interfaz de Stripe, filas verde y rojo | Corte a tarjeta |
| 104 a 107 | Tarjeta "THE REQUEST": "POST /v1/payment_intents / Idempotency-Key: job42-step7 / amount=4900&currency=usd"; titular "Send a unique idempotency key" | "...send a unique idempotency key." | Bloque de código | Reemplaza |
| 107 a 110 | Misma tarjeta con "retry" y "200 OK / Idempotent-Replayed: true"; titular "The retry is recognized - and ignored" | "The retry is recognized and ignored." | Código con respuesta | Se agrega abajo |
| 110 a 113 | Vuelve el diagrama completo con el log; titular "So how do you build it?" | "So how do you build it?" | Pregunta de transición | Corte |
| 113 a 116 | Aparecen dos opciones: "A - wire it yourself" y "B - use a framework"; abajo "LIVE OUTPUT" y "STATE" con la etiqueta Postgres; titular "Postgres: state and checkpoints" | "Postgres for state and checkpoints." | Etiqueta Postgres | Se agrega una fila |
| 116 a 119 | Se agrega una cola con jobs 43 y 44 (etiqueta RabbitMQ); titular "RabbitMQ: a queue of jobs" | "RabbitMQ, a queue of jobs to run them." | Icono de RabbitMQ, cola de jobs | Se agrega al diagrama |
| 119 a 123 | Cuatro botones: Vercel Workflow (triángulo), Temporal (símbolo), Inngest (texto), Trigger.dev (verde); titular "Or: a durable workflow framework" y luego "It handles the hard parts for you" con etiquetas "checkpoints, retries, streaming" | "Or a durable workflow framework handles the hard parts for you." | Logos de cuatro productos | Aparecen en cuadrícula 2x2 |
| 123 a 128 | Tarjeta "RULE OF THUMB": "Short chats on a single server -> Build it yourself" con tres iconos (Postgres, Redis, RabbitMQ); titular "Rule of thumb" | "Rule of thumb: for short chats on a single server, build it yourself." | Tarjeta, tres iconos | Corte a tarjeta |
| 128 a 131 | Se agrega "Long multi-step agents: or serverless functions that time out", con la barra "agent run - 20 min" y un chip rojo "timeout"; titular "Long agents? Use a framework." | "Long agents? Use a framework." | Barra de 20 min, chip de timeout | Se agrega debajo |
| 131 a 134 | Vuelve al diagrama; pestaña 1 encendida; titular "1 - Leave, come back, lose nothing" | "Resumable stream. The user can leave and come back." | Recapitulación, pestaña 1 | Corte |
| 134 a 137 | Pestaña 2 encendida; titular "2 - The work survives crashes" | "Durable execution. The work survives crashes." | Pestaña 2 | Cambio de pestaña |
| 137 a 140 | Pestaña 3 encendida; titular gigante "Durable agent"; avatar de Rick | "Durable agent. Both, plus..." | Pestaña 3, avatar | Titular grande |
| 140 a 143,9 | Chip "tab closed" y "job 42 - still running"; titular "No one has to keep the tab open" | "A long-running agent shouldn't depend on an open tab." | Chips de estado, avatar | Cambio de titular |

## 5. El ritmo

- Cambio visual cada 10 s: entre 3 y 4 cambios de titular o de módulo (media de uno cada 3 s). Más de 15 cambios de estado menores (casillas, chips, contadores) en cada 10 s.
- Cortes grandes de escenario o de tarjeta (nuevo módulo): unos 12 en todo el video (en ~2, ~11, ~28, ~34, ~80, ~101, ~110, ~119, ~123, ~131, ~137).
- Pantallas que se quedan quietas más de 2 s: ninguna del todo; incluso en las pausas largas (por ejemplo 80 a 86 s, con la misma tarjeta de checkpoints) algo se mueve (se llenan casillas, cambia el contador, el worker cambia de color).
- La densidad de información es alta: la voz no baja de un ritmo constante de unas 3 palabras por segundo y cada frase tiene su titular.

## 6. Marcas y productos que nombra o muestra

| Producto | Segundo | Cómo se ve |
|---|---|---|
| ChatGPT (OpenAI) | 2 a 12 (se nombra en voz a ~2 s); sale en pantalla hasta ~12 s y vuelve como miniatura (ventana del navegador) durante el diagrama, 13 a 143 s | Ventana de navegador falsa, fondo muy oscuro, con tres puntos de color arriba a la izquierda (azul/morado/rosa) y una cápsula de URL "chatgpt.com" con un icono de candado a la derecha. Cabecera con el logotipo de ChatGPT (nudo hexagonal) y el texto "ChatGPT" en blanco. Burbuja del usuario a la derecha, gris oscuro, redondeada: "Upgrade my app to the new SDK and get the tests passing." Respuesta del asistente alineada a la izquierda sin burbuja, con el mismo logotipo pequeño: "On it. First I'll search the docs for the new SDK, then update the code and run the tests until everything passes." con un punto negro (cursor) al final mientras escribe. Caja de entrada al fondo con el texto "Message ChatGPT" y un botón circular blanco con una flecha hacia arriba. Más chips de estado propios del video fuera de la ventana: "reconnecting", "still typing - it never stopped", "finished while you were away". |
| Redis Streams | ~50 a 55 (voz y titular) | Solo texto en el titular y en una etiqueta, sin logotipo. Después, un icono de Redis (cubos rojos) en la tarjeta "Rule of thumb" (~125 s). |
| PostgreSQL | ~50, ~113 a 116, ~125 | Texto "Postgres" y una etiqueta pequeña; icono del elefante azul en "Rule of thumb". |
| RabbitMQ | ~116 a 119, ~125 | Texto "RabbitMQ" en titular; icono naranja (conejo) en "Rule of thumb". |
| Stripe | ~101 a 110 | Tarjeta "PAYMENTS" con el logotipo morado "stripe" en la esquina; filas "$49.00 worker-1 - step 7: succeeded" (verde) y "$49.00 worker-2 - retry: charged again" (rojo); código "POST /v1/payment_intents", "Idempotency-Key", "amount=4900&currency=usd". No dice "Stripe" en voz; solo se ve el logo. |
| Vercel Workflow | ~119 a 123 | Botón oscuro con un triángulo blanco (logo de Vercel) y el texto "Vercel Workflow". |
| Temporal | ~119 a 123 | Botón oscuro con el símbolo de Temporal (círculo con cruz) y el texto "Temporal". |
| Inngest | ~119 a 123 | Botón oscuro con el texto "inngest" en minúsculas blancas. |
| Trigger.dev | ~119 a 123 | Botón oscuro con el texto "Trigger.dev" y el logotipo con un triángulo verde. |
| Server-sent events (SSE) | ~19 a 22 | No es una marca; bloque de código con "text/event-stream". |

Para nuestra versión (Claude en lugar de ChatGPT): conservar el marco (ventana de navegador falsa, cabecera con logo y nombre, burbuja a la derecha, respuesta sin burbuja a la izquierda con cursor, caja "Message ..." con botón circular de envío). Ver el punto de la regla 6: recrear la interfaz de Claude fiel (logo oficial, tipografía y colores de claude.ai, caja "Reply to Claude" o similar) en lugar de copiar la de ChatGPT.

## 7. Cifras, datos y afirmaciones para verificar

1. En un chat, si la conexión se corta, la solicitud se cancela y la generación se detiene (comportamiento típico de un servidor con stream directo; verificar con la documentación de un SDK, por ejemplo el AI SDK de Vercel, y si pasa lo mismo con ChatGPT).
2. ChatGPT (o una API de OpenAI) sigue generando mientras no estás conectado: "still typing - it never stopped" y "finished while you were away" (verificar con la documentación de modo en segundo plano de la Responses API de OpenAI; no asumir que la app web lo hace).
3. Las respuestas por stream suelen ir por server-sent events con `content-type: text/event-stream`.
4. Una respuesta corta de chat tarda unos 3 s y un agente largo dura unos 20 min (ilustrativo en el video; no hay fuente, es un ejemplo).
5. Reanudar un stream con `Last-Event-ID` (cabecera estándar de SSE) y repetir lo que vino después del evento 57 (verificar en la especificación de SSE en MDN o WHATWG).
6. Un registro con orden y posición se puede hacer con Redis Streams o una tabla de Postgres.
7. Un worker que se cae retoma desde el último checkpoint guardado, no desde el paso 1, y las llamadas al modelo de los pasos 1 a 6 se pagan una sola vez.
8. Un paso en vuelo puede ejecutarse dos veces al reintentar (semántica "al menos una vez" de los sistemas de ejecución durable).
9. La API de pagos de Stripe acepta una clave de idempotencia (cabecera `Idempotency-Key`) y, ante un reintento, devuelve la misma respuesta con la cabecera `Idempotent-Replayed: true` (el video muestra "POST /v1/payment_intents", "amount=4900&currency=usd", "200 OK"; verificar en la documentación de Stripe sobre solicitudes idempotentes).
10. Postgres para estado y checkpoints, RabbitMQ como cola de trabajos, o un framework de flujos durables (Vercel Workflow, Temporal, Inngest, Trigger.dev) que resuelve checkpoints, reintentos y streaming (verificar qué ofrece cada uno y que los cuatro nombres existen como tales).
11. Regla práctica: chats cortos en un solo servidor, hazlo tú; agentes largos de varios pasos o funciones serverless que agotan el tiempo, usa un framework (opinión del autor; verificar los límites de tiempo de las funciones serverless si se cita una cifra).

## 8. El cierre

- No hay CTA ni despedida: no pide seguir, guardar, comentar ni compartir. El video termina con la última frase, "No one has to keep the tab open", mientras Rick está de pie a la izquierda y el diagrama muestra el chip "tab closed - job 42 - still running". Es un cierre de recapitulación, sin pantalla final.
- Remate: cierra en la misma idea del gancho (cerrar la pestaña y el trabajo continúa), lo que hace que el video funcione como un bucle.

## 9. Para copiar y para no copiar

Copiar (estructura y recursos):
- Un solo escenario (pizarrón técnico oscuro con grilla) donde el diagrama se construye pieza por pieza, sin cambiar de lugar; la explicación es el propio dibujo creciendo.
- Gancho con el título del tema y salto inmediato a una situación conocida (chatear con un asistente de IA y que se corte).
- Titular de una línea arriba por cada idea (que repite lo que dice la voz) más subtítulo palabra a palabra abajo.
- Barra de tres pestañas fija arriba que marca en qué capa está la explicación.
- Una pregunta que abre el modelo mental ("How? Let's build the mental model.") y una frase clave ("Separate the work from the connection.").
- Metáfora de estado concreto con ID (job 42) que se sigue a lo largo de todo el video.
- Recapitulación final de las capas, una por una.
- Recursos reconocibles de productos reales: interfaz de chat (recrear la de Claude), tarjeta de pagos de Stripe con su logo, botones con logos de Vercel Workflow, Temporal, Inngest, Trigger.dev, y los iconos de Postgres, Redis y RabbitMQ. Se recrean fieles por la regla 6.
- Chips de estado (conectado, reconectando, caído) y bloques de código con petición y respuesta HTTP.

No copiar (es de su marca):
- El avatar de Rick (personaje propio de @rick.theengineer, caricatura estilo Rick Sanchez, con su laptop y calcomanías); el nuestro debe ser el avatar de @jacket.dev.
- Su paleta y titulares gigantes con acento naranja y la firma de la cuenta (nombre, foto, estilo de cápsula de subtítulo exacto).
- Su voz y su manera de hablar.
- Los textos literales del guion; reescribirlos con nuestras palabras y con Claude como ejemplo.
- Su duración de 144 s: la dirección actual de los Reels es 45 a 60 s, así que hay que condensar (por ejemplo: gancho, el corte de conexión, "separa el trabajo de la conexión", el registro con el stream reanudable, un checkpoint y una caída, y el cierre).
