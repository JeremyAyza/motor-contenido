# El Reel

Un MP4 de 1080×1920 hecho con Remotion, a partir de dos archivos que escribe el agente: `content/<pieza>/video.json` (el guion y las puertas) y `video.tsx` (lo que se ve). Esta página es lo único que se lee para hacer un Reel, además de [AGENTS.md](../AGENTS.md) y del `estado.md` de la pieza. Lo demás es referencia y se abre solo para un detalle: el [kit](referencia/kit-video.md), la [voz](referencia/voz.md), la [rúbrica](referencia/critica-video.md), el [crítico](referencia/critico-ciego-video.md), los [referentes](referencia/referentes.md) y [Antigravity](referencia/agy.md).

## Decisiones vigentes de Jeremy

No cambian sin su sí en el chat. Una elección para una pieza no se vuelve regla de la cuenta.

- **Estilo** (24 de octubre de 2026): motion graphics plano dibujado en código, con un mundo y una cámara que se mueve por él. El objeto del momento llena el cuadro, un acento para lo que importa, movimiento con peso (resortes, sellos, cosas que viajan, no solo fundidos) y el dato clave enorme. **3D o isométrico, solo si Jeremy lo pide.**
- **Dirección de arte por pieza** (20 de octubre de 2026): la de la baraja del carrusel, con su paleta y sus tipografías. Fijos: el marco (pestaña, puntos y firma) y los subtítulos. Dos Reels seguidos no se parecen.
- **Duración** (24 de octubre de 2026): `corto`, de 45 a 60 s, por defecto. `largo` (90 a 180 s) para una explicación de varios puntos. `explicado` (75 a 100 s), solo si Jeremy lo pide. **Una réplica dura lo que su referencia** (`video.json → target`, con un 10 % de margen), sumando datos o pausas con `hold`, nunca estirando la voz.
- **Ritmo:** algo cambia en pantalla cada 1 a 1,5 s; de 5 a 7 escenas de 2 o 3 frases cortas.
- **Réplica con marca propia** (27 de octubre de 2026): se copian la estructura, el ritmo y la profundidad del referente; los materiales, el acabado y el acento son de @jacket.dev.
- **Voz** (24 de octubre de 2026): ElevenLabs, voz F (`accounts/dev.json → voice`), estabilidad 0,5 y `tempo` 1,12. Una réplica larga puede subir el `tempo` de la pieza hasta 1,4 (27 de octubre). No se prueban otros proveedores sin que Jeremy lo pida.
- **Licencia de la voz** (1 de noviembre de 2026): se usa el plan gratuito, sin licencia comercial. No se propone pagar ni regenerar para aprobar una pieza. El post lleva "Voz con IA: elevenlabs.io".
- **Audio:** música al 0,06, que baja mientras habla la voz; pocos efectos, debajo de la música.
- **Avatar** (1 de noviembre de 2026): solo si es estratégico o se pide. Es el busto normal, sin fondo, abajo a la izquierda (`avatar: {}`), como en `2026-10-27-mcp-vs-acp`. En burbuja, nunca.
- **Lienzo sin zona segura** (20 de octubre de 2026): el diseño usa todo el lienzo dentro del margen de 36 px, sin esquivar los botones de Instagram.

## Cómo se trabaja

- **Un chat nuevo por Reel,** nunca a continuación de otro Reel ni después de un `/compact`. El traspaso entre chats es `content/<pieza>/estado.md`, no la conversación: la fase, el paso siguiente, las decisiones de Jeremy con sus palabras, lo que se probó y no funcionó, y lo pendiente para el motor.
- **Los cambios al motor** (kit, inspector, comandos) no se hacen a mitad de una pieza: se anotan en `estado.md` y van en su propia sesión.
- **Modo directo.** Si Jeremy dice "no me pidas aprobaciones", el Reel va de corrido en un solo chat: sin storyboard ni hoja de la puerta A, y las dos puertas se anotan con su frase en `notes`. Publicar sigue siendo otro pedido (regla 12).
- **Lo creativo lo hace el agente principal:** el ángulo, la tesis, los ganchos, el guion, el mundo, la dirección de arte y `video.tsx`. Lo demás se delega:

| Paso | Quién |
|---|---|
| Fuentes | Subagente `buscador-fuentes` (Sonnet 5.5): deja `facts.json` y responde una línea por dato |
| Análisis del Reel de referencia | Subagente `analista-referente` (Sonnet 5.5): deja `referente.md` |
| Arreglos mecánicos y revisión de cuadros | `npm run agy` ([referencia](referencia/agy.md)) |
| Crítica del guion | Gemini (`video:critique --guion --gemini`) |
| Crítica del video | Subagente `critico-ciego-video` (Sonnet 5.5), con un contexto nuevo |

Las fuentes y el referente corren a la vez, mientras el agente piensa el ángulo. El agente trabaja con sus respuestas: abre `facts.json` solo para la cifra exacta que va en pantalla.

## Los pasos

**1. El guion: `video.json`.** Los campos van en inglés y el contenido en español ([esquema](../schemas/video.schema.json)):
- `hooks`: de 1 a 3 ganchos, con lo que dice la voz (`said`), lo que se ve (`onScreen`, hasta 6 palabras) y su fórmula de `skills/ig-es/ganchos-es.json`. El primero es el elegido, y la escena 1 empieza con él;
- `scenes`: `id`, lo que dice la voz (`say`, escrito para el oído), lo que se ve (`see`, concreto) y el recurso visual (`resource`, de [recursos.json](../skills/carrusel-taste/recursos.json));
- `world`: la metáfora física que dura todo el video, en una línea;
- `meter`: lo que está en juego (`label`), su valor en el gancho (`from`) y en el cierre (`to`);
- `cover`: la escena del cuadro más fuerte y el segundo (`at`);
- `format`, `target` si es una réplica, `topic`, `art` y `caption`;
- `gateA` y `gateB`.

El guion sigue a `ig-reel` (`.agents/skills/ig-reel/SKILL.md`) a través de [skills/ig-es](../skills/ig-es/SKILL.md): el gancho en 2 s, una idea por frase y un cierre que vuelve al gancho.

**2. Revisar el guion:** `npm run video:script -- content/<pieza>`. Arma la hoja de la puerta A (`out/gate-a.md`) y avisa si:
- el gancho tarda más de 3 s;
- el texto en pantalla pasa de 6 palabras;
- la duración sale de su formato o de su `target`;
- el tema se parece al de una pieza de los últimos 14 días;
- falta `world`, `meter` o `cover`.

Corre `hookscore_es` y `beats_es` de `ig-reel` y la revisión de textos. Un gancho elegido con menos de 50 se discute con Jeremy, no se esconde. También arma `out/video-critica-ganchos/` para que un contexto nuevo ordene los ganchos.

**3. Storyboard y crítico del guion** (se saltan en modo directo, salvo el crítico):
- `npm run video:storyboard -- content/<pieza>`: los visuales de un primer `video.tsx`, sin voz, al ritmo estimado (`out/storyboard.png` y `.mp4`);
- `npm run video:critique -- content/<pieza> --guion --gemini`: Gemini lee el guion y el storyboard, y deja `out/video-critica-guion/informe.md` para la puerta A.

**4. Puerta A.** Solo el sí de Jeremy en el chat aprueba; el agente anota `gateA { approved: true, date }`. Sin ella no hay voz. Si después cambia lo que dice la voz, se vuelve a la puerta A.

**5. Lo que se ve: `video.tsx`.** Exporta `defineVideo` de `@motor/video`: `captions`, `chapters`, `stage` (el mundo y su cámara), `meter` y una entrada por escena con el mismo `id`, `tone`, `chapter`, `sfx`, `camera` y `Visual`. La dirección de arte sale de `post.json → art` si la pieza tiene carrusel, o de `npm run video:baraja -- content/<pieza>`. Lo que dice la voz no va aquí. Todo lo del kit está en la [referencia](referencia/kit-video.md).

**6. Voz:** `npm run video:prepare -- content/<pieza>`. Pide la puerta A. Genera la voz de cada escena con los tiempos por palabra de ElevenLabs, baja los efectos del catálogo y deja todo en `out/video/`. La voz se guarda en caché: si el texto no cambia, no se vuelve a pagar.

**7. Render e inspector:** `npm run video:render -- content/<pieza>`. Deja:
- `out/video.mp4`: 1080×1920 a 30 fps, H.264 yuv420p en BT.709 y AAC, a −14 LUFS;
- `out/video-hoja.png`: la portada, el final de cada escena y el medio de cada cambio. Es lo primero que se mira;
- `out/video-inspector.txt` y `out/video.sha256`.

`--borrador` sale a 540×960, en `out/video-borrador.mp4`, y no cuenta para la puerta B. `npm run video:studio -- content/<pieza>` abre la vista previa.

**8. Crítico ciego:** `npm run video:critique -- content/<pieza>` arma `out/video-critica/`: el video, un cuadro cada 2 s en tiras, la hoja, la portada recortada, lo que se oye con sus tiempos y el texto del post. Se le da al subagente `critico-ciego-video`, que escribe `informe.md` con la rúbrica.
- Se arreglan los tres problemas principales y se vuelve a renderizar.
- **Una ronda.** La segunda, con un contexto nuevo, solo si un punto sacó menos de 3 o hubo un error grave.
- El informe final se copia en `content/<pieza>/video-critica.md`.

**9. Puerta B.** Jeremy ve el video, la hoja y el informe. Después de su sí, el agente anota `gateB { approved: true, date, video: "<sha256>" }`. Si un render posterior da otro archivo, `video:render` la vuelve a `false`.

**10. Publicar,** solo si Jeremy lo pide: `npm run video:publicar -- content/<pieza> [--ensayo]`. Exige la puerta B con el mismo sha256, sube la portada de `cover` y activa la etiqueta de IA de Meta.

**Después:** a las 48 horas y a los 7 días, Jeremy pasa la captura de Insights. Se transcribe en `content/<pieza>/video-metrics.json` y `npm run video:metrics` regenera [el informe](metricas-video.md) ([cómo](referencia/metricas.md)).

## El inspector

Lee lo que el render dibujó: la composición le pasa el texto de un cuadro cada medio segundo, con su posición, su tamaño y su opacidad.

**Errores** (bloquean la puerta B):
- texto fuera del margen (36 px de diseño a cada lado, entre la pestaña y los subtítulos, que van de y 812 a 880);
- letra de menos de 22 px de diseño, o de 12 px en una interfaz del kit (`data-ui`);
- el gancho (`onScreen`) no se ve completo en el cuadro 1;
- subtítulos sin todas las palabras del guion.

**Avisos:** más de 6 palabras en pantalla sin contar subtítulos ni interfaces; la escena 1 abre con un título en vez de un objeto que se mueve; el gancho fuera del centro 3:4 de la grilla; vacío de más de 130 px sobre los subtítulos; una portada que ocupa menos del 35 % del recorte; más de 2 s sin cambio; `meter` sin mostrar; el volumen lejos de −14 LUFS; una duración fuera de rango.

Cada aviso es un error salvo que se pueda defender en una frase.

## Reglas de forma

- **El lienzo** es de 540×960 px de diseño y se renderiza a 2x. Las cifras de las skills de Remotion se dividen por 2: titulares de 42 px o más y texto de 22 px o más.
- **El primer cuadro** es un objeto que se mueve, con el gancho como rótulo encima. La grilla del perfil lo recorta al centro 3:4 (de y 120 a 840).
- **El mundo cambia de estado, no se reemplaza:** lo que pasó en una escena sigue ahí en la siguiente.
- **Las cosas aparecen una por una,** con la voz: `useCue("palabra")` da el segundo en que se dice, y los efectos van igual (`at: "palabra"`).
- **Cualquier cuadro congelado se puede publicar:** sin dobles exposiciones en los cambios.
- **El cierre se puede capturar** (una tabla, una pila, un ciclo) y lleva un solo CTA.
- **Datos:** cada cifra sale de `facts.json`. Una interfaz de ejemplo se rotula "Ejemplo ilustrativo"; lo que muestra una `Terminal` sale de `video:capture`.
- **Recursos de terceros:** solo los de `assets/catalog.json`, con licencia revisada y `sha256`. Imágenes y música generadas (`video:image`, `video:music`) se pagan: no se repiten ni se hacen variantes que nadie pidió.

## Comandos del Reel

```bash
npm run video:baraja -- content/<pieza>      # 3 direcciones de arte para video.json → art
npm run video:script -- content/<pieza>      # revisa el guion y arma la puerta A
npm run video:capture -- content/<pieza>     # corre los comandos de captures.json y guarda su salida
npm run video:storyboard -- content/<pieza>  # visuales sin voz, para la puerta A
npm run video:prepare -- content/<pieza>     # voz y tiempos (pide la puerta A)
npm run video:studio -- content/<pieza>      # vista previa
npm run video:render -- content/<pieza> [--borrador]
npm run video:critique -- content/<pieza> [--guion] [--gemini]
npm run video:publicar -- content/<pieza> [--ensayo]   # solo si Jeremy lo pide
npm run video:metrics                        # docs/metricas-video.md
npm run video:image -- content/<pieza> --name <n> --prompt "..." [--chroma] [--world]
npm run video:music -- content/<pieza> --name <n> --prompt "..."
npm run video:asset -- search "<consulta>"   # efectos CC0; add <bib>:<id> --id <n>
npm run agy -- <especificación.md> --pieza content/<pieza>   # paso mecánico a Antigravity
```
