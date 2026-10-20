// Types for what webpack (inside Remotion) provides.

interface ImportMeta {
  webpackContext(
    request: string,
    options?: { recursive?: boolean; regExp?: RegExp; mode?: "sync" | "eager" | "weak" | "lazy" | "lazy-once" },
  ): {
    keys(): string[];
    (id: string): unknown;
  };
}

declare module "*.css";
