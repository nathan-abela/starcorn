"use client";

import { useCallback, useState } from "react";
import type { FetchProgress, FetchStatus, GitHubRepo } from "@/types";
import { Download, Lock, Star, Zap } from "lucide-react";

import { fetchStarredRepos } from "@/lib/github";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { GitHubIcon } from "@/components/icons";
import { ProgressIndicator } from "@/components/progress-indicator";
import { RepoList } from "@/components/repo-list";
import { ThemeToggle } from "@/components/theme-toggle";
import { UsernameInput } from "@/components/username-input";

export default function Home() {
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [progress, setProgress] = useState<FetchProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPartial, setIsPartial] = useState(false);
  const [username, setUsername] = useState("");

  const handleFetch = useCallback(async (inputUsername: string) => {
    setUsername(inputUsername);
    setStatus("fetching");
    setRepos([]);
    setError(null);
    setIsPartial(false);
    setProgress({
      currentPage: 0,
      totalPages: 1,
      fetchedCount: 0,
      estimatedTotal: 0,
    });

    const result = await fetchStarredRepos(inputUsername, null, (p) => {
      setProgress(p);
    });

    const sortedRepos = [...result.repos].sort((a, b) => b.stargazers_count - a.stargazers_count);
    setRepos(sortedRepos);
    setIsPartial(result.isPartial);

    if (result.error && result.repos.length === 0) {
      setError(result.error);
      setStatus("error");
    } else if (result.error) {
      setError(result.error);
      setStatus("success");
    } else {
      setStatus("success");
    }
  }, []);

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

        <div className="mx-auto w-full max-w-xl">
          <UsernameInput onSubmit={handleFetch} isLoading={status === "fetching"} />
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
            <RepoList repos={repos} isPartial={isPartial} partialMessage={error || undefined} />
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
