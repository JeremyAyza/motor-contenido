# Plan: Postiz como vía de distribución

Propuesta del 24 de octubre de 2026, pedida por Jeremy. No hay nada implementado ni instalado. Los datos de Postiz y de Meta se consultaron el 24 de octubre de 2026 y llevan su fuente (la lista está al final). Lo que no encontré va marcado como **sin verificar**.

## En corto

- **Recomendada: Postiz Cloud, plan Standard,** como una segunda vía del publisher (`--via postiz`) detrás de la puerta B. Chrome con Playwright sigue siendo la vía por defecto y el respaldo.
- La generación, la edición y el render no cambian. Postiz recibe el `out/video.mp4` ya aprobado, con su sha256, y nada más.
- **Lo que hoy lo frena:** Postiz no manda la etiqueta de IA de Instagram (`is_ai_generated`). Mientras no la mande, los Reels con voz sintética siguen saliendo por Chrome. El resto se puede construir y probar ya.

## Qué hay hoy

| Paso | Cómo funciona |
|---|---|
| Generar | Todo es local. `video:render` deja `out/video.mp4` y `out/video.sha256`, y el carrusel deja `out/NN.png` |
| Puerta B | Jeremy aprueba en el chat. El agente lo anota en `video.json → gateB` con el sha256, o en `post.json → puertaB` |
| Preparar | `video:publicar` exige la puerta B, que el sha256 coincida y que el MP4 sea más nuevo que `video.tsx`. Extrae la portada del cuadro de `video.json → cover` (`out/video-portada.png`) y escribe `out/publication.json` con `kind: "reel"` y `aiLabel: true`. `carrusel:publicar` hace lo mismo con las láminas |
| Publicar | `postManifest` abre el Chrome de Jeremy con su perfil y comprueba que la sesión sea la de `@jacket.dev`. Después sube el video y la portada, activa la etiqueta de IA y comparte |
| Registrar | `publications.jsonl` lleva una línea por evento: `sending` antes del clic, después `published` con la URL, o `failed`. La clave es pieza + plataforma + cuenta. `fingerprint` es el hash de los medios, el texto, la portada y la etiqueta |
| Rutina | Un Reel por día a las 19:00 de Lima. Jeremy escribe "publica el de hoy" y el agente corre el comando. No hay tarea programada |

Lo que duele hoy:
- la PC y Chrome tienen que estar encendidos a las 19:00;
- los selectores de Instagram se rompen (los dos primeros intentos del Reel de Scion fallaron por timeout);
- automatizar el navegador va contra los términos de Instagram;
- no se puede programar.

## Qué cambiaría

- **Lo que no cambia:** todo lo anterior a `out/publication.json`, las dos puertas, el manifiesto y el registro, que sigue siendo la fuente de verdad.
- **Lo que cambia:** el publisher suma una vía que habla con la API de Postiz en lugar de abrir Chrome. Postiz sube a Instagram por la API oficial de Meta, a la hora que se le pida, aunque la PC esté apagada.

## Postiz en datos

| Tema | Dato | Fuente |
|---|---|---|
| API | En la nube es `https://api.postiz.com/public/v1`; autoalojado, `https://<dominio>/api/public/v1`. La clave va en el encabezado `Authorization` | [P3], [P6] |
| Subir medios | `POST /upload`, en multipart con `file`. Acepta MP4 y recomienda H.264, AAC y 30 fps o menos. `adjust=true` lo vuelve a codificar; viene apagado | [P4], [P16] |
| Publicar | `POST /posts` con `type` (`now`, `schedule` o `draft`), `date` en UTC y, por cada canal, `integration.id`, `value` (texto y medios) y `settings` | [P5] |
| Estado | `GET /posts` por rango de fechas devuelve `state` (`QUEUE`, `PUBLISHED`, `ERROR` o `DRAFT`), `releaseURL` y el error de la plataforma | [P6] |
| Límite de la API | Solo cuenta para crear posts. La introducción dice 90 por hora (100 en la nube) y la página de crear dice 30. Si es autoalojado, se cambia con `API_LIMIT`. Con un Reel por día da igual | [P3], [P5], [P14] |
| Portada | `thumbnailTimestamp`, en milisegundos, elige el cuadro del video, y Postiz lo manda a Meta como `thumb_offset`. El código también acepta una imagen propia (`cover_url`), pero la API pública no la documenta: **sin verificar** por API | [P6], [P18], [P21] |
| Etiqueta de IA | Meta la acepta (`is_ai_generated`) con los dos tipos de login. Postiz no la manda: no está en su código de Instagram y el issue #1749 sigue abierto desde el 19 de julio. No encontré un PR | [M1], [P18], [P19] |
| Instagram | Hay dos rutas: con una página de Facebook vinculada (Facebook Login) o directa (Instagram Login, que Postiz llama "Instagram Standalone" y que pide cuenta profesional). Un Reel es un solo video con `post_type: "post"`. También hay carruseles, historias, trial reels y colaboradores | [P7], [P8] |
| Meta | Pide cuenta profesional, de empresa o de creador. El video tiene que estar en un servidor público en el momento de publicar. El límite es de 100 publicaciones por API cada 24 horas (la sección de carruseles dice 50) | [M1], [M2] |
| Analíticas | Por post: vistas, alcance, guardados, likes, comentarios y compartidos (`GET /analytics/post/{id}`) | [P6], [P18] |
| MCP | En la nube, `https://mcp.postiz.com/mcp-oauth-dynamic` (con OAuth, sin clave) o `https://mcp.postiz.com/mcp` con la clave como Bearer. Trae `integrationList`, `schedulePostTool`, `postsListTool`, `uploadFromUrlTool` y otras. Solo sube medios desde una URL pública, no archivos locales | [P2], [P9], [P10] |
| CLI | `postiz upload <archivo>`, con `POSTIZ_API_KEY`, y `POSTIZ_API_URL` si es autoalojado | [P11] |
| Licencia | AGPL-3.0. La última versión es la v2.25.3, del 24 de octubre de 2026. Para aportar código piden firmar un CLA | [P17], [P22] |

## Opción A: Postiz Cloud

| | |
|---|---|
| Ventajas | Las apps de Meta ya están aprobadas: no hay que crear una ni pasar revisión [P17]. Guarda el video en su almacenamiento público (`uploads.postiz.com`), de donde Meta lo baja [P11]. Publica a la hora aunque la PC esté apagada. Incluye el MCP, el CLI y la API [P1]. No hay nada que mantener |
| Limitaciones | La etiqueta de IA depende de que Postiz resuelva #1749. El video y el token de Instagram quedan en sus servidores. Standard tiene un tope de 5 canales. El código no se puede modificar. El tope de tamaño de subida no está publicado: **sin verificar** (los MP4 de hoy pesan entre 3 y 61 MB) |
| Costo | Standard cuesta 29 USD al mes, o 23 al mes si se paga el año. Incluye 5 canales y posts ilimitados, con 7 días de prueba gratis [P1] |
| Cambios en el repo | El adaptador, el registro y los flags del diseño de abajo. No se instala nada de Postiz en el repo |

## Opción B: Postiz autoalojado

| | |
|---|---|
| Ventajas | La licencia es gratis y no hay tope de canales. Los datos quedan en tu servidor. Se puede parchear la etiqueta de IA sin esperar |
| Limitaciones | Son 8 contenedores: Postiz, dos Postgres, Redis, Temporal con Elasticsearch, su interfaz y sus herramientas [P13]. Piden como mínimo 2 vCPU y 2 GB, y recomiendan 4 vCPU y 8 GB [P12]. Para programar tiene que estar siempre encendido, así que en tu PC no sirve: va en un VPS. Meta baja el video desde una URL pública con HTTPS, así que hacen falta un dominio y almacenamiento público (R2, o `/uploads` expuesto) [M1], [P15], [P18]. Necesita tu propia app de Meta: mientras no pase la revisión, solo publican las cuentas con rol en la app, y eso alcanza para tus dos cuentas [P8]. Actualizar y migrar te toca a ti; la v2.12 ya pidió una migración de Temporal [P23] |
| Costo | Un VPS de Hetzner cuesta desde 5,99 EUR al mes sin IVA (no verifiqué cuánta RAM trae ese plan) [C2]. R2 da 10 GB gratis al mes y no cobra la salida [C1]. A eso se suma tu tiempo de mantenimiento |
| Cambios en el repo | Los mismos que en A, más `POSTIZ_API_URL`. El servidor, el compose y la app de Meta quedan fuera del repo. Si se parchea Postiz, el parche va en un fork público aparte (AGPL) |

## Recomendación: A, Postiz Cloud Standard

1. **Jeremy busca menos trabajo, no otro servidor.** Cloud no pide VPS, dominio, almacenamiento público ni app de Meta. La app de Meta es lo más lento de autoalojar: según el README, la aprobación de Meta "can take weeks" [P17].
2. **Con una o dos cuentas, cuesta entre 23 y 29 USD al mes,** contra un VPS desde unos 6 EUR más las horas de mantenimiento.
3. **El pipeline no se entera.** Postiz es un adaptador más del publisher, y se deja de usar quitando un flag.
4. **El bloqueo de la etiqueta es el mismo en las dos opciones,** salvo que se autoaloje para parchearlo. Por un solo campo no vale la pena: conviene esperar #1749 o aportar el PR (con el CLA).

Autoalojar solo conviene si la cuenta de negocios termina manejando muchos canales de clientes, o si Postiz no resuelve la etiqueta en el plazo que Jeremy fije.

## Diseño: Postiz como otra vía del publisher

- **Es una vía, no una plataforma.** En el registro, la publicación sigue siendo `instagram`, con un campo nuevo, `via: "browser" | "postiz"`. Así la misma pieza no sale dos veces por dos vías, porque `decide()` ya compara pieza, plataforma y cuenta.
- **El adaptador** (`packages/publisher/src/platforms/postiz.ts`) implementa `Platform` y `Publisher` con el `fetch` de Node, sin SDK ni imports de otros paquetes. `open` no usa el perfil de Chrome.
  - `isLoggedIn`: `GET /is-connected`.
  - `currentHandle`: `GET /integrations`, el `profile` del canal configurado, siempre que no esté `disabled`. La comprobación de que es `@jacket.dev` se mantiene.
  - `post`: primero `POST /upload` del MP4 sin `adjust`, para que salga el mismo archivo del sha256. Después `POST /posts` con `type: "now"` o `"schedule"`, `settings: { __type: "instagram-standalone", post_type: "post" }` y `thumbnailTimestamp` igual al momento de `video.json → cover`.
  - `capture`: guarda en `.publisher/` la petición (sin la clave) y la respuesta.
- **Etiqueta de IA:** si el manifiesto trae `aiLabel: true` y Postiz no tiene el campo, el adaptador falla antes de subir nada. Cuando el campo exista, se manda y entra al `fingerprint` como hoy.
- **Manifiesto:** suma `coverAtMs`, que sale de `coverSeconds()` (ya existe), y un `scheduleAt` opcional.
- **Registro:** suma el estado `scheduled` y los campos `via`, `remoteId` (el `postId` de Postiz) y `scheduledFor`. `sending` se escribe antes de `POST /posts`, igual que hoy antes del clic en Compartir, porque Postiz no documenta idempotencia [P5]. `publisher sync` lee `GET /posts` y anexa `published` con `releaseURL`, o `failed` con el error de Meta.
- **Configuración:** `publisher.config.json` guarda los id de canal de Postiz, que no son secretos:
  ```json
  "postiz": { "channels": { "dev": { "instagram": "<integration id>" } } }
  ```
- **Comandos** (los del motor siguen en español):
  ```bash
  npm run video:publicar -- content/<pieza> --via postiz [--ensayo]        # ahora; --ensayo revisa la clave, el canal y el handle sin subir nada
  npm run video:publicar -- content/<pieza> --via postiz --programar 2026-10-25T19:00   # hora de Lima
  npm run publisher -- sync                                                # trae el estado y la URL
  npm run publisher -- cancel --id <pieza>                                 # DELETE /posts/{id}
  ```
  Las 19:00 de Lima son las 00:00 UTC del día siguiente, porque Lima no tiene horario de verano.

## Cómo entra el agente

- **Por la API, a través del publisher. Es la única forma de publicar.** Las puertas viven en el código del repo (`gateB`, el sha256, `puertaB`), y el agente se las saltaría si publicara directo por MCP. Además, el MCP no sube archivos locales.
- **"Publica el de hoy" no cambia para Jeremy.** El agente corre `video:publicar -- --next --via postiz`. El `--next` es de la fase 6 del piloto y todavía no existe.
- **La clave** va en `.env` como `POSTIZ_API_KEY`, más `POSTIZ_API_URL` si se autoaloja. `.env` ya está en `.gitignore`. Jeremy la crea en Postiz y la escribe él. El agente nunca la pide ni la imprime, ni la pone en el chat, en `publisher.config.json` o en una URL. `.env.example` lleva la línea vacía. El publisher lee `.env` con un cargador propio, porque no importa de otros paquetes.
- **El MCP es opcional y solo sirve para consultar** la cola y las analíticas. Si se suma, que sea con la URL de OAuth, que no lleva clave. No tiene un modo de solo lectura documentado, así que AGENTS.md tendría que decir que el agente no usa `schedulePostTool`, `uploadFromUrlTool` ni `postSettingsTool`. Recomiendo no sumarlo hasta que haga falta.
- **Instagram lo conecta Jeremy** en su navegador, con el OAuth de Meta, igual que hoy escribe su contraseña en Chrome.

## Fases

| Fase | Qué | Listo cuando |
|---|---|---|
| 0. Decidir | Jeremy responde las decisiones de abajo. Se sigue el issue #1749 | Hay respuestas y una fecha para volver a revisar el issue |
| 1. Adaptador | `postiz.ts`, el registro, el manifiesto, `sync`, `cancel` y los flags, probados contra un servidor HTTP falso que sigue el contrato de la OpenAPI [P6]. No hacen falta cuenta ni pago. Se actualizan `packages/publisher/README.md`, `docs/plan-publicar.md`, `workflows/video.md` (paso 9) y `workflows/carrusel.md` (paso 14). AGENTS.md, solo con el sí de Jeremy | Pasan `npm run typecheck` y `npm test`, y la vía de Chrome sigue igual |
| 2. Conectar | Jeremy abre la prueba de 7 días, conecta `@jacket.dev` por Instagram Login, crea la clave y la escribe en `.env`. El agente corre `publisher login instagram --via postiz` | El handle coincide y `--ensayo` pasa |
| 3. Primera pieza | Si #1749 sigue abierto, un carrusel, que no lleva etiqueta. Si ya está resuelto, un Reel. La portada se compara con la que sale por Chrome | `sync` trae la URL al registro |
| 4. La semana | Solo si Jeremy cambia la decisión de no tener tarea programada. Después de la puerta B en lote, `video:programar` deja los 7 Reels en la cola a las 19:00. Si un render cambia el sha256, `cancel` los saca | Las 7 líneas `scheduled` pasan a `published` |
| 5. Después | `sync` lleva a `video-metrics.json` las analíticas que da Postiz; el resto sigue saliendo de las capturas de Insights. Se suman TikTok, que en Postiz sí tiene etiqueta de IA (`video_made_with_ai`) [P19], y la cuenta de negocios como segundo canal | Cada una con su propio sí |

## Riesgos

| Riesgo | Qué pasa | Qué se hace |
|---|---|---|
| Perder la etiqueta de IA | Postiz no manda `is_ai_generated`. Según #1749, la etiqueta manual de Instagram solo existe en la app móvil (**sin verificar**) | El adaptador se niega a publicar un `aiLabel: true` sin ese campo, y los Reels siguen por Chrome hasta entonces |
| La portada | Hoy se sube una imagen; por Postiz se manda el milisegundo del cuadro. Debería dar lo mismo, porque la portada ya es un cuadro del video, pero no verifiqué cómo elige el cuadro Meta | Se compara en la fase 3. Si no coincide, se prueba la imagen propia que agregó el PR #1856 [P21] |
| Los límites de la Graph API | Son 100 posts por API cada 24 horas, más un límite por app que Meta no publica en números. En Cloud la app es compartida: #1681 cuenta un caso en que Meta respondió "action is blocked", el post salió igual y el reintento lo duplicó [P20] | Una pieza por corrida. Ante un `failed` de Postiz, primero `sync` y una revisión del perfil, y recién después `--forzar` |
| La cuenta profesional | La API pide una cuenta de empresa o de creador. Que `@jacket.dev` ya tenga Insights sugiere que es profesional: **sin verificar**. Instagram Login no pide página de Facebook [M2] | Jeremy confirma el tipo de cuenta en la app. Si ya es de creador, no hace falta pasarla a empresa |
| La licencia AGPL | Usar Postiz por HTTP no vuelve AGPL al motor (esto no es asesoría legal). Si se modifica Postiz y se ofrece a otros por red, hay que publicar el código modificado | No se copia código de Postiz al repo. Si se parchea, va en un fork público aparte |
| Los datos y la dependencia | El video, el texto y el token de Instagram quedan en Postiz. Si Postiz se cae o cambia su API, esa vía se corta | Chrome queda de respaldo, y el registro local sigue siendo la fuente de verdad |
| La recodificación | Con `adjust=true`, Postiz cambia el archivo | El adaptador nunca lo activa |
| La clave | Una clave escrita en la URL del MCP queda en archivos de configuración | La clave va solo en `.env`, y el MCP se conecta por OAuth |

## Lo que tiene que decidir Jeremy

1. ¿Nube (recomendada) o autoalojado?
2. Mientras Postiz no mande la etiqueta de IA, ¿los Reels siguen por Chrome (recomendado), esperamos a #1749 o abrimos nosotros el PR (eso pide firmar el CLA)?
3. ¿Se programa la semana después de la puerta B en lote, o se sigue con "publica el de hoy" cada día? Lo primero cambia la decisión del 22 de octubre de no tener tarea programada.
4. ¿`@jacket.dev` es una cuenta de creador o de empresa? ¿La conectamos por Instagram Login, sin página de Facebook (recomendado)?
5. ¿Usamos el MCP de Postiz para consultar, o nada de MCP por ahora (recomendado)?
6. ¿Qué vía queda por defecto: Chrome (recomendado al principio) o Postiz cuando funcione?
7. Después de la prueba, ¿plan mensual o anual? ¿Ocupan los 5 canales la cuenta de negocios o TikTok?

## Fuentes

Todas se consultaron el 24 de octubre de 2026.

- **P1.** [Postiz, precios](https://postiz.com/pricing)
- **P2.** [Postiz, MCP](https://postiz.com/mcp)
- **P3.** [Postiz, introducción a la API pública](https://docs.postiz.com/public-api/introduction.md)
- **P4.** [Postiz, subir un archivo](https://docs.postiz.com/public-api/uploads/upload-file.md)
- **P5.** [Postiz, crear un post](https://docs.postiz.com/public-api/posts/create.md)
- **P6.** [Postiz, especificación OpenAPI](https://docs.postiz.com/public-api/openapi.json)
- **P7.** [Postiz, ajustes de Instagram en la API](https://docs.postiz.com/public-api/providers/instagram.md)
- **P8.** [Postiz, Instagram autoalojado](https://docs.postiz.com/self-host/providers/instagram.md)
- **P9.** [Postiz, herramientas del MCP](https://docs.postiz.com/mcp/tools.md)
- **P10.** [Postiz, configurar el MCP](https://docs.postiz.com/mcp/setup.md)
- **P11.** [Postiz CLI, autenticación](https://docs.postiz.com/cli/authentication.md) y [subida de medios](https://docs.postiz.com/cli/media-upload.md)
- **P12.** [Postiz, requisitos del sistema](https://docs.postiz.com/self-host/installation/system-requirements.md)
- **P13.** [postiz-docker-compose, docker-compose.yaml](https://github.com/gitroomhq/postiz-docker-compose/blob/main/docker-compose.yaml)
- **P14.** [Postiz, referencia de configuración](https://docs.postiz.com/self-host/configuration/reference.md)
- **P15.** [Postiz, almacenamiento de subidas](https://docs.postiz.com/self-host/configuration/uploads.md)
- **P16.** [Postiz, problemas con subidas](https://docs.postiz.com/general/troubleshooting/uploads.md)
- **P17.** [postiz-app, README y licencia](https://github.com/gitroomhq/postiz-app) y [v2.25.3](https://github.com/gitroomhq/postiz-app/releases/tag/v2.25.3)
- **P18.** [postiz-app, instagram.provider.ts en main](https://github.com/gitroomhq/postiz-app/blob/main/libraries/nestjs-libraries/src/integrations/social/instagram.provider.ts)
- **P19.** [postiz-app, issue #1749: is_ai_generated](https://github.com/gitroomhq/postiz-app/issues/1749)
- **P20.** [postiz-app, #1681: duplicados y fallos falsos en Instagram](https://github.com/gitroomhq/postiz-app/pull/1681)
- **P21.** [postiz-app, PR #1856: portada desde la galería (fusionado el 21 de octubre)](https://github.com/gitroomhq/postiz-app/pull/1856)
- **P22.** [postiz-app, CONTRIBUTING.md (CLA)](https://github.com/gitroomhq/postiz-app/blob/main/CONTRIBUTING.md)
- **P23.** [Postiz, instalación con Docker Compose](https://docs.postiz.com/installation/docker-compose)
- **M1.** [Meta, Content Publishing de Instagram](https://developers.facebook.com/docs/instagram-platform/content-publishing/)
- **M2.** [Meta, resumen de la plataforma de Instagram](https://developers.facebook.com/docs/instagram-platform/overview)
- **C1.** [Cloudflare, precios de R2](https://developers.cloudflare.com/r2/pricing/)
- **C2.** [Hetzner, servidores en la nube](https://www.hetzner.com/cloud/)

[P1]: https://postiz.com/pricing
[P2]: https://postiz.com/mcp
[P3]: https://docs.postiz.com/public-api/introduction.md
[P4]: https://docs.postiz.com/public-api/uploads/upload-file.md
[P5]: https://docs.postiz.com/public-api/posts/create.md
[P6]: https://docs.postiz.com/public-api/openapi.json
[P7]: https://docs.postiz.com/public-api/providers/instagram.md
[P8]: https://docs.postiz.com/self-host/providers/instagram.md
[P9]: https://docs.postiz.com/mcp/tools.md
[P10]: https://docs.postiz.com/mcp/setup.md
[P11]: https://docs.postiz.com/cli/authentication.md
[P12]: https://docs.postiz.com/self-host/installation/system-requirements.md
[P13]: https://github.com/gitroomhq/postiz-docker-compose/blob/main/docker-compose.yaml
[P14]: https://docs.postiz.com/self-host/configuration/reference.md
[P15]: https://docs.postiz.com/self-host/configuration/uploads.md
[P16]: https://docs.postiz.com/general/troubleshooting/uploads.md
[P17]: https://github.com/gitroomhq/postiz-app
[P18]: https://github.com/gitroomhq/postiz-app/blob/main/libraries/nestjs-libraries/src/integrations/social/instagram.provider.ts
[P19]: https://github.com/gitroomhq/postiz-app/issues/1749
[P20]: https://github.com/gitroomhq/postiz-app/pull/1681
[P21]: https://github.com/gitroomhq/postiz-app/pull/1856
[P22]: https://github.com/gitroomhq/postiz-app/blob/main/CONTRIBUTING.md
[P23]: https://docs.postiz.com/installation/docker-compose
[M1]: https://developers.facebook.com/docs/instagram-platform/content-publishing/
[M2]: https://developers.facebook.com/docs/instagram-platform/overview
[C1]: https://developers.cloudflare.com/r2/pricing/
[C2]: https://www.hetzner.com/cloud/
