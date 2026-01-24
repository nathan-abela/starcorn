import type { NextConfig } from "next";

import { REPO_NAME, USE_CUSTOM_DOMAIN } from "./src/config/site";

const isProd = process.env.NODE_ENV === "production";
const basePath = isProd && !USE_CUSTOM_DOMAIN ? `/${REPO_NAME}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath,
};

export default nextConfig;
