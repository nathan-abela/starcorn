export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
  updated_at: string;
  fork: boolean;
  private: boolean;
}

export interface FetchProgress {
  currentPage: number;
  totalPages: number;
  fetchedCount: number;
  estimatedTotal: number;
}

export interface RateLimitInfo {
  remaining: number;
  limit: number;
  resetAt: Date;
}

export interface FetchResult {
  repos: GitHubRepo[];
  isPartial: boolean;
  error?: string;
  requiresToken?: boolean;
  estimatedTotal?: number;
  rateLimit?: RateLimitInfo;
}

export type FetchStatus = "idle" | "fetching" | "success" | "error";
