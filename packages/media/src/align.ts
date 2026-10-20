import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import type { Caption } from "@remotion/captions";
import { downloadWhisperModel, installWhisperCpp, toCaptions, transcribe, type Language, type WhisperModel } from "@remotion/install-whisper-cpp";
import type { WordTiming } from "./speech.ts";
import { normalizeWord as normalize, scriptWords } from "./words.ts";

/** Port: when each word of a known text is said in an audio file. */
export interface Aligner {
  align(input: { audioPath: string; text: string; language: string }): Promise<WordTiming[]>;
}

/** Whisper tokens joined into words: a token that starts with a space starts a word. */
export function wordsFromCaptions(captions: Caption[]): WordTiming[] {
  const words: WordTiming[] = [];
  for (const { text, startMs, endMs } of captions) {
    if (!text.trim() || /^\s*\[_.*_\]\s*$/.test(text)) continue;
    const last = words[words.length - 1];
    if (!last || /^\s/.test(text)) words.push({ text: text.trim(), startMs, endMs });
    else {
      last.text += text;
      last.endMs = endMs;
    }
  }
  return words;
}

/**
 * The words of the script with the times of what the recognizer heard. The
 * captions show the script, not the transcript: the recognizer only provides
 * the timing. Words are matched with an edit-distance alignment, so a misheard
 * word ("rey" for "ray") still takes its slot; words with no match get times
 * interpolated between their neighbors, in proportion to their length.
 */
export function matchWords(script: string, heard: WordTiming[]): WordTiming[] {
  const words = scriptWords(script);
  const a = words.map(normalize);
  const b = heard.map((h) => normalize(h.text));
  const cost = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      cost[i][j] = Math.min(cost[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1), cost[i - 1][j] + 1, cost[i][j - 1] + 1);
    }
  }
  const times: Array<{ startMs: number; endMs: number } | null> = words.map(() => null);
  for (let i = a.length, j = b.length; i > 0 && j > 0; ) {
    if (cost[i][j] === cost[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) {
      times[i - 1] = { startMs: heard[j - 1].startMs, endMs: heard[j - 1].endMs };
      i--;
      j--;
    } else if (cost[i][j] === cost[i - 1][j] + 1) i--;
    else j--;
  }
  const endOfAudio = heard.length ? heard[heard.length - 1].endMs : 0;
  for (let i = 0; i < words.length; ) {
    if (times[i]) {
      i++;
      continue;
    }
    let k = i;
    while (k < words.length && !times[k]) k++;
    const from = i > 0 ? times[i - 1]!.endMs : 0;
    const to = k < words.length ? times[k]!.startMs : Math.max(endOfAudio, from);
    const weights = words.slice(i, k).map((w) => Math.max(normalize(w).length, 1));
    const total = weights.reduce((s, w) => s + w, 0);
    let at = from;
    for (let n = i; n < k; n++) {
      const span = ((to - from) * weights[n - i]) / total;
      times[n] = { startMs: Math.round(at), endMs: Math.round(at + span) };
      at += span;
    }
    i = k;
  }
  return words.map((text, i) => ({ text, ...times[i]! }));
}

/**
 * Local alignment with whisper.cpp (@remotion/install-whisper-cpp). On Windows
 * it downloads a prebuilt binary, and 1.5.5 is the newest one available there.
 */
export function whisperAligner({
  dir,
  ffmpeg,
  model = "small",
  version = "1.5.5",
}: {
  /** Cache folder: whisper.cpp goes in cpp/ and the models in models/. */
  dir: string;
  ffmpeg: string;
  model?: WhisperModel;
  version?: string;
}): Aligner {
  const whisperPath = join(dir, "cpp");
  const modelFolder = join(dir, "models");
  return {
    async align({ audioPath, text, language }) {
      await installWhisperCpp({ to: whisperPath, version, printOutput: false });
      mkdirSync(modelFolder, { recursive: true });
      await downloadWhisperModel({ model, folder: modelFolder, printOutput: false });
      const input = join(dir, `input-${process.pid}.wav`);
      const converted = spawnSync(ffmpeg, ["-loglevel", "error", "-y", "-i", audioPath, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", input], { encoding: "utf8" });
      if (converted.status !== 0) throw new Error(`ffmpeg could not convert ${audioPath}: ${(converted.stderr || "no details").trim()}`);
      try {
        const output = await transcribe({
          inputPath: input,
          whisperPath,
          whisperCppVersion: version,
          model,
          modelFolder,
          tokenLevelTimestamps: true,
          language: language as Language,
          printOutput: false,
        });
        return matchWords(text, wordsFromCaptions(toCaptions({ whisperCppOutput: output }).captions));
      } finally {
        rmSync(input, { force: true });
      }
    },
  };
}
