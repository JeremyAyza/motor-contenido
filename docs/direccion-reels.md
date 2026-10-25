# Dirección de los Reels

Decidido con Jeremy el 24 de octubre de 2026, después de dos días de cambiar estilo, voz y formato pieza por pieza. Esta página manda sobre cualquier plan, skill o pieza anterior. **Nada de lo que está aquí cambia sin el sí de Jeremy en el chat.** Una elección para una pieza no se vuelve regla de la cuenta.

## 1. Estilo: motion graphics plano con cámara dinámica

**Por defecto, y para la mayoría de los Reels,** el video es motion graphics plano dibujado en código, con un escenario y la cámara que se mueve entre sus partes. Mezcla dos piezas:
- [`2026-10-18-agentes-ia-flujo-dev`](../content/2026-10-18-agentes-ia-flujo-dev/): las interfaces que el público reconoce (terminal, GitHub, PR, chat) y las cosas que aparecen una por una.
- El primer corte del login con Google (el hotel dibujado con formas, antes de las láminas 3D): un solo mundo con `defineVideo({ stage })` y la cámara que viaja por él.

Para que no quede "simplón", que fue la crítica a ese primer corte:
- **Escala:** el objeto del momento llena el cuadro. Nada de salas medio vacías con letra chica.
- **Color con función:** un acento para lo que importa, y el resto apagado.
- **Movimiento con peso:** resortes con rebote, golpes de sello, giros, cosas que viajan. Nada de solo fundidos.
- **Tipografía con jerarquía:** el dato clave enorme ("9 s", "0 contraseñas").

**El 3D, solo si se pide.** Si Jeremy pide un video en 3D o isométrico, se usan las láminas generadas: `video:image --world` y `<Plate>`, como en la pieza del login con Google. El agente no elige el 3D por su cuenta.

## 2. Duración y ritmo

- **De 45 a 60 s.** El formato es `corto`, que es el valor por defecto de `video.json`. `explicado` (75 a 100 s) solo si Jeremy lo pide.
- **Formato largo, de 90 a 180 s** (`format: "largo"`, aprobado el 24 de octubre): para una explicación de varios puntos, como el Reel de Rick sobre lo que cuesta la IA. Exige el kit de [docs/plan-paridad-rick.md](plan-paridad-rick.md) (tablero, objetos, cámara que viaja y sonido), para que algo cambie cada segundo.
- **Si replica una referencia, dura lo que dura la referencia** (decidido el 24 de octubre de 2026):
  - `video.json → target` lleva sus segundos y el formato es el que le toca (`corto`, `explicado` o `largo`), aunque no sea el de por defecto;
  - `video:script` y el inspector avisan si el video se aleja más de un 10 %;
  - para llegar no se estira la voz: se suman frases con datos, o pausas sin voz con `hold` en las escenas (el remate, la revelación, una transición), como hacen las referencias.
- **Algo cambia en pantalla cada 1 a 1,5 s:** la cámara, un objeto que entra o un dato que golpea.
- **De 5 a 7 escenas** de 2 o 3 frases cortas.

## 3. Voz

- **ElevenLabs con la voz F** (Eric, `cjVigY5qzO86Huf0OWal`), modelo `eleven_v4`. Está en `accounts/dev.json → voice`.
- **Estabilidad 0,5:** pareja entre escenas sin sonar plana.
- **Ritmo: `tempo` 1,12.** `video:prepare` acelera la voz ya generada sin cambiar su tono. Si sigue lenta, se sube de a 0,04.
- **Licencia:** el plan gratuito no da uso comercial. Para publicar hacen falta los 5 USD de créditos o un plan pago.
- **No se prueban más proveedores** sin que Jeremy lo pida.

## 4. Audio

- **Música al 0,06 por defecto**, y baja todavía más mientras habla la voz. La voz siempre va adelante.
- **Efectos:** pocos, y debajo de la música.

## 5. Lo que el render deja

`video.mp4`, la hoja, lo que encontró el inspector y el sha256 de la puerta B. Ya no hay vista con la interfaz de Instagram: Jeremy no la usa y alargaba el render.
