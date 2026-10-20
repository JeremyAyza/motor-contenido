import type { WordTiming } from "./timeline.ts";

/**
 * Caption pages cut by phrase, not by time. A page never crosses the end of a
 * sentence. Inside a sentence the cut goes, in this order of preference:
 * after a comma, a colon or a semicolon; not after an article, a preposition
 * or a conjunction ("tu / tarjeta"); and never leaving a short word alone.
 * The three blind critics of the pilot flagged pages like "Y eso explica qué"
 * then "tarjeta", and "escena. Los reflejos".
 */

export type CaptionToken = { text: string; fromMs: number; toMs: number };
export type CaptionPage = { startMs: number; tokens: CaptionToken[] };

/** Characters per page: about one line of 27 px bold in the 385 px caption box. */
export const TARGET_CHARS = 18;
export const MAX_CHARS = 26;

const SENTENCE_END = /[.!?…]["»”)]*$/;
const SOFT_BREAK = /[,;:]["»”)]*$/;
// A page that ends in one of these leaves its word hanging from the next page.
const FUNCTION_WORDS = new Set([
  "el", "la", "los", "las", "lo", "un", "una", "unos", "unas", "al", "del",
  "de", "a", "en", "con", "sin", "por", "para", "sobre", "entre", "hacia", "desde", "hasta",
  "y", "e", "o", "u", "ni", "pero", "que", "si", "como", "porque", "cuando",
  "tu", "tus", "su", "sus", "mi", "mis", "se", "te", "le", "les", "me", "nos", "no", "es",
  "ese", "esa", "esos", "esas", "este", "esta", "estos", "estas", "todo", "toda", "todos", "todas",
  "casi", "muy", "más", "tan",
]);
// An acronym belongs to the word before it ("núcleos RT", "tarjeta RTX").
const ACRONYM = /^[A-Z]{2,}\d*\W*$/;

const bare = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

/** One sentence into pages, with the cheapest cuts (dynamic programming over the cut points). */
function pageSentence(words: WordTiming[]): WordTiming[][] {
  const n = words.length;
  const chars = (from: number, to: number) => words.slice(from, to).reduce((sum, w, i) => sum + w.text.length + (i ? 1 : 0), 0);
  const cost = (from: number, to: number) => {
    const len = chars(from, to);
    let c = ((len - TARGET_CHARS) / 4) ** 2 + 2;
    if (len > MAX_CHARS) c += to - from > 1 ? 1000 : 0;
    if (to - from === 1 && len < 9 && n > 1) c += 10;
    if (to < n) {
      const last = words[to - 1].text;
      if (SOFT_BREAK.test(last)) c -= 6;
      if (FUNCTION_WORDS.has(bare(last))) c += 12;
      if (ACRONYM.test(words[to].text)) c += 12;
    }
    return c;
  };
  const best = new Array<number>(n + 1).fill(Infinity);
  const cut = new Array<number>(n + 1).fill(0);
  best[0] = 0;
  for (let to = 1; to <= n; to++) {
    for (let from = 0; from < to; from++) {
      const total = best[from] + cost(from, to);
      if (total < best[to]) {
        best[to] = total;
        cut[to] = from;
      }
    }
  }
  const pages: WordTiming[][] = [];
  for (let to = n; to > 0; to = cut[to]) pages.unshift(words.slice(cut[to], to));
  return pages;
}

export function captionPages(words: WordTiming[]): CaptionPage[] {
  const sentences: WordTiming[][] = [];
  let current: WordTiming[] = [];
  for (const w of words) {
    current.push(w);
    if (SENTENCE_END.test(w.text)) {
      sentences.push(current);
      current = [];
    }
  }
  if (current.length) sentences.push(current);
  return sentences.flatMap(pageSentence).map((page) => ({
    startMs: page[0].startMs,
    tokens: page.map((w, i) => ({ text: `${i ? " " : ""}${w.text}`, fromMs: w.startMs, toMs: w.endMs })),
  }));
}
