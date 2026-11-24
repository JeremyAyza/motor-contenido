# Estado: 2026-11-24-disenar-spotify

Réplica para @jacket.dev del Reel de @rick.theengineer "Let's design Spotify" (173,6 s). Jeremy pasó el video como archivo (`Downloads/reel (4).mp4`), no como URL: el análisis se hizo con whisper.cpp y cuadros de ffmpeg, sin el subagente `analista-referente` (ver `referente.md`). La cuadrícula del referente para `video:comparar` (`out/referente-cuadros.jpg`) se armó con ffmpeg desde el archivo.

## Fase

**Terminado, sin publicar.** Puerta B (2026-11-24): Jeremy dijo "no publicar, commit y push"; `gateB` anotada con `approved: false` y el sha256 del video. Commiteado y subido sin `out/`: el video y los cuadros del referente quedan solo en esta máquina. `out/video.mp4`, 174,9 s (`target` 174), sha256 `6852c4761b2feeb30cc74d13711390b4c64fbb23181314ffdefbb25b38626306`, sin errores ni avisos del inspector. Voz de Rada a `tempo` 1,26 (174,3 s) más 0,6 s de `hold` en medianoche y 2 s en el cierre. `out/renders.json` cuenta 4 renders completos: los 2 primeros fallaron por el puerto (abajo), el 3.º fue para el crítico y el 4.º es el final, los dos con `--forzar` autorizado por Jeremy.

## Crítico ciego (ronda 1, sobre el render 3)

3,65 de promedio, sin error grave y sin puntos bajo 3: no corresponde una segunda ronda (`video-critica.md`). Gancho, retención y legibilidad sacaron 3; lo demás, 4.

Arreglado antes del render final:
- **Texto que iba detrás de la voz o se veía cortado:** los títulos entran 0,2 s antes de su palabra, se escriben en un tercio del tiempo y el saliente se va antes de que entre el siguiente.
- **Rótulos chicos:** los rótulos mono bajo los objetos pasan de 12 a 14 px.
- **Inspector del render 3:** el riel va de x 74 a 466 (ALMACÉN y ESTADO se salían del margen) y "RECOMENDACIONES" grande baja a 40 px.
- **El play** ya no abre con la tarjeta del back end vacía: abre con el botón y la tarjeta entra después de "tocas".

Sin arreglar, a propósito:
- **Gancho con el giro "para ti es simple" o la tesis del MP3:** en una réplica manda el gancho del referente.
- **Acortar a 2:15-2:30 y el repaso final:** una réplica sigue la estructura y dura lo que su referente.
- **Titular que repite el subtítulo:** es el formato de Rick.

**El bloqueo (2026-11-24, resuelto):** los dos renders completos fallaron sin dejar video. El servidor Next de `Documents/temporales/catalogo-next` escucha en el puerto 3000 (IPv6, `::`); Remotion levanta su servidor en el mismo puerto por IPv4 y el navegador del render termina pidiéndole los archivos a Next: el primer intento cayó en el cuadro 3322 de 5228 (`avatar/v1/mouth-open.png`, 404) y el segundo no pudo ni leer la composición. Aun así, `out/renders.json` cuenta 2 de 2 y el próximo render pide `--forzar`. Los cuadros sueltos (`video:frames`, `video:comparar`) sí andan porque `remotion still` no chocó.

**Desbloqueo (2026-11-24):** a la pregunta "¿Cierras catalogo-next y me autorizas a renderizar con --forzar?", Jeremy respondió "Sí, ya lo cerré". Los renders siguientes van con `--forzar`.

## Paso siguiente

1. No publicar hasta que Jeremy lo pida.
2. Cuando lo pida: anotar `gateB { approved: true, date, video: "6852c476…" }` y correr `npm run video:publicar -- content/2026-11-24-disenar-spotify`. Si pide cambios: por escena y con `video:render --forzar`.
3. Después: `npm run video:cosechar` y las métricas a las 48 horas y a los 7 días.
4. Pendiente para el motor (en su propia sesión): que `video:render` cuente un render solo si deja `out/video.mp4`, y que Remotion use un puerto libre de verdad (o `127.0.0.1` explícito) cuando el 3000 está ocupado por IPv6.

El aviso de `video:check` ("central" a 0,66 s del corte en medianoche) se resolvió con 0,6 s de `hold`.

## Decisiones de Jeremy (puerta A, 2026-11-24)

- Pedido: "Quiero copiar ese video con nuestro branding y avatar. Espero poder alcanzar el mismo arte visual sin complicarnos tantos. Espero no perder la claridad. Dame una sugerencia de CTA para disparar más el reel: debe generar debate, polémica o más comentarios." Si hace falta una imagen con IA, con su suscripción de Antigravity (`agy -p ...`).
- **Ejemplos:** "Al duki u otros referentes del trapa argetino": la búsqueda es "Goteo" de Duki y el estreno de medianoche es una sesión nueva de Bizarrap (hipotético, con "imagina").
- **Portadas:** "Generadas con IA (Recomendado)": 14 portadas inventadas con agy, sin artistas reales ni texto; la de "Goteo" lleva "Portada ilustrativa".
- **CTA:** "¿Un solo dev podría?": en la voz, "¿Un solo desarrollador podría diseñar Spotify? Comenta sí o no, y por qué."; en pantalla, una tarjeta violeta con SÍ, NO y el gesto de comentar.

## Decisiones de esta pieza

- **Estructura de Rick, en 12 escenas y en su orden:** gancho, almacenamiento, play, CDN, buffer, búsqueda, recomendaciones, lotes, medianoche, estado, mapa y cierre.
- **El mundo** (`world.tsx`): consola casi negra con un brillo verde arriba, como Rick. Todo lo que explica va en la capa de cada escena (`parts.tsx`): el HUD con la sección, el paso "NN / 12" y el riel de 6 sistemas (ALMACÉN, CDN, ÍNDICE, RECOS, LOTES, ESTADO) que se enciende con la voz; títulos blancos en mayúsculas a la derecha del avatar; rótulos mono diminutos bajo cada objeto; subtítulos en píldora.
- **Color:** verde Spotify para lo que funciona, como Rick; rojo para la conexión que falla y el camino al origen tachado; el violeta de @jacket.dev para el medidor y la tarjeta del CTA.
- **Avatar** (busto, abajo a la izquierda) en todas las escenas, en el lugar de Rick.
- **Medidor:** "Sistemas", 6 casillas, que se llenan con el riel.
- **Datos:** solo los del Reel de Rick (24, 96, 160 y 320 kbps; OGG Vorbis y HE-AAC v2; 5 segundos; segundo 10 y 20 o 30 ya descargados). El contador de la multitud lleva "Ejemplo ilustrativo".
- **Logo:** Spotify de Simple Icons.

## Anclaje

- Cambios del guion visual después de emparejar: 0.
- Biblioteca vacía: todas las escenas son nuevas; 0 % del tiempo en pantalla sale de la biblioteca.
- Comparación con el referente (`out/comparar.png`): coinciden el fondo casi negro con brillo verde, el HUD con sección, paso y riel de sistemas, el escenario arriba con un objeto por vez y rótulos mono, los títulos blancos junto al presentador y los subtítulos en píldora. Diferencias aceptadas: el avatar es un busto abajo a la izquierda y Rick está de cuerpo entero a media altura; nuestros títulos son más gruesos y grandes; portadas generadas en vez de reales.
