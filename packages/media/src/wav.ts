const tag = (bytes: Uint8Array, at: number) => String.fromCharCode(...bytes.subarray(at, at + 4));

/** Duration of a PCM WAV file in ms, read from its header. */
export function wavDurationMs(wav: Uint8Array): number {
  if (tag(wav, 0) !== "RIFF" || tag(wav, 8) !== "WAVE") throw new Error("Not a WAV file");
  const view = new DataView(wav.buffer, wav.byteOffset, wav.byteLength);
  let byteRate = 0;
  for (let offset = 12; offset + 8 <= wav.length; ) {
    const id = tag(wav, offset);
    const size = view.getUint32(offset + 4, true);
    if (id === "fmt ") byteRate = view.getUint32(offset + 16, true);
    if (id === "data") {
      if (!byteRate) throw new Error("WAV data chunk comes before its fmt chunk");
      // Streamed WAVs leave the size at 0 or 0xFFFFFFFF: the data runs to the end.
      const available = wav.length - offset - 8;
      const bytes = size === 0 || size === 0xffffffff ? available : Math.min(size, available);
      return (bytes / byteRate) * 1000;
    }
    offset += 8 + size + (size % 2);
  }
  throw new Error("WAV without a data chunk");
}

/**
 * How loud the voice is in each frame, from 0 to 1 (RMS of 16-bit PCM,
 * relative to the loudest frame). It moves the avatar's mouth: plan B of
 * docs/plan-piloto-automatico.md, a mouth that opens with the volume.
 */
export function wavLevels(wav: Uint8Array, fps: number): number[] {
  if (tag(wav, 0) !== "RIFF" || tag(wav, 8) !== "WAVE") throw new Error("Not a WAV file");
  const view = new DataView(wav.buffer, wav.byteOffset, wav.byteLength);
  let channels = 1;
  let rate = 0;
  let bits = 0;
  for (let offset = 12; offset + 8 <= wav.length; ) {
    const id = tag(wav, offset);
    const size = view.getUint32(offset + 4, true);
    if (id === "fmt ") {
      channels = view.getUint16(offset + 10, true);
      rate = view.getUint32(offset + 12, true);
      bits = view.getUint16(offset + 22, true);
    }
    if (id === "data") {
      if (bits !== 16) throw new Error(`wavLevels needs 16-bit PCM (got ${bits} bits)`);
      const end = size === 0 || size === 0xffffffff ? wav.length : Math.min(wav.length, offset + 8 + size);
      const frameBytes = 2 * channels;
      const perFrame = Math.round(rate / fps) * frameBytes;
      const levels: number[] = [];
      for (let start = offset + 8; start < end; start += perFrame) {
        let sum = 0;
        let n = 0;
        for (let i = start; i + 1 < Math.min(end, start + perFrame); i += frameBytes) {
          const s = view.getInt16(i, true) / 32768;
          sum += s * s;
          n++;
        }
        levels.push(n ? Math.sqrt(sum / n) : 0);
      }
      const peak = Math.max(...levels, 1e-6);
      return levels.map((l) => Math.round((l / peak) * 100) / 100);
    }
    offset += 8 + size + (size % 2);
  }
  throw new Error("WAV without a data chunk");
}
