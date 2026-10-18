# Plan: CLI de publicación

Estado al 17 de octubre de 2026:

| Fase | Estado |
|---|---|
| 1. Núcleo | Hecho, con 26 pruebas que pasan |
| 2. Instagram | Hecho. Probado con un perfil sin sesión: abre Chrome, detecta que falta el login y frena sin anotar nada. Falta el ensayo con tu sesión y la primera publicación real |
| 3. Integración con el motor | Hecho, con 4 pruebas. Probado de punta a punta hasta el login con una copia de una pieza |
| 4. Después | Pendiente |

Uso y detalles en [packages/publisher/README.md](../packages/publisher/README.md).

## Qué es

Un comando, `publisher`, que sube a una red social una pieza ya aprobada, usando Playwright, y anota el resultado en un registro central. Vive en `packages/publisher/`, no importa nada del carrusel y sirve para cualquier proyecto que le pase imágenes y un texto. La v1 publica en Instagram.

## Decisiones

| Tema | Decisión |
|---|---|
| Método | Playwright con el Chrome instalado y un perfil persistente por cuenta, con pausas aleatorias entre acciones |
| Plataformas | Instagram en la v1. Cada plataforma es un adaptador: TikTok y Facebook se suman sin tocar el núcleo |
| Ubicación | `packages/publisher/`, sin imports de otros paquetes. Se pasa a su propio repo cuando otro proyecto lo necesite |
| Idioma | El código, los comandos, los flags, los archivos, los campos JSON y los mensajes del CLI van en inglés. Los docs y el contenido siguen en español |
| Clic final | Automático. La aprobación humana es la puerta B, anotada en `post.json → puertaB`; sin ella `carrusel:publicar` no corre |
| Registro | Central: `publications.jsonl` en la raíz del proyecto, commiteado |
| Sesión | Una carpeta de perfil por plataforma y cuenta, fuera del repo. Te logueas una sola vez con `publisher login` |
| Programar | No entra en la v1 |

El nombre no es `publish` porque en npm `publish` es un script del ciclo de vida y correría con `npm publish`.

## Comandos

```bash
publisher login instagram --account dev
publisher post instagram --manifest path/to/publication.json [--dry-run] [--force]
publisher status [--id <piece>]
publisher mark tiktok --id <piece> --account dev --url <url>
```

- `--dry-run` hace todo menos el clic en Compartir y guarda una captura. Así se prueba sin publicar.
- `--force` publica aunque el registro diga que ya está publicada.
- `mark` anota lo que subiste a mano, en cualquier plataforma, tenga adaptador o no.

En este repo se llaman con `npm run publisher -- ...` y con `npm run carrusel:publicar -- <pieza> [--plataforma instagram] [--ensayo] [--forzar]`. El segundo sigue la convención del motor, que todavía está en español: por eso sus flags son `--ensayo` y `--forzar`.

## Contratos

El manifiesto es lo que el proyecto le pasa al CLI. Las rutas de `media` son relativas al manifiesto:

```json
{
  "id": "2026-10-17-top-3-comandos-claude-code",
  "account": "dev",
  "caption": "Deja de tratar a Claude Code como chat...",
  "media": ["out/01.png", "out/02.png"]
}
```

La configuración del proyecto va en `publisher.config.json`, en la raíz:

```json
{
  "registry": "publications.jsonl",
  "accounts": { "dev": { "instagram": "jacekt.dev" } }
}
```

El handle sirve para comprobar, antes de publicar, que la sesión abierta es la de la cuenta correcta.

Cada publicación es una línea del registro:

```json
{"id":"2026-10-17-top-3-comandos-claude-code","platform":"instagram","account":"dev","status":"published","at":"2026-10-18T19:02:11-05:00","url":"https://www.instagram.com/p/...","fingerprint":"sha256:...","source":"cli"}
```

- Los estados son `sending`, `published`, `failed` y `manual`. Para cada combinación de id, plataforma y cuenta vale la última línea.
- `sending` se escribe justo antes del clic en Compartir. Si el proceso muere ahí, la siguiente corrida no vuelve a publicar y te pide revisar el perfil.
- `fingerprint` es un hash de las imágenes y el texto. Muestra si la pieza cambió después de publicarse.

## Estructura

```
packages/publisher/
  src/
    cli.ts                     argumentos y salida, sin lógica
    publish.ts                 caso de uso: validar, consultar el registro, abrir sesión, publicar, anotar
    manifest.ts                esquemas Zod del manifiesto y la configuración, validación y huella
    registry.ts                leer y anexar publications.jsonl
    browser.ts                 abre Chrome con el perfil de la cuenta
    human.ts                   pause(min, max), clic con espera previa, texto pegado de una vez
    errors.ts                  PublisherError: errores para la persona, sin traza
    index.ts                   API pública para otros paquetes: PLATFORMS, platformById, postManifest
    platforms/
      platform.ts              interfaces Platform (límites y open) y Publisher (sesión: login, cuenta, post → { url })
      instagram.ts             el flujo de Instagram
      instagram.selectors.ts   textos y selectores de la interfaz en un solo lugar, en español e inglés
  test/                        node:test, con una plataforma falsa para el caso de uso
```

Reglas:

- El caso de uso depende de las interfaces `Platform` y `Publisher`, no de Playwright.
- Los selectores no salen de `instagram.selectors.ts`. Los textos de la interfaz de Instagram van en español e inglés porque dependen del idioma de la cuenta.
- Ningún archivo importa de `packages/carousel`.

## Fases

### 1. Núcleo

Manifiesto, configuración, registro, `human.ts`, `browser.ts` y los comandos `status` y `mark`.

**Listo cuando:** hay pruebas con `node:test` para el registro y el manifiesto. Del registro: la idempotencia, un `sending` colgado y que vale la última línea. Del manifiesto: medios que no existen y más imágenes que el límite.

### 2. Instagram

- `login` abre el perfil, espera a que entres, verifica el handle y cierra.
- `post` recorre el flujo: inicio, cerrar los avisos ("Ahora no"), Crear, Publicación, subir los archivos, recorte "Original", Siguiente dos veces, caption, Compartir y esperar la confirmación.
- Para la URL del post, abre el perfil y toma la primera publicación cuyo texto empieza igual. Si no la encuentra, anota sin URL y avisa.
- Si algo falla, guarda captura y HTML en `.publisher/errors/` (en .gitignore) y anota una línea `failed` con el error.
- Entre acciones espera entre medio segundo y 3 segundos. Si la misma cuenta publicó en los últimos 15 minutos, según el registro, espera además de 1 a 2 minutos.
- Si falla después del clic en Compartir, el registro se queda en `sending` en vez de `failed`, porque la publicación pudo haber salido.

**Listo cuando:** `--dry-run` llega a Compartir con una pieza real, y una publicación real queda en el registro con su URL.

### 3. Integración con el motor

- `carrusel:publicar <pieza>` ([publicar.ts](../packages/carousel/src/publicar.ts)) exige tres cosas: `post.json → puertaB.aprobado`, una imagen en `out/` por lámina y que `out/` sea más reciente que `slides.tsx`. Con eso deja el manifiesto en `out/publication.json`, con `out/NN.png` y `post.json → caption`, y llama a `postManifest`. El número de láminas sale de `out/texto-de-laminas.txt`, porque el render no borra los PNG de renders anteriores que tenían más láminas.
- Un cambio en `post.json → art` después del render no se detecta, porque anotar la puerta B también modifica `post.json`. El workflow lo cubre: si algo cambia después de la puerta B, vuelve a `false`.
- `puertaB` entra al esquema de `post.json`, con el mismo nombre que `puertaA`. El agente la anota cuando Jeremy aprueba en el chat.
- En `workflows/carrusel.md` se agrega el paso 14, "Publicar (opcional)", solo si Jeremy lo pide. En `AGENTS.md` queda la regla: nunca publicar sin ese pedido.
- `publisher.config.json` se crea con las dos cuentas.

**Listo cuando:** una pieza pasa de la puerta B a publicada con un solo comando, y una pieza sin puerta B da error.

### 4. Después

- TikTok y Facebook como adaptadores.
- Texto alternativo por lámina.
- Programar a una hora.
- La API oficial como otro adaptador de la misma interfaz `Platform`.

## Riesgos

- **Instagram cambia su interfaz.** Los selectores están en un solo archivo, `--dry-run` detecta el cambio sin publicar y cada fallo deja captura.
- **Bloqueos por automatización.** Se usa Chrome real con tu perfil, pausas aleatorias y una pieza por corrida. Automatizar va contra los términos de Instagram: el volumen bajo reduce el riesgo, pero no lo elimina.
- **Publicar dos veces.** El registro y el estado `sending` lo evitan.
