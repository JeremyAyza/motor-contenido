---
name: video-es
description: Capa de este repo sobre las skills oficiales de Remotion. Explica cómo se hace un video de motor-contenido (video.json con las puertas, video.tsx, voz, tiempos, recursos con licencia) y qué cambia respecto de las skills remotion-*. Úsala siempre que trabajes en packages/video, packages/media o un content/<pieza>/video.json o video.tsx.
---

# video-es

Las skills `remotion-*` son las oficiales de Remotion, sin modificar. Viven en `.agents/skills/` y `.claude/skills/`, y se instalan en cada máquina con `npx skills experimental_install`, que lee `skills-lock.json`. Enseñan Remotion; esta capa dice qué cambia en este repo. Ante un conflicto, manda [AGENTS.md](../../AGENTS.md) y después esta skill.

**Antes de armar un video, lee [docs/direccion-reels.md](../../docs/direccion-reels.md):** el estilo por defecto (motion graphics plano con cámara dinámica), cuándo va 3D (solo si se pide), la duración (45 a 60 s, formato `corto`), la voz y el volumen de la música. Manda sobre lo que sigue.

## Cómo es un video aquí

- **Primero el guion.** `content/<pieza>/video.json` lleva:
  - los ganchos;
  - por escena, lo que dice la voz (`say`), lo que se ve (`see`) y el recurso visual;
  - las puertas.

  `video:script` arma la hoja de la puerta A (`out/gate-a.md`) y `video:storyboard` le suma los cuadros de un primer `video.tsx`, sin voz. No generes voz antes del sí de la persona: `video:prepare` no corre sin `gateA.approved`. Sigue el orden de [workflows/video.md](../../workflows/video.md).
- **La dirección de arte**, como en el carrusel: `video.json → art`, con la dirección que repartió `video:baraja`, la paleta, las tipografías, el ancla y la pestaña. Si la pieza tiene carrusel y `video.json` no trae `art`, el Reel toma `post.json → art` y se ve como su carrusel. Ver [Estilo](#estilo-el-del-carrusel).
- **El mundo antes que las escenas.** `video.json` lleva `world` (la metáfora física que dura todo el video), `meter` (lo que está en juego, de `from` a `to`) y `cover` (el cuadro de la portada). Se aprueban en la puerta A, y `video:script` avisa si faltan.
- **Lo que se ve.** `content/<pieza>/video.tsx` exporta `defineVideo({...})` de `@motor/video` con `captions` (el estilo de los subtítulos), `chapters` (la barra de capítulos), `stage` (el mundo con su cámara, ver [Escenario con cámara](#escenario-con-cámara)) y una entrada por escena de `video.json`, con estos campos:
  - `id`: el mismo de `video.json`;
  - `tone`: el tono de la paleta para esa escena (`base`, `surface`, `accent` o `invert`), como en `<Slide>`;
  - `chapter`: su nombre en la barra de capítulos;
  - `sfx`: los efectos de sonido;
  - `camera`: con `stage`, lo que encuadra la escena;
  - `Visual`: lo que se ve, armado con el kit de escenario. Con `stage` es opcional y va encima del mundo: los rótulos de esa escena.

  Lo que dice la voz no se repite aquí. Si hace falta cambiar el texto, cambia `video.json`, y eso pide volver a la puerta A.
- **Comandos:**
  - `video:baraja` reparte 3 direcciones de arte, sin las dos últimas que usaron los videos;
  - `video:capture` corre los comandos de `captures.json` y guarda su salida real;
  - `video:storyboard` renderiza el `video.tsx` sin voz, al ritmo estimado, para la puerta A;
  - `video:script` revisa el guion con las herramientas de `ig-reel` (hookscore y beats, por sus wrappers en español) y arma la puerta A;
  - `video:prepare` genera la voz, los tiempos por palabra y los archivos;
  - `video:studio` abre la vista previa;
  - `video:render` saca el MP4, la hoja de revisión y el sha256 del video;
  - `video:critique` arma la carpeta del crítico ciego;
  - `video:metrics` arma el informe de los Reels publicados.
- **El guion sigue a `ig-reel`.** Lee `.agents/skills/ig-reel/SKILL.md` para la forma (el gancho en 2 s, lo que está en juego, una idea por frase, el cierre que vuelve al gancho) y sus fórmulas. Lo que cambia aquí está en [skills/ig-es](../ig-es/SKILL.md), punto 9. Arregla lo que avisan `hookscore_es` y `beats_es` antes de la puerta A; un gancho elegido con menos de 50 se discute con la persona, no se esconde.
- **Crítico ciego antes de la puerta B.** Después de `video:render`, corre `video:critique` y dale `out/video-critica/` a un contexto nuevo ([docs/critico-ciego-video.md](../../docs/critico-ciego-video.md)). Quien hizo el video no se califica a sí mismo.
- **El inspector manda.** `video:render` corre el inspector de video (`out/video-inspector.txt`). Corrige todos sus errores antes de mostrar el video, y trata cada aviso como un error salvo que lo puedas defender en una frase. La hoja `out/video-hoja.png` (portada, final de cada escena y medio de cada cambio) es lo primero que miras.
- **Puerta B.** Después del sí de la persona al video, anota `gateB { approved: true, date, video: "<sha256 que imprimió video:render>" }`. Si un render posterior da otro archivo, `video:render` la vuelve a `false`.
- **Lienzo.** Es de 540×960 px de diseño, como el ancho del carrusel, y se renderiza a 2x (1080×1920). Las cifras de las skills de Remotion están pensadas para 1080 de ancho y aquí se dividen por 2: el titular va de 42 px o más y el texto de apoyo de 22 px o más.
- **Letra de las primitivas.** En video, la letra chica de las primitivas (`Etiqueta`, `Nodo`, `Barras`, `Nota`, `Code` y las demás) no baja de 22 px: su tamaño es `max(<tamaño del carrusel>, var(--min-text))` y el video pone `--min-text: 22px`. No lo arregles a mano con un `<span>`. Si una etiqueta de 22 px no entra, dale más `ancho` o acórtala. Tu propia clase de tamaño (`text-[26px]`) sigue ganando.
- **Margen, no zona segura.** El diseño no esquiva los botones ni los textos de Instagram (decisión de Jeremy del 20 de octubre de 2026): el contenido usa todo el lienzo dentro del margen del marco, 36 px a cada lado. Va entre la pestaña y los subtítulos, que ocupan de y 812 a 880, justo arriba de la firma.
- **Cada escena va en `SceneFrame`** (de `@motor/video`):
  - `title`, `anchor`, `underline` y `titleClassName` (el titular va en la tipografía de la dirección, de 44 px por defecto);
  - un dibujo de 468 px de ancho, el mismo de una lámina del carrusel, con su `height`, en coordenadas absolutas dentro de ese recuadro.

  SceneFrame pone el título arriba, desde y 128, y centra el dibujo en lo que queda hasta los subtítulos. Las coordenadas de las etiquetas son relativas al recuadro del dibujo, y su borde derecho es 468. Los dibujos de las láminas del carrusel, que también miden 468, entran sin cambiar sus coordenadas.
- **El cuadro 1 lleva el gancho** y un objeto, no solo el título, porque la grilla del perfil lo recorta al centro 3:4, de y 120 a 840. **La portada que se sube** es la de `video.json → cover`: el cuadro más fuerte, ya asentado. Sin `cover`, el cuadro 1.

## Escenario y HUD

El nivel de referencia es [docs/analisis-rick-theengineer.md](../../docs/analisis-rick-theengineer.md): lo que se explica pasa dentro de una interfaz que el público reconoce, con varias capas por cuadro.

- **El kit** (`@motor/video`): `Phone`, `BrowserBar`, `AppCard`, `Chat`, `Terminal`, `Diff`, `DataTable` y `Chip`. Cada uno aparece con la voz por `at` (los segundos de `useCue`), y `Terminal` escribe sus comandos.
- **Interfaces reales, fieles.** Una app que el público reconoce (la terminal de Claude Code, Zed, VS Code, T3 Code) se puede recrear, igual a su versión actual (regla 6). Su logo va con `<Logo>`, como en `AppCard logo="github"`. Los comandos son reales; lo que muestra una pantalla de ejemplo se rotula con `<Nota>Ejemplo ilustrativo.</Nota>`. Ningún número de una pantalla de ejemplo se presenta como dato.
- **Mejor, salidas reales.** Si el tema tiene comandos, ponlos en `captures.json`, corre `video:capture` y muéstralos con `useCapture("<id>")` y `captureLines()`. Así la terminal muestra lo que corrió, y las cifras se leen de la salida en vez de escribirse a mano. La nota dice que es de prueba y su fecha.
- **Su texto es interfaz** (`data-ui`): no cuenta en las 12 palabras del inspector y puede bajar a 12 px. La idea de la escena va en el título o en una etiqueta, no escondida en la pantalla.
- **Capas.** Cada escena junta dos o tres piezas del kit (una barra del navegador y una terminal; un diff y lo que dijo el agente). Si el inspector avisa que queda vacío abajo, suma una capa o agranda la que hay.
- **`SceneFrame` sin `height`** apila el kit en una columna centrada. Con `height` vuelve al recuadro de coordenadas absolutas, para dibujos.
- **HUD:** `chapters: true` y un `chapter` por escena muestran la barra de capítulos bajo la pestaña. Los `Chip` hacen de rótulos de sistema.
- **Subtítulos:** `captions: "highlight"` (por defecto), `"pill"` o `"marker"`. Elige el que pide el mundo de la dirección: la píldora va bien con interfaces, y el marcador con un mundo de época.

## Escenario con cámara

El nivel de referencia es [docs/analisis-reels-2026-10-22.md](../../docs/analisis-reels-2026-10-22.md): los Reels que funcionan pasan en un solo mundo que dura todo el video, y el cuadro cambia cada 1 a 2 s sin cortar. `defineVideo({ stage })` lo hace posible:

- **`stage: { World, width, height, spots, drift }`.** `World` es un componente que se monta una vez, debajo del marco, y vive de punta a punta. Se dibuja en sus propias coordenadas (px de diseño desde arriba a la izquierda) y puede ser más grande que el lienzo: por defecto mide 540×960. `spots` son zonas con nombre (`{ memoria: { x, y, w, h } }`).
- **La cámara.** Cada escena dice qué encuadra con `camera: { focus: "memoria" }` (un spot, que llena la vista con un margen), `{ focus: { x, y }, zoom }` o solo `{ zoom }`. Al empezar la escena, la cámara va al encuadre nuevo en 0,9 s, sin saltos. Durante la escena se acerca un 4 % (`drift`), para que la imagen nunca quede quieta. Una escena sin `camera` mantiene el encuadre anterior; la primera, sin `camera`, muestra el mundo entero.
- **`<Spot id>`** pone sus hijos sobre la zona con ese nombre, así la cámara encuadra justo lo que está dibujado ahí.
- **El tiempo del mundo es el del video entero,** no el de una escena. `useStage()` da el momento (`ms`), la escena y su avance. `useStageCue("escena", "palabra")` da el segundo del video en que se dice una palabra de cualquier escena. El `anim` de las primitivas, dentro del mundo, también cuenta desde el inicio del video. Para el movimiento propio, `interpolate(ms, ...)`.
- **El mundo cambia de estado, no se reemplaza.** Un servidor que se suma, una grieta que aparece y se queda, un paquete que viaja. Lo que pasó en una escena sigue ahí en la siguiente.
- **`Visual` va encima**, en el área del marco y con el tiempo de su escena (`useCue`): el gancho como rótulo en la escena 1 y el cierre. Lo demás vive en el mundo.
- **El marco no cambia.** La pestaña, los puntos, la firma, la barra de capítulos, el medidor y los subtítulos se montan una vez y toman el tono de la escena en curso.

### El kit del mundo

La pieza de ejemplo del kit completo es `content/2026-10-24-cuanto-cuesta-la-ia` (el plan está en [docs/plan-paridad-rick.md](../../docs/plan-paridad-rick.md)).

- **Objetos** (`kit/props.tsx`), planos, sin contorno y con la paleta de la pieza:
  - `Tree`, `Pine`, `Bush`, `Cloud`, `Building`, `House`, `StreetLamp`, `TrafficLight`, `Car`, `Truck` (con `cargo`), `Booth` (con barrera `open`), `Machine`, `Sign`, `Server`, `Document`, `Coin`, `Person`, `Laptop`, `Warehouse` y `Cone`;
  - cada uno se ubica por su base `x, y` y escala con `s`;
  - se mueven solos con el reloj del video: las ventanas se prenden, los árboles se mecen, las nubes avanzan, el engranaje gira y los LEDs parpadean.
- **Recorridos:**
  - `stage.paths` define trazados SVG (`{ ruta: "M ..." }`);
  - `<RoadPath path>` dibuja la carretera con su línea que corre;
  - `<Along path at rotate>` pone algo en una fracción del recorrido (0 a 1);
  - `<Traffic path count speed>` hace circular autos sin parar.
- **Cámara que viaja:** `camera: { follow: { path, from, to, x }, zoom }` recorre el trazado durante la escena; con `x`, solo baja por la ruta y no se va a los costados.
- **Recorte en el viaje:** mientras la cámara pasa de un encuadre a otro, el motor recorta el mundo a la franja entre la barra de capítulos y los subtítulos, así no cruza la pestaña, la barra, el medidor, los subtítulos ni la firma. En los cuadros quietos el mundo se ve entero.
- **Sonido solo:**
  - `<Sfx id at>` toca un efecto del catálogo en `at`;
  - `<Pop at x y>` hace entrar algo con rebote y su pop;
  - `usePop(at)` da el mismo resorte para animar a mano;
  - la cámara suena con un whoosh en cada cambio de encuadre (`stage.sfx: false` lo apaga);
  - el medidor y el tablero suenan con una moneda o la caja registradora en cada paso.
- **`<Banner at until tone>`:** la idea de la escena en una banda bajo el tablero, con un blip.
- **`<Label spot at place tone>`:** un rótulo de 1 a 3 palabras pegado a un spot (TU APP, RUNTIME, GRIETA). Aparece en `at` (`useStageCue`); sin `at`, está desde el cuadro 1. `place` lo ubica en el spot (`top-left` por defecto, `top`, `center`, `bottom-right`...) y `tone` le da el color: `solid`, `line`, `accent` o `alert` (rojo, para lo que se rompe).
- **`<Board nodes edges events packets icons width height>`:** un plano que crece, como el del Reel de system design. Los nodos (`{ id, x, y, label, at }`) aparecen en su `at`. Los `events` (`{ at, node, state, x, y, label }`) los cambian de estado (`ok`, `busy` con un pulso, `fail` con una X roja, `off` atenuado), los mueven o los renombran, y el cambio queda. Las flechas se dibujan cuando están sus dos puntas y siguen a los nodos. Las opciones de cada flecha:
  - `curve` la dobla (0,2 hacia la izquierda de su recorrido, -0,2 hacia la derecha);
  - `glow` le da un color con halo, como un diagrama de neón;
  - `pulse` hace correr una luz por ella cada tantos segundos.

  `fan(["github", "postgres", "slack"], "agente", { glow, pulse })` arma el abanico de varias flechas hacia un nodo, con las de afuera más curvas, como el diagrama de MCP de Rick. Los `packets` (`{ from, to, at, dur }`) viajan por una flecha y siguen su curva. `icons` lleva un `<Logo>` oficial o un `<Icono>` por nodo. Va dentro de un `<Spot>` o del mundo, en sus propias coordenadas.
- **`<Plate src box clip opacity depth>`:** una lámina generada del mundo (`video:image`), en las coordenadas del mundo. Sin `box`, cubre el mundo entero: el mundo se mide sobre la imagen (`width` y `height` con su proporción, y los spots sobre lo que se ve). `clip` muestra solo una zona: dos generaciones que solo difieren en un lugar (las puertas cerradas y abiertas, sacadas con `--ref` de la primera) se funden ahí. `depth` da parallax bajo la cámara: negativo es más lejos y positivo, más cerca. Los personajes y objetos que se mueven se generan aparte con `--chroma` y se ponen con su propio `<Plate box>`. La pieza de ejemplo es `content/2026-10-22-login-con-google`.
- **El reloj:** `<Board>` y `<Label>` cuentan los segundos del lugar donde están. Dentro del `World`, el del video entero (sus `at` salen de `useStageCue`); dentro del `Visual` de una escena, el de la escena (`useCue`). `useClock()` da ese reloj para el movimiento propio.

### El tablero

`defineVideo({ panel })` es el taxímetro de los Reels de Rick y reemplaza al medidor:
- **`rows`:** las filas ("Entrada", "Salida", "Caché"), con un punto en la activa (`active`: pasos con el índice de la fila);
- **`counters`:** uno o dos contadores (`counter` o `money`) cuyos pasos pueden durar lo que dura lo que cuentan (`ramp` en segundos), para que suban en vivo;
- **`footer`:** una línea de pie con el modelo y sus precios.

Va bajo la barra de capítulos: el `Visual` de cada escena deja libres los primeros 116 px.

### El medidor

`defineVideo({ meter })` pone a la derecha de la pestaña lo que `video.json → meter` dice que está en juego, y lo deja todo el video, con o sin escenario:

```tsx
meter: {
  kind: "counter",            // counter, money, bar o slots
  start: 1,                   // el valor del gancho (meter.from)
  steps: [{ scene: "crece", word: "millones", value: 50_000_000 }],
  // max: 5 para bar o slots; unit: "ms"; decimals: 2
}
```

Cada paso cuenta desde el valor anterior hasta el nuevo cuando se dice su palabra (sin `word`, al empezar la escena). La etiqueta es `meter.label` de `video.json`, salvo que `defineVideo` traiga otra. `slots` dibuja `max` casillas que se llenan, con "?" en las vacías, como el "1/5" de los 5 plugins. El último paso es `meter.to`: se paga en el cierre. `video:storyboard` y `video:render` avisan si `video.json` tiene `meter` y `video.tsx` no lo muestra.
- **El inspector** no cuenta como palabras los rótulos de hasta 3 palabras del mundo. Revisa su margen y su tamaño (12 px con el zoom) solo con la cámara quieta, y como aviso: al encuadrar un piso, el rótulo del piso vecino puede asomar en el borde.
- **Sin `stage`,** cada escena es una lámina con su `SceneFrame`, como antes. Sirve para piezas cortas sin mundo, pero lo que pide la cuenta es el escenario.

### Reglas de forma

- **El primer cuadro es un objeto que se mueve**, no un título: el monitor que se enciende, la tecla en macro, la batería que baja. El gancho va como rótulo encima. El inspector avisa si la escena 1 abre con el título de `SceneFrame`.
- **Algo cambia cada 2 s** como máximo (el inspector lo mide). La cámara y el `drift` ayudan, pero el cambio que importa es el del mundo: lo que la voz está diciendo.
- **Fuera de los subtítulos, como mucho 6 palabras** a la vez. Los rótulos del mundo son de 1 a 3 palabras.
- **El medidor** (`meter`) se planta en el gancho y se paga en el cierre: `defineVideo({ meter })`, ver [El medidor](#el-medidor).
- **El cierre se puede capturar:** una tabla, una pila o un ciclo que resume el video y que alguien guardaría.
- **Una línea que se lee** queda unos 0,3 s por palabra desde que está completa. El ritmo sale del movimiento, no de quitar el texto antes de tiempo.
- **Las cosas aparecen una por una,** con clics, deslizamientos y tipeo simulados, en vez de entrar todas juntas.
- **Cualquier cuadro congelado tiene que poder publicarse.** Mira en la hoja los cuadros de mitad de cambio. Si un fundido entre dos composiciones cargadas da una doble exposición, que salga lo viejo y después entre lo nuevo, o pasa por el fondo.
- **Los efectos** van en la tonalidad de la música y por debajo de ella.

Las últimas cinco salen del repo [`brag`](https://github.com/latent-spaces/brag) (MIT): se toman como reglas, sin instalarlo (ver el análisis, sección 7).

## Duración de una réplica

Cuando la pieza replica un Reel de referencia, `video.json → target` lleva los segundos de la referencia y `format` es el que la contiene. `video:script` avisa si la voz estimada se aleja más de un 10 %, y el render avisa con la duración real. Para llegar, suma frases con datos o pausas sin voz con `SceneDef.hold` (segundos de imagen después de la voz): un remate, una revelación, una transición. El `tempo` de la voz (`accounts/dev.json`) acorta todo un 12 %: tenlo en cuenta al escribir.

## Escenas cortadas, sin marco (opcional, por pieza)

Para un Reel cortado escena por escena, como el de @sebastiankra.ia sobre Replica (la pieza de ejemplo es `content/2026-10-24-replica-skills`). Todo esto es opcional: por defecto el marco y los subtítulos siguen como siempre.
- **Marco:** `defineVideo({ frame: { tab: false, dots: false, signature: false } })` apaga la pestaña, los puntos o la firma.
- **Subtítulos:** `captions: "none"` los quita, para que las palabras vayan en títulos grandes.
- **Fondo de la escena:** `background` (`"grid"` o `"stripes"`) dibuja una trama sobre el tono de la escena.
- **Entrada:** `transition` (`"blur"`, `"zoom"`, `"slide"` o `"whip"`) hace entrar la escena con un whoosh. La anterior corta, así que la voz no se desfasa, y el inspector no mide el margen mientras entra.
- **`<PillTitle at tone>`:** el título grande en píldora ("2 · MONTA"), con pop.
- **Avatar en burbuja:** `avatar: { shape: "bubble", bubbleCrop }` muestra la cabeza en un círculo, como una cámara de cara. Solo aparece en las escenas que dicen dónde va (`SceneDef.avatar: { x, y, size }`).

## El formato largo

`format: "largo"` va de 90 a 180 s: una explicación de varios puntos, como la de Rick sobre lo que cuesta la IA. Solo funciona si algo cambia cada segundo: tablero, carretera con estaciones, tráfico, cámara que viaja y sonido del kit. Para el texto, `captions: "card"` pone la frase en una tarjeta grande junto al avatar.

## El formato explicado

`video.json → format: "explicado"` es el formato de [docs/propuesta-reels-jacket.md](../../docs/propuesta-reels-jacket.md), "un segundo por dentro", en prueba de 75 a 100 s:
- un gesto de todos los días y todo lo que pasa adentro, con un personaje inventado y una tarea concreta;
- el gancho con las fórmulas 28 (un segundo por dentro) o 29 (la causa no es la que crees) de `ganchos-es.json`. `hookscore` puntúa bajo la 28: si el elegido queda bajo 50, prueba la 29 o discútelo con la persona;
- de 5 a 7 capítulos con `chapters: true`, y lo que se planta al principio se paga en el cierre;
- una frase para recordar antes del CTA, que repite una palabra del gancho;
- el tema en `topic`: `video:script` avisa si se repite uno de los últimos 14 días.

## Qué cambia respecto de las skills de Remotion

| La skill de Remotion dice | Aquí |
|---|---|
| Recomienda ElevenLabs y pide su clave | La voz sale de `video:prepare` con el proveedor de `accounts/dev.json → voice`, detrás de `SpeechProvider` (`packages/media`). No pidas claves: van en `.env`, y las escribe la persona |
| Archivos en `public/` | La carpeta pública es `content/<pieza>/out/video/`, y la llena `video:prepare` |
| Google Fonts | Las tipografías de la dirección de arte (`art.fonts`), que salen de `packages/brand` |
| Efectos de `remotion.media` | Solo los de `assets/catalog.json`, con su fuente, autor y licencia. Para entrar al catálogo, cada recurso necesita la licencia revisada en su fuente (`checkedAt`) y el `sha256` del archivo; sin eso, `video:prepare` no lo usa. Nunca los memes (Vine, SpongeBob, Windows XP), que usan sonidos con derechos de terceros |
| Las animaciones CSS no se renderizan bien | Las primitivas del carrusel (`anim`, `<Anim>`, `<Cuenta>`) se usan igual: `CssMotion` las adelanta cuadro a cuadro. El movimiento nuevo que escribas para un video va con `useCurrentFrame()` e `interpolate()` |
| No renderizar si no lo piden | Studio sirve para mirar y ajustar. `video:render` se corre cuando el video está listo para revisar, y siempre antes de la puerta B |
| Copiar Elements de remotion.dev | Antes de copiar uno, revisa sus términos. Primero usa los componentes propios y las primitivas |

## Imágenes, música y efectos

- **Primero lo que ya existe:** las primitivas, los objetos de Fluent Emoji (`carrusel:objeto`), los íconos y los logos oficiales. Una imagen generada es para lo que eso no da, como una escena de analogía o un sticker.
- **Generar:** `video:image` y `video:music` usan el proveedor de `media.config.json` y registran todo en `generated.json`. Cada generación se paga: no repitas sin `--replace` ni generes variantes que nadie pidió.
- **El mundo 3D es opcional:** solo cuando la persona pide el video en 3D (ver [docs/direccion-reels.md](../../docs/direccion-reels.md)). Entonces `video:image --world` suma `accounts/dev.json → world.style` (isométrico ilustrado) y la paleta de `video.json → art`. Sin `--world`, la imagen no lleva ese estilo. El modelo a veces dibuja letras: pide que no haya y revisa la imagen antes de usarla.
- **Logos y mascotas de marcas: primero el archivo.** Busca el oficial o uno de una fuente confiable (regla 6) y agrégalo al catálogo con `carrusel:logo add`. No los generes con `video:image`. El avatar se genera solo a partir de la ilustración de Jeremy, pasada con `--ref`.
- **El avatar es de la cuenta:** `avatar: {}` en `defineVideo` dibuja el de [assets/avatar](../../assets/avatar/README.md), sin copiar sprites a la pieza. La pieza solo dice dónde va (`size`, `top`, `scenes`, `shape`).
- **Efectos:** busca con `video:asset search`, agrega con `video:asset add` y usa en `sfx` el id del catálogo.

## Sincronizar con la voz

`useCue("palabra")` da los segundos en que se dice esa palabra dentro de la escena. Por ejemplo, `anim={{ en: useCue("ojo") }}`. Si la voz cambia, todo se mueve con ella. Los efectos también van por palabra, con `at: "ojo"`.

## Contenido: las reglas del carrusel

- **Datos.** Cada dato sale de `facts.json` y nada se inventa (AGENTS.md, reglas 1 a 3).
- **Una idea por escena.** Además de los subtítulos, van como mucho 6 palabras de texto en pantalla, y cada escena explica con un recurso visual ([recursos.json](../carrusel-taste/recursos.json)). Con `stage`, el recurso es un estado del mundo.
- **El gancho se ve desde el cuadro 1:** la primera escena no anima el titular.
- **Logos y mascotas:** el archivo oficial sin modificar; si no existe, la regla 6.
- **Voz sintética:** el Reel lleva la etiqueta de IA de Meta al publicar.

## Estilo: el del carrusel

Cada Reel se ve como un carrusel de la cuenta: lo que identifica a la cuenta no cambia, y lo demás sale del tema. Dos videos seguidos no se parecen, igual que dos carruseles.

- **Fijo: el marco del carrusel.** `PieceVideo` pone el video dentro de `<Slide>`: la pestaña de archivo arriba a la izquierda, la textura de puntos, la firma abajo y los subtítulos. Sin `stage`, un `<Slide>` por escena; con `stage`, uno solo para todo el video, con el mundo debajo. No lo cambies por pieza.
- **Por pieza: la dirección de arte (`art`).** Sale de la baraja del carrusel ([direcciones.json](../carrusel-taste/direcciones.json)):
  - **La dirección.** `video:baraja` reparte 3, sin las dos últimas que usaron los videos. Elige la que sirve al tema y anota `direction`, `dealt` y `reason`. Si la pieza tiene carrusel, el Reel puede tomar su `post.json → art` tal cual.
  - **La paleta y las tipografías** de esa dirección. El acento tiene que leerse a 4.5:1 sobre `bg` y sobre `surface`, porque los subtítulos marcan con él la palabra que se dice; `video:prepare` lo revisa.
  - **El ancla y la pestaña** (`tab`), como en el carrusel.
- **Por escena:** el tono (`tone`) y la composición, libre y sin plantillas. En los tonos `accent` e `invert`, los subtítulos subrayan la palabra que se dice en lugar de pintarla.

Usa el acento para lo que importa (el rayo que sí se calcula, la cifra nueva) y deja en tinta lo demás. Nada va encima de un logo: ni tachado, ni rajado, ni cubierto.
