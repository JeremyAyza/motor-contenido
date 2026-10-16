import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { z } from "zod";
import { REPO_ROOT } from "../../brand/src/index.ts";
import { renderCarousel } from "./render.ts";
import { CarouselSchema } from "./schema.ts";
import { printIssues, validateCarousel } from "./validate.ts";

/**
 * CLI del flujo de carrusel. Cualquier agente o persona lo usa igual:
 *   carrusel validar <carousel.json>
 *   carrusel render  <carousel.json> [--out <carpeta>]
 *   carrusel esquema            (exporta el JSON Schema del contrato)
 */
const [command, file, ...rest] = process.argv.slice(2);

function readCarousel(path: string): unknown {
  return JSON.parse(readFileSync(resolve(path), "utf8"));
}

async function main(): Promise<number> {
  switch (command) {
    case "validar": {
      if (!file) throw new Error("Uso: carrusel validar <carousel.json>");
      const { issues } = validateCarousel(readCarousel(file));
      printIssues(issues);
      return issues.some((i) => i.level === "error") ? 1 : 0;
    }
    case "render": {
      if (!file) throw new Error("Uso: carrusel render <carousel.json> [--out <carpeta>]");
      const { carousel, issues } = validateCarousel(readCarousel(file));
      printIssues(issues);
      if (!carousel || issues.some((i) => i.level === "error")) return 1;
      const outFlag = rest.indexOf("--out");
      const outDir = outFlag >= 0 ? resolve(rest[outFlag + 1]) : join(dirname(resolve(file)), "out");
      const result = await renderCarousel(carousel, outDir);
      printIssues(result.issues);
      console.log(`\nLáminas en ${outDir}:`);
      for (const f of result.files) console.log(`  ${f}`);
      return result.issues.some((i) => i.level === "error") ? 1 : 0;
    }
    case "esquema": {
      const schema = z.toJSONSchema(CarouselSchema, { io: "input", unrepresentable: "any" });
      const out = join(REPO_ROOT, "schemas", "carousel.schema.json");
      writeFileSync(out, JSON.stringify(schema, null, 2) + "\n");
      console.log(`Esquema exportado en ${out}`);
      return 0;
    }
    default:
      console.log("Comandos: validar <archivo> | render <archivo> [--out carpeta] | esquema");
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
