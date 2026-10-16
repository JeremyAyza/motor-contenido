# Flujo: carrusel

Produce un carrusel de Instagram de 4 a 10 láminas a partir de un pedido de una línea, por ejemplo: "Genera un carrusel sobre los mods de Claude Code". Cualquier agente puede seguir estos pasos.

## 1. Crear la carpeta de la pieza

`content/AAAA-MM-DD-tema-en-kebab/`

## 2. Investigar y escribir `facts.json`

- Busca la documentación oficial, el changelog o el anuncio. Las fuentes secundarias solo sirven para encontrar las primarias.
- Cada hecho lleva `claim`, `source`, `primary` (true o false) y, si aplica, `note`.
- Lo que no puedas verificar va a `pendingToVerify`, no a la pieza.
- Ejemplo: `content/2026-10-16-mods-claude-code/facts.json`.

## 3. Elegir el formato

| Formato | Cuándo | Láminas típicas |
|---|---|---|
| Chuleta | comandos, atajos, prompts para copiar | cover, list, list, closing |
| Comparativa | la misma tarea en varias herramientas | cover, concept, list, closing |
| Paso a paso | de cero a algo funcionando | cover, steps, steps, closing |
| Explicador | un concepto nuevo y cómo usarlo | cover, concept, list, steps, closing |

## 4. Escribir `carousel.json`

Debe cumplir `schemas/carousel.schema.json`. Tipos de lámina: `cover`, `concept`, `list`, `steps`, `closing`.

Reglas editoriales (la validación revisa las que puede):

1. **Portada:** promesa concreta, 8 palabras como máximo; `highlight` es un fragmento literal del título.
2. **Lámina 2:** entrega valor de inmediato, sin introducción.
3. **Una idea por lámina,** 45 palabras o menos (60 es el límite duro).
4. **Última lámina:** advertencia o resumen, más el llamado a guardar y una pregunta.
5. **`caption`:** mini artículo numerado, con la fecha de la información y la fuente, que cierra con pregunta y "guárdalo".
6. **`slideCaptions`:** un texto corto por lámina, con palabras clave.
7. **`infoDate`:** la fecha a la que corresponde la información.

## 5. Validar

```bash
npm run carrusel:validar -- content/<pieza>/carousel.json
```

Corrige todos los errores. Reporta los avisos a la persona.

## 6. Puerta humana

Muestra a la persona `facts.json` y el texto de cada lámina. No sigas sin su aprobación.

## 7. Renderizar y revisar

```bash
npm run carrusel:render -- content/<pieza>/carousel.json
```

Genera `out/01.png` … `out/NN.png`, `out/revision.png` (todas las láminas juntas), `out/texto-del-post.txt` y `out/textos-por-lamina.txt`. El render falla si un texto se sale de su caja. Revisa `revision.png` como si fuera un celular: si algo no se lee, acorta el texto, no achiques la letra.
