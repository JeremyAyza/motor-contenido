# Plan: paridad con @rick.theengineer

Pedido por Jeremy el 24 de octubre de 2026, después de comparar el video de tokens con el Reel de Rick sobre lo que cuesta la IA ([DeMxXXwM3K1](https://www.instagram.com/p/DeMxXXwM3K1/)). El avatar queda como está (la ilustración de Jeremy con boca y parpadeo). La voz queda para después. El estilo sigue siendo motion graphics plano ([docs/direccion-reels.md](direccion-reels.md)): no hace falta 3D.

## Los huecos del motor y su arreglo

1. **Objetos del mundo.** Cada pieza dibujaba sus objetos con `div`. Ahora hay un kit de objetos SVG planos (`packages/video/src/kit/props.tsx`): carretera, autos, camión, edificios, árboles, faroles, semáforo, caseta, máquina, cartel, nube, servidor, documento, moneda, persona, laptop y depósito. Sin contorno, con sombra en dos tonos, que toman la paleta de la pieza.
2. **Cámara que viaja.** `stage.paths` define recorridos SVG en el mundo. Una escena puede seguir uno con `camera: { follow: { path, from, to } }`. `<Along>` y `<Traffic>` mueven objetos por esos recorridos.
3. **El tablero de Rick.** `defineVideo({ panel })` es un HUD con filas (entrada, salida, caché), un punto en la fila activa, uno o dos contadores que suben en vivo y una línea de pie. Cada paso puede durar lo que dure lo que cuenta (`ramp`).
4. **Texto en pantalla.** Hay un estilo de subtítulo `card`, la frase en una tarjeta grande, y un `<Banner>` para la idea de la escena ("ENTRADA + TODO LO QUE MANDAS"). La barra de capítulos ya cumple lo que en Rick es "02 TWO PRICES".
5. **Movimiento de fondo.** Los objetos del kit se mueven solos: las luces parpadean, los árboles se mecen, las nubes avanzan y los autos circulan. Todo sale del reloj del video, así que el render es el mismo cada vez.
6. **Sonido.** El catálogo tiene 13 efectos CC0 con licencia revisada: Remotion (`@remotion/sfx`) y Openverse (Freesound). Muchos sonidos salen solos:
   - un whoosh cuando la cámara cambia de encuadre;
   - la caja registradora o una moneda cuando sube el tablero;
   - un pop con cada `<Pop>`;
   - un blip con cada `<Banner>`.
7. **Formato largo.** `format: "largo"` va de 90 a 180 s, para explicaciones de varios puntos con algo que cambia cada segundo. El `corto` (de 45 a 60 s) sigue siendo el de por defecto.
8. **Voz.** Pendiente por decisión de Jeremy: clonar su voz (Starter de ElevenLabs) o una voz latina de la biblioteca.

## La prueba

Rehacer el video de tokens en formato largo con todo lo anterior y armar una hoja que ponga 6 cuadros de Rick al lado de los nuestros, en el mismo momento de la explicación. Los cuadros de Rick quedan solo en `out/`, porque no son nuestros.
