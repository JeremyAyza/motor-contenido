import type { CSSProperties } from "react";
import { lerp } from "@motor/video";
import { ASPHALT, MINT, PINK, SAND, SEA } from "./palette.ts";

/*
 * The city of 1997 and 2001, drawn in code: a 600×760 plane of three by three
 * blocks with their roofs, roads with dashed lines, palms, a beach and the sea.
 * Seen straight down it is the first game's tile map; tilted to isometric
 * (CSS 3D, no perspective) the roofs rise into pastel buildings, the 2001
 * jump. The pink block in the middle is the hotel of the whole video.
 */

const CREAM = "#F3E3C3";
const BLUE = "#A9CFE8";
const PEACH = "#F2B9A0";
const WALK = "#D2CCC3";
export const STEP = 195;
const OFF = 22;
export const B = 150;
export const PLANE = { w: 600, h: 760 };

export const BLOCKS = [
  { c: 0, r: 0, roof: MINT, h: 70 },
  { c: 1, r: 0, roof: CREAM, h: 48 },
  { c: 2, r: 0, roof: BLUE, h: 92 },
  { c: 0, r: 1, roof: PEACH, h: 56 },
  { c: 1, r: 1, roof: PINK, h: 82, hotel: true },
  { c: 2, r: 1, roof: MINT, h: 60 },
  { c: 0, r: 2, roof: CREAM, h: 44 },
  { c: 1, r: 2, roof: BLUE, h: 66 },
  { c: 2, r: 2, roof: PINK, h: 52 },
].map((b) => ({ ...b, x: OFF + b.c * STEP, y: OFF + b.r * STEP }));

/** The center of a block in plane coordinates. */
export const blockCenter = (i: number) => ({ x: BLOCKS[i].x + B / 2, y: BLOCKS[i].y + B / 2 });

/** Road centers: two vertical, three horizontal (the last one runs along the beach). */
const VROADS = [OFF + B + 22.5, OFF + STEP + B + 22.5];
const HROADS = [OFF + B + 22.5, OFF + STEP + B + 22.5, 581];

function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (s: number) => Math.round(((n >> s) & 255) * k);
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
}

/** A palm seen from above: a star of fronds. */
function Palm({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const fronds = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2;
    return `M0 0 Q ${Math.cos(a + 0.35) * 10} ${Math.sin(a + 0.35) * 10} ${Math.cos(a) * 20} ${Math.sin(a) * 20} Q ${Math.cos(a - 0.35) * 10} ${Math.sin(a - 0.35) * 10} 0 0`;
  });
  return (
    <svg className="absolute" style={{ left: x - 22 * s, top: y - 22 * s, overflow: "visible" }} width={44 * s} height={44 * s} viewBox="-22 -22 44 44">
      {fronds.map((d, i) => (
        <path key={i} d={d} fill={i % 2 ? "#3FAE5A" : "#2E9448"} />
      ))}
      <circle r={3} fill="#7A5A33" />
    </svg>
  );
}

/** A building: the roof on top of four walls that rise with `h`. */
function Box({ x, y, w, d, h, roof, hotel = false, style }: { x: number; y: number; w: number; d: number; h: number; roof: string; hotel?: boolean; style?: CSSProperties }) {
  const wall = (k: number): CSSProperties => ({
    position: "absolute",
    background: `repeating-linear-gradient(180deg, ${shade(roof, k)} 0 9px, ${shade(roof, k * 0.72)} 9px 14px)`,
    boxShadow: `inset 0 0 0 1px ${shade(roof, k * 0.8)}`,
  });
  return (
    <div className="absolute" style={{ left: x, top: y, width: w, height: d, transformStyle: "preserve-3d", ...style }}>
      {h > 0.5 ? (
        <>
          <div style={{ ...wall(0.92), left: 0, top: d, width: w, height: h, transformOrigin: "top", transform: "rotateX(90deg)" }} />
          <div style={{ ...wall(0.92), left: 0, top: 0, width: w, height: h, transformOrigin: "top", transform: "rotateX(90deg)" }} />
          <div style={{ ...wall(0.78), left: 0, top: 0, width: h, height: d, transformOrigin: "left", transform: "rotateY(-90deg)", background: `repeating-linear-gradient(90deg, ${shade(roof, 0.72)} 0 5px, ${shade(roof, 0.78)} 5px 14px)` }} />
          <div style={{ ...wall(0.78), left: w, top: 0, width: h, height: d, transformOrigin: "left", transform: "rotateY(-90deg)", background: `repeating-linear-gradient(90deg, ${shade(roof, 0.72)} 0 5px, ${shade(roof, 0.78)} 5px 14px)` }} />
        </>
      ) : null}
      <div className="absolute inset-0" style={{ background: roof, boxShadow: `inset 0 0 0 3px ${shade(roof, 0.86)}`, transform: `translateZ(${h}px)` }}>
        {/* Rooftop units, the details that make a roof read as a roof from the sky. */}
        <i className="absolute block" style={{ left: w * 0.18, top: d * 0.2, width: 16, height: 14, background: "#F7F4EE", boxShadow: `inset 0 0 0 2px ${shade(roof, 0.7)}` }} />
        <i className="absolute block" style={{ left: w * 0.5, top: d * 0.24, width: 12, height: 12, background: "#F7F4EE", boxShadow: `inset 0 0 0 2px ${shade(roof, 0.7)}` }} />
        <i className="absolute block" style={{ left: w * 0.66, top: d * 0.55, width: 18, height: 16, background: shade(roof, 0.85) }} />
        {hotel ? <i className="absolute block" style={{ left: 0, top: d - 12, width: w, height: 12, background: `repeating-linear-gradient(90deg, ${MINT} 0 8px, #F7F4EE 8px 14px)` }} /> : null}
      </div>
    </div>
  );
}

export type BlockState = { o: number; g: number };

/**
 * The city. `tilt` 0 is straight down, 1 is isometric; `grow` raises every
 * building (0 to 1), and `blocks` overrides it per block (opacity and growth),
 * for the 2001 streaming. `ground` 1 is streets and beach, 0 is a dark neon
 * grid. `cam` puts a point of the plane at (270, cy) with its zoom. `cars`
 * runs the traffic on the clock `t`.
 */
export function City({ t, tilt = 0, grow = 0, blocks, ground = 1, cam = { x: 300, y: 380, z: 1 }, cy = 440, car }: { t: number; tilt?: number; grow?: number; blocks?: (i: number) => BlockState; ground?: number; cam?: { x: number; y: number; z: number }; cy?: number; car?: { x: number; y: number } }) {
  const traffic = [
    { road: "h", at: HROADS[1] - 8, speed: 70, off: 0, color: MINT, dir: 1 },
    { road: "h", at: HROADS[1] + 8, speed: 55, off: 260, color: "#F7F4EE", dir: -1 },
    { road: "v", at: VROADS[0] - 8, speed: 60, off: 120, color: "#E0574F", dir: 1 },
    { road: "v", at: VROADS[1] + 8, speed: 50, off: 400, color: "#4F7FE0", dir: -1 },
    { road: "h", at: HROADS[0] + 8, speed: 65, off: 500, color: "#F7F4EE", dir: -1 },
  ];
  return (
    <div className="absolute left-0 top-0 overflow-hidden" style={{ width: 540, height: 960 }}>
      <div
        className="absolute"
        style={{
          left: 270 - cam.x,
          top: cy - cam.y,
          width: PLANE.w,
          height: PLANE.h,
          transformOrigin: `${cam.x}px ${cam.y}px`,
          transform: `scale(${cam.z}) rotateX(${55 * tilt}deg) rotateZ(${-45 * tilt}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* The neon grid under the city, for 2001's world built in pieces. */}
        <div className="absolute" style={{ left: -700, top: -700, width: 2000, height: 2160, background: "#0C1015", backgroundImage: "linear-gradient(rgba(64,214,200,0.55) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(64,214,200,0.55) 1.5px, transparent 1.5px)", backgroundSize: "65px 65px", opacity: 1 - ground }} />
        <div className="absolute inset-0" style={{ opacity: ground }}>
          <div className="absolute left-0 top-0" style={{ width: PLANE.w, height: 600, background: ASPHALT }} />
          <div className="absolute left-0" style={{ top: 600, width: PLANE.w, height: 18, background: "#C98F7A" }} />
          <div className="absolute left-0" style={{ top: 618, width: PLANE.w, height: 70, background: SAND }} />
          <div className="absolute left-0" style={{ top: 688, width: PLANE.w, height: 72, background: `linear-gradient(180deg, #5CC8C0 0%, ${SEA} 100%)` }} />
          {HROADS.map((y) => (
            <div key={`h${y}`} className="absolute left-0" style={{ top: y - 1.5, width: PLANE.w, height: 3, backgroundImage: "linear-gradient(90deg, #EDEAE2 0 16px, transparent 16px 30px)", backgroundSize: "30px 3px" }} />
          ))}
          {VROADS.map((x) => (
            <div key={`v${x}`} className="absolute top-0" style={{ left: x - 1.5, width: 3, height: 600, backgroundImage: "linear-gradient(180deg, #EDEAE2 0 16px, transparent 16px 30px)", backgroundSize: "3px 30px" }} />
          ))}
          {/* Crosswalks at two corners. */}
          <div className="absolute" style={{ left: VROADS[0] - 20, top: HROADS[1] - 34, width: 40, height: 14, backgroundImage: "linear-gradient(90deg, #EDEAE2 0 4px, transparent 4px 8px)", backgroundSize: "8px 14px" }} />
          <div className="absolute" style={{ left: VROADS[1] + 24, top: HROADS[0] - 20, width: 14, height: 40, backgroundImage: "linear-gradient(180deg, #EDEAE2 0 4px, transparent 4px 8px)", backgroundSize: "14px 8px" }} />
          {BLOCKS.map((b, i) => (
            <div key={`w${i}`} className="absolute" style={{ left: b.x, top: b.y, width: B, height: B, background: WALK, borderRadius: 6 }} />
          ))}
          {traffic.map((c, i) => {
            const len = c.road === "h" ? PLANE.w + 80 : 680;
            const p = (((c.off + t * c.speed) % len) + len) % len;
            const pos = c.dir > 0 ? p - 40 : len - p - 40;
            const horizontal = c.road === "h";
            return (
              <div key={`c${i}`} className="absolute rounded-[3px]" style={{ left: horizontal ? pos : c.at - 7, top: horizontal ? c.at - 7 : pos, width: horizontal ? 26 : 14, height: horizontal ? 14 : 26, background: c.color, boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.18)" }} />
            );
          })}
          {[
            [12, 600], [80, 640], [170, 610], [260, 650], [350, 612], [440, 645], [530, 606], [590, 650],
            [OFF + B - 8, OFF + B + STEP - 10], [OFF + STEP + 10, OFF + STEP * 2 - 18], [OFF + STEP * 2 + B - 10, OFF + 12],
          ].map(([x, y], i) => (
            <Palm key={`p${i}`} x={x} y={y} s={i < 8 ? 1.2 : 0.9} />
          ))}
        </div>
        {BLOCKS.map((b, i) => {
          const s = blocks ? blocks(i) : { o: 1, g: grow };
          if (s.o <= 0.01) return null;
          // Scale, not opacity: opacity would flatten the 3D walls.
          return <Box key={`b${i}`} x={b.x + 12} y={b.y + 12} w={B - 24} d={B - 24} h={b.h * s.g} roof={b.roof} hotel={b.hotel} style={{ transform: `scale(${s.o})` }} />;
        })}
        {car ? <Box x={car.x - 13} y={car.y - 8} w={26} d={16} h={lerp(0, 9, tilt)} roof={MINT} /> : null}
      </div>
    </div>
  );
}
