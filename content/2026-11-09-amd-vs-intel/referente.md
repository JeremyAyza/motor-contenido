# Referente: AMD vs Intel, de @rick.theengineer

Análisis hecho en el reproductor incrustado (`/embed/`), sin sesión y sin descargar el video. Miré un cuadro cada 2 s (y otro desplazado 1 s, para ver cuándo entra y sale Rick), cada 0,5 s en los primeros 5 s y cada 0,2 a 0,3 s en los cortes que importaban (8,2 a 8,8; 11,3 a 11,9; 19,2 a 19,8; 25,2 a 25,8; 29,3 a 29,9; 44,6 a 45,5; 136,4 a 136,7). Para ver varios cuadros por captura los dibujé en un lienzo de la propia página (3 cuadros por captura, o recortes a escala 1:1 para medir). Las medidas están en el lienzo de 540×960 (de arriba abajo, en px) y son aproximadas (±8 px); los tiempos de los cortes, ±0,5 s. El audio no se oye en este entorno: lo dicho sale de los subtítulos quemados y del texto del post, resumido por beat y sin transcribir. No pude guardar los PNG (mis herramientas no copian imágenes a disco): los cuadros clave van descritos en la sección 3 y los 12 segundos para `video:comparar` están al final de ella.

## 1. Ficha

- **Cuenta:** @rick.theengineer (563 mil seguidores, 164 publicaciones).
- **URL:** https://www.instagram.com/p/DffIA7EMGwZ/ (el embed lo abre como `/reel/DffIA7EMGwZ/`).
- **Duración exacta:** 147,518708 s (`duration` del `<video>`), 720×1280. Para el `target`: 147,5 s (rango de ±10 %: 133 a 162 s). Es un video largo: el referente anterior duraba 101,5 s.
- **Fecha:** 8 de noviembre de 2026 (~15:54 UTC), decodificada del id del medio (el embed no la muestra).
- **Vistas:** no se ven. 3.672 me gusta y 27 comentarios al leerlo.
- **Idioma:** inglés (voz y subtítulos). La réplica va en español: hay que reescribir para el oído.
- **Voz:** "Audio original", no se oye aquí. Ritmo estimado de los subtítulos: ~2,5 palabras por segundo (unas 350 a 370 palabras); la intro (2 a 5 s) va más rápido. Música y efectos: no se oye.
- **Etiquetas:** #amd #intel #cpu #pcbuild #techexplained.
- **Texto del post (resumen, no copia):** abre con la tesis "hablan el mismo idioma, construyen el cerebro distinto"; explica x86 y por qué corre el mismo software; AMD apuesta por chiplets modulares (chiplets de cómputo, un die de entrada/salida, Infinity Fabric, un defecto arruina menos silicio); Intel apuesta por mezclar núcleos grandes y chicos (Thread Director, tiles, Foveros); el giro de los juegos es la 3D V-Cache de AMD (64 MB de L3 apilados); guía por uso en 3 viñetas (juegos, edición y multitarea, laptops); moraleja y una pregunta final para comentar (en qué equipo estás, rojo o azul).
- **Tema en una línea:** cómo AMD e Intel construyen distinto el mismo tipo de chip y cuál conviene según el uso.
- **Tesis:** los dos hablan el mismo lenguaje (x86), así que el software corre en ambos; lo que cambia es cómo lo convierten en silicio (AMD: chiplets y caché apilada; Intel: núcleos mixtos, tiles y Foveros), y el mejor chip es el hecho para el trabajo que haces.

## 2. El gancho, 0 a 3 s

Es un versus visual de marcas, sin pregunta: abre nombrando a los dos bandos y luego los pone en contexto (todos los PC con Windows). La pregunta de verdad ("qué los hace distintos y cuál elegir") llega a los 8,3 s.

- **Cuadro 1 (0,05 s):** casi negro (#05070A) con una retícula apenas visible. El wordmark "AMD" blanco al 18 % de opacidad arriba a la izquierda (x 20 a 286, y 128 a 189), el wordmark "intel" al 18 % a la derecha (x 331 a 513, y 304 a 375) y un chip Intel fantasma abajo a la derecha (x 263 a 526, y 466 a 621). Sin título y sin subtítulo. No hay un objeto claro en el cuadro 1: es una apertura que "enciende".
- **0,3 s:** el logo AMD pasa a blanco pleno con un subrayado rojo fino (#D62839) y entra el chip AMD en render 3D (x 9 a 263, y 254 a 432, inclinado, con brillo radial rojo detrás). Entra el primer subtítulo, centrado en y 738.
- **0,5 s:** el subtítulo completo es "AMD versus Intel." (AMD en blanco, el resto en gris que se va encendiendo).
- **1,0 s:** una "VS" minúscula en mono entre los chips (x ~280, y ~461).
- **1,5 s:** el wordmark Intel y su chip a plena luz, con un brillo azul abajo a la derecha; el chip AMD arriba a la izquierda. Composición en diagonal, rojo arriba-izquierda contra azul abajo-derecha. Es el cuadro que muestra el embed como portada.
- **~1,9 s:** corte duro a una rejilla de 24 dispositivos Windows dibujados en línea fina (monitores, laptops, torres), con una barra superior "AMD | WINDOWS PCS | intel" (y 172 a 203; "WINDOWS PCS" en mono de ~8 px). Rejilla: x 45 a 497, y 229 a 664, 4 columnas por 6 filas.
- **2,5 s:** los contornos se encienden en oleadas; **4,0 s:** dentro de cada dispositivo aparece un punto de chip, rojo (AMD) o azul (Intel), repartidos 12 y 12.
- **Texto en pantalla (0 a 3 s):** solo marcas ("AMD", "intel"), la "VS" y el rótulo "WINDOWS PCS", ambos diminutos. Ningún título.
- **Lo dicho (0 a ~5,3 s):** el enfrentamiento por nombre; casi todos los PC con Windows corren con un chip de una de estas dos empresas.
- **Segundo gancho (5,3 a 11,2 s):** "Inside, built differently" (dos placas verdes con tapa que se levanta) y las dos preguntas con Rick, que entra con un fundido de 0,3 s a los 8,5 s.

## 3. El mundo y el aspecto

**El mundo.** Un lienzo oscuro tipo "ficha técnica" que dura todo el video, con un marco ligero (etiqueta de capítulo arriba y subtítulos abajo) sobre el que cambian diagramas planos en tarjetas y renders 3D de chips. No hay escenario físico. La cámara solo se mueve en los renders 3D (inclinación y giro del chip, vista explosionada, paso de perspectiva a vista cenital) y en un clip macro de 3 s. El resto es corte duro entre bloques y animación de elementos (aparecer atenuado y encenderse cuando la voz lo nombra). Estructura en 7 capítulos con etiqueta: 01 THE SHARED LANGUAGE, 02 MANUFACTURING, 03 ASSEMBLY, 04 THE CORES, 05 CACHE, 06 WHICH ONE?, 07 THE MENTAL MODEL. Los dos bandos tienen color fijo en todo el video: rojo = AMD, azul = Intel.

**Presentador.** Rick, el mismo personaje del referente anterior: ilustración 2D de cuerpo entero (pelo azul, sudadera negra, jeans, laptop con calcomanías bajo el brazo), con un contorno de brillo blanco azulado que lo separa del fondo negro y sin sombra de contacto. El cuerpo no se mueve (flota quieto) pero la cara sí: ojos y boca cambian (habla y parpadea). Entra con fundido de ~0,3 s o ya presente desde el primer cuadro de un bloque; sale con el corte del bloque.

### Apariciones de Rick (9, unos 58 s de 147,5; 39 %)

1. **8,5 a 19,5 s** (11 s): fundido de entrada de 0,3 s justo después del corte de las preguntas (8,3 s). Se queda a través del corte de capítulo (11,2 s). Sale con el corte duro a las tarjetas de código (19,5 s).
2. **25,1 a 29,0 s** (3,9 s): ya está en el primer cuadro del bloque "Same commands, different silicon"; sale con el corte al capítulo 02.
3. **36,7 a 39,7 s** (3 s): entra poco después del corte, durante el diagrama "Intel diseña y fabrica"; sale antes del cambio a AMD y TSMC.
4. **42,5 a 44,7 s** (2,2 s): bloque "How the chip is assembled"; sale con el corte a CHIPLETS.
5. **55,7 a 62,7 s** (7 s): obleas ("Why split it up?", defectos, dies chicos); sale con el corte a Infinity Fabric.
6. **74,6 a 94,6 s** (20 s, la más larga): capítulo 04 entero (núcleos híbridos, Thread Director, AMD un solo tipo de núcleo, SMT). Cruza 4 cortes de bloque; sale a los 94,6 s, justo antes del resumen.
7. **108,5 a 111,7 s** (3,2 s): "An extra twist", el 7800X3D.
8. **120,8 a 125,7 s** (4,9 s): "Which should you pick?", tabla de elección; sale cuando arranca la fila de edición de video.
9. **136,4 a 139,6 s** (3,2 s): arranque del capítulo 07, el modelo mental; sale antes de las tarjetas "apuestas".

Nunca está en el gancho (0 a 8,3 s), ni en los renders 3D puros (chiplets, tiles, Foveros, 3D V-Cache), ni en el cierre (145 a 147,5 s). Aparece en los bloques de explicación o de decisión y se va cuando el diagrama necesita todo el ancho.

**Dónde está y cuánto mide.** Caja de Rick: x 12 a 126 (~110 px), y 290 a 675 (unos 385 px, el 40 % del alto), con los pies en y ~675. Con Rick presente, el contenido ocupa la columna derecha x 151 a 510; sin Rick usa todo el ancho (x 30 a 510).

### El aspecto, con medidas (lienzo 540×960)

**Fondo.**
- Oscuro todo el video: negro casi puro #05070A (con tinte azulado), una viñeta radial muy tenue y una retícula de líneas de 1 px (#0F131A) cada ~26 a 30 px, visible solo en algunos cuadros.
- Resplandores de bando en el gancho y las portadas 3D: radial rojo oscuro (#3A0D14) detrás del chip AMD, radial azul oscuro (#0D1F3A) detrás del de Intel.
- Sin fondo claro en ningún momento. Sin cuñas de color ni cambios de fondo por capítulo: el capítulo se marca solo con la etiqueta.

**Zonas (de arriba abajo).**
- 0 a 120: vacío (zona segura de la interfaz de Instagram). En el gancho hay solo marcas y la barra "AMD | WINDOWS PCS | intel" en y 172 a 203.
- 130 a 145: **etiqueta de capítulo** (desde los 11,2 s hasta el final): punto blanco, "0N · NOMBRE" en mono mayúsculas con espaciado ancho y una línea fina (#1C222B) hasta x ~510, centrada en y ~137.
- 165 a 200: **título de la escena** (a la izquierda del bloque: x 30 sin Rick, x 151 con Rick; en 2 o 3 bloques va centrado).
- 200 a 660: **escenario** (el 48 % del cuadro): una tarjeta, un diagrama o un render que mide entre 360 y 480 px de ancho.
- 290 a 675: Rick, a la izquierda (x 12 a 126), cuando está.
- 650 a 675: nota al pie en mono de ~9 a 10 px, gris (#6B7280), con el chip y "simplified layout" (en casi todos los diagramas).
- 725 a 752: subtítulos, centro en y 738, centrados en x 270, sin píldora ni fondo.
- 770 a 960: vacío (190 px).

**Qué persiste y cómo cambia.**
- Persisten: subtítulos (todo el video), etiqueta de capítulo (de 11,2 s al final), la regla rojo = AMD y azul = Intel, y Rick en su columna mientras dura cada aparición.
- Se repiten como "íconos de cada bando": la placa verde con 3 dies (AMD) y la placa verde con un bloque azul de tiles (Intel). Salen en 5,5 s (grandes), 8 s (miniatura en las preguntas), 24 a 28 s y 138 a 144 s. Los chips 3D del gancho vuelven en el cierre (llamada al principio).
- Cambian: la placa AMD pasa de render 3D inclinado (45 s) a vista cenital (49 s); la placa Intel de render inclinado (66 s) a cenital (69 s) y a vista explosionada (72 s); la tarjeta de comparación (120 s) se vuelve las dos "apuestas" (138 s).
- Se limpia: en cada corte desaparece todo lo demás. Dentro de un bloque lo que aún no se dice está atenuado (20 a 30 %) y se enciende cuando la voz lo nombra.

**Títulos.**
- Título de escena: ~26 px, peso 500 (tipo Space Grotesk), blanco #F4F6FA, una línea. Sin palabra resaltada (la jerarquía la da la fuente, no el color).
- Palabra gigante de capítulo (solo en los renders): "CHIPLETS" (~54 px, bold, rojo salmón #F0606B, arriba a la izquierda, y 150 a 210), "TILES" (azul oscuro #2F6FD0), "FOVEROS" (azul claro #4DA3FF), "3D V-CACHE" (~60 px, blanco, centrada), "BILLIONS" (blanca, abajo del clip macro) y "x86" (gris fantasma enorme, ~100 px, #24272E, que pasa a blanco al decirlo). Entran de fantasma a pleno en ~1 s.
- Números grandes: contador "16" y "64" (~36 px, blanco, arriba a la derecha) y "96 MB" (~32 px).
- Cifras de código máquina en ámbar #F2A93B, mono bold ~22 px.

**Subtítulos.** Una línea, de 2 a 4 palabras (14 a 28 caracteres), centrada en y 738, sin píldora, sin fondo y sin contorno visible. Letra tipo Inter de ~28 a 30 px, peso 700. Karaoke por palabra: la palabra actual en blanco pleno, las ya dichas en gris claro (#C9CDD8) y las que faltan en gris (#7C8294). Cambian cada 0,5 a 1,4 s (más rápido en la intro).

**Texto de interfaz.** Mucho y chico: es el sello del video. Rótulos en mono mayúsculas de 9 a 12 px (CCD 0, I/O DIE, FOVEROS BASE TILE, DDR5 MEMORY, WAIT PER TRIP), etiquetas de tarjeta de 13 a 18 px (Inter), títulos internos de tarjeta de ~24 px, notas al pie de ~9 px, números de datos de 24 a 32 px. Por cuadro: de 6 a 25 textos chicos. Ojo: las notas de ~9 px y los rótulos de 9 a 11 px quedan bajo el mínimo de 12 px del inspector (`data-ui`).

**Colores con función (por tono).**
- Rojo AMD: texto y bordes #E8505B, dies/CCD rellenos #B52A3B, subrayado del logo #D62839. Significa AMD, y también los defectos en el diagrama de obleas (puntos #FF3B6B).
- Azul Intel: #3B82E0 (texto claro #6AA8FF), núcleos P #1F5FB0, tiles #1B3F7A. Significa Intel.
- Ámbar #F2A93B: código máquina, tareas ("GAME", "SYNC", "UPDATES"), hilo A, la compuerta del transistor, barras de energía.
- Violeta #9D78F0: hilo B (SMT).
- Verde caché #52D39A (y #2F7A5A en rellenos): L1, L2, L3, "+ 64 MB", "hit in L3", casillas de éxito.
- Verde placa #123A27 a #1B5A3A: el substrato (PCB) de los chips; dies oscuros #14172B; pines dorados #C99A6B.
- Cobre #C46A3A: el clip macro del cableado.
- Blanco #F4F6FA: texto principal; gris #8B93A3: texto secundario; #4A5160: texto desactivado.

**Materiales y acabado.** Mezcla de tres lenguajes. (1) Interfaz plana tipo blueprint: tarjetas #0D1117 con borde de 1 px #1C2330, radio de 8 a 10 px, sin sombra visible; casillas vacías con borde punteado; estado activo con borde de color y relleno teñido (rojo #1E0E12, azul #0E1B30). Íconos de línea fina blanca (monitor, laptop, fábrica, gamepad). (2) Renders 3D de chips (AMD Ryzen con tapa gris metálico claro #D9DBDE y serigrafía, Intel Core Ultra igual, placa verde, pines dorados) con luces duras y brillo en los bordes; un transistor 3D en bloque gris azulado con etiquetas SOURCE, GATE y DRAIN; una rejilla isométrica de transistores; vista explosionada con microbumps. (3) Un clip macro fotorreal de cobre con destellos (29 a 32 s), parecido a un video generado. No hay pixel art ni ilustración fuera de Rick. Los logos de AMD, Intel y TSMC van planos y blancos; AMD con subrayado rojo e Intel con subrayado azul.

### Cuadros clave del aspecto (descritos, sin PNG)

1. **Gancho (1,5 s):** negro con retícula; wordmark AMD blanco arriba a la izquierda (y 128 a 189) con subrayado rojo, chip AMD 3D inclinado con brillo rojo, "VS" minúscula, wordmark intel a la derecha (y 304 a 375) con chip Intel 3D abajo y brillo azul; subtítulo "AMD versus Intel." en y 738.
2. **Rejilla de PCs (3,5 s):** 24 dispositivos de línea fina en 4×6 (x 45 a 497, y 229 a 664), barra "AMD | WINDOWS PCS | intel" arriba, subtítulo abajo.
3. **Capítulo con Rick (16 s):** etiqueta "01 · THE SHARED LANGUAGE" en y 137, Rick a la izquierda (x 12 a 126, y 290 a 675), tarjeta "The vocabulary" (x 151 a 510, y desde 200) con 6 filas mono (ADD, MOV, JMP, CMP, CALL, RET) que se encienden en ámbar.
4. **Render 3D (46 s):** "CHIPLETS" gigante en rojo salmón arriba, chip AMD 3D inclinado en el centro, rótulo mono rojo "AMD · RYZEN 9 9950X" en y ~651, subtítulo en y 738. Sin Rick.
5. **Diagrama de datos (80 s):** etiqueta "04 · THE CORES", título centrado en la columna derecha, 2 filas de 12 núcleos (P azules, E chicos), leyenda "8 PERFORMANCE / 16 EFFICIENCY" con barras, Rick a la izquierda.
6. **Cierre (147 s):** etiqueta "07 · THE MENTAL MODEL", logos AMD e intel arriba (y 172 a 203), los dos chips 3D de la portada (y 290 a 425) con "x86" punteado en medio, rótulos mono rojo "CHIPLETS + CACHE" y azul "BIG + SMALL CORES" (y ~504) y la frase final en ~27 px, peso 500, blanca, centrada en y ~590; subtítulo "actually do." en y 738.

**Cuadros del aspecto (12 s, para `video:comparar`; segundos con punto decimal):** 0, 1.5, 3.5, 16, 33, 50, 61, 80, 106, 124, 141, 147.

## 4. Escena por escena

Tiempos ±0,5 s. La voz va resumida por beat, no transcrita (ver arriba). "Corte" es corte duro.

| Tiempo | Qué se ve | Qué se dice (resumen) | Recurso visual | Cómo entra |
|---|---|---|---|---|
| 0,0 a 1,9 | Negro con wordmarks tenues que se encienden; chips AMD (arriba izq.) e Intel (abajo der.); "VS" | Los dos nombres, enfrentados | Logos, chips 3D | Fundido desde casi negro (0,3 s) |
| 1,9 a 5,3 | Rejilla de 24 PCs de línea; puntos de chip rojos y azules | Casi todo PC con Windows corre con uno de estos dos chips | Íconos, barra de marcas | Corte; oleada de encendido |
| 5,3 a 8,3 | "Inside, built differently": 2 placas verdes con tapa (LID) que se abre y muestra 3 dies (AMD) y tiles (Intel) | Por dentro, sus procesadores están construidos muy distinto | Placas, rótulos mono | Corte; la tapa se levanta |
| 8,3 a 11,2 | Dos tarjetas de pregunta (What's actually different? / Which one should you pick?) con las placas y los logos; Rick entra | Plantea las dos preguntas del video | Tarjetas de pregunta, avatar | Corte; Rick con fundido (8,5 s) |
| 11,2 a 15,7 | Cap. 01: título "What they share", AMD y intel unidos por una línea, "x86" gigante fantasma | Empiezan por lo que comparten: el mismo conjunto de instrucciones, x86 | Logos, palabra gigante | Corte (Rick sigue) |
| 15,7 a 19,5 | Tarjeta "The vocabulary" con 6 comandos (ADD, MOV, JMP, CMP, CALL, RET) que se encienden uno a uno | El vocabulario básico que entiende una CPU | Tarjeta de lista, mono | Aparece atenuada y se enciende |
| 19,5 a 22,5 | 3 tarjetas "instrucción → código máquina" (add eax, ebx → 01 D8; mov; jmp) | Cada comando es un código de máquina | Código, tarjetas | Corte; Rick sale |
| 22,5 a 25,1 | "ONE PROGRAM" (bytes) con 2 flechas hacia las placas AMD e Intel, check en AMD; "SAME BYTES, EITHER BRAND" | Por eso el mismo software corre en cualquiera de las dos | Diagrama de flechas | Corte |
| 25,1 a 29,0 | "Same commands, different silicon": los bytes con curvas ámbar que bajan a las dos placas (SEPARATE DIES rojo, TILES ON A BASE azul); Rick | La diferencia es cómo cada una convierte los comandos en silicio | Curvas animadas, placas | Corte (Rick ya está) |
| 29,0 a 32,0 | Cap. 02: "First, manufacturing" y "~1 MICRON COPPER WIRING" sobre un clip macro de cobre; "BILLIONS" gigante | Un procesador está hecho de miles de millones de transistores | Clip macro, palabra gigante | Corte; paneo del clip |
| 32,0 a 33,8 | "A transistor is a switch": transistor 3D con SOURCE, GATE, DRAIN e interruptor OFF/ON | Son interruptores diminutos grabados en silicio | Render 3D, etiquetas | Corte; giro del objeto |
| 33,8 a 36,5 | "Smaller transistors": rejilla isométrica de 16 y luego 64 transistores, contador y barra "energy per switch" | Más pequeños: más por chip y menos energía | Isométrico 3D, contador | Corte; la rejilla se multiplica |
| 36,5 a 40,2 | Logo Intel y diagrama DESIGN → FAB; Rick (36,7 s) | Intel diseña sus chips y los fabrica en sus propias fábricas | Diagrama de 2 cajas, ícono de fábrica | Corte; Rick con fundido |
| 40,2 a 42,5 | AMD (caja DESIGNS roja) → logo TSMC (caja MANUFACTURES) | AMD diseña y TSMC fabrica | Diagrama de 2 cajas | Corte |
| 42,5 a 44,7 | Cap. 03: "How the chip is assembled": 2 chips 3D con rótulos de socket; Rick | Ahora, cómo se ensambla el chip | Chips 3D, nota "Next: lift the lids" | Corte; Rick presente |
| 44,7 a 48,8 | "CHIPLETS" gigante rojo sobre el chip AMD; la tapa se quita y queda la placa verde inclinada con dies oscuros | AMD arma muchos procesadores con piezas separadas: chiplets | Render 3D, palabra gigante | Corte; cámara 3D que gira |
| 48,8 a 53,0 | "Compute chiplets (CCDs)": placa cenital con CCD 0 y CCD 1 y un die "I/O"; los CCD se tiñen de rojo con "16 CORES" | Un Ryzen de escritorio suele tener 1 o 2 chiplets de cómputo con los núcleos | Diagrama cenital, etiquetas | La cámara pasa de 3D a cenital |
| 53,0 a 55,5 | "Plus an input/output die": el die I/O con líneas punteadas a DDR5 MEMORY, PCIE 5.0 y USB | Un die de entrada/salida maneja memoria y conexiones | Diagrama, líneas | Cambio de título; líneas que se dibujan |
| 55,5 a 59,3 | "Why split it up?": oblea circular (300 mm silicon wafer) con defectos rojos; Rick (55,7 s) | Por qué dividirlo: las obleas tienen defectos diminutos | Oblea, puntos | Corte; Rick con fundido |
| 59,3 a 61,2 | "One defect, one dead chip": rejilla de dies grandes (24×24 mm) con X; "85 of 96 good, 89 %" | Un defecto arruina un chip gigante | Rejilla, contador de rendimiento | Misma oblea; la rejilla se superpone |
| 61,2 a 63,0 | "Small dies limit the damage": dies chicos (8,5×8,5 mm); "856 of 870 good, 98 %" | Los chiplets chicos limitan el daño | Rejilla, contador | Cambio de rejilla; Rick sale (62,7 s) |
| 63,0 a 65,7 | "Infinity Fabric" en rojo sobre la placa cenital; enlace de alta velocidad entre dies; "HIGH-SPEED DIE-TO-DIE LINK" | Se conectan con un enlace de alta velocidad llamado Infinity Fabric | Placa, línea animada | Corte |
| 65,7 a 68,7 | "TILES" gigante azul oscuro sobre el chip Intel Core Ultra 3D inclinado | Intel usa algo parecido: tiles | Render 3D, palabra gigante | Corte; la tapa se quita |
| 68,7 a 72,0 | "One job per tile": cenital con COMPUTE (TSMC N3B), GRAPHICS, SOC, I/O | Cómputo, gráficos y entrada/salida en tiles separados | Diagrama cenital | La cámara baja a cenital y se acerca |
| 72,0 a 75,0 | "FOVEROS" azul; vista explosionada: tile de cómputo sobre un "FOVEROS BASE TILE" con microbumps | Se unen con una tecnología de empaquetado llamada Foveros | Render 3D explosionado | Corte; las capas se separan |
| 75,0 a 79,0 | Cap. 04: "Intel: a hybrid design": 8 núcleos P (azules) y 16 E (chicos) en 2 filas; leyenda con barras; Rick (74,6 s) | Intel usa diseño híbrido: núcleos P para lo pesado | Diagrama de núcleos | Corte; Rick con fundido |
| 79,0 a 83,0 | "Performance cores" y "Efficiency cores": fichas de tarea (GAME, SYNC, UPDATES, MAIL) caen en los núcleos | Los E, más chicos, se ocupan del fondo con menos energía | Diagrama, fichas | Cambio de título; fichas que caen |
| 83,0 a 88,0 | "Thread Director" y "The OS decides": caja OS SCHEDULER, caja THREAD DIRECTOR, flechas HINTS, fichas VIDEO y SCAN | Una función de hardware ayuda al sistema operativo a decidir qué tarea va a qué núcleo | Diagrama con flechas | Se añade la caja; corte a 88 s |
| 88,0 a 91,5 | "AMD: one core type": 2 CCD con 16 núcleos rojos idénticos; "16 identical, full-size cores" | AMD en escritorio usa un solo tipo de núcleo, todos grandes | Diagrama, cifra "16" | Corte |
| 91,5 a 95,0 | "Two threads per core" y "Simultaneous multithreading": zoom a un núcleo con THREAD A (ámbar) y THREAD B (violeta) en una rejilla de ranuras | Cada núcleo corre 2 hilos a la vez: multihilo simultáneo | Zoom, diagrama de ranuras | Zoom desde un núcleo; Rick sale (94,6 s) |
| 95,0 a 98,0 | Resumen: AMD "16 cores, 32 threads" contra Intel "24 cores, 24 threads" y tarjetas de un núcleo | Los chips de escritorio recientes de Intel dejaron el multihilo en sus núcleos P | Tarjetas comparativas | Corte |
| 98,0 a 102,0 | Cap. 05: "Your RAM is far from the core": CORE y RAM con línea punteada, un punto que viaja, tabla "WAIT PER TRIP" (L1 ~1 ns, L2 ~3, L3 ~10, RAM ~80) | La RAM está dolorosamente lejos de la CPU | Diagrama de latencia, barras | Corte |
| 102,0 a 105,5 | "Cache: fast memory in between": L1, L2, L3 se encienden en verde entre CORE y RAM | Los procesadores guardan capas de memoria ultrarrápida en el chip | Diagrama, barras | Cambio de título; barras que crecen |
| 105,5 a 108,5 | "Level 1 and 2: inside each core" y "Level 3: larger, and shared": CCD con L1 48 KB, L2 1 MB, L3 32 MB | L1 y L2 junto a cada núcleo; L3 más grande y compartido | Diagrama de CCD, callouts verdes | Corte |
| 108,5 a 112,0 | "An extra twist": tarjeta "AMD Ryzen 7 7800X3D", vista lateral con la capa extra de L3 punteada; Rick | AMD añade en algunos modelos una segunda capa de L3 apilada | Tarjeta de producto, vista lateral | Corte; Rick con fundido |
| 112,0 a 115,3 | "A second layer of L3, stacked": render 3D de la placa con el die de caché oscuro encima; rótulos CACHE DIE 64 MB y CCD 32 MB L3 | Apila una capa extra de caché en el chip | Render 3D | Corte; cámara que gira |
| 115,3 a 116,4 | "3D V-CACHE" gigante blanco sobre el mismo render; tarjeta "L3 per CCD: 32 MB + 64 MB = 96 MB" | Una tecnología llamada 3D V-Cache | Render 3D, ecuación | Zoom del render; la tarjeta sube |
| 116,4 a 120,8 | "Games reach for data constantly": 2 carriles CORE a RAM (L3 32 MB contra L3 96 MB V-Cache), casillas de peticiones verdes (hit) y grises (RAM), chip "BIG BOOST" (120,5 s) | Los juegos piden datos sin parar; más caché cerca da un gran empujón | Diagrama de carriles, casillas | Corte |
| 120,8 a 126,0 | Cap. 06: "Which should you pick?": tabla Gaming / Video editing & multitasking / Laptops con columnas AMD e intel; Gaming resaltada en rojo con ✓ "3D V-CACHE"; abajo la barra de 96 MB; Rick (121 s) | Para juegos, los chips con 3D V-Cache suelen ser los que hay que vencer | Tabla de decisión, íconos | Corte; Rick presente |
| 126,0 a 130,0 | Fila de edición resaltada en azul con ✓ "QUICK SYNC"; línea de tiempo (V2, V1, A1, 4K) y 4 tarjetas (EXPORT, BROWSER, STREAM, COMPILE) con barras | Para edición de video y multitarea pesada, Intel suele ser fuerte: muchos núcleos | Tabla, línea de tiempo | La fila se resalta; Rick sale (125,7 s) |
| 130,0 a 133,0 | Tile de cómputo "8 P + 16 E = 24 cores" y "Intel Graphics: Quick Sync, H.264, HEVC, AV1" | Y un motor de video integrado llamado Quick Sync | Diagrama, íconos de códec | Cambio de panel |
| 133,0 a 136,3 | Fila Laptops con "BY MODEL" en las dos columnas; laptop con AMD e intel en pantalla, batería de 4 celdas, etiqueta "SPECIFIC MODEL" | En laptops ambos compiten: depende de la batería y del modelo | Ícono de laptop y batería, etiqueta | Cambio de panel; la batería se llena |
| 136,3 a 145,0 | Cap. 07: "The mental model": placa AMD x86 placa Intel; dos tarjetas "AMD'S BET: Chiplets + cache" y "INTEL'S BET: Big + small cores" que crecen; la de Intel se resalta en azul (142 s) y luego la de AMD en rojo (144 s); Rick (136,4 s) | Ambos hablan el mismo lenguaje; AMD apuesta por chiplets modulares y caché enorme; Intel por mezclar núcleos grandes y chicos | Tarjetas de resumen | Corte; Rick con fundido y sale a los 139,6 s |
| 145,0 a 147,5 | Los 2 chips 3D del gancho con "x86" entre ellos y rótulos rojo y azul; la frase final se aclara de gris a blanco | El mejor chip es el hecho para el trabajo que de verdad haces | Render 3D, frase final | Corte; la frase se enciende |

## 5. El ritmo

44 bloques en 147,5 s (uno cada 3,4 s) y 43 cortes. Casi todos los cortes son duros; no hay cuñas de color ni desenfoques. Dentro de cada bloque cambia algo (un elemento que se enciende, una ficha que cae, un contador) cada 1 a 2 s; los subtítulos cambian cada 0,5 a 1,4 s.

| Ventana | Cortes de bloque | Cambios visuales (aprox., sin contar subtítulos) |
|---|---|---|
| 0 a 10 s | 3 (1,9; 5,3; 8,3) | 8 |
| 10 a 20 s | 3 (11,2; 15,7; 19,5) | 7 |
| 20 a 30 s | 3 (22,5; 25,1; 29,0) | 8 |
| 30 a 40 s | 3 (32,0; 33,8; 36,5) | 8 |
| 40 a 50 s | 4 (40,2; 42,5; 44,7; 48,8) | 9 |
| 50 a 60 s | 3 (53,0; 55,5; 59,3) | 8 |
| 60 a 70 s | 4 (61,2; 63,0; 65,7; 68,7) | 9 |
| 70 a 80 s | 3 (72,0; 75,0; 79,0) | 8 |
| 80 a 90 s | 2 (83,0; 88,0) | 7 |
| 90 a 100 s | 3 (91,5; 95,0; 98,0) | 8 |
| 100 a 110 s | 3 (102,0; 105,5; 108,5) | 8 |
| 110 a 120 s | 3 (112,0; 115,3; 116,4) | 8 |
| 120 a 130 s | 2 (120,8; 126,0) | 8 |
| 130 a 140 s | 3 (130,0; 133,0; 136,3) | 8 |
| 140 a 147,5 s | 1 (145,0) | 5 |

Entre 5 y 9 cambios por cada 10 s y 2 a 4 cortes. Los conteos de "cambios visuales" son estimados a partir de cuadros cada 1 a 2 s.

**Dónde se queda quieto más de 2 s (sin contar subtítulos):**
- 98 a 101 s: el diagrama "Your RAM is far" solo mueve un punto por la línea (~3 s).
- 145 a 147,5 s: el cierre; solo la frase se aclara y los chips derivan despacio (~2,5 s).

No hay otro tramo de más de 2 s totalmente quieto. Los renders 3D siempre rotan o se acercan.

## 6. El cierre

Termina en los dos chips 3D del gancho, con "x86" punteado entre ellos y los rótulos "CHIPLETS + CACHE" (rojo) y "BIG + SMALL CORES" (azul), y la frase final, que se aclara de gris a blanco mientras la voz la dice. El video acaba en la última palabra, sin pausa y sin pantalla final. **No hay despedida ni CTA en el video**: ni hablado ni en pantalla (ni "sígueme", ni "guarda", ni usuario). El CTA está solo en el texto del post: una pregunta para comentar en qué equipo estás, rojo o azul. Hay una llamada al principio (los mismos chips del gancho vuelven en el último cuadro) y la frase final repite la moraleja del post.

## 7. Para copiar

**Estructura (se copia):**
1. Gancho como versus visual de dos marcas (logos y chips 3D en diagonal, brillo de bandos) con el nombre de los dos en la primera frase, sin pregunta.
2. Contexto masivo (rejilla de 24 PCs con punto de chip rojo o azul) y "por dentro son distintos" (dos placas con tapa que se abre).
3. Promesa con dos preguntas (qué es distinto, cuál elegir) en tarjetas, con el avatar que entra.
4. Capítulo de lo que comparten (x86, el vocabulario, código máquina, "mismo software en las dos").
5. Capítulos de lo distinto, siempre en el mismo orden para los dos bandos y con etiqueta numerada: fabricación (transistor, diseño frente a fábrica), ensamblado (chiplets contra tiles, un porqué con obleas y rendimiento), núcleos (híbrido frente a un solo tipo, hilos), caché (latencias, L1 a L3, el giro 3D V-Cache).
6. Guía de decisión por uso en una tabla con 3 filas (juegos, edición, laptops) que se resalta fila por fila.
7. Cierre con el modelo mental (una tarjeta por bando), vuelta a los chips del gancho y una frase de moraleja.

**Ritmo (se copia):** 44 bloques en 147,5 s (uno cada ~3,4 s); cortes duros; algo cambia dentro del bloque cada 1 a 2 s; subtítulos de 2 a 4 palabras cada 0,5 a 1,4 s; 2 respiros de ~2,5 a 3 s (la RAM lejos y el cierre). Rick en 9 apariciones (el 39 % del tiempo), siempre en los bloques de explicación y de decisión.

**Aspecto (se copia por tono y función):**
- Lienzo oscuro #05070A con retícula casi invisible; tarjetas #0D1117 con borde de 1 px, radio de 8 a 10 px, sin sombra; casillas punteadas para lo vacío.
- Marco: etiqueta de capítulo en y 137 (punto, "0N · NOMBRE" en mono, línea fina), título de 26 px en y 165 a 200, escenario de y 200 a 660, nota al pie en mono de ~9 px en y 650 a 675, subtítulos en y 738 sin píldora, 190 px de vacío abajo.
- Dos bandos con color fijo (aquí rojo y azul): se llevan por función (cada lado de la comparación de la réplica); el ámbar de datos se lleva con el acento de @jacket.dev; el verde de caché y de éxito se mantiene.
- Palabra gigante por capítulo (54 a 60 px) sobre cada render y números grandes (contadores, ecuación).
- Rick en la columna izquierda (x 12 a 126, y 290 a 675), el contenido corrido a la derecha (x 151 a 510); título y contenido se alinean a x 151 cuando está.
- Elementos atenuados al 20 a 30 % que se encienden cuando la voz los nombra.

**Lo que se puede llevar fiel (regla 6 de `AGENTS.md`):** logos y productos reales: AMD, Intel y TSMC (logos); chips Ryzen y Core Ultra (la forma de la tapa, la placa y los pines); socket; Windows como contexto; la interfaz de una línea de tiempo de edición. Se recrean fieles, sin copiar el render.

**Lo que no se copia:** a Rick (se reemplaza por el avatar), su nombre, su logo, su firma, el texto exacto de los subtítulos y del post, y el clip macro de cobre (es de él).

**Puntos a decidir antes de copiar:**
- Este referente es 3D de verdad (chips, transistor, rejilla isométrica, vista explosionada) y la decisión vigente es estilo plano ("3D o isométrico, solo si Jeremy lo pide"): hay que dibujar los chips planos o isométricos, o preguntarle.
- Hay mucho texto bajo el mínimo de 12 px del inspector (`data-ui`): notas al pie de ~9 px y rótulos mono de 9 a 11 px. Subirlos a 12 o reducir el número por cuadro.
- Rick es de cuerpo entero (~385 px, 40 % del alto) y aquí su columna ocupa x 12 a 126; la regla vigente de `docs/reel.md` dice busto, abajo a la izquierda. Las 9 entradas de arriba pueden ser las del avatar.
- Rick no tiene marco de cuenta; el de @jacket.dev sí (pestaña, puntos y firma): hay que acomodar la etiqueta de capítulo (y 130 a 145) respecto a la pestaña.
- El video no tiene CTA: hay que decidir si la réplica añade uno (en el post, como él, o en un cierre corto).
- Largo: 147,5 s; ver si el `target` de la réplica lo iguala o lo acorta (se pueden quitar el capítulo 02 completo o el 04 sin romper la estructura).

## 8. Datos, cifras y productos que aparecen (tal como aparecen, sin verificar)

- **Chips en pantalla:** AMD Ryzen 9 9950X ("3 separate dies, 2 CCDs + I/O die"; "16 cores, 32 threads"; I/O die "TYPE N6"; socket AM5, lectura aproximada de un rótulo chico); Intel Core Ultra 9 285K (socket LGA 1851, lectura aproximada; "8 P + 16 E = 24 cores, 24 threads"; tile de cómputo "TSMC N3B"; "Foveros base tile", "microbumps"); AMD Ryzen 7 7800X3D ("32 MB L3 on the CCD + 64 MB stacked on top = 96 MB"; nota: "Ryzen 9000X3D puts the cache die underneath").
- **Caché:** L1 48 KB por núcleo, L2 1 MB por núcleo, L3 32 MB por CCD compartido por 8 núcleos; latencias L1 ~1 ns, L2 ~3 ns, L3 ~10 ns, RAM ~80 ns. Notas al pie: "approximate · typical desktop · ladder spacing compressed" e "illustrative · not a benchmark".
- **Obleas:** 300 mm; dies grandes 24 × 24 mm, "85 of 96 good, 89 %"; dies chicos 8,5 × 8,5 mm, "856 of 870 good, 98 %".
- **Transistores:** contadores de 16 y 64 "same area". **Entrada/salida:** DDR5, PCIe 5.0, USB. **Quick Sync:** H.264, HEVC y AV1.
- **Notas al pie de los diagramas:** "simplified layout" en casi todos; "Ryzen 9 9950X · simplified layout" y "Core Ultra 9 285K · simplified layout".
- **Lo que se ve viejo o desparejo:** del propio video: el diagrama de caché dice "Zen 5 CCD" pero el ejemplo X3D es un 7800X3D, y el video avisa que los 9000X3D invierten la pila (mezcla generaciones). Por lo que sé de fuera del video (no lo verifiqué): los chips principales (9950X y 285K) son de 2024 y el 7800X3D es de 2023, así que a fecha 2026-11-09 conviene revisar si hay generaciones más nuevas antes de fijar nombres de modelo en la réplica (si la réplica no compara AMD e Intel, esto no aplica).
