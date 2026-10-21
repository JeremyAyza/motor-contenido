# Análisis: @rick.theengineer

Referente visual que eligió Jeremy el 20 de octubre de 2026 para los Reels. Se analizó con `ig-viral`, leyendo a ritmo humano en el navegador integrado, sin sesión y sin scraping. Los datos están en [swipe/2026-10-reels-rick-theengineer.tsv](swipe/2026-10-reels-rick-theengineer.tsv) y el ranking de la herramienta en [swipe-reels.md](swipe-reels.md).

## La cuenta

- **507 mil seguidores** al 20 de octubre de 2026. Según Jeremy, su primer video es de marzo.
- **Qué es:** explicaciones de tecnología con un presentador que es Rick, el de Rick and Morty. La bio dice que es una cuenta parodia, no oficial.
- **Cómo los hace:** la bio y un comentario fijado del autor dicen que los videos salen de una herramienta de pago (brainrotshorts.com), que hace los visuales, la voz y el movimiento. Es decir, salen de una tubería automática, como la nuestra.

## Los números

Se leyeron las vistas de 36 Reels en la grilla del canal, del 19 de septiembre al 20 de octubre de 2026, y el texto y la duración de 19 de ellos. La mediana de las 36 es de 238 mil vistas.

| Tema | Vistas | Múltiplo | Duración |
|---|---|---|---|
| Una foto que llega a Tokio en un segundo (modelo OSI) | 1,7 M | 7.1x | 135 s |
| Active Directory | 1,6 M | 6.7x | 126 s |
| CI/CD: producción se cae porque alguien olvida un paso | 1,4 M | 5.9x | 129 s |
| Nadie escribió el código que hace que ChatGPT programe | 1,4 M | 5.9x | 177 s |
| El taxímetro de la IA: tokens | 580 mil | 2.4x | 174 s |
| El backend de WhatsApp, de punta a punta | 562 mil | 2.4x | 173 s |
| Jev, un modelo que decide en vez de escribir | 426 mil | 1.8x | 131 s |
| Ingeniería inversa de DOOM | 319 mil | 1.3x | 137 s |
| Visión por computadora | 281 mil | 1.2x | 152 s |
| Por qué no hay un solo lenguaje | 269 mil | 1.1x | 148 s |
| El stack de datos (Kafka, Spark, dbt...) | 246 mil | 1.0x | 137 s |
| Passkeys contra contraseñas | 230 mil | 1.0x | 147 s |
| Linux | 202 mil | 0.8x | 147 s |
| Motores de videojuegos | 148 mil | 0.6x | 136 s |
| Ray tracing | 110 mil | 0.5x | 135 s |
| HTTP/1.1, 2 y 3 | 72,5 mil | 0.3x | 161 s |
| Tokens y precios de IA, otra vez | 59,8 mil | 0.2x | 174 s |
| El viaje de un skip en Spotify | 45,3 mil | 0.2x | 137 s |
| Computación cuántica | 8 mil | 0.0x | 120 s |

Otro Reel de 1,2 M no se pudo leer: Instagram pidió iniciar sesión y la lectura se cortó ahí. 6 de los 36 tienen menos de 10 mil vistas, quizá pruebas que se mostraron poco.

**Cuánto vale esto.** Es una sola cuenta. Sirve para ver qué separa sus mejores videos de los normales, no para afirmar que una fórmula funciona en general. Los de ray tracing y HTTP tenían menos de 3 días al leerlos.

**Lo que separa a los mejores.** Los 4 que pasan de 5x usan dos formas de gancho que no están en `ganchos-es.json`. `hookscore` no las ve: les da menos puntaje (mediana de 35) que a los de abajo (46).
- **Un segundo por dentro.** Un gesto de todos los días y todo lo que pasa adentro: la foto que llega a Tokio en un segundo, o el login que abre todo. También la usan WhatsApp y el taxímetro de tokens, los dos con 2.4x.
- **La causa no es la que crees.** Una afirmación que contradice lo obvio, sobre por qué pasa algo: producción no se cae porque el equipo programe mal, sino porque alguien tuvo que acordarse de cada paso; nadie escribió el código que hace programar a ChatGPT.

**Lo que no funciona.** Repetir un tema a los pocos días. El segundo video de tokens sacó 59,8 mil, contra 580 mil del primero, una semana antes. El viaje de un skip en Spotify sacó 45 mil, días después del stack de datos con la misma historia (246 mil).

## El formato

- **Largos.** Duran de 120 a 177 s, mucho más que los 30 a 60 s de nuestra regla.
- **Uno por día.** Son 36 Reels en un mes.
- **Una historia con personaje.** Lena le manda la foto de su gato a su hermano en Tokio, y la foto baja por las 7 capas. Un ticket de soporte recorre el modelo que decide. El hilo une todo el video.
- **Lo que se planta al principio se paga al final.** En el de CI/CD, el bug que tumba producción al final es el paso que se olvidó al principio, y el texto del post invita a verlo hasta el final.
- **Una frase para recordar al final.** "Una contraseña dice que sabes el secreto; una passkey lo demuestra sin revelarlo". "Los LLM generan, Jev decide".
- **Fechan lo que cambia.** Los precios llevan "a octubre de 2026".
- **Por capítulos.** Cada video es una lista numerada: los 10 pasos del backend o las 3 formas de abrir un juego. Varios llevan una barra de capítulos arriba, y el texto del post pide verlo dos veces y fijarse en esa barra la segunda vez.
- **"Todo es real".** El texto del post insiste en que las salidas, los renders y las mediciones son reales: un render de 1 muestra por píxel que se limpia hasta 256, 48 peticiones medidas o un modelo que corrió de verdad. Es su prueba de credibilidad.
- **El texto del post** es casi un artículo: el gancho, una lista numerada con los datos y dos pedidos al final (comenta y guarda).

## Lo visual

1. **Un mundo por tema.** El de Active Directory pasa entero dentro de un escritorio de Windows 98, porque AD salió con Windows 2000. Hasta los subtítulos van con el resaltado azul de esa época. El de ray tracing usa renders 3D reales de un cuarto y de una ciudad. La dirección no es solo una paleta: es el lugar donde ocurre el video.
2. **Interfaces como escenario.** Teléfonos con apps, la barra del navegador con el dominio, tarjetas de apps con el logo y el dominio, chats, tarjetas de datos con tablas y una terminal. Lo que se explica pasa dentro de una pantalla que el público reconoce.
3. **Una capa de HUD.** Chips en mayúsculas y monoespaciadas arriba ("PASSKEYS VS PASSWORDS", "01 PASSWORDS"), el número de capítulo, la paginación con puntos y rótulos de sección como "APPLE SILICON / FOUNDATION". Da sensación de sistema y de avance.
4. **Escenario continuo.** La barra del navegador o el marco de la app sigue entre una idea y la siguiente, y lo que cambia es el contenido. Casi no hay cortes duros.
5. **Cámara y profundidad.** Capas en 3D isométrico con bordes de neón (el modelo OSI), cámaras que se acercan a una zona y planos con perspectiva.
6. **Color con significado.** Cada pieza usa 2 a 4 colores con función: rojo para la contraseña débil, amarillo para la passkey, violeta para entrenar y turquesa para servir. No es un solo acento.
7. **Densidad.** Cada cuadro tiene 3 o 4 capas: el escenario, rótulos, chips y subtítulos. Mucho texto de interfaz, pero una sola frase para leer.
8. **El presentador.** El personaje aparece de cuerpo entero al costado y le da cara a la cuenta.
9. **Subtítulos en una píldora oscura.** Las palabras ya dichas van en blanco y las que faltan en gris, como un karaoke. En el mundo de Windows 98 cambian de estilo.
10. **Fotos y renders reales.** Fotos de gatos y perros de un dataset, un rack de servidores y renders 3D, mezclados con interfaz dibujada.

## Lo que tenemos y lo que falta

| Rasgo | Nuestro motor hoy | Lo que falta |
|---|---|---|
| Un mundo por tema | La dirección de arte de la baraja: paleta, tipografías, ancla y tono por escena | Que la dirección pueda ser un **mundo** (un escritorio de época, una terminal, un plano 3D), con sus subtítulos |
| Interfaces como escenario | `Window` y `Code` del carrusel | Un **kit de escenario**: teléfono, barra de navegador, tarjeta de app (logo oficial y dominio), chat, tabla de datos y terminal con salida real |
| Capa de HUD | La pestaña de archivo del marco | **Chips** monoespaciados, número de capítulo y **barra de capítulos** con las escenas |
| Escenario continuo | Cada escena es un `<Slide>` nuevo, con corte duro | Un escenario que **persiste** entre escenas y transiciones entre estados |
| Cámara y profundidad | Entradas con CSS (aparece, sube, traza) | `<Camara>` para acercarse a una zona, perspectiva 3D con CSS y, para renders reales, `@remotion/three` |
| Color con significado | Un acento por pieza | 2 a 4 **colores con función** en la paleta, con contraste revisado |
| El presentador | Pendiente (fase 4) | El avatar de Jeremy, de su ilustración |
| Subtítulos | Por frase, con la palabra dicha en el acento | Un estilo **píldora con avance** y estilos por mundo |
| Lo real | `facts.json` con fuentes | Salidas, mediciones y renders reales cuando existan. No es obligatorio: Jeremy no quiere exigir pruebas propias |
| Duración | De 30 a 60 s | Probar un formato de capítulos de 90 a 150 s y decidir con `video-metrics.json` |

## Lo que no se copia

- **El personaje.** Rick es un personaje de Adult Swim, y esa cuenta es una parodia. Nuestro presentador es el avatar de Jeremy, como dice la fase 4.
- **Las apps de marcas reales.** Ellos recrean la app de PayPal. Aquí las interfaces son propias y genéricas, con el logo oficial solo para identificar (regla 6 de AGENTS.md).
- **Los dos pedidos.** Ellos piden comentar y guardar; aquí va un solo CTA.
- **Su guion y su edición.** Se toma la forma (mundo, escenario, capítulos, HUD), no sus videos.

## Plan propuesto

En orden, para probarlo con un video nuevo antes de tocar los aprobados:

1. **Kit de escenario y HUD.** Hecho el 20 de octubre de 2026 en `packages/video/src/kit/stage.tsx`: `Phone`, `BrowserBar`, `AppCard`, `Chat`, `Terminal`, `Diff`, `DataTable` y `Chip`, más la barra de capítulos del marco (`ChapterBar`). El inspector deja fuera del conteo de palabras el texto de interfaz (`data-ui`). Se probó en el video de la pieza "4 tareas de dev para tu agente".
2. **Subtítulos con estilo.** Hecho el mismo día: `captions` en `defineVideo`, con `highlight`, `pill` (la píldora con avance) y `marker`.
3. **Mundos en la baraja:** direcciones nuevas pensadas para video, que también sirven al carrusel. Por ejemplo, el escritorio de época, el panel de control o las capas 3D, cada una con su escenario y sus subtítulos.
4. **Escenario continuo y cámara:** un escenario que sigue entre escenas, `<Camara>` para acercarse a una zona y perspectiva 3D con CSS.
5. **Colores con función** en `art.palette`, con el contraste revisado.
6. **El avatar** (fase 4), con la ilustración de Jeremy.
7. **Duración:** un Reel de capítulos de 90 a 150 s, publicado como trial, comparado con los de 60 s en `video-metrics.json`.
8. **La fórmula nueva** en `ganchos-es.json`: un gesto de todos los días y el sistema invisible que lo hace posible.

Los pasos 1 y 2 ya están, con su video de prueba. De paso, `video:storyboard` muestra los visuales en la puerta A sin generar voz, y el inspector mide el vacío bajo el dibujo en vez del centro, que el título fijo arriba siempre subía. `@remotion/three` y los renders reales quedan para cuando un tema los pida.
