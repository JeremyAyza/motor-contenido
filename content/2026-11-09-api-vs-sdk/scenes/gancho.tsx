import { EASE, fade, keys, popAt, unit, useClock, useCue } from "@motor/video";
import { HAND_JS } from "../code.ts";
import { ApiChip, CodeView, Layer, SdkBox, Title } from "../parts.tsx";
import { INK, SDK_2 } from "../world.tsx";

const WALL = `${HAND_JS}\n\n${HAND_JS}`;

/** Frame 1: the hook over a wall of hand-written code; the API chip falls into the SDK box, then they split. */
export function Gancho() {
  const t = useClock();
  const api = useCue("API");
  const adentro = useCue("adentro");
  const parecido = useCue("parecido");
  // The ≠ lands on "pero" ("pero no son lo mismo"): "mismo" falls too close to the cut.
  const mismo = useCue("pero");
  const wall = 1 - fade(t, parecido - 0.1, 0.3);
  const title = 1 - fade(t, parecido - 0.15, 0.2);
  // The chip pops in, shrinks into the box when "adentro" is said, and comes back out on the split.
  const chipIn = popAt(t, api);
  const into = EASE.inOut(unit(t, adentro + 0.15, 0.45));
  const out = popAt(t, parecido + 0.1);
  const chipY = t < parecido ? keys(t, [[adentro + 0.15, 470], [adentro + 0.6, 610]]) : 230;
  const chipScale = t < parecido ? Math.min(1, chipIn) * (1 - 0.7 * into) : Math.min(1.05, out);
  const chipOpacity = t < parecido ? Math.min(1, chipIn * 2) * (1 - fade(t, adentro + 0.45, 0.15)) : Math.min(1, out * 2);
  const drop = popAt(t, adentro - 0.15);
  const boxY = t < parecido ? 660 - (1 - Math.min(1, drop)) * 520 : keys(t, [[parecido, 660], [parecido + 0.5, 620]]);
  const open = t < parecido ? keys(t, [[adentro, 0], [adentro + 0.15, 1], [adentro + 0.6, 1], [adentro + 0.85, 0]]) : 0;
  const neq = popAt(t, mismo - 0.1);
  return (
    <Layer>
      {wall > 0 ? (
        <div className="absolute overflow-hidden" style={{ left: 36, top: 300, width: 468, height: 500, opacity: 0.42 * wall }}>
          <div style={{ transform: `translateY(${-((t * 46) % 600)}px)` }}>
            <CodeView code={WALL} />
          </div>
        </div>
      ) : null}
      {title > 0 ? (
        <Title y={140} size={58} color="#FFFFFF" style={{ opacity: title }}>
          Tu <span style={{ color: SDK_2 }}>SDK</span> no es
          <br />
          una <span style={{ color: "#A5B4FC" }}>API</span>
        </Title>
      ) : null}
      {t >= adentro - 0.3 ? <SdkBox x={270} y={boxY} s={1.25} open={open} /> : null}
      {t >= api && chipOpacity > 0 ? <ApiChip x={270} y={chipY} w={240} h={124} scale={chipScale} opacity={chipOpacity} /> : null}
      {t >= mismo - 0.1 ? (
        <div className="absolute font-display font-black" style={{ left: 230, top: 372, width: 80, fontSize: 96, lineHeight: 1, textAlign: "center", color: INK, transform: `scale(${Math.min(1.1, neq)})` }}>
          ≠
        </div>
      ) : null}
    </Layer>
  );
}
