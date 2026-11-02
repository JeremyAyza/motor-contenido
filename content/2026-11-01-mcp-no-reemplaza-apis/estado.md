# Estado: 2026-11-01-mcp-no-reemplaza-apis

## Dónde quedó

- **Fase A (guion) aprobada el 2026-11-01.** Jeremy respondió "Aprobar así" en el chat, después de ver los tres puntos de abajo. Está en `video.json → gateA`.
- **La hoja:** `out/gate-a.md`, con `out/storyboard.png`, `out/storyboard.mp4` y el informe de Gemini en `out/video-critica-guion/informe.md`.
- **Fases B y C hechas el 2026-11-01,** en la misma sesión de la fase A, porque Jeremy pidió "Haz esta tarea aquí" y después "Sí, córrelo". Voz, música, `video.tsx` final, crítico ciego y sus arreglos. El inspector no da errores.
- **El render aprobado:** `out/video.mp4`, 1080×1920, H.264 yuv420p y AAC, −14,1 LUFS, sha256 `a3fc3cd5cfaa2f7ce703f19706c63afc109ed449fae3912599c7eac52b8ac8c4`. La hoja es `out/video-hoja.png`. Es el primero con el avatar normal.
- **Puerta B aprobada el 2026-11-01.** A la pregunta "¿Apruebas este render después de verlo y oírlo?", Jeremy respondió "Apruebo el video" en el chat. Está en `video.json → gateB` con ese sha256 y vale solo para este archivo.
- **Lo que no se anotó:** "te doy mi sí" y un primer "Apruebo" llegaron antes de que existiera este render.
- **Paso siguiente:** publicar, solo cuando Jeremy lo pida, y después las métricas a las 48 horas y a los 7 días.
- **Ya no son candidatos:** `c2811c9d`, `89663149` y `96d2aa8c`, con burbuja, y `61d45c72`, con busto pero con "Solo lo que usas" sobre el modelo.
- **Sin decidir:** cuándo se publica. Jeremy aprobó el guion, no una fecha. La recomendación sigue siendo no publicar antes del 2026-11-10. Publicar es otro pedido, aparte de aprobar.
- **Duración real: 117,2 s** con `tempo` 1,25 y 1,7 s de pausas (`hold`), contra los 116,16 s del referente, a un 0,9 %. Los 134 s y los 3,1 s del gancho que avisa `video:script` calculan con el `tempo` 1,12 de la cuenta y no son los reales.

## El encargo

Jeremy pidió copiar la estructura de https://www.instagram.com/p/Db5y4nnsRl2/ (@rick.theengineer, MCP frente a las APIs, 116 s, 55.791 me gusta) con nuestra marca. Se mantiene lo que pidió para la réplica de CORS: "nuestro video debe tener una mejor calidad y creatividad de motion grafic y mostrar el avatar por partes, reestructura el guion de forma estrategica". "Por partes" se entiende como momentos elegidos, cada uno con un papel.

## Lo que se le mostró en la puerta A

Con "Aprobar así" quedan firmes el gancho "MCP no reemplaza tus APIs" y el guion sin las sugerencias 1 y 2 de Gemini.

1. **Se repite el tema.** El Reel de MCP contra ACP se publicó el 2026-10-27, hace 5 días. Al referente, repetir un tema a los pocos días le costó 10 veces menos vistas. El ángulo es otro (MCP contra API, no contra ACP), pero las dos piezas dicen que antes cada herramienta pedía una integración a mano. Los 14 días se cumplen el 2026-11-10: el video se puede hacer ahora y publicar desde esa fecha. Recomendación: no publicar antes.
2. **El gancho.** Elegido: "MCP no reemplaza tus APIs." (hookscore 95). El orden ciego puso primero "¿MCP mató a las APIs? Le quito la tapa." (hookscore 42), porque deja una pregunta abierta, aunque dice que es un formato gastado y que la respuesta es obvia. Su crítica al elegido es que da la conclusión de entrada; solo vio esa frase, no el "Nunca las tocó. Le quito la tapa." que sigue. Recomendación: quedarse con el elegido.
3. **Las sugerencias de Gemini** (4,88 de 5, calculado sobre su estimación de 2:15). Ver abajo. Recomendación: no aplicar la 1 ni la 2.

## La reestructura, frente al referente

Su orden es: pregunta, qué es una API, muchos servicios, el modelo, segunda app, protocolo, descubrimiento, "por debajo sigue la API" a los 97 s y la respuesta a los 104 s.

| Decisión | Por qué |
|---|---|
| La tesis va en el gancho, y la prueba a los 8 s | Su tesis llega a los 101 s (87 % del video). Abre con una pregunta neutra y un tablero vacío |
| Quitar la tapa es la prueba, con código real | Lo suyo es un recuadro con "STILL THE API" durante 3 s, sin una petición. El nuestro muestra `client.Search.Code` y `GET /search/code` |
| El costo se cuenta una vez | Él lo cuenta tres veces en 40 s |
| El medidor baja: 5, 10, 50, 15 | Su contador sube a 10 y nunca baja. Lo que prepara nunca se paga |
| "Se mudaron al servidor" | Él deja creer que el costo desaparece. La autenticación y los errores siguen, una sola vez |
| Se ve una definición real de herramienta | Él muestra 4 nombres y un ícono. Uno, `read_pull_requests`, no aparece así en el README |
| El modelo no llama: va después del menú, como su prueba | Él lo pone a los 36 s, antes de que exista el menú |
| Segundo acto nuestro: el menú no es gratis | El referente no lo toca. Abre un giro cuando el tema ya parecía cerrado |
| Regla de decisión antes del cierre | Él no dice cuándo usar cada una. Esto es lo que se manda al equipo |
| CTA de enviar, que repite "tus APIs" | Él no tiene CTA en el video |

## Mundo y dirección de arte

- **Una pared con su instalación.** La placa de MCP se desatornilla y cae. Detrás está el cobre de siempre. La película retrocede a la pared con 5 hoyos, entra la regleta violeta, y el paquete recorre todo el edificio.
- **`collage`** (repartidas: collage, titular-gigante, diario-de-prueba): objetos de ferretería, cinta rotuladora y papel rasgado. Amarillo de cinta eléctrica al frente, negro y cobre detrás. **Violeta solo para MCP, cobre solo para la API, rojo para lo que cuesta.** Se separa del papel verde de CORS y del fondo oscuro de MCP contra ACP.
- **Movimientos propios de esta pieza:**
  - el destornillador gira desde el cuadro 1; saltan los tornillos y cae la placa;
  - la cámara se mete por el hoyo;
  - la regleta entra de costado y los enchufes distintos se igualan con un clac;
  - las etiquetas rojas se despegan y atraviesan la pared;
  - la rotuladora imprime el menú;
  - el modelo es un recorte con ojos saltones, que leen, dudan y se marean;
  - la boleta sale impresa y la cortan unas tijeras.
- **Subtítulos:** `pill`. CORS usó `marker`.

## Avatar

**Corrección de Jeremy, 2026-11-01:** "NO hace falta un recortar mi avatar con un circulo y enfocado en la cara, esta bien como funcionaba con 2026-10-27-mcp-vs-acp, ese debería ser como el standar para el avatar si es que se utiliza el avatar, no como esta en este caso". Y después: "avatar en burbuja Nunca, sino el avatar normal sin fondo como en 2026-10-27-mcp-vs-acp y no es si Jeremy lo pide, es si es estrategico para el video o si se solicita explicitamente". La regla está en `docs/direccion-reels.md`, sección 6.

Ahora es el avatar normal: `avatar: { scenes: ["gancho", "antes", "costo", "cierre"] }`, 220 px, abajo a la izquierda y sobre los subtítulos. Va en 4 de 9 escenas, cada una con un papel:
- `gancho`: quien abre la placa;
- `antes`: pregunta para qué existe MCP y queda como el dev que rehace todo;
- `costo`: avisa de la letra chica;
- `cierre`: pide el envío.

No aparece en `adentro`, `enchufe`, `menu`, `elige` ni `regla`, donde manda el gráfico. El personaje que elige es el modelo, para no confundirlo con el avatar.

**Lo que se movió para que el busto no tape nada** (solo imagen, la voz no cambió y no vuelve a la puerta A):
- `gancho`: la placa va 80 px a la derecha.
- `antes` y `enchufe`: la pared subió 114 px, para que los logos queden sobre el busto. La banda de abajo, junto al busto, lleva los números grandes (5, 10, 50, 15) y las frases. El 50 y el 15 ya no van dentro de sus hojas.
- `elige`: esa banda muestra las paradas del pedido (Tu app, MCP, server, API).
- `costo`: la boleta es más angosta y el modelo sube junto a ella; sus ojos siguen las filas.
- `cierre`: la pila termina sobre el busto, y los servicios y el envío van a su derecha.

Los `see` de `video.json` son los que se aprobaron en la puerta A: todavía hablan de un avatar que se encoge y de otras posiciones. Lo que manda en la imagen es `video.tsx`.

En `main` el avatar solo salta al empezar la escena. Con la rama `refs/heads/claude/silly-moore-e35189` podría entrar dentro de una frase, pero no se unió: eso lo decide Jeremy.

## Lo que cambiaron las fuentes (`facts.json`)

- **"La API REST normal" está incompleto:** `search_code` es REST y `list_issues` es GraphQL, los dos del mismo repositorio. La voz lo dice, y se usa `search_code` para el ejemplo con código.
- **`create_issue` ya no es el nombre por defecto:** hoy es `issue_write`. `read_pull_requests` tampoco existe así: va `pull_request_read`.
- **La prueba más directa es de Notion:** "which uses the Notion API". Ninguna fuente oficial dice "MCP no reemplaza las APIs". Esa frase es nuestra, y no se atribuye.
- **N×M solo está en el blog de GitHub,** atribuido a David Soria Parra. Por eso la voz dice "GitHub pone este ejemplo", y 15 es cuenta propia (el post lo aclara).
- **Reintentos:** van en la lista de lo que pedía cada integración, pero no en "se mudaron". La especificación no dice cómo reintenta un servidor.
- **55K tokens es de noviembre de 2025:** la pantalla lo fecha. El servidor de GitHub cambió, y no hay un total actual de herramientas, así que no se da.
- **"Nunca las tocó" tiene excepción:** Filesystem, Git y Memory no envuelven una API. Va en la letra chica del post.
- **Se quitó "MCP hace una sola cosa":** MCP también tiene recursos y prompts. Quedó "lo resuelve con una idea".
- **La regla "tu código decide: API; el modelo elige y varias apps comparten: MCP" es opinión,** apoyada en `model-controlled`. Se agregó "varias apps" porque con una sola app sirve el function calling directo.

## Lo que no entra, y por qué

- **La explicación de qué es una API (5 a 15 s del referente):** el público ya programa, y frena antes de la prueba.
- **"Tool discovery" en una tarjeta de título con el avatar:** se dice sobre el modelo leyendo, para no parar el video.
- **Gmail, Jira y base de datos:** van GitHub, Slack, Notion, Stripe y Linear, porque tenemos documentación de su servidor MCP.
- **La pregunta del post del referente ("la peor frase de MCP reemplaza X"):** el post y el video piden una sola cosa, enviar.
- **Cifras de adopción (110 millones de descargas):** no apoyan la tesis.

## Lo que dijeron los críticos

**Orden ciego de los ganchos** (subagente, solo con el tema y los ganchos; `video:script` borra su informe al regenerar la carpeta, por eso queda aquí):
1. "¿MCP mató a las APIs? Le quito la tapa.": pregunta abierta y se entiende sin sonido; formato gastado y respuesta obvia. Promete cerrar un debate y mostrar algo abierto.
2. "MCP no reemplaza tus APIs.": el más claro, con y sin sonido; da la conclusión de entrada.
3. "Abre un servidor MCP. Adentro hay una API.": descartable en pantalla, porque "Adentro hay una API" no nombra MCP. Además promete como regla general algo que no siempre es cierto.

**Gemini sobre el guion** (`out/video-critica-guion/informe.md`). Dice que se habría ido a los 0:32.
1. Condensar a la mitad "antes". **Recomendación: no.** Son unos 18 s reales, contra los 40 s del referente, y ahí está el medidor que se paga después.
2. Aliviar el viaje de `elige`, porque repite `adentro`. **Recomendación: no.** "El modelo no llama a nada" es nuevo. Si Jeremy quiere recortar, lo que se puede quitar es "y la respuesta sube por el mismo camino".
3. Dar más fuerza a "30 a 50 herramientas". **Se puede hacer en imagen en la fase B,** sin cambiar la voz.

## Lo que se probó y no funcionó

- **`usePop` dentro de condiciones o después de un `return`:** rompe el orden de los hooks y corta el render. Se usa `popAt`, con `spring`, que es un valor. `Appear` puede seguir con `usePop` porque lo llama antes de salir.
- **El destornillador a -52°:** tapaba el gancho en el cuadro 1. Quedó a -24°.
- **Línea de código a 22 px:** no entraba. Va solo la 325, partida en tres, a 28 px.
- **`video:prepare` tal cual:** falló con el `quota_exceeded` engañoso (la carrera de `withFallback`, "14 credits remaining"). La rama con el arreglo no se unió. Se corrió con la clave de respaldo como principal, solo en ese proceso. Las voces ya están en caché.
- **`video:script` después del informe de ganchos:** borra ese informe y lo agregado a mano en `out/gate-a.md`.

## Lo que se hizo en la fase B

- **Voz:** ElevenLabs F, `tempo` 1,25, 116,0 s con la pausa de `gancho`. No se cambió el texto aprobado.
- **Música:** `audio/cama.mp3` (Lyria), al volumen por defecto.
- **Movimiento:**
  - desenfoque direccional y líneas de velocidad en los paneos;
  - las tomas de la regleta entran con un clac y un anillo;
  - el paquete cambia de etiqueta al cruzar el servidor: `list_issues` en violeta, `GraphQL` en cobre y `respuesta` de vuelta, con estela;
  - la boleta sale línea por línea; las tijeras la cortan y lo de abajo cae;
  - caen 14 herramientas reales del README sobre el modelo mareado.
- **Cambios en pantalla, solo imagen:**
  - `adentro`: "Tu agente" antes de la cinta;
  - `antes`: "¿Para qué existe MCP?" enorme y el rótulo de retroceso "Antes";
  - `enchufe`: una cinta `MCP` en cada app;
  - `menu`: "Se describe solo", y los ojos siguen a la cinta que se resalta;
  - `costo`: "La letra chica", "No es gratis", "Elige peor" y "Solo lo que usas". Es la sugerencia 3 de Gemini;
  - `regla`: "¿Cuál usas?" sobre fondo limpio, API y MCP golpean con la voz y entran tres apps.
- **Sonido:** chicharra del destornillador, tornillos, rotuladora, boleta, caja registradora y tijeras, por debajo de la música.
- **Limpieza:** las partes del mundo fuera de cuadro ya no se dibujan.

## Avisos del inspector que quedan

Sin errores y sin aviso de imagen quieta. Quedan 39 de margen, todos pasajeros, y uno del gancho:
- **A 6 s:** la placa que cae.
- **A 8 s, 76 a 76,5 s y 81 s:** la cámara propia (`rigKeys`) está en movimiento y el inspector la lee como quieta. Es el mismo aviso falso de CORS.
- **A 42 s, 46,5 s, 67,5 s y 95 s:** "El mismo enchufe", una caja de servidor, el sello y "Solo lo que usas", mientras entran.
- **A 97,5 s:** los paneles de `regla` entrando de costado.
- **"El gancho queda fuera del centro 3:4":** en el cuadro 1 las letras de "MCP no reemplaza" empiezan cerca de y 135, y el recorte de la grilla empieza en y 120. No se ve cortado. Apareció solo en este render, sin cambios en el título; no se investigó la causa.

## El crítico

- **Una ronda, 3,90 de promedio** (`video-critica.md`), antes de los arreglos y con el avatar en burbuja. Retención sacó 3 y los demás puntos, 4. No se repitió, porque ningún punto sacó menos de 3 ni hubo error grave. Está bajo el umbral de la puerta B (todos en 4 o más y promedio de 4,5), y la nota no se volvió a medir con este render.
- **Vio** cuadros cada 2 s y la transcripción, no el video ni el audio.
- **En frío se habría ido a la 1:24,** en la tabla de tokens quieta.
- **Se aplicó, solo imagen:**
  - la boleta sale fila por fila con la voz y una suma sube hasta el total; una caja de mensaje vacía en "antes de escribir nada";
  - "30 a 50 herramientas" dura menos, y los nombres se apilan sin pisarse;
  - el 50 lleva "Ejemplo de GitHub", "5 clientes" y "10 sistemas". El 15 ya no va sobre las 2 apps: tiene su propio dibujo, con la misma cuenta y "cuenta propia";
  - `menu` y `cierre` llenan el cuadro: "Lo importante", la definición más grande, "Mismo formato" y una pila que hace lugar cuando golpea el sello;
  - la cita de Notion y `GraphQL`, más grandes;
  - 1,2 s de pausa al final, para que el envío se vea antes del corte.
- **No se aplicó:**
  - acortar la voz o sacar la letra chica: cambia el guion que Jeremy aprobó y vuelve a la puerta A. Si la retención preocupa, es lo primero que se recortaría;
  - quitar el subtítulo de los primeros 2 s, porque el marco lo pone en todos los videos;
  - el título y el subtítulo que dicen "La letra chica" a la vez, que dura menos de 1 s.

## Para la puerta B

- **Audio sin oír:** ni el agente ni el crítico lo pueden oír. Jeremy tiene que escucharlo: voz, música y efectos.
- **Voz:** Jeremy decidió el 2026-11-01 usar por ahora la voz gratuita. Falta la licencia comercial. El post ya lleva "Voz con IA: elevenlabs.io".
- **Si se vuelve a preparar la voz:** el texto está en caché, así que no paga de nuevo. Si un arreglo cambia lo que dice la voz, vuelve a la puerta A.
- **Avatar:** sigue saltando al empezar la escena. La rama `refs/heads/claude/silly-moore-e35189` no se unió. Si Jeremy la pide, hay que poner las marcas (`data-zoom`, `data-camera-moving`, `data-screen`) y las entradas por palabra.
- **Lo que todavía se puede mejorar:** en `antes`, la hoja "Ejemplo de GitHub" queda vacía cerca de 1 s antes de que aparezcan los puntos, y en el paneo de `elige` a `costo` hay un cuadro solo amarillo con líneas de velocidad.
- **Marco:** "Integraciones" sigue diminuto en el medidor. Por eso el 5, el 10, el 50 y el 15 también golpean grandes en la banda de abajo.
- **Logos:** MCP, GitHub, Notion, Stripe, Linear, Claude y Cursor salen de Simple Icons; Slack y OpenAI, del catálogo. No se revisaron las condiciones de uso del logo de MCP.

## Para el motor

Van en su propia sesión:
- **`video:script` borra `out/video-critica-ganchos/informe.md`** cada vez que corre, y la hoja no incluye ese orden ni el informe de Gemini.
- **`video:script` y `video:storyboard` no aplican `voice.tempo` de la pieza:** avisan de una duración y un gancho que no son los reales. En una réplica larga, el aviso es de un 15 %.
- **Kit:** `Stamp`, `Dust`, `Appear`, `rigAt` y `shakeAt` ya se copiaron en dos piezas seguidas. `Dymo`, `Torn` y `Model` pueden servir a otras.
