# Flujo: métricas y aprendizajes

La única fuente honesta de lo que funciona para esta cuenta son sus propias piezas. Adapta [`ig-audit`](../.agents/skills/ig-audit/SKILL.md); lee esa skill para el criterio completo.

## Después de publicar

1. **A las 48 horas y a los 7 días**, Jeremy le pasa al agente la captura de Instagram Insights de la pieza.
2. El agente la transcribe en `content/<pieza>/metricas.json` ([esquema](../schemas/metricas.schema.json)):

```json
{
  "publicado": "2026-10-20T19:00:00-05:00",
  "etiquetas": { "formato": "comparativa", "formulaGancho": 17, "direccion": "antes-despues", "laminas": 7, "cta": "enviar" },
  "cortes": [
    { "dia": 2, "alcance": 0, "alcanceNoSeguidores": 0, "guardados": 0, "compartidos": 0, "comentarios": 0, "meGusta": 0, "visitasPerfil": 0, "seguidores": 0 },
    { "dia": 7, "alcance": 0, "alcanceNoSeguidores": 0, "guardados": 0, "compartidos": 0, "comentarios": 0, "meGusta": 0, "visitasPerfil": 0, "seguidores": 0 }
  ]
}
```

   Las etiquetas salen de `brief.json` (formato, fórmula del gancho elegido, CTA) y de `post.json` (dirección, número de láminas). Si Instagram cambió el nombre de una métrica, anótalo en `notas` y usa el campo más parecido.
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

## Una vez al mes: la revisión

1. Pon lado a lado las 5 mejores piezas y las 5 peores por compartidos por alcance.
2. Busca qué las separa, en este orden: fórmula del gancho, formato, tema, número de láminas, dirección de arte, tipo de CTA y, al final y solo si nada más explica la diferencia, día y hora.
3. Escribe la conclusión en [docs/aprendizajes.md](../docs/aprendizajes.md) como una afirmación con su evidencia y el tamaño de la muestra. El radar (workflows/radar.md) lo lee antes de proponer temas.
4. Con menos de 15 piezas no hay conclusiones: dilo en lugar de inventar un patrón.
5. Recalibra al crítico ciego con las piezas publicadas (docs/critico-ciego.md).

## El contador de láminas

`post.json → art.contador: true` muestra n/N en el pie de las láminas interiores. `ig-carousel` dice que ver el final hace que más gente llegue; no está probado para esta cuenta. Se decide aquí: después de 10 piezas con contador y 10 sin, compara los compartidos por alcance.
