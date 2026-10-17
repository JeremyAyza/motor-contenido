# Flujo: carrusel

Cada carrusel se diseña para su tema. No hay plantillas de lámina: el agente decide cuántas láminas, qué composición y qué recurso visual tiene cada una, dentro de una dirección de arte que le reparte la baraja. Lo único fijo es el marco semiconstante de `<Slide>`: la pestaña de archivo, la textura de puntos y la firma. Su forma no cambia; su color sale de la paleta de la pieza.

Antes del diseño va la parte editorial: qué dice la pieza, para quién y qué hace el lector con ella. Esa parte la aprueba la persona en la **puerta A**, antes de escribir una sola lámina.

Lee también [skills/carrusel-taste/SKILL.md](../skills/carrusel-taste/SKILL.md), [skills/ig-es/SKILL.md](../skills/ig-es/SKILL.md), [docs/anti-slop.md](../docs/anti-slop.md), [docs/voz.md](../docs/voz.md) y [docs/critica-carrusel.md](../docs/critica-carrusel.md) antes de empezar.

| Paso | Qué sale | Quién decide |
|---|---|---|
| 0. Radar (semanal) | Temas con ángulo | Jeremy elige ([workflows/radar.md](radar.md)) |
| 1 a 6. Paso editorial | `facts.json`, `brief.json`, `out/puerta-a.md` | Jeremy aprueba en la puerta A |
| 7 a 10. Diseño y texto | `post.json`, `slides.tsx` | El agente, con el inspector |
| 11 y 12. Revisión | PNG, `revision-texto.txt`, informe del crítico ciego | El crítico ciego |
| 13. Puerta B | La pieza final | Jeremy aprueba |
| 14. Después de publicar | `metricas.json` | [workflows/metricas.md](metricas.md) |

## 1. Crear la pieza

```bash
npm run carrusel:nuevo -- <tema-en-kebab> [--cuenta dev]
```

Crea `content/AAAA-MM-DD-<tema>/` con `facts.json`, `brief.json`, `post.json` y un `slides.tsx` de partida. Con pnpm: `pnpm carrusel:nuevo <tema>`.

## 2. Investigar: `facts.json`

- Fuentes primarias: documentación oficial, changelog o anuncio. Las secundarias solo sirven para encontrar las primarias.
- Cada hecho lleva `claim`, `source`, `primary` y, si aplica, `note`. Lo que no puedas verificar va a `pendingToVerify` y no entra en la pieza.
- **Benchmarks y pruebas de terceros:** solo de [docs/referentes.md](../docs/referentes.md), con `primary: false` y `referente: "<id>"`. En la lámina se escriben como "Según <referente>", con fecha, y nunca se mezclan con los datos oficiales como si fueran lo mismo.
- Probar el tema (correr el comando, instalar la herramienta) es opcional. Si lo pruebas, guarda capturas reales en la carpeta de la pieza.

## 3. Inventario del tema

Anota de 6 a 10 cosas que pertenecen a este tema y a ningún otro:

- el comando, la función o el archivo exacto;
- los nombres propios y lo que significan;
- los números con fuente: versión, fecha, precio, límite, tiempo;
- el antes y el después: qué cambió, qué dejó de existir;
- la interfaz real o la salida real, si pudiste capturarla;
- la frase exacta del anuncio, si cabe en menos de 15 palabras;
- **la letra chica:** lo que no hace, lo que cuesta, lo que puede salir mal;
- el error común que la gente comete con esto;
- lo que miden los referentes, si contradice o matiza lo oficial;
- **el ancla visual:** el logo oficial, la captura o el objeto que dice el tema sin leer.

Si el inventario tiene menos de 6 cosas, investiga más antes de seguir.

## 4. Brief editorial: `brief.json`

El paso que convierte un tema en una pieza que alguien guarda o manda. Campos ([esquema](../schemas/brief.schema.json)):

| Campo | Qué es |
|---|---|
| `formato` | `noticia`, `ensenar`, `comparativa`, `error-comun`, `opinion` o `herramienta` |
| `tesis` | Una frase con la que alguien podría no estar de acuerdo, o que da una lectura que el anuncio no da |
| `palanca` | La palanca de ángulo, si la usaste (abajo) |
| `porQueAhora` | Por qué esta semana |
| `paraQuien` | Público específico ("devs que ya pagan una API de IA", no "devs") |
| `queGana` | Qué se lleva el lector: aprende a..., decide..., evita... |
| `objetivo` | `guardar`, `enviar` o `comentar` |
| `compartirCon` | A quién se lo mandaría el lector, con su situación concreta |
| `toma` | La opinión de Jeremy, si la hay (sale de las posturas de `docs/voz.md`) |
| `ganchos` | De 8 a 10 candidatos (paso 5) |
| `esqueleto` | Una línea por lámina: la afirmación y su prueba. De 5 a 10 láminas; una lámina sin afirmación se borra |
| `cta` | El cierre: `tipo` (guardar, enviar, comentar o seguir) y `texto` |

**Prueba del competidor editorial.** Si otra cuenta que solo leyó el anuncio podría publicar la misma tesis, falta ángulo. Usa una de estas palancas y anótala en `palanca`:

1. `que-cambia`: la consecuencia práctica concreta para el público.
2. `oficial-vs-independiente`: lo que dice el fabricante frente a lo que miden los referentes.
3. `cuentas-hechas`: el costo real de una tarea típica con los precios oficiales, marcado como cálculo propio.
4. `letra-chica`: lo que no hace, lo que cuesta, lo que puede salir mal.
5. `para-quien-no`: a quién no le sirve.

Ejemplo: "Llegó Gemini 4 Argon" es noticia. "El millón de tokens de salida existe, pero no sale de una vez: son tramos de 64K y pagas cada token" es una tesis (palanca `letra-chica`).

**Momentos obligatorios del esqueleto** (son ritmo, no plantilla):

- la **portada** con el gancho;
- una **lámina 2 que se entienda sola**: Instagram puede volver a mostrar el carrusel desde una lámina posterior a quien no deslizó la primera vez;
- el **cierre** con el CTA (paso 9).

Cuando el contenido es una lista, unos pasos o una comparación, agrega una **lámina de resumen** antes del cierre: la que se captura y se manda por DM.

**El CTA es específico del tema.** "Compártelo con quien lo necesite" es cebo genérico y el inspector lo marca. Nombra la situación:

| Objetivo | No | Sí |
|---|---|---|
| Enviar | "Compártelo con quien lo necesite" | "Mándaselo al de tu equipo que todavía paga por tokens que no usa" |
| Guardar | "Guarda este post" | "Guárdalo para la próxima vez que configures thinkingLevel" |
| Comentar | "¿Qué opinas?" | "¿Lo usarías en producción o esperas el precio de diciembre?" |

Sin CTA de "comenta una palabra y te mando el recurso": obliga a enviar DMs, y aquí no se automatizan.

## 5. Ganchos

Escribe de 8 a 10 ganchos para la portada, de **al menos 4 fórmulas distintas**:

- las 26 fórmulas de [`.agents/skills/ig-reel/hooks.json`](../.agents/skills/ig-reel/hooks.json) (lee la plantilla, el uso y la trampa de cada una) más la 27, "el nombre real, enorme"; los ids y los patrones en español están en [skills/ig-es/ganchos-es.json](../skills/ig-es/ganchos-es.json);
- **de 3 a 8 palabras**, más una línea de promesa opcional (`promesa`);
- algo concreto del inventario: el comando, el número, el nombre, el dato que contradice;
- las fórmulas con `requiere` solo con lo que corresponde: experiencia propia de Jeremy (nunca inventada) o un dato de `facts.json`.

Equivalencias con los tipos de gancho de antes:

| Tipo | Fórmulas |
|---|---|
| El comando o nombre real, enorme | 27, 24 |
| El dato que contradice lo que se cree | 22, 3, 20 |
| El antes y el después | 13, 5 |
| El error común | 7, 2 |
| El número concreto | 23, 11 |
| La pregunta que el dev ya se hace | 16, 10 |

## 6. Puerta A

```bash
npm run carrusel:brief -- content/<pieza>
```

Valida `brief.json`, pasa los ganchos por el filtro (`hookscore_es.py`, que descarta los débiles pero no elige al ganador) y escribe:

- `out/puerta-a.md`: el mensaje para la persona, con la tesis, el público, los ganchos filtrados, el esqueleto y el CTA;
- `out/critica-ganchos/`: la carpeta para que el crítico ciego ordene los 3 mejores ganchos en un contexto nuevo ([docs/critico-ciego.md](../docs/critico-ciego.md)).

Muéstrale a la persona `puerta-a.md` con el orden del crítico. **Sin su sí en el chat no se escribe `slides.tsx`.** Cuando apruebe, anota en `brief.json` el `ganchoElegido` (tal como lo eligió o lo reescribió) y `puertaA: { "aprobado": true, "fecha": "AAAA-MM-DD" }`. El render da error mientras la puerta A no esté aprobada.

## 7. La idea visual

Completa esta frase y guárdala en `post.json` → `idea`:

> En este carrusel, **[algo del inventario]** se vuelve **[el recurso visual]**.

**Prueba del competidor visual:** cambia el tema por otro parecido. Si la frase sigue sirviendo, no es una idea; vuelve al inventario. "Explicarlo de forma clara y moderna" no es una idea.

Ejemplo: en el carrusel de mods, el camino que recorre cada evento dentro de Claude Code se vuelve una línea que cruza todas las láminas, y cada parada muestra dónde se mete un mod.

## 8. Dirección de arte

Sigue [skills/carrusel-taste/SKILL.md](../skills/carrusel-taste/SKILL.md):

```bash
npm run carrusel:baraja -- --cuenta dev
npm run carrusel:logo -- <marca>          # slug y color oficial del ancla
```

1. De las 3 direcciones que te tocan, elige la que mejor sirva al tema y explica por qué en `art.reason`.
2. Una dirección base para todo el carrusel; las láminas interiores pueden tomar la forma de otra (anótala en `art.borrowed`) sin cambiar paleta ni tipografías.
3. Define `art.anchor`, `art.palette` y `art.fonts`.

## 9. Diseñar `slides.tsx`

Sigue el esqueleto aprobado, con el gancho elegido en la portada.

- Exporta por defecto un arreglo de `<Slide>`. Importa las primitivas desde `@motor/ui`: `Slide`, `Logo`, `Icono`, `Img`, `Code`, `Window`, `Prompt`, `Nota` y `cx`.
- El lienzo mide 1080×1350, pero Tailwind está a escala 2x: diseña pensando en 540×675 con las clases normales. El área de contenido mide 540 × 577 y su esquina superior izquierda es (0, 0) para lo que posiciones con `absolute`.
- **Letra para el celular** (la lámina se ve a un 36% del PNG): el texto de cuerpo va en **16px de diseño o más** (32 reales); 14px es el mínimo absoluto. El código, 14px o más. La letra chica que no es contenido (fuente, fecha, créditos, "ejemplo ilustrativo") va con `<Nota>` o `data-nota`, desde 12px.
- **Palabras:** la portada, 12 o menos; cada lámina interior, 35 o menos. El código y las notas no cuentan.
- **Contraste:** 4.5:1 para el texto de menos de 24px de diseño; 3:1 para el más grande.
- **Colores solo de la paleta:** `bg-bg`, `text-ink`, `bg-accent`, `text-accent-ink`, `bg-surface`, `text-muted` (y `stroke-`/`fill-` para SVG). `Slide` acepta `tone="base" | "accent" | "invert" | "surface"`.
- **Tipografías:** `font-display` para titulares, `font-sans` (por defecto) para texto, `font-notes` para anotaciones y `font-mono` solo en código.
- **La portada lleva el ancla grande** (`<Logo>`, `<Icono>` o `<Img ancla>`) y `swipe`.
- **La lámina 2 se entiende sola:** sin "como vimos" ni dependencias de la portada.
- **Campos a sangre:** usa `underlay` de `<Slide>`; para que el contenido llegue al borde, usa `px-0` en el área de contenido, no márgenes negativos. El inspector mide el contraste contra lo que de verdad hay detrás.
- **Composición distinta entre láminas vecinas.** Si dos láminas seguidas tienen la misma estructura, rediseña una.
- **Una cosa dominante por lámina,** con dos o tres tamaños de texto como mucho.
- **Artefactos reales:** código con `<Code>` (se resalta solo), comandos reales copiados de la documentación o de una ejecución real, capturas con `<Img>`, prompts con `<Prompt>`, interfaz con `<Window>`. Lo ilustrativo se dice ("Ejemplo ilustrativo"); nunca se presenta como salida real.
- **El cierre: despedida dinámica + CTA.** La última lámina cierra lo que abrió la portada: el mismo ancla, el mismo elemento visual o la respuesta a la pregunta del gancho. Se diseña dentro de la dirección de la pieza, así que cambia en cada carrusel igual que la portada. Lleva **un solo CTA**, el de `brief.json`, marcado con `data-cta` (`<p data-cta>...</p>`). Ahí van también la fuente y la fecha, con `<Nota>`.
- **Contador (experimento):** `post.json → art.contador: true` muestra n/N en el pie. Se decide con las métricas.
- Escribe JSX y Tailwind directo. Si un recurso se repite en muchos carruseles, propón agregarlo a `packages/carousel/src/ui/` en vez de copiarlo.

## 10. Texto del post: `post.json`

Sigue [`ig-caption`](../.agents/skills/ig-caption/SKILL.md) (trabajo B) con [skills/ig-es](../skills/ig-es/SKILL.md):

- **`caption`:** la primera línea es un gancho y cabe en los 125 caracteres visibles antes de "más"; párrafos cortos; **una sola petición, la misma del CTA**; sin enlaces; hasta 5 hashtags, al final, como etiquetas de tema.
- **`busqueda`:** de 2 a 3 frases por las que quieres que te encuentren. Van escritas dentro del texto como las escribiría una persona, no como hashtag.
- **`alt`:** texto alternativo de la portada.
- **`slideCaptions`:** un texto por lámina, opcional.
- En la voz de [docs/voz.md](../docs/voz.md).

## 11. Renderizar e inspeccionar

```bash
npm run carrusel:render -- content/<pieza>
```

Genera `out/01.png` … `out/NN.png`, `out/revision.png`, `out/pulgar.png`, `out/texto-de-laminas.txt`, `out/texto-del-post.txt`, `out/texto-alternativo.txt`, `out/textos-por-lamina.txt` y `out/revision-texto.txt`.

El inspector abre cada lámina en un navegador real y mide:

- **láminas:** desbordes, texto cortado, contraste contra lo que de verdad hay detrás (incluidas las capas a sangre, la firma y la pestaña), tamaño de letra por clase de texto, palabras por lámina y en la portada, tamaños distintos, degradados, sombras, monoespaciada fuera de código, etiquetas en mayúsculas, número de tipografías, frases de relleno (léxico de `skills/ig-es/slop-es.json`), el ancla de la portada y el CTA de la última lámina;
- **textos** (con los wrappers de `skills/ig-es`): lo visible del texto del post, hashtags, una sola petición y que sea la del CTA, enlaces, relleno, estructuras de IA ("No es solo X, es Y", tríadas, cebos) en el texto y en las láminas, y el panel de detección;
- **brief:** que exista, que sea válido y que la puerta A esté aprobada.

Corrige todos los errores. Cada aviso es un error salvo que puedas defenderlo en una frase. Si solo cambiaste el texto del post, `npm run carrusel:texto -- content/<pieza>` lo revisa sin volver a renderizar.

El render busca solo un navegador: el Chromium de Playwright que pide el repo, otro Chromium de Playwright instalado o Chrome/Edge del sistema. `CHROME_PATH` fuerza uno.

## 12. Crítico ciego

Pasar el inspector no significa que esté bien, y quien diseñó no puede juzgar su propia pieza.

```bash
npm run carrusel:critica -- content/<pieza>
```

Arma `out/critica/` con lo que vería alguien en Instagram. Dale esa carpeta a un **contexto nuevo** (un subagente o una sesión nueva) siguiendo [docs/critico-ciego.md](../docs/critico-ciego.md). El crítico escribe `out/critica/informe.md` con la rúbrica de [docs/critica-carrusel.md](../docs/critica-carrusel.md). Arregla los tres problemas principales, vuelve a renderizar y vuelve a criticar con un contexto nuevo. Máximo tres rondas. Copia el informe final en `critica.md`, en la carpeta de la pieza.

Umbral para la puerta B: todos los puntos en 4 o más, promedio ponderado de 4.5 o más y la tesis entendida en el paso 1.

## 13. Puerta B

Muestra a la persona `revision.png`, el texto del post y el informe del crítico ciego. El ángulo ya está aprobado: aquí se revisan el diseño y el texto. No des la pieza por terminada sin su aprobación.

## 14. Después de publicar

Sigue [workflows/metricas.md](metricas.md): métricas a las 48 horas y a los 7 días en `content/<pieza>/metricas.json`.
