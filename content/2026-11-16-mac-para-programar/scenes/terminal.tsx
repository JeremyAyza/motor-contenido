import { Logo } from "@motor/ui";
import { Stamp, useCue } from "@motor/video";
import { Layer, PopIn, TermLines, Win } from "../parts.tsx";
import { ACCENT, INK, LINE, WIN } from "../world.tsx";

const FILES: Array<{ name: string; slug: string; word: string }> = [
  { name: "app.py", slug: "python", word: "python" },
  { name: "server.js", slug: "javascript", word: "javascript" },
  { name: "main.go", slug: "go", word: "go" },
  { name: "main.rs", slug: "rust", word: "rust" },
];

/** The tools of every day are already in the terminal; Homebrew installs the languages; no Linux on the side. */
export function Terminal() {
  const terminal = useCue("terminal");
  const ssh = useCue("ssh");
  const grep = useCue("grep");
  const curl = useCue("curl");
  const git = useCue("git");
  const homebrew = useCue("homebrew");
  const words: Record<string, number> = { python: useCue("python"), javascript: useCue("javascript"), go: useCue("go"), rust: useCue("rust") };
  const aparte = useCue("aparte");
  const tools = [
    { name: "ssh", at: ssh },
    { name: "grep", at: grep },
    { name: "curl", at: curl },
    { name: "git", at: git },
  ];
  return (
    <Layer>
      <Win x={116} y={96} w={388} h={334} title="~/code/api — -zsh" at={0} bodyStyle={{ padding: "10px 14px" }}>
        <TermLines
          size={14}
          lines={[
            { text: "cd ~/code/api", at: terminal, kind: "cmd" },
            { text: "ssh prod-api", at: ssh - 0.1, kind: "cmd" },
            { text: "grep -r TODO src", at: grep - 0.1, kind: "cmd" },
            { text: "src/api.ts:42: // TODO: cache", at: grep + 0.25 },
            { text: "curl -s api.dev/health", at: curl, kind: "cmd" },
            { text: '{"status":"ok"}', at: curl + 0.35, kind: "ok" },
            { text: "git push", at: git, kind: "cmd" },
            { text: "   7b2d4e0  main -> main", at: git + 0.35 },
            { text: "brew install python node go rust", at: homebrew - 0.1, kind: "cmd" },
            { text: "==> Installing python@3.13", at: words.python, kind: "warn" },
            { text: "==> Installing node 23.1.0", at: words.javascript, kind: "warn" },
            { text: "==> Installing go 1.23.3", at: words.go, kind: "warn" },
            { text: "==> Installing rust 1.82.0", at: words.rust, kind: "warn" },
          ]}
        />
      </Win>
      {tools.map((tool, i) => (
        <PopIn key={tool.name} x={184 + i * 82} y={444} at={tool.at}>
          <div className="rounded-[8px] px-[12px] py-[5px] font-mono text-[22px] font-bold" style={{ width: 74, textAlign: "center", background: WIN, color: INK, border: `1px solid ${ACCENT}` }}>
            {tool.name}
          </div>
        </PopIn>
      ))}
      <Win x={184} y={504} w={320} h={286} title="api" at={terminal} bodyStyle={{ padding: "14px 12px" }}>
        <div className="grid grid-cols-2 gap-x-[10px] gap-y-[10px]">
          {["Dockerfile", "README.md", "src"].map((name) => (
            <div key={name} data-ui="" className="flex items-center gap-[10px] rounded-[10px] px-[10px] py-[8px]" style={{ border: `1px solid ${LINE}` }}>
              <span className="block h-[28px] w-[22px] rounded-[4px]" style={{ background: name === "src" ? "#5FA8F5" : "#3A3F4B" }} />
              <span className="font-mono text-[16px]" style={{ color: INK }}>{name}</span>
            </div>
          ))}
          {FILES.map((f) => (
            <PopIn key={f.name} x={0} y={0} at={words[f.word]} style={{ position: "relative" }}>
              <div data-ui="" className="flex items-center gap-[10px] rounded-[10px] px-[10px] py-[8px]" style={{ background: "#22262E", border: `1px solid ${LINE}` }}>
                <Logo slug={f.slug} size={28} ancla={false} />
                <span className="font-mono text-[16px]" style={{ color: INK }}>{f.name}</span>
              </div>
            </PopIn>
          ))}
        </div>
      </Win>
      <Stamp at={aparte} x={306} y={300} size={26} rotate={-6} color={ACCENT} fill="#0B0D12">
        Sin Linux aparte
      </Stamp>
    </Layer>
  );
}
