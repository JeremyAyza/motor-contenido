import { twMerge } from "tailwind-merge";

/** Une clases dejando que las del agente ganen sobre las de la primitiva. */
export const cx = (...c: Array<string | false | null | undefined>) => twMerge(c.filter(Boolean).join(" "));
