import { EASE, unit, useClock, useCue } from "@motor/video";
import pixels from "../pixels.json";
import { Big, Card, Corners, Layer, Mono, Pic, Title } from "../parts.tsx";
import { ACCENT, INK, MUTED, RED } from "../world.tsx";

/** A real 12 × 9 RGB crop around the cat's left eye (pixels.json, from img/gato.png at 369, 471). */
const CAT: number[][][] = pixels.cat.grid;
const BOX = 308;
const CW = BOX / 12;
const CH = BOX / 9;
/** The pixel that opens into its three numbers. */
const PICK = { c: 2, r: 4 };

/**
 * A zoom that doesn't stop at the fur but at the numbers under it: the cat
 * fills the panel, the camera closes in on its eye, the photo breaks into
 * blocks and the blocks into values. One pixel opens into red, green and blue;
 * the photo's size lands as a multiplication, and "gato" is crossed out.
 */
export function Pixeles() {
  const t = useClock();
  const grilla = useCue("grilla");
  const tres = useCue("tres");
  const rojo = useCue("rojo");
  const millones = useCue("millones");
  const gato = useCue("gato", 2);
  const zoom = EASE.inOut(unit(t, 0.2, grilla - 0.1));
  const blocks = EASE.out(unit(t, grilla, 0.35));
  const values = EASE.out(unit(t, grilla + 0.35, 0.4));
  const [r, g, b] = CAT[PICK.r][PICK.c];
  const cross = EASE.inOut(unit(t, gato + 0.15, 0.3));
  // The eye sits at (0.36, 0.46) of the photo: the zoom closes in on it until the 96-px crop fills the box (1024 / 96).
  const s = 1 + (1024 / 96 - 1) * zoom;
  return (
    <Layer>
      <Title y={124} size={32}>Ve números</Title>
      <div className="absolute" style={{ left: 196, top: 180, width: BOX, height: BOX }}>
        <div className="absolute inset-0 overflow-hidden rounded-[4px]">
          <div className="absolute inset-0" style={{ transform: `scale(${s})`, transformOrigin: "36% 46%", opacity: 1 - blocks }}>
            <Pic src="img/gato.png" />
          </div>
          {blocks > 0 ? (
            <div className="absolute inset-0 grid grid-cols-12" style={{ opacity: blocks }}>
              {CAT.flat().map(([cr, cg, cb], i) => {
                const lum = Math.round(0.299 * cr + 0.587 * cg + 0.114 * cb);
                const picked = i === PICK.r * 12 + PICK.c && t > tres;
                return (
                  <div key={i} data-ui="" className="flex items-center justify-center font-mono text-[12px]" style={{ width: CW, height: CH, background: `rgb(${cr},${cg},${cb})`, color: lum > 110 ? "#111" : "#EEE", outline: picked ? `2px solid ${INK}` : "none", outlineOffset: -2 }}>
                    <span style={{ opacity: values }}>{lum}</span>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
        <Corners w={BOX} h={BOX} />
        <Mono x={0} y={BOX + 8} size={12}>gato.jpg · 12 × 9 píxeles del ojo</Mono>
        {cross > 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative rounded-[6px] px-[16px] font-display text-[56px] font-black uppercase" style={{ background: "rgba(7,9,13,0.82)", color: INK, opacity: Math.min(1, cross * 2) }}>
              gato
              <div className="absolute left-[8px] right-[8px] top-1/2" style={{ height: 7, background: RED, transform: `scaleX(${cross})`, transformOrigin: "0 50%" }} />
            </div>
          </div>
        ) : null}
      </div>

      <Card x={36} y={300} w={146} at={tres - 0.1} until={millones - 0.2}>
        <div className="p-[10px]">
          <div className="mb-[8px] h-[36px] rounded-[4px]" style={{ background: `rgb(${r},${g},${b})`, border: "1px solid rgba(255,255,255,0.2)" }} />
          {[
            ["R", r, "#FF6B6B", rojo],
            ["G", g, "#4ADE80", rojo + 0.25],
            ["B", b, "#60A5FA", rojo + 0.5],
          ].map(([k, v, c, at]) => (
            <div key={k as string} data-ui="" className="flex justify-between font-mono text-[20px] font-bold" style={{ color: c as string, opacity: EASE.out(unit(t, at as number, 0.2)) }}>
              <span>{k}</span>
              <span>{v}</span>
            </div>
          ))}
          <div data-ui="" className="mt-[6px] font-mono text-[12px]" style={{ color: MUTED }}>0 a 255</div>
        </div>
      </Card>

      <Big x={196} y={530} w={308} at={millones - 0.1} size={34} color={ACCENT} align="left">
        6.000×4.000×3
      </Big>
      <Mono x={196} y={574} at={millones + 0.3} size={16} color={INK}>
        = 72.000.000 números
      </Mono>
    </Layer>
  );
}
