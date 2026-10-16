import type { AccountBrand } from "../../../brand/src/index.ts";
import type { Carousel, Slide } from "../schema.ts";

/** Medidas de lámina 4:5 recomendadas para el feed de Instagram. */
export const SLIDE_WIDTH = 1080;
export const SLIDE_HEIGHT = 1350;

const esc = (s: string) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

/** Pinta en color de acento el fragmento indicado, si aparece literal en el título. */
function withHighlight(title: string, highlight?: string): string {
  if (!highlight || !title.includes(highlight)) return esc(title);
  const [before, ...rest] = title.split(highlight);
  return `${esc(before)}<span class="hl">${esc(highlight)}</span>${esc(rest.join(highlight))}`;
}

function formatInfoDate(iso: string): string {
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${months[m - 1]} ${y}`;
}

const eyebrow = (s?: string) => (s ? `<p class="eyebrow">${esc(s)}</p>` : "");

function body(slide: Slide): string {
  switch (slide.type) {
    case "cover":
      return `
        <div class="cover">
          ${slide.kicker ? `<p class="kicker">${esc(slide.kicker)}</p>` : ""}
          <h1 class="cover-title" data-fit>${withHighlight(slide.title, slide.highlight)}</h1>
          ${
            slide.terminal?.length
              ? `<div class="terminal" data-fit-x><div class="dots"><i></i><i></i><i></i></div>${slide.terminal
                  .map((l) => `<p>${esc(l)}</p>`)
                  .join("")}</div>`
              : ""
          }
        </div>`;
    case "concept":
      return `
        ${eyebrow(slide.eyebrow)}
        <h2 class="title">${esc(slide.title)}</h2>
        <p class="lead">${esc(slide.body)}</p>
        ${
          slide.flow
            ? `<div class="flow">${slide.flow
                .map(
                  (f, i) =>
                    `${i > 0 ? '<span class="arrow">→</span>' : ""}<div class="node${i === 1 && slide.flow!.length === 3 ? " node-main" : ""}"><strong>${esc(f.label)}</strong>${f.note ? `<span>${esc(f.note)}</span>` : ""}</div>`,
                )
                .join("")}</div>`
            : ""
        }`;
    case "list":
      return `
        ${eyebrow(slide.eyebrow)}
        <h2 class="title">${esc(slide.title)}</h2>
        <ul class="items">${slide.items
          .map(
            (it) =>
              `<li><span class="mark">→</span><div><strong>${esc(it.label)}</strong>${it.detail ? `<span>${esc(it.detail)}</span>` : ""}</div></li>`,
          )
          .join("")}</ul>`;
    case "steps":
      return `
        ${eyebrow(slide.eyebrow)}
        <h2 class="title">${esc(slide.title)}</h2>
        <ol class="steps">${slide.steps
          .map(
            (s, i) =>
              `<li><span class="num">${i + 1}</span><div><strong>${esc(s.title)}</strong>${s.detail ? `<span>${esc(s.detail)}</span>` : ""}${s.code ? `<code data-fit-x>${esc(s.code)}</code>` : ""}</div></li>`,
          )
          .join("")}</ol>`;
    case "closing":
      return `
        ${eyebrow(slide.eyebrow)}
        <h2 class="title">${esc(slide.title)}</h2>
        ${slide.warning ? `<div class="warning"><strong>${esc(slide.warning.title)}</strong><span>${esc(slide.warning.text)}</span></div>` : ""}
        ${slide.points.length ? `<ul class="points">${slide.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
        <div class="cta"><strong>${esc(slide.cta.save)}</strong>${slide.cta.question ? `<span>${esc(slide.cta.question)}</span>` : ""}</div>`;
  }
}

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${SLIDE_WIDTH}px;height:${SLIDE_HEIGHT}px;background:var(--bg);color:var(--text);font-family:var(--sans);-webkit-font-smoothing:antialiased}
.slide{position:relative;width:${SLIDE_WIDTH}px;height:${SLIDE_HEIGHT}px;padding:72px 88px 64px;display:flex;flex-direction:column;overflow:hidden;
  background-image:radial-gradient(var(--line) 1.6px,transparent 1.6px);background-size:40px 40px;background-position:-8px -8px}
.slide::after{content:"";position:absolute;inset:0;background:radial-gradient(120% 70% at 85% 0%,color-mix(in srgb,var(--accent) 10%,transparent),transparent 60%);pointer-events:none}
header,footer{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;font-family:var(--mono);font-size:27px;color:var(--muted)}
header .brand{display:flex;align-items:center;gap:16px}
header .glyph{color:var(--accent);font-weight:600;font-size:32px}
footer{margin-top:28px}
footer .progress{display:flex;align-items:center;gap:18px}
footer .swipe{color:var(--accent)}
.content{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;justify-content:center;gap:40px;overflow:hidden;padding:24px 0}
.eyebrow{font-family:var(--mono);font-size:32px;color:var(--accent);font-weight:500}
.title{font-size:80px;line-height:1.04;font-weight:800;letter-spacing:-0.025em}
.lead{font-size:42px;line-height:1.38;color:var(--muted)}
.hl{color:var(--accent)}
.cover{display:flex;flex-direction:column;gap:44px}
.kicker{font-family:var(--mono);font-size:30px;color:var(--accent);font-weight:500}
.cover-title{font-size:108px;line-height:1;font-weight:800;letter-spacing:-0.035em}
.terminal{background:var(--surface);border:2px solid var(--line);border-radius:24px;padding:28px 36px 32px;font-family:var(--mono);font-size:30px;line-height:1.55;color:var(--text);overflow:hidden;white-space:nowrap}
.terminal .dots{display:flex;gap:10px;margin-bottom:16px}
.terminal .dots i{width:14px;height:14px;border-radius:50%;background:var(--line)}
.terminal p:first-of-type{color:var(--accent)}
.flow{display:flex;flex-direction:column;align-items:stretch;gap:10px}
.flow .node{background:var(--surface);border:2px solid var(--line);border-radius:22px;padding:28px 34px;display:flex;align-items:baseline;justify-content:space-between;gap:24px}
.flow .node-main{border-color:var(--accent)}
.flow .node strong{font-size:42px;font-weight:700}
.flow .node span{font-size:32px;color:var(--muted);line-height:1.3;text-align:right}
.flow .arrow{align-self:center;color:var(--accent);font-size:40px;font-family:var(--mono);transform:rotate(90deg);line-height:1}
.items,.steps,.points{list-style:none;display:flex;flex-direction:column;gap:34px}
.items li{display:flex;gap:22px;align-items:flex-start}
.items .mark{font-family:var(--mono);color:var(--accent);font-size:42px;line-height:1.2}
.items li div,.steps li div{display:flex;flex-direction:column;gap:6px}
.items strong{font-size:44px;font-weight:700;line-height:1.2}
.items li span:not(.mark){font-size:34px;color:var(--muted);line-height:1.32}
.steps li{display:flex;gap:26px;align-items:flex-start}
.steps .num{flex:none;width:68px;height:68px;border-radius:50%;background:var(--accent);color:var(--bg);font-weight:800;font-size:34px;display:flex;align-items:center;justify-content:center}
.steps strong{font-size:46px;font-weight:700;line-height:1.18}
.steps li span{font-size:35px;color:var(--muted);line-height:1.34}
.steps code{margin-top:10px;align-self:flex-start;font-family:var(--mono);font-size:34px;background:var(--surface);border:2px solid var(--line);border-radius:12px;padding:8px 16px;color:var(--accent);white-space:nowrap;overflow:hidden;max-width:100%}
.warning{border:2px solid var(--warning);border-radius:22px;padding:28px 32px;display:flex;flex-direction:column;gap:10px;background:color-mix(in srgb,var(--warning) 8%,transparent)}
.warning strong{color:var(--warning);font-size:38px;font-weight:700}
.warning span{font-size:38px;line-height:1.36}
.points li{font-size:36px;line-height:1.35;padding-left:34px;position:relative;color:var(--muted)}
.points li::before{content:"✓";position:absolute;left:0;color:var(--accent);font-weight:700}
.cta{border-top:2px solid var(--line);padding-top:30px;display:flex;flex-direction:column;gap:10px}
.cta strong{font-size:56px;font-weight:800;color:var(--accent);letter-spacing:-0.01em}
.cta span{font-size:40px;color:var(--text)}
`;

/** HTML completo de una lámina, listo para fotografiarse a 1080×1350. */
export function slideHtml(opts: {
  carousel: Carousel;
  brand: AccountBrand;
  index: number;
  fontCss: string;
  varsCss: string;
}): string {
  const { carousel, brand, index, fontCss, varsCss } = opts;
  const slide = carousel.slides[index];
  const total = carousel.slides.length;
  const isLast = index === total - 1;
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<style>${fontCss}${varsCss}${CSS}</style></head>
<body><main class="slide slide-${slide.type}">
  <header><div class="brand"><span class="glyph">${esc(brand.glyph)}</span><span>${esc(brand.name)}</span></div><span>info al ${formatInfoDate(carousel.infoDate)}</span></header>
  <section class="content" data-content>${body(slide)}</section>
  <footer><span>${esc(brand.handle)}</span><span class="progress"><span>${index + 1}/${total}</span>${isLast ? "" : '<span class="swipe">desliza →</span>'}</span></footer>
</main></body></html>`;
}

/** Hoja de revisión: todas las láminas en una sola imagen. */
export function contactSheetHtml(images: string[], brand: AccountBrand, varsCss: string): string {
  const thumbs = images.map((src, i) => `<figure><img src="${src}"><figcaption>${i + 1}</figcaption></figure>`).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><style>${varsCss}
*{margin:0;box-sizing:border-box}body{background:#05080f;padding:40px;font-family:monospace;color:#A3B0C2}
.grid{display:grid;grid-template-columns:repeat(3,360px);gap:28px}
figure{display:flex;flex-direction:column;gap:8px}img{width:360px;height:450px;border-radius:10px;display:block}
figcaption{font-size:18px}h1{font-size:20px;margin-bottom:24px;font-weight:400}</style></head>
<body><h1>${esc(brand.handle)} · hoja de revisión</h1><div class="grid">${thumbs}</div></body></html>`;
}
