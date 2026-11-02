# Avatar

El avatar de la cuenta, el que aparece en los videos. Es la ilustración de Jeremy: nunca uses personajes con derechos de autor. Las dos cuentas (`accounts/dev.json` y `accounts/negocios.json`) lo leen desde `avatar.manifest`.

## Qué hay aquí

```
assets/avatar/
├─ manifest.json      qué archivo es cada parte y dónde están la boca y los ojos
├─ generated.json     con qué modelo y prompt se hizo cada sprite (igual que en las piezas)
└─ v1/
   ├─ original.jpg    la ilustración original, con fondo
   ├─ base.png        sin fondo: la que se dibuja siempre
   ├─ mouth-half.png  la misma, con la boca entreabierta
   ├─ mouth-open.png  con la boca abierta
   └─ eyes-closed.png con los ojos cerrados
```

Los cuatro PNG miden 2048 × 2048 y tienen el dibujo en el mismo lugar. De las variantes solo se toma su recuadro: la boca (`mouthBox`) o los ojos (`eyesBox`). Así, el resto del dibujo siempre es el de `base.png`.

## Cómo lo usa un video

En `video.tsx`, `avatar: {}` dibuja el busto abajo a la izquierda. `video:prepare` y `video:storyboard` copian los sprites a la carpeta pública del render. La boca se abre según el volumen de la voz y los ojos parpadean (`packages/video/src/kit/avatar.tsx`).

En los Reels va este busto sin fondo, si es estratégico para el video o si se solicita explícitamente. La burbuja (`shape: "bubble"` con `bubbleCrop`) queda solo porque la usan piezas anteriores: nunca en una pieza nueva ([docs/direccion-reels.md](../../docs/direccion-reels.md), 6).

La pieza decide dónde va: `size`, `top` y `scenes`. Si una pieza trae otros sprites (`base`, `mouths` o `blink`, relativos a su carpeta), esos reemplazan a los de la cuenta campo por campo.

### Por momentos

Cada escena puede traer su propio `avatar`. Con eso, el avatar aparece dentro de una frase, en vez de estar en toda la escena:

```tsx
{ id: "trampa", avatar: { from: "left", at: "trampa", until: "postman", x: 60, y: 500, size: 180 } }
```

| Campo | Qué hace | Si no está |
|---|---|---|
| `x`, `y` | Su centro, en px de diseño | La esquina de abajo del lado por donde entra (la izquierda, si no dice) |
| `size` | Su lado | `avatar.size` de `defineVideo`, o 220 |
| `at` | Cuándo entra: una palabra de la voz (`"trampa"`), una palabra repetida (`{ word: "delete", nth: 2 }`) o segundos (`1.5`) | Ya está ahí cuando empieza la escena |
| `until` | Cuándo empieza a irse, y tarda 0,25 s. Se escribe igual que `at` | Se queda hasta el final de la escena |
| `from` | El borde por donde se asoma y por donde se va: `"left"`, `"right"` o `"bottom"` | Salta y se encoge en su lugar |

- Necesita `avatar` en `defineVideo`, aunque sea `{}`. Una escena con su propio `avatar` lo muestra aunque no esté en `scenes`.
- Si `x` queda cerca del borde, se queda a medias, como alguien que se asoma. Los sprites tienen margen transparente, sobre todo a los lados: el busto necesita un `x` bajo para quedar cortado.
- `"bottom"` sube desde su propia base y nunca cruza los subtítulos: lo que queda por debajo de esa línea, o del borde de arriba de los subtítulos si está más arriba, no se dibuja.
- Si la palabra no se dice en la escena, si `at` cae después del final o si `until` va antes que `at`, el render se corta con un error que dice por qué.

Lo que ya existía no cambia: `avatar: {}` dibuja el busto quieto en todas las escenas, y las piezas anteriores con `shape: "bubble"` se dibujan igual.

## Reglas

- Fondo transparente, y el mismo lienzo y la misma posición en todos los sprites.
- Los nombres de archivo no cambian una vez publicados videos con ellos. Para una versión nueva, crea otra carpeta (`v2/`), cambia el manifiesto y anota en `generated.json` cómo se hizo.
- Las variantes se generan desde `base.png` con `video:image --ref` y `--chroma`, y se cambia solo la boca o los ojos.

## Por hacer

La dirección "personaje" del carrusel necesita poses y expresiones, no solo el busto. Entra a la baraja cuando `manifest.json` tenga `poses` (`packages/carousel/src/direcciones.ts`).
