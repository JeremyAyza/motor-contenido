import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { z } from "zod";
import { PublisherError } from "./errors.ts";

/**
 * - sending: the share button was about to be clicked; if it stays, the run died there.
 * - published: the platform confirmed the post.
 * - failed: it broke before sharing; nothing was posted.
 * - manual: someone posted it by hand and recorded it with `publisher mark`.
 */
export const STATUSES = ["sending", "published", "failed", "manual"] as const;
export type Status = (typeof STATUSES)[number];

export const EntrySchema = z.object({
  id: z.string().min(1),
  platform: z.string().min(1),
  account: z.string().min(1),
  status: z.enum(STATUSES),
  at: z.iso.datetime({ offset: true }),
  url: z.url().optional(),
  fingerprint: z.string().optional(),
  error: z.string().optional(),
  source: z.enum(["cli", "manual"]),
});
export type Entry = z.infer<typeof EntrySchema>;
export type Key = Pick<Entry, "id" | "platform" | "account">;

const keyOf = (e: Key) => JSON.stringify([e.id, e.platform, e.account]);

function findLast<T>(items: T[], match: (item: T) => boolean): T | undefined {
  for (let i = items.length - 1; i >= 0; i--) if (match(items[i])) return items[i];
  return undefined;
}

/** Local date and time with its UTC offset, such as 2026-10-18T19:02:11-05:00. */
export function timestamp(date = new Date()): string {
  const pad = (n: number) => String(Math.abs(n)).padStart(2, "0");
  const offset = -date.getTimezoneOffset();
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  return `${day}T${time}${offset < 0 ? "-" : "+"}${pad(Math.trunc(offset / 60))}:${pad(offset % 60)}`;
}

/**
 * Append-only log of publications, one JSON object per line. For each id,
 * platform and account, the last line is the current state.
 */
export class Registry {
  constructor(readonly file: string) {}

  entries(): Entry[] {
    if (!existsSync(this.file)) return [];
    return readFileSync(this.file, "utf8")
      .split(/\r?\n/)
      .flatMap((line, i) => {
        if (!line.trim()) return [];
        let raw: unknown;
        try {
          raw = JSON.parse(line);
        } catch {
          throw new PublisherError(`${this.file}:${i + 1} is not valid JSON`);
        }
        const result = EntrySchema.safeParse(raw);
        if (!result.success) throw new PublisherError(`${this.file}:${i + 1} is invalid:\n${z.prettifyError(result.error)}`);
        return [result.data];
      });
  }

  append(entry: Entry): void {
    const result = EntrySchema.safeParse(entry);
    if (!result.success) throw new PublisherError(`Invalid registry entry:\n${z.prettifyError(result.error)}`);
    // A hand-edited file may lack the final newline; without this the new line would glue onto the last one.
    const previous = existsSync(this.file) ? readFileSync(this.file, "utf8") : "";
    const glue = previous && !previous.endsWith("\n") ? "\n" : "";
    appendFileSync(this.file, `${glue}${JSON.stringify(result.data)}\n`);
  }

  latest(key: Key): Entry | undefined {
    return findLast(this.entries(), (e) => keyOf(e) === keyOf(key));
  }

  /** The current state of every publication, ordered by its last change. */
  current(): Entry[] {
    const byKey = new Map<string, Entry>();
    for (const entry of this.entries()) {
      byKey.delete(keyOf(entry));
      byKey.set(keyOf(entry), entry);
    }
    return [...byKey.values()];
  }

  /** The account's most recent confirmed post on the platform. */
  lastPublished(platform: string, account: string): Entry | undefined {
    return findLast(this.entries(), (e) => e.platform === platform && e.account === account && e.status === "published");
  }
}
