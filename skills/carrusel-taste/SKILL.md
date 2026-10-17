---
name: carrusel-taste
description: Dirección de arte para carruseles de Instagram del motor. Úsala al diseñar slides.tsx de cualquier carrusel; reparte direcciones con la baraja, define ancla visual, paleta y tipografías por pieza.
---

# carrusel-taste

Criterio visual para que cada carrusel se vea pensado para su tema y distinto del anterior, sin caer en el promedio de lo que hace un modelo. Adapta a láminas fijas de 1080×1350 los principios de [Taste Skill](https://github.com/Leonxlnx/taste-skill) (MIT); lo que es de páginas web (navegación, animación, búsqueda de fotos) quedó fuera.

Se usa en el paso de dirección de arte de [workflows/carrusel.md](../../workflows/carrusel.md), después de que la persona aprobó el brief en la puerta A (tesis, gancho, esqueleto y CTA) y de tener la idea visual.

## Qué es fijo y qué cambia

| Fijo en todas las piezas | Cambia en cada pieza |
|---|---|
| El marco semiconstante de `<Slide>`: pestaña de archivo arriba a la izquierda, textura de puntos y la firma abajo. La forma no cambia; toma el color de la paleta | La dirección de arte, la paleta, las tipografías, la composición de cada lámina y el número de láminas |

## Proceso

### 1. Pide la mano

```bash
npm run carrusel:baraja -- --cuenta dev
```

Reparte 3 de las 12 direcciones de [direcciones.json](direcciones.json). Deja fuera las dos últimas que usó la cuenta, para que el feed no repita estilo. `--todas` lista las 12.

### 2. Elige una dirección base

Elige la que mejor sirva **a este tema**, no la que sea más fácil. Anota en `post.json → art`:

- `direction`: la elegida.
- `dealt`: las 3 que te tocaron.
- `reason`: por qué esta y no las otras dos, en una o dos frases que mencionen algo del tema.
- `borrowed`: las direcciones de las que alguna lámina interior toma la forma.

**Una dirección base por carrusel.** Todas las láminas comparten la paleta y las tipografías. Una lámina interior puede tomar la forma de otra dirección cuando el contenido lo pide (una tabla tipo ficha técnica dentro de un carrusel de titular gigante, una captura anotada dentro de una línea continua). Así se ve coherente pero no repetitivo.

### 3. Define el ancla visual

El ancla dice el tema antes de que alguien lea una palabra. Es obligatoria en la portada y va grande. Elígela en este orden:

1. **Producto o empresa:** su logo o ícono oficial con `<Logo slug="..." />` (Simple Icons, CC0). Busca el slug y el color oficial con `npm run carrusel:logo -- <marca>`. Se usa tal cual, en su color, sin deformarlo. Si el fondo no lo deja ver, usa `chip` (ficha clara detrás) en vez de cambiarle el color.
2. **Sin logo útil:** una captura real del producto con `<Img src="..." ancla credit="..." />`. Recortar está bien; retocar el contenido, no.
3. **Tema sin marca** (ventas, productividad, prompts): un objeto grande con `<Icono name="..." />` (Lucide).
4. **Comparación:** las dos anclas, una frente a la otra.

Nunca dibujes ni imites un logo, una mascota o un personaje de una marca: solo archivos oficiales o capturas reales. El logo identifica el tema; no sugieras patrocinio. Anota el ancla en `art.anchor` con su fuente.

**Prueba del pulgar:** el render genera `out/pulgar.png`, la portada al tamaño de una miniatura del perfil. Si ahí no se sabe el tema sin leer, el ancla es muy chica o está escondida. Mira [referencias/prueba-del-pulgar.jpg](referencias/prueba-del-pulgar.jpg).

### 4. Paleta

`art.palette`: `bg`, `ink`, `accent`, `accentInk` y, si hace falta, `surface` y `muted`.

- El acento suele salir del color de la marca del ancla. Si ese color no da contraste para texto, úsalo en formas (trazos, bloques) y oscurécelo un poco para el acento de texto.
- Sigue la idea de paleta de la dirección (`paleta` en direcciones.json).
- Los tonos de `<Slide>` (`base`, `accent`, `invert`, `surface`) dan ritmo sin salir de la paleta. Un color fuera de la paleta solo se justifica si es el de un ancla.

### 5. Tipografías

`art.fonts`: `display` para titulares, `text` para texto (casi siempre `geist`) y `notes` solo si la dirección usa anotaciones a mano (`caveat`). El catálogo está en `packages/brand/src/fonts.ts`; la dirección sugiere cuáles le quedan.

- Máximo dos familias en el contenido de una lámina. El código no cuenta.
- `archivo` se condensa con `font-stretch-[66%]`; `instrument-serif` solo tiene peso 400.
- Los titulares van con `font-display`.

### 6. Composición, lámina por lámina

- **Una cosa dominante por lámina,** y muy grande. Dos o tres tamaños de texto como mucho.
- **Láminas vecinas distintas:** cambia escala, alineación, tono o recurso.
- **La portada sigue la receta de la dirección** (`portada`) y el interior su `interior`.
- **Asimetría con intención:** alinea a un borde, deja aire en el otro. El centrado simétrico en todo se ve plantilla.
- **Lo real manda:** comandos, código, capturas y números con fuente. Nada de dashboards falsos ni interfaces inventadas.
- **Grande para el celular:** el cuerpo en 16px de diseño o más; menos palabras antes que letra chica.
- **El cierre también se diseña:** la última lámina es una despedida que cierra lo que abrió la portada (el mismo ancla, el mismo trazo, la respuesta al gancho), en la forma de la dirección elegida, con la despedida y el CTA del brief (`data-cta`). Es tan dinámica como la portada: no hay una lámina final fija, y la jugada de despedida y la forma del CTA cambian de una pieza a la siguiente (`cierres.json`).
- **La lámina de resumen,** cuando la hay, se diseña para que se entienda capturada y mandada sola.
- Revisa también [docs/anti-slop.md](../../docs/anti-slop.md).

## Referencias

- [referencias/baraja-12-direcciones.jpg](referencias/baraja-12-direcciones.jpg): las 12 portadas con un mismo tema (Gemini 4 Argon contra Claude Opus 5.5), para ver solo el estilo.
- [referencias/prueba-del-pulgar.jpg](referencias/prueba-del-pulgar.jpg): las mismas portadas con y sin ancla, en miniatura.
- `content/2026-10-16-mods-claude-code/`: una pieza completa en línea continua, con préstamos de captura anotada y terminal.

## Checklist antes de renderizar

- [ ] `art.direction`, `dealt`, `reason` y `borrowed` completos.
- [ ] El ancla está en la portada, grande, y en `art.anchor` con su fuente.
- [ ] La paleta sale del ancla y de la dirección; ningún color suelto.
- [ ] Dos familias como mucho por lámina, sin contar el código.
- [ ] Ninguna lámina repite la composición de la anterior.
- [ ] La portada usa el gancho aprobado en la puerta A.
- [ ] La última lámina cierra la portada con la despedida del brief y tiene un solo CTA con `data-cta`.
