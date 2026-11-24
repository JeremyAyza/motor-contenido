import { useStage } from "@motor/video";

/*
 * The world of "Diseñar Spotify", a replica of @rick.theengineer's "Let's
 * design Spotify": a near-black console with a soft green glow at the top,
 * like his. Everything that explains lives in each scene's layer (parts.tsx),
 * over this backdrop; the glow breathes slowly so the stage is never dead.
 */

export const BG = "#070B09";
/** Spotify's green, the color Rick gives every system that works. */
export const G = "#1ED760";
export const G2 = "#169C47";
export const GD = "#0D2A19";
export const PANEL = "rgba(12,20,16,0.94)";
export const LINE = "#2A3A31";
export const INK = "#EEF5F0";
export const MUTED = "#7C8A82";
export const DIM = "#3E4B44";
/** @jacket.dev's violet: what matters most, the meter and the CTA. */
export const ACCENT = "#8B85FF";
export const RED = "#FF4D5E";

export function World() {
  const { ms } = useStage();
  const t = ms / 1000;
  const glow = 0.15 + 0.03 * Math.sin(t * 0.9);
  const a = Math.round(glow * 255).toString(16).padStart(2, "0");
  return (
    <div className="absolute left-0 top-0 overflow-hidden" style={{ width: 540, height: 960, background: BG }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 45% at 50% 22%, ${G}${a} 0%, rgba(7,11,9,0) 70%)` }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)" }} />
    </div>
  );
}
