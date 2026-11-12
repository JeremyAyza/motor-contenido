---
name: content-engine-copy
description: Replica un Reel de referencia para @jacket.dev, de punta a punta en un solo chat. Jeremy lo abre con /content-engine-copy <link> [indicaciones] al empezar un chat nuevo.
argument-hint: <link del Reel> [indicaciones]
disable-model-invocation: true
---

# Copiar un Reel

Lo que pidió Jeremy: **$ARGUMENTS**

La réplica sigue la estructura y el guion del referente, parafraseados (ninguna frase textual), y copia su aspecto salvo la marca propia ([réplica parecida](../../../docs/referencia/kit-video.md#réplica-parecida)). Dura lo que el referente (`target`). Los referentes son buenos: lo que se gana aquí es velocidad.

## Lo que no se hace

- No se buscan fuentes: ni `buscador-fuentes`, ni búsquedas web, ni `facts.json`. La fuente es el Reel copiado (regla 1 de [AGENTS.md](../../../AGENTS.md)).
- No se critica el guion (`video:critique --guion`) ni se discute el gancho del referente.
- No se le muestra a Jeremy el guion, el storyboard ni ninguna hoja para aprobarlos.
- No se agrega ningún dato que el referente no tenga (regla 3).

## Los pasos

1. **Lee [AGENTS.md](../../../AGENTS.md) y [docs/reel.md](../../../docs/reel.md),** y nada más. Crea `content/AAAA-MM-DD-<tema-en-kebab>/` con la fecha de hoy.
2. **Análisis corto.** Manda al subagente `analista-referente` la URL, la carpeta y lo que tiene que sacar: la estructura escena por escena, lo que dice la voz con sus tiempos, la duración y los cuadros del aspecto para una réplica parecida. Deja `referente.md`. Mientras corre, lee las indicaciones de Jeremy.
3. **La ronda de preguntas (puerta A).** Una sola, de 2 a 4 preguntas, con la herramienta de preguntas si existe (`AskUserQuestion`); si no, en el chat, con opciones numeradas. Cada pregunta trae la opción recomendada primero y una línea de por qué. Se pregunta solo lo que cambia el Reel y Jeremy no dijo ya, por ejemplo:
   - qué se adapta: el mismo tema, u otro producto o ejemplo más conocido para su público;
   - el CTA y la despedida;
   - el avatar (por defecto, no) y el 3D si el referente lo usa;
   - algo del referente que se ve claramente viejo (una versión, un precio): se pregunta si se cambia, sin buscar nada.

   No se pregunta lo de "Decisiones vigentes" de docs/reel.md (estilo, voz, ritmo, duración). Las preguntas y las opciones van en frases completas, aunque el chat esté en caveman. Sus respuestas van a `video.json → gateA { approved: true, date, notes }`, con sus palabras en `notes`.
4. **Producción completa,** según docs/reel.md, sin pedir más aprobaciones: guion parafraseado en `video.json` (pasos 1 y 2), comparación con el referente antes de diseñar el mundo y con los primeros cuadros, guion visual congelado, `video.tsx`, voz, iteración por escena, render, crítico ciego y sus arreglos (pasos 5 a 9). Lo que no esté decidido lo decides tú y lo anotas en `estado.md`. Solo se le vuelve a preguntar a Jeremy si algo bloquea la pieza.
5. **Puerta B: "¿lo publico?".** Pásale `out/video.mp4` y `out/video-hoja.png` (con `SendUserFile` si existe), el texto del post y, en una línea, lo que el crítico dejó sin arreglar. Pregúntale si se publica.
   - **Sí:** anota `gateB` con el sha256 y corre `npm run video:publicar -- content/<pieza>`. El login lo corres tú; usuario y contraseña los escribe Jeremy en la ventana de Chrome.
   - **Cambios:** arréglalos por escena, haz el render con `--forzar` y vuelve a preguntar.
   - **Todavía no:** anota `gateB` y no publiques.
6. **Al cerrar,** actualiza `content/<pieza>/estado.md` con la fase, el paso siguiente y las decisiones de Jeremy con sus palabras.
