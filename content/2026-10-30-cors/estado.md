# Estado: 2026-10-30-cors

## Dónde quedó

- **Fase A (guion) aprobada el 2026-10-30.** Jeremy respondió "Aprobar así" en el chat. La hoja es `out/gate-a.md`, con `out/storyboard.png`, `out/storyboard.mp4` y el informe de Gemini en `out/video-critica-guion/informe.md`.
- **Fases B y C hechas el 2026-10-30:** voz, música, `video.tsx` final, render, inspector sin errores, crítico ciego y sus arreglos de imagen.
- **Puerta B aprobada el 2026-11-01.** Jeremy respondió en el chat: "apruebo, y no necesitamos la voz comercial todavía podemos usar la gratuita". Vale para este render.
- **El render aprobado:** sha256 `34f77dcc1a324f3385e540f0b387abbd743d6f60fb9db8661cabf6b1cdbc409f`.
- **Publicado el 2026-11-01** a pedido de Jeremy en @jacket.dev: https://www.instagram.com/reel/DfN4KgGys7a/
- **Paso siguiente:** métricas a las 48 horas y a los 7 días (`workflows/video.md`).
- **Duración real: 82,1 s** con `tempo` 1,25, dentro del rango de 67,5 a 82,5 s y cerca del tope. No se subió el `tempo`.

## El encargo

Jeremy pidió copiar la estructura de https://www.instagram.com/p/DfCgdy-i17v/ (@microappsdev, CORS como pregunta de entrevista, 74,5 s) con nuestra marca. Y agregó: "nuestro video debe tener una mejor calidad y creatividad de motion grafic y mostrar el avatar por partes, reestructura el guion de forma estrategica".

Se entendió "por partes" como "en momentos elegidos del video", igual que pidió en la pieza de agentes durables. Jeremy aprobó el guion con esa lectura.

## La reestructura, frente al referente

El referente es: error, base, origen, regla, banco, cabecera, trampa, Postman, arreglo y la respuesta a los 60 s, dicha en un plano fijo.

| Decisión | Por qué |
|---|---|
| El gancho contradice: "CORS no te está bloqueando" | El suyo no se lee hasta 5,7 s y solo repite el título. El nuestro saca hookscore 81 |
| Un medidor de 3 partes y una ficha vacía desde el gancho | Abre un bucle visual: se ve qué falta. El referente no tiene medidor |
| La trampa sube de los 42 s a la mitad, como primera parte | Es lo más sorprendente y paga el gancho pronto |
| Postman va justo después de la trampa, como su prueba | La idea queda demostrada en la misma escena |
| La repregunta del preflight es nuestra | El referente cubre la mitad. Además abre un segundo acto cuando ya se llenaron las 3 partes |
| La ficha se llena al final, con la voz | El suyo tiene 9,3 s quietos en la frase clave. La nuestra se puede capturar |
| CTA de enviar, que repite el gancho | El suyo es implícito. La pieza anterior pedía comentar |

## Mundo y dirección de arte

- **Aduana:** página arriba, caseta y barrera en el medio, servidor abajo. La cinta y la barrera vuelven en cada escena; solo cambia lo que pasa por ellas. El correo es un segundo carril de la misma aduana.
- **`ficha-tecnica`:** papel de seguridad verde con guilloché, para separarla del tablero oscuro del referente y del papel crema de la pieza anterior. Verde es permiso y rojo, bloqueo.
- **Movimientos propios de esta pieza:**
  - la consola da la vuelta en "al revés" y por detrás es la ficha;
  - el puerto gira como un rodillo;
  - sellos con tinta gastada que sacuden el cuadro;
  - la barrera cae con rebote y el letrero baja colgado;
  - un ticket se sella y vuela al medidor;
  - la cámara viaja con la caja, dentro de la escena.

## Avatar

Va en 5 de 8 escenas, cada vez con un papel distinto:
- `gancho`: el presentador;
- `trampa`: anuncia el giro;
- `correo`: es "tú", en la credencial "tu sesión";
- `repregunta`: el entrevistador, en una videollamada;
- `respuesta`: el cierre.

No aparece en `origen`, `viaje` ni `permiso`, donde manda el gráfico.

## Lo que cambiaron las fuentes (`facts.json`)

- **Correo en vez de banco:** MDN pone de ejemplo un webmail con sesión iniciada; ninguna fuente nombra un banco. Así tampoco hace falta un saldo inventado.
- **"Host" en vez de "dominio":** el RFC 6454 dice host, y el subdominio cuenta.
- **"Su app no es un navegador":** Postman Docs dice que su Browser Agent sí puede sufrir CORS.
- **No se dice "nunca en el frontend":** existen el proxy de desarrollo y `no-cors`. La voz dice "el permiso lo da el servidor", y el post explica el proxy.
- **La consola solo muestra el error con fuente** (código de Chromium). Se quitó `net::ERR_FAILED`, que no tiene fuente.
- **`fetch` con la URL completa de otro origen.** Con una ruta relativa sería el mismo origen.
- "La petición llega y se oculta la respuesta" y "si falla el preflight la real no sale" son lectura del algoritmo de Fetch, sin una frase literal en MDN.

## Lo que no entra, y por qué

- **La tarjeta de Stack Overflow:** el subagente no pudo leer stackoverflow.com, así que no hay cifras verificadas. El gancho nuevo no la necesita.
- **La sugerencia 3 de Gemini,** decir que el navegador manda las cookies solo: contradice `facts.json` (P6 y P7). `fetch` no manda cookies entre orígenes sin `credentials: "include"`, y en Chrome una cookie sin SameSite es Lax.
- **"Próximo video, otra pregunta":** promete una serie que Jeremy no pidió.

## Decisiones que quedaron firmes en la puerta A

Jeremy aprobó con "Aprobar así", después de ver estos tres puntos en el cierre de la fase:
- **8 escenas en vez de 5 a 7** (docs/direccion-reels.md, 2). El avatar y la cámara del motor van por escena. El referente tiene 20 escenas.
- **Sugerencias 1 y 2 de Gemini:** acortar la repregunta y el tramo de origen. No se aplican: la repregunta es lo que nos separa del referente y el origen es parte de la respuesta de entrevista.
- **Gancho:** se queda el 1 ("CORS no te está bloqueando", hookscore 81), aunque el 2 ("Ese error de CORS no lo pone tu servidor") saca 87. El 1 es el que da la vuelta a la tesis y lleva al sello PERMISO.

## Lo que se hizo en la fase B

- **Voz:** ElevenLabs F, `tempo` 1,25, 82,0 s de voz con pausas. La generó la clave de respaldo.
- **Música:** `audio/cama.mp3` (Lyria), al 0,06 por defecto. El video queda en −14,1 LUFS.
- **Movimiento:**
  - la caja se aplasta y se estira, y deja estela;
  - polvo y partículas en cada golpe de barrera;
  - desenfoque direccional y líneas de velocidad en los paneos.
- **Texto chico en `trampa`:** el letrero de la caseta sube a 36 px, "API · localhost:8080" a 25 px y la página dice "Tu página" en el plano alejado.
- **Credencial de `correo`:** ahora va fija a la pantalla y con el mismo resorte de la burbuja. Ya no se separan en el paneo.
- **Arreglos que no estaban en la lista:**
  - `viaje` y `permiso` paran en el plano entero de la aduana. Antes el código de la página cruzaba la barra de capítulos;
  - el letrero de la caseta dice "Navegador" grande y en rojo, en vez de un segundo rótulo encima de la cinta;
  - los sellos con `fill` tienen fondo sólido;
  - "Él sí respondió" va en una placa, con su sello 200 OK, como pedía el `see`;
  - cada ticket aterriza cuando se llena el medidor. Antes el medidor se llenaba 1,5 a 2 s antes;
  - la caja del correo lleva una bandeja, no una cookie: la cookie sugería que `fetch` la manda solo, y `facts.json` (P6 y P7) dice que no.
- **Cambios en pantalla donde la imagen quedaba quieta:**
  - gancho: "En la entrevista" y los tres números que se encienden;
  - `origen`: cada puerto se ilumina cuando se dice;
  - `correo`: "¿Por qué?", "A ti" con una flecha y "No a tu API" tachado, y la página entra con la palabra "cualquier";
  - `permiso`: la barrera se sacude en "barrera", y entran el sello de la caja y "Puede leer: localhost:3000";
  - `respuesta`: cada fila suma su detalle, y la ficha queda más completa para capturarla.

## El crítico

- **Una ronda, 4,30 de promedio** (`video-critica.md`), antes de los arreglos: Legibilidad 3, Gancho, Tesis y Cierre 5, y lo demás 4. No se repitió, porque ningún punto sacó menos de 3. Está bajo el umbral de la puerta B y la hoja lo dice.
- **Vio** cuadros cada 2 s y la transcripción, no el video ni el audio.
- **Se aplicó, solo imagen:**
  - los choques de texto de 0:28, 0:32, 0:42, 1:00 y 1:20;
  - el texto chico de la ficha;
  - la línea de Express, antes y más grande;
  - el error del gancho, que vuelve tachado en el cierre;
  - "Antes :3000" en la demo del puerto.
- **No se aplicó:** acortar el origen para adelantar "Primera parte". Cambia la voz y vuelve a la puerta A, que Jeremy aprobó sin ese cambio después de ver la misma sugerencia de Gemini.

## Lo que se probó y no funcionó

- **`video:prepare` tal cual:** falló con `quota_exceeded`, pero no faltaban créditos. La clave 1 tiene 14 y la de respaldo 7660. Ver "Para el motor". Se corrió con la clave de respaldo como principal, solo en ese proceso.
- **Polvo con círculos iguales y borde:** parecían burbujas. Se cambió por nubes sin borde y partículas que vuelan más lejos.
- **Rótulo "Pregunta de entrevista":** el avatar del gancho lo tapaba, incluso a 23 px. Se acortó a "En la entrevista".

## Avisos del inspector que quedan

Sin errores. Quedan 32 avisos, todos falsos:
- **Margen, a 19,5-20,5 s, 32,5 s y 35 s:** la cámara propia (`rigKeys`) está en movimiento y el inspector la lee como quieta.
- **Margen, a 10 s:** el pasaporte "Tu API" está entrando desde el costado.
- **Margen, a 69,5 s:** el sello "Ni sale" está cayendo, a una escala de 2,6, una décima antes del golpe.
- **Tamaño, a 62,5 s y desde 71,5 s:** "EN VIVO", la ficha final y la consola del cierre son de la capa fija a la pantalla. Se ven a su tamaño real, pero el inspector multiplica por el zoom.

## Pendiente

- **Crédito de la voz:** el centro de ayuda de ElevenLabs dice que al publicar contenido del plan gratuito hay que poner "elevenlabs.io" o "11.ai" en el título. El artículo tiene unos 907 días y no habla de Reels. Como un Reel no tiene título, va en `caption` ("Voz con IA: elevenlabs.io"), antes de los hashtags.
- **Licencia de la voz:** Jeremy decidió el 2026-11-01 usar la voz gratuita por ahora. El plan gratuito de ElevenLabs no da uso comercial (docs/direccion-reels.md, 3). Si más adelante cambia de plan:
  - Según guías de terceros, pagar después no cubre lo ya generado y hay que regenerarlo. Falta confirmarlo en los términos de ElevenLabs.
  - La caché de voces no distingue cuentas: para regenerar hay que borrar las 8 entradas de esta pieza en `.cache/media/speech`.
  - La voz nueva puede dar otro render y otro sha256, así que la puerta B se tendría que repetir.
- **Audio sin oír:** ni el agente ni el crítico lo pueden oír. Jeremy aprobó, pero no dijo si lo escuchó.
- **Duración:** 82,1 s está a 0,4 s del tope. Si se vuelve a generar la voz, hay que medir de nuevo.
- **Créditos de ElevenLabs al cerrar:** clave 1, 14 (se renueva el 24 de noviembre de 2026); clave 2, 6330 (el 29 de noviembre).
- El orden ciego de los ganchos (`out/video-critica-ganchos/`) no se corrió.
- **Logos:** Chrome, Firefox, Safari, Postman y Express salen de Simple Icons, con `<Logo>`.

## Para el motor

Van en su propia sesión:
- **Claves de ElevenLabs, error real:** `withFallback` (`packages/media/src/providers/elevenlabs.ts`) falla con dos voces a la vez. Las dos salen con la clave 1; la primera que falla pasa a la de respaldo, y la segunda, al fallar, ve que ya está en la última clave y lanza el error, aunque nunca probó la de respaldo. El mensaje dice "14 credits remaining" y parece que no hay créditos. Hay que reintentar si la clave con que salió el pedido ya no es la actual, y sumar una prueba con pedidos en paralelo.
- **Avatar:** hoy solo entra con un salto al empezar la escena, y la burbuja no puede cambiar de forma. Faltan una entrada desde un borde (asomarse), un `at` dentro de la escena y el busto con lugar por escena. Con eso, el avatar puede aparecer dentro de una frase.
- **Inspector:**
  - lee como cámara quieta la cámara propia de `video.tsx` (`rigKeys`), y da avisos de margen mientras se mueve;
  - multiplica por el zoom el texto de una capa fija a la pantalla (`Screen`), y da avisos de tamaño falsos en la ficha final, que se ve a su tamaño real;
  - mide píxeles, así que la cinta, el `drift` o la boca del avatar cuentan como cambio: en `correo` había 3 s en que no pasaba nada de lo que dice la voz, sin ningún aviso.
- **Caché de voces:** su clave no distingue el plan de la cuenta. Hace falta una forma de regenerar una pieza con la cuenta paga sin borrar archivos a mano.
- **Marco:** el contador "RESPUESTA ? ? ?" del encabezado queda chico en el celular, según el crítico.
- **Kit:** `Stamp`, `Digit`, `Dust`, las líneas de velocidad y el desenfoque del paneo, y la cámara dentro de la escena, pueden pasar a `@motor/video` si se repiten.
