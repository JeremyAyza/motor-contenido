# Estado: 2026-11-16-mac-para-programar

Réplica para @jacket.dev del Reel de @rick.theengineer sobre por qué tantos programadores prefieren Mac (158,8 s). Jeremy pasó el video como archivo (`Downloads/reel.mp4`), no como URL: el análisis se hizo con whisper.cpp y cuadros de ffmpeg, sin el subagente `analista-referente` (ver `referente.md`).

## Fase

**Aprobado, sin publicar.** `out/video.mp4`, 158,1 s, sha256 `376af8fd08dc5fdefc158421d4061248c37043b66124c82d28f3ba43c0ab9261`. Puerta B (2026-11-16): "no lo publiques, apruebo". `gateB` anotada con ese sha256.

Aviso del inspector que queda, defendido: "7 palabras en pantalla en 0,0 s". Son el gancho (6 palabras) y el nombre de la ficha de producto, que es la etiqueta de su logo.

## Paso siguiente

1. No publicar hasta que Jeremy lo pida. Cuando lo pida: `npm run video:publicar -- content/2026-11-16-mac-para-programar` (la puerta B ya tiene el sha256).
2. Si pide cambios: por escena y con `video:render --forzar`.
3. `npm run video:cosechar -- content/2026-11-16-mac-para-programar` y, cuando se publique, las métricas a las 48 horas y a los 7 días.

## Crítico ciego (ronda 1, sobre el render 1)

3,50 de promedio, sin error grave (`video-critica.md`). Arreglado antes del render final:
- **Gancho:** el cuadro 1 ya trae las dos fichas, y el título entra en el centro 3:4 de la grilla.
- **Cierre:** "3 de 3" pasó a "Para muchos: 3 de 3", para no contradecir "no la hace mejor para todos"; y la laptop del CTA muestra Mac y Windows cuando la voz los nombra, de vuelta al gancho.
- **Escenas que abrían con el escritorio vacío** (chip, Xcode, experiencia, gusto, coherencia, contras, modelo, cierre): la primera ventana entra al empezar la escena.
- **Inspector del render 1:** el sello "Sin Linux aparte" salía del margen y la laptop del CTA tenía un "~ %" de 14 px; los avisos de "Screenshots" y del ícono de Terminal del Dock, también.

Sin arreglar, a propósito: el largo (dura lo que Rick), el desvío de WSL, el resumen del modelo mental y las escenas de experiencia y coherencia son la estructura del referente (en una copia no se discute el guion); los dos pedidos del CTA son decisión de Jeremy.

## Decisiones de Jeremy (puerta A, 2026-11-16)

- Pedido: "Quiero copiar ese video con nuestro branding y avatar. Lo unico que no me gustó es esas barras de vida estilo juegos de pelea, despues de ahi puedes parafrasear el guion. el CTA debe ser una recomendacion a guardar o compartir el video por si estas a punto de comprarte una computadora/laptop".
- **Marco de pelea:** "Quitar todo lo de pelea". Sin barras, VS, P1/P2, rounds, "New challenger", "Move list" ni "No knockout".
- **Versiones:** "Copiar las de Rick tal cual" (Apple M4 Pro, macOS Sequoia 15.4, 24 GB, 512 GB, MacBook Pro de 14 pulgadas de noviembre de 2024).
- **CTA:** "Las dos en una frase": guardar o enviar, para quien está por comprarse una laptop. `video:script` avisa de dos pedidos; se mantiene porque lo eligió Jeremy.
- **Ángulo:** "Igual que Rick (Recomendado)".
- **Voz:** las dos claves de ElevenLabs de `.env` estaban sin créditos (la principal en cero, la de respaldo con 104). Jeremy pasó dos claves nuevas en el chat; se usaron como variables de entorno solo para `video:prepare`, sin escribirlas en `.env` ni en ningún archivo. La voz quedó en caché: si el texto no cambia, no hace falta volver a pedirla. Si cambia, hay que pedirle a Jeremy que las ponga en `.env`.

## Decisiones de esta pieza

- **Estructura de Rick, en 16 escenas y en su orden:** gancho, Unix, terminal, WSL, chip, vatio, Xcode, experiencia, gusto, coherencia, contras, Docker, Windows, Linux, modelo mental y cierre.
- **Aspecto (réplica parecida):** de Rick, el escritorio macOS oscuro con ondas, la barra de menú con la app al frente, las carpetas a la izquierda, el Dock abajo, las ventanas a la derecha y el presentador a la izquierda todo el video. De @jacket.dev: el acento `#8B85FF` donde Rick usa el azul de macOS, el marco, la firma, el avatar en busto y el medidor "Razones Mac" (5 casillas: Unix, hardware, batería, ecosistema, experiencia).
- **El gancho sin pelea:** dos fichas de producto, Mac y Windows, lado a lado, con el rótulo "¿Por qué los devs prefieren Mac?"; después una mesa de startup con MacBooks, un signo de pregunta y "¿o la marca?".
- **Windows y Linux:** fichas de fortalezas en lugar del "Move list" y el "New challenger".
- **Cierre:** tres tarjetas iguales ("Gran software"), "El que encaja" con tres checks, "3 de 3" con la manzana, y la tarjeta del CTA con los gestos de guardar y enviar. Despedida: respuesta al gancho.
- **Voz:** `tempo` 1,33; 158,1 s de voz contra 158,8 del original.
- **Datos:** solo los del Reel de Rick. Las pantallas llevan "Ejemplo ilustrativo" bajo la barra de menú desde la escena 2. Logos nuevos en el catálogo: `windows` y `visual-studio-code` (selfh.st/icons, CC BY 4.0).
- **Dirección:** `captura-anotada`, sin baraja (réplica parecida). Subtítulos `marker`, como las cajas de Rick.
- **Comparación con el referente** (`out/comparar.png`): coinciden el fondo, las zonas, el escritorio, la densidad y el presentador a la izquierda. Diferencias aceptadas: el busto en vez del cuerpo entero, los subtítulos más abajo (marco de la cuenta), las ventanas algo más chicas porque el marco ocupa arriba y abajo, y nada del marco de pelea.

## Anclaje

- Cambios del guion visual después de emparejar: 0.
- Biblioteca vacía: todas las escenas son nuevas; 0 % del tiempo en pantalla sale de la biblioteca.
