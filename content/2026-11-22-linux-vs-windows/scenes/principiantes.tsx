import { useCue } from "@motor/video";
import { Logo } from "@motor/ui";
import { INK, MUTED, TUX } from "../world.tsx";
import { Big, Desktop, Hi, Layer, Rise, SIDE, Term } from "../parts.tsx";

/**
 * For beginners: Arch's installer next to the presenter, "No tienes que
 * empezar aquí". Then Linux Mint and Ubuntu desktops with a browser open:
 * surprisingly normal.
 */
export function Principiantes() {
  const arch = useCue("Arch.");
  const linux = useCue("Linux");
  const ubuntu = useCue("Ubuntu");
  const normales = useCue("sorprendentemente");
  return (
    <Layer>
      <Rise x={36} y={170} w={468} h={260} at={0} until={linux - 0.15}>
        <Term
          title="archinstall"
          size={14}
          note="Ejemplo ilustrativo"
          lines={[
            { text: "archinstall", at: 0.1, prompt: true },
            { text: "> Selecciona el disco: /dev/sda", at: 0.5, color: "#7FB8F0" },
            { text: "> Esquema de particiones: manual", at: 0.75 },
            { text: "> Sistema de archivos: ?", at: 1.0 },
            { text: "> Gestor de arranque: ?", at: 1.25 },
            { text: "> Escritorio: ninguno", at: 1.5, color: MUTED },
          ]}
        />
        <div className="absolute right-[14px] top-[44px]">
          <Logo slug="archlinux" size={44} ancla={false} />
        </div>
      </Rise>
      <Big x={SIDE.x} y={SIDE.y} w={SIDE.w} size={38} at={arch - 1.1} until={linux - 0.1}>
        No tienes que empezar <Hi color={TUX}>aquí.</Hi>
      </Big>
      <Rise x={36} y={180} w={468} h={200} at={linux - 0.1}>
        <Desktop from="#1F3A1C" to="#86BE43" slug="linuxmint" name="Linux Mint" bar="bottom" window />
      </Rise>
      <Rise x={36} y={396} w={468} h={200} at={ubuntu - 0.1}>
        <Desktop from="#4A1236" to="#E95420" slug="ubuntu" name="Ubuntu" bar="left" window />
      </Rise>
      <Big x={270} y={612} w={468} size={40} at={normales - 0.1} align="center" color={INK}>
        Sorprendentemente <Hi color={TUX}>normal.</Hi>
      </Big>
    </Layer>
  );
}
