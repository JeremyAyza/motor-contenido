# El kit de video

La referencia de `@motor/video` (`packages/video/src/kit/`): qué hay y cómo se usa. El flujo del Reel está en [docs/reel.md](../reel.md). Se abre cuando hace falta un detalle, no al empezar. La gramática de movimiento (`DUR`, `EASE`, `fade`, `keys`, `At`, `Appear`, `rigAt`, `shakeAt`, `es`) y las escenas de la biblioteca están en el [índice de la biblioteca](../../packages/video/library/README.md), que se genera solo.

## El lienzo y el marco de cada escena

- **Lienzo.** Es de 540×960 px de diseño, como el ancho del carrusel, y se renderiza a 2x (1080×1920). Las cifras de las skills de Remotion están pensadas para 1080 de ancho y aquí se dividen por 2: el titular va de 42 px o más y el texto de apoyo de 22 px o más.
- **Letra de las primitivas.** En video, la letra chica de las primitivas (`Etiqueta`, `Nodo`, `Barras`, `Nota`, `Code` y las demás) no baja de 22 px: su tamaño es `max(<tamaño del carrusel>, var(--min-text))` y el video pone `--min-text: 22px`. No lo arregles a mano con un `<span>`. Si una etiqueta de 22 px no entra, dale más `ancho` o acórtala. Tu propia clase de tamaño (`text-[26px]`) sigue ganando.
- **Margen, no zona segura.** El diseño no esquiva los botones ni los textos de Instagram (20 de octubre de 2026): el contenido usa todo el lienzo dentro del margen del marco, 36 px a cada lado. Va entre la pestaña y los subtítulos, que ocupan de y 812 a 880, justo arriba de la firma.
- **Cada escena va en `SceneFrame`** (de `@motor/video`):
  - `title`, `anchor`, `underline` y `titleClassName` (el titular va en la tipografía de la dirección, de 44 px por defecto);
  - un dibujo de 468 px de ancho, el mismo de una lámina del carrusel, con su `height`, en coordenadas absolutas dentro de ese recuadro.

  SceneFrame pone el título arriba, desde y 128, y centra el dibujo en lo que queda hasta los subtítulos. Las coordenadas de las etiquetas son relativas al recuadro del dibujo, y su borde derecho es 468. Los dibujos de las láminas del carrusel, que también miden 468, entran sin cambiar sus coordenadas.
- **El cuadro 1 lleva el gancho** y un objeto, no solo el título, porque la grilla del perfil lo recorta al centro 3:4, de y 120 a 840. **La portada que se sube** es la de `video.json → cover`: el cuadro más fuerte, ya asentado. Sin `cover`, el cuadro 1.

## Escenario y HUD

El nivel de referencia es [el análisis de Rick](analisis-rick-theengineer.md): lo que se explica pasa dentro de una interfaz que el público reconoce, con varias capas por cuadro.

- **El kit** (`@motor/video`): `Phone`, `BrowserBar`, `AppCard`, `Chat`, `Terminal`, `Diff`, `DataTable` y `Chip`. Cada uno aparece con la voz por `at` (los segundos de `useCue`), y `Terminal` escribe sus comandos.
- **Interfaces reales, fieles.** Una app que el público reconoce (la terminal de Claude Code, Zed, VS Code, T3 Code) se puede recrear, igual a su versión actual (regla 6). Su logo va con `<Logo>`, como en `AppCard logo="github"`. Los comandos son reales; lo que muestra una pantalla de ejemplo se rotula con `<Nota>Ejemplo ilustrativo.</Nota>`. Ningún número de una pantalla de ejemplo se presenta como dato.
- **Mejor, salidas reales.** Si el tema tiene comandos, ponlos en `captures.json`, corre `video:capture` y muéstralos con `useCapture("<id>")` y `captureLines()`. Así la terminal muestra lo que corrió, y las cifras se leen de la salida en vez de escribirse a mano. La nota dice que es de prueba y su fecha.
- **Su texto es interfaz** (`data-ui`): no cuenta en las 6 palabras del inspector y puede bajar a 12 px. La idea de la escena va en el título o en una etiqueta, no escondida en la pantalla.
- **Capas.** Cada escena junta dos o tres piezas del kit (una barra del navegador y una terminal; un diff y lo que dijo el agente). Si el inspector avisa que queda vacío abajo, suma una capa o agranda la que hay.
- **`SceneFrame` sin `height`** apila el kit en una columna centrada. Con `height` vuelve al recuadro de coordenadas absolutas, para dibujos.
- **HUD:** `chapters: true` y un `chapter` por escena muestran la barra de capítulos bajo la pestaña. Los `Chip` hacen de rótulos de sistema.
- **Subtítulos:** `captions: "highlight"` (por defecto), `"pill"` o `"marker"`. Elige el que pide el mundo de la dirección: la píldora va bien con interfaces, y el marcador con un mundo de época.

## Escenario con cámara

El nivel de referencia es [el análisis del 22 de octubre](analisis-reels-2026-10-22.md): los Reels que funcionan pasan en un solo mundo que dura todo el video, y el cuadro cambia cada 1 a 2 s sin cortar. `defineVideo({ stage })` lo hace posible:

- **`stage: { World, width, height, spots, drift }`.** `World` es un componente que se monta una vez, debajo del marco, y vive de punta a punta. Se dibuja en sus propias coordenadas (px de diseño desde arriba a la izquierda) y puede ser más grande que el lienzo: por defecto mide 540×960. `spots` son zonas con nombre (`{ memoria: { x, y, w, h } }`).
- **La cámara.** Cada escena dice qué encuadra con `camera: { focus: "memoria" }` (un spot, que llena la vista con un margen), `{ focus: { x, y }, zoom }` o solo `{ zoom }`. Al empezar la escena, la cámara va al encuadre nuevo en 0,9 s, sin saltos. Durante la escena se acerca un 4 % (`drift`), para que la imagen nunca quede quieta. Una escena sin `camera` mantiene el encuadre anterior; la primera, sin `camera`, muestra el mundo entero.
- **`<Spot id>`** pone sus hijos sobre la zona con ese nombre, así la cámara encuadra justo lo que está dibujado ahí.
- **El tiempo del mundo es el del video entero,** no el de una escena. `useStage()` da el momento (`ms`), la escena y su avance. `useStageCue("escena", "palabra")` da el segundo del video en que se dice una palabra de cualquier escena. El `anim` de las primitivas, dentro del mundo, también cuenta desde el inicio del video. Para el movimiento propio, `interpolate(ms, ...)`.
- **El mundo cambia de estado, no se reemplaza.** Un servidor que se suma, una grieta que aparece y se queda, un paquete que viaja. Lo que pasó en una escena sigue ahí en la siguiente.
- **`Visual` va encima**, en el área del marco y con el tiempo de su escena (`useCue`): el gancho como rótulo en la escena 1 y el cierre. Lo demás vive en el mundo.
- **El marco no cambia.** La pestaña, los puntos, la firma, la barra de capítulos, el medidor y los subtítulos se montan una vez y toman el tono de la escena en curso.

### El kit del mundo

La pieza de ejemplo del kit completo es `content/2026-10-24-cuanto-cuesta-la-ia`.

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
- **Lo que el mundo hace por su cuenta se le dice al inspector con marcas.** No adivina:
  - **Una cámara propia dentro del `World`** (el div que la pieza mueve) lleva `data-zoom={zoom}` siempre y `data-camera-moving=""` solo mientras se mueve. El tamaño de su texto se mide con ese zoom multiplicado por el de la cámara del escenario, y mientras se mueve no se revisa ni su margen ni su tamaño. La marca es solo para una cámara: no la uses para callar un aviso.
  - **Una capa fija a la pantalla dentro del `World`** (su div contrarresta la cámara) lleva `data-screen=""`. Su texto ya no es del mundo: se revisa como el de una escena, a su tamaño real, con los errores de margen y de letra, y también mientras la cámara viaja. Las marcas de los divs que la rodean ya no cuentan.
- **Sin `stage`,** cada escena es una lámina con su `SceneFrame`, como antes. Sirve para piezas cortas sin mundo, pero lo que pide la cuenta es el escenario.

### Reglas de forma

Son las de [docs/reel.md](../reel.md#reglas-de-forma). Aquí va lo que mide el inspector y cómo cumplirlas:
- **El primer cuadro:** el inspector avisa si la escena 1 abre con el título de `SceneFrame`.
- **Algo cambia cada 2 s** como máximo (el inspector lo mide). La cámara y el `drift` ayudan, pero el cambio que importa es el del mundo: lo que la voz está diciendo.
- **Fuera de los subtítulos, como mucho 6 palabras** a la vez. Los rótulos del mundo son de 1 a 3 palabras.
- **El medidor** (`meter`) se planta en el gancho y se paga en el cierre: `defineVideo({ meter })`, ver [El medidor](#el-medidor).
- **Una línea que se lee** queda unos 0,3 s por palabra desde que está completa. El ritmo sale del movimiento, no de quitar el texto antes de tiempo.
- **Sin dobles exposiciones:** mira en la hoja los cuadros de mitad de cambio. Si un fundido entre dos composiciones cargadas da una, que salga lo viejo y después entre lo nuevo, o pasa por el fondo.
- **Los efectos** van en la tonalidad de la música y por debajo de ella.

Varias salen del repo [`brag`](https://github.com/latent-spaces/brag) (MIT), tomadas como reglas, sin instalarlo.

## Duración de una réplica

Cuando la pieza replica un Reel de referencia, `video.json → target` lleva los segundos de la referencia y `format` es el que la contiene. `video:script` avisa si la voz estimada se aleja más de un 10 %, y el render avisa con la duración real. Para llegar, suma frases con datos o pausas sin voz con `SceneDef.hold` (segundos de imagen después de la voz): un remate, una revelación, una transición. El `tempo` de la voz (`accounts/dev.json`) acorta todo un 12 %: tenlo en cuenta al escribir.

## Escenas cortadas, sin marco (opcional, por pieza)

Para un Reel cortado escena por escena, como el de @sebastiankra.ia sobre Replica (la pieza de ejemplo es `content/2026-10-24-replica-skills`). Todo esto es opcional: por defecto el marco y los subtítulos siguen como siempre.
- **Marco:** `defineVideo({ frame: { tab: false, dots: false, signature: false } })` apaga la pestaña, los puntos o la firma.
- **Subtítulos:** `captions: "none"` los quita, para que las palabras vayan en títulos grandes.
- **Fondo de la escena:** `background` (`"grid"` o `"stripes"`) dibuja una trama sobre el tono de la escena.
- **Entrada:** `transition` (`"blur"`, `"zoom"`, `"slide"` o `"whip"`) hace entrar la escena con un whoosh. La anterior corta, así que la voz no se desfasa, y el inspector no mide el margen mientras entra.
- **`<PillTitle at tone>`:** el título grande en píldora ("2 · MONTA"), con pop.
- **Avatar en burbuja: nunca en una pieza nueva** ([docs/reel.md](../reel.md), "Avatar"). `avatar: { shape: "bubble", bubbleCrop }` queda solo porque lo usan piezas anteriores.

## El avatar por momentos

Con `SceneDef.avatar`, el avatar entra y sale dentro de una frase y cambia de papel entre escenas. Funciona con y sin `stage`, y necesita `avatar` en `defineVideo`, aunque sea `{}`:

```tsx
scenes: [
  { id: "trampa", avatar: { from: "left", at: "trampa", until: "postman" } },   // se asoma en una palabra y se va en otra
  { id: "correo", avatar: { from: "bottom", at: { word: "correo", nth: 2 } } }, // sube la segunda vez que se dice
  { id: "cierre", avatar: { at: 1.5 } },                                        // salta a los 1,5 s de la escena
]
```

- **`at` y `until`:** una palabra de la voz, `{ word, nth }` si se repite, o segundos desde el inicio de la escena, como los `sfx`. Si la voz cambia, el avatar se mueve con ella.
- **`from`:** `"left"`, `"right"` o `"bottom"`. Se desliza desde ese borde con un resorte y se va por el mismo. Con `x` cerca del borde queda a medias, asomado. `"bottom"` sube desde su propia base y nunca cruza los subtítulos. Sin `from`, salta y se encoge en su lugar.
- **`x` e `y`** son siempre el centro. Sin ellos, va a la esquina de abajo del lado por donde entra.
- **Que sea un papel, no un adorno.** Que aparezca cuando la voz lo pide (el presentador, "tú", el entrevistador), que se vaya cuando el gráfico manda y que no tape lo que se está explicando. El inspector no revisa eso: míralo en la hoja.

Los detalles y los valores por defecto están en [assets/avatar](../../assets/avatar/README.md#por-momentos).

## El formato largo

`format: "largo"` va de 90 a 180 s: una explicación de varios puntos, como la de Rick sobre lo que cuesta la IA. Solo funciona si algo cambia cada segundo: tablero, carretera con estaciones, tráfico, cámara que viaja y sonido del kit. Para el texto, `captions: "card"` pone la frase en una tarjeta grande junto al avatar.

## El formato explicado

`video.json → format: "explicado"` es el formato "un segundo por dentro" de jacket.dev, en prueba de 75 a 100 s:
- un gesto de todos los días y todo lo que pasa adentro, con un personaje inventado y una tarea concreta;
- el gancho con las fórmulas 28 (un segundo por dentro) o 29 (la causa no es la que crees) de `ganchos-es.json`. `hookscore` puntúa bajo la 28: si el elegido queda bajo 50, prueba la 29 o discútelo con la persona;
- de 5 a 7 capítulos con `chapters: true`, y lo que se planta al principio se paga en el cierre;
- una frase para recordar antes del CTA, que repite una palabra del gancho;
- el tema en `topic`: `video:script` avisa si se repite uno de los últimos 14 días.

## Imágenes, música y efectos

- **Primero lo que ya existe:** las primitivas, los objetos de Fluent Emoji (`carrusel:objeto`), los íconos y los logos oficiales. Una imagen generada es para lo que eso no da, como una escena de analogía o un sticker.
- **Generar:** `video:image` y `video:music` usan el proveedor de `media.config.json` y registran todo en `generated.json`. Cada generación se paga: no repitas sin `--replace` ni generes variantes que nadie pidió.
- **El mundo 3D es opcional:** solo cuando la persona pide el video en 3D (ver [docs/reel.md](../reel.md)). Entonces `video:image --world` suma `accounts/dev.json → world.style` (isométrico ilustrado) y la paleta de `video.json → art`. Sin `--world`, la imagen no lleva ese estilo. El modelo a veces dibuja letras: pide que no haya y revisa la imagen antes de usarla.
- **Logos y mascotas de marcas: primero el archivo.** Busca el oficial o uno de una fuente confiable (regla 6) y agrégalo al catálogo con `carrusel:logo add`. No los generes con `video:image`. El avatar se genera solo a partir de la ilustración de Jeremy, pasada con `--ref`.
- **El avatar es de la cuenta:** `avatar: {}` en `defineVideo` dibuja el de [assets/avatar](../../assets/avatar/README.md), sin copiar sprites a la pieza. La pieza solo dice dónde va (`size`, `top`, `scenes`) y, por escena, en qué momento ([El avatar por momentos](#el-avatar-por-momentos)). Va si es estratégico para el video o si se solicita explícitamente, y siempre como en `2026-10-27-mcp-vs-acp`: el avatar normal, sin fondo.
- **Efectos:** busca con `video:asset search`, agrega con `video:asset add` y usa en `sfx` el id del catálogo.

## Sincronizar con la voz

`useCue("palabra")` da los segundos en que se dice esa palabra dentro de la escena. Por ejemplo, `anim={{ en: useCue("ojo") }}`. Si la voz cambia, todo se mueve con ella. Los efectos también van por palabra, con `at: "ojo"`.

## Estilo: el del carrusel

Cada Reel se ve como un carrusel de la cuenta: lo que identifica a la cuenta no cambia, y lo demás sale del tema. Dos videos seguidos no se parecen, igual que dos carruseles.

- **Fijo: el marco del carrusel.** `PieceVideo` pone el video dentro de `<Slide>`: la pestaña de archivo arriba a la izquierda, la textura de puntos, la firma abajo y los subtítulos. Sin `stage`, un `<Slide>` por escena; con `stage`, uno solo para todo el video, con el mundo debajo. No lo cambies por pieza.
- **Por pieza: la dirección de arte (`art`).** Sale de la baraja del carrusel ([direcciones.json](../../skills/carrusel-taste/direcciones.json)):
  - **La dirección.** `video:baraja` reparte 3, sin las dos últimas que usaron los videos. Elige la que sirve al tema y anota `direction`, `dealt` y `reason`. Si la pieza tiene carrusel, el Reel puede tomar su `post.json → art` tal cual.
  - **La paleta y las tipografías** de esa dirección. El acento tiene que leerse a 4.5:1 sobre `bg` y sobre `surface`, porque los subtítulos marcan con él la palabra que se dice; `video:prepare` lo revisa.
  - **El ancla y la pestaña** (`tab`), como en el carrusel.
- **Por escena:** el tono (`tone`) y la composición, libre y sin plantillas. En los tonos `accent` e `invert`, los subtítulos subrayan la palabra que se dice en lugar de pintarla.

Usa el acento para lo que importa (el rayo que sí se calcula, la cifra nueva) y deja en tinta lo demás. Nada va encima de un logo: ni tachado, ni rajado, ni cubierto.

