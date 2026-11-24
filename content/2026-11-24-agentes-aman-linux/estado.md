# Estado: 2026-11-24-agentes-aman-linux

Réplica para @jacket.dev del Reel de @rick.theengineer "Why do AI agents love Linux?" (137,1 s). Jeremy pasó el video como archivo (`Downloads/reel (7).mp4`), no como URL: el análisis se hizo con whisper.cpp y cuadros de ffmpeg, sin el subagente `analista-referente` (ver `referente.md`). La cuadrícula del referente para `video:comparar` (`out/referente-cuadros.jpg`) se armó con ffmpeg desde el archivo.

## Decisiones de Jeremy (puerta A, 2026-11-24)

- **CTA:** "¿Adiós al mouse? (Recomendada)": "Comenta sí o no: ¿los agentes van a jubilar al mouse?". En pantalla, un prompt `¿Jubilamos al mouse? [s/n]` con el gesto de comentar.
- **Tema:** "Gancho en los agentes (Recomendada)": es el tercer Reel de Linux en 8 días, así que el gancho y la portada hablan de agentes ("Tu agente no usa el mouse") y Linux es la respuesta.
- **Agentes del gancho:** "Claude Code, Codex, Gemini CLI (Recomendada)", en lugar de Muse, Grok Bot y dots.
- **Simplificar:** "Mundo de 'Qué es Linux' (Recomendada)": se reusó el mundo verde de `2026-11-17-que-es-linux` (piso de grilla, `Term`, `Chip`, `GlowTitle`, `LogoTile`), con el horizonte bajo y la línea de HUD de este referente.

## Fase

**Terminado, esperando la puerta B ("¿lo publico?").** `out/video.mp4`, sha256 `a911dad72bdcea99645e5d658b57d966a589b03ccd7019aa4cb3e585143a2d2d`, sin errores del inspector. Ya se usaron los dos renders completos. Voz de Rada a `tempo` 1,36: 132,8 s más 1 s de `hold` en humanos y 2 s en el cierre (≈136 s, `target` 137).

Crítico ciego (`video-critica.md`): 3,60 de 5, sin error grave. Se arregló: tarjetas de /proc que se partían, la mira que tapaba el título del panel, el gancho dentro del centro 3:4 y el título que se va antes del sello, la tarjeta de falla desde el primer cuadro, y el post con 7 razones como el medidor. No se arregló: recortar las razones de 1:11 a 1:42 (la réplica dura lo que Rick) y el texto chico de las terminales (13 a 15 px de diseño, 26 a 30 px reales; en las tiras del crítico se ve a 8 px).

Avisos que quedan, defendidos:
- "9 palabras en pantalla en 129,5 s": es el CTA, el prompt "¿Jubilamos al mouse? [s/n]" y "Comenta sí o no", que se leen como una sola pregunta.
- `video:check`: "un efecto de humanos suena a 0,64 s del corte": la escena tiene 1 s de `hold` después de la voz.

## Paso siguiente

1. Puerta B: mostrarle a Jeremy el video, la hoja, el texto del post y lo que el crítico dejó sin arreglar, y preguntarle si se publica.
2. Con su sí: anotar `gateB { approved: true, date, video: "<sha256>" }` y correr `npm run video:publicar -- content/2026-11-24-agentes-aman-linux`. "Linux vs Windows" sigue sin publicar: conviene separarlos unos días.

## Decisiones propias

- El gancho va sobre el fondo magenta de Rick; desde el capítulo 01, el mundo verde.
- El modelo es el invasor de píxeles salmón de Rick (función: la IA); el rojo es error y el ámbar, peligro; el violeta de la cuenta marca lo clave.
- El medidor "Razones" va de 0/7 a 7/7: texto, terminal, tuberías, raíz, archivos, salida y aislar.
- La línea de HUD (`agent@linux:~$` y el capítulo) vive en la capa de cada escena (`parts.tsx → Layer`), no en el mundo: el escenario dibuja el mundo escalado y su texto quedaba bajo 12 px.
- Las terminales y el marcador de píxeles contra texto llevan "Ejemplo ilustrativo" (regla 3).

## Anclaje

- El guion visual no cambió después de emparejar (0 cambios). Biblioteca: 0 % del tiempo en pantalla (vacía).
- Se parece a `2026-11-17-que-es-linux` a propósito (decisión de Jeremy).

## Pendiente para el motor

- `video:render --escena` con la última escena falla: pide el cuadro 3984 de una composición de 3983 (rango de cuadros corrido en uno).

- `analista-referente` no sirve para un video en archivo: ya van tres réplicas analizadas a mano con whisper.cpp y ffmpeg. Valdría un comando `video:referente <archivo>` que deje la transcripción, las hojas y la cuadrícula.
