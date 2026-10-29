Informe del crítico ciego (modelo: Sonnet 5.5). Sin acceso a video ni audio: juzgado con las 12 tiras, la transcripción, hoja.png, grilla.png y el texto del post. La voz no se evaluó de oído; la sincronía con los subtítulos se comparó cuadro a cuadro contra la transcripción.

Paso 1 (en frío)
- De qué trata: de cómo hacer que un agente de IA siga trabajando aunque cierres la pestaña. Parte de una demo con Claude Code en la nube y explica el modelo: un worker corre el trabajo aparte, un registro que solo crece (stream de Redis) permite reanudar con Last-Event-ID, cada paso se guarda como checkpoint y el paso en vuelo tiene que ser idempotente (ejemplo con Stripe). Cierra con las opciones (a mano o con Temporal, Inngest, Trigger.dev, Vercel Workflow) y con lo que hace Anthropic en Managed Agents.
- Tesis en una frase: un agente durable es el que separa el trabajo de la conexión: un stream reanudable para que te puedas ir sin perder nada, más ejecución durable para que el trabajo sobreviva a las caídas.
- Me habría ido en: 1:55, cuando termina la lista de herramientas y empieza Managed Agents (sin ninguna idea nueva para quien construye con un framework). Ya había un primer punto de riesgo en 0:18-0:20, cuando termina la demo y empieza "armemos el modelo mental". Los 2:18 se sienten largos para un Reel; el CTA (2:10) cae después del tramo que yo me saltaría.
- Qué haría al final: guardar.
- A quién se lo mandaría: a un compañero de backend que está armando un chat o un agente sobre la API de Claude y se le cae el stream, o que corre tareas largas en Lambda (el contraste 3 s contra 20 min y el tope de 15 min se entiende solo). El tramo de Stripe (1:31-1:43) se lo mandaría suelto a cualquiera que haya cobrado por API.

Paso 2 (con el brief)
- ¿Coincide la tesis? No hay brief para esta pieza (paso-2-brief.md dice "Sin brief"). No se puede comparar contra la tesis prevista. Lo que sí se verifica: el gancho promete "tu agente no necesita tu pestaña abierta", el cuerpo lo explica y el cierre ("Juntas, un agente durable", "antes de cerrar la pestaña") vuelve a la misma promesa. El texto del post dice lo mismo que el video. No pasa ni falla por tesis; queda sin comparar.

| Punto | Peso | Puntaje | Por qué |
|---|---|---|---|
| Gancho | 15% | 4 | El título grande ("Tu agente no necesita tu pestaña") se lee desde el cuadro 1 y la voz lo dice en 0:00; la afirmación es contraria a lo que el público da por hecho. Pierde un punto porque el cierre de la pestaña no se ve (la tarjeta solo se atenúa en 0:04 y aparece el aviso "trabajo 42 sigue corriendo"), y porque en el cuadro 1 "pestaña" toca la barra de pestañas de la tarjeta y la portada de la grilla muestra el texto cortado a mitad de palabra: "Leo la docu". |
| Tesis | 15% | 4 | Una idea con nombre propio (agente durable = stream reanudable + ejecución durable), no un comunicado de prensa. El gancho, el cuerpo y el cierre dicen lo mismo. Sin brief no se puede dar 5. |
| Valor | 15% | 4 | Se lleva un modelo mental que se puede usar: separar trabajo y conexión, Last-Event-ID, checkpoints por paso y una clave de idempotencia por paso, más una regla para elegir (chats cortos: a mano; agentes largos: framework). Son cuatro conceptos en 2:18 y la parte de herramientas y Managed Agents es lista de nombres, no criterio. |
| Retención | 10% | 3 | Dura 2:18 y yo me iría en 1:55. De 0:06 a 0:12 la misma tarjeta con el pedido queda casi quieta (entre 0:08 y 0:12 no cambia nada salvo el subtítulo). De 1:43 a 2:04 se acumulan la lista de herramientas y Managed Agents, que repite el registro numerado ya visto en 0:55-1:06. En el resto algo cambia cada 2 a 4 s, y eso se nota a favor. |
| Compartible | 10% | 4 | Hay momentos sueltos: la barra de "3 s" contra "20 min" con el tope de Lambda de 15 min (0:36-0:46); el cobro doble de Stripe con la clave "job42-step7" y la respuesta "Idempotent-Replayed: true" (1:31-1:43); la tarjeta final con los dos conceptos tachados como hechos. |
| Cierre y CTA | 10% | 4 | La última frase vuelve al gancho ("antes de cerrar la pestaña"), la pregunta es una sola y propia del tema (a mano o con un framework), y las dos opciones aparecen como botones en pantalla (2:08-2:18). Pierde un punto porque llega después del tramo en que se pierde gente (2:04-2:10) y porque la voz no dice dónde contar (el post dice "en los comentarios"; el video solo dice "cuéntame"). |
| Voz y guion | 5% | 4 | Frases cortas y de a una idea ("Te desconectas, y el trabajo sigue."); los números van en letras. Los términos en inglés (Last-Event-ID, idempotente) aparecen enseguida con un ejemplo. Los subtítulos de 3 a 5 palabras van a menos de 1 s de la transcripción. Sin poder oír la voz, no se puede subir más. |
| Legibilidad en el celular | 10% | 4 | Los subtítulos (pastilla blanca, texto negro grande, palabras por decir en gris) y las etiquetas de los diagramas se leen bien. Choques reales: (a) 0:00-0:06, "pestaña" roza la tarjeta; (b) 0:52-0:54, la etiqueta "trabajo 42" tapa la palabra "API"; (c) hacia 1:55-1:56, durante el paso de escena, "INNGEST" choca con las insignias de arriba, "Redis" queda cortado bajo el encabezado y asoma "SESIÓN" y el logo de Anthropic debajo del subtítulo, encima del pie. Texto muy chico: la caja de código "event: content_block_delta" (0:30-0:34) y el encabezado "CAPAS DEL AGENTE DURABLE". El gris de las palabras por decir tiene poco contraste para quien lo ve sin sonido. |
| Recurso visual y composición | 10% | 4 | Cada idea tiene dibujo antes de decirse o a la vez: barras de duración, registro con posiciones #55 a #61, fila de pasos con el 7 en rojo y otro worker que retoma en el 7, tarjeta de pagos con el cobro tachado. Estilo, mascota y color de acento consistentes. Pierde un punto por huecos grandes: hacia 0:24-0:28, 0:36-0:40, 1:20-1:26 y 1:32 el contenido ocupa el tercio de arriba y el resto del lienzo queda vacío hasta el subtítulo. La demo de 0:06-0:18 usa una interfaz genérica marcada "Ejemplo ilustrativo". |

Promedio ponderado: 3.90
(0.60 + 0.60 + 0.60 + 0.30 + 0.40 + 0.40 + 0.20 + 0.40 + 0.40)

Veredicto: no pasa a la puerta B. Retención está en 3 (hace falta 4 o más en todos los puntos) y el promedio es 3.90 (hace falta 4.5). Ningún punto está bajo 3 ni hay un error grave, así que por defecto se hace una sola ronda con los tres arreglos. Cambiar lo que dice la voz (arreglo 1) cambia el guion aprobado y vuelve a la puerta A.

Tres arreglos, en orden de impacto (con el segundo del video):
1. Acortar para que el CTA llegue antes del tramo en que la gente se va (retención y cierre). De 1:43 a 2:04 la lista de herramientas y Managed Agents ocupan 21 s sin una idea nueva: dejarlo en una sola frase y una sola escena, o mover el cierre ("Stream reanudable... ejecución durable... juntas, un agente durable") antes de esa parte. En 0:06-0:18, mostrar cerrarse la pestaña y seguir el trabajo en vez de dejar la misma tarjeta quieta de 0:08 a 0:12. Meta: que el CTA suene antes de 1:45. Vuelve a la puerta A.
2. Arreglar el primer cuadro y la portada (gancho). Separar el título de la tarjeta para que "pestaña" no toque la barra de pestañas (0:00-0:06); que el cuadro 1 no muestre el texto de la tarjeta cortado a mitad de palabra ("Leo la docu", visible también en grilla.png); y que se vea la pestaña cerrándose en 0:02-0:04, que es lo que dice la voz ("La cierro"), antes de que aparezca "trabajo 42 sigue corriendo".
3. Limpiar choques y huecos (legibilidad y composición). Que la etiqueta "trabajo 42" no pase sobre la palabra "API" (0:52-0:54); que en el paso de escena de 1:55-1:56 no choquen "INNGEST", "Redis", "SESIÓN" y el logo de Anthropic con el encabezado y el subtítulo; y centrar o agrandar los diagramas de 0:24-0:28, 0:36-0:40, 1:20-1:26 y 1:32 para que no quede más de la mitad del lienzo vacía.

## Arreglos aplicados (29 de octubre de 2026)

Una sola ronda: ningún punto bajó de 3 ni hubo un error grave, así que no hubo segunda crítica (workflows/video.md, paso 7). Ningún arreglo cambia lo que dice la voz.

1. **El tramo quieto de 0:06 a 0:12.** Es la parte del arreglo 1 que no toca la voz.
   - El pedido se escribe letra por letra en la caja de respuesta mientras la voz lo dice, y se envía cuando termina la frase.
   - La nube con Clawd entra en "en la nube" (0:07), así que la mitad de abajo ya no queda vacía. Clawd empieza a trabajar cuando empieza la respuesta.
2. **El gancho y la portada.**
   - La ventana bajó 44 px, y "pestaña" ya no toca la barra de pestañas.
   - El cuadro 1, y con él la grilla, muestra la respuesta completa: "Leo la documentación del SDK nuevo…".
   - La pestaña se ve cerrarse: el puntero llega a la ×, la × se pone roja con el clic en "cierro" y la ventana se pliega dentro de la pestaña. Después entran la nube con Clawd trabajando y "trabajo 42 · sigue corriendo".
3. **Choques y huecos.**
   - "trabajo 42" ya no tapa "API" (0:50 a 0:54). El ticket se sella a la derecha de la caja, y para subir al navegador o bajar al worker pasa por debajo de las cajas.
   - **Stream:** la tarjeta del evento entra con "las palabras" (0:26) en vez de con "la API" (0:28). Su letra sube de 17 a 19 px.
   - **Costo:**
     - "3 s" y "20 min" van a 46 px, con barras más gruesas y en el medio del cuadro, y "3 s" ya no se va;
     - busca, programa y tests suben a 22 px;
     - "Lambda: 15 min" golpea arriba.
   - **Checkpoints:** cuando cae el worker, una caja grande y roja de "Worker 1" se cae en el hueco del medio hasta que entra el worker 2.
   - **Idempotente:**
     - la tarjeta de pagos está desde "Ojo" (1:31), con la letra de 16 a 20 px;
     - la tarjeta del pedido a Stripe va a 17 px y corta las líneas donde se leen bien, sin partir palabras.

**Lo que queda, y por qué:**
- **Lo que cambia la voz:** vuelve a la puerta A, así que lo decide Jeremy.
  - Acortar de 1:43 a 2:04 (las herramientas y Managed Agents) a una frase y una escena, o adelantar el cierre para que el CTA suene antes de 1:45. Coincide con las sugerencias 1 y 3 de Gemini, que ya están pendientes en `estado.md`.
  - Que la voz diga dónde contar ("en los comentarios").
- **Lo que viene del motor y no de la pieza:**
  - en el paso de escena de 1:55, "INNGEST", "Redis", "SESIÓN" y el logo de Anthropic cruzan la cabecera y el subtítulo. Es el contenido que cruza la pestaña y la barra durante los paneos; el arreglo está en la rama `claude/stage-move-clip`, sin integrar;
  - el contraste de las palabras del subtítulo que todavía no se dicen;
  - el tamaño de la cabecera ("CAPAS DEL AGENTE DURABLE").
- **La demo "marcada Ejemplo ilustrativo":** es una recreación de claude.ai/code, y la regla 3 de AGENTS.md pide el rótulo.
- **Los diagramas que se arman con la voz:** al empezar costo y checkpoints, el cuadro todavía se está llenando, porque cada cosa entra cuando la voz la nombra. Ahora el lienzo se llena desde el centro y no desde arriba.
