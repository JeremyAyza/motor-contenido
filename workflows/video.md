# Flujo: video (en construcción)

Flujo separado del carrusel. Comparte solo la marca (`packages/brand`) y el avatar (`assets/avatar`).

## Diseño acordado

1. **Investigación:** igual que el carrusel; produce `facts.json`.
2. **Guion `video.json`:** 2 o 3 ganchos, escenas del catálogo (terminal, comparativa, flujo, medidor, código, frase), narración escrita para el oído y texto del post.
3. **Puerta humana:** la persona aprueba la ficha y el guion.
4. **Voz:** interfaz `VoiceProvider` con un adaptador por proveedor (ElevenLabs, Gemini, Cartesia, Qwen, Fish Audio). Devuelve el audio y, si el proveedor los da, los tiempos por palabra. Si no, whisper.cpp los calcula. Incluye diccionario de pronunciación y caché por texto y voz.
5. **Render:** Remotion, 1080×1920. La duración de cada escena sale de su narración; subtítulos tipo karaoke con la palabra clave en color de acento; avatar con sincronía de boca.
6. **Control automático:** duración, textos dentro del cuadro y hoja de revisión.

## Pendiente

- Prueba a ciegas de voces en español para elegir el proveedor.
- Diseño del avatar y sus sprites (ver `assets/avatar/README.md`).
- Catálogo de escenas animadas en Remotion.
