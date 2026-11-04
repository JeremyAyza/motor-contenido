import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, describe, it } from "node:test";
import { allNew, freezeWarnings, grammarEntries, libraryReadme, loadLibrary, matchSpec, reuseShare, visualHash, type Ficha } from "../src/library.ts";
import type { VideoScript } from "../src/script.ts";
import type { Timeline } from "../src/timeline.ts";

const dir = mkdtempSync(join(tmpdir(), "library-"));
after(() => rmSync(dir, { recursive: true, force: true }));

const script = {
  world: "un jardín con flores",
  scenes: [
    { id: "gancho", say: "Hola", see: "Una flor tapada que gira", resource: "metafora-objetos", intent: "Que quieras saber qué flor es", metaphor: "una flor tapada" },
    { id: "lista", say: "Uno, dos", see: "Una lista que se marca con la voz", resource: "proceso", intent: "Ver los pasos en orden", metaphor: "una lista de compras" },
  ],
} as unknown as VideoScript;

const ficha: Ficha = {
  id: "lista-que-se-marca",
  capa: "escena",
  intencion: "Mostrar pasos en orden, marcándolos con la voz",
  usar_cuando: "Hay de 3 a 7 pasos con un orden",
  no_usar_cuando: "Hay un solo protagonista",
  parametros: ["items", "cues"],
  duracion: "4 a 12 s",
  etiquetas: { metafora: "lista", layout: "columna", movimiento: "marcar" },
  usos: { piezas: ["2026-11-02-x"], ultima: "2026-11-03" },
  estado: "biblioteca",
};

describe("the frozen visual script", () => {
  it("changes its hash when what is seen changes, not when the voice does", () => {
    const hash = visualHash(script);
    const voice = { ...script, scenes: script.scenes.map((s) => ({ ...s, say: `${s.say}!` })) } as VideoScript;
    assert.equal(visualHash(voice), hash);
    const seen = { ...script, scenes: script.scenes.map((s, i) => (i ? { ...s, metaphor: "una escalera" } : s)) } as VideoScript;
    assert.notEqual(visualHash(seen), hash);
    assert.deepEqual(freezeWarnings({ ...script, visualFrozen: { hash, date: "2026-11-03" } } as VideoScript), []);
    assert.equal(freezeWarnings({ ...seen, visualFrozen: { hash, date: "2026-11-03" } } as VideoScript).length, 1);
  });
});

describe("matching and reuse", () => {
  it("gives agy the visual script and the fichas as text, with 'nueva' as the default", () => {
    const spec = matchSpec(script, [ficha]);
    assert.match(spec, /lista-que-se-marca/);
    assert.match(spec, /Una lista que se marca con la voz/);
    assert.match(spec, /Es el veredicto por defecto ante la duda/);
    assert.deepEqual(allNew(script).escenas.map((e) => e.veredicto), ["nueva", "nueva"]);
  });

  it("measures the share of screen time that comes from the library", () => {
    const timeline = { scenes: [{ id: "gancho", durationMs: 3000 }, { id: "lista", durationMs: 1000 }] } as Timeline;
    const match = { escenas: [{ escena: "gancho", veredicto: "nueva" as const, candidatas: [] }, { escena: "lista", veredicto: "reutilizar" as const, candidatas: [] }] };
    assert.equal(reuseShare(match, timeline), 0.25);
  });
});

describe("the library index", () => {
  it("loads fichas, reports broken ones and lists the grammar from its doc comments", () => {
    mkdirSync(join(dir, "lista-que-se-marca"), { recursive: true });
    writeFileSync(join(dir, "lista-que-se-marca", "ficha.json"), JSON.stringify(ficha));
    mkdirSync(join(dir, "candidatas", "rota"), { recursive: true });
    writeFileSync(join(dir, "candidatas", "rota", "ficha.json"), JSON.stringify({ id: "rota" }));
    const entries = loadLibrary(dir);
    assert.equal(entries.length, 2);
    assert.equal(entries.filter((e) => e.errors.length).length, 1);
    const grammar = grammarEntries("/** 0 before at. */\nexport const fade = 1;\n/** A box. */\nexport function At() {}");
    assert.deepEqual(grammar.map((g) => g.name), ["fade", "At"]);
    const readme = libraryReadme(grammar, entries);
    assert.match(readme, /## Escenas \(1\)/);
    assert.match(readme, /Fichas con errores/);
  });
});
