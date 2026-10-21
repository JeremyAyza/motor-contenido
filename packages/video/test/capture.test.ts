import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { CaptureSchema, cleanOutput, runCapture } from "../src/capture.ts";

const hasBash = spawnSync("bash", ["-c", "exit 0"]).status === 0;

describe("cleanOutput", () => {
  it("keeps the last state of a progress line, without colors", () => {
    assert.deepEqual(cleanOutput("Counting objects:  33% (1/3)\rCounting objects: 100% (3/3), done.\n\x1b[32mok\x1b[0m\n", "/tmp/x"), [
      "Counting objects: 100% (3/3), done.",
      "ok",
    ]);
  });

  it("hides the capture's folder and the home folder in every form", () => {
    const lines = cleanOutput("To C:/Users/Ana/cache/push/remoto.git\nfrom /c/Users/Ana/cache/push/app\nin C:\\Users\\Ana\\.gitconfig\n", "C:\\Users\\Ana\\cache\\push", "C:\\Users\\Ana");
    assert.deepEqual(lines, ["To ~/demo/remoto.git", "from ~/demo/app", "in ~\\.gitconfig"]);
  });
});

describe("runCapture", { skip: !hasBash && "bash is not available" }, () => {
  it("runs the setup, keeps only the shown steps and fixes git's author", () => {
    const capture = CaptureSchema.parse({
      id: "demo",
      about: "un commit de prueba",
      steps: [
        { cmd: "git init -q app", show: false },
        { cmd: "echo hola > a.txt && git add a.txt && git commit -q -m inicio", cwd: "app", show: false },
        { cmd: "git log --format='%an %ad' --date=short", cwd: "app" },
      ],
    });
    const result = runCapture(capture, mkdtempSync(join(tmpdir(), "capture-")));
    assert.equal(result.steps.length, 1);
    assert.deepEqual(result.steps[0], { cmd: "git log --format='%an %ad' --date=short", output: ["Dev 2026-10-20"], exitCode: 0 });
  });

  it("stops when a setup step fails", () => {
    const capture = CaptureSchema.parse({ id: "falla", about: "un paso que falla", steps: [{ cmd: "exit 3", show: false }, { cmd: "echo nunca" }] });
    assert.throws(() => runCapture(capture, mkdtempSync(join(tmpdir(), "capture-"))), /setup step "exit 3" failed \(exit 3\)/);
  });
});
