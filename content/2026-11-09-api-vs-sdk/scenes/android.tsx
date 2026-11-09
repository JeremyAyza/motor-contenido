import { EASE, fade, popAt, unit, useClock, useCue } from "@motor/video";
import { Logo } from "@motor/ui";
import { Layer, SdkBox, Title } from "../parts.tsx";
import { API, GREEN, INK, MUTED } from "../world.tsx";

/** Some SDKs go further: Android's brings a whole workshop, an emulator to test and adb to debug. */
export function Android() {
  const t = useClock();
  const android = useCue("Android");
  const emulador = useCue("emulador");
  const adb = useCue("adb");
  const probar = useCue("probar");
  const depurar = useCue("depurar");
  const box = popAt(t, 0.05);
  const logo = popAt(t, android - 0.05);
  const phone = popAt(t, 0.2);
  const screen = fade(t, emulador, 0.3);
  const cards = [
    { title: "PROBAR", tool: "Emulator", at: emulador, fill: probar, top: 318 },
    { title: "DEPURAR", tool: "adb · logcat", at: adb, fill: depurar, top: 448 },
  ];
  return (
    <Layer>
      <SdkBox x={110} y={690} s={0.6 * Math.min(1, box)} />
      {t >= android - 0.05 ? (
        <div className="absolute flex items-center gap-3" style={{ left: 40, top: 160, opacity: Math.min(1, logo * 2), transform: `scale(${0.8 + 0.2 * Math.min(1, logo)})`, transformOrigin: "0 50%" }}>
          <Logo slug="android" size={64} ancla={false} />
          <Title x={0} y={0} size={40} width={220} style={{ position: "relative" }}>
            Android SDK
          </Title>
        </div>
      ) : null}
      {t >= 0.2 ? (
        <div data-ui="" className="absolute overflow-hidden rounded-[28px] p-[10px]" style={{ left: 330, top: 250, width: 170, height: 340, background: "#111827", boxShadow: "0 24px 50px rgba(15,37,64,0.3)", opacity: Math.min(1, phone * 2), transform: `scale(${0.8 + 0.2 * Math.min(1, phone)})` }}>
          <div className="relative h-full w-full overflow-hidden rounded-[20px]" style={{ background: "#0B1220" }}>
            <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: 1 - screen }}>
              <Logo slug="android" size={70} ancla={false} />
            </div>
            <div className="absolute inset-0 bg-white px-2 pt-6 font-sans text-[12px]" style={{ opacity: screen, color: INK }}>
              <div className="mb-2 font-bold">Tu app · Soporte</div>
              <div className="w-fit rounded-[10px] bg-[#EEF2F6] px-2 py-1">Hola, ¿en qué te ayudo?</div>
              <div className="ml-auto mt-2 w-fit rounded-[10px] px-2 py-1 text-white" style={{ background: API }}>
                Resume este ticket
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {cards.map((card) => {
        if (t < card.at - 0.05) return null;
        const p = popAt(t, card.at - 0.05);
        const bar = EASE.inOut(unit(t, card.fill - 0.05, 0.8));
        return (
          <div key={card.title} data-ui="" className="absolute rounded-[12px] bg-white px-4 py-3" style={{ left: 40, top: card.top, width: 270, boxShadow: "0 14px 30px rgba(15,37,64,0.12)", opacity: Math.min(1, p * 2), transform: `translateX(${(1 - Math.min(1, p)) * -30}px)` }}>
            <div className="flex items-center justify-between font-mono text-[14px] font-bold">
              <span style={{ color: GREEN, letterSpacing: "0.14em" }}>{card.title}</span>
              <span style={{ color: MUTED }}>{card.tool}</span>
            </div>
            <div className="mt-3 h-[12px] rounded-full bg-[#E2E8EF]">
              <div className="h-full rounded-full" style={{ width: `${bar * 100}%`, background: GREEN }} />
            </div>
          </div>
        );
      })}
    </Layer>
  );
}
