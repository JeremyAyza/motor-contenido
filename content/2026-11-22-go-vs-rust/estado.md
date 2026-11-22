# Estado: 2026-11-22-go-vs-rust

Réplica para @jacket.dev del Reel de @rick.theengineer que compara Go y Rust (137,0 s). Jeremy pasó el video como archivo (`Downloads/reel (6).mp4`), no como URL: el análisis se hizo con whisper.cpp y cuadros de ffmpeg, sin el subagente `analista-referente` (ver `referente.md`).

## Fase

**Terminado, sin publicar.** Puerta B (2026-11-22): Jeremy dijo "todavía no, commit y guarda"; `gateB` anotada con `approved: false`. `out/video.mp4`, 2:15 (135,1 s, un 1,4 % bajo el `target`), con la voz de Rada a `tempo` 1,26. sha256 `9e16511b8b569c11867c3d48177bcd8e21692a3188d9fe4841de11a990999865`. Ya se usaron los dos renders completos.

Aviso del inspector que queda, defendido:
- "Imagen quieta 3,0 s desde 5,0 s" (gancho): en ese tramo se dibujan las líneas punteadas de cada empresa a su lenguaje (5,1 a 5,7 s) y laten los dos logos en "lenguajes" (7,8 s); son trazos finos que el inspector no cuenta como cambio.

## Paso siguiente

1. No publicar hasta que Jeremy lo pida.
2. Cuando lo pida: anotar `gateB { approved: true, date, video: "9e16511b…" }` con el sha256 de `out/video.sha256` y correr `npm run video:publicar -- content/2026-11-22-go-vs-rust`.
3. Si pide cambios: por escena y con `video:render --forzar`.
4. Después: `npm run video:cosechar -- content/2026-11-22-go-vs-rust` y las métricas a las 48 horas y a los 7 días.
5. Commiteado (2026-11-22), sin `out/`: el video y los cuadros del referente quedan solo en esta máquina.

## Crítico ciego (ronda 1, sobre el render 1)

3,35 de promedio, sin error grave y sin puntos bajo 3, así que no corresponde una segunda ronda (`video-critica.md`). Valor, compartible y recurso visual sacaron 4; lo demás, 3.

Arreglado antes del render final:
- **Portada y cuadro 1:** los logos de Go y Rust se ven desde el cuadro 1, con "Go vs Rust" dentro del centro 3:4, y la portada pasa al mito ("Rust no siempre es más rápido", con las barras), que además empuja el debate del CTA.
- **Legibilidad:** "HILOS" sube y ya no tapa "1 hilo"; la caja "pedido #42" baja junto al dueño y su rótulo ya no se encima; el sello "RECHAZADO" sube y deja ver "orders.rs"; el código de la terminal pasa de 13 a 14 px; "0,03 %" dice "más rápida la petición completa"; el hueco de arriba en ownership se llena con "8,4 MB, memoria plana" mientras se libera la memoria.
- **Inspector del render 1:** las tiras de código de la cinta y las peticiones de hilos quedan dentro del margen; "orders.rs" aparece cuando la hoja ya entró; "más que cambiar de lenguaje" se corre a la izquierda; el gancho suma las líneas de cada empresa a su lenguaje, el pulso de los logos y "alto rendimiento" para que no quede quieto.

Sin arreglar, a propósito:
- **Abrir con el mito o acortar la apertura a 5 s:** en una réplica manda el gancho del referente.
- **Quitar las prioridades y achicar Python y JavaScript para bajar a 1:45:** una réplica sigue la estructura y dura lo que su referente.

## Decisiones de Jeremy (puerta A, 2026-11-22)

- Pedido: "Quiero copiar ese video con nuestro branding y avatar. Espero poder alcanzar el mismo arte visual sin complicarnos tantos. Espero no perder la claridad. Dame una sugerencia de CTA para disparar más el reel: debe generar debate, polémica o más comentarios." Si hace falta una imagen con IA, con su suscripción de Antigravity (`agy -p ...`); no hizo falta.
- **CTA:** "Team Go o Team Rust (Recommended)": en la voz, "Comenta tu bando y defiéndelo en una línea: ¿Team Go o Team Rust?"; en el post, "Comenta GO o RUST y defiende tu bando en una línea" (así lo reconoce la revisión del post como pedido de comentar una palabra).
- **Detalle visual:** "Mismo mundo, menos piezas (Recommended)".
- **Cifras de benchmark:** "Se quedan, rotuladas (Recommended)": cada gráfico lleva "Medición de ejemplo".
- **Postura:** "Neutral, el CTA provoca (Recommended)".

## Decisiones de esta pieza

- **Estructura de Rick, en 13 escenas y en su orden:** gancho, Go compilado, hilos, goroutines, recolector, Rust compilado, ownership, el precio, prioridades, Python y JavaScript, el mito, la elección y el cierre.
- **El mundo** (`world.tsx`): pizarra de carbón con grano fino; una franja de escenario arriba (92 a 500) que toma el color del capítulo (turquesa Go, óxido Rust, pizarra el resto); en el gancho, las prioridades y la elección se parte en dos carriles a pantalla completa; en el precio, pantalla completa oscura. La terminal fija (204, 518, 300×280) a la derecha del avatar, con su título por escena; su contenido lo dibuja cada escena (`PanelBody`).
- **Cámara a escala 1:** el escenario encajaba el mundo entero entre la pestaña y los subtítulos (escala 0,79) y la terminal no calzaba con su contenido; el gancho fija `camera: { focus: { x: 270, y: 427 }, zoom: 1 }` y las demás lo conservan.
- **Todo dibujado en código:** sin imágenes generadas. Logos de Simple Icons (Go, Rust, Docker, Kubernetes, Cloudflare, Discord, Google, Python, JavaScript); el engranaje de Rust va en un disco naranja, como lo muestra Rick, porque su ícono es negro.
- **Color:** de Rick, turquesa para Go, óxido para Rust, rojo para errores y el rechazo, amarillo para el recolector y la memoria extra. De @jacket.dev, el violeta: la base de datos, el caché, el gesto de comentar y los subtítulos.
- **Avatar** (tamaño 200) en el lugar de Rick, en las escenas con terminal: de Go compilado a ownership, Python y JavaScript, el mito y el cierre. Sin avatar en las de pantalla completa (gancho, precio, prioridades, elección), como Rick.
- **Medidor:** "Criterios", 3 casillas: empieza en 1 (velocidad) y se completa en el cierre con confiabilidad y mantenimiento.
- **Voz:** Rada a `tempo` 1,26: 135,1 s de voz, más 0,4 s de `hold` en el precio y 1,4 s en el cierre.
- **Datos:** solo los del Reel de Rick (Docker y Kubernetes en Go; Pingora de Cloudflare y Read States de Discord en Rust; 8 MB por hilo; 10.000 goroutines en 20,6 MB con 10 hilos; 3.611 barridos y 33,2 MB del proceso Go; Rust 8,4 MB plano; 13,5 / 13,9 / 41,5 / 81 ms; 1,7x y 0,03 %; 20 ms de base, 17 µs y 10,2 µs; caché de 1 ms, 20 veces). Las pantallas de código llevan "Ejemplo ilustrativo"; las cifras, "Medición de ejemplo".
- **Comparación con el referente** (`out/comparar.png`, sobre la voz): coinciden el fondo carbón, la franja de color por capítulo, la pantalla partida del gancho con sus fichas de empresas y el sello, la cinta con `go build` y `rustc`, la terminal fija a la derecha del presentador, los casilleros de 8 MB, el enjambre de goroutines, el depósito con barrenderos, el dueño con su caja, la aduana, las prioridades en dos carriles, las barras, el camino a la base de datos y los tres medidores. Diferencias aceptadas: el avatar es un busto y Rick está de cuerpo entero; cada metáfora tiene menos piezas y rótulos (puerta A); la textura de pizarra es más suave.
- **Portada:** `cover` en el mito a los 3,2 s, por la crítica.
- **Aviso de `video:script` que queda:** el tema se parece a AMD contra Intel (2026-11-09) porque los dos son "A contra B"; los temas son distintos.

## Anclaje

- Cambios del guion visual después de emparejar: 0.
- Biblioteca vacía: todas las escenas son nuevas; 0 % del tiempo en pantalla sale de la biblioteca.
