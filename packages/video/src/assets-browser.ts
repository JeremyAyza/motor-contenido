import * as lucide from "lucide-static";
import { staticFile } from "remotion";
import * as simpleIcons from "simple-icons";
import type { AssetSource, SimpleIconData } from "../../carousel/src/ui/assets.ts";

const pascal = (name: string) =>
  name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

let bySlug: Map<string, SimpleIconData> | null = null;

/**
 * The primitives' files inside Remotion: icons and logos come in the bundle;
 * images and objects come from the public folder that video:prepare fills
 * (content/<piece>/out/video/). Same errors as the carousel (assets-node.ts).
 */
export const browserAssets: AssetSource = {
  lucide(name) {
    const svg = (lucide as Record<string, unknown>)[pascal(name)];
    if (typeof svg !== "string") throw new Error(`No existe el ícono "${name}" en Lucide. Revisa los nombres en https://lucide.dev/icons`);
    return svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  },
  simpleIcon(slug) {
    bySlug ??= new Map(
      Object.values(simpleIcons as Record<string, unknown>)
        .filter((icon): icon is SimpleIconData => typeof icon === "object" && icon !== null && "slug" in icon && "path" in icon)
        .map((icon) => [icon.slug, icon]),
    );
    const icon = bySlug.get(slug);
    if (!icon) throw new Error(`No existe "${slug}" en Simple Icons. Busca el slug con: npm run carrusel:logo -- <marca>`);
    return icon;
  },
  image: (src) => staticFile(`piece/${src}`),
  object: (name, style) => staticFile(`objetos/${style === "3d" ? `${name}.3d.png` : `${name}.svg`}`),
};
