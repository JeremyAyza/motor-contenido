import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { z } from "zod";
import { REPO_ROOT } from "../../brand/src/index.ts";
import { PostSchema } from "./post.ts";
import { renderPiece, type Issue } from "./render.tsx";

/**
 * CLI del flujo de carrusel. Igual para cualquier agente o persona:
 *   carrusel nuevo <slug> [--cuenta dev]   crea la carpeta de la pieza
 *   carrusel render <carpeta>              valida, renderiza e inspecciona
 *   carrusel esquema                        exporta el JSON Schema de post.json
 */
const [command, arg, ...rest] = process.argv.slice(2);

function printIssues(issues: Issue[]): void {
  if (!issues.length) return console.log("✓ Sin problemas");
  for (const i of issues) console.log(`${i.level === "error" ? "✗" : "!"} [${i.level}] ${i.where}: ${i.message}`);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

async function main(): Promise<number> {
  switch (command) {
    case "nuevo": {
      if (!arg) throw new Error("Uso: carrusel nuevo <slug> [--cuenta dev]");
      const accFlag = rest.indexOf("--cuenta");
      const account = accFlag >= 0 ? rest[accFlag + 1] : "dev";
      const dir = join(REPO_ROOT, "content", `${today()}-${arg}`);
      if (existsSync(dir)) throw new Error(`Ya existe ${dir}`);
      mkdirSync(dir, { recursive: true });
      writeFileSync(
        join(dir, "facts.json"),
        JSON.stringify({ topic: arg, checkedAt: today(), facts: [], pendingToVerify: [] }, null, 2) + "\n",
      );
      writeFileSync(
        join(dir, "post.json"),
        JSON.stringify(
          { account, topic: arg, infoDate: today(), idea: "", caption: "", slideCaptions: [], sources: [] },
          null,
          2,
        ) + "\n",
      );
      writeFileSync(
        join(dir, "slides.tsx"),
        `import { Slide } from "@motor/ui";

// Diseño libre. Lee workflows/carrusel.md antes de escribir esta lámina.
export default [
  <Slide swipe>
    <h1 className="text-5xl font-extrabold tracking-tight">Título</h1>
  </Slide>,
];
`,
      );
      console.log(`Pieza creada en ${dir}`);
      return 0;
    }
    case "render": {
      if (!arg) throw new Error("Uso: carrusel render <carpeta-de-la-pieza>");
      const { files, issues } = await renderPiece(resolve(arg));
      printIssues(issues);
      console.log(`\nArchivos:`);
      for (const f of files) console.log(`  ${f}`);
      return issues.some((i) => i.level === "error") ? 1 : 0;
    }
    case "esquema": {
      const schema = z.toJSONSchema(PostSchema, { io: "input", unrepresentable: "any" });
      const out = join(REPO_ROOT, "schemas", "post.schema.json");
      mkdirSync(join(REPO_ROOT, "schemas"), { recursive: true });
      writeFileSync(out, JSON.stringify(schema, null, 2) + "\n");
      console.log(`Esquema exportado en ${out}`);
      return 0;
    }
    default:
      console.log("Comandos: nuevo <slug> [--cuenta dev] | render <carpeta> | esquema");
      return command ? 1 : 0;
  }
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  },
);
