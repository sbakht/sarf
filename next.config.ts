import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone is for Docker/self-host. On Vercel + Next 16.3, adapter +
  // standalone fails in onBuildComplete (ENOENT next-server.js.nft.json).
  // https://github.com/vercel/next.js/issues/96646
  output: process.env.VERCEL ? undefined : "standalone",
};

export default nextConfig;
