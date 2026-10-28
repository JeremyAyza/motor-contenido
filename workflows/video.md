# Flujo: video (en construcción)

Es un flujo separado del carrusel: comparte la marca (`packages/brand`), las primitivas (`@motor/ui`) y el avatar (`assets/avatar`). El plan completo está en [docs/plan-videos.md](../docs/plan-videos.md). Este archivo dice lo que ya funciona.

## Una sesión por fase

Lo que gasta la cuota no es lo que el agente escribe, sino el contexto que arrastra: el 27 de octubre de 2026, dos Reels en una sola sesión promediaron 537 k tokens por llamada, y el 75 % del costo fue releerlos ([docs/plan-consumo-y-tiempo.md](../docs/plan-consumo-y-tiempo.md)). Por eso cada pieza va en sesiones cortas:

| Fase | Pasos | Termina en |
|---|---|---|
| A. Guion | tema, fuentes, `video.json`, storyboard, crítico del guion | la puerta A |
| B. Video | `video.tsx` final, voz, render | el primer render limpio del inspector |
| C. Crítica | crítico del video, arreglos | la puerta B |

- **Una pieza por sesión, y una fase por sesión.** Si en medio de una pieza hace falta cambiar el motor (el kit, el inspector, un comando), se anota en `estado.md` y se hace en su propia sesión, que termina con `npm test` y un commit.
- **El traspaso es `content/<pieza>/estado.md`,** no la conversación. Antes de cerrar una fase, el agente lo actualiza con:
  - la fase en que quedó y el paso siguiente;
  - las decisiones de Jeremy, con sus palabras cuando importan ("la burbuja le pareció rara");
  - lo que se probó y no funcionó, y por qué;
  - lo que quedó pendiente para el motor.

  `video.json`, `facts.json` y `video.tsx` guardan el resto: no se repite ahí.
- **La sesión siguiente empieza leyendo** `AGENTS.md`, [docs/direccion-reels.md](../docs/direccion-reels.md), esta guía y `estado.md`, y nada más de la conversación anterior.
- **Lo que no es creativo se delega:** las fuentes, el análisis de un referente y los arreglos mecánicos del inspector van a un subagente o a `agy` ([docs/plan-consumo-y-tiempo.md](../docs/plan-consumo-y-tiempo.md), 1.2). La tesis, los ganchos, el guion, la dirección de arte y `video.tsx` los escribe el agente principal.

## Pasos

1. **El guion: `content/<pieza>/video.json`.** Los campos van en inglés y el contenido en español. Lleva:
   - de 1 a 3 ganchos (`hooks`), cada uno con lo que dice la voz (`said`), lo que se ve en pantalla (`onScreen`) y su fórmula de `skills/ig-es/ganchos-es.json`. El primero es el elegido;
   - las escenas (`scenes`): `id`, lo que dice la voz (`say`, escrito para el oído), lo que se ve (`see`, concreto) y el recurso visual (`resource`, de [recursos.json](../skills/carrusel-taste/recursos.json));
   - el texto del post (`caption`), opcional;
   - la dirección de arte (`art`), como `post.json → art`; si falta, se toma la del carrusel de la pieza;
   - el formato (`format`): `corto` (de 30 a 60 s, por defecto), `explicado` (de 75 a 100 s, en prueba; ver [docs/propuesta-reels-jacket.md](../docs/propuesta-reels-jacket.md)) o `largo` (de 90 a 180 s; ver [docs/plan-paridad-rick.md](../docs/plan-paridad-rick.md));
   - el tema (`topic`), en pocas palabras;
   - el mundo (`world`): la metáfora física que dura todo el video, en una línea ("un edificio de tres pisos en corte: tu app, el runtime y el servidor; la grieta está en el del medio");
   - lo que está en juego (`meter`): qué cuenta el medidor del HUD (`label`), su valor en el gancho (`from`) y en el cierre (`to`);
   - la portada (`cover`): la escena con el cuadro más fuerte y, si hace falta, el segundo dentro de ella (`at`). Sin `at`, el final de la escena, cuando ya está completa. Sin `cover`, el cuadro 1;
   - las puertas (`gateA`, `gateB`).

   La primera escena empieza con el gancho elegido. El esquema está en [schemas/video.schema.json](../schemas/video.schema.json) (`npm run video:schema`).
2. **Puerta A:** `npm run video:script -- content/<pieza>`. Valida el guion, estima la duración y deja `out/gate-a.md`, la hoja que lee la persona. Avisa si:
   - el gancho tarda más de 3 s;
   - el texto en pantalla pasa de 6 palabras;
   - el video sale del rango de su formato (`corto`, de 30 a 60 s; `explicado`, de 75 a 100 s; `largo`, de 90 a 180 s);
   - el tema se parece al de una pieza de los últimos 14 días: al referente, repetir un tema a los pocos días le costó 10 veces menos vistas;
   - falta `world`, `meter` o `cover`. Los Reels que funcionan mantienen un mundo y un medidor todo el video ([docs/analisis-reels-2026-10-22.md](../docs/analisis-reels-2026-10-22.md)). La hoja muestra los tres en "Mundo".

   Además corre dos revisiones, y todo lo que avisan entra en la hoja:
   - **Las herramientas de `ig-reel`,** por sus wrappers en español ([skills/ig-es](../skills/ig-es/SKILL.md)):
     - `hookscore_es --video` puntúa lo que dice la voz en cada gancho, y avisa si el elegido saca menos de 50;
     - `beats_es --video` estima el ritmo frase por frase, con la voz de la cuenta (unas 2.7 palabras por segundo, con las pausas). Avisa de las frases de más de 4 s, de tres frases seguidas sin nada concreto y de un final que no repite ninguna palabra del gancho.
   - **La revisión de textos del carrusel** (`skills/ig-es`), sobre el guion y el texto del post: la primera línea, el léxico de relleno, las estructuras de IA y el ritmo de las frases.

   También arma `out/video-critica-ganchos/`: el tema, el público y los ganchos, sin puntajes, para que un contexto nuevo los ordene ([docs/critico-ciego-video.md](../docs/critico-ciego-video.md), "Ganchos"). Ese orden va a la puerta A junto con los avisos.

   **El storyboard** también va a la hoja. `npm run video:storyboard -- content/<pieza>` renderiza los visuales de un primer `video.tsx` con el guion al ritmo estimado de la voz, sin sonido y sin generar voz, y deja `out/storyboard.png` (la portada, el final de cada escena y el medio de cada cambio de escena) y `out/storyboard.mp4`. También corre el inspector sobre esos cuadros. Si la persona cambia el guion, el `video.tsx` se ajusta antes de la voz.

   **El crítico del guion** va después del storyboard: `npm run video:critique -- content/<pieza> --guion --gemini`. Gemini lee lo que se oye y lo que se ve escena por escena, con `storyboard.png`, y escribe `out/video-critica-guion/informe.md` ([docs/critico-ciego-video.md](../docs/critico-ciego-video.md), "Guion"). Encuentra en el papel lo que después cuesta una voz y un render: un repaso largo, una lista que se estira o una parte que no responde al gancho. Su informe va a la puerta A; los arreglos los decide la persona.

   Solo el sí de la persona en el chat aprueba, y el agente lo anota en `video.json → gateA { approved: true, date }`.
3. **Lo que se ve: `content/<pieza>/video.tsx`.** Un primer borrador va antes de la puerta A, para el storyboard; la versión final, después. Antes, la dirección de arte: si la pieza tiene carrusel, el Reel toma su `post.json → art`; si no, `npm run video:baraja -- content/<pieza>` reparte 3 direcciones y la elegida va en `video.json → art` (ver **Estilo**, más abajo). `video.tsx` exporta `defineVideo` de `@motor/video` con el estilo de los subtítulos (`captions`), la barra de capítulos (`chapters`) y una entrada por escena de `video.json`: el mismo `id`, el tono de la paleta (`tone`), el nombre del capítulo (`chapter`), los efectos (`sfx`) y lo que se ve (`Visual`). Con `stage`, el video tiene un mundo que dura de punta a punta y una cámara que se mueve entre escenas (`camera` en cada una), en vez de una lámina por escena: es lo que pide `world`. El mundo se arma con `<Spot>`, `<Label>` y `<Board>`, y `meter` pone en el HUD lo que está en juego ([skills/video-es](../skills/video-es/SKILL.md), "Escenario con cámara"). Las escenas se arman con el kit de escenario (ver **Escenario y HUD**, más abajo). Lo que dice la voz no va aquí: sale de `video.json`, tal cual se aprobó. La guía para el agente está en [skills/video-es](../skills/video-es/SKILL.md).
4. **Voz y tiempos:** `npm run video:prepare -- content/<pieza>`. No corre sin la puerta A. Hace cuatro cosas:
   - genera la voz de cada escena con el proveedor y la voz de `accounts/dev.json → voice` (ElevenLabs, voz F), de a dos escenas a la vez;
   - toma de ElevenLabs cuándo se dice cada palabra: devuelve el tiempo de cada carácter del texto. Solo las voces que se guardaron en caché antes del 27 de octubre pasan por whisper.cpp local, una vez, y su resultado queda en la caché;
   - baja los efectos de `assets/catalog.json`;
   - deja todo en `out/video/`.

   Las voces se guardan en caché: si el texto no cambia, no se vuelven a pagar.
5. **Vista previa:** `npm run video:studio -- content/<pieza>` abre Remotion Studio con la pieza.
6. **Render e inspector:** `npm run video:render -- content/<pieza>` deja cuatro archivos:
   - `out/video.mp4`: 1080×1920 a 30 fps, H.264 yuv420p en BT.709 y AAC, con el volumen normalizado a −14 LUFS. Es el que se publica;
   - `out/video-hoja.png`: la portada (el cuadro 1), el final de cada escena y el medio de cada cambio de escena. En el medio de un cambio se ve si un fundido deja una doble exposición sucia;
   - `out/video-inspector.txt`: lo que encontró el inspector;
   - `out/video.sha256`: el hash del video, para la puerta B.

   El render es determinista: el mismo contenido da el mismo archivo.

   **Borrador:** `npm run video:render -- content/<pieza> --borrador` renderiza a 540×960 y deja `out/video-borrador.mp4`, con su hoja y su inspector (`video-borrador-hoja.png`, `video-borrador-inspector.txt`). Se usa para comprobar los arreglos entre rondas. No toca `out/video.mp4` ni la puerta B, y no imprime sha256. El inspector mide en px de diseño, así que da lo mismo que el render final. El de 1080×1920 sale una vez, para el crítico y la puerta B.

   **El inspector** lee lo que el render dibujó de verdad: durante el render, la composición le pasa el texto de un cuadro cada medio segundo, con su posición, su tamaño y su opacidad. También revisa el archivo con ffmpeg.
   - **Errores** (bloquean la puerta B y el comando sale con código 1):
     - texto fuera del margen del marco (36 px a cada lado, entre la pestaña y los subtítulos);
     - letra de menos de 22 px de diseño, o de 12 px en el texto de una interfaz del kit (`data-ui`);
     - el gancho elegido (`onScreen`) no se ve completo en el cuadro 1;
     - subtítulos que no tienen todas las palabras del guion.
   - **Avisos:**
     - más de 6 palabras en pantalla a la vez, sin contar los subtítulos, el texto de las interfaces del kit ni los rótulos de hasta 3 palabras de un escenario;
     - la escena 1 abre con el título de `SceneFrame`: el primer cuadro es un objeto que se mueve, y el gancho va como rótulo;
     - texto del escenario fuera del margen, o de menos de 12 px con el zoom de la cámara, cuando la cámara está quieta. Mientras se mueve no se revisa;
     - el gancho fuera del centro 3:4 que muestra la grilla;
     - un dibujo que deja vacío abajo: más de 130 px entre el final del dibujo y los subtítulos;
     - una portada vacía: el cuadro 1 ocupa menos del 35 % del recorte 3:4;
     - más de 2 s sin cambio arriba de los subtítulos. Se mide en píxeles que cambian cada medio segundo, así que cuenta un trazo que se dibuja;
     - `video.json` tiene `meter` y `video.tsx` no lo muestra;
     - el volumen lejos de −14 LUFS;
     - una duración fuera del rango del formato.

   Como en el carrusel, cada aviso es un error salvo que se pueda defender en una frase.
7. **Crítico ciego:** `npm run video:critique -- content/<pieza>`. Arma `out/video-critica/` con lo que le llega a alguien en Instagram:
   - el video con la interfaz encima;
   - un cuadro cada 2 s, en tiras de 6;
   - la hoja y la portada recortada como en la grilla;
   - lo que se oye, con el segundo en que empieza cada parte;
   - el texto del post.

   Dale esa carpeta a un **contexto nuevo**: en Claude Code, el subagente `critico-ciego-video` (Sonnet 5.5), siguiendo [docs/critico-ciego-video.md](../docs/critico-ciego-video.md). El crítico escribe `informe.md` con la rúbrica de [docs/critica-video.md](../docs/critica-video.md).

   - Arregla los tres problemas principales y vuelve a renderizar.
   - **Una ronda por defecto.** La segunda, con un contexto nuevo, solo si un punto sacó menos de 3 o hubo un error grave.
   - Copia el informe final en `video-critica.md`, en la carpeta de la pieza.
   - Si un arreglo cambia lo que dice la voz, vuelve a la puerta A.

   `--gemini` suma una segunda opinión que oye el audio, pero no decide: en la prueba del 27 de octubre de 2026 fue demasiado blando ([docs/critico-ciego-video.md](../docs/critico-ciego-video.md), "Quién critica").
8. **Puerta B.** La persona ve el video y, después de su sí en el chat, el agente anota `video.json → gateB { approved: true, date, video: "<sha256>" }`. Se le muestran la vista con la interfaz de Instagram, la hoja y el informe del crítico. La aprobación vale para ese archivo: si un render posterior da otro video, `video:render` la vuelve a `false` y deja la razón en `notes`.
9. **Publicar:** `npm run video:publicar -- content/<pieza> [--ensayo] [--forzar]`. Paso opcional, solo cuando la persona lo pide en el chat y con la puerta B aprobada. Exige que el sha256 de `out/video.mp4` coincida con `video.json → gateB.video`, extrae la portada limpia del cuadro de `video.json → cover`, o del cuadro 1 si no hay (`out/video-portada.png`), activa la etiqueta obligatoria de IA de Meta y sube el Reel con `packages/publisher`. Con `--ensayo` se detiene antes de compartir y guarda la captura en `.publisher/`.

## Después de publicar: métricas

Igual que en el carrusel ([workflows/metricas.md](metricas.md)):
1. A las 48 horas y a los 7 días, Jeremy le pasa al agente la captura de Insights del Reel.
2. El agente la transcribe en `content/<pieza>/video-metrics.json` ([esquema](../schemas/video-metrics.schema.json)). La fórmula del gancho y el número de escenas salen de `video.json` si no se anotan. La duración (`tags.seconds`) es la que imprimió `video:render`.
3. `npm run video:metrics` regenera [docs/metricas-video.md](../docs/metricas-video.md).

## Cómo se trabaja

**Sincronizar con la voz:** `useCue("palabra")` da el segundo en que se dice esa palabra en la escena, y los efectos se ponen igual (`at: "ojo"`). Si la voz cambia, todo se reacomoda.

**La voz de la cuenta:** es Puck, de Gemini, elegida por Jeremy el 20 de octubre de 2026. Está en `accounts/dev.json → voice`, con su estilo, y no cambia entre videos. Para probar otras, `npm run video:voices` deja el mismo texto en 8 voces, con el volumen igualado, en `packages/video/out/voices/A.mp3` a `H.mp3`; `key.json` dice cuál es cuál y se abre después de elegir.

**Estilo: el del carrusel** (decisión de Jeremy del 20 de octubre de 2026). Cada Reel se ve como un carrusel de la cuenta, y dos videos seguidos no se parecen:
- **Fijo:** el marco de `<Slide>`, con la pestaña de archivo, la textura de puntos y la firma, más los subtítulos.
- **Por pieza:** la dirección de arte (`art`) de la baraja del carrusel, con su paleta, sus tipografías, el ancla y la pestaña. El acento tiene que llegar a 4.5:1 sobre `bg` y sobre `surface`, porque los subtítulos lo usan (`video:prepare` lo revisa).
- **Por escena:** el tono de la paleta (`tone`) y la composición.

**Letra:** en video, la letra chica de las primitivas no baja de 22 px de diseño (44 px a 1080 de ancho). Es un piso: lo que ya era más grande no cambia, y el carrusel tampoco cambia.

**Composición: todo el lienzo, con margen.** El diseño no esquiva los botones ni los textos de Instagram: usa el lienzo dentro del margen del marco, como una lámina del carrusel. Por eso:
- **El título** va arriba, desde y 128, dentro del recorte de la grilla.
- **El dibujo** va centrado entre el título y los subtítulos. `SceneFrame` (de `@motor/video`) lo hace solo: cada escena le da su dibujo de 468 px de ancho, el de una lámina del carrusel, y su alto.
- **Los subtítulos** van de y 812 a 880, justo arriba de la firma, en páginas de una frase o un pedazo de frase: nunca mezclan el final de una oración con el principio de la siguiente.
- **La portada.** El cuadro 1 lleva el dibujo, no solo el título, porque la grilla del perfil lo recorta al centro 3:4 (de y 120 a 840). La pestaña queda fuera de ese recorte.

**Escenario y HUD.** Como en el referente de [docs/analisis-rick-theengineer.md](../docs/analisis-rick-theengineer.md), lo que se explica pasa dentro de una interfaz que el público reconoce. El kit está en `packages/video/src/kit/stage.tsx` y se importa de `@motor/video`:
- `Phone`, `BrowserBar`, `AppCard`, `Chat`, `Terminal`, `Diff`, `DataTable` y `Chip`. Cada uno recibe `at` (los segundos de `useCue`) para aparecer con la voz; `Terminal` escribe los comandos letra por letra.
- **Interfaces reales, fieles.** Una app que el público reconoce se puede recrear igual a su versión actual, con su logo de `<Logo>` (regla 6 de AGENTS.md). Los comandos de `Terminal` son reales; lo que muestran las pantallas (un issue, un diff, una salida) es un ejemplo y se rotula "Ejemplo ilustrativo".
- **Su texto es interfaz** (`data-ui`): el inspector no lo cuenta como palabras en pantalla y le deja bajar a 12 px. La frase para leer sigue siendo el título o una etiqueta.
- **Sin `height`,** `SceneFrame` apila lo que recibe en una columna centrada, que es lo cómodo para el kit; con `height`, el dibujo es un recuadro de coordenadas absolutas.
- **El HUD:** con `chapters: true`, el marco suma debajo de la pestaña la barra de capítulos (número, nombre de la escena y un segmento por escena que se llena). Los `Chip` sirven de rótulos de sistema dentro de las escenas.
- **Subtítulos:** `captions` elige el estilo. `"highlight"` pinta la palabra dicha en el acento; `"pill"` va en una píldora, con lo ya dicho en tinta y el resto apagado; `"marker"` pone la palabra dicha sobre una caja del acento.

**Salidas reales.** Lo que muestra una `Terminal` sale de correr el comando de verdad, no de escribirlo a mano. Los comandos van en `content/<pieza>/captures.json` ([esquema](../schemas/captures.schema.json)), en pasos de preparación (`show: false`) y pasos que se muestran. `npm run video:capture -- content/<pieza>` corre cada captura en una carpeta limpia (`.cache/captures/`), con un autor y una fecha fijos para git, y guarda en el mismo archivo lo que imprimió, con la fecha. Saca las rutas locales: la carpeta de la captura queda como `~/demo`. En `video.tsx`, `useCapture("<id>")` lee la salida y `captureLines()` la pasa a una `Terminal`; las cifras de la pantalla se leen de esa salida. Cada captura es un dato de `facts.json`, y la pantalla dice que es un repositorio o un proyecto de prueba, con su fecha. `video:prepare` y `video:storyboard` no corren si una captura todavía no corrió.

**Recursos de terceros:** solo los de `assets/catalog.json`. Para que `video:prepare` use uno, tiene que tener:
- la licencia revisada en su fuente, con la fecha en `checkedAt`;
- su `sha256`, que demuestra que el archivo es el que se revisó.

Los archivos no se commitean.

**Buscar y agregar efectos:**
- `npm run video:asset -- search "lápiz en papel"` busca primero en el catálogo y después en las bibliotecas de `media.config.json`: Openverse, sin clave, y Freesound, con `FREESOUND_API_KEY` en `.env`. Solo trae CC0.
- `npm run video:asset -- add openverse:<id> --id lapiz --tags "papel,trazo"` lo baja, le calcula el hash y lo agrega al catálogo con la fecha.

**Imágenes generadas:** `npm run video:image -- content/<pieza> --name foco --prompt "..."` deja `img/foco.png`, que se usa con `<Img src="img/foco.png">`. Las opciones:
- `--chroma` la pide sobre verde y la recorta, para un PNG transparente;
- `--ref img/a.png` le pasa referencias, como el avatar, para mantener el personaje;
- `--aspect` y `--size` fijan la proporción y el tamaño.

Cada generación se paga, así que no pisa un archivo existente sin `--replace`.

**Música:** `npm run video:music -- content/<pieza> --name cama --prompt "..."` deja `audio/cama.mp3`: un clip de 30 s de Lyria, que se repite si el video es más largo. En `video.tsx` va como `music: { file: "audio/cama.mp3" }`, o `music: { asset: "<id>" }` si es del catálogo. Entra y sale con un fundido y baja mientras habla la voz. El volumen por defecto es 0.12, porque la voz manda.

**Registro de lo generado:** las imágenes y la música hechas con IA quedan en `content/<pieza>/generated.json`, con el proveedor, el modelo, el prompt, las referencias, el hash y la fecha. Las voces quedan registradas en la caché. Los proveedores y modelos de imagen y música se cambian en `media.config.json`; la voz, en `accounts/dev.json`.

## Reglas

- **Igual que el carrusel:** datos de `facts.json`, nada inventado, una idea por escena, un recurso visual por escena y el gancho visible desde el cuadro 1.
- **Margen:** el texto va a 36 px de cada borde (en px de diseño, sobre 540×960), entre la pestaña y los subtítulos, que van de y 812 a 880.
- **Etiqueta de IA:** todo Reel con voz sintética la lleva al publicar (Meta).

## Pendiente

Está por fases en [docs/plan-videos.md](../docs/plan-videos.md):
- publicar el piloto del ray tracing, que ya tiene las puertas A y B;
- la calibración del crítico ciego con Reels que Jeremy admira;
- el avatar (Fase 4).
