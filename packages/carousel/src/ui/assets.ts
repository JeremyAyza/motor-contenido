import { createContext, useContext } from "react";

/** A Simple Icons entry plus the path of its SVG. */
export type SimpleIconData = { title: string; slug: string; hex: string; source: string; guidelines?: string; path: string };

/**
 * Where the primitives read their files from. The carousel render reads the
 * disk (assets-node.ts) and the video reads what Remotion bundles and serves
 * (packages/video). Keeping file access behind this port is what lets the
 * same primitives run in Node and in the browser.
 */
export type AssetSource = {
  /** Inner markup of a Lucide icon, without the <svg> tag. */
  lucide(name: string): string;
  simpleIcon(slug: string): SimpleIconData;
  /** URL of an image of the piece; `src` is relative to the piece folder. */
  image(src: string): string;
  /** URL of an object from assets/objetos. */
  object(name: string, style: "color" | "3d"): string;
};

export const AssetContext = createContext<AssetSource | null>(null);

export function useAssets(): AssetSource {
  const assets = useContext(AssetContext);
  if (!assets) throw new Error("Las primitivas necesitan un AssetContext: lo ponen el render del carrusel y el del video");
  return assets;
}
