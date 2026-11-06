import { Logo } from "@motor/ui";
import { EASE, popAt, unit, useClock, useCue } from "@motor/video";
import { Card, Layer, PixelFace, Source, Title } from "../parts.tsx";
import { ACCENT, INK, TOKEN } from "../world.tsx";

/** One giant token per company, each with its one-line fact (facts.json). */
function BrandCoin({ at, x, slug, chip, line }: { at: number; x: number; slug: string; chip?: string; line: string }) {
  const t = useClock();
  if (t < at) return null;
  const k = EASE.in(unit(t, at, 0.4));
  const p = Math.min(1, popAt(t, at + 0.35));
  return (
    <div className="absolute" style={{ left: x, top: 186 + (k - 1) * 40, width: 110, opacity: Math.min(1, k * 2) }}>
      <div className="flex items-center justify-center rounded-full" style={{ width: 96, height: 96, marginLeft: 7, background: "var(--piece-surface)", border: `4px solid ${TOKEN}`, boxShadow: `0 0 14px ${TOKEN}66`, transform: `scale(${0.85 + 0.15 * p})` }}>
        <Logo slug={slug} size={50} chip={chip} ancla={false} />
      </div>
      <div data-ui="" className="text-center font-mono font-bold uppercase" style={{ fontSize: 14, letterSpacing: "0.02em", color: INK, marginTop: 8, lineHeight: 1.2, opacity: p }}>
        {line}
      </div>
    </div>
  );
}

export function Masivo() {
  const t = useClock();
  const meta = useCue("Meta");
  const openai = useCue("OpenAI");
  const shopify = useCue("Shopify");
  const nvidia = useCue("Nvidia");
  const ingeniero = useCue("ingeniero");
  const quinientos = useCue("quinientos");
  const gasta = useCue("gasta");
  const mitad = useCue("mitad");
  const pop = (at: number) => (t >= at ? Math.min(1, popAt(t, at)) : 0);
  const tilt = EASE.out(unit(t, mitad, 0.7));
  return (
    <Layer>
      <Title at={0.05} until={nvidia - 0.1} y={410} size={46}>
        2026: se vuelve <span style={{ color: TOKEN }}>masivo</span>
      </Title>
      <BrandCoin at={meta - 0.2} x={36} slug="meta" chip="#FFFFFF" line="Tabla interna" />
      <BrandCoin at={openai - 0.2} x={155} slug="openai" chip="#FFFFFF" line="Su líder: ~100 mil M al mes" />
      <BrandCoin at={shopify - 0.2} x={274} slug="shopify" line="IA, expectativa base" />
      <BrandCoin at={nvidia - 0.2} x={393} slug="nvidia" line="La cita ↓" />
      <Card at={nvidia + 0.1} y={400} h={330} label="Jensen Huang · CEO de Nvidia · mar 2026" border="#76B900">
        <div className="flex items-end justify-between" style={{ marginTop: 8 }}>
          <div style={{ opacity: 0.2 + 0.8 * pop(quinientos), transform: `scale(${0.85 + 0.15 * pop(quinientos)})`, transformOrigin: "0 100%" }}>
            <div className="font-mono uppercase" style={{ fontSize: 14, letterSpacing: "0.1em", color: "var(--piece-muted)" }}>
              Sueldo al año
            </div>
            <div className="font-display font-black" style={{ fontSize: 46, color: INK, lineHeight: 1 }}>
              500 mil
            </div>
          </div>
          <div style={{ paddingBottom: 6, transform: `scale(${pop(ingeniero)})` }}>
            <PixelFace seed={9} size={52} color="#76B900" />
          </div>
          <div className="text-right" style={{ opacity: 0.2 + 0.8 * pop(gasta), transform: `scale(${0.85 + 0.15 * pop(gasta)})`, transformOrigin: "100% 100%" }}>
            <div className="font-mono uppercase" style={{ fontSize: 14, letterSpacing: "0.1em", color: "var(--piece-muted)" }}>
              En tokens, mínimo
            </div>
            <div className="font-display font-black" style={{ fontSize: 46, color: TOKEN, lineHeight: 1 }}>
              250 mil
            </div>
          </div>
        </div>
        <svg width={436} height={130} viewBox="0 0 436 130" style={{ marginTop: 12, overflow: "visible" }} aria-hidden>
          <path d="M 218 30 L 218 120 M 168 124 L 268 124" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <g transform={`rotate(${-8 + 8 * tilt} 218 30)`}>
            <path d="M 60 30 L 376 30" stroke={INK} strokeWidth={5} strokeLinecap="round" />
            <rect x={36} y={38} width={110} height={30} rx={8} fill={INK} opacity={0.9} />
            <rect x={290} y={38} width={110 * (0.2 + 0.8 * tilt)} height={30} rx={8} fill={TOKEN} />
          </g>
          <text x={218} y={20} textAnchor="middle" fontFamily="var(--piece-font-display)" fontWeight={900} fontSize={22} fill={ACCENT} opacity={tilt}>
            la mitad
          </text>
        </svg>
      </Card>
      <Source at={nvidia + 0.3} y={744}>
        The Decoder · All-In, 21 mar 2026
      </Source>
    </Layer>
  );
}
