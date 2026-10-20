import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { z } from "zod";
import { REPO_ROOT } from "../../brand/src/index.ts";
import { postManifest } from "../../publisher/src/index.ts";
import { BriefSchema, loadBrief } from "./brief.ts";
import { prepararCritica } from "./critica.ts";
import { DIRECCIONES, historial, repartir, type Direccion } from "./direcciones.ts";
import { puertaA } from "./editorial.ts";
import { informeMetricas, MetricasSchema } from "./metricas.ts";
import { bajarObjeto, buscarObjetos } from "./objetos.ts";
import { PostSchema } from "./post.ts";
import { prepararPublicacion } from "./publicar.ts";
import { runPython } from "./python.ts";
import { renderPiece, type Issue } from "./render.tsx";
import { revisarTextos } from "./texto.ts";

/**
 * CLI del flujo de carrusel. Igual para cualquier agente o persona:
 *   carrusel nuevo <slug> [--cuenta dev]       crea la carpeta de la pieza (con brief.json)
 *   carrusel brief <carpeta>                   valida el brief, filtra los ganchos y arma la puerta A
 *   carrusel baraja [--cuenta dev] [--todas]   reparte 3 direcciones de arte
 *   carrusel logo <marca>                      busca el slug y el color oficial en Simple Icons
 *   carrusel objeto <nombre> [--3d]            baja un objeto de Fluent Emoji a assets/objetos (o lista parecidos)
 *   carrusel render <carpeta>                  valida, renderiza e inspecciona (láminas y textos)
 *   carrusel texto <carpeta>                   vuelve a revisar solo los textos, sin renderizar
 *   carrusel critica <carpeta>                 prepara la carpeta del crítico ciego
 *   carrusel publicar <carpeta> [--plataforma instagram] [--ensayo] [--forzar]
 *                                              publica con packages/publisher (puerta B aprobada)
 *   carrusel metricas                          informe de métricas de todas las piezas
 *   carrusel swipe <archivo.tsv>               ordena carruseles de referencia (docs/swipe.md)
 *   carrusel esquema                           exporta los JSON Schema
 */
// pnpm pasa el "--" literal; npm no. Se ignora para que los dos funcionen igual.
const [command, arg, ...rest] = process.argv.slice(2).filter((a) => a !== "--");

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
        join(dir, "brief.json"),
        JSON.stringify(
          {
            formato: "",
            tesis: "",
            porQueAhora: "",
            paraQuien: "",
            queGana: "",
            objetivo: "",
            compartirCon: "",
            ganchos: [],
            esqueleto: [],
            despedida: { jugada: "", texto: "" },
            cta: { tipo: "", forma: "", texto: "" },
            ctaAlternativas: [],
            puertaA: { aprobado: false },
          },
          null,
          2,
        ) + "\n",
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
              cierre: { tratamiento: "", gesto: "", porque: "" },
            },
            caption: "",
            busqueda: [],
            alt: "",
            slideCaptions: [],
            sources: [],
            puertaB: { aprobado: false },
          },
          null,
          2,
        ) + "\n",
      );
      writeFileSync(
        join(dir, "slides.tsx"),
        `import { Logo, Nota, Slide } from "@motor/ui";

// No escribas este archivo hasta que la puerta A esté aprobada (brief.json).
// Lee workflows/carrusel.md y skills/carrusel-taste/SKILL.md antes de diseñar.
// La portada lleva el ancla visual grande (Logo, Icono o Img con ancla).
// La última lámina es la despedida de brief.json, que cierra la portada, y un solo CTA marcado con data-cta,
// con el tratamiento visual de post.json → art.cierre (skills/carrusel-taste/cierres.json). Lo de abajo es
// solo el esqueleto: diséñala dentro de la dirección, con <Gesto> si el tratamiento lleva ícono.
export default [
  <Slide swipe className="justify-between">
    <Logo slug="slug-de-simple-icons" size={160} />
    <h1 className="font-display text-7xl font-black leading-[0.9]">Gancho elegido</h1>
  </Slide>,
  <Slide>
    <h2 className="font-display text-5xl font-black leading-[0.95]">La despedida de brief.json</h2>
    <p data-cta className="mt-6 text-[26px] font-bold leading-tight">El CTA de brief.json</p>
    <Nota className="mt-auto">Info al ${today()} · Fuentes: ...</Nota>
  </Slide>,
];
`,
      );
      console.log(`Pieza creada en ${dir}\nSigue con el paso 0: completa brief.json y corre carrusel:brief.`);
      return 0;
    }
    case "brief": {
      if (!arg) throw new Error("Uso: carrusel brief <carpeta-de-la-pieza>");
      const { file, text } = puertaA(resolve(arg));
      console.log(text);
      console.log(`Puerta A escrita en ${file}`);
      console.log(`Crítico ciego de ganchos: ${join(resolve(arg), "out", "critica-ganchos", "LEEME.md")}`);
      return 0;
    }
    case "texto": {
      if (!arg) throw new Error("Uso: carrusel texto <carpeta-de-la-pieza>");
      const dir = resolve(arg);
      const post = PostSchema.parse(JSON.parse(readFileSync(join(dir, "post.json"), "utf8")));
      const outDir = join(dir, "out");
      mkdirSync(join(outDir, ".build"), { recursive: true });
      const captionFile = join(outDir, "texto-del-post.txt");
      writeFileSync(captionFile, post.caption + "\n");
      const laminas = join(outDir, "texto-de-laminas.txt");
      const slideTexts = existsSync(laminas)
        ? readFileSync(laminas, "utf8").split(/^--- Lámina .*$/m).map((s) => s.trim()).filter(Boolean)
        : [];
      if (!slideTexts.length) console.log("! Sin texto de láminas: renderiza primero para revisarlas también.");
      const load = loadBrief(dir);
      const issues = revisarTextos({ outDir, captionFile, slideTexts, brief: load.status === "ok" ? load.brief : null, busqueda: post.busqueda });
      printIssues(issues);
      console.log(`\nDetalle: ${join(outDir, "revision-texto.txt")}`);
      return issues.some((i) => i.level === "error") ? 1 : 0;
    }
    case "critica": {
      if (!arg) throw new Error("Uso: carrusel critica <carpeta-de-la-pieza>");
      const { folder, files } = prepararCritica(resolve(arg));
      console.log(`Carpeta del crítico ciego: ${folder}`);
      console.log(`Archivos: ${files.join(", ")}`);
      console.log("\nAbre un contexto nuevo (subagente o sesión nueva) y dale solo esta carpeta: que lea LEEME.md y escriba informe.md.");
      return 0;
    }
    case "publicar": {
      if (!arg) throw new Error("Uso: carrusel publicar <carpeta-de-la-pieza> [--plataforma instagram] [--ensayo] [--forzar]");
      const { manifest, file } = prepararPublicacion(resolve(arg));
      const plataforma = flag("--plataforma", "instagram");
      console.log(`Manifiesto: ${file}`);
      const outcome = await postManifest({
        from: REPO_ROOT,
        platform: plataforma,
        manifest,
        dryRun: rest.includes("--ensayo"),
        force: rest.includes("--forzar"),
      });
      if (outcome.kind === "skipped") {
        const { status, at, url } = outcome.entry;
        console.log(`Ya está en ${plataforma} (${status}, ${at}${url ? `, ${url}` : ""}). Para publicarla otra vez: --forzar, solo si la persona lo pide.`);
      } else if (outcome.kind === "dry-run") {
        console.log(`Ensayo listo: se detuvo antes de Compartir. Captura: ${outcome.captures.join(", ")}`);
      } else if (outcome.url) {
        console.log(`Publicada: ${outcome.url}`);
      } else {
        console.log(
          `Publicada, pero no encontré la URL en el perfil. Anótala con: npm run publisher -- mark ${plataforma} --id ${manifest.id} --account ${manifest.account} --url <url>`,
        );
      }
      return 0;
    }
    case "metricas": {
      const { text, file, errores } = informeMetricas();
      console.log(text);
      console.log(`Informe escrito en ${file}`);
      return errores.length ? 1 : 0;
    }
    case "swipe": {
      if (!arg) throw new Error("Uso: carrusel swipe <archivo.tsv> (encabezados: cuenta, seguidores, mediana, megusta, portada)");
      const r = runPython("skills/ig-es/swipe_es.py", [resolve(arg), "--out", join(REPO_ROOT, "docs", "swipe.md")]);
      process.stdout.write(r.stdout);
      process.stderr.write(r.stderr);
      return r.ok ? 0 : 1;
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
    case "objeto": {
      const nombre = [arg, ...rest].filter((a) => a && !a.startsWith("--")).join(" ");
      if (!nombre) throw new Error("Uso: carrusel objeto <nombre en inglés> [--3d]   (ej.: backpack, light bulb, brain)");
      const estilo = rest.includes("--3d") ? "3d" : "color";
      const bajado = await bajarObjeto(nombre, estilo);
      if (bajado) {
        console.log(`Objeto en ${bajado.archivo}`);
        console.log(`Úsalo con <Objeto nombre="${bajado.slug}"${estilo === "3d" ? ' estilo="3d"' : ""} /> (Fluent Emoji, MIT)`);
        return 0;
      }
      const parecidos = await buscarObjetos(nombre);
      if (!parecidos.length) {
        console.log(`Ningún objeto de Fluent Emoji se llama parecido a "${nombre}". Prueba otra palabra en inglés.`);
        return 1;
      }
      console.log(`No hay uno llamado "${nombre}". Parecidos:`);
      for (const p of parecidos) console.log(`  ${p.slug.padEnd(30)} ${p.nombre}${p.tresD ? "" : "  (sin 3D)"}`);
      return 1;
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
      mkdirSync(join(REPO_ROOT, "schemas"), { recursive: true });
      const schemas = { post: PostSchema, brief: BriefSchema, metricas: MetricasSchema };
      for (const [name, schema] of Object.entries(schemas)) {
        const out = join(REPO_ROOT, "schemas", `${name}.schema.json`);
        writeFileSync(out, JSON.stringify(z.toJSONSchema(schema, { io: "input", unrepresentable: "any" }), null, 2) + "\n");
        console.log(`Esquema exportado en ${out}`);
      }
      return 0;
    }
    default:
      console.log(
        "Comandos: nuevo <slug> [--cuenta dev] | brief <carpeta> | baraja [--cuenta dev] [--todas] | logo <marca> | objeto <nombre> [--3d] | render <carpeta> | texto <carpeta> | critica <carpeta> | publicar <carpeta> [--plataforma instagram] [--ensayo] [--forzar] | metricas | swipe <tsv> | esquema",
      );
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
