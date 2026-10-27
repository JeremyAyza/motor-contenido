# Informe del crítico ciego: mcp-vs-acp

Cómo lo vi: no pude oír el video. Miré las 12 tiras en orden con `transcripcion.md` al lado, después `hoja.png`, `grilla.png` y `texto-del-post.txt`. Para revisar el gancho, el final y los 10 cambios de escena saqué cuadros de `video.mp4` a 4 y 5 cuadros por segundo. Del audio solo medí el nivel: −14.1 LUFS integrado, sin silencios largos, y la voz entra a los 0.3 s.

No juzgo dos decisiones fijas de la cuenta: que el render ya no lleva la interfaz de Instagram encima, y que el diseño use todo el lienzo dentro del margen de 36 px.

```
Paso 1 (en frío)
- De qué trata: la diferencia entre MCP y ACP. MCP conecta al agente con sus herramientas (GitHub, una base de datos, Slack). ACP lo conecta con el editor donde lo usas (Zed, JetBrains, Neovim). Después muestra cómo va una sesión de ACP (initialize, session/prompt, session/update, permiso) y quién lo soporta.
- Tesis en una frase: MCP y ACP no compiten. MCP conecta tu agente con sus herramientas y ACP con tu editor, y ACP hace con los agentes lo que LSP hizo con los lenguajes: una integración en vez de una por agente.
- Me habría ido en: 0:13. El gancho dice que me falta ACP, y lo que sigue es "Primero, ¿qué es un protocolo?", JSON-RPC y la historia de MCP, cosas que el gancho da por sabidas: 32 s de repaso (0:13-0:45). ACP recién aparece como problema en 0:45 y con su nombre en 0:55. Si me quedo, me iría por segunda vez en 1:48: de 1:39 a 2:12 son tres escenas seguidas de listas de nombres y fechas.
- Qué haría al final: guardarlo (lo vería otra vez antes de probar ACP en el editor).
- A quién se lo mandaría: a un compañero que usa Claude Code o Codex en la terminal y quiere el diff en su editor, o a alguien que confunde MCP con ACP. El diagrama de 0:10 se lo explica sin el resto del video.

Paso 2 (con el brief)
- ¿Coincide la tesis? No hay brief ("Sin brief"), así que no se puede comparar. La tesis que entendí es la misma en el gancho (0:00-0:12), en el cierre (2:12-2:22) y en el texto del post ("MCP: el agente con sus herramientas. ACP: el agente con tu editor."). No hay contradicción interna, así que no cae por la regla de la tesis.

| Punto | Peso | Puntaje | Por qué |
|---|---|---|---|
| Gancho | 15% | 4 | "Tu agente usa MCP. Le falta ACP." detiene a alguien que ya usa agentes, y "Tu agente necesita dos" se lee desde el cuadro 1. Pero en el cuadro 1 (tira-01, cuadro 1, y grilla.png) MCP y ACP están a un ~30% de opacidad, los íconos en gris y la terminal a medio escribir ("¿qué diferencia hay ent▌"). "MCP · HERRAMIENTAS" se enciende en 1.6 s y "ACP · TU EDITOR" en 3.6-4.0 s, así que sin sonido el "dos" se entiende pasados los 3 s. |
| Tesis | 15% | 4 | Clara y repetida al principio y al final. Lo que más pesa es la idea útil (el diff con Aceptar/Rechazar en tu editor, 0:45-0:55), pero el centro se apoya en la definición oficial ("Estandariza cómo un editor habla con un agente", 0:59), que suena a comunicado. |
| Valor | 15% | 4 | Te llevas la distinción, la analogía con LSP (1:03), el argumento de 3 integraciones contra 1 (1:07-1:22) y los mensajes de una sesión (1:22-1:38). De 1:39 a 2:12 casi todo es inventario del ecosistema (licencia, fechas, 48/21, alianzas): no se puede usar. |
| Retención | 10% | 2 | Algo cambia en pantalla con cada idea, cada 2 s, y eso está bien. Pero dura 2:22, tiene 32 s de repaso antes de lo nuevo (0:13-0:45) y 33 s de listas al final (1:39-2:12) que repiten cosas: el adaptador de Claude sale en 1:39 y otra vez en 1:58, y JetBrains/IntelliJ en 1:44 y otra vez en 2:03. No termina antes de cansar. |
| Compartible | 10% | 4 | El diagrama de 0:10 (MCP a herramientas arriba, ACP a editores abajo) y el de 1:14-1:22 (3 integraciones contra 1) se entienden solos y se mandan por DM. "Como hizo LSP con los lenguajes" es la frase. |
| Cierre y CTA | 10% | 4 | Vuelve al diagrama del gancho, resume la tesis en dos frases y pide una sola acción del tema (qué agente meterías con ACP), así que el loop sale natural. Le falta un poco: la píldora dice "¿QUÉ AGENTE USARÍAS?" (2:16-2:22) mientras la voz dice "qué agente meterías en tu editor con ACP". |
| Voz y guion | 5% | 3 | Casi todo son frases cortas a un ritmo normal (unas 2.3 palabras por segundo), pero hay tramos de ficha técnica: "Lo creó Zed en agosto de 2025, con licencia Apache" (0:55), las siglas desarrolladas en 0:26 y 0:55, y "JetBrains lo desarrolla junto a Zed desde octubre de 2025" (2:03). En 1:39-1:47 hay un salto lógico: que el adaptador de Claude use el SDK oficial no es la razón de que IntelliJ traiga Codex y Junie ("Por eso…"). No oí la voz: no puedo juzgar tropiezos. |
| Legibilidad en el celular | 10% | 4 | Los subtítulos (en una píldora oscura, ~45 px de alto en 1080) y los títulos se leen bien, y el código de las tarjetas (28-32 px) también. Se pierden las etiquetas secundarias en gris de ~22 px que sí explican algo: "la versión / qué hacer / los datos / empareja la respuesta" (0:20-0:26), "el agente real, por detrás" (1:42) y "allow_once · reject_once" (1:36). |
| Recurso visual y composición | 10% | 4 | Cada idea tiene su dibujo antes o junto con la voz: el mensaje ilegible "?? 0x7f…" que se vuelve "✓ result / SE ENTIENDEN" (0:16-0:26), "integraciones a mano" contra el estándar (0:34-0:44), la terminal contra el editor con el diff (0:46-0:54), 3 líneas que se vuelven una (1:12-1:22), el bus "DE FÁBRICA" (1:50-2:00). Fallas: un hueco de ~680×460 px a la derecha del avatar en casi todas las escenas (0:14-0:22, 0:46-0:50, 1:24-1:34, 2:04-2:08); flechas contradictorias en 1:22-1:38 (AGENTE a la izquierda y EDITOR a la derecha, pero "→ AL AGENTE" apunta hacia el editor); y en cada cambio de escena el contenido pasa por encima del encabezado fijo y del avatar unos 0.4 s (0:55.8, 1:21.8, 1:50.8 y 2:03.0, por ejemplo). |

Promedio ponderado: 3.75 (0.60 + 0.60 + 0.60 + 0.20 + 0.40 + 0.40 + 0.15 + 0.40 + 0.40). No pasa a la puerta B: hace falta todo en 4 o más y 4.5 de promedio, y Retención y Voz están debajo de 4.

Tres arreglos, en orden de impacto (con el segundo del video):
1. 0:13-0:45: el repaso. Pasar del gancho casi directo a "Pero falta el otro lado" (0:45), la escena más fuerte porque muestra el dolor. "¿Qué es un protocolo?" y JSON-RPC (0:13-0:26) se pueden comprimir en una línea dentro de la sesión (1:22), que es donde se usan, y la historia de MCP (0:26-0:45) en una frase con su diagrama de "integraciones a mano → un estándar". Recorta unos 25 s y adelanta ACP unos 30 s. Cambia lo que dice la voz: vuelve a la puerta A.
2. 1:39-2:12: las tres escenas de ecosistema (33 s). Dejar una sola de unos 10 s: el selector de IntelliJ "Elige un agente (ACP)" (1:44) más el contador 48 agentes / 21 editores (2:00). Quitar lo repetido (el adaptador de Claude en 1:39 y 1:58, JetBrains en 1:44 y 2:03), la licencia y las fechas, y el "Por eso" sin lógica de 1:39-1:47. Con el arreglo 1, el Reel queda cerca de 1:25 y la retención sube sin perder valor. También cambia la voz.
3. 0:00 (tira-01 cuadro 1, y la portada de grilla.png): el primer cuadro y la portada muestran MCP y ACP casi apagados y la terminal a medio escribir. Que el cuadro 1 ya traiga "MCP · HERRAMIENTAS" y "ACP · TU EDITOR" encendidos (como en 0:04), o usar el cuadro de 0:10 con las dos conexiones dibujadas como portada, para que el "dos" se entienda sin sonido en el primer cuadro y en la grilla.
```

## Otros detalles (menores, sin peso en la nota)

- **1:12-1:22 (tira-07, cuadros 2 a 6).** Las líneas atraviesan las etiquetas "CLAUDE CODE" y "OPENCODE". La caja que une las tres integraciones dice "session/prompt", un método que todavía no se presentó (aparece en 1:25): decir "ACP" se entendería mejor.
- **1:22-1:38.** Invertir la cabecera (EDITOR a la izquierda, AGENTE a la derecha) o las flechas, para que "→ AL AGENTE" apunte al agente.
- **0:55.8-0:56.2 (tira-05, cuadro 5).** En el paneo a ACP quedan restos de la escena anterior encima del encabezado ("Edit(src/theme.ts) · 2 líneas"), y las letras "A / C / P" apiladas pasan sobre el avatar y el @. Lo mismo pasa con menos ruido en 1:21.8, 1:50.8 y 2:03.0. Dura menos de medio segundo, pero se ve en cada cambio de escena.
- **Lo que está bien y no hay que tocar.** El subtítulo karaoke (se lee aunque las palabras que vienen estén en gris). El contador 48 → 21 animado (2:01-2:03). El avatar cambia de gesto (guiño en 0:12 y 0:36, ojos cerrados en 1:34). La barra de 11 partes arriba da sensación de avance. Y el cierre recompone el diagrama del gancho, así que volver a verlo se siente natural.
