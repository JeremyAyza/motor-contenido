# Contexto del proyecto

Resumen de todo lo decidido en la conversación con Claude donde se creó este repo (cerrada el 16 de octubre de 2026), para seguir en otro chat o con otro agente sin perder nada. Las reglas operativas están en [AGENTS.md](../AGENTS.md); este archivo explica el **porqué** y lo que falta.

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
5. **Datos con fuente primaria** y fecha de revisión. Lo reciente se investiga, no se recuerda. No se inventan comandos, salidas, cifras ni testimonios.
6. **Puerta humana:** Jeremy aprueba ficha, idea, láminas y texto antes de publicar.
7. **Confidencialidad:** nunca usar código, capturas, proyectos, clientes, métricas ni datos del empleador de Jeremy.
8. **Credenciales:** las API keys van en el `.env` local (está en `.gitignore`). Nunca se pegan en el chat ni se commitean.
9. **No automatizar** el envío de DMs ni de solicitudes de conexión.
10. **Logos y mascotas:** Jeremy considera válido usar el logo o la mascota de una empresa cuando el contenido habla de ella, como difusión educativa. El acuerdo: se usan **archivos oficiales sin modificar** (Simple Icons, kits de prensa) o **capturas reales**. **Nunca se dibujan ni se imitan** logos, mascotas o personajes.
11. **Estilo de texto:** español neutro, sin guiones largos (—), sin frases de relleno, una afirmación por lámina.

## 3. Cómo llegamos al diseño actual del carrusel

Así se fue corrigiendo el rumbo, para no repetir errores:

1. **Primera versión:** plantillas fijas por tipo de lámina. Jeremy: "se ve robótico, siempre la misma estructura aburrida".
2. **Segunda versión:** diseño libre con React y Tailwind, un inspector anti-slop y una rúbrica de crítica. Jeremy: "mejor, pero aún aburrido; faltan elementos visuales del tema". El ejemplo que dio: si el tema es Claude, que salga su ícono o su mascota.
3. **Tercera versión (la actual):**
   - **Baraja de 12 direcciones de arte.** Se mostraron las 12 primero con el tema de mods y después con "Gemini 4 Argon vs Opus 5.5". Jeremy aprobó **todas**.
   - **Marco semiconstante,** inspirado en el feed de la cuenta bittabyte: una sola forma fija (pestaña de archivo arriba a la izquierda, textura de puntos y la firma `</>` + usuario abajo) que **cambia de color** en cada carrusel.
   - **Ancla visual obligatoria:** quien hace scroll rápido tiene que reconocer el tema sin leer. Puede ser un logo oficial, una captura o un objeto.
   - **Una dirección base por carrusel,** con la misma paleta y las mismas tipografías en todas las láminas. Una lámina interior puede tomar la forma de otra dirección cuando el contenido lo pide. Esta fue la recomendación de Claude y Jeremy la aceptó.

## 4. Estado del repo

GitHub: `JeremyAyza/motor-contenido`, rama `main`.

| Commit | Qué trae |
|---|---|
| `94c67c9` | Base: marca, flujo de carrusel, pieza de ejemplo |
| `c89e178` | Diseño libre con React + Tailwind, inspector y crítica |
| `047ea3a` | Baraja de 12 direcciones, ancla visual, marco semiconstante, arte por pieza |
| `b1579b0` | Carrusel de mods aprobado |

### Stack del carrusel

- Monorepo en TypeScript con `tsx`, React 19 (`renderToStaticMarkup`) y Tailwind v4 (CLI, con `@theme` generado por pieza).
- `tailwind-merge`, para que las clases del agente ganen sobre las de las primitivas.
- `playwright-core` con Chromium. Se diseña en 540×675 y se captura a escala 2, así que salen PNG de 1080×1350.
- Shiki para resaltar código.
- Zod v4 para validar `post.json` y exportarlo como JSON Schema.
- Tipografías libres desde npm, embebidas como data URL: Geist, Geist Mono, Archivo (variable, de ancho y peso), Instrument Serif, Fraunces, Bricolage Grotesque y Caveat.
- Íconos: Simple Icons (CC0, logos oficiales) y Lucide (ISC, objetos genéricos). `svg-path-bbox` recorta el espacio vacío de los logos.

### Piezas clave

| Archivo | Para qué |
|---|---|
| `skills/carrusel-taste/SKILL.md` | Proceso de dirección de arte: baraja, ancla, paleta, tipografías, composición |
| `skills/carrusel-taste/direcciones.json` | Las 12 direcciones: idea, cuándo usarla, portada, interior, tipografías, paleta, qué evitar |
| `skills/carrusel-taste/referencias/` | Hoja con las 12 portadas y la prueba del pulgar, con y sin ancla |
| `packages/carousel/src/ui/index.tsx` | Primitivas: `Slide` (marco, con `tone` y `underlay`), `Logo`, `Icono`, `Img` (con `ancla` y `credit`), `Code`, `Window`, `Prompt`, `cx` |
| `packages/carousel/src/render.tsx` | Render más inspector en el navegador |
| `packages/carousel/src/direcciones.ts` | Carga la baraja, arma el historial desde `content/*/post.json` y reparte |
| `packages/carousel/src/post.ts` | Esquema de `post.json`, incluido `art` |
| `packages/brand/src/fonts.ts` | Catálogo de tipografías |
| `accounts/*.json` | Solo la firma: usuario, glifo, avatar y voz. Los colores ya no viven aquí |
| `workflows/carrusel.md` | Los 11 pasos del flujo |
| `docs/anti-slop.md`, `docs/critica-carrusel.md` | Prohibiciones y rúbrica de 12 puntos (todos deben tener 4 o más) |

### Las 12 direcciones

Titular gigante, terminal, captura anotada, antes y después, línea continua, capa por capa, ficha técnica, diario de prueba, chat, collage, elige tu camino y personaje.

**Personaje** no entra en la baraja hasta que exista `assets/avatar/manifest.json` con sprites reales.

### Qué mide el inspector

**Errores:**
- desbordes y texto cortado;
- contraste menor a 3:1, medido contra lo que de verdad hay detrás (`elementsFromPoint`), incluidas las capas a sangre, la firma y la pestaña;
- letra menor a 22px reales;
- más de 70 palabras en una lámina;
- portada sin ancla visual.

**Avisos:**
- ancla menor al 2.5% de la lámina;
- más de 50 palabras;
- degradados, sombras, monoespaciada fuera de código y mayúsculas espaciadas;
- más de dos tipografías fuera del código;
- guion largo y frases de relleno.

### Salidas de cada render (en `out/`, que no se versiona)

- `01.png` … `NN.png`;
- `revision.png`;
- `pulgar.png` (la portada como miniatura del perfil);
- `texto-de-laminas.txt`, `texto-del-post.txt` y `textos-por-lamina.txt`.

### Comandos

```bash
npm install
npx playwright install chromium            # o define CHROME_PATH con tu Chrome
npm run carrusel:nuevo -- <tema> [--cuenta dev]
npm run carrusel:baraja -- --cuenta dev     # --todas para ver las 12
npm run carrusel:logo -- <marca>
npm run carrusel:render -- content/<pieza>
npm run carrusel:esquema
npm run typecheck
```

## 5. Piezas

| Pieza | Estado |
|---|---|
| `content/2026-10-16-mods-claude-code/` | **Aprobada el 16 de octubre de 2026.** Línea continua, con captura anotada (lámina 4) y terminal (lámina 6). Le tocaron captura anotada, línea continua y titular gigante. 7 láminas, ancla: el cangrejo oficial de Claude Code |

**Antes de publicarla:**
- Confirmar el usuario real de Instagram. Si no es `@jeremyayza.dev`, cambiar `accounts/dev.json` y volver a renderizar.
- Para subirla a 5 puntos más adelante: capturar un mod real instalado con `/plugin` y mencionar `/diff` en la portada.

**Nota de precisión:** el anuncio oficial lista lo que un mod puede hacer, pero no dice en qué momento corre cada acción. Separarlas en "antes" y "después" es una lectura propia. Jeremy la aprobó así.

**Vistas previas locales** (`content/zz-*`, fuera de git por `.git/info/exclude`): existieron solo en el entorno de Claude y **no** están en el repo. Lo que se rescató de ellas está en `skills/carrusel-taste/referencias/`.

## 6. Investigación previa (revalidar antes de usar)

### Algoritmo de Instagram (a octubre de 2026)

- Los envíos por DM pesan mucho para el alcance.
- En video, el tiempo de visualización.
- Hay una regla de originalidad: el contenido reciclado se penaliza.
- Desde junio de 2026 existe un texto por lámina en los carruseles (`slideCaptions`).
- Según Metricool, los carruseles reciben unas 9 veces más guardados.

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

### Fuera del repo

- Jeremy tiene en su cuenta de Claude las skills `motor-prospeccion` (mensajes a prospectos y prompts de contenido) y `radar-oportunidades` (evaluar negocios o rubros). Son útiles para la cuenta de negocios.
- Hay un documento del plan en Claude Docs (id `2728de07-3e38-48d5-abe4-279302abffc6`) con la estrategia de las dos cuentas y la sección técnica del motor. **Su sección técnica está desactualizada** respecto de este repo; manda el repo.

## 7. Próximos pasos

1. **Publicar el carrusel de mods** después de confirmar el usuario.
2. **Flujo de video**, diseñado en [workflows/video.md](../workflows/video.md):
   1. Prueba a ciegas de voces en español, con las API keys de Jeremy en `.env`.
   2. Diseño del avatar y sus sprites: poses, expresiones y bocas A a H más X de Rhubarb. Ver `assets/avatar/README.md`.
   3. Elegir entre Remotion y HyperFrames, y armar el catálogo de escenas animadas: terminal, comparativa, flujo, medidor, código y frase.
3. **Más carruseles:** cada uno pasa por la baraja. La primera pieza de la cuenta de negocios va a necesitar anclas con `<Icono>` (temas sin marca).
4. **Mejoras posibles del motor:**
   - un comando que capture páginas en alta resolución para las capturas anotadas;
   - convertir la dirección "personaje" cuando existan los sprites.

## 8. Cómo arrancar en un chat nuevo

En tu clon local:

```bash
git pull
npm install
```

Y en Claude Code (o cualquier agente), dentro del repo:

> Lee AGENTS.md y docs/contexto.md. Seguimos con [lo que toque: el flujo de video / un carrusel nuevo sobre X].
