import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { z } from "zod";
import { REPO_ROOT } from "../../brand/src/index.ts";
import { DIRECCIONES, historial, repartir, type Direccion } from "./direcciones.ts";
import { PostSchema } from "./post.ts";
import { renderPiece, type Issue } from "./render.tsx";

/**
 * CLI del flujo de carrusel. Igual para cualquier agente o persona:
 *   carrusel nuevo <slug> [--cuenta dev]       crea la carpeta de la pieza
 *   carrusel baraja [--cuenta dev] [--todas]   reparte 3 direcciones de arte
 *   carrusel logo <marca>                      busca el slug y el color oficial en Simple Icons
 *   carrusel render <carpeta>                  valida, renderiza e inspecciona
 *   carrusel esquema                           exporta el JSON Schema de post.json
 */
const [command, arg, ...rest] = process.argv.slice(2);

function printIssues(issues: Issue[]): void {
  if (!issues.length) return console.log("✓ Sin problemas");
  for (const i of issues) console.log(`${i.level === "error" ? "✗" : "!"} [${i.level}] ${i.where}: ${i.message}`);
}

function flag(name: string, fallback: string): string {
  const all = [arg, ...rest];
  const i = all.indexOf(name);
  return i >= 0 && all[i + 1] ? all[i + 1] : fallback;
}

function printDireccion(d: Direccion): void {
  console.log(`\n■ ${d.nombre}  (${d.id})`);
  console.log(`  Idea:        ${d.idea}`);
  console.log(`  Cuándo:      ${d.cuando}`);
  console.log(`  Portada:     ${d.portada}`);
  console.log(`  Interior:    ${d.interior}`);
  console.log(`  Tipografías: ${d.tipografias.join(", ")}`);
  console.log(`  Paleta:      ${d.paleta}`);
  console.log(`  Evitar:      ${d.evitar}`);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

async function main(): Promise<number> {
  switch (command) {
    case "nuevo": {
      if (!arg) throw new Error("Uso: carrusel nuevo <slug> [--cuenta dev]");
      const account = flag("--cuenta", "dev");
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
          {
            account,
            topic: arg,
            infoDate: today(),
            idea: "",
            art: {
              direction: "",
              dealt: [],
              reason: "",
              borrowed: [],
              palette: { bg: "#", ink: "#", accent: "#", accentInk: "#" },
              fonts: { display: "", text: "geist" },
              anchor: { kind: "logo", ref: "", source: "" },
            },
            caption: "",
            slideCaptions: [],
            sources: [],
          },
          null,
          2,
        ) + "\n",
      );
      writeFileSync(
        join(dir, "slides.tsx"),
        `import { Logo, Slide } from "@motor/ui";

// Lee workflows/carrusel.md y skills/carrusel-taste/SKILL.md antes de diseñar.
// La portada lleva el ancla visual grande (Logo, Icono o Img con ancla).
export default [
  <Slide swipe className="justify-between">
    <Logo slug="slug-de-simple-icons" size={160} />
    <h1 className="font-display text-7xl font-black leading-[0.9]">Título</h1>
  </Slide>,
];
`,
      );
      console.log(`Pieza creada en ${dir}`);
      return 0;
    }
    case "baraja": {
      const account = arg && !arg.startsWith("--") ? arg : flag("--cuenta", "dev");
      if ([arg, ...rest].includes("--todas")) {
        for (const d of DIRECCIONES) printDireccion(d);
        return 0;
      }
      const { mano, recientes } = repartir(account, 3);
      const usadas = historial(account).slice(0, 5);
      console.log(`Cuenta: ${account}`);
      console.log(usadas.length ? `Últimas usadas: ${usadas.map((u) => `${u.direccion} (${u.pieza})`).join(", ")}` : "Sin historial todavía.");
      if (recientes.length) console.log(`Fuera de esta mano por ser recientes: ${recientes.join(", ")}`);
      console.log(`\nTe tocaron estas ${mano.length}. Elige la que mejor sirva al tema y anota en post.json → art: direction, dealt y reason.`);
      for (const d of mano) printDireccion(d);
      console.log(`\ndealt: ${JSON.stringify(mano.map((d) => d.id))}`);
      return 0;
    }
    case "logo": {
      if (!arg) throw new Error("Uso: carrusel logo <marca>");
      const all = JSON.parse(
        readFileSync(join(REPO_ROOT, "node_modules/simple-icons/data/simple-icons.json"), "utf8"),
      ) as { title: string; slug: string; hex: string; guidelines?: string }[];
      const q = arg.toLowerCase();
      const hits = all.filter((i) => i.slug.includes(q) || i.title.toLowerCase().includes(q)).slice(0, 15);
      if (!hits.length) console.log("Sin resultados en Simple Icons. Usa una captura real o un <Icono> genérico.");
      for (const h of hits) console.log(`${h.slug.padEnd(28)} #${h.hex}  ${h.title}${h.guidelines ? `  · guías: ${h.guidelines}` : ""}`);
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
      console.log("Comandos: nuevo <slug> [--cuenta dev] | baraja [--cuenta dev] [--todas] | logo <marca> | render <carpeta> | esquema");
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
