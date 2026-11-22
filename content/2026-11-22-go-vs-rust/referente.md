# Referente: Go vs Rust, de @rick.theengineer

Análisis hecho sobre el archivo que pasó Jeremy (`Downloads/reel (6).mp4`, copiado en `out/referente.mp4`), sin el reproductor incrustado: la voz transcrita con whisper.cpp (`out/referente-transcripcion.csv`), tres hojas de cuadros cada 3 s (`out/referente-hoja1.jpg` a `hoja3.jpg`) y el gancho cada 0,5 s (`out/referente-gancho.jpg`). Todo queda en `out/`, que no entra en git: es de otra cuenta. La cuenta se deduce del presentador (Rick, el mismo de las réplicas anteriores).

## Ficha

- **Duración:** 137,0 s, 720×1280, 30 fps. `target` 137 (±10 %: 123 a 151 s). Formato `largo`.
- **Idioma:** inglés, unas 390 palabras (2,8 por segundo). En español saldrán más: hará falta subir el `tempo` (hasta 1,4) o recortar palabras sin perder pasos.
- **Tesis:** Go y Rust sostienen la infraestructura moderna por razones distintas. Go apuesta por la simplicidad (goroutines y un recolector de basura); Rust, por el control (ownership y un compilador que revisa antes de correr). Rust no es automáticamente más rápido: si el servidor espera a la base de datos, el cuello de botella está en otro lado. Rápido no es solo velocidad: también confiabilidad y mantenimiento.

## El gancho, 0 a 4,8 s

- **Cuadro 1:** pantalla partida en dos franjas: arriba turquesa oscuro con el logo de Go entrando con estela; abajo marrón óxido con un círculo punteado rojo donde va a caer el engranaje de Rust.
- **Voz:** "Go versus Rust, Docker, Kubernetes, Cloudflare, Discord."
- **Pantalla:** los logos se achican hacia la esquina de su franja y dejan entrar fichas cuadradas con marco dorado: Docker y Kubernetes en Go; Cloudflare y Discord en Rust (con rótulo chico: "Pingora proxy: Rust", "Read States: Rust"). A los 9 s, un sello "WHY?" blanco sobre negro, ladeado, en la línea que divide las franjas.
- **Subtítulos:** caja oscura chica, palabra activa en blanco y el resto en gris.

## El mundo y el aspecto (lienzo 540×960)

- **Fondo:** gris carbón (#2A2D31 aprox.) con textura sutil de pizarra o concreto. Cada capítulo tiñe la franja de arriba: turquesa (#2E5E66) en Go, marrón óxido (#5A3A2E) en Rust, carbón neutro en el resto. Una línea fina del color del capítulo marca el borde de la franja.
- **Zonas:**
  - **Escenario (franja de arriba):** de 20 a 420, el 42 % del cuadro. Ahí viven las metáforas: cinta transportadora (`go build` / `rustc` como estaciones), hojas de peticiones volando, bloques de 8 MB (hilos), partículas (goroutines), un depósito de cajas (el heap) con barrenderos, el dueño con su caja, la barrera del compilador, barras de benchmark, el camino servidor → base de datos y los tres medidores del cierre.
  - **Presentador:** Rick de cuerpo entero, abajo a la izquierda, de 420 a 700, unos 90 px de ancho. Está casi todo el video; sale solo en las escenas de pantalla completa (la barrera del compilador, las prioridades, los benchmarks).
  - **Panel de terminal:** a la derecha del presentador, de 110 a 490 en x y de 430 a 680 en y. Fondo casi negro (#16181B), esquinas de 6 px, encabezado en gris chico ("go: the language", "spawn.go", "orders.rs", "the choice") y una etiqueta a la derecha ("real output", "measured on this Mac"). Adentro: código con resaltado, contadores grandes (8 MB, 16 MB, 6 requests, 1,488 goroutines) o una gráfica de línea del heap.
  - **Subtítulos:** caja centrada en y 750, de 3 a 4 palabras, con la palabra activa en blanco.
  - **Debajo de los subtítulos:** vacío (de 790 a 960).
- **Qué persiste:** las dos franjas del gancho vuelven en "prioridades" y en "cuál eliges"; la cinta transportadora es la misma para Go y para Rust; el panel de terminal no se va, cambia de contenido; los logos de Docker, Kubernetes, Cloudflare y Discord reaparecen en el cierre de la comparación.
- **Títulos:** palabra clave sola, grande (unos 44 px), en display condensado con contorno y sombra, del color del capítulo: "THREADS", "GOROUTINES", "COMPILED", "OWNERSHIP", "RUST IS NOT AUTOMATICALLY FASTER". Alineados a la izquierda o centrados en la franja. Pocos.
- **Texto de interfaz:** rótulos de 9 a 12 px en monoespaciada, muchos por cuadro (4 a 8), pero siempre secundarios a un número o una palabra grande.
- **Colores con función:** Go = turquesa (#29BEB0 / #00ADD8); Rust = naranja óxido (#E2572B); rojo de error (#E0393E) para "REFUSED" y los E0382; violeta (#7B5CD6) para base de datos y caché; amarillo de JS y azul de Python solo en sus logos; blanco para el número clave.
- **Materiales y acabado:** plano, ilustrado a mano en 2D, con un poco de grano; fichas con marco dorado; cajas de madera para los datos; bordes finos, sombras cortas. Nada en 3D.
- **Cuadros del aspecto:** 0,5 · 9 · 15 · 30 · 38 · 50 · 66 · 72 · 85 · 100 · 117 · 133.

## Escena por escena

| s | Capítulo | Lo que se dice (resumido) | Lo que se ve | Recurso |
|---|---|---|---|---|
| 0 a 12 | Gancho | Go vs Rust; Docker, Kubernetes, Cloudflare, Discord confían en ellos; ¿por qué son tan populares para sistemas de alto rendimiento? | Pantalla partida, logos y fichas; sello "WHY?" | Logos |
| 12 a 21 | Go: origen | Empecemos con Go; nació en Google para simplificar el software grande; es compilado: tu código pasa a instrucciones de máquina antes de correr | Cinta con la estación `go build`; panel "developed at Google"; "COMPILED" y un `add.go` con su ensamblador | Diagrama, interfaz |
| 21 a 33 | Go: hilos | Su fuerte es hacer muchas cosas a la vez; normalmente se usan hilos, trabajadores que maneja el sistema operativo; cada uno es caro, contratar uno por petición no escala | Hojas de peticiones volando ("6 requests at the same time"); "THREADS"; bloques de 8 MB; contador 8 MB → 16 MB | Objeto, dato |
| 33 a 45 | Go: goroutines | Go usa goroutines: tareas diminutas; corren miles, repartidas en un equipo chico de trabajadores reales; por eso sirve para servidores, APIs y sistemas distribuidos | "GOROUTINES"; panel `go func()`; cuadrado de partículas que crece a 1,488 y 10,000 (20,6 MB); 10 trabajadores reales debajo; tres etiquetas de uso | Dato, diagrama |
| 45 a 60 | Go: recolector | El programa deja memoria que ya no se usa; el recolector de basura la barre cada tanto; facilita la vida, pero usa memoria extra y causa pausas cortas | Depósito de cajas (heap) con barrenderos; "order #42: not needed"; gráfica en sierra del heap; franja amarilla "extra memory"; 3,611 barridos | Metáfora, gráfica |
| 60 a 68 | Rust: origen | Rust también compila a código de máquina, pero no necesita barrenderos: usa ownership | Franja óxido; estación `rustc` en la misma cinta; panel con el ensamblador de las dos ("both are machine code"); "OWNERSHIP" | Diagrama, interfaz |
| 68 a 81 | Rust: ownership | Cada pedazo de memoria tiene un dueño; cuando termina, se libera al instante; otros la piden prestada con reglas estrictas, y el compilador las revisa antes de correr | Dueño con su caja "order #42"; líneas a los que la piden prestada; panel "many readers, or one writer, never both at once"; heap plano "Rust: 8.4 MB, flat" | Metáfora, interfaz |
| 81 a 87 | El precio | Hay un costo: esas reglas hacen a Rust más difícil de aprender | Barrera roja y blanca "rustc: the gate"; sello "REFUSED"; notas "attempt 3, E0106"; errores E0382 en el panel | Interfaz, sello |
| 87 a 93 | Prioridades | Go prioriza simplicidad y productividad; Rust, control, seguridad de memoria y rendimiento predecible | Las dos franjas otra vez, con píldoras que se encienden y un trozo de código de cada uno | Comparación |
| 93 a 103 | ¿Y Python o JS? | Son excelentes para muchas apps, pero hacen más trabajo detrás de escena, y en ciertas cargas eso se suma | Logos de Python y JS; "compiled: straight to the CPU" vs "interpreted"; barras: Rust 13,5 ms, Go 13,9 ms, JS 41,5 ms, Python 81 ms ("find primes up to 5,000,000") | Dato, barras |
| 103 a 115 | El mito | Rust no es automáticamente más rápido que Go; si tu servidor espera a la base de datos o la red, el caché o el diseño de la base importan más | "a common misconception"; zoom a 13,5 vs 13,9; "RUST IS NOT AUTOMATICALLY FASTER"; camino servidor → base de datos: "Rust: 1.7x faster code, 0.03% faster request"; "better caching: 20 times faster, in any language" | Dato, diagrama |
| 115 a 126 | ¿Cuál eliges? | Para APIs, microservicios y sistemas distribuidos, Go; para componentes críticos donde importan el control y la seguridad de memoria, Rust | Las dos franjas con etiquetas y los logos de las empresas que vuelven | Comparación |
| 126 a 137 | Cierre | Son herramientas que resuelven problemas distintos; rápido no es solo velocidad bruta, también confiabilidad y mantenimiento | Tres medidores: raw speed, reliability, maintainable, que suben; panel "the choice": Go "simple, productive", Rust "in control, predictable"; "fast is never just speed" | Medidores, tabla |

## El ritmo

Unos 7 a 9 cambios visuales cada 10 s: algo entra, se cuenta o se tacha cada 1 a 1,5 s. No hay quietudes de más de 2 s; lo más quieto es la comparación de prioridades (87 a 93 s), donde solo se encienden píldoras.

## El cierre

Termina en los tres medidores y la tabla "the choice", que se puede capturar. No pide nada: no hay CTA hablado ni en pantalla.

## Para copiar

- **Estructura y ritmo:** los 12 bloques en el mismo orden y con el mismo peso; la misma escalera: Go (compilado → hilos → goroutines → recolector), Rust (compilado → ownership → el precio), comparación, el mito y la elección.
- **El mundo:** la pantalla partida turquesa / óxido del gancho, la cinta transportadora con las dos estaciones, el panel de terminal fijo abajo a la derecha y el escenario arriba.
- **Recursos que se llevan:** los logos de Go, Rust, Docker, Kubernetes, Cloudflare, Discord, Python y JavaScript (fieles, por la regla 6); los bloques de 8 MB, las partículas de goroutines, el depósito con barrenderos, el dueño con su caja, la barrera del compilador, las barras de benchmark, el camino a la base de datos y los tres medidores.
- **Las cifras:** son mediciones del referente ("measured on this Mac"), no datos oficiales: si se usan, van rotuladas.
- **No se copia:** Rick, su nombre ni su firma. En su lugar va el avatar de @jacket.dev; el acento, los materiales, el marco y la firma son nuestros.
