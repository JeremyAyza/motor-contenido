# Estado: 2026-10-27-robo-de-sesion

## Dónde quedó

- **Fase C (crítica) terminada el 27 de octubre de 2026.**
  - El crítico ciego dio 3,90: Legibilidad sacó 3 y todo lo demás 4.
  - Se arreglaron sus tres problemas principales; el detalle está en `video-critica.md`.
  - `out/video.mp4` se volvió a renderizar: 75,4 s, el inspector no encontró problemas y el sha256 es `409995ed0c7d1e2b78da65506502c019aae5aea88eded35e0139c3ad69bcc62c`.
- **Puerta B aprobada el 27 de octubre de 2026.** Jeremy escribió en el chat "Sí, apruebo" sobre el video con sha256 `409995ed…c62c` (`video.json → gateB`).
- **Paso siguiente: publicar, solo cuando Jeremy lo pida.** Antes hacen falta créditos de ElevenLabs para tener licencia comercial (docs/direccion-reels.md, 3).
- El arreglo del motor para los paneos está en la rama `claude/stage-move-clip` (commit `ff87bb1`) y no está integrado aquí. Si se integra y se vuelve a renderizar, cambia el sha256 y la puerta B se pide de nuevo.

## Fase C

- El crítico juzgó sin audio y sin brief (la pieza no tiene `brief`), así que la coincidencia de la tesis la confirma Jeremy.
- Se hizo una sola ronda: ningún punto bajó de 3.
- Lo que no se tocó:
  - **El motor:**
    - el contenido pasa sobre la cabecera en los paneos (lo arregla otra sesión);
    - el contraste de las palabras del subtítulo que todavía no se dicen;
    - el tamaño de la cabecera.
  - **Lo que obliga a volver a la puerta A:** quitar la cita de Google y el cuadro fijo del final.

## Fase B

- La voz es de ElevenLabs con la voz F: 73,8 s, sin pausas. La primera clave se quedó sin créditos y se usó la de respaldo. El plan gratuito no da licencia comercial: para publicar hacen falta créditos (docs/direccion-reels.md, 3).
- La música es `audio/cama.mp3` (Lyria, registrada en `generated.json`), al volumen por defecto de 0,06.
- Para llegar a 75 s se sumaron pausas sin voz: `hold` de 1 s después de "Sin código" en la prueba y de 0,6 s en el cierre. `hold` entra en `timeline.json` con `video:prepare`, no con el render.
- Lo que el crítico puede marcar: en los paneos entre secciones, el contenido pasa unos 0,4 s por encima de la pestaña y la firma, como en el Reel de MCP. Viene del motor (ver "Para el motor"). También la cookie tachada de "ya no sirve" en la escena de ayuda.

## El encargo

- Jeremy pidió copiar la estructura del Reel de @rick.theengineer sobre el robo de sesión (https://www.instagram.com/p/DbuZQU8MlaL/) con la marca de la cuenta. El tema sale del referente.
- El desglose está en `referente.md`: dura 74,7 s, hay 28 escenas y el hilo es un diagrama de dos cajas (navegador y sitio) donde cambia lo que viaja. La pulsera dura solo 8 s. El referente no tiene CTA en el video.

## Decisiones de esta fase

- **Duración:** `target` 75 y formato `explicado`, porque dura lo que el referente (docs/direccion-reels.md, 2). La primera versión estimaba 90 s: se recortó la voz, sin `hold`.
- **Gancho:** "Tu 2FA no protege tu cookie." (fórmula 22, hookscore 81). "Así entran a tu cuenta sin pasar por tu 2FA" tardaba 4,3 s, y "Así se saltan tu 2FA con una cookie" bajaba a 52.
- **Lo que es nuestro y no del referente:** el atacante entra en la escena 4 (en el de Rick, a los 26 s); se suma la cifra de Microsoft (10.000+ organizaciones, 2022), la cita de Google ("después del login", abril de 2024) y un consejo para quien programa (invalidar la sesión en el servidor al cerrar sesión). El cierre pide guardar.
- **Dirección de arte:** `antes-despues` (la entrada contra lo de después), ciruela casi negro y dorado galleta. Las tres piezas anteriores eran azul oscuro.
- **Sin avatar.** Jeremy lo decidió después de ver el storyboard: "entonces deja fuera el avatar y continuemos".
- **Puerta A aprobada** el 27 de octubre de 2026 con ese "continuemos", sin el recorte de la lista que sugería Gemini.

## Lo que se probó y no funcionó

- El caso de Linus Tech Tips (marzo de 2023) quedó sin fuente primaria (`facts.json → pendingToVerify`), así que no entra.

## Avisos que quedan en la hoja, y por qué se defienden

- "La primera frase no tiene nada que se pueda comprobar": el detector no reconoce "2FA" ni "cookie" como términos técnicos.
- Frases de más de 4 s (robo, 5,9 s): mientras se dicen, en pantalla entran el malware, la página falsa y la cookie que viaja.
- "3 frases seguidas sin nada concreto" en la prueba y el cierre: la prueba muestra DevTools y la cookie; el cierre es la frase para recordar.
- "Uniform sentence length": pendiente de que Jeremy lea el guion.
- Falta el orden ciego de los ganchos (`out/video-critica-ganchos/`): no se corrió.

## Para el motor

- Con `stage`, el mundo se dibuja por encima de la pestaña, la barra de capítulos y la firma mientras la cámara viaja entre secciones. El crítico lo marcó en `2026-10-27-mcp-vs-acp` y aquí se repite. Se arregla en su propia sesión, no a mitad de esta pieza.
