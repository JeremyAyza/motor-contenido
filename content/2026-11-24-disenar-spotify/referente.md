# Referente: "Let's design Spotify"

- **Archivo:** `C:\Users\Jeremy\Downloads\reel (4).mp4` (Jeremy lo pasó descargado; no hay URL). Por el personaje y el aspecto, es de @rick.theengineer.
- **Duración:** 173,6 s (2:53). 720×1280, 30 fps. Voz en inglés con subtítulos en inglés.
- **Formato:** diseño de sistemas explicado por partes, con un contador de pasos arriba a la derecha ("01 / 74") y un stepper de 6 etapas que se va llenando.
- **Análisis:** hecho en el chat principal con ffmpeg (un cuadro cada 3 s) y whisper (transcripción); el subagente `analista-referente` lee Reels de Instagram por URL y aquí no había URL.

## Aspecto

- **Fondo:** casi negro con un brillo verde muy suave arriba al centro. Sin textura.
- **Acento:** verde Spotify (#1ED760 aprox.) para barras, nodos, puntos del stepper y el logo. El resto es gris y blanco.
- **Zonas (de arriba a abajo):**
  - fila superior: kicker de sección en mono chico a la izquierda ("STORAGE", "PLAYBACK", "DELIVERY", "INSTANT", "SEARCH", "RECOMMENDATIONS", "PIPELINES", "SCALE", "YOUR STATE", "THE WHOLE THING", "THE HARD PART") y el contador "NN / 74" a la derecha;
  - stepper horizontal de 6 puntos con etiquetas mono diminutas (storage, cdn, search, recs, pipeline, ok); se encienden en verde al avanzar;
  - escenario arriba a la derecha (ocupa el 60 % del ancho): el objeto del momento (grilla de portadas, barras de bitrate, bases de datos, línea de nodos, tarjeta de back end, laptop y celular);
  - presentador de cuerpo entero a la izquierda, a media altura, fijo todo el video;
  - título en mayúsculas, condensado y en negrita, blanco, a la derecha del presentador o debajo del escenario ("A SONG IS UPLOADED", "BOTTLENECK", "THE BUFFER PROTECTS YOU"). Tamaño mediano; en los cambios de sección es grande y a la izquierda ("ANOTHER PROBLEM", "RECOMMENDATIONS", "CACHING AND CDNs");
  - subtítulos en una píldora gris oscura, abajo al centro, palabra activa en blanco y el resto en gris.
- **Densidad:** baja. Un objeto por vez, mucho negro alrededor. Etiquetas mono diminutas debajo de cada objeto ("OBJECT STORAGE", "MEDIA DELIVERY", "WHAT THE INDEX HOLDS").
- **Materiales:** líneas finas grises, tarjetas con borde de 1 px y esquinas apenas redondeadas, sin sombras.
- **Imágenes:** portadas de álbumes reales (grilla de 4×6) y fotos de artistas. El logo de Spotify al inicio y al final.

## Estructura escena por escena

Tiempos del referente. La voz, parafraseada.

| # | Tiempo | Sección | Lo que dice | Lo que se ve |
|---|---|---|---|---|
| 1 | 0–11 s | Gancho | Vamos a diseñar Spotify. Para el usuario es simple: abre la app, busca una canción, toca play y suena. Detrás de ese toque, Spotify resuelve varios problemas muy distintos a escala enorme. | Logo de Spotify grande + "LET'S DESIGN"; buscador con portadas; tarjeta del tema sonando; "DIFFERENT PROBLEMS AT MASSIVE SCALE". |
| 2 | 11–31 s | Storage | Primero, guardar la música. Millones de canciones, cada una en varios formatos y calidades. Al subir una canción no se guarda un archivo: se codifica en varias versiones (bitrate bajo para datos móviles, alto para premium, distintos códecs para distintos aparatos) y todo va a un almacenamiento distribuido. | Grilla de portadas; una portada se separa; "A SONG IS UPLOADED" con la barra del master; barras de bitrate 320/160/96/24; íconos de aparatos con OGG VORBIS y HE-AAC v2; tres cilindros "OBJECT STORAGE". |
| 3 | 31–60 s | Playback y delivery | Al tocar play, el back end primero pregunta: quién eres, si tienes premium, qué canción pediste, si se puede escuchar en tu país, dónde quedaste. Pero el back end no debería transmitir cada audio: sería un cuello de botella enorme. El back end decide, y el audio llega desde servidores cerca de ti, por un CDN. El plano de control y el camino del audio van separados. | Tarjeta "BACK END" con preguntas que se suman; barra verde que choca con una X ("NOT EVERY", "BOTTLENECK"); línea de nodos de "ORIGIN" a "YOU"; dos carriles "DECISIONS" y "MEDIA DELIVERY" ("TWO SEPARATE PATHS"), el de abajo se vuelve onda de audio. |
| 4 | 60–84 s | Instant | Otro problema: la música tiene que empezar al instante. Nadie quiere esperar 5 segundos. El cliente descarga audio por adelantado: mientras oyes el segundo 10, ya bajó el 20 o el 30. El buffer protege la reproducción: si la conexión falla un momento, baja a un bitrate menor y la música sigue. | "ANOTHER PROBLEM" grande; barra de reproducción con "SECOND 10 / ALREADY FETCHED: 30"; "THE BUFFER PROTECTS YOU"; señal de conexión; barras de bitrate con flecha en la más baja; "IT KEEPS PLAYING". |
| 5 | 84–96 s | Search | Al buscar "Blinding Lights", no se puede recorrer millones de canciones en una base de datos normal cada vez. Hace falta un índice de búsqueda: nombres, artistas, álbumes y palabras clave, ordenados para buscar rápido. | Tarjeta de búsqueda con la portada; grilla tachada "SCANNING EVERY ROW"; caja "WHAT THE INDEX HOLDS" con 4 filas. |
| 6 | 96–120 s | Recs y pipelines | Después, las recomendaciones: qué escucha este usuario después, qué va en Discover Weekly, qué suena al terminar. Es otro sistema: usa historial, saltos, likes, playlists y usuarios parecidos. Casi todo se calcula antes, en lote, porque hacerlo cada vez que abres la app sería carísimo. | "RECOMMENDATIONS" grande; "now playing" → "?"; "WHAT SHOULD PLAY NEXT?"; Discover Weekly; ruta de audio con "RECOMMENDER" colgando ("A COMPLETELY DIFFERENT SYSTEM"); señales HISTORY/SKIPS/LIKES; usuarios unidos a portadas ("SIMILAR USERS"); "BATCH JOB · OVERNIGHT, NOT ON TAP"; "ON EVERY OPEN" tachado vs "ONCE, IN BATCH". |
| 7 | 120–134 s | Scale | Un álbum grande sale a medianoche: millones piden las mismas canciones a la vez. Caso perfecto para caché y CDN: las canciones populares se copian cerca de los usuarios y no salen todas del almacenamiento central. | Reloj 00:00 + portada; muñequitos y contador "3,386,697 AT THE SAME MOMENT"; "CACHING AND CDNs"; línea de nodos "ONE COPY PER REGION"; el origen tachado "NOT FROM CENTRAL STORAGE". |
| 8 | 134–149 s | Your state | Por último, tu estado en todos los aparatos: pausas en la laptop, abres el celular y ya sabe qué escuchabas y dónde quedaste. Bases de datos distribuidas y rápidas para el estado de reproducción, playlists, likes e historial. | Laptop y celular; pausa "PAUSED AT 1:42"; el celular se enciende ("IT ALREADY KNOWS"); tres cilindros con íconos ("FAST DISTRIBUTED DATABASES"); etiquetas PLAYBACK STATE/PLAYLISTS/LIKES. |
| 9 | 149–163 s | The whole thing | Simplificado, Spotify son varios sistemas juntos: almacenamiento de objetos para el audio, CDN para entregarlo, índice para buscar, recomendador, bases de datos para cuenta y playlists, y pipelines que procesan montañas de datos de escucha. | Mapa de cajas que se encienden una por una (OBJECT STORAGE, CDN, SEARCH INDEX, RECOMMENDER, DATABASES, BACKGROUND PIPELINES). El stepper llega a "ok". |
| 10 | 163–173 s | The hard part | Lo difícil de Spotify no es reproducir un MP3: es que millones sientan que todas las canciones del mundo están en su celular, listas para sonar al instante. | Ícono "MP3" ("IT ISN'T PLAYING A FILE"); grilla de muñequitos ("MILLIONS OF PEOPLE"); logo de Spotify + "READY TO PLAY". |

No hay CTA hablado: termina en la frase del cierre.

## Ritmo

- Un cambio en pantalla cada 2 a 3 s (74 pasos en 173 s), casi siempre sobre el mismo escenario: se suma, se tacha o se enciende algo.
- Los cambios de sección se marcan con el kicker, el stepper y, a veces, un título grande a la izquierda.

## Cuadros del aspecto

12 segundos para `video:comparar`: 0, 12, 21, 36, 45, 54, 69, 87, 99, 126, 135, 168.

Los cuadros del referente salen del MP4 local con ffmpeg, no del reproductor incrustado.
