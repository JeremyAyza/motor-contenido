/*
 * The 3×3 color filters drawn in the CNN and training scenes: noise at first,
 * and with `trained` from 0 to 1 they settle into what a first conv layer
 * learns (oriented edges, color blobs, stripes). Drawn, not from a real
 * network: the scenes that show them say "Ejemplo ilustrativo".
 */

function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const PALETTES: [number, number, number][][] = [
  [[30, 30, 34], [235, 235, 240]],
  [[40, 90, 255], [255, 200, 40]],
  [[20, 160, 90], [230, 60, 160]],
  [[255, 120, 40], [30, 40, 120]],
  [[120, 220, 255], [60, 20, 60]],
  [[200, 200, 60], [50, 60, 200]],
];

/** The nine colors of filter `i`, from noise (trained 0) to its pattern (trained 1). */
export function filterCells(i: number, trained: number): string[] {
  const kind = Math.floor(rand(i + 1) * 4);
  const angle = Math.floor(rand(i + 7) * 4);
  const pal = PALETTES[Math.floor(rand(i + 3) * PALETTES.length)];
  const cells: string[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      let v: number;
      const d = angle === 0 ? c : angle === 1 ? r : angle === 2 ? (r + c) / 2 : (r + 2 - c) / 2;
      if (kind === 0) v = d / 2;
      else if (kind === 1) v = Math.abs(d - 1) < 0.6 ? 1 : 0;
      else if (kind === 2) v = r === 1 && c === 1 ? 1 : 0.15;
      else v = (r + c) % 2 === 0 ? 0.85 : 0.2;
      const noise = [rand(i * 31 + r * 3 + c), rand(i * 57 + r * 3 + c + 11), rand(i * 91 + r * 3 + c + 23)];
      const target = pal[0].map((a, k) => a + (pal[1][k] - a) * v);
      const rgb = target.map((x, k) => Math.round(noise[k] * 255 * (1 - trained) + x * trained));
      cells.push(`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`);
    }
  }
  return cells;
}

/** One filter tile of `size` px. */
export function FilterTile({ i, trained, size }: { i: number; trained: number; size: number }) {
  const cells = filterCells(i, trained);
  return (
    <div className="grid grid-cols-3" style={{ width: size, height: size, borderRadius: 2, overflow: "hidden" }}>
      {cells.map((c, k) => (
        <i key={k} className="block" style={{ background: c }} />
      ))}
    </div>
  );
}
