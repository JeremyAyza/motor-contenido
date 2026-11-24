# Referente: ¿Linux es mejor que Windows?, de @rick.theengineer

Análisis hecho sobre el archivo que pasó Jeremy (`Downloads/reel (5).mp4`, copiado en `out/referente.mp4`), sin el reproductor incrustado: la voz transcrita con whisper.cpp (`out/referente-transcripcion.srt`) y cuatro hojas con un cuadro por segundo (`out/referente-hoja1.jpg` a `hoja4.jpg`, 42 cuadros cada una). Todo queda en `out/`, que no entra en git: es de otra cuenta.

## Ficha

- **Duración:** 165,9 s, 720×1280, 30 fps. `target` 166 (±10 %: 149 a 183 s). Formato `largo`.
- **Idioma:** inglés, unas 470 palabras (2,8 por segundo). En español saldrán más: hará falta `tempo` alto (hasta 1,4) y frases cortas.
- **Tesis:** Linux contra Windows no es "bueno contra malo": cada uno optimiza para otro usuario. La pregunta real es si quieres que el sistema decida por ti o decidir tú.
- **Recurso central:** un dial horizontal arriba, "WHO MAKES THE DECISIONS?", que va de DEFAULTS (Windows) a CONTROL (Linux). Un punto se mueve por el dial según de qué lado habla la voz. Es el `meter` natural de la pieza.

## Aspecto

- **Fondo:** azul noche casi negro (#0B0F14 aprox.), plano, sin textura visible. Tarjetas oscuras con borde fino, esquinas poco redondeadas.
- **Dos colores con significado:** azul Windows (#3B8EEA aprox.) para todo lo de Windows y naranja (#F08A3C aprox.) para Linux. Verde (#3CCB7F) para "funciona", "detectado", "day one". Ámbar para la fricción.
- **HUD fijo arriba:** el dial DEFAULTS / CONTROL con su punto, y bajo él un rótulo de capítulo en versalitas espaciadas y en color ("THE DEFAULT", "IT JUST WORKS", "OPEN SOURCE", "WHERE IT STOPS", "THE INFRASTRUCTURE", "SECURITY"...). Cambia en cada escena.
- **Presentador:** Rick de cuerpo entero, a la izquierda, con una tablet. Aparece en el gancho, al abrir cada capítulo y en las frases grandes (COMPATIBILITY, CONTROL, "$0", "SO WHICH ONE IS BETTER?", cierre). Desaparece cuando la pantalla es una interfaz o una lista.
- **Títulos grandes:** sans pesada, a la derecha del presentador, con una palabra en color ("Is Linux *actually* better than Windows?", "THINGS JUST WORK", "COMPATIBILITY", "CONTROL", "ALREADY LINUX", "THAT'S FALSE", "THAT IMPORTANT").
- **Subtítulos:** abajo, en una caja oscura, 3 a 4 palabras, con la palabra dicha en blanco y el resto en gris.
- **Interfaces recreadas:** menú Inicio de Windows 11, Windows Update ("Restarting in 14:56"), Administrador de tareas con servicios en segundo plano, ajustes de privacidad, terminales (código del kernel, ssh a un servidor Ubuntu, `uname -a` dentro de WSL), un instalador lado a lado Windows / Linux, Steam con Proton.
- **Fotos:** impresora, mouse gamer, adaptador Wi-Fi USB, pasillo de centro de datos, rack de servidores; capturas de escritorios de Ubuntu, Fedora, Linux Mint y Arch; una escena de juego.
- **Logos:** Windows, Tux, Ubuntu, Fedora, Mint, Arch, Adobe Creative Cloud, Steam.
- **Densidad:** media. Una tarjeta o lista protagonista, y 2 a 4 chips o rótulos chicos. Las listas se encienden fila por fila con la voz.

## Estructura, con tiempos del original

| s | Beat | Lo que se ve |
|---|---|---|
| 0 a 9 | Gancho: ¿Linux es de verdad mejor que Windows? Los de Linux dicen que sí; los de Windows, que es trabajo extra. La respuesta: optimizan para usuarios distintos | Monitor partido en dos: Windows (azul) y Linux (naranja); cada lado se enciende con su chip "YES" / "EXTRA WORK"; dos tarjetas "WANTS: it to just work" / "WANTS: to decide everything" |
| 9 a 17 | Capítulo 1, Windows: hecho para ser el escritorio por defecto de casi todos | "Windows 11" en el monitor; menú Inicio recreado; contador 36 % → 71 % "of desktop machines run Windows" |
| 17 a 22 | Instalas, conectas, descargas, juegas: funciona | Checklist de 4 pasos que se enciende fila por fila (SETUP, DRIVER, EXE, STEAM); "THINGS JUST WORK" con 4 checks |
| 22 a 30 | La compatibilidad es su mayor ventaja: juegos, apps de negocio, drivers, periféricos, herramientas de empresa; impresora, mouse o programa contable: Windows es lo primero que pensó el fabricante | "COMPATIBILITY" enorme; lista "DAY ONE"; fotos de impresora y mouse; factura de contabilidad; tres tarjetas "Works with Windows"; fila de iconos de apps |
| 30 a 48 | Pero tiene un costo: es propietario, no controlas todo, Microsoft decide los valores por defecto; actualizaciones agresivas, servicios en segundo plano, apps preinstaladas, telemetría y, según edición y región, publicidad dentro del sistema | Chips "Convenient / Trade-offs"; código cerrado; ajustes "WHO SETS THE DEFAULTS" (Startup apps, Telemetry, Recommended content: "Managed by admin"); Windows Update con cuenta regresiva; Administrador de tareas; chips de apps preinstaladas; menú Inicio con "Try Game Pass"; barra "WINDOWS · FRICTION" |
| 48 a 66 | Capítulo 2, Linux: lo opuesto; código abierto y, en vez de un escritorio, distribuciones (Ubuntu, Fedora, Mint, Arch); cada una junta el kernel con su gestor de paquetes, escritorio y software | "Almost the opposite approach"; código del kernel legible ("you can read every line of this"); chips de distros; cuatro capturas de escritorio; capas "WHAT A DISTRO IS" (kernel compartido abajo); instalador de un editor de texto lado a lado |
| 66 a 76 | Control ridículo: ¿no te gusta el escritorio o el explorador? Lo cambias; casi nada corriendo o todo personalizado; y suele ser gratis | "CONTROL" enorme; capas intercambiables (SWAP); escritorio que se reemplaza; contador de procesos al arrancar 148 → 31; "$0 usually free" |
| 76 a 99 | La flexibilidad cuesta: a veces tu app no existe (Adobe, herramientas profesionales); los juegos mejoraron con Proton, pero algunos antitrampas fallan; el hardware común funciona, pero un Wi-Fi raro o un RGB con drivers solo de Windows vuelven Linux un proyecto de investigación | Grilla de apps con "NO LINUX BUILD"; tabla Windows / macOS / Linux de Adobe CC, Office, Final Cut, DaVinci; Steam lado a lado ("runs natively" / "runs through Proton"); "kernel anti-cheat: may not run"; grilla de hardware DETECTED con el Wi-Fi en "NO DRIVER"; foto del adaptador; terminal buscando el driver; barra "LINUX · FRICTION" igual a la de Windows |
| 99 a 117 | Capítulo 3, para developers: casi toda la infraestructura donde corre tu código ya es Linux (servidores, Docker, Kubernetes, web); SSH, paquetes, shells y compiladores se sienten nativos; por eso Windows agregó WSL | Pasillo de centro de datos con chips "your laptop → CI runner → container → server"; "ALREADY LINUX"; rack con lista de 4 checks LINUX; terminal ssh a Ubuntu; "WSL · Windows Subsystem for Linux · Microsoft shipped Linux inside Windows"; terminal WSL con `uname -a`; "Linux tooling became THAT IMPORTANT" |
| 117 a 133 | Seguridad: "Linux no tiene virus" es falso; pero permisos, repositorios, menor cuota de escritorio y desarrollo abierto crean otro entorno; Windows recibe más malware porque hay muchísimas máquinas | "SECURITY"; cita "Linux doesn't get viruses" tachada; "THAT'S FALSE"; lista de 4 diferencias que se encienden ("Not safer. Different."); grilla de cuadritos: muchos de Windows, pocos de Linux |
| 133 a 150 | ¿Cuál es mejor? Compatibilidad, juegos, software comercial y algo familiar: Windows es la opción segura. Control, personalización, herramientas Unix o un sistema liviano: Linux es muy atractivo | "SO WHICH ONE IS BETTER?"; dos columnas "CHOOSE WINDOWS IF" / "CHOOSE LINUX IF" que se encienden por turno con su sello |
| 150 a 158 | Los principiantes no tienen que empezar por Arch: Mint o Ubuntu se sienten normales | Instalador de Arch: "You don't have to start here"; capturas de Mint y Ubuntu: "Surprisingly normal" |
| 158 a 166 | Cierre: no es bueno contra malo; es: ¿quieres que el sistema decida por ti o decidir tú? | "Windows GOOD vs Linux BAD" tachado; "Two different answers to two different questions"; "It's this." con las dos opciones, que se encienden por turno, y el punto del dial entre las dos |

## Cuadros del aspecto

0, 3, 12, 21, 24, 40, 52, 69, 76, 88, 106, 112, 129, 138, 147, 160 (en las hojas, cuadro = segundo + 1).

## Lo que no se copia

- Rick (el personaje): va el avatar de @jacket.dev.
- Las capturas reales de escritorios y fotos del referente: se recrean o se generan (ver la puerta A).
- Ninguna frase textual.

## Datos del referente

Solo estos pueden ir en pantalla: Windows corre en el 71 % de las computadoras de escritorio (el contador pasa por 36 %); procesos al arrancar 148 → 125 → 31 (ilustrativo); Linux "usualmente gratis"; distros Ubuntu, Fedora, Linux Mint, Arch; Adobe Creative Cloud, Microsoft Office, Final Cut Pro y DaVinci Resolve en la tabla de plataformas; Steam y Proton; antitrampas a nivel de kernel; WSL; SSH, gestores de paquetes, shells y compiladores; servidores en la nube, Docker, Kubernetes, servidores web.
