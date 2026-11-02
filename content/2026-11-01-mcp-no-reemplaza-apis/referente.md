# Referente: @rick.theengineer, "MCP doesn't replace your APIs. It never touched them."

Análisis del 1 de noviembre de 2026 para replicar la ESTRUCTURA con la marca de @jacket.dev, con mejor demostración y con nuestro avatar solo en momentos elegidos. Se vio en el reproductor incrustado (`/p/Db5y4nnsRl2/embed/captioned/`), sin sesión y sin descargar nada. Limitación: el audio no se oye (no se reprodujo con sonido), así que la transcripción sale de los subtítulos quemados (karaoke) leídos cada 1 s (cada 0,5 s hasta el 5) y del texto del post. Los segundos son `currentTime` del reproductor; una entrada de elemento puede estar corrida hasta 0,5 s. Lo que no se leyó entero va entre corchetes: es inferido y hay que oírlo antes de citarlo.

## 1. Ficha

| Campo | Dato |
|---|---|
| Cuenta | rick.theengineer (158 publicaciones, 544 K seguidores al 1-nov-2026) |
| URL | https://www.instagram.com/p/Db5y4nnsRl2/ |
| Duración | 116,16 s (`video.duration` = 116,158708). Vertical 720x1280 |
| Fecha de publicación | no se ve en el reproductor incrustado |
| Vistas | no se ven. Sí: 55.791 me gusta (el embed) y 344 comentarios |
| Idioma | inglés: voz, subtítulos y todos los textos en pantalla |
| Texto del post | "MCP doesn't replace your APIs. It never touched them. [...] Underneath, that GitHub MCP server is still calling GitHub's normal REST API. [...] Five services meant five sets of auth, error handling, retries, and response parsing [...] That's tool discovery [...] APIs expose the functionality. MCP is the AI-facing layer on top of them. What's the worst 'MCP replaces X' take you've seen this week?" con #mcp #modelcontextprotocol #aiengineering #softwareengineering #devtools |
| Audio | "Audio original". No se oye: no se sabe si hay música ni efectos |
| Lectura | 55 K me gusta con 544 K seguidores: rinde bien con un video de casi 2 min. La estructura es la de un explicador largo en un solo tablero, no un video corto |

El video NO dice lo que dice el post. El post abre con la tesis ("no los reemplaza, nunca los tocó"); el video abre con una pregunta neutra y suelta la tesis recién a los 101 s.

## 2. Tema y tesis

- **Tema:** MCP (Model Context Protocol) frente a las APIs: si hace falta MCP "cuando ya tenemos APIs".
- **Tesis real:** MCP no reemplaza a las APIs; las APIs exponen la funcionalidad y MCP es una capa pensada para que las apps con IA descubran y usen esa funcionalidad con un formato común. Un servidor MCP "usualmente" sigue llamando a la API normal debajo.
- **Argumento en 6 pasos:** (1) una API es la forma en que dos programas se comunican, ejemplo GitHub; (2) las apps reales hablan con muchos servicios y cada uno cuesta lo mismo, "x 5"; (3) con un LLM, el modelo decide pero tu código sigue haciendo cada integración; (4) una segunda app de IA obliga a rehacerlo todo, 10 integraciones y sin interfaz estándar; (5) MCP pone un protocolo común y servidores MCP que describen sus herramientas ("tool discovery"); (6) por debajo el servidor llama a la API: la API nunca desapareció.
- **Frase para memorizar (111 a 116 s):** las APIs son la interfaz para el software y MCP es una capa común, orientada a IA, construida encima.

## 3. Transcripción (subtítulos karaoke, con el segundo en que se ve cada tramo)

Cada pantalla de subtítulo muestra 2 a 4 palabras durante cerca de 1 s. Son unas 300 palabras en 116 s: unas 2,6 por segundo. Entre corchetes: inferido de la frase vecina o del post, no leído.

| Segundo | Voz (subtítulo) |
|---|---|
| 0,2 | Do we really need MCP when we already have APIs? |
| 3,0 | Let's understand the difference between the two. |
| 5,0 | An API is how two pieces of software communicate. |
| 7,5 | Let's say you build an app that needs to read issues from GitHub. |
| 10,0 | GitHub exposes an API. |
| 12,0 | Your app sends a request to GitHub, and GitHub sends the data [back]. |
| 15,0 | Simple, but real applications usually talk to many services. |
| 19,0 | GitHub for code, Gmail for emails, Jira for [tickets], Notion for documents, your database for user data. |
| 24,0 | For each service, you need integration code, authentication, API calls, error handling, [retries, and logic for] understanding the response. |
| 31,0 | Now let's add an [LLM]. |
| 32,0 | The application can now understand what the user wants and decide what action should happen, |
| 36,0 | but the model itself usually doesn't directly [call GitHub]. |
| 38,0 | It says something like, "get the open issues from this repository," |
| 41,0 | and the normal software around the model performs that action, |
| 44,0 | [which has] to build the GitHub [request], the Gmail integration, the Jira integration, all of them. |
| 49,0 | Now imagine your company builds another AI app that needs access to the same services. |
| 53,0 | [With no standard] interface, you may end up rebuilding those integrations again, |
| 56,0 | and this is the problem MCP tries to solve. |
| 59,0 | Instead of every AI application understanding every service differently, |
| 62,0 | MCP gives them a common protocol. |
| 64,0 | Your application connects to MCP servers. |
| 66,0 | GitHub can have an MCP server. Notion can have one. Your database can have one, |
| 70,0 | [each describing] their capabilities in the same format. |
| 72,0 | Now here's the important part. |
| 73,0 | An MCP server can tell the application what tools it provides. |
| 76,0 | For GitHub, that could be list issues, read pull requests, search code, create issue. |
| 81,0 | This is called tool discovery. |
| 82,0 | The application gives those available tools to the model. |
| 85,0 | [When] you ask, "what bugs are still open for authentication?" |
| 88,0 | the model can decide that searching GitHub issues is the right action. It chooses the tool. |
| 92,0 | Your application sends the request through MCP, and the GitHub MCP server performs the operation. |
| 97,0 | But underneath, that MCP server usually still calls GitHub's normal API. |
| 101,0 | The API never disappeared. |
| 102,0 | So does MCP replace APIs? |
| 104,0 | No, APIs expose the actual functionality. |
| 106,0 | MCP gives AI applications a standard way to discover and use that functionality. |
| 111,0 | [APIs are] the interface for software, and MCP is a common AI-facing layer built on top of them. |

Huecos: 7,5 s (leído "Let's say you build" a 7,55 s), 85 s (no hay pastilla de subtítulo unos 0,4 s; la voz lee la pregunta del usuario), 29 a 30 s (se leyó "understanding the response" pero no "retries, and logic for"; la lista en pantalla sí lo muestra). No se oye nada: no se sabe si la voz es del avatar o de un locutor.

## 4. El gancho, 0 a 3 s

| Segundo | Qué se ve | Texto en pantalla | Subtítulo |
|---|---|---|---|
| 0,0 (cuadro 1) | Fondo gris muy claro y un tablero vacío (tarjeta blanca de bordes redondeados, 4 puntitos en las esquinas, 2 líneas finas horizontales). Rótulo mono pequeño arriba: "THE QUESTION". Sin avatar, sin subtítulo | solo el rótulo | no hay |
| 0,2 | Entra el avatar (caricatura 2D, grande, abajo a la izquierda) y 3 ranuras vacías al pie de la tarjeta | rótulo | "Do we really need" |
| 0,5 | Titular enorme en negro, bold condensada: "DO WE NEED". Ranuras: 5 | "DO WE NEED" | "Do we really need" |
| 1,0 | Igual | "DO WE NEED" | "Do we really need" (resaltada: need) |
| 1,5 | Entra "MCP?" en azul debajo del titular | "DO WE NEED / MCP?" | "MCP when we already" |
| 2,0 | Igual | igual | "MCP when we already" |
| 2,5 | Entra una línea mono naranja pequeña "...we already have APIs" | titular + "...we already have APIs" | "have APIs?" |
| 2,75 | Igual; el avatar aún grande | igual | "have APIs?" |
| 3,0 | La tarjeta se desvanece y queda un fantasma; entra el chip "API" (naranja). El avatar ya se encogió a la mitad | rótulo | "Let's understand the" |

- **Cuánto tarda en leerse la promesa:** el titular "DO WE NEED MCP?" se lee completo a los 1,5 s; la pregunta entera, con el contraste "...we already have APIs", a los 2,5 s. El cuadro 1 es un tablero vacío (0,0 a 0,2 s) y no cuenta. Sin sonido se entiende de todos modos, por el titular y la pastilla de subtítulos.
- **Qué promete:** una pregunta ("¿necesitamos MCP si ya tenemos APIs?"), no una afirmación. No hay cifra, ni conflicto, ni "te mintieron". El tema es una duda que mucha gente tiene; la tensión es débil.
- **Qué NO está en el gancho:** la tesis ("no los reemplaza, nunca los tocó") ni la respuesta: llegan a los 101 y 104 s.
- **El avatar** a los 0,2 a 2,8 s está en grande y centrado-izquierda; es la única vez en los primeros 55 s que se ve de ese tamaño.

## 5. El mundo

**Un solo mundo, sin ningún corte duro en 116 s.** El fondo gris claro no cambia nunca. Sobre él hay tres capas fijas y una cuarta que cambia:

1. **Tablero ("board")**: una tarjeta blanca centrada (unos 67 % del ancho del video y 43 % del alto), con sombra suave, 4 puntos en las esquinas y 2 líneas horizontales finas (arriba y abajo), como un panel de aparato. TODO el contenido del video ocurre dentro y justo debajo del tablero.
2. **Rótulo de capítulo** (mono, mayúsculas, espaciado, gris oscuro) justo encima del tablero. Cambia 8 veces: THE QUESTION (0 a 18,5 s), THE COST (19 a 30,5), ADD A MODEL (31 a 48,5), AND AGAIN (49 a 58,5), ONE PROTOCOL (59 a 71,5), TOOL DISCOVERY (72 a 91,5), UNDERNEATH (92 a 101,5), SO WHICH IS IT (102 a 116).
3. **Avatar** (a la izquierda, pegado al borde del tablero, en un plano fijo, SOBRE el tablero): ver abajo.
4. **Subtítulo** (pastilla blanca, centrada al 75 % de la altura, sombra suave): sans bold tipo Inter; la palabra dicha en granate, lo ya dicho en negro y lo que falta en gris.

- **Cómo se mueve la "cámara":** no hay cámara 3D. Solo hay tres movimientos:
  - **Empuje corto a los 48 s** ("all of them"): el tablero crece ~3 % y se corre un poco hacia arriba mientras aparece el texto grande "ALL OF THEM" debajo (un golpe de énfasis).
  - **Cámara que baja y se acerca a los 97 a 100 s** ("underneath, that MCP server usually still calls GitHub's normal API"): todo el tablero sube unos 20 % del alto y escala ~1,15x hasta dejar el logo de GitHub y su MCP SERVER a la altura del avatar; el avatar NO se mueve (queda fijo), lo que demuestra que el avatar es una capa aparte. A los 102 s vuelve el encuadre normal con el nuevo rótulo.
  - **Tablero atenuado**: en las tarjetas de título (57 a 58, 81 a 81,7 y 101 s) el tablero baja al 30 % de opacidad y encima entra un texto enorme; es el sustituto del "corte".
- **Cómo se hace caro sin 3D:** (a) un único sistema visual (misma tarjeta, misma pastilla, misma tipografía); (b) código de color con significado: naranja = API y costo, lila = LLM y modelo, azul = MCP, verde = herramientas y descubrimiento, rojo = no/bloqueado; (c) cada cosa entra en el instante en que se nombra (logo a logo, bullet a bullet, letra a letra); (d) movimiento con peso: paquetes que viajan por curvas, líneas que se dibujan, sellos rotados, un contador que sube; (e) nunca hay un cuadro quieto más de 2,5 s.
- **El avatar:** caricatura 2D estilo "Rick" (pelo azul pálido en puntas, ojos grandes, sudadera negra con un logo verde en el pecho, jeans, zapatillas, laptop con stickers bajo el brazo). Es de su marca. Lo que hace: (a) boca que se abre y se cierra y pupilas que se mueven (parece sincronizado con la voz o con un ciclo de habla); (b) cuerpo en pose fija, sin gestos de brazos; (c) tamaño: GRANDE en el gancho (0,2 a 2,8 s), pequeño casi todo el video, y se agranda (~1,4x, hacia el centro) en 3 momentos más: 56 a 58 s, 81 a 81,7 s y 101 s. Nunca señala, nunca toca el tablero, nunca sale de cuadro.
- **Qué está en juego (el "medidor"):** no hay barra de vida. El estado en juego es el costo de integración: un contador que sube ("5 services", "x 5", "10 INTEGRATIONS", 55 s) y que la barra MCP "paga". Lo que no hace el video es bajar el contador al final.

## 6. Escena por escena

Cada fila es una recomposición del tablero (no hay cortes). Entradas en cuadros de 1 s: "se dibuja" y "viaja" están inferidos de cuadros intermedios (p. ej. 13 s: la curva a medio trazar con un punto en el medio).

| # | Tiempo (s) | Qué se ve | Voz (resumen) | Recurso visual | Cómo entra |
|---|---|---|---|---|---|
| 1 | 0,0 a 0,2 | Tablero vacío, rótulo THE QUESTION | no hay | Tablero | Arranque en blanco |
| 2 | 0,2 a 2,8 | Avatar grande; titular "DO WE NEED / MCP?" y línea "...we already have APIs"; 5 ranuras vacías al pie | ¿Necesitamos MCP si ya hay APIs? | Texto grande bold; avatar | El avatar entra de golpe a 0,2; las ranuras aparecen de 3 en 3 a 5; "MCP?" a 1,3 s; la línea naranja a 2,3 s |
| 3 | 2,8 a 4,8 | La tarjeta se vacía; chips "API" (naranja) y "MCP" (azul) uno junto al otro; flecha punteada de doble punta | La diferencia entre los dos | Chips; flecha punteada | Desvanecer la tarjeta; el avatar se encoge en unos 0,3 s |
| 4 | 4,8 a 7,0 | Tarjeta vacía; "SOFTWARE A" arriba (5,5), "SOFTWARE B" abajo (6,0); línea vertical con píldora "API" (7,0) | Una API conecta dos programas | Dos cajas y un conector | Cada caja entra a la palabra que la nombra |
| 5 | 7,5 a 9,5 | "YOUR APP" arriba; 5 curvas punteadas hacia 5 ranuras; texto mono naranja tecleado "read iss..." | "Let's say you build an app that needs to read issues..." | Curvas punteadas; texto tecleado | Las curvas aparecen a 7,5 s; el texto se teclea a 9 s |
| 6 | 10,0 a 14,5 | Logo de GitHub en la 1.ª ranura (10); recuadro naranja y etiqueta "API" (11); cuadrito naranja sobre el logo (12); curva naranja sólida de YOUR APP a GitHub con un punto que viaja (13); el cuadrito vuelve (14) | "GitHub exposes an API. Your app sends a request... GitHub sends the data back" | Logo real de GitHub; paquete naranja que viaja | Logo con aparición; curva que se dibuja |
| 7 | 15,0 a 18,0 | Sello gris rotado "SIMPLE" bajo el tablero (15 a 18); la curva a GitHub queda sola | "Simple, but real applications usually talk to many services" | Sello | Sello que cae con giro |
| 8 | 18,0 a 24,0 | "MANY SERVICES" en naranja y 4 ranuras con borde naranja (18); rótulo pasa a THE COST (19); entran Gmail + "CODE" bajo GitHub (19), Jira + "EMAILS" (20), Notion + "TICKETS" (21), "DOCUMENTS" (22), base de datos + "USER DATA" y texto mono "5 services" (23) | GitHub para código, Gmail para correos, Jira, Notion, base de datos | Logos reales: GitHub, Gmail, Jira, Notion; icono genérico de base de datos | Un logo por palabra nombrada, con su etiqueta debajo |
| 9 | 25,0 | Cinco curvas naranja sólidas de YOUR APP a cada logo; "INTEGRATION CODE" bajo el tablero | "need integration code" | Cinco curvas | Se dibujan a la vez |
| 10 | 26,0 a 31,0 | Tarjeta blanca "FOR EACH SERVICE" con viñetas naranja tecleadas: integration code, authentication, API calls, error handling, retries, logic for the resp[onse]; a 30 s se vacía y queda "x 5 / FOR EVERY SERVICE" con el 5 grande marrón | Lista de lo que cuesta cada servicio | Lista en mono; multiplicador | Una viñeta por segundo; reemplazo por x 5 |
| 11 | 31,0 a 35,0 | Vuelve YOUR APP con las 5 curvas; destello lila (31); chip "LLM" lila y una caja `"_"` (prompt) arriba a la izquierda (32); texto "UNDERSTAND" (33, se atenúa a 34) | "Let's add an LLM. It can understand what the user wants" | Chip LLM; caja de prompt | Destello que se concreta en chip |
| 12 | 35,0 a 38,0 | "DECIDE" (35) y curvas punteadas lilas hacia los logos; GitHub con recuadro lila; línea lila fina del LLM a GitHub (36) cortada por una X roja y sello rojo rotado "NOT DIRECTLY" (37) | "...decide what action should happen, but the model itself usually doesn't directly [call]" | Curvas lilas; X roja; sello | La X cae sobre la línea; el sello entra con giro |
| 13 | 38,0 a 41,0 | Tarjeta con borde izquierdo lila: "THE MODEL SAYS" y texto mono lila tecleado "get the open issues from this repository," | "It says something like, 'get the open issues...'" | Tarjeta de cita en mono | Se teclea sincronizado con la voz (39,6 s: "get the open is") |
| 14 | 41,0 a 44,0 | La tarjeta se va; YOUR APP con marco oscuro grueso y etiqueta "YOUR CODE" (42); solo queda la línea de GitHub sólida, las demás en melocotón (44) | "the normal software around the model performs that action" | Marco y etiqueta | Marco que aparece |
| 15 | 45,0 a 47,5 | "YOU BUILT THIS" (45) y la línea de Gmail se enciende "...AND THIS" (46), la de Jira "...AND THIS" (47) | "...build the GitHub request, the Gmail integration, the Jira integration" | Rótulos mono naranja sobre las curvas | Uno por línea |
| 16 | 48,0 | Texto grande "ALL OF THEM" debajo; las 5 líneas se encienden; empuje de 3 % | "all of them" | Texto de énfasis; empuje | Golpe |
| 17 | 49,0 a 52,0 | Rótulo AND AGAIN; las líneas se atenúan; YOUR APP se corre a la izquierda; "AI APP 2" entra a la derecha (50) con su chip LLM (51); 5 curvas punteadas naranjas desde AI APP 2 a los mismos logos (51 a 52) y "THE SAME FIVE" | "Now imagine your company builds another AI app... the same services" | Segunda caja; curvas punteadas | La caja desliza; las curvas se dibujan |
| 18 | 53,0 a 55,5 | X roja entre los dos chips LLM y rótulo rojo "NO STANDARD INTERFACE" (53 a 55); a 55 s las 10 curvas son sólidas y un contador sube de 5 a "10 INTEGRATIONS" (55,0: 6; 55,4: 10) | "...rebuilding those integrations again" | Contador animado; rótulo rojo | Contador que sube |
| 19 | 56,0 a 58,5 | Avatar crece (~1,4x); el tablero se atenúa (57); texto azul enorme "MCP" con "THE PROBLEM IT SOLVES" debajo (58) | "this is the problem MCP tries to solve" | Tarjeta de título sobre tablero atenuado | Atenuado + texto grande |
| 20 | 59,0 a 61,5 | Rótulo ONE PROTOCOL; vuelve el tablero con las 10 curvas; sobre cada logo aparece un conector de forma distinta: círculo, cuadrado, rombo, arco, pestaña (61); texto "EVERY ONE DIFFERENT" | "...understanding every service differently" | Cinco conectores distintos | Aparecen a la vez |
| 21 | 62,0 a 64,0 | Una barra azul atraviesa el tablero (62); en ella aparece "MCP" y los cinco conectores pasan a ser cuadrados azules iguales (63) | "MCP gives them a common protocol" | Barra azul MCP; conectores que se igualan | La barra se dibuja de izquierda a derecha |
| 22 | 64,0 a 65,5 | Las curvas naranja se desvanecen; líneas azules verticales de cada app a la barra; fila de 5 cajitas "MCP SERVER" (65) | "Your application connects to MCP servers" | Cajas "MCP SERVER" | Aparecen en fila |
| 23 | 66,0 a 70,0 | Cada "MCP SERVER" se une a su logo con una línea naranja, una a una (GitHub 66, Notion 68, todas 69); conectores azules pequeños (70) | "GitHub can have an MCP server. Notion can have one. Your database can have one" | Líneas naranja que aparecen una a una | Una por cada servicio nombrado |
| 24 | 71,0 | Rótulo mono azul "SAME FORMAT" bajo el tablero | "their capabilities in the same format" | Rótulo | Aparece |
| 25 | 72,0 a 72,9 | Tarjeta vacía con una línea verde y "THE IMPORTANT PART" en verde, mayúsculas | "Now here's the important part" | Tarjeta de capítulo | Línea que se dibuja, texto |
| 26 | 73,0 a 75,0 | Vuelve el tablero con apps atenuadas; el MCP SERVER de GitHub se resalta en verde (74); un icono verde de menú (cuadrado con 3 rayas) sube por la línea azul hacia YOUR APP (75) | "An MCP server can tell the application what tools it provides" | Icono de "menú" | El icono viaja por la línea |
| 27 | 76,0 a 80,9 | Tarjeta "GITHUB MCP SERVER" con el logo de GitHub; lista mono verde tecleada: list_issues, read_pull_requests, search_code, create_issue; texto "FOUR TOOLS" (80) | "list issues, read pull requests, search code, create issue" | Tarjeta de interfaz con el logo de GitHub; lista en mono | Una línea por herramienta, tecleada |
| 28 | 81,0 a 81,7 | Avatar grande; "TOOL DISCOVERY" gigante en verde en 2 líneas | "This is called tool discovery" | Tarjeta de título | Atenuado + texto |
| 29 | 82,0 a 84,5 | Vuelve el tablero; el icono de menú sube desde el MCP SERVER hasta el chip LLM de YOUR APP (84) | "The application gives those available tools to the model" | Icono que viaja | Viaja por la línea azul |
| 30 | 85,0 a 87,9 | Tarjeta "YOU ASK" con cursor y texto mono tecleado "what bugs are still open for authentication?" | (la voz lee la pregunta) | Cita en mono | Tecleado sincronizado con la voz |
| 31 | 88,0 a 90,9 | Vuelve el tablero; bajo él aparece una fila de 4 chips verdes (list_issues, read_pull_requests, search_code, create_issue); un resaltado lila salta entre chips (88,4 está en search_code) y se queda en list_issues (89), que se llena de verde y marca "RIGHT ACTION" (90) | "the model can decide that searching GitHub issues is the right action" | Menú de 4 chips con selección | El resaltado "duda" y elige |
| 32 | 91,0 | El chip list_issues sube por una línea lila fina hacia YOUR APP | "It chooses the tool" | Chip que viaja | Sube |
| 33 | 92,0 a 96,9 | Rótulo UNDERNEATH; la barra MCP baja de intensidad y vuelve (93 a 94) como si pasara la petición; el MCP SERVER de GitHub se resalta (94); dos puntitos de paginación abajo (96) | "Your application sends the request through MCP, and the GitHub MCP server performs the operation" | Barra que pulsa | Pulso de color |
| 34 | 97,0 a 100,9 | La cámara baja y se acerca (empuje ~1,15x) hasta GitHub y su MCP SERVER; línea naranja del servidor al logo (98), recuadro naranja alrededor del logo (99), texto ocre "STILL THE API" (100) | "But underneath, that MCP server usually still calls GitHub's normal API" | Movimiento de cámara; recuadro | Panorámica hacia abajo con zoom |
| 35 | 101,0 | Avatar grande; texto enorme en 3 líneas "THE API / NEVER / DISAPPEARED" (la última en ocre) sobre el tablero muy atenuado | "The API never disappeared" | Tarjeta de título (remate) | Atenuado + texto |
| 36 | 102,0 a 104,5 | Rótulo SO WHICH IS IT; chip "MCP" azul (102); flecha hacia un chip "API" naranja y un "?" negro (103); el MCP sale y queda API (104) | "So does MCP replace APIs? No, APIs expose the..." | Dos chips y una pregunta | Chips que entran y salen |
| 37 | 105,0 | El chip API se vuelve una barra naranja ancha sobre los logos con el rótulo "THE ACTUAL FUNCTIONALITY" | "...actual functionality" | Barra naranja | El chip se estira |
| 38 | 106,0 a 110,9 | Una barra azul se dibuja encima (106); YOUR APP y AI APP 2 arriba (107); líneas azules verticales (108); etiquetas "DISCOVER" y "USE" (109); conectores naranja entre las dos barras (110) | "MCP gives AI applications a standard way to discover and use that functionality" | Pila de capas | Entran de arriba a abajo |
| 39 | 111,0 a 116,2 | Dentro de la barra naranja se escribe "INTERFACE FOR SOFTWARE" (111 a 112); dentro de la azul "AI-FACING LAYER" (114); texto "BUILT ON TOP" bajo el tablero (116). El último cuadro queda quieto | "APIs are the interface for software, and MCP is a common AI-facing layer built on top of them" | Diagrama final de capas | Texto que aparece en las barras |

Colores usados con significado: naranja/ocre = API y costo; azul = MCP; lila = LLM y el modelo; verde = herramientas y descubrimiento; rojo = no/bloqueo. Texto fijo con estilo: rótulo mono en mayúsculas (capítulo), sellos rotados ("SIMPLE" gris, "NOT DIRECTLY" rojo), etiquetas mono pequeñas bajo los logos, titulares enormes bold condensados ("DO WE NEED MCP?", "THE API NEVER DISAPPEARED", "TOOL DISCOVERY").

## 7. El ritmo

Se cuentan cambios visuales distintos de los subtítulos (entra o sale un elemento, un estado cambia, un texto empieza a teclearse, hay un movimiento de cámara). Muestreo a 1 s: el número real puede ser algo mayor.

| Tramo | Cambios | Notas |
|---|---|---|
| 0 a 10 s | ~14 | Avatar, titular, "MCP?", línea naranja, chips, flecha, cajas A y B, línea y píldora, YOUR APP, curvas, tecleo |
| 10 a 20 s | ~9 | Logo, recuadro, paquete, curva, sello SIMPLE (quieto 15,5 a 18), MANY SERVICES, Gmail |
| 20 a 30 s | ~13 | Un logo y una etiqueta por segundo, 5 curvas, lista tecleada |
| 30 a 40 s | ~10 | Destello, LLM, UNDERSTAND, DECIDE, X roja, tarjeta del modelo |
| 40 a 50 s | ~9 | Tecleo, marco, 3 rótulos, empuje "ALL OF THEM", AI APP 2 |
| 50 a 60 s | ~10 | Curvas punteadas, X, contador, avatar grande, atenuado, "MCP" |
| 60 a 70 s | ~10 | Conectores, barra azul, 5 servidores, 3 conexiones |
| 70 a 80 s | ~10 | Rótulo, capítulo, icono de menú, lista de 4 herramientas |
| 80 a 90 s | ~9 | Avatar grande, menú viaja, pregunta tecleada, chips, resaltado |
| 90 a 100 s | ~9 | Chip sube, pulso, cámara baja, recuadro, "STILL THE API" |
| 100 a 110 s | ~10 | Remate, pregunta, chips, barras, etiquetas |
| 110 a 116 s | ~5 | Dos textos en barras y "BUILT ON TOP" |

Unos 118 cambios en 116 s: aproximadamente 10 cada 10 s (un cambio por segundo; el subtítulo cambia además cada ~1 s). **0 cortes duros.** Hay 39 recomposiciones del tablero y 8 capítulos.

**Se queda quieto más de 2 s** (solo cambia el subtítulo):
- 15,5 a 18,0 s: sello "SIMPLE" y una curva (unos 2,5 s).
- 42,0 a 44,0 s: marco "YOUR CODE" (2 s).
- 53,0 a 55,0 s: "NO STANDARD INTERFACE" (2 s).
- 99,5 a 101,0 s: cámara quieta sobre GitHub, solo "STILL THE API" (1,5 a 2 s).
- 114,3 a 116,16 s: el diagrama final sin cambios (casi 2 s; el último cuadro queda fijo).

## 8. El cierre

- **Cómo termina (111 a 116,16 s):** el mismo tablero se convierte en una pila de capas: apps arriba, barra azul "AI-FACING LAYER" (MCP), barra naranja "INTERFACE FOR SOFTWARE" (APIs) y los logos de GitHub, Gmail, Jira, Notion y base de datos abajo. El texto "BUILT ON TOP" aparece en el último segundo. Es un buen cuadro final porque resume todo en una sola imagen.
- **CTA:** no hay en el video. No dice el nombre de la cuenta, no pide seguir, guardar ni comentar, y no hay tarjeta final. El único pedido está en el texto del post: "What's the worst 'MCP replaces X' take you've seen this week?" (pregunta para comentarios). El video no la hace en voz.
- **El bucle:** el video no vuelve al cuadro 1. El último cuadro no coincide con el primero (tablero con pila de capas frente a tablero vacío), así que no hay bucle limpio.

## 9. Dónde está flojo (lo que vamos a superar)

1. **La tesis llega tarde.** "The API never disappeared" está a los 101 s (87 % del video) y la respuesta "No, APIs expose the actual functionality" a los 104 s. Los 100 s anteriores son preparación. El post, en cambio, abre con la tesis. La estructura no recompensa al que se va a los 30 s.
2. **El gancho es una pregunta neutra, sin conflicto.** "Do we really need MCP when we already have APIs?" (0,2 a 2,8 s) no tiene cifra, enemigo ni consecuencia. El cuadro 1 (0 a 0,2 s) es un tablero vacío.
3. **Es largo para la dirección de los Reels.** Dura 116 s; la dirección fija de @jacket.dev es 45 a 60 s. La solución (la barra MCP) entra recién a los 62 s (53 %): 60 s son el "antes".
4. **Repite el costo tres veces.** La integración de cinco servicios se cuenta en 15 a 30 s (lista de 6 viñetas y "x 5"), otra vez en 41 a 48 s ("YOU BUILT THIS / ...AND THIS / ALL OF THEM") y otra en 49 a 55 s ("the same five", 10 integraciones). Son unos 40 s de un mismo problema.
5. **No cierra la cuenta.** Se hace subir el contador a "10 INTEGRATIONS" (55 s), pero con MCP nunca vuelve a bajar. Faltan la matemática (10 integraciones contra 5 servidores + 2 clientes, o NxM contra N+M) y el momento de "alivio" que el video prepara. Es la prueba más fuerte y no se usa.
6. **El punto central no se demuestra con nada real.** "El servidor MCP de GitHub sigue llamando a la API normal" (97 a 101 s) se muestra con un recuadro naranja y un texto "STILL THE API": 3 s, sin una sola petición HTTP, ni un `GET`, ni la respuesta. No se ve cómo es una definición de herramienta (nombre, descripción, esquema de entrada), ni el mensaje que el cliente le pide al servidor, ni la llamada de herramienta. "Tool discovery" se ilustra con 4 nombres en mono y un icono de menú que viaja.
7. **La mejor frase del post no se ilustra.** "The model gets handed a menu it didn't have to be told about, and picks the right item itself": el video muestra un icono y 4 chips, pero no un "antes y después" de qué sabía el modelo.
8. **Inconsistencia de pantalla y voz.** La voz dice "searching GitHub issues is the right action" (88 a 90 s) pero el resaltado empieza en `search_code` (88,4) y se queda en `list_issues`. La herramienta `read_pull_requests` y el listado de 4 herramientas son una simplificación (no se dice que sean ejemplos).
9. **Dónde se pierde la tensión (quieto).** 15,5 a 18 s, 42 a 44 s, 53 a 55 s y 99,5 a 101 s: tramos de ~2 s con un solo elemento.
10. **El avatar es decorativo.** ~85 % del tiempo es una figura pequeña en la misma pose. No reacciona ("NOT DIRECTLY", el "10 INTEGRATIONS", la X), no señala el tablero, no cambia de plano. Solo se ve grande en 4 momentos (0,2 a 2,8; 56 a 58; 81 a 81,7; 101). Es una oportunidad: usarlo con intención.
11. **No hay CTA en el video**, ni el nombre de la cuenta, ni la pregunta del post dicha en voz. El video termina en un cuadro quieto.
12. **Marcas solo como íconos.** GitHub, Gmail, Jira y Notion entran como logos pequeños en una ranura; nunca se ve su interfaz, ni su documentación, ni un servidor MCP real. El "GITHUB MCP SERVER" es una tarjeta de adorno.
13. **Qué no hay:** ninguna fuente en pantalla (ni el nombre del repositorio oficial del servidor MCP de GitHub, ni la especificación), ni una fecha, ni una cifra de adopción.
14. **Sin audio verificable:** no se pudo oír; no se sabe si hay música ni efectos con las entradas.

## 10. Qué momentos piden presentador y cuáles no

**Piden presencia (cara, gesto, tamaño grande):**
- 0 a 3 s: el gancho (en el referente ya es grande). Aquí debería estar la tesis, no la pregunta.
- 56 a 58 s: el giro "this is the problem MCP tries to solve" (de problema a solución). El referente ya agranda al avatar aquí.
- 81 a 81,7 s: "This is called tool discovery": el nombre del concepto.
- 101 s: "The API never disappeared": el remate.
- 102 a 105 s: "So does MCP replace APIs? No": la respuesta.
- Cierre (111 a 116 s) y CTA: el referente no lo tiene; el avatar debería pedir la acción.

**No piden presencia (manda el gráfico):**
- 5 a 30 s: la explicación de la API con GitHub y la lista de servicios.
- 31 a 48 s: el LLM, la X de "NOT DIRECTLY" y la cita del modelo.
- 59 a 71 s: el armado de la capa MCP.
- 76 a 96 s: la lista de herramientas, la pregunta y la selección.
- Los logos, los bloques de texto mono y el contador.

**Reacciones breves (esquina, 1 a 2 s):** cuando se bloquea ("NOT DIRECTLY", 37 s) y cuando el contador llega a 10 (55 s).

## 11. Para copiar y lo que no

### Se puede llevar (estructura y recursos)

1. **Un solo mundo sin cortes**: un tablero que se recompone en lugar de cortar; el rótulo de capítulo en mono arriba (8 capítulos) para dar orientación.
2. **Código de color con significado** (API, modelo, protocolo, herramientas, bloqueo) y pocos colores. Que los colores sean de nuestra paleta, no los suyos.
3. **Construcción palabra por palabra**: cada logo entra en el segundo en que se nombra, con una etiqueta de 1 palabra debajo.
4. **Texto mono tecleado en sincronía con la voz** para la pregunta del usuario, la salida del modelo y la lista de herramientas.
5. **Paquete que viaja por una curva** (petición, respuesta) y **línea que se dibuja** en lugar de aparecer.
6. **Contador animado** de costo (5 a 10).
7. **Sellos rotados** para las objeciones ("SIMPLE", "NOT DIRECTLY") y una X roja que corta una línea.
8. **Conectores de formas distintas que se igualan cuando entra la barra del protocolo**: la imagen del "estándar" (en la línea de un USB). La metáfora es general; con otro objeto propio.
9. **Tarjetas de título con el avatar grande y el tablero atenuado** para los 3 o 4 momentos clave.
10. **Resaltado que "duda" entre opciones y elige** (4 chips; el resaltado salta antes de quedarse).
11. **Empuje o panorámica puntual** (48 s, 97 a 100 s) como énfasis, con el avatar fijo como capa independiente.
12. **Pila de capas final** (apps, capa de IA, capa de APIs, servicios) como resumen de una sola imagen.
13. **Orden narrativo:** pregunta; qué es una API con un ejemplo real (GitHub); muchos servicios y su costo; se agrega el LLM y sigue sin llamar solo; segunda app y 10 integraciones; el protocolo común; servidores; descubrimiento de herramientas; ejemplo de petición; "por debajo sigue la API"; respuesta; pila de capas.
14. **Logos e interfaces de productos reales** (no son de su marca; se recrean fieles según la regla 6 de `AGENTS.md`): GitHub, Gmail, Jira, Notion y el icono de base de datos; una tarjeta "GITHUB MCP SERVER". Orden de la regla: oficial, librería, pedírselo a Jeremy, recrear.
15. **Subtítulo karaoke** en pastilla (dicho / actual / pendiente) de 2 a 4 palabras.

### No se lleva (es su marca)

- El avatar tipo "Rick" (pelo azul, sudadera, laptop con stickers) y su tratamiento (boca, tamaños).
- El look del tablero: fondo gris claro, tarjeta con 4 puntos en las esquinas y dos líneas finas, y los rótulos de capítulo con esos nombres (THE QUESTION, THE COST, ADD A MODEL, AND AGAIN, ONE PROTOCOL, TOOL DISCOVERY, UNDERNEATH, SO WHICH IS IT). Los nuestros llevan otro nombre y el acento de @jacket.dev.
- Su combinación exacta de naranja, azul, lila y verde.
- El texto "THE API NEVER DISAPPEARED" tal cual y los titulares enormes bold condensados.

## 12. Cómo superarlo (ideas para el guion y el motion)

- **Tesis en el gancho** (0 a 3 s): "MCP no reemplaza tus APIs; por debajo las sigue llamando", con el logo de GitHub y una petición real; la pregunta queda para después.
- **Acortar a 45 a 60 s**: una sola vez el costo (sin la repetición de 41 a 55 s) y ir a MCP antes de los 30 s.
- **Cerrar la cuenta:** que el contador suba a 10 y luego baje (5 servidores + 2 apps) cuando entra el protocolo.
- **Demostrar la capa de abajo:** una petición real a la API de GitHub dentro del servidor MCP (qué endpoint, qué respuesta) y una definición de herramienta real con nombre, descripción y esquema de entrada; todo verificado con fuentes (documentación oficial de MCP y del servidor de GitHub).
- **El menú de herramientas como objeto:** que el modelo no sepa nada antes y reciba la lista; mostrar el antes y el después.
- **Avatar con intención:** grande en el gancho, el giro, el nombre del concepto, el remate y el cierre; pequeño en esquina reaccionando (bloqueo, contador).
- **Cierre con CTA claro** y un último cuadro que vuelva al primero (bucle), con la pregunta del post dicha en voz.

## 13. Lista para verificar (tal cual la dice o la muestra el video)

**Datos del reproductor:** 116,16 s; 720x1280; 55.791 me gusta; 344 comentarios; 544 K seguidores; 158 publicaciones (al 1-nov-2026). No se vio fecha ni vistas.

**Afirmaciones técnicas (voz):**
1. "An API is how two pieces of software communicate."
2. "GitHub exposes an API."
3. "Real applications usually talk to many services." (GitHub, Gmail, Jira, Notion, base de datos)
4. "For each service, you need integration code, authentication, API calls, error handling, retries, and logic for understanding the response."
5. "The application can now understand what the user wants and decide what action should happen, but the model itself usually doesn't directly [call GitHub]." (el final de la frase no se leyó)
6. "It says something like 'get the open issues from this repository,' and the normal software around the model performs that action." (el LLM produce una intención y el código la ejecuta)
7. "Another AI app that needs access to the same services; with no standard interface you may end up rebuilding those integrations again." (dos apps contra cinco servicios, "10 INTEGRATIONS")
8. "MCP gives them a common protocol. Your application connects to MCP servers."
9. "GitHub can have an MCP server. Notion can have one. Your database can have one, [each describing] their capabilities in the same format."
10. "An MCP server can tell the application what tools it provides. This is called tool discovery."
11. "The application gives those available tools to the model."
12. Ejemplo: "what bugs are still open for authentication?" y "the model can decide that searching GitHub issues is the right action. It chooses the tool."
13. "Your application sends the request through MCP, and the GitHub MCP server performs the operation."
14. "But underneath, that MCP server usually still calls GitHub's normal API." (el post dice "REST API")
15. "The API never disappeared."
16. "APIs expose the actual functionality. MCP gives AI applications a standard way to discover and use that functionality. [APIs are] the interface for software, and MCP is a common AI-facing layer built on top of them." (el post: "AI-facing layer on top of them")

**Textos, cifras y nombres en pantalla (tal cual):**
- Rótulos de capítulo: THE QUESTION, THE COST, ADD A MODEL, AND AGAIN, ONE PROTOCOL, TOOL DISCOVERY, UNDERNEATH, SO WHICH IS IT.
- Titulares: "DO WE NEED MCP?", "...we already have APIs", "MCP / THE PROBLEM IT SOLVES", "THE IMPORTANT PART", "TOOL DISCOVERY", "THE API NEVER DISAPPEARED", "THE ACTUAL FUNCTIONALITY", "BUILT ON TOP".
- Etiquetas: "SOFTWARE A", "SOFTWARE B", "API", "MCP", "YOUR APP", "AI APP 2", "LLM", "YOUR CODE", "SIMPLE", "MANY SERVICES", "NOT DIRECTLY", "YOU BUILT THIS / ...AND THIS / ...AND THIS", "ALL OF THEM", "THE SAME FIVE", "NO STANDARD INTERFACE", "EVERY ONE DIFFERENT", "SAME FORMAT", "FOUR TOOLS", "RIGHT ACTION", "STILL THE API", "DISCOVER", "USE", "INTERFACE FOR SOFTWARE", "AI-FACING LAYER", "MCP SERVER", "GITHUB MCP SERVER".
- Etiquetas de servicio: GitHub = "CODE", Gmail = "EMAILS", Jira = "TICKETS", Notion = "DOCUMENTS", base de datos = "USER DATA".
- Cifras: "5 services", "x 5 / FOR EVERY SERVICE", "10 INTEGRATIONS" (contador 5 a 10 a los 55 s).
- Lista "FOR EACH SERVICE": integration code, authentication, API calls, error handling, retries, logic for the resp[onse].
- Cita del modelo ("THE MODEL SAYS"): "get the open issues from this repository," (parcialmente leída: "get the open issues from").
- Pregunta del usuario ("YOU ASK"): "what bugs are still open for authentication?"
- Herramientas de la tarjeta "GITHUB MCP SERVER": `list_issues`, `read_pull_requests`, `search_code`, `create_issue` (verificar los nombres reales del servidor MCP oficial de GitHub; `read_pull_requests` puede no existir con ese nombre).
- Marcas con logo: GitHub, Gmail, Jira, Notion; icono genérico de base de datos.
- Texto del post: "Underneath, that GitHub MCP server is still calling GitHub's normal REST API", "list_issues, search_code, create_issue", "Five services meant five sets of auth, error handling, retries, and response parsing", "when your company shipped a second AI app, somebody built all five again", "the model gets handed a menu it didn't have to be told about, and picks the right item itself".
- No legible / no se oye: la voz real (solo se leyeron los subtítulos), cualquier música o efecto, la fecha y las vistas.
