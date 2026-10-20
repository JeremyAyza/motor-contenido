# assets/objetos

Objetos cotidianos para las metáforas visuales del carrusel (`<Objeto nombre="..." />`, recurso `metafora` de [skills/carrusel-taste/recursos.json](../../skills/carrusel-taste/recursos.json)).

Salen de [Fluent Emoji](https://github.com/microsoft/fluentui-emoji), de Microsoft, con licencia MIT ([LICENSE-fluent-emoji.txt](LICENSE-fluent-emoji.txt)). Solo se guardan los que se usan:

```bash
npm run carrusel:objeto -- backpack        # baja assets/objetos/backpack.svg
npm run carrusel:objeto -- backpack --3d   # la versión 3D, assets/objetos/backpack.3d.png
npm run carrusel:objeto -- light           # si no hay uno con ese nombre exacto, lista los parecidos
```

Los nombres son los del repositorio, en inglés. El estilo `color` es vectorial y sirve a cualquier tamaño. El `3d` es un PNG de 256 px, así que se ve nítido hasta unos 128 px de diseño.

Los emojis con logos o marcas registradas no están en el repositorio, y aquí tampoco se dibujan ni se imitan logos (AGENTS.md, regla 6).
