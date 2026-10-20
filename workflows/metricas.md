# Flujo: métricas y aprendizajes

La única fuente honesta de lo que funciona para esta cuenta son sus propias piezas. Adapta [`ig-audit`](../.agents/skills/ig-audit/SKILL.md); lee esa skill para el criterio completo.

## Después de publicar

1. **A las 48 horas y a los 7 días**, Jeremy le pasa al agente la captura de Instagram Insights de la pieza.
2. El agente la transcribe en `content/<pieza>/metricas.json` ([esquema](../schemas/metricas.schema.json)):

```json
{
  "publicado": "2026-10-20T19:00:00-05:00",
  "etiquetas": { "formato": "comparativa", "formulaGancho": 17, "direccion": "antes-despues", "laminas": 7, "cta": "enviar", "animadas": 1 },
  "cortes": [
    { "dia": 2, "alcance": 0, "alcanceNoSeguidores": 0, "guardados": 0, "compartidos": 0, "comentarios": 0, "meGusta": 0, "visitasPerfil": 0, "seguidores": 0 },
    { "dia": 7, "alcance": 0, "alcanceNoSeguidores": 0, "guardados": 0, "compartidos": 0, "comentarios": 0, "meGusta": 0, "visitasPerfil": 0, "seguidores": 0 }
  ]
}
```

   Las etiquetas salen de `brief.json` (formato, fórmula del gancho elegido, CTA) y de `post.json` (dirección, número de láminas). `animadas` es cuántas láminas salieron como video (`out/NN.mp4`): es el experimento de movimiento, y se decide con estos números. Si Instagram cambió el nombre de una métrica, anótalo en `notas` y usa el campo más parecido.
3. `npm run carrusel:metricas` regenera [docs/metricas.md](../docs/metricas.md).

Más adelante se puede leer Insights con la API de Instagram para cuentas profesionales (solo lectura: necesita una app de Meta y un token). No publica nada ni envía DMs, así que no choca con la regla de no automatizar mensajes.

## Qué mirar

| Métrica | Cómo | Qué dice |
|---|---|---|
| Compartidos por alcance | compartidos / alcance | La señal más fuerte: alguien puso su nombre para mandarlo |
| Guardados por alcance | guardados / alcance | Si sirve para volver a él |
| Seguidores por alcance | seguidores / alcance | Si el perfil convierte la atención |
| Múltiplo sobre la mediana | alcance / mediana de alcance de la cuenta | Si fue un éxito real o un día normal |
| Alcance de no seguidores | porcentaje de Insights | Si salió de la burbuja |

Alcance alto con pocos seguidores es un problema del perfil (bio, portadas fijadas), no del carrusel: no reescribas ganchos por eso. Poco alcance es un problema del gancho.

## Reels

Los Reels van aparte, en `content/<pieza>/video-metrics.json` ([esquema](../schemas/video-metrics.schema.json)), porque una pieza puede tener carrusel y Reel. `npm run video:metrics` regenera [docs/metricas-video.md](../docs/metricas-video.md); los pasos están en [workflows/video.md](video.md).

Insights cambió en 2025 y 2026, así que se anotan estos nombres:
- **Vistas** (`views`): cada vez que el Reel aparece en pantalla, con las repeticiones. Reemplazó a las reproducciones en abril de 2025.
- **Tiempo de reproducción** (`watchTimeSeconds`) y **tiempo de reproducción promedio** (`avgWatchSeconds`).
- **Tasa de saltos** (`skipRate`): el porcentaje de quienes deslizaron para irse. Llegó en 2026, y todavía no aparece en los Trial Reels ni en las colaboraciones.

Además de las métricas del carrusel (compartidos, guardados y seguidores por alcance, múltiplo sobre la mediana y alcance de no seguidores), en un Reel se miran dos más:

| Métrica | Cómo | Qué dice |
|---|---|---|
| Tasa de saltos | la de Insights | Si el gancho funcionó: el primer cuadro y la primera frase. Es la nota del gancho |
| Visto | tiempo promedio / duración | Si el medio sostuvo. Pocos saltos con poco visto es un video que se cae después del gancho |

Los Trial Reels se muestran primero a quien no sigue la cuenta: se comparan entre ellos, no con los demás. En la revisión mensual, agrupa también por duración (menos de 30 s, de 30 a 60 s y más de 60 s).

## Una vez al mes: la revisión

1. Pon lado a lado las 5 mejores piezas y las 5 peores por compartidos por alcance.
2. Busca qué las separa, en este orden: fórmula del gancho, formato, tema, número de láminas, dirección de arte, tipo de CTA y, al final y solo si nada más explica la diferencia, día y hora.
3. Escribe la conclusión en [docs/aprendizajes.md](../docs/aprendizajes.md) como una afirmación con su evidencia y el tamaño de la muestra. El radar (workflows/radar.md) lo lee antes de proponer temas.
4. Con menos de 15 piezas no hay conclusiones: dilo en lugar de inventar un patrón.
5. Recalibra al crítico ciego con las piezas publicadas (docs/critico-ciego.md).

## El contador de láminas

`post.json → art.contador: true` muestra n/N en el pie de las láminas interiores. `ig-carousel` dice que ver el final hace que más gente llegue; no está probado para esta cuenta. Se decide aquí: después de 10 piezas con contador y 10 sin, compara los compartidos por alcance.
