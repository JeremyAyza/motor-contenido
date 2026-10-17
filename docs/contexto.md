# Contexto del proyecto

Resumen de lo decidido en las conversaciones con Claude donde se creó y mejoró este repo (la última, el 16 de octubre de 2026), para seguir en otro chat o con otro agente sin perder nada. Las reglas operativas están en [AGENTS.md](../AGENTS.md); este archivo explica el **porqué** y lo que falta.

## 1. La persona y el objetivo

- **Jeremy Ayza**, Tech Lead con empleo estable en Lima, Perú. Trabaja como freelance de noche y los fines de semana.
- Quiere construir marca personal en Instagram con **dos cuentas separadas**:
  - **Cuenta dev** (`accounts/dev.json`): IA y programación, para ganar reputación. Usuario provisional: `@jeremyayza.dev`.
  - **Cuenta negocios** (`accounts/negocios.json`): para conseguir clientes. Usuario pendiente: `@pendiente`.
- Contenido automatizado y de alta calidad. Los **carruseles** son la entrada rápida y los **videos** pesan más en el algoritmo.

## 2. Principios acordados (no negociables)

1. **Calidad antes que ahorro de tokens.**
2. **Agnóstico al agente:** todo vive en AGENTS.md, workflows, esquemas y skills con formato estándar. Debe funcionar con Claude Code, Codex, Gemini CLI, Cursor o Antigravity.
3. **Carrusel y video son flujos separados.** Solo comparten la marca (firma y avatar). El carrusel **no lleva voz**.
4. **Nada de estructura fija ni plantillas de lámina.** Cada carrusel se diseña para su tema y el número de láminas es dinámico.
5. **Datos con fuente primaria** y fecha de revisión. Lo reciente se investiga, no se recuerda. No se inventan comandos, salidas, cifras ni testimonios. También valen los benchmarks de los referentes de `docs/referentes.md`, rotulados "Según X". Jeremy decidió no agregar más capas de verificación automática: alcanza con fuentes oficiales.
6. **Dos puertas humanas:** Jeremy aprueba el brief (tesis, gancho, esqueleto, CTA) en la puerta A, antes del diseño, y la pieza final en la puerta B.
7. **Confidencialidad:** nunca usar código, capturas, proyectos, clientes, métricas ni datos del empleador de Jeremy.
8. **Credenciales:** las API keys van en el `.env` local (está en `.gitignore`). Nunca se pegan en el chat ni se commitean.
9. **No automatizar** el envío de DMs ni de solicitudes de conexión.
10. **Logos y mascotas:** Jeremy considera válido usar el logo o la mascota de una empresa cuando el contenido habla de ella, como difusión educativa. El acuerdo: se usan **archivos oficiales sin modificar** (Simple Icons, kits de prensa) o **capturas reales**. **Nunca se dibujan ni se imitan** logos, mascotas o personajes.
11. **Estilo de texto:** español neutro, sin guiones largos (—), sin frases de relleno, una afirmación por lámina.
12. **No hace falta probar** lo que se publica: la promesa "probado de verdad" del lema salió del contexto, no de Jeremy. El ángulo sale de la investigación (letra chica, cuentas hechas, oficial contra referentes).
13. **Skills de terceros sin traducir:** se instalan tal cual en `.agents/skills/` y lo que cambia para este repo va en una capa aparte (`skills/ig-es/`), con wrappers.

## 3. Cómo llegamos al diseño actual del carrusel

Así se fue corrigiendo el rumbo, para no repetir errores:

1. **Primera versión:** plantillas fijas por tipo de lámina. Jeremy: "se ve robótico, siempre la misma estructura aburrida".
2. **Segunda versión:** diseño libre con React y Tailwind, un inspector anti-slop y una rúbrica de crítica. Jeremy: "mejor, pero aún aburrido; faltan elementos visuales del tema". El ejemplo que dio: si el tema es Claude, que salga su ícono o su mascota.
3. **Tercera versión (el diseño actual):**
   - **Baraja de 12 direcciones de arte.** Se mostraron las 12 primero con el tema de mods y después con "Gemini 4 Argon vs Opus 5.5". Jeremy aprobó **todas**.
   - **Marco semiconstante,** inspirado en el feed de la cuenta bittabyte: una sola forma fija (pestaña de archivo arriba a la izquierda, textura de puntos y la firma `</>` + usuario abajo) que **cambia de color** en cada carrusel.
   - **Ancla visual obligatoria:** quien hace scroll rápido tiene que reconocer el tema sin leer. Puede ser un logo oficial, una captura o un objeto.
   - **Una dirección base por carrusel,** con la misma paleta y las mismas tipografías en todas las láminas. Una lámina interior puede tomar la forma de otra dirección cuando el contenido lo pide. Esta fue la recomendación de Claude y Jeremy la aceptó.
4. **Cuarta versión: el contenido** ([docs/plan-carrusel-9-5.md](plan-carrusel-9-5.md)). Una revisión honesta del pipeline dio diseño 8/10 y contenido 5/10: producía resúmenes de lanzamientos bien armados. Se agregó:
   - **paso editorial** (`brief.json`): tesis con ángulo, público, objetivo (guardar, enviar o comentar), a quién se lo mandaría el lector, 8 a 10 ganchos de 4 fórmulas y esqueleto, aprobado en la **puerta A**;
   - **crítico ciego** en un contexto nuevo, con rúbrica de 70% contenido y 30% diseño y calibración con las notas de Jeremy;
   - **letra para el celular:** cuerpo de 32px reales o más, 35 palabras por lámina, contraste 4.5:1 en texto chico;
   - **cierre dinámico:** la última lámina cierra lo que abrió la portada, con un solo CTA específico del tema (idea de Jeremy). "Compártelo con quien lo necesite" se marca como cebo genérico;
   - **instagram-agent-skill** (MIT) instalada en `.agents/skills/`, con wrappers en español para el texto del post, el humanizador, el puntaje de ganchos y el archivo de referencias;
   - **radar** semanal de temas, **swipe** mensual de cuentas de referencia y **métricas** por pieza con revisión mensual.
   - Jeremy pidió mantener la baraja y la portada dinámica tal cual, y no tocar la verificación de datos.

## 4. Estado del repo

GitHub: `JeremyAyza/motor-contenido`, rama `main`.

| Commit | Qué trae |
|---|---|
| `94c67c9` | Base: marca, flujo de carrusel, pieza de ejemplo |
| `c89e178` | Diseño libre con React + Tailwind, inspector y crítica |
| `047ea3a` | Baraja de 12 direcciones, ancla visual, marco semiconstante, arte por pieza |
| `b1579b0` | Carrusel de mods aprobado |
| `a44d13d` | Este archivo de contexto |
| `2579e4a` | Pieza de Gemini 4 Argon, borrador de instagram-agent-skill en formato viejo, cambio a pnpm (hecho con otro agente) |
| (sin commit) | Cuarta versión: paso editorial, crítico ciego, skills ig-* y wrappers, radar y métricas |

### Stack del carrusel

- Monorepo en TypeScript con `tsx`, React 19 (`renderToStaticMarkup`) y Tailwind v4 (CLI, con `@theme` generado por pieza).
- `tailwind-merge`, para que las clases del agente ganen sobre las de las primitivas.
- `playwright-core` 1.56 con Chromium. Se diseña en 540×675 y se captura a escala 2, así que salen PNG de 1080×1350. Si no está el Chromium exacto, el render usa otro Chromium de Playwright o Chrome/Edge del sistema.
- Shiki para resaltar código.
- Zod v4 para validar `post.json`, `brief.json` y `metricas.json` y exportarlos como JSON Schema.
- Python 3 para las skills `ig-*` y sus wrappers (`npm run py` encuentra el intérprete; en Windows `python3` suele ser un acceso directo vacío de la Microsoft Store).
- Gestor de paquetes: pnpm (`pnpm-lock.yaml`); npm también funciona. La CLI ignora el `--` que pasa pnpm.
- Tipografías libres desde npm, embebidas como data URL: Geist, Geist Mono, Archivo (variable, de ancho y peso), Instrument Serif, Fraunces, Bricolage Grotesque y Caveat.
- Íconos: Simple Icons (CC0, logos oficiales) y Lucide (ISC, objetos genéricos). `svg-path-bbox` recorta el espacio vacío de los logos.

### Piezas clave

| Archivo | Para qué |
|---|---|
| `skills/carrusel-taste/SKILL.md` | Proceso de dirección de arte: baraja, ancla, paleta, tipografías, composición |
| `skills/carrusel-taste/direcciones.json` | Las 12 direcciones: idea, cuándo usarla, portada, interior, tipografías, paleta, qué evitar |
| `skills/carrusel-taste/referencias/` | Hoja con las 12 portadas y la prueba del pulgar, con y sin ancla |
| `packages/carousel/src/ui/index.tsx` | Primitivas: `Slide` (marco, con `tone`, `underlay` y contador opcional), `Logo`, `Icono`, `Img` (con `ancla` y `credit`), `Code`, `Window`, `Prompt`, `Nota`, `cx` |
| `packages/carousel/src/render.tsx` | Render, inspector en el navegador y búsqueda del navegador |
| `packages/carousel/src/brief.ts`, `editorial.ts` | Esquema de `brief.json` y armado de la puerta A |
| `packages/carousel/src/texto.ts` | Revisión de textos con los wrappers de `skills/ig-es` |
| `packages/carousel/src/critica.ts` | Carpeta del crítico ciego |
| `packages/carousel/src/metricas.ts` | Esquema de `metricas.json` e informe en `docs/metricas.md` |
| `packages/carousel/src/python.ts` | Lanzador de Python |
| `packages/carousel/src/direcciones.ts` | Carga la baraja, arma el historial desde `content/*/post.json` y reparte |
| `packages/carousel/src/post.ts` | Esquema de `post.json`, incluidos `art`, `busqueda` y `alt` |
| `packages/brand/src/fonts.ts` | Catálogo de tipografías |
| `accounts/*.json` | Solo la firma: usuario, glifo, avatar y voz. Los colores ya no viven aquí |
| `workflows/carrusel.md` | Los 14 pasos del flujo, con las puertas A y B |
| `workflows/radar.md`, `workflows/metricas.md` | Qué temas se hacen y qué funcionó |
| `.agents/skills/ig-*` | instagram-agent-skill (MIT), sin modificar |
| `skills/ig-es/` | Capa en español: `slop-es.json`, `ganchos-es.json` y wrappers `*_es.py` |
| `docs/anti-slop.md`, `docs/critica-carrusel.md`, `docs/critico-ciego.md` | Prohibiciones, rúbrica ponderada y cómo correr la crítica ciega |
| `docs/voz.md`, `docs/referentes.md` | Voz de Jeremy (falta completarla) y benchmarks que se pueden citar |
| `docs/aprendizajes.md`, `docs/metricas.md`, `docs/swipe.md` | Lo que aprende la cuenta (los dos últimos los generan comandos) |

### Las 12 direcciones

Titular gigante, terminal, captura anotada, antes y después, línea continua, capa por capa, ficha técnica, diario de prueba, chat, collage, elige tu camino y personaje.

**Personaje** no entra en la baraja hasta que exista `assets/avatar/manifest.json` con sprites reales.

### Qué mide el inspector

Tamaños en px reales del PNG (el celular lo muestra a un 36%).

**Errores:**
- desbordes y texto cortado;
- contraste medido contra lo que de verdad hay detrás (`elementsFromPoint`): 4.5:1 para texto de menos de 48px, 3:1 para el más grande, el marco y las notas;
- texto de cuerpo de menos de 28px, código de menos de 26px, notas (`data-nota`) de menos de 24px;
- más de 50 palabras en una lámina o más de 20 en la portada (sin contar código ni notas);
- portada sin ancla visual;
- con brief: brief inválido, puerta A sin aprobar, última lámina sin `data-cta`;
- texto del post: más de 5 hashtags o más de 2200 caracteres.

**Avisos:**
- texto de cuerpo de menos de 32px, código de menos de 28px;
- más de 35 palabras, o más de 12 en la portada;
- más de 3 tamaños de letra por lámina;
- ancla menor al 2.5% de la lámina;
- degradados, sombras, monoespaciada fuera de código y mayúsculas espaciadas;
- más de dos tipografías fuera del código;
- guion largo, léxico de relleno (`skills/ig-es/slop-es.json`) y estructuras de IA en láminas y texto;
- CTA de la lámina distinto del brief, o petición del texto distinta del CTA;
- texto del post: primera línea de más de 125 caracteres, ninguna o varias peticiones, enlaces, falta de `alt`, panel de detección por debajo de PASS.

### Salidas de cada render (en `out/`, que no se versiona)

- `01.png` … `NN.png`;
- `revision.png`;
- `pulgar.png` (la portada como miniatura del perfil);
- `texto-de-laminas.txt`, `texto-del-post.txt`, `texto-alternativo.txt` y `textos-por-lamina.txt`;
- `revision-texto.txt` (salida de las skills `ig-caption` e `ig-human`);
- con `carrusel:brief`: `puerta-a.md` y `critica-ganchos/`; con `carrusel:critica`: `critica/`.

### Comandos

Ver [AGENTS.md](../AGENTS.md#comandos).

## 5. Piezas

| Pieza | Estado |
|---|---|
| `content/2026-10-16-mods-claude-code/` | **Aprobada el 16 de octubre de 2026,** antes de la cuarta versión. Línea continua, con captura anotada (lámina 4) y terminal (lámina 6). Le tocaron captura anotada, línea continua y titular gigante. 7 láminas, ancla: el cangrejo oficial de Claude Code |
| `content/2026-10-16-gemini-4-argon/` | Borrador del commit `2579e4a`, sin puerta humana. **Tiene errores de datos:** la URL del blog da 404 (la real es `blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/`, del 13 de octubre); el `curl` de la portada no existe en la documentación; Vertex AI no aparece en el anuncio; la salida de 1M no es "una sola llamada" sino tramos de 64K (long decode); lleva 6 hashtags. No se corrigió por decisión de Jeremy |
| `content/2026-10-16-instagram-agent-skill/` | Borrador del commit `2579e4a` en el formato de plantillas de la primera versión (`carousel.json`); el motor actual no lo renderiza. Buen candidato a pieza piloto del flujo nuevo |

**Antes de publicar la de mods:**
- Confirmar el usuario real de Instagram. Si no es `@jeremyayza.dev`, cambiar `accounts/dev.json` y volver a renderizar.
- Con el inspector nuevo da errores: contraste 4.3:1 en el texto chico de las láminas 3 y 7, y la fuente y el crédito sin `data-nota` (26px). No tiene CTA marcado ni `alt`. Arreglarlo es rápido, pero cambia una pieza aprobada: decide Jeremy.
- Para subirla a 5 puntos más adelante: capturar un mod real instalado con `/plugin` y mencionar `/diff` en la portada.

**Archivos sueltos en la raíz** (del commit `2579e4a`): `audio.wav` y `gato.png`. Ningún archivo los usa.

**Nota de precisión:** el anuncio oficial lista lo que un mod puede hacer, pero no dice en qué momento corre cada acción. Separarlas en "antes" y "después" es una lectura propia. Jeremy la aprobó así.

**Vistas previas locales** (`content/zz-*`, fuera de git por `.git/info/exclude`): existieron solo en el entorno de Claude y **no** están en el repo. Lo que se rescató de ellas está en `skills/carrusel-taste/referencias/`.

## 6. Investigación previa (revalidar antes de usar)

### Algoritmo de Instagram (a octubre de 2026)

- Los envíos por DM pesan mucho para el alcance.
- En video, el tiempo de visualización.
- Hay una regla de originalidad: el contenido reciclado se penaliza.
- Desde junio de 2026 existe un texto por lámina en los carruseles (`slideCaptions`).
- Según Metricool, los carruseles reciben unas 9 veces más guardados.
- Tope de 5 hashtags por post, anunciado por Instagram el 19 de diciembre de 2025 (revisado el 16 de octubre de 2026).
- Instagram puede volver a mostrar un carrusel desde la segunda lámina a quien no deslizó la primera vez (Mosseri, citado por medios de marketing; no se encontró la fuente original). Por eso la lámina 2 tiene que entenderse sola.

### Cuentas de referencia que compartió Jeremy

midu.dev, rick.theengineer, peterstewiestartup, bittabyte, sanmunoz.ia, saas_in_house, sebastiankra.ia y soyenriquerocha. De bittabyte salió la idea del fondo semiconstante.

### Voz para los videos

- **Voz realista generada con IA, sin clonar la de Jeremy:** él no quiere clonarla porque su voz no es profesional.
- **Arquitectura desacoplada del proveedor:** interfaz `VoiceProvider` con un adaptador por proveedor.
- **Candidatos evaluados:** ElevenLabs (Eleven v4), Gemini 3.8 Flash TTS, Cartesia Sonic 3.6, Qwen Audio 3.1 y Fish Audio. Higgsfield también ofrece API y MCP.
- **Tiempos por palabra:** si el proveedor no los da, se calculan con whisper.cpp. Además, diccionario de pronunciación y caché por texto y voz.
- **Pendiente:** una prueba a ciegas en español para elegir proveedor.

### Skills de carrusel evaluadas

- **De terceros:** marcolang/instagram-carousel, blacktwist/carousel-writer-sms, social-media-skills/carousel-writer, jeevanbavandla, charlie947/gemini-carousel y kostja94.
- **Taste** (Leonxlnx/taste-skill, MIT): sus principios se adaptaron en `skills/carrusel-taste` y `docs/anti-slop.md`, sin lo que es de páginas web.
- **instagram-agent-skill** (Jakeschincariol, MIT, commit `d03c56b`): instalada sin modificar en `.agents/skills/`. Su autor midió que el puntaje de ganchos descarta bien los malos (AUC 0.83) pero casi no elige ganadores (AUC 0.56): se usa solo como filtro.

### Fuera del repo

- Jeremy tiene en su cuenta de Claude las skills `motor-prospeccion` (mensajes a prospectos y prompts de contenido) y `radar-oportunidades` (evaluar negocios o rubros). Son útiles para la cuenta de negocios.
- Hay un documento del plan en Claude Docs (id `2728de07-3e38-48d5-abe4-279302abffc6`) con la estrategia de las dos cuentas y la sección técnica del motor. **Su sección técnica está desactualizada** respecto de este repo; manda el repo.

## 7. Próximos pasos

1. **Probar el flujo nuevo con piezas reales** (Jeremy lo va a evaluar generando pruebas). Lo que falta de su lado:
   - completar `docs/voz.md` (de 3 a 5 textos suyos, posturas, palabras) y elegir el lema nuevo de la cuenta;
   - aprobar la lista de cuentas para el swipe y calificar de 6 a 10 carruseles de referencia para calibrar al crítico ciego;
   - después de publicar, pasar las capturas de Insights a los 2 y 7 días.
2. **Publicar el carrusel de mods** después de confirmar el usuario (y decidir si se ajusta al inspector nuevo).
3. **Flujo de video**, diseñado en [workflows/video.md](../workflows/video.md):
   1. Prueba a ciegas de voces en español, con las API keys de Jeremy en `.env`.
   2. Diseño del avatar y sus sprites: poses, expresiones y bocas A a H más X de Rhubarb. Ver `assets/avatar/README.md`.
   3. Elegir entre Remotion y HyperFrames, y armar el catálogo de escenas animadas: terminal, comparativa, flujo, medidor, código y frase.
   4. Usar `ig-reel` (26 fórmulas, `beats.py`) e `ig-repurpose` de `.agents/skills`, con un wrapper en `skills/ig-es` si hace falta.
4. **Más carruseles:** cada uno pasa por el radar, el brief y la baraja. La primera pieza de la cuenta de negocios va a necesitar anclas con `<Icono>` (temas sin marca).
5. **Mejoras posibles del motor:**
   - un comando que capture páginas en alta resolución para las capturas anotadas;
   - convertir la dirección "personaje" cuando existan los sprites;
   - leer Insights con la API de Instagram (solo lectura) en vez de transcribir capturas.

## 8. Cómo arrancar en un chat nuevo

En tu clon local:

```bash
git pull
pnpm install
```

Y en Claude Code (o cualquier agente), dentro del repo:

> Lee AGENTS.md y docs/contexto.md. Seguimos con [lo que toque: el flujo de video / un carrusel nuevo sobre X].
