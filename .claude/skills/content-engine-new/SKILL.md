---
name: content-engine-new
description: Crea una pieza nueva para @jacket.dev desde una idea de Jeremy, de punta a punta en un solo chat. Un Reel por defecto; un carrusel si lo pide. Jeremy lo abre con /content-engine-new <idea> [indicaciones] al empezar un chat nuevo.
argument-hint: <idea> [indicaciones]
disable-model-invocation: true
---

# Una pieza desde cero

Lo que pidió Jeremy: **$ARGUMENTS**

Es un Reel, salvo que Jeremy diga "carrusel". Se hace con el flujo completo de siempre ([docs/reel.md](../../../docs/reel.md) o [docs/carrusel.md](../../../docs/carrusel.md)), con fuentes, crítica del guion y crítico ciego, pero Jeremy solo da dos toques: responde una ronda de preguntas y dice si se publica.

## Los pasos

1. **Lee [AGENTS.md](../../../AGENTS.md) y la página del flujo,** y nada más. Crea la carpeta de la pieza: `content/AAAA-MM-DD-<tema-en-kebab>/` con la fecha de hoy (en un carrusel, con `npm run carrusel:nuevo -- <tema>`).
2. **Análisis corto,** de pocos minutos: qué dice la idea, qué público y qué objetivo encaja (guardar, enviar o comentar), si se parece a una pieza de los últimos 14 días (`ls content/`) y, si el tema es de los últimos 12 meses, una o dos búsquedas para no proponer un ángulo viejo. Todavía no es la investigación: esa va en el paso 4.
3. **La ronda de preguntas (puerta A).** Una sola, de 2 a 4 preguntas, con la herramienta de preguntas si existe (`AskUserQuestion`); si no, en el chat, con opciones numeradas. Cada pregunta trae la opción recomendada primero y una línea de por qué. Se pregunta solo lo que cambia la pieza y Jeremy no dijo ya, por ejemplo:
   - el ángulo o la tesis, entre 2 o 3 propuestos;
   - el formato: `corto`, `largo` o, en un carrusel, cuántas láminas;
   - el CTA;
   - el avatar (por defecto, no).

   No se pregunta lo de "Decisiones vigentes" de docs/reel.md (estilo, voz, ritmo). Las preguntas y las opciones van en frases completas, aunque el chat esté en caveman. Sus respuestas van a `video.json → gateA { approved: true, date, notes }` (o `brief.json → puertaA`, con `notas`), con sus palabras.
4. **Producción completa,** según la página del flujo, sin pedir más aprobaciones: fuentes con `buscador-fuentes`, guion o brief, sus revisiones y críticas, diseño, render, crítico ciego y sus arreglos. Lo que no esté decidido lo decides tú y lo anotas en `estado.md`. Solo se le vuelve a preguntar a Jeremy si algo bloquea la pieza (por ejemplo, las fuentes desmienten el ángulo que eligió).
5. **Puerta B: "¿lo publico?".** Pásale la pieza (`out/video.mp4` y `out/video-hoja.png`, o `revision.png` en un carrusel; con `SendUserFile` si existe), el texto del post y, en una línea, lo que el crítico dejó sin arreglar. Pregúntale si se publica.
   - **Sí:** anota la puerta B (`gateB` con el sha256, o `post.json → puertaB`) y publica con `video:publicar` o `carrusel:publicar`. El login lo corres tú; usuario y contraseña los escribe Jeremy en la ventana de Chrome.
   - **Cambios:** arréglalos (en un Reel, por escena y con el render `--forzar`) y vuelve a preguntar.
   - **Todavía no:** anota la puerta B y no publiques.
6. **Al cerrar,** actualiza `content/<pieza>/estado.md` con la fase, el paso siguiente y las decisiones de Jeremy con sus palabras.
