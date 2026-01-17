import type { GitHubRepo } from "@/types";

export interface CategoryDefinition {
  topics?: string[];
  keywords?: string[];
  namePatterns?: string[];
  priority?: number; // Higher = more specific, wins conflicts
}

export interface Category {
  name: string;
  repos: GitHubRepo[];
}

export const CATEGORY_DEFINITIONS: Record<string, CategoryDefinition> = {
  // prettier-ignore
  "AI & Machine Learning": {
    topics: ["ai", "machine-learning", "deep-learning", "llm", "gpt", "nlp", "neural-network", "generative-ai"],
    keywords: ["machine-learning", "deep-learning", "neural", "openai", "anthropic", "langchain", "diffusion", "stable-diffusion", "image-generation", "text-generation"],
    namePatterns: ["-agent", "agent-", "-ai", "ai-"],
    priority: 10,
  },
  "UI Components": {
    topics: ["ui", "components", "design-system", "component-library", "ui-components"],
    keywords: ["shadcn", "radix", "headless-ui"],
    namePatterns: ["-ui", "-components", "ui-"],
    priority: 8,
  },
  "Web Frameworks": {
    topics: ["framework", "react", "vue", "svelte", "nextjs", "nuxtjs", "web-framework"],
    keywords: ["remix", "astro", "angular", "solidjs"],
    priority: 7,
  },
  "APIs & Backend": {
    topics: ["api", "backend", "server", "rest", "graphql", "rest-api"],
    keywords: ["backend", "graphql", "endpoint", "express", "fastapi", "nestjs"],
    priority: 6,
  },
  "Infrastructure & DevOps": {
    topics: ["devops", "docker", "kubernetes", "infrastructure", "ci-cd", "cloud"],
    keywords: ["docker", "k8s", "kubernetes", "deploy", "terraform", "ansible", "cicd"],
    priority: 7,
  },
  "Data & Visualization": {
    topics: ["data", "visualization", "charts", "analytics", "database", "data-visualization"],
    keywords: ["chart", "analytics", "dashboard", "d3js", "plotly", "recharts"],
    priority: 6,
  },
  Mobile: {
    topics: ["mobile", "ios", "android", "react-native", "flutter", "mobile-app"],
    keywords: ["react-native", "flutter", "swift", "kotlin", "expo"],
    priority: 7,
  },
  "Developer Tools": {
    topics: ["developer-tools", "devtools", "cli", "tooling", "productivity-tools"],
    keywords: ["cli", "debug", "lint", "format", "editor", "terminal", "pdf", "converter", "screenshot", "snippet"], // prettier-ignore
    namePatterns: ["-cli", "-tool"],
    priority: 6,
  },
  Documentation: {
    topics: ["documentation", "docs", "wiki", "awesome-list", "learning", "style-guide"],
    keywords: ["documentation", "styleguide", "style-guide", "tutorial", "awesome", "cheatsheet", "handbook", "guidelines"], // prettier-ignore
    namePatterns: ["awesome-", "-guide", "-styleguide"],
    priority: 5,
  },
  Productivity: {
    topics: ["productivity", "automation", "workflow"],
    keywords: ["automate", "workflow", "productivity", "todo", "note-taking"],
    priority: 4,
  },
  Security: {
    topics: ["security", "cryptography", "authentication", "privacy", "encryption"],
    keywords: ["security", "authentication", "encryption", "password", "oauth", "jwt"],
    priority: 8,
  },
  Uncategorized: {
    priority: 0,
  },
};

type MatchType = "topic" | "keyword" | "namePattern" | "none";

interface MatchResult {
  category: string;
  matchType: MatchType;
  priority: number;
}

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

export function categorizeRepos(repos: GitHubRepo[]): Category[] {
  const categoryMap = new Map<string, GitHubRepo[]>();

  // Initialize all categories (including empty ones)
  for (const categoryName of Object.keys(CATEGORY_DEFINITIONS)) {
    categoryMap.set(categoryName, []);
  }

  // Categorize each repo
  for (const repo of repos) {
    const category = categorizeRepo(repo);
    const existing = categoryMap.get(category) || [];
    existing.push(repo);
    categoryMap.set(category, existing);
  }

  // Convert to array, sorted alphabetically, with Uncategorized last
  const categories: Category[] = [];
  for (const [name, categoryRepos] of categoryMap) {
    if (name !== "Uncategorized") {
      categories.push({ name, repos: categoryRepos });
    }
  }

  categories.sort((a, b) => a.name.localeCompare(b.name));

  // Add Uncategorized at the end
  const uncategorized = categoryMap.get("Uncategorized") || [];
  categories.push({ name: "Uncategorized", repos: uncategorized });

  return categories;
}

export function getCategoryNames(): string[] {
  return Object.keys(CATEGORY_DEFINITIONS);
}

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
