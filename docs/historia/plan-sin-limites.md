# Plan: quitar los límites para Reels como los de Rick

Escrito el 27 de octubre de 2026, después de analizar el Reel de @rick.theengineer sobre MCP y ACP ([De48CTVsT7o](https://www.instagram.com/p/De48CTVsT7o/), 141 s). Jeremy pidió un plan para quitar lo que impide hacer un video así, incluidas las reglas que lo frenan. Aprobó las decisiones de la sección 5 ese mismo día.

**Estado (27 de octubre de 2026):**
- **Hechas, sin commit:** la fase 0 (la regla 6 en los seis archivos), la 1 (`curve`, `glow`, `pulse` y `fan` en el `<Board>`), la 2 (la estimación de siglas y el `tempo` por pieza) y la 3 (los logos en `assets/catalog.json` como `type: "logo"`, `carrusel:logo add` y seis logos).
- **Pruebas:** pasan las 188.
- **Sin ver todavía en un render:** las curvas del `<Board>`. Lo hace el storyboard del Reel de ACP.
- **Pendientes:** la fase 4 (interfaces recreadas) y la 5 (grabaciones).

## 1. Qué limita hoy

| Límite | De dónde viene | Qué se pierde |
|---|---|---|
| Faltan logos: Slack, OpenAI/Codex, Zed, Goose, OpenCode y T3 Code. Tampoco está la mascota de Claude Code | `<Logo>` solo conoce Simple Icons, y la regla 6 prohíbe dibujar logos o mascotas | Íconos genéricos donde el público espera la marca |
| No se pueden copiar interfaces de marca: la terminal de Claude Code, el panel de Zed, T3 Code | `skills/video-es` y `workflows/video.md`: "nunca como copia de su app" | Ventanas genéricas que no se reconocen a primera vista |
| Las flechas del `<Board>` son rectas | `kit/board.ts` solo une dos puntos con una recta | Las curvas con brillo y el pulso que las recorre, que es la firma visual del Reel |
| No se puede meter una grabación de pantalla | El kit no tiene un componente de video; `captures.json` solo guarda el texto que imprime un comando | Lo real que se mueve: un agente trabajando, un editor |
| La voz deletrea las siglas despacio y la estimación no lo sabe | `WORDS_PER_SECOND = 2.7` cuenta "MCP" como una palabra, pero la voz dice "eme-ce-pe" | En sistemas de archivos se estimaron 143 s y la voz duró 165 s, así que hubo que recortar después de la puerta A |

## 2. Cambios de reglas (propuestos)

Las reglas actuales y dónde están:
- `AGENTS.md`, regla 6: "Nunca dibujes ni imites logos, mascotas o personajes de marcas".
- `skills/carrusel-taste/SKILL.md`, línea 48: lo mismo para el carrusel.
- `skills/video-es/SKILL.md`, líneas 60, 190, 203 y 217: "Genéricos y propios", "Nunca generes logos, mascotas…", "el archivo oficial sin modificar" y "Nada va encima de un logo".
- `workflows/video.md`, línea 115: "Son genéricos y propios".
- `docs/anti-slop.md`, línea 23: los logos dibujados o imitados cuentan como slop.

Redacción propuesta:

> **6. Marcas, fieles al original.** Un logo o una mascota va con su archivo oficial, o con uno de una fuente confiable: Simple Icons, el kit de prensa, el repositorio oficial o una librería (sección 3.1). Si no hay archivo y recrearlo es muy difícil, se le pide a la persona que lo agregue. Si no, se recrea, idéntico al original y sin deformarlo. Una interfaz real (Claude Code, Zed, VS Code, T3 Code) se puede recrear para explicarla, igual a la versión actual. Lo que muestra por dentro es real (sección 3.2) o lleva el rótulo "Ejemplo ilustrativo". Nunca se sugiere un patrocinio ni se usa una marca para burlarse de ella.

Lo que **no** cambia:
- **Regla 3, no inventar:** una interfaz recreada tiene que ser la real, no una parecida.
- **La confidencialidad (regla 10) y los datos con fuente (reglas 1 y 2).**
- **El repo público:** los archivos de terceros (logos, capturas de referencia, grabaciones) quedan fuera de git, con un manifiesto y su descarga, como `assets/catalog.json`.
- **La marca propia en las réplicas:** se copian la estructura y el nivel, no el look (decisión del 27 de octubre de 2026).

El riesgo, dicho una vez: mostrar el logo y la interfaz de un producto para explicarlo es el uso nominativo que hacen todas las cuentas de este nicho. La mascota es lo más delicado, porque un personaje tiene derechos propios. Por eso la propuesta la deja solo con archivo oficial o captura real.

## 3. Cambios del motor

### 3.1 Logos oficiales fuera de Simple Icons
- **El catálogo:** `assets/logos/catalog.json`. Cada logo lleva su id, el nombre, la URL de origen (kit de prensa o repositorio), la URL de sus reglas de uso, `checkedAt` y el `sha256`.
- **Dónde quedan los archivos:** en `.cache/logos/`, fuera de git.
- **Comando:** `npm run carrusel:logo -- add <id> --url <svg> --guias <url>` baja el archivo, le calcula el hash y lo suma al catálogo, igual que `video:asset add`.
- **`<Logo slug>`:** busca primero en Simple Icons y después en el catálogo, en el carrusel (`assets-node.ts`) y en el video (`assets-browser.ts`, que copia los archivos a la carpeta pública en `stageOf`).
- **Pruebas:** la resolución en orden, el error claro cuando el logo no está y la verificación del hash.
- **Los primeros:** Slack, OpenAI, Zed, Goose, OpenCode y T3 Code, de sus kits o repositorios.

### 3.2 Interfaces reales recreadas, alimentadas con salidas reales
- **Componentes nuevos del kit** (`kit/apps.tsx`):
  - `ClaudeCodeTui`: la caja de bienvenida, el prompt, las llamadas a herramientas (Read, Edit, Bash), el diff y la línea de estado;
  - `EditorWindow`: árbol de archivos, pestañas y panel del agente, para Zed o VS Code;
  - `AppWindow`, con la barra de una app de escritorio.
- **Captura de referencia:** cada componente se arma desde una captura guardada en `.cache/referencias-ui/<app>/<versión>.png`, con la fecha en un manifiesto. El componente dice la versión que copia.
- **El contenido sale de una corrida real:**
  - `captures.json` acepta un paso `claude -p "<tarea>" --output-format stream-json` en un proyecto de prueba, y `ClaudeCodeTui` muestra esa sesión tal cual (herramientas, archivos, diff);
  - para ACP, una captura corre un cliente mínimo contra el adaptador de Claude Code y guarda los mensajes JSON-RPC que viajan de verdad (`initialize`, `session/new`, `session/prompt`, `session/update`, `session/request_permission`). Hay que confirmar en la documentación de agentclientprotocol.com el nombre exacto del paquete del adaptador;
  - las corridas usan la sesión de Claude Code de Jeremy, y la captura queda con su fecha, como hoy.

### 3.3 Líneas curvas con brillo y pulso en el `<Board>`
- **`BoardEdge`:** suma `curve` (cuánto se dobla), `glow` (el color del halo) y `pulse` (una luz que recorre la línea cada tantos segundos).
- **Los `packets`:** siguen la curva, no la recta.
- **Un ayudante `fan`:** abre un abanico de N nodos hacia uno, como "GitHub, Postgres, Slack y Figma hacia el agente".
- **Pruebas:** la geometría de la curva y la posición del paquete según su avance.

### 3.4 Grabaciones de pantalla en el video
- **`<Clip src from to>`:** un componente del kit con el video de Remotion, para grabaciones en `content/<pieza>/clips/`.
- **El inspector:** trata el clip como interfaz y no revisa su texto.
- **`npm run video:record -- content/<pieza> --name <n> --window "<título>"`:** graba una ventana con ffmpeg (`gdigrab` en Windows) mientras Jeremy o el agente usan la app.
- **Las grabaciones de apps de terceros** quedan fuera de git, como las capturas de referencia.

### 3.5 Duración real desde la puerta A
- **La estimación cuenta las siglas como lo que suenan:** una palabra en mayúsculas o con dígitos (MCP, FAT32, JSON-RPC) suma unos 0,3 s por letra o dígito.
- **La calibración:** se ajusta con los Reels ya hechos, porque el timeline guarda lo que duró la voz real.
- **Pronunciación (a decidir):** ElevenLabs acepta diccionarios de pronunciación con alias; hay que confirmar que el plan de la cuenta lo permite. Sirve para leer "JSON" como "yéison" o "exFAT" como "ex fat".
- **`tempo` por pieza (a decidir):** el `tempo` es de la cuenta (1,12, en `docs/direccion-reels.md`). Darle un `tempo` a una pieza cambia esa página, así que necesita el sí de Jeremy.

## 4. Orden

| Fase | Qué | Tamaño | Cómo se prueba |
|---|---|---|---|
| 0 | Cambiar las reglas de la sección 2 en los seis archivos | Chico | Releer y `npm test` |
| 1 | Las curvas del `<Board>` (3.3) | Chico | Pruebas y un storyboard de prueba en `content/zz-*` |
| 2 | La estimación de las siglas (3.5) | Chico | Pruebas comparadas con las duraciones reales de sistemas de archivos y de tokens |
| 3 | El catálogo de logos (3.1) | Mediano | Pruebas y los seis logos que faltan en un storyboard |
| 4 | Las interfaces recreadas y sus capturas reales (3.2) | Grande | Una sesión real de `claude -p` y de ACP mostrada en el storyboard |
| 5 | `<Clip>` y `video:record` (3.4) | Mediano | Una grabación corta en un storyboard |
| 6 | El Reel de ACP con todo lo anterior | La pieza | Puertas A y B |

Las fases 1 a 3 ya alcanzan para un Reel de ACP muy cercano al de Rick. La 4 es la que más lo acerca, y la 5 puede esperar.

## 5. Decisiones de Jeremy (27 de octubre de 2026)

1. **La regla 6:** aprobada con la redacción de la sección 2, con el cambio del punto 2 para las mascotas.
2. **Mascotas y logos que faltan, en este orden:**
   1. la imagen oficial, o una de una fuente confiable: una librería, el repositorio del proyecto, el kit de prensa;
   2. si no hay y recrearla es muy difícil, se le pide a Jeremy que agregue el archivo;
   3. si no, se recrea, fiel al original.
3. **El catálogo de logos se commitea sin los archivos:** el manifiesto va en git y la descarga a `.cache/`, como los efectos.
4. **Corridas reales con su sesión de Claude Code, solo si hacen falta de verdad.** En la mayoría de los casos, la interfaz y los mensajes se recrean a partir de la documentación y la versión real, y se rotulan como ejemplo.
5. **El `tempo` por pieza entra.** Sirve para llegar a la duración de una réplica sin recortar contenido.
6. **Las grabaciones de pantalla (fase 5) van después** del Reel de ACP.
