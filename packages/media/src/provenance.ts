import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

/**
 * What a model made for a piece (content/<piece>/generated.json): which file,
 * with which provider, model and prompt, and when. It is how a piece knows
 * what is AI, for the AI label when publishing and for anyone who asks.
 * Voices are recorded next to their cached audio instead (cache.ts).
 */
export const GeneratedSchema = z.object({
  file: z.string().describe("Relative to the piece folder"),
  kind: z.enum(["image", "music"]),
  provider: z.string(),
  model: z.string(),
  prompt: z.string(),
  references: z.array(z.string()).default([]).describe("Reference files given to the model, relative to the piece folder"),
  sha256: z.string().regex(/^[0-9a-f]{64}$/),
  createdAt: z.iso.datetime({ offset: true }),
});
export type Generated = z.infer<typeof GeneratedSchema>;

export const GENERATED_FILE = "generated.json";

export function loadGenerated(pieceDir: string): Generated[] {
  const path = join(pieceDir, GENERATED_FILE);
  if (!existsSync(path)) return [];
  return z.array(GeneratedSchema).parse(JSON.parse(readFileSync(path, "utf8")));
}

/** Adds an entry, replacing the one of the same file: a regenerated file is a new file. */
export function recordGenerated(pieceDir: string, entry: Omit<Generated, "sha256" | "createdAt">, bytes: Uint8Array, now = new Date()): Generated {
  const generated: Generated = { ...entry, sha256: createHash("sha256").update(bytes).digest("hex"), createdAt: now.toISOString() };
  const entries = [...loadGenerated(pieceDir).filter((e) => e.file !== entry.file), generated];
  writeFileSync(join(pieceDir, GENERATED_FILE), JSON.stringify(entries, null, 2) + "\n");
  return generated;
}
