# Referente: por qué los devs prefieren Mac, de @rick.theengineer

Análisis hecho sobre el archivo que pasó Jeremy (`Downloads/reel.mp4`), sin el reproductor incrustado: la voz transcrita con whisper.cpp (`out/referente-transcripcion.srt`) y una hoja de cuadros cada 4 s (`out/referente-hoja.png`). Los dos quedan en `out/`, que no entra en git: son de otra cuenta.

## Ficha

- **Duración:** 158,8 s, 720×1280, 30 fps. `target` 158,8 (±10 %: 143 a 175 s).
- **Idioma:** inglés, unas 430 palabras (2,7 por segundo).
- **Tesis:** los devs eligen Mac por cuatro o cinco razones concretas (Unix, Apple Silicon, ecosistema, experiencia y coherencia), pero no es mejor para todos: el mejor sistema es el que encaja con tus herramientas, tu forma de trabajar y lo que construyes.

## Estructura, con tiempos del original

| s | Beat | Lo que se ve |
|---|---|---|
| 0 a 11 | Gancho: por qué Mac y no Windows; startups llenas de MacBooks; ¿mejor o marca? | Marco de juego de pelea: barras de vida, P1 Mac contra P2 Windows, "VS", "WHY?", "ROUND 1" |
| 11 a 34 | Unix: macOS sobre Unix, como Linux; el software corre en Linux; terminal, Homebrew, lenguajes | Escritorio macOS oscuro: Terminal con `uname` → Darwin, ssh a Ubuntu, consola de nube, Docker, archivos de 4 lenguajes |
| 34 a 41 | Windows con WSL; macOS lo trae de fábrica | Microsoft Learn con `wsl --install`, tarjeta WSL |
| 41 a 64 | Hardware: Apple Silicon, un solo chip, rendimiento por vatio, batería | Acerca de esta Mac (M4 Pro, 24 GB, Sequoia 15.4), resumen del hardware, "Performance per watt.", Monitor de Actividad, batería |
| 64 a 78 | Ecosistema: Xcode solo en macOS; plataformas de Apple | Xcode con SwiftUI, iPhone, ficha de la App Store, plantillas iOS a visionOS |
| 78 a 96 | Experiencia y gusto | Launchpad, `brew list`, servidor local, Rick con un corazón, Tiempo en pantalla |
| 96 a 103 | Coherencia | Acerca de, AirPods y Studio Display conectados, "Drivers to install: none" |
| 103 a 121 | Contras y Docker en una VM | Configurador de compra, contenedores linux/amd64, `uname -r` → linuxkit, cajas anidadas |
| 121 a 134 | Windows y Linux | "P2 Windows", "Move list", "New challenger: Linux" (marco de pelea) |
| 134 a 147 | Modelo mental | Nota con 5 razones que se marcan y "¿Universalmente mejor?" tachado |
| 147 a 158 | Cierre | Tres tarjetas iguales, "No knockout", "The best OS is the one that fits" con 3 checks y "3 for 3" |

## Aspecto

- Escritorio macOS oscuro con fondo de ondas sedosas, barra de menú con la app al frente, tres carpetas a la izquierda y el Dock abajo.
- Rick de cuerpo entero a la izquierda, casi todo el video; las ventanas a la derecha.
- Subtítulos con la palabra dicha en una caja azul.
- Ventanas reales de macOS, recreadas, con datos de ejemplo.

## Lo que no se copia (puerta A)

Todo el marco de juego de pelea: barras de vida, P1/P2, VS, rounds, "New challenger", "No knockout" y "Move list".
