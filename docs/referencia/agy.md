# Antigravity (`agy`) en el motor

`agy` es el CLI de Google Antigravity. Corre con la suscripción de Jeremy, con Gemini 3.8 Flash y una cuota amplia. El motor lo usa para los pasos mecánicos, que así no gastan el pensamiento de Opus.

## Qué hace y qué no

| Tarea | `agy` | Por qué |
|---|---|---|
| Arreglos mecánicos del inspector (margen, letra chica, solapes) | Sí | La especificación es cerrada, y `agy` la comprueba con `video:frames` o `video:render --escena` |
| Revisar cuadros después de un arreglo, con una lista de qué mirar | Sí | Ve imágenes |
| Emparejar el guion visual con la biblioteca | Sí, con `--plan` y `--esquema` | Es comparar fichas, no crear |
| Extraer una escena nueva a la biblioteca | Sí | Es una refactorización con especificación y pruebas |
| Auditar la documentación | Sí, con `--plan` | Lee mucho de una vez |
| Transcribir las capturas de Insights a métricas | Sí | Es transcribir imágenes |
| Buscar fuentes | A prueba, contra el subagente `buscador-fuentes` | Busca en la web, pero el 3 de noviembre de 2026 dio una versión vieja de Remotion |
| Guion, ganchos, mundo, dirección de arte y composición | No | Es lo creativo, y lo hace Opus |
| Criticar el video con audio | No | No ve ni oye un MP4 (probado el 3 de noviembre de 2026) |
| Puertas, publicar, commits y voz | No | Las puertas y los commits son de Jeremy; la voz gasta créditos |

## Cómo se delega

1. Opus escribe la especificación en un `.md`: qué cambiar, en qué archivos, cómo debe quedar y con qué comando se comprueba.
2. La manda a `agy` en segundo plano y sigue trabajando:

```bash
npm run agy -- <especificación.md> [--pieza content/<pieza>] [--toca <ruta>[,<ruta>]]
npm run agy -- <especificación.md> --plan [--esquema <esquema.json>]   # solo lectura
```

- `--pieza` y `--toca` dicen qué puede cambiar. Sin ellas, puede cambiar todo el repo. Lo que puede cambiar tiene que estar limpio en git antes de empezar: si algo sale mal, se descarta con `git checkout`.
- `--plan` es solo lectura (`agy --mode plan`) y no pide un árbol limpio. Sirve para auditar y emparejar.
- `--esquema` obliga a responder con un JSON de esa forma (`agy --json-schema`). Sin él, `agy` devuelve un informe con `terminado`, `archivos`, `comprobaciones` y `notas`.
- `--modelo` (por defecto `gemini-3.8-flash-high`), `--esfuerzo` (por defecto `high`) y `--tiempo` (en minutos, por defecto 15).

El comando imprime qué archivos cambiaron, el resultado de las comprobaciones de `agy` y si terminó. El registro completo queda en `.cache/agy/<fecha>-<especificación>.json`. Sale con código 1 en cuatro casos:
- `agy` falló o se cortó por tiempo;
- dijo que no terminó;
- intentó un comando no permitido;
- cambió archivos fuera de su alcance.

## La regla de confianza

Lo que `agy` dice que pasó se comprueba antes de darlo por hecho:
- **el diff:** Opus lee `git diff` de los archivos que cambió;
- **la comprobación:** Opus vuelve a correr el comando de comprobación;
- **lo que trae de la web** es un borrador. Una cifra que va en pantalla se abre en su fuente y entra a `facts.json` como cualquier otra.

Si mientras `agy` corría Opus editó otros archivos, esos aparecen como "fuera de su alcance". Se comparan con lo que editó Opus.

## La configuración

Vive en `~/.gemini/antigravity-cli/settings.json`. Se corrigió el 3 de noviembre de 2026, con respaldo en `settings.backup-2026-11-03.json`:
- **el modelo por defecto** es `gemini-3.8-flash-high`. El anterior, "Gemini 3.1 Pro (Low)", ya no existía;
- **`trustedWorkspaces`** ya no incluye `C:\` entero; el motor está en la lista con su ruta;
- **`allowNonWorkspaceAccess`** está en `false`: `agy` no lee fuera del repo. Por eso `npm run agy` copia la especificación a `.cache/agy/`;
- **`permissions.allow`** suma `video:frames`, `video:check`, `video:script`, `docs:check` y `video:render -- content/<pieza> --escena <id>`. Ya estaban `npm test`, `npm run typecheck`, `npx tsc`, `node --import tsx --test`, `git status` y `git diff`;
- **`permissions.deny`** prohíbe publicar, `publisher`, los cambios de git (`commit`, `push`, `reset`, `checkout`, `rebase`, `merge`, `stash`) y los comandos que gastan créditos (`video:prepare`, `video:music` y `video:image`).

Sin interfaz (`-p`), un comando que no está en `allow` se rechaza solo, y **`agy` termina el turno ahí, sin respuesta**. Un comando en `deny` también se rechaza, pero `agy` sigue y lo reporta. Por eso `npm run agy` le pasa la lista de comandos permitidos (`ALLOWED_COMMANDS` en `packages/tools/src/agy.ts`). Para sumar uno, se agrega en los dos lugares.

**En Windows, `npm.cmd`.** `agy` corre los comandos en PowerShell, y en esta máquina la política de ejecución bloquea `npm.ps1`. Por eso `npm run agy` le pide escribir `npm.cmd` y `npx.cmd`, y las reglas aceptan las dos formas: `^npm(\.cmd)? run ...`. Las prohibiciones también, así que `npm.cmd run video:publicar` sigue rechazado. Además, `npm run agy` lanza `agy` sin las carpetas `node_modules/.bin` en el `PATH`, porque el repo trae ahí un `npm.cmd` roto. No se cambió la política de PowerShell: es una decisión de seguridad de Jeremy.

## Lo que se probó

Con `agy` 1.4.8 y 1.4.12, el 3 de noviembre de 2026:

| Prueba | Resultado |
|---|---|
| Buscar en la web | Sí busca, con URLs, pero un dato salió viejo |
| Ver una imagen | Sí: describió bien textos, colores y gráficos |
| Ver y oír un MP4 | No, y lo dijo sin inventar |
| `npm run agy` con una especificación de prueba | Creó el archivo, corrió las pruebas y reportó 6 de 6 en 19 s |
| Un comando no permitido (`video:storyboard`) | Rechazado; `npm run agy` lo reporta y sale con 1 |
| Un comando en `deny` (`npm run publisher`) | Rechazado; `agy` siguió y lo reportó |
| La auditoría de la documentación (`--plan`, con esquema) | 11 contradicciones, 34 decisiones con fecha y 16 referencias a código inexistente, en 15 min. Intentó un comando no permitido al final, pero dejó la respuesta |
| Condensar `workflows/carrusel.md` a `docs/carrusel.md` | Un borrador bueno en 7 min; necesitó una corrección de una línea |
| `video:emparejar` con una ficha de prueba | Veredictos sensatos con su razón, en 2 min |
| `npm.cmd run video:frames` y mirar el cuadro | Generó el cuadro bien en 54 s. **Dijo "terminado" sin hacer el paso 2** (describir la imagen): la regla de confianza no es opcional |

## Medir

`python scripts/medir-sesion.py <transcripción.jsonl> [--desde <UTC>] [--hasta <UTC>]` cuenta, entre otras cosas, las llamadas a `agy` de una sesión. Las transcripciones están en `~/.claude/projects/<repo>/`.
