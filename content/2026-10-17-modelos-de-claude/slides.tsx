import { Logo, Nota, Slide } from "@motor/ui";

// No escribas este archivo hasta que la puerta A esté aprobada (brief.json).
// Lee workflows/carrusel.md y skills/carrusel-taste/SKILL.md antes de diseñar.
// La portada lleva el ancla visual grande (Logo, Icono o Img con ancla).
// La última lámina es la despedida de brief.json, que cierra la portada, y un solo CTA marcado con data-cta.
export default [
  <Slide swipe className="justify-between">
    <Logo slug="slug-de-simple-icons" size={160} />
    <h1 className="font-display text-7xl font-black leading-[0.9]">Gancho elegido</h1>
  </Slide>,
  <Slide>
    <h2 className="font-display text-5xl font-black leading-[0.95]">La despedida de brief.json</h2>
    <p data-cta className="mt-6 text-[26px] font-bold leading-tight">El CTA de brief.json</p>
    <Nota className="mt-auto">Info al 2026-10-17 · Fuentes: ...</Nota>
  </Slide>,
];
