"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { FetchProgress, FetchStatus, GitHubRepo, RateLimitInfo } from "@/types";
import { Download, Lock, Star, Zap } from "lucide-react";

import {
  categorizeRepos,
  filterRepos,
  sortRepos,
  type Category,
  type SortOption,
} from "@/lib/categories";
import { fetchStarredRepos } from "@/lib/github";
import { CategoryGrid } from "@/components/category-grid";
import { CategorySection } from "@/components/category-section";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { FilterControls } from "@/components/filter-controls";
import { GitHubIcon } from "@/components/icons";
import { ProgressIndicator } from "@/components/progress-indicator";
import { RateLimitIndicator } from "@/components/rate-limit-indicator";
import { ThemeToggle } from "@/components/theme-toggle";
import { TokenInput } from "@/components/token-input";
import { UsernameInput } from "@/components/username-input";

export default function Home() {
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [progress, setProgress] = useState<FetchProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPartial, setIsPartial] = useState(false);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [requiresToken, setRequiresToken] = useState(false);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("stars-desc");
  const categorySectionRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => categorizeRepos(repos), [repos]);

  const filteredCategories = useMemo((): Category[] => {
    return categories.map((cat) => ({
      ...cat,
      repos: sortRepos(filterRepos(cat.repos, searchQuery), sortOption),
    }));
  }, [categories, searchQuery, sortOption]);

  const allReposFiltered = useMemo(() => {
    return sortRepos(filterRepos(repos, searchQuery), sortOption);
  }, [repos, searchQuery, sortOption]);

  const selectedCategoryData = useMemo(() => {
    if (selectedCategory === null) {
      return { name: "All", repos: allReposFiltered };
    }
    return filteredCategories.find((cat) => cat.name === selectedCategory) || null;
  }, [filteredCategories, selectedCategory, allReposFiltered]);

  const handleCategorySelect = useCallback((categoryName: string) => {
    if (categoryName === "__all__") {
      setSelectedCategory(null);
    } else {
      setSelectedCategory((prev) => (prev === categoryName ? null : categoryName));
    }
    setTimeout(() => {
      categorySectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  const handleFetch = useCallback(
    async (inputUsername: string) => {
      setUsername(inputUsername);
      setStatus("fetching");
      setRepos([]);
      setError(null);
      setIsPartial(false);
      setRequiresToken(false);
      setSelectedCategory(null);
      setSearchQuery("");
      setProgress({
        currentPage: 0,
        totalPages: 1,
        fetchedCount: 0,
        estimatedTotal: 0,
      });

      const result = await fetchStarredRepos(inputUsername, token, (p) => {
        setProgress(p);
      });

      setRepos(result.repos);
      setIsPartial(result.isPartial);
      setRateLimit(result.rateLimit);

      if (result.requiresToken) {
        setRequiresToken(true);
      }

      if (result.error && result.repos.length === 0) {
        setError(result.error);
        setStatus("error");
      } else if (result.error) {
        setError(result.error);
        setStatus("success");
      } else {
        setStatus("success");
      }
    },
    [token]
  );

  const handleRetry = () => {
    if (username) {
      handleFetch(username);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4">
        <nav className="mb-8 flex items-center justify-between">
          <a
            href="https://github.com/nathan-abela/starcorn"
            target="_blank"
            rel="noopener noreferrer"
            className="border-border/50 bg-background/50 text-muted-foreground hover:border-primary/50 hover:text-primary inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition-colors"
          >
            <GitHubIcon className="h-4 w-4" />
            <span className="sr-only">View source on GitHub</span>
          </a>
          <ThemeToggle />
        </nav>

        <header className="mb-12 text-center">
          <div className="border-primary/20 bg-primary/5 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm">
            <Star className="h-4 w-4" />
            No authentication required
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            <span className="from-foreground via-foreground to-primary bg-gradient-to-r bg-clip-text text-transparent">
              starcorn
            </span>
          </h1>

          <p className="text-muted-foreground mx-auto mt-4 max-w-lg text-lg">
            Organize and export your GitHub starred repositories.
            <br />
            <span className="text-foreground/80">Zero auth. Fully private. Instant.</span>
          </p>
        </header>

        <div className="mx-auto w-full max-w-xl space-y-4">
          <UsernameInput onSubmit={handleFetch} isLoading={status === "fetching"} />

          <div className="flex items-start justify-between gap-4">
            <TokenInput
              onTokenChange={setToken}
              disabled={status === "fetching"}
              required={requiresToken}
            />
            {rateLimit && <RateLimitIndicator rateLimit={rateLimit} />}
          </div>
        </div>

        {status === "idle" && (
          <div className="mx-auto mt-16 grid max-w-3xl gap-4 sm:grid-cols-3">
            <FeatureCard
              icon={<Lock className="h-5 w-5" />}
              title="100% Private"
              description="Data stays in your browser. Nothing is stored or sent anywhere."
            />
            <FeatureCard
              icon={<Download className="h-5 w-5" />}
              title="Export Formats"
              description="Download as Markdown, JSON, or CSV for your workflow."
            />
            <FeatureCard
              icon={<Zap className="h-5 w-5" />}
              title="Instant Results"
              description="Just enter a username. No signup, no OAuth, no friction."
            />
          </div>
        )}

        <div className="mt-8 flex w-full flex-col items-center gap-8">
          {status === "fetching" && progress && <ProgressIndicator progress={progress} />}

          {status === "error" && error && <ErrorState message={error} onRetry={handleRetry} />}

          {status === "success" && repos.length === 0 && <EmptyState username={username} />}

          {status === "success" && repos.length > 0 && (
            <div className="w-full space-y-8">
              {isPartial && error && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200/90">
                  <span>{error}</span>
                </div>
              )}

              <div className="text-muted-foreground text-sm">
                {repos.length} {repos.length === 1 ? "repository" : "repositories"} across{" "}
                {categories.filter((c) => c.repos.length > 0).length} categories
              </div>

              <FilterControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortOption={sortOption}
                onSortChange={setSortOption}
              />

              <CategoryGrid
                categories={filteredCategories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                totalRepos={allReposFiltered.length}
              />

              {selectedCategoryData && (
                <CategorySection ref={categorySectionRef} category={selectedCategoryData} />
              )}
            </div>
          )}
        </div>

        <footer className="text-muted-foreground mt-auto pt-16 text-center text-sm">
          <p>
            Data fetched directly from{" "}
            <a
              href="https://docs.github.com/en/rest/activity/starring"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 underline-offset-4 hover:underline"
            >
              GitHub API
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group border-border/50 bg-card/50 hover:border-border hover:bg-card rounded-xl border p-5 transition-colors">
      <div className="bg-primary/10 text-primary mb-3 inline-flex rounded-lg p-2">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    </div>
  );
}
