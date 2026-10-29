# Referente: @rick.theengineer, robo de sesión

Leído el 27 de octubre de 2026 en `/p/DbuZQU8MlaL/embed/`, sin sesión, con cuadros cada 0,5 s en los primeros 5 s y cada 2 s después (más algunos extra en cambios de escena). El audio no se oye en el reproductor de análisis: lo que se dice sale de los subtítulos quemados, y donde un subtítulo no se vio, va entre corchetes como inferencia.

## 1. Ficha

- **Cuenta:** @rick.theengineer (presentador: Rick, de Rick and Morty; es una cuenta parodia).
- **URL:** https://www.instagram.com/p/DbuZQU8MlaL/
- **Duración exacta:** 74,69 s (74,686708). Formato 720x1280, vertical 9:16.
- **Me gusta:** 12.877 (dato del encargo). Las vistas y la fecha no se ven en el reproductor incrustado.
- **Ya no es un video largo:** 75 s, contra los 120 a 177 s que tenían sus Reels de septiembre y octubre (ver `docs/analisis-rick-theengineer.md`).

## 2. El gancho, 0 a 3 s

- **Cuadro 1 (0,0 s):** casi negro. Solo el fondo azul marino muy oscuro con un resplandor ámbar tenue en el centro y una cuadrícula de puntos casi invisible. No hay nada más. Dura menos de 0,5 s.
- **Cuadro de 0,5 s:** aparece Rick de cuerpo entero al lado izquierdo (sudadera negra con un logo verde, jeans, tenis, una laptop con stickers bajo el brazo). Abajo, el subtítulo en una caja con borde blanco: "I'm gonna show you".
- **1 s:** en el centro aparece un escudo ámbar con candado (línea fina) y debajo seis casillas con el código 4 9 2 7 1 3, que se llenan una a una.
- **2 s:** texto gigante en rosa-rojo, apilado: "BYPASS" y debajo "2FA". Es la única frase en pantalla grande.
- **2,5 s:** una línea roja fina cruza el escudo (escaneo).
- **Lo que se dice, 0 a 3 s:** "I'm gonna show you how hackers can bypass two-factor authentication." (11 palabras en unos 3 s).
- **Qué hace el gancho:** promete un hackeo que parece imposible ("pasar el 2FA"), con el objeto de seguridad que el público conoce (escudo, código de 6 dígitos). No pregunta y no se presenta. Es la forma "la causa no es la que crees" de su análisis anterior: la afirmación contradice lo que se cree.
- **Del 3 al 7,5 s sigue el gancho (la tesis):** "And yes, this can still work even if you use a very strong password and 2FA enabled." Se muestra con dos tarjetas: PASSWORD (puntos, barra que se llena en verde, etiqueta "very strong") y TWO-FACTOR AUTH (un círculo que gira y pasa a un check ámbar con "Enabled"). A los 7 s, una línea roja punteada barre la pantalla y un rótulo dice "both are still switched on".

## 3. El mundo

- **No es un escenario físico.** Es un fondo único todo el video: azul marino casi negro, cuadrícula de puntos casi invisible y un **resplandor radial que cambia de color según el significado**: ámbar (el candado y el 2FA), verde (contraseña fuerte y servidor que reconoce), cian (la cookie y el parque), rojo (el atacante y el robo) y violeta (la prueba controlada).
- **La metáfora del parque de diversiones no es el escenario.** Dura solo de los 16 a los 24 s (unos 8 s de 75): arco "THEME PARK", tarjeta "YOUR ID", la pulsera ("WRISTBAND", un aro cian) y tres juegos con torniquete ("RIDE 1, 2, 3"). Después vuelve al diagrama del navegador y el servidor, "same object, new picture".
- **El hilo que dura todo el video es un diagrama de dos cajas:** `BROWSER` (icono de ventana) y `WEBSITE` (icono de servidor) unidos por una línea. Sobre esa línea viaja un objeto: una pastilla con puntos (la contraseña), luego la pastilla cian `sid=8f2b.c41a` (la cookie), luego la misma pastilla en rojo (cookie robada). Cambia el objeto, no el diagrama. El atacante es una silueta roja de busto con antifaz que cuelga debajo del diagrama.
- **Cámara:** no hay movimiento de cámara real. Todo es plano frontal, 2D, con líneas finas. Lo que da sensación de movimiento: las transiciones entre escenas (un barrido de línea punteada roja a los 7 s y un arco rojo a los 57 s), los elementos que entran y se llenan, el cursor que se mueve por una ventana, y un pequeño empuje del presentador en la escena de "SESSION HIJACKING" (a los 59 s está más grande y más arriba que a los 58 s).
- **Presentador:** Rick de cuerpo entero, **siempre en el mismo lugar** (borde izquierdo, un tercio de la altura de abajo hacia arriba), como un recorte. Mueve la boca y cambia los ojos (cerrados a los 19 s). No camina ni señala. Solo cambia de posición y escala en las dos últimas escenas.
- **Subtítulos:** caja de borde blanco sobre fondo oscuro, abajo al centro. Tres o cuatro palabras a la vez; las dichas van en blanco y las que faltan, en gris azulado. Se renuevan cada 1 a 1,5 s.
- **HUD:** rótulos pequeños en mayúsculas y monoespaciados ("ONCE", "INSTEAD", "NO RE-AUTH", "WHAT THE COOKIE SAYS", "CONTROLLED TEST", "BROWSER A", "NEITHER WAS ENTERED"), y frases cortas en minúsculas y monoespaciadas debajo del dibujo como segunda lectura ("same object, new picture", "prove it once - get the band", "the server cannot tell the difference", "the login was never attempted").
- **Interfaces recreadas (todas genéricas, ninguna es de una marca real):** formulario de contraseña con barra de fuerza, tarjeta de 2FA con spinner, ventana de navegador con tres tarjetas y cursor, formulario de LOG IN (email, password, 2FA code), tabla de cookies de DevTools (Name / Value, fila `sid  8f2b.c41a`), tarjeta de "user: you / auth: true / mfa: passed", dos ventanas de navegador (A y B). **No hay logos de empresas, ni Windows, ni apps.**

## 4. Escena por escena

Los tiempos son de las muestras (cada 2 s, más finas en los primeros 5 s): el error de cada corte es de más o menos 1 s, salvo los primeros 5 s. Se cuentan 28 escenas, unas 2,7 s cada una en promedio.

| # | Tiempo | Lo que se ve | Lo que se dice (resumido) | Recurso | Cómo entra |
|---|---|---|---|---|---|
| 1 | 0 a 3 | Fondo vacío, entra Rick, escudo con candado, 6 casillas de código, "BYPASS 2FA" en rosa gigante, línea de escaneo | "Voy a mostrarte cómo los hackers pueden saltarse el 2FA" | Escudo ámbar (objeto), texto grande | Fade del fondo, Rick aparece, objetos entran con escala |
| 2 | 3 a 7 | Tarjetas PASSWORD (barra verde llena, "very strong") y TWO-FACTOR AUTH (spinner a check "Enabled"), glow verde | "Y sí, esto puede funcionar aunque tengas contraseña fuerte y 2FA" | Interfaz de formulario | Las tarjetas suben; la barra se llena en 1,5 s |
| 3 | 7 a 8 | Las mismas tarjetas, línea roja punteada que barre, "both are still switched on" | "...ambas siguen activas" | Rótulo mono | Barrido de línea |
| 4 | 8 a 10 | Diagrama BROWSER - pastilla de puntos - WEBSITE, "ONCE", "authenticated" | "Esto es por qué. Después de que entras..., los sitios no preguntan" | Diagrama de dos cajas | Corte, las cajas aparecen con el glow verde |
| 5 | 10 a 14 | Ventana de navegador vacía, luego tres tarjetas y un cursor que hace clic; "NO RE-AUTH" | "...por tu contraseña en [el navegador]... código de dos factores cada vez... haces clic en algo" | Ventana de navegador genérica | Cuadro de ventana aparece, tarjetas entran una a una |
| 6 | 14 a 16 | Diagrama con la pastilla cian `sid=8f2b.c41a` y "INSTEAD", "SESSION COOKIE" gigante en cian | "...en cambio, una cookie de sesión" | Cookie como pastilla; título gigante | Cambio de glow a cian; el título entra apilado |
| 7 | 16 a 18 | Arco "THEME PARK" en cian con la pastilla de cookie debajo, luego aparece la pulsera (aro) | "Piénsalo como un parque de diversiones" | Arco SVG de línea fina | La pastilla se transforma en el arco |
| 8 | 18 a 20 | Tarjeta "YOUR ID" y la pulsera "WRISTBAND", "prove it once - get the band"; Rick con los ojos cerrados | "...pulsera" | Metáfora, objeto dibujado | Cambia el dibujo, glow cian |
| 9 | 20 a 22 | Tres juegos (torniquetes) con la identificación tachada en los dos primeros y la pulsera en el tercero | "...sin mostrar tu identificación otra vez" | Tres iconos de juegos | Entran los tres a la vez |
| 10 | 22 a 24 | Vuelve el diagrama con la cookie, "same picture" | "...de forma similar" | Diagrama de dos cajas | Transforma el parque en el diagrama |
| 11 | 24 a 26 | Tarjeta "WHAT THE COOKIE SAYS": user: you / auth: true / mfa: passed | "Este usuario ya [pasó el 2FA]" | Tarjeta de datos (mono) | Aparece con línea a línea |
| 12 | 26 a 28 | Diagrama con glow rojo que sube desde abajo, silueta del atacante con antifaz, la cookie se duplica | "...logra robar esa cookie" | Atacante (silueta roja) | Cambio de glow a rojo |
| 13 | 28 a 30 | Pastilla roja "stolen session" arriba a la derecha; resto vacío | "con una sesión activa, [el atacante] puede no necesitar..." | Chip rojo neón | Los elementos salen, queda solo el chip |
| 14 | 30 a 33 | Formulario con "YOUR PASSWORD" atenuado y "YOUR 2FA CODE 492713" | "...no necesitar tu código de dos factores" | Formulario genérico | Entra el formulario |
| 15 | 33 a 35 | LOG IN con email, password, 2FA code (sin llenar) | "...tu cuenta, podrían [entrar]" | Formulario de login | Cambio, el formulario sube |
| 16 | 35 a 37 | Pastilla roja `sid=8f2b.c41a` dentro de un recuadro punteado rojo, "already authenticated" | "...una sesión que ya está [autenticada]" | Cookie robada | Corte; recuadro punteado dibujado |
| 17 | 37 a 39 | Marco violeta "CONTROLLED TEST", vacío, y luego las ventanas A y B | "En una prueba controlada..." | Marco/etiqueta HUD | Glow violeta, el marco se dibuja |
| 18 | 39 a 43 | Ventana BROWSER A con tabla Name/Value y la fila `sid 8f2b.c41a`, ventana BROWSER B con campo vacío; la pastilla roja pasa de A a B | "...puedes tomar la sesión de un navegador [y llevarla a otro]" | Tabla de cookies de DevTools genérica | La pastilla viaja entre ventanas |
| 19 | 43 a 45 | Diagrama BROWSER B - cookie roja - WEBSITE | "...enviar esa sesión válida de vuelta" | Diagrama | Corte al diagrama |
| 20 | 45 a 48 | Tarjeta WEBSITE, se pone en verde, "recognized as you", "the server cannot tell the difference" | "El servidor puede reconocer [la sesión robada] como el usuario conectado" | Servidor | Glow verde |
| 21 | 48 a 50 | A atenuada, B activa con "you" y "session active" | "...ahora usando la primera" | Ventanas A y B | Corte con intercambio de estado |
| 22 | 50 a 54 | "NEITHER WAS ENTERED" y "PASSWORD" en rosa gigante, luego "PASSWORD / 2FA CODE" tachados, "the login was never attempted" | "No se ingresó contraseña. [Ni código 2FA]" | Texto gigante con tachado | Corte, el tachado se dibuja |
| 23 | 54 a 59 | El escudo ámbar vuelve, "still locked", "proof of authentication", un arco rojo pasa por encima | "Se saltan el login, que el usuario ya [había completado]... ya autenticado" | Escudo (el mismo del gancho) | Fade al escudo; el arco barre |
| 24 | 59 a 61 | "SESSION HIJACKING" gigante en rojo, "it has a name", Rick más grande | "Esto se llama session hijacking" | Título gigante | Corte; leve empuje del presentador |
| 25 | 61 a 68 | "WHAT ACTUALLY HELPS" con 4 casillas: Log out of shared computers, Remove sessions you don't recognise, Avoid sketchy extensions & links, Keep your devices secure | "Debes cerrar sesión... eliminar sesiones que no reconozcas... evitar extensiones sospechosas... mantén tus dispositivos seguros" | Lista con check | Ver la sección 5 |
| 26 | 68 a 70 | Escudo ámbar con el código de 6 casillas | "...el 2FA sigue siendo muy útil" | Escudo, vuelve el objeto del gancho | Corte; glow ámbar |
| 27 | 70 a 72 | Escudo "2FA / guarded" a la izquierda, línea vertical ámbar y pastilla cian "your live session / not guarded" a la derecha | "...protege el proceso de login" | Diagrama dividido | Se dibuja la línea divisoria |
| 28 | 72 a 74,7 | "A STOLEN SESSION IS AN ATTACK ON" y "WHAT HAPPENS AFTER" en cian gigante; en los últimos 0,5 s aparece un candado pequeño "still locked" abajo a la derecha | "Un robo de sesión es un ataque a lo que pasa después de que ya estás conectado" | Título gigante (frase para recordar) | Corte |

## Lo que se dice, palabras por segundo

No se oye el audio, pero los subtítulos muestran 3 a 4 palabras a la vez y se renuevan cada 1 a 1,5 s. En el gancho se cuentan 11 palabras en 3 s (unas 3,7 por segundo) y en la tesis 18 en unos 4,5 s (unas 4 por segundo); en el resto, el ritmo baja a 2 o 3 por segundo. **Todo el video: unas 170 a 190 palabras en 74,7 s, entre 2,3 y 2,5 palabras por segundo** (estimación, no un conteo exacto: faltan palabras de los corchetes).

## 5. El ritmo

- **Cambios visuales cada 10 s:** unos 4 a 5 cambios de escena (28 escenas en 74,7 s, unas 3,7 por 10 s) y, contando los pasos dentro de cada escena (una tarjeta que se llena, un check, un tachado, una línea que barre), unos 6 a 8.
- **Los más rápidos:** 0 a 10 s (hasta 8 por 10 s, el gancho cambia cada 1 s), 28 a 36 s (escenas de 2 a 3 s) y 48 a 59 s.
- **Dónde se queda quieto más de 2 s:** casi nunca. Lo más largo es la escena 18 (39 a 43, unos 4 s, pero la cookie se mueve), la 22 (50 a 54, 4 s, con tachado a los 52) y la lista de "qué ayuda" (61 a 68, 7 s). El presentador no se mueve nunca, salvo la boca.
- **La lista de "qué ayuda" (escena 25, 61 a 68 s):** las cuatro casillas aparecen **atenuadas desde el principio** bajo el rótulo "WHAT ACTUALLY HELPS". Cada una se ilumina y se marca con un check verde en el momento en que se dice, una cada 1,5 a 2 s. A los 63 s aparece además un chip rojo "unknown device - revoke" arriba a la derecha (para la segunda), y a los 65 s un icono rosa de extensión tachada junto a la tercera. A los 67 s las cuatro tienen su check.

## 6. El cierre

- **Cómo termina:** corte duro a la escena 26 (el escudo del gancho, otra vez, pero ahora "2FA sigue siendo útil"), luego una pantalla dividida (2FA protegido a la izquierda, tu sesión viva sin protección a la derecha) y la frase final gigante en cian: "A stolen session is an attack on what happens after". En el último medio segundo aparece un candado pequeño "still locked". El video termina en seco, sin despedida ni fade.
- **Tiene una estructura circular:** el escudo ámbar con el código de 6 casillas abre y reaparece a los 54 s y a los 69 s.
- **CTA:** **no hay CTA en el video** (ni hablado, ni texto en pantalla, ni "guarda"). El CTA de guardar está solo en el texto del post, según el encargo ("Keep 2FA on... protects the login, not what happens after it", más el pedido de guardar).

## 7. Para copiar

**Estructura que vale la pena llevarse**

1. **Gancho en 3 s sin saludo:** "Te voy a mostrar cómo [algo que parece imposible]". El objeto reconocible aparece en 1 s (escudo y código) y la palabra gigante a los 2 s.
2. **Tesis con la contradicción en la segunda frase (3 a 7 s):** "Y sí, funciona aunque ya tengas lo que se supone que te protege". Se muestra con dos tarjetas que se marcan.
3. **Un solo diagrama de dos cajas** que se reutiliza todo el video; solo cambia el objeto que viaja entre ellas (contraseña, cookie, cookie robada).
4. **La metáfora dura 8 s, no más, y se devuelve al diagrama** ("same object, new picture"), con el mismo objeto dibujado dos veces.
5. **Glow que cambia de color según el significado:** ámbar para lo protegido, verde para lo correcto, cian para el objeto, rojo para el atacante, violeta para la prueba. Una sola persona de fondo.
6. **Texto gigante apilado para la idea en una palabra** ("SESSION COOKIE", "SESSION HIJACKING", "WHAT HAPPENS AFTER"), tres veces por video, y rótulos mono pequeños debajo como segunda lectura.
7. **La lista que se tacha en vivo:** casillas atenuadas desde el inicio que se marcan al ritmo de la voz, con un chip o icono para la segunda y la tercera.
8. **Cierre circular:** el mismo objeto del gancho (escudo con código) vuelve al final con otro significado, y el video termina en una frase para recordar.
9. **La prueba "controlada":** dos ventanas lado a lado (A y B) para mostrar cómo se mueve la cookie, con una tabla de cookies.
10. **Duración de unos 75 s con 28 escenas** (una cada 2,7 s) y un ritmo de unas 2,4 palabras por segundo.

**Interfaces para recrear (genéricas, no de una marca real, no hay que pedir regla 6):** formulario de contraseña con barra de fuerza, tarjeta de 2FA, ventana de navegador, tabla de cookies de DevTools, formulario de login y tarjeta de datos mono. Ninguna usa un logo de producto real.

**Lo que no se copia (es de su marca)**

- Rick y su parodia, y su posición fija a la izquierda, de cuerpo entero.
- Los colores exactos (fondo azul marino con ámbar, cian, rosa-rojo y violeta), la caja de subtítulos con borde blanco y la tipografía de los títulos.
- El texto exacto: "I'm gonna show you...", "SESSION COOKIE", "WHAT HAPPENS AFTER" y la frase final.
- La falta de CTA en el video: nuestro video sí debe cerrar con CTA de guardar (y variado, `cierres.json`).

**Ojo para nuestra pieza**

- Aquí la metáfora (pulsera) es un tema que Jeremy ya eligió; el referente la usa 8 s de 75. Si en nuestro video dura más, hay que sostener el escenario del parque con más recursos, no solo tres iconos.
- El referente no muestra al atacante hasta los 26 s. Es el momento más "visual" y vale la pena adelantarlo.
