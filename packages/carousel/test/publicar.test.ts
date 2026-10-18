import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { describe, it } from "node:test";
import { REPO_ROOT } from "../../brand/src/index.ts";
import { prepararPublicacion } from "../src/publicar.ts";

const POST = JSON.parse(readFileSync(join(REPO_ROOT, "content/2026-10-17-top-3-comandos-claude-code/post.json"), "utf8"));

/** Una pieza con dos láminas renderizadas después de slides.tsx. */
function pieza({ aprobada = true, laminas = 2 } = {}): string {
  const dir = join(mkdtempSync(join(tmpdir(), "carrusel-")), "2026-10-18-prueba");
  mkdirSync(join(dir, "out"), { recursive: true });
  writeFileSync(join(dir, "post.json"), JSON.stringify({ ...POST, puertaB: { aprobado: aprobada } }));
  writeFileSync(join(dir, "slides.tsx"), "export default [];\n");
  utimesSync(join(dir, "slides.tsx"), new Date("2026-01-01T10:00:00"), new Date("2026-01-01T10:00:00"));
  const bloques = Array.from({ length: laminas }, (_, i) => `--- Lámina ${i + 1} (3 palabras)\nTexto de lámina`);
  writeFileSync(join(dir, "out", "texto-de-laminas.txt"), bloques.join("\n\n") + "\n");
  for (let i = 1; i <= laminas; i++) writeFileSync(join(dir, "out", `0${i}.png`), "png");
  return dir;
}

describe("prepararPublicacion", () => {
  it("arma el manifiesto con las láminas del render y el texto del post", () => {
    const dir = pieza();
    writeFileSync(join(dir, "out", "03.png"), "de un render anterior con más láminas");
    const { manifest, file } = prepararPublicacion(dir);
    assert.equal(manifest.id, "2026-10-18-prueba");
    assert.equal(manifest.account, POST.account);
    assert.equal(manifest.caption, POST.caption);
    assert.deepEqual(manifest.media.map((f) => basename(f)), ["01.png", "02.png"]);
    assert.deepEqual(JSON.parse(readFileSync(file, "utf8")).media, ["01.png", "02.png"]);
  });

  it("no corre sin la puerta B", () => {
    assert.throws(() => prepararPublicacion(pieza({ aprobada: false })), /La puerta B no está aprobada/);
  });

  it("no corre sin render", () => {
    const dir = pieza();
    writeFileSync(join(dir, "out", "texto-de-laminas.txt"), "");
    assert.throws(() => prepararPublicacion(dir), /no tiene láminas/);
  });

  it("no corre si falta una lámina o si slides.tsx cambió después del render", () => {
    const dir = pieza();
    writeFileSync(join(dir, "out", "texto-de-laminas.txt"), "--- Lámina 1\na\n\n--- Lámina 2\nb\n\n--- Lámina 3\nc\n");
    utimesSync(join(dir, "out", "01.png"), new Date("2026-01-01T09:00:00"), new Date("2026-01-01T09:00:00"));
    assert.throws(() => prepararPublicacion(dir), (e: Error) => /Faltan 03\.png/.test(e.message) && /01\.png son anteriores/.test(e.message));
  });
});
