# Anti-slop para carruseles

Un carrusel hecho por un modelo suele verse como el promedio de todos los que ha visto: una etiqueta pequeña sobre el título, una palabra en color, viñetas con flecha, tarjetas iguales y la misma estructura en cada lámina. Nada está mal y nada fue decidido.

Estas reglas adaptan al formato carrusel los principios de [Taste Skill](https://github.com/Leonxlnx/taste-skill) (licencia MIT), que se basan en un estudio de 247 sitios premiados. Taste está pensada para páginas web; aquí se toma lo que aplica a una lámina fija de 1080×1350.

## Prohibido

| Recurso | En su lugar |
|---|---|
| Etiqueta pequeña sobre el título ("Qué es", "Chuleta", "Paso 2") | Ponlo en el título o bórralo |
| Píldoras tipo "Nuevo" o "Beta" | Dilo en la frase |
| Monoespaciada fuera de código real | La tipografía de texto. La mono es solo para código y comandos |
| Numeración decorativa: 01, 02, 03 o "Paso 1" | Orden por posición, tamaño o palabras |
| Líneas finas y cajas con borde de 1px | Espacio o un cambio de tono de fondo |
| Degradados, sombras y brillos | Color plano y cambios de tono |
| Una palabra del título en color, cursiva o subrayada | Un solo color de título; las palabras hacen el énfasis. Excepción: el código real |
| Emoji o íconos como viñetas | Palabras o un artefacto real. Un ícono grande como ancla del tema sí vale |
| Filas de tarjetas iguales con ícono | Una composición pensada para ese contenido |
| La misma composición en dos láminas seguidas | Cambia escala, alineación, campo de color o recurso |
| Una lista con flechas en cada lámina | Como mucho una lista por carrusel |
| Dashboards falsos de barras grises o interfaces inventadas | Una captura real, código real o nada |
| Logos, mascotas o personajes de marcas dibujados o imitados | El archivo oficial (`<Logo>`) o una captura real |
| La misma dirección de arte que el carrusel anterior | La baraja (`npm run carrusel:baraja`) deja fuera las dos últimas |
| Letra chica en el cuerpo (menos de 32px reales) | Menos texto y más grande; la letra chica es solo para fuente y fecha, con `<Nota>` |
| Un cierre genérico ("compártelo con quien lo necesite", "sígueme para más") | Una despedida que cierra la portada y un CTA que nombra la situación concreta |
| Dos peticiones en el cierre o en el texto del post | Una sola, la misma en la lámina y en el texto |

## Hacer

- **Tipografía grande:** dos o tres tamaños por lámina; el más grande, muy grande.
- **Texto en tinta completa.** El gris es solo para notas secundarias.
- **Una cosa dominante por lámina,** con su contenido completo. Una lámina mayormente vacía está sin terminar, salvo una pausa deliberada por carrusel.
- **Artefactos del tema:** el comando, el código, la captura, el prompt, el número con su fuente.
- **Ancla visual en la portada:** el logo oficial, la captura o el objeto que dice el tema sin leer.
- **Tonos de la paleta** (`base`, `accent`, `invert`, `surface`) para dar ritmo entre láminas.

## Texto

- Español neutro, en la voz de [docs/voz.md](voz.md).
- Sin guiones largos (—) ni frases de relleno. La lista completa está en [skills/ig-es/slop-es.json](../skills/ig-es/slop-es.json): la usan el inspector (láminas) y el humanizador de `ig-human` (texto del post). Ejemplos: "potenciar", "sumérgete", "en el mundo actual", "cabe destacar que", "sin lugar a dudas", "un antes y un después", "al siguiente nivel", "revolucionario", "increíble".
- Sin las estructuras que delatan a un modelo: "No es solo X, es Y", "No se trata de X, se trata de Y", tríadas ("rápido, barato y fácil."), "¿El resultado?" en una línea, "Spoiler:", "¿Sabías que...?", "Todo lo que necesitas saber", preguntas genéricas de cierre ("¿Qué opinas?") y cebos ("etiqueta a alguien", "compártelo con quien lo necesite"). El render las marca en el texto y en las láminas.
- Verbos concretos y números con fuente. Nada de testimonios, cifras ni clientes inventados.
- Cada lámina responde a una sola afirmación del argumento.
