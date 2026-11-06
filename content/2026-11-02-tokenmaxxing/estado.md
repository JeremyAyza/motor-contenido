# Estado: 2026-11-02-tokenmaxxing

Réplica para @jacket.dev del Reel de @rick.theengineer sobre tokenmaxxing (https://www.instagram.com/p/DfQgvNcsScT/), de 170 s.

## Fase

**Publicada** el 2026-11-05 a las 18:44 (hora de Lima) en @jacket.dev: https://www.instagram.com/reel/DfYPPoqh7Cq/. Jeremy lo pidió con "puedes publicarlo". Primero se hizo el ensayo con `--ensayo`, con el texto completo y la etiqueta de IA activada. Quedó anotada en `publications.jsonl`.

La puerta B se aprobó el 2026-11-05 ("Sí, apruebo") y está anotada en `video.json → gateB` con el sha256 del render final.
- **Render final (`out/video.mp4`):** el tercero, pedido por Jeremy con `--forzar` el 2026-11-05. Dura 178,8 s y el inspector no marca ningún problema.
- **sha256:** `b3a65fcf4bde32cf71c2f29280c367e59501ba8bc47d474bc4b79b851142913c`.
- **El render 2** (sha256 `9843420926b9…`) tenía la fuente de la cita de Nvidia fuera del margen y 10 palabras a la vez al abrir la paradoja. El render 3 corrige las dos cosas.

Un render nuevo cambia el sha256 y devuelve la puerta B a `false`.

## Paso siguiente

1. **2026-11-07 (48 horas):** Jeremy pasa la captura de Insights. Se transcribe en `video-metrics.json` y se corre `npm run video:metrics`.
2. **2026-11-12 (7 días):** lo mismo con los Insights de la semana.
3. Al leer las métricas, considerar que se publicó un día después del Reel de Amazon, que también toca el tokenmaxxing (ver "Riesgo de tema repetido").
4. `npm run video:cosechar -- content/2026-11-02-tokenmaxxing` para proponer escenas a la biblioteca. Son candidatas la tabla de récords que se reordena, la marquesina FICHAS y la pantalla partida de dos jugadores.

## Decisiones de Jeremy

- **Encargo (2026-11-04):** "Réplica para la cuenta dev del Reel https://www.instagram.com/p/DfQgvNcsScT/, con el mismo guion pero parafraseado. Copia la estructura, el ritmo y la duración del original, con la marca de la cuenta. Muéstrame los ganchos y el guion antes de generar la voz, y el video terminado antes de darlo por listo. Importante no perder la calidad de contenido."
- **Puerta A (2026-11-04):** "Apruebo", sobre los ganchos, el guion de 18 escenas y el storyboard. Los arreglos 1 y 2 de Gemini quedaron sin aplicar.
- Se hizo todo en este chat, lo creativo y la producción.
- **Tercer render (2026-11-05):** "Sí, renderiza", después de ver el render 2. Pidió el render con los dos arreglos (fuente de Nvidia y paradoja), con `--forzar`.
- **Puerta B (2026-11-05):** "Sí, apruebo", sobre el render 3. No pidió el arreglo 1 del crítico (abrir con la cifra y acortar el tutorial).
- **Publicación (2026-11-05):** "puedes publicarlo". Se publicó el mismo día, sin esperar la distancia con el Reel de Amazon que se había recomendado.

## Decisiones de esta pieza

- **Se siguió en esta carpeta,** que ya tenía el análisis del mismo Reel (`referente.md`) y sus fuentes (`facts.json`). El guion anterior, que nunca pasó la puerta A, se alejaba del original (Goodhart, METR, Amazon y Uber): se reemplazó por uno que sigue los bloques de Rick en su orden. El viejo queda en git (commit `de7b3ef`).
- **Fuentes:** el subagente `buscador-fuentes` sumó 12 datos a `facts.json` el 2026-11-04 (Jellyfish, qué es un token según Anthropic y OpenAI, el ciclo y los costos de Claude Code, "-maxxing" en Dictionary.com).
- **Estructura copiada de Rick:**
  - la moda y las tablas, y la pregunta;
  - nivel 1, qué es un token;
  - nivel 2, un dev y un agente en ciclo, y doce agentes;
  - nivel 3: maxxing, se vuelve masivo y el supuesto uso = trabajo;
  - los dos devs con 50 M y 5 M, sus dos escenarios y los tokens engañan (Jellyfish);
  - el otro lado, la pregunta correcta con 4 preguntas y los 100 contra los 1.000 dólares;
  - la paradoja y la tabla que se reordena.
- **Cambios frente a Rick, por las reglas del repo:**
  - El gancho "Tokenmaxxing explicado" se cambió por "Esta es la nueva moda en Meta: quemar tokens" (hookscore 60), con la fuente bajo el gancho desde el cuadro 1.
  - El ciclo de Claude Code tiene 3 fases, como su documentación (entender, cambiar, verificar), no los 5 pasos de Rick.
  - Las cifras de Rick sin fuente se reemplazaron o se rotularon:
    - la de Meta sale de Fortune, y la marquesina dice "Meta, 30 días" solo mientras muestra esa cifra;
    - la de Jellyfish es de tokens por PR y de PRs por semana, como dice su estudio;
    - Ana, Beto, los agentes, el equipo del cierre y los dólares llevan "Ejemplo ilustrativo".
  - Alice y Bob pasaron a Ana y Beto.
  - Se agregó un CTA hablado de enviar, porque Rick no tiene CTA en el video.
- **Mundo:** una máquina de arcade de dos jugadores.
  - La marquesina FICHAS (en `world.tsx`) cuenta lo que se quema y vuelve a 0 en cada nivel.
  - El medidor "Trabajo entregado" casi no se mueve hasta que la tabla se ordena por él.
  - La cámara está fija en zoom 1 (`focus {270, 427}`), así que el mundo coincide con la pantalla.
- **Dirección de arte:** `antes-despues` (la baraja dio antes-despues, ficha-tecnica y titular-gigante).
  - Colores: negro violeta `#120E1F`, magenta `#FF4F9A` para las fichas y el acento verde azulado `#3EE6C4` para lo entregado.
  - Tipografías: Archivo y Geist.
  - Sin avatar.
- **Voz:** ElevenLabs, 2.883 caracteres, con `tempo` 1,25 en `video.tsx`. A 1,2 daba 186 s, por encima de los 180 s del formato largo; a 1,25 da 178,8 s, un 5 % sobre los 170 s del original.

## Crítica

- **Ganchos (crítico ciego, Sonnet):** ordena primero el elegido. Pidió que se viera la fuente, y se agregó.
- **Guion (Gemini):** 4,75 de 5, sin error grave. Sus arreglos 1 y 2 (acortar "qué es un token" y adelantar la definición) no se aplicaron, porque rompen el orden de Rick.
- **Video (crítico ciego, ronda 1, `video-critica.md`):** 3,65 de 5, sin error grave y sin puntos bajo 3, así que no hay segunda ronda.
  - Gancho 3, Tesis 4, Valor 4, Retención 3, Compartible 4, Cierre 4, Voz 4, Legibilidad 3 y Recurso visual 4.
  - **Arreglo 1, no aplicado:** abrir con los 281 mil millones y acortar el tutorial del token y del agente. Cambia la voz y el orden de Rick; vuelve a la puerta A si Jeremy lo quiere.
  - **Arreglo 2, aplicado:** que nada tape los datos. El logo de Meta y TOP 250 pasaron a la fila de la etiqueta, se movieron el sello "ENGAÑOSA" y el cursor del cierre, y los rótulos subieron de 12 y 13 a 14 y 15 px.
  - **Arreglo 3, aplicado:** llenar los huecos.
    - la cuadrícula de empleados entra antes, y una ficha "?" gira bajo la pregunta;
    - Beto conserva su 5 M y sus fichas en los escenarios;
    - la segunda jugada está desde el principio, atenuada;
    - los primeros puntos de la paradoja caen desde el inicio.

## Avisos defendidos

- **Dura 178,8 s, un 5 % sobre el `target`:** está dentro del margen del 10 % y del formato largo.
- **El gancho se dice en unos 3 s:** a `tempo` 1,25 entra en el límite.

## Lo que no funcionó

- **El `Visual` de una escena empieza bajo la pestaña** (42 px), no en el (0,0) del lienzo. `Layer` en `parts.tsx` lo compensa con `top: -42`.
- **Sin `camera`, el escenario encaja el mundo entero** en la banda central y lo achica un 20 %. Se arregló con `camera: { focus: { x: 270, y: 427 }, zoom: 1 }` en la primera escena.
- **El hook `sin-parches` niega editar un `.tsx` con un script de Python.** Los cambios van con Edit.
- **Subir los rótulos a 15 px después del render del crítico** hizo que la fuente larga de Nvidia se saliera del margen en el render 2. `Source` ahora lleva `maxWidth`. Costó un tercer render completo (el tope es dos).

## Pendiente para el motor (no se toca a mitad de pieza)

- `docs/referencia/kit-video.md` no dice que el `Visual` arranca 42 px más abajo ni que el escenario achica el mundo sin `camera`. Las dos cosas cuestan un render.
- `video:storyboard` estima la duración sin el `tempo` de la pieza (197 s contra los 178,8 reales).
- Remotion avisa de una versión de zod distinta (4.6.7 contra 4.5.4).

## Riesgo de tema repetido

El Reel de Amazon, publicado el 2026-11-04, ya tiene una escena sobre tokenmaxxing ("Más IA no es más trabajo"). Según el análisis de Rick, repetir un tema a los pocos días le costó 10 veces menos vistas. Conviene publicar este con unos días de distancia.

## Anclaje

- Cambios al guion visual después de emparejar: 0.
- Parte del tiempo en pantalla que sale de la biblioteca: 0 % (biblioteca vacía; las 18 escenas son nuevas).
- Parecido con las últimas 3 piezas: el mundo de arcade oscuro con dos campos de color es nuevo; el tema se cruza con el de Amazon.
