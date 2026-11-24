import { EASE, Stamp, unit, useClock, useCue } from "@motor/video";
import { AMBER, INK, OK } from "../world.tsx";
import { Big, Friction, Ic, Layer, Note, Photo, Rise, Term } from "../parts.tsx";

const HARDWARE = [
  { name: "Teclado", icon: "keyboard" },
  { name: "Mouse", icon: "mouse" },
  { name: "Monitor", icon: "monitor" },
  { name: "Impresora", icon: "printer" },
  { name: "Wi-Fi USB", icon: "wifi", odd: "sin driver" },
  { name: "Periférico RGB", icon: "lightbulb", odd: "solo Windows" },
];

/**
 * Hardware: a grid of devices that Linux detects one after the other in
 * green, except the odd ones: the USB Wi-Fi adapter (with its photo) and an
 * RGB peripheral stay amber. Then a terminal hunting for a driver, and the
 * same friction bar Windows had fills up to the same length.
 */
export function LimitesHardware() {
  const t = useClock();
  const comun = useCue("común");
  const adaptador = useCue("adaptador");
  const rgb = useCue("RGB");
  const drivers = useCue("drivers");
  const linux = useCue("Linux");
  const proyecto = useCue("proyecto");
  return (
    <Layer>
      <Note x={270} y={168} at={0} size={12} color={INK}>HARDWARE DETECTADO</Note>
      <div className="absolute grid grid-cols-3 gap-[10px]" style={{ left: 36, top: 192, width: 468 }}>
        {HARDWARE.map((hw, i) => {
          const at = hw.odd ? (i === 4 ? adaptador : rgb) : comun + i * 0.15;
          const enter = EASE.out(unit(t, 0.1 + i * 0.1, 0.3));
          const lit = EASE.out(unit(t, at, 0.25));
          const color = hw.odd ? AMBER : OK;
          return (
            <div key={hw.name} data-ui="" className="flex h-[92px] flex-col items-center justify-center gap-[6px] rounded-[6px]" style={{ opacity: enter, background: lit > 0.5 ? (hw.odd ? "#231D10" : "#10201A") : "#141A22", border: `1.5px solid ${lit > 0.5 ? color : "#2A3441"}` }}>
              <Ic name={hw.icon} size={24} color={lit > 0.5 ? color : INK} />
              <span className="font-sans text-[14px] font-semibold" style={{ color: INK }}>{hw.name}</span>
              <span className="font-mono text-[12px] font-bold uppercase" style={{ color, opacity: lit }}>{hw.odd ?? "detectado"}</span>
            </div>
          );
        })}
      </div>
      <Big x={36} y={422} w={250} size={34} at={comun} until={linux - 0.5} color={OK}>
        Lo común funciona.
      </Big>
      <Big x={36} y={512} w={250} size={34} at={adaptador + 0.3} until={linux - 0.5} color={AMBER}>
        Lo raro, no.
      </Big>
      <Rise x={300} y={420} w={204} h={204} at={adaptador - 0.1} until={linux - 0.5}>
        <Photo src="img/wifi.png" label="Wi-Fi USB" />
      </Rise>
      <Rise x={36} y={420} w={468} h={200} at={linux - 0.1}>
        <Term
          title="bash"
          size={14}
          note="Ejemplo ilustrativo"
          lines={[
            { text: "lsusb", at: linux, prompt: true },
            { text: "Bus 001 Device 004: Wireless Adapter", at: linux + 0.35 },
            { text: "ip link", at: linux + 0.6, prompt: true },
            { text: "# no aparece wlan0", at: linux + 0.95, color: AMBER },
            { text: "buscar \"driver linux adaptador wifi\"", at: proyecto, prompt: true },
          ]}
        />
      </Rise>
      <Friction x={36} y={650} w={468} label="Linux" at={drivers - 0.2} steps={[drivers, linux, proyecto, proyecto + 0.3, proyecto + 0.6]} />
      <Stamp at={proyecto + 0.2} x={300} y={738} color={AMBER} fill="#0B0F14" rotate={-4} size={30}>
        A investigar
      </Stamp>
    </Layer>
  );
}
