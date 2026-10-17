# Plan para llevar el contenido del carrusel a 9.5/10

Propuesta del 16 de octubre de 2026. Sale de la revisión del pipeline del carrusel (diseño 8/10, contenido 5/10) y del feedback de Jeremy sobre cada observación.

## Estado de la implementación (16 de octubre de 2026)

Implementadas las fases 1 y 2, y las herramientas de la fase 3. Sin commit todavía. Jeremy lo va a evaluar generando piezas de prueba.

| Punto | Estado |
|---|---|
| 1. Dirección editorial | Hecho: `brief.json`, `carrusel:brief`, puerta A, `workflows/radar.md`, skills `ig-*` en `.agents/skills/` con wrappers en `skills/ig-es/` (sin traducir, a pedido de Jeremy) |
| 2. Referentes | Hecho: `docs/referentes.md` (revisados hoy), regla 1 de AGENTS.md, rúbrica sin "lo probó". **Pendiente de Jeremy:** el lema nuevo |
| 3. Verificación | Sin cambios, por decisión de Jeremy |
| 4. Crítico ciego | Hecho: `docs/critico-ciego.md`, rúbrica ponderada, `carrusel:critica`, plantilla de calibración. **Pendiente de Jeremy:** calificar los carruseles de referencia |
| 5. Legibilidad | Hecho: umbrales nuevos en el inspector, `<Nota>` y `data-nota` |
| 6. Baraja | Sin cambios, por decisión de Jeremy |
| 7. Métricas | Hecho: `metricas.json`, `carrusel:metricas`, `workflows/metricas.md`, `docs/aprendizajes.md`. Se llena al publicar |
| 8. Compartir y cierre | Hecho: `objetivo`, `compartirCon`, `despedida` y `cta` en el brief; jugadas de despedida y formas de CTA en `skills/carrusel-taste/cierres.json`, y tratamientos visuales del CTA (`art.cierre`, primitiva `<Gesto>`), con aviso si se repiten entre piezas seguidas; cierre con `data-cta` revisado por el inspector; texto del post con `caption_es`; contador opcional |
| 9. Voz | Plantilla hecha en `docs/voz.md`; humanizador en el render. **Pendiente de Jeremy:** sus textos y posturas |
| 10. Dos puertas | Hecho: puerta A obligatoria antes del render (error si no está aprobada) y puerta B al final |

Desvíos respecto de lo propuesto abajo: las skills no se tradujeron ni se pasaron a TypeScript (se usan las originales con wrappers en Python), y la copia de referencia no está en `third_party/` sino en `.agents/`.

## Qué significa 9.5/10 y cómo se mide

Una nota sin medición es una opinión. La nota de contenido se mide con tres cosas:

1. **El crítico ciego** (punto 4): promedio ponderado de 4.75 sobre 5 o más, sin ningún punto por debajo de 4.
2. **Las dos puertas humanas** (punto 10): Jeremy aprueba el ángulo en la primera sin pedir rehacerlo.
3. **Los resultados** (punto 7): en al menos 2 de cada 3 piezas, guardados por alcance y compartidos por alcance quedan por encima de la mediana de la cuenta.

Para ser honesto: el pipeline puede asegurar un piso de 8.5 a 9. Lo que lleva a 9.5 o 10 es elegir bien el tema, tener un ángulo con opinión y aprender de las métricas durante 15 a 20 piezas. Ningún pipeline lo garantiza desde la primera pieza.

## Resumen de decisiones

| # | Observación | Decisión de Jeremy | Qué se hace |
|---|---|---|---|
| 1 | Hay dirección de arte, pero no editorial | De acuerdo; integrar instagram-agent-skill | Paso 0 editorial (radar, brief y ganchos) e integración adaptada de las skills útiles |
| 2 | La promesa "probado de verdad" no se exige | No hace falta probar; sí sirven benchmarks no oficiales de referentes confiables | Se retira la promesa y se agrega una lista de referentes con reglas para citarlos |
| 3 | La verificación de datos se declara | No tocar | Sin cambios |
| 4 | La autocrítica no es una crítica real | (sin objeción) | Crítico ciego, rúbrica con más peso en contenido y calibración |
| 5 | El mínimo de letra no sirve en el celular | (sin objeción) | Subir los umbrales del inspector |
| 6 | La baraja busca variedad | Se queda: la portada dinámica llama más la atención | Sin cambios |
| 7 | No aprende | (sin objeción) | Métricas por pieza y revisión mensual |
| 8 | Nada pensado para el envío por DM | Última lámina: despedida dinámica y llamado a la acción | Brief con "a quién se lo mandas", lámina de resumen, cierre con un solo CTA específico y texto del post revisado |
| 9 | La voz es un adjetivo | (sin objeción) | `docs/voz.md` con textos reales y humanizador en español |
| 10 | La puerta humana llega al final | (sin objeción) | Dos puertas: brief antes del diseño y pieza final |

---

## 1. Dirección editorial

**Observación.** El flujo recibe un tema y salta a investigar. La "idea" del paso 5 es visual, y la prueba del competidor revisa la metáfora gráfica, no el mensaje. Un carrusel puede verse único y decir lo mismo que el comunicado de prensa.

**Feedback.** De acuerdo. Integrar instagram-agent-skill completa o al menos las partes útiles.

**Propuesta: un paso 0 con tres partes.**

### 1a. Radar semanal (adapta `ig-plan` e `ig-viral`)

Una vez por semana, el agente propone de 5 a 8 temas candidatos y Jeremy elige de 2 a 4. Cada candidato trae:

- **formato** (tabla de abajo);
- **ángulo** en una frase, no solo el tema ("IA" no es un plan);
- **por qué ahora** y **ventana**: si caduca en días o sirve siempre;
- **saturación**: si las cuentas de referencia ya lo publicaron, con enlace. Si ya lo hicieron, el ángulo distinto es obligatorio;
- **encaje** con la cuenta.

Mezcla sugerida para la cuenta dev, sin repetir formato dos veces seguidas:

| Formato | Para qué sirve | Frecuencia sugerida |
|---|---|---|
| Noticia con ángulo | Lo nuevo, contado desde qué cambia para ti | 1 a 2 por semana como máximo |
| Enseñar (cómo hacer X) | Guardados | 1 por semana |
| Comparativa | X contra Y con datos oficiales y de referentes | 1 cada 1 o 2 semanas |
| Error común o mito | Compartidos y comentarios | 1 cada 2 semanas |
| Opinión | Debate y voz propia | 1 cada 2 semanas |
| Herramienta o recurso | Guardados | Ocasional |

**Archivo de referencias (swipe), una vez al mes** (adapta `ig-viral`):

- De 8 a 12 cuentas: 4 del mismo nicho, 4 de nichos vecinos con el mismo público y 2 a 4 grandes, solo para mirar formatos. Se parte de las que ya compartiste: midu.dev, rick.theengineer, peterstewiestartup, bittabyte, sanmunoz.ia, saas_in_house, sebastiankra.ia y soyenriquerocha.
- Se lee con tu navegador, a ritmo humano. Nunca se inicia sesión por ti ni se hace scraping.
- Por cada carrusel se anota: cuenta, seguidores, mediana de me gusta de sus últimos 12 posts, me gusta y comentarios del post, formato, texto literal de la portada, número de láminas y CTA.
- Se ordena por **múltiplo sobre la mediana** (me gusta del post entre la mediana de la cuenta). Más de 3x es una señal; menos de 1.5x es un día normal. Los carruseles no muestran vistas públicas, así que los me gusta son un indicador débil y se dice así.
- Salida: `docs/swipe.md`, con las fórmulas de portada que más se repiten arriba y las que no se pudieron clasificar.

### 1b. Brief editorial: `content/<pieza>/brief.json`

Se escribe antes que `post.json` y es lo que se aprueba en la puerta A (punto 10). Campos:

| Campo | Qué es |
|---|---|
| `formato` | Uno de la tabla del radar |
| `tesis` | Una frase con la que alguien podría no estar de acuerdo, o que aporta una lectura que el anuncio no da |
| `porQueAhora` | Por qué esta semana |
| `paraQuien` | Público específico ("devs que ya pagan una API de IA", no "devs") |
| `queGana` | Qué se lleva el lector: aprende a…, decide…, evita… |
| `objetivo` | `guardar`, `enviar` o `comentar` |
| `compartirCon` | A quién se lo mandaría el lector (punto 8) |
| `toma` | Tu opinión, si la hay. Opcional pero recomendada; sale de las posturas de `docs/voz.md` |
| `ganchos` | De 8 a 10 candidatos, cada uno con su fórmula y su puntaje |
| `ganchoElegido` | El que eliges en la puerta A |
| `esqueleto` | Una línea por lámina: la afirmación y su prueba |
| `cta` | Tipo y texto del cierre (punto 8) |

**Prueba del competidor editorial.** Si otra cuenta que solo leyó el anuncio podría publicar la misma tesis, falta ángulo. Se agrega una de estas cinco palancas:

1. **Qué cambia para ti:** la consecuencia práctica concreta.
2. **Oficial contra independiente:** lo que dice el fabricante frente a lo que miden los referentes (punto 2).
3. **Cuentas hechas:** el costo real de una tarea típica con los precios oficiales, marcado como cálculo propio.
4. **La letra chica:** lo que no hace, lo que cuesta, lo que puede salir mal.
5. **Para quién no es.**

Ejemplo con la investigación de Gemini 4 Argon: "Llegó Gemini 4 Argon" es noticia. "El millón de tokens de salida existe, pero no sale de una vez: son tramos de 64K y pagas cada token" es una tesis. Sale de la letra chica de la documentación oficial y no la tiene quien solo leyó el anuncio.

**Ritmo narrativo (no es una plantilla visual).** El principio 4 se mantiene: nada de estructura fija ni plantillas de lámina. Solo tres momentos son obligatorios:

- la **portada** con el gancho;
- una **lámina 2 que se entienda sola**. Según `ig-carousel`, Instagram puede volver a mostrar un carrusel desde una lámina posterior a quien no interactuó la primera vez. Hay que revalidar ese dato antes de citarlo, pero la regla vale igual;
- el **cierre con CTA** (punto 8).

El resto lo decide el argumento, de 5 a 10 láminas.

### 1c. Ganchos

- Las 26 fórmulas de `.agents/skills/ig-reel/hooks.json` se usan tal cual (plantilla, uso y trampa en inglés), más la 27 ("el nombre real, enorme", de nuestra tabla de tipos). `skills/ig-es/ganchos-es.json` agrega solo lo que hace falta para español: los patrones para reconocer cada fórmula en portadas, un ejemplo y qué fórmulas requieren experiencia propia o fuente.
- Por cada pieza se generan de 8 a 10 ganchos de al menos 4 fórmulas distintas, de 3 a 8 palabras.
- El filtro es el `hookscore.py` original con un wrapper (`skills/ig-es/hookscore_es.py`) que cambia las listas al español y mide el largo de una portada. Su autor midió que detecta bien los ganchos malos pero no elige ganadores (le fue apenas mejor que tirar una moneda), así que **solo filtra**.
- El crítico ciego ordena los 3 mejores y **Jeremy elige** en la puerta A.

### Integración de instagram-agent-skill

Repositorio: `Jakeschincariol/instagram-agent-skill`, licencia MIT, commit `d03c56b` (13 de septiembre de 2026). Son 13 skills y 5 herramientas en Python.

**Decisión de Jeremy:** no traducirlas. Se instalan **sin modificar** en `.agents/skills/` y lo que hay que cambiar para este repo va en una capa aparte, a manera de wrapper: [`skills/ig-es/`](../skills/ig-es/SKILL.md). Python 3 está instalado (en Windows, `python3` es un acceso directo vacío de la Microsoft Store; el lanzador usa `python` o `py`).

Por qué hace falta la capa:

- **Las listas de los scripts están en inglés.** Con texto en español dan resultados falsos: el detector marcaría como de máquina cualquier texto (busca contracciones y pronombres en inglés) y el puntaje de ganchos no reconoce "deja de" ni "nadie te dice".
- **Las rutas son de `~/.claude/instagram/`.** Aquí son `docs/voz.md`, `docs/swipe.md`, `docs/radar/` y los archivos de cada pieza.
- **Algunas reglas chocan con las nuestras.** Numerar las láminas (3/8) contradice el anti-slop, y su esqueleto fijo contradice el principio 4: se toman como ritmo, no como plantilla. El CTA de palabra clave por DM choca con no automatizar DMs.

| Skill | Qué hace | Cómo se usa aquí |
|---|---|---|
| `ig-carousel` | Reglas del carrusel | Sus reglas en `workflows/carrusel.md`: segunda portada, lámina de resumen, un solo CTA, letra de 32px o más, copia aprobada antes del render |
| `ig-caption` + `caption.py` | Texto del post | `caption_es.py` (peticiones y hashtags en español); lo corre el render |
| `ig-reel/hooks.json` + `hookscore.py` | Fórmulas y puntaje de ganchos | `ganchos-es.json` y `hookscore_es.py`; lo corre `carrusel:brief` |
| `ig-human` + `slop.json` + scripts | Humanizador y detector | `slop-es.json`, `humanize_es.py` y `detect_es.py`; los corre el render. El inspector usa el mismo léxico |
| `ig-plan` | Plan semanal | `workflows/radar.md` |
| `ig-viral` + `swipe.py` | Archivo de referencias | `swipe_es.py` (me gusta en vez de vistas, encabezados en español); `carrusel:swipe` escribe `docs/swipe.md` |
| `ig-audit` | Análisis de lo publicado | `workflows/metricas.md` y `carrusel:metricas` |
| `templates/voice.md` | Perfil de voz | `docs/voz.md` |
| `ig-profile`, `ig-reel` (resto), `ig-repurpose`, `ig-story`, `ig-comment`, `ig-reply`, `ig-dm` | Perfil, Reels, stories, comentarios y DMs | Instaladas, fuera del flujo del carrusel por ahora |

**Hecho:** existen `workflows/radar.md`, el esquema de `brief.json`, `skills/ig-es/` y `.agents/skills/`. Falta una pieza piloto que pase por el paso 0 completo.

---

## 2. De "probado de verdad" a referentes confiables

**Observación.** El lema de `accounts/dev.json` promete "probado de verdad", pero el flujo no lo exige y la rúbrica puede dar 5 en voz sin que nadie haya probado nada.

**Feedback.** La promesa salió del contexto. No hace falta probar y no parece importarle mucho a la audiencia. Si es estratégico, la investigación puede incluir benchmarks no oficiales de referentes confiables.

**Propuesta:**

- **Retirar la promesa:**
  - cambiar el lema en `accounts/dev.json`; lo eliges tú. Ideas: "IA y código, con fuentes", "Lo nuevo en IA, explicado para devs", "IA para devs que construyen";
  - en la rúbrica, "Voz" deja de ser "suena a alguien que lo probó" y pasa a "suena a `docs/voz.md`";
  - en el anti-slop, cambiar "en voz de alguien que lo probó" por "en la voz de `docs/voz.md`";
  - en el paso 2 del flujo, probar queda como opcional.
- **Sí es estratégico usar referentes,** pero no por la promesa: es la forma más barata de conseguir ángulo. Los benchmarks oficiales los publica el propio fabricante; contrastarlos con una medición independiente es una tesis natural (palanca 2 del punto 1b) que la mayoría de cuentas no hace.
- **`docs/referentes.md`** con cada referente, qué mide, su URL y cómo citarlo. Candidatos (al implementar hay que confirmar que siguen activos y revisar su metodología):

| Referente | Qué mide |
|---|---|
| Artificial Analysis | Índices de inteligencia, velocidad y precio de modelos |
| LMArena | Preferencia humana en comparaciones a ciegas |
| Vals AI | Tareas por industria (código, finanzas, legal) |
| SWE-bench | Resolución de issues reales de código |
| Terminal-Bench | Agentes trabajando en terminal |
| Leaderboard de Aider | Edición de código |
| Epoch AI | Benchmarks agregados y tendencias |
| METR | Duración de las tareas que un modelo completa |
| Simon Willison | Pruebas prácticas publicadas (no es un benchmark) |

- **Reglas para usarlos:**
  - en `facts.json` van con `primary: false` y `referente: "<id>"`;
  - en la lámina se escriben como "Según <referente>", con fecha;
  - nunca se mezclan con datos oficiales como si fueran lo mismo;
  - la regla 1 de AGENTS.md pasa a decir: "Lo que no tenga fuente primaria **o de un referente de `docs/referentes.md`** no entra en la pieza".

Esto no toca cómo se verifica (punto 3): solo amplía qué fuentes valen y cómo se rotulan.

**Listo cuando:** el lema cambió, existen `docs/referentes.md` y la nueva regla 1, y la rúbrica ya no menciona probar.

---

## 3. Verificación de datos

**Decisión de Jeremy:** no se toca. Las fuentes salen de páginas y documentación oficiales.

**Sin cambios.** Una sola nota de riesgo, para que quede escrita: en la pieza de Gemini 4 Argon los errores no vinieron de fuentes malas sino de ir más allá de ellas. Hay un `curl` que no está en la documentación, Vertex AI aparece sin que lo mencione el anuncio y "1M de salida en una sola llamada" no es lo que dice la guía de long decode. Si eso vuelve a pasar con una pieza publicada, este punto se puede retomar.

---

## 4. Crítico ciego

**Observación.** La crítica la hace el mismo modelo que diseñó, conociendo sus razones. Se pone notas altas y la regla "todo con 4 o más" se cumple escribiendo 4. 8 de los 12 puntos son de diseño, y el gancho se califica por su forma.

**Propuesta:**

### 4a. Contexto separado

- `npm run carrusel:critica -- content/<pieza>` arma `out/critica/` con solo esto: los PNG, `pulgar.png`, `texto-del-post.txt` y el prompt de `docs/critico-ciego.md`.
- El crítico corre en un contexto nuevo: un subagente en Claude Code, o una sesión nueva en Codex, Gemini CLI o Cursor. No ve `slides.tsx`, `facts.json`, `brief.json` ni el razonamiento del diseño.

### 4b. Dos pasos

1. **En frío:** ¿de qué trata? ¿Cuál es la tesis, en una frase? ¿Qué harías: pasar de largo, deslizar, guardar o enviar? ¿A quién se lo mandarías?
2. Recién después se le muestra `brief.tesis`. **Si su resumen no coincide con la tesis, la pieza no pasa,** aunque las notas sean altas.

### 4c. Rúbrica nueva: 70% contenido, 30% diseño

| Punto | Peso | 5 significa |
|---|---|---|
| Gancho | 15% | La portada detendría a alguien del público de `brief.paraQuien`, y la lámina 2 se entiende sola |
| Tesis | 15% | El crítico la resume igual que el brief y no es el comunicado |
| Valor | 15% | El lector se lleva algo que puede usar o una lectura nueva |
| Compartible | 10% | Hay una lámina que alguien mandaría por DM: resumen, dato o comparación |
| Cierre y CTA | 10% | Despedida que cierra lo que abrió la portada, con un solo CTA específico (punto 8) |
| Voz | 5% | Suena a `docs/voz.md` |
| Legibilidad en el celular | 10% | Todo se lee en `revision.png` sin zoom |
| Ancla y dirección | 10% | El tema se reconoce en `pulgar.png`; la dirección se nota en todo el carrusel |
| Progresión y dominancia | 10% | Cada lámina avanza, tiene una sola cosa dominante y ninguna sobra |

- Para mostrársela a Jeremy: todos los puntos en 4 o más y un promedio ponderado de 4.5 o más.
- 9.5/10 equivale a un promedio ponderado de 4.75 o más.
- Se mantiene "no subas un puntaje sin haber cambiado algo visible".

### 4d. Calibración

- Jeremy califica una vez de 6 a 10 carruseles de referencia de las cuentas que sigue (unos 20 minutos).
- Las capturas van a `skills/carrusel-taste/referencias/externas/`, fuera de git (en `.gitignore`), porque son de terceros y solo sirven para calibrar.
- El crítico tiene que reproducir las notas de Jeremy con un margen de 0.5 en promedio antes de que se le crea. Si no llega, se ajusta su prompt con esos ejemplos.
- Se recalibra una vez al mes con las piezas publicadas y sus métricas.

**Listo cuando:** existen `docs/critico-ciego.md`, la rúbrica nueva en `docs/critica-carrusel.md`, el comando `carrusel:critica` y la calibración inicial.

---

## 5. Legibilidad en el celular

**Observación.** La imagen de 1080 de ancho se ve en unos 390px de pantalla (factor de 0.36). Los 22px reales que permite el inspector quedan en unos 8px. 70 palabras por lámina es mucho.

**Propuesta: nuevos umbrales en `packages/carousel/src/render.tsx`.**

| Medida | Hoy | Propuesta |
|---|---|---|
| Letra mínima (error) | 22px reales (unos 8px en el celular) | 28px reales (14px de diseño) |
| Letra chica (aviso) | De 22 a 26px reales | De 28 a 31px reales; el cuerpo va en 32px o más (16px de diseño, unos 11.5px en el celular) |
| Excepciones | Ninguna | Fuente, fecha y marco (`data-nota`, firma y pestaña): 24px reales o más |
| Palabras por lámina | Aviso sobre 50, error sobre 70 | Aviso sobre 35, error sobre 50 |
| Palabras en la portada | Sin regla | Aviso sobre 12, error sobre 20 |
| Contraste | 3:1 para todo | 4.5:1 para texto de menos de 48px reales; 3:1 para el más grande |
| Tamaños de letra por lámina | Regla escrita, sin medir | Aviso con más de 3 tamaños distintos |

`ig-carousel` llega a la misma conclusión: letra de 32px o más, porque "se lee en un celular a un tercio de su tamaño real".

**Listo cuando:** el inspector aplica los nuevos umbrales, `workflows/carrusel.md` y `docs/anti-slop.md` los mencionan, y `npm run typecheck` pasa.

---

## 6. La baraja y la portada dinámica

**Decisión de Jeremy:** se queda como está. La portada dinámica según el tema llama más la atención, y el marco semiconstante ya da la parte reconocible.

**Sin cambios.**

---

## 7. Aprender de los resultados

**Observación.** El motor no registra guardados, compartidos ni alcance de cada pieza. Sin eso, no sabe qué funciona con tu audiencia y todas las reglas son opiniones.

**Propuesta (adapta `ig-audit`):**

### 7a. `content/<pieza>/metricas.json`

Se llena a las 48 horas y a los 7 días, con esquema Zod:

```json
{
  "publicado": "2026-10-20T19:00:00-05:00",
  "etiquetas": { "formato": "comparativa", "formulaGancho": "head-to-head", "direccion": "antes-despues", "laminas": 7, "cta": "enviar" },
  "cortes": [
    { "dia": 7, "alcance": 0, "alcanceNoSeguidores": 0, "guardados": 0, "compartidos": 0, "comentarios": 0, "meGusta": 0, "visitasPerfil": 0, "seguidores": 0 }
  ]
}
```

Los nombres de las métricas hay que confirmarlos en Insights al implementar, porque Instagram los cambia.

### 7b. Cómo se cargan

- **Fase 1, manual:** le pasas al agente la captura de Insights y él la transcribe.
- **Fase 2, opcional:** la API de Instagram para cuentas profesionales, solo lectura de insights. Necesita una app de Meta y un token. No publica nada, no envía DMs y no choca con el principio 9.

### 7c. `npm run carrusel:metricas`

Tabla de todas las piezas, ordenada por:

- **compartidos por alcance:** la señal más fuerte;
- **guardados por alcance;**
- **seguidores por alcance:** si el perfil convierte;
- **múltiplo sobre la mediana de alcance de la cuenta.**

### 7d. Revisión mensual

- Se comparan las 5 mejores piezas con las 5 peores por formato, fórmula de gancho, dirección, número de láminas y tipo de CTA.
- Las conclusiones van a `docs/aprendizajes.md`, que el radar (punto 1a) lee antes de proponer temas. Así se cierra el ciclo.
- Con menos de 15 piezas no se saca ninguna conclusión. Se dice así en lugar de inventar un patrón.
- La distinción de `ig-audit` que conviene adoptar: alcance alto con pocos seguidores es un problema del perfil; poco alcance es un problema del gancho.

**Listo cuando:** existen el esquema, el comando y `workflows/metricas.md`, y la primera pieza publicada tiene su corte de 7 días.

---

## 8. Pensado para compartir y un cierre con llamado a la acción

**Observación.** Tu propia investigación dice que el envío por DM es lo que más pesa, y nadie piensa en a quién le mandaría alguien el carrusel.

**Feedback.** La última lámina puede ser una despedida dinámica más un CTA del tipo "guarda esto" o "compártelo con ese amigo que sabes que lo necesita".

**Propuesta:**

### 8a. Desde el brief

`objetivo` (guardar, enviar o comentar) y `compartirCon` se deciden antes de diseñar. Ejemplo de `compartirCon`: "el de tu equipo que sigue pegando todo el repo en el chat".

### 8b. Lámina de resumen

Cuando el contenido es una lista, unos pasos o una comparación, la penúltima lámina lo resume y se entiende sin contexto. Es la que se captura y se manda. Se diseña dentro de la dirección de la pieza, no con una plantilla.

### 8c. La última lámina: despedida dinámica + CTA

- **Despedida dinámica:** cierra lo que abrió la portada, con el mismo ancla, el mismo elemento visual o la respuesta a la pregunta del gancho. Se diseña en la dirección de arte de la pieza, así que cambia en cada carrusel igual que la portada.
- **Un solo CTA**, elegido según `brief.objetivo`.
- **El CTA tiene que ser específico del tema.** Para ser directo: "compártelo con ese amigo que sabes que lo necesita", dicho así, es la versión en español de "tag someone who needs this", una de las frases de relleno que `ig-human` marca como cebo. Funciona cuando nombra al amigo concreto o la situación concreta:

| Objetivo | Genérico (no) | Específico (sí) |
|---|---|---|
| Enviar | "Compártelo con quien lo necesite" | "Mándaselo al de tu equipo que todavía paga por tokens que no usa" |
| Guardar | "Guarda este post" | "Guárdalo para la próxima vez que configures thinkingLevel" |
| Comentar | "¿Qué opinas?" | "¿Lo usarías en producción o esperas el precio de diciembre?" |

- Seguir a la cuenta solo se pide cuando la pieza es parte de una serie.
- No se usa el CTA de "comenta una palabra y te mando el recurso", porque obliga a enviar DMs, y el principio 9 dice que no se automatizan. Se puede retomar si se responde a mano.
- La fuente y la fecha siguen en esa lámina, en letra pequeña (con la excepción del punto 5).

### 8d. Inspector

- La última lámina tiene que tener un elemento `data-cta` cuyo texto coincida con `post.json → cta.texto`.
- Aviso si el CTA coincide con la lista de frases genéricas.

### 8e. El texto del post acompaña el cierre (adapta `ig-caption`)

- La primera línea es un gancho y cabe en los 125 caracteres visibles antes de "más". El render la muestra recuadrada en `texto-del-post.txt`.
- Una sola petición, y es la misma que el CTA de la última lámina.
- Los términos de búsqueda se escriben como frase dentro del texto, no como hashtag.
- Como máximo 5 hashtags. Revalidado: Instagram anunció el tope el 19 de diciembre de 2025. La pieza de Gemini lleva 6.
- Sin enlaces en el texto.
- Texto alternativo para la portada.
- El `caption.py` original, con el wrapper `skills/ig-es/caption_es.py`, revisa todo esto en el render.

### 8f. Experimento opcional: contador de láminas

`ig-carousel` recomienda numerar (3/8) porque dice que más gente llega al final. Choca con la prohibición de numeración decorativa del anti-slop. Propuesta: probarlo en el marco, en el pie a la derecha, donde hoy dice "Desliza", y decidir con las métricas del punto 7. No es contenido numerado sino un indicador del marco.

**Listo cuando:** el brief tiene `objetivo`, `compartirCon` y `cta`; el flujo describe la lámina de resumen y el cierre; el inspector revisa `data-cta`, y el linter del texto del post corre en el render.

---

## 9. La voz

**Observación.** "Voz de alguien que lo probó" no es una guía. Sin textos tuyos como ejemplo, cada agente escribe con la voz genérica de quien explica tecnología.

**Propuesta:**

### 9a. `docs/voz.md` (adapta `templates/voice.md`)

- Quién eres y a quién le hablas, con un público específico.
- De 3 a 5 textos tuyos que suenen a ti: mensajes, posts o explicaciones, nunca nada del empleador.
- Palabras que usas y palabras que nunca dirías.
- Emojis: nunca, poco o libre.
- **De 3 a 5 posturas** con las que parte de tu público no está de acuerdo. De ahí salen la `toma` del brief y los carruseles de opinión.
- Temas que no tocas (el empleador ya está cubierto).
- El agente puede escribir el primer borrador a partir de tus textos, y tú lo corriges.

### 9b. Humanizador en español (usa `ig-human` con un wrapper)

- Los scripts originales (`humanize.py`, `detect.py`) corren tal cual para lo que no depende del idioma: caracteres invisibles, guiones largos, comillas curvas y puntos suspensivos de un solo carácter.
- El léxico de relleno en español (`skills/ig-es/slop-es.json`) reemplaza al inglés: pasó de las 13 entradas que tenía el inspector a más de 100. Ejemplos: "en el mundo actual", "cabe destacar", "es importante señalar", "sin lugar a dudas", "un antes y un después", "llevar al siguiente nivel", "cambia las reglas del juego". El inspector usa la misma lista.
- Se marcan para reescribir a mano, no se corrigen solas, estas estructuras: "No es solo X, es Y", las tríadas, "¿El resultado?", "Spoiler:", "¿Sabías que...?", las listas con emoji y los cebos genéricos del punto 8.
- Las palabras que estén en `docs/voz.md` como tuyas se sacan del léxico.
- Corre sobre el texto de las láminas y el texto del post, dentro del render (`packages/carousel/src/texto.ts`).

**Listo cuando:** existen `docs/voz.md` revisado por ti y el humanizador en el render.

---

## 10. Dos puertas humanas

**Observación.** La aprobación llega al final, cuando corregir cuesta más. Si el ángulo estaba mal, hay que rehacer todo.

**Propuesta:**

- **Puerta 0, opcional y semanal:** apruebas los 2 a 4 temas del radar (punto 1a).
- **Puerta A, unos 5 minutos, antes de diseñar.** El agente manda un solo mensaje con:
  - formato, tesis, por qué ahora y para quién;
  - los 3 mejores ganchos con su recomendación;
  - el esqueleto, con una línea por lámina;
  - el CTA y a quién se lo mandaría el lector.

  Apruebas o corriges. Sin esta aprobación no se escribe `slides.tsx`.
- **Puerta B, final:** las láminas, `revision.png`, el texto del post y el informe del crítico ciego (punto 4). Solo se revisan el diseño y el texto, porque el ángulo ya está aprobado.

**Listo cuando:** el paso 11 de `workflows/carrusel.md` se divide en las puertas A y B, y AGENTS.md (regla 6) lo refleja.

---

## Fases

| Fase | Qué incluye | Nota esperada (estimación propia) |
|---|---|---|
| **1. Base editorial** (casi todo es texto) | `docs/voz.md`, `brief.json` y la puerta A, `ganchos-es.json`, reglas del cierre y del CTA, rúbrica nueva y `critico-ciego.md`, `docs/referentes.md`, retirar "probado de verdad", instalar las skills en `.agents/skills/` | Alrededor de 8 |
| **2. Motor** (código) | Umbrales del inspector, revisión de `data-cta`, wrappers en español de los scripts originales (texto del post, humanizador, detector, filtro de ganchos, swipe), esquemas Zod de `brief.json` y `metricas.json`, comandos `carrusel:brief`, `carrusel:texto`, `carrusel:critica`, `carrusel:metricas` y `carrusel:swipe` | Piso de 8.5 a 9 |
| **3. Aprendizaje** (continuo) | Radar semanal, swipe mensual, métricas a las 48 horas y a los 7 días, revisión mensual en `docs/aprendizajes.md` | 9.5, después de 15 a 20 piezas |

**Pieza piloto sugerida:** rehacer `content/2026-10-16-instagram-agent-skill/` con el flujo nuevo. Hoy usa el formato de plantillas de la primera versión, y es un tema que el plan ya obliga a investigar a fondo.

## Lo que necesito de ti

1. Entre 3 y 5 textos tuyos, entre 3 y 5 posturas, y las palabras que usas y las que no (punto 9).
2. Elegir el lema nuevo de la cuenta dev (punto 2).
3. Aprobar la lista de cuentas para el swipe y la calibración (puntos 1a y 4).
4. Calificar una vez de 6 a 10 carruseles de referencia, unos 20 minutos (punto 4).
5. Después de cada publicación, una captura de Insights a los 7 días (punto 7).

## Pendientes fuera de este plan

- **Pieza de Gemini 4 Argon:** tiene los errores de la nota del punto 3 y 6 hashtags. No se corrigió, por tu indicación.
- **`audio.wav` y `gato.png`** en la raíz: ningún archivo los usa.
- **npm o pnpm:** el repo ya usa pnpm (`pnpm-lock.yaml`), pero AGENTS.md y `docs/contexto.md` dicen `npm install`.
- **`docs/contexto.md`:** no menciona el commit `2579e4a` ni este plan.
