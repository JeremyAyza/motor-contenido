import type { SpeechProvider, SpeechRequest, SpeechResult } from "../speech.ts";

/*
 * ElevenLabs through kie.ai (https://docs.kie.ai/market/elevenlabs/text-to-speech-multilingual-v2).
 * kie runs generation as a task: create it, poll it, download the result. Its
 * voices are the ids of its list, not the ElevenLabs account's.
 */

export const KIE_TTS_MODEL = "elevenlabs/text-to-speech-multilingual-v2";
const API = "https://api.kie.ai/api/v1/jobs";
const POLL_MS = 2000;
const TIMEOUT_MS = 5 * 60_000;

/** The voice settings kie forwards to ElevenLabs. Steadier voices sound the same from one scene to the next. */
const DEFAULT_SETTINGS = { stability: 0.6, similarity_boost: 0.8, style: 0, speed: 1 };

type Fetch = typeof fetch;

/** kie answers HTTP 200 even on errors: the outcome is in `code`. */
async function call<T>(doFetch: Fetch, apiKey: string, path: string, body?: object): Promise<T> {
  const res = await doFetch(`${API}/${path}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: body && JSON.stringify(body),
  });
  const json = (await res.json()) as { code: number; msg: string; data: T };
  if (json.code !== 200) throw new Error(`kie ${path.split("?")[0]}: ${json.code} ${json.msg}`);
  return json.data;
}

export function kieSpeech({
  apiKey,
  model = KIE_TTS_MODEL,
  doFetch = fetch,
  pollMs = POLL_MS,
}: {
  apiKey: string;
  model?: string;
  doFetch?: Fetch;
  pollMs?: number;
}): SpeechProvider {
  return {
    id: "kie-elevenlabs",
    model,
    async synthesize({ text, voice, previousText, nextText, settings }: SpeechRequest): Promise<SpeechResult> {
      const input = { text, voice, ...DEFAULT_SETTINGS, ...settings, previous_text: previousText ?? "", next_text: nextText ?? "" };
      const { taskId } = await call<{ taskId: string }>(doFetch, apiKey, "createTask", { model, input });
      for (const start = Date.now(); Date.now() - start < TIMEOUT_MS; ) {
        await new Promise((resolve) => setTimeout(resolve, pollMs));
        const task = await call<{ state: string; resultJson?: string; failMsg?: string }>(doFetch, apiKey, `recordInfo?taskId=${taskId}`);
        if (task.state === "fail") throw new Error(`kie ${model}, task ${taskId}: ${task.failMsg}`);
        if (task.state !== "success" || !task.resultJson) continue;
        const url = (JSON.parse(task.resultJson) as { resultUrls?: string[] }).resultUrls?.[0];
        if (!url) throw new Error(`kie ${model}, task ${taskId}: no audio in the result`);
        const audio = await doFetch(url);
        if (!audio.ok) throw new Error(`kie ${model}, download: HTTP ${audio.status}`);
        // Generated files expire after 14 days on kie: the cache keeps the copy.
        return { audio: new Uint8Array(await audio.arrayBuffer()), format: "mp3" };
      }
      throw new Error(`kie ${model}, task ${taskId}: no result after ${TIMEOUT_MS / 60_000} min`);
    },
  };
}
