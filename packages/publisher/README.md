# publisher

CLI que publica una pieza ya aprobada en una red social y lleva un registro de qué se subió, dónde y cuándo. Maneja tu Chrome con Playwright y una sesión guardada por cuenta, con pausas aleatorias entre acciones. No importa nada de otros paquetes, así que sirve para cualquier proyecto que le pase imágenes y un texto. El plan está en [docs/plan-publicar.md](../../docs/plan-publicar.md).

Plataformas con adaptador: Instagram. `mark` registra cualquier plataforma.

## Configurar

`publisher.config.json` va en la raíz del proyecto. El CLI lo busca desde la carpeta actual hacia arriba:

```json
{
  "registry": "publications.jsonl",
  "accounts": { "dev": { "instagram": "jeremyayza.dev" } }
}
```

## Primer uso

```bash
npm run publisher -- login instagram --account dev
```

Se abre Chrome: entras a mano y el CLI comprueba que el handle sea el de la configuración. La sesión queda guardada fuera del repo y no se guarda ninguna contraseña.

## Publicar

Un manifiesto por publicación. Las rutas de `media` son relativas al manifiesto:

```json
{
  "id": "2026-10-17-top-3-comandos-claude-code",
  "account": "dev",
  "caption": "Deja de tratar a Claude Code como chat...",
  "media": ["out/01.png", "out/02.png"]
}
```

```bash
npm run publisher -- post instagram --manifest content/<pieza>/publication.json --dry-run
npm run publisher -- post instagram --manifest content/<pieza>/publication.json
```

- `--dry-run` hace todo menos el clic en Compartir y guarda una captura en `.publisher/dry-runs/`. No mira ni toca el registro.
- `--force` publica aunque el registro diga que ya está publicada.
- Antes de abrir el navegador revisa archivos, formatos, peso, cantidad de imágenes, largo del caption y hashtags.
- Antes de publicar comprueba que la cuenta abierta sea la del manifiesto.
- Si la cuenta publicó en los últimos 15 minutos, espera de 1 a 2 minutos.

## Registro

`publications.jsonl` tiene una línea por evento. Para cada id, plataforma y cuenta vale la última.

| Estado | Qué quiere decir |
|---|---|
| `sending` | Se iba a hacer clic en Compartir. Si se queda así, el proceso murió ahí y la siguiente corrida no publica hasta que revises el perfil |
| `published` | La plataforma confirmó la publicación. Se guarda la URL si la encuentra |
| `failed` | Falló antes de compartir; no se publicó nada. La siguiente corrida lo vuelve a intentar |
| `manual` | Lo subiste a mano y lo anotaste con `mark` |

```bash
npm run publisher -- status
npm run publisher -- status --id <pieza>
npm run publisher -- mark tiktok --id <pieza> --account dev --url <url>
```

## Dónde quedan las cosas

| Qué | Dónde |
|---|---|
| Sesiones de Chrome | `%LOCALAPPDATA%\publisher\profiles\<plataforma>\<handle>`, o `PUBLISHER_HOME` |
| Capturas de ensayos y errores | `.publisher/` en la raíz del proyecto (en .gitignore) |
| Chrome | El instalado, o el que diga `CHROME_PATH` |

## Si Instagram cambia su interfaz

Todos los textos y selectores están en [instagram.selectors.ts](src/platforms/instagram.selectors.ts), en español e inglés. Cada fallo deja una captura y el HTML de la página: corrige el selector ahí y confirma con `--dry-run`.

## Agregar una plataforma

1. Implementa `Platform` y `Publisher` ([platform.ts](src/platforms/platform.ts)) en `src/platforms/<plataforma>.ts`, con sus selectores en un archivo aparte.
2. Regístrala en `PLATFORMS`, en [cli.ts](src/cli.ts).

El caso de uso ([publish.ts](src/publish.ts)) no cambia.

## Pruebas

```bash
npm test
```
