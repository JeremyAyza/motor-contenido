# La biblioteca de video

Generado por `npm run video:biblioteca`. No lo edites a mano: cambia `packages/video/src/kit/grammar.tsx` o las `ficha.json`.

Tres capas ([docs/reel.md](../../../docs/reel.md), "La biblioteca"):
- **La gramática** (`@motor/video`): cómo se mueven las cosas. Se usa siempre y no ancla, porque no dice qué mostrar.
- **Las escenas**: sacadas de piezas aprobadas, con parámetros. Se miran solo después de congelar el guion visual (`video:congelar`), y las empareja `video:emparejar`.
- **Las protagonistas** (el gancho, el clímax y el mundo): nunca vienen de aquí.

## La gramática

| Export | Qué hace |
|---|---|
| `DUR` | Durations with a name, in seconds. "move" is the camera's change of shot. |
| `CLAMP` | interpolate() options that hold the first and last values. |
| `EASE` | The curves: functions from 0..1 to 0..1 (back overshoots a little before settling). |
| `clamp01` | Keeps a value between 0 and 1. |
| `unit` | How far `t` is through [at, at + dur], from 0 to 1. |
| `lerp` | From `a` to `b` by `p` (0 to 1). |
| `lerpPoint` | lerp for points { x, y }. |
| `fade` | 0 before `at`, 1 after `at + dur`. |
| `span` | On from `a`, off from `b`. |
| `bump` | 0 → 1 → 0 over [at, at + dur]: a flash, a pulse. |
| `popAt` | The kit's pop: a spring with overshoot from `at` (the same as usePop, for a time you already have). |
| `keys` | A value along eased keys [seconds, value], holding the first and the last. |
| `RigShot` | A shot of a piece's own camera: where it goes (x, y, zoom z) from `at`, in `dur` seconds. |
| `rigAt` | A piece's own camera: the shot at time `t`, eased from one to the next, and whether it is moving. The div it moves carries data-zoom and, while moving, data-camera-moving, so the inspector measures its text right. |
| `shakeAt` | A hit that shakes the frame for 0.4 s, decaying: the offset at `t` for hits at those seconds. |
| `wobble` | A slow organic sway for a thing at rest (a floating card, a character breathing, a hanging sign): the offset in px and the turn in degrees at `t`, from Remotion's noise, so the same seed always moves the same way. Give each thing its own `seed`. |
| `es` | A number the Spanish way: 1.000.000 and 0,25. |
| `At` | A box at absolute coordinates (px of design, or of the world inside a stage). |
| `Appear` | Pops in at `at` (rises `from` px and grows from 72 %), and fades out at `until` if given; not mounted outside that time. For a sound with it, use <Pop>. |

## Escenas (0)

Ninguna todavía. Una candidata pasa aquí cuando una segunda pieza la necesita o Jeremy la marca.

## Candidatas (0)

Ninguna todavía. `video:cosechar` las propone después de la puerta B.

