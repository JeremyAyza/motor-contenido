import { Logo } from "@motor/ui";
import { EASE, fade, popAt, unit, useClock, useCue, wobble } from "@motor/video";
import { Layer, Title, White } from "../parts.tsx";
import { ACCENT, INK, LINE, MUTED, WIN } from "../world.tsx";

/** Which laptops on the startup table are Macs: six of seven. */
const TABLE = [true, true, false, true, true, true, true];

/** One of the two tall product cards of the hook: the mark big, the name under it. */
function Card({ x, mac, p, dim }: { x: number; mac: boolean; p: number; dim: number }) {
  return (
    <div
      data-ui=""
      className="absolute flex flex-col items-center rounded-[18px]"
      style={{
        left: x,
        top: 256,
        width: 226,
        height: 344,
        background: `linear-gradient(180deg, ${mac ? "#1E2230" : "#14213A"} 0%, ${WIN} 100%)`,
        border: `1px solid ${mac ? "rgba(255,255,255,0.16)" : "rgba(0,120,212,0.45)"}`,
        opacity: Math.min(1, p * 1.6) * (1 - 0.6 * dim),
        transform: `translateY(${(1 - Math.min(1, p)) * 60}px)`,
      }}
    >
      <div className="mt-[48px]">{mac ? <White slug="apple" size={112} /> : <Logo slug="windows" size={104} ancla={false} />}</div>
      <div className="mt-auto mb-[44px] text-center">
        <div className="font-display text-[46px] font-black leading-none tracking-tight" style={{ color: INK }}>
          {mac ? "Mac" : "Windows"}
        </div>
        <div className="mt-[8px] font-mono text-[22px]" style={{ color: mac ? MUTED : "#6CB4F0" }}>
          {mac ? "macOS" : "Windows 11"}
        </div>
      </div>
    </div>
  );
}

/** A laptop seen from above on the startup table, its lid mark lit when it opens. */
function Laptop({ x, y, mac, p }: { x: number; y: number; mac: boolean; p: number }) {
  return (
    <div className="absolute" style={{ left: x, top: y, opacity: Math.min(1, p * 2), transform: `scale(${0.6 + 0.4 * Math.min(1.05, p)})` }}>
      <div className="flex items-center justify-center rounded-[8px]" style={{ width: 92, height: 62, background: mac ? "#C9CCD2" : "#2B2F38", border: "1px solid rgba(255,255,255,0.2)" }}>
        {mac ? (
          <div style={{ filter: "brightness(0)", opacity: 0.55 }}>
            <Logo slug="apple" size={26} ancla={false} />
          </div>
        ) : (
          <Logo slug="windows" size={22} ancla={false} />
        )}
      </div>
    </div>
  );
}

/**
 * Frame 1: the hook as a label over the two product cards, Mac and Windows,
 * side by side (no versus: Jeremy took out the fighting game). Then a startup
 * table full of MacBooks, a giant question mark, and the cards back, dimmed.
 */
export function Gancho() {
  const t = useClock();
  const startup = useCue("startup");
  const pero = useCue("pero");
  const marca = useCue("marca");
  const vamos = useCue("vamos");
  // Frame 1 already has both cards on their way in.
  const pMac = popAt(t, -0.14);
  const pWin = popAt(t, -0.04);
  const cardsOut = fade(t, startup - 0.1, 0.25) * (1 - fade(t, vamos - 0.1, 0.35));
  const table = fade(t, startup, 0.2) * (1 - fade(t, vamos - 0.15, 0.25));
  const q = popAt(t, pero);
  const qOut = fade(t, vamos - 0.15, 0.25);
  const end = fade(t, vamos + 0.15, 0.3);
  const w = wobble(t, "q", 4);
  const flash = Math.max(0, 1 - unit(t, pero, 0.5));
  return (
    <Layer>
      <div className="absolute inset-0" style={{ opacity: 1 - end }}>
        <Title x={36} y={130} width={468} size={46} align="center">
          ¿Por qué los devs
          <br />
          prefieren <span style={{ color: ACCENT }}>Mac</span>?
        </Title>
        <div className="absolute inset-0" style={{ opacity: 1 - cardsOut * 0.92 }}>
          <Card x={36} mac p={pMac} dim={fade(t, vamos, 0.4) * 0.4} />
          <Card x={278} mac={false} p={pWin} dim={fade(t, vamos, 0.4)} />
        </div>
        {table > 0 ? (
          <div className="absolute inset-0" style={{ opacity: table * (1 - 0.65 * fade(t, pero, 0.25)) }}>
            <div className="absolute rounded-[20px]" style={{ left: 58, top: 262, width: 424, height: 300, background: "#3A2C22", border: "1px solid #57412F" }} />
            {TABLE.map((mac, i) => {
              const col = i % 4;
              const row = Math.floor(i / 4);
              const x = row === 0 ? 74 + col * 102 : 125 + col * 102;
              return <Laptop key={i} x={x} y={row === 0 ? 300 : 440} mac={mac} p={popAt(t, startup + 0.15 + i * 0.09)} />;
            })}
          </div>
        ) : null}
        {q > 0 && qOut < 1 ? (
          <div className="absolute text-center font-display font-black leading-none" style={{ left: 120, top: 250 + w.y, width: 300, fontSize: 300, color: ACCENT, opacity: Math.min(1, q * 2) * (1 - qOut), transform: `scale(${0.5 + 0.5 * Math.min(1.1, q)}) rotate(${w.rotate}deg)`, textShadow: `0 0 ${40 + 60 * flash}px rgba(139,133,255,${0.35 + 0.4 * flash})` }}>
            ?
          </div>
        ) : null}
        {t > marca - 0.1 && qOut < 1 ? (
          <div className="absolute rounded-[10px] px-[14px] py-[6px] font-mono text-[24px] font-bold" style={{ left: 300, top: 560, color: INK, background: WIN, border: `1px solid ${LINE}`, opacity: fade(t, marca - 0.1, 0.15) * (1 - qOut), transform: `rotate(-5deg) scale(${0.8 + 0.2 * EASE.out(unit(t, marca - 0.1, 0.25))})` }}>
            ¿o la marca?
          </div>
        ) : null}
      </div>
    </Layer>
  );
}
