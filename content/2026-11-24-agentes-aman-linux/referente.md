# Referente: por qué los agentes de IA aman Linux, de @rick.theengineer

Análisis hecho sobre el archivo que pasó Jeremy (`Downloads/reel (7).mp4`), sin el reproductor incrustado: la voz transcrita con whisper.cpp (`out/referente-audio.srt`) y cuadros de ffmpeg cada 2,5 s. Los cuadros y la transcripción quedan en `out/`, que no entra en git: son de otra cuenta.

## Ficha

- **Duración:** 137,1 s, 720×1280, 30 fps. `target` 137 (±10 %: 123 a 151 s). Formato `largo`.
- **Idioma:** inglés, unas 390 palabras (2,8 por segundo). En español saldrán más: hará falta subir el `tempo` (hasta 1,4) o recortar palabras sin perder pasos.
- **Tesis:** los agentes de IA trabajan mejor con texto que con clics, y Linux se controla entero con texto: comandos, tuberías, un solo árbol de archivos, todo es un archivo, códigos de salida y contenedores para aislarlos. "Texto que entra, texto que sale."
- **Cierre:** sin CTA. Termina en "TEXT IN, TEXT OUT." con la terminal `cat needs.txt` (cada acción, un comando; cada resultado, texto; cada error, atrapado y corregido).

## El gancho, 0 a 12,5 s

- **Cuadro 1:** fondo rosa magenta degradado; "WHY DO AI AGENTS" en píxeles blancos arriba; una ventana de navegador (una web de cine inventada, "Starlight Cinemas") donde un cursor de agente ("Grok Bot") elige película.
- **Voz:** "¿Por qué los agentes de IA aman Linux? Muse, Grok Bot, Dots: estos agentes operan computadoras y hacen tareas complejas solos. Pero ¿qué sistema usan? Muy seguido, Linux."
- **Arriba aparecen tres íconos de app con su empresa:** Muse (Meta), Grok Bot (xAI), dots (OpenAI). El agente elige asientos, paga 41,50 USD y sale "2 tickets confirmed"; a los 10 s la ventana muestra una terminal con `uname -s`.

## El mundo y el aspecto (lienzo de 540×960)

- **Fondo:** desde 12,5 s, negro (#000) con un piso de grilla verde en perspectiva y horizonte con niebla verde a y ≈ 600. En 51 a 56 s el piso pasa a rojo (el error). En 108 s, ámbar (el peligro, la laptop).
- **HUD:** barra de 0 a 25: a la izquierda "agent@linux:~$" verde chico; a la derecha "0N · NOMBRE DEL CAPÍTULO" (01 HUMANS VS AGENTS, 02 THE HARNESS, 03 PIXELS VS TEXT, 04 THE TERMINAL, 05 ONE TREE, 06 EVERYTHING IS A FILE, 07 EXIT CODES, 08 THE SANDBOX, 09 TEXT IN, TEXT OUT).
- **Zonas:** escenario arriba, de 60 a 500 (paneles, diagramas, títulos); presentador de cuerpo entero abajo a la izquierda, de x 20 a 130 y de y 400 a 700, parado sobre la grilla; una terminal o tarjetas a la derecha, de x 140 a 520 y de y 520 a 690; subtítulos en caja con borde verde, centrados, a y ≈ 745, con 2 o 3 palabras clave en verde.
- **Qué persiste:** la grilla, el presentador y casi siempre una terminal; el "modelo" (un invasor de píxeles naranja) reaparece en el harness, el error, el ciclo y el cierre. El panel de arriba se limpia en cada capítulo.
- **Títulos:** píxel/monoespaciados, mayúsculas, verdes con brillo, de 30 a 40 px; centrados ("PIPES", "THE LINUX FILE SYSTEM", "EVERYTHING IS A FILE", "SAFETY", "TEXT IN, TEXT OUT."), o enormes en rojo con marco ("EXIT 1").
- **Texto de interfaz:** monoespaciado de 9 a 12 px en terminales y rótulos; mucho texto chico por cuadro (líneas de log, rutas), legible por su contraste.
- **Colores con función:** verde fósforo (#3CFF8A aprox.) es el sistema y lo correcto; naranja salmón (#E0705A) es el modelo de IA; rojo (#FF3B3B) el error; ámbar (#FFB020) el peligro sin aislar; blanco tenue en ventanas de UI gráfica (lo humano).
- **Materiales y acabado:** plano, de holograma; tarjetas negras con borde verde de 1 px y brillo, esquinas casi rectas; ventanas de terminal con los tres puntos de macOS; esquinas de mira (corchetes) en los paneles grandes.
- **Cuadros del aspecto:** 1, 6, 13, 27, 44, 57, 66, 78, 93, 103, 118, 132.

## Escena por escena

| s | Capítulo | Lo que se ve | Lo que se dice (resumido) | Recurso | Entra |
|---|---|---|---|---|---|
| 0 a 12,5 | Gancho | Navegador del cine con el cursor del agente; íconos de Muse, Grok Bot y dots; "WHAT OS"; terminal `uname -s` | Por qué los agentes aman Linux; operan computadoras solos; ¿qué sistema usan? Linux | Interfaz, logos | Corte |
| 12,5 a 20 | 01 Humans vs agents | Panel "HUMANS · GUI" con carpetas y botón Save, cursor; se apaga y entra "AGENTS · TEXT" con `echo "text in"` | Los humanos mueven el mouse; los agentes trabajan mejor con texto | Antes/después | Fundido |
| 20 a 42 | 02 The harness | Invasor "MODEL"; marco "HARNESS" con bash, read, write, edit; JSON `{"tool":"bash","command":"ls /var/log"}` baja a una terminal real y la salida sube; "step 01" a "step 05" | El modelo lee y escribe texto; un programa (harness) le da herramientas; pide un comando, el harness lo corre y le devuelve el texto; una y otra vez | Diagrama de flujo | Corte, flechas |
| 42 a 50 | 03 Pixels vs text | "Checkout Admin" con botón Restart; captura con mira y click(436, 302) errado; marcador: SCREENSHOT + CLICK 4,2 s 2/5 OK contra TEXT COMMAND 0,04 s 5/5 exit 0; "LINUX ⇄ TEXT" | Algunos ven capturas y hacen clic, pero es más lento y menos confiable; el texto es su idioma; Linux se controla con texto | Comparación, marcador | Corte |
| 50 a 75 | 04 The terminal | Piso rojo; tarjeta "checkout-api.service FAILURE" con contador de reinicios 2, 3; carpetas tachadas; terminal con grep, find, cat, git y lista que se marca; diagrama PIPES: cat app.log → grep ERROR → tail -5 → STDOUT | Una app se cae; en vez de abrir carpetas, abre la terminal: grep, find, cat, git; las tuberías encadenan comandos; en una línea, los últimos errores | Terminal, lista, diagrama | Corte |
| 75 a 87 | 05 One tree | "THE LINUX FILE SYSTEM": árbol / con /etc (settings), /var/log (logs), /home (user files); terminal con `ls /`; laptop Ubuntu, server Debian, cloud Fedora con el mismo árbol | Todo cuelga de una raíz; ajustes en /etc, logs en /var/log, usuarios en /home; esa consistencia ayuda en máquinas desconocidas | Árbol | Corte |
| 87 a 97 | 06 Everything is a file | Tres tarjetas /proc/cpuinfo, /proc/meminfo, /proc/1234/status con valores vivos (3659,8 MHz, 9,21 GB free, R running) y `cat` | Hasta los recursos del sistema son archivos: CPU, memoria, procesos; ventanas vivas, legibles con las mismas herramientas | Tarjetas | Corte |
| 97 a 106 | 07 Exit codes | "EXIT ?" → "EXIT 1" rojo; traceback de Python, `pip install flask`, `echo $?` → 0; ciclo ACT, OBSERVE, CORRECT, REPEAT alrededor del modelo | Si falla, devuelve un código de salida y un error; el agente lo lee, ajusta y reintenta: actuar, observar, corregir, repetir | Ciclo | Corte |
| 106 a 122 | 08 The sandbox | "SAFETY" con candado; "YOUR LAPTOP" (~/photos, ~/.ssh, ~/work) en ámbar con "FULL ACCESS" y `rm -rf ~/work/*`; CONTAINER (comparte el kernel) y VM (su propio kernel); caja sellada con namespaces, cgroups, seccomp; `docker rm -f sandbox` | No quieres un agente con comandos libres en tu computadora; contenedores y VMs aíslan; trabaja sellado y al final se tira | Antes/después, caja | Corte |
| 122 a 137 | 09 Text in, text out | Modelo ♥ Tux; "<3" (0x3C 0x33); LINUX · 1991 contra LLM AGENTS · 2020s (~30 años); "TEXT IN, TEXT OUT." y terminal `cat needs.txt` que se completa con ✓ | Los agentes no aman Linux de verdad, ni Linux se hizo para IA; ofrece justo lo que necesitan: cada acción un comando, cada resultado texto, cada error atrapado y corregido | Titular gigante, terminal | Corte |

## El ritmo

Algo cambia cada 1 a 2 s: comandos que se tipean, casillas que se marcan, valores que se actualizan. No hay quietud de más de 2 s salvo el título "THE LINUX FILE SYSTEM" (75 a 77 s) y "SAFETY" (106 a 108 s), que funcionan como cortinas de capítulo.

## Para copiar

- **La estructura:** gancho con agentes operando una computadora, 9 capítulos con HUD numerado y el cierre "texto entra, texto sale" sin CTA (el nuestro lleva uno).
- **El aspecto:** negro con grilla verde en perspectiva, presentador abajo a la izquierda, terminal a la derecha, paneles con borde verde arriba, subtítulos en caja verde; el modelo como invasor naranja, el error en rojo, el peligro en ámbar. Es el mismo mundo de `2026-11-17-que-es-linux`.
- **Lo que no se copia:** Rick, su nombre y su firma. El avatar de @jacket.dev va en el lugar del presentador.
- **Logos e interfaces reales:** Tux, Docker, Ubuntu, Debian y Fedora se recrean fieles por la regla 6 de AGENTS.md. La web del cine es inventada: si se usa, va rotulada "Ejemplo ilustrativo".
