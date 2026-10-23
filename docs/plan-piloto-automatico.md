# Plan: jacket.dev en piloto automático (22 de octubre de 2026)

Sale del [análisis de Reels del 22 de octubre](analisis-reels-2026-10-22.md) y de lo que Jeremy decidió ese día. **El objetivo:** que jacket.dev publique un Reel por día al nivel de los referentes, con poco tiempo de Jeremy, y que todo lo que se construya sirva también para la cuenta de negocios. Cuando esté listo, el foco pasa a la cuenta de negocios y a conseguir clientes.

## Lo que decidió Jeremy

| Tema | Decisión |
|---|---|
| Núcleo del motor | Sí al cambio 1: un escenario que dura todo el video, con cámara |
| Avatar | Su ilustración tal cual, con boca sincronizada con la voz, parpadeo y respiración. Va de medio cuerpo. Las poses de cuerpo entero quedan para después |
| Polerón del avatar | Una versión por cuenta: jacket.dev lleva "CLAUDE CODE", como su foto, y la de negocios lleva "IA" (el cian es una sugerencia de Jeremy, se ajusta en diseño) |
| Cadencia | Un Reel por día, a las 19:00 de Lima |
| Publicación | Jeremy lo pide cada día ("publica el de hoy") y el agente lo publica. No hay tarea programada |
| Superpowers | Publicado a mano el 21 de octubre. Quedó registrado en `publications.jsonl` y con la puerta B en `video.json` |

## Qué es "piloto automático" aquí

Las dos puertas siguen siendo de Jeremy. Lo que cambia es que se trabaja por semana y en lotes:

| Cuándo | Quién | Qué |
|---|---|---|
| Lunes | Agente | Radar y calendario de 7 Reels con `ig-plan`: 2 de cada 3 sobre tecnología que todos tocan y 1 de nicho, sin temas recientes de Rick ni de la cuenta |
| Lunes | Jeremy | **Puerta A en lote:** una sola hoja con los 7 guiones, sus mundos y sus ganchos |
| Lunes a miércoles | Agente | Producción: capturas, storyboard, voz, render, inspector y crítico ciego |
| Miércoles | Jeremy | **Puerta B en lote:** una sola hoja con los 7 videos |
| Cada día, 19:00 | Jeremy y agente | Jeremy escribe "publica el de hoy" y el agente publica el siguiente de la cola. Si quiere, Jeremy comparte el Reel en su historia desde la app: es un toque |
| Domingo | Agente | Métricas a los 2 y 7 días en `video-metrics.json`. Una vez al mes, `ig-audit` y `ig-viral` |

Lo que hace Jeremy por semana: 2 revisiones y 7 mensajes. Lo demás corre solo.

## Fases

Cada fase termina cuando una pieza de prueba real la usa, el inspector sale limpio y pasan `npm run typecheck` y `npm test`. Los Reels ya publicados no se tocan.

**Pieza de prueba propuesta:** "Iniciar sesión con Google no le da tu contraseña a nadie", que ya estaba en la [propuesta](propuesta-reels-jacket.md). Es tecnología que todos tocan, explicada por dentro. Su mundo sería un hotel: la recepción (Google) entrega una tarjeta (el token) que abre una sola puerta. Se decide en la puerta A.

### Fase 0: ordenar la casa

- [x] Superpowers marcado como publicado.
- [x] **Perfil con `ig-profile`:** la bio nueva (con la tilde de "más"), los 3 fijados, las 4 destacadas y el enlace están en [perfil-jacket.md](perfil-jacket.md) desde el 22 de octubre. Falta que Jeremy los aplique en la app: el agente no escribe en Instagram. Son 30 de los 94 puntos.
- [ ] **Métricas:** los Insights de los 6 Reels publicados en `video-metrics.json`, con capturas de Jeremy o leyéndolos en su Chrome si él lo autoriza.

### Fase 1: escenario y cámara (núcleo)

**Hecha el 22 de octubre de 2026.** `PieceVideo.tsx` tiene dos caminos: láminas (como antes) y escenario. La cámara es una función pura en `kit/camera.ts`, con tests. `<Spot>`, `useStage()` y `useStageCue()` están en `@motor/video`. El inspector entiende el texto del mundo. Se probó con un storyboard de una pieza de demostración local (`content/zz-escenario-demo`, fuera de git), y el del git push confirmó que las piezas sin escenario siguen renderizando. Falta un render con voz real, que llega con la pieza de prueba. Lo que se hizo distinto del borrador de abajo: la cámara usa una curva suave (ease in-out) en vez de un `spring`, porque es determinista y se prueba sin navegador. Además, `<Spot>` ya existe (estaba en la fase 2).

El borrador:

- **`defineVideo({ stage })`:** un componente que se monta una sola vez, fuera de `<Series>`, y vive todo el video. Las escenas pasan a ser estados de ese escenario.
- **`useStage()`:** dice la escena actual, su índice, el segundo global, el segundo dentro de la escena y su avance. Con **`useStageCue(sceneId, word)`**, el escenario sabe en qué segundo global se dice una palabra de cualquier escena.
- **`SceneDef.camera`:** `{ focus, zoom }`. `focus` es el id de un `<Spot>` (una zona con nombre dentro del escenario) o un punto.
- **`<Camera>`:** pasa del encuadre de una escena al de la siguiente con un `spring`, y entre medio deriva despacio, para que la imagen nunca quede quieta. La matemática va en una función pura, con tests.
- **El marco** (pestaña, puntos y firma) también se monta una sola vez cuando hay escenario: no se rearma en cada escena.
- **`Visual` pasa a ser opcional** cuando hay escenario. Si está, va encima, para los rótulos propios de una escena.
- **Si un video mezcla escenario y láminas,** el paso de uno a otro sale escalonado (sale lo viejo y entra lo nuevo) o pasa por el fondo. Nunca un fundido de dos composiciones cargadas.
- **Compatibilidad:** un `video.tsx` sin `stage` se ve igual que hoy.
- **Revisar** `video:storyboard`, el probe y la regla de composición (la franja vacía bajo el dibujo) con el escenario, porque esa regla supone una lámina con título.

Tamaño: grande.

### Fase 2: el kit del mundo

**Hecha el 22 de octubre de 2026.** `<Label>`, `<Board>` y el medidor del HUD (`defineVideo({ meter })`, con `counter`, `money`, `bar` y `slots`) están en `@motor/video`, con su lógica pura en `kit/board.ts` y `kit/meter.ts` y sus tests. Se probaron en el storyboard de la demo: el medidor llena sus casillas en la palabra de cada piso, los rótulos aparecen en su palabra y el plano dibuja nodos, flechas, un paquete y la X roja. El rojo de `fail` y `alert` es fijo (`red-600`), no sale de la paleta: los colores con función de cada pieza quedan para cuando una lo pida.

El borrador:

- ~~**`<Spot>`**~~: hecho en la fase 1.
- **`<Board>`:** un plano que crece. Nodos y flechas que aparecen por cue, cambian de estado (`ok`, `busy`, `fail` con una X roja, `off`), se reacomodan con un `spring` (de 1 servidor a 4) y llevan paquetes que viajan por las flechas.
- **`<Meter>`:** el medidor del HUD, que vive todo el video. Su valor cambia en palabras de cualquier escena (`defineVideo({ meter })`) y tiene cuatro formas: contador (1 → 50 millones), barra o batería, casillas que se llenan (1/5) y cuenta en dinero.
- **`<Label>`:** rótulos de 1 a 3 palabras pegados a un `<Spot>`.

Tamaño: mediano.

### Fase 3: láminas de mundo

- **Un estilo fijo por cuenta** en `accounts/<cuenta>.json → world.style`: un trozo de prompt (por ejemplo, isométrico, limpio, con la paleta de la pieza) que `video:image` agrega siempre, para que todas las ilustraciones parezcan del mismo mundo.
- **Capas:** el fondo y los objetos se generan por separado (`--chroma`, que ya existe) para que la cámara les dé profundidad.
- **`<Plate>`:** pone esas imágenes en el escenario con parallax bajo la cámara.
- **Reglas:** nada de logos ni interfaces de marcas dentro de una imagen generada. Los logos van aparte, con `<Logo>` y el archivo oficial, y nada se pone encima de un logo. Cada imagen queda anotada en `generated.json`, como hoy.

Tamaño: mediano.

### Fase 4: el avatar

- **La base:** la ilustración original de Jeremy, sin fondo. La foto de perfil tiene un halo de color que hay que quitar, así que conviene el archivo original en la mayor resolución.
- **Capas:** el cuerpo y la cabeza sin boca ni ojos, los ojos abiertos y cerrados, y las 9 bocas de Rhubarb (A a H y X), dibujadas en el mismo trazo negro de la ilustración. Con `assets/avatar/manifest.json` (hoy está el ejemplo).
- **El polerón por cuenta:** se borra una vez el texto del polerón de la ilustración, y las letras pasan a una capa propia con su color: "CLAUDE CODE" en `dev` e "IA" en `negocios`. Así cambiar el texto o el color no pide otra ilustración.
- **Sincronía labial:** `video:prepare` corre [Rhubarb Lip Sync](https://github.com/DanielSWolf/rhubarb-lip-sync) (MIT) sobre la voz de cada escena, con su reconocedor fonético, que sirve para español. Las bocas por tiempo quedan en `timeline.json`. Rhubarb se baja por máquina a `.cache/`, como whisper.
- **Movimiento:** parpadeo cada 3 a 5 s (con semilla fija, para que el render sea determinista), respiración leve y un pequeño movimiento de cabeza en las palabras con acento.
- **`<Avatar>`:** de medio cuerpo, sobre el escenario, en una esquina que respete el margen de 36 px. Cada escena puede ocultarlo cuando necesite todo el espacio.
- **Antes de la fase:** una prueba corta de Rhubarb con una escena ya grabada, para confirmar que la sincronía en español se ve bien.

Tamaño: mediano. Necesita el archivo original de Jeremy.

### Fase 5: reglas de guion, inspector y ganchos

**Hecha el 22 de octubre de 2026,** con un cambio respecto del borrador: la portada no se hornea como cuadro 0 del MP4. `video:publicar` extrae el cuadro de `cover` y lo sube como portada, que es lo que muestran la grilla y el Reel. Hornearlo cambiaría el sha256 del video aprobado sin ganar nada. Las piezas viejas ahora reciben los avisos nuevos (más palabras y título en la escena 1): la vara subió para todas.

El borrador:

- **`video.json`:** dos campos nuevos. `world` es la metáfora física de la pieza en una línea. `meter` es lo que está en juego, con su valor inicial y final. Los dos se aprueban en la puerta A, y la hoja de la puerta A los muestra.
- **`skills/video-es`:**
  - El primer cuadro es un objeto que se mueve, no un título.
  - El medidor se planta en el gancho y se paga en el cierre.
  - El cierre se puede capturar.
  - Se suman las reglas tomadas de `brag`: unos 0,3 s por palabra desde que la línea está completa, cosas que aparecen una por una, cualquier cuadro se puede publicar, revisar cuadros a mitad de transición y los efectos en la tonalidad de la música.
- **Inspector:**
  - Aviso si la imagen queda quieta más de 2 s (hoy son 4).
  - Aviso si hay más de 6 palabras fuera de los subtítulos y de `data-ui`.
  - Aviso si la escena 1 abre con un título como elemento principal.
  - La hoja de revisión suma cuadros a mitad de cada transición.
- **Portada:** el cuadro más fuerte, ya asentado, horneado como cuadro 0 (`video.json → cover`). Hoy se usa el cuadro 1.
- **Ganchos:** la candidata a fórmula 30 ("niega lo obvio y cámbialo por una metáfora") va en `ganchos-es.json`, marcada como en prueba.

La vara sube para todas las piezas nuevas; no se ajusta para que una pase.

### Fase 6: la rutina

- **`video:publicar -- --next`:** publica la pieza más antigua que tenga la puerta B y no esté en `publications.jsonl`, y antes dice cuál es. Es lo que corre el agente cuando Jeremy escribe "publica el de hoy".
- **`video:semana`:** arma una sola hoja de puerta A con los guiones de la semana y, después, una sola hoja de puerta B con los videos.
- **`workflows/semana.md`:** la rutina de la tabla de arriba, paso a paso.
- **El publisher:** con una publicación diaria, que se rompa por un cambio de Instagram pasa a ser grave. Los dos primeros intentos del de Scion fallaron por timeout. Hay que revisar los selectores de `instagram.selectors.ts` y que `--ensayo` avise antes de las 19:00 si algo cambió.
- **La cadencia diaria empieza aquí.** Mientras se construyen las fases 1 a 5, se publican las piezas de prueba a medida que están listas.

Tamaño: chico.

### Fase 7, después: la cuenta de negocios

Usa todo lo anterior: el motor, el escenario, el kit, las láminas de mundo y el avatar con "IA" en el polerón. Le falta lo que no es del motor: el usuario, la oferta, la voz (`accounts/negocios.json → voice` está vacío), el rubro con `radar-oportunidades` y los contactos con `motor-prospeccion`. Se planifica cuando termine la fase 6.

## Orden

```
Fase 0 ─┐
Fase 5 ─┼─► Fase 1 ─► Fase 2 ─► Fase 3 ─► Fase 6 ─► Fase 7
        └───────────► Fase 4 (después de la 1: el avatar vive en una capa del escenario)
```

La prueba de Rhubarb puede ir al principio, porque es la parte con más riesgo del avatar.

## Riesgos

- **Más trabajo por pieza en `video.tsx`.** Se baja con el kit y con una pieza de ejemplo completa, como hoy pasa con la del `git push`.
- **El render tarda más** con escenario, láminas y avatar. Se mide en la pieza de prueba.
- **Rhubarb en español** puede no sincronizar bien. Por eso va la prueba primero; el plan B es una boca que se abre según el volumen de la voz.
- **El publisher y los cambios de Instagram.** Se trata en la fase 6.
- **Repo público.** La ilustración es de Jeremy y quedaría a la vista en el repo. Las imágenes generadas y los archivos MIT se pueden commitear. Nada de terceros sin licencia.

## Lo que hace falta de Jeremy

- El archivo original de la ilustración, en la mayor resolución que tengas, y tu OK para que quede en el repo público.
- Aplicar en la app los textos del perfil cuando estén listos (fase 0).
- Los Insights de los 6 Reels: capturas, o tu OK para leerlos desde tu Chrome.
- El sí o el no a la pieza de prueba en la puerta A.
