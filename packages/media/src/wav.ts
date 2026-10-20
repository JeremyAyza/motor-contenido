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
