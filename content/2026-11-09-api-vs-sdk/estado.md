# Estado: 2026-11-09-api-vs-sdk

Réplica para @jacket.dev del Reel de @rick.theengineer sobre API y SDK (https://www.instagram.com/p/DfXOuMOMAu9/, 101,5 s), con OpenAI en lugar de Stripe.

## Fase

**Puerta B aprobada (2026-11-09), sin publicar.** Queda el primer render (1 de 2): **102,4 s**, `out/video.mp4` con sha256 `6eec2fe9c6876f9cbd13556b61e515add6bda208323da15a884a9fcf68653d9a`, anotado en `video.json → gateB`. El informe del crítico está en `video-critica.md`.

## Paso siguiente

1. **Publicar solo cuando Jeremy lo pida:** `npm run video:publicar -- content/2026-11-09-api-vs-sdk`. Exige este mismo sha256: si se vuelve a renderizar, la puerta B se cae.
2. `npm run video:cosechar -- content/2026-11-09-api-vs-sdk` para proponer escenas a la biblioteca (todavía no se corrió).
3. Métricas a las 48 horas y a los 7 días de publicado.

## Producción (2026-11-09)

- **Emparejar:** la biblioteca está vacía, así que las 16 escenas son `nueva` (`emparejar.json`; no se llamó a `agy`). El guion visual cambió **0 veces** después de emparejar. Parte de la biblioteca en pantalla: **0 %** (techo, 50 %). No se parece a las últimas 3: es la única con el lienzo claro de Rick y su conmutador API | SDK.
- **Arreglos con la voz real y los cuadros:**
  - **cámara:** sin `camera`, el escenario encuadraba el mundo de 540×960 entre la pestaña y los subtítulos (zoom 0,8), y los fondos de Rick quedaban con bordes del color del tono. Ahora el gancho fija `camera: { focus: { x: 270, y: 427 }, zoom: 1 }`: el mundo es el lienzo, a sangre;
  - **la cuña violeta** empieza bajo la fila de la pestaña (`BAND`, 42 px, en `world.tsx`), salvo en el gancho: a sangre tapaba la pestaña y el medidor;
  - **gancho:** el ≠ y su efecto caen en "pero"; "mismo" quedaba a 0,68 s del corte;
  - **menu:** las piezas de la cocina se encienden una por una dentro de su tarjeta, en vez de una tira que se desplazaba fuera del margen (8 errores del inspector);
  - **sdk:** la caja cae desde menos alto y entra con un fundido; su "SDK" salía por encima de la pestaña;
  - **una-funcion:** "Ejemplo ilustrativo" sube sobre la tarjeta del código; el 1 naranja lo tapaba.
- **El inspector del render completo** deja un solo aviso: 7 palabras a los 2 s, defendido abajo.

## Crítica del primer render (crítico ciego, ronda 1, `out/video-critica/informe.md`)

**3,80 de 5, sin error grave.** Gancho 4, Tesis 4, Valor 4, Retención 3, Compartible 4, Cierre y CTA 3, Voz y guion 4, Legibilidad 4, Recurso visual 4. Ningún punto bajó de 3 y no hubo error grave, así que no corresponde una segunda ronda. Sus arreglos y lo que recomiendo:
1. **Retención:** quitar la sigla deletreada (0:15), la ruta `output, content, text` (0:33) y Android (1:12), para bajar a unos 85 s. **No aplicarlo:** rompe la estructura de Rick que Jeremy pidió copiar, cambia la voz y vuelve a la puerta A.
2. **CTA de una sola acción** ("guarda") y Mercado Pago antes o fuera. **No aplicarlo:** el CTA de dos pedidos con "[X o Y]" lo pidió Jeremy (lo mismo que ya dijo Gemini en la puerta A).
3. **Gancho y choques:** el subtítulo repite el título y el medidor "LÍNEAS A MANO 35" no se explica. Eso toca la voz y no se aplica. Los dos choques visuales se iban a arreglar, pero Jeremy aprobó el primer render tal como está:
   - "SDK" encima de "API" en el cierre (1:28 a 1:30, `scenes/cierre.tsx`);
   - la línea azul que cruza `/v1/responses` en la petición (0:30, `scenes/peticion.tsx`).

Si Jeremy quiere aplicar 1 o 2, es un cambio de guion: vuelve a la puerta A y se regenera la voz.

## Decisiones de Jeremy

- **Encargo (2026-11-09):** "crear un nuevo video siguiendo el AGENTS.md y demás. Copia el mismo guion y estructura solo parafrasealo, mejoralo y/o complementalo, también inserta mi avatar pero por momentos o partes". El CTA final: "algo como (no igual, tú piénsalo): 'Sígueme para aprender más conceptos de programación e IA y guarda este video la próxima vez que tengas que integrar [X o Y servicio/librería]' con el ícono de compartir y guardar". "Tal vez en lugar de Stripe puedas escoger alguna otra más común."
- **Servicio (2026-11-09):** "Sí, con OpenAI", sobre el plan que proponía OpenAI como ejemplo y "OpenAI o Mercado Pago" en el CTA.
- **Puerta A (2026-11-09):** "apruebo", sobre el gancho, el guion de 16 escenas, el storyboard y la comparación con Rick. No pidió la caja 3D, así que queda plana. Los arreglos de Gemini quedan sin aplicar.
- **Puerta B (2026-11-09):** "Me gusta mucho el resultado actual, a mi parecer esta listo", sobre el primer render. Por eso no se hace el segundo render, y los arreglos del crítico quedan sin aplicar, también los dos choques visuales (1:28 y 0:30). Escribió "aun lo publiques": se lee como "aún no lo publiques", así que no se publicó.

## Decisiones de esta pieza

- **Estructura copiada de Rick, en su orden:** gancho versus, la app y el tercero, la pregunta, la sigla y el contrato, la carta del restaurante y su cocina, la petición, la respuesta en JSON, el problema a mano, el SDK como caja, una sola función, la radiografía, Android, el repaso y el diagrama final.
- **Mejoras y complementos frente a Rick:**
  - código real de la documentación de OpenAI (POST /v1/responses, `gpt-6-astra`, `client.responses.create`);
  - `output_text` solo existe en el SDK, no en el JSON;
  - los reintentos del SDK con su cifra (2 por defecto);
  - el SDK de OpenAI se genera desde la especificación de su API;
  - la carta de OpenAI con cuatro rutas reales;
  - lenguajes oficiales en el repaso, con Java y Go en beta.
- **El CTA** es el que pidió Jeremy: seguir y guardar, con los íconos de compartir y guardar de Instagram. Son dos pedidos y la regla dice uno (`video:script` avisa "ONE ASK"); se mantiene porque lo pidió él. Se dicen dos servicios (OpenAI o Mercado Pago), como su "[X o Y]".
- **El número del medidor:** "Líneas a mano", de 35 a 1. Las 35 líneas son las de `code.ts → HAND_JS`, un ejemplo nuestro rotulado "Ejemplo ilustrativo"; si el código cambia, cambia lo que dice la voz.
- **Aspecto (réplica parecida):**
  - de Rick: el lienzo claro `#F3F6F9` con rejilla, el conmutador API | SDK, los fondos por capítulo con cuña diagonal (azul noche para el problema, menta para Android, violeta sobre durazno para el SDK), el violeta de la API y el naranja del SDK, las tarjetas blancas con sombra suave;
  - de @jacket.dev: el acento `#4F46E5`, el marco (pestaña `api-vs-sdk.md`, puntos, firma), el medidor y el avatar.
- **La caja SDK es plana.** La de Rick es un render 3D; la regla de estilo dice 3D solo si Jeremy lo pide, y en la puerta A no lo pidió.
- **Avatar por momentos,** en los de Rick: la app (`app`), la carta (`menu`), el problema (`problema`) y el repaso (`repaso`), más el CTA, donde pide seguir. Busto abajo a la izquierda, sin burbuja.
- **Duración:** 102,4 s con la voz real a `tempo` 1,25, dentro del ±10 % de los 101,5 s de Rick.
- **Tema repetido:** "MCP no reemplaza APIs" se publicó el 2026-11-02 y también habla de APIs (`video:script` avisa). El ángulo es otro (API contra SDK); los 14 días se cumplen el 2026-11-16.

## Crítica antes de la puerta A

- **Ganchos (crítico ciego, Sonnet, `out/video-critica-ganchos/informe.md`):** orden 3, 2, 1, con el elegido primero. Avisa que "Tu SDK no es una API" puede leerse como clickbait si no se aclara enseguida; "La lleva adentro" lo aclara en la frase siguiente.
- **Guion (Gemini 3.8 Flash, `out/video-critica-guion/informe.md`):** 4,19 de 5, sin error grave. Gancho 5, Tesis 5, Valor 5, Retención 3, Compartible 4, Cierre y CTA 2, Voz 4. Sus arreglos:
  1. CTA de un solo pedido y sin Mercado Pago, que no se nombró antes. Recomendación: no aplicarlo, porque el CTA de dos pedidos con "[X o Y]" lo pidió Jeremy.
  2. Comprimir la carta, la petición y el JSON para llegar al SDK antes. Recomendación: no aplicarlo, porque rompe el orden de Rick, que Jeremy pidió copiar.
  3. No repetir con la voz la lista de tareas que ya se leyó. Recomendación: no aplicarlo; Rick hace lo mismo (lista y después el código con las etiquetas que se encienden).
- **Guion visual congelado** con `video:congelar` el 2026-11-09.

## Avisos defendidos

- **El gancho** se dice entero en 1,47 s con la voz real: el aviso de 3,5 s ya no corre.
- **7 palabras en pantalla a los 2 s:** el título del gancho (6) y la ficha "API", que es la misma palabra hecha objeto.
- **La firma casi no se lee sobre el durazno** los últimos 2 s del gancho (tono `invert`, letra clara); la pestaña y el medidor sí se leen. Si el crítico lo marca, se arregla.
- **"ONE ASK" y "CTA genérico":** el CTA de dos pedidos es pedido de Jeremy.

## Pendiente para el motor

- Nada por ahora.
