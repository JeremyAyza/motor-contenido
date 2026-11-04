import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** The root of the repo, from this file's place in packages/tools/src. */
export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
