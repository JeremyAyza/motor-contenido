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

La pieza decide dónde va: `size`, `top`, `scenes` y `shape: "bubble"` con `bubbleCrop`. Si una pieza trae otros sprites (`base`, `mouths` o `blink`, relativos a su carpeta), esos reemplazan a los de la cuenta campo por campo.

## Reglas

- Fondo transparente, y el mismo lienzo y la misma posición en todos los sprites.
- Los nombres de archivo no cambian una vez publicados videos con ellos. Para una versión nueva, crea otra carpeta (`v2/`), cambia el manifiesto y anota en `generated.json` cómo se hizo.
- Las variantes se generan desde `base.png` con `video:image --ref` y `--chroma`, y se cambia solo la boca o los ojos.

## Por hacer

La dirección "personaje" del carrusel necesita poses y expresiones, no solo el busto. Entra a la baraja cuando `manifest.json` tenga `poses` (`packages/carousel/src/direcciones.ts`).
