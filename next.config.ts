import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: emit a fully static site into `out/` (portable to any host).
  output: "export",
  // The default image optimizer needs a server; disable it for static export.
  images: { unoptimized: true },
};

export default nextConfig;
