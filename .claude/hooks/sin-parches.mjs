// PreToolUse hook (Bash and PowerShell): refuses patch scripts on a piece's scenes.
// AGENTS.md: the main agent does not write patch scripts. A one-off change goes
// through Edit; a mechanical fix with a closed spec goes to `npm run agy`.
// Reading a .tsx with a shell command is fine; rewriting it in place is not.
import { readFileSync } from "node:fs";

const input = JSON.parse(readFileSync(0, "utf8") || "{}");
const command = String(input.tool_input?.command ?? "");
const cwd = String(input.cwd ?? "").replaceAll("\\", "/");

const touchesPiece = /content\/[^\s'"]*|scenes\//.test(command) || /\/content\/[^/]+/.test(cwd);
const tsx = /\.tsx\b/.test(command);
const rewrites = [
  /\bsed\b[^|;&]*\s-[a-zA-Z]*i/, // sed -i, sed -Ei
  /\bperl\b[^|;&]*\s-[a-zA-Z]*i/, // perl -pi
  /\bpython3?\b[\s\S]*(open\([^)]*['"][wa]['"]|write_text|\.write\()/, // a Python script that writes
  /\bnode\b[\s\S]*writeFileSync/, // a Node script that writes
  /\b(Set-Content|Out-File)\b/, // PowerShell
];

if (touchesPiece && tsx && rewrites.some((r) => r.test(command))) {
  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason:
          "AGENTS.md: no patch scripts on a piece's .tsx. A one-off change goes through Edit (read the file first). " +
          "Mechanical fixes (margins, positions, sizes, renames) go in a spec to `npm run agy -- <spec.md> --pieza content/<pieza>`, in the background.",
      },
    }),
  );
}
