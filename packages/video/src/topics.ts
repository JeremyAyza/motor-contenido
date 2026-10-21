import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/*
 * Repeated topics. The reference account lost 10 times the views when it
 * repeated a topic a few days later (docs/analisis-rick-theengineer.md), so
 * video:script warns when a piece of the last two weeks had a similar topic.
 */

/** How far back a repeated topic counts, in days, by the date of the folders. */
export const REPEAT_DAYS = 14;

const STOPWORDS = new Set(
  (
    "a al como con cual cuando de del el ella en entre es esa ese eso esta este esto la las le lo los mas más mi mis muy " +
    "no o para pero por porque que qué se si sin sobre su sus te tu tus un una uno unos unas y ya yo " +
    "the of and to in on for is it what how why vs"
  ).split(" "),
);

const plain = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** The words that say what a topic is about: without accents, articles, prepositions or one-letter words. */
export function topicWords(topic: string): Set<string> {
  return new Set(
    plain(topic)
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 1 && !STOPWORDS.has(w)),
  );
}

/** Two topics are alike when they share two words, or half of their words. */
export function similarTopics(a: string, b: string): boolean {
  const [x, y] = [topicWords(a), topicWords(b)];
  const shared = [...x].filter((w) => y.has(w)).length;
  const union = new Set([...x, ...y]).size;
  return shared >= 2 || (union > 0 && shared / union >= 0.5);
}

const DATE = /^(\d{4}-\d{2}-\d{2})-/;

function topicOf(dir: string): string | undefined {
  for (const file of ["video.json", "post.json"]) {
    const path = join(dir, file);
    if (!existsSync(path)) continue;
    try {
      const topic = JSON.parse(readFileSync(path, "utf8")).topic;
      if (typeof topic === "string" && topic.trim()) return topic;
    } catch {
      // A file half written does not stop the check.
    }
  }
  return undefined;
}

/**
 * The pieces of the REPEAT_DAYS days before this one (and of the same day)
 * whose topic looks like `topic`, from video.json → topic or post.json → topic.
 */
export function recentSimilar(contentRoot: string, piece: string, topic: string, days = REPEAT_DAYS): Array<{ piece: string; topic: string }> {
  const own = DATE.exec(piece)?.[1];
  if (!own || !existsSync(contentRoot)) return [];
  const until = Date.parse(own);
  const since = until - days * 24 * 60 * 60 * 1000;
  const found: Array<{ piece: string; topic: string }> = [];
  for (const other of readdirSync(contentRoot).sort().reverse()) {
    const date = DATE.exec(other)?.[1];
    if (other === piece || !date) continue;
    const when = Date.parse(date);
    if (when < since || when > until) continue;
    const theirs = topicOf(join(contentRoot, other));
    if (theirs && similarTopics(topic, theirs)) found.push({ piece: other, topic: theirs });
  }
  return found;
}
