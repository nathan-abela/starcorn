import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const useGitHubPages = false;
const repoName = "starcorn";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: isProd && useGitHubPages ? `/${repoName}` : "",
  assetPrefix: isProd && useGitHubPages ? `/${repoName}` : "",
};

export default nextConfig;
