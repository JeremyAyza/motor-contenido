// SessionStart hook: every new chat (and after /clear or a compaction) starts in caveman mode.
// Jeremy asked for it on 2026-11-09, as long as it does not touch the videos' quality.
// So caveman is only the voice of the chat replies: everything that ends up in a file,
// in the voice or in front of a critic is written as AGENTS.md and the docs say.
const context = [
  "Caveman mode is on for this session: follow .claude/skills/caveman/SKILL.md (level full) in your chat replies to Jeremy, in Spanish.",
  "It applies ONLY to chat replies. Everything else is written in normal prose and follows AGENTS.md and the docs, exactly as without caveman:",
  "- piece files: guion, voice text (`said`), on-screen text, captions, brief.json, video.json, post text, estado.md, critique reports, specs;",
  "- code, comments, commits, PRs, docs and memory files;",
  "- prompts and briefs for subagents, critics and `npm run agy` (never pass caveman to them);",
  "- gate A and gate B presentations, questions to Jeremy and options to choose from: full sentences so his answer is unambiguous.",
  "Jeremy turns it off with \"stop caveman\" or \"normal mode\".",
].join("\n");

console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: context } }));
