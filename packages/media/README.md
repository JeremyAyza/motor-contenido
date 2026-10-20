# packages/media

Voz, imágenes, música, alineación de palabras y recursos de terceros para los videos. El código va en inglés y no importa de otros paquetes. El plan está en [docs/plan-videos.md](../../docs/plan-videos.md).

## Puertos y adaptadores

| Puerto | Qué hace | Adaptadores |
|---|---|---|
| `SpeechProvider` | Texto a voz, con tiempos por palabra si el proveedor los da | `gemini` (`gemini-3.8-flash-tts`) |
| `ImageProvider` | Un prompt y referencias a una imagen | `gemini` (`gemini-nano-banana-2.1`, solo JPEG) |
| `MusicProvider` | Una descripción a una pista | `gemini` (`lyria-3-clip-preview`, 30 s en MP3) |
| `Aligner` | Cuándo se dice cada palabra de un texto conocido | `whisperAligner` (whisper.cpp local, modelo `small`) |
| `SoundSearch` | Efectos CC0 en bibliotecas libres | `openverse` (sin clave) y `freesound` (`FREESOUND_API_KEY`) |

Todos los adaptadores de Gemini usan la API de Interactions de `@google/genai`, y lo que generan lleva la marca SynthID.

**Cambiar de proveedor** no toca el flujo:
1. Escribe su adaptador en `src/providers/`.
2. Regístralo en `SPEECH_PROVIDERS`, `IMAGE_PROVIDERS`, `MUSIC_PROVIDERS` o `SOUND_SEARCHES` (en `src/index.ts`).
3. Pon su id en la configuración: la voz en `accounts/dev.json → voice`, y la imagen, la música y las bibliotecas en `media.config.json`.

Los tests de `test/providers.test.ts` lo comprueban con proveedores falsos.

## Lo que guarda

En `.cache/`, que git ignora:
- `.cache/media/speech/`: cada voz generada, con un JSON que dice proveedor, modelo, voz, estilo, texto y fecha. Una voz no se vuelve a pagar si el texto no cambió.
- `.cache/whisper/`: whisper.cpp 1.5.5 y su modelo. En Windows se baja un binario.
- `.cache/assets/`: los recursos de `assets/catalog.json`.

En la pieza: `generated.json` registra cada imagen y cada música generada (`recordGenerated`), con el proveedor, el modelo, el prompt, las referencias, el sha256 y la fecha.

## Recorte con chroma

Los modelos de imagen no hacen PNG transparentes. `CHROMA_PROMPT` pide fondo verde liso y `toPng({ chroma: true })` lo quita con el filtro `colorkey` de ffmpeg. No usa despill, porque le saca el verde también a los amarillos.

## Catálogo de recursos

[assets/catalog.json](../../assets/catalog.json) es la lista de archivos de terceros (efectos, música, animaciones). Cada uno lleva:
- su URL y la página de la licencia;
- el autor y la licencia;
- la fecha en que se revisó la licencia en esa página (`checkedAt`);
- el sha256 del archivo.

El catálogo se versiona y los archivos no: el repo es público y varias licencias no permiten distribuirlos sueltos.
- `fetchAsset` los baja a la caché y avisa si cambiaron.
- `assertUsable` no deja usar un recurso sin `checkedAt` o sin `sha256`.
- `searchCatalog` busca por id, etiquetas y notas.
- `downloadHit` convierte un resultado de una biblioteca en una entrada nueva, con su hash.

## Claves

En `.env` (ver `.env.example`): `GEMINI_API_KEY` y, opcional, `FREESOUND_API_KEY`. Nunca van en el código ni en el chat.
