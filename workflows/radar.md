# Flujo: radar de temas

Decide qué carruseles se hacen antes de hacerlos. Adapta [`ig-plan`](../.agents/skills/ig-plan/SKILL.md) (plan semanal) e [`ig-viral`](../.agents/skills/ig-viral/SKILL.md) (archivo de referencias) a este repo; lee esas skills para el criterio completo y [skills/ig-es](../skills/ig-es/SKILL.md) para lo que cambia aquí.

## Una vez por semana: el radar

1. **Lee primero** [docs/aprendizajes.md](../docs/aprendizajes.md) (lo que ya funcionó), [docs/swipe.md](../docs/swipe.md) (lo que funciona en cuentas de referencia) y las piezas de las últimas dos semanas en `content/`, para no repetir tema ni formato.
2. **Propón de 5 a 8 temas.** Para cada uno:
   - **formato** (tabla de abajo);
   - **ángulo** en una frase: no "Gemini 4", sino lo que esta cuenta tiene que decir de Gemini 4;
   - **por qué ahora** y **ventana**: si caduca en días o sirve siempre;
   - **saturación**: si las cuentas de referencia ya lo publicaron, con el enlace. Si ya lo hicieron, el ángulo distinto es obligatorio;
   - **encaje** con la cuenta y su público.
3. **Jeremy elige de 2 a 4** (puerta 0). Cada tema elegido arranca con `npm run carrusel:nuevo` y el paso 0 de [workflows/carrusel.md](carrusel.md).

Guarda el radar en `docs/radar/AAAA-MM-DD.md`.

### Mezcla de formatos para la cuenta dev

Sin repetir formato dos veces seguidas:

| Formato | Para qué sirve | Frecuencia sugerida |
|---|---|---|
| Noticia con ángulo | Lo nuevo, contado desde qué cambia para ti | 1 a 2 por semana como máximo |
| Enseñar (cómo hacer X) | Guardados | 1 por semana |
| Comparativa | X contra Y con datos oficiales y de [referentes](../docs/referentes.md) | 1 cada 1 o 2 semanas |
| Error común o mito | Compartidos y comentarios | 1 cada 2 semanas |
| Opinión | Debate y voz propia (posturas de [docs/voz.md](../docs/voz.md)) | 1 cada 2 semanas |
| Herramienta o recurso | Guardados | Ocasional |

`ig-plan` habla de Reels y de una mezcla en inglés (proof, teach, opinion...): aquí manda esta tabla hasta que exista el flujo de video.

## Una vez al mes: el archivo de referencias (swipe)

1. **Elige de 8 a 12 cuentas**, con aprobación de Jeremy:
   - 4 del mismo nicho y un poco más grandes;
   - 4 de nichos vecinos con el mismo público (de ahí salen los formatos antes de que lleguen al nicho);
   - 2 a 4 grandes, solo para mirar formatos.

   Punto de partida: midu.dev, rick.theengineer, peterstewiestartup, bittabyte, sanmunoz.ia, saas_in_house, sebastiankra.ia y soyenriquerocha.
2. **Mira con el navegador de Jeremy, a ritmo humano.** Nunca inicies sesión por él, nunca pidas su contraseña, nunca hagas scraping ni un bucle automático: eso viola los términos de Instagram y bloquea cuentas.
3. **Anota cada carrusel** en `docs/swipe/AAAA-MM.tsv` (copia [docs/swipe/plantilla.tsv](../docs/swipe/plantilla.tsv)):

   | Columna | Qué va |
   |---|---|
   | cuenta | @usuario |
   | seguidores | del perfil |
   | mediana | mediana de me gusta de sus últimos 12 posts (a ojo: el del medio) |
   | megusta | me gusta de este carrusel |
   | portada | el texto literal de la portada, con sus errores |

   Los carruseles no muestran vistas públicas: los me gusta son un indicador débil, y se dice así en el informe.
4. **Corre** `npm run carrusel:swipe -- docs/swipe/AAAA-MM.tsv`. Ordena por múltiplo sobre la mediana (más de 3x es señal; menos de 1.5x es un día normal), nombra la fórmula de cada portada con [ganchos-es.json](../skills/ig-es/ganchos-es.json) y escribe [docs/swipe.md](../docs/swipe.md).
5. **Di solo tres cosas:** qué fórmulas se repiten arriba (con cuántas veces), qué tienen en común las de arriba que no tengan las de abajo, y qué portadas no se pudieron clasificar (léelas a mano: ahí está la fórmula que todavía no tienes). Di también el tamaño de la muestra: 12 carruseles no prueban nada; 40 de 6 cuentas ya muestran algo.

Copia la fórmula, nunca el carrusel: ni su texto, ni su diseño, ni su voz.
