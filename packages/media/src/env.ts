import { existsSync } from "node:fs";

/**
 * Loads a .env file into process.env, if it exists, and the .env.local next to
 * it (where the ElevenLabs CLI keeps its key). Keys live there, never in code or chat.
 */
export function loadEnv(path: string): void {
  for (const file of [path, `${path}.local`]) if (existsSync(file)) process.loadEnvFile(file);
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}. Add it to .env (see .env.example).`);
  return value;
}
