# Estado: 2026-11-02-cinco-algoritmos-ml

## Dónde quedó

- **Guion, voz, video y crítica hechos el 2026-11-02,** en una sola sesión. El inspector no da errores.
- **El render final:** `out/video.mp4`, 1080×1920, H.264 yuv420p en BT.709 y AAC, 158,9 s (referente: 170,4 s, a un 6,8 %), sha256 `268c64272a46d9c014f4b9c1338ff69763de6ba2beb05f2e96a74ca2c4f97f4e`.
- **Puertas A y B anotadas por delegación,** con la frase de Jeremy en `notes`. Él todavía no vio el guion ni el video.
- **Sin publicar y sin commit.** Paso siguiente: publicar, solo cuando Jeremy lo pida.
- **Audio sin oír:** ni el agente ni el crítico lo oyen. −14,1 LUFS y pico de −1,4 dBFS, medidos. Se revisó con cuadros y transcripción.
- **Voz:** plan gratuito sin licencia comercial, como decidió Jeremy el 2026-11-01. El post lleva "Voz con IA: elevenlabs.io".

## El encargo

Jeremy, 2026-11-02: "Genera un nuevo video como este https://www.instagram.com/p/Dclxf-oMdV8/, no me pidas aprobaciones, no tengo tiempo para revisarlo, te espero solo con el resultado final, lo dejo en tus manos".

Por eso las tres fases se hicieron en una sola sesión, y las puertas se anotaron con esa frase: él no vio ni el guion ni el video antes. Publicar es otro pedido (regla 12).

## La reestructura, frente al referente

@rick.theengineer, 170,4 s, en inglés (`referente.md`). Su promesa es "todo en un plano", pero usa un panel que se limpia con un corte en cada algoritmo, y cada uno trae sus propios ejes y su propio caso inventado.

| Decisión | Por qué |
|---|---|
| Un solo gráfico, de verdad: las mismas flores de Iris en los mismos ejes, de punta a punta | Es lo que él promete y no cumple |
| Todos los datos son reales | Él usa empresas ficticias para 4 de los 5 |
| Una flor tapada que los cinco tienen que adivinar, y se destapa al final | Es el hilo y la razón para quedarse. Él no tiene ninguno |
| Un solo trazo que se transforma: recta, S, corte, camino, y el borrador | Dirección `linea-continua`. Él corta 5 veces |
| El gancho se ve en el cuadro 1 | Él abre con una portada y empieza a los 8 s |
| Cámara dinámica | Él no mueve la cámara en 170 s |
| "Borro las otras 98 y no se mueve", con el reajuste real | Él solo menciona los puntos de soporte |
| El kernel con la trampa: gana en lo que vio y pierde en lo que no vio | Él da "60 % contra 100 %" sin más |
| Última imagen: todos los dibujos pasan por la flor, y cae de un lado distinto de cada uno | Explica por qué no coinciden. Él no los compara |
| Cierre para capturar y un solo CTA | Él termina en seco, sin pedir nada |

## Mundo y dirección de arte

- **`linea-continua`** (repartidas: captura-anotada, linea-continua, antes-despues). Papel milimetrado claro y lápiz en bermellón para lo que dibuja cada algoritmo. Un color por especie: verde, azul y magenta.
- **`ajustes.py` escribe `ajustes.json`:** toda cifra y toda forma salen de ahí. Se corre con numpy y scikit-learn, en un entorno aparte (no están en el repo). Datos de Iris en `load_iris`.
- **Cámara propia:** `shots()` en `video.tsx`, con las marcas `data-zoom` y `data-camera-moving`. El escenario va uno a uno (`camera` en la primera escena); sin eso, el motor encoge el mundo un 14 %.
- **Avatar:** solo en `cierre`, para pedir que lo guarden. En el resto taparía a setosa, y manda el gráfico (`docs/direccion-reels.md`, 6). Sin burbuja.
- **Subtítulos:** `pill`. Voz con `tempo` 1,22, para llegar a los 170 s.

## Lo que cambiaron las fuentes y los ajustes

- **La flor es la fila 120 del dataset** (5,0 × 1,5 cm, virgínica). La elegí a propósito entre las pocas en las que los modelos no coinciden, y el post lo dice.
- **Solo la logística acierta,** y dejando afuera cada flor todas rondan lo mismo: 95,3, 96,0, 96,7 y 96,0 %. La logística responde una pregunta más fácil (virgínica o no). El video dice que no es la mejor, y el post explica por qué.
- **El camino de SVM se apoya en 2 flores de 100.** Reajustado solo con ellas, los coeficientes se mueven 0,00000002. El margen es justo la distancia entre las dos: 1,30 cm.
- **Los parámetros del kernel (C=1000, gamma=2) se eligieron para que doble mucho.** Con `SVC()` por defecto no se ve ese efecto. El post da los parámetros.
- **El árbol está limitado a 4 hojas,** para tener 3 preguntas. Por defecto crece hasta hojas puras.
- **"Cada respuesta mide la distancia a las 149" es la forma básica:** scikit-learn puede usar KD-Tree o Ball Tree. La voz dice "en su forma básica" y el post lo aclara.
- **El círculo de KNN se ve como una elipse,** porque los ejes tienen distinta escala. Es la distancia real en cm.
- **No hay fuente primaria legible** para 2/||w|| escrito tal cual, ni para "rectángulos alineados a los ejes": van como deducción en `calculations`. Las 7 cosas sin confirmar están en `facts.json → pendingToVerify`.
- **Regla 1:** "virgínica" se escribe con tilde para que la voz la acentúe.

## Lo que no entra, y por qué

- **Las fotos de iris, Spotify y Netflix del referente:** no hacen falta si todo pasa en un gráfico.
- **Tabla de datos que se vuelve puntos:** el gráfico ya está desde el cuadro 1.
- **La ecuación de la recta y R²:** frenan, y el dato útil es la predicción.

## Lo que dijo el crítico del guion (Gemini, 4,88 de 5)

- **Aplicado:** se acortó la intro y se apretó el kernel; "¿Cuánto mide?" y "¿Qué especie?" separan la recta de las otras cuatro.
- **No se corrió** el orden ciego de los ganchos: Jeremy no iba a decidir nada en la puerta A.

## Lo que se probó y no funcionó

- **El mundo sin `camera`:** el motor lo encoge para que quepa. Va `focus: { x: 270, y: 427 }, zoom: 1`.
- **`node -e` no ejecuta nada en este Bash:** no da error y no cambia nada. Se usan scripts en archivo.
- **`drawtext` de ffmpeg** se cae por falta de fontconfig en esta máquina.
- **La etiqueta de la flor a tamaño fijo:** con la cámara cerca tapaba a las vecinas. Ahora etiqueta y flores conservan su tamaño en pantalla.

## El crítico ciego

**Ronda 1: 3,65** (`video-critica.md` guarda el informe de la última ronda). Gancho, Retención y Legibilidad, en 3. Se habría ido en el kernel. Se aplicó:
- **Gancho:** la apuesta y la flor marcada se ven desde el cuadro 1. "Cinco algoritmos. Solo uno acierta." reemplaza a "Un gráfico." en pantalla, y el rótulo dice "¿Qué especie?". La voz no cambia.
- **Voz más corta:** `lineal` (de 19,4 a 13,7 s), `arbol` y `kernel` (de 17,6 a 12,8 s, sin decir los cuatro porcentajes: quedan en pantalla). El destape pasó de 2:18 a 2:05.
- **La frontera se lee:** cada lado del kernel y de la recta va teñido del color de su especie.
- **Legibilidad:** sin textos encimados, el gráfico no se ve bajo la tabla, árbol a 18 px, y los nombres se van antes de que el cuadro los corte.
- **El CTA:** la tarjeta dice cuándo elegir cada uno ("Quieres un número"), porque la voz pide guardarlo "para cuando te pregunten cuál usar".

**Ronda 2, contexto nuevo: 3,90.** Gancho, Legibilidad y el resto en 4; Retención en 3. Se habría ido a la 1:29, en el kernel. Está bajo el umbral de la puerta B (todos en 4 o más y 4,5 de promedio). Se aplicó, solo imagen, y no se volvió a medir:
- la recta de SVM se atenúa y ya no cruza el título de KNN;
- "La flor, hasta ahora" recuerda la apuesta al empezar cada algoritmo;
- la tabla llena el cuadro, y dice "Logística, sí o no";
- números de los ejes y código de SVM más grandes.

**No se aplicó:**
- **Sacar el kernel o bajar a 2:00:** quedaría a más de un 10 % del referente (`docs/direccion-reels.md`, 2), y "gana en lo que vio, pierde en lo que no vio" es lo que el referente no tiene. Si se quisiera acortar, es lo primero: 12,8 s y un texto nuevo de unos 50 créditos.
- **Decir en la voz que la logística responde algo más fácil:** va en pantalla ("sí o no") y en el post. Pide voz y casi no quedan créditos.
- **El gris de las palabras que faltan en los subtítulos:** es del marco de todos los videos.

## Créditos de ElevenLabs

**Quedan 283 de 10.000 en la clave de respaldo, hasta el 2026-11-29; la principal, 14.** Cambiar una escena también cambia la clave de caché de las vecinas (`previousText` y `nextText`), así que tres textos nuevos pagaron seis escenas: unos 1500 créditos. Por eso:
- **`knn` reusa la toma ya pagada:** se copió su entrada de caché con la clave nueva. El texto y la voz son los mismos, y las dos versiones de la escena anterior terminan igual.
- **`cierre` y `revela` conservan su voz.** Se probó "en qué se diferencian" en el CTA, y no se pagó: costaba 517 créditos con `revela`.
- **La próxima pieza no alcanza** con estas claves: un Reel de esta duración pide unos 2500 créditos.

## Avisos del inspector que quedan

- **7 palabras a los 33,5 s:** el título y la nota suman 6; la séptima es el "?" de la etiqueta de la flor.

## Para el motor

Van en su propia sesión:
- `video:script` y `video:storyboard` no aplican `voice.tempo` de la pieza (ya anotado en `2026-11-01-mcp-no-reemplaza-apis`).
- `cachedSpeech`: un cambio de texto vuelve a pagar las escenas vecinas. Conviene que `previousText` y `nextText` no entren en la clave, o que entren recortados a la última frase.
- `beats_es` toma la primera frase como gancho, no `hooks[0].said`: el aviso de "la última frase no repite ninguna palabra del gancho" sale aunque el cierre diga "gráfico".
- `<Sfx>` a volúmenes de 0,2 a 0,3 queda por encima de la música al 0,06: `docs/direccion-reels.md`, 4, pide lo contrario.
