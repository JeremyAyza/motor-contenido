import { useClock, useCue } from "@motor/video";
import { Bar, Big, Layer, Photo, Title } from "../parts.tsx";
import { MUTED, YELLOW } from "../world.tsx";

/**
 * A scoreboard where one bet wins by a mile: the husky's face, three bars that
 * fill in order (dog, wolf, cat) as the voice says them, and on "clasificar"
 * the big yellow "94 % PERRO" lands over the photo.
 */
export function Clasificar() {
  const t = useClock();
  const noventa = useCue("noventa");
  const lobo = useCue("lobo");
  const gato = useCue("gato");
  const clasificar = useCue("clasificar");
  return (
    <Layer>
      {t < clasificar - 0.1 ? <Title y={124} size={28}>Una lista de probabilidades</Title> : null}
      <Big x={36} y={118} w={468} at={clasificar - 0.05} size={66}>
        94 % perro
      </Big>
      <Photo src="img/husky.png" x={196} y={200} w={308} h={308} at={0} caption="husky.jpg" right="ResNet-50" />
      <Bar x={196} y={548} w={308} label="PERRO" value={93.8} at={noventa} color={YELLOW} size={18} strong />
      <Bar x={196} y={584} w={308} label="LOBO" value={5.0} at={lobo} color={MUTED} size={18} />
      <Bar x={196} y={620} w={308} label="GATO" value={1.2} at={gato} color={MUTED} size={18} />
    </Layer>
  );
}
