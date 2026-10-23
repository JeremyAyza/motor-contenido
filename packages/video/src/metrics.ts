import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { REPO_ROOT } from "../../brand/src/index.ts";
import { SCRIPT_FILE, VideoScriptSchema, type VideoScript } from "./script.ts";

/**
 * Metrics of a published Reel (content/<piece>/video-metrics.json), copied
 * from Instagram Insights at 48 hours and at 7 days (workflows/metricas.md).
 * The names follow Insights in 2026: Views replaced Plays in April 2025, and
 * the skip rate arrived in 2026. Confirm them when Instagram changes them.
 */
const count = z.number().int().min(0);
const percent = z.number().min(0).max(100);

export const SnapshotSchema = z.object({
  day: z.number().int().min(1).max(90).describe("Days since publishing (2 and 7 at least)"),
  views: count.describe("Views: every time the Reel starts on screen, replays included"),
  reach: count.describe("Accounts reached"),
  nonFollowerReachPct: percent.optional().describe("Share of the reach that does not follow the account"),
  avgWatchSeconds: z.number().min(0).optional().describe("Average watch time, in seconds"),
  watchTimeSeconds: z.number().min(0).optional().describe("Total watch time, replays included, in seconds"),
  skipRate: percent.optional().describe("Skip rate: share of viewers who swiped away from the Reel"),
  likes: count,
  comments: count,
  shares: count.describe("Shares, sends by DM included"),
  saves: count,
  reposts: count.optional(),
  follows: count.optional().describe("Follows that came from this Reel"),
  profileVisits: count.optional(),
});

export const VideoMetricsSchema = z.object({
  $schema: z.string().optional(),
  publishedAt: z.iso.datetime({ offset: true }).describe("Date and time of publishing, with the time zone"),
  trial: z.boolean().default(false).describe("Published as a Trial Reel: shown first to people who do not follow the account"),
  tags: z
    .object({
      hookFormula: z.number().int().min(1).max(30).optional().describe("Formula id of the chosen hook; defaults to video.json → hooks[0].formula"),
      seconds: z.number().positive().optional().describe("Length of the published video (video:render prints it)"),
      scenes: z.number().int().min(1).optional().describe("Defaults to the scenes in video.json"),
      music: z.boolean().optional(),
      avatar: z.boolean().optional(),
    })
    .default({}),
  snapshots: z.array(SnapshotSchema).min(1),
  notes: z.string().trim().optional(),
});
export type VideoMetrics = z.infer<typeof VideoMetricsSchema>;

export const METRICS_FILE = "video-metrics.json";

export type MetricsRow = {
  piece: string;
  day: number;
  views: number;
  reach: number;
  nonFollowerReachPct?: number;
  skipRate?: number;
  /** Average watch time over the length of the video. */
  watchedPct?: number;
  sharesPct: number;
  savesPct: number;
  followsPct?: number;
  hookFormula?: number;
  seconds?: number;
  trial: boolean;
};

const pct = (a: number, b: number) => (b ? (a / b) * 100 : 0);
const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/** One row of the report: the snapshot closest to day 7, with the tags video.json can fill in. */
export function metricsRow(piece: string, metrics: VideoMetrics, script?: VideoScript): MetricsRow {
  const snap = [...metrics.snapshots].sort((a, b) => Math.abs(a.day - 7) - Math.abs(b.day - 7))[0];
  const seconds = metrics.tags.seconds;
  return {
    piece,
    day: snap.day,
    views: snap.views,
    reach: snap.reach,
    nonFollowerReachPct: snap.nonFollowerReachPct,
    skipRate: snap.skipRate,
    watchedPct: snap.avgWatchSeconds !== undefined && seconds ? pct(snap.avgWatchSeconds, seconds) : undefined,
    sharesPct: pct(snap.shares, snap.reach),
    savesPct: pct(snap.saves, snap.reach),
    followsPct: snap.follows === undefined ? undefined : pct(snap.follows, snap.reach),
    hookFormula: metrics.tags.hookFormula ?? script?.hooks[0].formula,
    seconds,
    trial: metrics.trial,
  };
}

/** Fewer pieces than this and there are no conclusions, as in workflows/metricas.md. */
export const MIN_PIECES = 15;

/** docs/metricas-video.md, in Spanish. Sorted by shares per reach, the strongest signal. */
export function metricsReport(rows: MetricsRow[], errors: string[] = []): string {
  const sorted = [...rows].sort((a, b) => b.sharesPct - a.sharesPct);
  const reachMedian = median(rows.map((r) => r.reach));
  const sharesMedian = median(rows.map((r) => r.sharesPct));
  const savesMedian = median(rows.map((r) => r.savesPct));
  const opt = (v: number | undefined, digits = 1) => (v === undefined ? "-" : v.toFixed(digits));
  const mark = (v: number, m: number) => `${v.toFixed(2)}${rows.length > 1 && v > m ? " ▲" : ""}`;
  const lines = [
    "# Métricas de los Reels",
    "",
    "Generado por `npm run video:metrics`. No lo edites a mano: cambia los `video-metrics.json` de cada pieza.",
    "",
    `${rows.length} Reel(s) con métricas. Se usa el corte más cercano al día 7. Mediana de alcance: ${Math.round(reachMedian)}.`,
    "",
  ];
  if (rows.length < MIN_PIECES) {
    lines.push(`Con ${rows.length} Reel(s) no hay conclusiones todavía: hacen falta al menos ${MIN_PIECES}. Esto es un registro, no un patrón.`, "");
  }
  lines.push(
    "| Pieza | Día | Vistas | Alcance | x mediana | No seguidores % | Saltos % | Visto % | Compartidos % | Guardados % | Seguidores % | Fórmula | Duración | Trial |",
    "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|",
  );
  for (const r of sorted) {
    const multiple = reachMedian ? (r.reach / reachMedian).toFixed(1) : "-";
    lines.push(
      `| ${r.piece} | ${r.day} | ${r.views} | ${r.reach} | ${multiple} | ${opt(r.nonFollowerReachPct)} | ${opt(r.skipRate)} | ${opt(r.watchedPct, 0)} | ${mark(r.sharesPct, sharesMedian)} | ${mark(r.savesPct, savesMedian)} | ${opt(r.followsPct, 2)} | ${r.hookFormula ?? "-"} | ${r.seconds === undefined ? "-" : `${Math.round(r.seconds)} s`} | ${r.trial ? "sí" : "no"} |`,
    );
  }
  lines.push(
    "",
    "▲ = por encima de la mediana de la cuenta. Visto % es el tiempo de reproducción promedio sobre la duración del video.",
    "",
    "Cómo se lee (workflows/metricas.md):",
    "- **Muchos saltos:** el problema es el gancho, es decir el primer cuadro y la primera frase.",
    "- **Pocos saltos y poco visto:** el video se cae en el medio.",
    "- **Mucho alcance y pocos seguidores:** el problema es el perfil, no el video.",
    "- **Trial Reels:** se comparan entre sí, porque se muestran primero a quien no sigue la cuenta.",
  );
  if (errors.length) lines.push("", "## Archivos con errores", "", ...errors.map((e) => `- ${e}`));
  return lines.join("\n") + "\n";
}

function scriptOf(dir: string): VideoScript | undefined {
  const file = join(dir, SCRIPT_FILE);
  if (!existsSync(file)) return undefined;
  const parsed = VideoScriptSchema.safeParse(JSON.parse(readFileSync(file, "utf8")));
  return parsed.success ? parsed.data : undefined;
}

/** Reads every content/<piece>/video-metrics.json and writes docs/metricas-video.md. */
export function writeMetricsReport(): { file: string; text: string; errors: string[] } {
  const root = join(REPO_ROOT, "content");
  const rows: MetricsRow[] = [];
  const errors: string[] = [];
  for (const piece of existsSync(root) ? readdirSync(root).sort() : []) {
    if (piece.startsWith("zz-")) continue; // local previews, as in the carousel
    const file = join(root, piece, METRICS_FILE);
    if (!existsSync(file)) continue;
    let raw: unknown;
    try {
      raw = JSON.parse(readFileSync(file, "utf8"));
    } catch (error) {
      errors.push(`${piece}: no es JSON válido (${(error as Error).message})`);
      continue;
    }
    const parsed = VideoMetricsSchema.safeParse(raw);
    if (!parsed.success) {
      errors.push(`${piece}: ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
      continue;
    }
    rows.push(metricsRow(piece, parsed.data, scriptOf(join(root, piece))));
  }
  const text = metricsReport(rows, errors);
  const file = join(REPO_ROOT, "docs", "metricas-video.md");
  writeFileSync(file, text);
  return { file, text, errors };
}
