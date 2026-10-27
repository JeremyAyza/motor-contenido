# Informe del crítico ciego: sistemas de archivos

Material: las 13 tiras con `transcripcion.md` al lado, `hoja.png`, `grilla.png` y `texto-del-post.txt`. No pude oír el audio, así que la voz la juzgo por la transcripción. Para confirmar lo que vi en las tiras, saqué cuadros sueltos de `video.mp4` (0:02,4-0:05,6, 1:05-1:07, 1:31-1:40, 1:45-1:49, 2:03-2:10, 2:28) y medí el sonido: -14 LUFS, unas 140 palabras por minuto y ningún silencio largo. No juzgo la falta de interfaz de Instagram en el render ni el margen de 36 px, que son decisiones fijas de la cuenta.

```
Paso 1 (en frío)
- De qué trata: por qué un USB que abre en la Mac no aparece en Windows. Para responderlo, explica qué hace un sistema de archivos (el disco solo guarda bloques y el sistema es el fichero que dice dónde está cada archivo) y recorre NTFS, APFS, ext4/Btrfs/ZFS, FAT32 y exFAT, con lo que trae cada uno.
- Tesis en una frase: el disco solo guarda bloques, cada sistema operativo usa su propio fichero para encontrarlos según lo que prioriza, y por eso tu USB en APFS no aparece en Windows: si va y viene entre los dos, usa exFAT.
- Me habría ido en: 1:20. El gancho me prometió entender lo de mi USB, pero de 0:43 a 1:31 vienen 48 s de diario de NTFS, funciones de APFS, copia en escritura y, en 1:20, sumas de verificación. En 1:05 el contador ya dice "06 / 11", así que sé que falta mucho, y en 1:20 empieza la tercera explicación seguida que no tiene que ver con el USB. Me quedo hasta ahí porque las demostraciones son buenas: el corte de luz entre 0:50 y 0:55 y los punteros V1/V2 entre 1:07 y 1:19.
- Qué haría al final: guardarlo, por la tabla de compatibilidad (2:00-2:08) y el resumen (2:10).
- A quién se lo mandaría: a alguien que pasa un disco entre una Mac y una PC, o que graba en una cámara con videos de más de 4 GB. El momento de 1:40-1:44 ("Tu video de 5,4 no entra", con la barra que falla) se entiende sin el resto.

Paso 2 (con el brief)
- ¿Coincide la tesis? No hay con qué compararla: paso-2-brief.md dice "Sin brief". Por lo que entendí en el paso 1, el video tiene una sola tesis clara y el final la cierra ("Tu USB no estaba roto: hablaba APFS"). La segunda pregunta del gancho, "¿Por qué hay tantos?", se responde en 2:14 con una lista genérica (velocidad, seguridad, compatibilidad, funciones) que no se conecta con ningún sistema en particular.

| Punto | Peso | Puntaje | Por qué |
|---|---|---|---|
| Gancho | 15% | 4 | El problema es concreto, "Tu USB no está roto" se lee desde el cuadro 1 y entra en menos de 3 s. Pero entre 0:02,8 y 0:05,2 la etiqueta verde azulado que dice "ABRE" queda debajo de "está" y la tapa el título; "NADA" queda suelta al lado de "roto"; y ni la laptop ni el monitor dicen Mac o Windows. Sin sonido, todo depende del subtítulo. Entre 0:08 y 0:13 la voz suelta siete siglas seguidas |
| Tesis | 15% | 4 | Es clara y vuelve en 2:24-2:26, y no suena a comunicado. Le falta un punto: el "por qué tantos" de 2:14 son cuatro palabras que no se ligan con lo que se mostró de NTFS, APFS o Btrfs |
| Valor | 15% | 5 | Me llevo una idea que no tenía (bloques contra fichero, el diario, la copia en escritura, las sumas) y algo que puedo usar: el límite de 4 GB de FAT32, que la Mac lee NTFS pero no lo escribe, y exFAT para usar el disco en los dos |
| Retención | 10% | 3 | Dura 2:32 y la respuesta al gancho llega en 1:53, cuando ya pasó el 74% del video. Entre 0:43 y 1:31 son 48 s que no responden al USB. Entre 1:31 y 1:40 casi no aparece nada nuevo, y en cada cambio de parte la imagen llega como 1 s después que la voz |
| Compartible | 10% | 4 | El momento de 1:40-1:44 ("máximo, 4 gigas… Tu video de 5,4 no entra", con la barra en rojo) y la tabla Windows/macOS de 2:06-2:08 se mandan solos. A la tabla le falta un título para que sirva como captura |
| Cierre y CTA | 10% | 4 | La última frase vuelve al gancho ("Hablaba APFS", 2:26) y pide una sola cosa, propia del tema ("qué formato tiene tu USB"). Pero el video nunca enseña dónde se ve el formato, así que muchos no van a poder contestar |
| Voz y guion | 5% | 4 | Las frases son cortas y suenan dichas ("El SSD no sabe qué es un archivo"). Se leen como lista tres tramos: las siete siglas de 0:08, "archivos enormes, permisos, cifrado…" en 0:43 y "cifrado, clones, instantáneas y espacio compartido" en 0:56. El audio no lo oí |
| Legibilidad en el celular | 10% | 4 | Los subtítulos son grandes y con buen contraste, siempre en el mismo lugar, y los títulos se leen bien. Restan el choque del título en 0:02,8-0:05,2, el de "VACACIONES.MP4 5.400.000.000 bytes" sobre "MÁXIMO 2⁶⁴ − 1 bytes" en 1:48,0-1:48,4, y las etiquetas mono de unos 20-24 px de alto (los hashes de 1:24-1:30, "Ejemplo ilustrativo", "SDHC ≤ 32 GB") |
| Recurso visual y composición | 10% | 4 | Las metáforas son muy buenas y siempre hay una sola cosa que se ve primero: el mueble de cajones, el USB con "?" que acompaña todo el video, la barra de 1 a 7 que se llena, el diario con corte de luz, los punteros V1/V2, el bit que cambia, la barra de copia. Restan los huecos (1:31-1:40 en FAT32 y 1:22-1:27 en las sumas), que APFS (0:58-1:06) sea solo una lista de etiquetas, y que la imagen llegue después de la voz |

Promedio ponderado: 4.05 (0.60 + 0.60 + 0.75 + 0.30 + 0.40 + 0.40 + 0.20 + 0.40 + 0.40)

No pasa a la puerta B: Retención queda en 3 y el promedio está debajo de 4.5.

Tres arreglos, en orden de impacto (con el segundo del video):
1. Retención, de 0:43 a 1:53. La respuesta al gancho ("Lo formateaste en APFS… Windows no trae APFS", 1:53) llega después de 70 s de explicaciones que no hablan del USB. Hay que adelantarla antes de 1:00 y dejar el diario, la copia en escritura y las sumas como respuesta a "¿por qué tantos?", o bien bajar APFS (0:56-1:05) a una línea y juntar copia en escritura y sumas (1:05-1:31) en una sola demostración. Con eso el video quedaría cerca de 1:30. Esto cambia lo que dice la voz, así que vuelve a la puerta A.
2. Gancho, de 0:02,8 a 0:05,2. La etiqueta "ABRE" queda debajo de "está" y la tapa el título, y "NADA" flota al lado de "roto", lejos del monitor. Hay que poner cada etiqueta sobre su pantalla y escribir "Mac" y "Windows" debajo de la laptop y del monitor, para que el gancho se entienda sin sonido. La portada de la grilla, de paso, muestra dos pantallas negras: el cuadro con las carpetas en la Mac y el "?" en Windows (0:04) cuenta mejor el problema. No cambia la voz.
3. Sincronía y huecos. En cada cambio de parte la imagen llega como 1 s después que la voz: "En Linux" empieza en 1:05 y Linux recién entra en 1:06,2; "Ahora, tu USB" se dice en 1:53 y la escena aparece en 1:55; "Entonces:" en 2:08 y el resumen llega hacia 2:09. Dentro de las escenas pasa lo mismo: en 0:36 la voz dice "quién lo abre" con la fila vacía, que se llena recién en 0:38, y "WINDOWS ✓" y "MAC ✓" aparecen en 1:52 y 1:54, cuando la voz ya los dijo. Hay que adelantar cada movimiento unos 0,3 s antes de la palabra y llenar el hueco de FAT32 (1:31-1:40, donde el tercio del medio queda vacío y la tarjeta SD chica aparece recién en 1:36) trayendo los 32 bits y la tarjeta en 1:32. No cambia la voz.
```

## Otros detalles (menores, no entran en los tres)

- **2:04-2:06.** Mientras la voz dice "tu Mac lee NTFS, pero no escribe", la fila de macOS muestra solo "LEE Y ESCRIBE" (en la columna de APFS) y la etiqueta "LEE NTFS". Durante cerca de 1 s se lee como "la Mac lee y escribe NTFS", y la celda "SOLO LEE" recién aparece hacia 2:05. Además, "LEE NTFS" queda debajo de la columna de APFS hasta el final de la escena.
- **1:45,6-1:47,2.** El título ya dice "exFAT", pero al lado siguen "32 BITS DE TAMAÑO · 4.294.967.295 bytes" y "SDHC ≤ 32 GB · FAT32".
- **2:08-2:10.** Al pasar a exFAT, las carpetas aparecen solo en el monitor; la laptop sigue negra, y sin sonido parece que ahora falla la Mac.
- **2:10-2:24.** El USB vuelve a decir "?" después de haber dicho "EXFAT" en 2:08, y en 2:26 pasa a "APFS".
- **1:42.** La etiqueta dice "4 GB" y la nota de abajo dice "más de 4 GiB": son dos unidades en el mismo cuadro.

## Lo que funciona (no tocar)

- **0:00.** El título del gancho se lee desde el primer cuadro y la portada de la grilla lo mantiene entero.
- **El USB con "?" y la barra "SISTEMAS DE ARCHIVOS 1-7".** Hilan las 11 partes y dan la sensación de que se avanza.
- **0:22-0:24.** El contador llega a 488.281.250 bloques justo cuando la voz dice "casi quinientos millones".
- **0:50-0:55.** El diario con corte de luz (PENDIENTE, SIN LUZ, REPASANDO, OK) es la mejor explicación del video.
- **1:07-1:19 y 1:26-1:30.** Los punteros V1/V2 y el bit que se pone rojo con "NO COINCIDE · DETECTADO" muestran la idea antes de que se termine de decir.
- **1:42-1:52.** La barra de copia que falla en FAT32 y se completa en exFAT hace que el límite se entienda solo con la imagen.
- **2:26.** "Hablaba APFS" cierra el círculo con el gancho y hace natural verlo otra vez.

Hasta que exista la calibración con Reels de referencia, este informe es una señal más, no el veredicto.
