# Propuesta: los Reels de @jacket.dev

Del 20 de octubre de 2026. Sale del [análisis de @rick.theengineer](analisis-rick-theengineer.md): 36 Reels con vistas y 19 leídos. Espera la aprobación de Jeremy.

## La idea

**Un segundo por dentro, en español.** Cada Reel toma algo que un dev hace todos los días, como un `git push`, abrir una web o mandarle un mensaje a Claude, y muestra todo lo que pasa adentro. Pasa dentro de interfaces reales, sigue a un personaje, se arma por capítulos y termina con una frase para recordar.

Es lo que separa los mejores videos del referente, de 5.9x a 7.1x su mediana, de sus videos normales.

## Qué tomamos y cómo lo hacemos nuestro

| Lo que hace el referente | Cómo va en jacket.dev | Estado |
|---|---|---|
| Ganchos de "un segundo por dentro" y de "la causa no es la que crees" | Dos fórmulas nuevas en `ganchos-es.json`, con ejemplos en español. Hoy `hookscore` no las ve, y conviene saberlo antes de la puerta A | Por hacer |
| Una historia con personaje (Lena manda la foto de su gato a Tokio) | Un personaje inventado por video, con un nombre y una tarea concreta: "Valeria hace `git push` antes de irse". Nunca una persona real | Por hacer, es del guion |
| Lo que se planta al principio se paga al final | La escena 1 deja algo pendiente y el cierre lo resuelve. `beats_es` ya avisa cuando el final no vuelve al gancho | Regla de guion |
| Una frase para recordar al final | El cierre lleva una frase de dos partes, antes del CTA | Regla de guion |
| Interfaces como escenario y HUD de capítulos | El kit de escenario, la barra de capítulos y los subtítulos en píldora | Hecho |
| Un mundo por tema (Windows 98 para Active Directory) | Mundos en la baraja. Además de los de época, metáforas de la vida diaria que cualquiera reconoce: la fila del banco para una cola de mensajes, el taxímetro para los tokens | Paso 3 del plan |
| Escenario que sigue y cámara | El mismo escenario entre escenas, con acercamientos | Paso 4 del plan |
| "Todo lo que ves es real" | El agente corre los comandos de verdad y guarda la salida con su fecha. Jeremy no tiene que probar nada | Por hacer (`video:capture`) |
| El presentador | Tu avatar, de tu ilustración | Fase 4 |
| Fechar lo que cambia | "Precios al 20 de octubre de 2026", como ya hacen los carruseles | Ya se hace |

## Lo que no tomamos

- **El personaje con derechos.** Rick es de Adult Swim. Nuestra cara es la tuya, ilustrada.
- **Copiar apps de marcas.** Las interfaces son nuestras, con el logo oficial solo para identificar.
- **Dos pedidos al final.** Va un solo CTA, guardar o enviar.
- **Repetir un tema en pocos días.** Al referente le costó 10 veces menos vistas.
- **Uno por día.** Con las dos puertas, lo sostenible son 3 Reels por semana, al lado de los carruseles.

## El formato de prueba

- **Duración: de 75 a 100 s.** Queda entre nuestros 45 a 60 s y sus 130 a 175 s, y se decide con datos. Necesita que el aviso de duración dependa del formato, en vez de cambiar la regla para todos.
- **Estructura:** el gancho (el gesto y la promesa), de 5 a 7 capítulos, la frase para recordar y el CTA.
- **Visual:** un escenario que se queda (el navegador, la terminal o el teléfono), el mundo de la dirección y el HUD.
- **Texto del post:** el gancho, la lista numerada con los datos, la fecha, las fuentes y un CTA.

## Los primeros 6 temas

Cada dato sale de `facts.json`. Donde dice "real", el agente lo corre y guarda la salida con la fecha.

| Gancho | Forma | Mundo y escenario | Lo real |
|---|---|---|---|
| "Tu `git push` tarda un segundo. Esto es todo lo que pasa en ese segundo." | Un segundo por dentro | Terminal y la tarjeta de GitHub | La salida de un push a un repo de prueba |
| "Escribes una URL y en menos de un segundo pasan cinco cosas." | Un segundo por dentro | La barra del navegador; DNS, TCP, TLS y HTTP como capítulos | Los tiempos de `curl -w` contra un sitio público |
| "Cada mensaje que le mandas a Claude vuelve a enviar toda la conversación." | La causa no es la que crees | El chat y el taxímetro de tokens | El conteo de tokens de la API mientras crece la charla |
| "Claude no se olvida de tu proyecto: nunca lo recordó." | La causa no es la que crees | La terminal y `CLAUDE.md` | Reusa los datos del carrusel de los 3 comandos |
| "Iniciar sesión con Google no le da tu contraseña a nadie." | La causa no es la que crees | El teléfono y el navegador, con el ida y vuelta de OAuth | El flujo con sus URLs, en un proyecto de prueba |
| "`npm install` no baja tu proyecto: baja cientos de proyectos ajenos." | La causa no es la que crees | La terminal y un árbol de dependencias | El conteo de paquetes de un proyecto de prueba |

## Cambios al motor, en orden

1. **Las dos fórmulas** en `ganchos-es.json`, con sus patrones en español, para que `swipe_es` las clasifique.
2. **Formato largo:** `format: "explicado"` en `video.json`, con su rango de duración (de 75 a 100 s en la prueba) en la puerta A y en el inspector.
3. **`video:capture`:** corre comandos en una carpeta aislada y guarda la salida y la fecha en `facts.json`, para que `Terminal` muestre salidas reales y el texto del post pueda decir que todo corrió de verdad.
4. **Aviso de tema repetido:** `video:script` avisa si el tema salió en los últimos 14 días.
5. **Mundos, escenario continuo y cámara:** los pasos 3 y 4 del plan del referente.
6. **El avatar:** la fase 4.

Los pasos 1 a 4 son chicos y alcanzan para el primer video del formato. El 5 y el 6 son los grandes.

## Cómo se mide

- Los primeros 3 Reels del formato contra los 3 que ya están aprobados, en `video-metrics.json`: compartidos por alcance, segundos vistos y porcentaje que se ve completo.
- Si Instagram lo permite, como Reels de prueba (trial), que se muestran primero a quienes no te siguen.
- Nada se concluye antes de 15 Reels, como dice [workflows/metricas.md](../workflows/metricas.md).

## Lo que hace falta de Jeremy

- El sí al formato y a la duración de prueba.
- El primer tema de la lista.
- La cadencia: 3 por semana.
- Tu ilustración, para el avatar.
