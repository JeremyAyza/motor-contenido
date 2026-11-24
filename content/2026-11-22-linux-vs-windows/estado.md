# Estado: 2026-11-22-linux-vs-windows

Réplica para @jacket.dev del Reel de @rick.theengineer "¿Linux es mejor que Windows?" (165,9 s). Jeremy pasó el video como archivo (`Downloads/reel (5).mp4`), no como URL: el análisis se hizo con whisper.cpp y cuadros de ffmpeg, sin el subagente `analista-referente` (ver `referente.md`). La cuadrícula del referente para `video:comparar` se armó con ffmpeg desde el archivo.

## Fase

**Terminado, sin publicar.** Puerta B (2026-11-24): Jeremy dijo "Todavía no"; `gateB` anotada sin aprobar, con el sha256 del video que vio. `out/video.mp4`, sha256 `16ec0b4f37911c68a1f10596a906198c2cb3ebc4d1e5832207ead259fc20f5cd`, sin errores del inspector. Ya se usaron los dos renders completos.

Avisos del inspector que quedan, defendidos:
- "12 palabras en pantalla en 126,5 s": la cita "Linux no tiene virus" está tachada y el sello FALSO la niega; se leen en orden cita, sello, frase.
- "Vacío abajo en 33,4 s y 74,3 s": son los últimos cuadros de compatibilidad y el sello "$0", que va solo a propósito.
- "meter sin mostrar": el medidor es el dial "¿QUIÉN DECIDE?" de `world.tsx` (ver abajo).

Voz generada (Rada, `tempo` 1,36): 167,5 s más 1,4 s de `hold` en el cierre, dentro del ±10 % del `target` 166.

## Paso siguiente

1. No publicar hasta que Jeremy lo pida.
2. Cuando lo pida: `gateB { approved: true }` con el mismo sha256 y `npm run video:publicar -- content/2026-11-22-linux-vs-windows`. Si pide cambios: por escena y con `video:render --forzar`.
3. Después: `video:cosechar` y las métricas a las 48 horas y a los 7 días.

## Crítico ciego (ronda 1, sobre el render 1)

3,50 de promedio, sin error grave y sin puntos bajo 3: no corresponde una segunda ronda (`video-critica.md`). Gancho, tesis, cierre y CTA y recurso visual sacaron 4; valor, retención, compartible, voz y guion, y legibilidad, 3.

Arreglado antes del render final:
- **Inspector del render 1** (17 errores): títulos y chips dentro del margen ("TODO FUNCIONA", "COMPATIBILIDAD", la fila de distros, "LINUX ADENTRO"), los escritorios y exploradores que se deslizan ya no muestran texto mientras cruzan el borde, "bueno", "vs" y "malo" del cierre a 22 px.
- **Encimados del crítico:** "Distribuciones" sale antes de que entre Ubuntu; "Lo común funciona", "Lo raro, no" y la foto del Wi-Fi salen antes de la terminal; el sello "A INVESTIGAR" baja junto a la barra de fricción y ya no tapa la terminal; el Administrador de tareas tiene letra más grande.
- **Contador:** el 71 % y los siete monitores llegan mientras la voz dice "siete de cada diez", no al final de la frase.
- **Cierre:** la tarjeta "bueno contra malo" es más grande y "Dos respuestas a dos preguntas distintas" va como titular; "Es esto." y el avatar entraban un segundo antes porque `useCue("Es")` encontraba el "es" de "no es bueno" (ahora la segunda aparición).
- **Vacío abajo** (avisos): compatibilidad, $0 y "Se sienten en casa" bajaron o crecieron.

Sin arreglar, a propósito:
- **Duración (2:48):** el crítico la siente larga, pero una réplica dura lo que su referente (166 s).
- **Frases largas que suenan leídas** (0:33, 0:48, 2:01): cambiarlas obliga a rehacer la voz y los tiempos; siguen la estructura del referente.

## Decisiones de Jeremy (puerta A, 2026-11-22)

- Pedido: "Quiero copiar ese video con nuestro branding y avatar. Espero poder alcanzar el mismo arte visual sin complicarnos tantos. Espero no perder la claridad." Pidió un CTA que genere debate o polémica.
- CTA: "Elige bando (Recomendado)": "¿Y tú: que el sistema decida o decidir tú? Comenta WINDOWS o LINUX."
- Imágenes: "Fotos con agy (Recomendado)": 5 fotos con agy (`img/generated.json`); interfaces y escritorios de las distros recreados en código.
- Avatar: "Como Rick (Recomendado)": en el gancho, los capítulos, las frases grandes y el cierre; fuera en interfaces y listas.
- Interfaces en español: "Español (Recomendado)".

## Decisiones del agente

- `art.direction` captura-anotada (réplica sin baraja), paleta del referente (azul noche), acento violeta de la cuenta para el punto del dial, "FALSO" y el CTA. Azul = Windows, naranja = Linux, verde = funciona, ámbar = fricción, como en el referente.
- Subtítulos `pill` (la palabra dicha en tinta y el resto apagado, como los del referente).
- El medidor (`video.json → meter`, "Quién decide") es el dial "¿QUIÉN DECIDE?" dibujado en `world.tsx`, no el `meter` del kit: el del kit muestra un número junto a la pestaña y duplicaría el dial. Si `video:render` avisa "meter sin mostrar", es por esto.
- Logos nuevos en el catálogo: `tux` y `adobe` (selfh.st/icons, CC BY 4.0). Windows ya estaba.
- Datos en pantalla: solo los del referente (71 % de escritorios con Windows; 148 → 31 procesos, rotulado "Ejemplo ilustrativo"; la tabla de Adobe CC, Office, Final Cut y DaVinci por sistema). Las terminales de ejemplo van rotuladas.
- Tema parecido a piezas recientes: `video:script` avisa por Go vs Rust (hoy), Mac para programar (16 nov) y AMD vs Intel (9 nov), y "Qué es Linux" (publicado el 17 nov) es vecino. Jeremy pidió esta réplica; conviene espaciar la publicación de Go vs Rust.

## Lo que no funcionó

- La primera tanda de fotos se agregó después de `video:prepare`, y el render no las encontraba: `video:prepare` copia `img/` a `out/video/piece/`, así que hay que correrlo de nuevo al sumar imágenes (la voz queda en caché).
- `avatar: { size }` sin `scenes: []` muestra el avatar en todas las escenas, también en las que no tienen su propio `avatar`.

## Anclaje

- Biblioteca vacía: las 15 escenas son nuevas; el guion visual no cambió después de emparejar.

## Pendiente para el motor

- `video:prepare` podría avisar si `img/` tiene archivos que no están en `out/video/piece/img`, o `video:frames` copiarlos solo.
- `video:render --escena` falla si el tramo incluye la última escena: pide los cuadros 478-5067 cuando la composición va de 0 a 5066 (se pasa un cuadro).
- `useCue("Es")` no distingue mayúsculas: una palabra corta que se repite en la escena necesita `nth`, y no hay aviso.
