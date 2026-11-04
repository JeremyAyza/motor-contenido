# Plan experimental: lo que hace la comunidad

Lo pidió Jeremy el 3 de noviembre de 2026. Junta lo que la comunidad de creadores hace para producir videos con IA y lo convierte en experimentos.

**Es una rama experimental.** No cambia el plan principal, [plan-velocidad-reels.md](plan-velocidad-reels.md). Ninguna idea de aquí entra al flujo de los Reels sin pasar su prueba, y solo Jeremy la promueve al plan principal.

**Reglas de los experimentos:**
- **La calidad no se arriesga.** Cada experimento se compara lado a lado con la forma actual, y la calidad la juzga Jeremy. El crítico ciego sirve de referencia, no de vara.
- **Se trabaja en una rama de git propia** (`exp/<nombre>`) y nunca en medio de una pieza que se va a publicar. Lo que se prueba con una pieza real se publica solo si Jeremy lo aprueba como cualquier otra.
- **Cada experimento dice de qué fase del plan principal depende,** y no empieza antes de que esa fase esté hecha.

## De dónde sale

Son dos investigaciones del 3 de noviembre de 2026: una sobre creadores que hacen videos con agentes que escriben código, y otra sobre cómo se producen a escala los videos explicativos cortos con IA.

**El nivel de la evidencia es bajo.** Casi todo son blogs, hilos de Reddit (leídos en un espejo), repositorios de GitHub y páginas de vendedores.
- No hay datos de retención que comparen plantillas con videos a medida.
- No hay una comparación de Gemini Flash contra Claude escribiendo Remotion.

Por eso esto va como experimentos, no como decisiones.

### El referente usa una herramienta comercial

La bio de Instagram de @rick.theengineer dice **"VIDEOS MADE WITH brainrotshorts.com"**. Lo comprobé el 3 de noviembre de 2026 leyendo la página sin sesión.
- El enlace de la bio lleva `?via=rick`, así que parece un enlace de afiliado.
- Brainrot Shorts es un servicio de pago mensual que hace el guion, la animación, la voz, la música y los subtítulos en una sola herramienta.
- **Lo que dice el vendedor, sin comprobar:** cada video sale en unos 20 minutos, sin software de animación, con un estilo cerrado y un presentador animado fijo. Los planes van de 29 a 299 USD al mes, con MCP y API desde el de 49.
- **Lo que no se sabe:** si todos sus videos salen de ahí, cuánto retoca a mano, y si el servicio sirve en español con una voz propia de ElevenLabs.

Lo que eso implica: lo más probable es que la velocidad y la consistencia del referente vengan de un estilo fijo que se repite, no de animación a medida en cada pieza.

### Cuánto tarda la comunidad

- Los creadores que usan Claude Code con Remotion cuentan unas 2 horas y unos 100 prompts por un video de 39 a 50 s.
- Nadie muestra un método mucho más rápido para piezas a medida de 45 a 170 s. Los "10 a 20 minutos" son siempre de herramientas con plantillas.
- Los 87 minutos del Reel `cinco-algoritmos-ml` están dentro de lo normal. La meta de 40 minutos del plan principal es ambiciosa, y se mide fase por fase.

### En qué coinciden varias fuentes

Ya está cubierto por el plan principal; se anota para saber que la comunidad llegó a lo mismo:
- **Lo fijo, sagrado; la composición, libre.** HyperFrames, el framework de HeyGen, lo dice así: "Atoms stay sacred. Composition stays free". video-use lo dice como "12 reglas duras, libertad artística en lo demás". En el plan principal es la gramática de la Fase 4.
- **Un archivo por escena.** Con un solo archivo grande, el agente se confundía (Kiln). En el plan principal es la Fase 4, paso 3.
- **Revisar con cuadros sueltos y rangos, no con renders completos.** En el plan principal es la Fase 3.
- **Voz primero, y el tiempo de cada escena sale del audio.** Ya se hace.

## Los experimentos

### E1. Escenas en paralelo

**Hipótesis:** si cada escena la escribe un subagente distinto y todos trabajan a la vez, el tiempo de escribir el video baja de unos 6,5 minutos más los arreglos a unos 2 minutos, sin bajar la calidad.

**Evidencia:** una sola fuente. video-use lanza un subagente por animación, en paralelo.

**Depende de:** la Fase 3 (`video:frames` y `--escena`) y la Fase 4 (una escena por archivo y la gramática) del plan principal.

**Cómo se prueba:**
1. Se toma una pieza ya hecha, con su guion y su voz. La voz está en caché, así que no se paga de nuevo.
2. Opus escribe el guion visual, el documento de estilo y el esqueleto de `video.tsx`. Por cada escena deja un contrato: la duración, los cues de la voz, la zona del lienzo y lo que tiene que entender el público.
3. Se lanza un subagente por escena (Opus en esfuerzo alto) que escribe `scenes/<id>.tsx` y lo comprueba con `video:frames`.
4. Opus arma, revisa la hoja y corrige las uniones entre escenas.
5. Jeremy compara el resultado con el original, lado a lado.

**Se mide:** el tiempo total, el tiempo de Opus, el número de arreglos y la coherencia entre escenas (que la paleta, la tipografía y el ritmo no se noten de autores distintos).

**Se adopta si:** Jeremy lo ve igual o mejor que el original, y el tiempo de escribir baja a la mitad o menos.

**Riesgo:** escenas que no conversan entre sí, o un mundo continuo con cámara que no se puede partir. En ese caso, en paralelo van solo las escenas que no comparten el mundo.

### E2. Tope de 3 vueltas por escena

**Hipótesis:** después de 3 vueltas de arreglo en una misma escena, seguir iterando casi no mejora y gasta tiempo y contexto.

**Evidencia:** video-use limita la autoevaluación a 3 re-renders. El creador de Remotion advierte que verificar con imágenes "drena el contexto rápido".

**Depende de:** la Fase 3 del plan principal.

**Cómo se prueba:** en los 3 Reels siguientes se anota en `estado.md` cuántas vueltas lleva cada escena y qué cambió en cada una. Al llegar a 3, el agente no sigue: le muestra la escena a Opus, o a Jeremy si es un tema de gusto.

**Se mide:** cuántas escenas llegan al tope, y si la cuarta vuelta, cuando Jeremy la pide, mejora algo que se vea.

**Se adopta si:** en las escenas que llegan al tope, la cuarta vuelta casi nunca cambia el juicio de Jeremy.

### E3. Reglas de movimiento en el documento de estilo

**Hipótesis:** si el documento de estilo de cada pieza escribe también las reglas de movimiento, el video se ve menos "hecho con IA".

**Evidencia:** varias fuentes coinciden.
- Un creador dice que el agente es "mediocre inventando gusto, excelente ejecutando gusto que puedes articular" (Mejba).
- El easing uniforme y los fundidos largos delatan que es de IA. La propuesta: tipografía audaz, cortes al ritmo de la voz y transiciones cortas (un comentarista de r/ClaudeAI).
- El texto que se mueve sin parar tiembla, y la solución es "moverlo y dejarlo quieto" (Chris Tyson).
- IBM Carbon distingue el movimiento productivo, para lo rutinario, del expresivo, para los momentos importantes.

**Hay contradicciones:** una fuente pide variar las curvas de easing, y otra usar una sola (expo-out). Por eso se prueba, no se adopta.

**Depende de:** la gramática de la Fase 4.

**Cómo se prueba:** en un Reel, el documento de estilo lleva una sección de movimiento:
- dos tipos de movimiento, productivo y expresivo, con su curva y su duración;
- un largo máximo de las transiciones;
- los cortes al ritmo de la voz;
- "mover y dejar quieto" para el texto.

Jeremy lo compara con el Reel anterior.

**Se mide:** el juicio de Jeremy, la nota del crítico en lo visual y si la sección se cumplió.

**Se adopta si:** Jeremy lo ve mejor. Las reglas que funcionaron pasan a la gramática.

### E4. Gemini Flash escribe una escena

**Hipótesis:** `agy` con Gemini 3.8 Flash puede escribir escenas sencillas (no protagonistas) con un contrato claro, gratis y sin gastar la cuota de Claude.

**Evidencia:** una sola anécdota. Alguien hizo un explainer de 45 s de una sola vez con Antigravity y Gemini 3 Pro. No hay comparaciones con Claude.

**Depende de:** la Fase 1 (`npm run agy`) y la Fase 4 (una escena por archivo).

**Cómo se prueba:** se toman 3 escenas sencillas de una pieza ya hecha, con el mismo contrato de E1. `agy` las escribe, y se comparan con las de Opus lado a lado.

**Se mide:** el tiempo, los errores del inspector, las vueltas de arreglo y el juicio de Jeremy.

**Se adopta si:** Jeremy no distingue o prefiere las de `agy` en al menos 2 de 3. En ese caso, `agy` escribe las escenas sencillas, y Opus las protagonistas y el armado.

### E5. El kit y la biblioteca, de solo lectura durante una pieza

**Hipótesis:** si el agente no puede editar el kit ni la biblioteca mientras hace una pieza, no se rompen otras piezas ni se mezclan cambios del motor con el contenido.

**Evidencia:** Tella reporta que Claude modifica componentes compartidos sin que se lo pidan.

**Depende de:** la Fase 4.

**Cómo se prueba:** en las sesiones de una pieza, una regla de permisos de Claude Code (o un hook) rechaza las ediciones en `packages/video/src/kit/` y en `packages/video/library/`. Si la pieza necesita algo del motor, se anota en `estado.md` para una sesión del motor.

**Se mide:** cuántas veces se rechazó una edición, y si eso trabó la pieza.

**Se adopta si:** no traba ninguna pieza en 3 Reels seguidos.

### E6. Qué hacer con el referente

Es una decisión de rumbo, así que se prueba antes de decidir. Son dos pruebas que no se excluyen:

**E6a. Probar Brainrot Shorts.**
- **Cómo se prueba:** con un mes del plan más barato que tenga lo necesario, se hace el mismo tema de un Reel nuestro reciente.
- **Antes de pagar,** se revisan sus términos: el uso comercial, la etiqueta de IA, el español, si acepta una voz propia de ElevenLabs y si permite la marca propia.
- **Se mide:** el tiempo, el costo por Reel, la calidad lado a lado según Jeremy, y cuánto se parece a la marca de la cuenta.
- **Lo que puede salir:** usarlo como herramienta para algunos Reels, aprender de su estilo para nuestro motor, o descartarlo.

**E6b. Un estilo de serie.**
- **Cómo se prueba:**
  1. El subagente `analista-referente` mira 10 Reels del referente y mide cuánto se repite: los colores, el presentador, los encuadres, las transiciones y la estructura.
  2. Con eso se define un formato de serie propio: un mundo, un ritmo y una estructura que se repiten, con el contenido nuevo en cada Reel.
  3. Se hacen 3 Reels de la serie.
- **Se mide:** el tiempo por Reel y el juicio de Jeremy. Las métricas a los 7 días se comparan con los Reels anteriores, sabiendo que 3 Reels son una muestra chica.
- **Se adopta si:** baja el tiempo y Jeremy no siente que pierda calidad ni marca.

## Descartado por ahora

- **Migrar a HyperFrames.** Tiene muchas estrellas en GitHub, pero casi nadie cuenta que lo use, y las comparaciones con Remotion las hicieron sus propios mantenedores. Solo se toma su principio ("lo fijo, sagrado; la composición, libre"), que ya está en el plan principal. Se vuelve a mirar si aparecen experiencias de otros.
- **Motion Canvas y Revideo.** No se encontraron creadores que los usen con agentes.

## Orden sugerido

| Orden | Experimento | Cuándo se puede | Costo |
|---|---|---|---|
| 1 | E6b. Estilo de serie (solo el análisis de los 10 Reels) | Ya | Un subagente |
| 2 | E5. Kit de solo lectura | Después de la Fase 4 | Chico |
| 3 | E2. Tope de 3 vueltas | Después de la Fase 3 | Solo anotar |
| 4 | E3. Reglas de movimiento | Después de la Fase 4 | Un Reel |
| 5 | E4. Gemini Flash escribe escenas | Después de las Fases 1 y 4 | Gratis, 3 escenas |
| 6 | E1. Escenas en paralelo | Después de las Fases 3 y 4 | Rehacer un Reel |
| 7 | E6a. Probar Brainrot Shorts | Cuando Jeremy quiera | Un mes del plan |

## Decisiones de Jeremy

1. ¿Qué experimentos se hacen, y en qué orden?
2. **E6a:** ¿se paga un mes de Brainrot Shorts para probarlo?
3. **E1:** ¿qué pieza ya hecha se rehace en paralelo para comparar?

## Fuentes

Las juntaron dos subagentes de investigación el 3 de noviembre de 2026; no se revisaron una por una, salvo la bio del referente. Son blogs, foros y repositorios, no estudios.

**El referente y los servicios:**
- Bio de @rick.theengineer: https://www.instagram.com/rick.theengineer/
- Blog de Brainrot Shorts sobre explainers animados (vendedor, 17-ago-2026): https://www.brainrotshorts.com/blog/how-to-make-animated-explainer-reels
- Comparativa de servicios de video por API (vendedor, ago-2026): https://motionbox.io/blog/best-json2video-alternatives-in-2026

**Creadores con agentes y Remotion:**
- Remotion con agentes, documentación: https://www.remotion.dev/docs/ai/coding-agents
- Jonny Burger, creador de Remotion, en Syntax (18-may-2026): https://www.syntax.fm/show/1005/programatic-and-skill-based-video-creation-with-remotion/transcript
- Chris Tyson (24-ago-2026): https://theagentarchitect.substack.com/p/claude-code-remotion-video-rendering
- Kiln, video de lanzamiento con Claude Code (20-may-2026): https://kiln.tech/blog/we_made_our_launch_video_in_claude_code
- Mejba, convenciones de estilo con Claude Code y Remotion (abr-2026): https://www.mejba.me/blog/claude-code-remotion-youtube-motion-graphics
- Greg Ceccarelli (28-jul-2025): https://www.gregceccarelli.com/writing/build-product-video-with-ai
- Tella, skills de Remotion con Claude Code (vendedor, 27-ago-2026): https://www.tella.com/blog/how-to-use-remotion-agent-skills-with-claude-code.md
- AutoAE, por qué los videos de Claude y Remotion se ven planos (vendedor, 7-oct-2026): https://autoae.online/blog/claude-remotion-videos-look-flat
- `video_explainer`, voz primero y una escena por componente (8-may-2026): https://starlog.is/articles/ai-dev-tools/prajwal-y-video-explainer

**Foros (espejo de Reddit, fechas aproximadas):**
- r/ClaudeAI, estética de IA y easing (≈nov-2025): https://reddit.sentinel-team.org/posts/1t51k8s/snapshots/2026-05-09T02%3A30%3A12.086538Z
- r/ClaudeAI, "NOT a 5-minute job" (captura del 16-may-2026): https://reddit.sentinel-team.org/posts/1tbcoft/snapshots/2026-05-16T01%3A22%3A27.604243Z
- r/ClaudeAI, edición a la mitad con componentes reutilizables (≈dic-2025): https://reddit.sentinel-team.org/posts/1tn9tyy/snapshots/2026-05-26T04%3A48%3A31.681843Z

**Repositorios:**
- HyperFrames, con su principio en `frame.md`: https://github.com/heygen-com/hyperframes
- video-use, con el tope de 3 re-renders y un subagente por animación: https://github.com/browser-use/video-use
- Skills oficiales de Remotion: https://github.com/remotion-dev/skills
- Issue de Remotion sobre la verificación visual que gasta contexto (12-sep-2026): https://github.com/remotion-dev/remotion/issues/11258

**Plataformas:**
- Instagram y el contenido ajeno (30-abr-2026): https://petapixel.com/2026/04/30/new-instagram-policies-target-reposted-content/

## Resultados

Se completa después de cada experimento.

| Fecha | Experimento | Pieza | Resultado | ¿Se adopta? |
|---|---|---|---|---|
