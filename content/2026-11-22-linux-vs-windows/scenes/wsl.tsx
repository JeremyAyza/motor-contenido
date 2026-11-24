import { EASE, Stamp, unit, useClock, useCue } from "@motor/video";
import { Logo } from "@motor/ui";
import { AMBER, INK, TUX, WIN } from "../world.tsx";
import { Big, Card, Hi, Layer, Note, Rise, SIDE, Term } from "../parts.tsx";

/**
 * WSL: a "Windows 11" card, and "WSL" drops under it like a seal, with its
 * full name. Then Windows Terminal opens with an Ubuntu tab where uname
 * answers Linux; on "importantes" the presenter comes in and the line lands.
 */
export function Wsl() {
  const t = useClock();
  const wsl = useCue("WSL,");
  const subsistema = useCue("Subsistema");
  const entorno = useCue("entorno");
  const asi = useCue("Así");
  const importantes = useCue("importantes");
  const shrink = EASE.inOut(unit(t, asi - 0.2, 0.4));
  return (
    <Layer>
      <div className="absolute" style={{ left: 36, top: 168, width: 468, transform: `translateY(${-shrink * 0}px)` }}>
        <Rise x={0} y={0} w={468} h={70} at={0}>
          <Card border={WIN} bg="#0C1B2E">
            <div data-ui="" className="flex h-full items-center justify-center gap-[12px]">
              <Logo slug="windows" size={34} ancla={false} />
              <span className="font-display text-[28px] font-black" style={{ color: "#CFE3FA" }}>Windows 11</span>
            </div>
          </Card>
        </Rise>
      </div>
      <Rise x={36} y={250} w={468} h={150} at={wsl - 0.15}>
        <Card border="#2A3441">
          <div className="flex h-full flex-col items-center justify-center">
            <span className="font-display text-[84px] font-black leading-none" style={{ color: INK }}>WSL</span>
            <span data-ui="" className="mt-[6px] font-sans text-[16px] font-semibold" style={{ color: EASE.out(unit(t, subsistema, 0.3)) > 0.5 ? "#9FB0C4" : "transparent" }}>
              Subsistema de Windows para Linux
            </span>
          </div>
        </Card>
      </Rise>
      <Note x={270} y={410} at={subsistema + 0.6} size={14} color={AMBER}>Microsoft metió Linux dentro de Windows.</Note>
      <Rise x={36} y={440} w={468} h={140} at={entorno - 0.4}>
        <Term
          title="Terminal"
          tabs={["PowerShell", "Ubuntu"]}
          size={14}
          note="Ejemplo ilustrativo"
          lines={[
            { text: "uname -s", at: entorno - 0.2, prompt: true },
            { text: "Linux", at: entorno + 0.3, color: TUX },
          ]}
        />
      </Rise>
      <Stamp at={entorno + 0.5} until={asi - 0.15} x={372} y={526} color={TUX} fill="#0B0F14" rotate={-6} size={26}>
        Linux adentro
      </Stamp>
      <Big x={SIDE.x} y={SIDE.y + 18} w={SIDE.w} size={34} at={asi} >
        Así de <Hi color={TUX}>importantes</Hi> se volvieron.
      </Big>
      <Note x={SIDE.x + SIDE.w / 2} y={SIDE.y + 140} w={SIDE.w} at={importantes + 0.4} size={12}>
        El que perdió en el escritorio, Windows lo tuvo que traer.
      </Note>
    </Layer>
  );
}
