# Estado: 2026-10-29-agentes-durables

## Dónde quedó

- **Fase A (guion) terminada el 29 de octubre de 2026. Puerta A aprobada:** Jeremy respondió en el chat "Aprobar así", sin las sugerencias de Gemini (`video.json → gateA`).
- **Fase B (video) terminada el 29 de octubre de 2026.** El primer render limpio tenía el sha256 `0ba88bbf…`. Lleva a Clawd, los logos de Inngest y Trigger.dev, la voz y la música (ver "Fase B").
- **Fase C (crítica) terminada el 29 de octubre de 2026.**
  - El crítico ciego le puso **3,90**: no pasa, porque Retención sacó 3. Todos los demás puntos sacaron 4.
  - Ningún punto bajó de 3 y no hubo un error grave, así que hubo una sola ronda.
  - Se arreglaron los tres problemas sin cambiar la voz (ver "Fase C" y `video-critica.md`).
  - `out/video.mp4`: 1080×1920, **138,1 s** (el referente dura 144 s; el rango de ±10 % va de 129,6 a 158,4 s).
  - El inspector no encontró problemas. El sha256 es `cd215d5c21f95e7f9d8eb412c83de40843b379a214ace2857378fb0d6dcb9283`.
  - `out/video-critica/` ya tiene el video nuevo.
- **Puerta B aprobada el 29 de octubre de 2026.** Jeremy escribió en el chat "Sí, apruebo" sobre el video con sha256 `cd215d5c…9283` (`video.json → gateB`), sin acortar la voz.
- **Paso siguiente: publicar, solo cuando Jeremy lo pida** (`video:publicar`).
- El arreglo de los paneos está en la rama `claude/stage-move-clip`, sin integrar. Si se integra y se vuelve a renderizar, cambia el sha256 y la puerta B se pide de nuevo.
- **Para publicar falta la licencia comercial:** las dos claves de ElevenLabs son del plan gratuito (docs/direccion-reels.md, 3).

## Fase C

El informe del crítico y la lista completa de arreglos están en `video-critica.md`. En resumen:
1. **De 0:06 a 0:12 ya no hay una tarjeta quieta.** El pedido se escribe en la caja mientras la voz lo dice, y la nube con Clawd entra en "en la nube".
2. **El gancho:**
   - la ventana bajó y ya no toca "pestaña";
   - el cuadro 1 muestra la respuesta completa;
   - la pestaña se ve cerrarse: un puntero hace clic en la ×, la ventana se pliega y entran la nube con Clawd y "trabajo 42 · sigue corriendo".
3. **Choques y huecos:**
   - el ticket ya no tapa "API";
   - la tarjeta del stream entra antes;
   - el costo va grande y centrado, con Lambda arriba;
   - en checkpoints, una caja roja "Worker 1" se cae en el medio;
   - la tarjeta de pagos de Stripe está desde la primera palabra, a 20 px.

Lo que se encontró de paso: `CodeCard` recibía el tamaño como clase (`text-[15px]`), pero el tamaño base le ganaba, así que esas tarjetas nunca salieron a 15 px. Ahora tiene la prop `size`.

## Fase B

- **Clawd, la mascota de Claude Code.** Jeremy lo pidió en partes estratégicas y mandó tres imágenes de referencia, que no se commitean. La tercera, un título "CLAUDE CODE" en píxeles, parece arte de fans y no se usó.
  - Está recreado en `video.tsx` (`Clawd`) sobre su cuadrícula de 16 × 10, medida en la imagen de Jeremy: cuerpo de 12 × 8, brazos a media altura, cuatro patas y los ojos recortados del cuerpo, en `#D97757`. Con `happy` lleva los ojos `>` `<` del sticker (regla 6).
  - **`chat`:** trabaja en una nube mientras la laptop está cerrada, por encima de lo oscuro. No va dentro de la laptop porque la sesión corre en la nube (`facts.json`, hechos 1 y 2).
  - **`idea` y `registro`:** es el Worker. En `idea`, el ticket "trabajo 42" baja hasta él; en `registro` lo lleva al lado.
  - **`checkpoints`:** el Clawd del worker 1 está en el paso 7 y se da vuelta en "cae". El del worker 2 aparece en el 7 y camina un paso por casilla hasta el 10.
  - **`cierre`:** salta contento, con `>` `<`, al lado de "Agente durable", que ahora va en dos líneas.
  - No está en el resto de las escenas, y la esquina del avatar (abajo a la izquierda, hasta x 220 desde y 598) queda libre en `como`, `idea`, `idempotente` y `cierre`.
- **Logos de Inngest y Trigger.dev:** están en `assets/catalog.json` (regla 6, archivo oficial).
  - Trigger.dev sale de su página de marca (https://trigger.dev/brand), en la variante para fondos claros.
  - Inngest sale de su repositorio oficial, del logo del dashboard en tema claro, fijado a un commit.
  - Los dos son el logotipo completo, así que en `construir` van solos en su píldora, sin el nombre escrito al lado.
- **Música:** `audio/cama.mp3` (Lyria, registrada en `generated.json`), un clip de 30,8 s que se repite, al volumen por defecto.
- **Voz:** ElevenLabs con la voz F y `tempo` 1,2. Dura **138,1 s**, dentro del rango de 144 s ±10 % (de 129,6 a 158,4 s), así que no se tocaron `tempo` ni `hold`.
  - Jeremy cambió la clave de respaldo de ElevenLabs el 29 de octubre de 2026 ("remplaza esa seguna api key fallback para elevenlabs por esta"). La principal tiene 14 créditos.
  - La clave nueva también es del plan gratuito, así que **todavía no hay licencia comercial**: para publicar hacen falta créditos o un plan pago (docs/direccion-reels.md, 3).
  - `video:prepare` fallaba igual, aunque la clave de respaldo tenía crédito, por un error del motor (ver "Para el motor"). Se corrió con la clave de respaldo como la principal, pasada por el entorno y leída de `.env.local`.
- **Render:** el borrador dio un aviso: "20 min", en `costo`, salía del margen durante el rebote del resorte, porque `Appear` crecía desde el centro y ese texto va pegado al margen. Ahora `Appear` acepta `origin`, y las dos filas de `costo` crecen desde su borde izquierdo. El render final salió sin problemas.

## El encargo

- Jeremy pidió copiar la estructura de "Durable agents explained" de @rick.theengineer (https://www.instagram.com/p/DfFNkEts9iE/), con nuestra marca. Sus pedidos:
  - el tema sale del referente;
  - "si es que se puede pon mi avatar en algunas partes";
  - "no olvides el Call to action al final";
  - "en lugar de usar chatgpt para el video usar Claude".
- El desglose está en `referente.md`: dura 143,9 s, es un pizarrón donde el diagrama crece, Rick aparece quieto en 4 momentos, hay una barra de tres capas y no tiene CTA.

## Decisiones de esta fase

- **Duración:** `target` 144 y formato `largo`, porque una réplica dura lo que su referente (docs/direccion-reels.md, 2).
  - El storyboard estima 159,6 s, un poco más del +10 %.
  - Para no recortar contenido, `video.tsx` sube la voz a `tempo` 1,2 (docs/direccion-reels.md, 3). Hay que medirlo con la voz real en la fase B.
- **Claude en lugar de ChatGPT:** la escena de apertura es Claude Code en la nube, que sigue trabajando si cierras la laptop (`facts.json`, hechos 1 y 2).
  - La interfaz es una recreación de claude.ai/code: el logo de Claude de Simple Icons y el tema claro.
  - No se afirma nada de claude.ai en un chat normal, porque no hay fuente.
  - La escena del stream usa lo que dice la doc de la API de Claude: si el stream se corta, no se reanuda solo (hecho 10).
- **Lo que es nuestro y no del referente:**
  - el límite de 15 min de Lambda (hecho 32);
  - la escena de Anthropic con Managed Agents (hecho 8);
  - el CTA.
- **Avatar:** aparece en 4 escenas, como Rick en el referente: `como`, `idea`, `idempotente` y `cierre`. Va en busto abajo a la izquierda, y esas escenas dejan libre esa esquina.
- **CTA:** `comentar-dilema`, "¿Tú lo armarías a mano o con un framework? Cuéntame antes de cerrar la pestaña". Repite "pestaña" del gancho, así el video cierra en bucle. La pieza anterior pedía guardar.
- **Gancho:** "Tu agente no necesita tu pestaña abierta.", hookscore 81. El primer intento, "Mira: cierro la pestaña…", sacaba 34.
- **Dirección de arte:** `linea-continua`, en papel claro con un trazo azul que es el camino del trabajo 42. Las tres piezas anteriores eran oscuras.
- **Medidor:** las 3 capas del agente durable, en casillas. Se llenan con "reanudable", "durable" y "juntas", como la barra de tres pestañas del referente.

## Lo que no entra, y por qué

- **RabbitMQ:** no tiene fuente en `facts.json`, así que en su lugar dice "Postgres, Redis y un worker".
- **"Si la conexión muere, la generación se detiene":** el referente lo dice, pero no hay fuente de Anthropic.
- **"20 minutos no caben en una función" en general:** solo es cierto para Lambda clásica. Vercel tiene un máximo extendido en beta de 30 min (`facts.json → calculations`), así que solo se nombra Lambda.

## Pendiente

- **La licencia comercial de la voz:** hacen falta créditos de ElevenLabs o un plan pago antes de publicar.
- **Las sugerencias de Gemini quedan a decisión de Jeremy:**
  1. juntar el gancho y la escena del chat;
  2. decir "si ese paso siete es un cobro";
  3. acortar la escena de Anthropic.

  Las tres cambian la voz, y la 1 y la 3 además acortan la duración.
- **El crítico ciego pidió lo mismo que la sugerencia 3 de Gemini:**
  - acortar de 1:43 a 2:04 (las herramientas y Managed Agents) a una frase y una escena, o adelantar el cierre, para que el CTA suene antes de 1:45;
  - que la voz diga dónde contar ("en los comentarios").

  Las dos cambian la voz: vuelven a la puerta A y las decide Jeremy. Acortar también aleja el video de los 144 s del referente, porque el mínimo es 129,6 s.
- **El orden ciego de los ganchos** (`out/video-critica-ganchos/`) no se corrió.
- **El arreglo de los paneos** está en la rama `claude/stage-move-clip`, sin integrar. Sin él, el contenido cruza la pestaña y la barra durante los cambios de escena.

## Para el motor

- **El crítico marcó de nuevo tres cosas del motor,** que no se arreglaron en la pieza:
  - el contenido cruza la cabecera y el subtítulo en el paso de escena de 1:55. Es la rama `claude/stage-move-clip`, que se integra solo si Jeremy lo pide;
  - el contraste de las palabras del subtítulo que todavía no se dicen;
  - el tamaño de la cabecera ("CAPAS DEL AGENTE DURABLE").
- **Las claves de ElevenLabs se pisan** (`packages/media/src/providers/elevenlabs.ts`, `withFallback`). La voz se genera de a dos escenas a la vez. Cuando la primera clave se queda sin créditos, una de las dos peticiones pasa a la de respaldo. La otra, que ya había salido con la primera, recibe el mismo error, ve que ya no queda clave siguiente y lo lanza, y `video:prepare` se corta. El arreglo es reintentar con la clave actual si la que falló era una anterior. Va en su propia sesión, con `npm test` y un commit.
- El render avisa que los paquetes de Remotion no están en la misma versión, y pide fijar zod en 4.5.4 (`npx remotion add zod`). No cortó el render.
- `<Logo>` dibuja todo en un cuadrado. Un logotipo ancho (Inngest, Trigger.dev) necesita una caja alrededor; le vendría bien una opción para eso.
- Si Clawd se repite en otras piezas, conviene pasarlo de `video.tsx` a `@motor/ui`, en su propia sesión.
