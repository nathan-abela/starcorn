/**
 * Category matching system for GitHub repositories.
 *
 * Each repo is matched against category definitions using three signal types:
 * 1. **Topics** (score: 100) - GitHub topics assigned to the repo
 * 2. **Keywords** (score: 50) - Substring matches in repo name or description
 * 3. **Name patterns** (score: 25) - Patterns in the repo name (ex. "-cli", "ui-")
 *
 * When a repo matches multiple categories:
 * 1. Higher match type score wins (topic > keyword > namePattern)
 * 2. If tied, higher category priority wins (ex. AI at 10 beats DevTools at 6)
 * 3. If still tied, first match wins (alphabetical by category name)
 *
 * @notes
 * - Purpose-based: Categories describe what a project does, not what it's built with
 * - Conservative: Better to leave in Uncategorized than wrongly categorize
 * - No framework topics: Generic topics like "react", "vue", "nextjs" are ignored
 *   since they indicate "built with", not purpose
 *
 * @example
 * // A repo with topics ["ai", "cli"] and priority AI=10, DevTools=6
 * // Both match on topic (score 100), so priority breaks the tie -> AI wins
 *
 * @example
 * // A repo with topic ["cli"] and description containing "openai"
 * // DevTools matches on topic (100), AI matches on keyword (50) -> DevTools wins
 */

import type { GitHubRepo } from "@/types";

/**
 * Defines matching rules for a category.
 * @property topics - GitHub topics that match this category (exact match, case-insensitive)
 * @property keywords - Substrings to find in repo name or description
 * @property namePatterns - Patterns to match in repo name (ex. "-ui", "awesome-")
 * @property priority - Tiebreaker when match types are equal (higher wins)
 */
export interface CategoryDefinition {
  topics?: string[];
  keywords?: string[];
  namePatterns?: string[];
  priority?: number;
}

/** A category with its assigned repositories. */
export interface Category {
  name: string;
  repos: GitHubRepo[];
}

// prettier-ignore
export const CATEGORY_DEFINITIONS: Record<string, CategoryDefinition> = {
  "AI & Machine Learning": {
    topics: ["ai", "machine-learning", "deep-learning", "llm", "gpt", "nlp", "neural-network", "generative-ai", "computer-vision", "transformers"],
    keywords: ["machine-learning", "deep-learning", "neural", "openai", "anthropic", "langchain", "diffusion", "stable-diffusion", "image-generation", "text-generation", "llm", "chatgpt", "ollama"],
    namePatterns: ["-agent", "agent-", "-ai", "ai-"],
    priority: 10,
  },
  "Analytics & Monitoring": {
    topics: ["analytics", "monitoring", "observability", "metrics", "telemetry", "logging", "apm", "product-analytics", "web-analytics"],
    keywords: ["analytics", "monitoring", "metrics", "telemetry", "observability", "posthog", "plausible", "matomo", "sentry"],
    priority: 8,
  },
  "APIs & Backend": {
    topics: ["api", "backend", "server", "rest", "graphql", "rest-api", "http-server"],
    keywords: ["backend", "graphql", "endpoint", "express", "fastapi", "nestjs", "hono", "trpc", "http-framework"],
    priority: 6,
  },
  "Data & Visualization": {
    topics: ["data-visualization", "charts", "charting", "visualization", "plotting"],
    keywords: ["chart", "d3js", "plotly", "recharts", "visualization", "graph", "unovis"],
    priority: 6,
  },
  "Design Resources": {
    topics: ["icons", "svg", "fonts", "assets", "design-resources", "logos", "illustrations"],
    keywords: ["icons", "svg-icons", "fonts", "logo", "logos", "illustrations", "icon-pack"],
    namePatterns: ["-icons", "-assets"],
    priority: 7,
  },
  "Developer Tools": {
    topics: ["developer-tools", "devtools", "cli", "tooling", "productivity-tools", "developer-tool"],
    keywords: ["cli", "debug", "lint", "format", "editor", "terminal", "eslint", "prettier"],
    namePatterns: ["-cli"],
    priority: 6,
  },
  Documentation: {
    topics: ["documentation", "docs", "wiki", "awesome-list", "learning", "style-guide", "documentation-tool", "documentation-generator"],
    keywords: ["documentation", "styleguide", "style-guide", "tutorial", "awesome", "cheatsheet", "handbook", "guidelines"],
    namePatterns: ["awesome-", "-guide", "-styleguide", "-docs"],
    priority: 7,
  },
  "Infrastructure & DevOps": {
    topics: ["devops", "infrastructure", "ci-cd", "cloud", "deployment", "hosting", "kubernetes"],
    keywords: ["terraform", "ansible", "cicd", "github-actions", "jenkins", "k8s", "kubernetes", "docker-compose"],
    priority: 7,
  },
  Mobile: {
    topics: ["mobile", "ios", "android", "react-native", "flutter", "mobile-app"],
    keywords: ["react-native", "flutter", "swift", "kotlin", "expo"],
    priority: 8,
  },
  Presentations: {
    topics: ["presentation", "slides", "slideshow", "keynote"],
    keywords: ["presentation", "slides", "slideshow", "speaker", "slidev"],
    namePatterns: ["-slides", "-deck"],
    priority: 9,
  },
  Productivity: {
    topics: ["productivity", "automation", "workflow", "note-taking", "task-management"],
    keywords: ["automate", "workflow", "productivity", "todo", "note-taking", "whiteboard", "collaboration"],
    priority: 5,
  },
  "Runtime & Build Tools": {
    topics: ["runtime", "bundler", "compiler", "transpiler", "build-tool", "package-manager"],
    keywords: ["runtime", "bundler", "compiler", "transpiler", "esbuild", "webpack", "vite", "rollup", "parcel", "turbopack"],
    priority: 9,
  },
  Security: {
    topics: ["security", "cryptography", "authentication", "encryption", "cybersecurity", "pentesting", "auth"],
    keywords: ["security", "authentication", "encryption", "password", "oauth", "jwt", "auth", "2fa"],
    priority: 8,
  },
  "UI Components": {
    topics: ["ui", "components", "design-system", "component-library", "ui-components", "ui-library"],
    keywords: ["shadcn", "radix", "headless-ui", "ui-kit"],
    namePatterns: ["-ui", "-components", "ui-"],
    priority: 8,
  },
  Utilities: {
    topics: ["utility", "utilities", "toolkit", "tools"],
    keywords: ["pdf", "converter", "generator", "calculator", "invoice", "screenshot", "snippet"],
    namePatterns: ["-tool", "-utils", "-utility"],
    priority: 5,
  },
  Uncategorized: {
    priority: 0,
  },
};

/** The type of signal that caused a category match. */
type MatchType = "topic" | "keyword" | "namePattern" | "none";

interface MatchResult {
  category: string;
  matchType: MatchType;
  priority: number;
}

/**
 * Determines how a repo matches a category definition.
 * Checks in order: topics (strongest) -> keywords -> name patterns (weakest).
 * Returns the strongest match type found, or "none" if no match.
 */
function getMatchType(repo: GitHubRepo, definition: CategoryDefinition): MatchType {
  const repoTopics = repo.topics.map((t) => t.toLowerCase());
  const repoName = repo.name.toLowerCase();
  const repoDescription = (repo.description || "").toLowerCase();

  // Check topic matches (highest priority)
  if (definition.topics?.some((topic) => repoTopics.includes(topic))) {
    return "topic";
  }

  // Check keyword matches in name or description
  if (
    definition.keywords?.some(
      (keyword) => repoName.includes(keyword) || repoDescription.includes(keyword)
    )
  ) {
    return "keyword";
  }

  // Check name patterns
  if (definition.namePatterns?.some((pattern) => repoName.includes(pattern))) {
    return "namePattern";
  }

  return "none";
}

/** Converts match type to numeric score for comparison. */
function getMatchScore(matchType: MatchType): number {
  switch (matchType) {
    case "topic":
      return 100;
    case "keyword":
      return 50;
    case "namePattern":
      return 25;
    default:
      return 0;
  }
}

/**
 * Assigns a single repo to its best-matching category.
 * Collects all matching categories, then picks the winner based on:
 * 1. Match type score (topic=100, keyword=50, namePattern=25)
 * 2. Category priority (higher wins ties)
 */
function categorizeRepo(repo: GitHubRepo): string {
  const matches: MatchResult[] = [];

  for (const [categoryName, definition] of Object.entries(CATEGORY_DEFINITIONS)) {
    if (categoryName === "Uncategorized") continue;

    const matchType = getMatchType(repo, definition);
    if (matchType !== "none") {
      matches.push({
        category: categoryName,
        matchType,
        priority: definition.priority || 0,
      });
    }
  }

  if (matches.length === 0) {
    return "Uncategorized";
  }

  // Sort by: match type score (desc), then priority (desc)
  matches.sort((a, b) => {
    const scoreA = getMatchScore(a.matchType);
    const scoreB = getMatchScore(b.matchType);
    if (scoreA !== scoreB) return scoreB - scoreA;
    return b.priority - a.priority;
  });

  return matches[0].category;
}

/**
 * Categorizes a list of repos into purpose-based categories.
 * Returns all categories sorted alphabetically,
 * with Uncategorized always last.
 */
export function categorizeRepos(repos: GitHubRepo[]): Category[] {
  const categoryMap = new Map<string, GitHubRepo[]>();

  for (const categoryName of Object.keys(CATEGORY_DEFINITIONS)) {
    categoryMap.set(categoryName, []);
  }

  for (const repo of repos) {
    const category = categorizeRepo(repo);
    const existing = categoryMap.get(category) || [];
    existing.push(repo);
    categoryMap.set(category, existing);
  }

  const categories: Category[] = [];
  for (const [name, categoryRepos] of categoryMap) {
    if (name !== "Uncategorized") {
      categories.push({ name, repos: categoryRepos });
    }
  }

  categories.sort((a, b) => a.name.localeCompare(b.name));

  const uncategorized = categoryMap.get("Uncategorized") || [];
  categories.push({ name: "Uncategorized", repos: uncategorized });

  return categories;
}

/** Returns all category names defined in the system. */
export function getCategoryNames(): string[] {
  return Object.keys(CATEGORY_DEFINITIONS);
}

/** Filters repos by substring match on name or description. */
export function filterRepos(repos: GitHubRepo[], query: string): GitHubRepo[] {
  if (!query.trim()) return repos;

  const lowerQuery = query.toLowerCase();
  return repos.filter((repo) => {
    const name = repo.full_name.toLowerCase();
    const description = (repo.description || "").toLowerCase();
    return name.includes(lowerQuery) || description.includes(lowerQuery);
  });
}

export type SortOption =
  | "name-asc"
  | "name-desc"
  | "stars-desc"
  | "stars-asc"
  | "updated-desc"
  | "updated-asc"
  | "language";

export function sortRepos(repos: GitHubRepo[], sortOption: SortOption): GitHubRepo[] {
  const sorted = [...repos];

  switch (sortOption) {
    case "name-asc":
      return sorted.sort((a, b) => a.full_name.localeCompare(b.full_name));
    case "name-desc":
      return sorted.sort((a, b) => b.full_name.localeCompare(a.full_name));
    case "stars-desc":
      return sorted.sort((a, b) => b.stargazers_count - a.stargazers_count);
    case "stars-asc":
      return sorted.sort((a, b) => a.stargazers_count - b.stargazers_count);
    case "updated-desc":
      return sorted.sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    case "updated-asc":
      return sorted.sort(
        (a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
      );
    case "language":
      return sorted.sort((a, b) => {
        const langA = a.language || "zzz";
        const langB = b.language || "zzz";
        if (langA !== langB) return langA.localeCompare(langB);
        return b.stargazers_count - a.stargazers_count;
      });
    default:
      return sorted;
  }
}
