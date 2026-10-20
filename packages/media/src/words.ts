/**
 * Word helpers shared by Node and the browser (the video bundle), so they
 * import nothing.
 */

/** A word reduced to what is heard: no accents, no punctuation, lowercase. */
export const normalizeWord = (word: string) =>
  word
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");

/** Words of a script, with punctuation kept on the word it follows ("lámpara:"). */
export function scriptWords(script: string): string[] {
  const words: string[] = [];
  for (const raw of script.split(/\s+/).filter(Boolean)) {
    if (!normalizeWord(raw) && words.length) words[words.length - 1] += raw;
    else words.push(raw);
  }
  return words;
}
