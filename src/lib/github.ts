import type { FetchProgress, FetchResult, GitHubRepo, RateLimitInfo } from "@/types";

const GITHUB_API_BASE = "https://api.github.com";
const PER_PAGE = 30;

function parseRateLimitHeaders(headers: Headers): RateLimitInfo | undefined {
  const remaining = headers.get("X-RateLimit-Remaining");
  const limit = headers.get("X-RateLimit-Limit");
  const reset = headers.get("X-RateLimit-Reset");

  if (remaining && limit && reset) {
    return {
      remaining: parseInt(remaining, 10),
      limit: parseInt(limit, 10),
      resetAt: new Date(parseInt(reset, 10) * 1000),
    };
  }
  return undefined;
}

function parseLinkHeader(linkHeader: string | null): { lastPage: number } {
  if (!linkHeader) return { lastPage: 1 };

  const links = linkHeader.split(",");
  for (const link of links) {
    const match = link.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="last"/);
    if (match) {
      return { lastPage: parseInt(match[1], 10) };
    }
  }
  return { lastPage: 1 };
}

export function validateUsername(username: string): string | null {
  if (!username.trim()) {
    return "Please enter a username";
  }

  if (username.startsWith("-")) {
    return "Username cannot start with a hyphen";
  }

  if (!/^[a-zA-Z0-9-]+$/.test(username)) {
    return "Username can only contain letters, numbers, and hyphens";
  }

  if (username.length > 39) {
    return "Username is too long";
  }

  return null;
}

export async function fetchStarredRepos(
  username: string,
  token: string | null,
  onProgress: (progress: FetchProgress) => void,
  signal?: AbortSignal
): Promise<FetchResult> {
  const repos: GitHubRepo[] = [];
  let currentPage = 1;
  let totalPages = 1;
  let estimatedTotal = 0;
  let rateLimit: RateLimitInfo | undefined;

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const firstResponse = await fetch(
      `${GITHUB_API_BASE}/users/${username}/starred?per_page=${PER_PAGE}&page=1`,
      { headers, signal }
    );

    rateLimit = parseRateLimitHeaders(firstResponse.headers);

    if (!firstResponse.ok) {
      if (firstResponse.status === 404) {
        return {
          repos: [],
          isPartial: false,
          error: "Oops! We couldn't find that user. Double-check the username?",
          rateLimit,
        };
      }
      if (firstResponse.status === 403) {
        if (rateLimit?.remaining === 0) {
          return {
            repos: [],
            isPartial: false,
            error: "Rate limit exceeded. Add a GitHub token to continue, or wait a bit.",
            requiresToken: true,
            rateLimit,
          };
        }
        return {
          repos: [],
          isPartial: false,
          error: "Access denied. The user's stars may be private.",
          rateLimit,
        };
      }
      return {
        repos: [],
        isPartial: false,
        error: `GitHub API error: ${firstResponse.status}`,
        rateLimit,
      };
    }

    const linkHeader = firstResponse.headers.get("Link");
    const { lastPage } = parseLinkHeader(linkHeader);
    totalPages = lastPage;
    estimatedTotal = lastPage * PER_PAGE;

    const firstPageData: GitHubRepo[] = await firstResponse.json();
    const publicRepos = firstPageData.filter((repo) => !repo.private);
    repos.push(...publicRepos);

    onProgress({
      currentPage: 1,
      totalPages,
      fetchedCount: repos.length,
      estimatedTotal,
    });

    if (totalPages > 1 && !token && estimatedTotal > 500) {
      return {
        repos,
        isPartial: true,
        error: `This user has ~${estimatedTotal} stars. Add a token to fetch them all.`,
        requiresToken: true,
        estimatedTotal,
        rateLimit,
      };
    }

    for (currentPage = 2; currentPage <= totalPages; currentPage++) {
      if (signal?.aborted) {
        return {
          repos,
          isPartial: true,
          error: "Fetch cancelled",
          rateLimit,
        };
      }

      const response = await fetch(
        `${GITHUB_API_BASE}/users/${username}/starred?per_page=${PER_PAGE}&page=${currentPage}`,
        { headers, signal }
      );

      rateLimit = parseRateLimitHeaders(response.headers);

      if (!response.ok) {
        if (response.status === 403) {
          return {
            repos,
            isPartial: true,
            error: `Rate limit hit after ${repos.length} stars. Add a token to continue.`,
            requiresToken: true,
            estimatedTotal,
            rateLimit,
          };
        }
        return {
          repos,
          isPartial: true,
          error: `Error on page ${currentPage}. Showing ${repos.length} stars fetched so far.`,
          rateLimit,
        };
      }

      const pageData: GitHubRepo[] = await response.json();
      const publicPageRepos = pageData.filter((repo) => !repo.private);
      repos.push(...publicPageRepos);

      onProgress({
        currentPage,
        totalPages,
        fetchedCount: repos.length,
        estimatedTotal,
      });
    }

    return {
      repos,
      isPartial: false,
      rateLimit,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        repos,
        isPartial: true,
        error: "Fetch cancelled",
        rateLimit,
      };
    }

    return {
      repos,
      isPartial: repos.length > 0,
      error:
        repos.length > 0
          ? `Connection lost. Showing ${repos.length} stars fetched so far.`
          : "Connection lost. Check your internet and try again.",
      rateLimit,
    };
  }
}
