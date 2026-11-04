# Análisis: qué hacen los Reels que crecen (22 de octubre de 2026)

Sigue al [análisis de @rick.theengineer](analisis-rick-theengineer.md) del 20 de octubre. Esta vez se leyeron los 6 Reels que eligió Jeremy, el perfil de Rick, 4 cuentas más y los Reels de @jacket.dev, con las skills `ig-viral` (swipe con múltiplo sobre la mediana), `ig-reel` (puntaje de ganchos) e `ig-profile` (rúbrica del perfil).

Es un análisis, no una regla: lo que se decidió a partir de él está en [docs/reel.md](../reel.md), "Decisiones vigentes de Jeremy".

## Cómo se leyó

- **Vistas y mediana:** en la pestaña de Reels de cada perfil, desde el Chrome de Jeremy con su sesión (él lo ofreció). La mediana es la de las últimas 12 publicaciones de esa pestaña.
- **Cuadros:** en el reproductor incrustado de Instagram (`/reel/<id>/embed/`), que no pide sesión y deja ir a cualquier segundo. Se vieron de 8 a 12 cuadros por Reel y, en uno, un cuadro cada 1,5 s.
- **Gancho dicho:** transcrito de los subtítulos de los primeros 3 s. Donde no se transcribió, va la primera línea del texto del post.
- A ritmo humano, sin scraping, sin escribir nada en Instagram. Los datos están en [swipe/2026-10-22-reels-referentes.tsv](../swipe/2026-10-22-reels-referentes.tsv).

**Cuánto vale.** Son 21 Reels de 6 cuentas. Lo que se repite en los 6 Reels elegidos (un mundo que dura, cambio constante, personaje) es un hallazgo de forma. Los múltiplos por fórmula de gancho no alcanzan para afirmar nada: hay un caso por fórmula.

## 1. Los números

| Cuenta | Seguidores | Publicaciones | Mediana (12) | Qué la mueve |
|---|---|---|---|---|
| @rick.theengineer | 516 mil | 150 | 283 mil | Explicadores de 130 a 175 s con Rick. Bio: los hace con brainrotshorts.com |
| @peterstewiestartup | 85,1 mil | 191 | 21,2 mil | El mismo estilo y la misma herramienta, sobre startups |
| @resultaaquee | 61,9 mil | **17** | 331 mil | Curiosidades en español con mundos 3D. Vende su herramienta en la bio |
| @sebastiankra.ia | 25,7 mil | 72 | 6,2 mil | IA en español, pixel art con su avatar |
| @valentinpanizza | 4.850 | 45 | 3,3 mil | IA para negocios: su cara abajo y una animación arriba |
| @jacket.dev | 12 | 14 | 194 | Nuestra cuenta |

Lo que dijo Jeremy se confirma: Rick tiene 150 publicaciones y 516 mil seguidores. En 33 semanas son unas 4,5 publicaciones por semana. resultaaquee pasó los 60 mil con 17.

### Los 6 Reels elegidos

| Reel | Cuenta | Duración | Vistas | Múltiplo | Mundo |
|---|---|---|---|---|---|
| [System design](https://www.instagram.com/reel/DdrHAI1MrFb/) | Rick | 156 s | No se ven (24 de septiembre, 62 mil me gusta) | | Un plano técnico que crece de 1 servidor al sistema completo |
| [La oficina de IA](https://www.instagram.com/reel/DeppU5yAKFn/) | sebastiankra.ia | 42 s | 11,5 mil | 1,9x | Un edificio de 6 pisos con robots, en pixel art |
| [Uber](https://www.instagram.com/p/DeyVt-wo29O/) | resultaaquee | 62 s | 516 mil | 1,6x | Una ciudad 3D: la cámara baja a la calle y sube a ver toda la ciudad |
| [Mods de Claude Code](https://www.instagram.com/p/DeXeLq-vPkG/) | sebastiankra.ia | 55 s | No se ven (13 mil me gusta, 7.516 comentarios por el "Comenta IA") | | Un escenario oscuro, con su avatar y el monitor de Claude Code |
| [Gestores de redes](https://www.instagram.com/p/DeXqCL3sLgG/) | valentinpanizza | 28 s | 4.009 | 1,2x | Su cara abajo y pixel art arriba |
| [Stack de $0](https://www.instagram.com/reel/DeHYCIpColc/) | peterstewiestartup | 143 s | 192 mil | **9,1x** | Una pila de 5 capas con logos e interfaces de ejemplo |

El de mods es el mismo tema del carrusel de mods de jacket.dev. El de valentinpanizza no se despegó de su cuenta: sirve por el formato, no por el resultado.

### Lo que más se despegó (swipe_es)

| Múltiplo | Cuenta | Gancho |
|---|---|---|
| 21,3x | valentinpanizza | "No uses Claude Code si no instalaste estos 5 plugins." |
| 10,6x | resultaaquee (3,5 M) | "… del teclado de tu iPhone es más pequeña que tu pulgar. Y aun así aciertas casi siempre." |
| 9,1x | peterstewiestartup | "Here are five tools you can use to ship your startup for $0 a month." |
| 6,5x | peterstewiestartup | "Alex's co-founder quit after six months… and still owns 50% of the company." |
| 5,3x | sebastiankra.ia | "Tu IA no es tonta. Tiene memoria de pez." |
| 3,5x | sebastiankra.ia | "Tu IA no lee letras. Lee fichas." |

- **Una forma nueva:** "Tu IA no es tonta. Tiene memoria de pez." y "Tu IA no lee letras. Lee fichas." son la misma: niegan lo obvio y lo cambian por una metáfora. `hookscore` les da 82 y 84, el puntaje más alto del lote, pero ninguna fórmula de `ganchos-es.json` las clasifica. Son 2 casos de una sola cuenta: candidata a fórmula 30, no fórmula todavía.
- **El del teclado** es un "un segundo por dentro" (fórmula 28): un gesto de todos los días y lo que pasa adentro. El "…" lo clasifica mal como "Mid-Sentence Start". Es la misma forma que dio los mejores de Rick, y en español llegó a 3,5 M.
- **El de Uber** es "la causa no es la que crees" (fórmula 29) en forma de pregunta.

### El mismo tema, el mismo día

Rick publicó hoy su Reel de PHP2Shell: 640 mil vistas en horas (2,3x, todavía crece). El nuestro, de la misma vulnerabilidad, tiene 152 vistas (0,8x de nuestra mediana). Con 12 seguidores, las vistas no se pueden comparar. **La forma sí.**

| | Rick | jacket.dev |
|---|---|---|
| Gancho | "PHP is facing one of its most serious…" (texto: "Not a plugin. Not your messy code. The runtime itself.") | "Todos dicen que PHP murió: es tu error." La noticia llega en la escena 2 |
| Primer cuadro | Un monitor CRT que dice PHP y después "SECURITY ALERT" | Un título de 44 px y una tarjeta con "~70%" |
| Mundo | Un edificio de 3 pisos en corte (tu app, el runtime de PHP, el servidor). La grieta está en el del medio y la cámara entra a la memoria | 6 láminas con título y tarjetas |
| Texto en pantalla | Rótulos de 1 a 3 palabras y subtítulos | Títulos, tarjetas con párrafos de 12 a 13 px, chips y subtítulos |
| Versiones parcheadas | 4 disquetes con 8.5.12, 8.4.27, 8.3.36 y 8.2.35 | Una tabla |
| Personaje | Rick entra a los 25 s | No hay |

La hoja de nuestro Reel está en `content/2026-10-21-php-vulnerabilidad-rce/out/video-hoja.png`, fuera de git: 6 láminas oscuras con un título arriba y tarjetas debajo.

## 2. Lo que se repite en los que funcionan

1. **Un solo mundo que dura todo el video.** El edificio de 3 pisos, la ciudad, el edificio de oficinas, la pila de capas, el plano que crece. No es una lámina por idea: es un objeto que cambia de estado.
2. **El cuadro cambia cada 1 a 2 s, sin cortar.** En el de system design, entre 30 y 41 s cambia algo cada 1,5 s sobre el mismo plano: un servidor nuevo, una alerta roja, el balanceador, la nota del costado. Nuestro inspector deja 4 s quieto, y el de PHP tuvo 10 tramos quietos de 4,5 a 11,5 s.
3. **El primer cuadro es un objeto, no un título.** El monitor con PHP, una tecla del iPhone en macro, la calle con dos autos y sus distancias, la batería del límite que baja de 100% a 90%. Nuestros 6 Reels abren con un título.
4. **Casi nada para leer fuera de los subtítulos.** Rótulos cortos (YOUR APP, PHP RUNTIME, SERVER) y una sola frase: la que se dice.
5. **Un medidor que acompaña todo el video.** Los usuarios que crecen de 1 a 50 millones, la cuenta del mes en $0.00, la batería del límite, una barra de avance con la mascota, 5 casillas con "?" que se llenan (1/5). Es lo que está en juego y se ve avanzar.
6. **Un personaje.** Rick, Stewie, el avatar pixelado de Sebastián, "Tú" y "Lucía" en la ciudad, la cara de Valentin. Los 6 tienen uno.
7. **La escala.** "Y eso con dos personas", y la cámara se aleja hasta la ciudad entera con todos los autos. De 1 usuario a 50 millones.
8. **Un cierre que se captura.** Rick cierra con la tabla "qué problema obligó a agregar cada pieza" y el ciclo "empieza simple, busca el cuello de botella, arregla lo mínimo, repite". Peter, con la pila de 5 capas y sus logos.
9. **Temas que todos tocan.** El teclado del iPhone (3,5 M), WhatsApp (597 mil) y Uber (516 mil). Los temas de nicho, como Claude Code, rinden lo que rinde una cuenta de nicho: sebastiankra.ia tiene 6,2 mil de mediana con 25,7 mil seguidores.
10. **Salen de una tubería automática**, como la nuestra. Rick y Peter lo dicen en la bio. La diferencia no es que haya un editor humano: es el modelo visual.

