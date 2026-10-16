# Avatar

Sprites del personaje original que aparece en los videos (y, si conviene, en los carruseles). Es un personaje propio: nunca uses personajes con derechos de autor.

## Qué va aquí

```
assets/avatar/
├─ manifest.json          qué archivo es cada pose, expresión y boca
├─ poses/                 cuerpo completo o medio cuerpo, sin boca (PNG o SVG con fondo transparente)
├─ expressions/           ojos y cejas por emoción
└─ mouths/                una imagen por forma de boca
```

## Formas de boca

Para la sincronía labial se usan las 9 formas de [Rhubarb Lip Sync](https://github.com/DanielSWolf/rhubarb-lip-sync), que calcula los tiempos de cada boca a partir del audio:

| Clave | Sonido aproximado |
|---|---|
| A | m, b, p (labios cerrados) |
| B | la mayoría de consonantes, i |
| C | e |
| D | a |
| E | o |
| F | u |
| G | f, v |
| H | l |
| X | reposo |

## Reglas

- Todas las imágenes comparten tamaño de lienzo y punto de anclaje, para que boca y ojos calcen sin ajustes.
- Fondo transparente.
- Los nombres de archivo no cambian una vez publicados videos con ellos; para una versión nueva, crea otra carpeta (`v2/`) y actualiza el manifiesto.

`manifest.example.json` muestra la estructura; renómbralo a `manifest.json` cuando estén los sprites reales.
