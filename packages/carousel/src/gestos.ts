/** Gestos de Instagram y su ícono genérico de Lucide (no son copias de los íconos de Instagram). */
export const GESTOS = {
  guardar: "bookmark",
  enviar: "send",
  comentar: "message-circle",
  "me-gusta": "heart",
  seguir: "user-plus",
  repostear: "repeat-2",
} as const;
export type Gesto = keyof typeof GESTOS;
export const GESTO_IDS = Object.keys(GESTOS) as [Gesto, ...Gesto[]];
/** El gesto que corresponde a cada tipo de CTA. */
export const GESTO_DE_TIPO: Record<string, Gesto> = { guardar: "guardar", enviar: "enviar", comentar: "comentar", seguir: "seguir" };
