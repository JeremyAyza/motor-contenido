# Estado: 2026-11-03-amazon-ia-cliente

Réplica para @jacket.dev del Reel de @sebastiankra.ia (https://www.instagram.com/p/DfQUYXjiNhG/), de 65,7 s.

## Fase

**Lista, con la puerta B aprobada** el 2026-11-03 ("Sí, apruebo"). Está anotada en `video.json → gateB` con el sha256 `7f9b1b2048b7a8ce6d911c147c7665ac929207ceae41d8dac97f5565fad01e6c` (`out/video.mp4`, 65,0 s).

## Paso siguiente

1. Publicar solo si Jeremy lo pide (`npm run video:publicar -- content/2026-11-03-amazon-ia-cliente`, primero con `--ensayo`). Un render nuevo cambia el sha256 y devuelve la puerta B a `false`.
2. Si no publica: `npm run video:cosechar -- content/2026-11-03-amazon-ia-cliente` para proponer escenas a la biblioteca.
3. A las 48 horas y a los 7 días de publicar, transcribir los Insights en `video-metrics.json` y correr `npm run video:metrics`.
4. Revocar la clave de ElevenLabs que se pegó en el chat cuando ya no haga falta.

## Decisiones de Jeremy

- **Encargo (2026-11-03):** "copia la estructura, el ritmo y la duración del original, con la marca de la cuenta. Muéstrame los ganchos y el guion antes de generar la voz, y el video terminado antes de darlo por listo."
- **Puerta A (2026-11-03):** "Sí, apruebo". La escena de líderes se queda, aunque el crítico del guion sugería quitarla.
- Pidió hacer todo en este chat, la parte creativa y la producción.
- **Puerta B (2026-11-03):** "Sí, apruebo", sobre el render final. No pidió el arreglo 1 del crítico.

## Decisiones de esta pieza

- **Estructura copiada del referente** (`referente.md`): gancho, quién lo dijo, 3 puntos numerados, "la clave", dos remates, cierre y CTA. La nota de Amazon no trae una lista numerada (`facts.json`).
- **Cambios frente al referente, por las reglas del repo:**
  - Las citas de Karpathy y Ng no tienen fuente. Se reemplazaron por dos ideas de la nota: el resultado importa más que la herramienta, y los líderes tienen que probar la IA ellos mismos.
  - El CTA "comenta IA" se cambió por uno de enviar, porque la regla 12 no permite automatizar DMs.
  - No se pone nada encima del logo de Amazon.
- **Dirección de arte:** collage, con fondo lima `#D7F24E`, acento `#2B3AE8` y Bricolage. El mundo es un camino del escritorio a la puerta del cliente, y el medidor "Cerca del cliente" es una barra.
- **Logo de Amazon:** se tomó de Wikimedia Commons y está en `assets/catalog.json` (id `amazon`).
- **Voz:** ElevenLabs con la clave nueva de `.env` (2026-11-03). Generar el guion gastó unos 1.100 caracteres de 10.000. La clave se pegó en el chat, así que conviene revocarla después.

## Crítica

- **Guion (Gemini):** 4,88 de 5.
- **Video (ciego, ronda 1):** 3,30 de 5, sin error grave y sin puntos bajo 3, así que no hay segunda ronda. Se aplicaron sus arreglos 2 y 3, que no cambian la voz:
  - un sticker legible con el cargo ("VP de Amazon");
  - dibujos en los rótulos de "la clave";
  - el sello ya no tapa el contador;
  - menos vacío arriba en 0:00 y 0:12.
- **Sin aplicar:** el arreglo 1, alinear la tesis con el cierre y meter en la voz "lo difícil ya no es escribir el código, es saber para quién lo escribes", porque cambia la voz. Tampoco los subtítulos más grandes, porque el marco es fijo de la cuenta.

## Avisos del render final, defendidos

- **7 palabras en 45,0 s:** "herramienta" ya está tachada, así que se leen 6 palabras vivas.
- **Dura 65,0 s, fuera del formato corto:** es una réplica de 65,7 s y queda a 1 % del `target`.

## Lo que no funcionó

- **Clases de Tailwind arbitrarias:** las que solo usa esta pieza (`text-[52px]`, `w-[440px]`, `bg-[#E5352B]`) no se generan, y fallan sin avisar. Se pasaron a `style`. Así faltaron un render el tachado de "herramienta" y el fondo rojo de "≠ frugalidad".
- **Cuatro renders completos** (el tope es dos):
  - el segundo tenía un error de margen;
  - el tercero tenía el rojo faltante;
  - el cuarto es el final.

## Pendiente para el motor (no se toca a mitad de pieza)

- `FORMAT_SECONDS` deja un hueco de 60 a 75 s: una réplica de 65,7 s no entra en ningún formato.
- `video:script` no avisó del parecido con `2026-11-02-tokenmaxxing` (Amazon y tokenmaxxing, un día antes).
- Tailwind no genera las clases arbitrarias nuevas de `content/<pieza>/scenes/`, y ni `video:check` ni el inspector lo detectan.

## Anclaje

- Cambios al guion visual después de emparejar: 0.
- Parte del tiempo en pantalla que sale de la biblioteca: 0 % (biblioteca vacía).
- Parecido con las últimas 3 piezas: el estilo collage sobre lima con un camino es nuevo. El tema se cruza con `2026-11-02-tokenmaxxing`.
