---
name: ig-es
description: Capa de este repo sobre las skills de Instagram de .agents/skills (instagram-agent-skill). Úsala siempre que uses una skill ig-* aquí; dice qué cambia para contenido en español, qué rutas usar y cómo correr las herramientas con los wrappers.
---

# ig-es

Las 13 skills `ig-*` de [`.agents/skills/`](../../.agents/skills) son el paquete [instagram-agent-skill](../../.agents/instagram-agent-skill/ORIGEN.md) (MIT), **instalado sin modificar**. Lee cada una para su criterio: están en inglés y sirven igual. Esta capa solo dice lo que cambia en este repo. Si algo de aquí contradice una skill original, manda esto; si contradice AGENTS.md, manda AGENTS.md.

## Rutas

Las skills originales leen y escriben en `~/.claude/instagram/`. En este repo:

| La skill pide | Usa |
|---|---|
| `~/.claude/instagram/voice.md` | [docs/voz.md](../../docs/voz.md) |
| `~/.claude/instagram/swipe.md` | [docs/swipe.md](../../docs/swipe.md) (lo genera `npm run carrusel:swipe`) |
| `~/.claude/instagram/plan.md` | `docs/radar/AAAA-MM-DD.md` ([workflows/radar.md](../../workflows/radar.md)) |
| `~/.claude/instagram/log.md` | `content/*/brief.json` y `content/*/metricas.json` |

## Herramientas: siempre por los wrappers

Los scripts originales tienen listas en inglés (palabras de relleno, peticiones, aperturas débiles) y con texto en español dan resultados falsos. Cada wrapper importa el script original, reemplaza solo esas listas y deja el resto igual. Se corren con cualquier Python 3, o con `npm run py --` si no sabes cuál hay:

| Original | Wrapper | Qué reemplaza |
|---|---|---|
| `ig-human/humanize.py` | `humanize_es.py` | Léxico en español ([slop-es.json](slop-es.json)) y mayúsculas con tilde |
| `ig-human/detect.py` | `detect_es.py` | Léxico, palabras con tilde y el chequeo VOICE (el español no tiene contracciones) |
| `ig-caption/caption.py` | `caption_es.py` | Peticiones y hashtags en español; "#1" no cuenta como hashtag |
| `ig-reel/hookscore.py` | `hookscore_es.py` | Listas en español, largo de portada (3 a 8 palabras), código y términos técnicos como algo concreto, `--brief`; `--video` puntúa lo que dice la voz con el largo de una frase dicha |
| `ig-reel/beats.py` | `beats_es.py` | Palabras con tilde, lo concreto de `hookscore_es`, palabras vacías del bucle en español, el ritmo de la voz de la cuenta (162 palabras por minuto) y `--video` (una frase de `video.json` por beat, con su escena) |
| `ig-viral/swipe.py` | `swipe_es.py` | Fórmulas con patrones en español ([ganchos-es.json](ganchos-es.json)) y encabezados en español |

```bash
python skills/ig-es/hookscore_es.py --brief content/<pieza>/brief.json
python skills/ig-es/caption_es.py content/<pieza>/out/texto-del-post.txt --keywords "claude code,mods"
python skills/ig-es/humanize_es.py borrador.txt --report
python skills/ig-es/detect_es.py borrador.txt
python skills/ig-es/hookscore_es.py --video content/<pieza>/video.json
python skills/ig-es/beats_es.py --video content/<pieza>/video.json --target 60
npm run carrusel:swipe -- docs/swipe/2026-10.tsv
```

`npm run carrusel:render` ya corre `caption_es`, `humanize_es` y `detect_es` sobre el texto del post y las láminas, y `npm run carrusel:brief` corre `hookscore_es`. `npm run video:script` corre `hookscore_es --video`, `beats_es --video` y la misma revisión de textos sobre el guion. Los informes de los scripts salen en inglés (PASS, WARN, HOOK SCORE): es la salida original.

## Lo que cambia respecto de las skills originales

1. **Idioma.** Todo lo que se publica va en español neutro, sin guiones largos. Los ejemplos en inglés de las skills son patrones, no texto para traducir.
2. **`ig-carousel`.** Se toman sus reglas: la portada que gana el deslizamiento, la lámina 2 que se entiende sola, una idea por lámina, la lámina de resumen que se captura y se manda, un solo CTA, letra de 32px reales o más y la copia aprobada antes del render. **No** se toma su estructura fija (portada, lo que está en juego, ideas, resumen, CTA) como plantilla: en este repo el número de láminas y la composición las decide el argumento (AGENTS.md). Tampoco se numeran las láminas en el contenido: el contador del marco es un experimento opcional (`art.contador`).
3. **Ganchos.** La portada se lee, no se dice: de 3 a 8 palabras, más una línea de promesa. Las fórmulas que requieren experiencia propia (1, 6, 8 y 15) solo se usan con una historia que Jeremy dio; las que requieren fuente (5, 23 y 25), con un dato de `facts.json`. Nunca se inventa una cifra ni un caso.
4. **`ig-caption`.** Siempre es el trabajo B (el texto del post completa el carrusel). Hasta 5 hashtags: Instagram puso ese tope el 19 de diciembre de 2025. La única petición del texto es la misma que el CTA de la última lámina.
5. **CTA con palabra clave por DM** ("comenta GUÍA y te lo mando"): no se usa, porque obliga a enviar DMs y aquí no se automatizan (AGENTS.md). Se puede usar si Jeremy responde a mano.
6. **`ig-plan`.** La mezcla de Reels y formatos en inglés se reemplaza por la tabla de [workflows/radar.md](../../workflows/radar.md) hasta que exista el flujo de video.
7. **`ig-viral`.** Para carruseles la columna de vistas lleva me gusta (no hay vistas públicas). Lectura a ritmo humano con el navegador de Jeremy: nunca iniciar sesión por él ni hacer scraping.
8. **`ig-audit`.** Las métricas van en `content/<pieza>/metricas.json` ([workflows/metricas.md](../../workflows/metricas.md)).
9. **`ig-reel`, en el flujo de video** ([workflows/video.md](../../workflows/video.md)). Se toman su forma (gancho en 2 s, lo que está en juego, una idea por beat, el cierre que vuelve al gancho), sus 26 fórmulas y sus dos herramientas, que `video:script` corre por los wrappers. Lo que cambia:
   - **La voz es sintética:** el guion es para la voz de la cuenta (`accounts/dev.json`), no para que Jeremy lo grabe, y no hace falta `voice.md` de cámara.
   - **La duración** es de 30 a 60 s para un explicativo, no de 15 a 45.
   - **El guion y el texto en pantalla** van en `video.json` (`say` y `onScreen`), no en un bloque impreso.
   - **La zona segura de `ig-reel` no se usa:** el diseño ocupa todo el lienzo con el margen del marco del carrusel (decisión de Jeremy), y el inspector de video revisa ese margen en px de diseño (540×960).
   - **El registro** no va a `log.md`: queda en `video.json` y en `video-metrics.json`.
10. **Fuera del carrusel y del video por ahora:** `ig-repurpose`, `ig-story`, `ig-comment`, `ig-reply`, `ig-dm` y `ig-profile` (usar una vez antes de la primera publicación). Si se usan, aplican las mismas reglas: nada se envía sin que Jeremy lo haga, y publicar solo pasa por `carrusel:publicar` cuando él lo pide, con la puerta B aprobada (AGENTS.md, regla 12).

## Probar los wrappers después de actualizar las skills

```bash
python skills/ig-es/hookscore_es.py --hook "Deja de pegar todo el repo en el chat"
python skills/ig-es/caption_es.py content/2026-10-16-mods-claude-code/out/texto-del-post.txt
python skills/ig-es/detect_es.py content/2026-10-16-mods-claude-code/out/texto-del-post.txt
python skills/ig-es/beats_es.py --video content/2026-10-19-que-es-ray-tracing/video.json
```

Si un wrapper dice que el original "cambió", el script original renombró algo que el wrapper reemplaza: ajusta el wrapper, nunca el original.
