# Flujo: carrusel

Cada carrusel se diseña para su tema. No hay plantillas de lámina: el agente decide cuántas láminas, qué composición y qué recurso visual tiene cada una, dentro de una dirección de arte que le reparte la baraja. Lo único fijo es el marco semiconstante de `<Slide>`: la pestaña de archivo, la textura de puntos y la firma. Su forma no cambia; su color sale de la paleta de la pieza.

Lee también [skills/carrusel-taste/SKILL.md](../skills/carrusel-taste/SKILL.md), [docs/anti-slop.md](../docs/anti-slop.md) y [docs/critica-carrusel.md](../docs/critica-carrusel.md) antes de diseñar.

## 1. Crear la pieza

```bash
npm run carrusel:nuevo -- <tema-en-kebab> [--cuenta dev]
```

Crea `content/AAAA-MM-DD-<tema>/` con `facts.json`, `post.json` y un `slides.tsx` de partida.

## 2. Investigar: `facts.json`

- Fuentes primarias: documentación oficial, changelog o anuncio. Las secundarias solo sirven para encontrar las primarias.
- Cada hecho lleva `claim`, `source`, `primary` y, si aplica, `note`. Lo que no puedas verificar va a `pendingToVerify` y no entra en la pieza.
- Si puedes probar el tema (correr el comando, instalar la herramienta), pruébalo y guarda capturas reales en la carpeta de la pieza.

## 3. Inventario del tema

Antes de pensar en diseño, anota de 6 a 10 cosas que pertenecen a este tema y a ningún otro:

- el comando, la función o el archivo exacto;
- los nombres propios y lo que significan;
- los números con fuente: versión, fecha, precio, límite, tiempo;
- el antes y el después: qué cambió, qué dejó de existir;
- la interfaz real o la salida real, si pudiste capturarla;
- la frase exacta del anuncio, si cabe en menos de 15 palabras;
- la restricción o el riesgo: lo que no hace, lo que cuesta, lo que puede salir mal;
- el error común que la gente comete con esto;
- **el ancla visual:** el logo oficial, la captura o el objeto que dice el tema sin leer.

De este inventario salen la idea y el gancho. Si el inventario tiene menos de 6 cosas, investiga más antes de diseñar.

## 4. Argumento

Escribe la pieza como una lista de afirmaciones, una por lámina, cada una con su prueba (un dato del inventario). Una lámina sin afirmación se borra. El número de láminas lo decide el argumento, de 4 a 10, no la costumbre.

## 5. La idea

Completa esta frase y guárdala en `post.json` → `idea`:

> En este carrusel, **[algo del inventario]** se vuelve **[el recurso visual]**.

**Prueba del competidor:** cambia el tema por otro parecido (otra herramienta, otra función). Si la frase sigue sirviendo, no es una idea; vuelve al inventario. "Explicarlo de forma clara y moderna" no es una idea.

Ejemplo: en el carrusel de mods, el camino que recorre cada evento dentro de Claude Code se vuelve una línea que cruza todas las láminas, y cada parada muestra dónde se mete un mod.

## 6. El gancho

La portada detiene el scroll con algo concreto del inventario, en 10 palabras o menos, y una sola cosa dominante. Elige el tipo de gancho según el tema, no el mismo cada vez:

| Tipo | Cuándo sirve |
|---|---|
| El comando o nombre real, enorme | hay un comando o función que el dev reconoce |
| El dato que contradice lo que se cree | algo cambió o dejó de ser cierto |
| El antes y el después | hay una comparación visible |
| El error común | la gente lo está haciendo mal |
| El número concreto | hay una cifra con fuente que sorprende |
| La pregunta que el dev ya se hace | el tema resuelve una duda frecuente |

## 7. Dirección de arte

Sigue [skills/carrusel-taste/SKILL.md](../skills/carrusel-taste/SKILL.md):

```bash
npm run carrusel:baraja -- --cuenta dev
npm run carrusel:logo -- <marca>          # slug y color oficial del ancla
```

1. De las 3 direcciones que te tocan, elige la que mejor sirva al tema y explica por qué en `art.reason`.
2. Una dirección base para todo el carrusel; las láminas interiores pueden tomar la forma de otra (anótala en `art.borrowed`) sin cambiar paleta ni tipografías.
3. Define `art.anchor`, `art.palette` y `art.fonts`.

## 8. Diseñar `slides.tsx`

- Exporta por defecto un arreglo de `<Slide>`. Importa las primitivas desde `@motor/ui`: `Slide`, `Logo`, `Icono`, `Img`, `Code`, `Window`, `Prompt` y `cx`.
- El lienzo mide 1080×1350, pero Tailwind está a escala 2x: diseña pensando en 540×675 con las clases normales. El área de contenido mide 540 × 577 y su esquina superior izquierda es (0, 0) para lo que posiciones con `absolute`.
- **Colores solo de la paleta:** `bg-bg`, `text-ink`, `bg-accent`, `text-accent-ink`, `bg-surface`, `text-muted` (y `stroke-`/`fill-` para SVG). `Slide` acepta `tone="base" | "accent" | "invert" | "surface"`.
- **Tipografías:** `font-display` para titulares, `font-sans` (por defecto) para texto, `font-notes` para anotaciones y `font-mono` solo en código.
- **La portada lleva el ancla grande** (`<Logo>`, `<Icono>` o `<Img ancla>`) y `swipe`.
- **Campos a sangre:** usa `underlay` de `<Slide>`; para que el contenido llegue al borde, usa `px-0` en el área de contenido, no márgenes negativos. El inspector mide el contraste contra lo que de verdad hay detrás.
- **Composición distinta entre láminas vecinas.** Si dos láminas seguidas tienen la misma estructura, rediseña una.
- **Una cosa dominante por lámina,** con dos o tres tamaños de texto como mucho.
- **Artefactos reales:** código con `<Code>` (se resalta solo), comandos reales, capturas con `<Img>`, prompts con `<Prompt>`, interfaz con `<Window>`. Lo ilustrativo se dice ("Ejemplo ilustrativo"); nunca se presenta como salida real.
- **Fuente y fecha** en la última lámina, en texto pequeño (13px como mínimo).
- Escribe JSX y Tailwind directo. Si un recurso se repite en muchos carruseles, propón agregarlo a `packages/carousel/src/ui/` en vez de copiarlo.

## 9. Renderizar e inspeccionar

```bash
npm run carrusel:render -- content/<pieza>
```

Genera `out/01.png` … `out/NN.png`, `out/revision.png`, `out/pulgar.png`, `out/texto-de-laminas.txt`, `out/texto-del-post.txt` y `out/textos-por-lamina.txt`.

El inspector abre cada lámina en un navegador real y mide: desbordes, texto cortado, contraste (contra lo que de verdad hay detrás, incluidas las capas a sangre, la firma y la pestaña), tamaño mínimo de letra, palabras por lámina, degradados, sombras, monoespaciada fuera de código, etiquetas en mayúsculas, número de tipografías fuera del código, frases de relleno y el ancla visual de la portada. Corrige todos los errores. Cada aviso es un error salvo que puedas defenderlo en una frase.

## 10. Mirar y criticar

Pasar el inspector no significa que esté bien. Abre `revision.png`, `pulgar.png` y cada PNG, y critícalos con [docs/critica-carrusel.md](../docs/critica-carrusel.md). Escribe la tabla de puntajes en `critica.md`, arregla los tres problemas principales, vuelve a renderizar y mira otra vez. Máximo tres rondas.

## 11. Puerta humana

Muestra a la persona `facts.json`, la idea, la dirección elegida con su razón, `revision.png`, la crítica final y el texto del post. No des la pieza por terminada sin su aprobación.
