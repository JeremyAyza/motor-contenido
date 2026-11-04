# Análisis: qué hacen los Reels que crecen (22 de octubre de 2026)

Sigue al [análisis de @rick.theengineer](analisis-rick-theengineer.md) del 20 de octubre. Esta vez se leyeron los 6 Reels que eligió Jeremy, el perfil de Rick, 4 cuentas más y los Reels de @jacket.dev, con las skills `ig-viral` (swipe con múltiplo sobre la mediana), `ig-reel` (puntaje de ganchos) e `ig-profile` (rúbrica del perfil).

## Cómo se leyó

- **Vistas y mediana:** en la pestaña de Reels de cada perfil, desde el Chrome de Jeremy con su sesión (él lo ofreció). La mediana es la de las últimas 12 publicaciones de esa pestaña.
- **Cuadros:** en el reproductor incrustado de Instagram (`/reel/<id>/embed/`), que no pide sesión y deja ir a cualquier segundo. Se vieron de 8 a 12 cuadros por Reel y, en uno, un cuadro cada 1,5 s.
- **Gancho dicho:** transcrito de los subtítulos de los primeros 3 s. Donde no se transcribió, va la primera línea del texto del post.
- A ritmo humano, sin scraping, sin escribir nada en Instagram. Los datos están en [swipe/2026-10-22-reels-referentes.tsv](swipe/2026-10-22-reels-referentes.tsv).

**Cuánto vale.** Son 21 Reels de 6 cuentas. Lo que se repite en los 6 Reels elegidos (un mundo que dura, cambio constante, personaje) es un hallazgo de forma. Los múltiplos por fórmula de gancho no alcanzan para afirmar nada: hay un caso por fórmula.

## 1. Los números

| Cuenta | Seguidores | Publicaciones | Mediana (12) | Qué la mueve |
|---|---|---|---|---|
| @rick.theengineer | 516 mil | 150 | 283 mil | Explicadores de 130 a 175 s con Rick. Bio: los hace con brainrotshorts.com |
| @peterstewiestartup | 85,1 mil | 191 | 21,2 mil | El mismo estilo y la misma herramienta, sobre startups |
| @resultaaquee | 61,9 mil | **17** | 331 mil | Curiosidades en español con mundos 3D. Vende su herramienta en la bio |
| @sebastiankra.ia | 25,7 mil | 72 | 6,2 mil | IA en español, pixel art con su avatar |
| @valentinpanizza | 4.850 | 45 | 3,3 mil | IA para negocios: su cara abajo y una animación arriba |
| @jacket.dev | 12 | 14 | 194 | Nuestra cuenta |

Lo que dijo Jeremy se confirma: Rick tiene 150 publicaciones y 516 mil seguidores. En 33 semanas son unas 4,5 publicaciones por semana. resultaaquee pasó los 60 mil con 17.

### Los 6 Reels elegidos

| Reel | Cuenta | Duración | Vistas | Múltiplo | Mundo |
|---|---|---|---|---|---|
| [System design](https://www.instagram.com/reel/DdrHAI1MrFb/) | Rick | 156 s | No se ven (24 de septiembre, 62 mil me gusta) | | Un plano técnico que crece de 1 servidor al sistema completo |
| [La oficina de IA](https://www.instagram.com/reel/DeppU5yAKFn/) | sebastiankra.ia | 42 s | 11,5 mil | 1,9x | Un edificio de 6 pisos con robots, en pixel art |
| [Uber](https://www.instagram.com/p/DeyVt-wo29O/) | resultaaquee | 62 s | 516 mil | 1,6x | Una ciudad 3D: la cámara baja a la calle y sube a ver toda la ciudad |
| [Mods de Claude Code](https://www.instagram.com/p/DeXeLq-vPkG/) | sebastiankra.ia | 55 s | No se ven (13 mil me gusta, 7.516 comentarios por el "Comenta IA") | | Un escenario oscuro, con su avatar y el monitor de Claude Code |
| [Gestores de redes](https://www.instagram.com/p/DeXqCL3sLgG/) | valentinpanizza | 28 s | 4.009 | 1,2x | Su cara abajo y pixel art arriba |
| [Stack de $0](https://www.instagram.com/reel/DeHYCIpColc/) | peterstewiestartup | 143 s | 192 mil | **9,1x** | Una pila de 5 capas con logos e interfaces de ejemplo |

El de mods es el mismo tema del carrusel de mods de jacket.dev. El de valentinpanizza no se despegó de su cuenta: sirve por el formato, no por el resultado.

### Lo que más se despegó (swipe_es)

| Múltiplo | Cuenta | Gancho |
|---|---|---|
| 21,3x | valentinpanizza | "No uses Claude Code si no instalaste estos 5 plugins." |
| 10,6x | resultaaquee (3,5 M) | "… del teclado de tu iPhone es más pequeña que tu pulgar. Y aun así aciertas casi siempre." |
| 9,1x | peterstewiestartup | "Here are five tools you can use to ship your startup for $0 a month." |
| 6,5x | peterstewiestartup | "Alex's co-founder quit after six months… and still owns 50% of the company." |
| 5,3x | sebastiankra.ia | "Tu IA no es tonta. Tiene memoria de pez." |
| 3,5x | sebastiankra.ia | "Tu IA no lee letras. Lee fichas." |

- **Una forma nueva:** "Tu IA no es tonta. Tiene memoria de pez." y "Tu IA no lee letras. Lee fichas." son la misma: niegan lo obvio y lo cambian por una metáfora. `hookscore` les da 82 y 84, el puntaje más alto del lote, pero ninguna fórmula de `ganchos-es.json` las clasifica. Son 2 casos de una sola cuenta: candidata a fórmula 30, no fórmula todavía.
- **El del teclado** es un "un segundo por dentro" (fórmula 28): un gesto de todos los días y lo que pasa adentro. El "…" lo clasifica mal como "Mid-Sentence Start". Es la misma forma que dio los mejores de Rick, y en español llegó a 3,5 M.
- **El de Uber** es "la causa no es la que crees" (fórmula 29) en forma de pregunta.

### El mismo tema, el mismo día

Rick publicó hoy su Reel de PHP2Shell: 640 mil vistas en horas (2,3x, todavía crece). El nuestro, de la misma vulnerabilidad, tiene 152 vistas (0,8x de nuestra mediana). Con 12 seguidores, las vistas no se pueden comparar. **La forma sí.**

| | Rick | jacket.dev |
|---|---|---|
| Gancho | "PHP is facing one of its most serious…" (texto: "Not a plugin. Not your messy code. The runtime itself.") | "Todos dicen que PHP murió: es tu error." La noticia llega en la escena 2 |
| Primer cuadro | Un monitor CRT que dice PHP y después "SECURITY ALERT" | Un título de 44 px y una tarjeta con "~70%" |
| Mundo | Un edificio de 3 pisos en corte (tu app, el runtime de PHP, el servidor). La grieta está en el del medio y la cámara entra a la memoria | 6 láminas con título y tarjetas |
| Texto en pantalla | Rótulos de 1 a 3 palabras y subtítulos | Títulos, tarjetas con párrafos de 12 a 13 px, chips y subtítulos |
| Versiones parcheadas | 4 disquetes con 8.5.12, 8.4.27, 8.3.36 y 8.2.35 | Una tabla |
| Personaje | Rick entra a los 25 s | No hay |

La hoja de nuestro Reel está en `content/2026-10-21-php-vulnerabilidad-rce/out/video-hoja.png`, fuera de git: 6 láminas oscuras con un título arriba y tarjetas debajo.

## 2. Lo que se repite en los que funcionan

1. **Un solo mundo que dura todo el video.** El edificio de 3 pisos, la ciudad, el edificio de oficinas, la pila de capas, el plano que crece. No es una lámina por idea: es un objeto que cambia de estado.
2. **El cuadro cambia cada 1 a 2 s, sin cortar.** En el de system design, entre 30 y 41 s cambia algo cada 1,5 s sobre el mismo plano: un servidor nuevo, una alerta roja, el balanceador, la nota del costado. Nuestro inspector deja 4 s quieto, y el de PHP tuvo 10 tramos quietos de 4,5 a 11,5 s.
3. **El primer cuadro es un objeto, no un título.** El monitor con PHP, una tecla del iPhone en macro, la calle con dos autos y sus distancias, la batería del límite que baja de 100% a 90%. Nuestros 6 Reels abren con un título.
4. **Casi nada para leer fuera de los subtítulos.** Rótulos cortos (YOUR APP, PHP RUNTIME, SERVER) y una sola frase: la que se dice.
5. **Un medidor que acompaña todo el video.** Los usuarios que crecen de 1 a 50 millones, la cuenta del mes en $0.00, la batería del límite, una barra de avance con la mascota, 5 casillas con "?" que se llenan (1/5). Es lo que está en juego y se ve avanzar.
6. **Un personaje.** Rick, Stewie, el avatar pixelado de Sebastián, "Tú" y "Lucía" en la ciudad, la cara de Valentin. Los 6 tienen uno.
7. **La escala.** "Y eso con dos personas", y la cámara se aleja hasta la ciudad entera con todos los autos. De 1 usuario a 50 millones.
8. **Un cierre que se captura.** Rick cierra con la tabla "qué problema obligó a agregar cada pieza" y el ciclo "empieza simple, busca el cuello de botella, arregla lo mínimo, repite". Peter, con la pila de 5 capas y sus logos.
9. **Temas que todos tocan.** El teclado del iPhone (3,5 M), WhatsApp (597 mil) y Uber (516 mil). Los temas de nicho, como Claude Code, rinden lo que rinde una cuenta de nicho: sebastiankra.ia tiene 6,2 mil de mediana con 25,7 mil seguidores.
10. **Salen de una tubería automática**, como la nuestra. Rick y Peter lo dicen en la bio. La diferencia no es que haya un editor humano: es el modelo visual.

## 3. Por qué el nuestro se ve como una presentación

El motor no está mal hecho. La voz, los cues, los subtítulos, el kit de escenario, el HUD, el inspector y las puertas sirven tal cual. Remotion puede hacer todo lo de arriba. El límite está en dos decisiones del núcleo, que vienen del carrusel:

1. **Cada escena es una lámina nueva.** `PieceVideo.tsx` arma una `<Series>` y cada escena monta su propio `<Slide>`. Hay un corte en cada escena y el escenario empieza de cero. Entre escenas solo sobreviven los subtítulos y la barra de capítulos. No hay dónde poner un edificio que dure 90 s.
2. **Cada escena tiene un título arriba.** `SceneFrame` pone un título de 44 px y el dibujo debajo. Así cada escena se lee como una lámina con título, y el primer cuadro siempre es texto.

Hay tres límites más, que salen de esos dos:

3. **El movimiento solo hace aparecer cosas.** `aparece`, `salta` y `traza` en un cue: las cosas entran, pero no se mueven de un lugar a otro, no cambian de estado (de sano a roto, de 1 a 4 servidores) y no se transforman.
4. **No hay cámara ni profundidad.** Nada se acerca a una zona ni se aleja para mostrar la escala.
5. **No hay personaje.** La fase 4 sigue pendiente.

## 4. Cambios propuestos al motor, en orden

| # | Cambio | Qué resuelve | Tamaño |
|---|---|---|---|
| 1 | **Escenario que dura y cámara.** `defineVideo({ stage })`: un componente que vive todo el video, fuera de `<Series>`, y sabe en qué escena y en qué segundo está. Cada escena declara su `camera` (`focus`, `zoom`) y el estado del escenario. `<Camera>` pasa de una escena a la otra con un spring. Las escenas de hoy siguen funcionando igual | Mundo, cambio sin cortes, escala | Grande, en el núcleo. Es el paso 5 de la propuesta, que no estaba aprobado |
| 2 | **`<Board>` y `<Meter>`.** Un plano que crece: nodos y flechas que aparecen, se encienden, fallan con una X roja o se mueven, todo por cue. Y el medidor del HUD, que cambia por cue durante todo el video | Cambio cada 1 a 2 s y lo que está en juego | Mediano, en el kit |
| 3 | **Láminas de mundo.** Con `video:image`, que ya existe: 1 o 2 ilustraciones grandes por pieza (un edificio en corte, una ciudad, un escritorio de época), con un estilo fijo de la cuenta, en capas para la cámara. Los logos van aparte, como archivos oficiales con `<Logo>`, nunca dentro de la imagen generada | Mundos sin dibujar todo con divs | Mediano |
| 4 | **El avatar (fase 4).** La foto de perfil de jacket.dev ya es una ilustración. Si es tuya y la quieres como personaje, se desbloquea la fase 4. Una versión mínima: 3 poses y una boca que se abre con el volumen de la voz. Rhubarb, después | Personaje | Mediano, necesita tu sí y tu ilustración |
| 5 | **Reglas de guion** en `video:script` y `skills/video-es`. Una metáfora física por pieza (`video.json → world`), aprobada en la puerta A. Un primer cuadro con un objeto que se mueve, sin título. Un medidor que se planta en el gancho y se paga en el cierre. Un cierre que se pueda capturar | Que el guion pida el mundo antes del diseño | Chico |
| 6 | **Inspector más exigente.** Que algo cambie cada 2 s, no cada 4. Un aviso cuando el texto fuera de subtítulos y de `data-ui` pase de 6 palabras. Un aviso cuando la escena 1 abra con un título como elemento principal | Ritmo y lectura | Chico. Sube la vara para todas las piezas, no se ajusta para una |
| 7 | **Ganchos.** Anotar en `ganchos-es.json` la candidata a fórmula 30 ("niega lo obvio y cámbialo por una metáfora"), marcada como en prueba hasta tener más casos | `hookscore` la ve | Chico |

El 1 es el que cambia el resultado. Sin él, el 2 y el 3 siguen siendo láminas con mejores dibujos. Para probarlo conviene un Reel nuevo con un tema de todos los días, sin tocar los publicados.

## 5. Lo que no es código

- **Cadencia.** El 20 de octubre salieron 4 Reels en 42 minutos, y el 18 salieron 3 carruseles en 16 minutos. Se pisan entre sí: compiten por la misma prueba de distribución. Rick publica uno por día. Uno por día, a la misma hora, con `ig-plan` armando el calendario.
- **Temas.** 2 de cada 3 sobre tecnología que todos tocan, vista por dentro: Yape o Plin, el QR, el autocorrector, el GPS, el WiFi, el login con Google. Y 1 de nicho, como Claude Code. Sin repetir los temas recientes de Rick.
- **El perfil** (`ig-profile`, sección 6).
- **Reels de prueba.** Con 12 seguidores, casi todo el alcance ya viene de quienes no te siguen. Marcar "prueba" en el publisher es una opción para más adelante.
- **"Comenta X y te lo mando".** Les infla los comentarios (7.516 en el de mods de Sebastián), pero exige mandar DMs, y aquí no se automatizan. Sigue fuera, salvo que respondas tú a mano.

## 6. El perfil, con `ig-profile`

Puntos de los 94 que se ven desde fuera (la categoría y el botón de contacto, 6 puntos, no se ven):

| Ítem | Puntos | jacket.dev | Rick |
|---|---|---|---|
| Nombre (el campo que indexa la búsqueda) | 12 | 9: "Jacket \| IA para devs" | 3: solo "RickTheEngineer" |
| Primera línea de la bio | 12 | 6: "Te enseño sobre programar e IA" es genérico. "ya no quemes mas tokens" es concreto, pero le falta la tilde de "más" | 8 |
| Resto de la bio | 8 | 3: palabras clave, sin prueba ni oferta | 3 |
| 3 fijados | 10 | 0: la grilla muestra lo último | 0 |
| Enlace | 8 | 0: no hay | 4: un enlace de afiliado a la herramienta |
| Destacadas | 8 | 0: no hay | 6: 6, por tema |
| Grilla legible | 8 | 4: los títulos se leen, pero las portadas de los Reels son el cuadro 1 con letra chica | 8: portadas oscuras con el título y un número grande |
| Foto | 6 | 5: la ilustración llena el círculo | 6 |
| Usuario | 6 | 6 | 6 |
| Actividad reciente | 10 | 8: publicó hoy | 10 |
| Historias | 6 | 0: sin anillo | 6 |
| **Total** | **94** | **41** | **60** |

Rick creció con un perfil de 60: lo que hace crecer una cuenta son los Reels, no el perfil. Pero el perfil es la pantalla donde decide quien llega desde un Reel, y los arreglos de jacket.dev son baratos: fijar 3 (el mejor Reel, el que explica la cuenta y el que te presenta), 4 destacadas, un enlace, una historia por cada Reel y la tilde de "más". Son 30 puntos.

## 7. El repo `latent-spaces/brag`

[`brag`](https://github.com/latent-spaces/brag) es una skill con licencia MIT y 17,6 mil estrellas. Lee un proyecto propio o su web y arma un video de lanzamiento de 15 a 25 s, horizontal por defecto, con música, efectos y el texto para compartir. Trae dos versiones: `/brag`, que renderiza con Hyperframes (de HeyGen), y `/brag-slim`, un solo archivo para Opus 5.5 que arma el video con lo que haya en la máquina.

**No conviene instalarlo en este repo:**

1. **Hace otra cosa.** Hace videos de lanzamiento de un producto propio, no explicadores. Nuestros Reels son de 45 a 100 s y explican.
2. **Trae otro motor.** Hyperframes, cuando ya tenemos Remotion.
3. **La música no tiene licencia confirmada.** El propio repo pide verificar los términos de ende.app antes de redistribuirla, y este repo es público.
4. **Usa la interfaz real del producto.** Con productos de terceros, chocaría con la regla de no recrear apps de marcas.

**Lo que sí sirve, como reglas** para `skills/video-es` y el inspector:

- El ritmo sale del movimiento y de los cortes, no de quitar el texto antes de tiempo. Una línea que se lee queda unos 0,3 s por palabra desde que está completa.
- Las cosas aparecen una por una, con clics, deslizamientos y tipeo simulados. Eso le gana a la lámina quieta.
- Cualquier cuadro congelado tiene que poder publicarse.
- Revisar cuadros a mitad de transición. Un fundido entre dos composiciones cargadas da una doble exposición sucia: mejor que salga lo viejo y después entre lo nuevo, o pasar por el fondo.
- La portada es el cuadro más fuerte, ya asentado, y se hornea como cuadro 0. Hoy usamos el cuadro 1.
- Los efectos van en la misma tonalidad que la música y por debajo de ella.

**Cuándo sí:** para un Reel de lanzamiento de algo tuyo, como el propio motor o un proyecto freelance que no sea del empleador. En ese caso, conviene instalarlo por máquina y fuera de git, como las skills de Remotion: `npx skills add https://github.com/latent-spaces/brag --skill brag-slim`.

## 8. Cómo aprovechar las skills que ya tenemos

| Skill | Para qué, en este repo | Hoy |
|---|---|---|
| `ig-viral` | Swipe mensual con múltiplos. Próximo paso: tu colección de Guardados | Usada hoy, con 6 cuentas |
| `ig-profile` | Puntaje del perfil y textos nuevos | Usada hoy: 41 de 94 |
| `ig-plan` | Calendario semanal: uno por día, temas mezclados | Sin usar. Es la que corrige las ráfagas |
| `ig-audit` | Revisión mensual con `video-metrics.json` | Sin datos: falta cargar los Insights de los 6 Reels |
| `ig-repurpose` | Cada carrusel aprobado se vuelve un Reel, y cada cierre de Reel, un carrusel para guardar | Sin usar |
| `ig-story` | Una historia por cada Reel: suma puntos al perfil y avisa a quien te sigue | Sin usar |
| `ig-caption` | Texto del post como un artículo corto con lista numerada, como Rick y Peter | Se usa en el carrusel |
| `ig-comment` e `ig-reply` | Borradores para responder; los envías tú | Sin usar |
| `ig-reel`, `ig-human` e `ig-carousel` | Ya están en `video:script` y `carrusel:render` | En uso |
| `ig-dm` | No: los DMs no se automatizan | Fuera |
| `remotion-markup`, `remotion-maps`, `remotion-captions` | Movimiento con `interpolate` y `spring` para la cámara y el `<Board>`. Mapas para mundos como el de Uber o un envío | Parcial |
| `artifact-diagramming` y `dataviz` | Criterio para el `<Board>` (diagramas que muestran el mecanismo) y el `<Meter>` | Sin usar |
| `brandkit` y `imagegen-frontend-*` | El estilo fijo de las láminas de mundo y del avatar, con tu ilustración como referencia | Sin usar |
| `impeccable` y `design-taste-frontend` | Interfaces genéricas creíbles dentro del video, como la landing de ejemplo del stack de $0 | Sin usar |
| `motor-prospeccion` y `radar-oportunidades` | La cuenta de negocios | Fuera de este flujo |

## 9. Lo que decidió Jeremy

El mismo 22 de octubre:

- **Sí al cambio 1** (escenario que dura y cámara) en el núcleo.
- **Sí al avatar** con su ilustración: boca sincronizada, parpadeo y respiración. El polerón cambia por cuenta: "CLAUDE CODE" en jacket.dev e "IA" en la de negocios.
- **Un Reel por día**, a las 19:00 de Lima, publicado cuando Jeremy lo pide.
- **Superpowers:** lo publicó él a mano el 21 de octubre ([Dex304ih0xy](https://www.instagram.com/reel/Dex304ih0xy/)). Ya está registrado en `publications.jsonl` y su puerta B en `video.json`.

El plan está en [plan-piloto-automatico.md](plan-piloto-automatico.md).
