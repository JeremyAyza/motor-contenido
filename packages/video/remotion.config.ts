import { resolve } from "node:path";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

// Remotion settings for this repo. The npm run video:* commands run from the repo root.
Config.setVideoImageFormat("jpeg");
// BT.709 in limited range (yuv420p), what phones and Instagram expect. With
// the "default" color space, JPEG frames come out as full-range yuvj420p.
Config.setPixelFormat("yuv420p");
Config.setColorSpace("bt709");
Config.setOverwriteOutput(true);
// The effects of @remotion/effects use WebGL.
Config.setChromiumOpenGlRenderer("angle");

Config.overrideWebpackConfig((config) => {
  const withTailwind = enableTailwind(config);
  return {
    ...withTailwind,
    resolve: {
      ...withTailwind.resolve,
      alias: {
        ...(withTailwind.resolve?.alias as Record<string, string> | undefined),
        "@motor/ui": resolve("packages/carousel/src/ui/index.tsx"),
        "@motor/video": resolve("packages/video/src/kit/index.ts"),
      },
    },
  };
});
