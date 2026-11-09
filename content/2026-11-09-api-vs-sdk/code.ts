// The code shown on screen. CURL, the SDK calls and RESPONSE_JSON follow OpenAI's docs as checked on
// 2026-11-09 (facts.json, facts 1, 3 and 7). HAND_JS is ours: an illustrative example of calling
// the same API by hand, labelled "Ejemplo ilustrativo" wherever it shows up. Its lines stay under
// 60 characters so they fit the editor at 12 px; the voice says how many lines it has (HAND_LINES).

export const RESPONSE_JSON = `{
  "id": "resp_67cc…",
  "object": "response",
  "status": "completed",
  "model": "gpt-6-astra",
  "output": [{
    "type": "message",
    "role": "assistant",
    "content": [{
      "type": "output_text",
      "text": "El cliente no puede pagar…"
    }]
  }]
}`;

export const HAND_JS = `const URL = "https://api.openai.com/v1/responses";
const KEY = process.env.OPENAI_API_KEY;

async function ask(input, tries = 3) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: \`Bearer \${KEY}\`,
        },
        body: JSON.stringify({
          model: "gpt-6-astra",
          input,
        }),
      });
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, 500 * i));
        continue;
      }
      if (!res.ok) throw new Error(\`OpenAI \${res.status}\`);
      const data = await res.json();
      return data.output
        .filter((item) => item.type === "message")
        .flatMap((item) => item.content)
        .filter((part) => part.type === "output_text")
        .map((part) => part.text)
        .join("");
    } catch (err) {
      if (i === tries) throw err;
      await new Promise((r) => setTimeout(r, 500 * i));
    }
  }
}`;

export const HAND_LINES = HAND_JS.split("\n").length;
