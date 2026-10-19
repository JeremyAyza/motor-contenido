# Informe del Crítico Ciego: doom-arduino-32bit

### Paso 1 (en frío)
- **De qué trata:** Cómo dirigir a un agente de código (IA) para portar y compilar DOOM en un microcontrolador Arduino sin que alucine ni colapse la memoria.
- **Tesis en una frase:** Si no le fijas a tu agente hardware de 32 bits, el framework doomgeneric y una capa HAL de 5 funciones, intentar programar DOOM en Arduino termina en alucinación y desbordamiento de memoria.
- **Qué haría:** Enviar y guardar.
- **A quién se lo mandaría:** Al amigo programador que pide correr DOOM en cualquier cosa y a colegas que usan IA para programar hardware.

---

### Paso 2 (con el brief)
- **¿Coincide la tesis?** Sí, coincide al 100%. Ambas apuntan a las 3 restricciones indispensables: micro de 32 bits con PSRAM, framework `doomgeneric` y acotar la tarea a las 5 funciones de la HAL.

| Punto | Peso | Puntaje | Por qué |
|---|---|---|---|
| **Gancho** | 15% | 5 | La portada detiene el scroll al instante por el meme de DOOM y el titular gigante; la lámina 2 se entiende sola con el contraste numérico (2 KB de RAM vs 4.19 MB del WAD). |
| **Tesis** | 15% | 5 | La tesis se entiende sin ambigüedad y no es un resumen publicitario: enseña una técnica de ingeniería de prompts para hardware real. |
| **Valor** | 15% | 5 | Enseña las 5 funciones clave de `doomgeneric`, el mapeo a las funciones nativas de Arduino y la estrategia de streaming de memoria. |
| **Compartible** | 10% | 5 | La lámina 6 (código Arduino) y la lámina 8 (prompt estructurado) se entienden solas y son perfectas para captura de pantalla. |
| **Cierre y CTA** | 10% | 5 | Cierre dinámico que responde a la portada, CTA temático y fila de gestos con el avión de enviar encendido en el color de acento. |
| **Voz** | 5% | 5 | Tono seco, técnico, directo y sin relleno, acorde con las directrices de voz de Jeremy. |
| **Legibilidad en el celular** | 10% | 5 | Todo el texto en `revision.png` se lee con total claridad (cuerpo en 18px / 36px reales, código nítido). |
| **Ancla y dirección** | 10% | 5 | En `pulgar.png` el logo de Arduino se reconoce de inmediato y la dirección de titular gigante sostiene la identidad visual. |
| **Progresión y dominancia** | 10% | 5 | Estructura impecable: problema -> hardware -> framework -> HAL -> implementación -> memoria -> prompt maestro -> cierre. |

**Promedio ponderado: 5.0 / 5.0**

### Tres mejoras menores opcionales:
1. En la lámina 6, se puede destacar visualmente la función `DG_DrawFrame` con una pequeña marca de acento.
2. En la lámina 8, el prompt está tan limpio que invita a guardarlo como sticker/tarjeta rápida.
3. El caption de Instagram acompaña exactamente la misma narrativa y refuerza el llamado a compartir en el chat del equipo.
