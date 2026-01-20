const isProd = process.env.NODE_ENV === "production";
const useGitHubPages = true;
const repoName = "starcorn";

export const basePath = isProd && useGitHubPages ? `/${repoName}` : "";

export function getAssetPath(path: string): string {
  return `${basePath}${path}`;
}
