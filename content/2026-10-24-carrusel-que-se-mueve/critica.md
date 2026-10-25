# Crítica ciega: carrusel-que-se-mueve

Tres rondas, cada una con un contexto nuevo que solo vio `out/critica/` (workflows/carrusel.md, paso 12).

| Ronda | Promedio ponderado | Tesis entendida | Punto más bajo |
|---|---|---|---|
| 1 | 4.15 | Sí | 4 (varios) |
| 2 | 4.40 | Sí | 4 (varios) |
| 3 | 4.45 | Sí | 4 (varios) |

Ninguna ronda bajó de 4 en ningún punto. La tercera quedó a 0.05 del 4.5 de la puerta B. El flujo permite tres rondas, así que los arreglos de la tercera se aplicaron sin una cuarta crítica (detalle al final).

## Cambios por ronda

- **Después de la ronda 1:**
  - La skill que llega por DM aparece en las láminas 6 y 7.
  - La lámina de Remotion ya no contradice la advertencia de seguridad.
  - La receta (lámina 9) va de arriba abajo y cada capa tiene su pieza concreta.
  - Se explicó la fila naranja de la lámina 4 y se usó la pestaña `slide.html`.
- **Después de la ronda 2:**
  - La tira de la portada subió al tercio del medio, con la prueba "Esta portada son 95 fotos.".
  - La lámina de Remotion se centró en una idea (qué pasos hace) y quedó sin el comando de instalación.
  - La receta nombra Playwright y la línea de ffmpeg.
  - El cierre muestra "La portada se grabó así: 95 fotos.".

## Informe final (ronda 3)


Paso 1 (en frío)
- De qué trata: cómo se hace un carrusel animado con Claude. Claude no genera video: escribe la lámina como HTML y CSS, un navegador sin ventana (Playwright o Puppeteer) la pausa y le saca una foto por cuadro, 30 por segundo, y ffmpeg une las fotos en un MP4. En el medio hay un desvío: la "skill" que pasan por DM es una carpeta con un SKILL.md, instalar una ajena es riesgoso según la propia documentación, y Remotion hace el grabador por ti con React.
- Tesis en una frase: Claude no anima, escribe código que un navegador graba foto por foto, así que la skill para hacerlo es una carpeta que puedes escribir tú en vez de instalar la de un desconocido.
- Qué haría: deslizar hasta el final y guardar (por la lámina 9).
- A quién se lo mandaría: al amigo dev o creador que anda pidiendo skills de carruseles por DM; le mandaría la lámina 7 para que lea la skill antes de instalarla, y la 9 si quiere armar la suya.

Paso 2 (con el brief)
- ¿Coincide la tesis? Sí. Mi resumen tiene las dos mitades del brief: Claude escribe la lámina como código y un navegador más ffmpeg la graban, y la skill que regalan es un SKILL.md que puedes escribir tú porque una ajena puede correr código. También coincide el objetivo (guardar) y el destinatario (el amigo que comentó para que le pasen la skill).

| Punto | Peso | Puntaje | Por qué |
|---|---|---|---|
| Gancho | 15% | 4 | "¿Claude anima carruseles? No: escribe HTML" detiene a quien vio esos carruseles y la lámina 2 se entiende sola; pero la línea más intrigante, "Esta portada son 95 fotos.", queda chica abajo, a unos 250 px de la tira que describe, y en pulgar.png es lo único que casi no se lee. |
| Tesis | 15% | 5 | Coincide con el brief en sus dos mitades y no es un comunicado: desarma un truco y suma una advertencia con fuente. |
| Valor | 15% | 4 | Se lleva código real, el flag que muerde (-framerate, 25 por defecto) y la licencia de Remotion; pero la lámina 6 gasta sus anotaciones en tokens en vez de en qué va en tu propio SKILL.md, que es justo lo que pide el CTA, y nada avisa qué tipo de animación captura el truco. |
| Compartible | 10% | 5 | La lámina 7 ("¿Una skill por DM? Léela antes de instalarla", con la captura subrayada y traducida a mano) se manda sola al amigo que comentó para pedir la skill. |
| Cierre y CTA | 10% | 5 | Cierra el lazo de la portada ("La portada se grabó así: 95 fotos.") y pide una sola acción del tema: guardar la lámina 9 para armar tu propia skill. |
| Voz | 5% | 4 | Directa, con tú y sin muletillas de IA; algunas frases quedan telegráficas ("A 25 por segundo, 6 s duran 7,2.") y las notas filtran nombres internos (irA, movimiento.ts). Juzgado sin ver voz.md, que no está en la carpeta. |
| Legibilidad en el celular | 10% | 4 | Títulos, cuerpo y código se leen en revision.png; cuestan el párrafo en inglés de la captura de la lámina 7 (lo salvan las anotaciones en español) y las notas grises sobre fondo oscuro de las láminas 3, 4, 5 y 9. |
| Ancla y dirección | 10% | 5 | En pulgar.png el asterisco y la tira de película dicen "Claude + video" sin leer; la pestaña slide.html, la grilla de puntos, la paleta terracota y la tira que vuelve en 1, 9 y 10 atan todo el carrusel. |
| Progresión y recurso visual | 10% | 4 | Cada lámina explica con su recurso (comparación, flujo, 180 barras, código anotado, captura, corchete, receta), pero el orden zigzaguea: 2 a 5 graban, 6 y 7 saltan a skills sin puente y la 8 vuelve al grabador; además en la 5 compiten dos bloques de código con dos anotaciones naranjas. |

Promedio ponderado: 4.45

Umbral: todos los puntos están en 4 o más, pero el promedio queda 0.05 debajo del 4.5 que pide la puerta B. No llega todavía.

Tres arreglos, en orden de impacto:
1. Lámina 6, que la carpeta sea la plantilla del lector (Valor, 15%). Hoy muestra la carpeta del autor y cuánto cuesta en tokens, mientras la tesis y el CTA dicen "escríbela tú". Cambia la anotación "El resto, solo al usarla: menos de 5.000 tokens" (o la de "12 direcciones de arte") por dos o tres reglas que el lector copiaría en su SKILL.md para este flujo, por ejemplo "anima solo con CSS (@keyframes): así el navegador la puede pausar" y "30 cuadros por segundo". De paso cubre lo que falta en la 5 y la 9: el truco de getAnimations() pausa animaciones CSS o Web Animations, no lo que mueve JavaScript por su cuenta (confírmalo en la fuente antes de publicarlo). Repite esa regla en la fila "Claude escribe la lámina" de la 9.
2. Portada, que el "95 fotos" se vea (Gancho, 15%). Sube "Esta portada son 95 fotos." y pégala a la tira, con al menos el tamaño de "Lo que parece / Lo que pasa" de la lámina 2, o conviértela en un contador sobre la tira que suba de 1 a 95 mientras aparecen los cuadros. Así lo que se mueve y el número se leen como una sola cosa, y en la miniatura se entiende. El título queda igual.
3. Orden, sin zigzag (Progresión, 10%). Mueve la lámina 8 (Remotion) justo después de la 5, para que 3, 4, 5 y Remotion sean un solo bloque "cómo se graba", y dale a la lámina de la carpeta un puente desde la grabación, por ejemplo un antetítulo "Para que Claude lo haga siempre igual:" sobre "La skill que te pasan por DM es una carpeta". Orden resultante: 1, 2, 3, 4, 5, 8, 6, 7, 9, 10. La receta sigue en la posición 9, así que el CTA no cambia, y la lámina naranja corta la seguidilla de tres fondos oscuros.

Notas menores (no mueven el puntaje por sí solas):
- Lámina 8: "stitchFramesToVideo()" termina a unos 20 px del borde derecho, contra los 72 px de margen del resto. Bájale el tamaño o pártelo en dos líneas.
- Lámina 5: el título promete un truco (pausar) y la lámina tiene dos. Deja la anotación de ffmpeg en un tono más apagado para que "t = cuadro × 1000 / 30" sea lo primero que se ve, y di la consecuencia en vez de la cuenta: "sin esa línea, tus 6 s se estiran a 7,2 y todo va más lento". La nota "t sale de irA(page, (f * 1000) / FPS)" es código interno que el lector no necesita.
- Lámina 9: "180 fotos" sin "por 6 s" no se entiende si alguien la recibe sola, y usa `f` donde la 5 decía "cuadro".

## Aplicado después de la ronda 3 (sin cuarta crítica)

1. **Valor:** la lámina de la carpeta trae una regla para copiar en tu SKILL.md: "Tus reglas: anima con CSS, que se puede pausar". La capa de Claude en la receta dice "anima solo con CSS". MDN lo respalda: `getAnimations()` incluye animaciones y transiciones CSS.
2. **Gancho:** "Esta portada son 95 fotos." va pegada debajo de la tira, en 28 px y en negrita. Se contaron 95 cuadros en `out/01.mp4` con ffprobe.
3. **Progresión:** Remotion pasó a la lámina 6, justo después del truco. El orden queda: portada, comparación, recorrido, 180 fotos, el truco, Remotion, la carpeta, la advertencia, la receta y el cierre. La receta sigue en la lámina 9, así que el CTA no cambia. No se agregó antetítulo, porque `docs/anti-slop.md` prohíbe la etiqueta pequeña sobre el título.
4. **Menores:**
   - En Remotion, la columna de la derecha ya respeta el margen.
   - En la lámina 5, el cuerpo dice la consecuencia ("Sin `-framerate 30`, tus 6 s duran 7,2") y la nota quedó sin nombres internos.
   - En la receta, el navegador dice "180 fotos por 6 segundos" y muestra `a.currentTime = t; page.screenshot()` (código real del motor).
