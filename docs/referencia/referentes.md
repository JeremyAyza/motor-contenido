# Referentes

Fuentes no oficiales que sí pueden entrar en una pieza: benchmarks independientes y pruebas prácticas de personas con trayectoria. Sirven sobre todo para la palanca `oficial-vs-independiente` del brief: contrastar lo que dice el fabricante con lo que mide un tercero.

## Reglas

- En `facts.json` van con `"primary": false` y `"referente": "<id de esta tabla>"`, con la URL exacta de la tabla o el artículo y la fecha en que se revisó.
- En la lámina se escriben como "Según <referente>, <fecha>". Nunca se mezclan con los datos oficiales como si fueran lo mismo.
- Antes de citar un referente, abre la página y confirma que la entrada es reciente y que el modelo o la herramienta está medido. Si la última actualización tiene más de 3 meses, no sirve para un lanzamiento.
- Cita el número tal como aparece, con su unidad y su versión del benchmark (por ejemplo, "Terminal-Bench 4.0", no "Terminal-Bench").
- Lo que no esté en esta lista no entra. Para agregar uno, propónlo a Jeremy con qué mide, quién lo hace y cómo publica su metodología.

## Lista

Estado revisado el 16 de octubre de 2026.

| id | Referente | Qué mide | URL | Estado |
|---|---|---|---|---|
| `artificial-analysis` | Artificial Analysis | Índice de inteligencia (v4.3.2, 10 evaluaciones), velocidad, costo por tarea, índices de código, ciberseguridad y por industria | https://artificialanalysis.ai | Activo: changelog con entradas del 7 al 16 de octubre; metodología en `/methodology` |
| `vals` | Vals AI | 33 benchmarks por industria (legal, finanzas, salud, código); Vals Index | https://www.vals.ai/benchmarks | Activo: tablas actualizadas el 16 de octubre de 2026 |
| `epoch` | Epoch AI | Hub de benchmarks: 410 modelos, 90 benchmarks y el Epoch Capabilities Index (ECI) | https://epoch.ai/benchmarks | Activo: actualizado el 17 de octubre de 2026 |
| `metr` | METR | Horizonte de tareas (Time Horizon 1.1) y evaluaciones de riesgo | https://metr.org | Activo: última evaluación de modelo el 22 de septiembre de 2026 |
| `simon-willison` | Simon Willison | Pruebas prácticas de modelos nuevos (no es un benchmark) | https://simonwillison.net | Activo: publica casi a diario; probó Gemini 4 Argon el 13 de octubre |
| `swe-bench` | SWE-bench | Issues reales de código (Verified, Multimodal, Multilingual, Lite, Full) | https://www.swebench.com | Sin fecha visible: confirma la fecha de la entrada antes de citarla |
| `terminal-bench` | Terminal-Bench | Agentes trabajando en terminal (versión 4.0) | https://www.tbench.ai/leaderboard | Sin entradas visibles al revisar: confirma la fecha antes de citarlo |
| `lmarena` | LMArena (ahora arena.ai) | Preferencia humana en comparaciones a ciegas | https://arena.ai/leaderboard | No se pudo revisar: la página bloquea consultas automáticas; ábrela a mano |
| `aider` | Leaderboard de Aider | Edición de código en 225 ejercicios de 6 lenguajes | https://aider.chat/docs/leaderboards/ | Desactualizado (última actualización: 20 de noviembre de 2025). No usar para modelos de 2026 |

## Cómo se ve en una pieza

> Google dice que Gemini 4 Argon es el número 1 del Vals Index. Según Vals AI (16 de octubre de 2026), saca 68.90%, contra 67.04% de Claude Sonnet 5.5.

El dato oficial y el del referente aparecen juntos, cada uno con su dueño.
