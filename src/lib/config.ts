import { CUSTOM_DOMAIN_URL, GITHUB_PAGES_URL, REPO_NAME, USE_CUSTOM_DOMAIN } from "@/config/site";

const isProd = process.env.NODE_ENV === "production";

export const siteUrl = USE_CUSTOM_DOMAIN ? CUSTOM_DOMAIN_URL : GITHUB_PAGES_URL;

export const basePath = isProd && !USE_CUSTOM_DOMAIN ? `/${REPO_NAME}` : "";

export function getAssetPath(path: string): string {
  return `${basePath}${path}`;
}
