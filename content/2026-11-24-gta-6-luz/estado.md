# Estado: 2026-11-24-gta-6-luz

Réplica para @jacket.dev del Reel de @rick.theengineer sobre cómo el motor de GTA llegó a la luz de GTA 6 (128,7 s). Jeremy pasó el video como archivo (`Downloads/reel (8).mp4`), no como URL: el análisis se hizo con whisper.cpp y cuadros de ffmpeg, sin el subagente `analista-referente` (ver `referente.md`). También adjuntó `reel (7).mp4`, que ya estaba replicado en `2026-11-24-agentes-aman-linux`.

## Decisiones de Jeremy (puerta A, 2026-11-24)

Pedido inicial: "Quiero copiar ese video con nuestro branding y avatar. Espero poder alcanzar el mismo arte visual sin complicarnos tanto. Espero no perder la claridad." Pidió un CTA que genere debate y comentarios, y ofreció su suscripción de Antigravity para las imágenes.

- **Video:** "Sí, el de GTA 6 (Recomendada)".
- **Aspecto:** "Híbrido con imágenes IA (Recomendada)": la ciudad de 1997 y la isométrica de 2001 en código; las escenas de luz con imágenes generadas con agy y la luz dibujada encima.
- **CTA:** "¿Luz o jugabilidad? (Recomendada)": "¿Qué pesa más en un juego: los gráficos o la jugabilidad? Comenta LUZ o JUEGO."
- **Lanzamiento:** "Sin fecha (Recomendada)": el guion habla de cómo está hecho GTA 6, no de si ya salió.

## Fase

**Terminado, esperando la puerta B ("¿lo publico?").** `out/video.mp4`, 123,3 s (`target` 129, dentro del ±10 %), sha256 `a3a0b8ea8dabcd44dfc4b2d1346064210f3236833be5134bb614952e885a8d0a`, sin errores del inspector. Ya se usaron los dos renders completos. Las pausas de 2013, trazado y prueba no alargaron el video: el `hold` entra en el timeline al correr `video:prepare`, y no se volvió a correr antes del render final.

Crítico ciego (`video-critica.md`): 3,75 de 5, sin error grave. Se arregló: las fuentes ("Según Digital Foundry", "Rockstar, mayo de 2025") pasaron de 13 px en mayúsculas a 18 px legibles, y la PS5 ya no queda quieta (acercamiento y un brillo que recorre la consola). No se arregló, a propósito: acortar el repaso de 1997 a 2013 y prometer la luz en el gancho (la réplica sigue la estructura y el gancho de Rick), y la isla repetida para GTA 5 y GTA V Enhanced (es la misma isla de Rick, con su rótulo en cada escena).

Avisos que quedan, defendidos:
- "7 palabras en 16 s": "1997 Grand Theft Auto" se lee como un solo rótulo de año, más el chip "Cámara fija".
- "203 px vacíos en 48,7 s": es el silencio del "¿Qué cambia ahora?", oscuro a propósito antes de "La luz".

## Paso siguiente

1. Puerta B: mostrarle a Jeremy el video, la hoja, el texto del post y lo que el crítico dejó sin arreglar, y preguntarle si se publica.
2. Con su sí: anotar `gateB { approved: true, date, video: "<sha256>" }` y correr `npm run video:publicar -- content/2026-11-24-gta-6-luz`. "Linux vs Windows" y "Agentes y Linux" siguen sin publicar: conviene separarlos unos días.

## Decisiones propias

- Cada escena tiene dos partes: el fondo (`<Escena>Back`, que dibuja `world.tsx` dentro del escenario) y lo de encima (`Visual`). Un fondo opaco en el `Visual` tapaba la pestaña, los puntos y el avatar; en el mundo queda debajo del marco, y el marco de la cuenta enmarca las fotos de Rick.
- La ciudad de 1997 y 2001 es un solo plano en CSS 3D (`map.tsx`): visto desde arriba es el mapa de baldosas, y rotado a isométrico los techos crecen a edificios. Sin perspectiva, y los bloques aparecen con `scale`, no con `opacity` (la opacidad aplana el 3D).
- 13 imágenes de agy (Gemini) con la suscripción de Jeremy, sin texto ni logos; los maniquíes y el auto se generaron sobre verde y se recortaron con PIL (`*-cut.png`). No se usó ninguna captura ni logo de Rockstar.
- El medidor cuenta 5 eras del motor (1997, 2001, 2008, 2013 y la luz de GTA 6), en lugar de un contador de años (el contador escribe "1.997").
- El rayo de luz termina en la cara del avatar ("llega a la piel de un personaje").
- `tempo` 1,38; pausas (`hold`) en 2013, trazado, prueba y cierre: ≈125 s, `target` 129.

## Anclaje

- El guion visual no cambió después de emparejar (0 cambios). Biblioteca: 0 % del tiempo en pantalla (vacía).
- No se parece a las últimas 3: mundo de fotos y mapa pastel, no consola verde.

## Pendiente para el motor

- `video:frames` no ve una imagen nueva de `img/` hasta correr otra vez `video:prepare` (el bundle copia la carpeta de la pieza al preparar).
- Un `Visual` con fondo opaco tapa la pestaña, los puntos y el avatar sin aviso del inspector.
- Sigue faltando un comando `video:referente <archivo>` para un referente en archivo (cuarta réplica analizada a mano).
