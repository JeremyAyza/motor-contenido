import { existsSync } from "node:fs";

/** Loads a .env file into process.env, if it exists. Keys live there, never in code or chat. */
export function loadEnv(path: string): void {
  if (existsSync(path)) process.loadEnvFile(path);
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}. Add it to .env (see .env.example).`);
  return value;
}
