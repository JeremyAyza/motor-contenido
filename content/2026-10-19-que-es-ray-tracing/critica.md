# Informe del Crítico Ciego: que-es-ray-tracing

### Paso 1 (en frío)
- **De qué trata:** Qué es el Ray Tracing, cómo funciona la analogía de la luz en reversa (de la cámara a la escena) y dónde se aplica en la industria (cine offline vs videojuegos en tiempo real).
- **Tesis en una frase:** La simulación gráfica realista no sigue los fotones como en la vida real porque colapsaría la GPU; dispara rayos en reversa desde el ojo hacia la escena y en videojuegos se combina con rasterizado híbrido para alcanzar 60 FPS.
- **Qué haría:** Enviar a amigos gamers y desarrolladores.
- **A quién se lo mandaría:** Al que cree que el ray tracing es solo marketing para vender tarjetas gráficas o que solo sirve para ver charcos con reflejos.

---

### Paso 2 (con el brief)
- **¿Coincide la tesis?** Sí, coincide con total exactitud. Ambas destacan la analogía de la luz en reversa y la diferencia fundamental entre el rasterizado y la física de rebotes.

| Punto | Peso | Puntaje | Por qué |
|---|---|---|---|
| **Gancho** | 15% | 5 | "No necesitas entender física óptica para entender Ray Tracing" desarma la complejidad técnica; la lámina 2 se entiende sola con la comparación numérica (billones de rayos vs < 0.01% que ve tu ojo). |
| **Tesis** | 15% | 5 | La tesis se expone con una metáfora didáctica directa y memorable (la cámara como emisor del rayo hacia la luz). |
| **Valor** | 15% | 5 | Desglosa los 3 efectos físicos (reflejos de fuera de cámara, sombras suaves y luz global) y el contraste técnico entre cine (10 horas/frame) y juegos (16 ms/frame). |
| **Compartible** | 10% | 5 | La lámina 8 (comparativa Cine vs Videojuegos) y la lámina 5 (los 3 efectos) son láminas resumen con alto potencial de envío y captura. |
| **Cierre y CTA** | 10% | 5 | Despedida del giro que resignifica el tema ("La magia no está en dibujar mejores gráficos...") y CTA con humor temático dirigido al amigo escéptico. |
| **Voz** | 5% | 5 | Tono directo, técnico, sin clichés ni frases de relleno, en la voz dev de Jeremy. |
| **Legibilidad en el celular** | 10% | 5 | `revision.png` confirma lectura sin esfuerzo en las 9 láminas, con títulos contrastados y textos en 18px reales. |
| **Ancla y dirección** | 10% | 5 | El logo de NVIDIA es inequívoco en miniatura (`pulgar.png`) y el recurso de la línea continua atraviesa las láminas hasta rematar en el gesto de enviar. |
| **Progresión y dominancia** | 10% | 5 | Secuencia lógica impecable: paradoja física -> analogía en reversa -> rasterizado vs ray tracing -> efectos clave -> cine -> juegos -> resumen -> cierre. |

**Promedio ponderado: 5.0 / 5.0**

### Tres observaciones destacadas:
1. La analogía del láser en reversa en la lámina 3 simplifica en una línea un concepto que suele explicarse con ecuaciones de render complejas.
2. La integración de la línea continua terminando en el gesto de enviar en la lámina 9 cumple con la regla de arte más propia y elegante de la baraja (`gesto-en-el-recurso`).
3. El caption aterriza con precisión la pérdida de FPS con RTX y engancha con la misma promesa visual de las láminas.
